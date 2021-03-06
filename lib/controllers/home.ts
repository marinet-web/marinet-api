
import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { PingServer,
    CreateMessagesIndex,
    CreateUser,
    CreateApplication } from '../commands';

import { TYPES } from '../types';
import { Request, Response } from 'express';
import { Promise } from 'es6-promise';

import { User, Application, Config } from '../models';

@injectable()
@Controller('/')
export class HomeController {
    private _pingServer: PingServer;
    private _createMessagesIndex: CreateMessagesIndex;
    private _createUser: CreateUser;
    private _createApplication: CreateApplication;
    private _config: Config;

    /**
     *
     */
    constructor( @inject(TYPES.PingServer) pingServer: PingServer,
        @inject(TYPES.CreateMessagesIndex) createMessagesIndex: CreateMessagesIndex,
        @inject(TYPES.CreateUser) createUser: CreateUser,
        @inject(TYPES.CreateApplication) createApplication: CreateApplication,
        @inject(TYPES.Config) config: Config) {
        this._pingServer = pingServer;
        this._createMessagesIndex = createMessagesIndex;
        this._createUser = createUser;
        this._createApplication = createApplication;
        this._config = config;
    }

    @Get('/')
    public get(): any {

        return {
            "version": "3.0.0",
            "name": "marinet-api",
            "env": this._config.env
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
            name: 'marinet',
            query: 'application: marinet'
        } 
        console.log('Starting setup');
        return this._createUser.exec().then(user => {
            this._createApplication.app.users = [user._id.toString()];
            return Promise.all([
                this._createMessagesIndex.exec(),
                this._createApplication.exec()]);
        })

    }
}