"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxCardView, {
    Properties
} from "devextreme/ui/card_view";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

type ICardViewOptions = React.PropsWithChildren<Properties & IHtmlOptions>

interface CardViewRef {
  instance: () => dxCardView;
}

const CardView = memo(
  forwardRef(
    (props: React.PropsWithChildren<ICardViewOptions>, ref: ForwardedRef<CardViewRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized"]), []);

      const expectedChildren = useMemo(() => ({
        paging: { optionName: "paging", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<ICardViewOptions>>, {
          WidgetClass: dxCardView,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<ICardViewOptions> & { ref?: Ref<CardViewRef> }) => ReactElement | null;


// owners:
// CardView
type IPagingProps = React.PropsWithChildren<{
  pageIndex?: number;
  pageSize?: number;
}>
const _componentPaging = (props: IPagingProps) => {
  return React.createElement(NestedOption<IPagingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "paging",
    },
  });
};

const Paging = Object.assign<typeof _componentPaging, NestedComponentMeta>(_componentPaging, {
  componentType: "option",
});

export default CardView;
export {
  CardView,
  ICardViewOptions,
  CardViewRef,
  Paging,
  IPagingProps
};
import type * as CardViewTypes from 'devextreme/ui/card_view_types';
export { CardViewTypes };

