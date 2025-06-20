import { IsString, IsEnum, IsNotEmpty, Length, Matches } from 'class-validator';
import { CompanyType } from '../../../domain/enums/company-type.enum';

export class RegisterMembershipDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100, { message: 'The name must be between 2 and 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{8}-\d{1}$/, {
    message: 'CUIT must be in the format XX-XXXXXXXX-X',
  })
  cuit: string;

  @IsEnum(CompanyType, {
    message: 'Must be a valid company type (PYME or CORPORATE)',
  })
  type: CompanyType;
}
