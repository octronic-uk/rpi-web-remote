PiApp.controller('Settings',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});
		$scope.serialPortList = [];

		$scope.getDeviceSerialListApi(function(serialList)
		{
			$scope.serialPortList = serialList;
		});

		$scope.getDeviceSerialBaudrateList(function(baudList)
		{
			$scope.baudRateList = baudList;
		});

		$scope.saveSerialSettingsButton = function()
		{
			$scope.setDeviceSerialPathApi($scope.selectedSerialPort,function(result)
			{
				if (result)
				{
						$scope.setDeviceSerialBaudrateApi($scope.selectedBaudrate,function(result)
						{
							if (result)
							{
								console.log("Settings saved successfuly");
							}
							else
							{
								console.log("Error setting serial device baudrate");
							}
						});
				}
				else
				{
					consoe.log("Error setting serial device path");
				}
			});
		}
  }
]);
