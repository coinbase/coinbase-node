var Account       = require('./lib/model/Account.js'),
    Button        = require('./lib/model/Button.js'),
    Client        = require('./lib/Client.js'),
    Contact       = require('./lib/model/Contact.js'),
    Order         = require('./lib/model/Order.js'),
    PaymentMethod = require('./lib/model/PaymentMethod.js'),
    Transaction   = require('./lib/model/Transaction.js'),
    Transfer      = require('./lib/model/Transfer.js'),
    User          = require('./lib/model/User.js');

var model = {
    'Account'       : Account,
    'Button'        : Button,
    'Contact'       : Contact,
    'Order'         : Order,
    'PaymentMethod' : PaymentMethod,
    'Transaction'   : Transaction,
    'Transfer'      : Transfer,
    'User'          : User
};

module.exports = {
  'Client' : Client,
  'model'  : model
};

