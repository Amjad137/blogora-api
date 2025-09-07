import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from '@modules/comment/comment.service';
import { CommentController } from '@modules/comment/comment.controller';
import { CommentRepository } from '@modules/comment/repository/repositories/comment.repository';
import {
    CommentEntity,
    CommentSchema,
} from '@modules/comment/repository/entities/comment.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CommentEntity.name, schema: CommentSchema },
        ]),
    ],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService, CommentRepository],
})
export class CommentModule {}
