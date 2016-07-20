import { Controller, Get, Post } from 'inversify-express-utils';
import { Request } from 'express';
import { injectable, inject } from 'inversify';
import { SaveMessage } from '../commands';
import { QueryMessages,
  QueryApplications,
  GetMessageByHash } from '../queries';

import { TYPES } from '../types';
import * as guard from 'express-jwt-permissions';

@injectable()
@Controller('/api')
export class MessagesController {

  private _saveMessage: SaveMessage;
  private _queryMessages: QueryMessages;
  private _queryApplications: QueryApplications;
  private _getMessageByHash: GetMessageByHash;

  /**
   *
   */
  constructor( @inject(TYPES.SaveMessage) saveMessage: SaveMessage,
    @inject(TYPES.QueryMessages) queryMessages: QueryMessages,
    @inject(TYPES.QueryApplications) queryApplications: QueryApplications,
    @inject(TYPES.GetMessageByHash) getMessageByHash: GetMessageByHash) {
    this._saveMessage = saveMessage;
    this._queryMessages = queryMessages;
    this._queryApplications = queryApplications;
    this._getMessageByHash = getMessageByHash;
  }

  @Post('/message', guard().check(['logger']))
  public save(request: Request) {
    this._saveMessage.message = request.body;
    return this._saveMessage.exec();
  }

  @Get('/message/:hash', guard().check(['admin']))
  public get(request: Request) {
    this._getMessageByHash.hash = request.params.hash;
    return this._getMessageByHash.exec();
  }

  @Get('/messages', guard().check(['admin']))
  public query(request: Request) {
    this._queryApplications.userId = request.user._id;
    
    return this._queryApplications.exec().then((app) => {
      this._queryMessages.term = request.query.q;
      this._queryMessages.streamFilter = app[0].query;
      return this._queryMessages.exec()
    })

  }
}