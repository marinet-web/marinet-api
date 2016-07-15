export interface ElasticConfig {
    url: string,
    log: string
}

export interface Config{
    appPort: number;
    appSecret: string,
    originsWhitelist: [string],
    mongoUrl: string,
    elastic: ElasticConfig,
    env: string
}