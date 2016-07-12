import { injectable, inject } from 'inversify';
import { IQuery } from './i-query';
import { Client, SearchParams } from 'elasticsearch';
import { Observable } from 'rxjs';

import { Message } from '../models';

@injectable()
export class QueryMessages implements IQuery<Promise<[Message]>> {

    private _client: Client;
    /**
     *
     */
    constructor( @inject("Client") client: Client) {
        this._client = client;
    }

    public exec(): Promise<[Message]> {

        let params: SearchParams = {
            index: 'messages'
        };

        return new Promise<[Message]>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                if (resp && resp.hits && resp.hits.hits) {
                    let result: Message[] = [];
                    resp.hits.hits.forEach(element => {
                        let message: Message = <Message>element._source;
                        message.id = element._id;
                        console.log(message)
                        result.push(message);
                    });
                    return resolve(result);
                }
                return resolve([]);
            });
        });
    }
}