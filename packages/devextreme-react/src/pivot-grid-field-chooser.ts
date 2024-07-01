"use client"
import dxPivotGridFieldChooser, {
    Properties
} from "devextreme/ui/pivot_grid_field_chooser";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
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

class PivotGridFieldChooser extends BaseComponent<React.PropsWithChildren<IPivotGridFieldChooserOptions>> {

  public get instance(): dxPivotGridFieldChooser {
    return this._instance;
  }

  protected _WidgetClass = dxPivotGridFieldChooser;

  protected independentEvents = ["onContentReady","onContextMenuPreparing","onDisposing","onInitialized"];

  protected _expectedChildren = {
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    pivotGridFieldChooserTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}
(PivotGridFieldChooser as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowSearch: PropTypes.bool,
  applyChangesMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "instantly",
      "onDemand"])
  ]),
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  encodeHtml: PropTypes.bool,
  focusStateEnabled: PropTypes.bool,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  layout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([
      0,
      1,
      2])
  ]),
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  searchTimeout: PropTypes.number,
  tabIndex: PropTypes.number,
  texts: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


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
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    headerFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// HeaderFilter
type IHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class HeaderFilterTexts extends NestedOption<IHeaderFilterTextsProps> {
  public static OptionName = "texts";
}

// owners:
// PivotGridFieldChooser
type IPivotGridFieldChooserTextsProps = React.PropsWithChildren<{
  allFields?: string;
  columnFields?: string;
  dataFields?: string;
  filterFields?: string;
  rowFields?: string;
}>
class PivotGridFieldChooserTexts extends NestedOption<IPivotGridFieldChooserTextsProps> {
  public static OptionName = "texts";
}

// owners:
// HeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
class Search extends NestedOption<ISearchProps> {
  public static OptionName = "search";
}

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
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = "texts";
}

export default PivotGridFieldChooser;
export {
  PivotGridFieldChooser,
  IPivotGridFieldChooserOptions,
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

