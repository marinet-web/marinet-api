import { injectable, inject } from 'inversify';
import { ICommand } from './i-command';
import { Client, IndexDocumentParams } from 'elasticsearch';

import { Message } from '../models';

@injectable()
export class SaveMessage implements ICommand {

    private _client: Client;
    private _message: Message;

    public get message(): any {
        return this._message;
    }

    public set message(v: any) {
        this._message = v;
    }


    /**
     *
     */
    constructor( @inject("Client") client: Client) {
        this._client = client;
    }

    public exec() {
        //TODO: Save message to ElasticSearch
        let index = {
            index: "messages",
            type: "message",
            body: this.message
        };
        
        return this._client.index<Message>(<IndexDocumentParams<Message>>index)
        .then(result => {
            console.log(result);
        }, err =>{
            console.error(err);
        });
    }
}