'use strict';

function application(app, config, commands, authed) {
    app.get('/setup', function (req, res) {
        commands.initialSetup.execute(config.account.defaultId)
            .then(function (body) {
                res.status(201)
                    .json({
                        message: 'OK'
                    });
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = application;
