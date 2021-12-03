import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scrollable from '../../../../model/scrollView/internal/scrollable';
import { ScrollableProps } from '../../../../../../js/renovation/ui/scroll_view/common/scrollable_props';
import { multiPlatformTest, updateComponentOptions } from '../../../../helpers/multi-platform-test';
import { DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH } from '../../../../../../js/renovation/ui/scroll_view/common/consts';
import { ScrollableDirection } from '../../../../../../js/renovation/ui/scroll_view/common/types';

const SCROLLABLE_SELECTOR = '#container';

const defaultProps: Partial<ScrollableProps> = {
  width: 300,
  height: 300,
  useNative: false,
  direction: 'vertical',
  showScrollbar: 'always',
};

const test = multiPlatformTest({
  page: 'declaration/scrollable',
  platforms: ['jquery', 'react', 'angular'],
});

fixture('Renovated scrollable - render strategies');

const config: Partial<ScrollableProps>[] = [];

[true, false].forEach((useNative) => {
  ([
    DIRECTION_VERTICAL,
    DIRECTION_HORIZONTAL,
    DIRECTION_BOTH,
  ] as ScrollableDirection[]).forEach((direction) => {
    config.push({ useNative, direction });
  });
});

config.forEach((props) => {
  test(`Should render scrollable, ${JSON.stringify(props)}`,
    async (t, { screenshotComparerOptions }) => {
      const scrollable = new Scrollable(SCROLLABLE_SELECTOR, props);

      await t
        .expect(await compareScreenshot(
          t,
          `scrollable_render_dir=${props.direction}_useNative=${props.useNative}.png`,
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
