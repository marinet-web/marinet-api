"use strict";

const
    environment = process.env.NODE_ENV || 'development',
    log = require('npmlog'),
    zmq = require('zmq'),
    Q = require('q'),
    config = require('../config/' + environment + '.js'),
    deferedDb = require('../setup/db.js')(config, log),
    Models = require('../lib/models.js')(deferedDb),
    getAppName = require('../lib/queries/get-app-name.js')(Models, Q),
    createError = require('../lib/commands/create-error.js')(Models, Q),
    subscriber = zmq.socket('sub');

let
    countSuccess = 0,
    countError = 0;

subscriber.subscribe("");

subscriber.on("message", function (data) {
    let message = JSON.parse(data);

    console.log('Processing message at ' + message.date);
    console.log("Id: %s, Key: %s", message.app.id, message.app.key);
    getAppName.execute(message.app.id, message.app.key)
        .then(function (app) {
            return createError.execute(message.error, app)
                .then(function (error) {
                    countSuccess++;
                    console.log({
                        sucess: countSuccess,
                        error: countError
                    });
                });
        })
        .catch(function (err) {
            console.log(err);
            countError++;
            console.log({
                sucess: countSuccess,
                error: countError
            });
        });


});

subscriber.connect("tcp://localhost:5432");
