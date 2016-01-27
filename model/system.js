// Requires
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var util = require('./util');
// Constant
var UPTIME_CMD   = 'uptime -p';
var ADDR_CMD     = 'hostname -I';
var HOSTNAME_CMD = 'hostname';
var REBOOT_CMD   = "reboot";
var RESTART_CMD  =  path.join(__dirname, "../restart");
var UPDATE_CMD   =  path.join(__dirname, "../update_internal");
// Variables
var config = null;
// Functions -------------------------------------------------------------------
var init = function(conf,callback)
{
  config = conf;
  if (callback) {
    callback();
  }
};
// Route Handlers --------------------------------------------------------------
// Update the application from github
var update = function(request,response) {
  var child = execFile(UPDATE_CMD, [] ,{cwd: __dirname},function (error, stdout, stderr) {
    if (error !== null) {
      util.sendHttpError(response,"Error updating app: "+error);
    } else {
      util.sendHttpJson(response,{result: stdout});
    }
  });
};
// Reload the application through PM2
var restart =  function(request,response) {
  util.sendHttpOK(response);
  console.log("Restarting application");
  var child = execFile(RESTART_CMD, [] ,{cwd: __dirname},function (error, stdout, stderr) {});
};
// Uptime
var uptime = function(request,response) {
  var child = exec(UPTIME_CMD, function (error, stdout, stderr) {
    if (error !== null) {
      util.sendHttpError(response,"Error getting uptime: "+error);
    } else {
      util.sendHttpJson(response,{uptime: stdout});
    }
  });
};
// Reboot the device
var reboot = function(request,response) {
  util.sendHttpOK(response);
  var child = exec(REBOOT_CMD, function (error, stdout, stderr) {
    if (error === null) {
      console.log("Rebooting the device...");
    }
  });
};
// Get the device's hostname
var getHostname = function(request,response) {
  var child = exec(HOSTNAME_CMD, function (error, stdout, stderr) {
    if (error !== null) {
      util.sendHttpError(response,"Error getting hostname: "+error);
    } else {
      util.sendHttpJson(response,{hostname: stdout});
    }
  });
};
// Get the device's address'
var getAddress =  function(request,response) {
  var child = exec(ADDR_CMD, function (error, stdout, stderr) {
    if (error !== null) {
      util.sendHttpError(response,"Error getting address: "+error);
    } else{
      util.sendHttpJson(response,{address: stdout});
    }
  });
};
// Module Exports --------------------------------------------------------------
module.exports = {
  init : init,
  update : update,
  restart : restart,
  uptime : uptime,
  reboot : reboot,
  getHostname: getHostname,
  getAddress: getAddress,
};
