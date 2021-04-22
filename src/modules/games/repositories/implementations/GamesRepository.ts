import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private usersRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.usersRepository = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ilike :title", {title: `%${param}%`})
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT count(*) FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder("users")
      .innerJoin("users.games", "game")
      .where("game.id = :gameId", { gameId: id})
      .getMany();
  }
}
