import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pix_keys' })
export class PixKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
