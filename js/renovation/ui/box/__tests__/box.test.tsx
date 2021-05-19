import { mount } from 'enzyme';
import React from 'react';
import each from 'jest-each';
import { BoxProps } from '../box_props';
import { Box, viewFunction } from '../box';
import { Widget } from '../../common/widget';

it('ResponsiveBox > InitialProps', () => {
  const props = new BoxProps();
  const box = mount<Box>(<Box {...props} />);

  expect(box.props()).toEqual({
    align: 'start',
    crossAlign: 'stretch',
    direction: 'row',
  });
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

  each([1, 'text', true, undefined, null]).describe('cssStyles: %o', (style) => {
    it('Should pass styles to container from cssStyles', () => {
      const box = mount<Box>(viewFunction({ cssStyles: style } as any));
      const rootContainer = box.find(Widget);

      expect(rootContainer.props().style).toEqual(style);
    });
  });

  describe('Check result of props values', () => {
    it('display style', () => {
      const props = {} as BoxProps;
      const box = new Box(props);
      expect(box.cssStyles.display).toEqual('flex');
    });

    it('direction', () => {
      let props = { direction: 'row' } as any;
      expect(new Box(props).cssStyles.flexDirection).toEqual('row');

      props = { direction: 'col' };
      expect(new Box(props).cssStyles.flexDirection).toEqual('column');

      props = { direction: null };
      expect(new Box(props).cssStyles.flexDirection).toEqual(undefined);

      props = { direction: undefined };
      expect(new Box(props).cssStyles.flexDirection).toEqual(undefined);
    });

    it('align', () => {
      let props = { align: 'center' } as any;
      expect(new Box(props).cssStyles.justifyContent).toEqual('center');

      props = { align: 'end' };
      expect(new Box(props).cssStyles.justifyContent).toEqual('flex-end');

      props.align = 'space-around';
      props = { align: 'space-around' };
      expect(new Box(props).cssStyles.justifyContent).toEqual('space-around');

      props = { align: 'space-between' };
      expect(new Box(props).cssStyles.justifyContent).toEqual('space-between');

      props = { align: 'start' };
      expect(new Box(props).cssStyles.justifyContent).toEqual('flex-start');

      props = { align: null };
      expect(new Box(props).cssStyles.justifyContent).toEqual(null);

      props = { align: undefined };
      expect(new Box(props).cssStyles.justifyContent).toEqual(undefined);
    });

    it('crossAlign', () => {
      let props = { crossAlign: 'center' } as any;
      expect(new Box(props).cssStyles.alignItems).toEqual('center');

      props = { crossAlign: 'end' };
      expect(new Box(props).cssStyles.alignItems).toEqual('flex-end');

      props = { crossAlign: 'start' };
      expect(new Box(props).cssStyles.alignItems).toEqual('flex-start');

      props = { crossAlign: 'stretch' };
      expect(new Box(props).cssStyles.alignItems).toEqual('stretch');

      props = { crossAlign: undefined };
      expect(new Box(props).cssStyles.alignItems).toEqual(undefined);

      props = { crossAlign: null };
      expect(new Box(props).cssStyles.alignItems).toEqual(null);
    });
  });
});
