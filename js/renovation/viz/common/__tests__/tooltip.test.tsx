import React from 'react';
import { shallow, mount } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import { Tooltip, viewFunction as TooltipComponent } from '../tooltip';
import {
  recalculateCoordinates, getCloudAngle, getCloudPoints, prepareData, getCanvas, isTextEmpty,
} from '../tooltip_utils';
import { getFuncIri } from '../renderers/utils';
import { getFormatValue, isUpdatedFlatObject } from '../utils';
import domAdapter from '../../../../core/dom_adapter';

jest.mock('../tooltip_utils', () => ({
  getCloudPoints: jest.fn(),
  recalculateCoordinates: jest.fn(),
  getCloudAngle: jest.fn(),
  prepareData: jest.fn(),
  getCanvas: jest.fn(),
  isTextEmpty: jest.fn(),
}));

jest.mock('../../common/utils', () => ({
  getFormatValue: jest.fn(),
  isUpdatedFlatObject: jest.fn(),
}));

jest.mock('../renderers/utils', () => ({
  getNextDefsSvgId: jest.fn().mockReturnValue('id'),
  getFuncIri: jest.fn().mockReturnValue('url(#filterId)'),
  getGraphicExtraProps: jest.fn(),
}));

function createElementTest(tagName: string) {
  return domAdapter.getDocument().createElement(tagName);
}

