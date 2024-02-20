import { Injectable } from '@nestjs/common';
import { CreatePixKeyDto } from './dto/create-pix-key.dto';
import { Repository } from 'typeorm';
import { PixKeyEntity } from './entities/pix-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';

@Injectable()
export class PixKeysService {
  constructor(
    @InjectRepository(PixKeyEntity)
    private readonly pixKeyRepository: Repository<PixKeyEntity>,
    @InjectRepository(BankAccountEntity)
    private readonly BankAccountEntityRepository: Repository<BankAccountEntity>,
  ) {}

  async create(bankAccountId: string, createPixKeyDto: CreatePixKeyDto) {
    await this.BankAccountEntityRepository.findOneOrFail({
      where: {
        id: bankAccountId,
      },
    });

    //logica para consultar se a chave existe no banco central (grpc)
    return this.pixKeyRepository.save({
      bank_account_id: bankAccountId,
      ...createPixKeyDto,
    });
  }

  findAll(bankAccountId: string) {
    return this.pixKeyRepository.find({
      where: {
        bank_account_id: bankAccountId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }
}
