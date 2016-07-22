import { injectable, inject } from 'inversify';
import { Query } from './';
import { Client, SearchParams } from 'elasticsearch';

import { Message } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class GetMessageByHash implements Query<Promise<Message>> {

    private _client: Client;
    private _hash: string;

    public get hash(): string {
        return this._hash;
    }
    public set hash(v: string) {
        this._hash = v;
    }


    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise<Message> {

        let params: any = {
            "index": "messages",
            "type": "message",
            "id": this.hash
        };

        return new Promise<Message>((resolve, reject) => {
            this._client.get(params, (err, resp) => {
                if (err) return reject(err);
                if (resp.found) {
                    let message: Message = <Message>resp._source;
                    message.id = resp._id;
                    return resolve(message);
                }
                return resolve(null);
            });
        });
    }
}