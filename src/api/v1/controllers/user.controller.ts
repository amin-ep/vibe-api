import User from '../models/User.js';
import Factory from './factory.controller.js';

export default class UserController extends Factory<IUser> {
  constructor() {
    super(User);
  }
}
