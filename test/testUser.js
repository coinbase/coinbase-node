/*jslint node: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
var User     = coinbase.model.User;
var na     = require('./nockUser.js');

describe('model.User', function(){

  describe('user constructor', function(){

    it('should return user', function(){
      var user = new User({}, {'id': '999'});
      assert(user);
    });
    it('should require constructor new call', function(){
      var u1 = User({}, {'id': '999'});
      assert(u1 instanceof User);
    });
    it('should require constructor args', function(){
      try {
        User();
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('user methods', function() {

    var client = new Client({'apiKey': 'mykey', 'apiSecret': 'mysecret', 'baseApiUri': na.TEST_BASE_URI});
    var user = new User(client, na.USER_1);
    it('should modify user', function() {
      var args = {
        "native_currency": "CAD"
      };
      assert.equal(na.USER_1.native_currency, 'USD', 'not correct start currency');
      assert.equal(user.native_currency, 'USD', 'not correct currency');
      user.update(args, function(err, update) {
        assert.equal(err, null, err);
        assert(update, 'no updated user');
        assert.equal(update.native_currency, 'CAD', 'not updated');
      });
    });

  });
});

