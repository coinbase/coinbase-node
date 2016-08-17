"use strict";
var request       = require('request'),
    handleError   = require('./errorHandler').handleError,
    handleHttpError   = require('./errorHandler').handleHttpError,
    Base          = require('./Base'),
    Account       = require('./model/Account'),
    Address       = require('./model/Address'),
    Buy           = require('./model/Buy'),
    Checkout      = require('./model/Checkout'),
    Deposit       = require('./model/Deposit'),
    Merchant      = require('./model/Merchant'),
    Notification  = require('./model/Notification'),
    Order         = require('./model/Order'),
    PaymentMethod = require('./model/PaymentMethod'),
    Sell          = require('./model/Sell'),
    Transaction   = require('./model/Transaction'),
    User          = require('./model/User'),
    Withdrawal    = require('./model/Withdrawal'),
    crypto        = require('crypto'),
    _             = require('lodash'),
    qs            = require('querystring'),
    assign        = require('object-assign'),
    CERT_STORE    = require('./CoinbaseCertStore');

var BASE_URI           = 'https://api.coinbase.com/v2/';
var TOKEN_ENDPOINT_URI = 'https://api.coinbase.com/oauth/token';

var MODELS = {
  'account'        : Account,
  'address'        : Address,
  'buy'            : Buy,
  'checkout'       : Checkout,
  'deposit'        : Deposit,
  'merchant'       : Merchant,
  'notification'   : Notification,
  'order'          : Order,
  'payment_method' : PaymentMethod,
  'sell'           : Sell,
  'transaction'    : Transaction,
  'user'           : User,
  'withdrawal'     : Withdrawal
};

