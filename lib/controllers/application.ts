
import { Controller, Get, Post, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';

import { TYPES } from '../types';
import { CreateApplication } from '../commands';
import { QueryApplications, GetApplication } from '../queries';

import * as guard from 'express-jwt-permissions';

@injectable()
@Controller('/api/applications')
export class ApplicationController {
  private _query: QueryApplications;
  private _createApplication: CreateApplication;
  private _getApplication: GetApplication;

  /**
   *
   */
  constructor( @inject(TYPES.QueryApplications) query: QueryApplications,
  @inject(TYPES.CreateApplication) createApplication: CreateApplication,
  @inject(TYPES.GetApplication) getApplication: GetApplication) {
    this._query = query;
    this._createApplication = createApplication;
    this._getApplication = getApplication;
  }

  @Get('/', guard().check(['admin']))
  public query(request: Request) {
    this._query.userId = request.user._id;
    return this._query.exec();
  }

  @Get('/:id', guard().check(['admin']))
  public get(request: Request) {
    this._getApplication.userId = request.user._id;
    this._getApplication.id = request.params.id;
    return this._getApplication.exec();
  }

  @Post('/', guard().check(['admin']))
  public post(request: Request) {
    this._createApplication.app = request.body;
    this._createApplication.app.users = [request.user._id];
    this._createApplication.app.createdAt = new Date();
    return this._createApplication.exec();
  }

  @Delete('/', guard().check(['admin']))
  public delete(): string {
    return 'Home sweet home';
  }
}