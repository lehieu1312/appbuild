var express = require('express');
var path = require('path');
var router = express.Router();
var appRoot = require('app-root-path');

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log('dirname: ' + __dirname);
    // console.log('module.filename:' + module.filename);
    // console.log('__filename:' + __filename);
    // var appDir = path.resolve(__dirname);

    // console.log('dir root: ' + appRoot);
    res.render('index', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/success', function(req, res, next) {
    res.render('success', { title: 'Express' });
});

module.exports = router;