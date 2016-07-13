import { injectable, inject } from 'inversify';
import { Command, CreateMD5 } from './';
import { Client, IndexDocumentParams } from 'elasticsearch';

import { Message } from '../models';

import { TYPES } from '../types';

@injectable()
export class CreateMessagesIndex implements Command {

    private _client: Client;

    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client) {
        this._client = client;
    }

    public exec(): Promise {

        return new Promise((resolver, reject) => {
            this._client.indices.create({
                "index": "messages", "body": {
                    "mappings": {
                        "message": {
                            "properties": {
                                "message": {
                                    "type": "string",
                                    "index": "not_analyzed"
                                }
                            }
                        }
                    }
                }
            }).then(result => {
                resolver(result);
            }, err => {
                reject(err);
            });
        });
    }
}