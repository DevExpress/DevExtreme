"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPivotGridFieldChooser, {
    Properties
} from "devextreme/ui/pivot_grid_field_chooser";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/pivot_grid_field_chooser";
import type { HeaderFilterSearchConfig } from "devextreme/common/grids";
import type { SearchMode } from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IPivotGridFieldChooserOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
}

type IPivotGridFieldChooserOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IPivotGridFieldChooserOptionsNarrowedEvents> & IHtmlOptions>

interface PivotGridFieldChooserRef {
  instance: () => dxPivotGridFieldChooser;
}

const PivotGridFieldChooser = memo(
  forwardRef(
    (props: React.PropsWithChildren<IPivotGridFieldChooserOptions>, ref: ForwardedRef<PivotGridFieldChooserRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onContextMenuPreparing","onDisposing","onInitialized"]), []);

      const expectedChildren = useMemo(() => ({
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        pivotGridFieldChooserTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IPivotGridFieldChooserOptions>>, {
          WidgetClass: dxPivotGridFieldChooser,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IPivotGridFieldChooserOptions> & { ref?: Ref<PivotGridFieldChooserRef> }) => ReactElement | null;


// owners:
// PivotGridFieldChooser
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  showRelevantValues?: boolean;
  texts?: Record<string, any> | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  width?: number;
}>
const _componentHeaderFilter = memo(
  (props: IHeaderFilterProps) => {
    return React.createElement(NestedOption<IHeaderFilterProps>, { ...props });
  }
);

const HeaderFilter: typeof _componentHeaderFilter & IElementDescriptor = Object.assign(_componentHeaderFilter, {
  OptionName: "headerFilter",
  ExpectedChildren: {
    headerFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentHeaderFilterTexts = memo(
  (props: IHeaderFilterTextsProps) => {
    return React.createElement(NestedOption<IHeaderFilterTextsProps>, { ...props });
  }
);

const HeaderFilterTexts: typeof _componentHeaderFilterTexts & IElementDescriptor = Object.assign(_componentHeaderFilterTexts, {
  OptionName: "texts",
})

// owners:
// PivotGridFieldChooser
type IPivotGridFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
const _componentPivotGridFieldChooserTexts = memo(
  (props: IPivotGridFieldChooserTextsProps) => {
    return React.createElement(NestedOption<IPivotGridFieldChooserTextsProps>, { ...props });
  }
);

const PivotGridFieldChooserTexts: typeof _componentPivotGridFieldChooserTexts & IElementDescriptor = Object.assign(_componentPivotGridFieldChooserTexts, {
  OptionName: "texts",
})

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentSearch = memo(
  (props: ISearchProps) => {
    return React.createElement(NestedOption<ISearchProps>, { ...props });
  }
);

const Search: typeof _componentSearch & IElementDescriptor = Object.assign(_componentSearch, {
  OptionName: "search",
})

// owners:
// HeaderFilter
// PivotGridFieldChooser
type ITextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
const _componentTexts = memo(
  (props: ITextsProps) => {
    return React.createElement(NestedOption<ITextsProps>, { ...props });
  }
);

const Texts: typeof _componentTexts & IElementDescriptor = Object.assign(_componentTexts, {
  OptionName: "texts",
})

export default PivotGridFieldChooser;
export {
  PivotGridFieldChooser,
  IPivotGridFieldChooserOptions,
  PivotGridFieldChooserRef,
  HeaderFilter,
  IHeaderFilterProps,
  HeaderFilterTexts,
  IHeaderFilterTextsProps,
  PivotGridFieldChooserTexts,
  IPivotGridFieldChooserTextsProps,
  Search,
  ISearchProps,
  Texts,
  ITextsProps
};
import type * as PivotGridFieldChooserTypes from 'devextreme/ui/pivot_grid_field_chooser_types';
export { PivotGridFieldChooserTypes };

