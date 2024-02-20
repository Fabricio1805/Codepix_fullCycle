import { Module } from '@nestjs/common';
import { PixKeysService } from './pix-keys.service';
import { PixKeysController } from './pix-keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixKeyEntity } from './entities/pix-key.entity';
import { BankAccountEntity } from 'src/bank-accounts/entities/bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PixKeyEntity, BankAccountEntity])],
  controllers: [PixKeysController],
  providers: [PixKeysService],
})
export class PixKeysModule {}
