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
var SerialPortModule = require("serialport");
var SerialPort = SerialPortModule.SerialPort;
var gpio       = require("rpi-gpio");
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
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var ioModule = require('socket.io');

// Variables
var port       = config.http_port;
var app        = express();
var jsonParser = bodyParser.json();
var rawParser    = bodyParser.raw();
var httpServer   = http.createServer(app);
var io = ioModule(httpServer);
var eventHistory = {};
var serialPort   = null;

// constants
var SIO_STATE_CHANGED = "StateChanged";
var SIO_SCRIPT_FINISHED = "ScriptFinished";
var PIN               = 'pin';
var UPTIME_CMD        = 'uptime -p';
var ADDR_CMD          = 'hostname -I';
var HOSTNAME_CMD      = 'hostname';
var REBOOT_CMD        = "reboot";
var GPIO_SCRIPT_DELAY =  100;
var RESTART_CMD       =  path.join(__dirname, "../restart");
var UPDATE_CMD        =  path.join(__dirname, "../update_internal");
var BAUDRATE_LIST = [
  115200, 57600, 38400, 19200,
  9600,   4800,  2400,  1800,
  1200,   600,   300,   200,
  150,    134,   110,   75, 50
];

// Print Mini License
console.log(
  "\nAsh's RaspberryPI IO Remote! ---------------------------------------------------",
  "\nCopyright (C) 2016, Ashley Thompson.",
  "\nThis program comes with ABSOLUTELY NO WARRANTY.",
  "\nThis is free software, and you are welcome to redistribute an or modify it under the terms of the GPLv3.",
  "\n\nHappy Hacking :)\n\n");

var closeSerial = function(callback) {
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
    callback();
  }
};

var initSerial = function() {
  if (config.serial.enable) {
    console.log("Enabling serial port:", config.serial.path,  "at", config.serial.baudrate);
    if (serialPort === null && config.serial.path !== undefined && config.serial.baudrate !== undefined) {
      serialPort = new SerialPort(config.serial.path, {baudrate: config.serial.baudrate});
    }

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
  }
  else
  {
    console.log("Serial port support is not enabled");
  }
};

var restartSerial = function() {
  closeSerial(initSerial);
};

// Configure express
var initExpress = function() {
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
};

var initSocketIO = function()
{
  io.on('connection', function(socket) {
    console.log("Socket IO connection detected");
    socket.on('event', function(data) {
      console.log("Socket IO event detected");
    });
    socket.on('disconnect', function() {
      console.log("Socket IO disconnect event detected");
    });
  });
};

