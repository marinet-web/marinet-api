import { injectable, inject } from 'inversify';
import { Db, ObjectID } from 'mongodb';
import { Query } from './';
import { GetMongoDB } from '../commands';

import { Application } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class QueryApplications implements Query<Promise<[Application]>> {

    private _getMongo: GetMongoDB;


    private _userId: string;
    public get userId(): string {
        return this._userId;
    }
    public set userId(v: string) {
        this._userId = v;
    }


    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongo: GetMongoDB) {
        this._getMongo = getMongo;
    }

    public exec(): Promise<[Application]> {
        return new Promise<[Application]>((resolver, reject) => {
            this._getMongo.exec().then((db: Db) => {
                let cursor = db.collection('applications').find({
                    "users": this._userId
                });

                let arr: [Application]= <[Application]>[];

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