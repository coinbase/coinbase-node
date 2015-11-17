//
// The Account object is the primary abstraction to the Conbase API.
//
"use strict";
var AccountBase = require('./AccountBase'),
    handleError = require('../errorHandler').handleError,
    Address     = require('./Address'),
    Transaction = require('./Transaction'),
    Buy         = require('./Buy'),
    Sell        = require('./Sell'),
    Deposit     = require('./Deposit'),
    Withdrawal  = require('./Withdrawal'),
    _           = require('lodash');

//
// ##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var Account = require('coinbase').model.Account;
// var myAccount = new Account(client, {'id': 'A1234'});
//```
// _normally you will get account instances from `Account` methods on the `Client`
// but this constructor is useful if you already know the id of the account and
// wish to reduce calls to the remote API._
//
// - - -
function Account(client, data) {
  if (!(this instanceof Account)) {
    return new Account(client, data);
  }
  AccountBase.call(this, client, data);
}

Account.prototype = Object.create(AccountBase.prototype);

Account.prototype.delete = function(callback) {
  var path = "accounts/" + this.id;
  this.client._deleteHttp(path, callback);
};

Account.prototype.setPrimary = function(callback) {
  var path = "accounts/" + this.id + "/primary";
  this.client._postHttp(path, null, callback);
};

Account.prototype.update = function(args, callback) {
  var self = this;
  var path = "accounts/" + this.id;
  this.client._putHttp(path, args, function myPut(err, result) {
    if (err) {
      callback(err, null);
      return;
    }
    var account = new Account(self.client, result.data);
    callback(null, account);
  });
};

//```
// args = {
//   'id' : account_id
// };
Account.prototype.getAddresses = function(args, callback) {
  var opts = {
    'colName'  : 'addresses',
    'ObjFunc'  : Address,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getAddress = function(addressId, callback) {
  var opts = {
    'colName'  : 'addresses',
    'ObjFunc'  : Address,
    'id'       : addressId
  };
  this._getOne(opts, callback)
};

// ```
// args = {
//   'name': address label, (optional)
//   'callback_url': callback_url (optional)
// };
// ```
Account.prototype.createAddress = function(args, callback) {
  var opts = {
    'colName'  : 'addresses',
    'ObjFunc'  : Address,
    'params'   : args
  };
  this._postOne(opts, callback)
};

Account.prototype.getTransactions = function(args, callback) {

  var opts = {
    'colName'  : 'transactions',
    'ObjFunc'  : Transaction,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getTransaction = function(transaction_id, callback) {

  var opts = {
    'colName' : 'transactions',
    'ObjFunc' : Transaction,
    'id'      : transaction_id
  };

  this._getOne(opts, callback);
};

//```
// args = {
//   'to'          : account_id,
//   'amount'      : amount,
//   'currency'    : currency,
//   'description' : notes
// };

Account.prototype.transferMoney = function(args, callback) {
  args.type = 'transfer';
  this._initTxn(args, callback);
};

//```
// args = {
//   'to'                 : bitcoin address or email,
//   'amount'             : amount,
//   'currency'           : currency,
//   'description'        : notes,
//   'skip_notifications' : don’t send notification emails,
//   'fee'                : transaction fee,
//   'idem'               : token to ensure idempotence
// };
Account.prototype.sendMoney = function(args, callback, twoFactorAuth) {

  var tfa = twoFactorAuth ? {'CB-2FA-Token': twoFactorAuth} : null;
  args.type = 'send';

  this._initTxn(args, callback, tfa);
};

//```
// args = {
//   'to'          : account_id,
//   'amount'      : amount,
//   'currency'    : currency,
//   'description' : notes
// };
Account.prototype.requestMoney = function(args, callback) {
  args.type = 'request';
  this._initTxn(args, callback);
};

// Buys
Account.prototype.getBuys = function(args, callback) {

  var opts = {
    'colName'  : 'buys',
    'ObjFunc'  : Buy,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getBuy = function(buy_id, callback) {

  var opts = {
    'colName'  : 'buys',
    'ObjFunc'  : Buy,
    'id'       : buy_id
  };

  this._getOne(opts, callback);
};


//```
// args = {
//   'amount'                  : amount,
//   'total'                   : total,
//   'currency'                : currency,
//   'payment_method'          : payment_method_id,
//   'agree_btc_amount_varies' : agree_btc_amount_varies,
//   'commit'                  : commit,
//   'quote'                   : quote
// };
Account.prototype.buy = function(args, callback) {

  var opts = {
    'colName'  : 'buys',
    'ObjFunc'  : Buy,
    'params'   : args
  };

  this._postOne(opts, callback)
};

// Sells
Account.prototype.getSells = function(args, callback) {

  var opts = {
    'colName'  : 'sells',
    'ObjFunc'  : Sell,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getSell = function(sell_id, callback) {

  var opts = {
    'colName'  : 'sells',
    'ObjFunc'  : Sell,
    'id'       : sell_id
  };

  this._getOne(opts, callback);
};


//```
// args = {
//   'amount'                  : amount,
//   'total'                   : total,
//   'currency'                : currency,
//   'payment_method'          : payment_method_id,
//   'agree_btc_amount_varies' : agree_btc_amount_varies,
//   'commit'                  : commit,
//   'quote'                   : quote
// };
Account.prototype.sell = function(args, callback) {

  var opts = {
    'colName'  : 'sells',
    'ObjFunc'  : Sell,
    'params'   : args
  };

  this._postOne(opts, callback)
};

// Deposits
Account.prototype.getDeposits = function(args, callback) {

  var opts = {
    'colName'  : 'deposits',
    'ObjFunc'  : Deposit,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getDeposit = function(deposit_id, callback) {

  var opts = {
    'colName'  : 'deposit',
    'ObjFunc'  : Deposit,
    'id'       : deposit_id
  };

  this._getOne(opts, callback);
};


//```
// args = {
//   'amount'                  : amount,
//   'currency'                : currency,
//   'payment_method'          : payment_method_id,
//   'commit'                  : commit,
// };
Account.prototype.deposit = function(args, callback) {

  var opts = {
    'colName'  : 'deposits',
    'ObjFunc'  : Deposit,
    'params'   : args
  };

  this._postOne(opts, callback)
};

// Withdrawals
Account.prototype.getWithdrawals = function(args, callback) {

  var opts = {
    'colName'  : 'withdrawals',
    'ObjFunc'  : Withdrawal,
  };

  this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getWithdrawal = function(withdrawal_id, callback) {

  var opts = {
    'colName'  : 'withdrawals',
    'ObjFunc'  : Withdrawal,
    'id'       : withdrawal_id
  };

  this._getOne(opts, callback);
};


//```
// args = {
//   'amount'                  : amount,
//   'currency'                : currency,
//   'payment_method'          : payment_method_id,
//   'commit'                  : commit,
// };
Account.prototype.withdraw = function(args, callback) {

  var opts = {
    'colName'  : 'withdrawals',
    'ObjFunc'  : Withdrawal,
    'params'   : args
  };

  this._postOne(opts, callback)
};

module.exports = Account;
