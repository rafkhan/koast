'use strict';

var config = require('./lib/config/config-loader');
var bootstrap = require('./lib/app/bootstrap');

var koast = {};

koast.serve = function () {
  var app = bootstrap.getConfiguredApplication({
    routes: [
      {
        route: '/api',
        type: 'module',
        module: 'server/api'
      }
    ]
  });
  app.listen(3000);
};

module.exports = exports = koast;
