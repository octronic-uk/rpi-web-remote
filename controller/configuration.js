/*
  Ash's RaspberryPI IO Remote.
  email: ashthompson06@gmail.command
  repo: https://github.com/BashEdThomps/IoT-RaspberryPI.git

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
App.config(function($provide, $stateProvider, $urlRouterProvider)
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
    templateUrl: "settings/settings.html",
    controller: "Settings"
  });

  $stateProvider.state('GpioScriptEditor',
  {
    url: "/settings/gpio/script_editor/:name",
    templateUrl: "settings/gpio/script_editor.html",
    controller: "GpioScriptEditor"
  });

  $stateProvider.state('GpioPinEditor',
  {
    url: "/settings/gpio/pin_editor/:name",
    templateUrl: "settings/gpio/pin_editor.html",
    controller: "GpioPinEditor"
  });

  $stateProvider.state('SerialCommandEditor',
  {
    url: "/settings/serial/command_editor/:name",
    templateUrl: "settings/serial/command_editor.html",
    controller: "SerialCommandEditor"
  });

  $stateProvider.state('System',
  {
    url: "/system",
    templateUrl: "system/system.html",
    controller: "System"
  });
});
