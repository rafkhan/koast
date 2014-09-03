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
  knownMethod: function(machine, req, res) {
    var knownMethods = machine.knownMethods || _.values(koast.methods);
    if(_.contains(knownMethods, req.method)) {
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

    // If webmachine runs successfully
    if(decisions.knownMethod(machine, req, res)) {
      machine.handleOk(req, res);
    }
  };
}


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
      console.log(err);
    });
  });
};

//***************************************************************************
koast.resource({
  path: '/asd/:x',
  knownMethods: [koast.methods.GET],
  handleOk: function(req, res) {
    res.write('asd');
    res.end();
  }
});

var server = koast.createServer();
server.listen('3800');

exports = module.exports = koast;
