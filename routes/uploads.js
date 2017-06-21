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

router.get('/upload', function(req, res) {
    res.render('upload', { errors: req.session.errors });
});
router.post('/upload', multipartMiddleware, function(req, res, next) {

    try {
        sess = req.session;
        var file = req.files.file_upload;
        sess.appName = req.body.appname;
        console.log('app Name: ' + sess.appName);
        var appExtFile = file.name.split('.').pop();
        console.log('ext file: ' + appExtFile);
        console.log('dir root: ' + appRoot);
        var pathFile = path.join(appRoot, 'public', 'uploads', file.name);
        console.log('pathFile: ' + pathFile);
        if (appExtFile == 'zip') {
            fs.readFile(file.path, function(err, data) {
                fs.writeFile(pathFile, data, function(err) {
                    if (err) console.log(err);
                    sess.folderAppMd5 = md5(Date.now());
                    var fileNameUploads = sess.folderAppMd5 + '.' + appExtFile;
                    console.log('file uploads: ' + fileNameUploads);
                    var pathFileUploads = path.join(appRoot, 'public', 'uploads', fileNameUploads);
                    fs.rename(pathFile, path.join(appRoot, 'public', 'uploads', fileNameUploads), function(err, result) {
                        if (err) console.log('ERROR RENAME FILE: ' + err);
                        //  else path_FileUploads = path_Uploads + dist + file_NameUploads;
                        if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5))) {
                            extract(path.join(appRoot, 'public', 'uploads', fileNameUploads), { dir: path.join(appRoot, 'public', 'temporary', sess.folderAppMd5) }, function(err, zipdata) {
                                if (err) {
                                    console.log(err);
                                    return;
                                } else {
                                    console.log('extract done.');
                                    var xml = path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'www', 'params.xml');
                                    console.log(xml);
                                    if (fs.existsSync(xml)) {
                                        fs.readFile(xml, 'utf8', function(err, data) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            } else {
                                                parser.parseString(data, function(err, result) {
                                                    var arrFile = result['root']['file'];
                                                    res.render('info-app', { arrFile });
                                                });
                                            }
                                        });
                                    } else {
                                        console.log('not found params');
                                        //  res.send('not found params');
                                        // fse.removeSync(path.join(path_Temporary, app_Name));
                                        // fs.unlinkSync(path.join(path_FileUploads));
                                        res.render('info-build', { errors: req.session.errors });

                                    }
                                }
                            })
                        }
                    });

                });
            })
        } else {
            console.log('format file must zip type');
            var errors = 'format file must zip type';
            res.render('upload', { errors: errors });
            next();
        }
    } catch (ex) { res.render('upload', { errors: ex }); }
});



module.exports = router;