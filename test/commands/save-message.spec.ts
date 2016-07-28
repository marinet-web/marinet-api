/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Client, IndexDocumentParams, Indices } from 'elasticsearch';

import { SaveMessage, CreateMD5 } from '../../lib/commands';
import { Config, Message } from '../../lib/models';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Save message command', () => {

    let createMD5: TypeMoq.Mock<CreateMD5>;
    let client: Client;

    beforeEach(() => {
        createMD5 = TypeMoq.Mock.ofType(CreateMD5);
    });

    describe('When calling exec()', () => {
        let message: Message;
        let config = <Config>{ appSecret: "secret" };

        beforeEach(() => {
            message = <Message>{
                message: "Error test! Try not to catch this!",
                exception: "Error: Error test! Try to catch this!",
                createdAt: new Date("2016-07-06T22:02:11.000Z"),
                level: "error",
                application: "marinet"
            };
            createMD5.setup(c => c.exec())
                .returns(() => Promise.resolve('5decaa03cef9c304868860ee8d26549f'));

            client = <Client>{
                update: (params) => {
                    return {
                        then: (result, err) => {
                            result({
                                "_index": "messages",
                                "_type": "message",
                                "_id": "5decaa03cef9c304868860ee8d26549f",
                                "_version": 1,
                                "_shards": {
                                    "total": 2,
                                    "successful": 2,
                                    "failed": 0
                                }
                            })
                        }
                    };
                }
            }
        });

        it('should return ok', () => {
            let command = new SaveMessage(client, createMD5.object);
            command.message = message;
            return expect(command.exec()).to.eventually.be.ok;
        });

        describe('If hash already exists', () => {

            beforeEach(() => {
                client = <Client>{
                    update: (params) => {
                        return {
                            then: (result, err) => {
                                result({
                                    "_index": "messages",
                                    "_type": "message",
                                    "_id": "5decaa03cef9c304868860ee8d26549f",
                                    "_version": 2,
                                    "_shards": {
                                        "total": 2,
                                        "successful": 2,
                                        "failed": 0
                                    }
                                })
                            }
                        };
                    }
                }
            });

            it('should increase message count', () => {
                let command = new SaveMessage(client, createMD5.object);
                command.message = message;
                return expect(command.exec()).to.eventually.have.property('_version').eq(2);
            });
        });

        describe('If message is undefined', () => {
            it('should throw', () => {
                message = undefined;
                let command = new SaveMessage(client, createMD5.object);
                command.message = message;
                return expect(command.exec()).to.be.rejected;
            });
        });

         describe('If message is empty', () => {
            it('should throw', () => {
                message = <Message>{};
                let command = new SaveMessage(client, createMD5.object);
                command.message = message;
                return expect(command.exec()).to.be.rejected;
            });
        });
    });
});