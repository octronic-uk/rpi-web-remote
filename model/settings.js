// Requires
var util       = require('./util');
var configPath = path.join(__dirname, "../"+constants.CONFIG);
var config     = require(configPath);
var fs         = require('fs');
// Constants
// Variables
// Functions ------------------------------------------------------------------
// Save the configuration object to disk
var _saveConfigFile = function(callback) {
  fs.writeFile(configPath, JSON.stringify(config, null, 2) , 'utf-8', function(err) {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      console.log("The config file was saved!");
      callback(null);
    }
  });
};
// Route Handlers --------------------------------------------------------------
// Get the name of the device
var getDeviceName =  function(request,response) {
  util.sendHttpJson(response, {name: config.device_name});
};
  // Set the name of the device
var putDeviceName = function(request,response) {
  var name = request.body.devName;
  config.device_name = name;
  util.sendHttpOK(response);
};
  // Get the application listening port
var getPort = function(request,response) {
  util.sendHttpJson(response, {port: config.http_port});
};
  // Set the application listening port
var putPort = function(request,response) {
  config.http_port = request.body.port;
  util.sendHttpOK(response);
};
// Save the current configuration
var save = function(request,response) {
  _saveConfigFile(function(err) {
    if (err) {
      util.sendHttpError(response);
    }
    else {
      util.sendHttpOK(response);
    }
  });
};
// Exports --------------------------------------------------------------------
module.exports = {
  getDeviceName : getDeviceName,
  putDeviceName : putDeviceName,
  getPort : getPort,
  putPort : putPort,
  save: save,
};
