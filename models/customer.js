let mongoose = require('mongoose');

let customerChema = mongoose.Schema({
    email: { type: String, require: true },
    info: [{
        app: { type: String, require: true },
        platforms: { type: String, require: true },
        linkdebug: { type: String, require: true },
        linksigned: { type: String, require: true },
        datecreate: { type: Date, require: true }
    }],

});

let Customer = module.exports = mongoose.model('Customer', customerChema);