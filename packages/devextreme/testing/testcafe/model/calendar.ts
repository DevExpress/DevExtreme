import { WidgetName } from '../helpers/createWidget';
import Widget from './internal/widget';

export default class Calendar extends Widget {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxCalendar'; }
}
