import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { Client } from 'elasticsearch';
import { client } from './lib/get-elastic-search-client';

import { PingServer, SaveMessage } from './lib/commands';
import { QueryMessages } from './lib/queries';
import { HomeController,
    MessagesController,
    AccountController,
    ApplicationController } from './lib/controllers';

import { TAGS } from './lib/tags';

let _kernel = new Kernel();

//TODO: Refcator to use decorator binding
_kernel.bind<Controller>(TYPE.Controller).to(HomeController).whenTargetNamed(TAGS.HomeController);
_kernel.bind<Controller>(TYPE.Controller).to(ApplicationController).whenTargetNamed(TAGS.ApplicationController);
_kernel.bind<Controller>(TYPE.Controller).to(AccountController).whenTargetNamed(TAGS.AccountController);
_kernel.bind<Controller>(TYPE.Controller).to(MessagesController).whenTargetNamed(TAGS.MessagesController);

_kernel.bind<Client>("Client").toConstantValue(client);
_kernel.bind<PingServer>("PingServer").to(PingServer);
_kernel.bind<SaveMessage>("SaveMessage").to(SaveMessage);
_kernel.bind<QueryMessages>("QueryMessages").to(QueryMessages);

export var kernel = _kernel;

