"use strict";
var request       = require("request"),
    handleError   = require('./errorHandler').handleError,
    handleHttpError   = require('./errorHandler').handleHttpError,
    Base          = require("./Base"),
    Account       = require("./model/Account"),
    Contact       = require("./model/Contact"),
    PaymentMethod = require("./model/PaymentMethod"),
    User          = require("./model/User"),
    crypto        = require("crypto"),
    _             = require("lodash"),
    qs            = require("querystring"),
    assign        = require("object-assign");

var BASE_URI           = "https://api.coinbase.com/v1/";
var TOKEN_ENDPOINT_URI = 'https://api.coinbase.com/oauth/token';

var generateExpireTime = function () {

  var timestamp = String(Math.floor(new Date().getTime()/1000) + 15);

  return timestamp;
};

//
// constructor
//
// opts = {
//   'apiKey'       : apyKey,
//   'apiSecret'    : apySecret,
//   'baseApiUri'   : baseApiUri,
//   'tokenUri'     : tokenUri,
//   'accessToken'  : accessToken,
//   'refreshToken'  : refreshToken
// };
function ClientBase(opts) {

  if (!(this instanceof ClientBase)) {
    return new ClientBase(opts);
  }

  // assign defaults and options to the context
  assign(this, {
    baseApiUri: BASE_URI,
    tokenUri: TOKEN_ENDPOINT_URI
  }, opts);

  // check for the different auth strategies
  var api = !!(this.apiKey && this.apiSecret)
  var oauth = !!this.accessToken;

  // XOR
  if (!(api ^ oauth)) {
    throw new Error('you must either provide an "accessToken" or the "apiKey" & "apiSecret" parameters');
  }
}

ClientBase.prototype = Object.create(Base.prototype);

//
// private methods
//

ClientBase.prototype._setAccessTokenOrExpire = function (url) {

  // OAuth access token
  if (this.accessToken) {
    if (url.indexOf("?") > -1) {
      return url + '&access_token=' + this.accessToken;
    }
    return url + '?access_token=' + this.accessToken;
  }

  // Expire for API key
  if (url.indexOf("?") > -1) {
    return url + '&expire=' + generateExpireTime();
  }
  return url + '?expire=' + generateExpireTime();
};

ClientBase.prototype._generateSignature = function (url, bodyStr) {
  var nonce     = String(new Date().getTime()) + new Date().getMilliseconds();
  var message   = String(nonce) + url + bodyStr;
  var signature = crypto.createHmac("sha256", this.apiSecret).update(message).digest("hex");
  return {"nonce": nonce, "digest": signature};
};

ClientBase.prototype._generateReqOptions = function (url, body, method, headers) {

  var bodyStr = body ? JSON.stringify(body) : '';

  // specify the options
  var options = {
    "url": url,
    "body": bodyStr,
    "method": method,
    "headers" : {
      'Content-Type'     : 'application/json',
      'Accept'           : 'application/json',
      'User-Agent'       : 'coinbase/node/1.0.3'
    }
  };

  // add additional headers when we're using the "api key" and "api secret"
  if (this.apiSecret && this.apiKey) {
    var sig = this._generateSignature(url, bodyStr);

    // add signature and nonce to the header
    options.headers = assign(options.headers, {
      'ACCESS_SIGNATURE': sig.digest,
      'ACCESS_NONCE': sig.nonce,
      'ACCESS_KEY': this.apiKey
    })
  }

  return options;
};

ClientBase.prototype._getHttp = function (path, args, callback, headers) {

  var params = args ? '?' + qs.stringify(args) : '';
  var url = this._setAccessTokenOrExpire(this.baseApiUri + path + params);
  var opts = this._generateReqOptions(url, null, 'GET', headers);

  request.get(
    opts,
    function onGet(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        if (!body) {
          callback(new Error("empty response"), null);
        } else {
          var obj = JSON.parse(body);
          callback(null, obj);
        }
      }
    }
  );
};

ClientBase.prototype._postHttp = function (path, body, callback, headers) {

  var url;

  if (path.indexOf('http') === 0) {
    url = path;
    body = body || {};
    body = _.merge(body, {"expire": generateExpireTime()})
  } else {
    url = this._setAccessTokenOrExpire(this.baseApiUri + path);
  }

  var options = this._generateReqOptions(url, body, 'POST', headers);

  request.post(options,
    function onPost(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        var obj = JSON.parse(body);
        callback(null, obj);
      }
    }
  );
};

ClientBase.prototype._putHttp = function (path, body, callback, headers) {

  var url = this._setAccessTokenOrExpire(this.baseApiUri + path);

  var options = this._generateReqOptions(url, body, 'POST', headers);

  request.put(options,
    function onPut(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        var obj = JSON.parse(body);
        callback(null, obj);
      }
    }
  );
};


ClientBase.prototype._deleteHttp = function (path, callback, headers) {
  var url = this._setAccessTokenOrExpire(this.baseApiUri + path);
  request.del(
    url,
    this._generateReqOptions(url, null, 'DELETE', headers),
    function onDel(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        var obj = JSON.parse(body);
        callback(null, obj);
      }
    }
  );
};

//
// args = {
// 'page'     : page,
// 'limit'    : limit,
// 'colName'  : colName,
// 'typeName' : typeName,
// 'ObjFunc'  : ObjFunc
// }
//
ClientBase.prototype._getAllHttp = function(opts, callback, headers) {
  var self = this;
  var params = (opts.page || opts.limit)
    ? {}
    : null;
  if (this.hasField(opts, 'page')) {
    params.page = opts.page;
  }
  if (this.hasField(opts, 'limit')) {
    params.limit = opts.limit;
  }
  if (this.hasField(opts, 'query')) {
    params.query = opts.query;
  }
  this._getHttp(opts.colName, params, function onGet(err, result) {
    if (!handleError(err, result, opts.colName, callback)) {
      var objs;
      if (opts.typeName && opts.ObjFunc) {
        objs = _.map(result[opts.colName],
          function onMap(obj) {
            return new opts.ObjFunc(self, obj[opts.typeName]);
          });
      } else {
        objs = result;
      }
      callback(null, objs);
    }
  }, headers);
};

//
// args = {
// 'path'     : path,
// 'params'   : params,
// 'typeName' : typeName
// }
//
ClientBase.prototype._getOneHttp = function(args, callback, headers) {
  var self = this;
  this._getHttp(args.path, args.params, function onGet(err, obj) {
    if (!handleError(err, obj, args.typeName, callback)) {
      if (args.ObjFunc && args.typeName) {
        callback(null, new args.ObjFunc(self, obj[args.typeName]));
      } else {
        callback(null, obj);
      }
    }
  }, headers);
};

//
// opts = {
// 'colName'  : colName,
// 'typeName' : typeName,
// 'ObjFunc' : ObjFunc,
// 'args' : args
// }
//
ClientBase.prototype._postOneHttp = function (opts, callback, headers) {
   var self = this;
   var body;
   if (opts.typeName) {
    body = {};
    body[opts.typeName] = opts.args;
   } else {
    body = opts.args;
   }
   this._postHttp(opts.colName, body, function onPost(err, obj) {
    if (!handleError(err, obj, opts.typeName, callback)) {
      if (opts.ObjFunc && opts.typeName) {
        var one = new opts.ObjFunc(self, obj[opts.typeName]);
        callback(null, one);
      } else {
        callback(null, obj);
      }
    }
  }, headers);
};

module.exports = ClientBase;
