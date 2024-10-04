import { PropType } from "vue";
import TextArea, { Properties } from "devextreme/ui/text_area";
import { 
LabelMode,
EditorStyle,
ValidationMessageMode,
Position,
ValidationStatus,
 } from "devextreme/common";
import { 
ChangeEvent,
ContentReadyEvent,
CopyEvent,
CutEvent,
DisposingEvent,
EnterKeyEvent,
FocusInEvent,
FocusOutEvent,
InitializedEvent,
InputEvent,
KeyDownEvent,
KeyUpEvent,
OptionChangedEvent,
PasteEvent,
ValueChangedEvent,
 } from "devextreme/ui/text_area";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "autoResizeEnabled" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "isDirty" |
  "isValid" |
  "label" |
  "labelMode" |
  "maxHeight" |
  "maxLength" |
  "minHeight" |
  "name" |
  "onChange" |
  "onContentReady" |
  "onCopy" |
  "onCut" |
  "onDisposing" |
  "onEnterKey" |
  "onFocusIn" |
  "onFocusOut" |
  "onInitialized" |
  "onInput" |
  "onKeyDown" |
  "onKeyUp" |
  "onOptionChanged" |
  "onPaste" |
  "onValueChanged" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "spellcheck" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "valueChangeEvent" |
  "visible" |
  "width"
>;

interface DxTextArea extends AccessibleOptions {
  readonly instance?: TextArea;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    autoResizeEnabled: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    isDirty: Boolean,
    isValid: Boolean,
    label: String,
    labelMode: Object as PropType<LabelMode>,
    maxHeight: [Number, String],
    maxLength: [Number, String],
    minHeight: [Number, String],
    name: String,
    onChange: Function as PropType<(e: ChangeEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onCopy: Function as PropType<(e: CopyEvent) => void>,
    onCut: Function as PropType<(e: CutEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onEnterKey: Function as PropType<(e: EnterKeyEvent) => void>,
    onFocusIn: Function as PropType<(e: FocusInEvent) => void>,
    onFocusOut: Function as PropType<(e: FocusOutEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onInput: Function as PropType<(e: InputEvent) => void>,
    onKeyDown: Function as PropType<(e: KeyDownEvent) => void>,
    onKeyUp: Function as PropType<(e: KeyUpEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onPaste: Function as PropType<(e: PasteEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    spellcheck: Boolean,
    stylingMode: Object as PropType<EditorStyle>,
    tabIndex: Number,
    text: String,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: Object as PropType<ValidationMessageMode>,
    validationMessagePosition: Object as PropType<Position>,
    validationStatus: Object as PropType<ValidationStatus>,
    value: String,
    valueChangeEvent: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:autoResizeEnabled": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:label": null,
    "update:labelMode": null,
    "update:maxHeight": null,
    "update:maxLength": null,
    "update:minHeight": null,
    "update:name": null,
    "update:onChange": null,
    "update:onContentReady": null,
    "update:onCopy": null,
    "update:onCut": null,
    "update:onDisposing": null,
    "update:onEnterKey": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onInput": null,
    "update:onKeyDown": null,
    "update:onKeyUp": null,
    "update:onOptionChanged": null,
    "update:onPaste": null,
    "update:onValueChanged": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:spellcheck": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:valueChangeEvent": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): TextArea {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TextArea;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxTextArea = defineComponent(componentConfig);

export default DxTextArea;
export {
  DxTextArea
};
import type * as DxTextAreaTypes from "devextreme/ui/text_area_types";
export { DxTextAreaTypes };
