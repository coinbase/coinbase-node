/*jslint node: true */
/*jslint unparam: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert      = require("assert"),
    coinbase    = require('..'),
    Client      = coinbase.Client,
    Transaction = coinbase.model.Transaction,
    etypes      = require('../lib/errorTypes.js'),
    na          = require('./nockErrors');

describe('Error Handling', function(){

  var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});

  describe('Http Errors', function() {

    var txn1 = new Transaction(client, na.TXN_1, {'id': na.TXN_1.id});
    it('should get TwoFactorTokenRequired error', function() {
      txn1.complete(function(err, txn) {
        assert(err);
        assert.equal(err.type, etypes.TwoFactorTokenRequired, err.type);
      });
    });
    var txn2 = new Transaction(client, na.TXN_2, {'id': na.TXN_2.id});
    it('should get InvalidAccessToken error', function() {
      txn2.complete(function(err, txn) {
        assert(err);
        assert.equal(err.type, etypes.InvalidAccessToken, err.type);
      });
    });
    var txn3 = new Transaction(client, na.TXN_3, {'id': na.TXN_3.id});
    it('should get ExpiredAccessToken error', function() {
      txn3.complete(function(err, txn) {
        assert(err);
        assert.equal(err.type, etypes.ExpiredAccessToken, err.type);
      });
    });
    var txn4 = new Transaction(client, na.TXN_4, {'id': na.TXN_4.id});
    it('should get AuthenticationError error', function() {
      txn4.complete(function(err, txn) {
        assert(err);
        assert.equal(err.type, etypes.AuthenticationError, err.type);
      });
    });
  });
});

