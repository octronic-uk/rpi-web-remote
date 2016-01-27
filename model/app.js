/*
  Ash's RaspberryPI IO Remote.
  email: ashthompson06@gmail.command
  repo: https://github.com/BashEdThomps/IoT-RaspberryPI.git

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// Requires --------------------------------------------------------------------
var fs         = require('fs');
var path       = require('path');
var bodyParser = require('body-parser');
var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var util       = require('./util');
var constants  = require('./constants');
var configPath = path.join(__dirname, "../"+constants.CONFIG);
var config     = require(configPath);
var ioModule = require('socket.io');
// App Modules
var settings = require('./settings');
var serial   = require('./serial');
var system   = require('./system');
var gpio     = require('./gpio');
// Variables
var app = express();
var jsonParser = bodyParser.json();
var rawParser = bodyParser.raw();
var httpServer = http.createServer(app);
var io = ioModule(httpServer);
// Init Express Module
var initExpress = function(callback) {
  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, '../view')));
  app.use(express.static(path.join(__dirname, '../controller')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-bootstrap')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-cookies')));
  app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-router/release')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-animate')));
  app.use(express.static(path.join(__dirname, '../node_modules/socket.io-client')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-sanitize')));
  if(callback) callback();
};
// Init Socket.IO Module
var initSocketIO = function(callback) {
  io.on('connection', function(socket) {
    console.log("Socket IO connection detected");
    socket.on('event', function(data) {
      console.log("Socket IO event detected");
    });
    socket.on('disconnect', function() {
      console.log("Socket IO disconnect event detected");
    });
  });
  if (callback) callback();
};
// Initialise http module
var initHttpServer = function(callback) {
  // HTTP Listen
  httpServer.listen(config.http_port);
  // HTTP Error handler
  httpServer.on('error', function(error) {
    if (error.syscall != 'listen') {
      throw error;
    }
    var bind = typeof config.http_port == 'string' ? 'Pipe ' + config.http_port : 'Port ' + config.http_port;
    // handle specific listen errors with friThenly messages
    switch (error.code) {
      case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(constants.APP_EXIT_ERROR);
      break;
      case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(constants.APP_EXIT_ERROR);
      break;
      default:
      throw error;
    }
  });
  // HTTP Listen
  httpServer.on('listening', function() {
    var addr = httpServer.address();
    var bind = typeof addr == 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });
  if (callback) callback();
};
// Initialise exprses routes
var initRoutes = function(callback) {
  // GPIO ----------------------------------------------------------------------
  // Set the value of an output pin
  app.put("/api/gpio/pins/:pin/state/:value",jsonParser,gpio.putPinValue);
  // Get the list of pins configured
  app.get("/api/gpio/pins/list",jsonParser,gpio.getPinList);
  // Get the list of pins configured
  app.put("/api/gpio/pins/list",jsonParser,gpio.putPinList);
  // Remove a pin from the config
  app.delete("/api/gpio/pins/:pin",jsonParser,gpio.deletePin);
  // Add a pin to the config list
  app.put("/api/gpio/pins",jsonParser,gpio.putPinToList);
  // Get the definition of a pin
  app.get("/api/gpio/pins/:pin",jsonParser,gpio.getPinDefinition);
  // Get the state of a pin
  app.get("/api/gpio/pins/:pin/state", jsonParser, gpio.getPinState);
  // Get the state history for a pin
  app.get('/api/gpio/pins/:pin/history', gpio.getPinHistory);
  // Delete GPIO Script
  app.delete('/api/gpio/script/:name',jsonParser,gpio.deleteScript);
  // Update GPIO Script
  app.put('/api/gpio/script/:name',jsonParser,gpio.putScript);
  // Get a GPIO script
  app.get('/api/gpio/script/:name',jsonParser,gpio.getScript);
  // Get GPIO script list
  app.get('/api/gpio/scripts/list',jsonParser,gpio.getScriptsList);
  // Execute a GPIO script
  app.get('/api/gpio/script/:name/execute',jsonParser,gpio.executeScript);
  // System --------------------------------------------------------------------
  // Update the application from github
  app.get('/api/application/update', jsonParser, system.update);
  // Reload the application through PM2
  app.get('/api/application/restart', jsonParser, system.restart);
  // Get the device's uptime
  app.get('/api/device/uptime', jsonParser, system.uptime);
  // Get the device's hostname
  app.get('/api/device/hostname', jsonParser, system.getHostname);
  // Reboot the device
  app.get('/api/device/reboot', jsonParser, system.reboot);
  // Get the device's address'
  app.get('/api/device/address', jsonParser, system.getAddress);
  // Settings ------------------------------------------------------------------
  // Get the name of the device
  app.get('/api/device/name', jsonParser, settings.getDeviceName);
  // Set the name of the device
  app.put('/api/device/name', jsonParser, settings.putDeviceName);
  // Get the application listening port
  app.get('/api/device/port',jsonParser, settings.getPort);
  // Set the application listening port
  app.put('/api/device/port',jsonParser, settings.putPort);
  // Save the current configuration
  app.put('/api/config/save',settings.save);
  // Serial --------------------------------------------------------------------
  // Get serial enabled state
  app.get('/api/serial/enabled', jsonParser, serial.getEnabled);
  // Set serial enabled state
  app.put('/api/serial/enabled/:en', jsonParser, serial.putEnabled);
  // Get the devce's list of serial ports
  app.get('/api/serial/path/list', jsonParser, serial.getPathList);
  // Get the list of serial commands
  app.get('/api/serial/commands/list', jsonParser, serial.getCommandsList);
  // Get an individual serial command
  app.get('/api/serial/command/:name', jsonParser, serial.getCommand);
  // Add a serial command to the configuration
  app.put('/api/serial/command', jsonParser, serial.putCommand);
  // Remove a serial command to the configuration
  app.delete('/api/serial/command/:name', jsonParser, serial.deleteCommand);
  // Execute the given serial command
  app.put('/api/serial/command/execute', jsonParser, serial.executeCommand);
  // Get list of supported baud rates
  app.get('/api/serial/baudrate/list', jsonParser, serial.getBaudrateList);
  // Get the serial path
  app.get('/api/serial/path', jsonParser, serial.getPath);
  // get the serial baud rate
  app.get('/api/serial/baudrate', jsonParser, serial.getBaudrate);
  // Set the serial device path
  app.put('/api/serial/path', jsonParser, serial.putPath);
  // Set the serial baud rate
  app.put('/api/serial/baudrate', jsonParser, serial.putBaudrate);
  // Restart the serial device
  app.put('/api/serial/restart', jsonParser, serial.restart);
  if (callback) callback();
};
// Module Init Calls
console.log(constants.ISSUE);
initExpress(
  initSocketIO(
    initHttpServer(
      settings.init(config,
        serial.init(config,
          system.init(config,
            gpio.init(io,config,
              initRoutes
            )
          )
        )
      )
    )
  )
);
