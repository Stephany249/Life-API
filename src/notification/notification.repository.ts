import { EntityRepository, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Notification } from './entities/notification.entity';

@EntityRepository(Notification)
export class NotifcationRepository extends Repository<Notification> {
  async generate(user: User): Promise<Notification> {
    const userToken = this.create({
      userId: user.id,
    });

    await this.save(userToken);

    return userToken;
  }

  async findByToken(token: string): Promise<Notification | undefined> {
    const userToken = await this.findOne({ where: { token } });

    return userToken;
  }
}
