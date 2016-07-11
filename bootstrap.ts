import 'reflect-metadata';
import { Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';

import { Client } from 'elasticsearch';
import { client } from './lib/get-elastic-search-client';

import { PingServer } from './lib/commands';
import { HomeController } from './lib/controllers';

let _kernel = new Kernel();

_kernel.bind<Controller>(TYPE.Controller).to(HomeController);
_kernel.bind<Client>("Client").toConstantValue(client);
_kernel.bind<PingServer>("PingServer").to(PingServer);

export var kernel = _kernel;

