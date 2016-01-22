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
PiApp.factory('util',function(){
  return {
    convertSpacesToUnderscores : function(name,callback)
		{
			callback((name.indexOf(" ") > 0 ? name.split(" ").join("_") : name));
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

    // Get the index of a command by name
		getSerialCommandIndexByName : function(list, name,callback)
		{
			this.getSerialCommandByName(list, name, function(cmd)
		  {
				callback(list, serialCommandList.indexOf(cmd));
			});
		},

		// Get a serial command by name
	  getSerialCommandByName : function(list, name, callback)
		{
			var nCommands = list.length;
			var target = null;

		  for (var i = 0; i < nCommands; i++) {
		    var next = list[i];
		    if (next.name == name) {
		      target = next;
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

		addAlert : function(alertList,alert) {
			alertList.push(alert);
		},

		closeAlert : function(alertList,index) {
			alertList.splice(index, 1);
		},
  };
});
