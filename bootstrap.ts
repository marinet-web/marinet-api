import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { Client } from 'elasticsearch';
import { client } from './lib/get-elastic-search-client';

import { PingServer,
    SaveMessage,
    CreateMD5,
    CreateMessagesIndex,
    LoginUser,
    GetMongoDB, 
    CreateUser } from './lib/commands';

import { QueryMessages } from './lib/queries';

import { HomeController,
    MessagesController,
    AccountController,
    ApplicationController } from './lib/controllers';

import { TAGS } from './lib/tags';
import { TYPES } from './lib/types';

let _kernel = new Kernel();

//TODO: Refcator to use decorator binding
_kernel.bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
_kernel.bind<Controller>(TYPE.Controller).to(ApplicationController).whenTargetNamed(TAGS.ApplicationController);
_kernel.bind<Controller>(TYPE.Controller).to(AccountController).whenTargetNamed(TAGS.AccountController);
_kernel.bind<Controller>(TYPE.Controller).to(MessagesController).whenTargetNamed(TAGS.MessagesController);

_kernel.bind<Client>(TYPES.Client).toConstantValue(client);
_kernel.bind<PingServer>(TYPES.PingServer).to(PingServer);
_kernel.bind<SaveMessage>(TYPES.SaveMessage).to(SaveMessage);
_kernel.bind<QueryMessages>(TYPES.QueryMessages).to(QueryMessages);
_kernel.bind<CreateMD5>(TYPES.CreateMD5).to(CreateMD5);
_kernel.bind<CreateMessagesIndex>(TYPES.CreateMessagesIndex).to(CreateMessagesIndex);
_kernel.bind<LoginUser>(TYPES.LoginUser).to(LoginUser);
_kernel.bind<GetMongoDB>(TYPES.GetMongoDB).to(GetMongoDB);
_kernel.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);

export var kernel = _kernel;

