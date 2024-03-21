import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  sub_district: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column({ default: 'ไทย' })
  country: string;

  @Column()
  postalCode: string;

  @Column()
  phone: string;

  @Column()
  type: string;

  @Column({ default: true })
  isDefault: boolean;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
