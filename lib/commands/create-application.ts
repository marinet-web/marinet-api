import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import { v1 } from 'node-uuid';

import { Command, GetMongoDB, CreateUser } from './';
import { Application, User, Config } from '../models';
import { TYPES } from '../types';


@injectable()
export class CreateApplication implements Command {
    private _getMongoDB: GetMongoDB;
    private _app: Application;
    private _createUser: CreateUser;
    private _config: Config;

    public get app(): Application {
        return this._app;
    }
    public set app(v: Application) {
        this._app = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB,
    @inject(TYPES.CreateUser) createUser: CreateUser,
    @inject(TYPES.Config) config: Config) {
        this._getMongoDB = getMongoDB;
        this._createUser = createUser
        this._config = config;
    }

    public exec(): Promise<any> {
        
        return new Promise((resolver, reject) => {
            this._createUser.user = <User>{
                email: `user@${this._app.name}`,
                name: `user_${this._app.name}`,
                password: v1(),
                permissions: ['logger']
            }
            this._createUser.exec()
            .then((user) => {
                return this._getMongoDB.exec()
                .then((db) => {
                    //TODO: Create a token command
                    jwt.sign(_.omit(user, 'password'),
                        this._config.appSecret,
                        {
                            expiresIn: '1000y'
                        }, (err, token) => {
                            if(err) return reject(err);
                            this._app.token = token;
                            
                            if(!this._app.users) this._app.users = <[string]>[];

                            this._app.users.push(user._id);
                            this._app.createdAt = new Date();
                            db.collection('applications').insert(this._app)
                            .then((value) =>{
                                resolver(value && value.ops && 0 < value.ops.length 
                                ? value.ops[0] : null);
                            })
                            .catch(reject);
                        });
                    
                });
            })
            .catch(reject);
        });
    }
}