import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignDto } from 'src/users/users.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/users.entity';
import { TokenPayload } from './authentication.interfaces';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public getCookieWithJwtToken(userId: number) {
    console.log(
      `authentication.service: getCookieWithJwtToken(id = ${userId})`,
    );
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut(userId: number) {
    console.log(`authentication.service: getCookieForLogout(id = ${userId})`);
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async validateUser(payload: TokenPayload): Promise<User | null> {
    const foundUser = await this.usersService.getById(payload.userId);
    console.log(`authentication.service: validateUser42(login = ${payload})`);
    if (foundUser) {
      console.log(foundUser);
      return foundUser;
    }
    return null;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: SignDto): Promise<any> {
    return this.usersService.signUp(user);
  }

  async signIn(user: SignDto): Promise<User | null> {
    return this.usersService.signIn(user);
  }
}
