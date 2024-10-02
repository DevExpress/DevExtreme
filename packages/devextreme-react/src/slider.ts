"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSlider, {
    Properties
} from "devextreme/ui/slider";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
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

interface SliderRef {
  instance: () => dxSlider;
}

const Slider = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISliderOptions>, ref: ForwardedRef<SliderRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        label: { optionName: "label", isCollectionItem: false },
        tooltip: { optionName: "tooltip", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISliderOptions>>, {
          WidgetClass: dxSlider,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISliderOptions> & { ref?: Ref<SliderRef> }) => ReactElement | null;


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
const _componentFormat = (props: IFormatProps) => {
  return React.createElement(NestedOption<IFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "format",
    },
  });
};

const Format = Object.assign<typeof _componentFormat, NestedComponentMeta>(_componentFormat, {
  componentType: "option",
});

// owners:
// Slider
type ILabelProps = React.PropsWithChildren<{
  format?: LocalizationTypes.Format;
  position?: "bottom" | "top";
  visible?: boolean;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      ExpectedChildren: {
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// Slider
type ITooltipProps = React.PropsWithChildren<{
  enabled?: boolean;
  format?: LocalizationTypes.Format;
  position?: "bottom" | "top";
  showMode?: "always" | "onHover";
}>
const _componentTooltip = (props: ITooltipProps) => {
  return React.createElement(NestedOption<ITooltipProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tooltip",
      ExpectedChildren: {
        format: { optionName: "format", isCollectionItem: false }
      },
    },
  });
};

const Tooltip = Object.assign<typeof _componentTooltip, NestedComponentMeta>(_componentTooltip, {
  componentType: "option",
});

export default Slider;
export {
  Slider,
  ISliderOptions,
  SliderRef,
  Format,
  IFormatProps,
  Label,
  ILabelProps,
  Tooltip,
  ITooltipProps
};
import type * as SliderTypes from 'devextreme/ui/slider_types';
export { SliderTypes };

