import { extend } from '../../../../../../js/core/utils/extend';
import createWidget from '../../../../helpers/createWidget';

const resources = [
  { id: 0, color: '#e01e38' },
  { id: 1, color: '#f98322' },
  { id: 2, color: '#1e65e8' },
];

export default async (options = {}): Promise<void> => createWidget('dxScheduler', extend({
  views: ['day'],
  dataSource: [],
  resources: [
    {
      fieldExpr: 'resourceId',
      dataSource: resources,
      label: 'Color',
    },
  ],
  width: 1666,
  height: 833,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
}, options));
