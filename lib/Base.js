"use strict";

var assign = require('object-assign');

//
// system super class with utils
//

function Base() {
  if (!(this instanceof Base)) {
    return new Base();
  }
}

Base.prototype.hasField = function(obj, field) {
  return (obj && obj.hasOwnProperty(field) && obj[field]);
};

Base.prototype.getProps = function() {
  var tmp = {};
  assign(tmp, this);
  delete tmp.client;
  delete tmp.account;
  return tmp;
};

Base.prototype.dumpJSON = function() {
  return JSON.stringify(this.getProps());
};

Base.prototype.toString = function() {
  return this.dumpJSON();
};

module.exports = Base;

