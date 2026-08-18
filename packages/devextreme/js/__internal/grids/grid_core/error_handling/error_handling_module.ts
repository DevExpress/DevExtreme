import { ErrorHandlingViewController } from './error_handling_view_controlller';

export const errorHandlingModule = {
  defaultOptions(): { errorRowEnabled: boolean } {
    return {
      errorRowEnabled: true,
    };
  },
  controllers: {
    errorHandling: ErrorHandlingViewController,
  },
};
