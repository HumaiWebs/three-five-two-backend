import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDTO } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<User>,
    private readonly config: ConfigService,
  ) { }

  async signup(dto: CreateAuthDto) {
    try {
      console.info(`User signup - ${dto.email}`, {
        email: dto.email,
      });

      const user_exists = await this.user.findOne({ email: dto.email });
      if (user_exists) {
        return {
          success: false,
          message: `Email already registered`,
        };
      }

      const hashed_password = await bcryptjs.hash(dto.password, 10);
      const new_user = await this.user.create({
        ...dto,
        password: hashed_password,
      });

      console.info('User created', {
        email: dto.email,
        name: dto.name,
      });

      new_user.password = '';
      return { success: true, message: 'Sign up Successful', data: new_user };
    } catch (error) {
      console.error(`User signup failed ${error}`, {
        name: dto.name,
        email: dto.email,
      });
    }
  }

  async login(dto: LoginDTO) {
    try {
      console.info(`Login attempt - ${dto.email}`, { email: dto.email });
      const user = await this.user.findOne({ email: dto.email });
      if (!user) {
        console.warn(`Loggin failed - ${dto.email} not registered`);
        return { success: false, message: 'Invalid email or password' };
      }

      const password_matched = await bcryptjs.compare(
        dto.password,
        user.password,
      );

      if (!password_matched) {
        console.warn(`Loggin failed - ${dto.email} Invalid password`);
        return { success: false, message: 'Invalid email or password' };
      }

      const jwt_secret = this.config.get('JWT_SECRET') as string | null;

      if (!jwt_secret) throw new Error('JWT_SECRET not found');

      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        jwt_secret,
      );

      user.password = '';

      console.info(`Loggin Successfull - ${dto.email}`);
      return {
        success: true,
        token,
        user,
      };
    } catch (error) {
      console.log(error);
      console.error(`Login Failed: ${error}`, { name: dto.email });
      return {
        success: false,
        message: 'Internal server error while loggin in',
      };
    }
  }

  async isEmailRegistered(email: string) {
    const user = await this.user.findOne({ email });
    return { registered: !!user };
  }

  async getUser(userId: string) {
    const user = await this.user
      .findById(userId)
      .select('-password')
    return user;
  }
}
