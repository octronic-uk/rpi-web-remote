var Constants = require('./Constants');

// HTTP Helpers

module.exports.sendHttpError = function (res, msg)
{
  if (msg) console.log(msg);
  res.status(Constants.HTTP_ERROR);
  res.send();
}

module.exports.sendHttpOK = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(Constants.HTTP_OK);
  res.send();
}

module.exports.sendHttpNotFound = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(Constants.HTTP_NOT_FOUND);
  res.send();
}

module.exports.sendHttpJson = function(res,json,msg)
{
  if (msg) console.log(msg);
  res.status(Constants.HTTP_OK);
  res.json(JSON.stringify(json));
}

module.exports.sendHttpUnauthorised = function(res, msg)
{
  if (msg) console.log(msg);
  res.status(Constants.HTTP_UNAUTHORISED);
  res.send();
}