import { ErrorHandlingController } from './m_error_handling';

export const errorHandlingModule = {
  defaultOptions(): { errorRowEnabled: boolean } {
    return {
      errorRowEnabled: true,
    };
  },
  controllers: {
    errorHandling: ErrorHandlingController,
  },
};
