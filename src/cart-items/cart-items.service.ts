import { Injectable, Logger } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartsService } from 'src/carts/carts.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartItemsService {
  private readonly logger = new Logger(CartItemsService.name);
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private cartsService: CartsService,
    private productsService: ProductsService,
  ) {}
  create(createCartItemDto: CreateCartItemDto) {
    return 'This action adds a new cartItem';
  }

  findAll() {
    return `This action returns all cartItems`;
  }

  async findOne(id: string) {
    return await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async createCartItem(createCartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Adding cart item to new cart with product: ${createCartItemDto.product_id} - quantity: ${createCartItemDto.quantity}`,
    );

    const product = await this.productsService.findOne(createCartItemDto.product_id);

    const subtotal = createCartItemDto.quantity * product.price;
    const total = createCartItemDto.quantity * product.price;

    const existingCart = await this.cartsService.findOneByUserId(createCartItemDto.user_id);

    let cartItemData;
    if (existingCart) {
      const existingCartItem = existingCart.cartItems.find((item) => item.product.id === product.id);
      if (existingCartItem) {
        existingCartItem.quantity = createCartItemDto.quantity;
        existingCartItem.subtotal = existingCartItem.quantity * product.price;
        existingCartItem.total = existingCartItem.quantity * product.price;
        await this.cartItemRepository.save(existingCartItem);
        cartItemData = existingCartItem;
      } else {
        cartItemData = {
          cart: existingCart,
          product,
          quantity: createCartItemDto.quantity,
          subtotal,
          total,
        };
        const newCartItem = this.cartItemRepository.create(cartItemData);
        await this.cartItemRepository.save(newCartItem);
      }
    } else {
      cartItemData = {
        cart: await this.cartsService.create({
          user_id: createCartItemDto.user_id,
          subtotal,
          total,
        }),
        product,
        quantity: createCartItemDto.quantity,
        subtotal,
        total,
      };
      const newCartItem = this.cartItemRepository.create(cartItemData);
      await this.cartItemRepository.save(newCartItem);
    }

    await this.cartsService.updateCartTotal(cartItemData.cart.id);
    return cartItemData;
  }

  async updateCartItemQuantity(cartItemId: string, updateCartItemDto: UpdateCartItemDto) {
    this.logger.log(
      `Updating cart item quantity for cart item with id: ${cartItemId} - quantity: ${updateCartItemDto.quantity}`,
    );
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['product'],
    });

    const product = await this.productsService.findOne(cartItem.product.id);

    cartItem.quantity = updateCartItemDto.quantity;

    const subtotal = cartItem.quantity * product.price;
    const total = cartItem.quantity * product.price;

    cartItem.subtotal = subtotal;
    cartItem.total = total;
    await this.cartItemRepository.save(cartItem);

    const cart = await this.cartsService.findOne(cartItem.id);
    await this.cartsService.updateCartTotal(cart.id);
    return cartItem;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
