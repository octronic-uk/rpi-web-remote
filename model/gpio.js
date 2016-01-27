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
var gpio = require("rpi-gpio");
var eventHistory = {};
var io = null;
var util = require('./util');
// Constants
var SIO_STATE_CHANGED = "StateChanged";
var SIO_SCRIPT_FINISHED = "ScriptFinished";
var PIN = 'pin';
var GPIO_SCRIPT_DELAY =  100;
// Variables
var config = null;
// Functions -------------------------------------------------------------------
// Get a GPIO script by name
var _getScriptById = function(id,callback) {
  var i = 0;
  var nScripts = config.gpio.scripts.length;
  var next = null;
  var target = null;
  console.log("Checking",nScripts,"scripts for",id);
  for (i = 0; i < nScripts; i++) {
    next = config.gpio.scripts[i];
    if (next.id == id) {
      target = next;
      break;
    }
  }
  callback(target);
};
// Get a GPIO script by name
var _getScriptIndexById = function(id,callback)  {
  _getScriptById(id,function(script)  {
    callback(config.gpio.scripts.indexOf(script));
  });
};
// Get a pin object index from it's name
var _getPinIndexById = function(id, callback) {
  _getPinById(id, function(pinObj) {
    callback(config.gpio.pins.indexOf(pinObj));
  });
};
// Return a pin object based on id
var _getPinById = function(id,callback) {
  var i = 0;
  var target = null;
  var next = null;
  var nPins = config.gpio.pins.length;
  for (i = 0; i < nPins; i++) {
    next = config.gpio.pins[i];
    if (next.id == id) {
      target = next;
      break;
    }
  }
  callback(target);
};
// Initialise an individual GPIO pin
var _initIndividualPin = function(pin) {
  if (pin.io == "out") {
    gpio.setup(pin.num, gpio.DIR_OUT,function() {
      gpio.write(pin, pin.state, function(err) {
        if (err) {
          console.log("Error writing to pin",pin.num);
        } else  {
          console.log("Initial set-up pin",pin.num,"to",pin.state);
          _addPinEvent(pin.num, pin.state);
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
// Convert a pin integer to a variable name
var _pinNumString = function(pin) {
  return PIN+pin;
};
// Notify connected socket io clients of state change
var _emitSocketIOGpioStateChange = function(pin) {
  console.log("Emitting state change to SocketIO");
  io.emit(SIO_STATE_CHANGED, {pin: pin.id, state: pin.state});
};
// Notify connected socket io clients of script finish
var _emitSocketIOGpioScriptFinished = function(name) {
  console.log("Emititng script finished to SocketIO",name);
  io.emit(SIO_SCRIPT_FINISHED, {name: name});
};
// Add an event to the pin history
var _addPinEvent = function(pin, state) {
  pin.state = val;
  pin.history.push({date: new Date(), state: state});
  _emitSocketIOGpioStateChange(pin);
};
// Get result for GPIO script while
var _getWhileResult = function(whileObjects, callback) {
  var i = 0;
  var nWhiles = whileObjects.length;
  //console.log("Checking",nWhiles,"while conditions");
  var next = null;
  var numVal = null;
  var result = null;
  // Iterate through while state
  for (i = 0; i < nWhiles; i++) {
    next = whileObjects[i];
    _getPinById(next.pin, function(pin) {
      gpio.read(pin.num, function(err, value) {
        if (err) {
          console.log("Error reading pin",pin.num);
          callback(true);
        } else {
          numVal = (value ? 1 : 0);
          result = (numVal == pin.state);
          //console.log(i,": While",pin.state,"on",pin.num,". Got:",numVal);
          callback(result);
        }
      });
    });
  }
};
// Init GPIO Module
var init = function(_io,conf,callback) {
  config = conf;
  io = _io;
  var i = 0;
  var nPins = config.gpio.pins.length;
  for (i = 0; i < nPins; i++) {
    var pin = config.gpio.pins[i];
    _initIndividualPin(pin);
  }
  // Listen for state change on input pins
  gpio.on('change', function(channel, value) {
    // Emmit to listeners here
    console.log('Channel ' + channel + ' value is now ' + value);
    _addPinEvent(channel, value);
  });
  // Callback if present
  if (callback) {
    callback();
  }
};
// Close the GPIO pins in use
var close = function(callback) {
  gpio.destroy();
  if (callback) {
    callback();
  }
};
// Route Handlers --------------------------------------------------------------
// Set the value of an output pin
var putPinState = function(request,response) {
  var pinId = request.params.pinId;
  var val = request.params.value;
  _getPinById(pinId, function(pin) {
    if (pin) {
      console.log("Setting output",pinId," (",pin.num,") to value",val);
      gpio.write(pin.num, val, function(err) {
        if (err) {
          util.sendHttpError(response,"Unable to set output of pin (gpio.write error) "+pinId+" "+err);
        } else {
          _addPinEvent(pin);
          util.sendHttpOK(response);
        }
      });
    }
    else {
      util.sendHttpNotFound(response);
    }
  });
};
// Get the list of pins configured
var getPinList = function(request,response) {
  util.sendHttpJson(response,config.gpio.pins);
};
// Get the list of pins configured
var putPinList = function(request,response) {
  var pinList = request.body.list;
  config.gpio.pins = pinList;
  util.sendHttpOK(response);
};
// Remove a pin from the config
var deletePin = function(request,response) {
  var id = request.params.id;
  _getPinIndexById(id, function(index) {
    if (index > -1) {
      config.gpio.pins.splice(index,1);
      util.sendHttpOK(response);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Add a pin to the config list
var putPinToList = function(request,response) {
  var pin = request.body;
  _getPinIndexById(pin.id,function(index) {
    if (index > -1) {
      config.gpio.pins.splice(index,1);
    }
    config.gpio.pins.push(pin);
    _initIndividualPin(pin);
    util.sendHttpOK(response);
  });
};
// Get the state of a pin
var getPinDefinition = function(request,response) {
  var id = request.params.id;
  _getGpioPinById(id, function(pin) {
    if (pin) {
      util.sendHttpJson(response,pin);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Get the state of a pin
var getPinState = function(request,response) {
  var id = request.params.id;
  _getGpioPinById(id, function(pin) {
    if (pin) {
      // Read state for input
      if (pin.io == "in") {
        gpio.read(pin.num, function(err, value) {
          if (err) {
            util.sendHttpError(response,"error reading pin "+pin.num);
          } else {
            util.sendHttpJson(response,{value: value});
          }
        });
      } else { // Get state from memory for output
        util.sendHttpJson(response,{value: pin.state});
      }
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Get the state history for a pin
var getPinHistory = function(request,response) {
  var id = request.params.id;
  _getPinById(id,function(pin){
    if(pin)
    {
      util.sendHttpJson(response,pin.history);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Delete GPIO Script
var deleteScript = function(request,response) {
  var id = request.params.id;
    _getScriptIndexById(id,function(index) {
    if (index > -1) {
      config.gpio.scripts.splice(index,1);
      util.sendHttpOK(response);
    } else {
      util.sendHttpNotFound(response);
    }
  });
};
// Update GPIO Script
var putScript = function(request,response) {
  var script = request.body.script;
  var id = request.params.id;
  console.log("Updating GPIO Script",script);
  _getScriptIndexById(id,function(index) {
    if (index > -1) {
      config.gpio.scripts.splice(index,1);
    }
    config.gpio.scripts.push(script);
    util.sendHttpOK(response);
  });
};
// Get a GPIO script
var getScript = function(request,response) {
  var id = request.params.id;
  _getGpioScriptById(id,function (script) {
    if (script) {
      console.log("Sending script for",name,script);
      util.sendHttpJson(response,script);
    } else {
      console.log("Script not found",name);
      util.sendHttpError(response);
    }
  });
};
// Get GPIO script list
var getScriptsList = function(request,response) {
  util.sendHttpJson(response,config.gpio.scripts);
};
// Execute a GPIO script
var executeScript = function(request,response) {
  var id = request.params.id;
  _getGpioScriptById(id,function(script) {
    if (script) {
      console.log("GPIO Script",script.name);
      util.sendHttpOK(response);
      var doStates     = script.do;
      var whileStates  = script.while;
      var thenStates   = script.then;
      var iDo    = 0;
      var iWhile = 0;
      var iThen  = 0;
      console.log("Starting GPIO Script:",script);
      // Do States
      for (iDo = 0; iDo < doStates.length; iDo++) {
        var dState = doStates[iDo];
        _getGpioPinByName(dState.pin, function(pin) {
          gpio.write(pin.num, dState.state, function(err) {
            if (err) {
              console.log("Script:", script.name, "Error writing begin state", dState.pin, pin.num, dState.state);
            } else {
              _addPinEvent(pin.num,dState.state);
              console.log("Script:", script.name, "Written begin state", dState.pin, pin.num, dState.state);
            }
          });
        });
      }
      // While States and loop
      var done = false;
      var scriptInterval = setInterval(function() {
        //console.log("Inside interval of script:",script.name);
        _getWhileResult(whileStates, function(whileRes) {
          //console.log("while res:", whileRes);
          if (!whileRes && !done) {
            done = true;
            // Stop checking while condiion
            //console.log("Clearing interval for script",script.name);
            clearInterval(scriptInterval);
            // Apply Then States
            var iThen   = 0;
            var tState  = null;
            var nStates = thenStates.length;
            for (iThen = 0; iThen < nStates; iThen++) {
              tState = thenStates[iThen];
              _getGpioPinByName(tState.pin, function(pin) {
                gpio.write(pin.num, tState.state, function(err) {
                  if (err) {
                    console.log("Script:", script.name, "Error writing end state", tState.pin, pin.num, tState.state);
                  } else {
                    _addPinEvent(pin.num, tState.state);
                    console.log("Script:", script.name, "Written end state", tState.pin, pin.num, tState.state);
                  }
                }); // gpio.write
              }); //getGpioPinByName
            } // For
            _emitSocketIOGpioScriptFinished(name);
          } // if result
        }); // getWhileResult
      }, GPIO_SCRIPT_DELAY);
    } else {
      console.log("Script",id,"was not found");
      util.sendHttpNotFound(response);
      return;
    }
  });
};
// Exports ---------------------------------------------------------------------
module.exports = {
  init : init,
  close : close,
  putPinState: putPinState,
  getPinList:  getPinList,
  putPinList:  putPinList,
  deletePin:   deletePin,
  putPinToList: putPinToList,
  getPinDefinition: getPinDefinition,
  getPinState:  getPinState,
  getPinHistory: getPinHistory,
  deleteScript:  deleteScript,
  putScript: putScript,
  getScript: getScript,
  getScriptsList: getScriptsList,
  executeScript:  executeScript,
};
