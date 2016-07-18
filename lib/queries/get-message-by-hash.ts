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
            "size": 1,
            "body": {
                "query": {
                    "bool": {
                        "filter": {
                            "term": { "hash": this.hash }
                        }
                    }
                }
            }
        };

        return new Promise<Message>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                if (resp && resp.hits) {
                    let message: Message;
                    resp.hits.hits.forEach(element => {
                        message = <Message>element._source;
                        message.count = resp.hits.total;
                    });
                    return resolve(message);
                }
                return resolve(null);
            });
        });
    }
}