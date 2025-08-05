"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSpeedDialAction, {
    Properties
} from "devextreme/ui/speed_dial_action";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/speed_dial_action";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISpeedDialActionOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type ISpeedDialActionOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISpeedDialActionOptionsNarrowedEvents> & IHtmlOptions>

interface SpeedDialActionRef {
  instance: () => dxSpeedDialAction;
}

const SpeedDialAction = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISpeedDialActionOptions>, ref: ForwardedRef<SpeedDialActionRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onClick","onContentReady","onDisposing","onInitialized"]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISpeedDialActionOptions>>, {
          WidgetClass: dxSpeedDialAction,
          ref: baseRef,
          independentEvents,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISpeedDialActionOptions> & { ref?: Ref<SpeedDialActionRef> }) => ReactElement | null;
export default SpeedDialAction;
export {
  SpeedDialAction,
  ISpeedDialActionOptions,
  SpeedDialActionRef
};
import type * as SpeedDialActionTypes from 'devextreme/ui/speed_dial_action_types';
export { SpeedDialActionTypes };

