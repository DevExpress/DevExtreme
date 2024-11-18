"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxRangeSlider, {
    Properties
} from "devextreme/ui/range_slider";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/range_slider";
import type { Format as CommonFormat, VerticalEdge, TooltipShowMode } from "devextreme/common";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IRangeSliderOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IRangeSliderOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IRangeSliderOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: Array<number>;
  onValueChange?: (value: Array<number>) => void;
}>

interface RangeSliderRef {
  instance: () => dxRangeSlider;
}

const RangeSlider = memo(
  forwardRef(
    (props: React.PropsWithChildren<IRangeSliderOptions>, ref: ForwardedRef<RangeSliderRef>) => {
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
        React.createElement(BaseComponent<React.PropsWithChildren<IRangeSliderOptions>>, {
          WidgetClass: dxRangeSlider,
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
) as (props: React.PropsWithChildren<IRangeSliderOptions> & { ref?: Ref<RangeSliderRef> }) => ReactElement | null;


// owners:
// Label
// Tooltip
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
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
// RangeSlider
type ILabelProps = React.PropsWithChildren<{
  format?: LocalizationFormat;
  position?: VerticalEdge;
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
// RangeSlider
type ITooltipProps = React.PropsWithChildren<{
  enabled?: boolean;
  format?: LocalizationFormat;
  position?: VerticalEdge;
  showMode?: TooltipShowMode;
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

export default RangeSlider;
export {
  RangeSlider,
  IRangeSliderOptions,
  RangeSliderRef,
  Format,
  IFormatProps,
  Label,
  ILabelProps,
  Tooltip,
  ITooltipProps
};
import type * as RangeSliderTypes from 'devextreme/ui/range_slider_types';
export { RangeSliderTypes };

