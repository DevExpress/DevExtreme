import Scrollable from './internal/scrollable';
import type { WidgetName } from '../../helpers/widgetTypings';

export default class ScrollView extends Scrollable {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxScrollView'; }
}
