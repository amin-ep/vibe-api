import { NextFunction, Request, Response } from 'express';
import Message from '../models/Message.js';
import { IMessage } from '../types/Message.js';
import Factory from './factory.controller.js';
import User from '../models/User.js';

export default class MessageController extends Factory<IMessage> {
  constructor() {
    super(Message);
  }

  async setMessageDestination(req: Request, res: Response, next: NextFunction) {
    const owner = await User.findOne({ role: 'owner' });
    req.body.from = req.user._id;
    if (req.user.role !== 'owner' && owner) {
      req.body.to = owner._id;
    } else {
      if (req.params.contactId) {
        req.body.to = req.params.contactId;
      }
    }

    next();
  }
}
