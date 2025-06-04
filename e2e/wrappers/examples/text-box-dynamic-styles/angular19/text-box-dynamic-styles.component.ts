import { Component } from '@angular/core';
import { DxTextBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-text-box-dynamic-styles',
  standalone: true,
  imports: [DxTextBoxModule],
  template: `
    <dx-text-box
      [value]="value"
      (onValueChanged)="onValueChanged($event)"
      [style]="boxStyle">
    </dx-text-box>
  `
})
export class TextBoxDynamicStylesComponent {
  value = '';
  boxStyle: { [key: string]: string } = {};

  private colors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
  ];
  private colorIndex = 0;

  onValueChanged(e: any): void {
    this.value = e.value;

    this.boxStyle = {
      backgroundColor: this.colors[this.colorIndex],
    };

    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
  }
}