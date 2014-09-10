'use strict';

const mongoose = require('mongoose');

module.exports = function (config, log) {

    let db = mongoose.connection;
    mongoose.connect(config.db);

    db.on('error', function (err) {

        log.error('mongodb', err);
    });
    db.once('open', function () {
        log.info('mongodb', 'Connected succefully!');
    });

    return mongoose;
}
