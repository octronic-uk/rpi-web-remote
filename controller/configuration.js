PiApp.config(function($provide, $stateProvider, $urlRouterProvider)
{
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
});
