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
App.factory('appApi',['util','$http',function(util, $http)
{
  return {
    putDevicePort : function(port, callback) {
      $http({
        method: "PUT",
        url: "/api/device/port",
        data: { port: port }
      }).then(function successCalback(resp){
        callback(true);
      },function errorCallback(resp){
        callback(false);
      });
    },
    getDevicePort : function(callback) {
      $http({
        method: "GET",
        url: "/api/device/port"
      }).then(function successCalback(resp){
        callback(JSON.parse(resp.data).port);
      },function errorCallback(resp){
        callback(null);
      });
    },
    putSerialCommand : function(cmd,callback) {
			$http({
				method: "PUT",
				url: "/api/serial/command",
				data: cmd
			}).then(function successCalback(resp) {
				callback(true);
			}, function errorCallback(resp) {
				callback(false);
			});
		},
		deleteSerialCommand : function(cmd,callback) {
			console.log("Removing command",cmd.id);
			$http({
				method: "DELETE",
				url: "/api/serial/command/"+cmd.id,
			}).then(function successCalback(resp) {
				callback(true);
			}, function errorCallback(resp) {
				callback(false);
			});
		},
		putGpioPinValue : function(pin, callback) {
			$http({
				method: "PUT",
				url: "/api/gpio/pins/"+pin.id+"/state/"+pin.value
			}).then(function successCallback(resp) {
				callback(true);
			},function errorCallback(resp) {
				callback(false);
			});
		},
		getGpioPinById : function(id, callback) {
      $http({
				method: "GET",
				url: "/api/gpio/pins/"+id
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data));
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getGpioPinList : function(callback) {
			$http({
				method: "GET",
				url: "/api/gpio/pins/list"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data));
			},function errorCallback(resp) {
				callback(null);
			});
		},
		deleteGpioPin : function(pin,callback) {
			$http({
				method: "DELETE",
				url: "/api/gpio/pins/"+pin.id,
			}).then(function successCallback(res) {
				callback(true);
			},function errorCallback(res) {
				callback(false);
			});
		},
		putGpioPin : function(pin,callback) {
			$http({
				method: "put",
				url: "/api/gpio/pins",
				data: pin
      }).then(function successCallback(res) {
				callback(true);
			},function errorCallback(res) {
				callback(false);
			});
		},
		getApplicationRestart : function(callback) {
			$http({
				method: "GET",
				url: "/api/application/restart"
			}).then(function successCallback(resp) {
				callback(true);
			},function errorCallback(resp) {
				callback(false);
			});
		},
		getApplicationUpdate : function(callback) {
			$http({
				method: "GET",
				url: "/api/application/update"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).result);
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getDeviceName : function(callback) {
			$http({
				method: "GET",
				url: "/api/device/name"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).name);
			},function errorCallback(resp) {
				callback(null);
			});
		},
		putDeviceName : function(deviceName, callback) {
			$http({
				method: "PUT",
				url: "/api/device/name",
				data: {
					devName: deviceName
				}
			}).then(function successCallback(resp) {
				callback(true);
			},function errorCallback(resp) {
				callback(false);
			});
		},
		getDeviceUptime : function(callback) {
			$http({
				method: "GET",
				url: "/api/device/uptime"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).uptime);
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getDeviceHostname : function(callback) {
			$http({
				method: "GET",
				url: "/api/device/hostname"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).hostname.replace(" ","\n"));
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getDeviceAddress : function(callback) {
			$http({
				method: "GET",
				url: "/api/device/address"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).address);
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getDeviceReboot : function(callback) {
			$http({
				method: "GET",
				url: "/api/device/reboot"
			}).then(function successCallback(resp) {
				callback(null);
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getSerialPathList : function(callback) {
			$http({
				method: "GET",
				url: "/api/serial/path/list"
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data));
			},function errorCallback(resp) {
				callback(null);
			});
		},
		getSerialBaudrateList : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/baudrate/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		},
		getSerialPath : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/path",
			}).then(function successCallback(res)
			{
				callback(JSON.parse(res.data).path);
			},function errorCallback(res)
			{
				callback(null);
			});
		},
		getSerialBaudrate : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/baudrate",
			}).then(function successCallback(res)
			{
				callback(JSON.parse(res.data).baudrate);
			},function errorCallback(res)
			{
				callback(null);
			});
		},
		putSerialPath : function(path,callback)
		{
			$http({
				method: "PUT",
				url: "/api/serial/path",
				data: {path: path}
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
		putSerialBaudrate : function(baud,callback)
		{
			$http({
				method: "PUT",
				url: "/api/serial/baudrate",
				data: {baudrate: baud}
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
		getSerialCommandList : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/commands/list",
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
    getSerialCommand : function(cmd,callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/command/"+cmd,
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
		configSave : function(callback)
		{
			$http({
				method: "PUT",
				url: "/api/config/save",
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
		serialRestart : function(callback) {
			$http({
				method: "PUT",
				url: "/api/serial/restart",
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},
		getGpioPinHistory : function(pin, callback) {
			$http({
				method:"GET",
				url: "/api/gpio/pins/"+pin.id+"/history"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},
			function errorCallback(resp)
			{
				callback(null);
			});
		},
		putGpioScript : function(script,callback)
		{
			$http({
				method: "PUT",
				url: "/api/gpio/script/"+script.id,
			  data: {
					script: script
				}
			}).then(function successCalback(resp) {
				callback(true);
			}, function errorCallback(resp) {
				callback(false);
			});
		},
		deleteGpioScript : function(script,callback) {
			$http({
				method: "DELETE",
				url:"/api/gpio/script/"+script.id
			}).then(function successCalback(res) {
        callback(true);
			},function errorCallback(res) {
				callback(false);
			});
		},
		getGpioScript : function(script, callback) {
			$http({
				method: "GET",
				url: "/api/gpio/script/"+script.id,
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data));
			}, function errorCallback(resp) {
				callback(null);
			});
		},
		executeGpioScript : function(script, callback) {
			$http({
				method: "GET",
				url: "/api/gpio/script/"+script.id+"/execute",
			}).then(function successCallback(resp) {
				callback(true);
			}, function errorCallback(resp) {
				callback(false);
			});
		},
		executeSerialCommand : function(cmd, callback) {
			$http({
				method:"GET",
				url:"/api/serial/command/"+cmd.id+"execute",
			}).then(function successCallback(res) {
				callback(true);
			},function errorCallback(res) {
				callback(false);
			});
		},
		getSerialEnabled : function(callback) {
			$http({
				method: "GET",
				url: "/api/serial/enabled",
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data).enabled);
			}, function errorCallback(resp) {
				callback(false);
			});
		},
		putSerialEnabled : function(enabled,callback) {
			$http({
				method: "PUT",
				url: "/api/serial/enabled/"+enabled,
			}).then(function successCallback(resp) {
				callback(resp);
			},function errorCallback(resp) {
				callback(false);
			});
		},
		getGpioScriptList : function(callback) {
			$http({
				method: "GET",
				url: "/api/gpio/scripts/list",
			}).then(function successCallback(resp) {
				callback(JSON.parse(resp.data));
			},function errorCallback(resp) {
				callback(null);
			});
  	}
  };
}]);
