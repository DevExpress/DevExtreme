import { mount } from 'enzyme';
import each from 'jest-each';

import React from 'react';
import { ResponsiveBoxProps } from '../responsive_box_props';
import { ResponsiveBox } from '../responsive_box';

import domAdapter from '../../../../core/dom_adapter';

it('ResponsiveBox > InitialProps', () => {
  const props = new ResponsiveBoxProps();
  const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);

  expect(responsiveBox.props()).toEqual({
    screenByWidth: undefined,
  });
});

describe('ResponsiveBox > Attrs', () => {
  describe('cssClasses', () => {
    each([
      { clientWidth: 1500, expectedClass: 'dx-responsivebox-screen-lg' },
      { clientWidth: 1000, expectedClass: 'dx-responsivebox-screen-md' },
      { clientWidth: 900, expectedClass: 'dx-responsivebox-screen-sm' },
      { clientWidth: 700, expectedClass: 'dx-responsivebox-screen-xs' },
    ]).describe('Config: %o', ({ clientWidth, expectedClass }) => {
      it('Check has valid screen size. default implementation', () => {
        const defaultImplementation = domAdapter.getDocumentElement;
        domAdapter.getDocumentElement = () => ({ clientWidth });

        const props = new ResponsiveBoxProps();
        const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);
        const { classList } = responsiveBox.getDOMNode();

        expect(classList.contains('dx-responsivebox')).toEqual(true);
        expect(classList.contains(expectedClass)).toEqual(true);

        domAdapter.getDocumentElement = defaultImplementation;
      });
    });

    each([
      { customScreenByWidth: () => 'lg', expectedClass: 'dx-responsivebox-screen-lg' },
      { customScreenByWidth: () => 'md', expectedClass: 'dx-responsivebox-screen-md' },
      { customScreenByWidth: () => 'sm', expectedClass: 'dx-responsivebox-screen-sm' },
      { customScreenByWidth: () => 'xs', expectedClass: 'dx-responsivebox-screen-xs' },
    ]).describe('Config: %o', ({ customScreenByWidth, expectedClass }) => {
      it('Check has valid screen size. custom implementation', () => {
        const props = { screenByWidth: customScreenByWidth } as ResponsiveBoxProps;
        const responsiveBox = mount<ResponsiveBox>(<ResponsiveBox {...props} />);
        const { classList } = responsiveBox.getDOMNode();

        expect(classList.contains('dx-responsivebox')).toEqual(true);
        expect(classList.contains(expectedClass)).toEqual(true);
      });
    });
  });
});
