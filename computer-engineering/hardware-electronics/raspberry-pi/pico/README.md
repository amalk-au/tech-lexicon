# Raspberry Pi Pico

[Back to the topic index](./README.md)

[Pico Resources](./)

The **Raspberry Pi Pico** is a low-cost, high-performance microcontroller board based on the **RP2040**. It is designed for embedded systems, electronics projects, automation, robotics, sensors, and learning MicroPython or C/C++.

## Official Documentation

- [Raspberry Pi Pico Documentation](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

- [Raspberry Pi Pico — Core Electronics](https://core-electronics.com.au/raspberry-pi-pico.html)

---

## Hardware Features

The Raspberry Pi Pico includes:

- **RP2040 microcontroller**, designed by Raspberry Pi

- Dual-core **Arm Cortex-M0+** processor

- Clock speed up to **133 MHz**

- **264 KB SRAM**

- **2 MB onboard QSPI flash**

- **USB 1.1** with device and host support

- Low-power **sleep and dormant modes**

- USB **mass-storage bootloader** for drag-and-drop UF2 programming

- **26 multifunction GPIO pins**

- **2 × SPI** interfaces

- **2 × I²C** interfaces

- **2 × UART** interfaces

- **3 × 12-bit ADC** inputs

- Up to **16 controllable PWM channels**

- Accurate onboard clock and timers

- Built-in **temperature sensor**

- Hardware support for accelerated floating-point operations

- **8 × Programmable I/O (PIO) state machines**

The Pico uses a **castellated module design**, allowing it to be soldered directly onto carrier boards or custom PCBs.

The board also provides a **three-pin Serial Wire Debug (SWD)** interface.

> **Note:** The Raspberry Pi Pico and Pico H use the same RP2040-based hardware. The main physical difference is that the **Pico H** is supplied with pre-soldered headers, while the standard Pico uses castellated/through-hole-compatible pins that can be soldered as required.

---

## Raspberry Pi Pico Pinout

The Pico provides **26 GPIO pins** that can be configured for different peripheral functions.

GPIO can be used for:

- Digital input and output

- LEDs and buttons

- Sensors

- PWM

- UART

- SPI

- I²C

- ADC

- Motor-control interfaces

- Custom PIO peripherals

When working with external electronics, remember that Pico GPIO operates at **3.3 V logic**.

> ⚠️ **Important:** Pico GPIO pins are **not 5 V tolerant**. Do not connect 5 V signals directly to GPIO pins. Motors and other high-current devices should be controlled using an appropriate driver circuit rather than directly from a GPIO pin.

---

# Resetting / Erasing Flash Memory

Pico-series boards have their **BOOTSEL functionality stored in read-only memory inside the RP2040/RP2350**, so normal software cannot overwrite the bootloader.

To enter BOOTSEL mode:

1.  Disconnect the Pico from USB.

2.  Press and hold the **BOOTSEL** button.

3.  Connect the Pico to your computer using USB.

4.  Release the BOOTSEL button.

The Pico should appear as a USB mass-storage device, normally named:

```text
RPI-RP2
```

You can then drag and drop a **UF2 firmware file** onto the drive.

### Completely Erasing Flash

If you need to clear the Pico's flash memory, Raspberry Pi provides a special firmware image called:

```text
flash_nuke.uf2
```

Put the Pico into BOOTSEL mode and copy `flash_nuke.uf2` to the `RPI-RP2` drive.

The Pico will erase its flash memory and reboot.

> **Note:** Erasing the flash does not permanently brick the Pico. BOOTSEL remains available because it is implemented in the RP2040's read-only memory.

---

# Getting Started with MicroPython

**MicroPython** is one of the easiest ways to start programming the Raspberry Pi Pico.

It provides a Python-based programming environment while retaining access to the Pico's GPIO, ADC, PWM, UART, I²C, SPI, and other hardware features.

For many embedded projects, MicroPython provides a good balance between:

- Ease of development

- Fast prototyping

- Hardware access

- Interactive debugging

For applications requiring maximum performance or lower-level hardware control, the **Raspberry Pi Pico C/C++ SDK** can be used instead.

---

## MicroPython Resources

- [Raspberry Pi MicroPython Documentation](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)

- Pico-series Python SDK

### Install MicroPython

1.  Download the appropriate MicroPython **UF2 firmware** for the Raspberry Pi Pico.

2.  Put the Pico into **BOOTSEL mode**.

3.  Connect the Pico to your computer.

4.  Locate the `RPI-RP2` USB drive.

5.  Copy the MicroPython `.uf2` file to the drive.

6.  The Pico will reboot automatically.

After installation, the Pico exposes a USB serial interface that can be used to interact with MicroPython.

---

# MicroPython REPL

When MicroPython starts, it provides an interactive **REPL**.

REPL stands for:

> **Read – Evaluate – Print – Loop**

The REPL allows Python commands to be entered directly and executed immediately.

For example:

```python
print("Hello, Raspberry Pi Pico!")
```

You can also interact directly with GPIO hardware:

```python
from machine import Pin

led = Pin("LED", Pin.OUT)
led.value(1)
```

This makes the REPL particularly useful for:

- Testing hardware

- Checking GPIO connections

- Experimenting with Python

- Debugging

- Quickly testing sensors and peripherals

---

# Connecting to the Pico

MicroPython provides a virtual USB serial interface through the Pico's micro-USB connector.

On Linux, the Pico will commonly appear as:

```text
/dev/ttyACM0
```

Check which serial devices are connected with:

```bash
ls /dev/ttyACM*
```

You can also inspect USB devices with:

```bash
lsusb
```

---

# Linux Serial Port Permissions

On Ubuntu and other Debian-based Linux distributions, your user may need permission to access the serial device.

Add your current user to the `dialout` group:

```bash
sudo usermod -aG dialout $USER
```

Then **log out and log back in**, or reboot.

Check your groups with:

```bash
groups
```

You should see:

```text
dialout
```

Check the serial device permissions:

```bash
ls -l /dev/ttyACM0
```

---

# Using Minicom

**Minicom** is a terminal-based serial communication program that can be used to communicate with the Pico's MicroPython REPL.

Install it with:

```bash
sudo apt update
sudo apt install minicom
```

Connect to the Pico:

```bash
minicom -b 115200 -D /dev/ttyACM0
```

The serial speed normally used for the MicroPython USB REPL is **115200 baud**.

### Exiting Minicom

Press:

```text
CTRL+A
```

then:

```text
Q
```

Confirm that you want to exit.

> **Tip:** You normally do not need `sudo` when accessing `/dev/ttyACM0` after your user has been added to the `dialout` group.

---

# Restarting MicroPython

From the MicroPython REPL, pressing:

```text
CTRL+D
```

performs a **soft reboot**.

The Pico will restart MicroPython and print its startup information, including the firmware version.

This is useful after modifying code or when testing hardware.

---

# Programming with VS Code

Minicom is useful for interacting with the REPL, but it is not intended to be your primary development environment.

For larger projects, **Visual Studio Code** provides a more convenient environment for editing and managing Pico programs.

Recommended features include:

- Syntax highlighting

- Code completion

- Project organisation

- Integrated terminal

- Source-control integration

- MicroPython development support

## Pico-W-Go Extension

The **Pico-W-Go** extension can be used to develop and upload MicroPython programs from VS Code.

Install it from the Visual Studio Code Marketplace:

[Paul Obermeier — Pico-W-Go](https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go)

> **Note:** Although the extension is named Pico-W-Go, it can be used for MicroPython development with compatible Pico boards. Check the extension documentation for current compatibility and configuration details.

---

# Basic MicroPython Example

A simple LED blink program:

```python
from machine import Pin
from time import sleep

led = Pin("LED", Pin.OUT)

while True:
    led.toggle()
    sleep(1)
```

Save the program as:

```text
main.py
```

When `main.py` is saved to the Pico's MicroPython filesystem, MicroPython can execute it automatically when the board starts.

---

# Recommended Project Structure

For projects stored in Git:

```text
raspberry-pi-pico/
├── README.md
├── src/
│   ├── main.py
│   └── ...
├── docs/
│   └── ...
└── hardware/
    └── ...
```

A simple project might look like:

```text
pico-led/
├── README.md
└── main.py
```

For larger projects, keeping source code, documentation, and hardware information separated makes the repository easier to maintain.

---

# Troubleshooting

## Pico does not appear as `RPI-RP2`

Make sure you are entering BOOTSEL mode correctly:

1.  Disconnect USB.

2.  Hold **BOOTSEL**.

3.  Connect USB.

4.  Release **BOOTSEL**.

Then check:

```bash
lsblk
```

or:

```bash
lsusb
```

---

## Pico does not appear as `/dev/ttyACM0`

Check available serial devices:

```bash
ls /dev/ttyACM*
```

Also check:

```bash
dmesg | tail -30
```

If another serial device is present, the Pico may have been assigned a different device name, such as:

```text
/dev/ttyACM1
```

---

## Permission denied

If Minicom or another serial application reports:

```text
Permission denied
```

check that your user belongs to `dialout`:

```bash
groups
```

If necessary:

```bash
sudo usermod -aG dialout $USER
```

Then log out and back in.

---

## MicroPython is not responding

Try:

```text
CTRL+D
```

to perform a soft reboot.

If that does not work, reconnect the USB cable and reopen the serial connection.

If necessary, reinstall the MicroPython UF2 firmware using BOOTSEL mode.

---

# Useful Linux Commands

| Command                             | Purpose                       |
| ----------------------------------- | ----------------------------- |
| `ls /dev/ttyACM*`                   | Find serial devices           |
| `lsusb`                             | List USB devices              |
| `lsblk`                             | List storage devices          |
| \`dmesg                             | tail -30\`                    |
| `groups`                            | Display the user's groups     |
| `ls -l /dev/ttyACM0`                | Check serial-port permissions |
| `minicom -b 115200 -D /dev/ttyACM0` | Connect to the Pico REPL      |

---

# Quick Reference

### Enter BOOTSEL Mode

```text
Hold BOOTSEL → Connect USB → Release BOOTSEL
```

### Install MicroPython

```text
Download UF2 → BOOTSEL → Copy UF2 to RPI-RP2
```

### Find Serial Port

```bash
ls /dev/ttyACM*
```

### Configure Linux Permissions

```bash
sudo usermod -aG dialout $USER
```

### Install Minicom

```bash
sudo apt update
sudo apt install minicom
```

### Connect to MicroPython

```bash
minicom -b 115200 -D /dev/ttyACM0
```

### Soft Reboot

```text
CTRL+D
```

---

# References

- [Raspberry Pi Pico Documentation](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html)

- [Raspberry Pi MicroPython Documentation](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)

- Raspberry Pi Pico Python SDK

- [Raspberry Pi Pico — Core Electronics](https://core-electronics.com.au/raspberry-pi-pico.html)

- [Pico-W-Go — Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go)

---

## Summary

The **Raspberry Pi Pico** is a compact RP2040-based microcontroller suitable for embedded development and electronics projects.

A practical Linux development workflow is:

1.  Install **MicroPython** using BOOTSEL and a UF2 file.

2.  Connect to the MicroPython REPL over USB.

3.  Configure Linux serial permissions with the `dialout` group.

4.  Use **Minicom** for quick interactive testing.

5.  Use **VS Code** and Pico-W-Go for regular development.

6.  Use the Pico's GPIO, ADC, PWM, SPI, I²C, UART, and PIO capabilities to build hardware projects.
