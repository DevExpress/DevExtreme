"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxRecurrenceEditor, {
    Properties
} from "devextreme/ui/recurrence_editor";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/recurrence_editor";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IRecurrenceEditorOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IRecurrenceEditorOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IRecurrenceEditorOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>

interface RecurrenceEditorRef {
  instance: () => dxRecurrenceEditor;
}

const RecurrenceEditor = memo(
  forwardRef(
    (props: React.PropsWithChildren<IRecurrenceEditorOptions>, ref: ForwardedRef<RecurrenceEditorRef>) => {
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
        React.createElement(BaseComponent<React.PropsWithChildren<IRecurrenceEditorOptions>>, {
          WidgetClass: dxRecurrenceEditor,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IRecurrenceEditorOptions> & { ref?: Ref<RecurrenceEditorRef> }) => ReactElement | null;
export default RecurrenceEditor;
export {
  RecurrenceEditor,
  IRecurrenceEditorOptions,
  RecurrenceEditorRef
};
import type * as RecurrenceEditorTypes from 'devextreme/ui/recurrence_editor_types';
export { RecurrenceEditorTypes };

