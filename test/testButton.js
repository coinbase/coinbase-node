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
var Button   = coinbase.model.Button;
var na       = require('./nockButton.js');

describe('model.Button', function(){

  describe('button constructor', function(){

    it('should return button', function(){
      var button = new Button(
        {}, 
        {'id': '999'},
        {'id': '999'}
        );
      assert(button);
    });

    it('should require constructor call', function(){
      var btn = Button(
        {}, 
        {'id': '999'},
        {'id': '999'}
        );
      assert(btn instanceof Button);
    });
    it('should require constructor args', function(){
      try {
        Button({});
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('button methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var btcAccount = new Account(client, {"id": na.ACCOUNT_1.id});

    it('should get orders', function() {
      btcAccount.getButton(na.GET_BUTTON_RESP.button.code, function(err, button) {
        assert.equal(err, null, err);
        assert(button);
        assert(button.code);

        button.getOrders(null, null, function(err, order) {
          assert.equal(err, null, err);
          assert(order);
          assert.equal(order[0].id, na.GET_ORDERS_RESP.orders[0].order.id);
        });
      });
    });

    it('should create order', function() {
      btcAccount.getButton(na.GET_BUTTON_RESP.button.code, function(err, button) {
        assert.equal(err, null, err);
        assert(button);
        assert(button.code);
        button.createOrder(function(err, order) {
          assert.equal(err, null, err);
          assert(order);
          assert.equal(order.id, na.CREATE_ORDER_RESP.order.id);
        });
      });

    });
  });
});

