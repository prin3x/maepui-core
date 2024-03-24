import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, CategoryTypeEnum } from 'src/categories/entities/category.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly authService: AuthService,
  ) {}
  checkServerHealth(): string {
    return 'Server is healthy';
  }

  async seedData() {
    await this.seedRolesAndUser();
    await this.seedProductCategories();
    await this.seedBlogCategories();
    await this.seedTags();
    return 'Data seeded';
  }

  async seedRolesAndUser() {
    await this.userRepository.delete({
      email: 'admin@example.com',
    });
    await this.authService.signUp({
      email: 'admin@example.com',
      password: '123123123',
    });

    return 'Roles and user seeded';
  }

  async seedProductCategories() {
    const categories = await this.categoryRepository.find({
      where: { type: CategoryTypeEnum.PRODUCT },
    });
    if (categories.length === 0) {
      // Seed product categories
      // Electronics
      const category = this.categoryRepository.create({
        name: 'Electronics',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Agriculture
      const category1 = this.categoryRepository.create({
        name: 'Agriculture',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Fashion
      const category2 = this.categoryRepository.create({
        name: 'Fashion',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Food
      const category3 = this.categoryRepository.create({
        name: 'Food',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Health
      const category4 = this.categoryRepository.create({
        name: 'Health',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Sports
      const category5 = this.categoryRepository.create({
        name: 'Sports',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Travel
      const category6 = this.categoryRepository.create({
        name: 'Travel',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Furniture
      const category7 = this.categoryRepository.create({
        name: 'Furniture',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Books
      const category8 = this.categoryRepository.create({
        name: 'Books',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Music
      const category9 = this.categoryRepository.create({
        name: 'Music',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Movies
      const category10 = this.categoryRepository.create({
        name: 'Movies',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Games
      const category11 = this.categoryRepository.create({
        name: 'Games',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Beauty
      const category12 = this.categoryRepository.create({
        name: 'Beauty',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Shoes
      const category13 = this.categoryRepository.create({
        name: 'Shoes',
        type: CategoryTypeEnum.PRODUCT,
      });
      // Save
      await this.categoryRepository.save([
        category,
        category1,
        category2,
        category3,
        category4,
        category5,
        category6,
        category7,
        category8,
        category9,
        category10,
        category11,
        category12,
        category13,
      ]);
      return 'Categories seeded';
    }

    return 'Categories already seeded';
  }

  async seedBlogCategories() {
    const categories = await this.categoryRepository.find({
      where: { type: CategoryTypeEnum.BLOG },
    });
    if (categories.length === 0) {
      // Seed blog categories
      // Technology
      const category = this.categoryRepository.create({
        name: 'Technology',
        type: CategoryTypeEnum.BLOG,
      });
      // Agriculture
      const category1 = this.categoryRepository.create({
        name: 'Agriculture',
        type: CategoryTypeEnum.BLOG,
      });
      // Fashion
      const category2 = this.categoryRepository.create({
        name: 'Fashion',
        type: CategoryTypeEnum.BLOG,
      });
      // Food
      const category3 = this.categoryRepository.create({
        name: 'Food',
        type: CategoryTypeEnum.BLOG,
      });
      // Health
      const category4 = this.categoryRepository.create({
        name: 'Health',
        type: CategoryTypeEnum.BLOG,
      });
      // Sports
      const category5 = this.categoryRepository.create({
        name: 'Sports',
        type: CategoryTypeEnum.BLOG,
      });
      // Travel
      const category6 = this.categoryRepository.create({
        name: 'Travel',
        type: CategoryTypeEnum.BLOG,
      });
      // Furniture
      const category7 = this.categoryRepository.create({
        name: 'Furniture',
        type: CategoryTypeEnum.BLOG,
      });
      // Books
      const category8 = this.categoryRepository.create({
        name: 'Books',
        type: CategoryTypeEnum.BLOG,
      });
      // Music
      const category9 = this.categoryRepository.create({
        name: 'Music',
        type: CategoryTypeEnum.BLOG,
      });
      // Movies
      const category10 = this.categoryRepository.create({
        name: 'Movies',
        type: CategoryTypeEnum.BLOG,
      });
      // Games
      const category11 = this.categoryRepository.create({
        name: 'Games',
        type: CategoryTypeEnum.BLOG,
      });
      // Beauty
      const category12 = this.categoryRepository.create({
        name: 'Beauty',
        type: CategoryTypeEnum.BLOG,
      });
      // Shoes
      const category13 = this.categoryRepository.create({
        name: 'Shoes',
        type: CategoryTypeEnum.BLOG,
      });
      // Save
      await this.categoryRepository.save([
        category,
        category1,
        category2,
        category3,
        category4,
        category5,
        category6,
        category7,
        category8,
        category9,
        category10,
        category11,
        category12,
        category13,
      ]);
    }

    return 'Categories already seeded';
  }

  async seedTags() {
    const tags = await this.tagRepository.find();
    if (tags.length === 0) {
      // Seed tags
      const tag = this.tagRepository.create({
        name: 'Top Seller',
        description: 'Top Seller',
      });
      const tag1 = this.tagRepository.create({
        name: 'New Arrival',
        description: 'New Arrival',
      });
      const tag2 = this.tagRepository.create({
        name: 'Best Seller',
        description: 'Best Seller',
      });
      const tag3 = this.tagRepository.create({
        name: 'Trending',
        description: 'Trending',
      });
      const tag4 = this.tagRepository.create({
        name: 'Most Popular',
        description: 'Most Popular',
      });
      const tag5 = this.tagRepository.create({
        name: 'On Sale',
        description: 'On Sale',
      });
      const tag6 = this.tagRepository.create({
        name: 'Limited Edition',
        description: 'Limited Edition',
      });
      const tag7 = this.tagRepository.create({
        name: 'Exclusive',
        description: 'Exclusive',
      });
      const tag8 = this.tagRepository.create({
        name: 'Special Offer',
        description: 'Special Offer',
      });
      const tag9 = this.tagRepository.create({
        name: 'Discount',
        description: 'Discount',
      });
      const tag10 = this.tagRepository.create({
        name: 'Free Shipping',
        description: 'Free Shipping',
      });
      // Save
      await this.tagRepository.save([tag, tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10]);

      return 'Tags seeded';
    }

    return 'Tags already seeded';
  }
}
