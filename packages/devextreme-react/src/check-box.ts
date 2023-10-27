"use client"
import dxCheckBox, {
    Properties
} from "devextreme/ui/check_box";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ValueChangedEvent } from "devextreme/ui/check_box";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICheckBoxOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type ICheckBoxOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICheckBoxOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: boolean | null;
  onValueChange?: (value: boolean | null) => void;
}>

class CheckBox extends BaseComponent<React.PropsWithChildren<ICheckBoxOptions>> {

  public get instance(): dxCheckBox {
    return this._instance;
  }

  protected _WidgetClass = dxCheckBox;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };
}
(CheckBox as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  enableThreeStateBehavior: PropTypes.bool,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  iconSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  name: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default CheckBox;
export {
  CheckBox,
  ICheckBoxOptions
};
import type * as CheckBoxTypes from 'devextreme/ui/check_box_types';
export { CheckBoxTypes };

