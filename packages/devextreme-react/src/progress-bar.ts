"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxProgressBar, {
    Properties
} from "devextreme/ui/progress_bar";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { CompleteEvent, ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/progress_bar";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IProgressBarOptionsNarrowedEvents = {
  onComplete?: ((e: CompleteEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IProgressBarOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IProgressBarOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: false | number;
  onValueChange?: (value: false | number) => void;
}>

interface ProgressBarRef {
  instance: () => dxProgressBar;
}

const ProgressBar = memo(
  forwardRef(
    (props: React.PropsWithChildren<IProgressBarOptions>, ref: ForwardedRef<ProgressBarRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onComplete","onContentReady","onDisposing","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IProgressBarOptions>>, {
          WidgetClass: dxProgressBar,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IProgressBarOptions> & { ref?: Ref<ProgressBarRef> }) => ReactElement | null;
export default ProgressBar;
export {
  ProgressBar,
  IProgressBarOptions,
  ProgressBarRef
};
import type * as ProgressBarTypes from 'devextreme/ui/progress_bar_types';
export { ProgressBarTypes };

