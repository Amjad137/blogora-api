import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { BaseRepository } from '@common/database/bases/base.repository';
import { Types } from 'mongoose';
import { InjectDatabaseModel } from '@common/database/decorators/database.decorator';
import {
    CategoryDocument,
    CategoryEntity,
} from '@modules/category/repository/entities/category.entity';
import { IPaginationResult } from '@common/database/interfaces/database.interface';

@Injectable()
export class CategoryRepository extends BaseRepository<
    CategoryEntity,
    CategoryDocument
> {
    static readonly _joinWithParent: PopulateOptions[] = [
        {
            path: 'parent',
            model: CategoryEntity.name,
            select: 'name slug color',
        },
    ];

    constructor(
        @InjectDatabaseModel(CategoryEntity.name)
        private readonly categoryModel: Model<CategoryEntity>,
    ) {
        super(categoryModel, CategoryRepository._joinWithParent);
    }

    async findBySlug(slug: string): Promise<CategoryDocument | null> {
        return this.findOne({ slug }, { join: true });
    }

    async findByName(name: string): Promise<CategoryDocument | null> {
        return this.findOne({ name });
    }

    async findActive(): Promise<
        CategoryDocument[] | IPaginationResult<CategoryDocument>
    > {
        return this.findAll(
            { isActive: true },
            {
                join: true,
                order: { sortOrder: 1, name: 1 },
            },
        );
    }

    async findRootCategories(): Promise<
        CategoryDocument[] | IPaginationResult<CategoryDocument>
    > {
        return this.findAll(
            {
                parent: { $exists: false },
                isActive: true,
            },
            {
                order: { sortOrder: 1, name: 1 },
            },
        );
    }

    async findByParent(
        parentId: string | Types.ObjectId,
    ): Promise<CategoryDocument[] | IPaginationResult<CategoryDocument>> {
        return this.findAll(
            {
                parent: parentId,
                isActive: true,
            },
            {
                order: { sortOrder: 1, name: 1 },
            },
        );
    }

    async incrementPostCount(_id: Types.ObjectId): Promise<CategoryDocument> {
        return this.updateOneById(_id, {
            $inc: { postCount: 1 },
        });
    }

    async decrementPostCount(_id: Types.ObjectId): Promise<CategoryDocument> {
        return this.updateOneById(_id, {
            $inc: { postCount: -1 },
        });
    }

    async updateSortOrder(
        _id: Types.ObjectId,
        sortOrder: number,
    ): Promise<CategoryDocument> {
        return this.updateOneById(_id, {
            sortOrder,
        });
    }

    async activate(_id: Types.ObjectId): Promise<CategoryDocument> {
        return this.updateOneById(_id, {
            isActive: true,
        });
    }

    async deactivate(_id: Types.ObjectId): Promise<CategoryDocument> {
        return this.updateOneById(_id, {
            isActive: false,
        });
    }
}
