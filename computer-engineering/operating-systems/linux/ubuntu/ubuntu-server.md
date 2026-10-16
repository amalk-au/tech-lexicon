# Ubuntu Server

## Connect to Ubuntu server from Bash terminal
- `ssh username@remote_server_ip`
- i.e. `ssh engineer@192.168.122.59`

## Install GUI

- Update Your System : `sudo apt update && sudo apt upgrade -y`
- Install XFCE (Xubuntu) – Lightweight & Fast : `sudo apt install xubuntu-desktop -y`
- Select display manager
 - Choose GDM3 if you are using the default Ubuntu Desktop (GNOME) and want flawless support for modern features like Wayland, lock screen notifications, and easy user switching.

 - Choose LightDM if you are running a lightweight desktop (XFCE/Xubuntu, LXQt/Lubuntu), are low on RAM, or want a highly customizable, lightweight login screen.
- Restart Your Server : `sudo reboot`

## Switch back to booting directly into the command line
- If you ever want to switch back to booting directly into the command line without uninstalling the GUI, you can change the default target with this command: `sudo systemctl set-default multi-user.target`

## Switch it back to the GUI
- And to switch it back to the GUI: `sudo systemctl set-default graphical.target`

## Manualy start the GUI from CLI
- `sudo systemctl start lightdm`

## Uninstall GUI
- If you installed the Xubuntu desktop and realized you want to revert your Ubuntu Server back to a clean, lightweight, CLI-only state, you can completely uninstall it.
- Because desktop environments install hundreds of individual packages (dependencies), a simple apt remove isn't quite enough. Follow these steps to cleanly purge the GUI and free up your system resources.
- Step 1: Remove the Desktop Packages : `sudo apt purge xubuntu-desktop xfce4* lightdm -y`
- Step 2: Clean Up Leftover Dependencies : `sudo apt autoremove --purge -y`
- Ensure Your Server Boots to the Command Line : `sudo systemctl set-default multi-user.target`
- Reboot and Verify : `sudo reboot`