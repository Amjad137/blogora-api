import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
    ThrottlerGuard,
    ThrottlerModule,
    ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { AppGeneralFilter } from '@app/filters/app.general.filter';
import { AppHttpFilter } from '@app/filters/app.http.filter';
import { AppValidationImportFilter } from '@app/filters/app.validation-import.filter';
import {
    AppJsonBodyParserMiddleware,
    AppRawBodyParserMiddleware,
    AppTextBodyParserMiddleware,
    AppUrlencodedBodyParserMiddleware,
} from '@app/middlewares/app.body-parser.middleware';
import { AppCorsMiddleware } from '@app/middlewares/app.cors.middleware';
import { AppHelmetMiddleware } from '@app/middlewares/app.helmet.middleware';
import { AppRequestIdMiddleware } from '@app/middlewares/app.request-id.middleware';
import { AppResponseTimeMiddleware } from '@app/middlewares/app.response-time.middleware';
import { AppUrlVersionMiddleware } from '@app/middlewares/app.url-version.middleware';

@Module({
    controllers: [],
    exports: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AppGeneralFilter,
        },
        {
            provide: APP_FILTER,
            useClass: AppValidationImportFilter,
        },
        {
            provide: APP_FILTER,
            useClass: AppHttpFilter,
        },
    ],
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get<number>('middleware.throttle.ttl'),
                        limit: config.get<number>('middleware.throttle.limit'),
                    },
                ],
            }),
        }),
    ],
})
export class AppMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                AppRequestIdMiddleware,
                AppHelmetMiddleware,
                AppJsonBodyParserMiddleware,
                AppTextBodyParserMiddleware,
                AppRawBodyParserMiddleware,
                AppUrlencodedBodyParserMiddleware,
                AppCorsMiddleware,
                AppUrlVersionMiddleware,
                AppResponseTimeMiddleware,
            )
            .forRoutes('{*wildcard}');
    }
}
