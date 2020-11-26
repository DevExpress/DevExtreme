import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';
import {
  recalculateCoordinates, getCloudAngle, getCloudPoints,
} from '../common/tooltip_computeds';

jest.mock('../common/tooltip_computeds', () => ({
  getCloudPoints: jest.fn().mockReturnValue('test_cloud_points'),
  recalculateCoordinates: jest.fn().mockReturnValue({
    x: 4, y: 5, anchorX: 11, anchorY: 12,
  }),
  getCloudAngle: jest.fn().mockReturnValue({ rotationAngle: 180, radRotationAngle: 1.11 }),
}));

const tooltipProps = {
  text: 'Tooltip test text',
  border: { color: 'test_color1', width: 3 },
  color: 'test_color2',
  paddingLeftRight: 4,
  paddingTopBottom: 5,
  canvas: {
    left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 400,
  },
  arrowWidth: 20,
  arrowLength: 25,
  offset: 5,
  x: 2,
  y: 3,
};

describe('Render', () => {
  it('should render path and text', () => {
    const props = {
      size: {
        width: 40, height: 30, x: 1, y: 2,
      },
      textRef: {},
      props: {
        canvas: {
          left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 400,
        },
      },
    } as Partial<Tooltip>;
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('path').props()).toMatchObject({
      d: 'test_cloud_points',
      strokeWidth: undefined,
      stroke: undefined,
      fill: undefined,
      transform: 'rotate(180 4 5)',
    });

    expect(tooltip.find('text').props()).toMatchObject({
      x: 0,
      y: 0,
      children: undefined,
    });

    expect(tooltip.find('g').at(0).props()).toMatchObject({
      pointerEvents: 'none',
    });

    expect(tooltip.find('g').at(1).props()).toMatchObject({
      textAnchor: 'middle',
      transform: 'translate(4, -12)',
      ref: {},
    });
  });

  it('should render path with props', () => {
    const props = {
      size: {
        width: 40, height: 30, x: 1, y: 2,
      },
      textRef: {},
      props: tooltipProps,
    } as Partial<Tooltip>;
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('path').props()).toMatchObject({
      d: 'test_cloud_points',
      strokeWidth: 3,
      stroke: 'test_color1',
      fill: 'test_color2',
      transform: 'rotate(180 4 5)',
    });

    expect(recalculateCoordinates).toBeCalledWith({
      canvas: tooltipProps.canvas,
      anchorX: tooltipProps.x,
      anchorY: tooltipProps.y,
      arrowLength: tooltipProps.arrowLength,
      size: { width: 48, height: 40 },
      offset: tooltipProps.offset,
    });

    expect(getCloudAngle).toBeCalledWith({ width: 48, height: 40 }, {
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    });

    expect(getCloudPoints).toBeCalledWith({ width: 48, height: 40 }, {
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    }, { rotationAngle: 180, radRotationAngle: 1.11 }, { cornerRadius: 0, arrowWidth: 20 }, true);
  });

  it('should render text with props', () => {
    const props = {
      size: {
        width: 40, height: 30, x: 1, y: 2,
      },
      textRef: {},
      props: tooltipProps,
    } as Partial<Tooltip>;
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('text').props()).toMatchObject({
      x: 0,
      y: 0,
      children: 'Tooltip test text',
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
