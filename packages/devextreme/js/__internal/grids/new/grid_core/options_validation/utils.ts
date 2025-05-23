import errors from '@js/ui/widget/ui.errors';

export const throwError = (errorCode?: string, message?: string): void => {
  throw errors.Error(errorCode, message);
};
