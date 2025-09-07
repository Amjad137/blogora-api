import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from '@modules/like/like.service';
import { LikeController } from '@modules/like/like.controller';
import { LikeRepository } from '@modules/like/repositories/like.repository';
import { LikeEntity, LikeSchema } from '@modules/like/entities/like.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: LikeEntity.name, schema: LikeSchema },
        ]),
    ],
    controllers: [LikeController],
    providers: [LikeService, LikeRepository],
    exports: [LikeService],
})
export class LikeModule {}
