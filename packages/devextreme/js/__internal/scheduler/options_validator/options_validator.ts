import {
  mustBeDivisibleBy,
  mustBeGreaterThan,
  mustBeInRange,
  mustBeInteger,
} from './common/index';
import {
  OptionsValidator,
  Validator,
} from './core/index';
import type { SchedulerOptions, SchedulerValidatorNames } from './types';
import {
  cellDurationMustBeLessThanVisibleInterval,
  endDayHourMustBeGreaterThanStartDayHour,
  visibleIntervalMustBeDivisibleByCellDuration,
} from './validator_rules';

export class SchedulerOptionsValidator
  extends OptionsValidator<SchedulerValidatorNames, SchedulerOptions> {
  constructor() {
    super({
      startDayHour: new Validator(
        ({ startDayHour }) => startDayHour,
        [
          mustBeInteger,
          mustBeInRange([0, 24]),
        ],
      ),
      endDayHour: new Validator(
        ({ endDayHour }) => endDayHour,
        [
          mustBeInteger,
          mustBeInRange([0, 24]),
        ],
      ),
      offset: new Validator(
        ({ offset }) => offset,
        [
          mustBeInteger,
          mustBeInRange([-1440, 1440]),
          mustBeDivisibleBy(5),
        ],
      ),
      cellDuration: new Validator(
        ({ cellDuration }) => cellDuration,
        [
          mustBeInteger,
          mustBeGreaterThan(0),
        ],
      ),
      startDayHourAndEndDayHour: new Validator(
        (options) => options,
        [endDayHourMustBeGreaterThanStartDayHour],
      ),
      cellDurationAndVisibleInterval: new Validator(
        (options) => options,
        [
          visibleIntervalMustBeDivisibleByCellDuration,
          cellDurationMustBeLessThanVisibleInterval,
        ],
      ),
    });
  }
}
