/*jslint node: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
var Transfer = coinbase.model.Transfer;
var na       = require('./nockTransfer.js');

describe('model.Transfer', function(){

  describe('transfer constructor', function(){

    it('should return transfer', function(){
      var transfer = new Transfer(
        {}, 
        {'id': '999'},
        {'id': '999'}
        );
      assert(transfer);
    });
    it('should require constructor new call', function(){
      var t1 = Transfer(
        {}, 
        {'id': '999'},
        {'id': '999'}
        );
      assert(t1 instanceof Transfer);
    });
    it('should require constructor args', function(){
      try {
        Transfer();
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('transfer methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var xfer = new Transfer(client, na.XFER_1, {'id': 'A9876543210'});
    it('should commit transfer', function() {
      xfer.commit(function(err, update) {
        assert.equal(err, null, err);
        assert(update, 'no updated xfer');
      });
    });
  });
});

