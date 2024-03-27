"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDraggable, {
    Properties
} from "devextreme/ui/draggable";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
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
}>

interface DraggableRef {
  instance: () => dxDraggable;
}

const Draggable = memo(
  forwardRef(
    (props: React.PropsWithChildren<IDraggableOptions>, ref: ForwardedRef<DraggableRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onDisposing","onDragEnd","onDragMove","onDragStart","onInitialized"]), []);

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
        React.createElement(BaseComponent<React.PropsWithChildren<IDraggableOptions>>, {
          WidgetClass: dxDraggable,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IDraggableOptions> & { ref?: Ref<DraggableRef> }) => ReactElement | null;


// owners:
// Draggable
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

export default Draggable;
export {
  Draggable,
  IDraggableOptions,
  DraggableRef,
  CursorOffset,
  ICursorOffsetProps
};
import type * as DraggableTypes from 'devextreme/ui/draggable_types';
export { DraggableTypes };

