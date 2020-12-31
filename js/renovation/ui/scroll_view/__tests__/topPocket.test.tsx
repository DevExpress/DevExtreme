import { mount } from 'enzyme';
import each from 'jest-each';
import devices from '../../../../core/devices';

import {
  TopPocket,
  viewFunction,
} from '../topPocket';

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

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

    each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
      it('Should assign simulated strategy', () => {
        devices.real = () => ({ platform });

        const topPocket = new TopPocket({ refreshStrategy: 'simulated' });
        expect((topPocket as any).refreshStrategy).toEqual('simulated');
      });

      it('Should assign swipeDown, pullDown strategy', () => {
        devices.real = () => ({ platform });

        const topPocket = new TopPocket({ });
        expect((topPocket as any).refreshStrategy).toEqual(platform === 'android' ? 'swipeDown' : 'pullDown');
      });
    });
  });
});
