"use client"
import dxDraggable, {
    Properties
} from "devextreme/ui/draggable";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { DisposingEvent, DragEndEvent, DragMoveEvent, DragStartEvent, InitializedEvent } from "devextreme/ui/draggable";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDraggableOptionsNarrowedEvents = {
  onDisposing?: ((e: DisposingEvent) => void);
  onDragEnd?: ((e: DragEndEvent) => void);
  onDragMove?: ((e: DragMoveEvent) => void);
  onDragStart?: ((e: DragStartEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IDraggableOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IDraggableOptionsNarrowedEvents> & IHtmlOptions & {
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>

class Draggable extends BaseComponent<React.PropsWithChildren<IDraggableOptions>> {

  public get instance(): dxDraggable {
    return this._instance;
  }

  protected _WidgetClass = dxDraggable;

  protected independentEvents = ["onDisposing","onDragEnd","onDragMove","onDragStart","onInitialized"];

  protected _expectedChildren = {
    cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "dragTemplate",
    render: "dragRender",
    component: "dragComponent",
    keyFn: "dragKeyFn"
  }];
}
(Draggable as any).propTypes = {
  autoScroll: PropTypes.bool,
  clone: PropTypes.bool,
  cursorOffset: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  dragDirection: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "both",
      "horizontal",
      "vertical"])
  ]),
  elementAttr: PropTypes.object,
  group: PropTypes.string,
  handle: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  onDisposing: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragStart: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  scrollSensitivity: PropTypes.number,
  scrollSpeed: PropTypes.number,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// Draggable
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

export default Draggable;
export {
  Draggable,
  IDraggableOptions,
  CursorOffset,
  ICursorOffsetProps
};
import type * as DraggableTypes from 'devextreme/ui/draggable_types';
export { DraggableTypes };

