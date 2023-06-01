import React from 'react';
import { mount } from 'enzyme';
import { ConfigProvider, viewFunction } from '../config_provider';

describe('ConfigProvider', () => {
  it('render', () => {
    const tree = mount(
      viewFunction({
        props:
        { children: <div className="child" />, rtlEnabled: true },
      } as Partial<ConfigProvider> as any),
    );
    expect(tree.find('.child').exists()).toBe(true);
  });

  it('setup config provider value', () => {
    const component = new ConfigProvider({ rtlEnabled: false, children: {} as JSX.Element });
    expect(component.config).toEqual({ rtlEnabled: false });
  });
});
