"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCheckBox, {
    Properties
} from "devextreme/ui/check_box";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/check_box";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICheckBoxOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ICheckBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICheckBoxOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: boolean | null | undefined;
  onValueChange?: (value: boolean | null | undefined) => void;
}>

interface CheckBoxRef {
  instance: () => dxCheckBox;
}

const CheckBox = memo(
  forwardRef(
    (props: React.PropsWithChildren<ICheckBoxOptions>, ref: ForwardedRef<CheckBoxRef>) => {
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

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICheckBoxOptions>>, {
          WidgetClass: dxCheckBox,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ICheckBoxOptions> & { ref?: Ref<CheckBoxRef> }) => ReactElement | null;
export default CheckBox;
export {
  CheckBox,
  ICheckBoxOptions,
  CheckBoxRef
};
import type * as CheckBoxTypes from 'devextreme/ui/check_box_types';
export { CheckBoxTypes };

