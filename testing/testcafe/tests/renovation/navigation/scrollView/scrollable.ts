import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scrollable from '../../../../model/scrollView/internal/scrollable';
import type { ScrollableProps } from '../../../../../../js/renovation/ui/scroll_view/common/scrollable_props';
import { multiPlatformTest, updateComponentOptions } from '../../../../helpers/multi-platform-test';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH } from '../../../../../../js/renovation/ui/scroll_view/common/consts';
import { ScrollableDirection } from '../../../../../../js/renovation/ui/scroll_view/common/types';

const SCROLLABLE_SELECTOR = '#container';

const defaultProps: Partial<ScrollableProps> = {
  width: 300,
  height: 300,
  useNative: false,
  rtlEnabled: false,
  direction: 'vertical',
  showScrollbar: 'always',
};

const config: Partial<ScrollableProps>[] = [];

[true, false].forEach((useNative) => {
  [false].forEach((rtlEnabled) => {
    // TODO: support true value
    // it works incorrectly in angular and react
    ([
      DIRECTION_VERTICAL,
      DIRECTION_HORIZONTAL,
      DIRECTION_BOTH,
    ] as ScrollableDirection[]).forEach((direction) => {
      config.push({ useNative, rtlEnabled, direction });
    });
  });
});

const test = multiPlatformTest({
  page: 'declaration/scrollable',
  platforms: ['jquery', 'react', 'angular'],
});

fixture('Renovated scrollable - render strategies');

config.forEach((props) => {
  // it repeats test scenario from common file. Used for demonstration purposes
  test(`Should render scrollable, ${JSON.stringify(props)}`,
    async (t, { screenshotComparerOptions }) => {
      const scrollable = new Scrollable(SCROLLABLE_SELECTOR, props);
      const { direction, useNative, rtlEnabled } = props;

      await t
        .expect(await compareScreenshot(
          t,
          `render_dir=${direction}_useNative=${useNative}_rtl=${rtlEnabled}.png`,
          scrollable.element,
          screenshotComparerOptions,
        ))
        .ok();
    })
    .before(async (_, { platform }) => updateComponentOptions(platform, {
      ...defaultProps,
      ...props,
    }));
});
