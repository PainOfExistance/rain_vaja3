var express = require('express');
var router = express.Router();
var photoController = require('../controllers/photoController.js');
router.get('/', photoController.list);
/* GET home page. */
/*router.get('/', function (req, res, next) {
    res.render('index', { title: 'MelsM' });
});*/

module.exports = router;
