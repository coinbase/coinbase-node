/*jslint node: true */
/*jslint unparam: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var coinbase = require('..');
var Client   = coinbase.Client;
var assert   = require("assert");
var na     = require('./nockClient');

describe('Client', function() {

  describe('client constructor', function() {
    it('should return client', function() {
      var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
      assert(client);
      assert.equal(client.apiKey, 'mykey');
      assert.equal(client.apiSecret, 'mysecret');
    });
    it('should require constructor new call', function(){
      var cl1 = Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
      assert(cl1 instanceof Client);
    });
    it('should require constructor args', function(){
      try {
        Client();
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

    it('should work support oauth', function() {
      var cl1 = Client({ accessToken: 'mytoken', 'baseApiUri': na.TEST_BASE_URI })
      assert.equal(cl1.accessToken, 'mytoken');
      assert(cl1 instanceof Client);
    })

    it('should support an optional refresh token', function() {
      var cl1 = Client({ accessToken: 'mytoken', refreshToken: 'refreshtoken', 'baseApiUri': na.TEST_BASE_URI })
      assert.equal(cl1.accessToken, 'mytoken');
      assert.equal(cl1.refreshToken, 'refreshtoken');
      assert(cl1 instanceof Client);
    })

    it('should throw if the we do not pass the access token or api credentials', function() {
      try {
        Client({ 'baseApiUri': na.TEST_BASE_URI })
        throw new Error('failed');
      } catch (e) {
        assert.equal(e.message, 'you must either provide an "accessToken" or the "apiKey" & "apiSecret" parameters')
      }
    })

    it('should throw if both the api key + secret and the access token is used', function() {
      try {
        Client({ 'accessToken': 'mytoken', 'apiKey': 'mykey', 'apiSecret': 'mysecret' })
        throw new Error('failed');
      } catch (e) {
        assert.equal(e.message, 'you must either provide an "accessToken" or the "apiKey" & "apiSecret" parameters')
      }
    })
  });

  describe('client methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    it('should get accounts', function() {
      client.getAccounts(function(err, accounts) {
        assert.equal(err, null, err);
        assert(accounts, "no accounts");
        assert.equal(accounts.length, 2, "wrong number of accounts");
        assert.equal(accounts[0].id, na.ACCOUNTS_ID_1,
          "wrong account id: " + accounts[0].id);
        assert.equal(accounts[1].id, na.ACCOUNTS_ID_2,
          "wrong account id: " + accounts[1].id);
      });
    });

    it('should get account', function() {
      client.getAccount(na.ACCOUNTS_ID_1, function(err, account) {
        assert.equal(err, null, err);
        assert(account, 'no account');
        assert.equal(account.id, na.ACCOUNTS_ID_1, 'wrong account');
      });
    });

    it('should create account', function() {
      var args = {
        "name": na.NEW_ACCOUNT_NAME_1
      };
      client.createAccount(args, function(err, account) {
        assert.equal(err, null, err);
        assert(account, 'no account');
        assert(account.name, 'no name');
        assert.equal(account.name, na.NEW_ACCOUNT_NAME_1, 'wrong account name');
      });
    });

    it('should get contacts', function() {
      client.getContacts(2, 9, '1234', function(err, contacts) {
        assert.equal(err, null, err);
        assert(contacts, 'no contacts');
        assert(contacts[0].email, "no email");
        assert.equal(contacts[0].email,
          na.GET_CONTACTS_RESP.contacts[0].contact.email,
          'wrong contacts: ' + contacts[0].email);
      });
    });

    it('should get current user', function() {
      client.getCurrentUser(function(err, user) {
        assert.equal(err, null, err);
        assert(user, 'no user');
        assert(user.name, "no email");
        assert.equal(user.name,
          na.GET_CURRENT_USER_RESP.user.name,
          'wrong user: ' + user.name);

      });
    });

    it('should get buy price', function() {
      client.getBuyPrice({'qty': 2, 'currency': 'USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.total.amount, "no amount");
        assert.equal(obj.total.amount,
          na.GET_BUY_PRICE_RESP.total.amount,
          'wrong amount: ' + obj.total.amount);

      });
    });

    it('should sell price', function() {
      client.getSellPrice({'qty': 3, 'currency': "USD"}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.subtotal.amount, "no amount");
        assert.equal(obj.subtotal.amount,
          na.GET_SELL_PRICE_RESP.subtotal.amount,
          'wrong amount: ' + obj.subtotal.amount);
      });
    });

    it('should spot price', function() {
      client.getSpotPrice(null, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.amount, "no amount");
        assert.equal(obj.amount,
          na.GET_SPOT_RESP.amount,
          'wrong amount: ' + obj.amount);
      });

    });

    it('should get supported currencies', function() {
      client.getCurrencies(function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no currencies');
        assert.equal(obj.length,
          na.GET_CURRENCIES_RESP.length,
          'wrong number of currencies: ' + obj.length);
      });
    });

    it('should get exchange rates', function() {
      client.getExchangeRates(function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no rates');
        assert(obj.zwl_to_btc, "no rate");
        assert.equal(obj.zwl_to_btc,
          na.GET_EX_RATES_RESP.zwl_to_btc,
          'wrong rate: ' + obj.zwl_to_btc);
      });
    });

    it('should create user', function() {
      var args = {
        "user": {
          "email": "newuser@example.com",
          "password": "test123!"
        }
      };
      client.createUser(args, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no obj');
        assert(obj.user, 'no user');
        assert(obj.user.email, "no email");
        assert.equal(obj.user.email,
          na.CREATE_USER_RESP.user.email,
          'wrong user: ' + obj.user.email);
      });
    });

    it('should get payment methods', function() {
      client.getPaymentMethods(function(err, pms) {
        assert.equal(err, null, err);
        assert(pms, 'no payment methods');
        assert.equal(pms.length,
          na.GET_PAYMENT_METHODS_RESP.payment_methods.length,
          'wrong number of methods: ' + pms.length);
      });
    });

    it('should get payment method', function() {
      client.getPaymentMethod(na.GET_PAYMENT_METHOD_RESP.payment_method.id,
        function(err, pm) {
        assert.equal(err, null, err);
        assert(pm, 'no payment method');
        assert.equal(pm.id, na.GET_PAYMENT_METHOD_RESP.payment_method.id,
          'wrong payment method');
      });
    });
  });
});
