import React from 'react';
import { shallow, mount } from 'enzyme';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';
import {
  recalculateCoordinates, getCloudAngle, getCloudPoints, prepareData,
} from '../common/tooltip_utils';
import { getFuncIri } from '../renderers/utils';
import { getFormatValue } from '../../common/utils';

jest.mock('../common/tooltip_utils', () => ({
  getCloudPoints: jest.fn(),
  recalculateCoordinates: jest.fn(),
  getCloudAngle: jest.fn(),
  prepareData: jest.fn(),
}));

jest.mock('../../common/utils', () => ({
  getFormatValue: jest.fn(),
}));

jest.mock('../renderers/utils', () => ({
  getNextDefsSvgId: jest.fn().mockReturnValue('id'),
  getFuncIri: jest.fn().mockReturnValue('url(#filterId)'),
}));

describe('Render', () => {
  beforeEach(() => {
    (getCloudPoints as jest.Mock).mockReturnValue('test_cloud_points');
    (recalculateCoordinates as jest.Mock).mockReturnValue({
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    });
    (getCloudAngle as jest.Mock).mockReturnValue(180);
    (prepareData as jest.Mock).mockReturnValue({
      text: 'customized_tooltip_text',
      color: 'customized_color',
      borderColor: 'customized_border_color',
      fontColor: 'customized_font_color',
    });
    (getFormatValue as jest.Mock).mockReturnValue('formated_value');
  });

  afterEach(() => jest.resetAllMocks);

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
    visible: true,
  };

  const props = {
    textSize: {
      width: 40, height: 30, x: 1, y: 2,
    },
    cloudSize: {
      width: 50, height: 38, x: 3, y: 4,
    },
    setCurrentState: jest.fn(),
    filterId: 'filterId',
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
    htmlRef: {},
    cloudRef: {},
    textSizeWithPaddings: { width: 48, height: 40 },
    props: tooltipProps,
  };

  it('should render main div', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);
    expect(tooltip.find('div').at(0).props().style).toEqual({
      pointerEvents: 'none',
      left: 3,
      top: 4,
      position: 'absolute',
    });
  });

  it('should render root svg', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);
    expect(tooltip.find('RootSvgElement').props()).toMatchObject({
      width: 50,
      height: 38,
      styles: { position: 'absolute' },
    });
  });

  it('should render groups', () => {
    const tooltip = shallow(<TooltipComponent {...props as any} /> as any);

    expect(tooltip.find('g').at(0).props()).toMatchObject({
      transform: 'translate(-3, -4)',
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
      stroke: 'customized_border_color',
      fill: 'customized_color',
      opacity: 0.4,
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
      id: 'filterId',
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
      filter: 'url(#filterId)',
    });

    expect(getFuncIri).toBeCalledWith('filterId');
  });

  it('should render div for html text', () => {
    const customizedOptions = { ...props.customizedOptions, html: 'html text' };
    const tooltip = shallow(TooltipComponent({ ...props, customizedOptions } as any));
    expect(tooltip.find('div').at(1).props().style).toMatchObject({
      position: 'relative',
      display: 'inline-block',
      left: -19,
      top: -14,
      fill: 'customized_font_color',
      fontFamily: 'test_family_color',
      fontSize: 15,
      fontWeight: 600,
      opacity: 0.4,
    });
  });

  it('should be interactive', () => {
    const customizedProps = { ...props.props, interactive: true };
    const tooltip = shallow(TooltipComponent({ ...props, pointerEvents: 'auto', props: customizedProps } as any));

    expect(tooltip.find('RootSvgElement').props()).toMatchObject({
      styles: {
        msUserSelect: 'text',
        MozUserSelect: 'auto',
        WebkitUserSelect: 'auto',
      },
    });
    expect(tooltip.find('PathSvgElement').props()).toMatchObject({
      pointerEvents: 'auto',
    });
    expect(tooltip.find('TextSvgElement').props()).toMatchObject({
      styles: {
        pointerEvents: 'auto',
      },
    });
  });

  it('should be interactive with html text', () => {
    const customizedOptions = { ...props.customizedOptions, html: 'html text' };
    const customizedProps = { ...props.props, interactive: true };
    const tooltip = shallow(TooltipComponent({
      ...props, pointerEvents: 'auto', customizedOptions, props: customizedProps,
    } as any));

    expect(tooltip.find('RootSvgElement').props()).toMatchObject({
      styles: {
        msUserSelect: 'text',
        MozUserSelect: 'auto',
        WebkitUserSelect: 'auto',
      },
    });
    expect(tooltip.find('PathSvgElement').props()).toMatchObject({
      pointerEvents: 'auto',
    });
    expect(tooltip.find('div').at(1).props().style).toMatchObject({
      pointerEvents: 'auto',
    });
  });

  it('should render contentTemplate', () => {
    const contentTemplate = (data) => <p className="tooltip-template">{`${data.valueText}_template`}</p>;
    const customizedProps = { ...props.props, contentTemplate };
    const tooltip = mount(TooltipComponent({ ...props, props: customizedProps } as any));

    expect(tooltip.find('div').at(1).children()).toHaveLength(1);
    expect(tooltip.find('div').at(1).children().props()).toEqual({ valueText: 'Tooltip value text' });
    expect(tooltip.find('.tooltip-template').text()).toBe('Tooltip value text_template');
  });

  it('should set on the div zIndex', () => {
    const customizedProps = { ...props.props, zIndex: 3 };
    const tooltip = shallow(TooltipComponent({ ...props, props: customizedProps } as any));

    expect(tooltip.find('div').at(0).props().style).toMatchObject({
      zIndex: 3,
    });
  });

  it('should not render anything, visibility = false', () => {
    const customizedProps = { ...props.props, visible: false };
    const tooltip = shallow(TooltipComponent({ ...props, props: customizedProps } as any));

    expect(tooltip.find('div')).toHaveLength(1);
    expect(tooltip.find('div').props()).toEqual({});
    expect(tooltip.find('defs')).toHaveLength(0);
    expect(tooltip.find('ShadowFilter')).toHaveLength(0);
    expect(tooltip.find('PathSvgElement')).toHaveLength(0);
    expect(tooltip.find('TextSvgElement')).toHaveLength(0);
  });

  it('should apply rtl for html text', () => {
    const contentTemplate = (data) => <p className="tooltip-template">{`${data.valueText}_template`}</p>;
    const customizedProps = { ...props.props, rtl: true, contentTemplate };
    const tooltip = shallow(TooltipComponent({ ...props, props: customizedProps } as any));

    expect(tooltip.find('div').at(1).props().style).toMatchObject({ direction: 'rtl' });
  });

  it('should apply ltr for html text', () => {
    const contentTemplate = (data) => <p className="tooltip-template">{`${data.valueText}_template`}</p>;
    const customizedProps = { ...props.props, rtl: false, contentTemplate };
    const tooltip = shallow(TooltipComponent({ ...props, props: customizedProps } as any));

    expect(tooltip.find('div').at(1).props().style).toMatchObject({ direction: 'ltr' });
  });
});

