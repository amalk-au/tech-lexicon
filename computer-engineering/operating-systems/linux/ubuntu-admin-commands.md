# Ubuntu Administration Commands

A practical **day-to-day Ubuntu server administration** reference, organized by what you actually need to do.

## 1\. System Information

```
# Ubuntu version
lsb_release -a
cat /etc/os-release

# Kernel
uname -a
uname -r

# Hostname
hostname
hostnamectl

# CPU
lscpu
nproc

# Memory
free -h

# Disk space
df -h
df -Th

# Disk/partition information
lsblk
sudo fdisk -l

# PCI devices
lspci

# Currently logged-in users
who
w

# System uptime/load
uptime
```

## 2\. Files & Directories

```
# List files
ls
ls -lah

# Current directory
pwd

# Change directory
cd /path/to/directory
cd ..
cd ~

# Create directory
mkdir mydir
mkdir -p /path/to/dir

# Create empty file
touch file.txt

# Copy
cp file.txt /tmp/
cp -r directory/ /tmp/

# Move / rename
mv old.txt new.txt

# Delete
rm file.txt
rm -r directory/

# Find files
find /var -name "*.log"
find / -type f -size +1G 2>/dev/null

# Search inside files
grep "error" /var/log/syslog
grep -R "error" /etc/

# View file
cat file.txt
less file.txt
head file.txt
tail file.txt
tail -f /var/log/syslog
```

⚠️ `rm -rf` is extremely destructive. Always verify the path before running it.

## 3\. Permissions & Ownership

```
# View permissions
ls -l

# Change permissions
chmod 644 file.txt
chmod 755 script.sh

# Recursive permissions
chmod -R 755 directory/

# Change owner
sudo chown user:user file.txt

# Recursive ownership
sudo chown -R user:user directory/

# Change group
sudo chgrp developers file.txt

# Run command as another user
sudo -u username command

# Root shell
sudo -i
```

### Permission numbers

```
7 = rwx
6 = rw-
5 = r-x
4 = r--
0 = ---
```

Common:

```
chmod 644 file      # rw-r--r--
chmod 755 script    # rwxr-xr-x
chmod 600 secret    # rw-------
```

## 4\. Users & Groups

```
# Current user
whoami

# User information
id username

# List users
cat /etc/passwd

# Create user
sudo adduser username

# Delete user
sudo deluser username

# Create group
sudo groupadd developers

# Add user to group
sudo usermod -aG developers username

# Remove user from group
sudo gpasswd -d username developers

# List user's groups
groups username

# Change password
sudo passwd username

# Lock account
sudo passwd -l username

# Unlock account
sudo passwd -u username
```

**Important:** after adding a user to a group, they generally need to log out and back in for the new group membership to apply.

## 5\. APT Package Management

```
# Update package index
sudo apt update

# Upgrade installed packages
sudo apt upgrade

# Full upgrade
sudo apt full-upgrade

# Install
sudo apt install nginx

# Remove
sudo apt remove nginx

# Remove package + configuration
sudo apt purge nginx

# Search
apt search nginx

# Show package information
apt show nginx

# List installed packages
apt list --installed

# Find which package owns a file
dpkg -S /path/to/file

# Repair broken dependencies
sudo apt --fix-broken install

# Remove unnecessary packages
sudo apt autoremove
```

### `.deb` packages

```
sudo dpkg -i package.deb
sudo apt install ./package.deb
```

Prefer `apt install ./package.deb` when possible because APT handles dependencies.

## 6\. Services — systemd

```
# Check service
systemctl status nginx

# Start
sudo systemctl start nginx

# Stop
sudo systemctl stop nginx

# Restart
sudo systemctl restart nginx

# Reload configuration
sudo systemctl reload nginx

# Enable at boot
sudo systemctl enable nginx

# Disable at boot
sudo systemctl disable nginx

# Enable AND start
sudo systemctl enable --now nginx

# Check whether running
systemctl is-active nginx

# Check whether enabled
systemctl is-enabled nginx

# List running services
systemctl --type=service --state=running

# List failed services
systemctl --failed
```

## 7\. Logs — journalctl

One of the most important administration tools.

