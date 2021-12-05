import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scrollable from '../../../../model/scrollView/internal/scrollable';
import ScrollView from '../../../../model/scrollView/scrollView';
import { ScrollableProps } from '../../../../../../js/renovation/ui/scroll_view/common/scrollable_props';
import { multiPlatformTest, updateComponentOptions } from '../../../../helpers/multi-platform-test';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH } from '../../../../../../js/renovation/ui/scroll_view/common/consts';
import { ScrollableDirection } from '../../../../../../js/renovation/ui/scroll_view/common/types';

const COMPONENT_SELECTOR = '#container';

const defaultProps: Partial<ScrollableProps> = {
  width: 300,
  height: 300,
  useNative: false,
  direction: 'vertical',
  showScrollbar: 'always',
};

const config: Partial<ScrollableProps>[] = [];

[true, false].forEach((useNative) => {
  [true, false].forEach((rtlEnabled) => {
    ([
      DIRECTION_VERTICAL,
      DIRECTION_HORIZONTAL,
      DIRECTION_BOTH,
    ] as ScrollableDirection[]).forEach((direction) => {
      config.push({ useNative, rtlEnabled, direction });
    });
  });
});

[{
  page: 'scrollable',
  Component: Scrollable,
}, {
  page: 'scrollView',
  Component: ScrollView,
}].forEach(({ page, Component }) => {
  const test = multiPlatformTest({
    page: `declaration/${page}`,
    platforms: ['jquery', 'react', 'angular'],
  });

  fixture('Render strategies');

  config.forEach((props) => {
    test(`Should render ${page}, ${JSON.stringify(props)}`,
      async (t, { screenshotComparerOptions }) => {
        const component = new Component(COMPONENT_SELECTOR, props);
        const { direction, useNative, rtlEnabled } = props;

        await t
          .expect(await compareScreenshot(
            t,
            `render_dir=${direction}_useNative=${useNative}_rtl=${rtlEnabled}.png`,
            component.element,
            screenshotComparerOptions,
          ))
          .ok();
      })
      .before(async (_, { platform }) => updateComponentOptions(platform, {
        ...defaultProps,
        ...props,
      }));

    test(`${page}.scrollTo({ top: 50, left: 50 }), ${JSON.stringify(props)}`,
      async (t, { screenshotComparerOptions }) => {
        const component = new Component(COMPONENT_SELECTOR, props);
        const { direction, useNative, rtlEnabled } = props;

        await component.apiScrollTo({ top: 50, left: 50 });

        await t
          .expect(await compareScreenshot(
            t,
            `scrollTo(50)_dir=${direction}_useNative=${useNative}_rtl=${rtlEnabled}.png`,
            component.element,
            screenshotComparerOptions,
          ))
          .ok();
      })
      .before(async (_, { platform }) => updateComponentOptions(platform, {
        ...defaultProps,
        ...props,
      }));
  });
});
