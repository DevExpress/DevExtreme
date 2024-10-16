import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import TextBox, { Properties } from "devextreme/ui/text_box";
import {
 TextBoxPredefinedButton,
 LabelMode,
 MaskMode,
 EditorStyle,
 ValidationMessageMode,
 Position,
 ValidationStatus,
 TextEditorButtonLocation,
 ButtonStyle,
 ButtonType,
} from "devextreme/common";
import {
 TextBoxType,
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
} from "devextreme/ui/text_box";
import {
 ClickEvent,
 ContentReadyEvent as ButtonContentReadyEvent,
 DisposingEvent as ButtonDisposingEvent,
 InitializedEvent as ButtonInitializedEvent,
 OptionChangedEvent as ButtonOptionChangedEvent,
} from "devextreme/ui/button";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "buttons" |
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
  "mask" |
  "maskChar" |
  "maskInvalidMessage" |
  "maskRules" |
  "maxLength" |
  "mode" |
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
  "showClearButton" |
  "showMaskMode" |
  "spellcheck" |
  "stylingMode" |
  "tabIndex" |
  "text" |
  "useMaskedValue" |
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

interface DxTextBox extends AccessibleOptions {
  readonly instance?: TextBox;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    buttons: Array as PropType<Array<string | TextBoxPredefinedButton | Object>>,
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
    labelMode: String as PropType<LabelMode>,
    mask: String,
    maskChar: String,
    maskInvalidMessage: String,
    maskRules: {},
    maxLength: [Number, String],
    mode: String as PropType<TextBoxType>,
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
    showClearButton: Boolean,
    showMaskMode: String as PropType<MaskMode>,
    spellcheck: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    text: String,
    useMaskedValue: Boolean,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Position>,
    validationStatus: String as PropType<ValidationStatus>,
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
    "update:buttons": null,
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
    "update:mask": null,
    "update:maskChar": null,
    "update:maskInvalidMessage": null,
    "update:maskRules": null,
    "update:maxLength": null,
    "update:mode": null,
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
    "update:showClearButton": null,
    "update:showMaskMode": null,
    "update:spellcheck": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:text": null,
    "update:useMaskedValue": null,
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
    instance(): TextBox {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = TextBox;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      button: { isCollectionItem: true, optionName: "buttons" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxTextBox = defineComponent(componentConfig);


const DxButtonConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
  },
  props: {
    location: String as PropType<TextEditorButtonLocation>,
    name: String,
    options: Object
  }
};

prepareConfigurationComponentConfig(DxButtonConfig);

const DxButton = defineComponent(DxButtonConfig);

(DxButton as any).$_optionName = "buttons";
(DxButton as any).$_isCollectionItem = true;
(DxButton as any).$_expectedChildren = {
  options: { isCollectionItem: false, optionName: "options" }
};

const DxOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    bindingOptions: Object,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function as PropType<(e: ClickEvent) => void>,
    onContentReady: Function as PropType<(e: ButtonContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: ButtonDisposingEvent) => void>,
    onInitialized: Function as PropType<(e: ButtonInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: ButtonOptionChangedEvent) => void>,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<ButtonStyle>,
    tabIndex: Number,
    template: {},
    text: String,
    type: String as PropType<ButtonType>,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxOptionsConfig);

const DxOptions = defineComponent(DxOptionsConfig);

(DxOptions as any).$_optionName = "options";

export default DxTextBox;
export {
  DxTextBox,
  DxButton,
  DxOptions
};
import type * as DxTextBoxTypes from "devextreme/ui/text_box_types";
export { DxTextBoxTypes };
