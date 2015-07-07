"use strict";
var ClientBase    = require('./ClientBase'),
    request       = require("request"),
    etypes        = require('./errorTypes'),
    handleError   = require('./errorHandler').handleError,
    Account       = require("./model/Account"),
    Contact       = require("./model/Contact"),
    PaymentMethod = require("./model/PaymentMethod"),
    User          = require("./model/User"),
    crypto        = require("crypto"),
    _             = require("lodash"),
    qs            = require("querystring"),
    assign        = require("object-assign");

//##CONSTRUCTOR
//
//  Arg `apiKey` is optional. See [Coinbase Auth API](https://coinbase.com/settings/api).
//
//  Arg `apiSecret` is optional.  See [Coinbase Auth API](https://coinbase.com/settings/api).
//
//  Arg `accessToken` is optional and is part of the Oauth2 authentication flow. See [Coinbase Auth API](https://coinbase.com/settings/api).
//
//  Arg `refreshToken` is optional and is part of the Oauth2 authentication flow. See [Coinbase Auth API](https://coinbase.com/settings/api).
//
//  Arg `baseApiUrl` is optional and defaults to https://api.coinbase.com/v1/.
//
//  Arg `tokenUrl` is optional and defaults to https://api.coinbase.com/oauth/token.
//
//```
// // API Key
// opts = {
//   'apiKey'       : '1234567890',
//   'apiSecret'    : 'ABCDEFGHIJKLMNO',
//   'baseApiUri'   : 'https://api.sandbox.coinbase.com/v1/'
// };
// var Client = require('coinbase').Client;
// var myClient = new Client(args);
//
// // or OAuth2
// opts = {
//   'accessToken'  : '739ec1b8688cae5eb54629cca39',
//   'refreshToken' : '6beb21fe4066b92a2'
//   'baseApiUri'   : 'https://api.sandbox.coinbase.com/v1/',
//   'tokenUri'     : 'https://api.sandbox.coinbase.com/oauth/token',
// };
// var Client = require('coinbase').Client;
// var myClient = new Client(args);
//```
// - - -
function Client(opts) {

  if (!(this instanceof Client)) {
    return new Client(opts);
  }
  ClientBase.call(this, opts);
}

Client.prototype = Object.create(ClientBase.prototype);

