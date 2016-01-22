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
	['socket','AppApi','Util','$scope',
	function(socket, AppApi, Util, $scope)
	{
		// Socket IO Listener ------------------------------------------------------
		console.log("Registering socket.io listener");

	  socket.on("StateChanged", function(args) {
			console.log("Got StateChanged from Socket.IO with args",args);
			Util.getGpioPinByNumber($scope.gpioScriptList, args.pin,function(pin) {
				pin.state = args.state;
			});
		});

    socket.on("ScriptFinished", function(args) {
			console.log("Got StateChanged from Socket.IO with args",args);
			Util.getGpioScriptByName($scope.gpioScriptList, args.name,function(script) {
				script.inProgress = false;
				Util.addAlert({ type: 'success', msg: "Script  '"+script.name+"'has finished!" });
			});
		});

		// Client Function Definitions ---------------------------------------------

		$scope.gpioSet = function(pinNum, state) {
			AppApi.setGpioPinValue(pinNum,state,function(success) {
				if (success) {
					Util.getGpioPinByNumber($scope.gpioPinList,pinNum,function(pin) {
						pin.state = state;
					});
				}
			});
		};

		$scope.executeSerialCommand = function(command) {
			AppApi.executeSerialCommand(command,function(res) {
				if (res) {
					Util.addAlert({ type: 'success', msg: 'Started  '+command+'!' });
				} else {
					Util.addAlert({ type: 'danger', msg: 'Error executing '+command+'. Please try again!' });
				}
			});
		};

		$scope.executeGpioScriptButton = function(scriptName) {
			console.log("Executing GPIO Script",scriptName);
			AppApi.executeGpioScript(scriptName,function(resp) {
				if (resp) {
					Util.addAlert({ type: 'success', msg: "Script '"+scriptName+"' has been started!" });
					Util.getGpioScriptByName($scope.gpioScriptList, scriptName,function(script){
						script.inProgress = true;
					});
				} else {
					Util.addAlert({ type: 'danger', msg: 'Error executing '+scriptName+'. Please try again!' });
				}
			});
		};

		// API Calls ---------------------------------------------------------------

		AppApi.getSerialEnabled(function(en) {
			$scope.ui.serialEnabled = en;
			if ($scope.ui.serialEnabled){
				$scope.getSerialData();
			}
		});

		AppApi.getGpioList(function(list) {
			$scope.gpioPinList = list;
		});

		AppApi.getGpioScriptsList(function(list) {
			$scope.gpioScriptList = list;
		});
	}
]);
