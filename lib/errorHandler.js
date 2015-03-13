"use strict";
var etypes = require('./errorTypes');

function _errorMessage(response) {
  if (!response) {return null;}
  if (response.body) {
    if (response.body && (response.body[0] === '{' || response.body[0] ==='[')) {
      var eobj;
      try {
        eobj = JSON.parse(response.body);
        if (eobj.error) {
          return eobj.error;
        }
      } catch (ignore){
      }
    }
  }
  return response.toString();
}

function _createError(type, message, response, cause) {
  var error          = new Error();
      error.message  = message;
      error.type     = type;
      error.response = response;
      error.cause    = cause;
  return error;
}

function _getAuthHeaders(aheader) {
  var pairs = aheader.split(',');
  if (pairs) {
    var obj = {};
    pairs.forEach(function(item) {
      var pair = item.split('=');
      if (pair[0] && pair[1]) {
        obj[pair[0].trim()] = pair[1].replace(/['"]+/g, '');
      }
    });
    return obj;
  }
  return null;
}

function _getAuthErrorDetails(response) {
  var details = {};
  if (response.headers && 
      response.headers['www-authenticate']) {
        var authHeaders = _getAuthHeaders(response.headers['www-authenticate']);
        if (authHeaders) {
          details.id = authHeaders.error;
          details.error = authHeaders.error_description;
          return details;
        }
  }
  return null;
}
function _createAuthError(response, cause) {
  var errorDetails = _getAuthErrorDetails(response);
  if (errorDetails && errorDetails.id === 'invalid_token') {
    if (errorDetails.error && errorDetails.error.indexOf('expired') > -1) {
      return _createError(etypes.ExpiredAccessToken, etypes.ExpiredAccessToken,
          response, cause);
    }
    return _createError(etypes.InvalidAccessToken, etypes.InvalidAccessToken,
        response, cause);
  }
  return _createError(etypes.AuthenticationError, etypes.AuthenticationError,
      response, cause);
}

var UnknownErrorType = 'UnknownErrorType';

function _processResponse(err, response, callback) {
  var cbErr;
  if (response.statusCode === 402) {
    callback(_createError(etypes.TwoFactorTokenRequired,
                          etypes.TwoFactorTokenRequired, response, err), null);
    return true;
  }
  if (response.statusCode === 401) {
    callback(_createAuthError(response, err), null);
    return true;
  }
  if (response.statusCode !== 200) {
    cbErr = new Error(response.statusCode + ' ' + _errorMessage(response));
    cbErr.response = response;
    callback(_createError(UnknownErrorType, 'statusCode: ' + 
          response.statusCode, response, err), null);
    return true;
  }
  return false;
}

function handleHttpError(err, response, callback) {

  if (!callback) {throw new Error("no callback for http error handler- check method signature");}

  if (err) {
    callback(err, null);
    return true;
  }
  if (!response) {
    callback(_createError('no response', 'no response', null, err), null);
    return true;
  } 
  if (_processResponse(err, response, callback)) {
    return true;
  }
  return false;
}

function handleError(err, obj, typeName, callback) {

  if (!callback) {throw "no callback - check method signature";}
  if (err) {
    callback(err, null);
    return true;
  }
  if (obj.error) {
    callback(_createError(etypes.APIError, obj.error, obj, null), null);
    return true;
  }
  if (obj.errors) {
    callback(_createError(etypes.APIError, etypes.APIError, obj, null), null);
    return true;
  }
  if (obj.success !== undefined && obj.success !== true) {
    callback(_createError(etypes.APIError, etypes.APIError, obj, null), null);
    return true;
  }
  if (typeName && !obj[typeName]) {
    callback(_createError(etypes.APIError, 'invalid object returned from server',
          obj, null), null);
    return true;
  }
  return false;
}

module.exports.handleError     = handleError;
module.exports.handleHttpError = handleHttpError;

