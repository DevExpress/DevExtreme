"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSlider, {
    Properties
} from "devextreme/ui/slider";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/slider";
import type { VerticalEdge, TooltipShowMode } from "devextreme/common";

import type * as LocalizationTypes from "devextreme/common";
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
  type?: LocalizationTypes.Format | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentFormat = memo(
  (props: IFormatProps) => {
    return React.createElement(NestedOption<IFormatProps>, { ...props });
  }
);

const Format: typeof _componentFormat & IElementDescriptor = Object.assign(_componentFormat, {
  OptionName: "format",
})

// owners:
// Slider
type ILabelProps = React.PropsWithChildren<{
  format?: LocalizationTypes.Format;
  position?: VerticalEdge;
  visible?: boolean;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  ExpectedChildren: {
    format: { optionName: "format", isCollectionItem: false }
  },
})

// owners:
// Slider
type ITooltipProps = React.PropsWithChildren<{
  enabled?: boolean;
  format?: LocalizationTypes.Format;
  position?: VerticalEdge;
  showMode?: TooltipShowMode;
}>
const _componentTooltip = memo(
  (props: ITooltipProps) => {
    return React.createElement(NestedOption<ITooltipProps>, { ...props });
  }
);

const Tooltip: typeof _componentTooltip & IElementDescriptor = Object.assign(_componentTooltip, {
  OptionName: "tooltip",
  ExpectedChildren: {
    format: { optionName: "format", isCollectionItem: false }
  },
})

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

