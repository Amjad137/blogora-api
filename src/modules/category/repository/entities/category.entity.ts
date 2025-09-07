import {
    DatabaseEntity,
    DatabaseProp,
    DatabaseSchema,
} from '@common/database/decorators/database.decorator';
import { IBaseEntity } from '@common/database/interfaces/database.interface';
import { BaseEntity } from '@common/database/bases/base.entity';
import { Types } from 'mongoose';

export const CategoryTableName = 'Categories';

@DatabaseEntity({ collection: CategoryTableName })
export class CategoryEntity extends BaseEntity {
    @DatabaseProp({
        required: true,
        index: true,
        trim: true,
        type: String,
        maxlength: 100,
        unique: true,
    })
    name: string;

    @DatabaseProp({
        required: true,
        unique: true,
        index: true,
        trim: true,
        type: String,
        maxlength: 120,
    })
    slug: string;

    @DatabaseProp({
        required: false,
        trim: true,
        type: String,
        maxlength: 300,
    })
    description?: string;

    @DatabaseProp({
        required: false,
        ref: CategoryEntity.name,
        type: Types.ObjectId,
    })
    parent?: Types.ObjectId;

    @DatabaseProp({
        required: true,
        default: true,
        type: Boolean,
    })
    isActive: boolean;
}

export const CategorySchema = DatabaseSchema(CategoryEntity);
export type CategoryDocument = CategoryEntity & IBaseEntity;
