import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Roles } from 'src/roles/entities/roles.entity';
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

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  refresh_token_hash?: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  avatar?: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart?: Cart;

  @OneToMany(() => Roles, (role) => role.user)
  roles?: Roles[];

  @OneToMany(() => Address, (role) => role.user)
  addresses?: Address[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
