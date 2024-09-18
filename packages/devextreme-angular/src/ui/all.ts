import { NgModule } from '@angular/core';
import { DxAccordionModule } from 'devextreme-angular/ui/accordion';
import { DxActionSheetModule } from 'devextreme-angular/ui/action-sheet';
import { DxAutocompleteModule } from 'devextreme-angular/ui/autocomplete';
import { DxBarGaugeModule } from 'devextreme-angular/ui/bar-gauge';
import { DxBoxModule } from 'devextreme-angular/ui/box';
import { DxBulletModule } from 'devextreme-angular/ui/bullet';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxButtonGroupModule } from 'devextreme-angular/ui/button-group';
import { DxCalendarModule } from 'devextreme-angular/ui/calendar';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxChatModule } from 'devextreme-angular/ui/chat';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxCircularGaugeModule } from 'devextreme-angular/ui/circular-gauge';
import { DxColorBoxModule } from 'devextreme-angular/ui/color-box';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxDateRangeBoxModule } from 'devextreme-angular/ui/date-range-box';
import { DxDeferRenderingModule } from 'devextreme-angular/ui/defer-rendering';
import { DxDiagramModule } from 'devextreme-angular/ui/diagram';
import { DxDraggableModule } from 'devextreme-angular/ui/draggable';
import { DxDrawerModule } from 'devextreme-angular/ui/drawer';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxFileManagerModule } from 'devextreme-angular/ui/file-manager';
import { DxFileUploaderModule } from 'devextreme-angular/ui/file-uploader';
import { DxFilterBuilderModule } from 'devextreme-angular/ui/filter-builder';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxFunnelModule } from 'devextreme-angular/ui/funnel';
import { DxGalleryModule } from 'devextreme-angular/ui/gallery';
import { DxGanttModule } from 'devextreme-angular/ui/gantt';
import { DxHtmlEditorModule } from 'devextreme-angular/ui/html-editor';
import { DxLinearGaugeModule } from 'devextreme-angular/ui/linear-gauge';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxLookupModule } from 'devextreme-angular/ui/lookup';
import { DxMapModule } from 'devextreme-angular/ui/map';
import { DxMenuModule } from 'devextreme-angular/ui/menu';
import { DxMultiViewModule } from 'devextreme-angular/ui/multi-view';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxPivotGridModule } from 'devextreme-angular/ui/pivot-grid';
import { DxPivotGridFieldChooserModule } from 'devextreme-angular/ui/pivot-grid-field-chooser';
import { DxPolarChartModule } from 'devextreme-angular/ui/polar-chart';
import { DxPopoverModule } from 'devextreme-angular/ui/popover';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxProgressBarModule } from 'devextreme-angular/ui/progress-bar';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { DxRangeSelectorModule } from 'devextreme-angular/ui/range-selector';
import { DxRangeSliderModule } from 'devextreme-angular/ui/range-slider';
import { DxRatingModule } from 'devextreme-angular/ui/rating';
import { DxRecurrenceEditorModule } from 'devextreme-angular/ui/recurrence-editor';
import { DxResizableModule } from 'devextreme-angular/ui/resizable';
import { DxResponsiveBoxModule } from 'devextreme-angular/ui/responsive-box';
import { DxSankeyModule } from 'devextreme-angular/ui/sankey';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxSliderModule } from 'devextreme-angular/ui/slider';
import { DxSortableModule } from 'devextreme-angular/ui/sortable';
import { DxSparklineModule } from 'devextreme-angular/ui/sparkline';
import { DxSpeedDialActionModule } from 'devextreme-angular/ui/speed-dial-action';
import { DxSplitterModule } from 'devextreme-angular/ui/splitter';
import { DxSwitchModule } from 'devextreme-angular/ui/switch';
import { DxTabPanelModule } from 'devextreme-angular/ui/tab-panel';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTileViewModule } from 'devextreme-angular/ui/tile-view';
import { DxToastModule } from 'devextreme-angular/ui/toast';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { DxTooltipModule } from 'devextreme-angular/ui/tooltip';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { DxTreeMapModule } from 'devextreme-angular/ui/tree-map';
import { DxTreeViewModule } from 'devextreme-angular/ui/tree-view';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { DxValidationSummaryModule } from 'devextreme-angular/ui/validation-summary';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxVectorMapModule } from 'devextreme-angular/ui/vector-map';
import { DxTemplateModule } from 'devextreme-angular/core';