describe('Effect', () => {
  it('should return size', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
    const box = {
      x: 1, y: 2, width: 10, height: 20,
    };
    tooltip.textRef = {
      getBBox: jest.fn().mockReturnValue(box),
    } as any;
    tooltip.calculateSize();

    expect(tooltip.textSize).toBe(box);
  });

  it('should return size of html text', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
    const box = {
      x: 1, y: 2, width: 10, height: 20,
    };
    tooltip.htmlRef = {
      getBoundingClientRect: jest.fn().mockReturnValue(box),
    } as any;
    tooltip.calculateSize();

    expect(tooltip.textSize).toBe(box);
  });

  it('should not calculate text size for invisible tooltip', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: false });
    tooltip.calculateSize();

    expect(tooltip.textSize).toEqual({
      x: 0, y: 0, width: 0, height: 0,
    });
  });

  it('should set html text', () => {
    (prepareData as jest.Mock).mockReturnValue({
      html: 'customized_html_text',
    });
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
    tooltip.htmlRef = {} as any;
    tooltip.setHtmlText();

    expect(tooltip.htmlRef.innerHTML).toEqual('customized_html_text');
  });

  it('should not set html text, html option is not by user', () => {
    (prepareData as jest.Mock).mockReturnValue({
      text: 'customized_tooltip_text',
    });
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
    tooltip.htmlRef = {} as any;
    tooltip.setHtmlText();

    expect(tooltip.htmlRef.innerHTML).toEqual(undefined);
  });

  it('should not set html text for invisible tooltip', () => {
    (prepareData as jest.Mock).mockReturnValue({
      html: 'customized_html_text',
    });
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: false });
    tooltip.htmlRef = {} as any;
    tooltip.setHtmlText();

    expect(tooltip.htmlRef.innerHTML).toBe(undefined);
  });

  it('should calculate cloud size', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any });
    tooltip.d = 'test_d';
    tooltip.cloudRef = {
      getBBox: jest.fn().mockReturnValue({
        x: 7, y: 9, width: 13, height: 15,
      }),
    } as any;
    tooltip.calculateCloudSize();

    expect(tooltip.cloudSize).toEqual({
      x: 7,
      y: 9,
      width: 28.2,
      height: 32.2,
    });
  });

  it('should not calculate cloud size, d is not defined', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any });
    tooltip.cloudRef = {
      getBBox: jest.fn().mockReturnValue({
        x: 7, y: 9, width: 13, height: 15,
      }),
    } as any;
    tooltip.calculateCloudSize();

    expect(tooltip.cloudSize).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });

  it('should not calculate cloud size for invisible tooltip', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: false });
    tooltip.d = 'test_d';
    tooltip.calculateCloudSize();

    expect(tooltip.cloudSize).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  });
});

