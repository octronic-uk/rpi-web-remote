PiApp.controller('Settings',
['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
{
	$controller('PiApp', {$scope: $scope});
	$scope.serialPortList = [];

	$scope.alerts = [];

	$scope.addAlert = function(alert)
	{
		$scope.alerts.push(alert);
	};

	$scope.closeAlert = function(index)
	{
		$scope.alerts.splice(index, 1);
	};

	$scope.getDeviceSerialListApi(function(serialList)
	{
		$scope.serialPortList = serialList;
	});

	$scope.getDeviceSerialBaudrateList(function(baudList)
	{
		$scope.baudRateList = baudList;
	});

	$scope.saveSerialSettings = function()
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
						$scope.addAlert({ type: 'success', msg: 'Serial settings have been saved!.' });
					}
					else
					{
						console.log("Error setting serial device baudrate");
					}
				});
			}
			else
			{
				consloe.log("Error setting serial device path");
			}
		});
	}
}
]);
