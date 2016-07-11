
import { Controller, Get } from 'inversify-express-utils';
import { injectable } from 'inversify';

@injectable()
@Controller('/')
export class ApplicationController {
  @Get('/')
  public get(): string {
    return 'Home sweet home';
  }
}