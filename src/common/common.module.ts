import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import configs from '@config';
import { DatabaseModule } from '@common/database/database.module';
import { MessageModule } from '@common/message/message.module';
import { RequestModule } from '@common/request/request.module';
import { ResponseModule } from '@common/response/response.module';

@Module({
    imports: [
        // Config
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
        }),

        // Database
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('database.url'),
                ...configService.get('database.options'),
            }),
            inject: [ConfigService],
        }),

        // Cache
        CacheModule.register({
            isGlobal: true,
            ttl: 300, // 5 minutes
            max: 100, // maximum number of items in cache
        }),

        // Logger
        LoggerModule.forRootAsync({
            useFactory: () => ({
                pinoHttp: {
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            singleLine: true,
                        },
                    },
                },
            }),
        }),

        // Health Check
        TerminusModule,

        // Common modules
        DatabaseModule,
        MessageModule,
        RequestModule.forRoot(),
        ResponseModule,
    ],
    exports: [DatabaseModule, MessageModule, RequestModule, ResponseModule],
})
export class CommonModule {}
