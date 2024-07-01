"use client"
import dxSpeedDialAction, {
    Properties
} from "devextreme/ui/speed_dial_action";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { ClickEvent, ContentReadyEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/speed_dial_action";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISpeedDialActionOptionsNarrowedEvents = {
  onClick?: ((e: ClickEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type ISpeedDialActionOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISpeedDialActionOptionsNarrowedEvents> & IHtmlOptions>

class SpeedDialAction extends BaseComponent<React.PropsWithChildren<ISpeedDialActionOptions>> {

  public get instance(): dxSpeedDialAction {
    return this._instance;
  }

  protected _WidgetClass = dxSpeedDialAction;

  protected independentEvents = ["onClick","onContentReady","onDisposing","onInitialized"];
}
(SpeedDialAction as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  icon: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string,
  onClick: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  visible: PropTypes.bool
};
export default SpeedDialAction;
export {
  SpeedDialAction,
  ISpeedDialActionOptions
};
import type * as SpeedDialActionTypes from 'devextreme/ui/speed_dial_action_types';
export { SpeedDialActionTypes };

