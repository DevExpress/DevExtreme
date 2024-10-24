"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxRating, {
    Properties
} from "devextreme/ui/rating";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/rating";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IRatingOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IRatingOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IRatingOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}>

interface RatingRef {
  instance: () => dxRating;
}

const Rating = memo(
  forwardRef(
    (props: React.PropsWithChildren<IRatingOptions>, ref: ForwardedRef<RatingRef>) => {
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
        label: { optionName: "label", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IRatingOptions>>, {
          WidgetClass: dxRating,
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
) as (props: React.PropsWithChildren<IRatingOptions> & { ref?: Ref<RatingRef> }) => ReactElement | null;


// owners:
// Rating
type ILabelProps = React.PropsWithChildren<{
  enabled?: boolean;
  format?: ((value: number, itemCount: number) => string) | string;
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
})

export default Rating;
export {
  Rating,
  IRatingOptions,
  RatingRef,
  Label,
  ILabelProps
};
import type * as RatingTypes from 'devextreme/ui/rating_types';
export { RatingTypes };

