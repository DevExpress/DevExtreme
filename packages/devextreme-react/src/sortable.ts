"use client"
import dxSortable, {
    Properties
} from "devextreme/ui/sortable";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { AddEvent, DisposingEvent, DragChangeEvent, DragEndEvent, DragMoveEvent, DragStartEvent, InitializedEvent, RemoveEvent, ReorderEvent } from "devextreme/ui/sortable";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ISortableOptionsNarrowedEvents = {
  onAdd?: ((e: AddEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onDragChange?: ((e: DragChangeEvent) => void);
  onDragEnd?: ((e: DragEndEvent) => void);
  onDragMove?: ((e: DragMoveEvent) => void);
  onDragStart?: ((e: DragStartEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onRemove?: ((e: RemoveEvent) => void);
  onReorder?: ((e: ReorderEvent) => void);
}

type ISortableOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ISortableOptionsNarrowedEvents> & IHtmlOptions & {
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>

class Sortable extends BaseComponent<React.PropsWithChildren<ISortableOptions>> {

  public get instance(): dxSortable {
    return this._instance;
  }

  protected _WidgetClass = dxSortable;

  protected independentEvents = ["onAdd","onDisposing","onDragChange","onDragEnd","onDragMove","onDragStart","onInitialized","onRemove","onReorder"];

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
(Sortable as any).propTypes = {
  allowDropInsideItem: PropTypes.bool,
  allowReordering: PropTypes.bool,
  autoScroll: PropTypes.bool,
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
  dropFeedbackMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "push",
      "indicate"])
  ]),
  elementAttr: PropTypes.object,
  filter: PropTypes.string,
  group: PropTypes.string,
  handle: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  itemOrientation: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "horizontal",
      "vertical"])
  ]),
  moveItemOnDrop: PropTypes.bool,
  onAdd: PropTypes.func,
  onDisposing: PropTypes.func,
  onDragChange: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragMove: PropTypes.func,
  onDragStart: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onRemove: PropTypes.func,
  onReorder: PropTypes.func,
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
// Sortable
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

export default Sortable;
export {
  Sortable,
  ISortableOptions,
  CursorOffset,
  ICursorOffsetProps
};
import type * as SortableTypes from 'devextreme/ui/sortable_types';
export { SortableTypes };

