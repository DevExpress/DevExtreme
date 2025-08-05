"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxResizable, {
    Properties
} from "devextreme/ui/resizable";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { DisposingEvent, InitializedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent } from "devextreme/ui/resizable";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IResizableOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onResize?: ((e: ResizeEvent) => void);
  onResizeEnd?: ((e: ResizeEndEvent) => void);
  onResizeStart?: ((e: ResizeStartEvent) => void);
}

type IResizableOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IResizableOptionsNarrowedEvents> & IHtmlOptions & {
  defaultHeight?: (() => number | string) | number | string;
  defaultWidth?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
}>

interface ResizableRef {
  instance: () => dxResizable;
}

const Resizable = memo(
  forwardRef(
    (props: React.PropsWithChildren<IResizableOptions>, ref: ForwardedRef<ResizableRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["height","width"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onResize","onResizeEnd","onResizeStart"]), []);

      const defaults = useMemo(() => ({
        defaultHeight: "height",
        defaultWidth: "width",
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IResizableOptions>>, {
          WidgetClass: dxResizable,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IResizableOptions> & { ref?: Ref<ResizableRef> }) => ReactElement | null;
export default Resizable;
export {
  Resizable,
  IResizableOptions,
  ResizableRef
};
import type * as ResizableTypes from 'devextreme/ui/resizable_types';
export { ResizableTypes };