//## refresh
// Attempt to refresh the current access token / refresh token pair.
//
//```
//myClient.refresh(function(err, result) {
//  // look at the result, possibly the 'expires_in' field
//}
//```
// returns oauth properties from the server and updates accessToken and refreshToken
// for this client instance.
//
//```
//{
//  "access_token": "b9cc7b786a3fece45ccb30cd61938273ee0f5fd1a04ef929a1d327f31401eec3",
//  "token_type": "bearer",
//  "expires_in": 7200,
//  "refresh_token": "c8bf774c2ad52e1cfe6bda7dfe2c5d79ddf9f6e1cebbbd3bce4df793e3e14720",
//  "scope":"user"
//}
//```
//
Client.prototype.refresh = function (callback) {
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

//## getAccounts
// returns an array of `Account` instances
//
//```
//myClient.getAccounts(function(err, accounts) {
//  // do something with the array of accounts
//});
//```
//
// [See Coinbase list-accounts API Documentation](https://developers.coinbase.com/api#list-accounts)
// - - -
Client.prototype.getAccounts = function (callback) {

  var self = this;
  this._getHttp("accounts", null, function onGet(err, obj) {
    if (!handleError(err, obj, null, callback)) {
      var accounts = _.map(obj.accounts,
        function(a) { return new Account(self, a); });
      callback(null, accounts);
    }
  });
};

//## getAccount
// returns an `Account` object associated with an id.
//
//```
//myClient.getAccount('AO1234', function(err, account) {
//  // process account
//});
//```
// _arg account_id is required_
//
// [See Coinbase show-an-account API Documentation](https://developers.coinbase.com/api#show-an-account)
// - - -
Client.prototype.getAccount = function (account_id, callback) {

  var opts = {
    'path'     : 'accounts/' + account_id,
    'typeName' : 'account',
    'ObjFunc'  : Account
  };
  this._getOneHttp(opts, callback);
};

//## createAccount
// returns a new `Account` object.
//
//```
//var args = {
//             "name": "My New BTC Account"
//           };
//myClient.createAccount(args, function(err, account) {
//  // process account
//});
//```
// _arg account_id is required_
//
// [See Coinbase create-an-account API Documentation](https://developers.coinbase.com/api#create-an-account)
// - - -
Client.prototype.createAccount = function (args, callback) {

  var opts = {
    'colName'  : 'accounts',
    'typeName' : 'account',
    'ObjFunc' : Account,
    'args' : args
  };

  this._postOneHttp(opts, callback);
};

//## getContacts
// returns an array of `Contact` instances
//
//```
//myClient.getContacts(1, 25, null, function(err, contacts) {
//  // do something with the array of contacts
//});
//```
//
// _args `page` and `limit` optional but recommended.  If you request
// page 1 of size 10 and get an array of size 10, you should request page
// 2 next.  If page 2 returns 3 items or any count smaller than `limit`, you
// have all the results._
//
// _The query arg is optional.  see the API doc for more information to filter
// the results of this call._
// [See Coinbase contacts API Documentation](https://developers.coinbase.com/api#contacts)
//
// - - -
Client.prototype.getContacts = function (page, limit, query, callback) {
  var opts = {
    'colName'  : 'contacts',
    'typeName' : 'contact',
    'ObjFunc'  : Contact,
    'page'     : page,
    'limit'    : limit,
    'query'    : query
  };
  this._getAllHttp(opts, callback);
};

//## getCurrentUser
// returns the current `User` object.
//
//```
//myClient.getCurrentUser(function(err, user) {
//  // process user
//});
//```
//
// [See Coinbase get-current-user API Documentation](https://developers.coinbase.com/api#get-current-user)
// - - -
Client.prototype.getCurrentUser = function (callback) {

  var opts = {
    'path'     : 'users/self',
    'typeName' : 'user',
    'ObjFunc'  : User
  };

  this._getOneHttp(opts, callback);
};

//## getBuyPrice
// returns the buy price for the quantity specified
//
//```
//myClient.getBuyPrice({"qty": 10, "currency": "USD"}, function(err, result) {
//  // process result
//});
//```
//
// [See Coinbase get-the-buy-price-for-bitcoin API Documentation](https://developers.coinbase.com/api#get-the-buy-price-for-bitcoin)
// - - -
Client.prototype.getBuyPrice = function (params, callback) {

  this._getOneHttp({'path': 'prices/buy', 'params': params}, callback);
};

//## getSellPrice
// returns the sell price for the quantity specified
//
//```
//myClient.getSellPrice({"qty": 10, "currency": "USD"}, function(err, result) {
//  // process result
//});
//```
//
// [See Coinbase get-the-sel-price API Documentation](https://developers.coinbase.com/api#get-the-sell-price)
// - - -
Client.prototype.getSellPrice = function (params, callback) {

  this._getOneHttp({'path': 'prices/sell', 'params': params}, callback);
};

//## getSpotPrice
// returns the spot price for the quantity specified
//
//```
//myClient.getSpotPrice({"qty": 10, "currency": "USD"}, function(err, result) {
//  // process result
//});
//```
//
// [See Coinbase get-the-spot-price-of-bitcoin API Documentation](https://developers.coinbase.com/api#get-the-spot-price-of-bitcoin)
// - - -
Client.prototype.getSpotPrice = function (params, callback) {

  this._getOneHttp({'path': 'prices/spot_rate', 'params': params} , callback);
};

//## getCurrencies
// returns an array of currency IDs.
//
//```
//myClient.getCurrencies(function(err, currencies) {
//  // do something with the array of IDs
//});
//```
//
// [See Coinbase currencies API Documentation](https://developers.coinbase.com/api#currencies)
// - - -
Client.prototype.getCurrencies = function (callback) {

  this._getOneHttp({'path': 'currencies'}, callback);
};

//## getExchangeRates
// returns an map of exchange rates.
//
//```
//myClient.getExchangeRates(function(err, rates) {
//  // do something with `rates.zwl_to_btc`, or whatever rate you are looking for
//});
//```
//
// [See Coinbase list-exchange-rates-between-btc-and-other-currencies API Documentation](https://developers.coinbase.com/api#list-exchange-rates-between-btc-and-other-currencies)
// - - -
Client.prototype.getExchangeRates = function (callback) {

  this._getOneHttp({'path': 'currencies/exchange_rates'}, callback);
};

//## createUser
// returns a new `User` object.
//
//```
//var args = {
//             "email": "newuser@example.com",
//             "password": "secret123!"
//           };
//myClient.createUser(args, function(err, user) {
//  // process user
//});
//```
//
// [See Coinbase create-a-new-user API Documentation](https://developers.coinbase.com/api#create-a-new-user)
// - - -
Client.prototype.createUser = function (args, callback) {
  //note: does not return 'User' obj, but rather the entire body due
  //to the optional receive_address in the root of the body

  this._postOneHttp({'colName': 'users', 'args': args}, callback);
};

//## getPaymentMethods
// returns an array of `PaymentMethod` instances
//
//```
//myClient.getPaymentMethods(function(err, methods) {
//  // do something with the array of payment methods
//});
//```
//
// - - -
// [See Coinbase payment-methods API Documentation](https://developers.coinbase.com/api#payment-methods)
// - - -
Client.prototype.getPaymentMethods = function (callback) {

  var opts = {
    'colName'  : 'payment_methods',
    'typeName' : 'payment_method',
    'ObjFunc'  : PaymentMethod
  };

  this._getAllHttp(opts, callback);
};

//## getPaymentMethod
// returns a `PaymentMethod` object.
//
// arg `method_id` is required.
//
//```
//myClient.createUser('PM1234', function(err, method) {
//  // process payment method
//});
//```
//
// [See Coinbase show-a-payment-method API Documentation](https://developers.coinbase.com/api#show-a-payment-method)
// - - -
Client.prototype.getPaymentMethod = function (method_id, callback) {

  var opts = {
    'path'     : 'payment_methods/' + method_id,
    'typeName' : 'payment_method',
    'ObjFunc'  : PaymentMethod
  };

  this._getOneHttp(opts, callback);
};

Client.prototype.toString = function () {
  return "Coinbase API Client for " + this.baseApiUri;
};

module.exports = Client;

