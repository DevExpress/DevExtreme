import React from 'react';
import { shallow } from 'enzyme';
import { RootSvgElementProps, viewFunction as RootSvgElementComponent } from '../svg_root';

describe('SvgPattern', () => {
  it('View', () => {
    const vm = {
      props: {
        className: 'dxc dxc-chart',
        width: 820,
        height: 440,
        direction: 'ltr',
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
});
