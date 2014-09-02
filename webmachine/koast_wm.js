'use strict';

var http = require('http'),
    director = require('director'),
    _        = require('lodash');


var koast = {};
var routeMap = {};

koast.methods = {
  get: 'GET',
  delete: 'DELETE',
  patch: 'PATCH',
  post: 'POST',
  put: 'PUT'
};

var handlers = {
  knownMethod: function(machine, req, res) {
    var knownMethods = machine.knownMethods || _.values(koast.methods);
    if(_.contains(knownMethods, req.method)) {
      return true;
    }
    return false;
  }
};

koast.resource = function(machine) {

  // Add current webmachine to available routes
  routeMap[machine.path] = {
    get: function() {
      var req = this.req,
          res = this.res;

      handlers.knownMethod(machine, req, res);
    }
  };
};

//***************************************************************************
koast.resource({
  path: '/asd',
  allowedMethods: [],
  handleOk: function(req, res) {
    this.res.write('asd');
    this.res.end();
  }
});

var router = new director.http.Router(routeMap);
var server = http.createServer(function (req, res) {
  router.dispatch(req, res, function(err) {
    console.log(err);
  });
});

server.listen('3800');

exports = module.exports = koast;
