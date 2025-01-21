import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {
  Component, destroyPlatform, NgModule, PLATFORM_ID, VERSION, importProvidersFrom,
} from '@angular/core';
import { provideServerRendering, ServerModule } from '@angular/platform-server';
import { DxServerModule } from 'devextreme-angular/server';
import infernoRenderer from 'devextreme/core/inferno_renderer';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DevExtremeModule } from 'devextreme-angular';
import { componentNames } from './component-names';

const containerClass = 'container';
const containerSelector = `.${containerClass}`;

@Component({
  selector: 'app-root',
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
    provideServerRendering(),
    { provide: PLATFORM_ID, useValue: 'server' },
    importProvidersFrom(DxServerModule),
  ],
})
class AppSSRModule {}

class TestHelpers {
  static createSSRBodyMarkup(ssrComponentsHTML: string): string {
    const nghData = '[{}]';
    return `<!--nghm--><app-root ng-version="${VERSION.full}" ngh="0" ng-server-context="ssr">${ssrComponentsHTML}</app-root>
      <script id="ng-state" type="application/json">{"DX_isPlatformServer":true,"__nghData__":${nghData}}</script>`;
  }

  static normalizeClassNames(element: HTMLElement): void {
    const classNames = Array.from(element.classList).sort();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    element.classList.remove(...element.classList);
    element.classList.add(...classNames);
  }

  static compareContainers(ssrContainer: HTMLElement, hydratedContainer: HTMLElement): [string, string] {
    const selector = `${containerSelector} > *`;

    [ssrContainer, hydratedContainer].forEach((container) => {
      container.querySelectorAll(selector).forEach((el) => {
        this.normalizeClassNames(el as HTMLElement);
      });
    });

    return [ssrContainer.innerHTML, hydratedContainer.innerHTML];
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
    body: HTMLElement | null;
    containerHtml: string;
  } = {
    body: null,
    containerHtml: '',
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
    document.body.innerHTML = '<app-root></app-root>';

    // Act
    await platformBrowserDynamic().bootstrapModule(AppSSRModule);

    // Assert
    ssrState.body = document.body;
    ssrState.containerHtml = document.querySelector(`${containerSelector}`)?.outerHTML ?? '';

    expect(ssrState.containerHtml).toBeTruthy();
  });

  it('should correctly hydrate server-rendered HTML', async () => {
    infernoRenderer.resetInjection();
    document.body.innerHTML = TestHelpers.createSSRBodyMarkup(ssrState.containerHtml);

    // Act
    await platformBrowserDynamic().bootstrapModule(AppBrowserModule);

    // Assert
    const [ssrResult, hydratedResult] = TestHelpers.compareContainers(
      ssrState.body.querySelector(`${containerSelector}`),
      document.querySelector(`${containerSelector}`),
    );

    expect(TestHelpers.hasConsoleMessage(
      consoleSpies.log,
      ['Angular hydrated 1 component(s)'],
    )).toBeTruthy();

    expect(ssrResult).toEqual(hydratedResult);
  });
});
