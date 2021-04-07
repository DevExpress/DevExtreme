import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';

import {
  TopPocket,
  viewFunction,
  TopPocketProps,
} from '../top_pocket';

import {
  TopPocketState,
} from '../common/consts';

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

describe('TopPocket', () => {
  describe('View', () => {
    it('render topPocket with defaults', () => {
      const props = new TopPocketProps();
      const topPocket = mount<TopPocket>(<TopPocket {...props} />);

      expect(topPocket.props()).toEqual({
        isFakeRefreshState: false,
        pocketState: 0,
        pullDownIconAngle: 0,
        pullDownOpacity: 0,
        pullDownTopOffset: 0,
      });
    });
  });

  describe('Structure', () => {
    each(['pullDown', 'swipeDown', 'simulated']).describe('RefreshStrategy: %o', (refreshStrategy) => {
      it('PullDown text elements', () => {
        const topPocket = mount(viewFunction(new TopPocket({
          refreshStrategy,
        })) as JSX.Element);
        const textElement = topPocket.find('.dx-scrollview-pull-down-text');
        expect(topPocket.exists()).toBe(true);

        const expectedCountOfChild = refreshStrategy === 'swipeDown' ? 0 : 3;

        const textElementChildren = textElement.find('.dx-scrollview-pull-down-text > div');
        expect(textElementChildren.length).toBe(expectedCountOfChild);
      });

      it('render pulldown icon element', () => {
        const topPocket = mount(viewFunction(new TopPocket({
          refreshStrategy,
        })) as JSX.Element);

        const iconElement = topPocket.find('.dx-icon-pulldown');

        expect(iconElement.exists()).toBe(refreshStrategy === 'swipeDown');
      });
    });
  });

  describe('Behavior', () => {
    each([
      { state: TopPocketState.STATE_RELEASED, expectedText: 'pullingText' },
      { state: TopPocketState.STATE_READY, expectedText: 'pulledText' },
      { state: TopPocketState.STATE_LOADING, expectedText: 'refreshingText' },
    ]).describe('State: %o', (testConfig) => {
      it('Correct text is visible depending of state', () => {
        const viewModel = new TopPocket({
          refreshStrategy: 'simulated',
          pullingDownText: 'pullingText',
          pulledDownText: 'pulledText',
          refreshingText: 'refreshingText',
          pocketState: testConfig.state,
        });

        const topPocket = mount(viewFunction(viewModel) as JSX.Element);
        const textElement = topPocket.find('.dx-scrollview-pull-down-text-visible');
        expect(textElement.length).toBe(1);
        expect(textElement.text()).toBe(testConfig.expectedText);
      });
    });
  });
});
