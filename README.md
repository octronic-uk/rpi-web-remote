# IoT RaspberryPI GPIO
This is simple project exposes a web interace that allows remote users to modify the states of the GPIO pins provided by the RaspberryPI.

## Hardware Architecture
- Raspberry Pi Model B - network connected
- Mobile device with web browser

## Software Achitecture
- Raspbian
- Node
- Express
- Angular
- UI-Bootstrap

## Software Configuration
1. Download Raspbian Jessie Lite https://www.raspberrypi.org/downloads/raspbian/ install using the standard procedure.
2. run $ sudo apt-get update and $ sudo apt-get ugrade to update the system.
3. Download the latest (or your preferred) version of node from https://nodejs.org/dist/v5.4.0/node-v5.4.0-linux-armv6l.tar.gz
4. Unpack node by running $ tar xvf node-v5.4.0-linux-armv6l.tar.gz
5. Add node-v5.4.0-linux-armv61/bin to your PATH by modifying ~/.profile
5.1 Add the line export PATH=${PATH}:/path/to/node-v5.4.0-linux-armv61/bin
5.2 Save and quit your editor.
5.3 Reload your profile by executing $ . ~/.profile
6 Test node and npm with $ npm --version and $ node --version

## Configuring Pins
To come shortly

## Usage
1. $ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
2. $ cd IoT-RaspberryPI
3. $ npm install -d
4. $ npm start
