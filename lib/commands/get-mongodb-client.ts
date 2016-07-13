import { injectable, inject } from 'inversify';
import { MongoClient, Server, Db } from 'mongodb';

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
            this._client.connect(process.env.MONGODB_URL || 'mongodb://localhost27017',
                (err, db) => {
                    if(err) return reject(err);
                    resolver(db);
                });
        });
    }
}

