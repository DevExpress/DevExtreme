/* #StartGlobalDeclaration */
interface JQuery {
}
interface JQueryPromise<T> {
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
    /**
     * [descr:Component.Options]
     */
    export interface ComponentOptions<T = Component> {
        /**
         * [descr:Component.Options.onDisposing]
         */
        onDisposing?: ((e: { component?: T }) => any);
        /**
         * [descr:Component.Options.onInitialized]
         */
        onInitialized?: ((e: { component?: T, element?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:Component.Options.onOptionChanged]
         */
        onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => any);
    }
    /**
     * [descr:Component]
     */
    export class Component {
        constructor(options?: ComponentOptions);
        /**
         * [descr:Component.beginUpdate()]
         */
        beginUpdate(): void;
        /**
         * [descr:Component.endUpdate()]
         */
        endUpdate(): void;
        /**
         * [descr:Component.instance()]
         */
        instance(): this;
        /**
         * [descr:Component.off(eventName)]
         */
        off(eventName: string): this;
        /**
         * [descr:Component.off(eventName, eventHandler)]
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * [descr:Component.on(eventName, eventHandler)]
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * [descr:Component.on(events)]
         */
        on(events: any): this;
        /**
         * [descr:Component.option()]
         */
        option(): any;
        /**
         * [descr:Component.option(optionName)]
         */
        option(optionName: string): any;
        /**
         * [descr:Component.option(optionName, optionValue)]
         */
        option(optionName: string, optionValue: any): void;
        /**
         * [descr:Component.option(options)]
         */
        option(options: any): void;
        /**
         * [descr:Component.resetOption(optionName)]
         */
        resetOption(optionName: string): void;
    }
    /**
     * [descr:DOMComponent.Options]
     */
    export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
        /**
         * [descr:DOMComponent.Options.bindingOptions]
         */
        bindingOptions?: any;
        /**
         * [descr:DOMComponent.Options.elementAttr]
         */
        elementAttr?: any;
        /**
         * [descr:DOMComponent.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:DOMComponent.Options.onDisposing]
         */
        onDisposing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:DOMComponent.Options.onOptionChanged]
         */
        onOptionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, name?: string, fullName?: string, value?: any }) => any);
        /**
         * [descr:DOMComponent.Options.rtlEnabled]
         */
        rtlEnabled?: boolean;
        /**
         * [descr:DOMComponent.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:DOMComponent]
     */
    export class DOMComponent extends Component {
        constructor(element: Element | JQuery, options?: DOMComponentOptions);
        /**
         * [descr:DOMComponent.defaultOptions(rule)]
         */
        static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
        /**
         * [descr:DOMComponent.dispose()]
         */
        dispose(): void;
        /**
         * [descr:DOMComponent.element()]
         */
        element(): DevExpress.core.dxElement;
        /**
         * [descr:DOMComponent.getInstance(element)]
         */
        static getInstance(element: Element | JQuery): DOMComponent;
    }
    /**
     * [descr:DataHelperMixin]
     */
    export class DataHelperMixin {
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:Device]
     */
    export interface Device {
        /**
         * [descr:Device.android]
         */
        android?: boolean;
        /**
         * [descr:Device.deviceType]
         */
        deviceType?: 'phone' | 'tablet' | 'desktop';
        /**
         * [descr:Device.generic]
         */
        generic?: boolean;
        /**
         * [descr:Device.grade]
         */
        grade?: 'A' | 'B' | 'C';
        /**
         * [descr:Device.ios]
         */
        ios?: boolean;
        /**
         * [descr:Device.phone]
         */
        phone?: boolean;
        /**
         * [descr:Device.platform]
         */
        platform?: 'android' | 'ios' | 'generic';
        /**
         * [descr:Device.tablet]
         */
        tablet?: boolean;
        /**
         * [descr:Device.version]
         */
        version?: Array<number>;
    }
    /**
     * [descr:DevicesObject]
     */
    export class DevicesObject {
        constructor(options: { window?: Window });
        /**
         * [descr:DevicesObject.current()]
         */
        current(): Device;
        /**
         * [descr:DevicesObject.current(deviceName)]
         */
        current(deviceName: string | Device): void;
        /**
         * [descr:DevicesObject.off(eventName)]
         */
        off(eventName: string): this;
        /**
         * [descr:DevicesObject.off(eventName, eventHandler)]
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * [descr:DevicesObject.on(eventName, eventHandler)]
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * [descr:DevicesObject.on(events)]
         */
        on(events: any): this;
        /**
         * [descr:DevicesObject.orientation()]
         */
        orientation(): string;
        /**
         * [descr:DevicesObject.real()]
         */
        real(): Device;
    }
    /**
     * [descr:EndpointSelector]
     */
    export class EndpointSelector {
        constructor(options: any);
        /**
         * [descr:EndpointSelector.urlFor(key)]
         */
        urlFor(key: string): string;
    }
    /**
     * [descr:TransitionExecutor]
     */
    export class TransitionExecutor {
        /**
         * [descr:TransitionExecutor.enter(elements, animation)]
         */
        enter(elements: JQuery, animation: animationConfig | string): void;
        /**
         * [descr:TransitionExecutor.leave(elements, animation)]
         */
        leave(elements: JQuery, animation: animationConfig | string): void;
        /**
         * [descr:TransitionExecutor.reset()]
         */
        reset(): void;
        /**
         * [descr:TransitionExecutor.start()]
         */
        start(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:TransitionExecutor.stop()]
         */
        stop(): void;
    }
    /**
     * [descr:animationConfig]
     */
    export interface animationConfig {
        /**
         * [descr:animationConfig.complete]
         */
        complete?: (($element: DevExpress.core.dxElement, config: any) => any);
        /**
         * [descr:animationConfig.delay]
         */
        delay?: number;
        /**
         * [descr:animationConfig.direction]
         */
        direction?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * [descr:animationConfig.duration]
         */
        duration?: number;
        /**
         * [descr:animationConfig.easing]
         */
        easing?: string;
        /**
         * [descr:animationConfig.from]
         */
        from?: number | string | any;
        /**
         * [descr:animationConfig.staggerDelay]
         */
        staggerDelay?: number;
        /**
         * [descr:animationConfig.start]
         */
        start?: (($element: DevExpress.core.dxElement, config: any) => any);
        /**
         * [descr:animationConfig.to]
         */
        to?: number | string | any;
        /**
         * [descr:animationConfig.type]
         */
        type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
    }
    /**
     * [descr:animationPresets]
     */
    export class animationPresets {
        /**
         * [descr:animationPresets.applyChanges()]
         */
        applyChanges(): void;
        /**
         * [descr:animationPresets.clear()]
         */
        clear(): void;
        /**
         * [descr:animationPresets.clear(name)]
         */
        clear(name: string): void;
        /**
         * [descr:animationPresets.getPreset(name)]
         */
        getPreset(name: string): any;
        /**
         * [descr:animationPresets.registerDefaultPresets()]
         */
        registerDefaultPresets(): void;
        /**
         * [descr:animationPresets.registerPreset(name, config)]
         */
        registerPreset(name: string, config: { animation?: animationConfig, device?: Device }): void;
        /**
         * [descr:animationPresets.resetToDefaults()]
         */
        resetToDefaults(): void;
    }
    /**
     * [descr:config()]
     */
    export function config(): globalConfig;
    /**
     * [descr:config(config)]
     */
    export function config(config: globalConfig): void;
    /**
     * [descr:devices]
     */
    export var devices: DevicesObject;
    /**
     * [descr:dxSchedulerTimeZone]
     */
    export interface dxSchedulerTimeZone {
        /**
         * [descr:dxSchedulerTimeZone.id]
         */
        id: string;
        /**
         * [descr:dxSchedulerTimeZone.offset]
         */
        offset: number;
        /**
         * [descr:dxSchedulerTimeZone.title]
         */
        title: string;
    }
    /**
     * [descr:globalConfig]
     */
    export interface globalConfig {
        /**
         * [descr:globalConfig.decimalSeparator]
         * @deprecated [depNote:globalConfig.decimalSeparator]
         */
        decimalSeparator?: string;
        /**
         * [descr:globalConfig.defaultCurrency]
         */
        defaultCurrency?: string;
        /**
         * [descr:globalConfig.editorStylingMode]
         */
        editorStylingMode?: 'outlined' | 'underlined' | 'filled';
        /**
         * [descr:globalConfig.floatingActionButtonConfig]
         */
        floatingActionButtonConfig?: { closeIcon?: string, direction?: 'auto' | 'up' | 'down', icon?: string, label?: string, maxSpeedDialActionCount?: number, position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function, shading?: boolean };
        /**
         * [descr:globalConfig.forceIsoDateParsing]
         */
        forceIsoDateParsing?: boolean;
        /**
         * [descr:globalConfig.oDataFilterToLower]
         */
        oDataFilterToLower?: boolean;
        /**
         * [descr:globalConfig.rtlEnabled]
         */
        rtlEnabled?: boolean;
        /**
         * [descr:globalConfig.serverDecimalSeparator]
         */
        serverDecimalSeparator?: string;
        /**
         * [descr:globalConfig.thousandsSeparator]
         * @deprecated [depNote:globalConfig.thousandsSeparator]
         */
        thousandsSeparator?: string;
        /**
         * [descr:globalConfig.useLegacyStoreResult]
         */
        useLegacyStoreResult?: boolean;
        /**
         * [descr:globalConfig.useLegacyVisibleIndex]
         */
        useLegacyVisibleIndex?: boolean;
    }
    /**
     * [descr:hideTopOverlay()]
     */
    export function hideTopOverlay(): boolean;
    /**
     * [descr:localization]
     */
    export class localization {
        /**
         * [descr:localization.formatDate(value, format)]
         */
        static formatDate(value: Date, format: DevExpress.ui.format): string;
        /**
         * [descr:localization.formatMessage(key, value)]
         */
        static formatMessage(key: string, value: string | Array<string>): string;
        /**
         * [descr:localization.formatNumber(value, format)]
         */
        static formatNumber(value: number, format: DevExpress.ui.format): string;
        /**
         * [descr:localization.loadMessages(messages)]
         */
        static loadMessages(messages: any): void;
        /**
         * [descr:localization.locale()]
         */
        static locale(): string;
        /**
         * [descr:localization.locale(locale)]
         */
        static locale(locale: string): void;
        /**
         * [descr:localization.parseDate(text, format)]
         */
        static parseDate(text: string, format: DevExpress.ui.format): Date;
        /**
         * [descr:localization.parseNumber(text, format)]
         */
        static parseNumber(text: string, format: DevExpress.ui.format): number;
    }
    /**
     * [descr:positionConfig]
     */
    export interface positionConfig {
        /**
         * [descr:positionConfig.at]
         */
        at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /**
         * [descr:positionConfig.boundary]
         */
        boundary?: string | Element | JQuery | Window;
        /**
         * [descr:positionConfig.boundaryOffset]
         */
        boundaryOffset?: string | { x?: number, y?: number };
        /**
         * [descr:positionConfig.collision]
         */
        collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | { x?: 'fit' | 'flip' | 'flipfit' | 'none', y?: 'fit' | 'flip' | 'flipfit' | 'none' };
        /**
         * [descr:positionConfig.my]
         */
        my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /**
         * [descr:positionConfig.of]
         */
        of?: string | Element | JQuery | Window;
        /**
         * [descr:positionConfig.offset]
         */
        offset?: string | { x?: number, y?: number };
    }
    /**
     * [descr:registerComponent(name, componentClass)]
     */
    export function registerComponent(name: string, componentClass: any): void;
    /**
     * [descr:registerComponent(name, namespace, componentClass)]
     */
    export function registerComponent(name: string, namespace: any, componentClass: any): void;
    /**
     * [descr:setTemplateEngine(name)]
     */
    export function setTemplateEngine(templateEngineName: string): void;
    /**
     * [descr:setTemplateEngine(options)]
     */
    export function setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    /**
     * [descr:ui]
     */
    export class ui {
        /**
         * [descr:ui.notify(message,type,displayTime)]
         */
        static notify(message: string, type?: string, displayTime?: number): void;
        /**
         * [descr:ui.notify(options,type,displayTime)]
         */
        static notify(options: any, type?: string, displayTime?: number): void;
        /**
         * [descr:ui.repaintFloatingActionButton()]
         */
        static repaintFloatingActionButton(): void;
        /**
         * [descr:ui.setTemplateEngine(name)]
         */
        static setTemplateEngine(templateEngineName: string): void;
        /**
         * [descr:ui.setTemplateEngine(options)]
         */
        static setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    }
    /**
     * [descr:validationEngine]
     */
    export class validationEngine {
        /**
         * [descr:validationEngine.getGroupConfig()]
         */
        static getGroupConfig(): any;
        /**
         * [descr:validationEngine.getGroupConfig(group)]
         */
        static getGroupConfig(group: string | any): any;
        /**
         * [descr:validationEngine.registerModelForValidation(model)]
         */
        static registerModelForValidation(model: any): void;
        /**
         * [descr:validationEngine.resetGroup()]
         */
        static resetGroup(): void;
        /**
         * [descr:validationEngine.resetGroup(group)]
         */
        static resetGroup(group: string | any): void;
        /**
         * [descr:validationEngine.unregisterModelForValidation(model)]
         */
        static unregisterModelForValidation(model: any): void;
        /**
         * [descr:validationEngine.validateGroup()]
         */
        static validateGroup(): DevExpress.ui.dxValidationGroupResult;
        /**
         * [descr:validationEngine.validateGroup(group)]
         */
        static validateGroup(group: string | any): DevExpress.ui.dxValidationGroupResult;
        /**
         * [descr:validationEngine.validateModel(model)]
         */
        static validateModel(model: any): any;
    }
    /**
     * [descr:viz]
     */
    export class viz {
        /**
         * [descr:viz.currentPalette()]
         */
        static currentPalette(): string;
        /**
         * [descr:viz.currentPalette(paletteName)]
         */
        static currentPalette(paletteName: string): void;
        /**
         * [descr:viz.currentTheme()]
         */
        static currentTheme(): string;
        /**
         * [descr:viz.currentTheme(platform, colorScheme)]
         */
        static currentTheme(platform: string, colorScheme: string): void;
        /**
         * [descr:viz.currentTheme(theme)]
         */
        static currentTheme(theme: string): void;
        /**
         * [descr:viz.exportFromMarkup(markup, options)]
         */
        static exportFromMarkup(markup: string, options: { fileName?: string, format?: string, backgroundColor?: string, proxyUrl?: string, width?: number, height?: number, onExporting?: Function, onExported?: Function, onFileSaving?: Function, margin?: number, svgToCanvas?: Function }): void;
        /**
         * [descr:viz.exportWidgets(widgetInstances)]
         */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>): void;
        /**
         * [descr:viz.exportWidgets(widgetInstances, options)]
         */
        static exportWidgets(widgetInstances: Array<Array<DOMComponent>>, options: { fileName?: string, format?: 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG', backgroundColor?: string, margin?: number, gridLayout?: boolean, verticalAlignment?: 'bottom' | 'center' | 'top', horizontalAlignment?: 'center' | 'left' | 'right', proxyUrl?: string, onExporting?: Function, onExported?: Function, onFileSaving?: Function, svgToCanvas?: Function }): void;
        /**
         * [descr:viz.generateColors(palette, count, options)]
         */
        static generateColors(palette: 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office' | Array<string>, count: number, options: { paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet' }): Array<string>;
        /**
         * [descr:viz.getMarkup(widgetInstances)]
         */
        static getMarkup(widgetInstances: Array<DOMComponent>): string;
        /**
         * [descr:viz.getPalette(paletteName)]
         */
        static getPalette(paletteName: string): any;
        /**
         * [descr:viz.getTheme(theme)]
         */
        static getTheme(theme: string): any;
        /**
         * [descr:viz.refreshPaths()]
         */
        static refreshPaths(): void;
        /**
         * [descr:viz.refreshTheme()]
         */
        static refreshTheme(): void;
        /**
         * [descr:viz.registerPalette(paletteName, palette)]
         */
        static registerPalette(paletteName: string, palette: any): void;
        /**
         * [descr:viz.registerTheme(customTheme, baseTheme)]
         */
        static registerTheme(customTheme: any, baseTheme: string): void;
    }
}
declare module DevExpress.core {
    /**
     * [descr:dxElement]
     */
    export type dxElement = HTMLElement & JQuery;
    /**
     * [descr:dxSVGElement]
     */
    export type dxSVGElement = SVGElement & JQuery;
    /**
     * [descr:dxTemplate.Options]
     */
    export interface dxTemplateOptions {
        /**
         * [descr:dxTemplate.Options.name]
         */
        name?: string;
    }
    /**
     * [descr:dxTemplate]
     */
    export class dxTemplate {
        constructor(options?: dxTemplateOptions)
    }
    /**
     * [descr:template]
     */
    export type template = string | Function | Element | JQuery;
}
declare module DevExpress.data {
    /**
     * [descr:ArrayStore.Options]
     */
    export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
        /**
         * [descr:ArrayStore.Options.data]
         */
        data?: Array<any>;
    }
    /**
     * [descr:ArrayStore]
     */
    export class ArrayStore extends Store {
        constructor(options?: ArrayStoreOptions)
        /**
         * [descr:ArrayStore.clear()]
         */
        clear(): void;
        /**
         * [descr:ArrayStore.createQuery()]
         */
        createQuery(): any;
    }
    /**
     * [descr:CustomStore.Options]
     */
    export interface CustomStoreOptions extends StoreOptions<CustomStore> {
        /**
         * [descr:CustomStore.Options.byKey]
         */
        byKey?: ((key: any | string | number) => Promise<any> | JQueryPromise<any>);
        /**
         * [descr:CustomStore.Options.cacheRawData]
         */
        cacheRawData?: boolean;
        /**
         * [descr:CustomStore.Options.insert]
         */
        insert?: ((values: any) => Promise<any> | JQueryPromise<any>);
        /**
         * [descr:CustomStore.Options.load]
         */
        load?: ((options: LoadOptions) => Promise<any> | JQueryPromise<any> | Array<any>);
        /**
         * [descr:CustomStore.Options.loadMode]
         */
        loadMode?: 'processed' | 'raw';
        /**
         * [descr:CustomStore.Options.remove]
         */
        remove?: ((key: any | string | number) => Promise<void> | JQueryPromise<void>);
        /**
         * [descr:CustomStore.Options.totalCount]
         */
        totalCount?: ((loadOptions: { filter?: any, group?: any }) => Promise<number> | JQueryPromise<number>);
        /**
         * [descr:CustomStore.Options.update]
         */
        update?: ((key: any | string | number, values: any) => Promise<any> | JQueryPromise<any>);
        /**
         * [descr:CustomStore.Options.useDefaultSearch]
         */
        useDefaultSearch?: boolean;
    }
    /**
     * [descr:CustomStore]
     */
    export class CustomStore extends Store {
        constructor(options?: CustomStoreOptions)
        /**
         * [descr:CustomStore.clearRawDataCache()]
         */
        clearRawDataCache(): void;
    }
    /**
     * [descr:DataSource.Options]
     */
    export interface DataSourceOptions {
        /**
         * [descr:DataSource.Options.customQueryParams]
         */
        customQueryParams?: any;
        /**
         * [descr:DataSource.Options.expand]
         */
        expand?: Array<string> | string;
        /**
         * [descr:DataSource.Options.filter]
         */
        filter?: string | Array<any> | Function;
        /**
         * [descr:DataSource.Options.group]
         */
        group?: string | Array<any> | Function;
        /**
         * [descr:DataSource.Options.map]
         */
        map?: ((dataItem: any) => any);
        /**
         * [descr:DataSource.Options.onChanged]
         */
        onChanged?: ((e: { changes?: Array<any> }) => any);
        /**
         * [descr:DataSource.Options.onLoadError]
         */
        onLoadError?: ((error: { message?: string }) => any);
        /**
         * [descr:DataSource.Options.onLoadingChanged]
         */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /**
         * [descr:DataSource.Options.pageSize]
         */
        pageSize?: number;
        /**
         * [descr:DataSource.Options.paginate]
         */
        paginate?: boolean;
        /**
         * [descr:DataSource.Options.postProcess]
         */
        postProcess?: ((data: Array<any>) => Array<any>);
        /**
         * [descr:DataSource.Options.pushAggregationTimeout]
         */
        pushAggregationTimeout?: number;
        /**
         * [descr:DataSource.Options.requireTotalCount]
         */
        requireTotalCount?: boolean;
        /**
         * [descr:DataSource.Options.reshapeOnPush]
         */
        reshapeOnPush?: boolean;
        /**
         * [descr:DataSource.Options.searchExpr]
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * [descr:DataSource.Options.searchOperation]
         */
        searchOperation?: string;
        /**
         * [descr:DataSource.Options.searchValue]
         */
        searchValue?: any;
        /**
         * [descr:DataSource.Options.select]
         */
        select?: string | Array<any> | Function;
        /**
         * [descr:DataSource.Options.sort]
         */
        sort?: string | Array<any> | Function;
        /**
         * [descr:DataSource.Options.store]
         */
        store?: Store | StoreOptions | Array<any> | any;
    }
    /**
     * [descr:DataSource]
     */
    export class DataSource {
        constructor(data: Array<any>);
        constructor(options: CustomStoreOptions | DataSourceOptions);
        constructor(store: Store);
        constructor(url: string);
        /**
         * [descr:DataSource.cancel(operationId)]
         */
        cancel(): boolean;
        /**
         * [descr:DataSource.dispose()]
         */
        dispose(): void;
        /**
         * [descr:DataSource.filter()]
         */
        filter(): any;
        /**
         * [descr:DataSource.filter(filterExpr)]
         */
        filter(filterExpr: any): void;
        /**
         * [descr:DataSource.group()]
         */
        group(): any;
        /**
         * [descr:DataSource.group(groupExpr)]
         */
        group(groupExpr: any): void;
        /**
         * [descr:DataSource.isLastPage()]
         */
        isLastPage(): boolean;
        /**
         * [descr:DataSource.isLoaded()]
         */
        isLoaded(): boolean;
        /**
         * [descr:DataSource.isLoading()]
         */
        isLoading(): boolean;
        /**
         * [descr:DataSource.items()]
         */
        items(): Array<any>;
        /**
         * [descr:DataSource.key()]
         */
        key(): any & string & number;
        /**
         * [descr:DataSource.load()]
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:DataSource.loadOptions()]
         */
        loadOptions(): any;
        /**
         * [descr:DataSource.off(eventName)]
         */
        off(eventName: string): this;
        /**
         * [descr:DataSource.off(eventName, eventHandler)]
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * [descr:DataSource.on(eventName, eventHandler)]
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * [descr:DataSource.on(events)]
         */
        on(events: any): this;
        /**
         * [descr:DataSource.pageIndex()]
         */
        pageIndex(): number;
        /**
         * [descr:DataSource.pageIndex(newIndex)]
         */
        pageIndex(newIndex: number): void;
        /**
         * [descr:DataSource.pageSize()]
         */
        pageSize(): number;
        /**
         * [descr:DataSource.pageSize(value)]
         */
        pageSize(value: number): void;
        /**
         * [descr:DataSource.paginate()]
         */
        paginate(): boolean;
        /**
         * [descr:DataSource.paginate(value)]
         */
        paginate(value: boolean): void;
        /**
         * [descr:DataSource.reload()]
         */
        reload(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:DataSource.requireTotalCount()]
         */
        requireTotalCount(): boolean;
        /**
         * [descr:DataSource.requireTotalCount(value)]
         */
        requireTotalCount(value: boolean): void;
        /**
         * [descr:DataSource.searchExpr()]
         */
        searchExpr(): string & Function & Array<string | Function>;
        /**
         * [descr:DataSource.searchExpr(expr)]
         */
        searchExpr(expr: string | Function | Array<string | Function>): void;
        /**
         * [descr:DataSource.searchOperation()]
         */
        searchOperation(): string;
        /**
         * [descr:DataSource.searchOperation(op)]
         */
        searchOperation(op: string): void;
        /**
         * [descr:DataSource.searchValue()]
         */
        searchValue(): any;
        /**
         * [descr:DataSource.searchValue(value)]
         */
        searchValue(value: any): void;
        /**
         * [descr:DataSource.select()]
         */
        select(): any;
        /**
         * [descr:DataSource.select(expr)]
         */
        select(expr: any): void;
        /**
         * [descr:DataSource.sort()]
         */
        sort(): any;
        /**
         * [descr:DataSource.sort(sortExpr)]
         */
        sort(sortExpr: any): void;
        /**
         * [descr:DataSource.store()]
         */
        store(): any;
        /**
         * [descr:DataSource.totalCount()]
         */
        totalCount(): number;
    }
    /**
     * [descr:EdmLiteral]
     */
    export class EdmLiteral {
        constructor(value: string);
        /**
         * [descr:EdmLiteral.valueOf()]
         */
        valueOf(): string;
    }
    /**
     * [descr:Guid]
     */
    export class Guid {
        constructor();
        constructor(value: string);
        /**
         * [descr:Guid.toString()]
         */
        toString(): string;
        /**
         * [descr:Guid.valueOf()]
         */
        valueOf(): string;
    }
    /**
     * [descr:LoadOptions]
     */
    export interface LoadOptions {
        /**
         * [descr:LoadOptions.customQueryParams]
         */
        customQueryParams?: any;
        /**
         * [descr:LoadOptions.expand]
         */
        expand?: any;
        /**
         * [descr:LoadOptions.filter]
         */
        filter?: any;
        /**
         * [descr:LoadOptions.group]
         */
        group?: any;
        /**
         * [descr:LoadOptions.groupSummary]
         */
        groupSummary?: any;
        /**
         * [descr:LoadOptions.parentIds]
         */
        parentIds?: Array<any>;
        /**
         * [descr:LoadOptions.requireGroupCount]
         */
        requireGroupCount?: boolean;
        /**
         * [descr:LoadOptions.requireTotalCount]
         */
        requireTotalCount?: boolean;
        /**
         * [descr:LoadOptions.searchExpr]
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * [descr:LoadOptions.searchOperation]
         */
        searchOperation?: string;
        /**
         * [descr:LoadOptions.searchValue]
         */
        searchValue?: any;
        /**
         * [descr:LoadOptions.select]
         */
        select?: any;
        /**
         * [descr:LoadOptions.skip]
         */
        skip?: number;
        /**
         * [descr:LoadOptions.sort]
         */
        sort?: any;
        /**
         * [descr:LoadOptions.take]
         */
        take?: number;
        /**
         * [descr:LoadOptions.totalSummary]
         */
        totalSummary?: any;
        /**
         * [descr:LoadOptions.userData]
         */
        userData?: any;
    }
    /**
     * [descr:LocalStore.Options]
     */
    export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
        /**
         * [descr:LocalStore.Options.flushInterval]
         */
        flushInterval?: number;
        /**
         * [descr:LocalStore.Options.immediate]
         */
        immediate?: boolean;
        /**
         * [descr:LocalStore.Options.name]
         */
        name?: string;
    }
    /**
     * [descr:LocalStore]
     */
    export class LocalStore extends ArrayStore {
        constructor(options?: LocalStoreOptions)
        /**
         * [descr:LocalStore.clear()]
         */
        clear(): void;
    }
    /**
     * [descr:ODataContext.Options]
     */
    export interface ODataContextOptions {
        /**
         * [descr:ODataContext.Options.beforeSend]
         */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /**
         * [descr:ODataContext.Options.deserializeDates]
         */
        deserializeDates?: boolean;
        /**
         * [descr:ODataContext.Options.entities]
         */
        entities?: any;
        /**
         * [descr:ODataContext.Options.errorHandler]
         */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /**
         * [descr:ODataContext.Options.filterToLower]
         */
        filterToLower?: boolean;
        /**
         * [descr:ODataContext.Options.jsonp]
         */
        jsonp?: boolean;
        /**
         * [descr:ODataContext.Options.url]
         */
        url?: string;
        /**
         * [descr:ODataContext.Options.version]
         */
        version?: number;
        /**
         * [descr:ODataContext.Options.withCredentials]
         */
        withCredentials?: boolean;
    }
    /**
     * [descr:ODataContext]
     */
    export class ODataContext {
        constructor(options?: ODataContextOptions)
        /**
         * [descr:ODataContext.get(operationName, params)]
         */
        get(operationName: string, params: any): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:ODataContext.invoke(operationName, params, httpMethod)]
         */
        invoke(operationName: string, params: any, httpMethod: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:ODataContext.objectLink(entityAlias, key)]
         */
        objectLink(entityAlias: string, key: any | string | number): any;
    }
    /**
     * [descr:ODataStore.Options]
     */
    export interface ODataStoreOptions extends StoreOptions<ODataStore> {
        /**
         * [descr:ODataStore.Options.beforeSend]
         */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /**
         * [descr:ODataStore.Options.deserializeDates]
         */
        deserializeDates?: boolean;
        /**
         * [descr:ODataStore.Options.errorHandler]
         */
        errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => any);
        /**
         * [descr:ODataStore.Options.fieldTypes]
         */
        fieldTypes?: any;
        /**
         * [descr:ODataStore.Options.filterToLower]
         */
        filterToLower?: boolean;
        /**
         * [descr:ODataStore.Options.jsonp]
         */
        jsonp?: boolean;
        /**
         * [descr:ODataStore.Options.keyType]
         */
        keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
        /**
         * [descr:ODataStore.Options.onLoading]
         */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /**
         * [descr:ODataStore.Options.url]
         */
        url?: string;
        /**
         * [descr:ODataStore.Options.version]
         */
        version?: number;
        /**
         * [descr:ODataStore.Options.withCredentials]
         */
        withCredentials?: boolean;
    }
    /**
     * [descr:ODataStore]
     */
    export class ODataStore extends Store {
        constructor(options?: ODataStoreOptions)
        /**
         * [descr:Store.byKey(key)]
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:ODataStore.byKey(key, extraOptions)]
         */
        byKey(key: any | string | number, extraOptions: { expand?: string | Array<string>, select?: string | Array<string> }): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:ODataStore.createQuery(loadOptions)]
         */
        createQuery(loadOptions: any): any;
    }
    /**
     * [descr:PivotGridDataSource.Options]
     */
    export interface PivotGridDataSourceOptions {
        /**
         * [descr:PivotGridDataSource.Options.fields]
         */
        fields?: Array<PivotGridDataSourceField>;
        /**
         * [descr:PivotGridDataSource.Options.filter]
         */
        filter?: string | Array<any> | Function;
        /**
         * [descr:PivotGridDataSource.Options.onChanged]
         */
        onChanged?: Function;
        /**
         * [descr:PivotGridDataSource.Options.onFieldsPrepared]
         */
        onFieldsPrepared?: ((fields: Array<PivotGridDataSourceField>) => any);
        /**
         * [descr:PivotGridDataSource.Options.onLoadError]
         */
        onLoadError?: ((error: any) => any);
        /**
         * [descr:PivotGridDataSource.Options.onLoadingChanged]
         */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /**
         * [descr:PivotGridDataSource.Options.paginate]
         */
        paginate?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.remoteOperations]
         */
        remoteOperations?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.retrieveFields]
         */
        retrieveFields?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.store]
         */
        store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{ type?: 'array' | 'local' | 'odata' | 'xmla' }> | { type?: 'array' | 'local' | 'odata' | 'xmla' };
    }
    /**
     * [descr:PivotGridDataSource.Options.fields]
     */
    export interface PivotGridDataSourceField {
        /**
         * [descr:PivotGridDataSource.Options.fields.allowCrossGroupCalculation]
         */
        allowCrossGroupCalculation?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.allowExpandAll]
         */
        allowExpandAll?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.allowFiltering]
         */
        allowFiltering?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.allowSorting]
         */
        allowSorting?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.allowSortingBySummary]
         */
        allowSortingBySummary?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.area]
         */
        area?: 'column' | 'data' | 'filter' | 'row' | undefined;
        /**
         * [descr:PivotGridDataSource.Options.fields.areaIndex]
         */
        areaIndex?: number;
        /**
         * [descr:PivotGridDataSource.Options.fields.calculateCustomSummary]
         */
        calculateCustomSummary?: ((options: { summaryProcess?: string, value?: any, totalValue?: any }) => any);
        /**
         * [descr:PivotGridDataSource.Options.fields.calculateSummaryValue]
         */
        calculateSummaryValue?: ((e: DevExpress.ui.dxPivotGridSummaryCell) => number);
        /**
         * [descr:PivotGridDataSource.Options.fields.caption]
         */
        caption?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.customizeText]
         */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string }) => string);
        /**
         * [descr:PivotGridDataSource.Options.fields.dataField]
         */
        dataField?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.dataType]
         */
        dataType?: 'date' | 'number' | 'string';
        /**
         * [descr:PivotGridDataSource.Options.fields.displayFolder]
         */
        displayFolder?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.expanded]
         */
        expanded?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.filterType]
         */
        filterType?: 'exclude' | 'include';
        /**
         * [descr:PivotGridDataSource.Options.fields.filterValues]
         */
        filterValues?: Array<any>;
        /**
         * [descr:PivotGridDataSource.Options.fields.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:PivotGridDataSource.Options.fields.groupIndex]
         */
        groupIndex?: number;
        /**
         * [descr:PivotGridDataSource.Options.fields.groupInterval]
         */
        groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
        /**
         * [descr:PivotGridDataSource.Options.fields.groupName]
         */
        groupName?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.headerFilter]
         */
        headerFilter?: { allowSearch?: boolean, height?: number, width?: number };
        /**
         * [descr:PivotGridDataSource.Options.fields.isMeasure]
         */
        isMeasure?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.name]
         */
        name?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.runningTotal]
         */
        runningTotal?: 'column' | 'row';
        /**
         * [descr:PivotGridDataSource.Options.fields.selector]
         */
        selector?: Function;
        /**
         * [descr:PivotGridDataSource.Options.fields.showGrandTotals]
         */
        showGrandTotals?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.showTotals]
         */
        showTotals?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.showValues]
         */
        showValues?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.sortBy]
         */
        sortBy?: 'displayText' | 'value' | 'none';
        /**
         * [descr:PivotGridDataSource.Options.fields.sortBySummaryField]
         */
        sortBySummaryField?: string;
        /**
         * [descr:PivotGridDataSource.Options.fields.sortBySummaryPath]
         */
        sortBySummaryPath?: Array<number | string>;
        /**
         * [descr:PivotGridDataSource.Options.fields.sortOrder]
         */
        sortOrder?: 'asc' | 'desc';
        /**
         * [descr:PivotGridDataSource.Options.fields.sortingMethod]
         */
        sortingMethod?: ((a: { value?: string | number, children?: Array<any> }, b: { value?: string | number, children?: Array<any> }) => number);
        /**
         * [descr:PivotGridDataSource.Options.fields.summaryDisplayMode]
         */
        summaryDisplayMode?: 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';
        /**
         * [descr:PivotGridDataSource.Options.fields.summaryType]
         */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
        /**
         * [descr:PivotGridDataSource.Options.fields.visible]
         */
        visible?: boolean;
        /**
         * [descr:PivotGridDataSource.Options.fields.width]
         */
        width?: number;
        /**
         * [descr:PivotGridDataSource.Options.fields.wordWrapEnabled]
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * [descr:PivotGridDataSource]
     */
    export class PivotGridDataSource {
        constructor(options?: PivotGridDataSourceOptions)
        /**
         * [descr:PivotGridDataSource.collapseAll(id)]
         */
        collapseAll(id: number | string): void;
        /**
         * [descr:PivotGridDataSource.collapseHeaderItem(area, path)]
         */
        collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
        /**
         * [descr:PivotGridDataSource.createDrillDownDataSource(options)]
         */
        createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>, rowPath?: Array<string | number | Date>, dataIndex?: number, maxRowCount?: number, customColumns?: Array<string> }): DataSource;
        /**
         * [descr:PivotGridDataSource.dispose()]
         */
        dispose(): void;
        /**
         * [descr:PivotGridDataSource.expandAll(id)]
         */
        expandAll(id: number | string): void;
        /**
         * [descr:PivotGridDataSource.expandHeaderItem(area, path)]
         */
        expandHeaderItem(area: string, path: Array<any>): void;
        /**
         * [descr:PivotGridDataSource.field(id)]
         */
        field(id: number | string): any;
        /**
         * [descr:PivotGridDataSource.field(id, options)]
         */
        field(id: number | string, options: any): void;
        /**
         * [descr:PivotGridDataSource.fields()]
         */
        fields(): Array<PivotGridDataSourceField>;
        /**
         * [descr:PivotGridDataSource.fields(fields)]
         */
        fields(fields: Array<PivotGridDataSourceField>): void;
        /**
         * [descr:PivotGridDataSource.filter()]
         */
        filter(): any;
        /**
         * [descr:PivotGridDataSource.filter(filterExpr)]
         */
        filter(filterExpr: any): void;
        /**
         * [descr:PivotGridDataSource.getAreaFields(area, collectGroups)]
         */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridDataSourceField>;
        /**
         * [descr:PivotGridDataSource.getData()]
         */
        getData(): any;
        /**
         * [descr:PivotGridDataSource.isLoading()]
         */
        isLoading(): boolean;
        /**
         * [descr:PivotGridDataSource.load()]
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:PivotGridDataSource.off(eventName)]
         */
        off(eventName: string): this;
        /**
         * [descr:PivotGridDataSource.off(eventName, eventHandler)]
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * [descr:PivotGridDataSource.on(eventName, eventHandler)]
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * [descr:PivotGridDataSource.on(events)]
         */
        on(events: any): this;
        /**
         * [descr:PivotGridDataSource.reload()]
         */
        reload(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:PivotGridDataSource.state()]
         */
        state(): any;
        /**
         * [descr:PivotGridDataSource.state(state)]
         */
        state(state: any): void;
    }
    /**
     * [descr:Query]
     */
    export class Query {
        /**
         * [descr:Query.aggregate(seed, step, finalize)]
         */
        aggregate(seed: any, step: Function, finalize: Function): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Query.aggregate(step)]
         */
        aggregate(step: Function): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Query.avg()]
         */
        avg(): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Query.avg(getter)]
         */
        avg(getter: any): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Query.count()]
         */
        count(): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Query.enumerate()]
         */
        enumerate(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Query.filter(criteria)]
         */
        filter(criteria: Array<any>): Query;
        /**
         * [descr:Query.filter(predicate)]
         */
        filter(predicate: Function): Query;
        /**
         * [descr:Query.groupBy(getter)]
         */
        groupBy(getter: any): Query;
        /**
         * [descr:Query.max()]
         */
        max(): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * [descr:Query.max(getter)]
         */
        max(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * [descr:Query.min()]
         */
        min(): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * [descr:Query.min(getter)]
         */
        min(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /**
         * [descr:Query.select(getter)]
         */
        select(getter: any): Query;
        /**
         * [descr:Query.slice(skip, take)]
         */
        slice(skip: number, take?: number): Query;
        /**
         * [descr:Query.sortBy(getter)]
         */
        sortBy(getter: any): Query;
        /**
         * [descr:Query.sortBy(getter, desc)]
         */
        sortBy(getter: any, desc: boolean): Query;
        /**
         * [descr:Query.sum()]
         */
        sum(): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Query.sum(getter)]
         */
        sum(getter: any): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Query.thenBy(getter)]
         */
        thenBy(getter: any): Query;
        /**
         * [descr:Query.thenBy(getter, desc)]
         */
        thenBy(getter: any, desc: boolean): Query;
        /**
         * [descr:Query.toArray()]
         */
        toArray(): Array<any>;
    }
    /**
     * [descr:Store.Options]
     */
    export interface StoreOptions<T = Store> {
        /**
         * [descr:Store.Options.errorHandler]
         */
        errorHandler?: Function;
        /**
         * [descr:Store.Options.key]
         */
        key?: string | Array<string>;
        /**
         * [descr:Store.Options.onInserted]
         */
        onInserted?: ((values: any, key: any | string | number) => any);
        /**
         * [descr:Store.Options.onInserting]
         */
        onInserting?: ((values: any) => any);
        /**
         * [descr:Store.Options.onLoaded]
         */
        onLoaded?: ((result: Array<any>) => any);
        /**
         * [descr:Store.Options.onLoading]
         */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /**
         * [descr:Store.Options.onModified]
         */
        onModified?: Function;
        /**
         * [descr:Store.Options.onModifying]
         */
        onModifying?: Function;
        /**
         * [descr:Store.Options.onPush]
         */
        onPush?: ((changes: Array<any>) => any);
        /**
         * [descr:Store.Options.onRemoved]
         */
        onRemoved?: ((key: any | string | number) => any);
        /**
         * [descr:Store.Options.onRemoving]
         */
        onRemoving?: ((key: any | string | number) => any);
        /**
         * [descr:Store.Options.onUpdated]
         */
        onUpdated?: ((key: any | string | number, values: any) => any);
        /**
         * [descr:Store.Options.onUpdating]
         */
        onUpdating?: ((key: any | string | number, values: any) => any);
    }
    /**
     * [descr:Store]
     */
    export class Store {
        constructor(options?: StoreOptions)
        /**
         * [descr:Store.byKey(key)]
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Store.insert(values)]
         */
        insert(values: any): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Store.key()]
         */
        key(): any;
        /**
         * [descr:Store.keyOf(obj)]
         */
        keyOf(obj: any): any;
        /**
         * [descr:Store.load()]
         */
        load(): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Store.load(options)]
         */
        load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:Store.off(eventName)]
         */
        off(eventName: string): this;
        /**
         * [descr:Store.off(eventName, eventHandler)]
         */
        off(eventName: string, eventHandler: Function): this;
        /**
         * [descr:Store.on(eventName, eventHandler)]
         */
        on(eventName: string, eventHandler: Function): this;
        /**
         * [descr:Store.on(events)]
         */
        on(events: any): this;
        /**
         * [descr:Store.push(changes)]
         */
        push(changes: Array<any>): void;
        /**
         * [descr:Store.remove(key)]
         */
        remove(key: any | string | number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:Store.totalCount(options)]
         */
        totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number>;
        /**
         * [descr:Store.update(key, values)]
         */
        update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any>;
    }
    /**
     * [descr:XmlaStore.Options]
     */
    export interface XmlaStoreOptions {
        /**
         * [descr:XmlaStore.Options.beforeSend]
         */
        beforeSend?: ((options: { url?: string, method?: string, headers?: any, xhrFields?: any, data?: string, dataType?: string }) => any);
        /**
         * [descr:XmlaStore.Options.catalog]
         */
        catalog?: string;
        /**
         * [descr:XmlaStore.Options.cube]
         */
        cube?: string;
        /**
         * [descr:XmlaStore.Options.url]
         */
        url?: string;
    }
    /**
     * [descr:XmlaStore]
     */
    export class XmlaStore {
        constructor(options?: XmlaStoreOptions)
    }
    /**
     * [descr:Utils.applyChanges(data, changes, options)]
     */
    export function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>, immutable?: boolean }): Array<any>;
    /**
     * [descr:Utils.base64_encode(input)]
     */
    export function base64_encode(input: string | Array<number>): string;
    /**
     * [descr:Utils.errorHandler]
     */
    export function errorHandler(e: Error): void;
    /**
     * [descr:Utils.query(array)]
     */
    export function query(array: Array<any>): Query;
    /**
     * [descr:Utils.query(url, queryOptions)]
     */
    export function query(url: string, queryOptions: any): Query;
}
declare module DevExpress.data.utils {
    /**
     * [descr:Utils.compileGetter(expr)]
     */
    export function compileGetter(expr: string | Array<string>): Function;
    /**
     * [descr:Utils.compileSetter(expr)]
     */
    export function compileSetter(expr: string | Array<string>): Function;
}
declare module DevExpress.data.utils.odata {
    /**
     * [descr:Utils.keyConverters]
     */
    export var keyConverters: any;
}
declare module DevExpress.events {
    /**
     * [descr:dxEvent]
     */
    export class dxEvent {
        /**
         * [descr:dxEvent.currentTarget]
         */
        currentTarget: Element;
        /**
         * [descr:dxEvent.data]
         */
        data: any;
        /**
         * [descr:dxEvent.delegateTarget]
         */
        delegateTarget: Element;
        /**
         * [descr:dxEvent.target]
         */
        target: Element;
        /**
         * [descr:dxEvent.isDefaultPrevented()]
         */
        isDefaultPrevented(): boolean;
        /**
         * [descr:dxEvent.isImmediatePropagationStopped()]
         */
        isImmediatePropagationStopped(): boolean;
        /**
         * [descr:dxEvent.isPropagationStopped()]
         */
        isPropagationStopped(): boolean;
        /**
         * [descr:dxEvent.preventDefault()]
         */
        preventDefault(): void;
        /**
         * [descr:dxEvent.stopImmediatePropagation()]
         */
        stopImmediatePropagation(): void;
        /**
         * [descr:dxEvent.stopPropagation()]
         */
        stopPropagation(): void;
    }
    /**
     * [descr:event]
     */
    export type event = dxEvent | JQueryEventObject;
    /**
     * [descr:eventsHandler]
     */
    export function eventsHandler(event: dxEvent, extraParameters: any): boolean;
    /**
     * [descr:events.off(element)]
     */
    export function off(element: Element | Array<Element>): void;
    /**
     * [descr:events.off(element, eventName)]
     */
    export function off(element: Element | Array<Element>, eventName: string): void;
    /**
     * [descr:events.off(element, eventName, handler)]
     */
    export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * [descr:events.off(element, eventName, selector)]
     */
    export function off(element: Element | Array<Element>, eventName: string, selector: string): void;
    /**
     * [descr:events.off(element, eventName, selector, handler)]
     */
    export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * [descr:events.on(element, eventName, data, handler)]
     */
    export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /**
     * [descr:events.on(element, eventName, handler)]
     */
    export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * [descr:events.on(element, eventName, selector, data, handler)]
     */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /**
     * [descr:events.on(element, eventName, selector, handler)]
     */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * [descr:events.one(element, eventName, data, handler)]
     */
    export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    /**
     * [descr:events.one(element, eventName, handler)]
     */
    export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /**
     * [descr:events.one(element, eventName, selector, data, handler)]
     */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    /**
     * [descr:events.one(element, eventName, selector, handler)]
     */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    /**
     * [descr:events.trigger(element, event)]
     */
    export function trigger(element: Element | Array<Element>, event: string | event): void;
    /**
     * [descr:events.trigger(element, event, extraParameters)]
     */
    export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
    /**
     * [descr:events.triggerHandler(element, event)]
     */
    export function triggerHandler(element: Element | Array<Element>, event: string | event): void;
    /**
     * [descr:events.triggerHandler(element, event, extraParameters)]
     */
    export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
}
declare module DevExpress.excelExporter {
    /**
     * [descr:CellAddress]
     */
    export interface CellAddress {
        /**
         * [descr:CellAddress.column]
         */
        column?: number;
        /**
         * [descr:CellAddress.row]
         */
        row?: number;
    }
    /**
     * [descr:CellRange]
     */
    export interface CellRange {
        /**
         * [descr:CellRange.from]
         */
        from?: CellAddress;
        /**
         * [descr:CellRange.to]
         */
        to?: CellAddress;
    }
    /**
     * [descr:ExcelDataGridCell]
     */
    export interface ExcelDataGridCell {
        /**
         * [descr:ExcelDataGridCell.column]
         */
        column?: DevExpress.ui.dxDataGridColumn;
        /**
         * [descr:ExcelDataGridCell.data]
         */
        data?: any;
        /**
         * [descr:ExcelDataGridCell.groupIndex]
         */
        groupIndex?: number;
        /**
         * [descr:ExcelDataGridCell.groupSummaryItems]
         */
        groupSummaryItems?: Array<{ name?: string, value?: any }>;
        /**
         * [descr:ExcelDataGridCell.rowType]
         */
        rowType?: string;
        /**
         * [descr:ExcelDataGridCell.totalSummaryItemName]
         */
        totalSummaryItemName?: string;
        /**
         * [descr:ExcelDataGridCell.value]
         */
        value?: any;
    }
    /**
     * [descr:ExcelExportBaseProps]
     */
    export interface ExcelExportBaseProps {
        /**
         * [descr:ExcelExportBaseProps.keepColumnWidths]
         */
        keepColumnWidths?: boolean;
        /**
         * [descr:ExcelExportBaseProps.loadPanel]
         */
        loadPanel?: ExportLoadPanel;
        /**
         * [descr:ExcelExportBaseProps.topLeftCell]
         */
        topLeftCell?: CellAddress | string;
        /**
         * [descr:ExcelExportBaseProps.worksheet]
         */
        worksheet?: any;
    }
    /**
     * [descr:ExcelExportDataGridProps]
     */
    export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
        /**
         * [descr:ExcelExportDataGridProps.autoFilterEnabled]
         */
        autoFilterEnabled?: boolean;
        /**
         * [descr:ExcelExportDataGridProps.component]
         */
        component?: DevExpress.ui.dxDataGrid;
        /**
         * [descr:ExcelExportDataGridProps.customizeCell]
         */
        customizeCell?: ((options: { gridCell?: ExcelDataGridCell, excelCell?: any }) => any);
        /**
         * [descr:ExcelExportDataGridProps.selectedRowsOnly]
         */
        selectedRowsOnly?: boolean;
    }
    /**
     * [descr:ExcelExportPivotGridProps]
     */
    export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
        /**
         * [descr:ExcelExportPivotGridProps.component]
         */
        component?: DevExpress.ui.dxPivotGrid;
        /**
         * [descr:ExcelExportPivotGridProps.customizeCell]
         */
        customizeCell?: ((options: { pivotCell?: ExcelPivotGridCell, excelCell?: any }) => any);
    }
    /**
     * [descr:ExcelPivotGridCell]
     */
    export interface ExcelPivotGridCell extends DevExpress.ui.dxPivotGridPivotGridCell {
        /**
         * [descr:ExcelPivotGridCell.area]
         */
        area?: string;
        /**
         * [descr:ExcelPivotGridCell.columnIndex]
         */
        columnIndex?: number;
        /**
         * [descr:ExcelPivotGridCell.rowIndex]
         */
        rowIndex?: number;
    }
    /**
     * [descr:ExportLoadPanel]
     */
    export interface ExportLoadPanel {
        /**
         * [descr:ExportLoadPanel.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:ExportLoadPanel.height]
         */
        height?: number;
        /**
         * [descr:ExportLoadPanel.indicatorSrc]
         */
        indicatorSrc?: string;
        /**
         * [descr:ExportLoadPanel.shading]
         */
        shading?: boolean;
        /**
         * [descr:ExportLoadPanel.shadingColor]
         */
        shadingColor?: string;
        /**
         * [descr:ExportLoadPanel.showIndicator]
         */
        showIndicator?: boolean;
        /**
         * [descr:ExportLoadPanel.showPane]
         */
        showPane?: boolean;
        /**
         * [descr:ExportLoadPanel.text]
         */
        text?: string;
        /**
         * [descr:ExportLoadPanel.width]
         */
        width?: number;
    }
    /**
     * [descr:excelExporter.exportDataGrid(options)]
     */
    export function exportDataGrid(options: ExcelExportDataGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
    /**
     * [descr:excelExporter.exportPivotGrid(options)]
     */
    export function exportPivotGrid(options: ExcelExportPivotGridProps): Promise<CellRange> & JQueryPromise<CellRange>;
}
declare module DevExpress.exporter {
    /**
     * [descr:ExcelFont]
     * @deprecated [depNote:ExcelFont]
     */
    export interface ExcelFont {
        /**
         * [descr:ExcelFont.bold]
         */
        bold?: boolean;
        /**
         * [descr:ExcelFont.color]
         */
        color?: string;
        /**
         * [descr:ExcelFont.italic]
         */
        italic?: boolean;
        /**
         * [descr:ExcelFont.name]
         */
        name?: string;
        /**
         * [descr:ExcelFont.size]
         */
        size?: number;
        /**
         * [descr:ExcelFont.underline]
         */
        underline?: 'double' | 'doubleAccounting' | 'none' | 'single' | 'singleAccounting';
    }
}
declare module DevExpress.fileManagement {
    /**
     * [descr:CustomFileSystemProvider.Options]
     */
    export interface CustomFileSystemProviderOptions extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
        /**
         * [descr:CustomFileSystemProvider.Options.abortFileUpload]
         */
        abortFileUpload?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.copyItem]
         */
        copyItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.createDirectory]
         */
        createDirectory?: ((parentDirectory: FileSystemItem, name: string) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.deleteItem]
         */
        deleteItem?: ((item: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.downloadItems]
         */
        downloadItems?: ((items: Array<FileSystemItem>) => any);
        /**
         * [descr:CustomFileSystemProvider.Options.getItems]
         */
        getItems?: ((parentDirectory: FileSystemItem) => Promise<Array<any>> | JQueryPromise<Array<any>> | Array<any>);
        /**
         * [descr:CustomFileSystemProvider.Options.getItemsContent]
         */
        getItemsContent?: ((items: Array<FileSystemItem>) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.hasSubDirectoriesExpr]
         */
        hasSubDirectoriesExpr?: string | Function;
        /**
         * [descr:CustomFileSystemProvider.Options.moveItem]
         */
        moveItem?: ((item: FileSystemItem, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.renameItem]
         */
        renameItem?: ((item: FileSystemItem, newName: string) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:CustomFileSystemProvider.Options.uploadFileChunk]
         */
        uploadFileChunk?: ((file: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem) => Promise<any> | JQueryPromise<any> | any);
    }
    /**
     * [descr:CustomFileSystemProvider]
     */
    export class CustomFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: CustomFileSystemProviderOptions)
    }
    /**
     * [descr:FileSystemItem]
     */
    export class FileSystemItem {
        /**
         * [descr:FileSystemItem.dataItem]
         */
        dataItem: any;
        /**
         * [descr:FileSystemItem.dateModified]
         */
        dateModified: Date;
        /**
         * [descr:FileSystemItem.hasSubDirectories]
         */
        hasSubDirectories: boolean;
        /**
         * [descr:FileSystemItem.isDirectory]
         */
        isDirectory: boolean;
        /**
         * [descr:FileSystemItem.key]
         */
        key: string;
        /**
         * [descr:FileSystemItem.name]
         */
        name: string;
        /**
         * [descr:FileSystemItem.path]
         */
        path: string;
        /**
         * [descr:FileSystemItem.pathKeys]
         */
        pathKeys: Array<string>;
        /**
         * [descr:FileSystemItem.size]
         */
        size: number;
        /**
         * [descr:FileSystemItem.thumbnail]
         */
        thumbnail: string;
        /**
         * [descr:FileSystemItem.getFileExtension()]
         */
        getFileExtension(): string;
    }
    /**
     * [descr:FileSystemProviderBase.Options]
     */
    export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
        /**
         * [descr:FileSystemProviderBase.Options.dateModifiedExpr]
         */
        dateModifiedExpr?: string | Function;
        /**
         * [descr:FileSystemProviderBase.Options.isDirectoryExpr]
         */
        isDirectoryExpr?: string | Function;
        /**
         * [descr:FileSystemProviderBase.Options.keyExpr]
         */
        keyExpr?: string | Function;
        /**
         * [descr:FileSystemProviderBase.Options.nameExpr]
         */
        nameExpr?: string | Function;
        /**
         * [descr:FileSystemProviderBase.Options.sizeExpr]
         */
        sizeExpr?: string | Function;
        /**
         * [descr:FileSystemProviderBase.Options.thumbnailExpr]
         */
        thumbnailExpr?: string | Function;
    }
    /**
     * [descr:FileSystemProviderBase]
     */
    export class FileSystemProviderBase {
        constructor(options?: FileSystemProviderBaseOptions)
        /**
         * [descr:FileSystemProviderBase.abortFileUpload()]
         */
        abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:FileSystemProviderBase.copyItems()]
         */
        copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * [descr:FileSystemProviderBase.createDirectory()]
         */
        createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:FileSystemProviderBase.deleteItems()]
         */
        deleteItems(items: Array<FileSystemItem>): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * [descr:FileSystemProviderBase.downloadItems()]
         */
        downloadItems(items: Array<FileSystemItem>): void;
        /**
         * [descr:FileSystemProviderBase.getItems()]
         */
        getItems(parentDirectory: FileSystemItem): Promise<Array<FileSystemItem>> & JQueryPromise<Array<FileSystemItem>>;
        /**
         * [descr:FileSystemProviderBase.getItemsContent()]
         */
        getItemsContent(items: Array<FileSystemItem>): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:FileSystemProviderBase.moveItems()]
         */
        moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<Promise<any> | JQueryPromise<any>>;
        /**
         * [descr:FileSystemProviderBase.renameItem()]
         */
        renameItem(item: FileSystemItem, newName: string): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:FileSystemProviderBase.uploadFileChunk()]
         */
        uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): Promise<any> & JQueryPromise<any>;
    }
    /**
     * [descr:ObjectFileSystemProvider.Options]
     */
    export interface ObjectFileSystemProviderOptions extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
        /**
         * [descr:ObjectFileSystemProvider.Options.contentExpr]
         */
        contentExpr?: string | Function;
        /**
         * [descr:ObjectFileSystemProvider.Options.data]
         */
        data?: Array<any>;
        /**
         * [descr:ObjectFileSystemProvider.Options.itemsExpr]
         */
        itemsExpr?: string | Function;
    }
    /**
     * [descr:ObjectFileSystemProvider]
     */
    export class ObjectFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: ObjectFileSystemProviderOptions)
    }
    /**
     * [descr:RemoteFileSystemProvider.Options]
     */
    export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
        /**
         * [descr:RemoteFileSystemProvider.Options.endpointUrl]
         */
        endpointUrl?: string;
        /**
         * [descr:RemoteFileSystemProvider.Options.hasSubDirectoriesExpr]
         */
        hasSubDirectoriesExpr?: string | Function;
    }
    /**
     * [descr:RemoteFileSystemProvider]
     */
    export class RemoteFileSystemProvider extends FileSystemProviderBase {
        constructor(options?: RemoteFileSystemProviderOptions)
    }
    /**
     * [descr:UploadInfo]
     */
    export interface UploadInfo {
        /**
         * [descr:UploadInfo.bytesUploaded]
         */
        bytesUploaded: number;
        /**
         * [descr:UploadInfo.chunkBlob]
         */
        chunkBlob: Blob;
        /**
         * [descr:UploadInfo.chunkCount]
         */
        chunkCount: number;
        /**
         * [descr:UploadInfo.chunkIndex]
         */
        chunkIndex: number;
        /**
         * [descr:UploadInfo.customData]
         */
        customData: any;
    }
}
declare module DevExpress.fx {
    /**
     * [descr:fx.animate(element, config)]
     */
    export function animate(element: Element, config: animationConfig): Promise<void> & JQueryPromise<void>;
    /**
     * [descr:fx.isAnimating(element)]
     */
    export function isAnimating(element: Element): boolean;
    /**
     * [descr:fx.stop(element, jumpToEnd)]
     */
    export function stop(element: Element, jumpToEnd: boolean): void;
}
declare module DevExpress.pdfExporter {
    /**
     * [descr:PdfDataGridCell]
     */
    export interface PdfDataGridCell {
        /**
         * [descr:PdfDataGridCell.column]
         */
        column?: DevExpress.ui.dxDataGridColumn;
        /**
         * [descr:PdfDataGridCell.data]
         */
        data?: any;
        /**
         * [descr:PdfDataGridCell.groupIndex]
         */
        groupIndex?: number;
        /**
         * [descr:PdfDataGridCell.groupSummaryItems]
         */
        groupSummaryItems?: Array<{ name?: string, value?: any }>;
        /**
         * [descr:PdfDataGridCell.rowType]
         */
        rowType?: string;
        /**
         * [descr:PdfDataGridCell.totalSummaryItemName]
         */
        totalSummaryItemName?: string;
        /**
         * [descr:PdfDataGridCell.value]
         */
        value?: any;
    }
    /**
     * [descr:PdfExportDataGridProps]
     */
    export interface PdfExportDataGridProps {
        /**
         * [descr:PdfExportDataGridProps.autoTableOptions]
         */
        autoTableOptions?: any;
        /**
         * [descr:PdfExportDataGridProps.component]
         */
        component?: DevExpress.ui.dxDataGrid;
        /**
         * [descr:PdfExportDataGridProps.customizeCell]
         */
        customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any }) => any);
        /**
         * [descr:PdfExportDataGridProps.jsPDFDocument]
         */
        jsPDFDocument?: any;
        /**
         * [descr:PdfExportDataGridProps.keepColumnWidths]
         */
        keepColumnWidths?: boolean;
        /**
         * [descr:PdfExportDataGridProps.loadPanel]
         */
        loadPanel?: DevExpress.excelExporter.ExportLoadPanel;
        /**
         * [descr:PdfExportDataGridProps.selectedRowsOnly]
         */
        selectedRowsOnly?: boolean;
    }
    /**
     * [descr:pdfExporter.exportDataGrid(options)]
     */
    export function exportDataGrid(options: PdfExportDataGridProps): Promise<void> & JQueryPromise<void>;
}
declare module DevExpress.ui {
    /**
     * [descr:AsyncRule]
     */
    export interface AsyncRule {
        /**
         * [descr:AsyncRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:AsyncRule.message]
         */
        message?: string;
        /**
         * [descr:AsyncRule.reevaluate]
         */
        reevaluate?: boolean;
        /**
         * [descr:AsyncRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /**
         * [descr:AsyncRule.validationCallback]
         */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => Promise<any> | JQueryPromise<any>);
    }
    /**
     * [descr:ColCountResponsible]
     */
    export interface ColCountResponsible {
        /**
         * [descr:ColCountResponsible.lg]
         */
        lg?: number;
        /**
         * [descr:ColCountResponsible.md]
         */
        md?: number;
        /**
         * [descr:ColCountResponsible.sm]
         */
        sm?: number;
        /**
         * [descr:ColCountResponsible.xs]
         */
        xs?: number;
    }
    /**
     * [descr:CollectionWidget.Options]
     */
    export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
        /**
         * [descr:CollectionWidget.Options.dataSource]
         */
        dataSource?: string | Array<string | CollectionWidgetItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:CollectionWidget.Options.itemHoldTimeout]
         */
        itemHoldTimeout?: number;
        /**
         * [descr:CollectionWidget.Options.itemTemplate]
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:CollectionWidget.Options.items]
         */
        items?: Array<string | CollectionWidgetItem | any>;
        /**
         * [descr:CollectionWidget.Options.keyExpr]
         */
        keyExpr?: string | Function;
        /**
         * [descr:CollectionWidget.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:CollectionWidget.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:CollectionWidget.Options.onItemContextMenu]
         */
        onItemContextMenu?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * [descr:CollectionWidget.Options.onItemHold]
         */
        onItemHold?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * [descr:CollectionWidget.Options.onItemRendered]
         */
        onItemRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any);
        /**
         * [descr:CollectionWidget.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /**
         * [descr:CollectionWidget.Options.selectedIndex]
         */
        selectedIndex?: number;
        /**
         * [descr:CollectionWidget.Options.selectedItem]
         */
        selectedItem?: any;
        /**
         * [descr:CollectionWidget.Options.selectedItemKeys]
         */
        selectedItemKeys?: Array<any>;
        /**
         * [descr:CollectionWidget.Options.selectedItems]
         */
        selectedItems?: Array<any>;
    }
    /**
     * [descr:CollectionWidget]
     */
    export class CollectionWidget extends Widget {
        constructor(element: Element, options?: CollectionWidgetOptions)
        constructor(element: JQuery, options?: CollectionWidgetOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:CollectionWidgetItem]
     */
    export interface CollectionWidgetItem {
        /**
         * [descr:CollectionWidgetItem.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:CollectionWidgetItem.html]
         */
        html?: string;
        /**
         * [descr:CollectionWidgetItem.template]
         */
        template?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * [descr:CollectionWidgetItem.text]
         */
        text?: string;
        /**
         * [descr:CollectionWidgetItem.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:CompareRule]
     */
    export interface CompareRule {
        /**
         * [descr:CompareRule.comparisonTarget]
         */
        comparisonTarget?: (() => any);
        /**
         * [descr:CompareRule.comparisonType]
         */
        comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
        /**
         * [descr:CompareRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:CompareRule.message]
         */
        message?: string;
        /**
         * [descr:CompareRule.reevaluate]
         */
        reevaluate?: boolean;
        /**
         * [descr:CompareRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:CustomRule]
     */
    export interface CustomRule {
        /**
         * [descr:CustomRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:CustomRule.message]
         */
        message?: string;
        /**
         * [descr:CustomRule.reevaluate]
         */
        reevaluate?: boolean;
        /**
         * [descr:CustomRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
        /**
         * [descr:CustomRule.validationCallback]
         */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => boolean);
    }
    /**
     * [descr:DataExpressionMixin.Options]
     */
    export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
        /**
         * [descr:DataExpressionMixin.Options.dataSource]
         */
        dataSource?: string | Array<CollectionWidgetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:DataExpressionMixin.Options.displayExpr]
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * [descr:DataExpressionMixin.Options.itemTemplate]
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:DataExpressionMixin.Options.items]
         */
        items?: Array<CollectionWidgetItem | any>;
        /**
         * [descr:DataExpressionMixin.Options.value]
         */
        value?: any;
        /**
         * [descr:DataExpressionMixin.Options.valueExpr]
         */
        valueExpr?: string | ((item: any) => string | number | boolean);
    }
    /**
     * [descr:DataExpressionMixin]
     */
    export class DataExpressionMixin {
        constructor(options?: DataExpressionMixinOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:DraggableBase.Options]
     */
    export interface DraggableBaseOptions<T = DraggableBase> extends DOMComponentOptions<T> {
        /**
         * [descr:DraggableBase.Options.autoScroll]
         */
        autoScroll?: boolean;
        /**
         * [descr:DraggableBase.Options.boundary]
         */
        boundary?: string | Element | JQuery;
        /**
         * [descr:DraggableBase.Options.container]
         */
        container?: string | Element | JQuery;
        /**
         * [descr:DraggableBase.Options.cursorOffset]
         */
        cursorOffset?: string | { x?: number, y?: number };
        /**
         * [descr:DraggableBase.Options.data]
         */
        data?: any;
        /**
         * [descr:DraggableBase.Options.dragDirection]
         */
        dragDirection?: 'both' | 'horizontal' | 'vertical';
        /**
         * [descr:DraggableBase.Options.group]
         */
        group?: string;
        /**
         * [descr:DraggableBase.Options.handle]
         */
        handle?: string;
        /**
         * [descr:DraggableBase.Options.scrollSensitivity]
         */
        scrollSensitivity?: number;
        /**
         * [descr:DraggableBase.Options.scrollSpeed]
         */
        scrollSpeed?: number;
    }
    /**
     * [descr:DraggableBase]
     */
    export class DraggableBase extends DOMComponent {
        constructor(element: Element, options?: DraggableBaseOptions)
        constructor(element: JQuery, options?: DraggableBaseOptions)
    }
    /**
     * [descr:Editor.Options]
     */
    export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
        /**
         * [descr:Editor.Options.isValid]
         */
        isValid?: boolean;
        /**
         * [descr:Editor.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:Editor.Options.readOnly]
         */
        readOnly?: boolean;
        /**
         * [descr:Editor.Options.validationError]
         */
        validationError?: any;
        /**
         * [descr:Editor.Options.validationErrors]
         */
        validationErrors?: Array<any>;
        /**
         * [descr:Editor.Options.validationMessageMode]
         */
        validationMessageMode?: 'always' | 'auto';
        /**
         * [descr:Editor.Options.validationStatus]
         */
        validationStatus?: 'valid' | 'invalid' | 'pending';
        /**
         * [descr:Editor.Options.value]
         */
        value?: any;
    }
    /**
     * [descr:Editor]
     */
    export class Editor extends Widget {
        constructor(element: Element, options?: EditorOptions)
        constructor(element: JQuery, options?: EditorOptions)
        /**
         * [descr:Editor.reset()]
         */
        reset(): void;
    }
    /**
     * [descr:EmailRule]
     */
    export interface EmailRule {
        /**
         * [descr:EmailRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:EmailRule.message]
         */
        message?: string;
        /**
         * [descr:EmailRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:GridBase.Options]
     */
    export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
        /**
         * [descr:GridBase.Options.allowColumnReordering]
         */
        allowColumnReordering?: boolean;
        /**
         * [descr:GridBase.Options.allowColumnResizing]
         */
        allowColumnResizing?: boolean;
        /**
         * [descr:GridBase.Options.autoNavigateToFocusedRow]
         */
        autoNavigateToFocusedRow?: boolean;
        /**
         * [descr:GridBase.Options.cacheEnabled]
         */
        cacheEnabled?: boolean;
        /**
         * [descr:GridBase.Options.cellHintEnabled]
         */
        cellHintEnabled?: boolean;
        /**
         * [descr:GridBase.Options.columnAutoWidth]
         */
        columnAutoWidth?: boolean;
        /**
         * [descr:GridBase.Options.columnChooser]
         */
        columnChooser?: { allowSearch?: boolean, emptyPanelText?: string, enabled?: boolean, height?: number, mode?: 'dragAndDrop' | 'select', searchTimeout?: number, title?: string, width?: number };
        /**
         * [descr:GridBase.Options.columnFixing]
         */
        columnFixing?: { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } };
        /**
         * [descr:GridBase.Options.columnHidingEnabled]
         */
        columnHidingEnabled?: boolean;
        /**
         * [descr:GridBase.Options.columnMinWidth]
         */
        columnMinWidth?: number;
        /**
         * [descr:GridBase.Options.columnResizingMode]
         */
        columnResizingMode?: 'nextColumn' | 'widget';
        /**
         * [descr:GridBase.Options.columnWidth]
         */
        columnWidth?: number;
        /**
         * [descr:GridBase.Options.columns]
         */
        columns?: Array<GridBaseColumn | string>;
        /**
         * [descr:GridBase.Options.dataSource]
         */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:GridBase.Options.dateSerializationFormat]
         */
        dateSerializationFormat?: string;
        /**
         * [descr:GridBase.Options.editing]
         */
        editing?: GridBaseEditing;
        /**
         * [descr:GridBase.Options.errorRowEnabled]
         */
        errorRowEnabled?: boolean;
        /**
         * [descr:GridBase.Options.filterBuilder]
         */
        filterBuilder?: dxFilterBuilderOptions;
        /**
         * [descr:GridBase.Options.filterBuilderPopup]
         */
        filterBuilderPopup?: dxPopupOptions;
        /**
         * [descr:GridBase.Options.filterPanel]
         */
        filterPanel?: { customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string), filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean };
        /**
         * [descr:GridBase.Options.filterRow]
         */
        filterRow?: { applyFilter?: 'auto' | 'onClick', applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean };
        /**
         * [descr:GridBase.Options.filterSyncEnabled]
         */
        filterSyncEnabled?: boolean | 'auto';
        /**
         * [descr:GridBase.Options.filterValue]
         */
        filterValue?: string | Array<any> | Function;
        /**
         * [descr:GridBase.Options.focusedColumnIndex]
         */
        focusedColumnIndex?: number;
        /**
         * [descr:GridBase.Options.focusedRowEnabled]
         */
        focusedRowEnabled?: boolean;
        /**
         * [descr:GridBase.Options.focusedRowIndex]
         */
        focusedRowIndex?: number;
        /**
         * [descr:GridBase.Options.focusedRowKey]
         */
        focusedRowKey?: any;
        /**
         * [descr:GridBase.Options.headerFilter]
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number };
        /**
         * [descr:GridBase.Options.highlightChanges]
         */
        highlightChanges?: boolean;
        /**
         * [descr:GridBase.Options.keyboardNavigation]
         */
        keyboardNavigation?: { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: 'startEdit' | 'moveFocus', enterKeyDirection?: 'none' | 'column' | 'row' };
        /**
         * [descr:GridBase.Options.loadPanel]
         */
        loadPanel?: { enabled?: boolean | 'auto', height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /**
         * [descr:GridBase.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:GridBase.Options.onAdaptiveDetailRowPreparing]
         */
        onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, formOptions?: any }) => any);
        /**
         * [descr:GridBase.Options.onDataErrorOccurred]
         */
        onDataErrorOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, error?: Error }) => any);
        /**
         * [descr:GridBase.Options.onEditCanceled]
         */
        onEditCanceled?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any> }) => any);
        /**
         * [descr:GridBase.Options.onEditCanceling]
         */
        onEditCanceling?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any>, cancel?: boolean }) => any);
        /**
         * [descr:GridBase.Options.onInitNewRow]
         */
        onInitNewRow?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:GridBase.Options.onKeyDown]
         */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, handled?: boolean }) => any);
        /**
         * [descr:GridBase.Options.onRowCollapsed]
         */
        onRowCollapsed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /**
         * [descr:GridBase.Options.onRowCollapsing]
         */
        onRowCollapsing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /**
         * [descr:GridBase.Options.onRowExpanded]
         */
        onRowExpanded?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /**
         * [descr:GridBase.Options.onRowExpanding]
         */
        onRowExpanding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /**
         * [descr:GridBase.Options.onRowInserted]
         */
        onRowInserted?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * [descr:GridBase.Options.onRowInserting]
         */
        onRowInserting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:GridBase.Options.onRowRemoved]
         */
        onRowRemoved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * [descr:GridBase.Options.onRowRemoving]
         */
        onRowRemoving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:GridBase.Options.onRowUpdated]
         */
        onRowUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /**
         * [descr:GridBase.Options.onRowUpdating]
         */
        onRowUpdating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:GridBase.Options.onRowValidating]
         */
        onRowValidating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string, promise?: Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:GridBase.Options.onSaved]
         */
        onSaved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any> }) => any);
        /**
         * [descr:GridBase.Options.onSaving]
         */
        onSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any>, promise?: Promise<void> | JQueryPromise<void>, cancel?: boolean }) => any);
        /**
         * [descr:GridBase.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
        /**
         * [descr:GridBase.Options.onToolbarPreparing]
         */
        onToolbarPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
        /**
         * [descr:GridBase.Options.pager]
         */
        pager?: { allowedPageSizes?: Array<number> | 'auto', infoText?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: boolean | 'auto' };
        /**
         * [descr:GridBase.Options.paging]
         */
        paging?: GridBasePaging;
        /**
         * [descr:GridBase.Options.renderAsync]
         */
        renderAsync?: boolean;
        /**
         * [descr:GridBase.Options.repaintChangesOnly]
         */
        repaintChangesOnly?: boolean;
        /**
         * [descr:GridBase.Options.rowAlternationEnabled]
         */
        rowAlternationEnabled?: boolean;
        /**
         * [descr:GridBase.Options.rowDragging]
         */
        rowDragging?: { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: string | Element | JQuery, container?: string | Element | JQuery, cursorOffset?: string | { x?: number, y?: number }, data?: any, dragDirection?: 'both' | 'horizontal' | 'vertical', dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery), dropFeedbackMode?: 'push' | 'indicate', filter?: string, group?: string, handle?: string, onAdd?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragChange?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragEnd?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragMove?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragStart?: ((e: { component?: T, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any), onRemove?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onReorder?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: Promise<void> | JQueryPromise<void> }) => any), scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean };
        /**
         * [descr:GridBase.Options.scrolling]
         */
        scrolling?: GridBaseScrolling;
        /**
         * [descr:GridBase.Options.searchPanel]
         */
        searchPanel?: { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number };
        /**
         * [descr:GridBase.Options.selectedRowKeys]
         */
        selectedRowKeys?: Array<any>;
        /**
         * [descr:GridBase.Options.selection]
         */
        selection?: GridBaseSelection;
        /**
         * [descr:GridBase.Options.showBorders]
         */
        showBorders?: boolean;
        /**
         * [descr:GridBase.Options.showColumnHeaders]
         */
        showColumnHeaders?: boolean;
        /**
         * [descr:GridBase.Options.showColumnLines]
         */
        showColumnLines?: boolean;
        /**
         * [descr:GridBase.Options.showRowLines]
         */
        showRowLines?: boolean;
        /**
         * [descr:GridBase.Options.sorting]
         */
        sorting?: { ascendingText?: string, clearText?: string, descendingText?: string, mode?: 'multiple' | 'none' | 'single', showSortIndexes?: boolean };
        /**
         * [descr:GridBase.Options.stateStoring]
         */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((gridState: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /**
         * [descr:GridBase.Options.twoWayBindingEnabled]
         */
        twoWayBindingEnabled?: boolean;
        /**
         * [descr:GridBase.Options.wordWrapEnabled]
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * [descr:GridBase.Options.editing]
     */
    export interface GridBaseEditing {
        /**
         * [descr:GridBase.Options.editing.changes]
         */
        changes?: Array<any>;
        /**
         * [descr:GridBase.Options.editing.confirmDelete]
         */
        confirmDelete?: boolean;
        /**
         * [descr:GridBase.Options.editing.editColumnName]
         */
        editColumnName?: string;
        /**
         * [descr:GridBase.Options.editing.editRowKey]
         */
        editRowKey?: any;
        /**
         * [descr:GridBase.Options.editing.form]
         */
        form?: dxFormOptions;
        /**
         * [descr:GridBase.Options.editing.mode]
         */
        mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
        /**
         * [descr:GridBase.Options.editing.popup]
         */
        popup?: dxPopupOptions;
        /**
         * [descr:GridBase.Options.editing.refreshMode]
         */
        refreshMode?: 'full' | 'reshape' | 'repaint';
        /**
         * [descr:GridBase.Options.editing.selectTextOnEditStart]
         */
        selectTextOnEditStart?: boolean;
        /**
         * [descr:GridBase.Options.editing.startEditAction]
         */
        startEditAction?: 'click' | 'dblClick';
        /**
         * [descr:GridBase.Options.editing.texts]
         */
        texts?: GridBaseEditingTexts;
        /**
         * [descr:GridBase.Options.editing.useIcons]
         */
        useIcons?: boolean;
    }
    /**
     * [descr:GridBase.Options.editing.texts]
     */
    export interface GridBaseEditingTexts {
        /**
         * [descr:GridBase.Options.editing.texts.addRow]
         */
        addRow?: string;
        /**
         * [descr:GridBase.Options.editing.texts.cancelAllChanges]
         */
        cancelAllChanges?: string;
        /**
         * [descr:GridBase.Options.editing.texts.cancelRowChanges]
         */
        cancelRowChanges?: string;
        /**
         * [descr:GridBase.Options.editing.texts.confirmDeleteMessage]
         */
        confirmDeleteMessage?: string;
        /**
         * [descr:GridBase.Options.editing.texts.confirmDeleteTitle]
         */
        confirmDeleteTitle?: string;
        /**
         * [descr:GridBase.Options.editing.texts.deleteRow]
         */
        deleteRow?: string;
        /**
         * [descr:GridBase.Options.editing.texts.editRow]
         */
        editRow?: string;
        /**
         * [descr:GridBase.Options.editing.texts.saveAllChanges]
         */
        saveAllChanges?: string;
        /**
         * [descr:GridBase.Options.editing.texts.saveRowChanges]
         */
        saveRowChanges?: string;
        /**
         * [descr:GridBase.Options.editing.texts.undeleteRow]
         */
        undeleteRow?: string;
        /**
         * [descr:GridBase.Options.editing.texts.validationCancelChanges]
         */
        validationCancelChanges?: string;
    }
    /**
     * [descr:GridBase.Options.paging]
     */
    export interface GridBasePaging {
        /**
         * [descr:GridBase.Options.paging.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:GridBase.Options.paging.pageIndex]
         */
        pageIndex?: number;
        /**
         * [descr:GridBase.Options.paging.pageSize]
         */
        pageSize?: number;
    }
    /**
     * [descr:GridBase.Options.scrolling]
     */
    export interface GridBaseScrolling {
        /**
         * [descr:GridBase.Options.scrolling.columnRenderingMode]
         */
        columnRenderingMode?: 'standard' | 'virtual';
        /**
         * [descr:GridBase.Options.scrolling.preloadEnabled]
         */
        preloadEnabled?: boolean;
        /**
         * [descr:GridBase.Options.scrolling.rowRenderingMode]
         */
        rowRenderingMode?: 'standard' | 'virtual';
        /**
         * [descr:GridBase.Options.scrolling.scrollByContent]
         */
        scrollByContent?: boolean;
        /**
         * [descr:GridBase.Options.scrolling.scrollByThumb]
         */
        scrollByThumb?: boolean;
        /**
         * [descr:GridBase.Options.scrolling.showScrollbar]
         */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /**
         * [descr:GridBase.Options.scrolling.useNative]
         */
        useNative?: boolean | 'auto';
    }
    /**
     * [descr:GridBase.Options.selection]
     */
    export interface GridBaseSelection {
        /**
         * [descr:GridBase.Options.selection.allowSelectAll]
         */
        allowSelectAll?: boolean;
        /**
         * [descr:GridBase.Options.selection.mode]
         */
        mode?: 'multiple' | 'none' | 'single';
    }
    /**
     * [descr:GridBase]
     */
    export class GridBase extends Widget {
        constructor(element: Element, options?: GridBaseOptions)
        constructor(element: JQuery, options?: GridBaseOptions)
        /**
         * [descr:GridBase.beginCustomLoading(messageText)]
         */
        beginCustomLoading(messageText: string): void;
        /**
         * [descr:GridBase.byKey(key)]
         */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:GridBase.cancelEditData()]
         */
        cancelEditData(): void;
        /**
         * [descr:GridBase.cellValue(rowIndex, dataField)]
         */
        cellValue(rowIndex: number, dataField: string): any;
        /**
         * [descr:GridBase.cellValue(rowIndex, dataField, value)]
         */
        cellValue(rowIndex: number, dataField: string, value: any): void;
        /**
         * [descr:GridBase.cellValue(rowIndex, visibleColumnIndex)]
         */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;
        /**
         * [descr:GridBase.cellValue(rowIndex, visibleColumnIndex, value)]
         */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
        /**
         * [descr:GridBase.clearFilter()]
         */
        clearFilter(): void;
        /**
         * [descr:GridBase.clearFilter(filterName)]
         */
        clearFilter(filterName: string): void;
        /**
         * [descr:GridBase.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:GridBase.clearSorting()]
         */
        clearSorting(): void;
        /**
         * [descr:GridBase.closeEditCell()]
         */
        closeEditCell(): void;
        /**
         * [descr:GridBase.collapseAdaptiveDetailRow()]
         */
        collapseAdaptiveDetailRow(): void;
        /**
         * [descr:GridBase.columnCount()]
         */
        columnCount(): number;
        /**
         * [descr:GridBase.columnOption(id)]
         */
        columnOption(id: number | string): any;
        /**
         * [descr:GridBase.columnOption(id, optionName)]
         */
        columnOption(id: number | string, optionName: string): any;
        /**
         * [descr:GridBase.columnOption(id, optionName, optionValue)]
         */
        columnOption(id: number | string, optionName: string, optionValue: any): void;
        /**
         * [descr:GridBase.columnOption(id, options)]
         */
        columnOption(id: number | string, options: any): void;
        /**
         * [descr:GridBase.deleteColumn(id)]
         */
        deleteColumn(id: number | string): void;
        /**
         * [descr:GridBase.deleteRow(rowIndex)]
         */
        deleteRow(rowIndex: number): void;
        /**
         * [descr:GridBase.deselectAll()]
         */
        deselectAll(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.deselectRows(keys)]
         */
        deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:GridBase.editCell(rowIndex, dataField)]
         */
        editCell(rowIndex: number, dataField: string): void;
        /**
         * [descr:GridBase.editCell(rowIndex, visibleColumnIndex)]
         */
        editCell(rowIndex: number, visibleColumnIndex: number): void;
        /**
         * [descr:GridBase.editRow(rowIndex)]
         */
        editRow(rowIndex: number): void;
        /**
         * [descr:GridBase.endCustomLoading()]
         */
        endCustomLoading(): void;
        /**
         * [descr:GridBase.expandAdaptiveDetailRow(key)]
         */
        expandAdaptiveDetailRow(key: any): void;
        /**
         * [descr:GridBase.filter()]
         */
        filter(): any;
        /**
         * [descr:GridBase.filter(filterExpr)]
         */
        filter(filterExpr: any): void;
        /**
         * [descr:Widget.focus()]
         */
        focus(): void;
        /**
         * [descr:GridBase.focus(element)]
         */
        focus(element: Element | JQuery): void;
        /**
         * [descr:GridBase.getCellElement(rowIndex, dataField)]
         */
        getCellElement(rowIndex: number, dataField: string): DevExpress.core.dxElement | undefined;
        /**
         * [descr:GridBase.getCellElement(rowIndex, visibleColumnIndex)]
         */
        getCellElement(rowIndex: number, visibleColumnIndex: number): DevExpress.core.dxElement | undefined;
        /**
         * [descr:GridBase.getCombinedFilter()]
         */
        getCombinedFilter(): any;
        /**
         * [descr:GridBase.getCombinedFilter(returnDataField)]
         */
        getCombinedFilter(returnDataField: boolean): any;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:GridBase.getKeyByRowIndex(rowIndex)]
         */
        getKeyByRowIndex(rowIndex: number): any;
        /**
         * [descr:GridBase.getRowElement(rowIndex)]
         */
        getRowElement(rowIndex: number): Array<Element> & JQuery | undefined;
        /**
         * [descr:GridBase.getRowIndexByKey(key)]
         */
        getRowIndexByKey(key: any | string | number): number;
        /**
         * [descr:GridBase.getScrollable()]
         */
        getScrollable(): dxScrollable;
        /**
         * [descr:GridBase.getVisibleColumnIndex(id)]
         */
        getVisibleColumnIndex(id: number | string): number;
        /**
         * [descr:GridBase.hasEditData()]
         */
        hasEditData(): boolean;
        /**
         * [descr:GridBase.hideColumnChooser()]
         */
        hideColumnChooser(): void;
        /**
         * [descr:GridBase.isAdaptiveDetailRowExpanded(key)]
         */
        isAdaptiveDetailRowExpanded(key: any): boolean;
        /**
         * [descr:GridBase.isRowFocused(key)]
         */
        isRowFocused(key: any): boolean;
        /**
         * [descr:GridBase.isRowSelected(key)]
         */
        isRowSelected(key: any): boolean;
        /**
         * [descr:GridBase.keyOf(obj)]
         */
        keyOf(obj: any): any;
        /**
         * [descr:GridBase.navigateToRow(key)]
         */
        navigateToRow(key: any): void;
        /**
         * [descr:GridBase.pageCount()]
         */
        pageCount(): number;
        /**
         * [descr:GridBase.pageIndex()]
         */
        pageIndex(): number;
        /**
         * [descr:GridBase.pageIndex(newIndex)]
         */
        pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.pageSize()]
         */
        pageSize(): number;
        /**
         * [descr:GridBase.pageSize(value)]
         */
        pageSize(value: number): void;
        /**
         * [descr:GridBase.refresh()]
         */
        refresh(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.refresh(changesOnly)]
         */
        refresh(changesOnly: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.repaintRows(rowIndexes)]
         */
        repaintRows(rowIndexes: Array<number>): void;
        /**
         * [descr:GridBase.saveEditData()]
         */
        saveEditData(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.searchByText(text)]
         */
        searchByText(text: string): void;
        /**
         * [descr:GridBase.selectAll()]
         */
        selectAll(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:GridBase.selectRows(keys, preserve)]
         */
        selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:GridBase.selectRowsByIndexes(indexes)]
         */
        selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:GridBase.showColumnChooser()]
         */
        showColumnChooser(): void;
        /**
         * [descr:GridBase.state()]
         */
        state(): any;
        /**
         * [descr:GridBase.state(state)]
         */
        state(state: any): void;
        /**
         * [descr:GridBase.undeleteRow(rowIndex)]
         */
        undeleteRow(rowIndex: number): void;
        /**
         * [descr:GridBase.updateDimensions()]
         */
        updateDimensions(): void;
    }
    /**
     * [descr:GridBaseColumn]
     */
    export interface GridBaseColumn {
        /**
         * [descr:GridBaseColumn.alignment]
         */
        alignment?: 'center' | 'left' | 'right' | undefined;
        /**
         * [descr:GridBaseColumn.allowEditing]
         */
        allowEditing?: boolean;
        /**
         * [descr:GridBaseColumn.allowFiltering]
         */
        allowFiltering?: boolean;
        /**
         * [descr:GridBaseColumn.allowFixing]
         */
        allowFixing?: boolean;
        /**
         * [descr:GridBaseColumn.allowHeaderFiltering]
         */
        allowHeaderFiltering?: boolean;
        /**
         * [descr:GridBaseColumn.allowHiding]
         */
        allowHiding?: boolean;
        /**
         * [descr:GridBaseColumn.allowReordering]
         */
        allowReordering?: boolean;
        /**
         * [descr:GridBaseColumn.allowResizing]
         */
        allowResizing?: boolean;
        /**
         * [descr:GridBaseColumn.allowSearch]
         */
        allowSearch?: boolean;
        /**
         * [descr:GridBaseColumn.allowSorting]
         */
        allowSorting?: boolean;
        /**
         * [descr:GridBaseColumn.calculateCellValue]
         */
        calculateCellValue?: ((rowData: any) => any);
        /**
         * [descr:GridBaseColumn.calculateDisplayValue]
         */
        calculateDisplayValue?: string | ((rowData: any) => any);
        /**
         * [descr:GridBaseColumn.calculateFilterExpression]
         */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
        /**
         * [descr:GridBaseColumn.calculateSortValue]
         */
        calculateSortValue?: string | ((rowData: any) => any);
        /**
         * [descr:GridBaseColumn.caption]
         */
        caption?: string;
        /**
         * [descr:GridBaseColumn.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:GridBaseColumn.customizeText]
         */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string, target?: string, groupInterval?: string | number }) => string);
        /**
         * [descr:GridBaseColumn.dataField]
         */
        dataField?: string;
        /**
         * [descr:GridBaseColumn.dataType]
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * [descr:GridBaseColumn.editorOptions]
         */
        editorOptions?: any;
        /**
         * [descr:GridBaseColumn.encodeHtml]
         */
        encodeHtml?: boolean;
        /**
         * [descr:GridBaseColumn.falseText]
         */
        falseText?: string;
        /**
         * [descr:GridBaseColumn.filterOperations]
         */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof' | string>;
        /**
         * [descr:GridBaseColumn.filterType]
         */
        filterType?: 'exclude' | 'include';
        /**
         * [descr:GridBaseColumn.filterValue]
         */
        filterValue?: any;
        /**
         * [descr:GridBaseColumn.filterValues]
         */
        filterValues?: Array<any>;
        /**
         * [descr:GridBaseColumn.fixed]
         */
        fixed?: boolean;
        /**
         * [descr:GridBaseColumn.fixedPosition]
         */
        fixedPosition?: 'left' | 'right';
        /**
         * [descr:GridBaseColumn.formItem]
         */
        formItem?: dxFormSimpleItem;
        /**
         * [descr:GridBaseColumn.format]
         */
        format?: format;
        /**
         * [descr:GridBaseColumn.headerFilter]
         */
        headerFilter?: { allowSearch?: boolean, dataSource?: Array<any> | ((options: { component?: any, dataSource?: DevExpress.data.DataSourceOptions }) => any) | DevExpress.data.DataSourceOptions, groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number, height?: number, searchMode?: 'contains' | 'startswith' | 'equals', width?: number };
        /**
         * [descr:GridBaseColumn.hidingPriority]
         */
        hidingPriority?: number;
        /**
         * [descr:GridBaseColumn.isBand]
         */
        isBand?: boolean;
        /**
         * [descr:GridBaseColumn.lookup]
         */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store | ((options: { data?: any, key?: any }) => Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store), displayExpr?: string | ((data: any) => string), valueExpr?: string };
        /**
         * [descr:GridBaseColumn.minWidth]
         */
        minWidth?: number;
        /**
         * [descr:GridBaseColumn.name]
         */
        name?: string;
        /**
         * [descr:GridBaseColumn.ownerBand]
         */
        ownerBand?: number;
        /**
         * [descr:GridBaseColumn.renderAsync]
         */
        renderAsync?: boolean;
        /**
         * [descr:GridBaseColumn.selectedFilterOperation]
         */
        selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
        /**
         * [descr:GridBaseColumn.setCellValue]
         */
        setCellValue?: ((newData: any, value: any, currentRowData: any) => void | Promise<void> | JQueryPromise<void>);
        /**
         * [descr:GridBaseColumn.showEditorAlways]
         */
        showEditorAlways?: boolean;
        /**
         * [descr:GridBaseColumn.showInColumnChooser]
         */
        showInColumnChooser?: boolean;
        /**
         * [descr:GridBaseColumn.sortIndex]
         */
        sortIndex?: number;
        /**
         * [descr:GridBaseColumn.sortOrder]
         */
        sortOrder?: 'asc' | 'desc' | undefined;
        /**
         * [descr:GridBaseColumn.sortingMethod]
         */
        sortingMethod?: ((value1: any, value2: any) => number);
        /**
         * [descr:GridBaseColumn.trueText]
         */
        trueText?: string;
        /**
         * [descr:GridBaseColumn.validationRules]
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * [descr:GridBaseColumn.visible]
         */
        visible?: boolean;
        /**
         * [descr:GridBaseColumn.visibleIndex]
         */
        visibleIndex?: number;
        /**
         * [descr:GridBaseColumn.width]
         */
        width?: number | string;
    }
    /**
     * [descr:GridBaseColumnButton]
     */
    export interface GridBaseColumnButton {
        /**
         * [descr:GridBaseColumnButton.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:GridBaseColumnButton.hint]
         */
        hint?: string;
        /**
         * [descr:GridBaseColumnButton.icon]
         */
        icon?: string;
        /**
         * [descr:GridBaseColumnButton.text]
         */
        text?: string;
    }
    /**
     * [descr:HierarchicalCollectionWidget.Options]
     */
    export interface HierarchicalCollectionWidgetOptions<T = HierarchicalCollectionWidget> extends CollectionWidgetOptions<T> {
        /**
         * [descr:HierarchicalCollectionWidget.Options.disabledExpr]
         */
        disabledExpr?: string | Function;
        /**
         * [descr:HierarchicalCollectionWidget.Options.displayExpr]
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * [descr:HierarchicalCollectionWidget.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:HierarchicalCollectionWidget.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:HierarchicalCollectionWidget.Options.itemsExpr]
         */
        itemsExpr?: string | Function;
        /**
         * [descr:HierarchicalCollectionWidget.Options.keyExpr]
         */
        keyExpr?: string | Function;
        /**
         * [descr:HierarchicalCollectionWidget.Options.selectedExpr]
         */
        selectedExpr?: string | Function;
    }
    /**
     * [descr:HierarchicalCollectionWidget]
     */
    export class HierarchicalCollectionWidget extends CollectionWidget {
        constructor(element: Element, options?: HierarchicalCollectionWidgetOptions)
        constructor(element: JQuery, options?: HierarchicalCollectionWidgetOptions)
    }
    /**
     * [descr:MapLocation]
     */
    export interface MapLocation {
        /**
         * [descr:MapLocation.lat]
         */
        lat?: number;
        /**
         * [descr:MapLocation.lng]
         */
        lng?: number;
    }
    /**
     * [descr:NumericRule]
     */
    export interface NumericRule {
        /**
         * [descr:NumericRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:NumericRule.message]
         */
        message?: string;
        /**
         * [descr:NumericRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:PatternRule]
     */
    export interface PatternRule {
        /**
         * [descr:PatternRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:PatternRule.message]
         */
        message?: string;
        /**
         * [descr:PatternRule.pattern]
         */
        pattern?: RegExp | string;
        /**
         * [descr:PatternRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:RangeRule]
     */
    export interface RangeRule {
        /**
         * [descr:RangeRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:RangeRule.max]
         */
        max?: Date | number;
        /**
         * [descr:RangeRule.message]
         */
        message?: string;
        /**
         * [descr:RangeRule.min]
         */
        min?: Date | number;
        /**
         * [descr:RangeRule.reevaluate]
         */
        reevaluate?: boolean;
        /**
         * [descr:RangeRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:RequiredRule]
     */
    export interface RequiredRule {
        /**
         * [descr:RequiredRule.message]
         */
        message?: string;
        /**
         * [descr:RequiredRule.trim]
         */
        trim?: boolean;
        /**
         * [descr:RequiredRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:SearchBoxMixin.Options]
     */
    export interface SearchBoxMixinOptions<T = SearchBoxMixin> {
        /**
         * [descr:SearchBoxMixin.Options.searchEditorOptions]
         */
        searchEditorOptions?: dxTextBoxOptions;
        /**
         * [descr:SearchBoxMixin.Options.searchEnabled]
         */
        searchEnabled?: boolean;
        /**
         * [descr:SearchBoxMixin.Options.searchExpr]
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * [descr:SearchBoxMixin.Options.searchMode]
         */
        searchMode?: 'contains' | 'startswith' | 'equals';
        /**
         * [descr:SearchBoxMixin.Options.searchTimeout]
         */
        searchTimeout?: number;
        /**
         * [descr:SearchBoxMixin.Options.searchValue]
         */
        searchValue?: string;
    }
    /**
     * [descr:SearchBoxMixin]
     */
    export class SearchBoxMixin {
        constructor(options?: SearchBoxMixinOptions)
    }
    /**
     * [descr:StringLengthRule]
     */
    export interface StringLengthRule {
        /**
         * [descr:StringLengthRule.ignoreEmptyValue]
         */
        ignoreEmptyValue?: boolean;
        /**
         * [descr:StringLengthRule.max]
         */
        max?: number;
        /**
         * [descr:StringLengthRule.message]
         */
        message?: string;
        /**
         * [descr:StringLengthRule.min]
         */
        min?: number;
        /**
         * [descr:StringLengthRule.trim]
         */
        trim?: boolean;
        /**
         * [descr:StringLengthRule.type]
         */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    }
    /**
     * [descr:Widget.Options]
     */
    export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
        /**
         * [descr:Widget.Options.accessKey]
         */
        accessKey?: string;
        /**
         * [descr:Widget.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:Widget.Options.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:Widget.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:Widget.Options.hint]
         */
        hint?: string;
        /**
         * [descr:Widget.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:Widget.Options.onContentReady]
         */
        onContentReady?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:Widget.Options.tabIndex]
         */
        tabIndex?: number;
        /**
         * [descr:Widget.Options.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:Widget]
     */
    export class Widget extends DOMComponent {
        constructor(element: Element, options?: WidgetOptions)
        constructor(element: JQuery, options?: WidgetOptions)
        /**
         * [descr:Widget.focus()]
         */
        focus(): void;
        /**
         * [descr:Widget.registerKeyHandler(key, handler)]
         */
        registerKeyHandler(key: string, handler: Function): void;
        /**
         * [descr:Widget.repaint()]
         */
        repaint(): void;
    }
    /**
     * [descr:dxAccordion.Options]
     */
    export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
        /**
         * [descr:dxAccordion.Options.animationDuration]
         */
        animationDuration?: number;
        /**
         * [descr:dxAccordion.Options.collapsible]
         */
        collapsible?: boolean;
        /**
         * [descr:dxAccordion.Options.dataSource]
         */
        dataSource?: string | Array<string | dxAccordionItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxAccordion.Options.deferRendering]
         */
        deferRendering?: boolean;
        /**
         * [descr:dxAccordion.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxAccordion.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxAccordion.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxAccordion.Options.itemTemplate]
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxAccordion.Options.itemTitleTemplate]
         */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxAccordion.Options.items]
         */
        items?: Array<string | dxAccordionItem | any>;
        /**
         * [descr:dxAccordion.Options.multiple]
         */
        multiple?: boolean;
        /**
         * [descr:dxAccordion.Options.onItemTitleClick]
         */
        onItemTitleClick?: ((e: { component?: dxAccordion, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxAccordion.Options.repaintChangesOnly]
         */
        repaintChangesOnly?: boolean;
        /**
         * [descr:dxAccordion.Options.selectedIndex]
         */
        selectedIndex?: number;
    }
    /**
     * [descr:dxAccordion]
     */
    export class dxAccordion extends CollectionWidget {
        constructor(element: Element, options?: dxAccordionOptions)
        constructor(element: JQuery, options?: dxAccordionOptions)
        /**
         * [descr:dxAccordion.collapseItem(index)]
         */
        collapseItem(index: number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxAccordion.expandItem(index)]
         */
        expandItem(index: number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxAccordion.updateDimensions()]
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxAccordionItem]
     */
    export interface dxAccordionItem extends CollectionWidgetItem {
        /**
         * [descr:dxAccordionItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxAccordionItem.title]
         */
        title?: string;
    }
    /**
     * [descr:dxActionSheet.Options]
     */
    export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
        /**
         * [descr:dxActionSheet.Options.cancelText]
         */
        cancelText?: string;
        /**
         * [descr:dxActionSheet.Options.dataSource]
         */
        dataSource?: string | Array<string | dxActionSheetItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxActionSheet.Options.items]
         */
        items?: Array<string | dxActionSheetItem | any>;
        /**
         * [descr:dxActionSheet.Options.onCancelClick]
         */
        onCancelClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any) | string;
        /**
         * [descr:dxActionSheet.Options.showCancelButton]
         */
        showCancelButton?: boolean;
        /**
         * [descr:dxActionSheet.Options.showTitle]
         */
        showTitle?: boolean;
        /**
         * [descr:dxActionSheet.Options.target]
         */
        target?: string | Element | JQuery;
        /**
         * [descr:dxActionSheet.Options.title]
         */
        title?: string;
        /**
         * [descr:dxActionSheet.Options.usePopover]
         */
        usePopover?: boolean;
        /**
         * [descr:dxActionSheet.Options.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxActionSheet]
     */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: Element, options?: dxActionSheetOptions)
        constructor(element: JQuery, options?: dxActionSheetOptions)
        /**
         * [descr:dxActionSheet.hide()]
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxActionSheet.show()]
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxActionSheet.toggle(showing)]
         */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxActionSheetItem]
     */
    export interface dxActionSheetItem extends CollectionWidgetItem {
        /**
         * [descr:dxActionSheetItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxActionSheetItem.onClick]
         */
        onClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxActionSheetItem.type]
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /**
     * [descr:dxAutocomplete.Options]
     */
    export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
        /**
         * [descr:dxAutocomplete.Options.maxItemCount]
         */
        maxItemCount?: number;
        /**
         * [descr:dxAutocomplete.Options.minSearchLength]
         */
        minSearchLength?: number;
        /**
         * [descr:dxAutocomplete.Options.showDropDownButton]
         */
        showDropDownButton?: boolean;
        /**
         * [descr:dxAutocomplete.Options.value]
         */
        value?: string;
    }
    /**
     * [descr:dxAutocomplete]
     */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: Element, options?: dxAutocompleteOptions)
        constructor(element: JQuery, options?: dxAutocompleteOptions)
    }
    /**
     * [descr:dxBox.Options]
     */
    export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
        /**
         * [descr:dxBox.Options.align]
         */
        align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
        /**
         * [descr:dxBox.Options.crossAlign]
         */
        crossAlign?: 'center' | 'end' | 'start' | 'stretch';
        /**
         * [descr:dxBox.Options.dataSource]
         */
        dataSource?: string | Array<string | dxBoxItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxBox.Options.direction]
         */
        direction?: 'col' | 'row';
        /**
         * [descr:dxBox.Options.items]
         */
        items?: Array<string | dxBoxItem | any>;
    }
    /**
     * [descr:dxBox]
     */
    export class dxBox extends CollectionWidget {
        constructor(element: Element, options?: dxBoxOptions)
        constructor(element: JQuery, options?: dxBoxOptions)
    }
    /**
     * [descr:dxBoxItem]
     */
    export interface dxBoxItem extends CollectionWidgetItem {
        /**
         * [descr:dxBoxItem.baseSize]
         */
        baseSize?: number | 'auto';
        /**
         * [descr:dxBoxItem.box]
         */
        box?: dxBoxOptions;
        /**
         * [descr:dxBoxItem.ratio]
         */
        ratio?: number;
        /**
         * [descr:dxBoxItem.shrink]
         */
        shrink?: number;
    }
    /**
     * [descr:dxButton.Options]
     */
    export interface dxButtonOptions extends WidgetOptions<dxButton> {
        /**
         * [descr:dxButton.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxButton.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxButton.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxButton.Options.icon]
         */
        icon?: string;
        /**
         * [descr:dxButton.Options.onClick]
         */
        onClick?: ((e: { component?: dxButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, validationGroup?: any }) => any);
        /**
         * [descr:dxButton.Options.stylingMode]
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /**
         * [descr:dxButton.Options.template]
         */
        template?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxButton.Options.text]
         */
        text?: string;
        /**
         * [descr:dxButton.Options.type]
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
        /**
         * [descr:dxButton.Options.useSubmitBehavior]
         */
        useSubmitBehavior?: boolean;
        /**
         * [descr:dxButton.Options.validationGroup]
         */
        validationGroup?: string;
    }
    /**
     * [descr:dxButton]
     */
    export class dxButton extends Widget {
        constructor(element: Element, options?: dxButtonOptions)
        constructor(element: JQuery, options?: dxButtonOptions)
    }
    /**
     * [descr:dxButtonGroup.Options]
     */
    export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
        /**
         * [descr:dxButtonGroup.Options.buttonTemplate]
         */
        buttonTemplate?: DevExpress.core.template | ((buttonData: any, buttonContent: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxButtonGroup.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxButtonGroup.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxButtonGroup.Options.items]
         */
        items?: Array<dxButtonGroupItem>;
        /**
         * [descr:dxButtonGroup.Options.keyExpr]
         */
        keyExpr?: string | Function;
        /**
         * [descr:dxButtonGroup.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxButtonGroup.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxButtonGroup, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /**
         * [descr:dxButtonGroup.Options.selectedItemKeys]
         */
        selectedItemKeys?: Array<any>;
        /**
         * [descr:dxButtonGroup.Options.selectedItems]
         */
        selectedItems?: Array<any>;
        /**
         * [descr:dxButtonGroup.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxButtonGroup.Options.stylingMode]
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
    }
    /**
     * [descr:dxButtonGroup]
     */
    export class dxButtonGroup extends Widget {
        constructor(element: Element, options?: dxButtonGroupOptions)
        constructor(element: JQuery, options?: dxButtonGroupOptions)
    }
    /**
     * [descr:dxButtonGroupItem]
     */
    export interface dxButtonGroupItem extends CollectionWidgetItem {
        /**
         * [descr:dxButtonGroupItem.hint]
         */
        hint?: string;
        /**
         * [descr:dxButtonGroupItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxButtonGroupItem.type]
         */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    /**
     * [descr:dxCalendar.Options]
     */
    export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
        /**
         * [descr:dxCalendar.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxCalendar.Options.cellTemplate]
         */
        cellTemplate?: DevExpress.core.template | ((itemData: { date?: Date, view?: string, text?: string }, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxCalendar.Options.dateSerializationFormat]
         */
        dateSerializationFormat?: string;
        /**
         * [descr:dxCalendar.Options.disabledDates]
         */
        disabledDates?: Array<Date> | ((data: { component?: any, date?: Date, view?: string }) => boolean);
        /**
         * [descr:dxCalendar.Options.firstDayOfWeek]
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * [descr:dxCalendar.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxCalendar.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxCalendar.Options.max]
         */
        max?: Date | number | string;
        /**
         * [descr:dxCalendar.Options.maxZoomLevel]
         */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /**
         * [descr:dxCalendar.Options.min]
         */
        min?: Date | number | string;
        /**
         * [descr:dxCalendar.Options.minZoomLevel]
         */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /**
         * [descr:dxCalendar.Options.name]
         */
        name?: string;
        /**
         * [descr:dxCalendar.Options.showTodayButton]
         */
        showTodayButton?: boolean;
        /**
         * [descr:dxCalendar.Options.value]
         */
        value?: Date | number | string;
        /**
         * [descr:dxCalendar.Options.zoomLevel]
         */
        zoomLevel?: 'century' | 'decade' | 'month' | 'year';
    }
    /**
     * [descr:dxCalendar]
     */
    export class dxCalendar extends Editor {
        constructor(element: Element, options?: dxCalendarOptions)
        constructor(element: JQuery, options?: dxCalendarOptions)
    }
    /**
     * [descr:dxCheckBox.Options]
     */
    export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
        /**
         * [descr:dxCheckBox.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxCheckBox.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxCheckBox.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxCheckBox.Options.name]
         */
        name?: string;
        /**
         * [descr:dxCheckBox.Options.text]
         */
        text?: string;
        /**
         * [descr:dxCheckBox.Options.value]
         */
        value?: boolean;
    }
    /**
     * [descr:dxCheckBox]
     */
    export class dxCheckBox extends Editor {
        constructor(element: Element, options?: dxCheckBoxOptions)
        constructor(element: JQuery, options?: dxCheckBoxOptions)
    }
    /**
     * [descr:dxColorBox.Options]
     */
    export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
        /**
         * [descr:dxColorBox.Options.applyButtonText]
         */
        applyButtonText?: string;
        /**
         * [descr:dxColorBox.Options.applyValueMode]
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * [descr:dxColorBox.Options.cancelButtonText]
         */
        cancelButtonText?: string;
        /**
         * [descr:dxColorBox.Options.editAlphaChannel]
         */
        editAlphaChannel?: boolean;
        /**
         * [descr:dxColorBox.Options.fieldTemplate]
         */
        fieldTemplate?: DevExpress.core.template | ((value: string, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxColorBox.Options.keyStep]
         */
        keyStep?: number;
        /**
         * [descr:dxColorBox.Options.value]
         */
        value?: string;
    }
    /**
     * [descr:dxColorBox]
     */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxColorBoxOptions)
        constructor(element: JQuery, options?: dxColorBoxOptions)
    }
    /**
     * [descr:dxContextMenu.Options]
     */
    export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
        /**
         * [descr:dxContextMenu.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * [descr:dxContextMenu.Options.dataSource]
         */
        dataSource?: string | Array<dxContextMenuItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxContextMenu.Options.items]
         */
        items?: Array<dxContextMenuItem>;
        /**
         * [descr:dxContextMenu.Options.onHidden]
         */
        onHidden?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxContextMenu.Options.onHiding]
         */
        onHiding?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * [descr:dxContextMenu.Options.onPositioning]
         */
        onPositioning?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, position?: positionConfig }) => any);
        /**
         * [descr:dxContextMenu.Options.onShowing]
         */
        onShowing?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * [descr:dxContextMenu.Options.onShown]
         */
        onShown?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxContextMenu.Options.position]
         */
        position?: positionConfig;
        /**
         * [descr:dxContextMenu.Options.showEvent]
         */
        showEvent?: { delay?: number, name?: string } | string;
        /**
         * [descr:dxContextMenu.Options.submenuDirection]
         */
        submenuDirection?: 'auto' | 'left' | 'right';
        /**
         * [descr:dxContextMenu.Options.target]
         */
        target?: string | Element | JQuery;
        /**
         * [descr:dxContextMenu.Options.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxContextMenu]
     */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: Element, options?: dxContextMenuOptions)
        constructor(element: JQuery, options?: dxContextMenuOptions)
        /**
         * [descr:dxContextMenu.hide()]
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxContextMenu.show()]
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxContextMenu.toggle(showing)]
         */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxContextMenuItem]
     */
    export interface dxContextMenuItem extends dxMenuBaseItem {
        /**
         * [descr:dxContextMenuItem.items]
         */
        items?: Array<dxContextMenuItem>;
    }
    /**
     * [descr:dxDataGrid.Options]
     */
    export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
        /**
         * [descr:dxDataGrid.Options.columns]
         */
        columns?: Array<dxDataGridColumn | string>;
        /**
         * [descr:dxDataGrid.Options.customizeColumns]
         */
        customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
        /**
         * [descr:dxDataGrid.Options.customizeExportData]
         * @deprecated [depNote:dxDataGrid.Options.customizeExportData]
         */
        customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
        /**
         * [descr:dxDataGrid.Options.editing]
         */
        editing?: dxDataGridEditing;
        /**
         * [descr:dxDataGrid.Options.export]
         */
        export?: { allowExportSelectedData?: boolean, customizeExcelCell?: ((options: { component?: dxDataGrid, horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top', wrapTextEnabled?: boolean, backgroundColor?: string, fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid', fillPatternColor?: string, font?: DevExpress.exporter.ExcelFont, value?: string | number | Date, numberFormat?: string, gridCell?: DevExpress.excelExporter.ExcelDataGridCell }) => any), enabled?: boolean, excelFilterEnabled?: boolean, excelWrapTextEnabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string, texts?: { exportAll?: string, exportSelectedRows?: string, exportTo?: string } };
        /**
         * [descr:dxDataGrid.Options.groupPanel]
         */
        groupPanel?: { allowColumnDragging?: boolean, emptyPanelText?: string, visible?: boolean | 'auto' };
        /**
         * [descr:dxDataGrid.Options.grouping]
         */
        grouping?: { allowCollapsing?: boolean, autoExpandAll?: boolean, contextMenuEnabled?: boolean, expandMode?: 'buttonClick' | 'rowClick', texts?: { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string } };
        /**
         * [descr:dxDataGrid.Options.keyExpr]
         */
        keyExpr?: string | Array<string>;
        /**
         * [descr:dxDataGrid.Options.masterDetail]
         */
        masterDetail?: { autoExpandAll?: boolean, enabled?: boolean, template?: DevExpress.core.template | ((detailElement: DevExpress.core.dxElement, detailInfo: { key?: any, data?: any, watch?: Function }) => any) };
        /**
         * [descr:dxDataGrid.Options.onCellClick]
         */
        onCellClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any) | string;
        /**
         * [descr:dxDataGrid.Options.onCellDblClick]
         */
        onCellDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onCellHoverChanged]
         */
        onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onCellPrepared]
         */
        onCellPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /**
         * [descr:dxDataGrid.Options.onContextMenuPreparing]
         */
        onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onEditingStart]
         */
        onEditingStart?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /**
         * [descr:dxDataGrid.Options.onEditorPrepared]
         */
        onEditorPrepared?: ((options: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onEditorPreparing]
         */
        onEditorPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onExported]
         * @deprecated [depNote:dxDataGrid.Options.onExported]
         */
        onExported?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxDataGrid.Options.onExporting]
         */
        onExporting?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /**
         * [descr:dxDataGrid.Options.onFileSaving]
         * @deprecated [depNote:dxDataGrid.Options.onFileSaving]
         */
        onFileSaving?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * [descr:dxDataGrid.Options.onFocusedCellChanged]
         */
        onFocusedCellChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any);
        /**
         * [descr:dxDataGrid.Options.onFocusedCellChanging]
         */
        onFocusedCellChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxDataGridRowObject>, columns?: Array<dxDataGridColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /**
         * [descr:dxDataGrid.Options.onFocusedRowChanged]
         */
        onFocusedRowChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /**
         * [descr:dxDataGrid.Options.onFocusedRowChanging]
         */
        onFocusedRowChanging?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxDataGridRowObject>, cancel?: boolean }) => any);
        /**
         * [descr:dxDataGrid.Options.onRowClick]
         */
        onRowClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => any) | string;
        /**
         * [descr:dxDataGrid.Options.onRowDblClick]
         */
        onRowDblClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxDataGrid.Options.onRowPrepared]
         */
        onRowPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxDataGrid.Options.remoteOperations]
         */
        remoteOperations?: boolean | { filtering?: boolean, groupPaging?: boolean, grouping?: boolean, paging?: boolean, sorting?: boolean, summary?: boolean } | 'auto';
        /**
         * [descr:dxDataGrid.Options.rowTemplate]
         */
        rowTemplate?: DevExpress.core.template | ((rowElement: DevExpress.core.dxElement, rowInfo: { key?: any, data?: any, component?: dxDataGrid, values?: Array<any>, rowIndex?: number, columns?: Array<dxDataGridColumn>, isSelected?: boolean, rowType?: string, groupIndex?: number, isExpanded?: boolean }) => any);
        /**
         * [descr:dxDataGrid.Options.scrolling]
         */
        scrolling?: dxDataGridScrolling;
        /**
         * [descr:dxDataGrid.Options.selection]
         */
        selection?: dxDataGridSelection;
        /**
         * [descr:dxDataGrid.Options.selectionFilter]
         */
        selectionFilter?: string | Array<any> | Function;
        /**
         * [descr:dxDataGrid.Options.sortByGroupSummaryInfo]
         */
        sortByGroupSummaryInfo?: Array<{ groupColumn?: string, sortOrder?: 'asc' | 'desc', summaryItem?: string | number }>;
        /**
         * [descr:dxDataGrid.Options.summary]
         */
        summary?: { calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any, groupIndex?: number }) => any), groupItems?: Array<{ alignByColumn?: boolean, column?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }>, recalculateWhileEditing?: boolean, skipEmptyValues?: boolean, texts?: { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string }, totalItems?: Array<{ alignment?: 'center' | 'left' | 'right', column?: string, cssClass?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }> };
    }
    /**
     * [descr:dxDataGrid.Options.editing]
     */
    export interface dxDataGridEditing extends GridBaseEditing {
        /**
         * [descr:dxDataGrid.Options.editing.allowAdding]
         */
        allowAdding?: boolean;
        /**
         * [descr:dxDataGrid.Options.editing.allowDeleting]
         */
        allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /**
         * [descr:dxDataGrid.Options.editing.allowUpdating]
         */
        allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
        /**
         * [descr:dxDataGrid.Options.editing.texts]
         */
        texts?: any;
    }
    /**
     * [descr:dxDataGrid.Options.scrolling]
     */
    export interface dxDataGridScrolling extends GridBaseScrolling {
        /**
         * [descr:dxDataGrid.Options.scrolling.mode]
         */
        mode?: 'infinite' | 'standard' | 'virtual';
    }
    /**
     * [descr:dxDataGrid.Options.selection]
     */
    export interface dxDataGridSelection extends GridBaseSelection {
        /**
         * [descr:dxDataGrid.Options.selection.deferred]
         */
        deferred?: boolean;
        /**
         * [descr:dxDataGrid.Options.selection.selectAllMode]
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * [descr:dxDataGrid.Options.selection.showCheckBoxesMode]
         */
        showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
    }
    /**
     * [descr:dxDataGrid]
     */
    export class dxDataGrid extends GridBase {
        constructor(element: Element, options?: dxDataGridOptions)
        constructor(element: JQuery, options?: dxDataGridOptions)
        /**
         * [descr:dxDataGrid.addColumn(columnOptions)]
         */
        addColumn(columnOptions: any | string): void;
        /**
         * [descr:dxDataGrid.addRow()]
         */
        addRow(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDataGrid.clearGrouping()]
         */
        clearGrouping(): void;
        /**
         * [descr:dxDataGrid.collapseAll(groupIndex)]
         */
        collapseAll(groupIndex?: number): void;
        /**
         * [descr:dxDataGrid.collapseRow(key)]
         */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDataGrid.expandAll(groupIndex)]
         */
        expandAll(groupIndex?: number): void;
        /**
         * [descr:dxDataGrid.expandRow(key)]
         */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDataGrid.exportToExcel(selectionOnly)]
         * @deprecated [depNote:dxDataGrid.exportToExcel(selectionOnly)]
         */
        exportToExcel(selectionOnly: boolean): void;
        /**
         * [descr:dxDataGrid.getSelectedRowKeys()]
         */
        getSelectedRowKeys(): Array<any> & Promise<any> & JQueryPromise<any>;
        /**
         * [descr:dxDataGrid.getSelectedRowsData()]
         */
        getSelectedRowsData(): Array<any> & Promise<any> & JQueryPromise<any>;
        /**
         * [descr:dxDataGrid.getTotalSummaryValue(summaryItemName)]
         */
        getTotalSummaryValue(summaryItemName: string): any;
        /**
         * [descr:dxDataGrid.getVisibleColumns()]
         */
        getVisibleColumns(): Array<dxDataGridColumn>;
        /**
         * [descr:dxDataGrid.getVisibleColumns(headerLevel)]
         */
        getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
        /**
         * [descr:dxDataGrid.getVisibleRows()]
         */
        getVisibleRows(): Array<dxDataGridRowObject>;
        /**
         * [descr:dxDataGrid.isRowExpanded(key)]
         */
        isRowExpanded(key: any): boolean;
        /**
         * [descr:dxDataGrid.isRowSelected(data)]
         */
        isRowSelected(data: any): boolean;
        /**
         * [descr:GridBase.isRowSelected(key)]
         */
        isRowSelected(key: any): boolean;
        /**
         * [descr:dxDataGrid.totalCount()]
         */
        totalCount(): number;
    }
    /**
     * [descr:dxDataGridColumn]
     */
    export interface dxDataGridColumn extends GridBaseColumn {
        /**
         * [descr:dxDataGridColumn.allowExporting]
         */
        allowExporting?: boolean;
        /**
         * [descr:dxDataGridColumn.allowGrouping]
         */
        allowGrouping?: boolean;
        /**
         * [descr:dxDataGridColumn.autoExpandGroup]
         */
        autoExpandGroup?: boolean;
        /**
         * [descr:dxDataGridColumn.buttons]
         */
        buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxDataGridColumnButton>;
        /**
         * [descr:dxDataGridColumn.calculateGroupValue]
         */
        calculateGroupValue?: string | ((rowData: any) => any);
        /**
         * [descr:dxDataGridColumn.cellTemplate]
         */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * [descr:dxDataGridColumn.columns]
         */
        columns?: Array<dxDataGridColumn | string>;
        /**
         * [descr:dxDataGridColumn.editCellTemplate]
         */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxDataGrid, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * [descr:dxDataGridColumn.groupCellTemplate]
         */
        groupCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, summaryItems?: Array<any>, groupContinuesMessage?: string, groupContinuedMessage?: string }) => any);
        /**
         * [descr:dxDataGridColumn.groupIndex]
         */
        groupIndex?: number;
        /**
         * [descr:dxDataGridColumn.headerCellTemplate]
         */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxDataGrid, columnIndex?: number, column?: dxDataGridColumn }) => any);
        /**
         * [descr:dxDataGridColumn.showWhenGrouped]
         */
        showWhenGrouped?: boolean;
        /**
         * [descr:dxDataGridColumn.type]
         */
        type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';
    }
    /**
     * [descr:dxDataGridColumnButton]
     */
    export interface dxDataGridColumnButton extends GridBaseColumnButton {
        /**
         * [descr:dxDataGridColumnButton.name]
         */
        name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /**
         * [descr:dxDataGridColumnButton.onClick]
         */
        onClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any) | string;
        /**
         * [descr:dxDataGridColumnButton.template]
         */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxDataGrid, data?: any, key?: any, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject }) => string | Element | JQuery);
        /**
         * [descr:dxDataGridColumnButton.visible]
         */
        visible?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => boolean);
    }
    /**
     * [descr:dxDataGridRowObject]
     */
    export interface dxDataGridRowObject {
        /**
         * [descr:dxDataGridRowObject.data]
         */
        data?: any;
        /**
         * [descr:dxDataGridRowObject.groupIndex]
         */
        groupIndex?: number;
        /**
         * [descr:dxDataGridRowObject.isEditing]
         */
        isEditing?: boolean;
        /**
         * [descr:dxDataGridRowObject.isExpanded]
         */
        isExpanded?: boolean;
        /**
         * [descr:dxDataGridRowObject.isNewRow]
         */
        isNewRow?: boolean;
        /**
         * [descr:dxDataGridRowObject.isSelected]
         */
        isSelected?: boolean;
        /**
         * [descr:dxDataGridRowObject.key]
         */
        key?: any;
        /**
         * [descr:dxDataGridRowObject.rowIndex]
         */
        rowIndex?: number;
        /**
         * [descr:dxDataGridRowObject.rowType]
         */
        rowType?: string;
        /**
         * [descr:dxDataGridRowObject.values]
         */
        values?: Array<any>;
    }
    /**
     * [descr:dxDateBox.Options]
     */
    export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
        /**
         * [descr:dxDateBox.Options.adaptivityEnabled]
         */
        adaptivityEnabled?: boolean;
        /**
         * [descr:dxDateBox.Options.applyButtonText]
         */
        applyButtonText?: string;
        /**
         * [descr:dxDateBox.Options.calendarOptions]
         */
        calendarOptions?: dxCalendarOptions;
        /**
         * [descr:dxDateBox.Options.cancelButtonText]
         */
        cancelButtonText?: string;
        /**
         * [descr:dxDateBox.Options.dateOutOfRangeMessage]
         */
        dateOutOfRangeMessage?: string;
        /**
         * [descr:dxDateBox.Options.dateSerializationFormat]
         */
        dateSerializationFormat?: string;
        /**
         * [descr:dxDateBox.Options.disabledDates]
         */
        disabledDates?: Array<Date> | ((data: { component?: dxDateBox, date?: Date, view?: string }) => boolean);
        /**
         * [descr:dxDateBox.Options.displayFormat]
         */
        displayFormat?: format;
        /**
         * [descr:dxDateBox.Options.interval]
         */
        interval?: number;
        /**
         * [descr:dxDateBox.Options.invalidDateMessage]
         */
        invalidDateMessage?: string;
        /**
         * [descr:dxDateBox.Options.max]
         */
        max?: Date | number | string;
        /**
         * [descr:dxDateBox.Options.min]
         */
        min?: Date | number | string;
        /**
         * [descr:dxDateBox.Options.pickerType]
         */
        pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
        /**
         * [descr:dxDateBox.Options.placeholder]
         */
        placeholder?: string;
        /**
         * [descr:dxDateBox.Options.showAnalogClock]
         */
        showAnalogClock?: boolean;
        /**
         * [descr:dxDateBox.Options.type]
         */
        type?: 'date' | 'datetime' | 'time';
        /**
         * [descr:dxDateBox.Options.useMaskBehavior]
         */
        useMaskBehavior?: boolean;
        /**
         * [descr:dxDateBox.Options.value]
         */
        value?: Date | number | string;
    }
    /**
     * [descr:dxDateBox]
     */
    export class dxDateBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDateBoxOptions)
        constructor(element: JQuery, options?: dxDateBoxOptions)
        /**
         * [descr:dxDateBox.close()]
         */
        close(): void;
        /**
         * [descr:dxDateBox.open()]
         */
        open(): void;
    }
    /**
     * [descr:dxDeferRendering.Options]
     */
    export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
        /**
         * [descr:dxDeferRendering.Options.animation]
         */
        animation?: animationConfig;
        /**
         * [descr:dxDeferRendering.Options.onRendered]
         */
        onRendered?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxDeferRendering.Options.onShown]
         */
        onShown?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxDeferRendering.Options.renderWhen]
         */
        renderWhen?: Promise<void> | JQueryPromise<void> | boolean;
        /**
         * [descr:dxDeferRendering.Options.showLoadIndicator]
         */
        showLoadIndicator?: boolean;
        /**
         * [descr:dxDeferRendering.Options.staggerItemSelector]
         */
        staggerItemSelector?: string;
    }
    /**
     * [descr:dxDeferRendering]
     */
    export class dxDeferRendering extends Widget {
        constructor(element: Element, options?: dxDeferRenderingOptions)
        constructor(element: JQuery, options?: dxDeferRenderingOptions)
    }
    /**
     * [descr:dxDiagram.Options]
     */
    export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
        /**
         * [descr:dxDiagram.Options.autoZoomMode]
         */
        autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
        /**
         * [descr:dxDiagram.Options.contextMenu]
         */
        contextMenu?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, enabled?: boolean };
        /**
         * [descr:dxDiagram.Options.contextToolbox]
         */
        contextToolbox?: { category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', enabled?: boolean, shapeIconsPerRow?: number, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, width?: number };
        /**
         * [descr:dxDiagram.Options.customShapeTemplate]
         */
        customShapeTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any);
        /**
         * [descr:dxDiagram.Options.customShapeToolboxTemplate]
         */
        customShapeToolboxTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any);
        /**
         * [descr:dxDiagram.Options.customShapes]
         */
        customShapes?: Array<{ allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageToolboxUrl?: string, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string, category?: string, connectionPoints?: Array<{ x?: number, y?: number }>, defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, keepRatioOnAutoSize?: boolean, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any), templateHeight?: number, templateLeft?: number, templateTop?: number, templateWidth?: number, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, toolboxTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxSVGElement, data: { item?: dxDiagramShape }) => any), toolboxWidthToHeightRatio?: number, type?: string }>;
        /**
         * [descr:dxDiagram.Options.defaultItemProperties]
         */
        defaultItemProperties?: { connectorLineEnd?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle', connectorLineStart?: 'none' | 'arrow' | 'outlinedTriangle' | 'filledTriangle', connectorLineType?: 'straight' | 'orthogonal', shapeMaxHeight?: number, shapeMaxWidth?: number, shapeMinHeight?: number, shapeMinWidth?: number, style?: any, textStyle?: any };
        /**
         * [descr:dxDiagram.Options.edges]
         */
        edges?: { customDataExpr?: string | ((data: any) => any), dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, fromExpr?: string | ((data: any) => any), fromLineEndExpr?: string | ((data: any) => any), fromPointIndexExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), lineTypeExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), pointsExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), toExpr?: string | ((data: any) => any), toLineEndExpr?: string | ((data: any) => any), toPointIndexExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /**
         * [descr:dxDiagram.Options.editing]
         */
        editing?: { allowAddShape?: boolean, allowChangeConnection?: boolean, allowChangeConnectorPoints?: boolean, allowChangeConnectorText?: boolean, allowChangeShapeText?: boolean, allowDeleteConnector?: boolean, allowDeleteShape?: boolean, allowMoveShape?: boolean, allowResizeShape?: boolean };
        /**
         * [descr:dxDiagram.Options.export]
         */
        export?: { fileName?: string, proxyUrl?: string };
        /**
         * [descr:dxDiagram.Options.fullScreen]
         */
        fullScreen?: boolean;
        /**
         * [descr:dxDiagram.Options.gridSize]
         */
        gridSize?: number | { items?: Array<number>, value?: number };
        /**
         * [descr:dxDiagram.Options.hasChanges]
         */
        hasChanges?: boolean;
        /**
         * [descr:dxDiagram.Options.historyToolbar]
         */
        historyToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * [descr:dxDiagram.Options.mainToolbar]
         */
        mainToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * [descr:dxDiagram.Options.nodes]
         */
        nodes?: { autoLayout?: 'auto' | 'off' | 'tree' | 'layered' | { orientation?: 'vertical' | 'horizontal', type?: 'auto' | 'off' | 'tree' | 'layered' }, autoSizeEnabled?: boolean, containerChildrenExpr?: string | ((data: any) => any), containerKeyExpr?: string | ((data: any) => any), customDataExpr?: string | ((data: any) => any), dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, heightExpr?: string | ((data: any) => any), imageUrlExpr?: string | ((data: any) => any), itemsExpr?: string | ((data: any) => any), keyExpr?: string | ((data: any) => any), leftExpr?: string | ((data: any) => any), lockedExpr?: string | ((data: any) => any), parentKeyExpr?: string | ((data: any) => any), styleExpr?: string | ((data: any) => any), textExpr?: string | ((data: any) => any), textStyleExpr?: string | ((data: any) => any), topExpr?: string | ((data: any) => any), typeExpr?: string | ((data: any) => any), widthExpr?: string | ((data: any) => any), zIndexExpr?: string | ((data: any) => any) };
        /**
         * [descr:dxDiagram.Options.onCustomCommand]
         */
        onCustomCommand?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, name?: string }) => any);
        /**
         * [descr:dxDiagram.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /**
         * [descr:dxDiagram.Options.onItemDblClick]
         */
        onItemDblClick?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, item?: dxDiagramItem }) => any);
        /**
         * [descr:dxDiagram.Options.onRequestEditOperation]
         */
        onRequestEditOperation?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, operation?: 'addShape' | 'addShapeFromToolbox' | 'deleteShape' | 'deleteConnector' | 'changeConnection' | 'changeConnectorPoints' | 'beforeChangeShapeText' | 'changeShapeText' | 'beforeChangeConnectorText' | 'changeConnectorText' | 'resizeShape' | 'moveShape', args?: dxDiagramAddShapeArgs | dxDiagramAddShapeFromToolboxArgs | dxDiagramDeleteShapeArgs | dxDiagramDeleteConnectorArgs | dxDiagramChangeConnectionArgs | dxDiagramChangeConnectorPointsArgs | dxDiagramBeforeChangeShapeTextArgs | dxDiagramChangeShapeTextArgs | dxDiagramBeforeChangeConnectorTextArgs | dxDiagramChangeConnectorTextArgs | dxDiagramResizeShapeArgs | dxDiagramMoveShapeArgs, updateUI?: boolean, allowed?: boolean }) => any);
        /**
         * [descr:dxDiagram.Options.onRequestLayoutUpdate]
         */
        onRequestLayoutUpdate?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, changes?: Array<any>, allowed?: boolean }) => any);
        /**
         * [descr:dxDiagram.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxDiagram, element?: DevExpress.core.dxElement, model?: any, items?: Array<dxDiagramItem> }) => any);
        /**
         * [descr:dxDiagram.Options.pageColor]
         */
        pageColor?: string;
        /**
         * [descr:dxDiagram.Options.pageOrientation]
         */
        pageOrientation?: 'portrait' | 'landscape';
        /**
         * [descr:dxDiagram.Options.pageSize]
         */
        pageSize?: { height?: number, items?: Array<{ height?: number, text?: string, width?: number }>, width?: number };
        /**
         * [descr:dxDiagram.Options.propertiesPanel]
         */
        propertiesPanel?: { tabs?: Array<{ commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, groups?: Array<{ commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, title?: string }>, title?: string }>, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled' };
        /**
         * [descr:dxDiagram.Options.readOnly]
         */
        readOnly?: boolean;
        /**
         * [descr:dxDiagram.Options.showGrid]
         */
        showGrid?: boolean;
        /**
         * [descr:dxDiagram.Options.simpleView]
         */
        simpleView?: boolean;
        /**
         * [descr:dxDiagram.Options.snapToGrid]
         */
        snapToGrid?: boolean;
        /**
         * [descr:dxDiagram.Options.toolbox]
         */
        toolbox?: { groups?: Array<{ category?: 'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom' | string, displayMode?: 'icons' | 'texts', expanded?: boolean, shapes?: Array<'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight'> | Array<string>, title?: string }> | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>, shapeIconsPerRow?: number, showSearch?: boolean, visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled', width?: number };
        /**
         * [descr:dxDiagram.Options.units]
         */
        units?: 'in' | 'cm' | 'px';
        /**
         * [descr:dxDiagram.Options.viewToolbar]
         */
        viewToolbar?: { commands?: Array<dxDiagramCustomCommand> | Array<'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor'>, visible?: boolean };
        /**
         * [descr:dxDiagram.Options.viewUnits]
         */
        viewUnits?: 'in' | 'cm' | 'px';
        /**
         * [descr:dxDiagram.Options.zoomLevel]
         */
        zoomLevel?: number | { items?: Array<number>, value?: number };
    }
    /**
     * [descr:dxDiagram]
     */
    export class dxDiagram extends Widget {
        constructor(element: Element, options?: dxDiagramOptions)
        constructor(element: JQuery, options?: dxDiagramOptions)
        /**
         * [descr:dxDiagram.export()]
         */
        export(): string;
        /**
         * [descr:dxDiagram.exportTo(format, callback)]
         */
        exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
        /**
         * [descr:dxDiagram.getEdgeDataSource()]
         */
        getEdgeDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxDiagram.getItemById(id)]
         */
        getItemById(id: string): dxDiagramItem;
        /**
         * [descr:dxDiagram.getItemByKey(key)]
         */
        getItemByKey(key: any): dxDiagramItem;
        /**
         * [descr:dxDiagram.getNodeDataSource()]
         */
        getNodeDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxDiagram.import(data, updateExistingItemsOnly)]
         */
        import(data: string, updateExistingItemsOnly?: boolean): void;
        /**
         * [descr:dxDiagram.updateToolbox()]
         */
        updateToolbox(): void;
    }
    /**
     * [descr:dxDiagramAddShapeArgs]
     */
    export interface dxDiagramAddShapeArgs {
        /**
         * [descr:dxDiagramAddShapeArgs.position]
         */
        position?: any;
        /**
         * [descr:dxDiagramAddShapeArgs.shape]
         */
        shape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramAddShapeFromToolboxArgs]
     */
    export interface dxDiagramAddShapeFromToolboxArgs {
        /**
         * [descr:dxDiagramAddShapeFromToolboxArgs.shapeType]
         */
        shapeType?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    }
    /**
     * [descr:dxDiagramBeforeChangeConnectorTextArgs]
     */
    export interface dxDiagramBeforeChangeConnectorTextArgs {
        /**
         * [descr:dxDiagramBeforeChangeConnectorTextArgs.connector]
         */
        connector?: dxDiagramConnector;
        /**
         * [descr:dxDiagramBeforeChangeConnectorTextArgs.index]
         */
        index?: number;
    }
    /**
     * [descr:dxDiagramBeforeChangeShapeTextArgs]
     */
    export interface dxDiagramBeforeChangeShapeTextArgs {
        /**
         * [descr:dxDiagramBeforeChangeShapeTextArgs.shape]
         */
        shape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramChangeConnectionArgs]
     */
    export interface dxDiagramChangeConnectionArgs {
        /**
         * [descr:dxDiagramChangeConnectionArgs.connectionPointIndex]
         */
        connectionPointIndex?: number;
        /**
         * [descr:dxDiagramChangeConnectionArgs.connector]
         */
        connector?: dxDiagramConnector;
        /**
         * [descr:dxDiagramChangeConnectionArgs.connectorPosition]
         */
        connectorPosition?: 'start' | 'end';
        /**
         * [descr:dxDiagramChangeConnectionArgs.newShape]
         */
        newShape?: dxDiagramShape;
        /**
         * [descr:dxDiagramChangeConnectionArgs.oldShape]
         */
        oldShape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramChangeConnectorPointsArgs]
     */
    export interface dxDiagramChangeConnectorPointsArgs {
        /**
         * [descr:dxDiagramChangeConnectorPointsArgs.connector]
         */
        connector?: dxDiagramConnector;
        /**
         * [descr:dxDiagramChangeConnectorPointsArgs.newPoints]
         */
        newPoints?: Array<any>;
        /**
         * [descr:dxDiagramChangeConnectorPointsArgs.oldPoints]
         */
        oldPoints?: Array<any>;
    }
    /**
     * [descr:dxDiagramChangeConnectorTextArgs]
     */
    export interface dxDiagramChangeConnectorTextArgs {
        /**
         * [descr:dxDiagramChangeConnectorTextArgs.connector]
         */
        connector?: dxDiagramConnector;
        /**
         * [descr:dxDiagramChangeConnectorTextArgs.index]
         */
        index?: number;
        /**
         * [descr:dxDiagramChangeConnectorTextArgs.text]
         */
        text?: string;
    }
    /**
     * [descr:dxDiagramChangeShapeTextArgs]
     */
    export interface dxDiagramChangeShapeTextArgs {
        /**
         * [descr:dxDiagramChangeShapeTextArgs.shape]
         */
        shape?: dxDiagramShape;
        /**
         * [descr:dxDiagramChangeShapeTextArgs.text]
         */
        text?: string;
    }
    /**
     * [descr:dxDiagramConnector]
     */
    export interface dxDiagramConnector extends dxDiagramItem {
        /**
         * [descr:dxDiagramConnector.fromId]
         */
        fromId?: string;
        /**
         * [descr:dxDiagramConnector.fromKey]
         */
        fromKey?: any;
        /**
         * [descr:dxDiagramConnector.fromPointIndex]
         */
        fromPointIndex?: number;
        /**
         * [descr:dxDiagramConnector.points]
         */
        points?: Array<any>;
        /**
         * [descr:dxDiagramConnector.texts]
         */
        texts?: Array<string>;
        /**
         * [descr:dxDiagramConnector.toId]
         */
        toId?: string;
        /**
         * [descr:dxDiagramConnector.toKey]
         */
        toKey?: any;
        /**
         * [descr:dxDiagramConnector.toPointIndex]
         */
        toPointIndex?: number;
    }
    /**
     * [descr:dxDiagramCustomCommand]
     */
    export interface dxDiagramCustomCommand {
        /**
         * [descr:dxDiagramCustomCommand.icon]
         */
        icon?: string;
        /**
         * [descr:dxDiagramCustomCommand.items]
         */
        items?: Array<dxDiagramCustomCommand>;
        /**
         * [descr:dxDiagramCustomCommand.name]
         */
        name?: string | 'separator' | 'exportSvg' | 'exportPng' | 'exportJpg' | 'undo' | 'redo' | 'cut' | 'copy' | 'paste' | 'selectAll' | 'delete' | 'fontName' | 'fontSize' | 'bold' | 'italic' | 'underline' | 'fontColor' | 'lineColor' | 'fillColor' | 'textAlignLeft' | 'textAlignCenter' | 'textAlignRight' | 'lock' | 'unlock' | 'sendToBack' | 'bringToFront' | 'insertShapeImage' | 'editShapeImage' | 'deleteShapeImage' | 'connectorLineType' | 'connectorLineStart' | 'connectorLineEnd' | 'layoutTreeTopToBottom' | 'layoutTreeBottomToTop' | 'layoutTreeLeftToRight' | 'layoutTreeRightToLeft' | 'layoutLayeredTopToBottom' | 'layoutLayeredBottomToTop' | 'layoutLayeredLeftToRight' | 'layoutLayeredRightToLeft' | 'fullScreen' | 'zoomLevel' | 'showGrid' | 'snapToGrid' | 'gridSize' | 'units' | 'pageSize' | 'pageOrientation' | 'pageColor';
        /**
         * [descr:dxDiagramCustomCommand.text]
         */
        text?: string;
    }
    /**
     * [descr:dxDiagramDeleteConnectorArgs]
     */
    export interface dxDiagramDeleteConnectorArgs {
        /**
         * [descr:dxDiagramDeleteConnectorArgs.connector]
         */
        connector?: dxDiagramConnector;
    }
    /**
     * [descr:dxDiagramDeleteShapeArgs]
     */
    export interface dxDiagramDeleteShapeArgs {
        /**
         * [descr:dxDiagramDeleteShapeArgs.shape]
         */
        shape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramItem]
     */
    export interface dxDiagramItem {
        /**
         * [descr:dxDiagramItem.dataItem]
         */
        dataItem?: any;
        /**
         * [descr:dxDiagramItem.id]
         */
        id?: string;
        /**
         * [descr:dxDiagramItem.itemType]
         */
        itemType?: 'shape' | 'connector';
        /**
         * [descr:dxDiagramItem.key]
         */
        key?: any;
    }
    /**
     * [descr:dxDiagramMoveShapeArgs]
     */
    export interface dxDiagramMoveShapeArgs {
        /**
         * [descr:dxDiagramMoveShapeArgs.newPosition]
         */
        newPosition?: Array<any>;
        /**
         * [descr:dxDiagramMoveShapeArgs.oldPosition]
         */
        oldPosition?: Array<any>;
        /**
         * [descr:dxDiagramMoveShapeArgs.shape]
         */
        shape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramResizeShapeArgs]
     */
    export interface dxDiagramResizeShapeArgs {
        /**
         * [descr:dxDiagramResizeShapeArgs.newSize]
         */
        newSize?: Array<any>;
        /**
         * [descr:dxDiagramResizeShapeArgs.oldSize]
         */
        oldSize?: Array<any>;
        /**
         * [descr:dxDiagramResizeShapeArgs.shape]
         */
        shape?: dxDiagramShape;
    }
    /**
     * [descr:dxDiagramShape]
     */
    export interface dxDiagramShape extends dxDiagramItem {
        /**
         * [descr:dxDiagramShape.attachedConnectorIds]
         */
        attachedConnectorIds?: Array<string>;
        /**
         * [descr:dxDiagramShape.position]
         */
        position?: any;
        /**
         * [descr:dxDiagramShape.size]
         */
        size?: any;
        /**
         * [descr:dxDiagramShape.text]
         */
        text?: string;
        /**
         * [descr:dxDiagramShape.type]
         */
        type?: 'text' | 'rectangle' | 'ellipse' | 'cross' | 'triangle' | 'diamond' | 'heart' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'arrowLeft' | 'arrowTop' | 'arrowRight' | 'arrowBottom' | 'arrowNorthSouth' | 'arrowEastWest' | 'process' | 'decision' | 'terminator' | 'predefinedProcess' | 'document' | 'multipleDocuments' | 'manualInput' | 'preparation' | 'data' | 'database' | 'hardDisk' | 'internalStorage' | 'paperTape' | 'manualOperation' | 'delay' | 'storedData' | 'display' | 'merge' | 'connector' | 'or' | 'summingJunction' | 'verticalContainer' | 'horizontalContainer' | 'cardWithImageOnLeft' | 'cardWithImageOnTop' | 'cardWithImageOnRight' | string;
    }
    /**
     * [descr:dxDraggable.Options]
     */
    export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
        /**
         * [descr:dxDraggable.Options.clone]
         */
        clone?: boolean;
        /**
         * [descr:dxDraggable.Options.dragTemplate]
         */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDraggable.Options.onDragEnd]
         */
        onDragEnd?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * [descr:dxDraggable.Options.onDragMove]
         */
        onDragMove?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * [descr:dxDraggable.Options.onDragStart]
         */
        onDragStart?: ((e: { component?: dxDraggable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any);
    }
    /**
     * [descr:dxDraggable]
     */
    export class dxDraggable extends DraggableBase {
        constructor(element: Element, options?: dxDraggableOptions)
        constructor(element: JQuery, options?: dxDraggableOptions)
    }
    /**
     * [descr:dxDrawer.Options]
     */
    export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
        /**
         * [descr:dxDrawer.Options.animationDuration]
         */
        animationDuration?: number;
        /**
         * [descr:dxDrawer.Options.animationEnabled]
         */
        animationEnabled?: boolean;
        /**
         * [descr:dxDrawer.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * [descr:dxDrawer.Options.maxSize]
         */
        maxSize?: number;
        /**
         * [descr:dxDrawer.Options.minSize]
         */
        minSize?: number;
        /**
         * [descr:dxDrawer.Options.opened]
         */
        opened?: boolean;
        /**
         * [descr:dxDrawer.Options.openedStateMode]
         */
        openedStateMode?: 'overlap' | 'shrink' | 'push';
        /**
         * [descr:dxDrawer.Options.position]
         */
        position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
        /**
         * [descr:dxDrawer.Options.revealMode]
         */
        revealMode?: 'slide' | 'expand';
        /**
         * [descr:dxDrawer.Options.shading]
         */
        shading?: boolean;
        /**
         * [descr:dxDrawer.Options.target]
         * @deprecated [depNote:dxDrawer.Options.target]
         */
        target?: string | Element | JQuery;
        /**
         * [descr:dxDrawer.Options.template]
         */
        template?: DevExpress.core.template | ((Element: DevExpress.core.dxElement) => any);
    }
    /**
     * [descr:dxDrawer]
     */
    export class dxDrawer extends Widget {
        constructor(element: Element, options?: dxDrawerOptions)
        constructor(element: JQuery, options?: dxDrawerOptions)
        /**
         * [descr:dxDrawer.content()]
         */
        content(): DevExpress.core.dxElement;
        /**
         * [descr:dxDrawer.hide()]
         */
        hide(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDrawer.show()]
         */
        show(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDrawer.toggle()]
         */
        toggle(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxDropDownBox.Options]
     */
    export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
        /**
         * [descr:dxDropDownBox.Options.acceptCustomValue]
         */
        acceptCustomValue?: boolean;
        /**
         * [descr:dxDropDownBox.Options.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownBox.Options.displayValueFormatter]
         */
        displayValueFormatter?: ((value: string | Array<any>) => string);
        /**
         * [descr:dxDropDownBox.Options.fieldTemplate]
         */
        fieldTemplate?: DevExpress.core.template | ((value: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownBox.Options.openOnFieldClick]
         */
        openOnFieldClick?: boolean;
        /**
         * [descr:dxDropDownBox.Options.valueChangeEvent]
         */
        valueChangeEvent?: string;
    }
    /**
     * [descr:dxDropDownBox]
     */
    export class dxDropDownBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownBoxOptions)
        constructor(element: JQuery, options?: dxDropDownBoxOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:dxDropDownButton.Options]
     */
    export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
        /**
         * [descr:dxDropDownButton.Options.dataSource]
         */
        dataSource?: string | Array<dxDropDownButtonItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxDropDownButton.Options.deferRendering]
         */
        deferRendering?: boolean;
        /**
         * [descr:dxDropDownButton.Options.displayExpr]
         */
        displayExpr?: string | ((itemData: any) => string);
        /**
         * [descr:dxDropDownButton.Options.dropDownContentTemplate]
         */
        dropDownContentTemplate?: DevExpress.core.template | ((data: Array<string | number | any> | DevExpress.data.DataSource, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownButton.Options.dropDownOptions]
         */
        dropDownOptions?: dxPopupOptions;
        /**
         * [descr:dxDropDownButton.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxDropDownButton.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxDropDownButton.Options.icon]
         */
        icon?: string;
        /**
         * [descr:dxDropDownButton.Options.itemTemplate]
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownButton.Options.items]
         */
        items?: Array<dxDropDownButtonItem | any>;
        /**
         * [descr:dxDropDownButton.Options.keyExpr]
         */
        keyExpr?: string;
        /**
         * [descr:dxDropDownButton.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:dxDropDownButton.Options.onButtonClick]
         */
        onButtonClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, selectedItem?: any }) => any) | string;
        /**
         * [descr:dxDropDownButton.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any) | string;
        /**
         * [descr:dxDropDownButton.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, item?: any, previousItem?: any }) => any) | string;
        /**
         * [descr:dxDropDownButton.Options.opened]
         */
        opened?: boolean;
        /**
         * [descr:dxDropDownButton.Options.selectedItem]
         */
        selectedItem?: string | number | any;
        /**
         * [descr:dxDropDownButton.Options.selectedItemKey]
         */
        selectedItemKey?: string | number;
        /**
         * [descr:dxDropDownButton.Options.showArrowIcon]
         */
        showArrowIcon?: boolean;
        /**
         * [descr:dxDropDownButton.Options.splitButton]
         */
        splitButton?: boolean;
        /**
         * [descr:dxDropDownButton.Options.stylingMode]
         */
        stylingMode?: 'text' | 'outlined' | 'contained';
        /**
         * [descr:dxDropDownButton.Options.text]
         */
        text?: string;
        /**
         * [descr:dxDropDownButton.Options.useSelectMode]
         */
        useSelectMode?: boolean;
        /**
         * [descr:dxDropDownButton.Options.wrapItemText]
         */
        wrapItemText?: boolean;
    }
    /**
     * [descr:dxDropDownButton]
     */
    export class dxDropDownButton extends Widget {
        constructor(element: Element, options?: dxDropDownButtonOptions)
        constructor(element: JQuery, options?: dxDropDownButtonOptions)
        /**
         * [descr:dxDropDownButton.close()]
         */
        close(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxDropDownButton.open()]
         */
        open(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDropDownButton.toggle()]
         */
        toggle(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxDropDownButton.toggle(visibility)]
         */
        toggle(visibility: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxDropDownButtonItem]
     */
    export interface dxDropDownButtonItem extends dxListItem {
        /**
         * [descr:dxDropDownButtonItem.onClick]
         */
        onClick?: ((e: { component?: dxDropDownButton, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any) | string;
    }
    /**
     * [descr:dxDropDownEditor.Options]
     */
    export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
        /**
         * [descr:dxDropDownEditor.Options.acceptCustomValue]
         */
        acceptCustomValue?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.applyValueMode]
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * [descr:dxDropDownEditor.Options.buttons]
         */
        buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
        /**
         * [descr:dxDropDownEditor.Options.deferRendering]
         */
        deferRendering?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.dropDownButtonTemplate]
         */
        dropDownButtonTemplate?: DevExpress.core.template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownEditor.Options.dropDownOptions]
         */
        dropDownOptions?: dxPopupOptions;
        /**
         * [descr:dxDropDownEditor.Options.onClosed]
         */
        onClosed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxDropDownEditor.Options.onOpened]
         */
        onOpened?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxDropDownEditor.Options.openOnFieldClick]
         */
        openOnFieldClick?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.opened]
         */
        opened?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.showDropDownButton]
         */
        showDropDownButton?: boolean;
        /**
         * [descr:dxDropDownEditor.Options.value]
         */
        value?: any;
    }
    /**
     * [descr:dxDropDownEditor]
     */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: Element, options?: dxDropDownEditorOptions)
        constructor(element: JQuery, options?: dxDropDownEditorOptions)
        /**
         * [descr:dxDropDownEditor.close()]
         */
        close(): void;
        /**
         * [descr:dxDropDownEditor.content()]
         */
        content(): DevExpress.core.dxElement;
        /**
         * [descr:dxDropDownEditor.field()]
         */
        field(): DevExpress.core.dxElement;
        /**
         * [descr:dxDropDownEditor.open()]
         */
        open(): void;
    }
    /**
     * [descr:dxDropDownList.Options]
     */
    export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
        /**
         * [descr:dxDropDownList.Options.displayValue]
         */
        displayValue?: string;
        /**
         * [descr:dxDropDownList.Options.groupTemplate]
         */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxDropDownList.Options.grouped]
         */
        grouped?: boolean;
        /**
         * [descr:dxDropDownList.Options.minSearchLength]
         */
        minSearchLength?: number;
        /**
         * [descr:dxDropDownList.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:dxDropDownList.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: any, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxDropDownList.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, selectedItem?: any }) => any);
        /**
         * [descr:dxDropDownList.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxDropDownList.Options.searchEnabled]
         */
        searchEnabled?: boolean;
        /**
         * [descr:dxDropDownList.Options.searchExpr]
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * [descr:dxDropDownList.Options.searchMode]
         */
        searchMode?: 'contains' | 'startswith';
        /**
         * [descr:dxDropDownList.Options.searchTimeout]
         */
        searchTimeout?: number;
        /**
         * [descr:dxDropDownList.Options.selectedItem]
         */
        selectedItem?: any;
        /**
         * [descr:dxDropDownList.Options.showDataBeforeSearch]
         */
        showDataBeforeSearch?: boolean;
        /**
         * [descr:dxDropDownList.Options.value]
         */
        value?: any;
        /**
         * [descr:dxDropDownList.Options.valueChangeEvent]
         */
        valueChangeEvent?: string;
        /**
         * [descr:dxDropDownList.Options.wrapItemText]
         */
        wrapItemText?: boolean;
    }
    /**
     * [descr:dxDropDownList]
     */
    export class dxDropDownList extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownListOptions)
        constructor(element: JQuery, options?: dxDropDownListOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:dxFileManager.Options]
     */
    export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
        /**
         * [descr:dxFileManager.Options.allowedFileExtensions]
         */
        allowedFileExtensions?: Array<string>;
        /**
         * [descr:dxFileManager.Options.contextMenu]
         */
        contextMenu?: dxFileManagerContextMenu;
        /**
         * [descr:dxFileManager.Options.currentPath]
         */
        currentPath?: string;
        /**
         * [descr:dxFileManager.Options.currentPathKeys]
         */
        currentPathKeys?: Array<string>;
        /**
         * [descr:dxFileManager.Options.customizeDetailColumns]
         */
        customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
        /**
         * [descr:dxFileManager.Options.customizeThumbnail]
         */
        customizeThumbnail?: ((fileSystemItem: DevExpress.fileManagement.FileSystemItem) => string);
        /**
         * [descr:dxFileManager.Options.fileSystemProvider]
         */
        fileSystemProvider?: any;
        /**
         * [descr:dxFileManager.Options.focusedItemKey]
         */
        focusedItemKey?: string;
        /**
         * [descr:dxFileManager.Options.itemView]
         */
        itemView?: { details?: { columns?: Array<dxFileManagerDetailsColumn | string> }, mode?: 'details' | 'thumbnails', showFolders?: boolean, showParentFolder?: boolean };
        /**
         * [descr:dxFileManager.Options.onContextMenuItemClick]
         */
        onContextMenuItemClick?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, fileSystemItem?: DevExpress.fileManagement.FileSystemItem, viewArea?: 'navPane' | 'itemView' }) => any);
        /**
         * [descr:dxFileManager.Options.onCurrentDirectoryChanged]
         */
        onCurrentDirectoryChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, directory?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * [descr:dxFileManager.Options.onErrorOccurred]
         */
        onErrorOccurred?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, errorCode?: number, errorText?: string, fileSystemItem?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * [descr:dxFileManager.Options.onFocusedItemChanged]
         */
        onFocusedItemChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, item?: DevExpress.fileManagement.FileSystemItem, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxFileManager.Options.onSelectedFileOpened]
         */
        onSelectedFileOpened?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, file?: DevExpress.fileManagement.FileSystemItem }) => any);
        /**
         * [descr:dxFileManager.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, currentSelectedItemKeys?: Array<string>, currentDeselectedItemKeys?: Array<string>, selectedItems?: Array<DevExpress.fileManagement.FileSystemItem>, selectedItemKeys?: Array<string> }) => any);
        /**
         * [descr:dxFileManager.Options.onToolbarItemClick]
         */
        onToolbarItemClick?: ((e: { component?: dxFileManager, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxFileManager.Options.permissions]
         */
        permissions?: { copy?: boolean, create?: boolean, delete?: boolean, download?: boolean, move?: boolean, rename?: boolean, upload?: boolean };
        /**
         * [descr:dxFileManager.Options.rootFolderName]
         */
        rootFolderName?: string;
        /**
         * [descr:dxFileManager.Options.selectedItemKeys]
         */
        selectedItemKeys?: Array<string>;
        /**
         * [descr:dxFileManager.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxFileManager.Options.toolbar]
         */
        toolbar?: dxFileManagerToolbar;
        /**
         * [descr:dxFileManager.Options.upload]
         */
        upload?: { chunkSize?: number, maxFileSize?: number };
    }
    /**
     * [descr:dxFileManager]
     */
    export class dxFileManager extends Widget {
        constructor(element: Element, options?: dxFileManagerOptions)
        constructor(element: JQuery, options?: dxFileManagerOptions)
        /**
         * [descr:dxFileManager.getCurrentDirectory()]
         */
        getCurrentDirectory(): any;
        /**
         * [descr:dxFileManager.getSelectedItems()]
         */
        getSelectedItems(): Array<any>;
        /**
         * [descr:dxFileManager.refresh()]
         */
        refresh(): Promise<any> & JQueryPromise<any>;
    }
    /**
     * [descr:dxFileManagerContextMenu]
     */
    export interface dxFileManagerContextMenu {
        /**
         * [descr:dxFileManagerContextMenu.items]
         */
        items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
    }
    /**
     * [descr:dxFileManagerContextMenuItem]
     */
    export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
        /**
         * [descr:dxFileManagerContextMenuItem.items]
         */
        items?: Array<dxFileManagerContextMenuItem>;
        /**
         * [descr:dxFileManagerContextMenuItem.name]
         */
        name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
        /**
         * [descr:dxFileManagerContextMenuItem.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxFileManagerDetailsColumn]
     */
    export interface dxFileManagerDetailsColumn {
        /**
         * [descr:dxFileManagerDetailsColumn.alignment]
         */
        alignment?: 'center' | 'left' | 'right' | undefined;
        /**
         * [descr:dxFileManagerDetailsColumn.caption]
         */
        caption?: string;
        /**
         * [descr:dxFileManagerDetailsColumn.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFileManagerDetailsColumn.dataField]
         */
        dataField?: string;
        /**
         * [descr:dxFileManagerDetailsColumn.dataType]
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * [descr:dxFileManagerDetailsColumn.hidingPriority]
         */
        hidingPriority?: number;
        /**
         * [descr:dxFileManagerDetailsColumn.sortIndex]
         */
        sortIndex?: number;
        /**
         * [descr:dxFileManagerDetailsColumn.sortOrder]
         */
        sortOrder?: 'asc' | 'desc' | undefined;
        /**
         * [descr:dxFileManagerDetailsColumn.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFileManagerDetailsColumn.visibleIndex]
         */
        visibleIndex?: number;
        /**
         * [descr:dxFileManagerDetailsColumn.width]
         */
        width?: number | string;
    }
    /**
     * [descr:dxFileManagerToolbar]
     */
    export interface dxFileManagerToolbar {
        /**
         * [descr:dxFileManagerToolbar.fileSelectionItems]
         */
        fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
        /**
         * [descr:dxFileManagerToolbar.items]
         */
        items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    }
    /**
     * [descr:dxFileManagerToolbarItem]
     */
    export interface dxFileManagerToolbarItem extends dxToolbarItem {
        /**
         * [descr:dxFileManagerToolbarItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxFileManagerToolbarItem.location]
         */
        location?: 'after' | 'before' | 'center';
        /**
         * [descr:dxFileManagerToolbarItem.name]
         */
        name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
        /**
         * [descr:dxFileManagerToolbarItem.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxFileUploader.Options]
     */
    export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
        /**
         * [descr:dxFileUploader.Options.abortUpload]
         */
        abortUpload?: ((file: File, uploadInfo?: DevExpress.fileManagement.UploadInfo) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:dxFileUploader.Options.accept]
         */
        accept?: string;
        /**
         * [descr:dxFileUploader.Options.allowCanceling]
         */
        allowCanceling?: boolean;
        /**
         * [descr:dxFileUploader.Options.allowedFileExtensions]
         */
        allowedFileExtensions?: Array<string>;
        /**
         * [descr:dxFileUploader.Options.chunkSize]
         */
        chunkSize?: number;
        /**
         * [descr:dxFileUploader.Options.dialogTrigger]
         */
        dialogTrigger?: string | Element | JQuery;
        /**
         * [descr:dxFileUploader.Options.dropZone]
         */
        dropZone?: string | Element | JQuery;
        /**
         * [descr:dxFileUploader.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxFileUploader.Options.inputAttr]
         */
        inputAttr?: any;
        /**
         * [descr:dxFileUploader.Options.invalidFileExtensionMessage]
         */
        invalidFileExtensionMessage?: string;
        /**
         * [descr:dxFileUploader.Options.invalidMaxFileSizeMessage]
         */
        invalidMaxFileSizeMessage?: string;
        /**
         * [descr:dxFileUploader.Options.invalidMinFileSizeMessage]
         */
        invalidMinFileSizeMessage?: string;
        /**
         * [descr:dxFileUploader.Options.labelText]
         */
        labelText?: string;
        /**
         * [descr:dxFileUploader.Options.maxFileSize]
         */
        maxFileSize?: number;
        /**
         * [descr:dxFileUploader.Options.minFileSize]
         */
        minFileSize?: number;
        /**
         * [descr:dxFileUploader.Options.multiple]
         */
        multiple?: boolean;
        /**
         * [descr:dxFileUploader.Options.name]
         */
        name?: string;
        /**
         * [descr:dxFileUploader.Options.onBeforeSend]
         */
        onBeforeSend?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, request?: XMLHttpRequest, file?: File, uploadInfo?: DevExpress.fileManagement.UploadInfo }) => any);
        /**
         * [descr:dxFileUploader.Options.onDropZoneEnter]
         */
        onDropZoneEnter?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, dropZoneElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxFileUploader.Options.onDropZoneLeave]
         */
        onDropZoneLeave?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, dropZoneElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxFileUploader.Options.onFilesUploaded]
         */
        onFilesUploaded?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxFileUploader.Options.onProgress]
         */
        onProgress?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * [descr:dxFileUploader.Options.onUploadAborted]
         */
        onUploadAborted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest, message?: string }) => any);
        /**
         * [descr:dxFileUploader.Options.onUploadError]
         */
        onUploadError?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest, error?: any, message?: string }) => any);
        /**
         * [descr:dxFileUploader.Options.onUploadStarted]
         */
        onUploadStarted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest }) => any);
        /**
         * [descr:dxFileUploader.Options.onUploaded]
         */
        onUploaded?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, event?: DevExpress.events.event, request?: XMLHttpRequest, message?: string }) => any);
        /**
         * [descr:dxFileUploader.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxFileUploader.Options.progress]
         */
        progress?: number;
        /**
         * [descr:dxFileUploader.Options.readyToUploadMessage]
         */
        readyToUploadMessage?: string;
        /**
         * [descr:dxFileUploader.Options.selectButtonText]
         */
        selectButtonText?: string;
        /**
         * [descr:dxFileUploader.Options.showFileList]
         */
        showFileList?: boolean;
        /**
         * [descr:dxFileUploader.Options.uploadAbortedMessage]
         */
        uploadAbortedMessage?: string;
        /**
         * [descr:dxFileUploader.Options.uploadButtonText]
         */
        uploadButtonText?: string;
        /**
         * [descr:dxFileUploader.Options.uploadChunk]
         */
        uploadChunk?: ((file: File, uploadInfo: DevExpress.fileManagement.UploadInfo) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:dxFileUploader.Options.uploadCustomData]
         */
        uploadCustomData?: any;
        /**
         * [descr:dxFileUploader.Options.uploadFailedMessage]
         */
        uploadFailedMessage?: string;
        /**
         * [descr:dxFileUploader.Options.uploadFile]
         */
        uploadFile?: ((file: File, progressCallback: Function) => Promise<any> | JQueryPromise<any> | any);
        /**
         * [descr:dxFileUploader.Options.uploadHeaders]
         */
        uploadHeaders?: any;
        /**
         * [descr:dxFileUploader.Options.uploadMethod]
         */
        uploadMethod?: 'POST' | 'PUT';
        /**
         * [descr:dxFileUploader.Options.uploadMode]
         */
        uploadMode?: 'instantly' | 'useButtons' | 'useForm';
        /**
         * [descr:dxFileUploader.Options.uploadUrl]
         */
        uploadUrl?: string;
        /**
         * [descr:dxFileUploader.Options.uploadedMessage]
         */
        uploadedMessage?: string;
        /**
         * [descr:dxFileUploader.Options.value]
         */
        value?: Array<File>;
    }
    /**
     * [descr:dxFileUploader]
     */
    export class dxFileUploader extends Editor {
        constructor(element: Element, options?: dxFileUploaderOptions)
        constructor(element: JQuery, options?: dxFileUploaderOptions)
        /**
         * [descr:dxFileUploader.abortUpload()]
         */
        abortUpload(): void;
        /**
         * [descr:dxFileUploader.abortUpload(file)]
         */
        abortUpload(file: File): void;
        /**
         * [descr:dxFileUploader.abortUpload(fileIndex)]
         */
        abortUpload(fileIndex: number): void;
        /**
         * [descr:dxFileUploader.removeFile(file)]
         */
        removeFile(file: File): void;
        /**
         * [descr:dxFileUploader.removeFile(fileIndex)]
         */
        removeFile(fileIndex: number): void;
        /**
         * [descr:dxFileUploader.upload()]
         */
        upload(): void;
        /**
         * [descr:dxFileUploader.upload(file)]
         */
        upload(file: File): void;
        /**
         * [descr:dxFileUploader.upload(fileIndex)]
         */
        upload(fileIndex: number): void;
    }
    /**
     * [descr:dxFilterBuilder.Options]
     */
    export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
        /**
         * [descr:dxFilterBuilder.Options.allowHierarchicalFields]
         */
        allowHierarchicalFields?: boolean;
        /**
         * [descr:dxFilterBuilder.Options.customOperations]
         */
        customOperations?: Array<dxFilterBuilderCustomOperation>;
        /**
         * [descr:dxFilterBuilder.Options.fields]
         */
        fields?: Array<dxFilterBuilderField>;
        /**
         * [descr:dxFilterBuilder.Options.filterOperationDescriptions]
         */
        filterOperationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string };
        /**
         * [descr:dxFilterBuilder.Options.groupOperationDescriptions]
         */
        groupOperationDescriptions?: { and?: string, notAnd?: string, notOr?: string, or?: string };
        /**
         * [descr:dxFilterBuilder.Options.groupOperations]
         */
        groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
        /**
         * [descr:dxFilterBuilder.Options.maxGroupLevel]
         */
        maxGroupLevel?: number;
        /**
         * [descr:dxFilterBuilder.Options.onEditorPrepared]
         */
        onEditorPrepared?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, editorElement?: DevExpress.core.dxElement, editorName?: string, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /**
         * [descr:dxFilterBuilder.Options.onEditorPreparing]
         */
        onEditorPreparing?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, cancel?: boolean, editorElement?: DevExpress.core.dxElement, editorName?: string, editorOptions?: any, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /**
         * [descr:dxFilterBuilder.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any }) => any);
        /**
         * [descr:dxFilterBuilder.Options.value]
         */
        value?: string | Array<any> | Function;
    }
    /**
     * [descr:dxFilterBuilder]
     */
    export class dxFilterBuilder extends Widget {
        constructor(element: Element, options?: dxFilterBuilderOptions)
        constructor(element: JQuery, options?: dxFilterBuilderOptions)
        /**
         * [descr:dxFilterBuilder.getFilterExpression()]
         */
        getFilterExpression(): string | Array<any> | Function;
    }
    /**
     * [descr:dxFilterBuilderCustomOperation]
     */
    export interface dxFilterBuilderCustomOperation {
        /**
         * [descr:dxFilterBuilderCustomOperation.calculateFilterExpression]
         */
        calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
        /**
         * [descr:dxFilterBuilderCustomOperation.caption]
         */
        caption?: string;
        /**
         * [descr:dxFilterBuilderCustomOperation.customizeText]
         */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string, field?: dxFilterBuilderField }) => string);
        /**
         * [descr:dxFilterBuilderCustomOperation.dataTypes]
         */
        dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
        /**
         * [descr:dxFilterBuilderCustomOperation.editorTemplate]
         */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxFilterBuilderCustomOperation.hasValue]
         */
        hasValue?: boolean;
        /**
         * [descr:dxFilterBuilderCustomOperation.icon]
         */
        icon?: string;
        /**
         * [descr:dxFilterBuilderCustomOperation.name]
         */
        name?: string;
    }
    /**
     * [descr:dxFilterBuilderField]
     */
    export interface dxFilterBuilderField {
        /**
         * [descr:dxFilterBuilderField.calculateFilterExpression]
         */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
        /**
         * [descr:dxFilterBuilderField.caption]
         */
        caption?: string;
        /**
         * [descr:dxFilterBuilderField.customizeText]
         */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string }) => string);
        /**
         * [descr:dxFilterBuilderField.dataField]
         */
        dataField?: string;
        /**
         * [descr:dxFilterBuilderField.dataType]
         */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /**
         * [descr:dxFilterBuilderField.editorOptions]
         */
        editorOptions?: any;
        /**
         * [descr:dxFilterBuilderField.editorTemplate]
         */
        editorTemplate?: DevExpress.core.template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxFilterBuilderField.falseText]
         */
        falseText?: string;
        /**
         * [descr:dxFilterBuilderField.filterOperations]
         */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
        /**
         * [descr:dxFilterBuilderField.format]
         */
        format?: format;
        /**
         * [descr:dxFilterBuilderField.lookup]
         */
        lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store, displayExpr?: string | ((data: any) => string), valueExpr?: string | ((data: any) => string | number | boolean) };
        /**
         * [descr:dxFilterBuilderField.name]
         */
        name?: string;
        /**
         * [descr:dxFilterBuilderField.trueText]
         */
        trueText?: string;
    }
    /**
     * [descr:dxForm.Options]
     */
    export interface dxFormOptions extends WidgetOptions<dxForm> {
        /**
         * [descr:dxForm.Options.alignItemLabels]
         */
        alignItemLabels?: boolean;
        /**
         * [descr:dxForm.Options.alignItemLabelsInAllGroups]
         */
        alignItemLabelsInAllGroups?: boolean;
        /**
         * [descr:dxForm.Options.colCount]
         */
        colCount?: number | 'auto';
        /**
         * [descr:dxForm.Options.colCountByScreen]
         */
        colCountByScreen?: any;
        /**
         * [descr:dxForm.Options.customizeItem]
         */
        customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
        /**
         * [descr:dxForm.Options.formData]
         */
        formData?: any;
        /**
         * [descr:dxForm.Options.items]
         */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /**
         * [descr:dxForm.Options.labelLocation]
         */
        labelLocation?: 'left' | 'right' | 'top';
        /**
         * [descr:dxForm.Options.minColWidth]
         */
        minColWidth?: number;
        /**
         * [descr:dxForm.Options.onEditorEnterKey]
         */
        onEditorEnterKey?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string }) => any);
        /**
         * [descr:dxForm.Options.onFieldDataChanged]
         */
        onFieldDataChanged?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string, value?: any }) => any);
        /**
         * [descr:dxForm.Options.optionalMark]
         */
        optionalMark?: string;
        /**
         * [descr:dxForm.Options.readOnly]
         */
        readOnly?: boolean;
        /**
         * [descr:dxForm.Options.requiredMark]
         */
        requiredMark?: string;
        /**
         * [descr:dxForm.Options.requiredMessage]
         */
        requiredMessage?: string;
        /**
         * [descr:dxForm.Options.screenByWidth]
         */
        screenByWidth?: Function;
        /**
         * [descr:dxForm.Options.scrollingEnabled]
         */
        scrollingEnabled?: boolean;
        /**
         * [descr:dxForm.Options.showColonAfterLabel]
         */
        showColonAfterLabel?: boolean;
        /**
         * [descr:dxForm.Options.showOptionalMark]
         */
        showOptionalMark?: boolean;
        /**
         * [descr:dxForm.Options.showRequiredMark]
         */
        showRequiredMark?: boolean;
        /**
         * [descr:dxForm.Options.showValidationSummary]
         */
        showValidationSummary?: boolean;
        /**
         * [descr:dxForm.Options.validationGroup]
         */
        validationGroup?: string;
    }
    /**
     * [descr:dxForm]
     */
    export class dxForm extends Widget {
        constructor(element: Element, options?: dxFormOptions)
        constructor(element: JQuery, options?: dxFormOptions)
        /**
         * [descr:dxForm.getButton(name)]
         */
        getButton(name: string): dxButton | undefined;
        /**
         * [descr:dxForm.getEditor(dataField)]
         */
        getEditor(dataField: string): Editor | undefined;
        /**
         * [descr:dxForm.itemOption(id)]
         */
        itemOption(id: string): any;
        /**
         * [descr:dxForm.itemOption(id, option, value)]
         */
        itemOption(id: string, option: string, value: any): void;
        /**
         * [descr:dxForm.itemOption(id, options)]
         */
        itemOption(id: string, options: any): void;
        /**
         * [descr:dxForm.resetValues()]
         */
        resetValues(): void;
        /**
         * [descr:dxForm.updateData(data)]
         */
        updateData(data: any): void;
        /**
         * [descr:dxForm.updateData(dataField, value)]
         */
        updateData(dataField: string, value: any): void;
        /**
         * [descr:dxForm.updateDimensions()]
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxForm.validate()]
         */
        validate(): dxValidationGroupResult;
    }
    /**
     * [descr:dxFormButtonItem]
     */
    export interface dxFormButtonItem {
        /**
         * [descr:dxFormButtonItem.buttonOptions]
         */
        buttonOptions?: dxButtonOptions;
        /**
         * [descr:dxFormButtonItem.colSpan]
         */
        colSpan?: number;
        /**
         * [descr:dxFormButtonItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFormButtonItem.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxFormButtonItem.itemType]
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * [descr:dxFormButtonItem.name]
         */
        name?: string;
        /**
         * [descr:dxFormButtonItem.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
        /**
         * [descr:dxFormButtonItem.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFormButtonItem.visibleIndex]
         */
        visibleIndex?: number;
    }
    /**
     * [descr:dxFormEmptyItem]
     */
    export interface dxFormEmptyItem {
        /**
         * [descr:dxFormEmptyItem.colSpan]
         */
        colSpan?: number;
        /**
         * [descr:dxFormEmptyItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFormEmptyItem.itemType]
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * [descr:dxFormEmptyItem.name]
         */
        name?: string;
        /**
         * [descr:dxFormEmptyItem.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFormEmptyItem.visibleIndex]
         */
        visibleIndex?: number;
    }
    /**
     * [descr:dxFormGroupItem]
     */
    export interface dxFormGroupItem {
        /**
         * [descr:dxFormGroupItem.alignItemLabels]
         */
        alignItemLabels?: boolean;
        /**
         * [descr:dxFormGroupItem.caption]
         */
        caption?: string;
        /**
         * [descr:dxFormGroupItem.colCount]
         */
        colCount?: number;
        /**
         * [descr:dxFormGroupItem.colCountByScreen]
         */
        colCountByScreen?: any;
        /**
         * [descr:dxFormGroupItem.colSpan]
         */
        colSpan?: number;
        /**
         * [descr:dxFormGroupItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFormGroupItem.itemType]
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * [descr:dxFormGroupItem.items]
         */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /**
         * [descr:dxFormGroupItem.name]
         */
        name?: string;
        /**
         * [descr:dxFormGroupItem.template]
         */
        template?: DevExpress.core.template | ((data: { component?: dxForm, formData?: any }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxFormGroupItem.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFormGroupItem.visibleIndex]
         */
        visibleIndex?: number;
    }
    /**
     * [descr:dxFormSimpleItem]
     */
    export interface dxFormSimpleItem {
        /**
         * [descr:dxFormSimpleItem.colSpan]
         */
        colSpan?: number;
        /**
         * [descr:dxFormSimpleItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFormSimpleItem.dataField]
         */
        dataField?: string;
        /**
         * [descr:dxFormSimpleItem.editorOptions]
         */
        editorOptions?: any;
        /**
         * [descr:dxFormSimpleItem.editorType]
         */
        editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxHtmlEditor' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
        /**
         * [descr:dxFormSimpleItem.helpText]
         */
        helpText?: string;
        /**
         * [descr:dxFormSimpleItem.isRequired]
         */
        isRequired?: boolean;
        /**
         * [descr:dxFormSimpleItem.itemType]
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * [descr:dxFormSimpleItem.label]
         */
        label?: { alignment?: 'center' | 'left' | 'right', location?: 'left' | 'right' | 'top', showColon?: boolean, text?: string, visible?: boolean };
        /**
         * [descr:dxFormSimpleItem.name]
         */
        name?: string;
        /**
         * [descr:dxFormSimpleItem.template]
         */
        template?: DevExpress.core.template | ((data: { component?: dxForm, dataField?: string, editorOptions?: any, editorType?: string, name?: string }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxFormSimpleItem.validationRules]
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * [descr:dxFormSimpleItem.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFormSimpleItem.visibleIndex]
         */
        visibleIndex?: number;
    }
    /**
     * [descr:dxFormTabbedItem]
     */
    export interface dxFormTabbedItem {
        /**
         * [descr:dxFormTabbedItem.colSpan]
         */
        colSpan?: number;
        /**
         * [descr:dxFormTabbedItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxFormTabbedItem.itemType]
         */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /**
         * [descr:dxFormTabbedItem.name]
         */
        name?: string;
        /**
         * [descr:dxFormTabbedItem.tabPanelOptions]
         */
        tabPanelOptions?: dxTabPanelOptions;
        /**
         * [descr:dxFormTabbedItem.tabs]
         */
        tabs?: Array<{ alignItemLabels?: boolean, badge?: string, colCount?: number, colCountByScreen?: any, disabled?: boolean, icon?: string, items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>, tabTemplate?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), template?: DevExpress.core.template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), title?: string }>;
        /**
         * [descr:dxFormTabbedItem.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFormTabbedItem.visibleIndex]
         */
        visibleIndex?: number;
    }
    /**
     * [descr:dxGallery.Options]
     */
    export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
        /**
         * [descr:dxGallery.Options.animationDuration]
         */
        animationDuration?: number;
        /**
         * [descr:dxGallery.Options.animationEnabled]
         */
        animationEnabled?: boolean;
        /**
         * [descr:dxGallery.Options.dataSource]
         */
        dataSource?: string | Array<string | dxGalleryItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxGallery.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxGallery.Options.indicatorEnabled]
         */
        indicatorEnabled?: boolean;
        /**
         * [descr:dxGallery.Options.initialItemWidth]
         */
        initialItemWidth?: number;
        /**
         * [descr:dxGallery.Options.items]
         */
        items?: Array<string | dxGalleryItem | any>;
        /**
         * [descr:dxGallery.Options.loop]
         */
        loop?: boolean;
        /**
         * [descr:dxGallery.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:dxGallery.Options.selectedIndex]
         */
        selectedIndex?: number;
        /**
         * [descr:dxGallery.Options.showIndicator]
         */
        showIndicator?: boolean;
        /**
         * [descr:dxGallery.Options.showNavButtons]
         */
        showNavButtons?: boolean;
        /**
         * [descr:dxGallery.Options.slideshowDelay]
         */
        slideshowDelay?: number;
        /**
         * [descr:dxGallery.Options.stretchImages]
         */
        stretchImages?: boolean;
        /**
         * [descr:dxGallery.Options.swipeEnabled]
         */
        swipeEnabled?: boolean;
        /**
         * [descr:dxGallery.Options.wrapAround]
         */
        wrapAround?: boolean;
    }
    /**
     * [descr:dxGallery]
     */
    export class dxGallery extends CollectionWidget {
        constructor(element: Element, options?: dxGalleryOptions)
        constructor(element: JQuery, options?: dxGalleryOptions)
        /**
         * [descr:dxGallery.goToItem(itemIndex, animation)]
         */
        goToItem(itemIndex: number, animation: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxGallery.nextItem(animation)]
         */
        nextItem(animation: boolean): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxGallery.prevItem(animation)]
         */
        prevItem(animation: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxGalleryItem]
     */
    export interface dxGalleryItem extends CollectionWidgetItem {
        /**
         * [descr:dxGalleryItem.imageAlt]
         */
        imageAlt?: string;
        /**
         * [descr:dxGalleryItem.imageSrc]
         */
        imageSrc?: string;
    }
    /**
     * [descr:dxGantt.Options]
     */
    export interface dxGanttOptions extends WidgetOptions<dxGantt> {
        /**
         * [descr:dxGantt.Options.allowSelection]
         */
        allowSelection?: boolean;
        /**
         * [descr:dxGantt.Options.columns]
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * [descr:dxGantt.Options.contextMenu]
         */
        contextMenu?: dxGanttContextMenu;
        /**
         * [descr:dxGantt.Options.dependencies]
         */
        dependencies?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, predecessorIdExpr?: string | Function, successorIdExpr?: string | Function, typeExpr?: string | Function };
        /**
         * [descr:dxGantt.Options.editing]
         */
        editing?: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskResourceUpdating?: boolean, allowTaskUpdating?: boolean, enabled?: boolean };
        /**
         * [descr:dxGantt.Options.firstDayOfWeek]
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * [descr:dxGantt.Options.onContextMenuPreparing]
         */
        onContextMenuPreparing?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, cancel?: boolean, event?: DevExpress.events.event, targetKey?: any, targetType?: string, data?: any, items?: Array<any> }) => any);
        /**
         * [descr:dxGantt.Options.onCustomCommand]
         */
        onCustomCommand?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, name?: string }) => any);
        /**
         * [descr:dxGantt.Options.onDependencyDeleting]
         */
        onDependencyDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.onDependencyInserting]
         */
        onDependencyInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * [descr:dxGantt.Options.onResourceAssigning]
         */
        onResourceAssigning?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * [descr:dxGantt.Options.onResourceDeleting]
         */
        onResourceDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.onResourceInserting]
         */
        onResourceInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * [descr:dxGantt.Options.onResourceUnassigning]
         */
        onResourceUnassigning?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, selectedRowKey?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskClick]
         */
        onTaskClick?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, key?: any, data?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskDblClick]
         */
        onTaskDblClick?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, event?: DevExpress.events.event, key?: any, data?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskDeleting]
         */
        onTaskDeleting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskEditDialogShowing]
         */
        onTaskEditDialogShowing?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any, key?: any, readOnlyFields?: Array<string>, hiddenFields?: Array<string> }) => any);
        /**
         * [descr:dxGantt.Options.onTaskInserting]
         */
        onTaskInserting?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, values?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskMoving]
         */
        onTaskMoving?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.onTaskUpdating]
         */
        onTaskUpdating?: ((e: { component?: dxGantt, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
        /**
         * [descr:dxGantt.Options.resourceAssignments]
         */
        resourceAssignments?: { dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, resourceIdExpr?: string | Function, taskIdExpr?: string | Function };
        /**
         * [descr:dxGantt.Options.resources]
         */
        resources?: { colorExpr?: string | Function, dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, keyExpr?: string | Function, textExpr?: string | Function };
        /**
         * [descr:dxGantt.Options.rootValue]
         */
        rootValue?: any;
        /**
         * [descr:dxGantt.Options.scaleType]
         */
        scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        /**
         * [descr:dxGantt.Options.selectedRowKey]
         */
        selectedRowKey?: any;
        /**
         * [descr:dxGantt.Options.showResources]
         */
        showResources?: boolean;
        /**
         * [descr:dxGantt.Options.showRowLines]
         */
        showRowLines?: boolean;
        /**
         * [descr:dxGantt.Options.stripLines]
         */
        stripLines?: Array<dxGanttStripLine>;
        /**
         * [descr:dxGantt.Options.taskListWidth]
         */
        taskListWidth?: number;
        /**
         * [descr:dxGantt.Options.taskTitlePosition]
         */
        taskTitlePosition?: 'inside' | 'outside' | 'none';
        /**
         * [descr:dxGantt.Options.taskTooltipContentTemplate]
         */
        taskTooltipContentTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxElement, task: any) => any);
        /**
         * [descr:dxGantt.Options.tasks]
         */
        tasks?: { colorExpr?: string | Function, dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, endExpr?: string | Function, keyExpr?: string | Function, parentIdExpr?: string | Function, progressExpr?: string | Function, startExpr?: string | Function, titleExpr?: string | Function };
        /**
         * [descr:dxGantt.Options.toolbar]
         */
        toolbar?: dxGanttToolbar;
        /**
         * [descr:dxGantt.Options.validation]
         */
        validation?: { autoUpdateParentTasks?: boolean, validateDependencies?: boolean };
    }
    /**
     * [descr:dxGantt]
     */
    export class dxGantt extends Widget {
        constructor(element: Element, options?: dxGanttOptions)
        constructor(element: JQuery, options?: dxGanttOptions)
        /**
         * [descr:dxGantt.assignResourceToTask(resourceKey, taskKey)]
         */
        assignResourceToTask(resourceKey: any, taskKey: any): void;
        /**
         * [descr:dxGantt.deleteDependency(key)]
         */
        deleteDependency(key: any): void;
        /**
         * [descr:dxGantt.deleteResource(key)]
         */
        deleteResource(key: any): void;
        /**
         * [descr:dxGantt.deleteTask(key)]
         */
        deleteTask(key: any): void;
        /**
         * [descr:dxGantt.getDependencyData(key)]
         */
        getDependencyData(key: any): any;
        /**
         * [descr:dxGantt.getResourceAssignmentData(key)]
         */
        getResourceAssignmentData(key: any): any;
        /**
         * [descr:dxGantt.getResourceData(key)]
         */
        getResourceData(key: any): any;
        /**
         * [descr:dxGantt.getTaskData(key)]
         */
        getTaskData(key: any): any;
        /**
         * [descr:dxGantt.getTaskResources(key)]
         */
        getTaskResources(key: any): Array<any>;
        /**
         * [descr:dxGantt.getVisibleDependencyKeys()]
         */
        getVisibleDependencyKeys(): Array<any>;
        /**
         * [descr:dxGantt.getVisibleResourceAssignmentKeys()]
         */
        getVisibleResourceAssignmentKeys(): Array<any>;
        /**
         * [descr:dxGantt.getVisibleResourceKeys()]
         */
        getVisibleResourceKeys(): Array<any>;
        /**
         * [descr:dxGantt.getVisibleTaskKeys()]
         */
        getVisibleTaskKeys(): Array<any>;
        /**
         * [descr:dxGantt.insertDependency(data)]
         */
        insertDependency(data: any): void;
        /**
         * [descr:dxGantt.insertResource(data, taskKeys)]
         */
        insertResource(data: any, taskKeys?: Array<any>): void;
        /**
         * [descr:dxGantt.insertTask(data)]
         */
        insertTask(data: any): void;
        /**
         * [descr:dxGantt.unassignResourceFromTask(resourceKey, taskKey)]
         */
        unassignResourceFromTask(resourceKey: any, taskKey: any): void;
        /**
         * [descr:dxGantt.updateDimensions()]
         */
        updateDimensions(): void;
        /**
         * [descr:dxGantt.updateTask(key, data)]
         */
        updateTask(key: any, data: any): void;
    }
    /**
     * [descr:dxGanttContextMenu]
     */
    export interface dxGanttContextMenu {
        /**
         * [descr:dxGanttContextMenu.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:dxGanttContextMenu.items]
         */
        items?: Array<dxGanttContextMenuItem | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails'>;
    }
    /**
     * [descr:dxGanttContextMenuItem]
     */
    export interface dxGanttContextMenuItem extends dxContextMenuItem {
        /**
         * [descr:dxGanttContextMenuItem.name]
         */
        name?: 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | string;
    }
    /**
     * [descr:dxGanttStripLine]
     */
    export interface dxGanttStripLine {
        /**
         * [descr:dxGanttStripLine.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxGanttStripLine.end]
         */
        end?: Date | number | string | (() => Date | number | string);
        /**
         * [descr:dxGanttStripLine.start]
         */
        start?: Date | number | string | (() => Date | number | string);
        /**
         * [descr:dxGanttStripLine.title]
         */
        title?: string;
    }
    /**
     * [descr:dxGanttToolbar]
     */
    export interface dxGanttToolbar {
        /**
         * [descr:dxGanttToolbar.items]
         */
        items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut'>;
    }
    /**
     * [descr:dxGanttToolbarItem]
     */
    export interface dxGanttToolbarItem extends dxToolbarItem {
        /**
         * [descr:dxGanttToolbarItem.location]
         */
        location?: 'after' | 'before' | 'center';
        /**
         * [descr:dxGanttToolbarItem.name]
         */
        name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | string;
    }
    /**
     * [descr:dxHtmlEditor.Options]
     */
    export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
        /**
         * [descr:dxHtmlEditor.Options.customizeModules]
         */
        customizeModules?: ((config: any) => any);
        /**
         * [descr:dxHtmlEditor.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxHtmlEditor.Options.mediaResizing]
         */
        mediaResizing?: dxHtmlEditorMediaResizing;
        /**
         * [descr:dxHtmlEditor.Options.mentions]
         */
        mentions?: Array<dxHtmlEditorMention>;
        /**
         * [descr:dxHtmlEditor.Options.name]
         */
        name?: string;
        /**
         * [descr:dxHtmlEditor.Options.onFocusIn]
         */
        onFocusIn?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxHtmlEditor.Options.onFocusOut]
         */
        onFocusOut?: ((e: { component?: dxHtmlEditor, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxHtmlEditor.Options.placeholder]
         */
        placeholder?: string;
        /**
         * [descr:dxHtmlEditor.Options.toolbar]
         */
        toolbar?: dxHtmlEditorToolbar;
        /**
         * [descr:dxHtmlEditor.Options.valueType]
         */
        valueType?: 'html' | 'markdown';
        /**
         * [descr:dxHtmlEditor.Options.variables]
         */
        variables?: dxHtmlEditorVariables;
    }
    /**
     * [descr:dxHtmlEditor]
     */
    export class dxHtmlEditor extends Editor {
        constructor(element: Element, options?: dxHtmlEditorOptions)
        constructor(element: JQuery, options?: dxHtmlEditorOptions)
        /**
         * [descr:dxHtmlEditor.clearHistory()]
         */
        clearHistory(): void;
        /**
         * [descr:dxHtmlEditor.delete(index, length)]
         */
        delete(index: number, length: number): void;
        /**
         * [descr:dxHtmlEditor.format(formatName, formatValue)]
         */
        format(formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * [descr:dxHtmlEditor.formatLine(index, length, formatName, formatValue)]
         */
        formatLine(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * [descr:dxHtmlEditor.formatLine(index, length, formats)]
         */
        formatLine(index: number, length: number, formats: any): void;
        /**
         * [descr:dxHtmlEditor.formatText(index, length, formatName, formatValue)]
         */
        formatText(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
        /**
         * [descr:dxHtmlEditor.formatText(index, length, formats)]
         */
        formatText(index: number, length: number, formats: any): void;
        /**
         * [descr:dxHtmlEditor.get(componentPath)]
         */
        get(componentPath: string): any;
        /**
         * [descr:dxHtmlEditor.getFormat(index, length)]
         */
        getFormat(index: number, length: number): any;
        /**
         * [descr:dxHtmlEditor.getLength()]
         */
        getLength(): number;
        /**
         * [descr:dxHtmlEditor.getModule(moduleName)]
         */
        getModule(moduleName: string): any;
        /**
         * [descr:dxHtmlEditor.getQuillInstance()]
         */
        getQuillInstance(): any;
        /**
         * [descr:dxHtmlEditor.getSelection()]
         */
        getSelection(): any;
        /**
         * [descr:dxHtmlEditor.insertEmbed(index, type, config)]
         */
        insertEmbed(index: number, type: string, config: any): void;
        /**
         * [descr:dxHtmlEditor.insertText(index, text, formats)]
         */
        insertText(index: number, text: string, formats: any): void;
        /**
         * [descr:dxHtmlEditor.redo()]
         */
        redo(): void;
        /**
         * [descr:dxHtmlEditor.register(components)]
         */
        register(modules: any): void;
        /**
         * [descr:dxHtmlEditor.removeFormat(index, length)]
         */
        removeFormat(index: number, length: number): void;
        /**
         * [descr:dxHtmlEditor.setSelection(index, length)]
         */
        setSelection(index: number, length: number): void;
        /**
         * [descr:dxHtmlEditor.undo()]
         */
        undo(): void;
    }
    /**
     * [descr:dxHtmlEditorMediaResizing]
     */
    export interface dxHtmlEditorMediaResizing {
        /**
         * [descr:dxHtmlEditorMediaResizing.allowedTargets]
         */
        allowedTargets?: Array<string>;
        /**
         * [descr:dxHtmlEditorMediaResizing.enabled]
         */
        enabled?: boolean;
    }
    /**
     * [descr:dxHtmlEditorMention]
     */
    export interface dxHtmlEditorMention {
        /**
         * [descr:dxHtmlEditorMention.dataSource]
         */
        dataSource?: Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxHtmlEditorMention.displayExpr]
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * [descr:dxHtmlEditorMention.itemTemplate]
         */
        itemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxHtmlEditorMention.marker]
         */
        marker?: string;
        /**
         * [descr:dxHtmlEditorMention.minSearchLength]
         */
        minSearchLength?: number;
        /**
         * [descr:dxHtmlEditorMention.searchExpr]
         */
        searchExpr?: string | Function | Array<string | Function>;
        /**
         * [descr:dxHtmlEditorMention.searchTimeout]
         */
        searchTimeout?: number;
        /**
         * [descr:dxHtmlEditorMention.template]
         */
        template?: DevExpress.core.template | ((mentionData: { marker?: string, id?: string | number, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxHtmlEditorMention.valueExpr]
         */
        valueExpr?: string | Function;
    }
    /**
     * [descr:dxHtmlEditorToolbar]
     */
    export interface dxHtmlEditorToolbar {
        /**
         * [descr:dxHtmlEditorToolbar.container]
         */
        container?: string | Element | JQuery;
        /**
         * [descr:dxHtmlEditorToolbar.items]
         */
        items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable'>;
        /**
         * [descr:dxHtmlEditorToolbar.multiline]
         */
        multiline?: boolean;
    }
    /**
     * [descr:dxHtmlEditorToolbarItem]
     */
    export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
        /**
         * [descr:dxHtmlEditorToolbarItem.formatName]
         */
        formatName?: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | string;
        /**
         * [descr:dxHtmlEditorToolbarItem.formatValues]
         */
        formatValues?: Array<string | number | boolean>;
        /**
         * [descr:dxHtmlEditorToolbarItem.location]
         */
        location?: 'after' | 'before' | 'center';
    }
    /**
     * [descr:dxHtmlEditorVariables]
     */
    export interface dxHtmlEditorVariables {
        /**
         * [descr:dxHtmlEditorVariables.dataSource]
         */
        dataSource?: string | Array<string> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxHtmlEditorVariables.escapeChar]
         */
        escapeChar?: string | Array<string>;
    }
    /**
     * [descr:dxItem]
     */
    export var dxItem: any;
    /**
     * [descr:dxList.Options]
     */
    export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
        /**
         * [descr:dxList.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxList.Options.allowItemDeleting]
         */
        allowItemDeleting?: boolean;
        /**
         * [descr:dxList.Options.bounceEnabled]
         */
        bounceEnabled?: boolean;
        /**
         * [descr:dxList.Options.collapsibleGroups]
         */
        collapsibleGroups?: boolean;
        /**
         * [descr:dxList.Options.dataSource]
         */
        dataSource?: string | Array<string | dxListItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxList.Options.displayExpr]
         */
        displayExpr?: string | ((item: any) => string);
        /**
         * [descr:dxList.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxList.Options.groupTemplate]
         */
        groupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxList.Options.grouped]
         */
        grouped?: boolean;
        /**
         * [descr:dxList.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxList.Options.indicateLoading]
         */
        indicateLoading?: boolean;
        /**
         * [descr:dxList.Options.itemDeleteMode]
         */
        itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
        /**
         * [descr:dxList.Options.itemDragging]
         */
        itemDragging?: dxSortableOptions;
        /**
         * [descr:dxList.Options.items]
         */
        items?: Array<string | dxListItem | any>;
        /**
         * [descr:dxList.Options.menuItems]
         */
        menuItems?: Array<{ action?: ((itemElement: DevExpress.core.dxElement, itemData: any) => any), text?: string }>;
        /**
         * [descr:dxList.Options.menuMode]
         */
        menuMode?: 'context' | 'slide';
        /**
         * [descr:dxList.Options.nextButtonText]
         */
        nextButtonText?: string;
        /**
         * [descr:dxList.Options.onGroupRendered]
         */
        onGroupRendered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, groupData?: any, groupElement?: DevExpress.core.dxElement, groupIndex?: number }) => any);
        /**
         * [descr:dxList.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxList.Options.onItemContextMenu]
         */
        onItemContextMenu?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxList.Options.onItemDeleted]
         */
        onItemDeleted?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any }) => any);
        /**
         * [descr:dxList.Options.onItemDeleting]
         */
        onItemDeleting?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /**
         * [descr:dxList.Options.onItemHold]
         */
        onItemHold?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxList.Options.onItemReordered]
         */
        onItemReordered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number }) => any);
        /**
         * [descr:dxList.Options.onItemSwipe]
         */
        onItemSwipe?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, direction?: string }) => any);
        /**
         * [descr:dxList.Options.onPageLoading]
         */
        onPageLoading?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxList.Options.onPullRefresh]
         */
        onPullRefresh?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxList.Options.onScroll]
         */
        onScroll?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * [descr:dxList.Options.onSelectAllValueChanged]
         */
        onSelectAllValueChanged?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * [descr:dxList.Options.pageLoadMode]
         */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /**
         * [descr:dxList.Options.pageLoadingText]
         */
        pageLoadingText?: string;
        /**
         * [descr:dxList.Options.pullRefreshEnabled]
         */
        pullRefreshEnabled?: boolean;
        /**
         * [descr:dxList.Options.pulledDownText]
         */
        pulledDownText?: string;
        /**
         * [descr:dxList.Options.pullingDownText]
         */
        pullingDownText?: string;
        /**
         * [descr:dxList.Options.refreshingText]
         */
        refreshingText?: string;
        /**
         * [descr:dxList.Options.repaintChangesOnly]
         */
        repaintChangesOnly?: boolean;
        /**
         * [descr:dxList.Options.scrollByContent]
         */
        scrollByContent?: boolean;
        /**
         * [descr:dxList.Options.scrollByThumb]
         */
        scrollByThumb?: boolean;
        /**
         * [descr:dxList.Options.scrollingEnabled]
         */
        scrollingEnabled?: boolean;
        /**
         * [descr:dxList.Options.selectAllMode]
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * [descr:dxList.Options.selectionMode]
         */
        selectionMode?: 'all' | 'multiple' | 'none' | 'single';
        /**
         * [descr:dxList.Options.showScrollbar]
         */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /**
         * [descr:dxList.Options.showSelectionControls]
         */
        showSelectionControls?: boolean;
        /**
         * [descr:dxList.Options.useNativeScrolling]
         */
        useNativeScrolling?: boolean;
    }
    /**
     * [descr:dxList]
     */
    export class dxList extends CollectionWidget {
        constructor(element: Element, options?: dxListOptions)
        constructor(element: JQuery, options?: dxListOptions)
        /**
         * [descr:dxList.clientHeight()]
         */
        clientHeight(): number;
        /**
         * [descr:dxList.collapseGroup(groupIndex)]
         */
        collapseGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.deleteItem(itemElement)]
         */
        deleteItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.deleteItem(itemIndex)]
         */
        deleteItem(itemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.expandGroup(groupIndex)]
         */
        expandGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.isItemSelected(itemElement)]
         */
        isItemSelected(itemElement: Element): boolean;
        /**
         * [descr:dxList.isItemSelected(itemIndex)]
         */
        isItemSelected(itemIndex: number | any): boolean;
        /**
         * [descr:dxList.reload()]
         */
        reload(): void;
        /**
         * [descr:dxList.reorderItem(itemElement, toItemElement)]
         */
        reorderItem(itemElement: Element, toItemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.reorderItem(itemIndex, toItemIndex)]
         */
        reorderItem(itemIndex: number | any, toItemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxList.scrollBy(distance)]
         */
        scrollBy(distance: number): void;
        /**
         * [descr:dxList.scrollHeight()]
         */
        scrollHeight(): number;
        /**
         * [descr:dxList.scrollTo(location)]
         */
        scrollTo(location: number): void;
        /**
         * [descr:dxList.scrollToItem(itemElement)]
         */
        scrollToItem(itemElement: Element): void;
        /**
         * [descr:dxList.scrollToItem(itemIndex)]
         */
        scrollToItem(itemIndex: number | any): void;
        /**
         * [descr:dxList.scrollTop()]
         */
        scrollTop(): number;
        /**
         * [descr:dxList.selectAll()]
         */
        selectAll(): void;
        /**
         * [descr:dxList.selectItem(itemElement)]
         */
        selectItem(itemElement: Element): void;
        /**
         * [descr:dxList.selectItem(itemIndex)]
         */
        selectItem(itemIndex: number | any): void;
        /**
         * [descr:dxList.unselectAll()]
         */
        unselectAll(): void;
        /**
         * [descr:dxList.unselectItem(itemElement)]
         */
        unselectItem(itemElement: Element): void;
        /**
         * [descr:dxList.unselectItem(itemIndex)]
         */
        unselectItem(itemIndex: number | any): void;
        /**
         * [descr:dxList.updateDimensions()]
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxListItem]
     */
    export interface dxListItem extends CollectionWidgetItem {
        /**
         * [descr:dxListItem.badge]
         */
        badge?: string;
        /**
         * [descr:dxListItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxListItem.key]
         */
        key?: string;
        /**
         * [descr:dxListItem.showChevron]
         */
        showChevron?: boolean;
    }
    /**
     * [descr:dxLoadIndicator.Options]
     */
    export interface dxLoadIndicatorOptions extends WidgetOptions<dxLoadIndicator> {
        /**
         * [descr:dxLoadIndicator.Options.indicatorSrc]
         */
        indicatorSrc?: string;
    }
    /**
     * [descr:dxLoadIndicator]
     */
    export class dxLoadIndicator extends Widget {
        constructor(element: Element, options?: dxLoadIndicatorOptions)
        constructor(element: JQuery, options?: dxLoadIndicatorOptions)
    }
    /**
     * [descr:dxLoadPanel.Options]
     */
    export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
        /**
         * [descr:dxLoadPanel.Options.animation]
         */
        animation?: dxLoadPanelAnimation;
        /**
         * [descr:dxLoadPanel.Options.container]
         */
        container?: string | Element | JQuery;
        /**
         * [descr:dxLoadPanel.Options.delay]
         */
        delay?: number;
        /**
         * [descr:dxLoadPanel.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxLoadPanel.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxLoadPanel.Options.indicatorSrc]
         */
        indicatorSrc?: string;
        /**
         * [descr:dxLoadPanel.Options.maxHeight]
         */
        maxHeight?: number | string | (() => number | string);
        /**
         * [descr:dxLoadPanel.Options.maxWidth]
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * [descr:dxLoadPanel.Options.message]
         */
        message?: string;
        /**
         * [descr:dxLoadPanel.Options.position]
         */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /**
         * [descr:dxLoadPanel.Options.shadingColor]
         */
        shadingColor?: string;
        /**
         * [descr:dxLoadPanel.Options.showIndicator]
         */
        showIndicator?: boolean;
        /**
         * [descr:dxLoadPanel.Options.showPane]
         */
        showPane?: boolean;
        /**
         * [descr:dxLoadPanel.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxLoadPanel.Options.animation]
     */
    export interface dxLoadPanelAnimation extends dxOverlayAnimation {
        /**
         * [descr:dxLoadPanel.Options.animation.hide]
         */
        hide?: animationConfig;
        /**
         * [descr:dxLoadPanel.Options.animation.show]
         */
        show?: animationConfig;
    }
    /**
     * [descr:dxLoadPanel]
     */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: Element, options?: dxLoadPanelOptions)
        constructor(element: JQuery, options?: dxLoadPanelOptions)
    }
    /**
     * [descr:dxLookup.Options]
     */
    export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
        /**
         * [descr:dxLookup.Options.animation]
         * @deprecated [depNote:dxLookup.Options.animation]
         */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /**
         * [descr:dxLookup.Options.applyButtonText]
         */
        applyButtonText?: string;
        /**
         * [descr:dxLookup.Options.applyValueMode]
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * [descr:dxLookup.Options.cancelButtonText]
         */
        cancelButtonText?: string;
        /**
         * [descr:dxLookup.Options.cleanSearchOnOpening]
         */
        cleanSearchOnOpening?: boolean;
        /**
         * [descr:dxLookup.Options.clearButtonText]
         */
        clearButtonText?: string;
        /**
         * [descr:dxLookup.Options.closeOnOutsideClick]
         * @deprecated [depNote:dxLookup.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | (() => boolean);
        /**
         * [descr:dxLookup.Options.dropDownCentered]
         */
        dropDownCentered?: boolean;
        /**
         * [descr:dxLookup.Options.dropDownOptions]
         */
        dropDownOptions?: dxPopoverOptions;
        /**
         * [descr:dxLookup.Options.fieldTemplate]
         */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxLookup.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxLookup.Options.fullScreen]
         * @deprecated [depNote:dxLookup.Options.fullScreen]
         */
        fullScreen?: boolean;
        /**
         * [descr:dxLookup.Options.groupTemplate]
         */
        groupTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxLookup.Options.grouped]
         */
        grouped?: boolean;
        /**
         * [descr:dxLookup.Options.nextButtonText]
         */
        nextButtonText?: string;
        /**
         * [descr:dxLookup.Options.onPageLoading]
         */
        onPageLoading?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxLookup.Options.onPullRefresh]
         */
        onPullRefresh?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxLookup.Options.onScroll]
         */
        onScroll?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * [descr:dxLookup.Options.onTitleRendered]
         * @deprecated [depNote:dxLookup.Options.onTitleRendered]
         */
        onTitleRendered?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxLookup.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxLookup.Options.pageLoadMode]
         */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /**
         * [descr:dxLookup.Options.pageLoadingText]
         */
        pageLoadingText?: string;
        /**
         * [descr:dxLookup.Options.placeholder]
         */
        placeholder?: string;
        /**
         * [descr:dxLookup.Options.popupHeight]
         * @deprecated [depNote:dxLookup.Options.popupHeight]
         */
        popupHeight?: number | string | (() => number | string);
        /**
         * [descr:dxLookup.Options.popupWidth]
         * @deprecated [depNote:dxLookup.Options.popupWidth]
         */
        popupWidth?: number | string | (() => number | string);
        /**
         * [descr:dxLookup.Options.position]
         * @deprecated [depNote:dxLookup.Options.position]
         */
        position?: positionConfig;
        /**
         * [descr:dxLookup.Options.pullRefreshEnabled]
         */
        pullRefreshEnabled?: boolean;
        /**
         * [descr:dxLookup.Options.pulledDownText]
         */
        pulledDownText?: string;
        /**
         * [descr:dxLookup.Options.pullingDownText]
         */
        pullingDownText?: string;
        /**
         * [descr:dxLookup.Options.refreshingText]
         */
        refreshingText?: string;
        /**
         * [descr:dxLookup.Options.searchEnabled]
         */
        searchEnabled?: boolean;
        /**
         * [descr:dxLookup.Options.searchPlaceholder]
         */
        searchPlaceholder?: string;
        /**
         * [descr:dxLookup.Options.shading]
         * @deprecated [depNote:dxLookup.Options.shading]
         */
        shading?: boolean;
        /**
         * [descr:dxLookup.Options.showCancelButton]
         */
        showCancelButton?: boolean;
        /**
         * [descr:dxLookup.Options.showClearButton]
         */
        showClearButton?: boolean;
        /**
         * [descr:dxLookup.Options.showPopupTitle]
         * @deprecated [depNote:dxLookup.Options.showPopupTitle]
         */
        showPopupTitle?: boolean;
        /**
         * [descr:dxLookup.Options.title]
         * @deprecated [depNote:dxLookup.Options.title]
         */
        title?: string;
        /**
         * [descr:dxLookup.Options.titleTemplate]
         * @deprecated [depNote:dxLookup.Options.titleTemplate]
         */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxLookup.Options.useNativeScrolling]
         */
        useNativeScrolling?: boolean;
        /**
         * [descr:dxLookup.Options.usePopover]
         */
        usePopover?: boolean;
    }
    /**
     * [descr:dxLookup]
     */
    export class dxLookup extends dxDropDownList {
        constructor(element: Element, options?: dxLookupOptions)
        constructor(element: JQuery, options?: dxLookupOptions)
    }
    /**
     * [descr:dxMap.Options]
     */
    export interface dxMapOptions extends WidgetOptions<dxMap> {
        /**
         * [descr:dxMap.Options.apiKey]
         */
        apiKey?: string | { bing?: string, google?: string, googleStatic?: string };
        /**
         * [descr:dxMap.Options.autoAdjust]
         */
        autoAdjust?: boolean;
        /**
         * [descr:dxMap.Options.center]
         */
        center?: any | string | Array<number>;
        /**
         * [descr:dxMap.Options.controls]
         */
        controls?: boolean;
        /**
         * [descr:dxMap.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxMap.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxMap.Options.key]
         * @deprecated [depNote:dxMap.Options.key]
         */
        key?: string | { bing?: string, google?: string, googleStatic?: string };
        /**
         * [descr:dxMap.Options.markerIconSrc]
         */
        markerIconSrc?: string;
        /**
         * [descr:dxMap.Options.markers]
         */
        markers?: Array<{ iconSrc?: string, location?: any | string | Array<number>, onClick?: Function, tooltip?: string | { isShown?: boolean, text?: string } }>;
        /**
         * [descr:dxMap.Options.onClick]
         */
        onClick?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, location?: any, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxMap.Options.onMarkerAdded]
         */
        onMarkerAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalMarker?: any }) => any);
        /**
         * [descr:dxMap.Options.onMarkerRemoved]
         */
        onMarkerRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /**
         * [descr:dxMap.Options.onReady]
         */
        onReady?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, originalMap?: any }) => any);
        /**
         * [descr:dxMap.Options.onRouteAdded]
         */
        onRouteAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalRoute?: any }) => any);
        /**
         * [descr:dxMap.Options.onRouteRemoved]
         */
        onRouteRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /**
         * [descr:dxMap.Options.provider]
         */
        provider?: 'bing' | 'google' | 'googleStatic';
        /**
         * [descr:dxMap.Options.routes]
         */
        routes?: Array<{ color?: string, locations?: Array<any>, mode?: 'driving' | 'walking', opacity?: number, weight?: number }>;
        /**
         * [descr:dxMap.Options.type]
         */
        type?: 'hybrid' | 'roadmap' | 'satellite';
        /**
         * [descr:dxMap.Options.width]
         */
        width?: number | string | (() => number | string);
        /**
         * [descr:dxMap.Options.zoom]
         */
        zoom?: number;
    }
    /**
     * [descr:dxMap]
     */
    export class dxMap extends Widget {
        constructor(element: Element, options?: dxMapOptions)
        constructor(element: JQuery, options?: dxMapOptions)
        /**
         * [descr:dxMap.addMarker(markerOptions)]
         */
        addMarker(markerOptions: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:dxMap.addRoute(routeOptions)]
         */
        addRoute(options: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /**
         * [descr:dxMap.removeMarker(marker)]
         */
        removeMarker(marker: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxMap.removeRoute(route)]
         */
        removeRoute(route: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxMenu.Options]
     */
    export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
        /**
         * [descr:dxMenu.Options.adaptivityEnabled]
         */
        adaptivityEnabled?: boolean;
        /**
         * [descr:dxMenu.Options.dataSource]
         */
        dataSource?: string | Array<dxMenuItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxMenu.Options.hideSubmenuOnMouseLeave]
         */
        hideSubmenuOnMouseLeave?: boolean;
        /**
         * [descr:dxMenu.Options.items]
         */
        items?: Array<dxMenuItem>;
        /**
         * [descr:dxMenu.Options.onSubmenuHidden]
         */
        onSubmenuHidden?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxMenu.Options.onSubmenuHiding]
         */
        onSubmenuHiding?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement, cancel?: boolean }) => any);
        /**
         * [descr:dxMenu.Options.onSubmenuShowing]
         */
        onSubmenuShowing?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxMenu.Options.onSubmenuShown]
         */
        onSubmenuShown?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxMenu.Options.orientation]
         */
        orientation?: 'horizontal' | 'vertical';
        /**
         * [descr:dxMenu.Options.showFirstSubmenuMode]
         */
        showFirstSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
        /**
         * [descr:dxMenu.Options.submenuDirection]
         */
        submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
    }
    /**
     * [descr:dxMenu]
     */
    export class dxMenu extends dxMenuBase {
        constructor(element: Element, options?: dxMenuOptions)
        constructor(element: JQuery, options?: dxMenuOptions)
    }
    /**
     * [descr:dxMenuBase.Options]
     */
    export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
        /**
         * [descr:dxMenuBase.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxMenuBase.Options.animation]
         */
        animation?: { hide?: animationConfig, show?: animationConfig };
        /**
         * [descr:dxMenuBase.Options.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxMenuBase.Options.dataSource]
         */
        dataSource?: string | Array<dxMenuBaseItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxMenuBase.Options.items]
         */
        items?: Array<dxMenuBaseItem>;
        /**
         * [descr:dxMenuBase.Options.selectByClick]
         */
        selectByClick?: boolean;
        /**
         * [descr:dxMenuBase.Options.selectionMode]
         */
        selectionMode?: 'none' | 'single';
        /**
         * [descr:dxMenuBase.Options.showSubmenuMode]
         */
        showSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
    }
    /**
     * [descr:dxMenuBase]
     */
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxMenuBaseOptions)
        constructor(element: JQuery, options?: dxMenuBaseOptions)
        /**
         * [descr:dxMenuBase.selectItem(itemElement)]
         */
        selectItem(itemElement: Element): void;
        /**
         * [descr:dxMenuBase.unselectItem(itemElement)]
         */
        unselectItem(itemElement: Element): void;
    }
    /**
     * [descr:dxMenuBaseItem]
     */
    export interface dxMenuBaseItem extends CollectionWidgetItem {
        /**
         * [descr:dxMenuBaseItem.beginGroup]
         */
        beginGroup?: boolean;
        /**
         * [descr:dxMenuBaseItem.closeMenuOnClick]
         */
        closeMenuOnClick?: boolean;
        /**
         * [descr:dxMenuBaseItem.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:dxMenuBaseItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxMenuBaseItem.items]
         */
        items?: Array<dxMenuBaseItem>;
        /**
         * [descr:dxMenuBaseItem.selectable]
         */
        selectable?: boolean;
        /**
         * [descr:dxMenuBaseItem.selected]
         */
        selected?: boolean;
        /**
         * [descr:dxMenuBaseItem.text]
         */
        text?: string;
        /**
         * [descr:dxMenuBaseItem.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxMenuItem]
     */
    export interface dxMenuItem extends dxMenuBaseItem {
        /**
         * [descr:dxMenuItem.items]
         */
        items?: Array<dxMenuItem>;
    }
    /**
     * [descr:dxMultiView.Options]
     */
    export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
        /**
         * [descr:dxMultiView.Options.animationEnabled]
         */
        animationEnabled?: boolean;
        /**
         * [descr:dxMultiView.Options.dataSource]
         */
        dataSource?: string | Array<string | dxMultiViewItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxMultiView.Options.deferRendering]
         */
        deferRendering?: boolean;
        /**
         * [descr:dxMultiView.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxMultiView.Options.items]
         */
        items?: Array<string | dxMultiViewItem | any>;
        /**
         * [descr:dxMultiView.Options.loop]
         */
        loop?: boolean;
        /**
         * [descr:dxMultiView.Options.selectedIndex]
         */
        selectedIndex?: number;
        /**
         * [descr:dxMultiView.Options.swipeEnabled]
         */
        swipeEnabled?: boolean;
    }
    /**
     * [descr:dxMultiView]
     */
    export class dxMultiView extends CollectionWidget {
        constructor(element: Element, options?: dxMultiViewOptions)
        constructor(element: JQuery, options?: dxMultiViewOptions)
    }
    /**
     * [descr:dxMultiViewItem]
     */
    export interface dxMultiViewItem extends CollectionWidgetItem {
    }
    /**
     * [descr:dxNavBar.Options]
     */
    export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
        /**
         * [descr:dxNavBar.Options.scrollByContent]
         */
        scrollByContent?: boolean;
    }
    /**
     * [descr:dxNavBar]
     */
    export class dxNavBar extends dxTabs {
        constructor(element: Element, options?: dxNavBarOptions)
        constructor(element: JQuery, options?: dxNavBarOptions)
    }
    /**
     * [descr:dxNavBarItem]
     */
    export interface dxNavBarItem extends dxTabsItem {
        /**
         * [descr:dxNavBarItem.badge]
         */
        badge?: string;
    }
    /**
     * [descr:dxNumberBox.Options]
     */
    export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
        /**
         * [descr:dxNumberBox.Options.buttons]
         */
        buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
        /**
         * [descr:dxNumberBox.Options.format]
         */
        format?: format;
        /**
         * [descr:dxNumberBox.Options.invalidValueMessage]
         */
        invalidValueMessage?: string;
        /**
         * [descr:dxNumberBox.Options.max]
         */
        max?: number;
        /**
         * [descr:dxNumberBox.Options.min]
         */
        min?: number;
        /**
         * [descr:dxNumberBox.Options.mode]
         */
        mode?: 'number' | 'text' | 'tel';
        /**
         * [descr:dxNumberBox.Options.showSpinButtons]
         */
        showSpinButtons?: boolean;
        /**
         * [descr:dxNumberBox.Options.step]
         */
        step?: number;
        /**
         * [descr:dxNumberBox.Options.useLargeSpinButtons]
         */
        useLargeSpinButtons?: boolean;
        /**
         * [descr:dxNumberBox.Options.value]
         */
        value?: number;
    }
    /**
     * [descr:dxNumberBox]
     */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: Element, options?: dxNumberBoxOptions)
        constructor(element: JQuery, options?: dxNumberBoxOptions)
    }
    /**
     * [descr:dxOverlay.Options]
     */
    export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
        /**
         * [descr:dxOverlay.Options.animation]
         */
        animation?: dxOverlayAnimation;
        /**
         * [descr:dxOverlay.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * [descr:dxOverlay.Options.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxOverlay.Options.deferRendering]
         */
        deferRendering?: boolean;
        /**
         * [descr:dxOverlay.Options.dragEnabled]
         */
        dragEnabled?: boolean;
        /**
         * [descr:dxOverlay.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxOverlay.Options.maxHeight]
         */
        maxHeight?: number | string | (() => number | string);
        /**
         * [descr:dxOverlay.Options.maxWidth]
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * [descr:dxOverlay.Options.minHeight]
         */
        minHeight?: number | string | (() => number | string);
        /**
         * [descr:dxOverlay.Options.minWidth]
         */
        minWidth?: number | string | (() => number | string);
        /**
         * [descr:dxOverlay.Options.onHidden]
         */
        onHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxOverlay.Options.onHiding]
         */
        onHiding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /**
         * [descr:dxOverlay.Options.onShowing]
         */
        onShowing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxOverlay.Options.onShown]
         */
        onShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxOverlay.Options.position]
         */
        position?: any;
        /**
         * [descr:dxOverlay.Options.shading]
         */
        shading?: boolean;
        /**
         * [descr:dxOverlay.Options.shadingColor]
         */
        shadingColor?: string;
        /**
         * [descr:dxOverlay.Options.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxOverlay.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxOverlay.Options.animation]
     */
    export interface dxOverlayAnimation {
        /**
         * [descr:dxOverlay.Options.animation.hide]
         */
        hide?: animationConfig;
        /**
         * [descr:dxOverlay.Options.animation.show]
         */
        show?: animationConfig;
    }
    /**
     * [descr:dxOverlay]
     */
    export class dxOverlay extends Widget {
        constructor(element: Element, options?: dxOverlayOptions)
        constructor(element: JQuery, options?: dxOverlayOptions)
        /**
         * [descr:dxOverlay.content()]
         */
        content(): DevExpress.core.dxElement;
        /**
         * [descr:dxOverlay.hide()]
         */
        hide(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * [descr:dxOverlay.repaint()]
         */
        repaint(): void;
        /**
         * [descr:dxOverlay.show()]
         */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * [descr:dxOverlay.toggle(showing)]
         */
        toggle(showing: boolean): Promise<boolean> & JQueryPromise<boolean>;
    }
    /**
     * [descr:dxPivotGrid.Options]
     */
    export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
        /**
         * [descr:dxPivotGrid.Options.allowExpandAll]
         */
        allowExpandAll?: boolean;
        /**
         * [descr:dxPivotGrid.Options.allowFiltering]
         */
        allowFiltering?: boolean;
        /**
         * [descr:dxPivotGrid.Options.allowSorting]
         */
        allowSorting?: boolean;
        /**
         * [descr:dxPivotGrid.Options.allowSortingBySummary]
         */
        allowSortingBySummary?: boolean;
        /**
         * [descr:dxPivotGrid.Options.dataFieldArea]
         */
        dataFieldArea?: 'column' | 'row';
        /**
         * [descr:dxPivotGrid.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.PivotGridDataSource | DevExpress.data.PivotGridDataSourceOptions;
        /**
         * [descr:dxPivotGrid.Options.export]
         */
        export?: { enabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string };
        /**
         * [descr:dxPivotGrid.Options.fieldChooser]
         */
        fieldChooser?: { allowSearch?: boolean, applyChangesMode?: 'instantly' | 'onDemand', enabled?: boolean, height?: number, layout?: 0 | 1 | 2, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number };
        /**
         * [descr:dxPivotGrid.Options.fieldPanel]
         */
        fieldPanel?: { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean };
        /**
         * [descr:dxPivotGrid.Options.headerFilter]
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /**
         * [descr:dxPivotGrid.Options.hideEmptySummaryCells]
         */
        hideEmptySummaryCells?: boolean;
        /**
         * [descr:dxPivotGrid.Options.loadPanel]
         */
        loadPanel?: { enabled?: boolean, height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
        /**
         * [descr:dxPivotGrid.Options.onCellClick]
         */
        onCellClick?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, event?: DevExpress.events.event, cancel?: boolean }) => any);
        /**
         * [descr:dxPivotGrid.Options.onCellPrepared]
         */
        onCellPrepared?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number }) => any);
        /**
         * [descr:dxPivotGrid.Options.onContextMenuPreparing]
         */
        onContextMenuPreparing?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, cell?: dxPivotGridPivotGridCell, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, field?: DevExpress.data.PivotGridDataSourceField }) => any);
        /**
         * [descr:dxPivotGrid.Options.onExported]
         * @deprecated [depNote:dxPivotGrid.Options.onExported]
         */
        onExported?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxPivotGrid.Options.onExporting]
         */
        onExporting?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /**
         * [descr:dxPivotGrid.Options.onFileSaving]
         * @deprecated [depNote:dxPivotGrid.Options.onFileSaving]
         */
        onFileSaving?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * [descr:dxPivotGrid.Options.rowHeaderLayout]
         */
        rowHeaderLayout?: 'standard' | 'tree';
        /**
         * [descr:dxPivotGrid.Options.scrolling]
         */
        scrolling?: { mode?: 'standard' | 'virtual', useNative?: boolean | 'auto' };
        /**
         * [descr:dxPivotGrid.Options.showBorders]
         */
        showBorders?: boolean;
        /**
         * [descr:dxPivotGrid.Options.showColumnGrandTotals]
         */
        showColumnGrandTotals?: boolean;
        /**
         * [descr:dxPivotGrid.Options.showColumnTotals]
         */
        showColumnTotals?: boolean;
        /**
         * [descr:dxPivotGrid.Options.showRowGrandTotals]
         */
        showRowGrandTotals?: boolean;
        /**
         * [descr:dxPivotGrid.Options.showRowTotals]
         */
        showRowTotals?: boolean;
        /**
         * [descr:dxPivotGrid.Options.showTotalsPrior]
         */
        showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
        /**
         * [descr:dxPivotGrid.Options.stateStoring]
         */
        stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((state: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
        /**
         * [descr:dxPivotGrid.Options.texts]
         */
        texts?: { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string };
        /**
         * [descr:dxPivotGrid.Options.wordWrapEnabled]
         */
        wordWrapEnabled?: boolean;
    }
    /**
     * [descr:dxPivotGrid]
     */
    export class dxPivotGrid extends Widget {
        constructor(element: Element, options?: dxPivotGridOptions)
        constructor(element: JQuery, options?: dxPivotGridOptions)
        /**
         * [descr:dxPivotGrid.bindChart(chart, integrationOptions)]
         */
        bindChart(chart: string | JQuery | any, integrationOptions: { inverted?: boolean, dataFieldsDisplayMode?: string, putDataFieldsInto?: string, alternateDataFields?: boolean, processCell?: Function, customizeChart?: Function, customizeSeries?: Function }): Function & null;
        /**
         * [descr:dxPivotGrid.exportToExcel()]
         * @deprecated [depNote:dxPivotGrid.exportToExcel()]
         */
        exportToExcel(): void;
        /**
         * [descr:dxPivotGrid.getDataSource()]
         */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /**
         * [descr:dxPivotGrid.getFieldChooserPopup()]
         */
        getFieldChooserPopup(): dxPopup;
        /**
         * [descr:dxPivotGrid.updateDimensions()]
         */
        updateDimensions(): void;
    }
    /**
     * [descr:dxPivotGridFieldChooser.Options]
     */
    export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
        /**
         * [descr:dxPivotGridFieldChooser.Options.allowSearch]
         */
        allowSearch?: boolean;
        /**
         * [descr:dxPivotGridFieldChooser.Options.applyChangesMode]
         */
        applyChangesMode?: 'instantly' | 'onDemand';
        /**
         * [descr:dxPivotGridFieldChooser.Options.dataSource]
         */
        dataSource?: DevExpress.data.PivotGridDataSource;
        /**
         * [descr:dxPivotGridFieldChooser.Options.headerFilter]
         */
        headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
        /**
         * [descr:dxPivotGridFieldChooser.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxPivotGridFieldChooser.Options.layout]
         */
        layout?: 0 | 1 | 2;
        /**
         * [descr:dxPivotGridFieldChooser.Options.onContextMenuPreparing]
         */
        onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, field?: DevExpress.data.PivotGridDataSourceField, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxPivotGridFieldChooser.Options.searchTimeout]
         */
        searchTimeout?: number;
        /**
         * [descr:dxPivotGridFieldChooser.Options.state]
         */
        state?: any;
        /**
         * [descr:dxPivotGridFieldChooser.Options.texts]
         */
        texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string };
    }
    /**
     * [descr:dxPivotGridFieldChooser]
     */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions)
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions)
        /**
         * [descr:dxPivotGridFieldChooser.applyChanges()]
         */
        applyChanges(): void;
        /**
         * [descr:dxPivotGridFieldChooser.cancelChanges()]
         */
        cancelChanges(): void;
        /**
         * [descr:dxPivotGridFieldChooser.getDataSource()]
         */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /**
         * [descr:dxPivotGridFieldChooser.updateDimensions()]
         */
        updateDimensions(): void;
    }
    /**
     * [descr:dxPivotGridPivotGridCell]
     */
    export interface dxPivotGridPivotGridCell {
        /**
         * [descr:dxPivotGridPivotGridCell.columnPath]
         */
        columnPath?: Array<string | number | Date>;
        /**
         * [descr:dxPivotGridPivotGridCell.columnType]
         */
        columnType?: 'D' | 'T' | 'GT';
        /**
         * [descr:dxPivotGridPivotGridCell.dataIndex]
         */
        dataIndex?: number;
        /**
         * [descr:dxPivotGridPivotGridCell.expanded]
         */
        expanded?: boolean;
        /**
         * [descr:dxPivotGridPivotGridCell.path]
         */
        path?: Array<string | number | Date>;
        /**
         * [descr:dxPivotGridPivotGridCell.rowPath]
         */
        rowPath?: Array<string | number | Date>;
        /**
         * [descr:dxPivotGridPivotGridCell.rowType]
         */
        rowType?: 'D' | 'T' | 'GT';
        /**
         * [descr:dxPivotGridPivotGridCell.text]
         */
        text?: string;
        /**
         * [descr:dxPivotGridPivotGridCell.type]
         */
        type?: 'D' | 'T' | 'GT';
        /**
         * [descr:dxPivotGridPivotGridCell.value]
         */
        value?: any;
    }
    /**
     * [descr:dxPivotGridSummaryCell]
     */
    export class dxPivotGridSummaryCell {
        /**
         * [descr:dxPivotGridSummaryCell.child(direction, fieldValue)]
         */
        child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.children(direction)]
         */
        children(direction: string): Array<dxPivotGridSummaryCell>;
        /**
         * [descr:dxPivotGridSummaryCell.field(area)]
         */
        field(area: string): DevExpress.data.PivotGridDataSourceField;
        /**
         * [descr:dxPivotGridSummaryCell.grandTotal()]
         */
        grandTotal(): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.grandTotal(direction)]
         */
        grandTotal(direction: string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.isPostProcessed(field)]
         */
        isPostProcessed(field: DevExpress.data.PivotGridDataSourceField | string): boolean;
        /**
         * [descr:dxPivotGridSummaryCell.next(direction)]
         */
        next(direction: string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.next(direction, allowCrossGroup)]
         */
        next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.parent(direction)]
         */
        parent(direction: string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.prev(direction)]
         */
        prev(direction: string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.prev(direction, allowCrossGroup)]
         */
        prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.slice(field, value)]
         */
        slice(field: DevExpress.data.PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
        /**
         * [descr:dxPivotGridSummaryCell.value()]
         */
        value(): any;
        /**
         * [descr:dxPivotGridSummaryCell.value(field)]
         */
        value(field: DevExpress.data.PivotGridDataSourceField | string): any;
        /**
         * [descr:dxPivotGridSummaryCell.value(field, postProcessed)]
         */
        value(field: DevExpress.data.PivotGridDataSourceField | string, postProcessed: boolean): any;
        /**
         * [descr:dxPivotGridSummaryCell.value(postProcessed)]
         */
        value(postProcessed: boolean): any;
    }
    /**
     * [descr:dxPopover.Options]
     */
    export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
        /**
         * [descr:dxPopover.Options.animation]
         */
        animation?: dxPopoverAnimation;
        /**
         * [descr:dxPopover.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * [descr:dxPopover.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxPopover.Options.hideEvent]
         */
        hideEvent?: { delay?: number, name?: string } | string;
        /**
         * [descr:dxPopover.Options.position]
         */
        position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
        /**
         * [descr:dxPopover.Options.shading]
         */
        shading?: boolean;
        /**
         * [descr:dxPopover.Options.showEvent]
         */
        showEvent?: { delay?: number, name?: string } | string;
        /**
         * [descr:dxPopover.Options.showTitle]
         */
        showTitle?: boolean;
        /**
         * [descr:dxPopover.Options.target]
         */
        target?: string | Element | JQuery;
        /**
         * [descr:dxPopover.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxPopover.Options.animation]
     */
    export interface dxPopoverAnimation extends dxPopupAnimation {
        /**
         * [descr:dxPopover.Options.animation.hide]
         */
        hide?: animationConfig;
        /**
         * [descr:dxPopover.Options.animation.show]
         */
        show?: animationConfig;
    }
    /**
     * [descr:dxPopover]
     */
    export class dxPopover extends dxPopup {
        constructor(element: Element, options?: dxPopoverOptions)
        constructor(element: JQuery, options?: dxPopoverOptions)
        /**
         * [descr:dxOverlay.show()]
         */
        show(): Promise<boolean> & JQueryPromise<boolean>;
        /**
         * [descr:dxPopover.show(target)]
         */
        show(target: string | Element | JQuery): Promise<boolean> & JQueryPromise<boolean>;
    }
    /**
     * [descr:dxPopup.Options]
     */
    export interface dxPopupOptions<T = dxPopup> extends dxOverlayOptions<T> {
        /**
         * [descr:dxPopup.Options.animation]
         */
        animation?: dxPopupAnimation;
        /**
         * [descr:dxPopup.Options.container]
         */
        container?: string | Element | JQuery;
        /**
         * [descr:dxPopup.Options.dragEnabled]
         */
        dragEnabled?: boolean;
        /**
         * [descr:dxPopup.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxPopup.Options.fullScreen]
         */
        fullScreen?: boolean;
        /**
         * [descr:dxPopup.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxPopup.Options.onResize]
         */
        onResize?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxPopup.Options.onResizeEnd]
         */
        onResizeEnd?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxPopup.Options.onResizeStart]
         */
        onResizeStart?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxPopup.Options.onTitleRendered]
         */
        onTitleRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxPopup.Options.position]
         */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /**
         * [descr:dxPopup.Options.resizeEnabled]
         */
        resizeEnabled?: boolean;
        /**
         * [descr:dxPopup.Options.showCloseButton]
         */
        showCloseButton?: boolean;
        /**
         * [descr:dxPopup.Options.showTitle]
         */
        showTitle?: boolean;
        /**
         * [descr:dxPopup.Options.title]
         */
        title?: string;
        /**
         * [descr:dxPopup.Options.titleTemplate]
         */
        titleTemplate?: DevExpress.core.template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxPopup.Options.toolbarItems]
         */
        toolbarItems?: Array<dxPopupToolbarItem>;
        /**
         * [descr:dxPopup.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxPopup.Options.animation]
     */
    export interface dxPopupAnimation extends dxOverlayAnimation {
        /**
         * [descr:dxPopup.Options.animation.hide]
         */
        hide?: animationConfig;
        /**
         * [descr:dxPopup.Options.animation.show]
         */
        show?: animationConfig;
    }
    /**
     * [descr:dxPopup.Options.toolbarItems]
     */
    export interface dxPopupToolbarItem {
        /**
         * [descr:dxPopup.Options.toolbarItems.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:dxPopup.Options.toolbarItems.html]
         */
        html?: string;
        /**
         * [descr:dxPopup.Options.toolbarItems.location]
         */
        location?: 'after' | 'before' | 'center';
        /**
         * [descr:dxPopup.Options.toolbarItems.options]
         */
        options?: any;
        /**
         * [descr:dxPopup.Options.toolbarItems.template]
         */
        template?: DevExpress.core.template;
        /**
         * [descr:dxPopup.Options.toolbarItems.text]
         */
        text?: string;
        /**
         * [descr:dxPopup.Options.toolbarItems.toolbar]
         */
        toolbar?: 'bottom' | 'top';
        /**
         * [descr:dxPopup.Options.toolbarItems.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPopup.Options.toolbarItems.widget]
         */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /**
     * [descr:dxPopup]
     */
    export class dxPopup extends dxOverlay {
        constructor(element: Element, options?: dxPopupOptions)
        constructor(element: JQuery, options?: dxPopupOptions)
    }
    /**
     * [descr:dxProgressBar.Options]
     */
    export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
        /**
         * [descr:dxProgressBar.Options.onComplete]
         */
        onComplete?: ((e: { component?: dxProgressBar, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxProgressBar.Options.showStatus]
         */
        showStatus?: boolean;
        /**
         * [descr:dxProgressBar.Options.statusFormat]
         */
        statusFormat?: string | ((ratio: number, value: number) => string);
        /**
         * [descr:dxProgressBar.Options.value]
         */
        value?: number;
    }
    /**
     * [descr:dxProgressBar]
     */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: Element, options?: dxProgressBarOptions)
        constructor(element: JQuery, options?: dxProgressBarOptions)
    }
    /**
     * [descr:dxRadioGroup.Options]
     */
    export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
        /**
         * [descr:dxRadioGroup.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxRadioGroup.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxRadioGroup.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxRadioGroup.Options.layout]
         */
        layout?: 'horizontal' | 'vertical';
        /**
         * [descr:dxRadioGroup.Options.name]
         */
        name?: string;
        /**
         * [descr:dxRadioGroup.Options.value]
         */
        value?: any;
    }
    /**
     * [descr:dxRadioGroup]
     */
    export class dxRadioGroup extends Editor {
        constructor(element: Element, options?: dxRadioGroupOptions)
        constructor(element: JQuery, options?: dxRadioGroupOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:dxRangeSlider.Options]
     */
    export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
        /**
         * [descr:dxRangeSlider.Options.end]
         */
        end?: number;
        /**
         * [descr:dxRangeSlider.Options.endName]
         */
        endName?: string;
        /**
         * [descr:dxRangeSlider.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: dxRangeSlider, element?: DevExpress.core.dxElement, model?: any, start?: number, end?: number, value?: Array<number> }) => any);
        /**
         * [descr:dxRangeSlider.Options.start]
         */
        start?: number;
        /**
         * [descr:dxRangeSlider.Options.startName]
         */
        startName?: string;
        /**
         * [descr:dxRangeSlider.Options.value]
         */
        value?: Array<number>;
    }
    /**
     * [descr:dxRangeSlider]
     */
    export class dxRangeSlider extends dxSliderBase {
        constructor(element: Element, options?: dxRangeSliderOptions)
        constructor(element: JQuery, options?: dxRangeSliderOptions)
    }
    /**
     * [descr:dxRecurrenceEditor.Options]
     */
    export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
        /**
         * [descr:dxRecurrenceEditor.Options.value]
         */
        value?: string;
    }
    /**
     * [descr:dxRecurrenceEditor]
     */
    export class dxRecurrenceEditor extends Editor {
        constructor(element: Element, options?: dxRecurrenceEditorOptions)
        constructor(element: JQuery, options?: dxRecurrenceEditorOptions)
    }
    /**
     * [descr:dxResizable.Options]
     */
    export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
        /**
         * [descr:dxResizable.Options.handles]
         */
        handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
        /**
         * [descr:dxResizable.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxResizable.Options.maxHeight]
         */
        maxHeight?: number;
        /**
         * [descr:dxResizable.Options.maxWidth]
         */
        maxWidth?: number;
        /**
         * [descr:dxResizable.Options.minHeight]
         */
        minHeight?: number;
        /**
         * [descr:dxResizable.Options.minWidth]
         */
        minWidth?: number;
        /**
         * [descr:dxResizable.Options.onResize]
         */
        onResize?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * [descr:dxResizable.Options.onResizeEnd]
         */
        onResizeEnd?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * [descr:dxResizable.Options.onResizeStart]
         */
        onResizeStart?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, width?: number, height?: number }) => any);
        /**
         * [descr:dxResizable.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxResizable]
     */
    export class dxResizable extends DOMComponent {
        constructor(element: Element, options?: dxResizableOptions)
        constructor(element: JQuery, options?: dxResizableOptions)
    }
    /**
     * [descr:dxResponsiveBox.Options]
     */
    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
        /**
         * [descr:dxResponsiveBox.Options.cols]
         */
        cols?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /**
         * [descr:dxResponsiveBox.Options.dataSource]
         */
        dataSource?: string | Array<string | dxResponsiveBoxItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxResponsiveBox.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxResponsiveBox.Options.items]
         */
        items?: Array<string | dxResponsiveBoxItem | any>;
        /**
         * [descr:dxResponsiveBox.Options.rows]
         */
        rows?: Array<{ baseSize?: number | 'auto', ratio?: number, screen?: string, shrink?: number }>;
        /**
         * [descr:dxResponsiveBox.Options.screenByWidth]
         */
        screenByWidth?: Function;
        /**
         * [descr:dxResponsiveBox.Options.singleColumnScreen]
         */
        singleColumnScreen?: string;
        /**
         * [descr:dxResponsiveBox.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxResponsiveBox]
     */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: Element, options?: dxResponsiveBoxOptions)
        constructor(element: JQuery, options?: dxResponsiveBoxOptions)
    }
    /**
     * [descr:dxResponsiveBoxItem]
     */
    export interface dxResponsiveBoxItem extends CollectionWidgetItem {
        /**
         * [descr:dxResponsiveBoxItem.location]
         */
        location?: { col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
    }
    /**
     * [descr:dxScheduler.Options]
     */
    export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
        /**
         * [descr:dxScheduler.Options.adaptivityEnabled]
         */
        adaptivityEnabled?: boolean;
        /**
         * [descr:dxScheduler.Options.allDayExpr]
         */
        allDayExpr?: string;
        /**
         * [descr:dxScheduler.Options.appointmentCollectorTemplate]
         */
        appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.appointmentDragging]
         */
        appointmentDragging?: { autoScroll?: boolean, data?: any, group?: string, onAdd?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragEnd?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragMove?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onDragStart?: ((e: { event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromData?: any }) => any), onRemove?: ((e: { event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any }) => any), scrollSensitivity?: number, scrollSpeed?: number };
        /**
         * [descr:dxScheduler.Options.appointmentTemplate]
         */
        appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.appointmentTooltipTemplate]
         */
        appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.cellDuration]
         */
        cellDuration?: number;
        /**
         * [descr:dxScheduler.Options.crossScrollingEnabled]
         */
        crossScrollingEnabled?: boolean;
        /**
         * [descr:dxScheduler.Options.currentDate]
         */
        currentDate?: Date | number | string;
        /**
         * [descr:dxScheduler.Options.currentView]
         */
        currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
        /**
         * [descr:dxScheduler.Options.customizeDateNavigatorText]
         */
        customizeDateNavigatorText?: ((info: { startDate?: Date, endDate?: Date, text?: string }) => string);
        /**
         * [descr:dxScheduler.Options.dataCellTemplate]
         */
        dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.dataSource]
         */
        dataSource?: string | Array<dxSchedulerAppointment> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxScheduler.Options.dateCellTemplate]
         */
        dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.dateSerializationFormat]
         */
        dateSerializationFormat?: string;
        /**
         * [descr:dxScheduler.Options.descriptionExpr]
         */
        descriptionExpr?: string;
        /**
         * [descr:dxScheduler.Options.dropDownAppointmentTemplate]
         * @deprecated [depNote:dxScheduler.Options.dropDownAppointmentTemplate]
         */
        dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.editing]
         */
        editing?: boolean | { allowAdding?: boolean, allowDeleting?: boolean, allowDragging?: boolean, allowEditingTimeZones?: boolean, allowResizing?: boolean, allowTimeZoneEditing?: boolean, allowUpdating?: boolean };
        /**
         * [descr:dxScheduler.Options.endDateExpr]
         */
        endDateExpr?: string;
        /**
         * [descr:dxScheduler.Options.endDateTimeZoneExpr]
         */
        endDateTimeZoneExpr?: string;
        /**
         * [descr:dxScheduler.Options.endDayHour]
         */
        endDayHour?: number;
        /**
         * [descr:dxScheduler.Options.firstDayOfWeek]
         */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /**
         * [descr:dxScheduler.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxScheduler.Options.groupByDate]
         */
        groupByDate?: boolean;
        /**
         * [descr:dxScheduler.Options.groups]
         */
        groups?: Array<string>;
        /**
         * [descr:dxScheduler.Options.indicatorUpdateInterval]
         */
        indicatorUpdateInterval?: number;
        /**
         * [descr:dxScheduler.Options.max]
         */
        max?: Date | number | string;
        /**
         * [descr:dxScheduler.Options.maxAppointmentsPerCell]
         */
        maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
        /**
         * [descr:dxScheduler.Options.min]
         */
        min?: Date | number | string;
        /**
         * [descr:dxScheduler.Options.noDataText]
         */
        noDataText?: string;
        /**
         * [descr:dxScheduler.Options.onAppointmentAdded]
         */
        onAppointmentAdded?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentAdding]
         */
        onAppointmentAdding?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentClick]
         */
        onAppointmentClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * [descr:dxScheduler.Options.onAppointmentContextMenu]
         */
        onAppointmentContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxScheduler.Options.onAppointmentDblClick]
         */
        onAppointmentDblClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * [descr:dxScheduler.Options.onAppointmentDeleted]
         */
        onAppointmentDeleted?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentDeleting]
         */
        onAppointmentDeleting?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentFormOpening]
         */
        onAppointmentFormOpening?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, form?: dxForm, popup?: dxPopup, cancel?: boolean }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentRendered]
         */
        onAppointmentRendered?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any | undefined, appointmentElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentUpdated]
         */
        onAppointmentUpdated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /**
         * [descr:dxScheduler.Options.onAppointmentUpdating]
         */
        onAppointmentUpdating?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /**
         * [descr:dxScheduler.Options.onCellClick]
         */
        onCellClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, event?: DevExpress.events.event, cancel?: boolean }) => any) | string;
        /**
         * [descr:dxScheduler.Options.onCellContextMenu]
         */
        onCellContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxScheduler.Options.recurrenceEditMode]
         */
        recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
        /**
         * [descr:dxScheduler.Options.recurrenceExceptionExpr]
         */
        recurrenceExceptionExpr?: string;
        /**
         * [descr:dxScheduler.Options.recurrenceRuleExpr]
         */
        recurrenceRuleExpr?: string;
        /**
         * [descr:dxScheduler.Options.remoteFiltering]
         */
        remoteFiltering?: boolean;
        /**
         * [descr:dxScheduler.Options.resourceCellTemplate]
         */
        resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.resources]
         */
        resources?: Array<{ allowMultiple?: boolean, colorExpr?: string, dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions, displayExpr?: string | ((resource: any) => string), fieldExpr?: string, label?: string, useColorAsDefault?: boolean, valueExpr?: string | Function }>;
        /**
         * [descr:dxScheduler.Options.scrolling]
         */
        scrolling?: dxSchedulerScrolling;
        /**
         * [descr:dxScheduler.Options.selectedCellData]
         */
        selectedCellData?: Array<any>;
        /**
         * [descr:dxScheduler.Options.shadeUntilCurrentTime]
         */
        shadeUntilCurrentTime?: boolean;
        /**
         * [descr:dxScheduler.Options.showAllDayPanel]
         */
        showAllDayPanel?: boolean;
        /**
         * [descr:dxScheduler.Options.showCurrentTimeIndicator]
         */
        showCurrentTimeIndicator?: boolean;
        /**
         * [descr:dxScheduler.Options.startDateExpr]
         */
        startDateExpr?: string;
        /**
         * [descr:dxScheduler.Options.startDateTimeZoneExpr]
         */
        startDateTimeZoneExpr?: string;
        /**
         * [descr:dxScheduler.Options.startDayHour]
         */
        startDayHour?: number;
        /**
         * [descr:dxScheduler.Options.textExpr]
         */
        textExpr?: string;
        /**
         * [descr:dxScheduler.Options.timeCellTemplate]
         */
        timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxScheduler.Options.timeZone]
         */
        timeZone?: string;
        /**
         * [descr:dxScheduler.Options.useDropDownViewSwitcher]
         */
        useDropDownViewSwitcher?: boolean;
        /**
         * [descr:dxScheduler.Options.views]
         */
        views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | { agendaDuration?: number, appointmentCollectorTemplate?: DevExpress.core.template | ((data: { appointmentCount?: number, isCompact?: boolean }, collectorElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTooltipTemplate?: DevExpress.core.template | ((model: { appointmentData?: any, targetedAppointmentData?: any }, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), cellDuration?: number, dataCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dateCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dropDownAppointmentTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), endDayHour?: number, firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6, groupByDate?: boolean, groupOrientation?: 'horizontal' | 'vertical', groups?: Array<string>, intervalCount?: number, maxAppointmentsPerCell?: number | 'auto' | 'unlimited', name?: string, resourceCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), scrolling?: dxSchedulerScrolling, startDate?: Date | number | string, startDayHour?: number, timeCellTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek' }>;
    }
    /**
     * [descr:dxScheduler]
     */
    export class dxScheduler extends Widget {
        constructor(element: Element, options?: dxSchedulerOptions)
        constructor(element: JQuery, options?: dxSchedulerOptions)
        /**
         * [descr:dxScheduler.addAppointment(appointment)]
         */
        addAppointment(appointment: any): void;
        /**
         * [descr:dxScheduler.deleteAppointment(appointment)]
         */
        deleteAppointment(appointment: any): void;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxScheduler.getEndViewDate()]
         */
        getEndViewDate(): Date;
        /**
         * [descr:dxScheduler.getStartViewDate()]
         */
        getStartViewDate(): Date;
        /**
         * [descr:dxScheduler.hideAppointmentPopup(saveChanges)]
         */
        hideAppointmentPopup(saveChanges?: boolean): void;
        /**
         * [descr:dxScheduler.hideAppointmentTooltip()]
         */
        hideAppointmentTooltip(): void;
        /**
         * [descr:dxScheduler.scrollToTime(hours, minutes, date)]
         */
        scrollToTime(hours: number, minutes: number, date?: Date): void;
        /**
         * [descr:dxScheduler.showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)]
         */
        showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
        /**
         * [descr:dxScheduler.showAppointmentTooltip(appointmentData, target, currentAppointmentData)]
         */
        showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
        /**
         * [descr:dxScheduler.updateAppointment(target, appointment)]
         */
        updateAppointment(target: any, appointment: any): void;
    }
    /**
     * [descr:dxSchedulerAppointment]
     */
    export interface dxSchedulerAppointment extends CollectionWidgetItem {
        /**
         * [descr:dxSchedulerAppointment.allDay]
         */
        allDay?: boolean;
        /**
         * [descr:dxSchedulerAppointment.description]
         */
        description?: string;
        /**
         * [descr:dxSchedulerAppointment.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:dxSchedulerAppointment.endDate]
         */
        endDate?: Date;
        /**
         * [descr:dxSchedulerAppointment.endDateTimeZone]
         */
        endDateTimeZone?: string;
        /**
         * [descr:dxSchedulerAppointment.html]
         */
        html?: string;
        /**
         * [descr:dxSchedulerAppointment.recurrenceException]
         */
        recurrenceException?: string;
        /**
         * [descr:dxSchedulerAppointment.recurrenceRule]
         */
        recurrenceRule?: string;
        /**
         * [descr:dxSchedulerAppointment.startDate]
         */
        startDate?: Date;
        /**
         * [descr:dxSchedulerAppointment.startDateTimeZone]
         */
        startDateTimeZone?: string;
        /**
         * [descr:dxSchedulerAppointment.template]
         */
        template?: DevExpress.core.template;
        /**
         * [descr:dxSchedulerAppointment.text]
         */
        text?: string;
        /**
         * [descr:dxSchedulerAppointment.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxSchedulerScrolling]
     */
    export interface dxSchedulerScrolling {
        /**
         * [descr:dxSchedulerScrolling.mode]
         */
        mode?: 'standard' | 'virtual';
    }
    /**
     * [descr:dxScrollView.Options]
     */
    export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
        /**
         * [descr:dxScrollView.Options.onPullDown]
         */
        onPullDown?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxScrollView.Options.onReachBottom]
         */
        onReachBottom?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxScrollView.Options.pulledDownText]
         */
        pulledDownText?: string;
        /**
         * [descr:dxScrollView.Options.pullingDownText]
         */
        pullingDownText?: string;
        /**
         * [descr:dxScrollView.Options.reachBottomText]
         */
        reachBottomText?: string;
        /**
         * [descr:dxScrollView.Options.refreshingText]
         */
        refreshingText?: string;
    }
    /**
     * [descr:dxScrollView]
     */
    export class dxScrollView extends dxScrollable {
        constructor(element: Element, options?: dxScrollViewOptions)
        constructor(element: JQuery, options?: dxScrollViewOptions)
        /**
         * [descr:dxScrollView.refresh()]
         */
        refresh(): void;
        /**
         * [descr:dxScrollView.release(preventScrollBottom)]
         */
        release(preventScrollBottom: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxScrollable.Options]
     */
    export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
        /**
         * [descr:dxScrollable.Options.bounceEnabled]
         */
        bounceEnabled?: boolean;
        /**
         * [descr:dxScrollable.Options.direction]
         */
        direction?: 'both' | 'horizontal' | 'vertical';
        /**
         * [descr:dxScrollable.Options.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:dxScrollable.Options.onScroll]
         */
        onScroll?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * [descr:dxScrollable.Options.onUpdated]
         */
        onUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /**
         * [descr:dxScrollable.Options.scrollByContent]
         */
        scrollByContent?: boolean;
        /**
         * [descr:dxScrollable.Options.scrollByThumb]
         */
        scrollByThumb?: boolean;
        /**
         * [descr:dxScrollable.Options.showScrollbar]
         */
        showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
        /**
         * [descr:dxScrollable.Options.useNative]
         */
        useNative?: boolean;
    }
    /**
     * [descr:dxScrollable]
     */
    export class dxScrollable extends DOMComponent {
        constructor(element: Element, options?: dxScrollableOptions)
        constructor(element: JQuery, options?: dxScrollableOptions)
        /**
         * [descr:dxScrollable.clientHeight()]
         */
        clientHeight(): number;
        /**
         * [descr:dxScrollable.clientWidth()]
         */
        clientWidth(): number;
        /**
         * [descr:dxScrollable.content()]
         */
        content(): DevExpress.core.dxElement;
        /**
         * [descr:dxScrollable.scrollBy(distance)]
         */
        scrollBy(distance: number): void;
        /**
         * [descr:dxScrollable.scrollBy(distanceObject)]
         */
        scrollBy(distanceObject: any): void;
        /**
         * [descr:dxScrollable.scrollHeight()]
         */
        scrollHeight(): number;
        /**
         * [descr:dxScrollable.scrollLeft()]
         */
        scrollLeft(): number;
        /**
         * [descr:dxScrollable.scrollOffset()]
         */
        scrollOffset(): any;
        /**
         * [descr:dxScrollable.scrollTo(targetLocation)]
         */
        scrollTo(targetLocation: number): void;
        /**
         * [descr:dxScrollable.scrollTo(targetLocationObject)]
         */
        scrollTo(targetLocation: any): void;
        /**
         * [descr:dxScrollable.scrollToElement(targetLocation)]
         */
        scrollToElement(element: Element | JQuery): void;
        /**
         * [descr:dxScrollable.scrollTop()]
         */
        scrollTop(): number;
        /**
         * [descr:dxScrollable.scrollWidth()]
         */
        scrollWidth(): number;
        /**
         * [descr:dxScrollable.update()]
         */
        update(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxSelectBox.Options]
     */
    export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
        /**
         * [descr:dxSelectBox.Options.acceptCustomValue]
         */
        acceptCustomValue?: boolean;
        /**
         * [descr:dxSelectBox.Options.fieldTemplate]
         */
        fieldTemplate?: DevExpress.core.template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxSelectBox.Options.onCustomItemCreating]
         */
        onCustomItemCreating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, text?: string, customItem?: string | any | Promise<any> | JQueryPromise<any> }) => any);
        /**
         * [descr:dxSelectBox.Options.openOnFieldClick]
         */
        openOnFieldClick?: boolean;
        /**
         * [descr:dxSelectBox.Options.placeholder]
         */
        placeholder?: string;
        /**
         * [descr:dxSelectBox.Options.showDropDownButton]
         */
        showDropDownButton?: boolean;
        /**
         * [descr:dxSelectBox.Options.showSelectionControls]
         */
        showSelectionControls?: boolean;
        /**
         * [descr:dxSelectBox.Options.valueChangeEvent]
         */
        valueChangeEvent?: string;
    }
    /**
     * [descr:dxSelectBox]
     */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: Element, options?: dxSelectBoxOptions)
        constructor(element: JQuery, options?: dxSelectBoxOptions)
    }
    /**
     * [descr:dxSlideOut.Options]
     */
    export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
        /**
         * [descr:dxSlideOut.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxSlideOut.Options.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((container: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxSlideOut.Options.dataSource]
         */
        dataSource?: string | Array<string | dxSlideOutItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxSlideOut.Options.items]
         */
        items?: Array<string | dxSlideOutItem | any>;
        /**
         * [descr:dxSlideOut.Options.menuGroupTemplate]
         */
        menuGroupTemplate?: DevExpress.core.template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
        /**
         * [descr:dxSlideOut.Options.menuGrouped]
         */
        menuGrouped?: boolean;
        /**
         * [descr:dxSlideOut.Options.menuItemTemplate]
         */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxSlideOut.Options.menuPosition]
         */
        menuPosition?: 'inverted' | 'normal';
        /**
         * [descr:dxSlideOut.Options.menuVisible]
         */
        menuVisible?: boolean;
        /**
         * [descr:dxSlideOut.Options.onMenuGroupRendered]
         */
        onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxSlideOut.Options.onMenuItemRendered]
         */
        onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxSlideOut.Options.selectedIndex]
         */
        selectedIndex?: number;
        /**
         * [descr:dxSlideOut.Options.swipeEnabled]
         */
        swipeEnabled?: boolean;
    }
    /**
     * [descr:dxSlideOut]
     */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: Element, options?: dxSlideOutOptions)
        constructor(element: JQuery, options?: dxSlideOutOptions)
        /**
         * [descr:dxSlideOut.hideMenu()]
         */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxSlideOut.showMenu()]
         */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxSlideOut.toggleMenuVisibility(showing)]
         */
        toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxSlideOutItem]
     */
    export interface dxSlideOutItem extends CollectionWidgetItem {
        /**
         * [descr:dxSlideOutItem.menuTemplate]
         */
        menuTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
    }
    /**
     * [descr:dxSlideOutView.Options]
     */
    export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
        /**
         * [descr:dxSlideOutView.Options.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((contentElement: DevExpress.core.dxElement) => any);
        /**
         * [descr:dxSlideOutView.Options.menuPosition]
         */
        menuPosition?: 'inverted' | 'normal';
        /**
         * [descr:dxSlideOutView.Options.menuTemplate]
         */
        menuTemplate?: DevExpress.core.template | ((menuElement: DevExpress.core.dxElement) => any);
        /**
         * [descr:dxSlideOutView.Options.menuVisible]
         */
        menuVisible?: boolean;
        /**
         * [descr:dxSlideOutView.Options.swipeEnabled]
         */
        swipeEnabled?: boolean;
    }
    /**
     * [descr:dxSlideOutView]
     */
    export class dxSlideOutView extends Widget {
        constructor(element: Element, options?: dxSlideOutViewOptions)
        constructor(element: JQuery, options?: dxSlideOutViewOptions)
        /**
         * [descr:dxSlideOutView.content()]
         */
        content(): DevExpress.core.dxElement;
        /**
         * [descr:dxSlideOutView.hideMenu()]
         */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxSlideOutView.menuContent()]
         */
        menuContent(): DevExpress.core.dxElement;
        /**
         * [descr:dxSlideOutView.showMenu()]
         */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxSlideOutView.toggleMenuVisibility()]
         */
        toggleMenuVisibility(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxSlider.Options]
     */
    export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
        /**
         * [descr:dxSlider.Options.value]
         */
        value?: number;
    }
    /**
     * [descr:dxSlider]
     */
    export class dxSlider extends dxSliderBase {
        constructor(element: Element, options?: dxSliderOptions)
        constructor(element: JQuery, options?: dxSliderOptions)
    }
    /**
     * [descr:dxSliderBase.Options]
     */
    export interface dxSliderBaseOptions<T = dxSliderBase> extends dxTrackBarOptions<T> {
        /**
         * [descr:dxSliderBase.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxSliderBase.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxSliderBase.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxSliderBase.Options.keyStep]
         */
        keyStep?: number;
        /**
         * [descr:dxSliderBase.Options.label]
         */
        label?: { format?: format, position?: 'bottom' | 'top', visible?: boolean };
        /**
         * [descr:dxSliderBase.Options.name]
         */
        name?: string;
        /**
         * [descr:dxSliderBase.Options.showRange]
         */
        showRange?: boolean;
        /**
         * [descr:dxSliderBase.Options.step]
         */
        step?: number;
        /**
         * [descr:dxSliderBase.Options.tooltip]
         */
        tooltip?: { enabled?: boolean, format?: format, position?: 'bottom' | 'top', showMode?: 'always' | 'onHover' };
    }
    /**
     * [descr:dxSliderBase]
     */
    export class dxSliderBase extends dxTrackBar {
        constructor(element: Element, options?: dxSliderBaseOptions)
        constructor(element: JQuery, options?: dxSliderBaseOptions)
    }
    /**
     * [descr:dxSortable.Options]
     */
    export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
        /**
         * [descr:dxSortable.Options.allowDropInsideItem]
         */
        allowDropInsideItem?: boolean;
        /**
         * [descr:dxSortable.Options.allowReordering]
         */
        allowReordering?: boolean;
        /**
         * [descr:dxSortable.Options.dragTemplate]
         */
        dragTemplate?: DevExpress.core.template | ((dragInfo: { itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number }, containerElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxSortable.Options.dropFeedbackMode]
         */
        dropFeedbackMode?: 'push' | 'indicate';
        /**
         * [descr:dxSortable.Options.filter]
         */
        filter?: string;
        /**
         * [descr:dxSortable.Options.itemOrientation]
         */
        itemOrientation?: 'horizontal' | 'vertical';
        /**
         * [descr:dxSortable.Options.moveItemOnDrop]
         */
        moveItemOnDrop?: boolean;
        /**
         * [descr:dxSortable.Options.onAdd]
         */
        onAdd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * [descr:dxSortable.Options.onDragChange]
         */
        onDragChange?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * [descr:dxSortable.Options.onDragEnd]
         */
        onDragEnd?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * [descr:dxSortable.Options.onDragMove]
         */
        onDragMove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
        /**
         * [descr:dxSortable.Options.onDragStart]
         */
        onDragStart?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, cancel?: boolean, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, fromData?: any }) => any);
        /**
         * [descr:dxSortable.Options.onRemove]
         */
        onRemove?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
        /**
         * [descr:dxSortable.Options.onReorder]
         */
        onReorder?: ((e: { component?: dxSortable, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, itemData?: any, itemElement?: DevExpress.core.dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: Promise<void> | JQueryPromise<void> }) => any);
    }
    /**
     * [descr:dxSortable]
     */
    export class dxSortable extends DraggableBase {
        constructor(element: Element, options?: dxSortableOptions)
        constructor(element: JQuery, options?: dxSortableOptions)
        /**
         * [descr:dxSortable.update()]
         */
        update(): void;
    }
    /**
     * [descr:dxSpeedDialAction.Options]
     */
    export interface dxSpeedDialActionOptions extends WidgetOptions<dxSpeedDialAction> {
        /**
         * [descr:dxSpeedDialAction.Options.icon]
         */
        icon?: string;
        /**
         * [descr:dxSpeedDialAction.Options.index]
         */
        index?: number;
        /**
         * [descr:dxSpeedDialAction.Options.label]
         */
        label?: string;
        /**
         * [descr:dxSpeedDialAction.Options.onClick]
         */
        onClick?: ((e: { event?: DevExpress.events.event, component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, actionElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxSpeedDialAction.Options.onContentReady]
         */
        onContentReady?: ((e: { component?: dxSpeedDialAction, element?: DevExpress.core.dxElement, model?: any, actionElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxSpeedDialAction.Options.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxSpeedDialAction]
     */
    export class dxSpeedDialAction extends Widget {
        constructor(element: Element, options?: dxSpeedDialActionOptions)
        constructor(element: JQuery, options?: dxSpeedDialActionOptions)
    }
    /**
     * [descr:dxSwitch.Options]
     */
    export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
        /**
         * [descr:dxSwitch.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxSwitch.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxSwitch.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxSwitch.Options.name]
         */
        name?: string;
        /**
         * [descr:dxSwitch.Options.switchedOffText]
         */
        switchedOffText?: string;
        /**
         * [descr:dxSwitch.Options.switchedOnText]
         */
        switchedOnText?: string;
        /**
         * [descr:dxSwitch.Options.value]
         */
        value?: boolean;
    }
    /**
     * [descr:dxSwitch]
     */
    export class dxSwitch extends Editor {
        constructor(element: Element, options?: dxSwitchOptions)
        constructor(element: JQuery, options?: dxSwitchOptions)
    }
    /**
     * [descr:dxTabPanel.Options]
     */
    export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
        /**
         * [descr:dxTabPanel.Options.animationEnabled]
         */
        animationEnabled?: boolean;
        /**
         * [descr:dxTabPanel.Options.dataSource]
         */
        dataSource?: string | Array<string | dxTabPanelItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxTabPanel.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxTabPanel.Options.itemTitleTemplate]
         */
        itemTitleTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxTabPanel.Options.items]
         */
        items?: Array<string | dxTabPanelItem | any>;
        /**
         * [descr:dxTabPanel.Options.onTitleClick]
         */
        onTitleClick?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any) | string;
        /**
         * [descr:dxTabPanel.Options.onTitleHold]
         */
        onTitleHold?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTabPanel.Options.onTitleRendered]
         */
        onTitleRendered?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxTabPanel.Options.repaintChangesOnly]
         */
        repaintChangesOnly?: boolean;
        /**
         * [descr:dxTabPanel.Options.scrollByContent]
         */
        scrollByContent?: boolean;
        /**
         * [descr:dxTabPanel.Options.scrollingEnabled]
         */
        scrollingEnabled?: boolean;
        /**
         * [descr:dxTabPanel.Options.showNavButtons]
         */
        showNavButtons?: boolean;
        /**
         * [descr:dxTabPanel.Options.swipeEnabled]
         */
        swipeEnabled?: boolean;
    }
    /**
     * [descr:dxTabPanel]
     */
    export class dxTabPanel extends dxMultiView {
        constructor(element: Element, options?: dxTabPanelOptions)
        constructor(element: JQuery, options?: dxTabPanelOptions)
    }
    /**
     * [descr:dxTabPanelItem]
     */
    export interface dxTabPanelItem extends dxMultiViewItem {
        /**
         * [descr:dxTabPanelItem.badge]
         */
        badge?: string;
        /**
         * [descr:dxTabPanelItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxTabPanelItem.tabTemplate]
         */
        tabTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * [descr:dxTabPanelItem.title]
         */
        title?: string;
    }
    /**
     * [descr:dxTabs.Options]
     */
    export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
        /**
         * [descr:dxTabs.Options.dataSource]
         */
        dataSource?: string | Array<string | dxTabsItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxTabs.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxTabs.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxTabs.Options.items]
         */
        items?: Array<string | dxTabsItem | any>;
        /**
         * [descr:dxTabs.Options.repaintChangesOnly]
         */
        repaintChangesOnly?: boolean;
        /**
         * [descr:dxTabs.Options.scrollByContent]
         */
        scrollByContent?: boolean;
        /**
         * [descr:dxTabs.Options.scrollingEnabled]
         */
        scrollingEnabled?: boolean;
        /**
         * [descr:dxTabs.Options.selectedItems]
         */
        selectedItems?: Array<string | number | any>;
        /**
         * [descr:dxTabs.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxTabs.Options.showNavButtons]
         */
        showNavButtons?: boolean;
    }
    /**
     * [descr:dxTabs]
     */
    export class dxTabs extends CollectionWidget {
        constructor(element: Element, options?: dxTabsOptions)
        constructor(element: JQuery, options?: dxTabsOptions)
    }
    /**
     * [descr:dxTabsItem]
     */
    export interface dxTabsItem extends CollectionWidgetItem {
        /**
         * [descr:dxTabsItem.badge]
         */
        badge?: string;
        /**
         * [descr:dxTabsItem.icon]
         */
        icon?: string;
    }
    /**
     * [descr:dxTagBox.Options]
     */
    export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
        /**
         * [descr:dxTagBox.Options.applyValueMode]
         */
        applyValueMode?: 'instantly' | 'useButtons';
        /**
         * [descr:dxTagBox.Options.hideSelectedItems]
         */
        hideSelectedItems?: boolean;
        /**
         * [descr:dxTagBox.Options.maxDisplayedTags]
         */
        maxDisplayedTags?: number;
        /**
         * [descr:dxTagBox.Options.multiline]
         */
        multiline?: boolean;
        /**
         * [descr:dxTagBox.Options.onMultiTagPreparing]
         */
        onMultiTagPreparing?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, multiTagElement?: DevExpress.core.dxElement, selectedItems?: Array<string | number | any>, text?: string, cancel?: boolean }) => any);
        /**
         * [descr:dxTagBox.Options.onSelectAllValueChanged]
         */
        onSelectAllValueChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * [descr:dxTagBox.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<string | number | any>, removedItems?: Array<string | number | any> }) => any);
        /**
         * [descr:dxTagBox.Options.selectAllMode]
         */
        selectAllMode?: 'allPages' | 'page';
        /**
         * [descr:dxTagBox.Options.selectedItems]
         */
        selectedItems?: Array<string | number | any>;
        /**
         * [descr:dxTagBox.Options.showDropDownButton]
         */
        showDropDownButton?: boolean;
        /**
         * [descr:dxTagBox.Options.showMultiTagOnly]
         */
        showMultiTagOnly?: boolean;
        /**
         * [descr:dxTagBox.Options.tagTemplate]
         */
        tagTemplate?: DevExpress.core.template | ((itemData: any, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxTagBox.Options.value]
         */
        value?: Array<string | number | any>;
    }
    /**
     * [descr:dxTagBox]
     */
    export class dxTagBox extends dxSelectBox {
        constructor(element: Element, options?: dxTagBoxOptions)
        constructor(element: JQuery, options?: dxTagBoxOptions)
    }
    /**
     * [descr:dxTextArea.Options]
     */
    export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
        /**
         * [descr:dxTextArea.Options.autoResizeEnabled]
         */
        autoResizeEnabled?: boolean;
        /**
         * [descr:dxTextArea.Options.maxHeight]
         */
        maxHeight?: number | string;
        /**
         * [descr:dxTextArea.Options.minHeight]
         */
        minHeight?: number | string;
        /**
         * [descr:dxTextArea.Options.spellcheck]
         */
        spellcheck?: boolean;
    }
    /**
     * [descr:dxTextArea]
     */
    export class dxTextArea extends dxTextBox {
        constructor(element: Element, options?: dxTextAreaOptions)
        constructor(element: JQuery, options?: dxTextAreaOptions)
    }
    /**
     * [descr:dxTextBox.Options]
     */
    export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
        /**
         * [descr:dxTextBox.Options.maxLength]
         */
        maxLength?: string | number;
        /**
         * [descr:dxTextBox.Options.mode]
         */
        mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
        /**
         * [descr:dxTextBox.Options.value]
         */
        value?: string;
    }
    /**
     * [descr:dxTextBox]
     */
    export class dxTextBox extends dxTextEditor {
        constructor(element: Element, options?: dxTextBoxOptions)
        constructor(element: JQuery, options?: dxTextBoxOptions)
    }
    /**
     * [descr:dxTextEditor.Options]
     */
    export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
        /**
         * [descr:dxTextEditor.Options.buttons]
         */
        buttons?: Array<string | 'clear' | dxTextEditorButton>;
        /**
         * [descr:dxTextEditor.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxTextEditor.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxTextEditor.Options.inputAttr]
         */
        inputAttr?: any;
        /**
         * [descr:dxTextEditor.Options.mask]
         */
        mask?: string;
        /**
         * [descr:dxTextEditor.Options.maskChar]
         */
        maskChar?: string;
        /**
         * [descr:dxTextEditor.Options.maskInvalidMessage]
         */
        maskInvalidMessage?: string;
        /**
         * [descr:dxTextEditor.Options.maskRules]
         */
        maskRules?: any;
        /**
         * [descr:dxTextEditor.Options.name]
         */
        name?: string;
        /**
         * [descr:dxTextEditor.Options.onChange]
         */
        onChange?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onCopy]
         */
        onCopy?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onCut]
         */
        onCut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onEnterKey]
         */
        onEnterKey?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onFocusIn]
         */
        onFocusIn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onFocusOut]
         */
        onFocusOut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onInput]
         */
        onInput?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onKeyDown]
         */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onKeyPress]
         * @deprecated [depNote:dxTextEditor.Options.onKeyPress]
         */
        onKeyPress?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onKeyUp]
         */
        onKeyUp?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.onPaste]
         */
        onPaste?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxTextEditor.Options.placeholder]
         */
        placeholder?: string;
        /**
         * [descr:dxTextEditor.Options.showClearButton]
         */
        showClearButton?: boolean;
        /**
         * [descr:dxTextEditor.Options.showMaskMode]
         */
        showMaskMode?: 'always' | 'onFocus';
        /**
         * [descr:dxTextEditor.Options.spellcheck]
         */
        spellcheck?: boolean;
        /**
         * [descr:dxTextEditor.Options.stylingMode]
         */
        stylingMode?: 'outlined' | 'underlined' | 'filled';
        /**
         * [descr:dxTextEditor.Options.text]
         */
        text?: string;
        /**
         * [descr:dxTextEditor.Options.useMaskedValue]
         */
        useMaskedValue?: boolean;
        /**
         * [descr:dxTextEditor.Options.value]
         */
        value?: any;
        /**
         * [descr:dxTextEditor.Options.valueChangeEvent]
         */
        valueChangeEvent?: string;
    }
    /**
     * [descr:dxTextEditor]
     */
    export class dxTextEditor extends Editor {
        constructor(element: Element, options?: dxTextEditorOptions)
        constructor(element: JQuery, options?: dxTextEditorOptions)
        /**
         * [descr:dxTextEditor.blur()]
         */
        blur(): void;
        /**
         * [descr:dxTextEditor.focus()]
         */
        focus(): void;
        /**
         * [descr:dxTextEditor.getButton(name)]
         */
        getButton(name: string): dxButton | undefined;
    }
    /**
     * [descr:dxTextEditorButton]
     */
    export interface dxTextEditorButton {
        /**
         * [descr:dxTextEditorButton.location]
         */
        location?: 'after' | 'before';
        /**
         * [descr:dxTextEditorButton.name]
         */
        name?: string;
        /**
         * [descr:dxTextEditorButton.options]
         */
        options?: dxButtonOptions;
    }
    /**
     * [descr:dxTileView.Options]
     */
    export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
        /**
         * [descr:dxTileView.Options.activeStateEnabled]
         */
        activeStateEnabled?: boolean;
        /**
         * [descr:dxTileView.Options.baseItemHeight]
         */
        baseItemHeight?: number;
        /**
         * [descr:dxTileView.Options.baseItemWidth]
         */
        baseItemWidth?: number;
        /**
         * [descr:dxTileView.Options.dataSource]
         */
        dataSource?: string | Array<string | dxTileViewItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxTileView.Options.direction]
         */
        direction?: 'horizontal' | 'vertical';
        /**
         * [descr:dxTileView.Options.focusStateEnabled]
         */
        focusStateEnabled?: boolean;
        /**
         * [descr:dxTileView.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxTileView.Options.hoverStateEnabled]
         */
        hoverStateEnabled?: boolean;
        /**
         * [descr:dxTileView.Options.itemMargin]
         */
        itemMargin?: number;
        /**
         * [descr:dxTileView.Options.items]
         */
        items?: Array<string | dxTileViewItem | any>;
        /**
         * [descr:dxTileView.Options.showScrollbar]
         */
        showScrollbar?: boolean;
    }
    /**
     * [descr:dxTileView]
     */
    export class dxTileView extends CollectionWidget {
        constructor(element: Element, options?: dxTileViewOptions)
        constructor(element: JQuery, options?: dxTileViewOptions)
        /**
         * [descr:dxTileView.scrollPosition()]
         */
        scrollPosition(): number;
    }
    /**
     * [descr:dxTileViewItem]
     */
    export interface dxTileViewItem extends CollectionWidgetItem {
        /**
         * [descr:dxTileViewItem.heightRatio]
         */
        heightRatio?: number;
        /**
         * [descr:dxTileViewItem.widthRatio]
         */
        widthRatio?: number;
    }
    /**
     * [descr:dxToast.Options]
     */
    export interface dxToastOptions extends dxOverlayOptions<dxToast> {
        /**
         * [descr:dxToast.Options.animation]
         */
        animation?: dxToastAnimation;
        /**
         * [descr:dxToast.Options.closeOnClick]
         */
        closeOnClick?: boolean;
        /**
         * [descr:dxToast.Options.closeOnOutsideClick]
         */
        closeOnOutsideClick?: boolean | ((event: DevExpress.events.event) => boolean);
        /**
         * [descr:dxToast.Options.closeOnSwipe]
         */
        closeOnSwipe?: boolean;
        /**
         * [descr:dxToast.Options.displayTime]
         */
        displayTime?: number;
        /**
         * [descr:dxToast.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxToast.Options.maxWidth]
         */
        maxWidth?: number | string | (() => number | string);
        /**
         * [descr:dxToast.Options.message]
         */
        message?: string;
        /**
         * [descr:dxToast.Options.minWidth]
         */
        minWidth?: number | string | (() => number | string);
        /**
         * [descr:dxToast.Options.position]
         */
        position?: positionConfig | string;
        /**
         * [descr:dxToast.Options.shading]
         */
        shading?: boolean;
        /**
         * [descr:dxToast.Options.type]
         */
        type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
        /**
         * [descr:dxToast.Options.width]
         */
        width?: number | string | (() => number | string);
    }
    /**
     * [descr:dxToast.Options.animation]
     */
    export interface dxToastAnimation extends dxOverlayAnimation {
        /**
         * [descr:dxToast.Options.animation.hide]
         */
        hide?: animationConfig;
        /**
         * [descr:dxToast.Options.animation.show]
         */
        show?: animationConfig;
    }
    /**
     * [descr:dxToast]
     */
    export class dxToast extends dxOverlay {
        constructor(element: Element, options?: dxToastOptions)
        constructor(element: JQuery, options?: dxToastOptions)
    }
    /**
     * [descr:dxToolbar.Options]
     */
    export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
        /**
         * [descr:dxToolbar.Options.dataSource]
         */
        dataSource?: string | Array<string | dxToolbarItem | any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxToolbar.Options.height]
         * @deprecated [depNote:dxToolbar.Options.height]
         */
        height?: number | string | (() => number | string);
        /**
         * [descr:dxToolbar.Options.items]
         */
        items?: Array<string | dxToolbarItem | any>;
        /**
         * [descr:dxToolbar.Options.menuItemTemplate]
         */
        menuItemTemplate?: DevExpress.core.template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:dxToolbar]
     */
    export class dxToolbar extends CollectionWidget {
        constructor(element: Element, options?: dxToolbarOptions)
        constructor(element: JQuery, options?: dxToolbarOptions)
    }
    /**
     * [descr:dxToolbarItem]
     */
    export interface dxToolbarItem extends CollectionWidgetItem {
        /**
         * [descr:dxToolbarItem.cssClass]
         */
        cssClass?: string;
        /**
         * [descr:dxToolbarItem.locateInMenu]
         */
        locateInMenu?: 'always' | 'auto' | 'never';
        /**
         * [descr:dxToolbarItem.location]
         */
        location?: 'after' | 'before' | 'center';
        /**
         * [descr:dxToolbarItem.menuItemTemplate]
         */
        menuItemTemplate?: DevExpress.core.template | (() => string | Element | JQuery);
        /**
         * [descr:dxToolbarItem.options]
         */
        options?: any;
        /**
         * [descr:dxToolbarItem.showText]
         */
        showText?: 'always' | 'inMenu';
        /**
         * [descr:dxToolbarItem.widget]
         */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
    }
    /**
     * [descr:dxTooltip.Options]
     */
    export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
    }
    /**
     * [descr:dxTooltip]
     */
    export class dxTooltip extends dxPopover {
        constructor(element: Element, options?: dxTooltipOptions)
        constructor(element: JQuery, options?: dxTooltipOptions)
    }
    /**
     * [descr:dxTrackBar.Options]
     */
    export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
        /**
         * [descr:dxTrackBar.Options.max]
         */
        max?: number;
        /**
         * [descr:dxTrackBar.Options.min]
         */
        min?: number;
    }
    /**
     * [descr:dxTrackBar]
     */
    export class dxTrackBar extends Editor {
        constructor(element: Element, options?: dxTrackBarOptions)
        constructor(element: JQuery, options?: dxTrackBarOptions)
    }
    /**
     * [descr:dxTreeList.Options]
     */
    export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
        /**
         * [descr:dxTreeList.Options.autoExpandAll]
         */
        autoExpandAll?: boolean;
        /**
         * [descr:dxTreeList.Options.columns]
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * [descr:dxTreeList.Options.customizeColumns]
         */
        customizeColumns?: ((columns: Array<dxTreeListColumn>) => any);
        /**
         * [descr:dxTreeList.Options.dataStructure]
         */
        dataStructure?: 'plain' | 'tree';
        /**
         * [descr:dxTreeList.Options.editing]
         */
        editing?: dxTreeListEditing;
        /**
         * [descr:dxTreeList.Options.expandNodesOnFiltering]
         */
        expandNodesOnFiltering?: boolean;
        /**
         * [descr:dxTreeList.Options.expandedRowKeys]
         */
        expandedRowKeys?: Array<any>;
        /**
         * [descr:dxTreeList.Options.filterMode]
         */
        filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
        /**
         * [descr:dxTreeList.Options.hasItemsExpr]
         */
        hasItemsExpr?: string | Function;
        /**
         * [descr:dxTreeList.Options.itemsExpr]
         */
        itemsExpr?: string | Function;
        /**
         * [descr:dxTreeList.Options.keyExpr]
         */
        keyExpr?: string | Function;
        /**
         * [descr:dxTreeList.Options.onCellClick]
         */
        onCellClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any) | string;
        /**
         * [descr:dxTreeList.Options.onCellDblClick]
         */
        onCellDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onCellHoverChanged]
         */
        onCellHoverChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onCellPrepared]
         */
        onCellPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: DevExpress.core.dxElement, watch?: Function, oldValue?: any }) => any);
        /**
         * [descr:dxTreeList.Options.onContextMenuPreparing]
         */
        onContextMenuPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onEditingStart]
         */
        onEditingStart?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /**
         * [descr:dxTreeList.Options.onEditorPrepared]
         */
        onEditorPrepared?: ((options: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onEditorPreparing]
         */
        onEditorPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onFocusedCellChanged]
         */
        onFocusedCellChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any);
        /**
         * [descr:dxTreeList.Options.onFocusedCellChanging]
         */
        onFocusedCellChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, cellElement?: DevExpress.core.dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxTreeListRowObject>, columns?: Array<dxTreeListColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
        /**
         * [descr:dxTreeList.Options.onFocusedRowChanged]
         */
        onFocusedRowChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /**
         * [descr:dxTreeList.Options.onFocusedRowChanging]
         */
        onFocusedRowChanging?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, rowElement?: DevExpress.core.dxElement, prevRowIndex?: number, newRowIndex?: number, event?: DevExpress.events.event, rows?: Array<dxTreeListRowObject>, cancel?: boolean }) => any);
        /**
         * [descr:dxTreeList.Options.onNodesInitialized]
         */
        onNodesInitialized?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeListNode }) => any);
        /**
         * [descr:dxTreeList.Options.onRowClick]
         */
        onRowClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, handled?: boolean, node?: dxTreeListNode, level?: number }) => any) | string;
        /**
         * [descr:dxTreeList.Options.onRowDblClick]
         */
        onRowDblClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxTreeList.Options.onRowPrepared]
         */
        onRowPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: DevExpress.core.dxElement, node?: dxTreeListNode, level?: number }) => any);
        /**
         * [descr:dxTreeList.Options.paging]
         */
        paging?: dxTreeListPaging;
        /**
         * [descr:dxTreeList.Options.parentIdExpr]
         */
        parentIdExpr?: string | Function;
        /**
         * [descr:dxTreeList.Options.remoteOperations]
         */
        remoteOperations?: { filtering?: boolean, grouping?: boolean, sorting?: boolean } | 'auto';
        /**
         * [descr:dxTreeList.Options.rootValue]
         */
        rootValue?: any;
        /**
         * [descr:dxTreeList.Options.scrolling]
         */
        scrolling?: dxTreeListScrolling;
        /**
         * [descr:dxTreeList.Options.selection]
         */
        selection?: dxTreeListSelection;
    }
    /**
     * [descr:dxTreeList.Options.editing]
     */
    export interface dxTreeListEditing extends GridBaseEditing {
        /**
         * [descr:dxTreeList.Options.editing.allowAdding]
         */
        allowAdding?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * [descr:dxTreeList.Options.editing.allowDeleting]
         */
        allowDeleting?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * [descr:dxTreeList.Options.editing.allowUpdating]
         */
        allowUpdating?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject }) => boolean);
        /**
         * [descr:dxTreeList.Options.editing.texts]
         */
        texts?: dxTreeListEditingTexts;
    }
    /**
     * [descr:dxTreeList.Options.editing.texts]
     */
    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /**
         * [descr:dxTreeList.Options.editing.texts.addRowToNode]
         */
        addRowToNode?: string;
    }
    /**
     * [descr:dxTreeList.Options.paging]
     */
    export interface dxTreeListPaging extends GridBasePaging {
        /**
         * [descr:dxTreeList.Options.paging.enabled]
         */
        enabled?: boolean;
    }
    /**
     * [descr:dxTreeList.Options.scrolling]
     */
    export interface dxTreeListScrolling extends GridBaseScrolling {
        /**
         * [descr:dxTreeList.Options.scrolling.mode]
         */
        mode?: 'standard' | 'virtual';
    }
    /**
     * [descr:dxTreeList.Options.selection]
     */
    export interface dxTreeListSelection extends GridBaseSelection {
        /**
         * [descr:dxTreeList.Options.selection.recursive]
         */
        recursive?: boolean;
    }
    /**
     * [descr:dxTreeList]
     */
    export class dxTreeList extends GridBase {
        constructor(element: Element, options?: dxTreeListOptions)
        constructor(element: JQuery, options?: dxTreeListOptions)
        /**
         * [descr:dxTreeList.addColumn(columnOptions)]
         */
        addColumn(columnOptions: any | string): void;
        /**
         * [descr:dxTreeList.addRow()]
         */
        addRow(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.addRow(parentId)]
         */
        addRow(parentId: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.collapseRow(key)]
         */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.expandRow(key)]
         */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.forEachNode(callback)]
         */
        forEachNode(callback: Function): void;
        /**
         * [descr:dxTreeList.forEachNode(nodes, callback)]
         */
        forEachNode(nodes: Array<dxTreeListNode>, callback: Function): void;
        /**
         * [descr:dxTreeList.getNodeByKey(key)]
         */
        getNodeByKey(key: any | string | number): dxTreeListNode;
        /**
         * [descr:dxTreeList.getRootNode()]
         */
        getRootNode(): dxTreeListNode;
        /**
         * [descr:dxTreeList.getSelectedRowKeys()]
         */
        getSelectedRowKeys(): Array<any>;
        /**
         * [descr:dxTreeList.getSelectedRowKeys(mode)]
         */
        getSelectedRowKeys(mode: string): Array<any>;
        /**
         * [descr:dxTreeList.getSelectedRowsData()]
         */
        getSelectedRowsData(): Array<any>;
        /**
         * [descr:dxTreeList.getSelectedRowsData(mode)]
         */
        getSelectedRowsData(mode: string): Array<any>;
        /**
         * [descr:dxTreeList.getVisibleColumns()]
         */
        getVisibleColumns(): Array<dxTreeListColumn>;
        /**
         * [descr:dxTreeList.getVisibleColumns(headerLevel)]
         */
        getVisibleColumns(headerLevel: number): Array<dxTreeListColumn>;
        /**
         * [descr:dxTreeList.getVisibleRows()]
         */
        getVisibleRows(): Array<dxTreeListRowObject>;
        /**
         * [descr:dxTreeList.isRowExpanded(key)]
         */
        isRowExpanded(key: any): boolean;
        /**
         * [descr:dxTreeList.loadDescendants()]
         */
        loadDescendants(): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.loadDescendants(keys)]
         */
        loadDescendants(keys: Array<any>): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeList.loadDescendants(keys, childrenOnly)]
         */
        loadDescendants(keys: Array<any>, childrenOnly: boolean): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxTreeListColumn]
     */
    export interface dxTreeListColumn extends GridBaseColumn {
        /**
         * [descr:dxTreeListColumn.buttons]
         */
        buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxTreeListColumnButton>;
        /**
         * [descr:dxTreeListColumn.cellTemplate]
         */
        cellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { data?: any, component?: dxTreeList, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * [descr:dxTreeListColumn.columns]
         */
        columns?: Array<dxTreeListColumn | string>;
        /**
         * [descr:dxTreeListColumn.editCellTemplate]
         */
        editCellTemplate?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { setValue?: any, data?: any, component?: dxTreeList, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, row?: dxTreeListRowObject, rowType?: string, watch?: Function }) => any);
        /**
         * [descr:dxTreeListColumn.headerCellTemplate]
         */
        headerCellTemplate?: DevExpress.core.template | ((columnHeader: DevExpress.core.dxElement, headerInfo: { component?: dxTreeList, columnIndex?: number, column?: dxTreeListColumn }) => any);
        /**
         * [descr:dxTreeListColumn.type]
         */
        type?: 'adaptive' | 'buttons' | 'drag';
    }
    /**
     * [descr:dxTreeListColumnButton]
     */
    export interface dxTreeListColumnButton extends GridBaseColumnButton {
        /**
         * [descr:dxTreeListColumnButton.name]
         */
        name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
        /**
         * [descr:dxTreeListColumnButton.onClick]
         */
        onClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => any) | string;
        /**
         * [descr:dxTreeListColumnButton.template]
         */
        template?: DevExpress.core.template | ((cellElement: DevExpress.core.dxElement, cellInfo: { component?: dxTreeList, data?: any, key?: any, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject }) => string | Element | JQuery);
        /**
         * [descr:dxTreeListColumnButton.visible]
         */
        visible?: boolean | ((options: { component?: dxTreeList, row?: dxTreeListRowObject, column?: dxTreeListColumn }) => boolean);
    }
    /**
     * [descr:dxTreeListNode]
     */
    export interface dxTreeListNode {
        /**
         * [descr:dxTreeListNode.children]
         */
        children?: Array<dxTreeListNode>;
        /**
         * [descr:dxTreeListNode.data]
         */
        data?: any;
        /**
         * [descr:dxTreeListNode.hasChildren]
         */
        hasChildren?: boolean;
        /**
         * [descr:dxTreeListNode.key]
         */
        key?: any;
        /**
         * [descr:dxTreeListNode.level]
         */
        level?: number;
        /**
         * [descr:dxTreeListNode.parent]
         */
        parent?: dxTreeListNode;
        /**
         * [descr:dxTreeListNode.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxTreeListRowObject]
     */
    export interface dxTreeListRowObject {
        /**
         * [descr:dxTreeListRowObject.isEditing]
         */
        isEditing?: boolean;
        /**
         * [descr:dxTreeListRowObject.isExpanded]
         */
        isExpanded?: boolean;
        /**
         * [descr:dxTreeListRowObject.isNewRow]
         */
        isNewRow?: boolean;
        /**
         * [descr:dxTreeListRowObject.isSelected]
         */
        isSelected?: boolean;
        /**
         * [descr:dxTreeListRowObject.key]
         */
        key?: any;
        /**
         * [descr:dxTreeListRowObject.level]
         */
        level?: number;
        /**
         * [descr:dxTreeListRowObject.node]
         */
        node?: dxTreeListNode;
        /**
         * [descr:dxTreeListRowObject.rowIndex]
         */
        rowIndex?: number;
        /**
         * [descr:dxTreeListRowObject.rowType]
         */
        rowType?: string;
        /**
         * [descr:dxTreeListRowObject.values]
         */
        values?: Array<any>;
    }
    /**
     * [descr:dxTreeView.Options]
     */
    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
        /**
         * [descr:dxTreeView.Options.animationEnabled]
         */
        animationEnabled?: boolean;
        /**
         * [descr:dxTreeView.Options.createChildren]
         */
        createChildren?: ((parentNode: dxTreeViewNode) => Promise<any> | JQueryPromise<any> | Array<any>);
        /**
         * [descr:dxTreeView.Options.dataSource]
         */
        dataSource?: string | Array<dxTreeViewItem> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /**
         * [descr:dxTreeView.Options.dataStructure]
         */
        dataStructure?: 'plain' | 'tree';
        /**
         * [descr:dxTreeView.Options.expandAllEnabled]
         */
        expandAllEnabled?: boolean;
        /**
         * [descr:dxTreeView.Options.expandEvent]
         */
        expandEvent?: 'dblclick' | 'click';
        /**
         * [descr:dxTreeView.Options.expandNodesRecursive]
         */
        expandNodesRecursive?: boolean;
        /**
         * [descr:dxTreeView.Options.expandedExpr]
         */
        expandedExpr?: string | Function;
        /**
         * [descr:dxTreeView.Options.hasItemsExpr]
         */
        hasItemsExpr?: string | Function;
        /**
         * [descr:dxTreeView.Options.items]
         */
        items?: Array<dxTreeViewItem>;
        /**
         * [descr:dxTreeView.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemCollapsed]
         */
        onItemCollapsed?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemContextMenu]
         */
        onItemContextMenu?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemExpanded]
         */
        onItemExpanded?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemHold]
         */
        onItemHold?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, event?: DevExpress.events.event, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemRendered]
         */
        onItemRendered?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, node?: dxTreeViewNode }) => any);
        /**
         * [descr:dxTreeView.Options.onItemSelectionChanged]
         */
        onItemSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode, itemElement?: DevExpress.core.dxElement }) => any);
        /**
         * [descr:dxTreeView.Options.onSelectAllValueChanged]
         */
        onSelectAllValueChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /**
         * [descr:dxTreeView.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:dxTreeView.Options.parentIdExpr]
         */
        parentIdExpr?: string | Function;
        /**
         * [descr:dxTreeView.Options.rootValue]
         */
        rootValue?: any;
        /**
         * [descr:dxTreeView.Options.scrollDirection]
         */
        scrollDirection?: 'both' | 'horizontal' | 'vertical';
        /**
         * [descr:dxTreeView.Options.selectAllText]
         */
        selectAllText?: string;
        /**
         * [descr:dxTreeView.Options.selectByClick]
         */
        selectByClick?: boolean;
        /**
         * [descr:dxTreeView.Options.selectNodesRecursive]
         */
        selectNodesRecursive?: boolean;
        /**
         * [descr:dxTreeView.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxTreeView.Options.showCheckBoxesMode]
         */
        showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
        /**
         * [descr:dxTreeView.Options.virtualModeEnabled]
         */
        virtualModeEnabled?: boolean;
    }
    /**
     * [descr:dxTreeView]
     */
    export class dxTreeView extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxTreeViewOptions)
        constructor(element: JQuery, options?: dxTreeViewOptions)
        /**
         * [descr:dxTreeView.collapseAll()]
         */
        collapseAll(): void;
        /**
         * [descr:dxTreeView.collapseItem(itemData)]
         */
        collapseItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.collapseItem(itemElement)]
         */
        collapseItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.collapseItem(key)]
         */
        collapseItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.expandAll()]
         */
        expandAll(): void;
        /**
         * [descr:dxTreeView.expandItem(itemData)]
         */
        expandItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.expandItem(itemElement)]
         */
        expandItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.expandItem(key)]
         */
        expandItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.getNodes()]
         */
        getNodes(): Array<dxTreeViewNode>;
        /**
         * [descr:dxTreeView.getSelectedNodeKeys()]
         */
        getSelectedNodeKeys(): Array<any>;
        /**
         * [descr:dxTreeView.getSelectedNodes()]
         */
        getSelectedNodes(): Array<dxTreeViewNode>;
        /**
         * [descr:dxTreeView.scrollToItem(itemData)]
         */
        scrollToItem(itemData: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.scrollToItem(itemElement)]
         */
        scrollToItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.scrollToItem(key)]
         */
        scrollToItem(key: any): Promise<void> & JQueryPromise<void>;
        /**
         * [descr:dxTreeView.selectAll()]
         */
        selectAll(): void;
        /**
         * [descr:dxTreeView.selectItem(itemData)]
         */
        selectItem(itemData: any): boolean;
        /**
         * [descr:dxTreeView.selectItem(itemElement)]
         */
        selectItem(itemElement: Element): boolean;
        /**
         * [descr:dxTreeView.selectItem(key)]
         */
        selectItem(key: any): boolean;
        /**
         * [descr:dxTreeView.unselectAll()]
         */
        unselectAll(): void;
        /**
         * [descr:dxTreeView.unselectItem(itemData)]
         */
        unselectItem(itemData: any): boolean;
        /**
         * [descr:dxTreeView.unselectItem(itemElement)]
         */
        unselectItem(itemElement: Element): boolean;
        /**
         * [descr:dxTreeView.unselectItem(key)]
         */
        unselectItem(key: any): boolean;
        /**
         * [descr:dxTreeView.updateDimensions()]
         */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /**
     * [descr:dxTreeViewItem]
     */
    export interface dxTreeViewItem extends CollectionWidgetItem {
        /**
         * [descr:dxTreeViewItem.expanded]
         */
        expanded?: boolean;
        /**
         * [descr:dxTreeViewItem.hasItems]
         */
        hasItems?: boolean;
        /**
         * [descr:dxTreeViewItem.icon]
         */
        icon?: string;
        /**
         * [descr:dxTreeViewItem.items]
         */
        items?: Array<dxTreeViewItem>;
        /**
         * [descr:dxTreeViewItem.parentId]
         */
        parentId?: number | string;
        /**
         * [descr:dxTreeViewItem.selected]
         */
        selected?: boolean;
    }
    /**
     * [descr:dxTreeViewNode]
     */
    export interface dxTreeViewNode {
        /**
         * [descr:dxTreeViewNode.children]
         */
        children?: Array<dxTreeViewNode>;
        /**
         * [descr:dxTreeViewNode.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:dxTreeViewNode.expanded]
         */
        expanded?: boolean;
        /**
         * [descr:dxTreeViewNode.itemData]
         */
        itemData?: any;
        /**
         * [descr:dxTreeViewNode.key]
         */
        key?: any;
        /**
         * [descr:dxTreeViewNode.parent]
         */
        parent?: dxTreeViewNode;
        /**
         * [descr:dxTreeViewNode.selected]
         */
        selected?: boolean;
        /**
         * [descr:dxTreeViewNode.text]
         */
        text?: string;
    }
    /**
     * [descr:dxValidationGroup.Options]
     */
    export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
    }
    /**
     * [descr:dxValidationGroup]
     */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: Element, options?: dxValidationGroupOptions)
        constructor(element: JQuery, options?: dxValidationGroupOptions)
        /**
         * [descr:dxValidationGroup.reset()]
         */
        reset(): void;
        /**
         * [descr:dxValidationGroup.validate()]
         */
        validate(): dxValidationGroupResult;
    }
    /**
     * [descr:dxValidationGroupResult]
     */
    export interface dxValidationGroupResult {
        /**
         * [descr:dxValidationGroupResult.brokenRules]
         */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * [descr:dxValidationGroupResult.complete]
         */
        complete?: Promise<dxValidationGroupResult> | JQueryPromise<dxValidationGroupResult>;
        /**
         * [descr:dxValidationGroupResult.isValid]
         */
        isValid?: boolean;
        /**
         * [descr:dxValidationGroupResult.status]
         */
        status?: 'valid' | 'invalid' | 'pending';
        /**
         * [descr:dxValidationGroupResult.validators]
         */
        validators?: Array<any>;
    }
    /**
     * [descr:dxValidationSummary.Options]
     */
    export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
        /**
         * [descr:dxValidationSummary.Options.validationGroup]
         */
        validationGroup?: string;
    }
    /**
     * [descr:dxValidationSummary]
     */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: Element, options?: dxValidationSummaryOptions)
        constructor(element: JQuery, options?: dxValidationSummaryOptions)
    }
    /**
     * [descr:dxValidator.Options]
     */
    export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
        /**
         * [descr:dxValidator.Options.adapter]
         */
        adapter?: { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> };
        /**
         * [descr:dxValidator.Options.name]
         */
        name?: string;
        /**
         * [descr:dxValidator.Options.onValidated]
         */
        onValidated?: ((validatedInfo: { name?: string, isValid?: boolean, value?: any, validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, status?: 'valid' | 'invalid' | 'pending' }) => any);
        /**
         * [descr:dxValidator.Options.validationGroup]
         */
        validationGroup?: string;
        /**
         * [descr:dxValidator.Options.validationRules]
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    }
    /**
     * [descr:dxValidator]
     */
    export class dxValidator extends DOMComponent {
        constructor(element: Element, options?: dxValidatorOptions)
        constructor(element: JQuery, options?: dxValidatorOptions)
        /**
         * [descr:dxValidator.focus()]
         */
        focus(): void;
        /**
         * [descr:dxValidator.reset()]
         */
        reset(): void;
        /**
         * [descr:dxValidator.validate()]
         */
        validate(): dxValidatorResult;
    }
    /**
     * [descr:dxValidatorResult]
     */
    export interface dxValidatorResult {
        /**
         * [descr:dxValidatorResult.brokenRule]
         */
        brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule;
        /**
         * [descr:dxValidatorResult.brokenRules]
         */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * [descr:dxValidatorResult.complete]
         */
        complete?: Promise<dxValidatorResult> | JQueryPromise<dxValidatorResult>;
        /**
         * [descr:dxValidatorResult.isValid]
         */
        isValid?: boolean;
        /**
         * [descr:dxValidatorResult.pendingRules]
         */
        pendingRules?: Array<AsyncRule>;
        /**
         * [descr:dxValidatorResult.status]
         */
        status?: 'valid' | 'invalid' | 'pending';
        /**
         * [descr:dxValidatorResult.validationRules]
         */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
        /**
         * [descr:dxValidatorResult.value]
         */
        value?: any;
    }
    /**
     * [descr:format]
     */
    export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | { currency?: string, formatter?: ((value: number | Date) => string), parser?: ((value: string) => number | Date), precision?: number, type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' };
    /**
     * [descr:ui.template]
     * @deprecated [depNote:ui.template]
     */
    export type template = DevExpress.core.template;
    /**
     * [descr:ui.themes]
     */
    export class themes {
        /**
         * [descr:ui.themes.current()]
         */
        static current(): string;
        /**
         * [descr:ui.themes.current(themeName)]
         */
        static current(themeName: string): void;
        /**
         * [descr:ui.themes.initialized(callback)]
         */
        static initialized(callback: Function): void;
        /**
         * [descr:ui.themes.ready(callback)]
         */
        static ready(callback: Function): void;
    }
}
declare module DevExpress.ui.dialog {
    /**
     * [descr:ui.dialog.alert(messageHtml,title)]
     */
    export function alert(messageHtml: string, title: string): Promise<void> & JQueryPromise<void>;
    /**
     * [descr:ui.dialog.confirm(messageHtml,title)]
     */
    export function confirm(messageHtml: string, title: string): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * [descr:ui.dialog.custom(options)]
     */
    export function custom(options: { title?: string, messageHtml?: string, buttons?: Array<dxButtonOptions>, showTitle?: boolean, message?: string, dragEnabled?: boolean }): any;
}
declare module DevExpress.ui.dxOverlay {
    /**
     * [descr:ui.dxOverlay.baseZIndex(zIndex)]
     */
    export function baseZIndex(zIndex: number): void;
}
declare module DevExpress.utils {
    /**
     * [descr:utils.cancelAnimationFrame(requestID)]
     */
    export function cancelAnimationFrame(requestID: number): void;
    /**
     * [descr:utils.getTimeZones(date)]
     */
    export function getTimeZones(date?: Date): Array<dxSchedulerTimeZone>;
    /**
     * [descr:utils.initMobileViewport(options)]
     */
    export function initMobileViewport(options: { allowZoom?: boolean, allowPan?: boolean, allowSelection?: boolean }): void;
    /**
     * [descr:utils.requestAnimationFrame(callback)]
     */
    export function requestAnimationFrame(callback: Function): number;
}
declare module DevExpress.viz {
    /**
     * [descr:BarGaugeBarInfo]
     */
    export interface BarGaugeBarInfo {
        /**
         * [descr:BarGaugeBarInfo.color]
         */
        color?: string;
        /**
         * [descr:BarGaugeBarInfo.index]
         */
        index?: number;
        /**
         * [descr:BarGaugeBarInfo.value]
         */
        value?: number;
    }
    /**
     * [descr:BarGaugeLegendItem]
     */
    export interface BarGaugeLegendItem extends BaseLegendItem {
        /**
         * [descr:BarGaugeLegendItem.item]
         */
        item?: BarGaugeBarInfo;
    }
    /**
     * [descr:BaseChart.Options]
     */
    export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
        /**
         * [descr:BaseChart.Options.adaptiveLayout]
         */
        adaptiveLayout?: BaseChartAdaptiveLayout;
        /**
         * [descr:BaseChart.Options.animation]
         */
        animation?: { duration?: number, easing?: 'easeOutCubic' | 'linear', enabled?: boolean, maxPointCountSupported?: number } | boolean;
        /**
         * [descr:BaseChart.Options.customizeLabel]
         */
        customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
        /**
         * [descr:BaseChart.Options.customizePoint]
         */
        customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
        /**
         * [descr:BaseChart.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:BaseChart.Options.legend]
         */
        legend?: BaseChartLegend;
        /**
         * [descr:BaseChart.Options.onDone]
         */
        onDone?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:BaseChart.Options.onPointClick]
         */
        onPointClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: basePointObject }) => any) | string;
        /**
         * [descr:BaseChart.Options.onPointHoverChanged]
         */
        onPointHoverChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /**
         * [descr:BaseChart.Options.onPointSelectionChanged]
         */
        onPointSelectionChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /**
         * [descr:BaseChart.Options.onTooltipHidden]
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /**
         * [descr:BaseChart.Options.onTooltipShown]
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject | dxChartAnnotationConfig | any }) => any);
        /**
         * [descr:BaseChart.Options.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:BaseChart.Options.paletteExtensionMode]
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * [descr:BaseChart.Options.pointSelectionMode]
         */
        pointSelectionMode?: 'multiple' | 'single';
        /**
         * [descr:BaseChart.Options.series]
         */
        series?: any | Array<any>;
        /**
         * [descr:BaseChart.Options.tooltip]
         */
        tooltip?: BaseChartTooltip;
    }
    /**
     * [descr:BaseChart.Options.adaptiveLayout]
     */
    interface BaseChartAdaptiveLayout {
        /**
         * [descr:BaseChart.Options.adaptiveLayout.height]
         */
        height?: number;
        /**
         * [descr:BaseChart.Options.adaptiveLayout.keepLabels]
         */
        keepLabels?: boolean;
        /**
         * [descr:BaseChart.Options.adaptiveLayout.width]
         */
        width?: number;
    }
    /**
     * [descr:BaseChart.Options.legend]
     */
    interface BaseChartLegend extends BaseLegend {
        /**
         * [descr:BaseChart.Options.legend.customizeItems]
         */
        customizeItems?: ((items: Array<BaseChartLegendItem>) => Array<BaseChartLegendItem>);
        /**
         * [descr:BaseChart.Options.legend.markerTemplate]
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: BaseChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /**
     * [descr:BaseChart.Options.tooltip]
     */
    interface BaseChartTooltip extends BaseWidgetTooltip {
        /**
         * [descr:BaseChart.Options.tooltip.argumentFormat]
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * [descr:BaseChart.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((pointInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:BaseChart.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((pointInfo: any) => any);
        /**
         * [descr:BaseChart.Options.tooltip.interactive]
         */
        interactive?: boolean;
        /**
         * [descr:BaseChart.Options.tooltip.shared]
         */
        shared?: boolean;
    }
    /**
     * [descr:BaseChart]
     */
    export class BaseChart extends BaseWidget {
        constructor(element: Element, options?: BaseChartOptions)
        constructor(element: JQuery, options?: BaseChartOptions)
        /**
         * [descr:BaseChart.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:BaseChart.getAllSeries()]
         */
        getAllSeries(): Array<baseSeriesObject>;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:BaseChart.getSeriesByName(seriesName)]
         */
        getSeriesByName(seriesName: any): chartSeriesObject;
        /**
         * [descr:BaseChart.getSeriesByPos(seriesIndex)]
         */
        getSeriesByPos(seriesIndex: number): chartSeriesObject;
        /**
         * [descr:BaseChart.hideTooltip()]
         */
        hideTooltip(): void;
        /**
         * [descr:BaseChart.refresh()]
         */
        refresh(): void;
        /**
         * [descr:BaseWidget.render()]
         */
        render(): void;
        /**
         * [descr:BaseChart.render(renderOptions)]
         */
        render(renderOptions: any): void;
    }
    /**
     * [descr:BaseChartAnnotationConfig]
     */
    export interface BaseChartAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * [descr:BaseChartAnnotationConfig.argument]
         */
        argument?: number | Date | string;
        /**
         * [descr:BaseChartAnnotationConfig.series]
         */
        series?: string;
        /**
         * [descr:BaseChartAnnotationConfig.value]
         */
        value?: number | Date | string;
    }
    /**
     * [descr:BaseChartLegendItem]
     */
    export interface BaseChartLegendItem extends BaseLegendItem {
        /**
         * [descr:BaseChartLegendItem.series]
         */
        series?: baseSeriesObject;
    }
    /**
     * [descr:BaseGauge.Options]
     */
    export interface BaseGaugeOptions<T = BaseGauge> extends BaseWidgetOptions<T> {
        /**
         * [descr:BaseGauge.Options.animation]
         */
        animation?: BaseGaugeAnimation;
        /**
         * [descr:BaseGauge.Options.containerBackgroundColor]
         */
        containerBackgroundColor?: string;
        /**
         * [descr:BaseGauge.Options.loadingIndicator]
         */
        loadingIndicator?: BaseGaugeLoadingIndicator;
        /**
         * [descr:BaseGauge.Options.onTooltipHidden]
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * [descr:BaseGauge.Options.onTooltipShown]
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * [descr:BaseGauge.Options.rangeContainer]
         */
        rangeContainer?: BaseGaugeRangeContainer;
        /**
         * [descr:BaseGauge.Options.scale]
         */
        scale?: BaseGaugeScale;
        /**
         * [descr:BaseGauge.Options.subvalues]
         */
        subvalues?: Array<number>;
        /**
         * [descr:BaseGauge.Options.tooltip]
         */
        tooltip?: BaseGaugeTooltip;
        /**
         * [descr:BaseGauge.Options.value]
         */
        value?: number;
    }
    /**
     * [descr:BaseGauge.Options.animation]
     */
    interface BaseGaugeAnimation {
        /**
         * [descr:BaseGauge.Options.animation.duration]
         */
        duration?: number;
        /**
         * [descr:BaseGauge.Options.animation.easing]
         */
        easing?: 'easeOutCubic' | 'linear';
        /**
         * [descr:BaseGauge.Options.animation.enabled]
         */
        enabled?: boolean;
    }
    /**
     * [descr:BaseGauge.Options.loadingIndicator]
     */
    interface BaseGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /**
     * [descr:BaseGauge.Options.rangeContainer]
     */
    interface BaseGaugeRangeContainer {
        /**
         * [descr:BaseGauge.Options.rangeContainer.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:BaseGauge.Options.rangeContainer.offset]
         */
        offset?: number;
        /**
         * [descr:BaseGauge.Options.rangeContainer.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:BaseGauge.Options.rangeContainer.paletteExtensionMode]
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * [descr:BaseGauge.Options.rangeContainer.ranges]
         */
        ranges?: Array<{ color?: string, endValue?: number, startValue?: number }>;
    }
    /**
     * [descr:BaseGauge.Options.scale]
     */
    interface BaseGaugeScale {
        /**
         * [descr:BaseGauge.Options.scale.allowDecimals]
         */
        allowDecimals?: boolean;
        /**
         * [descr:BaseGauge.Options.scale.customMinorTicks]
         */
        customMinorTicks?: Array<number>;
        /**
         * [descr:BaseGauge.Options.scale.customTicks]
         */
        customTicks?: Array<number>;
        /**
         * [descr:BaseGauge.Options.scale.endValue]
         */
        endValue?: number;
        /**
         * [descr:BaseGauge.Options.scale.label]
         */
        label?: BaseGaugeScaleLabel;
        /**
         * [descr:BaseGauge.Options.scale.minorTick]
         */
        minorTick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:BaseGauge.Options.scale.minorTickInterval]
         */
        minorTickInterval?: number;
        /**
         * [descr:BaseGauge.Options.scale.scaleDivisionFactor]
         */
        scaleDivisionFactor?: number;
        /**
         * [descr:BaseGauge.Options.scale.startValue]
         */
        startValue?: number;
        /**
         * [descr:BaseGauge.Options.scale.tick]
         */
        tick?: { color?: string, length?: number, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:BaseGauge.Options.scale.tickInterval]
         */
        tickInterval?: number;
    }
    /**
     * [descr:BaseGauge.Options.scale.label]
     */
    interface BaseGaugeScaleLabel {
        /**
         * [descr:BaseGauge.Options.scale.label.customizeText]
         */
        customizeText?: ((scaleValue: { value?: number, valueText?: string }) => string);
        /**
         * [descr:BaseGauge.Options.scale.label.font]
         */
        font?: Font;
        /**
         * [descr:BaseGauge.Options.scale.label.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:BaseGauge.Options.scale.label.overlappingBehavior]
         */
        overlappingBehavior?: 'hide' | 'none';
        /**
         * [descr:BaseGauge.Options.scale.label.useRangeColors]
         */
        useRangeColors?: boolean;
        /**
         * [descr:BaseGauge.Options.scale.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:BaseGauge.Options.tooltip]
     */
    interface BaseGaugeTooltip extends BaseWidgetTooltip {
        /**
         * [descr:BaseGauge.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:BaseGauge.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
        /**
         * [descr:BaseGauge.Options.tooltip.interactive]
         */
        interactive?: boolean;
    }
    /**
     * [descr:BaseGauge]
     */
    export class BaseGauge extends BaseWidget {
        constructor(element: Element, options?: BaseGaugeOptions)
        constructor(element: JQuery, options?: BaseGaugeOptions)
        /**
         * [descr:BaseGauge.subvalues()]
         */
        subvalues(): Array<number>;
        /**
         * [descr:BaseGauge.subvalues(subvalues)]
         */
        subvalues(subvalues: Array<number>): void;
        /**
         * [descr:BaseGauge.value()]
         */
        value(): number;
        /**
         * [descr:BaseGauge.value(value)]
         */
        value(value: number): void;
    }
    /**
     * [descr:BaseLegend]
     */
    export interface BaseLegend {
        /**
         * [descr:BaseLegend.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:BaseLegend.border]
         */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:BaseLegend.columnCount]
         */
        columnCount?: number;
        /**
         * [descr:BaseLegend.columnItemSpacing]
         */
        columnItemSpacing?: number;
        /**
         * [descr:BaseLegend.font]
         */
        font?: Font;
        /**
         * [descr:BaseLegend.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:BaseLegend.itemTextPosition]
         */
        itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * [descr:BaseLegend.itemsAlignment]
         */
        itemsAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:BaseLegend.margin]
         */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /**
         * [descr:BaseLegend.markerSize]
         */
        markerSize?: number;
        /**
         * [descr:BaseLegend.orientation]
         */
        orientation?: 'horizontal' | 'vertical';
        /**
         * [descr:BaseLegend.paddingLeftRight]
         */
        paddingLeftRight?: number;
        /**
         * [descr:BaseLegend.paddingTopBottom]
         */
        paddingTopBottom?: number;
        /**
         * [descr:BaseLegend.rowCount]
         */
        rowCount?: number;
        /**
         * [descr:BaseLegend.rowItemSpacing]
         */
        rowItemSpacing?: number;
        /**
         * [descr:BaseLegend.title]
         */
        title?: { font?: Font, horizontalAlignment?: 'center' | 'left' | 'right', margin?: { bottom?: number, left?: number, right?: number, top?: number }, placeholderSize?: number, subtitle?: { font?: Font, offset?: number, text?: string } | string, text?: string, verticalAlignment?: 'bottom' | 'top' } | string;
        /**
         * [descr:BaseLegend.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'top';
        /**
         * [descr:BaseLegend.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:BaseLegendItem]
     */
    export interface BaseLegendItem {
        /**
         * [descr:BaseLegendItem.marker]
         */
        marker?: { fill?: string, opacity?: number, size?: number, state?: 'normal' | 'hovered' | 'selected' };
        /**
         * [descr:BaseLegendItem.text]
         */
        text?: string;
        /**
         * [descr:BaseLegendItem.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:BaseSparkline.Options]
     */
    export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
        /**
         * [descr:BaseSparkline.Options.onTooltipHidden]
         */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:BaseSparkline.Options.onTooltipShown]
         */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:BaseSparkline.Options.tooltip]
         */
        tooltip?: BaseSparklineTooltip;
    }
    /**
     * [descr:BaseSparkline.Options.tooltip]
     */
    interface BaseSparklineTooltip extends BaseWidgetTooltip {
        /**
         * [descr:BaseSparkline.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((pointsInfo: any, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:BaseSparkline.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((pointsInfo: any) => any);
        /**
         * [descr:BaseSparkline.Options.tooltip.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:BaseSparkline.Options.tooltip.interactive]
         */
        interactive?: boolean;
    }
    /**
     * [descr:BaseSparkline]
     */
    export class BaseSparkline extends BaseWidget {
        constructor(element: Element, options?: BaseSparklineOptions)
        constructor(element: JQuery, options?: BaseSparklineOptions)
    }
    /**
     * [descr:BaseWidget.Options]
     */
    export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
        /**
         * [descr:BaseWidget.Options.disabled]
         */
        disabled?: boolean;
        /**
         * [descr:BaseWidget.Options.export]
         */
        export?: BaseWidgetExport;
        /**
         * [descr:BaseWidget.Options.loadingIndicator]
         */
        loadingIndicator?: BaseWidgetLoadingIndicator;
        /**
         * [descr:BaseWidget.Options.margin]
         */
        margin?: BaseWidgetMargin;
        /**
         * [descr:BaseWidget.Options.onDrawn]
         */
        onDrawn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:BaseWidget.Options.onExported]
         */
        onExported?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /**
         * [descr:BaseWidget.Options.onExporting]
         */
        onExporting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean, format?: string }) => any);
        /**
         * [descr:BaseWidget.Options.onFileSaving]
         */
        onFileSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /**
         * [descr:BaseWidget.Options.onIncidentOccurred]
         */
        onIncidentOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * [descr:BaseWidget.Options.pathModified]
         */
        pathModified?: boolean;
        /**
         * [descr:BaseWidget.Options.redrawOnResize]
         */
        redrawOnResize?: boolean;
        /**
         * [descr:BaseWidget.Options.rtlEnabled]
         */
        rtlEnabled?: boolean;
        /**
         * [descr:BaseWidget.Options.size]
         */
        size?: BaseWidgetSize;
        /**
         * [descr:BaseWidget.Options.theme]
         */
        theme?: 'generic.dark' | 'generic.light' | 'generic.contrast' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
        /**
         * [descr:BaseWidget.Options.title]
         */
        title?: BaseWidgetTitle | string;
        /**
         * [descr:BaseWidget.Options.tooltip]
         */
        tooltip?: BaseWidgetTooltip;
    }
    /**
     * [descr:BaseWidget.Options.export]
     */
    interface BaseWidgetExport {
        /**
         * [descr:BaseWidget.Options.export.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:BaseWidget.Options.export.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:BaseWidget.Options.export.fileName]
         */
        fileName?: string;
        /**
         * [descr:BaseWidget.Options.export.formats]
         */
        formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
        /**
         * [descr:BaseWidget.Options.export.margin]
         */
        margin?: number;
        /**
         * [descr:BaseWidget.Options.export.printingEnabled]
         */
        printingEnabled?: boolean;
        /**
         * [descr:BaseWidget.Options.export.proxyUrl]
         * @deprecated [depNote:BaseWidget.Options.export.proxyUrl]
         */
        proxyUrl?: string;
        /**
         * [descr:BaseWidget.Options.export.svgToCanvas]
         */
        svgToCanvas?: ((svg: SVGElement, canvas: HTMLCanvasElement) => Promise<void> | JQueryPromise<void>);
    }
    /**
     * [descr:BaseWidget.Options.loadingIndicator]
     */
    interface BaseWidgetLoadingIndicator {
        /**
         * [descr:BaseWidget.Options.loadingIndicator.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:BaseWidget.Options.loadingIndicator.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:BaseWidget.Options.loadingIndicator.font]
         */
        font?: Font;
        /**
         * [descr:BaseWidget.Options.loadingIndicator.show]
         */
        show?: boolean;
        /**
         * [descr:BaseWidget.Options.loadingIndicator.text]
         */
        text?: string;
    }
    /**
     * [descr:BaseWidget.Options.margin]
     */
    interface BaseWidgetMargin {
        /**
         * [descr:BaseWidget.Options.margin.bottom]
         */
        bottom?: number;
        /**
         * [descr:BaseWidget.Options.margin.left]
         */
        left?: number;
        /**
         * [descr:BaseWidget.Options.margin.right]
         */
        right?: number;
        /**
         * [descr:BaseWidget.Options.margin.top]
         */
        top?: number;
    }
    /**
     * [descr:BaseWidget.Options.size]
     */
    interface BaseWidgetSize {
        /**
         * [descr:BaseWidget.Options.size.height]
         */
        height?: number;
        /**
         * [descr:BaseWidget.Options.size.width]
         */
        width?: number;
    }
    /**
     * [descr:BaseWidget.Options.title]
     */
    interface BaseWidgetTitle {
        /**
         * [descr:BaseWidget.Options.title.font]
         */
        font?: Font;
        /**
         * [descr:BaseWidget.Options.title.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:BaseWidget.Options.title.margin]
         */
        margin?: number | { bottom?: number, left?: number, right?: number, top?: number };
        /**
         * [descr:BaseWidget.Options.title.placeholderSize]
         */
        placeholderSize?: number;
        /**
         * [descr:BaseWidget.Options.title.subtitle]
         */
        subtitle?: { font?: Font, offset?: number, text?: string, textOverflow?: 'ellipsis' | 'hide' | 'none', wordWrap?: 'normal' | 'breakWord' | 'none' } | string;
        /**
         * [descr:BaseWidget.Options.title.text]
         */
        text?: string;
        /**
         * [descr:BaseWidget.Options.title.textOverflow]
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * [descr:BaseWidget.Options.title.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'top';
        /**
         * [descr:BaseWidget.Options.title.wordWrap]
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * [descr:BaseWidget.Options.tooltip]
     */
    interface BaseWidgetTooltip {
        /**
         * [descr:BaseWidget.Options.tooltip.arrowLength]
         */
        arrowLength?: number;
        /**
         * [descr:BaseWidget.Options.tooltip.border]
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:BaseWidget.Options.tooltip.color]
         */
        color?: string;
        /**
         * [descr:BaseWidget.Options.tooltip.container]
         */
        container?: string | Element | JQuery;
        /**
         * [descr:BaseWidget.Options.tooltip.cornerRadius]
         */
        cornerRadius?: number;
        /**
         * [descr:BaseWidget.Options.tooltip.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:BaseWidget.Options.tooltip.font]
         */
        font?: Font;
        /**
         * [descr:BaseWidget.Options.tooltip.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:BaseWidget.Options.tooltip.opacity]
         */
        opacity?: number;
        /**
         * [descr:BaseWidget.Options.tooltip.paddingLeftRight]
         */
        paddingLeftRight?: number;
        /**
         * [descr:BaseWidget.Options.tooltip.paddingTopBottom]
         */
        paddingTopBottom?: number;
        /**
         * [descr:BaseWidget.Options.tooltip.shadow]
         */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /**
         * [descr:BaseWidget.Options.tooltip.zIndex]
         */
        zIndex?: number;
    }
    /**
     * [descr:BaseWidget]
     */
    export class BaseWidget extends DOMComponent {
        constructor(element: Element, options?: BaseWidgetOptions)
        constructor(element: JQuery, options?: BaseWidgetOptions)
        /**
         * [descr:BaseWidget.exportTo(fileName, format)]
         */
        exportTo(fileName: string, format: string): void;
        /**
         * [descr:BaseWidget.getSize()]
         */
        getSize(): BaseWidgetSize;
        /**
         * [descr:BaseWidget.hideLoadingIndicator()]
         */
        hideLoadingIndicator(): void;
        /**
         * [descr:BaseWidget.print()]
         */
        print(): void;
        /**
         * [descr:BaseWidget.render()]
         */
        render(): void;
        /**
         * [descr:BaseWidget.showLoadingIndicator()]
         */
        showLoadingIndicator(): void;
        /**
         * [descr:BaseWidget.svg()]
         */
        svg(): string;
    }
    /**
     * [descr:BaseWidgetAnnotationConfig]
     */
    export interface BaseWidgetAnnotationConfig {
        /**
         * [descr:BaseWidgetAnnotationConfig.allowDragging]
         */
        allowDragging?: boolean;
        /**
         * [descr:BaseWidgetAnnotationConfig.arrowLength]
         */
        arrowLength?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.arrowWidth]
         */
        arrowWidth?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.border]
         */
        border?: { color?: string, cornerRadius?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:BaseWidgetAnnotationConfig.color]
         */
        color?: string;
        /**
         * [descr:BaseWidgetAnnotationConfig.data]
         */
        data?: any;
        /**
         * [descr:BaseWidgetAnnotationConfig.description]
         */
        description?: string;
        /**
         * [descr:BaseWidgetAnnotationConfig.font]
         */
        font?: Font;
        /**
         * [descr:BaseWidgetAnnotationConfig.height]
         */
        height?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.image]
         */
        image?: string | { height?: number, url?: string, width?: number };
        /**
         * [descr:BaseWidgetAnnotationConfig.offsetX]
         */
        offsetX?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.offsetY]
         */
        offsetY?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.opacity]
         */
        opacity?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.paddingLeftRight]
         */
        paddingLeftRight?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.paddingTopBottom]
         */
        paddingTopBottom?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.shadow]
         */
        shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number };
        /**
         * [descr:BaseWidgetAnnotationConfig.text]
         */
        text?: string;
        /**
         * [descr:BaseWidgetAnnotationConfig.textOverflow]
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * [descr:BaseWidgetAnnotationConfig.tooltipEnabled]
         */
        tooltipEnabled?: boolean;
        /**
         * [descr:BaseWidgetAnnotationConfig.type]
         */
        type?: 'text' | 'image' | 'custom';
        /**
         * [descr:BaseWidgetAnnotationConfig.width]
         */
        width?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.wordWrap]
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
        /**
         * [descr:BaseWidgetAnnotationConfig.x]
         */
        x?: number;
        /**
         * [descr:BaseWidgetAnnotationConfig.y]
         */
        y?: number;
    }
    /**
     * [descr:ChartSeries]
     */
    export interface ChartSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:ChartSeries.name]
         */
        name?: string;
        /**
         * [descr:ChartSeries.tag]
         */
        tag?: any;
        /**
         * [descr:ChartSeries.type]
         */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /**
     * [descr:CommonIndicator]
     */
    export interface CommonIndicator {
        /**
         * [descr:CommonIndicator.arrowLength]
         */
        arrowLength?: number;
        /**
         * [descr:CommonIndicator.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:CommonIndicator.baseValue]
         */
        baseValue?: number;
        /**
         * [descr:CommonIndicator.beginAdaptingAtRadius]
         */
        beginAdaptingAtRadius?: number;
        /**
         * [descr:CommonIndicator.color]
         */
        color?: string;
        /**
         * [descr:CommonIndicator.horizontalOrientation]
         */
        horizontalOrientation?: 'left' | 'right';
        /**
         * [descr:CommonIndicator.indentFromCenter]
         */
        indentFromCenter?: number;
        /**
         * [descr:CommonIndicator.length]
         */
        length?: number;
        /**
         * [descr:CommonIndicator.offset]
         */
        offset?: number;
        /**
         * [descr:CommonIndicator.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:CommonIndicator.secondColor]
         */
        secondColor?: string;
        /**
         * [descr:CommonIndicator.secondFraction]
         */
        secondFraction?: number;
        /**
         * [descr:CommonIndicator.size]
         */
        size?: number;
        /**
         * [descr:CommonIndicator.spindleGapSize]
         */
        spindleGapSize?: number;
        /**
         * [descr:CommonIndicator.spindleSize]
         */
        spindleSize?: number;
        /**
         * [descr:CommonIndicator.text]
         */
        text?: { customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number };
        /**
         * [descr:CommonIndicator.verticalOrientation]
         */
        verticalOrientation?: 'bottom' | 'top';
        /**
         * [descr:CommonIndicator.width]
         */
        width?: number;
    }
    /**
     * [descr:Font]
     */
    export interface Font {
        /**
         * [descr:Font.color]
         */
        color?: string;
        /**
         * [descr:Font.family]
         */
        family?: string;
        /**
         * [descr:Font.opacity]
         */
        opacity?: number;
        /**
         * [descr:Font.size]
         */
        size?: string | number;
        /**
         * [descr:Font.weight]
         */
        weight?: number;
    }
    /**
     * [descr:FunnelLegendItem]
     */
    export interface FunnelLegendItem extends BaseLegendItem {
        /**
         * [descr:FunnelLegendItem.item]
         */
        item?: dxFunnelItem;
    }
    /**
     * [descr:GaugeIndicator]
     */
    export interface GaugeIndicator extends CommonIndicator {
        /**
         * [descr:GaugeIndicator.type]
         */
        type?: 'circle' | 'rangeBar' | 'rectangle' | 'rectangleNeedle' | 'rhombus' | 'textCloud' | 'triangleMarker' | 'triangleNeedle' | 'twoColorNeedle';
    }
    /**
     * [descr:MapLayer]
     */
    export class MapLayer {
        /**
         * [descr:MapLayer.elementType]
         */
        elementType?: string;
        /**
         * [descr:MapLayer.index]
         */
        index?: number;
        /**
         * [descr:MapLayer.name]
         */
        name?: string;
        /**
         * [descr:MapLayer.type]
         */
        type?: string;
        /**
         * [descr:MapLayer.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:MapLayer.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:MapLayer.getElements()]
         */
        getElements(): Array<MapLayerElement>;
    }
    /**
     * [descr:MapLayerElement]
     */
    export class MapLayerElement {
        /**
         * [descr:MapLayerElement.layer]
         */
        layer?: any;
        /**
         * [descr:MapLayerElement.applySettings(settings)]
         */
        applySettings(settings: any): void;
        /**
         * [descr:MapLayerElement.attribute(name)]
         */
        attribute(name: string): any;
        /**
         * [descr:MapLayerElement.attribute(name, value)]
         */
        attribute(name: string, value: any): void;
        /**
         * [descr:MapLayerElement.coordinates()]
         */
        coordinates(): any;
        /**
         * [descr:MapLayerElement.selected()]
         */
        selected(): boolean;
        /**
         * [descr:MapLayerElement.selected(state)]
         */
        selected(state: boolean): void;
    }
    /**
     * [descr:PieChartLegendItem]
     */
    export interface PieChartLegendItem extends BaseLegendItem {
        /**
         * [descr:PieChartLegendItem.argument]
         */
        argument?: string | Date | number;
        /**
         * [descr:PieChartLegendItem.argumentIndex]
         */
        argumentIndex?: number;
        /**
         * [descr:PieChartLegendItem.points]
         */
        points?: Array<piePointObject>;
        /**
         * [descr:PieChartLegendItem.text]
         */
        text?: any;
    }
    /**
     * [descr:PieChartSeries]
     */
    export interface PieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
        /**
         * [descr:PieChartSeries.name]
         */
        name?: string;
        /**
         * [descr:PieChartSeries.tag]
         */
        tag?: any;
    }
    /**
     * [descr:PolarChartSeries]
     */
    export interface PolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:PolarChartSeries.name]
         */
        name?: string;
        /**
         * [descr:PolarChartSeries.tag]
         */
        tag?: any;
        /**
         * [descr:PolarChartSeries.type]
         */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /**
     * [descr:ScaleBreak]
     */
    export interface ScaleBreak {
        /**
         * [descr:ScaleBreak.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:ScaleBreak.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:VectorMapLegendItem]
     */
    export interface VectorMapLegendItem extends BaseLegendItem {
        /**
         * [descr:VectorMapLegendItem.color]
         */
        color?: string;
        /**
         * [descr:VectorMapLegendItem.end]
         */
        end?: number;
        /**
         * [descr:VectorMapLegendItem.size]
         */
        size?: number;
        /**
         * [descr:VectorMapLegendItem.start]
         */
        start?: number;
    }
    /**
     * [descr:VectorMapProjectionConfig]
     */
    export interface VectorMapProjectionConfig {
        /**
         * [descr:VectorMapProjectionConfig.aspectRatio]
         */
        aspectRatio?: number;
        /**
         * [descr:VectorMapProjectionConfig.from]
         */
        from?: ((coordinates: Array<number>) => Array<number>);
        /**
         * [descr:VectorMapProjectionConfig.to]
         */
        to?: ((coordinates: Array<number>) => Array<number>);
    }
    /**
     * [descr:VizRange]
     */
    export interface VizRange {
        /**
         * [descr:VizRange.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:VizRange.length]
         */
        length?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:VizRange.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:VizTimeInterval]
     */
    export type VizTimeInterval = number | { days?: number, hours?: number, milliseconds?: number, minutes?: number, months?: number, quarters?: number, seconds?: number, weeks?: number, years?: number } | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
    /**
     * [descr:baseLabelObject]
     */
    export class baseLabelObject {
        /**
         * [descr:baseLabelObject.getBoundingRect()]
         */
        getBoundingRect(): any;
        /**
         * [descr:baseLabelObject.hide()]
         */
        hide(): void;
        /**
         * [descr:baseLabelObject.hide(holdInvisible)]
         */
        hide(holdInvisible: boolean): void;
        /**
         * [descr:baseLabelObject.isVisible()]
         */
        isVisible(): boolean;
        /**
         * [descr:baseLabelObject.show()]
         */
        show(): void;
        /**
         * [descr:baseLabelObject.show(holdVisible)]
         */
        show(holdVisible: boolean): void;
    }
    /**
     * [descr:basePointObject]
     */
    export class basePointObject {
        /**
         * [descr:basePointObject.data]
         */
        data?: any;
        /**
         * [descr:basePointObject.fullState]
         */
        fullState?: number;
        /**
         * [descr:basePointObject.originalArgument]
         */
        originalArgument?: string | number | Date;
        /**
         * [descr:basePointObject.originalValue]
         */
        originalValue?: string | number | Date;
        /**
         * [descr:basePointObject.series]
         */
        series?: any;
        /**
         * [descr:basePointObject.tag]
         */
        tag?: any;
        /**
         * [descr:basePointObject.clearHover()]
         */
        clearHover(): void;
        /**
         * [descr:basePointObject.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:basePointObject.getColor()]
         */
        getColor(): string;
        /**
         * [descr:basePointObject.getLabel()]
         */
        getLabel(): baseLabelObject & Array<baseLabelObject>;
        /**
         * [descr:basePointObject.hideTooltip()]
         */
        hideTooltip(): void;
        /**
         * [descr:basePointObject.hover()]
         */
        hover(): void;
        /**
         * [descr:basePointObject.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:basePointObject.isSelected()]
         */
        isSelected(): boolean;
        /**
         * [descr:basePointObject.select()]
         */
        select(): void;
        /**
         * [descr:basePointObject.showTooltip()]
         */
        showTooltip(): void;
    }
    /**
     * [descr:baseSeriesObject]
     */
    export class baseSeriesObject {
        /**
         * [descr:baseSeriesObject.fullState]
         */
        fullState?: number;
        /**
         * [descr:baseSeriesObject.name]
         */
        name?: any;
        /**
         * [descr:baseSeriesObject.tag]
         */
        tag?: any;
        /**
         * [descr:baseSeriesObject.type]
         */
        type?: string;
        /**
         * [descr:baseSeriesObject.clearHover()]
         */
        clearHover(): void;
        /**
         * [descr:baseSeriesObject.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:baseSeriesObject.deselectPoint(point)]
         */
        deselectPoint(point: basePointObject): void;
        /**
         * [descr:baseSeriesObject.getAllPoints()]
         */
        getAllPoints(): Array<basePointObject>;
        /**
         * [descr:baseSeriesObject.getColor()]
         */
        getColor(): string;
        /**
         * [descr:baseSeriesObject.getPointByPos(positionIndex)]
         */
        getPointByPos(positionIndex: number): basePointObject;
        /**
         * [descr:baseSeriesObject.getPointsByArg(pointArg)]
         */
        getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
        /**
         * [descr:baseSeriesObject.getVisiblePoints()]
         */
        getVisiblePoints(): Array<basePointObject>;
        /**
         * [descr:baseSeriesObject.hide()]
         */
        hide(): void;
        /**
         * [descr:baseSeriesObject.hover()]
         */
        hover(): void;
        /**
         * [descr:baseSeriesObject.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:baseSeriesObject.isSelected()]
         */
        isSelected(): boolean;
        /**
         * [descr:baseSeriesObject.isVisible()]
         */
        isVisible(): boolean;
        /**
         * [descr:baseSeriesObject.select()]
         */
        select(): void;
        /**
         * [descr:baseSeriesObject.selectPoint(point)]
         */
        selectPoint(point: basePointObject): void;
        /**
         * [descr:baseSeriesObject.show()]
         */
        show(): void;
    }
    /**
     * [descr:chartAxisObject]
     */
    export class chartAxisObject {
        /**
         * [descr:chartAxisObject.visualRange()]
         */
        visualRange(): VizRange;
        /**
         * [descr:chartAxisObject.visualRange(visualRange)]
         */
        visualRange(visualRange: Array<number | string | Date> | VizRange): void;
    }
    /**
     * [descr:chartPointAggregationInfoObject]
     */
    export interface chartPointAggregationInfoObject {
        /**
         * [descr:chartPointAggregationInfoObject.aggregationInterval]
         */
        aggregationInterval?: any;
        /**
         * [descr:chartPointAggregationInfoObject.data]
         */
        data?: Array<any>;
        /**
         * [descr:chartPointAggregationInfoObject.intervalEnd]
         */
        intervalEnd?: any;
        /**
         * [descr:chartPointAggregationInfoObject.intervalStart]
         */
        intervalStart?: any;
    }
    /**
     * [descr:chartPointObject]
     */
    export class chartPointObject extends basePointObject {
        /**
         * [descr:chartPointObject.aggregationInfo]
         */
        aggregationInfo?: chartPointAggregationInfoObject;
        /**
         * [descr:chartPointObject.originalCloseValue]
         */
        originalCloseValue?: number | string;
        /**
         * [descr:chartPointObject.originalHighValue]
         */
        originalHighValue?: number | string;
        /**
         * [descr:chartPointObject.originalLowValue]
         */
        originalLowValue?: number | string;
        /**
         * [descr:chartPointObject.originalMinValue]
         */
        originalMinValue?: string | number | Date;
        /**
         * [descr:chartPointObject.originalOpenValue]
         */
        originalOpenValue?: number | string;
        /**
         * [descr:chartPointObject.size]
         */
        size?: number | string;
        /**
         * [descr:chartPointObject.getBoundingRect()]
         */
        getBoundingRect(): any;
    }
    /**
     * [descr:chartSeriesObject]
     */
    export class chartSeriesObject extends baseSeriesObject {
        /**
         * [descr:chartSeriesObject.axis]
         */
        axis?: string;
        /**
         * [descr:chartSeriesObject.barOverlapGroup]
         */
        barOverlapGroup?: string;
        /**
         * [descr:chartSeriesObject.pane]
         */
        pane?: string;
        /**
         * [descr:chartSeriesObject.stack]
         */
        stack?: string;
        /**
         * [descr:chartSeriesObject.getArgumentAxis()]
         */
        getArgumentAxis(): chartAxisObject;
        /**
         * [descr:chartSeriesObject.getValueAxis()]
         */
        getValueAxis(): chartAxisObject;
    }
    /**
     * [descr:circularRangeBar]
     */
    export type circularRangeBar = CommonIndicator;
    /**
     * [descr:circularRectangleNeedle]
     */
    export type circularRectangleNeedle = CommonIndicator;
    /**
     * [descr:circularTextCloud]
     */
    export type circularTextCloud = CommonIndicator;
    /**
     * [descr:circularTriangleMarker]
     */
    export type circularTriangleMarker = CommonIndicator;
    /**
     * [descr:circularTriangleNeedle]
     */
    export type circularTriangleNeedle = CommonIndicator;
    /**
     * [descr:circularTwoColorNeedle]
     */
    export type circularTwoColorNeedle = CommonIndicator;
    /**
     * [descr:dxBarGauge.Options]
     */
    export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
        /**
         * [descr:dxBarGauge.Options.animation]
         */
        animation?: any;
        /**
         * [descr:dxBarGauge.Options.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:dxBarGauge.Options.barSpacing]
         */
        barSpacing?: number;
        /**
         * [descr:dxBarGauge.Options.baseValue]
         */
        baseValue?: number;
        /**
         * [descr:dxBarGauge.Options.endValue]
         */
        endValue?: number;
        /**
         * [descr:dxBarGauge.Options.geometry]
         */
        geometry?: { endAngle?: number, startAngle?: number };
        /**
         * [descr:dxBarGauge.Options.label]
         */
        label?: { connectorColor?: string, connectorWidth?: number, customizeText?: ((barValue: { value?: number, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, indent?: number, visible?: boolean };
        /**
         * [descr:dxBarGauge.Options.legend]
         */
        legend?: dxBarGaugeLegend;
        /**
         * [descr:dxBarGauge.Options.loadingIndicator]
         */
        loadingIndicator?: dxBarGaugeLoadingIndicator;
        /**
         * [descr:dxBarGauge.Options.onTooltipHidden]
         */
        onTooltipHidden?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * [descr:dxBarGauge.Options.onTooltipShown]
         */
        onTooltipShown?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /**
         * [descr:dxBarGauge.Options.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:dxBarGauge.Options.paletteExtensionMode]
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * [descr:dxBarGauge.Options.relativeInnerRadius]
         */
        relativeInnerRadius?: number;
        /**
         * [descr:dxBarGauge.Options.resolveLabelOverlapping]
         */
        resolveLabelOverlapping?: 'hide' | 'none';
        /**
         * [descr:dxBarGauge.Options.startValue]
         */
        startValue?: number;
        /**
         * [descr:dxBarGauge.Options.tooltip]
         */
        tooltip?: dxBarGaugeTooltip;
        /**
         * [descr:dxBarGauge.Options.values]
         */
        values?: Array<number>;
    }
    /**
     * [descr:dxBarGauge.Options.legend]
     */
    export interface dxBarGaugeLegend extends BaseLegend {
        /**
         * [descr:dxBarGauge.Options.legend.customizeHint]
         */
        customizeHint?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /**
         * [descr:dxBarGauge.Options.legend.customizeItems]
         */
        customizeItems?: ((items: Array<BarGaugeLegendItem>) => Array<BarGaugeLegendItem>);
        /**
         * [descr:dxBarGauge.Options.legend.customizeText]
         */
        customizeText?: ((arg: { item?: BarGaugeBarInfo, text?: string }) => string);
        /**
         * [descr:dxBarGauge.Options.legend.itemTextFormat]
         */
        itemTextFormat?: DevExpress.ui.format;
        /**
         * [descr:dxBarGauge.Options.legend.markerTemplate]
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: BarGaugeLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxBarGauge.Options.legend.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxBarGauge.Options.loadingIndicator]
     */
    export interface dxBarGaugeLoadingIndicator extends BaseWidgetLoadingIndicator {
    }
    /**
     * [descr:dxBarGauge.Options.tooltip]
     */
    export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
        /**
         * [descr:dxBarGauge.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((scaleValue: { value?: number, valueText?: string, index?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxBarGauge.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
        /**
         * [descr:dxBarGauge.Options.tooltip.interactive]
         */
        interactive?: boolean;
    }
    /**
     * [descr:dxBarGauge]
     */
    export class dxBarGauge extends BaseWidget {
        constructor(element: Element, options?: dxBarGaugeOptions)
        constructor(element: JQuery, options?: dxBarGaugeOptions)
        /**
         * [descr:dxBarGauge.values()]
         */
        values(): Array<number>;
        /**
         * [descr:dxBarGauge.values(newValues)]
         */
        values(values: Array<number>): void;
    }
    /**
     * [descr:dxBullet.Options]
     */
    export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
        /**
         * [descr:dxBullet.Options.color]
         */
        color?: string;
        /**
         * [descr:dxBullet.Options.endScaleValue]
         */
        endScaleValue?: number;
        /**
         * [descr:dxBullet.Options.showTarget]
         */
        showTarget?: boolean;
        /**
         * [descr:dxBullet.Options.showZeroLevel]
         */
        showZeroLevel?: boolean;
        /**
         * [descr:dxBullet.Options.startScaleValue]
         */
        startScaleValue?: number;
        /**
         * [descr:dxBullet.Options.target]
         */
        target?: number;
        /**
         * [descr:dxBullet.Options.targetColor]
         */
        targetColor?: string;
        /**
         * [descr:dxBullet.Options.targetWidth]
         */
        targetWidth?: number;
        /**
         * [descr:dxBullet.Options.value]
         */
        value?: number;
    }
    /**
     * [descr:dxBullet]
     */
    export class dxBullet extends BaseSparkline {
        constructor(element: Element, options?: dxBulletOptions)
        constructor(element: JQuery, options?: dxBulletOptions)
    }
    /**
     * [descr:dxChart.Options]
     */
    export interface dxChartOptions extends BaseChartOptions<dxChart> {
        /**
         * [descr:dxChart.Options.adjustOnZoom]
         */
        adjustOnZoom?: boolean;
        /**
         * [descr:dxChart.Options.annotations]
         */
        annotations?: Array<dxChartAnnotationConfig | any>;
        /**
         * [descr:dxChart.Options.argumentAxis]
         */
        argumentAxis?: dxChartArgumentAxis;
        /**
         * [descr:dxChart.Options.autoHidePointMarkers]
         */
        autoHidePointMarkers?: boolean;
        /**
         * [descr:dxChart.Options.barGroupPadding]
         */
        barGroupPadding?: number;
        /**
         * [descr:dxChart.Options.barGroupWidth]
         */
        barGroupWidth?: number;
        /**
         * [descr:dxChart.Options.commonAnnotationSettings]
         */
        commonAnnotationSettings?: dxChartCommonAnnotationConfig;
        /**
         * [descr:dxChart.Options.commonAxisSettings]
         */
        commonAxisSettings?: dxChartCommonAxisSettings;
        /**
         * [descr:dxChart.Options.commonPaneSettings]
         */
        commonPaneSettings?: dxChartCommonPaneSettings;
        /**
         * [descr:dxChart.Options.commonSeriesSettings]
         */
        commonSeriesSettings?: dxChartCommonSeriesSettings;
        /**
         * [descr:dxChart.Options.containerBackgroundColor]
         */
        containerBackgroundColor?: string;
        /**
         * [descr:dxChart.Options.crosshair]
         */
        crosshair?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', enabled?: boolean, horizontalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, verticalLine?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', label?: { backgroundColor?: string, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font, format?: DevExpress.ui.format, visible?: boolean }, opacity?: number, visible?: boolean, width?: number } | boolean, width?: number };
        /**
         * [descr:dxChart.Options.customizeAnnotation]
         */
        customizeAnnotation?: ((annotation: dxChartAnnotationConfig | any) => dxChartAnnotationConfig);
        /**
         * [descr:dxChart.Options.dataPrepareSettings]
         */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) };
        /**
         * [descr:dxChart.Options.defaultPane]
         */
        defaultPane?: string;
        /**
         * [descr:dxChart.Options.legend]
         */
        legend?: dxChartLegend;
        /**
         * [descr:dxChart.Options.maxBubbleSize]
         */
        maxBubbleSize?: number;
        /**
         * [descr:dxChart.Options.minBubbleSize]
         */
        minBubbleSize?: number;
        /**
         * [descr:dxChart.Options.negativesAsZeroes]
         */
        negativesAsZeroes?: boolean;
        /**
         * [descr:dxChart.Options.onArgumentAxisClick]
         */
        onArgumentAxisClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, argument?: Date | number | string }) => any) | string;
        /**
         * [descr:dxChart.Options.onLegendClick]
         */
        onLegendClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: chartSeriesObject }) => any) | string;
        /**
         * [descr:dxChart.Options.onSeriesClick]
         */
        onSeriesClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: chartSeriesObject }) => any) | string;
        /**
         * [descr:dxChart.Options.onSeriesHoverChanged]
         */
        onSeriesHoverChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /**
         * [descr:dxChart.Options.onSeriesSelectionChanged]
         */
        onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /**
         * [descr:dxChart.Options.onZoomEnd]
         */
        onZoomEnd?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, rangeStart?: Date | number, rangeEnd?: Date | number, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /**
         * [descr:dxChart.Options.onZoomStart]
         */
        onZoomStart?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /**
         * [descr:dxChart.Options.panes]
         */
        panes?: dxChartPanes | Array<dxChartPanes>;
        /**
         * [descr:dxChart.Options.resizePanesOnZoom]
         */
        resizePanesOnZoom?: boolean;
        /**
         * [descr:dxChart.Options.resolveLabelOverlapping]
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
        /**
         * [descr:dxChart.Options.rotated]
         */
        rotated?: boolean;
        /**
         * [descr:dxChart.Options.scrollBar]
         */
        scrollBar?: { color?: string, offset?: number, opacity?: number, position?: 'bottom' | 'left' | 'right' | 'top', visible?: boolean, width?: number };
        /**
         * [descr:dxChart.Options.series]
         */
        series?: ChartSeries | Array<ChartSeries>;
        /**
         * [descr:dxChart.Options.seriesSelectionMode]
         */
        seriesSelectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxChart.Options.seriesTemplate]
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string };
        /**
         * [descr:dxChart.Options.stickyHovering]
         */
        stickyHovering?: boolean;
        /**
         * [descr:dxChart.Options.synchronizeMultiAxes]
         */
        synchronizeMultiAxes?: boolean;
        /**
         * [descr:dxChart.Options.tooltip]
         */
        tooltip?: dxChartTooltip;
        /**
         * [descr:dxChart.Options.valueAxis]
         */
        valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
        /**
         * [descr:dxChart.Options.zoomAndPan]
         */
        zoomAndPan?: { allowMouseWheel?: boolean, allowTouchGestures?: boolean, argumentAxis?: 'both' | 'none' | 'pan' | 'zoom', dragBoxStyle?: { color?: string, opacity?: number }, dragToZoom?: boolean, panKey?: 'alt' | 'ctrl' | 'meta' | 'shift', valueAxis?: 'both' | 'none' | 'pan' | 'zoom' };
    }
    /**
     * [descr:dxChart.Options.argumentAxis]
     */
    export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
        /**
         * [descr:dxChart.Options.argumentAxis.aggregateByCategory]
         */
        aggregateByCategory?: boolean;
        /**
         * [descr:dxChart.Options.argumentAxis.aggregationGroupWidth]
         */
        aggregationGroupWidth?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.aggregationInterval]
         */
        aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.argumentAxis.argumentType]
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * [descr:dxChart.Options.argumentAxis.axisDivisionFactor]
         */
        axisDivisionFactor?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.breaks]
         */
        breaks?: Array<ScaleBreak>;
        /**
         * [descr:dxChart.Options.argumentAxis.categories]
         */
        categories?: Array<number | string | Date>;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLineStyle]
         */
        constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines]
         */
        constantLines?: Array<dxChartArgumentAxisConstantLines>;
        /**
         * [descr:dxChart.Options.argumentAxis.customPosition]
         */
        customPosition?: number | Date | string;
        /**
         * [descr:dxChart.Options.argumentAxis.customPositionAxis]
         */
        customPositionAxis?: string;
        /**
         * [descr:dxChart.Options.argumentAxis.endOnTick]
         */
        endOnTick?: boolean;
        /**
         * [descr:dxChart.Options.argumentAxis.holidays]
         */
        holidays?: Array<Date | string> | Array<number>;
        /**
         * [descr:dxChart.Options.argumentAxis.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChart.Options.argumentAxis.label]
         */
        label?: dxChartArgumentAxisLabel;
        /**
         * [descr:dxChart.Options.argumentAxis.linearThreshold]
         */
        linearThreshold?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.logarithmBase]
         */
        logarithmBase?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.minVisualRangeLength]
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.argumentAxis.minorTickCount]
         */
        minorTickCount?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.minorTickInterval]
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.argumentAxis.offset]
         */
        offset?: number;
        /**
         * [descr:dxChart.Options.argumentAxis.position]
         */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * [descr:dxChart.Options.argumentAxis.singleWorkdays]
         */
        singleWorkdays?: Array<Date | string> | Array<number>;
        /**
         * [descr:dxChart.Options.argumentAxis.strips]
         */
        strips?: Array<dxChartArgumentAxisStrips>;
        /**
         * [descr:dxChart.Options.argumentAxis.tickInterval]
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.argumentAxis.title]
         */
        title?: dxChartArgumentAxisTitle;
        /**
         * [descr:dxChart.Options.argumentAxis.type]
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * [descr:dxChart.Options.argumentAxis.visualRange]
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * [descr:dxChart.Options.argumentAxis.visualRangeUpdateMode]
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * [descr:dxChart.Options.argumentAxis.wholeRange]
         */
        wholeRange?: VizRange | Array<number | string | Date>;
        /**
         * [descr:dxChart.Options.argumentAxis.workWeek]
         */
        workWeek?: Array<number>;
        /**
         * [descr:dxChart.Options.argumentAxis.workdaysOnly]
         */
        workdaysOnly?: boolean;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.constantLineStyle]
     */
    export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxChart.Options.argumentAxis.constantLineStyle.label]
         */
        label?: dxChartArgumentAxisConstantLineStyleLabel;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.constantLineStyle.label]
     */
    export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxChart.Options.argumentAxis.constantLineStyle.label.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.argumentAxis.constantLineStyle.label.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxChart.Options.argumentAxis.constantLines]
     */
    export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.displayBehindSeries]
         */
        displayBehindSeries?: boolean;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.extendAxis]
         */
        extendAxis?: boolean;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.label]
         */
        label?: dxChartArgumentAxisConstantLinesLabel;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.value]
         */
        value?: number | Date | string;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.constantLines.label]
     */
    export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.label.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.label.text]
         */
        text?: string;
        /**
         * [descr:dxChart.Options.argumentAxis.constantLines.label.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxChart.Options.argumentAxis.label]
     */
    export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
        /**
         * [descr:dxChart.Options.argumentAxis.label.customizeHint]
         */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxChart.Options.argumentAxis.label.customizeText]
         */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxChart.Options.argumentAxis.label.format]
         */
        format?: DevExpress.ui.format;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.strips]
     */
    export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxChart.Options.argumentAxis.strips.color]
         */
        color?: string;
        /**
         * [descr:dxChart.Options.argumentAxis.strips.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:dxChart.Options.argumentAxis.strips.label]
         */
        label?: dxChartArgumentAxisStripsLabel;
        /**
         * [descr:dxChart.Options.argumentAxis.strips.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.strips.label]
     */
    export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxChart.Options.argumentAxis.strips.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxChart.Options.argumentAxis.title]
     */
    export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
        /**
         * [descr:dxChart.Options.argumentAxis.title.text]
         */
        text?: string;
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings]
     */
    export interface dxChartCommonAxisSettings {
        /**
         * [descr:dxChart.Options.commonAxisSettings.allowDecimals]
         */
        allowDecimals?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.breakStyle]
         */
        breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number };
        /**
         * [descr:dxChart.Options.commonAxisSettings.color]
         */
        color?: string;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle]
         */
        constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
        /**
         * [descr:dxChart.Options.commonAxisSettings.discreteAxisDivisionMode]
         */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /**
         * [descr:dxChart.Options.commonAxisSettings.endOnTick]
         */
        endOnTick?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.grid]
         */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxChart.Options.commonAxisSettings.inverted]
         */
        inverted?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label]
         */
        label?: dxChartCommonAxisSettingsLabel;
        /**
         * [descr:dxChart.Options.commonAxisSettings.maxValueMargin]
         */
        maxValueMargin?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.minValueMargin]
         */
        minValueMargin?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.minorGrid]
         */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxChart.Options.commonAxisSettings.minorTick]
         */
        minorTick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxChart.Options.commonAxisSettings.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.placeholderSize]
         */
        placeholderSize?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle]
         */
        stripStyle?: dxChartCommonAxisSettingsStripStyle;
        /**
         * [descr:dxChart.Options.commonAxisSettings.tick]
         */
        tick?: { color?: string, length?: number, opacity?: number, shift?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxChart.Options.commonAxisSettings.title]
         */
        title?: dxChartCommonAxisSettingsTitle;
        /**
         * [descr:dxChart.Options.commonAxisSettings.valueMarginsEnabled]
         */
        valueMarginsEnabled?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.constantLineStyle]
     */
    export interface dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.color]
         */
        color?: string;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.label]
         */
        label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.paddingLeftRight]
         */
        paddingLeftRight?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.paddingTopBottom]
         */
        paddingTopBottom?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.label]
     */
    export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.label.font]
         */
        font?: Font;
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.label.position]
         */
        position?: 'inside' | 'outside';
        /**
         * [descr:dxChart.Options.commonAxisSettings.constantLineStyle.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.label]
     */
    export interface dxChartCommonAxisSettingsLabel {
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.alignment]
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.displayMode]
         */
        displayMode?: 'rotate' | 'stagger' | 'standard';
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.font]
         */
        font?: Font;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.indentFromAxis]
         */
        indentFromAxis?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.overlappingBehavior]
         */
        overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.position]
         */
        position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.rotationAngle]
         */
        rotationAngle?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.staggeringSpacing]
         */
        staggeringSpacing?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.template]
         */
        template?: DevExpress.core.template | ((data: { value?: Date | number | string, valueText?: string }, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.textOverflow]
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChart.Options.commonAxisSettings.label.wordWrap]
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.stripStyle]
     */
    export interface dxChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.label]
         */
        label?: dxChartCommonAxisSettingsStripStyleLabel;
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.paddingLeftRight]
         */
        paddingLeftRight?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.paddingTopBottom]
         */
        paddingTopBottom?: number;
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.stripStyle.label]
     */
    export interface dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.label.font]
         */
        font?: Font;
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.label.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.commonAxisSettings.stripStyle.label.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxChart.Options.commonAxisSettings.title]
     */
    export interface dxChartCommonAxisSettingsTitle {
        /**
         * [descr:dxChart.Options.commonAxisSettings.title.alignment]
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.commonAxisSettings.title.font]
         */
        font?: Font;
        /**
         * [descr:dxChart.Options.commonAxisSettings.title.margin]
         */
        margin?: number;
        /**
         * [descr:dxChart.Options.commonAxisSettings.title.textOverflow]
         */
        textOverflow?: 'ellipsis' | 'hide' | 'none';
        /**
         * [descr:dxChart.Options.commonAxisSettings.title.wordWrap]
         */
        wordWrap?: 'normal' | 'breakWord' | 'none';
    }
    /**
     * [descr:dxChart.Options.commonPaneSettings]
     */
    export interface dxChartCommonPaneSettings {
        /**
         * [descr:dxChart.Options.commonPaneSettings.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:dxChart.Options.commonPaneSettings.border]
         */
        border?: { bottom?: boolean, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', left?: boolean, opacity?: number, right?: boolean, top?: boolean, visible?: boolean, width?: number };
    }
    /**
     * [descr:dxChart.Options.commonSeriesSettings]
     */
    export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChart.Options.commonSeriesSettings.area]
         */
        area?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.bar]
         */
        bar?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.bubble]
         */
        bubble?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.candlestick]
         */
        candlestick?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.fullstackedarea]
         */
        fullstackedarea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.fullstackedbar]
         */
        fullstackedbar?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.fullstackedline]
         */
        fullstackedline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.fullstackedspline]
         */
        fullstackedspline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.fullstackedsplinearea]
         */
        fullstackedsplinearea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.line]
         */
        line?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.rangearea]
         */
        rangearea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.rangebar]
         */
        rangebar?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.scatter]
         */
        scatter?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.spline]
         */
        spline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.splinearea]
         */
        splinearea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stackedarea]
         */
        stackedarea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stackedbar]
         */
        stackedbar?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stackedline]
         */
        stackedline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stackedspline]
         */
        stackedspline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stackedsplinearea]
         */
        stackedsplinearea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.steparea]
         */
        steparea?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stepline]
         */
        stepline?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.stock]
         */
        stock?: any;
        /**
         * [descr:dxChart.Options.commonSeriesSettings.type]
         */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /**
     * [descr:dxChart.Options.legend]
     */
    export interface dxChartLegend extends BaseChartLegend {
        /**
         * [descr:dxChart.Options.legend.customizeHint]
         */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * [descr:dxChart.Options.legend.customizeText]
         */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * [descr:dxChart.Options.legend.hoverMode]
         */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
        /**
         * [descr:dxChart.Options.legend.position]
         */
        position?: 'inside' | 'outside';
    }
    /**
     * [descr:dxChart.Options.panes]
     */
    export interface dxChartPanes extends dxChartCommonPaneSettings {
        /**
         * [descr:dxChart.Options.panes.height]
         */
        height?: number | string;
        /**
         * [descr:dxChart.Options.panes.name]
         */
        name?: string;
    }
    /**
     * [descr:dxChart.Options.tooltip]
     */
    export interface dxChartTooltip extends BaseChartTooltip {
        /**
         * [descr:dxChart.Options.tooltip.location]
         */
        location?: 'center' | 'edge';
    }
    /**
     * [descr:dxChart.Options.valueAxis]
     */
    export interface dxChartValueAxis extends dxChartCommonAxisSettings {
        /**
         * [descr:dxChart.Options.valueAxis.autoBreaksEnabled]
         */
        autoBreaksEnabled?: boolean;
        /**
         * [descr:dxChart.Options.valueAxis.axisDivisionFactor]
         */
        axisDivisionFactor?: number;
        /**
         * [descr:dxChart.Options.valueAxis.breaks]
         */
        breaks?: Array<ScaleBreak>;
        /**
         * [descr:dxChart.Options.valueAxis.categories]
         */
        categories?: Array<number | string | Date>;
        /**
         * [descr:dxChart.Options.valueAxis.constantLineStyle]
         */
        constantLineStyle?: dxChartValueAxisConstantLineStyle;
        /**
         * [descr:dxChart.Options.valueAxis.constantLines]
         */
        constantLines?: Array<dxChartValueAxisConstantLines>;
        /**
         * [descr:dxChart.Options.valueAxis.customPosition]
         */
        customPosition?: number | Date | string;
        /**
         * [descr:dxChart.Options.valueAxis.endOnTick]
         */
        endOnTick?: boolean;
        /**
         * [descr:dxChart.Options.valueAxis.label]
         */
        label?: dxChartValueAxisLabel;
        /**
         * [descr:dxChart.Options.valueAxis.linearThreshold]
         */
        linearThreshold?: number;
        /**
         * [descr:dxChart.Options.valueAxis.logarithmBase]
         */
        logarithmBase?: number;
        /**
         * [descr:dxChart.Options.valueAxis.maxAutoBreakCount]
         */
        maxAutoBreakCount?: number;
        /**
         * [descr:dxChart.Options.valueAxis.minVisualRangeLength]
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.valueAxis.minorTickCount]
         */
        minorTickCount?: number;
        /**
         * [descr:dxChart.Options.valueAxis.minorTickInterval]
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.valueAxis.multipleAxesSpacing]
         */
        multipleAxesSpacing?: number;
        /**
         * [descr:dxChart.Options.valueAxis.name]
         */
        name?: string;
        /**
         * [descr:dxChart.Options.valueAxis.offset]
         */
        offset?: number;
        /**
         * [descr:dxChart.Options.valueAxis.pane]
         */
        pane?: string;
        /**
         * [descr:dxChart.Options.valueAxis.position]
         */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /**
         * [descr:dxChart.Options.valueAxis.showZero]
         */
        showZero?: boolean;
        /**
         * [descr:dxChart.Options.valueAxis.strips]
         */
        strips?: Array<dxChartValueAxisStrips>;
        /**
         * [descr:dxChart.Options.valueAxis.synchronizedValue]
         */
        synchronizedValue?: number;
        /**
         * [descr:dxChart.Options.valueAxis.tickInterval]
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxChart.Options.valueAxis.title]
         */
        title?: dxChartValueAxisTitle;
        /**
         * [descr:dxChart.Options.valueAxis.type]
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * [descr:dxChart.Options.valueAxis.valueType]
         */
        valueType?: 'datetime' | 'numeric' | 'string';
        /**
         * [descr:dxChart.Options.valueAxis.visualRange]
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * [descr:dxChart.Options.valueAxis.visualRangeUpdateMode]
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * [descr:dxChart.Options.valueAxis.wholeRange]
         */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /**
     * [descr:dxChart.Options.valueAxis.constantLineStyle]
     */
    export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxChart.Options.valueAxis.constantLineStyle.label]
         */
        label?: dxChartValueAxisConstantLineStyleLabel;
    }
    /**
     * [descr:dxChart.Options.valueAxis.constantLineStyle.label]
     */
    export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxChart.Options.valueAxis.constantLineStyle.label.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.valueAxis.constantLineStyle.label.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxChart.Options.valueAxis.constantLines]
     */
    export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.displayBehindSeries]
         */
        displayBehindSeries?: boolean;
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.extendAxis]
         */
        extendAxis?: boolean;
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.label]
         */
        label?: dxChartValueAxisConstantLinesLabel;
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.value]
         */
        value?: number | Date | string;
    }
    /**
     * [descr:dxChart.Options.valueAxis.constantLines.label]
     */
    export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.label.horizontalAlignment]
         */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.label.text]
         */
        text?: string;
        /**
         * [descr:dxChart.Options.valueAxis.constantLines.label.verticalAlignment]
         */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxChart.Options.valueAxis.label]
     */
    export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
        /**
         * [descr:dxChart.Options.valueAxis.label.customizeHint]
         */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxChart.Options.valueAxis.label.customizeText]
         */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxChart.Options.valueAxis.label.format]
         */
        format?: DevExpress.ui.format;
    }
    /**
     * [descr:dxChart.Options.valueAxis.strips]
     */
    export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxChart.Options.valueAxis.strips.color]
         */
        color?: string;
        /**
         * [descr:dxChart.Options.valueAxis.strips.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:dxChart.Options.valueAxis.strips.label]
         */
        label?: dxChartValueAxisStripsLabel;
        /**
         * [descr:dxChart.Options.valueAxis.strips.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:dxChart.Options.valueAxis.strips.label]
     */
    export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxChart.Options.valueAxis.strips.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxChart.Options.valueAxis.title]
     */
    export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
        /**
         * [descr:dxChart.Options.valueAxis.title.text]
         */
        text?: string;
    }
    /**
     * [descr:dxChart]
     */
    export class dxChart extends BaseChart {
        constructor(element: Element, options?: dxChartOptions)
        constructor(element: JQuery, options?: dxChartOptions)
        /**
         * [descr:dxChart.getArgumentAxis()]
         */
        getArgumentAxis(): chartAxisObject;
        /**
         * [descr:dxChart.getValueAxis()]
         */
        getValueAxis(): chartAxisObject;
        /**
         * [descr:dxChart.getValueAxis(name)]
         */
        getValueAxis(name: string): chartAxisObject;
        /**
         * [descr:dxChart.resetVisualRange()]
         */
        resetVisualRange(): void;
        /**
         * [descr:dxChart.zoomArgument(startValue,endValue)]
         */
        zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
    }
    /**
     * [descr:dxChartAnnotationConfig]
     */
    export interface dxChartAnnotationConfig extends dxChartCommonAnnotationConfig {
        /**
         * [descr:dxChartAnnotationConfig.name]
         */
        name?: string;
    }
    /**
     * [descr:dxChartCommonAnnotationConfig]
     */
    export interface dxChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
        /**
         * [descr:dxChartCommonAnnotationConfig.axis]
         */
        axis?: string;
        /**
         * [descr:dxChartCommonAnnotationConfig.customizeTooltip]
         */
        customizeTooltip?: ((annotation: dxChartAnnotationConfig | any) => any);
        /**
         * [descr:dxChartCommonAnnotationConfig.template]
         */
        template?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxChartCommonAnnotationConfig.tooltipTemplate]
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:dxChartSeriesTypes]
     */
    interface dxChartSeriesTypes {
        /**
         * [descr:dxChartSeriesTypes.AreaSeries]
         */
        AreaSeries?: dxChartSeriesTypesAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.BarSeries]
         */
        BarSeries?: dxChartSeriesTypesBarSeries;
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries]
         */
        BubbleSeries?: dxChartSeriesTypesBubbleSeries;
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries]
         */
        CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries]
         */
        CommonSeries?: dxChartSeriesTypesCommonSeries;
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries]
         */
        FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries]
         */
        FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries]
         */
        FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries]
         */
        FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries]
         */
        FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
        /**
         * [descr:dxChartSeriesTypes.LineSeries]
         */
        LineSeries?: dxChartSeriesTypesLineSeries;
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries]
         */
        RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries]
         */
        RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
        /**
         * [descr:dxChartSeriesTypes.ScatterSeries]
         */
        ScatterSeries?: dxChartSeriesTypesScatterSeries;
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries]
         */
        SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.SplineSeries]
         */
        SplineSeries?: dxChartSeriesTypesSplineSeries;
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries]
         */
        StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries]
         */
        StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries]
         */
        StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries]
         */
        StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries]
         */
        StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries]
         */
        StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries]
         */
        StepLineSeries?: dxChartSeriesTypesStepLineSeries;
        /**
         * [descr:dxChartSeriesTypes.StockSeries]
         */
        StockSeries?: dxChartSeriesTypesStockSeries;
    }
    /**
     * [descr:dxChartSeriesTypes.AreaSeries]
     */
    interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.label]
         */
        label?: dxChartSeriesTypesAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.point]
         */
        point?: dxChartSeriesTypesAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.aggregation]
     */
    interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.label]
     */
    interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.point]
     */
    interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.AreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.BarSeries]
     */
    interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.BarSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesBarSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.BarSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.BarSeries.label]
         */
        label?: dxChartSeriesTypesBarSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.BarSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.BarSeries.aggregation]
     */
    interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.BarSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.BarSeries.label]
     */
    interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.BarSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.BubbleSeries]
     */
    interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.label]
         */
        label?: dxChartSeriesTypesBubbleSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.BubbleSeries.aggregation]
     */
    interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.aggregation.method]
         */
        method?: 'avg' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.BubbleSeries.label]
     */
    interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.BubbleSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries]
     */
    interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle]
         */
        hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.label]
         */
        label?: dxChartSeriesTypesCandleStickSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle]
         */
        selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.aggregation]
     */
    interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.aggregation.method]
         */
        method?: 'ohlc' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle]
     */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching]
         */
        hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching]
     */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction]
         */
        direction?: 'left' | 'none' | 'right';
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.label]
     */
    interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle]
     */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching]
         */
        hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
    }
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching]
     */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /**
         * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction]
         */
        direction?: 'left' | 'none' | 'right';
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries]
     */
    interface dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.axis]
         */
        axis?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.barOverlapGroup]
         */
        barOverlapGroup?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.barPadding]
         */
        barPadding?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.barWidth]
         */
        barWidth?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.border]
         */
        border?: dxChartSeriesTypesCommonSeriesBorder;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.closeValueField]
         */
        closeValueField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.cornerRadius]
         */
        cornerRadius?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.highValueField]
         */
        highValueField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle]
         */
        hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.ignoreEmptyPoints]
         */
        ignoreEmptyPoints?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.innerColor]
         */
        innerColor?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label]
         */
        label?: dxChartSeriesTypesCommonSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.lowValueField]
         */
        lowValueField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.maxLabelCount]
         */
        maxLabelCount?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.minBarSize]
         */
        minBarSize?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.openValueField]
         */
        openValueField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.pane]
         */
        pane?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point]
         */
        point?: dxChartSeriesTypesCommonSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.rangeValue1Field]
         */
        rangeValue1Field?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.rangeValue2Field]
         */
        rangeValue2Field?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.reduction]
         */
        reduction?: { color?: string, level?: 'close' | 'high' | 'low' | 'open' };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionMode]
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle]
         */
        selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.showInLegend]
         */
        showInLegend?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.sizeField]
         */
        sizeField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.stack]
         */
        stack?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.tagField]
         */
        tagField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar]
         */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.valueField]
         */
        valueField?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.aggregation]
     */
    interface dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.aggregation.calculate]
         */
        calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.aggregation.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.border]
     */
    interface dxChartSeriesTypesCommonSeriesBorder {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.border.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.border.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.border.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle]
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border]
         */
        border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching]
         */
        hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border]
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching]
     */
    interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction]
         */
        direction?: 'left' | 'none' | 'right';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.label]
     */
    interface dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.alignment]
         */
        alignment?: 'center' | 'left' | 'right';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.argumentFormat]
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.border]
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.connector]
         */
        connector?: { color?: string, visible?: boolean, width?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.font]
         */
        font?: Font;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.horizontalOffset]
         */
        horizontalOffset?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.position]
         */
        position?: 'inside' | 'outside';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.rotationAngle]
         */
        rotationAngle?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.showForZeroValues]
         */
        showForZeroValues?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.verticalOffset]
         */
        verticalOffset?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point]
     */
    interface dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.border]
         */
        border?: { color?: string, visible?: boolean, width?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle]
         */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.image]
         */
        image?: string | { height?: number | { rangeMaxPoint?: number, rangeMinPoint?: number }, url?: string | { rangeMaxPoint?: string, rangeMinPoint?: string }, width?: number | { rangeMaxPoint?: number, rangeMinPoint?: number } };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.selectionMode]
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle]
         */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.size]
         */
        size?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.symbol]
         */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle]
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border]
         */
        border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching]
         */
        hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border]
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching]
     */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction]
         */
        direction?: 'left' | 'none' | 'right';
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.width]
         */
        width?: number;
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries]
     */
    interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.label]
         */
        label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.point]
         */
        point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.label]
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.point]
     */
    interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.FullStackedAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries]
     */
    interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.label]
         */
        label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries.aggregation]
     */
    interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries.label]
     */
    interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * [descr:dxChartSeriesTypes.FullStackedBarSeries.label.position]
         */
        position?: 'inside' | 'outside';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedLineSeries]
     */
    interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.label]
         */
        label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedLineSeries.aggregation]
     */
    interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedLineSeries.label]
     */
    interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.FullStackedLineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries]
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.label]
         */
        label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.point]
         */
        point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.label]
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.point]
     */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineSeries]
     */
    interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.label]
         */
        label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineSeries.aggregation]
     */
    interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineSeries.label]
     */
    interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.LineSeries]
     */
    interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.LineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesLineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.LineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.LineSeries.label]
         */
        label?: dxChartSeriesTypesLineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.LineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.LineSeries.aggregation]
     */
    interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.LineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.LineSeries.label]
     */
    interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.LineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries]
     */
    interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.label]
         */
        label?: dxChartSeriesTypesRangeAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.point]
         */
        point?: dxChartSeriesTypesRangeAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.aggregation.method]
         */
        method?: 'range' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.label]
     */
    interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.point]
     */
    interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.RangeAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.RangeBarSeries]
     */
    interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.label]
         */
        label?: dxChartSeriesTypesRangeBarSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.RangeBarSeries.aggregation]
     */
    interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.aggregation.method]
         */
        method?: 'range' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.RangeBarSeries.label]
     */
    interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.RangeBarSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.ScatterSeries]
     */
    interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.ScatterSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.ScatterSeries.label]
         */
        label?: dxChartSeriesTypesScatterSeriesLabel;
    }
    /**
     * [descr:dxChartSeriesTypes.ScatterSeries.aggregation]
     */
    interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.ScatterSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.ScatterSeries.label]
     */
    interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.ScatterSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries]
     */
    interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.label]
         */
        label?: dxChartSeriesTypesSplineAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.point]
         */
        point?: dxChartSeriesTypesSplineAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.label]
     */
    interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.point]
     */
    interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.SplineAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.SplineSeries]
     */
    interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.label]
         */
        label?: dxChartSeriesTypesSplineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.SplineSeries.aggregation]
     */
    interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.SplineSeries.label]
     */
    interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.SplineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries]
     */
    interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.label]
         */
        label?: dxChartSeriesTypesStackedAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.point]
         */
        point?: dxChartSeriesTypesStackedAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.label]
     */
    interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.point]
     */
    interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.StackedAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries]
     */
    interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.label]
         */
        label?: dxChartSeriesTypesStackedBarSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries.aggregation]
     */
    interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries.label]
     */
    interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * [descr:dxChartSeriesTypes.StackedBarSeries.label.position]
         */
        position?: 'inside' | 'outside';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedLineSeries]
     */
    interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.label]
         */
        label?: dxChartSeriesTypesStackedLineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedLineSeries.aggregation]
     */
    interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedLineSeries.label]
     */
    interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StackedLineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries]
     */
    interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.label]
         */
        label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.point]
         */
        point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.label]
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.point]
     */
    interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineSeries]
     */
    interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.label]
         */
        label?: dxChartSeriesTypesStackedSplineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineSeries.aggregation]
     */
    interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StackedSplineSeries.label]
     */
    interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StackedSplineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries]
     */
    interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.border]
         */
        border?: dxChartSeriesTypesStepAreaSeriesBorder;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle]
         */
        hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.label]
         */
        label?: dxChartSeriesTypesStepAreaSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.point]
         */
        point?: dxChartSeriesTypesStepAreaSeriesPoint;
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle]
         */
        selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.aggregation]
     */
    interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.border]
     */
    interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.border.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle]
     */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle.border]
         */
        border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle.border]
     */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.label]
     */
    interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.point]
     */
    interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle]
     */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle.border]
         */
        border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
    }
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle.border]
     */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /**
         * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxChartSeriesTypes.StepLineSeries]
     */
    interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.label]
         */
        label?: dxChartSeriesTypesStepLineSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StepLineSeries.aggregation]
     */
    interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.aggregation.method]
         */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StepLineSeries.label]
     */
    interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StepLineSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxChartSeriesTypes.StockSeries]
     */
    interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
        /**
         * [descr:dxChartSeriesTypes.StockSeries.aggregation]
         */
        aggregation?: dxChartSeriesTypesStockSeriesAggregation;
        /**
         * [descr:dxChartSeriesTypes.StockSeries.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxChartSeriesTypes.StockSeries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxChartSeriesTypes.StockSeries.label]
         */
        label?: dxChartSeriesTypesStockSeriesLabel;
        /**
         * [descr:dxChartSeriesTypes.StockSeries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxChartSeriesTypes.StockSeries.aggregation]
     */
    interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /**
         * [descr:dxChartSeriesTypes.StockSeries.aggregation.method]
         */
        method?: 'ohlc' | 'custom';
    }
    /**
     * [descr:dxChartSeriesTypes.StockSeries.label]
     */
    interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /**
         * [descr:dxChartSeriesTypes.StockSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
    }
    /**
     * [descr:dxCircularGauge.Options]
     */
    export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
        /**
         * [descr:dxCircularGauge.Options.geometry]
         */
        geometry?: { endAngle?: number, startAngle?: number };
        /**
         * [descr:dxCircularGauge.Options.rangeContainer]
         */
        rangeContainer?: dxCircularGaugeRangeContainer;
        /**
         * [descr:dxCircularGauge.Options.scale]
         */
        scale?: dxCircularGaugeScale;
        /**
         * [descr:dxCircularGauge.Options.subvalueIndicator]
         */
        subvalueIndicator?: GaugeIndicator;
        /**
         * [descr:dxCircularGauge.Options.valueIndicator]
         */
        valueIndicator?: GaugeIndicator;
    }
    /**
     * [descr:dxCircularGauge.Options.rangeContainer]
     */
    export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
        /**
         * [descr:dxCircularGauge.Options.rangeContainer.orientation]
         */
        orientation?: 'center' | 'inside' | 'outside';
        /**
         * [descr:dxCircularGauge.Options.rangeContainer.width]
         */
        width?: number;
    }
    /**
     * [descr:dxCircularGauge.Options.scale]
     */
    export interface dxCircularGaugeScale extends BaseGaugeScale {
        /**
         * [descr:dxCircularGauge.Options.scale.label]
         */
        label?: dxCircularGaugeScaleLabel;
        /**
         * [descr:dxCircularGauge.Options.scale.orientation]
         */
        orientation?: 'center' | 'inside' | 'outside';
    }
    /**
     * [descr:dxCircularGauge.Options.scale.label]
     */
    export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
        /**
         * [descr:dxCircularGauge.Options.scale.label.hideFirstOrLast]
         */
        hideFirstOrLast?: 'first' | 'last';
        /**
         * [descr:dxCircularGauge.Options.scale.label.indentFromTick]
         */
        indentFromTick?: number;
    }
    /**
     * [descr:dxCircularGauge]
     */
    export class dxCircularGauge extends BaseGauge {
        constructor(element: Element, options?: dxCircularGaugeOptions)
        constructor(element: JQuery, options?: dxCircularGaugeOptions)
    }
    /**
     * [descr:dxFunnel.Options]
     */
    export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
        /**
         * [descr:dxFunnel.Options.adaptiveLayout]
         */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /**
         * [descr:dxFunnel.Options.algorithm]
         */
        algorithm?: 'dynamicHeight' | 'dynamicSlope';
        /**
         * [descr:dxFunnel.Options.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxFunnel.Options.colorField]
         */
        colorField?: string;
        /**
         * [descr:dxFunnel.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:dxFunnel.Options.hoverEnabled]
         */
        hoverEnabled?: boolean;
        /**
         * [descr:dxFunnel.Options.inverted]
         */
        inverted?: boolean;
        /**
         * [descr:dxFunnel.Options.item]
         */
        item?: { border?: { color?: string, visible?: boolean, width?: number }, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } }, selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } } };
        /**
         * [descr:dxFunnel.Options.label]
         */
        label?: { backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, opacity?: number, visible?: boolean, width?: number }, customizeText?: ((itemInfo: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => string), font?: Font, format?: DevExpress.ui.format, horizontalAlignment?: 'left' | 'right', horizontalOffset?: number, position?: 'columns' | 'inside' | 'outside', showForZeroValues?: boolean, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /**
         * [descr:dxFunnel.Options.legend]
         */
        legend?: dxFunnelLegend;
        /**
         * [descr:dxFunnel.Options.neckHeight]
         */
        neckHeight?: number;
        /**
         * [descr:dxFunnel.Options.neckWidth]
         */
        neckWidth?: number;
        /**
         * [descr:dxFunnel.Options.onHoverChanged]
         */
        onHoverChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /**
         * [descr:dxFunnel.Options.onItemClick]
         */
        onItemClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, item?: dxFunnelItem }) => any) | string;
        /**
         * [descr:dxFunnel.Options.onLegendClick]
         */
        onLegendClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, item?: dxFunnelItem }) => any) | string;
        /**
         * [descr:dxFunnel.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /**
         * [descr:dxFunnel.Options.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:dxFunnel.Options.paletteExtensionMode]
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * [descr:dxFunnel.Options.resolveLabelOverlapping]
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /**
         * [descr:dxFunnel.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'none' | 'single';
        /**
         * [descr:dxFunnel.Options.sortData]
         */
        sortData?: boolean;
        /**
         * [descr:dxFunnel.Options.tooltip]
         */
        tooltip?: dxFunnelTooltip;
        /**
         * [descr:dxFunnel.Options.valueField]
         */
        valueField?: string;
    }
    /**
     * [descr:dxFunnel.Options.legend]
     */
    export interface dxFunnelLegend extends BaseLegend {
        /**
         * [descr:dxFunnel.Options.legend.customizeHint]
         */
        customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /**
         * [descr:dxFunnel.Options.legend.customizeItems]
         */
        customizeItems?: ((items: Array<FunnelLegendItem>) => Array<FunnelLegendItem>);
        /**
         * [descr:dxFunnel.Options.legend.customizeText]
         */
        customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string);
        /**
         * [descr:dxFunnel.Options.legend.markerTemplate]
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: FunnelLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxFunnel.Options.legend.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxFunnel.Options.tooltip]
     */
    export interface dxFunnelTooltip extends BaseWidgetTooltip {
        /**
         * [descr:dxFunnel.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxFunnel.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
    }
    /**
     * [descr:dxFunnel]
     */
    export class dxFunnel extends BaseWidget {
        constructor(element: Element, options?: dxFunnelOptions)
        constructor(element: JQuery, options?: dxFunnelOptions)
        /**
         * [descr:dxFunnel.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:dxFunnel.getAllItems()]
         */
        getAllItems(): Array<dxFunnelItem>;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxFunnel.hideTooltip()]
         */
        hideTooltip(): void;
    }
    /**
     * [descr:dxFunnelItem]
     */
    export class dxFunnelItem {
        /**
         * [descr:dxFunnelItem.argument]
         */
        argument?: string | Date | number;
        /**
         * [descr:dxFunnelItem.data]
         */
        data?: any;
        /**
         * [descr:dxFunnelItem.percent]
         */
        percent?: number;
        /**
         * [descr:dxFunnelItem.value]
         */
        value?: number;
        /**
         * [descr:dxFunnelItem.getColor()]
         */
        getColor(): string;
        /**
         * [descr:dxFunnelItem.hover(state)]
         */
        hover(state: boolean): void;
        /**
         * [descr:dxFunnelItem.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:dxFunnelItem.isSelected()]
         */
        isSelected(): boolean;
        /**
         * [descr:dxFunnelItem.select(state)]
         */
        select(state: boolean): void;
        /**
         * [descr:dxFunnelItem.showTooltip()]
         */
        showTooltip(): void;
    }
    /**
     * [descr:dxLinearGauge.Options]
     */
    export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
        /**
         * [descr:dxLinearGauge.Options.geometry]
         */
        geometry?: { orientation?: 'horizontal' | 'vertical' };
        /**
         * [descr:dxLinearGauge.Options.rangeContainer]
         */
        rangeContainer?: dxLinearGaugeRangeContainer;
        /**
         * [descr:dxLinearGauge.Options.scale]
         */
        scale?: dxLinearGaugeScale;
        /**
         * [descr:dxLinearGauge.Options.subvalueIndicator]
         */
        subvalueIndicator?: GaugeIndicator;
        /**
         * [descr:dxLinearGauge.Options.valueIndicator]
         */
        valueIndicator?: GaugeIndicator;
    }
    /**
     * [descr:dxLinearGauge.Options.rangeContainer]
     */
    export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
        /**
         * [descr:dxLinearGauge.Options.rangeContainer.horizontalOrientation]
         */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /**
         * [descr:dxLinearGauge.Options.rangeContainer.verticalOrientation]
         */
        verticalOrientation?: 'bottom' | 'center' | 'top';
        /**
         * [descr:dxLinearGauge.Options.rangeContainer.width]
         */
        width?: { end?: number, start?: number } | number;
    }
    /**
     * [descr:dxLinearGauge.Options.scale]
     */
    export interface dxLinearGaugeScale extends BaseGaugeScale {
        /**
         * [descr:dxLinearGauge.Options.scale.horizontalOrientation]
         */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /**
         * [descr:dxLinearGauge.Options.scale.label]
         */
        label?: dxLinearGaugeScaleLabel;
        /**
         * [descr:dxLinearGauge.Options.scale.scaleDivisionFactor]
         */
        scaleDivisionFactor?: number;
        /**
         * [descr:dxLinearGauge.Options.scale.verticalOrientation]
         */
        verticalOrientation?: 'bottom' | 'center' | 'top';
    }
    /**
     * [descr:dxLinearGauge.Options.scale.label]
     */
    export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
        /**
         * [descr:dxLinearGauge.Options.scale.label.indentFromTick]
         */
        indentFromTick?: number;
    }
    /**
     * [descr:dxLinearGauge]
     */
    export class dxLinearGauge extends BaseGauge {
        constructor(element: Element, options?: dxLinearGaugeOptions)
        constructor(element: JQuery, options?: dxLinearGaugeOptions)
    }
    /**
     * [descr:dxPieChart.Options]
     */
    export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
        /**
         * [descr:dxPieChart.Options.adaptiveLayout]
         */
        adaptiveLayout?: dxPieChartAdaptiveLayout;
        /**
         * [descr:dxPieChart.Options.annotations]
         */
        annotations?: Array<dxPieChartAnnotationConfig | any>;
        /**
         * [descr:dxPieChart.Options.centerTemplate]
         */
        centerTemplate?: DevExpress.core.template | ((component: dxPieChart, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxPieChart.Options.commonAnnotationSettings]
         */
        commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
        /**
         * [descr:dxPieChart.Options.commonSeriesSettings]
         */
        commonSeriesSettings?: any;
        /**
         * [descr:dxPieChart.Options.customizeAnnotation]
         */
        customizeAnnotation?: ((annotation: dxPieChartAnnotationConfig | any) => dxPieChartAnnotationConfig);
        /**
         * [descr:dxPieChart.Options.diameter]
         */
        diameter?: number;
        /**
         * [descr:dxPieChart.Options.innerRadius]
         */
        innerRadius?: number;
        /**
         * [descr:dxPieChart.Options.legend]
         */
        legend?: dxPieChartLegend;
        /**
         * [descr:dxPieChart.Options.minDiameter]
         */
        minDiameter?: number;
        /**
         * [descr:dxPieChart.Options.onLegendClick]
         */
        onLegendClick?: ((e: { component?: dxPieChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
        /**
         * [descr:dxPieChart.Options.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:dxPieChart.Options.resolveLabelOverlapping]
         */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /**
         * [descr:dxPieChart.Options.segmentsDirection]
         */
        segmentsDirection?: 'anticlockwise' | 'clockwise';
        /**
         * [descr:dxPieChart.Options.series]
         */
        series?: PieChartSeries | Array<PieChartSeries>;
        /**
         * [descr:dxPieChart.Options.seriesTemplate]
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PieChartSeries), nameField?: string };
        /**
         * [descr:dxPieChart.Options.sizeGroup]
         */
        sizeGroup?: string;
        /**
         * [descr:dxPieChart.Options.startAngle]
         */
        startAngle?: number;
        /**
         * [descr:dxPieChart.Options.type]
         */
        type?: 'donut' | 'doughnut' | 'pie';
    }
    /**
     * [descr:dxPieChart.Options.adaptiveLayout]
     */
    export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /**
         * [descr:dxPieChart.Options.adaptiveLayout.keepLabels]
         */
        keepLabels?: boolean;
    }
    /**
     * [descr:dxPieChart.Options.legend]
     */
    export interface dxPieChartLegend extends BaseChartLegend {
        /**
         * [descr:dxPieChart.Options.legend.customizeHint]
         */
        customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /**
         * [descr:dxPieChart.Options.legend.customizeItems]
         */
        customizeItems?: ((items: Array<PieChartLegendItem>) => Array<PieChartLegendItem>);
        /**
         * [descr:dxPieChart.Options.legend.customizeText]
         */
        customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /**
         * [descr:dxPieChart.Options.legend.hoverMode]
         */
        hoverMode?: 'none' | 'allArgumentPoints';
        /**
         * [descr:dxPieChart.Options.legend.markerTemplate]
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: PieChartLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
    }
    /**
     * [descr:dxPieChart]
     */
    export class dxPieChart extends BaseChart {
        constructor(element: Element, options?: dxPieChartOptions)
        constructor(element: JQuery, options?: dxPieChartOptions)
        /**
         * [descr:dxPieChart.getInnerRadius()]
         */
        getInnerRadius(): number;
    }
    /**
     * [descr:dxPieChartAnnotationConfig]
     */
    export interface dxPieChartAnnotationConfig extends dxPieChartCommonAnnotationConfig {
        /**
         * [descr:dxPieChartAnnotationConfig.name]
         */
        name?: string;
    }
    /**
     * [descr:dxPieChartCommonAnnotationConfig]
     */
    export interface dxPieChartCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * [descr:dxPieChartCommonAnnotationConfig.argument]
         */
        argument?: number | Date | string;
        /**
         * [descr:dxPieChartCommonAnnotationConfig.customizeTooltip]
         */
        customizeTooltip?: ((annotation: dxPieChartAnnotationConfig | any) => any);
        /**
         * [descr:dxPieChartCommonAnnotationConfig.location]
         */
        location?: 'center' | 'edge';
        /**
         * [descr:dxPieChartCommonAnnotationConfig.series]
         */
        series?: string;
        /**
         * [descr:dxPieChartCommonAnnotationConfig.template]
         */
        template?: DevExpress.core.template | ((annotation: dxPieChartCommonAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxPieChartCommonAnnotationConfig.tooltipTemplate]
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxPieChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:dxPieChartSeriesTypes]
     */
    export interface dxPieChartSeriesTypes {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries]
         */
        CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
        /**
         * [descr:dxPieChartSeriesTypes.DoughnutSeries]
         */
        DoughnutSeries?: any;
        /**
         * [descr:dxPieChartSeriesTypes.PieSeries]
         */
        PieSeries?: any;
    }
    /**
     * [descr:dxPieChartSeriesTypes.CommonPieChartSeries]
     */
    export interface dxPieChartSeriesTypesCommonPieChartSeries {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.argumentType]
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.border]
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.color]
         */
        color?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverMode]
         */
        hoverMode?: 'none' | 'onlyPoint';
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle]
         */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label]
         */
        label?: { argumentFormat?: DevExpress.ui.format, backgroundColor?: string, border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, connector?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((pointInfo: any) => string), font?: Font, format?: DevExpress.ui.format, position?: 'columns' | 'inside' | 'outside', radialOffset?: number, rotationAngle?: number, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' };
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.maxLabelCount]
         */
        maxLabelCount?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.minSegmentSize]
         */
        minSegmentSize?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionMode]
         */
        selectionMode?: 'none' | 'onlyPoint';
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle]
         */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } };
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping]
         */
        smallValuesGrouping?: { groupName?: string, mode?: 'none' | 'smallValueThreshold' | 'topN', threshold?: number, topCount?: number };
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.tagField]
         */
        tagField?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.valueField]
         */
        valueField?: string;
    }
    /**
     * [descr:dxPolarChart.Options]
     */
    export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
        /**
         * [descr:dxPolarChart.Options.adaptiveLayout]
         */
        adaptiveLayout?: dxPolarChartAdaptiveLayout;
        /**
         * [descr:dxPolarChart.Options.annotations]
         */
        annotations?: Array<dxPolarChartAnnotationConfig | any>;
        /**
         * [descr:dxPolarChart.Options.argumentAxis]
         */
        argumentAxis?: dxPolarChartArgumentAxis;
        /**
         * [descr:dxPolarChart.Options.barGroupPadding]
         */
        barGroupPadding?: number;
        /**
         * [descr:dxPolarChart.Options.barGroupWidth]
         */
        barGroupWidth?: number;
        /**
         * [descr:dxPolarChart.Options.commonAnnotationSettings]
         */
        commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings]
         */
        commonAxisSettings?: dxPolarChartCommonAxisSettings;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings]
         */
        commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
        /**
         * [descr:dxPolarChart.Options.containerBackgroundColor]
         */
        containerBackgroundColor?: string;
        /**
         * [descr:dxPolarChart.Options.customizeAnnotation]
         */
        customizeAnnotation?: ((annotation: dxPolarChartAnnotationConfig | any) => dxPolarChartAnnotationConfig);
        /**
         * [descr:dxPolarChart.Options.dataPrepareSettings]
         */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) };
        /**
         * [descr:dxPolarChart.Options.legend]
         */
        legend?: dxPolarChartLegend;
        /**
         * [descr:dxPolarChart.Options.negativesAsZeroes]
         */
        negativesAsZeroes?: boolean;
        /**
         * [descr:dxPolarChart.Options.onArgumentAxisClick]
         */
        onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, argument?: Date | number | string }) => any) | string;
        /**
         * [descr:dxPolarChart.Options.onLegendClick]
         */
        onLegendClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: polarChartSeriesObject }) => any) | string;
        /**
         * [descr:dxPolarChart.Options.onSeriesClick]
         */
        onSeriesClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: polarChartSeriesObject }) => any) | string;
        /**
         * [descr:dxPolarChart.Options.onSeriesHoverChanged]
         */
        onSeriesHoverChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /**
         * [descr:dxPolarChart.Options.onSeriesSelectionChanged]
         */
        onSeriesSelectionChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /**
         * [descr:dxPolarChart.Options.onZoomEnd]
         */
        onZoomEnd?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, previousRange?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan', zoomFactor?: number, shift?: number }) => any);
        /**
         * [descr:dxPolarChart.Options.onZoomStart]
         */
        onZoomStart?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, axis?: chartAxisObject, range?: VizRange, cancel?: boolean, actionType?: 'zoom' | 'pan' }) => any);
        /**
         * [descr:dxPolarChart.Options.resolveLabelOverlapping]
         */
        resolveLabelOverlapping?: 'hide' | 'none';
        /**
         * [descr:dxPolarChart.Options.series]
         */
        series?: PolarChartSeries | Array<PolarChartSeries>;
        /**
         * [descr:dxPolarChart.Options.seriesSelectionMode]
         */
        seriesSelectionMode?: 'multiple' | 'single';
        /**
         * [descr:dxPolarChart.Options.seriesTemplate]
         */
        seriesTemplate?: { customizeSeries?: ((seriesName: any) => PolarChartSeries), nameField?: string };
        /**
         * [descr:dxPolarChart.Options.tooltip]
         */
        tooltip?: dxPolarChartTooltip;
        /**
         * [descr:dxPolarChart.Options.useSpiderWeb]
         */
        useSpiderWeb?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis]
         */
        valueAxis?: dxPolarChartValueAxis;
    }
    /**
     * [descr:dxPolarChart.Options.adaptiveLayout]
     */
    export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /**
         * [descr:dxPolarChart.Options.adaptiveLayout.height]
         */
        height?: number;
        /**
         * [descr:dxPolarChart.Options.adaptiveLayout.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis]
     */
    export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.argumentType]
         */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /**
         * [descr:dxPolarChart.Options.argumentAxis.axisDivisionFactor]
         */
        axisDivisionFactor?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.categories]
         */
        categories?: Array<number | string | Date>;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines]
         */
        constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.firstPointOnStartAngle]
         */
        firstPointOnStartAngle?: boolean;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'none';
        /**
         * [descr:dxPolarChart.Options.argumentAxis.label]
         */
        label?: dxPolarChartArgumentAxisLabel;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.linearThreshold]
         */
        linearThreshold?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.logarithmBase]
         */
        logarithmBase?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.minorTick]
         */
        minorTick?: dxPolarChartArgumentAxisMinorTick;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.minorTickCount]
         */
        minorTickCount?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.minorTickInterval]
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxPolarChart.Options.argumentAxis.originValue]
         */
        originValue?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.period]
         */
        period?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.startAngle]
         */
        startAngle?: number;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips]
         */
        strips?: Array<dxPolarChartArgumentAxisStrips>;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.tick]
         */
        tick?: dxPolarChartArgumentAxisTick;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.tickInterval]
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxPolarChart.Options.argumentAxis.type]
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.constantLines]
     */
    export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines.displayBehindSeries]
         */
        displayBehindSeries?: boolean;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines.extendAxis]
         */
        extendAxis?: boolean;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines.label]
         */
        label?: dxPolarChartArgumentAxisConstantLinesLabel;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines.value]
         */
        value?: number | Date | string;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.constantLines.label]
     */
    export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.constantLines.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.label]
     */
    export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.label.customizeHint]
         */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.argumentAxis.label.customizeText]
         */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.argumentAxis.label.format]
         */
        format?: DevExpress.ui.format;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.minorTick]
     */
    export interface dxPolarChartArgumentAxisMinorTick extends dxPolarChartCommonAxisSettingsMinorTick {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.minorTick.shift]
         */
        shift?: number;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.strips]
     */
    export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips.label]
         */
        label?: dxPolarChartArgumentAxisStripsLabel;
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.strips.label]
     */
    export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.strips.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxPolarChart.Options.argumentAxis.tick]
     */
    export interface dxPolarChartArgumentAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /**
         * [descr:dxPolarChart.Options.argumentAxis.tick.shift]
         */
        shift?: number;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings]
     */
    export interface dxPolarChartCommonAxisSettings {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.allowDecimals]
         */
        allowDecimals?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle]
         */
        constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.discreteAxisDivisionMode]
         */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.endOnTick]
         */
        endOnTick?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.grid]
         */
        grid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.inverted]
         */
        inverted?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.label]
         */
        label?: dxPolarChartCommonAxisSettingsLabel;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorGrid]
         */
        minorGrid?: { color?: string, opacity?: number, visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick]
         */
        minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.stripStyle]
         */
        stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick]
         */
        tick?: dxPolarChartCommonAxisSettingsTick;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle]
     */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.label]
         */
        label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.label]
     */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.font]
         */
        font?: Font;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.constantLineStyle.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.label]
     */
    export interface dxPolarChartCommonAxisSettingsLabel {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.label.font]
         */
        font?: Font;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.label.indentFromAxis]
         */
        indentFromAxis?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.label.overlappingBehavior]
         */
        overlappingBehavior?: 'none' | 'hide';
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.minorTick]
     */
    export interface dxPolarChartCommonAxisSettingsMinorTick {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick.length]
         */
        length?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.minorTick.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.stripStyle]
     */
    export interface dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.stripStyle.label]
         */
        label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.stripStyle.label]
     */
    export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.stripStyle.label.font]
         */
        font?: Font;
    }
    /**
     * [descr:dxPolarChart.Options.commonAxisSettings.tick]
     */
    export interface dxPolarChartCommonAxisSettingsTick {
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick.length]
         */
        length?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChart.Options.commonAxisSettings.tick.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChart.Options.commonSeriesSettings]
     */
    export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.area]
         */
        area?: any;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.bar]
         */
        bar?: any;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.line]
         */
        line?: any;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.scatter]
         */
        scatter?: any;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.stackedbar]
         */
        stackedbar?: any;
        /**
         * [descr:dxPolarChart.Options.commonSeriesSettings.type]
         */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /**
     * [descr:dxPolarChart.Options.legend]
     */
    export interface dxPolarChartLegend extends BaseChartLegend {
        /**
         * [descr:dxPolarChart.Options.legend.customizeHint]
         */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.legend.customizeText]
         */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.legend.hoverMode]
         */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    }
    /**
     * [descr:dxPolarChart.Options.tooltip]
     */
    export interface dxPolarChartTooltip extends BaseChartTooltip {
        /**
         * [descr:dxPolarChart.Options.tooltip.shared]
         */
        shared?: boolean;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis]
     */
    export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
        /**
         * [descr:dxPolarChart.Options.valueAxis.axisDivisionFactor]
         */
        axisDivisionFactor?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.categories]
         */
        categories?: Array<number | string | Date>;
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines]
         */
        constantLines?: Array<dxPolarChartValueAxisConstantLines>;
        /**
         * [descr:dxPolarChart.Options.valueAxis.endOnTick]
         */
        endOnTick?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis.label]
         */
        label?: dxPolarChartValueAxisLabel;
        /**
         * [descr:dxPolarChart.Options.valueAxis.linearThreshold]
         */
        linearThreshold?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.logarithmBase]
         */
        logarithmBase?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.maxValueMargin]
         */
        maxValueMargin?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.minValueMargin]
         */
        minValueMargin?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.minVisualRangeLength]
         */
        minVisualRangeLength?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxPolarChart.Options.valueAxis.minorTickCount]
         */
        minorTickCount?: number;
        /**
         * [descr:dxPolarChart.Options.valueAxis.minorTickInterval]
         */
        minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxPolarChart.Options.valueAxis.showZero]
         */
        showZero?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips]
         */
        strips?: Array<dxPolarChartValueAxisStrips>;
        /**
         * [descr:dxPolarChart.Options.valueAxis.tick]
         */
        tick?: dxPolarChartValueAxisTick;
        /**
         * [descr:dxPolarChart.Options.valueAxis.tickInterval]
         */
        tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year';
        /**
         * [descr:dxPolarChart.Options.valueAxis.type]
         */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /**
         * [descr:dxPolarChart.Options.valueAxis.valueMarginsEnabled]
         */
        valueMarginsEnabled?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis.valueType]
         */
        valueType?: 'datetime' | 'numeric' | 'string';
        /**
         * [descr:dxPolarChart.Options.valueAxis.visualRange]
         */
        visualRange?: VizRange | Array<number | string | Date>;
        /**
         * [descr:dxPolarChart.Options.valueAxis.visualRangeUpdateMode]
         */
        visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
        /**
         * [descr:dxPolarChart.Options.valueAxis.wholeRange]
         */
        wholeRange?: VizRange | Array<number | string | Date>;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.constantLines]
     */
    export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines.displayBehindSeries]
         */
        displayBehindSeries?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines.extendAxis]
         */
        extendAxis?: boolean;
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines.label]
         */
        label?: dxPolarChartValueAxisConstantLinesLabel;
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines.value]
         */
        value?: number | Date | string;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.constantLines.label]
     */
    export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /**
         * [descr:dxPolarChart.Options.valueAxis.constantLines.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.label]
     */
    export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /**
         * [descr:dxPolarChart.Options.valueAxis.label.customizeHint]
         */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.valueAxis.label.customizeText]
         */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /**
         * [descr:dxPolarChart.Options.valueAxis.label.format]
         */
        format?: DevExpress.ui.format;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.strips]
     */
    export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips.endValue]
         */
        endValue?: number | Date | string;
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips.label]
         */
        label?: dxPolarChartValueAxisStripsLabel;
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips.startValue]
         */
        startValue?: number | Date | string;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.strips.label]
     */
    export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /**
         * [descr:dxPolarChart.Options.valueAxis.strips.label.text]
         */
        text?: string;
    }
    /**
     * [descr:dxPolarChart.Options.valueAxis.tick]
     */
    export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /**
         * [descr:dxPolarChart.Options.valueAxis.tick.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChart]
     */
    export class dxPolarChart extends BaseChart {
        constructor(element: Element, options?: dxPolarChartOptions)
        constructor(element: JQuery, options?: dxPolarChartOptions)
        /**
         * [descr:dxPolarChart.getValueAxis()]
         */
        getValueAxis(): chartAxisObject;
        /**
         * [descr:dxPolarChart.resetVisualRange()]
         */
        resetVisualRange(): void;
    }
    /**
     * [descr:dxPolarChartAnnotationConfig]
     */
    export interface dxPolarChartAnnotationConfig extends dxPolarChartCommonAnnotationConfig {
        /**
         * [descr:dxPolarChartAnnotationConfig.name]
         */
        name?: string;
    }
    /**
     * [descr:dxPolarChartCommonAnnotationConfig]
     */
    export interface dxPolarChartCommonAnnotationConfig extends BaseChartAnnotationConfig {
        /**
         * [descr:dxPolarChartCommonAnnotationConfig.angle]
         */
        angle?: number;
        /**
         * [descr:dxPolarChartCommonAnnotationConfig.customizeTooltip]
         */
        customizeTooltip?: ((annotation: dxPolarChartAnnotationConfig | any) => any);
        /**
         * [descr:dxPolarChartCommonAnnotationConfig.radius]
         */
        radius?: number;
        /**
         * [descr:dxPolarChartCommonAnnotationConfig.template]
         */
        template?: DevExpress.core.template | ((annotation: dxPolarChartCommonAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxPolarChartCommonAnnotationConfig.tooltipTemplate]
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxPolarChartAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:dxPolarChartSeriesTypes]
     */
    export interface dxPolarChartSeriesTypes {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries]
         */
        CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
        /**
         * [descr:dxPolarChartSeriesTypes.areapolarseries]
         */
        areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
        /**
         * [descr:dxPolarChartSeriesTypes.barpolarseries]
         */
        barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
        /**
         * [descr:dxPolarChartSeriesTypes.linepolarseries]
         */
        linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
        /**
         * [descr:dxPolarChartSeriesTypes.scatterpolarseries]
         */
        scatterpolarseries?: any;
        /**
         * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries]
         */
        stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
    }
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries]
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.barPadding]
         */
        barPadding?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.barWidth]
         */
        barWidth?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.border]
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.closed]
         */
        closed?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.dashStyle]
         */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle]
         */
        hoverStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.ignoreEmptyPoints]
         */
        ignoreEmptyPoints?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label]
         */
        label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.maxLabelCount]
         */
        maxLabelCount?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.minBarSize]
         */
        minBarSize?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point]
         */
        point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionMode]
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle]
         */
        selectionStyle?: { border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number }, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.showInLegend]
         */
        showInLegend?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.stack]
         */
        stack?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.tagField]
         */
        tagField?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar]
         */
        valueErrorBar?: { color?: string, displayMode?: 'auto' | 'high' | 'low' | 'none', edgeLength?: number, highValueField?: string, lineWidth?: number, lowValueField?: string, opacity?: number, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueField]
         */
        valueField?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.width]
         */
        width?: number;
    }
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label]
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.argumentFormat]
         */
        argumentFormat?: DevExpress.ui.format;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border]
         */
        border?: { color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector]
         */
        connector?: { color?: string, visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText]
         */
        customizeText?: ((pointInfo: any) => string);
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.font]
         */
        font?: Font;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.position]
         */
        position?: 'inside' | 'outside';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.rotationAngle]
         */
        rotationAngle?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.showForZeroValues]
         */
        showForZeroValues?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point]
     */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border]
         */
        border?: { color?: string, visible?: boolean, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverMode]
         */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle]
         */
        hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image]
         */
        image?: string | { height?: number, url?: string, width?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode]
         */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle]
         */
        selectionStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, size?: number };
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.size]
         */
        size?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.symbol]
         */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChartSeriesTypes.areapolarseries]
     */
    export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChartSeriesTypes.areapolarseries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxPolarChartSeriesTypes.areapolarseries.point]
         */
        point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
        /**
         * [descr:dxPolarChartSeriesTypes.areapolarseries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxPolarChartSeriesTypes.areapolarseries.point]
     */
    export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /**
         * [descr:dxPolarChartSeriesTypes.areapolarseries.point.visible]
         */
        visible?: boolean;
    }
    /**
     * [descr:dxPolarChartSeriesTypes.barpolarseries]
     */
    export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChartSeriesTypes.barpolarseries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxPolarChartSeriesTypes.barpolarseries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxPolarChartSeriesTypes.linepolarseries]
     */
    export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChartSeriesTypes.linepolarseries.hoverMode]
         */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /**
         * [descr:dxPolarChartSeriesTypes.linepolarseries.selectionMode]
         */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /**
     * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries]
     */
    export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /**
         * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.hoverMode]
         */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /**
         * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.label]
         */
        label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
        /**
         * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.selectionMode]
         */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /**
     * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.label]
     */
    export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /**
         * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.label.position]
         */
        position?: 'inside' | 'outside';
    }
    /**
     * [descr:dxRangeSelector.Options]
     */
    export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
        /**
         * [descr:dxRangeSelector.Options.background]
         */
        background?: { color?: string, image?: { location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop', url?: string }, visible?: boolean };
        /**
         * [descr:dxRangeSelector.Options.behavior]
         */
        behavior?: { allowSlidersSwap?: boolean, animationEnabled?: boolean, callValueChanged?: 'onMoving' | 'onMovingComplete', manualRangeSelectionEnabled?: boolean, moveSelectedRangeByClick?: boolean, snapToTicks?: boolean };
        /**
         * [descr:dxRangeSelector.Options.chart]
         */
        chart?: { barGroupPadding?: number, barGroupWidth?: number, bottomIndent?: number, commonSeriesSettings?: dxChartCommonSeriesSettings, dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) }, maxBubbleSize?: number, minBubbleSize?: number, negativesAsZeroes?: boolean, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', series?: ChartSeries | Array<ChartSeries>, seriesTemplate?: { customizeSeries?: ((seriesName: any) => ChartSeries), nameField?: string }, topIndent?: number, valueAxis?: { inverted?: boolean, logarithmBase?: number, max?: number, min?: number, type?: 'continuous' | 'logarithmic', valueType?: 'datetime' | 'numeric' | 'string' } };
        /**
         * [descr:dxRangeSelector.Options.containerBackgroundColor]
         */
        containerBackgroundColor?: string;
        /**
         * [descr:dxRangeSelector.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:dxRangeSelector.Options.dataSourceField]
         */
        dataSourceField?: string;
        /**
         * [descr:dxRangeSelector.Options.indent]
         */
        indent?: { left?: number, right?: number };
        /**
         * [descr:dxRangeSelector.Options.onValueChanged]
         */
        onValueChanged?: ((e: { component?: dxRangeSelector, element?: DevExpress.core.dxElement, model?: any, value?: Array<number | string | Date>, previousValue?: Array<number | string | Date>, event?: DevExpress.events.event }) => any);
        /**
         * [descr:dxRangeSelector.Options.scale]
         */
        scale?: { aggregateByCategory?: boolean, aggregationGroupWidth?: number, aggregationInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', allowDecimals?: boolean, breakStyle?: { color?: string, line?: 'straight' | 'waved', width?: number }, breaks?: Array<ScaleBreak>, categories?: Array<number | string | Date>, endOnTick?: boolean, endValue?: number | Date | string, holidays?: Array<Date | string> | Array<number>, label?: { customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, overlappingBehavior?: 'hide' | 'none', topIndent?: number, visible?: boolean }, linearThreshold?: number, logarithmBase?: number, marker?: { label?: { customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string), format?: DevExpress.ui.format }, separatorHeight?: number, textLeftIndent?: number, textTopIndent?: number, topIndent?: number, visible?: boolean }, maxRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minRange?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', minorTick?: { color?: string, opacity?: number, visible?: boolean, width?: number }, minorTickCount?: number, minorTickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', placeholderHeight?: number, showCustomBoundaryTicks?: boolean, singleWorkdays?: Array<Date | string> | Array<number>, startValue?: number | Date | string, tick?: { color?: string, opacity?: number, width?: number }, tickInterval?: number | any | 'day' | 'hour' | 'millisecond' | 'minute' | 'month' | 'quarter' | 'second' | 'week' | 'year', type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete', valueType?: 'datetime' | 'numeric' | 'string', workWeek?: Array<number>, workdaysOnly?: boolean };
        /**
         * [descr:dxRangeSelector.Options.selectedRangeColor]
         */
        selectedRangeColor?: string;
        /**
         * [descr:dxRangeSelector.Options.selectedRangeUpdateMode]
         */
        selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
        /**
         * [descr:dxRangeSelector.Options.shutter]
         */
        shutter?: { color?: string, opacity?: number };
        /**
         * [descr:dxRangeSelector.Options.sliderHandle]
         */
        sliderHandle?: { color?: string, opacity?: number, width?: number };
        /**
         * [descr:dxRangeSelector.Options.sliderMarker]
         */
        sliderMarker?: { color?: string, customizeText?: ((scaleValue: { value?: Date | number | string, valueText?: string }) => string), font?: Font, format?: DevExpress.ui.format, invalidRangeColor?: string, paddingLeftRight?: number, paddingTopBottom?: number, placeholderHeight?: number, visible?: boolean };
        /**
         * [descr:dxRangeSelector.Options.value]
         */
        value?: Array<number | string | Date> | VizRange;
    }
    /**
     * [descr:dxRangeSelector]
     */
    export class dxRangeSelector extends BaseWidget {
        constructor(element: Element, options?: dxRangeSelectorOptions)
        constructor(element: JQuery, options?: dxRangeSelectorOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxRangeSelector.getValue()]
         */
        getValue(): Array<number | string | Date>;
        /**
         * [descr:BaseWidget.render()]
         */
        render(): void;
        /**
         * [descr:dxRangeSelector.render(skipChartAnimation)]
         */
        render(skipChartAnimation: boolean): void;
        /**
         * [descr:dxRangeSelector.setValue(value)]
         */
        setValue(value: Array<number | string | Date> | VizRange): void;
    }
    /**
     * [descr:dxSankey.Options]
     */
    export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
        /**
         * [descr:dxSankey.Options.adaptiveLayout]
         */
        adaptiveLayout?: { height?: number, keepLabels?: boolean, width?: number };
        /**
         * [descr:dxSankey.Options.alignment]
         */
        alignment?: 'bottom' | 'center' | 'top' | Array<'bottom' | 'center' | 'top'>;
        /**
         * [descr:dxSankey.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:dxSankey.Options.hoverEnabled]
         */
        hoverEnabled?: boolean;
        /**
         * [descr:dxSankey.Options.label]
         */
        label?: { border?: { color?: string, visible?: boolean, width?: number }, customizeText?: ((itemInfo: dxSankeyNode) => string), font?: Font, horizontalOffset?: number, overlappingBehavior?: 'ellipsis' | 'hide' | 'none', shadow?: { blur?: number, color?: string, offsetX?: number, offsetY?: number, opacity?: number }, useNodeColors?: boolean, verticalOffset?: number, visible?: boolean };
        /**
         * [descr:dxSankey.Options.link]
         */
        link?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, colorMode?: 'none' | 'source' | 'target' | 'gradient', hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number };
        /**
         * [descr:dxSankey.Options.node]
         */
        node?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, visible?: boolean, width?: number }, color?: string, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number }, opacity?: number }, opacity?: number, padding?: number, width?: number };
        /**
         * [descr:dxSankey.Options.onLinkClick]
         */
        onLinkClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: dxSankeyLink }) => any) | string;
        /**
         * [descr:dxSankey.Options.onLinkHoverChanged]
         */
        onLinkHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyLink }) => any);
        /**
         * [descr:dxSankey.Options.onNodeClick]
         */
        onNodeClick?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: dxSankeyNode }) => any) | string;
        /**
         * [descr:dxSankey.Options.onNodeHoverChanged]
         */
        onNodeHoverChanged?: ((e: { component?: dxSankey, element?: DevExpress.core.dxElement, model?: any, target?: dxSankeyNode }) => any);
        /**
         * [descr:dxSankey.Options.palette]
         */
        palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /**
         * [descr:dxSankey.Options.paletteExtensionMode]
         */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /**
         * [descr:dxSankey.Options.sortData]
         */
        sortData?: any;
        /**
         * [descr:dxSankey.Options.sourceField]
         */
        sourceField?: string;
        /**
         * [descr:dxSankey.Options.targetField]
         */
        targetField?: string;
        /**
         * [descr:dxSankey.Options.tooltip]
         */
        tooltip?: dxSankeyTooltip;
        /**
         * [descr:dxSankey.Options.weightField]
         */
        weightField?: string;
    }
    /**
     * [descr:dxSankey.Options.tooltip]
     */
    export interface dxSankeyTooltip extends BaseWidgetTooltip {
        /**
         * [descr:dxSankey.Options.tooltip.customizeLinkTooltip]
         */
        customizeLinkTooltip?: ((info: { source?: string, target?: string, weight?: number }) => any);
        /**
         * [descr:dxSankey.Options.tooltip.customizeNodeTooltip]
         */
        customizeNodeTooltip?: ((info: { title?: string, label?: string, weightIn?: number, weightOut?: number }) => any);
        /**
         * [descr:dxSankey.Options.tooltip.enabled]
         */
        enabled?: boolean;
        /**
         * [descr:dxSankey.Options.tooltip.linkTooltipTemplate]
         */
        linkTooltipTemplate?: DevExpress.core.template | ((info: { source?: string, target?: string, weight?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxSankey.Options.tooltip.nodeTooltipTemplate]
         */
        nodeTooltipTemplate?: DevExpress.core.template | ((info: { label?: string, weightIn?: number, weightOut?: number }, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:dxSankey]
     */
    export class dxSankey extends BaseWidget {
        constructor(element: Element, options?: dxSankeyOptions)
        constructor(element: JQuery, options?: dxSankeyOptions)
        /**
         * [descr:dxSankey.getAllLinks()]
         */
        getAllLinks(): Array<dxSankeyLink>;
        /**
         * [descr:dxSankey.getAllNodes()]
         */
        getAllNodes(): Array<dxSankeyNode>;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxSankey.hideTooltip()]
         */
        hideTooltip(): void;
    }
    /**
     * [descr:dxSankeyConnectionInfoObject]
     */
    export interface dxSankeyConnectionInfoObject {
        /**
         * [descr:dxSankeyConnectionInfoObject.source]
         */
        source?: string;
        /**
         * [descr:dxSankeyConnectionInfoObject.target]
         */
        target?: string;
        /**
         * [descr:dxSankeyConnectionInfoObject.weight]
         */
        weight?: number;
    }
    /**
     * [descr:dxSankeyLink]
     */
    export class dxSankeyLink {
        /**
         * [descr:dxSankeyLink.connection]
         */
        connection?: dxSankeyConnectionInfoObject;
        /**
         * [descr:dxSankeyLink.hideTooltip()]
         */
        hideTooltip(): void;
        /**
         * [descr:dxSankeyLink.hover(state)]
         */
        hover(state: boolean): void;
        /**
         * [descr:dxSankeyLink.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:dxSankeyLink.showTooltip()]
         */
        showTooltip(): void;
    }
    /**
     * [descr:dxSankeyNode]
     */
    export class dxSankeyNode {
        /**
         * [descr:dxSankeyNode.label]
         */
        label?: string;
        /**
         * [descr:dxSankeyNode.linksIn]
         */
        linksIn?: Array<any>;
        /**
         * [descr:dxSankeyNode.linksOut]
         */
        linksOut?: Array<any>;
        /**
         * [descr:dxSankeyNode.title]
         * @deprecated [depNote:dxSankeyNode.title]
         */
        title?: string;
        /**
         * [descr:dxSankeyNode.hideTooltip()]
         */
        hideTooltip(): void;
        /**
         * [descr:dxSankeyNode.hover(state)]
         */
        hover(state: boolean): void;
        /**
         * [descr:dxSankeyNode.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:dxSankeyNode.showTooltip()]
         */
        showTooltip(): void;
    }
    /**
     * [descr:dxSparkline.Options]
     */
    export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
        /**
         * [descr:dxSparkline.Options.argumentField]
         */
        argumentField?: string;
        /**
         * [descr:dxSparkline.Options.barNegativeColor]
         */
        barNegativeColor?: string;
        /**
         * [descr:dxSparkline.Options.barPositiveColor]
         */
        barPositiveColor?: string;
        /**
         * [descr:dxSparkline.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:dxSparkline.Options.firstLastColor]
         */
        firstLastColor?: string;
        /**
         * [descr:dxSparkline.Options.ignoreEmptyPoints]
         */
        ignoreEmptyPoints?: boolean;
        /**
         * [descr:dxSparkline.Options.lineColor]
         */
        lineColor?: string;
        /**
         * [descr:dxSparkline.Options.lineWidth]
         */
        lineWidth?: number;
        /**
         * [descr:dxSparkline.Options.lossColor]
         */
        lossColor?: string;
        /**
         * [descr:dxSparkline.Options.maxColor]
         */
        maxColor?: string;
        /**
         * [descr:dxSparkline.Options.maxValue]
         */
        maxValue?: number;
        /**
         * [descr:dxSparkline.Options.minColor]
         */
        minColor?: string;
        /**
         * [descr:dxSparkline.Options.minValue]
         */
        minValue?: number;
        /**
         * [descr:dxSparkline.Options.pointColor]
         */
        pointColor?: string;
        /**
         * [descr:dxSparkline.Options.pointSize]
         */
        pointSize?: number;
        /**
         * [descr:dxSparkline.Options.pointSymbol]
         */
        pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /**
         * [descr:dxSparkline.Options.showFirstLast]
         */
        showFirstLast?: boolean;
        /**
         * [descr:dxSparkline.Options.showMinMax]
         */
        showMinMax?: boolean;
        /**
         * [descr:dxSparkline.Options.type]
         */
        type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
        /**
         * [descr:dxSparkline.Options.valueField]
         */
        valueField?: string;
        /**
         * [descr:dxSparkline.Options.winColor]
         */
        winColor?: string;
        /**
         * [descr:dxSparkline.Options.winlossThreshold]
         */
        winlossThreshold?: number;
    }
    /**
     * [descr:dxSparkline]
     */
    export class dxSparkline extends BaseSparkline {
        constructor(element: Element, options?: dxSparklineOptions)
        constructor(element: JQuery, options?: dxSparklineOptions)
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
    }
    /**
     * [descr:dxTreeMap.Options]
     */
    export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
        /**
         * [descr:dxTreeMap.Options.childrenField]
         */
        childrenField?: string;
        /**
         * [descr:dxTreeMap.Options.colorField]
         */
        colorField?: string;
        /**
         * [descr:dxTreeMap.Options.colorizer]
         */
        colorizer?: { colorCodeField?: string, colorizeGroups?: boolean, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', range?: Array<number>, type?: 'discrete' | 'gradient' | 'none' | 'range' };
        /**
         * [descr:dxTreeMap.Options.dataSource]
         */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /**
         * [descr:dxTreeMap.Options.group]
         */
        group?: { border?: { color?: string, width?: number }, color?: string, headerHeight?: number, hoverEnabled?: boolean, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /**
         * [descr:dxTreeMap.Options.hoverEnabled]
         */
        hoverEnabled?: boolean;
        /**
         * [descr:dxTreeMap.Options.idField]
         */
        idField?: string;
        /**
         * [descr:dxTreeMap.Options.interactWithGroup]
         */
        interactWithGroup?: boolean;
        /**
         * [descr:dxTreeMap.Options.labelField]
         */
        labelField?: string;
        /**
         * [descr:dxTreeMap.Options.layoutAlgorithm]
         */
        layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
        /**
         * [descr:dxTreeMap.Options.layoutDirection]
         */
        layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
        /**
         * [descr:dxTreeMap.Options.maxDepth]
         */
        maxDepth?: number;
        /**
         * [descr:dxTreeMap.Options.onClick]
         */
        onClick?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, node?: dxTreeMapNode }) => any) | string;
        /**
         * [descr:dxTreeMap.Options.onDrill]
         */
        onDrill?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * [descr:dxTreeMap.Options.onHoverChanged]
         */
        onHoverChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * [descr:dxTreeMap.Options.onNodesInitialized]
         */
        onNodesInitialized?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeMapNode }) => any);
        /**
         * [descr:dxTreeMap.Options.onNodesRendering]
         */
        onNodesRendering?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * [descr:dxTreeMap.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /**
         * [descr:dxTreeMap.Options.parentField]
         */
        parentField?: string;
        /**
         * [descr:dxTreeMap.Options.selectionMode]
         */
        selectionMode?: 'multiple' | 'none' | 'single';
        /**
         * [descr:dxTreeMap.Options.tile]
         */
        tile?: { border?: { color?: string, width?: number }, color?: string, hoverStyle?: { border?: { color?: string, width?: number }, color?: string }, label?: { font?: Font, textOverflow?: 'ellipsis' | 'hide' | 'none', visible?: boolean, wordWrap?: 'normal' | 'breakWord' | 'none' }, selectionStyle?: { border?: { color?: string, width?: number }, color?: string } };
        /**
         * [descr:dxTreeMap.Options.tooltip]
         */
        tooltip?: dxTreeMapTooltip;
        /**
         * [descr:dxTreeMap.Options.valueField]
         */
        valueField?: string;
    }
    /**
     * [descr:dxTreeMap.Options.tooltip]
     */
    export interface dxTreeMapTooltip extends BaseWidgetTooltip {
        /**
         * [descr:dxTreeMap.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxTreeMap.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
    }
    /**
     * [descr:dxTreeMap]
     */
    export class dxTreeMap extends BaseWidget {
        constructor(element: Element, options?: dxTreeMapOptions)
        constructor(element: JQuery, options?: dxTreeMapOptions)
        /**
         * [descr:dxTreeMap.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:dxTreeMap.drillUp()]
         */
        drillUp(): void;
        /**
         * [descr:dxTreeMap.getCurrentNode()]
         */
        getCurrentNode(): dxTreeMapNode;
        /**
         * [descr:DataHelperMixin.getDataSource()]
         */
        getDataSource(): DevExpress.data.DataSource;
        /**
         * [descr:dxTreeMap.getRootNode()]
         */
        getRootNode(): dxTreeMapNode;
        /**
         * [descr:dxTreeMap.hideTooltip()]
         */
        hideTooltip(): void;
        /**
         * [descr:dxTreeMap.resetDrillDown()]
         */
        resetDrillDown(): void;
    }
    /**
     * [descr:dxTreeMapNode]
     */
    export class dxTreeMapNode {
        /**
         * [descr:dxTreeMapNode.data]
         */
        data?: any;
        /**
         * [descr:dxTreeMapNode.index]
         */
        index?: number;
        /**
         * [descr:dxTreeMapNode.level]
         */
        level?: number;
        /**
         * [descr:dxTreeMapNode.customize(options)]
         */
        customize(options: any): void;
        /**
         * [descr:dxTreeMapNode.drillDown()]
         */
        drillDown(): void;
        /**
         * [descr:dxTreeMapNode.getAllChildren()]
         */
        getAllChildren(): Array<dxTreeMapNode>;
        /**
         * [descr:dxTreeMapNode.getAllNodes()]
         */
        getAllNodes(): Array<dxTreeMapNode>;
        /**
         * [descr:dxTreeMapNode.getChild(index)]
         */
        getChild(index: number): dxTreeMapNode;
        /**
         * [descr:dxTreeMapNode.getChildrenCount()]
         */
        getChildrenCount(): number;
        /**
         * [descr:dxTreeMapNode.getParent()]
         */
        getParent(): dxTreeMapNode;
        /**
         * [descr:dxTreeMapNode.isActive()]
         */
        isActive(): boolean;
        /**
         * [descr:dxTreeMapNode.isHovered()]
         */
        isHovered(): boolean;
        /**
         * [descr:dxTreeMapNode.isLeaf()]
         */
        isLeaf(): boolean;
        /**
         * [descr:dxTreeMapNode.isSelected()]
         */
        isSelected(): boolean;
        /**
         * [descr:dxTreeMapNode.label()]
         */
        label(): string;
        /**
         * [descr:dxTreeMapNode.label(label)]
         */
        label(label: string): void;
        /**
         * [descr:dxTreeMapNode.resetCustomization()]
         */
        resetCustomization(): void;
        /**
         * [descr:dxTreeMapNode.select(state)]
         */
        select(state: boolean): void;
        /**
         * [descr:dxTreeMapNode.showTooltip()]
         */
        showTooltip(): void;
        /**
         * [descr:dxTreeMapNode.value()]
         */
        value(): number;
    }
    /**
     * [descr:dxVectorMap.Options]
     */
    export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
        /**
         * [descr:dxVectorMap.Options.annotations]
         */
        annotations?: Array<dxVectorMapAnnotationConfig | any>;
        /**
         * [descr:dxVectorMap.Options.background]
         */
        background?: { borderColor?: string, color?: string };
        /**
         * [descr:dxVectorMap.Options.bounds]
         */
        bounds?: Array<number>;
        /**
         * [descr:dxVectorMap.Options.center]
         */
        center?: Array<number>;
        /**
         * [descr:dxVectorMap.Options.commonAnnotationSettings]
         */
        commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
        /**
         * [descr:dxVectorMap.Options.controlBar]
         */
        controlBar?: { borderColor?: string, color?: string, enabled?: boolean, horizontalAlignment?: 'center' | 'left' | 'right', margin?: number, opacity?: number, verticalAlignment?: 'bottom' | 'top' };
        /**
         * [descr:dxVectorMap.Options.customizeAnnotation]
         */
        customizeAnnotation?: ((annotation: dxVectorMapAnnotationConfig | any) => dxVectorMapAnnotationConfig);
        /**
         * [descr:dxVectorMap.Options.layers]
         */
        layers?: Array<{ borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string | Array<any>, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' }> | { borderColor?: string, borderWidth?: number, color?: string, colorGroupingField?: string, colorGroups?: Array<number>, customize?: ((elements: Array<MapLayerElement>) => any), dataField?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string | Array<any>, elementType?: 'bubble' | 'dot' | 'image' | 'pie', hoverEnabled?: boolean, hoveredBorderColor?: string, hoveredBorderWidth?: number, hoveredColor?: string, label?: { dataField?: string, enabled?: boolean, font?: Font }, maxSize?: number, minSize?: number, name?: string, opacity?: number, palette?: Array<string> | 'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, selectedBorderColor?: string, selectedBorderWidth?: number, selectedColor?: string, selectionMode?: 'multiple' | 'none' | 'single', size?: number, sizeGroupingField?: string, sizeGroups?: Array<number>, type?: 'area' | 'line' | 'marker' };
        /**
         * [descr:dxVectorMap.Options.legends]
         */
        legends?: Array<dxVectorMapLegends>;
        /**
         * [descr:dxVectorMap.Options.maxZoomFactor]
         */
        maxZoomFactor?: number;
        /**
         * [descr:dxVectorMap.Options.onCenterChanged]
         */
        onCenterChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, center?: Array<number> }) => any);
        /**
         * [descr:dxVectorMap.Options.onClick]
         */
        onClick?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, event?: DevExpress.events.event, target?: MapLayerElement }) => any) | string;
        /**
         * [descr:dxVectorMap.Options.onSelectionChanged]
         */
        onSelectionChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /**
         * [descr:dxVectorMap.Options.onTooltipHidden]
         */
        onTooltipHidden?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement | dxVectorMapAnnotationConfig }) => any);
        /**
         * [descr:dxVectorMap.Options.onTooltipShown]
         */
        onTooltipShown?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement | dxVectorMapAnnotationConfig }) => any);
        /**
         * [descr:dxVectorMap.Options.onZoomFactorChanged]
         */
        onZoomFactorChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, zoomFactor?: number }) => any);
        /**
         * [descr:dxVectorMap.Options.panningEnabled]
         */
        panningEnabled?: boolean;
        /**
         * [descr:dxVectorMap.Options.projection]
         */
        projection?: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | VectorMapProjectionConfig | string | any;
        /**
         * [descr:dxVectorMap.Options.tooltip]
         */
        tooltip?: dxVectorMapTooltip;
        /**
         * [descr:dxVectorMap.Options.touchEnabled]
         */
        touchEnabled?: boolean;
        /**
         * [descr:dxVectorMap.Options.wheelEnabled]
         */
        wheelEnabled?: boolean;
        /**
         * [descr:dxVectorMap.Options.zoomFactor]
         */
        zoomFactor?: number;
        /**
         * [descr:dxVectorMap.Options.zoomingEnabled]
         */
        zoomingEnabled?: boolean;
    }
    /**
     * [descr:dxVectorMap.Options.legends]
     */
    export interface dxVectorMapLegends extends BaseLegend {
        /**
         * [descr:dxVectorMap.Options.legends.customizeHint]
         */
        customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /**
         * [descr:dxVectorMap.Options.legends.customizeItems]
         */
        customizeItems?: ((items: Array<VectorMapLegendItem>) => Array<VectorMapLegendItem>);
        /**
         * [descr:dxVectorMap.Options.legends.customizeText]
         */
        customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string);
        /**
         * [descr:dxVectorMap.Options.legends.font]
         */
        font?: Font;
        /**
         * [descr:dxVectorMap.Options.legends.markerColor]
         */
        markerColor?: string;
        /**
         * [descr:dxVectorMap.Options.legends.markerShape]
         */
        markerShape?: 'circle' | 'square';
        /**
         * [descr:dxVectorMap.Options.legends.markerSize]
         */
        markerSize?: number;
        /**
         * [descr:dxVectorMap.Options.legends.markerTemplate]
         */
        markerTemplate?: DevExpress.core.template | ((legendItem: VectorMapLegendItem, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxVectorMap.Options.legends.source]
         */
        source?: { grouping?: string, layer?: string };
    }
    /**
     * [descr:dxVectorMap.Options.tooltip]
     */
    export interface dxVectorMapTooltip extends BaseWidgetTooltip {
        /**
         * [descr:dxVectorMap.Options.tooltip.contentTemplate]
         */
        contentTemplate?: DevExpress.core.template | ((info: MapLayerElement, element: DevExpress.core.dxElement) => string | Element | JQuery);
        /**
         * [descr:dxVectorMap.Options.tooltip.customizeTooltip]
         */
        customizeTooltip?: ((info: MapLayerElement) => any);
    }
    /**
     * [descr:dxVectorMap]
     */
    export class dxVectorMap extends BaseWidget {
        constructor(element: Element, options?: dxVectorMapOptions)
        constructor(element: JQuery, options?: dxVectorMapOptions)
        /**
         * [descr:dxVectorMap.center()]
         */
        center(): Array<number>;
        /**
         * [descr:dxVectorMap.center(centerCoordinates)]
         */
        center(centerCoordinates: Array<number>): void;
        /**
         * [descr:dxVectorMap.clearSelection()]
         */
        clearSelection(): void;
        /**
         * [descr:dxVectorMap.convertCoordinates(x, y)]
         * @deprecated [depNote:dxVectorMap.convertCoordinates(x, y)]
         */
        convertCoordinates(x: number, y: number): Array<number>;
        /**
         * [descr:dxVectorMap.convertToGeo(x, y)]
         */
        convertToGeo(x: number, y: number): Array<number>;
        /**
         * [descr:dxVectorMap.convertToXY(longitude, latitude)]
         */
        convertToXY(longitude: number, latitude: number): Array<number>;
        /**
         * [descr:dxVectorMap.getLayerByIndex(index)]
         */
        getLayerByIndex(index: number): MapLayer;
        /**
         * [descr:dxVectorMap.getLayerByName(name)]
         */
        getLayerByName(name: string): MapLayer;
        /**
         * [descr:dxVectorMap.getLayers()]
         */
        getLayers(): Array<MapLayer>;
        /**
         * [descr:dxVectorMap.viewport()]
         */
        viewport(): Array<number>;
        /**
         * [descr:dxVectorMap.viewport(viewportCoordinates)]
         */
        viewport(viewportCoordinates: Array<number>): void;
        /**
         * [descr:dxVectorMap.zoomFactor()]
         */
        zoomFactor(): number;
        /**
         * [descr:dxVectorMap.zoomFactor(zoomFactor)]
         */
        zoomFactor(zoomFactor: number): void;
    }
    /**
     * [descr:dxVectorMapAnnotationConfig]
     */
    export interface dxVectorMapAnnotationConfig extends dxVectorMapCommonAnnotationConfig {
        /**
         * [descr:dxVectorMapAnnotationConfig.name]
         */
        name?: string;
    }
    /**
     * [descr:dxVectorMapCommonAnnotationConfig]
     */
    export interface dxVectorMapCommonAnnotationConfig extends BaseWidgetAnnotationConfig {
        /**
         * [descr:dxVectorMapCommonAnnotationConfig.coordinates]
         */
        coordinates?: Array<number>;
        /**
         * [descr:dxVectorMapCommonAnnotationConfig.customizeTooltip]
         */
        customizeTooltip?: ((annotation: dxVectorMapAnnotationConfig | any) => any);
        /**
         * [descr:dxVectorMapCommonAnnotationConfig.template]
         */
        template?: DevExpress.core.template | ((annotation: dxVectorMapAnnotationConfig | any, element: SVGGElement) => string | SVGElement | JQuery);
        /**
         * [descr:dxVectorMapCommonAnnotationConfig.tooltipTemplate]
         */
        tooltipTemplate?: DevExpress.core.template | ((annotation: dxVectorMapAnnotationConfig | any, element: DevExpress.core.dxElement) => string | Element | JQuery);
    }
    /**
     * [descr:linearCircle]
     */
    export type linearCircle = CommonIndicator;
    /**
     * [descr:linearRangeBar]
     */
    export type linearRangeBar = CommonIndicator;
    /**
     * [descr:linearRectangle]
     */
    export type linearRectangle = CommonIndicator;
    /**
     * [descr:linearRhombus]
     */
    export type linearRhombus = CommonIndicator;
    /**
     * [descr:linearTextCloud]
     */
    export type linearTextCloud = CommonIndicator;
    /**
     * [descr:linearTriangleMarker]
     */
    export type linearTriangleMarker = CommonIndicator;
    /**
     * [descr:pieChartSeriesObject]
     */
    export class pieChartSeriesObject extends baseSeriesObject {
    }
    /**
     * [descr:piePointObject]
     */
    export class piePointObject extends basePointObject {
        /**
         * [descr:piePointObject.percent]
         */
        percent?: string | number | Date;
        /**
         * [descr:piePointObject.hide()]
         */
        hide(): void;
        /**
         * [descr:piePointObject.isVisible()]
         */
        isVisible(): boolean;
        /**
         * [descr:piePointObject.show()]
         */
        show(): void;
    }
    /**
     * [descr:polarChartSeriesObject]
     */
    export class polarChartSeriesObject extends baseSeriesObject {
    }
    /**
     * [descr:polarPointObject]
     */
    export class polarPointObject extends basePointObject {
    }
}
declare module DevExpress.viz.map {
    /**
     * [descr:viz.map.projection(data)]
     */
    export function projection(data: VectorMapProjectionConfig): any;
}
declare module DevExpress.viz.map.projection {
    /**
     * [descr:viz.map.projection.add(name, projection)]
     */
    export function add(name: string, projection: VectorMapProjectionConfig | any): void;
    /**
     * [descr:viz.map.projection.get(name)]
     */
    export function get(name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string): any;
}
