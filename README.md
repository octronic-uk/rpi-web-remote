# IoT RaspberryPI GPIO
This simple project allows users to remotely monitor and modify the states of the RaspberryPI's GPIO pins through a web interface.

## Hardware Architecture
- Raspberry Pi (written on model b) running Raspbian.
- A device with web browser.

## Software Achitecture
- Raspbian
- Node
- Express
- Angular
- UI-Bootstrap

## Setup Environment
1. Download Raspbian Jessie Lite from https://www.raspberrypi.org/downloads/raspbian/ install using the standard procedure.
2. Run apt-get to update the system.

    ```
    $ sudo apt-get update 
    $ sudo apt-get ugrade
    ``` 
3. Download the latest (or your preferred) version of node-js from https://nodejs.org/dist/v5.4.0/node-v5.4.0-linux-armv6l.tar.gz
4. Unpack node by running

    ```
    $ tar xvf node-v5.4.0-linux-armv6l.tar.gz
    ```
5. Add the `node-v5.4.0-linux-armv61/bin` directory where you installed node to your `PATH` environment variable by modifying `~/.profile`.

    ```
    export PATH=${PATH}:/path/to/node-v5.4.0-linux-armv61/bin
    ```
6. Save `~/.profile` and quit your editor.
7. Reload your profile by executing 
    
    ```
    $ . ~/.profile
    ```
8. Test node and npm with 

    ```
    $ npm --version
    $ node --version
    ```

## Configuring Pins
To come shortly

## Usage
```
$ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
$ cd IoT-RaspberryPI
$ npm install -d
$ npm start
```
