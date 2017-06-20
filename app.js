var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'),
    expressValidator = require('express-validator'),
    fs = require('fs'),
    fse = require('fs-extra'),
    md5 = require('md5'),
    http = require('http'),
    spawn = require('child_process').spawn,
    crossSpawn = require('cross-spawn'),
    Q = require('q'),
    extract = require('extract-zip'),
    jsonfile = require('jsonfile'),
    taydoCommandUtils = require('./lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// mongoose.connect('mongodb://localhost/buildapp');
// var dbMongo = mongoose.connection;
// dbMongo.on('error', function(err) {
//     console.log(err);
// });
// dbMongo.on('open', function() {
//     console.log('Mongodb conected');
// })

// mongoose.connect('mongodb://localhost/buildapp');
// var dbMongo = mongoose.connection;
// dbMongo.on('error', console.error.bind(console, 'connection error:'));
// dbMongo.once('open', function() {
//     console.log('MongoDb connected');
// });
var index = require('./routes/index');
var uploads = require('./routes/uploads');
var buildandroid = require('./routes/buildandroid');
var buildios = require('./routes/buildios');
var infoapp = require('./routes/infoapp');
var users = require('./routes/users');
var static = require('./routes/static');
var test = require('./routes/test');

var app = express();

// view engine setup
// let Customer = require('./models/customer');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(session({ resave: true, saveUninitialized: true, secret: 'hieulm' }));
app.use('/', index);
app.use('/users', users);
app.use('/', uploads);
app.use('/', infoapp);
app.use('/', buildandroid);
app.use('/', buildios);
app.use('/', static);
app.use('/', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    // next(err);
    res.render('404');
});
var sess;
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;