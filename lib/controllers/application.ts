
import { Controller, Get, Post, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';

import { TYPES } from '../types';
import {  } from '../commands';
import { QueryApplications } from '../queries';

@injectable()
@Controller('/api/applications')
export class ApplicationController {
  private _query: QueryApplications;

  /**
   *
   */
  constructor( @inject(TYPES.QueryApplications) query: QueryApplications) {
    this._query = query;
  }

  @Get('/')
  public get(request: Request) {
    this._query.userId = request.user._id;
    return this._query.exec();
  }

  @Post('/')
  public post(): string {
    return 'Home sweet home';
  }

  @Delete('/')
  public delete(): string {
    return 'Home sweet home';
  }
}