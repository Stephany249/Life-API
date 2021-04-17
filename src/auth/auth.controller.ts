import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDTO: CreateAuthDTO): Promise<any> {
    const user = await this.authService.createSession(createAuthDTO);
    return {
      user,
    };
  }
}
