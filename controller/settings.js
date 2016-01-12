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
			$scope.serialCommandList.push({name: name, cmd: cmd});
			$scope.addAlert({ type: 'success', msg: 'Added command \"' + name + '\"' });
		}, function errorCallback(resp)
		{
			console.log("Error adding serial command",name,cmd);
			$scope.addAlert({ type: 'danger', msg: 'Error adding command \"' + name + '\"' });
		});
	}

	$scope.removeSerialCommand = function()
	{
		var name = $scope.serialCommandRemove;

		$http({
			method: "DELETE",
			url: "/api/device/serial/command",
			data: {
				name: name
			}
		}).then(function successCalback(resp)
		{
			var index = getSerialCommandIndexByName(name);
			$scope.serialCommandList.splice(index,1);
			$scope.addAlert({ type: 'success', msg: 'Removed command \"' + name + '\"' });
		}, function errorCallback(resp)
		{
			console.log("Error removing serial command",name);
			$scope.addAlert({ type: 'danger', msg: 'Error removing command \"' + name + '\"' });
		});
	}

	$scope.getSerialCommandIndexByName = function(name)
	{
	  return $scope.serialCommandList.indexOf($scope.getSerialCommandByName(name));
	}

	// Get a serial command by name
	$scope.getSerialCommandByName = function(name)
	{
		var nCommands = $scope.serialCommandList.length;
	  for (var i = 0; i < nCommands; i++)
	  {
	    var next = $scope.serialCommandList[i];

	    if (next.name == name)
	    {
	      return next;
	    }
	  }
	}
}
]);
