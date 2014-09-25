var express = require('express');
var router = express.Router();

router.use('/x', function(req, res) {
  res.send('ayyy');
});

module.exports = exports = router;
