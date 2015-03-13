//
// The AccountBase object has helper methods for the Account API
//
"use strict";
var BaseModel   = require('./BaseModel'),
    handleError = require('../errorHandler').handleError,
    Transaction = require('./Transaction'),
    Transfer    = require('./Transfer'),
    _           = require('lodash');

//
// Constructor
//
// You must instantiate an 'Account' with the 'new' operator.
// ```
// new Acccount(c,d)
// ```
// 'client' and 'data' arguments are requried.
//
function AccountBase(client, data) {
  if (!(this instanceof AccountBase)) {
    return new AccountBase(client, data);
  }
  BaseModel.call(this, client, data);
}

AccountBase.prototype = Object.create(BaseModel.prototype);

// INTERNAL API
//
// ```
// opts = {
//   'colName'  : colName,
//   'typeName' : typeName,
//   'ObjFunc'  : ObjFunc,
//   'page'     : page,
//   'limit'    : limit
// };
// ```
//
AccountBase.prototype._getAll = function(opts, callback, headers) {
  var self = this;
  var args = {"account_id": this.id};
  if (this.hasField(opts, 'page')) {
    args.page = opts.page;
  }
  if (this.hasField(opts, 'limit')) {
    args.limit = opts.limit;
  }
  if (this.hasField(opts, 'query')) {
    args.query = opts.query;
  }
  this.client._getHttp(opts.colName, args, function onGet(err, result) {
    if (!handleError(err, result, opts.colName, callback)) {
      var objs = _.map(result[opts.colName],
        function onMap(obj) { return new opts.ObjFunc(self.client, obj[opts.typeName], self); });
      callback(null, objs);
    }
  }, headers);
};

// INTERNAL API
//
// ```
// opts = {
//   'colName': colName,
//   'typeName': typeName,
//   'ObjFunc': ObjFunc,
//   'id': id
// };
// ```
// 
AccountBase.prototype._getOne = function(opts, callback, headers) {
  var self = this;
  var path = opts.colName + '/' + opts.id;
  var args = {"account_id": this.id};
  this.client._getHttp(path, args, function onGet(err, obj) {
    if (!handleError(err, obj, opts.typeName, callback)) {
      var one = new opts.ObjFunc(self.client, obj[opts.typeName], self);
      callback(null, one);
    }
  }, headers);
};

// INTERNAL API
AccountBase.prototype._initTxn = function(operation, args, callback, headers) {
  var self = this;
  var path = "transactions/" + operation;
  var body = {
    "account_id": this.id,
    "transaction": args
  };
  this.client._postHttp(path, body,
    function onPost(err, obj) {
      if (!handleError(err, obj, 'transaction', callback)) {
        var txn = new Transaction(self.client, obj.transaction, self);
        callback(null, txn);
      }
    }, headers);
};

// INTERNAL API
AccountBase.prototype._trade = function(action, args, callback, headers) {
  var self = this;
  if (!args) {callback('args must not be empty', null);}
  args.account_id = this.id;
  this.client._postHttp(action, args,
    function onPost(err, obj) {
      if (!handleError(err, obj, 'transfer', callback)) {
        var transfer = new Transfer(self.client, obj.transfer, self);
        callback(null, transfer);
      }
  }, headers);
};

module.exports = AccountBase;

