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

    $scope.getDeviceHostnameApi(function(hostname)
    {
      $scope.stats.hostname = hostname;
    });

    $scope.getDeviceAddressApi(function(address)
    {
      $scope.stats.address = address;
    });

    $scope.rebootButton = function()
    {
      $scope.getDeviceRebootApi(function()
      {
        $scope.addAlert({ type: 'primary', msg: 'The device is rebooting, please wait...' });
      });
    };
  }
]);
