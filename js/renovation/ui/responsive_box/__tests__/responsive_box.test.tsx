import { mount } from 'enzyme';
import React from 'react';
import { ResponsiveBoxProps } from '../responsive_box_props';
import { ResponsiveBox } from '../responsive_box';
import { Box } from '../../box/box';

it('ResponsiveBox > InitialProps', () => {
  const props = new ResponsiveBoxProps();
  const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);

  expect(responsiveBox.props()).toEqual({});
});

describe('LayoutManager > Markup', () => {
  it('Box is rendered', () => {
    const props = new ResponsiveBoxProps();
    const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);

    const box = responsiveBox.find(Box);
    expect(box.exists()).toBe(true);
  });
});

describe('ResponsiveBox > Attrs', () => {
  describe('cssClasses', () => {
    it('Check has dx-responsivebox class', () => {
      const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox />);
      expect(responsiveBox.getDOMNode().classList.contains('dx-responsivebox')).toEqual(true);
    });
  });
});
