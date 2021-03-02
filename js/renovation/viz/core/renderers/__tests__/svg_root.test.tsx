import React from 'react';
import { shallow } from 'enzyme';
import { RootSvgElement, RootSvgElementProps, viewFunction as RootSvgElementComponent } from '../svg_root';

describe('SvgPattern', () => {
  describe('View', () => {
    it('should render default html', () => {
      const vm = {
        props: {} as RootSvgElementProps,
      };
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as any);

      expect(root.html()).toBe('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
        + ' fill="none" stroke="none" stroke-width="0"'
        + ' direction="ltr"></svg>');
    });

    it('should pass all necessary properties', () => {
      const vm = {
        props: {
          className: 'dxc dxc-chart',
          width: 820,
          height: 440,
          children: <defs />,
        } as RootSvgElementProps,
      };
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as any);

      expect(root.html()).toBe('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
        + ' class="dxc dxc-chart" fill="none" stroke="none" stroke-width="0"'
        + ' width="820" height="440" direction="ltr"><defs></defs></svg>');
    });

    it('should pass rtlEnabled prop', () => {
      const vm = {
        props: {
          className: 'dxc dxc-chart',
          children: <defs />,
        } as RootSvgElementProps,
        config: { rtlEnabled: true },
      };
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as any);

      expect(root.prop('direction')).toBe('rtl');
    });
  });

  describe('Behavior', () => {
    describe('setRootElementRef', () => {
      it('should set rootElementRef to div ref', () => {
        const widgetRef = { current: {} } as any;
        const component = new RootSvgElement({
          rootElementRef: {},
        } as RootSvgElementProps);
        component.svgRef = widgetRef;
        component.setRootElementRef();

        expect(component.props.rootElementRef?.current).toBe(component.svgRef.current);
      });

      it('should not set rootElementRef to div ref when not initialized', () => {
        const component = new RootSvgElement({ });
        component.svgRef = { current: {} } as any;
        component.setRootElementRef();
        expect(component.props.rootElementRef).toBeUndefined();
      });
    });
  });

  describe('Getters', () => {
    it('should return merged styles', () => {
      const props = {
        className: 'dxc dxc-chart',
        width: 820,
        height: 440,
        styles: { myProp: true },
      } as RootSvgElementProps;
      const root = new RootSvgElement(props);
      expect(root.styles).toStrictEqual({
        display: 'block',
        lineHeight: 'normal',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        myProp: true,
        overflow: 'hidden',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        WebkitUserSelect: 'none',
      });
    });
  });
});
