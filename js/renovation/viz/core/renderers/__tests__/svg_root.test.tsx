import React from 'react';
import { shallow } from 'enzyme';
import { RootSvgElement, RootSvgElementProps, viewFunction as RootSvgElementComponent } from '../svg_root';

describe('SvgPattern', () => {
  describe('View', () => {
    it('default', () => {
      const vm = {
        props: {} as RootSvgElementProps,
      };
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as JSX.Element);

      expect(root.html()).toBe('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
        + ' fill="none" stroke="none" stroke-width="0"'
        + ' style="display:block;overflow:hidden;line-height:normal;'
        + '-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)"'
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
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as JSX.Element);

      expect(root.html()).toBe('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
        + ' class="dxc dxc-chart" fill="none" stroke="none" stroke-width="0"'
        + ' style="display:block;overflow:hidden;line-height:normal;'
        + '-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)"'
        + ' width="820" height="440" direction="ltr"><defs></defs></svg>');
    });

    it('rtlEnabled', () => {
      const vm = {
        props: {
          className: 'dxc dxc-chart',
          children: <defs />,
        } as RootSvgElementProps,
        config: { rtlEnabled: true },
      };
      const root = shallow(<RootSvgElementComponent {...vm as any} /> as JSX.Element);

      expect(root.prop('direction')).toBe('rtl');
    });
  });

  describe('Behavior', () => {
    describe('setRootElementRef', () => {
      it('set rootElementRef to div ref', () => {
        const widgetRef = {} as SVGElement;
        const component = new RootSvgElement({
          rootElementRef: {},
        } as RootSvgElementProps);
        component.svgRef = widgetRef;
        component.setRootElementRef();

        expect(component.props.rootElementRef).toBe(component.svgRef);
      });

      it('hasnt rootElementRef', () => {
        const component = new RootSvgElement({ });
        component.svgRef = {} as SVGElement;
        component.setRootElementRef();
        expect(component.props.rootElementRef).toBeUndefined();
      });
    });
  });
});
