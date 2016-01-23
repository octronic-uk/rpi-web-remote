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
PiApp.controller('Settings', ['appApi','util','$scope','$state',
  function(appApi,util, $scope, $state) {
		$scope.REMOVE_GPIO_DEFAULT = "Select Pin";
		$scope.alerts = [];
		$scope.serialEnabled = false;

    $scope.closeAlert = function(index)
    {
      util.closeAlert($scope.alerts,index);
    };

		$scope.goToGpioPinEditor = function(name) {
			util.convertSpacesToUnderscores(name,function(converted) {
				 $state.go("GpioPinEditor", {name:converted});
			});
		};

		$scope.getGpioScriptEditorUrl = function(name) {
      util.convertSpacesToUnderscores(name,function(converted) {
				 return "#settings/gpio_script_editor/"+converted;
			});
		};

		$scope.getSerialCommandEditorUrl = function(name) {
      util.convertSpacesToUnderscores(name,function(converted) {
			  return "#settings/serial_command_editor/"+converted;
		  });
		};

		$scope.addSerialCommand = function() {
			var name = $scope.serialCommandNameAdd;
			var cmd = $scope.serialCommandAdd;

			appApi.addSerialCommand(name,cmd,function(res)
			{
				if (res)
				{
					$scope.serialCommandList.push({name: name, cmd: cmd});
					util.addAlert($scope.alerts, { type: 'success', msg: 'Added command \"' + name + '\"' });
				}
				else
				{
					console.log("Error adding serial command",name,cmd);
				  util.addAlert($scope.alerts, { type: 'danger', msg: 'Error adding command \"' + name + '\"' });
				}
			});
		};

		$scope.removeSerialCommand = function()
		{
			var name = $scope.seriaData.serialCommandRemove;

			appApi.removeSerialCommand(name,function(resp)
			{
					if (resp)
					{
						util.getSerialCommandIndexByName($scope.serialCommandList, name, function (index)
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
						util.addAlert($scope.alerts,{ type: 'success', msg: 'Removed command \"' + name + '\"' });
						$scope.serialCommandRemove = $scope.REMOVE_CMD_DEFAULT;
					}
					else
					{
						console.log("Error removing serial command",name);
					  util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error removing command \"' + name + '\"' });
					}
			});
		};

		$scope.saveSettings = function()
		{
			appApi.setSerialPath($scope.selectedSerialPort,function(result)
			{
				if (result)
				{
					appApi.setSerialBaudrate($scope.selectedBaudrate,function(result)
					{
						if (result)
						{
							appApi.setDeviceName(function(result)
							{
								if (result)
								{
									appApi.configSave(function(result)
									{
											if (result)
											{
												appApi.serialRestart(function(result)
												{
													if (result)
													{
														console.log("Settings saved successfuly");
														util.addAlert($scope.alerts,{ type: 'success', msg: 'Settings have been saved!' });
													}
													else
												  {
													 console.log("Error restarting serial");
													 util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error restarting Serial. Please try again!' });
													}
												});
											}
											else
											{
												console.log("Error saving settings");
												util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving Settings. Please try again!' });
											}
									});
								}
								else
								{
									console.log("Error setting device name");
									util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error setting device name. Please try again!' });
								}
							});
						}
						else
						{
							console.log("Error setting serial device baudrate");
							util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving baudrate. Please try again!' });
						}
					});
				}
				else
				{
					console.log("Error setting serial device path");
					util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving device path. Please try again!' });
				}
			});
		};

		$scope.serialEnabledCheckboxChanged = function() {
			appApi.setSerialEnabled($scope.serialEnabled,function(resp) {
				if ($scope.serialEnabled) {
					util.addAlert($scope.alerts,{ type: 'success', msg: 'Serial has been enabled.' });
				} else {
					util.addAlert($scope.alerts,{ type: 'warning', msg: 'Serial has been disabled.' });
				}
			});
		};

		// API Calls ---------------------------------------------------------------
    appApi.getSerialPathList(function(serialList) {
			$scope.serialPathList = serialList;
    });

    appApi.getSerialBaudrateList(function(baudList) {
			$scope.serialBaudrateList = baudList;
    });

    appApi.getSerialCommandList(function(commandList) {
		 $scope.serialCommandList = commandList;
    });

    appApi.getSerialPath(function(path) {
			$scope.serialPath = path;
    });

    appApi.getSerialBaudrate(function(baudrate) {
		  $scope.selectedBaudrate = baudrate;
		});

		appApi.getSerialEnabled(function(en) {
			$scope.serialEnabled = en;
		});

		appApi.getGpioPinList(function(list) {
			$scope.gpioPinList = list;
		});

		appApi.getGpioScriptList(function(list) {
			$scope.gpioScriptList = list;
		});
	}
]);
