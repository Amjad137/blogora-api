import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/services/auth.service';
import { AuthController } from '@modules/auth/controllers/auth.controller';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { UserModule } from '@modules/user/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('auth.jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<string>('auth.jwt.expiresIn'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
