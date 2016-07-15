import { injectable, inject } from 'inversify';
import { Command } from './command';
import { Client } from 'elasticsearch';
import { Promise } from 'es6-promise';

import { TYPES } from '../types';

@injectable()
export class PingServer implements Command {

    private _client: Client;

    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise<any> {
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