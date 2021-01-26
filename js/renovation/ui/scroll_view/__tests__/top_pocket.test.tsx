import { mount } from 'enzyme';
import each from 'jest-each';
import devices from '../../../../core/devices';

import {
  TopPocket,
  viewFunction,
} from '../top_pocket';

import {
  TopPocketState,
} from '../top_pocket_props';

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

  describe('Behavior', () => {
    each([
      { state: undefined, expectedText: 'pullingDownText' },
      { state: TopPocketState.STATE_RELEASED, expectedText: 'pullingDownText' },
      { state: TopPocketState.STATE_READY, expectedText: 'pulledDownText' },
      { state: TopPocketState.STATE_REFRESHING, expectedText: 'refreshingText' },
    ]).describe('State: %o', (testConfig) => {
      it('Correct text is visible depending of state', () => {
        const viewModel = new TopPocket({
          refreshStrategy: 'simulated',
          pullingDownText: 'pullingDownText',
          pulledDownText: 'pulledDownText',
          refreshingText: 'refreshingText',
        });
        if (testConfig.state) {
          viewModel.pocketState = testConfig.state;
        }
        const topPocket = mount(viewFunction(viewModel) as JSX.Element);
        const textElement = topPocket.find('.dx-scrollview-pull-down-text-visible');
        expect(textElement.length).toBe(1);
        expect(textElement.text()).toBe(testConfig.expectedText);
      });
    });
  });
});
