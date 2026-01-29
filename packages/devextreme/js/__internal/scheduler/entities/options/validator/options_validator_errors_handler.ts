import errors from '@js/ui/widget/ui.errors';

import type { GlobalErrorHandler } from './core/index';
import { OptionsValidatorErrorHandler } from './core/index';
import type { SchedulerValidatorNames } from './types';

const GLOBAL_ERROR_HANDLER: GlobalErrorHandler = {
  logError: (errorCode: string, ...args) => { errors.log(errorCode, ...args); },
  throwError: (errorCode: string, ...args) => { throw errors.Error(errorCode, ...args); },
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
        views: 'W0008',
      },
      GLOBAL_ERROR_HANDLER,
    );
  }
}
