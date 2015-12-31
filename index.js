var Account       = require('./lib/model/Account.js'),
    Address       = require('./lib/model/Address.js'),
    Buy           = require('./lib/model/Buy.js'),
    Checkout      = require('./lib/model/Checkout.js'),
    Client        = require('./lib/Client.js'),
    Deposit       = require('./lib/model/Deposit.js'),
    Merchant      = require('./lib/model/Merchant.js'),
    Notification  = require('./lib/model/Notification.js'),
    Order         = require('./lib/model/Order.js'),
    PaymentMethod = require('./lib/model/PaymentMethod.js'),
    Sell          = require('./lib/model/Sell.js'),
    Transaction   = require('./lib/model/Transaction.js'),
    User          = require('./lib/model/User.js'),
    Withdrawal    = require('./lib/model/Withdrawal.js');

var model = {
  'Account'       : Account,
  'Address'       : Address,
  'Buy'           : Buy,
  'Checkout'      : Checkout,
  'Deposit'       : Deposit,
  'Merchant'      : Merchant,
  'Notification'  : Notification,
  'Order'         : Order,
  'PaymentMethod' : PaymentMethod,
  'Sell'          : Sell,
  'Transaction'   : Transaction,
  'User'          : User,
  'Withdrawal'    : Withdrawal
};

module.exports = {
  'Client' : Client,
  'model'  : model
};

