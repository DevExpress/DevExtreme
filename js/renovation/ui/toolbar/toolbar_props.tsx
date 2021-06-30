/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Nested,
} from '@devextreme-generator/declarations';
import type { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import type { template } from '../../../core/templates/template';

import { BaseWidgetProps } from '../common/base_props';

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps { // js\ui\toolbar.d.ts
  @OneWay() itemHoldTimeout?: number;

  // Use cases (see ToolbarItem for more cases):
  //
  // - renoV syntax:
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react:
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar> <Item text={"text2"}/> </Toolbar>

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  @Nested() items?: (string | ToolbarItem | any)[];

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

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react:
  // <Toolbar> <Item text={"text2"}/> </Toolbar>
  //
  @OneWay()
  text?: string;

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text4', disabled: true }]} />
  //
  // - react:
  // <Toolbar> <Item text={"text4"} disabled /> </Toolbar>
  //
  @OneWay()
  disabled?: boolean;

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ html: '<h1>text3<h1>' }]} />
  //
  // - react:
  // <Toolbar> <Item html={"<h1>text3<h1>"}/> </Toolbar>
  //
  @OneWay()
  html?: string;

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text5', visible: false }]} />
  //
  // - react:
  // <Toolbar> <Item text={"text5"} visible={false} /> </Toolbar>
  //
  @OneWay()
  visible?: boolean;

  //
  // TODO: doesn't work
  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text5', template: ???? }]} /> - how to use it?
  //
  // - react:
  // <Toolbar> <Item>text5</Item> </Toolbar> - 'text5' DOM element is not created
  //
  // @OneWay()
  // template?:
  // | template
  // | ((
  //   itemData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  //   itemIndex: number,
  //   itemElement: DxElement
  // ) => string | UserDefinedElement);
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

  @OneWay()
  menuItemTemplate?: template | (() => string | UserDefinedElement);

  /*
  ? menuItemTemplate?: template | (() => string | UserDefinedElement);
  options?: any;
  showText?: 'always' | 'inMenu';
  widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox'
    | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
  */
}
