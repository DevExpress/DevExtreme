import errors from '@js/ui/widget/ui.errors';
import Gantt from 'devexpress-gantt';

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export function getGanttViewCore() {
  if (!Gantt) {
    throw errors.Error('E1041', 'devexpress-gantt');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Gantt;
}
