var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Machinestates', layout: 'index.hbs' });
});

module.exports = router;
