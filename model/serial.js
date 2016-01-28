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
// Requires
var path = require('path');
var SerialPortModule = require("serialport");
var SerialPort = SerialPortModule.SerialPort;
var util = require('./util');
// Constants
var BAUDRATE_LIST = [
  115200, 57600, 38400, 19200,
  9600,   4800,  2400,  1800,
  1200,   600,   300,   200,
  150,    134,   110,   75, 50
];
// Variables
var serialPort   = null;
var config = null;
// Restart the SerialPort Module
var _restart = function() {
  close(init);
};
// Get a serial command's index by name
var _getSerialCommandIndexById = function(id, callback) {
  _getSerialCommandById(id, function(cmd)  {
    callback(config.serial.commands.indexOf(cmd));
  });
};
// Get a serial command by name
var _getSerialCommandById = function(id, callback) {
  var i = 0;
  var nCommands = config.serial.commands.length;
  var next = null;
  var target = null;
  console.log("Checking",nCommands,"commands for",id);
  for (i = 0; i < nCommands; i++) {
    next = config.serial.commands[i];
    if (next.id == id) {
      target = next;
      break;
    }
  }
  callback(target);
};
// Route Handlers --------------------------------------------------------------
// Initislias Serial Module
var init = function(conf, callback) {
  if (conf) {
    config = conf;
  }
  if (config.serial.enable) {
    console.log("Enabling serial port:", config.serial.path,  "at", config.serial.baudrate);
    if (serialPort === null && config.serial.path !== undefined && config.serial.baudrate !== undefined) {
      serialPort = new SerialPort(config.serial.path, {baudrate: config.serial.baudrate});
    }
    // SerialPort Event Handlers
    if (serialPort !== null) {
      serialPort.on('error', function(err)  {
        config.serial.enable = false;
        console.log(err);
      });
      serialPort.open(function (err) {
        if (err) {
          config.serial.enable = false;
          console.log(err);
        } else {
          console.log("Serial port opened successfuly:",config.serial.path);
        }
      });
    }
  } else {
    console.log("Serial port support is not enabled");
  }
  if (callback) {
    callback();
  }
};
// Restart serial
var restart = function (request, response) {
  _restart();
  util.sendHttpOK(response);
};
// Close the Serial Module
var close = function(callback) {
  if (serialPort && serialPort.isOpen()) {
    serialPort.close(function(error) {
      if (error) {
        console.log("FATAL: Error closing serial port");
        process.exit(constants.APP_EXIT_ERROR);
      } else {
        console.log("Successfuly closed serial port");
        callback();
      }
    });
  }
  else {
    if (callback) callback();
  }
};
// Is serial module enabled
var getEnabled = function(request,response) {
  util.sendHttpJson(response,{enabled: config.serial.enable});
};
// Put enabled state
var putEnabled = function(request,response) {
  var enParam = request.params.en;
  console.log("Enable param: ",enParam);
  var enabled = (enParam  == "true" ? true : false);
  config.serial.enable = enabled;
  if (enabled) {
    _restart();
  } else {
    close();
  }
  util.sendHttpOK(response);
};
// Get the current serial path
var getPath = function(request,response) {
  util.sendHttpJson(response,{path: config.serial.path});
};
// Put the device path
var putPath = function(request,response) {
  var path = request.body.path;
  if (path !== null) {
    config.serial.path = path;
    util.sendHttpOK(response);
  } else {
    util.sendHttpError(response);
  }
};
// Get list of serial device paths
var getPathList = function(request,response) {
  SerialPortModule.list(function (err, ports) {
    if (err || ports === undefined) {
      util.sendHttpError(response);
    } else {
      var data = [];
      ports.forEach(function(port) {
        data.push(port.comName);
      });
      util.sendHttpJson(response,data);
    }
  });
};
// Get serial commnd list
var getCommandsList = function(request,response) {
  util.sendHttpJson(response,config.serial.commands);
};
// Get individual serial command
var getCommand = function(request,response) {
  var id = request.params.id;
  _getSerialCommandById(id,function(cmd) {
    if (cmd) {
      util.sendHttpJson(response,cmd);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Put serial command definition
var putCommand = function(request,response) {
  var cmd = request.body;
  console.log("Adding command",cmd);
  _getSerialCommandIndexById(cmd.id, function(index) {
    if (index > -1) {
      config.serial.commands.splice(index,1);
    }
    config.serial.commands.push(cmd);
    util.sendHttpOK(response);
  });
};
// Delete serial commands
var deleteCommand = function(request,response) {
  var id = request.params.id;
  console.log("Reomving command",id);
  _getSerialCommandIndexById(id,function(index) {
    if (index > -1) {
      config.serial.commands.splice(index, 1);
      util.sendHttpOK(response);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Execute command
var executeCommand = function(request,response) {
  var id = request.params.id;
  console.log("Executing command",id);
  if (serialPort !== null && serialPort.isOpen()) {
    _getSerialCommandById(id,function(commandObject) {
      if (commandObject) {
        serialPort.write(commandObject.cmd, function(err) {
          if (err) {
            console.log("Serial execute error",err);
            util.sendHttpError(response);
          } else {
            util.sendHttpOK(response);
          }
        });
      } else {
        console.log("Serial execute error: no command obj");
        util.sendHttpError(response);
      }
    });
  } else {
    console.log("Serial execute error, no serial port or not isOpen()");
    util.sendHttpError(response);
  }
};
// Get the current baud rate
var getBaudrate = function(request,response) {
  util.sendHttpJson(response,{baudrate: config.serial.baudrate});
};
// Put baudrate
var putBaudrate = function(request,response) {
  var baudrate = request.body.baudrate;
  if (baudrate !== null) {
    config.serial.baudrate = baudrate;
    util.sendHttpOK(response);
  } else {
    util.sendHttpError(response);
  }
};
// Get list of baudrates
var getBaudrateList = function(request,response) {
  util.sendHttpJson(response,BAUDRATE_LIST);
};

// Module Exports --------------------------------------------------------------
module.exports = {
  init    : init,
  restart : restart,
  close : close,
  getEnabled  : getEnabled,
  putEnabled  : putEnabled,
  getPathList : getPathList,
  getPath: getPath,
  putPath: putPath,
  getCommandsList : getCommandsList,
  getCommand  : getCommand,
  putCommand  : putCommand,
  deleteCommand : deleteCommand,
  executeCommand : executeCommand,
  getBaudrate : getBaudrate,
  putBaudrate : putBaudrate,
  getBaudrateList : getBaudrateList,
};
