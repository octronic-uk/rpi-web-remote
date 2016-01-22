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
PiApp.controller('GpioPinEditor', ['appApi','util','$scope', function(appApi, util, $scope) {
    $scope.pinName = $stateParams.name;
    $scope.ui = {};

    console.log("Scope name:",$scope.scriptName,"sp name:",$stateParams.name);

    if ($scope.pinName != "new") {
      appApi.getGpioPin($scope.pinName, function(pin) {
        $scope.pin = pin;
        console.log("Modifying pin:", $scope.pin);
      });
    } else {
      $scope.pin = {
        num: 0,
        name: "GPIO Pin",
        io: "out",
        state: 0,
        hidden: 0
      };
      console.log("Modifying pin:", $scope.pin);
    }

    $scope.deleteButton = function() {
      appApi.deleteGpioPin($scope.pin.name, function(success) {
        if (success) {
          $scope.addAlert({ type: 'success', msg: 'Pin '+$scope.pin.name+' has been deleted!' });
          setTimeout(function() {
            $state.go("Settings");
          }, 1500);
        } else {
          $scope.addAlert({ type: 'danger', msg: 'Error deleting '+$scope.pin.name });
        }
      });
    };

    $scope.saveButton = function() {
      appApi.addGpioPin($scope.pin,function(success1) {
        if (success1) {
          appApi.configSave(function(success2) {
            if (success2) {
              $scope.addAlert({ type: 'success', msg: 'Pin '+$scope.script.name+' has been saved!' });
              setTimeout(function() {
                $state.go("Settings");
              }, 1500);
            } else {
              $scope.addAlert({ type: 'danger', msg: 'Error saving '+$scope.pin.name });
            }
          });
        } else {
          $scope.addAlert({ type: 'danger', msg: 'Error saving '+$scope.pin.name });
        }
      });
    };
  }
]);
