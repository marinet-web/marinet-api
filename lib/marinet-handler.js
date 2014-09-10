"use strict";
const
    environment = process.env.NODE_ENV || 'development',
    config = require('../config/' + environment + '.js'),
    Marinet = require('marinet-provider-nodejs'),
    provider = new Marinet(config.marinet);

module.exports = function (err, req, res, next) {
    if (err.message && err.stack) {
        provider.error({
            currentUser: req.user ? req.user.name : 'unauthenticated',
            message: err.message,
            exception: err.stack,
            createdAt: new Date().toISOString().replace(/\..+/, '')
        });
    }

    next(err);
}
