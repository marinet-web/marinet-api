import { Client } from 'elasticsearch';
import { config } from '../config';

export const client = new Client({
    host: config.elastic.url,
    log: config.elastic.log
});


