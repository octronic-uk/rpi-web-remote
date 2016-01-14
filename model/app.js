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

// Variables
var port          = config.http_port;
var app           = express();
var jsonParser    = bodyParser.json();
var rawParser     = bodyParser.raw();
var httpServer    = http.createServer(app);
var eventHistory  = {};
var PIN           = "pin";
var serialPort    = null;
var baudRateList = [

  115200, 57600, 38400, 19200,
  9600,   4800,  2400,  1800,
  1200,   600,   300,   200,
  150,    134,   110,   75, 50
];

var closeSerial = function(callback)
{
  if (serialPort !== null && serialPort.isOpen())
  {
    serialPort.close(function(error)
    {
      if (error)
      {
        console.log("FATAL: Error closing serial port");
        process.exit(constants.APP_EXIT_ERROR);
      }
      else
      {
        console.log("Successfuly closed serial port");
        callback();
      }
    });
  }
  else {
    callback();
  }
};

var initSerial = function()
{
  if (config.serial.enable)
  {
    console.log("Enabling serial port:",config.serial.path,"at",config.serial.baudrate);
    if (serialPort === null) Port = new SerialPort(config.serial.path, {baudrate: config.serial.baudrate});

    serialPort.on('error', function(err)
    {
      config.serial.enable = false;
      console.log(err);
    });

    serialPort.open(function (err)
    {
      if (err)
      {
        config.serial.enable = false;
        console.log(err);
      }
    });
  }
  else
  {
    console.log("Serial port support is not enabled");
  }
};

var restartSerial = function()
{
  closeSerial(initSerial);
};

// Configure express
var initExpress = function()
{
  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, '../view')));
  app.use(express.static(path.join(__dirname, '../controller')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-bootstrap')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-cookies')));
  app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
  app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-router/release')));
};

