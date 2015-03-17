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
var TOKEN_ENDPOINT_URI = 'https://www.coinbase.com/oauth/token';

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
  assign(this, opts);
  if (!this.apiKey) {
    throw new Error("no apiKey");
  }
  if (!this.apiSecret) {
    throw new Error("no apiSecret");
  }
  if (!this.baseApiUri) {
    this.baseApiUri = BASE_URI;
  }
  if (!this.tokenUri) {
    this.tokenUri = TOKEN_ENDPOINT_URI;
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
  var signature = crypto.createHmac("sha256",

  this.apiSecret).update(message).digest("hex");

  return {"nonce": nonce, "digest": signature};
};

ClientBase.prototype._generateReqOptions = function (url, body, method, headers) {

  var bodyStr = !body
    ? ''
    : JSON.stringify(body);
  var sig = this._generateSignature(url, bodyStr);

  var options = {
    "url": url,
    "method": method,
    "headers" : {
      'Content-Type'     : 'application/json',
      'Accept'           : 'application/json',
      'User-Agent'       : 'coinbase/node/1.0',
      "ACCESS_SIGNATURE" : sig.digest,
      "ACCESS_NONCE"     : sig.nonce
    },
    "body"         : bodyStr
  };
  if (!this.accessToken) {options.headers.ACCESS_KEY = this.apiKey;}

  if (headers) {assign(options.headers, headers);}

  return options;
};

ClientBase.prototype._getHttp = function (path, args, callback, headers) {

  var params = !args
    ? ''
    :  '?' + qs.stringify(args);

  var url = this._setAccessTokenOrExpire(this.baseApiUri + path + params);

  request.get(
    url,
    this._generateReqOptions(url, null, 'GET', headers),
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

