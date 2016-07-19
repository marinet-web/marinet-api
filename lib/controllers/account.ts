
import { Controller, Get, Post } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';

import { LoginUser } from '../commands';
import { User } from '../models';
import { TYPES } from '../types';

import * as guard from 'express-jwt-permissions';

@injectable()
@Controller('/api/account')
export class AccountController {
  private _loginUser: LoginUser;

  /**
   *
   */
  constructor( @inject(TYPES.LoginUser) loginUser: LoginUser) {
    this._loginUser = loginUser;
  }

  @Get('/me', guard().check(['admin']))
  public me(request: Request): User {
    return request.user;
  }

  @Post('/login')
  public login(request: Request) {
    this._loginUser.user = <User>{
      email: request.query.username || request.body.username,
      password: request.query.password || request.body.password,
    }
    return this._loginUser.exec()
  }
}