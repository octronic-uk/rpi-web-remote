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

8. Reboot to reload your environment 
    
9. Test node and npm with 

    ```
    $ npm --version
    $ node --version
    ```
    
10. Install git to clone repositories
    ```
    $ sudo apt-get install git
    ```
    
11. Install PM2 globally and instruct it to run at boot.

    ```
    $ sudo npm install -g pm2
    $ sudo pm2 startup ubuntu
    ```
    
12. Clone the repo onto your device

    ```
    $ git clone https://github.com/BashEdThomps/IoT-RaspberryPI.git
    ```
    
13. Navigate to the repository and install
    ```
    $ cd IoT-RaspberryPI
    $ ./install
    ```
    
13. Configure your pins
    ```
    Coming soon
    ```
14. Run the application.

    ```
    $ npm start
    ```
