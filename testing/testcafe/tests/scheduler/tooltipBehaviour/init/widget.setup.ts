import { ClientFunction } from 'testcafe';
import { extend } from '../../../../../../js/core/utils/extend';
import createWidget from '../../../../helpers/createWidget';

export const createScheduler = async (options = {}): Promise<void> => createWidget('dxScheduler', extend({
  views: ['day'],
  dataSource: [],
  width: 600,
  height: 600,
  startDayHour: 9,
  firstDayOfWeek: 1,
  maxAppointmentsPerCell: 5,
  currentView: 'day',
  currentDate: new Date(2019, 3, 1),
}, options));

export const scroll = async (horizontal: number, vertical: number): Promise<void> => ClientFunction(
  () => { window.scroll(horizontal, vertical); },
  { dependencies: { horizontal, vertical } },
)();
