import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { Client } from 'elasticsearch';

import { PingServer,
    SaveMessage,
    CreateMD5,
    CreateMessagesIndex,
    LoginUser,
    GetMongoDB,
    CreateUser,
    CreateApplication,
    CreateComment } from './lib/commands';

import { QueryMessages,
    QueryApplications,
    GetMessageByHash,
    GetComments, 
    GetApplication } from './lib/queries';

import { HomeController,
    MessagesController,
    AccountController,
    ApplicationController,
    CommentsController } from './lib/controllers';

import { TAGS } from './lib/tags';
import { TYPES } from './lib/types';

import { config } from './config';
import { Config } from './lib/models';

let _kernel = new Kernel();

//TODO: Refcator to use decorator binding
_kernel.bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
_kernel.bind<Controller>(TYPE.Controller).to(ApplicationController).whenTargetNamed(TAGS.ApplicationController);
_kernel.bind<Controller>(TYPE.Controller).to(AccountController).whenTargetNamed(TAGS.AccountController);
_kernel.bind<Controller>(TYPE.Controller).to(MessagesController).whenTargetNamed(TAGS.MessagesController);
_kernel.bind<Controller>(TYPE.Controller).to(CommentsController).whenTargetNamed(TAGS.CommentsController);

_kernel.bind<Client>(TYPES.Client).toConstantValue(new Client({
    host: config.elastic.url,
    log: config.elastic.log
}));

_kernel.bind<PingServer>(TYPES.PingServer).to(PingServer);
_kernel.bind<SaveMessage>(TYPES.SaveMessage).to(SaveMessage);
_kernel.bind<QueryMessages>(TYPES.QueryMessages).to(QueryMessages);
_kernel.bind<QueryApplications>(TYPES.QueryApplications).to(QueryApplications);
_kernel.bind<CreateMD5>(TYPES.CreateMD5).to(CreateMD5);
_kernel.bind<CreateMessagesIndex>(TYPES.CreateMessagesIndex).to(CreateMessagesIndex);
_kernel.bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
_kernel.bind<GetMongoDB>(TYPES.GetMongoDB).to(GetMongoDB);
_kernel.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
_kernel.bind<Config>(TYPES.Config).toConstantValue(config);
_kernel.bind<CreateApplication>(TYPES.CreateApplication).to(CreateApplication);
_kernel.bind<GetMessageByHash>(TYPES.GetMessageByHash).to(GetMessageByHash);
_kernel.bind<GetComments>(TYPES.GetComments).to(GetComments);
_kernel.bind<CreateComment>(TYPES.CreateComment).to(CreateComment);
_kernel.bind<GetApplication>(TYPES.GetApplication).to(GetApplication);

export var kernel = _kernel;

