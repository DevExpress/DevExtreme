import React from 'react';
import { shallow } from 'enzyme';
import { RootSvgElementProps, viewFunction as RootSvgElementComponent } from '../svg_root';

describe('SvgPattern', () => {
  it('View', () => {
    const restAttributes = { className: 'dxc dxc-chart', direction: 'ltr' };
    const vm = {
      props: {
        width: 820,
        height: 440,
        children: <defs />,
      } as RootSvgElementProps,
      restAttributes,
    };
    const root = shallow(<RootSvgElementComponent {...vm as any} /> as JSX.Element);

    expect(root.html()).toBe('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
      + ' fill="none" stroke="none" stroke-width="0"'
      + ' style="display:block;overflow:hidden;line-height:normal;'
      + '-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0, 0, 0, 0)"'
      + ' width="820" height="440" class="dxc dxc-chart" direction="ltr"><defs></defs></svg>');
  });
});
