'use strict';

var http = require('http'),
    director = require('director'),
    _        = require('lodash');


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
    get: runWebMachine(machine),
    post: runWebMachine(machine),
    put: runWebMachine(machine),
    delete: runWebMachine(machine)
  };
};

//***************************************************************************
koast.resource({
  path: '/asd',
  knownMethods: [koast.methods.GET],
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
