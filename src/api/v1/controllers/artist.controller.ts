import Artist from '../models/Artist.js';
import Factory from './factory.controller.js';

export default class ArtistController extends Factory<IArtist> {
  constructor() {
    super(Artist);
  }
}