var initHttpServer = function() {
  // HTTP Listen
  httpServer.listen(port);

  // HTTP Error handler
  httpServer.on('error', function(error) {
    if (error.syscall != 'listen') {
      throw error;
    }

    var bind = typeof port == 'string' ? 'Pipe ' + port : 'Port ' + port;

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
};

// Close the GPIO pins in use
var closeGpio = function(callback) {
  gpio.destroy();
  if (callback){
    callback();
  }
};

// Initialise an individual GPIO pin
var initIndividualGpioPin = function(pin) {
  if (pin.io == "out") {
    gpio.setup(pin.num, gpio.DIR_OUT,function() {
      gpio.write(pin, pin.state, function(err) {
        if (err) {
          console.log("Error writing to pin",pin.num);
        } else  {
          console.log("set pin",pin.num,"to",pin.state);
          addGpioPinEvent(pin.num, pin.state);
        }
      });
    });
  }
  else if (pin.io == "in") {
    gpio.setup(pin.num, gpio.DIR_IN, gpio.EDGE_BOTH);
  } else {
    config.log("Error, pin",pin.num,"should be 'in' or 'out'");
  }
};

var initGpio = function(callback) {
  var i = 0;
  var nPins = config.gpio.pins.length;
  for (i = 0; i < nPins; i++) {
    var pin = config.gpio.pins[i];
    initIndividualGpioPin(pin);
  }

  // Listen for state change on input pins
  gpio.on('change', function(channel, value) {
    // Emmit to listeners here
    console.log('Channel ' + channel + ' value is now ' + value);
    addGpioPinEvent(channel, value);
  });

  if (callback) {
    callback();
  }
};

// Notify connected socket io clients of state change
var emitSocketIOGpioStateChange = function(pinNum,state) {
  console.log("Emitting state change to SocketIO");
  io.emit(SIO_STATE_CHANGED, {pin: pinNum, state: state});
};

// Notify connected socket io clients of script finish
var emitSocketIOGpioScriptFinished = function(name) {
  console.log("Emititng script finished to SocketIO",name);
  io.emit(SIO_SCRIPT_FINISHED, {name: name});
};

// Initialise express routes
var initRoutes = function(callback) {
  // Set the value of an output pin
  app.put("/api/gpio/pins/:pin/:value", jsonParser, function(req,res) {
    var pin = req.params.pin;
    var val = req.params.value;
    console.log("Setting output",pin,"to value",val);
    gpio.write(pin, val, function(err) {
      if (err) {
        util.sendHttpError(res,"Unable to set output of pin (gpio.write error) "+pin+" "+err);
      } else {
        addGpioPinEvent(pin,val);
        getGpioPinByNumber(pin,function(pinObj) {
          if (pinObj) {
            pinObj.state = val;
            util.sendHttpOK(res);
          } else {
            util.sendHttpError(res,"Unable to set output of pin (could not get pin by number)"+pin+" "+err);
          }
        });
      }
    });
  });

  // Get the list of pins configured
  app.get("/api/gpio/pins/list",jsonParser,function(req,res) {
    util.sendHttpJson(res,config.gpio.pins);
  });

  // Get the list of pins configured
  app.put("/api/gpio/pins/list",jsonParser,function(req,res) {
    var pinList = req.body.list;
    config.gpio.pins = pinList;
    util.sendHttpOK(res);
  });

  // Remove a pin from the config
  app.delete("/api/gpio/pins/name/:pin",jsonParser,function(req,res) {
    var pin = req.body.pin;
    convertUnderscoresToSpaces(pin,function(conv) {
      getGpioPinByName(conv, function(pinObj) {
      if (pinObj !== null) {
        var index = config.gpio.pins.indexOf(pinObj);
        if (index > -1) {
          config.gpio.pins.splice(index,1);
          util.sendHttpOK(res);
        } else {
          util.sendHttpError(res);
        }
      }  else{
        util.sendHttpError(res);
      }
    });
    });
  });

  // Add a pin to the config list
  app.put("/api/gpio/pins/add",jsonParser,function(req,res) {
    var num = req.body.num;
    var name = req.body.name;
    var io = req.body.io;
    var state = req.body.state;
    var hidden = req.body.hidden;

    var pin = {
      name: name,
      num: num,
      io: io,
      state: state,
      hidden: hidden,
    };
    config.gpio.pins.push(pin);
    initIndividualGpioPin(pin);
    util.sendHttpOK(res);
  });

  // Get the state of a pin
  app.get("/api/gpio/pins/number/:pin", jsonParser, function(req,res) {
    var pin = req.params.pin;
    getGpioPinByNumber(pin, function(pinObj) {
      if (pinObj !== null) {
        // Read state for input
        if (pinObj.io == "in") {
          gpio.read(pin, function(err, value) {
            if (err) {
              util.sendHttpError(res,"error reading pin "+pin);
            } else {
              util.sendHttpJson(res,{value: value});
            }
          });
        } else { // Get state from memory for output
          util.sendHttpJson(res,{value: pinObj.state});
        }
      } else {
        util.sendHttpNotFound(res);
      }
    });
  });

  // Get the state of a pin
  app.get("/api/gpio/pins/name/:pin", jsonParser, function(req,res) {
    var pin = req.params.pin;
    getGpioPinByName(pin, function(pinObj) {
      if (pinObj !== null) {
        // Read state for input
        if (pinObj.io == "in") {
          gpio.read(pin, function(err, value) {
            if (err) {
              util.sendHttpError(res,"error reading pin "+pin);
            } else {
              util.sendHttpJson(res,{value: value});
            }
          });
        } else { // Get state from memory for output
          util.sendHttpJson(res,{value: pinObj.state});
        }
      } else {
        util.sendHttpNotFound(res);
      }
    });
  });

  // Get the state history for a pin
  app.get('/api/gpio/pins/:pin/history', function(req,res) {
    var pin = req.params.pin;
    var data = eventHistory[pinNumString(pin)];
    if (data) {
      util.sendHttpJson(res,data);
    } else {
      util.sendHttpNotFound(res);
    }
  });

  // Delete GPIO Script
  app.delete('/api/gpio/script/:name',jsonParser,function(req,res) {
    var nme = req.params.name;
    convertUnderscoresToSpaces(nme,function(name) {
      getGpioScriptIndexByName(name,function(index) {
        if (index < 0) {
          util.sendHttpNotFound(res);
        } else {
          config.gpio.scripts.splice(index,1);
          util.sendHttpOK(res);
        }
      });
    });
  });

  // Update GPIO Script
  app.put('/api/gpio/script/:name',jsonParser,function(req,res){
    var script = req.body.script;
    var pName = req.params.name;
    convertUnderscoresToSpaces(pName, function(name) {
      console.log("Updating GPIO Script",script);
      getGpioScriptIndexByName(name,function(index) {
        if (index > 0) {
          config.gpio.scripts.splice(index,1);
        }
        config.gpio.scripts.push(script);
        util.sendHttpOK(res);
      });
    });
  });

  // Get a GPIO script
  app.get('/api/gpio/script/:name',jsonParser,function(req,res) {
    var name = req.params.name;
    getGpioScriptByName(name,function (script) {
      if (script) {
        console.log("Sending script for",name,script);
        util.sendHttpJson(res,script);
      } else {
        console.log("Script not found",name);
        util.sendHttpError(res);
      }
    });
  });

  // Get GPIO script list
  app.get('/api/gpio/scripts/list',jsonParser,function(req,res) {
    util.sendHttpJson(res,config.gpio.scripts);
  });

  // Execute a GPIO script
  app.get('/api/gpio/script/:name/execute',jsonParser,function(req,res) {
    var name = req.params.name;
    console.log("GPIO Script",name);

    getGpioScriptByName(name,function(script) {

      if (script === null) {
        console.log("Script",name,"was not found");
        util.sendHttpNotFound(res);
        return;
      } else {
        util.sendHttpOK(res);

        var doStates     = script.do;
        var whileStates  = script.while;
        var thenStates   = script.then;
        var iDo    = 0;
        var iWhile = 0;
        var iThen  = 0;
        console.log("Starting GPIO Script:",script);
        // Do States
        for (iDo = 0; iDo < doStates.length; iDo++){
          var dState = doStates[iDo];
          getGpioPinByName(dState.pin, function(pin){
            gpio.write(pin.num, dState.state, function(err){
              if (err){
                console.log("Script:", script.name, "Error writing begin state", dState.pin, pin.num, dState.state);
              } else {
                addGpioPinEvent(pin.num,dState.state);
                console.log("Script:", script.name, "Written begin state", dState.pin, pin.num, dState.state);
              }
            });
          });
        }

        // While States and loop
        var done = false;
        var scriptInterval = setInterval(function(){
          //console.log("Inside interval of script:",script.name);
          getWhileResult(whileStates, function(whileRes){
            //console.log("while result:", whileRes);
            if (!whileRes && !done){
              done = true;
              // Stop checking while condiion
              //console.log("Clearing interval for script",script.name);
              clearInterval(scriptInterval);
              // Apply Then States
              var iThen   = 0;
              var tState  = null;
              var nStates = thenStates.length;
              for (iThen = 0; iThen < nStates; iThen++){
                tState = thenStates[iThen];
                getGpioPinByName(tState.pin, function(pin){
                  gpio.write(pin.num, tState.state, function(err){
                    if (err){
                      console.log("Script:", script.name, "Error writing end state", tState.pin, pin.num, tState.state);
                    } else {
                      addGpioPinEvent(pin.num, tState.state);
                      console.log("Script:", script.name, "Written end state", tState.pin, pin.num, tState.state);
                    }
                  }); // gpio.write
                }); //getGpioPinByName
              } // For
              emitSocketIOGpioScriptFinished(name);
            } // if result
          }); // getWhileResult
        }, GPIO_SCRIPT_DELAY);
      }
    });
  });

  // Update the application from github
  app.get('/api/application/update', jsonParser, function(req,res) {
    var child = execFile(UPDATE_CMD, [] ,{cwd: __dirname},function (error, stdout, stderr) {
      if (error !== null) {
        util.sendHttpError(res,"Error updating app: "+error);
      } else {
        util.sendHttpJson(res,{result: stdout});
      }
    });
  });

  // Reload the application through PM2
  app.get('/api/application/restart', jsonParser, function(req,res) {
    var child = execFile(RESTART_CMD, [] ,{cwd: __dirname},function (error, stdout, stderr) {
      util.sendHttpOK(res);
    });
  });

  // Get the name of the device
  app.get('/api/device/name', jsonParser, function(req,res) {
    util.sendHttpJson(res, {name: config.device_name});
  });

  // Set the name of the device
  app.put('/api/device/name', jsonParser, function(req,res) {
    var name = req.body.devName;
    config.device_name = name;
    util.sendHttpOK(res);
  });

  // Get the device's uptime
  app.get('/api/device/uptime', jsonParser, function(req,res){
    var child = exec(UPTIME_CMD, function (error, stdout, stderr){
      if (error !== null){
        util.sendHttpError(res,"Error getting uptime: "+error);
      }else{
        util.sendHttpJson(res,{uptime: stdout});
      }
    });
  });

  // Get the device's hostname
  app.get('/api/device/hostname', jsonParser, function(req,res) {
    var child = exec(HOSTNAME_CMD, function (error, stdout, stderr) {
      if (error !== null) {
        util.sendHttpError(res,"Error getting hostname: "+error);
      } else {
        util.sendHttpJson(res,{hostname: stdout});
      }
    });
  });

  // Reboot the device
  app.get('/api/device/reboot', jsonParser, function(req,res){
    util.sendHttpOK(res);
    var child = exec(REBOOT_CMD, function (error, stdout, stderr) {
      if (error === null) {
        console.log("Rebooting the device...");
      }
    });
  });

  // Get the device's address'
  app.get('/api/device/address', jsonParser, function(req,res){
    var child = exec(ADDR_CMD, function (error, stdout, stderr){
      if (error !== null){
        util.sendHttpError(res,"Error getting address: "+error);
      } else{
        util.sendHttpJson(res,{address: stdout});
      }
    });
  });

  // Get serial enabled state
  app.get('/api/serial/enabled', jsonParser, function(req,res){
    util.sendHttpJson(res,{enabled: config.serial.enable});
  });

  // Set serial enabled state
  app.put('/api/serial/enabled/:en', jsonParser, function(req,res){
    var enParam = req.params.en;
    console.log("Enable param: ",enParam);
    var enabled = (enParam  == "true" ? true : false);
    config.serial.enable = enabled;
    if (enabled) {
      restartSerial();
    } else {
      closeSerial();
    }
    util.sendHttpOK(res);
  });

  // Get the devce's list of serial ports
  app.get('/api/serial/path/list',jsonParser,function(req,res) {
    SerialPortModule.list(function (err, ports){
      if (err || ports === undefined){
        util.sendHttpError(res);
      } else {
        var data = [];
        ports.forEach(function(port) {
          data.push(port.comName);
        });
        util.sendHttpJson(res,data);
      }
    });
  });

  // Get the list of serial commands
  app.get('/api/serial/commands/list',jsonParser,function(req,res) {
    util.sendHttpJson(res,config.serial.commands);
  });

  // Get an individual serial command
  app.get('/api/serial/command/:name',jsonParser,function(req,res){
    var name = req.params.name;
    getSerialCommandByName(name,function(cmd){
      if (cmd) {
        util.sendHttpJson(res,cmd);
      } else {
        util.sendHttpNotFound(res);
      }
    });
  });

  // Add a serial command to the configuration
  app.put('/api/serial/command/add',jsonParser,function(req,res){
    var name = req.body.name;
    var command = req.body.cmd;
    console.log("Adding command",name,"/",command);

    if (name !== undefined && command !== undefined){
      config.serial.commands.push({name: name, cmd: command});
      util.sendHttpOK(res);
    } else {
      util.sendHttpError(res);
    }
  });

  // Remove a serial command to the configuration
  app.put('/api/serial/command/remove',jsonParser,function(req,res) {
    var name = req.body.cmdName;
    console.log("Reomving command", name, "aka", req.body.cmdName);
    getSerialCommandIndexByName(name,function(index){
      if (index > -1) {
        config.serial.commands.splice(index, 1);
        util.sendHttpOK(res);
      } else {
        util.sendHttpNotFound(res);
      }
    });
  });

  app.put('/api/serial/command/execute', jsonParser, function(req,res) {
    var cmd = req.body.cmd;
    console.log("Executing command",cmd);
    if (serialPort !== null && serialPort.isOpen()){
      getSerialCommandByName(cmd,function(commandObject){
        if (commandObject){
          serialPort.write(commandObject.cmd, function(err){
            if (err){
              console.log("Serial execute error",err);
              util.sendHttpError(res);
            } else {
              util.sendHttpOK(res);
            }
          });
        } else {
          console.log("Serial execute error: no command obj");
          util.sendHttpError(res);
        }
      });
    } else {
      console.log("Serial execute error, no serial port or not isOpen()");
      util.sendHttpError(res);
    }
  });

  // Get list of supported baud rates
  app.get('/api/serial/baudrate/list',jsonParser,function(req,res) {
    util.sendHttpJson(res,BAUDRATE_LIST);
  });

  // Get the serial path
  app.get('/api/serial/path', jsonParser, function(req,res) {
    util.sendHttpJson(res,{path: config.serial.path});
  });

  // get the serial baud rate
  app.get('/api/serial/baudrate', jsonParser, function(req,res) {
    util.sendHttpJson(res,{baudrate: config.serial.baudrate});
  });

  // Set the serial device path
  app.put('/api/serial/path', jsonParser, function(req,res) {
    var path = req.body.path;
    if (path !== null) {
      config.serial.path = path;
      util.sendHttpOK(res);
    } else {
      util.sendHttpError(res);
    }
  });

  // Set the serial baud rate
  app.put('/api/serial/baudrate', jsonParser, function(req,res) {
    var baudrate = req.body.baudrate;
    if (baudrate !== null) {
      config.serial.baudrate = baudrate;
      util.sendHttpOK(res);
    } else {
      util.sendHttpError(res);
    }
  });

  // Restart the serial device
  app.put('/api/serial/restart',function (req,res) {
    restartSerial();
    util.sendHttpOK(res);
  });

  // Save the current configuration
  app.put('/api/config/save',function(req,res) {
    saveConfigFile(function(err) {
      if (err) {
        util.sendHttpError(res);
      }
      else {
        util.sendHttpOK(res);
      }
    });
  });

  if (callback) callback();
};

// Get result for GPIO script while
var getWhileResult = function(whileObjects, callback) {
  var i = 0;
  var nWhiles = whileObjects.length;
  //console.log("Checking",nWhiles,"while conditions");
  var next = null;
  var numVal = null;
  var result = null;

  for (i = 0; i < nWhiles; i++)
  {
    next = whileObjects[i];
    getGpioPinByName(next.pin, function(pin)
    {
      gpio.read(pin.num, function(err, value)
      {
        if (err)
        {
          console.log("Error reading pin",pin.num);
          callback(true);
        }
        else
        {
          numVal = (value ? 1 : 0);
          result = (numVal == pin.state);
          //console.log(i,": While",pin.state,"on",pin.num,". Got:",numVal);
          callback(result);
        }
      });
    });
  }
};


// Get a GPIO script by name
var getGpioScriptByName = function(name,callback){
  var i = 0;
  var nScripts = config.gpio.scripts.length;
  var next = null;
  var target = null;
  console.log("Checking",nScripts,"GPIO scripts for",name);
  for (i = 0; i < nScripts; i++){
    next = config.gpio.scripts[i];
    if (next.name == name){
      target = next;
      break;
    }
  }
  callback(target);
};

// Get a GPIO script by name
var getGpioScriptIndexByName = function(name,callback)  {
  getGpioScriptByName(name,function(script)  {
    callback(config.gpio.scripts.indexOf(script));
  });
};

// Get a serial command's index by name
var getSerialCommandIndexByName = function(name,callback){
  getSerialCommandByName(name, function(cmd)  {
    callback(config.serial.commands.indexOf(cmd));
  });
};

// Get a serial command by name
var getSerialCommandByName = function(name, callback){
  var i = 0;
  var nCommands = config.serial.commands.length;
  var next = null;
  var target = null;
  console.log("Checking",nCommands,"commands for",name);
  for (i = 0; i < nCommands; i++){
    next = config.serial.commands[i];
    if (next.name == name){
      target = next;
      break;
    }
  }
  callback(target);
};

var convertUnderscoresToSpaces = function(name,callback){
  callback((name.indexOf("_") > 0 ? name.split("_").join(" ") : name));
};

// Save the configuration object to disk
var saveConfigFile = function(callback){
  fs.writeFile(configPath, JSON.stringify(config, null, 2) , 'utf-8', function(err){
    if(err){
      console.log(err);
      callback(err);
    } else {
      console.log("The config file was saved!");
      callback(null);
    }
  });
};

// Convert a pin integer to a variable name
var pinNumString = function(pin) {
  return PIN+pin;
};

// Add an event to the pin history
var addGpioPinEvent = function(pinNum, state){
  if (eventHistory[pinNumString(pinNum)] === undefined){
    eventHistory[pinNumString(pinNum)] = [];
  }
  console.log("Adding pin event to history  (pin / state)",pinNum,"/",state);
  eventHistory[pinNumString(pinNum)].push({date: new Date(), state: state});
  emitSocketIOGpioStateChange(pinNum,state);
};

// Return a pin object based on it's number
var getGpioPinByNumber = function(pin,callback){
  var i = 0;
  var target = null;
  for (i = 0; i < config.gpio.pins.length; i++){
    if (config.gpio.pins[i].num == pin){
      target = config.gpio.pins[i];
      break;
    }
  }
  callback(target);
};

// Return a pin object based on it's number
var getGpioPinByName = function(pin,callback){
  var i = 0;
  var target = null;
  for (i = 0; i < config.gpio.pins.length; i++){
    if (config.gpio.pins[i].name == pin){
      target = config.gpio.pins[i];
      break;
    }
  }
  callback(target);
};

  initSerial();
  initGpio();
  initExpress();
  initSocketIO();
  initHttpServer();
  initRoutes();
