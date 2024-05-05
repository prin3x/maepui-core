import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { CartItemsModule } from './cart-items/cart-items.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { PaymentsModule } from './payments/payments.module';
import { SalesModule } from './sales/sales.module';
import { CategoriesModule } from './categories/categories.module';
import { BlogsModule } from './blogs/blogs.module';
import { TagsModule } from './tags/tags.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MinioModule } from './minio/minio.module';
import { UploadModule } from './upload/upload.module';
import { MediaModule } from './media/media.module';
import { RolesModule } from './roles/roles.module';
import { AddressModule } from './address/address.module';
import configuration from './config/configuration';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { FaqModule } from './faq/faq.module';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV, 'NODE_ENV');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      envFilePath: `.env.${NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Roles, User, Category, Tag]),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartsModule,
    CartItemsModule,
    OrdersModule,
    OrderItemsModule,
    PaymentsModule,
    SalesModule,
    CategoriesModule,
    BlogsModule,
    TagsModule,
    ReviewsModule,
    MinioModule,
    UploadModule,
    MediaModule,
    RolesModule,
    AddressModule,
    SettingsModule,
    FaqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
