# XC-4410 Duinotech Classic — Ubuntu Setup

[Back to the topic index](../README.md)

Setup guide for the **Jaycar XC-4410 Duinotech Classic**, an Arduino Uno-compatible development board, on Ubuntu Linux.

The XC-4410 uses the **ATmega328P** microcontroller and is compatible with most Arduino Uno sketches, libraries, shields, and modules.

## Hardware

**Board:** Duinotech Classic
**Jaycar Part:** XC-4410
**Arduino Compatibility:** Arduino Uno
**Microcontroller:** ATmega328P
**Clock:** 16 MHz
**Logic Voltage:** 5 V

### Specifications

| Specification         | Value                  |
| --------------------- | ---------------------- |
| Microcontroller       | ATmega328P             |
| CPU                   | 8-bit AVR              |
| Clock Speed           | 16 MHz                 |
| Flash                 | 32 KB                  |
| SRAM                  | 2 KB                   |
| Digital I/O           | 14                     |
| Analog Inputs         | 6                      |
| Operating Voltage     | 5 V                    |
| USB Power             | 5 V                    |
| External Power        | 7–14 V via Vin/DC Jack |
| Dimensions            | 75 × 53 × 13 mm        |
| Arduino Compatibility | Arduino Uno            |

The ATmega328P is removable, which allows it to be replaced if damaged or used separately in breadboard-based projects.

---

# 1\. Prerequisites

This guide assumes Ubuntu 22.04, 24.04, or a newer Ubuntu release.

You will need:

- XC-4410 Duinotech Classic

- USB cable compatible with the board

- Ubuntu Linux computer

- Internet connection

Connect the XC-4410 to your computer using USB.

---

# 2\. Install Arduino IDE

The easiest option is to install the Arduino IDE from the official Arduino website.

Download Arduino IDE:

[https://www.arduino.cc/en/software/](https://www.arduino.cc/en/software/)

After downloading the Linux version, extract it:

```bash
tar -xf arduino-ide_*.tar.xz
```

Enter the extracted directory:

```bash
cd arduino-ide_*
```

Run the installer:

```bash
sudo ./install.sh
```

You should now be able to launch **Arduino IDE** from the Ubuntu application menu.

You can also launch it from the terminal:

```bash
arduino-ide
```

---

# 3\. Connect the XC-4410

Connect the board to your Ubuntu machine using USB.

Check that Ubuntu detects the USB serial device:

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

You may see something similar to:

```text
/dev/ttyUSB0
```

or:

```text
/dev/ttyACM0
```

The exact device name depends on the USB-to-serial interface used by the particular XC-4410 board.

To see which device appeared after connecting the board, you can also run:

```bash
dmesg --follow
```

Then connect the board.

You should see messages indicating that a USB serial device has been attached.

Press:

```text
Ctrl+C
```

to stop watching the kernel log.

---

# 4\. Give Your User Access to the Serial Port

On Ubuntu, your user normally needs to be a member of the `dialout` group to access Arduino serial devices.

Check your groups:

```bash
groups
```

If `dialout` is not listed, add your user:

```bash
sudo usermod -aG dialout $USER
```

Then **log out and log back in**.

Alternatively, reboot:

```bash
sudo reboot
```

After logging back in, verify:

```bash
groups
```

You should now see:

```text
dialout
```

> Do not normally use `sudo` to run Arduino IDE. Adding your user to `dialout` is the preferred solution.

---

# 5\. Configure Arduino IDE

Open Arduino IDE.

Select:

```text
Tools → Board → Arduino AVR Boards → Arduino Uno
```

The XC-4410 is Arduino Uno-compatible, so the **Arduino Uno** board definition should be used.

## Select the Port

Go to:

```text
Tools → Port
```

Select the serial device corresponding to your XC-4410.

For example:

```text
/dev/ttyUSB0
```

or:

```text
/dev/ttyACM0
```

If you're unsure which port is the board, disconnect it, check the available ports, reconnect it, and check again.

For example:

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

---

# 6\. Upload the Blink Example

The best way to verify that everything is working is to upload the standard Blink example.

In Arduino IDE:

```text
File → Examples → 01.Basics → Blink
```

The example should contain code similar to:

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);

  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}
