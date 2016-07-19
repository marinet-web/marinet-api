
import { Controller, Get, Post, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';

import { TYPES } from '../types';
import { Comment } from '../models';
import { CreateComment } from '../commands';
import { GetComments } from '../queries';

import * as guard from 'express-jwt-permissions';

@injectable()
@Controller('/api/comments')
export class CommentsController {
    private _createComment: CreateComment;
    private _getComments: GetComments;

    /**
     *
     */
    constructor( @inject(TYPES.CreateComment) createComment: CreateComment,
        @inject(TYPES.GetComments) getComments: GetComments) {
        this._createComment = createComment;
        this._getComments = getComments;
    }

    @Get('/:hash', guard().check(['admin']))
    public get(request: Request) {
        this._getComments.hash = request.params.hash;
        return this._getComments.exec();
    }

    @Post('/', guard().check(['admin']))
    public post(request: Request) {
        console.log(request.body);
        this._createComment.comment = request.body;
        return this._createComment.exec();
    }

}