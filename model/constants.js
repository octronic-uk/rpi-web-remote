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

constants =
{
	CONFIG: "config.json",
	APP_NAME: "GPIO Remote",
	VERSION: "1.0.0",
	HTTP_OK: 200,
	HTTP_NOT_FOUND:  404,
	HTTP_ERROR: 500,
	HTTP_UNAUTHORISED: 401,
	APP_EXIT_ERROR: 1,
};

module.exports = constants;
