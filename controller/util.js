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
App.factory('util',function(){
  return {
    s4 : function() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    },
    generateId : function()  {
      return this.s4() + '-' +
             this.s4() + '-' +
             this.s4() + '-' +
             this.s4();
    },
    // Get a pin by number
    getGpioPinById : function(pins, id, callback) {
			var target = null;
      var next = null;
      var nPins = pins.length;
			for (var j = 0; j < nPins; j++) {
        next = pins[j];
				if (next.id == id) {
					target = next;
					break;
				}
			}
			callback(target);
		},
    getGpioPinIndexById : function(pins, id, callback) {
      this.getGpioPinById(pins, id, function(pin){
        if (pin) {
          callback(pins.indexOf(pin));
        } else {
          callback(-1);
        }
      });
    },
    // Get the index of a command by name
		getSerialCommandIndexById : function(list, id, callback)
		{
			this.getSerialCommandById(list, id, function(cmd)
		  {
				callback(list.indexOf(cmd));
			});
		},
		// Get a serial command by name
	  getSerialCommandById : function(list, id, callback)
		{
			var nCommands = list.length;
			var target = null;
		  for (var i = 0; i < nCommands; i++) {
		    var next = list[i];
		    if (next.id == id) {
		      target = next;
					break;
		    }
		  }
			callback(target);
		},
    // get gpio script by name
    getGpioScriptById : function(scriptList, id, callback)
		{
		  var i = 0;
		  var nScripts = scriptList.length;
		  var next = null;
		  var target = null;
		  console.log("Checking",nScripts,"GPIO scripts for",name);
		  for (i = 0; i < nScripts; i++) {
		    next = scriptList[i];
		    if (next.id == id) {
		      target = next;
		      break;
		    }
		  }
		  callback(target);
		},
    getGpioScriptIndexById : function(list, id, callback) {
      this.getGpioScriptById(list,id,function(script) {
        if (script) {
          callback(list.indexOf(script));
        } else {
          callback(-1);
        }
      });
    },
    // Add an alert to the page
		addAlert : function(alertList,alert) {
			alertList.push(alert);
		},
    // Close an alert from the page
		closeAlert : function(alertList,index) {
			alertList.splice(index, 1);
		},
  };
});
