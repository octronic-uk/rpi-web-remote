var PiApp = angular.module('PiApp',
[
	'ui.bootstrap',
	'ui.router',
]);

PiApp.controller('PiApp', [
	'$state','$stateParams','$cookies','$http','$scope','$rootScope' ,
   function($state, $stateParams, $cookies, $http, $scope, $rootScope)
	{
		$scope.alerts = [];
		$scope.ui = {};

		// API function calls ------------------------------------------------------

		$scope.addSerialCommandApi = function(name,cmd,callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/serial/command/add",
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
				url: "/api/device/serial/command/remove",
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

		$scope.getDeviceSerialListApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		};

		$scope.getDeviceSerialBaudrateListApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/baudrate/list"
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data));
			},function errorCallback(resp)
			{
				callback(null);
			});
		};

		$scope.getDeviceSerialPathApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/path",
			}).then(function successCallback(res)
			{
				callback(JSON.parse(res.data).path);
			},function errorCallback(res)
			{
				callback(null);
			});
		};

		$scope.getDeviceSerialBaudrateApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/baudrate",
			}).then(function successCallback(res)
			{
				callback(JSON.parse(res.data).baudrate);
			},function errorCallback(res)
			{
				callback(null);
			});
		};

		$scope.setDeviceSerialPathApi = function(path,callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/serial/path",
				data: {path: path}
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.setDeviceSerialBaudrateApi = function(baud,callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/serial/baudrate",
				data: {baudrate: baud}
			}).then(function successCallback(resp)
			{
				callback(true);
			}, function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.getDeviceSerialCommandListApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/command/list",
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

		$scope.deviceSerialRestartApi = function(callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/serial/restart",
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

		$scope.executeSerialCommandApi = function(cmd, callback)
		{
			$http({
				method:"PUT",
				url:"/api/device/serial/command/execute",
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

		$scope.getDeviceSerialEnabledApi = function(callback)
		{
			$http({
				method: "GET",
				url: "/api/device/serial/enabled",
			}).then(function successCallback(resp)
			{
				callback(JSON.parse(resp.data).enabled);
			},function errorCallback(resp)
			{
				callback(false);
			});
		};

		$scope.setDeviceSerialEnabledApi = function(enabled,callback)
		{
			$http({
				method: "PUT",
				url: "/api/device/serial/enabled/"+enabled,
			}).then(function successCallback(resp)
			{
				callback(resp);
			},function errorCallback(resp)
			{
				callback(false);
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

		$scope.getDeviceSerialData = function()
		{
			$scope.getDeviceSerialListApi(function(serialList)
			{
				$scope.serialPortList = serialList;
			});

			$scope.getDeviceSerialBaudrateListApi(function(baudList)
			{
				$scope.baudRateList = baudList;
			});

			$scope.getDeviceSerialCommandListApi(function(commandList)
			{
				$scope.serialCommandList = commandList;
			});

			$scope.getDeviceSerialBaudrateApi(function(baudrate)
			{
				$scope.selectedBaudrate = baudrate;
			});

			$scope.getDeviceSerialPathApi(function(path)
			{
				$scope.selectedSerialPort = path;
			});
		};

		$scope.getDeviceSerialEnabledApi(function(en)
		{
			$scope.ui.serialEnabled = en;

			if ($scope.ui.serialEnabled)
			{
				$scope.getDeviceSerialData();
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
	}
]);
