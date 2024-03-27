"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxTextBox, {
    Properties
} from "devextreme/ui/text_box";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ChangeEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, PasteEvent, ValueChangedEvent } from "devextreme/ui/text_box";
import type { ContentReadyEvent as ButtonContentReadyEvent, DisposingEvent as ButtonDisposingEvent, InitializedEvent as ButtonInitializedEvent, dxButtonOptions, ClickEvent, OptionChangedEvent } from "devextreme/ui/button";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ITextBoxOptionsNarrowedEvents = {
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

type ITextBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ITextBoxOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}>

interface TextBoxRef {
  instance: () => dxTextBox;
}

const TextBox = memo(
  forwardRef(
    (props: React.PropsWithChildren<ITextBoxOptions>, ref: ForwardedRef<TextBoxRef>) => {
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

      const expectedChildren = useMemo(() => ({
        button: { optionName: "buttons", isCollectionItem: true }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ITextBoxOptions>>, {
          WidgetClass: dxTextBox,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ITextBoxOptions> & { ref?: Ref<TextBoxRef> }) => ReactElement | null;


// owners:
// TextBox
type IButtonProps = React.PropsWithChildren<{
  location?: "after" | "before";
  name?: string;
  options?: dxButtonOptions;
}>
const _componentButton = memo(
  (props: IButtonProps) => {
    return React.createElement(NestedOption<IButtonProps>, { ...props });
  }
);

const Button: typeof _componentButton & IElementDescriptor = Object.assign(_componentButton, {
  OptionName: "buttons",
  IsCollectionItem: true,
  ExpectedChildren: {
    options: { optionName: "options", isCollectionItem: false }
  },
})

// owners:
// Button
type IOptionsProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  bindingOptions?: Record<string, any>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  icon?: string;
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ButtonContentReadyEvent) => void);
  onDisposing?: ((e: ButtonDisposingEvent) => void);
  onInitialized?: ((e: ButtonInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  rtlEnabled?: boolean;
  stylingMode?: "text" | "outlined" | "contained";
  tabIndex?: number;
  template?: ((buttonData: { icon: string, text: string }, contentElement: any) => string | any) | template;
  text?: string;
  type?: "danger" | "default" | "normal" | "success";
  useSubmitBehavior?: boolean;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentOptions = memo(
  (props: IOptionsProps) => {
    return React.createElement(NestedOption<IOptionsProps>, { ...props });
  }
);

const Options: typeof _componentOptions & IElementDescriptor = Object.assign(_componentOptions, {
  OptionName: "options",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

export default TextBox;
export {
  TextBox,
  ITextBoxOptions,
  TextBoxRef,
  Button,
  IButtonProps,
  Options,
  IOptionsProps
};
import type * as TextBoxTypes from 'devextreme/ui/text_box_types';
export { TextBoxTypes };

