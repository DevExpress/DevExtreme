/* eslint-disable spellcheck/spell-checker */
import {
  removeStylesheetRulesFromPage,
} from './domUtils';

export async function clearTestPage(t: TestController): Promise<void> {
  await t.eval(() => {
    const widgetSelector = '.dx-widget';
    const $elements = $(widgetSelector)
      .filter((_, element) => $(element).parents(widgetSelector).length === 0);
    $elements.each((_, element) => {
      const $widgetElement = $(element);
      const widgetNames = $widgetElement.data().dxComponents;
      widgetNames?.forEach((name) => {
        if ($widgetElement.hasClass('dx-widget')) {
          // @ts-expect-error ts-erroe
          $widgetElement[name]?.('dispose');
        }
      });
      $widgetElement.empty();
    });

    const body = document.querySelector('body');
    if (body) {
      body.innerHTML = '';

      body.className = 'dx-surface';
    }

    const temp = document.createElement('div');
    temp.innerHTML = `
      <div id="parentContainer" role="main">
        <h1 style="position: fixed; left: 0; top: 0; clip: rect(1px, 1px, 1px, 1px);">Test header</h1>
        <div id="container"></div>
        <div id="otherContainer"></div>
      </div>
    `;

    body?.prepend(temp.firstElementChild!);
  });

  await removeStylesheetRulesFromPage.with({ boundTestRun: t })();
}

export async function loadAxeCore(t: TestController): Promise<void> {
  await t.eval(() => new Promise<void>((resolve, reject) => {
    // @ts-expect-error ts-error
    if (window.axe) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'axe-core-script';
    script.src = '../../../node_modules/axe-core/axe.min.js';
    // @ts-expect-error ts-error
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  }));
}

export async function loadGantt(t: TestController): Promise<void> {
  await t.eval(() => new Promise<void>((resolve, reject) => {
    if (document.getElementById('dx-gantt-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'dx-gantt-script';
    script.src = '../../../packages/devextreme/artifacts/js/dx-gantt.min.js';
    // @ts-expect-error ts-error
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  }));
}

export const addShadowRootTree = async (t: TestController): Promise<void> => {
  await t.eval(() => {
    const root = document.querySelector('#parentContainer') as HTMLElement;
    const { childNodes } = root;

    if (!root.shadowRoot) {
      root.attachShadow({ mode: 'open' });
    }

    const shadowContainer = document.createElement('div');
    shadowContainer.append(...Array.from(childNodes));

    root.shadowRoot!.appendChild(shadowContainer);
  });
};
