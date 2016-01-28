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
App.controller('GpioPinEditor', [
  'appApi','util','$scope', '$state', '$stateParams',
  function(appApi, util, $scope, $state, $stateParams) {
    $scope.id = $stateParams.id;
    $scope.alerts = [];
    $scope.pin = {};
    $scope.pageName = "GPIO Pin Editor";

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

    $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
          input.push(i);
      }
      return input;
    };

    $scope.closeAlert = function(index) {
      util.closeAlert($scope.alerts,index);
    };

    if ($scope.id == "new") {
      util.generateId(function(id){
        console.log("New pin with id",id);
        $scope.pin = {
          history: [],
          id: id,
          num: 0,
          name: "",
          io: "out",
          state: 0,
          hidden: false,
        };
        console.log("Modifying pin:", $scope.pin);
      });
    } else {
      appApi.getGpioPinById($scope.id, function(pin) {
        if (pin) {
          $scope.pin = pin;
          console.log("Modifying pin:", $scope.pin);
        } else {
          console.log("The server returned an empty pin object");
        }
      });
    }

    $scope.deleteButton = function() {
      appApi.deleteGpioPin($scope.pin, function(success) {
        if (success) {
          util.addAlert($scope.alerts,{
            type: 'success',
            msg: 'Pin '+$scope.pin.name+' has been deleted!'
          });
          setTimeout(function() {
            $state.go("Settings");
          }, 3000);
        } else {
          util.addAlert($scope.alerts,{
            type: 'danger',
            msg: 'Error deleting '+$scope.pin.name
          });
        }
      });
    };

    $scope.saveButton = function() {
      $scope.pin.history.push({
        date: new Date(),
        state: $scope.pin.state
      });
      appApi.putGpioPin($scope.pin,function(success) {
        if (success) {
          util.addAlert($scope.alerts,{
            type: 'success',
            msg: 'Pin '+$scope.pin.name+' has been saved!'
          });
          setTimeout(function() {
            $state.go("Settings");
          }, 3000);
        } else {
          util.addAlert($scope.alerts,{
            type: 'danger',
            msg: 'Error saving '+$scope.pin.name
          });
        }
      });
    };
  }
]);
