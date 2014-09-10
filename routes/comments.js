'use strict';

function comments(app, queries, commands, authed) {
    app.get('/comments/:hash', authed, function (req, res) {
        queries.getCommentsByErrorHash
            .execute(req.params.hash)
            .then(function (comments) {
                res.json(comments);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });

    app.post('/comment', function (req, res) {
        let comment = req.body;

        commands.createComment.execute(comment, req.user)
            .then(function (result) {
                res.status(201).json(result);
            })
            .catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = comments;
