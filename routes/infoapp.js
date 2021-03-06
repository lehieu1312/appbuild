var express = require('express');
var extract = require('extract-zip');
var path = require('path'),
    md5 = require('md5'),
    fse = require('fs-extra'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    multipart = require('connect-multiparty');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multipartMiddleware = multipart();
var router = express.Router();
var parser = new xml2js.Parser();

router.post('/info-app', function(req, res, next) {
    try {
        var inputValue = req.body;
        var arrCheckFile = [];
        for (var key in inputValue) {
            var arrPathName = key.split('=').shift();
            var fileNameDefault = key.split('=').shift().split('.').shift() + '-example' + '.' + key.split('=').shift().split('.').pop();
            var pathFileDefault = path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, fileNameDefault);
            if (arrCheckFile.indexOf(pathFileDefault) == -1) arrCheckFile.push(pathFileDefault);
            var data = fs.readFileSync(pathFileDefault);
            var result = data.toString().replace(key.split('=').pop(), inputValue[key]);
            var outFile = fs.writeFileSync(pathFileDefault, result);
        }
        for (var fileRename in arrCheckFile) {
            var fileExample = arrCheckFile[fileRename];
            var fRename = fileExample.replace('-example', '');
            fs.renameSync(fileExample, fRename);
        }
        if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'config.xml'))) {
            fs.readFile(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'config.xml'), 'utf8', function(err, data) {
                if (err) {
                    console.log(err.message);
                    return;
                } else {
                    parser.parseString(data, function(err, result) {
                        sess.appName = result.widget.name[0];
                        console.log('app: ' + sess.appName);
                        res.render('info-build', { errors: req.session.errors });
                    });
                }
            });
        } else {

            res.render('upload', { errors: 'config.xml' });
        }

    } catch (error) {
        res.render('upload', { errors: error });
    }

    //, 
    //next();
});


module.exports = router;