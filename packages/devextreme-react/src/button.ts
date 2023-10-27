"use client"
import dxButton, {
    Properties
} from "devextreme/ui/button";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/button";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IButtonOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IButtonOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IButtonOptionsNarrowedEvents> & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>

class Button extends BaseComponent<React.PropsWithChildren<IButtonOptions>> {

  public get instance(): dxButton {
    return this._instance;
  }

  protected _WidgetClass = dxButton;

  protected independentEvents = ["onClick","onContentReady","onDisposing","onInitialized"];

  protected _templateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}
(Button as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "text",
      "outlined",
      "contained"])
  ]),
  tabIndex: PropTypes.number,
  text: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "danger",
      "default",
      "normal",
      "success"])
  ]),
  useSubmitBehavior: PropTypes.bool,
  validationGroup: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default Button;
export {
  Button,
  IButtonOptions
};
import type * as ButtonTypes from 'devextreme/ui/button_types';
export { ButtonTypes };

