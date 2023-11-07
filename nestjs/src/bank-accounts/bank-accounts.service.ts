import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
  ) {}

  async create(createBankAccountDto: CreateBankAccountDto) {
    return await this.bankAccountRepository.save(createBankAccountDto);
  }

  async findAll() {
    return await this.bankAccountRepository.find();
  }

  async findOne(id: string) {
    return await this.bankAccountRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
