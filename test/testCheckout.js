/*jslint node: true */
/*jslint unparam: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
var Account  = coinbase.model.Account;
var Checkout = coinbase.model.Checkout;
var na       = require('./nockCheckout.js');

describe('model.Checkout', function(){

  describe('checkout constructor', function(){

    it('should return checkout', function(){
      var checkout = new Checkout(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(checkout);
    });

    it('should require constructor call', function(){
      var btn = Checkout(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(btn instanceof Checkout);
    });
    it('should require constructor args', function(){
      try {
        Checkout({});
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('checkout methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});

    it('should get orders', function() {
      client.getCheckout(na.GET_CHECKOUT_RESP.data.code, function(err, checkout) {
        assert.equal(err, null, err);
        assert(checkout);

        checkout.getOrders(null, function(err, order) {
          assert.equal(err, null, err);
          assert(order);
          assert.equal(order[0].id, na.GET_ORDERS_RESP.data[0].id);
        });
      });
    });

    it('should create order', function() {
      client.getCheckout(na.GET_CHECKOUT_RESP.data.id, function(err, checkout) {
        assert.equal(err, null, err);
        assert(checkout);
        checkout.createOrder(function(err, order) {
          assert.equal(err, null, err);
          assert(order);
          assert.equal(order.id, na.CREATE_ORDER_RESP.data.id);
        });
      });

    });
  });
});

