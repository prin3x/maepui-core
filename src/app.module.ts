import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { AddressModule } from './address/address.module';
import configuration from './config/configuration';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { FaqModule } from './faq/faq.module';
import datasource from './database/datasource';
import './config/firebase-config';
import { AuthMiddleware } from './middleswares/auth.middleware';

const NODE_ENV = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration, datasource],
      envFilePath: `.env.${NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Category, Tag]),
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
    AddressModule,
    SettingsModule,
    FaqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/signin', method: RequestMethod.POST },
        { path: 'auth/signin-admin', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST },
        { path: 'auth/signup-admin', method: RequestMethod.POST },
        { path: 'settings/home', method: RequestMethod.GET },
        { path: 'settings/themeOptions', method: RequestMethod.GET },
        { path: 'blogs', method: RequestMethod.GET },
        { path: 'products', method: RequestMethod.GET },
        { path: 'products/:id', method: RequestMethod.GET },
        { path: 'blogs/slug/:slug', method: RequestMethod.GET },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'tags', method: RequestMethod.GET },
        { path: 'reviews', method: RequestMethod.GET },
        { path: 'faq', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
