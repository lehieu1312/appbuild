var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var router = express.Router();

/* GET users listing. */
router.get('/test', function(req, res, next) {
    var hostName = req.headers.host;
    console.log(hostName);
    res.render('success');
});
router.get('/send', function(req, res, next) {
    var transporter = nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        auth: {
            user: 'lehieu.ggplay@gmail.com',
            pass: '1312199421'
        }
    });
    transporter.use('compile', hbs({
        viewPath: 'views',
        extName: '.ejs'
    }));
    var username = 'le hieu';
    var mail = 'hieu.ric@gmail.com';
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail

        from: 'Thanh Batmon',
        to: mail,
        subject: 'Test Nodemailer',
        template: 'mail',
        context: {
            username,
            mail
        }

    }
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
});
router.get('/sendmail', function(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'lehieu.ggplay@gmail.com',
            pass: '1312199421'
        }
    });
    let mailOptions = {
        from: '"Taydotech Team 👻" <foo@blurdybloop.com>', // sender address
        to: 'hieu.ric@gmail.com', // list of receivers
        subject: 'app apk ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>file app apk</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.render('success');
});
router.get('/getlink', function(req, res, next) {
    var hostName = req.headers.host;
    console.log('host: ' + hostName);
    var linkunsigned = path.join(hostName, 'static', 'debug', 'ae94e0783f356dd0f097e3656cc9755d', 'zingme-debug.apk');
    var linksinged = path.join(hostName, 'static', 'signed', 'ae94e0783f356dd0f097e3656cc9755d', 'zingme.apk');
    console.log(linkunsigned);
    console.log(linksinged);
    res.render('success');
});

module.exports = router;