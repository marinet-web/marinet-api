import { injectable, inject } from 'inversify';
import { Db, ObjectID } from 'mongodb';
import { Query } from './';
import { GetMongoDB } from '../commands';

import { Comment } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class GetComments implements Query<Promise<[Comment]>> {

    private _getMongo: GetMongoDB;


    private _hash: string;
    public get hash(): string {
        return this._hash;
    }
    public set hash(v: string) {
        this._hash = v;
    }


    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongo: GetMongoDB) {
        this._getMongo = getMongo;
    }

    public exec(): Promise<[Comment]> {
        return new Promise<[Comment]>((resolver, reject) => {
            this._getMongo.exec().then((db: Db) => {
                let cursor = db.collection('comments').find({
                    "hash": this.hash
                });

                let arr: [Comment]= <[Comment]>[];

                cursor.forEach((app) => {
                 arr.push(app);
                }, (err) => {
                    if(err) return reject(err);
                    resolver(arr);
                });
                
            }).catch(reject);
        });
    }
}