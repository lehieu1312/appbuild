var express = require('express');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var router = express.Router();
var qr = require('qr-image');
var QRCode = require('qrcode');
var bodyParser = require('body-parser');
var appRoot = require('app-root-path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

/* GET users listing. */
router.get('/test', function(req, res, next) {
    var hostName = req.headers.host;
    console.log(hostName);
    res.render('success');
});
router.get('/qrcode', function(req, res) {
    var code = qr.image('localhost:3005\static\debug\9f3fec4d9fcaeec15238174e88dd6ac4\zingapp-debug.apk', { type: 'png', ec_level: 'H', size: 20, margin: 0 });
    // res.setHeader('Content-type', 'image/png');
    code.pipe(fs.createWriteStream('./public/qr.png'));
    //code.pipe(res);
    res.render('success', { qr: code })
});
router.get('/qr', function(req, res) {
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        rendererOpts: {
            quality: 0.5
        }
    }
    QRCode.toDataURL('localhost:3005\static\debug\9f3fec4d9fcaeec15238174e88dd6ac4\zingapp-debug.apk', opts, function(err, url) {
        if (err) throw err
        console.log(url)
            //var img = document.getElementById('image');
            //img.src = url;
        res.render('success', { qrcode: url });
    })
})
router.post('/getajax', function(req, res) {
    var name = req.body.number;
    var rule = req.body.rule;
    console.log('rule: ' + rule);
    console.log(name);
    setTimeout(function() { res.send('success'); }, 3000);

    //res.sendFile('/');
})
router.get('/getajax', function(req, res) {
    res.render('ajaxxample');
})
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
router.get('/filexml', function(req, res) {
    var xml = path.join(appRoot.toString(), 'config.xml');
    console.log(xml);
    if (fs.existsSync(xml)) {
        fs.readFile(xml, 'utf8', function(err, data) {
            if (err) {
                console.log(err.message);
                return;

            } else {
                parser.parseString(data, function(err, result) {
                    console.log(result);
                    console.log(result.widget.name[0]);
                    res.render('index');
                });
            }
        });
    } else {
        console.log('not found');
        res.render('index');
    }
});
router.get('/getxml', function(req, res) {
    var xml = path.join(appRoot.toString(), 'params.xml');
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
        console.log('not found');
        res.render('index');
    }
});
// router.post('/info-app', function(req, res) {
//     res.render('index');
// })
module.exports = router;