import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
    PostDocument,
    ENUM_POST_STATUS,
} from '@modules/post/repository/entities/post.entity';
import { PostRepository } from '@modules/post/repository/repositories/post.repository';
import {
    IPaginationQuery,
    IPaginationResult,
} from '@common/database/interfaces/database.interface';
import { CreatePostDto, UpdatePostDto } from './dtos/post.dto';

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) {}

    async findAll(
        query?: IPaginationQuery,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        if (query) {
            return this.postRepository.findAll(
                {},
                {
                    paginationQuery: query,
                    searchFields: ['title', 'excerpt', 'content'],
                    availableSortFields: [
                        'title',
                        'publishedAt',
                        'createdAt',
                        'viewCount',
                        'likeCount',
                    ],
                    defaultSortField: 'createdAt',
                    join: true, // Include author and categories
                },
            );
        }
        return this.postRepository.findAll({}, { join: true });
    }

    async findPublished(
        query?: IPaginationQuery,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        if (query) {
            return this.postRepository.findAll(
                { status: 'PUBLISHED' },
                {
                    paginationQuery: query,
                    searchFields: ['title', 'excerpt', 'content'],
                    defaultSortField: 'publishedAt',
                    join: true,
                },
            );
        }
        return this.postRepository.findPublishedPosts();
    }

    async findOne(id: Types.ObjectId): Promise<PostDocument> {
        const post = await this.postRepository.findOneById(id, { join: true });
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async findBySlug(slug: string): Promise<PostDocument> {
        const post = await this.postRepository.findBySlug(slug);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async findByAuthor(
        authorId: Types.ObjectId,
        query?: IPaginationQuery,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        if (query) {
            return this.postRepository.findAll(
                { author: authorId },
                {
                    paginationQuery: query,
                    searchFields: ['title', 'excerpt', 'content'],
                    defaultSortField: 'createdAt',
                    join: true,
                },
            );
        }
        return this.postRepository.findByAuthor(authorId);
    }

    async findByCategory(
        categoryId: Types.ObjectId,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        return this.postRepository.findByCategory(categoryId);
    }

    async findByTag(
        tag: string,
    ): Promise<PostDocument[] | IPaginationResult<PostDocument>> {
        return this.postRepository.findByTag(tag);
    }

    async create(
        createPostDto: CreatePostDto,
        authorId: Types.ObjectId,
    ): Promise<PostDocument> {
        // Check if post with same slug exists
        if (createPostDto.slug) {
            const existingBySlug = await this.postRepository.findBySlug(
                createPostDto.slug,
            );
            if (existingBySlug) {
                throw new ConflictException(
                    'Post with this slug already exists',
                );
            }
        }

        return this.postRepository.create({
            ...createPostDto,
            author: authorId,
            status: createPostDto.status || ENUM_POST_STATUS.DRAFT,
        } as Partial<PostDocument>);
    }

    async update(
        id: Types.ObjectId,
        updatePostDto: UpdatePostDto,
    ): Promise<PostDocument> {
        const post = await this.postRepository.updateOneById(
            id,
            updatePostDto as Partial<PostDocument>,
        );
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async remove(id: Types.ObjectId): Promise<void> {
        const deleted = await this.postRepository.softDeleteOneById(id);
        if (!deleted) {
            throw new NotFoundException('Post not found');
        }
    }

    async publish(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.publish(id);
    }

    async unpublish(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.unpublish(id);
    }

    async archive(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.archive(id);
    }

    async incrementViewCount(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.incrementViewCount(id);
    }

    async incrementLikeCount(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.incrementLikeCount(id);
    }

    async decrementLikeCount(id: Types.ObjectId): Promise<PostDocument> {
        return this.postRepository.decrementLikeCount(id);
    }
}
