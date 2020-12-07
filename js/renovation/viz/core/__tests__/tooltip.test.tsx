import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';
import {
  recalculateCoordinates, getCloudAngle, getCloudPoints, prepareData,
} from '../common/tooltip_utils';
import { getFormatValue } from '../../common/utils';

jest.mock('../common/tooltip_utils', () => ({
  getCloudPoints: jest.fn().mockReturnValue('test_cloud_points'),
  recalculateCoordinates: jest.fn().mockReturnValue({
    x: 4, y: 5, anchorX: 11, anchorY: 12,
  }),
  getCloudAngle: jest.fn().mockReturnValue(180),
  prepareData: jest.fn().mockReturnValue({
    text: 'customized_tooltip_text',
    color: 'customized_color',
    borderColor: 'customized_border_color',
    fontColor: 'customized_font_color',
  }),
}));

jest.mock('../../common/utils', () => ({
  getFormatValue: jest.fn().mockReturnValue('formated_value'),
}));

describe('Render', () => {
  const tooltipProps = {
    data: {
      valueText: 'Tooltip value text',
    },
    color: 'test_color2',
    font: {
      color: 'test_font_color',
      family: 'test_family_color',
      opacity: 0.4,
      size: 15,
      weight: 600,
    },
    shadow: {
      blur: 2,
      color: '#000',
      offsetX: 0,
      offsetY: 4,
      opacity: 0.4,
    },
    canvas: {
      left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 400,
    },
    arrowWidth: 20,
    arrowLength: 25,
    cornerRadius: 0,
    offset: 5,
    opacity: 0.4,
    x: 2,
    y: 3,
  };

  const props = {
    size: {
      width: 40, height: 30, x: 1, y: 2,
    },
    customizedOptions: {
      borderColor: 'customized_border_color',
      color: 'customized_color',
      fontColor: 'customized_font_color',
      text: 'customized_text',
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
      text: 'customized_text',
      styles: {
        fill: 'customized_font_color',
        fontFamily: 'test_family_color',
        opacity: 0.4,
        fontSize: 15,
        fontWeight: 600,
      },
    });
  });

  it('should render shadow', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('defs')).toHaveLength(1);
    expect(tooltip.find('ShadowFilter').props()).toMatchObject({
      id: 'DevExpress_4',
      x: '-50%',
      y: '-50%',
      width: '200%',
      height: '200%',
      blur: 2,
      color: '#000',
      offsetX: 0,
      offsetY: 4,
      opacity: 0.4,
    });
    expect(tooltip.find('g').at(0).props()).toMatchObject({
      pointerEvents: 'none',
      filter: 'url(#DevExpress_4)',
    });
  });
});

describe('Effect', () => {
  it('should return size', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } });
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

describe('Methods', () => {
  it('should format value', () => {
    const tooltip = new Tooltip({ format: 'format', argumentFormat: 'argument_format' });

    expect(tooltip.formatValue('value', 'specialFormat')).toEqual('formated_value');
    expect(getFormatValue).toBeCalledWith('value', 'specialFormat', { format: 'format', argumentFormat: 'argument_format' });
  });
});

describe('Getters', () => {
  const border = {
    color: 'test_color',
    width: 4,
    opacity: 0.4,
    dashStyle: 'test_dash_style',
    visible: true,
  };

  it('should return full size of tooltip', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' }, paddingLeftRight: 4, paddingTopBottom: 3 });
    expect(tooltip.fullSize).toEqual({ width: 8, height: 6 });
  });

  it('should return border options', () => {
    const tooltip = new Tooltip({
      data: { valueText: 'Tooltip value text' },
      border,
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
      data: { valueText: 'Tooltip value text' },
      border: { ...border, visible: false },
    });
    expect(tooltip.border).toEqual({});
  });

  it('should return customized tooltip options', () => {
    const props = {
      data: { valueText: 'value_text' },
      color: 'test_color',
      border,
      font: {
        color: '',
        family: '',
        opacity: 0.4,
        size: 15,
        weight: 600,
      },
    };
    const tooltip = new Tooltip(props);

    expect(tooltip.customizedOptions).toEqual({
      text: 'customized_tooltip_text',
      color: 'customized_color',
      borderColor: 'customized_border_color',
      fontColor: 'customized_font_color',
    });

    expect(prepareData)
      .toBeCalledWith(props.data, props.color, props.border, props.font, undefined);
  });
});
