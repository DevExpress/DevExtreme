import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxToolbarModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxResizableModule,
  DxDropDownButtonModule,
  DxButtonGroupModule,
  DxCheckBoxModule,
  DxRadioGroupModule,
} from 'devextreme-angular';

import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import {
  FontFamilies,
  FontSize,
  FontStyle,
  LineHeight,
  ListType,
  Service,
  TextAlign,
  TextAlignExtended,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  toolbarLineModes = [
    {
      text: 'Multiline mode',
      value: true,
    },
    {
      text: 'Singleline mode',
      value: false,
    },
  ];

  multiline = true;

  fontSizes: FontSize[] = this.service.getFontSizes();

  lineHeights: LineHeight[] = this.service.getLineHeights();

  lineHeight: number[] = [this.lineHeights[1].lineHeight];

  fontFamilies: FontFamilies[] = this.service.getFontFamilies();

  fontStyles: FontStyle[] = this.service.getFontStyles();

  textAlignItems: TextAlign[] = this.service.getTextAlign();

  textAlignItemsExtended: TextAlignExtended[] = this.service.getTextAlignExtended();

  selectedTextAlign: string[] = [this.textAlignItems[0].alignment];

  listTypes: ListType[] = this.service.getListType();

  undoButtonOptions = {
    icon: 'undo',
    onClick: () => {
      notify('Undo button has been clicked!');
    },
  };

  redoButtonOptions = {
    icon: 'redo',
    onClick: () => {
      notify('Redo button has been clicked!');
    },
  };

  fontSizeOptions = {
    width: '100%',
    displayExpr: 'text',
    keyExpr: 'size',
    useSelectMode: true,
    items: this.fontSizes,
    selectedItemKey: this.fontSizes[2].size,
    itemTemplate: 'fontSizeTemplate',
    onSelectionChanged: (): void => {
      notify('Font size value has been changed!');
    },
  };

  lineHeightOptions = {
    width: '100%',
    icon: 'indent',
    displayExpr: 'text',
    keyExpr: 'lineHeight',
    useSelectMode: true,
    items: this.lineHeights,
    selectedItemKey: this.lineHeight,
    onSelectionChanged: (): void => {
      notify('Line height value has been changed!');
    },
  };

  fontFamilyOptions = {
    placeholder: 'Font',
    displayExpr: 'text',
    dataSource: new DataSource(this.fontFamilies),
  };

  fontStyleOptions = {
    displayExpr: 'text',
    items: this.fontStyles,
    keyExpr: 'style',
    stylingMode: 'outlined',
    selectionMode: 'multiple',
    onItemClick: this.onItemClick,
  };

  listOptions = {
    items: this.listTypes,
    keyExpr: 'alignment',
    stylingMode: 'outlined',
    onItemClick: this.onItemClick,
  };

  dateBoxOptions = {
    width: 200,
    type: 'date',
    value: new Date(2022, 9, 7),
  };

  checkBoxOptions = {
    value: false,
    text: 'Checkbox text',
    onOptionChanged: (): void => {
      notify('Checkbox value has been changed!');
    },
  };

  attachButtonOptions = {
    icon: 'attach',
    text: 'Attach',
    onClick: (): void => {
      notify('Attach button has been clicked!');
    },
  };

  addButtonOptions = {
    icon: 'add',
    text: 'Add',
    onClick: (): void => {
      notify('Add button has been clicked!');
    },
  };

  removeButtonOptions = {
    icon: 'trash',
    text: 'Remove',
    onClick: (): void => {
      notify('Remove button has been clicked!');
    },
  };

  aboutButtonOptions = {
    icon: 'help',
    text: 'About',
    onClick: (): void => {
      notify('About button has been clicked!');
    },
  };

  constructor(private service: Service) {}

  onItemClick(e: { itemData: { hint: string } }): void {
    notify(`The "${e.itemData.hint}" button was clicked`);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxToolbarModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxResizableModule,
    DxDropDownButtonModule,
    DxButtonGroupModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
