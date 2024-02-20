import { IsString } from 'class-validator';
import { PixKeyKind } from '../entities/pix-key.entity';

export class CreatePixKeyDto {
  @IsString()
  key: string;
  kind: PixKeyKind;
}
