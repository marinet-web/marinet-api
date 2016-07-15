import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as crypto from 'crypto';

import { Command, GetMongoDB } from './';
import { User } from '../models';
import { TYPES } from '../types';


@injectable()
export class CreateUser implements Command {
    private _getMongoDB: GetMongoDB;
    private _user: User;
    public get user(): User {
        return this._user;
    }
    public set user(v: User) {
        this._user = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB) {
        this._getMongoDB = getMongoDB;
    }

    public exec(): Promise<any> {
        return new Promise((resolver, reject) => {
            this._user.password = crypto.createHash('sha512').update(this._user.password).digest('hex');
            this._getMongoDB.exec().then((db: Db) => {
                db.open();
                db.collection('users').insert(this._user).then(user => {
                    db.close();
                    resolver(user && user.ops && user.ops.length > 0 ? user.ops[0] : null);
                }).catch(err => {
                    db.close();
                    reject(err);
                });
            });
        });
    }
}