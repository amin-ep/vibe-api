import Album from '../models/Album.js';
import { IAlbum } from '../types/Album.js';
import Factory from './factory.controller.js';

export default class AlbumController extends Factory<IAlbum> {
  constructor() {
    super(Album);
  }
}
