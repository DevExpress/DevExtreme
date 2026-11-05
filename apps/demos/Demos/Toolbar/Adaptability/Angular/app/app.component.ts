import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxToolbarModule,
  DxSelectBoxModule,
  DxResizableModule,
  DxDropDownButtonModule,
  DxButtonModule,
  DxButtonGroupModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import themes from 'devextreme/ui/themes';
import notify from 'devextreme/ui/notify';
import {
  type FontFamily,
  type FontSize,
  type FontStyle,
  type Heading,
  type LineHeight,
  type ListType,
  Service,
  type TextAlign,
  type TextAlignExtended,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxToolbarModule,
    DxSelectBoxModule,
    DxResizableModule,
    DxDropDownButtonModule,
    DxButtonModule,
    DxButtonGroupModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  private readonly customService = inject(Service);

  readonly stylingMode = !themes.current().startsWith('generic') ? 'text' : undefined;

  readonly fontSizes: FontSize[] = this.customService.getFontSizes();

  readonly lineHeights: LineHeight[] = this.customService.getLineHeights();

  readonly lineHeight: number[] = [this.lineHeights[1].lineHeight];

  readonly fontFamilies: FontFamily[] = this.customService.getFontFamilies();

  readonly headings: Heading[] = this.customService.getHeadings();

  readonly heading = this.headings[0]?.text;

  readonly fontStyles: FontStyle[] = this.customService.getFontStyles();

  readonly textAlignItems: TextAlign[] = this.customService.getTextAlign();

  readonly textAlignItemsExtended: TextAlignExtended[] = this.customService.getTextAlignExtended();

  readonly selectedTextAlign = signal([this.textAlignItems[0]?.alignment]);

  readonly multiline = signal(true);

  readonly listTypes: ListType[] = this.customService.getListType();

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

bootstrapApplication(AppComponent);
