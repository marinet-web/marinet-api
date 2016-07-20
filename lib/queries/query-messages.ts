import { injectable, inject } from 'inversify';
import { Query, QueryParser } from './';
import { Client, SearchParams } from 'elasticsearch';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { MessageAggregation, QueryResult } from '../models';

import { TYPES } from '../types';

import { Promise } from 'es6-promise';

@injectable()
export class QueryMessages implements Query<Promise<QueryResult<MessageAggregation>>> {

    private _client: Client;
    private _streamFilter: string;
    private _parser: QueryParser;
    private _term: string;

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


    /**
     *
     */
    constructor( @inject(TYPES.Client) client: Client,
        @inject(TYPES.QueryParser) parser: QueryParser) {
        this._client = client;
        this._parser = parser;
    }

    public exec(): Promise<QueryResult<MessageAggregation>> {

        let json = this.streamFilter
            ? JSON.parse(this.parse(this.streamFilter))
            : null;

        let params: any = {
            "index": "messages",
            "size": 0,
            "body": {
                "aggs": {
                    "same_messages": {
                        "terms": { "field": "hash" },
                        "aggs": {
                            "message": {
                                "terms": {
                                    "field": "message"
                                }
                            },
                            "datetime": {
                                "terms": {
                                    "field": "createdAt"
                                }
                            }
                        }
                    }
                },
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


        return new Promise<QueryResult<MessageAggregation>>((resolve, reject) => {
            this._client.search(params, (err, resp) => {
                if (err) return reject(err);
                //TODO: Use msearch to get total size
                let count: number = 0;
                let suggestions: [string] = <[string]>[];
                if (resp && resp.hits && resp.aggregations) {
                    let result: MessageAggregation[] = [];

                    resp.aggregations.same_messages.buckets.forEach(element => {
                        let message: MessageAggregation = <MessageAggregation>{};
                        message.hash = element.key;
                        message.message = element.message.buckets[0].key;
                        message.createdAt = element.datetime.buckets[0].key_as_string;
                        message.count = element.doc_count;
                        count++;
                        result.push(message);
                    });

                    if (resp.suggest && resp.suggest.exception) {
                        resp.suggest.exception.forEach((suggestion) => {
                            suggestion.options.forEach((option) => {
                                suggestions.push(option.text);
                            });
                        })
                    }
                    return resolve(<QueryResult<MessageAggregation>>{
                        currentPage: 1,
                        totalPages: 1,
                        totalSize: count,
                        sort: 0,
                        suggestions: suggestions,
                        data: result
                    });
                }
                return resolve(<QueryResult<MessageAggregation>>{
                    currentPage: 1,
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