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

        let index = {
            "index": "messages",
            "type": "message",
            "body": this.message,

        };

        return new Promise((resolver, reject) => {
            this.getHash().then(hash => {
                this.message.hash = hash;
                this._client.index<Message>(<IndexDocumentParams<Message>>index)  
                .then(result => {
                        resolver(result);
                    }, err => {
                        reject(err);
                    });
                
                  
            }, err => reject(err));

        });
    }

    private getHash() {
        this._md5Hash.value = this.message.message + this.message.stackTrace + this.message.application + this.message.environment
        return this._md5Hash.exec();
    }
}