import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
    imports: [AuthModule, UserModule, HealthModule],
    controllers: [],
    providers: [],
})
export class RouterModule {}
