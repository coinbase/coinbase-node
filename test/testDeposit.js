/*jslint node: true */
/*jslint unparam: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
// var Account  = coinbase.model.Account;
var Deposit = coinbase.model.Deposit;
var na       = require('./nockDeposit.js');

describe('model.Deposit', function(){

  describe('deposit constructor', function(){

    it('should return deposit', function(){
      var deposit = new Deposit(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(deposit);
    });

    it('should require constructor call', function(){
      var deposit = Deposit(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(deposit instanceof Deposit);
    });
    it('should require constructor args', function(){
      try {
        Deposit({});
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('deposit methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});

    it('should create deposit', () => {
      const deposit = new Deposit(client, { id: na.CREATE_DEPOSIT_RESP.data.id }, {  id: na.CREATE_DEPOSIT_RESP.data.id });
      const amount = 0.25;
      const currency = 'USD';
      const paymentMethod = na.CREATE_DEPOSIT_RESP.data['payment_method'].id;
      deposit.createDeposit({
        amount,
        currency,
        paymentMethod
      }, (err, deposit) => {
        assert.equal(err, undefined);
        assert.equal(deposit.id, na.CREATE_DEPOSIT_RESP.data.id);
        assert.equal(deposit['payment_method'].id, na.CREATE_DEPOSIT_RESP.data['payment_method'].id);
        assert.equal(deposit.resource, 'deposit');
      });
    });
  });
});

