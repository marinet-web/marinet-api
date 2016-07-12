import { Controller, Get, Post } from 'inversify-express-utils';
import { Request } from 'express';
import { injectable, inject } from 'inversify';
import { SaveMessage } from '../commands';
import { QueryMessages } from '../queries';

@injectable()
@Controller('/api')
export class MessagesController {
  
  private _saveMessage: SaveMessage;
  private _queryMessages: QueryMessages;

  /**
   *
   */
  constructor(@inject('SaveMessage') saveMessage: SaveMessage,
  @inject('QueryMessages') queryMessages: QueryMessages ) {
    this._saveMessage = saveMessage;
    this._queryMessages = queryMessages;
  }
  
  @Post('/message')
  public save(request: Request) {
    this._saveMessage.message = request.body;
    return this._saveMessage.exec();
  }

  @Get('/messages')
  public query() {
    
    return this._queryMessages.exec()
  }
}