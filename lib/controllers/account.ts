
import { Controller, Get } from 'inversify-express-utils';
import { injectable } from 'inversify';

import { TYPES } from '../types';

@injectable()
@Controller('/api/account')
export class AccountController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }
}