"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxPivotGridFieldChooser, {
    Properties
} from "devextreme/ui/pivot_grid_field_chooser";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuPreparingEvent, DisposingEvent, InitializedEvent } from "devextreme/ui/pivot_grid_field_chooser";
import type { HeaderFilterSearchConfig } from "devextreme/common/grids";

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
const _componentHeaderFilter = (props: IHeaderFilterProps) => {
  return React.createElement(NestedOption<IHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        headerFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentHeaderFilterTexts = (props: IHeaderFilterTextsProps) => {
  return React.createElement(NestedOption<IHeaderFilterTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const HeaderFilterTexts = Object.assign<typeof _componentHeaderFilterTexts, NestedComponentMeta>(_componentHeaderFilterTexts, {
  componentType: "option",
});

// owners:
// PivotGridFieldChooser
type IPivotGridFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
const _componentPivotGridFieldChooserTexts = (props: IPivotGridFieldChooserTextsProps) => {
  return React.createElement(NestedOption<IPivotGridFieldChooserTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const PivotGridFieldChooserTexts = Object.assign<typeof _componentPivotGridFieldChooserTexts, NestedComponentMeta>(_componentPivotGridFieldChooserTexts, {
  componentType: "option",
});

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
const _componentSearch = (props: ISearchProps) => {
  return React.createElement(NestedOption<ISearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const Search = Object.assign<typeof _componentSearch, NestedComponentMeta>(_componentSearch, {
  componentType: "option",
});

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
const _componentTexts = (props: ITextsProps) => {
  return React.createElement(NestedOption<ITextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const Texts = Object.assign<typeof _componentTexts, NestedComponentMeta>(_componentTexts, {
  componentType: "option",
});

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

