var express = require('express');
var router = express.Router();
var Q = require('q'),
    taydoCommandUtils = require('../lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    fse = require('fs-extra'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    multipart = require('connect-multiparty');
var appRoot = require('app-root-path');
var multipartMiddleware = multipart();


router.post('/build-ios', multipartMiddleware, function(req, res) {

    var teamID = req.body.teamID,
        uuID = req.body.UUID;
    //var sudochmod = crossSpawn.spawn('chmod +x hooks/after_prepare/010_add_platform_class.js');
    // sudochmod.stdout.on('data', function(data) {
    //     console.log('data out: ' + data.toString());
    // });

    // sudochmod.stderr.on('data', function(data) {
    //     if (data) {
    //         //console.log(chalk.bold(data.toString()));
    //         console.log('data error: ' + data.toString());
    //     }
    // });
    let generatesBuildFile = (TeamID, UUID, pathProjectApp) => {
        return new Promise((resolve, reject) => {
            var content = {
                "ios": {
                    "debug": {
                        "codeSignIdentity": "iPhone Development",
                        "provisioningProfile": UUID,
                        "developmentTeam": TeamID,
                        "packageType": "development"
                    },
                    "release": {
                        "codeSignIdentity": "iPhone Distribution",
                        "provisioningProfile": UUID,
                        "developmentTeam": TeamID,
                        "packageType": "app-store"
                    }
                }
            };

            try {
                jsonfile.writeFile(path.join(appRoot, 'public', 'project', sess.folderAppMd5, 'build.json'), content, (err) => {
                    if (err) reject(err);
                    else resolve('generate build success.');
                });
            } catch (e) {
                console.log("Cannot write file ", e);
            }
        })
    }

    let unZip = (in_file, out_file) => {
        return new Promise((resolve, reject) => {
            extract(in_file, { dir: out_file }, function(err, data) {
                if (err) reject(err);
                else {
                    resolve('extract done...');
                }
            })
        })
    }
    let checkAppCordova = (pathProjectApp) => {
        return checkConfig = fs.existsSync(path.join(pathProjectApp, 'config.xml'))
            // return deferred.promise;
    }
    let joinProject = (pathProjectApp, pathProjectTemp) => {
        return new Promise((resolve, reject) => {
            try {

                fse.removeSync(path.join(pathProjectApp, 'www'));
                fse.removeSync(path.join(pathProjectApp, 'plugins'));
                fse.removeSync(path.join(pathProjectApp, 'resources'));
                fse.removeSync(path.join(pathProjectApp, 'config.xml'));
                fse.removeSync(path.join(pathProjectApp, 'platforms'));
                fse.moveSync(path.join(pathProjectTemp, 'www'), path.join(pathProjectApp, 'www'));
                fse.moveSync(path.join(pathProjectTemp, 'plugins'), path.join(pathProjectApp, 'plugins'));
                fse.moveSync(path.join(pathProjectTemp, 'resources'), path.join(pathProjectApp, 'resources'));
                fse.moveSync(path.join(pathProjectTemp, 'config.xml'), path.join(pathProjectApp, 'config.xml'));
                resolve('success.');

            } catch (error) {
                reject(error);
            }


        });
    }
    let copyFileIpa = (pathProjectApp) => {
        return new Promise((resolve, reject) => {
            var path_outputs = path.join(pathProjectApp, 'outputs');
            if (!fs.existsSync(path_outputs)) {
                fs.mkdirSync(path_outputs);
            }
            var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
            if (!fs.existsSync(path_signed)) {
                fs.mkdirSync(path_signed);
            }
            const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.ipa'));
            fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', sess.appName + '.ipa'))
                .pipe(out);
            out.on("end", resolve("copy success."));
            out.on("error", reject(''));
        });
    }
    let copyFileApp = (pathProjectApp) => {
            return new Promise((resolve, reject) => {
                var path_outputs = path.join(pathProjectApp, 'outputs');
                if (!fs.existsSync(path_outputs)) {
                    fs.mkdirSync(path_outputs);
                }
                var path_signed = path.join(pathProjectApp, 'outputs', 'unsigned');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.app'));
                fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', sess.appName + '.app'))
                    .pipe(out);
                out.on("end", resolve("copy success."));
                out.on("error", reject(''));
            });
        }
        // let addPlatForm = () => {
        //     var deferred = Q.defer();
        //     const addPlatForm = spawn('cordova', ['platform', 'add', 'ios'], { stdio: 'inherit', shell: true, silent: true });
        //     addPlatForm.on('data', function(data) {
        //         console.log('data sign app out: ' + data.toString());
        //     });
        //     addPlatForm.on('close', function(code) {
        //         if (code > 0) {
        //             return deferred.reject(code);
        //         }
        //         return deferred.resolve();
        //     });
        //     return deferred.promise;

    // }

    process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
    var argvIonicstart = ['start', sess.appName, 'blank'];
    return taydoCommandUtils.execIonicCommand(argvIonicstart)
        .then(function() {
            process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
            var chmodRx = ['-R', '777', './'];
            return taydoCommandUtils.execChmodCommand(chmodRx);
        })
        .then(function() {
            process.chdir(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
            var chmodRx = ['-R', '777', './'];
            return taydoCommandUtils.execChmodCommand(chmodRx);
        })
        .then(function() {
            return joinProject(path.join(appRoot, 'public', 'project', sess.folderAppMd5), path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
        })
        .then(function() {
            //  process.chdir(path_Project + dist + app_Name);
            var argv = ['platform', 'add', 'ios'];
            return taydoCommandUtils.execCordovaCommand(argv);
        }).then(function() {
            return generatesBuildFile(teamID, uuID, path.join(appRoot, 'public', 'project', sess.folderAppMd5));
        }).then(function() {
            var argv = ['build', 'ios'];
            return taydoCommandUtils.execCordovaCommand(argv);
        })
        .then(function() {
            var argv = ['build', 'ios', '--device', '--release'];
            return taydoCommandUtils.execCordovaCommand(argv);
        }).then(function() {
            return copyFileIpa(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
        })
        .then(res.render('success'))
        .catch(function(ex) {
            if (ex instanceof Error) {
                console.log(ex);
            }
        });

});

module.exports = router;