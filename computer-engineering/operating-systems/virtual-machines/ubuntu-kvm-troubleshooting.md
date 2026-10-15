# Troubleshooting High CPU Usage, Heat, and Fan Noise with Ubuntu KVM

A practical reference for an Ubuntu host running an Ubuntu guest through KVM/libvirt. Commands are labelled **Host** or **Guest** so changes are made on the intended system.

This guide uses generic examples and placeholders. It contains no original terminal output, screenshots, usernames, hostnames, personal paths, or device specifications. Replace placeholders such as `PID`, `PARENT_PID`, `VM_NAME`, `SERVICE_NAME`, and `CHANGE_ID` before running those commands.

## 1. Start with a controlled comparison

1. Observe the host with the VM shut down.
2. Start the VM and allow startup tasks to settle.
3. Pause builds, tests, agents, browsers, and development servers.
4. Observe CPU usage on both systems for several refreshes.
5. Change one service or setting at a time.
6. Compare CPU usage immediately, then allow several minutes for temperatures and fans to settle.

A temperature rise under sustained work can be normal. Temperature limits depend on the specific component and sensor; use the hardware manufacturer's limits rather than a universal threshold. Compare the same host sensor each time.

Fans can run continuously while removing heat. Reduce unnecessary activity and power consumption; avoid forcing the fans off.

### Where to run commands

| Label | Meaning |
| --- | --- |
| Host | The physical computer running KVM/libvirt |
| Guest | The operating system inside the VM |

Read hardware temperatures on the **host**. Guest temperature readings may be absent or virtualised.

## 2. Find where the CPU work happens

### Host: inspect the VM process

```bash
top -o %CPU
```

Look for a QEMU process such as `qemu-system-x86_64`. Its displayed name may be truncated. In `top`, press `c` to toggle the command line and `q` to quit.

In the usual Irix reporting mode:

| Process CPU reading | Approximate meaning |
| --- | --- |
| 100% | One logical CPU fully occupied |
| 200% | Two logical CPUs fully occupied |

These percentages are not percentages of the entire computer. Reporting modes can change the interpretation. QEMU's usage includes guest work and virtualisation overhead.

### Guest: identify the applications doing work

```bash
top -o %CPU
free -h
```

Watch several refreshes. A brief startup spike does not establish a persistent problem.

Interpretation:

- High QEMU usage plus busy guest applications points toward guest workloads.
- High QEMU usage with an apparently idle guest warrants checking virtual devices, graphics, acceleration, and activity outside the sampled interval.
- Low CPU usage with higher temperatures can involve GPU activity, power settings, frequent wakeups, or cooling conditions.
- In `free`, the `available` value is more useful than `free` alone. Linux uses otherwise spare memory for cache.
- Some used swap does not prove active swapping. If needed, run `vmstat 1` and inspect `si`/`so` over several updates.

Assigning virtual CPUs makes processing capacity available; it does not keep that many physical cores busy. Reducing RAM is not a general fix for CPU heat.

## 3. Identify generic names and changing PIDs

Names such as `MainThread` do not uniquely identify an application. Different applications can share them.

### Guest: inspect a currently visible process

```bash
ps -ww -p PID -o pid,ppid,etimes,pcpu,pmem,args
```

### Guest: track matching names without chasing PIDs

```bash
watch -n 0.5 'ps -ww -C MainThread -o pid,ppid,etimes,pcpu,args --sort=-pcpu'
```

Press **Ctrl+C** to stop monitoring.

| Field | Meaning |
| --- | --- |
| PID | Current process ID |
| PPID | Parent process ID |
| ELAPSED | Age in seconds when using `etimes` |
| %CPU | CPU utilisation averaged over the process lifetime in `ps` |
| COMMAND | Full command and arguments |

Very young processes can show noisy lifetime averages. Use `top` over multiple intervals to assess sustained load.

If the parent remains alive while children change, inspect it:

```bash
ps -ww -p PARENT_PID -o pid,ppid,etime,args
```

Repeated launches can be normal worker creation, scheduled jobs, or service restarts. Changing PIDs alone does not prove a crash loop. A supervisor can also relaunch children without restarting its own systemd service.

## 4. Inspect services and logs

### Guest: systemd checks

```bash
systemctl --failed
systemctl list-jobs
systemctl status SERVICE_NAME --no-pager
systemctl show SERVICE_NAME -p MainPID -p NRestarts -p ExecMainStatus
```

Read `NRestarts` twice, several seconds apart. An increase establishes automatic restarts by systemd. A zero count does not exclude an application supervisor relaunching its own children.

