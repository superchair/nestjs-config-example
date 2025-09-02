import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

function transformStringBool({ value }: { value: string }): boolean | string {
  switch (value) {
    case 'true':
      return true;

    case 'false':
      return false;

    default:
      return value;
  }
}

export class EnvironmentVariables {
  @Transform(transformStringBool)
  @IsBoolean()
  VAL_TRUE: boolean;

  @Transform(transformStringBool)
  @IsBoolean()
  VAL_FALSE: boolean;

  @IsOptional()
  VAL_OPTIONAL?: string;
}
