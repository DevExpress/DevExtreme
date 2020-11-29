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

export async function disposeWidgets() {
  await ClientFunction(() => {
    const widgetSelector = '.dx-widget';
    const $elements = $(widgetSelector)
      .filter((_, element) => $(element).parents(widgetSelector).length === 0);
    $elements.each((_, element) => {
      const $widgetElement = $(element);
      const widgetNames = $widgetElement.data().dxComponents;
      widgetNames?.forEach((name) => {
        if ($widgetElement.hasClass('dx-widget')) {
          ($widgetElement as any)[name]('dispose');
        }
      });
      $widgetElement.empty();
    });
  })();
}
