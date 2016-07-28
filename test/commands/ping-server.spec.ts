/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Client, IndexDocumentParams, Indices } from 'elasticsearch';

import { PingServer } from '../../lib/commands';


const expect = chai.expect;
chai.use(chaiAsPromised);


describe('Ping server command', () => {

    let client: Client;

    describe('When calling exec()', () => {
        beforeEach(() => {
            client = <Client>{
                ping: (params) => {
                    return {
                            then: (result, error) => {
                                result({});
                            }
                        };
                }
            };
        });

        it('should return ping response', () => {
            let command = new PingServer(client);
            return expect(command.exec()).to.eventually.be.ok;
        });
    });
});