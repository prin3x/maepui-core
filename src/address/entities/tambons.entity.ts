import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'thai_tambons' })
export class ThaiTambons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text' })
  name_th: string;

  @Column({ nullable: true, type: 'text' })
  name_en: string;

  @Column({ nullable: true, type: 'text' })
  amphure_id: number;

  @Column({ nullable: true, type: 'text' })
  zipcode: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
