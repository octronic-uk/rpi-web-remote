// Using https://github.com/JamesBarwell/rpi-gpio.js
// Requires
var SerialPort = require("serialport").SerialPort
var gpio       = require("rpi-gpio");
var path       = require('path');
var bodyParser = require('body-parser');
var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var util       = require('./util')
var constants  = require('./constants')
var config     = require('../config.json');

// Variables
var port          = config.http_port;
var app           = express();
var jsonParser    = bodyParser.json();
var rawParser     = bodyParser.raw();
var httpServer    = http.createServer(app);
var eventHistory  = {};
var PIN           = "pin";
var serialPort    = null;

if (config.serial.enabled)
{
  console.log("Enabling serial port:",config.serial.path,"at",config.serial.baudrate);
  serialPort = new SerialPort(config.serial.path, {baudrate: config.serial.baudrate});
}
else
{
  console.log("Serial port support is not enabled");
}

// Configure express
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../view')));
app.use(express.static(path.join(__dirname, '../controller')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-bootstrap')));
app.use(express.static(path.join(__dirname, '../node_modules/angular')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-cookies')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-router/release')));

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

// Get the name of the device
app.get('/api/devicename', jsonParser, function(req,res)
{
  util.sendHttpJson(res, {name: config.device_name});
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
