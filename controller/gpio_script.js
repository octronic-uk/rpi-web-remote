PiApp.controller('GpioScript',
  ['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
  function($state, $stateParams, $controller, $http, $scope, $rootScope)
  {
    $controller('PiApp', {$scope: $scope});
    $scope.scriptName = $state.params.name;

    $scope.getGpioScriptApi($scope.scriptName, function(script)
    {
      $scope.script = script;
    });

    $scope.executeGpioScriptButton = function(scriptName)
    {
      $scope.executeGpioScriptApi(scriptName,function(resp)
      {

      });
    }
  }
]);
