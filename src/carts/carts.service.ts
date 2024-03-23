import { Injectable, Logger } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const cart = this.cartRepository.create({
      user: createCartDto.user_id,
      subtotal: createCartDto.subtotal,
      total: createCartDto.total,
    });
    return await this.cartRepository.save(cart);
  }

  async findOneByUserId(userId: string) {
    this.logger.log(`[CartsService] - findOneByUserId, userId: ${userId}`);
    if (!userId) return null;
    return await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.product.thumbnail'],
    });
  }

  async updateCartTotal(cartId: string) {
    const cart = await this.findOne(cartId);
    const cartItems = cart.cartItems;
    let total = 0;
    cartItems.forEach((item) => {
      total += item.total;
    });
    cart.subtotal = total;
    cart.total = total;
    await this.cartRepository.save(cart);
    return cart;
  }

  async findAll() {
    return await this.cartRepository.find({
      relations: ['cartItems'],
      order: {
        cartItems: {
          updated_at: 'DESC',
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems'],
    });
  }

  update(id: number) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
