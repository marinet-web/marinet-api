/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Request } from 'express';
import { ObjectID } from 'mongodb';

import { ApplicationController } from '../../lib/controllers';
import { CreateApplication } from '../../lib/commands';
import { QueryApplications, GetApplication } from '../../lib/queries';
import { Application } from '../../lib/models';
import { TYPES } from '../../lib/types';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Application controller', () => {

    let controller: ApplicationController;
    let createApplication: TypeMoq.Mock<CreateApplication>;
    let queryApplications: TypeMoq.Mock<QueryApplications>;
    let getApplication: TypeMoq.Mock<GetApplication>;
    let request: Request;

    beforeEach(() => {
        createApplication = TypeMoq.Mock.ofType(CreateApplication);
        queryApplications = TypeMoq.Mock.ofType(QueryApplications);
        getApplication = TypeMoq.Mock.ofType(GetApplication);
    });

    describe('When calling GET /api/applications', () => {

        beforeEach(() => {
            request = <Request>{ user: { _id: new ObjectID() } };
            queryApplications.setup(c => c.exec())
                .returns(() => Promise.resolve([<Application>{
                    name: 'Appname'
                }]));
            controller = new ApplicationController(queryApplications.object,
                createApplication.object,
                getApplication.object);
        });

        it('should return applications list', () => {
            return expect(controller.query(request)).to.eventually.be.length(1);
        });

        describe('If user has no applications', () => {

            beforeEach(() => {
                queryApplications = TypeMoq.Mock.ofType(QueryApplications);
                request = <Request>{ user: { _id: new ObjectID() } };
                queryApplications.setup(c => c.exec())
                    .returns(() => Promise.resolve([]));
                controller = new ApplicationController(queryApplications.object,
                    createApplication.object,
                    getApplication.object);
            });

            it('should return empty list', () => {
                return expect(controller.query(request)).to.eventually.be.empty;
            });
        });
    });

    describe('When calling GET /api/applications/:id', () => {
        beforeEach(() => {
            let id = new ObjectID();
            request = <Request>{
                params: { id: id },
                user: { _id: new ObjectID() }
            };
            getApplication.setup(c => c.exec())
                .returns(() => Promise.resolve(<Application>{
                    name: 'Appname'
                }));
            controller = new ApplicationController(queryApplications.object,
                createApplication.object,
                getApplication.object);
        });

        it('should return application', () => {
            return expect(controller.get(request)).to.eventually.be.ok;
        });

        describe('If user has no access to this application', () => {
            beforeEach(() => {
                let id = new ObjectID();
                getApplication = TypeMoq.Mock.ofType(GetApplication);

                request = <Request>{
                    params: { id: id },
                    user: { _id: new ObjectID() }
                };
                getApplication.setup(c => c.exec())
                    .returns(() => Promise.resolve(<Application>{}));
                controller = new ApplicationController(queryApplications.object,
                    createApplication.object,
                    getApplication.object);
            });

            it('should return empty', () => {
                return expect(controller.get(request)).to.eventually.be.empty;
            });
        });

        describe('If is not in the DB', () => {
            beforeEach(() => {
                getApplication = TypeMoq.Mock.ofType(GetApplication);

                request = <Request>{
                    params: { id: 'invalid_id' },
                    user: { _id: new ObjectID() }
                };
                getApplication.setup(c => c.exec())
                    .returns(() => Promise.resolve(<Application>{}));
                controller = new ApplicationController(queryApplications.object,
                    createApplication.object,
                    getApplication.object);
            });

            it('should return empty', () => {
                return expect(controller.get(request)).to.eventually.be.empty;
            });
        });

    });

    describe('When calling POST /api/applications', () => {
        let app = <Application>{
            name: "appName",
            query: "application: appName",
            users: []
        };
        beforeEach(() => {
            createApplication = TypeMoq.Mock.ofType(CreateApplication);
            request = <Request>{
                body: app,
                user: { _id: new ObjectID() }
            };

            let appCreated = app;
            appCreated.users = [request.user._id, new ObjectID()];
            appCreated.createdAt = new Date();
            appCreated.token = "token_value";

            createApplication.setup(c => c.exec())
                .returns(() => Promise.resolve(appCreated));
            controller = new ApplicationController(queryApplications.object,
                createApplication.object,
                getApplication.object);
        });

        it('should return application', () => {
            return expect(controller.post(request)).to.eventually.be.ok;
        });

        describe('If app is undefined', () => {
            beforeEach(() => {
                createApplication = TypeMoq.Mock.ofType(CreateApplication);
                request = <Request>{
                    body: undefined,
                    user: { _id: new ObjectID() }
                };

                controller = new ApplicationController(queryApplications.object,
                    createApplication.object,
                    getApplication.object);
            });

            it('should throw', () => {
                return expect(controller.post(request)).to.be.rejected;
            });
        });

        describe('If app is empty', () => {
            beforeEach(() => {
                createApplication = TypeMoq.Mock.ofType(CreateApplication);
                request = <Request>{
                    body: {},
                    user: { _id: new ObjectID() }
                };

                controller = new ApplicationController(queryApplications.object,
                    createApplication.object,
                    getApplication.object);
            });

            it('should throw', () => {
                return expect(controller.post(request)).to.be.rejected;
            });
        });
    });

    describe('When calling DELETE /api/applications', () => {
        it('should throw', () => {
            return expect(controller.delete()).to.be.rejected;
        });
    });
});