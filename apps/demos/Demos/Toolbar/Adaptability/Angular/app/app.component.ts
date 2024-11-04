import { NgModule, Component, enableProdMode, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import themes from 'devextreme/ui/themes';
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

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})

export class AppComponent {
  customService = inject(Service);

  stylingMode = !themes.current().startsWith('generic') ? 'text' : undefined;

  fontSizes: FontSize[] = this.customService.getFontSizes();
  
  lineHeights: LineHeight[] = this.customService.getLineHeights();
  lineHeight: number[] = [this.lineHeights[1].lineHeight];

  fontFamilies: FontFamily[] = this.customService.getFontFamilies();

  headings: Heading[] = this.customService.getHeadings();

  heading = this.headings[0]?.text;

  fontStyles: FontStyle[] = this.customService.getFontStyles();

  textAlignItems: TextAlign[] = this.customService.getTextAlign();

  textAlignItemsExtended: TextAlignExtended[] = this.customService.getTextAlignExtended();

  selectedTextAlign = [this.textAlignItems[0]?.alignment];

  listTypes: ListType[] = this.customService.getListType();

  constructor() {
  }

  onTextAlignChanged(e: { itemData: { hint: string } }): void {
    this.onButtonClick(e.itemData.hint);
  }

  onButtonClick(name: string) {
    notify(`The "${name}" button has been clicked`);
  }

  onSelectionChanged(name: string) {
    notify(`The "${name}" value has been changed`);
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