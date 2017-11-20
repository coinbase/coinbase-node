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
  return this.client._deleteHttp(path, callback);
};

Account.prototype.setPrimary = function(callback) {
  var path = "accounts/" + this.id + "/primary";
  return this.client._postHttp(path, null, callback);
};

Account.prototype.update = function(args, callback) {
  var self = this;
  var path = "accounts/" + this.id;

  return this._createPromise(function (resolve, reject) {
    self.client._putHttp(path, args, function onPut(err, result) {
      if (!handleError(err, result, reject)) {
        var account = new Account(self.client, result.data);
        resolve([account]);
      }
    });
  }, callback);
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

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getAddress = function(addressId, callback) {
  var opts = {
    'colName'  : 'addresses',
    'ObjFunc'  : Address,
    'id'       : addressId
  };
  return this._getOne(opts, callback)
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
  return this._postOne(opts, callback)
};

Account.prototype.getTransactions = function(args, callback) {

  var opts = {
    'colName'  : 'transactions',
    'ObjFunc'  : Transaction,
  };

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getTransaction = function(transaction_id, callback) {

  var opts = {
    'colName' : 'transactions',
    'ObjFunc' : Transaction,
    'id'      : transaction_id
  };

  return this._getOne(opts, callback);
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
  return this._initTxn(args, callback);
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

  return this._initTxn(args, callback, tfa);
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
  return this._initTxn(args, callback);
};

// Buys
Account.prototype.getBuys = function(args, callback) {

  var opts = {
    'colName'  : 'buys',
    'ObjFunc'  : Buy,
  };

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getBuy = function(buy_id, callback) {

  var opts = {
    'colName'  : 'buys',
    'ObjFunc'  : Buy,
    'id'       : buy_id
  };

  return this._getOne(opts, callback);
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

  return this._postOne(opts, callback)
};

// Sells
Account.prototype.getSells = function(args, callback) {

  var opts = {
    'colName'  : 'sells',
    'ObjFunc'  : Sell,
  };

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getSell = function(sell_id, callback) {

  var opts = {
    'colName'  : 'sells',
    'ObjFunc'  : Sell,
    'id'       : sell_id
  };

  return this._getOne(opts, callback);
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

  return this._postOne(opts, callback)
};

// Deposits
Account.prototype.getDeposits = function(args, callback) {

  var opts = {
    'colName'  : 'deposits',
    'ObjFunc'  : Deposit,
  };

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getDeposit = function(deposit_id, callback) {

  var opts = {
    'colName'  : 'deposit',
    'ObjFunc'  : Deposit,
    'id'       : deposit_id
  };

  return this._getOne(opts, callback);
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

  return this._postOne(opts, callback)
};

// Withdrawals
Account.prototype.getWithdrawals = function(args, callback) {

  var opts = {
    'colName'  : 'withdrawals',
    'ObjFunc'  : Withdrawal,
  };

  return this._getAll(_.assign(args || {}, opts), callback)
};

Account.prototype.getWithdrawal = function(withdrawal_id, callback) {

  var opts = {
    'colName'  : 'withdrawals',
    'ObjFunc'  : Withdrawal,
    'id'       : withdrawal_id
  };

  return this._getOne(opts, callback);
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

  return this._postOne(opts, callback)
};

module.exports = Account;
