import { ClientFunction } from 'testcafe';

export default async function createWidget(
  widgetName: string,
  options: any,
  disableAnimation = false,
  selector = '#container',
) {
  await ClientFunction(() => {
    const widgetOptions = typeof options === 'function' ? options() : options;
    (window as any).widget = $(`${selector}`)[widgetName](widgetOptions)[widgetName]('instance');
  },
  {
    dependencies:
            {
              widgetName,
              options,
              selector,
            },
  })();

  if (disableAnimation) {
    await (ClientFunction(() => {
      (window as any).DevExpress.fx.off = true;
    }))();
  }
}

export async function disposeWidget(
  widgetName: string,
  selector = '#container',
) {
  await ClientFunction(() => {
    const $element = $(`${selector}`);
    if ($element.length && $element.data()[widgetName]) {
      $element[widgetName]('dispose');
      $element.empty();
    }
  }, {
    dependencies: {
      widgetName,
      selector,
    },
  })();
}
