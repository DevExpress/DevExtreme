"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxSortable, {
    Properties
} from "devextreme/ui/sortable";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
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
}>

interface SortableRef {
  instance: () => dxSortable;
}

const Sortable = memo(
  forwardRef(
    (props: React.PropsWithChildren<ISortableOptions>, ref: ForwardedRef<SortableRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onAdd","onDisposing","onDragChange","onDragEnd","onDragMove","onDragStart","onInitialized","onRemove","onReorder"]), []);

      const expectedChildren = useMemo(() => ({
        cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "dragTemplate",
          render: "dragRender",
          component: "dragComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ISortableOptions>>, {
          WidgetClass: dxSortable,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ISortableOptions> & { ref?: Ref<SortableRef> }) => ReactElement | null;


// owners:
// Sortable
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentCursorOffset = memo(
  (props: ICursorOffsetProps) => {
    return React.createElement(NestedOption<ICursorOffsetProps>, { ...props });
  }
);

const CursorOffset: typeof _componentCursorOffset & IElementDescriptor = Object.assign(_componentCursorOffset, {
  OptionName: "cursorOffset",
})

export default Sortable;
export {
  Sortable,
  ISortableOptions,
  SortableRef,
  CursorOffset,
  ICursorOffsetProps
};
import type * as SortableTypes from 'devextreme/ui/sortable_types';
export { SortableTypes };

