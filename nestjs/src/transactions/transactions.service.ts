import { lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DataSource, Repository } from 'typeorm';
import {
  TransactionEntity,
  TransactionOperation,
  TransactionStatus,
} from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';
import { ClientKafka } from '@nestjs/microservices';
import { PixKeyEntity } from 'src/pix-keys/entities/pix-key.entity';
import { CreateFromAnotherBankAccountDto } from './dto/create-transaction-from-another-bank-account.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountEntityRepository: Repository<BankAccountEntity>,
    private dataSource: DataSource,

    @Inject('KAFKA_SERVICE')
    private kafkaService: ClientKafka,
  ) {}

  async create(
    bankAccountId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    const transaction = await this.dataSource.transaction(async (manager) => {
      const bankAccount = await manager.findOneOrFail(BankAccountEntity, {
        where: {
          id: bankAccountId,
        },
        lock: { mode: 'pessimistic_write' },
      });
      const transaction = manager.create(TransactionEntity, {
        ...createTransactionDto,
        amount: createTransactionDto.amount * -1,
        bank_account_id: bankAccountId,
        operation: TransactionOperation.debit,
      });
      await manager.save(transaction);

      bankAccount.balance += transaction.amount;

      await manager.save(bankAccount);
      return transaction;
    });

    const sendData = {
      id: transaction.id,
      accountId: bankAccountId,
      amount: createTransactionDto.amount,
      pixKeyTo: createTransactionDto.pix_key_key,
      pixKeyKindTo: createTransactionDto.pix_key_kind,
      description: createTransactionDto.description,
    };

    await lastValueFrom(this.kafkaService.emit('transactions', sendData));

    return transaction;
  }

  async createFromAnotherBankAccount(input: CreateFromAnotherBankAccountDto) {
    const transaction = await this.dataSource.transaction(async (manager) => {
      const pixKey: PixKeyEntity = await manager.findOneOrFail(PixKeyEntity, {
        where: {
          key: input.pixKeyTo,
          kind: input.pixKeyKindTo,
        },
      });

      const bankAccount: BankAccountEntity = await manager.findOneOrFail(
        BankAccountEntity,
        {
          where: { id: pixKey.bank_account_id },
          lock: { mode: 'pessimistic_write' },
        },
      );

      const transaction: TransactionEntity = manager.create(TransactionEntity, {
        related_transaction_id: input.id,
        amount: input.amount,
        description: input.description,
        bank_account_id: bankAccount.id,
        bank_account_from_id: input.accountId,
        pix_key_key: input.pixKeyTo,
        pix_key_kind: input.pixKeyKindTo,
        operation: TransactionOperation.credit,
        status: TransactionStatus.completed,
      });

      await manager.save(transaction);

      bankAccount.balance += transaction.amount;
      await manager.save(bankAccount);
    });

    const sendData = {
      ...input,
      status: 'confirmed',
    };

    await lastValueFrom(
      this.kafkaService.emit('transaction_confirmation', sendData),
    );

    return transaction;
  }

  async confirmTransaction(
    input: ConfirmTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOneOrFail({
      where: {
        id: input.id,
      },
    });

    await this.transactionRepository.update(
      { id: input.id },
      {
        status: TransactionStatus.completed,
      },
    );

    const sendData = {
      id: input.id,
      accountId: transaction.bank_account_id,
      amount: Math.abs(transaction.amount),
      pixKeyTo: transaction.pix_key_key,
      pixKeyKinTo: transaction.pix_key_kind,
      description: transaction.description,
      status: TransactionStatus.completed,
    };

    await lastValueFrom(
      this.kafkaService.emit('transaction_confirmation', sendData),
    );

    return transaction;
  }

  async findAll(bankAccountId: string): Promise<TransactionEntity[]> {
    const transactions = await this.transactionRepository.find({
      where: {
        bank_account_id: bankAccountId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return transactions;
  }
}
