import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    UserEntity,
    UserSchema,
} from '@modules/user/repository/entities/user.entity';
import {
    PostEntity,
    PostSchema,
} from '@modules/post/repository/entities/post.entity';
import {
    CommentEntity,
    CommentSchema,
} from '@modules/comment/repository/entities/comment.entity';
import { DatabaseService } from '@common/database/services/database.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: UserEntity.name,
                schema: UserSchema,
            },
            {
                name: PostEntity.name,
                schema: PostSchema,
            },
            {
                name: CommentEntity.name,
                schema: CommentSchema,
            },
        ]),
    ],
    providers: [DatabaseService],
    exports: [MongooseModule, DatabaseService],
})
export class DatabaseModule {}
