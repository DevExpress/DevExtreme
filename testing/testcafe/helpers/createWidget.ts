import { ClientFunction } from 'testcafe';

export type WidgetName =
'dxAccordion' |
'dxAutocomplete' |
'dxGallery' |
'dxButtonGroup' |
'dxCalendar' |
'dxCheckBox' |
'dxColorBox' |
'dxDropDownButton' |
'dxDraggable' |
'dxTabPanel' |
'dxForm' |
'dxFilterBuilder' |
'dxTabPanel' |
'dxSelectBox' |
'dxScrollable' |
'dxScrollView' |
'dxMultiView' |
'dxPivotGrid' |
'dxPivotGridFieldChooser' |
'dxDataGrid' |
'dxTreeList' |
'dxPager' |
'dxRadioGroup' |
'dxScheduler' |
'dxTabs' |
'dxTagBox' |
'dxContextMenu' |
'dxDropDownMenu' |
'dxChart' |
'dxMenu' |
'dxPopup' |
'dxPopover' |
'dxSelectBox' |
'dxSortable' |
'dxButton' |
'dxTextBox' |
'dxTextArea' |
'dxTagBox' |
'dxToolbar' |
'dxTreeView' |
'dxDateBox' |
'dxLookup' |
'dxList' |
'dxHtmlEditor' |
'dxNumberBox' |
'dxValidator';

export default async function createWidget(
  widgetName: WidgetName,
  options: unknown,
  disableAnimation = true,
  selector = '#container',
): Promise<void> {
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
    await ClientFunction(() => {
      (window as any).DevExpress.fx.off = true;
    })();
  }
}

export async function cleanContainer(): Promise<void> {
  await ClientFunction(() => {
    const containerSelector = '#container';

    const $container = $(containerSelector);

    $container.empty();
    $container.removeAttr('style');
    $container.removeAttr('class');
  })();
}

export async function disposeWidgets(): Promise<void> {
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
  await cleanContainer();
}
