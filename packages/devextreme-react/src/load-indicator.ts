"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxLoadIndicator, {
    Properties
} from "devextreme/ui/load_indicator";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/load_indicator";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ILoadIndicatorOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type ILoadIndicatorOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ILoadIndicatorOptionsNarrowedEvents> & IHtmlOptions>

interface LoadIndicatorRef {
  instance: () => dxLoadIndicator;
}

const LoadIndicator = memo(
  forwardRef(
    (props: React.PropsWithChildren<ILoadIndicatorOptions>, ref: ForwardedRef<LoadIndicatorRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized"]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ILoadIndicatorOptions>>, {
          WidgetClass: dxLoadIndicator,
          ref: baseRef,
          independentEvents,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ILoadIndicatorOptions> & { ref?: Ref<LoadIndicatorRef> }) => ReactElement | null;
export default LoadIndicator;
export {
  LoadIndicator,
  ILoadIndicatorOptions,
  LoadIndicatorRef
};
import type * as LoadIndicatorTypes from 'devextreme/ui/load_indicator_types';
export { LoadIndicatorTypes };

