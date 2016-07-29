/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { ObjectID } from 'mongodb';
import { Request } from 'express';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { CreateComment } from '../../lib/commands';
import { GetComments } from '../../lib/queries';
import { Config, Comment } from '../../lib/models';
import { CommentsController } from '../../lib/controllers';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Comments controller', () => {

    let controller: CommentsController;
    let createComment: TypeMoq.Mock<CreateComment>;
    let getComments: TypeMoq.Mock<GetComments>;
    let request: Request;

    describe('When calling POST /api/comments', () => {
        let comment: Comment = <Comment>{
            hash: 'hash',
            message: 'Message',
            userEmail: 'user@mail.com',
            userName: 'User Name',
            userRole: 'Administrator',
        };

        beforeEach(() => {
            request = <Request>{
                user: { _id: new Object() },
                body: comment
            };

            let commentCreated = <any>comment;
            commentCreated._id = new ObjectID();
            commentCreated.createdAt = new Date();

            createComment = TypeMoq.Mock.ofType(CreateComment);
            createComment.setup(c => c.exec()).returns(() => Promise.resolve(commentCreated));
            controller = new CommentsController(createComment.object, undefined);
        });

        it('should return created comment', () => {
            return expect(controller.post(request)).to.eventually.be.ok;
        });

        it('should have an id', () => {
            return expect(controller.post(request)).to.eventually.have.property('_id').ok;
        });

        it('should have creation date', () => {
            return expect(controller.post(request)).to.eventually.have.property('createdAt').ok;
        });
    });

    describe('When calling GET /api/comments/:hash', () => {
        beforeEach(() => {
            request = <Request>{
                user: { _id: new Object() },
                params: { hash: 'hash' }
            };

            let comment: Comment = <Comment>{
                hash: 'hash',
                message: 'Message',
                userEmail: 'user@mail.com',
                userName: 'User Name',
                userRole: 'Administrator',
            };

            getComments = TypeMoq.Mock.ofType(GetComments);
            getComments.setup(c => c.exec()).returns(() => Promise.resolve([comment]));
            controller = new CommentsController(undefined, getComments.object);
        });

        it('should return comments', () => {
            return expect(controller.get(request)).to.eventually.be.ok;
        });
    });
});