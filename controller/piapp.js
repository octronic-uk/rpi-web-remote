var PiApp = angular.module('PiApp',
[
	'ui.bootstrap',
	'ui.router',
]);

PiApp.controller('PiApp', [
	'$state','$stateParams','$http','$scope','$rootScope' ,
   function($state, $stateParams, $http, $scope, $rootScope)
	{
		$scope.alerts = [];
		$scope.ui = {};

		// API function calls ------------------------------------------------------

		$scope.addSerialCommandApi = function(name,cmd,callback)
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
		};

		$scope.removeSerialCommandApi = function(name,callback)
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
		};

		$scope.setGpioPinValueApi = function(pin, value, callback)
		{
			$http({
				method: "PUT",
				url: "/api/gpio/"+pin+"/"+value
			}).then(function successCallback(resp)
			{
				callback(true);
			},function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.getGpioPinApi = function(pin, callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/"+pin
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		};

		$scope.gpioRestartApi = function(callback)
		{
			$http({
				method: "PUT",
				url: "/api/gpio/restart"
			}).then(function successCallback(resp)
			{
				callback(true);
			},function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.getGpioListApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/gpio/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		};

		$scope.removeGpioPinApi = function(pinNum,callback)
		{
			$http({
				method: "put",
				url: "/api/gpio/remove",
				data: {
					pin: pinNum
				}
			}).then(function successCallback(res)
			{
				callback(true);
			},function errorCallback(res)
			{
				callback(false);
			});
		};

		$scope.addGpioPinApi = function(name,num,io,state,callback)
		{
			$http({
				method: "put",
				url: "/api/gpio/add",
				data: {
					name:name,
					num:num,
					io:io,
					state:state
				}
			}).then(function successCallback(res)
			{
				callback(true);
			},function errorCallback(res)
			{
				callback(false);
			});
		};

		$scope.getApplicationRestartApi = function(callback)
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
		};

		$scope.getApplicationUpdateApi = function(callback)
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
		};

		$scope.getDeviceNameApi = function(callback)
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
		};

		$scope.setDeviceNameApi = function(callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/name",
				data: {
					devName: $scope.deviceName
				}
			}).then(function successCallback(resp)
			{
				callback(true);
			},function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.getDeviceUptimeApi = function(callback)
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
		};

		$scope.getDeviceHostnameApi = function(callback)
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
		};

		$scope.getDeviceAddressApi = function(callback)
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
		};

		$scope.getDeviceRebootApi = function(callback)
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
		};

		$scope.getSerialListApi = function(callback)
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
		};

		$scope.getSerialBaudrateListApi = function(callback)
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
		};

		$scope.getSerialPathApi = function(callback)
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
		};

		$scope.getSerialBaudrateApi = function(callback)
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
		};

		$scope.setSerialPathApi = function(path,callback)
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
		};

		$scope.setSerialBaudrateApi = function(baud,callback)
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
		};

		$scope.getSerialCommandListApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/serial/command/list",
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			}, function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.configSaveApi = function(callback)
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
		};

		$scope.serialRestartApi = function(callback)
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
		};

		$scope.getGpioPinHistoryApi = function(pin, callback)
		{
			$http({
				method:"GET",
				url: "/api/gpio/"+pin+"/history"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},
			function errorCallback(resp)
			{
				callback(null);
			});
		};

		$scope.getGpioScriptApi = function(name, callback)
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
		};

		$scope.executeGpioScriptApi = function(name, callback)
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
		};

		$scope.executeSerialCommandApi = function(cmd, callback)
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
		};

		$scope.getSerialEnabledApi = function(callback)
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
		};

		$scope.setSerialEnabledApi = function(enabled,callback)
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
		};

		$scope.getGpioScriptsListApi = function(callback)
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
		};

		// Client function definitions ---------------------------------------------

		$scope.getPinByNumber = function(pins,i,callback)
		{
			for (var j = 0; j < pins.length; j++)
			{
				if (pins[j].num == i)
				{
					callback(pins[j]);
					break;
				}
			}
		};

		$scope.getPinByName = function(pins,name,callback)
		{
			for (var j = 0; j < pins.length; j++)
			{
				if (pins[j].name == name)
				{
					callback(pins[j]);
					break;
				}
			}
		};

		$scope.addAlert = function(alert)
		{
			$scope.alerts.push(alert);
		};

		$scope.closeAlert = function(index)
		{
			$scope.alerts.splice(index, 1);
		};

		// API Calls -----------------------------------------------------------------

		$scope.getSerialData = function()
		{
			$scope.getSerialListApi(function(serialList)
			{
				$scope.serialPortList = serialList;
			});

			$scope.getSerialBaudrateListApi(function(baudList)
			{
				$scope.baudRateList = baudList;
			});

			$scope.getSerialCommandListApi(function(commandList)
			{
				$scope.serialCommandList = commandList;
			});

			$scope.getSerialBaudrateApi(function(baudrate)
			{
				$scope.selectedBaudrate = baudrate;
			});

			$scope.getSerialPathApi(function(path)
			{
				$scope.selectedSerialPort = path;
			});
		};

		$scope.getSerialEnabledApi(function(en)
		{
			$scope.ui.serialEnabled = en;

			if ($scope.ui.serialEnabled)
			{
				$scope.getSerialData();
			}
		});

		$scope.getGpioListApi(function(list)
		{
			$scope.pinList = list;
		});

		$scope.getDeviceNameApi(function(name)
		{
			$scope.deviceName = name;
		});

		$scope.getGpioScriptsListApi(function(scriptList)
		{
			$scope.gpioScriptList = scriptList;
		});
	}
]);
