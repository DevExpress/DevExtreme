import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {
  Component,
  destroyPlatform,
  NgModule,
  PLATFORM_ID,
  importProvidersFrom,
} from '@angular/core';
import { ServerModule, renderModule } from '@angular/platform-server';
import { DxServerModule } from 'devextreme-angular/server';
import infernoRenderer from 'devextreme/core/inferno_renderer';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DevExtremeModule } from 'devextreme-angular';
import { componentNames as componentNamesAll } from './component-names';

const componentNames = componentNamesAll.filter((n) => ['toast', 'action-sheet'].includes(n));

const containerClass = 'container';
const containerSelector = `.${containerClass}`;

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<div class="${containerClass}">
    ${componentNames.map((name) => `<dx-${name}></dx-${name}>`).join('\n')}
  </div>`,
})
class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DevExtremeModule],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
class AppBrowserModule {}

@NgModule({
  declarations: [AppComponent],
  imports: [ServerModule, DevExtremeModule],
  bootstrap: [AppComponent],
  providers: [
    provideClientHydration(),
    { provide: PLATFORM_ID, useValue: 'server' },
    importProvidersFrom(DxServerModule),
  ],
})
class AppSSRModule {}

class TestHelpers {
  static normalizeClassNames(element: HTMLElement): void {
    const classNames = Array.from(element.classList).sort();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    element.classList.remove(...element.classList);
    element.classList.add(...classNames);
  }

  static hasConsoleMessage(spy: jasmine.Spy, messages: string[]): boolean {
    return spy.calls.allArgs().some((args) => messages.some((msg) => args[0].toLowerCase().includes(msg.toLowerCase())));
  }
}

describe('Angular Components Hydration Test', () => {
  let consoleSpies: {
    warn: jasmine.Spy;
    error: jasmine.Spy;
    log: jasmine.Spy;
  };
  const ssrState: {
    containerHtml: string;
    ssrHTML: string;
  } = {
    containerHtml: '',
    ssrHTML: '',
  };

  beforeAll(() => {
    consoleSpies = {
      warn: spyOn(console, 'warn').and.callThrough(),
      error: spyOn(console, 'error').and.callThrough(),
      log: spyOn(console, 'log').and.callThrough(),
    };
  });

  beforeEach(() => {
    destroyPlatform();
  });

  afterEach(() => {
    expect(consoleSpies.error).not.toHaveBeenCalled();
    expect(TestHelpers.hasConsoleMessage(consoleSpies.warn, ['exception', 'hydration'])).toBeFalsy();
  });

  it('should generate correct SSR HTML', async () => {
    const html = await renderModule(AppSSRModule, {
      document: '<!DOCTYPE html><html><head></head><body><app-root></app-root></body></html>',
      url: '/',
    });

    ssrState.ssrHTML = html
      .replace(/ng-server-context="other"/g, 'ng-server-context="ssg"')
      .replace(/^.*<body/, '<body')
      .replace(/<\/body>.*$/, '</body>');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ssrState.ssrHTML;

    // Assert
    ssrState.containerHtml = tempDiv.querySelector(`${containerSelector}`)?.innerHTML ?? '';

    expect(ssrState.containerHtml).toBeTruthy();
    expect(ssrState.ssrHTML).toBeTruthy();
  });

  it('should correctly hydrate server-rendered HTML', async () => {
    infernoRenderer.resetInjection();

    document.body.outerHTML = ssrState.ssrHTML;

    // Act
    await platformBrowserDynamic().bootstrapModule(AppBrowserModule);

    expect(TestHelpers.hasConsoleMessage(
      consoleSpies.log,
      ['Angular hydrated 1 component(s)'],
    )).toBeTruthy();

    expect(ssrState.containerHtml).toEqual(document.querySelector(`${containerSelector}`).innerHTML);
  });
});