```
# View system journal
sudo journalctl

# Recent logs
sudo journalctl -n 100

# Follow logs live
sudo journalctl -f

# Logs for a service
sudo journalctl -u nginx

# Follow service logs
sudo journalctl -u nginx -f

# Since today
sudo journalctl --since today

# Since a specific time
sudo journalctl --since "1 hour ago"

# Kernel messages
sudo journalctl -k

# Boot logs
sudo journalctl -b

# Previous boot
sudo journalctl -b -1

# Only errors
sudo journalctl -p err
```

A very useful troubleshooting pattern:

```
sudo systemctl status nginx
sudo journalctl -u nginx -n 100 --no-pager
```

## 8\. Processes

```
# Processes
ps aux

# Process tree
ps auxf

# Interactive process viewer
top

# Better process viewer if installed
htop

# Find process
pgrep nginx
pidof nginx

# Find process by name
ps aux | grep nginx

# Kill by PID
kill PID

# Force kill
kill -9 PID

# Kill by name
pkill nginx
```

Prefer normal `kill` first. `kill -9` should generally be a last resort.

## 9\. CPU & Memory Troubleshooting

```
# Memory
free -h

# CPU/load
uptime
top

# Memory-heavy processes
ps aux --sort=-%mem | head

# CPU-heavy processes
ps aux --sort=-%cpu | head

# Virtual memory statistics
vmstat 1

# Disk I/O
iostat
```

If `iostat` isn't installed:

```
sudo apt install sysstat
```

## 10\. Disk Management

```
# Filesystem usage
df -h

# Inode usage
df -i

# Block devices
lsblk

# Disk usage of directories
du -sh /var/*
du -sh /home/*

# Largest directories/files
sudo du -ah /var | sort -rh | head -20

# Mounted filesystems
findmnt

# Mount filesystem
sudo mount /dev/sdb1 /mnt

# Unmount
sudo umount /mnt
```

### Find what's filling the disk

```
df -h
sudo du -xhd1 / | sort -h
sudo du -xhd1 /var | sort -h
```

## 11\. Networking

```
# IP addresses
ip addr

# Short version
ip -br addr

# Routing table
ip route

# Network interfaces
ip link

# DNS configuration
resolvectl status

# Test connectivity
ping 8.8.8.8

# Test DNS
ping google.com

# DNS lookup
dig example.com

# Alternative
nslookup example.com

# Show listening ports
sudo ss -tulpn

# Show TCP connections
ss -tna

# Test a port
nc -vz 192.168.1.10 22

# HTTP request
curl -I https://example.com

# Download
wget https://example.com/file
```

### Find what is listening on a port

```
sudo ss -lntp | grep :80
```

## 12\. SSH

```
# Connect
ssh user@server

# Specify port
ssh -p 2222 user@server

# Copy file to server
scp file.txt user@server:/tmp/

# Copy from server
scp user@server:/tmp/file.txt .

# SSH key generation
ssh-keygen

# Copy public key to server
ssh-copy-id user@server

# Test SSH
ssh -v user@server
```

Common SSH configuration:

```
sudo nano /etc/ssh/sshd_config
```

After changing SSH configuration:

```
sudo sshd -t
sudo systemctl restart ssh
```

**Always run `sshd -t` before restarting SSH** when changing its configuration.

## 13\. Firewall — UFW

Ubuntu commonly uses UFW as a simpler interface to the firewall.

```
# Status
sudo ufw status

# Detailed status
sudo ufw status verbose

# Enable
sudo ufw enable

# Disable
sudo ufw disable

# Allow SSH
sudo ufw allow ssh

# Allow port
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Deny port
sudo ufw deny 23

# Delete rule
sudo ufw delete allow 80/tcp

# Show numbered rules
sudo ufw status numbered
```

**Before enabling UFW on a remote server, make sure SSH is allowed**, or you can lock yourself out.

## 14\. Filesystem & Mounts

```
# Show mounted filesystems
mount
findmnt

# Mount
sudo mount /dev/sdb1 /mnt/data

# Unmount
sudo umount /mnt/data

# Show UUIDs
sudo blkid

# Persistent mounts
sudo nano /etc/fstab

# Test fstab
sudo mount -a
```

## 15\. Environment & Shell

```
# Environment variables
env

# PATH
echo $PATH

# Variable
echo $HOME

# Current shell
echo $SHELL

# Command location
which python3
which nginx

# More complete command lookup
type -a python3

# Command history
history

# Clear terminal
clear

# Current date/time
date
```

## 16\. Archives & Compression

