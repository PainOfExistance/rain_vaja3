var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.user){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
router.get('/publish', requiresLogin, photoController.publish);
router.get('/show/:id', photoController.show);
router.get('/myquestions/:id', requiresLogin, photoController.mylist);
router.get('/search/:id', photoController.search);

router.post('/', requiresLogin, upload.single('image'), photoController.create);

router.put('/:id', photoController.update);

router.get('/delete/:id', photoController.remove);

module.exports = router;
