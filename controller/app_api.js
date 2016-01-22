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

PiApp.factory('appApi',['util','$http',function(util, $http)
{
  return {
    getSerialData : function() {
			this.getSerialList(function(serialList) {
				$rootScope.serialPortList = serialList;
			});

			this.getSerialBaudrateList(function(baudList) {
				$rootScope.baudRateList = baudList;
			});

			this.getSerialCommandList(function(commandList) {
				$rootScope.serialCommandList = commandList;
			});

			this.getSerialBaudrate(function(baudrate) {
				$rootScope.selectedBaudrate = baudrate;
			});

			this.getSerialPath(function(path) {
				$rootScope.selectedSerialPort = path;
			});
		},

    addSerialCommand : function(name,cmd,callback)
		{
			$http({
				method: "PUT",
				url: "/api/serial/command/add",
				data: {
					name: name,
					cmd: cmd
				}
			}).then(function successCalback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},

		removeSerialCommand : function(name,callback)
		{
			console.log("Removing command",name);
			$http({
				method: "PUT",
				url: "/api/serial/command/remove",
				data: {
					cmdName: name
				}
			}).then(function successCalback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},

		setGpioPinValue : function(pin, value, callback)
		{
			$http({
				method: "PUT",
				url: "/api/gpio/pins/"+pin+"/"+value
			}).then(function successCallback(resp)
			{
				callback(true);
			},function errorCallback(resp)
			{
				callback(false);
			});
		},

		getGpioPinByName : function(pin, callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/pins/name/"+pin
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

    getGpioPinByNumber : function(pin, callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/pins/number/"+pin
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getGpioPinList : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/pins/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		deleteGpioPin : function(pinNum,callback)
		{
			$http({
				method: "DELETE",
				url: "/api/gpio/pins/:pinNum",
			}).then(function successCallback(res)
			{
				callback(true);
			},function errorCallback(res)
			{
				callback(false);
			});
		},

		addGpioPin : function(pin,callback)
		{
			$http({
				method: "put",
				url: "/api/gpio/pins/add",
				data: {
					name: pin.name,
					num: pin.num,
					io: pin.io,
					state: pin.state,
					hidden: pin.hidden
				}
			}).then(function successCallback(res)
			{
				callback(true);
			},function errorCallback(res)
			{
				callback(false);
			});
		},

		getApplicationRestart : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/application/restart"
			}).then(function successCallback(resp)
			{
				callback();
			},function errorCallback(resp)
			{
				callback();
			});
		},

		getApplicationUpdate : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/application/update"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).result);
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getDeviceName : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/name"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).name);
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		setDeviceName : function(callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/name",
				data: {
					devName: deviceName
				}
			}).then(function successCallback(resp)
			{
				callback(true);
			},function errorCallback(resp)
			{
				callback(false);
			});
		},

		getDeviceUptime : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/uptime"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).uptime);
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getDeviceHostname : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/hostname"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).hostname.replace(" ","\n"));
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getDeviceAddress : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/address"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).address);
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getDeviceReboot : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/reboot"
			}).then(function successCallback(resp)
			{
				callback(null);
			},function errorCallback(resp)
			{
				callback(null);
			});
		},

		getSerialList : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
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

		setSerialPath : function(path,callback)
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

		setSerialBaudrate : function(baud,callback)
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

		serialRestart : function(callback)
		{
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

		getGpioPinHistory : function(pin, callback)
		{
			$http({
				method:"GET",
				url: "/api/gpio/pins/"+pin+"/history"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},
			function errorCallback(resp)
			{
				callback(null);
			});
		},

		setGpioScript : function(script,callback)
		{
			util.convertSpacesToUnderscores(script.name,function(name)
			{
				$http({
					method: "PUT",
					url: "/api/gpio/script/"+name,
				  data: {
						script: script
					}
				}).then(function successCalback(resp)
				{
					callback(true);
				},function errorCallback(resp)
				{
					callback(false);
				});
			});
		},

		deleteGpioScript : function(scriptName,callback)
		{
			util.convertSpacesToUnderscores(scriptName, function(name)
			{
				$http({
					method: "PUT",
					url:"/api/gpio/script/"+name+"/delete"
				}).then(function successCalback(res)
				{
						callback(true);
				},function errorCallback(res)
				{
					callback(false);
				});
			});
		},

		getGpioScript : function(name, callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/script/"+name,
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			}, function errorCallback(resp)
			{
				callback(null);
			});
		},

		executeGpioScript : function(name, callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/script/"+name+"/execute",
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		},

		executeSerialCommand : function(cmd, callback)
		{
			$http({
				method:"PUT",
				url:"/api/serial/command/execute",
				data: {
					cmd: cmd
				}
			}).then(function successCallback(res)
			{
				callback(true);
			},function errorCallback(res)
			{
				callback(false);
			});
		},

		getSerialEnabled : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/enabled",
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).enabled);
			},function errorCallback(resp)
			{
				callback(false);
			});
		},

		setSerialEnabled : function(enabled,callback)
		{
			$http({
				method: "PUT",
				url: "/api/serial/enabled/"+enabled,
			}).then(function successCallback(resp)
			{
				callback(resp);
			},function errorCallback(resp)
			{
				callback(false);
			});
		},

		getGpioScriptList : function(callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/scripts/list",
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
  	}
  };
}]);
