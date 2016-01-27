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
App.controller('Landing',
	['socket','appApi','util','$scope',
	function(socket, appApi, util, $scope)
	{
		// Socket IO Listener ------------------------------------------------------
		console.log("Registering socket.io listener");
    $scope.alerts = [];
		$scope.ui = {};
		$scope.serialEnabled = false;
		$scope.pageName = "Home";

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

    $scope.closeAlert = function(index) {
      util.closeAlert($scope.alerts,index);
    };

	  socket.on("StateChanged", function(args) {
			console.log("Got StateChanged from Socket.IO with args", args);
			util.getGpioPinById($scope.gpioPinList, args.id, function(pin) {
				if(pin) {
					pin.state = args.state;
				}
			});
		});

    socket.on("ScriptFinished", function(args) {
			console.log("Got StateChanged from Socket.IO with args", args);
			util.getGpioScriptById($scope.gpioScriptList, args.id, function(script) {
				if(script) {
					script.inProgress = false;
				  util.addAlert($scope.alerts,{
						type: 'success',
						msg: "Script  '"+script.name+"'has finished!"
					});
				}
			});
		});

		$scope.gpioStateButton = function(id, state) {
			util.getGpioPinById($scope.gpioPinList, id, function(pin) {
        appApi.putGpioPinState(pin, function(success) {
				  if (success) {
			      pin.state = state;
				  } else {
				  	util.addAlert($scope.alerts, {
				  		type: 'danger',
				  		msg: "Unable to change state of pin "+pin.name
					  });
				  }
			  });
			});
		};

		$scope.executeSerialCommandButton = function(command) {
			appApi.executeSerialCommand(command,function(res) {
				if (res) {
					util.addAlert($scope.alerts,{
						type: 'success',
						msg: 'Started  '+command.name+'!'
					});
				} else {
					util.addAlert($scope.alerts,{
						type: 'danger',
						msg: 'Error executing '+command.name+'. Please try again!'
					});
				}
			});
		};

		$scope.executeGpioScriptButton = function(script) {
			console.log("Executing GPIO Script",script.name);
			appApi.executeGpioScript(script,function(resp) {
				if (resp) {
					util.addAlert($scope.alerts,{
						type: 'success',
						msg: "Script '"+script.name+"' has been started!"
					});
					util.getGpioScriptById($scope.gpioScriptList, script.name,function(script){
						script.inProgress = true;
					});
				} else {
					util.addAlert($scope.alerts,{
						type: 'danger',
						msg: 'Error executing '+script.name+'. Please try again!'
					});
				}
			});
		};

		// API Calls ---------------------------------------------------------------

    appApi.getSerialEnabled(function(en) {
			$scope.serialEnabled = en;
			if ($scope.serialEnabled) {
		    appApi.getSerialCommandList(function(list) {
				  $scope.serialCommandList = list;
		    });
			}
		});

		appApi.getGpioPinList(function(list) {
			$scope.gpioPinList = list;
		});

		appApi.getGpioScriptList(function(list) {
			$scope.gpioScriptList = list;
		});
	}
]);
