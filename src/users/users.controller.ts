import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { RestApiExceptionFilter } from '../filters/rest-api.exception-filter';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@UseFilters(RestApiExceptionFilter)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userId').status(200);
  }

  @Post('signup')
  async signup(
    @Body() body: AuthenticateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    response.cookie('userId', user.id);
    return user;
  }

  @Post('signin')
  async signin(
    @Body() body: AuthenticateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    response.cookie('userId', user.id).status(200);
    return user;
  }

  @Get(':id')
  findUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.findOne(id);
  }

  @Get()
  findUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete(':id')
  removeUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  //HANDY REFERENCES FOR USING COOKIES
  @Get('/colors/:color')
  setColor(
    @Param('color') color: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.cookie('color', color);
  }

  @Get('/colors')
  getColor(@Req() request: Request) {
    return request.cookies['color'];
  }
}
