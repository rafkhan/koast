'use strict';

var config = require('./lib/config/config-loader');
var bootstrap = require('./lib/app/bootstrap');

var koast = {};

koast.serve = function () {
  var app = ();
  app.listen(3000);
};

module.exports = exports = koast;
