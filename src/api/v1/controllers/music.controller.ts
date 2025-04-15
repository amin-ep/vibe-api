import Music from '../models/Music.js';
import { IMusic } from '../types/Music.js';
import Factory from './factory.controller.js';

export default class MusicController extends Factory<IMusic> {
  constructor() {
    super(Music);
  }
}
