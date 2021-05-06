import { mount } from 'enzyme';
import React from 'react';
import { BoxProps } from '../box_props';
import { Box } from '../box';

it('ResponsiveBox > InitialProps', () => {
  const props = new BoxProps();
  const box = mount<Box>(<Box {...props} />);

  expect(box.props()).toEqual({});
});

describe('Box > Attrs', () => {
  describe('cssClasses', () => {
    it('Check has dx-box class', () => {
      const responsiveBox = mount<Box>(<Box />);
      const { classList } = responsiveBox.getDOMNode();

      expect(classList.contains('dx-box')).toEqual(true);
      expect(classList.contains('dx-box-flex')).toEqual(true);
    });
  });
});
