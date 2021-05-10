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
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';

import { UsersService } from './users.service';
import { UserRole } from '../roles/roles.enum';
import { User } from './entities/user.entity';

import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { diskStorage } from 'multer';
import { setFileName, onlyImageEnabled } from '../configs/upload';
import { NotificationService } from 'notification/notification.service';

interface ReturnReset {
  token: string;
  password: string;
}
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private notificationService: NotificationService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Put('profile/:id')
  async updateProfile(
    @Param() params,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updateUser = await this.usersService.updateProfile(
      params.id,
      updateUserDto,
    );

    return classToClass(updateUser);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('avatar/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: setFileName,
      }),
      fileFilter: onlyImageEnabled,
    }),
  )
  async updateAvatar(
    @Param() params,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.usersService.updateAvatar(params.id, file.filename);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('avatar/image/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './tmp/uploads' });
  }

  @Post('forgot')
  async forgotPassword(@Body() body: any, @Res() res) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user) {
      throw new BadRequestException('O usuário não existe');
    }

    await this.notificationService.sendForgoutPasswordEmail(user);

    return res.status(204).json();
  }

  @Post('reset-password')
  async resetPassword(@Body() reset: ReturnReset, @Res() res) {
    await this.usersService.resetPassword(reset);

    return res.status(204).json();
  }

  @UseGuards(JwtAuthGuard)
  @Get('specialits')
  async getSpecialists(): Promise<any> {
    const specialists = await this.usersService.getSpecialists(
      UserRole.SPECIALIST,
    );

    return specialists;
  }
}
