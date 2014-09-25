var chai = require('chai');
var should = chai.should();
var supertest = require('supertest');
var bootstrap = require('./bootstrap');

describe('Bootstrapper', function() {
  it('Should get an app', function(done) {
    var app = bootstrap.getConfiguredApplication({
      routes: [
        {
          route: '/api',
          type: 'module',
          module: 'x'
        }
      ]
    });

    supertest(app)
      .get('/api/x')
      .end(function(err, res) {
        res.text.should.equal('ayy');
        done(err);
      });
  });
});


