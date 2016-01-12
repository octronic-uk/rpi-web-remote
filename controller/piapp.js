var PiApp = angular.module('PiApp',
[
	'ui.bootstrap',
	'ngCookies',
	'ui.router',
]);

PiApp.controller('PiApp',
	['$state','$stateParams','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $cookies, $http, $scope, $rootScope)
	{

		// API function calls ------------------------------------------------------

		$scope.addSerialCommandApi = function()
		{
			var name = $scope.serialCommandNameAdd;
			var cmd = $scope.serialCommandAdd;

			$http({
				method: "PUT",
				url: "/api/device/serial/command/add",
				data: {
					name: name,
					cmd: cmd
				}
			}).then(function successCalback(resp)
			{
				$scope.serialCommandList.push({name: name, cmd: cmd});
				$scope.addAlert({ type: 'success', msg: 'Added command \"' + name + '\"' });
			}, function errorCallback(resp)
			{
				console.log("Error adding serial command",name,cmd);
				$scope.addAlert({ type: 'danger', msg: 'Error adding command \"' + name + '\"' });
			});
		}

		$scope.removeSerialCommandApi = function()
		{
			var name = $scope.serialCommandRemove;
			console.log("Removing command",name);
			$http({
				method: "PUT",
				url: "/api/device/serial/command/remove",
				data: {
					cmdName: name
				}
			}).then(function successCalback(resp)
			{
				$scope.getSerialCommandIndexByName(name, function (index)
				{
					if (index > -1)
					{
						$scope.serialCommandList.splice(index,1);
					}
					else
				  {
						console.log("Cannot remove, index of ",name," command not found");
					}
				});
				$scope.addAlert({ type: 'success', msg: 'Removed command \"' + name + '\"' });
			}, function errorCallback(resp)
			{
				console.log("Error removing serial command",name);
				$scope.addAlert({ type: 'danger', msg: 'Error removing command \"' + name + '\"' });
			});
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

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
		}

		// Client function definitions ---------------------------------------------

		$scope.getPin = function(pins,i,callback)
		{
			for (j = 0; j < pins.length; j++)
			{
				if (pins[j].num == i)
				{
					callback(pins[j]);
					break;
				}
			}
		}

		$scope.addAlert = function(alert)
		{
			$scope.alerts.push(alert);
		}

		$scope.closeAlert = function(index)
		{
			$scope.alerts.splice(index, 1);
		}

		// Function calls ----------------------------------------------------------

		$scope.getDeviceNameApi(function(name)
		{
			$scope.deviceName = name;
		});
  }
]);
