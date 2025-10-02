import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyToken } from 'src/lib/utils';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookies
    const token = request.cookies['token'];

    // Check if token exists
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      // Verify the token
      const payload = await verifyToken(token);

      // Attach the user payload to the request object
      request['user'] = payload.payload;

      return true;
    } catch (error: any) {
      // Handle different types of JWT errors
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
