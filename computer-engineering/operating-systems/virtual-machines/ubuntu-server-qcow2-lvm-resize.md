# Resize an Ubuntu Server QCOW2 Disk (KVM/libvirt + LVM)

A reference for growing an Ubuntu Server VM's virtual disk **and** making the added space available to its ext4 root filesystem. Examples assume growing 64Gib file system to a 128Gib with Ubuntu Server installed named `ubuntu-server-lab`.

> **VM:** `ubuntu-server-lab` · **Host image:** `/var/lib/libvirt/images/ubuntu-server-lab.qcow2` · **Target:** 128 GiB

## Storage layout

From `lsblk -f` and `df -hT` inside the VM:

| Layer               | Device                     | Filesystem / role                       |
| ------------------- | -------------------------- | --------------------------------------- |
| Virtual disk        | `/dev/vda`                 | QCOW2-backed disk; target 128 GiB       |
| EFI partition       | `/dev/vda1`                | FAT32, mounted at `/boot/efi`           |
| Boot partition      | `/dev/vda2`                | ext4, mounted at `/boot` (~2 GiB)       |
| LVM partition       | `/dev/vda3`                | LVM physical volume (PV)                |
| Volume group (VG)   | `ubuntu-vg`                | Contains the root logical volume        |
| Logical volume (LV) | `/dev/ubuntu-vg/ubuntu-lv` | ext4, mounted at `/` (currently 60 GiB) |

The complete growth path is:

```text
QCOW2 image → /dev/vda → /dev/vda3 → LVM PV → ubuntu-vg → ubuntu-lv → ext4 (/)
```

**Important:** Resizing a QCOW2 image alone does **not** grow its partitions, LVM volumes, or filesystem.

## 1. Host: grow the QCOW2 image

Run this section on the **Ubuntu host**, not inside the VM.

> **Safety:** Back up the VM and verify which file is attached. Shut down the VM fully before modifying the image with `qemu-img`. Inspect any snapshot/backing-file chain before changing the image. Never modify a disk image that is in use.

- Identify the VM: `sudo virsh list --all`
- Confirm which image is attached: `sudo virsh domblklist ubuntu-server-lab`
- Then shut down the VM : `sudo virsh shutdown ubuntu-server-lab`
- Verify : `sudo virsh domstate ubuntu-server-lab` expected : `shut off`

```bash
# Confirm the disk image attached to this VM.
sudo virsh domblklist ubuntu-server-lab

# Shut down and check for the 'shut off' state.
sudo virsh shutdown ubuntu-server-lab
sudo virsh domstate ubuntu-server-lab

# Inspect the image and free space on the host.
sudo qemu-img info /var/lib/libvirt/images/ubuntu-server-lab.qcow2
df -h /var/lib/libvirt/images

# Set the TOTAL virtual capacity to 128 GiB (not +128 GiB).
sudo qemu-img resize -f qcow2 /var/lib/libvirt/images/ubuntu-server-lab.qcow2 128G

# Confirm the new virtual size, then start the VM.
sudo qemu-img info /var/lib/libvirt/images/ubuntu-server-lab.qcow2
sudo virsh start ubuntu-server-lab
```

`128G` sets the **total** virtual disk capacity to 128 GiB; `+128G` would **add** 128 GiB to the existing size.

## 2. Guest: check the actual disk and LVM sizes

