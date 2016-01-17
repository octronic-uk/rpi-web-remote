PiApp.controller('GpioScript',
  ['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
  function($state, $stateParams, $controller, $http, $scope, $rootScope)
  {
    $controller('PiApp', {$scope: $scope});
    $scope.scriptName = $stateParams.name;

    console.log("Scope name:",$scope.scriptName,"sp name:",$stateParams.name);

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

    console.log("Modifying script:", $scope.script);

    $scope.getGpioListApi(function (pinList)
    {
      $scope.gpioPinList = pinList;
    });

    console.log("GPIO Pin list:", $scope.gpioPinList);

    $scope.executeGpioScriptButton = function(scriptName)
    {
      $scope.executeGpioScriptApi(scriptName,function(resp)
      {

      });
    };
  }
]);
