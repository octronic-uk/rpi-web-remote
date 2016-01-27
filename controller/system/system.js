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
App.controller('System', ['appApi','util','$scope','$state',
  function(appApi,util, $scope, $state)   {
    $scope.stats = {};
    $scope.alerts = [];
    $scope.pageName = "System";

    appApi.getDeviceName(function(name) {
		  $scope.deviceName = name;
	  });

    $scope.closeAlert = function(index) {
      util.closeAlert($scope.alerts,index);
    };

    appApi.getDeviceUptime(function(uptime) {
      $scope.stats.uptime = uptime;
    });

    appApi.getDeviceHostname(function(hostname) {
      $scope.stats.hostname = hostname;
    });

    appApi.getDeviceAddress(function(address) {
      $scope.stats.address = address;
    });

    $scope.updateButton = function() {
      util.addAlert($scope.alerts,{ type: 'info', msg: 'The application is updating. Please wait...' });
      appApi.getApplicationUpdate(function(resp) {
        if (resp) {
          $scope.stats.updateResult = resp;
          util.addAlert($scope.alerts,{ type: 'success', msg: 'Update successful! Please restart the application.' });
        } else {
          util.addAlert($scope.alerts,{ type: 'danger', msg: 'There was an error updating the application. Please try again' });
        }
      });
    };

    $scope.restartButton = function() {
      util.addAlert($scope.alerts,{ type: 'info', msg: 'The application is restarting. Please wait...' });
      appApi.getApplicationRestart(function(resp){
        if (resp) {
          setTimeout(function(){
            $state.go("Landing");
          },10000);
        }
      });
    };

    $scope.rebootButton = function() {
      appApi.getDeviceReboot(function() {
        util.addAlert($scope.alerts,{ type: 'info', msg: 'The device is rebooting, please wait...' });
      });
    };
  }
]);
