"use strict";
var BaseModel = require('./BaseModel');

// ##CONSTRUCTOR
//
// _args `client` and `data` args required_
//
//```
// var Contact = require('coinbase').model.Contact;
// var myContact = new Contact(client, data);
//```
// _normally you will get contacts from `Contact` methods of the `Client`_
// - - -
function Contact(client, data) {
  if (!(this instanceof Contact)) {
    return new Contact(client, data);
  }
  BaseModel.call(this, client, data);
}

Contact.prototype = Object.create(BaseModel.prototype);

module.exports = Contact;

