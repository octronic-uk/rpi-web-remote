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
App.controller('GpioScriptEditor', ['appApi','util','$scope', '$stateParams', '$state',
  function(appApi, util, $scope, $stateParams, $state) {
    $scope.scriptId = $stateParams.id;
    $scope.alerts = [];
    $scope.pageName = "GPIO Script Editor";

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

    $scope.closeAlert = function(index)
    {
      util.closeAlert($scope.alerts,index);
    };

    console.log("Scope name:",$scope.scriptId);

    if ($scope.scriptId != "new") {
      appApi.getGpioScript($scope.scriptId, function(script) {
        $scope.script = script;
        console.log("Modifying script:", $scope.script);
      });
    } else {
      util.generateId(function(id) {
        $scope.script = {
          id : id,
          name:"New Script",
          do: [],
          while: [],
          then: []
        };
      });
      console.log("Modifying script:", $scope.script);
    }

    appApi.getGpioPinList(function (pinList) {
      $scope.gpioPinList = pinList;
      console.log("GPIO Pin list:", $scope.gpioPinList);
    });

    $scope.addDoButton = function() {
      $scope.script.do.push({
        pin: $scope.addDoPin,
        state: $scope.addDoState
      });
    };

    $scope.removeDoButton = function() {
      $scope.getDoByPin($scope.removeDoName,function(obj) {
        var index = $scope.script.do.indexOf(obj);
        $scope.script.do.splice(index,1);
      });
    };

    $scope.getDoByPin = function(name,callback) {
      var i = 0;
      var nDo = $scope.script.do.length;
      var next = null;
      var target = null;
      for (i = 0; i < nDo; i++) {
        next = $scope.script.do[i];
        if (next.pin == name) {
          target = next;
          break;
        }
      }
      callback(target);
    };

    $scope.addWhileButton = function() {
      $scope.script.while.push({
        pin: $scope.addWhilePin,
        state: $scope.addWhileState
      });
    };

    $scope.removeWhileButton = function() {
      $scope.getWhileByPin($scope.removeWhileName,function(obj) {
        var index = $scope.script.while.indexOf(obj);
        $scope.script.while.splice(index,1);
      });
    };

    $scope.getWhileByPin = function(name,callback) {
      var i = 0;
      var nWhile = $scope.script.while.length;
      var next = null;
      var target = null;
      for (i = 0; i < nWhile; i++) {
        next = $scope.script.while[i];
        if (next.pin == name) {
          target = next;
          break;
        }
      }
      callback(target);
    };

    $scope.addThenButton = function() {
      $scope.script.then.push({
        pin: $scope.addThenPin,
        state: $scope.addThenState
      });
    };

    $scope.removeThenButton = function() {
      $scope.getThenByPin($scope.removeThenName,function(obj) {
        var index = $scope.script.then.indexOf(obj);
        $scope.script.then.splice(index,1);
      });
    };

    $scope.getThenByPin = function(name,callback) {
      var i = 0;
      var nThen = $scope.script.then.length;
      var next = null;
      var target = null;
      for (i = 0; i < nThen; i++) {
        next = $scope.script.then[i];
        if (next.pin == name) {
          target = next;
          break;
        }
      }
      callback(target);
    };

    $scope.deleteButton = function() {
      console.log("Deleting GPIO Script",$scope.script);
      appApi.deleteGpioScript($scope.script, function(success) {
        if (success) {
          util.addAlert($scope.alerts, {
            type: 'success',
            msg: 'Script '+$scope.script.name+' has been deleted!'
          });
          setTimeout(function() {
            $state.go("Settings");
          }, 3000);
        } else {
          util.addAlert($scope.alerts, {
            type: 'danger',
            msg: 'Error deleting '+$scope.script.name
          });
        }
      });
    };

    $scope.saveButton = function() {
      console.log("Saving GPIO Script",$scope.script);
      appApi.putGpioScript($scope,function(success1) {
        if (success1) {
          appApi.configSave(function(success2) {
            if (success2) {
              util.addAlert($scope.alerts,{
                type: 'success',
                msg: 'Script '+$scope.script.name+' has been saved!'
              });
              setTimeout(function() {
                $state.go("Settings");
              }, 3000);
            } else {
              util.addAlert($scope.alerts,{
                type: 'danger',
                msg: 'Error saving '+$scope.script.name
              });
            }
          });
        } else {
          util.addAlert($scope.alerts,{
            type: 'danger',
            msg: 'Error saving '+$scope.script.name
          });
        }
      });
    };
  }
]);
