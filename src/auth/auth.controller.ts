import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { copyFileSync } from 'fs';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: any): Promise<any> {
    const token = await this.authService.login(req.user);
    return {
      ...req.user,
      token,
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Request() req: any) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Request() req: any) {
    const token = await this.authService.login(req.user);
    return {
      ...req.user,
      token,
    };
  }
}
