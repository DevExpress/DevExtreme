"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxValidationGroup, {
    Properties
} from "devextreme/ui/validation_group";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { DisposingEvent, InitializedEvent } from "devextreme/ui/validation_group";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IValidationGroupOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IValidationGroupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IValidationGroupOptionsNarrowedEvents> & IHtmlOptions>

interface ValidationGroupRef {
  instance: () => dxValidationGroup;
}

const ValidationGroup = memo(
  forwardRef(
    (props: React.PropsWithChildren<IValidationGroupOptions>, ref: ForwardedRef<ValidationGroupRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onDisposing","onInitialized"]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IValidationGroupOptions>>, {
          WidgetClass: dxValidationGroup,
          ref: baseRef,
          independentEvents,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IValidationGroupOptions> & { ref?: Ref<ValidationGroupRef> }) => ReactElement | null;
export default ValidationGroup;
export {
  ValidationGroup,
  IValidationGroupOptions,
  ValidationGroupRef
};
import type * as ValidationGroupTypes from 'devextreme/ui/validation_group_types';
export { ValidationGroupTypes };

