import { CartItem } from 'src/cart-items/entities/cart-item.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'subtotal',
    nullable: false,
    default: 0,
  })
  subtotal: number;

  @Column({
    type: 'int',
    name: 'total',
    nullable: false,
    default: 0,
  })
  total: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  user_id: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItems: CartItem[];
}
