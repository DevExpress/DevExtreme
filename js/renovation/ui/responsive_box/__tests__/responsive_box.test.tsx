import { mount } from 'enzyme';
import React from 'react';
import { ResponsiveBoxProps } from '../responsive_box_props';
import { ResponsiveBox } from '../responsive_box';

it('ResponsiveBox > InitialProps', () => {
  const props = new ResponsiveBoxProps();
  const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);

  expect(responsiveBox.props()).toEqual({});
});

describe('ResponsiveBox > Attrs', () => {
  describe('cssClasses', () => {
    it('Check has dx-responsivebox class', () => {
      const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox />);
      expect(responsiveBox.getDOMNode().classList.contains('dx-responsivebox')).toEqual(true);
    });
  });
});
