PiApp.controller('Settings',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});
		$scope.serialPortList = [];
		$scope.serialPortNames = [];

		$scope.getDeviceSerialPortsApi(function(serialList)
		{
			$scope.serialPortList = serialList;
			$scope.serialPortNames = [];
			$scope.serialPortList.forEach(function(sp)
			{
				$scope.serialPrtNames.push(sp.comName);
			});
		});
  }
]);
