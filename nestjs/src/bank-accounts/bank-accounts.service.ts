import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { Repository } from 'typeorm';
import { BankAccountEntity } from './entities/bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly BankAccountEntityRepository: Repository<BankAccountEntity>,
  ) {}

  async create(
    createBankAccountEntityDto: CreateBankAccountDto,
  ): Promise<BankAccountEntity> {
    const bank_account = await this.BankAccountEntityRepository.save(
      createBankAccountEntityDto,
    );

    return bank_account;
  }

  async findAll(): Promise<BankAccountEntity[]> {
    const bank_accounts = await this.BankAccountEntityRepository.find();
    return bank_accounts;
  }

  async findOne(id: string): Promise<BankAccountEntity> {
    return await this.BankAccountEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
