import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly uploadService: UploadService, // Inject UploadService
  ) {}
  async rejectPayment(paymentId: string) {
    const payment = await this.paymentRepository.findOne({ relations: { order: true }, where: { id: paymentId } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    const order = await this.orderRepository.findOne({ where: { id: payment.order.id } });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return this.paymentRepository.manager.transaction(async (transactionalEntityManager) => {
      payment.status = PaymentStatus.REJECTED;
      order.payment_status = PaymentStatus.REJECTED;
      await transactionalEntityManager.save(Order, order);
      return await transactionalEntityManager.save(Payment, payment);
    });
  }
  async approvePayment(paymentId: string) {
    const payment = await this.paymentRepository.findOne({ relations: { order: true }, where: { id: paymentId } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    const order = await this.orderRepository.findOne({ where: { id: payment.order.id } });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return this.paymentRepository.manager.transaction(async (transactionalEntityManager) => {
      payment.status = PaymentStatus.APPROVED;
      order.payment_status = PaymentStatus.APPROVED;
      await transactionalEntityManager.save(Order, order);
      return await transactionalEntityManager.save(Payment, payment);
    });
  }

  async confirmPayment(orderId: string, paymentSlip: Array<Express.Multer.File>) {
    // Handle the file and orderId here
    if (paymentSlip.length === 0) {
      throw new BadRequestException('Payment slip is required');
    }

    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return this.paymentRepository.manager.transaction(async (transactionalEntityManager) => {
      try {
        const uploadedFiles = await this.uploadService.uploadFiles(paymentSlip, 'maepui-core');
        const paymentSlipUrls = uploadedFiles.at(0);

        const payment = this.paymentRepository.create({
          amount: order.total_amount,
          status: PaymentStatus.PENDING,
          order,
          payment_slip_url: paymentSlipUrls, // Assuming you have a field to store the URLs
        });

        await transactionalEntityManager.save(Order, order);
        await transactionalEntityManager.save(Payment, payment);

        return payment;
      } catch (error) {
        throw new BadRequestException(`Error confirming payment: ${error.message}`);
      }
    });
  }

  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
