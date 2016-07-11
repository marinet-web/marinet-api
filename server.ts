import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { kernel } from './bootstrap';

import { Client } from 'elasticsearch';

let server = new InversifyExpressServer(kernel);

server.setConfig((app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan('combined'));
});

let app = server.build();

app.listen(process.env.NODE_ENV || 3000);