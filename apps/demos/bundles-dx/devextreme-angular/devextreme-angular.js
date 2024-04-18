System.register(['./devextreme-angular-core.js', '@angular/core', './devextreme-angular-ui-accordion.js', './devextreme-angular-ui-action-sheet.js', './devextreme-angular-ui-autocomplete.js', './devextreme-angular-ui-bar-gauge.js', './devextreme-angular-ui-box.js', './devextreme-angular-ui-bullet.js', './devextreme-angular-ui-button.js', './devextreme-angular-ui-button-group.js', './devextreme-angular-ui-calendar.js', './devextreme-angular-ui-chart.js', './devextreme-angular-ui-check-box.js', './devextreme-angular-ui-circular-gauge.js', './devextreme-angular-ui-color-box.js', './devextreme-angular-ui-context-menu.js', './devextreme-angular-ui-data-grid.js', './devextreme-angular-ui-date-box.js', './devextreme-angular-ui-date-range-box.js', './devextreme-angular-ui-defer-rendering.js', './devextreme-angular-ui-diagram.js', './devextreme-angular-ui-draggable.js', './devextreme-angular-ui-drawer.js', './devextreme-angular-ui-drop-down-box.js', './devextreme-angular-ui-drop-down-button.js', './devextreme-angular-ui-file-manager.js', './devextreme-angular-ui-file-uploader.js', './devextreme-angular-ui-filter-builder.js', './devextreme-angular-ui-form.js', './devextreme-angular-ui-funnel.js', './devextreme-angular-ui-gallery.js', './devextreme-angular-ui-gantt.js', './devextreme-angular-ui-html-editor.js', './devextreme-angular-ui-linear-gauge.js', './devextreme-angular-ui-list.js', './devextreme-angular-ui-load-indicator.js', './devextreme-angular-ui-load-panel.js', './devextreme-angular-ui-lookup.js', './devextreme-angular-ui-map.js', './devextreme-angular-ui-menu.js', './devextreme-angular-ui-multi-view.js', './devextreme-angular-ui-number-box.js', './devextreme-angular-ui-pie-chart.js', './devextreme-angular-ui-pivot-grid.js', './devextreme-angular-ui-pivot-grid-field-chooser.js', './devextreme-angular-ui-polar-chart.js', './devextreme-angular-ui-popover.js', './devextreme-angular-ui-popup.js', './devextreme-angular-ui-progress-bar.js', './devextreme-angular-ui-radio-group.js', './devextreme-angular-ui-range-selector.js', './devextreme-angular-ui-range-slider.js', './devextreme-angular-ui-recurrence-editor.js', './devextreme-angular-ui-resizable.js', './devextreme-angular-ui-responsive-box.js', './devextreme-angular-ui-sankey.js', './devextreme-angular-ui-scheduler.js', './devextreme-angular-ui-scroll-view.js', './devextreme-angular-ui-select-box.js', './devextreme-angular-ui-slider.js', './devextreme-angular-ui-sortable.js', './devextreme-angular-ui-sparkline.js', './devextreme-angular-ui-speed-dial-action.js', './devextreme-angular-ui-splitter.js', './devextreme-angular-ui-switch.js', './devextreme-angular-ui-tab-panel.js', './devextreme-angular-ui-tabs.js', './devextreme-angular-ui-tag-box.js', './devextreme-angular-ui-text-area.js', './devextreme-angular-ui-text-box.js', './devextreme-angular-ui-tile-view.js', './devextreme-angular-ui-toast.js', './devextreme-angular-ui-toolbar.js', './devextreme-angular-ui-tooltip.js', './devextreme-angular-ui-tree-list.js', './devextreme-angular-ui-tree-map.js', './devextreme-angular-ui-tree-view.js', './devextreme-angular-ui-validation-group.js', './devextreme-angular-ui-validation-summary.js', './devextreme-angular-ui-validator.js', './devextreme-angular-ui-vector-map.js', 'devextreme/common/charts', '@angular/common', '@angular/platform-browser', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred', 'devextreme/ui/accordion', './devextreme-angular-ui-nested.js', 'devextreme/ui/action_sheet', 'devextreme/ui/autocomplete', '@angular/forms', 'devextreme/viz/bar_gauge', 'devextreme/ui/box', 'devextreme/viz/bullet', 'devextreme/ui/button', 'devextreme/ui/button_group', 'devextreme/ui/calendar', 'devextreme/viz/chart', 'devextreme/ui/check_box', 'devextreme/viz/circular_gauge', 'devextreme/ui/color_box', 'devextreme/ui/context_menu', 'devextreme/bundles/dx.all', 'devextreme/ui/data_grid', 'devextreme/ui/date_box', 'devextreme/ui/date_range_box', 'devextreme/ui/defer_rendering', 'devextreme/ui/diagram', 'devextreme/ui/draggable', 'devextreme/ui/drawer', 'devextreme/ui/drop_down_box', 'devextreme/ui/drop_down_button', 'devextreme/ui/file_manager', 'devextreme/ui/file_uploader', 'devextreme/ui/filter_builder', 'devextreme/ui/form', 'devextreme/viz/funnel', 'devextreme/ui/gallery', 'devextreme/ui/gantt', 'devextreme/ui/html_editor', 'devextreme/viz/linear_gauge', 'devextreme/ui/list', 'devextreme/ui/load_indicator', 'devextreme/ui/load_panel', 'devextreme/ui/lookup', 'devextreme/ui/map', 'devextreme/ui/menu', 'devextreme/ui/multi_view', 'devextreme/ui/number_box', 'devextreme/viz/pie_chart', 'devextreme/ui/pivot_grid', 'devextreme/ui/pivot_grid/data_source', 'devextreme/ui/pivot_grid_field_chooser', 'devextreme/viz/polar_chart', 'devextreme/ui/popover', 'devextreme/ui/popup', 'devextreme/ui/progress_bar', 'devextreme/ui/radio_group', 'devextreme/viz/range_selector', 'devextreme/ui/range_slider', 'devextreme/ui/recurrence_editor', 'devextreme/ui/resizable', 'devextreme/ui/responsive_box', 'devextreme/viz/sankey', 'devextreme/ui/scheduler', 'devextreme/ui/scroll_view', 'devextreme/ui/select_box', 'devextreme/ui/slider', 'devextreme/ui/sortable', 'devextreme/viz/sparkline', 'devextreme/ui/speed_dial_action', 'devextreme/ui/splitter', 'devextreme/ui/switch', 'devextreme/ui/tab_panel', 'devextreme/ui/tabs', 'devextreme/ui/tag_box', 'devextreme/ui/text_area', 'devextreme/ui/text_box', 'devextreme/ui/tile_view', 'devextreme/ui/toast', 'devextreme/ui/toolbar', 'devextreme/ui/tooltip', 'devextreme/ui/tree_list', 'devextreme/viz/tree_map', 'devextreme/ui/tree_view', 'devextreme/ui/validation_group', 'devextreme/ui/validation_summary', 'devextreme/ui/validator', 'devextreme/viz/vector_map'], (function (exports) {
    'use strict';
    var DxTemplateModule, i0, NgModule, DxAccordionModule, DxActionSheetModule, DxAutocompleteModule, DxBarGaugeModule, DxBoxModule, DxBulletModule, DxButtonModule, DxButtonGroupModule, DxCalendarModule, DxChartModule, DxCheckBoxModule, DxCircularGaugeModule, DxColorBoxModule, DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxDateRangeBoxModule, DxDeferRenderingModule, DxDiagramModule, DxDraggableModule, DxDrawerModule, DxDropDownBoxModule, DxDropDownButtonModule, DxFileManagerModule, DxFileUploaderModule, DxFilterBuilderModule, DxFormModule, DxFunnelModule, DxGalleryModule, DxGanttModule, DxHtmlEditorModule, DxLinearGaugeModule, DxListModule, DxLoadIndicatorModule, DxLoadPanelModule, DxLookupModule, DxMapModule, DxMenuModule, DxMultiViewModule, DxNumberBoxModule, DxPieChartModule, DxPivotGridModule, DxPivotGridFieldChooserModule, DxPolarChartModule, DxPopoverModule, DxPopupModule, DxProgressBarModule, DxRadioGroupModule, DxRangeSelectorModule, DxRangeSliderModule, DxRecurrenceEditorModule, DxResizableModule, DxResponsiveBoxModule, DxSankeyModule, DxSchedulerModule, DxScrollViewModule, DxSelectBoxModule, DxSliderModule, DxSortableModule, DxSparklineModule, DxSpeedDialActionModule, DxSplitterModule, DxSwitchModule, DxTabPanelModule, DxTabsModule, DxTagBoxModule, DxTextAreaModule, DxTextBoxModule, DxTileViewModule, DxToastModule, DxToolbarModule, DxTooltipModule, DxTreeListModule, DxTreeMapModule, DxTreeViewModule, DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule, DxVectorMapModule;
    return {
        setters: [function (module) {
            DxTemplateModule = module.D;
            exports({ BaseNestedOption: module.B, CollectionNestedOption: module.C, CollectionNestedOptionContainerImpl: module.a, DX_TEMPLATE_WRAPPER_CLASS: module.b, DxComponent: module.c, DxComponentExtension: module.d, DxIntegrationModule: module.e, DxServerTransferStateModule: module.f, DxTemplateDirective: module.g, DxTemplateHost: module.h, DxTemplateModule: module.D, EmitterHelper: module.E, IterableDifferHelper: module.I, NestedOption: module.N, NestedOptionHost: module.i, NgEventsStrategy: module.j, RenderData: module.R, WatcherHelper: module.W, extractTemplate: module.k, getElement: module.l, getServerStateKey: module.m });
        }, function (module) {
            i0 = module;
            NgModule = module.NgModule;
        }, function (module) {
            DxAccordionModule = module.DxAccordionModule;
            exports({ DxAccordionComponent: module.DxAccordionComponent, DxAccordionModule: module.DxAccordionModule });
        }, function (module) {
            DxActionSheetModule = module.DxActionSheetModule;
            exports({ DxActionSheetComponent: module.DxActionSheetComponent, DxActionSheetModule: module.DxActionSheetModule });
        }, function (module) {
            DxAutocompleteModule = module.DxAutocompleteModule;
            exports({ DxAutocompleteComponent: module.DxAutocompleteComponent, DxAutocompleteModule: module.DxAutocompleteModule });
        }, function (module) {
            DxBarGaugeModule = module.DxBarGaugeModule;
            exports({ DxBarGaugeComponent: module.DxBarGaugeComponent, DxBarGaugeModule: module.DxBarGaugeModule });
        }, function (module) {
            DxBoxModule = module.DxBoxModule;
            exports({ DxBoxComponent: module.DxBoxComponent, DxBoxModule: module.DxBoxModule });
        }, function (module) {
            DxBulletModule = module.DxBulletModule;
            exports({ DxBulletComponent: module.DxBulletComponent, DxBulletModule: module.DxBulletModule });
        }, function (module) {
            DxButtonModule = module.DxButtonModule;
            exports({ DxButtonComponent: module.DxButtonComponent, DxButtonModule: module.DxButtonModule });
        }, function (module) {
            DxButtonGroupModule = module.DxButtonGroupModule;
            exports({ DxButtonGroupComponent: module.DxButtonGroupComponent, DxButtonGroupModule: module.DxButtonGroupModule });
        }, function (module) {
            DxCalendarModule = module.DxCalendarModule;
            exports({ DxCalendarComponent: module.DxCalendarComponent, DxCalendarModule: module.DxCalendarModule });
        }, function (module) {
            DxChartModule = module.DxChartModule;
            exports({ DxChartComponent: module.DxChartComponent, DxChartModule: module.DxChartModule });
        }, function (module) {
            DxCheckBoxModule = module.DxCheckBoxModule;
            exports({ DxCheckBoxComponent: module.DxCheckBoxComponent, DxCheckBoxModule: module.DxCheckBoxModule });
        }, function (module) {
            DxCircularGaugeModule = module.DxCircularGaugeModule;
            exports({ DxCircularGaugeComponent: module.DxCircularGaugeComponent, DxCircularGaugeModule: module.DxCircularGaugeModule });
        }, function (module) {
            DxColorBoxModule = module.DxColorBoxModule;
            exports({ DxColorBoxComponent: module.DxColorBoxComponent, DxColorBoxModule: module.DxColorBoxModule });
        }, function (module) {
            DxContextMenuModule = module.DxContextMenuModule;
            exports({ DxContextMenuComponent: module.DxContextMenuComponent, DxContextMenuModule: module.DxContextMenuModule });
        }, function (module) {
            DxDataGridModule = module.DxDataGridModule;
            exports({ DxDataGridComponent: module.DxDataGridComponent, DxDataGridModule: module.DxDataGridModule });
        }, function (module) {
            DxDateBoxModule = module.DxDateBoxModule;
            exports({ DxDateBoxComponent: module.DxDateBoxComponent, DxDateBoxModule: module.DxDateBoxModule });
        }, function (module) {
            DxDateRangeBoxModule = module.DxDateRangeBoxModule;
            exports({ DxDateRangeBoxComponent: module.DxDateRangeBoxComponent, DxDateRangeBoxModule: module.DxDateRangeBoxModule });
        }, function (module) {
            DxDeferRenderingModule = module.DxDeferRenderingModule;
            exports({ DxDeferRenderingComponent: module.DxDeferRenderingComponent, DxDeferRenderingModule: module.DxDeferRenderingModule });
        }, function (module) {
            DxDiagramModule = module.DxDiagramModule;
            exports({ DxDiagramComponent: module.DxDiagramComponent, DxDiagramModule: module.DxDiagramModule });
        }, function (module) {
            DxDraggableModule = module.DxDraggableModule;
            exports({ DxDraggableComponent: module.DxDraggableComponent, DxDraggableModule: module.DxDraggableModule });
        }, function (module) {
            DxDrawerModule = module.DxDrawerModule;
            exports({ DxDrawerComponent: module.DxDrawerComponent, DxDrawerModule: module.DxDrawerModule });
        }, function (module) {
            DxDropDownBoxModule = module.DxDropDownBoxModule;
            exports({ DxDropDownBoxComponent: module.DxDropDownBoxComponent, DxDropDownBoxModule: module.DxDropDownBoxModule });
        }, function (module) {
            DxDropDownButtonModule = module.DxDropDownButtonModule;
            exports({ DxDropDownButtonComponent: module.DxDropDownButtonComponent, DxDropDownButtonModule: module.DxDropDownButtonModule });
        }, function (module) {
            DxFileManagerModule = module.DxFileManagerModule;
            exports({ DxFileManagerComponent: module.DxFileManagerComponent, DxFileManagerModule: module.DxFileManagerModule });
        }, function (module) {
            DxFileUploaderModule = module.DxFileUploaderModule;
            exports({ DxFileUploaderComponent: module.DxFileUploaderComponent, DxFileUploaderModule: module.DxFileUploaderModule });
        }, function (module) {
            DxFilterBuilderModule = module.DxFilterBuilderModule;
            exports({ DxFilterBuilderComponent: module.DxFilterBuilderComponent, DxFilterBuilderModule: module.DxFilterBuilderModule });
        }, function (module) {
            DxFormModule = module.DxFormModule;
            exports({ DxFormComponent: module.DxFormComponent, DxFormModule: module.DxFormModule });
        }, function (module) {
            DxFunnelModule = module.DxFunnelModule;
            exports({ DxFunnelComponent: module.DxFunnelComponent, DxFunnelModule: module.DxFunnelModule });
        }, function (module) {
            DxGalleryModule = module.DxGalleryModule;
            exports({ DxGalleryComponent: module.DxGalleryComponent, DxGalleryModule: module.DxGalleryModule });
        }, function (module) {
            DxGanttModule = module.DxGanttModule;
            exports({ DxGanttComponent: module.DxGanttComponent, DxGanttModule: module.DxGanttModule });
        }, function (module) {
            DxHtmlEditorModule = module.DxHtmlEditorModule;
            exports({ DxHtmlEditorComponent: module.DxHtmlEditorComponent, DxHtmlEditorModule: module.DxHtmlEditorModule });
        }, function (module) {
            DxLinearGaugeModule = module.DxLinearGaugeModule;
            exports({ DxLinearGaugeComponent: module.DxLinearGaugeComponent, DxLinearGaugeModule: module.DxLinearGaugeModule });
        }, function (module) {
            DxListModule = module.DxListModule;
            exports({ DxListComponent: module.DxListComponent, DxListModule: module.DxListModule });
        }, function (module) {
            DxLoadIndicatorModule = module.DxLoadIndicatorModule;
            exports({ DxLoadIndicatorComponent: module.DxLoadIndicatorComponent, DxLoadIndicatorModule: module.DxLoadIndicatorModule });
        }, function (module) {
            DxLoadPanelModule = module.DxLoadPanelModule;
            exports({ DxLoadPanelComponent: module.DxLoadPanelComponent, DxLoadPanelModule: module.DxLoadPanelModule });
        }, function (module) {
            DxLookupModule = module.DxLookupModule;
            exports({ DxLookupComponent: module.DxLookupComponent, DxLookupModule: module.DxLookupModule });
        }, function (module) {
            DxMapModule = module.DxMapModule;
            exports({ DxMapComponent: module.DxMapComponent, DxMapModule: module.DxMapModule });
        }, function (module) {
            DxMenuModule = module.DxMenuModule;
            exports({ DxMenuComponent: module.DxMenuComponent, DxMenuModule: module.DxMenuModule });
        }, function (module) {
            DxMultiViewModule = module.DxMultiViewModule;
            exports({ DxMultiViewComponent: module.DxMultiViewComponent, DxMultiViewModule: module.DxMultiViewModule });
        }, function (module) {
            DxNumberBoxModule = module.DxNumberBoxModule;
            exports({ DxNumberBoxComponent: module.DxNumberBoxComponent, DxNumberBoxModule: module.DxNumberBoxModule });
        }, function (module) {
            DxPieChartModule = module.DxPieChartModule;
            exports({ DxPieChartComponent: module.DxPieChartComponent, DxPieChartModule: module.DxPieChartModule });
        }, function (module) {
            DxPivotGridModule = module.DxPivotGridModule;
            exports({ DxPivotGridComponent: module.DxPivotGridComponent, DxPivotGridModule: module.DxPivotGridModule });
        }, function (module) {
            DxPivotGridFieldChooserModule = module.DxPivotGridFieldChooserModule;
            exports({ DxPivotGridFieldChooserComponent: module.DxPivotGridFieldChooserComponent, DxPivotGridFieldChooserModule: module.DxPivotGridFieldChooserModule });
        }, function (module) {
            DxPolarChartModule = module.DxPolarChartModule;
            exports({ DxPolarChartComponent: module.DxPolarChartComponent, DxPolarChartModule: module.DxPolarChartModule });
        }, function (module) {
            DxPopoverModule = module.DxPopoverModule;
            exports({ DxPopoverComponent: module.DxPopoverComponent, DxPopoverModule: module.DxPopoverModule });
        }, function (module) {
            DxPopupModule = module.DxPopupModule;
            exports({ DxPopupComponent: module.DxPopupComponent, DxPopupModule: module.DxPopupModule });
        }, function (module) {
            DxProgressBarModule = module.DxProgressBarModule;
            exports({ DxProgressBarComponent: module.DxProgressBarComponent, DxProgressBarModule: module.DxProgressBarModule });
        }, function (module) {
            DxRadioGroupModule = module.DxRadioGroupModule;
            exports({ DxRadioGroupComponent: module.DxRadioGroupComponent, DxRadioGroupModule: module.DxRadioGroupModule });
        }, function (module) {
            DxRangeSelectorModule = module.DxRangeSelectorModule;
            exports({ DxRangeSelectorComponent: module.DxRangeSelectorComponent, DxRangeSelectorModule: module.DxRangeSelectorModule });
        }, function (module) {
            DxRangeSliderModule = module.DxRangeSliderModule;
            exports({ DxRangeSliderComponent: module.DxRangeSliderComponent, DxRangeSliderModule: module.DxRangeSliderModule });
        }, function (module) {
            DxRecurrenceEditorModule = module.DxRecurrenceEditorModule;
            exports({ DxRecurrenceEditorComponent: module.DxRecurrenceEditorComponent, DxRecurrenceEditorModule: module.DxRecurrenceEditorModule });
        }, function (module) {
            DxResizableModule = module.DxResizableModule;
            exports({ DxResizableComponent: module.DxResizableComponent, DxResizableModule: module.DxResizableModule });
        }, function (module) {
            DxResponsiveBoxModule = module.DxResponsiveBoxModule;
            exports({ DxResponsiveBoxComponent: module.DxResponsiveBoxComponent, DxResponsiveBoxModule: module.DxResponsiveBoxModule });
        }, function (module) {
            DxSankeyModule = module.DxSankeyModule;
            exports({ DxSankeyComponent: module.DxSankeyComponent, DxSankeyModule: module.DxSankeyModule });
        }, function (module) {
            DxSchedulerModule = module.DxSchedulerModule;
            exports({ DxSchedulerComponent: module.DxSchedulerComponent, DxSchedulerModule: module.DxSchedulerModule });
        }, function (module) {
            DxScrollViewModule = module.DxScrollViewModule;
            exports({ DxScrollViewComponent: module.DxScrollViewComponent, DxScrollViewModule: module.DxScrollViewModule });
        }, function (module) {
            DxSelectBoxModule = module.DxSelectBoxModule;
            exports({ DxSelectBoxComponent: module.DxSelectBoxComponent, DxSelectBoxModule: module.DxSelectBoxModule });
        }, function (module) {
            DxSliderModule = module.DxSliderModule;
            exports({ DxSliderComponent: module.DxSliderComponent, DxSliderModule: module.DxSliderModule });
        }, function (module) {
            DxSortableModule = module.DxSortableModule;
            exports({ DxSortableComponent: module.DxSortableComponent, DxSortableModule: module.DxSortableModule });
        }, function (module) {
            DxSparklineModule = module.DxSparklineModule;
            exports({ DxSparklineComponent: module.DxSparklineComponent, DxSparklineModule: module.DxSparklineModule });
        }, function (module) {
            DxSpeedDialActionModule = module.DxSpeedDialActionModule;
            exports({ DxSpeedDialActionComponent: module.DxSpeedDialActionComponent, DxSpeedDialActionModule: module.DxSpeedDialActionModule });
        }, function (module) {
            DxSplitterModule = module.DxSplitterModule;
            exports({ DxSplitterComponent: module.DxSplitterComponent, DxSplitterModule: module.DxSplitterModule });
        }, function (module) {
            DxSwitchModule = module.DxSwitchModule;
            exports({ DxSwitchComponent: module.DxSwitchComponent, DxSwitchModule: module.DxSwitchModule });
        }, function (module) {
            DxTabPanelModule = module.DxTabPanelModule;
            exports({ DxTabPanelComponent: module.DxTabPanelComponent, DxTabPanelModule: module.DxTabPanelModule });
        }, function (module) {
            DxTabsModule = module.DxTabsModule;
            exports({ DxTabsComponent: module.DxTabsComponent, DxTabsModule: module.DxTabsModule });
        }, function (module) {
            DxTagBoxModule = module.DxTagBoxModule;
            exports({ DxTagBoxComponent: module.DxTagBoxComponent, DxTagBoxModule: module.DxTagBoxModule });
        }, function (module) {
            DxTextAreaModule = module.DxTextAreaModule;
            exports({ DxTextAreaComponent: module.DxTextAreaComponent, DxTextAreaModule: module.DxTextAreaModule });
        }, function (module) {
            DxTextBoxModule = module.DxTextBoxModule;
            exports({ DxTextBoxComponent: module.DxTextBoxComponent, DxTextBoxModule: module.DxTextBoxModule });
        }, function (module) {
            DxTileViewModule = module.DxTileViewModule;
            exports({ DxTileViewComponent: module.DxTileViewComponent, DxTileViewModule: module.DxTileViewModule });
        }, function (module) {
            DxToastModule = module.DxToastModule;
            exports({ DxToastComponent: module.DxToastComponent, DxToastModule: module.DxToastModule });
        }, function (module) {
            DxToolbarModule = module.DxToolbarModule;
            exports({ DxToolbarComponent: module.DxToolbarComponent, DxToolbarModule: module.DxToolbarModule });
        }, function (module) {
            DxTooltipModule = module.DxTooltipModule;
            exports({ DxTooltipComponent: module.DxTooltipComponent, DxTooltipModule: module.DxTooltipModule });
        }, function (module) {
            DxTreeListModule = module.DxTreeListModule;
            exports({ DxTreeListComponent: module.DxTreeListComponent, DxTreeListModule: module.DxTreeListModule });
        }, function (module) {
            DxTreeMapModule = module.DxTreeMapModule;
            exports({ DxTreeMapComponent: module.DxTreeMapComponent, DxTreeMapModule: module.DxTreeMapModule });
        }, function (module) {
            DxTreeViewModule = module.DxTreeViewModule;
            exports({ DxTreeViewComponent: module.DxTreeViewComponent, DxTreeViewModule: module.DxTreeViewModule });
        }, function (module) {
            DxValidationGroupModule = module.DxValidationGroupModule;
            exports({ DxValidationGroupComponent: module.DxValidationGroupComponent, DxValidationGroupModule: module.DxValidationGroupModule });
        }, function (module) {
            DxValidationSummaryModule = module.DxValidationSummaryModule;
            exports({ DxValidationSummaryComponent: module.DxValidationSummaryComponent, DxValidationSummaryModule: module.DxValidationSummaryModule });
        }, function (module) {
            DxValidatorModule = module.DxValidatorModule;
            exports({ DxValidatorComponent: module.DxValidatorComponent, DxValidatorModule: module.DxValidatorModule });
        }, function (module) {
            DxVectorMapModule = module.DxVectorMapModule;
            exports({ DxVectorMapComponent: module.DxVectorMapComponent, DxVectorMapModule: module.DxVectorMapModule });
        }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            class DevExtremeModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DevExtremeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DevExtremeModule, imports: [DxAccordionModule,
                        DxActionSheetModule,
                        DxAutocompleteModule,
                        DxBarGaugeModule,
                        DxBoxModule,
                        DxBulletModule,
                        DxButtonModule,
                        DxButtonGroupModule,
                        DxCalendarModule,
                        DxChartModule,
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
                        DxTemplateModule], exports: [DxAccordionModule,
                        DxActionSheetModule,
                        DxAutocompleteModule,
                        DxBarGaugeModule,
                        DxBoxModule,
                        DxBulletModule,
                        DxButtonModule,
                        DxButtonGroupModule,
                        DxCalendarModule,
                        DxChartModule,
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
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DevExtremeModule, imports: [DxAccordionModule,
                        DxActionSheetModule,
                        DxAutocompleteModule,
                        DxBarGaugeModule,
                        DxBoxModule,
                        DxBulletModule,
                        DxButtonModule,
                        DxButtonGroupModule,
                        DxCalendarModule,
                        DxChartModule,
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
                        DxTemplateModule, DxAccordionModule,
                        DxActionSheetModule,
                        DxAutocompleteModule,
                        DxBarGaugeModule,
                        DxBoxModule,
                        DxBulletModule,
                        DxButtonModule,
                        DxButtonGroupModule,
                        DxCalendarModule,
                        DxChartModule,
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
                        DxTemplateModule] });
            } exports("DevExtremeModule", DevExtremeModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DevExtremeModule, decorators: [{
                        type: NgModule,
                        args: [{
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
                            }]
                    }] });

        })
    };
}));
