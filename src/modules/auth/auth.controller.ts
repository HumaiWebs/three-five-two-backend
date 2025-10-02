import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserId } from 'src/decorators/user-id/user-id.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: CreateAuthDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO, @Res() res: Response) {
    const response = await this.authService.login(dto);

    if (!response.success) {
      res.status(401).send(response);
    } else {
      res.cookie('token', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.SERVER_IP,
      });

      res.setHeader('Access-Control-Allow-Credentials', 'true');
      delete response.token;

      res.status(200).send(response);
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).send({ success: true, message: 'Logged out successfully' });
  }

  @UseGuards(AuthGuard)
  @Post('auth-check')
  async checkAuth(@UserId() userId: string) {
    const user = await this.authService.getUser(userId);
    if (user) return { success: true, user };
    return { success: false, message: 'User not found' };
  }

  @Get('registered/:email')
  async isEmailRegistered(@Param('email') email: string) {
    return await this.authService.isEmailRegistered(email);
  }
}
