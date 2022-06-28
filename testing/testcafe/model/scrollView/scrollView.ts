import Scrollable from './internal/scrollable';
import { WidgetName } from '../../helpers/createWidget';

export default class ScrollView extends Scrollable {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxScrollView'; }
}
