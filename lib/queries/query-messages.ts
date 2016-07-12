import { injectable, inject } from 'inversify';
import { IQuery } from './i-query';
import { Client, SearchParams } from 'elasticsearch';
import { Observable } from 'rxjs';

import { Message } from '../models';

import { TYPES } from '../types';

@injectable()
export class QueryMessages implements IQuery<Promise<[Message]>> {

    private _client: Client;
    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise<[Message]> {

        let params: any = {
            "index": "messages",
            "size": 0,
            "body": {
                "aggs": {
                    "same_messages": {
                        "terms": { "field": "hash" }
                    }
                    
                }
            }
        };

        return new Promise<[Message]>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                if (resp && resp.hits && resp.aggregations) {
                    let result: Message[] = [];
                    resp.aggregations.same_messages.buckets.forEach(element => {
                        let message: Message = <Message>element;
                        //message.id = element._id;
                        result.push(message);
                    });
                    return resolve(result);
                }
                return resolve([]);
            });
        });
    }
}