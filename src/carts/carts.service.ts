import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { ProductsService } from 'src/products/products.service';
import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartsService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}
  async create(createCartDto: CreateCartDto) {
    const cart = this.cartRepository.create({
      user_id: createCartDto.user_id,
      subtotal: createCartDto.subtotal,
      total: createCartDto.total,
      cartItems: [],
    });
    return await this.cartRepository.save(cart);
  }

  async findOneByUserId(userId: string) {
    this.logger.log(`[CartsService] - findOneByUserId, userId: ${userId}`);
    if (!userId) return null;
    let cart;
    cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.product.thumbnail'],
    });

    if (!cart) {
      cart = await this.create({ user_id: userId, subtotal: 0, total: 0 });
    }

    return cart;
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

  async addItemToCart(userId: string, addItemToCartDto: AddItemToCartDto[]) {
    this.logger.log(`[CartsService] - addItemToCart, userId: ${userId}`);
    let cart = await this.findOneByUserId(userId);
    if (!cart) {
      cart = await this.create({ user_id: userId, subtotal: 0, total: 0 });
    }

    const newCartItems = [];

    for (const item of addItemToCartDto) {
      const { product, quantity } = item;
      const targetProduct = await this.productsService.findOne(product.id);
      if (!targetProduct) {
        throw new NotFoundException(`Product with ID ${product.id} not found`);
      }
      const existingCartItem = cart.cartItems.find((ci) => ci.product.id === product.id);
      if (existingCartItem) {
        existingCartItem.quantity = quantity;
        existingCartItem.total = existingCartItem.product.price * existingCartItem.quantity;
        existingCartItem.subtotal = existingCartItem.total; // Update if there are other factors affecting subtotal
        newCartItems.push(existingCartItem);
      } else {
        const newCartItem: CartItem = plainToInstance(CartItem, {
          product: product,
          quantity: quantity,
          total: product.price * quantity,
          subtotal: product.price * quantity,
          cart: cart,
        });
        newCartItems.push(newCartItem);
      }
    }

    // Remove items that are not in the newCartItems list
    const itemsToRemove = cart.cartItems.filter(
      (existingItem) => !newCartItems.some((newItem) => newItem.product.id === existingItem.product.id),
    );

    for (const item of itemsToRemove) {
      await this.cartItemRepository.remove(item);
    }

    // Recalculate the cart totals
    cart.cartItems = newCartItems;
    cart.subtotal = cart.cartItems.reduce((sum, item) => sum + item.total, 0);
    cart.total = cart.subtotal; // Assuming no additional taxes or fees for simplicity
    await this.saveCartWithItems(cart, cart.cartItems);
    return cart;
  }
  async saveCartWithItems(cart: Cart, cartItems: CartItem[]) {
    cart.cartItems = cartItems;
    await this.cartRepository.save(cart);
    return cart;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
