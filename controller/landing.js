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
	['socket','$state','$stateParams','$controller','$http','$scope','$rootScope' ,
	function(socket, $state, $stateParams, $controller, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});

		// Socket IO Listener ------------------------------------------------------
		console.log("Registering socket.io listener");

	  socket.on("StateChanged", function(args)
		{
			console.log("Got StateChanged from Socket.IO with args",args);
			$scope.getGpioPinByNumber(args.pin,function(pin){
				pin.state = args.state;
			});
		});

    socket.on("ScriptFinished", function(args)
		{
			console.log("Got StateChanged from Socket.IO with args",args);
			$scope.getGpioScriptByName(args.name,function(script){
				script.inProgress = false;
				$scope.addAlert({ type: 'success', msg: "Script  '"+script.name+"'has finished!" });
			});
		});

		// Client Function Definitions ---------------------------------------------

		$scope.gpioSet = function(pinNum, state)
		{
			$scope.setGpioPinValueApi(pinNum,state,function(success)
			{
				if (success)
				{
					$scope.getPinByNumber($scope.pinList,pinNum,function(pin)
					{
						pin.state = state;
					});
				}
			});
		};

		$scope.executeSerialCommand = function(command)
		{
			$scope.executeSerialCommandApi(command,function(res)
			{
				if (res)
				{
					$scope.addAlert({ type: 'success', msg: 'Started  '+command+'!' });
				}
				else
				{
					$scope.addAlert({ type: 'danger', msg: 'Error executing '+command+'. Please try again!' });
				}
			});
		};

		$scope.executeGpioScriptButton = function(scriptName)
		{
			console.log("Executing GPIO Script",scriptName);
			$scope.executeGpioScriptApi(scriptName,function(resp)
			{
				if (resp)
				{
					$scope.addAlert({ type: 'success', msg: "Script '"+scriptName+"' has been started!" });
					$scope.getGpioScriptByName(scriptName,function(script){
						script.inProgress = true;
					});
				}
				else
				{
					$scope.addAlert({ type: 'danger', msg: 'Error executing '+scriptName+'. Please try again!' });
				}
			});
		};

		// API Calls ---------------------------------------------------------------

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

		// Return a pin object based on it's number
		$scope.getGpioPinByNumber = function(pin,callback){
		  var i = 0;
		  var target = null;
			var next = null;

		  for (i = 0; i < $scope.pinList.length; i++){
				next = $scope.pinList[i];
		    if (next.num == pin){
		      target = next;
		      break;
		    }
		  }
		  callback(target);
		};

		$scope.getGpioScriptByName = function(name,callback)
		{
		  var i = 0;
		  var nScripts = $scope.gpioScriptList.length;
		  var next = null;
		  var target = null;

		  console.log("Checking",nScripts,"GPIO scripts for",name);
		  for (i = 0; i < nScripts; i++){
		    next = $scope.gpioScriptList[i];
		    if (next.name == name){
		      target = next;
		      break;
		    }
		  }
		  callback(target);
		};
	}
]);
