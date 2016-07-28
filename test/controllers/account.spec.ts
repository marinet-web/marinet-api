/// <reference path="../../node_modules/typemoq/typemoq.d.ts" />
import 'reflect-metadata';
import * as TypeMoq from "typemoq";
import { Promise } from 'es6-promise';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Request, Response } from 'express';
import { ObjectID } from 'mongodb';

import { LoginUser } from '../../lib/commands';
import { Config, Application, User } from '../../lib/models';
import { AccountController } from '../../lib/controllers';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Account controller', () => {

    let controller: AccountController;
    let request: Request;
    let response: Response;
    let loginUser: TypeMoq.Mock<LoginUser>;
    let token: string;

    beforeEach(() => {
        loginUser = TypeMoq.Mock.ofType(LoginUser);
    });

    describe('When calling POST /login', () => {

        beforeEach(() => {
            token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbWFyaW5ldCIsIm5hbWUiOiJ1c2VyX21hcmluZXQiLCJwZXJtaXNzaW9ucyI6WyJsb2dnZXIiXSwiX2lkIjoiNTc5MjMwOTA3MzM2MjYwMDExNzdlYmNmIiwiaWF0IjoxNDY5MTk4NDgxLCJleHAiOjMzMDI2Nzk4NDgxfQ.9ChRru6GPF4oE-nY6BVo6Kr6bYazr2klcd8va7cWHe0';
            loginUser.setup(c => c.exec()).returns(() => Promise.resolve(token));
            controller = new AccountController(loginUser.object);
            request = <Request>{
                query: {
                    password: 'password',
                    username: 'user@mail.com'
                }
            }
        });

        it('shoud return user token', (done) => {
            response = <Response>{
                send: (value) => {
                    expect(value).to.be.eq(token);
                    done();
                    return this;
                }
            };
            controller.login(request, response);
        });

        describe('If username is invalid', () => {

            beforeEach(() => {
                loginUser.setup(c => c.exec()).returns(() => Promise.reject('invalid_user'));
                controller = new AccountController(loginUser.object);
                request = <Request>{
                    query: {
                        password: 'password',
                        username: 'invaliduser'
                    }
                }
            });

            it('shoud return error 401', (done) => {
                response = <Response>{
                    status: (status) => {
                        expect(status).to.be.eq(401);
                        return this;
                    },
                    send: (param) =>{
                        done();
                        return this;
                    }
                };
                controller.login(request, response);
            });
        });

        describe('If password is invalid', () => {

            beforeEach(() => {
                loginUser.setup(c => c.exec()).returns(() => Promise.reject('invalid_user'));
                controller = new AccountController(loginUser.object);
                request = <Request>{
                    query: {
                        password: 'invalid-password',
                        username: 'user@mail.com'
                    }
                }
            });

            it('shoud return error 401', (done) => {
                response = <Response>{
                    status: (status) => {
                        expect(status).to.be.eq(401);
                        return this;
                    },
                    send: (param) =>{
                        done();
                        return this;
                    }
                };
                controller.login(request, response);
            });
        });

        describe('If username is empty', () => {

            beforeEach(() => {
                loginUser.setup(c => c.exec()).returns(() => Promise.reject(''));
                controller = new AccountController(loginUser.object);
                request = <Request>{
                    query: {
                        password: 'password',
                        username: ''
                    },
                    body: {
                        password: '',
                        username: ''
                    }
                }
            });

            it('shoud return error 502', (done) => {
                response = <Response>{
                    status: (status) => {
                        expect(status).to.be.eq(502);
                        return this;
                    },
                    send: (param) =>{
                        done();
                        return this;
                    }
                };
                controller.login(request, response);
            });
        });

        describe('If password is empty', () => {

            beforeEach(() => {
                loginUser.setup(c => c.exec()).returns(() => Promise.reject(''));
                controller = new AccountController(loginUser.object);
                request = <Request>{
                    query: {
                        password: '',
                        username: 'user@mail.com'
                    },
                    body: {
                        password: '',
                        username: ''
                    }
                }
            });

            it('shoud return error 502', (done) => {
                response = <Response>{
                    status: (status) => {
                        expect(status).to.be.eq(502);
                        return this;
                    },
                    send: (param) =>{
                        done();
                        return this;
                    }
                };
                controller.login(request, response);
            });
        });
    });

    describe('When calling GET /me', () => {
        let user;

        beforeEach(() => {
             user = {
                _id: new ObjectID(),
                name: 'User Name',
                email: 'user@mail.com',
                permissions: ['amdin']
            };

            request = <Request>{
                user: user
            };
        });

        it('shoud return user', () => {
             expect(controller.me(request, response)).to.deep.equal(user);
        });

    });
});