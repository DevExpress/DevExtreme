import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DxTabsModule, type DxTabsTypes } from 'devextreme-angular/ui/tabs';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTabsModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tabsWithText = this.service.getTabsWithText();

  readonly tabsWithIconAndText = this.service.getTabsWithIconAndText();

  readonly tabsWithIcon = this.service.getTabsWithIcon();

  readonly showNavButtons = signal(false);

  readonly scrollByContent = signal(false);

  readonly rtlEnabled = signal(false);

  readonly orientations: DxTabsTypes.Orientation[] = ['horizontal', 'vertical'];

  readonly stylingModes: DxTabsTypes.TabsStyle[] = ['primary', 'secondary'];

  readonly iconPositions: DxTabsTypes.TabsIconPosition[] = ['top', 'start', 'end', 'bottom'];

  readonly width = signal('auto');

  readonly orientation = signal(this.orientations[0]);

  readonly stylingMode = signal(this.stylingModes[1]);

  readonly iconPosition = signal(this.iconPositions[0]);

  readonly widgetWrapperClasses = computed(() => ({
    'widget-wrapper': true,
    'widget-wrapper-horizontal': this.orientation() !== 'vertical',
    'widget-wrapper-vertical': this.orientation() === 'vertical',
    'strict-width': this.scrollByContent() || this.showNavButtons(),
  }));

  onFullWidthChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.width.set(e.value ? '100%' : 'auto');
  }
}

bootstrapApplication(AppComponent);
