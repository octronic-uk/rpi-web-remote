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

	$scope.getDeviceSerialCommandList(function(commandList)
	{
		$scope.serialCommandList = commandList;
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
						$scope.configSaveApi(function(result)
						{
								if (result)
								{
									$scope.deviceSerialRestartApi(function(result)
									{
										if (result)
										{
											console.log("Serial settings saved successfuly");
											$scope.addAlert({ type: 'success', msg: 'Serial settings have been saved!.' });
										}
										else
										{
											console.log("Error saving settings");
											$scope.addAlert({ type: 'danger', msg: 'Error saving Settings. Please try again!.' });
										}
									});
								}
								else
								{
									console.log("Error saving settings");
									$scope.addAlert({ type: 'danger', msg: 'Error saving Settings. Please try again!.' });
								}
						});
					}
					else
					{
						console.log("Error setting serial device baudrate");
						$scope.addAlert({ type: 'danger', msg: 'Error saving baudrate. Please try again!.' });
					}
				});
			}
			else
			{
				consloe.log("Error setting serial device path");
				$scope.addAlert({ type: 'danger', msg: 'Error saving device path. Please try again!.' });
			}
		});
	}

	$scope.addSerialCommand = function()
	{
		var name = $scope.serialCommandNameAdd;
		var cmd = $scope.serialCommandAdd;

		$http({
			method: "PUT",
			url: "/api/device/serial/command",
			data: {
				name: name,
				cmd: cmd
			}
		}).then(function successCalback(resp)
		{
			$scope.serialCommandList.put({name: name, cmd: cmd});
		}, function errorCallback(resp)
		{
			console.log("Error addingserial command",name,cmd);
		});
	}

	$scope.removeSerialCommand = function()
	{
		var commandName = $scope.serialCommandRemove;

		$http({
			method: "DELETE",
			url: "/api/device/serial/command",
			data: {
				name: commandName
			}
		}).then(function successCalback(resp)
		{
			var index = $scope.indexOf(commandName);
			$scope.serialCommandList.splice(index,1);
		}, function errorCallback(resp)
		{
			console.log("Error removing serial command",commandName);
		});
	}
}
]);
