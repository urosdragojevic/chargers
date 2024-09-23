import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { Public } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(Public, context.getHandler());
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const dto = this.extractBasicAuth(request);
    const user = await this.authService.signIn(dto.username, dto.password);
    request['user'] = user;
    return true;
  }

  private extractBasicAuth(request: any) {
    const header = request.headers.authorization;
    if (!header) {
      throw new UnauthorizedException('Missing auth header.');
    }
    const [type, base64] = header.split(' ');
    if (type !== 'Basic') {
      throw new UnauthorizedException('Not Basic auth.');
    }
    const plain = atob(base64);
    const [username, password] = plain.split(':');
    if (!username || !password) {
      throw new UnauthorizedException('Invalid auth header');
    }
    return {
      username,
      password,
    };
  }
}
