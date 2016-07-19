import { Config, ElasticConfig } from '../lib/models';

export const config: Config = <Config>{
    appPort: process.env.PORT || 3000,
    appSecret: process.env.APP_SECRET || 'app secret key!',
    originsWhitelist: (<string>(process.env.ORIGINS_WHITELIST || 'localhost')).split(','),
    mongoUrl: process.env.MONGOLAB_URI || 'mongodb://localhost27017',
    elastic: <ElasticConfig>{
        url: process.env.SEARCHBOX_URL || 'localhost:9200',
        log: process.env.ELASTIC_LOG_LEVEL || 'trace'
    },
    env: process.env.NODE_ENV || "development"
}