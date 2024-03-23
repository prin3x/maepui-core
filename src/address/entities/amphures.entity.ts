// {
//     "id": 1001,
//     "name_th": "เขตพระนคร",
//     "name_en": "Khet Phra Nakhon",
//     "province_id": 1,
//     "created_at": "2019-08-09T03:33:09.000+07:00",
//     "updated_at": "2022-05-16T06:31:26.000+07:00",
//     "deleted_at": null
//   },

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'thai_amphures' })
export class ThaiAmphures {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name_th: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ nullable: true })
  province_id: number;
}
