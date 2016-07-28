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
        if(!this.user || Object.keys(this.user).length === 0) return Promise.reject('User cannot be undefined or empty.');
        return new Promise((resolver, reject) => {

            this._getMongoDB.exec().then((db: Db) => {
                this._user.password = crypto.createHash('sha512')
                    .update(this._user.password)
                    .digest('hex');

                db.collection('users').findOne(this._user).then(user => {
                    if (!user) return reject('invalid_user');
                    jwt.sign(_.omit(user, 'password'),
                        this._config.appSecret,
                        {
                            expiresIn: "2h"
                        }, (err, result) => {
                            resolver(result);
                        });
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
}