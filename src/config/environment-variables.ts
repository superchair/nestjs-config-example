import { plainToInstance, Transform } from 'class-transformer';
import { IsBoolean, validateSync } from 'class-validator';

export const validationFn = (
  config: Record<string, unknown>,
): EnvironmentVariables => {
  const validateConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validateConfig;
};

function transformStringBool({ value }: { value: string }): boolean | string {
  /*
   * Ensures we only transform 'true' and 'false'.
   * Anything else remains as the original string,
   * which, if validated as @IsBoolean(), will cause a validation error.
   */
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
}
