/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Nested,
} from '@devextreme-generator/declarations';

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
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar> <Item text={"text2"}/> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //

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
  // - react (for demo purposes only, will be available in future releases):
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
  // - react (for demo purposes only, will be available in future releases):
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
  // - react (for demo purposes only, will be available in future releases):
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
  // - react (for demo purposes only, will be available in future releases):
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
  // - react (for demo purposes only, will be available in future releases):
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

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text4', cssClass: 'my_class' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item text={"text1"} cssClass={'my_class'}/> </Toolbar>
  //
  @OneWay()
  cssClass?: string;

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text2', locateInMenu: 'always' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item text={"text2"} locateInMenu={'always'}/> </Toolbar>
  //
  @OneWay()
  locateInMenu?: 'always' | 'auto' | 'never';

  //
  // Use cases:
  //
  // - renoV syntax:
  // <Toolbar items={[{ text: 'text4', location: 'before' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item text={"text3"} location={'before'}/> </Toolbar>
  //
  @OneWay()
  location?: 'after' | 'before' | 'center';

  /*
  TODO:

  menuItemTemplate?: template | (() => string | UserDefinedElement);
  options?: any;
  showText?: 'always' | 'inMenu';
  widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox'
    | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
  */
}
