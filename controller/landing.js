PiApp.controller('Landing',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});

		console.log("Getting GPIO list from API");

		$scope.getGpioListApi(function(list)
		{
			$scope.pinList = list;
		});

		$scope.gpioSet = function(pinNum, state)
		{
			$scope.setGpioPinValueApi(pinNum,state,function(success)
			{
				if (success)
				{
					$scope.getPin($scope.pinList,pinNum,function(pin)
				  {
						pin.state = state;
					});
				}
			});
	  }
	}
]);