describe('Methods', () => {
  it('should format value', () => {
    const tooltip = new Tooltip({ format: 'format', argumentFormat: 'argument_format' });

    expect(tooltip.formatValue('value', 'specialFormat')).toEqual('formated_value');
    expect(getFormatValue).toBeCalledWith('value', 'specialFormat', { format: 'format', argumentFormat: 'argument_format' });
  });

  it('should return enabled option', () => {
    const tooltip = new Tooltip({ enabled: false });

    expect(tooltip.isEnabled()).toBe(false);
  });

  it('should return shared option', () => {
    const tooltip = new Tooltip({ shared: true });

    expect(tooltip.isShared()).toBe(true);
  });

  it('should return location option', () => {
    const tooltip = new Tooltip({ location: 'edge' });

    expect(tooltip.getLocation()).toBe('edge');
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

  beforeEach(() => {
    (prepareData as jest.Mock).mockReturnValue({
      text: 'customized_tooltip_text',
      color: 'customized_color',
      borderColor: 'customized_border_color',
      fontColor: 'customized_font_color',
    });
  });

  afterEach(() => jest.resetAllMocks);

  it('should return text size with paddings of tooltip', () => {
    const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, paddingLeftRight: 4, paddingTopBottom: 3 });
    expect(tooltip.textSizeWithPaddings).toEqual({ width: 8, height: 6 });
  });

  it('should return border options', () => {
    const tooltip = new Tooltip({
      data: { valueText: 'Tooltip value text' } as any,
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
      data: { valueText: 'Tooltip value text' } as any,
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
    const tooltip = new Tooltip(props as any);

    expect(tooltip.customizedOptions).toEqual({
      text: 'customized_tooltip_text',
      color: 'customized_color',
      borderColor: 'customized_border_color',
      fontColor: 'customized_font_color',
    });

    expect(prepareData)
      .toBeCalledWith(props.data, props.color, props.border, props.font, undefined);
  });

  it('should return margins', () => {
    const tooltip = new Tooltip({ shadow: { offsetX: 11, offsetY: 12, blur: 2 } as any });
    expect(tooltip.margins).toEqual({
      lm: 0,
      tm: 0,
      rm: 16,
      bm: 17,
    });
  });

  it('should return pointer events, interactive', () => {
    const tooltip = new Tooltip({ interactive: true });

    expect(tooltip.pointerEvents).toEqual('auto');
  });

  it('should return pointer events, not interactive', () => {
    const tooltip = new Tooltip({ interactive: false });

    expect(tooltip.pointerEvents).toEqual('none');
  });
});

describe('SetCurrentState', () => {
  it('should set current d', () => {
    const tooltip = new Tooltip({ });

    tooltip.setCurrentState('path_1');
    expect(tooltip.d).toEqual('path_1');
    tooltip.setCurrentState('path_2');
    tooltip.setCurrentState('path_2');
    expect(tooltip.d).toEqual('path_2');
  });
});
