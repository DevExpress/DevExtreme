/* eslint-disable max-len */
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scrollable, { ScrollableFactory } from '../../../../model/scrollView/internal/scrollable';
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

[false, true].forEach((useNative) => {
  [false, true].forEach((rtlEnabled) => {
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
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Renovated scrollable - render strategies');

config.forEach((props) => {
  // it repeats test scenario from common file. Used for demonstration purposes
  test(
    `Should render scrollable, ${JSON.stringify(props)}`,
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
    },
  )
    .before(async (_, { platform }) => updateComponentOptions(platform, {
      ...defaultProps,
      ...props,
    }));
});

fixture.disablePageReloads.skip('Renovated scrollable - visibility integration');

config.forEach((props) => {
  test(
    `Scroll should save position on visibility change, ${JSON.stringify(props)}`,
    async (t, { platform, screenshotComparerOptions }) => {
      const scrollable = new ScrollableFactory[platform](SCROLLABLE_SELECTOR, props);
      const { direction, useNative, rtlEnabled } = props;

      await scrollable.scrollTo({ top: 20, left: 10 });
      const expectedScrollOffsetValue = {
        // eslint-disable-next-line no-nested-ternary
        left: direction !== DIRECTION_VERTICAL ? 10 : rtlEnabled
        // eslint-disable-next-line no-nested-ternary
          ? direction as ScrollableDirection === DIRECTION_HORIZONTAL ? 200 : useNative
            ? direction === DIRECTION_VERTICAL ? 215 : 217
            : 208
          : 0,
        top: direction !== DIRECTION_HORIZONTAL ? 20 : 0,
      };
      await t.expect(await scrollable.scrollOffset()).eql(expectedScrollOffsetValue);

      await t
        .expect(await compareScreenshot(
          t,
          `Scroll position before hide_dir=${direction}_useNative=${useNative}_rtl=${rtlEnabled}.png`,
          scrollable.element,
          screenshotComparerOptions,
        ))
        .ok();

      await scrollable.hide();
      await scrollable.scrollTo({ left: 0, top: 0 });
      await scrollable.show();

      await t.expect(await scrollable.scrollOffset()).eql(expectedScrollOffsetValue);
      await t
        .expect(await compareScreenshot(
          t,
          `Scroll position after show_dir=${direction}_useNative=${useNative}_rtl=${rtlEnabled}.png`,
          scrollable.element,
          screenshotComparerOptions,
        ))
        .ok();
    },
  )
    .before(async (_, { platform }) => updateComponentOptions(platform, {
      ...defaultProps,
      ...props,
    }));
});
