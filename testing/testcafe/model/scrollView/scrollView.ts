import { PlatformType } from '../../helpers/multi-platform-test/platform-type';
import Scrollable from './internal/scrollable';

const getScrollView = (platform: PlatformType) => class ScrollView extends Scrollable {
  name = 'dxScrollView';

  platform = platform;
};

export const ScrollViewFactory = {
  jquery: getScrollView('jquery'),
  angular: getScrollView('angular'),
  react: getScrollView('react'),
};

export default ScrollViewFactory.jquery;
