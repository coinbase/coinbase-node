"use strict";
var ClientBase    = require('./ClientBase'),
    request       = require("request"),
    handleError   = require('./errorHandler').handleError,
    Account       = require("./model/Account"),
    Checkout      = require("./model/Checkout"),
    Notification  = require("./model/Notification"),
    Order         = require("./model/Order"),
    PaymentMethod = require("./model/PaymentMethod"),
    User          = require("./model/User"),
    Merchant      = require("./model/Merchant"),
    crypto        = require("crypto"),
    _             = require("lodash"),
    qs            = require("querystring"),
    assign        = require("object-assign"),
    callback_key  = require('./CallbackKey.js');


function Client(opts) {

  if (!(this instanceof Client)) {
    return new Client(opts);
  }
  ClientBase.call(this, opts);
}

Client.prototype = Object.create(ClientBase.prototype);

Client.prototype.refresh = function(callback) {
  var self = this;
  var params = {
                 'grant_type'    : 'refresh_token',
                 'refresh_token' : this.refreshToken
               };
  var path = this.tokenUri;
  this._postHttp(path, params, function myPost(err, result) {

    if (err) {
      err.type = etypes.TokenRefreshError;
      callback(err, result);
      return;
    }
    self.accessToken = result.access_token;
    self.refreshToken = result.refresh_token;
    callback(null, result);
  });
};

Client.prototype.getAccounts = function(args, callback) {

  var opts = {
    'colName'  : 'accounts',
    'ObjFunc'  : Account
  };

  this._getAllHttp(_.assign(args || {}, opts), callback)
};

Client.prototype.getAccount = function(account_id, callback) {

  var opts = {
    'path'     : 'accounts/' + account_id,
    'ObjFunc'  : Account
  };
  this._getOneHttp(opts, callback);
};

Client.prototype.createAccount = function(args, callback) {

  var opts = {
    'colName'  : 'accounts',
    'ObjFunc'  : Account,
    'params'   : args
  };

  this._postOneHttp(opts, callback);
};

Client.prototype.getCurrentUser = function(callback) {

  var opts = {
    'path'     : 'user',
    'ObjFunc'  : User
  };

  this._getOneHttp(opts, callback);
};

Client.prototype.getUser = function(userId, callback) {

  var opts = {
    'path'     : 'users/' + userId,
    'ObjFunc'  : User
  };

  this._getOneHttp(opts, callback);
};

Client.prototype.getNotifications = function(args, callback) {

  var opts = {
    'colName'  : 'notifications',
    'ObjFunc'  : Notification
  };

  this._getAllHttp(_.assign(args || {}, opts), callback)
};

Client.prototype.getNotification = function(notificationId, callback) {

  var opts = {
    'path'     : 'notifications/' + notificationId,
    'ObjFunc'  : Notification
  };
  this._getOneHttp(opts, callback);
};

Client.prototype.getBuyPrice = function(params, callback) {

  var currencyPair;
  if (params.currencyPair) {
    currencyPair = params.currencyPair;
  } else if (params.currency) {
    currencyPair = 'BTC-' + params.currency;
  } else {
    currencyPair = 'BTC-USD';
  }
  this._getOneHttp({'path': 'prices/' + currencyPair + '/buy'}, callback);
};

Client.prototype.getSellPrice = function(params, callback) {

  var currencyPair;
  if (params.currencyPair) {
    currencyPair = params.currencyPair;
  } else if (params.currency) {
    currencyPair = 'BTC-' + params.currency;
  } else {
    currencyPair = 'BTC-USD';
  }
  this._getOneHttp({'path': 'prices/' + currencyPair + '/sell'}, callback);
};

Client.prototype.getSpotPrice = function(params, callback) {

  var currencyPair;
  if (params.currencyPair) {
    currencyPair = params.currencyPair;
  } else if (params.currency) {
    currencyPair = 'BTC-' + params.currency;
  } else {
    currencyPair = 'BTC-USD';
  }
  this._getOneHttp({'path': 'prices/' + currencyPair + '/spot'}, callback);
};

// deprecated. use getSpotPrice with ?date=YYYY-MM-DD
Client.prototype.getHistoricPrices = function(params, callback) {

  this._getOneHttp({'path': 'prices/historic', 'params': params} , callback);
};

Client.prototype.getCurrencies = function(callback) {

  this._getOneHttp({'path': 'currencies'}, callback);
};

Client.prototype.getExchangeRates = function(params, callback) {

  this._getOneHttp({'path': 'exchange-rates', 'params': params}, callback);
};

Client.prototype.getTime = function(callback) {

  this._getOneHttp({'path': 'time'}, callback);
};

Client.prototype.getPaymentMethods = function(args, callback) {

  var opts = {
    'colName'  : 'payment-methods',
    'ObjFunc'  : PaymentMethod
  };

  this._getAllHttp(_.assign(args || {}, opts), callback)
};

Client.prototype.getPaymentMethod = function(methodId, callback) {

  var opts = {
    'path'     : 'payment-methods/' + methodId,
    'ObjFunc'  : PaymentMethod
  };

  this._getOneHttp(opts, callback);
};

// Merchant Endpoints
Client.prototype.getOrders = function(args, callback) {

  var opts = {
    'colName'  : 'orders',
    'ObjFunc'  : Order
  };

  this._getAllHttp(_.assign(args || {}, opts), callback)
};

Client.prototype.getOrder = function(orderId, callback) {

  var opts = {
    'path'     : 'orders/' + orderId,
    'ObjFunc'  : Order
  };

  this._getOneHttp(opts, callback);
};

Client.prototype.createOrder = function(args, callback) {

  var opts = {
    'colName'  : 'orders',
    'ObjFunc' : Order,
    'params' : args
  };

  this._postOneHttp(opts, callback);
};

Client.prototype.getCheckouts = function(args, callback) {

  var opts = {
    'colName'  : 'checkouts',
    'ObjFunc'  : Checkout
  };

  this._getAllHttp(_.assign(args || {}, opts), callback)

};

Client.prototype.getCheckout = function(checkoutId, callback) {

  var opts = {
    'path'     : 'checkouts/' + checkoutId,
    'ObjFunc'  : Checkout
  };

  this._getOneHttp(opts, callback);
};

Client.prototype.createCheckout = function(args, callback) {

  var opts = {
    'colName'  : 'checkouts',
    'ObjFunc' : Checkout,
    'params' : args
  };

  this._postOneHttp(opts, callback);
};

Client.prototype.getMerchant = function(merchantId, callback) {

  var opts = {
    'path'    : 'merchants/' + merchantId,
    'ObjFunc' : Merchant
  };

  this._getOneHttp(opts, callback);
}

Client.prototype.verifyCallback = function(body, signature) {
  var verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(body);
  return verifier.verify(callback_key, signature, 'base64');
};

Client.prototype.toString = function() {
  return "Coinbase API Client for " + this.baseApiUri;
};

module.exports = Client;

