"use client"
import dxButtonGroup, {
    Properties
} from "devextreme/ui/button_group";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent } from "devextreme/ui/button_group";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IButtonGroupOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemClick?: ((e: ItemClickEvent) => void);
}

type IButtonGroupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IButtonGroupOptionsNarrowedEvents> & IHtmlOptions & {
  buttonRender?: (...params: any) => React.ReactNode;
  buttonComponent?: React.ComponentType<any>;
  buttonKeyFn?: (data: any) => string;
  defaultSelectedItemKeys?: Array<any>;
  defaultSelectedItems?: Array<any>;
  onSelectedItemKeysChange?: (value: Array<any>) => void;
  onSelectedItemsChange?: (value: Array<any>) => void;
}>

class ButtonGroup extends BaseComponent<React.PropsWithChildren<IButtonGroupOptions>> {

  public get instance(): dxButtonGroup {
    return this._instance;
  }

  protected _WidgetClass = dxButtonGroup;

  protected subscribableOptions = ["selectedItemKeys","selectedItems"];

  protected independentEvents = ["onContentReady","onDisposing","onInitialized","onItemClick"];

  protected _defaults = {
    defaultSelectedItemKeys: "selectedItemKeys",
    defaultSelectedItems: "selectedItems"
  };

  protected _expectedChildren = {
    item: { optionName: "items", isCollectionItem: true }
  };

  protected _templateProps = [{
    tmplOption: "buttonTemplate",
    render: "buttonRender",
    component: "buttonComponent",
    keyFn: "buttonKeyFn"
  }];
}
(ButtonGroup as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  items: PropTypes.array,
  keyExpr: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemClick: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  rtlEnabled: PropTypes.bool,
  selectedItemKeys: PropTypes.array,
  selectedItems: PropTypes.array,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple",
      "none"])
  ]),
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "text",
      "outlined",
      "contained"])
  ]),
  tabIndex: PropTypes.number,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// ButtonGroup
type IItemProps = React.PropsWithChildren<{
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  hint?: string;
  icon?: string;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  type?: "danger" | "default" | "normal" | "success";
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

export default ButtonGroup;
export {
  ButtonGroup,
  IButtonGroupOptions,
  Item,
  IItemProps
};
import type * as ButtonGroupTypes from 'devextreme/ui/button_group_types';
export { ButtonGroupTypes };

