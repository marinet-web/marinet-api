import { injectable, inject } from 'inversify';
import { Db, ObjectID } from 'mongodb';
import { Query } from './';
import { GetMongoDB } from '../commands';

import { Application } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class GetApplication implements Query<Promise<Application>> {

    private _getMongo: GetMongoDB;
    private _userId: string;
    private _id: string;

    public get userId(): string {
        return this._userId;
    }
    public set userId(v: string) {
        this._userId = v;
    }

    public get id(): string {
        return this._id;
    }
    public set id(v: string) {
        this._id = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongo: GetMongoDB) {
        this._getMongo = getMongo;
    }

    public exec(): Promise<Application> {
        
            return this._getMongo.exec().then((db: Db) => {
                return db.collection('applications').findOne({
                    "_id": new ObjectID(this._id),
                    "users": {
                        "$all": [new ObjectID(this._userId)]
                    }
                });
            });
    }
}