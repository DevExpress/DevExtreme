import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';
import {
  recalculateCoordinates, getCloudAngle, getCloudPoints,
} from '../common/tooltip_utils';

jest.mock('../common/tooltip_utils', () => ({
  getCloudPoints: jest.fn().mockReturnValue('test_cloud_points'),
  recalculateCoordinates: jest.fn().mockReturnValue({
    x: 4, y: 5, anchorX: 11, anchorY: 12,
  }),
  getCloudAngle: jest.fn().mockReturnValue(180),
}));

const tooltipProps = {
  text: 'Tooltip test text',
  color: 'test_color2',
  font: {
    color: 'test_font_color',
    family: 'test_family_color',
    opacity: 0.4,
    size: 15,
    weight: 600,
  },
  canvas: {
    left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 400,
  },
  arrowWidth: 20,
  arrowLength: 25,
  cornerRadius: 0,
  offset: 5,
  x: 2,
  y: 3,
};

const props = {
  size: {
    width: 40, height: 30, x: 1, y: 2,
  },
  border: {
    stroke: 'test_color1',
    strokeWidth: 3,
    strokeOpacity: 0.5,
    dashStyle: 'dash_style_test',
  },
  textRef: {},
  fullSize: { width: 48, height: 40 },
  props: tooltipProps,
} as Partial<Tooltip>;

describe('Render', () => {
  it('should render groups', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

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
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('PathSvgElement').props()).toMatchObject({
      d: 'test_cloud_points',
      strokeWidth: 3,
      stroke: 'test_color1',
      fill: 'test_color2',
      rotate: 180,
      rotateX: 4,
      rotateY: 5,
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
    }, 180, { cornerRadius: 0, arrowWidth: 20 }, true);
  });

  it('should render text with props', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('TextSvgElement').props()).toMatchObject({
      text: 'Tooltip test text',
      styles: {
        fill: 'test_font_color',
        fontFamily: 'test_family_color',
        opacity: 0.4,
        fontSize: 15,
        fontWeight: 600,
      },
    });
  });
});

describe('Effect', () => {
  it('should return size', () => {
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

describe('Getters', () => {
  it('should return full size of tooltip', () => {
    const tooltip = new Tooltip({ text: 'Tooltip test text', paddingLeftRight: 4, paddingTopBottom: 3 });
    expect(tooltip.fullSize).toEqual({ width: 8, height: 6 });
  });

  it('should return border options', () => {
    const tooltip = new Tooltip({
      text: 'Tooltip test text',
      border: {
        color: 'test_color',
        width: 4,
        opacity: 0.4,
        dashStyle: 'test_dash_style',
        visible: true,
      },
    });
    expect(tooltip.border).toEqual({
      dashStyle: 'test_dash_style',
      stroke: 'test_color',
      strokeWidth: 4,
      strokeOpacity: 0.4,
    });
  });

  it('should return border options, border visibility is false', () => {
    const tooltip = new Tooltip({
      text: 'Tooltip test text',
      border: {
        color: 'test_color',
        width: 4,
        opacity: 0.4,
        dashStyle: 'test_dash_style',
        visible: false,
      },
    });
    expect(tooltip.border).toEqual({});
  });
});