```
# Create tar archive
tar -cvf archive.tar directory/

# Extract tar
tar -xvf archive.tar

# Create gzip-compressed tar
tar -czvf archive.tar.gz directory/

# Extract
tar -xzvf archive.tar.gz

# List archive contents
tar -tzf archive.tar.gz

# Zip
zip -r archive.zip directory/

# Unzip
unzip archive.zip
```

## 17\. Scheduling — cron

```
# Edit current user's cron
crontab -e

# List cron jobs
crontab -l

# Root's cron
sudo crontab -e
```

Example:

```
# Run backup every day at 2:00 AM
0 2 * * * /usr/local/bin/backup.sh
```

For modern Ubuntu systems, also learn **systemd timers** for scheduled jobs.

## 18\. Time & Timezone

```
# Current time/date
date

# Time configuration
timedatectl

# Set timezone
sudo timedatectl set-timezone Australia/Melbourne

# Enable NTP
sudo timedatectl set-ntp true
```

## 19\. Kernel & Hardware

```
# Kernel
uname -r

# Kernel messages
dmesg
sudo dmesg -T

# CPU
lscpu

# Memory
lsmem

# PCI devices
lspci

# USB devices
lsusb

# Loaded kernel modules
lsmod

# Module information
modinfo module_name
```

## 20\. Environment / Configuration Files Worth Knowing

| File | Purpose |
| --- | --- |
| `/etc/hosts` | Local hostname mappings |
| `/etc/hostname` | System hostname |
| `/etc/fstab` | Persistent filesystem mounts |
| `/etc/passwd` | User accounts |
| `/etc/group` | Groups |
| `/etc/shadow` | Password hashes/account aging |
| `/etc/sudoers` | sudo configuration |
| `/etc/ssh/sshd_config` | SSH server configuration |
| `/etc/resolv.conf` | DNS resolver configuration |
| `/etc/apt/sources.list` | APT repositories |
| `/var/log/` | Traditional log files |
| `/etc/systemd/` | systemd configuration |

For editing `sudoers`, use:

```
sudo visudo
```

rather than directly editing the file.

## 21\. Useful Text Processing

These become extremely powerful when combined with pipes.

```
# First 10 lines
head

# Last 10 lines
tail

# Search
grep "error" logfile

# Case-insensitive search
grep -i "error" logfile

# Count lines
wc -l file

# Sort
sort file

# Unique lines
sort file | uniq

# Replace/filter text
sed 's/old/new/g' file

# Extract columns
awk '{print $1}' file
```

### Pipes

```
ps aux | grep nginx
```

```
sudo ss -tulpn | grep :443
```

```
df -h | grep -v tmpfs
```

The `|` sends the output of one command into another command.

## 22\. Common Troubleshooting Workflow

### Server is slow

```
uptime
free -h
df -h
top
ps aux --sort=-%cpu | head
ps aux --sort=-%mem | head
```

### Service won't start

```
sudo systemctl status SERVICE
sudo journalctl -u SERVICE -n 100 --no-pager
```

Then check configuration:

```
SERVICE --test
```

where the specific application provides an appropriate config-test command.

### Disk is full

```
df -h
df -i
sudo du -xhd1 / | sort -h
sudo du -xhd1 /var | sort -h
```

### Network isn't working

```
ip -br addr
ip route
resolvectl status
ping 8.8.8.8
ping google.com
sudo ss -tulpn
```

### Can't SSH into server

On the server/console:

```
sudo systemctl status ssh
sudo ss -lntp | grep :22
sudo ufw status
sudo journalctl -u ssh -n 100
```

From the client:

```
ssh -vvv user@server
```

## 23\. Commands Worth Memorizing

If you're learning Ubuntu administration, I'd prioritize these:

```
sudo
apt
systemctl
journalctl
ssh
ss
ip
df
du
lsblk
find
grep
chmod
chown
ps
top
kill
tar
crontab
ufw
```

And these combinations are particularly valuable:

```
sudo systemctl status nginx
sudo journalctl -u nginx -f
df -h
sudo du -xhd1 / | sort -h
ps aux --sort=-%cpu | head
ps aux --sort=-%mem | head
sudo ss -lntup
ip -br addr
ip route
sudo ufw status
```

### The "admin survival" mental model

When something breaks, think in this order:

**Is the machine healthy? → Is the service running? → What do the logs say? → Is the network reachable? → Is the firewall blocking it? → Are permissions/configuration correct?**

That sequence will solve a surprisingly large percentage of Ubuntu administration problems.