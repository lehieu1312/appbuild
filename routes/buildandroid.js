var express = require('express');
var router = express.Router();
var Q = require('q'),
    taydoCommandUtils = require('../lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    path = require('path'),
    fse = require('fs-extra'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    nodemailer = require('nodemailer'),
    crossSpawn = require('cross-spawn'),
    multipart = require('connect-multiparty');
var hbs = require('nodemailer-express-handlebars');
var QRCode = require('qrcode');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multipartMiddleware = multipart();
let Customer = require('../models/customer');
var checked = true;
router.post('/build-android', multipartMiddleware, function(req, res, next) {
    console.log(checked);
    if (checked) {
        checked = false;
        req.check('email', 'Email is required').notEmpty();
        req.check('email', 'Invalid is email adress').isEmail();
        req.check('keystore', 'Keystore is required').notEmpty();
        req.check('confirmkeystore', 'Confirm keystore does not match the keystore.').equals(req.body.keystore);
        req.check('CN', 'First and last name is required').notEmpty();
        req.check('OU', 'Organizational unit is required').notEmpty();
        req.check('C', 'Organizational is required').notEmpty();
        req.check('L', 'City or location is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('C', 'Two-letter country is required').notEmpty();
        req.check('alias', 'Alias required').notEmpty();

        var errors = req.validationErrors();
        //  err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            return res.render('info-build', {
                errors: errors
            });
        } else {
            var mailCustomer = req.body.email,
                OU = req.body.OU,
                CN = req.body.CN,
                O = req.body.O,
                L = req.body.L,
                ST = req.body.ST,
                C = req.body.C,
                keystore = req.body.keystore,
                keystore_again = req.body.confirmKeystore,
                alias = req.body.alias;


            let unZip = (inFile, outFile) => {
                return new Promise((resolve, reject) => {
                    extract(inFile, { dir: outFile }, function(err, data) {
                        if (err) reject(err);
                        else {
                            resolve('extract done...');
                        }
                    })
                })
            }
            let joinProject = (pathProjectApp, pathProjectTemp) => {
                return new Promise((resolve, reject) => {
                    try {
                        if (fs.existsSync(path.join(pathProjectApp, 'www'))) fse.removeSync(path.join(pathProjectApp, 'www'));
                        if (fs.existsSync(path.join(pathProjectApp, 'plugins'))) fse.removeSync(path.join(pathProjectApp, 'plugins'));
                        if (fs.existsSync(path.join(pathProjectApp, 'resources'))) fse.removeSync(path.join(pathProjectApp, 'resources'));
                        if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) fse.removeSync(path.join(pathProjectApp, 'config.xml'));

                        if (fs.existsSync(path.join(pathProjectTemp, 'www'))) fse.copySync(path.join(pathProjectTemp, 'www'), path.join(pathProjectApp, 'www'));
                        if (fs.existsSync(path.join(pathProjectTemp, 'plugins'))) fse.copySync(path.join(pathProjectTemp, 'plugins'), path.join(pathProjectApp, 'plugins'));
                        if (fs.existsSync(path.join(pathProjectTemp, 'resources'))) fse.copySync(path.join(pathProjectTemp, 'resources'), path.join(pathProjectApp, 'resources'));
                        if (fs.existsSync(path.join(pathProjectTemp, 'config.xml'))) fse.copySync(path.join(pathProjectTemp, 'config.xml'), path.join(pathProjectApp, 'config.xml'));
                        //fse.removeSync(path.join(pathProjectTemp, folderAppMd5));
                        resolve('success.');
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            let createApp = (folderApp) => {
                return new Promise((resolve, reject) => {
                    try {
                        if (fse.existsSync(path.join(appRoot, 'public', 'project', 'myapp'))) {
                            fse.removeSync(path.join(appRoot, 'public', 'project', 'myapp'));
                            fse.copySync(path.join(appRoot, 'public', 'appxample', 'myapp'), path.join(appRoot, 'public', 'project', 'myapp'));
                            fse.renameSync(path.join(appRoot, 'public', 'project', 'myapp'), path.join(appRoot, 'public', 'project', folderApp));
                        } else {
                            fse.copySync(path.join(appRoot, 'public', 'appxample', 'myapp'), path.join(appRoot, 'public', 'project', 'myapp'));
                            fse.renameSync(path.join(appRoot, 'public', 'project', 'myapp'), path.join(appRoot, 'public', 'project', folderApp));
                        }
                        resolve('success.');
                    } catch (error) {
                        reject(error);
                    }
                });
            }
            let copyFileApkToSign = (pathProjectApp) => {
                return new Promise((resolve, reject) => {
                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
                    if (!fs.existsSync(path_signed)) {
                        fs.mkdirSync(path_signed);
                    }
                    const outAplication = fs.createWriteStream(path.join(path_signed, 'android-release-unsigned.apk'));
                    fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk'))
                        .pipe(outAplication);
                    outAplication.on("end", resolve("copy success."));
                    outAplication.on("error", reject(''));
                });
            }
            let copyFile = (pathFrom, pathTo) => {
                return new Promise((resolve, reject) => {
                    try {
                        const outAplication = fs.createWriteStream(pathTo);
                        fs.createReadStream(pathFrom)
                            .pipe(outAplication);
                        outAplication.on("end", resolve("copy success."));
                        outAplication.on("error", reject(''));
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
            let copyFileApkDebug = (pathProjectApp) => {

                return new Promise((resolve, reject) => {
                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_unsigned = path.join(pathProjectApp, 'outputs', 'unsigned');
                    if (!fs.existsSync(path_unsigned)) {
                        fs.mkdirSync(path_unsigned);
                    }
                    const outProject = fs.createWriteStream(path.join(path_unsigned, sess.appName + '-debug.apk'));
                    fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-debug.apk'))
                        .pipe(outProject);
                    outProject.on("end", resolve("copy success."));
                    outProject.on("error", reject(''));
                });
            }
            let checkAppCordova = (pathProjectApp) => {
                return checkConfig = fs.existsSync(path.join(pathProjectApp, 'config.xml'));
                // return deferred.promise;
            }
            let generatesKeyStore = (pathProjectApp, CN, OU, O, L, ST, C, keystore, alias) => {

                var deferred = Q.defer();
                var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                const child = spawn('keytool', ['-genkey', '-v', '-dname', '"CN=' + CN + ', OU=' + OU + ', O=' + O + ', L=' + L + ', ST=' + ST + ', C=' + C + '"', '-alias', alias, '-keypass', keystore, '-keystore', path.join(path_signed, 'my-release-key.keystore'), '-storepass', keystore, '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000'], { stdio: 'inherit', shell: true, silent: true });
                child.on('data', function(data) {
                    console.log('data renkey out: ' + data.toString());
                });
                child.on('close', function(code) {
                    if (code > 0) {
                        return deferred.reject(code);
                    }
                    return deferred.resolve();
                });
                return deferred.promise;
            }
            let jarSignerApp = (pathProjectApp, alias) => {

                var deferred = Q.defer();
                const signApp = spawn('jarsigner', ['-verbose', '-sigalg', 'SHA1withRSA', '-digestalg', 'SHA1', '-keystore', path.join(pathProjectApp, 'outputs', 'signed', 'my-release-key.keystore'), '-storepass', keystore, path.join(pathProjectApp, 'outputs', 'signed', 'android-release-unsigned.apk'), alias, ], { stdio: 'inherit', shell: true, silent: true });
                signApp.on('data', function(data) {
                    console.log('data sign app out: ' + data.toString());
                });
                signApp.on('close', function(code) {
                    if (code > 0) {
                        return deferred.reject(code);
                    }
                    return deferred.resolve();
                });
                return deferred.promise;
            }
            let zipAlignApp = (pathProjectApp, App) => {

                var deferred = Q.defer();
                const zipalign = spawn('zipalign ', ['-f', '-v', '4', path.join(pathProjectApp, 'outputs', 'signed', 'android-release-unsigned.apk'), path.join(pathProjectApp, 'outputs', 'signed', App + '.apk')], { stdio: 'inherit', shell: true, silent: true });

                zipalign.on('data', function(data) {
                    console.log('data zip align app out: ' + data.toString());
                });
                zipalign.on('close', function(code) {
                    if (code > 0) {
                        return deferred.reject(code);
                    }
                    return deferred.resolve();
                });
                return deferred.promise;

            }
            let sendMail = (emailReceive, linkAppUnsign, linkAppSigned, App) => {
                return new Promise((resolve, reject) => {
                    var transporter = nodemailer.createTransport({ // config mail server
                        host: 'smtp.gmail.com',
                        auth: {
                            user: 'lehieu.ggplay@gmail.com',
                            pass: '1312199421'
                        }
                    });
                    transporter.use('compile', hbs({
                        viewPath: path.join(appRoot, 'views'),
                        extName: '.ejs'
                    }));

                    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'TayDoTech Team',
                        to: emailReceive,
                        subject: 'Check file application',
                        template: 'mail',
                        context: {
                            App,
                            linkAppUnsign,
                            linkAppSigned
                        }
                    }
                    transporter.sendMail(mainOptions, function(err, info) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve('Message sent: ' + info.response);
                        }
                    });
                });
            }
            let commandCordova = (optionList) => {
                    var deferred = Q.defer();
                    var cordovaProcess = crossSpawn.spawn('cordova', optionList);
                    cordovaProcess.on('data', function(data) {
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            console.log('error cordova: ' + data.toString());
                            checked = true;
                            // res.render('upload', { errors: data.toString() });
                        }
                        //console.log('data: ' + data.toString());
                    });
                    cordovaProcess.stderr.on('data', function(data) {
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            checked = true;
                            console.log('error cordova: ' + data.toString());
                            //res.render('upload', { errors: data.toString() });
                        }
                    });

                    cordovaProcess.on('close', function(code) {
                        if (code > 0) {
                            return deferred.reject(code);
                        }
                        return deferred.resolve();
                    });

                    return deferred.promise;
                }
                // .then(function() {
                //     return configHooks();
                // })
                // var argvIonicstart = ['start', app_Name];
                //taydoCommandUtils.execIonicCommand(argvIonicstart)
                // process.chdir(path_project);

            process.chdir(path.join(appRoot, 'public', 'project'));
            // var argvIonicstart = ['start', sess.folderAppMd5, 'blank'];
            console.log('create app ionic..........');
            // /taydoCommandUtils.execIonicCommand(argvIonicstart)
            return createApp(sess.folderAppMd5)
                // .then(function() {
                //     process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                //     var chmodRx = ['-R', '777', './'];
                //     return taydoCommandUtils.execChmodCommand(chmodRx);
                // })
                .then(function() {
                    console.log('join file..........');
                    return joinProject(path.join(appRoot, 'public', 'project', sess.folderAppMd5), path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
                }).then(function() {
                    console.log('add platform.......');
                    process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                    console.log(process.cwd());
                    var argv = ['platform', 'add', 'android'];
                    return taydoCommandUtils.execCordovaCommand(argv);
                    //  return commandCordova(argv)
                })
                .then(function() {
                    console.log('build project debug........');
                    process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                    var argv = ['build', 'android'];
                    return taydoCommandUtils.execCordovaCommand(argv);
                    // return commandCordova(argv)
                })
                .then(function() {
                    try {
                        console.log('copy  file apk unsign........');
                        return copyFileApkDebug(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                    } catch (error) {
                        res.render('upload', { errors: 'Error generate file unsign,please try again.' });
                    }
                })
                .then(function() {
                    console.log('build project release.....');
                    process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                    var argv = ['build', 'android', '--release'];
                    return taydoCommandUtils.execCordovaCommand(argv);
                    // return commandCordova(argv)
                })
                .then(function() {
                    console.log('copy  file apk sign....');
                    return copyFileApkToSign(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
                }).then(function() {
                    console.log('generate key.....');
                    return generatesKeyStore(path.join(appRoot, 'public', 'project', sess.folderAppMd5), CN, OU, O, L, ST, C, keystore, alias);
                }).then(function() {
                    console.log('sign app.....');
                    return jarSignerApp(path.join(appRoot, 'public', 'project', sess.folderAppMd5), alias);
                }).then(function() {
                    console.log('zip file....');
                    return zipAlignApp(path.join(appRoot, 'public', 'project', sess.folderAppMd5), sess.appName);
                })
                .then(function() {
                    var hostName = req.headers.host;
                    var linkdebug = path.join(hostName, 'static', 'debug', sess.folderAppMd5, sess.appName + '-debug.apk');
                    var linksigned = path.join(hostName, 'static', 'signed', sess.folderAppMd5, sess.appName + '.apk');
                    sess.linkdebug = linkdebug;
                    sess.linksigned = linksigned;
                    return sendMail('hieu.ric@gmail.com', linkdebug, linksigned, sess.appName)
                })
                .then(function() {
                    let customer = new Customer();
                    customer.email = mailCustomer;
                    customer.appname.app = sess.appName;
                    customer.appname.plaforms = 'android';
                    customer.linkdebug = sess.linkdebug;
                    customer.linksigned = sess.linksigned;
                    customer.datecreate = Date.now();
                    customer.save(function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log('save success');
                        }
                    });
                    var opts = {
                        errorCorrectionLevel: 'H',
                        type: 'image/png',
                        rendererOpts: {
                            quality: 0.5
                        }
                    }
                    QRCode.toDataURL(sess.linkdebug, opts, function(err, url) {
                            if (err) throw err
                            checked = true;
                            return res.render('success', { qrcode: url });
                        })
                        // return res.render('success');
                })
                .catch(function(ex) {
                    if (ex instanceof Error) {
                        checked = true;
                        //  if (fs.existsSync(path.join(appRoot, 'public', 'project', sess.folderAppMd5))) fs.unlink(path.join(appRoot, 'public', 'project', sess.folderAppMd5))
                        res.render('upload', { errors: 'Error build(' + ex + '' + '),please try again.' });
                    }
                });
        }
    }
    // else {
    //     //checked = true;
    //     res.render('upload', { errors: 'Build fail,please try again' });
    // }
});

module.exports = router;