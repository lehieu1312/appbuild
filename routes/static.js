var express = require('express'),
    path = require('path'),
    fs = require('fs');
var appRoot = require('app-root-path');
var router = express.Router();

router.get('/static/debug/:project/:app', function(req, res) {
    var project = req.params.project;
    var app = req.params.app;
    console.log(project);
    console.log(app);
    var pathFile = path.join(appRoot.toString(), 'public', 'project', project, 'outputs', 'unsigned', app);
    console.log(pathFile);
    if (fs.existsSync(pathFile)) res.download(pathFile);
    else res.render('404');
})
router.get('/static/signed/:project/:app', function(req, res) {
    var project = req.params.project;
    var app = req.params.app;
    console.log(project);
    console.log(app);
    var pathFile = path.join(appRoot.toString(), 'public', 'project', project, 'outputs', 'signed', app);
    console.log(pathFile);
    if (fs.existsSync(pathFile)) res.download(pathFile);
    else res.render('404');
})

module.exports = router;