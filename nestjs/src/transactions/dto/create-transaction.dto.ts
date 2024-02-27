import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PixKeyKind } from 'src/pix-keys/entities/pix-key.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  pix_key_key: string;

  @IsIn(['cpf', 'email'])
  @IsNotEmpty()
  @IsString()
  pix_key_kind: PixKeyKind;

  @IsOptional()
  @IsString()
  description?: string = null;

  @Min(0.01)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  amount: number;
}
