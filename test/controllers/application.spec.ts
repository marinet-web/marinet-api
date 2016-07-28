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
});