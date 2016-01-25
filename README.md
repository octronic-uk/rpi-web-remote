# IoT RaspberryPI

## Introduction
This project implements a simple remote control web application that allows users to monitor and modify the states of the RaspberryPI's GPIO pins.

### Key Features
* Pi-Hosted Web Application. No need to install an app on each device.
* Define pins as input/output and name them for easy access.
* Script GPIO pin actions.
* UI is updated asynchronously by socket.io
* Runs on any device with a modern web browser.
* Great starting point for home automation or remote management projects.
* Support for sending ASCII serial commands to external devices such as Arduino.

## Android Screenshots
###Home
![Home Screenshot](/readme/android_screen1.png)
### GPIO Settings
![GPIO Settings Screenshot](/readme/android_screen2.png)
### Serial Settings
![Serial Settings Screenshot](/readme/android_screen3.png)
## Hardware Architecture
- Raspberry Pi (written and tested on Model B) running Raspbian.
- A client device with a web browser.
- Something to control via GPIO :)

## Software Stack
- Raspbian
- PM2/NodeJS
- socket.io
- Express
- Angular
- UI-Bootstrap

## Setup Environment

This guide starts from scratch. Please begin where appropriate for you!

1. Download Raspbian Jessie Lite from https://www.raspberrypi.org/downloads/raspbian/ install using the standard procedure.

2. Power up your RaspberryPI and complete the initial configuration.

    ```
    $sudo raspi-config
    ```

3. Run apt-get to update the system.

    ```
    $ sudo apt-get update
    $ sudo apt-get ugrade
    ```

4. Download the latest (or your preferred) version of linux-armv6l node-js from https://nodejs.org/dist/

5. Unpack node by running

    ```
    $ tar xvf node-vX.X.X-linux-armv6l.tar.gz
    ```

6. Add the extracted `node-vX.X.X-linux-armv61/bin` directory to your `PATH` environment variable by modifying `/etc/profile` and adding the following line to the end.

    ```
    export PATH=${PATH}:/path/to/node-vX.X.X-linux-armv61/bin
    ```
7. Save `/etc/profile` and quit your editor.

8. Add this directory to your sudo's path by modifying the path variable through visudo

    ```
    $ sudo visudo
    ```

    Add `:/path/to/node-vX.X.X-linux-armv61/bin` to the secure path, save and exit.

9. Reboot to reload your environment

10. Test node and npm with

    ```
    $ npm --version
    $ node --version
    ```

11. Install git to clone repositories
    ```
    $ sudo apt-get install git
    ```

12. Install PM2 globally and instruct it to run at boot.

    ```
    $ sudo npm install -g pm2
    $ sudo pm2 startup debian
    ```

13. Clone this repository to your device.

    ```
    $ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
    ```

14. Navigate to the repository

    ```
    $ cd IoT-RaspberryPI
    ```

15. Install the application.

    ```
    $ ./install
    ```

    This will install all node dependencies and configure PM2 to start the application at boot.

16. Restart your RaspberryPI. PM2 will automatically start the application.

17. Use a browser to navigate to your RaspberryPI on the port specified in your configuration.

    ```
    http://192.168.0.31:80
    ```

18. Control your device :)

## Updating the Application
The application can be updated by clicking the 'update' button on the 'System' page, or run the
update command from the repository's root directory to update the application.

```
./update
```

## Using Serial Functionality
The application also allows the user to send ASCII commands to a device connected via a USB/Serial interface, such as an Arduino.

1. To configure serial click the settings cog at the bottom of the home screen.
2. Check the "Enable Serial" check-box in the "Serial" section.
3. Choose your serial device and baud rate from the list available.
4. Add serial commands to the application.
5. Save your settings by clicking the green 'save' button. An alert will indicate success/failure.
6. Execute commands from the home page.

### Example Arduino Sketch
To control a device via serial, the remote sends commands in the form of ASCII characters to the device. An Arduino can be controlled by listening for commands on each iteration of the main loop and switching the executing method as appropriate. An example sketch of this implementation is shown below.

```
/*
  Basic State Machine
  Ash Thompson
  ashthompson06@gmail.com
*/

/* Constants */

// Serial Speed
const int SERIAL_BAUD = 9600;

// Commands
const int RAINBOW = 49; // 1 in ASCII
const int FLASH = 50;   // 2 in ASCII

// LED Pin
const int LED_PIN = 3;

// Delay Times
const int RAINBOW_DELAY = 200;
const int DEFAULT_DELAY = 10;
const int FLASH_DELAY = 1000;

/* Variables */
int itr = 0;
int state = 0;

/* Arduino Setup */
void setup()
{
 initPins();
 Serial.begin(SERIAL_BAUD);
}

/* Main Loop */
void loop()
{
  if (Serial.available())
  {
    state = Serial.read();
  }

  switch (state)
  {
    case RAINBOW:
      doRainbow();
    break;
    case FLASH:
      doFlash();
    break;
    default:
      doDefault();
      break;
  };

  itr++;
}

/* Initialise IO pins */
void initPins()
{
 pinMode(LED_PIN, INPUT);
}

/* Rainbow Comand */
void doRainbow()
{
 digitalWrite(LED_PIN, (itr % 2 == 0 ? HIGH : LOW));
 delay(RAINBOW_DELAY);
 return;
}

/* Flash Command */
void doFlash()
{
  digitalWrite(LED_PIN, (itr % 2 == 0 ? HIGH : LOW));
  delay(FLASH_DELAY);
  return;
}

/* Default Command */
void doDefault()
{
  digitalWrite(LED_PIN,LOW);
  delay(DEFAULT_DELAY);
  return;
}
```

# Bonus Section
## RaspberryPI GPIO Pinouts
Courtesy of http://raspi.tv/wp-content/uploads/2014/07/Raspberry-Pi-GPIO-pinouts.png
![RaspberryPI GPIO](/readme/Raspberry-Pi-GPIO-pinouts.png)
