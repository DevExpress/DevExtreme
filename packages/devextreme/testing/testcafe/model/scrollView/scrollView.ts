import type Scrollable from './internal/scrollable';
import type { PlatformType } from '../../helpers/multi-platform-test/platform-type';
import { ScrollableFactory } from './internal/scrollable';
import { WidgetName } from '../../helpers/createWidget';

const getScrollView = (
  platform: PlatformType,
// eslint-disable-next-line @typescript-eslint/no-extra-parens
) => class ScrollView extends (ScrollableFactory[platform] as typeof Scrollable) {
  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxScrollView'; }
};

export const ScrollViewFactory = {
  jquery: getScrollView('jquery'),
  angular: getScrollView('angular'),
  react: getScrollView('react'),
};

export default ScrollViewFactory.jquery;
