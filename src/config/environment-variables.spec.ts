import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables, validationFn } from './environment-variables';

describe('EnvironmentVariables', () => {
  describe('class-transformer', () => {
    it('should transform "true" and "false" strings to booleans', () => {
      const input = { VAL_TRUE: 'true', VAL_FALSE: 'false' };
      const instance = plainToInstance(EnvironmentVariables, input);

      expect(instance.VAL_TRUE).toBe(true);
      expect(instance.VAL_FALSE).toBe(false);
    });

    it('should not transform other strings to booleans', () => {
      const input = { VAL_TRUE: 'some string', VAL_FALSE: 'false' };
      const instance = plainToInstance(EnvironmentVariables, input);

      expect(instance.VAL_TRUE).toBe('some string');
    });
  });

  describe('class-validator', () => {
    it('should validate correct boolean values', () => {
      const input = { VAL_TRUE: 'true', VAL_FALSE: 'false' };
      const instance = plainToInstance(EnvironmentVariables, input);
      const errors = validateSync(instance);

      expect(errors.length).toBe(0);
    });

    it('should fail validation for invalid boolean values', () => {
      const input = { VAL_TRUE: 'notabool', VAL_FALSE: 'false' };
      const instance = plainToInstance(EnvironmentVariables, input);
      const errors = validateSync(instance);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('VAL_TRUE');
    });
  });

  describe('validationFn', () => {
    it('should validate and transform valid boolean strings', () => {
      const config = { VAL_TRUE: 'true', VAL_FALSE: 'false' };
      const result = validationFn(config);
      expect(result.VAL_TRUE).toBe(true);
      expect(result.VAL_FALSE).toBe(false);
    });

    it('should throw error for invalid boolean string', () => {
      const config = { VAL_TRUE: 'notabool', VAL_FALSE: 'false' };
      expect(() => validationFn(config)).toThrow();
    });

    it('should throw error if required values are missing', () => {
      const config = { VAL_TRUE: 'true' };
      expect(() => validationFn(config)).toThrow();
    });

    it('should throw error if both values are missing', () => {
      const config = {};
      expect(() => validationFn(config)).toThrow();
    });

    it('should accept boolean values directly', () => {
      const config = { VAL_TRUE: true, VAL_FALSE: false };
      const result = validationFn(config);
      expect(result.VAL_TRUE).toBe(true);
      expect(result.VAL_FALSE).toBe(false);
    });
  });
});
