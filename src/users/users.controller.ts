import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserRole } from './user-roles.enum';

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
}
