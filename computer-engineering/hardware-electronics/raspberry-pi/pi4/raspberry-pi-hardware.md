# Raspberry Pi Hardware

## Hardware commands

- `argonone-config` : Argoneone Case fan control configuration curl https://download.argon40.com/argon1.sh | bash : Install ArgonOne fancontrol script
- `pinout` : A handy reference can be accessed on the Raspberry Pi by opening a terminal window and running the command pinout
- `sudo usermod -a -G gpio [username]` : In order to use the GPIO ports your user must be a member of the gpio group. The pi user is a member by default, other users need to be added manually.
- `sudo rpi-update` and then use `sudo reboot`
- `rpi-update` : will download the latest pre-release version of the linux kernel, its matching modules, device tree files, along with the latest versions of the VideoCore firmware. It will then install these files to relevant locations on the SD card, overwriting any previous versions.
- `sudo apt-get update sudo apt install --reinstall libraspberrypi0 libraspberrypi-{bin,dev,doc} raspberrypi-bootloader raspberrypi-kernel` If you have done an rpi-update and things are not working as you wish, if your Raspberry Pi is still bootable you can return to the stable release using above command
- `sudo raspi-config` : Configure Raspberry Pi
- `sudo rpi-update` : Only use this if you know what you do. This command will update everything on your Raspberry Pi (firmware, packages, …) and can potentially break something.
- `vcgencmd measure_temp` : Displays the current CPU temperature.
- `raspi-gpio` : This command allows you to manage the GPIO pins of the Raspberry Pi. You can either set or get a value. `raspi-gpio get 20` or `raspi-gpio set 20 a5` `raspi-gpio set 20 op pn dh`

## RPi.GPIO Library

- `import RPi.GPIO as GPIO` : Import the `RPi.GPIO` module into the Python sketch  
- `GPIO.setmode(GPIO.BCM)` : Use Broadcom pin numbers (GPIO 14, GPIO 15 etc)  
- `GPIO.setmode(GPIO.BOARD)` : Use board pin numbers (4, 5, 8 etc)  
- `GPIO.getmode()` : Returns current pin numbering mode (BCM, BOARD, or None)  
- `GPIO.setup([pin number], GPIO.IN)` : Set up the pin at `[pin number]` to be an input  
- `GPIO.setup([pin number], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)` : Set up the pin at `[pin number]` to be an input with internal pull-down resistance  
- `GPIO.setup([pin number], GPIO.IN, pull_up_down=GPIO.PUD_UP)` : Set up the pin at `[pin number]` to be an input with internal pull-up resistance  
- `GPIO.setup([pin number], GPIO.OUT)` : Set up the pin at `[pin number]` to be an output  
- `GPIO.setup([pin number], GPIO.OUT, initial=1)` : Set up the pin at `[pin number]` to be an output with the initial value `1`  
- `GPIO.output([pin number], 1)` : Set `[pin number]`'s value to `1` (same as `GPIO.HIGH` or `True`)  
- `GPIO.output([pin number], 0)` : Set `[pin number]`'s value to `0` (same as `GPIO.LOW` or `False`)  
- `i = GPIO.input([pin number])` : Set the variable `i` to the value of `[pin number]`  
- `if GPIO.input([pin number]):` : Use the value of `[pin number]` as a boolean in code  
- `GPIO.cleanup()` : Reset all GPIO pins (good practice before program exit)  
- `GPIO.VERSION` : Returns current `RPi.GPIO` version  

---

## GPIO Zero Library

### LEDs

- `from gpiozero import LED` : Import the LED section of the gpiozero library  
- `led = LED(17)` : Assign the `led` variable to an LED on pin GPIO 17  
- `led.on()` : Turn on the LED stored in the `led` variable  
- `led.off()` : Turn off the LED stored in the `led` variable  
- `led.toggle()` : Toggle the LED stored in the `led` variable  

### Motors

- `from gpiozero import Motor` : Import the Motor section of the gpiozero library  
- `motor = Motor(17, 18)` : Assign the variable `motor` to a Motor object with forward and backward pin numbers  
- `motor.forward()` : Activate the forward pin of the variable `motor`  
- `motor.backward()` : Activate the backward pin of the variable `motor`  
- `motor.reverse()` : Reverse the current motor direction  
- `motor.stop()` : Stop the motor  

### Buzzer

- `from gpiozero import Buzzer` : Import the Buzzer section of the gpiozero library  
- `bz = Buzzer(3)` : Assign the variable `bz` to a Buzzer on pin GPIO 3  
- `bz.on()` : Turn the buzzer on  
- `bz.off()` : Turn the buzzer off  
- `bz.toggle()` : Toggle the buzzer’s state  

### Servo

- `from gpiozero import Servo` : Import the Servo section of the gpiozero library  
- `servo = Servo(17)` : Assign the `servo` variable to a Servo on GPIO 17  
- `servo.min()` : Move the servo to its minimum value  
- `servo.mid()` : Move the servo to its middle value  
- `servo.max()` : Move the servo to its maximum value  
- `servo.value = 0.5` : Move the servo to a set value (min = `-1`, max = `1`)  

---

## Raspi Camera - Image Capture (`raspistill`)

- `raspistill` : Command to take a still image with the attached camera  
- `--width`, `-w` : Set image width  
- `--height`, `-h` : Set image height  
- `--quality`, `-q` : Set JPEG quality `<0 to 100>` (75 is most common)  
- `--raw`, `-r` : Insert raw Bayer data into JPEG metadata  
- `--output`, `-o` : Output filename (required for saving)  
- `--latest`, `-l` : Add latest frame to filename  
- `--verbose`, `-v` : Verbose debugging info  
- `--timeout`, `-t` : Set time delay before capturing  
- `--encoding`, `-e` : Set encoding format (jpg, gif, bmp, png)  

---

## Raspi Camera - Video Capture (`raspivid`)

- `raspivid` : Command to record video with the attached camera  
- `--width`, `-w` : Set image width (64px – 1920px)  
- `--height`, `-h` : Set image height (64px – 1080px)  
- `--bitrate`, `-b` : Set bitrate in bits per second  
- `--output`, `-o` : Output filename (required for saving)  
- `--verbose`, `-v` : Verbose debugging info  
- `--timeout`, `-t` : Set time delay before recording  
- `--framerate`, `-fps` : Specify frames per second for recording
