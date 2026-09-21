# Raspberry Pi Pico

[Back to the topic index](../README.md)

https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html

Raspberry Pi Pico is a low-cost, high-performance microcontroller board with flexible digital interfaces. Key features include:

- RP2040 microcontroller chip designed by Raspberry Pi in the United Kingdom

- Dual-core Arm Cortex M0+ processor, flexible clock running up to 133 MHz

- 264KB of SRAM, and 2MB of on-board flash memory

- USB 1.1 with device and host support

- Low-power sleep and dormant modes

- Drag-and-drop programming using mass storage over USB

- 26 × multi-function GPIO pins

- 2 × SPI, 2 × I2C, 2 × UART, 3 × 12-bit ADC, 16 × controllable PWM channels

- Accurate clock and timer on-chip

- Temperature sensor

- Accelerated floating-point libraries on-chip

- 8 × Programmable I/O (PIO) state machines for custom peripheral support

- The Raspberry Pi Pico comes as a castellated module which allows soldering direct to carrier boards, while the Pico H comes with pre-soldered headers.
  Both boards have a three pin Serial Wire Debug (SWD) header. However, the Pico H has this broken out into a small, keyed, 3-pin connector while the Pico has three castellated through-hole pins adjacent to the edge of the board.

## Resetting Flash memory

For Pico-series devices, BOOTSEL mode lives in read-only memory inside the RP2040 or RP2350 chip, and can’t be overwritten accidentally. No matter what, if you hold down the BOOTSEL button when you plug in your Pico, it will appear as a drive onto which you can drag a new UF2 file. There is no way to brick the board through software. However, there are some circumstances where you might want to make sure your flash memory is empty. You can do this by dragging and dropping a special UF2 binary (flash_nuke.uf2) onto your Pico when it is in mass storage mode.

## Getting Started with Pico

Python is the fastest way to get started with embedded software on Pico-series devices.
Because MicroPython is highly efficient, and RP-series microcontrollers are designed with a disproportionate amount of system memory and processing power for their price, MicroPython is a serious tool for embedded systems development, which does not
compromise on approachability. For exceptionally demanding pieces of software, you can fall back on the SDK

- [Raspberry Pi Pico-series Python SDK](./raspberry-pi-pico-python-sdk.pdf)
- [Download Micro Python Firmware](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html)
- Install the Micro Python firmware into Pico using BOOTSEL
- When MicroPython boots for the first time, it will sit and wait for you to connect and tell it what to do. You can load a .py file from your computer onto the board, but a more immediate way to interact with it is through what is called the read- evaluate-print loop, or REPL (often pronounced similarly to "ripple").
  - Read : MicroPython waits for you to type in some text, followed by the enter key.
  - Evaluate : Whatever you typed is interpreted as Python code, and runs immediately.
  - Print : Any results of the last line you typed are printed out for you to read.
  - Loop : Go back to the start — prompt you for another line of code.
- There are two ways to connect to this REPL, so you can communicate with the MicroPython firmware on your board: over USB, and over the UART serial port on Pico-series GPIOs.
- The MicroPython firmware is equipped with a virtual USB serial port which is accessed through the micro USB connector on Pico-series devices. Your computer should notice this serial port and list it as a character device, most likely `/dev/ttyACM0`
- Install minicom `sudo apt install minicom` minicom is a text-based serial communication program for Unix/Linux systems. It's like a terminal emulator that lets you communicate with devices over a serial port — like microcontrollers (e.g. Raspberry Pi Pico, Arduino)
- You can either add your linux user name to dial out group `sudo usermod -aG dialout $USER`
- To connect to Pico `sudo minicom -b 115200 -D /dev/ttyACM0` To exit Minicom press `CTRL+A` then `Q`
- If you press `CTRL-D` on your keyboard tells MicroPython to reboot. You can do this at any time. When it reboots, MicroPython will print out a message saying exactly what firmware version it is running, and when it was built.
- Above is only for sending individual commands, it is recommended to use VS code for coding the Pico
- Make sure to install the VS Code extension`https://marketplace.visualstudio.com/items?itemName=paulober.pico-w-go`
