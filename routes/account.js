'use strict';

const   _       = require('lodash'),
        jwt     = require('jsonwebtoken');

function account(app, config, queries, commands, authed, passport) {
    function createToken(user) {
        return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*5 });
    }
    app.get('/account/apps', authed, function (req, res) {
        queries.getAccountApps.execute(req.user.accountId)
            .then(function (apps) {
                res.json(apps);
            }).catch(function (err) {
                res.status(503).json({
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/account/app', authed, function (req, res) {
        let
            app = req.body,
            accountId = req.user.accountId;

        commands.createApp.execute(accountId, app)
            .then(function (app) {
                res.status(201).json(app);
            }).catch(function (err) {
                res.status(503).json({
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/login',
        passport.authenticate('local'),
        function (req, res) {
            res.json(createToken(req.user));
        });

    app.delete('/logout', authed, function (req, res) {
        req.logout();
        res.status(204).json({
            message: 'OK'
        });
    });

    app.get('/user', authed, function (req, res) {
        if (req.user)
            res.json({
                'username': req.user.name,
                'role': req.user.roles[0],
                'accountName': req.user.accountName,
                'email': req.user.email,
            });
        else
            res.status(403).json({
                error: "forbidden",
                reason: "not_authenticated"
            });
    });
}

module.exports = account;
