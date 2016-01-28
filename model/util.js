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
var HTTP_OK = 200;
var	HTTP_NOT_FOUND =  404;
var	HTTP_ERROR = 500;
var	HTTP_UNAUTHORISED = 401;

var sendHttpError = function (res, msg)
{
  if (msg) console.log(msg);
  res.status(HTTP_ERROR);
  res.send();
};

var sendHttpOK = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(HTTP_OK);
  res.send();
};

var sendHttpNotFound = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(HTTP_NOT_FOUND);
  res.send();
};

var sendHttpJson = function(res,json,msg)
{
  if (msg) console.log(msg);
  res.status(HTTP_OK);
  res.json(JSON.stringify(json));
};

var sendHttpUnauthorised = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(HTTP_UNAUTHORISED);
  res.send();
};

var stackTrace = function() {
  var err = new Error();
  return err.stack;
};

module.exports = {
  stackTrace: stackTrace,
  sendHttpOK : sendHttpOK,
  sendHttpJson : sendHttpJson,
  sendHttpUnauthorised: sendHttpUnauthorised,
  sendHttpError: sendHttpError,
  sendHttpNotFound: sendHttpNotFound,
};