All remaining commands run **inside Ubuntu Server**, not on the host.

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
df -hT /
sudo pvs
sudo vgs
sudo lvs
```

**Before continuing, verify:**

- `/dev/vda` reports approximately **128G**. (`lsblk -f` does not show disk sizes.)
- `/dev/vda3` is the LVM physical-volume partition.
- The root logical volume is `/dev/ubuntu-vg/ubuntu-lv` and is formatted as **ext4**.

If `/dev/vda` still reports 64G, reboot the guest and check again. If it still does not report 128G, verify the image and disk assignment on the host **before** changing any partitions.

## 3. Guest: expand partition 3

Install the utility if necessary:

```bash
sudo apt update
sudo apt install -y cloud-guest-utils
```

Inspect the proposed partition change (dry run):

```bash
sudo growpart -N /dev/vda 3
```

Expand the LVM partition into the unallocated space at the end of the disk:

```bash
sudo growpart /dev/vda 3
```

Confirm that the partition is now larger:

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

If the kernel cannot reread the updated partition table, **reboot the guest** and verify `/dev/vda3` has the larger size before continuing. `NOCHANGE` can be normal if partition 3 already occupies all available disk space.

## 4. Guest: grow the LVM physical volume

Make the expanded space in `/dev/vda3` available to LVM:

```bash
sudo pvresize /dev/vda3
sudo pvs
sudo vgs
```

The `VFree` column in `sudo vgs` should now show newly available space (unless it had already been allocated).

## 5. Guest: grow the root logical volume and ext4 filesystem

Use all free extents in `ubuntu-vg` for the root volume:

```bash
sudo lvextend -l +100%FREE -r /dev/ubuntu-vg/ubuntu-lv
```

- `-l +100%FREE` allocates **all currently unallocated space in the volume group** to this logical volume.
- `-r` (**`--resizefs`**) expands the filesystem too, so a separate `resize2fs` is **not** needed when it succeeds.
- This command can usually grow a mounted ext4 root filesystem online.

> **Alternative:** To keep free space in `ubuntu-vg` for future logical volumes, allocate a specific amount instead (for example, `sudo lvextend -L +40G -r /dev/ubuntu-vg/ubuntu-lv`). Don't run both alternatives.

## 6. Verify the result

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
sudo pvs
sudo vgs
sudo lvs
df -hT /
```

The root filesystem (`/`) should now be **much larger than 60 GiB**, approximately **124–125 GiB** depending on partition sizes, LVM alignment, and filesystem overhead. It will be slightly smaller than the 128 GiB virtual disk because `/boot`, `/boot/efi`, and partition/filesystem metadata use space.

The previously reported usage was:

```text
Filesystem                        Type  Size  Used  Avail  Use%
/dev/mapper/ubuntu--vg-ubuntu--lv ext4   60G   43G    15G   75%
```

The **43 GiB of existing data should remain intact**; the available space should increase after the resize. Take a backup beforehand because partition changes still carry risk.

## Troubleshooting and notes

| Symptom                                    | Check / action                                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `/dev/vda` is still 64G                    | Reboot the guest; verify the active disk image and its `qemu-img info` virtual size on the host.            |
| `growpart: command not found`              | `sudo apt install cloud-guest-utils`                                                                        |
| `growpart` reports `NOCHANGE`              | The partition may already occupy all free space. Inspect `lsblk` and continue to `pvresize` if appropriate. |
| `pvresize` succeeds but the LV stays 60G   | Run the `lvextend ... -r` command and verify `sudo vgs` shows free space first.                             |
| `lvextend` reports no free extents         | Inspect `sudo pvs`, `sudo vgs`, and `lsblk` to identify which layer has not been enlarged.                  |
| Numerous `/dev/loop*` mounts show 100% use | Normal for read-only Snap squashfs images; unrelated to root filesystem capacity.                           |

**Remember:** The QCOW2 image is generally thin provisioned. **128 GiB of virtual capacity does not mean 128 GiB is immediately used on the host.** Keep enough real host-disk space available as the guest writes data. Growing is considerably simpler than shrinking; do not attempt to shrink an LVM-backed QCOW2 disk by simply reducing the image size.

## Official references

- [QEMU: `qemu-img` (offline image resize and safety guidance)](https://www.qemu.org/docs/master/tools/qemu-img.html)
- [Ubuntu: `growpart` manual](https://manpages.ubuntu.com/manpages/resolute/man1/growpart.1.html)
- [Ubuntu: `pvresize` manual](https://manpages.ubuntu.com/manpages/noble/man8/pvresize.8.html)
- [Ubuntu: `lvextend` manual](https://manpages.ubuntu.com/manpages/resolute/man8/lvextend.8.html)
