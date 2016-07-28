/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Client, IndexDocumentParams, Indices } from 'elasticsearch';

import { CreateMessagesIndex } from '../../lib/commands';
import {  } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Create messages index command', () => {

    let client: Client;

    describe('When calling exec()', () => {

        beforeEach(() => {

            client = <Client>{
                indices: <Indices>{
                    create: (params) => {
                        return {
                            then: (result, error) => {
                                result({
                                    "acknowledged": true
                                });
                            }
                        };
                    }
                }
            };
        });

        it('should return true', () => {
            let command = new CreateMessagesIndex(client);
            return expect(command.exec()).to.eventually.have.property('acknowledged').true;
        });

        describe('If index already exists', () => {

            beforeEach(() => {

                client = <Client>{
                    indices: <Indices>{
                        create: (params) => {
                            return {
                                then: (result, error) => {
                                    error({
                                        "error": {
                                            "root_cause": [
                                                {
                                                    "type": "index_already_exists_exception",
                                                    "reason": "already exists",
                                                    "index": "newindex"
                                                }
                                            ],
                                            "type": "index_already_exists_exception",
                                            "reason": "already exists",
                                            "index": "newindex"
                                        },
                                        "status": 400
                                    });
                                }
                            };
                        }
                    }
                };
            });

            it('should throw', (done) => {
                let command = new CreateMessagesIndex(client);
                command.exec().then((result) => {
                    done('Should not be OK');
                }, err =>{
                    expect(err).to.have.property('status').eql(400);
                    done();
                })
            });
        })
    });

});