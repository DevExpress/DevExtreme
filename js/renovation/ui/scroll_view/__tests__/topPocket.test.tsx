import { mount } from 'enzyme';
import each from 'jest-each';

import {
  TopPocket,
  viewFunction,
} from '../topPocket';

describe('TopPocket', () => {
  describe('Structure', () => {
    each(['pullDown', 'swipeDown', 'simulated', undefined]).describe('RefreshStrategy: %o', (strategy) => {
      it('PullDown text elements', () => {
        const topPocket = mount(viewFunction(new TopPocket({
          refreshStrategy: strategy,
        })) as JSX.Element);
        const textElement = topPocket.find('.dx-scrollview-pull-down-text');
        expect(topPocket.exists()).toBe(true);

        const expectedCountOfChild = strategy === 'swipeDown' ? 0 : 3;

        const textElementChildren = textElement.find('.dx-scrollview-pull-down-text > div');
        expect(textElementChildren.length).toBe(expectedCountOfChild);
      });
    });
  });
});
