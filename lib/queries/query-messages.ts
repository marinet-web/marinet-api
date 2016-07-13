import { injectable, inject } from 'inversify';
import { Query } from './query';
import { Client, SearchParams } from 'elasticsearch';
import { Observable } from 'rxjs';

import { MessageAggregation } from '../models';

import { TYPES } from '../types';

@injectable()
export class QueryMessages implements Query<Promise<[Message]>> {

    private _client: Client;
    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise<[MessageAggregation]> {

        let params: any = {
            "index": "messages",
            "size": 0,
            "body": {
                "aggs": {
                    "same_messages": {
                        "terms": { "field": "hash" },
                        "aggs": {
                            "message": {
                                "terms": {
                                    "field": "message"
                                }
                            },
                            "datetime": {
                                "terms": {
                                    "field": "createdAt"
                                }
                            }
                        }
                    }

                }
            }
        };

        return new Promise<[MessageAggregation]>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                if (resp && resp.hits && resp.aggregations) {
                    let result: MessageAggregation[] = [];
                    resp.aggregations.same_messages.buckets.forEach(element => {
                        let message: MessageAggregation = <MessageAggregation>{};
                        message.hash = element.key;
                        message.message = element.message.buckets[0].key;
                        message.createdAt = element.datetime.buckets[0].key_as_string;
                        message.count = element.doc_count;
                        result.push(message);
                    });
                    return resolve(result);
                }
                return resolve([]);
            });
        });
    }
}