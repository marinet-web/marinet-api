import { injectable, inject } from 'inversify';
import { Command, CreateMD5 } from './';
import { Client, IndexDocumentParams } from 'elasticsearch';
import { Promise } from 'es6-promise';

import { Message } from '../models';

import { TYPES } from '../types';

@injectable()
export class SaveMessage implements Command {

    private _client: Client;
    private _message: Message;
    private _md5Hash: CreateMD5

    public get message(): any {
        return this._message;
    }

    public set message(v: any) {
        this._message = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client,
        @inject(TYPES.CreateMD5) md5Hash: CreateMD5) {
        this._client = client;
        this._md5Hash = md5Hash;
    }

    public exec(): Promise<any> {
        if(!this.message || Object.keys(this.message).length === 0) return Promise.reject('Message cannot be undefined or empty.'); 
        return new Promise((resolver, reject) => {
            this.getHash().then(hash => {
                this.message.count = 1;
                let index = {
                    "index": "messages",
                    "type": "message",
                    "body": {
                        "script": "ctx._source.count += 1",
                        "upsert": this.message
                    },
                    "id": hash
                };

                this._client.update(index)
                    .then(result => {
                        resolver(result);
                    }, err => {
                        reject(err);
                    });


            }, err => reject(err));

        });
    }

    private getHash() {
        this._md5Hash.value = this.message.message + this.message.stackTrace + this.message.application + this.message.environment + this.message.level
        return this._md5Hash.exec();
    }
}