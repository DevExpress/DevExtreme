"use client"
import dxSlider, {
    Properties
} from "devextreme/ui/slider";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/slider";

import type * as LocalizationTypes from "devextreme/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISliderOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ISliderOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISliderOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>

class Slider extends BaseComponent<React.PropsWithChildren<ISliderOptions>> {

  public get instance(): dxSlider {
    return this._instance;
  }

  protected _WidgetClass = dxSlider;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };

  protected _expectedChildren = {
    label: { optionName: "label", isCollectionItem: false },
    tooltip: { optionName: "tooltip", isCollectionItem: false }
  };
}
(Slider as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  keyStep: PropTypes.number,
  label: PropTypes.object,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  showRange: PropTypes.bool,
  step: PropTypes.number,
  tabIndex: PropTypes.number,
  tooltip: PropTypes.object,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  value: PropTypes.number,
  valueChangeMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "onHandleMove",
      "onHandleRelease"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Label
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// Slider
type ILabelProps = React.PropsWithChildren<{
  format?: LocalizationTypes.Format;
  position?: "bottom" | "top";
  visible?: boolean;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static ExpectedChildren = {
    format: { optionName: "format", isCollectionItem: false }
  };
}

// owners:
// Slider
type ITooltipProps = React.PropsWithChildren<{
  enabled?: boolean;
  format?: LocalizationTypes.Format;
  position?: "bottom" | "top";
  showMode?: "always" | "onHover";
}>
class Tooltip extends NestedOption<ITooltipProps> {
  public static OptionName = "tooltip";
  public static ExpectedChildren = {
    format: { optionName: "format", isCollectionItem: false }
  };
}

export default Slider;
export {
  Slider,
  ISliderOptions,
  Format,
  IFormatProps,
  Label,
  ILabelProps,
  Tooltip,
  ITooltipProps
};
import type * as SliderTypes from 'devextreme/ui/slider_types';
export { SliderTypes };

