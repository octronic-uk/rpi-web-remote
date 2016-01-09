PiApp.controller('Landing',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});
		$scope.gpioVals = {};

		$scope.$on('$stateChangeSuccess', function()
		{
				$state.getGpioList(function(list)
				{
					$scope.pinList = list;
				});
		}

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
