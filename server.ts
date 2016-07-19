import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'express-jwt';
import * as guard from 'express-jwt-permissions';

import { kernel } from './bootstrap';
import { config } from './config';

let server = new InversifyExpressServer(kernel);

server.setConfig((app) => {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan('combined'));
    app.use(cors({
        origin: (origin, callback) => {
            try {
                let ok: boolean = config.originsWhitelist.indexOf(origin) !== -1
                callback(null, ok);
            } catch (e) {
                callback(e, null);
            }

        }
    }));
    app.use(jwt({ secret: config.appSecret})
    .unless({path: ['/api/account/login', '/setup']}));
    
});

let app = server.build();

app.listen(config.appPort);