import { mount } from 'enzyme';
import each from 'jest-each';

import {
  viewFunction,
} from '../topPocket';

describe('TopPocket', () => {
  describe('cssClasses', () => {
    each(['pullDown', 'swipeDown', 'simulated', undefined]).describe('RefreshStrategy: %o', (strategy) => {
      it('PullDown text elements', () => {
        const topPocket = mount(viewFunction({
          props: { refreshStrategy: strategy },
        } as any) as JSX.Element);
        const textElement = topPocket.find('.dx-scrollview-pull-down-text');
        expect(topPocket.exists()).toBe(true);

        const expectedCountOfChild = strategy === 'swipeDown' ? 0 : 3;

        const textElementChildren = textElement.find('.dx-scrollview-pull-down-text > div');
        expect(textElementChildren.length).toBe(expectedCountOfChild);
      });
    });
  });
});
