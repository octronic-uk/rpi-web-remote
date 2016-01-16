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

    $scope.updateButton = function()
    {
      $scope.addAlert({ type: 'info', msg: 'The application is updating. Please wait...' });
      $scope.getApplicationUpdateApi(function(resp)
      {
        if (resp)
        {
          $scope.addAlert({ type: 'success', msg: 'Update successful! Please restart the application.' });
        }
        else
        {
          $scope.addAlert({ type: 'danger', msg: 'There was an error updating the application. Please try again' });
        }
      });
    };

    $scope.restartButton = function()
    {
      $scope.addAlert({ type: 'info', msg: 'The application is restarting. Please wait...' });
      $scope.getApplicationRestartApi(function(resp)
      {

      });
    };

    $scope.rebootButton = function()
    {
      $scope.getDeviceRebootApi(function()
      {
        $scope.addAlert({ type: 'info', msg: 'The device is rebooting, please wait...' });
      });
    };
  }
]);
