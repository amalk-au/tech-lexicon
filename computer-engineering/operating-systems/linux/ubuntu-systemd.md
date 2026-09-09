# systemd

## systemd Cheat Sheet

| What command does | Command | Description |
| --- | --- | --- |
| Check service status | `systemctl status SERVICE` | Shows whether a service is running, stopped, or failed |
| Start service | `sudo systemctl start SERVICE` | Starts a service immediately |
| Stop service | `sudo systemctl stop SERVICE` | Stops a service immediately |
| Restart service | `sudo systemctl restart SERVICE` | Stops and starts a service again |
| Reload service | `sudo systemctl reload SERVICE` | Reloads configuration without fully restarting the service |
| Enable at boot | `sudo systemctl enable SERVICE` | Makes a service start automatically at boot |
| Disable at boot | `sudo systemctl disable SERVICE` | Prevents a service from starting automatically at boot |
| Enable + start | `sudo systemctl enable --now SERVICE` | Enables a service at boot and starts it immediately |
| Check if running | `systemctl is-active SERVICE` | Shows whether the service is currently active |
| Check if enabled | `systemctl is-enabled SERVICE` | Shows whether the service starts automatically at boot |
| List running services | `systemctl --type=service --state=running` | Lists currently running services |
| List failed services | `systemctl --failed` | Shows services/units that have failed |
| View service logs | `journalctl -u SERVICE` | Displays logs for a specific service |
| Follow service logs | `journalctl -u SERVICE -f` | Continuously displays new service logs |
| View current boot logs | `journalctl -b` | Shows logs from the current boot |
| View recent logs | `journalctl --since "1 hour ago"` | Shows logs from a specified time period |
| Analyze boot time | `systemd-analyze` | Shows how long the system took to boot |
| Find slow services | `systemd-analyze blame` | Shows services that took the longest to start |
| Show dependencies | `systemctl list-dependencies SERVICE` | Shows dependencies of a service |
| List all units | `systemctl list-units` | Lists currently loaded systemd units |

**systemd** is the system and service manager used by modern Ubuntu versions. It is the first major process started by the Linux kernel and has **PID 1**.

Think of it as the **manager of your Ubuntu system after the kernel starts**.

### What does systemd do?

-   **Starts services** when Ubuntu boots, such as SSH, networking, Docker, etc.
-   **Stops and restarts services** when needed.
-   **Manages dependencies** between services.
-   **Monitors processes** and can restart failed services.
-   **Handles system logging** through `journald`.
-   **Manages startup targets** such as normal multi-user mode.
-   **Manages timers** for scheduled tasks.

### Common commands

For example, to check whether SSH is running:

```
systemctl status ssh
```

Start a service:

```
sudo systemctl start ssh
```

Stop it:

```
sudo systemctl stop ssh
```

Restart it:

```
sudo systemctl restart ssh
```

Make it start automatically when Ubuntu boots:

```
sudo systemctl enable ssh
```

Disable automatic startup:

```
sudo systemctl disable ssh
```

### systemd vs systemctl

These are related but different:

**systemd** = the underlying system/service manager.

**`systemctl`** = the command-line tool you use to communicate with and control systemd.

For example:

```
You
 │
 │ systemctl restart nginx
 ▼
systemd
 │
 │ manages
 ▼
nginx service
```

### What is PID 1?

You can see it with:

```
ps -p 1 -f
```

You'll typically see something like:

```
root   1   0   /sbin/init
```

On Ubuntu, `/sbin/init` is generally linked to systemd.

So when Ubuntu boots:

```
BIOS/UEFI
   ↓
Bootloader (GRUB)
   ↓
Linux kernel
   ↓
systemd (PID 1)
   ↓
system services
   ↓
login / desktop / applications
```

**In short:** systemd is the central process that brings Ubuntu up, manages its services while it's running, and helps shut it down cleanly.