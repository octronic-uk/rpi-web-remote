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

		$scope.getDeviceSerialBaudrateList = function(callback)
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

		$scope.getDeviceSerialCommandList = function(callback)
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

		$scope.executeSerialCommand = function(cmd)
		{
		 $http({
			 method:"GET",
			 url:"/api/device/serial/command/execute",
			 data: {
				 cmd: cmd
			 }
		 }).then(function successCallback(res)
		 {
			 callback(true);
		 },function errorCallback(res)
		 {
			 callback(false;)
		 });
		}

		$scope.getDeviceNameApi(function(name)
		{
			$scope.deviceName = name;
		});
  }
]);
