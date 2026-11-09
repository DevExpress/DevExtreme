import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxListModule, DxRadioGroupModule, DxToolbarModule } from 'devextreme-angular';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import type { DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly navigation = this.service.getNavigationList();

  readonly text = this.service.getContent();

  readonly showSubmenuModes: DxDrawerTypes.RevealMode[] = ['slide', 'expand'];

  readonly positionModes: DxDrawerTypes.PanelLocation[] = ['left', 'right'];

  readonly showModes: DxDrawerTypes.OpenedStateMode[] = ['push', 'shrink', 'overlap'];

  readonly selectedOpenMode = signal<DxDrawerTypes.OpenedStateMode>('shrink');

  readonly selectedPosition = signal<DxDrawerTypes.PanelLocation>('left');

  readonly selectedRevealMode = signal<DxDrawerTypes.RevealMode>('slide');

  readonly isDrawerOpen = signal(true);

  readonly toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      stylingMode: 'text',
      onClick: () => {
        this.isDrawerOpen.update((isOpen) => !isOpen);
      },
    },
  }];
}

bootstrapApplication(AppComponent);
