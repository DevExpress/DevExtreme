import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import { BottomPocket, BottomPocketProps } from '../bottom';

import { current } from '../../../../../../ui/themes';

jest.mock('../../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('Bottom pocket', () => {
  describe('View', () => {
    it('render bottomPocket with defaults', () => {
      const props = new BottomPocketProps();
      const bottomPocket = mount<BottomPocket>(<BottomPocket {...props} />);

      expect(bottomPocket.props()).toEqual({
        reachBottomText: 'Loading...',
        visible: true,
      });
    });
  });

  describe('Default options', () => {
    each(['generic', 'material']).describe('currentTheme: %o', (currentTheme) => {
      const getDefaultOptions = (): BottomPocketProps => new BottomPocketProps();

      it(`theme: ${currentTheme}, check default values for text options`, () => {
        (current as jest.Mock).mockImplementation(() => currentTheme);

        const isMaterial = currentTheme === 'material';

        if (isMaterial) {
          expect(getDefaultOptions().reachBottomText).toBe('');
        } else {
          expect(getDefaultOptions().reachBottomText).toBe('Loading...');
        }
      });
    });
  });
});
