import { extend } from '../../../../../../js/core/utils/extend';
import createWidget from '../../../../helpers/createWidget';

export default async (options = {}): Promise<void> => createWidget('dxScheduler', extend({
  views: ['month'],
  dataSource: [],
  width: 1402,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'month',
  currentDate: new Date(2019, 3, 1),
}, options), true);
