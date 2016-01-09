PiApp.controller('Landing',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});
		$scope.gpioVals = {};

		console.log("Getting GPIO list from API");

		$scope.getGpioList(function(list)
		{
			$scope.pinList = list;
			list.forEach(function(pin)
			{
				$scope.gpioVals["pin"+pin.num] = pin.state;
			});
		});

		$scope.gpioToggled = function(pin)
		{
			var val = $scope.gpioVals["pin"+pin];
			$scope.setGpioPin(pin,val,function(resp)
			{
					if (resp)
					{
						console.log("Success setting pin",pin,"to",val);
					}
					else
					{
						console.log("Error setting pin",pin,"to",val);
					}
			});
		}
  }
]);
