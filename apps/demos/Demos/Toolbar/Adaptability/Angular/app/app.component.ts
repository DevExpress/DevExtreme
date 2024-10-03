import { NgModule, Component, enableProdMode } from '@angular/core';
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
  stylingMode = !themes.current().startsWith('generic') ? 'text' : undefined;

  fontSizes: FontSize[] = [];

  lineHeights: LineHeight[] = [];

  lineHeight: number[] = [this.lineHeights[1]?.lineHeight];

  fontFamilies: FontFamily[] = [];

  headings: Heading[] = [];

  heading = this.headings[0]?.text;

  fontStyles: FontStyle[] = [];

  textAlignItems: TextAlign[] = [];

  textAlignItemsExtended: TextAlignExtended[] = [];

  selectedTextAlign = [this.textAlignItems[0]?.alignment];

  listTypes: ListType[] = [];

  constructor(private service: Service) {
    this.fontSizes = service.getFontSizes();
    this.lineHeights = service.getLineHeights();
    this.fontFamilies = service.getFontFamilies();
    this.headings = service.getHeadings();
    this.fontStyles = service.getFontStyles();
    this.textAlignItems = service.getTextAlign(); 
    this.textAlignItemsExtended = service.getTextAlignExtended();
    this.listTypes = service.getListType(); 
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