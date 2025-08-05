"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDrawer, {
    Properties
} from "devextreme/ui/drawer";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { DisposingEvent, InitializedEvent } from "devextreme/ui/drawer";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDrawerOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IDrawerOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDrawerOptionsNarrowedEvents> & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  defaultOpened?: boolean;
  onOpenedChange?: (value: boolean) => void;
}>

interface DrawerRef {
  instance: () => dxDrawer;
}

const Drawer = memo(
  forwardRef(
    (props: React.PropsWithChildren<IDrawerOptions>, ref: ForwardedRef<DrawerRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["opened"]), []);
      const independentEvents = useMemo(() => (["onDisposing","onInitialized"]), []);

      const defaults = useMemo(() => ({
        defaultOpened: "opened",
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "template",
          render: "render",
          component: "component"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDrawerOptions>>, {
          WidgetClass: dxDrawer,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IDrawerOptions> & { ref?: Ref<DrawerRef> }) => ReactElement | null;
export default Drawer;
export {
  Drawer,
  IDrawerOptions,
  DrawerRef
};
import type * as DrawerTypes from 'devextreme/ui/drawer_types';
export { DrawerTypes };

