import { extend } from '../../../../../../../js/core/utils/extend';
import { createWidget } from '../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../helpers/multi-platform-test/platform-type';

const createScheduler = async (
  platform: PlatformType,
  options = {},
): Promise<void> => createWidget(
  platform,
  'dxScheduler',
  extend({
    dataSource: [],
    views: ['week'],
    width: 940,
    currentView: 'week',
    currentDate: new Date(2017, 4, 25),
    startDayHour: 9,
    height: 900,
  }, options),
);

export default createScheduler;
