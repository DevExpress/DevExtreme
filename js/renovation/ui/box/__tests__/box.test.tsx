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

  describe('cssStyles', () => {
    it('display style', () => {
      const props = {} as BoxProps;
      const box = new Box(props);
      expect(box.cssStyles.display).toEqual('flex');
    });

    each(['row', 'column', undefined]).describe('direction: %o', (direction) => {
      it('flexDirection style', () => {
        const props = { direction } as BoxProps;
        const box = new Box(props);
        let expectedDirection;
        if (direction === 'row') {
          expectedDirection = 'row';
        } else if (direction === 'col') {
          expectedDirection = 'column';
        }

        expect(box.cssStyles.flexDirection).toEqual(expectedDirection);
      });
    });

    each(['center', 'end', 'space-around', 'space-between', 'start', undefined]).describe('align: %o', (align) => {
      it('justifyContent style', () => {
        const props = { align } as BoxProps;
        const box = new Box(props);

        let justifyContent = align;
        if (align === 'start') {
          justifyContent = 'flex-start';
        } else if (align === 'end') {
          justifyContent = 'flex-end';
        }

        expect(box.cssStyles.justifyContent).toEqual(justifyContent);
      });
    });

    each(['center', 'end', 'start', 'stretch', undefined]).describe('crossAlign: %o', (crossAlign) => {
      it('alignItems style', () => {
        const props = { crossAlign } as BoxProps;
        const box = new Box(props);

        let alignItems = crossAlign;
        if (crossAlign === 'start') {
          alignItems = 'flex-start';
        } else if (crossAlign === 'end') {
          alignItems = 'flex-end';
        }

        expect(box.cssStyles.alignItems).toEqual(alignItems);
      });
    });
  });
});
