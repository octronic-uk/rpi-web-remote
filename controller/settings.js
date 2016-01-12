PiApp.controller('Settings',
['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
{
	$controller('PiApp', {$scope: $scope});
	$scope.serialPortList = [];

  // Client function definitions -----------------------------------------------

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
											console.log("Error restarting serial device");
											$scope.addAlert({ type: 'danger', msg: 'Error restarting serial device. Please try again!.' });
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
				console.log("Error setting serial device path");
				$scope.addAlert({ type: 'danger', msg: 'Error saving device path. Please try again!.' });
			}
		});
	}

  // Get the index of a command by name
	$scope.getSerialCommandIndexByName = function(name,callback)
	{
		$scope.getSerialCommandByName(name, function(cmd)
	  {
			callback($scope.serialCommandList.indexOf(cmd));
		});
	}

	// Get a serial command by name
	$scope.getSerialCommandByName = function(name,callback)
	{
		var nCommands = $scope.serialCommandList.length;
	  for (var i = 0; i < nCommands; i++)
	  {
	    var next = $scope.serialCommandList[i];

	    if (next.name == name)
	    {
	      callback(next);
				break;
	    }
	  }
	}

	// Calls ---------------------------------------------------------------------

	$scope.getDeviceSerialListApi(function(serialList)
	{
		$scope.serialPortList = serialList;
	});

	$scope.getDeviceSerialBaudrateListApi(function(baudList)
	{
		$scope.baudRateList = baudList;
	});

	$scope.getDeviceSerialCommandListApi(function(commandList)
	{
		$scope.serialCommandList = commandList;
	});

	$scope.getDeviceSerialBaudrateApi(function(baudrate)
	{
		$scope.selectedBaudrate = baudrate;
	});

	$scope.getDeviceSerialPathApi(function(path)
	{
		$scope.selectedSerialPort = path;
	});
}
]);
