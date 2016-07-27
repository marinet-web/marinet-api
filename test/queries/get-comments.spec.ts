/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { CreateApplication, CreateUser, GetMongoDB } from '../../lib/commands';
import { Config, Application, User } from '../../lib/models';
import { TYPES } from '../../lib/types';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Get comments query', () => {

    beforeEach(() => {
    });

    describe('When calling exec()', () => {

        it('should return comments', () => {
            expect.fail();
        });
    });
});