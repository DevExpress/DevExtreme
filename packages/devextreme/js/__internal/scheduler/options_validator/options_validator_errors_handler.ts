import errors from '@js/ui/widget/ui.errors';

import type { GlobalErrorHandler } from './core/index';
import { OptionsValidatorErrorHandler } from './core/index';
import type { SchedulerValidatorNames } from './types';

const GLOBAL_ERROR_HANDLER: GlobalErrorHandler = {
  logError: (errorCode: string) => { errors.log(errorCode); },
  throwError: (errorCode: string) => { throw errors.Error(errorCode); },
};

export class SchedulerOptionsValidatorErrorsHandler
  extends OptionsValidatorErrorHandler<SchedulerValidatorNames> {
  constructor() {
    super(
      {
        startDayHour: 'E1058',
        endDayHour: 'E1058',
        startDayHourAndEndDayHour: 'E1058',
        offset: 'E1061',
        cellDuration: 'E1062',
        cellDurationAndVisibleInterval: 'E1062',
      },
      GLOBAL_ERROR_HANDLER,
    );
  }
}
