import { OrderItem } from 'src/order-items/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_id: string;

  @Column({ default: 'PENDING' })
  status: OrderStatus;

  @Column()
  shipping_address: string;

  @Column()
  billing_address: string;

  @Column()
  total_amount: number;

  @Column({ default: 0 })
  total_discounts: number;

  @Column({ default: 'money_transfer' })
  payment_method: string;

  @Column({ default: 'PENDING' })
  payment_status: PaymentStatus;

  @Column()
  transaction_id: string;

  @Column({ default: 'standard' })
  shipping_method: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  tracking_information?: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer?: User;

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
