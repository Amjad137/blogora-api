import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { BaseRepository } from '@common/database/bases/base.repository';
import { Types } from 'mongoose';
import { InjectDatabaseModel } from '@common/database/decorators/database.decorator';
import {
    PostDocument,
    PostEntity,
    ENUM_POST_STATUS,
} from '@modules/post/repository/entities/post.entity';
import { UserEntity } from '@modules/user/repository/entities/user.entity';
import { CategoryEntity } from '@modules/category/repository/entities/category.entity';
import { IPaginationResult } from '@common/database/interfaces/database.interface';

@Injectable()
export class PostRepository extends BaseRepository<PostEntity, PostDocument> {
    static readonly _joinWithAuthor: PopulateOptions[] = [
        {
            path: 'author',
            model: UserEntity.name,
            select: 'firstName lastName email avatar',
        },
    ];

    static readonly _joinWithCategories: PopulateOptions[] = [
        {
            path: 'categories',
            model: CategoryEntity.name,
            select: 'name slug color',
        },
    ];

    static readonly _joinAll: PopulateOptions[] = [
        ...PostRepository._joinWithAuthor,
        ...PostRepository._joinWithCategories,
    ];

    constructor(
        @InjectDatabaseModel(PostEntity.name)
        private readonly postModel: Model<PostEntity>,
    ) {
        super(postModel, PostRepository._joinAll);
    }

    async findBySlug(slug: string): Promise<PostDocument | null> {
        return this.findOne({ slug }, { join: true });
    }

    async findPublishedPosts(): Promise<
        IPaginationResult<PostDocument> | PostDocument[]
    > {
        return this.findAll(
            { status: ENUM_POST_STATUS.PUBLISHED },
            {
                join: true,
                order: { publishedAt: -1 },
            },
        );
    }

    async findByAuthor(
        authorId: string | Types.ObjectId,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        return this.findAll(
            { author: authorId },
            {
                join: true,
                order: { createdAt: -1 },
            },
        );
    }

    async findByCategory(
        categoryId: string | Types.ObjectId,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        return this.findAll(
            { categories: { $in: [categoryId] } },
            {
                join: true,
                order: { publishedAt: -1 },
            },
        );
    }

    async findByTag(
        tag: string,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        return this.findAll(
            { tags: { $in: [tag] } },
            {
                join: true,
                order: { publishedAt: -1 },
            },
        );
    }

    async incrementViewCount(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            $inc: { viewCount: 1 },
        });
    }

    async incrementLikeCount(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            $inc: { likeCount: 1 },
        });
    }

    async decrementLikeCount(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            $inc: { likeCount: -1 },
        });
    }

    async incrementCommentCount(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            $inc: { commentCount: 1 },
        });
    }

    async decrementCommentCount(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            $inc: { commentCount: -1 },
        });
    }

    async publish(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            status: ENUM_POST_STATUS.PUBLISHED,
            publishedAt: new Date(),
        });
    }

    async unpublish(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            status: ENUM_POST_STATUS.DRAFT,
            publishedAt: null,
        });
    }

    async archive(_id: Types.ObjectId): Promise<PostDocument> {
        return this.updateOneById(_id, {
            status: ENUM_POST_STATUS.ARCHIVED,
        });
    }
}
