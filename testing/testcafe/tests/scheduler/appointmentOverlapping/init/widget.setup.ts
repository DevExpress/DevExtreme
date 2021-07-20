import { extend } from '../../../../../../js/core/utils/extend';
import createWidget from '../../../../helpers/createWidget';

export default async (options = {}): Promise<void> => createWidget('dxScheduler', extend({
  dataSource: [],
  views: ['week'],
  width: 940,
  currentView: 'week',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 900,
}, options));
