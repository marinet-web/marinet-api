/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import { Db, Server, Collection, InsertOneWriteOpResult, ObjectID } from "mongodb";
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Kernel } from 'inversify';

import { CreateApplication, CreateUser, GetMongoDB } from '../../lib/commands';
import { Config, Application, User } from '../../lib/models';
import { TYPES } from '../../lib/types';


const expect = chai.expect;
chai.use(chaiAsPromised);


describe('Get mongodb client command', () => {

    let createUser: TypeMoq.Mock<CreateUser>;
    let getMongoDb: TypeMoq.Mock<GetMongoDB>;
    let server: TypeMoq.Mock<Server>;
    let db: TypeMoq.Mock<Db>;

    beforeEach(() => {
        createUser = TypeMoq.Mock.ofType(CreateUser);
        getMongoDb = TypeMoq.Mock.ofType(GetMongoDB);
        server = TypeMoq.Mock.ofType(Server, TypeMoq.MockBehavior.Loose, 'localhost', 27017);
        db = TypeMoq.Mock.ofType(Db, TypeMoq.MockBehavior.Loose, 'dbname', server.object);
    });

    describe('When calling exec()', () => {
        let app: Application;
        let config = <Config>{ appSecret: "secret" };

        beforeEach(() => {

            let collection = <Collection>{
                insert: (param) => {
                    return Promise.resolve(<InsertOneWriteOpResult>{
                        ops: [param]
                    });
                }
            };

            let user = <User>{
                _id: new ObjectID(),
                name: 'user_appName',
                email: 'user@appName',
                password: 'password',
                permissions: ['logger']
            };


            db.setup(c => c.collection(TypeMoq.It.isAnyString())).returns(() => collection);

            getMongoDb.setup(c => c.exec())
                .returns(() => Promise.resolve(db.object));

            createUser.setup(c => c.exec()).returns(() => Promise.resolve(user));
        });

        it('should return mongodb client', () => {
            //expect.fail();
        });
    });
});