import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/confirm-payment/:orderId')
  @UseInterceptors(FilesInterceptor('paymentSlip'))
  confirmPayment(@Param('orderId') orderId: string, @UploadedFiles() paymentSlip: Array<Express.Multer.File>) {
    return this.paymentsService.confirmPayment(orderId, paymentSlip);
  }

  @Post('/approve-payment/:paymentId')
  approvePayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.approvePayment(paymentId);
  }

  @Post('/reject-payment/:paymentId')
  rejectPayment(@Param('paymentId') paymentId: string) {
    return this.paymentsService.rejectPayment(paymentId);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
