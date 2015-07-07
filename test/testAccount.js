/*jslint node: true */
/*global describe:true*/
/*jslint unparam:true*/
/*jslint todo:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var coinbase = require('..');
var Client   = coinbase.Client;
var Account  = coinbase.model.Account;
var assert   = require("assert");
var na = require('./nockAccount.js');

describe('model.Account', function(){

  describe('account constructor', function(){

    it('should return account', function(){
      var account = new Account({}, {'id': '999'});
      assert(account);
    });

    it('should require constructor call', function(){
      var acct = Account({}, {'id': '999'});
      assert(acct instanceof Account);
    });

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});

    it('instantiate account from ID', function() {
      var account = new Account(client, {"id": na.ACCOUNT_2.id});
      assert(account);
      account.getBalance(function(err, balance) {
        assert.equal(err, null, err);
        assert(balance);
        assert.equal(balance.amount, na.ACCOUNT_2.balance.amount, 
          "wrong balance");
      });
    });

    it('should require constructor args', function(){
      try {
        Account({});
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('account methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var btcAccount = new Account(client, {"id": na.ACCOUNT_1.id});
    var usdAccount1 = new Account(client, {"id": na.ACCOUNT_3.id});

    it('should get balance', function() {
      btcAccount.getBalance(function(err, balance) {
        assert.equal(err, null, err);
        assert(balance);
        assert.equal(balance.amount, na.ACCOUNT_1.balance.amount, "wrong balance");
        assert.equal(balance.currency, na.ACCOUNT_1.balance.currency,
          "wrong currency");
      });
    });

    it('should setPrimary', function() {
      btcAccount.setPrimary(function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.success, true, "can not set primary");
      });
    });

    it('should delete account', function() {
      usdAccount1.delete(function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.success, true, "can not delete account");
      });
    });

    it('should modify account', function() {
      var args = {"name":"Killroy BTC"};
      btcAccount.modify(args, function(err, account) {
        assert.equal(err, null, err);
        assert(account);
        assert.equal(account.name, na.MODIFY_ACCOUNT_RESP.account.name, "can not modify account");
      });
    });

    it('should get addresses', function() {
      btcAccount.getAddresses(null, null, null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.addresses.length, na.GET_ADDRESSES_RESP.addresses.length,
          "can not get addresses: " + JSON.stringify(result));
      });
    });

    //BROKEN against production when adding query TODO
    it('should get addresses with params', function() {
      btcAccount.getAddresses(1, null, "moLxGrqWNcnGq4A8Caq8EGP4n9GUGWanj4", 
        function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.addresses.length, na.GET_ADDRESSES_RESP.addresses.length,
          "can not get addresses: " + JSON.stringify(result));
      });
    });

    it('should get address', function() {
      btcAccount.getAddress(function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.address.id, na.GET_ADDRESS_RESP.address.id, 
          "can not get address: " + JSON.stringify(result));
        assert.equal(result.address.label, na.GET_ADDRESS_RESP.address.label,
          "can not get address: " + JSON.stringify(result));
      });
    });

    it('should create address', function() {
      var args = {
          "callback_url": "http://www.example.com/callback",
          "label": "Dalmation donations"
      };
      btcAccount.createAddress(args, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.address.label, na.CREATE_ADDRESS_RESP.address.label,
          "can not create address: " + JSON.stringify(result));
      });
    });

    it('should get transactions', function() {
      btcAccount.getTransactions(null, null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length, 
          na.GET_TRANSACTIONS_RESP.transactions.length,
          "can not get transactions: " + JSON.stringify(result));
      });
    });

    it('should get transaction', function() {
      btcAccount.getTransaction('1234', function(err, txn) {
        assert.equal(err, null, err);
        assert(txn);
        assert.equal(txn.id, na.GET_TRANSACTION_RESP.transaction.id,
          "can not get txn: " + JSON.stringify(txn));
      });
    });

    it('should transfer money', function() {
      var args = {
        "to": "5011f33df8182b142400000a",
        "amount": "1.234",
        "notes": "Sample transaction for you"
      };
      btcAccount.transferMoney(args, function(err, txn) {
        assert.equal(err, null, err);
        assert(txn);
        assert.equal(txn.id, na.TRANSFER_MONEY_RESP.transaction.id,
          "can not transfer money: " + JSON.stringify(txn));
      });
    });

    it('should send money', function() {
      var args = {
        "to": "user1@example.com",
        "amount": "1.234",
        "notes": "Sample transaction for you"
      };
      btcAccount.sendMoney(args, function(err, txn) {
        assert.equal(err, null, err);
        assert(txn);
        assert.equal(txn.id, na.SEND_MONEY_RESP.transaction.id,
          "can not send money: " + JSON.stringify(txn));
      });
    });

    it('should request money', function() {
      var args = {
        "from": "user1@example.com",
        "amount": "1.234",
        "notes": "Sample transaction for you"
      };
      btcAccount.requestMoney(args, function(err, txn) {
        assert.equal(err, null, err);
        assert(txn);
        assert.equal(txn.id, na.REQUEST_MONEY_RESP.transaction.id,
          "can not request money: " + JSON.stringify(txn));
      });
    });

    it('should get transfers', function() {
      btcAccount.getTransfers(null, null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length, 
          na.GET_TRANSFERS_RESP.transfers.length,
          "can not get transfers: " + JSON.stringify(result));
      });
    });

    it('should get transfer', function() {
      btcAccount.getTransfer('9901234', function(err, xfer) {
        assert.equal(err, null, err);
        assert(xfer);
        assert.equal(xfer.id, na.GET_TRANSFER_RESP.transfer.id,
          "can not get xfer: " + JSON.stringify(xfer));
      });
    });

    it('should get button', function() {
      btcAccount.getButton(na.GET_BUTTON_RESP.button.code, function(err, button) {
        assert.equal(err, null, err);
        assert(button);
        assert.equal(button.code, na.GET_BUTTON_RESP.button.code,
          "can not get button: " + JSON.stringify(button));
      });
    });

    it('should create button', function() {
      var args = {
        "name": "test",
        "type": "buy_now",
        "subscription": false,
        "price_string": "1.23",
        "price_currency_iso": "USD",
        "custom": "Order123",
        "callback_url": "http://www.example.com/my_custom_button_callback",
        "description": "Sample description",
        "style": "custom_large",
        "include_email": true
      };
      btcAccount.createButton(args, function(err, button) {
        assert.equal(err, null, err);
        assert(button);
        assert.equal(button.code, na.CREATE_BUTTON_RESP.button.code,
          "can not create button: " + JSON.stringify(button));
      });
    });

    it('should get orders', function() {
      btcAccount.getOrders(null, null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length, 
          na.GET_ORDERS_RESP.orders.length,
          "can not get orders: " + JSON.stringify(result));
      });
    });

    it('should get order', function() {
      btcAccount.getOrder('A9901234', function(err, order) {
        assert.equal(err, null, err);
        assert(order);
        assert.equal(order.id, na.GET_ORDER_RESP.order.id,
          "can not get xfer: " + JSON.stringify(order));
      });
    });

    it('should create order', function() {
      var args = {
        "name": "test",
        "type": "buy_now",
        "price_string": "1.23",
        "price_currency_iso": "USD"
      };
      btcAccount.createOrder(args, function(err, order) {
        assert.equal(err, null, err);
        assert(order);
        assert.equal(order.id, na.CREATE_ORDER_RESP.order.id,
          "can not create order: " + JSON.stringify(order));
      });
    });

    it('should buy', function() {
      var args = {
        "qty": "100"
      };
      btcAccount.buy(args, function(err, transfer) {
        assert.equal(err, null, err);
        assert(transfer);
        assert.equal(transfer.id, na.BUY_RESP.transfer.id,
          "can not buy: " + JSON.stringify(transfer));
      });
    });

    it('should sell', function() {
      var args = {
        "qty": "12"
      };
      btcAccount.sell(args, function(err, transfer) {
        assert.equal(err, null, err);
        assert(transfer);
        assert.equal(transfer.id, na.BUY_RESP.transfer.id,
          "can not sell: " + JSON.stringify(transfer));
      });
    });
  });
});