@NgModule({
    imports: [
    DxAccordionModule,
    DxActionSheetModule,
    DxAutocompleteModule,
    DxBarGaugeModule,
    DxBoxModule,
    DxBulletModule,
    DxButtonModule,
    DxButtonGroupModule,
    DxCalendarModule,
    DxChartModule,
    DxChatModule,
    DxCheckBoxModule,
    DxCircularGaugeModule,
    DxColorBoxModule,
    DxContextMenuModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDateRangeBoxModule,
    DxDeferRenderingModule,
    DxDiagramModule,
    DxDraggableModule,
    DxDrawerModule,
    DxDropDownBoxModule,
    DxDropDownButtonModule,
    DxFileManagerModule,
    DxFileUploaderModule,
    DxFilterBuilderModule,
    DxFormModule,
    DxFunnelModule,
    DxGalleryModule,
    DxGanttModule,
    DxHtmlEditorModule,
    DxLinearGaugeModule,
    DxListModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
    DxLookupModule,
    DxMapModule,
    DxMenuModule,
    DxMultiViewModule,
    DxNumberBoxModule,
    DxPieChartModule,
    DxPivotGridModule,
    DxPivotGridFieldChooserModule,
    DxPolarChartModule,
    DxPopoverModule,
    DxPopupModule,
    DxProgressBarModule,
    DxRadioGroupModule,
    DxRangeSelectorModule,
    DxRangeSliderModule,
    DxRatingModule,
    DxRecurrenceEditorModule,
    DxResizableModule,
    DxResponsiveBoxModule,
    DxSankeyModule,
    DxSchedulerModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxSliderModule,
    DxSortableModule,
    DxSparklineModule,
    DxSpeedDialActionModule,
    DxSplitterModule,
    DxSwitchModule,
    DxTabPanelModule,
    DxTabsModule,
    DxTagBoxModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxTileViewModule,
    DxToastModule,
    DxToolbarModule,
    DxTooltipModule,
    DxTreeListModule,
    DxTreeMapModule,
    DxTreeViewModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxVectorMapModule,
    DxTemplateModule
    ],
    exports: [
    DxAccordionModule,
    DxActionSheetModule,
    DxAutocompleteModule,
    DxBarGaugeModule,
    DxBoxModule,
    DxBulletModule,
    DxButtonModule,
    DxButtonGroupModule,
    DxCalendarModule,
    DxChartModule,
    DxChatModule,
    DxCheckBoxModule,
    DxCircularGaugeModule,
    DxColorBoxModule,
    DxContextMenuModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDateRangeBoxModule,
    DxDeferRenderingModule,
    DxDiagramModule,
    DxDraggableModule,
    DxDrawerModule,
    DxDropDownBoxModule,
    DxDropDownButtonModule,
    DxFileManagerModule,
    DxFileUploaderModule,
    DxFilterBuilderModule,
    DxFormModule,
    DxFunnelModule,
    DxGalleryModule,
    DxGanttModule,
    DxHtmlEditorModule,
    DxLinearGaugeModule,
    DxListModule,
    DxLoadIndicatorModule,
    DxLoadPanelModule,
    DxLookupModule,
    DxMapModule,
    DxMenuModule,
    DxMultiViewModule,
    DxNumberBoxModule,
    DxPieChartModule,
    DxPivotGridModule,
    DxPivotGridFieldChooserModule,
    DxPolarChartModule,
    DxPopoverModule,
    DxPopupModule,
    DxProgressBarModule,
    DxRadioGroupModule,
    DxRangeSelectorModule,
    DxRangeSliderModule,
    DxRatingModule,
    DxRecurrenceEditorModule,
    DxResizableModule,
    DxResponsiveBoxModule,
    DxSankeyModule,
    DxSchedulerModule,
    DxScrollViewModule,
    DxSelectBoxModule,
    DxSliderModule,
    DxSortableModule,
    DxSparklineModule,
    DxSpeedDialActionModule,
    DxSplitterModule,
    DxSwitchModule,
    DxTabPanelModule,
    DxTabsModule,
    DxTagBoxModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxTileViewModule,
    DxToastModule,
    DxToolbarModule,
    DxTooltipModule,
    DxTreeListModule,
    DxTreeMapModule,
    DxTreeViewModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxVectorMapModule,
    DxTemplateModule
    ]
})
export class DevExtremeModule {}
