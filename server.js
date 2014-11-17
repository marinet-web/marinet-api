'use strict';

const
    environment = process.env.NODE_ENV || 'development',
    log = require('npmlog'),
    logger = require('morgan'),
    config = require('./config/' + environment + '.js'),
    express = require('express'),
    deferedDb = require('./setup/db.js')(config, log),
    bodyParser = require('body-parser'),
    Q = require('q'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    cors = require('express-cors'),
    app = express(),
    zmq = require('zmq'),
    publisher = zmq.socket('pub');

let redisClient = {},
    RedisStore = {};

if ('production' === environment) {
    redisClient = require('redis').createClient();
    RedisStore = require('connect-redis')(session);
}

const Models = require('./lib/models.js')(deferedDb);

const
    queries = require('./lib/queries.js')(Models, Q),
    commands = require('./lib/commands.js')(Models, Q);

app.use(cors({
    allowedOrigins: config.allowedOrigins
}));
app.use(bodyParser.json());
app.use(logger('combined'));
app.set('port', process.env.PORT || 3000);

const authed = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else if (redisClient.ready || 'production' !== environment) {
        res.status(403).json({
            error: "forbidden",
            reason: "not_authenticated"
        });
    } else {
        res.status(503).json({
            error: "service_unavailable",
            reason: "authentication_unavailable"
        });
    }
};

if (environment === 'production')
    redisClient
    .on('ready', function () {
        log.info('REDIS', 'ready');
    })
    .on('error', function (err) {
        log.error('REDIS', err.message);
    });

passport.serializeUser(function (user, done) {
    done(null, user.email);
});
passport.deserializeUser(function (username, done) {
    queries.getUserByLogin.execute(username)
        .then(function (user) {
            done(null, user);
        }).catch(function (err) {
            done(err, null);
        });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        queries.getUserByLogin.execute(username).then(function (user) {
            if (commands.validatePassword.execute(password, user))
                done(null, user);
            else
                done(403, false, {
                    message: 'Incorrect username or password.'
                });

        }).catch(function (err) {
            console.log(err);
            done(403, false, {
                message: 'User not found.'
            });
        });
    }
));

app.use(cookieParser());
app.use(session({
    secret: 'eae79eb5-5a0d-4e14-9071-a38b02c4d712',
    saveUninitialized: true,
    resave: true,
    store: environment === 'production' ? new RedisStore({
        client: redisClient
    }) : null
}));
app.use(passport.initialize());
app.use(passport.session());

const
    errors = require('./routes/errors.js')(app, queries, commands, authed, publisher),
    account = require('./routes/account.js')(app, config, queries, commands, authed, passport),
    application = require('./routes/application.js')(app, config, commands, authed),
    comments = require('./routes/comments.js')(app, queries, commands, authed);

app.get('/', function (req, res) {
    res.json('I\'m working...');
});


app.use(require('./lib/marinet-handler'));


publisher.bind('tcp://*:5435', function (err) {
    if (!err)
        log.info('0MQ', 'Listening for zmq subscribers...');
    else
        log.error(err);
});

app.listen(app.get('port'), function () {
    log.info('SERVER', 'Express server listening on port ' + app.get('port'));
    log.info('SERVER', environment + ' mode.');
});
