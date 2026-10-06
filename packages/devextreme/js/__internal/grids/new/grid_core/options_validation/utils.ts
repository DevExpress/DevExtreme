import errors from '@js/ui/widget/ui.errors';

export const throwError = (errorCode?: string, message?: string): void => {
  // @ts-expect-error the error code is set
  throw errors.Error(errorCode, message);
};
