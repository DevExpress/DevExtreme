/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Nested,
} from '@devextreme-generator/declarations';
import type { UserDefinedElement, DxElement } from '../../../core/element'; // eslint-disable-line import/named
import type { template } from '../../../core/templates/template';

import { BaseWidgetProps } from '../common/base_props';

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps { // js\ui\toolbar.d.ts
  @OneWay() itemHoldTimeout?: number;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  @Nested() items?: (string | ToolbarItem | any)[]; // items?: Array<string | dxToolbarItem | any>;

  /*
  TODO: old API

    dataSource
    disabled
    elementAttr
    height
    hint
    hoverStateEnabled
    itemComponent
    itemHoldTimeout
    itemRender
    itemTemplate
    menuItemComponent
    menuItemRender
    menuItemTemplate
    noDataText
    onContentReady
    onDisposing
    onInitialized
    onItemClick
    onItemContextMenu
    onItemHold
    onItemRendered
    onOptionChanged
    renderAs
    rtlEnabled
    visible
    width

    Methods:

    beginUpdate()
    defaultOptions(rule)
    dispose()
    element()
    endUpdate()
    getDataSource()
    getInstance(element)
    instance()
    off(eventName)
    off(eventName, eventHandler)
    on(eventName, eventHandler)
    on(events)
    option()
    option(optionName)
    option(optionName, optionValue)
    option(options)
    repaint()
    resetOption(optionName)

    Events:
    contentReady
    disposing
    initialized
    itemClick
    itemContextMenu
    itemHold
    itemRendered
    optionChanged
  */
}

@ComponentBindings()
export class CollectionWidgetItem {
  // js\ui\collection\ui.collection_widget.base.d.ts - export interface CollectionWidgetItem {

  @OneWay()
  text?: string;

  @OneWay()
  disabled?: boolean;

  @OneWay()
  html?: string;

  @OneWay()
  visible?: boolean;

  // TODO in react: <Item template={() => (<div>qwe</div>)}/>
  // TODO in react: <Item><div>text8</div></Item>
  // TODO in react: <Item>text8</Item>
  @OneWay()
  template?:
  | template
  | ((
    itemData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    itemIndex: number,
    itemElement: DxElement
  ) => string | UserDefinedElement);
}

@ComponentBindings()
export class ToolbarItem extends CollectionWidgetItem {
  // js\ui\toolbar.d.ts - export interface dxToolbarItem extends CollectionWidgetItem {

  @OneWay()
  cssClass?: string;

  @OneWay()
  locateInMenu?: 'always' | 'auto' | 'never';

  @OneWay()
  location?: 'after' | 'before' | 'center';

  /*
  menuItemTemplate?: template | (() => string | UserDefinedElement);
  options?: any;
  showText?: 'always' | 'inMenu';
  widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox'
    | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
  */
}
