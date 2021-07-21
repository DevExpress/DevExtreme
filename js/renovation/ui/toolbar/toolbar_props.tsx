/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Nested,
} from '@devextreme-generator/declarations';

import { BaseWidgetProps } from '../common/base_props';
import { ToolbarButtonProps } from './toolbar_button_props';

// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import { ItemClickEvent, SelectionChangedEvent } from '../../../ui/button_group';

// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import { ButtonClickEvent } from '../../../ui/drop_down_button';

// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import type { ToolbarButtonGroupProps, ToolbarButtonGroupItemPropsType } from './toolbar_button_group_props';

// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import type { ToolbarDropDownButtonProps, ToolbarDropDownButtonItemPropsType } from './toolbar_dropdown_button';

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps { // js\ui\toolbar.d.ts
  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item text={"text2"}/> </Toolbar>
  // <Toolbar>
  //   { myObjects.foreach(obj => { return (<Item text={ obj.text }/>); }) }
  // </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @Nested() items?: (string | ToolbarItem)[]; // TODO: any

  // TODO: write to us if you need this property
  // dataSource?: string | Array<string | dxToolbarItem | any> |
  // Store | DataSource | DataSourceOptions;
  // @OneWay() dataSource?:
  // | string - TODO: ds = 'a' - no DOM
  // | string[] - TODO: ds = ['a', 'b'] - no DOM
  // | ToolbarItem[] - TODO: ds = [{ widget: 'dxButton', options: { text: '1'} }] - no DOM
  // | any[]
  // | Store - TODO: const ds = new DataSource(new ArrayStore({ data: ['a', 'b'] })); - no DOM
  // | DataSource
  // | DataSourceOptions;

  /*
    TODO

    itemTemplate?: template;

    menuItemTemplate?: template |
      ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);

    CollectionWidgetOptions<dxToolbar> members

  */
}

@ComponentBindings()
export class CollectionWidgetItem {
  // js\ui\collection\ui.collection_widget.base.d.ts - export interface CollectionWidgetItem {

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item>text2</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  text?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', disabled: true }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item disabled>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  disabled?: boolean;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ html: '<h1>text3<h1>' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><h1>text3<h1></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  html?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text5', visible: false }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item visible={false}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  visible?: boolean;

  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={[{ text: 'text5', template: ???? }]} /> - how to use it?
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item>put here your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  // @OneWay()
  // template?:
  // | template;
  // | ((
  //   itemData: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  //   itemIndex: number,
  //   itemElement: DxElement
  // ) => string | UserDefinedElement);
}

// TODO: commented to avoid issues in Vue application
// https://github.com/DevExpress/devextreme-renovation/issues/724
// // TODO: it is not a 'native' way
// @ComponentBindings()
// export class ToolbarTextBoxProps {
//   //
//   // Use cases:
//   //
//   // - in a RenoV component:
//   // <Toolbar items={[{ widget: 'dxTextBox', options: { value: 'my text' } }]} />
//   //
//   @OneWay() value: string | null = '';

//   //
//   // Use cases:
//   //
//   // - in a RenoV component:
//   // <Toolbar
//   //   items={[
//   //     { widget: 'dxTextBox', options: {
//   //        value: 'box1', onValueChanged: () => console.log('hi') }}
//   //   ]}
//   // />
//   //
//   // TODO:  EventCallback<TextBoxValueChanged>
//   //
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   @Event() onValueChanged?: EventCallback<any>;

//   // TODO: other props
// }

// TODO: commented to avoid issues in Vue application
// https://github.com/DevExpress/devextreme-renovation/issues/724
// // TODO: it is not a 'native' way
// // TODO: not used, https://github.com/DevExpress/devextreme-renovation/issues/724
// @ComponentBindings()
// export class ToolbarCheckBoxProps {
//   //
//   // Use cases:
//   //
//   // - in a RenoV component:
//   // <Toolbar items={[{ widget: 'dxTextBox', options: { value: 'my text' } }]} />
//   //
//   @OneWay() value: boolean | null = false;

//   //
//   // Use cases:
//   //
//   // - in a RenoV component:
//   // <Toolbar
//   //   items={[
//   //     { widget: 'dxTextBox', options: {
//   //       value: 'box1', onValueChanged: () => console.log('hi') }}
//   //   ]}
//   // />
//   //
//   // TODO:  EventCallback
//   //
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   @Event() onValueChanged?: EventCallback<any>;

//   // TODO: other props
// }

export type ToolbarWidgetType = 'dxButton' | 'dxCheckBox' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';

export type ToolbarItemOptionType = ToolbarButtonProps
| ToolbarButtonGroupProps | ToolbarDropDownButtonProps;

export type ToolbarShowTextType = 'always' | 'inMenu';

export type ToolbarLocateInMenuType = 'always' | 'auto' | 'never';

export type ToolbarLocationType = 'after' | 'before' | 'center';

@ComponentBindings()
export class ToolbarItem extends CollectionWidgetItem {
  // js\ui\toolbar.d.ts - export interface dxToolbarItem extends CollectionWidgetItem {

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ cssClass: 'my_class' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item cssClass={'my_class'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  cssClass?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text2', locateInMenu: 'always' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item locateInMenu={'always'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  locateInMenu?: ToolbarLocateInMenuType;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', location: 'before' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item location={'before'}>your markup</Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  location?: ToolbarLocationType;

  //
  // Use cases:
  //
  // - in a RenoV component (doesn't look as 'native'):
  // <Toolbar items={[{ widget: 'dxButton' as ToolbarWidgetType }]} />
  // TODO:
  // - Error if used in TestComponent in playground\react with dxAutocomplete | dxDateBox |
  //   dxMenu | dxSelectBox | dxTabs | dxButtonGroup | dxDropDownButton:
  //   TypeError: (0 , _renderer.default)(...)[component] is not a function
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text="My Button" /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  widget?: ToolbarWidgetType;

  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  // TODO: any
  // TODO: ToolbarTextBoxProps | ToolbarCheckBoxProps - errors in Angular
  // see https://github.com/DevExpress/devextreme-renovation/issues/724
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text="My Button" /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @Nested()
  options?: ToolbarItemOptionType;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', showText: 'inMenu' as ToolbarShowTextType }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item><Button text={itemInMenu ? "My Button" : ""} /></Item> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @OneWay()
  showText?: ToolbarShowTextType;

  /*
  TODO:
  menuItemTemplate?: template | (() => string | UserDefinedElement);
  */
}
