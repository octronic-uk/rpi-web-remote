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
		
	  socket.on("StateChanged", function(args)
		{
			console.log("Got StateChanged from Socket.IO with args",args);
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
					$scope.addAlert({ type: 'success', msg: 'Successuly executed '+command+'!.' });
				}
				else
				{
					$scope.addAlert({ type: 'danger', msg: 'Error executing '+command+'. Please try again!.' });
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
					$scope.addAlert({ type: 'success', msg: 'Successuly executed '+scriptName+'!.' });
				}
				else
				{
					$scope.addAlert({ type: 'danger', msg: 'Error executing '+scriptName+'. Please try again!.' });
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
	}
]);
