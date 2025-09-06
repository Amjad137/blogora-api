import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { AppMiddlewareModule } from '@app/app.middleware.module';
import { RouterModule } from '@router';

@Module({
    controllers: [],
    providers: [],
    imports: [
        // Common
        CommonModule,
        AppMiddlewareModule,

        // Routes
        RouterModule,
    ],
})
export class AppModule {}