High `systemd` activity can accompany frequent service changes; the logs are needed to establish the cause.

### Guest: read recent service logs

```bash
sudo journalctl -u SERVICE_NAME --since "5 minutes ago" --no-pager -n 100
```

To focus on common failure and restart messages:

```bash
sudo journalctl -u SERVICE_NAME \
  --since "5 minutes ago" --no-pager -n 60 \
  --grep='error|exception|fatal|failed|exited|restart|eaddrinuse|econnrefused|enotfound|timed out'
```

This filter can miss relevant messages. If it returns no useful result, inspect the unfiltered log for context. Application errors written to standard output are not always assigned an error-level journal priority.

### Guest: inspect Snap applications

```bash
snap list
snap services
snap changes
snap refresh --time
```

For a specific package or change:

```bash
snap services SNAP_NAME
sudo snap logs -n=100 SNAP_NAME.SERVICE_NAME
snap tasks CHANGE_ID
```

A Snap service name follows `package.service`. One package can contain an application server, a database, and other services.

An `active` state means a service is active at that instant; it does not establish application health or rule out repeated restarts. High `snapd` activity can reflect updates or service operations. Check its actual work before changing update settings.

## 5. Wekan: a worked example

Wekan is an optional web-based Kanban task board. Its Snap package can provide these services:

| Service | Purpose |
| --- | --- |
| `wekan.wekan` | Wekan application server |
| `wekan.ferretdb` | FerretDB database service |
| `wekan.mongodb` | MongoDB database service, used by some configurations |
| `wekan.caddy` | Optional web/proxy service |

Services and defaults can vary by package version. If FerretDB is selected and active, an inactive MongoDB service can be expected. Old database files can remain after migration; their presence alone does not mean two databases are running or conflicting.

### What the stop/start test established

A busy process named `MainThread` was identified as Wekan's Node.js server. Stopping the application service lowered the host temperature; starting it raised the temperature again.

That is strong evidence that Wekan contributed to the load and heat. The changing PIDs suggested repeated launches, but the available startup-settings excerpt did not establish a crash or its cause. The observations also did not establish who or what installed the package.

### Guest: inspect Wekan

```bash
snap services wekan
sudo snap logs -n=100 wekan.wekan
systemctl show snap.wekan.wekan.service -p MainPID -p NRestarts -p ExecMainStatus
```

A long settings dump can push an actual error outside the last 100 lines. Use the systemd log commands above with `snap.wekan.wekan.service` to inspect a longer time window.

### Guest: stop Wekan for a comparison

This makes the Wekan board unavailable during the test.

```bash
sudo snap stop wekan.wekan
```

Keep the VM running. Compare QEMU CPU usage on the host and allow temperatures to settle. Restore the application with:

```bash
sudo snap start wekan.wekan
```

### Guest: keep the application off across boots

```bash
sudo snap stop --disable wekan.wekan
```

Restore its automatic startup with:

```bash
sudo snap start --enable wekan.wekan
```

These commands target the application service. Other enabled services in the package can remain running.

## 6. Uninstall an unwanted Wekan Snap

Run this **inside the guest where Wekan is installed**:

```bash
sudo snap remove wekan
```

This removes the Wekan package, its revisions, and its bundled services. It also removes the package's live internal data and configuration.

On standard Ubuntu installations with automatic Snap snapshots enabled, removal first saves the package's internal data and configuration. The default retention is **31 days**, and it can be changed or disabled. If data matters, make a deliberate backup rather than relying solely on that default.

### Verify removal and the CPU improvement

```bash
snap list wekan
snap saved
top -o %CPU
```

Expected results:

- `snap list wekan` reports no matching installed snap.
- `snap saved` shows any retained snapshots; these are stored backups, not running services.
- Guest and host CPU usage are lower if Wekan was the main contributor. Other workloads may still generate heat.

The `--purge` removal option skips creating the automatic snapshot. It is unnecessary for an ordinary uninstall and does not delete pre-existing snapshots.

### If removal is blocked by another Snap operation

```bash
snap changes
snap tasks CHANGE_ID
```

Inspect the pending operation and let a normally progressing update finish. Diagnose a stalled operation from its task details rather than repeatedly killing processes.

### Investigate an unexpected installation

Review `snap changes` and any relevant change with `snap tasks CHANGE_ID`. Setup scripts, automation records, and shell history may provide additional evidence, if retained.

A package's presence or automatic updates do not identify the original installer. Available history can be incomplete. Keep investigation records private unless sanitised.

## 7. Check other optional guest workloads

### MicroK8s

