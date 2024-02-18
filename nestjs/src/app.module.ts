import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountEntity } from './bank-accounts/entities/bank-account.entity';
import { PixKeysModule } from './pix-keys/pix-keys.module';
import { PixKeyEntity } from './pix-keys/entities/pix-key.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      database: 'code_pix',
      username: 'postgres',
      password: 'root',
      entities: [BankAccountEntity, PixKeyEntity],
      synchronize: true,
    }),
    BankAccountsModule,
    PixKeysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
