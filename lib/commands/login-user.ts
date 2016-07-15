import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as crypto from "crypto";

import { Command, GetMongoDB } from './';
import { User, Config } from '../models';
import { TYPES } from '../types';

@injectable()
export class LoginUser implements Command {
    private _getMongoDB: GetMongoDB;
    private _user: User;
    private _config: Config;

    public get user(): User {
        return this._user;
    }
    public set user(v: User) {
        this._user = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB,
    @inject(TYPES.Config) config: Config) {
        this._getMongoDB = getMongoDB;
        this._config = config;
    }

    public exec(): Promise<any> {
        return new Promise((resolver, reject) => {
            
            this._user.password = crypto.createHash('sha512')
            .update(this._user.password)
            .digest('hex');

            this._getMongoDB.exec().then((db: Db) => {
                db.open();
                db.collection('users').findOne(this._user).then(user => {
                    db.close();
                    jwt.sign(_.omit(user, 'password'),
                        this._config.appSecret,
                        {
                            expiresIn: 60 * 5
                        }, (err, result) => {
                            resolver(result);
                        });
                }).catch(err => {
                    db.close();
                    reject(err);
                });
            });
        });
    }
}