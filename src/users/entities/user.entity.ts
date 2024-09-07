import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firebase_uid: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.ACTIVE,
  })
  status: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart?: Cart;

  @Column({ nullable: false, default: 'user' })
  role: string;

  @OneToMany(() => Address, (role) => role.user, { eager: true })
  addresses?: Address[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
