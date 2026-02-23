import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, Component, provideZoneChangeDetection } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxToolbarModule } from 'devextreme-angular';
import { DxDropDownButtonModule, DxDropDownButtonComponent, DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';
import { ItemObject, Service } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

type Color = string;

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxDropDownButtonModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  dropDownButton: DxDropDownButtonComponent['instance'];

  colors: Color[];

  downloads: string[];

  profileSettings: ItemObject[];

  fontSizes: ItemObject[];

  lineHeights: ItemObject[];

  alignments: ItemObject[];

  fontSize = 14;

  color: string = null;

  lineHeight = 1.35;

  alignment = 'left';

  constructor(service: Service) {
    this.colors = service.getColors();
    this.fontSizes = service.getFontSizes();
    this.downloads = service.getDownloads();
    this.profileSettings = service.getProfileSettings();
    this.alignments = service.getAlignments();
    this.lineHeights = service.getLineHeights();
  }

  onAlignmentChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.alignment = e.item.value;
  };

  onFontSizeChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.fontSize = e.item.value;
  };

  onLineHeightChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.lineHeight = e.item.value;
  };

  onButtonClick(e: DxDropDownButtonTypes.ButtonClickEvent): void {
    notify(`Go to ${e.element.querySelector('.button-title').textContent}'s profile`, 'success', 600);
  }

  onItemClick(e: DxDropDownButtonTypes.ItemClickEvent): void {
    notify(e.itemData.name || e.itemData, 'success', 600);
  }

  onColorPickerInit = (e: DxDropDownButtonTypes.InitializedEvent): void => {
    this.dropDownButton = e.component;
  };

  onColorClick(color: Color): void {
    const iconElement = this.dropDownButton.element().getElementsByClassName('dx-icon-square')[0] as HTMLElement;

    iconElement.style.color = color;

    this.color = color;
    this.dropDownButton.close();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
