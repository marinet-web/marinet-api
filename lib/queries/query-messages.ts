import { injectable, inject } from 'inversify';
import { Query, QueryParser } from './';
import { Client, SearchParams } from 'elasticsearch';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { Message, QueryResult } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class QueryMessages implements Query<Promise<QueryResult<Message>>> {

    private _client: Client;
    private _streamFilter: string;
    private _parser: QueryParser;
    private _term: string;
    private _page : number;

    public get term(): string {
        return this._term;
    }
    public set term(v: string) {
        this._term = v;
    }

    public get streamFilter(): string {
        return this._streamFilter;
    }

    public set streamFilter(v: string) {
        this._streamFilter = v;
    }
    
    public get page() : number {
        return this._page || 1;
    }
    public set page(v : number) {
        this._page = v;
    }

    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client,
        @inject(TYPES.QueryParser) parser: QueryParser) {
        this._client = client;
        this._parser = parser;
    }

    public exec(): Promise<QueryResult<Message>> {

        let json = this.streamFilter
            ? JSON.parse(this.parse(this.streamFilter))
            : null;

        let pageSize: number = 10;

        let params: any = {
            "index": "messages",
            "from": ((this.page) - 1) * pageSize,
            "size": pageSize,
            "body": {
                "query": {
                    "filtered": {}
                }
            }
        };

        let query = this._parser.parse(this.term);

        if (json) {
            let filter = {
                "filter": {
                    "term": json
                }
            };
            params.body.query.filtered = _.merge(params.body.query.filtered, filter);

        }

        if (query) {
            params.suggestField = "exception";
            params.suggestSize = 5;
            params.suggestText = this.term;
            params.body.query.filtered = _.merge(params.body.query.filtered, query);
        }

        return new Promise<QueryResult<Message>>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                //TODO: Use msearch to get total size
                let count: number = 0;
                let suggestions: [string] = <[string]>[];
                if (resp && resp.hits) {
                    count = resp.hits.total;
                    let result: Message[] = [];

                    resp.hits.hits.forEach(element => {
                        let message: Message = <Message> element._source;
                        message.id = element._id;
                        result.push(message);
                    });

                    if (resp.suggest && resp.suggest.exception) {
                        resp.suggest.exception.forEach((suggestion) => {
                            suggestion.options.forEach((option) => {
                                suggestions.push(option.text);
                            });
                        })
                    }
                    return resolve(<QueryResult<Message>>{
                        currentPage: this.page,
                        totalPages: Math.ceil(count / pageSize),
                        totalSize: count,
                        sort: 0,
                        suggestions: suggestions,
                        data: result
                    });
                }
                return resolve(<QueryResult<Message>>{
                    currentPage: this.page,
                    totalPages: 1,
                    totalSize: 0,
                    sort: 0,
                    suggestions: [],
                    data: []
                });
            });
        });
    }

    //TODO: Create query parser
    private parse(value): string {
        let pieces = value.split(':');

        return `{${pieces.map((item) => {
            return "\"" + item.trim() + "\"";
        }).join(':')}}`;
    }
}