import { injectable, inject } from 'inversify';
import { MongoClient, Server, Db } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command } from './';

import { TYPES } from '../types';
import { Config } from '../models';

/**
 * GetMongoDB
 */
@injectable()
export class GetMongoDB implements Command {
    private _client: MongoClient;
    private _config: Config;

    constructor(@inject(TYPES.Config) config: Config) {
        this._client = new MongoClient();
        this._config = config;
    }

    

    public exec(): Promise<Db> {
        return new Promise<Db>((resolver, reject) => {
            console.log(`Connecting to ${this._config.mongoUrl}`);
            this._client.connect(this._config.mongoUrl,
                (err, db) => {
                    if(err) return reject(err);
                    console.log(`Connected to ${this._config.mongoUrl}`);
                    resolver(db);
                });
        });
    }
}

