'use strict';

const
    crypto = require('crypto'),
    shortId = require('shortid');

module.exports = function (Models, Q) {

    return {
        'execute': function (accountId, data) {
            let defered = Q.defer();

            let app = new Models.App(data);
            let id = shortId.generate();
            app.key = crypto.createHash('sha256').update(app.id).digest("hex");
            app.accountId = accountId;

            app.save(function (err, app) {
                if (err) defered.reject(err);
                else defered.resolve(app);
            });

            return defered.promise;
        }
    }
}