```

Click:

```text
Upload
```

Arduino IDE should compile the program and upload it to the ATmega328P.

If successful, you should see something similar to:

```text
Done uploading.
```

The onboard LED should blink approximately once per second.

---

# 7\. Verify the Board from the Command Line

If you prefer working from the terminal, Arduino sketches can also be built and uploaded using Arduino CLI.

Install Arduino CLI:

[https://arduino.github.io/arduino-cli/](https://arduino.github.io/arduino-cli/)

After installation, initialise the configuration:

```bash
arduino-cli config init
```

Update the board index:

```bash
arduino-cli core update-index
```

Install the AVR core:

```bash
arduino-cli core install arduino:avr
```

Check that the Arduino Uno platform is available:

```bash
arduino-cli board listall | grep "Arduino Uno"
```

You should see the Arduino Uno board definition.

---

# 8\. Compile a Sketch

Assume your project is structured like this:

```text
my-project/
└── my-project.ino
```

Compile it with:

```bash
arduino-cli compile \
  --fqbn arduino:avr:uno \
  my-project
```

The important part is:

```text
arduino:avr:uno
```

This tells Arduino CLI to compile the project for an **Arduino Uno / ATmega328P**.

---

# 9\. Upload from the Command Line

First determine the serial port:

```bash
arduino-cli board list
```

Example:

```text
Port         Protocol Type              Board Name FQBN
/dev/ttyUSB0 serial   Serial Port       Unknown
```

Upload your sketch:

```bash
arduino-cli upload \
  -p /dev/ttyUSB0 \
  --fqbn arduino:avr:uno \
  my-project
```

Replace `/dev/ttyUSB0` with the port shown on your system.

---

# 10\. Serial Monitor

The XC-4410 can communicate with your computer over its USB serial connection.

For example:

```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("Hello from XC-4410!");
  delay(1000);
}
```

Upload the sketch and open the Arduino IDE Serial Monitor.

Set the baud rate to:

```text
9600
```

You should see:

```text
Hello from XC-4410!
Hello from XC-4410!
Hello from XC-4410!
```

Using Arduino CLI, you can also monitor the serial port:

```bash
arduino-cli monitor -p /dev/ttyUSB0
```

Set the baud rate if necessary:

```bash
arduino-cli monitor \
  -p /dev/ttyUSB0 \
  --config baudrate=9600
