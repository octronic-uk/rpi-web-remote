PiApp.controller('System',
  ['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
  function($state, $stateParams, $controller, $http, $scope, $rootScope)
  {
  	$controller('PiApp', {$scope: $scope});
    $scope.stats = {};

    $scope.getDeviceUptimeApi(function(uptime)
    {
      $scope.stats.uptime = uptime;
    });
  }
]);
