PiApp.controller('Settings',
	['$state','$stateParams','$controller','$cookies','$http','$scope','$rootScope' ,
	function($state, $stateParams, $controller, $cookies, $http, $scope, $rootScope)
	{
    $controller('PiApp', {$scope: $scope});
		$scope.serialPortList = [];

		$scope.getDeviceSerialListApi(function(serialList)
		{
			$scope.serialPortList = serialList;
		});
  }
]);
