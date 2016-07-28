/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Db, Server, Collection, InsertOneWriteOpResult, ObjectID } from "mongodb";
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Kernel } from 'inversify';

import { CreateComment, GetMongoDB } from '../../lib/commands';
import { Config, Comment } from '../../lib/models';
import { TYPES } from '../../lib/types';


const expect = chai.expect;
chai.use(chaiAsPromised);


describe('Create comment command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let comment: Comment;
        let config = <Config>{ appSecret: "secret" };

        beforeEach(() => {

            let collection = <Collection>{
                insert: (param) => {
                    param._id = new ObjectID();
                    return Promise.resolve(<InsertOneWriteOpResult>{
                        ops: [param]
                    });
                }
            };


            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));
        });

        it('should return comment created', () => {
            comment = <Comment>{
                hash: 'message-hash',
                message: 'Test message',
                userEmail: 'user@email.com',
                userName: 'User Name',
                userRole: 'UserRole'
            };
            let command = new CreateComment(getMongoDb.object);
            command.comment = comment;
            return expect(command.exec()).to.eventually.be.ok;
        });

        it('should set createdAt date', () => {
            comment = <Comment>{
                hash: 'message-hash',
                message: 'Test message',
                userEmail: 'user@email.com',
                userName: 'User Name',
                userRole: 'UserRole'
            };
            let command = new CreateComment(getMongoDb.object);
            command.comment = comment;
            return expect(command.exec()).to.eventually.have.property('createdAt').ok;
        });

        it('should set _id property', () => {
            comment = <Comment>{
                hash: 'message-hash',
                message: 'Test message',
                userEmail: 'user@email.com',
                userName: 'User Name',
                userRole: 'UserRole'
            };
            let command = new CreateComment(getMongoDb.object);
            command.comment = comment;
            return expect(command.exec()).to.eventually.have.property('_id').ok;
        });

        describe('With an undefined comment obj', () => {
            it('should throw', () => {
                comment = undefined;
                let command = new CreateComment(getMongoDb.object);
                command.comment = comment;
                return expect(command.exec()).to.be.rejected;
            });

        });

        describe('With an empty comment obj', () => {
            it('should throw', () => {
                comment = <Comment>{};
                let command = new CreateComment(getMongoDb.object);
                command.comment = comment;
                return expect(command.exec()).to.be.rejected;
            });

        });
    });
});