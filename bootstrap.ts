import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { KernelModule, Bind } from 'inversify';

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
    GetApplication,
    QueryParser } from './lib/queries';

import { HomeController,
    MessagesController,
    AccountController,
    ApplicationController,
    CommentsController } from './lib/controllers';

import { TAGS } from './lib/tags';
import { TYPES } from './lib/types';

import { config } from './config';
import { Config } from './lib/models';

let controllers = new KernelModule((bind: Bind) => {
    bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
    bind<Controller>(TYPE.Controller).to(ApplicationController).whenTargetNamed(TAGS.ApplicationController);
    bind<Controller>(TYPE.Controller).to(AccountController).whenTargetNamed(TAGS.AccountController);
    bind<Controller>(TYPE.Controller).to(MessagesController).whenTargetNamed(TAGS.MessagesController);
    bind<Controller>(TYPE.Controller).to(CommentsController).whenTargetNamed(TAGS.CommentsController);
});

let queries = new KernelModule((bind: Bind) => {
    bind<QueryMessages>(TYPES.QueryMessages).to(QueryMessages);
    bind<QueryApplications>(TYPES.QueryApplications).to(QueryApplications);
    bind<GetMessageByHash>(TYPES.GetMessageByHash).to(GetMessageByHash);
    bind<GetComments>(TYPES.GetComments).to(GetComments);
    bind<GetApplication>(TYPES.GetApplication).to(GetApplication);
    bind<QueryParser>(TYPES.QueryParser).to(QueryParser);
});

let commands = new KernelModule((bind: Bind) => {
    bind<PingServer>(TYPES.PingServer).to(PingServer);
    bind<SaveMessage>(TYPES.SaveMessage).to(SaveMessage);
    bind<CreateMD5>(TYPES.CreateMD5).to(CreateMD5);
    bind<CreateMessagesIndex>(TYPES.CreateMessagesIndex).to(CreateMessagesIndex);
    bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
    bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
    bind<CreateApplication>(TYPES.CreateApplication).to(CreateApplication);
    bind<CreateComment>(TYPES.CreateComment).to(CreateComment);
});

let infra = new KernelModule((bind: Bind) => {
    bind<Client>(TYPES.Client).toConstantValue(new Client({
        host: config.elastic.url,
        log: config.elastic.log
    }));
    bind<GetMongoDB>(TYPES.GetMongoDB).to(GetMongoDB);
    bind<Config>(TYPES.Config).toConstantValue(config);
});

export { controllers, queries, commands, infra }

