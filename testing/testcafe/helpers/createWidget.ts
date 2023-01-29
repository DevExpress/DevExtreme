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
'dxValidator' |
'dxHtmlEditor' |
'dxFileUploader' |
'dxDropDownBox';

export default async function createWidget(
  componentName: WidgetName,
  componentOptions: unknown,
  selector = '#container',
  options: {
    disableFxAnimation: boolean;
  } = {
    disableFxAnimation: true,
  },
): Promise<void> {
  await ClientFunction(() => {
    (window as any).DevExpress.fx.off = options.disableFxAnimation;
  }, {
    dependencies: {
      options,
    },
  })();

  await ClientFunction(() => {
    const widgetOptions = typeof componentOptions === 'function' ? componentOptions() : componentOptions;
    (window as any).widget = $(`${selector}`)[componentName](widgetOptions)[componentName]('instance');
  },
  {
    dependencies: {
      componentName,
      componentOptions,
      selector,
    },
  })();
}
