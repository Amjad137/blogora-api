import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryDocument } from '@modules/category/repository/entities/category.entity';
import { CategoryRepository } from '@modules/category/repository/repositories/category.repository';
import {
    IPaginationQuery,
    IPaginationResult,
} from '@common/database/interfaces/database.interface';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async findAll(
        query?: IPaginationQuery,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        if (query) {
            return this.categoryRepository.findAll(
                { isActive: true },
                {
                    paginationQuery: query,
                    searchFields: ['name', 'description', 'slug'],
                    defaultSortField: 'sortOrder',
                    join: true, // Include parent category
                },
            );
        }
        return this.categoryRepository.findActive();
    }

    async findOne(id: Types.ObjectId): Promise<CategoryDocument> {
        const category = await this.categoryRepository.findOneById(id);
        if (!category || !category.isActive) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async findBySlug(slug: string): Promise<CategoryDocument> {
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async findRootCategories(
        query?: IPaginationQuery,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        if (query) {
            return this.categoryRepository.findAll(
                { isActive: true, parent: null },
                {
                    paginationQuery: query,
                    searchFields: ['name', 'description'],
                    defaultSortField: 'sortOrder',
                },
            );
        }
        return this.categoryRepository.findRootCategories();
    }

    async findByParent(
        parentId: Types.ObjectId,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        return this.categoryRepository.findByParent(parentId);
    }

    async create(
        createCategoryData: Partial<CategoryDocument>,
    ): Promise<CategoryDocument> {
        // Check if category with same name or slug exists
        const existingByName = await this.categoryRepository.findByName(
            createCategoryData.name,
        );
        if (existingByName) {
            throw new ConflictException(
                'Category with this name already exists',
            );
        }

        const existingBySlug = await this.categoryRepository.findBySlug(
            createCategoryData.slug,
        );
        if (existingBySlug) {
            throw new ConflictException(
                'Category with this slug already exists',
            );
        }

        return this.categoryRepository.create(createCategoryData);
    }

    async update(
        id: Types.ObjectId,
        updateCategoryData: Partial<CategoryDocument>,
    ): Promise<CategoryDocument> {
        const category = await this.categoryRepository.updateOneById(
            id,
            updateCategoryData,
        );
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async remove(id: Types.ObjectId): Promise<void> {
        const category = await this.categoryRepository.updateOneById(id, {
            isActive: false,
        });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
    }

    async incrementPostCount(id: Types.ObjectId): Promise<CategoryDocument> {
        return this.categoryRepository.incrementPostCount(id);
    }

    async decrementPostCount(id: Types.ObjectId): Promise<CategoryDocument> {
        return this.categoryRepository.decrementPostCount(id);
    }
}
