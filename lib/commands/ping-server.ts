import { injectable, inject } from 'inversify';
import { ICommand } from './i-command';
import { Client } from 'elasticsearch';

import { TYPES } from '../types';

@injectable()
export class PingServer implements ICommand {

    private _client: Client;

    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise {
        return new Promise((resolver, reject) => {
            this._client.ping({ hello: "It works" })
            .then(resp => {
                resolver(resp);
            }, 
            err => {
                reject(err);
            })
        });
    }
}