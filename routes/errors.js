'use strict';

function errors(app, queries, commands, authed, publisher) {
    app.get('/:appName/errors', authed, function (req, res) {
        queries.searchErrors
            .execute({
                query: req.query.q,
                appName: req.params.appName,
                solved: req.query.solved ? true : false,
                sort: req.query.sort === 'asc' ? 1 : -1,
            }, req.query.page)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                require('../lib/marinet-handler')(err, req, res, function (err) {
                    res.status(500).json(err);
                });
            })
            .done();
    });

    app.post('/error', function (req, res) {
        let error = req.body;

        publisher.send(JSON.stringify({
            type: 'newerror',
            error: error,
            app: {
                id: req.headers.marinetappid,
                key: req.headers.marinetappkey
            },
            date: Date.now()
        }));

        res.status(201).json({
            'message': 'queued'
        });

    });

    app.get('/:appName/error/:hash', authed, function (req, res) {

        queries.getErrorsByHash
            .execute(req.params.appName, req.params.hash)
            .then(function (error) {
                let fields = [],
                    restrictions = ['_id', '_rev', 'appName', 'count', 'exception', 'keys', 'message', 'solved', 'type', 'selected'];

                Object.keys(error).forEach(function (key) {
                    if (restrictions.indexOf(key) === -1)
                        fields.push({
                            name: key,
                            val: error[key]
                        });
                });

                error.fields = fields;
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            }).done();
    });

    app.get('/error/:hash/:id', authed, function (req, res) {

        queries.getErrorsById
            .execute(req.params.id)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            }).done();
    });

    app.put('/error/:hash', authed, function (req, res) {
        commands.solveErrors
            .execute(req.params.hash)
            .then(function (result) {
                res.status(200).json('Solved');
            })
            .catch(function (err) {
                res.json(err);
            }).done();
    });

    app.get('/error/throw', function (req, res) {
        throw new Error("Error test! Try to catch this!");

    });
}

module.exports = errors;
