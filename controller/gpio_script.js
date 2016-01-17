PiApp.controller('Settings',
  ['$state','$stateParams','$controller','$http','$scope','$rootScope' ,
  function($state, $stateParams, $controller, $http, $scope, $rootScope)
  {
    $controller('PiApp', {$scope: $scope});
    $scope.scriptName = $state.params.name;
  
  }
]);
