# Raspberry Pi 4 Model B — 8 GB

Documentation, setup instructions, Linux notes, Docker configuration, and project references for the **Raspberry Pi 4 Model B with 8 GB LPDDR4 RAM**.

The Raspberry Pi is a compact single-board computer designed for education, experimentation, software development, electronics, networking, automation, robotics, servers, and embedded projects.

---

# Table of Contents

- [Raspberry Pi 4 Model B — 8 GB](#raspberry-pi-4-model-b--8-gb)
- [Table of Contents](#table-of-contents)
- [Raspberry Pi Basics](#raspberry-pi-basics)
  - [What Is a Raspberry Pi?](#what-is-a-raspberry-pi)
  - [Raspberry Pi Models](#raspberry-pi-models)
- [Getting Started](#getting-started)
- [First Steps](#first-steps)
  - [1. Install the Operating System](#1-install-the-operating-system)
  - [2. Connect Peripherals](#2-connect-peripherals)
  - [3. Complete Initial Configuration](#3-complete-initial-configuration)
- [Basic Linux Commands](#basic-linux-commands)
  - [List Files](#list-files)
  - [Change Directory](#change-directory)
  - [Create a Directory](#create-a-directory)
  - [Remove a File](#remove-a-file)
  - [Move or Rename](#move-or-rename)
  - [Copy](#copy)
  - [Edit a File](#edit-a-file)
- [Programming](#programming)
- [GPIO Pins](#gpio-pins)
    - [Important GPIO Warning](#important-gpio-warning)
- [Advanced Raspberry Pi Information](#advanced-raspberry-pi-information)
  - [Headless Operation](#headless-operation)
- [Project Possibilities](#project-possibilities)
- [Hardware Expansion](#hardware-expansion)
- [Performance and Models](#performance-and-models)
- [Operating Systems](#operating-systems)
    - [Raspberry Pi OS](#raspberry-pi-os)
    - [Ubuntu](#ubuntu)
- [Security](#security)
- [Learning Resources](#learning-resources)
    - [Official Raspberry Pi Documentation](#official-raspberry-pi-documentation)
    - [Getting Started](#getting-started-1)
    - [Raspberry Pi Projects](#raspberry-pi-projects)
    - [Official Beginner's Guide](#official-beginners-guide)
- [Raspberry Pi 4 Model B Specifications](#raspberry-pi-4-model-b-specifications)
  - [Display](#display)
- [Initial Setup](#initial-setup)
- [Terminal Configuration](#terminal-configuration)
  - [Configure the Default Terminal](#configure-the-default-terminal)
- [OpenVPN](#openvpn)
- [Headless Operation](#headless-operation-1)
- [Virtual Desktop with VNC](#virtual-desktop-with-vnc)
  - [Start a Virtual Desktop](#start-a-virtual-desktop)
  - [Stop a Virtual Desktop](#stop-a-virtual-desktop)
- [Docker](#docker)
  - [Update the System](#update-the-system)
  - [Install Docker](#install-docker)
- [Run Docker Without `sudo`](#run-docker-without-sudo)
- [Test Docker](#test-docker)
- [WebGoat on Raspberry Pi](#webgoat-on-raspberry-pi)
    - [Credentials](#credentials)
- [Finding the Raspberry Pi IP Address](#finding-the-raspberry-pi-ip-address)
- [Useful System Commands](#useful-system-commands)
  - [CPU Information](#cpu-information)
  - [Memory](#memory)
  - [Disk Usage](#disk-usage)
  - [USB Devices](#usb-devices)
  - [Running Processes](#running-processes)
  - [Kernel Information](#kernel-information)
  - [Raspberry Pi Model](#raspberry-pi-model)
- [Useful Network Commands](#useful-network-commands)
  - [Network Interfaces](#network-interfaces)
  - [Routing Table](#routing-table)
  - [Hostname](#hostname)
  - [IP Address](#ip-address)
  - [Test Internet Connectivity](#test-internet-connectivity)
  - [Test DNS](#test-dns)
  - [Check Listening Ports](#check-listening-ports)
- [Recommended Project Organisation](#recommended-project-organisation)
- [Managing Secrets](#managing-secrets)
- [Security Considerations](#security-considerations)
- [Quick Reference](#quick-reference)
  - [System](#system)
  - [Network](#network)
  - [Terminal](#terminal)
  - [VPN](#vpn)
  - [VNC](#vnc)
  - [Docker](#docker-1)
- [Summary](#summary)
- [References](#references)
    - [Raspberry Pi](#raspberry-pi)
    - [Raspberry Pi Documentation](#raspberry-pi-documentation)
    - [Raspberry Pi Getting Started](#raspberry-pi-getting-started)
    - [Raspberry Pi Projects](#raspberry-pi-projects-1)
    - [Official Raspberry Pi Beginner's Guide](#official-raspberry-pi-beginners-guide)
    - [Arduino Starter Projects](#arduino-starter-projects)

---

# Raspberry Pi Basics

## What Is a Raspberry Pi?

A **Raspberry Pi** is a small, affordable single-board computer.

Unlike a microcontroller such as an Arduino, a Raspberry Pi runs a complete operating system and can perform many of the same tasks as a conventional computer.

It can be connected to:

- Monitor

- Keyboard

- Mouse

- Ethernet

- Wi-Fi

- USB devices

- Cameras

- Displays

- Sensors

- Motors

- Other electronics

The most common operating system is **Raspberry Pi OS**, a Linux-based operating system maintained for Raspberry Pi hardware.

A Raspberry Pi can therefore be used for both software development and hardware projects.

---

## Raspberry Pi Models

The Raspberry Pi family includes a range of boards designed for different applications.

Examples include:

- Raspberry Pi Zero

- Raspberry Pi Zero 2 W

- Raspberry Pi 3

- Raspberry Pi 4

- Raspberry Pi 5

- Raspberry Pi Compute Module

Different models provide different combinations of:

- CPU performance

- RAM

- USB connectivity

- Networking

- Wireless connectivity

- GPIO capabilities

- Display support

- Storage options

- Power requirements

This repository focuses primarily on the:

> **Raspberry Pi 4 Model B — 8 GB**

---

# Getting Started

A basic Raspberry Pi setup requires:

- Raspberry Pi board

- Compatible power supply

- microSD card

- Operating system

- Network connection

For a traditional desktop setup, you can additionally use:

- Monitor

- Keyboard

- Mouse

- HDMI cable

For a **headless setup**, a monitor and keyboard are not required. The Pi can instead be configured and administered remotely over the network.

---

# First Steps

## 1\. Install the Operating System

Use **Raspberry Pi Imager** to install Raspberry Pi OS onto a microSD card.

The official documentation is available here:

[https://www.raspberrypi.com/documentation/computers/getting-started.html](https://www.raspberrypi.com/documentation/computers/getting-started.html)

The basic process is:

```text
Raspberry Pi Imager
        │
        ▼
Select Raspberry Pi
        │
        ▼
Select Operating System
        │
        ▼
Select microSD Card
        │
        ▼
Write Image
        │
        ▼
Insert microSD Card
        │
        ▼
Power Raspberry Pi
```

---

## 2\. Connect Peripherals

For a desktop installation:

```text
Raspberry Pi
   │
   ├── Monitor
   ├── Keyboard
   ├── Mouse
   ├── Network
   └── Power
```

For a headless installation:

```text
Raspberry Pi
   │
   ├── Network
   └── Power
        │
        ▼
     SSH / VNC
        │
        ▼
 Remote Computer
```

---

## 3\. Complete Initial Configuration

During the first boot:

1.  Configure the user account.

2.  Configure networking.

3.  Configure regional settings.

4.  Update the operating system.

5.  Install required software.

6.  Enable remote-access services if required.

Update the system:

```bash
sudo apt update
sudo apt upgrade -y
```

---

# Basic Linux Commands

Because Raspberry Pi OS is Linux-based, basic command-line knowledge is extremely useful.

## List Files

```bash
ls
```

Detailed listing:

```bash
ls -la
```

## Change Directory

```bash
cd <directory>
```

Go to the home directory:

```bash
cd ~
```

Go up one directory:

```bash
cd ..
```

## Create a Directory

```bash
mkdir <directory>
```

Example:

```bash
mkdir projects
```

## Remove a File

```bash
rm <file>
```

Remove an empty directory:

```bash
rmdir <directory>
```

> Be careful with `rm`. Deleted files are not normally moved to a recycle bin.

## Move or Rename

```bash
mv <source> <destination>
```

Example:

```bash
mv old-name.txt new-name.txt
```

## Copy

```bash
cp <source> <destination>
```

## Edit a File

Using Nano:

```bash
nano <filename>
```

Save with:

```text
Ctrl + O
```

Exit with:

```text
Ctrl + X
```

---

# Programming

The Raspberry Pi is a full Linux computer and supports many programming languages.

Common choices include:

- Python

- C

- C++

- JavaScript / Node.js

- Java

- Go

- Rust

- Bash

- Scratch

Python is particularly common for Raspberry Pi projects because it provides a straightforward interface for scripting, automation, networking, and GPIO projects.

Example:

```python
print("Hello, Raspberry Pi!")
```

Run it with:

```bash
python3 hello.py
```

---

# GPIO Pins

The Raspberry Pi includes a **40-pin GPIO header**.

GPIO stands for:

> **General Purpose Input/Output**

GPIO pins allow software to interact with external electronics.

Examples include:

- LEDs

- Buttons

- Sensors

- Relays

- Displays

- Servo motors

- Motor controllers

- HATs

A typical GPIO workflow is:

```text
Sensor
  │
  ▼
GPIO Input
  │
  ▼
Raspberry Pi
  │
  ▼
Application
  │
  ▼
GPIO Output
  │
  ▼
LED / Relay / Controller
```

### Important GPIO Warning

Raspberry Pi GPIO operates at **3.3 V logic**.

GPIO pins are **not 5 V tolerant**.

Do not connect a 5 V signal directly to a Raspberry Pi GPIO input unless the circuit includes appropriate level shifting or protection.

Motors and other high-current devices should also not be powered directly from GPIO pins. Use an appropriate driver circuit and external power supply.

---

# Advanced Raspberry Pi Information

## Headless Operation

A Raspberry Pi can operate without a monitor, keyboard, or mouse.

This is known as **headless operation**.

It is particularly useful for:

- Servers

- IoT projects

- Robotics

- Network services

- Home automation

- VPN gateways

- Remote development

- Docker hosts

The Pi can be administered using SSH:

```bash
ssh <username>@<raspberry-pi-ip>
```

For graphical applications, VNC can provide remote desktop access.

---

# Project Possibilities

A Raspberry Pi can be used for a wide range of projects.

Examples include:

- Home automation

- Web servers

- File servers

- VPN servers

- Media centres

- Retro gaming

- Network monitoring

- Robotics

- Computer vision

- IoT systems

- Security laboratories

- Docker hosts

- Development environments

- Database servers

- Automation systems

The Raspberry Pi ecosystem also has a large community and extensive collection of tutorials, libraries, projects, and documentation.

---

# Hardware Expansion

The 40-pin GPIO header allows additional hardware to be connected.

Common expansion hardware includes **HATs**.

HAT stands for:

> **Hardware Attached on Top**

Examples include:

- Motor controllers

- Sensor boards

- ADC boards

- Relay boards

- OLED/LCD displays

- Audio boards

- Environmental sensors

- Robotics controllers

GPIO can also be used directly with suitable electronic components.

---

# Performance and Models

Newer Raspberry Pi models generally provide increased CPU and GPU performance, faster storage interfaces, improved networking, and additional peripheral capabilities.

For example, the Raspberry Pi 5 provides significantly more processing performance than the Raspberry Pi 4.

However, power requirements vary between models.

Always use a power supply appropriate for the specific Raspberry Pi model.

---

# Operating Systems

The Raspberry Pi supports a variety of operating systems.

Common options include:

### Raspberry Pi OS

The standard Raspberry Pi operating system.

Available in desktop and lightweight/server-oriented configurations.

### Ubuntu

Ubuntu provides a familiar Linux environment and is useful for:

- Development

- Servers

- Containers

- Software engineering

- Cloud-native workloads

Other specialised operating systems are available for applications such as:

- Media centres

- Retro gaming

- Network appliances

- Security testing

- Home automation

---

# Security

A Raspberry Pi connected to a network should be treated like any other computer.

Recommended practices include:

- Keep the operating system updated.

- Use strong passwords.

- Prefer SSH keys for SSH access.

- Disable services you do not need.

- Avoid exposing unnecessary services to the Internet.

- Use a firewall where appropriate.

- Keep Docker images updated.

- Do not commit credentials to Git.

- Protect API keys and private keys.

- Back up important data.

Check listening services:

```bash
sudo ss -tulpn
```

---

# Learning Resources

Useful resources include the official Raspberry Pi documentation and project library.

### Official Raspberry Pi Documentation

[https://www.raspberrypi.com/documentation/](https://www.raspberrypi.com/documentation/)

### Getting Started

[https://www.raspberrypi.com/documentation/computers/getting-started.html](https://www.raspberrypi.com/documentation/computers/getting-started.html)

### Raspberry Pi Projects

[https://projects.raspberrypi.org/en/projects/raspberry-pi-getting-started](https://projects.raspberrypi.org/en/projects/raspberry-pi-getting-started)

### Official Beginner's Guide

[https://www.raspberrypi.com/news/available-now-the-official-raspberry-pi-beginners-guide-5th-edition/](https://www.raspberrypi.com/news/available-now-the-official-raspberry-pi-beginners-guide-5th-edition/)

---

# Raspberry Pi 4 Model B Specifications

This repository focuses on the **8 GB Raspberry Pi 4 Model B**.

| Feature               | Specification                    |
| --------------------- | -------------------------------- |
| CPU                   | 1.5 GHz quad-core ARM Cortex-A72 |
| Architecture          | 64-bit ARM                       |
| GPU                   | VideoCore VI                     |
| Hardware Video Decode | H.265 / HEVC up to 4Kp60         |
| Ethernet              | Gigabit Ethernet                 |
| Wi-Fi                 | 2.4 GHz / 5 GHz IEEE 802.11ac    |
| Bluetooth             | Bluetooth 5.0 / BLE              |
| USB                   | 2 × USB 3.0, 2 × USB 2.0         |
| Display               | 2 × micro-HDMI                   |
| RAM                   | 8 GB LPDDR4                      |
| Storage               | microSD / SDXC                   |
| Power                 | USB-C                            |
| GPIO                  | 40-pin header                    |

## Display

The Raspberry Pi 4 has two micro-HDMI ports.

Depending on the configuration, it can support:

- One display at up to 4Kp60

- Two displays at up to 4Kp30

---

# Initial Setup

After installing Raspberry Pi OS, update the system:

```bash
sudo apt update
sudo apt upgrade -y
```

Reboot:

```bash
sudo reboot
```

Check the operating system:

```bash
cat /etc/os-release
```

Check the kernel:

```bash
uname -a
```

Check the architecture:

```bash
uname -m
```

A 64-bit installation should normally report:

```text
aarch64
```

---

# Terminal Configuration

Some applications may require the `xterm` package.

Check whether it is installed:

```bash
dpkg -l | grep xterm
```

If it is not installed:

```bash
sudo apt update
sudo apt install -y xterm
```

---

## Configure the Default Terminal

To select the default terminal emulator:

```bash
sudo update-alternatives --config x-terminal-emulator
```

Select the desired terminal from the available options.

---

# OpenVPN

To terminate all currently running OpenVPN processes:

```bash
sudo killall openvpn
```

> **Warning:** This terminates all OpenVPN processes. Use this only when you intentionally want to disconnect active VPN connections.

---

# Headless Operation

If the Raspberry Pi is being used as a server, robot controller, or embedded computer, it may not have a monitor attached.

SSH is generally the simplest way to administer a headless Raspberry Pi.

```bash
ssh <username>@<raspberry-pi-ip>
```

For graphical access, VNC can be used.

---

# Virtual Desktop with VNC

A VNC server can provide a graphical desktop that can be accessed remotely.

## Start a Virtual Desktop

Run:

```bash
vncserver
```

The server will report a display number, for example:

```text
New desktop is raspberrypi:1
```

The display is:

```text
:1
```

The corresponding VNC port is typically:

```text
5901
```

Connect from your remote computer using a compatible VNC client.

For example:

```text
192.168.20.16:1
```

---

## Stop a Virtual Desktop

To stop display `:1`:

```bash
vncserver -kill :1
```

Replace `:1` with the display number of the session you want to terminate.

---

# Docker

Docker allows applications to run in isolated containers.

## Update the System

```bash
sudo apt update
sudo apt upgrade -y
```

## Install Docker

Download the Docker installation script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
```

Run it:

```bash
sudo sh get-docker.sh
```

Verify the installation:

```bash
sudo docker version
```

Check Docker:

```bash
sudo docker info
```

---

# Run Docker Without `sudo`

Add your user to the Docker group:

```bash
sudo usermod -aG docker $USER
```

Log out and back in for the group membership to take effect.

Check:

```bash
groups
```

You should see:

```text
docker
```

Then test:

```bash
docker version
```

and:

```bash
docker info
```

> **Security note:** Membership in the `docker` group effectively provides root-level control over the host. Only grant this permission to trusted users.

---

# Test Docker

Run:

```bash
docker run hello-world
```

A successful execution will download the test image and print a confirmation message.

---

# WebGoat on Raspberry Pi

Docker can also be used to run WebGoat in a container.

If you are using the ARM-compatible image referenced by the original setup:

```bash
docker pull cambarts/webgoat-8.0-rpi
```

Start the container:

```bash
docker run -p 8080:8080 -t cambarts/webgoat-8.0-rpi
```

WebGoat should then be accessible on port `8080`.

For example:

```text
http://<raspberry-pi-ip>:8080/WebGoat
```

Example:

```text
http://192.168.20.16:8080/WebGoat
```

> Replace the example IP address with the current address of your Raspberry Pi.

### Credentials

Do **not** commit WebGoat usernames, passwords, API keys, or other secrets to a public GitHub repository.

If the container image uses default credentials, configure them locally and change them where supported.

---

# Finding the Raspberry Pi IP Address

Display the current IP address:

```bash
hostname -I
```

For detailed network information:

```bash
ip addr
```

View the routing table:

```bash
ip route
```

Display the hostname:

```bash
hostname
```

---

# Useful System Commands

## CPU Information

```bash
lscpu
```

## Memory

```bash
free -h
```

## Disk Usage

```bash
df -h
```

## USB Devices

```bash
lsusb
```

## Running Processes

```bash
ps aux
```

## Kernel Information

```bash
uname -a
```

## Raspberry Pi Model

```bash
cat /proc/device-tree/model
```

---

# Useful Network Commands

## Network Interfaces

```bash
ip addr
```

## Routing Table

```bash
ip route
```

## Hostname

```bash
hostname
```

## IP Address

```bash
hostname -I
```

## Test Internet Connectivity

```bash
ping 8.8.8.8
```

## Test DNS

```bash
ping google.com
```

## Check Listening Ports

```bash
sudo ss -tulpn
```

---

# Recommended Project Organisation

A useful repository structure is:

```text
raspberry-pi/
│
├── README.md
│
├── scripts/
│   ├── setup.sh
│   └── backup.sh
│
├── docker/
│   ├── compose.yaml
│   └── README.md
│
├── projects/
│   ├── gpio/
│   ├── automation/
│   └── robotics/
│
├── services/
│   └── ...
│
└── docs/
    └── ...
```

---

# Managing Secrets

Never commit sensitive information to GitHub.

Avoid storing the following directly in source code:

- Passwords

- API keys

- SSH private keys

- VPN credentials

- Database credentials

- TLS private keys

- Application secrets

A local `.env` file can be used for development:

```text
.env
```

Add it to `.gitignore`:

```gitignore
.env
*.key
*.pem
```

---

# Security Considerations

If the Raspberry Pi is connected to a network:

- Keep Raspberry Pi OS updated.

- Use strong, unique passwords.

- Prefer SSH keys.

- Disable unnecessary services.

- Use a firewall where appropriate.

- Avoid exposing administrative interfaces to the public Internet.

- Keep Docker images updated.

- Protect secrets.

- Back up important data.

- Review listening services periodically.

Check listening services:

```bash
sudo ss -tulpn
```

---

# Quick Reference

## System

```bash
sudo apt update && sudo apt upgrade -y
```

```bash
cat /proc/device-tree/model
```

```bash
uname -a
```

```bash
free -h
```

```bash
df -h
```

## Network

```bash
hostname -I
```

```bash
ip addr
```

```bash
ip route
```

## Terminal

```bash
sudo apt install -y xterm
```

```bash
sudo update-alternatives --config x-terminal-emulator
```

## VPN

```bash
sudo killall openvpn
```

## VNC

```bash
vncserver
```

```bash
vncserver -kill :1
```

## Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

```bash
sudo usermod -aG docker $USER
```

```bash
docker run hello-world
```

---

# Summary

The Raspberry Pi provides a flexible platform that sits between a traditional computer and a microcontroller.

It can be used for:

```text
Programming
    │
    ├── Python
    ├── C/C++
    ├── JavaScript
    └── Other languages
    │
    ▼
Linux
    │
    ├── Servers
    ├── Docker
    ├── Networking
    └── Automation
    │
    ▼
GPIO
    │
    ├── Sensors
    ├── LEDs
    ├── Displays
    ├── Motors
    └── HATs
```

A good learning progression is to start with basic Linux and Python, then move into GPIO and electronics, followed by networking, Docker, automation, and more advanced services.

---

# References

### Raspberry Pi

[https://www.raspberrypi.com/](https://www.raspberrypi.com/)

### Raspberry Pi Documentation

[https://www.raspberrypi.com/documentation/](https://www.raspberrypi.com/documentation/)

### Raspberry Pi Getting Started

[https://www.raspberrypi.com/documentation/computers/getting-started.html](https://www.raspberrypi.com/documentation/computers/getting-started.html)

### Raspberry Pi Projects

[https://projects.raspberrypi.org/en/projects/raspberry-pi-getting-started](https://projects.raspberrypi.org/en/projects/raspberry-pi-getting-started)

### Official Raspberry Pi Beginner's Guide

[https://www.raspberrypi.com/news/available-now-the-official-raspberry-pi-beginners-guide-5th-edition/](https://www.raspberrypi.com/news/available-now-the-official-raspberry-pi-beginners-guide-5th-edition/)

### Arduino Starter Projects

[https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/](https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/)
