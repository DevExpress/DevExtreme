import {
  Component,
  JSXComponent,
  Ref,
  Effect,
  Method,
  ForwardRef,
  Consumer,
  Fragment,
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { isDefined } from '../../../core/utils/type';
import { combineClasses } from '../../utils/combine_classes';
import { BaseWidgetProps } from './base_props';
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { ConfigProvider } from '../../common/config_provider';
import { RootSvgElement } from './renderers/svg_root';
import { GrayScaleFilter } from './renderers/gray_scale_filter';
import { Canvas } from './common/types.d';
import {
  sizeIsValid,
  pickPositiveValue,
  getElementWidth,
  getElementHeight,
} from './utils';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '../../utils/resolve_rtl';
import { getNextDefsSvgId, getFuncIri } from './renderers/utils';

const getCssClasses = (model: Partial<BaseWidgetProps>): string => {
  const containerClassesMap = {
    'dx-widget': true,
    'dx-visibility-change-handler': true,
    [String(model.className)]: !!model.className,
  };

  return combineClasses(containerClassesMap);
};

const calculateCanvas = (model: Partial<BaseWidgetProps> & Partial<BaseWidget>): Canvas => {
  const { height, width } = model.size ?? {};
  const margin = model.margin ?? {};
  const defaultCanvas = model.defaultCanvas ?? {};
  const elementWidth = !sizeIsValid(width) ? getElementWidth(model.containerRef) : 0;
  const elementHeight = !sizeIsValid(height) ? getElementHeight(model.containerRef) : 0;
  const canvas = {
    width: Number(width) <= 0 ? 0 : Math.floor(pickPositiveValue([
      width,
      elementWidth,
      defaultCanvas.width,
    ])),
    height: Number(height) <= 0 ? 0 : Math.floor(pickPositiveValue([
      height,
      elementHeight,
      defaultCanvas.height,
    ])),
    left: pickPositiveValue([margin.left, defaultCanvas.left]),
    top: pickPositiveValue([margin.top, defaultCanvas.top]),
    right: pickPositiveValue([margin.right, defaultCanvas.right]),
    bottom: pickPositiveValue([margin.bottom, defaultCanvas.bottom]),
  };
  if (canvas.width - canvas.left - canvas.right <= 0
    || canvas.height - canvas.top - canvas.bottom <= 0) {
    return { ...defaultCanvas };
  }
  return canvas;
};

export const viewFunction = (viewModel: BaseWidget): JSX.Element => {
  const grayFilterId = viewModel.props.disabled ? getNextDefsSvgId() : undefined;
  const canvas = viewModel.props.canvas || { };
  const widget = (
    <div
      ref={viewModel.containerRef}
      className={viewModel.cssClasses}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
    >
      <RootSvgElement
        rootElementRef={viewModel.svgElementRef}
        className={viewModel.props.classes}
        width={canvas.width}
        height={canvas.height}
        pointerEvents={viewModel.pointerEventsState}
        filter={grayFilterId ? getFuncIri(grayFilterId) : undefined}
      >
        <Fragment>
          <defs>
            {grayFilterId && <GrayScaleFilter id={grayFilterId} />}
          </defs>
          {viewModel.props.children}
        </Fragment>
      </RootSvgElement>
    </div>
  );
  return (
    viewModel.shouldRenderConfigProvider
      ? (
        <ConfigProvider rtlEnabled={viewModel.rtlEnabled}>
          {widget}
        </ConfigProvider>
      )
      : widget
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class BaseWidget extends JSXComponent(BaseWidgetProps) {
  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @ForwardRef() svgElementRef!: RefObject<SVGElement>;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Effect()
  contentReadyEffect(): void {
    const { onContentReady } = this.props;

    this.setCanvas();

    onContentReady?.({ element: this.svgElementRef });
  }

  @Method()
  svg(): SVGElement {
    return this.svgElementRef;
  }

  get shouldRenderConfigProvider(): boolean {
    const { rtlEnabled } = this.props;
    return resolveRtlEnabledDefinition(rtlEnabled, this.config);
  }

  get rtlEnabled(): boolean | undefined {
    const { rtlEnabled } = this.props;
    return resolveRtlEnabled(rtlEnabled, this.config);
  }

  get pointerEventsState(): string | undefined {
    const { pointerEvents, disabled } = this.props;
    return disabled ? 'none' : pointerEvents;
  }

  get cssClasses(): string {
    const { className } = this.props;

    return getCssClasses({ className });
  }

  setCanvas(): void {
    const {
      size,
      canvas,
      margin,
      defaultCanvas,
    } = this.props;

    const newCanvas = calculateCanvas({
      containerRef: this.containerRef,
      defaultCanvas,
      size,
      margin,
    });

    if (isDefined(newCanvas.height) && isDefined(newCanvas.width)
    && Object.keys(newCanvas).some((key) => newCanvas[key] !== canvas?.[key])) {
      this.props.canvas = newCanvas;
    }
  }
}
