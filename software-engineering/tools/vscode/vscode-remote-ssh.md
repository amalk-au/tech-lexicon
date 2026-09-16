# VS Code remote development using SSH & remote Ubuntu Server

[Back to the topic index](./README.md)

Connecting VS Code to an Ubuntu server is incredibly seamless using the official **Remote - SSH** extension. Once configured, you can edit files, run terminals, and debug code directly on your server just like you would locally.

Here is the step-by-step guide to setting it up:

---

## Step 1: Prepare Your Ubuntu Server

First, make sure your Ubuntu server has an SSH server running. Open your local terminal (or Command Prompt) and test if you can connect natively:

```bash
ssh username@your_server_ip

```

* *If you can't connect,* you may need to install SSH on Ubuntu first by running `sudo apt update && sudo apt install openssh-server -y` on the server.

---

## Step 2: Install the Remote Extension in VS Code

1. Open **VS Code** on your local machine.
2. Click on the **Extensions** icon on the left sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for **Remote - SSH** (published by Microsoft) and click **Install**.

---

## Step 3: Configure and Connect to Your Server

There are two ways to connect. Using an SSH configuration file is highly recommended so you don't have to type your IP address every time.

### The Best Way: Use an SSH Config File

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette.
2. Type and select: **Remote-SSH: Open SSH Configuration File...**
3. Choose your local user configuration file (usually `~/.ssh/config`).
4. Add your server details like this:

```text
Host ubuntu-server
    HostName your_server_ip_or_domain
    User your_ubuntu_username

```

5. Save and close the file.

### Actually Connecting

1. Click the **green icon** ($><$) in the very bottom-left corner of your VS Code window.
2. Select **Connect to Host...**
3. Choose `ubuntu-server` (or type `username@your_server_ip` if you skipped the config file).
4. A new VS Code window will open. It will ask you to select the platform; choose **Linux**.
5. Enter your Ubuntu user password when prompted.

> **Success!** Look at the bottom-left corner again—you should now see `SSH: ubuntu-server`.

---

## Step 4: Open Your Remote Project Folder

Now that you are connected:

1. Go to **File > Open Folder** (or click "Open Folder" in the Explorer sidebar).
2. It will show you the file directory *of your Ubuntu server*. Select the folder you want to work out of (e.g., `/home/username/my-project`) and click **OK**.
3. Enter your password again if prompted.

---

## 💡 Pro-Tips for a Better Experience

* **Set up SSH Key Authentication:** To avoid entering your password every single time you connect or save a file, generate an SSH key locally using `ssh-keygen` and copy it to your server using `ssh-copy-id username@your_server_ip`.
* **Extension Isolation:** Extensions like Python, Prettier, or GitLens will need to be installed *on the server*. When you look at your Extensions tab while connected, you’ll see a section titled "Install on SSH: ubuntu-server".
* **Port Forwarding:** If you run a web server on Ubuntu (like a Node.js or Python app on port `8000`), VS Code will automatically forward it. You can access it on your local laptop's browser by typing `localhost:8000`. You can manage this in the **Ports** tab at the bottom.