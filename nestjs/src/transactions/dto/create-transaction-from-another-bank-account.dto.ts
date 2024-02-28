import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PixKeyKind } from 'src/pix-keys/entities/pix-key.entity';

export class CreateTransactionFromAnotherBankAccountDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  pixKeyTo: string;

  @IsIn(['cpf', 'email'])
  @IsNotEmpty()
  @IsString()
  pixKeyKindTo: PixKeyKind;

  @IsOptional()
  @IsString()
  description?: string = null;

  @Min(0.01)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  status: 'pending' | 'confirmed';
}