const bodyTest = domAdapter.getBody();

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
    (isTextEmpty as jest.Mock).mockReturnValue(false);
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
    textRef: { current: {} },
    htmlRef: { current: {} },
    cloudRef: { current: {} },
    textSizeWithPaddings: { width: 48, height: 40 },
    correctedCoordinates: {
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    },
    props: tooltipProps,
    container: bodyTest,
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

    expect(getCloudAngle).toBeCalledWith({ width: 48, height: 40 }, {
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    });

    expect(getCloudPoints).toBeCalledWith({ width: 48, height: 40 }, {
      x: 4, y: 5, anchorX: 11, anchorY: 12,
    }, 180, { cornerRadius: 0, arrowWidth: 20 }, true);
  });

  it('should render text with default props', () => {
    const tooltip = shallow(<TooltipComponent {
      ...{ ...props, props: { ...tooltipProps, font: undefined } } as any
    }
    /> as any);

    expect(tooltip.find('TextSvgElement').props()).toMatchObject({
      text: 'customized_text',
      styles: {
        fill: 'customized_font_color',
        fontFamily: 'Segoe UI',
        fontSize: 12,
        fontWeight: 400,
        opacity: 1,
      },
    });
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

  it('should render shadow with default props', () => {
    const tooltip = shallow(<TooltipComponent {
      ...{ ...props, props: { ...tooltipProps, shadow: undefined } } as any
    }
    /> as any);

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
    const tooltip = shallow(TooltipComponent({
      ...props, pointerEvents: 'auto', props: customizedProps,
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
    const tooltip = shallow(TooltipComponent({
      ...props,
      props: customizedProps,
    } as any));

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

  it('should be rendered to passed container', () => {
    const container = bodyTest.appendChild(createElementTest('div'));
    container.setAttribute('id', 'some-id');

    const tooltip = shallow(TooltipComponent({ ...props, container } as any));
    expect(tooltip.find('div').at(0).parent().props().containerInfo.id).toEqual('some-id');

    container.remove();
  });

  it('should not render anything, correctedCoordinates = false', () => {
    const tooltip = shallow(TooltipComponent({ ...props, correctedCoordinates: false } as any));

    expect(tooltip.find('div')).toHaveLength(1);
    expect(tooltip.find('div').props()).toEqual({});
    expect(tooltip.find('defs')).toHaveLength(0);
    expect(tooltip.find('ShadowFilter')).toHaveLength(0);
    expect(tooltip.find('PathSvgElement')).toHaveLength(0);
    expect(tooltip.find('TextSvgElement')).toHaveLength(0);
  });

  it('should not render anything, isEmptyContainer = true', () => {
    const tooltip = shallow(TooltipComponent({ ...props, isEmptyContainer: true } as any));

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
    const tooltip = shallow(TooltipComponent({
      ...props,
      props: customizedProps,
    } as any));

    expect(tooltip.find('div').at(1).props().style).toMatchObject({ direction: 'rtl' });
  });

  it('should apply ltr for html text', () => {
    const contentTemplate = (data) => <p className="tooltip-template">{`${data.valueText}_template`}</p>;
    const customizedProps = {
      ...props.props, rtl: false, contentTemplate,
    };
    const tooltip = shallow(TooltipComponent({
      ...props,
      props: customizedProps,
    } as any));

    expect(tooltip.find('div').at(1).props().style).toMatchObject({ direction: 'ltr' });
  });

  it('should apply className to main div', () => {
    const tooltip = shallow(TooltipComponent({ ...props, cssClassName: 'dx-tooltip' } as any));

    expect(tooltip.find('div').at(0).props().className).toBe('dx-tooltip');
  });
});

describe('Behavior', () => {
  describe('Effects', () => {
    beforeEach(() => {
      (recalculateCoordinates as jest.Mock).mockReturnValue({
        x: 4, y: 5, anchorX: 11, anchorY: 12,
      });
      (isUpdatedFlatObject as jest.Mock).mockReturnValue(true);
    });

    afterEach(() => jest.resetAllMocks);

    describe('calculateSize', () => {
      it('should not update state of content size if not changed', () => {
        (isUpdatedFlatObject as jest.Mock).mockReturnValue(false);
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        const box = {
          x: 1, y: 2, width: 10, height: 20,
        };
        tooltip.textSize = box;
        tooltip.textRef = React.createRef() as any;
        tooltip.textRef.current = {
          getBBox: jest.fn().mockReturnValue({ ...box }),
        } as any;
        tooltip.calculateSize();

        expect(tooltip.textSize).toBe(box);
      });

      it('should not update state of cloud size if not changed', () => {
        (isUpdatedFlatObject as jest.Mock).mockReturnValue(false);
        const tooltip = new Tooltip({
          data: { valueText: 'Tooltip value text' } as any, visible: true, x: 1, y: 2, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any,
        });
        const cloudSize = {
          x: 7,
          y: 9,
          width: 28.2,
          height: 32.2,
        };
        tooltip.cloudSize = cloudSize;
        tooltip.textRef = React.createRef() as any;
        tooltip.htmlRef = React.createRef() as any;
        tooltip.cloudRef = React.createRef() as any;
        tooltip.cloudRef = {
          getBBox: jest.fn().mockReturnValue({
            x: 7, y: 9, width: 13, height: 15,
          }),
        } as any;
        tooltip.calculateSize();

        expect(tooltip.cloudSize).toBe(cloudSize);
      });

      it('should update state of content size', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        const box = {
          x: 1, y: 2, width: 10, height: 20,
        };
        tooltip.textSize = {
          x: 0, y: 0, width: 5, height: 10,
        };
        tooltip.htmlRef = React.createRef() as any;
        tooltip.textRef = React.createRef() as any;
        tooltip.textRef.current = {
          getBBox: jest.fn().mockReturnValue(box),
        } as any;
        tooltip.calculateSize();

        expect(tooltip.textSize).toBe(box);
      });

      it('should update state of cloud size', () => {
        const tooltip = new Tooltip({
          data: { valueText: 'Tooltip value text' } as any, visible: true, x: 1, y: 2, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any,
        });
        tooltip.cloudSize = {
          x: 1,
          y: 5,
          width: 30,
          height: 34,
        };
        tooltip.textRef = React.createRef() as any;
        tooltip.htmlRef = React.createRef() as any;
        tooltip.cloudRef = React.createRef() as any;
        tooltip.cloudRef.current = {
          getBBox: jest.fn().mockReturnValue({
            x: 7, y: 9, width: 13, height: 15,
          }),
        } as any;
        tooltip.calculateSize();

        expect(tooltip.cloudSize).toEqual({
          x: 7,
          y: 9,
          width: 28.2,
          height: 32.2,
        });
      });
    });

    describe('setHtmlText', () => {
      it('should set html text', () => {
        (prepareData as jest.Mock).mockReturnValue({
          html: 'customized_html_text',
        });
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {} as HTMLDivElement;
        tooltip.setHtmlText();

        expect(tooltip.htmlRef.current.innerHTML).toEqual('customized_html_text');
      });

      it('should not set html text, html option is not set by user', () => {
        (prepareData as jest.Mock).mockReturnValue({
          text: 'customized_tooltip_text',
        });
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {} as HTMLDivElement;
        tooltip.setHtmlText();

        expect(tooltip.htmlRef.current.innerHTML).toEqual(undefined);
      });

      it('should not set html text for invisible tooltip (visibility is false)', () => {
        (prepareData as jest.Mock).mockReturnValue({
          html: 'customized_html_text',
        });
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: false });
        tooltip.htmlRef = React.createRef() as any;
        tooltip.setHtmlText();

        expect(tooltip.htmlRef.current).toBe(null);
      });

      it('should not set html text for invisible tooltip (htmlRef is not rendered)', () => {
        (prepareData as jest.Mock).mockReturnValue({
          html: 'customized_html_text',
        });
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        tooltip.htmlRef = React.createRef() as any;
        tooltip.setHtmlText();

        expect(tooltip.htmlRef.current).toBe(null);
      });
    });

    describe('eventsEffect', () => {
      it('should trigger onTooltipShown event', () => {
        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();
        tooltip.eventsEffect();
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(1);
        expect(shownTooltip).toHaveBeenCalledWith({ target: { tag: 'point info' }, component: {} });
      });

      it('should not trigger onTooltipShown event, correctedCoordinates is false', () => {
        (recalculateCoordinates as jest.Mock).mockReturnValue(false);

        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(0);
      });

      it('should trigger onTooltipShown event, if target is changed', () => {
        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();

        tooltip.props.eventData = { target: { tag: 'new point info' } as any, component: {} as any };
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(2);
        expect(shownTooltip).toHaveBeenLastCalledWith({ target: { tag: 'new point info' }, component: {} });
      });

      it('should work properly after hide tooltip withow onTooltipHidden event', () => {
        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();

        tooltip.props.visible = false;
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(1);
      });

      it('should trigger onTooltipShown event, eventData is not define', () => {
        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: undefined, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();
        tooltip.eventsEffect();
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(1);
        expect(shownTooltip).toHaveBeenCalledWith({});
      });

      it('should not trigger onTooltipHidden event, tooltip have not been shown before', () => {
        const hiddenTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: false, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipHidden: hiddenTooltip,
        });
        tooltip.eventsEffect();

        expect(hiddenTooltip).toBeCalledTimes(0);
      });

      it('should trigger onTooltipHidden event', () => {
        const hiddenTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipHidden: hiddenTooltip,
        });
        tooltip.eventsEffect();
        tooltip.props.visible = false;
        tooltip.eventsEffect();
        tooltip.eventsEffect();

        expect(hiddenTooltip).toBeCalledTimes(1);
        expect(hiddenTooltip).toHaveBeenLastCalledWith({ target: { tag: 'point info' }, component: {} });
      });

      it('should trigger onTooltipHidden event, if target is changed', () => {
        const hiddenTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { target: { tag: 'point info' } as any, component: {} as any }, onTooltipHidden: hiddenTooltip,
        });
        tooltip.eventsEffect();

        tooltip.props.eventData = { target: { tag: 'new point info' } as any, component: {} as any };
        tooltip.eventsEffect();

        expect(hiddenTooltip).toBeCalledTimes(1);
        expect(hiddenTooltip).toHaveBeenLastCalledWith({ target: { tag: 'point info' }, component: {} });
      });

      it('should trigger onTooltipShown event, target is not define', () => {
        const shownTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { component: {} as any }, onTooltipShown: shownTooltip,
        });
        tooltip.eventsEffect();
        tooltip.eventsEffect();
        tooltip.eventsEffect();

        expect(shownTooltip).toBeCalledTimes(1);
        expect(shownTooltip).toHaveBeenCalledWith({ component: {} });
      });

      it('should not trigger onTooltipHidden event, tooltip have not been shown before, target is not define', () => {
        const hiddenTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: false, eventData: { component: {} as any }, onTooltipHidden: hiddenTooltip,
        });
        tooltip.eventsEffect();

        expect(hiddenTooltip).toBeCalledTimes(0);
      });

      it('should trigger onTooltipHidden event, target is not define', () => {
        const hiddenTooltip = jest.fn();
        const tooltip = new Tooltip({
          visible: true, eventData: { component: {} as any }, onTooltipHidden: hiddenTooltip,
        });
        tooltip.eventsEffect();
        tooltip.props.visible = false;
        tooltip.eventsEffect();
        tooltip.eventsEffect();

        expect(hiddenTooltip).toBeCalledTimes(1);
        expect(hiddenTooltip).toHaveBeenLastCalledWith({ component: {} });
      });
    });

    describe('checkContainer', () => {
      it('should not set isEmptyContainer prop, container is not empty', () => {
        const tooltip = new Tooltip({ visible: true });
        const box = {
          x: 1, y: 2, width: 10, height: 20,
        };
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {
          getBoundingClientRect: jest.fn().mockReturnValue(box),
        } as any;

        tooltip.checkContainer();
        expect(tooltip.isEmptyContainer).toBe(false);
      });

      it('should not set isEmptyContainer prop, visible is false', () => {
        const tooltip = new Tooltip({ visible: false });
        const box = {
          x: 1, y: 2, width: 0, height: 0,
        };
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {
          getBoundingClientRect: jest.fn().mockReturnValue(box),
        } as any;

        tooltip.checkContainer();
        expect(tooltip.isEmptyContainer).toBe(false);
      });

      it('should not set isEmptyContainer prop, htmlRef is not rendered', () => {
        const tooltip = new Tooltip({ visible: false });
        tooltip.htmlRef = React.createRef() as any;

        tooltip.checkContainer();
        expect(tooltip.isEmptyContainer).toBe(false);
      });

      it('should set isEmptyContainer prop to true, container is empty', () => {
        const tooltip = new Tooltip({ visible: true });
        const box = {
          x: 1, y: 2, width: 0, height: 0,
        };
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {
          getBoundingClientRect: jest.fn().mockReturnValue(box),
        } as any;

        tooltip.checkContainer();
        expect(tooltip.isEmptyContainer).toBe(true);
      });
    });

    describe('setCanvas', () => {
      it('should set canvas', () => {
        const tooltip = new Tooltip({});
        const canvas = {
          top: 1, left: 2, right: 3, bottom: 4, width: 10, height: 10,
        };
        (getCanvas as jest.Mock).mockReturnValue(canvas);
        tooltip.setCanvas();

        expect(tooltip.canvas).toEqual(canvas);
      });
    });
  });

  describe('Methods', () => {
    describe('getLocation', () => {
      it('should return location option', () => {
        const tooltip = new Tooltip({ location: 'edge' });

        expect(tooltip.getLocation()).toBe('edge');
      });
    });

    describe('calculateContentSize', () => {
      it('should return size of simple text', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        const box = {
          x: 1, y: 2, width: 10, height: 20,
        };
        tooltip.textRef = React.createRef() as any;
        tooltip.htmlRef = React.createRef() as any;
        tooltip.textRef.current = {
          getBBox: jest.fn().mockReturnValue(box),
        } as any;

        expect(tooltip.calculateContentSize()).toBe(box);
      });

      it('should return size of html text', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        const box = {
          x: 1, y: 2, width: 10, height: 20,
        };
        tooltip.textRef = React.createRef() as any;
        tooltip.htmlRef = React.createRef() as any;
        tooltip.htmlRef.current = {
          getBoundingClientRect: jest.fn().mockReturnValue(box),
        } as any;

        expect(tooltip.calculateContentSize()).toBe(box);
      });

      it('should not calculate text size for invisible tooltip (visibility of tooltip is false)', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: false });
        tooltip.htmlRef = { current: {} } as any;

        expect(tooltip.calculateContentSize()).toEqual({
          x: 0, y: 0, width: 0, height: 0,
        });
      });

      it('should not calculate text size for invisible tooltip (textRef and htmlRef is not rendered)', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });
        tooltip.textRef = React.createRef() as any;
        tooltip.htmlRef = React.createRef() as any;

        expect(tooltip.calculateContentSize()).toEqual({
          x: 0, y: 0, width: 0, height: 0,
        });
      });
    });

    describe('calculateCloudSize', () => {
      it('should calculate cloud size', () => {
        const tooltip = new Tooltip({
          data: { valueText: 'Tooltip value text' } as any, visible: true, x: 1, y: 2, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any,
        });
        tooltip.cloudRef = React.createRef() as any;
        tooltip.cloudRef.current = {
          getBBox: jest.fn().mockReturnValue({
            x: 7, y: 9, width: 13, height: 15,
          }),
        } as any;

        expect(tooltip.calculateCloudSize()).toEqual({
          x: 7,
          y: 9,
          width: 28.2,
          height: 32.2,
        });
      });

      it('should not calculate cloud size, x and y is not defined', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any });
        tooltip.cloudRef = {
          getBBox: jest.fn().mockReturnValue({
            x: 7, y: 9, width: 13, height: 15,
          }),
        } as any;

        expect(tooltip.calculateCloudSize()).toEqual({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });

      it('should not calculate cloud size, visibility is false', () => {
        const tooltip = new Tooltip({
          data: { valueText: 'Tooltip value text' } as any, visible: false, x: 1, y: 2, shadow: { offsetX: 12, offsetY: 14, blur: 1.1 } as any,
        });
        tooltip.cloudRef = {
          getBBox: jest.fn().mockReturnValue({
            x: 7, y: 9, width: 13, height: 15,
          }),
        } as any;

        expect(tooltip.calculateCloudSize()).toEqual({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });

      it('should not calculate cloud size for invisible tooltip (cloudRef is not rendered)', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, visible: true });

        expect(tooltip.calculateCloudSize()).toEqual({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        });
      });
    });
  });
});

