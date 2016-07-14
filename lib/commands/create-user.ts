import { injectable, inject } from 'inversify';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

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

    public exec(): Promise {
        return new Promise((resolver, reject) => {
            //TODO: validate user password and return user
            this._getMongoDB.exec().then((db: Db) => {
                db.open();
                db.collection('users').insert(this._user).then(user => {
                    db.close();
                    resolver(jwt.sign(_.omit(user, 'password'),
                        process.env.APP_SECRET,
                        {
                            expiresIn: 60 * 5
                        }));
                }).catch(err => {
                    db.close();
                    reject(err);
                });
            });
        });
    }
}