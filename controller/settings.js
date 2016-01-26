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
App.controller('Settings', ['appApi','util','$scope','$state',
  function(appApi,util, $scope, $state) {
		$scope.REMOVE_GPIO_DEFAULT = "Select Pin";
		$scope.alerts = [];
		$scope.serialEnabled = false;
    $scope.pageName = "Settings";



    $scope.closeAlert = function(index)
    {
      util.closeAlert($scope.alerts,index);
    };

		$scope.goToGpioPinEditor = function(name) {
		  $state.go("GpioPinEditor", {name:name});
		};

		$scope.goToGpioScriptEditor = function(name) {
		  $state.go("GpioScriptEditor", {name:name});
		};

		$scope.goToSerialCommandEditor = function(name) {
		  $state.go("SerialCommandEditor", {name:name});
		};

		$scope.saveSettings = function() {
			appApi.putSerialPath($scope.serialPath,function(result) {
				if (result) {
					appApi.putSerialBaudrate($scope.serialBaudrate,function(result) {
						if (result) {
							appApi.setDeviceName($scope.deviceName, function(result) {
								if (result) {
                  appApi.putDevicePort($scope.devicePort, function(result) {
                    if (result) {
                      appApi.configSave(function(result) {
    											if (result) {
    												appApi.serialRestart(function(result) {
    													if (result) {
    														console.log("Settings saved successfuly");
    														util.addAlert($scope.alerts,{ type: 'success', msg: 'Settings have been saved!' });
                                setTimeout(function() {
                                  $state.go("Landing");
                                }, 1500);
    													} else {
    													 console.log("Error restarting serial");
    													 util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error restarting Serial. Please try again!' });
    													}
    												});
    											} else {
    												console.log("Error saving settings");
    												util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving Settings. Please try again!' });
    											}
    									});
                    } else {
                      console.log("Error setting device port");
									    util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error setting device name. Please try again!' });
                    }
                  });
								} else {
									console.log("Error setting device name");
									util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error setting device name. Please try again!' });
								}
							});
						} else {
							console.log("Error setting serial device baudrate");
							util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving baudrate. Please try again!' });
						}
					});
				} else {
					console.log("Error setting serial device path");
					util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving device path. Please try again!' });
				}
			});
		};

		$scope.serialEnabledCheckboxChanged = function() {
			appApi.putSerialEnabled($scope.serialEnabled,function(resp) {
				if ($scope.serialEnabled) {
					util.addAlert($scope.alerts,{ type: 'success', msg: 'Serial has been enabled.' });
				} else {
					util.addAlert($scope.alerts,{ type: 'warning', msg: 'Serial has been disabled.' });
				}
			});
		};

		// API Calls ---------------------------------------------------------------
    appApi.getDevicePort(function(port) {
		  $scope.devicePort = port;
	  });

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

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
		  $scope.serialBaudrate = baudrate;
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
