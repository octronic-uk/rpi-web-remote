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
PiApp.controller('Landing',
	['socket','appApi','util','$scope',
	function(socket, appApi, util, $scope)
	{
		// Socket IO Listener ------------------------------------------------------
		console.log("Registering socket.io listener");
    $scope.alerts = {};

	  socket.on("StateChanged", function(args) {
			console.log("Got StateChanged from Socket.IO with args",args);
			util.getGpioPinByNumber($scope.gpioScriptList, args.pin,function(pin) {
				if(pin) pin.state = args.state;
			});
		});

    socket.on("ScriptFinished", function(args) {
			console.log("Got StateChanged from Socket.IO with args",args);
			util.getGpioScriptByName($scope.gpioScriptList, args.name,function(script) {
				if(script) {
					script.inProgress = false;
				  util.addAlert({ type: 'success', msg: "Script  '"+script.name+"'has finished!" });
				}
			});
		});

		// Client Function Definitions ---------------------------------------------

		$scope.gpioSet = function(pinNum, state) {
			appApi.setGpioPinValue(pinNum,state,function(success) {
				if (success) {
					util.getGpioPinByNumber($scope.gpioPinList,pinNum,function(pin) {
						pin.state = state;
					});
				}
			});
		};

		$scope.executeSerialCommand = function(command) {
			appApi.executeSerialCommand(command,function(res) {
				if (res) {
					util.addAlert({ type: 'success', msg: 'Started  '+command+'!' });
				} else {
					util.addAlert({ type: 'danger', msg: 'Error executing '+command+'. Please try again!' });
				}
			});
		};

		$scope.executeGpioScriptButton = function(scriptName) {
			console.log("Executing GPIO Script",scriptName);
			appApi.executeGpioScript(scriptName,function(resp) {
				if (resp) {
					util.addAlert({ type: 'success', msg: "Script '"+scriptName+"' has been started!" });
					util.getGpioScriptByName($scope.gpioScriptList, scriptName,function(script){
						script.inProgress = true;
					});
				} else {
					util.addAlert({ type: 'danger', msg: 'Error executing '+scriptName+'. Please try again!' });
				}
			});
		};

		// API Calls ---------------------------------------------------------------

		appApi.getSerialEnabled(function(en) {
			$scope.ui.serialEnabled = en;
			if ($scope.ui.serialEnabled){
				appApi.getSerialData();
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
