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
        pocketState: 0,
        pocketTop: 0,
        pullDownIconAngle: 0,
        pullDownOpacity: 0,
        pullDownTop: 0,
        pullDownTranslateTop: 0,
        topPocketTranslateTop: 0,
      });
    });
  });

  describe('Structure', () => {
    each(['pullDown', 'swipeDown', 'simulated']).describe('RefreshStrategy: %o', (refreshStrategy) => {
      it('PullDown text elements', () => {
        const topPocket = mount(viewFunction(new TopPocket({
          refreshStrategy,
        })));
        const textElement = topPocket.find('.dx-scrollview-pull-down-text');
        expect(topPocket.exists()).toBe(true);

        const expectedCountOfChild = refreshStrategy === 'swipeDown' ? 0 : 3;

        const textElementChildren = textElement.find('.dx-scrollview-pull-down-text > div');
        expect(textElementChildren.length).toBe(expectedCountOfChild);
      });

      it('render pulldown icon element', () => {
        const topPocket = mount(viewFunction(new TopPocket({
          refreshStrategy,
        })));

        const iconElement = topPocket.find('.dx-icon-pulldown');

        expect(iconElement.exists()).toBe(refreshStrategy === 'swipeDown');
      });

      each([
        { pocketState: TopPocketState.STATE_RELEASED, expectedText: 'pullingText' },
        { pocketState: TopPocketState.STATE_READY, expectedText: 'pulledText' },
        { pocketState: TopPocketState.STATE_REFRESHING, expectedText: 'refreshingText' },
        { pocketState: TopPocketState.STATE_LOADING },
        { pocketState: TopPocketState.STATE_PULLED },
        { pocketState: TopPocketState.STATE_TOUCHED },
      ]).describe('PocketState: %o', (config) => {
        it('Text visibility for corresponding pocketState', () => {
          const { pocketState, expectedText } = config;

          const viewModel = new TopPocket({
            refreshStrategy,
            pullingDownText: 'pullingText',
            pulledDownText: 'pulledText',
            refreshingText: 'refreshingText',
            pocketState,
          });

          const topPocket = mount(viewFunction(viewModel));
          const textElement = topPocket.find('.dx-scrollview-pull-down-text-visible');

          if (expectedText && refreshStrategy !== 'swipeDown') {
            expect(textElement.length).toBe(1);
            expect(textElement.text()).toBe(expectedText);
          } else {
            expect(textElement.length).toBe(0);
          }
        });
      });
    });
  });
});
