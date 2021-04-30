import { mount } from 'enzyme';
import React from 'react';
import { BoxProps } from '../box_props';
import { Box } from '../box';

it('ResponsiveBox > InitialProps', () => {
  const props = new BoxProps();
  const box = mount<Box>(<Box {...props} />);

  expect(box.props()).toEqual({});
});
