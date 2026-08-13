import { isDefined } from '@js/core/utils/type';

export const INVALIDATE_CLASS = 'invalid';

export const VALIDATION_STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  pending: 'pending',
} as const;

export type ValidationStatus = typeof VALIDATION_STATUS[keyof typeof VALIDATION_STATUS];

export const VALIDATION_CANCELLED = 'cancel';

export interface CellValidationResult {
  status?: ValidationStatus;
  disabledPendingId?: unknown;
}

export const validationResultIsValid = (
  result: unknown,
): result is CellValidationResult => isDefined(result) && result !== VALIDATION_CANCELLED;
