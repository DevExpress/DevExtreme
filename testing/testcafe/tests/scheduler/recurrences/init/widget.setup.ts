import { extend } from '../../../../../../js/core/utils/extend';
import createWidget from '../../../../helpers/createWidget';

export default async (options = {}): Promise<void> => createWidget('dxScheduler', extend({
  currentDate: new Date(2020, 1, 9),
  views: ['week'],
  currentView: 'week',
  groupByDate: true,
  dataSource: [],
  width: 900,
}, options));
