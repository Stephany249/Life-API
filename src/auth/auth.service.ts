import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { classToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../roles/roles.enum';
import { SpecialistService } from '../specialist/specialist.service';

interface IResponse {
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private specialistService: SpecialistService,
    private jwtService: JwtService,
  ) {}

  async createSession(email: string, password: string): Promise<any> {
    let user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Combinação incorreta de e-mail / senha.');
    }

    const passwordMatched = await this.userService.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new BadRequestException('Combinação incorreta de e-mail / senha.');
    }

    delete user.password;

    if (user.role === UserRole.SPECIALIST) {
      const specialist = await this.specialistService.findSpecialistAndUser(user.id);
      user = specialist[0];
      return { user: classToClass(user) };
    }

    return {
      user: classToClass(user),
    };
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async googleSession(profile: any): Promise<any> {
    const user = await this.userService.findByEmail(profile.email);

    if (!user) {
      return await this.userService.createUser(profile, UserRole.CLIENT);
    }

    return user;
  }
}
