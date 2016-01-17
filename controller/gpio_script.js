PiApp.controller('GpioScript',
  ['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
  function($state, $stateParams, $controller, $http, $scope, $rootScope)
  {
    $controller('PiApp', {$scope: $scope});
    $scope.scriptName = $state.params.name;

    if ($scope.scriptName != "new")
    {
      $scope.getGpioScriptApi($scope.scriptName, function(script)
      {
        $scope.script = script;
      });
    }
    else
    {
      $scope.script = {name:"New Script", do: [], while: [], then: []};
    }

    console.log($scope.script);
    console.log($scope.gpioScriptList);

    $scope.executeGpioScriptButton = function(scriptName)
    {
      $scope.executeGpioScriptApi(scriptName,function(resp)
      {

      });
    };
  }
]);
