
import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { PingServer, CreateMessagesIndex } from '../commands';

import { TYPES } from '../types';

@injectable()
@Controller('/')
export class HomeController {
    private _pingServer: PingServer;
    private _createMessagesIndex: CreateMessagesIndex;

    /**
     *
     */
    constructor( @inject(TYPES.PingServer) pingServer: PingServer,
    @inject(TYPES.CreateMessagesIndex) createMessagesIndex: CreateMessagesIndex) {
        this._pingServer = pingServer;
        this._createMessagesIndex = createMessagesIndex;
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
    public setup(): any {

       return this._createMessagesIndex.exec();
       
    }
}