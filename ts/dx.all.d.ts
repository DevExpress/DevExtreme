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
    dxValidationMessage(): JQuery;
    dxValidationMessage(options: "instance"): DevExpress.ui.dxValidationMessage;
    dxValidationMessage(options: string): any;
    dxValidationMessage(options: string, ...params: any[]): any;
    dxValidationMessage(options: DevExpress.ui.dxValidationMessageOptions): JQuery;
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
    /**
     * <-Component.Options->
     */
    export interface ComponentOptions<T = Component> {
        /**
         * <-Component.Options.onDisposing->
         */
        onDisposing?: ((e: { component?: T }) => any);
        /**
         * <-Component.Options.onInitialized->
         */
        onInitialized?: ((e: { component?: T, element?: DevExpress.core.dxElement }) => any);
        /**
         * <-Component.Options.onOptionChanged->
         */
        onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => any);
    }
    /**
     * <-Component->
     */
    export class Component {
        constructor(options?: ComponentOptions);
        /**
         * <-Component.beginUpdate()->
         */
        beginUpdate(): void;
        /**
         * <-Component.endUpdate()->
         */
        endUpdate(): void;
        /**
         * <-Component.instance()->
         */
        instance(): this;
        /**
         * <-Component.off(eventName)->
         */
        off(eventName: string): this;
        /**
         * <-Component.off(eventName, eventHandler)->
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * <-Component.on(eventName, eventHandler)->
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * <-Component.on(events)->
         */
        on(events: any): this;
        /**
         * <-Component.option()->
         */
        option(): any;
        /**
         * <-Component.option(optionName)->
         */
        option(optionName: string): any;
        /**
         * <-Component.option(optionName, optionValue)->
         */
        option(optionName: string, optionValue: any): void;
        /**
         * <-Component.option(options)->
         */
        option(options: any): void;
        /**
         * <-Component.resetOption(optionName)->
         */
        resetOption(optionName: string): void;
    }
    /**
     * <-DOMComponent.Options->
     */
    export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
        /**
         * <-DOMComponent.Options.bindingOptions->
         */
        bindingOptions?: any;
        /**
         * <-DOMComponent.Options.elementAttr->
         */
        elementAttr?: any;
        /**
         * <-DOMComponent.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-DOMComponent.Options.onDisposing->
         */
        onDisposing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-DOMComponent.Options.onOptionChanged->
         */
        onOptionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, name?: string, fullName?: string, value?: any }) => any);
        /**
         * <-DOMComponent.Options.rtlEnabled->
         */
        rtlEnabled?: boolean;
        /**
         * <-DOMComponent.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-DOMComponent->
     */
    export class DOMComponent extends Component {
        constructor(element: Element | JQuery, options?: DOMComponentOptions);
        /**
         * <-DOMComponent.defaultOptions(rule)->
         */
        static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
        /**
         * <-DOMComponent.dispose()->
         */
        dispose(): void;
        /**
         * <-DOMComponent.element()->
         */
        element(): DevExpress.core.dxElement;
        /**
         * <-DOMComponent.getInstance(element)->
         */
        static getInstance(element: Element | JQuery): DOMComponent;
    }
    /**
     * <-DataHelperMixin->
     */
    export class DataHelperMixin {
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-Device->
     */
    export interface Device {
        /**
         * <-Device.android->
         */
        android?: boolean;
        /**
         * <-Device.deviceType->
         */
        deviceType?: 'phone' | 'tablet' | 'desktop';
        /**
         * <-Device.generic->
         */
        generic?: boolean;
        /**
         * <-Device.grade->
         */
        grade?: 'A' | 'B' | 'C';
        /**
         * <-Device.ios->
         */
        ios?: boolean;
        /**
         * <-Device.phone->
         */
        phone?: boolean;
        /**
         * <-Device.platform->
         */
        platform?: 'android' | 'ios' | 'generic';
        /**
         * <-Device.tablet->
         */
        tablet?: boolean;
        /**
         * <-Device.version->
         */
        version?: Array<number>;
    }
    /**
     * <-DevicesObject->
     */
    export class DevicesObject {
        constructor(options: { window?: Window });
        /**
         * <-DevicesObject.current()->
         */
        current(): Device;
        /**
         * <-DevicesObject.current(deviceName)->
         */
        current(deviceName: string | Device): void;
        /**
         * <-DevicesObject.off(eventName)->
         */
        off(eventName: string): this;
        /**
         * <-DevicesObject.off(eventName, eventHandler)->
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * <-DevicesObject.on(eventName, eventHandler)->
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * <-DevicesObject.on(events)->
         */
        on(events: any): this;
        /**
         * <-DevicesObject.orientation()->
         */
        orientation(): string;
        /**
         * <-DevicesObject.real()->
         */
        real(): Device;
    }
    /**
     * <-EndpointSelector->
     */
    export class EndpointSelector {
        constructor(options: any);
        /**
         * <-EndpointSelector.urlFor(key)->
         */
        urlFor(key: string): string;
    }
    /**
     * <-TransitionExecutor->
     */
    export class TransitionExecutor {
        /**
         * <-TransitionExecutor.enter(elements, animation)->
         */
        enter(elements: JQuery, animation: animationConfig | string): void;
        /**
         * <-TransitionExecutor.leave(elements, animation)->
         */
        leave(elements: JQuery, animation: animationConfig | string): void;
        /**
         * <-TransitionExecutor.reset()->
         */
        reset(): void;
        /**
         * <-TransitionExecutor.start()->
         */
        start(): Promise<void> & JQueryPromise<void>;
        /**
         * <-TransitionExecutor.stop()->
         */
        stop(): void;
    }
    /**
     * <-animationConfig->
     */
    export interface animationConfig {
        /**
         * <-animationConfig.complete->
         */
        complete?: (($element: DevExpress.core.dxElement, config: any) => any);
        /**
         * <-animationConfig.delay->
         */
        delay?: number;
        /**
         * <-animationConfig.direction->
         */
        direction?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * <-animationConfig.duration->
         */
        duration?: number;
        /**
         * <-animationConfig.easing->
         */
        easing?: string;
        /**
         * <-animationConfig.from->
         */
        from?: number | string | any;
        /**
         * <-animationConfig.staggerDelay->
         */
        staggerDelay?: number;
        /**
         * <-animationConfig.start->
         */
        start?: (($element: DevExpress.core.dxElement, config: any) => any);
        /**
         * <-animationConfig.to->
         */
        to?: number | string | any;
        /**
         * <-animationConfig.type->
         */
        type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
    }
    /**
     * <-animationPresets->
     */
    export class animationPresets {
        /**
         * <-animationPresets.applyChanges()->
         */
        applyChanges(): void;
        /**
         * <-animationPresets.clear()->
         */
        clear(): void;
        /**
         * <-animationPresets.clear(name)->
         */
        clear(name: string): void;
        /**
         * <-animationPresets.getPreset(name)->
         */
        getPreset(name: string): any;
        /**
         * <-animationPresets.registerDefaultPresets()->
         */
        registerDefaultPresets(): void;
        /**
         * <-animationPresets.registerPreset(name, config)->
         */
        registerPreset(name: string, config: { animation?: animationConfig, device?: Device }): void;
        /**
         * <-animationPresets.resetToDefaults()->
         */
        resetToDefaults(): void;
    }
    /**
     * <-config()->
     */
    export function config(): globalConfig;
    /**
     * <-config(config)->
     */
    export function config(config: globalConfig): void;
    /**
     * <-devices->
     */
    export var devices: DevicesObject;
    /**
     * <-globalConfig->
     */
    export interface globalConfig {
        /**
         * <-globalConfig.decimalSeparator->
         * @deprecated <-globalConfig.decimalSeparator:depNote->
         */
        decimalSeparator?: string;
        /**
         * <-globalConfig.defaultCurrency->
         */
        defaultCurrency?: string;
        /**
         * <-globalConfig.editorStylingMode->
         */
        editorStylingMode?: 'outlined' | 'underlined' | 'filled';
        /**
         * <-globalConfig.floatingActionButtonConfig->
         */
        floatingActionButtonConfig?: { closeIcon?: string, direction?: 'auto' | 'up' | 'down', icon?: string, label?: string, maxSpeedDialActionCount?: number, position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function, shading?: boolean };
        /**
         * <-globalConfig.forceIsoDateParsing->
         */
        forceIsoDateParsing?: boolean;
        /**
         * <-globalConfig.oDataFilterToLower->
         */
        oDataFilterToLower?: boolean;
        /**
         * <-globalConfig.rtlEnabled->
         */
        rtlEnabled?: boolean;
        /**
         * <-globalConfig.serverDecimalSeparator->
         */
        serverDecimalSeparator?: string;
        /**
         * <-globalConfig.thousandsSeparator->
         * @deprecated <-globalConfig.thousandsSeparator:depNote->
         */
        thousandsSeparator?: string;
        /**
         * <-globalConfig.useLegacyStoreResult->
         */
        useLegacyStoreResult?: boolean;
        /**
         * <-globalConfig.useLegacyVisibleIndex->
         */
        useLegacyVisibleIndex?: boolean;
    }
    /**
     * <-hideTopOverlay()->
     */
    export function hideTopOverlay(): boolean;
    /**
     * <-localization->
     */
    export class localization {
        /**
         * <-localization.formatDate(value, format)->
         */
        static formatDate(value: Date, format: DevExpress.ui.format): string;
        /**
         * <-localization.formatMessage(key, value)->
         */
        static formatMessage(key: string, value: string | Array<string>): string;
        /**
         * <-localization.formatNumber(value, format)->
         */
        static formatNumber(value: number, format: DevExpress.ui.format): string;
        /**
         * <-localization.loadMessages(messages)->
         */
        static loadMessages(messages: any): void;
        /**
         * <-localization.locale()->
         */
        static locale(): string;
        /**
         * <-localization.locale(locale)->
         */
        static locale(locale: string): void;
        /**
         * <-localization.parseDate(text, format)->
         */
        static parseDate(text: string, format: DevExpress.ui.format): Date;
        /**
         * <-localization.parseNumber(text, format)->
         */
        static parseNumber(text: string, format: DevExpress.ui.format): number;
    }
    /**
     * <-positionConfig->
     */
    export interface positionConfig {
        /**
         * <-positionConfig.at->
         */
        at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /**
         * <-positionConfig.boundary->
         */
        boundary?: string | Element | JQuery | Window;
        /**
         * <-positionConfig.boundaryOffset->
         */
        boundaryOffset?: string | { x?: number, y?: number };
        /**
         * <-positionConfig.collision->
         */
        collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | { x?: 'fit' | 'flip' | 'flipfit' | 'none', y?: 'fit' | 'flip' | 'flipfit' | 'none' };
        /**
         * <-positionConfig.my->
         */
        my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /**
         * <-positionConfig.of->
         */
        of?: string | Element | JQuery | Window;
        /**
         * <-positionConfig.offset->
         */
        offset?: string | { x?: number, y?: number };
    }
    /**
     * <-registerComponent(name, componentClass)->
     */
    export function registerComponent(name: string, componentClass: any): void;
    /**
     * <-registerComponent(name, namespace, componentClass)->
     */
    export function registerComponent(name: string, namespace: any, componentClass: any): void;
    /**
     * <-setTemplateEngine(name)->
     */
    export function setTemplateEngine(templateEngineName: string): void;
    /**
     * <-setTemplateEngine(options)->
     */
    export function setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    /**
     * <-ui->
     */
    export class ui {
        /**
         * <-ui.notify(message,type,displayTime)->
         */
        static notify(message: string, type?: string, displayTime?: number): void;
        /**
         * <-ui.notify(options,type,displayTime)->
         */
        static notify(options: any, type?: string, displayTime?: number): void;
        /**
         * <-ui.repaintFloatingActionButton()->
         */
        static repaintFloatingActionButton(): void;
        /**
         * <-ui.setTemplateEngine(name)->
         */
        static setTemplateEngine(templateEngineName: string): void;
        /**
         * <-ui.setTemplateEngine(options)->
         */
        static setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    }
    /**
     * <-validationEngine->
     */
    export class validationEngine {
        /**
         * <-validationEngine.getGroupConfig()->
         */
        static getGroupConfig(): any;
        /**
         * <-validationEngine.getGroupConfig(group)->
         */
        static getGroupConfig(group: string | any): any;
        /**
         * <-validationEngine.registerModelForValidation(model)->
         */
        static registerModelForValidation(model: any): void;
        /**
         * <-validationEngine.resetGroup()->
         */
        static resetGroup(): void;
        /**
         * <-validationEngine.resetGroup(group)->
         */
        static resetGroup(group: string | any): void;
        /**
         * <-validationEngine.unregisterModelForValidation(model)->
         */
        static unregisterModelForValidation(model: any): void;
        /**
         * <-validationEngine.validateGroup()->
         */
        static validateGroup(): DevExpress.ui.dxValidationGroupResult;
        /**
         * <-validationEngine.validateGroup(group)->
         */
        static validateGroup(group: string | any): DevExpress.ui.dxValidationGroupResult;
        /**
         * <-validationEngine.validateModel(model)->
         */
        static validateModel(model: any): any;
    }
    /**
     * <-viz->
     */
    export class viz {
        /**
         * <-viz.currentPalette()->
         */
        static currentPalette(): string;
        /**
         * <-viz.currentPalette(paletteName)->
         */
        static currentPalette(paletteName: string): void;
        /**
         * <-viz.currentTheme()->
         */
        static currentTheme(): string;
        /**
         * <-viz.currentTheme(platform, colorScheme)->
         */
        static currentTheme(platform: string, colorScheme: string): void;
        /**
         * <-viz.currentTheme(theme)->
         */
        static currentTheme(theme: string): void;
        /**
         * <-viz.exportFromMarkup(markup, options)->
         */
        static exportFromMarkup(markup: string, options: { fileName?: string, format?: string, backgroundColor?: string, proxyUrl?: string, width?: number, height?: number, onExporting?: Function, onExported?: Function, onFileSaving?: Function, margin?: number, svgToCanvas?: Function }): void;
        /**
         * <-viz.exportWidgets(widgetInstances)->
         */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>): void;
        /**
         * <-viz.exportWidgets(widgetInstances, options)->
         */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>, options: { fileName?: string, format?: 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG', backgroundColor?: string, margin?: number, gridLayout?: boolean, verticalAlignment?: 'bottom' | 'center' | 'top', horizontalAlignment?: 'center' | 'left' | 'right', proxyUrl?: string, onExporting?: Function, onExported?: Function, onFileSaving?: Function, svgToCanvas?: Function }): void;
        /**
         * <-viz.generateColors(palette, count, options)->
         */
        static generateColors(palette: 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office' | Array<string>, count: number, options: { paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet' }): Array<string>;
        /**
         * <-viz.getMarkup(widgetInstances)->
         */
        static getMarkup(widgetInstances: Array<DOMComponent>): string;
        /**
         * <-viz.getPalette(paletteName)->
         */
        static getPalette(paletteName: string): any;
        /**
         * <-viz.getTheme(theme)->
         */
        static getTheme(theme: string): any;
        /**
         * <-viz.refreshPaths()->
         */
        static refreshPaths(): void;
        /**
         * <-viz.refreshTheme()->
         */
        static refreshTheme(): void;
        /**
         * <-viz.registerPalette(paletteName, palette)->
         */
        static registerPalette(paletteName: string, palette: any): void;
        /**
         * <-viz.registerTheme(customTheme, baseTheme)->
         */
        static registerTheme(customTheme: any, baseTheme: string): void;
    }
}
declare module DevExpress.core {
    /**
     * <-dxElement->
     */
    export type dxElement = HTMLElement & JQuery;
    /**
     * <-dxSVGElement->
     */
    export type dxSVGElement = SVGElement & JQuery;
    /**
     * <-dxTemplate.Options->
     */
    export interface dxTemplateOptions {
        /**
         * <-dxTemplate.Options.name->
         */
        name?: string;
    }
    /**
     * <-dxTemplate->
     */
    export class dxTemplate {
        constructor(options?: dxTemplateOptions)
    }
    /**
     * <-template->
     */
    export type template = string | Function | Element | JQuery;
}
declare module DevExpress.data {
    /**
     * <-ArrayStore.Options->
     */
    export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
        /**
         * <-ArrayStore.Options.data->
         */
        data?: Array<any>;
    }
    /**
     * <-ArrayStore->
     */
    export class ArrayStore extends Store {
        constructor(options?: ArrayStoreOptions)
        /**
         * <-ArrayStore.clear()->
         */
        clear(): void;
        /**
         * <-ArrayStore.createQuery()->
         */
        createQuery(): any;
    }
    /**
     * <-CustomStore.Options->
     */
    export interface CustomStoreOptions extends StoreOptions<CustomStore> {
        /**
         * <-CustomStore.Options.byKey->
         */
        byKey?: ((key: any | string | number) => Promise<any> | JQueryPromise<any>);
        /**
         * <-CustomStore.Options.cacheRawData->
         */
        cacheRawData?: boolean;
        /**
         * <-CustomStore.Options.insert->
         */
        insert?: ((values: any) => Promise<any> | JQueryPromise<any>);
        /**
         * <-CustomStore.Options.load->
         */
        load?: ((options: LoadOptions) => Promise<any> | JQueryPromise<any> | Array<any>);
        /**
         * <-CustomStore.Options.loadMode->
         */
        loadMode?: 'processed' | 'raw';
        /**
         * <-CustomStore.Options.remove->
         */
        remove?: ((key: any | string | number) => Promise<void> | JQueryPromise<void>);
        /**
         * <-CustomStore.Options.totalCount->
         */
        totalCount?: ((loadOptions: { filter?: any, group?: any }) => Promise<number> | JQueryPromise<number>);
        /**
         * <-CustomStore.Options.update->
         */
        update?: ((key: any | string | number, values: any) => Promise<any> | JQueryPromise<any>);
        /**
         * <-CustomStore.Options.useDefaultSearch->
         */
        useDefaultSearch?: boolean;
    }
    /**
     * <-CustomStore->
     */
    export class CustomStore extends Store {
        constructor(options?: CustomStoreOptions)
        /**
         * <-CustomStore.clearRawDataCache()->
         */
        clearRawDataCache(): void;
    }
    /**
     * <-DataSource.Options->
     */
    export interface DataSourceOptions {
        /**
         * <-DataSource.Options.customQueryParams->
         */
        customQueryParams?: any;
        /**
         * <-DataSource.Options.expand->
         */
        expand?: Array<string> | string;
        /**
         * <-DataSource.Options.filter->
         */
        filter?: string | Array<any> | Function;
        /**
         * <-DataSource.Options.group->
         */
        group?: string | Array<any> | Function;
        /**
         * <-DataSource.Options.map->
         */
        map?: ((dataItem: any) => any);
        /**
         * <-DataSource.Options.onChanged->
         */
        onChanged?: ((e: { changes?: Array<any> }) => any);
        /**
         * <-DataSource.Options.onLoadError->
         */
        onLoadError?: ((error: { message?: string }) => any);
        /**
         * <-DataSource.Options.onLoadingChanged->
         */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /**
         * <-DataSource.Options.pageSize->
         */
        pageSize?: number;
        /**
         * <-DataSource.Options.paginate->
         */
        paginate?: boolean;
        /**
         * <-DataSource.Options.postProcess->
         */
        postProcess?: ((data: Array<any>) => Array<any>);
        /**
         * <-DataSource.Options.pushAggregationTimeout->
         */
        pushAggregationTimeout?: number;
        /**
         * <-DataSource.Options.requireTotalCount->
         */
        requireTotalCount?: boolean;
        /**
         * <-DataSource.Options.reshapeOnPush->
         */
        reshapeOnPush?: boolean;
        /**
         * <-DataSource.Options.searchExpr->
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * <-DataSource.Options.searchOperation->
         */
        searchOperation?: string;
        /**
         * <-DataSource.Options.searchValue->
         */
        searchValue?: any;
        /**
         * <-DataSource.Options.select->
         */
        select?: string | Array<any> | Function;
        /**
         * <-DataSource.Options.sort->
         */
        sort?: string | Array<any> | Function;
        /**
         * <-DataSource.Options.store->
         */
        store?: Store | StoreOptions | Array<any> | any;
    }
    /**
     * <-DataSource->
     */
    export class DataSource {
        constructor(data: Array<any>);
        constructor(options: CustomStoreOptions | DataSourceOptions);
        constructor(store: Store);
        constructor(url: string);
        /**
         * <-DataSource.cancel(operationId)->
         */
        cancel(): boolean;
        /**
         * <-DataSource.dispose()->
         */
        dispose(): void;
        /**
         * <-DataSource.filter()->
         */
        filter(): any;
        /**
         * <-DataSource.filter(filterExpr)->
         */
        filter(filterExpr: any): void;
        /**
         * <-DataSource.group()->
         */
        group(): any;
        /**
         * <-DataSource.group(groupExpr)->
         */
        group(groupExpr: any): void;
        /**
         * <-DataSource.isLastPage()->
         */
        isLastPage(): boolean;
        /**
         * <-DataSource.isLoaded()->
         */
        isLoaded(): boolean;
        /**
         * <-DataSource.isLoading()->
         */
        isLoading(): boolean;
        /**
         * <-DataSource.items()->
         */
        items(): Array<any>;
        /**
         * <-DataSource.key()->
         */
        key(): any & string & number;
        /**
         * <-DataSource.load()->
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * <-DataSource.loadOptions()->
         */
        loadOptions(): any;
        /**
         * <-DataSource.off(eventName)->
         */
        off(eventName: string): this;
        /**
         * <-DataSource.off(eventName, eventHandler)->
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * <-DataSource.on(eventName, eventHandler)->
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * <-DataSource.on(events)->
         */
        on(events: any): this;
        /**
         * <-DataSource.pageIndex()->
         */
        pageIndex(): number;
        /**
         * <-DataSource.pageIndex(newIndex)->
         */
        pageIndex(newIndex: number): void;
        /**
         * <-DataSource.pageSize()->
         */
        pageSize(): number;
        /**
         * <-DataSource.pageSize(value)->
         */
        pageSize(value: number): void;
        /**
         * <-DataSource.paginate()->
         */
        paginate(): boolean;
        /**
         * <-DataSource.paginate(value)->
         */
        paginate(value: boolean): void;
        /**
         * <-DataSource.reload()->
         */
        reload(): Promise<any> & JQueryPromise<any>;
        /**
         * <-DataSource.requireTotalCount()->
         */
        requireTotalCount(): boolean;
        /**
         * <-DataSource.requireTotalCount(value)->
         */
        requireTotalCount(value: boolean): void;
        /**
         * <-DataSource.searchExpr()->
         */
        searchExpr(): string & Function & Array<string | Function>;
        /**
         * <-DataSource.searchExpr(expr)->
         */
        searchExpr(expr: string | Function | Array<string | Function>): void;
        /**
         * <-DataSource.searchOperation()->
         */
        searchOperation(): string;
        /**
         * <-DataSource.searchOperation(op)->
         */
        searchOperation(op: string): void;
        /**
         * <-DataSource.searchValue()->
         */
        searchValue(): any;
        /**
         * <-DataSource.searchValue(value)->
         */
        searchValue(value: any): void;
        /**
         * <-DataSource.select()->
         */
        select(): any;
        /**
         * <-DataSource.select(expr)->
         */
        select(expr: any): void;
        /**
         * <-DataSource.sort()->
         */
        sort(): any;
        /**
         * <-DataSource.sort(sortExpr)->
         */
        sort(sortExpr: any): void;
        /**
         * <-DataSource.store()->
         */
        store(): any;
        /**
         * <-DataSource.totalCount()->
         */
        totalCount(): number;
    }
    /**
     * <-EdmLiteral->
     */
    export class EdmLiteral {
        constructor(value: string);
        /**
         * <-EdmLiteral.valueOf()->
         */
        valueOf(): string;
    }
    /**
     * <-Guid->
     */
    export class Guid {
        constructor();
        constructor(value: string);
        /**
         * <-Guid.toString()->
         */
        toString(): string;
        /**
         * <-Guid.valueOf()->
         */
        valueOf(): string;
    }
    /**
     * <-LoadOptions->
     */
    export interface LoadOptions {
        /**
         * <-LoadOptions.customQueryParams->
         */
        customQueryParams?: any;
        /**
         * <-LoadOptions.expand->
         */
        expand?: any;
        /**
         * <-LoadOptions.filter->
         */
        filter?: any;
        /**
         * <-LoadOptions.group->
         */
        group?: any;
        /**
         * <-LoadOptions.groupSummary->
         */
        groupSummary?: any;
        /**
         * <-LoadOptions.parentIds->
         */
        parentIds?: Array<any>;
        /**
         * <-LoadOptions.requireGroupCount->
         */
        requireGroupCount?: boolean;
        /**
         * <-LoadOptions.requireTotalCount->
         */
        requireTotalCount?: boolean;
        /**
         * <-LoadOptions.searchExpr->
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * <-LoadOptions.searchOperation->
         */
        searchOperation?: string;
        /**
         * <-LoadOptions.searchValue->
         */
        searchValue?: any;
        /**
         * <-LoadOptions.select->
         */
        select?: any;
        /**
         * <-LoadOptions.skip->
         */
        skip?: number;
        /**
         * <-LoadOptions.sort->
         */
        sort?: any;
        /**
         * <-LoadOptions.take->
         */
        take?: number;
        /**
         * <-LoadOptions.totalSummary->
         */
        totalSummary?: any;
        /**
         * <-LoadOptions.userData->
         */
        userData?: any;
    }
    /**
     * <-LocalStore.Options->
     */
    export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
        /**
         * <-LocalStore.Options.flushInterval->
         */
        flushInterval?: number;
        /**
         * <-LocalStore.Options.immediate->
         */
        immediate?: boolean;
        /**
         * <-LocalStore.Options.name->
         */
        name?: string;
    }
    /**
     * <-LocalStore->
     */
    export class LocalStore extends ArrayStore {
        constructor(options?: LocalStoreOptions)
        /**
         * <-LocalStore.clear()->
         */
        clear(): void;
    }
    /**
     * <-ODataContext.Options->
     */
    export interface ODataContextOptions {
        /**
         * <-ODataContext.Options.beforeSend->
         */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /**
         * <-ODataContext.Options.deserializeDates->
         */
        deserializeDates?: boolean;
        /**
         * <-ODataContext.Options.entities->
         */
        entities?: any;
        /**
         * <-ODataContext.Options.errorHandler->
         */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /**
         * <-ODataContext.Options.filterToLower->
         */
        filterToLower?: boolean;
        /**
         * <-ODataContext.Options.jsonp->
         */
        jsonp?: boolean;
        /**
         * <-ODataContext.Options.url->
         */
        url?: string;
        /**
         * <-ODataContext.Options.version->
         */
        version?: number;
        /**
         * <-ODataContext.Options.withCredentials->
         */
        withCredentials?: boolean;
    }
    /**
     * <-ODataContext->
     */
    export class ODataContext {
        constructor(options?: ODataContextOptions)
        /**
         * <-ODataContext.get(operationName, params)->
         */
        get(operationName: string, params: any): Promise<any> & JQueryPromise<any>;
        /**
         * <-ODataContext.invoke(operationName, params, httpMethod)->
         */
        invoke(operationName: string, params: any, httpMethod: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-ODataContext.objectLink(entityAlias, key)->
         */
        objectLink(entityAlias: string, key: any | string | number): any;
    }
    /**
     * <-ODataStore.Options->
     */
    export interface ODataStoreOptions extends StoreOptions<ODataStore> {
        /**
         * <-ODataStore.Options.beforeSend->
         */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /**
         * <-ODataStore.Options.deserializeDates->
         */
        deserializeDates?: boolean;
        /**
         * <-ODataStore.Options.errorHandler->
         */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /**
         * <-ODataStore.Options.fieldTypes->
         */
        fieldTypes?: any;
        /**
         * <-ODataStore.Options.filterToLower->
         */
        filterToLower?: boolean;
        /**
         * <-ODataStore.Options.jsonp->
         */
        jsonp?: boolean;
        /**
         * <-ODataStore.Options.keyType->
         */
        keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
        /**
         * <-ODataStore.Options.onLoading->
         */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /**
         * <-ODataStore.Options.url->
         */
        url?: string;
        /**
         * <-ODataStore.Options.version->
         */
        version?: number;
        /**
         * <-ODataStore.Options.withCredentials->
         */
        withCredentials?: boolean;
    }
    /**
     * <-ODataStore->
     */
    export class ODataStore extends Store {
        constructor(options?: ODataStoreOptions)
        /**
         * <-Store.byKey(key)->
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * <-ODataStore.byKey(key, extraOptions)->
         */
        byKey(key: any | string | number, extraOptions: { expand?: string | Array<string>, select?: string | Array<string> }): Promise<any> & JQueryPromise<any>;
        /**
         * <-ODataStore.createQuery(loadOptions)->
         */
        createQuery(loadOptions: any): any;
    }
    /**
     * <-PivotGridDataSource.Options->
     */
    export interface PivotGridDataSourceOptions {
        /**
         * <-PivotGridDataSource.Options.fields->
         */
        fields?: Array<PivotGridDataSourceField>;
        /**
         * <-PivotGridDataSource.Options.filter->
         */
        filter?: string | Array<any> | Function;
        /**
         * <-PivotGridDataSource.Options.onChanged->
         */
        onChanged?: Function;
        /**
         * <-PivotGridDataSource.Options.onFieldsPrepared->
         */
        onFieldsPrepared?: ((fields: Array<PivotGridDataSourceField>) => any);
        /**
         * <-PivotGridDataSource.Options.onLoadError->
         */
        onLoadError?: ((error: any) => any);
        /**
         * <-PivotGridDataSource.Options.onLoadingChanged->
         */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /**
         * <-PivotGridDataSource.Options.paginate->
         */
        paginate?: boolean;
        /**
         * <-PivotGridDataSource.Options.remoteOperations->
         */
        remoteOperations?: boolean;
        /**
         * <-PivotGridDataSource.Options.retrieveFields->
         */
        retrieveFields?: boolean;
        /**
         * <-PivotGridDataSource.Options.store->
         */
        store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{ type?: 'array' | 'local' | 'odata' | 'xmla' }> | { type?: 'array' | 'local' | 'odata' | 'xmla' };
    }
    /**
     * <-PivotGridDataSource.Options.fields->
     */
    export interface PivotGridDataSourceField {
        /**
         * <-PivotGridDataSource.Options.fields.allowCrossGroupCalculation->
         */
        allowCrossGroupCalculation?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.allowExpandAll->
         */
        allowExpandAll?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.allowFiltering->
         */
        allowFiltering?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.allowSorting->
         */
        allowSorting?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.allowSortingBySummary->
         */
        allowSortingBySummary?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.area->
         */
        area?: 'column' | 'data' | 'filter' | 'row' | undefined;
        /**
         * <-PivotGridDataSource.Options.fields.areaIndex->
         */
        areaIndex?: number;
        /**
         * <-PivotGridDataSource.Options.fields.calculateCustomSummary->
         */
        calculateCustomSummary?: ((options: { summaryProcess?: string, value?: any, totalValue?: any }) => any);
        /**
         * <-PivotGridDataSource.Options.fields.calculateSummaryValue->
         */
        calculateSummaryValue?: ((e: DevExpress.ui.dxPivotGridSummaryCell) => number);
        /**
         * <-PivotGridDataSource.Options.fields.caption->
         */
        caption?: string;
        /**
         * <-PivotGridDataSource.Options.fields.customizeText->
         */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string }) => string);
        /**
         * <-PivotGridDataSource.Options.fields.dataField->
         */
        dataField?: string;
        /**
         * <-PivotGridDataSource.Options.fields.dataType->
         */
        dataType?: 'date' | 'number' | 'string';
        /**
         * <-PivotGridDataSource.Options.fields.displayFolder->
         */
        displayFolder?: string;
        /**
         * <-PivotGridDataSource.Options.fields.expanded->
         */
        expanded?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.filterType->
         */
        filterType?: 'exclude' | 'include';
        /**
         * <-PivotGridDataSource.Options.fields.filterValues->
         */
        filterValues?: Array<any>;
        /**
         * <-PivotGridDataSource.Options.fields.format->
         */
        format?: DevExpress.ui.format;
        /**
         * <-PivotGridDataSource.Options.fields.groupIndex->
         */
        groupIndex?: number;
        /**
         * <-PivotGridDataSource.Options.fields.groupInterval->
         */
        groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
        /**
         * <-PivotGridDataSource.Options.fields.groupName->
         */
        groupName?: string;
        /**
         * <-PivotGridDataSource.Options.fields.headerFilter->
         */
        headerFilter?: { allowSearch?: boolean, height?: number, width?: number };
        /**
         * <-PivotGridDataSource.Options.fields.isMeasure->
         */
        isMeasure?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.name->
         */
        name?: string;
        /**
         * <-PivotGridDataSource.Options.fields.runningTotal->
         */
        runningTotal?: 'column' | 'row';
        /**
         * <-PivotGridDataSource.Options.fields.selector->
         */
        selector?: Function;
        /**
         * <-PivotGridDataSource.Options.fields.showGrandTotals->
         */
        showGrandTotals?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.showTotals->
         */
        showTotals?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.showValues->
         */
        showValues?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.sortBy->
         */
        sortBy?: 'displayText' | 'value' | 'none';
        /**
         * <-PivotGridDataSource.Options.fields.sortBySummaryField->
         */
        sortBySummaryField?: string;
        /**
         * <-PivotGridDataSource.Options.fields.sortBySummaryPath->
         */
        sortBySummaryPath?: Array<number | string>;
        /**
         * <-PivotGridDataSource.Options.fields.sortOrder->
         */
        sortOrder?: 'asc' | 'desc';
        /**
         * <-PivotGridDataSource.Options.fields.sortingMethod->
         */
        sortingMethod?: ((a: { value?: string | number, children?: Array<any> }, b: { value?: string | number, children?: Array<any> }) => number);
        /**
         * <-PivotGridDataSource.Options.fields.summaryDisplayMode->
         */
        summaryDisplayMode?: 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';
        /**
         * <-PivotGridDataSource.Options.fields.summaryType->
         */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
        /**
         * <-PivotGridDataSource.Options.fields.visible->
         */
        visible?: boolean;
        /**
         * <-PivotGridDataSource.Options.fields.width->
         */
        width?: number;
        /**
         * <-PivotGridDataSource.Options.fields.wordWrapEnabled->
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * <-PivotGridDataSource->
     */
    export class PivotGridDataSource {
        constructor(options?: PivotGridDataSourceOptions)
        /**
         * <-PivotGridDataSource.collapseAll(id)->
         */
        collapseAll(id: number | string): void;
        /**
         * <-PivotGridDataSource.collapseHeaderItem(area, path)->
         */
        collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
        /**
         * <-PivotGridDataSource.createDrillDownDataSource(options)->
         */
        createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>, rowPath?: Array<string | number | Date>, dataIndex?: number, maxRowCount?: number, customColumns?: Array<string> }): DataSource;
        /**
         * <-PivotGridDataSource.dispose()->
         */
        dispose(): void;
        /**
         * <-PivotGridDataSource.expandAll(id)->
         */
        expandAll(id: number | string): void;
        /**
         * <-PivotGridDataSource.expandHeaderItem(area, path)->
         */
        expandHeaderItem(area: string, path: Array<any>): void;
        /**
         * <-PivotGridDataSource.field(id)->
         */
        field(id: number | string): any;
        /**
         * <-PivotGridDataSource.field(id, options)->
         */
        field(id: number | string, options: any): void;
        /**
         * <-PivotGridDataSource.fields()->
         */
        fields(): Array<PivotGridDataSourceField>;
        /**
         * <-PivotGridDataSource.fields(fields)->
         */
        fields(fields: Array<PivotGridDataSourceField>): void;
        /**
         * <-PivotGridDataSource.filter()->
         */
        filter(): any;
        /**
         * <-PivotGridDataSource.filter(filterExpr)->
         */
        filter(filterExpr: any): void;
        /**
         * <-PivotGridDataSource.getAreaFields(area, collectGroups)->
         */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridDataSourceField>;
        /**
         * <-PivotGridDataSource.getData()->
         */
        getData(): any;
        /**
         * <-PivotGridDataSource.isLoading()->
         */
        isLoading(): boolean;
        /**
         * <-PivotGridDataSource.load()->
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * <-PivotGridDataSource.off(eventName)->
         */
        off(eventName: string): this;
        /**
         * <-PivotGridDataSource.off(eventName, eventHandler)->
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * <-PivotGridDataSource.on(eventName, eventHandler)->
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * <-PivotGridDataSource.on(events)->
         */
        on(events: any): this;
        /**
         * <-PivotGridDataSource.reload()->
         */
        reload(): Promise<any> & JQueryPromise<any>;
        /**
         * <-PivotGridDataSource.state()->
         */
        state(): any;
        /**
         * <-PivotGridDataSource.state(state)->
         */
        state(state: any): void;
    }
    /**
     * <-Query->
     */
    export class Query {
        /**
         * <-Query.aggregate(seed, step, finalize)->
         */
        aggregate(seed: any, step: Function, finalize: Function): Promise<any> & JQueryPromise<any>;
        /**
         * <-Query.aggregate(step)->
         */
        aggregate(step: Function): Promise<any> & JQueryPromise<any>;
        /**
         * <-Query.avg()->
         */
        avg(): Promise<number> & JQueryPromise<number>;
        /**
         * <-Query.avg(getter)->
         */
        avg(getter: any): Promise<number> & JQueryPromise<number>;
        /**
         * <-Query.count()->
         */
        count(): Promise<number> & JQueryPromise<number>;
        /**
         * <-Query.enumerate()->
         */
        enumerate(): Promise<any> & JQueryPromise<any>;
        /**
         * <-Query.filter(criteria)->
         */
        filter(criteria: Array<any>): Query;
        /**
         * <-Query.filter(predicate)->
         */
        filter(predicate: Function): Query;
        /**
         * <-Query.groupBy(getter)->
         */
        groupBy(getter: any): Query;
        /**
         * <-Query.max()->
         */
        max(): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * <-Query.max(getter)->
         */
        max(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * <-Query.min()->
         */
        min(): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * <-Query.min(getter)->
         */
        min(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * <-Query.select(getter)->
         */
        select(getter: any): Query;
        /**
         * <-Query.slice(skip, take)->
         */
        slice(skip: number, take?: number): Query;
        /**
         * <-Query.sortBy(getter)->
         */
        sortBy(getter: any): Query;
        /**
         * <-Query.sortBy(getter, desc)->
         */
        sortBy(getter: any, desc: boolean): Query;
        /**
         * <-Query.sum()->
         */
        sum(): Promise<number> & JQueryPromise<number>;
        /**
         * <-Query.sum(getter)->
         */
        sum(getter: any): Promise<number> & JQueryPromise<number>;
        /**
         * <-Query.thenBy(getter)->
         */
        thenBy(getter: any): Query;
        /**
         * <-Query.thenBy(getter, desc)->
         */
        thenBy(getter: any, desc: boolean): Query;
        /**
         * <-Query.toArray()->
         */
        toArray(): Array<any>;
    }
    /**
     * <-Store.Options->
     */
    export interface StoreOptions<T = Store> {
        /**
         * <-Store.Options.errorHandler->
         */
        errorHandler?: Function;
        /**
         * <-Store.Options.key->
         */
        key?: string | Array<string>;
        /**
         * <-Store.Options.onInserted->
         */
        onInserted?: ((values: any, key: any | string | number) => any);
        /**
         * <-Store.Options.onInserting->
         */
        onInserting?: ((values: any) => any);
        /**
         * <-Store.Options.onLoaded->
         */
        onLoaded?: ((result: Array<any>) => any);
        /**
         * <-Store.Options.onLoading->
         */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /**
         * <-Store.Options.onModified->
         */
        onModified?: Function;
        /**
         * <-Store.Options.onModifying->
         */
        onModifying?: Function;
        /**
         * <-Store.Options.onPush->
         */
        onPush?: ((changes: Array<any>) => any);
        /**
         * <-Store.Options.onRemoved->
         */
        onRemoved?: ((key: any | string | number) => any);
        /**
         * <-Store.Options.onRemoving->
         */
        onRemoving?: ((key: any | string | number) => any);
        /**
         * <-Store.Options.onUpdated->
         */
        onUpdated?: ((key: any | string | number, values: any) => any);
        /**
         * <-Store.Options.onUpdating->
         */
        onUpdating?: ((key: any | string | number, values: any) => any);
    }
    /**
     * <-Store->
     */
    export class Store {
        constructor(options?: StoreOptions)
        /**
         * <-Store.byKey(key)->
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * <-Store.insert(values)->
         */
        insert(values: any): Promise<any> & JQueryPromise<any>;
        /**
         * <-Store.key()->
         */
        key(): any;
        /**
         * <-Store.keyOf(obj)->
         */
        keyOf(obj: any): any;
        /**
         * <-Store.load()->
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * <-Store.load(options)->
         */
        load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
        /**
         * <-Store.off(eventName)->
         */
        off(eventName: string): this;
        /**
         * <-Store.off(eventName, eventHandler)->
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * <-Store.on(eventName, eventHandler)->
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * <-Store.on(events)->
         */
        on(events: any): this;
        /**
         * <-Store.push(changes)->
         */
        push(changes: Array<any>): void;
        /**
         * <-Store.remove(key)->
         */
        remove(key: any | string | number): Promise<void> & JQueryPromise<void>;
        /**
         * <-Store.totalCount(options)->
         */
        totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number>;
        /**
         * <-Store.update(key, values)->
         */
        update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any>;
    }
    /**
     * <-XmlaStore.Options->
     */
    export interface XmlaStoreOptions {
        /**
         * <-XmlaStore.Options.beforeSend->
         */
        beforeSend?: ((options: { url?: string, method?: string, headers?: any, xhrFields?: any, data?: string, dataType?: string }) => any);
        /**
         * <-XmlaStore.Options.catalog->
         */
        catalog?: string;
        /**
         * <-XmlaStore.Options.cube->
         */
        cube?: string;
        /**
         * <-XmlaStore.Options.url->
         */
        url?: string;
    }
    /**
     * <-XmlaStore->
     */
    export class XmlaStore {
        constructor(options?: XmlaStoreOptions)
    }
    /**
     * <-Utils.base64_encode(input)->
     */
    export function base64_encode(input: string | Array<number>): string;
    /**
     * <-Utils.errorHandler->
     */
    export function errorHandler(e: Error): void;
    /**
     * <-Utils.query(array)->
     */
    export function query(array: Array<any>): Query;
    /**
     * <-Utils.query(url, queryOptions)->
     */
    export function query(url: string, queryOptions: any): Query;
}
declare module DevExpress.data.utils {
    /**
     * <-Utils.compileGetter(expr)->
     */
    export function compileGetter(expr: string | Array<string>): Function;
    /**
     * <-Utils.compileSetter(expr)->
     */
    export function compileSetter(expr: string | Array<string>): Function;
}
declare module DevExpress.data.utils.odata {
    /**
     * <-Utils.keyConverters->
     */
    export var keyConverters: any;
}
declare module DevExpress.events {
    /**
     * <-dxEvent->
     */
    export class dxEvent {
        /**
         * <-dxEvent.currentTarget->
         */
        currentTarget: Element;
        /**
         * <-dxEvent.data->
         */
        data: any;
        /**
         * <-dxEvent.delegateTarget->
         */
        delegateTarget: Element;
        /**
         * <-dxEvent.target->
         */
        target: Element;
        /**
         * <-dxEvent.isDefaultPrevented()->
         */
        isDefaultPrevented(): boolean;
        /**
         * <-dxEvent.isImmediatePropagationStopped()->
         */
        isImmediatePropagationStopped(): boolean;
        /**
         * <-dxEvent.isPropagationStopped()->
         */
        isPropagationStopped(): boolean;
        /**
         * <-dxEvent.preventDefault()->
         */
        preventDefault(): void;
        /**
         * <-dxEvent.stopImmediatePropagation()->
         */
        stopImmediatePropagation(): void;
        /**
         * <-dxEvent.stopPropagation()->
         */
        stopPropagation(): void;
    }
    /**
     * <-event->
     */
    export type event = dxEvent | JQueryEventObject;
    /**
     * <-eventsHandler->
     */
    export function eventsHandler(event: dxEvent, extraParameters: any): boolean;
    /**
     * <-events.off(element)->
     */
    export function off(element: Element | Array<Element>): void;
    /**
     * <-events.off(element, eventName)->
     */
    export function off(element: Element | Array<Element>, eventName: string): void;
    /**
     * <-events.off(element, eventName, handler)->
     */
    export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * <-events.off(element, eventName, selector)->
     */
    export function off(element: Element | Array<Element>, eventName: string, selector: string): void;
    /**
     * <-events.off(element, eventName, selector, handler)->
     */
    export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * <-events.on(element, eventName, data, handler)->
     */
    export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /**
     * <-events.on(element, eventName, handler)->
     */
    export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * <-events.on(element, eventName, selector, data, handler)->
     */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /**
     * <-events.on(element, eventName, selector, handler)->
     */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * <-events.one(element, eventName, data, handler)->
     */
    export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /**
     * <-events.one(element, eventName, handler)->
     */
    export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * <-events.one(element, eventName, selector, data, handler)->
     */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /**
     * <-events.one(element, eventName, selector, handler)->
     */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * <-events.trigger(element, event)->
     */
    export function trigger(element: Element | Array<Element>, event: string | event): void;
    /**
     * <-events.trigger(element, event, extraParameters)->
     */
    export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
    /**
     * <-events.triggerHandler(element, event)->
     */
    export function triggerHandler(element: Element | Array<Element>, event: string | event): void;
    /**
     * <-events.triggerHandler(element, event, extraParameters)->
     */
    export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
}
declare module DevExpress.excelExporter {
    /**
     * <-CellAddress->
     */
    export interface CellAddress {
        /**
         * <-CellAddress.column->
         */
        column?: number;
        /**
         * <-CellAddress.row->
         */
        row?: number;
    }
    /**
     * <-CellRange->
     */
    export interface CellRange {
        /**
         * <-CellRange.from->
         */
        from?: CellAddress;
        /**
         * <-CellRange.to->
         */
        to?: CellAddress;
    }
    /**
     * <-ExcelDataGridCell->
     */
    export interface ExcelDataGridCell {
        /**
         * <-ExcelDataGridCell.column->
         */
        column?: DevExpress.ui.dxDataGridColumn;
        /**
         * <-ExcelDataGridCell.data->
         */
        data?: any;
        /**
         * <-ExcelDataGridCell.groupIndex->
         */
        groupIndex?: number;
        /**
         * <-ExcelDataGridCell.groupSummaryItems->
         */
        groupSummaryItems?: Array<{ name?: string, value?: any }>;
        /**
         * <-ExcelDataGridCell.rowType->
         */
        rowType?: string;
        /**
         * <-ExcelDataGridCell.totalSummaryItemName->
         */
        totalSummaryItemName?: string;
        /**
         * <-ExcelDataGridCell.value->
         */
        value?: any;
    }
    /**
     * <-ExcelPivotGridCell->
     */
    export interface ExcelPivotGridCell extends DevExpress.ui.dxPivotGridPivotGridCell {
        /**
         * <-ExcelPivotGridCell.area->
         */
        area?: string;
        /**
         * <-ExcelPivotGridCell.columnIndex->
         */
        columnIndex?: number;
        /**
         * <-ExcelPivotGridCell.rowIndex->
         */
        rowIndex?: number;
    }
    /**
     * <-ExportBaseProps->
     */
    export interface ExportBaseProps {
        /**
         * <-ExportBaseProps.keepColumnWidths->
         */
        keepColumnWidths?: boolean;
        /**
         * <-ExportBaseProps.loadPanel->
         */
        loadPanel?: ExportLoadPanel;
        /**
         * <-ExportBaseProps.topLeftCell->
         */
        topLeftCell?: CellAddress | string;
        /**
         * <-ExportBaseProps.worksheet->
         */
        worksheet?: any;
    }
    /**
     * <-ExportDataGridProps->
     */
    export interface ExportDataGridProps extends ExportBaseProps {
        /**
         * <-ExportDataGridProps.autoFilterEnabled->
         */
        autoFilterEnabled?: boolean;
        /**
         * <-ExportDataGridProps.component->
         */
        component?: DevExpress.ui.dxDataGrid;
        /**
         * <-ExportDataGridProps.customizeCell->
         */
        customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any }) => any);
        /**
         * <-ExportDataGridProps.selectedRowsOnly->
         */
        selectedRowsOnly?: boolean;
    }
    /**
     * <-ExportLoadPanel->
     */
    export interface ExportLoadPanel {
        /**
         * <-ExportLoadPanel.enabled->
         */
        enabled?: boolean;
        /**
         * <-ExportLoadPanel.height->
         */
        height?: number;
        /**
         * <-ExportLoadPanel.indicatorSrc->
         */
        indicatorSrc?: string;
        /**
         * <-ExportLoadPanel.shading->
         */
        shading?: boolean;
        /**
         * <-ExportLoadPanel.shadingColor->
         */
        shadingColor?: string;
        /**
         * <-ExportLoadPanel.showIndicator->
         */
        showIndicator?: boolean;
        /**
         * <-ExportLoadPanel.showPane->
         */
        showPane?: boolean;
        /**
         * <-ExportLoadPanel.text->
         */
        text?: string;
        /**
         * <-ExportLoadPanel.width->
         */
        width?: number;
    }
    /**
     * <-ExportPivotGridProps->
     */
    export interface ExportPivotGridProps extends ExportBaseProps {
        /**
         * <-ExportPivotGridProps.component->
         */
        component?: DevExpress.ui.dxPivotGrid;
        /**
         * <-ExportPivotGridProps.customizeCell->
         */
        customizeCell?: ((options: { pivotCell?: ExcelPivotGridCell, excelCell?: any }) => any);
    }
    /**
     * <-excelExporter.exportDataGrid(options)->
     */
    export function exportDataGrid(options: ExportDataGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
    /**
     * <-excelExporter.exportPivotGrid(options)->
     */
    export function exportPivotGrid(options: ExportPivotGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
}
declare module DevExpress.exporter {
    /**
     * <-ExcelFont->
     */
    export interface ExcelFont {
        /**
         * <-ExcelFont.bold->
         */
        bold?: boolean;
        /**
         * <-ExcelFont.color->
         */
        color?: string;
        /**
         * <-ExcelFont.italic->
         */
        italic?: boolean;
        /**
         * <-ExcelFont.name->
         */
        name?: string;
        /**
         * <-ExcelFont.size->
         */
        size?: number;
        /**
         * <-ExcelFont.underline->
         */
        underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
    }
}
declare module DevExpress.fileManagement {
    /**
     * <-CustomFileSystemProvider.Options->
     */
    export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
        /**
         * <-CustomFileSystemProvider.Options.abortFileUpload->
         */
        abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.copyItem->
         */
        copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.createDirectory->
         */
        createDirectory?: ((parentDirectory: FileSystemItem, name: string) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.deleteItem->
         */
        deleteItem?: ((item: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.downloadItems->
         */
        downloadItems?: ((items: Array<FileSystemItem>) => any);
        /**
         * <-CustomFileSystemProvider.Options.getItems->
         */
        getItems?: ((parentDirectory: FileSystemItem) => Promise<Array<any>> | JQueryPromise<Array<any>> | Array<any>);
        /**
         * <-CustomFileSystemProvider.Options.getItemsContent->
         */
        getItemsContent?: ((items: Array<FileSystemItem>) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.hasSubDirectoriesExpr->
         */
        hasSubDirectoriesExpr?: string | Function;
        /**
         * <-CustomFileSystemProvider.Options.moveItem->
         */
        moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.renameItem->
         */
        renameItem?: ((item: FileSystemItem, newName: string) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-CustomFileSystemProvider.Options.uploadFileChunk->
         */
        uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
    }
    /**
     * <-CustomFileSystemProvider->
     */
    export class CustomFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: CustomFileSystemProviderOptions)
    }
    /**
     * <-FileSystemItem->
     */
    export class FileSystemItem {
        /**
         * <-FileSystemItem.dataItem->
         */
        dataItem: any;
        /**
         * <-FileSystemItem.dateModified->
         */
        dateModified: Date;
        /**
         * <-FileSystemItem.hasSubDirectories->
         */
        hasSubDirectories: boolean;
        /**
         * <-FileSystemItem.isDirectory->
         */
        isDirectory: boolean;
        /**
         * <-FileSystemItem.key->
         */
        key: string;
        /**
         * <-FileSystemItem.name->
         */
        name: string;
        /**
         * <-FileSystemItem.path->
         */
        path: string;
        /**
         * <-FileSystemItem.pathKeys->
         */
        pathKeys: Array<string>;
        /**
         * <-FileSystemItem.size->
         */
        size: number;
        /**
         * <-FileSystemItem.thumbnail->
         */
        thumbnail: string;
        /**
         * <-FileSystemItem.getFileExtension()->
         */
        getFileExtension(): string;
    }
    /**
     * <-FileSystemProviderBase.Options->
     */
    export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
        /**
         * <-FileSystemProviderBase.Options.dateModifiedExpr->
         */
        dateModifiedExpr?: string | Function;
        /**
         * <-FileSystemProviderBase.Options.isDirectoryExpr->
         */
        isDirectoryExpr?: string | Function;
        /**
         * <-FileSystemProviderBase.Options.keyExpr->
         */
        keyExpr?: string | Function;
        /**
         * <-FileSystemProviderBase.Options.nameExpr->
         */
        nameExpr?: string | Function;
        /**
         * <-FileSystemProviderBase.Options.sizeExpr->
         */
        sizeExpr?: string | Function;
        /**
         * <-FileSystemProviderBase.Options.thumbnailExpr->
         */
        thumbnailExpr?: string | Function;
    }
    /**
     * <-FileSystemProviderBase->
     */
    export class FileSystemProviderBase {
        constructor(options?: FileSystemProviderBaseOptions)
        /**
         * <-FileSystemProviderBase.abortFileUpload()->
         */
        abortFileUpload(fileData: File, uploadInfo: any, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;
        /**
         * <-FileSystemProviderBase.copyItems()->
         */
        copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * <-FileSystemProviderBase.createDirectory()->
         */
        createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> & JQueryPromise<any>;
        /**
         * <-FileSystemProviderBase.deleteItems()->
         */
        deleteItems(items: Array<FileSystemItem>): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * <-FileSystemProviderBase.downloadItems()->
         */
        downloadItems(items: Array<FileSystemItem>): void;
        /**
         * <-FileSystemProviderBase.getItems()->
         */
        getItems(parentDirectory: FileSystemItem): Promise<Array<FileSystemItem>> & JQueryPromise<Array<FileSystemItem>>;
        /**
         * <-FileSystemProviderBase.getItemsContent()->
         */
        getItemsContent(items: Array<FileSystemItem>): Promise<any> & JQueryPromise<any>;
        /**
         * <-FileSystemProviderBase.moveItems()->
         */
        moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * <-FileSystemProviderBase.renameItem()->
         */
        renameItem(item: FileSystemItem, newName: string): Promise<any> & JQueryPromise<any>;
        /**
         * <-FileSystemProviderBase.uploadFileChunk()->
         */
        uploadFileChunk(fileData: File, uploadInfo: any, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;
    }
    /**
     * <-ObjectFileSystemProvider.Options->
     */
    export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
        /**
         * <-ObjectFileSystemProvider.Options.contentExpr->
         */
        contentExpr?: string | Function;
        /**
         * <-ObjectFileSystemProvider.Options.data->
         */
        data?: Array<any>;
        /**
         * <-ObjectFileSystemProvider.Options.itemsExpr->
         */
        itemsExpr?: string | Function;
    }
    /**
     * <-ObjectFileSystemProvider->
     */
    export class ObjectFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: ObjectFileSystemProviderOptions)
    }
    /**
     * <-RemoteFileSystemProvider.Options->
     */
    export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
        /**
         * <-RemoteFileSystemProvider.Options.endpointUrl->
         */
        endpointUrl?: string;
        /**
         * <-RemoteFileSystemProvider.Options.hasSubDirectoriesExpr->
         */
        hasSubDirectoriesExpr?: string | Function;
    }
    /**
     * <-RemoteFileSystemProvider->
     */
    export class RemoteFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: RemoteFileSystemProviderOptions)
    }
    /**
     * <-UploadInfo->
     */
    export interface UploadInfo {
        /**
         * <-UploadInfo.bytesUploaded->
         */
        bytesUploaded: number;
        /**
         * <-UploadInfo.chunkBlob->
         */
        chunkBlob: Blob;
        /**
         * <-UploadInfo.chunkCount->
         */
        chunkCount: number;
        /**
         * <-UploadInfo.chunkIndex->
         */
        chunkIndex: number;
        /**
         * <-UploadInfo.customData->
         */
        customData: any;
    }
}
declare module DevExpress.fx {
    /**
     * <-fx.animate(element, config)->
     */
    export function animate(element: Element, config: animationConfig): Promise<void> & JQueryPromise<void>;
    /**
     * <-fx.isAnimating(element)->
     */
    export function isAnimating(element: Element): boolean;
    /**
     * <-fx.stop(element, jumpToEnd)->
     */
    export function stop(element: Element, jumpToEnd: boolean): void;
}
declare module DevExpress.ui {
    /**
     * <-AsyncRule->
     */
    export interface AsyncRule {
        /**
         * <-AsyncRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-AsyncRule.message->
         */
        message?: string;
        /**
         * <-AsyncRule.reevaluate->
         */
        reevaluate?: boolean;
        /**
         * <-AsyncRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /**
         * <-AsyncRule.validationCallback->
         */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => Promise<any> | JQueryPromise<any>);
    }
    /**
     * <-ColCountResponsible->
     */
    export interface ColCountResponsible {
        /**
         * <-ColCountResponsible.lg->
         */
        lg?: number;
        /**
         * <-ColCountResponsible.md->
         */
        md?: number;
        /**
         * <-ColCountResponsible.sm->
         */
        sm?: number;
        /**
         * <-ColCountResponsible.xs->
         */
        xs?: number;
    }
    /**
     * <-CollectionWidget.Options->
     */
    export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
        /**
         * <-CollectionWidget.Options.dataSource->
         */
        dataSource?: string | Array<string | CollectionWidgetItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-CollectionWidget.Options.itemHoldTimeout->
         */
        itemHoldTimeout?: number;
        /**
         * <-CollectionWidget.Options.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-CollectionWidget.Options.items->
         */
        items?: Array<string | CollectionWidgetItem | any>;
        /**
         * <-CollectionWidget.Options.keyExpr->
         */
        keyExpr?: string | Function;
        /**
         * <-CollectionWidget.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-CollectionWidget.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-CollectionWidget.Options.onItemContextMenu->
         */
        onItemContextMenu?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * <-CollectionWidget.Options.onItemHold->
         */
        onItemHold?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * <-CollectionWidget.Options.onItemRendered->
         */
        onItemRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any);
        /**
         * <-CollectionWidget.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /**
         * <-CollectionWidget.Options.selectedIndex->
         */
        selectedIndex?: number;
        /**
         * <-CollectionWidget.Options.selectedItem->
         */
        selectedItem?: any;
        /**
         * <-CollectionWidget.Options.selectedItemKeys->
         */
        selectedItemKeys?: Array<any>;
        /**
         * <-CollectionWidget.Options.selectedItems->
         */
        selectedItems?: Array<any>;
    }
    /**
     * <-CollectionWidget->
     */
    export class CollectionWidget extends Widget {
        constructor(element: Element, options?: CollectionWidgetOptions)
        constructor(element: JQuery, options?: CollectionWidgetOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-CollectionWidgetItem->
     */
    export interface CollectionWidgetItem {
        /**
         * <-CollectionWidgetItem.disabled->
         */
        disabled?: boolean;
        /**
         * <-CollectionWidgetItem.html->
         */
        html?: string;
        /**
         * <-CollectionWidgetItem.template->
         */
        template?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * <-CollectionWidgetItem.text->
         */
        text?: string;
        /**
         * <-CollectionWidgetItem.visible->
         */
        visible?: boolean;
    }
    /**
     * <-CompareRule->
     */
    export interface CompareRule {
        /**
         * <-CompareRule.comparisonTarget->
         */
        comparisonTarget?: (() => any);
        /**
         * <-CompareRule.comparisonType->
         */
        comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
        /**
         * <-CompareRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-CompareRule.message->
         */
        message?: string;
        /**
         * <-CompareRule.reevaluate->
         */
        reevaluate?: boolean;
        /**
         * <-CompareRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-CustomRule->
     */
    export interface CustomRule {
        /**
         * <-CustomRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-CustomRule.message->
         */
        message?: string;
        /**
         * <-CustomRule.reevaluate->
         */
        reevaluate?: boolean;
        /**
         * <-CustomRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /**
         * <-CustomRule.validationCallback->
         */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => boolean);
    }
    /**
     * <-DataExpressionMixin.Options->
     */
    export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
        /**
         * <-DataExpressionMixin.Options.dataSource->
         */
        dataSource?: string | Array<CollectionWidgetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-DataExpressionMixin.Options.displayExpr->
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * <-DataExpressionMixin.Options.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-DataExpressionMixin.Options.items->
         */
        items?: Array<CollectionWidgetItem | any>;
        /**
         * <-DataExpressionMixin.Options.value->
         */
        value?: any;
        /**
         * <-DataExpressionMixin.Options.valueExpr->
         */
        valueExpr?: string | ((item: any) => string | number | boolean);
    }
    /**
     * <-DataExpressionMixin->
     */
    export class DataExpressionMixin {
        constructor(options?: DataExpressionMixinOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-DraggableBase.Options->
     */
    export interface DraggableBaseOptions<T = DraggableBase> extends DOMComponentOptions<T> {
        /**
         * <-DraggableBase.Options.autoScroll->
         */
        autoScroll?: boolean;
        /**
         * <-DraggableBase.Options.boundary->
         */
        boundary?: string | Element | JQuery;
        /**
         * <-DraggableBase.Options.container->
         */
        container?: string | Element | JQuery;
        /**
         * <-DraggableBase.Options.cursorOffset->
         */
        cursorOffset?: string | { x?: number, y?: number };
        /**
         * <-DraggableBase.Options.data->
         */
        data?: any;
        /**
         * <-DraggableBase.Options.dragDirection->
         */
        dragDirection?: 'both' | 'horizontal' | 'vertical';
        /**
         * <-DraggableBase.Options.group->
         */
        group?: string;
        /**
         * <-DraggableBase.Options.handle->
         */
        handle?: string;
        /**
         * <-DraggableBase.Options.scrollSensitivity->
         */
        scrollSensitivity?: number;
        /**
         * <-DraggableBase.Options.scrollSpeed->
         */
        scrollSpeed?: number;
    }
    /**
     * <-DraggableBase->
     */
    export class DraggableBase extends DOMComponent {
        constructor(element: Element, options?: DraggableBaseOptions)
        constructor(element: JQuery, options?: DraggableBaseOptions)
    }
    /**
     * <-Editor.Options->
     */
    export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
        /**
         * <-Editor.Options.isValid->
         */
        isValid?: boolean;
        /**
         * <-Editor.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-Editor.Options.readOnly->
         */
        readOnly?: boolean;
        /**
         * <-Editor.Options.validationError->
         */
        validationError?: any;
        /**
         * <-Editor.Options.validationErrors->
         */
        validationErrors?: Array<any>;
        /**
         * <-Editor.Options.validationMessageMode->
         */
        validationMessageMode?: 'always' | 'auto';
        /**
         * <-Editor.Options.validationStatus->
         */
        validationStatus?: 'valid' | 'invalid' | 'pending';
        /**
         * <-Editor.Options.value->
         */
        value?: any;
    }
    /**
     * <-Editor->
     */
    export class Editor extends Widget {
        constructor(element: Element, options?: EditorOptions)
        constructor(element: JQuery, options?: EditorOptions)
        /**
         * <-Editor.reset()->
         */
        reset(): void;
    }
    /**
     * <-EmailRule->
     */
    export interface EmailRule {
        /**
         * <-EmailRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-EmailRule.message->
         */
        message?: string;
        /**
         * <-EmailRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-GridBase.Options->
     */
    export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
        /**
         * <-GridBase.Options.allowColumnReordering->
         */
        allowColumnReordering?: boolean;
        /**
         * <-GridBase.Options.allowColumnResizing->
         */
        allowColumnResizing?: boolean;
        /**
         * <-GridBase.Options.autoNavigateToFocusedRow->
         */
        autoNavigateToFocusedRow?: boolean;
        /**
         * <-GridBase.Options.cacheEnabled->
         */
        cacheEnabled?: boolean;
        /**
         * <-GridBase.Options.cellHintEnabled->
         */
        cellHintEnabled?: boolean;
        /**
         * <-GridBase.Options.columnAutoWidth->
         */
        columnAutoWidth?: boolean;
        /**
         * <-GridBase.Options.columnChooser->
         */
        columnChooser?: { allowSearch?: boolean, emptyPanelText?: string, enabled?: boolean, height?: number, mode?: 'dragAndDrop' | 'select', searchTimeout?: number, title?: string, width?: number };
        /**
         * <-GridBase.Options.columnFixing->
         */
        columnFixing?: { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } };
        /**
         * <-GridBase.Options.columnHidingEnabled->
         */
        columnHidingEnabled?: boolean;
        /**
         * <-GridBase.Options.columnMinWidth->
         */
        columnMinWidth?: number;
        /**
         * <-GridBase.Options.columnResizingMode->
         */
        columnResizingMode?: 'nextColumn' | 'widget';
        /**
         * <-GridBase.Options.columnWidth->
         */
        columnWidth?: number;
        /**
         * <-GridBase.Options.columns->
         */
        columns?: Array<GridBaseColumn | string>;
        /**
         * <-GridBase.Options.dataSource->
         */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-GridBase.Options.dateSerializationFormat->
         */
        dateSerializationFormat?: string;
        /**
         * <-GridBase.Options.editing->
         */
        editing?: GridBaseEditing;
        /**
         * <-GridBase.Options.errorRowEnabled->
         */
        errorRowEnabled?: boolean;
        /**
         * <-GridBase.Options.filterBuilder->
         */
        filterBuilder?: dxFilterBuilderOptions;
        /**
         * <-GridBase.Options.filterBuilderPopup->
         */
        filterBuilderPopup?: dxPopupOptions;
        /**
         * <-GridBase.Options.filterPanel->
         */
        filterPanel?: { customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string), filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean };
        /**
         * <-GridBase.Options.filterRow->
         */
        filterRow?: { applyFilter?: 'auto' | 'onClick', applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean };
        /**
         * <-GridBase.Options.filterSyncEnabled->
         */
        filterSyncEnabled?: boolean | 'auto';
        /**
         * <-GridBase.Options.filterValue->
         */
        filterValue?: string | Array<any> | Function;
        /**
         * <-GridBase.Options.focusedColumnIndex->
         */
        focusedColumnIndex?: number;
        /**
         * <-GridBase.Options.focusedRowEnabled->
         */
        focusedRowEnabled?: boolean;
        /**
         * <-GridBase.Options.focusedRowIndex->
         */
        focusedRowIndex?: number;
        /**
         * <-GridBase.Options.focusedRowKey->
         */
        focusedRowKey?: any;
        /**
         * <-GridBase.Options.headerFilter->
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number };
        /**
         * <-GridBase.Options.highlightChanges->
         */
        highlightChanges?: boolean;
        /**
         * <-GridBase.Options.keyboardNavigation->
         */
        keyboardNavigation?: { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: 'startEdit' | 'moveFocus', enterKeyDirection?: 'none' | 'column' | 'row' };
        /**
         * <-GridBase.Options.loadPanel->
         */
        loadPanel?: { enabled?: boolean | 'auto', height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /**
         * <-GridBase.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-GridBase.Options.onAdaptiveDetailRowPreparing->
         */
        onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, formOptions?: any }) => any);
        /**
         * <-GridBase.Options.onDataErrorOccurred->
         */
        onDataErrorOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, error?: Error }) => any);
        /**
         * <-GridBase.Options.onEditCanceled->
         */
        onEditCanceled?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-GridBase.Options.onEditCanceling->
         */
        onEditCanceling?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * <-GridBase.Options.onInitNewRow->
         */
        onInitNewRow?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-GridBase.Options.onKeyDown->
         */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, handled?: boolean }) => any);
        /**
         * <-GridBase.Options.onRowCollapsed->
         */
        onRowCollapsed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /**
         * <-GridBase.Options.onRowCollapsing->
         */
        onRowCollapsing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /**
         * <-GridBase.Options.onRowExpanded->
         */
        onRowExpanded?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /**
         * <-GridBase.Options.onRowExpanding->
         */
        onRowExpanding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /**
         * <-GridBase.Options.onRowInserted->
         */
        onRowInserted?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * <-GridBase.Options.onRowInserting->
         */
        onRowInserting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-GridBase.Options.onRowRemoved->
         */
        onRowRemoved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * <-GridBase.Options.onRowRemoving->
         */
        onRowRemoving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-GridBase.Options.onRowUpdated->
         */
        onRowUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * <-GridBase.Options.onRowUpdating->
         */
        onRowUpdating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-GridBase.Options.onRowValidating->
         */
        onRowValidating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-GridBase.Options.onSaved->
         */
        onSaved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-GridBase.Options.onSaving->
         */
        onSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, promise?: Promise<void> | JQueryPromise<void>, cancel?: boolean }) => any);
        /**
         * <-GridBase.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
        /**
         * <-GridBase.Options.onToolbarPreparing->
         */
        onToolbarPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
        /**
         * <-GridBase.Options.pager->
         */
        pager?: { allowedPageSizes?: Array<number | 'all'> | 'auto', displayMode?: 'adaptive' | 'compact' | 'full', infoText?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: boolean | 'auto' };
        /**
         * <-GridBase.Options.paging->
         */
        paging?: GridBasePaging;
        /**
         * <-GridBase.Options.renderAsync->
         */
        renderAsync?: boolean;
        /**
         * <-GridBase.Options.repaintChangesOnly->
         */
        repaintChangesOnly?: boolean;
        /**
         * <-GridBase.Options.rowAlternationEnabled->
         */
        rowAlternationEnabled?: boolean;
        /**
         * <-GridBase.Options.rowDragging->
         */
        rowDragging?: { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: string | Element | JQuery, container?: string | Element | JQuery, cursorOffset?: string | { x?: number, y?: number }, data?: any, dragDirection?: 'both' | 'horizontal' | 'vertical', dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery), dropFeedbackMode?: 'push' | 'indicate', filter?: string, group?: string, handle?: string, onAdd?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragChange?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragEnd?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragMove?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragStart?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any), onRemove?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onReorder?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: Promise<void> | JQueryPromise<void> }) => any), scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean };
        /**
         * <-GridBase.Options.scrolling->
         */
        scrolling?: GridBaseScrolling;
        /**
         * <-GridBase.Options.searchPanel->
         */
        searchPanel?: { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number };
        /**
         * <-GridBase.Options.selectedRowKeys->
         */
        selectedRowKeys?: Array<any>;
        /**
         * <-GridBase.Options.selection->
         */
        selection?: GridBaseSelection;
        /**
         * <-GridBase.Options.showBorders->
         */
        showBorders?: boolean;
        /**
         * <-GridBase.Options.showColumnHeaders->
         */
        showColumnHeaders?: boolean;
        /**
         * <-GridBase.Options.showColumnLines->
         */
        showColumnLines?: boolean;
        /**
         * <-GridBase.Options.showRowLines->
         */
        showRowLines?: boolean;
        /**
         * <-GridBase.Options.sorting->
         */
        sorting?: { ascendingText?: string, clearText?: string, descendingText?: string, mode?: 'multiple' | 'none' | 'single', showSortIndexes?: boolean };
        /**
         * <-GridBase.Options.stateStoring->
         */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((gridState: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /**
         * <-GridBase.Options.twoWayBindingEnabled->
         */
        twoWayBindingEnabled?: boolean;
        /**
         * <-GridBase.Options.wordWrapEnabled->
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * <-GridBase.Options.editing->
     */
    export interface GridBaseEditing {
        /**
         * <-GridBase.Options.editing.changes->
         */
        changes?: Array<any>;
        /**
         * <-GridBase.Options.editing.confirmDelete->
         */
        confirmDelete?: boolean;
        /**
         * <-GridBase.Options.editing.editColumnName->
         */
        editColumnName?: string;
        /**
         * <-GridBase.Options.editing.editRowKey->
         */
        editRowKey?: any;
        /**
         * <-GridBase.Options.editing.form->
         */
        form?: dxFormOptions;
        /**
         * <-GridBase.Options.editing.mode->
         */
        mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
        /**
         * <-GridBase.Options.editing.popup->
         */
        popup?: dxPopupOptions;
        /**
         * <-GridBase.Options.editing.refreshMode->
         */
        refreshMode?: 'full' | 'reshape' | 'repaint';
        /**
         * <-GridBase.Options.editing.selectTextOnEditStart->
         */
        selectTextOnEditStart?: boolean;
        /**
         * <-GridBase.Options.editing.startEditAction->
         */
        startEditAction?: 'click' | 'dblClick';
        /**
         * <-GridBase.Options.editing.texts->
         */
        texts?: GridBaseEditingTexts;
        /**
         * <-GridBase.Options.editing.useIcons->
         */
        useIcons?: boolean;
    }
    /**
     * <-GridBase.Options.editing.texts->
     */
    export interface GridBaseEditingTexts {
        /**
         * <-GridBase.Options.editing.texts.addRow->
         */
        addRow?: string;
        /**
         * <-GridBase.Options.editing.texts.cancelAllChanges->
         */
        cancelAllChanges?: string;
        /**
         * <-GridBase.Options.editing.texts.cancelRowChanges->
         */
        cancelRowChanges?: string;
        /**
         * <-GridBase.Options.editing.texts.confirmDeleteMessage->
         */
        confirmDeleteMessage?: string;
        /**
         * <-GridBase.Options.editing.texts.confirmDeleteTitle->
         */
        confirmDeleteTitle?: string;
        /**
         * <-GridBase.Options.editing.texts.deleteRow->
         */
        deleteRow?: string;
        /**
         * <-GridBase.Options.editing.texts.editRow->
         */
        editRow?: string;
        /**
         * <-GridBase.Options.editing.texts.saveAllChanges->
         */
        saveAllChanges?: string;
        /**
         * <-GridBase.Options.editing.texts.saveRowChanges->
         */
        saveRowChanges?: string;
        /**
         * <-GridBase.Options.editing.texts.undeleteRow->
         */
        undeleteRow?: string;
        /**
         * <-GridBase.Options.editing.texts.validationCancelChanges->
         */
        validationCancelChanges?: string;
    }
    /**
     * <-GridBase.Options.paging->
     */
    export interface GridBasePaging {
        /**
         * <-GridBase.Options.paging.enabled->
         */
        enabled?: boolean;
        /**
         * <-GridBase.Options.paging.pageIndex->
         */
        pageIndex?: number;
        /**
         * <-GridBase.Options.paging.pageSize->
         */
        pageSize?: number;
    }
    /**
     * <-GridBase.Options.scrolling->
     */
    export interface GridBaseScrolling {
        /**
         * <-GridBase.Options.scrolling.columnRenderingMode->
         */
        columnRenderingMode?: 'standard' | 'virtual';
        /**
         * <-GridBase.Options.scrolling.preloadEnabled->
         */
        preloadEnabled?: boolean;
        /**
         * <-GridBase.Options.scrolling.rowRenderingMode->
         */
        rowRenderingMode?: 'standard' | 'virtual';
        /**
         * <-GridBase.Options.scrolling.scrollByContent->
         */
        scrollByContent?: boolean;
        /**
         * <-GridBase.Options.scrolling.scrollByThumb->
         */
        scrollByThumb?: boolean;
        /**
         * <-GridBase.Options.scrolling.showScrollbar->
         */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /**
         * <-GridBase.Options.scrolling.useNative->
         */
        useNative?: boolean | 'auto';
    }
    /**
     * <-GridBase.Options.selection->
     */
    export interface GridBaseSelection {
        /**
         * <-GridBase.Options.selection.allowSelectAll->
         */
        allowSelectAll?: boolean;
        /**
         * <-GridBase.Options.selection.mode->
         */
        mode?: 'multiple' | 'none' | 'single';
    }
    /**
     * <-GridBase->
     */
    export class GridBase extends Widget {
        constructor(element: Element, options?: GridBaseOptions)
        constructor(element: JQuery, options?: GridBaseOptions)
        /**
         * <-GridBase.beginCustomLoading(messageText)->
         */
        beginCustomLoading(messageText: string): void;
        /**
         * <-GridBase.byKey(key)->
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * <-GridBase.cancelEditData()->
         */
        cancelEditData(): void;
        /**
         * <-GridBase.cellValue(rowIndex, dataField)->
         */
        cellValue(rowIndex: number, dataField: string): any;
        /**
         * <-GridBase.cellValue(rowIndex, dataField, value)->
         */
        cellValue(rowIndex: number, dataField: string, value: any): void;
        /**
         * <-GridBase.cellValue(rowIndex, visibleColumnIndex)->
         */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;
        /**
         * <-GridBase.cellValue(rowIndex, visibleColumnIndex, value)->
         */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
        /**
         * <-GridBase.clearFilter()->
         */
        clearFilter(): void;
        /**
         * <-GridBase.clearFilter(filterName)->
         */
        clearFilter(filterName: string): void;
        /**
         * <-GridBase.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-GridBase.clearSorting()->
         */
        clearSorting(): void;
        /**
         * <-GridBase.closeEditCell()->
         */
        closeEditCell(): void;
        /**
         * <-GridBase.collapseAdaptiveDetailRow()->
         */
        collapseAdaptiveDetailRow(): void;
        /**
         * <-GridBase.columnCount()->
         */
        columnCount(): number;
        /**
         * <-GridBase.columnOption(id)->
         */
        columnOption(id: number | string): any;
        /**
         * <-GridBase.columnOption(id, optionName)->
         */
        columnOption(id: number | string, optionName: string): any;
        /**
         * <-GridBase.columnOption(id, optionName, optionValue)->
         */
        columnOption(id: number | string, optionName: string, optionValue: any): void;
        /**
         * <-GridBase.columnOption(id, options)->
         */
        columnOption(id: number | string, options: any): void;
        /**
         * <-GridBase.deleteColumn(id)->
         */
        deleteColumn(id: number | string): void;
        /**
         * <-GridBase.deleteRow(rowIndex)->
         */
        deleteRow(rowIndex: number): void;
        /**
         * <-GridBase.deselectAll()->
         */
        deselectAll(): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.deselectRows(keys)->
         */
        deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * <-GridBase.editCell(rowIndex, dataField)->
         */
        editCell(rowIndex: number, dataField: string): void;
        /**
         * <-GridBase.editCell(rowIndex, visibleColumnIndex)->
         */
        editCell(rowIndex: number, visibleColumnIndex: number): void;
        /**
         * <-GridBase.editRow(rowIndex)->
         */
        editRow(rowIndex: number): void;
        /**
         * <-GridBase.endCustomLoading()->
         */
        endCustomLoading(): void;
        /**
         * <-GridBase.expandAdaptiveDetailRow(key)->
         */
        expandAdaptiveDetailRow(key: any): void;
        /**
         * <-GridBase.filter()->
         */
        filter(): any;
        /**
         * <-GridBase.filter(filterExpr)->
         */
        filter(filterExpr: any): void;
        /**
         * <-Widget.focus()->
         */
        focus(): void;
        /**
         * <-GridBase.focus(element)->
         */
        focus(element: Element | JQuery): void;
        /**
         * <-GridBase.getCellElement(rowIndex, dataField)->
         */
        getCellElement(rowIndex: number, dataField: string): DevExpress.core.dxElement | undefined;
        /**
         * <-GridBase.getCellElement(rowIndex, visibleColumnIndex)->
         */
        getCellElement(rowIndex: number, visibleColumnIndex: number): DevExpress.core.dxElement | undefined;
        /**
         * <-GridBase.getCombinedFilter()->
         */
        getCombinedFilter(): any;
        /**
         * <-GridBase.getCombinedFilter(returnDataField)->
         */
        getCombinedFilter(returnDataField: boolean): any;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-GridBase.getKeyByRowIndex(rowIndex)->
         */
        getKeyByRowIndex(rowIndex: number): any;
        /**
         * <-GridBase.getRowElement(rowIndex)->
         */
        getRowElement(rowIndex: number): Array<Element> & JQuery | undefined;
        /**
         * <-GridBase.getRowIndexByKey(key)->
         */
        getRowIndexByKey(key: any | string | number): number;
        /**
         * <-GridBase.getScrollable()->
         */
        getScrollable(): dxScrollable;
        /**
         * <-GridBase.getVisibleColumnIndex(id)->
         */
        getVisibleColumnIndex(id: number | string): number;
        /**
         * <-GridBase.hasEditData()->
         */
        hasEditData(): boolean;
        /**
         * <-GridBase.hideColumnChooser()->
         */
        hideColumnChooser(): void;
        /**
         * <-GridBase.isAdaptiveDetailRowExpanded(key)->
         */
        isAdaptiveDetailRowExpanded(key: any): boolean;
        /**
         * <-GridBase.isRowFocused(key)->
         */
        isRowFocused(key: any): boolean;
        /**
         * <-GridBase.isRowSelected(key)->
         */
        isRowSelected(key: any): boolean;
        /**
         * <-GridBase.keyOf(obj)->
         */
        keyOf(obj: any): any;
        /**
         * <-GridBase.navigateToRow(key)->
         */
        navigateToRow(key: any): void;
        /**
         * <-GridBase.pageCount()->
         */
        pageCount(): number;
        /**
         * <-GridBase.pageIndex()->
         */
        pageIndex(): number;
        /**
         * <-GridBase.pageIndex(newIndex)->
         */
        pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.pageSize()->
         */
        pageSize(): number;
        /**
         * <-GridBase.pageSize(value)->
         */
        pageSize(value: number): void;
        /**
         * <-GridBase.refresh()->
         */
        refresh(): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.refresh(changesOnly)->
         */
        refresh(changesOnly: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.repaintRows(rowIndexes)->
         */
        repaintRows(rowIndexes: Array<number>): void;
        /**
         * <-GridBase.saveEditData()->
         */
        saveEditData(): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.searchByText(text)->
         */
        searchByText(text: string): void;
        /**
         * <-GridBase.selectAll()->
         */
        selectAll(): Promise<void> & JQueryPromise<void>;
        /**
         * <-GridBase.selectRows(keys, preserve)->
         */
        selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
        /**
         * <-GridBase.selectRowsByIndexes(indexes)->
         */
        selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
        /**
         * <-GridBase.showColumnChooser()->
         */
        showColumnChooser(): void;
        /**
         * <-GridBase.state()->
         */
        state(): any;
        /**
         * <-GridBase.state(state)->
         */
        state(state: any): void;
        /**
         * <-GridBase.undeleteRow(rowIndex)->
         */
        undeleteRow(rowIndex: number): void;
        /**
         * <-GridBase.updateDimensions()->
         */
        updateDimensions(): void;
    }
    /**
     * <-GridBaseColumn->
     */
    export interface GridBaseColumn {
        /**
         * <-GridBaseColumn.alignment->
         */
        alignment?: 'center' | 'left' | 'right' | undefined;
        /**
         * <-GridBaseColumn.allowEditing->
         */
        allowEditing?: boolean;
        /**
         * <-GridBaseColumn.allowFiltering->
         */
        allowFiltering?: boolean;
        /**
         * <-GridBaseColumn.allowFixing->
         */
        allowFixing?: boolean;
        /**
         * <-GridBaseColumn.allowHeaderFiltering->
         */
        allowHeaderFiltering?: boolean;
        /**
         * <-GridBaseColumn.allowHiding->
         */
        allowHiding?: boolean;
        /**
         * <-GridBaseColumn.allowReordering->
         */
        allowReordering?: boolean;
        /**
         * <-GridBaseColumn.allowResizing->
         */
        allowResizing?: boolean;
        /**
         * <-GridBaseColumn.allowSearch->
         */
        allowSearch?: boolean;
        /**
         * <-GridBaseColumn.allowSorting->
         */
        allowSorting?: boolean;
        /**
         * <-GridBaseColumn.calculateCellValue->
         */
        calculateCellValue?: ((rowData: any) => any);
        /**
         * <-GridBaseColumn.calculateDisplayValue->
         */
        calculateDisplayValue?: string | ((rowData: any) => any);
        /**
         * <-GridBaseColumn.calculateFilterExpression->
         */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
        /**
         * <-GridBaseColumn.calculateSortValue->
         */
        calculateSortValue?: string | ((rowData: any) => any);
        /**
         * <-GridBaseColumn.caption->
         */
        caption?: string;
        /**
         * <-GridBaseColumn.cssClass->
         */
        cssClass?: string;
        /**
         * <-GridBaseColumn.customizeText->
         */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string, target?: string, groupInterval?: string | number }) => string);
        /**
         * <-GridBaseColumn.dataField->
         */
        dataField?: string;
        /**
         * <-GridBaseColumn.dataType->
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * <-GridBaseColumn.editorOptions->
         */
        editorOptions?: any;
        /**
         * <-GridBaseColumn.encodeHtml->
         */
        encodeHtml?: boolean;
        /**
         * <-GridBaseColumn.falseText->
         */
        falseText?: string;
        /**
         * <-GridBaseColumn.filterOperations->
         */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof' | string>;
        /**
         * <-GridBaseColumn.filterType->
         */
        filterType?: 'exclude' | 'include';
        /**
         * <-GridBaseColumn.filterValue->
         */
        filterValue?: any;
        /**
         * <-GridBaseColumn.filterValues->
         */
        filterValues?: Array<any>;
        /**
         * <-GridBaseColumn.fixed->
         */
        fixed?: boolean;
        /**
         * <-GridBaseColumn.fixedPosition->
         */
        fixedPosition?: 'left' | 'right';
        /**
         * <-GridBaseColumn.formItem->
         */
        formItem?: dxFormSimpleItem;
        /**
         * <-GridBaseColumn.format->
         */
        format?: format;
        /**
         * <-GridBaseColumn.headerFilter->
         */
        headerFilter?: { allowSearch?: boolean, dataSource?: Array<any> | ((options: { component?: any, dataSource?: DevExpress.data.DataSourceOptions }) => any) | DevExpress.data.DataSourceOptions, groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number, height?: number, searchMode?: 'contains' | 'startswith' | 'equals', width?: number };
        /**
         * <-GridBaseColumn.hidingPriority->
         */
        hidingPriority?: number;
        /**
         * <-GridBaseColumn.isBand->
         */
        isBand?: boolean;
        /**
         * <-GridBaseColumn.lookup->
         */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store | ((options: { data?: any, key?: any }) => Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store), displayExpr?: string | ((data: any) => string), valueExpr?: string };
        /**
         * <-GridBaseColumn.minWidth->
         */
        minWidth?: number;
        /**
         * <-GridBaseColumn.name->
         */
        name?: string;
        /**
         * <-GridBaseColumn.ownerBand->
         */
        ownerBand?: number;
        /**
         * <-GridBaseColumn.renderAsync->
         */
        renderAsync?: boolean;
        /**
         * <-GridBaseColumn.selectedFilterOperation->
         */
        selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
        /**
         * <-GridBaseColumn.setCellValue->
         */
        setCellValue?: ((newData: any, value: any, currentRowData: any) => void | Promise<void> | JQueryPromise<void>);
        /**
         * <-GridBaseColumn.showEditorAlways->
         */
        showEditorAlways?: boolean;
        /**
         * <-GridBaseColumn.showInColumnChooser->
         */
        showInColumnChooser?: boolean;
        /**
         * <-GridBaseColumn.sortIndex->
         */
        sortIndex?: number;
        /**
         * <-GridBaseColumn.sortOrder->
         */
        sortOrder?: 'asc' | 'desc' | undefined;
        /**
         * <-GridBaseColumn.sortingMethod->
         */
        sortingMethod?: ((value1: any, value2: any) => number);
        /**
         * <-GridBaseColumn.trueText->
         */
        trueText?: string;
        /**
         * <-GridBaseColumn.validationRules->
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * <-GridBaseColumn.visible->
         */
        visible?: boolean;
        /**
         * <-GridBaseColumn.visibleIndex->
         */
        visibleIndex?: number;
        /**
         * <-GridBaseColumn.width->
         */
        width?: number | string;
    }
    /**
     * <-GridBaseColumnButton->
     */
    export interface GridBaseColumnButton {
        /**
         * <-GridBaseColumnButton.cssClass->
         */
        cssClass?: string;
        /**
         * <-GridBaseColumnButton.hint->
         */
        hint?: string;
        /**
         * <-GridBaseColumnButton.icon->
         */
        icon?: string;
        /**
         * <-GridBaseColumnButton.text->
         */
        text?: string;
    }
    /**
     * <-HierarchicalCollectionWidget.Options->
     */
    export interface HierarchicalCollectionWidgetOptions<T = HierarchicalCollectionWidget> extends CollectionWidgetOptions<T> {
        /**
         * <-HierarchicalCollectionWidget.Options.disabledExpr->
         */
        disabledExpr?: string | Function;
        /**
         * <-HierarchicalCollectionWidget.Options.displayExpr->
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * <-HierarchicalCollectionWidget.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-HierarchicalCollectionWidget.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-HierarchicalCollectionWidget.Options.itemsExpr->
         */
        itemsExpr?: string | Function;
        /**
         * <-HierarchicalCollectionWidget.Options.keyExpr->
         */
        keyExpr?: string | Function;
        /**
         * <-HierarchicalCollectionWidget.Options.selectedExpr->
         */
        selectedExpr?: string | Function;
    }
    /**
     * <-HierarchicalCollectionWidget->
     */
    export class HierarchicalCollectionWidget extends CollectionWidget {
        constructor(element: Element, options?: HierarchicalCollectionWidgetOptions)
        constructor(element: JQuery, options?: HierarchicalCollectionWidgetOptions)
    }
    /**
     * <-MapLocation->
     */
    export interface MapLocation {
        /**
         * <-MapLocation.lat->
         */
        lat?: number;
        /**
         * <-MapLocation.lng->
         */
        lng?: number;
    }
    /**
     * <-NumericRule->
     */
    export interface NumericRule {
        /**
         * <-NumericRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-NumericRule.message->
         */
        message?: string;
        /**
         * <-NumericRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-PatternRule->
     */
    export interface PatternRule {
        /**
         * <-PatternRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-PatternRule.message->
         */
        message?: string;
        /**
         * <-PatternRule.pattern->
         */
        pattern?: RegExp | string;
        /**
         * <-PatternRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-RangeRule->
     */
    export interface RangeRule {
        /**
         * <-RangeRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-RangeRule.max->
         */
        max?: Date | number;
        /**
         * <-RangeRule.message->
         */
        message?: string;
        /**
         * <-RangeRule.min->
         */
        min?: Date | number;
        /**
         * <-RangeRule.reevaluate->
         */
        reevaluate?: boolean;
        /**
         * <-RangeRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-RequiredRule->
     */
    export interface RequiredRule {
        /**
         * <-RequiredRule.message->
         */
        message?: string;
        /**
         * <-RequiredRule.trim->
         */
        trim?: boolean;
        /**
         * <-RequiredRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-SearchBoxMixin.Options->
     */
    export interface SearchBoxMixinOptions<T = SearchBoxMixin> {
        /**
         * <-SearchBoxMixin.Options.searchEditorOptions->
         */
        searchEditorOptions?: dxTextBoxOptions;
        /**
         * <-SearchBoxMixin.Options.searchEnabled->
         */
        searchEnabled?: boolean;
        /**
         * <-SearchBoxMixin.Options.searchExpr->
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * <-SearchBoxMixin.Options.searchMode->
         */
        searchMode?: 'contains' | 'startswith' | 'equals';
        /**
         * <-SearchBoxMixin.Options.searchTimeout->
         */
        searchTimeout?: number;
        /**
         * <-SearchBoxMixin.Options.searchValue->
         */
        searchValue?: string;
    }
    /**
     * <-SearchBoxMixin->
     */
    export class SearchBoxMixin {
        constructor(options?: SearchBoxMixinOptions)
    }
    /**
     * <-StringLengthRule->
     */
    export interface StringLengthRule {
        /**
         * <-StringLengthRule.ignoreEmptyValue->
         */
        ignoreEmptyValue?: boolean;
        /**
         * <-StringLengthRule.max->
         */
        max?: number;
        /**
         * <-StringLengthRule.message->
         */
        message?: string;
        /**
         * <-StringLengthRule.min->
         */
        min?: number;
        /**
         * <-StringLengthRule.trim->
         */
        trim?: boolean;
        /**
         * <-StringLengthRule.type->
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * <-Widget.Options->
     */
    export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
        /**
         * <-Widget.Options.accessKey->
         */
        accessKey?: string;
        /**
         * <-Widget.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-Widget.Options.disabled->
         */
        disabled?: boolean;
        /**
         * <-Widget.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-Widget.Options.hint->
         */
        hint?: string;
        /**
         * <-Widget.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-Widget.Options.onContentReady->
         */
        onContentReady?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-Widget.Options.tabIndex->
         */
        tabIndex?: number;
        /**
         * <-Widget.Options.visible->
         */
        visible?: boolean;
    }
    /**
     * <-Widget->
     */
    export class Widget extends DOMComponent {
        constructor(element: Element, options?: WidgetOptions)
        constructor(element: JQuery, options?: WidgetOptions)
        /**
         * <-Widget.focus()->
         */
        focus(): void;
        /**
         * <-Widget.registerKeyHandler(key, handler)->
         */
        registerKeyHandler(key: string, handler: Function): void;
        /**
         * <-Widget.repaint()->
         */
        repaint(): void;
    }
    /**
     * <-dxAccordion.Options->
     */
    export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
        /**
         * <-dxAccordion.Options.animationDuration->
         */
        animationDuration?: number;
        /**
         * <-dxAccordion.Options.collapsible->
         */
        collapsible?: boolean;
        /**
         * <-dxAccordion.Options.dataSource->
         */
        dataSource?: string | Array<string | dxAccordionItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxAccordion.Options.deferRendering->
         */
        deferRendering?: boolean;
        /**
         * <-dxAccordion.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxAccordion.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxAccordion.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxAccordion.Options.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxAccordion.Options.itemTitleTemplate->
         */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxAccordion.Options.items->
         */
        items?: Array<string | dxAccordionItem | any>;
        /**
         * <-dxAccordion.Options.multiple->
         */
        multiple?: boolean;
        /**
         * <-dxAccordion.Options.onItemTitleClick->
         */
        onItemTitleClick?: ((e: { component?: dxAccordion, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxAccordion.Options.repaintChangesOnly->
         */
        repaintChangesOnly?: boolean;
        /**
         * <-dxAccordion.Options.selectedIndex->
         */
        selectedIndex?: number;
    }
    /**
     * <-dxAccordion->
     */
    export class dxAccordion extends CollectionWidget {
        constructor(element: Element, options?: dxAccordionOptions)
        constructor(element: JQuery, options?: dxAccordionOptions)
        /**
         * <-dxAccordion.collapseItem(index)->
         */
        collapseItem(index: number): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxAccordion.expandItem(index)->
         */
        expandItem(index: number): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxAccordion.updateDimensions()->
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxAccordionItem->
     */
    export interface dxAccordionItem extends CollectionWidgetItem {
        /**
         * <-dxAccordionItem.icon->
         */
        icon?: string;
        /**
         * <-dxAccordionItem.title->
         */
        title?: string;
    }
    /**
     * <-dxActionSheet.Options->
     */
    export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
        /**
         * <-dxActionSheet.Options.cancelText->
         */
        cancelText?: string;
        /**
         * <-dxActionSheet.Options.dataSource->
         */
        dataSource?: string | Array<string | dxActionSheetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxActionSheet.Options.items->
         */
        items?: Array<string | dxActionSheetItem | any>;
        /**
         * <-dxActionSheet.Options.onCancelClick->
         */
        onCancelClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any) | string;
        /**
         * <-dxActionSheet.Options.showCancelButton->
         */
        showCancelButton?: boolean;
        /**
         * <-dxActionSheet.Options.showTitle->
         */
        showTitle?: boolean;
        /**
         * <-dxActionSheet.Options.target->
         */
        target?: string | Element | JQuery;
        /**
         * <-dxActionSheet.Options.title->
         */
        title?: string;
        /**
         * <-dxActionSheet.Options.usePopover->
         */
        usePopover?: boolean;
        /**
         * <-dxActionSheet.Options.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxActionSheet->
     */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: Element, options?: dxActionSheetOptions)
        constructor(element: JQuery, options?: dxActionSheetOptions)
        /**
         * <-dxActionSheet.hide()->
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxActionSheet.show()->
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxActionSheet.toggle(showing)->
         */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxActionSheetItem->
     */
    export interface dxActionSheetItem extends CollectionWidgetItem {
        /**
         * <-dxActionSheetItem.icon->
         */
        icon?: string;
        /**
         * <-dxActionSheetItem.onClick->
         */
        onClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxActionSheetItem.type->
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /**
     * <-dxAutocomplete.Options->
     */
    export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
        /**
         * <-dxAutocomplete.Options.maxItemCount->
         */
        maxItemCount?: number;
        /**
         * <-dxAutocomplete.Options.minSearchLength->
         */
        minSearchLength?: number;
        /**
         * <-dxAutocomplete.Options.showDropDownButton->
         */
        showDropDownButton?: boolean;
        /**
         * <-dxAutocomplete.Options.value->
         */
        value?: string;
    }
    /**
     * <-dxAutocomplete->
     */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: Element, options?: dxAutocompleteOptions)
        constructor(element: JQuery, options?: dxAutocompleteOptions)
    }
    /**
     * <-dxBox.Options->
     */
    export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
        /**
         * <-dxBox.Options.align->
         */
        align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
        /**
         * <-dxBox.Options.crossAlign->
         */
        crossAlign?: 'center' | 'end' | 'start' | 'stretch';
        /**
         * <-dxBox.Options.dataSource->
         */
        dataSource?: string | Array<string | dxBoxItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxBox.Options.direction->
         */
        direction?: 'col' | 'row';
        /**
         * <-dxBox.Options.items->
         */
        items?: Array<string | dxBoxItem | any>;
    }
    /**
     * <-dxBox->
     */
    export class dxBox extends CollectionWidget {
        constructor(element: Element, options?: dxBoxOptions)
        constructor(element: JQuery, options?: dxBoxOptions)
    }
    /**
     * <-dxBoxItem->
     */
    export interface dxBoxItem extends CollectionWidgetItem {
        /**
         * <-dxBoxItem.baseSize->
         */
        baseSize?: number | 'auto';
        /**
         * <-dxBoxItem.box->
         */
        box?: dxBoxOptions;
        /**
         * <-dxBoxItem.ratio->
         */
        ratio?: number;
        /**
         * <-dxBoxItem.shrink->
         */
        shrink?: number;
    }
    /**
     * <-dxButton.Options->
     */
    export interface dxButtonOptions extends WidgetOptions<dxButton> {
        /**
         * <-dxButton.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxButton.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxButton.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxButton.Options.icon->
         */
        icon?: string;
        /**
         * <-dxButton.Options.onClick->
         */
        onClick?: ((e: { component?: dxButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, validationGroup?: any }) => any);
        /**
         * <-dxButton.Options.stylingMode->
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /**
         * <-dxButton.Options.template->
         */
        template?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxButton.Options.text->
         */
        text?: string;
        /**
         * <-dxButton.Options.type->
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
        /**
         * <-dxButton.Options.useSubmitBehavior->
         */
        useSubmitBehavior?: boolean;
        /**
         * <-dxButton.Options.validationGroup->
         */
        validationGroup?: string;
    }
    /**
     * <-dxButton->
     */
    export class dxButton extends Widget {
        constructor(element: Element, options?: dxButtonOptions)
        constructor(element: JQuery, options?: dxButtonOptions)
    }
    /**
     * <-dxButtonGroup.Options->
     */
    export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
        /**
         * <-dxButtonGroup.Options.buttonTemplate->
         */
        buttonTemplate?: DevExpress.core.template | ((buttonData: any, buttonContent: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxButtonGroup.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxButtonGroup.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxButtonGroup.Options.items->
         */
        items?: Array<dxButtonGroupItem>;
        /**
         * <-dxButtonGroup.Options.keyExpr->
         */
        keyExpr?: string | Function;
        /**
         * <-dxButtonGroup.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * <-dxButtonGroup.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /**
         * <-dxButtonGroup.Options.selectedItemKeys->
         */
        selectedItemKeys?: Array<any>;
        /**
         * <-dxButtonGroup.Options.selectedItems->
         */
        selectedItems?: Array<any>;
        /**
         * <-dxButtonGroup.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * <-dxButtonGroup.Options.stylingMode->
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
    }
    /**
     * <-dxButtonGroup->
     */
    export class dxButtonGroup extends Widget {
        constructor(element: Element, options?: dxButtonGroupOptions)
        constructor(element: JQuery, options?: dxButtonGroupOptions)
    }
    /**
     * <-dxButtonGroupItem->
     */
    export interface dxButtonGroupItem extends CollectionWidgetItem {
        /**
         * <-dxButtonGroupItem.hint->
         */
        hint?: string;
        /**
         * <-dxButtonGroupItem.icon->
         */
        icon?: string;
        /**
         * <-dxButtonGroupItem.type->
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /**
     * <-dxCalendar.Options->
     */
    export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
        /**
         * <-dxCalendar.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxCalendar.Options.cellTemplate->
         */
        cellTemplate?: DevExpress.core.template | ((itemData: { date?: Date, view?: string, text?: string }, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxCalendar.Options.dateSerializationFormat->
         */
        dateSerializationFormat?: string;
        /**
         * <-dxCalendar.Options.disabledDates->
         */
        disabledDates?: Array<Date> | ((data: { component?: any, date?: Date, view?: string }) => boolean);
        /**
         * <-dxCalendar.Options.firstDayOfWeek->
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * <-dxCalendar.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxCalendar.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxCalendar.Options.max->
         */
        max?: Date | number | string;
        /**
         * <-dxCalendar.Options.maxZoomLevel->
         */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /**
         * <-dxCalendar.Options.min->
         */
        min?: Date | number | string;
        /**
         * <-dxCalendar.Options.minZoomLevel->
         */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /**
         * <-dxCalendar.Options.name->
         */
        name?: string;
        /**
         * <-dxCalendar.Options.showTodayButton->
         */
        showTodayButton?: boolean;
        /**
         * <-dxCalendar.Options.value->
         */
        value?: Date | number | string;
        /**
         * <-dxCalendar.Options.zoomLevel->
         */
        zoomLevel?: 'century' | 'decade' | 'month' | 'year';
    }
    /**
     * <-dxCalendar->
     */
    export class dxCalendar extends Editor {
        constructor(element: Element, options?: dxCalendarOptions)
        constructor(element: JQuery, options?: dxCalendarOptions)
    }
    /**
     * <-dxCheckBox.Options->
     */
    export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
        /**
         * <-dxCheckBox.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxCheckBox.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxCheckBox.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxCheckBox.Options.name->
         */
        name?: string;
        /**
         * <-dxCheckBox.Options.text->
         */
        text?: string;
        /**
         * <-dxCheckBox.Options.value->
         */
        value?: boolean;
    }
    /**
     * <-dxCheckBox->
     */
    export class dxCheckBox extends Editor {
        constructor(element: Element, options?: dxCheckBoxOptions)
        constructor(element: JQuery, options?: dxCheckBoxOptions)
    }
    /**
     * <-dxColorBox.Options->
     */
    export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
        /**
         * <-dxColorBox.Options.applyButtonText->
         */
        applyButtonText?: string;
        /**
         * <-dxColorBox.Options.applyValueMode->
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * <-dxColorBox.Options.cancelButtonText->
         */
        cancelButtonText?: string;
        /**
         * <-dxColorBox.Options.editAlphaChannel->
         */
        editAlphaChannel?: boolean;
        /**
         * <-dxColorBox.Options.fieldTemplate->
         */
        fieldTemplate?: DevExpress.core.template | ((value: string, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxColorBox.Options.keyStep->
         */
        keyStep?: number;
        /**
         * <-dxColorBox.Options.value->
         */
        value?: string;
    }
    /**
     * <-dxColorBox->
     */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxColorBoxOptions)
        constructor(element: JQuery, options?: dxColorBoxOptions)
    }
    /**
     * <-dxContextMenu.Options->
     */
    export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
        /**
         * <-dxContextMenu.Options.closeOnOutsideClick->
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * <-dxContextMenu.Options.dataSource->
         */
        dataSource?: string | Array<dxContextMenuItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxContextMenu.Options.items->
         */
        items?: Array<dxContextMenuItem>;
        /**
         * <-dxContextMenu.Options.onHidden->
         */
        onHidden?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxContextMenu.Options.onHiding->
         */
        onHiding?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * <-dxContextMenu.Options.onPositioning->
         */
        onPositioning?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, position?: positionConfig }) => any);
        /**
         * <-dxContextMenu.Options.onShowing->
         */
        onShowing?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * <-dxContextMenu.Options.onShown->
         */
        onShown?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxContextMenu.Options.position->
         */
        position?: positionConfig;
        /**
         * <-dxContextMenu.Options.showEvent->
         */
        showEvent?: { delay?: number, name?: string } | string;
        /**
         * <-dxContextMenu.Options.submenuDirection->
         */
        submenuDirection?: 'auto' | 'left' | 'right';
        /**
         * <-dxContextMenu.Options.target->
         */
        target?: string | Element | JQuery;
        /**
         * <-dxContextMenu.Options.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxContextMenu->
     */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: Element, options?: dxContextMenuOptions)
        constructor(element: JQuery, options?: dxContextMenuOptions)
        /**
         * <-dxContextMenu.hide()->
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxContextMenu.show()->
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxContextMenu.toggle(showing)->
         */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxContextMenuItem->
     */
    export interface dxContextMenuItem extends dxMenuBaseItem {
        /**
         * <-dxContextMenuItem.items->
         */
        items?: Array<dxContextMenuItem>;
    }
    /**
     * <-dxDataGrid.Options->
     */
    export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
        /**
         * <-dxDataGrid.Options.columns->
         */
        columns?: Array<dxDataGridColumn | string>;
        /**
         * <-dxDataGrid.Options.customizeColumns->
         */
        customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
        /**
         * <-dxDataGrid.Options.customizeExportData->
         * @deprecated <-dxDataGrid.Options.customizeExportData:depNote->
         */
        customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
        /**
         * <-dxDataGrid.Options.editing->
         */
        editing?: dxDataGridEditing;
        /**
         * <-dxDataGrid.Options.export->
         */
        export?: { allowExportSelectedData?: boolean, customizeExcelCell?: ((options: { component?: dxDataGrid, horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top', wrapTextEnabled?: boolean, backgroundColor?: string, fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid', fillPatternColor?: string, font?: DevExpress.exporter.ExcelFont, value?: string | number | Date, numberFormat?: string, gridCell?: DevExpress.excelExporter.ExcelDataGridCell }) => any), enabled?: boolean, excelFilterEnabled?: boolean, excelWrapTextEnabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string, texts?: { exportAll?: string, exportSelectedRows?: string, exportTo?: string } };
        /**
         * <-dxDataGrid.Options.groupPanel->
         */
        groupPanel?: { allowColumnDragging?: boolean, emptyPanelText?: string, visible?: boolean | 'auto' };
        /**
         * <-dxDataGrid.Options.grouping->
         */
        grouping?: { allowCollapsing?: boolean, autoExpandAll?: boolean, contextMenuEnabled?: boolean, expandMode?: 'buttonClick' | 'rowClick', texts?: { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string } };
        /**
         * <-dxDataGrid.Options.keyExpr->
         */
        keyExpr?: string | Array<string>;
        /**
         * <-dxDataGrid.Options.masterDetail->
         */
        masterDetail?: { autoExpandAll?: boolean, enabled?: boolean, template?: DevExpress.core.template | ((detailElement: DevExpress.core.dxElement, detailInfo: { key?: any, data?: any, watch?: Function }) => any) };
        /**
         * <-dxDataGrid.Options.onCellClick->
         */
        onCellClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any) | string;
        /**
         * <-dxDataGrid.Options.onCellDblClick->
         */
        onCellDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onCellHoverChanged->
         */
        onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onCellPrepared->
         */
        onCellPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /**
         * <-dxDataGrid.Options.onContextMenuPreparing->
         */
        onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onEditingStart->
         */
        onEditingStart?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /**
         * <-dxDataGrid.Options.onEditorPrepared->
         */
        onEditorPrepared?: ((options: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onEditorPreparing->
         */
        onEditorPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onExported->
         * @deprecated <-dxDataGrid.Options.onExported:depNote->
         */
        onExported?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxDataGrid.Options.onExporting->
         */
        onExporting?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /**
         * <-dxDataGrid.Options.onFileSaving->
         * @deprecated <-dxDataGrid.Options.onFileSaving:depNote->
         */
        onFileSaving?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * <-dxDataGrid.Options.onFocusedCellChanged->
         */
        onFocusedCellChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any);
        /**
         * <-dxDataGrid.Options.onFocusedCellChanging->
         */
        onFocusedCellChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxDataGridRowObject>, columns?: Array<dxDataGridColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /**
         * <-dxDataGrid.Options.onFocusedRowChanged->
         */
        onFocusedRowChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /**
         * <-dxDataGrid.Options.onFocusedRowChanging->
         */
        onFocusedRowChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxDataGridRowObject>, cancel?: boolean }) => any);
        /**
         * <-dxDataGrid.Options.onRowClick->
         */
        onRowClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => any) | string;
        /**
         * <-dxDataGrid.Options.onRowDblClick->
         */
        onRowDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxDataGrid.Options.onRowPrepared->
         */
        onRowPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxDataGrid.Options.remoteOperations->
         */
        remoteOperations?: boolean | { filtering?: boolean, groupPaging?: boolean, grouping?: boolean, paging?: boolean, sorting?: boolean, summary?: boolean } | 'auto';
        /**
         * <-dxDataGrid.Options.rowTemplate->
         */
        rowTemplate?: DevExpress.core.template | ((rowElement: DevExpress.core.dxElement, rowInfo: any) => any);
        /**
         * <-dxDataGrid.Options.scrolling->
         */
        scrolling?: dxDataGridScrolling;
        /**
         * <-dxDataGrid.Options.selection->
         */
        selection?: dxDataGridSelection;
        /**
         * <-dxDataGrid.Options.selectionFilter->
         */
        selectionFilter?: string | Array<any> | Function;
        /**
         * <-dxDataGrid.Options.sortByGroupSummaryInfo->
         */
        sortByGroupSummaryInfo?: Array<{ groupColumn?: string, sortOrder?: 'asc' | 'desc', summaryItem?: string | number }>;
        /**
         * <-dxDataGrid.Options.summary->
         */
        summary?: { calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any, groupIndex?: number }) => any), groupItems?: Array<{ alignByColumn?: boolean, column?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }>, recalculateWhileEditing?: boolean, skipEmptyValues?: boolean, texts?: { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string }, totalItems?: Array<{ alignment?: 'center' | 'left' | 'right', column?: string, cssClass?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }> };
    }
    /**
     * <-dxDataGrid.Options.editing->
     */
    export interface dxDataGridEditing extends GridBaseEditing {
        /**
         * <-dxDataGrid.Options.editing.allowAdding->
         */
        allowAdding?: boolean;
        /**
         * <-dxDataGrid.Options.editing.allowDeleting->
         */
        allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /**
         * <-dxDataGrid.Options.editing.allowUpdating->
         */
        allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /**
         * <-dxDataGrid.Options.editing.texts->
         */
        texts?: any;
    }
    /**
     * <-dxDataGrid.Options.scrolling->
     */
    export interface dxDataGridScrolling extends GridBaseScrolling {
        /**
         * <-dxDataGrid.Options.scrolling.mode->
         */
        mode?: 'infinite' | 'standard' | 'virtual';
    }
    /**
     * <-dxDataGrid.Options.selection->
     */
    export interface dxDataGridSelection extends GridBaseSelection {
        /**
         * <-dxDataGrid.Options.selection.deferred->
         */
        deferred?: boolean;
        /**
         * <-dxDataGrid.Options.selection.selectAllMode->
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * <-dxDataGrid.Options.selection.showCheckBoxesMode->
         */
        showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
    }
    /**
     * <-dxDataGrid->
     */
    export class dxDataGrid extends GridBase {
        constructor(element: Element, options?: dxDataGridOptions)
        constructor(element: JQuery, options?: dxDataGridOptions)
        /**
         * <-dxDataGrid.addColumn(columnOptions)->
         */
        addColumn(columnOptions: any | string): void;
        /**
         * <-dxDataGrid.addRow()->
         */
        addRow(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDataGrid.clearGrouping()->
         */
        clearGrouping(): void;
        /**
         * <-dxDataGrid.collapseAll(groupIndex)->
         */
        collapseAll(groupIndex?: number): void;
        /**
         * <-dxDataGrid.collapseRow(key)->
         */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDataGrid.expandAll(groupIndex)->
         */
        expandAll(groupIndex?: number): void;
        /**
         * <-dxDataGrid.expandRow(key)->
         */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDataGrid.exportToExcel(selectionOnly)->
         * @deprecated <-dxDataGrid.exportToExcel(selectionOnly):depNote->
         */
        exportToExcel(selectionOnly: boolean): void;
        /**
         * <-dxDataGrid.getSelectedRowKeys()->
         */
        getSelectedRowKeys(): Array<any> & Promise<any> & JQueryPromise<any>;
        /**
         * <-dxDataGrid.getSelectedRowsData()->
         */
        getSelectedRowsData(): Array<any> & Promise<any> & JQueryPromise<any>;
        /**
         * <-dxDataGrid.getTotalSummaryValue(summaryItemName)->
         */
        getTotalSummaryValue(summaryItemName: string): any;
        /**
         * <-dxDataGrid.getVisibleColumns()->
         */
        getVisibleColumns(): Array<dxDataGridColumn>;
        /**
         * <-dxDataGrid.getVisibleColumns(headerLevel)->
         */
        getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
        /**
         * <-dxDataGrid.getVisibleRows()->
         */
        getVisibleRows(): Array<dxDataGridRowObject>;
        /**
         * <-dxDataGrid.isRowExpanded(key)->
         */
        isRowExpanded(key: any): boolean;
        /**
         * <-dxDataGrid.isRowSelected(data)->
         */
        isRowSelected(data: any): boolean;
        /**
         * <-GridBase.isRowSelected(key)->
         */
        isRowSelected(key: any): boolean;
        /**
         * <-dxDataGrid.totalCount()->
         */
        totalCount(): number;
    }
    /**
     * <-dxDataGridColumn->
     */
    export interface dxDataGridColumn extends GridBaseColumn {
        /**
         * <-dxDataGridColumn.allowExporting->
         */
        allowExporting?: boolean;
        /**
         * <-dxDataGridColumn.allowGrouping->
         */
        allowGrouping?: boolean;
        /**
         * <-dxDataGridColumn.autoExpandGroup->
         */
        autoExpandGroup?: boolean;
        /**
         * <-dxDataGridColumn.buttons->
         */
        buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxDataGridColumnButton>;
        /**
         * <-dxDataGridColumn.calculateGroupValue->
         */
        calculateGroupValue?: string | ((rowData: any) => any);
        /**
         * <-dxDataGridColumn.cellTemplate->
         */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * <-dxDataGridColumn.columns->
         */
        columns?: Array<dxDataGridColumn | string>;
        /**
         * <-dxDataGridColumn.editCellTemplate->
         */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxDataGrid, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * <-dxDataGridColumn.groupCellTemplate->
         */
        groupCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, summaryItems?: Array<any>, groupContinuesMessage?: string, groupContinuedMessage?: string }) => any);
        /**
         * <-dxDataGridColumn.groupIndex->
         */
        groupIndex?: number;
        /**
         * <-dxDataGridColumn.headerCellTemplate->
         */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxDataGrid, columnIndex?: number, column?: dxDataGridColumn }) => any);
        /**
         * <-dxDataGridColumn.showWhenGrouped->
         */
        showWhenGrouped?: boolean;
        /**
         * <-dxDataGridColumn.type->
         */
        type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';
    }
    /**
     * <-dxDataGridColumnButton->
     */
    export interface dxDataGridColumnButton extends GridBaseColumnButton {
        /**
         * <-dxDataGridColumnButton.name->
         */
        name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /**
         * <-dxDataGridColumnButton.onClick->
         */
        onClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any) | string;
        /**
         * <-dxDataGridColumnButton.template->
         */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxDataGrid, data?: any, key?: any, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject }) => string | Element | JQuery);
        /**
         * <-dxDataGridColumnButton.visible->
         */
        visible?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => boolean);
    }
    /**
     * <-dxDataGridRowObject->
     */
    export interface dxDataGridRowObject {
        /**
         * <-dxDataGridRowObject.data->
         */
        data?: any;
        /**
         * <-dxDataGridRowObject.groupIndex->
         */
        groupIndex?: number;
        /**
         * <-dxDataGridRowObject.isEditing->
         */
        isEditing?: boolean;
        /**
         * <-dxDataGridRowObject.isExpanded->
         */
        isExpanded?: boolean;
        /**
         * <-dxDataGridRowObject.isNewRow->
         */
        isNewRow?: boolean;
        /**
         * <-dxDataGridRowObject.isSelected->
         */
        isSelected?: boolean;
        /**
         * <-dxDataGridRowObject.key->
         */
        key?: any;
        /**
         * <-dxDataGridRowObject.rowIndex->
         */
        rowIndex?: number;
        /**
         * <-dxDataGridRowObject.rowType->
         */
        rowType?: string;
        /**
         * <-dxDataGridRowObject.values->
         */
        values?: Array<any>;
    }
    /**
     * <-dxDateBox.Options->
     */
    export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
        /**
         * <-dxDateBox.Options.adaptivityEnabled->
         */
        adaptivityEnabled?: boolean;
        /**
         * <-dxDateBox.Options.applyButtonText->
         */
        applyButtonText?: string;
        /**
         * <-dxDateBox.Options.calendarOptions->
         */
        calendarOptions?: dxCalendarOptions;
        /**
         * <-dxDateBox.Options.cancelButtonText->
         */
        cancelButtonText?: string;
        /**
         * <-dxDateBox.Options.dateOutOfRangeMessage->
         */
        dateOutOfRangeMessage?: string;
        /**
         * <-dxDateBox.Options.dateSerializationFormat->
         */
        dateSerializationFormat?: string;
        /**
         * <-dxDateBox.Options.disabledDates->
         */
        disabledDates?: Array<Date> | ((data: { component?: dxDateBox, date?: Date, view?: string }) => boolean);
        /**
         * <-dxDateBox.Options.displayFormat->
         */
        displayFormat?: format;
        /**
         * <-dxDateBox.Options.interval->
         */
        interval?: number;
        /**
         * <-dxDateBox.Options.invalidDateMessage->
         */
        invalidDateMessage?: string;
        /**
         * <-dxDateBox.Options.max->
         */
        max?: Date | number | string;
        /**
         * <-dxDateBox.Options.min->
         */
        min?: Date | number | string;
        /**
         * <-dxDateBox.Options.pickerType->
         */
        pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
        /**
         * <-dxDateBox.Options.placeholder->
         */
        placeholder?: string;
        /**
         * <-dxDateBox.Options.showAnalogClock->
         */
        showAnalogClock?: boolean;
        /**
         * <-dxDateBox.Options.type->
         */
        type?: 'date' | 'datetime' | 'time';
        /**
         * <-dxDateBox.Options.useMaskBehavior->
         */
        useMaskBehavior?: boolean;
        /**
         * <-dxDateBox.Options.value->
         */
        value?: Date | number | string;
    }
    /**
     * <-dxDateBox->
     */
    export class dxDateBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDateBoxOptions)
        constructor(element: JQuery, options?: dxDateBoxOptions)
        /**
         * <-dxDateBox.close()->
         */
        close(): void;
        /**
         * <-dxDateBox.open()->
         */
        open(): void;
    }
    /**
     * <-dxDeferRendering.Options->
     */
    export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
        /**
         * <-dxDeferRendering.Options.animation->
         */
        animation?: animationConfig;
        /**
         * <-dxDeferRendering.Options.onRendered->
         */
        onRendered?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxDeferRendering.Options.onShown->
         */
        onShown?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxDeferRendering.Options.renderWhen->
         */
        renderWhen?: Promise<void> | JQueryPromise<void> | boolean;
        /**
         * <-dxDeferRendering.Options.showLoadIndicator->
         */
        showLoadIndicator?: boolean;
        /**
         * <-dxDeferRendering.Options.staggerItemSelector->
         */
        staggerItemSelector?: string;
    }
    /**
     * <-dxDeferRendering->
     */
    export class dxDeferRendering extends Widget {
        constructor(element: Element, options?: dxDeferRenderingOptions)
        constructor(element: JQuery, options?: dxDeferRenderingOptions)
    }
    /**
     * <-dxDiagram.Options->
     */
    export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
        /**
         * <-dxDiagram.Options.autoZoomMode->
         */
        autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
        /**
         * <-dxDiagram.Options.contextMenu->
         */
        contextMenu?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, enabled?: boolean };
        /**
         * <-dxDiagram.Options.contextToolbox->
         */
        contextToolbox?: { category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', enabled?: boolean, shapeIconsPerRow?: number, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, width?: number };
        /**
         * <-dxDiagram.Options.customShapeTemplate->
         */
        customShapeTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any);
        /**
         * <-dxDiagram.Options.customShapeToolboxTemplate->
         */
        customShapeToolboxTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any);
        /**
         * <-dxDiagram.Options.customShapes->
         */
        customShapes?: Array<{ allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageToolboxUrl?: string, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string, category?: string, connectionPoints?: Array<{ x?: number, y?: number }>, defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any), templateHeight?: number, templateLeft?: number, templateTop?: number, templateWidth?: number, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, toolboxTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any), toolboxWidthToHeightRatio?: number, type?: string }>;
        /**
         * <-dxDiagram.Options.defaultItemProperties->
         */
        defaultItemProperties?: { connectorLineEnd?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle', connectorLineStart?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle', connectorLineType?: 'straight' | 'orthogonal', style?: any, textStyle?: any };
        /**
         * <-dxDiagram.Options.edges->
         */
        edges?: { customDataExpr?: string | ((data: any) => any), dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, fromExpr?: string | ((data: any) => any), fromLineEndExpr?: string | ((data: any) => any), fromPointIndexExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), lineTypeExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), pointsExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), toExpr?: string | ((data: any) => any), toLineEndExpr?: string | ((data: any) => any), toPointIndexExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /**
         * <-dxDiagram.Options.export->
         */
        export?: { fileName?: string, proxyUrl?: string };
        /**
         * <-dxDiagram.Options.fullScreen->
         */
        fullScreen?: boolean;
        /**
         * <-dxDiagram.Options.gridSize->
         */
        gridSize?: number | { items?: Array<number>, value?: number };
        /**
         * <-dxDiagram.Options.hasChanges->
         */
        hasChanges?: boolean;
        /**
         * <-dxDiagram.Options.historyToolbar->
         */
        historyToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * <-dxDiagram.Options.mainToolbar->
         */
        mainToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * <-dxDiagram.Options.nodes->
         */
        nodes?: { autoLayout?: 'auto' | 'off' | 'tree' | 'layered' | { orientation?: 'auto' | 'vertical' | 'horizontal', type?: 'auto' | 'off' | 'tree' | 'layered' }, autoSizeEnabled?: boolean, containerChildrenExpr?: string | ((data: any) => any), containerKeyExpr?: string | ((data: any) => any), customDataExpr?: string | ((data: any) => any), dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, heightExpr?: string | ((data: any) => any), imageUrlExpr?: string | ((data: any) => any), itemsExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), leftExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), parentKeyExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), topExpr?: string | ((data: any) => any), typeExpr?: string | ((data: any) => any), widthExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /**
         * <-dxDiagram.Options.onCustomCommand->
         */
        onCustomCommand?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, name?: string }) => any);
        /**
         * <-dxDiagram.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /**
         * <-dxDiagram.Options.onItemDblClick->
         */
        onItemDblClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /**
         * <-dxDiagram.Options.onRequestLayoutUpdate->
         */
        onRequestLayoutUpdate?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any>, allowed?: boolean }) => any);
        /**
         * <-dxDiagram.Options.onRequestOperation->
         */
        onRequestOperation?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, operation?: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape', args?: dxDiagramRequestOperationAddShapeArgs | dxDiagramRequestOperationAddShapeFromToolboxArgs | dxDiagramRequestOperationDeleteShapeArgs | dxDiagramRequestOperationDeleteConnectorArgs | dxDiagramRequestOperationChangeConnectionArgs | dxDiagramRequestOperationChangeConnectorPointsArgs | dxDiagramRequestOperationBeforeChangeShapeTextArgs | dxDiagramRequestOperationChangeShapeTextArgs | dxDiagramRequestOperationBeforeChangeConnectorTextArgs | dxDiagramRequestOperationChangeConnectorTextArgs | dxDiagramRequestOperationResizeShapeArgs, updateUI?: boolean, allowed?: boolean }) => any);
        /**
         * <-dxDiagram.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, items?: Array<dxDiagramItem> }) => any);
        /**
         * <-dxDiagram.Options.operationSettings->
         */
        operationSettings?: { allowAddShape?: boolean, allowAddShapeFromToolbox?: boolean, allowChangeConnection?: boolean, allowChangeConnectorPoints?: boolean, allowChangeConnectorText?: boolean, allowChangeShapeText?: boolean, allowDeleteConnector?: boolean, allowDeleteShape?: boolean, allowResizeShape?: boolean };
        /**
         * <-dxDiagram.Options.pageColor->
         */
        pageColor?: string;
        /**
         * <-dxDiagram.Options.pageOrientation->
         */
        pageOrientation?: 'portrait' | 'landscape';
        /**
         * <-dxDiagram.Options.pageSize->
         */
        pageSize?: { height?: number, items?: Array<{ height?: number, text?: string, width?: number }>, width?: number };
        /**
         * <-dxDiagram.Options.propertiesPanel->
         */
        propertiesPanel?: { tabs?: Array<{ commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, groups?: Array<{ commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, title?: string }>, title?: string }>, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled' };
        /**
         * <-dxDiagram.Options.readOnly->
         */
        readOnly?: boolean;
        /**
         * <-dxDiagram.Options.showGrid->
         */
        showGrid?: boolean;
        /**
         * <-dxDiagram.Options.simpleView->
         */
        simpleView?: boolean;
        /**
         * <-dxDiagram.Options.snapToGrid->
         */
        snapToGrid?: boolean;
        /**
         * <-dxDiagram.Options.toolbox->
         */
        toolbox?: { groups?: Array<{ category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', expanded?: boolean, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, title?: string }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>, shapeIconsPerRow?: number, showSearch?: boolean, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled', width?: number };
        /**
         * <-dxDiagram.Options.units->
         */
        units?: 'in' | 'cm' | 'px';
        /**
         * <-dxDiagram.Options.viewToolbar->
         */
        viewToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * <-dxDiagram.Options.viewUnits->
         */
        viewUnits?: 'in' | 'cm' | 'px';
        /**
         * <-dxDiagram.Options.zoomLevel->
         */
        zoomLevel?: number | { items?: Array<number>, value?: number };
    }
    /**
     * <-dxDiagram->
     */
    export class dxDiagram extends Widget {
        constructor(element: Element, options?: dxDiagramOptions)
        constructor(element: JQuery, options?: dxDiagramOptions)
        /**
         * <-dxDiagram.export()->
         */
        export(): string;
        /**
         * <-dxDiagram.exportTo(format, callback)->
         */
        exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
        /**
         * <-dxDiagram.getEdgeDataSource()->
         */
        getEdgeDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxDiagram.getNodeDataSource()->
         */
        getNodeDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxDiagram.import(data, updateExistingItemsOnly)->
         */
        import(data: string, updateExistingItemsOnly?: boolean): void;
    }
    /**
     * <-dxDiagramConnector->
     */
    export interface dxDiagramConnector extends dxDiagramItem {
        /**
         * <-dxDiagramConnector.fromKey->
         */
        fromKey?: any;
        /**
         * <-dxDiagramConnector.texts->
         */
        texts?: Array<string>;
        /**
         * <-dxDiagramConnector.toKey->
         */
        toKey?: any;
    }
    /**
     * <-dxDiagramCustomCommand->
     */
    export interface dxDiagramCustomCommand {
        /**
         * <-dxDiagramCustomCommand.icon->
         */
        icon?: string;
        /**
         * <-dxDiagramCustomCommand.items->
         */
        items?: Array<dxDiagramCustomCommand>;
        /**
         * <-dxDiagramCustomCommand.name->
         */
        name?: string | 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor';
        /**
         * <-dxDiagramCustomCommand.text->
         */
        text?: string;
    }
    /**
     * <-dxDiagramItem->
     */
    export interface dxDiagramItem {
        /**
         * <-dxDiagramItem.dataItem->
         */
        dataItem?: any;
        /**
         * <-dxDiagramItem.id->
         */
        id?: string;
        /**
         * <-dxDiagramItem.itemType->
         */
        itemType?: 'shape' | 'connector';
    }
    /**
     * <-dxDiagramRequestOperationAddShapeArgs->
     */
    export interface dxDiagramRequestOperationAddShapeArgs {
        /**
         * <-dxDiagramRequestOperationAddShapeArgs.position->
         */
        position?: any;
        /**
         * <-dxDiagramRequestOperationAddShapeArgs.shape->
         */
        shape?: dxDiagramShape;
    }
    /**
     * <-dxDiagramRequestOperationAddShapeFromToolboxArgs->
     */
    export interface dxDiagramRequestOperationAddShapeFromToolboxArgs {
        /**
         * <-dxDiagramRequestOperationAddShapeFromToolboxArgs.shapeType->
         */
        shapeType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    }
    /**
     * <-dxDiagramRequestOperationBeforeChangeConnectorTextArgs->
     */
    export interface dxDiagramRequestOperationBeforeChangeConnectorTextArgs {
        /**
         * <-dxDiagramRequestOperationBeforeChangeConnectorTextArgs.connector->
         */
        connector?: dxDiagramConnector;
        /**
         * <-dxDiagramRequestOperationBeforeChangeConnectorTextArgs.index->
         */
        index?: number;
    }
    /**
     * <-dxDiagramRequestOperationBeforeChangeShapeTextArgs->
     */
    export interface dxDiagramRequestOperationBeforeChangeShapeTextArgs {
        /**
         * <-dxDiagramRequestOperationBeforeChangeShapeTextArgs.shape->
         */
        shape?: dxDiagramShape;
    }
    /**
     * <-dxDiagramRequestOperationChangeConnectionArgs->
     */
    export interface dxDiagramRequestOperationChangeConnectionArgs {
        /**
         * <-dxDiagramRequestOperationChangeConnectionArgs.connectionPointIndex->
         */
        connectionPointIndex?: number;
        /**
         * <-dxDiagramRequestOperationChangeConnectionArgs.connector->
         */
        connector?: dxDiagramConnector;
        /**
         * <-dxDiagramRequestOperationChangeConnectionArgs.connectorPosition->
         */
        connectorPosition?: 'start' | 'end';
        /**
         * <-dxDiagramRequestOperationChangeConnectionArgs.shape->
         */
        shape?: dxDiagramShape;
    }
    /**
     * <-dxDiagramRequestOperationChangeConnectorPointsArgs->
     */
    export interface dxDiagramRequestOperationChangeConnectorPointsArgs {
        /**
         * <-dxDiagramRequestOperationChangeConnectorPointsArgs.connector->
         */
        connector?: dxDiagramConnector;
        /**
         * <-dxDiagramRequestOperationChangeConnectorPointsArgs.newPoints->
         */
        newPoints?: Array<any>;
        /**
         * <-dxDiagramRequestOperationChangeConnectorPointsArgs.oldPoints->
         */
        oldPoints?: Array<any>;
    }
    /**
     * <-dxDiagramRequestOperationChangeConnectorTextArgs->
     */
    export interface dxDiagramRequestOperationChangeConnectorTextArgs {
        /**
         * <-dxDiagramRequestOperationChangeConnectorTextArgs.connector->
         */
        connector?: dxDiagramConnector;
        /**
         * <-dxDiagramRequestOperationChangeConnectorTextArgs.index->
         */
        index?: number;
        /**
         * <-dxDiagramRequestOperationChangeConnectorTextArgs.text->
         */
        text?: string;
    }
    /**
     * <-dxDiagramRequestOperationChangeShapeTextArgs->
     */
    export interface dxDiagramRequestOperationChangeShapeTextArgs {
        /**
         * <-dxDiagramRequestOperationChangeShapeTextArgs.shape->
         */
        shape?: dxDiagramShape;
        /**
         * <-dxDiagramRequestOperationChangeShapeTextArgs.text->
         */
        text?: string;
    }
    /**
     * <-dxDiagramRequestOperationDeleteConnectorArgs->
     */
    export interface dxDiagramRequestOperationDeleteConnectorArgs {
        /**
         * <-dxDiagramRequestOperationDeleteConnectorArgs.connector->
         */
        connector?: dxDiagramConnector;
    }
    /**
     * <-dxDiagramRequestOperationDeleteShapeArgs->
     */
    export interface dxDiagramRequestOperationDeleteShapeArgs {
        /**
         * <-dxDiagramRequestOperationDeleteShapeArgs.shape->
         */
        shape?: dxDiagramShape;
    }
    /**
     * <-dxDiagramRequestOperationResizeShapeArgs->
     */
    export interface dxDiagramRequestOperationResizeShapeArgs {
        /**
         * <-dxDiagramRequestOperationResizeShapeArgs.newSize->
         */
        newSize?: Array<any>;
        /**
         * <-dxDiagramRequestOperationResizeShapeArgs.oldSize->
         */
        oldSize?: Array<any>;
        /**
         * <-dxDiagramRequestOperationResizeShapeArgs.shape->
         */
        shape?: dxDiagramShape;
    }
    /**
     * <-dxDiagramShape->
     */
    export interface dxDiagramShape extends dxDiagramItem {
        /**
         * <-dxDiagramShape.text->
         */
        text?: string;
        /**
         * <-dxDiagramShape.type->
         */
        type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    }
    /**
     * <-dxDraggable.Options->
     */
    export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
        /**
         * <-dxDraggable.Options.clone->
         */
        clone?: boolean;
        /**
         * <-dxDraggable.Options.dragTemplate->
         */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDraggable.Options.onDragEnd->
         */
        onDragEnd?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * <-dxDraggable.Options.onDragMove->
         */
        onDragMove?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * <-dxDraggable.Options.onDragStart->
         */
        onDragStart?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any);
    }
    /**
     * <-dxDraggable->
     */
    export class dxDraggable extends DraggableBase {
        constructor(element: Element, options?: dxDraggableOptions)
        constructor(element: JQuery, options?: dxDraggableOptions)
    }
    /**
     * <-dxDrawer.Options->
     */
    export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
        /**
         * <-dxDrawer.Options.animationDuration->
         */
        animationDuration?: number;
        /**
         * <-dxDrawer.Options.animationEnabled->
         */
        animationEnabled?: boolean;
        /**
         * <-dxDrawer.Options.closeOnOutsideClick->
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * <-dxDrawer.Options.maxSize->
         */
        maxSize?: number;
        /**
         * <-dxDrawer.Options.minSize->
         */
        minSize?: number;
        /**
         * <-dxDrawer.Options.opened->
         */
        opened?: boolean;
        /**
         * <-dxDrawer.Options.openedStateMode->
         */
        openedStateMode?: 'overlap' | 'shrink' | 'push';
        /**
         * <-dxDrawer.Options.position->
         */
        position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
        /**
         * <-dxDrawer.Options.revealMode->
         */
        revealMode?: 'slide' | 'expand';
        /**
         * <-dxDrawer.Options.shading->
         */
        shading?: boolean;
        /**
         * <-dxDrawer.Options.target->
         * @deprecated <-dxDrawer.Options.target:depNote->
         */
        target?: string | Element | JQuery;
        /**
         * <-dxDrawer.Options.template->
         */
        template?: DevExpress.core.template | ((Element: DevExpress.core.dxElement) => any);
    }
    /**
     * <-dxDrawer->
     */
    export class dxDrawer extends Widget {
        constructor(element: Element, options?: dxDrawerOptions)
        constructor(element: JQuery, options?: dxDrawerOptions)
        /**
         * <-dxDrawer.content()->
         */
        content(): DevExpress.core.dxElement;
        /**
         * <-dxDrawer.hide()->
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDrawer.show()->
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDrawer.toggle()->
         */
        toggle(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxDropDownBox.Options->
     */
    export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
        /**
         * <-dxDropDownBox.Options.acceptCustomValue->
         */
        acceptCustomValue?: boolean;
        /**
         * <-dxDropDownBox.Options.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownBox.Options.displayValueFormatter->
         */
        displayValueFormatter?: ((value: string | Array<any>) => string);
        /**
         * <-dxDropDownBox.Options.fieldTemplate->
         */
        fieldTemplate?: DevExpress.core.template | ((value: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownBox.Options.openOnFieldClick->
         */
        openOnFieldClick?: boolean;
        /**
         * <-dxDropDownBox.Options.valueChangeEvent->
         */
        valueChangeEvent?: string;
    }
    /**
     * <-dxDropDownBox->
     */
    export class dxDropDownBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownBoxOptions)
        constructor(element: JQuery, options?: dxDropDownBoxOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-dxDropDownButton.Options->
     */
    export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
        /**
         * <-dxDropDownButton.Options.dataSource->
         */
        dataSource?: string | Array<dxDropDownButtonItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxDropDownButton.Options.deferRendering->
         */
        deferRendering?: boolean;
        /**
         * <-dxDropDownButton.Options.displayExpr->
         */
        displayExpr?: string | ((itemData: any) => string);
        /**
         * <-dxDropDownButton.Options.dropDownContentTemplate->
         */
        dropDownContentTemplate?: DevExpress.core.template | ((data: Array<string | number | any> | DevExpress.data.DataSource, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownButton.Options.dropDownOptions->
         */
        dropDownOptions?: dxPopupOptions;
        /**
         * <-dxDropDownButton.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxDropDownButton.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxDropDownButton.Options.icon->
         */
        icon?: string;
        /**
         * <-dxDropDownButton.Options.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownButton.Options.items->
         */
        items?: Array<dxDropDownButtonItem | any>;
        /**
         * <-dxDropDownButton.Options.keyExpr->
         */
        keyExpr?: string;
        /**
         * <-dxDropDownButton.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-dxDropDownButton.Options.onButtonClick->
         */
        onButtonClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, selectedItem?: any }) => any) | string;
        /**
         * <-dxDropDownButton.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any) | string;
        /**
         * <-dxDropDownButton.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, item?: any, previousItem?: any }) => any) | string;
        /**
         * <-dxDropDownButton.Options.opened->
         */
        opened?: boolean;
        /**
         * <-dxDropDownButton.Options.selectedItem->
         */
        selectedItem?: string | number | any;
        /**
         * <-dxDropDownButton.Options.selectedItemKey->
         */
        selectedItemKey?: string | number;
        /**
         * <-dxDropDownButton.Options.showArrowIcon->
         */
        showArrowIcon?: boolean;
        /**
         * <-dxDropDownButton.Options.splitButton->
         */
        splitButton?: boolean;
        /**
         * <-dxDropDownButton.Options.stylingMode->
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /**
         * <-dxDropDownButton.Options.text->
         */
        text?: string;
        /**
         * <-dxDropDownButton.Options.useSelectMode->
         */
        useSelectMode?: boolean;
        /**
         * <-dxDropDownButton.Options.wrapItemText->
         */
        wrapItemText?: boolean;
    }
    /**
     * <-dxDropDownButton->
     */
    export class dxDropDownButton extends Widget {
        constructor(element: Element, options?: dxDropDownButtonOptions)
        constructor(element: JQuery, options?: dxDropDownButtonOptions)
        /**
         * <-dxDropDownButton.close()->
         */
        close(): Promise<void> & JQueryPromise<void>;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxDropDownButton.open()->
         */
        open(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDropDownButton.toggle()->
         */
        toggle(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxDropDownButton.toggle(visibility)->
         */
        toggle(visibility: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxDropDownButtonItem->
     */
    export interface dxDropDownButtonItem extends dxListItem {
        /**
         * <-dxDropDownButtonItem.onClick->
         */
        onClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any) | string;
    }
    /**
     * <-dxDropDownEditor.Options->
     */
    export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
        /**
         * <-dxDropDownEditor.Options.acceptCustomValue->
         */
        acceptCustomValue?: boolean;
        /**
         * <-dxDropDownEditor.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxDropDownEditor.Options.applyValueMode->
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * <-dxDropDownEditor.Options.buttons->
         */
        buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
        /**
         * <-dxDropDownEditor.Options.deferRendering->
         */
        deferRendering?: boolean;
        /**
         * <-dxDropDownEditor.Options.dropDownButtonTemplate->
         */
        dropDownButtonTemplate?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownEditor.Options.dropDownOptions->
         */
        dropDownOptions?: dxPopupOptions;
        /**
         * <-dxDropDownEditor.Options.onClosed->
         */
        onClosed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxDropDownEditor.Options.onOpened->
         */
        onOpened?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxDropDownEditor.Options.openOnFieldClick->
         */
        openOnFieldClick?: boolean;
        /**
         * <-dxDropDownEditor.Options.opened->
         */
        opened?: boolean;
        /**
         * <-dxDropDownEditor.Options.showDropDownButton->
         */
        showDropDownButton?: boolean;
        /**
         * <-dxDropDownEditor.Options.value->
         */
        value?: any;
    }
    /**
     * <-dxDropDownEditor->
     */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: Element, options?: dxDropDownEditorOptions)
        constructor(element: JQuery, options?: dxDropDownEditorOptions)
        /**
         * <-dxDropDownEditor.close()->
         */
        close(): void;
        /**
         * <-dxDropDownEditor.content()->
         */
        content(): DevExpress.core.dxElement;
        /**
         * <-dxDropDownEditor.field()->
         */
        field(): DevExpress.core.dxElement;
        /**
         * <-dxDropDownEditor.open()->
         */
        open(): void;
    }
    /**
     * <-dxDropDownList.Options->
     */
    export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
        /**
         * <-dxDropDownList.Options.displayValue->
         */
        displayValue?: string;
        /**
         * <-dxDropDownList.Options.groupTemplate->
         */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownList.Options.grouped->
         */
        grouped?: boolean;
        /**
         * <-dxDropDownList.Options.minSearchLength->
         */
        minSearchLength?: number;
        /**
         * <-dxDropDownList.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-dxDropDownList.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: any, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxDropDownList.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, selectedItem?: any }) => any);
        /**
         * <-dxDropDownList.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxDropDownList.Options.searchEnabled->
         */
        searchEnabled?: boolean;
        /**
         * <-dxDropDownList.Options.searchExpr->
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * <-dxDropDownList.Options.searchMode->
         */
        searchMode?: 'contains' | 'startswith';
        /**
         * <-dxDropDownList.Options.searchTimeout->
         */
        searchTimeout?: number;
        /**
         * <-dxDropDownList.Options.selectedItem->
         */
        selectedItem?: any;
        /**
         * <-dxDropDownList.Options.showDataBeforeSearch->
         */
        showDataBeforeSearch?: boolean;
        /**
         * <-dxDropDownList.Options.value->
         */
        value?: any;
        /**
         * <-dxDropDownList.Options.valueChangeEvent->
         */
        valueChangeEvent?: string;
        /**
         * <-dxDropDownList.Options.wrapItemText->
         */
        wrapItemText?: boolean;
    }
    /**
     * <-dxDropDownList->
     */
    export class dxDropDownList extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownListOptions)
        constructor(element: JQuery, options?: dxDropDownListOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-dxDropDownMenu.Options->
     */
    export interface dxDropDownMenuOptions extends WidgetOptions<dxDropDownMenu> {
        /**
         * <-dxDropDownMenu.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxDropDownMenu.Options.buttonIcon->
         */
        buttonIcon?: string;
        /**
         * <-dxDropDownMenu.Options.buttonText->
         */
        buttonText?: string;
        /**
         * <-dxDropDownMenu.Options.dataSource->
         */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxDropDownMenu.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxDropDownMenu.Options.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxDropDownMenu.Options.items->
         */
        items?: Array<any>;
        /**
         * <-dxDropDownMenu.Options.onButtonClick->
         */
        onButtonClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxDropDownMenu.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxDropDownMenu.Options.opened->
         */
        opened?: boolean;
        /**
         * <-dxDropDownMenu.Options.popupHeight->
         */
        popupHeight?: number | string | Function;
        /**
         * <-dxDropDownMenu.Options.popupWidth->
         */
        popupWidth?: number | string | Function;
        /**
         * <-dxDropDownMenu.Options.usePopover->
         */
        usePopover?: boolean;
    }
    /**
     * <-dxDropDownMenu->
     */
    export class dxDropDownMenu extends Widget {
        constructor(element: Element, options?: dxDropDownMenuOptions)
        constructor(element: JQuery, options?: dxDropDownMenuOptions)
        /**
         * <-dxDropDownMenu.close()->
         */
        close(): void;
        /**
         * <-dxDropDownMenu.open()->
         */
        open(): void;
    }
    /**
     * <-dxFileManager.Options->
     */
    export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
        /**
         * <-dxFileManager.Options.allowedFileExtensions->
         */
        allowedFileExtensions?: Array<string>;
        /**
         * <-dxFileManager.Options.contextMenu->
         */
        contextMenu?: dxFileManagerContextMenu;
        /**
         * <-dxFileManager.Options.currentPath->
         */
        currentPath?: string;
        /**
         * <-dxFileManager.Options.currentPathKeys->
         */
        currentPathKeys?: Array<string>;
        /**
         * <-dxFileManager.Options.customizeDetailColumns->
         */
        customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
        /**
         * <-dxFileManager.Options.customizeThumbnail->
         */
        customizeThumbnail?: ((fileSystemItem: DevExpress.fileManagement.FileSystemItem) => string);
        /**
         * <-dxFileManager.Options.fileSystemProvider->
         */
        fileSystemProvider?: any;
        /**
         * <-dxFileManager.Options.focusedItemKey->
         */
        focusedItemKey?: string;
        /**
         * <-dxFileManager.Options.itemView->
         */
        itemView?: { details?: { columns?: Array<dxFileManagerDetailsColumn | string> }, mode?: 'details' | 'thumbnails', showFolders?: boolean, showParentFolder?: boolean };
        /**
         * <-dxFileManager.Options.onContextMenuItemClick->
         */
        onContextMenuItemClick?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, fileSystemItem?: DevExpress.fileManagement.FileSystemItem, viewArea?: 'navPane' | 'itemView' }) => any);
        /**
         * <-dxFileManager.Options.onCurrentDirectoryChanged->
         */
        onCurrentDirectoryChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, directory?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * <-dxFileManager.Options.onErrorOccurred->
         */
        onErrorOccurred?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, errorCode?: number, errorText?: string, fileSystemItem?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * <-dxFileManager.Options.onFocusedItemChanged->
         */
        onFocusedItemChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, item?: DevExpress.fileManagement.FileSystemItem, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxFileManager.Options.onSelectedFileOpened->
         */
        onSelectedFileOpened?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, file?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * <-dxFileManager.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, currentSelectedItemKeys?: Array<string>, currentDeselectedItemKeys?: Array<string>, selectedItems?: Array<DevExpress.fileManagement.FileSystemItem>, selectedItemKeys?: Array<string> }) => any);
        /**
         * <-dxFileManager.Options.onToolbarItemClick->
         */
        onToolbarItemClick?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * <-dxFileManager.Options.permissions->
         */
        permissions?: { copy?: boolean, create?: boolean, delete?: boolean, download?: boolean, move?: boolean, rename?: boolean, upload?: boolean };
        /**
         * <-dxFileManager.Options.rootFolderName->
         */
        rootFolderName?: string;
        /**
         * <-dxFileManager.Options.selectedItemKeys->
         */
        selectedItemKeys?: Array<string>;
        /**
         * <-dxFileManager.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * <-dxFileManager.Options.toolbar->
         */
        toolbar?: dxFileManagerToolbar;
        /**
         * <-dxFileManager.Options.upload->
         */
        upload?: { chunkSize?: number, maxFileSize?: number };
    }
    /**
     * <-dxFileManager->
     */
    export class dxFileManager extends Widget {
        constructor(element: Element, options?: dxFileManagerOptions)
        constructor(element: JQuery, options?: dxFileManagerOptions)
        /**
         * <-dxFileManager.getCurrentDirectory()->
         */
        getCurrentDirectory(): any;
        /**
         * <-dxFileManager.getSelectedItems()->
         */
        getSelectedItems(): Array<any>;
        /**
         * <-dxFileManager.refresh()->
         */
        refresh(): Promise<any> & JQueryPromise<any>;
    }
    /**
     * <-dxFileManagerContextMenu->
     */
    export interface dxFileManagerContextMenu {
        /**
         * <-dxFileManagerContextMenu.items->
         */
        items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
    }
    /**
     * <-dxFileManagerContextMenuItem->
     */
    export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
        /**
         * <-dxFileManagerContextMenuItem.items->
         */
        items?: Array<dxFileManagerContextMenuItem>;
        /**
         * <-dxFileManagerContextMenuItem.name->
         */
        name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
        /**
         * <-dxFileManagerContextMenuItem.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxFileManagerDetailsColumn->
     */
    export interface dxFileManagerDetailsColumn {
        /**
         * <-dxFileManagerDetailsColumn.alignment->
         */
        alignment?: 'center' | 'left' | 'right' | undefined;
        /**
         * <-dxFileManagerDetailsColumn.caption->
         */
        caption?: string;
        /**
         * <-dxFileManagerDetailsColumn.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFileManagerDetailsColumn.dataField->
         */
        dataField?: string;
        /**
         * <-dxFileManagerDetailsColumn.dataType->
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * <-dxFileManagerDetailsColumn.hidingPriority->
         */
        hidingPriority?: number;
        /**
         * <-dxFileManagerDetailsColumn.sortIndex->
         */
        sortIndex?: number;
        /**
         * <-dxFileManagerDetailsColumn.sortOrder->
         */
        sortOrder?: 'asc' | 'desc' | undefined;
        /**
         * <-dxFileManagerDetailsColumn.visible->
         */
        visible?: boolean;
        /**
         * <-dxFileManagerDetailsColumn.visibleIndex->
         */
        visibleIndex?: number;
        /**
         * <-dxFileManagerDetailsColumn.width->
         */
        width?: number | string;
    }
    /**
     * <-dxFileManagerToolbar->
     */
    export interface dxFileManagerToolbar {
        /**
         * <-dxFileManagerToolbar.fileSelectionItems->
         */
        fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
        /**
         * <-dxFileManagerToolbar.items->
         */
        items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    }
    /**
     * <-dxFileManagerToolbarItem->
     */
    export interface dxFileManagerToolbarItem extends dxToolbarItem {
        /**
         * <-dxFileManagerToolbarItem.icon->
         */
        icon?: string;
        /**
         * <-dxFileManagerToolbarItem.location->
         */
        location?: 'after' | 'before' | 'center';
        /**
         * <-dxFileManagerToolbarItem.name->
         */
        name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
        /**
         * <-dxFileManagerToolbarItem.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxFileUploader.Options->
     */
    export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
        /**
         * <-dxFileUploader.Options.abortUpload->
         */
        abortUpload?: ((file: File, uploadInfo?: DevExpress.fileManagement.UploadInfo) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-dxFileUploader.Options.accept->
         */
        accept?: string;
        /**
         * <-dxFileUploader.Options.allowCanceling->
         */
        allowCanceling?: boolean;
        /**
         * <-dxFileUploader.Options.allowedFileExtensions->
         */
        allowedFileExtensions?: Array<string>;
        /**
         * <-dxFileUploader.Options.chunkSize->
         */
        chunkSize?: number;
        /**
         * <-dxFileUploader.Options.dialogTrigger->
         */
        dialogTrigger?: string | Element | JQuery;
        /**
         * <-dxFileUploader.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxFileUploader.Options.inputAttr->
         */
        inputAttr?: any;
        /**
         * <-dxFileUploader.Options.invalidFileExtensionMessage->
         */
        invalidFileExtensionMessage?: string;
        /**
         * <-dxFileUploader.Options.invalidMaxFileSizeMessage->
         */
        invalidMaxFileSizeMessage?: string;
        /**
         * <-dxFileUploader.Options.invalidMinFileSizeMessage->
         */
        invalidMinFileSizeMessage?: string;
        /**
         * <-dxFileUploader.Options.labelText->
         */
        labelText?: string;
        /**
         * <-dxFileUploader.Options.maxFileSize->
         */
        maxFileSize?: number;
        /**
         * <-dxFileUploader.Options.minFileSize->
         */
        minFileSize?: number;
        /**
         * <-dxFileUploader.Options.multiple->
         */
        multiple?: boolean;
        /**
         * <-dxFileUploader.Options.name->
         */
        name?: string;
        /**
         * <-dxFileUploader.Options.onProgress->
         */
        onProgress?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * <-dxFileUploader.Options.onUploadAborted->
         */
        onUploadAborted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * <-dxFileUploader.Options.onUploadError->
         */
        onUploadError?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest, error?: any }) => any);
        /**
         * <-dxFileUploader.Options.onUploadStarted->
         */
        onUploadStarted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * <-dxFileUploader.Options.onUploaded->
         */
        onUploaded?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * <-dxFileUploader.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, event?: DevExpress.events.event }) => any);
        /**
         * <-dxFileUploader.Options.progress->
         */
        progress?: number;
        /**
         * <-dxFileUploader.Options.readyToUploadMessage->
         */
        readyToUploadMessage?: string;
        /**
         * <-dxFileUploader.Options.selectButtonText->
         */
        selectButtonText?: string;
        /**
         * <-dxFileUploader.Options.showFileList->
         */
        showFileList?: boolean;
        /**
         * <-dxFileUploader.Options.uploadAbortedMessage->
         */
        uploadAbortedMessage?: string;
        /**
         * <-dxFileUploader.Options.uploadButtonText->
         */
        uploadButtonText?: string;
        /**
         * <-dxFileUploader.Options.uploadChunk->
         */
        uploadChunk?: ((file: File, uploadInfo: DevExpress.fileManagement.UploadInfo) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-dxFileUploader.Options.uploadFailedMessage->
         */
        uploadFailedMessage?: string;
        /**
         * <-dxFileUploader.Options.uploadFile->
         */
        uploadFile?: ((file: File, progressCallback: Function) => Promise<any> | JQueryPromise<any> | any);
        /**
         * <-dxFileUploader.Options.uploadHeaders->
         */
        uploadHeaders?: any;
        /**
         * <-dxFileUploader.Options.uploadMethod->
         */
        uploadMethod?: 'POST' | 'PUT';
        /**
         * <-dxFileUploader.Options.uploadMode->
         */
        uploadMode?: 'instantly' | 'useButtons' | 'useForm';
        /**
         * <-dxFileUploader.Options.uploadUrl->
         */
        uploadUrl?: string;
        /**
         * <-dxFileUploader.Options.uploadedMessage->
         */
        uploadedMessage?: string;
        /**
         * <-dxFileUploader.Options.value->
         */
        value?: Array<File>;
    }
    /**
     * <-dxFileUploader->
     */
    export class dxFileUploader extends Editor {
        constructor(element: Element, options?: dxFileUploaderOptions)
        constructor(element: JQuery, options?: dxFileUploaderOptions)
        /**
         * <-dxFileUploader.abortUpload()->
         */
        abortUpload(): void;
        /**
         * <-dxFileUploader.abortUpload(file)->
         */
        abortUpload(file: File): void;
        /**
         * <-dxFileUploader.abortUpload(fileIndex)->
         */
        abortUpload(fileIndex: number): void;
        /**
         * <-dxFileUploader.upload()->
         */
        upload(): void;
        /**
         * <-dxFileUploader.upload(file)->
         */
        upload(file: File): void;
        /**
         * <-dxFileUploader.upload(fileIndex)->
         */
        upload(fileIndex: number): void;
    }
    /**
     * <-dxFilterBuilder.Options->
     */
    export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
        /**
         * <-dxFilterBuilder.Options.allowHierarchicalFields->
         */
        allowHierarchicalFields?: boolean;
        /**
         * <-dxFilterBuilder.Options.customOperations->
         */
        customOperations?: Array<dxFilterBuilderCustomOperation>;
        /**
         * <-dxFilterBuilder.Options.fields->
         */
        fields?: Array<dxFilterBuilderField>;
        /**
         * <-dxFilterBuilder.Options.filterOperationDescriptions->
         */
        filterOperationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string };
        /**
         * <-dxFilterBuilder.Options.groupOperationDescriptions->
         */
        groupOperationDescriptions?: { and?: string, notAnd?: string, notOr?: string, or?: string };
        /**
         * <-dxFilterBuilder.Options.groupOperations->
         */
        groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
        /**
         * <-dxFilterBuilder.Options.maxGroupLevel->
         */
        maxGroupLevel?: number;
        /**
         * <-dxFilterBuilder.Options.onEditorPrepared->
         */
        onEditorPrepared?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, editorElement?: DevExpress.core.dxElement, editorName?: string, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /**
         * <-dxFilterBuilder.Options.onEditorPreparing->
         */
        onEditorPreparing?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, cancel?: boolean, editorElement?: DevExpress.core.dxElement, editorName?: string, editorOptions?: any, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /**
         * <-dxFilterBuilder.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any }) => any);
        /**
         * <-dxFilterBuilder.Options.value->
         */
        value?: string | Array<any> | Function;
    }
    /**
     * <-dxFilterBuilder->
     */
    export class dxFilterBuilder extends Widget {
        constructor(element: Element, options?: dxFilterBuilderOptions)
        constructor(element: JQuery, options?: dxFilterBuilderOptions)
        /**
         * <-dxFilterBuilder.getFilterExpression()->
         */
        getFilterExpression(): string | Array<any> | Function;
    }
    /**
     * <-dxFilterBuilderCustomOperation->
     */
    export interface dxFilterBuilderCustomOperation {
        /**
         * <-dxFilterBuilderCustomOperation.calculateFilterExpression->
         */
        calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
        /**
         * <-dxFilterBuilderCustomOperation.caption->
         */
        caption?: string;
        /**
         * <-dxFilterBuilderCustomOperation.customizeText->
         */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string, field?: dxFilterBuilderField }) => string);
        /**
         * <-dxFilterBuilderCustomOperation.dataTypes->
         */
        dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
        /**
         * <-dxFilterBuilderCustomOperation.editorTemplate->
         */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxFilterBuilderCustomOperation.hasValue->
         */
        hasValue?: boolean;
        /**
         * <-dxFilterBuilderCustomOperation.icon->
         */
        icon?: string;
        /**
         * <-dxFilterBuilderCustomOperation.name->
         */
        name?: string;
    }
    /**
     * <-dxFilterBuilderField->
     */
    export interface dxFilterBuilderField {
        /**
         * <-dxFilterBuilderField.calculateFilterExpression->
         */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
        /**
         * <-dxFilterBuilderField.caption->
         */
        caption?: string;
        /**
         * <-dxFilterBuilderField.customizeText->
         */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string }) => string);
        /**
         * <-dxFilterBuilderField.dataField->
         */
        dataField?: string;
        /**
         * <-dxFilterBuilderField.dataType->
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * <-dxFilterBuilderField.editorOptions->
         */
        editorOptions?: any;
        /**
         * <-dxFilterBuilderField.editorTemplate->
         */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxFilterBuilderField.falseText->
         */
        falseText?: string;
        /**
         * <-dxFilterBuilderField.filterOperations->
         */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
        /**
         * <-dxFilterBuilderField.format->
         */
        format?: format;
        /**
         * <-dxFilterBuilderField.lookup->
         */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store, displayExpr?: string | ((data: any) => string), valueExpr?: string | ((data: any) => string | number | boolean) };
        /**
         * <-dxFilterBuilderField.name->
         */
        name?: string;
        /**
         * <-dxFilterBuilderField.trueText->
         */
        trueText?: string;
    }
    /**
     * <-dxForm.Options->
     */
    export interface dxFormOptions extends WidgetOptions<dxForm> {
        /**
         * <-dxForm.Options.alignItemLabels->
         */
        alignItemLabels?: boolean;
        /**
         * <-dxForm.Options.alignItemLabelsInAllGroups->
         */
        alignItemLabelsInAllGroups?: boolean;
        /**
         * <-dxForm.Options.colCount->
         */
        colCount?: number | 'auto';
        /**
         * <-dxForm.Options.colCountByScreen->
         */
        colCountByScreen?: any;
        /**
         * <-dxForm.Options.customizeItem->
         */
        customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
        /**
         * <-dxForm.Options.formData->
         */
        formData?: any;
        /**
         * <-dxForm.Options.items->
         */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /**
         * <-dxForm.Options.labelLocation->
         */
        labelLocation?: 'left' | 'right' | 'top';
        /**
         * <-dxForm.Options.minColWidth->
         */
        minColWidth?: number;
        /**
         * <-dxForm.Options.onEditorEnterKey->
         */
        onEditorEnterKey?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string }) => any);
        /**
         * <-dxForm.Options.onFieldDataChanged->
         */
        onFieldDataChanged?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string, value?: any }) => any);
        /**
         * <-dxForm.Options.optionalMark->
         */
        optionalMark?: string;
        /**
         * <-dxForm.Options.readOnly->
         */
        readOnly?: boolean;
        /**
         * <-dxForm.Options.requiredMark->
         */
        requiredMark?: string;
        /**
         * <-dxForm.Options.requiredMessage->
         */
        requiredMessage?: string;
        /**
         * <-dxForm.Options.screenByWidth->
         */
        screenByWidth?: Function;
        /**
         * <-dxForm.Options.scrollingEnabled->
         */
        scrollingEnabled?: boolean;
        /**
         * <-dxForm.Options.showColonAfterLabel->
         */
        showColonAfterLabel?: boolean;
        /**
         * <-dxForm.Options.showOptionalMark->
         */
        showOptionalMark?: boolean;
        /**
         * <-dxForm.Options.showRequiredMark->
         */
        showRequiredMark?: boolean;
        /**
         * <-dxForm.Options.showValidationSummary->
         */
        showValidationSummary?: boolean;
        /**
         * <-dxForm.Options.validationGroup->
         */
        validationGroup?: string;
    }
    /**
     * <-dxForm->
     */
    export class dxForm extends Widget {
        constructor(element: Element, options?: dxFormOptions)
        constructor(element: JQuery, options?: dxFormOptions)
        /**
         * <-dxForm.getButton(name)->
         */
        getButton(name: string): dxButton | undefined;
        /**
         * <-dxForm.getEditor(dataField)->
         */
        getEditor(dataField: string): Editor | undefined;
        /**
         * <-dxForm.itemOption(id)->
         */
        itemOption(id: string): any;
        /**
         * <-dxForm.itemOption(id, option, value)->
         */
        itemOption(id: string, option: string, value: any): void;
        /**
         * <-dxForm.itemOption(id, options)->
         */
        itemOption(id: string, options: any): void;
        /**
         * <-dxForm.resetValues()->
         */
        resetValues(): void;
        /**
         * <-dxForm.updateData(data)->
         */
        updateData(data: any): void;
        /**
         * <-dxForm.updateData(dataField, value)->
         */
        updateData(dataField: string, value: any): void;
        /**
         * <-dxForm.updateDimensions()->
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxForm.validate()->
         */
        validate(): dxValidationGroupResult;
    }
    /**
     * <-dxFormButtonItem->
     */
    export interface dxFormButtonItem {
        /**
         * <-dxFormButtonItem.buttonOptions->
         */
        buttonOptions?: dxButtonOptions;
        /**
         * <-dxFormButtonItem.colSpan->
         */
        colSpan?: number;
        /**
         * <-dxFormButtonItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFormButtonItem.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxFormButtonItem.itemType->
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * <-dxFormButtonItem.name->
         */
        name?: string;
        /**
         * <-dxFormButtonItem.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
        /**
         * <-dxFormButtonItem.visible->
         */
        visible?: boolean;
        /**
         * <-dxFormButtonItem.visibleIndex->
         */
        visibleIndex?: number;
    }
    /**
     * <-dxFormEmptyItem->
     */
    export interface dxFormEmptyItem {
        /**
         * <-dxFormEmptyItem.colSpan->
         */
        colSpan?: number;
        /**
         * <-dxFormEmptyItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFormEmptyItem.itemType->
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * <-dxFormEmptyItem.name->
         */
        name?: string;
        /**
         * <-dxFormEmptyItem.visible->
         */
        visible?: boolean;
        /**
         * <-dxFormEmptyItem.visibleIndex->
         */
        visibleIndex?: number;
    }
    /**
     * <-dxFormGroupItem->
     */
    export interface dxFormGroupItem {
        /**
         * <-dxFormGroupItem.alignItemLabels->
         */
        alignItemLabels?: boolean;
        /**
         * <-dxFormGroupItem.caption->
         */
        caption?: string;
        /**
         * <-dxFormGroupItem.colCount->
         */
        colCount?: number;
        /**
         * <-dxFormGroupItem.colCountByScreen->
         */
        colCountByScreen?: any;
        /**
         * <-dxFormGroupItem.colSpan->
         */
        colSpan?: number;
        /**
         * <-dxFormGroupItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFormGroupItem.itemType->
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * <-dxFormGroupItem.items->
         */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /**
         * <-dxFormGroupItem.name->
         */
        name?: string;
        /**
         * <-dxFormGroupItem.template->
         */
        template?: DevExpress.core.template | ((data: { component?: dxForm, formData?: any }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxFormGroupItem.visible->
         */
        visible?: boolean;
        /**
         * <-dxFormGroupItem.visibleIndex->
         */
        visibleIndex?: number;
    }
    /**
     * <-dxFormSimpleItem->
     */
    export interface dxFormSimpleItem {
        /**
         * <-dxFormSimpleItem.colSpan->
         */
        colSpan?: number;
        /**
         * <-dxFormSimpleItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFormSimpleItem.dataField->
         */
        dataField?: string;
        /**
         * <-dxFormSimpleItem.editorOptions->
         */
        editorOptions?: any;
        /**
         * <-dxFormSimpleItem.editorType->
         */
        editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
        /**
         * <-dxFormSimpleItem.helpText->
         */
        helpText?: string;
        /**
         * <-dxFormSimpleItem.isRequired->
         */
        isRequired?: boolean;
        /**
         * <-dxFormSimpleItem.itemType->
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * <-dxFormSimpleItem.label->
         */
        label?: { alignment?: 'center' | 'left' | 'right', location?: 'left' | 'right' | 'top', showColon?: boolean, text?: string, visible?: boolean };
        /**
         * <-dxFormSimpleItem.name->
         */
        name?: string;
        /**
         * <-dxFormSimpleItem.template->
         */
        template?: DevExpress.core.template | ((data: { component?: dxForm, dataField?: string, editorOptions?: any, editorType?: string, name?: string }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxFormSimpleItem.validationRules->
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * <-dxFormSimpleItem.visible->
         */
        visible?: boolean;
        /**
         * <-dxFormSimpleItem.visibleIndex->
         */
        visibleIndex?: number;
    }
    /**
     * <-dxFormTabbedItem->
     */
    export interface dxFormTabbedItem {
        /**
         * <-dxFormTabbedItem.colSpan->
         */
        colSpan?: number;
        /**
         * <-dxFormTabbedItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxFormTabbedItem.itemType->
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * <-dxFormTabbedItem.name->
         */
        name?: string;
        /**
         * <-dxFormTabbedItem.tabPanelOptions->
         */
        tabPanelOptions?: dxTabPanelOptions;
        /**
         * <-dxFormTabbedItem.tabs->
         */
        tabs?: Array<{ alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: any, disabled?: boolean, icon?: string, items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>, tabTemplate?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), template?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), title?: string }>;
        /**
         * <-dxFormTabbedItem.visible->
         */
        visible?: boolean;
        /**
         * <-dxFormTabbedItem.visibleIndex->
         */
        visibleIndex?: number;
    }
    /**
     * <-dxGallery.Options->
     */
    export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
        /**
         * <-dxGallery.Options.animationDuration->
         */
        animationDuration?: number;
        /**
         * <-dxGallery.Options.animationEnabled->
         */
        animationEnabled?: boolean;
        /**
         * <-dxGallery.Options.dataSource->
         */
        dataSource?: string | Array<string | dxGalleryItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxGallery.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxGallery.Options.indicatorEnabled->
         */
        indicatorEnabled?: boolean;
        /**
         * <-dxGallery.Options.initialItemWidth->
         */
        initialItemWidth?: number;
        /**
         * <-dxGallery.Options.items->
         */
        items?: Array<string | dxGalleryItem | any>;
        /**
         * <-dxGallery.Options.loop->
         */
        loop?: boolean;
        /**
         * <-dxGallery.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-dxGallery.Options.selectedIndex->
         */
        selectedIndex?: number;
        /**
         * <-dxGallery.Options.showIndicator->
         */
        showIndicator?: boolean;
        /**
         * <-dxGallery.Options.showNavButtons->
         */
        showNavButtons?: boolean;
        /**
         * <-dxGallery.Options.slideshowDelay->
         */
        slideshowDelay?: number;
        /**
         * <-dxGallery.Options.stretchImages->
         */
        stretchImages?: boolean;
        /**
         * <-dxGallery.Options.swipeEnabled->
         */
        swipeEnabled?: boolean;
        /**
         * <-dxGallery.Options.wrapAround->
         */
        wrapAround?: boolean;
    }
    /**
     * <-dxGallery->
     */
    export class dxGallery extends CollectionWidget {
        constructor(element: Element, options?: dxGalleryOptions)
        constructor(element: JQuery, options?: dxGalleryOptions)
        /**
         * <-dxGallery.goToItem(itemIndex, animation)->
         */
        goToItem(itemIndex: number, animation: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxGallery.nextItem(animation)->
         */
        nextItem(animation: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxGallery.prevItem(animation)->
         */
        prevItem(animation: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxGalleryItem->
     */
    export interface dxGalleryItem extends CollectionWidgetItem {
        /**
         * <-dxGalleryItem.imageAlt->
         */
        imageAlt?: string;
        /**
         * <-dxGalleryItem.imageSrc->
         */
        imageSrc?: string;
    }
    /**
     * <-dxGantt.Options->
     */
    export interface dxGanttOptions extends WidgetOptions<dxGantt> {
        /**
         * <-dxGantt.Options.allowSelection->
         */
        allowSelection?: boolean;
        /**
         * <-dxGantt.Options.columns->
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * <-dxGantt.Options.contextMenu->
         */
        contextMenu?: dxGanttContextMenu;
        /**
         * <-dxGantt.Options.dependencies->
         */
        dependencies?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, predecessorIdExpr?: string | Function, successorIdExpr?: string | Function, typeExpr?: string | Function };
        /**
         * <-dxGantt.Options.editing->
         */
        editing?: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskUpdating?: boolean, enabled?: boolean };
        /**
         * <-dxGantt.Options.firstDayOfWeek->
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * <-dxGantt.Options.onCustomCommand->
         */
        onCustomCommand?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, name?: string }) => any);
        /**
         * <-dxGantt.Options.onDependencyDeleting->
         */
        onDependencyDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.onDependencyInserting->
         */
        onDependencyInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * <-dxGantt.Options.onResourceAssigning->
         */
        onResourceAssigning?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * <-dxGantt.Options.onResourceDeleting->
         */
        onResourceDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.onResourceInserting->
         */
        onResourceInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * <-dxGantt.Options.onResourceUnassigning->
         */
        onResourceUnassigning?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, selectedRowKey?: any }) => any);
        /**
         * <-dxGantt.Options.onTaskDeleting->
         */
        onTaskDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.onTaskEditDialogShowing->
         */
        onTaskEditDialogShowing?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any, readOnlyFields?: Array<string>, hiddenFields?: Array<string> }) => any);
        /**
         * <-dxGantt.Options.onTaskInserting->
         */
        onTaskInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * <-dxGantt.Options.onTaskMoving->
         */
        onTaskMoving?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.onTaskUpdating->
         */
        onTaskUpdating?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
        /**
         * <-dxGantt.Options.resourceAssignments->
         */
        resourceAssignments?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, resourceIdExpr?: string | Function, taskIdExpr?: string | Function };
        /**
         * <-dxGantt.Options.resources->
         */
        resources?: { colorExpr?: string | Function, dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, textExpr?: string | Function };
        /**
         * <-dxGantt.Options.scaleType->
         */
        scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        /**
         * <-dxGantt.Options.selectedRowKey->
         */
        selectedRowKey?: any;
        /**
         * <-dxGantt.Options.showResources->
         */
        showResources?: boolean;
        /**
         * <-dxGantt.Options.showRowLines->
         */
        showRowLines?: boolean;
        /**
         * <-dxGantt.Options.stripLines->
         */
        stripLines?: Array<dxGanttStripLine>;
        /**
         * <-dxGantt.Options.taskListWidth->
         */
        taskListWidth?: number;
        /**
         * <-dxGantt.Options.taskTitlePosition->
         */
        taskTitlePosition?: 'inside' | 'outside' | 'none';
        /**
         * <-dxGantt.Options.taskTooltipContentTemplate->
         */
        taskTooltipContentTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxElement, task: any) => any);
        /**
         * <-dxGantt.Options.tasks->
         */
        tasks?: { colorExpr?: string | Function, dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, endExpr?: string | Function, keyExpr?: string | Function, parentIdExpr?: string | Function, progressExpr?: string | Function, startExpr?: string | Function, titleExpr?: string | Function };
        /**
         * <-dxGantt.Options.toolbar->
         */
        toolbar?: dxGanttToolbar;
        /**
         * <-dxGantt.Options.validation->
         */
        validation?: { autoUpdateParentTasks?: boolean, validateDependencies?: boolean };
    }
    /**
     * <-dxGantt->
     */
    export class dxGantt extends Widget {
        constructor(element: Element, options?: dxGanttOptions)
        constructor(element: JQuery, options?: dxGanttOptions)
        /**
         * <-dxGantt.assignResourceToTask(resourceKey, taskKey)->
         */
        assignResourceToTask(resourceKey: any, taskKey: any): void;
        /**
         * <-dxGantt.deleteDependency(key)->
         */
        deleteDependency(key: any): void;
        /**
         * <-dxGantt.deleteResource(key)->
         */
        deleteResource(key: any): void;
        /**
         * <-dxGantt.deleteTask(key)->
         */
        deleteTask(key: any): void;
        /**
         * <-dxGantt.getDependencyData(key)->
         */
        getDependencyData(key: any): any;
        /**
         * <-dxGantt.getResourceAssignmentData(key)->
         */
        getResourceAssignmentData(key: any): any;
        /**
         * <-dxGantt.getResourceData(key)->
         */
        getResourceData(key: any): any;
        /**
         * <-dxGantt.getTaskData(key)->
         */
        getTaskData(key: any): any;
        /**
         * <-dxGantt.insertDependency(data)->
         */
        insertDependency(data: any): void;
        /**
         * <-dxGantt.insertResource(data, taskKeys)->
         */
        insertResource(data: any, taskKeys?: Array<any>): void;
        /**
         * <-dxGantt.insertTask(data)->
         */
        insertTask(data: any): void;
        /**
         * <-dxGantt.unassignResourceFromTask(resourceKey, taskKey)->
         */
        unassignResourceFromTask(resourceKey: any, taskKey: any): void;
        /**
         * <-dxGantt.updateTask(key, data)->
         */
        updateTask(key: any, data: any): void;
    }
    /**
     * <-dxGanttContextMenu->
     */
    export interface dxGanttContextMenu {
        /**
         * <-dxGanttContextMenu.enabled->
         */
        enabled?: boolean;
        /**
         * <-dxGanttContextMenu.items->
         */
        items?: Array<dxGanttContextMenuItem | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails'>;
    }
    /**
     * <-dxGanttContextMenuItem->
     */
    export interface dxGanttContextMenuItem extends dxContextMenuItem {
        /**
         * <-dxGanttContextMenuItem.name->
         */
        name?: 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | string;
    }
    /**
     * <-dxGanttStripLine->
     */
    export interface dxGanttStripLine {
        /**
         * <-dxGanttStripLine.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxGanttStripLine.end->
         */
        end?: Date | number | string | (() => Date | number | string);
        /**
         * <-dxGanttStripLine.start->
         */
        start?: Date | number | string | (() => Date | number | string);
        /**
         * <-dxGanttStripLine.title->
         */
        title?: string;
    }
    /**
     * <-dxGanttToolbar->
     */
    export interface dxGanttToolbar {
        /**
         * <-dxGanttToolbar.items->
         */
        items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut'>;
    }
    /**
     * <-dxGanttToolbarItem->
     */
    export interface dxGanttToolbarItem extends dxToolbarItem {
        /**
         * <-dxGanttToolbarItem.location->
         */
        location?: 'after' | 'before' | 'center';
        /**
         * <-dxGanttToolbarItem.name->
         */
        name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | string;
    }
    /**
     * <-dxHtmlEditor.Options->
     */
    export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
        /**
         * <-dxHtmlEditor.Options.customizeModules->
         */
        customizeModules?: ((config: any) => any);
        /**
         * <-dxHtmlEditor.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxHtmlEditor.Options.mediaResizing->
         */
        mediaResizing?: dxHtmlEditorMediaResizing;
        /**
         * <-dxHtmlEditor.Options.mentions->
         */
        mentions?: Array<dxHtmlEditorMention>;
        /**
         * <-dxHtmlEditor.Options.name->
         */
        name?: string;
        /**
         * <-dxHtmlEditor.Options.onFocusIn->
         */
        onFocusIn?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxHtmlEditor.Options.onFocusOut->
         */
        onFocusOut?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxHtmlEditor.Options.placeholder->
         */
        placeholder?: string;
        /**
         * <-dxHtmlEditor.Options.toolbar->
         */
        toolbar?: dxHtmlEditorToolbar;
        /**
         * <-dxHtmlEditor.Options.valueType->
         */
        valueType?: 'html' | 'markdown';
        /**
         * <-dxHtmlEditor.Options.variables->
         */
        variables?: dxHtmlEditorVariables;
    }
    /**
     * <-dxHtmlEditor->
     */
    export class dxHtmlEditor extends Editor {
        constructor(element: Element, options?: dxHtmlEditorOptions)
        constructor(element: JQuery, options?: dxHtmlEditorOptions)
        /**
         * <-dxHtmlEditor.clearHistory()->
         */
        clearHistory(): void;
        /**
         * <-dxHtmlEditor.delete(index, length)->
         */
        delete(index: number, length: number): void;
        /**
         * <-dxHtmlEditor.format(formatName, formatValue)->
         */
        format(formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * <-dxHtmlEditor.formatLine(index, length, formatName, formatValue)->
         */
        formatLine(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * <-dxHtmlEditor.formatLine(index, length, formats)->
         */
        formatLine(index: number, length: number, formats: any): void;
        /**
         * <-dxHtmlEditor.formatText(index, length, formatName, formatValue)->
         */
        formatText(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * <-dxHtmlEditor.formatText(index, length, formats)->
         */
        formatText(index: number, length: number, formats: any): void;
        /**
         * <-dxHtmlEditor.get(componentPath)->
         */
        get(componentPath: string): any;
        /**
         * <-dxHtmlEditor.getFormat(index, length)->
         */
        getFormat(index: number, length: number): any;
        /**
         * <-dxHtmlEditor.getLength()->
         */
        getLength(): number;
        /**
         * <-dxHtmlEditor.getModule(moduleName)->
         */
        getModule(moduleName: string): any;
        /**
         * <-dxHtmlEditor.getQuillInstance()->
         */
        getQuillInstance(): any;
        /**
         * <-dxHtmlEditor.getSelection()->
         */
        getSelection(): any;
        /**
         * <-dxHtmlEditor.insertEmbed(index, type, config)->
         */
        insertEmbed(index: number, type: string, config: any): void;
        /**
         * <-dxHtmlEditor.insertText(index, text, formats)->
         */
        insertText(index: number, text: string, formats: any): void;
        /**
         * <-dxHtmlEditor.redo()->
         */
        redo(): void;
        /**
         * <-dxHtmlEditor.register(components)->
         */
        register(modules: any): void;
        /**
         * <-dxHtmlEditor.removeFormat(index, length)->
         */
        removeFormat(index: number, length: number): void;
        /**
         * <-dxHtmlEditor.setSelection(index, length)->
         */
        setSelection(index: number, length: number): void;
        /**
         * <-dxHtmlEditor.undo()->
         */
        undo(): void;
    }
    /**
     * <-dxHtmlEditorMediaResizing->
     */
    export interface dxHtmlEditorMediaResizing {
        /**
         * <-dxHtmlEditorMediaResizing.allowedTargets->
         */
        allowedTargets?: Array<string>;
        /**
         * <-dxHtmlEditorMediaResizing.enabled->
         */
        enabled?: boolean;
    }
    /**
     * <-dxHtmlEditorMention->
     */
    export interface dxHtmlEditorMention {
        /**
         * <-dxHtmlEditorMention.dataSource->
         */
        dataSource?: Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxHtmlEditorMention.displayExpr->
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * <-dxHtmlEditorMention.itemTemplate->
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxHtmlEditorMention.marker->
         */
        marker?: string;
        /**
         * <-dxHtmlEditorMention.minSearchLength->
         */
        minSearchLength?: number;
        /**
         * <-dxHtmlEditorMention.searchExpr->
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * <-dxHtmlEditorMention.searchTimeout->
         */
        searchTimeout?: number;
        /**
         * <-dxHtmlEditorMention.template->
         */
        template?: DevExpress.core.template | ((mentionData: { marker?: string, id?: string | number, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxHtmlEditorMention.valueExpr->
         */
        valueExpr?: string | Function;
    }
    /**
     * <-dxHtmlEditorToolbar->
     */
    export interface dxHtmlEditorToolbar {
        /**
         * <-dxHtmlEditorToolbar.container->
         */
        container?: string | Element | JQuery;
        /**
         * <-dxHtmlEditorToolbar.items->
         */
        items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear'>;
        /**
         * <-dxHtmlEditorToolbar.multiline->
         */
        multiline?: boolean;
    }
    /**
     * <-dxHtmlEditorToolbarItem->
     */
    export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
        /**
         * <-dxHtmlEditorToolbarItem.formatName->
         */
        formatName?: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | string;
        /**
         * <-dxHtmlEditorToolbarItem.formatValues->
         */
        formatValues?: Array<string | number | boolean>;
        /**
         * <-dxHtmlEditorToolbarItem.location->
         */
        location?: 'after' | 'before' | 'center';
    }
    /**
     * <-dxHtmlEditorVariables->
     */
    export interface dxHtmlEditorVariables {
        /**
         * <-dxHtmlEditorVariables.dataSource->
         */
        dataSource?: string | Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxHtmlEditorVariables.escapeChar->
         */
        escapeChar?: string | Array<string>;
    }
    /**
     * <-dxItem->
     */
    export var dxItem: any;
    /**
     * <-dxList.Options->
     */
    export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
        /**
         * <-dxList.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxList.Options.allowItemDeleting->
         */
        allowItemDeleting?: boolean;
        /**
         * <-dxList.Options.bounceEnabled->
         */
        bounceEnabled?: boolean;
        /**
         * <-dxList.Options.collapsibleGroups->
         */
        collapsibleGroups?: boolean;
        /**
         * <-dxList.Options.dataSource->
         */
        dataSource?: string | Array<string | dxListItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxList.Options.displayExpr->
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * <-dxList.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxList.Options.groupTemplate->
         */
        groupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxList.Options.grouped->
         */
        grouped?: boolean;
        /**
         * <-dxList.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxList.Options.indicateLoading->
         */
        indicateLoading?: boolean;
        /**
         * <-dxList.Options.itemDeleteMode->
         */
        itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
        /**
         * <-dxList.Options.itemDragging->
         */
        itemDragging?: dxSortableOptions;
        /**
         * <-dxList.Options.items->
         */
        items?: Array<string | dxListItem | any>;
        /**
         * <-dxList.Options.menuItems->
         */
        menuItems?: Array<{ action?: ((itemElement: DevExpress.core.dxElement, itemData: any) => any), text?: string }>;
        /**
         * <-dxList.Options.menuMode->
         */
        menuMode?: 'context' | 'slide';
        /**
         * <-dxList.Options.nextButtonText->
         */
        nextButtonText?: string;
        /**
         * <-dxList.Options.onGroupRendered->
         */
        onGroupRendered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, groupData?: any, groupElement?: DevExpress.core.dxElement, groupIndex?: number }) => any);
        /**
         * <-dxList.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxList.Options.onItemContextMenu->
         */
        onItemContextMenu?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxList.Options.onItemDeleted->
         */
        onItemDeleted?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any }) => any);
        /**
         * <-dxList.Options.onItemDeleting->
         */
        onItemDeleting?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * <-dxList.Options.onItemHold->
         */
        onItemHold?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxList.Options.onItemReordered->
         */
        onItemReordered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number }) => any);
        /**
         * <-dxList.Options.onItemSwipe->
         */
        onItemSwipe?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, direction?: string }) => any);
        /**
         * <-dxList.Options.onPageLoading->
         */
        onPageLoading?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxList.Options.onPullRefresh->
         */
        onPullRefresh?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxList.Options.onScroll->
         */
        onScroll?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * <-dxList.Options.onSelectAllValueChanged->
         */
        onSelectAllValueChanged?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * <-dxList.Options.pageLoadMode->
         */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /**
         * <-dxList.Options.pageLoadingText->
         */
        pageLoadingText?: string;
        /**
         * <-dxList.Options.pullRefreshEnabled->
         */
        pullRefreshEnabled?: boolean;
        /**
         * <-dxList.Options.pulledDownText->
         */
        pulledDownText?: string;
        /**
         * <-dxList.Options.pullingDownText->
         */
        pullingDownText?: string;
        /**
         * <-dxList.Options.refreshingText->
         */
        refreshingText?: string;
        /**
         * <-dxList.Options.repaintChangesOnly->
         */
        repaintChangesOnly?: boolean;
        /**
         * <-dxList.Options.scrollByContent->
         */
        scrollByContent?: boolean;
        /**
         * <-dxList.Options.scrollByThumb->
         */
        scrollByThumb?: boolean;
        /**
         * <-dxList.Options.scrollingEnabled->
         */
        scrollingEnabled?: boolean;
        /**
         * <-dxList.Options.selectAllMode->
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * <-dxList.Options.selectionMode->
         */
        selectionMode?: 'all' | 'multiple' | 'none' | 'single';
        /**
         * <-dxList.Options.showScrollbar->
         */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /**
         * <-dxList.Options.showSelectionControls->
         */
        showSelectionControls?: boolean;
        /**
         * <-dxList.Options.useNativeScrolling->
         */
        useNativeScrolling?: boolean;
    }
    /**
     * <-dxList->
     */
    export class dxList extends CollectionWidget {
        constructor(element: Element, options?: dxListOptions)
        constructor(element: JQuery, options?: dxListOptions)
        /**
         * <-dxList.clientHeight()->
         */
        clientHeight(): number;
        /**
         * <-dxList.collapseGroup(groupIndex)->
         */
        collapseGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.deleteItem(itemElement)->
         */
        deleteItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.deleteItem(itemIndex)->
         */
        deleteItem(itemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.expandGroup(groupIndex)->
         */
        expandGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.isItemSelected(itemElement)->
         */
        isItemSelected(itemElement: Element): boolean;
        /**
         * <-dxList.isItemSelected(itemIndex)->
         */
        isItemSelected(itemIndex: number | any): boolean;
        /**
         * <-dxList.reload()->
         */
        reload(): void;
        /**
         * <-dxList.reorderItem(itemElement, toItemElement)->
         */
        reorderItem(itemElement: Element, toItemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.reorderItem(itemIndex, toItemIndex)->
         */
        reorderItem(itemIndex: number | any, toItemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxList.scrollBy(distance)->
         */
        scrollBy(distance: number): void;
        /**
         * <-dxList.scrollHeight()->
         */
        scrollHeight(): number;
        /**
         * <-dxList.scrollTo(location)->
         */
        scrollTo(location: number): void;
        /**
         * <-dxList.scrollToItem(itemElement)->
         */
        scrollToItem(itemElement: Element): void;
        /**
         * <-dxList.scrollToItem(itemIndex)->
         */
        scrollToItem(itemIndex: number | any): void;
        /**
         * <-dxList.scrollTop()->
         */
        scrollTop(): number;
        /**
         * <-dxList.selectAll()->
         */
        selectAll(): void;
        /**
         * <-dxList.selectItem(itemElement)->
         */
        selectItem(itemElement: Element): void;
        /**
         * <-dxList.selectItem(itemIndex)->
         */
        selectItem(itemIndex: number | any): void;
        /**
         * <-dxList.unselectAll()->
         */
        unselectAll(): void;
        /**
         * <-dxList.unselectItem(itemElement)->
         */
        unselectItem(itemElement: Element): void;
        /**
         * <-dxList.unselectItem(itemIndex)->
         */
        unselectItem(itemIndex: number | any): void;
        /**
         * <-dxList.updateDimensions()->
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxListItem->
     */
    export interface dxListItem extends CollectionWidgetItem {
        /**
         * <-dxListItem.badge->
         */
        badge?: string;
        /**
         * <-dxListItem.icon->
         */
        icon?: string;
        /**
         * <-dxListItem.key->
         */
        key?: string;
        /**
         * <-dxListItem.showChevron->
         */
        showChevron?: boolean;
    }
    /**
     * <-dxLoadIndicator.Options->
     */
    export interface dxLoadIndicatorOptions extends WidgetOptions<dxLoadIndicator> {
        /**
         * <-dxLoadIndicator.Options.indicatorSrc->
         */
        indicatorSrc?: string;
    }
    /**
     * <-dxLoadIndicator->
     */
    export class dxLoadIndicator extends Widget {
        constructor(element: Element, options?: dxLoadIndicatorOptions)
        constructor(element: JQuery, options?: dxLoadIndicatorOptions)
    }
    /**
     * <-dxLoadPanel.Options->
     */
    export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
        /**
         * <-dxLoadPanel.Options.animation->
         */
        animation?: dxLoadPanelAnimation;
        /**
         * <-dxLoadPanel.Options.container->
         */
        container?: string | Element | JQuery;
        /**
         * <-dxLoadPanel.Options.delay->
         */
        delay?: number;
        /**
         * <-dxLoadPanel.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxLoadPanel.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxLoadPanel.Options.indicatorSrc->
         */
        indicatorSrc?: string;
        /**
         * <-dxLoadPanel.Options.maxHeight->
         */
        maxHeight?: number | string | (() => number | string);
        /**
         * <-dxLoadPanel.Options.maxWidth->
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * <-dxLoadPanel.Options.message->
         */
        message?: string;
        /**
         * <-dxLoadPanel.Options.position->
         */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /**
         * <-dxLoadPanel.Options.shadingColor->
         */
        shadingColor?: string;
        /**
         * <-dxLoadPanel.Options.showIndicator->
         */
        showIndicator?: boolean;
        /**
         * <-dxLoadPanel.Options.showPane->
         */
        showPane?: boolean;
        /**
         * <-dxLoadPanel.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxLoadPanel.Options.animation->
     */
    export interface dxLoadPanelAnimation extends dxOverlayAnimation {
        /**
         * <-dxLoadPanel.Options.animation.hide->
         */
        hide?: animationConfig;
        /**
         * <-dxLoadPanel.Options.animation.show->
         */
        show?: animationConfig;
    }
    /**
     * <-dxLoadPanel->
     */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: Element, options?: dxLoadPanelOptions)
        constructor(element: JQuery, options?: dxLoadPanelOptions)
    }
    /**
     * <-dxLookup.Options->
     */
    export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
        /**
         * <-dxLookup.Options.animation->
         * @deprecated <-dxLookup.Options.animation:depNote->
         */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /**
         * <-dxLookup.Options.applyButtonText->
         */
        applyButtonText?: string;
        /**
         * <-dxLookup.Options.applyValueMode->
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * <-dxLookup.Options.cancelButtonText->
         */
        cancelButtonText?: string;
        /**
         * <-dxLookup.Options.cleanSearchOnOpening->
         */
        cleanSearchOnOpening?: boolean;
        /**
         * <-dxLookup.Options.clearButtonText->
         */
        clearButtonText?: string;
        /**
         * <-dxLookup.Options.closeOnOutsideClick->
         * @deprecated <-dxLookup.Options.closeOnOutsideClick:depNote->
         */
        closeOnOutsideClick?: boolean | (() => boolean);
        /**
         * <-dxLookup.Options.dropDownCentered->
         */
        dropDownCentered?: boolean;
        /**
         * <-dxLookup.Options.dropDownOptions->
         */
        dropDownOptions?: dxPopoverOptions;
        /**
         * <-dxLookup.Options.fieldTemplate->
         */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxLookup.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxLookup.Options.fullScreen->
         * @deprecated <-dxLookup.Options.fullScreen:depNote->
         */
        fullScreen?: boolean;
        /**
         * <-dxLookup.Options.groupTemplate->
         */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxLookup.Options.grouped->
         */
        grouped?: boolean;
        /**
         * <-dxLookup.Options.nextButtonText->
         */
        nextButtonText?: string;
        /**
         * <-dxLookup.Options.onPageLoading->
         */
        onPageLoading?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxLookup.Options.onPullRefresh->
         */
        onPullRefresh?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxLookup.Options.onScroll->
         */
        onScroll?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * <-dxLookup.Options.onTitleRendered->
         * @deprecated <-dxLookup.Options.onTitleRendered:depNote->
         */
        onTitleRendered?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxLookup.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxLookup.Options.pageLoadMode->
         */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /**
         * <-dxLookup.Options.pageLoadingText->
         */
        pageLoadingText?: string;
        /**
         * <-dxLookup.Options.placeholder->
         */
        placeholder?: string;
        /**
         * <-dxLookup.Options.popupHeight->
         * @deprecated <-dxLookup.Options.popupHeight:depNote->
         */
        popupHeight?: number | string | (() => number | string);
        /**
         * <-dxLookup.Options.popupWidth->
         * @deprecated <-dxLookup.Options.popupWidth:depNote->
         */
        popupWidth?: number | string | (() => number | string);
        /**
         * <-dxLookup.Options.position->
         * @deprecated <-dxLookup.Options.position:depNote->
         */
        position?: positionConfig;
        /**
         * <-dxLookup.Options.pullRefreshEnabled->
         */
        pullRefreshEnabled?: boolean;
        /**
         * <-dxLookup.Options.pulledDownText->
         */
        pulledDownText?: string;
        /**
         * <-dxLookup.Options.pullingDownText->
         */
        pullingDownText?: string;
        /**
         * <-dxLookup.Options.refreshingText->
         */
        refreshingText?: string;
        /**
         * <-dxLookup.Options.searchEnabled->
         */
        searchEnabled?: boolean;
        /**
         * <-dxLookup.Options.searchPlaceholder->
         */
        searchPlaceholder?: string;
        /**
         * <-dxLookup.Options.shading->
         * @deprecated <-dxLookup.Options.shading:depNote->
         */
        shading?: boolean;
        /**
         * <-dxLookup.Options.showCancelButton->
         */
        showCancelButton?: boolean;
        /**
         * <-dxLookup.Options.showClearButton->
         */
        showClearButton?: boolean;
        /**
         * <-dxLookup.Options.showPopupTitle->
         * @deprecated <-dxLookup.Options.showPopupTitle:depNote->
         */
        showPopupTitle?: boolean;
        /**
         * <-dxLookup.Options.title->
         * @deprecated <-dxLookup.Options.title:depNote->
         */
        title?: string;
        /**
         * <-dxLookup.Options.titleTemplate->
         * @deprecated <-dxLookup.Options.titleTemplate:depNote->
         */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxLookup.Options.useNativeScrolling->
         */
        useNativeScrolling?: boolean;
        /**
         * <-dxLookup.Options.usePopover->
         */
        usePopover?: boolean;
    }
    /**
     * <-dxLookup->
     */
    export class dxLookup extends dxDropDownList {
        constructor(element: Element, options?: dxLookupOptions)
        constructor(element: JQuery, options?: dxLookupOptions)
    }
    /**
     * <-dxMap.Options->
     */
    export interface dxMapOptions extends WidgetOptions<dxMap> {
        /**
         * <-dxMap.Options.autoAdjust->
         */
        autoAdjust?: boolean;
        /**
         * <-dxMap.Options.center->
         */
        center?: any | string | Array<number>;
        /**
         * <-dxMap.Options.controls->
         */
        controls?: boolean;
        /**
         * <-dxMap.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxMap.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxMap.Options.key->
         */
        key?: string | { bing?: string, google?: string, googleStatic?: string };
        /**
         * <-dxMap.Options.markerIconSrc->
         */
        markerIconSrc?: string;
        /**
         * <-dxMap.Options.markers->
         */
        markers?: Array<{ iconSrc?: string, location?: any | string | Array<number>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }>;
        /**
         * <-dxMap.Options.onClick->
         */
        onClick?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, location?: any, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxMap.Options.onMarkerAdded->
         */
        onMarkerAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalMarker?: any }) => any);
        /**
         * <-dxMap.Options.onMarkerRemoved->
         */
        onMarkerRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /**
         * <-dxMap.Options.onReady->
         */
        onReady?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, originalMap?: any }) => any);
        /**
         * <-dxMap.Options.onRouteAdded->
         */
        onRouteAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalRoute?: any }) => any);
        /**
         * <-dxMap.Options.onRouteRemoved->
         */
        onRouteRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /**
         * <-dxMap.Options.provider->
         */
        provider?: 'bing' | 'google' | 'googleStatic';
        /**
         * <-dxMap.Options.routes->
         */
        routes?: Array<{ color?: string, locations?: Array<any>, mode?: 'driving' | 'walking', opacity?: number, weight?: number }>;
        /**
         * <-dxMap.Options.type->
         */
        type?: 'hybrid' | 'roadmap' | 'satellite';
        /**
         * <-dxMap.Options.width->
         */
        width?: number | string | (() => number | string);
        /**
         * <-dxMap.Options.zoom->
         */
        zoom?: number;
    }
    /**
     * <-dxMap->
     */
    export class dxMap extends Widget {
        constructor(element: Element, options?: dxMapOptions)
        constructor(element: JQuery, options?: dxMapOptions)
        /**
         * <-dxMap.addMarker(markerOptions)->
         */
        addMarker(markerOptions: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * <-dxMap.addRoute(routeOptions)->
         */
        addRoute(options: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * <-dxMap.removeMarker(marker)->
         */
        removeMarker(marker: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxMap.removeRoute(route)->
         */
        removeRoute(route: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxMenu.Options->
     */
    export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
        /**
         * <-dxMenu.Options.adaptivityEnabled->
         */
        adaptivityEnabled?: boolean;
        /**
         * <-dxMenu.Options.dataSource->
         */
        dataSource?: string | Array<dxMenuItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxMenu.Options.hideSubmenuOnMouseLeave->
         */
        hideSubmenuOnMouseLeave?: boolean;
        /**
         * <-dxMenu.Options.items->
         */
        items?: Array<dxMenuItem>;
        /**
         * <-dxMenu.Options.onSubmenuHidden->
         */
        onSubmenuHidden?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxMenu.Options.onSubmenuHiding->
         */
        onSubmenuHiding?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement, cancel?: boolean }) => any);
        /**
         * <-dxMenu.Options.onSubmenuShowing->
         */
        onSubmenuShowing?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxMenu.Options.onSubmenuShown->
         */
        onSubmenuShown?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxMenu.Options.orientation->
         */
        orientation?: 'horizontal' | 'vertical';
        /**
         * <-dxMenu.Options.showFirstSubmenuMode->
         */
        showFirstSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
        /**
         * <-dxMenu.Options.submenuDirection->
         */
        submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
    }
    /**
     * <-dxMenu->
     */
    export class dxMenu extends dxMenuBase {
        constructor(element: Element, options?: dxMenuOptions)
        constructor(element: JQuery, options?: dxMenuOptions)
    }
    /**
     * <-dxMenuBase.Options->
     */
    export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
        /**
         * <-dxMenuBase.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxMenuBase.Options.animation->
         */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /**
         * <-dxMenuBase.Options.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxMenuBase.Options.dataSource->
         */
        dataSource?: string | Array<dxMenuBaseItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxMenuBase.Options.items->
         */
        items?: Array<dxMenuBaseItem>;
        /**
         * <-dxMenuBase.Options.selectByClick->
         */
        selectByClick?: boolean;
        /**
         * <-dxMenuBase.Options.selectionMode->
         */
        selectionMode?: 'none' | 'single';
        /**
         * <-dxMenuBase.Options.showSubmenuMode->
         */
        showSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
    }
    /**
     * <-dxMenuBase->
     */
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxMenuBaseOptions)
        constructor(element: JQuery, options?: dxMenuBaseOptions)
        /**
         * <-dxMenuBase.selectItem(itemElement)->
         */
        selectItem(itemElement: Element): void;
        /**
         * <-dxMenuBase.unselectItem(itemElement)->
         */
        unselectItem(itemElement: Element): void;
    }
    /**
     * <-dxMenuBaseItem->
     */
    export interface dxMenuBaseItem extends CollectionWidgetItem {
        /**
         * <-dxMenuBaseItem.beginGroup->
         */
        beginGroup?: boolean;
        /**
         * <-dxMenuBaseItem.closeMenuOnClick->
         */
        closeMenuOnClick?: boolean;
        /**
         * <-dxMenuBaseItem.disabled->
         */
        disabled?: boolean;
        /**
         * <-dxMenuBaseItem.icon->
         */
        icon?: string;
        /**
         * <-dxMenuBaseItem.items->
         */
        items?: Array<dxMenuBaseItem>;
        /**
         * <-dxMenuBaseItem.selectable->
         */
        selectable?: boolean;
        /**
         * <-dxMenuBaseItem.selected->
         */
        selected?: boolean;
        /**
         * <-dxMenuBaseItem.text->
         */
        text?: string;
        /**
         * <-dxMenuBaseItem.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxMenuItem->
     */
    export interface dxMenuItem extends dxMenuBaseItem {
        /**
         * <-dxMenuItem.items->
         */
        items?: Array<dxMenuItem>;
    }
    /**
     * <-dxMultiView.Options->
     */
    export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
        /**
         * <-dxMultiView.Options.animationEnabled->
         */
        animationEnabled?: boolean;
        /**
         * <-dxMultiView.Options.dataSource->
         */
        dataSource?: string | Array<string | dxMultiViewItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxMultiView.Options.deferRendering->
         */
        deferRendering?: boolean;
        /**
         * <-dxMultiView.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxMultiView.Options.items->
         */
        items?: Array<string | dxMultiViewItem | any>;
        /**
         * <-dxMultiView.Options.loop->
         */
        loop?: boolean;
        /**
         * <-dxMultiView.Options.selectedIndex->
         */
        selectedIndex?: number;
        /**
         * <-dxMultiView.Options.swipeEnabled->
         */
        swipeEnabled?: boolean;
    }
    /**
     * <-dxMultiView->
     */
    export class dxMultiView extends CollectionWidget {
        constructor(element: Element, options?: dxMultiViewOptions)
        constructor(element: JQuery, options?: dxMultiViewOptions)
    }
    /**
     * <-dxMultiViewItem->
     */
    export interface dxMultiViewItem extends CollectionWidgetItem {
    }
    /**
     * <-dxNavBar.Options->
     */
    export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
        /**
         * <-dxNavBar.Options.scrollByContent->
         */
        scrollByContent?: boolean;
    }
    /**
     * <-dxNavBar->
     */
    export class dxNavBar extends dxTabs {
        constructor(element: Element, options?: dxNavBarOptions)
        constructor(element: JQuery, options?: dxNavBarOptions)
    }
    /**
     * <-dxNavBarItem->
     */
    export interface dxNavBarItem extends dxTabsItem {
        /**
         * <-dxNavBarItem.badge->
         */
        badge?: string;
    }
    /**
     * <-dxNumberBox.Options->
     */
    export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
        /**
         * <-dxNumberBox.Options.buttons->
         */
        buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
        /**
         * <-dxNumberBox.Options.format->
         */
        format?: format;
        /**
         * <-dxNumberBox.Options.invalidValueMessage->
         */
        invalidValueMessage?: string;
        /**
         * <-dxNumberBox.Options.max->
         */
        max?: number;
        /**
         * <-dxNumberBox.Options.min->
         */
        min?: number;
        /**
         * <-dxNumberBox.Options.mode->
         */
        mode?: 'number' | 'text' | 'tel';
        /**
         * <-dxNumberBox.Options.showSpinButtons->
         */
        showSpinButtons?: boolean;
        /**
         * <-dxNumberBox.Options.step->
         */
        step?: number;
        /**
         * <-dxNumberBox.Options.useLargeSpinButtons->
         */
        useLargeSpinButtons?: boolean;
        /**
         * <-dxNumberBox.Options.value->
         */
        value?: number;
    }
    /**
     * <-dxNumberBox->
     */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: Element, options?: dxNumberBoxOptions)
        constructor(element: JQuery, options?: dxNumberBoxOptions)
    }
    /**
     * <-dxOverlay.Options->
     */
    export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
        /**
         * <-dxOverlay.Options.animation->
         */
        animation?: dxOverlayAnimation;
        /**
         * <-dxOverlay.Options.closeOnOutsideClick->
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * <-dxOverlay.Options.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxOverlay.Options.deferRendering->
         */
        deferRendering?: boolean;
        /**
         * <-dxOverlay.Options.dragEnabled->
         */
        dragEnabled?: boolean;
        /**
         * <-dxOverlay.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxOverlay.Options.maxHeight->
         */
        maxHeight?: number | string | (() => number | string);
        /**
         * <-dxOverlay.Options.maxWidth->
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * <-dxOverlay.Options.minHeight->
         */
        minHeight?: number | string | (() => number | string);
        /**
         * <-dxOverlay.Options.minWidth->
         */
        minWidth?: number | string | (() => number | string);
        /**
         * <-dxOverlay.Options.onHidden->
         */
        onHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxOverlay.Options.onHiding->
         */
        onHiding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * <-dxOverlay.Options.onShowing->
         */
        onShowing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxOverlay.Options.onShown->
         */
        onShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxOverlay.Options.position->
         */
        position?: any;
        /**
         * <-dxOverlay.Options.shading->
         */
        shading?: boolean;
        /**
         * <-dxOverlay.Options.shadingColor->
         */
        shadingColor?: string;
        /**
         * <-dxOverlay.Options.visible->
         */
        visible?: boolean;
        /**
         * <-dxOverlay.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxOverlay.Options.animation->
     */
    export interface dxOverlayAnimation {
        /**
         * <-dxOverlay.Options.animation.hide->
         */
        hide?: animationConfig;
        /**
         * <-dxOverlay.Options.animation.show->
         */
        show?: animationConfig;
    }
    /**
     * <-dxOverlay->
     */
    export class dxOverlay extends Widget {
        constructor(element: Element, options?: dxOverlayOptions)
        constructor(element: JQuery, options?: dxOverlayOptions)
        /**
         * <-dxOverlay.content()->
         */
        content(): DevExpress.core.dxElement;
        /**
         * <-dxOverlay.hide()->
         */
        hide(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * <-dxOverlay.repaint()->
         */
        repaint(): void;
        /**
         * <-dxOverlay.show()->
         */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * <-dxOverlay.toggle(showing)->
         */
        toggle(showing: boolean): Promise<boolean> & JQueryPromise<boolean>;
    }
    /**
     * <-dxPivotGrid.Options->
     */
    export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
        /**
         * <-dxPivotGrid.Options.allowExpandAll->
         */
        allowExpandAll?: boolean;
        /**
         * <-dxPivotGrid.Options.allowFiltering->
         */
        allowFiltering?: boolean;
        /**
         * <-dxPivotGrid.Options.allowSorting->
         */
        allowSorting?: boolean;
        /**
         * <-dxPivotGrid.Options.allowSortingBySummary->
         */
        allowSortingBySummary?: boolean;
        /**
         * <-dxPivotGrid.Options.dataFieldArea->
         */
        dataFieldArea?: 'column' | 'row';
        /**
         * <-dxPivotGrid.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.PivotGridDataSource | DevExpress.data.PivotGridDataSourceOptions;
        /**
         * <-dxPivotGrid.Options.export->
         */
        export?: { enabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string };
        /**
         * <-dxPivotGrid.Options.fieldChooser->
         */
        fieldChooser?: { allowSearch?: boolean, applyChangesMode?: 'instantly' | 'onDemand', enabled?: boolean, height?: number, layout?: 0 | 1 | 2, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number };
        /**
         * <-dxPivotGrid.Options.fieldPanel->
         */
        fieldPanel?: { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean };
        /**
         * <-dxPivotGrid.Options.headerFilter->
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /**
         * <-dxPivotGrid.Options.hideEmptySummaryCells->
         */
        hideEmptySummaryCells?: boolean;
        /**
         * <-dxPivotGrid.Options.loadPanel->
         */
        loadPanel?: { enabled?: boolean, height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /**
         * <-dxPivotGrid.Options.onCellClick->
         */
        onCellClick?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, event?: DevExpress.events.event, cancel?: boolean }) => any);
        /**
         * <-dxPivotGrid.Options.onCellPrepared->
         */
        onCellPrepared?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number }) => any);
        /**
         * <-dxPivotGrid.Options.onContextMenuPreparing->
         */
        onContextMenuPreparing?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, cell?: dxPivotGridPivotGridCell, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, field?: DevExpress.data.PivotGridDataSourceField }) => any);
        /**
         * <-dxPivotGrid.Options.onExported->
         * @deprecated <-dxPivotGrid.Options.onExported:depNote->
         */
        onExported?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxPivotGrid.Options.onExporting->
         */
        onExporting?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /**
         * <-dxPivotGrid.Options.onFileSaving->
         * @deprecated <-dxPivotGrid.Options.onFileSaving:depNote->
         */
        onFileSaving?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * <-dxPivotGrid.Options.rowHeaderLayout->
         */
        rowHeaderLayout?: 'standard' | 'tree';
        /**
         * <-dxPivotGrid.Options.scrolling->
         */
        scrolling?: { mode?: 'standard' | 'virtual', useNative?: boolean | 'auto' };
        /**
         * <-dxPivotGrid.Options.showBorders->
         */
        showBorders?: boolean;
        /**
         * <-dxPivotGrid.Options.showColumnGrandTotals->
         */
        showColumnGrandTotals?: boolean;
        /**
         * <-dxPivotGrid.Options.showColumnTotals->
         */
        showColumnTotals?: boolean;
        /**
         * <-dxPivotGrid.Options.showRowGrandTotals->
         */
        showRowGrandTotals?: boolean;
        /**
         * <-dxPivotGrid.Options.showRowTotals->
         */
        showRowTotals?: boolean;
        /**
         * <-dxPivotGrid.Options.showTotalsPrior->
         */
        showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
        /**
         * <-dxPivotGrid.Options.stateStoring->
         */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((state: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /**
         * <-dxPivotGrid.Options.texts->
         */
        texts?: { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string };
        /**
         * <-dxPivotGrid.Options.wordWrapEnabled->
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * <-dxPivotGrid->
     */
    export class dxPivotGrid extends Widget {
        constructor(element: Element, options?: dxPivotGridOptions)
        constructor(element: JQuery, options?: dxPivotGridOptions)
        /**
         * <-dxPivotGrid.bindChart(chart, integrationOptions)->
         */
        bindChart(chart: string | JQuery | any, integrationOptions: { inverted?: boolean, dataFieldsDisplayMode?: string, putDataFieldsInto?: string, alternateDataFields?: boolean, processCell?: Function, customizeChart?: Function, customizeSeries?: Function }): Function & null;
        /**
         * <-dxPivotGrid.exportToExcel()->
         * @deprecated <-dxPivotGrid.exportToExcel():depNote->
         */
        exportToExcel(): void;
        /**
         * <-dxPivotGrid.getDataSource()->
         */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /**
         * <-dxPivotGrid.getFieldChooserPopup()->
         */
        getFieldChooserPopup(): dxPopup;
        /**
         * <-dxPivotGrid.updateDimensions()->
         */
        updateDimensions(): void;
    }
    /**
     * <-dxPivotGridFieldChooser.Options->
     */
    export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
        /**
         * <-dxPivotGridFieldChooser.Options.allowSearch->
         */
        allowSearch?: boolean;
        /**
         * <-dxPivotGridFieldChooser.Options.applyChangesMode->
         */
        applyChangesMode?: 'instantly' | 'onDemand';
        /**
         * <-dxPivotGridFieldChooser.Options.dataSource->
         */
        dataSource?: DevExpress.data.PivotGridDataSource;
        /**
         * <-dxPivotGridFieldChooser.Options.headerFilter->
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /**
         * <-dxPivotGridFieldChooser.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxPivotGridFieldChooser.Options.layout->
         */
        layout?: 0 | 1 | 2;
        /**
         * <-dxPivotGridFieldChooser.Options.onContextMenuPreparing->
         */
        onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, field?: DevExpress.data.PivotGridDataSourceField, event?: DevExpress.events.event }) => any);
        /**
         * <-dxPivotGridFieldChooser.Options.searchTimeout->
         */
        searchTimeout?: number;
        /**
         * <-dxPivotGridFieldChooser.Options.state->
         */
        state?: any;
        /**
         * <-dxPivotGridFieldChooser.Options.texts->
         */
        texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string };
    }
    /**
     * <-dxPivotGridFieldChooser->
     */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions)
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions)
        /**
         * <-dxPivotGridFieldChooser.applyChanges()->
         */
        applyChanges(): void;
        /**
         * <-dxPivotGridFieldChooser.cancelChanges()->
         */
        cancelChanges(): void;
        /**
         * <-dxPivotGridFieldChooser.getDataSource()->
         */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /**
         * <-dxPivotGridFieldChooser.updateDimensions()->
         */
        updateDimensions(): void;
    }
    /**
     * <-dxPivotGridPivotGridCell->
     */
    export interface dxPivotGridPivotGridCell {
        /**
         * <-dxPivotGridPivotGridCell.columnPath->
         */
        columnPath?: Array<string | number | Date>;
        /**
         * <-dxPivotGridPivotGridCell.columnType->
         */
        columnType?: 'D' | 'T' | 'GT';
        /**
         * <-dxPivotGridPivotGridCell.dataIndex->
         */
        dataIndex?: number;
        /**
         * <-dxPivotGridPivotGridCell.expanded->
         */
        expanded?: boolean;
        /**
         * <-dxPivotGridPivotGridCell.path->
         */
        path?: Array<string | number | Date>;
        /**
         * <-dxPivotGridPivotGridCell.rowPath->
         */
        rowPath?: Array<string | number | Date>;
        /**
         * <-dxPivotGridPivotGridCell.rowType->
         */
        rowType?: 'D' | 'T' | 'GT';
        /**
         * <-dxPivotGridPivotGridCell.text->
         */
        text?: string;
        /**
         * <-dxPivotGridPivotGridCell.type->
         */
        type?: 'D' | 'T' | 'GT';
        /**
         * <-dxPivotGridPivotGridCell.value->
         */
        value?: any;
    }
    /**
     * <-dxPivotGridSummaryCell->
     */
    export class dxPivotGridSummaryCell {
        /**
         * <-dxPivotGridSummaryCell.child(direction, fieldValue)->
         */
        child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.children(direction)->
         */
        children(direction: string): Array<dxPivotGridSummaryCell>;
        /**
         * <-dxPivotGridSummaryCell.field(area)->
         */
        field(area: string): DevExpress.data.PivotGridDataSourceField;
        /**
         * <-dxPivotGridSummaryCell.grandTotal()->
         */
        grandTotal(): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.grandTotal(direction)->
         */
        grandTotal(direction: string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.isPostProcessed(field)->
         */
        isPostProcessed(field: DevExpress.data.PivotGridDataSourceField | string): boolean;
        /**
         * <-dxPivotGridSummaryCell.next(direction)->
         */
        next(direction: string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.next(direction, allowCrossGroup)->
         */
        next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.parent(direction)->
         */
        parent(direction: string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.prev(direction)->
         */
        prev(direction: string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.prev(direction, allowCrossGroup)->
         */
        prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.slice(field, value)->
         */
        slice(field: DevExpress.data.PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
        /**
         * <-dxPivotGridSummaryCell.value()->
         */
        value(): any;
        /**
         * <-dxPivotGridSummaryCell.value(field)->
         */
        value(field: DevExpress.data.PivotGridDataSourceField | string): any;
        /**
         * <-dxPivotGridSummaryCell.value(field, postProcessed)->
         */
        value(field: DevExpress.data.PivotGridDataSourceField | string, postProcessed: boolean): any;
        /**
         * <-dxPivotGridSummaryCell.value(postProcessed)->
         */
        value(postProcessed: boolean): any;
    }
    /**
     * <-dxPopover.Options->
     */
    export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
        /**
         * <-dxPopover.Options.animation->
         */
        animation?: dxPopoverAnimation;
        /**
         * <-dxPopover.Options.closeOnOutsideClick->
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * <-dxPopover.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxPopover.Options.hideEvent->
         */
        hideEvent?: { delay?: number, name?: string } | string;
        /**
         * <-dxPopover.Options.position->
         */
        position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
        /**
         * <-dxPopover.Options.shading->
         */
        shading?: boolean;
        /**
         * <-dxPopover.Options.showEvent->
         */
        showEvent?: { delay?: number, name?: string } | string;
        /**
         * <-dxPopover.Options.showTitle->
         */
        showTitle?: boolean;
        /**
         * <-dxPopover.Options.target->
         */
        target?: string | Element | JQuery;
        /**
         * <-dxPopover.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxPopover.Options.animation->
     */
    export interface dxPopoverAnimation extends dxPopupAnimation {
        /**
         * <-dxPopover.Options.animation.hide->
         */
        hide?: animationConfig;
        /**
         * <-dxPopover.Options.animation.show->
         */
        show?: animationConfig;
    }
    /**
     * <-dxPopover->
     */
    export class dxPopover extends dxPopup {
        constructor(element: Element, options?: dxPopoverOptions)
        constructor(element: JQuery, options?: dxPopoverOptions)
        /**
         * <-dxOverlay.show()->
         */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * <-dxPopover.show(target)->
         */
        show(target: string | Element | JQuery): Promise<boolean> & JQueryPromise<boolean>;
    }
    /**
     * <-dxPopup.Options->
     */
    export interface dxPopupOptions<T = dxPopup> extends dxOverlayOptions<T> {
        /**
         * <-dxPopup.Options.animation->
         */
        animation?: dxPopupAnimation;
        /**
         * <-dxPopup.Options.container->
         */
        container?: string | Element | JQuery;
        /**
         * <-dxPopup.Options.dragEnabled->
         */
        dragEnabled?: boolean;
        /**
         * <-dxPopup.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxPopup.Options.fullScreen->
         */
        fullScreen?: boolean;
        /**
         * <-dxPopup.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxPopup.Options.onResize->
         */
        onResize?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxPopup.Options.onResizeEnd->
         */
        onResizeEnd?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxPopup.Options.onResizeStart->
         */
        onResizeStart?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxPopup.Options.onTitleRendered->
         */
        onTitleRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxPopup.Options.position->
         */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /**
         * <-dxPopup.Options.resizeEnabled->
         */
        resizeEnabled?: boolean;
        /**
         * <-dxPopup.Options.showCloseButton->
         */
        showCloseButton?: boolean;
        /**
         * <-dxPopup.Options.showTitle->
         */
        showTitle?: boolean;
        /**
         * <-dxPopup.Options.title->
         */
        title?: string;
        /**
         * <-dxPopup.Options.titleTemplate->
         */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxPopup.Options.toolbarItems->
         */
        toolbarItems?: Array<dxPopupToolbarItem>;
        /**
         * <-dxPopup.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxPopup.Options.animation->
     */
    export interface dxPopupAnimation extends dxOverlayAnimation {
        /**
         * <-dxPopup.Options.animation.hide->
         */
        hide?: animationConfig;
        /**
         * <-dxPopup.Options.animation.show->
         */
        show?: animationConfig;
    }
    /**
     * <-dxPopup.Options.toolbarItems->
     */
    export interface dxPopupToolbarItem {
        /**
         * <-dxPopup.Options.toolbarItems.disabled->
         */
        disabled?: boolean;
        /**
         * <-dxPopup.Options.toolbarItems.html->
         */
        html?: string;
        /**
         * <-dxPopup.Options.toolbarItems.location->
         */
        location?: 'after' | 'before' | 'center';
        /**
         * <-dxPopup.Options.toolbarItems.options->
         */
        options?: any;
        /**
         * <-dxPopup.Options.toolbarItems.template->
         */
        template?: DevExpress.core.template;
        /**
         * <-dxPopup.Options.toolbarItems.text->
         */
        text?: string;
        /**
         * <-dxPopup.Options.toolbarItems.toolbar->
         */
        toolbar?: 'bottom' | 'top';
        /**
         * <-dxPopup.Options.toolbarItems.visible->
         */
        visible?: boolean;
        /**
         * <-dxPopup.Options.toolbarItems.widget->
         */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /**
     * <-dxPopup->
     */
    export class dxPopup extends dxOverlay {
        constructor(element: Element, options?: dxPopupOptions)
        constructor(element: JQuery, options?: dxPopupOptions)
    }
    /**
     * <-dxProgressBar.Options->
     */
    export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
        /**
         * <-dxProgressBar.Options.onComplete->
         */
        onComplete?: ((e: { component?: dxProgressBar, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxProgressBar.Options.showStatus->
         */
        showStatus?: boolean;
        /**
         * <-dxProgressBar.Options.statusFormat->
         */
        statusFormat?: string | ((ratio: number, value: number) => string);
        /**
         * <-dxProgressBar.Options.value->
         */
        value?: number;
    }
    /**
     * <-dxProgressBar->
     */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: Element, options?: dxProgressBarOptions)
        constructor(element: JQuery, options?: dxProgressBarOptions)
    }
    /**
     * <-dxRadioGroup.Options->
     */
    export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
        /**
         * <-dxRadioGroup.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxRadioGroup.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxRadioGroup.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxRadioGroup.Options.layout->
         */
        layout?: 'horizontal' | 'vertical';
        /**
         * <-dxRadioGroup.Options.name->
         */
        name?: string;
        /**
         * <-dxRadioGroup.Options.value->
         */
        value?: any;
    }
    /**
     * <-dxRadioGroup->
     */
    export class dxRadioGroup extends Editor {
        constructor(element: Element, options?: dxRadioGroupOptions)
        constructor(element: JQuery, options?: dxRadioGroupOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-dxRangeSlider.Options->
     */
    export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
        /**
         * <-dxRangeSlider.Options.end->
         */
        end?: number;
        /**
         * <-dxRangeSlider.Options.endName->
         */
        endName?: string;
        /**
         * <-dxRangeSlider.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: dxRangeSlider, element?: DevExpress.core.dxElement, model?: any, start?: number, end?: number, value?: Array<number> }) => any);
        /**
         * <-dxRangeSlider.Options.start->
         */
        start?: number;
        /**
         * <-dxRangeSlider.Options.startName->
         */
        startName?: string;
        /**
         * <-dxRangeSlider.Options.value->
         */
        value?: Array<number>;
    }
    /**
     * <-dxRangeSlider->
     */
    export class dxRangeSlider extends dxSliderBase {
        constructor(element: Element, options?: dxRangeSliderOptions)
        constructor(element: JQuery, options?: dxRangeSliderOptions)
    }
    /**
     * <-dxRecurrenceEditor.Options->
     */
    export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
        /**
         * <-dxRecurrenceEditor.Options.value->
         */
        value?: string;
    }
    /**
     * <-dxRecurrenceEditor->
     */
    export class dxRecurrenceEditor extends Editor {
        constructor(element: Element, options?: dxRecurrenceEditorOptions)
        constructor(element: JQuery, options?: dxRecurrenceEditorOptions)
    }
    /**
     * <-dxResizable.Options->
     */
    export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
        /**
         * <-dxResizable.Options.handles->
         */
        handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
        /**
         * <-dxResizable.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxResizable.Options.maxHeight->
         */
        maxHeight?: number;
        /**
         * <-dxResizable.Options.maxWidth->
         */
        maxWidth?: number;
        /**
         * <-dxResizable.Options.minHeight->
         */
        minHeight?: number;
        /**
         * <-dxResizable.Options.minWidth->
         */
        minWidth?: number;
        /**
         * <-dxResizable.Options.onResize->
         */
        onResize?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * <-dxResizable.Options.onResizeEnd->
         */
        onResizeEnd?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * <-dxResizable.Options.onResizeStart->
         */
        onResizeStart?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * <-dxResizable.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxResizable->
     */
    export class dxResizable extends DOMComponent {
        constructor(element: Element, options?: dxResizableOptions)
        constructor(element: JQuery, options?: dxResizableOptions)
    }
    /**
     * <-dxResponsiveBox.Options->
     */
    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
        /**
         * <-dxResponsiveBox.Options.cols->
         */
        cols?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /**
         * <-dxResponsiveBox.Options.dataSource->
         */
        dataSource?: string | Array<string | dxResponsiveBoxItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxResponsiveBox.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxResponsiveBox.Options.items->
         */
        items?: Array<string | dxResponsiveBoxItem | any>;
        /**
         * <-dxResponsiveBox.Options.rows->
         */
        rows?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /**
         * <-dxResponsiveBox.Options.screenByWidth->
         */
        screenByWidth?: Function;
        /**
         * <-dxResponsiveBox.Options.singleColumnScreen->
         */
        singleColumnScreen?: string;
        /**
         * <-dxResponsiveBox.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxResponsiveBox->
     */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: Element, options?: dxResponsiveBoxOptions)
        constructor(element: JQuery, options?: dxResponsiveBoxOptions)
    }
    /**
     * <-dxResponsiveBoxItem->
     */
    export interface dxResponsiveBoxItem extends CollectionWidgetItem {
        /**
         * <-dxResponsiveBoxItem.location->
         */
        location?: { col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
    }
    /**
     * <-dxScheduler.Options->
     */
    export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
        /**
         * <-dxScheduler.Options.adaptivityEnabled->
         */
        adaptivityEnabled?: boolean;
        /**
         * <-dxScheduler.Options.allDayExpr->
         */
        allDayExpr?: string;
        /**
         * <-dxScheduler.Options.appointmentCollectorTemplate->
         */
        appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.appointmentDragging->
         */
        appointmentDragging?: { autoScroll?: boolean, data?: any, group?: string, onAdd?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragEnd?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragMove?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragStart?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any), onRemove?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any }) => any), scrollSensitivity?: number, scrollSpeed?: number };
        /**
         * <-dxScheduler.Options.appointmentTemplate->
         */
        appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.appointmentTooltipTemplate->
         */
        appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.cellDuration->
         */
        cellDuration?: number;
        /**
         * <-dxScheduler.Options.crossScrollingEnabled->
         */
        crossScrollingEnabled?: boolean;
        /**
         * <-dxScheduler.Options.currentDate->
         */
        currentDate?: Date | number | string;
        /**
         * <-dxScheduler.Options.currentView->
         */
        currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
        /**
         * <-dxScheduler.Options.customizeDateNavigatorText->
         */
        customizeDateNavigatorText?: ((info: { startDate?: Date, endDate?: Date, text?: string }) => string);
        /**
         * <-dxScheduler.Options.dataCellTemplate->
         */
        dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.dataSource->
         */
        dataSource?: string | Array<dxSchedulerAppointment> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxScheduler.Options.dateCellTemplate->
         */
        dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.dateSerializationFormat->
         */
        dateSerializationFormat?: string;
        /**
         * <-dxScheduler.Options.descriptionExpr->
         */
        descriptionExpr?: string;
        /**
         * <-dxScheduler.Options.dropDownAppointmentTemplate->
         * @deprecated <-dxScheduler.Options.dropDownAppointmentTemplate:depNote->
         */
        dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.editing->
         */
        editing?: boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowEditingTimeZones?: boolean, allowResizing?: boolean, allowTimeZoneEditing?: boolean, allowUpdating?: boolean };
        /**
         * <-dxScheduler.Options.endDateExpr->
         */
        endDateExpr?: string;
        /**
         * <-dxScheduler.Options.endDateTimeZoneExpr->
         */
        endDateTimeZoneExpr?: string;
        /**
         * <-dxScheduler.Options.endDayHour->
         */
        endDayHour?: number;
        /**
         * <-dxScheduler.Options.firstDayOfWeek->
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * <-dxScheduler.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxScheduler.Options.groupByDate->
         */
        groupByDate?: boolean;
        /**
         * <-dxScheduler.Options.groups->
         */
        groups?: Array<string>;
        /**
         * <-dxScheduler.Options.indicatorUpdateInterval->
         */
        indicatorUpdateInterval?: number;
        /**
         * <-dxScheduler.Options.max->
         */
        max?: Date | number | string;
        /**
         * <-dxScheduler.Options.maxAppointmentsPerCell->
         */
        maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
        /**
         * <-dxScheduler.Options.min->
         */
        min?: Date | number | string;
        /**
         * <-dxScheduler.Options.noDataText->
         */
        noDataText?: string;
        /**
         * <-dxScheduler.Options.onAppointmentAdded->
         */
        onAppointmentAdded?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentAdding->
         */
        onAppointmentAdding?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentClick->
         */
        onAppointmentClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * <-dxScheduler.Options.onAppointmentContextMenu->
         */
        onAppointmentContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxScheduler.Options.onAppointmentDblClick->
         */
        onAppointmentDblClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * <-dxScheduler.Options.onAppointmentDeleted->
         */
        onAppointmentDeleted?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentDeleting->
         */
        onAppointmentDeleting?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentFormOpening->
         */
        onAppointmentFormOpening?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, form?: dxForm, popup?: dxPopup, cancel?: boolean }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentRendered->
         */
        onAppointmentRendered?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any | undefined, appointmentElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentUpdated->
         */
        onAppointmentUpdated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * <-dxScheduler.Options.onAppointmentUpdating->
         */
        onAppointmentUpdating?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * <-dxScheduler.Options.onCellClick->
         */
        onCellClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * <-dxScheduler.Options.onCellContextMenu->
         */
        onCellContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxScheduler.Options.recurrenceEditMode->
         */
        recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
        /**
         * <-dxScheduler.Options.recurrenceExceptionExpr->
         */
        recurrenceExceptionExpr?: string;
        /**
         * <-dxScheduler.Options.recurrenceRuleExpr->
         */
        recurrenceRuleExpr?: string;
        /**
         * <-dxScheduler.Options.remoteFiltering->
         */
        remoteFiltering?: boolean;
        /**
         * <-dxScheduler.Options.resourceCellTemplate->
         */
        resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.resources->
         */
        resources?: Array<{ allowMultiple?: boolean, colorExpr?: string, dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, displayExpr?: string | ((resource: any) => string), fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: string | Function }>;
        /**
         * <-dxScheduler.Options.scrolling->
         */
        scrolling?: dxSchedulerScrolling;
        /**
         * <-dxScheduler.Options.selectedCellData->
         */
        selectedCellData?: Array<any>;
        /**
         * <-dxScheduler.Options.shadeUntilCurrentTime->
         */
        shadeUntilCurrentTime?: boolean;
        /**
         * <-dxScheduler.Options.showAllDayPanel->
         */
        showAllDayPanel?: boolean;
        /**
         * <-dxScheduler.Options.showCurrentTimeIndicator->
         */
        showCurrentTimeIndicator?: boolean;
        /**
         * <-dxScheduler.Options.startDateExpr->
         */
        startDateExpr?: string;
        /**
         * <-dxScheduler.Options.startDateTimeZoneExpr->
         */
        startDateTimeZoneExpr?: string;
        /**
         * <-dxScheduler.Options.startDayHour->
         */
        startDayHour?: number;
        /**
         * <-dxScheduler.Options.textExpr->
         */
        textExpr?: string;
        /**
         * <-dxScheduler.Options.timeCellTemplate->
         */
        timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxScheduler.Options.timeZone->
         */
        timeZone?: string;
        /**
         * <-dxScheduler.Options.useDropDownViewSwitcher->
         */
        useDropDownViewSwitcher?: boolean;
        /**
         * <-dxScheduler.Options.views->
         */
        views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | { agendaDuration?: number, appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), cellDuration?: number, dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), endDayHour?: number, firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6, groupByDate?: boolean, groupOrientation?: 'horizontal' | 'vertical', groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: number | 'auto' | 'unlimited', name?: string, resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), scrolling?: dxSchedulerScrolling, startDate?: Date | number | string, startDayHour?: number, timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek' }>;
    }
    /**
     * <-dxScheduler->
     */
    export class dxScheduler extends Widget {
        constructor(element: Element, options?: dxSchedulerOptions)
        constructor(element: JQuery, options?: dxSchedulerOptions)
        /**
         * <-dxScheduler.addAppointment(appointment)->
         */
        addAppointment(appointment: any): void;
        /**
         * <-dxScheduler.deleteAppointment(appointment)->
         */
        deleteAppointment(appointment: any): void;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxScheduler.getEndViewDate()->
         */
        getEndViewDate(): Date;
        /**
         * <-dxScheduler.getStartViewDate()->
         */
        getStartViewDate(): Date;
        /**
         * <-dxScheduler.hideAppointmentPopup(saveChanges)->
         */
        hideAppointmentPopup(saveChanges?: boolean): void;
        /**
         * <-dxScheduler.hideAppointmentTooltip()->
         */
        hideAppointmentTooltip(): void;
        /**
         * <-dxScheduler.scrollToTime(hours, minutes, date)->
         */
        scrollToTime(hours: number, minutes: number, date?: Date): void;
        /**
         * <-dxScheduler.showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)->
         */
        showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
        /**
         * <-dxScheduler.showAppointmentTooltip(appointmentData, target, currentAppointmentData)->
         */
        showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
        /**
         * <-dxScheduler.updateAppointment(target, appointment)->
         */
        updateAppointment(target: any, appointment: any): void;
    }
    /**
     * <-dxSchedulerAppointment->
     */
    export interface dxSchedulerAppointment extends CollectionWidgetItem {
        /**
         * <-dxSchedulerAppointment.allDay->
         */
        allDay?: boolean;
        /**
         * <-dxSchedulerAppointment.description->
         */
        description?: string;
        /**
         * <-dxSchedulerAppointment.disabled->
         */
        disabled?: boolean;
        /**
         * <-dxSchedulerAppointment.endDate->
         */
        endDate?: Date;
        /**
         * <-dxSchedulerAppointment.endDateTimeZone->
         */
        endDateTimeZone?: string;
        /**
         * <-dxSchedulerAppointment.html->
         */
        html?: string;
        /**
         * <-dxSchedulerAppointment.recurrenceException->
         */
        recurrenceException?: string;
        /**
         * <-dxSchedulerAppointment.recurrenceRule->
         */
        recurrenceRule?: string;
        /**
         * <-dxSchedulerAppointment.startDate->
         */
        startDate?: Date;
        /**
         * <-dxSchedulerAppointment.startDateTimeZone->
         */
        startDateTimeZone?: string;
        /**
         * <-dxSchedulerAppointment.template->
         */
        template?: DevExpress.core.template;
        /**
         * <-dxSchedulerAppointment.text->
         */
        text?: string;
        /**
         * <-dxSchedulerAppointment.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxSchedulerScrolling->
     */
    export interface dxSchedulerScrolling {
        /**
         * <-dxSchedulerScrolling.mode->
         */
        mode?: 'standard' | 'virtual';
    }
    /**
     * <-dxScrollView.Options->
     */
    export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
        /**
         * <-dxScrollView.Options.onPullDown->
         */
        onPullDown?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxScrollView.Options.onReachBottom->
         */
        onReachBottom?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxScrollView.Options.pulledDownText->
         */
        pulledDownText?: string;
        /**
         * <-dxScrollView.Options.pullingDownText->
         */
        pullingDownText?: string;
        /**
         * <-dxScrollView.Options.reachBottomText->
         */
        reachBottomText?: string;
        /**
         * <-dxScrollView.Options.refreshingText->
         */
        refreshingText?: string;
    }
    /**
     * <-dxScrollView->
     */
    export class dxScrollView extends dxScrollable {
        constructor(element: Element, options?: dxScrollViewOptions)
        constructor(element: JQuery, options?: dxScrollViewOptions)
        /**
         * <-dxScrollView.refresh()->
         */
        refresh(): void;
        /**
         * <-dxScrollView.release(preventScrollBottom)->
         */
        release(preventScrollBottom: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxScrollable.Options->
     */
    export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
        /**
         * <-dxScrollable.Options.bounceEnabled->
         */
        bounceEnabled?: boolean;
        /**
         * <-dxScrollable.Options.direction->
         */
        direction?: 'both' | 'horizontal' | 'vertical';
        /**
         * <-dxScrollable.Options.disabled->
         */
        disabled?: boolean;
        /**
         * <-dxScrollable.Options.onScroll->
         */
        onScroll?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * <-dxScrollable.Options.onUpdated->
         */
        onUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * <-dxScrollable.Options.scrollByContent->
         */
        scrollByContent?: boolean;
        /**
         * <-dxScrollable.Options.scrollByThumb->
         */
        scrollByThumb?: boolean;
        /**
         * <-dxScrollable.Options.showScrollbar->
         */
        showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
        /**
         * <-dxScrollable.Options.useNative->
         */
        useNative?: boolean;
    }
    /**
     * <-dxScrollable->
     */
    export class dxScrollable extends DOMComponent {
        constructor(element: Element, options?: dxScrollableOptions)
        constructor(element: JQuery, options?: dxScrollableOptions)
        /**
         * <-dxScrollable.clientHeight()->
         */
        clientHeight(): number;
        /**
         * <-dxScrollable.clientWidth()->
         */
        clientWidth(): number;
        /**
         * <-dxScrollable.content()->
         */
        content(): DevExpress.core.dxElement;
        /**
         * <-dxScrollable.scrollBy(distance)->
         */
        scrollBy(distance: number): void;
        /**
         * <-dxScrollable.scrollBy(distanceObject)->
         */
        scrollBy(distanceObject: any): void;
        /**
         * <-dxScrollable.scrollHeight()->
         */
        scrollHeight(): number;
        /**
         * <-dxScrollable.scrollLeft()->
         */
        scrollLeft(): number;
        /**
         * <-dxScrollable.scrollOffset()->
         */
        scrollOffset(): any;
        /**
         * <-dxScrollable.scrollTo(targetLocation)->
         */
        scrollTo(targetLocation: number): void;
        /**
         * <-dxScrollable.scrollTo(targetLocationObject)->
         */
        scrollTo(targetLocation: any): void;
        /**
         * <-dxScrollable.scrollToElement(targetLocation)->
         */
        scrollToElement(element: Element | JQuery): void;
        /**
         * <-dxScrollable.scrollTop()->
         */
        scrollTop(): number;
        /**
         * <-dxScrollable.scrollWidth()->
         */
        scrollWidth(): number;
        /**
         * <-dxScrollable.update()->
         */
        update(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxSelectBox.Options->
     */
    export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
        /**
         * <-dxSelectBox.Options.acceptCustomValue->
         */
        acceptCustomValue?: boolean;
        /**
         * <-dxSelectBox.Options.fieldTemplate->
         */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxSelectBox.Options.onCustomItemCreating->
         */
        onCustomItemCreating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, text?: string, customItem?: string | any | Promise<any> | JQueryPromise<any> }) => any);
        /**
         * <-dxSelectBox.Options.openOnFieldClick->
         */
        openOnFieldClick?: boolean;
        /**
         * <-dxSelectBox.Options.placeholder->
         */
        placeholder?: string;
        /**
         * <-dxSelectBox.Options.showDropDownButton->
         */
        showDropDownButton?: boolean;
        /**
         * <-dxSelectBox.Options.showSelectionControls->
         */
        showSelectionControls?: boolean;
        /**
         * <-dxSelectBox.Options.valueChangeEvent->
         */
        valueChangeEvent?: string;
    }
    /**
     * <-dxSelectBox->
     */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: Element, options?: dxSelectBoxOptions)
        constructor(element: JQuery, options?: dxSelectBoxOptions)
    }
    /**
     * <-dxSlideOut.Options->
     */
    export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
        /**
         * <-dxSlideOut.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxSlideOut.Options.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxSlideOut.Options.dataSource->
         */
        dataSource?: string | Array<string | dxSlideOutItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxSlideOut.Options.items->
         */
        items?: Array<string | dxSlideOutItem | any>;
        /**
         * <-dxSlideOut.Options.menuGroupTemplate->
         */
        menuGroupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
        /**
         * <-dxSlideOut.Options.menuGrouped->
         */
        menuGrouped?: boolean;
        /**
         * <-dxSlideOut.Options.menuItemTemplate->
         */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxSlideOut.Options.menuPosition->
         */
        menuPosition?: 'inverted' | 'normal';
        /**
         * <-dxSlideOut.Options.menuVisible->
         */
        menuVisible?: boolean;
        /**
         * <-dxSlideOut.Options.onMenuGroupRendered->
         */
        onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxSlideOut.Options.onMenuItemRendered->
         */
        onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxSlideOut.Options.selectedIndex->
         */
        selectedIndex?: number;
        /**
         * <-dxSlideOut.Options.swipeEnabled->
         */
        swipeEnabled?: boolean;
    }
    /**
     * <-dxSlideOut->
     */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: Element, options?: dxSlideOutOptions)
        constructor(element: JQuery, options?: dxSlideOutOptions)
        /**
         * <-dxSlideOut.hideMenu()->
         */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxSlideOut.showMenu()->
         */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxSlideOut.toggleMenuVisibility(showing)->
         */
        toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxSlideOutItem->
     */
    export interface dxSlideOutItem extends CollectionWidgetItem {
        /**
         * <-dxSlideOutItem.menuTemplate->
         */
        menuTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
    }
    /**
     * <-dxSlideOutView.Options->
     */
    export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
        /**
         * <-dxSlideOutView.Options.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => any);
        /**
         * <-dxSlideOutView.Options.menuPosition->
         */
        menuPosition?: 'inverted' | 'normal';
        /**
         * <-dxSlideOutView.Options.menuTemplate->
         */
        menuTemplate?: DevExpress.core.template | ((menuElement: DevExpress.core.dxElement) => any);
        /**
         * <-dxSlideOutView.Options.menuVisible->
         */
        menuVisible?: boolean;
        /**
         * <-dxSlideOutView.Options.swipeEnabled->
         */
        swipeEnabled?: boolean;
    }
    /**
     * <-dxSlideOutView->
     */
    export class dxSlideOutView extends Widget {
        constructor(element: Element, options?: dxSlideOutViewOptions)
        constructor(element: JQuery, options?: dxSlideOutViewOptions)
        /**
         * <-dxSlideOutView.content()->
         */
        content(): DevExpress.core.dxElement;
        /**
         * <-dxSlideOutView.hideMenu()->
         */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxSlideOutView.menuContent()->
         */
        menuContent(): DevExpress.core.dxElement;
        /**
         * <-dxSlideOutView.showMenu()->
         */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxSlideOutView.toggleMenuVisibility()->
         */
        toggleMenuVisibility(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxSlider.Options->
     */
    export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
        /**
         * <-dxSlider.Options.value->
         */
        value?: number;
    }
    /**
     * <-dxSlider->
     */
    export class dxSlider extends dxSliderBase {
        constructor(element: Element, options?: dxSliderOptions)
        constructor(element: JQuery, options?: dxSliderOptions)
    }
    /**
     * <-dxSliderBase.Options->
     */
    export interface dxSliderBaseOptions<T = dxSliderBase> extends dxTrackBarOptions<T> {
        /**
         * <-dxSliderBase.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxSliderBase.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxSliderBase.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxSliderBase.Options.keyStep->
         */
        keyStep?: number;
        /**
         * <-dxSliderBase.Options.label->
         */
        label?: { format?: format, position?: 'bottom' | 'top', visible?: boolean };
        /**
         * <-dxSliderBase.Options.name->
         */
        name?: string;
        /**
         * <-dxSliderBase.Options.showRange->
         */
        showRange?: boolean;
        /**
         * <-dxSliderBase.Options.step->
         */
        step?: number;
        /**
         * <-dxSliderBase.Options.tooltip->
         */
        tooltip?: { enabled?: boolean, format?: format, position?: 'bottom' | 'top', showMode?: 'always' | 'onHover' };
    }
    /**
     * <-dxSliderBase->
     */
    export class dxSliderBase extends dxTrackBar {
        constructor(element: Element, options?: dxSliderBaseOptions)
        constructor(element: JQuery, options?: dxSliderBaseOptions)
    }
    /**
     * <-dxSortable.Options->
     */
    export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
        /**
         * <-dxSortable.Options.allowDropInsideItem->
         */
        allowDropInsideItem?: boolean;
        /**
         * <-dxSortable.Options.allowReordering->
         */
        allowReordering?: boolean;
        /**
         * <-dxSortable.Options.dragTemplate->
         */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxSortable.Options.dropFeedbackMode->
         */
        dropFeedbackMode?: 'push' | 'indicate';
        /**
         * <-dxSortable.Options.filter->
         */
        filter?: string;
        /**
         * <-dxSortable.Options.itemOrientation->
         */
        itemOrientation?: 'horizontal' | 'vertical';
        /**
         * <-dxSortable.Options.moveItemOnDrop->
         */
        moveItemOnDrop?: boolean;
        /**
         * <-dxSortable.Options.onAdd->
         */
        onAdd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * <-dxSortable.Options.onDragChange->
         */
        onDragChange?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * <-dxSortable.Options.onDragEnd->
         */
        onDragEnd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * <-dxSortable.Options.onDragMove->
         */
        onDragMove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * <-dxSortable.Options.onDragStart->
         */
        onDragStart?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any);
        /**
         * <-dxSortable.Options.onRemove->
         */
        onRemove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * <-dxSortable.Options.onReorder->
         */
        onReorder?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: Promise<void> | JQueryPromise<void> }) => any);
    }
    /**
     * <-dxSortable->
     */
    export class dxSortable extends DraggableBase {
        constructor(element: Element, options?: dxSortableOptions)
        constructor(element: JQuery, options?: dxSortableOptions)
    }
    /**
     * <-dxSpeedDialAction.Options->
     */
    export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
        /**
         * <-dxSpeedDialAction.Options.icon->
         */
        icon?: string;
        /**
         * <-dxSpeedDialAction.Options.index->
         */
        index?: number;
        /**
         * <-dxSpeedDialAction.Options.label->
         */
        label?: string;
        /**
         * <-dxSpeedDialAction.Options.onClick->
         */
        onClick?: ((e: { event?: DevExpress.events.event, component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, actionElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxSpeedDialAction.Options.onContentReady->
         */
        onContentReady?: ((e: { component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, model?: any, actionElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxSpeedDialAction.Options.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxSpeedDialAction->
     */
    export class dxSpeedDialAction extends Widget {
        constructor(element: Element, options?: dxSpeedDialActionOptions)
        constructor(element: JQuery, options?: dxSpeedDialActionOptions)
    }
    /**
     * <-dxSwitch.Options->
     */
    export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
        /**
         * <-dxSwitch.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxSwitch.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxSwitch.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxSwitch.Options.name->
         */
        name?: string;
        /**
         * <-dxSwitch.Options.switchedOffText->
         */
        switchedOffText?: string;
        /**
         * <-dxSwitch.Options.switchedOnText->
         */
        switchedOnText?: string;
        /**
         * <-dxSwitch.Options.value->
         */
        value?: boolean;
    }
    /**
     * <-dxSwitch->
     */
    export class dxSwitch extends Editor {
        constructor(element: Element, options?: dxSwitchOptions)
        constructor(element: JQuery, options?: dxSwitchOptions)
    }
    /**
     * <-dxTabPanel.Options->
     */
    export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
        /**
         * <-dxTabPanel.Options.animationEnabled->
         */
        animationEnabled?: boolean;
        /**
         * <-dxTabPanel.Options.dataSource->
         */
        dataSource?: string | Array<string | dxTabPanelItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxTabPanel.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxTabPanel.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxTabPanel.Options.itemTitleTemplate->
         */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxTabPanel.Options.items->
         */
        items?: Array<string | dxTabPanelItem | any>;
        /**
         * <-dxTabPanel.Options.onTitleClick->
         */
        onTitleClick?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * <-dxTabPanel.Options.onTitleHold->
         */
        onTitleHold?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTabPanel.Options.onTitleRendered->
         */
        onTitleRendered?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxTabPanel.Options.repaintChangesOnly->
         */
        repaintChangesOnly?: boolean;
        /**
         * <-dxTabPanel.Options.scrollByContent->
         */
        scrollByContent?: boolean;
        /**
         * <-dxTabPanel.Options.scrollingEnabled->
         */
        scrollingEnabled?: boolean;
        /**
         * <-dxTabPanel.Options.showNavButtons->
         */
        showNavButtons?: boolean;
        /**
         * <-dxTabPanel.Options.swipeEnabled->
         */
        swipeEnabled?: boolean;
    }
    /**
     * <-dxTabPanel->
     */
    export class dxTabPanel extends dxMultiView {
        constructor(element: Element, options?: dxTabPanelOptions)
        constructor(element: JQuery, options?: dxTabPanelOptions)
    }
    /**
     * <-dxTabPanelItem->
     */
    export interface dxTabPanelItem extends dxMultiViewItem {
        /**
         * <-dxTabPanelItem.badge->
         */
        badge?: string;
        /**
         * <-dxTabPanelItem.icon->
         */
        icon?: string;
        /**
         * <-dxTabPanelItem.tabTemplate->
         */
        tabTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * <-dxTabPanelItem.title->
         */
        title?: string;
    }
    /**
     * <-dxTabs.Options->
     */
    export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
        /**
         * <-dxTabs.Options.dataSource->
         */
        dataSource?: string | Array<string | dxTabsItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxTabs.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxTabs.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxTabs.Options.items->
         */
        items?: Array<string | dxTabsItem | any>;
        /**
         * <-dxTabs.Options.repaintChangesOnly->
         */
        repaintChangesOnly?: boolean;
        /**
         * <-dxTabs.Options.scrollByContent->
         */
        scrollByContent?: boolean;
        /**
         * <-dxTabs.Options.scrollingEnabled->
         */
        scrollingEnabled?: boolean;
        /**
         * <-dxTabs.Options.selectedItems->
         */
        selectedItems?: Array<string | number | any>;
        /**
         * <-dxTabs.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * <-dxTabs.Options.showNavButtons->
         */
        showNavButtons?: boolean;
    }
    /**
     * <-dxTabs->
     */
    export class dxTabs extends CollectionWidget {
        constructor(element: Element, options?: dxTabsOptions)
        constructor(element: JQuery, options?: dxTabsOptions)
    }
    /**
     * <-dxTabsItem->
     */
    export interface dxTabsItem extends CollectionWidgetItem {
        /**
         * <-dxTabsItem.badge->
         */
        badge?: string;
        /**
         * <-dxTabsItem.icon->
         */
        icon?: string;
    }
    /**
     * <-dxTagBox.Options->
     */
    export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
        /**
         * <-dxTagBox.Options.applyValueMode->
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * <-dxTagBox.Options.hideSelectedItems->
         */
        hideSelectedItems?: boolean;
        /**
         * <-dxTagBox.Options.maxDisplayedTags->
         */
        maxDisplayedTags?: number;
        /**
         * <-dxTagBox.Options.multiline->
         */
        multiline?: boolean;
        /**
         * <-dxTagBox.Options.onMultiTagPreparing->
         */
        onMultiTagPreparing?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, multiTagElement?: DevExpress.core.dxElement, selectedItems?: Array<string | number | any>, text?: string, cancel?: boolean }) => any);
        /**
         * <-dxTagBox.Options.onSelectAllValueChanged->
         */
        onSelectAllValueChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * <-dxTagBox.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<string | number | any>, removedItems?: Array<string | number | any> }) => any);
        /**
         * <-dxTagBox.Options.selectAllMode->
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * <-dxTagBox.Options.selectedItems->
         */
        selectedItems?: Array<string | number | any>;
        /**
         * <-dxTagBox.Options.showDropDownButton->
         */
        showDropDownButton?: boolean;
        /**
         * <-dxTagBox.Options.showMultiTagOnly->
         */
        showMultiTagOnly?: boolean;
        /**
         * <-dxTagBox.Options.tagTemplate->
         */
        tagTemplate?: DevExpress.core.template | ((itemData: any, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxTagBox.Options.value->
         */
        value?: Array<string | number | any>;
    }
    /**
     * <-dxTagBox->
     */
    export class dxTagBox extends dxSelectBox {
        constructor(element: Element, options?: dxTagBoxOptions)
        constructor(element: JQuery, options?: dxTagBoxOptions)
    }
    /**
     * <-dxTextArea.Options->
     */
    export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
        /**
         * <-dxTextArea.Options.autoResizeEnabled->
         */
        autoResizeEnabled?: boolean;
        /**
         * <-dxTextArea.Options.maxHeight->
         */
        maxHeight?: number | string;
        /**
         * <-dxTextArea.Options.minHeight->
         */
        minHeight?: number | string;
        /**
         * <-dxTextArea.Options.spellcheck->
         */
        spellcheck?: boolean;
    }
    /**
     * <-dxTextArea->
     */
    export class dxTextArea extends dxTextBox {
        constructor(element: Element, options?: dxTextAreaOptions)
        constructor(element: JQuery, options?: dxTextAreaOptions)
    }
    /**
     * <-dxTextBox.Options->
     */
    export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
        /**
         * <-dxTextBox.Options.maxLength->
         */
        maxLength?: string | number;
        /**
         * <-dxTextBox.Options.mode->
         */
        mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
        /**
         * <-dxTextBox.Options.value->
         */
        value?: string;
    }
    /**
     * <-dxTextBox->
     */
    export class dxTextBox extends dxTextEditor {
        constructor(element: Element, options?: dxTextBoxOptions)
        constructor(element: JQuery, options?: dxTextBoxOptions)
    }
    /**
     * <-dxTextEditor.Options->
     */
    export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
        /**
         * <-dxTextEditor.Options.buttons->
         */
        buttons?: Array<string | 'clear' | dxTextEditorButton>;
        /**
         * <-dxTextEditor.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxTextEditor.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxTextEditor.Options.inputAttr->
         */
        inputAttr?: any;
        /**
         * <-dxTextEditor.Options.mask->
         */
        mask?: string;
        /**
         * <-dxTextEditor.Options.maskChar->
         */
        maskChar?: string;
        /**
         * <-dxTextEditor.Options.maskInvalidMessage->
         */
        maskInvalidMessage?: string;
        /**
         * <-dxTextEditor.Options.maskRules->
         */
        maskRules?: any;
        /**
         * <-dxTextEditor.Options.name->
         */
        name?: string;
        /**
         * <-dxTextEditor.Options.onChange->
         */
        onChange?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onCopy->
         */
        onCopy?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onCut->
         */
        onCut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onEnterKey->
         */
        onEnterKey?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onFocusIn->
         */
        onFocusIn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onFocusOut->
         */
        onFocusOut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onInput->
         */
        onInput?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onKeyDown->
         */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onKeyPress->
         * @deprecated <-dxTextEditor.Options.onKeyPress:depNote->
         */
        onKeyPress?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onKeyUp->
         */
        onKeyUp?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.onPaste->
         */
        onPaste?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * <-dxTextEditor.Options.placeholder->
         */
        placeholder?: string;
        /**
         * <-dxTextEditor.Options.showClearButton->
         */
        showClearButton?: boolean;
        /**
         * <-dxTextEditor.Options.showMaskMode->
         */
        showMaskMode?: 'always' | 'onFocus';
        /**
         * <-dxTextEditor.Options.spellcheck->
         */
        spellcheck?: boolean;
        /**
         * <-dxTextEditor.Options.stylingMode->
         */
        stylingMode?: 'outlined' | 'underlined' | 'filled';
        /**
         * <-dxTextEditor.Options.text->
         */
        text?: string;
        /**
         * <-dxTextEditor.Options.useMaskedValue->
         */
        useMaskedValue?: boolean;
        /**
         * <-dxTextEditor.Options.value->
         */
        value?: any;
        /**
         * <-dxTextEditor.Options.valueChangeEvent->
         */
        valueChangeEvent?: string;
    }
    /**
     * <-dxTextEditor->
     */
    export class dxTextEditor extends Editor {
        constructor(element: Element, options?: dxTextEditorOptions)
        constructor(element: JQuery, options?: dxTextEditorOptions)
        /**
         * <-dxTextEditor.blur()->
         */
        blur(): void;
        /**
         * <-dxTextEditor.focus()->
         */
        focus(): void;
        /**
         * <-dxTextEditor.getButton(name)->
         */
        getButton(name: string): dxButton | undefined;
    }
    /**
     * <-dxTextEditorButton->
     */
    export interface dxTextEditorButton {
        /**
         * <-dxTextEditorButton.location->
         */
        location?: 'after' | 'before';
        /**
         * <-dxTextEditorButton.name->
         */
        name?: string;
        /**
         * <-dxTextEditorButton.options->
         */
        options?: dxButtonOptions;
    }
    /**
     * <-dxTileView.Options->
     */
    export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
        /**
         * <-dxTileView.Options.activeStateEnabled->
         */
        activeStateEnabled?: boolean;
        /**
         * <-dxTileView.Options.baseItemHeight->
         */
        baseItemHeight?: number;
        /**
         * <-dxTileView.Options.baseItemWidth->
         */
        baseItemWidth?: number;
        /**
         * <-dxTileView.Options.dataSource->
         */
        dataSource?: string | Array<string | dxTileViewItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxTileView.Options.direction->
         */
        direction?: 'horizontal' | 'vertical';
        /**
         * <-dxTileView.Options.focusStateEnabled->
         */
        focusStateEnabled?: boolean;
        /**
         * <-dxTileView.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxTileView.Options.hoverStateEnabled->
         */
        hoverStateEnabled?: boolean;
        /**
         * <-dxTileView.Options.itemMargin->
         */
        itemMargin?: number;
        /**
         * <-dxTileView.Options.items->
         */
        items?: Array<string | dxTileViewItem | any>;
        /**
         * <-dxTileView.Options.showScrollbar->
         */
        showScrollbar?: boolean;
    }
    /**
     * <-dxTileView->
     */
    export class dxTileView extends CollectionWidget {
        constructor(element: Element, options?: dxTileViewOptions)
        constructor(element: JQuery, options?: dxTileViewOptions)
        /**
         * <-dxTileView.scrollPosition()->
         */
        scrollPosition(): number;
    }
    /**
     * <-dxTileViewItem->
     */
    export interface dxTileViewItem extends CollectionWidgetItem {
        /**
         * <-dxTileViewItem.heightRatio->
         */
        heightRatio?: number;
        /**
         * <-dxTileViewItem.widthRatio->
         */
        widthRatio?: number;
    }
    /**
     * <-dxToast.Options->
     */
    export interface dxToastOptions extends dxOverlayOptions<dxToast> {
        /**
         * <-dxToast.Options.animation->
         */
        animation?: dxToastAnimation;
        /**
         * <-dxToast.Options.closeOnClick->
         */
        closeOnClick?: boolean;
        /**
         * <-dxToast.Options.closeOnOutsideClick->
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * <-dxToast.Options.closeOnSwipe->
         */
        closeOnSwipe?: boolean;
        /**
         * <-dxToast.Options.displayTime->
         */
        displayTime?: number;
        /**
         * <-dxToast.Options.height->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxToast.Options.maxWidth->
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * <-dxToast.Options.message->
         */
        message?: string;
        /**
         * <-dxToast.Options.minWidth->
         */
        minWidth?: number | string | (() => number | string);
        /**
         * <-dxToast.Options.position->
         */
        position?: positionConfig | string;
        /**
         * <-dxToast.Options.shading->
         */
        shading?: boolean;
        /**
         * <-dxToast.Options.type->
         */
        type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
        /**
         * <-dxToast.Options.width->
         */
        width?: number | string | (() => number | string);
    }
    /**
     * <-dxToast.Options.animation->
     */
    export interface dxToastAnimation extends dxOverlayAnimation {
        /**
         * <-dxToast.Options.animation.hide->
         */
        hide?: animationConfig;
        /**
         * <-dxToast.Options.animation.show->
         */
        show?: animationConfig;
    }
    /**
     * <-dxToast->
     */
    export class dxToast extends dxOverlay {
        constructor(element: Element, options?: dxToastOptions)
        constructor(element: JQuery, options?: dxToastOptions)
    }
    /**
     * <-dxToolbar.Options->
     */
    export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
        /**
         * <-dxToolbar.Options.dataSource->
         */
        dataSource?: string | Array<string | dxToolbarItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxToolbar.Options.height->
         * @deprecated <-dxToolbar.Options.height:depNote->
         */
        height?: number | string | (() => number | string);
        /**
         * <-dxToolbar.Options.items->
         */
        items?: Array<string | dxToolbarItem | any>;
        /**
         * <-dxToolbar.Options.menuItemTemplate->
         */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-dxToolbar->
     */
    export class dxToolbar extends CollectionWidget {
        constructor(element: Element, options?: dxToolbarOptions)
        constructor(element: JQuery, options?: dxToolbarOptions)
    }
    /**
     * <-dxToolbarItem->
     */
    export interface dxToolbarItem extends CollectionWidgetItem {
        /**
         * <-dxToolbarItem.cssClass->
         */
        cssClass?: string;
        /**
         * <-dxToolbarItem.locateInMenu->
         */
        locateInMenu?: 'always' | 'auto' | 'never';
        /**
         * <-dxToolbarItem.location->
         */
        location?: 'after' | 'before' | 'center';
        /**
         * <-dxToolbarItem.menuItemTemplate->
         */
        menuItemTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * <-dxToolbarItem.options->
         */
        options?: any;
        /**
         * <-dxToolbarItem.showText->
         */
        showText?: 'always' | 'inMenu';
        /**
         * <-dxToolbarItem.widget->
         */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /**
     * <-dxTooltip.Options->
     */
    export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
    }
    /**
     * <-dxTooltip->
     */
    export class dxTooltip extends dxPopover {
        constructor(element: Element, options?: dxTooltipOptions)
        constructor(element: JQuery, options?: dxTooltipOptions)
    }
    /**
     * <-dxTrackBar.Options->
     */
    export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
        /**
         * <-dxTrackBar.Options.max->
         */
        max?: number;
        /**
         * <-dxTrackBar.Options.min->
         */
        min?: number;
    }
    /**
     * <-dxTrackBar->
     */
    export class dxTrackBar extends Editor {
        constructor(element: Element, options?: dxTrackBarOptions)
        constructor(element: JQuery, options?: dxTrackBarOptions)
    }
    /**
     * <-dxTreeList.Options->
     */
    export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
        /**
         * <-dxTreeList.Options.autoExpandAll->
         */
        autoExpandAll?: boolean;
        /**
         * <-dxTreeList.Options.columns->
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * <-dxTreeList.Options.customizeColumns->
         */
        customizeColumns?: ((columns: Array<dxTreeListColumn>) => any);
        /**
         * <-dxTreeList.Options.dataStructure->
         */
        dataStructure?: 'plain' | 'tree';
        /**
         * <-dxTreeList.Options.editing->
         */
        editing?: dxTreeListEditing;
        /**
         * <-dxTreeList.Options.expandNodesOnFiltering->
         */
        expandNodesOnFiltering?: boolean;
        /**
         * <-dxTreeList.Options.expandedRowKeys->
         */
        expandedRowKeys?: Array<any>;
        /**
         * <-dxTreeList.Options.filterMode->
         */
        filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
        /**
         * <-dxTreeList.Options.hasItemsExpr->
         */
        hasItemsExpr?: string | Function;
        /**
         * <-dxTreeList.Options.itemsExpr->
         */
        itemsExpr?: string | Function;
        /**
         * <-dxTreeList.Options.keyExpr->
         */
        keyExpr?: string | Function;
        /**
         * <-dxTreeList.Options.onCellClick->
         */
        onCellClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any) | string;
        /**
         * <-dxTreeList.Options.onCellDblClick->
         */
        onCellDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onCellHoverChanged->
         */
        onCellHoverChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onCellPrepared->
         */
        onCellPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /**
         * <-dxTreeList.Options.onContextMenuPreparing->
         */
        onContextMenuPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onEditingStart->
         */
        onEditingStart?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /**
         * <-dxTreeList.Options.onEditorPrepared->
         */
        onEditorPrepared?: ((options: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onEditorPreparing->
         */
        onEditorPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onFocusedCellChanged->
         */
        onFocusedCellChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any);
        /**
         * <-dxTreeList.Options.onFocusedCellChanging->
         */
        onFocusedCellChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxTreeListRowObject>, columns?: Array<dxTreeListColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /**
         * <-dxTreeList.Options.onFocusedRowChanged->
         */
        onFocusedRowChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /**
         * <-dxTreeList.Options.onFocusedRowChanging->
         */
        onFocusedRowChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxTreeListRowObject>, cancel?: boolean }) => any);
        /**
         * <-dxTreeList.Options.onNodesInitialized->
         */
        onNodesInitialized?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeListNode }) => any);
        /**
         * <-dxTreeList.Options.onRowClick->
         */
        onRowClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, handled?: boolean, node?: dxTreeListNode, level?: number }) => any) | string;
        /**
         * <-dxTreeList.Options.onRowDblClick->
         */
        onRowDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxTreeList.Options.onRowPrepared->
         */
        onRowPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, node?: dxTreeListNode, level?: number }) => any);
        /**
         * <-dxTreeList.Options.paging->
         */
        paging?: dxTreeListPaging;
        /**
         * <-dxTreeList.Options.parentIdExpr->
         */
        parentIdExpr?: string | Function;
        /**
         * <-dxTreeList.Options.remoteOperations->
         */
        remoteOperations?: { filtering?: boolean, grouping?: boolean, sorting?: boolean } | 'auto';
        /**
         * <-dxTreeList.Options.rootValue->
         */
        rootValue?: any;
        /**
         * <-dxTreeList.Options.scrolling->
         */
        scrolling?: dxTreeListScrolling;
        /**
         * <-dxTreeList.Options.selection->
         */
        selection?: dxTreeListSelection;
    }
    /**
     * <-dxTreeList.Options.editing->
     */
    export interface dxTreeListEditing extends GridBaseEditing {
        /**
         * <-dxTreeList.Options.editing.allowAdding->
         */
        allowAdding?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * <-dxTreeList.Options.editing.allowDeleting->
         */
        allowDeleting?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * <-dxTreeList.Options.editing.allowUpdating->
         */
        allowUpdating?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * <-dxTreeList.Options.editing.texts->
         */
        texts?: dxTreeListEditingTexts;
    }
    /**
     * <-dxTreeList.Options.editing.texts->
     */
    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /**
         * <-dxTreeList.Options.editing.texts.addRowToNode->
         */
        addRowToNode?: string;
    }
    /**
     * <-dxTreeList.Options.paging->
     */
    export interface dxTreeListPaging extends GridBasePaging {
        /**
         * <-dxTreeList.Options.paging.enabled->
         */
        enabled?: boolean;
    }
    /**
     * <-dxTreeList.Options.scrolling->
     */
    export interface dxTreeListScrolling extends GridBaseScrolling {
        /**
         * <-dxTreeList.Options.scrolling.mode->
         */
        mode?: 'standard' | 'virtual';
    }
    /**
     * <-dxTreeList.Options.selection->
     */
    export interface dxTreeListSelection extends GridBaseSelection {
        /**
         * <-dxTreeList.Options.selection.recursive->
         */
        recursive?: boolean;
    }
    /**
     * <-dxTreeList->
     */
    export class dxTreeList extends GridBase {
        constructor(element: Element, options?: dxTreeListOptions)
        constructor(element: JQuery, options?: dxTreeListOptions)
        /**
         * <-dxTreeList.addColumn(columnOptions)->
         */
        addColumn(columnOptions: any | string): void;
        /**
         * <-dxTreeList.addRow()->
         */
        addRow(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.addRow(parentId)->
         */
        addRow(parentId: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.collapseRow(key)->
         */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.expandRow(key)->
         */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.forEachNode(callback)->
         */
        forEachNode(callback: Function): void;
        /**
         * <-dxTreeList.forEachNode(nodes, callback)->
         */
        forEachNode(nodes: Array<dxTreeListNode>, callback: Function): void;
        /**
         * <-dxTreeList.getNodeByKey(key)->
         */
        getNodeByKey(key: any | string | number): dxTreeListNode;
        /**
         * <-dxTreeList.getRootNode()->
         */
        getRootNode(): dxTreeListNode;
        /**
         * <-dxTreeList.getSelectedRowKeys()->
         */
        getSelectedRowKeys(): Array<any>;
        /**
         * <-dxTreeList.getSelectedRowKeys(mode)->
         */
        getSelectedRowKeys(mode: string): Array<any>;
        /**
         * <-dxTreeList.getSelectedRowsData()->
         */
        getSelectedRowsData(): Array<any>;
        /**
         * <-dxTreeList.getSelectedRowsData(mode)->
         */
        getSelectedRowsData(mode: string): Array<any>;
        /**
         * <-dxTreeList.getVisibleColumns()->
         */
        getVisibleColumns(): Array<dxTreeListColumn>;
        /**
         * <-dxTreeList.getVisibleColumns(headerLevel)->
         */
        getVisibleColumns(headerLevel: number): Array<dxTreeListColumn>;
        /**
         * <-dxTreeList.getVisibleRows()->
         */
        getVisibleRows(): Array<dxTreeListRowObject>;
        /**
         * <-dxTreeList.isRowExpanded(key)->
         */
        isRowExpanded(key: any): boolean;
        /**
         * <-dxTreeList.loadDescendants()->
         */
        loadDescendants(): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.loadDescendants(keys)->
         */
        loadDescendants(keys: Array<any>): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeList.loadDescendants(keys, childrenOnly)->
         */
        loadDescendants(keys: Array<any>, childrenOnly: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxTreeListColumn->
     */
    export interface dxTreeListColumn extends GridBaseColumn {
        /**
         * <-dxTreeListColumn.buttons->
         */
        buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxTreeListColumnButton>;
        /**
         * <-dxTreeListColumn.cellTemplate->
         */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxTreeList, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * <-dxTreeListColumn.columns->
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * <-dxTreeListColumn.editCellTemplate->
         */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxTreeList, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * <-dxTreeListColumn.headerCellTemplate->
         */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxTreeList, columnIndex?: number, column?: dxTreeListColumn }) => any);
        /**
         * <-dxTreeListColumn.type->
         */
        type?: 'adaptive' | 'buttons' | 'drag';
    }
    /**
     * <-dxTreeListColumnButton->
     */
    export interface dxTreeListColumnButton extends GridBaseColumnButton {
        /**
         * <-dxTreeListColumnButton.name->
         */
        name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /**
         * <-dxTreeListColumnButton.onClick->
         */
        onClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any) | string;
        /**
         * <-dxTreeListColumnButton.template->
         */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxTreeList, data?: any, key?: any, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject }) => string | Element | JQuery);
        /**
         * <-dxTreeListColumnButton.visible->
         */
        visible?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => boolean);
    }
    /**
     * <-dxTreeListNode->
     */
    export interface dxTreeListNode {
        /**
         * <-dxTreeListNode.children->
         */
        children?: Array<dxTreeListNode>;
        /**
         * <-dxTreeListNode.data->
         */
        data?: any;
        /**
         * <-dxTreeListNode.hasChildren->
         */
        hasChildren?: boolean;
        /**
         * <-dxTreeListNode.key->
         */
        key?: any;
        /**
         * <-dxTreeListNode.level->
         */
        level?: number;
        /**
         * <-dxTreeListNode.parent->
         */
        parent?: dxTreeListNode;
        /**
         * <-dxTreeListNode.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxTreeListRowObject->
     */
    export interface dxTreeListRowObject {
        /**
         * <-dxTreeListRowObject.isEditing->
         */
        isEditing?: boolean;
        /**
         * <-dxTreeListRowObject.isExpanded->
         */
        isExpanded?: boolean;
        /**
         * <-dxTreeListRowObject.isNewRow->
         */
        isNewRow?: boolean;
        /**
         * <-dxTreeListRowObject.isSelected->
         */
        isSelected?: boolean;
        /**
         * <-dxTreeListRowObject.key->
         */
        key?: any;
        /**
         * <-dxTreeListRowObject.level->
         */
        level?: number;
        /**
         * <-dxTreeListRowObject.node->
         */
        node?: dxTreeListNode;
        /**
         * <-dxTreeListRowObject.rowIndex->
         */
        rowIndex?: number;
        /**
         * <-dxTreeListRowObject.rowType->
         */
        rowType?: string;
        /**
         * <-dxTreeListRowObject.values->
         */
        values?: Array<any>;
    }
    /**
     * <-dxTreeView.Options->
     */
    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
        /**
         * <-dxTreeView.Options.animationEnabled->
         */
        animationEnabled?: boolean;
        /**
         * <-dxTreeView.Options.createChildren->
         */
        createChildren?: ((parentNode: dxTreeViewNode) => Promise<any> | JQueryPromise<any> | Array<any>);
        /**
         * <-dxTreeView.Options.dataSource->
         */
        dataSource?: string | Array<dxTreeViewItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * <-dxTreeView.Options.dataStructure->
         */
        dataStructure?: 'plain' | 'tree';
        /**
         * <-dxTreeView.Options.expandAllEnabled->
         */
        expandAllEnabled?: boolean;
        /**
         * <-dxTreeView.Options.expandEvent->
         */
        expandEvent?: 'dblclick' | 'click';
        /**
         * <-dxTreeView.Options.expandNodesRecursive->
         */
        expandNodesRecursive?: boolean;
        /**
         * <-dxTreeView.Options.expandedExpr->
         */
        expandedExpr?: string | Function;
        /**
         * <-dxTreeView.Options.hasItemsExpr->
         */
        hasItemsExpr?: string | Function;
        /**
         * <-dxTreeView.Options.items->
         */
        items?: Array<dxTreeViewItem>;
        /**
         * <-dxTreeView.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemCollapsed->
         */
        onItemCollapsed?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemContextMenu->
         */
        onItemContextMenu?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemExpanded->
         */
        onItemExpanded?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemHold->
         */
        onItemHold?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemRendered->
         */
        onItemRendered?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, node?: dxTreeViewNode }) => any);
        /**
         * <-dxTreeView.Options.onItemSelectionChanged->
         */
        onItemSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * <-dxTreeView.Options.onSelectAllValueChanged->
         */
        onSelectAllValueChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * <-dxTreeView.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-dxTreeView.Options.parentIdExpr->
         */
        parentIdExpr?: string | Function;
        /**
         * <-dxTreeView.Options.rootValue->
         */
        rootValue?: any;
        /**
         * <-dxTreeView.Options.scrollDirection->
         */
        scrollDirection?: 'both' | 'horizontal' | 'vertical';
        /**
         * <-dxTreeView.Options.selectAllText->
         */
        selectAllText?: string;
        /**
         * <-dxTreeView.Options.selectByClick->
         */
        selectByClick?: boolean;
        /**
         * <-dxTreeView.Options.selectNodesRecursive->
         */
        selectNodesRecursive?: boolean;
        /**
         * <-dxTreeView.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * <-dxTreeView.Options.showCheckBoxesMode->
         */
        showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
        /**
         * <-dxTreeView.Options.virtualModeEnabled->
         */
        virtualModeEnabled?: boolean;
    }
    /**
     * <-dxTreeView->
     */
    export class dxTreeView extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxTreeViewOptions)
        constructor(element: JQuery, options?: dxTreeViewOptions)
        /**
         * <-dxTreeView.collapseAll()->
         */
        collapseAll(): void;
        /**
         * <-dxTreeView.collapseItem(itemData)->
         */
        collapseItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.collapseItem(itemElement)->
         */
        collapseItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.collapseItem(key)->
         */
        collapseItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.expandAll()->
         */
        expandAll(): void;
        /**
         * <-dxTreeView.expandItem(itemData)->
         */
        expandItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.expandItem(itemElement)->
         */
        expandItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.expandItem(key)->
         */
        expandItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.getNodes()->
         */
        getNodes(): Array<dxTreeViewNode>;
        /**
         * <-dxTreeView.getSelectedNodeKeys()->
         */
        getSelectedNodeKeys(): Array<any>;
        /**
         * <-dxTreeView.getSelectedNodes()->
         */
        getSelectedNodes(): Array<dxTreeViewNode>;
        /**
         * <-dxTreeView.scrollToItem(itemData)->
         */
        scrollToItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.scrollToItem(itemElement)->
         */
        scrollToItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.scrollToItem(key)->
         */
        scrollToItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * <-dxTreeView.selectAll()->
         */
        selectAll(): void;
        /**
         * <-dxTreeView.selectItem(itemData)->
         */
        selectItem(itemData: any): boolean;
        /**
         * <-dxTreeView.selectItem(itemElement)->
         */
        selectItem(itemElement: Element): boolean;
        /**
         * <-dxTreeView.selectItem(key)->
         */
        selectItem(key: any): boolean;
        /**
         * <-dxTreeView.unselectAll()->
         */
        unselectAll(): void;
        /**
         * <-dxTreeView.unselectItem(itemData)->
         */
        unselectItem(itemData: any): boolean;
        /**
         * <-dxTreeView.unselectItem(itemElement)->
         */
        unselectItem(itemElement: Element): boolean;
        /**
         * <-dxTreeView.unselectItem(key)->
         */
        unselectItem(key: any): boolean;
        /**
         * <-dxTreeView.updateDimensions()->
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * <-dxTreeViewItem->
     */
    export interface dxTreeViewItem extends CollectionWidgetItem {
        /**
         * <-dxTreeViewItem.expanded->
         */
        expanded?: boolean;
        /**
         * <-dxTreeViewItem.hasItems->
         */
        hasItems?: boolean;
        /**
         * <-dxTreeViewItem.icon->
         */
        icon?: string;
        /**
         * <-dxTreeViewItem.items->
         */
        items?: Array<dxTreeViewItem>;
        /**
         * <-dxTreeViewItem.parentId->
         */
        parentId?: number | string;
        /**
         * <-dxTreeViewItem.selected->
         */
        selected?: boolean;
    }
    /**
     * <-dxTreeViewNode->
     */
    export interface dxTreeViewNode {
        /**
         * <-dxTreeViewNode.children->
         */
        children?: Array<dxTreeViewNode>;
        /**
         * <-dxTreeViewNode.disabled->
         */
        disabled?: boolean;
        /**
         * <-dxTreeViewNode.expanded->
         */
        expanded?: boolean;
        /**
         * <-dxTreeViewNode.itemData->
         */
        itemData?: any;
        /**
         * <-dxTreeViewNode.key->
         */
        key?: any;
        /**
         * <-dxTreeViewNode.parent->
         */
        parent?: dxTreeViewNode;
        /**
         * <-dxTreeViewNode.selected->
         */
        selected?: boolean;
        /**
         * <-dxTreeViewNode.text->
         */
        text?: string;
    }
    /**
     * <-dxValidationGroup.Options->
     */
    export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
    }
    /**
     * <-dxValidationGroup->
     */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: Element, options?: dxValidationGroupOptions)
        constructor(element: JQuery, options?: dxValidationGroupOptions)
        /**
         * <-dxValidationGroup.reset()->
         */
        reset(): void;
        /**
         * <-dxValidationGroup.validate()->
         */
        validate(): dxValidationGroupResult;
    }
    /**
     * <-dxValidationGroupResult->
     */
    export interface dxValidationGroupResult {
        /**
         * <-dxValidationGroupResult.brokenRules->
         */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * <-dxValidationGroupResult.complete->
         */
        complete?: Promise<dxValidationGroupResult> | JQueryPromise<dxValidationGroupResult>;
        /**
         * <-dxValidationGroupResult.isValid->
         */
        isValid?: boolean;
        /**
         * <-dxValidationGroupResult.status->
         */
        status?: 'valid' | 'invalid' | 'pending';
        /**
         * <-dxValidationGroupResult.validators->
         */
        validators?: Array<any>;
    }
    /** @name dxValidationMessage.Options */
    export interface dxValidationMessageOptions extends dxOverlayOptions<dxValidationMessage> {
        /** @name dxValidationMessage.Options.boundary */
        boundary?: string | Element | JQuery;
        /** @name dxValidationMessage.Options.mode */
        mode?: string;
        /** @name dxValidationMessage.Options.offset */
        offset?: any;
        /** @name dxValidationMessage.Options.positionRequest */
        positionRequest?: string;
        /** @name dxValidationMessage.Options.validationErrors */
        validationErrors?: Array<any> | null;
    }
    /** @name dxValidationMessage */
    export class dxValidationMessage extends dxOverlay {
        constructor(element: Element, options?: dxValidationMessageOptions)
        constructor(element: JQuery, options?: dxValidationMessageOptions)
    }
    /** @name dxValidationSummary.Options */
    export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
        /**
         * <-dxValidationSummary.Options.validationGroup->
         */
        validationGroup?: string;
    }
    /**
     * <-dxValidationSummary->
     */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: Element, options?: dxValidationSummaryOptions)
        constructor(element: JQuery, options?: dxValidationSummaryOptions)
    }
    /**
     * <-dxValidator.Options->
     */
    export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
        /**
         * <-dxValidator.Options.adapter->
         */
        adapter?: { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> };
        /**
         * <-dxValidator.Options.name->
         */
        name?: string;
        /**
         * <-dxValidator.Options.onValidated->
         */
        onValidated?: ((validatedInfo: { name?: string, isValid?: boolean, value?: any, validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, status?: 'valid' | 'invalid' | 'pending' }) => any);
        /**
         * <-dxValidator.Options.validationGroup->
         */
        validationGroup?: string;
        /**
         * <-dxValidator.Options.validationRules->
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    }
    /**
     * <-dxValidator->
     */
    export class dxValidator extends DOMComponent {
        constructor(element: Element, options?: dxValidatorOptions)
        constructor(element: JQuery, options?: dxValidatorOptions)
        /**
         * <-dxValidator.focus()->
         */
        focus(): void;
        /**
         * <-dxValidator.reset()->
         */
        reset(): void;
        /**
         * <-dxValidator.validate()->
         */
        validate(): dxValidatorResult;
    }
    /**
     * <-dxValidatorResult->
     */
    export interface dxValidatorResult {
        /**
         * <-dxValidatorResult.brokenRule->
         */
        brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule;
        /**
         * <-dxValidatorResult.brokenRules->
         */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * <-dxValidatorResult.complete->
         */
        complete?: Promise<dxValidatorResult> | JQueryPromise<dxValidatorResult>;
        /**
         * <-dxValidatorResult.isValid->
         */
        isValid?: boolean;
        /**
         * <-dxValidatorResult.pendingRules->
         */
        pendingRules?: Array<AsyncRule>;
        /**
         * <-dxValidatorResult.status->
         */
        status?: 'valid' | 'invalid' | 'pending';
        /**
         * <-dxValidatorResult.validationRules->
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * <-dxValidatorResult.value->
         */
        value?: any;
    }
    /**
     * <-format->
     */
    export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | { currency?: string, formatter?: ((value: number | Date) => string), parser?: ((value: string) => number | Date), precision?: number, type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' };
    /**
     * <-ui.template->
     * @deprecated <-ui.template:depNote->
     */
    export type template = DevExpress.core.template;
    /**
     * <-ui.themes->
     */
    export class themes {
        /**
         * <-ui.themes.current()->
         */
        static current(): string;
        /**
         * <-ui.themes.current(themeName)->
         */
        static current(themeName: string): void;
        /**
         * <-ui.themes.initialized(callback)->
         */
        static initialized(callback: Function): void;
        /**
         * <-ui.themes.ready(callback)->
         */
        static ready(callback: Function): void;
    }
}
declare module DevExpress.ui.dialog {
    /**
     * <-ui.dialog.alert(messageHtml,title)->
     */
    export function alert(messageHtml: string, title: string): Promise<void> & JQueryPromise<void>;
    /**
     * <-ui.dialog.confirm(messageHtml,title)->
     */
    export function confirm(messageHtml: string, title: string): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * <-ui.dialog.custom(options)->
     */
    export function custom(options: { title?: string, messageHtml?: string, buttons?: Array<dxButtonOptions>, showTitle?: boolean, message?: string, dragEnabled?: boolean }): any;
}
declare module DevExpress.ui.dxOverlay {
    /**
     * <-ui.dxOverlay.baseZIndex(zIndex)->
     */
    export function baseZIndex(zIndex: number): void;
}
declare module DevExpress.ui.dxScheduler {
    /**
     * <-ui.dxScheduler.getTimeZones(date)->
     */
    export function getTimeZones(date?: Date): Array<any>;
}
declare module DevExpress.utils {
    /**
     * <-utils.cancelAnimationFrame(requestID)->
     */
    export function cancelAnimationFrame(requestID: number): void;
    /**
     * <-utils.initMobileViewport(options)->
     */
    export function initMobileViewport(options: { allowZoom?: boolean, allowPan?: boolean, allowSelection?: boolean }): void;
    /**
     * <-utils.requestAnimationFrame(callback)->
     */
    export function requestAnimationFrame(callback: Function): number;
}
declare module DevExpress.viz {
    /**
     * <-BarGaugeBarInfo->
     */
    export interface BarGaugeBarInfo {
        /**
         * <-BarGaugeBarInfo.color->
         */
        color?: string;
        /**
         * <-BarGaugeBarInfo.index->
         */
        index?: number;
        /**
         * <-BarGaugeBarInfo.value->
         */
        value?: number;
    }
    /**
     * <-BarGaugeLegendItem->
     */
    export interface BarGaugeLegendItem extends BaseLegendItem {
        /**
         * <-BarGaugeLegendItem.item->
         */
        item?: BarGaugeBarInfo;
    }
    /**
     * <-BaseChart.Options->
     */
    export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
        /**
         * <-BaseChart.Options.adaptiveLayout->
         */
        adaptiveLayout?: BaseChartAdaptiveLayout;
        /**
         * <-BaseChart.Options.animation->
         */
        animation?: { duration?: number, easing?: 'easeOutCubic' | 'linear', enabled?: boolean, maxPointCountSupported?: number } | boolean;
        /**
         * <-BaseChart.Options.customizeLabel->
         */
        customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
        /**
         * <-BaseChart.Options.customizePoint->
         */
        customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
        /**
         * <-BaseChart.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-BaseChart.Options.legend->
         */
        legend?: BaseChartLegend;
        /**
         * <-BaseChart.Options.onDone->
         */
        onDone?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-BaseChart.Options.onPointClick->
         */
        onPointClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: basePointObject }) => any) | string;
        /**
         * <-BaseChart.Options.onPointHoverChanged->
         */
        onPointHoverChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /**
         * <-BaseChart.Options.onPointSelectionChanged->
         */
        onPointSelectionChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /**
         * <-BaseChart.Options.onTooltipHidden->
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /**
         * <-BaseChart.Options.onTooltipShown->
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /**
         * <-BaseChart.Options.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-BaseChart.Options.paletteExtensionMode->
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * <-BaseChart.Options.pointSelectionMode->
         */
        pointSelectionMode?: 'multiple' | 'single';
        /**
         * <-BaseChart.Options.series->
         */
        series?: any | Array<any>;
        /**
         * <-BaseChart.Options.tooltip->
         */
        tooltip?: BaseChartTooltip;
    }
    /**
     * <-BaseChart.Options.adaptiveLayout->
     */
    interface BaseChartAdaptiveLayout {
        /**
         * <-BaseChart.Options.adaptiveLayout.height->
         */
        height?: number;
        /**
         * <-BaseChart.Options.adaptiveLayout.keepLabels->
         */
        keepLabels?: boolean;
        /**
         * <-BaseChart.Options.adaptiveLayout.width->
         */
        width?: number;
    }
    /**
     * <-BaseChart.Options.legend->
     */
    interface BaseChartLegend extends BaseLegend {
        /**
         * <-BaseChart.Options.legend.customizeItems->
         */
        customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
        /**
         * <-BaseChart.Options.legend.markerTemplate->
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /**
     * <-BaseChart.Options.tooltip->
     */
    interface BaseChartTooltip extends BaseWidgetTooltip {
        /**
         * <-BaseChart.Options.tooltip.argumentFormat->
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * <-BaseChart.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((pointInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-BaseChart.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((pointInfo: any) => any);
        /**
         * <-BaseChart.Options.tooltip.interactive->
         */
        interactive?: boolean;
        /**
         * <-BaseChart.Options.tooltip.shared->
         */
        shared?: boolean;
    }
    /**
     * <-BaseChart->
     */
    export class BaseChart extends BaseWidget {
        constructor(element: Element, options?: BaseChartOptions)
        constructor(element: JQuery, options?: BaseChartOptions)
        /**
         * <-BaseChart.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-BaseChart.getAllSeries()->
         */
        getAllSeries(): Array<baseSeriesObject>;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-BaseChart.getSeriesByName(seriesName)->
         */
        getSeriesByName(seriesName: any): chartSeriesObject;
        /**
         * <-BaseChart.getSeriesByPos(seriesIndex)->
         */
        getSeriesByPos(seriesIndex: number): chartSeriesObject;
        /**
         * <-BaseChart.hideTooltip()->
         */
        hideTooltip(): void;
        /**
         * <-BaseChart.refresh()->
         */
        refresh(): void;
        /**
         * <-BaseWidget.render()->
         */
        render(): void;
        /**
         * <-BaseChart.render(renderOptions)->
         */
        render(renderOptions: any): void;
    }
    /**
     * <-BaseChartAnnotationConfig->
     */
    export interface BaseChartAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * <-BaseChartAnnotationConfig.argument->
         */
        argument?: number | Date | string;
        /**
         * <-BaseChartAnnotationConfig.series->
         */
        series?: string;
        /**
         * <-BaseChartAnnotationConfig.value->
         */
        value?: number | Date | string;
    }
    /**
     * <-BaseChartLegendItem->
     */
    export interface BaseChartLegendItem extends BaseLegendItem {
        /**
         * <-BaseChartLegendItem.series->
         */
        series?: baseSeriesObject;
    }
    /**
     * <-BaseGauge.Options->
     */
    export interface BaseGaugeOptions<T = BaseGauge> extends BaseWidgetOptions<T> {
        /**
         * <-BaseGauge.Options.animation->
         */
        animation?: BaseGaugeAnimation;
        /**
         * <-BaseGauge.Options.containerBackgroundColor->
         */
        containerBackgroundColor?: string;
        /**
         * <-BaseGauge.Options.loadingIndicator->
         */
        loadingIndicator?: BaseGaugeLoadingIndicator;
        /**
         * <-BaseGauge.Options.onTooltipHidden->
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * <-BaseGauge.Options.onTooltipShown->
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * <-BaseGauge.Options.rangeContainer->
         */
        rangeContainer?: BaseGaugeRangeContainer;
        /**
         * <-BaseGauge.Options.scale->
         */
        scale?: BaseGaugeScale;
        /**
         * <-BaseGauge.Options.subvalues->
         */
        subvalues?: Array<number>;
        /**
         * <-BaseGauge.Options.tooltip->
         */
        tooltip?: BaseGaugeTooltip;
        /**
         * <-BaseGauge.Options.value->
         */
        value?: number;
    }
    /**
     * <-BaseGauge.Options.animation->
     */
    interface BaseGaugeAnimation {
        /**
         * <-BaseGauge.Options.animation.duration->
         */
        duration?: number;
        /**
         * <-BaseGauge.Options.animation.easing->
         */
        easing?: 'easeOutCubic' | 'linear';
        /**
         * <-BaseGauge.Options.animation.enabled->
         */
        enabled?: boolean;
    }
    /**
     * <-BaseGauge.Options.loadingIndicator->
     */
    interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /**
     * <-BaseGauge.Options.rangeContainer->
     */
    interface BaseGaugeRangeContainer {
        /**
         * <-BaseGauge.Options.rangeContainer.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-BaseGauge.Options.rangeContainer.offset->
         */
        offset?: number;
        /**
         * <-BaseGauge.Options.rangeContainer.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-BaseGauge.Options.rangeContainer.paletteExtensionMode->
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * <-BaseGauge.Options.rangeContainer.ranges->
         */
        ranges?: Array<{ color?: string, endValue?: number, startValue?: number }>;
    }
    /**
     * <-BaseGauge.Options.scale->
     */
    interface BaseGaugeScale {
        /**
         * <-BaseGauge.Options.scale.allowDecimals->
         */
        allowDecimals?: boolean;
        /**
         * <-BaseGauge.Options.scale.customMinorTicks->
         */
        customMinorTicks?: Array<number>;
        /**
         * <-BaseGauge.Options.scale.customTicks->
         */
        customTicks?: Array<number>;
        /**
         * <-BaseGauge.Options.scale.endValue->
         */
        endValue?: number;
        /**
         * <-BaseGauge.Options.scale.label->
         */
        label?: BaseGaugeScaleLabel;
        /**
         * <-BaseGauge.Options.scale.minorTick->
         */
        minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-BaseGauge.Options.scale.minorTickInterval->
         */
        minorTickInterval?: number;
        /**
         * <-BaseGauge.Options.scale.scaleDivisionFactor->
         */
        scaleDivisionFactor?: number;
        /**
         * <-BaseGauge.Options.scale.startValue->
         */
        startValue?: number;
        /**
         * <-BaseGauge.Options.scale.tick->
         */
        tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-BaseGauge.Options.scale.tickInterval->
         */
        tickInterval?: number;
    }
    /**
     * <-BaseGauge.Options.scale.label->
     */
    interface BaseGaugeScaleLabel {
        /**
         * <-BaseGauge.Options.scale.label.customizeText->
         */
        customizeText?: ((scaleValue: { value?: number, valueText?: string }) => string);
        /**
         * <-BaseGauge.Options.scale.label.font->
         */
        font?: Font;
        /**
         * <-BaseGauge.Options.scale.label.format->
         */
        format?: DevExpress.ui.format;
        /**
         * <-BaseGauge.Options.scale.label.overlappingBehavior->
         */
        overlappingBehavior?: 'hide' | 'none';
        /**
         * <-BaseGauge.Options.scale.label.useRangeColors->
         */
        useRangeColors?: boolean;
        /**
         * <-BaseGauge.Options.scale.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-BaseGauge.Options.tooltip->
     */
    interface BaseGaugeTooltip extends BaseWidgetTooltip {
        /**
         * <-BaseGauge.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-BaseGauge.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
        /**
         * <-BaseGauge.Options.tooltip.interactive->
         */
        interactive?: boolean;
    }
    /**
     * <-BaseGauge->
     */
    export class BaseGauge extends BaseWidget {
        constructor(element: Element, options?: BaseGaugeOptions)
        constructor(element: JQuery, options?: BaseGaugeOptions)
        /**
         * <-BaseGauge.subvalues()->
         */
        subvalues(): Array<number>;
        /**
         * <-BaseGauge.subvalues(subvalues)->
         */
        subvalues(subvalues: Array<number>): void;
        /**
         * <-BaseGauge.value()->
         */
        value(): number;
        /**
         * <-BaseGauge.value(value)->
         */
        value(value: number): void;
    }
    /**
     * <-BaseLegend->
     */
    export interface BaseLegend {
        /**
         * <-BaseLegend.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-BaseLegend.border->
         */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * <-BaseLegend.columnCount->
         */
        columnCount?: number;
        /**
         * <-BaseLegend.columnItemSpacing->
         */
        columnItemSpacing?: number;
        /**
         * <-BaseLegend.font->
         */
        font?: Font;
        /**
         * <-BaseLegend.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-BaseLegend.itemTextPosition->
         */
        itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * <-BaseLegend.itemsAlignment->
         */
        itemsAlignment?: 'center' | 'left' | 'right';
        /**
         * <-BaseLegend.margin->
         */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /**
         * <-BaseLegend.markerSize->
         */
        markerSize?: number;
        /**
         * <-BaseLegend.orientation->
         */
        orientation?: 'horizontal' | 'vertical';
        /**
         * <-BaseLegend.paddingLeftRight->
         */
        paddingLeftRight?: number;
        /**
         * <-BaseLegend.paddingTopBottom->
         */
        paddingTopBottom?: number;
        /**
         * <-BaseLegend.rowCount->
         */
        rowCount?: number;
        /**
         * <-BaseLegend.rowItemSpacing->
         */
        rowItemSpacing?: number;
        /**
         * <-BaseLegend.title->
         */
        title?: { font?: Font, horizontalAlignment?: 'center' | 'left' | 'right', margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: { font?: Font, offset?: number, text?: string } | string, text?: string, verticalAlignment?: 'bottom' | 'top' } | string;
        /**
         * <-BaseLegend.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'top';
        /**
         * <-BaseLegend.visible->
         */
        visible?: boolean;
    }
    /**
     * <-BaseLegendItem->
     */
    export interface BaseLegendItem {
        /**
         * <-BaseLegendItem.marker->
         */
        marker?: { fill?: string, opacity?: number, size?: number, state?: 'normal' | 'hovered' | 'selected' };
        /**
         * <-BaseLegendItem.text->
         */
        text?: string;
        /**
         * <-BaseLegendItem.visible->
         */
        visible?: boolean;
    }
    /**
     * <-BaseSparkline.Options->
     */
    export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
        /**
         * <-BaseSparkline.Options.onTooltipHidden->
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-BaseSparkline.Options.onTooltipShown->
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-BaseSparkline.Options.tooltip->
         */
        tooltip?: BaseSparklineTooltip;
    }
    /**
     * <-BaseSparkline.Options.tooltip->
     */
    interface BaseSparklineTooltip extends BaseWidgetTooltip {
        /**
         * <-BaseSparkline.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((pointsInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-BaseSparkline.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((pointsInfo: any) => any);
        /**
         * <-BaseSparkline.Options.tooltip.enabled->
         */
        enabled?: boolean;
        /**
         * <-BaseSparkline.Options.tooltip.interactive->
         */
        interactive?: boolean;
    }
    /**
     * <-BaseSparkline->
     */
    export class BaseSparkline extends BaseWidget {
        constructor(element: Element, options?: BaseSparklineOptions)
        constructor(element: JQuery, options?: BaseSparklineOptions)
    }
    /**
     * <-BaseWidget.Options->
     */
    export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
        /**
         * <-BaseWidget.Options.disabled->
         */
        disabled?: boolean;
        /**
         * <-BaseWidget.Options.export->
         */
        export?: BaseWidgetExport;
        /**
         * <-BaseWidget.Options.loadingIndicator->
         */
        loadingIndicator?: BaseWidgetLoadingIndicator;
        /**
         * <-BaseWidget.Options.margin->
         */
        margin?: BaseWidgetMargin;
        /**
         * <-BaseWidget.Options.onDrawn->
         */
        onDrawn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-BaseWidget.Options.onExported->
         */
        onExported?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * <-BaseWidget.Options.onExporting->
         */
        onExporting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean, format?: string }) => any);
        /**
         * <-BaseWidget.Options.onFileSaving->
         */
        onFileSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * <-BaseWidget.Options.onIncidentOccurred->
         */
        onIncidentOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * <-BaseWidget.Options.pathModified->
         */
        pathModified?: boolean;
        /**
         * <-BaseWidget.Options.redrawOnResize->
         */
        redrawOnResize?: boolean;
        /**
         * <-BaseWidget.Options.rtlEnabled->
         */
        rtlEnabled?: boolean;
        /**
         * <-BaseWidget.Options.size->
         */
        size?: BaseWidgetSize;
        /**
         * <-BaseWidget.Options.theme->
         */
        theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
        /**
         * <-BaseWidget.Options.title->
         */
        title?: BaseWidgetTitle | string;
        /**
         * <-BaseWidget.Options.tooltip->
         */
        tooltip?: BaseWidgetTooltip;
    }
    /**
     * <-BaseWidget.Options.export->
     */
    interface BaseWidgetExport {
        /**
         * <-BaseWidget.Options.export.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-BaseWidget.Options.export.enabled->
         */
        enabled?: boolean;
        /**
         * <-BaseWidget.Options.export.fileName->
         */
        fileName?: string;
        /**
         * <-BaseWidget.Options.export.formats->
         */
        formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
        /**
         * <-BaseWidget.Options.export.margin->
         */
        margin?: number;
        /**
         * <-BaseWidget.Options.export.printingEnabled->
         */
        printingEnabled?: boolean;
        /**
         * <-BaseWidget.Options.export.proxyUrl->
         * @deprecated <-BaseWidget.Options.export.proxyUrl:depNote->
         */
        proxyUrl?: string;
        /**
         * <-BaseWidget.Options.export.svgToCanvas->
         */
        svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => Promise<void> | JQueryPromise<void>);
    }
    /**
     * <-BaseWidget.Options.loadingIndicator->
     */
    interface BaseWidgetLoadingIndicator {
        /**
         * <-BaseWidget.Options.loadingIndicator.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-BaseWidget.Options.loadingIndicator.enabled->
         */
        enabled?: boolean;
        /**
         * <-BaseWidget.Options.loadingIndicator.font->
         */
        font?: Font;
        /**
         * <-BaseWidget.Options.loadingIndicator.show->
         */
        show?: boolean;
        /**
         * <-BaseWidget.Options.loadingIndicator.text->
         */
        text?: string;
    }
    /**
     * <-BaseWidget.Options.margin->
     */
    interface BaseWidgetMargin {
        /**
         * <-BaseWidget.Options.margin.bottom->
         */
        bottom?: number;
        /**
         * <-BaseWidget.Options.margin.left->
         */
        left?: number;
        /**
         * <-BaseWidget.Options.margin.right->
         */
        right?: number;
        /**
         * <-BaseWidget.Options.margin.top->
         */
        top?: number;
    }
    /**
     * <-BaseWidget.Options.size->
     */
    interface BaseWidgetSize {
        /**
         * <-BaseWidget.Options.size.height->
         */
        height?: number;
        /**
         * <-BaseWidget.Options.size.width->
         */
        width?: number;
    }
    /**
     * <-BaseWidget.Options.title->
     */
    interface BaseWidgetTitle {
        /**
         * <-BaseWidget.Options.title.font->
         */
        font?: Font;
        /**
         * <-BaseWidget.Options.title.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-BaseWidget.Options.title.margin->
         */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /**
         * <-BaseWidget.Options.title.placeholderSize->
         */
        placeholderSize?: number;
        /**
         * <-BaseWidget.Options.title.subtitle->
         */
        subtitle?: { font?: Font, offset?: number, text?: string, textOverflow?: 'ellipsis' | 'hide' | 'none', wordWrap?: 'normal' | 'breakWord' | 'none' } | string;
        /**
         * <-BaseWidget.Options.title.text->
         */
        text?: string;
        /**
         * <-BaseWidget.Options.title.textOverflow->
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * <-BaseWidget.Options.title.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'top';
        /**
         * <-BaseWidget.Options.title.wordWrap->
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * <-BaseWidget.Options.tooltip->
     */
    interface BaseWidgetTooltip {
        /**
         * <-BaseWidget.Options.tooltip.arrowLength->
         */
        arrowLength?: number;
        /**
         * <-BaseWidget.Options.tooltip.border->
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * <-BaseWidget.Options.tooltip.color->
         */
        color?: string;
        /**
         * <-BaseWidget.Options.tooltip.container->
         */
        container?: string | Element | JQuery;
        /**
         * <-BaseWidget.Options.tooltip.cornerRadius->
         */
        cornerRadius?: number;
        /**
         * <-BaseWidget.Options.tooltip.enabled->
         */
        enabled?: boolean;
        /**
         * <-BaseWidget.Options.tooltip.font->
         */
        font?: Font;
        /**
         * <-BaseWidget.Options.tooltip.format->
         */
        format?: DevExpress.ui.format;
        /**
         * <-BaseWidget.Options.tooltip.opacity->
         */
        opacity?: number;
        /**
         * <-BaseWidget.Options.tooltip.paddingLeftRight->
         */
        paddingLeftRight?: number;
        /**
         * <-BaseWidget.Options.tooltip.paddingTopBottom->
         */
        paddingTopBottom?: number;
        /**
         * <-BaseWidget.Options.tooltip.shadow->
         */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /**
         * <-BaseWidget.Options.tooltip.zIndex->
         */
        zIndex?: number;
    }
    /**
     * <-BaseWidget->
     */
    export class BaseWidget extends DOMComponent {
        constructor(element: Element, options?: BaseWidgetOptions)
        constructor(element: JQuery, options?: BaseWidgetOptions)
        /**
         * <-BaseWidget.exportTo(fileName, format)->
         */
        exportTo(fileName: string, format: string): void;
        /**
         * <-BaseWidget.getSize()->
         */
        getSize(): BaseWidgetSize;
        /**
         * <-BaseWidget.hideLoadingIndicator()->
         */
        hideLoadingIndicator(): void;
        /**
         * <-BaseWidget.print()->
         */
        print(): void;
        /**
         * <-BaseWidget.render()->
         */
        render(): void;
        /**
         * <-BaseWidget.showLoadingIndicator()->
         */
        showLoadingIndicator(): void;
        /**
         * <-BaseWidget.svg()->
         */
        svg(): string;
    }
    /**
     * <-BaseWidgetAnnotationConfig->
     */
    export interface BaseWidgetAnnotationConfig {
        /**
         * <-BaseWidgetAnnotationConfig.allowDragging->
         */
        allowDragging?: boolean;
        /**
         * <-BaseWidgetAnnotationConfig.arrowLength->
         */
        arrowLength?: number;
        /**
         * <-BaseWidgetAnnotationConfig.arrowWidth->
         */
        arrowWidth?: number;
        /**
         * <-BaseWidgetAnnotationConfig.border->
         */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * <-BaseWidgetAnnotationConfig.color->
         */
        color?: string;
        /**
         * <-BaseWidgetAnnotationConfig.data->
         */
        data?: any;
        /**
         * <-BaseWidgetAnnotationConfig.description->
         */
        description?: string;
        /**
         * <-BaseWidgetAnnotationConfig.font->
         */
        font?: Font;
        /**
         * <-BaseWidgetAnnotationConfig.height->
         */
        height?: number;
        /**
         * <-BaseWidgetAnnotationConfig.image->
         */
        image?: string | { height?: number, url?: string, width?: number };
        /**
         * <-BaseWidgetAnnotationConfig.offsetX->
         */
        offsetX?: number;
        /**
         * <-BaseWidgetAnnotationConfig.offsetY->
         */
        offsetY?: number;
        /**
         * <-BaseWidgetAnnotationConfig.opacity->
         */
        opacity?: number;
        /**
         * <-BaseWidgetAnnotationConfig.paddingLeftRight->
         */
        paddingLeftRight?: number;
        /**
         * <-BaseWidgetAnnotationConfig.paddingTopBottom->
         */
        paddingTopBottom?: number;
        /**
         * <-BaseWidgetAnnotationConfig.shadow->
         */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /**
         * <-BaseWidgetAnnotationConfig.text->
         */
        text?: string;
        /**
         * <-BaseWidgetAnnotationConfig.textOverflow->
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * <-BaseWidgetAnnotationConfig.tooltipEnabled->
         */
        tooltipEnabled?: boolean;
        /**
         * <-BaseWidgetAnnotationConfig.type->
         */
        type?: 'text' | 'image' | 'custom';
        /**
         * <-BaseWidgetAnnotationConfig.width->
         */
        width?: number;
        /**
         * <-BaseWidgetAnnotationConfig.wordWrap->
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
        /**
         * <-BaseWidgetAnnotationConfig.x->
         */
        x?: number;
        /**
         * <-BaseWidgetAnnotationConfig.y->
         */
        y?: number;
    }
    /**
     * <-ChartSeries->
     */
    export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-ChartSeries.name->
         */
        name?: string;
        /**
         * <-ChartSeries.tag->
         */
        tag?: any;
        /**
         * <-ChartSeries.type->
         */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /**
     * <-CommonIndicator->
     */
    export interface CommonIndicator {
        /**
         * <-CommonIndicator.arrowLength->
         */
        arrowLength?: number;
        /**
         * <-CommonIndicator.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-CommonIndicator.baseValue->
         */
        baseValue?: number;
        /**
         * <-CommonIndicator.beginAdaptingAtRadius->
         */
        beginAdaptingAtRadius?: number;
        /**
         * <-CommonIndicator.color->
         */
        color?: string;
        /**
         * <-CommonIndicator.horizontalOrientation->
         */
        horizontalOrientation?: 'left' | 'right';
        /**
         * <-CommonIndicator.indentFromCenter->
         */
        indentFromCenter?: number;
        /**
         * <-CommonIndicator.length->
         */
        length?: number;
        /**
         * <-CommonIndicator.offset->
         */
        offset?: number;
        /**
         * <-CommonIndicator.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-CommonIndicator.secondColor->
         */
        secondColor?: string;
        /**
         * <-CommonIndicator.secondFraction->
         */
        secondFraction?: number;
        /**
         * <-CommonIndicator.size->
         */
        size?: number;
        /**
         * <-CommonIndicator.spindleGapSize->
         */
        spindleGapSize?: number;
        /**
         * <-CommonIndicator.spindleSize->
         */
        spindleSize?: number;
        /**
         * <-CommonIndicator.text->
         */
        text?: { customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number };
        /**
         * <-CommonIndicator.verticalOrientation->
         */
        verticalOrientation?: 'bottom' | 'top';
        /**
         * <-CommonIndicator.width->
         */
        width?: number;
    }
    /**
     * <-Font->
     */
    export interface Font {
        /**
         * <-Font.color->
         */
        color?: string;
        /**
         * <-Font.family->
         */
        family?: string;
        /**
         * <-Font.opacity->
         */
        opacity?: number;
        /**
         * <-Font.size->
         */
        size?: string | number;
        /**
         * <-Font.weight->
         */
        weight?: number;
    }
    /**
     * <-FunnelLegendItem->
     */
    export interface FunnelLegendItem extends BaseLegendItem {
        /**
         * <-FunnelLegendItem.item->
         */
        item?: dxFunnelItem;
    }
    /**
     * <-GaugeIndicator->
     */
    export interface GaugeIndicator extends CommonIndicator {
        /**
         * <-GaugeIndicator.type->
         */
        type?: 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';
    }
    /**
     * <-MapLayer->
     */
    export class MapLayer {
        /**
         * <-MapLayer.elementType->
         */
        elementType?: string;
        /**
         * <-MapLayer.index->
         */
        index?: number;
        /**
         * <-MapLayer.name->
         */
        name?: string;
        /**
         * <-MapLayer.type->
         */
        type?: string;
        /**
         * <-MapLayer.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-MapLayer.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-MapLayer.getElements()->
         */
        getElements(): Array<MapLayerElement>;
    }
    /**
     * <-MapLayerElement->
     */
    export class MapLayerElement {
        /**
         * <-MapLayerElement.layer->
         */
        layer?: any;
        /**
         * <-MapLayerElement.applySettings(settings)->
         */
        applySettings(settings: any): void;
        /**
         * <-MapLayerElement.attribute(name)->
         */
        attribute(name: string): any;
        /**
         * <-MapLayerElement.attribute(name, value)->
         */
        attribute(name: string, value: any): void;
        /**
         * <-MapLayerElement.coordinates()->
         */
        coordinates(): any;
        /**
         * <-MapLayerElement.selected()->
         */
        selected(): boolean;
        /**
         * <-MapLayerElement.selected(state)->
         */
        selected(state: boolean): void;
    }
    /**
     * <-PieChartLegendItem->
     */
    export interface PieChartLegendItem extends BaseLegendItem {
        /**
         * <-PieChartLegendItem.argument->
         */
        argument?: string | Date | number;
        /**
         * <-PieChartLegendItem.argumentIndex->
         */
        argumentIndex?: number;
        /**
         * <-PieChartLegendItem.points->
         */
        points?: Array<piePointObject>;
        /**
         * <-PieChartLegendItem.text->
         */
        text?: any;
    }
    /**
     * <-PieChartSeries->
     */
    export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
        /**
         * <-PieChartSeries.name->
         */
        name?: string;
        /**
         * <-PieChartSeries.tag->
         */
        tag?: any;
    }
    /**
     * <-PolarChartSeries->
     */
    export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-PolarChartSeries.name->
         */
        name?: string;
        /**
         * <-PolarChartSeries.tag->
         */
        tag?: any;
        /**
         * <-PolarChartSeries.type->
         */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /**
     * <-ScaleBreak->
     */
    export interface ScaleBreak {
        /**
         * <-ScaleBreak.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-ScaleBreak.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-VectorMapLegendItem->
     */
    export interface VectorMapLegendItem extends BaseLegendItem {
        /**
         * <-VectorMapLegendItem.color->
         */
        color?: string;
        /**
         * <-VectorMapLegendItem.end->
         */
        end?: number;
        /**
         * <-VectorMapLegendItem.size->
         */
        size?: number;
        /**
         * <-VectorMapLegendItem.start->
         */
        start?: number;
    }
    /**
     * <-VectorMapProjectionConfig->
     */
    export interface VectorMapProjectionConfig {
        /**
         * <-VectorMapProjectionConfig.aspectRatio->
         */
        aspectRatio?: number;
        /**
         * <-VectorMapProjectionConfig.from->
         */
        from?: ((coordinates: Array<number>) => Array<number>);
        /**
         * <-VectorMapProjectionConfig.to->
         */
        to?: ((coordinates: Array<number>) => Array<number>);
    }
    /**
     * <-VizRange->
     */
    export interface VizRange {
        /**
         * <-VizRange.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-VizRange.length->
         */
        length?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-VizRange.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-VizTimeInterval->
     */
    export type VizTimeInterval = number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * <-baseLabelObject->
     */
    export class baseLabelObject {
        /**
         * <-baseLabelObject.getBoundingRect()->
         */
        getBoundingRect(): any;
        /**
         * <-baseLabelObject.hide()->
         */
        hide(): void;
        /**
         * <-baseLabelObject.hide(holdInvisible)->
         */
        hide(holdInvisible: boolean): void;
        /**
         * <-baseLabelObject.isVisible()->
         */
        isVisible(): boolean;
        /**
         * <-baseLabelObject.show()->
         */
        show(): void;
        /**
         * <-baseLabelObject.show(holdVisible)->
         */
        show(holdVisible: boolean): void;
    }
    /**
     * <-basePointObject->
     */
    export class basePointObject {
        /**
         * <-basePointObject.data->
         */
        data?: any;
        /**
         * <-basePointObject.fullState->
         */
        fullState?: number;
        /**
         * <-basePointObject.originalArgument->
         */
        originalArgument?: string | number | Date;
        /**
         * <-basePointObject.originalValue->
         */
        originalValue?: string | number | Date;
        /**
         * <-basePointObject.series->
         */
        series?: any;
        /**
         * <-basePointObject.tag->
         */
        tag?: any;
        /**
         * <-basePointObject.clearHover()->
         */
        clearHover(): void;
        /**
         * <-basePointObject.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-basePointObject.getColor()->
         */
        getColor(): string;
        /**
         * <-basePointObject.getLabel()->
         */
        getLabel(): baseLabelObject & Array<baseLabelObject>;
        /**
         * <-basePointObject.hideTooltip()->
         */
        hideTooltip(): void;
        /**
         * <-basePointObject.hover()->
         */
        hover(): void;
        /**
         * <-basePointObject.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-basePointObject.isSelected()->
         */
        isSelected(): boolean;
        /**
         * <-basePointObject.select()->
         */
        select(): void;
        /**
         * <-basePointObject.showTooltip()->
         */
        showTooltip(): void;
    }
    /**
     * <-baseSeriesObject->
     */
    export class baseSeriesObject {
        /**
         * <-baseSeriesObject.fullState->
         */
        fullState?: number;
        /**
         * <-baseSeriesObject.name->
         */
        name?: any;
        /**
         * <-baseSeriesObject.tag->
         */
        tag?: any;
        /**
         * <-baseSeriesObject.type->
         */
        type?: string;
        /**
         * <-baseSeriesObject.clearHover()->
         */
        clearHover(): void;
        /**
         * <-baseSeriesObject.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-baseSeriesObject.deselectPoint(point)->
         */
        deselectPoint(point: basePointObject): void;
        /**
         * <-baseSeriesObject.getAllPoints()->
         */
        getAllPoints(): Array<basePointObject>;
        /**
         * <-baseSeriesObject.getColor()->
         */
        getColor(): string;
        /**
         * <-baseSeriesObject.getPointByPos(positionIndex)->
         */
        getPointByPos(positionIndex: number): basePointObject;
        /**
         * <-baseSeriesObject.getPointsByArg(pointArg)->
         */
        getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
        /**
         * <-baseSeriesObject.getVisiblePoints()->
         */
        getVisiblePoints(): Array<basePointObject>;
        /**
         * <-baseSeriesObject.hide()->
         */
        hide(): void;
        /**
         * <-baseSeriesObject.hover()->
         */
        hover(): void;
        /**
         * <-baseSeriesObject.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-baseSeriesObject.isSelected()->
         */
        isSelected(): boolean;
        /**
         * <-baseSeriesObject.isVisible()->
         */
        isVisible(): boolean;
        /**
         * <-baseSeriesObject.select()->
         */
        select(): void;
        /**
         * <-baseSeriesObject.selectPoint(point)->
         */
        selectPoint(point: basePointObject): void;
        /**
         * <-baseSeriesObject.show()->
         */
        show(): void;
    }
    /**
     * <-chartAxisObject->
     */
    export class chartAxisObject {
        /**
         * <-chartAxisObject.visualRange()->
         */
        visualRange(): VizRange;
        /**
         * <-chartAxisObject.visualRange(visualRange)->
         */
        visualRange(visualRange: Array<number | string | Date> | VizRange): void;
    }
    /**
     * <-chartPointAggregationInfoObject->
     */
    export interface chartPointAggregationInfoObject {
        /**
         * <-chartPointAggregationInfoObject.aggregationInterval->
         */
        aggregationInterval?: any;
        /**
         * <-chartPointAggregationInfoObject.data->
         */
        data?: Array<any>;
        /**
         * <-chartPointAggregationInfoObject.intervalEnd->
         */
        intervalEnd?: any;
        /**
         * <-chartPointAggregationInfoObject.intervalStart->
         */
        intervalStart?: any;
    }
    /**
     * <-chartPointObject->
     */
    export class chartPointObject extends basePointObject {
        /**
         * <-chartPointObject.aggregationInfo->
         */
        aggregationInfo?: chartPointAggregationInfoObject;
        /**
         * <-chartPointObject.originalCloseValue->
         */
        originalCloseValue?: number | string;
        /**
         * <-chartPointObject.originalHighValue->
         */
        originalHighValue?: number | string;
        /**
         * <-chartPointObject.originalLowValue->
         */
        originalLowValue?: number | string;
        /**
         * <-chartPointObject.originalMinValue->
         */
        originalMinValue?: string | number | Date;
        /**
         * <-chartPointObject.originalOpenValue->
         */
        originalOpenValue?: number | string;
        /**
         * <-chartPointObject.size->
         */
        size?: number | string;
        /**
         * <-chartPointObject.getBoundingRect()->
         */
        getBoundingRect(): any;
    }
    /**
     * <-chartSeriesObject->
     */
    export class chartSeriesObject extends baseSeriesObject {
        /**
         * <-chartSeriesObject.axis->
         */
        axis?: string;
        /**
         * <-chartSeriesObject.barOverlapGroup->
         */
        barOverlapGroup?: string;
        /**
         * <-chartSeriesObject.pane->
         */
        pane?: string;
        /**
         * <-chartSeriesObject.stack->
         */
        stack?: string;
        /**
         * <-chartSeriesObject.getArgumentAxis()->
         */
        getArgumentAxis(): chartAxisObject;
        /**
         * <-chartSeriesObject.getValueAxis()->
         */
        getValueAxis(): chartAxisObject;
    }
    /**
     * <-circularRangeBar->
     */
    export type circularRangeBar = CommonIndicator;
    /**
     * <-circularRectangleNeedle->
     */
    export type circularRectangleNeedle = CommonIndicator;
    /**
     * <-circularTextCloud->
     */
    export type circularTextCloud = CommonIndicator;
    /**
     * <-circularTriangleMarker->
     */
    export type circularTriangleMarker = CommonIndicator;
    /**
     * <-circularTriangleNeedle->
     */
    export type circularTriangleNeedle = CommonIndicator;
    /**
     * <-circularTwoColorNeedle->
     */
    export type circularTwoColorNeedle = CommonIndicator;
    /**
     * <-dxBarGauge.Options->
     */
    export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
        /**
         * <-dxBarGauge.Options.animation->
         */
        animation?: any;
        /**
         * <-dxBarGauge.Options.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-dxBarGauge.Options.barSpacing->
         */
        barSpacing?: number;
        /**
         * <-dxBarGauge.Options.baseValue->
         */
        baseValue?: number;
        /**
         * <-dxBarGauge.Options.endValue->
         */
        endValue?: number;
        /**
         * <-dxBarGauge.Options.geometry->
         */
        geometry?: { endAngle?: number, startAngle?: number };
        /**
         * <-dxBarGauge.Options.label->
         */
        label?: { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number, visible?: boolean };
        /**
         * <-dxBarGauge.Options.legend->
         */
        legend?: dxBarGaugeLegend;
        /**
         * <-dxBarGauge.Options.loadingIndicator->
         */
        loadingIndicator?: dxBarGaugeLoadingIndicator;
        /**
         * <-dxBarGauge.Options.onTooltipHidden->
         */
        onTooltipHidden?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * <-dxBarGauge.Options.onTooltipShown->
         */
        onTooltipShown?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * <-dxBarGauge.Options.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-dxBarGauge.Options.paletteExtensionMode->
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * <-dxBarGauge.Options.relativeInnerRadius->
         */
        relativeInnerRadius?: number;
        /**
         * <-dxBarGauge.Options.resolveLabelOverlapping->
         */
        resolveLabelOverlapping?: 'hide' | 'none';
        /**
         * <-dxBarGauge.Options.startValue->
         */
        startValue?: number;
        /**
         * <-dxBarGauge.Options.tooltip->
         */
        tooltip?: dxBarGaugeTooltip;
        /**
         * <-dxBarGauge.Options.values->
         */
        values?: Array<number>;
    }
    /**
     * <-dxBarGauge.Options.legend->
     */
    export interface dxBarGaugeLegend extends BaseLegend {
        /**
         * <-dxBarGauge.Options.legend.customizeHint->
         */
        customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /**
         * <-dxBarGauge.Options.legend.customizeItems->
         */
        customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
        /**
         * <-dxBarGauge.Options.legend.customizeText->
         */
        customizeText?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /**
         * <-dxBarGauge.Options.legend.itemTextFormat->
         */
        itemTextFormat?: DevExpress.ui.format;
        /**
         * <-dxBarGauge.Options.legend.markerTemplate->
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxBarGauge.Options.legend.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxBarGauge.Options.loadingIndicator->
     */
    export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /**
     * <-dxBarGauge.Options.tooltip->
     */
    export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
        /**
         * <-dxBarGauge.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxBarGauge.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
        /**
         * <-dxBarGauge.Options.tooltip.interactive->
         */
        interactive?: boolean;
    }
    /**
     * <-dxBarGauge->
     */
    export class dxBarGauge extends BaseWidget {
        constructor(element: Element, options?: dxBarGaugeOptions)
        constructor(element: JQuery, options?: dxBarGaugeOptions)
        /**
         * <-dxBarGauge.values()->
         */
        values(): Array<number>;
        /**
         * <-dxBarGauge.values(newValues)->
         */
        values(values: Array<number>): void;
    }
    /**
     * <-dxBullet.Options->
     */
    export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
        /**
         * <-dxBullet.Options.color->
         */
        color?: string;
        /**
         * <-dxBullet.Options.endScaleValue->
         */
        endScaleValue?: number;
        /**
         * <-dxBullet.Options.showTarget->
         */
        showTarget?: boolean;
        /**
         * <-dxBullet.Options.showZeroLevel->
         */
        showZeroLevel?: boolean;
        /**
         * <-dxBullet.Options.startScaleValue->
         */
        startScaleValue?: number;
        /**
         * <-dxBullet.Options.target->
         */
        target?: number;
        /**
         * <-dxBullet.Options.targetColor->
         */
        targetColor?: string;
        /**
         * <-dxBullet.Options.targetWidth->
         */
        targetWidth?: number;
        /**
         * <-dxBullet.Options.value->
         */
        value?: number;
    }
    /**
     * <-dxBullet->
     */
    export class dxBullet extends BaseSparkline {
        constructor(element: Element, options?: dxBulletOptions)
        constructor(element: JQuery, options?: dxBulletOptions)
    }
    /**
     * <-dxChart.Options->
     */
    export interface dxChartOptions extends BaseChartOptions<dxChart> {
        /**
         * <-dxChart.Options.adjustOnZoom->
         */
        adjustOnZoom?: boolean;
        /**
         * <-dxChart.Options.annotations->
         */
        annotations?: Array<dxChartAnnotationConfig | any>;
        /**
         * <-dxChart.Options.argumentAxis->
         */
        argumentAxis?: dxChartArgumentAxis;
        /**
         * <-dxChart.Options.autoHidePointMarkers->
         */
        autoHidePointMarkers?: boolean;
        /**
         * <-dxChart.Options.barGroupPadding->
         */
        barGroupPadding?: number;
        /**
         * <-dxChart.Options.barGroupWidth->
         */
        barGroupWidth?: number;
        /**
         * <-dxChart.Options.commonAnnotationSettings->
         */
        commonAnnotationSettings?: dxChartCommonAnnotationConfig;
        /**
         * <-dxChart.Options.commonAxisSettings->
         */
        commonAxisSettings?: dxChartCommonAxisSettings;
        /**
         * <-dxChart.Options.commonPaneSettings->
         */
        commonPaneSettings?: dxChartCommonPaneSettings;
        /**
         * <-dxChart.Options.commonSeriesSettings->
         */
        commonSeriesSettings?: dxChartCommonSeriesSettings;
        /**
         * <-dxChart.Options.containerBackgroundColor->
         */
        containerBackgroundColor?: string;
        /**
         * <-dxChart.Options.crosshair->
         */
        crosshair?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', enabled?: boolean, horizontalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, verticalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, width?: number };
        /**
         * <-dxChart.Options.customizeAnnotation->
         */
        customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
        /**
         * <-dxChart.Options.dataPrepareSettings->
         */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) };
        /**
         * <-dxChart.Options.defaultPane->
         */
        defaultPane?: string;
        /**
         * <-dxChart.Options.legend->
         */
        legend?: dxChartLegend;
        /**
         * <-dxChart.Options.maxBubbleSize->
         */
        maxBubbleSize?: number;
        /**
         * <-dxChart.Options.minBubbleSize->
         */
        minBubbleSize?: number;
        /**
         * <-dxChart.Options.negativesAsZeroes->
         */
        negativesAsZeroes?: boolean;
        /**
         * <-dxChart.Options.onArgumentAxisClick->
         */
        onArgumentAxisClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, argument?: Date | number | string }) => any) | string;
        /**
         * <-dxChart.Options.onLegendClick->
         */
        onLegendClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: chartSeriesObject }) => any) | string;
        /**
         * <-dxChart.Options.onSeriesClick->
         */
        onSeriesClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: chartSeriesObject }) => any) | string;
        /**
         * <-dxChart.Options.onSeriesHoverChanged->
         */
        onSeriesHoverChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /**
         * <-dxChart.Options.onSeriesSelectionChanged->
         */
        onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /**
         * <-dxChart.Options.onZoomEnd->
         */
        onZoomEnd?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, rangeStart?: Date | number, rangeEnd?: Date | number, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /**
         * <-dxChart.Options.onZoomStart->
         */
        onZoomStart?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /**
         * <-dxChart.Options.panes->
         */
        panes?: dxChartPanes | Array<dxChartPanes>;
        /**
         * <-dxChart.Options.resizePanesOnZoom->
         */
        resizePanesOnZoom?: boolean;
        /**
         * <-dxChart.Options.resolveLabelOverlapping->
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
        /**
         * <-dxChart.Options.rotated->
         */
        rotated?: boolean;
        /**
         * <-dxChart.Options.scrollBar->
         */
        scrollBar?: { color?: string, offset?: number, opacity?: number, position?: 'bottom' | 'left' | 'right' | 'top', visible?: boolean, width?: number };
        /**
         * <-dxChart.Options.series->
         */
        series?: ChartSeries | Array<ChartSeries>;
        /**
         * <-dxChart.Options.seriesSelectionMode->
         */
        seriesSelectionMode?: 'multiple' | 'single';
        /**
         * <-dxChart.Options.seriesTemplate->
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string };
        /**
         * <-dxChart.Options.stickyHovering->
         */
        stickyHovering?: boolean;
        /**
         * <-dxChart.Options.synchronizeMultiAxes->
         */
        synchronizeMultiAxes?: boolean;
        /**
         * <-dxChart.Options.tooltip->
         */
        tooltip?: dxChartTooltip;
        /**
         * <-dxChart.Options.valueAxis->
         */
        valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
        /**
         * <-dxChart.Options.zoomAndPan->
         */
        zoomAndPan?: { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: 'both' | 'none' | 'pan' | 'zoom', dragBoxStyle?: { color?: string, opacity?: number }, dragToZoom?: boolean, panKey?: 'alt' | 'ctrl' | 'meta' | 'shift', valueAxis?: 'both' | 'none' | 'pan' | 'zoom' };
    }
    /**
     * <-dxChart.Options.argumentAxis->
     */
    export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
        /**
         * <-dxChart.Options.argumentAxis.aggregateByCategory->
         */
        aggregateByCategory?: boolean;
        /**
         * <-dxChart.Options.argumentAxis.aggregationGroupWidth->
         */
        aggregationGroupWidth?: number;
        /**
         * <-dxChart.Options.argumentAxis.aggregationInterval->
         */
        aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.argumentAxis.argumentType->
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * <-dxChart.Options.argumentAxis.axisDivisionFactor->
         */
        axisDivisionFactor?: number;
        /**
         * <-dxChart.Options.argumentAxis.breaks->
         */
        breaks?: Array<ScaleBreak>;
        /**
         * <-dxChart.Options.argumentAxis.categories->
         */
        categories?: Array<number | string | Date>;
        /**
         * <-dxChart.Options.argumentAxis.constantLineStyle->
         */
        constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
        /**
         * <-dxChart.Options.argumentAxis.constantLines->
         */
        constantLines?: Array<dxChartArgumentAxisConstantLines>;
        /**
         * <-dxChart.Options.argumentAxis.customPosition->
         */
        customPosition?: number | Date | string;
        /**
         * <-dxChart.Options.argumentAxis.customPositionAxis->
         */
        customPositionAxis?: string;
        /**
         * <-dxChart.Options.argumentAxis.endOnTick->
         */
        endOnTick?: boolean;
        /**
         * <-dxChart.Options.argumentAxis.holidays->
         */
        holidays?: Array<Date | string> | Array<number>;
        /**
         * <-dxChart.Options.argumentAxis.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'none';
        /**
         * <-dxChart.Options.argumentAxis.label->
         */
        label?: dxChartArgumentAxisLabel;
        /**
         * <-dxChart.Options.argumentAxis.linearThreshold->
         */
        linearThreshold?: number;
        /**
         * <-dxChart.Options.argumentAxis.logarithmBase->
         */
        logarithmBase?: number;
        /**
         * <-dxChart.Options.argumentAxis.minVisualRangeLength->
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.argumentAxis.minorTickCount->
         */
        minorTickCount?: number;
        /**
         * <-dxChart.Options.argumentAxis.minorTickInterval->
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.argumentAxis.offset->
         */
        offset?: number;
        /**
         * <-dxChart.Options.argumentAxis.position->
         */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * <-dxChart.Options.argumentAxis.singleWorkdays->
         */
        singleWorkdays?: Array<Date | string> | Array<number>;
        /**
         * <-dxChart.Options.argumentAxis.strips->
         */
        strips?: Array<dxChartArgumentAxisStrips>;
        /**
         * <-dxChart.Options.argumentAxis.tickInterval->
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.argumentAxis.title->
         */
        title?: dxChartArgumentAxisTitle;
        /**
         * <-dxChart.Options.argumentAxis.type->
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * <-dxChart.Options.argumentAxis.visualRange->
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * <-dxChart.Options.argumentAxis.visualRangeUpdateMode->
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * <-dxChart.Options.argumentAxis.wholeRange->
         */
        wholeRange?: VizRange | Array<number | string | Date>;
        /**
         * <-dxChart.Options.argumentAxis.workWeek->
         */
        workWeek?: Array<number>;
        /**
         * <-dxChart.Options.argumentAxis.workdaysOnly->
         */
        workdaysOnly?: boolean;
    }
    /**
     * <-dxChart.Options.argumentAxis.constantLineStyle->
     */
    export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxChart.Options.argumentAxis.constantLineStyle.label->
         */
        label?: dxChartArgumentAxisConstantLineStyleLabel;
    }
    /**
     * <-dxChart.Options.argumentAxis.constantLineStyle.label->
     */
    export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxChart.Options.argumentAxis.constantLineStyle.label.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.argumentAxis.constantLineStyle.label.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxChart.Options.argumentAxis.constantLines->
     */
    export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxChart.Options.argumentAxis.constantLines.displayBehindSeries->
         */
        displayBehindSeries?: boolean;
        /**
         * <-dxChart.Options.argumentAxis.constantLines.extendAxis->
         */
        extendAxis?: boolean;
        /**
         * <-dxChart.Options.argumentAxis.constantLines.label->
         */
        label?: dxChartArgumentAxisConstantLinesLabel;
        /**
         * <-dxChart.Options.argumentAxis.constantLines.value->
         */
        value?: number | Date | string;
    }
    /**
     * <-dxChart.Options.argumentAxis.constantLines.label->
     */
    export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxChart.Options.argumentAxis.constantLines.label.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.argumentAxis.constantLines.label.text->
         */
        text?: string;
        /**
         * <-dxChart.Options.argumentAxis.constantLines.label.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxChart.Options.argumentAxis.label->
     */
    export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
        /**
         * <-dxChart.Options.argumentAxis.label.customizeHint->
         */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxChart.Options.argumentAxis.label.customizeText->
         */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxChart.Options.argumentAxis.label.format->
         */
        format?: DevExpress.ui.format;
    }
    /**
     * <-dxChart.Options.argumentAxis.strips->
     */
    export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /**
         * <-dxChart.Options.argumentAxis.strips.color->
         */
        color?: string;
        /**
         * <-dxChart.Options.argumentAxis.strips.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-dxChart.Options.argumentAxis.strips.label->
         */
        label?: dxChartArgumentAxisStripsLabel;
        /**
         * <-dxChart.Options.argumentAxis.strips.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-dxChart.Options.argumentAxis.strips.label->
     */
    export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxChart.Options.argumentAxis.strips.label.text->
         */
        text?: string;
    }
    /**
     * <-dxChart.Options.argumentAxis.title->
     */
    export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
        /**
         * <-dxChart.Options.argumentAxis.title.text->
         */
        text?: string;
    }
    /**
     * <-dxChart.Options.commonAxisSettings->
     */
    export interface dxChartCommonAxisSettings {
        /**
         * <-dxChart.Options.commonAxisSettings.allowDecimals->
         */
        allowDecimals?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.breakStyle->
         */
        breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number };
        /**
         * <-dxChart.Options.commonAxisSettings.color->
         */
        color?: string;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle->
         */
        constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
        /**
         * <-dxChart.Options.commonAxisSettings.discreteAxisDivisionMode->
         */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /**
         * <-dxChart.Options.commonAxisSettings.endOnTick->
         */
        endOnTick?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.grid->
         */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-dxChart.Options.commonAxisSettings.inverted->
         */
        inverted?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.label->
         */
        label?: dxChartCommonAxisSettingsLabel;
        /**
         * <-dxChart.Options.commonAxisSettings.maxValueMargin->
         */
        maxValueMargin?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.minValueMargin->
         */
        minValueMargin?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.minorGrid->
         */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-dxChart.Options.commonAxisSettings.minorTick->
         */
        minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /**
         * <-dxChart.Options.commonAxisSettings.opacity->
         */
        opacity?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.placeholderSize->
         */
        placeholderSize?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle->
         */
        stripStyle?: dxChartCommonAxisSettingsStripStyle;
        /**
         * <-dxChart.Options.commonAxisSettings.tick->
         */
        tick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /**
         * <-dxChart.Options.commonAxisSettings.title->
         */
        title?: dxChartCommonAxisSettingsTitle;
        /**
         * <-dxChart.Options.commonAxisSettings.valueMarginsEnabled->
         */
        valueMarginsEnabled?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.visible->
         */
        visible?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.width->
         */
        width?: number;
    }
    /**
     * <-dxChart.Options.commonAxisSettings.constantLineStyle->
     */
    export interface dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.color->
         */
        color?: string;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.label->
         */
        label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.paddingLeftRight->
         */
        paddingLeftRight?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.paddingTopBottom->
         */
        paddingTopBottom?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.width->
         */
        width?: number;
    }
    /**
     * <-dxChart.Options.commonAxisSettings.constantLineStyle.label->
     */
    export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.label.font->
         */
        font?: Font;
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.label.position->
         */
        position?: 'inside' | 'outside';
        /**
         * <-dxChart.Options.commonAxisSettings.constantLineStyle.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChart.Options.commonAxisSettings.label->
     */
    export interface dxChartCommonAxisSettingsLabel {
        /**
         * <-dxChart.Options.commonAxisSettings.label.alignment->
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.commonAxisSettings.label.displayMode->
         */
        displayMode?: 'rotate' | 'stagger' | 'standard';
        /**
         * <-dxChart.Options.commonAxisSettings.label.font->
         */
        font?: Font;
        /**
         * <-dxChart.Options.commonAxisSettings.label.indentFromAxis->
         */
        indentFromAxis?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.label.overlappingBehavior->
         */
        overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
        /**
         * <-dxChart.Options.commonAxisSettings.label.position->
         */
        position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
        /**
         * <-dxChart.Options.commonAxisSettings.label.rotationAngle->
         */
        rotationAngle?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.label.staggeringSpacing->
         */
        staggeringSpacing?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.label.textOverflow->
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * <-dxChart.Options.commonAxisSettings.label.visible->
         */
        visible?: boolean;
        /**
         * <-dxChart.Options.commonAxisSettings.label.wordWrap->
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * <-dxChart.Options.commonAxisSettings.stripStyle->
     */
    export interface dxChartCommonAxisSettingsStripStyle {
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.label->
         */
        label?: dxChartCommonAxisSettingsStripStyleLabel;
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.paddingLeftRight->
         */
        paddingLeftRight?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.paddingTopBottom->
         */
        paddingTopBottom?: number;
    }
    /**
     * <-dxChart.Options.commonAxisSettings.stripStyle.label->
     */
    export interface dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.label.font->
         */
        font?: Font;
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.label.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.commonAxisSettings.stripStyle.label.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxChart.Options.commonAxisSettings.title->
     */
    export interface dxChartCommonAxisSettingsTitle {
        /**
         * <-dxChart.Options.commonAxisSettings.title.alignment->
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.commonAxisSettings.title.font->
         */
        font?: Font;
        /**
         * <-dxChart.Options.commonAxisSettings.title.margin->
         */
        margin?: number;
        /**
         * <-dxChart.Options.commonAxisSettings.title.textOverflow->
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * <-dxChart.Options.commonAxisSettings.title.wordWrap->
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * <-dxChart.Options.commonPaneSettings->
     */
    export interface dxChartCommonPaneSettings {
        /**
         * <-dxChart.Options.commonPaneSettings.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-dxChart.Options.commonPaneSettings.border->
         */
        border?: { bottom?: boolean, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', left?: boolean, opacity?: number, right?: boolean, top?: boolean, visible?: boolean, width?: number };
    }
    /**
     * <-dxChart.Options.commonSeriesSettings->
     */
    export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChart.Options.commonSeriesSettings.area->
         */
        area?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.bar->
         */
        bar?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.bubble->
         */
        bubble?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.candlestick->
         */
        candlestick?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.fullstackedarea->
         */
        fullstackedarea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.fullstackedbar->
         */
        fullstackedbar?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.fullstackedline->
         */
        fullstackedline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.fullstackedspline->
         */
        fullstackedspline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.fullstackedsplinearea->
         */
        fullstackedsplinearea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.line->
         */
        line?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.rangearea->
         */
        rangearea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.rangebar->
         */
        rangebar?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.scatter->
         */
        scatter?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.spline->
         */
        spline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.splinearea->
         */
        splinearea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stackedarea->
         */
        stackedarea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stackedbar->
         */
        stackedbar?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stackedline->
         */
        stackedline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stackedspline->
         */
        stackedspline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stackedsplinearea->
         */
        stackedsplinearea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.steparea->
         */
        steparea?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stepline->
         */
        stepline?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.stock->
         */
        stock?: any;
        /**
         * <-dxChart.Options.commonSeriesSettings.type->
         */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /**
     * <-dxChart.Options.legend->
     */
    export interface dxChartLegend extends BaseChartLegend {
        /**
         * <-dxChart.Options.legend.customizeHint->
         */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * <-dxChart.Options.legend.customizeText->
         */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * <-dxChart.Options.legend.hoverMode->
         */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
        /**
         * <-dxChart.Options.legend.position->
         */
        position?: 'inside' | 'outside';
    }
    /**
     * <-dxChart.Options.panes->
     */
    export interface dxChartPanes extends dxChartCommonPaneSettings {
        /**
         * <-dxChart.Options.panes.height->
         */
        height?: number | string;
        /**
         * <-dxChart.Options.panes.name->
         */
        name?: string;
    }
    /**
     * <-dxChart.Options.tooltip->
     */
    export interface dxChartTooltip extends BaseChartTooltip {
        /**
         * <-dxChart.Options.tooltip.location->
         */
        location?: 'center' | 'edge';
    }
    /**
     * <-dxChart.Options.valueAxis->
     */
    export interface dxChartValueAxis extends dxChartCommonAxisSettings {
        /**
         * <-dxChart.Options.valueAxis.autoBreaksEnabled->
         */
        autoBreaksEnabled?: boolean;
        /**
         * <-dxChart.Options.valueAxis.axisDivisionFactor->
         */
        axisDivisionFactor?: number;
        /**
         * <-dxChart.Options.valueAxis.breaks->
         */
        breaks?: Array<ScaleBreak>;
        /**
         * <-dxChart.Options.valueAxis.categories->
         */
        categories?: Array<number | string | Date>;
        /**
         * <-dxChart.Options.valueAxis.constantLineStyle->
         */
        constantLineStyle?: dxChartValueAxisConstantLineStyle;
        /**
         * <-dxChart.Options.valueAxis.constantLines->
         */
        constantLines?: Array<dxChartValueAxisConstantLines>;
        /**
         * <-dxChart.Options.valueAxis.customPosition->
         */
        customPosition?: number | Date | string;
        /**
         * <-dxChart.Options.valueAxis.endOnTick->
         */
        endOnTick?: boolean;
        /**
         * <-dxChart.Options.valueAxis.label->
         */
        label?: dxChartValueAxisLabel;
        /**
         * <-dxChart.Options.valueAxis.linearThreshold->
         */
        linearThreshold?: number;
        /**
         * <-dxChart.Options.valueAxis.logarithmBase->
         */
        logarithmBase?: number;
        /**
         * <-dxChart.Options.valueAxis.maxAutoBreakCount->
         */
        maxAutoBreakCount?: number;
        /**
         * <-dxChart.Options.valueAxis.minVisualRangeLength->
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.valueAxis.minorTickCount->
         */
        minorTickCount?: number;
        /**
         * <-dxChart.Options.valueAxis.minorTickInterval->
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.valueAxis.multipleAxesSpacing->
         */
        multipleAxesSpacing?: number;
        /**
         * <-dxChart.Options.valueAxis.name->
         */
        name?: string;
        /**
         * <-dxChart.Options.valueAxis.offset->
         */
        offset?: number;
        /**
         * <-dxChart.Options.valueAxis.pane->
         */
        pane?: string;
        /**
         * <-dxChart.Options.valueAxis.position->
         */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * <-dxChart.Options.valueAxis.showZero->
         */
        showZero?: boolean;
        /**
         * <-dxChart.Options.valueAxis.strips->
         */
        strips?: Array<dxChartValueAxisStrips>;
        /**
         * <-dxChart.Options.valueAxis.synchronizedValue->
         */
        synchronizedValue?: number;
        /**
         * <-dxChart.Options.valueAxis.tickInterval->
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxChart.Options.valueAxis.title->
         */
        title?: dxChartValueAxisTitle;
        /**
         * <-dxChart.Options.valueAxis.type->
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * <-dxChart.Options.valueAxis.valueType->
         */
        valueType?: 'datetime' | 'numeric' | 'string';
        /**
         * <-dxChart.Options.valueAxis.visualRange->
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * <-dxChart.Options.valueAxis.visualRangeUpdateMode->
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * <-dxChart.Options.valueAxis.wholeRange->
         */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /**
     * <-dxChart.Options.valueAxis.constantLineStyle->
     */
    export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxChart.Options.valueAxis.constantLineStyle.label->
         */
        label?: dxChartValueAxisConstantLineStyleLabel;
    }
    /**
     * <-dxChart.Options.valueAxis.constantLineStyle.label->
     */
    export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxChart.Options.valueAxis.constantLineStyle.label.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.valueAxis.constantLineStyle.label.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxChart.Options.valueAxis.constantLines->
     */
    export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxChart.Options.valueAxis.constantLines.displayBehindSeries->
         */
        displayBehindSeries?: boolean;
        /**
         * <-dxChart.Options.valueAxis.constantLines.extendAxis->
         */
        extendAxis?: boolean;
        /**
         * <-dxChart.Options.valueAxis.constantLines.label->
         */
        label?: dxChartValueAxisConstantLinesLabel;
        /**
         * <-dxChart.Options.valueAxis.constantLines.value->
         */
        value?: number | Date | string;
    }
    /**
     * <-dxChart.Options.valueAxis.constantLines.label->
     */
    export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxChart.Options.valueAxis.constantLines.label.horizontalAlignment->
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChart.Options.valueAxis.constantLines.label.text->
         */
        text?: string;
        /**
         * <-dxChart.Options.valueAxis.constantLines.label.verticalAlignment->
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxChart.Options.valueAxis.label->
     */
    export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
        /**
         * <-dxChart.Options.valueAxis.label.customizeHint->
         */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxChart.Options.valueAxis.label.customizeText->
         */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxChart.Options.valueAxis.label.format->
         */
        format?: DevExpress.ui.format;
    }
    /**
     * <-dxChart.Options.valueAxis.strips->
     */
    export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /**
         * <-dxChart.Options.valueAxis.strips.color->
         */
        color?: string;
        /**
         * <-dxChart.Options.valueAxis.strips.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-dxChart.Options.valueAxis.strips.label->
         */
        label?: dxChartValueAxisStripsLabel;
        /**
         * <-dxChart.Options.valueAxis.strips.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-dxChart.Options.valueAxis.strips.label->
     */
    export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxChart.Options.valueAxis.strips.label.text->
         */
        text?: string;
    }
    /**
     * <-dxChart.Options.valueAxis.title->
     */
    export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
        /**
         * <-dxChart.Options.valueAxis.title.text->
         */
        text?: string;
    }
    /**
     * <-dxChart->
     */
    export class dxChart extends BaseChart {
        constructor(element: Element, options?: dxChartOptions)
        constructor(element: JQuery, options?: dxChartOptions)
        /**
         * <-dxChart.getArgumentAxis()->
         */
        getArgumentAxis(): chartAxisObject;
        /**
         * <-dxChart.getValueAxis()->
         */
        getValueAxis(): chartAxisObject;
        /**
         * <-dxChart.getValueAxis(name)->
         */
        getValueAxis(name: string): chartAxisObject;
        /**
         * <-dxChart.resetVisualRange()->
         */
        resetVisualRange(): void;
        /**
         * <-dxChart.zoomArgument(startValue,endValue)->
         */
        zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
    }
    /**
     * <-dxChartAnnotationConfig->
     */
    export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
        /**
         * <-dxChartAnnotationConfig.name->
         */
        name?: string;
    }
    /**
     * <-dxChartCommonAnnotationConfig->
     */
    export interface dxChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
        /**
         * <-dxChartCommonAnnotationConfig.axis->
         */
        axis?: string;
        /**
         * <-dxChartCommonAnnotationConfig.customizeTooltip->
         */
        customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
        /**
         * <-dxChartCommonAnnotationConfig.template->
         */
        template?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxChartCommonAnnotationConfig.tooltipTemplate->
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-dxChartSeriesTypes->
     */
    interface dxChartSeriesTypes {
        /**
         * <-dxChartSeriesTypes.AreaSeries->
         */
        AreaSeries?: dxChartSeriesTypesAreaSeries;
        /**
         * <-dxChartSeriesTypes.BarSeries->
         */
        BarSeries?: dxChartSeriesTypesBarSeries;
        /**
         * <-dxChartSeriesTypes.BubbleSeries->
         */
        BubbleSeries?: dxChartSeriesTypesBubbleSeries;
        /**
         * <-dxChartSeriesTypes.CandleStickSeries->
         */
        CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
        /**
         * <-dxChartSeriesTypes.CommonSeries->
         */
        CommonSeries?: dxChartSeriesTypesCommonSeries;
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries->
         */
        FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries->
         */
        FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries->
         */
        FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries->
         */
        FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries->
         */
        FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
        /**
         * <-dxChartSeriesTypes.LineSeries->
         */
        LineSeries?: dxChartSeriesTypesLineSeries;
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries->
         */
        RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
        /**
         * <-dxChartSeriesTypes.RangeBarSeries->
         */
        RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
        /**
         * <-dxChartSeriesTypes.ScatterSeries->
         */
        ScatterSeries?: dxChartSeriesTypesScatterSeries;
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries->
         */
        SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
        /**
         * <-dxChartSeriesTypes.SplineSeries->
         */
        SplineSeries?: dxChartSeriesTypesSplineSeries;
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries->
         */
        StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
        /**
         * <-dxChartSeriesTypes.StackedBarSeries->
         */
        StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
        /**
         * <-dxChartSeriesTypes.StackedLineSeries->
         */
        StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries->
         */
        StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries->
         */
        StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries->
         */
        StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
        /**
         * <-dxChartSeriesTypes.StepLineSeries->
         */
        StepLineSeries?: dxChartSeriesTypesStepLineSeries;
        /**
         * <-dxChartSeriesTypes.StockSeries->
         */
        StockSeries?: dxChartSeriesTypesStockSeries;
    }
    /**
     * <-dxChartSeriesTypes.AreaSeries->
     */
    interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.AreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.AreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.AreaSeries.label->
         */
        label?: dxChartSeriesTypesAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.AreaSeries.point->
         */
        point?: dxChartSeriesTypesAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.AreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.AreaSeries.aggregation->
     */
    interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.AreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.AreaSeries.label->
     */
    interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.AreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.AreaSeries.point->
     */
    interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.AreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.BarSeries->
     */
    interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.BarSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesBarSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.BarSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.BarSeries.label->
         */
        label?: dxChartSeriesTypesBarSeriesLabel;
        /**
         * <-dxChartSeriesTypes.BarSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.BarSeries.aggregation->
     */
    interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.BarSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.BarSeries.label->
     */
    interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.BarSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.BubbleSeries->
     */
    interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.BubbleSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.BubbleSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.BubbleSeries.label->
         */
        label?: dxChartSeriesTypesBubbleSeriesLabel;
        /**
         * <-dxChartSeriesTypes.BubbleSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.BubbleSeries.aggregation->
     */
    interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.BubbleSeries.aggregation.method->
         */
        method?: 'avg' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.BubbleSeries.label->
     */
    interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.BubbleSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries->
     */
    interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.hoverStyle->
         */
        hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.label->
         */
        label?: dxChartSeriesTypesCandleStickSeriesLabel;
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.selectionStyle->
         */
        selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.aggregation->
     */
    interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.aggregation.method->
         */
        method?: 'ohlc' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.hoverStyle->
     */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching->
         */
        hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching->
     */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction->
         */
        direction?: 'left' | 'none' | 'right';
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.label->
     */
    interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.selectionStyle->
     */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching->
         */
        hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
    }
    /**
     * <-dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching->
     */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /**
         * <-dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction->
         */
        direction?: 'left' | 'none' | 'right';
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries->
     */
    interface dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.CommonSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.CommonSeries.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.axis->
         */
        axis?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.barOverlapGroup->
         */
        barOverlapGroup?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.barPadding->
         */
        barPadding?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.barWidth->
         */
        barWidth?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.border->
         */
        border?: dxChartSeriesTypesCommonSeriesBorder;
        /**
         * <-dxChartSeriesTypes.CommonSeries.closeValueField->
         */
        closeValueField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.cornerRadius->
         */
        cornerRadius?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.highValueField->
         */
        highValueField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle->
         */
        hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
        /**
         * <-dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints->
         */
        ignoreEmptyPoints?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.innerColor->
         */
        innerColor?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label->
         */
        label?: dxChartSeriesTypesCommonSeriesLabel;
        /**
         * <-dxChartSeriesTypes.CommonSeries.lowValueField->
         */
        lowValueField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.maxLabelCount->
         */
        maxLabelCount?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.minBarSize->
         */
        minBarSize?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.opacity->
         */
        opacity?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.openValueField->
         */
        openValueField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.pane->
         */
        pane?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.point->
         */
        point?: dxChartSeriesTypesCommonSeriesPoint;
        /**
         * <-dxChartSeriesTypes.CommonSeries.rangeValue1Field->
         */
        rangeValue1Field?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.rangeValue2Field->
         */
        rangeValue2Field?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.reduction->
         */
        reduction?: { color?: string, level?: 'close' | 'high' | 'low' | 'open' };
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionMode->
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle->
         */
        selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
        /**
         * <-dxChartSeriesTypes.CommonSeries.showInLegend->
         */
        showInLegend?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.sizeField->
         */
        sizeField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.stack->
         */
        stack?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.tagField->
         */
        tagField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.valueErrorBar->
         */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.valueField->
         */
        valueField?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.visible->
         */
        visible?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.aggregation->
     */
    interface dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.CommonSeries.aggregation.calculate->
         */
        calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
        /**
         * <-dxChartSeriesTypes.CommonSeries.aggregation.enabled->
         */
        enabled?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.border->
     */
    interface dxChartSeriesTypesCommonSeriesBorder {
        /**
         * <-dxChartSeriesTypes.CommonSeries.border.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.border.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.border.visible->
         */
        visible?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.border.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.hoverStyle->
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border->
         */
        border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching->
         */
        hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border->
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible->
         */
        visible?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.border.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching->
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction->
         */
        direction?: 'left' | 'none' | 'right';
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity->
         */
        opacity?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step->
         */
        step?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.label->
     */
    interface dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.alignment->
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.argumentFormat->
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.border->
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.connector->
         */
        connector?: { color?: string, visible?: boolean, width?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.font->
         */
        font?: Font;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.format->
         */
        format?: DevExpress.ui.format;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.horizontalOffset->
         */
        horizontalOffset?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.position->
         */
        position?: 'inside' | 'outside';
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.rotationAngle->
         */
        rotationAngle?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.showForZeroValues->
         */
        showForZeroValues?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.verticalOffset->
         */
        verticalOffset?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.point->
     */
    interface dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.border->
         */
        border?: { color?: string, visible?: boolean, width?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.hoverStyle->
         */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.image->
         */
        image?: string | { height?: number | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | { rangeMaxPoint?: number, rangeMinPoint?: number } };
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.selectionMode->
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.selectionStyle->
         */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.size->
         */
        size?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.symbol->
         */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
        /**
         * <-dxChartSeriesTypes.CommonSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.selectionStyle->
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border->
         */
        border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching->
         */
        hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border->
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border.color->
         */
        color?: string;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible->
         */
        visible?: boolean;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.border.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching->
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction->
         */
        direction?: 'left' | 'none' | 'right';
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity->
         */
        opacity?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step->
         */
        step?: number;
        /**
         * <-dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width->
         */
        width?: number;
    }
    /**
     * <-dxChartSeriesTypes.FullStackedAreaSeries->
     */
    interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.label->
         */
        label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.point->
         */
        point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedAreaSeries.label->
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.FullStackedAreaSeries.point->
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.FullStackedAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.FullStackedBarSeries->
     */
    interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.label->
         */
        label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedBarSeries.aggregation->
     */
    interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedBarSeries.label->
     */
    interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * <-dxChartSeriesTypes.FullStackedBarSeries.label.position->
         */
        position?: 'inside' | 'outside';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedLineSeries->
     */
    interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.label->
         */
        label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedLineSeries.aggregation->
     */
    interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedLineSeries.label->
     */
    interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.FullStackedLineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineAreaSeries->
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.label->
         */
        label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.point->
         */
        point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.label->
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.point->
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineSeries->
     */
    interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.label->
         */
        label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineSeries.aggregation->
     */
    interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.FullStackedSplineSeries.label->
     */
    interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.LineSeries->
     */
    interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.LineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesLineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.LineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.LineSeries.label->
         */
        label?: dxChartSeriesTypesLineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.LineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.LineSeries.aggregation->
     */
    interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.LineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.LineSeries.label->
     */
    interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.LineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.RangeAreaSeries->
     */
    interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.label->
         */
        label?: dxChartSeriesTypesRangeAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.point->
         */
        point?: dxChartSeriesTypesRangeAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.RangeAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.aggregation.method->
         */
        method?: 'range' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.RangeAreaSeries.label->
     */
    interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.RangeAreaSeries.point->
     */
    interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.RangeAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.RangeBarSeries->
     */
    interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.label->
         */
        label?: dxChartSeriesTypesRangeBarSeriesLabel;
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.RangeBarSeries.aggregation->
     */
    interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.aggregation.method->
         */
        method?: 'range' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.RangeBarSeries.label->
     */
    interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.RangeBarSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.ScatterSeries->
     */
    interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.ScatterSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.ScatterSeries.label->
         */
        label?: dxChartSeriesTypesScatterSeriesLabel;
    }
    /**
     * <-dxChartSeriesTypes.ScatterSeries.aggregation->
     */
    interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.ScatterSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.ScatterSeries.label->
     */
    interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.ScatterSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.SplineAreaSeries->
     */
    interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.label->
         */
        label?: dxChartSeriesTypesSplineAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.point->
         */
        point?: dxChartSeriesTypesSplineAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.SplineAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.SplineAreaSeries.label->
     */
    interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.SplineAreaSeries.point->
     */
    interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.SplineAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.SplineSeries->
     */
    interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.SplineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.SplineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.SplineSeries.label->
         */
        label?: dxChartSeriesTypesSplineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.SplineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.SplineSeries.aggregation->
     */
    interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.SplineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.SplineSeries.label->
     */
    interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.SplineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StackedAreaSeries->
     */
    interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.label->
         */
        label?: dxChartSeriesTypesStackedAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.point->
         */
        point?: dxChartSeriesTypesStackedAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StackedAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StackedAreaSeries.label->
     */
    interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StackedAreaSeries.point->
     */
    interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.StackedAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StackedBarSeries->
     */
    interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.label->
         */
        label?: dxChartSeriesTypesStackedBarSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StackedBarSeries.aggregation->
     */
    interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StackedBarSeries.label->
     */
    interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * <-dxChartSeriesTypes.StackedBarSeries.label.position->
         */
        position?: 'inside' | 'outside';
    }
    /**
     * <-dxChartSeriesTypes.StackedLineSeries->
     */
    interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.label->
         */
        label?: dxChartSeriesTypesStackedLineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StackedLineSeries.aggregation->
     */
    interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StackedLineSeries.label->
     */
    interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StackedLineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineAreaSeries->
     */
    interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.label->
         */
        label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.point->
         */
        point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineAreaSeries.label->
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineAreaSeries.point->
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.StackedSplineAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineSeries->
     */
    interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.label->
         */
        label?: dxChartSeriesTypesStackedSplineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineSeries.aggregation->
     */
    interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StackedSplineSeries.label->
     */
    interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StackedSplineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries->
     */
    interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.border->
         */
        border?: dxChartSeriesTypesStepAreaSeriesBorder;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.hoverStyle->
         */
        hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.label->
         */
        label?: dxChartSeriesTypesStepAreaSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.point->
         */
        point?: dxChartSeriesTypesStepAreaSeriesPoint;
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.selectionStyle->
         */
        selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.aggregation->
     */
    interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.border->
     */
    interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.border.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.hoverStyle->
     */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.hoverStyle.border->
         */
        border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.hoverStyle.border->
     */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.label->
     */
    interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.point->
     */
    interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.selectionStyle->
     */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.selectionStyle.border->
         */
        border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
    }
    /**
     * <-dxChartSeriesTypes.StepAreaSeries.selectionStyle.border->
     */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /**
         * <-dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxChartSeriesTypes.StepLineSeries->
     */
    interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StepLineSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StepLineSeries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StepLineSeries.label->
         */
        label?: dxChartSeriesTypesStepLineSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StepLineSeries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StepLineSeries.aggregation->
     */
    interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StepLineSeries.aggregation.method->
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StepLineSeries.label->
     */
    interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StepLineSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxChartSeriesTypes.StockSeries->
     */
    interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * <-dxChartSeriesTypes.StockSeries.aggregation->
         */
        aggregation?: dxChartSeriesTypesStockSeriesAggregation;
        /**
         * <-dxChartSeriesTypes.StockSeries.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxChartSeriesTypes.StockSeries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxChartSeriesTypes.StockSeries.label->
         */
        label?: dxChartSeriesTypesStockSeriesLabel;
        /**
         * <-dxChartSeriesTypes.StockSeries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxChartSeriesTypes.StockSeries.aggregation->
     */
    interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * <-dxChartSeriesTypes.StockSeries.aggregation.method->
         */
        method?: 'ohlc' | 'custom';
    }
    /**
     * <-dxChartSeriesTypes.StockSeries.label->
     */
    interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * <-dxChartSeriesTypes.StockSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * <-dxCircularGauge.Options->
     */
    export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
        /**
         * <-dxCircularGauge.Options.geometry->
         */
        geometry?: { endAngle?: number, startAngle?: number };
        /**
         * <-dxCircularGauge.Options.rangeContainer->
         */
        rangeContainer?: dxCircularGaugeRangeContainer;
        /**
         * <-dxCircularGauge.Options.scale->
         */
        scale?: dxCircularGaugeScale;
        /**
         * <-dxCircularGauge.Options.subvalueIndicator->
         */
        subvalueIndicator?: GaugeIndicator;
        /**
         * <-dxCircularGauge.Options.valueIndicator->
         */
        valueIndicator?: GaugeIndicator;
    }
    /**
     * <-dxCircularGauge.Options.rangeContainer->
     */
    export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
        /**
         * <-dxCircularGauge.Options.rangeContainer.orientation->
         */
        orientation?: 'center' | 'inside' | 'outside';
        /**
         * <-dxCircularGauge.Options.rangeContainer.width->
         */
        width?: number;
    }
    /**
     * <-dxCircularGauge.Options.scale->
     */
    export interface dxCircularGaugeScale extends BaseGaugeScale {
        /**
         * <-dxCircularGauge.Options.scale.label->
         */
        label?: dxCircularGaugeScaleLabel;
        /**
         * <-dxCircularGauge.Options.scale.orientation->
         */
        orientation?: 'center' | 'inside' | 'outside';
    }
    /**
     * <-dxCircularGauge.Options.scale.label->
     */
    export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
        /**
         * <-dxCircularGauge.Options.scale.label.hideFirstOrLast->
         */
        hideFirstOrLast?: 'first' | 'last';
        /**
         * <-dxCircularGauge.Options.scale.label.indentFromTick->
         */
        indentFromTick?: number;
    }
    /**
     * <-dxCircularGauge->
     */
    export class dxCircularGauge extends BaseGauge {
        constructor(element: Element, options?: dxCircularGaugeOptions)
        constructor(element: JQuery, options?: dxCircularGaugeOptions)
    }
    /**
     * <-dxFunnel.Options->
     */
    export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
        /**
         * <-dxFunnel.Options.adaptiveLayout->
         */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /**
         * <-dxFunnel.Options.algorithm->
         */
        algorithm?: 'dynamicHeight' | 'dynamicSlope';
        /**
         * <-dxFunnel.Options.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxFunnel.Options.colorField->
         */
        colorField?: string;
        /**
         * <-dxFunnel.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-dxFunnel.Options.hoverEnabled->
         */
        hoverEnabled?: boolean;
        /**
         * <-dxFunnel.Options.inverted->
         */
        inverted?: boolean;
        /**
         * <-dxFunnel.Options.item->
         */
        item?: { border?: { color?: string, visible?: boolean, width?: number }, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } }, selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } } };
        /**
         * <-dxFunnel.Options.label->
         */
        label?: { backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, opacity?: number, visible?: boolean, width?: number }, customizeText?: ((itemInfo: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => string), font?: Font, format?: DevExpress.ui.format, horizontalAlignment?: 'left' | 'right', horizontalOffset?: number, position?: 'columns' | 'inside' | 'outside', showForZeroValues?: boolean, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /**
         * <-dxFunnel.Options.legend->
         */
        legend?: dxFunnelLegend;
        /**
         * <-dxFunnel.Options.neckHeight->
         */
        neckHeight?: number;
        /**
         * <-dxFunnel.Options.neckWidth->
         */
        neckWidth?: number;
        /**
         * <-dxFunnel.Options.onHoverChanged->
         */
        onHoverChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /**
         * <-dxFunnel.Options.onItemClick->
         */
        onItemClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, item?: dxFunnelItem }) => any) | string;
        /**
         * <-dxFunnel.Options.onLegendClick->
         */
        onLegendClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, item?: dxFunnelItem }) => any) | string;
        /**
         * <-dxFunnel.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /**
         * <-dxFunnel.Options.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-dxFunnel.Options.paletteExtensionMode->
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * <-dxFunnel.Options.resolveLabelOverlapping->
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /**
         * <-dxFunnel.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'none' | 'single';
        /**
         * <-dxFunnel.Options.sortData->
         */
        sortData?: boolean;
        /**
         * <-dxFunnel.Options.tooltip->
         */
        tooltip?: dxFunnelTooltip;
        /**
         * <-dxFunnel.Options.valueField->
         */
        valueField?: string;
    }
    /**
     * <-dxFunnel.Options.legend->
     */
    export interface dxFunnelLegend extends BaseLegend {
        /**
         * <-dxFunnel.Options.legend.customizeHint->
         */
        customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /**
         * <-dxFunnel.Options.legend.customizeItems->
         */
        customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
        /**
         * <-dxFunnel.Options.legend.customizeText->
         */
        customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /**
         * <-dxFunnel.Options.legend.markerTemplate->
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxFunnel.Options.legend.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxFunnel.Options.tooltip->
     */
    export interface dxFunnelTooltip extends BaseWidgetTooltip {
        /**
         * <-dxFunnel.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxFunnel.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
    }
    /**
     * <-dxFunnel->
     */
    export class dxFunnel extends BaseWidget {
        constructor(element: Element, options?: dxFunnelOptions)
        constructor(element: JQuery, options?: dxFunnelOptions)
        /**
         * <-dxFunnel.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-dxFunnel.getAllItems()->
         */
        getAllItems(): Array<dxFunnelItem>;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxFunnel.hideTooltip()->
         */
        hideTooltip(): void;
    }
    /**
     * <-dxFunnelItem->
     */
    export class dxFunnelItem {
        /**
         * <-dxFunnelItem.argument->
         */
        argument?: string | Date | number;
        /**
         * <-dxFunnelItem.data->
         */
        data?: any;
        /**
         * <-dxFunnelItem.percent->
         */
        percent?: number;
        /**
         * <-dxFunnelItem.value->
         */
        value?: number;
        /**
         * <-dxFunnelItem.getColor()->
         */
        getColor(): string;
        /**
         * <-dxFunnelItem.hover(state)->
         */
        hover(state: boolean): void;
        /**
         * <-dxFunnelItem.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-dxFunnelItem.isSelected()->
         */
        isSelected(): boolean;
        /**
         * <-dxFunnelItem.select(state)->
         */
        select(state: boolean): void;
        /**
         * <-dxFunnelItem.showTooltip()->
         */
        showTooltip(): void;
    }
    /**
     * <-dxLinearGauge.Options->
     */
    export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
        /**
         * <-dxLinearGauge.Options.geometry->
         */
        geometry?: { orientation?: 'horizontal' | 'vertical' };
        /**
         * <-dxLinearGauge.Options.rangeContainer->
         */
        rangeContainer?: dxLinearGaugeRangeContainer;
        /**
         * <-dxLinearGauge.Options.scale->
         */
        scale?: dxLinearGaugeScale;
        /**
         * <-dxLinearGauge.Options.subvalueIndicator->
         */
        subvalueIndicator?: GaugeIndicator;
        /**
         * <-dxLinearGauge.Options.valueIndicator->
         */
        valueIndicator?: GaugeIndicator;
    }
    /**
     * <-dxLinearGauge.Options.rangeContainer->
     */
    export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
        /**
         * <-dxLinearGauge.Options.rangeContainer.horizontalOrientation->
         */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /**
         * <-dxLinearGauge.Options.rangeContainer.verticalOrientation->
         */
        verticalOrientation?: 'bottom' | 'center' | 'top';
        /**
         * <-dxLinearGauge.Options.rangeContainer.width->
         */
        width?: { end?: number, start?: number } | number;
    }
    /**
     * <-dxLinearGauge.Options.scale->
     */
    export interface dxLinearGaugeScale extends BaseGaugeScale {
        /**
         * <-dxLinearGauge.Options.scale.horizontalOrientation->
         */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /**
         * <-dxLinearGauge.Options.scale.label->
         */
        label?: dxLinearGaugeScaleLabel;
        /**
         * <-dxLinearGauge.Options.scale.scaleDivisionFactor->
         */
        scaleDivisionFactor?: number;
        /**
         * <-dxLinearGauge.Options.scale.verticalOrientation->
         */
        verticalOrientation?: 'bottom' | 'center' | 'top';
    }
    /**
     * <-dxLinearGauge.Options.scale.label->
     */
    export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
        /**
         * <-dxLinearGauge.Options.scale.label.indentFromTick->
         */
        indentFromTick?: number;
    }
    /**
     * <-dxLinearGauge->
     */
    export class dxLinearGauge extends BaseGauge {
        constructor(element: Element, options?: dxLinearGaugeOptions)
        constructor(element: JQuery, options?: dxLinearGaugeOptions)
    }
    /**
     * <-dxPieChart.Options->
     */
    export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
        /**
         * <-dxPieChart.Options.adaptiveLayout->
         */
        adaptiveLayout?: dxPieChartAdaptiveLayout;
        /**
         * <-dxPieChart.Options.annotations->
         */
        annotations?: Array<dxPieChartAnnotationConfig | any>;
        /**
         * <-dxPieChart.Options.centerTemplate->
         */
        centerTemplate?: DevExpress.core.template | ((component: dxPieChart, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxPieChart.Options.commonAnnotationSettings->
         */
        commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
        /**
         * <-dxPieChart.Options.commonSeriesSettings->
         */
        commonSeriesSettings?: any;
        /**
         * <-dxPieChart.Options.customizeAnnotation->
         */
        customizeAnnotation?: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig);
        /**
         * <-dxPieChart.Options.diameter->
         */
        diameter?: number;
        /**
         * <-dxPieChart.Options.innerRadius->
         */
        innerRadius?: number;
        /**
         * <-dxPieChart.Options.legend->
         */
        legend?: dxPieChartLegend;
        /**
         * <-dxPieChart.Options.minDiameter->
         */
        minDiameter?: number;
        /**
         * <-dxPieChart.Options.onLegendClick->
         */
        onLegendClick?: ((e: { component?: dxPieChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
        /**
         * <-dxPieChart.Options.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-dxPieChart.Options.resolveLabelOverlapping->
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /**
         * <-dxPieChart.Options.segmentsDirection->
         */
        segmentsDirection?: 'anticlockwise' | 'clockwise';
        /**
         * <-dxPieChart.Options.series->
         */
        series?: PieChartSeries | Array<PieChartSeries>;
        /**
         * <-dxPieChart.Options.seriesTemplate->
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PieChartSeries), nameField?: string };
        /**
         * <-dxPieChart.Options.sizeGroup->
         */
        sizeGroup?: string;
        /**
         * <-dxPieChart.Options.startAngle->
         */
        startAngle?: number;
        /**
         * <-dxPieChart.Options.type->
         */
        type?: 'donut' | 'doughnut' | 'pie';
    }
    /**
     * <-dxPieChart.Options.adaptiveLayout->
     */
    export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /**
         * <-dxPieChart.Options.adaptiveLayout.keepLabels->
         */
        keepLabels?: boolean;
    }
    /**
     * <-dxPieChart.Options.legend->
     */
    export interface dxPieChartLegend extends BaseChartLegend {
        /**
         * <-dxPieChart.Options.legend.customizeHint->
         */
        customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /**
         * <-dxPieChart.Options.legend.customizeItems->
         */
        customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
        /**
         * <-dxPieChart.Options.legend.customizeText->
         */
        customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /**
         * <-dxPieChart.Options.legend.hoverMode->
         */
        hoverMode?: 'none' | 'allArgumentPoints';
        /**
         * <-dxPieChart.Options.legend.markerTemplate->
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /**
     * <-dxPieChart->
     */
    export class dxPieChart extends BaseChart {
        constructor(element: Element, options?: dxPieChartOptions)
        constructor(element: JQuery, options?: dxPieChartOptions)
        /**
         * <-dxPieChart.getInnerRadius()->
         */
        getInnerRadius(): number;
    }
    /**
     * <-dxPieChartAnnotationConfig->
     */
    export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
        /**
         * <-dxPieChartAnnotationConfig.name->
         */
        name?: string;
    }
    /**
     * <-dxPieChartCommonAnnotationConfig->
     */
    export interface dxPieChartCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * <-dxPieChartCommonAnnotationConfig.argument->
         */
        argument?: number | Date | string;
        /**
         * <-dxPieChartCommonAnnotationConfig.customizeTooltip->
         */
        customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any);
        /**
         * <-dxPieChartCommonAnnotationConfig.location->
         */
        location?: 'center' | 'edge';
        /**
         * <-dxPieChartCommonAnnotationConfig.series->
         */
        series?: string;
        /**
         * <-dxPieChartCommonAnnotationConfig.template->
         */
        template?: DevExpress.core.template | ((annotation: dxPieChartCommonAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxPieChartCommonAnnotationConfig.tooltipTemplate->
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxPieChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-dxPieChartSeriesTypes->
     */
    export interface dxPieChartSeriesTypes {
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries->
         */
        CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
        /**
         * <-dxPieChartSeriesTypes.DoughnutSeries->
         */
        DoughnutSeries?: any;
        /**
         * <-dxPieChartSeriesTypes.PieSeries->
         */
        PieSeries?: any;
    }
    /**
     * <-dxPieChartSeriesTypes.CommonPieChartSeries->
     */
    export interface dxPieChartSeriesTypesCommonPieChartSeries {
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.argumentType->
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.border->
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.color->
         */
        color?: string;
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode->
         */
        hoverMode?: 'none' | 'onlyPoint';
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle->
         */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.label->
         */
        label?: { argumentFormat?: DevExpress.ui.format, backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), font?: Font, format?: DevExpress.ui.format, position?: 'columns' | 'inside' | 'outside', radialOffset?: number, rotationAngle?: number, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount->
         */
        maxLabelCount?: number;
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize->
         */
        minSegmentSize?: number;
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode->
         */
        selectionMode?: 'none' | 'onlyPoint';
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle->
         */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping->
         */
        smallValuesGrouping?: { groupName?: string, mode?: 'none' | 'smallValueThreshold' | 'topN', threshold?: number, topCount?: number };
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.tagField->
         */
        tagField?: string;
        /**
         * <-dxPieChartSeriesTypes.CommonPieChartSeries.valueField->
         */
        valueField?: string;
    }
    /**
     * <-dxPolarChart.Options->
     */
    export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
        /**
         * <-dxPolarChart.Options.adaptiveLayout->
         */
        adaptiveLayout?: dxPolarChartAdaptiveLayout;
        /**
         * <-dxPolarChart.Options.annotations->
         */
        annotations?: Array<dxPolarChartAnnotationConfig | any>;
        /**
         * <-dxPolarChart.Options.argumentAxis->
         */
        argumentAxis?: dxPolarChartArgumentAxis;
        /**
         * <-dxPolarChart.Options.barGroupPadding->
         */
        barGroupPadding?: number;
        /**
         * <-dxPolarChart.Options.barGroupWidth->
         */
        barGroupWidth?: number;
        /**
         * <-dxPolarChart.Options.commonAnnotationSettings->
         */
        commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
        /**
         * <-dxPolarChart.Options.commonAxisSettings->
         */
        commonAxisSettings?: dxPolarChartCommonAxisSettings;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings->
         */
        commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
        /**
         * <-dxPolarChart.Options.containerBackgroundColor->
         */
        containerBackgroundColor?: string;
        /**
         * <-dxPolarChart.Options.customizeAnnotation->
         */
        customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig);
        /**
         * <-dxPolarChart.Options.dataPrepareSettings->
         */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) };
        /**
         * <-dxPolarChart.Options.legend->
         */
        legend?: dxPolarChartLegend;
        /**
         * <-dxPolarChart.Options.negativesAsZeroes->
         */
        negativesAsZeroes?: boolean;
        /**
         * <-dxPolarChart.Options.onArgumentAxisClick->
         */
        onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, argument?: Date | number | string }) => any) | string;
        /**
         * <-dxPolarChart.Options.onLegendClick->
         */
        onLegendClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: polarChartSeriesObject }) => any) | string;
        /**
         * <-dxPolarChart.Options.onSeriesClick->
         */
        onSeriesClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: polarChartSeriesObject }) => any) | string;
        /**
         * <-dxPolarChart.Options.onSeriesHoverChanged->
         */
        onSeriesHoverChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /**
         * <-dxPolarChart.Options.onSeriesSelectionChanged->
         */
        onSeriesSelectionChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /**
         * <-dxPolarChart.Options.onZoomEnd->
         */
        onZoomEnd?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /**
         * <-dxPolarChart.Options.onZoomStart->
         */
        onZoomStart?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /**
         * <-dxPolarChart.Options.resolveLabelOverlapping->
         */
        resolveLabelOverlapping?: 'hide' | 'none';
        /**
         * <-dxPolarChart.Options.series->
         */
        series?: PolarChartSeries | Array<PolarChartSeries>;
        /**
         * <-dxPolarChart.Options.seriesSelectionMode->
         */
        seriesSelectionMode?: 'multiple' | 'single';
        /**
         * <-dxPolarChart.Options.seriesTemplate->
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PolarChartSeries), nameField?: string };
        /**
         * <-dxPolarChart.Options.tooltip->
         */
        tooltip?: dxPolarChartTooltip;
        /**
         * <-dxPolarChart.Options.useSpiderWeb->
         */
        useSpiderWeb?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis->
         */
        valueAxis?: dxPolarChartValueAxis;
    }
    /**
     * <-dxPolarChart.Options.adaptiveLayout->
     */
    export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /**
         * <-dxPolarChart.Options.adaptiveLayout.height->
         */
        height?: number;
        /**
         * <-dxPolarChart.Options.adaptiveLayout.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis->
     */
    export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
        /**
         * <-dxPolarChart.Options.argumentAxis.argumentType->
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * <-dxPolarChart.Options.argumentAxis.axisDivisionFactor->
         */
        axisDivisionFactor?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.categories->
         */
        categories?: Array<number | string | Date>;
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines->
         */
        constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
        /**
         * <-dxPolarChart.Options.argumentAxis.firstPointOnStartAngle->
         */
        firstPointOnStartAngle?: boolean;
        /**
         * <-dxPolarChart.Options.argumentAxis.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'none';
        /**
         * <-dxPolarChart.Options.argumentAxis.label->
         */
        label?: dxPolarChartArgumentAxisLabel;
        /**
         * <-dxPolarChart.Options.argumentAxis.linearThreshold->
         */
        linearThreshold?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.logarithmBase->
         */
        logarithmBase?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.minorTick->
         */
        minorTick?: dxPolarChartArgumentAxisMinorTick;
        /**
         * <-dxPolarChart.Options.argumentAxis.minorTickCount->
         */
        minorTickCount?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.minorTickInterval->
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxPolarChart.Options.argumentAxis.originValue->
         */
        originValue?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.period->
         */
        period?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.startAngle->
         */
        startAngle?: number;
        /**
         * <-dxPolarChart.Options.argumentAxis.strips->
         */
        strips?: Array<dxPolarChartArgumentAxisStrips>;
        /**
         * <-dxPolarChart.Options.argumentAxis.tick->
         */
        tick?: dxPolarChartArgumentAxisTick;
        /**
         * <-dxPolarChart.Options.argumentAxis.tickInterval->
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxPolarChart.Options.argumentAxis.type->
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.constantLines->
     */
    export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines.displayBehindSeries->
         */
        displayBehindSeries?: boolean;
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines.extendAxis->
         */
        extendAxis?: boolean;
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines.label->
         */
        label?: dxPolarChartArgumentAxisConstantLinesLabel;
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines.value->
         */
        value?: number | Date | string;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.constantLines.label->
     */
    export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxPolarChart.Options.argumentAxis.constantLines.label.text->
         */
        text?: string;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.label->
     */
    export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /**
         * <-dxPolarChart.Options.argumentAxis.label.customizeHint->
         */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxPolarChart.Options.argumentAxis.label.customizeText->
         */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxPolarChart.Options.argumentAxis.label.format->
         */
        format?: DevExpress.ui.format;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.minorTick->
     */
    export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
        /**
         * <-dxPolarChart.Options.argumentAxis.minorTick.shift->
         */
        shift?: number;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.strips->
     */
    export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * <-dxPolarChart.Options.argumentAxis.strips.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.argumentAxis.strips.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-dxPolarChart.Options.argumentAxis.strips.label->
         */
        label?: dxPolarChartArgumentAxisStripsLabel;
        /**
         * <-dxPolarChart.Options.argumentAxis.strips.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.strips.label->
     */
    export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxPolarChart.Options.argumentAxis.strips.label.text->
         */
        text?: string;
    }
    /**
     * <-dxPolarChart.Options.argumentAxis.tick->
     */
    export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /**
         * <-dxPolarChart.Options.argumentAxis.tick.shift->
         */
        shift?: number;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings->
     */
    export interface dxPolarChartCommonAxisSettings {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.allowDecimals->
         */
        allowDecimals?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle->
         */
        constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.discreteAxisDivisionMode->
         */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /**
         * <-dxPolarChart.Options.commonAxisSettings.endOnTick->
         */
        endOnTick?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.grid->
         */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-dxPolarChart.Options.commonAxisSettings.inverted->
         */
        inverted?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.label->
         */
        label?: dxPolarChartCommonAxisSettingsLabel;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorGrid->
         */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick->
         */
        minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.opacity->
         */
        opacity?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.stripStyle->
         */
        stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick->
         */
        tick?: dxPolarChartCommonAxisSettingsTick;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.visible->
         */
        visible?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle->
     */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.label->
         */
        label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.label->
     */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.font->
         */
        font?: Font;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.label->
     */
    export interface dxPolarChartCommonAxisSettingsLabel {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.label.font->
         */
        font?: Font;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.label.indentFromAxis->
         */
        indentFromAxis?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.label.overlappingBehavior->
         */
        overlappingBehavior?: 'none' | 'hide';
        /**
         * <-dxPolarChart.Options.commonAxisSettings.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.minorTick->
     */
    export interface dxPolarChartCommonAxisSettingsMinorTick {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick.length->
         */
        length?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick.opacity->
         */
        opacity?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick.visible->
         */
        visible?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.minorTick.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.stripStyle->
     */
    export interface dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.stripStyle.label->
         */
        label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.stripStyle.label->
     */
    export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.stripStyle.label.font->
         */
        font?: Font;
    }
    /**
     * <-dxPolarChart.Options.commonAxisSettings.tick->
     */
    export interface dxPolarChartCommonAxisSettingsTick {
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick.length->
         */
        length?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick.opacity->
         */
        opacity?: number;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick.visible->
         */
        visible?: boolean;
        /**
         * <-dxPolarChart.Options.commonAxisSettings.tick.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChart.Options.commonSeriesSettings->
     */
    export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.area->
         */
        area?: any;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.bar->
         */
        bar?: any;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.line->
         */
        line?: any;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.scatter->
         */
        scatter?: any;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.stackedbar->
         */
        stackedbar?: any;
        /**
         * <-dxPolarChart.Options.commonSeriesSettings.type->
         */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /**
     * <-dxPolarChart.Options.legend->
     */
    export interface dxPolarChartLegend extends BaseChartLegend {
        /**
         * <-dxPolarChart.Options.legend.customizeHint->
         */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * <-dxPolarChart.Options.legend.customizeText->
         */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * <-dxPolarChart.Options.legend.hoverMode->
         */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    }
    /**
     * <-dxPolarChart.Options.tooltip->
     */
    export interface dxPolarChartTooltip extends BaseChartTooltip {
        /**
         * <-dxPolarChart.Options.tooltip.shared->
         */
        shared?: boolean;
    }
    /**
     * <-dxPolarChart.Options.valueAxis->
     */
    export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
        /**
         * <-dxPolarChart.Options.valueAxis.axisDivisionFactor->
         */
        axisDivisionFactor?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.categories->
         */
        categories?: Array<number | string | Date>;
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines->
         */
        constantLines?: Array<dxPolarChartValueAxisConstantLines>;
        /**
         * <-dxPolarChart.Options.valueAxis.endOnTick->
         */
        endOnTick?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis.label->
         */
        label?: dxPolarChartValueAxisLabel;
        /**
         * <-dxPolarChart.Options.valueAxis.linearThreshold->
         */
        linearThreshold?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.logarithmBase->
         */
        logarithmBase?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.maxValueMargin->
         */
        maxValueMargin?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.minValueMargin->
         */
        minValueMargin?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.minVisualRangeLength->
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxPolarChart.Options.valueAxis.minorTickCount->
         */
        minorTickCount?: number;
        /**
         * <-dxPolarChart.Options.valueAxis.minorTickInterval->
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxPolarChart.Options.valueAxis.showZero->
         */
        showZero?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis.strips->
         */
        strips?: Array<dxPolarChartValueAxisStrips>;
        /**
         * <-dxPolarChart.Options.valueAxis.tick->
         */
        tick?: dxPolarChartValueAxisTick;
        /**
         * <-dxPolarChart.Options.valueAxis.tickInterval->
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * <-dxPolarChart.Options.valueAxis.type->
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * <-dxPolarChart.Options.valueAxis.valueMarginsEnabled->
         */
        valueMarginsEnabled?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis.valueType->
         */
        valueType?: 'datetime' | 'numeric' | 'string';
        /**
         * <-dxPolarChart.Options.valueAxis.visualRange->
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * <-dxPolarChart.Options.valueAxis.visualRangeUpdateMode->
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
        /**
         * <-dxPolarChart.Options.valueAxis.wholeRange->
         */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.constantLines->
     */
    export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines.displayBehindSeries->
         */
        displayBehindSeries?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines.extendAxis->
         */
        extendAxis?: boolean;
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines.label->
         */
        label?: dxPolarChartValueAxisConstantLinesLabel;
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines.value->
         */
        value?: number | Date | string;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.constantLines.label->
     */
    export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * <-dxPolarChart.Options.valueAxis.constantLines.label.text->
         */
        text?: string;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.label->
     */
    export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /**
         * <-dxPolarChart.Options.valueAxis.label.customizeHint->
         */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxPolarChart.Options.valueAxis.label.customizeText->
         */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * <-dxPolarChart.Options.valueAxis.label.format->
         */
        format?: DevExpress.ui.format;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.strips->
     */
    export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * <-dxPolarChart.Options.valueAxis.strips.color->
         */
        color?: string;
        /**
         * <-dxPolarChart.Options.valueAxis.strips.endValue->
         */
        endValue?: number | Date | string;
        /**
         * <-dxPolarChart.Options.valueAxis.strips.label->
         */
        label?: dxPolarChartValueAxisStripsLabel;
        /**
         * <-dxPolarChart.Options.valueAxis.strips.startValue->
         */
        startValue?: number | Date | string;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.strips.label->
     */
    export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * <-dxPolarChart.Options.valueAxis.strips.label.text->
         */
        text?: string;
    }
    /**
     * <-dxPolarChart.Options.valueAxis.tick->
     */
    export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /**
         * <-dxPolarChart.Options.valueAxis.tick.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChart->
     */
    export class dxPolarChart extends BaseChart {
        constructor(element: Element, options?: dxPolarChartOptions)
        constructor(element: JQuery, options?: dxPolarChartOptions)
        /**
         * <-dxPolarChart.getValueAxis()->
         */
        getValueAxis(): chartAxisObject;
        /**
         * <-dxPolarChart.resetVisualRange()->
         */
        resetVisualRange(): void;
    }
    /**
     * <-dxPolarChartAnnotationConfig->
     */
    export interface dxPolarChartAnnotationConfig extends dxPolarChartCommonAnnotationConfig {
        /**
         * <-dxPolarChartAnnotationConfig.name->
         */
        name?: string;
    }
    /**
     * <-dxPolarChartCommonAnnotationConfig->
     */
    export interface dxPolarChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
        /**
         * <-dxPolarChartCommonAnnotationConfig.angle->
         */
        angle?: number;
        /**
         * <-dxPolarChartCommonAnnotationConfig.customizeTooltip->
         */
        customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any);
        /**
         * <-dxPolarChartCommonAnnotationConfig.radius->
         */
        radius?: number;
        /**
         * <-dxPolarChartCommonAnnotationConfig.template->
         */
        template?: DevExpress.core.template | ((annotation: dxPolarChartCommonAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxPolarChartCommonAnnotationConfig.tooltipTemplate->
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxPolarChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-dxPolarChartSeriesTypes->
     */
    export interface dxPolarChartSeriesTypes {
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries->
         */
        CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
        /**
         * <-dxPolarChartSeriesTypes.areapolarseries->
         */
        areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
        /**
         * <-dxPolarChartSeriesTypes.barpolarseries->
         */
        barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
        /**
         * <-dxPolarChartSeriesTypes.linepolarseries->
         */
        linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
        /**
         * <-dxPolarChartSeriesTypes.scatterpolarseries->
         */
        scatterpolarseries?: any;
        /**
         * <-dxPolarChartSeriesTypes.stackedbarpolarseries->
         */
        stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
    }
    /**
     * <-dxPolarChartSeriesTypes.CommonPolarChartSeries->
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding->
         */
        barPadding?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth->
         */
        barWidth?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.border->
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.closed->
         */
        closed?: boolean;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.color->
         */
        color?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle->
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle->
         */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints->
         */
        ignoreEmptyPoints?: boolean;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label->
         */
        label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount->
         */
        maxLabelCount?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize->
         */
        minBarSize?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity->
         */
        opacity?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point->
         */
        point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode->
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle->
         */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend->
         */
        showInLegend?: boolean;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.stack->
         */
        stack?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField->
         */
        tagField?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar->
         */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField->
         */
        valueField?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.visible->
         */
        visible?: boolean;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.width->
         */
        width?: number;
    }
    /**
     * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label->
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat->
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor->
         */
        backgroundColor?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border->
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector->
         */
        connector?: { color?: string, visible?: boolean, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText->
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font->
         */
        font?: Font;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format->
         */
        format?: DevExpress.ui.format;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position->
         */
        position?: 'inside' | 'outside';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle->
         */
        rotationAngle?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues->
         */
        showForZeroValues?: boolean;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point->
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border->
         */
        border?: { color?: string, visible?: boolean, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color->
         */
        color?: string;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode->
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle->
         */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image->
         */
        image?: string | { height?: number, url?: string, width?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode->
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle->
         */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size->
         */
        size?: number;
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol->
         */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /**
         * <-dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChartSeriesTypes.areapolarseries->
     */
    export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChartSeriesTypes.areapolarseries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxPolarChartSeriesTypes.areapolarseries.point->
         */
        point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
        /**
         * <-dxPolarChartSeriesTypes.areapolarseries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxPolarChartSeriesTypes.areapolarseries.point->
     */
    export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /**
         * <-dxPolarChartSeriesTypes.areapolarseries.point.visible->
         */
        visible?: boolean;
    }
    /**
     * <-dxPolarChartSeriesTypes.barpolarseries->
     */
    export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChartSeriesTypes.barpolarseries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxPolarChartSeriesTypes.barpolarseries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxPolarChartSeriesTypes.linepolarseries->
     */
    export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChartSeriesTypes.linepolarseries.hoverMode->
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * <-dxPolarChartSeriesTypes.linepolarseries.selectionMode->
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * <-dxPolarChartSeriesTypes.stackedbarpolarseries->
     */
    export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * <-dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode->
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * <-dxPolarChartSeriesTypes.stackedbarpolarseries.label->
         */
        label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
        /**
         * <-dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode->
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * <-dxPolarChartSeriesTypes.stackedbarpolarseries.label->
     */
    export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /**
         * <-dxPolarChartSeriesTypes.stackedbarpolarseries.label.position->
         */
        position?: 'inside' | 'outside';
    }
    /**
     * <-dxRangeSelector.Options->
     */
    export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
        /**
         * <-dxRangeSelector.Options.background->
         */
        background?: { color?: string, image?: { location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop', url?: string }, visible?: boolean };
        /**
         * <-dxRangeSelector.Options.behavior->
         */
        behavior?: { allowSlidersSwap?: boolean, animationEnabled?: boolean, callValueChanged?: 'onMoving' | 'onMovingComplete', manualRangeSelectionEnabled?: boolean, moveSelectedRangeByClick?: boolean, snapToTicks?: boolean };
        /**
         * <-dxRangeSelector.Options.chart->
         */
        chart?: { barGroupPadding?: number, barGroupWidth?: number, bottomIndent?: number, commonSeriesSettings?: dxChartCommonSeriesSettings, dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) }, maxBubbleSize?: number, minBubbleSize?: number, negativesAsZeroes?: boolean, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', series?: ChartSeries | Array<ChartSeries>, seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string }, topIndent?: number, valueAxis?: { inverted?: boolean, logarithmBase?: number, max?: number, min?: number, type?: 'continuous' | 'logarithmic', valueType?: 'datetime' | 'numeric' | 'string' } };
        /**
         * <-dxRangeSelector.Options.containerBackgroundColor->
         */
        containerBackgroundColor?: string;
        /**
         * <-dxRangeSelector.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-dxRangeSelector.Options.dataSourceField->
         */
        dataSourceField?: string;
        /**
         * <-dxRangeSelector.Options.indent->
         */
        indent?: { left?: number, right?: number };
        /**
         * <-dxRangeSelector.Options.onValueChanged->
         */
        onValueChanged?: ((e: { component?: dxRangeSelector, element?: DevExpress.core.dxElement, model?: any, value?: Array<number | string | Date>, previousValue?: Array<number | string | Date>, event?: DevExpress.events.event }) => any);
        /**
         * <-dxRangeSelector.Options.scale->
         */
        scale?: { aggregateByCategory?: boolean, aggregationGroupWidth?: number, aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', allowDecimals?: boolean, breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number }, breaks?: Array<ScaleBreak>, categories?: Array<number | string | Date>, endOnTick?: boolean, endValue?: number | Date | string, holidays?: Array<Date | string> | Array<number>, label?: { customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, overlappingBehavior?: 'hide' | 'none', topIndent?: number, visible?: boolean }, linearThreshold?: number, logarithmBase?: number, marker?: { label?: { customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string), format?: DevExpress.ui.format }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }, maxRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minorTick?: { color?: string, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number, minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', placeholderHeight?: number, showCustomBoundaryTicks?: boolean, singleWorkdays?: Array<Date | string> | Array<number>, startValue?: number | Date | string, tick?: { color?: string, opacity?: number, width?: number }, tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete', valueType?: 'datetime' | 'numeric' | 'string', workWeek?: Array<number>, workdaysOnly?: boolean };
        /**
         * <-dxRangeSelector.Options.selectedRangeColor->
         */
        selectedRangeColor?: string;
        /**
         * <-dxRangeSelector.Options.selectedRangeUpdateMode->
         */
        selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * <-dxRangeSelector.Options.shutter->
         */
        shutter?: { color?: string, opacity?: number };
        /**
         * <-dxRangeSelector.Options.sliderHandle->
         */
        sliderHandle?: { color?: string, opacity?: number, width?: number };
        /**
         * <-dxRangeSelector.Options.sliderMarker->
         */
        sliderMarker?: { color?: string, customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, invalidRangeColor?: string, paddingLeftRight?: number, paddingTopBottom?: number, placeholderHeight?: number, visible?: boolean };
        /**
         * <-dxRangeSelector.Options.value->
         */
        value?: Array<number | string | Date> | VizRange;
    }
    /**
     * <-dxRangeSelector->
     */
    export class dxRangeSelector extends BaseWidget {
        constructor(element: Element, options?: dxRangeSelectorOptions)
        constructor(element: JQuery, options?: dxRangeSelectorOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxRangeSelector.getValue()->
         */
        getValue(): Array<number | string | Date>;
        /**
         * <-BaseWidget.render()->
         */
        render(): void;
        /**
         * <-dxRangeSelector.render(skipChartAnimation)->
         */
        render(skipChartAnimation: boolean): void;
        /**
         * <-dxRangeSelector.setValue(value)->
         */
        setValue(value: Array<number | string | Date> | VizRange): void;
    }
    /**
     * <-dxSankey.Options->
     */
    export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
        /**
         * <-dxSankey.Options.adaptiveLayout->
         */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /**
         * <-dxSankey.Options.alignment->
         */
        alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
        /**
         * <-dxSankey.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-dxSankey.Options.hoverEnabled->
         */
        hoverEnabled?: boolean;
        /**
         * <-dxSankey.Options.label->
         */
        label?: { border?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: 'ellipsis' | 'hide' | 'none', shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean };
        /**
         * <-dxSankey.Options.link->
         */
        link?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: 'none' | 'source' | 'target' | 'gradient', hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number };
        /**
         * <-dxSankey.Options.node->
         */
        node?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number };
        /**
         * <-dxSankey.Options.onLinkClick->
         */
        onLinkClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: dxSankeyLink }) => any) | string;
        /**
         * <-dxSankey.Options.onLinkHoverChanged->
         */
        onLinkHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyLink }) => any);
        /**
         * <-dxSankey.Options.onNodeClick->
         */
        onNodeClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: dxSankeyNode }) => any) | string;
        /**
         * <-dxSankey.Options.onNodeHoverChanged->
         */
        onNodeHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyNode }) => any);
        /**
         * <-dxSankey.Options.palette->
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * <-dxSankey.Options.paletteExtensionMode->
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * <-dxSankey.Options.sortData->
         */
        sortData?: any;
        /**
         * <-dxSankey.Options.sourceField->
         */
        sourceField?: string;
        /**
         * <-dxSankey.Options.targetField->
         */
        targetField?: string;
        /**
         * <-dxSankey.Options.tooltip->
         */
        tooltip?: dxSankeyTooltip;
        /**
         * <-dxSankey.Options.weightField->
         */
        weightField?: string;
    }
    /**
     * <-dxSankey.Options.tooltip->
     */
    export interface dxSankeyTooltip extends BaseWidgetTooltip {
        /**
         * <-dxSankey.Options.tooltip.customizeLinkTooltip->
         */
        customizeLinkTooltip?: ((info: { source?: string, target?: string, weight?: number }) => any);
        /**
         * <-dxSankey.Options.tooltip.customizeNodeTooltip->
         */
        customizeNodeTooltip?: ((info: { title?: string, label?: string, weightIn?: number, weightOut?: number }) => any);
        /**
         * <-dxSankey.Options.tooltip.enabled->
         */
        enabled?: boolean;
        /**
         * <-dxSankey.Options.tooltip.linkTooltipTemplate->
         */
        linkTooltipTemplate?: DevExpress.core.template | ((info: { source?: string, target?: string, weight?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxSankey.Options.tooltip.nodeTooltipTemplate->
         */
        nodeTooltipTemplate?: DevExpress.core.template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-dxSankey->
     */
    export class dxSankey extends BaseWidget {
        constructor(element: Element, options?: dxSankeyOptions)
        constructor(element: JQuery, options?: dxSankeyOptions)
        /**
         * <-dxSankey.getAllLinks()->
         */
        getAllLinks(): Array<dxSankeyLink>;
        /**
         * <-dxSankey.getAllNodes()->
         */
        getAllNodes(): Array<dxSankeyNode>;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxSankey.hideTooltip()->
         */
        hideTooltip(): void;
    }
    /**
     * <-dxSankeyConnectionInfoObject->
     */
    export interface dxSankeyConnectionInfoObject {
        /**
         * <-dxSankeyConnectionInfoObject.source->
         */
        source?: string;
        /**
         * <-dxSankeyConnectionInfoObject.target->
         */
        target?: string;
        /**
         * <-dxSankeyConnectionInfoObject.weight->
         */
        weight?: number;
    }
    /**
     * <-dxSankeyLink->
     */
    export class dxSankeyLink {
        /**
         * <-dxSankeyLink.connection->
         */
        connection?: dxSankeyConnectionInfoObject;
        /**
         * <-dxSankeyLink.hideTooltip()->
         */
        hideTooltip(): void;
        /**
         * <-dxSankeyLink.hover(state)->
         */
        hover(state: boolean): void;
        /**
         * <-dxSankeyLink.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-dxSankeyLink.showTooltip()->
         */
        showTooltip(): void;
    }
    /**
     * <-dxSankeyNode->
     */
    export class dxSankeyNode {
        /**
         * <-dxSankeyNode.label->
         */
        label?: string;
        /**
         * <-dxSankeyNode.linksIn->
         */
        linksIn?: Array<any>;
        /**
         * <-dxSankeyNode.linksOut->
         */
        linksOut?: Array<any>;
        /**
         * <-dxSankeyNode.title->
         * @deprecated <-dxSankeyNode.title:depNote->
         */
        title?: string;
        /**
         * <-dxSankeyNode.hideTooltip()->
         */
        hideTooltip(): void;
        /**
         * <-dxSankeyNode.hover(state)->
         */
        hover(state: boolean): void;
        /**
         * <-dxSankeyNode.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-dxSankeyNode.showTooltip()->
         */
        showTooltip(): void;
    }
    /**
     * <-dxSparkline.Options->
     */
    export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
        /**
         * <-dxSparkline.Options.argumentField->
         */
        argumentField?: string;
        /**
         * <-dxSparkline.Options.barNegativeColor->
         */
        barNegativeColor?: string;
        /**
         * <-dxSparkline.Options.barPositiveColor->
         */
        barPositiveColor?: string;
        /**
         * <-dxSparkline.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-dxSparkline.Options.firstLastColor->
         */
        firstLastColor?: string;
        /**
         * <-dxSparkline.Options.ignoreEmptyPoints->
         */
        ignoreEmptyPoints?: boolean;
        /**
         * <-dxSparkline.Options.lineColor->
         */
        lineColor?: string;
        /**
         * <-dxSparkline.Options.lineWidth->
         */
        lineWidth?: number;
        /**
         * <-dxSparkline.Options.lossColor->
         */
        lossColor?: string;
        /**
         * <-dxSparkline.Options.maxColor->
         */
        maxColor?: string;
        /**
         * <-dxSparkline.Options.maxValue->
         */
        maxValue?: number;
        /**
         * <-dxSparkline.Options.minColor->
         */
        minColor?: string;
        /**
         * <-dxSparkline.Options.minValue->
         */
        minValue?: number;
        /**
         * <-dxSparkline.Options.pointColor->
         */
        pointColor?: string;
        /**
         * <-dxSparkline.Options.pointSize->
         */
        pointSize?: number;
        /**
         * <-dxSparkline.Options.pointSymbol->
         */
        pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /**
         * <-dxSparkline.Options.showFirstLast->
         */
        showFirstLast?: boolean;
        /**
         * <-dxSparkline.Options.showMinMax->
         */
        showMinMax?: boolean;
        /**
         * <-dxSparkline.Options.type->
         */
        type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
        /**
         * <-dxSparkline.Options.valueField->
         */
        valueField?: string;
        /**
         * <-dxSparkline.Options.winColor->
         */
        winColor?: string;
        /**
         * <-dxSparkline.Options.winlossThreshold->
         */
        winlossThreshold?: number;
    }
    /**
     * <-dxSparkline->
     */
    export class dxSparkline extends BaseSparkline {
        constructor(element: Element, options?: dxSparklineOptions)
        constructor(element: JQuery, options?: dxSparklineOptions)
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * <-dxTreeMap.Options->
     */
    export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
        /**
         * <-dxTreeMap.Options.childrenField->
         */
        childrenField?: string;
        /**
         * <-dxTreeMap.Options.colorField->
         */
        colorField?: string;
        /**
         * <-dxTreeMap.Options.colorizer->
         */
        colorizer?: { colorCodeField?: string, colorizeGroups?: boolean, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', range?: Array<number>, type?: 'discrete' | 'gradient' | 'none' | 'range' };
        /**
         * <-dxTreeMap.Options.dataSource->
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * <-dxTreeMap.Options.group->
         */
        group?: { border?: { color?: string, width?: number }, color?: string, headerHeight?: number, hoverEnabled?: boolean, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /**
         * <-dxTreeMap.Options.hoverEnabled->
         */
        hoverEnabled?: boolean;
        /**
         * <-dxTreeMap.Options.idField->
         */
        idField?: string;
        /**
         * <-dxTreeMap.Options.interactWithGroup->
         */
        interactWithGroup?: boolean;
        /**
         * <-dxTreeMap.Options.labelField->
         */
        labelField?: string;
        /**
         * <-dxTreeMap.Options.layoutAlgorithm->
         */
        layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
        /**
         * <-dxTreeMap.Options.layoutDirection->
         */
        layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
        /**
         * <-dxTreeMap.Options.maxDepth->
         */
        maxDepth?: number;
        /**
         * <-dxTreeMap.Options.onClick->
         */
        onClick?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, node?: dxTreeMapNode }) => any) | string;
        /**
         * <-dxTreeMap.Options.onDrill->
         */
        onDrill?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * <-dxTreeMap.Options.onHoverChanged->
         */
        onHoverChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * <-dxTreeMap.Options.onNodesInitialized->
         */
        onNodesInitialized?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeMapNode }) => any);
        /**
         * <-dxTreeMap.Options.onNodesRendering->
         */
        onNodesRendering?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * <-dxTreeMap.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * <-dxTreeMap.Options.parentField->
         */
        parentField?: string;
        /**
         * <-dxTreeMap.Options.selectionMode->
         */
        selectionMode?: 'multiple' | 'none' | 'single';
        /**
         * <-dxTreeMap.Options.tile->
         */
        tile?: { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /**
         * <-dxTreeMap.Options.tooltip->
         */
        tooltip?: dxTreeMapTooltip;
        /**
         * <-dxTreeMap.Options.valueField->
         */
        valueField?: string;
    }
    /**
     * <-dxTreeMap.Options.tooltip->
     */
    export interface dxTreeMapTooltip extends BaseWidgetTooltip {
        /**
         * <-dxTreeMap.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxTreeMap.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
    }
    /**
     * <-dxTreeMap->
     */
    export class dxTreeMap extends BaseWidget {
        constructor(element: Element, options?: dxTreeMapOptions)
        constructor(element: JQuery, options?: dxTreeMapOptions)
        /**
         * <-dxTreeMap.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-dxTreeMap.drillUp()->
         */
        drillUp(): void;
        /**
         * <-dxTreeMap.getCurrentNode()->
         */
        getCurrentNode(): dxTreeMapNode;
        /**
         * <-DataHelperMixin.getDataSource()->
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * <-dxTreeMap.getRootNode()->
         */
        getRootNode(): dxTreeMapNode;
        /**
         * <-dxTreeMap.hideTooltip()->
         */
        hideTooltip(): void;
        /**
         * <-dxTreeMap.resetDrillDown()->
         */
        resetDrillDown(): void;
    }
    /**
     * <-dxTreeMapNode->
     */
    export class dxTreeMapNode {
        /**
         * <-dxTreeMapNode.data->
         */
        data?: any;
        /**
         * <-dxTreeMapNode.index->
         */
        index?: number;
        /**
         * <-dxTreeMapNode.level->
         */
        level?: number;
        /**
         * <-dxTreeMapNode.customize(options)->
         */
        customize(options: any): void;
        /**
         * <-dxTreeMapNode.drillDown()->
         */
        drillDown(): void;
        /**
         * <-dxTreeMapNode.getAllChildren()->
         */
        getAllChildren(): Array<dxTreeMapNode>;
        /**
         * <-dxTreeMapNode.getAllNodes()->
         */
        getAllNodes(): Array<dxTreeMapNode>;
        /**
         * <-dxTreeMapNode.getChild(index)->
         */
        getChild(index: number): dxTreeMapNode;
        /**
         * <-dxTreeMapNode.getChildrenCount()->
         */
        getChildrenCount(): number;
        /**
         * <-dxTreeMapNode.getParent()->
         */
        getParent(): dxTreeMapNode;
        /**
         * <-dxTreeMapNode.isActive()->
         */
        isActive(): boolean;
        /**
         * <-dxTreeMapNode.isHovered()->
         */
        isHovered(): boolean;
        /**
         * <-dxTreeMapNode.isLeaf()->
         */
        isLeaf(): boolean;
        /**
         * <-dxTreeMapNode.isSelected()->
         */
        isSelected(): boolean;
        /**
         * <-dxTreeMapNode.label()->
         */
        label(): string;
        /**
         * <-dxTreeMapNode.label(label)->
         */
        label(label: string): void;
        /**
         * <-dxTreeMapNode.resetCustomization()->
         */
        resetCustomization(): void;
        /**
         * <-dxTreeMapNode.select(state)->
         */
        select(state: boolean): void;
        /**
         * <-dxTreeMapNode.showTooltip()->
         */
        showTooltip(): void;
        /**
         * <-dxTreeMapNode.value()->
         */
        value(): number;
    }
    /**
     * <-dxVectorMap.Options->
     */
    export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
        /**
         * <-dxVectorMap.Options.annotations->
         */
        annotations?: Array<dxVectorMapAnnotationConfig | any>;
        /**
         * <-dxVectorMap.Options.background->
         */
        background?: { borderColor?: string, color?: string };
        /**
         * <-dxVectorMap.Options.bounds->
         */
        bounds?: Array<number>;
        /**
         * <-dxVectorMap.Options.center->
         */
        center?: Array<number>;
        /**
         * <-dxVectorMap.Options.commonAnnotationSettings->
         */
        commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
        /**
         * <-dxVectorMap.Options.controlBar->
         */
        controlBar?: { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: 'center' | 'left' | 'right', margin?: number, opacity?: number, verticalAlignment?: 'bottom' | 'top' };
        /**
         * <-dxVectorMap.Options.customizeAnnotation->
         */
        customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig);
        /**
         * <-dxVectorMap.Options.layers->
         */
        layers?: Array<{ borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string | Array<any>, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' }> | { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string | Array<any>, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' };
        /**
         * <-dxVectorMap.Options.legends->
         */
        legends?: Array<dxVectorMapLegends>;
        /**
         * <-dxVectorMap.Options.maxZoomFactor->
         */
        maxZoomFactor?: number;
        /**
         * <-dxVectorMap.Options.onCenterChanged->
         */
        onCenterChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, center?: Array<number> }) => any);
        /**
         * <-dxVectorMap.Options.onClick->
         */
        onClick?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: MapLayerElement }) => any) | string;
        /**
         * <-dxVectorMap.Options.onSelectionChanged->
         */
        onSelectionChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /**
         * <-dxVectorMap.Options.onTooltipHidden->
         */
        onTooltipHidden?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement | dxVectorMapAnnotationConfig }) => any);
        /**
         * <-dxVectorMap.Options.onTooltipShown->
         */
        onTooltipShown?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement | dxVectorMapAnnotationConfig }) => any);
        /**
         * <-dxVectorMap.Options.onZoomFactorChanged->
         */
        onZoomFactorChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, zoomFactor?: number }) => any);
        /**
         * <-dxVectorMap.Options.panningEnabled->
         */
        panningEnabled?: boolean;
        /**
         * <-dxVectorMap.Options.projection->
         */
        projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
        /**
         * <-dxVectorMap.Options.tooltip->
         */
        tooltip?: dxVectorMapTooltip;
        /**
         * <-dxVectorMap.Options.touchEnabled->
         */
        touchEnabled?: boolean;
        /**
         * <-dxVectorMap.Options.wheelEnabled->
         */
        wheelEnabled?: boolean;
        /**
         * <-dxVectorMap.Options.zoomFactor->
         */
        zoomFactor?: number;
        /**
         * <-dxVectorMap.Options.zoomingEnabled->
         */
        zoomingEnabled?: boolean;
    }
    /**
     * <-dxVectorMap.Options.legends->
     */
    export interface dxVectorMapLegends extends BaseLegend {
        /**
         * <-dxVectorMap.Options.legends.customizeHint->
         */
        customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /**
         * <-dxVectorMap.Options.legends.customizeItems->
         */
        customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
        /**
         * <-dxVectorMap.Options.legends.customizeText->
         */
        customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /**
         * <-dxVectorMap.Options.legends.font->
         */
        font?: Font;
        /**
         * <-dxVectorMap.Options.legends.markerColor->
         */
        markerColor?: string;
        /**
         * <-dxVectorMap.Options.legends.markerShape->
         */
        markerShape?: 'circle' | 'square';
        /**
         * <-dxVectorMap.Options.legends.markerSize->
         */
        markerSize?: number;
        /**
         * <-dxVectorMap.Options.legends.markerTemplate->
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxVectorMap.Options.legends.source->
         */
        source?: { grouping?: string, layer?: string };
    }
    /**
     * <-dxVectorMap.Options.tooltip->
     */
    export interface dxVectorMapTooltip extends BaseWidgetTooltip {
        /**
         * <-dxVectorMap.Options.tooltip.contentTemplate->
         */
        contentTemplate?: DevExpress.core.template | ((info: MapLayerElement, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * <-dxVectorMap.Options.tooltip.customizeTooltip->
         */
        customizeTooltip?: ((info: MapLayerElement) => any);
    }
    /**
     * <-dxVectorMap->
     */
    export class dxVectorMap extends BaseWidget {
        constructor(element: Element, options?: dxVectorMapOptions)
        constructor(element: JQuery, options?: dxVectorMapOptions)
        /**
         * <-dxVectorMap.center()->
         */
        center(): Array<number>;
        /**
         * <-dxVectorMap.center(centerCoordinates)->
         */
        center(centerCoordinates: Array<number>): void;
        /**
         * <-dxVectorMap.clearSelection()->
         */
        clearSelection(): void;
        /**
         * <-dxVectorMap.convertCoordinates(x, y)->
         * @deprecated <-dxVectorMap.convertCoordinates(x, y):depNote->
         */
        convertCoordinates(x: number, y: number): Array<number>;
        /**
         * <-dxVectorMap.convertToGeo(x, y)->
         */
        convertToGeo(x: number, y: number): Array<number>;
        /**
         * <-dxVectorMap.convertToXY(longitude, latitude)->
         */
        convertToXY(longitude: number, latitude: number): Array<number>;
        /**
         * <-dxVectorMap.getLayerByIndex(index)->
         */
        getLayerByIndex(index: number): MapLayer;
        /**
         * <-dxVectorMap.getLayerByName(name)->
         */
        getLayerByName(name: string): MapLayer;
        /**
         * <-dxVectorMap.getLayers()->
         */
        getLayers(): Array<MapLayer>;
        /**
         * <-dxVectorMap.viewport()->
         */
        viewport(): Array<number>;
        /**
         * <-dxVectorMap.viewport(viewportCoordinates)->
         */
        viewport(viewportCoordinates: Array<number>): void;
        /**
         * <-dxVectorMap.zoomFactor()->
         */
        zoomFactor(): number;
        /**
         * <-dxVectorMap.zoomFactor(zoomFactor)->
         */
        zoomFactor(zoomFactor: number): void;
    }
    /**
     * <-dxVectorMapAnnotationConfig->
     */
    export interface dxVectorMapAnnotationConfig extends dxVectorMapCommonAnnotationConfig {
        /**
         * <-dxVectorMapAnnotationConfig.name->
         */
        name?: string;
    }
    /**
     * <-dxVectorMapCommonAnnotationConfig->
     */
    export interface dxVectorMapCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * <-dxVectorMapCommonAnnotationConfig.coordinates->
         */
        coordinates?: Array<number>;
        /**
         * <-dxVectorMapCommonAnnotationConfig.customizeTooltip->
         */
        customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any);
        /**
         * <-dxVectorMapCommonAnnotationConfig.template->
         */
        template?: DevExpress.core.template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * <-dxVectorMapCommonAnnotationConfig.tooltipTemplate->
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxVectorMapAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * <-linearCircle->
     */
    export type linearCircle = CommonIndicator;
    /**
     * <-linearRangeBar->
     */
    export type linearRangeBar = CommonIndicator;
    /**
     * <-linearRectangle->
     */
    export type linearRectangle = CommonIndicator;
    /**
     * <-linearRhombus->
     */
    export type linearRhombus = CommonIndicator;
    /**
     * <-linearTextCloud->
     */
    export type linearTextCloud = CommonIndicator;
    /**
     * <-linearTriangleMarker->
     */
    export type linearTriangleMarker = CommonIndicator;
    /**
     * <-pieChartSeriesObject->
     */
    export class pieChartSeriesObject extends baseSeriesObject {
    }
    /**
     * <-piePointObject->
     */
    export class piePointObject extends basePointObject {
        /**
         * <-piePointObject.percent->
         */
        percent?: string | number | Date;
        /**
         * <-piePointObject.hide()->
         */
        hide(): void;
        /**
         * <-piePointObject.isVisible()->
         */
        isVisible(): boolean;
        /**
         * <-piePointObject.show()->
         */
        show(): void;
    }
    /**
     * <-polarChartSeriesObject->
     */
    export class polarChartSeriesObject extends baseSeriesObject {
    }
    /**
     * <-polarPointObject->
     */
    export class polarPointObject extends basePointObject {
    }
}
declare module DevExpress.viz.map {
    /**
     * <-viz.map.projection(data)->
     */
    export function projection(data: VectorMapProjectionConfig): any;
}
declare module DevExpress.viz.map.projection {
    /**
     * <-viz.map.projection.add(name, projection)->
     */
    export function add(name: string, projection: VectorMapProjectionConfig | any): void;
    /**
     * <-viz.map.projection.get(name)->
     */
    export function get(name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string): any;
}
