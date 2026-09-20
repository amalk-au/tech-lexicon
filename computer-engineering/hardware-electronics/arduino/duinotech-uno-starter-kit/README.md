# Arduino Starter Kit — XC3902

[Back to the topic index](../README.md)

A beginner-friendly Arduino starter kit from **Jaycar / TechBrands**, designed to introduce the fundamentals of Arduino programming, digital I/O, analog input, PWM, LEDs, buttons, buzzers, motors, and simple circuits.

The kit includes an Arduino Uno-compatible **Duinotech Uno**, a breadboard, jumper wires, LEDs, resistors, potentiometer, tactile switches, buzzer, motor and fan.

---

## Contents

- [Overview](#overview)

- [Included Hardware](#included-hardware)

- [Getting Started](#getting-started)

- [Breadboard](#breadboard)

- [Projects](#projects)
  - [1\. Using an LED](#1-using-an-led)

  - [2\. Using a Potentiometer](#2-using-a-potentiometer)

  - [3\. Using Buttons](#3-using-buttons)

  - [4\. Fan Speed Controller](#4-fan-speed-controller)

  - [5\. Traffic Lights](#5-traffic-lights)

- [Arduino Concepts Covered](#arduino-concepts-covered)

- [Project Structure](#project-structure)

- [Official Project Code](#official-project-code)

- [Safety Notes](#safety-notes)

- [Hardware Information](#hardware-information)

- [Credits](#credits)

---

# Overview

The **XC3902 Arduino Starter Kit** is designed as an introduction to Arduino development and basic electronics.

The included projects progressively introduce:

- Digital outputs

- Digital inputs

- Analog inputs

- PWM

- LEDs

- Resistors

- Potentiometers

- Tactile switches

- Buzzers

- DC motors

- Breadboards

- Loops

- Basic sensor feedback

- Simple circuit construction

The kit uses a **Duinotech Uno**, which is Arduino Uno compatible.

This means standard Arduino Uno sketches and many Arduino libraries can be used with the included board.

---

# Included Hardware

The XC3902 kit contains:

| Component        | Quantity / Description                   |
| ---------------- | ---------------------------------------- |
| Duinotech Uno    | Arduino Uno-compatible development board |
| USB Cable        | Used for programming and USB power       |
| Breadboard       | Solderless prototyping board             |
| Jumper Leads     | Circuit connections                      |
| LEDs             | Light-emitting diodes                    |
| Resistors        | Current limiting and circuit components  |
| Potentiometer    | Variable resistor / analog input         |
| Tactile Switches | Push-button input                        |
| Buzzer           | Audible output                           |
| Motor & Fan      | DC motor output                          |
| User Manual      | Project instructions                     |

---

# Getting Started

## Requirements

You will need:

- XC3902 Arduino Starter Kit

- Computer

- USB cable

- Arduino IDE

- Ubuntu, Windows, or macOS

For Ubuntu, see the Arduino setup instructions in the repository or use the official Arduino IDE:

[https://www.arduino.cc/en/software/](https://www.arduino.cc/en/software/)

---

## Connect the Arduino

Connect the Duinotech Uno to your computer using the supplied USB cable.

The USB connection provides:

- Power

- Serial communication

- Program upload

In Arduino IDE, select:

```text
Tools → Board → Arduino Uno
```

Then select the appropriate serial port:

```text
Tools → Port
```

The exact port depends on your operating system and USB interface.

---

# Breadboard

The included breadboard is a solderless prototyping board used to build the circuits for the projects in this kit.

The breadboard is labelled to help identify:

- Positive power rail

- Negative/ground rail

- Columns

- Rows

A simplified representation is:

```text
          Breadboard
    ┌─────────────────────┐
    │ + + + + + + + + + │  Positive rail
    │ - - - - - - - - - │  Negative rail
    │                     │
    │ a b c d e   f g h i j
    │ ● ● ● ● ●   ● ● ● ● ●
    │ ● ● ● ● ●   ● ● ● ● ●
    │ ● ● ● ● ●   ● ● ● ● ●
    │                     │
    │ a b c d e   f g h i j
    └─────────────────────┘
```

The central gap separates the two sides of the breadboard and is commonly used when inserting DIP ICs.

> **Important:** Breadboard layouts can vary. Always verify the connections against the markings on the supplied breadboard.

---

# Projects

The XC3902 manual contains five introductory projects.

---

# 1\. Using an LED

## Objective

Learn how to control an LED using an Arduino digital output.

This is the basic Arduino electronics project and introduces:

- Digital outputs

- `pinMode()`

- `digitalWrite()`

- `delay()`

- Current-limiting resistors

## Parts Required

- 1 × LED

- 1 × resistor

- 2 × jumper wires

## Basic Circuit

A typical LED circuit is:

```text
Arduino Digital Pin
       │
       │
    Resistor
       │
       │
      LED
       │
       │
      GND
```

The resistor limits the current flowing through the LED.

## Example Code

```cpp
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);

  digitalWrite(LED_PIN, LOW);
  delay(1000);
}
```

This turns the LED on for one second and off for one second.

---

# 2\. Using a Potentiometer

## Objective

Use a potentiometer as an analog input to control LED brightness.

This project introduces:

- Analog inputs

- Analog-to-digital conversion

- PWM

- `analogRead()`

- `analogWrite()`

- Variable input values

## Parts Required

- 1 × potentiometer

- 6 × jumper wires

## Concept

A potentiometer provides a variable voltage.

The Arduino reads this voltage using an analog input:

```text
Potentiometer
      │
      ▼
   Analog Pin
      │
      ▼
  analogRead()
      │
      ▼
   Arduino
      │
      ▼
  analogWrite()
      │
      ▼
     LED
```

The potentiometer position determines the LED brightness.

## Example

```cpp
const int POT_PIN = A0;
const int LED_PIN = 9;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int value = analogRead(POT_PIN);

  int brightness = map(value, 0, 1023, 0, 255);

  analogWrite(LED_PIN, brightness);
}
```

### Why `map()` is required

On an Arduino Uno:

```text
analogRead()  → 0–1023
analogWrite() → 0–255
```

Therefore, the potentiometer value needs to be converted to the PWM range.

---

# 3\. Using Buttons

## Objective

Use a button as an input and activate a buzzer based on the button state.

This project introduces:

- Digital inputs

- Tactile switches

- Conditional logic

- `digitalRead()`

- Buzzers

## Parts Required

- 1 × tactile switch

- 1 × buzzer

- 7 × jumper wires

## Basic Concept

```text
Button
   │
   ▼
Arduino Digital Input
   │
   ▼
Check Button State
   │
   ▼
Buzzer
```

The Arduino continuously checks the button.

When the button is pressed, the buzzer can be activated.

## Example Code

```cpp
const int BUTTON_PIN = 2;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BUTTON_PIN) == LOW;

  if (pressed) {
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }
}
```

This example uses the Arduino's internal pull-up resistor.

Because of this configuration:

```text
Button released → HIGH
Button pressed  → LOW
```

---

# 4\. Fan Speed Controller

## Objective

Use a potentiometer to control the speed of a DC motor/fan.

This project introduces:

- Analog input

- PWM

- Motor control

- Variable output

## Parts Required

- 1 × potentiometer

- 1 × motor/fan

- 5 × jumper wires

## Concept

```text
             Potentiometer
                   │
                   ▼
              Analog Input
                   │
                   ▼
             Arduino Uno
                   │
                PWM Output
                   │
                   ▼
              Motor / Fan
```

The potentiometer position determines the PWM output.

## Example Control Code

```cpp
const int POT_PIN = A0;
const int MOTOR_PIN = 9;

void setup() {
  pinMode(MOTOR_PIN, OUTPUT);
}

void loop() {
  int value = analogRead(POT_PIN);

  int speed = map(value, 0, 1023, 0, 255);

  analogWrite(MOTOR_PIN, speed);
}
```

### Important Motor Note

A DC motor should **not normally be driven directly from an Arduino GPIO pin**.

The Arduino's GPIO pins are designed for logic-level signals and limited current.

A proper motor circuit should use an appropriate switching device, such as:

```text
Arduino PWM
     │
     ▼
Transistor / MOSFET
     │
     ▼
Motor
```

with an appropriate external power supply and flyback protection where required.

Follow the wiring provided by the XC3902 manual.

---

# 5\. Traffic Lights

## Objective

Create a simple traffic-light sequence using three LEDs.

This project introduces:

- Multiple outputs

- Sequential control

- Loops

- Timing

- Reusable functions

## Parts Required

- 1 × red LED

- 1 × yellow LED

- 1 × green LED

- 3 × resistors

- 4 × jumper wires

## Basic Layout

```text
             Arduino
                │
       ┌────────┼────────┐
       │        │        │
       ▼        ▼        ▼
      RED    YELLOW    GREEN
       │        │        │
       └────────┴────────┘
                │
               GND
```

Each LED should have an appropriate current-limiting resistor.

## Example Code

```cpp
const int RED_PIN = 10;
const int YELLOW_PIN = 9;
const int GREEN_PIN = 8;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
}

void allOff() {
  digitalWrite(RED_PIN, LOW);
  digitalWrite(YELLOW_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
}

void loop() {
  // Red
  allOff();
  digitalWrite(RED_PIN, HIGH);
  delay(5000);

  // Green
  allOff();
  digitalWrite(GREEN_PIN, HIGH);
  delay(5000);

  // Yellow
  allOff();
  digitalWrite(YELLOW_PIN, HIGH);
  delay(2000);
}
```

The sequence is:

```text
RED
 │
 ▼
GREEN
 │
 ▼
YELLOW
 │
 └──────► RED
```

The timing values are examples and can be changed to experiment with the circuit.

---

# Arduino Concepts Covered

The five projects provide an introduction to several fundamental Arduino concepts.

| Project              | Main Concepts                    |
| -------------------- | -------------------------------- |
| LED                  | Digital output, GPIO             |
| Potentiometer        | Analog input, PWM                |
| Buttons              | Digital input, conditional logic |
| Fan Speed Controller | Analog input, PWM, motor control |
| Traffic Lights       | Multiple outputs, loops, timing  |

---

# Important Arduino Functions

## `pinMode()`

Configures a pin as an input or output.

```cpp
pinMode(13, OUTPUT);
```

or:

```cpp
pinMode(2, INPUT);
```

---

## `digitalWrite()`

Sets a digital output HIGH or LOW.

```cpp
digitalWrite(13, HIGH);
```

```cpp
digitalWrite(13, LOW);
```

---

## `digitalRead()`

Reads the state of a digital input.

```cpp
int state = digitalRead(2);
```

---

## `analogRead()`

Reads an analog input.

On an Arduino Uno, the result is normally:

```text
0–1023
```

Example:

```cpp
int value = analogRead(A0);
```

---

## `analogWrite()`

Produces a PWM output on supported pins.

Typical Arduino Uno PWM values are:

```text
0–255
```

Example:

```cpp
analogWrite(9, 128);
```

This produces approximately 50% duty cycle PWM.

---

## `delay()`

Pauses program execution for a specified number of milliseconds.

```cpp
delay(1000);
```

means:

```text
1 second
```

---

# PWM Pins

On the Arduino Uno, the PWM-capable digital pins are:

```text
3
5
6
9
10
11
```

They are commonly marked with:

```text
~
```

on the Arduino board.

For example:

```cpp
analogWrite(9, 128);
```

can be used to generate approximately 50% duty-cycle PWM on pin 9.

---

# Project Structure

A recommended GitHub structure is:

```text
XC3902-Arduino-Starter-Kit/
│
├── README.md
│
├── 01-LED/
│   └── 01-LED.ino
│
├── 02-Potentiometer/
│   └── 02-Potentiometer.ino
│
├── 03-Buttons/
│   └── 03-Buttons.ino
│
├── 04-Fan-Speed-Controller/
│   └── 04-Fan-Speed-Controller.ino
│
└── 05-Traffic-Lights/
    └── 05-Traffic-Lights.ino
```

This makes each experiment independently compilable and easy to navigate.

---

# Compiling with Arduino CLI

If using Arduino CLI, install the AVR platform:

```bash
arduino-cli core update-index
arduino-cli core install arduino:avr
```

The Duinotech Uno uses the Arduino Uno-compatible board definition:

```text
arduino:avr:uno
```

Compile a project:

```bash
arduino-cli compile \
  --fqbn arduino:avr:uno \
  01-LED
```

Upload it:

```bash
arduino-cli upload \
  -p /dev/ttyUSB0 \
  --fqbn arduino:avr:uno \
  01-LED
```

Replace `/dev/ttyUSB0` with the serial port detected on your computer.

---

# Official Project Code

Jaycar provides the complete source code for the projects in the XC3902 manual on GitHub:

**Jaycar Electronics — Arduino Starter Kit**

[https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/](https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/)

The official repository contains the full code for the projects described in the physical manual.

---

# Safety Notes

## LEDs

Always use an appropriate current-limiting resistor when connecting a standard LED to an Arduino output.

Do not connect an LED directly between an Arduino GPIO pin and ground without current limiting.

## Motor / Fan

Do not assume that an Arduino GPIO pin can safely power a motor directly.

Motors can draw substantially more current than an Arduino GPIO pin is designed to provide and can generate electrical transients.

Use the motor-driving circuit specified by the kit documentation.

## Power

Before powering a circuit:

1.  Check the wiring.

2.  Verify the polarity of LEDs and other components.

3.  Confirm the Arduino ground connection.

4.  Check for accidental short circuits.

5.  Make sure external motor power is connected correctly.

Disconnect power before significantly changing the breadboard wiring.

---

# Hardware Information

**Product:** Arduino Starter Kit
**Jaycar Part Number:** XC3902

### Included Board

**Duinotech Uno**

The board is Arduino Uno compatible and can be programmed using the standard Arduino development environment.

### Distributor

TechBrands by Electus Distribution Pty. Ltd.

```text
320 Victoria Rd
Rydalmere
NSW 2116
Australia

Phone: 1300 738 555
International: +61 2 8832 3200
Fax: 1300 738 500
```

Website:

[https://www.techbrands.com](https://www.techbrands.com)

---

# Learning Path

A useful progression through the kit is:

```text
LED
 │
 ├── Digital Output
 │
 ▼
Potentiometer
 │
 ├── Analog Input
 ├── PWM
 │
 ▼
Buttons
 │
 ├── Digital Input
 ├── Conditional Logic
 │
 ▼
Fan Speed Controller
 │
 ├── Analog → PWM
 ├── Motor Control
 │
 ▼
Traffic Lights
 │
 ├── Multiple Outputs
 ├── Timing
 └── Loops
```

After completing these projects, useful next steps include:

- Serial communication

- Sensors

- LCD/OLED displays

- Servo motors

- I2C devices

- SPI devices

- Interrupts

- Non-blocking timing with `millis()`

- State machines

- Arduino libraries

- More advanced motor control

---

# Credits

Hardware and starter-kit documentation:

**TechBrands / Electus Distribution Pty. Ltd.**

Arduino starter-kit project source:

**Jaycar Electronics**

[https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/](https://github.com/Jaycar-Electronics/Arduino-Starter-Kit/)

Product:

**XC3902 — Arduino Starter Kit**

---

## License

The example code in this repository should be treated according to the license of the original source code where it is derived from.

Hardware documentation and product information remain the property of their respective owners.
