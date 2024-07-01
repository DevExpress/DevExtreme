"use client"
import dxResizable, {
    Properties
} from "devextreme/ui/resizable";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { DisposingEvent, InitializedEvent, ResizeEvent, ResizeEndEvent, ResizeStartEvent } from "devextreme/ui/resizable";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IResizableOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onResize?: ((e: ResizeEvent) => void);
  onResizeEnd?: ((e: ResizeEndEvent) => void);
  onResizeStart?: ((e: ResizeStartEvent) => void);
}

type IResizableOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IResizableOptionsNarrowedEvents> & IHtmlOptions & {
  defaultHeight?: (() => number | string) | number | string;
  defaultWidth?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
}>

class Resizable extends BaseComponent<React.PropsWithChildren<IResizableOptions>> {

  public get instance(): dxResizable {
    return this._instance;
  }

  protected _WidgetClass = dxResizable;

  protected subscribableOptions = ["height","width"];

  protected independentEvents = ["onDisposing","onInitialized","onResize","onResizeEnd","onResizeStart"];

  protected _defaults = {
    defaultHeight: "height",
    defaultWidth: "width"
  };
}
(Resizable as any).propTypes = {
  elementAttr: PropTypes.object,
  handles: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top",
      "all"])
  ]),
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  keepAspectRatio: PropTypes.bool,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  minWidth: PropTypes.number,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  onResizeStart: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default Resizable;
export {
  Resizable,
  IResizableOptions
};
import type * as ResizableTypes from 'devextreme/ui/resizable_types';
export { ResizableTypes };

