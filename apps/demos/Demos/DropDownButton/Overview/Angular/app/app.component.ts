import { bootstrapApplication } from '@angular/platform-browser';
import {
  enableProdMode, Component, inject, signal,
} from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxToolbarModule } from 'devextreme-angular';
import { DxDropDownButtonModule, type DxDropDownButtonComponent, type DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';
import { Service } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

type Color = string;

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDropDownButtonModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private dropDownButton: DxDropDownButtonComponent['instance'];

  readonly colors: Color[] = this.service.getColors();

  readonly downloads = this.service.getDownloads();

  readonly profileSettings = this.service.getProfileSettings();

  readonly fontSizes = this.service.getFontSizes();

  readonly lineHeights = this.service.getLineHeights();

  readonly alignments = this.service.getAlignments();

  readonly fontSize = signal(14);

  readonly color = signal<string | null>(null);

  readonly lineHeight = signal(1.35);

  readonly alignment = signal('left');

  readonly onAlignmentChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.alignment.set(e.item.value);
  };

  readonly onFontSizeChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.fontSize.set(e.item.value);
  };

  readonly onLineHeightChanged = (e: DxDropDownButtonTypes.SelectionChangedEvent): void => {
    this.lineHeight.set(e.item.value);
  };

  onButtonClick(e: DxDropDownButtonTypes.ButtonClickEvent): void {
    notify(`Go to ${e.element.querySelector('.button-title').textContent}'s profile`, 'success', 600);
  }

  onItemClick(e: DxDropDownButtonTypes.ItemClickEvent): void {
    notify(e.itemData.name || e.itemData, 'success', 600);
  }

  readonly onColorPickerInit = (e: DxDropDownButtonTypes.InitializedEvent): void => {
    this.dropDownButton = e.component;
  };

  onColorClick(color: Color): void {
    const iconElement = this.dropDownButton.element().getElementsByClassName('dx-icon-square')[0] as HTMLElement;

    iconElement.style.color = color;

    this.color.set(color);
    this.dropDownButton.close();
  }
}

bootstrapApplication(AppComponent);
