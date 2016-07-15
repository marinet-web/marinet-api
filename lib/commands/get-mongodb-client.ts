import { injectable, inject } from 'inversify';
import { MongoClient, Server, Db } from 'mongodb';
import { Promise } from 'es6-promise';

import { Command } from './';

import { TYPES } from '../types';

/**
 * GetMongoDB
 */
@injectable()
export class GetMongoDB implements Command {
    private _client: MongoClient;

    constructor() {
        this._client = new MongoClient();
    }

    public exec(): Promise<Db> {
        return new Promise<Db>((resolver, reject) => {
            console.log(`Connecting to ${process.env.MONGOLAB_URI}`);
            this._client.connect(process.env.MONGOLAB_URI || 'mongodb://localhost27017',
                (err, db) => {
                    if(err) return reject(err);
                    console.log(`Connected to ${process.env.MONGOLAB_URI}`);
                    resolver(db);
                });
        });
    }
}

