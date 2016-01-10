# IoT RaspberryPI GPIO

## Introduction
This project implements a simple remote control web application that allows users to monitor and modify the states of the RaspberryPI's GPIO pins.

### Key Features
* Pi-Hosted Web Application. No need to install an app on each device.
* Define pins as input or output.
* Name pins for easy access.
* Runs on any device with a modern web browser.
* Great starting point for home automation or remote management projects.

## Android Screenshot
![Android Screenshot](/readme/android_screen.png)

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

    Add ':/path/to/node-vX.X.X-linux-armv61/bin' to the path, save and exit.

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
