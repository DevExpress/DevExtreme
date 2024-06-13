import {
  NgModule, ChangeDetectionStrategy, Component, ViewChild, enableProdMode, Input,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSplitterModule } from 'devextreme-angular';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}
interface PaneContentTemplate {
  name: string;
  data?: any;
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  dimensionOptions = new Set(['size', 'minSize', 'maxSize', 'collapsedSize']);

  paneContentTemplates: PaneContentTemplate[] = [
    { name: 'Left Pane' },
    { name: 'Central Pane' },
    { name: 'Right Pane' },
    { name: 'Nested Left Pane' },
    { name: 'Nested Central Pane' },
    { name: 'Nested Right Pane' },
  ];

  getPaneState(data: any): string {
    if (data.resizable !== false && !data.collapsible) {
      return 'Resizable only';
    }
    const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
    const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';

    return `${resizableText} and ${collapsibleText}`;
  }

  filterDimensionOptions(data: any): { key: string; value: any }[] {
    return Object.entries(data)
      .reverse()
      .filter(([key]) => this.dimensionOptions.has(key))
      .map(([key, value]) => ({ key, value }));
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSplitterModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
