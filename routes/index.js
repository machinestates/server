var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Machinestates' });
});

router.get('/silicon', function(req, res, next) {
  res.render('silicon', { title: 'Trading Round', layout: 'layout-silicon.hbs' });
});

module.exports = router;