```

---

# 11\. Pin Configuration

The XC-4410 provides the same basic pin layout as an Arduino Uno.

### Digital Pins

```text
D0  - RX
D1  - TX
D2
D3  - PWM
D4
D5  - PWM
D6  - PWM
D7
D8
D9  - PWM
D10 - PWM / SPI SS
D11 - PWM / SPI MOSI
D12 - SPI MISO
D13 - SPI SCK / onboard LED
```

### Analog Pins

```text
A0
A1
A2
A3
A4 - SDA
A5 - SCL
```

The analog inputs can measure voltages between approximately:

```text
0 V → 5 V
```

They can also be configured for digital I/O.

---

# 12\. Power

The board can be powered through USB or an external power source.

### USB

USB provides:

```text
5 V
```

This is generally the simplest option during development.

### DC Jack / Vin

The board supports approximately:

```text
7–14 V DC
```

through the Vin pin or DC barrel jack.

For normal development, USB power is usually sufficient.

> Do not apply more than the board's specified voltage range to the power input. Also avoid connecting multiple power sources in ways that can cause a power conflict.

---

# 13\. Troubleshooting

## Port does not appear

Check whether Ubuntu detects the board:

```bash
lsusb
```

Then check the kernel log:

```bash
dmesg | tail -50
```

Also check:

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

If nothing appears, try:

- A different USB cable

- A different USB port

- Disconnecting and reconnecting the board

- Checking whether the USB cable supports data

- Checking `dmesg` for USB or serial errors

---

## Permission denied

If Arduino IDE reports something similar to:

```text
Permission denied: '/dev/ttyUSB0'
```

Check your groups:

```bash
groups
```

Add yourself to `dialout`:

```bash
sudo usermod -aG dialout $USER
```

Then log out and back in.

Verify:

```bash
groups
```

---

## Upload fails

Make sure:

```text
Board: Arduino Uno
Port: Correct /dev/ttyUSB* or /dev/ttyACM*
```

Also make sure no other program is currently using the serial port.

For example, close:

- Arduino Serial Monitor

- `arduino-cli monitor`

- `screen`

- `minicom`

- Other serial terminal applications

Then try uploading again.

---

## Wrong board selected

For the XC-4410, use:

```text
Arduino Uno
```

Not:

```text
Arduino Nano
Arduino Mega
Arduino Leonardo
Arduino Micro
```

The XC-4410 is based on the ATmega328P and is designed to be compatible with the Arduino Uno.

---

## `avrdude` upload errors

If you encounter an error such as:

```text
avrdude: stk500_getsync(): not in sync
```

check:

1.  The correct board is selected.

2.  The correct serial port is selected.

3.  The USB cable is connected.

4.  Nothing else is using the serial port.

5.  The board is receiving power.

6.  The ATmega328P is correctly seated in its socket if it has been removed.

---

# 14\. Minimal Test Project

Create a directory:

```bash
mkdir xc4410-blink
cd xc4410-blink
```

Create:

```text
xc4410-blink.ino
```

with:

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);

  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

Compile:

```bash
arduino-cli compile \
  --fqbn arduino:avr:uno \
  .
```

Find the board:

```bash
arduino-cli board list
```

Then upload:

```bash
arduino-cli upload \
  -p /dev/ttyUSB0 \
  --fqbn arduino:avr:uno \
  .
```

Replace `/dev/ttyUSB0` with the port detected on your machine.

---

# 15\. Recommended Project Structure

For projects stored on GitHub, a simple structure is:

```text
project-name/
├── README.md
├── src/
│   └── project-name.ino
└── .gitignore
```

For a simple Arduino CLI project, however, Arduino expects the sketch directory and `.ino` file to have matching names:

```text
project-name/
├── README.md
└── project-name.ino
```

---

# 16\. Useful Commands

### Detect USB devices

```bash
lsusb
```

### Find Arduino serial ports

```bash
ls /dev/ttyUSB* /dev/ttyACM* 2>/dev/null
```

### Monitor kernel USB events

```bash
dmesg --follow
```

### Check user groups

```bash
groups
```

### Add serial-port permissions

```bash
sudo usermod -aG dialout $USER
```

### List Arduino boards

```bash
arduino-cli board list
```

### Compile for XC-4410

```bash
arduino-cli compile --fqbn arduino:avr:uno .
```

### Upload

```bash
arduino-cli upload \
  -p /dev/ttyUSB0 \
  --fqbn arduino:avr:uno \
  .
```

### Serial monitor

```bash
arduino-cli monitor \
  -p /dev/ttyUSB0 \
  --config baudrate=9600
```

---

# 17\. Hardware Summary

The **Jaycar XC-4410 Duinotech Classic** is an Arduino Uno-compatible board based on the removable **ATmega328P**.

The important configuration for software development is:

```text
Board:       Arduino Uno
MCU:         ATmega328P
Architecture: AVR
Clock:       16 MHz
Voltage:     5 V
Digital I/O: 14
Analog Input: 6
Flash:       32 KB
SRAM:        2 KB
```

For Ubuntu development, the key Arduino CLI board identifier is:

```text
arduino:avr:uno
```

Once the Arduino AVR core is installed, standard Arduino Uno sketches and libraries can be used with the XC-4410.
