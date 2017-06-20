router.post('/build-android', multipartMiddleware, function(req, res, next) {
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
    err = JSON.stringify(errors);
    console.log('errors check: ' + err);
    if (errors) {
        return res.render('info-build', {
            errors: errors
        });
    } else {
        process.chdir(path.join(appRoot, 'public', 'project'));
        var argvIonicstart = ['start', sess.folderAppMd5, 'blank'];
        console.log('create app ionic..........');
        return taydoCommandUtils.execIonicCommand(argvIonicstart).then(function() {
                return res.render('success');

            })
            .catch(function(ex) {
                if (ex instanceof Error) {
                    console.log(ex);
                }
            });
    }

});