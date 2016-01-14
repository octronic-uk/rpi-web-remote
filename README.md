# IoT RaspberryPI GPIO

## Introduction
This project implements a simple remote control web application that allows users to monitor and modify the states of the RaspberryPI's GPIO pins.

### Key Features
* Pi-Hosted Web Application. No need to install an app on each device.
* Define pins as input or output.
* Name pins for easy access.
* Runs on any device with a modern web browser.
* Great starting point for home automation or remote management projects.
* Support for sending serial commands to external devices such as Arduino.

## Android Screenshots
###Home
![Home Screenshot](/readme/android_screen1.png)
### GPIO Settings
![GPIO Settings Screenshot](/readme/android_screen1.png)
### Serial Settings
![Serial Settings Screenshot](/readme/android_screen1.png)
## Hardware Architecture
- Raspberry Pi (written and tested on Model B) running Raspbian.
- A client device with a web browser.
- Something to control via GPIO :)

## Software Stack
- Raspbian
- PM2/NodeJS
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
    $ sudo pm2 startup ubuntu
    ```

13. Clone this repo to your device.

    ```
    $ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
    ```

14. Navigate to the repository

    ```
    $ cd IoT-RaspberryPI
    ```

15. Configure the application by editing the `config.json` file. This file holds the device name, port and pin configuration.

    ```
    $ vi config.json
    ```

    * The device's name is set by the `devie_name` variable.
        ```
        "device_name": "Lounge Lights",
        ```

    * The application's HTTP server will listen on the port specified by `http_port`.

        ```
        "http_port": 80,
        ```

    * The `pins` array defines the list of pins that will be available to the user.

        ```
        "pins": [
          {
            "name": "Hall Light", // Human readable name
            "num": 7,             // Pin number
            "io": "out",          // Direction; "in" or "out"
            "state": 0            // Initial state 0 or 1 (output only)
          },
          ...
        ];
        ```

16. Install the application.

    ```
    $ ./install
    ```

    This will install all node dependencies and configure PM2 to start the application at boot.

17. Restart your RaspberryPI. PM2 will automatically start the application.

18. Use a browser to navigate to your RaspberryPI on the port specified in your configuration.

    ```
    http://192.168.0.31:80
    ```

19. Control your device :)

## Updating the app
Run the following command in the repository directory to update the application.

```
./update
```

## Using Serial Functionality
The application also allows the user to send ASCII commands to a device connected via a USB/Serial inteface, such as an Arduino.

1. To configure serial click the settings cog at the bottom of the home screen.
2. Check the "Enable Serial" checkbox in the "Serial" section.
2. Choose your serial device and baud rate from the list available.
3. Save your settings by clicking the green save button. An alert will indicate success/failure.
4. Return to the home screen and refresh the page.
5. Return to te Settings page by pressing the cog button at the bottom of the home screen.
6. Add serial commands to the application.
7. Execute commnds from the home page.

### Example Arduino Sketch
To control a device via serial, the remote sends commands in the form of ASCII characters to the device. An Arduino can be controlled by listening for commands on each iteration of the main loop and switching the executing method as appropriate. An example sketch of this implementation is shown below.

```
/*
  Basic State Machine
  Ash Thompson
  ashthompson06@gmail.com
*/

// Constants
const int SERIAL_BAUD = 9600;
const int RAINBOW = 49;
const int FLASH = 50;
const int RAINBOW_DELAY = 200;
const int LED_PIN = 3;
const int DEFAULT_DELAY = 10;
const int FLASH_DELAY = 1000;

// Variables
int itr = 0;
int state = 0;

void setup()
{
 initPins();
 Serial.begin(SERIAL_BAUD);
}

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

void initPins()
{
 pinMode(LED_PIN, INPUT);
}

void doRainbow()
{
 digitalWrite(LED_PIN, (itr % 2 == 0 ? HIGH : LOW));
 delay(RAINBOW_DELAY);
 return;
}

void doFlash()
{
  digitalWrite(LED_PIN, (itr % 2 == 0 ? HIGH : LOW));
  delay(FLASH_DELAY);
  return;
}

void doDefault()
{
  digitalWrite(LED_PIN,LOW);
  delay(DEFAULT_DELAY);
  return;
}
```
