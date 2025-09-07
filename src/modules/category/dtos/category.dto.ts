import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Technology' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'technology' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'All about technology and innovation' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
    @IsOptional()
    @Transform(({ value }: { value: string }) =>
        value ? new Types.ObjectId(value) : null,
    )
    parent?: Types.ObjectId | null;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    _id: string;

    @ApiProperty({ example: 'Technology' })
    name: string;

    @ApiProperty({ example: 'technology' })
    slug: string;

    @ApiPropertyOptional({ example: 'All about technology and innovation' })
    description?: string;

    @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
    parent?: string | null;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: Date;
}
