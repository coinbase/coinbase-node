/*jslint node: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert      = require("assert");
var coinbase    = require('..');
var Client      = coinbase.Client;
var Transaction = coinbase.model.Transaction;
var na          = require('./nockTransaction');

describe('model.Transaction', function(){

  describe('transaction constructor', function(){

    it('should return transaction', function(){
      var transaction = new Transaction(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(transaction);
    });

    it('should require constructor new call', function(){
      var t1 = Transaction(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(t1 instanceof Transaction);
    });
    it('should require constructor args', function(){
      try {
        Transaction({}, {});
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });
  });

  describe('transaction methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var txn = new Transaction(client, na.TXN_1, {'id': 'A1234'});
    it('should resend transaction', function() {
      txn.resend(function(err, res) {
        assert.equal(err, null, err);
      });
    });

    it('should complete transaction', function() {
      txn.complete(function(err, txn) {
        assert.equal(err, null, err);
        assert(txn, 'no txn');
        assert(txn.id, 'no txn id');
        assert.equal(txn.id, na.COMPLETE_RESP.data.id,
          'wrong txn id');
        assert.equal(txn.status, 'pending', 'wrong txn status');
      });
    });

    it('should cancel transaction', function() {
      txn.cancel(function(err, res) {
        assert.equal(err, null, err);
      });
    });
  });
});

