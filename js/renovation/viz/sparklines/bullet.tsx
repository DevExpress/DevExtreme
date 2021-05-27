import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  InternalState,
  Consumer,
  RefObject,
  Nested,
  Fragment,
  Effect,
  ForwardRef,
  Event,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../utils/combine_classes';
import { resolveRtlEnabled } from '../../utils/resolve_rtl';
import { getElementOffset } from '../../utils/get_element_offset';
import { BaseWidgetProps } from '../common/base_props';
import { BaseWidget } from '../common/base_widget';
import {
  createAxis,
  SparklineTooltipData,
  generateCustomizeTooltipCallback,
} from './utils';
import { ConfigContextValue, ConfigContext } from '../../common/config_context';
import { PathSvgElement } from '../common/renderers/svg_path';
import {
  OnTooltipHiddenFn, OnTooltipShownFn, BaseEventData,
} from '../common/types.d';
import { Tooltip as TooltipComponent, TooltipProps } from '../common/tooltip';
import { getFormatValue, pointInCanvas } from '../common/utils';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import pointerEvents from '../../../events/pointer';
import { EffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';

import {
  ArgumentAxisRange, ValueAxisRange, BulletScaleProps,
} from './types.d';

import Number from '../../../core/polyfills/number';

const TARGET_MIN_Y = 0.02;
const TARGET_MAX_Y = 0.98;
const BAR_VALUE_MIN_Y = 0.1;
const BAR_VALUE_MAX_Y = 0.9;

const DEFAULT_CANVAS_WIDTH = 300;
const DEFAULT_CANVAS_HEIGHT = 30;
const DEFAULT_HORIZONTAL_MARGIN = 1;
const DEFAULT_VERTICAL_MARGIN = 2;

const DEFAULT_OFFSET = { top: 0, left: 0 };

const EVENT_NS = 'sparkline-tooltip';
const POINTER_ACTION = addNamespace(
  [pointerEvents.down, pointerEvents.move],
  EVENT_NS,
);

const inCanvas = (canvas: ClientRect, x: number, y: number): boolean => {
  const { width, height } = canvas;
  return pointInCanvas(
    {
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height,
    },
    x,
    y,
  );
};

const getCssClasses = ({ classes }): string => {
  const rootClassesMap = {
    // eslint-disable-next-line spellcheck/spell-checker
    dxb: true,
    'dxb-bullet': true,
    [String(classes)]: !!classes,
  };

  return combineClasses(rootClassesMap);
};

const getContainerCssClasses = ({ className }): string => {
  const rootClassesMap = {
    'dx-bullet': true,
    [String(className)]: !!className,
  };

  return combineClasses(rootClassesMap);
};

export const viewFunction = (viewModel: Bullet): JSX.Element => {
  const {
    size,
    margin,
    disabled,
    color,
    targetColor,
    targetWidth,
  } = viewModel.props;
  const {
    customizedTooltipProps, zeroLevelShape, isValidZeroLevel, isValidBulletScale,
    barValueShape, isValidTarget, targetShape,
  } = viewModel;
  return (
    <Fragment>
      <BaseWidget
        rootElementRef={viewModel.widgetRootRef}
        ref={viewModel.widgetRef}
        classes={viewModel.cssClasses}
        className={viewModel.cssClassName}
        size={size}
        margin={margin}
        defaultCanvas={viewModel.defaultCanvas}
        disabled={disabled}
        rtlEnabled={viewModel.rtlEnabled}
        canvasChange={viewModel.onCanvasChange}
        pointerEvents="visible"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewModel.restAttributes}
      >
        {isValidBulletScale ? (
          <Fragment>
            <PathSvgElement
              type="line"
              points={barValueShape}
              className="dxb-bar-value"
              strokeLineCap="square"
              fill={color}
            />
            { isValidTarget && (
              <PathSvgElement
                type="line"
                points={targetShape}
                className="dxb-target"
                sharp
                strokeLineCap="square"
                stroke={targetColor}
                strokeWidth={targetWidth}
              />
            )}
            {isValidZeroLevel && (
              <PathSvgElement
                type="line"
                points={zeroLevelShape}
                className="dxb-zero-level"
                sharp
                strokeLineCap="square"
                stroke={targetColor}
                strokeWidth={1}
              />
            )}
          </Fragment>
        ) : undefined}

      </BaseWidget>
      {customizedTooltipProps.enabled && (
        <TooltipComponent
          rootWidget={viewModel.widgetRootRef}
          ref={viewModel.tooltipRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...customizedTooltipProps}
          visible={viewModel.tooltipVisible}
        />
      )}
    </Fragment>
  );
};
@ComponentBindings()
export class BulletProps extends BaseWidgetProps {
  @OneWay() value = 0;

