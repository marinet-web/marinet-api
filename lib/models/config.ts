interface ElasticConfig {
    url: string,
    log: string
}

interface Config{
    appPort: number;
    appSecret: string,
    originsWhitelist: [string],
    mongoUrl: string,
    elastic: ElasticConfig,
    env: string
}

export { ElasticConfig, Config }