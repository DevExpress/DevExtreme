/* #StartGlobalDeclaration */
interface JQuery {
}
interface JQueryPromise<T> {
}
interface JQueryCallback {
}
interface JQueryEventObject {
    cancel?: boolean;
}
interface PromiseLike<T> {
}
interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T, extraParameters: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
}
/* #EndGlobalDeclaration */
/* #StartJQueryAugmentation */
interface JQuery {
    dxAccordion(): JQuery;
    dxAccordion(options: "instance"): DevExpress.ui.dxAccordion;
    dxAccordion(options: string): any;
    dxAccordion(options: string, ...params: any[]): any;
    dxAccordion(options: DevExpress.ui.dxAccordionOptions): JQuery;
}
interface JQuery {
    dxActionSheet(): JQuery;
    dxActionSheet(options: "instance"): DevExpress.ui.dxActionSheet;
    dxActionSheet(options: string): any;
    dxActionSheet(options: string, ...params: any[]): any;
    dxActionSheet(options: DevExpress.ui.dxActionSheetOptions): JQuery;
}
interface JQuery {
    dxAutocomplete(): JQuery;
    dxAutocomplete(options: "instance"): DevExpress.ui.dxAutocomplete;
    dxAutocomplete(options: string): any;
    dxAutocomplete(options: string, ...params: any[]): any;
    dxAutocomplete(options: DevExpress.ui.dxAutocompleteOptions): JQuery;
}
interface JQuery {
    dxBox(): JQuery;
    dxBox(options: "instance"): DevExpress.ui.dxBox;
    dxBox(options: string): any;
    dxBox(options: string, ...params: any[]): any;
    dxBox(options: DevExpress.ui.dxBoxOptions): JQuery;
}
interface JQuery {
    dxButton(): JQuery;
    dxButton(options: "instance"): DevExpress.ui.dxButton;
    dxButton(options: string): any;
    dxButton(options: string, ...params: any[]): any;
    dxButton(options: DevExpress.ui.dxButtonOptions): JQuery;
}
interface JQuery {
    dxButtonGroup(): JQuery;
    dxButtonGroup(options: "instance"): DevExpress.ui.dxButtonGroup;
    dxButtonGroup(options: string): any;
    dxButtonGroup(options: string, ...params: any[]): any;
    dxButtonGroup(options: DevExpress.ui.dxButtonGroupOptions): JQuery;
}
interface JQuery {
    dxCalendar(): JQuery;
    dxCalendar(options: "instance"): DevExpress.ui.dxCalendar;
    dxCalendar(options: string): any;
    dxCalendar(options: string, ...params: any[]): any;
    dxCalendar(options: DevExpress.ui.dxCalendarOptions): JQuery;
}
interface JQuery {
    dxCheckBox(): JQuery;
    dxCheckBox(options: "instance"): DevExpress.ui.dxCheckBox;
    dxCheckBox(options: string): any;
    dxCheckBox(options: string, ...params: any[]): any;
    dxCheckBox(options: DevExpress.ui.dxCheckBoxOptions): JQuery;
}
interface JQuery {
    dxColorBox(): JQuery;
    dxColorBox(options: "instance"): DevExpress.ui.dxColorBox;
    dxColorBox(options: string): any;
    dxColorBox(options: string, ...params: any[]): any;
    dxColorBox(options: DevExpress.ui.dxColorBoxOptions): JQuery;
}
interface JQuery {
    dxContextMenu(): JQuery;
    dxContextMenu(options: "instance"): DevExpress.ui.dxContextMenu;
    dxContextMenu(options: string): any;
    dxContextMenu(options: string, ...params: any[]): any;
    dxContextMenu(options: DevExpress.ui.dxContextMenuOptions): JQuery;
}
interface JQuery {
    dxDataGrid(): JQuery;
    dxDataGrid(options: "instance"): DevExpress.ui.dxDataGrid;
    dxDataGrid(options: string): any;
    dxDataGrid(options: string, ...params: any[]): any;
    dxDataGrid(options: DevExpress.ui.dxDataGridOptions): JQuery;
}
interface JQuery {
    dxDateBox(): JQuery;
    dxDateBox(options: "instance"): DevExpress.ui.dxDateBox;
    dxDateBox(options: string): any;
    dxDateBox(options: string, ...params: any[]): any;
    dxDateBox(options: DevExpress.ui.dxDateBoxOptions): JQuery;
}
interface JQuery {
    dxDeferRendering(): JQuery;
    dxDeferRendering(options: "instance"): DevExpress.ui.dxDeferRendering;
    dxDeferRendering(options: string): any;
    dxDeferRendering(options: string, ...params: any[]): any;
    dxDeferRendering(options: DevExpress.ui.dxDeferRenderingOptions): JQuery;
}
interface JQuery {
    dxDiagram(): JQuery;
    dxDiagram(options: "instance"): DevExpress.ui.dxDiagram;
    dxDiagram(options: string): any;
    dxDiagram(options: string, ...params: any[]): any;
    dxDiagram(options: DevExpress.ui.dxDiagramOptions): JQuery;
}
interface JQuery {
    dxDraggable(): JQuery;
    dxDraggable(options: "instance"): DevExpress.ui.dxDraggable;
    dxDraggable(options: string): any;
    dxDraggable(options: string, ...params: any[]): any;
    dxDraggable(options: DevExpress.ui.dxDraggableOptions): JQuery;
}
interface JQuery {
    dxDrawer(): JQuery;
    dxDrawer(options: "instance"): DevExpress.ui.dxDrawer;
    dxDrawer(options: string): any;
    dxDrawer(options: string, ...params: any[]): any;
    dxDrawer(options: DevExpress.ui.dxDrawerOptions): JQuery;
}
interface JQuery {
    dxDropDownBox(): JQuery;
    dxDropDownBox(options: "instance"): DevExpress.ui.dxDropDownBox;
    dxDropDownBox(options: string): any;
    dxDropDownBox(options: string, ...params: any[]): any;
    dxDropDownBox(options: DevExpress.ui.dxDropDownBoxOptions): JQuery;
}
interface JQuery {
    dxDropDownButton(): JQuery;
    dxDropDownButton(options: "instance"): DevExpress.ui.dxDropDownButton;
    dxDropDownButton(options: string): any;
    dxDropDownButton(options: string, ...params: any[]): any;
    dxDropDownButton(options: DevExpress.ui.dxDropDownButtonOptions): JQuery;
}
interface JQuery {
    dxFileManager(): JQuery;
    dxFileManager(options: "instance"): DevExpress.ui.dxFileManager;
    dxFileManager(options: string): any;
    dxFileManager(options: string, ...params: any[]): any;
    dxFileManager(options: DevExpress.ui.dxFileManagerOptions): JQuery;
}
interface JQuery {
    dxFileUploader(): JQuery;
    dxFileUploader(options: "instance"): DevExpress.ui.dxFileUploader;
    dxFileUploader(options: string): any;
    dxFileUploader(options: string, ...params: any[]): any;
    dxFileUploader(options: DevExpress.ui.dxFileUploaderOptions): JQuery;
}
interface JQuery {
    dxFilterBuilder(): JQuery;
    dxFilterBuilder(options: "instance"): DevExpress.ui.dxFilterBuilder;
    dxFilterBuilder(options: string): any;
    dxFilterBuilder(options: string, ...params: any[]): any;
    dxFilterBuilder(options: DevExpress.ui.dxFilterBuilderOptions): JQuery;
}
interface JQuery {
    dxForm(): JQuery;
    dxForm(options: "instance"): DevExpress.ui.dxForm;
    dxForm(options: string): any;
    dxForm(options: string, ...params: any[]): any;
    dxForm(options: DevExpress.ui.dxFormOptions): JQuery;
}
interface JQuery {
    dxGallery(): JQuery;
    dxGallery(options: "instance"): DevExpress.ui.dxGallery;
    dxGallery(options: string): any;
    dxGallery(options: string, ...params: any[]): any;
    dxGallery(options: DevExpress.ui.dxGalleryOptions): JQuery;
}
interface JQuery {
    dxGantt(): JQuery;
    dxGantt(options: "instance"): DevExpress.ui.dxGantt;
    dxGantt(options: string): any;
    dxGantt(options: string, ...params: any[]): any;
    dxGantt(options: DevExpress.ui.dxGanttOptions): JQuery;
}
interface JQuery {
    dxHtmlEditor(): JQuery;
    dxHtmlEditor(options: "instance"): DevExpress.ui.dxHtmlEditor;
    dxHtmlEditor(options: string): any;
    dxHtmlEditor(options: string, ...params: any[]): any;
    dxHtmlEditor(options: DevExpress.ui.dxHtmlEditorOptions): JQuery;
}
interface JQuery {
    dxList(): JQuery;
    dxList(options: "instance"): DevExpress.ui.dxList;
    dxList(options: string): any;
    dxList(options: string, ...params: any[]): any;
    dxList(options: DevExpress.ui.dxListOptions): JQuery;
}
interface JQuery {
    dxLoadIndicator(): JQuery;
    dxLoadIndicator(options: "instance"): DevExpress.ui.dxLoadIndicator;
    dxLoadIndicator(options: string): any;
    dxLoadIndicator(options: string, ...params: any[]): any;
    dxLoadIndicator(options: DevExpress.ui.dxLoadIndicatorOptions): JQuery;
}
interface JQuery {
    dxLoadPanel(): JQuery;
    dxLoadPanel(options: "instance"): DevExpress.ui.dxLoadPanel;
    dxLoadPanel(options: string): any;
    dxLoadPanel(options: string, ...params: any[]): any;
    dxLoadPanel(options: DevExpress.ui.dxLoadPanelOptions): JQuery;
}
interface JQuery {
    dxLookup(): JQuery;
    dxLookup(options: "instance"): DevExpress.ui.dxLookup;
    dxLookup(options: string): any;
    dxLookup(options: string, ...params: any[]): any;
    dxLookup(options: DevExpress.ui.dxLookupOptions): JQuery;
}
interface JQuery {
    dxMap(): JQuery;
    dxMap(options: "instance"): DevExpress.ui.dxMap;
    dxMap(options: string): any;
    dxMap(options: string, ...params: any[]): any;
    dxMap(options: DevExpress.ui.dxMapOptions): JQuery;
}
interface JQuery {
    dxMenu(): JQuery;
    dxMenu(options: "instance"): DevExpress.ui.dxMenu;
    dxMenu(options: string): any;
    dxMenu(options: string, ...params: any[]): any;
    dxMenu(options: DevExpress.ui.dxMenuOptions): JQuery;
}
interface JQuery {
    dxMultiView(): JQuery;
    dxMultiView(options: "instance"): DevExpress.ui.dxMultiView;
    dxMultiView(options: string): any;
    dxMultiView(options: string, ...params: any[]): any;
    dxMultiView(options: DevExpress.ui.dxMultiViewOptions): JQuery;
}
interface JQuery {
    dxNavBar(): JQuery;
    dxNavBar(options: "instance"): DevExpress.ui.dxNavBar;
    dxNavBar(options: string): any;
    dxNavBar(options: string, ...params: any[]): any;
    dxNavBar(options: DevExpress.ui.dxNavBarOptions): JQuery;
}
interface JQuery {
    dxNumberBox(): JQuery;
    dxNumberBox(options: "instance"): DevExpress.ui.dxNumberBox;
    dxNumberBox(options: string): any;
    dxNumberBox(options: string, ...params: any[]): any;
    dxNumberBox(options: DevExpress.ui.dxNumberBoxOptions): JQuery;
}
interface JQuery {
    dxPivotGrid(): JQuery;
    dxPivotGrid(options: "instance"): DevExpress.ui.dxPivotGrid;
    dxPivotGrid(options: string): any;
    dxPivotGrid(options: string, ...params: any[]): any;
    dxPivotGrid(options: DevExpress.ui.dxPivotGridOptions): JQuery;
}
interface JQuery {
    dxPivotGridFieldChooser(): JQuery;
    dxPivotGridFieldChooser(options: "instance"): DevExpress.ui.dxPivotGridFieldChooser;
    dxPivotGridFieldChooser(options: string): any;
    dxPivotGridFieldChooser(options: string, ...params: any[]): any;
    dxPivotGridFieldChooser(options: DevExpress.ui.dxPivotGridFieldChooserOptions): JQuery;
}
interface JQuery {
    dxPopover(): JQuery;
    dxPopover(options: "instance"): DevExpress.ui.dxPopover;
    dxPopover(options: string): any;
    dxPopover(options: string, ...params: any[]): any;
    dxPopover(options: DevExpress.ui.dxPopoverOptions): JQuery;
}
interface JQuery {
    dxPopup(): JQuery;
    dxPopup(options: "instance"): DevExpress.ui.dxPopup;
    dxPopup(options: string): any;
    dxPopup(options: string, ...params: any[]): any;
    dxPopup(options: DevExpress.ui.dxPopupOptions): JQuery;
}
interface JQuery {
    dxProgressBar(): JQuery;
    dxProgressBar(options: "instance"): DevExpress.ui.dxProgressBar;
    dxProgressBar(options: string): any;
    dxProgressBar(options: string, ...params: any[]): any;
    dxProgressBar(options: DevExpress.ui.dxProgressBarOptions): JQuery;
}
interface JQuery {
    dxRadioGroup(): JQuery;
    dxRadioGroup(options: "instance"): DevExpress.ui.dxRadioGroup;
    dxRadioGroup(options: string): any;
    dxRadioGroup(options: string, ...params: any[]): any;
    dxRadioGroup(options: DevExpress.ui.dxRadioGroupOptions): JQuery;
}
interface JQuery {
    dxRangeSlider(): JQuery;
    dxRangeSlider(options: "instance"): DevExpress.ui.dxRangeSlider;
    dxRangeSlider(options: string): any;
    dxRangeSlider(options: string, ...params: any[]): any;
    dxRangeSlider(options: DevExpress.ui.dxRangeSliderOptions): JQuery;
}
interface JQuery {
    dxRecurrenceEditor(): JQuery;
    dxRecurrenceEditor(options: "instance"): DevExpress.ui.dxRecurrenceEditor;
    dxRecurrenceEditor(options: string): any;
    dxRecurrenceEditor(options: string, ...params: any[]): any;
    dxRecurrenceEditor(options: DevExpress.ui.dxRecurrenceEditorOptions): JQuery;
}
interface JQuery {
    dxResizable(): JQuery;
    dxResizable(options: "instance"): DevExpress.ui.dxResizable;
    dxResizable(options: string): any;
    dxResizable(options: string, ...params: any[]): any;
    dxResizable(options: DevExpress.ui.dxResizableOptions): JQuery;
}
interface JQuery {
    dxResponsiveBox(): JQuery;
    dxResponsiveBox(options: "instance"): DevExpress.ui.dxResponsiveBox;
    dxResponsiveBox(options: string): any;
    dxResponsiveBox(options: string, ...params: any[]): any;
    dxResponsiveBox(options: DevExpress.ui.dxResponsiveBoxOptions): JQuery;
}
interface JQuery {
    dxScheduler(): JQuery;
    dxScheduler(options: "instance"): DevExpress.ui.dxScheduler;
    dxScheduler(options: string): any;
    dxScheduler(options: string, ...params: any[]): any;
    dxScheduler(options: DevExpress.ui.dxSchedulerOptions): JQuery;
}
interface JQuery {
    dxScrollView(): JQuery;
    dxScrollView(options: "instance"): DevExpress.ui.dxScrollView;
    dxScrollView(options: string): any;
    dxScrollView(options: string, ...params: any[]): any;
    dxScrollView(options: DevExpress.ui.dxScrollViewOptions): JQuery;
}
interface JQuery {
    dxSelectBox(): JQuery;
    dxSelectBox(options: "instance"): DevExpress.ui.dxSelectBox;
    dxSelectBox(options: string): any;
    dxSelectBox(options: string, ...params: any[]): any;
    dxSelectBox(options: DevExpress.ui.dxSelectBoxOptions): JQuery;
}
interface JQuery {
    dxSlideOut(): JQuery;
    dxSlideOut(options: "instance"): DevExpress.ui.dxSlideOut;
    dxSlideOut(options: string): any;
    dxSlideOut(options: string, ...params: any[]): any;
    dxSlideOut(options: DevExpress.ui.dxSlideOutOptions): JQuery;
}
interface JQuery {
    dxSlideOutView(): JQuery;
    dxSlideOutView(options: "instance"): DevExpress.ui.dxSlideOutView;
    dxSlideOutView(options: string): any;
    dxSlideOutView(options: string, ...params: any[]): any;
    dxSlideOutView(options: DevExpress.ui.dxSlideOutViewOptions): JQuery;
}
interface JQuery {
    dxSlider(): JQuery;
    dxSlider(options: "instance"): DevExpress.ui.dxSlider;
    dxSlider(options: string): any;
    dxSlider(options: string, ...params: any[]): any;
    dxSlider(options: DevExpress.ui.dxSliderOptions): JQuery;
}
interface JQuery {
    dxSortable(): JQuery;
    dxSortable(options: "instance"): DevExpress.ui.dxSortable;
    dxSortable(options: string): any;
    dxSortable(options: string, ...params: any[]): any;
    dxSortable(options: DevExpress.ui.dxSortableOptions): JQuery;
}
interface JQuery {
    dxSpeedDialAction(): JQuery;
    dxSpeedDialAction(options: "instance"): DevExpress.ui.dxSpeedDialAction;
    dxSpeedDialAction(options: string): any;
    dxSpeedDialAction(options: string, ...params: any[]): any;
    dxSpeedDialAction(options: DevExpress.ui.dxSpeedDialActionOptions): JQuery;
}
interface JQuery {
    dxSwitch(): JQuery;
    dxSwitch(options: "instance"): DevExpress.ui.dxSwitch;
    dxSwitch(options: string): any;
    dxSwitch(options: string, ...params: any[]): any;
    dxSwitch(options: DevExpress.ui.dxSwitchOptions): JQuery;
}
interface JQuery {
    dxTabPanel(): JQuery;
    dxTabPanel(options: "instance"): DevExpress.ui.dxTabPanel;
    dxTabPanel(options: string): any;
    dxTabPanel(options: string, ...params: any[]): any;
    dxTabPanel(options: DevExpress.ui.dxTabPanelOptions): JQuery;
}
interface JQuery {
    dxTabs(): JQuery;
    dxTabs(options: "instance"): DevExpress.ui.dxTabs;
    dxTabs(options: string): any;
    dxTabs(options: string, ...params: any[]): any;
    dxTabs(options: DevExpress.ui.dxTabsOptions): JQuery;
}
interface JQuery {
    dxTagBox(): JQuery;
    dxTagBox(options: "instance"): DevExpress.ui.dxTagBox;
    dxTagBox(options: string): any;
    dxTagBox(options: string, ...params: any[]): any;
    dxTagBox(options: DevExpress.ui.dxTagBoxOptions): JQuery;
}
interface JQuery {
    dxTextArea(): JQuery;
    dxTextArea(options: "instance"): DevExpress.ui.dxTextArea;
    dxTextArea(options: string): any;
    dxTextArea(options: string, ...params: any[]): any;
    dxTextArea(options: DevExpress.ui.dxTextAreaOptions): JQuery;
}
interface JQuery {
    dxTextBox(): JQuery;
    dxTextBox(options: "instance"): DevExpress.ui.dxTextBox;
    dxTextBox(options: string): any;
    dxTextBox(options: string, ...params: any[]): any;
    dxTextBox(options: DevExpress.ui.dxTextBoxOptions): JQuery;
}
interface JQuery {
    dxTileView(): JQuery;
    dxTileView(options: "instance"): DevExpress.ui.dxTileView;
    dxTileView(options: string): any;
    dxTileView(options: string, ...params: any[]): any;
    dxTileView(options: DevExpress.ui.dxTileViewOptions): JQuery;
}
interface JQuery {
    dxToast(): JQuery;
    dxToast(options: "instance"): DevExpress.ui.dxToast;
    dxToast(options: string): any;
    dxToast(options: string, ...params: any[]): any;
    dxToast(options: DevExpress.ui.dxToastOptions): JQuery;
}
interface JQuery {
    dxToolbar(): JQuery;
    dxToolbar(options: "instance"): DevExpress.ui.dxToolbar;
    dxToolbar(options: string): any;
    dxToolbar(options: string, ...params: any[]): any;
    dxToolbar(options: DevExpress.ui.dxToolbarOptions): JQuery;
}
interface JQuery {
    dxTooltip(): JQuery;
    dxTooltip(options: "instance"): DevExpress.ui.dxTooltip;
    dxTooltip(options: string): any;
    dxTooltip(options: string, ...params: any[]): any;
    dxTooltip(options: DevExpress.ui.dxTooltipOptions): JQuery;
}
interface JQuery {
    dxTreeList(): JQuery;
    dxTreeList(options: "instance"): DevExpress.ui.dxTreeList;
    dxTreeList(options: string): any;
    dxTreeList(options: string, ...params: any[]): any;
    dxTreeList(options: DevExpress.ui.dxTreeListOptions): JQuery;
}
interface JQuery {
    dxTreeView(): JQuery;
    dxTreeView(options: "instance"): DevExpress.ui.dxTreeView;
    dxTreeView(options: string): any;
    dxTreeView(options: string, ...params: any[]): any;
    dxTreeView(options: DevExpress.ui.dxTreeViewOptions): JQuery;
}
interface JQuery {
    dxValidationGroup(): JQuery;
    dxValidationGroup(options: "instance"): DevExpress.ui.dxValidationGroup;
    dxValidationGroup(options: string): any;
    dxValidationGroup(options: string, ...params: any[]): any;
    dxValidationGroup(options: DevExpress.ui.dxValidationGroupOptions): JQuery;
}
interface JQuery {
    dxValidationSummary(): JQuery;
    dxValidationSummary(options: "instance"): DevExpress.ui.dxValidationSummary;
    dxValidationSummary(options: string): any;
    dxValidationSummary(options: string, ...params: any[]): any;
    dxValidationSummary(options: DevExpress.ui.dxValidationSummaryOptions): JQuery;
}
interface JQuery {
    dxValidator(): JQuery;
    dxValidator(options: "instance"): DevExpress.ui.dxValidator;
    dxValidator(options: string): any;
    dxValidator(options: string, ...params: any[]): any;
    dxValidator(options: DevExpress.ui.dxValidatorOptions): JQuery;
}
interface JQuery {
    dxBarGauge(): JQuery;
    dxBarGauge(options: "instance"): DevExpress.viz.dxBarGauge;
    dxBarGauge(options: string): any;
    dxBarGauge(options: string, ...params: any[]): any;
    dxBarGauge(options: DevExpress.viz.dxBarGaugeOptions): JQuery;
}
interface JQuery {
    dxBullet(): JQuery;
    dxBullet(options: "instance"): DevExpress.viz.dxBullet;
    dxBullet(options: string): any;
    dxBullet(options: string, ...params: any[]): any;
    dxBullet(options: DevExpress.viz.dxBulletOptions): JQuery;
}
interface JQuery {
    dxChart(): JQuery;
    dxChart(options: "instance"): DevExpress.viz.dxChart;
    dxChart(options: string): any;
    dxChart(options: string, ...params: any[]): any;
    dxChart(options: DevExpress.viz.dxChartOptions): JQuery;
}
interface JQuery {
    dxCircularGauge(): JQuery;
    dxCircularGauge(options: "instance"): DevExpress.viz.dxCircularGauge;
    dxCircularGauge(options: string): any;
    dxCircularGauge(options: string, ...params: any[]): any;
    dxCircularGauge(options: DevExpress.viz.dxCircularGaugeOptions): JQuery;
}
interface JQuery {
    dxFunnel(): JQuery;
    dxFunnel(options: "instance"): DevExpress.viz.dxFunnel;
    dxFunnel(options: string): any;
    dxFunnel(options: string, ...params: any[]): any;
    dxFunnel(options: DevExpress.viz.dxFunnelOptions): JQuery;
}
interface JQuery {
    dxLinearGauge(): JQuery;
    dxLinearGauge(options: "instance"): DevExpress.viz.dxLinearGauge;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;
    dxLinearGauge(options: DevExpress.viz.dxLinearGaugeOptions): JQuery;
}
interface JQuery {
    dxPieChart(): JQuery;
    dxPieChart(options: "instance"): DevExpress.viz.dxPieChart;
    dxPieChart(options: string): any;
    dxPieChart(options: string, ...params: any[]): any;
    dxPieChart(options: DevExpress.viz.dxPieChartOptions): JQuery;
}
interface JQuery {
    dxPolarChart(): JQuery;
    dxPolarChart(options: "instance"): DevExpress.viz.dxPolarChart;
    dxPolarChart(options: string): any;
    dxPolarChart(options: string, ...params: any[]): any;
    dxPolarChart(options: DevExpress.viz.dxPolarChartOptions): JQuery;
}
interface JQuery {
    dxRangeSelector(): JQuery;
    dxRangeSelector(options: "instance"): DevExpress.viz.dxRangeSelector;
    dxRangeSelector(options: string): any;
    dxRangeSelector(options: string, ...params: any[]): any;
    dxRangeSelector(options: DevExpress.viz.dxRangeSelectorOptions): JQuery;
}
interface JQuery {
    dxSankey(): JQuery;
    dxSankey(options: "instance"): DevExpress.viz.dxSankey;
    dxSankey(options: string): any;
    dxSankey(options: string, ...params: any[]): any;
    dxSankey(options: DevExpress.viz.dxSankeyOptions): JQuery;
}
interface JQuery {
    dxSparkline(): JQuery;
    dxSparkline(options: "instance"): DevExpress.viz.dxSparkline;
    dxSparkline(options: string): any;
    dxSparkline(options: string, ...params: any[]): any;
    dxSparkline(options: DevExpress.viz.dxSparklineOptions): JQuery;
}
interface JQuery {
    dxTreeMap(): JQuery;
    dxTreeMap(options: "instance"): DevExpress.viz.dxTreeMap;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;
    dxTreeMap(options: DevExpress.viz.dxTreeMapOptions): JQuery;
}
interface JQuery {
    dxVectorMap(): JQuery;
    dxVectorMap(options: "instance"): DevExpress.viz.dxVectorMap;
    dxVectorMap(options: string): any;
    dxVectorMap(options: string, ...params: any[]): any;
    dxVectorMap(options: DevExpress.viz.dxVectorMapOptions): JQuery;
}
/* #EndJQueryAugmentation */
declare module DevExpress {
    /** @name Component.Options */
    export interface ComponentOptions<T = Component> {
        /** @name Component.Options.onDisposing */
        onDisposing?: ((e: { component?: T }) => any);
        /** @name Component.Options.onInitialized */
        onInitialized?: ((e: { component?: T, element?: DevExpress.core.dxElement }) => any);
        /** @name Component.Options.onOptionChanged */
        onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => any);
    }
    /** @name Component */
    export class Component {
        constructor(options?: ComponentOptions);
        /** @name Component.beginUpdate() */
        beginUpdate(): void;
        /** @name Component.endUpdate() */
        endUpdate(): void;
        /** @name Component.instance() */
        instance(): this;
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
        /** @name Component.option() */
        option(): any;
        /** @name Component.option(optionName) */
        option(optionName: string): any;
        /** @name Component.option(optionName, optionValue) */
        option(optionName: string, optionValue: any): void;
        /** @name Component.option(options) */
        option(options: any): void;
        /** @name Component.resetOption(optionName) */
        resetOption(optionName: string): void;
    }
    /** @name DOMComponent.Options */
    export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
        /** @name DOMComponent.Options.bindingOptions */
        bindingOptions?: any;
        /** @name DOMComponent.Options.elementAttr */
        elementAttr?: any;
        /** @name DOMComponent.Options.height */
        height?: number | string | (() => number | string);
        /** @name DOMComponent.Options.onDisposing */
        onDisposing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name DOMComponent.Options.onOptionChanged */
        onOptionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, name?: string, fullName?: string, value?: any }) => any);
        /** @name DOMComponent.Options.rtlEnabled */
        rtlEnabled?: boolean;
        /** @name DOMComponent.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name DOMComponent */
    export class DOMComponent extends Component {
        constructor(element: Element | JQuery, options?: DOMComponentOptions);
        /** @name DOMComponent.defaultOptions(rule) */
        static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
        /** @name DOMComponent.dispose() */
        dispose(): void;
        /** @name DOMComponent.element() */
        element(): DevExpress.core.dxElement;
        /** @name DOMComponent.getInstance(element) */
        static getInstance(element: Element | JQuery): DOMComponent;
    }
    /** @name DataHelperMixin */
    export class DataHelperMixin {
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name Device */
    export interface Device {
        /** @name Device.android */
        android?: boolean;
        /** @name Device.deviceType */
        deviceType?: 'phone' | 'tablet' | 'desktop';
        /** @name Device.generic */
        generic?: boolean;
        /** @name Device.grade */
        grade?: 'A' | 'B' | 'C';
        /** @name Device.ios */
        ios?: boolean;
        /** @name Device.phone */
        phone?: boolean;
        /** @name Device.platform */
        platform?: 'android' | 'ios' | 'generic';
        /** @name Device.tablet */
        tablet?: boolean;
        /** @name Device.version */
        version?: Array<number>;
    }
    /** @name DevicesObject */
    export class DevicesObject {
        constructor(options: { window?: Window });
        /** @name DevicesObject.current() */
        current(): Device;
        /** @name DevicesObject.current(deviceName) */
        current(deviceName: string | Device): void;
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
        /** @name DevicesObject.orientation() */
        orientation(): string;
        /** @name DevicesObject.real() */
        real(): Device;
    }
    /** @name EndpointSelector */
    export class EndpointSelector {
        constructor(options: any);
        /** @name EndpointSelector.urlFor(key) */
        urlFor(key: string): string;
    }
    /** @name TransitionExecutor */
    export class TransitionExecutor {
        /** @name TransitionExecutor.enter(elements, animation) */
        enter(elements: JQuery, animation: animationConfig | string): void;
        /** @name TransitionExecutor.leave(elements, animation) */
        leave(elements: JQuery, animation: animationConfig | string): void;
        /** @name TransitionExecutor.reset() */
        reset(): void;
        /** @name TransitionExecutor.start() */
        start(): Promise<void> & JQueryPromise<void>;
        /** @name TransitionExecutor.stop() */
        stop(): void;
    }
    /** @name animationConfig */
    export interface animationConfig {
        /** @name animationConfig.complete */
        complete?: (($element: DevExpress.core.dxElement, config: any) => any);
        /** @name animationConfig.delay */
        delay?: number;
        /** @name animationConfig.direction */
        direction?: 'bottom' | 'left' | 'right' | 'top';
        /** @name animationConfig.duration */
        duration?: number;
        /** @name animationConfig.easing */
        easing?: string;
        /** @name animationConfig.from */
        from?: number | string | any;
        /** @name animationConfig.staggerDelay */
        staggerDelay?: number;
        /** @name animationConfig.start */
        start?: (($element: DevExpress.core.dxElement, config: any) => any);
        /** @name animationConfig.to */
        to?: number | string | any;
        /** @name animationConfig.type */
        type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
    }
    /** @name animationPresets */
    export class animationPresets {
        /** @name animationPresets.applyChanges() */
        applyChanges(): void;
        /** @name animationPresets.clear() */
        clear(): void;
        /** @name animationPresets.clear(name) */
        clear(name: string): void;
        /** @name animationPresets.getPreset(name) */
        getPreset(name: string): any;
        /** @name animationPresets.registerDefaultPresets() */
        registerDefaultPresets(): void;
        /** @name animationPresets.registerPreset(name, config) */
        registerPreset(name: string, config: { animation?: animationConfig, device?: Device }): void;
        /** @name animationPresets.resetToDefaults() */
        resetToDefaults(): void;
    }
    /** @name config() */
    export function config(): globalConfig;
    /** @name config(config) */
    export function config(config: globalConfig): void;
    /** @name devices */
    export var devices: DevicesObject;
    /** @name dxEvent */
    export class dxEvent {
        /** @name dxEvent.currentTarget */
        currentTarget: Element;
        /** @name dxEvent.data */
        data: any;
        /** @name dxEvent.delegateTarget */
        delegateTarget: Element;
        /** @name dxEvent.target */
        target: Element;
        /** @name dxEvent.isDefaultPrevented() */
        isDefaultPrevented(): boolean;
        /** @name dxEvent.isImmediatePropagationStopped() */
        isImmediatePropagationStopped(): boolean;
        /** @name dxEvent.isPropagationStopped() */
        isPropagationStopped(): boolean;
        /** @name dxEvent.preventDefault() */
        preventDefault(): void;
        /** @name dxEvent.stopImmediatePropagation() */
        stopImmediatePropagation(): void;
        /** @name dxEvent.stopPropagation() */
        stopPropagation(): void;
    }
    /** @name event */
    export type event = dxEvent | JQueryEventObject;
    /** @name eventsHandler */
    export function eventsHandler(event: dxEvent, extraParameters: any): boolean;
    /** @name globalConfig */
    export interface globalConfig {
        /** @deprecated */
        /** @name globalConfig.decimalSeparator */
        decimalSeparator?: string;
        /** @name globalConfig.defaultCurrency */
        defaultCurrency?: string;
        /** @name globalConfig.editorStylingMode */
        editorStylingMode?: 'outlined' | 'underlined' | 'filled';
        /** @name globalConfig.floatingActionButtonConfig */
        floatingActionButtonConfig?: { closeIcon?: string, direction?: 'auto' | 'up' | 'down', icon?: string, label?: string, maxSpeedDialActionCount?: number, position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function, shading?: boolean };
        /** @name globalConfig.forceIsoDateParsing */
        forceIsoDateParsing?: boolean;
        /** @name globalConfig.oDataFilterToLower */
        oDataFilterToLower?: boolean;
        /** @name globalConfig.rtlEnabled */
        rtlEnabled?: boolean;
        /** @name globalConfig.serverDecimalSeparator */
        serverDecimalSeparator?: string;
        /** @deprecated */
        /** @name globalConfig.thousandsSeparator */
        thousandsSeparator?: string;
        /** @name globalConfig.useLegacyStoreResult */
        useLegacyStoreResult?: boolean;
        /** @name globalConfig.useLegacyVisibleIndex */
        useLegacyVisibleIndex?: boolean;
    }
    /** @name hideTopOverlay() */
    export function hideTopOverlay(): boolean;
    /** @name localization */
    export class localization {
        /** @name localization.formatDate(value, format) */
        static formatDate(value: Date, format: DevExpress.ui.format): string;
        /** @name localization.formatMessage(key, value) */
        static formatMessage(key: string, value: string | Array<string>): string;
        /** @name localization.formatNumber(value, format) */
        static formatNumber(value: number, format: DevExpress.ui.format): string;
        /** @name localization.loadMessages(messages) */
        static loadMessages(messages: any): void;
        /** @name localization.locale() */
        static locale(): string;
        /** @name localization.locale(locale) */
        static locale(locale: string): void;
        /** @name localization.parseDate(text, format) */
        static parseDate(text: string, format: DevExpress.ui.format): Date;
        /** @name localization.parseNumber(text, format) */
        static parseNumber(text: string, format: DevExpress.ui.format): number;
    }
    /** @name positionConfig */
    export interface positionConfig {
        /** @name positionConfig.at */
        at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /** @name positionConfig.boundary */
        boundary?: string | Element | JQuery | Window;
        /** @name positionConfig.boundaryOffset */
        boundaryOffset?: string | { x?: number, y?: number };
        /** @name positionConfig.collision */
        collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | { x?: 'fit' | 'flip' | 'flipfit' | 'none', y?: 'fit' | 'flip' | 'flipfit' | 'none' };
        /** @name positionConfig.my */
        my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /** @name positionConfig.of */
        of?: string | Element | JQuery | Window;
        /** @name positionConfig.offset */
        offset?: string | { x?: number, y?: number };
    }
    /** @name registerComponent(name, componentClass) */
    export function registerComponent(name: string, componentClass: any): void;
    /** @name registerComponent(name, namespace, componentClass) */
    export function registerComponent(name: string, namespace: any, componentClass: any): void;
    /** @name setTemplateEngine(name) */
    export function setTemplateEngine(templateEngineName: string): void;
    /** @name setTemplateEngine(options) */
    export function setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    /** @name ui */
    export class ui {
        /** @name ui.notify(message,type,displayTime) */
        static notify(message: string, type?: string, displayTime?: number): void;
        /** @name ui.notify(options,type,displayTime) */
        static notify(options: any, type?: string, displayTime?: number): void;
        /** @name ui.repaintFloatingActionButton() */
        static repaintFloatingActionButton(): void;
        /** @name ui.setTemplateEngine(name) */
        static setTemplateEngine(templateEngineName: string): void;
        /** @name ui.setTemplateEngine(options) */
        static setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    }
    /** @name validationEngine */
    export class validationEngine {
        /** @name validationEngine.getGroupConfig() */
        static getGroupConfig(): any;
        /** @name validationEngine.getGroupConfig(group) */
        static getGroupConfig(group: string | any): any;
        /** @name validationEngine.registerModelForValidation(model) */
        static registerModelForValidation(model: any): void;
        /** @name validationEngine.resetGroup() */
        static resetGroup(): void;
        /** @name validationEngine.resetGroup(group) */
        static resetGroup(group: string | any): void;
        /** @name validationEngine.unregisterModelForValidation(model) */
        static unregisterModelForValidation(model: any): void;
        /** @name validationEngine.validateGroup() */
        static validateGroup(): DevExpress.ui.dxValidationGroupResult;
        /** @name validationEngine.validateGroup(group) */
        static validateGroup(group: string | any): DevExpress.ui.dxValidationGroupResult;
        /** @name validationEngine.validateModel(model) */
        static validateModel(model: any): any;
    }
    /** @name viz */
    export class viz {
        /** @name viz.currentPalette() */
        static currentPalette(): string;
        /** @name viz.currentPalette(paletteName) */
        static currentPalette(paletteName: string): void;
        /** @name viz.currentTheme() */
        static currentTheme(): string;
        /** @name viz.currentTheme(platform, colorScheme) */
        static currentTheme(platform: string, colorScheme: string): void;
        /** @name viz.currentTheme(theme) */
        static currentTheme(theme: string): void;
        /** @name viz.exportFromMarkup(markup, options) */
        static exportFromMarkup(markup: string, options: { fileName?: string, format?: string, backgroundColor?: string, proxyUrl?: string, width?: number, height?: number, onExporting?: Function, onExported?: Function, onFileSaving?: Function, margin?: number, svgToCanvas?: Function }): void;
        /** @name viz.exportWidgets(widgetInstances) */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>): void;
        /** @name viz.exportWidgets(widgetInstances, options) */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>, options: { fileName?: string, format?: 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG', backgroundColor?: string, margin?: number, gridLayout?: boolean, verticalAlignment?: 'bottom' | 'center' | 'top', horizontalAlignment?: 'center' | 'left' | 'right', proxyUrl?: string, onExporting?: Function, onExported?: Function, onFileSaving?: Function, svgToCanvas?: Function }): void;
        /** @name viz.generateColors(palette, count, options) */
        static generateColors(palette: 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office' | Array<string>, count: number, options: { paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet' }): Array<string>;
        /** @name viz.getMarkup(widgetInstances) */
        static getMarkup(widgetInstances: Array<DOMComponent>): string;
        /** @name viz.getPalette(paletteName) */
        static getPalette(paletteName: string): any;
        /** @name viz.getTheme(theme) */
        static getTheme(theme: string): any;
        /** @name viz.refreshPaths() */
        static refreshPaths(): void;
        /** @name viz.refreshTheme() */
        static refreshTheme(): void;
        /** @name viz.registerPalette(paletteName, palette) */
        static registerPalette(paletteName: string, palette: any): void;
        /** @name viz.registerTheme(customTheme, baseTheme) */
        static registerTheme(customTheme: any, baseTheme: string): void;
    }
}
declare module DevExpress.core {
    /** @name EventsMixin */
    export class EventsMixin {
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
    }
    /** @name dxElement */
    export type dxElement = Element & JQuery;
    /** @name dxTemplate.Options */
    export interface dxTemplateOptions {
        /** @name dxTemplate.Options.name */
        name?: string;
    }
    /** @name dxTemplate */
    export class dxTemplate {
        constructor(options?: dxTemplateOptions)
    }
    /** @name template */
    export type template = string | Function | Element | JQuery;
}
declare module DevExpress.data {
    /** @name ArrayStore.Options */
    export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
        /** @name ArrayStore.Options.data */
        data?: Array<any>;
    }
    /** @name ArrayStore */
    export class ArrayStore extends Store {
        constructor(options?: ArrayStoreOptions)
        /** @name ArrayStore.clear() */
        clear(): void;
        /** @name ArrayStore.createQuery() */
        createQuery(): any;
    }
    /** @name CustomStore.Options */
    export interface CustomStoreOptions extends StoreOptions<CustomStore> {
        /** @name CustomStore.Options.byKey */
        byKey?: ((key: any | string | number) => Promise<any> | JQueryPromise<any>);
        /** @name CustomStore.Options.cacheRawData */
        cacheRawData?: boolean;
        /** @name CustomStore.Options.insert */
        insert?: ((values: any) => Promise<any> | JQueryPromise<any>);
        /** @name CustomStore.Options.load */
        load?: ((options: LoadOptions) => Promise<any> | JQueryPromise<any> | Array<any>);
        /** @name CustomStore.Options.loadMode */
        loadMode?: 'processed' | 'raw';
        /** @name CustomStore.Options.remove */
        remove?: ((key: any | string | number) => Promise<void> | JQueryPromise<void>);
        /** @name CustomStore.Options.totalCount */
        totalCount?: ((loadOptions: { filter?: any, group?: any }) => Promise<number> | JQueryPromise<number>);
        /** @name CustomStore.Options.update */
        update?: ((key: any | string | number, values: any) => Promise<any> | JQueryPromise<any>);
        /** @name CustomStore.Options.useDefaultSearch */
        useDefaultSearch?: boolean;
    }
    /** @name CustomStore */
    export class CustomStore extends Store {
        constructor(options?: CustomStoreOptions)
        /** @name CustomStore.clearRawDataCache() */
        clearRawDataCache(): void;
    }
    /** @name DataSource.Options */
    export interface DataSourceOptions {
        /** @name DataSource.Options.customQueryParams */
        customQueryParams?: any;
        /** @name DataSource.Options.expand */
        expand?: Array<string> | string;
        /** @name DataSource.Options.filter */
        filter?: string | Array<any> | Function;
        /** @name DataSource.Options.group */
        group?: string | Array<any> | Function;
        /** @name DataSource.Options.map */
        map?: ((dataItem: any) => any);
        /** @name DataSource.Options.onChanged */
        onChanged?: ((e: { changes?: Array<any> }) => any);
        /** @name DataSource.Options.onLoadError */
        onLoadError?: ((error: { message?: string }) => any);
        /** @name DataSource.Options.onLoadingChanged */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /** @name DataSource.Options.pageSize */
        pageSize?: number;
        /** @name DataSource.Options.paginate */
        paginate?: boolean;
        /** @name DataSource.Options.postProcess */
        postProcess?: ((data: Array<any>) => Array<any>);
        /** @name DataSource.Options.pushAggregationTimeout */
        pushAggregationTimeout?: number;
        /** @name DataSource.Options.requireTotalCount */
        requireTotalCount?: boolean;
        /** @name DataSource.Options.reshapeOnPush */
        reshapeOnPush?: boolean;
        /** @name DataSource.Options.searchExpr */
        searchExpr?: string | Function | Array<string | Function>;
        /** @name DataSource.Options.searchOperation */
        searchOperation?: string;
        /** @name DataSource.Options.searchValue */
        searchValue?: any;
        /** @name DataSource.Options.select */
        select?: string | Array<any> | Function;
        /** @name DataSource.Options.sort */
        sort?: string | Array<any> | Function;
        /** @name DataSource.Options.store */
        store?: Store | StoreOptions | Array<any> | any;
    }
    /** @name DataSource */
    export class DataSource {
        constructor(data: Array<any>);
        constructor(options: CustomStoreOptions | DataSourceOptions);
        constructor(store: Store);
        constructor(url: string);
        /** @name DataSource.cancel(operationId) */
        cancel(): boolean;
        /** @name DataSource.dispose() */
        dispose(): void;
        /** @name DataSource.filter() */
        filter(): any;
        /** @name DataSource.filter(filterExpr) */
        filter(filterExpr: any): void;
        /** @name DataSource.group() */
        group(): any;
        /** @name DataSource.group(groupExpr) */
        group(groupExpr: any): void;
        /** @name DataSource.isLastPage() */
        isLastPage(): boolean;
        /** @name DataSource.isLoaded() */
        isLoaded(): boolean;
        /** @name DataSource.isLoading() */
        isLoading(): boolean;
        /** @name DataSource.items() */
        items(): Array<any>;
        /** @name DataSource.key() */
        key(): any & string & number;
        /** @name DataSource.load() */
        load(): Promise<any> & JQueryPromise<any>;
        /** @name DataSource.loadOptions() */
        loadOptions(): any;
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
        /** @name DataSource.pageIndex() */
        pageIndex(): number;
        /** @name DataSource.pageIndex(newIndex) */
        pageIndex(newIndex: number): void;
        /** @name DataSource.pageSize() */
        pageSize(): number;
        /** @name DataSource.pageSize(value) */
        pageSize(value: number): void;
        /** @name DataSource.paginate() */
        paginate(): boolean;
        /** @name DataSource.paginate(value) */
        paginate(value: boolean): void;
        /** @name DataSource.reload() */
        reload(): Promise<any> & JQueryPromise<any>;
        /** @name DataSource.requireTotalCount() */
        requireTotalCount(): boolean;
        /** @name DataSource.requireTotalCount(value) */
        requireTotalCount(value: boolean): void;
        /** @name DataSource.searchExpr() */
        searchExpr(): string & Function & Array<string | Function>;
        /** @name DataSource.searchExpr(expr) */
        searchExpr(expr: string | Function | Array<string | Function>): void;
        /** @name DataSource.searchOperation() */
        searchOperation(): string;
        /** @name DataSource.searchOperation(op) */
        searchOperation(op: string): void;
        /** @name DataSource.searchValue() */
        searchValue(): any;
        /** @name DataSource.searchValue(value) */
        searchValue(value: any): void;
        /** @name DataSource.select() */
        select(): any;
        /** @name DataSource.select(expr) */
        select(expr: any): void;
        /** @name DataSource.sort() */
        sort(): any;
        /** @name DataSource.sort(sortExpr) */
        sort(sortExpr: any): void;
        /** @name DataSource.store() */
        store(): any;
        /** @name DataSource.totalCount() */
        totalCount(): number;
    }
    /** @name EdmLiteral */
    export class EdmLiteral {
        constructor(value: string);
        /** @name EdmLiteral.valueOf() */
        valueOf(): string;
    }
    /** @name Guid */
    export class Guid {
        constructor();
        constructor(value: string);
        /** @name Guid.toString() */
        toString(): string;
        /** @name Guid.valueOf() */
        valueOf(): string;
    }
    /** @name LoadOptions */
    export interface LoadOptions {
        /** @name LoadOptions.customQueryParams */
        customQueryParams?: any;
        /** @name LoadOptions.expand */
        expand?: any;
        /** @name LoadOptions.filter */
        filter?: any;
        /** @name LoadOptions.group */
        group?: any;
        /** @name LoadOptions.groupSummary */
        groupSummary?: any;
        /** @name LoadOptions.parentIds */
        parentIds?: Array<any>;
        /** @name LoadOptions.requireGroupCount */
        requireGroupCount?: boolean;
        /** @name LoadOptions.requireTotalCount */
        requireTotalCount?: boolean;
        /** @name LoadOptions.searchExpr */
        searchExpr?: string | Function | Array<string | Function>;
        /** @name LoadOptions.searchOperation */
        searchOperation?: string;
        /** @name LoadOptions.searchValue */
        searchValue?: any;
        /** @name LoadOptions.select */
        select?: any;
        /** @name LoadOptions.skip */
        skip?: number;
        /** @name LoadOptions.sort */
        sort?: any;
        /** @name LoadOptions.take */
        take?: number;
        /** @name LoadOptions.totalSummary */
        totalSummary?: any;
        /** @name LoadOptions.userData */
        userData?: any;
    }
    /** @name LocalStore.Options */
    export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
        /** @name LocalStore.Options.flushInterval */
        flushInterval?: number;
        /** @name LocalStore.Options.immediate */
        immediate?: boolean;
        /** @name LocalStore.Options.name */
        name?: string;
    }
    /** @name LocalStore */
    export class LocalStore extends ArrayStore {
        constructor(options?: LocalStoreOptions)
        /** @name LocalStore.clear() */
        clear(): void;
    }
    /** @name ODataContext.Options */
    export interface ODataContextOptions {
        /** @name ODataContext.Options.beforeSend */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /** @name ODataContext.Options.deserializeDates */
        deserializeDates?: boolean;
        /** @name ODataContext.Options.entities */
        entities?: any;
        /** @name ODataContext.Options.errorHandler */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /** @name ODataContext.Options.filterToLower */
        filterToLower?: boolean;
        /** @name ODataContext.Options.jsonp */
        jsonp?: boolean;
        /** @name ODataContext.Options.url */
        url?: string;
        /** @name ODataContext.Options.version */
        version?: number;
        /** @name ODataContext.Options.withCredentials */
        withCredentials?: boolean;
    }
    /** @name ODataContext */
    export class ODataContext {
        constructor(options?: ODataContextOptions)
        /** @name ODataContext.get(operationName, params) */
        get(operationName: string, params: any): Promise<any> & JQueryPromise<any>;
        /** @name ODataContext.invoke(operationName, params, httpMethod) */
        invoke(operationName: string, params: any, httpMethod: any): Promise<void> & JQueryPromise<void>;
        /** @name ODataContext.objectLink(entityAlias, key) */
        objectLink(entityAlias: string, key: any | string | number): any;
    }
    /** @name ODataStore.Options */
    export interface ODataStoreOptions extends StoreOptions<ODataStore> {
        /** @name ODataStore.Options.beforeSend */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /** @name ODataStore.Options.deserializeDates */
        deserializeDates?: boolean;
        /** @name ODataStore.Options.errorHandler */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /** @name ODataStore.Options.fieldTypes */
        fieldTypes?: any;
        /** @name ODataStore.Options.filterToLower */
        filterToLower?: boolean;
        /** @name ODataStore.Options.jsonp */
        jsonp?: boolean;
        /** @name ODataStore.Options.keyType */
        keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
        /** @name ODataStore.Options.onLoading */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /** @name ODataStore.Options.url */
        url?: string;
        /** @name ODataStore.Options.version */
        version?: number;
        /** @name ODataStore.Options.withCredentials */
        withCredentials?: boolean;
    }
    /** @name ODataStore */
    export class ODataStore extends Store {
        constructor(options?: ODataStoreOptions)
        /** @name Store.byKey(key) */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** @name ODataStore.byKey(key, extraOptions) */
        byKey(key: any | string | number, extraOptions: { expand?: string | Array<string>, select?: string | Array<string> }): Promise<any> & JQueryPromise<any>;
        /** @name ODataStore.createQuery(loadOptions) */
        createQuery(loadOptions: any): any;
    }
    /** @name PivotGridDataSource.Options */
    export interface PivotGridDataSourceOptions {
        /** @name PivotGridDataSource.Options.fields */
        fields?: Array<PivotGridDataSourceField>;
        /** @name PivotGridDataSource.Options.filter */
        filter?: string | Array<any> | Function;
        /** @name PivotGridDataSource.Options.onChanged */
        onChanged?: Function;
        /** @name PivotGridDataSource.Options.onFieldsPrepared */
        onFieldsPrepared?: ((fields: Array<PivotGridDataSourceField>) => any);
        /** @name PivotGridDataSource.Options.onLoadError */
        onLoadError?: ((error: any) => any);
        /** @name PivotGridDataSource.Options.onLoadingChanged */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /** @name PivotGridDataSource.Options.paginate */
        paginate?: boolean;
        /** @name PivotGridDataSource.Options.remoteOperations */
        remoteOperations?: boolean;
        /** @name PivotGridDataSource.Options.retrieveFields */
        retrieveFields?: boolean;
        /** @name PivotGridDataSource.Options.store */
        store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{ type?: 'array' | 'local' | 'odata' | 'xmla' }> | { type?: 'array' | 'local' | 'odata' | 'xmla' };
    }
    /** @name PivotGridDataSource.Options.fields */
    export interface PivotGridDataSourceField {
        /** @name PivotGridDataSource.Options.fields.allowCrossGroupCalculation */
        allowCrossGroupCalculation?: boolean;
        /** @name PivotGridDataSource.Options.fields.allowExpandAll */
        allowExpandAll?: boolean;
        /** @name PivotGridDataSource.Options.fields.allowFiltering */
        allowFiltering?: boolean;
        /** @name PivotGridDataSource.Options.fields.allowSorting */
        allowSorting?: boolean;
        /** @name PivotGridDataSource.Options.fields.allowSortingBySummary */
        allowSortingBySummary?: boolean;
        /** @name PivotGridDataSource.Options.fields.area */
        area?: 'column' | 'data' | 'filter' | 'row' | undefined;
        /** @name PivotGridDataSource.Options.fields.areaIndex */
        areaIndex?: number;
        /** @name PivotGridDataSource.Options.fields.calculateCustomSummary */
        calculateCustomSummary?: ((options: { summaryProcess?: string, value?: any, totalValue?: any }) => any);
        /** @name PivotGridDataSource.Options.fields.calculateSummaryValue */
        calculateSummaryValue?: ((e: DevExpress.ui.dxPivotGridSummaryCell) => number);
        /** @name PivotGridDataSource.Options.fields.caption */
        caption?: string;
        /** @name PivotGridDataSource.Options.fields.customizeText */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string }) => string);
        /** @name PivotGridDataSource.Options.fields.dataField */
        dataField?: string;
        /** @name PivotGridDataSource.Options.fields.dataType */
        dataType?: 'date' | 'number' | 'string';
        /** @name PivotGridDataSource.Options.fields.displayFolder */
        displayFolder?: string;
        /** @name PivotGridDataSource.Options.fields.expanded */
        expanded?: boolean;
        /** @name PivotGridDataSource.Options.fields.filterType */
        filterType?: 'exclude' | 'include';
        /** @name PivotGridDataSource.Options.fields.filterValues */
        filterValues?: Array<any>;
        /** @name PivotGridDataSource.Options.fields.format */
        format?: DevExpress.ui.format;
        /** @name PivotGridDataSource.Options.fields.groupIndex */
        groupIndex?: number;
        /** @name PivotGridDataSource.Options.fields.groupInterval */
        groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
        /** @name PivotGridDataSource.Options.fields.groupName */
        groupName?: string;
        /** @name PivotGridDataSource.Options.fields.headerFilter */
        headerFilter?: { allowSearch?: boolean, height?: number, width?: number };
        /** @name PivotGridDataSource.Options.fields.isMeasure */
        isMeasure?: boolean;
        /** @name PivotGridDataSource.Options.fields.name */
        name?: string;
        /** @name PivotGridDataSource.Options.fields.runningTotal */
        runningTotal?: 'column' | 'row';
        /** @name PivotGridDataSource.Options.fields.selector */
        selector?: Function;
        /** @name PivotGridDataSource.Options.fields.showGrandTotals */
        showGrandTotals?: boolean;
        /** @name PivotGridDataSource.Options.fields.showTotals */
        showTotals?: boolean;
        /** @name PivotGridDataSource.Options.fields.showValues */
        showValues?: boolean;
        /** @name PivotGridDataSource.Options.fields.sortBy */
        sortBy?: 'displayText' | 'value' | 'none';
        /** @name PivotGridDataSource.Options.fields.sortBySummaryField */
        sortBySummaryField?: string;
        /** @name PivotGridDataSource.Options.fields.sortBySummaryPath */
        sortBySummaryPath?: Array<number | string>;
        /** @name PivotGridDataSource.Options.fields.sortOrder */
        sortOrder?: 'asc' | 'desc';
        /** @name PivotGridDataSource.Options.fields.sortingMethod */
        sortingMethod?: ((a: { value?: string | number, children?: Array<any> }, b: { value?: string | number, children?: Array<any> }) => number);
        /** @name PivotGridDataSource.Options.fields.summaryDisplayMode */
        summaryDisplayMode?: 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';
        /** @name PivotGridDataSource.Options.fields.summaryType */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
        /** @name PivotGridDataSource.Options.fields.visible */
        visible?: boolean;
        /** @name PivotGridDataSource.Options.fields.width */
        width?: number;
        /** @name PivotGridDataSource.Options.fields.wordWrapEnabled */
        wordWrapEnabled?: boolean;
    }
    /** @name PivotGridDataSource */
    export class PivotGridDataSource {
        constructor(options?: PivotGridDataSourceOptions)
        /** @name PivotGridDataSource.collapseAll(id) */
        collapseAll(id: number | string): void;
        /** @name PivotGridDataSource.collapseHeaderItem(area, path) */
        collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
        /** @name PivotGridDataSource.createDrillDownDataSource(options) */
        createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>, rowPath?: Array<string | number | Date>, dataIndex?: number, maxRowCount?: number, customColumns?: Array<string> }): DataSource;
        /** @name PivotGridDataSource.dispose() */
        dispose(): void;
        /** @name PivotGridDataSource.expandAll(id) */
        expandAll(id: number | string): void;
        /** @name PivotGridDataSource.expandHeaderItem(area, path) */
        expandHeaderItem(area: string, path: Array<any>): void;
        /** @name PivotGridDataSource.field(id) */
        field(id: number | string): any;
        /** @name PivotGridDataSource.field(id, options) */
        field(id: number | string, options: any): void;
        /** @name PivotGridDataSource.fields() */
        fields(): Array<PivotGridDataSourceField>;
        /** @name PivotGridDataSource.fields(fields) */
        fields(fields: Array<PivotGridDataSourceField>): void;
        /** @name PivotGridDataSource.filter() */
        filter(): any;
        /** @name PivotGridDataSource.filter(filterExpr) */
        filter(filterExpr: any): void;
        /** @name PivotGridDataSource.getAreaFields(area, collectGroups) */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridDataSourceField>;
        /** @name PivotGridDataSource.getData() */
        getData(): any;
        /** @name PivotGridDataSource.isLoading() */
        isLoading(): boolean;
        /** @name PivotGridDataSource.load() */
        load(): Promise<any> & JQueryPromise<any>;
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
        /** @name PivotGridDataSource.reload() */
        reload(): Promise<any> & JQueryPromise<any>;
        /** @name PivotGridDataSource.state() */
        state(): any;
        /** @name PivotGridDataSource.state(state) */
        state(state: any): void;
    }
    /** @name Query */
    export class Query {
        /** @name Query.aggregate(seed, step, finalize) */
        aggregate(seed: any, step: Function, finalize: Function): Promise<any> & JQueryPromise<any>;
        /** @name Query.aggregate(step) */
        aggregate(step: Function): Promise<any> & JQueryPromise<any>;
        /** @name Query.avg() */
        avg(): Promise<number> & JQueryPromise<number>;
        /** @name Query.avg(getter) */
        avg(getter: any): Promise<number> & JQueryPromise<number>;
        /** @name Query.count() */
        count(): Promise<number> & JQueryPromise<number>;
        /** @name Query.enumerate() */
        enumerate(): Promise<any> & JQueryPromise<any>;
        /** @name Query.filter(criteria) */
        filter(criteria: Array<any>): Query;
        /** @name Query.filter(predicate) */
        filter(predicate: Function): Query;
        /** @name Query.groupBy(getter) */
        groupBy(getter: any): Query;
        /** @name Query.max() */
        max(): Promise<number | Date> & JQueryPromise<number | Date>;
        /** @name Query.max(getter) */
        max(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /** @name Query.min() */
        min(): Promise<number | Date> & JQueryPromise<number | Date>;
        /** @name Query.min(getter) */
        min(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /** @name Query.select(getter) */
        select(getter: any): Query;
        /** @name Query.slice(skip, take) */
        slice(skip: number, take?: number): Query;
        /** @name Query.sortBy(getter) */
        sortBy(getter: any): Query;
        /** @name Query.sortBy(getter, desc) */
        sortBy(getter: any, desc: boolean): Query;
        /** @name Query.sum() */
        sum(): Promise<number> & JQueryPromise<number>;
        /** @name Query.sum(getter) */
        sum(getter: any): Promise<number> & JQueryPromise<number>;
        /** @name Query.thenBy(getter) */
        thenBy(getter: any): Query;
        /** @name Query.thenBy(getter, desc) */
        thenBy(getter: any, desc: boolean): Query;
        /** @name Query.toArray() */
        toArray(): Array<any>;
    }
    /** @name Store.Options */
    export interface StoreOptions<T = Store> {
        /** @name Store.Options.errorHandler */
        errorHandler?: Function;
        /** @name Store.Options.key */
        key?: string | Array<string>;
        /** @name Store.Options.onInserted */
        onInserted?: ((values: any, key: any | string | number) => any);
        /** @name Store.Options.onInserting */
        onInserting?: ((values: any) => any);
        /** @name Store.Options.onLoaded */
        onLoaded?: ((result: Array<any>) => any);
        /** @name Store.Options.onLoading */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /** @name Store.Options.onModified */
        onModified?: Function;
        /** @name Store.Options.onModifying */
        onModifying?: Function;
        /** @name Store.Options.onPush */
        onPush?: ((changes: Array<any>) => any);
        /** @name Store.Options.onRemoved */
        onRemoved?: ((key: any | string | number) => any);
        /** @name Store.Options.onRemoving */
        onRemoving?: ((key: any | string | number) => any);
        /** @name Store.Options.onUpdated */
        onUpdated?: ((key: any | string | number, values: any) => any);
        /** @name Store.Options.onUpdating */
        onUpdating?: ((key: any | string | number, values: any) => any);
    }
    /** @name Store */
    export class Store {
        constructor(options?: StoreOptions)
        /** @name Store.byKey(key) */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** @name Store.insert(values) */
        insert(values: any): Promise<any> & JQueryPromise<any>;
        /** @name Store.key() */
        key(): any;
        /** @name Store.keyOf(obj) */
        keyOf(obj: any): any;
        /** @name Store.load() */
        load(): Promise<any> & JQueryPromise<any>;
        /** @name Store.load(options) */
        load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
        /** @name EventsMixin.off(eventName) */
        off(eventName: string): this;
        /** @name EventsMixin.off(eventName, eventHandler) */
        off(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(eventName, eventHandler) */
        on(eventName: string, eventHandler: Function): this;
        /** @name EventsMixin.on(events) */
        on(events: any): this;
        /** @name Store.push(changes) */
        push(changes: Array<any>): void;
        /** @name Store.remove(key) */
        remove(key: any | string | number): Promise<void> & JQueryPromise<void>;
        /** @name Store.totalCount(options) */
        totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number>;
        /** @name Store.update(key, values) */
        update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any>;
    }
    /** @name XmlaStore.Options */
    export interface XmlaStoreOptions {
        /** @name XmlaStore.Options.beforeSend */
        beforeSend?: ((options: { url?: string, method?: string, headers?: any, xhrFields?: any, data?: string, dataType?: string }) => any);
        /** @name XmlaStore.Options.catalog */
        catalog?: string;
        /** @name XmlaStore.Options.cube */
        cube?: string;
        /** @name XmlaStore.Options.url */
        url?: string;
    }
    /** @name XmlaStore */
    export class XmlaStore {
        constructor(options?: XmlaStoreOptions)
    }
    /** @name Utils.base64_encode(input) */
    export function base64_encode(input: string | Array<number>): string;
    /** @name Utils.errorHandler */
    export function errorHandler(e: Error): void;
    /** @name Utils.query(array) */
    export function query(array: Array<any>): Query;
    /** @name Utils.query(url, queryOptions) */
    export function query(url: string, queryOptions: any): Query;
}
declare module DevExpress.data.utils {
    /** @name Utils.compileGetter(expr) */
    export function compileGetter(expr: string | Array<string>): Function;
    /** @name Utils.compileSetter(expr) */
    export function compileSetter(expr: string | Array<string>): Function;
}
declare module DevExpress.data.utils.odata {
    /** @name Utils.keyConverters */
    export var keyConverters: any;
}
declare module DevExpress.events {
    /** @name events.off(element) */
    export function off(element: Element | Array<Element>): void;
    /** @name events.off(element, eventName) */
    export function off(element: Element | Array<Element>, eventName: string): void;
    /** @name events.off(element, eventName, handler) */
    export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** @name events.off(element, eventName, selector) */
    export function off(element: Element | Array<Element>, eventName: string, selector: string): void;
    /** @name events.off(element, eventName, selector, handler) */
    export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /** @name events.on(element, eventName, data, handler) */
    export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /** @name events.on(element, eventName, handler) */
    export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** @name events.on(element, eventName, selector, data, handler) */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /** @name events.on(element, eventName, selector, handler) */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /** @name events.one(element, eventName, data, handler) */
    export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /** @name events.one(element, eventName, handler) */
    export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** @name events.one(element, eventName, selector, data, handler) */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /** @name events.one(element, eventName, selector, handler) */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /** @name events.trigger(element, event) */
    export function trigger(element: Element | Array<Element>, event: string | event): void;
    /** @name events.trigger(element, event, extraParameters) */
    export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
    /** @name events.triggerHandler(element, event) */
    export function triggerHandler(element: Element | Array<Element>, event: string | event): void;
    /** @name events.triggerHandler(element, event, extraParameters) */
    export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
}
declare module DevExpress.exporter {
    /** @name ExcelDataGridCell */
    export interface ExcelDataGridCell {
        /** @name ExcelDataGridCell.column */
        column?: DevExpress.ui.dxDataGridColumn;
        /** @name ExcelDataGridCell.data */
        data?: any;
        /** @name ExcelDataGridCell.groupIndex */
        groupIndex?: number;
        /** @name ExcelDataGridCell.groupSummaryItems */
        groupSummaryItems?: Array<{ name?: string, value?: any }>;
        /** @name ExcelDataGridCell.rowType */
        rowType?: string;
        /** @name ExcelDataGridCell.totalSummaryItemName */
        totalSummaryItemName?: string;
        /** @name ExcelDataGridCell.value */
        value?: any;
    }
    /** @name ExcelFont */
    export interface ExcelFont {
        /** @name ExcelFont.bold */
        bold?: boolean;
        /** @name ExcelFont.color */
        color?: string;
        /** @name ExcelFont.italic */
        italic?: boolean;
        /** @name ExcelFont.name */
        name?: string;
        /** @name ExcelFont.size */
        size?: number;
        /** @name ExcelFont.underline */
        underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
    }
}
declare module DevExpress.fileProvider {
    /** @name AjaxFileProvider.Options */
    export interface AjaxFileProviderOptions extends FileProviderOptions<AjaxFileProvider> {
        /** @name AjaxFileProvider.Options.itemsExpr */
        itemsExpr?: string | Function;
        /** @name AjaxFileProvider.Options.url */
        url?: string;
    }
    /** @name AjaxFileProvider */
    export class AjaxFileProvider extends FileProvider {
        constructor(options?: AjaxFileProviderOptions)
    }
    /** @name ArrayFileProvider.Options */
    export interface ArrayFileProviderOptions extends FileProviderOptions<ArrayFileProvider> {
        /** @name ArrayFileProvider.Options.data */
        data?: Array<any>;
        /** @name ArrayFileProvider.Options.itemsExpr */
        itemsExpr?: string | Function;
    }
    /** @name ArrayFileProvider */
    export class ArrayFileProvider extends FileProvider {
        constructor(options?: ArrayFileProviderOptions)
    }
    /** @name CustomFileProvider.Options */
    export interface CustomFileProviderOptions extends FileProviderOptions<CustomFileProvider> {
        /** @name CustomFileProvider.Options.abortFileUpload */
        abortFileUpload?: Function;
        /** @name CustomFileProvider.Options.copyItem */
        copyItem?: Function;
        /** @name CustomFileProvider.Options.createDirectory */
        createDirectory?: Function;
        /** @name CustomFileProvider.Options.deleteItem */
        deleteItem?: Function;
        /** @name CustomFileProvider.Options.downloadItems */
        downloadItems?: Function;
        /** @name CustomFileProvider.Options.getItems */
        getItems?: Function;
        /** @name CustomFileProvider.Options.getItemsContent */
        getItemsContent?: Function;
        /** @name CustomFileProvider.Options.hasSubDirectoriesExpr */
        hasSubDirectoriesExpr?: string | Function;
        /** @name CustomFileProvider.Options.moveItem */
        moveItem?: Function;
        /** @name CustomFileProvider.Options.renameItem */
        renameItem?: Function;
        /** @name CustomFileProvider.Options.uploadChunkSize */
        uploadChunkSize?: number;
        /** @name CustomFileProvider.Options.uploadFileChunk */
        uploadFileChunk?: Function;
    }
    /** @name CustomFileProvider */
    export class CustomFileProvider extends FileProvider {
        constructor(options?: CustomFileProviderOptions)
    }
    /** @name FileProvider.Options */
    export interface FileProviderOptions<T = FileProvider> {
        /** @name FileProvider.Options.dateModifiedExpr */
        dateModifiedExpr?: string | Function;
        /** @name FileProvider.Options.isDirectoryExpr */
        isDirectoryExpr?: string | Function;
        /** @name FileProvider.Options.keyExpr */
        keyExpr?: string | Function;
        /** @name FileProvider.Options.nameExpr */
        nameExpr?: string | Function;
        /** @name FileProvider.Options.sizeExpr */
        sizeExpr?: string | Function;
        /** @name FileProvider.Options.thumbnailExpr */
        thumbnailExpr?: string | Function;
    }
    /** @name FileProvider */
    export class FileProvider {
        constructor(options?: FileProviderOptions)
        /** @name FileProvider.getItemContent() */
        getItemContent(items: Array<any>): Promise<any> & JQueryPromise<any>;
    }
    /** @name RemoteFileProvider.Options */
    export interface RemoteFileProviderOptions extends FileProviderOptions<RemoteFileProvider> {
        /** @name RemoteFileProvider.Options.endpointUrl */
        endpointUrl?: string;
        /** @name RemoteFileProvider.Options.hasSubDirectoriesExpr */
        hasSubDirectoriesExpr?: string | Function;
    }
    /** @name RemoteFileProvider */
    export class RemoteFileProvider extends FileProvider {
        constructor(options?: RemoteFileProviderOptions)
    }
}
declare module DevExpress.fx {
    /** @name fx.animate(element, config) */
    export function animate(element: Element, config: animationConfig): Promise<void> & JQueryPromise<void>;
    /** @name fx.isAnimating(element) */
    export function isAnimating(element: Element): boolean;
    /** @name fx.stop(element, jumpToEnd) */
    export function stop(element: Element, jumpToEnd: boolean): void;
}
declare module DevExpress.ui {
    /** @name AsyncRule */
    export interface AsyncRule {
        /** @name AsyncRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name AsyncRule.message */
        message?: string;
        /** @name AsyncRule.reevaluate */
        reevaluate?: boolean;
        /** @name AsyncRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /** @name AsyncRule.validationCallback */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => Promise<any> | JQueryPromise<any>);
    }
    /** @name ColCountResponsible */
    export interface ColCountResponsible {
        /** @name ColCountResponsible.lg */
        lg?: number;
        /** @name ColCountResponsible.md */
        md?: number;
        /** @name ColCountResponsible.sm */
        sm?: number;
        /** @name ColCountResponsible.xs */
        xs?: number;
    }
    /** @name CollectionWidget.Options */
    export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
        /** @name CollectionWidget.Options.dataSource */
        dataSource?: string | Array<string | CollectionWidgetItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name CollectionWidget.Options.itemHoldTimeout */
        itemHoldTimeout?: number;
        /** @name CollectionWidget.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name CollectionWidget.Options.items */
        items?: Array<string | CollectionWidgetItem | any>;
        /** @name CollectionWidget.Options.keyExpr */
        keyExpr?: string | Function;
        /** @name CollectionWidget.Options.noDataText */
        noDataText?: string;
        /** @name CollectionWidget.Options.onItemClick */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name CollectionWidget.Options.onItemContextMenu */
        onItemContextMenu?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name CollectionWidget.Options.onItemHold */
        onItemHold?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: event }) => any);
        /** @name CollectionWidget.Options.onItemRendered */
        onItemRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any);
        /** @name CollectionWidget.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /** @name CollectionWidget.Options.selectedIndex */
        selectedIndex?: number;
        /** @name CollectionWidget.Options.selectedItem */
        selectedItem?: any;
        /** @name CollectionWidget.Options.selectedItemKeys */
        selectedItemKeys?: Array<any>;
        /** @name CollectionWidget.Options.selectedItems */
        selectedItems?: Array<any>;
    }
    /** @name CollectionWidget */
    export class CollectionWidget extends Widget {
        constructor(element: Element, options?: CollectionWidgetOptions)
        constructor(element: JQuery, options?: CollectionWidgetOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name CollectionWidgetItem */
    export interface CollectionWidgetItem {
        /** @name CollectionWidgetItem.disabled */
        disabled?: boolean;
        /** @name CollectionWidgetItem.html */
        html?: string;
        /** @name CollectionWidgetItem.template */
        template?: DevExpress.core.template | (() => string | Element | JQuery);
        /** @name CollectionWidgetItem.text */
        text?: string;
        /** @name CollectionWidgetItem.visible */
        visible?: boolean;
    }
    /** @name CompareRule */
    export interface CompareRule {
        /** @name CompareRule.comparisonTarget */
        comparisonTarget?: (() => any);
        /** @name CompareRule.comparisonType */
        comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
        /** @name CompareRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name CompareRule.message */
        message?: string;
        /** @name CompareRule.reevaluate */
        reevaluate?: boolean;
        /** @name CompareRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name CustomRule */
    export interface CustomRule {
        /** @name CustomRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name CustomRule.message */
        message?: string;
        /** @name CustomRule.reevaluate */
        reevaluate?: boolean;
        /** @name CustomRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /** @name CustomRule.validationCallback */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => boolean);
    }
    /** @name DataExpressionMixin.Options */
    export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
        /** @name DataExpressionMixin.Options.dataSource */
        dataSource?: string | Array<CollectionWidgetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name DataExpressionMixin.Options.displayExpr */
        displayExpr?: string | ((item: any) => string);
        /** @name DataExpressionMixin.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name DataExpressionMixin.Options.items */
        items?: Array<CollectionWidgetItem | any>;
        /** @name DataExpressionMixin.Options.value */
        value?: any;
        /** @name DataExpressionMixin.Options.valueExpr */
        valueExpr?: string | ((item: any) => string | number | boolean);
    }
    /** @name DataExpressionMixin */
    export class DataExpressionMixin {
        constructor(options?: DataExpressionMixinOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name DraggableBase.Options */
    export interface DraggableBaseOptions<T = DraggableBase> extends DOMComponentOptions<T> {
        /** @name DraggableBase.Options.autoScroll */
        autoScroll?: boolean;
        /** @name DraggableBase.Options.boundary */
        boundary?: string | Element | JQuery;
        /** @name DraggableBase.Options.container */
        container?: string | Element | JQuery;
        /** @name DraggableBase.Options.cursorOffset */
        cursorOffset?: string | { x?: number, y?: number };
        /** @name DraggableBase.Options.data */
        data?: any;
        /** @name DraggableBase.Options.dragDirection */
        dragDirection?: 'both' | 'horizontal' | 'vertical';
        /** @name DraggableBase.Options.group */
        group?: string;
        /** @name DraggableBase.Options.handle */
        handle?: string;
        /** @name DraggableBase.Options.scrollSensitivity */
        scrollSensitivity?: number;
        /** @name DraggableBase.Options.scrollSpeed */
        scrollSpeed?: number;
    }
    /** @name DraggableBase */
    export class DraggableBase extends DOMComponent {
        constructor(element: Element, options?: DraggableBaseOptions)
        constructor(element: JQuery, options?: DraggableBaseOptions)
    }
    /** @name Editor.Options */
    export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
        /** @name Editor.Options.isValid */
        isValid?: boolean;
        /** @name Editor.Options.onValueChanged */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name Editor.Options.readOnly */
        readOnly?: boolean;
        /** @name Editor.Options.validationError */
        validationError?: any;
        /** @name Editor.Options.validationErrors */
        validationErrors?: Array<any>;
        /** @name Editor.Options.validationMessageMode */
        validationMessageMode?: 'always' | 'auto';
        /** @name Editor.Options.validationStatus */
        validationStatus?: 'valid' | 'invalid' | 'pending';
        /** @name Editor.Options.value */
        value?: any;
    }
    /** @name Editor */
    export class Editor extends Widget {
        constructor(element: Element, options?: EditorOptions)
        constructor(element: JQuery, options?: EditorOptions)
        /** @name Editor.reset() */
        reset(): void;
        /** @name Component.resetOption(optionName) */
        resetOption(optionName: string): void;
    }
    /** @name EmailRule */
    export interface EmailRule {
        /** @name EmailRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name EmailRule.message */
        message?: string;
        /** @name EmailRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name GridBase.Options */
    export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
        /** @name GridBase.Options.allowColumnReordering */
        allowColumnReordering?: boolean;
        /** @name GridBase.Options.allowColumnResizing */
        allowColumnResizing?: boolean;
        /** @name GridBase.Options.autoNavigateToFocusedRow */
        autoNavigateToFocusedRow?: boolean;
        /** @name GridBase.Options.cacheEnabled */
        cacheEnabled?: boolean;
        /** @name GridBase.Options.cellHintEnabled */
        cellHintEnabled?: boolean;
        /** @name GridBase.Options.columnAutoWidth */
        columnAutoWidth?: boolean;
        /** @name GridBase.Options.columnChooser */
        columnChooser?: { allowSearch?: boolean, emptyPanelText?: string, enabled?: boolean, height?: number, mode?: 'dragAndDrop' | 'select', searchTimeout?: number, title?: string, width?: number };
        /** @name GridBase.Options.columnFixing */
        columnFixing?: { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } };
        /** @name GridBase.Options.columnHidingEnabled */
        columnHidingEnabled?: boolean;
        /** @name GridBase.Options.columnMinWidth */
        columnMinWidth?: number;
        /** @name GridBase.Options.columnResizingMode */
        columnResizingMode?: 'nextColumn' | 'widget';
        /** @name GridBase.Options.columnWidth */
        columnWidth?: number;
        /** @name GridBase.Options.columns */
        columns?: Array<GridBaseColumn | string>;
        /** @name GridBase.Options.dataSource */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name GridBase.Options.dateSerializationFormat */
        dateSerializationFormat?: string;
        /** @name GridBase.Options.editing */
        editing?: GridBaseEditing;
        /** @name GridBase.Options.errorRowEnabled */
        errorRowEnabled?: boolean;
        /** @name GridBase.Options.filterBuilder */
        filterBuilder?: dxFilterBuilderOptions;
        /** @name GridBase.Options.filterBuilderPopup */
        filterBuilderPopup?: dxPopupOptions;
        /** @name GridBase.Options.filterPanel */
        filterPanel?: { customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string), filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean };
        /** @name GridBase.Options.filterRow */
        filterRow?: { applyFilter?: 'auto' | 'onClick', applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean };
        /** @name GridBase.Options.filterSyncEnabled */
        filterSyncEnabled?: boolean | 'auto';
        /** @name GridBase.Options.filterValue */
        filterValue?: string | Array<any> | Function;
        /** @name GridBase.Options.focusedColumnIndex */
        focusedColumnIndex?: number;
        /** @name GridBase.Options.focusedRowEnabled */
        focusedRowEnabled?: boolean;
        /** @name GridBase.Options.focusedRowIndex */
        focusedRowIndex?: number;
        /** @name GridBase.Options.focusedRowKey */
        focusedRowKey?: any;
        /** @name GridBase.Options.headerFilter */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number };
        /** @name GridBase.Options.highlightChanges */
        highlightChanges?: boolean;
        /** @name GridBase.Options.keyboardNavigation */
        keyboardNavigation?: { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: 'startEdit' | 'moveFocus', enterKeyDirection?: 'none' | 'column' | 'row' };
        /** @name GridBase.Options.loadPanel */
        loadPanel?: { enabled?: boolean | 'auto', height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /** @name GridBase.Options.noDataText */
        noDataText?: string;
        /** @name GridBase.Options.onAdaptiveDetailRowPreparing */
        onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, formOptions?: any }) => any);
        /** @name GridBase.Options.onDataErrorOccurred */
        onDataErrorOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, error?: Error }) => any);
        /** @name GridBase.Options.onInitNewRow */
        onInitNewRow?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /** @name GridBase.Options.onKeyDown */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, handled?: boolean }) => any);
        /** @name GridBase.Options.onRowCollapsed */
        onRowCollapsed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /** @name GridBase.Options.onRowCollapsing */
        onRowCollapsing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /** @name GridBase.Options.onRowExpanded */
        onRowExpanded?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /** @name GridBase.Options.onRowExpanding */
        onRowExpanding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /** @name GridBase.Options.onRowInserted */
        onRowInserted?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** @name GridBase.Options.onRowInserting */
        onRowInserting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** @name GridBase.Options.onRowRemoved */
        onRowRemoved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** @name GridBase.Options.onRowRemoving */
        onRowRemoving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** @name GridBase.Options.onRowUpdated */
        onRowUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** @name GridBase.Options.onRowUpdating */
        onRowUpdating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** @name GridBase.Options.onRowValidating */
        onRowValidating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /** @name GridBase.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
        /** @name GridBase.Options.onToolbarPreparing */
        onToolbarPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
        /** @name GridBase.Options.pager */
        pager?: { allowedPageSizes?: Array<number> | 'auto', infoText?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: boolean | 'auto' };
        /** @name GridBase.Options.paging */
        paging?: GridBasePaging;
        /** @name GridBase.Options.renderAsync */
        renderAsync?: boolean;
        /** @name GridBase.Options.repaintChangesOnly */
        repaintChangesOnly?: boolean;
        /** @name GridBase.Options.rowAlternationEnabled */
        rowAlternationEnabled?: boolean;
        /** @name GridBase.Options.rowDragging */
        rowDragging?: { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: string | Element | JQuery, container?: string | Element | JQuery, cursorOffset?: string | { x?: number, y?: number }, data?: any, dragDirection?: 'both' | 'horizontal' | 'vertical', dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery), dropFeedbackMode?: 'push' | 'indicate', filter?: string, group?: string, handle?: string, onAdd?: ((e: { event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragChange?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragEnd?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragMove?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragStart?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any), onRemove?: ((e: { event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onReorder?: ((e: { event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean };
        /** @name GridBase.Options.scrolling */
        scrolling?: GridBaseScrolling;
        /** @name GridBase.Options.searchPanel */
        searchPanel?: { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number };
        /** @name GridBase.Options.selectedRowKeys */
        selectedRowKeys?: Array<any>;
        /** @name GridBase.Options.selection */
        selection?: GridBaseSelection;
        /** @name GridBase.Options.showBorders */
        showBorders?: boolean;
        /** @name GridBase.Options.showColumnHeaders */
        showColumnHeaders?: boolean;
        /** @name GridBase.Options.showColumnLines */
        showColumnLines?: boolean;
        /** @name GridBase.Options.showRowLines */
        showRowLines?: boolean;
        /** @name GridBase.Options.sorting */
        sorting?: { ascendingText?: string, clearText?: string, descendingText?: string, mode?: 'multiple' | 'none' | 'single', showSortIndexes?: boolean };
        /** @name GridBase.Options.stateStoring */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((gridState: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /** @name GridBase.Options.twoWayBindingEnabled */
        twoWayBindingEnabled?: boolean;
        /** @name GridBase.Options.wordWrapEnabled */
        wordWrapEnabled?: boolean;
    }
    /** @name GridBase.Options.editing */
    export interface GridBaseEditing {
        /** @name GridBase.Options.editing.confirmDelete */
        confirmDelete?: boolean;
        /** @name GridBase.Options.editing.form */
        form?: dxFormOptions;
        /** @name GridBase.Options.editing.mode */
        mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
        /** @name GridBase.Options.editing.popup */
        popup?: dxPopupOptions;
        /** @name GridBase.Options.editing.refreshMode */
        refreshMode?: 'full' | 'reshape' | 'repaint';
        /** @name GridBase.Options.editing.selectTextOnEditStart */
        selectTextOnEditStart?: boolean;
        /** @name GridBase.Options.editing.startEditAction */
        startEditAction?: 'click' | 'dblClick';
        /** @name GridBase.Options.editing.texts */
        texts?: GridBaseEditingTexts;
        /** @name GridBase.Options.editing.useIcons */
        useIcons?: boolean;
    }
    /** @name GridBase.Options.editing.texts */
    export interface GridBaseEditingTexts {
        /** @name GridBase.Options.editing.texts.addRow */
        addRow?: string;
        /** @name GridBase.Options.editing.texts.cancelAllChanges */
        cancelAllChanges?: string;
        /** @name GridBase.Options.editing.texts.cancelRowChanges */
        cancelRowChanges?: string;
        /** @name GridBase.Options.editing.texts.confirmDeleteMessage */
        confirmDeleteMessage?: string;
        /** @name GridBase.Options.editing.texts.confirmDeleteTitle */
        confirmDeleteTitle?: string;
        /** @name GridBase.Options.editing.texts.deleteRow */
        deleteRow?: string;
        /** @name GridBase.Options.editing.texts.editRow */
        editRow?: string;
        /** @name GridBase.Options.editing.texts.saveAllChanges */
        saveAllChanges?: string;
        /** @name GridBase.Options.editing.texts.saveRowChanges */
        saveRowChanges?: string;
        /** @name GridBase.Options.editing.texts.undeleteRow */
        undeleteRow?: string;
        /** @name GridBase.Options.editing.texts.validationCancelChanges */
        validationCancelChanges?: string;
    }
    /** @name GridBase.Options.paging */
    export interface GridBasePaging {
        /** @name GridBase.Options.paging.enabled */
        enabled?: boolean;
        /** @name GridBase.Options.paging.pageIndex */
        pageIndex?: number;
        /** @name GridBase.Options.paging.pageSize */
        pageSize?: number;
    }
    /** @name GridBase.Options.scrolling */
    export interface GridBaseScrolling {
        /** @name GridBase.Options.scrolling.columnRenderingMode */
        columnRenderingMode?: 'standard' | 'virtual';
        /** @name GridBase.Options.scrolling.preloadEnabled */
        preloadEnabled?: boolean;
        /** @name GridBase.Options.scrolling.rowRenderingMode */
        rowRenderingMode?: 'standard' | 'virtual';
        /** @name GridBase.Options.scrolling.scrollByContent */
        scrollByContent?: boolean;
        /** @name GridBase.Options.scrolling.scrollByThumb */
        scrollByThumb?: boolean;
        /** @name GridBase.Options.scrolling.showScrollbar */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /** @name GridBase.Options.scrolling.useNative */
        useNative?: boolean | 'auto';
    }
    /** @name GridBase.Options.selection */
    export interface GridBaseSelection {
        /** @name GridBase.Options.selection.allowSelectAll */
        allowSelectAll?: boolean;
        /** @name GridBase.Options.selection.mode */
        mode?: 'multiple' | 'none' | 'single';
    }
    /** @name GridBase */
    export class GridBase extends Widget {
        constructor(element: Element, options?: GridBaseOptions)
        constructor(element: JQuery, options?: GridBaseOptions)
        /** @name GridBase.beginCustomLoading(messageText) */
        beginCustomLoading(messageText: string): void;
        /** @name GridBase.byKey(key) */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** @name GridBase.cancelEditData() */
        cancelEditData(): void;
        /** @name GridBase.cellValue(rowIndex, dataField) */
        cellValue(rowIndex: number, dataField: string): any;
        /** @name GridBase.cellValue(rowIndex, dataField, value) */
        cellValue(rowIndex: number, dataField: string, value: any): void;
        /** @name GridBase.cellValue(rowIndex, visibleColumnIndex) */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;
        /** @name GridBase.cellValue(rowIndex, visibleColumnIndex, value) */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
        /** @name GridBase.clearFilter() */
        clearFilter(): void;
        /** @name GridBase.clearFilter(filterName) */
        clearFilter(filterName: string): void;
        /** @name GridBase.clearSelection() */
        clearSelection(): void;
        /** @name GridBase.clearSorting() */
        clearSorting(): void;
        /** @name GridBase.closeEditCell() */
        closeEditCell(): void;
        /** @name GridBase.collapseAdaptiveDetailRow() */
        collapseAdaptiveDetailRow(): void;
        /** @name GridBase.columnCount() */
        columnCount(): number;
        /** @name GridBase.columnOption(id) */
        columnOption(id: number | string): any;
        /** @name GridBase.columnOption(id, optionName) */
        columnOption(id: number | string, optionName: string): any;
        /** @name GridBase.columnOption(id, optionName, optionValue) */
        columnOption(id: number | string, optionName: string, optionValue: any): void;
        /** @name GridBase.columnOption(id, options) */
        columnOption(id: number | string, options: any): void;
        /** @name GridBase.deleteColumn(id) */
        deleteColumn(id: number | string): void;
        /** @name GridBase.deleteRow(rowIndex) */
        deleteRow(rowIndex: number): void;
        /** @name GridBase.deselectAll() */
        deselectAll(): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.deselectRows(keys) */
        deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
        /** @name GridBase.editCell(rowIndex, dataField) */
        editCell(rowIndex: number, dataField: string): void;
        /** @name GridBase.editCell(rowIndex, visibleColumnIndex) */
        editCell(rowIndex: number, visibleColumnIndex: number): void;
        /** @name GridBase.editRow(rowIndex) */
        editRow(rowIndex: number): void;
        /** @name GridBase.endCustomLoading() */
        endCustomLoading(): void;
        /** @name GridBase.expandAdaptiveDetailRow(key) */
        expandAdaptiveDetailRow(key: any): void;
        /** @name GridBase.filter() */
        filter(): any;
        /** @name GridBase.filter(filterExpr) */
        filter(filterExpr: any): void;
        /** @name Widget.focus() */
        focus(): void;
        /** @name GridBase.focus(element) */
        focus(element: Element | JQuery): void;
        /** @name GridBase.getCellElement(rowIndex, dataField) */
        getCellElement(rowIndex: number, dataField: string): DevExpress.core.dxElement | undefined;
        /** @name GridBase.getCellElement(rowIndex, visibleColumnIndex) */
        getCellElement(rowIndex: number, visibleColumnIndex: number): DevExpress.core.dxElement | undefined;
        /** @name GridBase.getCombinedFilter() */
        getCombinedFilter(): any;
        /** @name GridBase.getCombinedFilter(returnDataField) */
        getCombinedFilter(returnDataField: boolean): any;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name GridBase.getKeyByRowIndex(rowIndex) */
        getKeyByRowIndex(rowIndex: number): any;
        /** @name GridBase.getRowElement(rowIndex) */
        getRowElement(rowIndex: number): Array<Element> & JQuery | undefined;
        /** @name GridBase.getRowIndexByKey(key) */
        getRowIndexByKey(key: any | string | number): number;
        /** @name GridBase.getScrollable() */
        getScrollable(): dxScrollable;
        /** @name GridBase.hasEditData() */
        hasEditData(): boolean;
        /** @name GridBase.hideColumnChooser() */
        hideColumnChooser(): void;
        /** @name GridBase.isAdaptiveDetailRowExpanded(key) */
        isAdaptiveDetailRowExpanded(key: any): boolean;
        /** @name GridBase.isRowFocused(key) */
        isRowFocused(key: any): boolean;
        /** @name GridBase.isRowSelected(key) */
        isRowSelected(key: any): boolean;
        /** @name GridBase.keyOf(obj) */
        keyOf(obj: any): any;
        /** @name GridBase.navigateToRow(key) */
        navigateToRow(key: any): void;
        /** @name GridBase.pageCount() */
        pageCount(): number;
        /** @name GridBase.pageIndex() */
        pageIndex(): number;
        /** @name GridBase.pageIndex(newIndex) */
        pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.pageSize() */
        pageSize(): number;
        /** @name GridBase.pageSize(value) */
        pageSize(value: number): void;
        /** @name GridBase.refresh() */
        refresh(): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.refresh(changesOnly) */
        refresh(changesOnly: boolean): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.repaintRows(rowIndexes) */
        repaintRows(rowIndexes: Array<number>): void;
        /** @name GridBase.saveEditData() */
        saveEditData(): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.searchByText(text) */
        searchByText(text: string): void;
        /** @name GridBase.selectAll() */
        selectAll(): Promise<void> & JQueryPromise<void>;
        /** @name GridBase.selectRows(keys, preserve) */
        selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
        /** @name GridBase.selectRowsByIndexes(indexes) */
        selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
        /** @name GridBase.showColumnChooser() */
        showColumnChooser(): void;
        /** @name GridBase.state() */
        state(): any;
        /** @name GridBase.state(state) */
        state(state: any): void;
        /** @name GridBase.undeleteRow(rowIndex) */
        undeleteRow(rowIndex: number): void;
        /** @name GridBase.updateDimensions() */
        updateDimensions(): void;
    }
    /** @name GridBaseColumn */
    export interface GridBaseColumn {
        /** @name GridBaseColumn.alignment */
        alignment?: 'center' | 'left' | 'right' | undefined;
        /** @name GridBaseColumn.allowEditing */
        allowEditing?: boolean;
        /** @name GridBaseColumn.allowFiltering */
        allowFiltering?: boolean;
        /** @name GridBaseColumn.allowFixing */
        allowFixing?: boolean;
        /** @name GridBaseColumn.allowHeaderFiltering */
        allowHeaderFiltering?: boolean;
        /** @name GridBaseColumn.allowHiding */
        allowHiding?: boolean;
        /** @name GridBaseColumn.allowReordering */
        allowReordering?: boolean;
        /** @name GridBaseColumn.allowResizing */
        allowResizing?: boolean;
        /** @name GridBaseColumn.allowSearch */
        allowSearch?: boolean;
        /** @name GridBaseColumn.allowSorting */
        allowSorting?: boolean;
        /** @name GridBaseColumn.calculateCellValue */
        calculateCellValue?: ((rowData: any) => any);
        /** @name GridBaseColumn.calculateDisplayValue */
        calculateDisplayValue?: string | ((rowData: any) => any);
        /** @name GridBaseColumn.calculateFilterExpression */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
        /** @name GridBaseColumn.calculateSortValue */
        calculateSortValue?: string | ((rowData: any) => any);
        /** @name GridBaseColumn.caption */
        caption?: string;
        /** @name GridBaseColumn.cssClass */
        cssClass?: string;
        /** @name GridBaseColumn.customizeText */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string, target?: string, groupInterval?: string | number }) => string);
        /** @name GridBaseColumn.dataField */
        dataField?: string;
        /** @name GridBaseColumn.dataType */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /** @name GridBaseColumn.editorOptions */
        editorOptions?: any;
        /** @name GridBaseColumn.encodeHtml */
        encodeHtml?: boolean;
        /** @name GridBaseColumn.falseText */
        falseText?: string;
        /** @name GridBaseColumn.filterOperations */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'notcontains' | 'contains' | 'startswith' | 'endswith' | 'between'>;
        /** @name GridBaseColumn.filterType */
        filterType?: 'exclude' | 'include';
        /** @name GridBaseColumn.filterValue */
        filterValue?: any;
        /** @name GridBaseColumn.filterValues */
        filterValues?: Array<any>;
        /** @name GridBaseColumn.fixed */
        fixed?: boolean;
        /** @name GridBaseColumn.fixedPosition */
        fixedPosition?: 'left' | 'right';
        /** @name GridBaseColumn.formItem */
        formItem?: dxFormSimpleItem;
        /** @name GridBaseColumn.format */
        format?: format;
        /** @name GridBaseColumn.headerFilter */
        headerFilter?: { allowSearch?: boolean, dataSource?: Array<any> | ((options: { component?: any, dataSource?: DevExpress.data.DataSourceOptions }) => any) | DevExpress.data.DataSourceOptions, groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number, height?: number, searchMode?: 'contains' | 'startswith' | 'equals', width?: number };
        /** @name GridBaseColumn.hidingPriority */
        hidingPriority?: number;
        /** @name GridBaseColumn.isBand */
        isBand?: boolean;
        /** @name GridBaseColumn.lookup */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store | ((options: { data?: any, key?: any }) => Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store), displayExpr?: string | ((data: any) => string), valueExpr?: string };
        /** @name GridBaseColumn.minWidth */
        minWidth?: number;
        /** @name GridBaseColumn.name */
        name?: string;
        /** @name GridBaseColumn.ownerBand */
        ownerBand?: number;
        /** @name GridBaseColumn.renderAsync */
        renderAsync?: boolean;
        /** @name GridBaseColumn.selectedFilterOperation */
        selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
        /** @name GridBaseColumn.setCellValue */
        setCellValue?: ((newData: any, value: any, currentRowData: any) => void | Promise<void> | JQueryPromise<void>);
        /** @name GridBaseColumn.showEditorAlways */
        showEditorAlways?: boolean;
        /** @name GridBaseColumn.showInColumnChooser */
        showInColumnChooser?: boolean;
        /** @name GridBaseColumn.sortIndex */
        sortIndex?: number;
        /** @name GridBaseColumn.sortOrder */
        sortOrder?: 'asc' | 'desc' | undefined;
        /** @name GridBaseColumn.sortingMethod */
        sortingMethod?: ((value1: any, value2: any) => number);
        /** @name GridBaseColumn.trueText */
        trueText?: string;
        /** @name GridBaseColumn.validationRules */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /** @name GridBaseColumn.visible */
        visible?: boolean;
        /** @name GridBaseColumn.visibleIndex */
        visibleIndex?: number;
        /** @name GridBaseColumn.width */
        width?: number | string;
    }
    /** @name GridBaseColumnButton */
    export interface GridBaseColumnButton {
        /** @name GridBaseColumnButton.cssClass */
        cssClass?: string;
        /** @name GridBaseColumnButton.hint */
        hint?: string;
        /** @name GridBaseColumnButton.icon */
        icon?: string;
        /** @name GridBaseColumnButton.text */
        text?: string;
    }
    /** @name HierarchicalCollectionWidget.Options */
    export interface HierarchicalCollectionWidgetOptions<T = HierarchicalCollectionWidget> extends CollectionWidgetOptions<T> {
        /** @name HierarchicalCollectionWidget.Options.disabledExpr */
        disabledExpr?: string | Function;
        /** @name HierarchicalCollectionWidget.Options.displayExpr */
        displayExpr?: string | ((item: any) => string);
        /** @name HierarchicalCollectionWidget.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name HierarchicalCollectionWidget.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name HierarchicalCollectionWidget.Options.itemsExpr */
        itemsExpr?: string | Function;
        /** @name HierarchicalCollectionWidget.Options.keyExpr */
        keyExpr?: string | ((item: any) => string);
        /** @name HierarchicalCollectionWidget.Options.selectedExpr */
        selectedExpr?: string | Function;
    }
    /** @name HierarchicalCollectionWidget */
    export class HierarchicalCollectionWidget extends CollectionWidget {
        constructor(element: Element, options?: HierarchicalCollectionWidgetOptions)
        constructor(element: JQuery, options?: HierarchicalCollectionWidgetOptions)
    }
    /** @name MapLocation */
    export interface MapLocation {
        /** @name MapLocation.lat */
        lat?: number;
        /** @name MapLocation.lng */
        lng?: number;
    }
    /** @name NumericRule */
    export interface NumericRule {
        /** @name NumericRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name NumericRule.message */
        message?: string;
        /** @name NumericRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name PatternRule */
    export interface PatternRule {
        /** @name PatternRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name PatternRule.message */
        message?: string;
        /** @name PatternRule.pattern */
        pattern?: RegExp | string;
        /** @name PatternRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name RangeRule */
    export interface RangeRule {
        /** @name RangeRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name RangeRule.max */
        max?: Date | number;
        /** @name RangeRule.message */
        message?: string;
        /** @name RangeRule.min */
        min?: Date | number;
        /** @name RangeRule.reevaluate */
        reevaluate?: boolean;
        /** @name RangeRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name RequiredRule */
    export interface RequiredRule {
        /** @name RequiredRule.message */
        message?: string;
        /** @name RequiredRule.trim */
        trim?: boolean;
        /** @name RequiredRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name SearchBoxMixin.Options */
    export interface SearchBoxMixinOptions<T = SearchBoxMixin> {
        /** @name SearchBoxMixin.Options.searchEditorOptions */
        searchEditorOptions?: dxTextBoxOptions;
        /** @name SearchBoxMixin.Options.searchEnabled */
        searchEnabled?: boolean;
        /** @name SearchBoxMixin.Options.searchExpr */
        searchExpr?: string | Function | Array<string | Function>;
        /** @name SearchBoxMixin.Options.searchMode */
        searchMode?: 'contains' | 'startswith' | 'equals';
        /** @name SearchBoxMixin.Options.searchTimeout */
        searchTimeout?: number;
        /** @name SearchBoxMixin.Options.searchValue */
        searchValue?: string;
    }
    /** @name SearchBoxMixin */
    export class SearchBoxMixin {
        constructor(options?: SearchBoxMixinOptions)
    }
    /** @name StringLengthRule */
    export interface StringLengthRule {
        /** @name StringLengthRule.ignoreEmptyValue */
        ignoreEmptyValue?: boolean;
        /** @name StringLengthRule.max */
        max?: number;
        /** @name StringLengthRule.message */
        message?: string;
        /** @name StringLengthRule.min */
        min?: number;
        /** @name StringLengthRule.trim */
        trim?: boolean;
        /** @name StringLengthRule.type */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /** @name Widget.Options */
    export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
        /** @name Widget.Options.accessKey */
        accessKey?: string;
        /** @name Widget.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name Widget.Options.disabled */
        disabled?: boolean;
        /** @name Widget.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name Widget.Options.hint */
        hint?: string;
        /** @name Widget.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name Widget.Options.onContentReady */
        onContentReady?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name Widget.Options.tabIndex */
        tabIndex?: number;
        /** @name Widget.Options.visible */
        visible?: boolean;
    }
    /** @name Widget */
    export class Widget extends DOMComponent {
        constructor(element: Element, options?: WidgetOptions)
        constructor(element: JQuery, options?: WidgetOptions)
        /** @name Widget.focus() */
        focus(): void;
        /** @name Widget.registerKeyHandler(key, handler) */
        registerKeyHandler(key: string, handler: Function): void;
        /** @name Widget.repaint() */
        repaint(): void;
    }
    /** @name dxAccordion.Options */
    export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
        /** @name dxAccordion.Options.animationDuration */
        animationDuration?: number;
        /** @name dxAccordion.Options.collapsible */
        collapsible?: boolean;
        /** @name dxAccordion.Options.deferRendering */
        deferRendering?: boolean;
        /** @name dxAccordion.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxAccordion.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxAccordion.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxAccordion.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxAccordion.Options.itemTitleTemplate */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxAccordion.Options.items */
        items?: Array<string | dxAccordionItem | any>;
        /** @name dxAccordion.Options.multiple */
        multiple?: boolean;
        /** @name dxAccordion.Options.onItemTitleClick */
        onItemTitleClick?: ((e: { component?: dxAccordion, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: event }) => any) | string;
        /** @name dxAccordion.Options.repaintChangesOnly */
        repaintChangesOnly?: boolean;
        /** @name dxAccordion.Options.selectedIndex */
        selectedIndex?: number;
    }
    /** @name dxAccordion */
    export class dxAccordion extends CollectionWidget {
        constructor(element: Element, options?: dxAccordionOptions)
        constructor(element: JQuery, options?: dxAccordionOptions)
        /** @name dxAccordion.collapseItem(index) */
        collapseItem(index: number): Promise<void> & JQueryPromise<void>;
        /** @name dxAccordion.expandItem(index) */
        expandItem(index: number): Promise<void> & JQueryPromise<void>;
        /** @name dxAccordion.updateDimensions() */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxAccordionItem */
    export interface dxAccordionItem extends CollectionWidgetItem {
        /** @name dxAccordionItem.icon */
        icon?: string;
        /** @name dxAccordionItem.title */
        title?: string;
    }
    /** @name dxActionSheet.Options */
    export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
        /** @name dxActionSheet.Options.cancelText */
        cancelText?: string;
        /** @name dxActionSheet.Options.items */
        items?: Array<string | dxActionSheetItem | any>;
        /** @name dxActionSheet.Options.onCancelClick */
        onCancelClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any) | string;
        /** @name dxActionSheet.Options.showCancelButton */
        showCancelButton?: boolean;
        /** @name dxActionSheet.Options.showTitle */
        showTitle?: boolean;
        /** @name dxActionSheet.Options.target */
        target?: string | Element | JQuery;
        /** @name dxActionSheet.Options.title */
        title?: string;
        /** @name dxActionSheet.Options.usePopover */
        usePopover?: boolean;
        /** @name dxActionSheet.Options.visible */
        visible?: boolean;
    }
    /** @name dxActionSheet */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: Element, options?: dxActionSheetOptions)
        constructor(element: JQuery, options?: dxActionSheetOptions)
        /** @name dxActionSheet.hide() */
        hide(): Promise<void> & JQueryPromise<void>;
        /** @name dxActionSheet.show() */
        show(): Promise<void> & JQueryPromise<void>;
        /** @name dxActionSheet.toggle(showing) */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxActionSheetItem */
    export interface dxActionSheetItem extends CollectionWidgetItem {
        /** @name dxActionSheetItem.icon */
        icon?: string;
        /** @name dxActionSheetItem.onClick */
        onClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxActionSheetItem.type */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /** @name dxAutocomplete.Options */
    export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
        /** @name dxAutocomplete.Options.maxItemCount */
        maxItemCount?: number;
        /** @name dxAutocomplete.Options.minSearchLength */
        minSearchLength?: number;
        /** @name dxAutocomplete.Options.showDropDownButton */
        showDropDownButton?: boolean;
        /** @name dxAutocomplete.Options.value */
        value?: string;
    }
    /** @name dxAutocomplete */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: Element, options?: dxAutocompleteOptions)
        constructor(element: JQuery, options?: dxAutocompleteOptions)
    }
    /** @name dxBox.Options */
    export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
        /** @name dxBox.Options.align */
        align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
        /** @name dxBox.Options.crossAlign */
        crossAlign?: 'center' | 'end' | 'start' | 'stretch';
        /** @name dxBox.Options.direction */
        direction?: 'col' | 'row';
        /** @name dxBox.Options.items */
        items?: Array<string | dxBoxItem | any>;
    }
    /** @name dxBox */
    export class dxBox extends CollectionWidget {
        constructor(element: Element, options?: dxBoxOptions)
        constructor(element: JQuery, options?: dxBoxOptions)
    }
    /** @name dxBoxItem */
    export interface dxBoxItem extends CollectionWidgetItem {
        /** @name dxBoxItem.baseSize */
        baseSize?: number | 'auto';
        /** @name dxBoxItem.box */
        box?: dxBoxOptions;
        /** @name dxBoxItem.ratio */
        ratio?: number;
        /** @name dxBoxItem.shrink */
        shrink?: number;
    }
    /** @name dxButton.Options */
    export interface dxButtonOptions extends WidgetOptions<dxButton> {
        /** @name dxButton.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxButton.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxButton.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxButton.Options.icon */
        icon?: string;
        /** @name dxButton.Options.onClick */
        onClick?: ((e: { component?: dxButton, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, validationGroup?: any }) => any);
        /** @name dxButton.Options.stylingMode */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /** @name dxButton.Options.template */
        template?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxButton.Options.text */
        text?: string;
        /** @name dxButton.Options.type */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
        /** @name dxButton.Options.useSubmitBehavior */
        useSubmitBehavior?: boolean;
        /** @name dxButton.Options.validationGroup */
        validationGroup?: string;
    }
    /** @name dxButton */
    export class dxButton extends Widget {
        constructor(element: Element, options?: dxButtonOptions)
        constructor(element: JQuery, options?: dxButtonOptions)
    }
    /** @name dxButtonDefaultTemplate */
    export interface dxButtonDefaultTemplate {
        /** @name dxButtonDefaultTemplate.icon */
        icon?: string;
        /** @name dxButtonDefaultTemplate.text */
        text?: string;
    }
    /** @name dxButtonGroup.Options */
    export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
        /** @name dxButtonGroup.Options.buttonTemplate */
        buttonTemplate?: DevExpress.core.template | ((buttonData: any, buttonContent: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxButtonGroup.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxButtonGroup.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @deprecated */
        /** @name dxButtonGroup.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | Function;
        /** @name dxButtonGroup.Options.items */
        items?: Array<dxButtonGroupItem>;
        /** @name dxButtonGroup.Options.keyExpr */
        keyExpr?: string | Function;
        /** @name dxButtonGroup.Options.onItemClick */
        onItemClick?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: event }) => any);
        /** @name dxButtonGroup.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /** @name dxButtonGroup.Options.selectedItemKeys */
        selectedItemKeys?: Array<any>;
        /** @name dxButtonGroup.Options.selectedItems */
        selectedItems?: Array<any>;
        /** @name dxButtonGroup.Options.selectionMode */
        selectionMode?: 'multiple' | 'single';
        /** @name dxButtonGroup.Options.stylingMode */
        stylingMode?: 'text' | 'outlined' | 'contained';
    }
    /** @name dxButtonGroup */
    export class dxButtonGroup extends Widget {
        constructor(element: Element, options?: dxButtonGroupOptions)
        constructor(element: JQuery, options?: dxButtonGroupOptions)
    }
    /** @name dxButtonGroupItem */
    export interface dxButtonGroupItem extends CollectionWidgetItem {
        /** @name dxButtonGroupItem.hint */
        hint?: string;
        /** @name dxButtonGroupItem.icon */
        icon?: string;
        /** @name dxButtonGroupItem.type */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /** @name dxCalendar.Options */
    export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
        /** @name dxCalendar.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxCalendar.Options.cellTemplate */
        cellTemplate?: DevExpress.core.template | ((itemData: { date?: Date, view?: string, text?: string }, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxCalendar.Options.dateSerializationFormat */
        dateSerializationFormat?: string;
        /** @name dxCalendar.Options.disabledDates */
        disabledDates?: Array<Date> | ((data: { component?: any, date?: Date, view?: string }) => boolean);
        /** @name dxCalendar.Options.firstDayOfWeek */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /** @name dxCalendar.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxCalendar.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxCalendar.Options.max */
        max?: Date | number | string;
        /** @name dxCalendar.Options.maxZoomLevel */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** @name dxCalendar.Options.min */
        min?: Date | number | string;
        /** @name dxCalendar.Options.minZoomLevel */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** @name dxCalendar.Options.name */
        name?: string;
        /** @name dxCalendar.Options.showTodayButton */
        showTodayButton?: boolean;
        /** @name dxCalendar.Options.value */
        value?: Date | number | string;
        /** @name dxCalendar.Options.zoomLevel */
        zoomLevel?: 'century' | 'decade' | 'month' | 'year';
    }
    /** @name dxCalendar */
    export class dxCalendar extends Editor {
        constructor(element: Element, options?: dxCalendarOptions)
        constructor(element: JQuery, options?: dxCalendarOptions)
    }
    /** @name dxCalendarCellTemplate */
    export interface dxCalendarCellTemplate {
        /** @name dxCalendarCellTemplate.date */
        date?: Date;
        /** @name dxCalendarCellTemplate.text */
        text?: string;
        /** @name dxCalendarCellTemplate.view */
        view?: 'month' | 'year' | 'decade' | 'century';
    }
    /** @name dxCheckBox.Options */
    export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
        /** @name dxCheckBox.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxCheckBox.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxCheckBox.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxCheckBox.Options.name */
        name?: string;
        /** @name dxCheckBox.Options.text */
        text?: string;
        /** @name dxCheckBox.Options.value */
        value?: boolean;
    }
    /** @name dxCheckBox */
    export class dxCheckBox extends Editor {
        constructor(element: Element, options?: dxCheckBoxOptions)
        constructor(element: JQuery, options?: dxCheckBoxOptions)
    }
    /** @name dxColorBox.Options */
    export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
        /** @name dxColorBox.Options.applyButtonText */
        applyButtonText?: string;
        /** @name dxColorBox.Options.applyValueMode */
        applyValueMode?: 'instantly' | 'useButtons';
        /** @name dxColorBox.Options.cancelButtonText */
        cancelButtonText?: string;
        /** @name dxColorBox.Options.editAlphaChannel */
        editAlphaChannel?: boolean;
        /** @name dxColorBox.Options.fieldTemplate */
        fieldTemplate?: DevExpress.core.template | ((value: string, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxColorBox.Options.keyStep */
        keyStep?: number;
        /** @name dxColorBox.Options.value */
        value?: string;
    }
    /** @name dxColorBox */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxColorBoxOptions)
        constructor(element: JQuery, options?: dxColorBoxOptions)
    }
    /** @name dxContextMenu.Options */
    export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
        /** @name dxContextMenu.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** @name dxContextMenu.Options.items */
        items?: Array<dxContextMenuItem>;
        /** @name dxContextMenu.Options.onHidden */
        onHidden?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxContextMenu.Options.onHiding */
        onHiding?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** @name dxContextMenu.Options.onPositioning */
        onPositioning?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, position?: positionConfig }) => any);
        /** @name dxContextMenu.Options.onShowing */
        onShowing?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** @name dxContextMenu.Options.onShown */
        onShown?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxContextMenu.Options.position */
        position?: positionConfig;
        /** @name dxContextMenu.Options.showEvent */
        showEvent?: { delay?: number, name?: string } | string;
        /** @name dxContextMenu.Options.submenuDirection */
        submenuDirection?: 'auto' | 'left' | 'right';
        /** @name dxContextMenu.Options.target */
        target?: string | Element | JQuery;
        /** @name dxContextMenu.Options.visible */
        visible?: boolean;
    }
    /** @name dxContextMenu */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: Element, options?: dxContextMenuOptions)
        constructor(element: JQuery, options?: dxContextMenuOptions)
        /** @name dxContextMenu.hide() */
        hide(): Promise<void> & JQueryPromise<void>;
        /** @name dxContextMenu.show() */
        show(): Promise<void> & JQueryPromise<void>;
        /** @name dxContextMenu.toggle(showing) */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxContextMenuItem */
    export interface dxContextMenuItem extends dxMenuBaseItem {
        /** @name dxContextMenuItem.items */
        items?: Array<dxContextMenuItem>;
    }
    /** @name dxDataGrid.Options */
    export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
        /** @name dxDataGrid.Options.columns */
        columns?: Array<dxDataGridColumn | string>;
        /** @name dxDataGrid.Options.customizeColumns */
        customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
        /** @name dxDataGrid.Options.customizeExportData */
        customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
        /** @name dxDataGrid.Options.editing */
        editing?: dxDataGridEditing;
        /** @name dxDataGrid.Options.export */
        export?: { allowExportSelectedData?: boolean, customizeExcelCell?: ((options: { component?: dxDataGrid, horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top', wrapTextEnabled?: boolean, backgroundColor?: string, fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid', fillPatternColor?: string, font?: DevExpress.exporter.ExcelFont, value?: string | number | Date, numberFormat?: string, gridCell?: DevExpress.exporter.ExcelDataGridCell }) => any), enabled?: boolean, excelFilterEnabled?: boolean, excelWrapTextEnabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string, texts?: { exportAll?: string, exportSelectedRows?: string, exportTo?: string } };
        /** @name dxDataGrid.Options.groupPanel */
        groupPanel?: { allowColumnDragging?: boolean, emptyPanelText?: string, visible?: boolean | 'auto' };
        /** @name dxDataGrid.Options.grouping */
        grouping?: { allowCollapsing?: boolean, autoExpandAll?: boolean, contextMenuEnabled?: boolean, expandMode?: 'buttonClick' | 'rowClick', texts?: { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string } };
        /** @name dxDataGrid.Options.keyExpr */
        keyExpr?: string | Array<string>;
        /** @name dxDataGrid.Options.masterDetail */
        masterDetail?: { autoExpandAll?: boolean, enabled?: boolean, template?: DevExpress.core.template | ((detailElement: DevExpress.core.dxElement, detailInfo: { key?: any, data?: any, watch?: Function }) => any) };
        /** @name dxDataGrid.Options.onCellClick */
        onCellClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any) | string;
        /** @name dxDataGrid.Options.onCellDblClick */
        onCellDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onCellHoverChanged */
        onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onCellPrepared */
        onCellPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /** @name dxDataGrid.Options.onContextMenuPreparing */
        onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onEditingStart */
        onEditingStart?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /** @name dxDataGrid.Options.onEditorPrepared */
        onEditorPrepared?: ((options: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onEditorPreparing */
        onEditorPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onExported */
        onExported?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxDataGrid.Options.onExporting */
        onExporting?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /** @name dxDataGrid.Options.onFileSaving */
        onFileSaving?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** @name dxDataGrid.Options.onFocusedCellChanged */
        onFocusedCellChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any);
        /** @name dxDataGrid.Options.onFocusedCellChanging */
        onFocusedCellChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxDataGridRowObject>, columns?: Array<dxDataGridColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /** @name dxDataGrid.Options.onFocusedRowChanged */
        onFocusedRowChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /** @name dxDataGrid.Options.onFocusedRowChanging */
        onFocusedRowChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxDataGridRowObject>, cancel?: boolean }) => any);
        /** @name dxDataGrid.Options.onRowClick */
        onRowClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => any) | string;
        /** @name dxDataGrid.Options.onRowDblClick */
        onRowDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement }) => any);
        /** @name dxDataGrid.Options.onRowPrepared */
        onRowPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /** @name dxDataGrid.Options.remoteOperations */
        remoteOperations?: boolean | { filtering?: boolean, groupPaging?: boolean, grouping?: boolean, paging?: boolean, sorting?: boolean, summary?: boolean } | 'auto';
        /** @name dxDataGrid.Options.rowTemplate */
        rowTemplate?: DevExpress.core.template | ((rowElement: DevExpress.core.dxElement, rowInfo: any) => any);
        /** @name dxDataGrid.Options.scrolling */
        scrolling?: dxDataGridScrolling;
        /** @name dxDataGrid.Options.selection */
        selection?: dxDataGridSelection;
        /** @name dxDataGrid.Options.selectionFilter */
        selectionFilter?: string | Array<any> | Function;
        /** @name dxDataGrid.Options.sortByGroupSummaryInfo */
        sortByGroupSummaryInfo?: Array<{ groupColumn?: string, sortOrder?: 'asc' | 'desc', summaryItem?: string | number }>;
        /** @name dxDataGrid.Options.summary */
        summary?: { calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any, groupIndex?: number }) => any), groupItems?: Array<{ alignByColumn?: boolean, column?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }>, recalculateWhileEditing?: boolean, skipEmptyValues?: boolean, texts?: { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string }, totalItems?: Array<{ alignment?: 'center' | 'left' | 'right', column?: string, cssClass?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }> };
    }
    /** @name dxDataGrid.Options.editing */
    export interface dxDataGridEditing extends GridBaseEditing {
        /** @name dxDataGrid.Options.editing.allowAdding */
        allowAdding?: boolean;
        /** @name dxDataGrid.Options.editing.allowDeleting */
        allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /** @name dxDataGrid.Options.editing.allowUpdating */
        allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /** @name dxDataGrid.Options.editing.texts */
        texts?: any;
    }
    /** @name dxDataGrid.Options.scrolling */
    export interface dxDataGridScrolling extends GridBaseScrolling {
        /** @name dxDataGrid.Options.scrolling.mode */
        mode?: 'infinite' | 'standard' | 'virtual';
    }
    /** @name dxDataGrid.Options.selection */
    export interface dxDataGridSelection extends GridBaseSelection {
        /** @name dxDataGrid.Options.selection.deferred */
        deferred?: boolean;
        /** @name dxDataGrid.Options.selection.selectAllMode */
        selectAllMode?: 'allPages' | 'page';
        /** @name dxDataGrid.Options.selection.showCheckBoxesMode */
        showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
    }
    /** @name dxDataGrid */
    export class dxDataGrid extends GridBase {
        constructor(element: Element, options?: dxDataGridOptions)
        constructor(element: JQuery, options?: dxDataGridOptions)
        /** @name dxDataGrid.addColumn(columnOptions) */
        addColumn(columnOptions: any | string): void;
        /** @name dxDataGrid.addRow() */
        addRow(): void;
        /** @name dxDataGrid.clearGrouping() */
        clearGrouping(): void;
        /** @name dxDataGrid.collapseAll(groupIndex) */
        collapseAll(groupIndex?: number): void;
        /** @name dxDataGrid.collapseRow(key) */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /** @name dxDataGrid.expandAll(groupIndex) */
        expandAll(groupIndex?: number): void;
        /** @name dxDataGrid.expandRow(key) */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /** @name dxDataGrid.exportToExcel(selectionOnly) */
        exportToExcel(selectionOnly: boolean): void;
        /** @name dxDataGrid.getSelectedRowKeys() */
        getSelectedRowKeys(): Array<any> & Promise<any> & JQueryPromise<any>;
        /** @name dxDataGrid.getSelectedRowsData() */
        getSelectedRowsData(): Array<any> & Promise<any> & JQueryPromise<any>;
        /** @name dxDataGrid.getTotalSummaryValue(summaryItemName) */
        getTotalSummaryValue(summaryItemName: string): any;
        /** @name dxDataGrid.getVisibleColumns() */
        getVisibleColumns(): Array<dxDataGridColumn>;
        /** @name dxDataGrid.getVisibleColumns(headerLevel) */
        getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
        /** @name dxDataGrid.getVisibleRows() */
        getVisibleRows(): Array<dxDataGridRowObject>;
        /** @deprecated */
        /** @name dxDataGrid.insertRow() */
        insertRow(): void;
        /** @name dxDataGrid.isRowExpanded(key) */
        isRowExpanded(key: any): boolean;
        /** @name dxDataGrid.isRowSelected(data) */
        isRowSelected(data: any): boolean;
        /** @name GridBase.isRowSelected(key) */
        isRowSelected(key: any): boolean;
        /** @deprecated */
        /** @name dxDataGrid.removeRow(rowIndex) */
        removeRow(rowIndex: number): void;
        /** @name dxDataGrid.totalCount() */
        totalCount(): number;
    }
    /** @name dxDataGridColumn */
    export interface dxDataGridColumn extends GridBaseColumn {
        /** @name dxDataGridColumn.allowExporting */
        allowExporting?: boolean;
        /** @name dxDataGridColumn.allowGrouping */
        allowGrouping?: boolean;
        /** @name dxDataGridColumn.autoExpandGroup */
        autoExpandGroup?: boolean;
        /** @name dxDataGridColumn.buttons */
        buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxDataGridColumnButton>;
        /** @name dxDataGridColumn.calculateGroupValue */
        calculateGroupValue?: string | ((rowData: any) => any);
        /** @name dxDataGridColumn.cellTemplate */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /** @name dxDataGridColumn.columns */
        columns?: Array<dxDataGridColumn | string>;
        /** @name dxDataGridColumn.editCellTemplate */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxDataGrid, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /** @name dxDataGridColumn.groupCellTemplate */
        groupCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, summaryItems?: Array<any>, groupContinuesMessage?: string, groupContinuedMessage?: string }) => any);
        /** @name dxDataGridColumn.groupIndex */
        groupIndex?: number;
        /** @name dxDataGridColumn.headerCellTemplate */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxDataGrid, columnIndex?: number, column?: dxDataGridColumn }) => any);
        /** @name dxDataGridColumn.showWhenGrouped */
        showWhenGrouped?: boolean;
        /** @name dxDataGridColumn.type */
        type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
    }
    /** @name dxDataGridColumnButton */
    export interface dxDataGridColumnButton extends GridBaseColumnButton {
        /** @name dxDataGridColumnButton.name */
        name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /** @name dxDataGridColumnButton.onClick */
        onClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: event, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any) | string;
        /** @name dxDataGridColumnButton.template */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxDataGrid, data?: any, key?: any, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject }) => string | Element | JQuery);
        /** @name dxDataGridColumnButton.visible */
        visible?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => boolean);
    }
    /** @name dxDataGridRowObject */
    export interface dxDataGridRowObject {
        /** @name dxDataGridRowObject.data */
        data?: any;
        /** @name dxDataGridRowObject.groupIndex */
        groupIndex?: number;
        /** @name dxDataGridRowObject.isEditing */
        isEditing?: boolean;
        /** @name dxDataGridRowObject.isExpanded */
        isExpanded?: boolean;
        /** @name dxDataGridRowObject.isNewRow */
        isNewRow?: boolean;
        /** @name dxDataGridRowObject.isSelected */
        isSelected?: boolean;
        /** @name dxDataGridRowObject.key */
        key?: any;
        /** @name dxDataGridRowObject.rowIndex */
        rowIndex?: number;
        /** @name dxDataGridRowObject.rowType */
        rowType?: string;
        /** @name dxDataGridRowObject.values */
        values?: Array<any>;
    }
    /** @name dxDateBox.Options */
    export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
        /** @name dxDateBox.Options.adaptivityEnabled */
        adaptivityEnabled?: boolean;
        /** @name dxDateBox.Options.applyButtonText */
        applyButtonText?: string;
        /** @name dxDateBox.Options.calendarOptions */
        calendarOptions?: dxCalendarOptions;
        /** @name dxDateBox.Options.cancelButtonText */
        cancelButtonText?: string;
        /** @name dxDateBox.Options.dateOutOfRangeMessage */
        dateOutOfRangeMessage?: string;
        /** @name dxDateBox.Options.dateSerializationFormat */
        dateSerializationFormat?: string;
        /** @name dxDateBox.Options.disabledDates */
        disabledDates?: Array<Date> | ((data: { component?: dxDateBox, date?: Date, view?: string }) => boolean);
        /** @name dxDateBox.Options.displayFormat */
        displayFormat?: format;
        /** @name dxDateBox.Options.interval */
        interval?: number;
        /** @name dxDateBox.Options.invalidDateMessage */
        invalidDateMessage?: string;
        /** @name dxDateBox.Options.max */
        max?: Date | number | string;
        /** @deprecated */
        /** @name dxDateBox.Options.maxZoomLevel */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** @name dxDateBox.Options.min */
        min?: Date | number | string;
        /** @deprecated */
        /** @name dxDateBox.Options.minZoomLevel */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** @name dxDateBox.Options.pickerType */
        pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
        /** @name dxDateBox.Options.placeholder */
        placeholder?: string;
        /** @name dxDateBox.Options.showAnalogClock */
        showAnalogClock?: boolean;
        /** @name dxDateBox.Options.type */
        type?: 'date' | 'datetime' | 'time';
        /** @name dxDateBox.Options.useMaskBehavior */
        useMaskBehavior?: boolean;
        /** @name dxDateBox.Options.value */
        value?: Date | number | string;
    }
    /** @name dxDateBox */
    export class dxDateBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDateBoxOptions)
        constructor(element: JQuery, options?: dxDateBoxOptions)
        /** @name dxDateBox.close() */
        close(): void;
        /** @name dxDateBox.open() */
        open(): void;
    }
    /** @name dxDeferRendering.Options */
    export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
        /** @name dxDeferRendering.Options.animation */
        animation?: animationConfig;
        /** @name dxDeferRendering.Options.onRendered */
        onRendered?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxDeferRendering.Options.onShown */
        onShown?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxDeferRendering.Options.renderWhen */
        renderWhen?: Promise<void> | JQueryPromise<void> | boolean;
        /** @name dxDeferRendering.Options.showLoadIndicator */
        showLoadIndicator?: boolean;
        /** @name dxDeferRendering.Options.staggerItemSelector */
        staggerItemSelector?: string;
    }
    /** @name dxDeferRendering */
    export class dxDeferRendering extends Widget {
        constructor(element: Element, options?: dxDeferRenderingOptions)
        constructor(element: JQuery, options?: dxDeferRenderingOptions)
    }
    /** @name dxDiagram.Options */
    export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
        /** @name dxDiagram.Options.autoZoom */
        autoZoom?: 'fitContent' | 'fitWidth' | 'disabled';
        /** @name dxDiagram.Options.contextMenu */
        contextMenu?: { commands?: Array<'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'bringToFront' | 'sendToBack' | 'lock' | 'unlock' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage'>, enabled?: boolean };
        /** @name dxDiagram.Options.customShapes */
        customShapes?: Array<{ allowEditImage?: boolean, allowEditText?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string, category?: string, connectionPoints?: Array<{ x?: number, y?: number }>, defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, type?: string }>;
        /** @name dxDiagram.Options.edges */
        edges?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, fromExpr?: string | ((data: any) => any), fromLineEndExpr?: string | ((data: any) => any), fromPointIndexExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), lineTypeExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), pointsExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), toExpr?: string | ((data: any) => any), toLineEndExpr?: string | ((data: any) => any), toPointIndexExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /** @name dxDiagram.Options.export */
        export?: { fileName?: string, proxyUrl?: string };
        /** @name dxDiagram.Options.fullScreen */
        fullScreen?: boolean;
        /** @name dxDiagram.Options.gridSize */
        gridSize?: number | { items?: Array<number>, value?: number };
        /** @name dxDiagram.Options.nodes */
        nodes?: { autoLayout?: 'off' | 'tree' | 'layered' | { orientation?: 'auto' | 'vertical' | 'horizontal', type?: 'off' | 'tree' | 'layered' }, childrenExpr?: string | ((data: any) => any), containerKeyExpr?: string | ((data: any) => any), dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, heightExpr?: string | ((data: any) => any), imageUrlExpr?: string | ((data: any) => any), itemsExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), leftExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), parentKeyExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), topExpr?: string | ((data: any) => any), typeExpr?: string | ((data: any) => any), widthExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /** @name dxDiagram.Options.onDataChanged */
        onDataChanged?: ((e: any) => any);
        /** @name dxDiagram.Options.onItemClick */
        onItemClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /** @name dxDiagram.Options.onItemDblClick */
        onItemDblClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /** @name dxDiagram.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, items?: Array<dxDiagramItem> }) => any);
        /** @name dxDiagram.Options.pageColor */
        pageColor?: string;
        /** @name dxDiagram.Options.pageOrientation */
        pageOrientation?: 'portrait' | 'landscape';
        /** @name dxDiagram.Options.pageSize */
        pageSize?: { height?: number, items?: Array<{ height?: number, text?: string, width?: number }>, width?: number };
        /** @name dxDiagram.Options.propertiesPanel */
        propertiesPanel?: { collapsible?: boolean, enabled?: boolean, groups?: Array<{ commands?: Array<'zoomLevel' | 'autoZoom' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'> }> };
        /** @name dxDiagram.Options.readOnly */
        readOnly?: boolean;
        /** @name dxDiagram.Options.showGrid */
        showGrid?: boolean;
        /** @name dxDiagram.Options.simpleView */
        simpleView?: boolean;
        /** @name dxDiagram.Options.snapToGrid */
        snapToGrid?: boolean;
        /** @name dxDiagram.Options.toolbar */
        toolbar?: { commands?: Array<'separator' | 'export' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'autoLayout' | 'fullScreen'>, visible?: boolean };
        /** @name dxDiagram.Options.toolbox */
        toolbox?: { groups?: Array<{ category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', expanded?: boolean, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, title?: string }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>, visible?: boolean };
        /** @name dxDiagram.Options.units */
        units?: 'in' | 'cm' | 'px';
        /** @name dxDiagram.Options.viewUnits */
        viewUnits?: 'in' | 'cm' | 'px';
        /** @name dxDiagram.Options.zoomLevel */
        zoomLevel?: number | { items?: Array<number>, value?: number };
    }
    /** @name dxDiagram */
    export class dxDiagram extends Widget {
        constructor(element: Element, options?: dxDiagramOptions)
        constructor(element: JQuery, options?: dxDiagramOptions)
        /** @name dxDiagram.export() */
        export(): string;
        /** @name dxDiagram.exportTo(format, callback) */
        exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
        /** @name dxDiagram.import(data, updateExistingItemsOnly) */
        import(data: string, updateExistingItemsOnly?: boolean): void;
    }
    /** @name dxDiagramConnector */
    export interface dxDiagramConnector extends dxDiagramItem {
        /** @name dxDiagramConnector.fromKey */
        fromKey?: any;
        /** @name dxDiagramConnector.texts */
        texts?: Array<string>;
        /** @name dxDiagramConnector.toKey */
        toKey?: any;
    }
    /** @name dxDiagramItem */
    export interface dxDiagramItem {
        /** @name dxDiagramItem.id */
        id?: string;
    }
    /** @name dxDiagramShape */
    export interface dxDiagramShape extends dxDiagramItem {
        /** @name dxDiagramShape.text */
        text?: string;
        /** @name dxDiagramShape.type */
        type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    }
    /** @name dxDraggable.Options */
    export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
        /** @name dxDraggable.Options.clone */
        clone?: boolean;
        /** @name dxDraggable.Options.dragTemplate */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDraggable.Options.onDragEnd */
        onDragEnd?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /** @name dxDraggable.Options.onDragMove */
        onDragMove?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /** @name dxDraggable.Options.onDragStart */
        onDragStart?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any);
    }
    /** @name dxDraggable */
    export class dxDraggable extends DraggableBase {
        constructor(element: Element, options?: dxDraggableOptions)
        constructor(element: JQuery, options?: dxDraggableOptions)
    }
    /** @name dxDrawer.Options */
    export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
        /** @name dxDrawer.Options.animationDuration */
        animationDuration?: number;
        /** @name dxDrawer.Options.animationEnabled */
        animationEnabled?: boolean;
        /** @name dxDrawer.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** @name dxDrawer.Options.maxSize */
        maxSize?: number;
        /** @name dxDrawer.Options.minSize */
        minSize?: number;
        /** @name dxDrawer.Options.opened */
        opened?: boolean;
        /** @name dxDrawer.Options.openedStateMode */
        openedStateMode?: 'overlap' | 'shrink' | 'push';
        /** @name dxDrawer.Options.position */
        position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
        /** @name dxDrawer.Options.revealMode */
        revealMode?: 'slide' | 'expand';
        /** @name dxDrawer.Options.shading */
        shading?: boolean;
        /** @name dxDrawer.Options.target */
        target?: string | Element | JQuery;
        /** @name dxDrawer.Options.template */
        template?: DevExpress.core.template | ((Element: DevExpress.core.dxElement) => any);
    }
    /** @name dxDrawer */
    export class dxDrawer extends Widget {
        constructor(element: Element, options?: dxDrawerOptions)
        constructor(element: JQuery, options?: dxDrawerOptions)
        /** @name dxDrawer.content() */
        content(): DevExpress.core.dxElement;
        /** @name dxDrawer.hide() */
        hide(): Promise<void> & JQueryPromise<void>;
        /** @name dxDrawer.show() */
        show(): Promise<void> & JQueryPromise<void>;
        /** @name dxDrawer.toggle() */
        toggle(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxDropDownBox.Options */
    export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
        /** @name dxDropDownBox.Options.acceptCustomValue */
        acceptCustomValue?: boolean;
        /** @name dxDropDownBox.Options.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownBox.Options.displayValueFormatter */
        displayValueFormatter?: ((value: string | Array<any>) => string);
        /** @name dxDropDownBox.Options.dropDownOptions */
        dropDownOptions?: dxPopupOptions;
        /** @name dxDropDownBox.Options.fieldTemplate */
        fieldTemplate?: DevExpress.core.template | ((value: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownBox.Options.openOnFieldClick */
        openOnFieldClick?: boolean;
        /** @name dxDropDownBox.Options.valueChangeEvent */
        valueChangeEvent?: string;
    }
    /** @name dxDropDownBox */
    export class dxDropDownBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownBoxOptions)
        constructor(element: JQuery, options?: dxDropDownBoxOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name dxDropDownButton.Options */
    export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
        /** @name dxDropDownButton.Options.dataSource */
        dataSource?: string | Array<CollectionWidgetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name dxDropDownButton.Options.deferRendering */
        deferRendering?: boolean;
        /** @name dxDropDownButton.Options.displayExpr */
        displayExpr?: string | ((itemData: any) => string);
        /** @name dxDropDownButton.Options.dropDownContentTemplate */
        dropDownContentTemplate?: DevExpress.core.template | ((data: Array<string | number | any> | DevExpress.data.DataSource, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownButton.Options.dropDownOptions */
        dropDownOptions?: dxPopupOptions;
        /** @name dxDropDownButton.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxDropDownButton.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxDropDownButton.Options.icon */
        icon?: string;
        /** @name dxDropDownButton.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownButton.Options.items */
        items?: Array<dxDropDownButtonItem | any>;
        /** @name dxDropDownButton.Options.keyExpr */
        keyExpr?: string;
        /** @name dxDropDownButton.Options.noDataText */
        noDataText?: string;
        /** @name dxDropDownButton.Options.onButtonClick */
        onButtonClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: event, selectedItem?: any }) => any) | string;
        /** @name dxDropDownButton.Options.onItemClick */
        onItemClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any) | string;
        /** @name dxDropDownButton.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, item?: any, previousItem?: any }) => any) | string;
        /** @name dxDropDownButton.Options.opened */
        opened?: boolean;
        /** @name dxDropDownButton.Options.selectedItem */
        selectedItem?: string | number | any;
        /** @name dxDropDownButton.Options.selectedItemKey */
        selectedItemKey?: string | number;
        /** @name dxDropDownButton.Options.showArrowIcon */
        showArrowIcon?: boolean;
        /** @name dxDropDownButton.Options.splitButton */
        splitButton?: boolean;
        /** @name dxDropDownButton.Options.stylingMode */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /** @name dxDropDownButton.Options.text */
        text?: string;
        /** @name dxDropDownButton.Options.useSelectMode */
        useSelectMode?: boolean;
        /** @name dxDropDownButton.Options.wrapItemText */
        wrapItemText?: boolean;
    }
    /** @name dxDropDownButton */
    export class dxDropDownButton extends Widget {
        constructor(element: Element, options?: dxDropDownButtonOptions)
        constructor(element: JQuery, options?: dxDropDownButtonOptions)
        /** @name dxDropDownButton.close() */
        close(): Promise<void> & JQueryPromise<void>;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxDropDownButton.open() */
        open(): Promise<void> & JQueryPromise<void>;
        /** @name dxDropDownButton.toggle() */
        toggle(): Promise<void> & JQueryPromise<void>;
        /** @name dxDropDownButton.toggle(visibility) */
        toggle(visibility: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxDropDownButtonItem */
    export interface dxDropDownButtonItem extends dxListItem {
    }
    /** @name dxDropDownEditor.Options */
    export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
        /** @name dxDropDownEditor.Options.acceptCustomValue */
        acceptCustomValue?: boolean;
        /** @name dxDropDownEditor.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxDropDownEditor.Options.applyValueMode */
        applyValueMode?: 'instantly' | 'useButtons';
        /** @name dxDropDownEditor.Options.buttons */
        buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
        /** @name dxDropDownEditor.Options.deferRendering */
        deferRendering?: boolean;
        /** @name dxDropDownEditor.Options.dropDownButtonTemplate */
        dropDownButtonTemplate?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownEditor.Options.onClosed */
        onClosed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxDropDownEditor.Options.onOpened */
        onOpened?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxDropDownEditor.Options.openOnFieldClick */
        openOnFieldClick?: boolean;
        /** @name dxDropDownEditor.Options.opened */
        opened?: boolean;
        /** @name dxDropDownEditor.Options.showDropDownButton */
        showDropDownButton?: boolean;
        /** @name dxDropDownEditor.Options.value */
        value?: any;
    }
    /** @name dxDropDownEditor */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: Element, options?: dxDropDownEditorOptions)
        constructor(element: JQuery, options?: dxDropDownEditorOptions)
        /** @name dxDropDownEditor.close() */
        close(): void;
        /** @name dxDropDownEditor.content() */
        content(): DevExpress.core.dxElement;
        /** @name dxDropDownEditor.field() */
        field(): DevExpress.core.dxElement;
        /** @name dxDropDownEditor.open() */
        open(): void;
    }
    /** @name dxDropDownList.Options */
    export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
        /** @name dxDropDownList.Options.displayValue */
        displayValue?: string;
        /** @name dxDropDownList.Options.groupTemplate */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownList.Options.grouped */
        grouped?: boolean;
        /** @name dxDropDownList.Options.minSearchLength */
        minSearchLength?: number;
        /** @name dxDropDownList.Options.noDataText */
        noDataText?: string;
        /** @name dxDropDownList.Options.onItemClick */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: any, itemIndex?: number | any, event?: event }) => any);
        /** @name dxDropDownList.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, selectedItem?: any }) => any);
        /** @name dxDropDownList.Options.onValueChanged */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxDropDownList.Options.searchEnabled */
        searchEnabled?: boolean;
        /** @name dxDropDownList.Options.searchExpr */
        searchExpr?: string | Function | Array<string | Function>;
        /** @name dxDropDownList.Options.searchMode */
        searchMode?: 'contains' | 'startswith';
        /** @name dxDropDownList.Options.searchTimeout */
        searchTimeout?: number;
        /** @name dxDropDownList.Options.selectedItem */
        selectedItem?: any;
        /** @name dxDropDownList.Options.showDataBeforeSearch */
        showDataBeforeSearch?: boolean;
        /** @name dxDropDownList.Options.value */
        value?: any;
        /** @name dxDropDownList.Options.valueChangeEvent */
        valueChangeEvent?: string;
        /** @name dxDropDownList.Options.wrapItemText */
        wrapItemText?: boolean;
    }
    /** @name dxDropDownList */
    export class dxDropDownList extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownListOptions)
        constructor(element: JQuery, options?: dxDropDownListOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name dxDropDownMenu.Options */
    export interface dxDropDownMenuOptions extends WidgetOptions<dxDropDownMenu> {
        /** @name dxDropDownMenu.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxDropDownMenu.Options.buttonIcon */
        buttonIcon?: string;
        /** @name dxDropDownMenu.Options.buttonText */
        buttonText?: string;
        /** @name dxDropDownMenu.Options.dataSource */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name dxDropDownMenu.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxDropDownMenu.Options.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxDropDownMenu.Options.items */
        items?: Array<any>;
        /** @name dxDropDownMenu.Options.onButtonClick */
        onButtonClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxDropDownMenu.Options.onItemClick */
        onItemClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: event }) => any) | string;
        /** @name dxDropDownMenu.Options.opened */
        opened?: boolean;
        /** @name dxDropDownMenu.Options.popupHeight */
        popupHeight?: number | string | Function;
        /** @name dxDropDownMenu.Options.popupWidth */
        popupWidth?: number | string | Function;
        /** @name dxDropDownMenu.Options.usePopover */
        usePopover?: boolean;
    }
    /** @name dxDropDownMenu */
    export class dxDropDownMenu extends Widget {
        constructor(element: Element, options?: dxDropDownMenuOptions)
        constructor(element: JQuery, options?: dxDropDownMenuOptions)
        /** @name dxDropDownMenu.close() */
        close(): void;
        /** @name dxDropDownMenu.open() */
        open(): void;
    }
    /** @name dxFileManager.Options */
    export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
        /** @name dxFileManager.Options.allowedFileExtensions */
        allowedFileExtensions?: Array<string>;
        /** @name dxFileManager.Options.contextMenu */
        contextMenu?: dxFileManagerContextMenu;
        /** @name dxFileManager.Options.currentPath */
        currentPath?: string;
        /** @name dxFileManager.Options.customizeDetailColumns */
        customizeDetailColumns?: ((columns: Array<dxDataGridColumn>) => Array<dxDataGridColumn>);
        /** @name dxFileManager.Options.customizeThumbnail */
        customizeThumbnail?: ((fileItem: any) => string);
        /** @name dxFileManager.Options.fileProvider */
        fileProvider?: any;
        /** @name dxFileManager.Options.itemView */
        itemView?: { mode?: 'details' | 'thumbnails', showFolders?: boolean, showParentFolder?: boolean };
        /** @name dxFileManager.Options.onCurrentDirectoryChanged */
        onCurrentDirectoryChanged?: ((e: any) => any);
        /** @name dxFileManager.Options.onSelectedFileOpened */
        onSelectedFileOpened?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, fileItem?: any }) => any);
        /** @name dxFileManager.Options.permissions */
        permissions?: { copy?: boolean, create?: boolean, download?: boolean, move?: boolean, remove?: boolean, rename?: boolean, upload?: boolean };
        /** @name dxFileManager.Options.rootFolderName */
        rootFolderName?: string;
        /** @name dxFileManager.Options.selectionMode */
        selectionMode?: 'multiple' | 'single';
        /** @name dxFileManager.Options.toolbar */
        toolbar?: dxFileManagerToolbar;
        /** @name dxFileManager.Options.upload */
        upload?: { maxFileSize?: number };
    }
    /** @name dxFileManager */
    export class dxFileManager extends Widget {
        constructor(element: Element, options?: dxFileManagerOptions)
        constructor(element: JQuery, options?: dxFileManagerOptions)
        /** @name dxFileManager.getCurrentDirectory() */
        getCurrentDirectory(): any;
        /** @name dxFileManager.getSelectedItems() */
        getSelectedItems(): Array<any>;
        /** @name dxFileManager.refresh() */
        refresh(): Promise<any> & JQueryPromise<any>;
    }
    /** @name dxFileManagerContextMenu */
    export interface dxFileManagerContextMenu {
        /** @name dxFileManagerContextMenu.items */
        items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
    }
    /** @name dxFileManagerContextMenuItem */
    export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
        /** @name dxFileManagerContextMenuItem.name */
        name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
        /** @name dxFileManagerContextMenuItem.visible */
        visible?: boolean;
    }
    /** @name dxFileManagerToolbar */
    export interface dxFileManagerToolbar {
        /** @name dxFileManagerToolbar.fileSelectionItems */
        fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'viewSwitcher' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clear' | 'separator'>;
        /** @name dxFileManagerToolbar.items */
        items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'viewSwitcher' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clear' | 'separator'>;
    }
    /** @name dxFileManagerToolbarItem */
    export interface dxFileManagerToolbarItem extends dxToolbarItem {
        /** @name dxFileManagerToolbarItem.location */
        location?: 'after' | 'before' | 'center';
        /** @name dxFileManagerToolbarItem.name */
        name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'viewSwitcher' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clear' | 'separator' | string;
        /** @name dxFileManagerToolbarItem.visible */
        visible?: boolean;
    }
    /** @name dxFileUploader.Options */
    export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
        /** @name dxFileUploader.Options.abortUpload */
        abortUpload?: ((file: File, uploadInfo: { bytesUploaded?: number, chunkCount?: number, customData?: any, chunkBlob?: Blob, chunkIndex?: number }) => Promise<any> | JQueryPromise<any> | any);
        /** @name dxFileUploader.Options.accept */
        accept?: string;
        /** @name dxFileUploader.Options.allowCanceling */
        allowCanceling?: boolean;
        /** @name dxFileUploader.Options.allowedFileExtensions */
        allowedFileExtensions?: Array<string>;
        /** @name dxFileUploader.Options.chunkSize */
        chunkSize?: number;
        /** @name dxFileUploader.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxFileUploader.Options.invalidFileExtensionMessage */
        invalidFileExtensionMessage?: string;
        /** @name dxFileUploader.Options.invalidMaxFileSizeMessage */
        invalidMaxFileSizeMessage?: string;
        /** @name dxFileUploader.Options.invalidMinFileSizeMessage */
        invalidMinFileSizeMessage?: string;
        /** @name dxFileUploader.Options.labelText */
        labelText?: string;
        /** @name dxFileUploader.Options.maxFileSize */
        maxFileSize?: number;
        /** @name dxFileUploader.Options.minFileSize */
        minFileSize?: number;
        /** @name dxFileUploader.Options.multiple */
        multiple?: boolean;
        /** @name dxFileUploader.Options.name */
        name?: string;
        /** @name dxFileUploader.Options.onProgress */
        onProgress?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** @name dxFileUploader.Options.onUploadAborted */
        onUploadAborted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** @name dxFileUploader.Options.onUploadError */
        onUploadError?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest, error?: any }) => any);
        /** @name dxFileUploader.Options.onUploadStarted */
        onUploadStarted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** @name dxFileUploader.Options.onUploaded */
        onUploaded?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** @name dxFileUploader.Options.onValueChanged */
        onValueChanged?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxFileUploader.Options.progress */
        progress?: number;
        /** @name dxFileUploader.Options.readyToUploadMessage */
        readyToUploadMessage?: string;
        /** @name dxFileUploader.Options.selectButtonText */
        selectButtonText?: string;
        /** @name dxFileUploader.Options.showFileList */
        showFileList?: boolean;
        /** @name dxFileUploader.Options.uploadButtonText */
        uploadButtonText?: string;
        /** @name dxFileUploader.Options.uploadChunk */
        uploadChunk?: ((file: File, uploadInfo: { bytesUploaded?: number, chunkCount?: number, customData?: any, chunkBlob?: Blob, chunkIndex?: number }) => Promise<any> | JQueryPromise<any> | any);
        /** @name dxFileUploader.Options.uploadFailedMessage */
        uploadFailedMessage?: string;
        /** @name dxFileUploader.Options.uploadFile */
        uploadFile?: ((file: File, progressCallback: Function) => Promise<any> | JQueryPromise<any> | any);
        /** @name dxFileUploader.Options.uploadHeaders */
        uploadHeaders?: any;
        /** @name dxFileUploader.Options.uploadMethod */
        uploadMethod?: 'POST' | 'PUT';
        /** @name dxFileUploader.Options.uploadMode */
        uploadMode?: 'instantly' | 'useButtons' | 'useForm';
        /** @name dxFileUploader.Options.uploadUrl */
        uploadUrl?: string;
        /** @name dxFileUploader.Options.uploadedMessage */
        uploadedMessage?: string;
        /** @name dxFileUploader.Options.value */
        value?: Array<File>;
    }
    /** @name dxFileUploader */
    export class dxFileUploader extends Editor {
        constructor(element: Element, options?: dxFileUploaderOptions)
        constructor(element: JQuery, options?: dxFileUploaderOptions)
    }
    /** @name dxFilterBuilder.Options */
    export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
        /** @name dxFilterBuilder.Options.allowHierarchicalFields */
        allowHierarchicalFields?: boolean;
        /** @name dxFilterBuilder.Options.customOperations */
        customOperations?: Array<dxFilterBuilderCustomOperation>;
        /** @name dxFilterBuilder.Options.fields */
        fields?: Array<dxFilterBuilderField>;
        /** @name dxFilterBuilder.Options.filterOperationDescriptions */
        filterOperationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string };
        /** @name dxFilterBuilder.Options.groupOperationDescriptions */
        groupOperationDescriptions?: { and?: string, notAnd?: string, notOr?: string, or?: string };
        /** @name dxFilterBuilder.Options.groupOperations */
        groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
        /** @name dxFilterBuilder.Options.maxGroupLevel */
        maxGroupLevel?: number;
        /** @name dxFilterBuilder.Options.onEditorPrepared */
        onEditorPrepared?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, editorElement?: DevExpress.core.dxElement, editorName?: string, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /** @name dxFilterBuilder.Options.onEditorPreparing */
        onEditorPreparing?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, cancel?: boolean, editorElement?: DevExpress.core.dxElement, editorName?: string, editorOptions?: any, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /** @name dxFilterBuilder.Options.onValueChanged */
        onValueChanged?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any }) => any);
        /** @name dxFilterBuilder.Options.value */
        value?: string | Array<any> | Function;
    }
    /** @name dxFilterBuilder */
    export class dxFilterBuilder extends Widget {
        constructor(element: Element, options?: dxFilterBuilderOptions)
        constructor(element: JQuery, options?: dxFilterBuilderOptions)
        /** @name dxFilterBuilder.getFilterExpression() */
        getFilterExpression(): string | Array<any> | Function;
    }
    /** @name dxFilterBuilderCustomOperation */
    export interface dxFilterBuilderCustomOperation {
        /** @name dxFilterBuilderCustomOperation.calculateFilterExpression */
        calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
        /** @name dxFilterBuilderCustomOperation.caption */
        caption?: string;
        /** @name dxFilterBuilderCustomOperation.customizeText */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string, field?: dxFilterBuilderField }) => string);
        /** @name dxFilterBuilderCustomOperation.dataTypes */
        dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
        /** @name dxFilterBuilderCustomOperation.editorTemplate */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxFilterBuilderCustomOperation.hasValue */
        hasValue?: boolean;
        /** @name dxFilterBuilderCustomOperation.icon */
        icon?: string;
        /** @name dxFilterBuilderCustomOperation.name */
        name?: string;
    }
    /** @name dxFilterBuilderField */
    export interface dxFilterBuilderField {
        /** @name dxFilterBuilderField.calculateFilterExpression */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
        /** @name dxFilterBuilderField.caption */
        caption?: string;
        /** @name dxFilterBuilderField.customizeText */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string }) => string);
        /** @name dxFilterBuilderField.dataField */
        dataField?: string;
        /** @name dxFilterBuilderField.dataType */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /** @name dxFilterBuilderField.editorOptions */
        editorOptions?: any;
        /** @name dxFilterBuilderField.editorTemplate */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxFilterBuilderField.falseText */
        falseText?: string;
        /** @name dxFilterBuilderField.filterOperations */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
        /** @name dxFilterBuilderField.format */
        format?: format;
        /** @name dxFilterBuilderField.lookup */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store, displayExpr?: string | ((data: any) => string), valueExpr?: string | ((data: any) => string | number | boolean) };
        /** @name dxFilterBuilderField.name */
        name?: string;
        /** @name dxFilterBuilderField.trueText */
        trueText?: string;
    }
    /** @name dxForm.Options */
    export interface dxFormOptions extends WidgetOptions<dxForm> {
        /** @name dxForm.Options.alignItemLabels */
        alignItemLabels?: boolean;
        /** @name dxForm.Options.alignItemLabelsInAllGroups */
        alignItemLabelsInAllGroups?: boolean;
        /** @name dxForm.Options.colCount */
        colCount?: number | 'auto';
        /** @name dxForm.Options.colCountByScreen */
        colCountByScreen?: any;
        /** @name dxForm.Options.customizeItem */
        customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
        /** @name dxForm.Options.formData */
        formData?: any;
        /** @name dxForm.Options.items */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /** @name dxForm.Options.labelLocation */
        labelLocation?: 'left' | 'right' | 'top';
        /** @name dxForm.Options.minColWidth */
        minColWidth?: number;
        /** @name dxForm.Options.onEditorEnterKey */
        onEditorEnterKey?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string }) => any);
        /** @name dxForm.Options.onFieldDataChanged */
        onFieldDataChanged?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string, value?: any }) => any);
        /** @name dxForm.Options.optionalMark */
        optionalMark?: string;
        /** @name dxForm.Options.readOnly */
        readOnly?: boolean;
        /** @name dxForm.Options.requiredMark */
        requiredMark?: string;
        /** @name dxForm.Options.requiredMessage */
        requiredMessage?: string;
        /** @name dxForm.Options.screenByWidth */
        screenByWidth?: Function;
        /** @name dxForm.Options.scrollingEnabled */
        scrollingEnabled?: boolean;
        /** @name dxForm.Options.showColonAfterLabel */
        showColonAfterLabel?: boolean;
        /** @name dxForm.Options.showOptionalMark */
        showOptionalMark?: boolean;
        /** @name dxForm.Options.showRequiredMark */
        showRequiredMark?: boolean;
        /** @name dxForm.Options.showValidationSummary */
        showValidationSummary?: boolean;
        /** @name dxForm.Options.validationGroup */
        validationGroup?: string;
    }
    /** @name dxForm */
    export class dxForm extends Widget {
        constructor(element: Element, options?: dxFormOptions)
        constructor(element: JQuery, options?: dxFormOptions)
        /** @name dxForm.getButton(name) */
        getButton(name: string): dxButton | undefined;
        /** @name dxForm.getEditor(dataField) */
        getEditor(dataField: string): Editor | undefined;
        /** @name dxForm.itemOption(id) */
        itemOption(id: string): any;
        /** @name dxForm.itemOption(id, option, value) */
        itemOption(id: string, option: string, value: any): void;
        /** @name dxForm.itemOption(id, options) */
        itemOption(id: string, options: any): void;
        /** @name dxForm.resetValues() */
        resetValues(): void;
        /** @name dxForm.updateData(data) */
        updateData(data: any): void;
        /** @name dxForm.updateData(dataField, value) */
        updateData(dataField: string, value: any): void;
        /** @name dxForm.updateDimensions() */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
        /** @name dxForm.validate() */
        validate(): dxValidationGroupResult;
    }
    /** @name dxFormButtonItem */
    export interface dxFormButtonItem {
        /** @deprecated */
        /** @name dxFormButtonItem.alignment */
        alignment?: 'center' | 'left' | 'right';
        /** @name dxFormButtonItem.buttonOptions */
        buttonOptions?: dxButtonOptions;
        /** @name dxFormButtonItem.colSpan */
        colSpan?: number;
        /** @name dxFormButtonItem.cssClass */
        cssClass?: string;
        /** @name dxFormButtonItem.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxFormButtonItem.itemType */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** @name dxFormButtonItem.name */
        name?: string;
        /** @name dxFormButtonItem.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
        /** @name dxFormButtonItem.visible */
        visible?: boolean;
        /** @name dxFormButtonItem.visibleIndex */
        visibleIndex?: number;
    }
    /** @name dxFormEmptyItem */
    export interface dxFormEmptyItem {
        /** @name dxFormEmptyItem.colSpan */
        colSpan?: number;
        /** @name dxFormEmptyItem.cssClass */
        cssClass?: string;
        /** @name dxFormEmptyItem.itemType */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** @name dxFormEmptyItem.name */
        name?: string;
        /** @name dxFormEmptyItem.visible */
        visible?: boolean;
        /** @name dxFormEmptyItem.visibleIndex */
        visibleIndex?: number;
    }
    /** @name dxFormGroupItem */
    export interface dxFormGroupItem {
        /** @name dxFormGroupItem.alignItemLabels */
        alignItemLabels?: boolean;
        /** @name dxFormGroupItem.caption */
        caption?: string;
        /** @name dxFormGroupItem.colCount */
        colCount?: number;
        /** @name dxFormGroupItem.colCountByScreen */
        colCountByScreen?: any;
        /** @name dxFormGroupItem.colSpan */
        colSpan?: number;
        /** @name dxFormGroupItem.cssClass */
        cssClass?: string;
        /** @name dxFormGroupItem.itemType */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** @name dxFormGroupItem.items */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /** @name dxFormGroupItem.name */
        name?: string;
        /** @name dxFormGroupItem.template */
        template?: DevExpress.core.template | ((data: { component?: dxForm, formData?: any }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxFormGroupItem.visible */
        visible?: boolean;
        /** @name dxFormGroupItem.visibleIndex */
        visibleIndex?: number;
    }
    /** @name dxFormSimpleItem */
    export interface dxFormSimpleItem {
        /** @name dxFormSimpleItem.colSpan */
        colSpan?: number;
        /** @name dxFormSimpleItem.cssClass */
        cssClass?: string;
        /** @name dxFormSimpleItem.dataField */
        dataField?: string;
        /** @name dxFormSimpleItem.editorOptions */
        editorOptions?: any;
        /** @name dxFormSimpleItem.editorType */
        editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
        /** @name dxFormSimpleItem.helpText */
        helpText?: string;
        /** @name dxFormSimpleItem.isRequired */
        isRequired?: boolean;
        /** @name dxFormSimpleItem.itemType */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** @name dxFormSimpleItem.label */
        label?: { alignment?: 'center' | 'left' | 'right', location?: 'left' | 'right' | 'top', showColon?: boolean, text?: string, visible?: boolean };
        /** @name dxFormSimpleItem.name */
        name?: string;
        /** @name dxFormSimpleItem.template */
        template?: DevExpress.core.template | ((data: { component?: dxForm, dataField?: string, editorOptions?: any, editorType?: string, name?: string }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxFormSimpleItem.validationRules */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /** @name dxFormSimpleItem.visible */
        visible?: boolean;
        /** @name dxFormSimpleItem.visibleIndex */
        visibleIndex?: number;
    }
    /** @name dxFormTabbedItem */
    export interface dxFormTabbedItem {
        /** @name dxFormTabbedItem.colSpan */
        colSpan?: number;
        /** @name dxFormTabbedItem.cssClass */
        cssClass?: string;
        /** @name dxFormTabbedItem.itemType */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** @name dxFormTabbedItem.name */
        name?: string;
        /** @name dxFormTabbedItem.tabPanelOptions */
        tabPanelOptions?: dxTabPanelOptions;
        /** @name dxFormTabbedItem.tabs */
        tabs?: Array<{ alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: any, disabled?: boolean, icon?: string, items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>, tabTemplate?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), template?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), title?: string }>;
        /** @name dxFormTabbedItem.visible */
        visible?: boolean;
        /** @name dxFormTabbedItem.visibleIndex */
        visibleIndex?: number;
    }
    /** @name dxGallery.Options */
    export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
        /** @name dxGallery.Options.animationDuration */
        animationDuration?: number;
        /** @name dxGallery.Options.animationEnabled */
        animationEnabled?: boolean;
        /** @name dxGallery.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxGallery.Options.indicatorEnabled */
        indicatorEnabled?: boolean;
        /** @name dxGallery.Options.initialItemWidth */
        initialItemWidth?: number;
        /** @name dxGallery.Options.items */
        items?: Array<string | dxGalleryItem | any>;
        /** @name dxGallery.Options.loop */
        loop?: boolean;
        /** @name dxGallery.Options.noDataText */
        noDataText?: string;
        /** @name dxGallery.Options.selectedIndex */
        selectedIndex?: number;
        /** @name dxGallery.Options.showIndicator */
        showIndicator?: boolean;
        /** @name dxGallery.Options.showNavButtons */
        showNavButtons?: boolean;
        /** @name dxGallery.Options.slideshowDelay */
        slideshowDelay?: number;
        /** @name dxGallery.Options.stretchImages */
        stretchImages?: boolean;
        /** @name dxGallery.Options.swipeEnabled */
        swipeEnabled?: boolean;
        /** @name dxGallery.Options.wrapAround */
        wrapAround?: boolean;
    }
    /** @name dxGallery */
    export class dxGallery extends CollectionWidget {
        constructor(element: Element, options?: dxGalleryOptions)
        constructor(element: JQuery, options?: dxGalleryOptions)
        /** @name dxGallery.goToItem(itemIndex, animation) */
        goToItem(itemIndex: number, animation: boolean): Promise<void> & JQueryPromise<void>;
        /** @name dxGallery.nextItem(animation) */
        nextItem(animation: boolean): Promise<void> & JQueryPromise<void>;
        /** @name dxGallery.prevItem(animation) */
        prevItem(animation: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxGalleryItem */
    export interface dxGalleryItem extends CollectionWidgetItem {
        /** @name dxGalleryItem.imageAlt */
        imageAlt?: string;
        /** @name dxGalleryItem.imageSrc */
        imageSrc?: string;
    }
    /** @name dxGantt.Options */
    export interface dxGanttOptions extends WidgetOptions<dxGantt> {
        /** @name dxGantt.Options.allowSelection */
        allowSelection?: boolean;
        /** @name dxGantt.Options.columns */
        columns?: Array<dxTreeListColumn | string>;
        /** @name dxGantt.Options.dependencies */
        dependencies?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, predecessorIdExpr?: string | Function, successorIdExpr?: string | Function, typeExpr?: string | Function };
        /** @name dxGantt.Options.editing */
        editing?: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowDependencyUpdating?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskUpdating?: boolean, enabled?: boolean };
        /** @name dxGantt.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, selectedRowKey?: any }) => any);
        /** @name dxGantt.Options.resourceAssignments */
        resourceAssignments?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, resourceIdExpr?: string | Function, taskIdExpr?: string | Function };
        /** @name dxGantt.Options.resources */
        resources?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, textExpr?: string | Function };
        /** @name dxGantt.Options.scaleType */
        scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        /** @name dxGantt.Options.selectedRowKey */
        selectedRowKey?: any;
        /** @name dxGantt.Options.showResources */
        showResources?: boolean;
        /** @name dxGantt.Options.showRowLines */
        showRowLines?: boolean;
        /** @name dxGantt.Options.taskListWidth */
        taskListWidth?: number;
        /** @name dxGantt.Options.taskTitlePosition */
        taskTitlePosition?: 'inside' | 'outside' | 'none';
        /** @name dxGantt.Options.tasks */
        tasks?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, endExpr?: string | Function, keyExpr?: string | Function, parentIdExpr?: string | Function, progressExpr?: string | Function, startExpr?: string | Function, titleExpr?: string | Function };
    }
    /** @name dxGantt */
    export class dxGantt extends Widget {
        constructor(element: Element, options?: dxGanttOptions)
        constructor(element: JQuery, options?: dxGanttOptions)
    }
    /** @name dxHtmlEditor.Options */
    export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
        /** @name dxHtmlEditor.Options.customizeModules */
        customizeModules?: ((config: any) => any);
        /** @name dxHtmlEditor.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxHtmlEditor.Options.mediaResizing */
        mediaResizing?: dxHtmlEditorMediaResizing;
        /** @name dxHtmlEditor.Options.mentions */
        mentions?: Array<dxHtmlEditorMention>;
        /** @name dxHtmlEditor.Options.name */
        name?: string;
        /** @name dxHtmlEditor.Options.onFocusIn */
        onFocusIn?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: event }) => any);
        /** @name dxHtmlEditor.Options.onFocusOut */
        onFocusOut?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: event }) => any);
        /** @name dxHtmlEditor.Options.placeholder */
        placeholder?: string;
        /** @name dxHtmlEditor.Options.toolbar */
        toolbar?: dxHtmlEditorToolbar;
        /** @name dxHtmlEditor.Options.valueType */
        valueType?: 'html' | 'markdown';
        /** @name dxHtmlEditor.Options.variables */
        variables?: dxHtmlEditorVariables;
    }
    /** @name dxHtmlEditor */
    export class dxHtmlEditor extends Editor {
        constructor(element: Element, options?: dxHtmlEditorOptions)
        constructor(element: JQuery, options?: dxHtmlEditorOptions)
        /** @name dxHtmlEditor.clearHistory() */
        clearHistory(): void;
        /** @name dxHtmlEditor.delete(index, length) */
        delete(index: number, length: number): void;
        /** @name dxHtmlEditor.format(formatName, formatValue) */
        format(formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /** @name dxHtmlEditor.formatLine(index, length, formatName, formatValue) */
        formatLine(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /** @name dxHtmlEditor.formatLine(index, length, formats) */
        formatLine(index: number, length: number, formats: any): void;
        /** @name dxHtmlEditor.formatText(index, length, formatName, formatValue) */
        formatText(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /** @name dxHtmlEditor.formatText(index, length, formats) */
        formatText(index: number, length: number, formats: any): void;
        /** @name dxHtmlEditor.get(componentPath) */
        get(componentPath: string): any;
        /** @name dxHtmlEditor.getFormat(index, length) */
        getFormat(index: number, length: number): any;
        /** @name DOMComponent.getInstance(element) */
        static getInstance(element: Element | JQuery): DOMComponent;
        /** @name dxHtmlEditor.getLength() */
        getLength(): number;
        /** @name dxHtmlEditor.getQuillInstance() */
        getQuillInstance(): any;
        /** @name dxHtmlEditor.getSelection() */
        getSelection(): any;
        /** @name dxHtmlEditor.insertEmbed(index, type, config) */
        insertEmbed(index: number, type: string, config: any): void;
        /** @name dxHtmlEditor.insertText(index, text, formats) */
        insertText(index: number, text: string, formats: any): void;
        /** @name dxHtmlEditor.redo() */
        redo(): void;
        /** @name dxHtmlEditor.register(components) */
        register(modules: any): void;
        /** @name Widget.registerKeyHandler(key, handler) */
        registerKeyHandler(key: string, handler: Function): void;
        /** @name dxHtmlEditor.removeFormat(index, length) */
        removeFormat(index: number, length: number): void;
        /** @name dxHtmlEditor.setSelection(index, length) */
        setSelection(index: number, length: number): void;
        /** @name dxHtmlEditor.undo() */
        undo(): void;
    }
    /** @name dxHtmlEditorMediaResizing */
    export interface dxHtmlEditorMediaResizing {
        /** @name dxHtmlEditorMediaResizing.allowedTargets */
        allowedTargets?: Array<string>;
        /** @name dxHtmlEditorMediaResizing.enabled */
        enabled?: boolean;
    }
    /** @name dxHtmlEditorMention */
    export interface dxHtmlEditorMention {
        /** @name dxHtmlEditorMention.dataSource */
        dataSource?: Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name dxHtmlEditorMention.displayExpr */
        displayExpr?: string | ((item: any) => string);
        /** @name dxHtmlEditorMention.itemTemplate */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxHtmlEditorMention.marker */
        marker?: string;
        /** @name dxHtmlEditorMention.minSearchLength */
        minSearchLength?: number;
        /** @name dxHtmlEditorMention.searchExpr */
        searchExpr?: string | Function | Array<string | Function>;
        /** @name dxHtmlEditorMention.searchTimeout */
        searchTimeout?: number;
        /** @name dxHtmlEditorMention.template */
        template?: DevExpress.core.template | ((mentionData: { marker?: string, id?: string | number, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxHtmlEditorMention.valueExpr */
        valueExpr?: string | Function;
    }
    /** @name dxHtmlEditorToolbar */
    export interface dxHtmlEditorToolbar {
        /** @name dxHtmlEditorToolbar.container */
        container?: string | Element | JQuery;
        /** @name dxHtmlEditorToolbar.items */
        items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear'>;
    }
    /** @name dxHtmlEditorToolbarItem */
    export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
        /** @name dxHtmlEditorToolbarItem.formatName */
        formatName?: 'background' | 'bold' | 'color' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | string;
        /** @name dxHtmlEditorToolbarItem.formatValues */
        formatValues?: Array<string | number | boolean>;
        /** @name dxHtmlEditorToolbarItem.location */
        location?: 'after' | 'before' | 'center';
    }
    /** @name dxHtmlEditorVariables */
    export interface dxHtmlEditorVariables {
        /** @name dxHtmlEditorVariables.dataSource */
        dataSource?: string | Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name dxHtmlEditorVariables.escapeChar */
        escapeChar?: string | Array<string>;
    }
    /** @name dxItem */
    export var dxItem: any;
    /** @name dxList.Options */
    export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
        /** @name dxList.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxList.Options.allowItemDeleting */
        allowItemDeleting?: boolean;
        /** @deprecated */
        /** @name dxList.Options.allowItemReordering */
        allowItemReordering?: boolean;
        /** @name dxList.Options.bounceEnabled */
        bounceEnabled?: boolean;
        /** @name dxList.Options.collapsibleGroups */
        collapsibleGroups?: boolean;
        /** @name dxList.Options.displayExpr */
        displayExpr?: string | ((item: any) => string);
        /** @name dxList.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxList.Options.groupTemplate */
        groupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxList.Options.grouped */
        grouped?: boolean;
        /** @name dxList.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxList.Options.indicateLoading */
        indicateLoading?: boolean;
        /** @name dxList.Options.itemDeleteMode */
        itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
        /** @name dxList.Options.itemDragging */
        itemDragging?: dxSortableOptions;
        /** @name dxList.Options.items */
        items?: Array<string | dxListItem | any>;
        /** @name dxList.Options.menuItems */
        menuItems?: Array<{ action?: ((itemElement: DevExpress.core.dxElement, itemData: any) => any), text?: string }>;
        /** @name dxList.Options.menuMode */
        menuMode?: 'context' | 'slide';
        /** @name dxList.Options.nextButtonText */
        nextButtonText?: string;
        /** @name dxList.Options.onGroupRendered */
        onGroupRendered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, groupData?: any, groupElement?: DevExpress.core.dxElement, groupIndex?: number }) => any);
        /** @name dxList.Options.onItemClick */
        onItemClick?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxList.Options.onItemContextMenu */
        onItemContextMenu?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxList.Options.onItemDeleted */
        onItemDeleted?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any }) => any);
        /** @name dxList.Options.onItemDeleting */
        onItemDeleting?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** @name dxList.Options.onItemHold */
        onItemHold?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxList.Options.onItemReordered */
        onItemReordered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number }) => any);
        /** @name dxList.Options.onItemSwipe */
        onItemSwipe?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, direction?: string }) => any);
        /** @name dxList.Options.onPageLoading */
        onPageLoading?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxList.Options.onPullRefresh */
        onPullRefresh?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxList.Options.onScroll */
        onScroll?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** @name dxList.Options.onSelectAllValueChanged */
        onSelectAllValueChanged?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** @name dxList.Options.pageLoadMode */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /** @name dxList.Options.pageLoadingText */
        pageLoadingText?: string;
        /** @name dxList.Options.pullRefreshEnabled */
        pullRefreshEnabled?: boolean;
        /** @name dxList.Options.pulledDownText */
        pulledDownText?: string;
        /** @name dxList.Options.pullingDownText */
        pullingDownText?: string;
        /** @name dxList.Options.refreshingText */
        refreshingText?: string;
        /** @name dxList.Options.repaintChangesOnly */
        repaintChangesOnly?: boolean;
        /** @name dxList.Options.scrollByContent */
        scrollByContent?: boolean;
        /** @name dxList.Options.scrollByThumb */
        scrollByThumb?: boolean;
        /** @name dxList.Options.scrollingEnabled */
        scrollingEnabled?: boolean;
        /** @name dxList.Options.selectAllMode */
        selectAllMode?: 'allPages' | 'page';
        /** @name dxList.Options.selectionMode */
        selectionMode?: 'all' | 'multiple' | 'none' | 'single';
        /** @name dxList.Options.showScrollbar */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /** @name dxList.Options.showSelectionControls */
        showSelectionControls?: boolean;
        /** @name dxList.Options.useNativeScrolling */
        useNativeScrolling?: boolean;
    }
    /** @name dxList */
    export class dxList extends CollectionWidget {
        constructor(element: Element, options?: dxListOptions)
        constructor(element: JQuery, options?: dxListOptions)
        /** @name dxList.clientHeight() */
        clientHeight(): number;
        /** @name dxList.collapseGroup(groupIndex) */
        collapseGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /** @name dxList.deleteItem(itemElement) */
        deleteItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /** @name dxList.deleteItem(itemIndex) */
        deleteItem(itemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /** @name dxList.expandGroup(groupIndex) */
        expandGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /** @name dxList.isItemSelected(itemElement) */
        isItemSelected(itemElement: Element): boolean;
        /** @name dxList.isItemSelected(itemIndex) */
        isItemSelected(itemIndex: number | any): boolean;
        /** @name dxList.reload() */
        reload(): void;
        /** @name dxList.reorderItem(itemElement, toItemElement) */
        reorderItem(itemElement: Element, toItemElement: Element): Promise<void> & JQueryPromise<void>;
        /** @name dxList.reorderItem(itemIndex, toItemIndex) */
        reorderItem(itemIndex: number | any, toItemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /** @name dxList.scrollBy(distance) */
        scrollBy(distance: number): void;
        /** @name dxList.scrollHeight() */
        scrollHeight(): number;
        /** @name dxList.scrollTo(location) */
        scrollTo(location: number): void;
        /** @name dxList.scrollToItem(itemElement) */
        scrollToItem(itemElement: Element): void;
        /** @name dxList.scrollToItem(itemIndex) */
        scrollToItem(itemIndex: number | any): void;
        /** @name dxList.scrollTop() */
        scrollTop(): number;
        /** @name dxList.selectAll() */
        selectAll(): void;
        /** @name dxList.selectItem(itemElement) */
        selectItem(itemElement: Element): void;
        /** @name dxList.selectItem(itemIndex) */
        selectItem(itemIndex: number | any): void;
        /** @name dxList.unselectAll() */
        unselectAll(): void;
        /** @name dxList.unselectItem(itemElement) */
        unselectItem(itemElement: Element): void;
        /** @name dxList.unselectItem(itemIndex) */
        unselectItem(itemIndex: number | any): void;
        /** @name dxList.updateDimensions() */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxListItem */
    export interface dxListItem extends CollectionWidgetItem {
        /** @name dxListItem.badge */
        badge?: string;
        /** @name dxListItem.icon */
        icon?: string;
        /** @name dxListItem.key */
        key?: string;
        /** @name dxListItem.showChevron */
        showChevron?: boolean;
    }
    /** @name dxLoadIndicator.Options */
    export interface dxLoadIndicatorOptions extends WidgetOptions<dxLoadIndicator> {
        /** @name dxLoadIndicator.Options.indicatorSrc */
        indicatorSrc?: string;
    }
    /** @name dxLoadIndicator */
    export class dxLoadIndicator extends Widget {
        constructor(element: Element, options?: dxLoadIndicatorOptions)
        constructor(element: JQuery, options?: dxLoadIndicatorOptions)
    }
    /** @name dxLoadPanel.Options */
    export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
        /** @name dxLoadPanel.Options.animation */
        animation?: dxLoadPanelAnimation;
        /** @name dxLoadPanel.Options.container */
        container?: string | Element | JQuery;
        /** @name dxLoadPanel.Options.delay */
        delay?: number;
        /** @name dxLoadPanel.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxLoadPanel.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxLoadPanel.Options.indicatorSrc */
        indicatorSrc?: string;
        /** @name dxLoadPanel.Options.maxHeight */
        maxHeight?: number | string | (() => number | string);
        /** @name dxLoadPanel.Options.maxWidth */
        maxWidth?: number | string | (() => number | string);
        /** @name dxLoadPanel.Options.message */
        message?: string;
        /** @name dxLoadPanel.Options.position */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /** @name dxLoadPanel.Options.shadingColor */
        shadingColor?: string;
        /** @name dxLoadPanel.Options.showIndicator */
        showIndicator?: boolean;
        /** @name dxLoadPanel.Options.showPane */
        showPane?: boolean;
        /** @name dxLoadPanel.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxLoadPanel.Options.animation */
    export interface dxLoadPanelAnimation extends dxOverlayAnimation {
        /** @name dxLoadPanel.Options.animation.hide */
        hide?: animationConfig;
        /** @name dxLoadPanel.Options.animation.show */
        show?: animationConfig;
    }
    /** @name dxLoadPanel */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: Element, options?: dxLoadPanelOptions)
        constructor(element: JQuery, options?: dxLoadPanelOptions)
    }
    /** @name dxLookup.Options */
    export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
        /** @name dxLookup.Options.animation */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /** @name dxLookup.Options.applyButtonText */
        applyButtonText?: string;
        /** @name dxLookup.Options.applyValueMode */
        applyValueMode?: 'instantly' | 'useButtons';
        /** @name dxLookup.Options.cancelButtonText */
        cancelButtonText?: string;
        /** @name dxLookup.Options.cleanSearchOnOpening */
        cleanSearchOnOpening?: boolean;
        /** @name dxLookup.Options.clearButtonText */
        clearButtonText?: string;
        /** @name dxLookup.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | (() => boolean);
        /** @name dxLookup.Options.fieldTemplate */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxLookup.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxLookup.Options.fullScreen */
        fullScreen?: boolean;
        /** @name dxLookup.Options.groupTemplate */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxLookup.Options.grouped */
        grouped?: boolean;
        /** @name dxLookup.Options.nextButtonText */
        nextButtonText?: string;
        /** @name dxLookup.Options.onPageLoading */
        onPageLoading?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxLookup.Options.onPullRefresh */
        onPullRefresh?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxLookup.Options.onScroll */
        onScroll?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** @name dxLookup.Options.onTitleRendered */
        onTitleRendered?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /** @name dxLookup.Options.onValueChanged */
        onValueChanged?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxLookup.Options.pageLoadMode */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /** @name dxLookup.Options.pageLoadingText */
        pageLoadingText?: string;
        /** @name dxLookup.Options.placeholder */
        placeholder?: string;
        /** @name dxLookup.Options.popupHeight */
        popupHeight?: number | string | (() => number | string);
        /** @name dxLookup.Options.popupWidth */
        popupWidth?: number | string | (() => number | string);
        /** @name dxLookup.Options.position */
        position?: positionConfig;
        /** @name dxLookup.Options.pullRefreshEnabled */
        pullRefreshEnabled?: boolean;
        /** @name dxLookup.Options.pulledDownText */
        pulledDownText?: string;
        /** @name dxLookup.Options.pullingDownText */
        pullingDownText?: string;
        /** @name dxLookup.Options.refreshingText */
        refreshingText?: string;
        /** @name dxLookup.Options.searchEnabled */
        searchEnabled?: boolean;
        /** @name dxLookup.Options.searchPlaceholder */
        searchPlaceholder?: string;
        /** @name dxLookup.Options.shading */
        shading?: boolean;
        /** @name dxLookup.Options.showCancelButton */
        showCancelButton?: boolean;
        /** @name dxLookup.Options.showClearButton */
        showClearButton?: boolean;
        /** @name dxLookup.Options.showPopupTitle */
        showPopupTitle?: boolean;
        /** @name dxLookup.Options.title */
        title?: string;
        /** @name dxLookup.Options.titleTemplate */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxLookup.Options.useNativeScrolling */
        useNativeScrolling?: boolean;
        /** @name dxLookup.Options.usePopover */
        usePopover?: boolean;
    }
    /** @name dxLookup */
    export class dxLookup extends dxDropDownList {
        constructor(element: Element, options?: dxLookupOptions)
        constructor(element: JQuery, options?: dxLookupOptions)
    }
    /** @name dxMap.Options */
    export interface dxMapOptions extends WidgetOptions<dxMap> {
        /** @name dxMap.Options.autoAdjust */
        autoAdjust?: boolean;
        /** @name dxMap.Options.center */
        center?: any | string | Array<number>;
        /** @name dxMap.Options.controls */
        controls?: boolean;
        /** @name dxMap.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxMap.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxMap.Options.key */
        key?: string | { bing?: string, google?: string, googleStatic?: string };
        /** @name dxMap.Options.markerIconSrc */
        markerIconSrc?: string;
        /** @name dxMap.Options.markers */
        markers?: Array<{ iconSrc?: string, location?: any | string | Array<number>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }>;
        /** @name dxMap.Options.onClick */
        onClick?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, location?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxMap.Options.onMarkerAdded */
        onMarkerAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalMarker?: any }) => any);
        /** @name dxMap.Options.onMarkerRemoved */
        onMarkerRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /** @name dxMap.Options.onReady */
        onReady?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, originalMap?: any }) => any);
        /** @name dxMap.Options.onRouteAdded */
        onRouteAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalRoute?: any }) => any);
        /** @name dxMap.Options.onRouteRemoved */
        onRouteRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /** @name dxMap.Options.provider */
        provider?: 'bing' | 'google' | 'googleStatic';
        /** @name dxMap.Options.routes */
        routes?: Array<{ color?: string, locations?: Array<any>, mode?: 'driving' | 'walking', opacity?: number, weight?: number }>;
        /** @name dxMap.Options.type */
        type?: 'hybrid' | 'roadmap' | 'satellite';
        /** @name dxMap.Options.width */
        width?: number | string | (() => number | string);
        /** @name dxMap.Options.zoom */
        zoom?: number;
    }
    /** @name dxMap */
    export class dxMap extends Widget {
        constructor(element: Element, options?: dxMapOptions)
        constructor(element: JQuery, options?: dxMapOptions)
        /** @name dxMap.addMarker(markerOptions) */
        addMarker(markerOptions: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /** @name dxMap.addRoute(routeOptions) */
        addRoute(options: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /** @name dxMap.removeMarker(marker) */
        removeMarker(marker: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
        /** @name dxMap.removeRoute(route) */
        removeRoute(route: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxMenu.Options */
    export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
        /** @name dxMenu.Options.adaptivityEnabled */
        adaptivityEnabled?: boolean;
        /** @name dxMenu.Options.hideSubmenuOnMouseLeave */
        hideSubmenuOnMouseLeave?: boolean;
        /** @name dxMenu.Options.items */
        items?: Array<dxMenuItem>;
        /** @name dxMenu.Options.onSubmenuHidden */
        onSubmenuHidden?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** @name dxMenu.Options.onSubmenuHiding */
        onSubmenuHiding?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement, cancel?: boolean }) => any);
        /** @name dxMenu.Options.onSubmenuShowing */
        onSubmenuShowing?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** @name dxMenu.Options.onSubmenuShown */
        onSubmenuShown?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** @name dxMenu.Options.orientation */
        orientation?: 'horizontal' | 'vertical';
        /** @name dxMenu.Options.showFirstSubmenuMode */
        showFirstSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
        /** @name dxMenu.Options.submenuDirection */
        submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
    }
    /** @name dxMenu */
    export class dxMenu extends dxMenuBase {
        constructor(element: Element, options?: dxMenuOptions)
        constructor(element: JQuery, options?: dxMenuOptions)
    }
    /** @name dxMenuBase.Options */
    export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
        /** @name dxMenuBase.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxMenuBase.Options.animation */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /** @name dxMenuBase.Options.cssClass */
        cssClass?: string;
        /** @name dxMenuBase.Options.items */
        items?: Array<dxMenuBaseItem>;
        /** @name dxMenuBase.Options.selectByClick */
        selectByClick?: boolean;
        /** @name dxMenuBase.Options.selectionMode */
        selectionMode?: 'none' | 'single';
        /** @name dxMenuBase.Options.showSubmenuMode */
        showSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
    }
    /** @name dxMenuBase */
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxMenuBaseOptions)
        constructor(element: JQuery, options?: dxMenuBaseOptions)
        /** @name dxMenuBase.selectItem(itemElement) */
        selectItem(itemElement: Element): void;
        /** @name dxMenuBase.unselectItem(itemElement) */
        unselectItem(itemElement: Element): void;
    }
    /** @name dxMenuBaseItem */
    export interface dxMenuBaseItem extends CollectionWidgetItem {
        /** @name dxMenuBaseItem.beginGroup */
        beginGroup?: boolean;
        /** @name dxMenuBaseItem.closeMenuOnClick */
        closeMenuOnClick?: boolean;
        /** @name dxMenuBaseItem.disabled */
        disabled?: boolean;
        /** @name dxMenuBaseItem.icon */
        icon?: string;
        /** @name dxMenuBaseItem.items */
        items?: Array<dxMenuBaseItem>;
        /** @name dxMenuBaseItem.selectable */
        selectable?: boolean;
        /** @name dxMenuBaseItem.selected */
        selected?: boolean;
        /** @name dxMenuBaseItem.text */
        text?: string;
        /** @name dxMenuBaseItem.visible */
        visible?: boolean;
    }
    /** @name dxMenuItem */
    export interface dxMenuItem extends dxMenuBaseItem {
        /** @name dxMenuItem.items */
        items?: Array<dxMenuItem>;
    }
    /** @name dxMultiView.Options */
    export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
        /** @name dxMultiView.Options.animationEnabled */
        animationEnabled?: boolean;
        /** @name dxMultiView.Options.deferRendering */
        deferRendering?: boolean;
        /** @name dxMultiView.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxMultiView.Options.items */
        items?: Array<string | dxMultiViewItem | any>;
        /** @name dxMultiView.Options.loop */
        loop?: boolean;
        /** @name dxMultiView.Options.selectedIndex */
        selectedIndex?: number;
        /** @name dxMultiView.Options.swipeEnabled */
        swipeEnabled?: boolean;
    }
    /** @name dxMultiView */
    export class dxMultiView extends CollectionWidget {
        constructor(element: Element, options?: dxMultiViewOptions)
        constructor(element: JQuery, options?: dxMultiViewOptions)
    }
    /** @name dxMultiViewItem */
    export interface dxMultiViewItem extends CollectionWidgetItem {
    }
    /** @name dxNavBar.Options */
    export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
        /** @name dxNavBar.Options.scrollByContent */
        scrollByContent?: boolean;
    }
    /** @name dxNavBar */
    export class dxNavBar extends dxTabs {
        constructor(element: Element, options?: dxNavBarOptions)
        constructor(element: JQuery, options?: dxNavBarOptions)
    }
    /** @name dxNavBarItem */
    export interface dxNavBarItem extends dxTabsItem {
        /** @name dxNavBarItem.badge */
        badge?: string;
    }
    /** @name dxNumberBox.Options */
    export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
        /** @name dxNumberBox.Options.buttons */
        buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
        /** @name dxNumberBox.Options.format */
        format?: format;
        /** @name dxNumberBox.Options.invalidValueMessage */
        invalidValueMessage?: string;
        /** @name dxNumberBox.Options.max */
        max?: number;
        /** @name dxNumberBox.Options.min */
        min?: number;
        /** @name dxNumberBox.Options.mode */
        mode?: 'number' | 'text' | 'tel';
        /** @name dxNumberBox.Options.showSpinButtons */
        showSpinButtons?: boolean;
        /** @name dxNumberBox.Options.step */
        step?: number;
        /** @name dxNumberBox.Options.useLargeSpinButtons */
        useLargeSpinButtons?: boolean;
        /** @name dxNumberBox.Options.value */
        value?: number;
    }
    /** @name dxNumberBox */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: Element, options?: dxNumberBoxOptions)
        constructor(element: JQuery, options?: dxNumberBoxOptions)
    }
    /** @name dxOverlay.Options */
    export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
        /** @name dxOverlay.Options.animation */
        animation?: dxOverlayAnimation;
        /** @name dxOverlay.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** @name dxOverlay.Options.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxOverlay.Options.deferRendering */
        deferRendering?: boolean;
        /** @name dxOverlay.Options.dragEnabled */
        dragEnabled?: boolean;
        /** @name dxOverlay.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxOverlay.Options.maxHeight */
        maxHeight?: number | string | (() => number | string);
        /** @name dxOverlay.Options.maxWidth */
        maxWidth?: number | string | (() => number | string);
        /** @name dxOverlay.Options.minHeight */
        minHeight?: number | string | (() => number | string);
        /** @name dxOverlay.Options.minWidth */
        minWidth?: number | string | (() => number | string);
        /** @name dxOverlay.Options.onHidden */
        onHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxOverlay.Options.onHiding */
        onHiding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** @name dxOverlay.Options.onShowing */
        onShowing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxOverlay.Options.onShown */
        onShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxOverlay.Options.position */
        position?: any;
        /** @name dxOverlay.Options.shading */
        shading?: boolean;
        /** @name dxOverlay.Options.shadingColor */
        shadingColor?: string;
        /** @name dxOverlay.Options.visible */
        visible?: boolean;
        /** @name dxOverlay.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxOverlay.Options.animation */
    export interface dxOverlayAnimation {
        /** @name dxOverlay.Options.animation.hide */
        hide?: animationConfig;
        /** @name dxOverlay.Options.animation.show */
        show?: animationConfig;
    }
    /** @name dxOverlay */
    export class dxOverlay extends Widget {
        constructor(element: Element, options?: dxOverlayOptions)
        constructor(element: JQuery, options?: dxOverlayOptions)
        /** @name dxOverlay.content() */
        content(): DevExpress.core.dxElement;
        /** @name dxOverlay.hide() */
        hide(): Promise<boolean> & JQueryPromise<boolean>;
        /** @name dxOverlay.repaint() */
        repaint(): void;
        /** @name dxOverlay.show() */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /** @name dxOverlay.toggle(showing) */
        toggle(showing: boolean): Promise<boolean> & JQueryPromise<boolean>;
    }
    /** @name dxPivotGrid.Options */
    export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
        /** @name dxPivotGrid.Options.allowExpandAll */
        allowExpandAll?: boolean;
        /** @name dxPivotGrid.Options.allowFiltering */
        allowFiltering?: boolean;
        /** @name dxPivotGrid.Options.allowSorting */
        allowSorting?: boolean;
        /** @name dxPivotGrid.Options.allowSortingBySummary */
        allowSortingBySummary?: boolean;
        /** @name dxPivotGrid.Options.dataFieldArea */
        dataFieldArea?: 'column' | 'row';
        /** @name dxPivotGrid.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.PivotGridDataSource | DevExpress.data.PivotGridDataSourceOptions;
        /** @name dxPivotGrid.Options.export */
        export?: { enabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string };
        /** @name dxPivotGrid.Options.fieldChooser */
        fieldChooser?: { allowSearch?: boolean, applyChangesMode?: 'instantly' | 'onDemand', enabled?: boolean, height?: number, layout?: 0 | 1 | 2, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number };
        /** @name dxPivotGrid.Options.fieldPanel */
        fieldPanel?: { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean };
        /** @name dxPivotGrid.Options.headerFilter */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /** @name dxPivotGrid.Options.hideEmptySummaryCells */
        hideEmptySummaryCells?: boolean;
        /** @name dxPivotGrid.Options.loadPanel */
        loadPanel?: { enabled?: boolean, height?: number, indicatorSrc?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /** @name dxPivotGrid.Options.onCellClick */
        onCellClick?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any);
        /** @name dxPivotGrid.Options.onCellPrepared */
        onCellPrepared?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number }) => any);
        /** @name dxPivotGrid.Options.onContextMenuPreparing */
        onContextMenuPreparing?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, cell?: dxPivotGridPivotGridCell, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, field?: DevExpress.data.PivotGridDataSourceField }) => any);
        /** @name dxPivotGrid.Options.onExported */
        onExported?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxPivotGrid.Options.onExporting */
        onExporting?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /** @name dxPivotGrid.Options.onFileSaving */
        onFileSaving?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** @name dxPivotGrid.Options.rowHeaderLayout */
        rowHeaderLayout?: 'standard' | 'tree';
        /** @name dxPivotGrid.Options.scrolling */
        scrolling?: { mode?: 'standard' | 'virtual', useNative?: boolean | 'auto' };
        /** @name dxPivotGrid.Options.showBorders */
        showBorders?: boolean;
        /** @name dxPivotGrid.Options.showColumnGrandTotals */
        showColumnGrandTotals?: boolean;
        /** @name dxPivotGrid.Options.showColumnTotals */
        showColumnTotals?: boolean;
        /** @name dxPivotGrid.Options.showRowGrandTotals */
        showRowGrandTotals?: boolean;
        /** @name dxPivotGrid.Options.showRowTotals */
        showRowTotals?: boolean;
        /** @name dxPivotGrid.Options.showTotalsPrior */
        showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
        /** @name dxPivotGrid.Options.stateStoring */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((state: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /** @name dxPivotGrid.Options.texts */
        texts?: { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string };
        /** @name dxPivotGrid.Options.wordWrapEnabled */
        wordWrapEnabled?: boolean;
    }
    /** @name dxPivotGrid */
    export class dxPivotGrid extends Widget {
        constructor(element: Element, options?: dxPivotGridOptions)
        constructor(element: JQuery, options?: dxPivotGridOptions)
        /** @name dxPivotGrid.bindChart(chart, integrationOptions) */
        bindChart(chart: string | JQuery | any, integrationOptions: { inverted?: boolean, dataFieldsDisplayMode?: string, putDataFieldsInto?: string, alternateDataFields?: boolean, processCell?: Function, customizeChart?: Function, customizeSeries?: Function }): Function & null;
        /** @name dxPivotGrid.exportToExcel() */
        exportToExcel(): void;
        /** @name dxPivotGrid.getDataSource() */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /** @name dxPivotGrid.getFieldChooserPopup() */
        getFieldChooserPopup(): dxPopup;
        /** @name dxPivotGrid.updateDimensions() */
        updateDimensions(): void;
    }
    /** @name dxPivotGridFieldChooser.Options */
    export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
        /** @name dxPivotGridFieldChooser.Options.allowSearch */
        allowSearch?: boolean;
        /** @name dxPivotGridFieldChooser.Options.applyChangesMode */
        applyChangesMode?: 'instantly' | 'onDemand';
        /** @name dxPivotGridFieldChooser.Options.dataSource */
        dataSource?: DevExpress.data.PivotGridDataSource;
        /** @name dxPivotGridFieldChooser.Options.headerFilter */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /** @name dxPivotGridFieldChooser.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxPivotGridFieldChooser.Options.layout */
        layout?: 0 | 1 | 2;
        /** @name dxPivotGridFieldChooser.Options.onContextMenuPreparing */
        onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, field?: DevExpress.data.PivotGridDataSourceField, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxPivotGridFieldChooser.Options.searchTimeout */
        searchTimeout?: number;
        /** @name dxPivotGridFieldChooser.Options.state */
        state?: any;
        /** @name dxPivotGridFieldChooser.Options.texts */
        texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string };
    }
    /** @name dxPivotGridFieldChooser */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions)
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions)
        /** @name dxPivotGridFieldChooser.applyChanges() */
        applyChanges(): void;
        /** @name dxPivotGridFieldChooser.cancelChanges() */
        cancelChanges(): void;
        /** @name dxPivotGridFieldChooser.getDataSource() */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /** @name dxPivotGridFieldChooser.updateDimensions() */
        updateDimensions(): void;
    }
    /** @name dxPivotGridPivotGridCell */
    export interface dxPivotGridPivotGridCell {
        /** @name dxPivotGridPivotGridCell.columnPath */
        columnPath?: Array<string | number | Date>;
        /** @name dxPivotGridPivotGridCell.columnType */
        columnType?: 'D' | 'T' | 'GT';
        /** @name dxPivotGridPivotGridCell.dataIndex */
        dataIndex?: number;
        /** @name dxPivotGridPivotGridCell.expanded */
        expanded?: boolean;
        /** @name dxPivotGridPivotGridCell.path */
        path?: Array<string | number | Date>;
        /** @name dxPivotGridPivotGridCell.rowPath */
        rowPath?: Array<string | number | Date>;
        /** @name dxPivotGridPivotGridCell.rowType */
        rowType?: 'D' | 'T' | 'GT';
        /** @name dxPivotGridPivotGridCell.text */
        text?: string;
        /** @name dxPivotGridPivotGridCell.type */
        type?: 'D' | 'T' | 'GT';
        /** @name dxPivotGridPivotGridCell.value */
        value?: any;
    }
    /** @name dxPivotGridSummaryCell */
    export class dxPivotGridSummaryCell {
        /** @name dxPivotGridSummaryCell.child(direction, fieldValue) */
        child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.children(direction) */
        children(direction: string): Array<dxPivotGridSummaryCell>;
        /** @name dxPivotGridSummaryCell.field(area) */
        field(area: string): DevExpress.data.PivotGridDataSourceField;
        /** @name dxPivotGridSummaryCell.grandTotal() */
        grandTotal(): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.grandTotal(direction) */
        grandTotal(direction: string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.isPostProcessed(field) */
        isPostProcessed(field: DevExpress.data.PivotGridDataSourceField | string): boolean;
        /** @name dxPivotGridSummaryCell.next(direction) */
        next(direction: string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.next(direction, allowCrossGroup) */
        next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.parent(direction) */
        parent(direction: string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.prev(direction) */
        prev(direction: string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.prev(direction, allowCrossGroup) */
        prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.slice(field, value) */
        slice(field: DevExpress.data.PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
        /** @name dxPivotGridSummaryCell.value() */
        value(): any;
        /** @name dxPivotGridSummaryCell.value(field) */
        value(field: DevExpress.data.PivotGridDataSourceField | string): any;
        /** @name dxPivotGridSummaryCell.value(field, postProcessed) */
        value(field: DevExpress.data.PivotGridDataSourceField | string, postProcessed: boolean): any;
        /** @name dxPivotGridSummaryCell.value(postProcessed) */
        value(postProcessed: boolean): any;
    }
    /** @name dxPopover.Options */
    export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
        /** @name dxPopover.Options.animation */
        animation?: dxPopoverAnimation;
        /** @name dxPopover.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** @name dxPopover.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxPopover.Options.hideEvent */
        hideEvent?: { delay?: number, name?: string } | string;
        /** @name dxPopover.Options.position */
        position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
        /** @name dxPopover.Options.shading */
        shading?: boolean;
        /** @name dxPopover.Options.showEvent */
        showEvent?: { delay?: number, name?: string } | string;
        /** @name dxPopover.Options.showTitle */
        showTitle?: boolean;
        /** @name dxPopover.Options.target */
        target?: string | Element | JQuery;
        /** @name dxPopover.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxPopover.Options.animation */
    export interface dxPopoverAnimation extends dxPopupAnimation {
        /** @name dxPopover.Options.animation.hide */
        hide?: animationConfig;
        /** @name dxPopover.Options.animation.show */
        show?: animationConfig;
    }
    /** @name dxPopover */
    export class dxPopover extends dxPopup {
        constructor(element: Element, options?: dxPopoverOptions)
        constructor(element: JQuery, options?: dxPopoverOptions)
        /** @name dxOverlay.show() */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /** @name dxPopover.show(target) */
        show(target: string | Element | JQuery): Promise<boolean> & JQueryPromise<boolean>;
    }
    /** @name dxPopup.Options */
    export interface dxPopupOptions<T = dxPopup> extends dxOverlayOptions<T> {
        /** @name dxPopup.Options.animation */
        animation?: dxPopupAnimation;
        /** @name dxPopup.Options.container */
        container?: string | Element | JQuery;
        /** @name dxPopup.Options.dragEnabled */
        dragEnabled?: boolean;
        /** @name dxPopup.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxPopup.Options.fullScreen */
        fullScreen?: boolean;
        /** @name dxPopup.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxPopup.Options.onResize */
        onResize?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxPopup.Options.onResizeEnd */
        onResizeEnd?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxPopup.Options.onResizeStart */
        onResizeStart?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxPopup.Options.onTitleRendered */
        onTitleRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /** @name dxPopup.Options.position */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /** @name dxPopup.Options.resizeEnabled */
        resizeEnabled?: boolean;
        /** @name dxPopup.Options.showCloseButton */
        showCloseButton?: boolean;
        /** @name dxPopup.Options.showTitle */
        showTitle?: boolean;
        /** @name dxPopup.Options.title */
        title?: string;
        /** @name dxPopup.Options.titleTemplate */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxPopup.Options.toolbarItems */
        toolbarItems?: Array<dxPopupToolbarItem>;
        /** @name dxPopup.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxPopup.Options.animation */
    export interface dxPopupAnimation extends dxOverlayAnimation {
        /** @name dxPopup.Options.animation.hide */
        hide?: animationConfig;
        /** @name dxPopup.Options.animation.show */
        show?: animationConfig;
    }
    /** @name dxPopup.Options.toolbarItems */
    export interface dxPopupToolbarItem {
        /** @name dxPopup.Options.toolbarItems.disabled */
        disabled?: boolean;
        /** @name dxPopup.Options.toolbarItems.html */
        html?: string;
        /** @name dxPopup.Options.toolbarItems.location */
        location?: 'after' | 'before' | 'center';
        /** @name dxPopup.Options.toolbarItems.options */
        options?: any;
        /** @name dxPopup.Options.toolbarItems.template */
        template?: DevExpress.core.template;
        /** @name dxPopup.Options.toolbarItems.text */
        text?: string;
        /** @name dxPopup.Options.toolbarItems.toolbar */
        toolbar?: 'bottom' | 'top';
        /** @name dxPopup.Options.toolbarItems.visible */
        visible?: boolean;
        /** @name dxPopup.Options.toolbarItems.widget */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /** @name dxPopup */
    export class dxPopup extends dxOverlay {
        constructor(element: Element, options?: dxPopupOptions)
        constructor(element: JQuery, options?: dxPopupOptions)
    }
    /** @name dxProgressBar.Options */
    export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
        /** @name dxProgressBar.Options.onComplete */
        onComplete?: ((e: { component?: dxProgressBar, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxProgressBar.Options.showStatus */
        showStatus?: boolean;
        /** @name dxProgressBar.Options.statusFormat */
        statusFormat?: string | ((ratio: number, value: number) => string);
        /** @name dxProgressBar.Options.value */
        value?: number;
    }
    /** @name dxProgressBar */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: Element, options?: dxProgressBarOptions)
        constructor(element: JQuery, options?: dxProgressBarOptions)
    }
    /** @name dxRadioGroup.Options */
    export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
        /** @name dxRadioGroup.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxRadioGroup.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxRadioGroup.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxRadioGroup.Options.layout */
        layout?: 'horizontal' | 'vertical';
        /** @name dxRadioGroup.Options.name */
        name?: string;
        /** @name dxRadioGroup.Options.value */
        value?: any;
    }
    /** @name dxRadioGroup */
    export class dxRadioGroup extends Editor {
        constructor(element: Element, options?: dxRadioGroupOptions)
        constructor(element: JQuery, options?: dxRadioGroupOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name dxRangeSlider.Options */
    export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
        /** @name dxRangeSlider.Options.end */
        end?: number;
        /** @name dxRangeSlider.Options.endName */
        endName?: string;
        /** @name dxRangeSlider.Options.onValueChanged */
        onValueChanged?: ((e: { component?: dxRangeSlider, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxRangeSlider.Options.start */
        start?: number;
        /** @name dxRangeSlider.Options.startName */
        startName?: string;
        /** @name dxRangeSlider.Options.value */
        value?: Array<number>;
    }
    /** @name dxRangeSlider */
    export class dxRangeSlider extends dxSliderBase {
        constructor(element: Element, options?: dxRangeSliderOptions)
        constructor(element: JQuery, options?: dxRangeSliderOptions)
    }
    /** @name dxRecurrenceEditor.Options */
    export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
        /** @name dxRecurrenceEditor.Options.value */
        value?: string;
    }
    /** @name dxRecurrenceEditor */
    export class dxRecurrenceEditor extends Editor {
        constructor(element: Element, options?: dxRecurrenceEditorOptions)
        constructor(element: JQuery, options?: dxRecurrenceEditorOptions)
    }
    /** @name dxResizable.Options */
    export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
        /** @name dxResizable.Options.handles */
        handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
        /** @name dxResizable.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxResizable.Options.maxHeight */
        maxHeight?: number;
        /** @name dxResizable.Options.maxWidth */
        maxWidth?: number;
        /** @name dxResizable.Options.minHeight */
        minHeight?: number;
        /** @name dxResizable.Options.minWidth */
        minWidth?: number;
        /** @name dxResizable.Options.onResize */
        onResize?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** @name dxResizable.Options.onResizeEnd */
        onResizeEnd?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** @name dxResizable.Options.onResizeStart */
        onResizeStart?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** @name dxResizable.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxResizable */
    export class dxResizable extends DOMComponent {
        constructor(element: Element, options?: dxResizableOptions)
        constructor(element: JQuery, options?: dxResizableOptions)
    }
    /** @name dxResponsiveBox.Options */
    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
        /** @name dxResponsiveBox.Options.cols */
        cols?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /** @name dxResponsiveBox.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxResponsiveBox.Options.items */
        items?: Array<string | dxResponsiveBoxItem | any>;
        /** @name dxResponsiveBox.Options.rows */
        rows?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /** @name dxResponsiveBox.Options.screenByWidth */
        screenByWidth?: Function;
        /** @name dxResponsiveBox.Options.singleColumnScreen */
        singleColumnScreen?: string;
        /** @name dxResponsiveBox.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxResponsiveBox */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: Element, options?: dxResponsiveBoxOptions)
        constructor(element: JQuery, options?: dxResponsiveBoxOptions)
    }
    /** @name dxResponsiveBoxItem */
    export interface dxResponsiveBoxItem extends CollectionWidgetItem {
        /** @name dxResponsiveBoxItem.location */
        location?: { col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
    }
    /** @name dxScheduler.Options */
    export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
        /** @name dxScheduler.Options.adaptivityEnabled */
        adaptivityEnabled?: boolean;
        /** @name dxScheduler.Options.allDayExpr */
        allDayExpr?: string;
        /** @name dxScheduler.Options.appointmentCollectorTemplate */
        appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.appointmentDragging */
        appointmentDragging?: { autoScroll?: boolean, data?: any, group?: string, onAdd?: ((e: { event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragEnd?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragMove?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragStart?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any), onRemove?: ((e: { event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any }) => any), scrollSensitivity?: number, scrollSpeed?: number };
        /** @name dxScheduler.Options.appointmentTemplate */
        appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.appointmentTooltipTemplate */
        appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.cellDuration */
        cellDuration?: number;
        /** @name dxScheduler.Options.crossScrollingEnabled */
        crossScrollingEnabled?: boolean;
        /** @name dxScheduler.Options.currentDate */
        currentDate?: Date | number | string;
        /** @name dxScheduler.Options.currentView */
        currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
        /** @name dxScheduler.Options.customizeDateNavigatorText */
        customizeDateNavigatorText?: ((info: { startDate?: Date, endDate?: Date, text?: string }) => string);
        /** @name dxScheduler.Options.dataCellTemplate */
        dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.dataSource */
        dataSource?: string | Array<dxSchedulerAppointment> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** @name dxScheduler.Options.dateCellTemplate */
        dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.dateSerializationFormat */
        dateSerializationFormat?: string;
        /** @name dxScheduler.Options.descriptionExpr */
        descriptionExpr?: string;
        /** @deprecated */
        /** @name dxScheduler.Options.dropDownAppointmentTemplate */
        dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.editing */
        editing?: boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowResizing?: boolean, allowUpdating?: boolean };
        /** @name dxScheduler.Options.endDateExpr */
        endDateExpr?: string;
        /** @name dxScheduler.Options.endDateTimeZoneExpr */
        endDateTimeZoneExpr?: string;
        /** @name dxScheduler.Options.endDayHour */
        endDayHour?: number;
        /** @name dxScheduler.Options.firstDayOfWeek */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /** @name dxScheduler.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxScheduler.Options.groupByDate */
        groupByDate?: boolean;
        /** @name dxScheduler.Options.groups */
        groups?: Array<string>;
        /** @name dxScheduler.Options.indicatorUpdateInterval */
        indicatorUpdateInterval?: number;
        /** @name dxScheduler.Options.max */
        max?: Date | number | string;
        /** @name dxScheduler.Options.maxAppointmentsPerCell */
        maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
        /** @name dxScheduler.Options.min */
        min?: Date | number | string;
        /** @name dxScheduler.Options.noDataText */
        noDataText?: string;
        /** @name dxScheduler.Options.onAppointmentAdded */
        onAppointmentAdded?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** @name dxScheduler.Options.onAppointmentAdding */
        onAppointmentAdding?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** @name dxScheduler.Options.onAppointmentClick */
        onAppointmentClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** @name dxScheduler.Options.onAppointmentContextMenu */
        onAppointmentContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxScheduler.Options.onAppointmentDblClick */
        onAppointmentDblClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** @name dxScheduler.Options.onAppointmentDeleted */
        onAppointmentDeleted?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** @name dxScheduler.Options.onAppointmentDeleting */
        onAppointmentDeleting?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** @deprecated */
        /** @name dxScheduler.Options.onAppointmentFormCreated */
        onAppointmentFormCreated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, form?: dxForm }) => any);
        /** @name dxScheduler.Options.onAppointmentFormOpening */
        onAppointmentFormOpening?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, form?: dxForm, cancel?: boolean }) => any);
        /** @name dxScheduler.Options.onAppointmentRendered */
        onAppointmentRendered?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement }) => any);
        /** @name dxScheduler.Options.onAppointmentUpdated */
        onAppointmentUpdated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** @name dxScheduler.Options.onAppointmentUpdating */
        onAppointmentUpdating?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** @name dxScheduler.Options.onCellClick */
        onCellClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** @name dxScheduler.Options.onCellContextMenu */
        onCellContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** @name dxScheduler.Options.recurrenceEditMode */
        recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
        /** @name dxScheduler.Options.recurrenceExceptionExpr */
        recurrenceExceptionExpr?: string;
        /** @name dxScheduler.Options.recurrenceRuleExpr */
        recurrenceRuleExpr?: string;
        /** @name dxScheduler.Options.remoteFiltering */
        remoteFiltering?: boolean;
        /** @name dxScheduler.Options.resourceCellTemplate */
        resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.resources */
        resources?: Array<{ allowMultiple?: boolean, colorExpr?: string, dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, displayExpr?: string | ((resource: any) => string), fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: string | Function }>;
        /** @name dxScheduler.Options.selectedCellData */
        selectedCellData?: Array<any>;
        /** @name dxScheduler.Options.shadeUntilCurrentTime */
        shadeUntilCurrentTime?: boolean;
        /** @name dxScheduler.Options.showAllDayPanel */
        showAllDayPanel?: boolean;
        /** @name dxScheduler.Options.showCurrentTimeIndicator */
        showCurrentTimeIndicator?: boolean;
        /** @name dxScheduler.Options.startDateExpr */
        startDateExpr?: string;
        /** @name dxScheduler.Options.startDateTimeZoneExpr */
        startDateTimeZoneExpr?: string;
        /** @name dxScheduler.Options.startDayHour */
        startDayHour?: number;
        /** @name dxScheduler.Options.textExpr */
        textExpr?: string;
        /** @name dxScheduler.Options.timeCellTemplate */
        timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxScheduler.Options.timeZone */
        timeZone?: string;
        /** @name dxScheduler.Options.useDropDownViewSwitcher */
        useDropDownViewSwitcher?: boolean;
        /** @name dxScheduler.Options.views */
        views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | { agendaDuration?: number, appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), cellDuration?: number, dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), endDayHour?: number, firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6, groupByDate?: boolean, groupOrientation?: 'horizontal' | 'vertical', groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: number | 'auto' | 'unlimited', name?: string, resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), startDate?: Date | number | string, startDayHour?: number, timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek' }>;
    }
    /** @name dxScheduler */
    export class dxScheduler extends Widget {
        constructor(element: Element, options?: dxSchedulerOptions)
        constructor(element: JQuery, options?: dxSchedulerOptions)
        /** @name dxScheduler.addAppointment(appointment) */
        addAppointment(appointment: any): void;
        /** @name dxScheduler.deleteAppointment(appointment) */
        deleteAppointment(appointment: any): void;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxScheduler.getEndViewDate() */
        getEndViewDate(): Date;
        /** @name dxScheduler.getStartViewDate() */
        getStartViewDate(): Date;
        /** @name dxScheduler.hideAppointmentPopup(saveChanges) */
        hideAppointmentPopup(saveChanges?: boolean): void;
        /** @name dxScheduler.hideAppointmentTooltip() */
        hideAppointmentTooltip(): void;
        /** @name dxScheduler.scrollToTime(hours, minutes, date) */
        scrollToTime(hours: number, minutes: number, date?: Date): void;
        /** @name dxScheduler.showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData) */
        showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
        /** @name dxScheduler.showAppointmentTooltip(appointmentData, target, currentAppointmentData) */
        showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
        /** @name dxScheduler.updateAppointment(target, appointment) */
        updateAppointment(target: any, appointment: any): void;
    }
    /** @name dxSchedulerAppointment */
    export interface dxSchedulerAppointment extends CollectionWidgetItem {
        /** @name dxSchedulerAppointment.allDay */
        allDay?: boolean;
        /** @name dxSchedulerAppointment.description */
        description?: string;
        /** @name dxSchedulerAppointment.disabled */
        disabled?: boolean;
        /** @name dxSchedulerAppointment.endDate */
        endDate?: Date;
        /** @name dxSchedulerAppointment.endDateTimeZone */
        endDateTimeZone?: string;
        /** @name dxSchedulerAppointment.html */
        html?: string;
        /** @name dxSchedulerAppointment.recurrenceException */
        recurrenceException?: string;
        /** @name dxSchedulerAppointment.recurrenceRule */
        recurrenceRule?: string;
        /** @name dxSchedulerAppointment.startDate */
        startDate?: Date;
        /** @name dxSchedulerAppointment.startDateTimeZone */
        startDateTimeZone?: string;
        /** @name dxSchedulerAppointment.template */
        template?: DevExpress.core.template;
        /** @name dxSchedulerAppointment.text */
        text?: string;
        /** @name dxSchedulerAppointment.visible */
        visible?: boolean;
    }
    /** @name dxSchedulerAppointmentTooltipTemplate */
    export interface dxSchedulerAppointmentTooltipTemplate {
        /** @name dxSchedulerAppointmentTooltipTemplate.allDay */
        allDay?: boolean;
        /** @name dxSchedulerAppointmentTooltipTemplate.description */
        description?: string;
        /** @name dxSchedulerAppointmentTooltipTemplate.endDate */
        endDate?: Date;
        /** @name dxSchedulerAppointmentTooltipTemplate.endDateTimeZone */
        endDateTimeZone?: string;
        /** @name dxSchedulerAppointmentTooltipTemplate.recurrenceException */
        recurrenceException?: string;
        /** @name dxSchedulerAppointmentTooltipTemplate.recurrenceRule */
        recurrenceRule?: string;
        /** @name dxSchedulerAppointmentTooltipTemplate.startDate */
        startDate?: Date;
        /** @name dxSchedulerAppointmentTooltipTemplate.startDateTimeZone */
        startDateTimeZone?: string;
        /** @name dxSchedulerAppointmentTooltipTemplate.text */
        text?: string;
    }
    /** @name dxScrollView.Options */
    export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
        /** @name dxScrollView.Options.onPullDown */
        onPullDown?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxScrollView.Options.onReachBottom */
        onReachBottom?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxScrollView.Options.pulledDownText */
        pulledDownText?: string;
        /** @name dxScrollView.Options.pullingDownText */
        pullingDownText?: string;
        /** @name dxScrollView.Options.reachBottomText */
        reachBottomText?: string;
        /** @name dxScrollView.Options.refreshingText */
        refreshingText?: string;
    }
    /** @name dxScrollView */
    export class dxScrollView extends dxScrollable {
        constructor(element: Element, options?: dxScrollViewOptions)
        constructor(element: JQuery, options?: dxScrollViewOptions)
        /** @name dxScrollView.refresh() */
        refresh(): void;
        /** @name dxScrollView.release(preventScrollBottom) */
        release(preventScrollBottom: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxScrollable.Options */
    export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
        /** @name dxScrollable.Options.bounceEnabled */
        bounceEnabled?: boolean;
        /** @name dxScrollable.Options.direction */
        direction?: 'both' | 'horizontal' | 'vertical';
        /** @name dxScrollable.Options.disabled */
        disabled?: boolean;
        /** @name dxScrollable.Options.onScroll */
        onScroll?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** @name dxScrollable.Options.onUpdated */
        onUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** @name dxScrollable.Options.scrollByContent */
        scrollByContent?: boolean;
        /** @name dxScrollable.Options.scrollByThumb */
        scrollByThumb?: boolean;
        /** @name dxScrollable.Options.showScrollbar */
        showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
        /** @name dxScrollable.Options.useNative */
        useNative?: boolean;
    }
    /** @name dxScrollable */
    export class dxScrollable extends DOMComponent {
        constructor(element: Element, options?: dxScrollableOptions)
        constructor(element: JQuery, options?: dxScrollableOptions)
        /** @name dxScrollable.clientHeight() */
        clientHeight(): number;
        /** @name dxScrollable.clientWidth() */
        clientWidth(): number;
        /** @name dxScrollable.content() */
        content(): DevExpress.core.dxElement;
        /** @name dxScrollable.scrollBy(distance) */
        scrollBy(distance: number): void;
        /** @name dxScrollable.scrollBy(distanceObject) */
        scrollBy(distanceObject: any): void;
        /** @name dxScrollable.scrollHeight() */
        scrollHeight(): number;
        /** @name dxScrollable.scrollLeft() */
        scrollLeft(): number;
        /** @name dxScrollable.scrollOffset() */
        scrollOffset(): any;
        /** @name dxScrollable.scrollTo(targetLocation) */
        scrollTo(targetLocation: number): void;
        /** @name dxScrollable.scrollTo(targetLocationObject) */
        scrollTo(targetLocation: any): void;
        /** @name dxScrollable.scrollToElement(targetLocation) */
        scrollToElement(element: Element | JQuery): void;
        /** @name dxScrollable.scrollTop() */
        scrollTop(): number;
        /** @name dxScrollable.scrollWidth() */
        scrollWidth(): number;
        /** @name dxScrollable.update() */
        update(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxSelectBox.Options */
    export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
        /** @name dxSelectBox.Options.acceptCustomValue */
        acceptCustomValue?: boolean;
        /** @name dxSelectBox.Options.fieldTemplate */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxSelectBox.Options.onCustomItemCreating */
        onCustomItemCreating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, text?: string, customItem?: string | any | Promise<any> | JQueryPromise<any> }) => any);
        /** @name dxSelectBox.Options.openOnFieldClick */
        openOnFieldClick?: boolean;
        /** @name dxSelectBox.Options.placeholder */
        placeholder?: string;
        /** @name dxSelectBox.Options.showDropDownButton */
        showDropDownButton?: boolean;
        /** @name dxSelectBox.Options.showSelectionControls */
        showSelectionControls?: boolean;
        /** @name dxSelectBox.Options.valueChangeEvent */
        valueChangeEvent?: string;
    }
    /** @name dxSelectBox */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: Element, options?: dxSelectBoxOptions)
        constructor(element: JQuery, options?: dxSelectBoxOptions)
    }
    /** @name dxSlideOut.Options */
    export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
        /** @name dxSlideOut.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxSlideOut.Options.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxSlideOut.Options.items */
        items?: Array<string | dxSlideOutItem | any>;
        /** @name dxSlideOut.Options.menuGroupTemplate */
        menuGroupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
        /** @name dxSlideOut.Options.menuGrouped */
        menuGrouped?: boolean;
        /** @name dxSlideOut.Options.menuItemTemplate */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxSlideOut.Options.menuPosition */
        menuPosition?: 'inverted' | 'normal';
        /** @name dxSlideOut.Options.menuVisible */
        menuVisible?: boolean;
        /** @name dxSlideOut.Options.onMenuGroupRendered */
        onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxSlideOut.Options.onMenuItemRendered */
        onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxSlideOut.Options.selectedIndex */
        selectedIndex?: number;
        /** @name dxSlideOut.Options.swipeEnabled */
        swipeEnabled?: boolean;
    }
    /** @name dxSlideOut */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: Element, options?: dxSlideOutOptions)
        constructor(element: JQuery, options?: dxSlideOutOptions)
        /** @name dxSlideOut.hideMenu() */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /** @name dxSlideOut.showMenu() */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /** @name dxSlideOut.toggleMenuVisibility(showing) */
        toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxSlideOutItem */
    export interface dxSlideOutItem extends CollectionWidgetItem {
        /** @name dxSlideOutItem.menuTemplate */
        menuTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
    }
    /** @name dxSlideOutView.Options */
    export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
        /** @name dxSlideOutView.Options.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => any);
        /** @name dxSlideOutView.Options.menuPosition */
        menuPosition?: 'inverted' | 'normal';
        /** @name dxSlideOutView.Options.menuTemplate */
        menuTemplate?: DevExpress.core.template | ((menuElement: DevExpress.core.dxElement) => any);
        /** @name dxSlideOutView.Options.menuVisible */
        menuVisible?: boolean;
        /** @name dxSlideOutView.Options.swipeEnabled */
        swipeEnabled?: boolean;
    }
    /** @name dxSlideOutView */
    export class dxSlideOutView extends Widget {
        constructor(element: Element, options?: dxSlideOutViewOptions)
        constructor(element: JQuery, options?: dxSlideOutViewOptions)
        /** @name dxSlideOutView.content() */
        content(): DevExpress.core.dxElement;
        /** @name dxSlideOutView.hideMenu() */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /** @name dxSlideOutView.menuContent() */
        menuContent(): DevExpress.core.dxElement;
        /** @name dxSlideOutView.showMenu() */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /** @name dxSlideOutView.toggleMenuVisibility() */
        toggleMenuVisibility(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxSlider.Options */
    export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
        /** @name dxSlider.Options.value */
        value?: number;
    }
    /** @name dxSlider */
    export class dxSlider extends dxSliderBase {
        constructor(element: Element, options?: dxSliderOptions)
        constructor(element: JQuery, options?: dxSliderOptions)
    }
    /** @name dxSliderBase.Options */
    export interface dxSliderBaseOptions<T = dxSliderBase> extends dxTrackBarOptions<T> {
        /** @name dxSliderBase.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxSliderBase.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxSliderBase.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxSliderBase.Options.keyStep */
        keyStep?: number;
        /** @name dxSliderBase.Options.label */
        label?: { format?: format, position?: 'bottom' | 'top', visible?: boolean };
        /** @name dxSliderBase.Options.name */
        name?: string;
        /** @name dxSliderBase.Options.showRange */
        showRange?: boolean;
        /** @name dxSliderBase.Options.step */
        step?: number;
        /** @name dxSliderBase.Options.tooltip */
        tooltip?: { enabled?: boolean, format?: format, position?: 'bottom' | 'top', showMode?: 'always' | 'onHover' };
    }
    /** @name dxSliderBase */
    export class dxSliderBase extends dxTrackBar {
        constructor(element: Element, options?: dxSliderBaseOptions)
        constructor(element: JQuery, options?: dxSliderBaseOptions)
    }
    /** @name dxSortable.Options */
    export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
        /** @name dxSortable.Options.allowDropInsideItem */
        allowDropInsideItem?: boolean;
        /** @name dxSortable.Options.allowReordering */
        allowReordering?: boolean;
        /** @name dxSortable.Options.dragTemplate */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxSortable.Options.dropFeedbackMode */
        dropFeedbackMode?: 'push' | 'indicate';
        /** @name dxSortable.Options.filter */
        filter?: string;
        /** @name dxSortable.Options.itemOrientation */
        itemOrientation?: 'horizontal' | 'vertical';
        /** @name dxSortable.Options.moveItemOnDrop */
        moveItemOnDrop?: boolean;
        /** @name dxSortable.Options.onAdd */
        onAdd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /** @name dxSortable.Options.onDragChange */
        onDragChange?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /** @name dxSortable.Options.onDragEnd */
        onDragEnd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /** @name dxSortable.Options.onDragMove */
        onDragMove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /** @name dxSortable.Options.onDragStart */
        onDragStart?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any);
        /** @name dxSortable.Options.onRemove */
        onRemove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /** @name dxSortable.Options.onReorder */
        onReorder?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    }
    /** @name dxSortable */
    export class dxSortable extends DraggableBase {
        constructor(element: Element, options?: dxSortableOptions)
        constructor(element: JQuery, options?: dxSortableOptions)
    }
    /** @name dxSpeedDialAction.Options */
    export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
        /** @name dxSpeedDialAction.Options.icon */
        icon?: string;
        /** @name dxSpeedDialAction.Options.index */
        index?: number;
        /** @name dxSpeedDialAction.Options.label */
        label?: string;
        /** @name dxSpeedDialAction.Options.onClick */
        onClick?: ((e: { event?: event, component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, actionElement?: DevExpress.core.dxElement }) => any);
        /** @name dxSpeedDialAction.Options.onContentReady */
        onContentReady?: ((e: { component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, model?: any, actionElement?: DevExpress.core.dxElement }) => any);
        /** @name dxSpeedDialAction.Options.visible */
        visible?: boolean;
    }
    /** @name dxSpeedDialAction */
    export class dxSpeedDialAction extends Widget {
        constructor(element: Element, options?: dxSpeedDialActionOptions)
        constructor(element: JQuery, options?: dxSpeedDialActionOptions)
    }
    /** @name dxSwitch.Options */
    export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
        /** @name dxSwitch.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxSwitch.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxSwitch.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxSwitch.Options.name */
        name?: string;
        /** @deprecated */
        /** @name dxSwitch.Options.offText */
        offText?: string;
        /** @deprecated */
        /** @name dxSwitch.Options.onText */
        onText?: string;
        /** @name dxSwitch.Options.switchedOffText */
        switchedOffText?: string;
        /** @name dxSwitch.Options.switchedOnText */
        switchedOnText?: string;
        /** @name dxSwitch.Options.value */
        value?: boolean;
    }
    /** @name dxSwitch */
    export class dxSwitch extends Editor {
        constructor(element: Element, options?: dxSwitchOptions)
        constructor(element: JQuery, options?: dxSwitchOptions)
    }
    /** @name dxTabPanel.Options */
    export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
        /** @name dxTabPanel.Options.animationEnabled */
        animationEnabled?: boolean;
        /** @name dxTabPanel.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxTabPanel.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxTabPanel.Options.itemTitleTemplate */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxTabPanel.Options.items */
        items?: Array<string | dxTabPanelItem | any>;
        /** @name dxTabPanel.Options.onTitleClick */
        onTitleClick?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: event }) => any) | string;
        /** @name dxTabPanel.Options.onTitleHold */
        onTitleHold?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: event }) => any);
        /** @name dxTabPanel.Options.onTitleRendered */
        onTitleRendered?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any);
        /** @name dxTabPanel.Options.repaintChangesOnly */
        repaintChangesOnly?: boolean;
        /** @name dxTabPanel.Options.scrollByContent */
        scrollByContent?: boolean;
        /** @name dxTabPanel.Options.scrollingEnabled */
        scrollingEnabled?: boolean;
        /** @name dxTabPanel.Options.showNavButtons */
        showNavButtons?: boolean;
        /** @name dxTabPanel.Options.swipeEnabled */
        swipeEnabled?: boolean;
    }
    /** @name dxTabPanel */
    export class dxTabPanel extends dxMultiView {
        constructor(element: Element, options?: dxTabPanelOptions)
        constructor(element: JQuery, options?: dxTabPanelOptions)
    }
    /** @name dxTabPanelItem */
    export interface dxTabPanelItem extends dxMultiViewItem {
        /** @name dxTabPanelItem.badge */
        badge?: string;
        /** @name dxTabPanelItem.icon */
        icon?: string;
        /** @name dxTabPanelItem.tabTemplate */
        tabTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /** @name dxTabPanelItem.title */
        title?: string;
    }
    /** @name dxTabs.Options */
    export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
        /** @name dxTabs.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxTabs.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxTabs.Options.items */
        items?: Array<string | dxTabsItem | any>;
        /** @name dxTabs.Options.repaintChangesOnly */
        repaintChangesOnly?: boolean;
        /** @name dxTabs.Options.scrollByContent */
        scrollByContent?: boolean;
        /** @name dxTabs.Options.scrollingEnabled */
        scrollingEnabled?: boolean;
        /** @name dxTabs.Options.selectedItems */
        selectedItems?: Array<string | number | any>;
        /** @name dxTabs.Options.selectionMode */
        selectionMode?: 'multiple' | 'single';
        /** @name dxTabs.Options.showNavButtons */
        showNavButtons?: boolean;
    }
    /** @name dxTabs */
    export class dxTabs extends CollectionWidget {
        constructor(element: Element, options?: dxTabsOptions)
        constructor(element: JQuery, options?: dxTabsOptions)
    }
    /** @name dxTabsItem */
    export interface dxTabsItem extends CollectionWidgetItem {
        /** @name dxTabsItem.badge */
        badge?: string;
        /** @name dxTabsItem.icon */
        icon?: string;
    }
    /** @name dxTagBox.Options */
    export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
        /** @name dxTagBox.Options.applyValueMode */
        applyValueMode?: 'instantly' | 'useButtons';
        /** @name dxTagBox.Options.hideSelectedItems */
        hideSelectedItems?: boolean;
        /** @name dxTagBox.Options.maxDisplayedTags */
        maxDisplayedTags?: number;
        /** @name dxTagBox.Options.multiline */
        multiline?: boolean;
        /** @name dxTagBox.Options.onMultiTagPreparing */
        onMultiTagPreparing?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, multiTagElement?: DevExpress.core.dxElement, selectedItems?: Array<string | number | any>, text?: string, cancel?: boolean }) => any);
        /** @name dxTagBox.Options.onSelectAllValueChanged */
        onSelectAllValueChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** @name dxTagBox.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<string | number | any>, removedItems?: Array<string | number | any> }) => any);
        /** @name dxTagBox.Options.selectAllMode */
        selectAllMode?: 'allPages' | 'page';
        /** @name dxTagBox.Options.selectedItems */
        selectedItems?: Array<string | number | any>;
        /** @name dxTagBox.Options.showDropDownButton */
        showDropDownButton?: boolean;
        /** @name dxTagBox.Options.showMultiTagOnly */
        showMultiTagOnly?: boolean;
        /** @name dxTagBox.Options.tagTemplate */
        tagTemplate?: DevExpress.core.template | ((itemData: any, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxTagBox.Options.value */
        value?: Array<string | number | any>;
    }
    /** @name dxTagBox */
    export class dxTagBox extends dxSelectBox {
        constructor(element: Element, options?: dxTagBoxOptions)
        constructor(element: JQuery, options?: dxTagBoxOptions)
    }
    /** @name dxTextArea.Options */
    export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
        /** @name dxTextArea.Options.autoResizeEnabled */
        autoResizeEnabled?: boolean;
        /** @name dxTextArea.Options.maxHeight */
        maxHeight?: number | string;
        /** @name dxTextArea.Options.minHeight */
        minHeight?: number | string;
        /** @name dxTextArea.Options.spellcheck */
        spellcheck?: boolean;
    }
    /** @name dxTextArea */
    export class dxTextArea extends dxTextBox {
        constructor(element: Element, options?: dxTextAreaOptions)
        constructor(element: JQuery, options?: dxTextAreaOptions)
    }
    /** @name dxTextBox.Options */
    export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
        /** @name dxTextBox.Options.maxLength */
        maxLength?: string | number;
        /** @name dxTextBox.Options.mode */
        mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
        /** @name dxTextBox.Options.value */
        value?: string;
    }
    /** @name dxTextBox */
    export class dxTextBox extends dxTextEditor {
        constructor(element: Element, options?: dxTextBoxOptions)
        constructor(element: JQuery, options?: dxTextBoxOptions)
    }
    /** @name dxTextEditor.Options */
    export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
        /** @name dxTextEditor.Options.buttons */
        buttons?: Array<string | 'clear' | dxTextEditorButton>;
        /** @name dxTextEditor.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxTextEditor.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxTextEditor.Options.inputAttr */
        inputAttr?: any;
        /** @name dxTextEditor.Options.mask */
        mask?: string;
        /** @name dxTextEditor.Options.maskChar */
        maskChar?: string;
        /** @name dxTextEditor.Options.maskInvalidMessage */
        maskInvalidMessage?: string;
        /** @name dxTextEditor.Options.maskRules */
        maskRules?: any;
        /** @name dxTextEditor.Options.name */
        name?: string;
        /** @name dxTextEditor.Options.onChange */
        onChange?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onCopy */
        onCopy?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onCut */
        onCut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onEnterKey */
        onEnterKey?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onFocusIn */
        onFocusIn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onFocusOut */
        onFocusOut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onInput */
        onInput?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onKeyDown */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onKeyPress */
        onKeyPress?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onKeyUp */
        onKeyUp?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.onPaste */
        onPaste?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** @name dxTextEditor.Options.placeholder */
        placeholder?: string;
        /** @name dxTextEditor.Options.showClearButton */
        showClearButton?: boolean;
        /** @name dxTextEditor.Options.showMaskMode */
        showMaskMode?: 'always' | 'onFocus';
        /** @name dxTextEditor.Options.spellcheck */
        spellcheck?: boolean;
        /** @name dxTextEditor.Options.stylingMode */
        stylingMode?: 'outlined' | 'underlined' | 'filled';
        /** @name dxTextEditor.Options.text */
        text?: string;
        /** @name dxTextEditor.Options.useMaskedValue */
        useMaskedValue?: boolean;
        /** @name dxTextEditor.Options.value */
        value?: any;
        /** @name dxTextEditor.Options.valueChangeEvent */
        valueChangeEvent?: string;
    }
    /** @name dxTextEditor */
    export class dxTextEditor extends Editor {
        constructor(element: Element, options?: dxTextEditorOptions)
        constructor(element: JQuery, options?: dxTextEditorOptions)
        /** @name dxTextEditor.blur() */
        blur(): void;
        /** @name dxTextEditor.focus() */
        focus(): void;
        /** @name dxTextEditor.getButton(name) */
        getButton(name: string): dxButton | undefined;
    }
    /** @name dxTextEditorButton */
    export interface dxTextEditorButton {
        /** @name dxTextEditorButton.location */
        location?: 'after' | 'before';
        /** @name dxTextEditorButton.name */
        name?: string;
        /** @name dxTextEditorButton.options */
        options?: dxButtonOptions;
    }
    /** @name dxTileView.Options */
    export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
        /** @name dxTileView.Options.activeStateEnabled */
        activeStateEnabled?: boolean;
        /** @name dxTileView.Options.baseItemHeight */
        baseItemHeight?: number;
        /** @name dxTileView.Options.baseItemWidth */
        baseItemWidth?: number;
        /** @name dxTileView.Options.direction */
        direction?: 'horizontal' | 'vertical';
        /** @name dxTileView.Options.focusStateEnabled */
        focusStateEnabled?: boolean;
        /** @name dxTileView.Options.height */
        height?: number | string;
        /** @name dxTileView.Options.hoverStateEnabled */
        hoverStateEnabled?: boolean;
        /** @name dxTileView.Options.itemMargin */
        itemMargin?: number;
        /** @name dxTileView.Options.items */
        items?: Array<string | dxTileViewItem | any>;
        /** @name dxTileView.Options.showScrollbar */
        showScrollbar?: boolean;
    }
    /** @name dxTileView */
    export class dxTileView extends CollectionWidget {
        constructor(element: Element, options?: dxTileViewOptions)
        constructor(element: JQuery, options?: dxTileViewOptions)
        /** @name dxTileView.scrollPosition() */
        scrollPosition(): number;
    }
    /** @name dxTileViewItem */
    export interface dxTileViewItem extends CollectionWidgetItem {
        /** @name dxTileViewItem.heightRatio */
        heightRatio?: number;
        /** @name dxTileViewItem.widthRatio */
        widthRatio?: number;
    }
    /** @name dxToast.Options */
    export interface dxToastOptions extends dxOverlayOptions<dxToast> {
        /** @name dxToast.Options.animation */
        animation?: dxToastAnimation;
        /** @name dxToast.Options.closeOnClick */
        closeOnClick?: boolean;
        /** @name dxToast.Options.closeOnOutsideClick */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** @name dxToast.Options.closeOnSwipe */
        closeOnSwipe?: boolean;
        /** @name dxToast.Options.displayTime */
        displayTime?: number;
        /** @name dxToast.Options.height */
        height?: number | string | (() => number | string);
        /** @name dxToast.Options.maxWidth */
        maxWidth?: number | string | (() => number | string);
        /** @name dxToast.Options.message */
        message?: string;
        /** @name dxToast.Options.minWidth */
        minWidth?: number | string | (() => number | string);
        /** @name dxToast.Options.position */
        position?: positionConfig | string;
        /** @name dxToast.Options.shading */
        shading?: boolean;
        /** @name dxToast.Options.type */
        type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
        /** @name dxToast.Options.width */
        width?: number | string | (() => number | string);
    }
    /** @name dxToast.Options.animation */
    export interface dxToastAnimation extends dxOverlayAnimation {
        /** @name dxToast.Options.animation.hide */
        hide?: animationConfig;
        /** @name dxToast.Options.animation.show */
        show?: animationConfig;
    }
    /** @name dxToast */
    export class dxToast extends dxOverlay {
        constructor(element: Element, options?: dxToastOptions)
        constructor(element: JQuery, options?: dxToastOptions)
    }
    /** @name dxToolbar.Options */
    export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
        /** @name dxToolbar.Options.items */
        items?: Array<string | dxToolbarItem | any>;
        /** @name dxToolbar.Options.menuItemTemplate */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxToolbar.Options.renderAs */
        renderAs?: 'bottomToolbar' | 'topToolbar';
    }
    /** @name dxToolbar */
    export class dxToolbar extends CollectionWidget {
        constructor(element: Element, options?: dxToolbarOptions)
        constructor(element: JQuery, options?: dxToolbarOptions)
    }
    /** @name dxToolbarItem */
    export interface dxToolbarItem extends CollectionWidgetItem {
        /** @name dxToolbarItem.cssClass */
        cssClass?: string;
        /** @name dxToolbarItem.locateInMenu */
        locateInMenu?: 'always' | 'auto' | 'never';
        /** @name dxToolbarItem.location */
        location?: 'after' | 'before' | 'center';
        /** @name dxToolbarItem.menuItemTemplate */
        menuItemTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /** @name dxToolbarItem.options */
        options?: any;
        /** @name dxToolbarItem.showText */
        showText?: 'always' | 'inMenu';
        /** @name dxToolbarItem.widget */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /** @name dxTooltip.Options */
    export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
    }
    /** @name dxTooltip */
    export class dxTooltip extends dxPopover {
        constructor(element: Element, options?: dxTooltipOptions)
        constructor(element: JQuery, options?: dxTooltipOptions)
    }
    /** @name dxTrackBar.Options */
    export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
        /** @name dxTrackBar.Options.max */
        max?: number;
        /** @name dxTrackBar.Options.min */
        min?: number;
    }
    /** @name dxTrackBar */
    export class dxTrackBar extends Editor {
        constructor(element: Element, options?: dxTrackBarOptions)
        constructor(element: JQuery, options?: dxTrackBarOptions)
    }
    /** @name dxTreeList.Options */
    export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
        /** @name dxTreeList.Options.autoExpandAll */
        autoExpandAll?: boolean;
        /** @name dxTreeList.Options.columns */
        columns?: Array<dxTreeListColumn | string>;
        /** @name dxTreeList.Options.customizeColumns */
        customizeColumns?: ((columns: Array<dxTreeListColumn>) => any);
        /** @name dxTreeList.Options.dataStructure */
        dataStructure?: 'plain' | 'tree';
        /** @name dxTreeList.Options.editing */
        editing?: dxTreeListEditing;
        /** @name dxTreeList.Options.expandNodesOnFiltering */
        expandNodesOnFiltering?: boolean;
        /** @name dxTreeList.Options.expandedRowKeys */
        expandedRowKeys?: Array<any>;
        /** @name dxTreeList.Options.filterMode */
        filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
        /** @name dxTreeList.Options.hasItemsExpr */
        hasItemsExpr?: string | Function;
        /** @name dxTreeList.Options.itemsExpr */
        itemsExpr?: string | Function;
        /** @name dxTreeList.Options.keyExpr */
        keyExpr?: string | Function;
        /** @name dxTreeList.Options.onCellClick */
        onCellClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any) | string;
        /** @name dxTreeList.Options.onCellDblClick */
        onCellDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onCellHoverChanged */
        onCellHoverChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onCellPrepared */
        onCellPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /** @name dxTreeList.Options.onContextMenuPreparing */
        onContextMenuPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onEditingStart */
        onEditingStart?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /** @name dxTreeList.Options.onEditorPrepared */
        onEditorPrepared?: ((options: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onEditorPreparing */
        onEditorPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onFocusedCellChanged */
        onFocusedCellChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any);
        /** @name dxTreeList.Options.onFocusedCellChanging */
        onFocusedCellChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxTreeListRowObject>, columns?: Array<dxTreeListColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /** @name dxTreeList.Options.onFocusedRowChanged */
        onFocusedRowChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /** @name dxTreeList.Options.onFocusedRowChanging */
        onFocusedRowChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxTreeListRowObject>, cancel?: boolean }) => any);
        /** @name dxTreeList.Options.onNodesInitialized */
        onNodesInitialized?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeListNode }) => any);
        /** @name dxTreeList.Options.onRowClick */
        onRowClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, handled?: boolean, node?: dxTreeListNode, level?: number }) => any) | string;
        /** @name dxTreeList.Options.onRowDblClick */
        onRowDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /** @name dxTreeList.Options.onRowPrepared */
        onRowPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, node?: dxTreeListNode, level?: number }) => any);
        /** @name dxTreeList.Options.paging */
        paging?: dxTreeListPaging;
        /** @name dxTreeList.Options.parentIdExpr */
        parentIdExpr?: string | Function;
        /** @name dxTreeList.Options.remoteOperations */
        remoteOperations?: { filtering?: boolean, grouping?: boolean, sorting?: boolean } | 'auto';
        /** @name dxTreeList.Options.rootValue */
        rootValue?: any;
        /** @name dxTreeList.Options.scrolling */
        scrolling?: dxTreeListScrolling;
        /** @name dxTreeList.Options.selection */
        selection?: dxTreeListSelection;
    }
    /** @name dxTreeList.Options.editing */
    export interface dxTreeListEditing extends GridBaseEditing {
        /** @name dxTreeList.Options.editing.allowAdding */
        allowAdding?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /** @name dxTreeList.Options.editing.allowDeleting */
        allowDeleting?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /** @name dxTreeList.Options.editing.allowUpdating */
        allowUpdating?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /** @name dxTreeList.Options.editing.texts */
        texts?: dxTreeListEditingTexts;
    }
    /** @name dxTreeList.Options.editing.texts */
    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /** @name dxTreeList.Options.editing.texts.addRowToNode */
        addRowToNode?: string;
    }
    /** @name dxTreeList.Options.paging */
    export interface dxTreeListPaging extends GridBasePaging {
        /** @name dxTreeList.Options.paging.enabled */
        enabled?: boolean;
    }
    /** @name dxTreeList.Options.scrolling */
    export interface dxTreeListScrolling extends GridBaseScrolling {
        /** @name dxTreeList.Options.scrolling.mode */
        mode?: 'standard' | 'virtual';
    }
    /** @name dxTreeList.Options.selection */
    export interface dxTreeListSelection extends GridBaseSelection {
        /** @name dxTreeList.Options.selection.recursive */
        recursive?: boolean;
    }
    /** @name dxTreeList */
    export class dxTreeList extends GridBase {
        constructor(element: Element, options?: dxTreeListOptions)
        constructor(element: JQuery, options?: dxTreeListOptions)
        /** @name dxTreeList.addColumn(columnOptions) */
        addColumn(columnOptions: any | string): void;
        /** @name dxTreeList.addRow() */
        addRow(): void;
        /** @name dxTreeList.addRow(parentId) */
        addRow(parentId: any): void;
        /** @name dxTreeList.collapseRow(key) */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /** @name dxTreeList.expandRow(key) */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /** @name dxTreeList.forEachNode(callback) */
        forEachNode(callback: Function): void;
        /** @name dxTreeList.forEachNode(nodes, callback) */
        forEachNode(nodes: Array<dxTreeListNode>, callback: Function): void;
        /** @name dxTreeList.getNodeByKey(key) */
        getNodeByKey(key: any | string | number): dxTreeListNode;
        /** @name dxTreeList.getRootNode() */
        getRootNode(): dxTreeListNode;
        /** @name dxTreeList.getSelectedRowKeys() */
        getSelectedRowKeys(): Array<any>;
        /** @deprecated */
        /** @name dxTreeList.getSelectedRowKeys(leavesOnly) */
        getSelectedRowKeys(leavesOnly: boolean): Array<any>;
        /** @name dxTreeList.getSelectedRowKeys(mode) */
        getSelectedRowKeys(mode: string): Array<any>;
        /** @name dxTreeList.getSelectedRowsData() */
        getSelectedRowsData(): Array<any>;
        /** @name dxTreeList.getSelectedRowsData(mode) */
        getSelectedRowsData(mode: string): Array<any>;
        /** @name dxTreeList.getVisibleColumns() */
        getVisibleColumns(): Array<dxTreeListColumn>;
        /** @name dxTreeList.getVisibleColumns(headerLevel) */
        getVisibleColumns(headerLevel: number): Array<dxTreeListColumn>;
        /** @name dxTreeList.getVisibleRows() */
        getVisibleRows(): Array<dxTreeListRowObject>;
        /** @name dxTreeList.isRowExpanded(key) */
        isRowExpanded(key: any): boolean;
        /** @name dxTreeList.loadDescendants() */
        loadDescendants(): Promise<void> & JQueryPromise<void>;
        /** @name dxTreeList.loadDescendants(keys) */
        loadDescendants(keys: Array<any>): Promise<void> & JQueryPromise<void>;
        /** @name dxTreeList.loadDescendants(keys, childrenOnly) */
        loadDescendants(keys: Array<any>, childrenOnly: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxTreeListColumn */
    export interface dxTreeListColumn extends GridBaseColumn {
        /** @name dxTreeListColumn.buttons */
        buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxTreeListColumnButton>;
        /** @name dxTreeListColumn.cellTemplate */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxTreeList, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /** @name dxTreeListColumn.columns */
        columns?: Array<dxTreeListColumn | string>;
        /** @name dxTreeListColumn.editCellTemplate */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxTreeList, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /** @name dxTreeListColumn.headerCellTemplate */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxTreeList, columnIndex?: number, column?: dxTreeListColumn }) => any);
        /** @name dxTreeListColumn.type */
        type?: 'adaptive' | 'buttons';
    }
    /** @name dxTreeListColumnButton */
    export interface dxTreeListColumnButton extends GridBaseColumnButton {
        /** @name dxTreeListColumnButton.name */
        name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /** @name dxTreeListColumnButton.onClick */
        onClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: event, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any) | string;
        /** @name dxTreeListColumnButton.template */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxTreeList, data?: any, key?: any, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject }) => string | Element | JQuery);
        /** @name dxTreeListColumnButton.visible */
        visible?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => boolean);
    }
    /** @name dxTreeListNode */
    export interface dxTreeListNode {
        /** @name dxTreeListNode.children */
        children?: Array<dxTreeListNode>;
        /** @name dxTreeListNode.data */
        data?: any;
        /** @name dxTreeListNode.hasChildren */
        hasChildren?: boolean;
        /** @name dxTreeListNode.key */
        key?: any;
        /** @name dxTreeListNode.level */
        level?: number;
        /** @name dxTreeListNode.parent */
        parent?: dxTreeListNode;
        /** @name dxTreeListNode.visible */
        visible?: boolean;
    }
    /** @name dxTreeListRowObject */
    export interface dxTreeListRowObject {
        /** @name dxTreeListRowObject.isEditing */
        isEditing?: boolean;
        /** @name dxTreeListRowObject.isExpanded */
        isExpanded?: boolean;
        /** @name dxTreeListRowObject.isNewRow */
        isNewRow?: boolean;
        /** @name dxTreeListRowObject.isSelected */
        isSelected?: boolean;
        /** @name dxTreeListRowObject.key */
        key?: any;
        /** @name dxTreeListRowObject.level */
        level?: number;
        /** @name dxTreeListRowObject.node */
        node?: dxTreeListNode;
        /** @name dxTreeListRowObject.rowIndex */
        rowIndex?: number;
        /** @name dxTreeListRowObject.rowType */
        rowType?: string;
        /** @name dxTreeListRowObject.values */
        values?: Array<any>;
    }
    /** @name dxTreeView.Options */
    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
        /** @name dxTreeView.Options.animationEnabled */
        animationEnabled?: boolean;
        /** @name dxTreeView.Options.createChildren */
        createChildren?: ((parentNode: dxTreeViewNode) => Promise<any> | JQueryPromise<any> | Array<any>);
        /** @name dxTreeView.Options.dataStructure */
        dataStructure?: 'plain' | 'tree';
        /** @name dxTreeView.Options.expandAllEnabled */
        expandAllEnabled?: boolean;
        /** @name dxTreeView.Options.expandEvent */
        expandEvent?: 'dblclick' | 'click';
        /** @name dxTreeView.Options.expandNodesRecursive */
        expandNodesRecursive?: boolean;
        /** @name dxTreeView.Options.expandedExpr */
        expandedExpr?: string | Function;
        /** @name dxTreeView.Options.hasItemsExpr */
        hasItemsExpr?: string | Function;
        /** @name dxTreeView.Options.items */
        items?: Array<dxTreeViewItem>;
        /** @name dxTreeView.Options.onItemClick */
        onItemClick?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemCollapsed */
        onItemCollapsed?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemContextMenu */
        onItemContextMenu?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemExpanded */
        onItemExpanded?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemHold */
        onItemHold?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: event, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemRendered */
        onItemRendered?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, node?: dxTreeViewNode }) => any);
        /** @name dxTreeView.Options.onItemSelectionChanged */
        onItemSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode, itemElement?: DevExpress.core.dxElement }) => any);
        /** @name dxTreeView.Options.onSelectAllValueChanged */
        onSelectAllValueChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** @name dxTreeView.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name dxTreeView.Options.parentIdExpr */
        parentIdExpr?: string | Function;
        /** @name dxTreeView.Options.rootValue */
        rootValue?: any;
        /** @name dxTreeView.Options.scrollDirection */
        scrollDirection?: 'both' | 'horizontal' | 'vertical';
        /** @name dxTreeView.Options.selectAllText */
        selectAllText?: string;
        /** @name dxTreeView.Options.selectByClick */
        selectByClick?: boolean;
        /** @name dxTreeView.Options.selectNodesRecursive */
        selectNodesRecursive?: boolean;
        /** @name dxTreeView.Options.selectionMode */
        selectionMode?: 'multiple' | 'single';
        /** @name dxTreeView.Options.showCheckBoxesMode */
        showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
        /** @name dxTreeView.Options.virtualModeEnabled */
        virtualModeEnabled?: boolean;
    }
    /** @name dxTreeView */
    export class dxTreeView extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxTreeViewOptions)
        constructor(element: JQuery, options?: dxTreeViewOptions)
        /** @name dxTreeView.collapseAll() */
        collapseAll(): void;
        /** @name dxTreeView.collapseItem(itemData) */
        collapseItem(itemData: any): void;
        /** @name dxTreeView.collapseItem(itemElement) */
        collapseItem(itemElement: Element): void;
        /** @name dxTreeView.collapseItem(key) */
        collapseItem(key: any): void;
        /** @name dxTreeView.expandAll() */
        expandAll(): void;
        /** @name dxTreeView.expandItem(itemData) */
        expandItem(itemData: any): void;
        /** @name dxTreeView.expandItem(itemElement) */
        expandItem(itemElement: Element): void;
        /** @name dxTreeView.expandItem(key) */
        expandItem(key: any): void;
        /** @name dxTreeView.getNodes() */
        getNodes(): Array<dxTreeViewNode>;
        /** @name dxTreeView.selectAll() */
        selectAll(): void;
        /** @name dxTreeView.selectItem(itemData) */
        selectItem(itemData: any): void;
        /** @name dxTreeView.selectItem(itemElement) */
        selectItem(itemElement: Element): void;
        /** @name dxTreeView.selectItem(key) */
        selectItem(key: any): void;
        /** @name dxTreeView.unselectAll() */
        unselectAll(): void;
        /** @name dxTreeView.unselectItem(itemData) */
        unselectItem(itemData: any): void;
        /** @name dxTreeView.unselectItem(itemElement) */
        unselectItem(itemElement: Element): void;
        /** @name dxTreeView.unselectItem(key) */
        unselectItem(key: any): void;
        /** @name dxTreeView.updateDimensions() */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /** @name dxTreeViewItem */
    export interface dxTreeViewItem extends CollectionWidgetItem {
        /** @name dxTreeViewItem.expanded */
        expanded?: boolean;
        /** @name dxTreeViewItem.hasItems */
        hasItems?: boolean;
        /** @name dxTreeViewItem.icon */
        icon?: string;
        /** @name dxTreeViewItem.items */
        items?: Array<dxTreeViewItem>;
        /** @name dxTreeViewItem.parentId */
        parentId?: number | string;
        /** @name dxTreeViewItem.selected */
        selected?: boolean;
    }
    /** @name dxTreeViewNode */
    export interface dxTreeViewNode {
        /** @name dxTreeViewNode.children */
        children?: Array<dxTreeViewNode>;
        /** @name dxTreeViewNode.disabled */
        disabled?: boolean;
        /** @name dxTreeViewNode.expanded */
        expanded?: boolean;
        /** @name dxTreeViewNode.itemData */
        itemData?: any;
        /** @name dxTreeViewNode.key */
        key?: any;
        /** @name dxTreeViewNode.parent */
        parent?: dxTreeViewNode;
        /** @name dxTreeViewNode.selected */
        selected?: boolean;
        /** @name dxTreeViewNode.text */
        text?: string;
    }
    /** @name dxValidationGroup.Options */
    export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
    }
    /** @name dxValidationGroup */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: Element, options?: dxValidationGroupOptions)
        constructor(element: JQuery, options?: dxValidationGroupOptions)
        /** @name dxValidationGroup.reset() */
        reset(): void;
        /** @name Component.resetOption(optionName) */
        resetOption(optionName: string): void;
        /** @name dxValidationGroup.validate() */
        validate(): dxValidationGroupResult;
    }
    /** @name dxValidationGroupResult */
    export interface dxValidationGroupResult {
        /** @name dxValidationGroupResult.brokenRules */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /** @name dxValidationGroupResult.complete */
        complete?: Promise<dxValidationGroupResult> | JQueryPromise<dxValidationGroupResult>;
        /** @name dxValidationGroupResult.isValid */
        isValid?: boolean;
        /** @name dxValidationGroupResult.status */
        status?: 'valid' | 'invalid' | 'pending';
        /** @name dxValidationGroupResult.validators */
        validators?: Array<any>;
    }
    /** @name dxValidationSummary.Options */
    export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
        /** @name dxValidationSummary.Options.validationGroup */
        validationGroup?: string;
    }
    /** @name dxValidationSummary */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: Element, options?: dxValidationSummaryOptions)
        constructor(element: JQuery, options?: dxValidationSummaryOptions)
    }
    /** @name dxValidator.Options */
    export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
        /** @name dxValidator.Options.adapter */
        adapter?: { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> | JQueryCallback };
        /** @name dxValidator.Options.name */
        name?: string;
        /** @name dxValidator.Options.onValidated */
        onValidated?: ((validatedInfo: { name?: string, isValid?: boolean, value?: any, validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, status?: 'valid' | 'invalid' | 'pending' }) => any);
        /** @name dxValidator.Options.validationGroup */
        validationGroup?: string;
        /** @name dxValidator.Options.validationRules */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    }
    /** @name dxValidator */
    export class dxValidator extends DOMComponent {
        constructor(element: Element, options?: dxValidatorOptions)
        constructor(element: JQuery, options?: dxValidatorOptions)
        /** @name dxValidator.focus() */
        focus(): void;
        /** @name dxValidator.reset() */
        reset(): void;
        /** @name Component.resetOption(optionName) */
        resetOption(optionName: string): void;
        /** @name dxValidator.validate() */
        validate(): dxValidatorResult;
    }
    /** @name dxValidatorResult */
    export interface dxValidatorResult {
        /** @name dxValidatorResult.brokenRule */
        brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule;
        /** @name dxValidatorResult.brokenRules */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /** @name dxValidatorResult.complete */
        complete?: Promise<dxValidatorResult> | JQueryPromise<dxValidatorResult>;
        /** @name dxValidatorResult.isValid */
        isValid?: boolean;
        /** @name dxValidatorResult.pendingRules */
        pendingRules?: Array<AsyncRule>;
        /** @name dxValidatorResult.status */
        status?: 'valid' | 'invalid' | 'pending';
        /** @name dxValidatorResult.validationRules */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /** @name dxValidatorResult.value */
        value?: any;
    }
    /** @name format */
    export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | { currency?: string, formatter?: ((value: number | Date) => string), parser?: ((value: string) => number | Date), precision?: number, type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' };
    /** @name ui.dialog */
    export class dialog {
        /** @name ui.dialog.alert(messageHtml,title) */
        static alert(messageHtml: string, title: string): Promise<void> & JQueryPromise<void>;
        /** @name ui.dialog.confirm(messageHtml,title) */
        static confirm(messageHtml: string, title: string): Promise<boolean> & JQueryPromise<boolean>;
        /** @name ui.dialog.custom(options) */
        static custom(options: { title?: string, messageHtml?: string, buttons?: Array<dxButtonOptions>, showTitle?: boolean, message?: string, dragEnabled?: boolean }): any;
    }
    /** @deprecated */
    /** @name ui.template */
    export type template = DevExpress.core.template;
    /** @name ui.themes */
    export class themes {
        /** @name ui.themes.current() */
        static current(): string;
        /** @name ui.themes.current(themeName) */
        static current(themeName: string): void;
        /** @name ui.themes.ready(callback) */
        static ready(callback: Function): void;
    }
}
declare module DevExpress.ui.dxOverlay {
    /** @name ui.dxOverlay.baseZIndex(zIndex) */
    export function baseZIndex(zIndex: number): void;
}
declare module DevExpress.utils {
    /** @name utils.cancelAnimationFrame(requestID) */
    export function cancelAnimationFrame(requestID: number): void;
    /** @name utils.initMobileViewport(options) */
    export function initMobileViewport(options: { allowZoom?: boolean, allowPan?: boolean, allowSelection?: boolean }): void;
    /** @name utils.requestAnimationFrame(callback) */
    export function requestAnimationFrame(callback: Function): number;
}
declare module DevExpress.viz {
    /** @name BarGaugeBarInfo */
    export interface BarGaugeBarInfo {
        /** @name BarGaugeBarInfo.color */
        color?: string;
        /** @name BarGaugeBarInfo.index */
        index?: number;
        /** @name BarGaugeBarInfo.value */
        value?: number;
    }
    /** @name BarGaugeLegendItem */
    export interface BarGaugeLegendItem extends BaseLegendItem {
        /** @name BarGaugeLegendItem.item */
        item?: BarGaugeBarInfo;
    }
    /** @name BaseChart.Options */
    export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
        /** @name BaseChart.Options.adaptiveLayout */
        adaptiveLayout?: BaseChartAdaptiveLayout;
        /** @name BaseChart.Options.animation */
        animation?: { duration?: number, easing?: 'easeOutCubic' | 'linear', enabled?: boolean, maxPointCountSupported?: number } | boolean;
        /** @name BaseChart.Options.customizeLabel */
        customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
        /** @name BaseChart.Options.customizePoint */
        customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
        /** @name BaseChart.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name BaseChart.Options.legend */
        legend?: BaseChartLegend;
        /** @name BaseChart.Options.onDone */
        onDone?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name BaseChart.Options.onPointClick */
        onPointClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: basePointObject }) => any) | string;
        /** @name BaseChart.Options.onPointHoverChanged */
        onPointHoverChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /** @name BaseChart.Options.onPointSelectionChanged */
        onPointSelectionChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /** @name BaseChart.Options.onTooltipHidden */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /** @name BaseChart.Options.onTooltipShown */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /** @name BaseChart.Options.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name BaseChart.Options.paletteExtensionMode */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** @name BaseChart.Options.pointSelectionMode */
        pointSelectionMode?: 'multiple' | 'single';
        /** @name BaseChart.Options.series */
        series?: any | Array<any>;
        /** @name BaseChart.Options.tooltip */
        tooltip?: BaseChartTooltip;
    }
    /** @name BaseChart.Options.adaptiveLayout */
    interface BaseChartAdaptiveLayout {
        /** @name BaseChart.Options.adaptiveLayout.height */
        height?: number;
        /** @name BaseChart.Options.adaptiveLayout.keepLabels */
        keepLabels?: boolean;
        /** @name BaseChart.Options.adaptiveLayout.width */
        width?: number;
    }
    /** @name BaseChart.Options.legend */
    interface BaseChartLegend extends BaseLegend {
        /** @name BaseChart.Options.legend.customizeItems */
        customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
        /** @name BaseChart.Options.legend.markerTemplate */
        markerTemplate?: DevExpress.core.template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /** @name BaseChart.Options.tooltip */
    interface BaseChartTooltip extends BaseWidgetTooltip {
        /** @name BaseChart.Options.tooltip.argumentFormat */
        argumentFormat?: DevExpress.ui.format;
        /** @name BaseChart.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((pointInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name BaseChart.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((pointInfo: any) => any);
        /** @name BaseChart.Options.tooltip.shared */
        shared?: boolean;
    }
    /** @name BaseChart */
    export class BaseChart extends BaseWidget {
        constructor(element: Element, options?: BaseChartOptions)
        constructor(element: JQuery, options?: BaseChartOptions)
        /** @name BaseChart.clearSelection() */
        clearSelection(): void;
        /** @name BaseChart.getAllSeries() */
        getAllSeries(): Array<baseSeriesObject>;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name BaseChart.getSeriesByName(seriesName) */
        getSeriesByName(seriesName: any): chartSeriesObject;
        /** @name BaseChart.getSeriesByPos(seriesIndex) */
        getSeriesByPos(seriesIndex: number): chartSeriesObject;
        /** @name BaseChart.hideTooltip() */
        hideTooltip(): void;
        /** @name BaseChart.refresh() */
        refresh(): void;
        /** @name BaseWidget.render() */
        render(): void;
        /** @name BaseChart.render(renderOptions) */
        render(renderOptions: any): void;
    }
    /** @name BaseChartLegendItem */
    export interface BaseChartLegendItem extends BaseLegendItem {
        /** @name BaseChartLegendItem.series */
        series?: baseSeriesObject;
    }
    /** @name BaseGauge.Options */
    export interface BaseGaugeOptions<T = BaseGauge> extends BaseWidgetOptions<T> {
        /** @name BaseGauge.Options.animation */
        animation?: BaseGaugeAnimation;
        /** @name BaseGauge.Options.containerBackgroundColor */
        containerBackgroundColor?: string;
        /** @name BaseGauge.Options.loadingIndicator */
        loadingIndicator?: BaseGaugeLoadingIndicator;
        /** @name BaseGauge.Options.onTooltipHidden */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** @name BaseGauge.Options.onTooltipShown */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** @name BaseGauge.Options.rangeContainer */
        rangeContainer?: BaseGaugeRangeContainer;
        /** @name BaseGauge.Options.scale */
        scale?: BaseGaugeScale;
        /** @name BaseGauge.Options.subvalues */
        subvalues?: Array<number>;
        /** @name BaseGauge.Options.tooltip */
        tooltip?: BaseGaugeTooltip;
        /** @name BaseGauge.Options.value */
        value?: number;
    }
    /** @name BaseGauge.Options.animation */
    interface BaseGaugeAnimation {
        /** @name BaseGauge.Options.animation.duration */
        duration?: number;
        /** @name BaseGauge.Options.animation.easing */
        easing?: 'easeOutCubic' | 'linear';
        /** @name BaseGauge.Options.animation.enabled */
        enabled?: boolean;
    }
    /** @name BaseGauge.Options.loadingIndicator */
    interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /** @name BaseGauge.Options.rangeContainer */
    interface BaseGaugeRangeContainer {
        /** @name BaseGauge.Options.rangeContainer.backgroundColor */
        backgroundColor?: string;
        /** @name BaseGauge.Options.rangeContainer.offset */
        offset?: number;
        /** @name BaseGauge.Options.rangeContainer.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name BaseGauge.Options.rangeContainer.paletteExtensionMode */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** @name BaseGauge.Options.rangeContainer.ranges */
        ranges?: Array<{ color?: string, endValue?: number, startValue?: number }>;
    }
    /** @name BaseGauge.Options.scale */
    interface BaseGaugeScale {
        /** @name BaseGauge.Options.scale.allowDecimals */
        allowDecimals?: boolean;
        /** @name BaseGauge.Options.scale.customMinorTicks */
        customMinorTicks?: Array<number>;
        /** @name BaseGauge.Options.scale.customTicks */
        customTicks?: Array<number>;
        /** @name BaseGauge.Options.scale.endValue */
        endValue?: number;
        /** @name BaseGauge.Options.scale.label */
        label?: BaseGaugeScaleLabel;
        /** @name BaseGauge.Options.scale.minorTick */
        minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /** @name BaseGauge.Options.scale.minorTickInterval */
        minorTickInterval?: number;
        /** @name BaseGauge.Options.scale.scaleDivisionFactor */
        scaleDivisionFactor?: number;
        /** @name BaseGauge.Options.scale.startValue */
        startValue?: number;
        /** @name BaseGauge.Options.scale.tick */
        tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /** @name BaseGauge.Options.scale.tickInterval */
        tickInterval?: number;
    }
    /** @name BaseGauge.Options.scale.label */
    interface BaseGaugeScaleLabel {
        /** @name BaseGauge.Options.scale.label.customizeText */
        customizeText?: ((scaleValue: { value?: number, valueText?: string }) => string);
        /** @name BaseGauge.Options.scale.label.font */
        font?: Font;
        /** @name BaseGauge.Options.scale.label.format */
        format?: DevExpress.ui.format;
        /** @name BaseGauge.Options.scale.label.overlappingBehavior */
        overlappingBehavior?: 'hide' | 'none';
        /** @name BaseGauge.Options.scale.label.useRangeColors */
        useRangeColors?: boolean;
        /** @name BaseGauge.Options.scale.label.visible */
        visible?: boolean;
    }
    /** @name BaseGauge.Options.tooltip */
    interface BaseGaugeTooltip extends BaseWidgetTooltip {
        /** @name BaseGauge.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name BaseGauge.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
    }
    /** @name BaseGauge */
    export class BaseGauge extends BaseWidget {
        constructor(element: Element, options?: BaseGaugeOptions)
        constructor(element: JQuery, options?: BaseGaugeOptions)
        /** @name BaseGauge.subvalues() */
        subvalues(): Array<number>;
        /** @name BaseGauge.subvalues(subvalues) */
        subvalues(subvalues: Array<number>): void;
        /** @name BaseGauge.value() */
        value(): number;
        /** @name BaseGauge.value(value) */
        value(value: number): void;
    }
    /** @name BaseLegend */
    export interface BaseLegend {
        /** @name BaseLegend.backgroundColor */
        backgroundColor?: string;
        /** @name BaseLegend.border */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /** @name BaseLegend.columnCount */
        columnCount?: number;
        /** @name BaseLegend.columnItemSpacing */
        columnItemSpacing?: number;
        /** @name BaseLegend.font */
        font?: Font;
        /** @name BaseLegend.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name BaseLegend.itemTextPosition */
        itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
        /** @name BaseLegend.itemsAlignment */
        itemsAlignment?: 'center' | 'left' | 'right';
        /** @name BaseLegend.margin */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /** @name BaseLegend.markerSize */
        markerSize?: number;
        /** @name BaseLegend.orientation */
        orientation?: 'horizontal' | 'vertical';
        /** @name BaseLegend.paddingLeftRight */
        paddingLeftRight?: number;
        /** @name BaseLegend.paddingTopBottom */
        paddingTopBottom?: number;
        /** @name BaseLegend.rowCount */
        rowCount?: number;
        /** @name BaseLegend.rowItemSpacing */
        rowItemSpacing?: number;
        /** @name BaseLegend.title */
        title?: { font?: Font, horizontalAlignment?: 'center' | 'left' | 'right', margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: { font?: Font, offset?: number, text?: string } | string, text?: string, verticalAlignment?: 'bottom' | 'top' } | string;
        /** @name BaseLegend.verticalAlignment */
        verticalAlignment?: 'bottom' | 'top';
        /** @name BaseLegend.visible */
        visible?: boolean;
    }
    /** @name BaseLegendItem */
    export interface BaseLegendItem {
        /** @name BaseLegendItem.marker */
        marker?: { fill?: string, opacity?: number, size?: number, state?: 'normal' | 'hovered' | 'selected' };
        /** @name BaseLegendItem.text */
        text?: string;
        /** @name BaseLegendItem.visible */
        visible?: boolean;
    }
    /** @name BaseSparkline.Options */
    export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
        /** @name BaseSparkline.Options.onTooltipHidden */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name BaseSparkline.Options.onTooltipShown */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name BaseSparkline.Options.tooltip */
        tooltip?: BaseSparklineTooltip;
    }
    /** @name BaseSparkline.Options.tooltip */
    interface BaseSparklineTooltip extends BaseWidgetTooltip {
        /** @name BaseSparkline.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((pointsInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name BaseSparkline.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((pointsInfo: any) => any);
        /** @name BaseSparkline.Options.tooltip.enabled */
        enabled?: boolean;
    }
    /** @name BaseSparkline */
    export class BaseSparkline extends BaseWidget {
        constructor(element: Element, options?: BaseSparklineOptions)
        constructor(element: JQuery, options?: BaseSparklineOptions)
    }
    /** @name BaseWidget.Options */
    export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
        /** @name BaseWidget.Options.disabled */
        disabled?: boolean;
        /** @name BaseWidget.Options.export */
        export?: BaseWidgetExport;
        /** @name BaseWidget.Options.loadingIndicator */
        loadingIndicator?: BaseWidgetLoadingIndicator;
        /** @name BaseWidget.Options.margin */
        margin?: BaseWidgetMargin;
        /** @name BaseWidget.Options.onDrawn */
        onDrawn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name BaseWidget.Options.onExported */
        onExported?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** @name BaseWidget.Options.onExporting */
        onExporting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean, format?: string }) => any);
        /** @name BaseWidget.Options.onFileSaving */
        onFileSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** @name BaseWidget.Options.onIncidentOccurred */
        onIncidentOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** @name BaseWidget.Options.pathModified */
        pathModified?: boolean;
        /** @name BaseWidget.Options.redrawOnResize */
        redrawOnResize?: boolean;
        /** @name BaseWidget.Options.rtlEnabled */
        rtlEnabled?: boolean;
        /** @name BaseWidget.Options.size */
        size?: BaseWidgetSize;
        /** @name BaseWidget.Options.theme */
        theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'ios7.default' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
        /** @name BaseWidget.Options.title */
        title?: BaseWidgetTitle | string;
        /** @name BaseWidget.Options.tooltip */
        tooltip?: BaseWidgetTooltip;
    }
    /** @name BaseWidget.Options.export */
    interface BaseWidgetExport {
        /** @name BaseWidget.Options.export.backgroundColor */
        backgroundColor?: string;
        /** @name BaseWidget.Options.export.enabled */
        enabled?: boolean;
        /** @name BaseWidget.Options.export.fileName */
        fileName?: string;
        /** @name BaseWidget.Options.export.formats */
        formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
        /** @name BaseWidget.Options.export.margin */
        margin?: number;
        /** @name BaseWidget.Options.export.printingEnabled */
        printingEnabled?: boolean;
        /** @deprecated */
        /** @name BaseWidget.Options.export.proxyUrl */
        proxyUrl?: string;
        /** @name BaseWidget.Options.export.svgToCanvas */
        svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => Promise<void> | JQueryPromise<void>);
    }
    /** @name BaseWidget.Options.loadingIndicator */
    interface BaseWidgetLoadingIndicator {
        /** @name BaseWidget.Options.loadingIndicator.backgroundColor */
        backgroundColor?: string;
        /** @name BaseWidget.Options.loadingIndicator.enabled */
        enabled?: boolean;
        /** @name BaseWidget.Options.loadingIndicator.font */
        font?: Font;
        /** @name BaseWidget.Options.loadingIndicator.show */
        show?: boolean;
        /** @name BaseWidget.Options.loadingIndicator.text */
        text?: string;
    }
    /** @name BaseWidget.Options.margin */
    interface BaseWidgetMargin {
        /** @name BaseWidget.Options.margin.bottom */
        bottom?: number;
        /** @name BaseWidget.Options.margin.left */
        left?: number;
        /** @name BaseWidget.Options.margin.right */
        right?: number;
        /** @name BaseWidget.Options.margin.top */
        top?: number;
    }
    /** @name BaseWidget.Options.size */
    interface BaseWidgetSize {
        /** @name BaseWidget.Options.size.height */
        height?: number;
        /** @name BaseWidget.Options.size.width */
        width?: number;
    }
    /** @name BaseWidget.Options.title */
    interface BaseWidgetTitle {
        /** @name BaseWidget.Options.title.font */
        font?: Font;
        /** @name BaseWidget.Options.title.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name BaseWidget.Options.title.margin */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /** @name BaseWidget.Options.title.placeholderSize */
        placeholderSize?: number;
        /** @name BaseWidget.Options.title.subtitle */
        subtitle?: { font?: Font, offset?: number, text?: string, textOverflow?: 'ellipsis' | 'hide' | 'none', wordWrap?: 'normal' | 'breakWord' | 'none' } | string;
        /** @name BaseWidget.Options.title.text */
        text?: string;
        /** @name BaseWidget.Options.title.textOverflow */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /** @name BaseWidget.Options.title.verticalAlignment */
        verticalAlignment?: 'bottom' | 'top';
        /** @name BaseWidget.Options.title.wordWrap */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /** @name BaseWidget.Options.tooltip */
    interface BaseWidgetTooltip {
        /** @name BaseWidget.Options.tooltip.arrowLength */
        arrowLength?: number;
        /** @name BaseWidget.Options.tooltip.border */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /** @name BaseWidget.Options.tooltip.color */
        color?: string;
        /** @name BaseWidget.Options.tooltip.container */
        container?: string | Element | JQuery;
        /** @name BaseWidget.Options.tooltip.cornerRadius */
        cornerRadius?: number;
        /** @name BaseWidget.Options.tooltip.enabled */
        enabled?: boolean;
        /** @name BaseWidget.Options.tooltip.font */
        font?: Font;
        /** @name BaseWidget.Options.tooltip.format */
        format?: DevExpress.ui.format;
        /** @name BaseWidget.Options.tooltip.opacity */
        opacity?: number;
        /** @name BaseWidget.Options.tooltip.paddingLeftRight */
        paddingLeftRight?: number;
        /** @name BaseWidget.Options.tooltip.paddingTopBottom */
        paddingTopBottom?: number;
        /** @name BaseWidget.Options.tooltip.shadow */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /** @name BaseWidget.Options.tooltip.zIndex */
        zIndex?: number;
    }
    /** @name BaseWidget */
    export class BaseWidget extends DOMComponent {
        constructor(element: Element, options?: BaseWidgetOptions)
        constructor(element: JQuery, options?: BaseWidgetOptions)
        /** @name BaseWidget.exportTo(fileName, format) */
        exportTo(fileName: string, format: string): void;
        /** @name BaseWidget.getSize() */
        getSize(): BaseWidgetSize;
        /** @name BaseWidget.hideLoadingIndicator() */
        hideLoadingIndicator(): void;
        /** @name BaseWidget.print() */
        print(): void;
        /** @name BaseWidget.render() */
        render(): void;
        /** @name BaseWidget.showLoadingIndicator() */
        showLoadingIndicator(): void;
        /** @name BaseWidget.svg() */
        svg(): string;
    }
    /** @name ChartSeries */
    export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
        /** @name ChartSeries.name */
        name?: string;
        /** @name ChartSeries.tag */
        tag?: any;
        /** @name ChartSeries.type */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /** @name CommonIndicator */
    export interface CommonIndicator {
        /** @name CommonIndicator.arrowLength */
        arrowLength?: number;
        /** @name CommonIndicator.backgroundColor */
        backgroundColor?: string;
        /** @name CommonIndicator.baseValue */
        baseValue?: number;
        /** @name CommonIndicator.beginAdaptingAtRadius */
        beginAdaptingAtRadius?: number;
        /** @name CommonIndicator.color */
        color?: string;
        /** @name CommonIndicator.horizontalOrientation */
        horizontalOrientation?: 'left' | 'right';
        /** @name CommonIndicator.indentFromCenter */
        indentFromCenter?: number;
        /** @name CommonIndicator.length */
        length?: number;
        /** @name CommonIndicator.offset */
        offset?: number;
        /** @name CommonIndicator.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name CommonIndicator.secondColor */
        secondColor?: string;
        /** @name CommonIndicator.secondFraction */
        secondFraction?: number;
        /** @name CommonIndicator.size */
        size?: number;
        /** @name CommonIndicator.spindleGapSize */
        spindleGapSize?: number;
        /** @name CommonIndicator.spindleSize */
        spindleSize?: number;
        /** @name CommonIndicator.text */
        text?: { customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number };
        /** @name CommonIndicator.verticalOrientation */
        verticalOrientation?: 'bottom' | 'top';
        /** @name CommonIndicator.width */
        width?: number;
    }
    /** @name Font */
    export interface Font {
        /** @name Font.color */
        color?: string;
        /** @name Font.family */
        family?: string;
        /** @name Font.opacity */
        opacity?: number;
        /** @name Font.size */
        size?: string | number;
        /** @name Font.weight */
        weight?: number;
    }
    /** @name FunnelLegendItem */
    export interface FunnelLegendItem extends BaseLegendItem {
        /** @name FunnelLegendItem.item */
        item?: dxFunnelItem;
    }
    /** @name GaugeIndicator */
    export interface GaugeIndicator extends CommonIndicator {
        /** @name GaugeIndicator.type */
        type?: 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';
    }
    /** @name MapLayer */
    export class MapLayer {
        /** @name MapLayer.elementType */
        elementType: string;
        /** @name MapLayer.index */
        index: number;
        /** @name MapLayer.name */
        name: string;
        /** @name MapLayer.type */
        type: string;
        /** @name MapLayer.clearSelection() */
        clearSelection(): void;
        /** @name MapLayer.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name MapLayer.getElements() */
        getElements(): Array<MapLayerElement>;
    }
    /** @name MapLayerElement */
    export class MapLayerElement {
        /** @name MapLayerElement.layer */
        layer: any;
        /** @name MapLayerElement.applySettings(settings) */
        applySettings(settings: any): void;
        /** @name MapLayerElement.attribute(name) */
        attribute(name: string): any;
        /** @name MapLayerElement.attribute(name, value) */
        attribute(name: string, value: any): void;
        /** @name MapLayerElement.coordinates() */
        coordinates(): any;
        /** @name MapLayerElement.selected() */
        selected(): boolean;
        /** @name MapLayerElement.selected(state) */
        selected(state: boolean): void;
    }
    /** @name PieChartLegendItem */
    export interface PieChartLegendItem extends BaseLegendItem {
        /** @name PieChartLegendItem.argument */
        argument?: string | Date | number;
        /** @name PieChartLegendItem.argumentIndex */
        argumentIndex?: number;
        /** @name PieChartLegendItem.points */
        points?: Array<piePointObject>;
        /** @name PieChartLegendItem.text */
        text?: any;
    }
    /** @name PieChartSeries */
    export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
        /** @name PieChartSeries.name */
        name?: string;
        /** @name PieChartSeries.tag */
        tag?: any;
    }
    /** @name PolarChartSeries */
    export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name PolarChartSeries.name */
        name?: string;
        /** @name PolarChartSeries.tag */
        tag?: any;
        /** @name PolarChartSeries.type */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /** @name ScaleBreak */
    export interface ScaleBreak {
        /** @name ScaleBreak.endValue */
        endValue?: number | Date | string;
        /** @name ScaleBreak.startValue */
        startValue?: number | Date | string;
    }
    /** @name VectorMapLegendItem */
    export interface VectorMapLegendItem extends BaseLegendItem {
        /** @name VectorMapLegendItem.color */
        color?: string;
        /** @name VectorMapLegendItem.end */
        end?: number;
        /** @name VectorMapLegendItem.size */
        size?: number;
        /** @name VectorMapLegendItem.start */
        start?: number;
    }
    /** @name VectorMapProjectionConfig */
    export interface VectorMapProjectionConfig {
        /** @name VectorMapProjectionConfig.aspectRatio */
        aspectRatio?: number;
        /** @name VectorMapProjectionConfig.from */
        from?: ((coordinates: Array<number>) => Array<number>);
        /** @name VectorMapProjectionConfig.to */
        to?: ((coordinates: Array<number>) => Array<number>);
    }
    /** @name VizRange */
    export interface VizRange {
        /** @name VizRange.endValue */
        endValue?: number | Date | string;
        /** @name VizRange.length */
        length?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name VizRange.startValue */
        startValue?: number | Date | string;
    }
    /** @name VizTimeInterval */
    export type VizTimeInterval = number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /** @name baseLabelObject */
    export class baseLabelObject {
        /** @name baseLabelObject.getBoundingRect() */
        getBoundingRect(): any;
        /** @name baseLabelObject.hide() */
        hide(): void;
        /** @name baseLabelObject.hide(holdInvisible) */
        hide(holdInvisible: boolean): void;
        /** @name baseLabelObject.isVisible() */
        isVisible(): boolean;
        /** @name baseLabelObject.show() */
        show(): void;
        /** @name baseLabelObject.show(holdVisible) */
        show(holdVisible: boolean): void;
    }
    /** @name basePointObject */
    export class basePointObject {
        /** @name basePointObject.data */
        data: any;
        /** @name basePointObject.fullState */
        fullState: number;
        /** @name basePointObject.originalArgument */
        originalArgument: string | number | Date;
        /** @name basePointObject.originalValue */
        originalValue: string | number | Date;
        /** @name basePointObject.series */
        series: any;
        /** @name basePointObject.tag */
        tag: any;
        /** @name basePointObject.clearHover() */
        clearHover(): void;
        /** @name basePointObject.clearSelection() */
        clearSelection(): void;
        /** @name basePointObject.getColor() */
        getColor(): string;
        /** @name basePointObject.getLabel() */
        getLabel(): baseLabelObject & Array<baseLabelObject>;
        /** @name basePointObject.hideTooltip() */
        hideTooltip(): void;
        /** @name basePointObject.hover() */
        hover(): void;
        /** @name basePointObject.isHovered() */
        isHovered(): boolean;
        /** @name basePointObject.isSelected() */
        isSelected(): boolean;
        /** @name basePointObject.select() */
        select(): void;
        /** @name basePointObject.showTooltip() */
        showTooltip(): void;
    }
    /** @name baseSeriesObject */
    export class baseSeriesObject {
        /** @name baseSeriesObject.fullState */
        fullState: number;
        /** @name baseSeriesObject.name */
        name: any;
        /** @name baseSeriesObject.tag */
        tag: any;
        /** @name baseSeriesObject.type */
        type: string;
        /** @name baseSeriesObject.clearHover() */
        clearHover(): void;
        /** @name baseSeriesObject.clearSelection() */
        clearSelection(): void;
        /** @name baseSeriesObject.deselectPoint(point) */
        deselectPoint(point: basePointObject): void;
        /** @name baseSeriesObject.getAllPoints() */
        getAllPoints(): Array<basePointObject>;
        /** @name baseSeriesObject.getColor() */
        getColor(): string;
        /** @name baseSeriesObject.getPointByPos(positionIndex) */
        getPointByPos(positionIndex: number): basePointObject;
        /** @name baseSeriesObject.getPointsByArg(pointArg) */
        getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
        /** @name baseSeriesObject.getVisiblePoints() */
        getVisiblePoints(): Array<basePointObject>;
        /** @name baseSeriesObject.hide() */
        hide(): void;
        /** @name baseSeriesObject.hover() */
        hover(): void;
        /** @name baseSeriesObject.isHovered() */
        isHovered(): boolean;
        /** @name baseSeriesObject.isSelected() */
        isSelected(): boolean;
        /** @name baseSeriesObject.isVisible() */
        isVisible(): boolean;
        /** @name baseSeriesObject.select() */
        select(): void;
        /** @name baseSeriesObject.selectPoint(point) */
        selectPoint(point: basePointObject): void;
        /** @name baseSeriesObject.show() */
        show(): void;
    }
    /** @name chartAxisObject */
    export class chartAxisObject {
        /** @name chartAxisObject.visualRange() */
        visualRange(): VizRange;
        /** @name chartAxisObject.visualRange(visualRange) */
        visualRange(visualRange: Array<number | string | Date> | VizRange): void;
    }
    /** @name chartPointAggregationInfoObject */
    export interface chartPointAggregationInfoObject {
        /** @name chartPointAggregationInfoObject.aggregationInterval */
        aggregationInterval?: any;
        /** @name chartPointAggregationInfoObject.data */
        data?: Array<any>;
        /** @name chartPointAggregationInfoObject.intervalEnd */
        intervalEnd?: any;
        /** @name chartPointAggregationInfoObject.intervalStart */
        intervalStart?: any;
    }
    /** @name chartPointObject */
    export class chartPointObject extends basePointObject {
        /** @name chartPointObject.aggregationInfo */
        aggregationInfo: chartPointAggregationInfoObject;
        /** @name chartPointObject.originalCloseValue */
        originalCloseValue: number | string;
        /** @name chartPointObject.originalHighValue */
        originalHighValue: number | string;
        /** @name chartPointObject.originalLowValue */
        originalLowValue: number | string;
        /** @name chartPointObject.originalMinValue */
        originalMinValue: string | number | Date;
        /** @name chartPointObject.originalOpenValue */
        originalOpenValue: number | string;
        /** @name chartPointObject.size */
        size: number | string;
        /** @name chartPointObject.getBoundingRect() */
        getBoundingRect(): any;
    }
    /** @name chartSeriesObject */
    export class chartSeriesObject extends baseSeriesObject {
        /** @name chartSeriesObject.axis */
        axis: string;
        /** @name chartSeriesObject.barOverlapGroup */
        barOverlapGroup: string;
        /** @name chartSeriesObject.pane */
        pane: string;
        /** @name chartSeriesObject.stack */
        stack: string;
        /** @name chartSeriesObject.getArgumentAxis() */
        getArgumentAxis(): chartAxisObject;
        /** @name chartSeriesObject.getValueAxis() */
        getValueAxis(): chartAxisObject;
    }
    /** @name circularRangeBar */
    export type circularRangeBar = CommonIndicator;
    /** @name circularRectangleNeedle */
    export type circularRectangleNeedle = CommonIndicator;
    /** @name circularTextCloud */
    export type circularTextCloud = CommonIndicator;
    /** @name circularTriangleMarker */
    export type circularTriangleMarker = CommonIndicator;
    /** @name circularTriangleNeedle */
    export type circularTriangleNeedle = CommonIndicator;
    /** @name circularTwoColorNeedle */
    export type circularTwoColorNeedle = CommonIndicator;
    /** @name dxBarGauge.Options */
    export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
        /** @name dxBarGauge.Options.animation */
        animation?: any;
        /** @name dxBarGauge.Options.backgroundColor */
        backgroundColor?: string;
        /** @name dxBarGauge.Options.barSpacing */
        barSpacing?: number;
        /** @name dxBarGauge.Options.baseValue */
        baseValue?: number;
        /** @name dxBarGauge.Options.endValue */
        endValue?: number;
        /** @name dxBarGauge.Options.geometry */
        geometry?: { endAngle?: number, startAngle?: number };
        /** @name dxBarGauge.Options.label */
        label?: { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number, visible?: boolean };
        /** @name dxBarGauge.Options.legend */
        legend?: dxBarGaugeLegend;
        /** @name dxBarGauge.Options.loadingIndicator */
        loadingIndicator?: dxBarGaugeLoadingIndicator;
        /** @name dxBarGauge.Options.onTooltipHidden */
        onTooltipHidden?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** @name dxBarGauge.Options.onTooltipShown */
        onTooltipShown?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** @name dxBarGauge.Options.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name dxBarGauge.Options.paletteExtensionMode */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** @name dxBarGauge.Options.relativeInnerRadius */
        relativeInnerRadius?: number;
        /** @name dxBarGauge.Options.resolveLabelOverlapping */
        resolveLabelOverlapping?: 'hide' | 'none';
        /** @name dxBarGauge.Options.startValue */
        startValue?: number;
        /** @name dxBarGauge.Options.tooltip */
        tooltip?: dxBarGaugeTooltip;
        /** @name dxBarGauge.Options.values */
        values?: Array<number>;
    }
    /** @name dxBarGauge.Options.legend */
    export interface dxBarGaugeLegend extends BaseLegend {
        /** @name dxBarGauge.Options.legend.customizeHint */
        customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /** @name dxBarGauge.Options.legend.customizeItems */
        customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
        /** @name dxBarGauge.Options.legend.customizeText */
        customizeText?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /** @name dxBarGauge.Options.legend.itemTextFormat */
        itemTextFormat?: DevExpress.ui.format;
        /** @name dxBarGauge.Options.legend.markerTemplate */
        markerTemplate?: DevExpress.core.template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /** @name dxBarGauge.Options.legend.visible */
        visible?: boolean;
    }
    /** @name dxBarGauge.Options.loadingIndicator */
    export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /** @name dxBarGauge.Options.tooltip */
    export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
        /** @name dxBarGauge.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxBarGauge.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
    }
    /** @name dxBarGauge */
    export class dxBarGauge extends BaseWidget {
        constructor(element: Element, options?: dxBarGaugeOptions)
        constructor(element: JQuery, options?: dxBarGaugeOptions)
        /** @name dxBarGauge.values() */
        values(): Array<number>;
        /** @name dxBarGauge.values(newValues) */
        values(values: Array<number>): void;
    }
    /** @name dxBullet.Options */
    export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
        /** @name dxBullet.Options.color */
        color?: string;
        /** @name dxBullet.Options.endScaleValue */
        endScaleValue?: number;
        /** @name dxBullet.Options.showTarget */
        showTarget?: boolean;
        /** @name dxBullet.Options.showZeroLevel */
        showZeroLevel?: boolean;
        /** @name dxBullet.Options.startScaleValue */
        startScaleValue?: number;
        /** @name dxBullet.Options.target */
        target?: number;
        /** @name dxBullet.Options.targetColor */
        targetColor?: string;
        /** @name dxBullet.Options.targetWidth */
        targetWidth?: number;
        /** @name dxBullet.Options.value */
        value?: number;
    }
    /** @name dxBullet */
    export class dxBullet extends BaseSparkline {
        constructor(element: Element, options?: dxBulletOptions)
        constructor(element: JQuery, options?: dxBulletOptions)
    }
    /** @name dxChart.Options */
    export interface dxChartOptions extends BaseChartOptions<dxChart> {
        /** @name dxChart.Options.adjustOnZoom */
        adjustOnZoom?: boolean;
        /** @name dxChart.Options.annotations */
        annotations?: Array<dxChartAnnotationConfig | any>;
        /** @name dxChart.Options.argumentAxis */
        argumentAxis?: dxChartArgumentAxis;
        /** @name dxChart.Options.autoHidePointMarkers */
        autoHidePointMarkers?: boolean;
        /** @name dxChart.Options.barGroupPadding */
        barGroupPadding?: number;
        /** @name dxChart.Options.barGroupWidth */
        barGroupWidth?: number;
        /** @deprecated */
        /** @name dxChart.Options.barWidth */
        barWidth?: number;
        /** @name dxChart.Options.commonAnnotationSettings */
        commonAnnotationSettings?: dxChartCommonAnnotationConfig;
        /** @name dxChart.Options.commonAxisSettings */
        commonAxisSettings?: dxChartCommonAxisSettings;
        /** @name dxChart.Options.commonPaneSettings */
        commonPaneSettings?: dxChartCommonPaneSettings;
        /** @name dxChart.Options.commonSeriesSettings */
        commonSeriesSettings?: dxChartCommonSeriesSettings;
        /** @name dxChart.Options.containerBackgroundColor */
        containerBackgroundColor?: string;
        /** @name dxChart.Options.crosshair */
        crosshair?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', enabled?: boolean, horizontalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, verticalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, width?: number };
        /** @name dxChart.Options.customizeAnnotation */
        customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
        /** @name dxChart.Options.dataPrepareSettings */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) };
        /** @name dxChart.Options.defaultPane */
        defaultPane?: string;
        /** @deprecated */
        /** @name dxChart.Options.equalBarWidth */
        equalBarWidth?: boolean;
        /** @name dxChart.Options.legend */
        legend?: dxChartLegend;
        /** @name dxChart.Options.maxBubbleSize */
        maxBubbleSize?: number;
        /** @name dxChart.Options.minBubbleSize */
        minBubbleSize?: number;
        /** @name dxChart.Options.negativesAsZeroes */
        negativesAsZeroes?: boolean;
        /** @name dxChart.Options.onArgumentAxisClick */
        onArgumentAxisClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
        /** @name dxChart.Options.onLegendClick */
        onLegendClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
        /** @name dxChart.Options.onSeriesClick */
        onSeriesClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
        /** @name dxChart.Options.onSeriesHoverChanged */
        onSeriesHoverChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /** @name dxChart.Options.onSeriesSelectionChanged */
        onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /** @name dxChart.Options.onZoomEnd */
        onZoomEnd?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: event, rangeStart?: Date | number, rangeEnd?: Date | number, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /** @name dxChart.Options.onZoomStart */
        onZoomStart?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /** @name dxChart.Options.panes */
        panes?: dxChartPanes | Array<dxChartPanes>;
        /** @name dxChart.Options.resizePanesOnZoom */
        resizePanesOnZoom?: boolean;
        /** @name dxChart.Options.resolveLabelOverlapping */
        resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
        /** @name dxChart.Options.rotated */
        rotated?: boolean;
        /** @name dxChart.Options.scrollBar */
        scrollBar?: { color?: string, offset?: number, opacity?: number, position?: 'bottom' | 'left' | 'right' | 'top', visible?: boolean, width?: number };
        /** @deprecated */
        /** @name dxChart.Options.scrollingMode */
        scrollingMode?: 'all' | 'mouse' | 'none' | 'touch';
        /** @name dxChart.Options.series */
        series?: ChartSeries | Array<ChartSeries>;
        /** @name dxChart.Options.seriesSelectionMode */
        seriesSelectionMode?: 'multiple' | 'single';
        /** @name dxChart.Options.seriesTemplate */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string };
        /** @name dxChart.Options.stickyHovering */
        stickyHovering?: boolean;
        /** @name dxChart.Options.synchronizeMultiAxes */
        synchronizeMultiAxes?: boolean;
        /** @name dxChart.Options.tooltip */
        tooltip?: dxChartTooltip;
        /** @deprecated */
        /** @name dxChart.Options.useAggregation */
        useAggregation?: boolean;
        /** @name dxChart.Options.valueAxis */
        valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
        /** @name dxChart.Options.zoomAndPan */
        zoomAndPan?: { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: 'both' | 'none' | 'pan' | 'zoom', dragBoxStyle?: { color?: string, opacity?: number }, dragToZoom?: boolean, panKey?: 'alt' | 'ctrl' | 'meta' | 'shift', valueAxis?: 'both' | 'none' | 'pan' | 'zoom' };
        /** @deprecated */
        /** @name dxChart.Options.zoomingMode */
        zoomingMode?: 'all' | 'mouse' | 'none' | 'touch';
    }
    /** @name dxChart.Options.argumentAxis */
    export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
        /** @name dxChart.Options.argumentAxis.aggregateByCategory */
        aggregateByCategory?: boolean;
        /** @name dxChart.Options.argumentAxis.aggregationGroupWidth */
        aggregationGroupWidth?: number;
        /** @name dxChart.Options.argumentAxis.aggregationInterval */
        aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.argumentAxis.argumentType */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** @name dxChart.Options.argumentAxis.axisDivisionFactor */
        axisDivisionFactor?: number;
        /** @name dxChart.Options.argumentAxis.breaks */
        breaks?: Array<ScaleBreak>;
        /** @name dxChart.Options.argumentAxis.categories */
        categories?: Array<number | string | Date>;
        /** @name dxChart.Options.argumentAxis.constantLineStyle */
        constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
        /** @name dxChart.Options.argumentAxis.constantLines */
        constantLines?: Array<dxChartArgumentAxisConstantLines>;
        /** @name dxChart.Options.argumentAxis.endOnTick */
        endOnTick?: boolean;
        /** @name dxChart.Options.argumentAxis.holidays */
        holidays?: Array<Date | string> | Array<number>;
        /** @name dxChart.Options.argumentAxis.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'none';
        /** @name dxChart.Options.argumentAxis.label */
        label?: dxChartArgumentAxisLabel;
        /** @name dxChart.Options.argumentAxis.linearThreshold */
        linearThreshold?: number;
        /** @name dxChart.Options.argumentAxis.logarithmBase */
        logarithmBase?: number;
        /** @deprecated */
        /** @name dxChart.Options.argumentAxis.max */
        max?: number | Date | string;
        /** @deprecated */
        /** @name dxChart.Options.argumentAxis.min */
        min?: number | Date | string;
        /** @name dxChart.Options.argumentAxis.minVisualRangeLength */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.argumentAxis.minorTickCount */
        minorTickCount?: number;
        /** @name dxChart.Options.argumentAxis.minorTickInterval */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.argumentAxis.position */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /** @name dxChart.Options.argumentAxis.singleWorkdays */
        singleWorkdays?: Array<Date | string> | Array<number>;
        /** @name dxChart.Options.argumentAxis.strips */
        strips?: Array<dxChartArgumentAxisStrips>;
        /** @name dxChart.Options.argumentAxis.tickInterval */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.argumentAxis.title */
        title?: dxChartArgumentAxisTitle;
        /** @name dxChart.Options.argumentAxis.type */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** @name dxChart.Options.argumentAxis.visualRange */
        visualRange?: VizRange | Array<number | string | Date>;
        /** @name dxChart.Options.argumentAxis.visualRangeUpdateMode */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /** @name dxChart.Options.argumentAxis.wholeRange */
        wholeRange?: VizRange | Array<number | string | Date>;
        /** @name dxChart.Options.argumentAxis.workWeek */
        workWeek?: Array<number>;
        /** @name dxChart.Options.argumentAxis.workdaysOnly */
        workdaysOnly?: boolean;
    }
    /** @name dxChart.Options.argumentAxis.constantLineStyle */
    export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /** @name dxChart.Options.argumentAxis.constantLineStyle.label */
        label?: dxChartArgumentAxisConstantLineStyleLabel;
    }
    /** @name dxChart.Options.argumentAxis.constantLineStyle.label */
    export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxChart.Options.argumentAxis.constantLineStyle.label.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.argumentAxis.constantLineStyle.label.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** @name dxChart.Options.argumentAxis.constantLines */
    export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /** @name dxChart.Options.argumentAxis.constantLines.displayBehindSeries */
        displayBehindSeries?: boolean;
        /** @name dxChart.Options.argumentAxis.constantLines.extendAxis */
        extendAxis?: boolean;
        /** @name dxChart.Options.argumentAxis.constantLines.label */
        label?: dxChartArgumentAxisConstantLinesLabel;
        /** @name dxChart.Options.argumentAxis.constantLines.value */
        value?: number | Date | string;
    }
    /** @name dxChart.Options.argumentAxis.constantLines.label */
    export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxChart.Options.argumentAxis.constantLines.label.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.argumentAxis.constantLines.label.text */
        text?: string;
        /** @name dxChart.Options.argumentAxis.constantLines.label.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** @name dxChart.Options.argumentAxis.label */
    export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
        /** @name dxChart.Options.argumentAxis.label.customizeHint */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxChart.Options.argumentAxis.label.customizeText */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxChart.Options.argumentAxis.label.format */
        format?: DevExpress.ui.format;
    }
    /** @name dxChart.Options.argumentAxis.strips */
    export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /** @name dxChart.Options.argumentAxis.strips.color */
        color?: string;
        /** @name dxChart.Options.argumentAxis.strips.endValue */
        endValue?: number | Date | string;
        /** @name dxChart.Options.argumentAxis.strips.label */
        label?: dxChartArgumentAxisStripsLabel;
        /** @name dxChart.Options.argumentAxis.strips.startValue */
        startValue?: number | Date | string;
    }
    /** @name dxChart.Options.argumentAxis.strips.label */
    export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /** @name dxChart.Options.argumentAxis.strips.label.text */
        text?: string;
    }
    /** @name dxChart.Options.argumentAxis.title */
    export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
        /** @name dxChart.Options.argumentAxis.title.text */
        text?: string;
    }
    /** @name dxChart.Options.commonAxisSettings */
    export interface dxChartCommonAxisSettings {
        /** @name dxChart.Options.commonAxisSettings.allowDecimals */
        allowDecimals?: boolean;
        /** @name dxChart.Options.commonAxisSettings.breakStyle */
        breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number };
        /** @name dxChart.Options.commonAxisSettings.color */
        color?: string;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle */
        constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
        /** @name dxChart.Options.commonAxisSettings.discreteAxisDivisionMode */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /** @name dxChart.Options.commonAxisSettings.endOnTick */
        endOnTick?: boolean;
        /** @name dxChart.Options.commonAxisSettings.grid */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /** @name dxChart.Options.commonAxisSettings.inverted */
        inverted?: boolean;
        /** @name dxChart.Options.commonAxisSettings.label */
        label?: dxChartCommonAxisSettingsLabel;
        /** @name dxChart.Options.commonAxisSettings.maxValueMargin */
        maxValueMargin?: number;
        /** @name dxChart.Options.commonAxisSettings.minValueMargin */
        minValueMargin?: number;
        /** @name dxChart.Options.commonAxisSettings.minorGrid */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /** @name dxChart.Options.commonAxisSettings.minorTick */
        minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /** @name dxChart.Options.commonAxisSettings.opacity */
        opacity?: number;
        /** @name dxChart.Options.commonAxisSettings.placeholderSize */
        placeholderSize?: number;
        /** @name dxChart.Options.commonAxisSettings.stripStyle */
        stripStyle?: dxChartCommonAxisSettingsStripStyle;
        /** @name dxChart.Options.commonAxisSettings.tick */
        tick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /** @name dxChart.Options.commonAxisSettings.title */
        title?: dxChartCommonAxisSettingsTitle;
        /** @name dxChart.Options.commonAxisSettings.valueMarginsEnabled */
        valueMarginsEnabled?: boolean;
        /** @name dxChart.Options.commonAxisSettings.visible */
        visible?: boolean;
        /** @name dxChart.Options.commonAxisSettings.width */
        width?: number;
    }
    /** @name dxChart.Options.commonAxisSettings.constantLineStyle */
    export interface dxChartCommonAxisSettingsConstantLineStyle {
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.color */
        color?: string;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.label */
        label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.paddingLeftRight */
        paddingLeftRight?: number;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.paddingTopBottom */
        paddingTopBottom?: number;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.width */
        width?: number;
    }
    /** @name dxChart.Options.commonAxisSettings.constantLineStyle.label */
    export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.label.font */
        font?: Font;
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.label.position */
        position?: 'inside' | 'outside';
        /** @name dxChart.Options.commonAxisSettings.constantLineStyle.label.visible */
        visible?: boolean;
    }
    /** @name dxChart.Options.commonAxisSettings.label */
    export interface dxChartCommonAxisSettingsLabel {
        /** @name dxChart.Options.commonAxisSettings.label.alignment */
        alignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.commonAxisSettings.label.displayMode */
        displayMode?: 'rotate' | 'stagger' | 'standard';
        /** @name dxChart.Options.commonAxisSettings.label.font */
        font?: Font;
        /** @name dxChart.Options.commonAxisSettings.label.indentFromAxis */
        indentFromAxis?: number;
        /** @name dxChart.Options.commonAxisSettings.label.overlappingBehavior */
        overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
        /** @name dxChart.Options.commonAxisSettings.label.rotationAngle */
        rotationAngle?: number;
        /** @name dxChart.Options.commonAxisSettings.label.staggeringSpacing */
        staggeringSpacing?: number;
        /** @name dxChart.Options.commonAxisSettings.label.textOverflow */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /** @name dxChart.Options.commonAxisSettings.label.visible */
        visible?: boolean;
        /** @name dxChart.Options.commonAxisSettings.label.wordWrap */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /** @name dxChart.Options.commonAxisSettings.stripStyle */
    export interface dxChartCommonAxisSettingsStripStyle {
        /** @name dxChart.Options.commonAxisSettings.stripStyle.label */
        label?: dxChartCommonAxisSettingsStripStyleLabel;
        /** @name dxChart.Options.commonAxisSettings.stripStyle.paddingLeftRight */
        paddingLeftRight?: number;
        /** @name dxChart.Options.commonAxisSettings.stripStyle.paddingTopBottom */
        paddingTopBottom?: number;
    }
    /** @name dxChart.Options.commonAxisSettings.stripStyle.label */
    export interface dxChartCommonAxisSettingsStripStyleLabel {
        /** @name dxChart.Options.commonAxisSettings.stripStyle.label.font */
        font?: Font;
        /** @name dxChart.Options.commonAxisSettings.stripStyle.label.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.commonAxisSettings.stripStyle.label.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** @name dxChart.Options.commonAxisSettings.title */
    export interface dxChartCommonAxisSettingsTitle {
        /** @name dxChart.Options.commonAxisSettings.title.alignment */
        alignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.commonAxisSettings.title.font */
        font?: Font;
        /** @name dxChart.Options.commonAxisSettings.title.margin */
        margin?: number;
        /** @name dxChart.Options.commonAxisSettings.title.textOverflow */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /** @name dxChart.Options.commonAxisSettings.title.wordWrap */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /** @name dxChart.Options.commonPaneSettings */
    export interface dxChartCommonPaneSettings {
        /** @name dxChart.Options.commonPaneSettings.backgroundColor */
        backgroundColor?: string;
        /** @name dxChart.Options.commonPaneSettings.border */
        border?: { bottom?: boolean, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', left?: boolean, opacity?: number, right?: boolean, top?: boolean, visible?: boolean, width?: number };
    }
    /** @name dxChart.Options.commonSeriesSettings */
    export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
        /** @name dxChart.Options.commonSeriesSettings.area */
        area?: any;
        /** @name dxChart.Options.commonSeriesSettings.bar */
        bar?: any;
        /** @name dxChart.Options.commonSeriesSettings.bubble */
        bubble?: any;
        /** @name dxChart.Options.commonSeriesSettings.candlestick */
        candlestick?: any;
        /** @name dxChart.Options.commonSeriesSettings.fullstackedarea */
        fullstackedarea?: any;
        /** @name dxChart.Options.commonSeriesSettings.fullstackedbar */
        fullstackedbar?: any;
        /** @name dxChart.Options.commonSeriesSettings.fullstackedline */
        fullstackedline?: any;
        /** @name dxChart.Options.commonSeriesSettings.fullstackedspline */
        fullstackedspline?: any;
        /** @name dxChart.Options.commonSeriesSettings.fullstackedsplinearea */
        fullstackedsplinearea?: any;
        /** @name dxChart.Options.commonSeriesSettings.line */
        line?: any;
        /** @name dxChart.Options.commonSeriesSettings.rangearea */
        rangearea?: any;
        /** @name dxChart.Options.commonSeriesSettings.rangebar */
        rangebar?: any;
        /** @name dxChart.Options.commonSeriesSettings.scatter */
        scatter?: any;
        /** @name dxChart.Options.commonSeriesSettings.spline */
        spline?: any;
        /** @name dxChart.Options.commonSeriesSettings.splinearea */
        splinearea?: any;
        /** @name dxChart.Options.commonSeriesSettings.stackedarea */
        stackedarea?: any;
        /** @name dxChart.Options.commonSeriesSettings.stackedbar */
        stackedbar?: any;
        /** @name dxChart.Options.commonSeriesSettings.stackedline */
        stackedline?: any;
        /** @name dxChart.Options.commonSeriesSettings.stackedspline */
        stackedspline?: any;
        /** @name dxChart.Options.commonSeriesSettings.stackedsplinearea */
        stackedsplinearea?: any;
        /** @name dxChart.Options.commonSeriesSettings.steparea */
        steparea?: any;
        /** @name dxChart.Options.commonSeriesSettings.stepline */
        stepline?: any;
        /** @name dxChart.Options.commonSeriesSettings.stock */
        stock?: any;
        /** @name dxChart.Options.commonSeriesSettings.type */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /** @name dxChart.Options.legend */
    export interface dxChartLegend extends BaseChartLegend {
        /** @name dxChart.Options.legend.customizeHint */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** @name dxChart.Options.legend.customizeText */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** @name dxChart.Options.legend.hoverMode */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
        /** @name dxChart.Options.legend.position */
        position?: 'inside' | 'outside';
    }
    /** @name dxChart.Options.panes */
    export interface dxChartPanes extends dxChartCommonPaneSettings {
        /** @name dxChart.Options.panes.height */
        height?: number | string;
        /** @name dxChart.Options.panes.name */
        name?: string;
    }
    /** @name dxChart.Options.tooltip */
    export interface dxChartTooltip extends BaseChartTooltip {
        /** @name dxChart.Options.tooltip.location */
        location?: 'center' | 'edge';
    }
    /** @name dxChart.Options.valueAxis */
    export interface dxChartValueAxis extends dxChartCommonAxisSettings {
        /** @name dxChart.Options.valueAxis.autoBreaksEnabled */
        autoBreaksEnabled?: boolean;
        /** @name dxChart.Options.valueAxis.axisDivisionFactor */
        axisDivisionFactor?: number;
        /** @name dxChart.Options.valueAxis.breaks */
        breaks?: Array<ScaleBreak>;
        /** @name dxChart.Options.valueAxis.categories */
        categories?: Array<number | string | Date>;
        /** @name dxChart.Options.valueAxis.constantLineStyle */
        constantLineStyle?: dxChartValueAxisConstantLineStyle;
        /** @name dxChart.Options.valueAxis.constantLines */
        constantLines?: Array<dxChartValueAxisConstantLines>;
        /** @name dxChart.Options.valueAxis.endOnTick */
        endOnTick?: boolean;
        /** @name dxChart.Options.valueAxis.label */
        label?: dxChartValueAxisLabel;
        /** @name dxChart.Options.valueAxis.linearThreshold */
        linearThreshold?: number;
        /** @name dxChart.Options.valueAxis.logarithmBase */
        logarithmBase?: number;
        /** @deprecated */
        /** @name dxChart.Options.valueAxis.max */
        max?: number | Date | string;
        /** @name dxChart.Options.valueAxis.maxAutoBreakCount */
        maxAutoBreakCount?: number;
        /** @deprecated */
        /** @name dxChart.Options.valueAxis.min */
        min?: number | Date | string;
        /** @name dxChart.Options.valueAxis.minVisualRangeLength */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.valueAxis.minorTickCount */
        minorTickCount?: number;
        /** @name dxChart.Options.valueAxis.minorTickInterval */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.valueAxis.multipleAxesSpacing */
        multipleAxesSpacing?: number;
        /** @name dxChart.Options.valueAxis.name */
        name?: string;
        /** @name dxChart.Options.valueAxis.pane */
        pane?: string;
        /** @name dxChart.Options.valueAxis.position */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /** @name dxChart.Options.valueAxis.showZero */
        showZero?: boolean;
        /** @name dxChart.Options.valueAxis.strips */
        strips?: Array<dxChartValueAxisStrips>;
        /** @name dxChart.Options.valueAxis.synchronizedValue */
        synchronizedValue?: number;
        /** @name dxChart.Options.valueAxis.tickInterval */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxChart.Options.valueAxis.title */
        title?: dxChartValueAxisTitle;
        /** @name dxChart.Options.valueAxis.type */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** @name dxChart.Options.valueAxis.valueType */
        valueType?: 'datetime' | 'numeric' | 'string';
        /** @name dxChart.Options.valueAxis.visualRange */
        visualRange?: VizRange | Array<number | string | Date>;
        /** @name dxChart.Options.valueAxis.visualRangeUpdateMode */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /** @name dxChart.Options.valueAxis.wholeRange */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /** @name dxChart.Options.valueAxis.constantLineStyle */
    export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /** @name dxChart.Options.valueAxis.constantLineStyle.label */
        label?: dxChartValueAxisConstantLineStyleLabel;
    }
    /** @name dxChart.Options.valueAxis.constantLineStyle.label */
    export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxChart.Options.valueAxis.constantLineStyle.label.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.valueAxis.constantLineStyle.label.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** @name dxChart.Options.valueAxis.constantLines */
    export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /** @name dxChart.Options.valueAxis.constantLines.displayBehindSeries */
        displayBehindSeries?: boolean;
        /** @name dxChart.Options.valueAxis.constantLines.extendAxis */
        extendAxis?: boolean;
        /** @name dxChart.Options.valueAxis.constantLines.label */
        label?: dxChartValueAxisConstantLinesLabel;
        /** @name dxChart.Options.valueAxis.constantLines.value */
        value?: number | Date | string;
    }
    /** @name dxChart.Options.valueAxis.constantLines.label */
    export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxChart.Options.valueAxis.constantLines.label.horizontalAlignment */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** @name dxChart.Options.valueAxis.constantLines.label.text */
        text?: string;
        /** @name dxChart.Options.valueAxis.constantLines.label.verticalAlignment */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** @name dxChart.Options.valueAxis.label */
    export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
        /** @name dxChart.Options.valueAxis.label.customizeHint */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxChart.Options.valueAxis.label.customizeText */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxChart.Options.valueAxis.label.format */
        format?: DevExpress.ui.format;
    }
    /** @name dxChart.Options.valueAxis.strips */
    export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /** @name dxChart.Options.valueAxis.strips.color */
        color?: string;
        /** @name dxChart.Options.valueAxis.strips.endValue */
        endValue?: number | Date | string;
        /** @name dxChart.Options.valueAxis.strips.label */
        label?: dxChartValueAxisStripsLabel;
        /** @name dxChart.Options.valueAxis.strips.startValue */
        startValue?: number | Date | string;
    }
    /** @name dxChart.Options.valueAxis.strips.label */
    export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /** @name dxChart.Options.valueAxis.strips.label.text */
        text?: string;
    }
    /** @name dxChart.Options.valueAxis.title */
    export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
        /** @name dxChart.Options.valueAxis.title.text */
        text?: string;
    }
    /** @name dxChart */
    export class dxChart extends BaseChart {
        constructor(element: Element, options?: dxChartOptions)
        constructor(element: JQuery, options?: dxChartOptions)
        /** @name dxChart.getArgumentAxis() */
        getArgumentAxis(): chartAxisObject;
        /** @name dxChart.getValueAxis() */
        getValueAxis(): chartAxisObject;
        /** @name dxChart.getValueAxis(name) */
        getValueAxis(name: string): chartAxisObject;
        /** @name dxChart.resetVisualRange() */
        resetVisualRange(): void;
        /** @name dxChart.zoomArgument(startValue,endValue) */
        zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
    }
    /** @name dxChartAnnotationConfig */
    export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
        /** @name dxChartAnnotationConfig.name */
        name?: string;
    }
    /** @name dxChartCommonAnnotationConfig */
    export interface dxChartCommonAnnotationConfig {
        /** @name dxChartCommonAnnotationConfig.allowDragging */
        allowDragging?: boolean;
        /** @name dxChartCommonAnnotationConfig.argument */
        argument?: number | Date | string;
        /** @name dxChartCommonAnnotationConfig.arrowLength */
        arrowLength?: number;
        /** @name dxChartCommonAnnotationConfig.arrowWidth */
        arrowWidth?: number;
        /** @name dxChartCommonAnnotationConfig.axis */
        axis?: string;
        /** @name dxChartCommonAnnotationConfig.border */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /** @name dxChartCommonAnnotationConfig.color */
        color?: string;
        /** @name dxChartCommonAnnotationConfig.customizeTooltip */
        customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
        /** @name dxChartCommonAnnotationConfig.data */
        data?: any;
        /** @name dxChartCommonAnnotationConfig.description */
        description?: string;
        /** @name dxChartCommonAnnotationConfig.font */
        font?: Font;
        /** @name dxChartCommonAnnotationConfig.height */
        height?: number;
        /** @name dxChartCommonAnnotationConfig.image */
        image?: string | { height?: number, url?: string, width?: number };
        /** @name dxChartCommonAnnotationConfig.offsetX */
        offsetX?: number;
        /** @name dxChartCommonAnnotationConfig.offsetY */
        offsetY?: number;
        /** @name dxChartCommonAnnotationConfig.opacity */
        opacity?: number;
        /** @name dxChartCommonAnnotationConfig.paddingLeftRight */
        paddingLeftRight?: number;
        /** @name dxChartCommonAnnotationConfig.paddingTopBottom */
        paddingTopBottom?: number;
        /** @name dxChartCommonAnnotationConfig.series */
        series?: string;
        /** @name dxChartCommonAnnotationConfig.shadow */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /** @name dxChartCommonAnnotationConfig.template */
        template?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /** @name dxChartCommonAnnotationConfig.text */
        text?: string;
        /** @name dxChartCommonAnnotationConfig.textOverflow */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /** @name dxChartCommonAnnotationConfig.tooltipEnabled */
        tooltipEnabled?: boolean;
        /** @name dxChartCommonAnnotationConfig.tooltipTemplate */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxChartCommonAnnotationConfig.type */
        type?: 'text' | 'image' | 'custom';
        /** @name dxChartCommonAnnotationConfig.value */
        value?: number | Date | string;
        /** @name dxChartCommonAnnotationConfig.width */
        width?: number;
        /** @name dxChartCommonAnnotationConfig.wordWrap */
        wordWrap?: 'normal' | 'breakWord' | 'none';
        /** @name dxChartCommonAnnotationConfig.x */
        x?: number;
        /** @name dxChartCommonAnnotationConfig.y */
        y?: number;
    }
    /** @name dxChartSeriesTypes */
    interface dxChartSeriesTypes {
        /** @name dxChartSeriesTypes.AreaSeries */
        AreaSeries?: dxChartSeriesTypesAreaSeries;
        /** @name dxChartSeriesTypes.BarSeries */
        BarSeries?: dxChartSeriesTypesBarSeries;
        /** @name dxChartSeriesTypes.BubbleSeries */
        BubbleSeries?: dxChartSeriesTypesBubbleSeries;
        /** @name dxChartSeriesTypes.CandleStickSeries */
        CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
        /** @name dxChartSeriesTypes.CommonSeries */
        CommonSeries?: dxChartSeriesTypesCommonSeries;
        /** @name dxChartSeriesTypes.FullStackedAreaSeries */
        FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
        /** @name dxChartSeriesTypes.FullStackedBarSeries */
        FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
        /** @name dxChartSeriesTypes.FullStackedLineSeries */
        FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries */
        FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
        /** @name dxChartSeriesTypes.FullStackedSplineSeries */
        FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
        /** @name dxChartSeriesTypes.LineSeries */
        LineSeries?: dxChartSeriesTypesLineSeries;
        /** @name dxChartSeriesTypes.RangeAreaSeries */
        RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
        /** @name dxChartSeriesTypes.RangeBarSeries */
        RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
        /** @name dxChartSeriesTypes.ScatterSeries */
        ScatterSeries?: dxChartSeriesTypesScatterSeries;
        /** @name dxChartSeriesTypes.SplineAreaSeries */
        SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
        /** @name dxChartSeriesTypes.SplineSeries */
        SplineSeries?: dxChartSeriesTypesSplineSeries;
        /** @name dxChartSeriesTypes.StackedAreaSeries */
        StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
        /** @name dxChartSeriesTypes.StackedBarSeries */
        StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
        /** @name dxChartSeriesTypes.StackedLineSeries */
        StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries */
        StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
        /** @name dxChartSeriesTypes.StackedSplineSeries */
        StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
        /** @name dxChartSeriesTypes.StepAreaSeries */
        StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
        /** @name dxChartSeriesTypes.StepLineSeries */
        StepLineSeries?: dxChartSeriesTypesStepLineSeries;
        /** @name dxChartSeriesTypes.StockSeries */
        StockSeries?: dxChartSeriesTypesStockSeries;
    }
    /** @name dxChartSeriesTypes.AreaSeries */
    interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.AreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.AreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.AreaSeries.label */
        label?: dxChartSeriesTypesAreaSeriesLabel;
        /** @name dxChartSeriesTypes.AreaSeries.point */
        point?: dxChartSeriesTypesAreaSeriesPoint;
        /** @name dxChartSeriesTypes.AreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.AreaSeries.aggregation */
    interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.AreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.AreaSeries.label */
    interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.AreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.AreaSeries.point */
    interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.AreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.BarSeries */
    interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.BarSeries.aggregation */
        aggregation?: dxChartSeriesTypesBarSeriesAggregation;
        /** @name dxChartSeriesTypes.BarSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.BarSeries.label */
        label?: dxChartSeriesTypesBarSeriesLabel;
        /** @name dxChartSeriesTypes.BarSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.BarSeries.aggregation */
    interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.BarSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.BarSeries.label */
    interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.BarSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.BubbleSeries */
    interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.BubbleSeries.aggregation */
        aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
        /** @name dxChartSeriesTypes.BubbleSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.BubbleSeries.label */
        label?: dxChartSeriesTypesBubbleSeriesLabel;
        /** @name dxChartSeriesTypes.BubbleSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.BubbleSeries.aggregation */
    interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.BubbleSeries.aggregation.method */
        method?: 'avg' | 'custom';
    }
    /** @name dxChartSeriesTypes.BubbleSeries.label */
    interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.BubbleSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.CandleStickSeries */
    interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.CandleStickSeries.aggregation */
        aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
        /** @name dxChartSeriesTypes.CandleStickSeries.argumentField */
        argumentField?: string;
        /** @name dxChartSeriesTypes.CandleStickSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.CandleStickSeries.hoverStyle */
        hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
        /** @name dxChartSeriesTypes.CandleStickSeries.label */
        label?: dxChartSeriesTypesCandleStickSeriesLabel;
        /** @name dxChartSeriesTypes.CandleStickSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.CandleStickSeries.selectionStyle */
        selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.aggregation */
    interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.CandleStickSeries.aggregation.method */
        method?: 'ohlc' | 'custom';
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.hoverStyle */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /** @name dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching */
        hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /** @name dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction */
        direction?: 'left' | 'none' | 'right';
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.label */
    interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.CandleStickSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.selectionStyle */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** @name dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching */
        hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
    }
    /** @name dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /** @name dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction */
        direction?: 'left' | 'none' | 'right';
    }
    /** @name dxChartSeriesTypes.CommonSeries */
    interface dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.CommonSeries.aggregation */
        aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
        /** @name dxChartSeriesTypes.CommonSeries.argumentField */
        argumentField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.axis */
        axis?: string;
        /** @name dxChartSeriesTypes.CommonSeries.barOverlapGroup */
        barOverlapGroup?: string;
        /** @name dxChartSeriesTypes.CommonSeries.barPadding */
        barPadding?: number;
        /** @name dxChartSeriesTypes.CommonSeries.barWidth */
        barWidth?: number;
        /** @name dxChartSeriesTypes.CommonSeries.border */
        border?: dxChartSeriesTypesCommonSeriesBorder;
        /** @name dxChartSeriesTypes.CommonSeries.closeValueField */
        closeValueField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.cornerRadius */
        cornerRadius?: number;
        /** @name dxChartSeriesTypes.CommonSeries.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.highValueField */
        highValueField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle */
        hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
        /** @name dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints */
        ignoreEmptyPoints?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.innerColor */
        innerColor?: string;
        /** @name dxChartSeriesTypes.CommonSeries.label */
        label?: dxChartSeriesTypesCommonSeriesLabel;
        /** @name dxChartSeriesTypes.CommonSeries.lowValueField */
        lowValueField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.maxLabelCount */
        maxLabelCount?: number;
        /** @name dxChartSeriesTypes.CommonSeries.minBarSize */
        minBarSize?: number;
        /** @name dxChartSeriesTypes.CommonSeries.opacity */
        opacity?: number;
        /** @name dxChartSeriesTypes.CommonSeries.openValueField */
        openValueField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.pane */
        pane?: string;
        /** @name dxChartSeriesTypes.CommonSeries.point */
        point?: dxChartSeriesTypesCommonSeriesPoint;
        /** @name dxChartSeriesTypes.CommonSeries.rangeValue1Field */
        rangeValue1Field?: string;
        /** @name dxChartSeriesTypes.CommonSeries.rangeValue2Field */
        rangeValue2Field?: string;
        /** @name dxChartSeriesTypes.CommonSeries.reduction */
        reduction?: { color?: string, level?: 'close' | 'high' | 'low' | 'open' };
        /** @name dxChartSeriesTypes.CommonSeries.selectionMode */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle */
        selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
        /** @name dxChartSeriesTypes.CommonSeries.showInLegend */
        showInLegend?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.sizeField */
        sizeField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.stack */
        stack?: string;
        /** @name dxChartSeriesTypes.CommonSeries.tagField */
        tagField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.valueErrorBar */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /** @name dxChartSeriesTypes.CommonSeries.valueField */
        valueField?: string;
        /** @name dxChartSeriesTypes.CommonSeries.visible */
        visible?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.aggregation */
    interface dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.CommonSeries.aggregation.calculate */
        calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
        /** @name dxChartSeriesTypes.CommonSeries.aggregation.enabled */
        enabled?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.CommonSeries.border */
    interface dxChartSeriesTypesCommonSeriesBorder {
        /** @name dxChartSeriesTypes.CommonSeries.border.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.border.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.border.visible */
        visible?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.border.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.hoverStyle */
    interface dxChartSeriesTypesCommonSeriesHoverStyle {
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border */
        border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching */
        hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border */
    interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible */
        visible?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.border.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching */
    interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction */
        direction?: 'left' | 'none' | 'right';
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity */
        opacity?: number;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step */
        step?: number;
        /** @name dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.label */
    interface dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.CommonSeries.label.alignment */
        alignment?: 'center' | 'left' | 'right';
        /** @name dxChartSeriesTypes.CommonSeries.label.argumentFormat */
        argumentFormat?: DevExpress.ui.format;
        /** @name dxChartSeriesTypes.CommonSeries.label.backgroundColor */
        backgroundColor?: string;
        /** @name dxChartSeriesTypes.CommonSeries.label.border */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /** @name dxChartSeriesTypes.CommonSeries.label.connector */
        connector?: { color?: string, visible?: boolean, width?: number };
        /** @name dxChartSeriesTypes.CommonSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
        /** @name dxChartSeriesTypes.CommonSeries.label.font */
        font?: Font;
        /** @name dxChartSeriesTypes.CommonSeries.label.format */
        format?: DevExpress.ui.format;
        /** @name dxChartSeriesTypes.CommonSeries.label.horizontalOffset */
        horizontalOffset?: number;
        /** @name dxChartSeriesTypes.CommonSeries.label.position */
        position?: 'inside' | 'outside';
        /** @name dxChartSeriesTypes.CommonSeries.label.rotationAngle */
        rotationAngle?: number;
        /** @name dxChartSeriesTypes.CommonSeries.label.showForZeroValues */
        showForZeroValues?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.label.verticalOffset */
        verticalOffset?: number;
        /** @name dxChartSeriesTypes.CommonSeries.label.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.CommonSeries.point */
    interface dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.CommonSeries.point.border */
        border?: { color?: string, visible?: boolean, width?: number };
        /** @name dxChartSeriesTypes.CommonSeries.point.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.point.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** @name dxChartSeriesTypes.CommonSeries.point.hoverStyle */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /** @name dxChartSeriesTypes.CommonSeries.point.image */
        image?: string | { height?: number | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | { rangeMaxPoint?: number, rangeMinPoint?: number } };
        /** @name dxChartSeriesTypes.CommonSeries.point.selectionMode */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** @name dxChartSeriesTypes.CommonSeries.point.selectionStyle */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /** @name dxChartSeriesTypes.CommonSeries.point.size */
        size?: number;
        /** @name dxChartSeriesTypes.CommonSeries.point.symbol */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
        /** @name dxChartSeriesTypes.CommonSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.CommonSeries.selectionStyle */
    interface dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border */
        border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching */
        hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.color */
        color?: string;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible */
        visible?: boolean;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.border.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction */
        direction?: 'left' | 'none' | 'right';
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity */
        opacity?: number;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step */
        step?: number;
        /** @name dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width */
        width?: number;
    }
    /** @name dxChartSeriesTypes.FullStackedAreaSeries */
    interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.label */
        label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.point */
        point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.FullStackedAreaSeries.aggregation */
    interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.FullStackedAreaSeries.label */
    interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.FullStackedAreaSeries.point */
    interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.FullStackedAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.FullStackedBarSeries */
    interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.FullStackedBarSeries.aggregation */
        aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
        /** @name dxChartSeriesTypes.FullStackedBarSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.FullStackedBarSeries.label */
        label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
        /** @name dxChartSeriesTypes.FullStackedBarSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.FullStackedBarSeries.aggregation */
    interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.FullStackedBarSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.FullStackedBarSeries.label */
    interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.FullStackedBarSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
        /** @name dxChartSeriesTypes.FullStackedBarSeries.label.position */
        position?: 'inside' | 'outside';
    }
    /** @name dxChartSeriesTypes.FullStackedLineSeries */
    interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.FullStackedLineSeries.aggregation */
        aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
        /** @name dxChartSeriesTypes.FullStackedLineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.FullStackedLineSeries.label */
        label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
        /** @name dxChartSeriesTypes.FullStackedLineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.FullStackedLineSeries.aggregation */
    interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.FullStackedLineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.FullStackedLineSeries.label */
    interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.FullStackedLineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries */
    interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.label */
        label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.point */
        point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.label */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.point */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.FullStackedSplineSeries */
    interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.aggregation */
        aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.label */
        label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.FullStackedSplineSeries.aggregation */
    interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.FullStackedSplineSeries.label */
    interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.LineSeries */
    interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.LineSeries.aggregation */
        aggregation?: dxChartSeriesTypesLineSeriesAggregation;
        /** @name dxChartSeriesTypes.LineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.LineSeries.label */
        label?: dxChartSeriesTypesLineSeriesLabel;
        /** @name dxChartSeriesTypes.LineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.LineSeries.aggregation */
    interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.LineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.LineSeries.label */
    interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.LineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.RangeAreaSeries */
    interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.RangeAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.RangeAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.RangeAreaSeries.label */
        label?: dxChartSeriesTypesRangeAreaSeriesLabel;
        /** @name dxChartSeriesTypes.RangeAreaSeries.point */
        point?: dxChartSeriesTypesRangeAreaSeriesPoint;
        /** @name dxChartSeriesTypes.RangeAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.RangeAreaSeries.aggregation */
    interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.RangeAreaSeries.aggregation.method */
        method?: 'range' | 'custom';
    }
    /** @name dxChartSeriesTypes.RangeAreaSeries.label */
    interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.RangeAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.RangeAreaSeries.point */
    interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.RangeAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.RangeBarSeries */
    interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.RangeBarSeries.aggregation */
        aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
        /** @name dxChartSeriesTypes.RangeBarSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.RangeBarSeries.label */
        label?: dxChartSeriesTypesRangeBarSeriesLabel;
        /** @name dxChartSeriesTypes.RangeBarSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.RangeBarSeries.aggregation */
    interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.RangeBarSeries.aggregation.method */
        method?: 'range' | 'custom';
    }
    /** @name dxChartSeriesTypes.RangeBarSeries.label */
    interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.RangeBarSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.ScatterSeries */
    interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.ScatterSeries.aggregation */
        aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
        /** @name dxChartSeriesTypes.ScatterSeries.label */
        label?: dxChartSeriesTypesScatterSeriesLabel;
    }
    /** @name dxChartSeriesTypes.ScatterSeries.aggregation */
    interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.ScatterSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.ScatterSeries.label */
    interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.ScatterSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.SplineAreaSeries */
    interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.SplineAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.SplineAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.SplineAreaSeries.label */
        label?: dxChartSeriesTypesSplineAreaSeriesLabel;
        /** @name dxChartSeriesTypes.SplineAreaSeries.point */
        point?: dxChartSeriesTypesSplineAreaSeriesPoint;
        /** @name dxChartSeriesTypes.SplineAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.SplineAreaSeries.aggregation */
    interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.SplineAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.SplineAreaSeries.label */
    interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.SplineAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.SplineAreaSeries.point */
    interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.SplineAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.SplineSeries */
    interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.SplineSeries.aggregation */
        aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
        /** @name dxChartSeriesTypes.SplineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.SplineSeries.label */
        label?: dxChartSeriesTypesSplineSeriesLabel;
        /** @name dxChartSeriesTypes.SplineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.SplineSeries.aggregation */
    interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.SplineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.SplineSeries.label */
    interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.SplineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StackedAreaSeries */
    interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StackedAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.StackedAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StackedAreaSeries.label */
        label?: dxChartSeriesTypesStackedAreaSeriesLabel;
        /** @name dxChartSeriesTypes.StackedAreaSeries.point */
        point?: dxChartSeriesTypesStackedAreaSeriesPoint;
        /** @name dxChartSeriesTypes.StackedAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StackedAreaSeries.aggregation */
    interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StackedAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StackedAreaSeries.label */
    interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StackedAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StackedAreaSeries.point */
    interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.StackedAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StackedBarSeries */
    interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StackedBarSeries.aggregation */
        aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
        /** @name dxChartSeriesTypes.StackedBarSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.StackedBarSeries.label */
        label?: dxChartSeriesTypesStackedBarSeriesLabel;
        /** @name dxChartSeriesTypes.StackedBarSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StackedBarSeries.aggregation */
    interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StackedBarSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StackedBarSeries.label */
    interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StackedBarSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
        /** @name dxChartSeriesTypes.StackedBarSeries.label.position */
        position?: 'inside' | 'outside';
    }
    /** @name dxChartSeriesTypes.StackedLineSeries */
    interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StackedLineSeries.aggregation */
        aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
        /** @name dxChartSeriesTypes.StackedLineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StackedLineSeries.label */
        label?: dxChartSeriesTypesStackedLineSeriesLabel;
        /** @name dxChartSeriesTypes.StackedLineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StackedLineSeries.aggregation */
    interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StackedLineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StackedLineSeries.label */
    interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StackedLineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StackedSplineAreaSeries */
    interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.label */
        label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.point */
        point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StackedSplineAreaSeries.aggregation */
    interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StackedSplineAreaSeries.label */
    interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StackedSplineAreaSeries.point */
    interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.StackedSplineAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StackedSplineSeries */
    interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StackedSplineSeries.aggregation */
        aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
        /** @name dxChartSeriesTypes.StackedSplineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StackedSplineSeries.label */
        label?: dxChartSeriesTypesStackedSplineSeriesLabel;
        /** @name dxChartSeriesTypes.StackedSplineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StackedSplineSeries.aggregation */
    interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StackedSplineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StackedSplineSeries.label */
    interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StackedSplineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StepAreaSeries */
    interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StepAreaSeries.aggregation */
        aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
        /** @name dxChartSeriesTypes.StepAreaSeries.border */
        border?: dxChartSeriesTypesStepAreaSeriesBorder;
        /** @name dxChartSeriesTypes.StepAreaSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StepAreaSeries.hoverStyle */
        hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
        /** @name dxChartSeriesTypes.StepAreaSeries.label */
        label?: dxChartSeriesTypesStepAreaSeriesLabel;
        /** @name dxChartSeriesTypes.StepAreaSeries.point */
        point?: dxChartSeriesTypesStepAreaSeriesPoint;
        /** @name dxChartSeriesTypes.StepAreaSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StepAreaSeries.selectionStyle */
        selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.aggregation */
    interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StepAreaSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.border */
    interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
        /** @name dxChartSeriesTypes.StepAreaSeries.border.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.hoverStyle */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /** @name dxChartSeriesTypes.StepAreaSeries.hoverStyle.border */
        border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.hoverStyle.border */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /** @name dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.label */
    interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StepAreaSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.point */
    interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** @name dxChartSeriesTypes.StepAreaSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.selectionStyle */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** @name dxChartSeriesTypes.StepAreaSeries.selectionStyle.border */
        border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
    }
    /** @name dxChartSeriesTypes.StepAreaSeries.selectionStyle.border */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /** @name dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible */
        visible?: boolean;
    }
    /** @name dxChartSeriesTypes.StepLineSeries */
    interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StepLineSeries.aggregation */
        aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
        /** @name dxChartSeriesTypes.StepLineSeries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxChartSeriesTypes.StepLineSeries.label */
        label?: dxChartSeriesTypesStepLineSeriesLabel;
        /** @name dxChartSeriesTypes.StepLineSeries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StepLineSeries.aggregation */
    interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StepLineSeries.aggregation.method */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** @name dxChartSeriesTypes.StepLineSeries.label */
    interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StepLineSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxChartSeriesTypes.StockSeries */
    interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
        /** @name dxChartSeriesTypes.StockSeries.aggregation */
        aggregation?: dxChartSeriesTypesStockSeriesAggregation;
        /** @name dxChartSeriesTypes.StockSeries.argumentField */
        argumentField?: string;
        /** @name dxChartSeriesTypes.StockSeries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxChartSeriesTypes.StockSeries.label */
        label?: dxChartSeriesTypesStockSeriesLabel;
        /** @name dxChartSeriesTypes.StockSeries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxChartSeriesTypes.StockSeries.aggregation */
    interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** @name dxChartSeriesTypes.StockSeries.aggregation.method */
        method?: 'ohlc' | 'custom';
    }
    /** @name dxChartSeriesTypes.StockSeries.label */
    interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** @name dxChartSeriesTypes.StockSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
    }
    /** @name dxCircularGauge.Options */
    export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
        /** @name dxCircularGauge.Options.geometry */
        geometry?: { endAngle?: number, startAngle?: number };
        /** @name dxCircularGauge.Options.rangeContainer */
        rangeContainer?: dxCircularGaugeRangeContainer;
        /** @name dxCircularGauge.Options.scale */
        scale?: dxCircularGaugeScale;
        /** @name dxCircularGauge.Options.subvalueIndicator */
        subvalueIndicator?: GaugeIndicator;
        /** @name dxCircularGauge.Options.valueIndicator */
        valueIndicator?: GaugeIndicator;
    }
    /** @name dxCircularGauge.Options.rangeContainer */
    export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
        /** @name dxCircularGauge.Options.rangeContainer.orientation */
        orientation?: 'center' | 'inside' | 'outside';
        /** @name dxCircularGauge.Options.rangeContainer.width */
        width?: number;
    }
    /** @name dxCircularGauge.Options.scale */
    export interface dxCircularGaugeScale extends BaseGaugeScale {
        /** @name dxCircularGauge.Options.scale.label */
        label?: dxCircularGaugeScaleLabel;
        /** @name dxCircularGauge.Options.scale.orientation */
        orientation?: 'center' | 'inside' | 'outside';
    }
    /** @name dxCircularGauge.Options.scale.label */
    export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
        /** @name dxCircularGauge.Options.scale.label.hideFirstOrLast */
        hideFirstOrLast?: 'first' | 'last';
        /** @name dxCircularGauge.Options.scale.label.indentFromTick */
        indentFromTick?: number;
    }
    /** @name dxCircularGauge */
    export class dxCircularGauge extends BaseGauge {
        constructor(element: Element, options?: dxCircularGaugeOptions)
        constructor(element: JQuery, options?: dxCircularGaugeOptions)
    }
    /** @name dxFunnel.Options */
    export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
        /** @name dxFunnel.Options.adaptiveLayout */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /** @name dxFunnel.Options.algorithm */
        algorithm?: 'dynamicHeight' | 'dynamicSlope';
        /** @name dxFunnel.Options.argumentField */
        argumentField?: string;
        /** @name dxFunnel.Options.colorField */
        colorField?: string;
        /** @name dxFunnel.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name dxFunnel.Options.hoverEnabled */
        hoverEnabled?: boolean;
        /** @name dxFunnel.Options.inverted */
        inverted?: boolean;
        /** @name dxFunnel.Options.item */
        item?: { border?: { color?: string, visible?: boolean, width?: number }, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } }, selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } } };
        /** @name dxFunnel.Options.label */
        label?: { backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, opacity?: number, visible?: boolean, width?: number }, customizeText?: ((itemInfo: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => string), font?: Font, format?: DevExpress.ui.format, horizontalAlignment?: 'left' | 'right', horizontalOffset?: number, position?: 'columns' | 'inside' | 'outside', showForZeroValues?: boolean, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /** @name dxFunnel.Options.legend */
        legend?: dxFunnelLegend;
        /** @name dxFunnel.Options.neckHeight */
        neckHeight?: number;
        /** @name dxFunnel.Options.neckWidth */
        neckWidth?: number;
        /** @name dxFunnel.Options.onHoverChanged */
        onHoverChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /** @name dxFunnel.Options.onItemClick */
        onItemClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, item?: dxFunnelItem }) => any) | string;
        /** @name dxFunnel.Options.onLegendClick */
        onLegendClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, item?: dxFunnelItem }) => any) | string;
        /** @name dxFunnel.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /** @name dxFunnel.Options.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name dxFunnel.Options.paletteExtensionMode */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** @name dxFunnel.Options.resolveLabelOverlapping */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /** @name dxFunnel.Options.selectionMode */
        selectionMode?: 'multiple' | 'none' | 'single';
        /** @name dxFunnel.Options.sortData */
        sortData?: boolean;
        /** @name dxFunnel.Options.tooltip */
        tooltip?: dxFunnelTooltip;
        /** @name dxFunnel.Options.valueField */
        valueField?: string;
    }
    /** @name dxFunnel.Options.legend */
    export interface dxFunnelLegend extends BaseLegend {
        /** @name dxFunnel.Options.legend.customizeHint */
        customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /** @name dxFunnel.Options.legend.customizeItems */
        customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
        /** @name dxFunnel.Options.legend.customizeText */
        customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /** @name dxFunnel.Options.legend.markerTemplate */
        markerTemplate?: DevExpress.core.template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /** @name dxFunnel.Options.legend.visible */
        visible?: boolean;
    }
    /** @name dxFunnel.Options.tooltip */
    export interface dxFunnelTooltip extends BaseWidgetTooltip {
        /** @name dxFunnel.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxFunnel.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
    }
    /** @name dxFunnel */
    export class dxFunnel extends BaseWidget {
        constructor(element: Element, options?: dxFunnelOptions)
        constructor(element: JQuery, options?: dxFunnelOptions)
        /** @name dxFunnel.clearSelection() */
        clearSelection(): void;
        /** @name dxFunnel.getAllItems() */
        getAllItems(): Array<dxFunnelItem>;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxFunnel.hideTooltip() */
        hideTooltip(): void;
    }
    /** @name dxFunnelItem */
    export class dxFunnelItem {
        /** @name dxFunnelItem.argument */
        argument: string | Date | number;
        /** @name dxFunnelItem.data */
        data: any;
        /** @name dxFunnelItem.percent */
        percent: number;
        /** @name dxFunnelItem.value */
        value: number;
        /** @name dxFunnelItem.getColor() */
        getColor(): string;
        /** @name dxFunnelItem.hover(state) */
        hover(state: boolean): void;
        /** @name dxFunnelItem.isHovered() */
        isHovered(): boolean;
        /** @name dxFunnelItem.isSelected() */
        isSelected(): boolean;
        /** @name dxFunnelItem.select(state) */
        select(state: boolean): void;
        /** @name dxFunnelItem.showTooltip() */
        showTooltip(): void;
    }
    /** @name dxLinearGauge.Options */
    export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
        /** @name dxLinearGauge.Options.geometry */
        geometry?: { orientation?: 'horizontal' | 'vertical' };
        /** @name dxLinearGauge.Options.rangeContainer */
        rangeContainer?: dxLinearGaugeRangeContainer;
        /** @name dxLinearGauge.Options.scale */
        scale?: dxLinearGaugeScale;
        /** @name dxLinearGauge.Options.subvalueIndicator */
        subvalueIndicator?: GaugeIndicator;
        /** @name dxLinearGauge.Options.valueIndicator */
        valueIndicator?: GaugeIndicator;
    }
    /** @name dxLinearGauge.Options.rangeContainer */
    export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
        /** @name dxLinearGauge.Options.rangeContainer.horizontalOrientation */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /** @name dxLinearGauge.Options.rangeContainer.verticalOrientation */
        verticalOrientation?: 'bottom' | 'center' | 'top';
        /** @name dxLinearGauge.Options.rangeContainer.width */
        width?: { end?: number, start?: number } | number;
    }
    /** @name dxLinearGauge.Options.scale */
    export interface dxLinearGaugeScale extends BaseGaugeScale {
        /** @name dxLinearGauge.Options.scale.horizontalOrientation */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /** @name dxLinearGauge.Options.scale.label */
        label?: dxLinearGaugeScaleLabel;
        /** @name dxLinearGauge.Options.scale.scaleDivisionFactor */
        scaleDivisionFactor?: number;
        /** @name dxLinearGauge.Options.scale.verticalOrientation */
        verticalOrientation?: 'bottom' | 'center' | 'top';
    }
    /** @name dxLinearGauge.Options.scale.label */
    export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
        /** @name dxLinearGauge.Options.scale.label.indentFromTick */
        indentFromTick?: number;
    }
    /** @name dxLinearGauge */
    export class dxLinearGauge extends BaseGauge {
        constructor(element: Element, options?: dxLinearGaugeOptions)
        constructor(element: JQuery, options?: dxLinearGaugeOptions)
    }
    /** @name dxPieChart.Options */
    export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
        /** @name dxPieChart.Options.adaptiveLayout */
        adaptiveLayout?: dxPieChartAdaptiveLayout;
        /** @name dxPieChart.Options.centerTemplate */
        centerTemplate?: DevExpress.core.template | ((component: dxPieChart, element: SVGGElement) => string | SVGElement | JQuery);
        /** @name dxPieChart.Options.commonSeriesSettings */
        commonSeriesSettings?: any;
        /** @name dxPieChart.Options.diameter */
        diameter?: number;
        /** @name dxPieChart.Options.innerRadius */
        innerRadius?: number;
        /** @name dxPieChart.Options.legend */
        legend?: dxPieChartLegend;
        /** @name dxPieChart.Options.minDiameter */
        minDiameter?: number;
        /** @name dxPieChart.Options.onLegendClick */
        onLegendClick?: ((e: { component?: dxPieChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
        /** @name dxPieChart.Options.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name dxPieChart.Options.resolveLabelOverlapping */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /** @name dxPieChart.Options.segmentsDirection */
        segmentsDirection?: 'anticlockwise' | 'clockwise';
        /** @name dxPieChart.Options.series */
        series?: PieChartSeries | Array<PieChartSeries>;
        /** @name dxPieChart.Options.seriesTemplate */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PieChartSeries), nameField?: string };
        /** @name dxPieChart.Options.sizeGroup */
        sizeGroup?: string;
        /** @name dxPieChart.Options.startAngle */
        startAngle?: number;
        /** @name dxPieChart.Options.type */
        type?: 'donut' | 'doughnut' | 'pie';
    }
    /** @name dxPieChart.Options.adaptiveLayout */
    export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /** @name dxPieChart.Options.adaptiveLayout.keepLabels */
        keepLabels?: boolean;
    }
    /** @name dxPieChart.Options.legend */
    export interface dxPieChartLegend extends BaseChartLegend {
        /** @name dxPieChart.Options.legend.customizeHint */
        customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /** @name dxPieChart.Options.legend.customizeItems */
        customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
        /** @name dxPieChart.Options.legend.customizeText */
        customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /** @name dxPieChart.Options.legend.hoverMode */
        hoverMode?: 'none' | 'allArgumentPoints';
        /** @name dxPieChart.Options.legend.markerTemplate */
        markerTemplate?: DevExpress.core.template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /** @name dxPieChart */
    export class dxPieChart extends BaseChart {
        constructor(element: Element, options?: dxPieChartOptions)
        constructor(element: JQuery, options?: dxPieChartOptions)
        /** @name dxPieChart.getInnerRadius() */
        getInnerRadius(): number;
    }
    /** @name dxPieChartSeriesTypes */
    export interface dxPieChartSeriesTypes {
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries */
        CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
        /** @name dxPieChartSeriesTypes.DoughnutSeries */
        DoughnutSeries?: any;
        /** @name dxPieChartSeriesTypes.PieSeries */
        PieSeries?: any;
    }
    /** @name dxPieChartSeriesTypes.CommonPieChartSeries */
    export interface dxPieChartSeriesTypesCommonPieChartSeries {
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentField */
        argumentField?: string;
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.argumentType */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.border */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.color */
        color?: string;
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode */
        hoverMode?: 'none' | 'onlyPoint';
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.label */
        label?: { argumentFormat?: DevExpress.ui.format, backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), font?: Font, format?: DevExpress.ui.format, position?: 'columns' | 'inside' | 'outside', radialOffset?: number, rotationAngle?: number, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount */
        maxLabelCount?: number;
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize */
        minSegmentSize?: number;
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode */
        selectionMode?: 'none' | 'onlyPoint';
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping */
        smallValuesGrouping?: { groupName?: string, mode?: 'none' | 'smallValueThreshold' | 'topN', threshold?: number, topCount?: number };
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.tagField */
        tagField?: string;
        /** @name dxPieChartSeriesTypes.CommonPieChartSeries.valueField */
        valueField?: string;
    }
    /** @name dxPolarChart.Options */
    export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
        /** @name dxPolarChart.Options.adaptiveLayout */
        adaptiveLayout?: dxPolarChartAdaptiveLayout;
        /** @name dxPolarChart.Options.argumentAxis */
        argumentAxis?: dxPolarChartArgumentAxis;
        /** @name dxPolarChart.Options.barGroupPadding */
        barGroupPadding?: number;
        /** @name dxPolarChart.Options.barGroupWidth */
        barGroupWidth?: number;
        /** @deprecated */
        /** @name dxPolarChart.Options.barWidth */
        barWidth?: number;
        /** @name dxPolarChart.Options.commonAxisSettings */
        commonAxisSettings?: dxPolarChartCommonAxisSettings;
        /** @name dxPolarChart.Options.commonSeriesSettings */
        commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
        /** @name dxPolarChart.Options.containerBackgroundColor */
        containerBackgroundColor?: string;
        /** @name dxPolarChart.Options.dataPrepareSettings */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) };
        /** @deprecated */
        /** @name dxPolarChart.Options.equalBarWidth */
        equalBarWidth?: boolean;
        /** @name dxPolarChart.Options.legend */
        legend?: dxPolarChartLegend;
        /** @name dxPolarChart.Options.negativesAsZeroes */
        negativesAsZeroes?: boolean;
        /** @name dxPolarChart.Options.onArgumentAxisClick */
        onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
        /** @name dxPolarChart.Options.onLegendClick */
        onLegendClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
        /** @name dxPolarChart.Options.onSeriesClick */
        onSeriesClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
        /** @name dxPolarChart.Options.onSeriesHoverChanged */
        onSeriesHoverChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /** @name dxPolarChart.Options.onSeriesSelectionChanged */
        onSeriesSelectionChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /** @name dxPolarChart.Options.onZoomEnd */
        onZoomEnd?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /** @name dxPolarChart.Options.onZoomStart */
        onZoomStart?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /** @name dxPolarChart.Options.resolveLabelOverlapping */
        resolveLabelOverlapping?: 'hide' | 'none';
        /** @name dxPolarChart.Options.series */
        series?: PolarChartSeries | Array<PolarChartSeries>;
        /** @name dxPolarChart.Options.seriesSelectionMode */
        seriesSelectionMode?: 'multiple' | 'single';
        /** @name dxPolarChart.Options.seriesTemplate */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PolarChartSeries), nameField?: string };
        /** @name dxPolarChart.Options.tooltip */
        tooltip?: dxPolarChartTooltip;
        /** @name dxPolarChart.Options.useSpiderWeb */
        useSpiderWeb?: boolean;
        /** @name dxPolarChart.Options.valueAxis */
        valueAxis?: dxPolarChartValueAxis;
    }
    /** @name dxPolarChart.Options.adaptiveLayout */
    export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /** @name dxPolarChart.Options.adaptiveLayout.height */
        height?: number;
        /** @name dxPolarChart.Options.adaptiveLayout.width */
        width?: number;
    }
    /** @name dxPolarChart.Options.argumentAxis */
    export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
        /** @name dxPolarChart.Options.argumentAxis.argumentType */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** @name dxPolarChart.Options.argumentAxis.axisDivisionFactor */
        axisDivisionFactor?: number;
        /** @name dxPolarChart.Options.argumentAxis.categories */
        categories?: Array<number | string | Date>;
        /** @name dxPolarChart.Options.argumentAxis.constantLines */
        constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
        /** @name dxPolarChart.Options.argumentAxis.firstPointOnStartAngle */
        firstPointOnStartAngle?: boolean;
        /** @name dxPolarChart.Options.argumentAxis.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'none';
        /** @name dxPolarChart.Options.argumentAxis.label */
        label?: dxPolarChartArgumentAxisLabel;
        /** @name dxPolarChart.Options.argumentAxis.linearThreshold */
        linearThreshold?: number;
        /** @name dxPolarChart.Options.argumentAxis.logarithmBase */
        logarithmBase?: number;
        /** @name dxPolarChart.Options.argumentAxis.minorTick */
        minorTick?: dxPolarChartArgumentAxisMinorTick;
        /** @name dxPolarChart.Options.argumentAxis.minorTickCount */
        minorTickCount?: number;
        /** @name dxPolarChart.Options.argumentAxis.minorTickInterval */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxPolarChart.Options.argumentAxis.originValue */
        originValue?: number;
        /** @name dxPolarChart.Options.argumentAxis.period */
        period?: number;
        /** @name dxPolarChart.Options.argumentAxis.startAngle */
        startAngle?: number;
        /** @name dxPolarChart.Options.argumentAxis.strips */
        strips?: Array<dxPolarChartArgumentAxisStrips>;
        /** @name dxPolarChart.Options.argumentAxis.tick */
        tick?: dxPolarChartArgumentAxisTick;
        /** @name dxPolarChart.Options.argumentAxis.tickInterval */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxPolarChart.Options.argumentAxis.type */
        type?: 'continuous' | 'discrete' | 'logarithmic';
    }
    /** @name dxPolarChart.Options.argumentAxis.constantLines */
    export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** @name dxPolarChart.Options.argumentAxis.constantLines.displayBehindSeries */
        displayBehindSeries?: boolean;
        /** @name dxPolarChart.Options.argumentAxis.constantLines.extendAxis */
        extendAxis?: boolean;
        /** @name dxPolarChart.Options.argumentAxis.constantLines.label */
        label?: dxPolarChartArgumentAxisConstantLinesLabel;
        /** @name dxPolarChart.Options.argumentAxis.constantLines.value */
        value?: number | Date | string;
    }
    /** @name dxPolarChart.Options.argumentAxis.constantLines.label */
    export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxPolarChart.Options.argumentAxis.constantLines.label.text */
        text?: string;
    }
    /** @name dxPolarChart.Options.argumentAxis.label */
    export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /** @name dxPolarChart.Options.argumentAxis.label.customizeHint */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxPolarChart.Options.argumentAxis.label.customizeText */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxPolarChart.Options.argumentAxis.label.format */
        format?: DevExpress.ui.format;
    }
    /** @name dxPolarChart.Options.argumentAxis.minorTick */
    export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
        /** @name dxPolarChart.Options.argumentAxis.minorTick.shift */
        shift?: number;
    }
    /** @name dxPolarChart.Options.argumentAxis.strips */
    export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /** @name dxPolarChart.Options.argumentAxis.strips.color */
        color?: string;
        /** @name dxPolarChart.Options.argumentAxis.strips.endValue */
        endValue?: number | Date | string;
        /** @name dxPolarChart.Options.argumentAxis.strips.label */
        label?: dxPolarChartArgumentAxisStripsLabel;
        /** @name dxPolarChart.Options.argumentAxis.strips.startValue */
        startValue?: number | Date | string;
    }
    /** @name dxPolarChart.Options.argumentAxis.strips.label */
    export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** @name dxPolarChart.Options.argumentAxis.strips.label.text */
        text?: string;
    }
    /** @name dxPolarChart.Options.argumentAxis.tick */
    export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /** @name dxPolarChart.Options.argumentAxis.tick.shift */
        shift?: number;
    }
    /** @name dxPolarChart.Options.commonAxisSettings */
    export interface dxPolarChartCommonAxisSettings {
        /** @name dxPolarChart.Options.commonAxisSettings.allowDecimals */
        allowDecimals?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.color */
        color?: string;
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle */
        constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
        /** @name dxPolarChart.Options.commonAxisSettings.discreteAxisDivisionMode */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /** @name dxPolarChart.Options.commonAxisSettings.endOnTick */
        endOnTick?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.grid */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /** @name dxPolarChart.Options.commonAxisSettings.inverted */
        inverted?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.label */
        label?: dxPolarChartCommonAxisSettingsLabel;
        /** @name dxPolarChart.Options.commonAxisSettings.minorGrid */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick */
        minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
        /** @name dxPolarChart.Options.commonAxisSettings.opacity */
        opacity?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.stripStyle */
        stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
        /** @name dxPolarChart.Options.commonAxisSettings.tick */
        tick?: dxPolarChartCommonAxisSettingsTick;
        /** @name dxPolarChart.Options.commonAxisSettings.visible */
        visible?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.width */
        width?: number;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.color */
        color?: string;
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.label */
        label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.width */
        width?: number;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.label */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.font */
        font?: Font;
        /** @name dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.visible */
        visible?: boolean;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.label */
    export interface dxPolarChartCommonAxisSettingsLabel {
        /** @name dxPolarChart.Options.commonAxisSettings.label.font */
        font?: Font;
        /** @name dxPolarChart.Options.commonAxisSettings.label.indentFromAxis */
        indentFromAxis?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.label.overlappingBehavior */
        overlappingBehavior?: 'none' | 'hide';
        /** @name dxPolarChart.Options.commonAxisSettings.label.visible */
        visible?: boolean;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.minorTick */
    export interface dxPolarChartCommonAxisSettingsMinorTick {
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick.color */
        color?: string;
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick.length */
        length?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick.opacity */
        opacity?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick.visible */
        visible?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.minorTick.width */
        width?: number;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.stripStyle */
    export interface dxPolarChartCommonAxisSettingsStripStyle {
        /** @name dxPolarChart.Options.commonAxisSettings.stripStyle.label */
        label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.stripStyle.label */
    export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** @name dxPolarChart.Options.commonAxisSettings.stripStyle.label.font */
        font?: Font;
    }
    /** @name dxPolarChart.Options.commonAxisSettings.tick */
    export interface dxPolarChartCommonAxisSettingsTick {
        /** @name dxPolarChart.Options.commonAxisSettings.tick.color */
        color?: string;
        /** @name dxPolarChart.Options.commonAxisSettings.tick.length */
        length?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.tick.opacity */
        opacity?: number;
        /** @name dxPolarChart.Options.commonAxisSettings.tick.visible */
        visible?: boolean;
        /** @name dxPolarChart.Options.commonAxisSettings.tick.width */
        width?: number;
    }
    /** @name dxPolarChart.Options.commonSeriesSettings */
    export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChart.Options.commonSeriesSettings.area */
        area?: any;
        /** @name dxPolarChart.Options.commonSeriesSettings.bar */
        bar?: any;
        /** @name dxPolarChart.Options.commonSeriesSettings.line */
        line?: any;
        /** @name dxPolarChart.Options.commonSeriesSettings.scatter */
        scatter?: any;
        /** @name dxPolarChart.Options.commonSeriesSettings.stackedbar */
        stackedbar?: any;
        /** @name dxPolarChart.Options.commonSeriesSettings.type */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /** @name dxPolarChart.Options.legend */
    export interface dxPolarChartLegend extends BaseChartLegend {
        /** @name dxPolarChart.Options.legend.customizeHint */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** @name dxPolarChart.Options.legend.customizeText */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** @name dxPolarChart.Options.legend.hoverMode */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    }
    /** @name dxPolarChart.Options.tooltip */
    export interface dxPolarChartTooltip extends BaseChartTooltip {
        /** @name dxPolarChart.Options.tooltip.shared */
        shared?: boolean;
    }
    /** @name dxPolarChart.Options.valueAxis */
    export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
        /** @name dxPolarChart.Options.valueAxis.axisDivisionFactor */
        axisDivisionFactor?: number;
        /** @name dxPolarChart.Options.valueAxis.categories */
        categories?: Array<number | string | Date>;
        /** @name dxPolarChart.Options.valueAxis.constantLines */
        constantLines?: Array<dxPolarChartValueAxisConstantLines>;
        /** @name dxPolarChart.Options.valueAxis.endOnTick */
        endOnTick?: boolean;
        /** @name dxPolarChart.Options.valueAxis.label */
        label?: dxPolarChartValueAxisLabel;
        /** @name dxPolarChart.Options.valueAxis.linearThreshold */
        linearThreshold?: number;
        /** @name dxPolarChart.Options.valueAxis.logarithmBase */
        logarithmBase?: number;
        /** @name dxPolarChart.Options.valueAxis.maxValueMargin */
        maxValueMargin?: number;
        /** @name dxPolarChart.Options.valueAxis.minValueMargin */
        minValueMargin?: number;
        /** @name dxPolarChart.Options.valueAxis.minVisualRangeLength */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxPolarChart.Options.valueAxis.minorTickCount */
        minorTickCount?: number;
        /** @name dxPolarChart.Options.valueAxis.minorTickInterval */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxPolarChart.Options.valueAxis.showZero */
        showZero?: boolean;
        /** @name dxPolarChart.Options.valueAxis.strips */
        strips?: Array<dxPolarChartValueAxisStrips>;
        /** @name dxPolarChart.Options.valueAxis.tick */
        tick?: dxPolarChartValueAxisTick;
        /** @name dxPolarChart.Options.valueAxis.tickInterval */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /** @name dxPolarChart.Options.valueAxis.type */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** @name dxPolarChart.Options.valueAxis.valueMarginsEnabled */
        valueMarginsEnabled?: boolean;
        /** @name dxPolarChart.Options.valueAxis.valueType */
        valueType?: 'datetime' | 'numeric' | 'string';
        /** @name dxPolarChart.Options.valueAxis.visualRange */
        visualRange?: VizRange | Array<number | string | Date>;
        /** @name dxPolarChart.Options.valueAxis.visualRangeUpdateMode */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
        /** @name dxPolarChart.Options.valueAxis.wholeRange */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /** @name dxPolarChart.Options.valueAxis.constantLines */
    export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** @name dxPolarChart.Options.valueAxis.constantLines.displayBehindSeries */
        displayBehindSeries?: boolean;
        /** @name dxPolarChart.Options.valueAxis.constantLines.extendAxis */
        extendAxis?: boolean;
        /** @name dxPolarChart.Options.valueAxis.constantLines.label */
        label?: dxPolarChartValueAxisConstantLinesLabel;
        /** @name dxPolarChart.Options.valueAxis.constantLines.value */
        value?: number | Date | string;
    }
    /** @name dxPolarChart.Options.valueAxis.constantLines.label */
    export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** @name dxPolarChart.Options.valueAxis.constantLines.label.text */
        text?: string;
    }
    /** @name dxPolarChart.Options.valueAxis.label */
    export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /** @name dxPolarChart.Options.valueAxis.label.customizeHint */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxPolarChart.Options.valueAxis.label.customizeText */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** @name dxPolarChart.Options.valueAxis.label.format */
        format?: DevExpress.ui.format;
    }
    /** @name dxPolarChart.Options.valueAxis.strips */
    export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /** @name dxPolarChart.Options.valueAxis.strips.color */
        color?: string;
        /** @name dxPolarChart.Options.valueAxis.strips.endValue */
        endValue?: number | Date | string;
        /** @name dxPolarChart.Options.valueAxis.strips.label */
        label?: dxPolarChartValueAxisStripsLabel;
        /** @name dxPolarChart.Options.valueAxis.strips.startValue */
        startValue?: number | Date | string;
    }
    /** @name dxPolarChart.Options.valueAxis.strips.label */
    export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** @name dxPolarChart.Options.valueAxis.strips.label.text */
        text?: string;
    }
    /** @name dxPolarChart.Options.valueAxis.tick */
    export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /** @name dxPolarChart.Options.valueAxis.tick.visible */
        visible?: boolean;
    }
    /** @name dxPolarChart */
    export class dxPolarChart extends BaseChart {
        constructor(element: Element, options?: dxPolarChartOptions)
        constructor(element: JQuery, options?: dxPolarChartOptions)
        /** @name dxPolarChart.getValueAxis() */
        getValueAxis(): chartAxisObject;
        /** @name dxPolarChart.resetVisualRange() */
        resetVisualRange(): void;
    }
    /** @name dxPolarChartSeriesTypes */
    export interface dxPolarChartSeriesTypes {
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries */
        CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
        /** @name dxPolarChartSeriesTypes.areapolarseries */
        areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
        /** @name dxPolarChartSeriesTypes.barpolarseries */
        barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
        /** @name dxPolarChartSeriesTypes.linepolarseries */
        linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
        /** @name dxPolarChartSeriesTypes.scatterpolarseries */
        scatterpolarseries?: any;
        /** @name dxPolarChartSeriesTypes.stackedbarpolarseries */
        stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
    }
    /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField */
        argumentField?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding */
        barPadding?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth */
        barWidth?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.border */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.closed */
        closed?: boolean;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.color */
        color?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints */
        ignoreEmptyPoints?: boolean;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label */
        label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount */
        maxLabelCount?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize */
        minBarSize?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity */
        opacity?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point */
        point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend */
        showInLegend?: boolean;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.stack */
        stack?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField */
        tagField?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField */
        valueField?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.visible */
        visible?: boolean;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.width */
        width?: number;
    }
    /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat */
        argumentFormat?: DevExpress.ui.format;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor */
        backgroundColor?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector */
        connector?: { color?: string, visible?: boolean, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText */
        customizeText?: ((pointInfo: any) => string);
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font */
        font?: Font;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format */
        format?: DevExpress.ui.format;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position */
        position?: 'inside' | 'outside';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle */
        rotationAngle?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues */
        showForZeroValues?: boolean;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible */
        visible?: boolean;
    }
    /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border */
        border?: { color?: string, visible?: boolean, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color */
        color?: string;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image */
        image?: string | { height?: number, url?: string, width?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size */
        size?: number;
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /** @name dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible */
        visible?: boolean;
    }
    /** @name dxPolarChartSeriesTypes.areapolarseries */
    export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChartSeriesTypes.areapolarseries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxPolarChartSeriesTypes.areapolarseries.point */
        point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
        /** @name dxPolarChartSeriesTypes.areapolarseries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxPolarChartSeriesTypes.areapolarseries.point */
    export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /** @name dxPolarChartSeriesTypes.areapolarseries.point.visible */
        visible?: boolean;
    }
    /** @name dxPolarChartSeriesTypes.barpolarseries */
    export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChartSeriesTypes.barpolarseries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxPolarChartSeriesTypes.barpolarseries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxPolarChartSeriesTypes.linepolarseries */
    export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChartSeriesTypes.linepolarseries.hoverMode */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** @name dxPolarChartSeriesTypes.linepolarseries.selectionMode */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** @name dxPolarChartSeriesTypes.stackedbarpolarseries */
    export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** @name dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** @name dxPolarChartSeriesTypes.stackedbarpolarseries.label */
        label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
        /** @name dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** @name dxPolarChartSeriesTypes.stackedbarpolarseries.label */
    export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /** @name dxPolarChartSeriesTypes.stackedbarpolarseries.label.position */
        position?: 'inside' | 'outside';
    }
    /** @name dxRangeSelector.Options */
    export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
        /** @name dxRangeSelector.Options.background */
        background?: { color?: string, image?: { location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop', url?: string }, visible?: boolean };
        /** @name dxRangeSelector.Options.behavior */
        behavior?: { allowSlidersSwap?: boolean, animationEnabled?: boolean, callValueChanged?: 'onMoving' | 'onMovingComplete', manualRangeSelectionEnabled?: boolean, moveSelectedRangeByClick?: boolean, snapToTicks?: boolean };
        /** @name dxRangeSelector.Options.chart */
        chart?: { barGroupPadding?: number, barGroupWidth?: number, barWidth?: number, bottomIndent?: number, commonSeriesSettings?: dxChartCommonSeriesSettings, dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) }, equalBarWidth?: boolean, maxBubbleSize?: number, minBubbleSize?: number, negativesAsZeroes?: boolean, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', series?: ChartSeries | Array<ChartSeries>, seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string }, topIndent?: number, useAggregation?: boolean, valueAxis?: { inverted?: boolean, logarithmBase?: number, max?: number, min?: number, type?: 'continuous' | 'logarithmic', valueType?: 'datetime' | 'numeric' | 'string' } };
        /** @name dxRangeSelector.Options.containerBackgroundColor */
        containerBackgroundColor?: string;
        /** @name dxRangeSelector.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name dxRangeSelector.Options.dataSourceField */
        dataSourceField?: string;
        /** @name dxRangeSelector.Options.indent */
        indent?: { left?: number, right?: number };
        /** @name dxRangeSelector.Options.onValueChanged */
        onValueChanged?: ((e: { component?: dxRangeSelector, element?: DevExpress.core.dxElement, model?: any, value?: Array<number | string | Date>, previousValue?: Array<number | string | Date>, event?: event }) => any);
        /** @name dxRangeSelector.Options.scale */
        scale?: { aggregateByCategory?: boolean, aggregationGroupWidth?: number, aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', allowDecimals?: boolean, breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number }, breaks?: Array<ScaleBreak>, categories?: Array<number | string | Date>, endOnTick?: boolean, endValue?: number | Date | string, holidays?: Array<Date | string> | Array<number>, label?: { customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, overlappingBehavior?: 'hide' | 'none', topIndent?: number, visible?: boolean }, linearThreshold?: number, logarithmBase?: number, marker?: { label?: { customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string), format?: DevExpress.ui.format }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }, maxRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minorTick?: { color?: string, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number, minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', placeholderHeight?: number, showCustomBoundaryTicks?: boolean, singleWorkdays?: Array<Date | string> | Array<number>, startValue?: number | Date | string, tick?: { color?: string, opacity?: number, width?: number }, tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete', valueType?: 'datetime' | 'numeric' | 'string', workWeek?: Array<number>, workdaysOnly?: boolean };
        /** @name dxRangeSelector.Options.selectedRangeColor */
        selectedRangeColor?: string;
        /** @name dxRangeSelector.Options.selectedRangeUpdateMode */
        selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /** @name dxRangeSelector.Options.shutter */
        shutter?: { color?: string, opacity?: number };
        /** @name dxRangeSelector.Options.sliderHandle */
        sliderHandle?: { color?: string, opacity?: number, width?: number };
        /** @name dxRangeSelector.Options.sliderMarker */
        sliderMarker?: { color?: string, customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, invalidRangeColor?: string, paddingLeftRight?: number, paddingTopBottom?: number, placeholderHeight?: number, visible?: boolean };
        /** @name dxRangeSelector.Options.value */
        value?: Array<number | string | Date> | VizRange;
    }
    /** @name dxRangeSelector */
    export class dxRangeSelector extends BaseWidget {
        constructor(element: Element, options?: dxRangeSelectorOptions)
        constructor(element: JQuery, options?: dxRangeSelectorOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxRangeSelector.getValue() */
        getValue(): Array<number | string | Date>;
        /** @name BaseWidget.render() */
        render(): void;
        /** @name dxRangeSelector.render(skipChartAnimation) */
        render(skipChartAnimation: boolean): void;
        /** @name dxRangeSelector.setValue(value) */
        setValue(value: Array<number | string | Date> | VizRange): void;
    }
    /** @name dxSankey.Options */
    export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
        /** @name dxSankey.Options.adaptiveLayout */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /** @name dxSankey.Options.alignment */
        alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
        /** @name dxSankey.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name dxSankey.Options.hoverEnabled */
        hoverEnabled?: boolean;
        /** @name dxSankey.Options.label */
        label?: { border?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: 'ellipsis' | 'hide' | 'none', shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean };
        /** @name dxSankey.Options.link */
        link?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: 'none' | 'source' | 'target' | 'gradient', hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number };
        /** @name dxSankey.Options.node */
        node?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number };
        /** @name dxSankey.Options.onLinkClick */
        onLinkClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: event, target?: dxSankeyLink }) => any) | string;
        /** @name dxSankey.Options.onLinkHoverChanged */
        onLinkHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyLink }) => any);
        /** @name dxSankey.Options.onNodeClick */
        onNodeClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: event, target?: dxSankeyNode }) => any) | string;
        /** @name dxSankey.Options.onNodeHoverChanged */
        onNodeHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyNode }) => any);
        /** @name dxSankey.Options.palette */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** @name dxSankey.Options.paletteExtensionMode */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** @name dxSankey.Options.sortData */
        sortData?: any;
        /** @name dxSankey.Options.sourceField */
        sourceField?: string;
        /** @name dxSankey.Options.targetField */
        targetField?: string;
        /** @name dxSankey.Options.tooltip */
        tooltip?: dxSankeyTooltip;
        /** @name dxSankey.Options.weightField */
        weightField?: string;
    }
    /** @name dxSankey.Options.tooltip */
    export interface dxSankeyTooltip extends BaseWidgetTooltip {
        /** @name dxSankey.Options.tooltip.customizeLinkTooltip */
        customizeLinkTooltip?: ((info: { source?: string, target?: string, weight?: number }) => any);
        /** @name dxSankey.Options.tooltip.customizeNodeTooltip */
        customizeNodeTooltip?: ((info: { title?: string, label?: string, weightIn?: number, weightOut?: number }) => any);
        /** @name dxSankey.Options.tooltip.enabled */
        enabled?: boolean;
        /** @name dxSankey.Options.tooltip.linkTooltipTemplate */
        linkTooltipTemplate?: DevExpress.core.template | ((info: { source?: string, target?: string, weight?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxSankey.Options.tooltip.nodeTooltipTemplate */
        nodeTooltipTemplate?: DevExpress.core.template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /** @name dxSankey */
    export class dxSankey extends BaseWidget {
        constructor(element: Element, options?: dxSankeyOptions)
        constructor(element: JQuery, options?: dxSankeyOptions)
        /** @name dxSankey.getAllLinks() */
        getAllLinks(): Array<dxSankeyLink>;
        /** @name dxSankey.getAllNodes() */
        getAllNodes(): Array<dxSankeyNode>;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxSankey.hideTooltip() */
        hideTooltip(): void;
    }
    /** @name dxSankeyConnectionInfoObject */
    export interface dxSankeyConnectionInfoObject {
        /** @name dxSankeyConnectionInfoObject.source */
        source?: string;
        /** @name dxSankeyConnectionInfoObject.target */
        target?: string;
        /** @name dxSankeyConnectionInfoObject.weight */
        weight?: number;
    }
    /** @name dxSankeyLink */
    export class dxSankeyLink {
        /** @name dxSankeyLink.connection */
        connection: dxSankeyConnectionInfoObject;
        /** @name dxSankeyLink.hideTooltip() */
        hideTooltip(): void;
        /** @name dxSankeyLink.hover(state) */
        hover(state: boolean): void;
        /** @name dxSankeyLink.isHovered() */
        isHovered(): boolean;
        /** @name dxSankeyLink.showTooltip() */
        showTooltip(): void;
    }
    /** @name dxSankeyNode */
    export class dxSankeyNode {
        /** @name dxSankeyNode.label */
        label: string;
        /** @name dxSankeyNode.linksIn */
        linksIn: Array<any>;
        /** @name dxSankeyNode.linksOut */
        linksOut: Array<any>;
        /** @deprecated */
        /** @name dxSankeyNode.title */
        title: string;
        /** @name dxSankeyNode.hideTooltip() */
        hideTooltip(): void;
        /** @name dxSankeyNode.hover(state) */
        hover(state: boolean): void;
        /** @name dxSankeyNode.isHovered() */
        isHovered(): boolean;
        /** @name dxSankeyNode.showTooltip() */
        showTooltip(): void;
    }
    /** @name dxSparkline.Options */
    export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
        /** @name dxSparkline.Options.argumentField */
        argumentField?: string;
        /** @name dxSparkline.Options.barNegativeColor */
        barNegativeColor?: string;
        /** @name dxSparkline.Options.barPositiveColor */
        barPositiveColor?: string;
        /** @name dxSparkline.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name dxSparkline.Options.firstLastColor */
        firstLastColor?: string;
        /** @name dxSparkline.Options.ignoreEmptyPoints */
        ignoreEmptyPoints?: boolean;
        /** @name dxSparkline.Options.lineColor */
        lineColor?: string;
        /** @name dxSparkline.Options.lineWidth */
        lineWidth?: number;
        /** @name dxSparkline.Options.lossColor */
        lossColor?: string;
        /** @name dxSparkline.Options.maxColor */
        maxColor?: string;
        /** @name dxSparkline.Options.maxValue */
        maxValue?: number;
        /** @name dxSparkline.Options.minColor */
        minColor?: string;
        /** @name dxSparkline.Options.minValue */
        minValue?: number;
        /** @name dxSparkline.Options.pointColor */
        pointColor?: string;
        /** @name dxSparkline.Options.pointSize */
        pointSize?: number;
        /** @name dxSparkline.Options.pointSymbol */
        pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /** @name dxSparkline.Options.showFirstLast */
        showFirstLast?: boolean;
        /** @name dxSparkline.Options.showMinMax */
        showMinMax?: boolean;
        /** @name dxSparkline.Options.type */
        type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
        /** @name dxSparkline.Options.valueField */
        valueField?: string;
        /** @name dxSparkline.Options.winColor */
        winColor?: string;
        /** @name dxSparkline.Options.winlossThreshold */
        winlossThreshold?: number;
    }
    /** @name dxSparkline */
    export class dxSparkline extends BaseSparkline {
        constructor(element: Element, options?: dxSparklineOptions)
        constructor(element: JQuery, options?: dxSparklineOptions)
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** @name dxTreeMap.Options */
    export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
        /** @name dxTreeMap.Options.childrenField */
        childrenField?: string;
        /** @name dxTreeMap.Options.colorField */
        colorField?: string;
        /** @name dxTreeMap.Options.colorizer */
        colorizer?: { colorCodeField?: string, colorizeGroups?: boolean, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', range?: Array<number>, type?: 'discrete' | 'gradient' | 'none' | 'range' };
        /** @name dxTreeMap.Options.dataSource */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** @name dxTreeMap.Options.group */
        group?: { border?: { color?: string, width?: number }, color?: string, headerHeight?: number, hoverEnabled?: boolean, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /** @name dxTreeMap.Options.hoverEnabled */
        hoverEnabled?: boolean;
        /** @name dxTreeMap.Options.idField */
        idField?: string;
        /** @name dxTreeMap.Options.interactWithGroup */
        interactWithGroup?: boolean;
        /** @name dxTreeMap.Options.labelField */
        labelField?: string;
        /** @name dxTreeMap.Options.layoutAlgorithm */
        layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
        /** @name dxTreeMap.Options.layoutDirection */
        layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
        /** @name dxTreeMap.Options.maxDepth */
        maxDepth?: number;
        /** @name dxTreeMap.Options.onClick */
        onClick?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeMapNode }) => any) | string;
        /** @name dxTreeMap.Options.onDrill */
        onDrill?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** @name dxTreeMap.Options.onHoverChanged */
        onHoverChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** @name dxTreeMap.Options.onNodesInitialized */
        onNodesInitialized?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeMapNode }) => any);
        /** @name dxTreeMap.Options.onNodesRendering */
        onNodesRendering?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** @name dxTreeMap.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** @name dxTreeMap.Options.parentField */
        parentField?: string;
        /** @deprecated */
        /** @name dxTreeMap.Options.resolveLabelOverflow */
        resolveLabelOverflow?: 'ellipsis' | 'hide';
        /** @name dxTreeMap.Options.selectionMode */
        selectionMode?: 'multiple' | 'none' | 'single';
        /** @name dxTreeMap.Options.tile */
        tile?: { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /** @name dxTreeMap.Options.tooltip */
        tooltip?: dxTreeMapTooltip;
        /** @name dxTreeMap.Options.valueField */
        valueField?: string;
    }
    /** @name dxTreeMap.Options.tooltip */
    export interface dxTreeMapTooltip extends BaseWidgetTooltip {
        /** @name dxTreeMap.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxTreeMap.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
    }
    /** @name dxTreeMap */
    export class dxTreeMap extends BaseWidget {
        constructor(element: Element, options?: dxTreeMapOptions)
        constructor(element: JQuery, options?: dxTreeMapOptions)
        /** @name dxTreeMap.clearSelection() */
        clearSelection(): void;
        /** @name dxTreeMap.drillUp() */
        drillUp(): void;
        /** @name dxTreeMap.getCurrentNode() */
        getCurrentNode(): dxTreeMapNode;
        /** @name DataHelperMixin.getDataSource() */
        getDataSource(): DevExpress.data.DataSource;
        /** @name dxTreeMap.getRootNode() */
        getRootNode(): dxTreeMapNode;
        /** @name dxTreeMap.hideTooltip() */
        hideTooltip(): void;
        /** @name dxTreeMap.resetDrillDown() */
        resetDrillDown(): void;
    }
    /** @name dxTreeMapNode */
    export class dxTreeMapNode {
        /** @name dxTreeMapNode.data */
        data: any;
        /** @name dxTreeMapNode.index */
        index: number;
        /** @name dxTreeMapNode.level */
        level: number;
        /** @name dxTreeMapNode.customize(options) */
        customize(options: any): void;
        /** @name dxTreeMapNode.drillDown() */
        drillDown(): void;
        /** @name dxTreeMapNode.getAllChildren() */
        getAllChildren(): Array<dxTreeMapNode>;
        /** @name dxTreeMapNode.getAllNodes() */
        getAllNodes(): Array<dxTreeMapNode>;
        /** @name dxTreeMapNode.getChild(index) */
        getChild(index: number): dxTreeMapNode;
        /** @name dxTreeMapNode.getChildrenCount() */
        getChildrenCount(): number;
        /** @name dxTreeMapNode.getParent() */
        getParent(): dxTreeMapNode;
        /** @name dxTreeMapNode.isActive() */
        isActive(): boolean;
        /** @name dxTreeMapNode.isHovered() */
        isHovered(): boolean;
        /** @name dxTreeMapNode.isLeaf() */
        isLeaf(): boolean;
        /** @name dxTreeMapNode.isSelected() */
        isSelected(): boolean;
        /** @name dxTreeMapNode.label() */
        label(): string;
        /** @name dxTreeMapNode.label(label) */
        label(label: string): void;
        /** @name dxTreeMapNode.resetCustomization() */
        resetCustomization(): void;
        /** @name dxTreeMapNode.select(state) */
        select(state: boolean): void;
        /** @name dxTreeMapNode.showTooltip() */
        showTooltip(): void;
        /** @name dxTreeMapNode.value() */
        value(): number;
    }
    /** @name dxVectorMap.Options */
    export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
        /** @name dxVectorMap.Options.background */
        background?: { borderColor?: string, color?: string };
        /** @name dxVectorMap.Options.bounds */
        bounds?: Array<number>;
        /** @name dxVectorMap.Options.center */
        center?: Array<number>;
        /** @name dxVectorMap.Options.controlBar */
        controlBar?: { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: 'center' | 'left' | 'right', margin?: number, opacity?: number, verticalAlignment?: 'bottom' | 'top' };
        /** @name dxVectorMap.Options.layers */
        layers?: Array<{ borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' }> | { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' };
        /** @name dxVectorMap.Options.legends */
        legends?: Array<dxVectorMapLegends>;
        /** @name dxVectorMap.Options.maxZoomFactor */
        maxZoomFactor?: number;
        /** @name dxVectorMap.Options.onCenterChanged */
        onCenterChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, center?: Array<number> }) => any);
        /** @name dxVectorMap.Options.onClick */
        onClick?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: MapLayerElement }) => any) | string;
        /** @name dxVectorMap.Options.onSelectionChanged */
        onSelectionChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** @name dxVectorMap.Options.onTooltipHidden */
        onTooltipHidden?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** @name dxVectorMap.Options.onTooltipShown */
        onTooltipShown?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** @name dxVectorMap.Options.onZoomFactorChanged */
        onZoomFactorChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, zoomFactor?: number }) => any);
        /** @name dxVectorMap.Options.panningEnabled */
        panningEnabled?: boolean;
        /** @name dxVectorMap.Options.projection */
        projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
        /** @name dxVectorMap.Options.tooltip */
        tooltip?: dxVectorMapTooltip;
        /** @name dxVectorMap.Options.touchEnabled */
        touchEnabled?: boolean;
        /** @name dxVectorMap.Options.wheelEnabled */
        wheelEnabled?: boolean;
        /** @name dxVectorMap.Options.zoomFactor */
        zoomFactor?: number;
        /** @name dxVectorMap.Options.zoomingEnabled */
        zoomingEnabled?: boolean;
    }
    /** @name dxVectorMap.Options.legends */
    export interface dxVectorMapLegends extends BaseLegend {
        /** @name dxVectorMap.Options.legends.customizeHint */
        customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /** @name dxVectorMap.Options.legends.customizeItems */
        customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
        /** @name dxVectorMap.Options.legends.customizeText */
        customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /** @name dxVectorMap.Options.legends.font */
        font?: Font;
        /** @name dxVectorMap.Options.legends.markerColor */
        markerColor?: string;
        /** @name dxVectorMap.Options.legends.markerShape */
        markerShape?: 'circle' | 'square';
        /** @name dxVectorMap.Options.legends.markerSize */
        markerSize?: number;
        /** @name dxVectorMap.Options.legends.markerTemplate */
        markerTemplate?: DevExpress.core.template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /** @name dxVectorMap.Options.legends.source */
        source?: { grouping?: string, layer?: string };
    }
    /** @name dxVectorMap.Options.tooltip */
    export interface dxVectorMapTooltip extends BaseWidgetTooltip {
        /** @name dxVectorMap.Options.tooltip.contentTemplate */
        contentTemplate?: DevExpress.core.template | ((info: MapLayerElement, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /** @name dxVectorMap.Options.tooltip.customizeTooltip */
        customizeTooltip?: ((info: MapLayerElement) => any);
    }
    /** @name dxVectorMap */
    export class dxVectorMap extends BaseWidget {
        constructor(element: Element, options?: dxVectorMapOptions)
        constructor(element: JQuery, options?: dxVectorMapOptions)
        /** @name dxVectorMap.center() */
        center(): Array<number>;
        /** @name dxVectorMap.center(centerCoordinates) */
        center(centerCoordinates: Array<number>): void;
        /** @name dxVectorMap.clearSelection() */
        clearSelection(): void;
        /** @deprecated */
        /** @name dxVectorMap.convertCoordinates(x, y) */
        convertCoordinates(x: number, y: number): Array<number>;
        /** @name dxVectorMap.convertToGeo(x, y) */
        convertToGeo(x: number, y: number): Array<number>;
        /** @name dxVectorMap.convertToXY(longitude, latitude) */
        convertToXY(longitude: number, latitude: number): Array<number>;
        /** @name dxVectorMap.getLayerByIndex(index) */
        getLayerByIndex(index: number): MapLayer;
        /** @name dxVectorMap.getLayerByName(name) */
        getLayerByName(name: string): MapLayer;
        /** @name dxVectorMap.getLayers() */
        getLayers(): Array<MapLayer>;
        /** @name dxVectorMap.viewport() */
        viewport(): Array<number>;
        /** @name dxVectorMap.viewport(viewportCoordinates) */
        viewport(viewportCoordinates: Array<number>): void;
        /** @name dxVectorMap.zoomFactor() */
        zoomFactor(): number;
        /** @name dxVectorMap.zoomFactor(zoomFactor) */
        zoomFactor(zoomFactor: number): void;
    }
    /** @name linearCircle */
    export type linearCircle = CommonIndicator;
    /** @name linearRangeBar */
    export type linearRangeBar = CommonIndicator;
    /** @name linearRectangle */
    export type linearRectangle = CommonIndicator;
    /** @name linearRhombus */
    export type linearRhombus = CommonIndicator;
    /** @name linearTextCloud */
    export type linearTextCloud = CommonIndicator;
    /** @name linearTriangleMarker */
    export type linearTriangleMarker = CommonIndicator;
    /** @name pieChartSeriesObject */
    export class pieChartSeriesObject extends baseSeriesObject {
    }
    /** @name piePointObject */
    export class piePointObject extends basePointObject {
        /** @name piePointObject.percent */
        percent: string | number | Date;
        /** @name piePointObject.hide() */
        hide(): void;
        /** @name basePointObject.hideTooltip() */
        hideTooltip(): void;
        /** @name piePointObject.isVisible() */
        isVisible(): boolean;
        /** @name piePointObject.show() */
        show(): void;
        /** @name basePointObject.showTooltip() */
        showTooltip(): void;
    }
    /** @name polarChartSeriesObject */
    export class polarChartSeriesObject extends baseSeriesObject {
    }
    /** @name polarPointObject */
    export class polarPointObject extends basePointObject {
    }
}
declare module DevExpress.viz.map {
    /** @name viz.map.projection(data) */
    export function projection(data: VectorMapProjectionConfig): any;
}
declare module DevExpress.viz.map.projection {
    /** @name viz.map.projection.add(name, projection) */
    export function add(name: string, projection: VectorMapProjectionConfig | any): void;
    /** @name viz.map.projection.get(name) */
    export function get(name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string): any;
}
