
import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { PingServer,
    CreateMessagesIndex,
    CreateUser } from '../commands';

import { TYPES } from '../types';
import { Request, Response } from 'express';
import { Promise } from 'es6-promise';

import { User } from '../models';

@injectable()
@Controller('/')
export class HomeController {
    private _pingServer: PingServer;
    private _createMessagesIndex: CreateMessagesIndex;
    private _createUser: CreateUser;

    /**
     *
     */
    constructor( @inject(TYPES.PingServer) pingServer: PingServer,
        @inject(TYPES.CreateMessagesIndex) createMessagesIndex: CreateMessagesIndex,
        @inject(TYPES.CreateUser) createUser: CreateUser) {
        this._pingServer = pingServer;
        this._createMessagesIndex = createMessagesIndex;
        this._createUser = createUser;
    }

    @Get('/')
    public get(): any {

        return {
            "version": "3.0.0",
            "name": "marinet-api",
            "env": process.env.NODE_ENV || "development"
        };
    }

    @Get('/setup')
    public setup(req: Request, res: Response): any {
        this._createUser.user = <User>{
            email: 'admin@marinet.me',
            name: 'Admnistrator',
            password: 'password'
        };
        console.log('Starting setup');
        return Promise.all([
            this._createMessagesIndex.exec(),
            this._createUser.exec()]);
    }
}