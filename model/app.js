// https://github.com/JamesBarwell/rpi-gpio.js
var gpio       = require("rpi-gpio");
var path       = require('path');
var bodyParser = require('body-parser');
var express    = require('express');
var http       = require('http');
var logger     = require('morgan');
var util       = require('./util')
var constants      = require('./constants')
var config     = require('../config.json');

var port       = config.http_port;
var app        = express();
var jsonParser = bodyParser.json();
var rawParser  = bodyParser.raw();
var httpServer = http.createServer(app);

var PIN       = "pin";

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '../view')));
app.use(express.static(path.join(__dirname, '../controller')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-bootstrap')));
app.use(express.static(path.join(__dirname, '../node_modules/angular')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-cookies')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/angular-ui-router/release')));

httpServer.listen(port);

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
  var dir = null;
  if (pin.io == "out") dir = gpio.DIR_OUT;
  else if (pin.io == "in") dir = gpio.DIR_IN;

  if (dir != null)
  {
  gpio.setup(pin.num, dir,function()
  {
    gpio.write(pin, pin.state, function(err)
    {
      console.log("set pin",pin.num,"to",pin.state);
    });
  });
  }
  else
  {
    console.log("Error pin",pin.num,"has no direction defined");
    process.exit(constants.APP_EXIT_ERROR);
  }
});

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
      config.pins.["pin"+pin] = val;
      util.sendHttpOK(res);
    }
	});
});

app.get("/api/gpio/list",jsonParser,function(req,res){
  util.sendHttpJson(res,config.pins);
});

app.get("/api/gpio/:pin/state", jsonParser, function(req,res)
{
  var pin = req.params.pin;
  var data = false;

  if (config.pins[PIN+pin])
  {
    data = config.pins[PIN+pin];
  }

  util.sendHttpJson(res,{value: data});
});

app.get("/api/gpio/:pin", jsonParser, function(req,res)
{
  var pin = req.params.pin;

  if (config.pins[PIN+pin].io == "in")
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
  else
  {
    util.sendHttpNotFound(res);
  }
});
