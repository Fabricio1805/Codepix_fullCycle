import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreatePixKeyDto } from './dto/create-pix-key.dto';
import { Repository } from 'typeorm';
import { PixKeyEntity, PixKeyKind } from './entities/pix-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { PixKeyClientGrpc, RegisterPixKeyGrpcResponse } from './pix-keys.grpc';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PixKeysService implements OnModuleInit {
  private pixGrpcService: PixKeyClientGrpc;

  constructor(
    @InjectRepository(PixKeyEntity)
    private readonly pixKeyRepository: Repository<PixKeyEntity>,
    @InjectRepository(BankAccountEntity)
    private readonly bankAccountEntityRepository: Repository<BankAccountEntity>,

    @Inject('PIX_PACKAGE')
    private pixGrpcPackage: ClientGrpc,
  ) {}

  onModuleInit() {
    this.pixGrpcService = this.pixGrpcPackage.getService('PixService');
  }

  async create(bankAccountId: string, createPixKeyDto: CreatePixKeyDto) {
    await this.bankAccountEntityRepository.findOneOrFail({
      where: {
        id: bankAccountId,
      },
    });

    const remotePixKey = await this.findRemotePixKey(createPixKeyDto);

    if (remotePixKey) {
      return await this.createIfNotExists(bankAccountId, remotePixKey);
    } else {
      const createdRemotePixKey = await lastValueFrom(
        this.pixGrpcService.registerPixKey({
          ...createPixKeyDto,
          accountId: bankAccountId,
        }),
      );

      return await this.pixKeyRepository.save({
        id: createdRemotePixKey.id,
        bank_account_id: bankAccountId,
        ...createPixKeyDto,
      });
    }
  }

  private async findRemotePixKey(data: {
    key: string;
    kind: string;
  }): Promise<RegisterPixKeyGrpcResponse | null> {
    try {
      return await lastValueFrom(this.pixGrpcService.find(data));
    } catch (error) {
      console.error(error);
      if (error.details == 'no key was found') {
        return null;
      }

      throw new PixKeyGrpcUnknowError('Grpc Internal Error');
    }
  }

  private async createIfNotExists(
    bankAccountId: string,
    remotePixKey: RegisterPixKeyGrpcResponse,
  ) {
    const hasLocalPixKey = await this.pixKeyRepository.exists({
      where: {
        key: remotePixKey.key,
      },
    });

    if (hasLocalPixKey) {
      throw new PixKeyAlreadyExistsError('Pix key already exists');
    } else {
      return this.pixKeyRepository.save({
        id: remotePixKey.id,
        bank_account_id: bankAccountId,
        key: remotePixKey.key,
        kind: remotePixKey.kind as PixKeyKind,
      });
    }
  }

  async findAll(bankAccountId: string) {
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

export class PixKeyGrpcUnknowError extends Error {}

export class PixKeyAlreadyExistsError extends Error {}
