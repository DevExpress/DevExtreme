"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxButton, {
    Properties
} from "devextreme/ui/button";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/button";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IButtonOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IButtonOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IButtonOptionsNarrowedEvents> & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>

interface ButtonRef {
  instance: () => dxButton;
}

const Button = memo(
  forwardRef(
    (props: React.PropsWithChildren<IButtonOptions>, ref: ForwardedRef<ButtonRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onClick","onContentReady","onDisposing","onInitialized"]), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "template",
          render: "render",
          component: "component"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IButtonOptions>>, {
          WidgetClass: dxButton,
          ref: baseRef,
          independentEvents,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IButtonOptions> & { ref?: Ref<ButtonRef> }) => ReactElement | null;
export default Button;
export {
  Button,
  IButtonOptions,
  ButtonRef
};
import type * as ButtonTypes from 'devextreme/ui/button_types';
export { ButtonTypes };

