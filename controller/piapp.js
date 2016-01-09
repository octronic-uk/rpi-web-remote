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
		$scope.setGpioPin = function(pin, value, callback)
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

		$scope.getGpioPin = function(pin, callback)
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
  }
]);
