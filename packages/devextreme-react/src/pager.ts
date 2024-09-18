"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPager, {
    Properties
} from "devextreme/ui/pager";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

type IPagerOptions = React.PropsWithChildren<Properties & IHtmlOptions>

interface PagerRef {
  instance: () => dxPager;
}

const Pager = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPagerOptions>, ref: ForwardedRef<PagerRef>) => {
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
        React.createElement(BaseComponent<React.PropsWithChildren<IPagerOptions>>, {
          WidgetClass: dxPager,
          ref: baseRef,
          independentEvents,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IPagerOptions> & { ref?: Ref<PagerRef> }) => ReactElement | null;
export default Pager;
export {
  Pager,
  IPagerOptions,
  PagerRef
};
import type * as PagerTypes from 'devextreme/ui/pager_types';
export { PagerTypes };

