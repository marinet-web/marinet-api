import { Promise } from 'es6-promise';

export interface Command{
    exec(): Promise<any>;
}