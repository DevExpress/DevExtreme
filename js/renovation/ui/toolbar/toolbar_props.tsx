/* eslint-disable max-classes-per-file */

import {
  ComponentBindings, OneWay, Nested, Event,
} from '@devextreme-generator/declarations';

import { BaseWidgetProps } from '../common/base_props';

@ComponentBindings()
export class ToolbarProps extends BaseWidgetProps { // js\ui\toolbar.d.ts
  // Use cases (see ToolbarItem for more cases):
  //
  // - in a RenoV component:
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar items={[{ text: 'item2' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar items={["text1"]}></Toolbar>
  // <Toolbar> <Item text={"text2"}/> </Toolbar>
  //
  // - TODO: prepare jquery, angular, vue code samples
  //
  @Nested() items?: (string | ToolbarItem)[]; // TODO: any

  /*
    TODO

    dataSource?: string | Array<string | dxToolbarItem | any> |
      Store | DataSource | DataSourceOptions;
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
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item>text2</Item> </Toolbar>
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
  @OneWay()
  disabled?: boolean;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ html: '<h1>text3<h1>' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item><h1>text3<h1></Item> </Toolbar>
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
  @OneWay()
  visible?: boolean;

  //
  // TODO: doesn't work
  //
  // Use cases:
  //
  // - in a RenoV component (not 'native'):
  // <Toolbar items={[{ text: 'text5', template: ???? }]} /> - how to use it?
  //
  // - react (for demo purposes only, will be available in future releases):
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item>put here your markup</Item> </Toolbar>
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
  // - in a RenoV component:
  // <Toolbar items={[{ cssClass: 'my_class' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item cssClass={'my_class'}>your markup</Item> </Toolbar>
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
  @OneWay()
  locateInMenu?: 'always' | 'auto' | 'never';

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', location: 'before' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // <Toolbar> <Item location={'before'}>your markup</Item> </Toolbar>
  //
  @OneWay()
  location?: 'after' | 'before' | 'center';

  //
  // Use cases:
  //
  // - in a RenoV component (not 'native'):
  // <Toolbar items={[{ widget: 'dxButton' }]} />
  // TODO:
  // - Error if used in TestComponent in playground\react with dxAutocomplete | dxDateBox |
  //   dxMenu | dxSelectBox | dxTabs | dxButtonGroup | dxDropDownButton:
  //   TypeError: (0 , _renderer.default)(...)[component] is not a function
  //
  // - react (for demo purposes only, will be available in future releases):
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item><dxButton text="My Button" /></Item> </Toolbar>
  //
  //
  @OneWay()
  widget?: 'dxButton' | 'dxCheckBox' | 'dxTextBox';

  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  // TODO: any
  //
  // - react (for demo purposes only, will be available in future releases):
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item><dxButton text="My Button" /></Item> </Toolbar>
  //
  @Nested()
  options?: ToolbarButtonProps;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ text: 'text4', location: 'before' }]} />
  //
  // - react (for demo purposes only, will be available in future releases):
  // it is not a 'native' way, use this instead:
  // <Toolbar> <Item><dxButton text={itemInMenu ? "My Button" : ""} /></Item> </Toolbar>
  //
  @OneWay()
  showText?: 'always' | 'inMenu';

  /*
  TODO:
  menuItemTemplate?: template | (() => string | UserDefinedElement);
  */
}

// it is not a 'native' way, use this instead:
// <Toolbar> <Item><dxButton text="My Button" /></Item> </Toolbar>
@ComponentBindings()
export class ToolbarButtonProps {
  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { text: 'my button' } }]} />
  //
  @OneWay()
  text?: string;

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[{ widget: 'dxButton', options: { type: 'danger' } }]} />
  //
  @OneWay()
  type?: 'back' | 'danger' | 'default' | 'normal' | 'success';

  //
  // Use cases:
  //
  // - in a RenoV component:
  // <Toolbar items={[
  //   { widget: 'dxButton', options: { text: 'my button', onClick: () => console.log('hi') } }
  // ]} />
  //
  @Event()
  onClick?:
  | (() => void); // TODO: args, return value

  /*
  TODO: many props
  */
}
