import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pix_keys' })
export class PixKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
