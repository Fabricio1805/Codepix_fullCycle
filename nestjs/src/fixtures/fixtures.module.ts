import { Module } from '@nestjs/common';
import { FixturesCommand } from './fixtures.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';
import { PixKeyEntity } from 'src/pix-keys/entities/pix-key.entity';
import { TransactionEntity } from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccountEntity,
      PixKeyEntity,
      TransactionEntity,
    ]),
  ],
  providers: [FixturesCommand],
})
export class FixturesModule {}
