PiApp.config(function($provide, $stateProvider, $urlRouterProvider,$locationProvider,$uiViewScrollProvider)
{
  $uiViewScrollProvider.useAnchorScroll();

  $urlRouterProvider.otherwise("/");

  $stateProvider.state('Landing',
  {
  	url: "/",
  	templateUrl: "landing.html",
    controller: "Landing"
  });

  $stateProvider.state('Settings',
  {
    url: "/settings",
    templateUrl: "settings.html",
    controller: "Settings"
  });

  $stateProvider.state('System',
  {
    url: "/system",
    templateUrl: "system.html",
    controller: "System"
  });

  $stateProvider.state('GpioScript',
  {
    url: "/settings/gpio_script/:name",
    templateUrl: "gpio_script.html",
    controller: "GpioScript"
  });
});

PiApp.run(function($rootScope,$location,$stateParams, $anchorScroll){
  $rootScope.$on('$stateChangeSuccess', function(event, toState){
    if($stateParams.scrollTo){
      $location.hash($stateParams.scrollTo);
      $anchorScroll();
    }
  });
});
