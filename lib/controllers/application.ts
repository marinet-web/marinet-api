
import { Controller, Get } from 'inversify-express-utils';
import { injectable } from 'inversify';

import { TYPES } from '../types';

@injectable()
@Controller('/api/application')
export class ApplicationController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }
}