/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Db, Server, Collection, InsertOneWriteOpResult, ObjectID } from "mongodb";
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { CreateApplication, CreateUser, GetMongoDB } from '../../lib/commands';
import { Config, User } from '../../lib/models';


const expect = chai.expect;
chai.use(chaiAsPromised);


describe('Create user command', () => {

    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;

    beforeEach(() => {
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let user: User;
        let config = <Config>{ appSecret: "secret" };

        beforeEach(() => {

            user = <User>{
                name: 'User Name',
                password: 'mypassword',
                permissions: ['admin'],
                email: 'user@mail.com'
            };

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

        it('should return user created', () => {

            let command = new CreateUser(getMongoDb.object);
            command.user = user;
            return expect(command.exec()).to.eventually.satisfy((value) => {
                return value.name === user.name &&
                    value.permissions === user.permissions &&
                    value.email === user.email;
            });
        });

        it('should encrypt password', () => {
            let password = user.password;
            let command = new CreateUser(getMongoDb.object);
            command.user = user;
            return expect(command.exec()).to.eventually.have.property('password').not.eq(password);
        });

        describe('With undefined user', () => {
            it('should throw', () => {
                user = undefined;
                let command = new CreateUser(getMongoDb.object);
                command.user = user;
                return expect(command.exec()).to.be.rejected;
            });
        });

        describe('With empty user', () => {
            it('should throw', () => {
                user = <User>{};
                let command = new CreateUser(getMongoDb.object);
                command.user = user;
                return expect(command.exec()).to.be.rejected;
            });
        });
    });
});