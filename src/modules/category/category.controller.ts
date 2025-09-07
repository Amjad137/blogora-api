import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from '@modules/category/category.service';
import { CategoryDocument } from '@modules/category/repository/entities/category.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Public } from '@common/decorators/public.decorator';
import { Roles, Role } from '@common/decorators/roles.decorator';
import { Types } from 'mongoose';
import { IPaginationResult } from '@common/database/interfaces/database.interface';
import { PaginationQueryDto } from '@common/database/dtos/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards globally to this controller
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    // PUBLIC ROUTES (no authentication required)
    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all active categories (public)' })
    @ApiResponse({
        status: 200,
        description: 'List of active categories',
    })
    async findAll(
        @Query() query?: PaginationQueryDto,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        return this.categoryService.findAll(query);
    }

    @Public()
    @Get('root')
    @ApiOperation({ summary: 'Get root categories (public)' })
    @ApiResponse({
        status: 200,
        description: 'List of root categories',
    })
    async findRootCategories(
        @Query() query?: PaginationQueryDto,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        return this.categoryService.findRootCategories(query);
    }

    @Public()
    @Get('by-slug/:slug')
    @ApiOperation({ summary: 'Get category by slug (public)' })
    @ApiResponse({
        status: 200,
        description: 'Category found',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async findBySlug(@Param('slug') slug: string): Promise<CategoryDocument> {
        return this.categoryService.findBySlug(slug);
    }

    @Public()
    @Get(':id/children')
    @ApiOperation({ summary: 'Get child categories by parent ID (public)' })
    @ApiResponse({
        status: 200,
        description: 'List of child categories',
    })
    async findByParent(
        @Param('id') parentId: string,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        return this.categoryService.findByParent(new Types.ObjectId(parentId));
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID (public)' })
    @ApiResponse({
        status: 200,
        description: 'Category found',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async findOne(@Param('id') id: string): Promise<CategoryDocument> {
        return this.categoryService.findOne(new Types.ObjectId(id));
    }

    // ADMIN ONLY ROUTES
    @Roles(Role.ADMIN)
    @Get('admin/all')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get all categories with pagination (admin only)',
    })
    @ApiResponse({
        status: 200,
        description: 'Categories retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CategoryResponseDto' },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                        hasNext: { type: 'boolean' },
                        hasPrev: { type: 'boolean' },
                    },
                },
            },
        },
    })
    async findAllAdmin(
        @Query() query: PaginationQueryDto,
    ): Promise<IPaginationResult<CategoryDocument>> {
        return this.categoryService.findAll(query) as Promise<
            IPaginationResult<CategoryDocument>
        >;
    }

    @Roles(Role.ADMIN)
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category (admin only)' })
    @ApiResponse({
        status: 201,
        description: 'Category created successfully',
    })
    @ApiResponse({
        status: 409,
        description: 'Category with name or slug already exists',
    })
    async create(@Body() createCategoryData: any): Promise<CategoryDocument> {
        return this.categoryService.create(createCategoryData);
    }

    @Roles(Role.ADMIN)
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update category (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Category updated successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async update(
        @Param('id') id: string,
        @Body() updateCategoryData: any,
    ): Promise<CategoryDocument> {
        return this.categoryService.update(
            new Types.ObjectId(id),
            updateCategoryData,
        );
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Soft delete category (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Category deleted successfully',
    })
    @ApiResponse({
        status: 404,
        description: 'Category not found',
    })
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        await this.categoryService.remove(new Types.ObjectId(id));
        return { message: 'Category deleted successfully' };
    }
}