  @OneWay() color = '#e8c267';

  @OneWay() target = 0;

  @OneWay() targetColor = '#666666';

  @OneWay() targetWidth = 4;

  @OneWay() showTarget = true;

  @OneWay() showZeroLevel = true;

  @OneWay() startScaleValue = 0;

  @OneWay() endScaleValue?: number;

  @Nested() tooltip?: TooltipProps;

  @Event() onTooltipHidden?: OnTooltipHiddenFn<BaseEventData>;

  @Event() onTooltipShown?: OnTooltipShownFn<BaseEventData>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class Bullet extends JSXComponent(BulletProps) {
  @Ref() widgetRef!: RefObject<BaseWidget>;

  @Ref() tooltipRef!: RefObject<TooltipComponent>;

  @ForwardRef() widgetRootRef!: RefObject<HTMLDivElement>;

  @InternalState() argumentAxis = createAxis(true);

  @InternalState() valueAxis = createAxis(false);

  @InternalState() canvasState: ClientRect = {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };

  @InternalState() offsetState: { top: number; left: number } = DEFAULT_OFFSET;

  @InternalState() tooltipVisible = false;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Effect()
  tooltipEffect(): EffectReturn {
    const { disabled } = this.props;
    if (!disabled && this.customizedTooltipProps.enabled) {
      const svg = this.widgetRef.current?.svg();
      eventsEngine.on(svg, POINTER_ACTION, this.pointerHandler);
      return (): void => {
        eventsEngine.off(svg, POINTER_ACTION, this.pointerHandler);
      };
    }

    return undefined;
  }

  @Effect()
  tooltipOutEffect(): EffectReturn {
    if (this.tooltipVisible) {
      const document = domAdapter.getDocument();
      eventsEngine.on(document, POINTER_ACTION, this.pointerOutHandler);
      return (): void => {
        eventsEngine.off(document, POINTER_ACTION, this.pointerOutHandler);
      };
    }

    return undefined;
  }

  get cssClasses(): string {
    const { classes } = this.props;
    return getCssClasses({ classes });
  }

  get cssClassName(): string {
    const { className } = this.props;
    return getContainerCssClasses({ className });
  }

  get rtlEnabled(): boolean | undefined {
    const { rtlEnabled } = this.props;
    return resolveRtlEnabled(rtlEnabled, this.config);
  }

  get tooltipEnabled(): boolean {
    return !(this.props.value === undefined && this.props.target === undefined);
  }

  get tooltipData(): SparklineTooltipData {
    const { value, target, tooltip } = this.props;
    const valueText = getFormatValue(value, undefined, {
      format: tooltip?.format,
    });
    const targetText = getFormatValue(target, undefined, {
      format: tooltip?.format,
    });

    return {
      originalValue: value,
      originalTarget: target,
      value: valueText,
      target: targetText,
      valueTexts: ['Actual Value:', valueText, 'Target Value:', targetText],
    };
  }

  get tooltipCoords(): { x: number; y: number } {
    const canvas = this.canvasState;
    const rootOffset = this.offsetState;
    return {
      x: canvas.width / 2 + rootOffset.left,
      y: canvas.height / 2 + rootOffset.top,
    };
  }

  get customizedTooltipProps(): Partial<TooltipProps> {
    const { tooltip, onTooltipHidden, onTooltipShown } = this.props;
    const customProps = {
      enabled: this.tooltipEnabled,
      eventData: { component: this.widgetRef },
      onTooltipHidden,
      onTooltipShown,
      customizeTooltip: generateCustomizeTooltipCallback(
        tooltip?.customizeTooltip,
        tooltip?.font,
        this.rtlEnabled,
      ),
      data: this.tooltipData,
      ...this.tooltipCoords,
    };

    if (!tooltip) {
      return customProps;
    }

    return {
      ...tooltip,
      ...customProps,
      enabled: tooltip.enabled && this.tooltipEnabled,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get defaultCanvas(): ClientRect {
    return {
      width: DEFAULT_CANVAS_WIDTH,
      height: DEFAULT_CANVAS_HEIGHT,
      left: DEFAULT_HORIZONTAL_MARGIN,
      right: DEFAULT_HORIZONTAL_MARGIN,
      top: DEFAULT_VERTICAL_MARGIN,
      bottom: DEFAULT_VERTICAL_MARGIN,
    };
  }

  get scaleProps(): BulletScaleProps {
    const props = this.prepareScaleProps();
    const canvas = this.canvasState;
    const ranges = this.getRange(props);

    this.argumentAxis.update(ranges.arg, canvas, undefined);
    this.valueAxis.update(ranges.val, canvas, undefined);

    return props;
  }

  get isValidBulletScale(): boolean {
    const {
      value, startScaleValue, endScaleValue, target,
    } = this.props;
    const isValidBounds = startScaleValue !== endScaleValue;
    const isValidMin = Number.isFinite(startScaleValue);
    const isValidMax = Number.isFinite(endScaleValue);
    const isValidValue = Number.isFinite(value);
    const isValidTarget = Number.isFinite(target);

    return (
      isValidBounds && isValidMax && isValidMin && isValidTarget && isValidValue
    );
  }

  get targetShape(): [number, number, number, number] {
    return this.getSimpleShape(this.scaleProps.target);
  }

  get zeroLevelShape(): [number, number, number, number] {
    return this.getSimpleShape(0);
  }

  get isValidTarget(): boolean {
    const { showTarget } = this.props;

    return !(this.scaleProps.target > this.scaleProps.endScaleValue
      || this.scaleProps.target < this.scaleProps.startScaleValue || !showTarget);
  }

  get isValidZeroLevel(): boolean {
    const { showZeroLevel } = this.props;

    return !(this.scaleProps.endScaleValue < 0
      || this.scaleProps.startScaleValue > 0 || !showZeroLevel);
  }

  get barValueShape(): [number, number, number, number, number, number, number, number] {
    const translatorX = this.argumentAxis.getTranslator();
    const translatorY = this.valueAxis.getTranslator();
    const y2 = translatorY.translate(BAR_VALUE_MIN_Y);
    const y1 = translatorY.translate(BAR_VALUE_MAX_Y);
    let x1;
    let x2;

    if (this.scaleProps.value > 0) {
      x1 = Math.max(0, this.scaleProps.startScaleValue);
      x2 = this.scaleProps.value >= this.scaleProps.endScaleValue
        ? this.scaleProps.endScaleValue : Math.max(this.scaleProps.value, x1);
    } else {
      x1 = Math.min(0, this.scaleProps.endScaleValue);
      x2 = this.scaleProps.value < this.scaleProps.startScaleValue
        ? this.scaleProps.startScaleValue : Math.min(this.scaleProps.value, x1);
    }

    x1 = translatorX.translate(x1);
    x2 = translatorX.translate(x2);

    return [x1, y1, x2, y1, x2, y2, x1, y2];
  }

  onCanvasChange(canvas: ClientRect): void {
    this.canvasState = canvas;
    const svgElement = this.widgetRef.current?.svg() || undefined;
    this.offsetState = getElementOffset(svgElement) ?? DEFAULT_OFFSET;
  }

  prepareScaleProps(): BulletScaleProps {
    const {
      value, target, startScaleValue, endScaleValue,
    } = this.props;

    const tmpProps = {
      inverted: false,
      value,
      target,
      startScaleValue: startScaleValue === undefined ? Math.min(target, value, 0) : startScaleValue,
      endScaleValue: endScaleValue === undefined ? Math.max(target, value) : endScaleValue,
    };

    if (tmpProps.endScaleValue < tmpProps.startScaleValue) {
      const level = tmpProps.endScaleValue;
      tmpProps.endScaleValue = tmpProps.startScaleValue;
      tmpProps.startScaleValue = level;
      tmpProps.inverted = true;
    }

    return tmpProps;
  }

  getRange(scaleProps: BulletScaleProps): { arg: ArgumentAxisRange; val: ValueAxisRange } {
    const { startScaleValue, endScaleValue, inverted } = scaleProps;

    return {
      arg: {
        invert: this.rtlEnabled ? !inverted : inverted,
        min: startScaleValue,
        max: endScaleValue,
        axisType: 'continuous',
        dataType: 'numeric',
      },
      val: {
        min: 0,
        max: 1,
        axisType: 'continuous',
        dataType: 'numeric',
      },
    };
  }

  getSimpleShape(value: number): [number, number, number, number] {
    const translatorY = this.valueAxis.getTranslator();
    const x = this.argumentAxis.getTranslator().translate(value);

    return [
      x,
      translatorY.translate(TARGET_MIN_Y),
      x,
      translatorY.translate(TARGET_MAX_Y),
    ];
  }

  pointerHandler(): void {
    this.tooltipVisible = true;
  }

  pointerOutHandler({ pageX, pageY }): void {
    const { left, top } = this.offsetState;
    const x = Math.floor(pageX - left);
    const y = Math.floor(pageY - top);

    if (!inCanvas(this.canvasState, x, y)) {
      this.tooltipVisible = false;
    }
  }
}
