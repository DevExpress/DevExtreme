import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import { DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

// \packages\devextreme\js\ui\html_editor.d.ts
import { AIIntegration, type AIProvider, type RequestParams, type Response } from 'devextreme-angular/common/ai-integration'

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

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
})
export class AppComponent {
  dataSource: DataSource;

  collapsed = false;

  contentReady = (e: DxDataGridTypes.ContentReadyEvent) => {
    if (!this.collapsed) {
      this.collapsed = true;
      e.component.expandRow(['EnviroCare']);
    }
  };

  customizeTooltip = ({ originalValue }: Record<string, string>) => ({ text: `${parseInt(originalValue)}%` });

  constructor(service: Service) {
    this.dataSource = service.getDataSource();

    // \packages\devextreme\js\__internal\core\ai_integration\core\ai_integration.test.ts
    const ai: AIIntegration = new AIIntegration(new Provider());
    console.log(ai.translate);
  }
}

// \packages\devextreme\js\__internal\core\ai_integration\test_utils\provider_mock.ts
export class Provider implements AIProvider {
  sendRequest(_: RequestParams): Response {
    const promise = new Promise<string>((resolve) => {
      resolve('AI response');
    });
    const abort = (): void => { };
    return { promise, abort };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxTemplateModule,
    DxBulletModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
