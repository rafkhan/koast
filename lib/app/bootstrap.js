var express = require('express');
var rek = require('rekuire');

var bootstrap = {};

bootstrap.getConfiguredApplication = function(appConfig) {
  //appConfig = appConfig || loadAppConfig();
  var app = express();
  
  console.log(__dirname);
  app.get('/koast', function(req, res) {
    res.send('hello');
  });

  appConfig.routes.forEach(function(routeDef) {
    if(routeDef.type === 'module') {
      var mod = rek(routeDef.module);
      app.use(routeDef.route, mod);
    }
  });

  return app;
};

module.exports = exports = bootstrap;
