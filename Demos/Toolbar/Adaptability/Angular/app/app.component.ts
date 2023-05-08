import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxToolbarModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxResizableModule,
  DxDropDownButtonModule,
  DxButtonModule,
  DxButtonGroupModule,
  DxCheckBoxModule,
} from 'devextreme-angular';

import notify from 'devextreme/ui/notify';
import {
  FontFamily,
  FontSize,
  FontStyle,
  Heading,
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
  fontSizes: FontSize[] = this.service.getFontSizes();

  lineHeights: LineHeight[] = this.service.getLineHeights();

  lineHeight: number[] = [this.lineHeights[1].lineHeight];

  fontFamilies: FontFamily[] = this.service.getFontFamilies();

  headings: Heading[] = this.service.getHeadings();

  heading: string = this.headings[0].text;

  fontStyles: FontStyle[] = this.service.getFontStyles();

  textAlignItems: TextAlign[] = this.service.getTextAlign();

  textAlignItemsExtended: TextAlignExtended[] = this.service.getTextAlignExtended();

  selectedTextAlign: string[] = [this.textAlignItems[0].alignment];

  listTypes: ListType[] = this.service.getListType();

  constructor(private service: Service) {}

  onTextAlignChanged(e: { itemData: { hint: string } }): void {
    this.onButtonClick(e.itemData.hint);
  }

  onButtonClick(name: string) {
    notify(`The "${name}" button has been clicked`);
  }

  onSelectionChanged(name: string) {
    notify(`The "${name}" value has been changed`);
  }

  onCheckBoxValueChanged() {
    notify('The "Navigation Pane" checkbox value has been changed');
  }

  onDateBoxValueChanged() {
    notify('The "DateBox" value has been changed');
  }

  onFontFamilyClick() {
    notify('The "Font Family" value has been changed');
  }

  onHeadingClick() {
    notify('The "Heading" value has been changed');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxToolbarModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxResizableModule,
    DxDropDownButtonModule,
    DxButtonModule,
    DxButtonGroupModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
