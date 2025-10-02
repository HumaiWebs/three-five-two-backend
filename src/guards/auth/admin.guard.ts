import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = this.getUserFromCookies(request);

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.role || user.role !== 'admin') {
      throw new ForbiddenException('Access denied.');
    }

    return true;
  }

  private getUserFromCookies(request: Request) {
    // Example: assuming user info is stored in a cookie named 'user'
    const userCookie = request.cookies?.user;
    if (!userCookie) return null;

    try {
      // If userCookie is a JSON string
      return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
    } catch {
      return null;
    }
  }
}
