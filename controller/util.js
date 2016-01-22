PiApp.factory('Util',['AppApi','$rootScope', function(AppApi,$rootScope){
  return {
    getSerialData : function() {
			AppApi.getSerialList(function(serialList) {
				$rootScope.serialPortList = serialList;
			});

			AppApi.getSerialBaudrateList(function(baudList) {
				$rootScope.baudRateList = baudList;
			});

			AppApi.getSerialCommandList(function(commandList) {
				$rootScope.serialCommandList = commandList;
			});

			AppApi.getSerialBaudrate(function(baudrate) {
				$rootScope.selectedBaudrate = baudrate;
			});

			AppApi.getSerialPath(function(path) {
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
