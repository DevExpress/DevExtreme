import { extend } from '../../../../../../js/core/utils/extend';
import { createWidget } from '../../../../helpers/testHelper';

export default (options = {}) => createWidget('dxScheduler', extend({
  currentDate: new Date(2020, 1, 9),
  views: ['week'],
  currentView: 'week',
  groupByDate: true,
  dataSource: [],
  width: 900,
}, options));
