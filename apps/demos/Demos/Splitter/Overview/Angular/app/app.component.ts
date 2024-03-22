import {
  NgModule, ChangeDetectionStrategy, Component, ViewChild, enableProdMode, Input,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSplitterModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  dimensionOptions = new Set(['size', 'minSize', 'maxSize']);

  @Input() paneContentTemplates: any[];

  renderedContentTemplates: any[];

  constructor() {
    this.paneContentTemplates = [
      { name: 'Left Pane' },
      { name: 'Central Pane' },
      { name: 'Right Pane' },
      { name: 'Nested Left Pane' },
      { name: 'Nested Center Pane' },
      { name: 'Nested Right Pane' },
    ];
  }

  ngOnInit() {
    this.renderedContentTemplates = JSON.parse(JSON.stringify(this.paneContentTemplates));
  }

  getPaneState(data: any): string { 
    if (data.resizable !== false && !data.collapsible) {
      return 'Resizable only';
    }

    return `${data.resizable ? 'Resizable' : 'Non-resizable'} and ${data.collapsible ? 'collapsible' : 'non-collapsible'}`;
  }

  filterDimensionOptions(data: any): {key: string, value: any}[] {
    return Object.entries(data)
      .filter(([key]) => this.dimensionOptions.has(key))
      .map(([key, value]) => {
        return ({key, value})
      });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSplitterModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
