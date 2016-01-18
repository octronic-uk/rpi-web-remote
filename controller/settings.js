/*
  Ash's RaspberryPI IO Remote.
  email: ashthompson06@gmail.command
  repo: https://github.com/BashEdThomps/IoT-RaspberryPI.git

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
PiApp.controller('Settings',
['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
function($state, $stateParams, $controller, $http, $scope, $rootScope)
{
	$controller('PiApp', {$scope: $scope});
	$scope.REMOVE_GPIO_DEFAULT = "Select Pin";
	$scope.REMOVE_CMD_DEFAULT = "Select Command";

  // Client function definitions -----------------------------------------------

	$scope.getSafeScriptName = function(name)
	{
		return "#settings/gpio_script/"+name;
	};

	$scope.addSerialCommand = function()
	{
		var name = $scope.serialCommandNameAdd;
		var cmd = $scope.serialCommandAdd;

		$scope.addSerialCommandApi(name,cmd,function(res)
		{
			if (res)
			{
				$scope.serialCommandList.push({name: name, cmd: cmd});
				$scope.addAlert({ type: 'success', msg: 'Added command \"' + name + '\"' });
			}
			else
			{
				console.log("Error adding serial command",name,cmd);
				$scope.addAlert({ type: 'danger', msg: 'Error adding command \"' + name + '\"' });
			}
		});
	};

	$scope.removeSerialCommand = function()
	{
		var name = $scope.serialCommandRemove;

		$scope.removeSerialCommandApi(name,function(resp)
		{
				if (resp)
				{
					$scope.getSerialCommandIndexByName(name, function (index)
					{
						if (index > -1)
						{
							$scope.serialCommandList.splice(index,1);
						}
						else
					  {
							console.log("Cannot remove, index of ",name," command not found");
						}
					});
					$scope.addAlert({ type: 'success', msg: 'Removed command \"' + name + '\"' });
					$scope.serialCommandRemove = $scope.REMOVE_CMD_DEFAULT;
				}
				else
				{
					console.log("Error removing serial command",name);
					$scope.addAlert({ type: 'danger', msg: 'Error removing command \"' + name + '\"' });
				}
		});
	};

	$scope.saveSettings = function()
	{
		$scope.setSerialPathApi($scope.selectedSerialPort,function(result)
		{
			if (result)
			{
				$scope.setSerialBaudrateApi($scope.selectedBaudrate,function(result)
				{
					if (result)
					{
						$scope.setDeviceNameApi(function(result)
						{
							if (result)
							{
								$scope.configSaveApi(function(result)
								{
										if (result)
										{
											$scope.serialRestartApi(function(result)
											{
												if (result)
												{
													console.log("Settings saved successfuly");
													$scope.addAlert({ type: 'success', msg: 'Settings have been saved!' });
												}
												else
											  {
												 console.log("Error restarting serial");
												 $scope.addAlert({ type: 'danger', msg: 'Error restarting Serial. Please try again!' });
												}
											});
										}
										else
										{
											console.log("Error saving settings");
											$scope.addAlert({ type: 'danger', msg: 'Error saving Settings. Please try again!' });
										}
								});
							}
							else
							{
								console.log("Error setting device name");
								$scope.addAlert({ type: 'danger', msg: 'Error setting device name. Please try again!' });
							}
						});
					}
					else
					{
						console.log("Error setting serial device baudrate");
						$scope.addAlert({ type: 'danger', msg: 'Error saving baudrate. Please try again!' });
					}
				});
			}
			else
			{
				console.log("Error setting serial device path");
				$scope.addAlert({ type: 'danger', msg: 'Error saving device path. Please try again!' });
			}
		});
	};

  // Get the index of a command by name
	$scope.getSerialCommandIndexByName = function(name,callback)
	{
		$scope.getSerialCommandByName(name, function(cmd)
	  {
			callback($scope.serialCommandList.indexOf(cmd));
		});
	};

	// Get a serial command by name
	$scope.getSerialCommandByName = function(name,callback)
	{
		var nCommands = $scope.serialCommandList.length;
		var target = null;

	  for (var i = 0; i < nCommands; i++)
	  {
	    var next = $scope.serialCommandList[i];

	    if (next.name == name)
	    {
	      target = next;
				break;
	    }
	  }

		callback(target);
	};

	$scope.addGpioPin = function()
	{
		var name = $scope.gpioPinAddName;
		var num = $scope.gpioPinAddNum;
		var io = $scope.gpioPinAddIo;
		var state = $scope.gpioPinAddState;
		var hidden = $scope.gpioPinAddHidden;

		$scope.addGpioPinApi(name,num,io,state,function(res)
		{
			if (res)
			{
				$scope.addAlert({ type: 'success', msg: 'Pin '+name+' added successfuly.' });
				$scope.pinList.push({
					name:name,
					num:num,
					io:io,
					state:state,
					hidden:hidden
				});
			}
			else
			{
				$scope.addAlert({ type: 'danger', msg: 'Error adding pin '+name+'. Please try again!.' });
			}
		});
	};

	// Remove GPIO pin
	$scope.removeGpioPin = function()
	{
		var pin = $scope.gpioPinRemove;
		console.log("Removing gpio pin",pin);
		$scope.removeGpioPinApi(pin,function(res)
		{
			if (res)
			{
				$scope.addAlert({ type: 'success', msg: 'Pin '+pin+' removed successfuly.' });
				$scope.getPinByName($scope.pinList,pin,function(pinObj)
				{
					var index = $scope.pinList.indexOf(pinObj);
					$scope.pinList.splice(index,1);
				});
			}
			else
			{
				$scope.addAlert({ type: 'danger', msg: 'Error removing pin '+pin+'. Please try again!.' });
			}
		});
	};

	$scope.serialEnabledCheckboxChanged = function()
	{
		$scope.setSerialEnabledApi($scope.ui.serialEnabled,function(resp)
		{
			if ($scope.ui.serialEnabled)
			{
				$scope.getDeviceSeriaData();
				$scope.addAlert({ type: 'success', msg: 'Serial has been enabled.' });
			}
			else
			{
				$scope.getDeviceSeriaData();
				$scope.addAlert({ type: 'warning', msg: 'Serial has been disabled.' });
			}
		});
	};

	// API Calls -----------------------------------------------------------------


	$scope.getSerialEnabledApi(function(en)
	{
		$scope.ui.serialEnabled = en;

		if ($scope.ui.serialEnabled)
		{
			$scope.getSerialData();
		}
	});

	$scope.getGpioListApi(function(list)
	{
		$scope.pinList = list;
	});

	$scope.getGpioScriptsListApi(function(scriptList)
	{
		$scope.gpioScriptList = scriptList;
	});
}
]);
