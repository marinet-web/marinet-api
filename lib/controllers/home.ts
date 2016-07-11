
import { Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { PingServer } from '../commands';

@injectable()
@Controller('/')
export class HomeController {
  private _pingServer: PingServer;

  /**
   *
   */
  constructor(@inject("PingServer") pingServer: PingServer) {
    this._pingServer = pingServer;    
  }

  @Get('/')
  public get(): string {
    
    this._pingServer.exec();
    return 'Home sweet home';
  }
}