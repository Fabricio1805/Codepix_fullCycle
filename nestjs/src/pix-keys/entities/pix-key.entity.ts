import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PixKeyKind {
  cpf = 'cpf',
  email = 'email',
}

@Entity({ name: 'pix_keys' })
export class PixKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kind: string;

  @Column({ unique: true })
  key: string;

  @Column()
  bank_account_id: string;

  @ManyToOne(() => BankAccountEntity)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccountEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
