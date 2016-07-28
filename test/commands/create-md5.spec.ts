/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { CreateMD5 } from '../../lib/commands';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Create MD5 command', () => {

    describe('When calling exec()', () => {

        it('should return md5 string', () => {
            let myString = "my string";
            let command = new CreateMD5();
            command.value = myString;

            return expect(command.exec()).to.eventually.satisfy((value: string) => {
                return !!value.match(/^[a-f0-9]{32}$/);
            });
        });

        describe('With undefined value', () => {
            it('should return undefined', () => {
                let myString = undefined;
                let command = new CreateMD5();
                command.value = myString;

                return expect(command.exec()).to.eventually.be.undefined;
            });
        });

        describe('With empty value', () => {
            it('should return undefined', () => {
                let myString = "";
                let command = new CreateMD5();
                command.value = myString;

                return expect(command.exec()).to.eventually.satisfy((value: string) => {
                    return !!value.match(/^[a-f0-9]{32}$/);
                });
            });
        });
    });
});