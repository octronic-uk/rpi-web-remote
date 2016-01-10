PiApp.controller('Landing',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});

		console.log("Getting GPIO list from API");

		$scope.getGpioList(function(list)
		{
			$scope.pinList = list;
		});

		$scope.gpioPinSet = function(pinNum, state)
		{
			$scope.setGpioPinApi(pinNum,state,function(success)
			{
				$scope.getPin(pinNum,function(pin)
				{
						pin.state = success ? 1 : 0;
				});
			});
		}
	}
]);
