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

    it('should setPrimary', function() {
      btcAccount.setPrimary(function(err, result) {
        assert.equal(err, null, err);
        assert(result);
      });
    });

    it('should delete account', function() {
      usdAccount1.delete(function(err, result) {
        assert.equal(err, null, err);
      });
    });

    it('should modify account', function() {
      var args = {"name":"Killroy BTC"};
      btcAccount.update(args, function(err, account) {
        assert.equal(err, null, err);
        assert(account);
        assert.equal(account.name, na.MODIFY_ACCOUNT_RESP.data.name, "can not modify account");
      });
    });

    it('should get addresses', function() {
      btcAccount.getAddresses(null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length, na.GET_ADDRESSES_RESP.data.length,
          "can not get addresses: " + JSON.stringify(result));
      });
    });

    it('should get address', function() {
      btcAccount.getAddress(na.GET_ADDRESS_RESP.data.address, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.id, na.GET_ADDRESS_RESP.data.id,
          "can not get address: " + JSON.stringify(result));
        assert.equal(result.label, na.GET_ADDRESS_RESP.data.label,
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
        assert.equal(result.label, na.CREATE_ADDRESS_RESP.data.label,
          "can not create address: " + JSON.stringify(result));
      });
    });

    it('should get transactions', function() {
      btcAccount.getTransactions(null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length,
          na.GET_TRANSACTIONS_RESP.data.length,
          "can not get transactions: " + JSON.stringify(result));
      });
    });

    it('should get transaction', function() {
      btcAccount.getTransaction('1234', function(err, txn) {
        assert.equal(err, null, err);
        assert(txn);
        assert.equal(txn.id, na.GET_TRANSACTION_RESP.data.id,
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
        assert.equal(txn.id, na.TRANSFER_MONEY_RESP.data.id,
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
        assert.equal(txn.id, na.SEND_MONEY_RESP.data.id,
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
        assert.equal(txn.id, na.REQUEST_MONEY_RESP.data.id,
          "can not request money: " + JSON.stringify(txn));
      });
    });

    it('should get transfers', function() {
      btcAccount.getBuys(null, function(err, result) {
        assert.equal(err, null, err);
        assert(result);
        assert.equal(result.length,
          na.GET_BUYS_RESP.data.length,
          "can not get transfers: " + JSON.stringify(result));
      });
    });

    it('should buy', function() {
      var args = {
        "qty": "100"
      };
      btcAccount.buy(args, function(err, transfer) {
        assert.equal(err, null, err);
        assert(transfer);
        assert.equal(transfer.id, na.BUY_RESP.data.id,
          "can not buy: " + JSON.stringify(transfer));
      });
    });
  });
});

