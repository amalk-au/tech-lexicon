# Update Raspberry Pi Firmware

Overall, updating your Raspberry Pi 4's firmware is simple and straightforward. The steps are as follows:

1.  Ensure you're connected to a stable internet connection.

2.  Check what version of firmware your Pi 4 is running to see if you need to update it. Open a terminal and run:

    ```bash
    sudo rpi-eeprom-update
    ```

3.  If an update is required, install the latest software for the Raspberry Pi 4:

    ```bash
    sudo apt upgrade
    ```

    After that has completed, run:

    ```bash
    sudo apt full-upgrade
    ```

4.  Update and install the latest firmware:

    ```bash
    sudo apt install rpi-eeprom
    ```

5.  Once the installation process has finished, reboot the Pi:

    ```bash
    sudo reboot
    ```

---

## Updating the EEPROM Configuration

The boot behaviour, such as **SD card or USB boot**, is controlled by a configuration file embedded in the EEPROM image. This configuration can be modified using the `rpi-eeprom-config` tool.

See the **Bootloader Configuration** sections for details of the available configuration options.

## Reading the Current EEPROM Configuration

To view the configuration used by the current bootloader during the last boot, run:

```bash
rpi-eeprom-config
```

Alternatively:

```bash
vcgencmd bootloader_config
```

## Reading the Configuration from an EEPROM Image

To read the configuration from an EEPROM image:

```bash
rpi-eeprom-config pieeprom.bin
```

## Editing the Current Bootloader Configuration

The following command loads the current EEPROM configuration into a text editor:

```bash
sudo -E rpi-eeprom-config --edit
```

When the editor is closed, `rpi-eeprom-config` applies the updated configuration to the latest available EEPROM release and uses `rpi-eeprom-update` to schedule an update when the system is rebooted.

Reboot the Pi:

```bash
sudo reboot
```

If the updated configuration is identical to the existing configuration or is empty, no changes are made.

The editor is selected by the `EDITOR` environment variable.

## Applying a Saved Configuration

The following command applies `boot.conf` to the latest available EEPROM image and uses `rpi-eeprom-update` to schedule an update when the system is rebooted:

```bash
sudo rpi-eeprom-config --apply boot.conf
```

Then reboot:

```bash
sudo reboot
```

---

## Automatic Updates

The `rpi-eeprom-update` systemd service runs at startup and applies an update if a new image is available. It automatically migrates the current bootloader configuration.

### Disable Automatic Updates

```bash
sudo systemctl mask rpi-eeprom-update
```

### Re-enable Automatic Updates

```bash
sudo systemctl unmask rpi-eeprom-update
```

> **Note:**
> If the `FREEZE_VERSION` bootloader EEPROM configuration is set, the EEPROM update service will skip automatic updates. This removes the need to individually disable the EEPROM update service if there are multiple operating systems installed or when swapping SD cards.

---

# `rpi-eeprom-update`

Raspberry Pi OS uses the `rpi-eeprom-update` script to implement an automatic update service.

The script can also be run interactively or wrapped to create a custom bootloader update service.

## Reading the Current EEPROM Version

```bash
vcgencmd bootloader_version
```

## Check if an Update Is Available

```bash
sudo rpi-eeprom-update
```

## Install the Update

```bash
sudo rpi-eeprom-update -a
```

Then reboot:

```bash
sudo reboot
```

## Cancel a Pending Update

```bash
sudo rpi-eeprom-update -r
```

## Installing a Specific Bootloader EEPROM Image

```bash
sudo rpi-eeprom-update -d -f pieeprom.bin
```

The `-d` flag instructs `rpi-eeprom-update` to use the configuration in the specified image file instead of automatically migrating the current configuration.

## Display the Built-in Documentation

```bash
rpi-eeprom-update -h
```

---

# Bootloader Release Status

The firmware release status corresponds to a particular subdirectory of bootloader firmware images:

```text
/lib/firmware/raspberrypi/bootloader/...
```

The release status can be changed to select a different release stream.

| Release | Description |
| --- | --- |
| `default` | Updated for new hardware support, critical bug fixes, and periodic updates for new features that have been tested via the latest release. |
| `latest` | Updated when new features have been successfully beta tested. |
| `beta` | New or experimental features are tested here first. |

Since the release status string is simply a subdirectory name, it is possible to create your own release streams, such as a pinned release or custom network boot configuration.

> **Note:**
> `default` and `latest` are symbolic links to the older release names `critical` and `stable`.

## Changing the Bootloader Release

> **Note:**
> You can change which release stream is used during an update by editing:
>
> ```text
> /etc/default/rpi-eeprom-update
> ```
>
> Change the `FIRMWARE_RELEASE_STATUS` entry to the appropriate release stream.

---

# Updating the Bootloader Configuration in an EEPROM Image File

The following command replaces the bootloader configuration in `pieeprom.bin` with `boot.conf` and writes the new image to `new.bin`:

```bash
rpi-eeprom-config --config boot.conf --out new.bin pieeprom.bin
```

---

# `recovery.bin`

At power-on, the BCM2711 ROM looks for a file called `recovery.bin` in the root directory of the boot partition on the SD card.

If a valid `recovery.bin` is found, the ROM executes it instead of the contents of the EEPROM.

This mechanism ensures that the bootloader EEPROM can always be reset to a valid image with factory-default settings.

See also:

-   Raspberry Pi 4 boot flow

-   Bootloader configuration

---

# EEPROM Update Files

The following files are used during EEPROM recovery and updates:

| Filename | Purpose |
| --- | --- |
| `recovery.bin` | Bootloader EEPROM recovery executable |
| `pieeprom.upd` | Bootloader EEPROM image |
| `pieeprom.bin` | Bootloader EEPROM image — same as `pieeprom.upd`, but changes `recovery.bin` behaviour |
| `pieeprom.sig` | SHA-256 checksum of the bootloader image (`pieeprom.upd` / `pieeprom.bin`) |
| `vl805.bin` | VLI805 USB firmware EEPROM image — ignored on 1.4 and later board revisions that do not have a dedicated VLI EEPROM |
| `vl805.sig` | SHA-256 checksum of `vl805.bin` |

## Update Behaviour

-   If the bootloader update image is called `pieeprom.upd`, `recovery.bin` is renamed to `recovery.000` once the update has completed, and the system is rebooted.

    Since `recovery.bin` is no longer present, the ROM loads the newly updated bootloader from EEPROM and the OS boots normally.

-   If the bootloader update image is called `pieeprom.bin`, `recovery.bin` will stop after the update has completed.

    -   **Successful update:** HDMI output is green and the green activity LED flashes rapidly.

    -   **Failed update:** HDMI output is red and an error code is displayed via the activity LED.

-   The `.sig` files contain the hexadecimal SHA-256 checksum of the corresponding image file. Additional fields may be added in the future.

-   The BCM2711 ROM does not support loading `recovery.bin` from USB mass storage or TFTP.

    Instead, newer versions of the bootloader support a self-update mechanism where the bootloader can reflash the EEPROM itself. See `ENABLE_SELF_UPDATE` on the bootloader configuration page.

-   Temporary EEPROM update files are automatically deleted by the `rpi-eeprom-update` service at startup.

For more information about the `rpi-eeprom-update` configuration file:

```bash
rpi-eeprom-update -h
```

---

# EEPROM Write Protection

Both the bootloader and VLI EEPROMs support hardware write protection.

See the `eeprom_write_protect` option for more information about how to enable write protection when flashing the EEPROMs.

