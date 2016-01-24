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
PiApp.controller('GpioPinEditor', [
  'appApi','util','$scope', '$state', '$stateParams',
  function(appApi, util, $scope, $state, $stateParams) {
    $scope.pinName = $stateParams.name;
    $scope.alerts = [];
    $scope.pin = {};
    $scope.pageName = "GPIO Pin Editor";

    $scope.closeAlert = function(index) {
      util.closeAlert($scope.alerts,index);
    };

    console.log("Scope name:",$scope.pinName,"sp name:",$stateParams.name);

    if ($scope.pinName == "new") {
      $scope.pin = {
        num: 0,
        name: "New Pin",
        io: "out",
        state: 0,
        hidden: 0
      };
      console.log("Modifying pin:", $scope.pin);
    } else {
      appApi.getGpioPinByName($scope.pinName, function(pin) {
        if (pin) {
          $scope.pin = pin;
          console.log("Modifying pin:", $scope.pin);
        } else {
          console.log("The server returned an empty pin object");
        }
      });
    }

    $scope.deleteButton = function() {
      appApi.deleteGpioPin($scope.pin.name, function(success) {
        if (success) {
          util.addAlert($scope.alerts,{ type: 'success', msg: 'Pin '+$scope.pin.name+' has been deleted!' });
          setTimeout(function() {
            $state.go("Settings");
          }, 1500);
        } else {
          util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error deleting '+$scope.pin.name });
        }
      });
    };

    $scope.saveButton = function() {
      appApi.addGpioPin($scope.pin,function(success1) {
        if (success1) {
          appApi.configSave(function(success2) {
            if (success2) {
              util.addAlert($scope.alerts,{ type: 'success', msg: 'Pin '+$scope.pin.name+' has been saved!' });
              setTimeout(function() {
                $state.go("Settings");
              }, 1500);
            } else {
              util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving '+$scope.pin.name });
            }
          });
        } else {
          util.addAlert($scope.alerts,{ type: 'danger', msg: 'Error saving '+$scope.pin.name });
        }
      });
    };
  }
]);
