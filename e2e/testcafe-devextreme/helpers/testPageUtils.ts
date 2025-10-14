/* eslint-disable spellcheck/spell-checker */
import { ClientFunction } from 'testcafe';

export async function clearTestPage(testController: TestController): Promise<void> {
  const shadowDom = process.env.shadowDom === 'true';

  const clearTestPageFn = ClientFunction(() => {
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
    const parentContainer = document.getElementById('parentContainer');

    if (shadowDom) {
      parentContainer?.remove();
    } else {
      // @ts-expect-error ts-error
      $(parentContainer).remove();
    }

    const containerElement = document.createElement('div');
    containerElement.setAttribute('id', 'container');

    const otherContainerElement = document.createElement('div');
    otherContainerElement.setAttribute('id', 'otherContainer');

    const parentContainerElement = document.createElement('div');
    parentContainerElement.setAttribute('id', 'parentContainer');

    parentContainerElement.append(containerElement, otherContainerElement);
    body?.prepend(parentContainerElement);

    $('#stylesheetRules').remove();
  }, {
    dependencies: {
      shadowDom,
    },
  });

  await clearTestPageFn.with({ boundTestRun: testController })();
}

export async function loadAxeCore(t: TestController): Promise<void> {
  await t.eval(() => new Promise<void>((resolve, reject) => {
    // @ts-expect-error ts-error
    if (window.axe) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '../../../node_modules/axe-core/axe.min.js';
    // @ts-expect-error ts-error
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  }));
}
