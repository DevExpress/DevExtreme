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
      text: 'Single-line mode',
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
    onClick: (): void => {
      this.onButtonClick('Undo');
    },
  };

  redoButtonOptions = {
    icon: 'redo',
    onClick: (): void => {
      this.onButtonClick('Redo');
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
      this.onSelectionChanged('Font Size');
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
      this.onSelectionChanged('Line Height');
    },
  };

  fontFamilyOptions = {
    placeholder: 'Font',
    displayExpr: 'text',
    dataSource: new DataSource(this.fontFamilies),
    onItemClick: (): void => {
      this.onFontFamilyClick();
    },
  };

  fontStyleOptions = {
    displayExpr: 'text',
    items: this.fontStyles,
    keyExpr: 'icon',
    stylingMode: 'outlined',
    selectionMode: 'multiple',
    onItemClick: (e: { itemData: { hint: string } }) => {
      this.onButtonClick(e.itemData.hint);
    },
  };

  listOptions = {
    items: this.listTypes,
    keyExpr: 'alignment',
    stylingMode: 'outlined',
    onItemClick: (e: { itemData: { hint: string } }) => {
      this.onButtonClick(e.itemData.hint);
    },
  };

  dateBoxOptions = {
    width: 200,
    type: 'date',
    value: new Date(2022, 9, 7),
    onValueChanged: (): void => {
      this.onDateBoxValueChanged();
    },
  };

  checkBoxOptions = {
    value: false,
    text: 'Navigation Pane',
    onOptionChanged: (): void => {
      this.onCheckBoxValueChanged();
    },
  };

  attachButtonOptions = {
    icon: 'attach',
    text: 'Attach',
    onClick: (): void => {
      this.onButtonClick('Attach');
    },
  };

  addButtonOptions = {
    icon: 'add',
    text: 'Add',
    onClick: (): void => {
      this.onButtonClick('Add');
    },
  };

  removeButtonOptions = {
    icon: 'trash',
    text: 'Remove',
    onClick: (): void => {
      this.onButtonClick('Remove');
    },
  };

  aboutButtonOptions = {
    icon: 'help',
    text: 'About',
    onClick: (): void => {
      this.onButtonClick('About');
    },
  };

  constructor(private service: Service) {}

  onTextAlignChanged(e: { itemData: { hint: string } }): void {
    this.onButtonClick(e.itemData.hint);
  }

  onButtonClick(name: string) {
    notify(`The "${name}" button was clicked`);
  }

  onSelectionChanged(name: string) {
    notify(`The "${name}" value was changed`);
  }

  onCheckBoxValueChanged() {
    notify('The "Navigation Pane" checkbox value was changed');
  }

  onDateBoxValueChanged() {
    notify('The "DateBox" value was changed');
  }

  onFontFamilyClick() {
    notify('The "Font Family" value was changed');
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
