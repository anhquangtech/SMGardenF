var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET cropSelection page. */
router.get('/CropSelection', function(req, res, next) {
  res.render('cropSelection', { title: 'Crop Selection' });
});

/* GET Automation page. */
router.get('/automation', function(req, res, next) {
  res.render('automation', { title: 'Automation' });
});

/* GET ControlByHand page. */
router.get('/controlByHand', function(req, res, next) {
  res.render('controlByHand', { title: 'Control By Hand' });
});

/* GET ControlByHand page. */
router.get('/404_PageNotFound', function(req, res, next) {
  res.render('404_PageNotFound', { title: '404 Page Not Found' });
});
 
module.exports = router;
