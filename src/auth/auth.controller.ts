import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/create-auth.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any): Promise<any> {
    return classToClass(req.user);
  }
}
