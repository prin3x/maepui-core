import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { FindOrderDto } from './dto/find-orders.dto';
import { Address } from 'address/entities/address.entity';
import { User } from 'users/entities/user.entity';
import { OrderItem } from 'order-items/entities/order-item.entity';

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
      billing_address: `${billingAddress.address}, ${billingAddress.sub_district}, ${billingAddress.district}, ${billingAddress.province}, ${billingAddress.postalCode}`,
      shipping_address: `${shippingAddress.address}, ${shippingAddress.sub_district}, ${shippingAddress.district}, ${shippingAddress.province}, ${shippingAddress.postalCode}`,
      customer,
      total_amount: createOrderDto.total_amount,
      transaction_id: createOrderDto.transaction_id,
      payment_method: createOrderDto.payment_method,
      notes: createOrderDto.notes,
    });

    // Then, create and save orderItems with the created order's id
    const orderItems = createOrderDto.products.map((product) => {
      return this.orderItemRepository.create({
        ...product,
        product_id: product.product_id,
        quantity: product.quantity,
        order: order, // Associate each orderItem with the created order
      });
    });

    await this.orderItemRepository.save(orderItems);

    return order;
  }

  async findAll(query: FindOrderDto) {
    this.logger.log('[OrdersService] - findAll');

    const { page = 1, paginate } = query;

    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let orders: Order[] = [];
    let meta = { total: 0, page, limit };

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

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderRepository.update(id, updateOrderDto);
  }

  async remove(id: number) {
    return await this.orderRepository.delete(id);
  }
}