describe('Logic', () => {
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

    describe('textSizeWithPaddings', () => {
      it('should return text size with paddings of tooltip', () => {
        const tooltip = new Tooltip({ data: { valueText: 'Tooltip value text' } as any, paddingLeftRight: 4, paddingTopBottom: 3 });
        expect(tooltip.textSizeWithPaddings).toEqual({ width: 8, height: 6 });
      });
    });

    describe('border', () => {
      it('should return default border props', () => {
        const tooltip = new Tooltip({
          data: { valueText: 'Tooltip value text' } as any,
        });
        expect(tooltip.border).toEqual({
          dashStyle: 'solid',
          stroke: '#d3d3d3',
          strokeOpacity: undefined,
          strokeWidth: 1,
        });
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
    });

    describe('customizedOptions', () => {
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
    });

    describe('margins', () => {
      it('should return default margins props', () => {
        const tooltip = new Tooltip({ });
        expect(tooltip.margins).toEqual({
          lm: 5,
          tm: 1,
          rm: 5,
          bm: 9,
        });
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
    });

    describe('pointerEvents', () => {
      it('should return pointer events, interactive', () => {
        const tooltip = new Tooltip({ interactive: true });

        expect(tooltip.pointerEvents).toEqual('auto');
      });

      it('should return pointer events, not interactive', () => {
        const tooltip = new Tooltip({ interactive: false });

        expect(tooltip.pointerEvents).toEqual('none');
      });
    });

    describe('container', () => {
      it('should return body as container by default', () => {
        const tooltip = new Tooltip({});
        expect(tooltip.container).toEqual(bodyTest);
      });

      it('should return body as container if container was not found by selector', () => {
        const tooltip = new Tooltip({ container: '#some-id' });
        expect(tooltip.container).toEqual(bodyTest);
      });

      it('should return passed element as container', () => {
        const container = bodyTest.appendChild(createElementTest('div'));

        const tooltip = new Tooltip({ container });
        expect(tooltip.container).toEqual(container);

        container.remove();
      });

      it('should return found element as container', () => {
        const container = bodyTest.appendChild(createElementTest('div'));
        container.setAttribute('id', 'some-id');

        const tooltip = new Tooltip({ container: '#some-id' });
        expect(tooltip.container).toEqual(container);

        container.remove();
      });

      it('should select closest container to rootContainer', () => {
        const htmlStructRoot = bodyTest.appendChild(createElementTest('div'));

        const container1 = htmlStructRoot.appendChild(createElementTest('div'));
        container1.setAttribute('class', 'container-class');

        const container2 = htmlStructRoot.appendChild(createElementTest('div'));
        container2.setAttribute('class', 'container-class');

        const masterDiv = createElementTest('div');
        container2.appendChild(masterDiv);

        const rootWidgetRef = React.createRef() as RefObject<HTMLDivElement>;
        rootWidgetRef.current = masterDiv;

        const tooltip = new Tooltip({ container: '.container-class', rootWidget: rootWidgetRef });

        expect(tooltip.container).toEqual(container2);

        htmlStructRoot.remove();
      });
    });

    describe('cssClassName', () => {
      it('should return css className', () => {
        const tooltip = new Tooltip({ className: 'tooltip_test_class_name' });

        expect(tooltip.cssClassName).toEqual('tooltip_test_class_name');
      });
    });

    describe('correctedCoordinates', () => {
      it('should return correctedCoordinates', () => {
        const tooltip = new Tooltip({
          paddingLeftRight: 2,
          paddingTopBottom: 3,
          x: 30,
          y: 40,
          offset: 7,
          arrowLength: 5,
        });
        tooltip.canvas = {
          top: 1, left: 2, right: 3, bottom: 4, width: 10, height: 10,
        };

        expect(tooltip.correctedCoordinates).toEqual({
          x: 4, y: 5, anchorX: 11, anchorY: 12,
        });

        expect(recalculateCoordinates).toHaveBeenCalledWith({
          anchorX: 30,
          anchorY: 40,
          canvas: {
            top: 1, left: 2, right: 3, bottom: 4, width: 10, height: 10,
          },
          offset: 7,
          arrowLength: 5,
          size: {
            width: 4,
            height: 6,
          },
        });
      });
    });
  });
});
