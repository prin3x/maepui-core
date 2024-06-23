import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { FindOrderDto } from './dto/find-orders.dto';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    this.logger.log('[OrdersService] - create');

    const billingAddress = await this.addressRepository.findOne({
      where: { id: createOrderDto.billing_address_id },
    });
    const shippingAddress = await this.addressRepository.findOne({
      where: { id: createOrderDto.shipping_address_id },
    });

    const customer = await this.userRepository.findOne({
      where: { id: createOrderDto.customer_id },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Create the order first without the orderItems
    const order = await this.orderRepository.save({
      billing_address: `${billingAddress.address}`,
      shipping_address: `${shippingAddress.address}`,
      customer,
      total_amount: createOrderDto.total_amount,
      transaction_id: 'BETA',
      payment_method: createOrderDto.payment_method,
      notes: createOrderDto.notes,
      shipping_method: createOrderDto.shipping_method,
    });

    // Then, create and save orderItems with the created order's id
    const orderItems = createOrderDto.products.map((product) => {
      return this.orderItemRepository.create({
        ...product,
        product_id: product.product_id,
        quantity: product.quantity,
        order: order,
      });
    });

    await this.orderItemRepository.save(orderItems);

    return order;
  }

  async createUserOrder(userId: string, createOrderDto: CreateOrderDto) {
    this.logger.log(`[OrdersService] - createUserOrder for user ${userId}`);

    const billingAddress = await this.addressRepository.findOne({
      where: { id: createOrderDto.billing_address_id },
    });
    const shippingAddress = await this.addressRepository.findOne({
      where: { id: createOrderDto.shipping_address_id },
    });

    const customer = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    // Use repo manager to create the order
    const queryRunner = this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // Create orderItems with the created order's id
      const orderItems = createOrderDto.products.map((cartProduct) => {
        return this.orderItemRepository.create({
          ...cartProduct,
          total: cartProduct.price * cartProduct.quantity,
          product_id: cartProduct.product_id,
          quantity: cartProduct.quantity,
          price: cartProduct.price, // Ensure price is included if needed
          product: {
            id: cartProduct.product_id,
          },
        });
      });
      // Create the order first without the orderItems
      const order = await queryRunner.manager.save(Order, {
        billing_address: `${billingAddress.address}`,
        shipping_address: `${shippingAddress.address}`,
        customer,
        total_amount: createOrderDto.total_amount,
        transaction_id: 'BETA',
        payment_method: createOrderDto.payment_method,
        notes: createOrderDto.notes,
        shipping_method: createOrderDto.shipping_method,
        orderItems: orderItems,
      });

      // Save orderItems
      await queryRunner.manager.save(OrderItem, orderItems);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      console.log(`[OrdersService] - createUserOrder, error: ${error}`);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to save order items');
    } finally {
      queryRunner.release();
    }
  }

  async findAll(query: FindOrderDto) {
    this.logger.log('[OrdersService] - findAll');

    const { page = 1, paginate } = query;

    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let orders: Order[] = [];
    const meta = { total: 0, page, limit };

    orders = await this.orderRepository.find({
      relations: ['orderItems', 'customer'],
      take: limit,
      skip: offset,
    });

    meta.total = await this.orderRepository.count();

    return { data: orders, ...meta };
  }

  async findOne(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product', 'customer'],
    });
  }

  async findOrderByCustomerId(id: string) {
    return await this.orderRepository.find({
      where: { customer: { id } },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderRepository.update(id, updateOrderDto);
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }

  async findMyOrders(userId: string) {
    this.logger.log('[OrdersService] - findMyOrders');

    return await this.orderRepository.find({
      where: { customer: { id: userId } },
      relations: ['orderItems', 'orderItems.product', 'customer'],
    });
  }
}
