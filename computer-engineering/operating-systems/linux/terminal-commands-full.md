# Linux Terminal Commands

[Back to Linux reference](./README.md)

## Frequently used commands

- `sudo apt install ./deb_file` : Manually install Deb files from current directory
- `sudo udisksctl power-off -b /dev/sda` : Turn off external SSD/HDD power
- Restart the desktop portal to free memory bug in Ubuntu:  
  `systemctl restart --user xdg-desktop-portal-gnome.service`
- Force update Google Chrome (after downloading deb file):  
  `sudo apt update && sudo apt upgrade && sudo apt install ./google-chrome-stable_current_amd64.deb`
- `kill [pid]` / `kill -9 [pid]` : Terminate a process (`-9` forces termination)
- `upower -i /org/freedesktop/UPower/devices/battery_BAT0` : Check the Laptop battery status
- View current Lenovo Legion Battery conservation mode status : `cat /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Nautilus

```bash
1	Conservation Mode ON	Battery charging limited (~55–60%)
0	Conservation Mode OFF	Battery charges fully (100%)
```

- Enable Lenovo Legion conservation mode (limit charge to ~60%) : `echo 1 | sudo tee /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Disable Lenovo Legion Conservation mode (allow full charge): `echo 0 | sudo tee /sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Changes apply instantly and persist until you toggle it again. The exact charge thresholds (e.g. 55–60%) are firmware-controlled and cannot be customized from Linux.
- `powerprofilesctl get` : Lenovo Legion Laptop Power Mode, you can also click `Fn + Q`, power button LED color change accordingly
  - Power Saver / Blue Led : Lower fan speed, cooler and quieter, less performance
  - Balanced Mode / White Led : Balanced Default mode — balanced performance and cooling
  - Performance Mode / Red Led : Performance Maximum CPU/GPU performance, louder fans
- `killall [name]` : Terminate all processes matching a name
- `alias` : Create a shortcut to a command (can also be used with `cd` to shortcut directories)
- `clear` : Clear the terminal screen
- `echo` : Display a line of text (useful in scripts)
- `exit` : Exit or close the terminal
- `history` : Display recently used commands (also navigable with Up/Down arrow keys)
- `!` : Repeat a recently used command (`!n` for the _n_-th command in history, `!-n` for _n_ commands ago)
- `echo $XDG_SESSION_TYPE` - Check the Ubuntu, session mode (X11 or Wayland)

## Documentation & Help

- `man` : Display the manual for a terminal program
- `man [command]` : Open the manual/help page for `[command]`
- `man man` : Open the manual/help page for the `man` command (helpception)
- `whatis` : Display a brief description of a terminal program (simpler than `man`)

## Programming & Math

- `expr` : Evaluate expressions and math operations
- `factor` : Show factors of a number
- `look` : Look up a word in the system dictionary
- `python` / `python3 --version` : Shows you what version of Python you currently have installed

## System Information and Search

- `sudo dmesg | more` : View the Kernel ring buffer for messages. This command is useful to understand your Linux machine boot problems. It will show you every event that happened in the start sequence. Here you could see errors with drivers or services and understand why something doesn’t work the way you want. You will get a column with the time elapsed since the beginning of the boot and a text explaining what happened. There are also normal messages when everything is fine
- `history` : Linux store any command you type in an archive file. History is the command to use to display this list. You can also clear all the history. `history -c` Or clear one specific entry. `history -d 12`
- `ls` : The most frequently used command in Linux to list directories
- `clear` : Clear the terminal display
- `echo` : Print any text that follows the command
- `less` : Linux command to display paged outputs in the terminal
- `man` : Access manual pages for all Linux commands
- `uname` : Display system info (kernel, hardware, OS)
- `jobs` : List background jobs
- `whoami` : Get the active username
- `id` : Display current user and group information
- `grep` : Search for a string within an output
- `cal` : View a command-line calendar
- `whereis` : Locate the binary, source, and manual pages for a command
- `whatis` : Find what a command is used for
- `dpkg -l` / `dpkg -l | grep [package]` : List installed packages or search for one
- `lsof` : List open files and associated processes
- `htop` : Interactive process viewer (alternative to top)
- `top` : Real-time process monitor sorted by CPU usage
- `uptime` : Show time since last system boot
- `free` : Display used and available RAM
- `df` / `df -h` : Display disk filesystem info (human-readable)
- `du -h` : Display disk usage of directories (human-readable)
- `cat /home/pi/README.txt` Or `cat [file]` : Displays all the content of the specified file.
- `more /var/log/syslog Or more [file]` : Displays the content of the specified file, page per page (enter or space to continue, q to quit).
- `tail /var/log/syslog` OR `tail [file]` : Tail allows you to display the end of a file, it’s useful to check new entries in a log file.
- `tail -n20 /var/log/syslog` : You can specify the number of lines to display with -n.
- `tail -f /var/log/syslog` : Option -f to displays new lines in real-time.
- `head /home/pi/file.txt` Or `head -n20 /home/pi/file.txt` Or `head [file]` : It’s the same as tail but to display the beginning of a file.
- `ps` / `ps aux` / `ps -u [user]` : Display running processes (all or by user)
- `grep dhcp /var/log/syslog or grep [string]` : Grep is a powerful tool to search string in a text. You can use it to search something in a file or to filter the output of another command or script. `cat /var/log/syslog | grep dhcp /home/pi/myscript.sh | grep error ls -latr | grep php` Lot of options to use with grep, like regular expressions or options to display lines before (-B), after (-A) or around (-C) the search string. You can also use -v to display everything except the input string. `grep 'dhcp|dns' /var/log/syslog grep -A2 -B4 'Fatal error' /var/log/apache/error.log grep -v 'Notice' /var/log/apache/error.log`
- `sudo lshw` : View hardware info
- `lsusb -v` : Check USB Devices & Controllers
- `sudo gnome-text-editor /etc/systemd/logind.conf` : Change the Laptop Lid close behavior : find out the line #HandleLidSwitch=suspend and change it to one of following : HandleLidSwitch=lock – lock when lid closed. HandleLidSwitch=ignore – do nothing, some laptops will disconnect Wi-Fi. HandleLidSwitch=poweroff – shutdown. HandleLidSwitch=hibernate – hibernate Ubuntu. restart your computer
- `upower -i /org/freedesktop/UPower/devices/battery_BAT0` : Check the Laptop battery status
- `sudo dmidecode -t system | grep Serial` : Lenovo Thinkpad Find serial number
- `sudo dmidecode -t baseboard | grep Serial`: To find the baseboard serial number:

## Administration

- `su` : Switch user (defaults to root unless specified)
- `passwd` : Create or update a user's password
- `sudo` : Command to escalate privileges in Linux
- `sudo [command]` : Execute `[command]` with elevated privileges
- `sudo su` : Switch to root user shell (be careful!)
- `sudo apt get install [package]` : Install a package
- `sudo apt get update` : Update the list of packages
- `sudo apt get upgrade` : Upgrade installed packages (run after update)
- `sudo apt remove [package]` / `sudo apt purge [package]` : Remove packages (purge removes config files too)
- `sudo reboot` : Restart the system immediately
- `sudo shutdown -h now` : Shutdown the system immediately
- `sudo chown pi:root [name]` : Change owner and group of a file to user `pi` and group `root`
- `sudo raspi-config` : Launch Raspberry Pi configuration menu
- `sudo killall nautilus` : Kill frozen Nautilus file manager
- `sudo killall openvpn` : Close OpenVPN processes
- `sudo apt update && sudo apt upgrade` : Refresh and update software in Debian/Ubuntu in one command
- `sudo apt install ./deb_file` : Manually install Deb files from current directory
- `snap refresh` : Update Snap packages
- `service` : Start and stop services
- `kill [pid]` / `kill -9 [pid]` : Terminate a process (`-9` forces termination)
- `killall [name]` : Terminate all processes matching a name
- `mount` : Mount file systems
- `chmod` : Change file permissions
- `chown` : Change owner or group of a file or folder
- `export` : Export environment variables
- `apt` / `pacman` / `yum` / `rpm` / `dnf` : Package managers depending on distro
- `alias` : Create custom shortcuts for commands
- `dd` : Create bootable USB sticks or copy low-level data
- `useradd` / `usermod` : Add or modify users
- `crontab -l` / `crontab -e` : List or edit scheduled cron jobs
- `screen -s [name]` / `screen -r [name or ID]` : Start or resume detached terminal sessions
- `watch` : Run a command periodically to monitor output
- `/usr/bin/dm-tool lock` : Lock the screen
- `bg` : Resume a stopped job in the background
- `fg` : Bring a job to the foreground
- `whereis [command]` : Locate executable file of a command
- Restart the desktop portal to free memory bug in Ubuntu:  
  `systemctl restart --user xdg-desktop-portal-gnome.service`
- Force update Google Chrome (after downloading deb file):  
  `sudo apt update && sudo apt upgrade && sudo apt install ./google-chrome-stable_current_amd64.deb`

## Linux Networking

- `ssh` : Secure Shell command in Linux, securely log into a remote system
- `traceroute` : Trace all the network hops to reach the destination
- `wget` : Download files directly from the internet
- `ufw` : Firewall command
- `iptables` : Base firewall for all other firewall utilities to interface with
- `w` : Show who is logged on and what they are doing
- `tree` : Analyze current location in the file tree, showing the entire lower tree
- `ifconfig` / `ip a` : Display current network configuration, including IP addresses
- `sudo ifup [interface]` : Enable the specified network interface
- `sudo ifdown [interface]` : Disable the specified network interface
- `netstat` : Monitor network connections, open ports, and traffic flow (e.g., `netstat -l -p`)
- `ip` : Display IP addresses, interfaces, and usage
- `ping` : Test network connectivity and latency
- `dig` : DNS lookup for domain names
- `wget [uri]` : Download the file found at `[uri]` on the internet

## Linux Commands to Check the State of Firmware

https://eclypsium.com/blog/linux-commands-to-check-the-state-of-firmware/

- Use the following command to learn a little more information about the BIOS:
  `sudo dmidecode -t 0`
- lshw is yet another alternative:
  `sudo lshw | grep -A8 '*-firmware'`
- To report the state of Secure Boot the mokutil command is the most straightforward: `mokutil --sb-state`
- Discover the current BIOS version and release date using dmidecode:
  `sudo dmidecode -s bios-version`
  `sudo dmidecode -s bios-release-date`

### FWUPD

- Fwupd allows you to enumerate the devices on your system and apply updates where available. You can find more documentation on the project’s website. Here are the basics:
  Get all device information: `fwupdmgr get-devices`
- Get updates (downloads the latest metadata and checks for updates on supported devices): `fwupdmgr get-updates`
- Apply updates to supported devices (CAUTION: Applies firmware updates!): `fwupdmgr update`
  Note: Will also update the UEFI Secure Boot dbx.
- Security checks: `fwupdmgr security --force`

### Other Hardware

- Memory: `sudo lshw -class memory`
- PCI devices: `sudo lspci -nnmmvkD | less`
- Storage Devices : `sudo smartctl --xall /dev/nvme0 | grep -i firmware`

## Linux: File, Directory and Storage operations

- `lsblk -l` : Mounted drives
- `sudo udisksctl power-off -b /dev/sda` : Turn off external HDD power
- `nautilus admin:///`: Open Root folder with Nautilus File Manager with root privileges (use `sudo -i` and `CTRL+D` to return to normal user). If you want to open an specific folder give the folder location i.e : `nautilus admin:////var/lib/libvirt/images`
- `pwd` : Print working directory command in Linux
- `cd` : Linux command to navigate through directories
- `mkdir` : Command used to create directories in Linux
- `sudo systemctl hibernate` : Hibernate the computer (Enable Hibernate on Ubuntu)
- `mv` : Move or rename files in Linux
- `cp` : Copy files in Linux
- `rm` : Delete files or directories
- `touch` : Create blank/empty files or update file timestamps
- `ln` : Create symbolic links (shortcuts) to other files
- `cat` : Display file contents on the terminal (supports multiple files)
- `tar` : Extract and compress files in Linux
- `head` : Return the specified number of lines from the top of a file
- `tail` : Return the specified number of lines from the bottom of a file
- `diff` : Find the difference between two files
- `cmp` : Check if two files are identical
- `comm` : Combines functionality of diff and cmp
- `sort` : Sort the content of a file while outputting
- `zip` : Zip files in Linux
- `unzip` : Unzip files in Linux
- `ls` : Display a list of files in the current directory
- `stat` : Display when a file was last accessed, modified, or changed
- `rmdir` : Delete an empty directory (must be empty to succeed)
- `rename` : Change the name of a file or set of files
- `find` : Search for files based on criteria
- `locate` : Search for files or directories (faster than `find`)
- `grep` : Search files for a text string
- `mount` : Attach a separate filesystem (e.g., external drive) to main filesystem
- `umount` : Detach a separate filesystem
- `chmod` : Change file permissions
- `chown` : Change the owner or group of a file
- `cd ~` : Change to your home directory (usually `/home/`)
- `chmod [who][+,-,=][permissions] [name]` : Change permissions for a file
- `chmod 777 [name]` : Allow all users to read, write, and execute the file
- `chmod u+x [name]` : Allow the user to execute the file
- `cp [from] [to]` : Copy a file from source to destination
- `cp -r [from] [to]` : Copy all files and subdirectories recursively
- `grep ‘string’ [name]` : Search inside one or more files for occurrences of ‘string’
- `head [name]` : Return the first lines of a file
- `ls -a` : List all files including hidden files
- `ls -l` : List contents with detailed information
- `ls [path]` : List the contents of a directory at the specified path
- `mkdir [name]` : Create a directory in the current working directory
- `mv [from] [to]` : Move a file from source to destination
- `mv -r [from] [to]` : Move all files and directories recursively
- `rm [name]` : Remove a specified file
- `rm *` : Remove all files in the current directory
- `rm -r *` : Remove all files and directories recursively
- `rmdir [name]` : Remove an empty directory
- `tail [name]` : Show the end lines of a file
- `tar -cvzf [name] [path]` : Create a compressed file from the contents of a path
- `tar -xvzf [name]` : Extract the contents of a compressed file

### Fixing the Encrypted drive issues on boot initramfs

Rarely when you boot Ubuntu will not mount the encrypted drive due to an unknown reason i.e. /etc/crypttab has been changed. Then cryptsetup luksOpen /dev/nvme0n1p3 DecryptedDrive Enter the correct password and then exit the console exit \*nvme0n1p3 is assumed as the default name for the SSD, change as per the correct device
Once Ubuntu boots up normally (after the encrypted drive is mounted according to the above) Edit the /etc/crypttab by sudo nano /etc/crypttab
Also open up Ubuntu Disks manager and look for the LUKS encrypted drive UUID then add to the DecryptedDrive UUID=XXXXX none nofail Then update initramfs as follows `sudo update-initramfs -u -k all`
