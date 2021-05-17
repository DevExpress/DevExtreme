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

  const getBoxStyles = (direction, align, crossAlign) => {
    const DIRECTION_MAP = { row: 'row', col: 'column' };
    const tryGetFromMap = (prop, map): string => ((prop in map) ? map[prop] : prop);
    return {
      display: 'flex',
      flexDirection: DIRECTION_MAP[direction],
      justifyContent: tryGetFromMap(align, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        'space-between': 'space-between',
        'space-around': 'space-around',
      }),
      alignItems: tryGetFromMap(crossAlign, {
        start: 'flex-start',
        end: 'flex-end',
        center: 'center',
        stretch: 'stretch',
      }),
    };
  };
  each(['row', 'column', undefined]).describe('direction: %o', (direction) => {
    each(['center', 'end', 'space-around', 'space-between', 'start', undefined]).describe('align: %o', (align) => {
      each(['center', 'end', 'start', 'stretch', undefined]).describe('crossAlign: %o', (crossAlign) => {
        it('cssStyle', () => {
          const props = { direction, align, crossAlign } as BoxProps;
          const box = new Box(props);
          expect(box.cssStyles).toEqual(getBoxStyles(direction, align, crossAlign));
        });
      });
    });
  });
});
