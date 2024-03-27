"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxScrollView, {
    Properties
} from "devextreme/ui/scroll_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { DisposingEvent, InitializedEvent, PullDownEvent, ReachBottomEvent, ScrollEvent, UpdatedEvent } from "devextreme/ui/scroll_view";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IScrollViewOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onPullDown?: ((e: PullDownEvent) => void);
  onReachBottom?: ((e: ReachBottomEvent) => void);
  onScroll?: ((e: ScrollEvent) => void);
  onUpdated?: ((e: UpdatedEvent) => void);
}

type IScrollViewOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IScrollViewOptionsNarrowedEvents> & IHtmlOptions>

interface ScrollViewRef {
  instance: () => dxScrollView;
}

const ScrollView = memo(
  forwardRef(
    (props: React.PropsWithChildren<IScrollViewOptions>, ref: ForwardedRef<ScrollViewRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onDisposing","onInitialized","onPullDown","onReachBottom","onScroll","onUpdated"]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IScrollViewOptions>>, {
          WidgetClass: dxScrollView,
          ref: baseRef,
          independentEvents,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IScrollViewOptions> & { ref?: Ref<ScrollViewRef> }) => ReactElement | null;
export default ScrollView;
export {
  ScrollView,
  IScrollViewOptions,
  ScrollViewRef
};
import type * as ScrollViewTypes from 'devextreme/ui/scroll_view_types';
export { ScrollViewTypes };

