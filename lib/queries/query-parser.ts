import { injectable, inject } from 'inversify';

@injectable()
export class QueryParser {
    private _pattern: string = '(([a-z]+): "([^"]+)")';

    public parse(text: string): any {
        let regex = new RegExp(this._pattern, 'g');
        let matches;
        let expression: any = undefined;

        if(!text) return expression;

        while (matches = regex.exec(text)) {
            if (!expression) expression = { "query": {"match": {}} };
            expression.query.match[matches[1]] = matches[2];
        }

        if (!expression) {
            expression = {
                "query": {
                    "multi_match": {
                        "query": text,
                        "type": "phrase",
                        "fields": ["message", "exception"]
                    }
                }
            }
        }

        return expression;
    }
}