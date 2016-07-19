
import { Controller, Get, Post } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';

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
  public me(request: Request, response: Response): User {
    return request.user;
  }

  @Post('/login')
  public login(request: Request, response: Response) {
    this._loginUser.user = <User>{
      email: request.query.username || request.body.username,
      password: request.query.password || request.body.password,
    }
    this._loginUser.exec()
    .then((token) => response.send(token))
    .catch(err =>{
      if(err === "invalid_user") return response.status(401).send({message: 'Invalid credentials.'});
      response.status(502).send(err.message || 'Server error.');
    })
  }
}