var initHttpServer = function()
{
  // HTTP Listen
  httpServer.listen(port);

  // HTTP Error handler
  httpServer.on('error', function(error)
  {
    if (error.syscall !== 'listen')
    {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
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
  httpServer.on('listening', function()
  {
    var addr = httpServer.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });
};

var closeGpio = function(callback)
{
  gpio.destroy();
  if (callback) callback();
};

var initIndividualGpioPin = function(pin)
{
  if (pin.io == "out")
  {
    gpio.setup(pin.num, gpio.DIR_OUT,function()
    {
      gpio.write(pin, pin.state, function(err)
      {
        console.log("set pin",pin.num,"to",pin.state);
        addPinEvent(pin.num, pin.state);
      });
    });
  }
  else if (pin.io == "in")
  {
    gpio.setup(pin.num, gpio.DIR_IN, gpio.EDGE_BOTH);
  }
  else {
    config.log("Error, pin",pin.num,"should be 'in' or 'out'");
  }
};

var initGpio = function(callback)
{
  // Initialise pins
  config.pins.forEach(function(pin)
  {
    initIndividualGpioPin(pin);
  });

  // Listen for state change on input pins
  gpio.on('change', function(channel, value)
  {
    // Emmit to listeners here
    console.log('Channel ' + channel + ' value is now ' + value);
    addPinEvent(channel, value);
  });

  if (callback) callback();
};

var initRoutes = function()
{
  // Set the value of an output pin
  app.put("/api/gpio/:pin/:value", jsonParser, function(req,res)
  {
    var pin = req.params.pin;
    var val = req.params.value;

    console.log("Setting output",pin,"to value",val);

    gpio.write(pin, val, function(err)
    {
      if (err)
      {
        util.sendHttpError(res,"Unable to set output of pin (err 1) "+pin+" "+err);
      }
      else
      {
        addPinEvent(pin,val);
        getPinByNumber(pin,function(pinObj)
        {
          if (pinObj)
          {
            pinObj.state = val;
            util.sendHttpOK(res);
          }
          else
          {
            util.sendHttpError(res,"Unable to set output of pin (err 2 )"+pin+" "+err);
              util.sendHttpError(res);
          }
        });
      }
    });
  });

  // Get the list of pins configured
  app.get("/api/gpio/list",jsonParser,function(req,res)
  {
    util.sendHttpJson(res,config.pins);
  });

  // Get the list of pins configured
  app.put("/api/gpio/list",jsonParser,function(req,res)
  {
    var pinList = req.body.list;
    config.pins = list;
    util.sendHttpOK(res);
  });

  // Remove a pin from the config
  app.put("/api/gpio/remove",jsonParser,function(req,res)
  {
    var pin = req.body.pin;
    getPinByName(pin, function(pinObj)
    {
      if (pinObj)
      {
        var index = config.pins.indexOf(pinObj);

        if (index > -1)
        {
          config.pins.splice(index,1);
          util.sendHttpOK(res);
        }
        else
        {
          util.sendHttpError(res);
        }
      }
      else
      {
        util.sendHttpError(res);
      }
    });
  });

  // Add a pin to the config list
  app.put("/api/gpio/add",jsonParser,function(req,res)
  {
    var num = req.body.num;
    var name = req.body.name;
    var io = req.body.io;
    var state = req.body.state;

    var pin = {
      name: name,
      num: num,
      io: io,
      state: state
    };

    config.pins.push(pin);
    initIndividualGpioPin(pin);
    util.sendHttpOK(res);
  });

  // Get the state of a pin
  app.get("/api/gpio/:pin", jsonParser, function(req,res)
  {
    var pin = req.params.pin;

    getPinByNumber(pin, function(pinObj)
    {
      if (pinObj)
      {
        // Read state for input
        if (pinObj.io == "in")
        {
          gpio.read(pin, function(err, value)
          {
            if (err)
            {
              util.sendHttpError(res,"error reading pin "+pin);
            }
            else
            {
              util.sendHttpJson(res,{value: value});
            }
          });
        }
        // Get state from memory for output
        else
        {
          util.sendHttpJson(res,{value: pinObj.state});
        }
      }
      else
      {
        util.sendHttpNotFound(res);
      }
    });
  });

  // Get the state history for a pin
  app.get('/api/gpio/:pin/history', function(req,res)
  {
    var pin = req.params.pin;
    var data = eventHistory[pinNumString(pin)];

    if (data)
      util.sendHttpJson(res,data);
    else
      util.sendHttpNotFound(res);
  });

  // Get the name of the device
  app.get('/api/device/name', jsonParser, function(req,res)
  {
    util.sendHttpJson(res, {name: config.device_name});
  });

  // Get serial enabled state
  app.get('/api/device/serial/enabled', jsonParser, function(req,res)
  {
    util.sendHttpJson(res,{enabled: config.serial.enable});
  });

  // Set serial enabled state
  app.put('/api/device/serial/enabled/:en', jsonParser, function(req,res)
  {
    var enParam = req.params.en;
    console.log("Enable param: ",enParam);
    var enabled = (enParam  == "true" ? true : false);

    config.serial.enable = enabled;
    if (enabled)
    {
      restartSerial();
    }
    else
    {
      closeSerial();
    }
    util.sendHttpOK(res);
  });

  // Get the devce's list of serial ports
  app.get('/api/device/serial/list',jsonParser,function(req,res)
  {
    SerialPortModule.list(function (err, ports)
    {
      if (err || ports === undefined)
      {
        util.sendHttpError(res);
      }
      else
      {
        var data = [];

        ports.forEach(function(port)
        {
          data.push(port.comName);
        });

        util.sendHttpJson(res,data);
      }
    });
  });

  // Get the list of serial commands
  app.get('/api/device/serial/command/list',jsonParser,function(req,res)
  {
    util.sendHttpJson(res,config.serial.commands);
  });

  // Add a serial command to the configuration
  app.put('/api/device/serial/command/add',jsonParser,function(req,res)
  {
    var name = req.body.name;
    var command = req.body.cmd;
    console.log("Adding command",name,"/",command);

    if (name !== undefined && command !== undefined)
    {
      config.serial.commands.push({name: name, cmd: command});
      util.sendHttpOK(res);
    }
    else
    {
      util.sendHttpError(res);
    }
  });

  // Remove a serial command to the configuration
  app.put('/api/device/serial/command/remove',jsonParser,function(req,res)
  {
    var name = req.body.cmdName;
    console.log("Reomving command", name, "aka", req.body.cmdName);
    getSerialCommandIndexByName(name,function(index)
    {
      if (index > -1)
      {
        config.serial.commands.splice(index, 1);
        util.sendHttpOK(res);
      }
      else
      {
        util.sendHttpNotFound(res);
      }
    });
  });

  app.put('/api/device/serial/command/execute', jsonParser, function(req,res)
  {
    var cmd = req.body.cmd;
    console.log("Executing command",cmd);

    if (serialPort !== null && serialPort.isOpen())
    {
      getSerialCommandByName(cmd,function(commandObject)
      {
        if (commandObject)
        {
          serialPort.write(commandObject.cmd, function(err)
          {
            if (err)
            {
              console.log("Serial execute error",err);
              util.sendHttpError(res);
            }
            else
            {
              util.sendHttpOK(res);
            }
          });
        }
        else
        {
          console.log("Serial execute error: no command obj");
          util.sendHttpError(res);
        }
      });
    }
    else
    {
      console.log("Serial execute error, no serial port or not isOpen()");
      util.sendHttpError(res);
    }
  });

  // Get list of supported baud rates
  app.get('/api/device/serial/baudrate/list',jsonParser,function(req,res)
  {
    util.sendHttpJson(res,baudRateList);
  });

  // Get the serial path
  app.get('/api/device/serial/path', jsonParser, function(req,res)
  {
    util.sendHttpJson(res,{path: config.serial.path});
  });

  // get the serial baud rate
  app.get('/api/device/serial/baudrate', jsonParser, function(req,res)
  {
    util.sendHttpJson(res,{baudrate: config.serial.baudrate});
  });

  // Set the serial device path
  app.put('/api/device/serial/path', jsonParser, function(req,res)
  {
    var path = req.body.path;

    if (path)
    {
      config.serial.path = path;
      util.sendHttpOK(res);
    }
    else
    {
      util.sendHttpError(res);
    }
  });

  // Set the serial baud rate
  app.put('/api/device/serial/baudrate', jsonParser, function(req,res)
  {
    var baudrate = req.body.baudrate;
    if (baudrate)
    {
      config.serial.baudrate = baudrate;
      util.sendHttpOK(res);
    }
    else
    {
      util.sendHttpError(res);
    }
  });

  // Restart the serial device
  app.put('/api/device/serial/restart',function (req,res)
  {
    restartSerial();
    util.sendHttpOK(res);
  });

  // Save the current configuration
  app.put('/api/config/save',function(req,res)
  {
    saveConfigFile(function(err)
    {
      if (err)
      {
        util.sendHttpError(res);
      }
      else
      {
        util.sendHttpOK(res);
      }
    });
  });
};

// Get a serial command's index by name
var getSerialCommandIndexByName = function(name,callback)
{
  getSerialCommandByName(name, function(cmd)
  {
    callback(config.serial.commands.indexOf(cmd));
  });
};

// Get a serial command by name
var getSerialCommandByName = function(name, callback)
{
  var nCommands = config.serial.commands.length;
  console.log("Checking",nCommands,"commands for",name);
  for (var i = 0; i < nCommands; i++)
  {
    var next = config.serial.commands[i];

    if (next.name == name)
    {
      callback(next);
      break;
    }
  }
};

// Save the configuration object to disk
var saveConfigFile = function(callback)
{
  fs.writeFile(configPath, JSON.stringify(config, null, 2) , 'utf-8', function(err)
  {
    if(err)
    {
      console.log(err);
      callback(err);
    }
    else
    {
      console.log("The config file was saved!");
      callback(null);
    }
  });
};

// Convert a pin integer to a variable name
var pinNumString = function(pin)
{
  return PIN+pin;
};

// Add an event to the pin history
var addPinEvent = function(pinNum, state)
{
  if (eventHistory[pinNumString(pinNum)] === undefined)
  {
    eventHistory[pinNumString(pinNum)] = [];
  }
  console.log("Adding pin event to history  (pin / state)",pinNum,"/",state);
  eventHistory[pinNumString(pinNum)].push({date: new Date(), state: state});
};

// Return a pin object based on it's number
var getPinByNumber = function(pin,callback)
{
  for (i = 0; i < config.pins.length; i++)
  {
    if (config.pins[i].num == pin)
    {
      callback(config.pins[i]);
      break;
    }
  }
};

// Return a pin object based on it's number
var getPinByName = function(pin,callback)
{
  for (i = 0; i < config.pins.length; i++)
  {
    if (config.pins[i].name == pin)
    {
      callback(config.pins[i]);
      break;
    }
  }
};

initSerial();
initGpio();
initExpress();
initHttpServer();
initRoutes();
