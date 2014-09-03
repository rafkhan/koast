'use strict';

var _        = require('lodash');
var http     = require('http');
var director = require('director');

var koast = {};
var routeMap = {};

koast.methods = {
  GET: 'GET',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT'
};

var decisions = {
  unknownMethod: function(machine, req) {
    var knownMethods = machine.knownMethods || _.values(koast.methods);
    if(_.contains(knownMethods, req.method)) {
      return false;
    }
    return true;
  },

  uriTooLong: function(machine, req) {
    if(req.url.length > 4096) {
      return true;
    }
    return false;
  },

  methodAllowed: function(machine, req) {
    var allowedMethods = machine.allowedMethods || [koast.methods.GET];
    if(_.contains(allowedMethods, req.method)) {
      return true;
    }

    return false;
  }
};


function runWebMachine(machine) {
  return function() {
    console.log(arguments);

    var req = this.req,
        res = this.res;

    // Known Method?
    if(decisions.unknownMethod(machine, req)) {
      res.writeHead(501); // 501 - Not Implemented
      res.end();
      return;
    }

    // URI too long?
    if(decisions.uriTooLong(machine, req)) {
      res.writeHead(414); // 414 - Request URI too long
      res.end();
      return;
    }

    // Method Allowed?
    if(!decisions.methodAllowed(machine, req)) {
      res.writeHead(405); // 405 - Method Not Allowed
      res.end();
      return;
    }

    if(req.method === koast.methods.GET) {
      machine.handleOk(req, res);
    }
  };
}


//
// Resource parameters
//
// - path:
//     String
//     Path to dispatch to from flatiron router.
//     i.e: "/users/:id/attr"
//
// - allowedMethods:
//     Array
//     List of HTTP methods allowed on a resource.
//     i.e: [koast.methods.GET, 'POST', ...]
//     
koast.resource = function(machine) {
  // Add current webmachine to available routes
  routeMap[machine.path] = {
    // Attach to all HTTP methods
    // FIXME: include the rest of the methods
    //        (except HEAD, look at Router.prototype.dispatch for rationale)
    get: runWebMachine(machine),
    patch: runWebMachine(machine),
    post: runWebMachine(machine),
    put: runWebMachine(machine),
    delete: runWebMachine(machine)
  };
};

koast.createServer = function() {
  var router = new director.http.Router(routeMap);

  return http.createServer(function (req, res) {
    router.dispatch(req, res, function(err) {
      res.writeHead(err.status || 500);
      res.write(JSON.stringify(err));
      res.end();
    });
  });
};

//***************************************************************************
//
//
//
koast.resource({
  path: '/asd/:x',
  allowedMethods: [koast.methods.GET],
  handleOk: function(req, res) {
    res.write('asd');
    res.end();
  }
});

var server = koast.createServer();
server.listen('3800');

exports = module.exports = koast;
