"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPagination, {
    Properties
} from "devextreme/ui/pagination";

import { Component as BaseComponent, IHtmlOptions, ComponentRef } from "./core/component";

type IPaginationOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultPageIndex?: number;
  defaultPageSize?: number;
  onPageIndexChange?: (value: number) => void;
  onPageSizeChange?: (value: number) => void;
}>

interface PaginationRef {
  instance: () => dxPagination;
}

const Pagination = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPaginationOptions>, ref: ForwardedRef<PaginationRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["pageIndex","pageSize"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onInitialized"]), []);

      const defaults = useMemo(() => ({
        defaultPageIndex: "pageIndex",
        defaultPageSize: "pageSize",
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IPaginationOptions>>, {
          WidgetClass: dxPagination,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IPaginationOptions> & { ref?: Ref<PaginationRef> }) => ReactElement | null;
export default Pagination;
export {
  Pagination,
  IPaginationOptions,
  PaginationRef
};
import type * as PaginationTypes from 'devextreme/ui/pagination_types';
export { PaginationTypes };

