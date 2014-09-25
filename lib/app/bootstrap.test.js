'use strict';

var chai = require('chai');
var should = chai.should();
var supertest = require('supertest');
var bootstrap = require('./bootstrap');

describe('Bootstrapper', function() {
  it('Should mount HW module and have route /hello/world.', function(done) {
    var app = bootstrap.getConfiguredApplication({
      routes: [{
        route: '/hello',
        type: 'module',
        module: 'test-data/modules/hello-world'
      }]
    });

    supertest(app)
      .get('/hello/world')
      .end(function(err, res) {
        res.text.should.equal('Hello, koast!');
        done(err);
      });
  });
});


