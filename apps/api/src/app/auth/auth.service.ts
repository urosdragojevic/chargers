import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (user.password !== password) {
      throw new UnauthorizedException('Wrong password.');
    }
    return user;
  }
}
