import React from 'react';
import { mount } from 'enzyme';
import { RtlEnabledProvider, viewFunction } from '../rtl_enabled_provider';

describe('RtlEnabledProvider', () => {
  it('Render', () => {
    const tree = mount(
      viewFunction({
        props:
        { children: <div className="child" />, rtlEnabled: true },
      } as Partial<RtlEnabledProvider> as any),
    );
    expect(tree.find('.child').exists()).toBe(true);
  });

  it('props.rtlEnabled should setup provider value through component.rtlEnabled', () => {
    const component = new RtlEnabledProvider({ rtlEnabled: false, children: {} as JSX.Element });
    expect(component.rtlEnabled).toBe(false);
  });
});
