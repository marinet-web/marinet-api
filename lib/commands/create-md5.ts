import { injectable, inject } from 'inversify';
import { Command } from './command';
import md5 = require('md5');
import { Promise } from 'es6-promise';

import { TYPES } from '../types';

@injectable()
export class CreateMD5 implements Command {

    
    private _value : string;
    public get value() : string {
        return this._value;
    }
    public set value(v : string) {
        this._value = v;
    }
    

    /**
     *
     */
    constructor() { }

    public exec(): Promise<any> {
        return new Promise((resolver, reject) => {
            try{
                resolver(md5(this._value));
            }catch(e){
                reject(e);    
            }
        });
    }
}