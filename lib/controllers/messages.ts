import { Controller, Get, Post } from 'inversify-express-utils';
import { Request } from 'express';
import { injectable, inject } from 'inversify';
import { SaveMessage } from '../commands';
import { QueryMessages, QueryApplications } from '../queries';

import { TYPES } from '../types';

@injectable()
@Controller('/api')
export class MessagesController {

  private _saveMessage: SaveMessage;
  private _queryMessages: QueryMessages;
  private _queryApplications: QueryApplications;

  /**
   *
   */
  constructor( @inject(TYPES.SaveMessage) saveMessage: SaveMessage,
    @inject(TYPES.QueryMessages) queryMessages: QueryMessages,
    @inject(TYPES.QueryApplications) queryApplications: QueryApplications) {
    this._saveMessage = saveMessage;
    this._queryMessages = queryMessages;
    this._queryApplications = queryApplications;
  }

  @Post('/message')
  public save(request: Request) {
    this._saveMessage.message = request.body;
    return this._saveMessage.exec();
  }

  @Get('/messages')
  public query(request: Request) {
    this._queryApplications.userId = request.user._id;
    
    return this._queryApplications.exec().then((app) =>{
      console.log(app);
      this._queryMessages.streamFilter = app[0].query;
      return this._queryMessages.exec()
    })
    
  }
}