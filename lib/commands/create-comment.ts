import { injectable, inject } from 'inversify';
import { Promise } from 'es6-promise';

import { Db } from 'mongodb';

import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

import { Command, GetMongoDB } from './';
import { Comment } from '../models';
import { TYPES } from '../types';


@injectable()
export class CreateComment implements Command {
    private _getMongoDB: GetMongoDB;
    private _comment: Comment;

    public get comment(): Comment {
        return this._comment;
    }
    public set comment(v: Comment) {
        this._comment = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.GetMongoDB) getMongoDB: GetMongoDB) {
        this._getMongoDB = getMongoDB;
    }

    public exec(): Promise<any> {
        this._comment.createdAt = new Date();
        return new Promise((resolver, reject) => {
            return this._getMongoDB.exec()
                .then((db) => {
                    return db.collection('comments').insert(this._comment)
                        .then((value) => {
                            resolver(value && value.ops && 0 < value.ops.length
                                ? value.ops[0] : null);
                        });
                })
                .catch(reject);
        });
    }
}