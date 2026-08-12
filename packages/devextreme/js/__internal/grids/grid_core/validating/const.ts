import { isDefined } from '@js/core/utils/type';

export const INVALIDATE_CLASS = 'invalid';

export const VALIDATION_STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending',
};

export const VALIDATION_CANCELLED = 'cancel';

export const validationResultIsValid = (result: unknown): boolean => isDefined(result)
  && result !== VALIDATION_CANCELLED;
