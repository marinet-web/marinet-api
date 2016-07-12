
import { Controller, Get } from 'inversify-express-utils';
import { injectable } from 'inversify';

@injectable()
@Controller('/api/account')
export class AccountController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }
}