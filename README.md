# IoT RaspberryPI GPIO
This simple project allows users to remotely monitor and modify the states of the RaspberryPI's GPIO pins through a web interface.

## Hardware Architecture
- Raspberry Pi (written on model b) running Raspbian.
- A device with web browser.

## Software Achitecture
- Raspbian
- Node
- PM2
- Express
- Angular
- UI-Bootstrap

## Setup Environment
1. Download Raspbian Jessie Lite from https://www.raspberrypi.org/downloads/raspbian/ install using the standard procedure.

2. Power up your RaspberryPI and complete the first configuration.

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

6. Add the `node-vX.X.X-linux-armv61/bin` extracted directory to your `PATH` environment variable by modifying `/etc/profile` and adding the following line to the end.

    ```
    export PATH=${PATH}:/path/to/node-vX.X.X-linux-armv61/bin
    ```
7. Save `/etc/profile` and quit your editor.

8. Also add this directory to your sudo's path by modifying the path variable through visudo

    ```
    $ sudo visudo
    ```

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

13. Clone the repo onto your device

    ```
    $ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
    ```

14. Navigate to the repository

    ```
    $ cd IoT-RaspberryPI
    ```

15. Configure the application by editing the `config.json` file. This file holds
   the device name, port and pin configuration.

    ```
    $ vi config.json
    ```

    15.1 The devices name is set by the `devie_name` variable.

        ```
        ...
        "device_name": "Lounge Lights",
        ...
        ```

    15.2 The application's HTTP server will listen on the port specified by `http_port`.

        ```
        ...
        "http_port": 80,
        ...
        ```

    15.3 The `pins` array defines the list of pins that will be available to the user.

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

    This will install all node dependencies and configure PM2 to start the
    application at boot time.
