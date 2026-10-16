# Ubuntu New Install Configuration
[Back to Linux reference](./README.md)

## System programs

- Install Gnome Tweaks

### Gnome Extensions

- Install GNOME Shell Extensions: `sudo apt install gnome-shell-extensions`
- Go to : https://extensions.gnome.org to find the extensions required
- To make sure Extension Is Installed: `gnome-extensions list`
- Enable the Extension using command line `gnome-extensions enable`
- Restart GNOME Shell (on X11 only): Press Alt + F2, type r, press Enter

## Ubuntu Security

- Enable and configure the Uncomplicated Firewall (UFW) with rules to restrict unnecessary network access : `sudo ufw enable` then check status: `sudo ufw status`
- Install ClamAV: `Install: sudo apt install clamav clamav-daemon` | Update database: `sudo freshclam` | Run a scan: `sudo clamscan -r /home/youruser`
- Lynis: A security auditing tool that checks your system for security holes and potential misconfigurations. Install: `sudo apt install lynis` | Run an audit: `sudo lynis audit system`

## Setup Development tools

- [Setup GIT](/software-development/tools/git/git-configuration.md)
- Install VS Code

## Hardware/driver configs

### Best Tools to Monitor Temps in Ubuntu

Install These Tools

```
sudo apt update
sudo apt install lm-sensors psensor nvtop acpi glances
```

- Detect Sensors : `sudo sensors-detect`

- Read CPU & System Temps : `sensors`

- Monitor NVIDIA GPU Temp (if using dGPU) : `sudo ubuntu-drivers autoinstall`

- Then check with: `nvidia-smi`

- Psensor, launch it via terminal: `psensor`

- NVTOP (for NVIDIA GPU usage/temp), live terminal dashboard like htop, but for GPUs, Run : `nvtop`

### Show Keyboard Caps Lock and Num Lock

- Search for `Lock Keys` or `https://extensions.gnome.org/extension/36/lock-keys/`

### Show Temps on GNOME Top Bar using Gnome Extensions

- Search for `System Monitor` and click install button
- Make Sure Extension Is Installed: `gnome-extensions list`
- Enable the Extension using command line `gnome-extensions enable system-monitor@paradoxxx.zero.gmail.com` or you can run the GNOME Extensions App (GUI): `gnome-extensions-app`

### Setting up keyboard backlight control (ONLY for Lenovo Legion)

For full control, use the tool L5P-Keyboard-RGB (GitHub: 4JX/L5P-Keyboard-RGB), which supports Ubuntu and can set keyboard colors and patterns on Legion 5 (Pro) models from 2020-2024. - CONFIRMED TO WORK WITH Legion LAPTOP

- By going to `https://github.com/4JX/L5P-Keyboard-RGB.git` you can either download the compiled verision from Releases `https://github.com/4JX/L5P-Keyboard-RGB/releases` or Compile it from scratch. I tried both and Compiling from scratch didn't work with build failure plus had to download lot of other unknown libraries.
- So the way is to download the latest version from releases (I have saved the latest in case this repo is gone)
- Make the downloaded file executable and run it with sudo permissions `sudo ./legion-kb-rgb` then the program should work.
- Only install this if you get an error message `cannot open shared object file: No such file or directory` then install `sudo apt install xdotool` Alternatively, if only the shared library is needed: `sudo apt install libxdo3`

### Lenovo Legion set Battery conservation mode

Lenovo Legion laptops support a battery conservation mode (charge limit) through the ACPI interface exposed by the ideapad_acpi kernel driver. This mode helps prolong battery lifespan by preventing it from staying at 100% charge when plugged in.

- Ensure the driver and control file exist: : `ls /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- If the file exists, your Legion supports firmware-level battery limiting - If not, check that the module is loaded
  `lsmod | grep ideapad`
  `sudo modprobe ideapad_laptop`
- View current conservation mode status : `cat /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`

```bash
1	Conservation Mode ON	Battery charging limited (~55–60%)
0	Conservation Mode OFF	Battery charges fully (100%)
```

- Enable conservation mode (limit charge to ~60%) : `echo 1 | sudo tee /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Disable Conservatin mode (allow full charge): `echo 0 | sudo tee /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Changes apply instantly and persist until you toggle it again. The exact charge thresholds (e.g. 55–60%) are firmware-controlled and cannot be customized from Linux.
- View battery capacity & status

```bash
cat /sys/class/power_supply/BAT0/capacity
cat /sys/class/power_supply/BAT0/status
```

- Use watch with a small script, if you want to monitor both continuously:

```bash
watch -n5 'echo -n "Battery: "; cat /sys/class/power_supply/BAT0/capacity; \
echo -n "  Status: "; cat /sys/class/power_supply/BAT0/status'
```

- You can also view the full battery information using: `upower -i /org/freedesktop/UPower/devices/battery_BAT0`
