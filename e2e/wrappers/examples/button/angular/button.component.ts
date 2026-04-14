import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'demo-button',
  standalone: true,
  imports: [CommonModule, DxButtonModule],
  template: `
    <dx-button
      text="Click me!">
    </dx-button>
  `
})
export class ButtonComponent {}