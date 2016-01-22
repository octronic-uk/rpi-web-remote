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
PiApp.factory('util',['appApi','$rootScope', function(appApi,$rootScope){
  return {
    getSerialData : function() {
			appApi.getSerialList(function(serialList) {
				$rootScope.serialPortList = serialList;
			});

			appApi.getSerialBaudrateList(function(baudList) {
				$rootScope.baudRateList = baudList;
			});

			appApi.getSerialCommandList(function(commandList) {
				$rootScope.serialCommandList = commandList;
			});

			appApi.getSerialBaudrate(function(baudrate) {
				$rootScope.selectedBaudrate = baudrate;
			});

			appApi.getSerialPath(function(path) {
				$rootScope.selectedSerialPort = path;
			});
		},

    getGpioPinByNumber : function(pins,i,callback) {
			var target = null;
			for (var j = 0; j < pins.length; j++) {
				if (pins[j].num == i) {
					target = pins[j];
					break;
				}
			}
			callback(target);
		},

		getGpioPinByName : function(pins,name,callback) {
			var target = null;

			for (var j = 0; j < pins.length; j++) {
				if (pins[j].name == name) {
					target = pins[j];
					break;
				}
			}
			callback(target);
		},

    getGpioScriptByName : function(scriptList, name, callback)
		{
		  var i = 0;
		  var nScripts = scriptList.length;
		  var next = null;
		  var target = null;

		  console.log("Checking",nScripts,"GPIO scripts for",name);
		  for (i = 0; i < nScripts; i++){
		    next = scriptList[i];
		    if (next.name == name){
		      target = next;
		      break;
		    }
		  }
		  callback(target);
		},

		addAlert : function(alert) {
			$rootScope.alerts.push(alert);
		},

		closeAlert : function(index) {
			$rootScope.alerts.splice(index, 1);
		},
  };
}]);
