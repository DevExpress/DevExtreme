"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSpeechToText, {
    Properties
} from "devextreme/ui/speech_to_text";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, ErrorEvent, InitializedEvent, ResultEvent, StartClickEvent, StopClickEvent } from "devextreme/ui/speech_to_text";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISpeechToTextOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onError?: ((e: ErrorEvent) => void) | undefined;
  onInitialized?: ((e: InitializedEvent) => void);
  onResult?: ((e: ResultEvent) => void) | undefined;
  onStartClick?: ((e: StartClickEvent) => void) | undefined;
  onStopClick?: ((e: StopClickEvent) => void) | undefined;
}

type ISpeechToTextOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISpeechToTextOptionsNarrowedEvents> & IHtmlOptions>

interface SpeechToTextRef {
  instance: () => dxSpeechToText;
}

const SpeechToText = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISpeechToTextOptions>, ref: ForwardedRef<SpeechToTextRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), []);

      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onError","onInitialized","onResult","onStartClick","onStopClick"]), []);

      const expectedChildren = useMemo(() => ({
        customSpeechRecognizer: { optionName: "customSpeechRecognizer", isCollectionItem: false },
        speechRecognitionConfig: { optionName: "speechRecognitionConfig", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISpeechToTextOptions>>, {
          WidgetClass: dxSpeechToText,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISpeechToTextOptions> & { ref?: Ref<SpeechToTextRef> }) => ReactElement | null;


// owners:
// SpeechToText
type ICustomSpeechRecognizerProps = React.PropsWithChildren<{
  enabled?: boolean;
  isListening?: boolean;
}>
const _componentCustomSpeechRecognizer = (props: ICustomSpeechRecognizerProps) => {
  return React.createElement(NestedOption<ICustomSpeechRecognizerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "customSpeechRecognizer",
    },
  });
};

const CustomSpeechRecognizer = Object.assign<typeof _componentCustomSpeechRecognizer, NestedComponentMeta>(_componentCustomSpeechRecognizer, {
  componentType: "option",
});

// owners:
// SpeechToText
type ISpeechRecognitionConfigProps = React.PropsWithChildren<{
  continuous?: boolean;
  grammars?: Array<string>;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}>
const _componentSpeechRecognitionConfig = (props: ISpeechRecognitionConfigProps) => {
  return React.createElement(NestedOption<ISpeechRecognitionConfigProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "speechRecognitionConfig",
    },
  });
};

const SpeechRecognitionConfig = Object.assign<typeof _componentSpeechRecognitionConfig, NestedComponentMeta>(_componentSpeechRecognitionConfig, {
  componentType: "option",
});

export default SpeechToText;
export {
  SpeechToText,
  ISpeechToTextOptions,
  SpeechToTextRef,
  CustomSpeechRecognizer,
  ICustomSpeechRecognizerProps,
  SpeechRecognitionConfig,
  ISpeechRecognitionConfigProps
};
import type * as SpeechToTextTypes from 'devextreme/ui/speech_to_text_types';
export { SpeechToTextTypes };