//
// constructor
//
// opts = {
//   'apiKey'       : apyKey,
//   'apiSecret'    : apySecret,
//   'baseApiUri'   : baseApiUri,
//   'tokenUri'     : tokenUri,
//   'caFile'       : caFile,
//   'strictSSL'    : strictSSL,
//   'accessToken'  : accessToken,
//   'refreshToken' : refreshToken,
//   'version'      : version
// };
function ClientBase(opts) {

  if (!(this instanceof ClientBase)) {
    return new ClientBase(opts);
  }

  // assign defaults and options to the context
  assign(this, {
    baseApiUri: BASE_URI,
    tokenUri: TOKEN_ENDPOINT_URI,
    caFile: CERT_STORE,
    strictSSL: true
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

ClientBase.prototype._setAccessToken = function(path) {

  // OAuth access token
  if (this.accessToken) {
    if (path.indexOf('?') > -1) {
      return path + '&access_token=' + this.accessToken;
    }
    return path + '?access_token=' + this.accessToken;
  }
  return path
};

ClientBase.prototype._generateSignature = function(path, method, bodyStr) {
  var timestamp = Math.floor(Date.now() / 1000);
  var message = timestamp + method + '/v2/' + path + bodyStr;
  var signature = crypto.createHmac('sha256', this.apiSecret).update(message).digest('hex');

  return {
    'digest': signature,
    'timestamp': timestamp
  };
};

ClientBase.prototype._generateReqOptions = function(url, path, body, method, headers) {

  var bodyStr = body ? JSON.stringify(body) : '';

  // specify the options
  var options = {
    'url': url,
    'ca': this.caFile,
    'strictSSL': this.strictSSL,
    'body': bodyStr,
    'method': method,
    'headers' : {
      'Content-Type'     : 'application/json',
      'Accept'           : 'application/json',
      'User-Agent'       : 'coinbase/node/1.0.4'
    }
  };

  // add additional headers when we're using the "api key" and "api secret"
  if (this.apiSecret && this.apiKey) {
    var sig = this._generateSignature(path, method, bodyStr);

    // add signature and nonce to the header
    options.headers = assign(options.headers, {
      'CB-ACCESS-SIGN': sig.digest,
      'CB-ACCESS-TIMESTAMP': sig.timestamp,
      'CB-ACCESS-KEY': this.apiKey,
      'CB-VERSION': this.version || '2016-02-18'
    })
  }

  return options;
};

ClientBase.prototype._getHttp = function(path, args, callback, headers) {
  var params = '';
  if (args && !_.isEmpty(args)) {
    params = '?' + qs.stringify(args);
  }

  var url = this.baseApiUri + this._setAccessToken(path + params);
  var opts = this._generateReqOptions(url, path + params, null, 'GET', headers);

  request.get(opts, function onGet(err, response, body) {
    if (!handleHttpError(err, response, callback)) {
      if (!body) {
        callback(new Error("empty response"), null);
      } else {
        var obj = JSON.parse(body);
        callback(null, obj);
      }
    }
  });
};

ClientBase.prototype._postHttp = function(path, body, callback, headers) {

  var url = this.baseApiUri + this._setAccessToken(path);
  body = body || {}

  var options = this._generateReqOptions(url, path, body, 'POST', headers);

  request.post(options, function onPost(err, response, body) {
    if (!handleHttpError(err, response, callback)) {
      if (body) {
        var obj = JSON.parse(body);
        callback(null, obj);
      } else {
        callback(null, body);
      }
    }
  });
};

ClientBase.prototype._putHttp = function(path, body, callback, headers) {

  var url = this.baseApiUri + this._setAccessToken(path);

  var options = this._generateReqOptions(url, path, body, 'PUT', headers);

  request.put(options, function onPut(err, response, body) {
    if (!handleHttpError(err, response, callback)) {
      if (body) {
        var obj = JSON.parse(body);
        callback(null, obj);
      } else {
        callback(null, body);
      }
    }
  });
};


ClientBase.prototype._deleteHttp = function(path, callback, headers) {
  var url = this.baseApiUri + this._setAccessToken(path);
  request.del(url, this._generateReqOptions(url, path, null, 'DELETE', headers),
  function onDel(err, response, body) {
    if (!handleHttpError(err, response, callback)) {
      callback(null, body);
    }
  });
};

//
// opts = {
//   'colName'        : colName,
//   'next_uri'       : next_uri,
//   'starting_after' : starting_after,
//   'ending_before'  : ending_before,
//   'limit'          : limit,
//   'order'          : order
// };
// ```
//
ClientBase.prototype._getAllHttp = function(opts, callback, headers) {
  var self = this;
  var args = {}
  var path;
  if (this.hasField(opts, 'next_uri')) {
    path = opts.next_uri.replace('/v2/', '');
    args = null;
  } else {
    path = opts.colName;
    if (this.hasField(opts, 'starting_after')) {
      args.starting_after = opts.starting_after;
    }
    if (this.hasField(opts, 'ending_before')) {
      args.ending_before = opts.ending_before;
    }
    if (this.hasField(opts, 'limit')) {
      args.limit = opts.limit;
    }
    if (this.hasField(opts, 'order')) {
      args.order = opts.order;
    }
  }

  this._getHttp(path, args, function onGet(err, result) {
    if (!handleError(err, result, callback)) {
      var objs = [];
      if (result.data.length !== 0) {
        var ObjFunc = self._stringToClass(result.data[0].resource);
        objs = _.map(result.data, function onMap(obj) {
          return new ObjFunc(self, obj);
        });
      }
      callback(null, objs, result.pagination);
    }
  }, headers);
};

//
// args = {
// 'path'     : path,
// 'params'   : params,
// }
//
ClientBase.prototype._getOneHttp = function(args, callback, headers) {
  var self = this;
  this._getHttp(args.path, args.params, function onGet(err, obj) {
    if (!handleError(err, obj, callback)) {
      if (obj.data.resource) {
        var ObjFunc = self._stringToClass(obj.data.resource);
        callback(null, new ObjFunc(self, obj.data));
      } else {
        callback(null, obj);
      }
    }
  }, headers);
};

//
// opts = {
// 'colName'  : colName,
// 'params'   : args
// }
//
ClientBase.prototype._postOneHttp = function(opts, callback, headers) {
   var self = this;
   var body = opts.params;
   this._postHttp(opts.colName, body, function onPost(err, obj) {
    if (!handleError(err, obj, callback)) {
      if (obj.data.resource) {
        var ObjFunc = self._stringToClass(obj.data.resource);
        callback(null, new ObjFunc(self, obj.data));
      } else {
        callback(null, obj);
      }
    }
  }, headers);
};

ClientBase.prototype._stringToClass = function(name) {
  return MODELS[name]
};

module.exports = ClientBase;
