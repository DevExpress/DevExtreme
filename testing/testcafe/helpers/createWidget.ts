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
  widgetName: WidgetName,
  options: unknown,
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
}
