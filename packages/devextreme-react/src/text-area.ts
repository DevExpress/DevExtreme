"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTextArea, {
    Properties
} from "devextreme/ui/text_area";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

import type { ChangeEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_area";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITextAreaOptionsNarrowedEvents = {
  onChange?: ((e: ChangeEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onCopy?: ((e: CopyEvent) => void);
  onCut?: ((e: CutEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onEnterKey?: ((e: EnterKeyEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onInput?: ((e: InputEvent) => void);
  onKeyDown?: ((e: KeyDownEvent) => void);
  onKeyUp?: ((e: KeyUpEvent) => void);
  onPaste?: ((e: PasteEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ITextAreaOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ITextAreaOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>

interface TextAreaRef {
  instance: () => dxTextArea;
}

const TextArea = memo(
  forwardRef(
    (props: React.PropsWithChildren<ITextAreaOptions>, ref: ForwardedRef<TextAreaRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onChange","onContentReady","onCopy","onCut","onDisposing","onEnterKey","onFocusIn","onFocusOut","onInitialized","onInput","onKeyDown","onKeyUp","onPaste","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ITextAreaOptions>>, {
          WidgetClass: dxTextArea,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ITextAreaOptions> & { ref?: Ref<TextAreaRef> }) => ReactElement | null;
export default TextArea;
export {
  TextArea,
  ITextAreaOptions,
  TextAreaRef
};
import type * as TextAreaTypes from 'devextreme/ui/text_area_types';
export { TextAreaTypes };

