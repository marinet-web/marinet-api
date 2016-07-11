import { injectable, inject } from 'inversify';
import { ICommand } from './i-command';
import { Client } from 'elasticsearch';

@injectable()
export class PingServer implements ICommand{
    
    private _client: Client;
    
    /**
     *
     */
    constructor(@inject("Client") client: Client) {
        this._client = client;
    }
    
    public exec() {
        this._client.ping({hello: "It works"});
    }
}