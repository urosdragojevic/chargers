import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user';
import { Public } from '../auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Public()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @Public()
  saveUser(@Body() user: User): Promise<User> {
    return this.usersService.createUser(user);
  }
}
