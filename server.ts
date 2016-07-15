import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'express-jwt';

import { kernel } from './bootstrap';

import { Client } from 'elasticsearch';

let server = new InversifyExpressServer(kernel);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan('combined'));
    app.use(cors({
        origin: (origin, callback) => {
            try {
                let ok: boolean = (<string>(process.env.ORIGINS_WHITELIST || 'localhost')).split(',')
                    .indexOf(origin) !== -1
                callback(null, ok);
            } catch (e) {
                callback(e, null);
            }

        }
    }));
    app.use(jwt({ secret: process.env.APP_SECRET})
    .unless({path: ['/api/account/login', '/setup']}));
});

let app = server.build();

app.listen(process.env.NODE_ENV || 3000);