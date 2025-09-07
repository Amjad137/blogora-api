import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from '@modules/category/category.service';
import { CategoryController } from '@modules/category/category.controller';
import { CategoryRepository } from '@modules/category/repository/repositories/category.repository';
import {
    CategoryEntity,
    CategorySchema,
} from '@modules/category/repository/entities/category.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CategoryEntity.name, schema: CategorySchema },
        ]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository],
    exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
