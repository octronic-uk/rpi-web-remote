PiApp.controller('Landing',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});

		// Client Function Definitions ---------------------------------------------

		$scope.gpioSet = function(pinNum, state)
		{
			$scope.setGpioPinValueApi(pinNum,state,function(success)
			{
				if (success)
				{
					$scope.getPinByNumber($scope.pinList,pinNum,function(pin)
					{
						pin.state = state;
					});
				}
			});
		};

		$scope.executeSerialCommand = function(command)
		{
			$scope.executeSerialCommandApi(command,function(res)
			{
				if (res)
				{
					$scope.addAlert({ type: 'success', msg: 'Successuly executed '+command+'!.' });
				}
				else
				{
					$scope.addAlert({ type: 'danger', msg: 'Error executing'+command+'. Please try again!.' });
				}
			});
		};
	}
]);
