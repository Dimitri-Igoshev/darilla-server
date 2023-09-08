import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Status } from '../user/entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginAuthDto) {
    const user = await this.userService.getUserByEmail(email);

    if (!user)
      throw new HttpException(
        'User with this email not exists',
        HttpStatus.NOT_FOUND,
      );

    if (user.status === Status.PADDING)
      throw new HttpException(
        'Confirm your email address',
        HttpStatus.BAD_REQUEST,
      );

    if (user.status === Status.BLOCKED)
      throw new HttpException('Your account is blocked', HttpStatus.FORBIDDEN);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    const payload = { sub: user._id, roles: user.roles, status: user.status };

    return {
      accessToken: await this.createToken(payload, '7d'),
    };
  }

  async registration(user: RegisterAuthDto) {
    const isExist = await this.userService.getUserByEmail(user.email);

    if (isExist)
      throw new HttpException('User is already exists', HttpStatus.CONFLICT);

    return await this.userService.createUser({
      ...user,
      status: Status.ACTIVE,
    });

    // user.confirmToken = await this.createToken({ email: user.email }, '30d');

    // const confirmationLink = `${process.env.FRONTEND_URL}/confirmation?token=${user.confirmToken}`;

    // try {
    //   await this.mailService.send(confirmationMail(user, confirmationLink));
    //
    //   return await this.userService.createUser({
    //     ...user,
    //     status: Status.PADDING,
    //   });
    // } catch (error) {
    //   throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    // }
  }

  private async createToken(payload, expiresIn: string): Promise<string> {
    return await this.jwtService.signAsync(payload, { expiresIn });
  }
}
