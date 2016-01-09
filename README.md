# IoT RaspberryPI GPIO
This is simple project exposes a web interace that allows remote users to modify the states of the GPIO pins provided by the RaspberryPI.

## Hardware Architecture
- Raspberry Pi (written on model b) running Raspbian
- Mobile device with web browser

## Software Achitecture
- Raspbian
- Node
- Express
- Angular
- UI-Bootstrap

## Software Configuration
1. Download Raspbian Jessie Lite from https://www.raspberrypi.org/downloads/raspbian/ install using the standard procedure.
2. Run
   ```
   $ sudo apt-get update 
   $ sudo apt-get ugrade
   ``` 
   to update the system.
3. Download the latest (or your preferred) version of node-js from https://nodejs.org/dist/v5.4.0/node-v5.4.0-linux-armv6l.tar.gz
4. Unpack node by running 
   ```
   $ tar xvf node-v5.4.0-linux-armv6l.tar.gz
   ````
5. Add `node-v5.4.0-linux-armv61/bin` to your `PATH` by modifying `~/.profile`
   Add the line 
   ```
   export PATH=${PATH}:/path/to/node-v5.4.0-linux-armv61/bin
   ```
   Save `~/.profile` and quit your editor.
6. Reload your profile by executing `$ . ~/.profile`
7. Test node and npm with 
8. 
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
