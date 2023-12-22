import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
