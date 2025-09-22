import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import SpeechToText, { Properties } from "devextreme/ui/speech_to_text";
import {
 CustomSpeechRecognizer,
 ContentReadyEvent,
 DisposingEvent,
 ErrorEvent,
 InitializedEvent,
 OptionChangedEvent,
 ResultEvent,
 StartClickEvent,
 StopClickEvent,
 WebSpeechApiConfig,
} from "devextreme/ui/speech_to_text";
import {
 ButtonStyle,
 ButtonType,
} from "devextreme/common";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "customSpeechRecognizer" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "onContentReady" |
  "onDisposing" |
  "onError" |
  "onInitialized" |
  "onOptionChanged" |
  "onResult" |
  "onStartClick" |
  "onStopClick" |
  "rtlEnabled" |
  "startIcon" |
  "startText" |
  "stopIcon" |
  "stopText" |
  "stylingMode" |
  "tabIndex" |
  "type" |
  "visible" |
  "webSpeechApiConfig" |
  "width"
>;

interface DxSpeechToText extends AccessibleOptions {
  readonly instance?: SpeechToText;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    customSpeechRecognizer: Object as PropType<CustomSpeechRecognizer | Record<string, any>>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onError: Function as PropType<((e: ErrorEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onResult: Function as PropType<((e: ResultEvent) => void)>,
    onStartClick: Function as PropType<((e: StartClickEvent) => void)>,
    onStopClick: Function as PropType<((e: StopClickEvent) => void)>,
    rtlEnabled: Boolean,
    startIcon: String,
    startText: String,
    stopIcon: String,
    stopText: String,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    type: String as PropType<ButtonType | string>,
    visible: Boolean,
    webSpeechApiConfig: Object as PropType<Record<string, any> | WebSpeechApiConfig>,
    width: [Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:customSpeechRecognizer": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onError": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResult": null,
    "update:onStartClick": null,
    "update:onStopClick": null,
    "update:rtlEnabled": null,
    "update:startIcon": null,
    "update:startText": null,
    "update:stopIcon": null,
    "update:stopText": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:type": null,
    "update:visible": null,
    "update:webSpeechApiConfig": null,
    "update:width": null,
  },
  computed: {
    instance(): SpeechToText {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = SpeechToText;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      customSpeechRecognizer: { isCollectionItem: false, optionName: "customSpeechRecognizer" },
      webSpeechApiConfig: { isCollectionItem: false, optionName: "webSpeechApiConfig" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxSpeechToText = defineComponent(componentConfig);


const DxCustomSpeechRecognizerConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:isListening": null,
  },
  props: {
    enabled: Boolean,
    isListening: Boolean
  }
};

prepareConfigurationComponentConfig(DxCustomSpeechRecognizerConfig);

const DxCustomSpeechRecognizer = defineComponent(DxCustomSpeechRecognizerConfig);

(DxCustomSpeechRecognizer as any).$_optionName = "customSpeechRecognizer";

const DxWebSpeechApiConfigConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:continuous": null,
    "update:grammars": null,
    "update:interimResults": null,
    "update:lang": null,
    "update:maxAlternatives": null,
  },
  props: {
    continuous: Boolean,
    grammars: Array as PropType<Array<string>>,
    interimResults: Boolean,
    lang: String,
    maxAlternatives: Number
  }
};

prepareConfigurationComponentConfig(DxWebSpeechApiConfigConfig);

const DxWebSpeechApiConfig = defineComponent(DxWebSpeechApiConfigConfig);

(DxWebSpeechApiConfig as any).$_optionName = "webSpeechApiConfig";

export default DxSpeechToText;
export {
  DxSpeechToText,
  DxCustomSpeechRecognizer,
  DxWebSpeechApiConfig
};
import type * as DxSpeechToTextTypes from "devextreme/ui/speech_to_text_types";
export { DxSpeechToTextTypes };
