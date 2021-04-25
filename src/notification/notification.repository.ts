import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@EntityRepository(Notification)
export class NotifcationRepository extends Repository<Notification> {
  async generate(id: string): Promise<Notification> {
    const userToken = this.create({
      user_id: id,
    });

    await this.save(userToken);

    return userToken;
  }

  async findByToken(token: string): Promise<Notification | undefined> {
    const userToken = await this.findOne({ where: { token: token } });

    return userToken;
  }
}
