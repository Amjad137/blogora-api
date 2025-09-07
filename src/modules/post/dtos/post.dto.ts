import {
    IsString,
    IsOptional,
    IsArray,
    IsEnum,
    IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { ENUM_POST_STATUS } from '../repository/entities/post.entity';

export class CreatePostDto {
    @ApiProperty({ description: 'Post title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Post slug' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ description: 'Post excerpt' })
    @IsOptional()
    @IsString()
    excerpt?: string;

    @ApiProperty({ description: 'Post content' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Featured image URL' })
    @IsOptional()
    @IsString()
    featuredImage?: string;

    @ApiPropertyOptional({
        description: 'Post status',
        enum: ENUM_POST_STATUS,
        default: 'DRAFT',
    })
    @IsOptional()
    @IsEnum(ENUM_POST_STATUS)
    status?: ENUM_POST_STATUS;

    @ApiPropertyOptional({ description: 'Category IDs' })
    @IsOptional()
    @IsArray()
    @IsMongoId({
        each: true,
        message: 'Each category ID must be a valid MongoDB ObjectId',
    })
    categories?: Types.ObjectId[];

    @ApiPropertyOptional({ description: 'Tags' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class PostResponseDto {
    @ApiProperty({ description: 'Post ID' })
    _id: string;

    @ApiProperty({ description: 'Post title' })
    title: string;

    @ApiProperty({ description: 'Post slug' })
    slug: string;

    @ApiPropertyOptional({ description: 'Post excerpt' })
    excerpt?: string;

    @ApiProperty({ description: 'Post content' })
    content: string;

    @ApiPropertyOptional({ description: 'Featured image URL' })
    featuredImage?: string;

    @ApiProperty({ description: 'Post status', enum: ENUM_POST_STATUS })
    status: ENUM_POST_STATUS;

    @ApiPropertyOptional({ description: 'View count' })
    viewCount?: number;

    @ApiPropertyOptional({ description: 'Like count' })
    likeCount?: number;

    @ApiPropertyOptional({ description: 'Categories' })
    categories?: any[];

    @ApiPropertyOptional({ description: 'Tags' })
    tags?: string[];

    @ApiPropertyOptional({ description: 'Author' })
    author?: any;

    @ApiProperty({ description: 'Creation date' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: 'Published date' })
    publishedAt?: Date;
}
