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
        console.log("Modifying script:", $scope.script);
      });
    }
    else
    {
      $scope.script = {name:"New Script", do: [], while: [], then: []};
      console.log("Modifying script:", $scope.script);
    }

    $scope.getGpioListApi(function (pinList)
    {
      $scope.gpioPinList = pinList;
      console.log("GPIO Pin list:", $scope.gpioPinList);
    });

    $scope.executeGpioScriptButton = function(scriptName)
    {
      $scope.executeGpioScriptApi(scriptName,function(resp)
      {

      });
    };

    $scope.addDoButton = function()
    {
      $scope.script.do.push({pin: addDoPin, state: addDoState});
    };

    $scope.removeDoButton = function()
    {
      $scope.getDoByPin($scope.removeDoName,function(obj)
      {
        var index = $scope.script.do.indexOf(obj);
        $scope.script.do.splice(index,1);
      });
    };

    $scope.getDoByPin = function(name,callback)
    {
      var i = 0;
      var nDo = $scope.script.do.length;
      var next = null;

      for (i = 0; i < nDo; i++)
      {
        next = $scope.script.do[i];
        if (next.pin == name)
        {
          callback(next);
          break;
        }
      }

      callback(null);
    };

    $scope.addWhileButton = function()
    {
      $scope.script.while({pin: addWhilePin, state: addWhileState});
    };

    $scope.removeWhileButton = function()
    {
      $scope.getWhileByPin($scope.removeWhileName,function(obj)
      {
        var index = $scope.script.while.indexOf(obj);
        $scope.script.while.splice(index,1);
      });
    };

    $scope.getWhileByPin = function(name,callback)
    {
      var i = 0;
      var nWhile = $scope.script.while.length;
      var next = null;

      for (i = 0; i < nWhile; i++)
      {
        next = $scope.script.while[i];
        if (next.pin == name)
        {
          callback(next);
          break;
        }
      }

      callback(null);
    };

    $scope.addThenButton = function()
    {
      $scope.script.then.push({pin: addThenPin, state: addThenState});
    };

    $scope.removeThenButton = function()
    {
      $scope.getThenByPin($scope.removeThenName,function(obj)
      {
        var index = $scope.script.then.indexOf(obj);
        $scope.script.then.splice(index,1);
      });
    };

    $scope.getThenByPin = function(name,callback)
    {
      var i = 0;
      var nThen = $scope.script.then.length;
      var next = null;

      for (i = 0; i < nThen; i++)
      {
        next = $scope.script.then[i];
        if (next.pin == name)
        {
          callback(next);
          break;
        }
      }

      callback(null);
    };

    $scope.deleteButton = function()
    {
      $scope.deleteGpioScriptApi($scope.script.name, function(success)
      {
        if (success)
        {
          $scope.addAlert({ type: 'success', msg: 'Script '+$scope.script.name+' has been deleted!' });
          $state.go("Settings");
        }
        else
        {
          $scope.addAlert({ type: 'danger', msg: 'Error deleting '+$scope.script.name });
        }
      });
    };

    $scope.saveButton = function()
    {
      $scope.setGpioScriptApi($scope.script,function(success)
      {
        if (success)
        {
          $scope.addAlert({ type: 'success', msg: 'Script '+$scope.script.name+' has been saved!' });
        }
        else
        {
          $scope.addAlert({ type: 'danger', msg: 'Error saving '+$scope.script.name });
        }
      });
    };
  }
]);
