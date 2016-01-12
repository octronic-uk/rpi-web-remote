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
  if (serialPort && serialPort.isOpen())
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
}

var initSerial = function()
{
  if (config.serial)
  {
    console.log("Enabling serial port:",config.serial.path,"at",config.serial.baudrate);
    serialPort = new SerialPort(config.serial.path, {baudrate: config.serial.baudrate}, false);

    serialPort.on('error', function(err) {
      console.log(err); // THIS SHOULD WORK!
    });

    serialPort.open(function (err)
    {
      if (err) {
         console.log(err);
      }
    });
  }
  else
  {
    console.log("Serial port support is not enabled");
  }
}

var restartSerial = function()
{
  closeSerial(initSerial);
}

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
}

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

    var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

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
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    console.log('Listening on ' + bind);
  });
}

var initGpio = function()
{
  // Initialise pins
  config.pins.forEach(function(pin)
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
  });

  // Listen for state change on input pins
  gpio.on('change', function(channel, value)
  {
    // Emmit to listeners here
    console.log('Channel ' + channel + ' value is now ' + value);
    addPinEvent(channel, value);
  });
}

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
        util.sendHttpError(res,"Unable to set output of pin "+pin);
      }
      else
      {
        addPinEvent(pin,val);
        getPin(pin,function(pinObj)
        {
          if (pinObj)
          {
            pinObj.state = val;
            util.sendHttpOK(res);
          }
          else
          {
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

  // Get the state of a pin
  app.get("/api/gpio/:pin", jsonParser, function(req,res)
  {
    var pin = req.params.pin;

    getPin(pin, function(pinObj)
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

  // Get the devce's list of serial ports
  app.get('/api/device/serial/list',jsonParser,function(req,res)
  {
    if (serialPort)
    {
      SerialPortModule.list(function (err, ports)
      {
        if (err || ports == null)
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
    }
    else
    {
      util.sendHttpNotFound(res);
    }
  });

  // Get the list of serial commands
  app.get('/api/device/serial/command/list',jsonParser,function(req,res)
  {
    util.sendHttpJson(res,config.serial.commands);
  });

  // Add a serial command to the configuration
  app.put('/api/device/serial/command',jsonParser,function(req,res)
  {
    var name = req.body.name;
    var command = req.body.cmd;

    if (name != undefined && command != undefined)
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
  app.delete('/api/device/serial/command',jsonParser,function(req,res)
  {
    var name = req.body.name;
    var index = getSerialCommandIndexByName(name);

    if (index > -1)
    {
      config.serial.command.splice(index, 1);
      util.sendHttpOK(res);
    }
    else
    {
      util.sendHttpNotFound(res);
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
    util.sendHttpJson(res,{baudrate: config.serial.baudrate})
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
}

// Get a serial command's index by name
var getSerialCommandIndexByName = function(name)
{
  return config.serial.commands.indexOf(getSerialCommandByName(name));
}

// Get a serial command by name
var getSerialCommandByName = function(name)
{
  var nCommands = config.serial.commands.length;
  for (var i = 0; i < nCommands; i++)
  {
    var next = config.serial.commands[i];

    if (next.name == name)
    {
      return next;
    }
  }
}

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
}

// Convert a pin integer to a variable name
var pinNumString = function(pin)
{
  return PIN+pin;
}

// Add an event to the pin history
var addPinEvent = function(pinNum, state)
{
  if (eventHistory[pinNumString(pinNum)] == null)
  {
    eventHistory[pinNumString(pinNum)] = [];
  }
  console.log("Adding pin event to history  (pin / state)",pinNum,"/",state);
  eventHistory[pinNumString(pinNum)].push({date: new Date(), state});
}

// Return a pin object based on it's number
var getPin = function(pin,callback)
{
  for (i = 0; i < config.pins.length; i++)
  {
    if (config.pins[i].num == pin)
    {
      callback(config.pins[i]);
      break;
    }
  }
}

initSerial();
initGpio();
initExpress();
initHttpServer();
initRoutes();
