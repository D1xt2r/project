import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Authdto } from 'src/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private readonly users: Authdto[] = [
    {
      id: 1,
      email: '123@gmail.com',
      password: '123',
    },
  ];

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signinlocal(dto: Authdto) {
    const hash = await this.hashData(dto.password);
    const user = await this.users.find((_user) => _user.email === dto.email);
    if (!user) throw new UnauthorizedException('Credentials not found');

    const passwordMatches = await bcrypt.compare(dto.password, hash);

    if (!passwordMatches)
      throw new UnauthorizedException('Credentials not found');
    const Tokens = await this.getTokens(user.id, user.email);

    return Tokens;
  }

  signUser(userId: number, email: string, type: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      claim: type,
    });
  }

  async getTokens(Id: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: Id,
          email,
        },
        {
          secret: 'secret',
          expiresIn: 60,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: Id,
          email,
        },
        {
          secret: 'secret',
          expiresIn: 60,
        },
      ),
    ]);

    return {
      access_token: at,
      refreshtoken: rt,
    };
  }

  // async updateRtHash(userId: number, rt: string){
  //     const hash  = await this.hashData(rt);
  //      const user = await this.userRepository.findOne(userId);

  //     if (user) {
  //       user.hashedRt = await hash;
  //     await this.userRepository.save(
  //         user
  //     )

  //     }
  // }
}
