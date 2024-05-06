import type { Properties as DataGridProperties } from 'devextreme/ui/data_grid';
import type { Properties as FilterBuilderProperties } from 'devextreme/ui/filter_builder';

export type WidgetName =
  'dxAccordion'
  | 'dxAutocomplete'
  | 'dxGallery'
  | 'dxButtonGroup'
  | 'dxCalendar'
  | 'dxCalendarView'
  | 'dxCheckBox'
  | 'dxColorBox'
  | 'dxDropDownButton'
  | 'dxDraggable'
  | 'dxTabPanel'
  | 'dxForm'
  | 'dxFilterBuilder'
  | 'dxSelectBox'
  | 'dxScrollable'
  | 'dxScrollView'
  | 'dxMultiView'
  | 'dxPivotGrid'
  | 'dxPivotGridFieldChooser'
  | 'dxDataGrid'
  | 'dxTreeList'
  | 'dxPager'
  | 'dxRadioGroup'
  | 'dxScheduler'
  | 'dxTabs'
  | 'dxTagBox'
  | 'dxContextMenu'
  | 'dxDropDownMenu'
  | 'dxChart'
  | 'dxMenu'
  | 'dxPopup'
  | 'dxPopover'
  | 'dxSpeedDialAction'
  | 'dxSortable'
  | 'dxSplitter'
  | 'dxButton'
  | 'dxTextBox'
  | 'dxTextArea'
  | 'dxToolbar'
  | 'dxTileView'
  | 'dxTreeView'
  | 'dxDateBox'
  | 'dxDateRangeBox'
  | 'dxLookup'
  | 'dxOverlay'
  | 'dxList'
  | 'dxHtmlEditor'
  | 'dxNumberBox'
  | 'dxValidator'
  | 'dxFileUploader'
  | 'dxProgressBar'
  | 'dxRangeSlider'
  | 'dxSlider'
  | 'dxDropDownBox'
  | 'dxFileManager'
  | 'dxSwitch';

export interface WidgetOptions {
  dxDataGrid: DataGridProperties;
  dxFilterBuilder: FilterBuilderProperties;
  // TODO: write other widgets
}
