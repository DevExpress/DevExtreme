import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';

describe('Render', () => {
  it('should render rect and text', () => {
    const props = {
      size: {
        width: 40, height: 30, x: 1, y: 2,
      },
      textRef: {},
      props: {},
    } as Partial<Tooltip>;
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('rect').props()).toMatchObject({
      x: 0,
      y: 0,
      width: 40,
      height: 30,
      strokeWidth: undefined,
      stroke: undefined,
      fill: undefined,
    });

    expect(tooltip.find('text').props()).toMatchObject({
      x: 0,
      y: 0,
      children: undefined,
    });

    expect(tooltip.find('g').at(1).props()).toMatchObject({
      textAnchor: 'middle',
      transform: 'translate(20, -2)',
      ref: {},
    });
  });

  it('should render rect and text with props', () => {
    const props = {
      size: {
        width: 40, height: 30, x: 1, y: 2,
      },
      textRef: {},
      props: {
        text: 'Tooltip test text', border: { color: 'test_color1', width: 3 }, color: 'test_color2', paddingLeftRight: 4, paddingTopBottom: 5,
      },
    } as Partial<Tooltip>;
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('rect').props()).toMatchObject({
      x: 0,
      y: 0,
      width: 48,
      height: 40,
      strokeWidth: 3,
      stroke: 'test_color1',
      fill: 'test_color2',
    });

    expect(tooltip.find('text').props()).toMatchObject({
      x: 0,
      y: 0,
      children: 'Tooltip test text',
    });

    expect(tooltip.find('g').at(1).props()).toMatchObject({
      textAnchor: 'middle',
      transform: 'translate(24, 3)',
      ref: {},
    });
  });
});

describe('Effect', () => {
  it('test with constructor', () => {
    const tooltip = new Tooltip({ text: 'Tooltip test text' });
    const box = {
      x: 1, y: 2, width: 10, height: 20,
    };
    tooltip.textRef = {
      getBBox: jest.fn().mockReturnValue(box),
    } as any;
    tooltip.calculateSize();

    expect(tooltip.size).toBe(box);
  });
});
