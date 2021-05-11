import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { BaseWidgetProps } from '../base_props';
import { BaseWidget, viewFunction as BaseWidgetComponent } from '../base_widget';
import { RootSvgElement } from '../renderers/svg_root';
import { GrayScaleFilter } from '../renderers/gray_scale_filter';
import { ConfigProvider } from '../../../common/config_provider';
import { clear as clearEventHandlers } from '../../../test_utils/events_mock';
import getElementComputedStyle from '../../../utils/get_computed_style';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '../../../utils/resolve_rtl';

jest.mock('../../../utils/resolve_rtl');
jest.mock('../../../utils/get_computed_style');

const DEFAULT_CANVAS = {
  left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
};

describe('BaseWidget', () => {
  describe('View', () => {
    it('should pass size property and defs child element to the svg element (by default)', () => {
      const widget = shallow(<BaseWidgetComponent {...{ props: {} } as any} /> as JSX.Element);

      expect(widget.find(RootSvgElement).props()).toMatchObject({
        height: 0,
        width: 0,
      });
      expect(widget.find(RootSvgElement).childAt(0).html()).toEqual('<defs></defs>');
    });

    it('should pass all necessary properties: canvas and classes', () => {
      const props = {
        canvas: {
          width: 820,
          height: 440,
        },
        classes: 'root-class',
      } as BaseWidgetProps;
      const widget = shallow(<BaseWidgetComponent {...{
        cssClasses: 'container-class',
        props,
      } as any}
      /> as JSX.Element);

      expect(widget.props().className).toBe('container-class');
      expect(widget.find(RootSvgElement).props()).toMatchObject({
        className: 'root-class',
        height: 440,
        width: 820,
      });
    });

    it('should pass REF into the root svg element', () => {
      const svgRef = createRef<SVGElement>();
      const widget = shallow(<BaseWidgetComponent {...{
        svgElementRef: svgRef,
        props: {},
      } as any}
      /> as JSX.Element);

      expect(widget.find(RootSvgElement).props().rootElementRef).toBe(svgRef);
    });

    it('should render ConfigProvider if shouldRenderConfigProvider is true', () => {
      const widget = shallow(<BaseWidgetComponent {...{
        shouldRenderConfigProvider: true,
        props: {},
      } as any}
      /> as JSX.Element);

      expect(widget.find(ConfigProvider)).toHaveLength(1);
    });

    it('should render children', () => {
      const props = {
        children: <path className="child" />,
      } as BaseWidgetProps;
      const widget = shallow(<BaseWidgetComponent {...{ props } as any} /> as JSX.Element);

      expect(widget.find('.child').exists()).toBe(true);
    });

    it('should render filter when disabled', () => {
      const props = {
        disabled: true,
      } as BaseWidgetProps;
      const widget = shallow(<BaseWidgetComponent {...{ props } as any} /> as JSX.Element);

      expect(widget.find(RootSvgElement).props()).toMatchObject({
        filter: 'url(#DevExpress_1)',
      });
      expect(widget.find(GrayScaleFilter).exists()).toBe(true);
      expect(widget.find(GrayScaleFilter).props().id).toBe('DevExpress_1');
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      afterEach(clearEventHandlers);

      describe('setCanvasEffect', () => {
        it('should set empty canvas by default', () => {
          const widget = new BaseWidget({ canvas: DEFAULT_CANVAS } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toEqual(DEFAULT_CANVAS);
        });

        it('should set size from props (props.size)', () => {
          const widget = new BaseWidget({ size: { width: 600, height: 400 } } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toMatchObject({
            width: 600,
            height: 400,
          });
        });

        it('should set size from container element', () => {
          (getElementComputedStyle as jest.Mock).mockReturnValue({
            width: '400px',
            paddingLeft: '10px',
            paddingRight: '10px',
            height: '300px',
            paddingTop: '10px',
            paddingBottom: '10px',
          });
          const widget = new BaseWidget({ } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toMatchObject({
            width: 380,
            height: 280,
          });
        });

        it('should set default canvas from props (props.defaultCanvas)', () => {
          (getElementComputedStyle as jest.Mock).mockReturnValue({
            width: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            height: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
          });
          const defaultCanvas: ClientRect = {
            width: 500,
            height: 300,
            left: 10,
            right: 20,
            top: 30,
            bottom: 40,
          };
          const widget = new BaseWidget({ defaultCanvas } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toEqual({
            width: 500,
            height: 300,
            left: 10,
            right: 20,
            top: 30,
            bottom: 40,
          });
        });

        it('should set merged size from props.size and container element', () => {
          (getElementComputedStyle as jest.Mock).mockReturnValue({
            width: '400px',
            paddingLeft: '0px',
            paddingRight: '0px',
            height: '300px',
            paddingTop: '0px',
            paddingBottom: '0px',
          });
          const widget = new BaseWidget({
            size: { width: 600 },
            canvas: { ...DEFAULT_CANVAS, width: 300, height: 100 },
          } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toMatchObject({
            width: 600,
            height: 300,
          });
        });

        it('should set merged canvas from props (size, margin and defaultCanvas)', () => {
          const defaultCanvas: ClientRect = {
            width: 500,
            height: 300,
            left: 10,
            right: 20,
            top: 30,
            bottom: 40,
          };
          const widget = new BaseWidget({
            size: { width: 600 },
            defaultCanvas,
            margin: {
              left: 20,
              top: 40,
            },
          } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toEqual({
            width: 600,
            height: 300,
            left: 20,
            right: 20,
            top: 40,
            bottom: 40,
          });
        });

        it('should set merged size from props (size is not valid, and defaultCanvas)', () => {
          const defaultCanvas: ClientRect = {
            ...DEFAULT_CANVAS,
            width: 500,
            height: 300,
          };
          const widget = new BaseWidget({
            size: {
              width: -600,
              height: -400,
            },
            defaultCanvas,
          } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toEqual(defaultCanvas);
        });

        it('should set default canvas from props (if any side is negative)', () => {
          const defaultCanvas: ClientRect = {
            width: 500,
            height: 300,
            left: 10,
            right: 20,
            top: 30,
            bottom: 40,
          };
          const widget = new BaseWidget({
            size: { width: 600, height: 400 },
            defaultCanvas,
            margin: {
              top: 300,
              bottom: 100,
              left: 200,
              right: 400,
            },
          } as any);
          widget.containerRef = React.createRef() as any;
          widget.setCanvasEffect();

          expect(widget.props.canvas).toEqual({
            width: 500,
            height: 300,
            left: 10,
            right: 20,
            top: 30,
            bottom: 40,
          });
        });
      });
    });

    describe('setRootElementRef', () => {
      it('rootElementRef should be init', () => {
        const widget = new BaseWidget({ rootElementRef: { current: null } } as any);
        const element = {} as HTMLDivElement;
        widget.containerRef = React.createRef() as any;
        widget.containerRef.current = element;
        widget.setRootElementRef();
        expect(widget.props.rootElementRef.current).toEqual(element);
      });
    });
  });

  describe('Methods', () => {
    describe('svg', () => {
      it('should return svg root element', () => {
        const widget = new BaseWidget({ } as any);
        const root = { } as SVGElement;
        widget.svgElementRef = React.createRef() as any;
        widget.svgElementRef.current = root;

        expect(widget.svg()).toEqual(root);
      });
    });
  });
});

describe('Logic', () => {
  describe('Getters', () => {
    describe('cssClasses', () => {
      it('should add default classes', () => {
        const widget = new BaseWidget({ } as any);
        expect(widget.cssClasses).toBe('dx-widget dx-visibility-change-handler');
      });

      it('should add className property', () => {
        const widget = new BaseWidget({ className: 'custom-class' } as any);
        expect(widget.cssClasses).toBe('dx-widget dx-visibility-change-handler custom-class');
      });
    });

    describe('pointerEventsState', () => {
      it('should return undefined by default', () => {
        const widget = new BaseWidget({ } as any);

        expect(widget.pointerEventsState).toBe(undefined);
      });

      it('should set visible state', () => {
        const widget = new BaseWidget({ pointerEvents: 'visible' } as any);

        expect(widget.pointerEventsState).toBe('visible');
      });

      it('should set disabled state', () => {
        const widget = new BaseWidget({ disabled: true } as any);

        expect(widget.pointerEventsState).toBe('none');
      });
    });

    describe('shouldRenderConfigProvider', () => {
      it('should return result of utils method resolveRtlEnabledDefinition', () => {
        (resolveRtlEnabledDefinition as jest.Mock).mockReturnValue(true);
        const widget = new BaseWidget({ rtlEnabled: true } as any);

        expect(widget.shouldRenderConfigProvider).toBe(true);
        expect(resolveRtlEnabledDefinition).toBeCalledWith(true, undefined);
      });
    });

    describe('rtlEnabled', () => {
      it('should return result of utils method resolveRtlEnabled', () => {
        (resolveRtlEnabled as jest.Mock).mockReturnValue(false);
        const widget = new BaseWidget({ rtlEnabled: true } as any);

        expect(widget.rtlEnabled).toBe(false);
        expect(resolveRtlEnabled).toBeCalledWith(true, undefined);
      });
    });
  });
});
