import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { FindOrderDto } from './dto/find-orders.dto';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { LineNotificationService } from 'src/services/line/line.service';
import { Payment, PaymentStatus } from 'src/payments/entities/payment.entity';

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
    private lineNotificationService: LineNotificationService,
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

    const parsedBillingAddress = this.convertAddress(billingAddress);
    const parsedShippingAddress = this.convertAddress(shippingAddress);

    this.orderRepository.manager.transaction(async (manager) => {
      // Create the order first without the orderItems
      const order = await manager.save(Order, {
        billing_address: parsedBillingAddress,
        shipping_address: parsedShippingAddress,
        customer,
        total_amount: createOrderDto.total_amount,
        transaction_id: 'BETA',
        payment_method: createOrderDto.payment_method,
        notes: createOrderDto.notes,
        shipping_method: createOrderDto.shipping_method,
        payment_status: PaymentStatus.PENDING,
      });

      // Then, create and save orderItems with the created order's id
      const orderItems = await Promise.all(
        createOrderDto.products.map((product) => {
          return manager.save(OrderItem, {
            ...product,
            product_id: product.product_id,
            quantity: product.quantity,
            order: order,
          });
        }),
      );

      await manager.save(OrderItem, orderItems);

      await manager.save(Payment, {
        order,
        amount: createOrderDto.total_amount,
        payment_method: createOrderDto.payment_method,
      });

      return order;
    });
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

    const parsedBillingAddress = this.convertAddress(billingAddress);
    const parsedShippingAddress = this.convertAddress(shippingAddress);

    return this.orderRepository.manager.transaction(async (manager) => {
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
        const order = await manager.save(Order, {
          billing_address: parsedBillingAddress,
          shipping_address: parsedShippingAddress,
          customer,
          total_amount: createOrderDto.total_amount,
          transaction_id: 'BETA',
          payment_method: createOrderDto.payment_method,
          notes: createOrderDto.notes,
          shipping_method: createOrderDto.shipping_method,
          payment_status: PaymentStatus.PENDING,
          orderItems: orderItems,
        });

        await this.lineNotificationService.sendOrderNotification(JSON.stringify(order));

        return order;
      } catch (error) {
        throw new InternalServerErrorException('Failed to save order items');
      }
    });
  }

  async findAll(query: FindOrderDto) {
    this.logger.log('[OrdersService] - findAll');

    const { page = 1, paginate } = query;

    const limit = Number(paginate) ?? 10;
    const offset = paginate ? (page - 1) * limit : 0;

    let orders: Order[] = [];
    const meta = { total: 0, page, limit };

    orders = await this.orderRepository.find({
      relations: ['orderItems', 'customer', 'payments'],
      take: limit,
      skip: offset,
    });

    meta.total = await this.orderRepository.count();

    return { data: orders, ...meta };
  }

  async findOne(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product', 'customer', 'payments'],
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

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return await this.orderRepository.update(id, { status: status });
  }

  async findMyOrders(userId: string) {
    this.logger.log('[OrdersService] - findMyOrders');

    return await this.orderRepository.find({
      where: { customer: { id: userId } },
      relations: ['orderItems', 'orderItems.product', 'customer', 'payments'],
    });
  }

  convertAddress = (address: Address) => {
    if (!address) return '';
    return `${address.address}, ${address.country}, ${address.pincode}, ${address.phone}`;
  };
}
