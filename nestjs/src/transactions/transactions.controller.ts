import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFromAnotherBankAccountDto } from './dto/create-transaction-from-another-bank-account.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';

@Controller('bank-accounts/:bankAccountId/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Param('bankAccountId') bankAccountId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(bankAccountId, createTransactionDto);
  }

  @Get()
  findAll(@Param('bankAccountId') bankAccountId: string) {
    return this.transactionsService.findAll(bankAccountId);
  }

  @MessagePattern('bank001')
  async onTransactionProcessedBank001(
    @Payload(
      new ValidationPipe({
        errorHttpStatusCode: 422,
      }),
    )
    message: CreateFromAnotherBankAccountDto | ConfirmTransactionDto,
  ) {
    if (process.env.BANK_CODE !== '001') return;
    await this.processTransaction(message);
  }

  @MessagePattern('bank002')
  async onTransactionProcessedBank002(
    @Payload(
      new ValidationPipe({
        errorHttpStatusCode: 422,
      }),
    )
    message: CreateFromAnotherBankAccountDto | ConfirmTransactionDto,
  ) {
    if (process.env.BANK_CODE !== '002') return;
    await this.processTransaction(message);
  }

  async processTransaction(
    message: CreateFromAnotherBankAccountDto | ConfirmTransactionDto,
  ) {
    try {
      if (message.status === 'pending') {
        await this.transactionsService.createFromAnotherBankAccount(
          message as CreateFromAnotherBankAccountDto,
        );
      }

      if (message.status === 'confirmed') {
        await this.transactionsService.confirmTransaction(
          message as ConfirmTransactionDto,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