Processes such as `kubelite`, `k8s-dqlite`, and `calico-node` can indicate a running MicroK8s cluster. Kubernetes control-plane and networking services do background work even without active development.

When cluster workloads can be interrupted, compare with MicroK8s stopped:

```bash
sudo microk8s stop
```

Restore it when needed:

```bash
sudo microk8s start
```

Measure the change rather than assuming Kubernetes accounts for all CPU usage.

### Development tools and agents

Check for unnecessary:

- Development servers and file watchers.
- Repeated builds or test runs.
- Browser automation workers.
- Local model inference.
- Databases, containers, and applications enabled at boot.

API-based tools may perform model inference remotely while still launching local commands and browsers.

### Guest desktop

For command-line server work, SSH or VS Code Remote SSH can reduce the need for a guest desktop. Closing the viewer does not stop the desktop session.

After verifying SSH access and saving graphical-session work, test:

```bash
sudo systemctl stop display-manager
```

This ends the guest graphical session. Restore the graphical login with:

```bash
sudo systemctl start display-manager
```

If headless operation suits the workflow, set future boots to the command line:

```bash
sudo systemctl set-default multi-user.target
```

Restore graphical boot with:

```bash
sudo systemctl set-default graphical.target
```

Default-target changes apply at the next boot. Restart the guest when convenient after saving work.

## 8. Review host power and VM configuration

After identifying unnecessary workloads:

- Try the host's **Settings > Power > Power Saver**, where available. It trades performance for reduced power usage; builds can take longer.
- Keep ventilation unobstructed and use a hard surface.
- Treat lower fan noise and lower temperature as separate measurements.
- Consider fewer virtual CPUs if limiting parallel builds is acceptable. This may change little at idle.
- Keep enough guest memory to avoid active swapping.
- Retain the current distribution unless there is a specific reason to change it. The same busy application can remain busy on a lighter distribution.

### Host: check the libvirt configuration

```bash
virsh list --all
virsh dumpxml "VM_NAME"
```

For an accelerated KVM guest, the domain XML should identify its type as `kvm`. A QEMU process name or a connection labelled QEMU/KVM is normal.

If the VM is absent from the list, check that `virsh` uses the same libvirt connection as the management application. Do not conclude the VM is missing from one empty list.

## 9. Keep public troubleshooting notes anonymous

Before committing troubleshooting material to a public repository, inspect it manually. Remove or replace:

- Usernames, hostnames, real home directories, and private project paths.
- IP addresses, MAC addresses, personal domains, and private repository URLs.
- Tokens, passwords, connection strings, cookies, and database contents.
- Serial numbers, device identifiers, hardware model names, and device-specific specifications.
- Screenshots and raw logs that reveal any of the above.

Prefer a short sanitised excerpt showing only the relevant error. Full command lines and startup configuration dumps can contain secrets.

Use this template for future incidents:

```markdown
## Symptom

Describe sustained CPU usage, temperature changes, or fan behaviour.

## Evidence

- Host process:
- Guest executable and parent:
- Relevant service:
- Restart-counter change:
- Sanitised error:

## Controlled test

- One change made:
- Immediate CPU result:
- Temperature/fan result after settling:

## Finding

Separate confirmed observations from hypotheses.

## Action and verification

Record the fix, how it was verified, and how to reverse it when applicable.
```

## References

- [Ubuntu top manual](https://manpages.ubuntu.com/manpages/noble/man1/top.1.html)
- [Ubuntu ps manual](https://manpages.ubuntu.com/manpages/noble/man1/ps.1.html)
- [Ubuntu journalctl manual](https://manpages.ubuntu.com/manpages/noble/man1/journalctl.1.html)
- [systemd automatic restart counter discussion](https://github.com/systemd/systemd/issues/29348)
- [Snap service management](https://snapcraft.io/docs/how-to-guides/manage-snaps/control-services/)
- [Snap update management](https://snapcraft.io/docs/how-to-guides/manage-snaps/manage-updates/)
- [Snap removal](https://snapcraft.io/docs/tutorials/get-started/#remove-a-snap)
- [Snap data snapshots](https://snapcraft.io/docs/how-to-guides/manage-snaps/create-data-snapshots/)
- [Wekan overview](https://wekan.fi/)
- [Wekan installation and database notes](https://wekan.fi/install/)
- [MicroK8s command reference](https://canonical.com/microk8s/docs/command-reference)
- [Switching systemd startup targets](https://www.redhat.com/en/blog/configure-systemd-startup-targets)
- [Ubuntu power profiles](https://help.ubuntu.com/stable/ubuntu-help/power-profile.html.en)
- [libvirt domain XML](https://libvirt.org/formatdomain.html)

