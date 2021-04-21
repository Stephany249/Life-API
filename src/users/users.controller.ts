import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Get,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserRole } from '../roles/roles.enum';
import { User } from './entities/user.entity';
import { classToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('specialist')
  async createSpecialistUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createUser(
      createUserDto,
      UserRole.SPECIALIST,
    );
    return {
      user,
      message: 'Especialista cadastrado com sucesso',
    };
  }

  @Post('client')
  async createClientUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.usersService.createUser(
      createUserDto,
      UserRole.CLIENT,
    );
    return {
      user,
      message: 'Cliente cadastrado com sucesso',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async showProfile(@Param() params): Promise<ReturnUserDto> {
    const user = await this.usersService.findById(params.id);

    return { user, message: '' };
  }

  @Put('profile')
  async updateProfile(
    user_id: string,
    name: string,
    email: string,
    old_password: string,
    password: string,
  ): Promise<User> {
    const user = await this.usersService.updateProfile({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return classToClass(user);
  }
}
