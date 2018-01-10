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
      var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI, 'timeout': 30000});
      assert(client);
      assert.equal(client.apiKey, 'mykey');
      assert.equal(client.apiSecret, 'mysecret');
      assert.equal(client.timeout, 30000);
    });
    it('should has default option values', function() {
        var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret'});
        assert(client);
        assert.equal(client.timeout, 5000);
        assert.equal(client.baseApiUri, 'https://api.coinbase.com/v2/');
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
      client.getAccounts({}, function(err, accounts) {
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

    it('should get current user', function() {
      client.getCurrentUser(function(err, user) {
        assert.equal(err, null, err);
        assert(user, 'no user');
        assert(user.name, "no email");
        assert.equal(user.name,
          na.GET_CURRENT_USER_RESP.data.name,
          'wrong user: ' + user.name);

      });
    });

    it('should get buy price (undefined)', function() {
      client.getBuyPrice({}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get buy price (USD)', function() {
      client.getBuyPrice({currency: 'USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get buy price (BTC-USD)', function() {
      client.getBuyPrice({currencyPair: 'BTC-USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get sell price (undefined)', function() {
      client.getSellPrice({}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get sell price (USD)', function() {
      client.getSellPrice({currency: 'USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get sell price (BTC-USD)', function() {
      client.getSellPrice({currencyPair: 'BTC-USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_BUY_PRICE_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get spot price (undefined)', function() {
      client.getSpotPrice({}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_SPOT_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get spot price (USD)', function() {
      client.getSpotPrice({currency: 'USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_SPOT_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
      });
    });

    it('should get spot price (BTC-USD)', function() {
      client.getSpotPrice({currencyPair: 'BTC-USD'}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no price');
        assert(obj.data.amount, 'no amount');
        assert.equal(obj.data.amount,
          na.GET_SPOT_RESP.data.amount,
          'wrong amount: ' + obj.data.amount);
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
      client.getExchangeRates({}, function(err, obj) {
        assert.equal(err, null, err);
        assert(obj, 'no rates');
        assert(obj.data.rates, "no rate");
        assert.equal(obj.data.rates.AED,
          na.GET_EX_RATES_RESP.data.rates.AED,
          'wrong rate: ' + obj.data.rates.AED);
      });
    });

    it('should get payment methods', function() {
      client.getPaymentMethods({}, function(err, pms) {
        assert.equal(err, null, err);
        assert(pms, 'no payment methods');
        assert.equal(pms.length,
          na.GET_PAYMENT_METHODS_RESP.data.length,
          'wrong number of methods: ' + pms.length);
      });
    });

    it('should get payment method', function() {
      client.getPaymentMethod(na.GET_PAYMENT_METHOD_RESP.data.id,
        function(err, pm) {
        assert.equal(err, null, err);
        assert(pm, 'no payment method');
        assert.equal(pm.id, na.GET_PAYMENT_METHOD_RESP.data.id,
          'wrong payment method');
      });
    });

    it('should verify a legitimate merchant callback', function() {
      var body = '{"order":{"id":null,"created_at":null,"status":"completed","event":null,"total_btc":{"cents":100000000,"currency_iso":"BTC"},"total_native":{"cents":1000,"currency_iso":"USD"},"total_payout":{"cents":1000,"currency_iso":"USD"},"custom":"123456789","receive_address":"mzVoQenSY6RTBgBUcpSBTBAvUMNgGWxgJn","button":{"type":"buy_now","name":"Test Item","description":null,"id":null},"transaction":{"id":"53bdfe4d091c0d74a7000003","hash":"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b","confirmations":0}}}';
      var signature = "6yQRl17CNj5YSHSpF+tLjb0vVsNVEv021Tyy1bTVEQ69SWlmhwmJYuMc7jiDyeW9TLy4vRqSh4g4YEyN8eoQIM57pMoNw6Lw6Oudubqwp+E3cKtLFxW0l18db3Z/vhxn5BScAutHWwT/XrmkCNaHyCsvOOGMekwrNO7mxX9QIx21FBaEejJeviSYrF8bG6MbmFEs2VGKSybf9YrElR8BxxNe/uNfCXN3P5tO8MgR5wlL3Kr4yq8e6i4WWJgD08IVTnrSnoZR6v8JkPA+fn7I0M6cy0Xzw3BRMJAvdQB97wkobu97gFqJFKsOH2u/JR1S/UNP26vL0mzuAVuKAUwlRn0SUhWEAgcM3X0UCtWLYfCIb5QqrSHwlp7lwOkVnFt329Mrpjy+jAfYYSRqzIsw4ZsRRVauy/v3CvmjPI9sUKiJ5l1FSgkpK2lkjhFgKB3WaYZWy9ZfIAI9bDyG8vSTT7IDurlUhyTweDqVNlYUsO6jaUa4KmSpg1o9eIeHxm0XBQ2c0Lv/T39KNc/VOAi1LBfPiQYMXD1e/8VuPPBTDGgzOMD3i334ppSr36+8YtApAn3D36Hr9jqAfFrugM7uPecjCGuleWsHFyNnJErT0/amIt24Nh1GoiESEq42o7Co4wZieKZ+/yeAlIUErJzK41ACVGmTnGoDUwEBXxADOdA=";
      assert(client.verifyCallback(body, signature))
    });

    it('should reject a tampered-with merchant callback', function() {
      var body = '{"order":{"id":null,"created_at":null,"status":"completed","event":null,"total_btc":{"cents":1000000000,"currency_iso":"BTC"},"total_native":{"cents":1000,"currency_iso":"USD"},"total_payout":{"cents":1000,"currency_iso":"USD"},"custom":"123456789","receive_address":"mzVoQenSY6RTBgBUcpSBTBAvUMNgGWxgJn","button":{"type":"buy_now","name":"Test Item","description":null,"id":null},"transaction":{"id":"53bdfe4d091c0d74a7000003","hash":"4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b","confirmations":0}}}';
      var signature = "6yQRl17CNj5YSHSpF+tLjb0vVsNVEv021Tyy1bTVEQ69SWlmhwmJYuMc7jiDyeW9TLy4vRqSh4g4YEyN8eoQIM57pMoNw6Lw6Oudubqwp+E3cKtLFxW0l18db3Z/vhxn5BScAutHWwT/XrmkCNaHyCsvOOGMekwrNO7mxX9QIx21FBaEejJeviSYrF8bG6MbmFEs2VGKSybf9YrElR8BxxNe/uNfCXN3P5tO8MgR5wlL3Kr4yq8e6i4WWJgD08IVTnrSnoZR6v8JkPA+fn7I0M6cy0Xzw3BRMJAvdQB97wkobu97gFqJFKsOH2u/JR1S/UNP26vL0mzuAVuKAUwlRn0SUhWEAgcM3X0UCtWLYfCIb5QqrSHwlp7lwOkVnFt329Mrpjy+jAfYYSRqzIsw4ZsRRVauy/v3CvmjPI9sUKiJ5l1FSgkpK2lkjhFgKB3WaYZWy9ZfIAI9bDyG8vSTT7IDurlUhyTweDqVNlYUsO6jaUa4KmSpg1o9eIeHxm0XBQ2c0Lv/T39KNc/VOAi1LBfPiQYMXD1e/8VuPPBTDGgzOMD3i334ppSr36+8YtApAn3D36Hr9jqAfFrugM7uPecjCGuleWsHFyNnJErT0/amIt24Nh1GoiESEq42o7Co4wZieKZ+/yeAlIUErJzK41ACVGmTnGoDUwEBXxADOdA=";
      assert(!client.verifyCallback(body, signature))
    });
  });
});
