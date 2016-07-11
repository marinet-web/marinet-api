import { Client } from 'elasticsearch';

export const client = new Client({
    host: process.env.ELASTIC_URL || 'localhost:9200',
    log: process.env.ELASTIC_LOG_LEVEL || 'trace'
});


