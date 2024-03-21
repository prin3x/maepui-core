import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'thai_provinces' })
export class ThaiProvinces {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name_th: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ nullable: true })
  geography_id: number;
}
