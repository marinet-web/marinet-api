
import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { PingServer,
    CreateMessagesIndex,
    CreateUser,
    CreateApplication } from '../commands';

import { TYPES } from '../types';
import { Request, Response } from 'express';
import { Promise } from 'es6-promise';

import { User, Application } from '../models';

@injectable()
@Controller('/')
export class HomeController {
    private _pingServer: PingServer;
    private _createMessagesIndex: CreateMessagesIndex;
    private _createUser: CreateUser;
    private _createApplication: CreateApplication;

    /**
     *
     */
    constructor( @inject(TYPES.PingServer) pingServer: PingServer,
        @inject(TYPES.CreateMessagesIndex) createMessagesIndex: CreateMessagesIndex,
        @inject(TYPES.CreateUser) createUser: CreateUser,
        @inject(TYPES.CreateApplication) createApplication: CreateApplication) {
        this._pingServer = pingServer;
        this._createMessagesIndex = createMessagesIndex;
        this._createUser = createUser;
        this._createApplication = createApplication;
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
            name: 'Administrator',
            password: 'password',
            permissions: ['admin']
        };
        this._createApplication.app = <Application>{
            name: 'Marinet',
            query: 'application: marinet'
        } 
        console.log('Starting setup');
        return this._createUser.exec().then(user => {
            this._createApplication.app.users = [user._id];
            return Promise.all([
                this._createMessagesIndex.exec(),
                this._createApplication.exec()]);
        })

    }
}