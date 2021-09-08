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
  ComponentBindings,
} from '@devextreme-generator/declarations';
import { isDefined } from '../../../core/utils/type';
import { combineClasses } from '../../utils/combine_classes';
import { BaseWidgetProps } from './base_props';
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { ConfigProvider } from '../../common/config_provider';
import { RootSvgElement } from './renderers/svg_root';
import { GrayScaleFilter } from './renderers/gray_scale_filter';
import {
  sizeIsValid,
  pickPositiveValue,
  getElementWidth,
  getElementHeight,
  isUpdatedFlatObject,
} from './utils';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '../../utils/resolve_rtl';
import { getNextDefsSvgId, getFuncIri } from './renderers/utils';

const DEFAULT_CANVAS = {
  left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0,
};

const getCssClasses = (model: Partial<BaseWidgetProps>): string => {
  const containerClassesMap = {
    'dx-widget': true,
    'dx-visibility-change-handler': true,
    [String(model.className)]: !!model.className,
  };

  return combineClasses(containerClassesMap);
};

const calculateCanvas = (
  model: Partial<BaseWidgetProps> &
  Partial<Omit<BaseWidget, 'containerRef'>> &
  { element: HTMLDivElement | null },
): ClientRect => {
  const { height, width } = model.size ?? {};
  const margin = model.margin ?? {};
  const defaultCanvas = model.defaultCanvas ?? DEFAULT_CANVAS;
  const elementWidth = !sizeIsValid(width)
    ? getElementWidth(model.element)
    : 0;
  const elementHeight = !sizeIsValid(height)
    ? getElementHeight(model.element)
    : 0;
  const canvas = {
    width:
      width && width <= 0
        ? 0
        : Math.floor(
          pickPositiveValue([width, elementWidth, defaultCanvas.width]),
        ),
    height:
      height && height <= 0
        ? 0
        : Math.floor(
          pickPositiveValue([height, elementHeight, defaultCanvas.height]),
        ),
    left: pickPositiveValue([margin.left, defaultCanvas.left]),
    top: pickPositiveValue([margin.top, defaultCanvas.top]),
    right: pickPositiveValue([margin.right, defaultCanvas.right]),
    bottom: pickPositiveValue([margin.bottom, defaultCanvas.bottom]),
  };
  if (
    canvas.width - canvas.left - canvas.right <= 0
    || canvas.height - canvas.top - canvas.bottom <= 0
  ) {
    return { ...defaultCanvas };
  }
  return canvas;
};

export const viewFunction = (viewModel: BaseWidget): JSX.Element => {
  const grayFilterId = viewModel.props.disabled ? getNextDefsSvgId() : undefined;
  const canvas = viewModel.props.canvas || DEFAULT_CANVAS;
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

// https://github.com/DevExpress/devextreme-renovation/issues/573
@ComponentBindings()
export class Props extends BaseWidgetProps {
  @ForwardRef() rootElementRef!: RefObject<HTMLDivElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class BaseWidget extends JSXComponent<Props, 'rootElementRef'>() {
  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @ForwardRef() svgElementRef!: RefObject<SVGElement>;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Effect({ run: 'once' }) setRootElementRef(): void {
    this.props.rootElementRef.current = this.containerRef.current;
  }

  @Effect()
  contentReadyEffect(): void {
    const { onContentReady } = this.props;

    this.setCanvas();

    onContentReady?.({ element: this.svgElementRef.current });
  }

  @Method()
  svg(): SVGElement | null {
    return this.svgElementRef.current;
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
      element: this.containerRef.current,
      defaultCanvas,
      size,
      margin,
    });

    if (isDefined(newCanvas.height) && isDefined(newCanvas.width)
    && isUpdatedFlatObject(canvas, newCanvas)) {
      this.props.canvas = newCanvas;
    }
  }
}
