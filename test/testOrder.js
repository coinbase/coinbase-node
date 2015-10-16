/*jslint node: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
var Order    = coinbase.model.Order;
var na       = require('./nockOrder.js');

var TEST_BASE_URI = 'http://mockapi.coinbase.com/v1/';

describe('model.Order', function(){

  describe('order constructor', function(){

    it('should return order', function(){
      var order = new Order({}, {'id': '999'});
      assert(order);
    });

    it('should require constructor new call', function(){
      var o1 = Order({}, {'id': '999'});
      assert(o1 instanceof Order);
    });
    it('should require constructor args', function(){
      try {
        Order();
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });
  });

  describe('order methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var order = new Order(client, na.REFUND_RESP.data);
    it('should refund order', function() {
      var args = {};
      order.refund(args, function(err, order) {
        assert.equal(err, null, err);
        assert(order, 'no refund');
        assert(order.id);
        assert.equal(order.id, na.REFUND_RESP.data.id, 'wrong order');
        assert(order.refund_transaction.id);
        assert.equal(order.refund_transaction.id,
          na.REFUND_RESP.data.refund_transaction.id, 'no refund txn');
      });
    });
  });
});

