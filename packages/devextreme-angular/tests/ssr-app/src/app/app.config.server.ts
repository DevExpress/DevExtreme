import {mergeApplicationConfig, ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { DxServerModule } from 'devextreme-angular/server';

const serverConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(DxServerModule),
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
