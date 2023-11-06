"use client"
export { ExplicitTypes } from "devextreme/ui/validation_summary";
import dxValidationSummary, {
    Properties
} from "devextreme/ui/validation_summary";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent } from "devextreme/ui/validation_summary";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IValidationSummaryOptionsNarrowedEvents<TItem = any, TKey = any> = {
  onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
  onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
}

type IValidationSummaryOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IValidationSummaryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TItem, TKey>["dataSource"];
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  defaultItems?: Array<any | CollectionWidgetItem | string>;
  onItemsChange?: (value: Array<any | CollectionWidgetItem | string>) => void;
}>

class ValidationSummary<TItem = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IValidationSummaryOptions<TItem, TKey>>> {

  public get instance(): dxValidationSummary<TItem, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxValidationSummary;

  protected subscribableOptions = ["items"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick"];

  protected _defaults = {
    defaultItems: "items"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }];
}
(ValidationSummary as any).propTypes = {
  elementAttr: PropTypes.object,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  validationGroup: PropTypes.string
};


// owners:
// ValidationSummary
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  html?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

export default ValidationSummary;
export {
  ValidationSummary,
  IValidationSummaryOptions,
  Item,
  IItemProps
};
import type * as ValidationSummaryTypes from 'devextreme/ui/validation_summary_types';
export { ValidationSummaryTypes };

