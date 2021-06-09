declare global {
  interface JQuery<TElement = HTMLElement> {}
  interface JQuery<TElement = HTMLElement> {
    dxAccordion(): JQuery;
    dxAccordion(options: 'instance'): DevExpress.ui.dxAccordion;
    dxAccordion(options: DevExpress.ui.dxAccordion.Properties): JQuery;
    dxAccordion(options: string): any;
    dxAccordion(options: string, ...params: any[]): any;

    dxActionSheet(): JQuery;
    dxActionSheet(options: 'instance'): DevExpress.ui.dxActionSheet;
    dxActionSheet(options: DevExpress.ui.dxActionSheet.Properties): JQuery;
    dxActionSheet(options: string): any;
    dxActionSheet(options: string, ...params: any[]): any;

    dxAutocomplete(): JQuery;
    dxAutocomplete(options: 'instance'): DevExpress.ui.dxAutocomplete;
    dxAutocomplete(options: DevExpress.ui.dxAutocomplete.Properties): JQuery;
    dxAutocomplete(options: string): any;
    dxAutocomplete(options: string, ...params: any[]): any;

    dxBarGauge(): JQuery;
    dxBarGauge(options: 'instance'): DevExpress.viz.dxBarGauge;
    dxBarGauge(options: DevExpress.viz.dxBarGauge.Properties): JQuery;
    dxBarGauge(options: string): any;
    dxBarGauge(options: string, ...params: any[]): any;

    dxBox(): JQuery;
    dxBox(options: 'instance'): DevExpress.ui.dxBox;
    dxBox(options: DevExpress.ui.dxBox.Properties): JQuery;
    dxBox(options: string): any;
    dxBox(options: string, ...params: any[]): any;

    dxBullet(): JQuery;
    dxBullet(options: 'instance'): DevExpress.viz.dxBullet;
    dxBullet(options: DevExpress.viz.dxBullet.Properties): JQuery;
    dxBullet(options: string): any;
    dxBullet(options: string, ...params: any[]): any;

    dxButton(): JQuery;
    dxButton(options: 'instance'): DevExpress.ui.dxButton;
    dxButton(options: DevExpress.ui.dxButton.Properties): JQuery;
    dxButton(options: string): any;
    dxButton(options: string, ...params: any[]): any;

    dxButtonGroup(): JQuery;
    dxButtonGroup(options: 'instance'): DevExpress.ui.dxButtonGroup;
    dxButtonGroup(options: DevExpress.ui.dxButtonGroup.Properties): JQuery;
    dxButtonGroup(options: string): any;
    dxButtonGroup(options: string, ...params: any[]): any;

    dxCalendar(): JQuery;
    dxCalendar(options: 'instance'): DevExpress.ui.dxCalendar;
    dxCalendar(options: DevExpress.ui.dxCalendar.Properties): JQuery;
    dxCalendar(options: string): any;
    dxCalendar(options: string, ...params: any[]): any;

    dxChart(): JQuery;
    dxChart(options: 'instance'): DevExpress.viz.dxChart;
    dxChart(options: DevExpress.viz.dxChart.Properties): JQuery;
    dxChart(options: string): any;
    dxChart(options: string, ...params: any[]): any;

    dxCheckBox(): JQuery;
    dxCheckBox(options: 'instance'): DevExpress.ui.dxCheckBox;
    dxCheckBox(options: DevExpress.ui.dxCheckBox.Properties): JQuery;
    dxCheckBox(options: string): any;
    dxCheckBox(options: string, ...params: any[]): any;

    dxCircularGauge(): JQuery;
    dxCircularGauge(options: 'instance'): DevExpress.viz.dxCircularGauge;
    dxCircularGauge(options: DevExpress.viz.dxCircularGauge.Properties): JQuery;
    dxCircularGauge(options: string): any;
    dxCircularGauge(options: string, ...params: any[]): any;

    dxColorBox(): JQuery;
    dxColorBox(options: 'instance'): DevExpress.ui.dxColorBox;
    dxColorBox(options: DevExpress.ui.dxColorBox.Properties): JQuery;
    dxColorBox(options: string): any;
    dxColorBox(options: string, ...params: any[]): any;

    dxContextMenu(): JQuery;
    dxContextMenu(options: 'instance'): DevExpress.ui.dxContextMenu;
    dxContextMenu(options: DevExpress.ui.dxContextMenu.Properties): JQuery;
    dxContextMenu(options: string): any;
    dxContextMenu(options: string, ...params: any[]): any;

    dxDataGrid(): JQuery;
    dxDataGrid(options: 'instance'): DevExpress.ui.dxDataGrid;
    dxDataGrid(options: DevExpress.ui.dxDataGrid.Properties): JQuery;
    dxDataGrid(options: string): any;
    dxDataGrid(options: string, ...params: any[]): any;

    dxDateBox(): JQuery;
    dxDateBox(options: 'instance'): DevExpress.ui.dxDateBox;
    dxDateBox(options: DevExpress.ui.dxDateBox.Properties): JQuery;
    dxDateBox(options: string): any;
    dxDateBox(options: string, ...params: any[]): any;

    dxDeferRendering(): JQuery;
    dxDeferRendering(options: 'instance'): DevExpress.ui.dxDeferRendering;
    dxDeferRendering(
      options: DevExpress.ui.dxDeferRendering.Properties
    ): JQuery;
    dxDeferRendering(options: string): any;
    dxDeferRendering(options: string, ...params: any[]): any;

    dxDiagram(): JQuery;
    dxDiagram(options: 'instance'): DevExpress.ui.dxDiagram;
    dxDiagram(options: DevExpress.ui.dxDiagram.Properties): JQuery;
    dxDiagram(options: string): any;
    dxDiagram(options: string, ...params: any[]): any;

    dxDraggable(): JQuery;
    dxDraggable(options: 'instance'): DevExpress.ui.dxDraggable;
    dxDraggable(options: DevExpress.ui.dxDraggable.Properties): JQuery;
    dxDraggable(options: string): any;
    dxDraggable(options: string, ...params: any[]): any;

    dxDrawer(): JQuery;
    dxDrawer(options: 'instance'): DevExpress.ui.dxDrawer;
    dxDrawer(options: DevExpress.ui.dxDrawer.Properties): JQuery;
    dxDrawer(options: string): any;
    dxDrawer(options: string, ...params: any[]): any;

    dxDropDownBox(): JQuery;
    dxDropDownBox(options: 'instance'): DevExpress.ui.dxDropDownBox;
    dxDropDownBox(options: DevExpress.ui.dxDropDownBox.Properties): JQuery;
    dxDropDownBox(options: string): any;
    dxDropDownBox(options: string, ...params: any[]): any;

    dxDropDownButton(): JQuery;
    dxDropDownButton(options: 'instance'): DevExpress.ui.dxDropDownButton;
    dxDropDownButton(
      options: DevExpress.ui.dxDropDownButton.Properties
    ): JQuery;
    dxDropDownButton(options: string): any;
    dxDropDownButton(options: string, ...params: any[]): any;

    dxFileManager(): JQuery;
    dxFileManager(options: 'instance'): DevExpress.ui.dxFileManager;
    dxFileManager(options: DevExpress.ui.dxFileManager.Properties): JQuery;
    dxFileManager(options: string): any;
    dxFileManager(options: string, ...params: any[]): any;

    dxFileUploader(): JQuery;
    dxFileUploader(options: 'instance'): DevExpress.ui.dxFileUploader;
    dxFileUploader(options: DevExpress.ui.dxFileUploader.Properties): JQuery;
    dxFileUploader(options: string): any;
    dxFileUploader(options: string, ...params: any[]): any;

    dxFilterBuilder(): JQuery;
    dxFilterBuilder(options: 'instance'): DevExpress.ui.dxFilterBuilder;
    dxFilterBuilder(options: DevExpress.ui.dxFilterBuilder.Properties): JQuery;
    dxFilterBuilder(options: string): any;
    dxFilterBuilder(options: string, ...params: any[]): any;

    dxForm(): JQuery;
    dxForm(options: 'instance'): DevExpress.ui.dxForm;
    dxForm(options: DevExpress.ui.dxForm.Properties): JQuery;
    dxForm(options: string): any;
    dxForm(options: string, ...params: any[]): any;

    dxFunnel(): JQuery;
    dxFunnel(options: 'instance'): DevExpress.viz.dxFunnel;
    dxFunnel(options: DevExpress.viz.dxFunnel.Properties): JQuery;
    dxFunnel(options: string): any;
    dxFunnel(options: string, ...params: any[]): any;

    dxGallery(): JQuery;
    dxGallery(options: 'instance'): DevExpress.ui.dxGallery;
    dxGallery(options: DevExpress.ui.dxGallery.Properties): JQuery;
    dxGallery(options: string): any;
    dxGallery(options: string, ...params: any[]): any;

    dxGantt(): JQuery;
    dxGantt(options: 'instance'): DevExpress.ui.dxGantt;
    dxGantt(options: DevExpress.ui.dxGantt.Properties): JQuery;
    dxGantt(options: string): any;
    dxGantt(options: string, ...params: any[]): any;

    dxHtmlEditor(): JQuery;
    dxHtmlEditor(options: 'instance'): DevExpress.ui.dxHtmlEditor;
    dxHtmlEditor(options: DevExpress.ui.dxHtmlEditor.Properties): JQuery;
    dxHtmlEditor(options: string): any;
    dxHtmlEditor(options: string, ...params: any[]): any;

    dxLinearGauge(): JQuery;
    dxLinearGauge(options: 'instance'): DevExpress.viz.dxLinearGauge;
    dxLinearGauge(options: DevExpress.viz.dxLinearGauge.Properties): JQuery;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;

    dxList(): JQuery;
    dxList(options: 'instance'): DevExpress.ui.dxList;
    dxList(options: DevExpress.ui.dxList.Properties): JQuery;
    dxList(options: string): any;
    dxList(options: string, ...params: any[]): any;

    dxLoadIndicator(): JQuery;
    dxLoadIndicator(options: 'instance'): DevExpress.ui.dxLoadIndicator;
    dxLoadIndicator(options: DevExpress.ui.dxLoadIndicator.Properties): JQuery;
    dxLoadIndicator(options: string): any;
    dxLoadIndicator(options: string, ...params: any[]): any;

    dxLoadPanel(): JQuery;
    dxLoadPanel(options: 'instance'): DevExpress.ui.dxLoadPanel;
    dxLoadPanel(options: DevExpress.ui.dxLoadPanel.Properties): JQuery;
    dxLoadPanel(options: string): any;
    dxLoadPanel(options: string, ...params: any[]): any;

    dxLookup(): JQuery;
    dxLookup(options: 'instance'): DevExpress.ui.dxLookup;
    dxLookup(options: DevExpress.ui.dxLookup.Properties): JQuery;
    dxLookup(options: string): any;
    dxLookup(options: string, ...params: any[]): any;

    dxMap(): JQuery;
    dxMap(options: 'instance'): DevExpress.ui.dxMap;
    dxMap(options: DevExpress.ui.dxMap.Properties): JQuery;
    dxMap(options: string): any;
    dxMap(options: string, ...params: any[]): any;

    dxMenu(): JQuery;
    dxMenu(options: 'instance'): DevExpress.ui.dxMenu;
    dxMenu(options: DevExpress.ui.dxMenu.Properties): JQuery;
    dxMenu(options: string): any;
    dxMenu(options: string, ...params: any[]): any;

    dxMultiView(): JQuery;
    dxMultiView(options: 'instance'): DevExpress.ui.dxMultiView;
    dxMultiView(options: DevExpress.ui.dxMultiView.Properties): JQuery;
    dxMultiView(options: string): any;
    dxMultiView(options: string, ...params: any[]): any;

    dxNavBar(): JQuery;
    dxNavBar(options: 'instance'): DevExpress.ui.dxNavBar;
    dxNavBar(options: DevExpress.ui.dxNavBar.Properties): JQuery;
    dxNavBar(options: string): any;
    dxNavBar(options: string, ...params: any[]): any;

    dxNumberBox(): JQuery;
    dxNumberBox(options: 'instance'): DevExpress.ui.dxNumberBox;
    dxNumberBox(options: DevExpress.ui.dxNumberBox.Properties): JQuery;
    dxNumberBox(options: string): any;
    dxNumberBox(options: string, ...params: any[]): any;

    dxPieChart(): JQuery;
    dxPieChart(options: 'instance'): DevExpress.viz.dxPieChart;
    dxPieChart(options: DevExpress.viz.dxPieChart.Properties): JQuery;
    dxPieChart(options: string): any;
    dxPieChart(options: string, ...params: any[]): any;

    dxPivotGrid(): JQuery;
    dxPivotGrid(options: 'instance'): DevExpress.ui.dxPivotGrid;
    dxPivotGrid(options: DevExpress.ui.dxPivotGrid.Properties): JQuery;
    dxPivotGrid(options: string): any;
    dxPivotGrid(options: string, ...params: any[]): any;

    dxPivotGridFieldChooser(): JQuery;
    dxPivotGridFieldChooser(
      options: 'instance'
    ): DevExpress.ui.dxPivotGridFieldChooser;
    dxPivotGridFieldChooser(
      options: DevExpress.ui.dxPivotGridFieldChooser.Properties
    ): JQuery;
    dxPivotGridFieldChooser(options: string): any;
    dxPivotGridFieldChooser(options: string, ...params: any[]): any;

    dxPolarChart(): JQuery;
    dxPolarChart(options: 'instance'): DevExpress.viz.dxPolarChart;
    dxPolarChart(options: DevExpress.viz.dxPolarChart.Properties): JQuery;
    dxPolarChart(options: string): any;
    dxPolarChart(options: string, ...params: any[]): any;

    dxPopover(): JQuery;
    dxPopover(options: 'instance'): DevExpress.ui.dxPopover;
    dxPopover(options: DevExpress.ui.dxPopover.Properties): JQuery;
    dxPopover(options: string): any;
    dxPopover(options: string, ...params: any[]): any;

    dxPopup(): JQuery;
    dxPopup(options: 'instance'): DevExpress.ui.dxPopup;
    dxPopup(options: DevExpress.ui.dxPopup.Properties): JQuery;
    dxPopup(options: string): any;
    dxPopup(options: string, ...params: any[]): any;

    dxProgressBar(): JQuery;
    dxProgressBar(options: 'instance'): DevExpress.ui.dxProgressBar;
    dxProgressBar(options: DevExpress.ui.dxProgressBar.Properties): JQuery;
    dxProgressBar(options: string): any;
    dxProgressBar(options: string, ...params: any[]): any;

    dxRadioGroup(): JQuery;
    dxRadioGroup(options: 'instance'): DevExpress.ui.dxRadioGroup;
    dxRadioGroup(options: DevExpress.ui.dxRadioGroup.Properties): JQuery;
    dxRadioGroup(options: string): any;
    dxRadioGroup(options: string, ...params: any[]): any;

    dxRangeSelector(): JQuery;
    dxRangeSelector(options: 'instance'): DevExpress.viz.dxRangeSelector;
    dxRangeSelector(options: DevExpress.viz.dxRangeSelector.Properties): JQuery;
    dxRangeSelector(options: string): any;
    dxRangeSelector(options: string, ...params: any[]): any;

    dxRangeSlider(): JQuery;
    dxRangeSlider(options: 'instance'): DevExpress.ui.dxRangeSlider;
    dxRangeSlider(options: DevExpress.ui.dxRangeSlider.Properties): JQuery;
    dxRangeSlider(options: string): any;
    dxRangeSlider(options: string, ...params: any[]): any;

    dxRecurrenceEditor(): JQuery;
    dxRecurrenceEditor(options: 'instance'): DevExpress.ui.dxRecurrenceEditor;
    dxRecurrenceEditor(
      options: DevExpress.ui.dxRecurrenceEditor.Properties
    ): JQuery;
    dxRecurrenceEditor(options: string): any;
    dxRecurrenceEditor(options: string, ...params: any[]): any;

    dxResizable(): JQuery;
    dxResizable(options: 'instance'): DevExpress.ui.dxResizable;
    dxResizable(options: DevExpress.ui.dxResizable.Properties): JQuery;
    dxResizable(options: string): any;
    dxResizable(options: string, ...params: any[]): any;

    dxResponsiveBox(): JQuery;
    dxResponsiveBox(options: 'instance'): DevExpress.ui.dxResponsiveBox;
    dxResponsiveBox(options: DevExpress.ui.dxResponsiveBox.Properties): JQuery;
    dxResponsiveBox(options: string): any;
    dxResponsiveBox(options: string, ...params: any[]): any;

    dxSankey(): JQuery;
    dxSankey(options: 'instance'): DevExpress.viz.dxSankey;
    dxSankey(options: DevExpress.viz.dxSankey.Properties): JQuery;
    dxSankey(options: string): any;
    dxSankey(options: string, ...params: any[]): any;

    dxScheduler(): JQuery;
    dxScheduler(options: 'instance'): DevExpress.ui.dxScheduler;
    dxScheduler(options: DevExpress.ui.dxScheduler.Properties): JQuery;
    dxScheduler(options: string): any;
    dxScheduler(options: string, ...params: any[]): any;

    dxScrollView(): JQuery;
    dxScrollView(options: 'instance'): DevExpress.ui.dxScrollView;
    dxScrollView(options: DevExpress.ui.dxScrollView.Properties): JQuery;
    dxScrollView(options: string): any;
    dxScrollView(options: string, ...params: any[]): any;

    dxSelectBox(): JQuery;
    dxSelectBox(options: 'instance'): DevExpress.ui.dxSelectBox;
    dxSelectBox(options: DevExpress.ui.dxSelectBox.Properties): JQuery;
    dxSelectBox(options: string): any;
    dxSelectBox(options: string, ...params: any[]): any;

    dxSlideOut(): JQuery;
    dxSlideOut(options: 'instance'): DevExpress.ui.dxSlideOut;
    dxSlideOut(options: DevExpress.ui.dxSlideOut.Properties): JQuery;
    dxSlideOut(options: string): any;
    dxSlideOut(options: string, ...params: any[]): any;

    dxSlideOutView(): JQuery;
    dxSlideOutView(options: 'instance'): DevExpress.ui.dxSlideOutView;
    dxSlideOutView(options: DevExpress.ui.dxSlideOutView.Properties): JQuery;
    dxSlideOutView(options: string): any;
    dxSlideOutView(options: string, ...params: any[]): any;

    dxSlider(): JQuery;
    dxSlider(options: 'instance'): DevExpress.ui.dxSlider;
    dxSlider(options: DevExpress.ui.dxSlider.Properties): JQuery;
    dxSlider(options: string): any;
    dxSlider(options: string, ...params: any[]): any;

    dxSortable(): JQuery;
    dxSortable(options: 'instance'): DevExpress.ui.dxSortable;
    dxSortable(options: DevExpress.ui.dxSortable.Properties): JQuery;
    dxSortable(options: string): any;
    dxSortable(options: string, ...params: any[]): any;

    dxSparkline(): JQuery;
    dxSparkline(options: 'instance'): DevExpress.viz.dxSparkline;
    dxSparkline(options: DevExpress.viz.dxSparkline.Properties): JQuery;
    dxSparkline(options: string): any;
    dxSparkline(options: string, ...params: any[]): any;

    dxSpeedDialAction(): JQuery;
    dxSpeedDialAction(options: 'instance'): DevExpress.ui.dxSpeedDialAction;
    dxSpeedDialAction(
      options: DevExpress.ui.dxSpeedDialAction.Properties
    ): JQuery;
    dxSpeedDialAction(options: string): any;
    dxSpeedDialAction(options: string, ...params: any[]): any;

    dxSwitch(): JQuery;
    dxSwitch(options: 'instance'): DevExpress.ui.dxSwitch;
    dxSwitch(options: DevExpress.ui.dxSwitch.Properties): JQuery;
    dxSwitch(options: string): any;
    dxSwitch(options: string, ...params: any[]): any;

    dxTabPanel(): JQuery;
    dxTabPanel(options: 'instance'): DevExpress.ui.dxTabPanel;
    dxTabPanel(options: DevExpress.ui.dxTabPanel.Properties): JQuery;
    dxTabPanel(options: string): any;
    dxTabPanel(options: string, ...params: any[]): any;

    dxTabs(): JQuery;
    dxTabs(options: 'instance'): DevExpress.ui.dxTabs;
    dxTabs(options: DevExpress.ui.dxTabs.Properties): JQuery;
    dxTabs(options: string): any;
    dxTabs(options: string, ...params: any[]): any;

    dxTagBox(): JQuery;
    dxTagBox(options: 'instance'): DevExpress.ui.dxTagBox;
    dxTagBox(options: DevExpress.ui.dxTagBox.Properties): JQuery;
    dxTagBox(options: string): any;
    dxTagBox(options: string, ...params: any[]): any;

    dxTextArea(): JQuery;
    dxTextArea(options: 'instance'): DevExpress.ui.dxTextArea;
    dxTextArea(options: DevExpress.ui.dxTextArea.Properties): JQuery;
    dxTextArea(options: string): any;
    dxTextArea(options: string, ...params: any[]): any;

    dxTextBox(): JQuery;
    dxTextBox(options: 'instance'): DevExpress.ui.dxTextBox;
    dxTextBox(options: DevExpress.ui.dxTextBox.Properties): JQuery;
    dxTextBox(options: string): any;
    dxTextBox(options: string, ...params: any[]): any;

    dxTileView(): JQuery;
    dxTileView(options: 'instance'): DevExpress.ui.dxTileView;
    dxTileView(options: DevExpress.ui.dxTileView.Properties): JQuery;
    dxTileView(options: string): any;
    dxTileView(options: string, ...params: any[]): any;

    dxToast(): JQuery;
    dxToast(options: 'instance'): DevExpress.ui.dxToast;
    dxToast(options: DevExpress.ui.dxToast.Properties): JQuery;
    dxToast(options: string): any;
    dxToast(options: string, ...params: any[]): any;

    dxToolbar(): JQuery;
    dxToolbar(options: 'instance'): DevExpress.ui.dxToolbar;
    dxToolbar(options: DevExpress.ui.dxToolbar.Properties): JQuery;
    dxToolbar(options: string): any;
    dxToolbar(options: string, ...params: any[]): any;

    dxTooltip(): JQuery;
    dxTooltip(options: 'instance'): DevExpress.ui.dxTooltip;
    dxTooltip(options: DevExpress.ui.dxTooltip.Properties): JQuery;
    dxTooltip(options: string): any;
    dxTooltip(options: string, ...params: any[]): any;

    dxTreeList(): JQuery;
    dxTreeList(options: 'instance'): DevExpress.ui.dxTreeList;
    dxTreeList(options: DevExpress.ui.dxTreeList.Properties): JQuery;
    dxTreeList(options: string): any;
    dxTreeList(options: string, ...params: any[]): any;

    dxTreeMap(): JQuery;
    dxTreeMap(options: 'instance'): DevExpress.viz.dxTreeMap;
    dxTreeMap(options: DevExpress.viz.dxTreeMap.Properties): JQuery;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;

    dxTreeView(): JQuery;
    dxTreeView(options: 'instance'): DevExpress.ui.dxTreeView;
    dxTreeView(options: DevExpress.ui.dxTreeView.Properties): JQuery;
    dxTreeView(options: string): any;
    dxTreeView(options: string, ...params: any[]): any;

    dxValidationGroup(): JQuery;
    dxValidationGroup(options: 'instance'): DevExpress.ui.dxValidationGroup;
    dxValidationGroup(
      options: DevExpress.ui.dxValidationGroup.Properties
    ): JQuery;
    dxValidationGroup(options: string): any;
    dxValidationGroup(options: string, ...params: any[]): any;

    dxValidationMessage(): JQuery;
    dxValidationMessage(options: 'instance'): DevExpress.ui.dxValidationMessage;
    dxValidationMessage(
      options: DevExpress.ui.dxValidationMessage.Properties
    ): JQuery;
    dxValidationMessage(options: string): any;
    dxValidationMessage(options: string, ...params: any[]): any;

    dxValidationSummary(): JQuery;
    dxValidationSummary(options: 'instance'): DevExpress.ui.dxValidationSummary;
    dxValidationSummary(
      options: DevExpress.ui.dxValidationSummary.Properties
    ): JQuery;
    dxValidationSummary(options: string): any;
    dxValidationSummary(options: string, ...params: any[]): any;

    dxValidator(): JQuery;
    dxValidator(options: 'instance'): DevExpress.ui.dxValidator;
    dxValidator(options: DevExpress.ui.dxValidator.Properties): JQuery;
    dxValidator(options: string): any;
    dxValidator(options: string, ...params: any[]): any;

    dxVectorMap(): JQuery;
    dxVectorMap(options: 'instance'): DevExpress.viz.dxVectorMap;
    dxVectorMap(options: DevExpress.viz.dxVectorMap.Properties): JQuery;
    dxVectorMap(options: string): any;
    dxVectorMap(options: string, ...params: any[]): any;
  }
  interface JQueryEventObject {}
  interface JQueryPromise<T> {}
}
declare module DevExpress {
  /**
   * [descr:fx]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export const fx: {
    /**
     * [descr:fx.animate(element, config)]
     */
    animate(
      element: Element,
      config: animationConfig
    ): DevExpress.core.utils.DxPromise<void>;

    /**
     * [descr:fx.isAnimating(element)]
     */
    isAnimating(element: Element): boolean;

    /**
     * [descr:fx.stop(element, jumpToEnd)]
     */
    stop(element: Element, jumpToEnd: boolean): void;
  };
  /**
    * [descr:devices]
    * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
    */
   export const devices: DevicesObject;
  /**
   * [descr:animationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface animationConfig {
    /**
     * [descr:animationConfig.complete]
     */
    complete?: ($element: DevExpress.core.DxElement, config: any) => void;
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
    start?: ($element: DevExpress.core.DxElement, config: any) => void;
    /**
     * [descr:animationConfig.to]
     */
    to?: number | string | any;
    /**
     * [descr:animationConfig.type]
     */
    type?:
      | 'css'
      | 'fade'
      | 'fadeIn'
      | 'fadeOut'
      | 'pop'
      | 'slide'
      | 'slideIn'
      | 'slideOut';
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
    registerPreset(
      name: string,
      config: { animation?: animationConfig; device?: Device }
    ): void;
    /**
     * [descr:animationPresets.resetToDefaults()]
     */
    resetToDefaults(): void;
  }
  /**
   * [descr:Component]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class Component<TProperties> {
    constructor(options?: TProperties);
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
    option(): TProperties;
    /**
     * [descr:Component.option(optionName)]
     */
    option<TPropertyName extends string>(
      optionName: TPropertyName
    ): TPropertyName extends keyof TProperties
      ? TProperties[TPropertyName]
      : unknown;
    /**
     * [descr:Component.option(optionName, optionValue)]
     */
    option<TPropertyName extends string>(
      optionName: TPropertyName,
      optionValue: TPropertyName extends keyof TProperties
        ? TProperties[TPropertyName]
        : unknown
    ): void;
    /**
     * [descr:Component.option(options)]
     */
    option(options: Partial<TProperties>): void;
    /**
     * [descr:Component.resetOption(optionName)]
     */
    resetOption(optionName: string): void;

    _options: { silent(path: any, value: any): void };
    _createActionByOption(optionName: string, config: object): Function;
    _dispose(): void;
    _getDefaultOptions(): object;
    _init(): void;
    _initializeComponent(): void;
    _optionChanging(name: string, value: unknown, prevValue: unknown): void;
    _optionChanged(args: { name: string; value: unknown }): void;
    _setOptionsByReference(): void;
    _optionsByReference: object;
    _setDeprecatedOptions(): void;
    _deprecatedOptions: object;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ComponentOptions<TComponent> {
    /**
     * [descr:ComponentOptions.onDisposing]
     */
    onDisposing?: (e: { component: TComponent }) => void;
    /**
     * [descr:ComponentOptions.onInitialized]
     */
    onInitialized?: (e: {
      component?: TComponent;
      element?: DevExpress.core.DxElement;
    }) => void;
    /**
     * [descr:ComponentOptions.onOptionChanged]
     */
    onOptionChanged?: (e: {
      component?: TComponent;
      name?: string;
      fullName?: string;
      value?: any;
    }) => void;
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
   * [descr:DataHelperMixin]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class DataHelperMixin {
    /**
     * [descr:DataHelperMixin.getDataSource()]
     */
    getDataSource(): DevExpress.data.DataSource;
  }
  /**
   * [descr:Device]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    isSimulator(): boolean;
  }
  /**
   * [descr:DOMComponent]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class DOMComponent<
    TProperties = DevExpress.DOMComponent.Properties
  > extends Component<TProperties> {
    constructor(
      element: DevExpress.core.UserDefinedElement,
      options?: TProperties
    );
    /**
     * [descr:DOMComponent.defaultOptions(rule)]
     */
    static defaultOptions(rule: {
      device?: Device | Array<Device> | Function;
      options?: any;
    }): void;
    /**
     * [descr:DOMComponent.dispose()]
     */
    dispose(): void;
    /**
     * [descr:DOMComponent.element()]
     */
    element(): DevExpress.core.DxElement;
    /**
     * [descr:DOMComponent.getInstance(element)]
     */
    static getInstance(
      element: DevExpress.core.UserDefinedElement
    ): DOMComponent<DevExpress.DOMComponent.Properties>;

    $element(): DevExpress.core.UserDefinedElement;
    _getTemplate(template: unknown): DevExpress.core.FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _templateManager: DevExpress.core.TemplateManager;
  }
  module DOMComponent {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    type Properties = DOMComponentOptions<DOMComponent<Properties>>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DOMComponentOptions<TComponent>
    extends ComponentOptions<TComponent> {
    /**
     * [descr:DOMComponentOptions.bindingOptions]
     */
    bindingOptions?: any;
    /**
     * [descr:DOMComponentOptions.elementAttr]
     */
    elementAttr?: any;
    /**
     * [descr:DOMComponentOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:DOMComponentOptions.onDisposing]
     */
    onDisposing?: (e: {
      component?: TComponent;
      element?: DevExpress.core.DxElement;
      model?: any;
    }) => void;
    /**
     * [descr:DOMComponentOptions.onOptionChanged]
     */
    onOptionChanged?: (e: {
      component?: TComponent;
      element?: DevExpress.core.DxElement;
      model?: any;
      name?: string;
      fullName?: string;
      value?: any;
    }) => void;
    /**
     * [descr:DOMComponentOptions.rtlEnabled]
     */
    rtlEnabled?: boolean;
    /**
     * [descr:DOMComponentOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxSchedulerTimeZone]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * [descr:ExportLoadPanel]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ExportLoadPanel {
    /**
     * [descr:ExportLoadPanel.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:ExportLoadPanel.text]
     */
    text?: string;
    /**
     * [descr:ExportLoadPanel.width]
     */
    width?: number;
    /**
     * [descr:ExportLoadPanel.height]
     */
    height?: number;
    /**
     * [descr:ExportLoadPanel.showIndicator]
     */
    showIndicator?: boolean;
    /**
     * [descr:ExportLoadPanel.indicatorSrc]
     */
    indicatorSrc?: string;
    /**
     * [descr:ExportLoadPanel.showPane]
     */
    showPane?: boolean;
    /**
     * [descr:ExportLoadPanel.shading]
     */
    shading?: boolean;
    /**
     * [descr:ExportLoadPanel.shadingColor]
     */
    shadingColor?: string;
  }
  /**
   * [descr:globalConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    floatingActionButtonConfig?: {
      /**
       * [descr:globalConfig.floatingActionButtonConfig.closeIcon]
       */
      closeIcon?: string;
      /**
       * [descr:globalConfig.floatingActionButtonConfig.direction]
       */
      direction?: 'auto' | 'up' | 'down';
      /**
       * [descr:globalConfig.floatingActionButtonConfig.icon]
       */
      icon?: string;
      /**
       * [descr:globalConfig.floatingActionButtonConfig.label]
       */
      label?: string;
      /**
       * [descr:globalConfig.floatingActionButtonConfig.maxSpeedDialActionCount]
       */
      maxSpeedDialActionCount?: number;
      /**
       * [descr:globalConfig.floatingActionButtonConfig.position]
       */
      position?:
        | 'bottom'
        | 'center'
        | 'left'
        | 'left bottom'
        | 'left top'
        | 'right'
        | 'right bottom'
        | 'right top'
        | 'top'
        | positionConfig
        | Function;
      /**
       * [descr:globalConfig.floatingActionButtonConfig.shading]
       */
      shading?: boolean;
    };
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
   * [descr:positionConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface positionConfig {
    /**
     * [descr:positionConfig.at]
     */
    at?:
      | 'bottom'
      | 'center'
      | 'left'
      | 'left bottom'
      | 'left top'
      | 'right'
      | 'right bottom'
      | 'right top'
      | 'top'
      | {
          /**
           * [descr:positionConfig.at.x]
           */
          x?: 'center' | 'left' | 'right';
          /**
           * [descr:positionConfig.at.y]
           */
          y?: 'bottom' | 'center' | 'top';
        };
    /**
     * [descr:positionConfig.boundary]
     */
    boundary?: string | DevExpress.core.UserDefinedElement | Window;
    /**
     * [descr:positionConfig.boundaryOffset]
     */
    boundaryOffset?:
      | string
      | {
          /**
           * [descr:positionConfig.boundaryOffset.x]
           */
          x?: number;
          /**
           * [descr:positionConfig.boundaryOffset.y]
           */
          y?: number;
        };
    /**
     * [descr:positionConfig.collision]
     */
    collision?:
      | 'fit'
      | 'fit flip'
      | 'fit flipfit'
      | 'fit none'
      | 'flip'
      | 'flip fit'
      | 'flip none'
      | 'flipfit'
      | 'flipfit fit'
      | 'flipfit none'
      | 'none'
      | 'none fit'
      | 'none flip'
      | 'none flipfit'
      | {
          /**
           * [descr:positionConfig.collision.x]
           */
          x?: 'fit' | 'flip' | 'flipfit' | 'none';
          /**
           * [descr:positionConfig.collision.y]
           */
          y?: 'fit' | 'flip' | 'flipfit' | 'none';
        };
    /**
     * [descr:positionConfig.my]
     */
    my?:
      | 'bottom'
      | 'center'
      | 'left'
      | 'left bottom'
      | 'left top'
      | 'right'
      | 'right bottom'
      | 'right top'
      | 'top'
      | {
          /**
           * [descr:positionConfig.my.x]
           */
          x?: 'center' | 'left' | 'right';
          /**
           * [descr:positionConfig.my.y]
           */
          y?: 'bottom' | 'center' | 'top';
        };
    /**
     * [descr:positionConfig.of]
     */
    of?: string | DevExpress.core.UserDefinedElement | Window;
    /**
     * [descr:positionConfig.offset]
     */
    offset?:
      | string
      | {
          /**
           * [descr:positionConfig.offset.x]
           */
          x?: number;
          /**
           * [descr:positionConfig.offset.y]
           */
          y?: number;
        };
  }
  /**
   * [descr:registerComponent(name, componentClass)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export function registerComponent(name: string, componentClass: any): void;
  /**
   * [descr:registerComponent(name, namespace, componentClass)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export function registerComponent(
    name: string,
    namespace: any,
    componentClass: any
  ): void;
  /**
   * [descr:setTemplateEngine(name)]
   */
  export function setTemplateEngine(templateEngineName: string): void;
  /**
   * [descr:setTemplateEngine(options)]
   */
  export function setTemplateEngine(templateEngineOptions: {
    compile?: Function;
    render?: Function;
  }): void;
  /**
   * [descr:TransitionExecutor]
   */
  export class TransitionExecutor {
    /**
     * [descr:TransitionExecutor.enter(elements, animation)]
     */
    enter(
      elements: DevExpress.core.UserDefinedElementsArray,
      animation: animationConfig | string
    ): void;
    /**
     * [descr:TransitionExecutor.leave(elements, animation)]
     */
    leave(
      elements: DevExpress.core.UserDefinedElementsArray,
      animation: animationConfig | string
    ): void;
    /**
     * [descr:TransitionExecutor.reset()]
     */
    reset(): void;
    /**
     * [descr:TransitionExecutor.start()]
     */
    start(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:TransitionExecutor.stop()]
     */
    stop(): void;
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
    static validateGroup(
      group: string | any
    ): DevExpress.ui.dxValidationGroupResult;
    /**
     * [descr:validationEngine.validateModel(model)]
     */
    static validateModel(model: any): any;
  }
}
declare module DevExpress.core {
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface Condition {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  interface Condition extends JQueryEventObject {}
  /**
   * [descr:dxElement]
   * @deprecated [depNote:dxElement]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type dxElement = DxElement<HTMLElement>;
  /**
   * [descr:DxElement]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type DxElement<T extends Element = HTMLElement> = {} extends Condition
    ? T
    : ElementWrapper<T>;
  /**
   * [descr:dxSVGElement]
   * @deprecated [depNote:dxSVGElement]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type dxSVGElement = DxElement<SVGElement>;
  /**
   * [descr:dxTemplate]
   */
  export type dxTemplate = Template;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTemplateOptions {
    /**
     * [descr:dxTemplateOptions.name]
     */
    name?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ElementsArrayWrapper<T extends Element> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  interface ElementsArrayWrapper<T extends Element> extends JQuery<T> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ElementWrapper<T extends Element> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  interface ElementWrapper<T extends Element> extends JQuery<T> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class FunctionTemplate {
    render(template: {
      container: unknown;
      model?: object;
      transclude?: boolean;
    }): DxElement;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PromiseType<T> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  interface PromiseType<T> extends JQueryPromise<T> {}
  /**
   * [descr:template]
   */
  export type template = string | Function | UserDefinedElement;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class Template {
    constructor(options?: dxTemplateOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class TemplateManager {
    anonymousTemplateName: string;
    addDefaultTemplates(templates: Record<string, unknown>): void;
  }
  /**
   * [descr:UserDefinedElement]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type UserDefinedElement<T extends Element = Element> =
    {} extends Condition ? T : ElementWrapper<T> | T;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type UserDefinedElementsArray = {} extends Condition
    ? Array<Element>
    : ElementsArrayWrapper<Element>;
}
declare module DevExpress.core.utils {
  /**
   * [descr:DxPromise]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type DxPromise<T = void> = {} extends PromiseType<T>
    ? Promise<T>
    : PromiseType<T>;
}
declare module DevExpress.data {
  /**
   * [descr:Utils.applyChanges(data, changes, options)]
   */
  export function applyChanges(
    data: Array<any>,
    changes: Array<any>,
    options?: { keyExpr?: string | Array<string>; immutable?: boolean }
  ): Array<any>;
  /**
   * [descr:ArrayStore]
   */
  export class ArrayStore extends Store {
    constructor(options?: ArrayStoreOptions);
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
    /**
     * [descr:ArrayStoreOptions.data]
     */
    data?: Array<any>;
  }
  /**
   * [descr:Utils.base64_encode(input)]
   */
  export function base64_encode(input: string | Array<number>): string;
  /**
   * [descr:CustomStore]
   */
  export class CustomStore extends Store {
    constructor(options?: CustomStoreOptions);
    /**
     * [descr:CustomStore.clearRawDataCache()]
     */
    clearRawDataCache(): void;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface CustomStoreOptions extends StoreOptions<CustomStore> {
    /**
     * [descr:CustomStoreOptions.byKey]
     */
    byKey?: (key: any | string | number) => PromiseLike<any>;
    /**
     * [descr:CustomStoreOptions.cacheRawData]
     */
    cacheRawData?: boolean;
    /**
     * [descr:CustomStoreOptions.insert]
     */
    insert?: (values: any) => PromiseLike<any>;
    /**
     * [descr:CustomStoreOptions.load]
     */
    load?: (options: LoadOptions) => PromiseLike<any> | Array<any>;
    /**
     * [descr:CustomStoreOptions.loadMode]
     */
    loadMode?: 'processed' | 'raw';
    /**
     * [descr:CustomStoreOptions.remove]
     */
    remove?: (key: any | string | number) => PromiseLike<void>;
    /**
     * [descr:CustomStoreOptions.totalCount]
     */
    totalCount?: (loadOptions: {
      filter?: any;
      group?: any;
    }) => PromiseLike<number>;
    /**
     * [descr:CustomStoreOptions.update]
     */
    update?: (key: any | string | number, values: any) => PromiseLike<any>;
    /**
     * [descr:CustomStoreOptions.useDefaultSearch]
     */
    useDefaultSearch?: boolean;
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
    load(): DevExpress.core.utils.DxPromise<any>;
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
    reload(): DevExpress.core.utils.DxPromise<any>;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DataSourceOptions {
    /**
     * [descr:DataSourceOptions.customQueryParams]
     */
    customQueryParams?: any;
    /**
     * [descr:DataSourceOptions.expand]
     */
    expand?: Array<string> | string;
    /**
     * [descr:DataSourceOptions.filter]
     */
    filter?: string | Array<any> | Function;
    /**
     * [descr:DataSourceOptions.group]
     */
    group?: string | Array<any> | Function;
    /**
     * [descr:DataSourceOptions.map]
     */
    map?: (dataItem: any) => any;
    /**
     * [descr:DataSourceOptions.onChanged]
     */
    onChanged?: (e: { changes?: Array<any> }) => void;
    /**
     * [descr:DataSourceOptions.onLoadError]
     */
    onLoadError?: (error: { message?: string }) => void;
    /**
     * [descr:DataSourceOptions.onLoadingChanged]
     */
    onLoadingChanged?: (isLoading: boolean) => void;
    /**
     * [descr:DataSourceOptions.pageSize]
     */
    pageSize?: number;
    /**
     * [descr:DataSourceOptions.paginate]
     */
    paginate?: boolean;
    /**
     * [descr:DataSourceOptions.postProcess]
     */
    postProcess?: (data: Array<any>) => Array<any>;
    /**
     * [descr:DataSourceOptions.pushAggregationTimeout]
     */
    pushAggregationTimeout?: number;
    /**
     * [descr:DataSourceOptions.requireTotalCount]
     */
    requireTotalCount?: boolean;
    /**
     * [descr:DataSourceOptions.reshapeOnPush]
     */
    reshapeOnPush?: boolean;
    /**
     * [descr:DataSourceOptions.searchExpr]
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * [descr:DataSourceOptions.searchOperation]
     */
    searchOperation?: string;
    /**
     * [descr:DataSourceOptions.searchValue]
     */
    searchValue?: any;
    /**
     * [descr:DataSourceOptions.select]
     */
    select?: string | Array<any> | Function;
    /**
     * [descr:DataSourceOptions.sort]
     */
    sort?: string | Array<any> | Function;
    /**
     * [descr:DataSourceOptions.store]
     */
    store?: Store | StoreOptions | Array<any> | any;
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
   * [descr:Utils.errorHandler]
   * @deprecated [depNote:Utils.errorHandler]
   */
  export function errorHandler(e: Error): void;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * [descr:LocalStore]
   */
  export class LocalStore extends ArrayStore {
    constructor(options?: LocalStoreOptions);
    /**
     * [descr:LocalStore.clear()]
     */
    clear(): void;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
    /**
     * [descr:LocalStoreOptions.flushInterval]
     */
    flushInterval?: number;
    /**
     * [descr:LocalStoreOptions.immediate]
     */
    immediate?: boolean;
    /**
     * [descr:LocalStoreOptions.name]
     */
    name?: string;
  }
  /**
   * [descr:ODataContext]
   */
  export class ODataContext {
    constructor(options?: ODataContextOptions);
    /**
     * [descr:ODataContext.get(operationName, params)]
     */
    get(
      operationName: string,
      params: any
    ): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:ODataContext.invoke(operationName, params, httpMethod)]
     */
    invoke(
      operationName: string,
      params: any,
      httpMethod: any
    ): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:ODataContext.objectLink(entityAlias, key)]
     */
    objectLink(entityAlias: string, key: any | string | number): any;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ODataContextOptions {
    /**
     * [descr:ODataContextOptions.beforeSend]
     */
    beforeSend?: (options: {
      url?: string;
      async?: boolean;
      method?: string;
      timeout?: number;
      params?: any;
      payload?: any;
      headers?: any;
    }) => void;
    /**
     * [descr:ODataContextOptions.deserializeDates]
     */
    deserializeDates?: boolean;
    /**
     * [descr:ODataContextOptions.entities]
     */
    entities?: any;
    /**
     * [descr:ODataContextOptions.errorHandler]
     */
    errorHandler?: (e: {
      httpStatus?: number;
      errorDetails?: any;
      requestOptions?: any;
    }) => void;
    /**
     * [descr:ODataContextOptions.filterToLower]
     */
    filterToLower?: boolean;
    /**
     * [descr:ODataContextOptions.jsonp]
     */
    jsonp?: boolean;
    /**
     * [descr:ODataContextOptions.url]
     */
    url?: string;
    /**
     * [descr:ODataContextOptions.version]
     */
    version?: number;
    /**
     * [descr:ODataContextOptions.withCredentials]
     */
    withCredentials?: boolean;
  }
  /**
   * [descr:ODataStore]
   */
  export class ODataStore extends Store {
    constructor(options?: ODataStoreOptions);
    byKey(key: any | string | number): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:ODataStore.byKey(key, extraOptions)]
     */
    byKey(
      key: any | string | number,
      extraOptions: {
        expand?: string | Array<string>;
        select?: string | Array<string>;
      }
    ): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:ODataStore.createQuery(loadOptions)]
     */
    createQuery(loadOptions: any): any;

    /**
     * [descr:ODataStore.insert(values)]
     */
    insert(
      values: any
    ): DevExpress.core.utils.DxPromise<any> &
      DevExpress.data.ODataStore.PromiseExtension<any>;
  }
  module ODataStore {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface PromiseExtension<T> {
      then<TResult1 = T, TResult2 = never>(
        onfulfilled?:
          | ((
              value: T,
              extraParameters?: T
            ) => TResult1 | PromiseLike<TResult1>)
          | undefined
          | null,
        onrejected?:
          | ((reason: any) => TResult2 | PromiseLike<TResult2>)
          | undefined
          | null
      ): Promise<TResult1 | TResult2>;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ODataStoreOptions extends StoreOptions<ODataStore> {
    /**
     * [descr:ODataStoreOptions.beforeSend]
     */
    beforeSend?: (options: {
      url?: string;
      async?: boolean;
      method?: string;
      timeout?: number;
      params?: any;
      payload?: any;
      headers?: any;
    }) => void;
    /**
     * [descr:ODataStoreOptions.deserializeDates]
     */
    deserializeDates?: boolean;
    /**
     * [descr:ODataStoreOptions.errorHandler]
     */
    errorHandler?: (e: {
      httpStatus?: number;
      errorDetails?: any;
      requestOptions?: any;
    }) => void;
    /**
     * [descr:ODataStoreOptions.fieldTypes]
     */
    fieldTypes?: any;
    /**
     * [descr:ODataStoreOptions.filterToLower]
     */
    filterToLower?: boolean;
    /**
     * [descr:ODataStoreOptions.jsonp]
     */
    jsonp?: boolean;
    /**
     * [descr:ODataStoreOptions.keyType]
     */
    keyType?:
      | 'String'
      | 'Int32'
      | 'Int64'
      | 'Guid'
      | 'Boolean'
      | 'Single'
      | 'Decimal'
      | any;
    /**
     * [descr:ODataStoreOptions.onLoading]
     */
    onLoading?: (loadOptions: LoadOptions) => void;
    /**
     * [descr:ODataStoreOptions.url]
     */
    url?: string;
    /**
     * [descr:ODataStoreOptions.version]
     */
    version?: number;
    /**
     * [descr:ODataStoreOptions.withCredentials]
     */
    withCredentials?: boolean;
  }
  /**
   * [descr:PivotGridDataSource]
   */
  export class PivotGridDataSource {
    constructor(options?: PivotGridDataSourceOptions);
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
    createDrillDownDataSource(options: {
      columnPath?: Array<string | number | Date>;
      rowPath?: Array<string | number | Date>;
      dataIndex?: number;
      maxRowCount?: number;
      customColumns?: Array<string>;
    }): DataSource;
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
    getAreaFields(
      area: string,
      collectGroups: boolean
    ): Array<PivotGridDataSourceField>;
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
    load(): DevExpress.core.utils.DxPromise<any>;
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
    reload(): DevExpress.core.utils.DxPromise<any>;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PivotGridDataSourceField {
    /**
     * [descr:PivotGridDataSourceOptions.fields.allowCrossGroupCalculation]
     */
    allowCrossGroupCalculation?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.allowExpandAll]
     */
    allowExpandAll?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.allowFiltering]
     */
    allowFiltering?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.allowSorting]
     */
    allowSorting?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.allowSortingBySummary]
     */
    allowSortingBySummary?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.area]
     */
    area?: 'column' | 'data' | 'filter' | 'row' | undefined;
    /**
     * [descr:PivotGridDataSourceOptions.fields.areaIndex]
     */
    areaIndex?: number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.calculateCustomSummary]
     */
    calculateCustomSummary?: (options: {
      summaryProcess?: string;
      value?: any;
      totalValue?: any;
    }) => void;
    /**
     * [descr:PivotGridDataSourceOptions.fields.calculateSummaryValue]
     */
    calculateSummaryValue?: (e: DevExpress.ui.dxPivotGridSummaryCell) => number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.caption]
     */
    caption?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.customizeText]
     */
    customizeText?: (cellInfo: {
      value?: string | number | Date;
      valueText?: string;
    }) => string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.dataField]
     */
    dataField?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.dataType]
     */
    dataType?: 'date' | 'number' | 'string';
    /**
     * [descr:PivotGridDataSourceOptions.fields.displayFolder]
     */
    displayFolder?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.expanded]
     */
    expanded?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.filterType]
     */
    filterType?: 'exclude' | 'include';
    /**
     * [descr:PivotGridDataSourceOptions.fields.filterValues]
     */
    filterValues?: Array<any>;
    /**
     * [descr:PivotGridDataSourceOptions.fields.format]
     */
    format?: DevExpress.ui.format;
    /**
     * [descr:PivotGridDataSourceOptions.fields.groupIndex]
     */
    groupIndex?: number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.groupInterval]
     */
    groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.groupName]
     */
    groupName?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.headerFilter]
     */
    headerFilter?: { allowSearch?: boolean; height?: number; width?: number };
    /**
     * [descr:PivotGridDataSourceOptions.fields.isMeasure]
     */
    isMeasure?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.name]
     */
    name?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.runningTotal]
     */
    runningTotal?: 'column' | 'row';
    /**
     * [descr:PivotGridDataSourceOptions.fields.selector]
     */
    selector?: Function;
    /**
     * [descr:PivotGridDataSourceOptions.fields.showGrandTotals]
     */
    showGrandTotals?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.showTotals]
     */
    showTotals?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.showValues]
     */
    showValues?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.sortBy]
     */
    sortBy?: 'displayText' | 'value' | 'none';
    /**
     * [descr:PivotGridDataSourceOptions.fields.sortBySummaryField]
     */
    sortBySummaryField?: string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.sortBySummaryPath]
     */
    sortBySummaryPath?: Array<number | string>;
    /**
     * [descr:PivotGridDataSourceOptions.fields.sortOrder]
     */
    sortOrder?: 'asc' | 'desc';
    /**
     * [descr:PivotGridDataSourceOptions.fields.sortingMethod]
     */
    sortingMethod?: (
      a: { value?: string | number; children?: Array<any> },
      b: { value?: string | number; children?: Array<any> }
    ) => number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.summaryDisplayMode]
     */
    summaryDisplayMode?:
      | 'absoluteVariation'
      | 'percentOfColumnGrandTotal'
      | 'percentOfColumnTotal'
      | 'percentOfGrandTotal'
      | 'percentOfRowGrandTotal'
      | 'percentOfRowTotal'
      | 'percentVariation';
    /**
     * [descr:PivotGridDataSourceOptions.fields.summaryType]
     */
    summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
    /**
     * [descr:PivotGridDataSourceOptions.fields.visible]
     */
    visible?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.fields.width]
     */
    width?: number;
    /**
     * [descr:PivotGridDataSourceOptions.fields.wordWrapEnabled]
     */
    wordWrapEnabled?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PivotGridDataSourceOptions {
    /**
     * [descr:PivotGridDataSourceOptions.fields]
     */
    fields?: Array<PivotGridDataSourceField>;
    /**
     * [descr:PivotGridDataSourceOptions.filter]
     */
    filter?: string | Array<any> | Function;
    /**
     * [descr:PivotGridDataSourceOptions.onChanged]
     */
    onChanged?: Function;
    /**
     * [descr:PivotGridDataSourceOptions.onFieldsPrepared]
     */
    onFieldsPrepared?: (fields: Array<PivotGridDataSourceField>) => void;
    /**
     * [descr:PivotGridDataSourceOptions.onLoadError]
     */
    onLoadError?: (error: any) => void;
    /**
     * [descr:PivotGridDataSourceOptions.onLoadingChanged]
     */
    onLoadingChanged?: (isLoading: boolean) => void;
    /**
     * [descr:PivotGridDataSourceOptions.paginate]
     */
    paginate?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.remoteOperations]
     */
    remoteOperations?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.retrieveFields]
     */
    retrieveFields?: boolean;
    /**
     * [descr:PivotGridDataSourceOptions.store]
     */
    store?:
      | Store
      | StoreOptions
      | XmlaStore
      | XmlaStoreOptions
      | Array<{
          /**
           * [descr:PivotGridDataSourceOptions.store.type]
           */
          type?: 'array' | 'local' | 'odata' | 'xmla';
        }>
      | {
          /**
           * [descr:PivotGridDataSourceOptions.store.type]
           */
          type?: 'array' | 'local' | 'odata' | 'xmla';
        };
  }
  /**
   * [descr:Utils.query(array)]
   */
  export function query(array: Array<any>): Query;
  /**
   * [descr:Utils.query(url, queryOptions)]
   */
  export function query(url: string, queryOptions: any): Query;
  /**
   * [descr:Query]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface Query {
    /**
     * [descr:Query.aggregate(seed, step, finalize)]
     */
    aggregate(
      seed: any,
      step: Function,
      finalize: Function
    ): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:Query.aggregate(step)]
     */
    aggregate(step: Function): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:Query.avg()]
     */
    avg(): DevExpress.core.utils.DxPromise<number>;
    /**
     * [descr:Query.avg(getter)]
     */
    avg(getter: any): DevExpress.core.utils.DxPromise<number>;
    /**
     * [descr:Query.count()]
     */
    count(): DevExpress.core.utils.DxPromise<number>;
    /**
     * [descr:Query.enumerate()]
     */
    enumerate(): DevExpress.core.utils.DxPromise<any>;
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
    max(): DevExpress.core.utils.DxPromise<number | Date>;
    /**
     * [descr:Query.max(getter)]
     */
    max(getter: any): DevExpress.core.utils.DxPromise<number | Date>;
    /**
     * [descr:Query.min()]
     */
    min(): DevExpress.core.utils.DxPromise<number | Date>;
    /**
     * [descr:Query.min(getter)]
     */
    min(getter: any): DevExpress.core.utils.DxPromise<number | Date>;
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
    sum(): DevExpress.core.utils.DxPromise<number>;
    /**
     * [descr:Query.sum(getter)]
     */
    sum(getter: any): DevExpress.core.utils.DxPromise<number>;
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
   * [descr:Utils.setErrorHandler]
   */
  export function setErrorHandler(handler: (e: Error) => void): void;
  /**
   * [descr:Store]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class Store {
    constructor(options?: StoreOptions);
    /**
     * [descr:Store.byKey(key)]
     */
    byKey(key: any | string | number): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:Store.insert(values)]
     */
    insert(values: any): DevExpress.core.utils.DxPromise<any>;
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
    load(): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:Store.load(options)]
     */
    load(options: LoadOptions): DevExpress.core.utils.DxPromise<any>;
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
    remove(key: any | string | number): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:Store.totalCount(options)]
     */
    totalCount(obj: {
      filter?: any;
      group?: any;
    }): DevExpress.core.utils.DxPromise<number>;
    /**
     * [descr:Store.update(key, values)]
     */
    update(
      key: any | string | number,
      values: any
    ): DevExpress.core.utils.DxPromise<any>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface StoreOptions<T = Store> {
    /**
     * [descr:StoreOptions.errorHandler]
     */
    errorHandler?: Function;
    /**
     * [descr:StoreOptions.key]
     */
    key?: string | Array<string>;
    /**
     * [descr:StoreOptions.onInserted]
     */
    onInserted?: (values: any, key: any | string | number) => void;
    /**
     * [descr:StoreOptions.onInserting]
     */
    onInserting?: (values: any) => void;
    /**
     * [descr:StoreOptions.onLoaded]
     */
    onLoaded?: (result: Array<any>) => void;
    /**
     * [descr:StoreOptions.onLoading]
     */
    onLoading?: (loadOptions: LoadOptions) => void;
    /**
     * [descr:StoreOptions.onModified]
     */
    onModified?: Function;
    /**
     * [descr:StoreOptions.onModifying]
     */
    onModifying?: Function;
    /**
     * [descr:StoreOptions.onPush]
     */
    onPush?: (changes: Array<any>) => void;
    /**
     * [descr:StoreOptions.onRemoved]
     */
    onRemoved?: (key: any | string | number) => void;
    /**
     * [descr:StoreOptions.onRemoving]
     */
    onRemoving?: (key: any | string | number) => void;
    /**
     * [descr:StoreOptions.onUpdated]
     */
    onUpdated?: (key: any | string | number, values: any) => void;
    /**
     * [descr:StoreOptions.onUpdating]
     */
    onUpdating?: (key: any | string | number, values: any) => void;
  }
  /**
   * [descr:XmlaStore]
   */
  export class XmlaStore {
    constructor(options?: XmlaStoreOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface XmlaStoreOptions {
    /**
     * [descr:XmlaStoreOptions.beforeSend]
     */
    beforeSend?: (options: {
      url?: string;
      method?: string;
      headers?: any;
      xhrFields?: any;
      data?: string;
      dataType?: string;
    }) => void;
    /**
     * [descr:XmlaStoreOptions.catalog]
     */
    catalog?: string;
    /**
     * [descr:XmlaStoreOptions.cube]
     */
    cube?: string;
    /**
     * [descr:XmlaStoreOptions.url]
     */
    url?: string;
  }
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
  export interface Cancelable {
    cancel?: boolean;
  }
  export interface ChangedOptionInfo {
    readonly name: string;
    readonly fullName: string;
    readonly value?: any;
    readonly previousValue?: any;
  }
  /**
   * [descr:DxEvent]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type DxEvent = {} extends EventType ? EventObject : EventType;
  /**
   * [descr:event]
   * @deprecated [depNote:event]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type event = DxEvent;
  export interface EventInfo<T> {
    readonly component: T;
    readonly element: DevExpress.core.DxElement;
    readonly model?: any;
  }
  /**
   * [descr:EventObject]
   */
  export class EventObject {
    /**
     * [descr:EventObject.currentTarget]
     */
    currentTarget: Element;
    /**
     * [descr:EventObject.data]
     */
    data: any;
    /**
     * [descr:EventObject.delegateTarget]
     */
    delegateTarget: Element;
    /**
     * [descr:EventObject.target]
     */
    target: Element;
    /**
     * [descr:EventObject.isDefaultPrevented()]
     */
    isDefaultPrevented(): boolean;
    /**
     * [descr:EventObject.isImmediatePropagationStopped()]
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * [descr:EventObject.isPropagationStopped()]
     */
    isPropagationStopped(): boolean;
    /**
     * [descr:EventObject.preventDefault()]
     */
    preventDefault(): void;
    /**
     * [descr:EventObject.stopImmediatePropagation()]
     */
    stopImmediatePropagation(): void;
    /**
     * [descr:EventObject.stopPropagation()]
     */
    stopPropagation(): void;
  }
  /**
   * [descr:handler(event, extraParameters)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export function eventsHandler(event: DxEvent, extraParameters: any): boolean;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface EventType {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  interface EventType extends JQueryEventObject {
    cancel?: boolean;
  }
  export interface InitializedEventInfo<T> {
    readonly component?: T;
    readonly element?: DevExpress.core.DxElement;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ItemInfo {
    readonly itemData?: any;
    readonly itemElement: DevExpress.core.DxElement;
    readonly itemIndex: number;
  }
  export interface NativeEventInfo<T> {
    readonly component: T;
    readonly element: DevExpress.core.DxElement;
    readonly model?: any;
    readonly event?: DxEvent;
  }
  /**
   * [descr:events.off(element)]
   */
  export function off(element: Element | Array<Element>): void;
  /**
   * [descr:events.off(element, eventName)]
   */
  export function off(
    element: Element | Array<Element>,
    eventName: string
  ): void;
  /**
   * [descr:events.off(element, eventName, handler)]
   */
  export function off(
    element: Element | Array<Element>,
    eventName: string,
    handler: Function
  ): void;
  /**
   * [descr:events.off(element, eventName, selector)]
   */
  export function off(
    element: Element | Array<Element>,
    eventName: string,
    selector: string
  ): void;
  /**
   * [descr:events.off(element, eventName, selector, handler)]
   */
  export function off(
    element: Element | Array<Element>,
    eventName: string,
    selector: string,
    handler: Function
  ): void;
  /**
   * [descr:events.on(element, eventName, data, handler)]
   */
  export function on(
    element: Element | Array<Element>,
    eventName: string,
    data: any,
    handler: Function
  ): void;
  /**
   * [descr:events.on(element, eventName, handler)]
   */
  export function on(
    element: Element | Array<Element>,
    eventName: string,
    handler: Function
  ): void;
  /**
   * [descr:events.on(element, eventName, selector, data, handler)]
   */
  export function on(
    element: Element | Array<Element>,
    eventName: string,
    selector: string,
    data: any,
    handler: Function
  ): void;
  /**
   * [descr:events.on(element, eventName, selector, handler)]
   */
  export function on(
    element: Element | Array<Element>,
    eventName: string,
    selector: string,
    handler: Function
  ): void;
  /**
   * [descr:events.one(element, eventName, data, handler)]
   */
  export function one(
    element: Element | Array<Element>,
    eventName: string,
    data: any,
    handler: Function
  ): void;
  /**
   * [descr:events.one(element, eventName, handler)]
   */
  export function one(
    element: Element | Array<Element>,
    eventName: string,
    handler: Function
  ): void;
  /**
   * [descr:events.one(element, eventName, selector, data, handler)]
   */
  export function one(
    element: Element | Array<Element>,
    eventName: string,
    selector: string,
    data: any,
    handler: Function
  ): void;
  /**
   * [descr:events.one(element, eventName, selector, handler)]
   */
  export function one(
    element: Element | Array<Element>,
    eventName: string,
    selector: string,
    handler: Function
  ): void;
  /**
   * [descr:events.trigger(element, event)]
   */
  export function trigger(
    element: Element | Array<Element>,
    event: string | DxEvent
  ): void;
  /**
   * [descr:events.trigger(element, event, extraParameters)]
   */
  export function trigger(
    element: Element | Array<Element>,
    event: string | DxEvent,
    extraParameters: any
  ): void;
  /**
   * [descr:events.triggerHandler(element, event)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export function triggerHandler(
    element: Element | Array<Element>,
    event: string | DxEvent
  ): void;
  /**
   * [descr:events.triggerHandler(element, event, extraParameters)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export function triggerHandler(
    element: Element | Array<Element>,
    event: string | DxEvent,
    extraParameters: any
  ): void;
}
declare module DevExpress.excelExporter {
  /**
   * [descr:CellAddress]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface CellAddress {
    /**
     * [descr:CellAddress.row]
     */
    row?: number;
    /**
     * [descr:CellAddress.column]
     */
    column?: number;
  }
  /**
   * [descr:CellRange]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    groupSummaryItems?: Array<{
      /**
       * [descr:ExcelDataGridCell.groupSummaryItems.name]
       */
      name?: string;
      /**
       * [descr:ExcelDataGridCell.groupSummaryItems.value]
       */
      value?: any;
    }>;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ExcelExportBaseProps {
    /**
     * [descr:ExcelExportBaseProps.worksheet]
     */
    worksheet?: object;
    /**
     * [descr:ExcelExportBaseProps.topLeftCell]
     */
    topLeftCell?: CellAddress | string;
    /**
     * [descr:ExcelExportBaseProps.keepColumnWidths]
     */
    keepColumnWidths?: boolean;
    /**
     * [descr:ExcelExportBaseProps.loadPanel]
     */
    loadPanel?: ExportLoadPanel;
  }
  /**
   * [descr:ExcelExportDataGridProps]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ExcelExportDataGridProps extends ExcelExportBaseProps {
    /**
     * [descr:ExcelExportDataGridProps.component]
     */
    component?: DevExpress.ui.dxDataGrid;
    /**
     * [descr:ExcelExportDataGridProps.selectedRowsOnly]
     */
    selectedRowsOnly?: boolean;
    /**
     * [descr:ExcelExportDataGridProps.autoFilterEnabled]
     */
    autoFilterEnabled?: boolean;
    /**
     * [descr:ExcelExportDataGridProps.customizeCell]
     */
    customizeCell?: (options: {
      gridCell?: ExcelDataGridCell;
      excelCell?: any;
    }) => void;
  }
  /**
   * [descr:ExcelExportPivotGridProps]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ExcelExportPivotGridProps extends ExcelExportBaseProps {
    /**
     * [descr:ExcelExportPivotGridProps.component]
     */
    component?: DevExpress.ui.dxPivotGrid;
    /**
     * [descr:ExcelExportPivotGridProps.mergeRowFieldValues]
     */
    mergeRowFieldValues?: boolean;
    /**
     * [descr:ExcelExportPivotGridProps.mergeColumnFieldValues]
     */
    mergeColumnFieldValues?: boolean;
    /**
     * [descr:ExcelExportPivotGridProps.customizeCell]
     */
    customizeCell?: (options: {
      pivotCell?: ExcelPivotGridCell;
      excelCell?: any;
    }) => void;
  }
  /**
   * [descr:ExcelPivotGridCell]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ExcelPivotGridCell
    extends DevExpress.ui.dxPivotGridPivotGridCell {
    /**
     * [descr:ExcelPivotGridCell.area]
     */
    area?: string;
    /**
     * [descr:ExcelPivotGridCell.rowIndex]
     */
    rowIndex?: number;
    /**
     * [descr:ExcelPivotGridCell.columnIndex]
     */
    columnIndex?: number;
  }
  /**
   * [descr:excelExporter.exportDataGrid(options)]
   */
  export function exportDataGrid(
    options: ExcelExportDataGridProps
  ): DevExpress.core.utils.DxPromise<CellRange>;
  /**
   * [descr:excelExporter.exportPivotGrid(options)]
   */
  export function exportPivotGrid(
    options: ExcelExportPivotGridProps
  ): DevExpress.core.utils.DxPromise<CellRange>;
}
declare module DevExpress.exporter {
  /**
   * [descr:ExcelFont]
   * @deprecated [depNote:ExcelFont]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    underline?:
      | 'double'
      | 'doubleAccounting'
      | 'none'
      | 'single'
      | 'singleAccounting';
  }
}
declare module DevExpress.fileManagement {
  /**
   * [descr:CustomFileSystemProvider]
   */
  export class CustomFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: CustomFileSystemProviderOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface CustomFileSystemProviderOptions
    extends FileSystemProviderBaseOptions<CustomFileSystemProvider> {
    /**
     * [descr:CustomFileSystemProviderOptions.abortFileUpload]
     */
    abortFileUpload?: (
      file: File,
      uploadInfo: UploadInfo,
      destinationDirectory: FileSystemItem
    ) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.copyItem]
     */
    copyItem?: (
      item: FileSystemItem,
      destinationDirectory: FileSystemItem
    ) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.createDirectory]
     */
    createDirectory?: (
      parentDirectory: FileSystemItem,
      name: string
    ) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.deleteItem]
     */
    deleteItem?: (item: FileSystemItem) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.downloadItems]
     */
    downloadItems?: (items: Array<FileSystemItem>) => void;

    /**
     * [descr:CustomFileSystemProviderOptions.getItems]
     */
    getItems?: (
      parentDirectory: FileSystemItem
    ) => PromiseLike<Array<any>> | Array<any>;

    /**
     * [descr:CustomFileSystemProviderOptions.getItemsContent]
     */
    getItemsContent?: (items: Array<FileSystemItem>) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.hasSubDirectoriesExpr]
     */
    hasSubDirectoriesExpr?: string | Function;

    /**
     * [descr:CustomFileSystemProviderOptions.moveItem]
     */
    moveItem?: (
      item: FileSystemItem,
      destinationDirectory: FileSystemItem
    ) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.renameItem]
     */
    renameItem?: (
      item: FileSystemItem,
      newName: string
    ) => PromiseLike<any> | any;

    /**
     * [descr:CustomFileSystemProviderOptions.uploadFileChunk]
     */
    uploadFileChunk?: (
      file: File,
      uploadInfo: UploadInfo,
      destinationDirectory: FileSystemItem
    ) => PromiseLike<any> | any;
  }
  /**
   * [descr:FileSystemError]
   */
  export class FileSystemError {
    constructor(
      errorCode?: number,
      fileSystemItem?: FileSystemItem,
      errorText?: string
    );
    /**
     * [descr:FileSystemError.fileSystemItem]
     */
    fileSystemItem?: FileSystemItem;

    /**
     * [descr:FileSystemError.errorCode]
     */
    errorCode?: number;

    /**
     * [descr:FileSystemError.errorText]
     */
    errorText?: string;
  }
  /**
   * [descr:FileSystemItem]
   */
  export class FileSystemItem {
    constructor(path: string, isDirectory: boolean, pathKeys?: Array<string>);

    /**
     * [descr:FileSystemItem.path]
     */
    path: string;

    /**
     * [descr:FileSystemItem.pathKeys]
     */
    pathKeys: Array<string>;

    /**
     * [descr:FileSystemItem.key]
     */
    key: string;

    /**
     * [descr:FileSystemItem.name]
     */
    name: string;

    /**
     * [descr:FileSystemItem.dateModified]
     */
    dateModified: Date;

    /**
     * [descr:FileSystemItem.size]
     */
    size: number;

    /**
     * [descr:FileSystemItem.isDirectory]
     */
    isDirectory: boolean;

    /**
     * [descr:FileSystemItem.hasSubDirectories]
     */
    hasSubDirectories: boolean;

    /**
     * [descr:FileSystemItem.thumbnail]
     */
    thumbnail: string;

    /**
     * [descr:FileSystemItem.dataItem]
     */
    dataItem: any;

    /**
     * [descr:FileSystemItem.getFileExtension()]
     */
    getFileExtension(): string;
  }
  /**
   * [descr:FileSystemProviderBase]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions);
    /**
     * [descr:FileSystemProviderBase.getItems()]
     */
    getItems(
      parentDirectory: FileSystemItem
    ): DevExpress.core.utils.DxPromise<Array<FileSystemItem>>;

    /**
     * [descr:FileSystemProviderBase.renameItem()]
     */
    renameItem(
      item: FileSystemItem,
      newName: string
    ): DevExpress.core.utils.DxPromise<any>;

    /**
     * [descr:FileSystemProviderBase.createDirectory()]
     */
    createDirectory(
      parentDirectory: FileSystemItem,
      name: string
    ): DevExpress.core.utils.DxPromise<any>;

    /**
     * [descr:FileSystemProviderBase.deleteItems()]
     */
    deleteItems(
      items: Array<FileSystemItem>
    ): Array<DevExpress.core.utils.DxPromise<any>>;

    /**
     * [descr:FileSystemProviderBase.moveItems()]
     */
    moveItems(
      items: Array<FileSystemItem>,
      destinationDirectory: FileSystemItem
    ): Array<DevExpress.core.utils.DxPromise<any>>;

    /**
     * [descr:FileSystemProviderBase.copyItems()]
     */
    copyItems(
      items: Array<FileSystemItem>,
      destinationDirectory: FileSystemItem
    ): Array<DevExpress.core.utils.DxPromise<any>>;

    /**
     * [descr:FileSystemProviderBase.uploadFileChunk()]
     */
    uploadFileChunk(
      fileData: File,
      uploadInfo: UploadInfo,
      destinationDirectory: FileSystemItem
    ): DevExpress.core.utils.DxPromise<any>;

    /**
     * [descr:FileSystemProviderBase.abortFileUpload()]
     */
    abortFileUpload(
      fileData: File,
      uploadInfo: UploadInfo,
      destinationDirectory: FileSystemItem
    ): DevExpress.core.utils.DxPromise<any>;

    /**
     * [descr:FileSystemProviderBase.downloadItems()]
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * [descr:FileSystemProviderBase.getItemsContent()]
     */
    getItemsContent(
      items: Array<FileSystemItem>
    ): DevExpress.core.utils.DxPromise<any>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * [descr:FileSystemProviderBaseOptions.dateModifiedExpr]
     */
    dateModifiedExpr?: string | Function;
    /**
     * [descr:FileSystemProviderBaseOptions.isDirectoryExpr]
     */
    isDirectoryExpr?: string | Function;
    /**
     * [descr:FileSystemProviderBaseOptions.keyExpr]
     */
    keyExpr?: string | Function;
    /**
     * [descr:FileSystemProviderBaseOptions.nameExpr]
     */
    nameExpr?: string | Function;
    /**
     * [descr:FileSystemProviderBaseOptions.sizeExpr]
     */
    sizeExpr?: string | Function;
    /**
     * [descr:FileSystemProviderBaseOptions.thumbnailExpr]
     */
    thumbnailExpr?: string | Function;
  }
  /**
   * [descr:ObjectFileSystemProvider]
   */
  export class ObjectFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: ObjectFileSystemProviderOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface ObjectFileSystemProviderOptions
    extends FileSystemProviderBaseOptions<ObjectFileSystemProvider> {
    /**
     * [descr:ObjectFileSystemProviderOptions.contentExpr]
     */
    contentExpr?: string | Function;
    /**
     * [descr:ObjectFileSystemProviderOptions.data]
     */
    data?: Array<any>;
    /**
     * [descr:ObjectFileSystemProviderOptions.itemsExpr]
     */
    itemsExpr?: string | Function;
  }
  /**
   * [descr:RemoteFileSystemProvider]
   */
  export class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: RemoteFileSystemProviderOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface RemoteFileSystemProviderOptions
    extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * [descr:RemoteFileSystemProviderOptions.beforeAjaxSend]
     */
    beforeAjaxSend?: (options: {
      headers?: any;
      xhrFields?: any;
      formData?: any;
    }) => void;
    /**
     * [descr:RemoteFileSystemProviderOptions.beforeSubmit]
     */
    beforeSubmit?: (options: { formData?: any }) => void;
    /**
     * [descr:RemoteFileSystemProviderOptions.endpointUrl]
     */
    endpointUrl?: string;
    /**
     * [descr:RemoteFileSystemProviderOptions.hasSubDirectoriesExpr]
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * [descr:RemoteFileSystemProviderOptions.requestHeaders]
     */
    requestHeaders?: any;
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
     * [descr:UploadInfo.chunkCount]
     */
    chunkCount: number;

    /**
     * [descr:UploadInfo.customData]
     */
    customData: any;

    /**
     * [descr:UploadInfo.chunkBlob]
     */
    chunkBlob: Blob;

    /**
     * [descr:UploadInfo.chunkIndex]
     */
    chunkIndex: number;
  }
}
declare module DevExpress.localization {
  /**
   * [descr:localization.formatDate(value, format)]
   */
  export function formatDate(value: Date, format: DevExpress.ui.format): string;
  /**
   * [descr:localization.formatMessage(key, value)]
   */
  export function formatMessage(key: string, ...values: Array<string>): string;
  /**
   * [descr:localization.formatNumber(value, format)]
   */
  export function formatNumber(
    value: number,
    format: DevExpress.ui.format
  ): string;
  /**
   * [descr:localization.loadMessages(messages)]
   */
  export function loadMessages(messages: any): void;
  /**
   * [descr:localization.locale()]
   */
  export function locale(): string;
  /**
   * [descr:localization.locale(locale)]
   */
  export function locale(locale: string): void;
  /**
   * [descr:localization.parseDate(text, format)]
   */
  export function parseDate(text: string, format: DevExpress.ui.format): Date;
  /**
   * [descr:localization.parseNumber(text, format)]
   */
  export function parseNumber(
    text: string,
    format: DevExpress.ui.format
  ): number;
}
declare module DevExpress.pdfExporter {
  /**
   * [descr:pdfExporter.exportDataGrid(options)]
   */
  export function exportDataGrid(
    options: PdfExportDataGridProps
  ): DevExpress.core.utils.DxPromise<void>;
  /**
   * [descr:PdfDataGridCell]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    groupSummaryItems?: Array<{
      /**
       * [descr:PdfDataGridCell.groupSummaryItems.name]
       */
      name?: string;
      /**
       * [descr:PdfDataGridCell.groupSummaryItems.value]
       */
      value?: any;
    }>;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PdfExportDataGridProps {
    /**
     * [descr:PdfExportDataGridProps.jsPDFDocument]
     */
    jsPDFDocument?: object;
    /**
     * [descr:PdfExportDataGridProps.autoTableOptions]
     */
    autoTableOptions?: object;
    /**
     * [descr:PdfExportDataGridProps.component]
     */
    component?: DevExpress.ui.dxDataGrid;
    /**
     * [descr:PdfExportDataGridProps.selectedRowsOnly]
     */
    selectedRowsOnly?: boolean;
    /**
     * [descr:PdfExportDataGridProps.keepColumnWidths]
     */
    keepColumnWidths?: boolean;
    /**
     * [descr:PdfExportDataGridProps.customizeCell]
     */
    customizeCell?: (options: {
      gridCell?: PdfDataGridCell;
      pdfCell?: any;
    }) => void;
    /**
     * [descr:PdfExportDataGridProps.loadPanel]
     */
    loadPanel?: ExportLoadPanel;
  }
}
declare module DevExpress.ui {
  /**
   * [descr:dxItem]
   */
  export var dxItem: any;
  /**
   * [descr:AsyncRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'async';
    /**
     * [descr:AsyncRule.validationCallback]
     */
    validationCallback?: (options: ValidationCallbackData) => PromiseLike<any>;
  }
  /**
   * [descr:ColCountResponsible]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * [descr:CollectionWidget]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class CollectionWidget<TProperties> extends Widget<TProperties> {
    getDataSource(): DevExpress.data.DataSource;
  }
  module CollectionWidget {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SelectionChangedInfo<T = any> {
      readonly addedItems: Array<T>;
      readonly removedItems: Array<T>;
    }
  }
  /**
   * [descr:CollectionWidgetItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    template?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface CollectionWidgetOptions<TComponent>
    extends WidgetOptions<TComponent> {
    /**
     * [descr:CollectionWidgetOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | CollectionWidgetItem>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:CollectionWidgetOptions.itemHoldTimeout]
     */
    itemHoldTimeout?: number;
    /**
     * [descr:CollectionWidgetOptions.itemTemplate]
     */
    itemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:CollectionWidgetOptions.items]
     */
    items?: Array<string | CollectionWidgetItem | any>;
    /**
     * [descr:CollectionWidgetOptions.keyExpr]
     */
    keyExpr?: string | Function;
    /**
     * [descr:CollectionWidgetOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:CollectionWidgetOptions.onItemClick]
     */
    onItemClick?:
      | ((
          e: DevExpress.events.NativeEventInfo<TComponent> &
            DevExpress.events.ItemInfo
        ) => void)
      | string;
    /**
     * [descr:CollectionWidgetOptions.onItemContextMenu]
     */
    onItemContextMenu?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.events.ItemInfo
    ) => void;
    /**
     * [descr:CollectionWidgetOptions.onItemHold]
     */
    onItemHold?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.events.ItemInfo
    ) => void;
    /**
     * [descr:CollectionWidgetOptions.onItemRendered]
     */
    onItemRendered?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.events.ItemInfo
    ) => void;
    /**
     * [descr:CollectionWidgetOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo
    ) => void;
    /**
     * [descr:CollectionWidgetOptions.selectedIndex]
     */
    selectedIndex?: number;
    /**
     * [descr:CollectionWidgetOptions.selectedItem]
     */
    selectedItem?: any;
    /**
     * [descr:CollectionWidgetOptions.selectedItemKeys]
     */
    selectedItemKeys?: Array<any>;
    /**
     * [descr:CollectionWidgetOptions.selectedItems]
     */
    selectedItems?: Array<any>;
  }
  /**
   * [descr:CompareRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface CompareRule {
    /**
     * [descr:CompareRule.comparisonTarget]
     */
    comparisonTarget?: () => any;
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
    type: 'compare';
  }
  export interface CustomDialogOptions {
    title?: string;
    messageHtml?: string;
    buttons?: Array<dxButtonOptions>;
    showTitle?: boolean;
    message?: string;
    dragEnabled?: boolean;
  }
  /**
   * [descr:CustomRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'custom';
    /**
     * [descr:CustomRule.validationCallback]
     */
    validationCallback?: (options: ValidationCallbackData) => boolean;
  }
  /**
   * [descr:DataChange]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DataChange {
    /**
     * [descr:DataChange.key]
     */
    key: any;
    /**
     * [descr:DataChange.type]
     */
    type: 'insert' | 'update' | 'remove';
    /**
     * [descr:DataChange.data]
     */
    data: object;
    /**
     * [descr:DataChange.index]
     */
    index?: number;
    /**
     * [descr:DataChange.pageIndex]
     */
    pageIndex?: number;
  }
  /**
   * [descr:DataExpressionMixin]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions);
    getDataSource(): DevExpress.data.DataSource;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * [descr:DataExpressionMixinOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<CollectionWidgetItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:DataExpressionMixinOptions.displayExpr]
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * [descr:DataExpressionMixinOptions.itemTemplate]
     */
    itemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:DataExpressionMixinOptions.items]
     */
    items?: Array<CollectionWidgetItem | any>;
    /**
     * [descr:DataExpressionMixinOptions.value]
     */
    value?: any;
    /**
     * [descr:DataExpressionMixinOptions.valueExpr]
     */
    valueExpr?: string | ((item: any) => string | number | boolean);
  }
  /**
   * [descr:DraggableBase]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DraggableBase {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface DraggableBaseOptions<TComponent>
    extends DOMComponentOptions<TComponent> {
    /**
     * [descr:DraggableBaseOptions.autoScroll]
     */
    autoScroll?: boolean;
    /**
     * [descr:DraggableBaseOptions.boundary]
     */
    boundary?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:DraggableBaseOptions.container]
     */
    container?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:DraggableBaseOptions.cursorOffset]
     */
    cursorOffset?:
      | string
      | {
          /**
           * [descr:DraggableBaseOptions.cursorOffset.x]
           */
          x?: number;
          /**
           * [descr:DraggableBaseOptions.cursorOffset.y]
           */
          y?: number;
        };
    /**
     * [descr:DraggableBaseOptions.data]
     */
    data?: any;
    /**
     * [descr:DraggableBaseOptions.dragDirection]
     */
    dragDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * [descr:DraggableBaseOptions.group]
     */
    group?: string;
    /**
     * [descr:DraggableBaseOptions.handle]
     */
    handle?: string;
    /**
     * [descr:DraggableBaseOptions.scrollSensitivity]
     */
    scrollSensitivity?: number;
    /**
     * [descr:DraggableBaseOptions.scrollSpeed]
     */
    scrollSpeed?: number;
  }
  /**
   * [descr:dxAccordion]
   */
  export class dxAccordion extends CollectionWidget<dxAccordionOptions> {
    /**
     * [descr:dxAccordion.collapseItem(index)]
     */
    collapseItem(index: number): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxAccordion.expandItem(index)]
     */
    expandItem(index: number): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxAccordion.updateDimensions()]
     */
    updateDimensions(): DevExpress.core.utils.DxPromise<void>;
  }
  module dxAccordion {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxAccordion>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxAccordion>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxAccordion>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxAccordion> &
        DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxAccordion> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxAccordion> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxAccordion> &
        DevExpress.events.ItemInfo;
    export type ItemTitleClickEvent =
      DevExpress.events.NativeEventInfo<dxAccordion> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxAccordion> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxAccordionOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxAccordion> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxAccordionItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxAccordionOptions
    extends CollectionWidgetOptions<dxAccordion> {
    /**
     * [descr:dxAccordionOptions.animationDuration]
     */
    animationDuration?: number;
    /**
     * [descr:dxAccordionOptions.collapsible]
     */
    collapsible?: boolean;
    /**
     * [descr:dxAccordionOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxAccordionItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxAccordionOptions.deferRendering]
     */
    deferRendering?: boolean;
    /**
     * [descr:dxAccordionOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxAccordionOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxAccordionOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxAccordionOptions.itemTemplate]
     */
    itemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxAccordionOptions.itemTitleTemplate]
     */
    itemTitleTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxAccordionOptions.items]
     */
    items?: Array<string | dxAccordionItem | any>;
    /**
     * [descr:dxAccordionOptions.multiple]
     */
    multiple?: boolean;
    /**
     * [descr:dxAccordionOptions.onItemTitleClick]
     */
    onItemTitleClick?:
      | ((e: DevExpress.ui.dxAccordion.ItemTitleClickEvent) => void)
      | string;
    /**
     * [descr:dxAccordionOptions.repaintChangesOnly]
     */
    repaintChangesOnly?: boolean;
    /**
     * [descr:dxAccordionOptions.selectedIndex]
     */
    selectedIndex?: number;
  }
  /**
   * [descr:dxActionSheet]
   */
  export class dxActionSheet extends CollectionWidget<dxActionSheetOptions> {
    /**
     * [descr:dxActionSheet.hide()]
     */
    hide(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxActionSheet.show()]
     */
    show(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxActionSheet.toggle(showing)]
     */
    toggle(showing: boolean): DevExpress.core.utils.DxPromise<void>;
  }
  module dxActionSheet {
    export type CancelClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxActionSheet>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxActionSheet>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxActionSheet>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxActionSheet>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxActionSheet> &
        DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxActionSheet> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent =
      DevExpress.events.NativeEventInfo<dxActionSheet> &
        DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxActionSheet> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxActionSheet> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxActionSheetOptions;
  }
  /**
   * [descr:dxActionSheetItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxActionSheetItem extends CollectionWidgetItem {
    /**
     * [descr:dxActionSheetItem.icon]
     */
    icon?: string;
    /**
     * [descr:dxActionSheetItem.onClick]
     */
    onClick?:
      | ((e: {
          component?: dxActionSheet;
          element?: DevExpress.core.DxElement;
          model?: any;
          event?: DevExpress.events.DxEvent;
        }) => void)
      | string;
    /**
     * [descr:dxActionSheetItem.type]
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxActionSheetOptions
    extends CollectionWidgetOptions<dxActionSheet> {
    /**
     * [descr:dxActionSheetOptions.cancelText]
     */
    cancelText?: string;
    /**
     * [descr:dxActionSheetOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxActionSheetItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxActionSheetOptions.items]
     */
    items?: Array<string | dxActionSheetItem | any>;
    /**
     * [descr:dxActionSheetOptions.onCancelClick]
     */
    onCancelClick?:
      | ((e: DevExpress.ui.dxActionSheet.CancelClickEvent) => void)
      | string;
    /**
     * [descr:dxActionSheetOptions.showCancelButton]
     */
    showCancelButton?: boolean;
    /**
     * [descr:dxActionSheetOptions.showTitle]
     */
    showTitle?: boolean;
    /**
     * [descr:dxActionSheetOptions.target]
     */
    target?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxActionSheetOptions.title]
     */
    title?: string;
    /**
     * [descr:dxActionSheetOptions.usePopover]
     */
    usePopover?: boolean;
    /**
     * [descr:dxActionSheetOptions.visible]
     */
    visible?: boolean;
  }
  /**
   * [descr:dxAutocomplete]
   */
  export class dxAutocomplete extends dxDropDownList<dxAutocompleteOptions> {}
  module dxAutocomplete {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxAutocomplete>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxAutocomplete>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxAutocomplete>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type FocusInEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type FocusOutEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxAutocomplete>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete> &
        DevExpress.events.ItemInfo;
    export type KeyDownEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type KeyPressEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type OpenedEvent = DevExpress.events.EventInfo<dxAutocomplete>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxAutocomplete> &
        DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxAutocomplete>;
    export type Properties = dxAutocompleteOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxAutocomplete> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxAutocomplete> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxAutocompleteOptions
    extends dxDropDownListOptions<dxAutocomplete> {
    /**
     * [descr:dxAutocompleteOptions.maxItemCount]
     */
    maxItemCount?: number;
    /**
     * [descr:dxAutocompleteOptions.minSearchLength]
     */
    minSearchLength?: number;
    /**
     * [descr:dxAutocompleteOptions.showDropDownButton]
     */
    showDropDownButton?: boolean;
    /**
     * [descr:dxAutocompleteOptions.value]
     */
    value?: string;

    /**
     * [descr:dxAutocompleteOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
  }
  /**
   * [descr:dxBox]
   */
  export class dxBox extends CollectionWidget<dxBoxOptions> {}
  module dxBox {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxBox>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxBox> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxBox> & DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxBox> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent = DevExpress.events.NativeEventInfo<dxBox> &
      DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxBox> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxBoxOptions;
  }
  /**
   * [descr:dxBoxItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
    /**
     * [descr:dxBoxOptions.align]
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * [descr:dxBoxOptions.crossAlign]
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * [descr:dxBoxOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxBoxItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxBoxOptions.direction]
     */
    direction?: 'col' | 'row';
    /**
     * [descr:dxBoxOptions.items]
     */
    items?: Array<string | dxBoxItem | any>;
  }
  /**
   * [descr:dxButton]
   */
  export class dxButton extends Widget<dxButtonOptions> {}
  module dxButton {
    export type ClickEvent = DevExpress.events.NativeEventInfo<dxButton> & {
      validationGroup?: any;
    };
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxButton>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxButton>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxButton>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxButton> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxButtonOptions;
    export type TemplateData = {
      readonly text?: string;
      readonly icon?: string;
    };
  }
  /**
   * [descr:dxButtonGroup]
   */
  export class dxButtonGroup extends Widget<dxButtonGroupOptions> {}
  module dxButtonGroup {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxButtonGroup>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxButtonGroup>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxButtonGroup>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxButtonGroup> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxButtonGroup> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxButtonGroupOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxButtonGroup> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxButtonGroupItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxButtonGroupOptions extends WidgetOptions<dxButtonGroup> {
    /**
     * [descr:dxButtonGroupOptions.buttonTemplate]
     */
    buttonTemplate?:
      | DevExpress.core.template
      | ((
          buttonData: any,
          buttonContent: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxButtonGroupOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxButtonGroupOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxButtonGroupOptions.items]
     */
    items?: Array<dxButtonGroupItem>;
    /**
     * [descr:dxButtonGroupOptions.keyExpr]
     */
    keyExpr?: string | Function;
    /**
     * [descr:dxButtonGroupOptions.onItemClick]
     */
    onItemClick?: (e: DevExpress.ui.dxButtonGroup.ItemClickEvent) => void;
    /**
     * [descr:dxButtonGroupOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxButtonGroup.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxButtonGroupOptions.selectedItemKeys]
     */
    selectedItemKeys?: Array<any>;
    /**
     * [descr:dxButtonGroupOptions.selectedItems]
     */
    selectedItems?: Array<any>;
    /**
     * [descr:dxButtonGroupOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxButtonGroupOptions.stylingMode]
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxButtonOptions extends WidgetOptions<dxButton> {
    /**
     * [descr:dxButtonOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxButtonOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxButtonOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxButtonOptions.icon]
     */
    icon?: string;
    /**
     * [descr:dxButtonOptions.onClick]
     */
    onClick?: (e: DevExpress.ui.dxButton.ClickEvent) => void;
    /**
     * [descr:dxButtonOptions.stylingMode]
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * [descr:dxButtonOptions.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          data: DevExpress.ui.dxButton.TemplateData,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxButtonOptions.text]
     */
    text?: string;
    /**
     * [descr:dxButtonOptions.type]
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    /**
     * [descr:dxButtonOptions.useSubmitBehavior]
     */
    useSubmitBehavior?: boolean;
    /**
     * [descr:dxButtonOptions.validationGroup]
     */
    validationGroup?: string;
  }
  /**
   * [descr:dxCalendar]
   */
  export class dxCalendar extends Editor<dxCalendarOptions> {}
  module dxCalendar {
    export type CellTemplateData = {
      readonly date: Date;
      readonly view: string;
      readonly text?: string;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ComponentDisabledDate<T> {
      component: T;
      readonly date: Date;
      readonly view: string;
    }
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxCalendar>;
    export type DisabledDate = ComponentDisabledDate<dxCalendar>;
    export type Properties = dxCalendarOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxCalendar> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
    /**
     * [descr:dxCalendarOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxCalendarOptions.cellTemplate]
     */
    cellTemplate?:
      | DevExpress.core.template
      | ((
          itemData: DevExpress.ui.dxCalendar.CellTemplateData,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxCalendarOptions.dateSerializationFormat]
     */
    dateSerializationFormat?: string;
    /**
     * [descr:dxCalendarOptions.disabledDates]
     */
    disabledDates?:
      | Array<Date>
      | ((data: DevExpress.ui.dxCalendar.DisabledDate) => boolean);
    /**
     * [descr:dxCalendarOptions.firstDayOfWeek]
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * [descr:dxCalendarOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxCalendarOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxCalendarOptions.max]
     */
    max?: Date | number | string;
    /**
     * [descr:dxCalendarOptions.maxZoomLevel]
     */
    maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * [descr:dxCalendarOptions.min]
     */
    min?: Date | number | string;
    /**
     * [descr:dxCalendarOptions.minZoomLevel]
     */
    minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * [descr:dxCalendarOptions.name]
     */
    name?: string;
    /**
     * [descr:dxCalendarOptions.showTodayButton]
     */
    showTodayButton?: boolean;
    /**
     * [descr:dxCalendarOptions.value]
     */
    value?: Date | number | string;
    /**
     * [descr:dxCalendarOptions.zoomLevel]
     */
    zoomLevel?: 'century' | 'decade' | 'month' | 'year';
  }
  /**
   * [descr:dxCheckBox]
   */
  export class dxCheckBox extends Editor<dxCheckBoxOptions> {}
  module dxCheckBox {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxCheckBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxCheckBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxCheckBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxCheckBox> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxCheckBoxOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxCheckBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
    /**
     * [descr:dxCheckBoxOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxCheckBoxOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxCheckBoxOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxCheckBoxOptions.name]
     */
    name?: string;
    /**
     * [descr:dxCheckBoxOptions.text]
     */
    text?: string;
    /**
     * [descr:dxCheckBoxOptions.value]
     */
    value?: boolean | undefined;
  }
  /**
   * [descr:dxColorBox]
   */
  export class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> {}
  module dxColorBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxColorBox>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxColorBox>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxColorBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type OpenedEvent = DevExpress.events.EventInfo<dxColorBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxColorBox> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxColorBox>;
    export type Properties = dxColorBoxOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxColorBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxColorBoxOptions
    extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * [descr:dxColorBoxOptions.applyButtonText]
     */
    applyButtonText?: string;
    /**
     * [descr:dxColorBoxOptions.applyValueMode]
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * [descr:dxColorBoxOptions.cancelButtonText]
     */
    cancelButtonText?: string;
    /**
     * [descr:dxColorBoxOptions.editAlphaChannel]
     */
    editAlphaChannel?: boolean;
    /**
     * [descr:dxColorBoxOptions.fieldTemplate]
     */
    fieldTemplate?:
      | DevExpress.core.template
      | ((
          value: string,
          fieldElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxColorBoxOptions.keyStep]
     */
    keyStep?: number;
    /**
     * [descr:dxColorBoxOptions.value]
     */
    value?: string;

    /**
     * [descr:dxColorBoxOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
  }
  /**
   * [descr:dxContextMenu]
   */
  export class dxContextMenu extends dxMenuBase<dxContextMenuOptions> {
    /**
     * [descr:dxContextMenu.hide()]
     */
    hide(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxContextMenu.show()]
     */
    show(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxContextMenu.toggle(showing)]
     */
    toggle(showing: boolean): DevExpress.core.utils.DxPromise<void>;
  }
  module dxContextMenu {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxContextMenu>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxContextMenu>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxContextMenu>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxContextMenu>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxContextMenu>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxContextMenu> &
        DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxContextMenu> &
        DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxContextMenu> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxContextMenu> &
        DevExpress.events.ChangedOptionInfo;
    export type PositioningEvent =
      DevExpress.events.NativeEventInfo<dxContextMenu> & {
        readonly position: positionConfig;
      };
    export type Properties = dxContextMenuOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxContextMenu> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type ShowingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxContextMenu>;
    export type ShownEvent = DevExpress.events.EventInfo<dxContextMenu>;
  }
  /**
   * [descr:dxContextMenuItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxContextMenuItem extends dxMenuBaseItem {
    /**
     * [descr:dxContextMenuItem.items]
     */
    items?: Array<dxContextMenuItem>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxContextMenuOptions
    extends dxMenuBaseOptions<dxContextMenu> {
    /**
     * [descr:dxContextMenuOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxContextMenuOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxContextMenuItem>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxContextMenuOptions.items]
     */
    items?: Array<dxContextMenuItem>;
    /**
     * [descr:dxContextMenuOptions.onHidden]
     */
    onHidden?: (e: DevExpress.ui.dxContextMenu.HiddenEvent) => void;
    /**
     * [descr:dxContextMenuOptions.onHiding]
     */
    onHiding?: (e: DevExpress.ui.dxContextMenu.HidingEvent) => void;
    /**
     * [descr:dxContextMenuOptions.onPositioning]
     */
    onPositioning?: (e: DevExpress.ui.dxContextMenu.PositioningEvent) => void;
    /**
     * [descr:dxContextMenuOptions.onShowing]
     */
    onShowing?: (e: DevExpress.ui.dxContextMenu.ShowingEvent) => void;
    /**
     * [descr:dxContextMenuOptions.onShown]
     */
    onShown?: (e: DevExpress.ui.dxContextMenu.ShownEvent) => void;
    /**
     * [descr:dxContextMenuOptions.position]
     */
    position?: positionConfig;
    /**
     * [descr:dxContextMenuOptions.showEvent]
     */
    showEvent?:
      | {
          /**
           * [descr:dxContextMenuOptions.showEvent.delay]
           */
          delay?: number;
          /**
           * [descr:dxContextMenuOptions.showEvent.name]
           */
          name?: string;
        }
      | string;
    /**
     * [descr:dxContextMenuOptions.submenuDirection]
     */
    submenuDirection?: 'auto' | 'left' | 'right';
    /**
     * [descr:dxContextMenuOptions.target]
     */
    target?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxContextMenuOptions.visible]
     */
    visible?: boolean;
  }
  /**
   * [descr:dxDataGrid]
   */
  export class dxDataGrid
    extends Widget<dxDataGridOptions>
    implements GridBase
  {
    /**
     * [descr:dxDataGrid.addColumn(columnOptions)]
     */
    addColumn(columnOptions: any | string): void;
    /**
     * [descr:dxDataGrid.addRow()]
     */
    addRow(): DevExpress.core.utils.DxPromise<void>;
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
    collapseRow(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDataGrid.expandAll(groupIndex)]
     */
    expandAll(groupIndex?: number): void;
    /**
     * [descr:dxDataGrid.expandRow(key)]
     */
    expandRow(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDataGrid.exportToExcel(selectionOnly)]
     * @deprecated [depNote:dxDataGrid.exportToExcel(selectionOnly)]
     */
    exportToExcel(selectionOnly: boolean): void;
    /**
     * [descr:dxDataGrid.getSelectedRowKeys()]
     */
    getSelectedRowKeys(): Array<any> & DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:dxDataGrid.getSelectedRowsData()]
     */
    getSelectedRowsData(): Array<any> & DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:dxDataGrid.getTotalSummaryValue(summaryItemName)]
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * [descr:dxDataGrid.getVisibleColumns()]
     */
    getVisibleColumns(): Array<DevExpress.ui.dxDataGrid.Column>;
    /**
     * [descr:dxDataGrid.getVisibleColumns(headerLevel)]
     */
    getVisibleColumns(
      headerLevel: number
    ): Array<DevExpress.ui.dxDataGrid.Column>;
    /**
     * [descr:dxDataGrid.getVisibleRows()]
     */
    getVisibleRows(): Array<DevExpress.ui.dxDataGrid.RowObject>;
    /**
     * [descr:dxDataGrid.isRowExpanded(key)]
     */
    isRowExpanded(key: any): boolean;
    /**
     * [descr:dxDataGrid.isRowSelected(data)]
     */
    isRowSelected(data: any): boolean;
    isRowSelected(key: any): boolean;
    /**
     * [descr:dxDataGrid.totalCount()]
     */
    totalCount(): number;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): DevExpress.core.utils.DxPromise<any>;
    cancelEditData(): void;
    cellValue(rowIndex: number, dataField: string): any;
    cellValue(rowIndex: number, dataField: string, value: any): void;
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    clearFilter(): void;
    clearFilter(filterName: string): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEditCell(): void;
    collapseAdaptiveDetailRow(): void;
    columnCount(): number;
    columnOption(id: number | string): any;
    columnOption(id: number | string, optionName: string): any;
    columnOption(
      id: number | string,
      optionName: string,
      optionValue: any
    ): void;
    columnOption(id: number | string, options: any): void;
    deleteColumn(id: number | string): void;
    deleteRow(rowIndex: number): void;
    deselectAll(): DevExpress.core.utils.DxPromise<void>;
    deselectRows(keys: Array<any>): DevExpress.core.utils.DxPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: DevExpress.core.UserDefinedElement): void;
    getCellElement(
      rowIndex: number,
      dataField: string
    ): DevExpress.core.DxElement | undefined;
    getCellElement(
      rowIndex: number,
      visibleColumnIndex: number
    ): DevExpress.core.DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DevExpress.data.DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(
      rowIndex: number
    ): DevExpress.core.UserDefinedElementsArray | undefined;
    getRowIndexByKey(key: any | string | number): number;
    getScrollable(): dxScrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: any): boolean;
    isRowFocused(key: any): boolean;
    isRowSelected(key: any): boolean;
    keyOf(obj: any): any;
    navigateToRow(key: any): void;
    pageCount(): number;
    pageIndex(): number;
    pageIndex(newIndex: number): DevExpress.core.utils.DxPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): DevExpress.core.utils.DxPromise<void>;
    refresh(changesOnly: boolean): DevExpress.core.utils.DxPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): DevExpress.core.utils.DxPromise<void>;
    searchByText(text: string): void;
    selectAll(): DevExpress.core.utils.DxPromise<void>;
    selectRows(
      keys: Array<any>,
      preserve: boolean
    ): DevExpress.core.utils.DxPromise<any>;
    selectRowsByIndexes(
      indexes: Array<number>
    ): DevExpress.core.utils.DxPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
  }
  module dxDataGrid {
    export type AdaptiveDetailRowPreparingEvent =
      DevExpress.events.EventInfo<dxDataGrid> & AdaptiveDetailRowPreparingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface AdaptiveDetailRowPreparingInfo {
      readonly formOptions: any;
    }
    export type CellClickEvent =
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly data: any;
        readonly key: any;
        readonly value?: any;
        readonly displayValue?: any;
        readonly text: string;
        readonly columnIndex: number;
        readonly column: any;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly cellElement: DevExpress.core.DxElement;
        readonly row: RowObject;
      };
    export type CellDblClickEvent =
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly data: any;
        readonly key: any;
        readonly value?: any;
        readonly displayValue?: any;
        readonly text: string;
        readonly columnIndex: number;
        readonly column: Column;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly cellElement: DevExpress.core.DxElement;
        readonly row: RowObject;
      };
    export type CellHoverChangedEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly eventType: string;
        readonly data: any;
        readonly key: any;
        readonly value?: any;
        readonly text: string;
        readonly displayValue?: any;
        readonly columnIndex: number;
        readonly rowIndex: number;
        readonly column: Column;
        readonly rowType: string;
        readonly cellElement: DevExpress.core.DxElement;
        readonly row: RowObject;
      };
    export type CellPreparedEvent = DevExpress.events.EventInfo<dxDataGrid> & {
      readonly data: any;
      readonly key: any;
      readonly value?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly column: Column;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly row: RowObject;
      readonly isSelected?: boolean;
      readonly isExpanded?: boolean;
      readonly isNewRow?: boolean;
      readonly cellElement: DevExpress.core.DxElement;
      readonly watch?: Function;
      readonly oldValue?: any;
    };
    /**
     * [descr:dxDataGridColumn]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Column extends ColumnBase {
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
      buttons?: Array<
        'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton
      >;
      /**
       * [descr:dxDataGridColumn.calculateGroupValue]
       */
      calculateGroupValue?: string | ((rowData: any) => any);
      /**
       * [descr:dxDataGridColumn.cellTemplate]
       */
      cellTemplate?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnCellTemplateData
          ) => any);
      /**
       * [descr:dxDataGridColumn.columns]
       */
      columns?: Array<Column | string>;
      /**
       * [descr:dxDataGridColumn.editCellTemplate]
       */
      editCellTemplate?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnEditCellTemplateData
          ) => any);
      /**
       * [descr:dxDataGridColumn.groupCellTemplate]
       */
      groupCellTemplate?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnGroupCellTemplateData
          ) => any);
      /**
       * [descr:dxDataGridColumn.groupIndex]
       */
      groupIndex?: number;
      /**
       * [descr:dxDataGridColumn.headerCellTemplate]
       */
      headerCellTemplate?:
        | DevExpress.core.template
        | ((
            columnHeader: DevExpress.core.DxElement,
            headerInfo: ColumnHeaderCellTemplateData
          ) => any);
      /**
       * [descr:dxDataGridColumn.showWhenGrouped]
       */
      showWhenGrouped?: boolean;
      /**
       * [descr:dxDataGridColumn.type]
       */
      type?:
        | 'adaptive'
        | 'buttons'
        | 'detailExpand'
        | 'groupExpand'
        | 'selection';
    }
    /**
     * [descr:GridBaseColumn]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnBase {
      /**
       * [descr:GridBaseColumn.alignment]
       */
      alignment?: 'center' | 'left' | 'right';
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
      calculateCellValue?: (rowData: any) => any;
      /**
       * [descr:GridBaseColumn.calculateDisplayValue]
       */
      calculateDisplayValue?: string | ((rowData: any) => any);
      /**
       * [descr:GridBaseColumn.calculateFilterExpression]
       */
      calculateFilterExpression?: (
        filterValue: any,
        selectedFilterOperation: string,
        target: string
      ) => string | Array<any> | Function;
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
      customizeText?: (cellInfo: ColumnCustomizeTextArg) => string;
      /**
       * [descr:GridBaseColumn.dataField]
       */
      dataField?: string;
      /**
       * [descr:GridBaseColumn.dataType]
       */
      dataType?:
        | 'string'
        | 'number'
        | 'date'
        | 'boolean'
        | 'object'
        | 'datetime';
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
      filterOperations?: Array<
        | '='
        | '<>'
        | '<'
        | '<='
        | '>'
        | '>='
        | 'contains'
        | 'endswith'
        | 'isblank'
        | 'isnotblank'
        | 'notcontains'
        | 'startswith'
        | 'between'
        | 'anyof'
        | 'noneof'
      >;
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
      headerFilter?: ColumnHeaderFilter;
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
      lookup?: ColumnLookup;
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
      selectedFilterOperation?:
        | '<'
        | '<='
        | '<>'
        | '='
        | '>'
        | '>='
        | 'between'
        | 'contains'
        | 'endswith'
        | 'notcontains'
        | 'startswith';
      /**
       * [descr:GridBaseColumn.setCellValue]
       */
      setCellValue?: (
        newData: any,
        value: any,
        currentRowData: any
      ) => void | PromiseLike<void>;
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
      sortOrder?: 'asc' | 'desc';
      /**
       * [descr:GridBaseColumn.sortingMethod]
       */
      sortingMethod?: (value1: any, value2: any) => number;
      /**
       * [descr:GridBaseColumn.trueText]
       */
      trueText?: string;
      /**
       * [descr:GridBaseColumn.validationRules]
       */
      validationRules?: Array<
        | RequiredRule
        | NumericRule
        | RangeRule
        | StringLengthRule
        | CustomRule
        | CompareRule
        | PatternRule
        | EmailRule
        | AsyncRule
      >;
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
     * [descr:dxDataGridColumnButton]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnButton extends ColumnButtonBase {
      /**
       * [descr:dxDataGridColumnButton.name]
       */
      name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
      /**
       * [descr:dxDataGridColumnButton.onClick]
       */
      onClick?: (e: ColumnButtonClickEvent) => void;
      /**
       * [descr:dxDataGridColumnButton.template]
       */
      template?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnButtonTemplateData
          ) => string | DevExpress.core.UserDefinedElement);
      /**
       * [descr:dxDataGridColumnButton.visible]
       */
      visible?:
        | boolean
        | ((options: {
            component?: dxDataGrid;
            row?: RowObject;
            column?: Column;
          }) => boolean);
      /**
       * [descr:dxDataGridColumnButton.visible]
       */
      disabled?:
        | boolean
        | ((options: {
            component?: dxDataGrid;
            row?: RowObject;
            column?: Column;
          }) => boolean);
    }
    /**
     * [descr:GridBaseColumnButton]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnButtonBase {
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
    export type ColumnButtonClickEvent =
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        row?: RowObject;
        column?: Column;
      };
    export type ColumnButtonTemplateData = {
      readonly component: dxDataGrid;
      readonly data?: any;
      readonly key?: any;
      readonly columnIndex: number;
      readonly column: Column;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly row: RowObject;
    };
    export type ColumnCellTemplateData = {
      readonly data?: any;
      readonly component: dxDataGrid;
      readonly value?: any;
      readonly oldValue?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly rowIndex: number;
      readonly column: Column;
      readonly row: RowObject;
      readonly rowType: string;
      readonly watch?: Function;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnChooser {
      /**
       * [descr:GridBaseOptions.columnChooser.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:GridBaseOptions.columnChooser.emptyPanelText]
       */
      emptyPanelText?: string;
      /**
       * [descr:GridBaseOptions.columnChooser.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:GridBaseOptions.columnChooser.height]
       */
      height?: number;
      /**
       * [descr:GridBaseOptions.columnChooser.mode]
       */
      mode?: 'dragAndDrop' | 'select';
      /**
       * [descr:GridBaseOptions.columnChooser.searchTimeout]
       */
      searchTimeout?: number;
      /**
       * [descr:GridBaseOptions.columnChooser.title]
       */
      title?: string;
      /**
       * [descr:GridBaseOptions.columnChooser.width]
       */
      width?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnCustomizeTextArg {
      value?: string | number | Date;
      valueText?: string;
      target?: string;
      groupInterval?: string | number;
    }
    export type ColumnEditCellTemplateData = {
      readonly setValue?: any;
      readonly data?: any;
      readonly component: dxDataGrid;
      readonly value?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly rowIndex: number;
      readonly column: Column;
      readonly row: RowObject;
      readonly rowType: string;
      readonly watch?: Function;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnFixing {
      /**
       * [descr:GridBaseOptions.columnFixing.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:GridBaseOptions.columnFixing.texts]
       */
      texts?: ColumnFixingTexts;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnFixingTexts {
      /**
       * [descr:GridBaseOptions.columnFixing.texts.fix]
       */
      fix?: string;
      /**
       * [descr:GridBaseOptions.columnFixing.texts.leftPosition]
       */
      leftPosition?: string;
      /**
       * [descr:GridBaseOptions.columnFixing.texts.rightPosition]
       */
      rightPosition?: string;
      /**
       * [descr:GridBaseOptions.columnFixing.texts.unfix]
       */
      unfix?: string;
    }
    export type ColumnGroupCellTemplateData = {
      readonly data?: any;
      readonly component: dxDataGrid;
      readonly value?: any;
      readonly text: string;
      readonly displayValue?: any;
      readonly columnIndex: number;
      readonly rowIndex: number;
      readonly column: Column;
      readonly row: RowObject;
      readonly summaryItems: Array<any>;
      readonly groupContinuesMessage?: string;
      readonly groupContinuedMessage?: string;
    };
    export type ColumnHeaderCellTemplateData = {
      readonly component: dxDataGrid;
      readonly columnIndex: number;
      readonly column: Column;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnHeaderFilter {
      /**
       * [descr:GridBaseColumn.headerFilter.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:GridBaseColumn.headerFilter.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | ((options: {
            component?: any;
            dataSource?: DevExpress.data.DataSourceOptions;
          }) => any)
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:GridBaseColumn.headerFilter.groupInterval]
       */
      groupInterval?:
        | 'day'
        | 'hour'
        | 'minute'
        | 'month'
        | 'quarter'
        | 'second'
        | 'year'
        | number;
      /**
       * [descr:GridBaseColumn.headerFilter.height]
       */
      height?: number;
      /**
       * [descr:GridBaseColumn.headerFilter.searchMode]
       */
      searchMode?: 'contains' | 'startswith' | 'equals';
      /**
       * [descr:GridBaseColumn.headerFilter.width]
       */
      width?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnLookup {
      /**
       * [descr:GridBaseColumn.lookup.allowClearing]
       */
      allowClearing?: boolean;
      /**
       * [descr:GridBaseColumn.lookup.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.DataSourceOptions
        | DevExpress.data.Store
        | ((options: {
            data?: any;
            key?: any;
          }) =>
            | Array<any>
            | DevExpress.data.DataSourceOptions
            | DevExpress.data.Store);
      /**
       * [descr:GridBaseColumn.lookup.displayExpr]
       */
      displayExpr?: string | ((data: any) => string);
      /**
       * [descr:GridBaseColumn.lookup.valueExpr]
       */
      valueExpr?: string;
    }
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxDataGrid>;
    export type ContextMenuPreparingEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        items?: Array<any>;
        readonly target: string;
        readonly targetElement: DevExpress.core.DxElement;
        readonly columnIndex: number;
        readonly column?: Column;
        readonly rowIndex: number;
        readonly row?: RowObject;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface CustomSummaryInfo {
      readonly component: dxDataGrid;
      readonly name?: string;
      readonly summaryProcess: string;
      readonly value?: any;
      totalValue?: any;
      readonly groupIndex?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DataChangeInfo {
      readonly changes: Array<DataChange>;
    }
    export type DataErrorOccurredEvent =
      DevExpress.events.EventInfo<dxDataGrid> & DataErrorOccurredInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DataErrorOccurredInfo {
      readonly error?: Error;
    }
    export type DisposingEvent = DevExpress.events.EventInfo<dxDataGrid>;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DragDropInfo {
      readonly dropInsideItem: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DragReorderInfo {
      readonly dropInsideItem: boolean;
      promise?: PromiseLike<void>;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DragStartEventInfo<T extends GridBase> {
      readonly component: T;
      readonly event: DevExpress.events.DxEvent;
      itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
      readonly fromData?: any;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface dxDataGridSortByGroupSummaryInfoItem {
      /**
       * [descr:dxDataGridOptions.sortByGroupSummaryInfo.groupColumn]
       */
      groupColumn?: string;
      /**
       * [descr:dxDataGridOptions.sortByGroupSummaryInfo.sortOrder]
       */
      sortOrder?: 'asc' | 'desc';
      /**
       * [descr:dxDataGridOptions.sortByGroupSummaryInfo.summaryItem]
       */
      summaryItem?: string | number;
    }
    export type EditCanceledEvent = DevExpress.events.EventInfo<dxDataGrid> &
      DataChangeInfo;
    export type EditCancelingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxDataGrid> &
      DataChangeInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Editing extends EditingBase {
      /**
       * [descr:dxDataGridOptions.editing.allowAdding]
       */
      allowAdding?: boolean;
      /**
       * [descr:dxDataGridOptions.editing.allowDeleting]
       */
      allowDeleting?:
        | boolean
        | ((options: { component?: dxDataGrid; row?: RowObject }) => boolean);
      /**
       * [descr:dxDataGridOptions.editing.allowUpdating]
       */
      allowUpdating?:
        | boolean
        | ((options: { component?: dxDataGrid; row?: RowObject }) => boolean);
      /**
       * [descr:dxDataGridOptions.editing.texts]
       */
      texts?: any;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface EditingBase {
      /**
       * [descr:GridBaseOptions.editing.confirmDelete]
       */
      confirmDelete?: boolean;
      /**
       * [descr:GridBaseOptions.editing.changes]
       */
      changes?: Array<DataChange>;
      /**
       * [descr:GridBaseOptions.editing.editColumnName]
       */
      editColumnName?: string;
      /**
       * [descr:GridBaseOptions.editing.editRowKey]
       */
      editRowKey?: any;
      /**
       * [descr:GridBaseOptions.editing.form]
       */
      form?: dxFormOptions;
      /**
       * [descr:GridBaseOptions.editing.mode]
       */
      mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
      /**
       * [descr:GridBaseOptions.editing.popup]
       */
      popup?: DevExpress.ui.dxPopup.Properties;
      /**
       * [descr:GridBaseOptions.editing.refreshMode]
       */
      refreshMode?: 'full' | 'reshape' | 'repaint';
      /**
       * [descr:GridBaseOptions.editing.selectTextOnEditStart]
       */
      selectTextOnEditStart?: boolean;
      /**
       * [descr:GridBaseOptions.editing.startEditAction]
       */
      startEditAction?: 'click' | 'dblClick';
      /**
       * [descr:GridBaseOptions.editing.texts]
       */
      texts?: EditingTextsBase;
      /**
       * [descr:GridBaseOptions.editing.useIcons]
       */
      useIcons?: boolean;
    }
    export type EditingStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly data: any;
        readonly key: any;
        readonly column?: any;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface EditingTextsBase {
      /**
       * [descr:GridBaseOptions.editing.texts.addRow]
       */
      addRow?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.cancelAllChanges]
       */
      cancelAllChanges?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.cancelRowChanges]
       */
      cancelRowChanges?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.confirmDeleteMessage]
       */
      confirmDeleteMessage?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.confirmDeleteTitle]
       */
      confirmDeleteTitle?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.deleteRow]
       */
      deleteRow?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.editRow]
       */
      editRow?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.saveAllChanges]
       */
      saveAllChanges?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.saveRowChanges]
       */
      saveRowChanges?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.undeleteRow]
       */
      undeleteRow?: string;
      /**
       * [descr:GridBaseOptions.editing.texts.validationCancelChanges]
       */
      validationCancelChanges?: string;
    }
    export type EditorPreparedEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly parentType: string;
        readonly value?: any;
        readonly setValue?: any;
        readonly updateValueTimeout?: number;
        readonly width?: number;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
        readonly editorElement: DevExpress.core.DxElement;
        readonly readOnly: boolean;
        readonly dataField?: string;
        readonly row?: RowObject;
      };
    export type EditorPreparingEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly parentType: string;
        readonly value?: any;
        readonly setValue?: any;
        readonly updateValueTimeout?: number;
        readonly width?: number;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
        cancel: boolean;
        readonly editorElement: DevExpress.core.DxElement;
        readonly readOnly: boolean;
        editorName: string;
        editorOptions: any;
        readonly dataField?: string;
        readonly row?: RowObject;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ExcelCellInfo {
      readonly component: dxDataGrid;
      horizontalAlignment?:
        | 'center'
        | 'centerContinuous'
        | 'distributed'
        | 'fill'
        | 'general'
        | 'justify'
        | 'left'
        | 'right';
      verticalAlignment?:
        | 'bottom'
        | 'center'
        | 'distributed'
        | 'justify'
        | 'top';
      wrapTextEnabled?: boolean;
      backgroundColor?: string;
      fillPatternType?:
        | 'darkDown'
        | 'darkGray'
        | 'darkGrid'
        | 'darkHorizontal'
        | 'darkTrellis'
        | 'darkUp'
        | 'darkVertical'
        | 'gray0625'
        | 'gray125'
        | 'lightDown'
        | 'lightGray'
        | 'lightGrid'
        | 'lightHorizontal'
        | 'lightTrellis'
        | 'lightUp'
        | 'lightVertical'
        | 'mediumGray'
        | 'none'
        | 'solid';
      fillPatternColor?: string;
      font?: DevExpress.exporter.ExcelFont;
      readonly value?: string | number | Date;
      numberFormat?: string;
      gridCell?: DevExpress.excelExporter.ExcelDataGridCell;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Export {
      /**
       * [descr:dxDataGridOptions.export.allowExportSelectedData]
       */
      allowExportSelectedData?: boolean;
      /**
       * [descr:dxDataGridOptions.export.customizeExcelCell]
       * @deprecated [depNote:dxDataGridOptions.export.customizeExcelCell]
       */
      customizeExcelCell?: (options: ExcelCellInfo) => void;
      /**
       * [descr:dxDataGridOptions.export.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxDataGridOptions.export.excelFilterEnabled]
       * @deprecated [depNote:dxDataGridOptions.export.excelFilterEnabled]
       */
      excelFilterEnabled?: boolean;
      /**
       * [descr:dxDataGridOptions.export.excelWrapTextEnabled]
       * @deprecated [depNote:dxDataGridOptions.export.excelWrapTextEnabled]
       */
      excelWrapTextEnabled?: boolean;
      /**
       * [descr:dxDataGridOptions.export.fileName]
       * @deprecated [depNote:dxDataGridOptions.export.fileName]
       */
      fileName?: string;
      /**
       * [descr:dxDataGridOptions.export.ignoreExcelErrors]
       * @deprecated [depNote:dxDataGridOptions.export.ignoreExcelErrors]
       */
      ignoreExcelErrors?: boolean;
      /**
       * [descr:dxDataGridOptions.export.proxyUrl]
       * @deprecated [depNote:dxDataGridOptions.export.proxyUrl]
       */
      proxyUrl?: string;
      /**
       * [descr:dxDataGridOptions.export.texts]
       */
      texts?: ExportTexts;
    }
    export type ExportedEvent = DevExpress.events.EventInfo<dxDataGrid>;
    export type ExportingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxDataGrid> & {
        fileName?: string;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ExportTexts {
      /**
       * [descr:dxDataGridOptions.export.texts.exportAll]
       */
      exportAll?: string;
      /**
       * [descr:dxDataGridOptions.export.texts.exportSelectedRows]
       */
      exportSelectedRows?: string;
      /**
       * [descr:dxDataGridOptions.export.texts.exportTo]
       */
      exportTo?: string;
    }
    export type FileSavingEvent = DevExpress.events.Cancelable & {
      readonly component: dxDataGrid;
      readonly element: DevExpress.core.DxElement;
      fileName?: string;
      format?: string;
      readonly data: Blob;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FilterPanel<T extends GridBase> {
      /**
       * [descr:GridBaseOptions.filterPanel.customizeText]
       */
      customizeText?: (e: FilterPanelCustomizeTextArg<T>) => string;
      /**
       * [descr:GridBaseOptions.filterPanel.filterEnabled]
       */
      filterEnabled?: boolean;
      /**
       * [descr:GridBaseOptions.filterPanel.texts]
       */
      texts?: FilterPanelTexts;
      /**
       * [descr:GridBaseOptions.filterPanel.visible]
       */
      visible?: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FilterPanelCustomizeTextArg<T> {
      readonly component: T;
      readonly filterValue: any;
      readonly text: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FilterPanelTexts {
      /**
       * [descr:GridBaseOptions.filterPanel.texts.clearFilter]
       */
      clearFilter?: string;
      /**
       * [descr:GridBaseOptions.filterPanel.texts.createFilter]
       */
      createFilter?: string;
      /**
       * [descr:GridBaseOptions.filterPanel.texts.filterEnabledHint]
       */
      filterEnabledHint?: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FilterRow {
      /**
       * [descr:GridBaseOptions.filterRow.applyFilter]
       */
      applyFilter?: 'auto' | 'onClick';
      /**
       * [descr:GridBaseOptions.filterRow.applyFilterText]
       */
      applyFilterText?: string;
      /**
       * [descr:GridBaseOptions.filterRow.betweenEndText]
       */
      betweenEndText?: string;
      /**
       * [descr:GridBaseOptions.filterRow.betweenStartText]
       */
      betweenStartText?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions]
       */
      operationDescriptions?: FilterRowOperationDescriptions;
      /**
       * [descr:GridBaseOptions.filterRow.resetOperationText]
       */
      resetOperationText?: string;
      /**
       * [descr:GridBaseOptions.filterRow.showAllText]
       */
      showAllText?: string;
      /**
       * [descr:GridBaseOptions.filterRow.showOperationChooser]
       */
      showOperationChooser?: boolean;
      /**
       * [descr:GridBaseOptions.filterRow.visible]
       */
      visible?: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FilterRowOperationDescriptions {
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.between]
       */
      between?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.contains]
       */
      contains?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.endsWith]
       */
      endsWith?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.equal]
       */
      equal?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.greaterThan]
       */
      greaterThan?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.greaterThanOrEqual]
       */
      greaterThanOrEqual?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.lessThan]
       */
      lessThan?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.lessThanOrEqual]
       */
      lessThanOrEqual?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.notContains]
       */
      notContains?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.notEqual]
       */
      notEqual?: string;
      /**
       * [descr:GridBaseOptions.filterRow.operationDescriptions.startsWith]
       */
      startsWith?: string;
    }
    export type FocusedCellChangedEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly cellElement: DevExpress.core.DxElement;
        readonly columnIndex: number;
        readonly rowIndex: number;
        readonly row?: RowObject;
        readonly column?: Column;
      };
    export type FocusedCellChangingEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly cellElement: DevExpress.core.DxElement;
        readonly prevColumnIndex: number;
        readonly prevRowIndex: number;
        newColumnIndex: number;
        newRowIndex: number;
        readonly rows: Array<RowObject>;
        readonly columns: Array<Column>;
        isHighlighted: boolean;
      };
    export type FocusedRowChangedEvent =
      DevExpress.events.EventInfo<dxDataGrid> & {
        readonly rowElement: DevExpress.core.DxElement;
        readonly rowIndex: number;
        readonly row?: RowObject;
      };
    export type FocusedRowChangingEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly rowElement: DevExpress.core.DxElement;
        readonly prevRowIndex: number;
        newRowIndex: number;
        readonly rows: Array<RowObject>;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Grouping {
      /**
       * [descr:dxDataGridOptions.grouping.allowCollapsing]
       */
      allowCollapsing?: boolean;
      /**
       * [descr:dxDataGridOptions.grouping.autoExpandAll]
       */
      autoExpandAll?: boolean;
      /**
       * [descr:dxDataGridOptions.grouping.contextMenuEnabled]
       */
      contextMenuEnabled?: boolean;
      /**
       * [descr:dxDataGridOptions.grouping.expandMode]
       */
      expandMode?: 'buttonClick' | 'rowClick';
      /**
       * [descr:dxDataGridOptions.grouping.texts]
       */
      texts?: GroupingTexts;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface GroupingTexts {
      /**
       * [descr:dxDataGridOptions.grouping.texts.groupByThisColumn]
       */
      groupByThisColumn?: string;
      /**
       * [descr:dxDataGridOptions.grouping.texts.groupContinuedMessage]
       */
      groupContinuedMessage?: string;
      /**
       * [descr:dxDataGridOptions.grouping.texts.groupContinuesMessage]
       */
      groupContinuesMessage?: string;
      /**
       * [descr:dxDataGridOptions.grouping.texts.ungroup]
       */
      ungroup?: string;
      /**
       * [descr:dxDataGridOptions.grouping.texts.ungroupAll]
       */
      ungroupAll?: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface GroupPanel {
      /**
       * [descr:dxDataGridOptions.groupPanel.allowColumnDragging]
       */
      allowColumnDragging?: boolean;
      /**
       * [descr:dxDataGridOptions.groupPanel.emptyPanelText]
       */
      emptyPanelText?: string;
      /**
       * [descr:dxDataGridOptions.groupPanel.visible]
       */
      visible?: boolean | 'auto';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface HeaderFilter {
      /**
       * [descr:GridBaseOptions.headerFilter.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:GridBaseOptions.headerFilter.height]
       */
      height?: number;
      /**
       * [descr:GridBaseOptions.headerFilter.searchTimeout]
       */
      searchTimeout?: number;
      /**
       * [descr:GridBaseOptions.headerFilter.texts]
       */
      texts?: HeaderFilterTexts;
      /**
       * [descr:GridBaseOptions.headerFilter.visible]
       */
      visible?: boolean;
      /**
       * [descr:GridBaseOptions.headerFilter.width]
       */
      width?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface HeaderFilterTexts {
      /**
       * [descr:GridBaseOptions.headerFilter.texts.cancel]
       */
      cancel?: string;
      /**
       * [descr:GridBaseOptions.headerFilter.texts.emptyValue]
       */
      emptyValue?: string;
      /**
       * [descr:GridBaseOptions.headerFilter.texts.ok]
       */
      ok?: string;
    }
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDataGrid>;
    export type InitNewRowEvent = DevExpress.events.EventInfo<dxDataGrid> &
      NewRowInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface KeyboardNavigation {
      /**
       * [descr:GridBaseOptions.keyboardNavigation.editOnKeyPress]
       */
      editOnKeyPress?: boolean;
      /**
       * [descr:GridBaseOptions.keyboardNavigation.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:GridBaseOptions.keyboardNavigation.enterKeyAction]
       */
      enterKeyAction?: 'startEdit' | 'moveFocus';
      /**
       * [descr:GridBaseOptions.keyboardNavigation.enterKeyDirection]
       */
      enterKeyDirection?: 'none' | 'column' | 'row';
    }
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxDataGrid> &
      KeyDownInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface KeyDownInfo {
      handled: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface LoadPanel {
      /**
       * [descr:GridBaseOptions.loadPanel.enabled]
       */
      enabled?: boolean | 'auto';
      /**
       * [descr:GridBaseOptions.loadPanel.height]
       */
      height?: number;
      /**
       * [descr:GridBaseOptions.loadPanel.indicatorSrc]
       */
      indicatorSrc?: string;
      /**
       * [descr:GridBaseOptions.loadPanel.shading]
       */
      shading?: boolean;
      /**
       * [descr:GridBaseOptions.loadPanel.shadingColor]
       */
      shadingColor?: string;
      /**
       * [descr:GridBaseOptions.loadPanel.showIndicator]
       */
      showIndicator?: boolean;
      /**
       * [descr:GridBaseOptions.loadPanel.showPane]
       */
      showPane?: boolean;
      /**
       * [descr:GridBaseOptions.loadPanel.text]
       */
      text?: string;
      /**
       * [descr:GridBaseOptions.loadPanel.width]
       */
      width?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface MasterDetail {
      /**
       * [descr:dxDataGridOptions.masterDetail.autoExpandAll]
       */
      autoExpandAll?: boolean;
      /**
       * [descr:dxDataGridOptions.masterDetail.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxDataGridOptions.masterDetail.template]
       */
      template?:
        | DevExpress.core.template
        | ((
            detailElement: DevExpress.core.DxElement,
            detailInfo: MasterDetailTemplateData
          ) => any);
    }
    export type MasterDetailTemplateData = {
      readonly key: any;
      readonly data: any;
      readonly watch?: Function;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface NewRowInfo {
      data: any;
      promise?: PromiseLike<void>;
    }
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      DevExpress.events.ChangedOptionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Pager {
      /**
       * [descr:GridBaseOptions.pager.allowedPageSizes]
       */
      allowedPageSizes?: Array<number | 'all'> | 'auto';
      /**
       * [descr:GridBaseOptions.pager.displayMode]
       */
      displayMode?: 'adaptive' | 'compact' | 'full';
      /**
       * [descr:GridBaseOptions.pager.infoText]
       */
      infoText?: string;
      /**
       * [descr:GridBaseOptions.pager.showInfo]
       */
      showInfo?: boolean;
      /**
       * [descr:GridBaseOptions.pager.showNavigationButtons]
       */
      showNavigationButtons?: boolean;
      /**
       * [descr:GridBaseOptions.pager.showPageSizeSelector]
       */
      showPageSizeSelector?: boolean;
      /**
       * [descr:GridBaseOptions.pager.visible]
       */
      visible?: boolean | 'auto';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface PagingBase {
      /**
       * [descr:GridBaseOptions.paging.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:GridBaseOptions.paging.pageIndex]
       */
      pageIndex?: number;
      /**
       * [descr:GridBaseOptions.paging.pageSize]
       */
      pageSize?: number;
    }
    export type Properties = dxDataGridOptions;
    export type RowClickEvent =
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly data: any;
        readonly key: any;
        readonly values: Array<any>;
        readonly columns: Array<any>;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly isSelected?: boolean;
        readonly isExpanded?: boolean;
        readonly isNewRow?: boolean;
        readonly groupIndex?: number;
        readonly rowElement: DevExpress.core.DxElement;
        readonly handled: boolean;
      };
    export type RowCollapsedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowKeyInfo;
    export type RowCollapsingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxDataGrid> &
      RowKeyInfo;
    export type RowDblClickEvent =
      DevExpress.events.NativeEventInfo<dxDataGrid> & {
        readonly data: any;
        readonly key: any;
        readonly values: Array<any>;
        readonly columns: Array<Column>;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly isSelected?: boolean;
        readonly isExpanded?: boolean;
        readonly isNewRow?: boolean;
        readonly groupIndex?: number;
        readonly rowElement: DevExpress.core.DxElement;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowDragging<T extends GridBase> {
      /**
       * [descr:GridBaseOptions.rowDragging.allowDropInsideItem]
       */
      allowDropInsideItem?: boolean;
      /**
       * [descr:GridBaseOptions.rowDragging.allowReordering]
       */
      allowReordering?: boolean;
      /**
       * [descr:GridBaseOptions.rowDragging.autoScroll]
       */
      autoScroll?: boolean;
      /**
       * [descr:GridBaseOptions.rowDragging.boundary]
       */
      boundary?: string | DevExpress.core.UserDefinedElement;
      /**
       * [descr:GridBaseOptions.rowDragging.container]
       */
      container?: string | DevExpress.core.UserDefinedElement;
      /**
       * [descr:GridBaseOptions.rowDragging.cursorOffset]
       */
      cursorOffset?:
        | string
        | {
            /**
             * [descr:GridBaseOptions.rowDragging.cursorOffset.x]
             */
            x?: number;
            /**
             * [descr:GridBaseOptions.rowDragging.cursorOffset.y]
             */
            y?: number;
          };
      /**
       * [descr:GridBaseOptions.rowDragging.data]
       */
      data?: any;
      /**
       * [descr:GridBaseOptions.rowDragging.dragDirection]
       */
      dragDirection?: 'both' | 'horizontal' | 'vertical';
      /**
       * [descr:GridBaseOptions.rowDragging.dragTemplate]
       */
      dragTemplate?:
        | DevExpress.core.template
        | ((
            dragInfo: RowDraggingTemplateData,
            containerElement: DevExpress.core.DxElement
          ) => string | DevExpress.core.UserDefinedElement);
      /**
       * [descr:GridBaseOptions.rowDragging.dropFeedbackMode]
       */
      dropFeedbackMode?: 'push' | 'indicate';
      /**
       * [descr:GridBaseOptions.rowDragging.filter]
       */
      filter?: string;
      /**
       * [descr:GridBaseOptions.rowDragging.group]
       */
      group?: string;
      /**
       * [descr:GridBaseOptions.rowDragging.handle]
       */
      handle?: string;
      /**
       * [descr:GridBaseOptions.rowDragging.onAdd]
       */
      onAdd?: (e: RowDraggingEventInfo<T> & DragDropInfo) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onDragChange]
       */
      onDragChange?: (
        e: DevExpress.events.Cancelable & RowDraggingEventInfo<T> & DragDropInfo
      ) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onDragEnd]
       */
      onDragEnd?: (
        e: DevExpress.events.Cancelable & RowDraggingEventInfo<T> & DragDropInfo
      ) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onDragMove]
       */
      onDragMove?: (
        e: DevExpress.events.Cancelable & RowDraggingEventInfo<T> & DragDropInfo
      ) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onDragStart]
       */
      onDragStart?: (
        e: DevExpress.events.Cancelable & DragStartEventInfo<T>
      ) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onRemove]
       */
      onRemove?: (e: RowDraggingEventInfo<T>) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.onReorder]
       */
      onReorder?: (
        e: RowDraggingEventInfo<dxDataGrid> & DragReorderInfo
      ) => void;
      /**
       * [descr:GridBaseOptions.rowDragging.scrollSensitivity]
       */
      scrollSensitivity?: number;
      /**
       * [descr:GridBaseOptions.rowDragging.scrollSpeed]
       */
      scrollSpeed?: number;
      /**
       * [descr:GridBaseOptions.rowDragging.showDragIcons]
       */
      showDragIcons?: boolean;
    }
    export type RowDraggingAddEvent = RowDraggingEventInfo<dxDataGrid> &
      DragDropInfo;
    export type RowDraggingChangeEvent = DevExpress.events.Cancelable &
      RowDraggingEventInfo<dxDataGrid> &
      DragDropInfo;
    export type RowDraggingEndEvent = DevExpress.events.Cancelable &
      RowDraggingEventInfo<dxDataGrid> &
      DragDropInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowDraggingEventInfo<T extends GridBase> {
      readonly component: T;
      readonly event: DevExpress.events.DxEvent;
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
      readonly toIndex: number;
      readonly fromComponent: dxSortable | dxDraggable;
      readonly toComponent: dxSortable | dxDraggable;
      readonly fromData?: any;
      readonly toData?: any;
    }
    export type RowDraggingMoveEvent = DevExpress.events.Cancelable &
      RowDraggingEventInfo<dxDataGrid> &
      DragDropInfo;
    export type RowDraggingRemoveEvent = RowDraggingEventInfo<dxDataGrid>;
    export type RowDraggingReorderEvent = RowDraggingEventInfo<dxDataGrid> &
      DragReorderInfo;
    export type RowDraggingStartEvent = DevExpress.events.Cancelable &
      DragStartEventInfo<dxDataGrid>;
    export type RowDraggingTemplateData = RowDraggingTemplateDataModel;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowDraggingTemplateDataModel {
      readonly itemData: any;
      readonly itemElement: DevExpress.core.DxElement;
    }
    export type RowExpandedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowKeyInfo;
    export type RowExpandingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxDataGrid> &
      RowKeyInfo;
    export type RowInsertedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowInsertedInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowInsertedInfo {
      readonly data: any;
      readonly key: any;
      readonly error: Error;
    }
    export type RowInsertingEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowInsertingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowInsertingInfo {
      data: any;
      cancel: boolean | PromiseLike<void>;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowKeyInfo {
      readonly key: any;
    }
    /**
     * [descr:dxDataGridRowObject]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowObject {
      /**
       * [descr:dxDataGridRowObject.data]
       */
      readonly data: any;
      /**
       * [descr:dxDataGridRowObject.groupIndex]
       */
      readonly groupIndex?: number;
      /**
       * [descr:dxDataGridRowObject.isEditing]
       */
      readonly isEditing?: boolean;
      /**
       * [descr:dxDataGridRowObject.isExpanded]
       */
      readonly isExpanded?: boolean;
      /**
       * [descr:dxDataGridRowObject.isNewRow]
       */
      readonly isNewRow?: boolean;
      /**
       * [descr:dxDataGridRowObject.isSelected]
       */
      readonly isSelected?: boolean;
      /**
       * [descr:dxDataGridRowObject.key]
       */
      readonly key: any;
      /**
       * [descr:dxDataGridRowObject.rowIndex]
       */
      readonly rowIndex: number;
      /**
       * [descr:dxDataGridRowObject.rowType]
       */
      readonly rowType: string;
      /**
       * [descr:dxDataGridRowObject.values]
       */
      readonly values: Array<any>;
    }
    export type RowPreparedEvent = DevExpress.events.EventInfo<dxDataGrid> & {
      readonly data: any;
      readonly key: any;
      readonly values: Array<any>;
      readonly columns: Array<Column>;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly groupIndex?: number;
      readonly isSelected?: boolean;
      readonly isExpanded?: boolean;
      readonly isNewRow?: boolean;
      readonly rowElement: DevExpress.core.DxElement;
    };
    export type RowRemovedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowRemovedInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowRemovedInfo {
      readonly data: any;
      readonly key: any;
      readonly error: Error;
    }
    export type RowRemovingEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowRemovingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowRemovingInfo {
      readonly data: any;
      readonly key: any;
      cancel: boolean | PromiseLike<void>;
    }
    export type RowTemplateData = {
      readonly key: any;
      readonly data: any;
      readonly component: dxDataGrid;
      readonly values: Array<any>;
      readonly rowIndex: number;
      readonly columns: Array<Column>;
      readonly isSelected?: boolean;
      readonly rowType: string;
      readonly groupIndex?: number;
      readonly isExpanded?: boolean;
    };
    export type RowUpdatedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowUpdatedInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowUpdatedInfo {
      readonly data: any;
      readonly key: any;
      readonly error: Error;
    }
    export type RowUpdatingEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowUpdatingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowUpdatingInfo {
      readonly oldData: any;
      newData: any;
      readonly key: any;
      cancel: boolean | PromiseLike<void>;
    }
    export type RowValidatingEvent = DevExpress.events.EventInfo<dxDataGrid> &
      RowValidatingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowValidatingInfo {
      readonly brokenRules: Array<
        | RequiredRule
        | NumericRule
        | RangeRule
        | StringLengthRule
        | CustomRule
        | CompareRule
        | PatternRule
        | EmailRule
        | AsyncRule
      >;
      isValid: boolean;
      readonly key: any;
      readonly newData: any;
      readonly oldData: any;
      errorText: string;
      promise?: PromiseLike<void>;
    }
    export type SavedEvent = DevExpress.events.EventInfo<dxDataGrid> &
      DataChangeInfo;
    export type SavingEvent = DevExpress.events.EventInfo<dxDataGrid> &
      SavingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SavingInfo {
      changes: Array<DataChange>;
      promise?: PromiseLike<void>;
      cancel: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Scrolling extends ScrollingBase {
      /**
       * [descr:dxDataGridOptions.scrolling.mode]
       */
      mode?: 'infinite' | 'standard' | 'virtual';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ScrollingBase {
      /**
       * [descr:GridBaseOptions.scrolling.columnRenderingMode]
       */
      columnRenderingMode?: 'standard' | 'virtual';
      /**
       * [descr:GridBaseOptions.scrolling.preloadEnabled]
       */
      preloadEnabled?: boolean;
      /**
       * [descr:GridBaseOptions.scrolling.rowRenderingMode]
       */
      rowRenderingMode?: 'standard' | 'virtual';
      /**
       * [descr:GridBaseOptions.scrolling.scrollByContent]
       */
      scrollByContent?: boolean;
      /**
       * [descr:GridBaseOptions.scrolling.scrollByThumb]
       */
      scrollByThumb?: boolean;
      /**
       * [descr:GridBaseOptions.scrolling.showScrollbar]
       */
      showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
      /**
       * [descr:GridBaseOptions.scrolling.useNative]
       */
      useNative?: boolean | 'auto';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SearchPanel {
      /**
       * [descr:GridBaseOptions.searchPanel.highlightCaseSensitive]
       */
      highlightCaseSensitive?: boolean;
      /**
       * [descr:GridBaseOptions.searchPanel.highlightSearchText]
       */
      highlightSearchText?: boolean;
      /**
       * [descr:GridBaseOptions.searchPanel.placeholder]
       */
      placeholder?: string;
      /**
       * [descr:GridBaseOptions.searchPanel.searchVisibleColumnsOnly]
       */
      searchVisibleColumnsOnly?: boolean;
      /**
       * [descr:GridBaseOptions.searchPanel.text]
       */
      text?: string;
      /**
       * [descr:GridBaseOptions.searchPanel.visible]
       */
      visible?: boolean;
      /**
       * [descr:GridBaseOptions.searchPanel.width]
       */
      width?: number;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Selection extends SelectionBase {
      /**
       * [descr:dxDataGridOptions.selection.deferred]
       */
      deferred?: boolean;
      /**
       * [descr:dxDataGridOptions.selection.selectAllMode]
       */
      selectAllMode?: 'allPages' | 'page';
      /**
       * [descr:dxDataGridOptions.selection.showCheckBoxesMode]
       */
      showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SelectionBase {
      /**
       * [descr:GridBaseOptions.selection.allowSelectAll]
       */
      allowSelectAll?: boolean;
      /**
       * [descr:GridBaseOptions.selection.mode]
       */
      mode?: 'multiple' | 'none' | 'single';
    }
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxDataGrid> & SelectionChangedInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SelectionChangedInfo {
      readonly currentSelectedRowKeys: Array<any>;
      readonly currentDeselectedRowKeys: Array<any>;
      readonly selectedRowKeys: Array<any>;
      readonly selectedRowsData: Array<any>;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Sorting {
      /**
       * [descr:GridBaseOptions.sorting.ascendingText]
       */
      ascendingText?: string;
      /**
       * [descr:GridBaseOptions.sorting.clearText]
       */
      clearText?: string;
      /**
       * [descr:GridBaseOptions.sorting.descendingText]
       */
      descendingText?: string;
      /**
       * [descr:GridBaseOptions.sorting.mode]
       */
      mode?: 'multiple' | 'none' | 'single';
      /**
       * [descr:GridBaseOptions.sorting.showSortIndexes]
       */
      showSortIndexes?: boolean;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface StateStoring {
      /**
       * [descr:GridBaseOptions.stateStoring.customLoad]
       */
      customLoad?: () => PromiseLike<any>;
      /**
       * [descr:GridBaseOptions.stateStoring.customSave]
       */
      customSave?: (gridState: any) => any;
      /**
       * [descr:GridBaseOptions.stateStoring.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:GridBaseOptions.stateStoring.savingTimeout]
       */
      savingTimeout?: number;
      /**
       * [descr:GridBaseOptions.stateStoring.storageKey]
       */
      storageKey?: string;
      /**
       * [descr:GridBaseOptions.stateStoring.type]
       */
      type?: 'custom' | 'localStorage' | 'sessionStorage';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Summary {
      /**
       * [descr:dxDataGridOptions.summary.calculateCustomSummary]
       */
      calculateCustomSummary?: (options: CustomSummaryInfo) => void;
      /**
       * [descr:dxDataGridOptions.summary.groupItems]
       */
      groupItems?: Array<SummaryGroupItem>;
      /**
       * [descr:dxDataGridOptions.summary.recalculateWhileEditing]
       */
      recalculateWhileEditing?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.skipEmptyValues]
       */
      skipEmptyValues?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.texts]
       */
      texts?: SummaryTexts;
      /**
       * [descr:dxDataGridOptions.summary.totalItems]
       */
      totalItems?: Array<SummaryTotalItem>;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SummaryGroupItem {
      /**
       * [descr:dxDataGridOptions.summary.groupItems.alignByColumn]
       */
      alignByColumn?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.column]
       */
      column?: string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.customizeText]
       */
      customizeText?: (itemInfo: SummaryItemTextInfo) => string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.displayFormat]
       */
      displayFormat?: string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.name]
       */
      name?: string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.showInColumn]
       */
      showInColumn?: string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.showInGroupFooter]
       */
      showInGroupFooter?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.skipEmptyValues]
       */
      skipEmptyValues?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.summaryType]
       */
      summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
      /**
       * [descr:dxDataGridOptions.summary.groupItems.valueFormat]
       */
      valueFormat?: format;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SummaryItemTextInfo {
      readonly value?: string | number | Date;
      readonly valueText: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SummaryTexts {
      /**
       * [descr:dxDataGridOptions.summary.texts.avg]
       */
      avg?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.avgOtherColumn]
       */
      avgOtherColumn?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.count]
       */
      count?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.max]
       */
      max?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.maxOtherColumn]
       */
      maxOtherColumn?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.min]
       */
      min?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.minOtherColumn]
       */
      minOtherColumn?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.sum]
       */
      sum?: string;
      /**
       * [descr:dxDataGridOptions.summary.texts.sumOtherColumn]
       */
      sumOtherColumn?: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface SummaryTotalItem {
      /**
       * [descr:dxDataGridOptions.summary.totalItems.alignment]
       */
      alignment?: 'center' | 'left' | 'right';
      /**
       * [descr:dxDataGridOptions.summary.totalItems.column]
       */
      column?: string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.cssClass]
       */
      cssClass?: string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.customizeText]
       */
      customizeText?: (itemInfo: SummaryItemTextInfo) => string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.displayFormat]
       */
      displayFormat?: string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.name]
       */
      name?: string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.showInColumn]
       */
      showInColumn?: string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.skipEmptyValues]
       */
      skipEmptyValues?: boolean;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.summaryType]
       */
      summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
      /**
       * [descr:dxDataGridOptions.summary.totalItems.valueFormat]
       */
      valueFormat?: format;
    }
    export type ToolbarPreparingEvent =
      DevExpress.events.EventInfo<dxDataGrid> & ToolbarPreparingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ToolbarPreparingInfo {
      toolbarOptions: dxToolbarOptions;
    }
  }
  /**
   * @deprecated 
   */
  export type dxDataGridColumn = DevExpress.ui.dxDataGrid.Column;
  /**
   * @deprecated 
   */
  export type dxDataGridColumnButton = DevExpress.ui.dxDataGrid.ColumnButton;
  /**
   * @deprecated 
   */
  export type dxDataGridEditing = DevExpress.ui.dxDataGrid.Editing;
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
    /**
     * [descr:dxDataGridOptions.columns]
     */
    columns?: Array<DevExpress.ui.dxDataGrid.Column | string>;
    /**
     * [descr:dxDataGridOptions.customizeColumns]
     */
    customizeColumns?: (
      columns: Array<DevExpress.ui.dxDataGrid.Column>
    ) => void;
    /**
     * [descr:dxDataGridOptions.customizeExportData]
     * @deprecated [depNote:dxDataGridOptions.customizeExportData]
     */
    customizeExportData?: (
      columns: Array<DevExpress.ui.dxDataGrid.Column>,
      rows: Array<DevExpress.ui.dxDataGrid.RowObject>
    ) => void;
    /**
     * [descr:dxDataGridOptions.editing]
     */
    editing?: DevExpress.ui.dxDataGrid.Editing;
    /**
     * [descr:dxDataGridOptions.export]
     */
    export?: DevExpress.ui.dxDataGrid.Export;
    /**
     * [descr:dxDataGridOptions.groupPanel]
     */
    groupPanel?: DevExpress.ui.dxDataGrid.GroupPanel;
    /**
     * [descr:dxDataGridOptions.grouping]
     */
    grouping?: DevExpress.ui.dxDataGrid.Grouping;
    /**
     * [descr:dxDataGridOptions.keyExpr]
     */
    keyExpr?: string | Array<string>;
    /**
     * [descr:dxDataGridOptions.masterDetail]
     */
    masterDetail?: DevExpress.ui.dxDataGrid.MasterDetail;
    /**
     * [descr:dxDataGridOptions.onCellClick]
     */
    onCellClick?: (e: DevExpress.ui.dxDataGrid.CellClickEvent) => void;
    /**
     * [descr:dxDataGridOptions.onCellDblClick]
     */
    onCellDblClick?: (e: DevExpress.ui.dxDataGrid.CellDblClickEvent) => void;
    /**
     * [descr:dxDataGridOptions.onCellHoverChanged]
     */
    onCellHoverChanged?: (
      e: DevExpress.ui.dxDataGrid.CellHoverChangedEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onCellPrepared]
     */
    onCellPrepared?: (e: DevExpress.ui.dxDataGrid.CellPreparedEvent) => void;
    /**
     * [descr:dxDataGridOptions.onContextMenuPreparing]
     */
    onContextMenuPreparing?: (
      e: DevExpress.ui.dxDataGrid.ContextMenuPreparingEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onEditingStart]
     */
    onEditingStart?: (e: DevExpress.ui.dxDataGrid.EditingStartEvent) => void;
    /**
     * [descr:dxDataGridOptions.onEditorPrepared]
     */
    onEditorPrepared?: (
      options: DevExpress.ui.dxDataGrid.EditorPreparedEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onEditorPreparing]
     */
    onEditorPreparing?: (
      e: DevExpress.ui.dxDataGrid.EditorPreparingEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onExported]
     * @deprecated [depNote:dxDataGridOptions.onExported]
     */
    onExported?: (e: DevExpress.ui.dxDataGrid.ExportedEvent) => void;
    /**
     * [descr:dxDataGridOptions.onExporting]
     */
    onExporting?: (e: DevExpress.ui.dxDataGrid.ExportingEvent) => void;
    /**
     * [descr:dxDataGridOptions.onFileSaving]
     * @deprecated [depNote:dxDataGridOptions.onFileSaving]
     */
    onFileSaving?: (e: DevExpress.ui.dxDataGrid.FileSavingEvent) => void;
    /**
     * [descr:dxDataGridOptions.onFocusedCellChanged]
     */
    onFocusedCellChanged?: (
      e: DevExpress.ui.dxDataGrid.FocusedCellChangedEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onFocusedCellChanging]
     */
    onFocusedCellChanging?: (
      e: DevExpress.ui.dxDataGrid.FocusedCellChangingEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onFocusedRowChanged]
     */
    onFocusedRowChanged?: (
      e: DevExpress.ui.dxDataGrid.FocusedRowChangedEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onFocusedRowChanging]
     */
    onFocusedRowChanging?: (
      e: DevExpress.ui.dxDataGrid.FocusedRowChangingEvent
    ) => void;
    /**
     * [descr:dxDataGridOptions.onRowClick]
     */
    onRowClick?: (e: DevExpress.ui.dxDataGrid.RowClickEvent) => void;
    /**
     * [descr:dxDataGridOptions.onRowDblClick]
     */
    onRowDblClick?: (e: DevExpress.ui.dxDataGrid.RowDblClickEvent) => void;
    /**
     * [descr:dxDataGridOptions.onRowPrepared]
     */
    onRowPrepared?: (e: DevExpress.ui.dxDataGrid.RowPreparedEvent) => void;
    /**
     * [descr:dxDataGridOptions.remoteOperations]
     */
    remoteOperations?:
      | boolean
      | {
          /**
           * [descr:dxDataGridOptions.remoteOperations.filtering]
           */
          filtering?: boolean;
          /**
           * [descr:dxDataGridOptions.remoteOperations.groupPaging]
           */
          groupPaging?: boolean;
          /**
           * [descr:dxDataGridOptions.remoteOperations.grouping]
           */
          grouping?: boolean;
          /**
           * [descr:dxDataGridOptions.remoteOperations.paging]
           */
          paging?: boolean;
          /**
           * [descr:dxDataGridOptions.remoteOperations.sorting]
           */
          sorting?: boolean;
          /**
           * [descr:dxDataGridOptions.remoteOperations.summary]
           */
          summary?: boolean;
        }
      | 'auto';
    /**
     * [descr:dxDataGridOptions.rowTemplate]
     */
    rowTemplate?:
      | DevExpress.core.template
      | ((
          rowElement: DevExpress.core.DxElement,
          rowInfo: DevExpress.ui.dxDataGrid.RowTemplateData
        ) => any);
    /**
     * [descr:dxDataGridOptions.scrolling]
     */
    scrolling?: DevExpress.ui.dxDataGrid.Scrolling;
    /**
     * [descr:dxDataGridOptions.selection]
     */
    selection?: DevExpress.ui.dxDataGrid.Selection;
    /**
     * [descr:dxDataGridOptions.selectionFilter]
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * [descr:dxDataGridOptions.sortByGroupSummaryInfo]
     */
    sortByGroupSummaryInfo?: Array<DevExpress.ui.dxDataGrid.dxDataGridSortByGroupSummaryInfoItem>;
    /**
     * [descr:dxDataGridOptions.summary]
     */
    summary?: DevExpress.ui.dxDataGrid.Summary;
  }
  /**
   * @deprecated 
   */
  export type dxDataGridRowObject = DevExpress.ui.dxDataGrid.RowObject;
  /**
   * @deprecated 
   */
  export type dxDataGridScrolling = DevExpress.ui.dxDataGrid.Scrolling;
  /**
   * @deprecated 
   */
  export type dxDataGridSelection = DevExpress.ui.dxDataGrid.Selection;
  /**
   * [descr:dxDateBox]
   */
  export class dxDateBox extends dxDropDownEditor<dxDateBoxOptions> {
    /**
     * [descr:dxDateBox.close()]
     */
    close(): void;
    /**
     * [descr:dxDateBox.open()]
     */
    open(): void;
  }
  module dxDateBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxDateBox>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxDateBox>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type DisabledDate =
      DevExpress.ui.dxCalendar.ComponentDisabledDate<dxDateBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxDateBox>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDateBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type OpenedEvent = DevExpress.events.EventInfo<dxDateBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxDateBox> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxDateBox>;
    export type Properties = dxDateBoxOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxDateBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
    /**
     * [descr:dxDateBoxOptions.adaptivityEnabled]
     */
    adaptivityEnabled?: boolean;
    /**
     * [descr:dxDateBoxOptions.applyButtonText]
     */
    applyButtonText?: string;
    /**
     * [descr:dxDateBoxOptions.calendarOptions]
     */
    calendarOptions?: dxCalendarOptions;
    /**
     * [descr:dxDateBoxOptions.cancelButtonText]
     */
    cancelButtonText?: string;
    /**
     * [descr:dxDateBoxOptions.dateOutOfRangeMessage]
     */
    dateOutOfRangeMessage?: string;
    /**
     * [descr:dxDateBoxOptions.dateSerializationFormat]
     */
    dateSerializationFormat?: string;
    /**
     * [descr:dxDateBoxOptions.disabledDates]
     */
    disabledDates?:
      | Array<Date>
      | ((data: DevExpress.ui.dxDateBox.DisabledDate) => boolean);
    /**
     * [descr:dxDateBoxOptions.displayFormat]
     */
    displayFormat?: format;
    /**
     * [descr:dxDateBoxOptions.interval]
     */
    interval?: number;
    /**
     * [descr:dxDateBoxOptions.invalidDateMessage]
     */
    invalidDateMessage?: string;
    /**
     * [descr:dxDateBoxOptions.max]
     */
    max?: Date | number | string;
    /**
     * [descr:dxDateBoxOptions.min]
     */
    min?: Date | number | string;
    /**
     * [descr:dxDateBoxOptions.pickerType]
     */
    pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
    /**
     * [descr:dxDateBoxOptions.placeholder]
     */
    placeholder?: string;
    /**
     * [descr:dxDateBoxOptions.showAnalogClock]
     */
    showAnalogClock?: boolean;
    /**
     * [descr:dxDateBoxOptions.type]
     */
    type?: 'date' | 'datetime' | 'time';
    /**
     * [descr:dxDateBoxOptions.useMaskBehavior]
     */
    useMaskBehavior?: boolean;
    /**
     * [descr:dxDateBoxOptions.value]
     */
    value?: Date | number | string;

    /**
     * [descr:dxDateBoxOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
  }
  /**
   * [descr:dxDeferRendering]
   */
  export class dxDeferRendering extends Widget<dxDeferRenderingOptions> {}
  module dxDeferRendering {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxDeferRendering>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxDeferRendering>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDeferRendering>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxDeferRendering> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxDeferRenderingOptions;
    export type RenderedEvent = DevExpress.events.EventInfo<dxDeferRendering>;
    export type ShownEvent = DevExpress.events.EventInfo<dxDeferRendering>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDeferRenderingOptions
    extends WidgetOptions<dxDeferRendering> {
    /**
     * [descr:dxDeferRenderingOptions.animation]
     */
    animation?: animationConfig;
    /**
     * [descr:dxDeferRenderingOptions.onRendered]
     */
    onRendered?: (e: {
      component?: dxDeferRendering;
      element?: DevExpress.core.DxElement;
      model?: any;
    }) => void;
    /**
     * [descr:dxDeferRenderingOptions.onShown]
     */
    onShown?: (e: {
      component?: dxDeferRendering;
      element?: DevExpress.core.DxElement;
      model?: any;
    }) => void;
    /**
     * [descr:dxDeferRenderingOptions.renderWhen]
     */
    renderWhen?: PromiseLike<void> | boolean;
    /**
     * [descr:dxDeferRenderingOptions.showLoadIndicator]
     */
    showLoadIndicator?: boolean;
    /**
     * [descr:dxDeferRenderingOptions.staggerItemSelector]
     */
    staggerItemSelector?: string;
  }
  /**
   * [descr:dxDiagram]
   */
  export class dxDiagram extends Widget<dxDiagramOptions> {
    /**
     * [descr:dxDiagram.getNodeDataSource()]
     */
    getNodeDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxDiagram.getEdgeDataSource()]
     */
    getEdgeDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxDiagram.getItemByKey(key)]
     */
    getItemByKey(key: Object): dxDiagramItem;
    /**
     * [descr:dxDiagram.getItemById(id)]
     */
    getItemById(id: string): dxDiagramItem;
    /**
     * [descr:dxDiagram.getItems()]
     */
    getItems(): Array<dxDiagramItem>;
    /**
     * [descr:dxDiagram.getSelectedItems()]
     */
    getSelectedItems(): Array<dxDiagramItem>;
    /**
     * [descr:dxDiagram.setSelectedItems(items)]
     */
    setSelectedItems(items: Array<dxDiagramItem>): void;
    /**
     * [descr:dxDiagram.scrollToItem(item)]
     */
    scrollToItem(item: dxDiagramItem): void;
    /**
     * [descr:dxDiagram.export()]
     */
    export(): string;
    /**
     * [descr:dxDiagram.exportTo(format, callback)]
     */
    exportTo(format: 'svg' | 'png' | 'jpg', callback: Function): void;
    /**
     * [descr:dxDiagram.import(data, updateExistingItemsOnly)]
     */
    import(data: string, updateExistingItemsOnly?: boolean): void;
    /**
     * [descr:dxDiagram.updateToolbox()]
     */
    updateToolbox(): void;
  }
  module dxDiagram {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxDiagram>;
    export type CustomCommandEvent = {
      readonly component: dxDiagram;
      readonly element: DevExpress.core.DxElement;
      readonly name: string;
    };
    export type CustomShapeTemplateData = {
      readonly item: dxDiagramShape;
    };
    export type CustomShapeToolboxTemplateData = {
      readonly item: dxDiagramShape;
    };
    export type DisposingEvent = DevExpress.events.EventInfo<dxDiagram>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDiagram>;
    export type ItemClickEvent = DevExpress.events.EventInfo<dxDiagram> & {
      readonly item: dxDiagramItem;
    };
    export type ItemDblClickEvent = DevExpress.events.EventInfo<dxDiagram> & {
      readonly item: dxDiagramItem;
    };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxDiagram> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxDiagramOptions;
    export type RequestEditOperationEvent =
      DevExpress.events.EventInfo<dxDiagram> & {
        readonly operation:
          | 'addShape'
          | 'addShapeFromToolbox'
          | 'deleteShape'
          | 'deleteConnector'
          | 'changeConnection'
          | 'changeConnectorPoints';
        readonly args:
          | dxDiagramAddShapeArgs
          | dxDiagramAddShapeFromToolboxArgs
          | dxDiagramDeleteShapeArgs
          | dxDiagramDeleteConnectorArgs
          | dxDiagramChangeConnectionArgs
          | dxDiagramChangeConnectorPointsArgs
          | dxDiagramBeforeChangeShapeTextArgs
          | dxDiagramChangeShapeTextArgs
          | dxDiagramBeforeChangeConnectorTextArgs
          | dxDiagramChangeConnectorTextArgs
          | dxDiagramResizeShapeArgs
          | dxDiagramMoveShapeArgs;
        readonly reason: 'checkUIElementAvailability' | 'modelModification';
        allowed?: boolean;
      };
    export type RequestLayoutUpdateEvent =
      DevExpress.events.EventInfo<dxDiagram> & {
        readonly changes: any[];
        allowed?: boolean;
      };
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxDiagram> & {
        readonly items: Array<dxDiagramItem>;
      };
  }
  /**
   * [descr:dxDiagramAddShapeArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramAddShapeArgs {
    /**
     * [descr:dxDiagramAddShapeArgs.shape]
     */
    shape?: dxDiagramShape;
    /**
     * [descr:dxDiagramAddShapeArgs.position]
     */
    position?: {
      /**
       * [descr:dxDiagramAddShapeArgs.position.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramAddShapeArgs.position.y]
       */
      y?: number;
    };
  }
  /**
   * [descr:dxDiagramAddShapeFromToolboxArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramAddShapeFromToolboxArgs {
    /**
     * [descr:dxDiagramAddShapeFromToolboxArgs.shapeType]
     */
    shapeType?:
      | 'text'
      | 'rectangle'
      | 'ellipse'
      | 'cross'
      | 'triangle'
      | 'diamond'
      | 'heart'
      | 'pentagon'
      | 'hexagon'
      | 'octagon'
      | 'star'
      | 'arrowLeft'
      | 'arrowTop'
      | 'arrowRight'
      | 'arrowBottom'
      | 'arrowNorthSouth'
      | 'arrowEastWest'
      | 'process'
      | 'decision'
      | 'terminator'
      | 'predefinedProcess'
      | 'document'
      | 'multipleDocuments'
      | 'manualInput'
      | 'preparation'
      | 'data'
      | 'database'
      | 'hardDisk'
      | 'internalStorage'
      | 'paperTape'
      | 'manualOperation'
      | 'delay'
      | 'storedData'
      | 'display'
      | 'merge'
      | 'connector'
      | 'or'
      | 'summingJunction'
      | 'verticalContainer'
      | 'horizontalContainer'
      | 'cardWithImageOnLeft'
      | 'cardWithImageOnTop'
      | 'cardWithImageOnRight'
      | string;
  }
  /**
   * [descr:dxDiagramBeforeChangeConnectorTextArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramBeforeChangeShapeTextArgs {
    /**
     * [descr:dxDiagramBeforeChangeShapeTextArgs.shape]
     */
    shape?: dxDiagramShape;
  }
  /**
   * [descr:dxDiagramChangeConnectionArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramChangeConnectionArgs {
    /**
     * [descr:dxDiagramChangeConnectionArgs.newShape]
     */
    newShape?: dxDiagramShape;
    /**
     * [descr:dxDiagramChangeConnectionArgs.oldShape]
     */
    oldShape?: dxDiagramShape;
    /**
     * [descr:dxDiagramChangeConnectionArgs.connector]
     */
    connector?: dxDiagramConnector;
    /**
     * [descr:dxDiagramChangeConnectionArgs.connectionPointIndex]
     */
    connectionPointIndex?: number;
    /**
     * [descr:dxDiagramChangeConnectionArgs.connectorPosition]
     */
    connectorPosition?: 'start' | 'end';
  }
  /**
   * [descr:dxDiagramChangeConnectorPointsArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramChangeConnectorPointsArgs {
    /**
     * [descr:dxDiagramChangeConnectorPointsArgs.connector]
     */
    connector?: dxDiagramConnector;
    /**
     * [descr:dxDiagramChangeConnectorPointsArgs.newPoints]
     */
    newPoints?: Array<{
      /**
       * [descr:dxDiagramChangeConnectorPointsArgs.newPoints.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramChangeConnectorPointsArgs.newPoints.y]
       */
      y?: number;
    }>;
    /**
     * [descr:dxDiagramChangeConnectorPointsArgs.oldPoints]
     */
    oldPoints?: Array<{
      /**
       * [descr:dxDiagramChangeConnectorPointsArgs.oldPoints.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramChangeConnectorPointsArgs.oldPoints.y]
       */
      y?: number;
    }>;
  }
  /**
   * [descr:dxDiagramChangeConnectorTextArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramConnector extends dxDiagramItem {
    /**
     * [descr:dxDiagramConnector.fromKey]
     */
    fromKey?: any;
    /**
     * [descr:dxDiagramConnector.fromId]
     */
    fromId?: string;
    /**
     * [descr:dxDiagramConnector.fromPointIndex]
     */
    fromPointIndex?: number;
    /**
     * [descr:dxDiagramConnector.points]
     */
    points?: Array<{
      /**
       * [descr:dxDiagramConnector.points.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramConnector.points.y]
       */
      y?: number;
    }>;

    /**
     * [descr:dxDiagramConnector.texts]
     */
    texts?: Array<string>;
    /**
     * [descr:dxDiagramConnector.toKey]
     */
    toKey?: any;
    /**
     * [descr:dxDiagramConnector.toId]
     */
    toId?: string;
    /**
     * [descr:dxDiagramConnector.toPointIndex]
     */
    toPointIndex?: number;
  }
  /**
   * [descr:dxDiagramCustomCommand]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramCustomCommand {
    /**
     * [descr:dxDiagramCustomCommand.name]
     */
    name?: string;
    /**
     * [descr:dxDiagramCustomCommand.text]
     */
    text?: string;
    /**
     * [descr:dxDiagramCustomCommand.icon]
     */
    icon?: string;
    /**
     * [descr:dxDiagramCustomCommand.items]
     */
    items?: Array<dxDiagramCustomCommand>;
  }
  /**
   * [descr:dxDiagramDeleteConnectorArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramDeleteConnectorArgs {
    /**
     * [descr:dxDiagramDeleteConnectorArgs.connector]
     */
    connector?: dxDiagramConnector;
  }
  /**
   * [descr:dxDiagramDeleteShapeArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramDeleteShapeArgs {
    /**
     * [descr:dxDiagramDeleteShapeArgs.shape]
     */
    shape?: dxDiagramShape;
  }
  /**
   * [descr:dxDiagramItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
     * [descr:dxDiagramItem.key]
     */
    key?: Object;
    /**
     * [descr:dxDiagramItem.itemType]
     */
    itemType?: 'shape' | 'connector';
  }
  /**
   * [descr:dxDiagramMoveShapeArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramMoveShapeArgs {
    /**
     * [descr:dxDiagramMoveShapeArgs.shape]
     */
    shape?: dxDiagramShape;
    /**
     * [descr:dxDiagramMoveShapeArgs.newPosition]
     */
    newPosition?: {
      /**
       * [descr:dxDiagramMoveShapeArgs.newPosition.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramMoveShapeArgs.newPosition.y]
       */
      y?: number;
    };
    /**
     * [descr:dxDiagramMoveShapeArgs.oldPosition]
     */
    oldPosition?: {
      /**
       * [descr:dxDiagramMoveShapeArgs.oldPosition.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramMoveShapeArgs.oldPosition.y]
       */
      y?: number;
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramOptions extends WidgetOptions<dxDiagram> {
    /**
     * [descr:dxDiagramOptions.autoZoomMode]
     */
    autoZoomMode?: 'fitContent' | 'fitWidth' | 'disabled';
    /**
     * [descr:dxDiagramOptions.contextMenu]
     */
    contextMenu?: {
      /**
       * [descr:dxDiagramOptions.contextMenu.commands]
       */
      commands?: Array<
        | 'separator'
        | 'exportSvg'
        | 'exportPng'
        | 'exportJpg'
        | 'undo'
        | 'redo'
        | 'cut'
        | 'copy'
        | 'paste'
        | 'selectAll'
        | 'delete'
        | 'fontName'
        | 'fontSize'
        | 'bold'
        | 'italic'
        | 'underline'
        | 'fontColor'
        | 'lineColor'
        | 'fillColor'
        | 'textAlignLeft'
        | 'textAlignCenter'
        | 'textAlignRight'
        | 'lock'
        | 'unlock'
        | 'sendToBack'
        | 'bringToFront'
        | 'insertShapeImage'
        | 'editShapeImage'
        | 'deleteShapeImage'
        | 'connectorLineType'
        | 'connectorLineStart'
        | 'connectorLineEnd'
        | 'layoutTreeTopToBottom'
        | 'layoutTreeBottomToTop'
        | 'layoutTreeLeftToRight'
        | 'layoutTreeRightToLeft'
        | 'layoutLayeredTopToBottom'
        | 'layoutLayeredBottomToTop'
        | 'layoutLayeredLeftToRight'
        | 'layoutLayeredRightToLeft'
        | 'fullScreen'
        | 'zoomLevel'
        | 'showGrid'
        | 'snapToGrid'
        | 'gridSize'
        | 'units'
        | 'pageSize'
        | 'pageOrientation'
        | 'pageColor'
        | 'simpleView'
        | 'toolbox'
      >;
      /**
       * [descr:dxDiagramOptions.contextMenu.enabled]
       */
      enabled?: boolean;
    };
    /**
     * [descr:dxDiagramOptions.contextToolbox]
     */
    contextToolbox?: {
      /**
       * [descr:dxDiagramOptions.contextToolbox.category]
       */
      category?:
        | 'general'
        | 'flowchart'
        | 'orgChart'
        | 'containers'
        | 'custom'
        | string;
      /**
       * [descr:dxDiagramOptions.contextToolbox.displayMode]
       */
      displayMode?: 'icons' | 'texts';
      /**
       * [descr:dxDiagramOptions.contextToolbox.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxDiagramOptions.contextToolbox.shapeIconsPerRow]
       */
      shapeIconsPerRow?: number;
      /**
       * [descr:dxDiagramOptions.contextToolbox.shapes]
       */
      shapes?:
        | Array<
            | 'text'
            | 'rectangle'
            | 'ellipse'
            | 'cross'
            | 'triangle'
            | 'diamond'
            | 'heart'
            | 'pentagon'
            | 'hexagon'
            | 'octagon'
            | 'star'
            | 'arrowLeft'
            | 'arrowTop'
            | 'arrowRight'
            | 'arrowBottom'
            | 'arrowNorthSouth'
            | 'arrowEastWest'
            | 'process'
            | 'decision'
            | 'terminator'
            | 'predefinedProcess'
            | 'document'
            | 'multipleDocuments'
            | 'manualInput'
            | 'preparation'
            | 'data'
            | 'database'
            | 'hardDisk'
            | 'internalStorage'
            | 'paperTape'
            | 'manualOperation'
            | 'delay'
            | 'storedData'
            | 'display'
            | 'merge'
            | 'connector'
            | 'or'
            | 'summingJunction'
            | 'verticalContainer'
            | 'horizontalContainer'
            | 'cardWithImageOnLeft'
            | 'cardWithImageOnTop'
            | 'cardWithImageOnRight'
          >
        | Array<string>;
      /**
       * [descr:dxDiagramOptions.contextToolbox.width]
       */
      width?: number;
    };
    /**
     * [descr:dxDiagramOptions.onCustomCommand]
     */
    onCustomCommand?: (e: DevExpress.ui.dxDiagram.CustomCommandEvent) => void;
    /**
     * [descr:dxDiagramOptions.customShapeTemplate]
     */
    customShapeTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement<SVGElement>,
          data: DevExpress.ui.dxDiagram.CustomShapeTemplateData
        ) => any);
    /**
     * [descr:dxDiagramOptions.customShapeToolboxTemplate]
     */
    customShapeToolboxTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement<SVGElement>,
          data: DevExpress.ui.dxDiagram.CustomShapeToolboxTemplateData
        ) => any);
    /**
     * [descr:dxDiagramOptions.customShapes]
     */
    customShapes?: Array<{
      /**
       * [descr:dxDiagramOptions.customShapes.allowEditImage]
       */
      allowEditImage?: boolean;
      /**
       * [descr:dxDiagramOptions.customShapes.allowEditText]
       */
      allowEditText?: boolean;
      /**
       * [descr:dxDiagramOptions.customShapes.allowResize]
       */
      allowResize?: boolean;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageHeight]
       */
      backgroundImageHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageLeft]
       */
      backgroundImageLeft?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageTop]
       */
      backgroundImageTop?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageUrl]
       */
      backgroundImageUrl?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageToolboxUrl]
       */
      backgroundImageToolboxUrl?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.backgroundImageWidth]
       */
      backgroundImageWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.baseType]
       */
      baseType?:
        | 'text'
        | 'rectangle'
        | 'ellipse'
        | 'cross'
        | 'triangle'
        | 'diamond'
        | 'heart'
        | 'pentagon'
        | 'hexagon'
        | 'octagon'
        | 'star'
        | 'arrowLeft'
        | 'arrowTop'
        | 'arrowRight'
        | 'arrowBottom'
        | 'arrowNorthSouth'
        | 'arrowEastWest'
        | 'process'
        | 'decision'
        | 'terminator'
        | 'predefinedProcess'
        | 'document'
        | 'multipleDocuments'
        | 'manualInput'
        | 'preparation'
        | 'data'
        | 'database'
        | 'hardDisk'
        | 'internalStorage'
        | 'paperTape'
        | 'manualOperation'
        | 'delay'
        | 'storedData'
        | 'display'
        | 'merge'
        | 'connector'
        | 'or'
        | 'summingJunction'
        | 'verticalContainer'
        | 'horizontalContainer'
        | 'cardWithImageOnLeft'
        | 'cardWithImageOnTop'
        | 'cardWithImageOnRight'
        | string;
      /**
       * [descr:dxDiagramOptions.customShapes.category]
       */
      category?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.connectionPoints]
       */
      connectionPoints?: Array<{
        /**
         * [descr:dxDiagramOptions.customShapes.connectionPoints.x]
         */
        x?: number;
        /**
         * [descr:dxDiagramOptions.customShapes.connectionPoints.y]
         */
        y?: number;
      }>;
      /**
       * [descr:dxDiagramOptions.customShapes.defaultHeight]
       */
      defaultHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.defaultImageUrl]
       */
      defaultImageUrl?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.defaultText]
       */
      defaultText?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.defaultWidth]
       */
      defaultWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.imageHeight]
       */
      imageHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.imageLeft]
       */
      imageLeft?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.imageTop]
       */
      imageTop?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.imageWidth]
       */
      imageWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.keepRatioOnAutoSize]
       */
      keepRatioOnAutoSize?: boolean;
      /**
       * [descr:dxDiagramOptions.customShapes.maxHeight]
       */
      maxHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.maxWidth]
       */
      maxWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.minHeight]
       */
      minHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.minWidth]
       */
      minWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.template]
       */
      template?:
        | DevExpress.core.template
        | ((
            container: DevExpress.core.DxElement<SVGElement>,
            data: DevExpress.ui.dxDiagram.CustomShapeTemplateData
          ) => any);
      /**
       * [descr:dxDiagramOptions.customShapes.templateHeight]
       */
      templateHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.templateLeft]
       */
      templateLeft?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.templateTop]
       */
      templateTop?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.templateWidth]
       */
      templateWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.textHeight]
       */
      textHeight?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.textLeft]
       */
      textLeft?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.textTop]
       */
      textTop?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.textWidth]
       */
      textWidth?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.title]
       */
      title?: string;
      /**
       * [descr:dxDiagramOptions.customShapes.toolboxTemplate]
       */
      toolboxTemplate?:
        | DevExpress.core.template
        | ((
            container: DevExpress.core.DxElement<SVGElement>,
            data: DevExpress.ui.dxDiagram.CustomShapeToolboxTemplateData
          ) => any);
      /**
       * [descr:dxDiagramOptions.customShapes.toolboxWidthToHeightRatio]
       */
      toolboxWidthToHeightRatio?: number;
      /**
       * [descr:dxDiagramOptions.customShapes.type]
       */
      type?: string;
    }>;
    /**
     * [descr:dxDiagramOptions.defaultItemProperties]
     */
    defaultItemProperties?: {
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.style]
       */
      style?: Object;
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.textStyle]
       */
      textStyle?: Object;
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.connectorLineType]
       */
      connectorLineType?: 'straight' | 'orthogonal';
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.connectorLineStart]
       */
      connectorLineStart?:
        | 'none'
        | 'arrow'
        | 'outlinedTriangle'
        | 'filledTriangle';
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.connectorLineEnd]
       */
      connectorLineEnd?:
        | 'none'
        | 'arrow'
        | 'outlinedTriangle'
        | 'filledTriangle';
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.shapeMinWidth]
       */
      shapeMinWidth?: number;
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.shapeMaxWidth]
       */
      shapeMaxWidth?: number;
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.shapeMinHeight]
       */
      shapeMinHeight?: number;
      /**
       * [descr:dxDiagramOptions.defaultItemProperties.shapeMaxHeight]
       */
      shapeMaxHeight?: number;
    };
    /**
     * [descr:dxDiagramOptions.editing]
     */
    editing?: {
      /**
       * [descr:dxDiagramOptions.editing.allowAddShape]
       */
      allowAddShape?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowDeleteShape]
       */
      allowDeleteShape?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowDeleteConnector]
       */
      allowDeleteConnector?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowChangeConnection]
       */
      allowChangeConnection?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowChangeConnectorPoints]
       */
      allowChangeConnectorPoints?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowChangeConnectorText]
       */
      allowChangeConnectorText?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowChangeShapeText]
       */
      allowChangeShapeText?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowResizeShape]
       */
      allowResizeShape?: boolean;
      /**
       * [descr:dxDiagramOptions.editing.allowMoveShape]
       */
      allowMoveShape?: boolean;
    };
    /**
     * [descr:dxDiagramOptions.edges]
     */
    edges?: {
      /**
       * [descr:dxDiagramOptions.edges.customDataExpr]
       */
      customDataExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxDiagramOptions.edges.fromExpr]
       */
      fromExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.fromLineEndExpr]
       */
      fromLineEndExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.fromPointIndexExpr]
       */
      fromPointIndexExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.keyExpr]
       */
      keyExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.lineTypeExpr]
       */
      lineTypeExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.lockedExpr]
       */
      lockedExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.pointsExpr]
       */
      pointsExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.styleExpr]
       */
      styleExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.textExpr]
       */
      textExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.textStyleExpr]
       */
      textStyleExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.toExpr]
       */
      toExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.toLineEndExpr]
       */
      toLineEndExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.toPointIndexExpr]
       */
      toPointIndexExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.edges.zIndexExpr]
       */
      zIndexExpr?: string | ((data: any) => any);
    };
    /**
     * [descr:dxDiagramOptions.export]
     */
    export?: {
      /**
       * [descr:dxDiagramOptions.export.fileName]
       */
      fileName?: string;
      /**
       * [descr:dxDiagramOptions.export.proxyUrl]
       * @deprecated [depNote:dxDiagramOptions.export.proxyUrl]
       */
      proxyUrl?: string;
    };
    /**
     * [descr:dxDiagramOptions.fullScreen]
     */
    fullScreen?: boolean;
    /**
     * [descr:dxDiagramOptions.gridSize]
     */
    gridSize?:
      | number
      | {
          /**
           * [descr:dxDiagramOptions.gridSize.items]
           */
          items?: Array<number>;
          /**
           * [descr:dxDiagramOptions.gridSize.value]
           */
          value?: number;
        };
    /**
     * [descr:dxDiagramOptions.nodes]
     */
    nodes?: {
      /**
       * [descr:dxDiagramOptions.nodes.autoLayout]
       */
      autoLayout?:
        | 'off'
        | 'tree'
        | 'layered'
        | {
            /**
             * [descr:dxDiagramOptions.nodes.autoLayout.orientation]
             */
            orientation?: 'vertical' | 'horizontal';
            /**
             * [descr:dxDiagramOptions.nodes.autoLayout.type]
             */
            type?: 'off' | 'tree' | 'layered';
          };
      /**
       * [descr:dxDiagramOptions.nodes.autoSizeEnabled]
       */
      autoSizeEnabled?: boolean;
      /**
       * [descr:dxDiagramOptions.nodes.containerChildrenExpr]
       */
      containerChildrenExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.containerKeyExpr]
       */
      containerKeyExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.customDataExpr]
       */
      customDataExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxDiagramOptions.nodes.heightExpr]
       */
      heightExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.imageUrlExpr]
       */
      imageUrlExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.itemsExpr]
       */
      itemsExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.keyExpr]
       */
      keyExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.leftExpr]
       */
      leftExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.lockedExpr]
       */
      lockedExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.parentKeyExpr]
       */
      parentKeyExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.styleExpr]
       */
      styleExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.textExpr]
       */
      textExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.textStyleExpr]
       */
      textStyleExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.topExpr]
       */
      topExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.typeExpr]
       */
      typeExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.widthExpr]
       */
      widthExpr?: string | ((data: any) => any);
      /**
       * [descr:dxDiagramOptions.nodes.zIndexExpr]
       */
      zIndexExpr?: string | ((data: any) => any);
    };
    /**
     * [descr:dxDiagramOptions.hasChanges]
     */
    hasChanges?: boolean;
    /**
     * [descr:dxDiagramOptions.onItemClick]
     */
    onItemClick?: (e: DevExpress.ui.dxDiagram.ItemClickEvent) => void;
    /**
     * [descr:dxDiagramOptions.onItemDblClick]
     */
    onItemDblClick?: (e: DevExpress.ui.dxDiagram.ItemDblClickEvent) => void;
    /**
     * [descr:dxDiagramOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxDiagram.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxDiagramOptions.onRequestEditOperation]
     */
    onRequestEditOperation?: (
      e: DevExpress.ui.dxDiagram.RequestEditOperationEvent
    ) => void;
    /**
     * [descr:dxDiagramOptions.onRequestLayoutUpdate]
     */
    onRequestLayoutUpdate?: (
      e: DevExpress.ui.dxDiagram.RequestLayoutUpdateEvent
    ) => void;
    /**
     * [descr:dxDiagramOptions.pageColor]
     */
    pageColor?: string;
    /**
     * [descr:dxDiagramOptions.pageOrientation]
     */
    pageOrientation?: 'portrait' | 'landscape';
    /**
     * [descr:dxDiagramOptions.pageSize]
     */
    pageSize?: {
      /**
       * [descr:dxDiagramOptions.pageSize.height]
       */
      height?: number;
      /**
       * [descr:dxDiagramOptions.pageSize.items]
       */
      items?: Array<{
        /**
         * [descr:dxDiagramOptions.pageSize.items.height]
         */
        height?: number;
        /**
         * [descr:dxDiagramOptions.pageSize.items.text]
         */
        text?: string;
        /**
         * [descr:dxDiagramOptions.pageSize.items.width]
         */
        width?: number;
      }>;
      /**
       * [descr:dxDiagramOptions.pageSize.width]
       */
      width?: number;
    };
    /**
     * [descr:dxDiagramOptions.propertiesPanel]
     */
    propertiesPanel?: {
      /**
       * [descr:dxDiagramOptions.propertiesPanel.tabs]
       */
      tabs?: Array<{
        /**
         * [descr:dxDiagramOptions.propertiesPanel.tabs.commands]
         */
        commands?: Array<
          | 'separator'
          | 'exportSvg'
          | 'exportPng'
          | 'exportJpg'
          | 'undo'
          | 'redo'
          | 'cut'
          | 'copy'
          | 'paste'
          | 'selectAll'
          | 'delete'
          | 'fontName'
          | 'fontSize'
          | 'bold'
          | 'italic'
          | 'underline'
          | 'fontColor'
          | 'lineColor'
          | 'fillColor'
          | 'textAlignLeft'
          | 'textAlignCenter'
          | 'textAlignRight'
          | 'lock'
          | 'unlock'
          | 'sendToBack'
          | 'bringToFront'
          | 'insertShapeImage'
          | 'editShapeImage'
          | 'deleteShapeImage'
          | 'connectorLineType'
          | 'connectorLineStart'
          | 'connectorLineEnd'
          | 'layoutTreeTopToBottom'
          | 'layoutTreeBottomToTop'
          | 'layoutTreeLeftToRight'
          | 'layoutTreeRightToLeft'
          | 'layoutLayeredTopToBottom'
          | 'layoutLayeredBottomToTop'
          | 'layoutLayeredLeftToRight'
          | 'layoutLayeredRightToLeft'
          | 'fullScreen'
          | 'zoomLevel'
          | 'showGrid'
          | 'snapToGrid'
          | 'gridSize'
          | 'units'
          | 'pageSize'
          | 'pageOrientation'
          | 'pageColor'
          | 'simpleView'
          | 'toolbox'
        >;
        /**
         * [descr:dxDiagramOptions.propertiesPanel.tabs.groups]
         */
        groups?: Array<{
          /**
           * [descr:dxDiagramOptions.propertiesPanel.tabs.groups.commands]
           */
          commands?: Array<
            | 'separator'
            | 'exportSvg'
            | 'exportPng'
            | 'exportJpg'
            | 'undo'
            | 'redo'
            | 'cut'
            | 'copy'
            | 'paste'
            | 'selectAll'
            | 'delete'
            | 'fontName'
            | 'fontSize'
            | 'bold'
            | 'italic'
            | 'underline'
            | 'fontColor'
            | 'lineColor'
            | 'fillColor'
            | 'textAlignLeft'
            | 'textAlignCenter'
            | 'textAlignRight'
            | 'lock'
            | 'unlock'
            | 'sendToBack'
            | 'bringToFront'
            | 'insertShapeImage'
            | 'editShapeImage'
            | 'deleteShapeImage'
            | 'connectorLineType'
            | 'connectorLineStart'
            | 'connectorLineEnd'
            | 'layoutTreeTopToBottom'
            | 'layoutTreeBottomToTop'
            | 'layoutTreeLeftToRight'
            | 'layoutTreeRightToLeft'
            | 'layoutLayeredTopToBottom'
            | 'layoutLayeredBottomToTop'
            | 'layoutLayeredLeftToRight'
            | 'layoutLayeredRightToLeft'
            | 'fullScreen'
            | 'zoomLevel'
            | 'showGrid'
            | 'snapToGrid'
            | 'gridSize'
            | 'units'
            | 'pageSize'
            | 'pageOrientation'
            | 'pageColor'
            | 'simpleView'
            | 'toolbox'
          >;
          /**
           * [descr:dxDiagramOptions.propertiesPanel.tabs.groups.title]
           */
          title?: string;
        }>;
        /**
         * [descr:dxDiagramOptions.propertiesPanel.tabs.title]
         */
        title?: string;
      }>;
      /**
       * [descr:dxDiagramOptions.propertiesPanel.visibility]
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled';
    };
    /**
     * [descr:dxDiagramOptions.readOnly]
     */
    readOnly?: boolean;
    /**
     * [descr:dxDiagramOptions.showGrid]
     */
    showGrid?: boolean;
    /**
     * [descr:dxDiagramOptions.simpleView]
     */
    simpleView?: boolean;
    /**
     * [descr:dxDiagramOptions.snapToGrid]
     */
    snapToGrid?: boolean;
    /**
     * [descr:dxDiagramOptions.mainToolbar]
     */
    mainToolbar?: {
      /**
       * [descr:dxDiagramOptions.mainToolbar.commands]
       */
      commands?: Array<
        | 'separator'
        | 'exportSvg'
        | 'exportPng'
        | 'exportJpg'
        | 'undo'
        | 'redo'
        | 'cut'
        | 'copy'
        | 'paste'
        | 'selectAll'
        | 'delete'
        | 'fontName'
        | 'fontSize'
        | 'bold'
        | 'italic'
        | 'underline'
        | 'fontColor'
        | 'lineColor'
        | 'fillColor'
        | 'textAlignLeft'
        | 'textAlignCenter'
        | 'textAlignRight'
        | 'lock'
        | 'unlock'
        | 'sendToBack'
        | 'bringToFront'
        | 'insertShapeImage'
        | 'editShapeImage'
        | 'deleteShapeImage'
        | 'connectorLineType'
        | 'connectorLineStart'
        | 'connectorLineEnd'
        | 'layoutTreeTopToBottom'
        | 'layoutTreeBottomToTop'
        | 'layoutTreeLeftToRight'
        | 'layoutTreeRightToLeft'
        | 'layoutLayeredTopToBottom'
        | 'layoutLayeredBottomToTop'
        | 'layoutLayeredLeftToRight'
        | 'layoutLayeredRightToLeft'
        | 'fullScreen'
        | 'zoomLevel'
        | 'showGrid'
        | 'snapToGrid'
        | 'gridSize'
        | 'units'
        | 'pageSize'
        | 'pageOrientation'
        | 'pageColor'
        | 'simpleView'
        | 'toolbox'
      >;
      /**
       * [descr:dxDiagramOptions.mainToolbar.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxDiagramOptions.historyToolbar]
     */
    historyToolbar?: {
      /**
       * [descr:dxDiagramOptions.historyToolbar.commands]
       */
      commands?: Array<
        | 'separator'
        | 'exportSvg'
        | 'exportPng'
        | 'exportJpg'
        | 'undo'
        | 'redo'
        | 'cut'
        | 'copy'
        | 'paste'
        | 'selectAll'
        | 'delete'
        | 'fontName'
        | 'fontSize'
        | 'bold'
        | 'italic'
        | 'underline'
        | 'fontColor'
        | 'lineColor'
        | 'fillColor'
        | 'textAlignLeft'
        | 'textAlignCenter'
        | 'textAlignRight'
        | 'lock'
        | 'unlock'
        | 'sendToBack'
        | 'bringToFront'
        | 'insertShapeImage'
        | 'editShapeImage'
        | 'deleteShapeImage'
        | 'connectorLineType'
        | 'connectorLineStart'
        | 'connectorLineEnd'
        | 'layoutTreeTopToBottom'
        | 'layoutTreeBottomToTop'
        | 'layoutTreeLeftToRight'
        | 'layoutTreeRightToLeft'
        | 'layoutLayeredTopToBottom'
        | 'layoutLayeredBottomToTop'
        | 'layoutLayeredLeftToRight'
        | 'layoutLayeredRightToLeft'
        | 'fullScreen'
        | 'zoomLevel'
        | 'showGrid'
        | 'snapToGrid'
        | 'gridSize'
        | 'units'
        | 'pageSize'
        | 'pageOrientation'
        | 'pageColor'
        | 'simpleView'
        | 'toolbox'
      >;
      /**
       * [descr:dxDiagramOptions.historyToolbar.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxDiagramOptions.viewToolbar]
     */
    viewToolbar?: {
      /**
       * [descr:dxDiagramOptions.viewToolbar.commands]
       */
      commands?: Array<
        | 'separator'
        | 'exportSvg'
        | 'exportPng'
        | 'exportJpg'
        | 'undo'
        | 'redo'
        | 'cut'
        | 'copy'
        | 'paste'
        | 'selectAll'
        | 'delete'
        | 'fontName'
        | 'fontSize'
        | 'bold'
        | 'italic'
        | 'underline'
        | 'fontColor'
        | 'lineColor'
        | 'fillColor'
        | 'textAlignLeft'
        | 'textAlignCenter'
        | 'textAlignRight'
        | 'lock'
        | 'unlock'
        | 'sendToBack'
        | 'bringToFront'
        | 'insertShapeImage'
        | 'editShapeImage'
        | 'deleteShapeImage'
        | 'connectorLineType'
        | 'connectorLineStart'
        | 'connectorLineEnd'
        | 'layoutTreeTopToBottom'
        | 'layoutTreeBottomToTop'
        | 'layoutTreeLeftToRight'
        | 'layoutTreeRightToLeft'
        | 'layoutLayeredTopToBottom'
        | 'layoutLayeredBottomToTop'
        | 'layoutLayeredLeftToRight'
        | 'layoutLayeredRightToLeft'
        | 'fullScreen'
        | 'zoomLevel'
        | 'showGrid'
        | 'snapToGrid'
        | 'gridSize'
        | 'units'
        | 'pageSize'
        | 'pageOrientation'
        | 'pageColor'
        | 'simpleView'
        | 'toolbox'
      >;
      /**
       * [descr:dxDiagramOptions.viewToolbar.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxDiagramOptions.toolbox]
     */
    toolbox?: {
      /**
       * [descr:dxDiagramOptions.toolbox.groups]
       */
      groups?:
        | Array<{
            /**
             * [descr:dxDiagramOptions.toolbox.groups.category]
             */
            category?:
              | 'general'
              | 'flowchart'
              | 'orgChart'
              | 'containers'
              | 'custom'
              | string;
            /**
             * [descr:dxDiagramOptions.toolbox.groups.displayMode]
             */
            displayMode?: 'icons' | 'texts';
            /**
             * [descr:dxDiagramOptions.toolbox.groups.expanded]
             */
            expanded?: boolean;
            /**
             * [descr:dxDiagramOptions.toolbox.groups.shapes]
             */
            shapes?:
              | Array<
                  | 'text'
                  | 'rectangle'
                  | 'ellipse'
                  | 'cross'
                  | 'triangle'
                  | 'diamond'
                  | 'heart'
                  | 'pentagon'
                  | 'hexagon'
                  | 'octagon'
                  | 'star'
                  | 'arrowLeft'
                  | 'arrowTop'
                  | 'arrowRight'
                  | 'arrowBottom'
                  | 'arrowNorthSouth'
                  | 'arrowEastWest'
                  | 'process'
                  | 'decision'
                  | 'terminator'
                  | 'predefinedProcess'
                  | 'document'
                  | 'multipleDocuments'
                  | 'manualInput'
                  | 'preparation'
                  | 'data'
                  | 'database'
                  | 'hardDisk'
                  | 'internalStorage'
                  | 'paperTape'
                  | 'manualOperation'
                  | 'delay'
                  | 'storedData'
                  | 'display'
                  | 'merge'
                  | 'connector'
                  | 'or'
                  | 'summingJunction'
                  | 'verticalContainer'
                  | 'horizontalContainer'
                  | 'cardWithImageOnLeft'
                  | 'cardWithImageOnTop'
                  | 'cardWithImageOnRight'
                >
              | Array<string>;
            /**
             * [descr:dxDiagramOptions.toolbox.groups.title]
             */
            title?: string;
          }>
        | Array<'general' | 'flowchart' | 'orgChart' | 'containers' | 'custom'>;
      /**
       * [descr:dxDiagramOptions.toolbox.shapeIconsPerRow]
       */
      shapeIconsPerRow?: number;
      /**
       * [descr:dxDiagramOptions.toolbox.showSearch]
       */
      showSearch?: boolean;
      /**
       * [descr:dxDiagramOptions.toolbox.visibility]
       */
      visibility?: 'auto' | 'visible' | 'collapsed' | 'disabled';
      /**
       * [descr:dxDiagramOptions.toolbox.width]
       */
      width?: number;
    };
    /**
     * [descr:dxDiagramOptions.units]
     */
    units?: 'in' | 'cm' | 'px';
    /**
     * [descr:dxDiagramOptions.viewUnits]
     */
    viewUnits?: 'in' | 'cm' | 'px';
    /**
     * [descr:dxDiagramOptions.zoomLevel]
     */
    zoomLevel?:
      | number
      | {
          /**
           * [descr:dxDiagramOptions.zoomLevel.items]
           */
          items?: Array<number>;
          /**
           * [descr:dxDiagramOptions.zoomLevel.value]
           */
          value?: number;
        };
  }
  /**
   * [descr:dxDiagramResizeShapeArgs]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramResizeShapeArgs {
    /**
     * [descr:dxDiagramResizeShapeArgs.shape]
     */
    shape?: dxDiagramShape;
    /**
     * [descr:dxDiagramResizeShapeArgs.newSize]
     */
    newSize?: {
      /**
       * [descr:dxDiagramResizeShapeArgs.newSize.height]
       */
      height?: number;
      /**
       * [descr:dxDiagramResizeShapeArgs.newSize.width]
       */
      width?: number;
    };
    /**
     * [descr:dxDiagramResizeShapeArgs.oldSize]
     */
    oldSize?: {
      /**
       * [descr:dxDiagramResizeShapeArgs.oldSize.height]
       */
      height?: number;
      /**
       * [descr:dxDiagramResizeShapeArgs.oldSize.width]
       */
      width?: number;
    };
  }
  /**
   * [descr:dxDiagramShape]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDiagramShape extends dxDiagramItem {
    /**
     * [descr:dxDiagramShape.text]
     */
    text?: string;
    /**
     * [descr:dxDiagramShape.type]
     */
    type?:
      | 'text'
      | 'rectangle'
      | 'ellipse'
      | 'cross'
      | 'triangle'
      | 'diamond'
      | 'heart'
      | 'pentagon'
      | 'hexagon'
      | 'octagon'
      | 'star'
      | 'arrowLeft'
      | 'arrowTop'
      | 'arrowRight'
      | 'arrowBottom'
      | 'arrowNorthSouth'
      | 'arrowEastWest'
      | 'process'
      | 'decision'
      | 'terminator'
      | 'predefinedProcess'
      | 'document'
      | 'multipleDocuments'
      | 'manualInput'
      | 'preparation'
      | 'data'
      | 'database'
      | 'hardDisk'
      | 'internalStorage'
      | 'paperTape'
      | 'manualOperation'
      | 'delay'
      | 'storedData'
      | 'display'
      | 'merge'
      | 'connector'
      | 'or'
      | 'summingJunction'
      | 'verticalContainer'
      | 'horizontalContainer'
      | 'cardWithImageOnLeft'
      | 'cardWithImageOnTop'
      | 'cardWithImageOnRight'
      | string;
    /**
     * [descr:dxDiagramShape.position]
     */
    position?: {
      /**
       * [descr:dxDiagramShape.position.x]
       */
      x?: number;
      /**
       * [descr:dxDiagramShape.position.y]
       */
      y?: number;
    };

    /**
     * [descr:dxDiagramShape.size]
     */
    size?: {
      /**
       * [descr:dxDiagramShape.size.height]
       */
      height?: number;
      /**
       * [descr:dxDiagramShape.size.width]
       */
      width?: number;
    };
    /**
     * [descr:dxDiagramShape.attachedConnectorIds]
     */
    attachedConnectorIds?: Array<String>;
    /**
     * [descr:dxDiagramShape.containerId]
     */
    containerId?: string;
    /**
     * [descr:dxDiagramShape.containerChildItemIds]
     */
    containerChildItemIds?: Array<String>;
    /**
     * [descr:dxDiagramShape.containerExpanded]
     */
    containerExpanded?: boolean;
  }
  /**
   * [descr:dxDraggable]
   */
  export class dxDraggable
    extends DOMComponent<dxDraggableOptions>
    implements DraggableBase {}
  module dxDraggable {
    export type DisposingEvent = DevExpress.events.EventInfo<dxDraggable>;
    export type DragEndEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxDraggable> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly fromComponent: dxSortable | dxDraggable;
        readonly toComponent: dxSortable | dxDraggable;
        readonly fromData?: any;
        readonly toData?: any;
      };
    export type DragMoveEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxDraggable> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly fromComponent: dxSortable | dxDraggable;
        readonly toComponent: dxSortable | dxDraggable;
        readonly fromData?: any;
        readonly toData?: any;
      };
    export type DragStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxDraggable> & {
        itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly fromData?: any;
      };
    export type DragTemplateData = {
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
    };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDraggable>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxDraggable> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxDraggableOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDraggableOptions
    extends DraggableBaseOptions<dxDraggable> {
    /**
     * [descr:dxDraggableOptions.clone]
     */
    clone?: boolean;
    /**
     * [descr:dxDraggableOptions.dragTemplate]
     */
    dragTemplate?:
      | DevExpress.core.template
      | ((
          dragInfo: DevExpress.ui.dxDraggable.DragTemplateData,
          containerElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDraggableOptions.onDragEnd]
     */
    onDragEnd?: (e: DevExpress.ui.dxDraggable.DragEndEvent) => void;
    /**
     * [descr:dxDraggableOptions.onDragMove]
     */
    onDragMove?: (e: DevExpress.ui.dxDraggable.DragMoveEvent) => void;
    /**
     * [descr:dxDraggableOptions.onDragStart]
     */
    onDragStart?: (e: DevExpress.ui.dxDraggable.DragStartEvent) => void;
  }
  /**
   * [descr:dxDrawer]
   */
  export class dxDrawer extends Widget<dxDrawerOptions> {
    /**
     * [descr:dxDrawer.content()]
     */
    content(): DevExpress.core.DxElement;
    /**
     * [descr:dxDrawer.hide()]
     */
    hide(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDrawer.show()]
     */
    show(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDrawer.toggle()]
     */
    toggle(): DevExpress.core.utils.DxPromise<void>;
  }
  module dxDrawer {
    export type DisposingEvent = DevExpress.events.EventInfo<dxDrawer>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDrawer>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxDrawer> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxDrawerOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDrawerOptions extends WidgetOptions<dxDrawer> {
    /**
     * [descr:dxDrawerOptions.animationDuration]
     */
    animationDuration?: number;
    /**
     * [descr:dxDrawerOptions.animationEnabled]
     */
    animationEnabled?: boolean;
    /**
     * [descr:dxDrawerOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxDrawerOptions.maxSize]
     */
    maxSize?: number;
    /**
     * [descr:dxDrawerOptions.minSize]
     */
    minSize?: number;
    /**
     * [descr:dxDrawerOptions.opened]
     */
    opened?: boolean;
    /**
     * [descr:dxDrawerOptions.openedStateMode]
     */
    openedStateMode?: 'overlap' | 'shrink' | 'push';
    /**
     * [descr:dxDrawerOptions.position]
     */
    position?: 'left' | 'right' | 'top' | 'bottom' | 'before' | 'after';
    /**
     * [descr:dxDrawerOptions.revealMode]
     */
    revealMode?: 'slide' | 'expand';
    /**
     * [descr:dxDrawerOptions.shading]
     */
    shading?: boolean;
    /**
     * [descr:dxDrawerOptions.target]
     * @deprecated [depNote:dxDrawerOptions.target]
     */
    target?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxDrawerOptions.template]
     */
    template?:
      | DevExpress.core.template
      | ((Element: DevExpress.core.DxElement) => any);
  }
  /**
   * [descr:dxDropDownBox]
   */
  export class dxDropDownBox extends dxDropDownEditor<dxDropDownBoxOptions> {
    getDataSource(): DevExpress.data.DataSource;
  }
  module dxDropDownBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxDropDownBox>;
    export type ContentTemplateData = {
      component: dxDropDownBox;
      readonly value?: any;
    };
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxDropDownBox>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent =
      DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type FocusOutEvent =
      DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDropDownBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type KeyPressEvent =
      DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type OpenedEvent = DevExpress.events.EventInfo<dxDropDownBox>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxDropDownBox> &
        DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxDropDownBox>;
    export type Properties = dxDropDownBoxOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxDropDownBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDropDownBoxOptions
    extends DataExpressionMixinOptions<dxDropDownBox>,
      dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * [descr:dxDropDownBoxOptions.acceptCustomValue]
     */
    acceptCustomValue?: boolean;
    /**
     * [descr:dxDropDownBoxOptions.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          templateData: DevExpress.ui.dxDropDownBox.ContentTemplateData,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownBoxOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxDropDownBoxOptions.displayValueFormatter]
     */
    displayValueFormatter?: (value: string | Array<any>) => string;
    /**
     * [descr:dxDropDownBoxOptions.fieldTemplate]
     */
    fieldTemplate?:
      | DevExpress.core.template
      | ((
          value: any,
          fieldElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownBoxOptions.items]
     */
    items?: Array<any>;
    /**
     * [descr:dxDropDownBoxOptions.openOnFieldClick]
     */
    openOnFieldClick?: boolean;
    /**
     * [descr:dxDropDownBoxOptions.valueChangeEvent]
     */
    valueChangeEvent?: string;

    /**
     * [descr:dxDropDownBoxOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
  }
  /**
   * [descr:dxDropDownButton]
   */
  export class dxDropDownButton extends Widget<dxDropDownButtonOptions> {
    /**
     * [descr:dxDropDownButton.close()]
     */
    close(): DevExpress.core.utils.DxPromise<void>;
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxDropDownButton.open()]
     */
    open(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDropDownButton.toggle()]
     */
    toggle(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxDropDownButton.toggle(visibility)]
     */
    toggle(visibility: boolean): DevExpress.core.utils.DxPromise<void>;
  }
  module dxDropDownButton {
    export type ButtonClickEvent =
      DevExpress.events.NativeEventInfo<dxDropDownButton> & {
        readonly selectedItem?: any;
      };
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxDropDownButton>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxDropDownButton>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxDropDownButton>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxDropDownButton> & {
        readonly itemData?: any;
        readonly itemElement: DevExpress.core.DxElement;
      };
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxDropDownButton> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxDropDownButtonOptions;
    export type SelectionChangedEvent =
      DevExpress.events.NativeEventInfo<dxDropDownButton> & {
        readonly item: any;
        readonly previousItem: any;
      };
  }
  /**
   * [descr:dxDropDownButtonItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDropDownButtonItem extends dxListItem {
    /**
     * [descr:dxDropDownButtonItem.onClick]
     */
    onClick?:
      | ((e: {
          component?: dxDropDownButton;
          element?: DevExpress.core.DxElement;
          model?: any;
          event?: DevExpress.events.DxEvent;
        }) => void)
      | string;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDropDownButtonOptions
    extends WidgetOptions<dxDropDownButton> {
    /**
     * [descr:dxDropDownButtonOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxDropDownButtonItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxDropDownButtonOptions.deferRendering]
     */
    deferRendering?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.displayExpr]
     */
    displayExpr?: string | ((itemData: any) => string);
    /**
     * [descr:dxDropDownButtonOptions.dropDownContentTemplate]
     */
    dropDownContentTemplate?:
      | DevExpress.core.template
      | ((
          data: Array<string | number | any> | DevExpress.data.DataSource,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownButtonOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
    /**
     * [descr:dxDropDownButtonOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.icon]
     */
    icon?: string;
    /**
     * [descr:dxDropDownButtonOptions.itemTemplate]
     */
    itemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownButtonOptions.items]
     */
    items?: Array<dxDropDownButtonItem | any>;
    /**
     * [descr:dxDropDownButtonOptions.keyExpr]
     */
    keyExpr?: string;
    /**
     * [descr:dxDropDownButtonOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:dxDropDownButtonOptions.onButtonClick]
     */
    onButtonClick?:
      | ((e: DevExpress.ui.dxDropDownButton.ButtonClickEvent) => void)
      | string;
    /**
     * [descr:dxDropDownButtonOptions.onItemClick]
     */
    onItemClick?:
      | ((e: DevExpress.ui.dxDropDownButton.ItemClickEvent) => void)
      | string;
    /**
     * [descr:dxDropDownButtonOptions.onSelectionChanged]
     */
    onSelectionChanged?:
      | ((e: DevExpress.ui.dxDropDownButton.SelectionChangedEvent) => void)
      | string;
    /**
     * [descr:dxDropDownButtonOptions.opened]
     */
    opened?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.selectedItem]
     */
    selectedItem?: string | number | any;
    /**
     * [descr:dxDropDownButtonOptions.selectedItemKey]
     */
    selectedItemKey?: string | number;
    /**
     * [descr:dxDropDownButtonOptions.showArrowIcon]
     */
    showArrowIcon?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.splitButton]
     */
    splitButton?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.stylingMode]
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * [descr:dxDropDownButtonOptions.text]
     */
    text?: string;
    /**
     * [descr:dxDropDownButtonOptions.useSelectMode]
     */
    useSelectMode?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.wrapItemText]
     */
    wrapItemText?: boolean;
    /**
     * [descr:dxDropDownButtonOptions.useItemTextAsTitle]
     */
    useItemTextAsTitle?: boolean;
  }
  /**
   * [descr:dxDropDownEditor]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxDropDownEditor<TProperties> extends dxTextBox<TProperties> {
    /**
     * [descr:dxDropDownEditor.close()]
     */
    close(): void;
    /**
     * [descr:dxDropDownEditor.content()]
     */
    content(): DevExpress.core.DxElement;
    /**
     * [descr:dxDropDownEditor.field()]
     */
    field(): DevExpress.core.DxElement;
    /**
     * [descr:dxDropDownEditor.open()]
     */
    open(): void;
  }
  module dxDropDownEditor {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface DropDownButtonTemplateDataModel {
      readonly text?: string;
      readonly icon?: string;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDropDownEditorOptions<TComponent>
    extends dxTextBoxOptions<TComponent> {
    /**
     * [descr:dxDropDownEditorOptions.acceptCustomValue]
     */
    acceptCustomValue?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.applyValueMode]
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * [descr:dxDropDownEditorOptions.dropDownOptions]
     */
    dropDownOptions?:
      | DevExpress.ui.dxPopup.Properties
      | DevExpress.ui.dxPopover.Properties;
    /**
     * [descr:dxDropDownEditorOptions.buttons]
     */
    buttons?: Array<'clear' | 'dropDown' | dxTextEditorButton>;
    /**
     * [descr:dxDropDownEditorOptions.deferRendering]
     */
    deferRendering?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.dropDownButtonTemplate]
     */
    dropDownButtonTemplate?:
      | DevExpress.core.template
      | ((
          buttonData: DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownEditorOptions.onClosed]
     */
    onClosed?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:dxDropDownEditorOptions.onOpened]
     */
    onOpened?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:dxDropDownEditorOptions.openOnFieldClick]
     */
    openOnFieldClick?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.opened]
     */
    opened?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.showDropDownButton]
     */
    showDropDownButton?: boolean;
    /**
     * [descr:dxDropDownEditorOptions.value]
     */
    value?: any;
  }
  /**
   * [descr:dxDropDownList]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxDropDownList<
    TProperties
  > extends dxDropDownEditor<TProperties> {
    getDataSource(): DevExpress.data.DataSource;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxDropDownListOptions<TComponent>
    extends DataExpressionMixinOptions<TComponent>,
      dxDropDownEditorOptions<TComponent> {
    /**
     * [descr:dxDropDownListOptions.displayValue]
     */
    displayValue?: string;
    /**
     * [descr:dxDropDownListOptions.groupTemplate]
     */
    groupTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxDropDownListOptions.grouped]
     */
    grouped?: boolean;
    /**
     * [descr:dxDropDownListOptions.minSearchLength]
     */
    minSearchLength?: number;
    /**
     * [descr:dxDropDownListOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:dxDropDownListOptions.onItemClick]
     */
    onItemClick?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.events.ItemInfo
    ) => void;
    /**
     * [descr:dxDropDownListOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo
    ) => void;
    /**
     * [descr:dxDropDownListOptions.onValueChanged]
     */
    onValueChanged?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.ui.Editor.ValueChangedInfo
    ) => void;
    /**
     * [descr:dxDropDownListOptions.searchEnabled]
     */
    searchEnabled?: boolean;
    /**
     * [descr:dxDropDownListOptions.searchExpr]
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * [descr:dxDropDownListOptions.searchMode]
     */
    searchMode?: 'contains' | 'startswith';
    /**
     * [descr:dxDropDownListOptions.searchTimeout]
     */
    searchTimeout?: number;
    /**
     * [descr:dxDropDownListOptions.selectedItem]
     */
    selectedItem?: any;
    /**
     * [descr:dxDropDownListOptions.showDataBeforeSearch]
     */
    showDataBeforeSearch?: boolean;
    /**
     * [descr:dxDropDownListOptions.value]
     */
    value?: any;
    /**
     * [descr:dxDropDownListOptions.valueChangeEvent]
     */
    valueChangeEvent?: string;
    /**
     * [descr:dxDropDownListOptions.wrapItemText]
     */
    wrapItemText?: boolean;
    /**
     * [descr:dxDropDownListOptions.useItemTextAsTitle]
     */
    useItemTextAsTitle?: boolean;
  }
  /**
   * [descr:dxFileManager]
   */
  export class dxFileManager extends Widget<dxFileManagerOptions> {
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
    refresh(): DevExpress.core.utils.DxPromise<any>;
  }
  module dxFileManager {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxFileManager>;
    export type ContextMenuItemClickEvent =
      DevExpress.events.NativeEventInfo<dxFileManager> & {
        readonly itemData: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly itemIndex: number;
        readonly fileSystemItem?: DevExpress.fileManagement.FileSystemItem;
        readonly viewArea: 'navPane' | 'itemView';
      };
    export type ContextMenuShowingEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxFileManager> & {
        readonly fileSystemItem?: DevExpress.fileManagement.FileSystemItem;
        readonly targetElement?: DevExpress.core.DxElement;
        readonly viewArea: 'navPane' | 'itemView';
      };
    export type CurrentDirectoryChangedEvent =
      DevExpress.events.EventInfo<dxFileManager> & {
        readonly directory: DevExpress.fileManagement.FileSystemItem;
      };
    export type DisposingEvent = DevExpress.events.EventInfo<dxFileManager>;
    export type ErrorOccurredEvent =
      DevExpress.events.EventInfo<dxFileManager> & {
        readonly errorCode?: number;
        errorText?: string;
        readonly fileSystemItem?: DevExpress.fileManagement.FileSystemItem;
      };
    export type FocusedItemChangedEvent =
      DevExpress.events.EventInfo<dxFileManager> & {
        readonly item?: DevExpress.fileManagement.FileSystemItem;
        readonly itemElement?: DevExpress.core.DxElement;
      };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxFileManager>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxFileManager> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxFileManagerOptions;
    export type SelectedFileOpenedEvent =
      DevExpress.events.EventInfo<dxFileManager> & {
        readonly file: DevExpress.fileManagement.FileSystemItem;
      };
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxFileManager> & {
        readonly currentSelectedItemKeys: Array<string>;
        readonly currentDeselectedItemKeys: Array<string>;
        readonly selectedItems: Array<DevExpress.fileManagement.FileSystemItem>;
        readonly selectedItemKeys: Array<string>;
      };
    export type ToolbarItemClickEvent =
      DevExpress.events.NativeEventInfo<dxFileManager> & {
        readonly itemData: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly itemIndex: number;
      };
  }
  /**
   * [descr:dxFileManagerContextMenu]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFileManagerContextMenu {
    /**
     * [descr:dxFileManagerContextMenu.items]
     */
    items?: Array<
      | dxFileManagerContextMenuItem
      | 'create'
      | 'upload'
      | 'refresh'
      | 'download'
      | 'move'
      | 'copy'
      | 'rename'
      | 'delete'
    >;
  }
  /**
   * [descr:dxFileManagerContextMenuItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * [descr:dxFileManagerContextMenuItem.items]
     */
    items?: Array<dxFileManagerContextMenuItem>;
    /**
     * [descr:dxFileManagerContextMenuItem.name]
     */
    name?:
      | 'create'
      | 'upload'
      | 'refresh'
      | 'download'
      | 'move'
      | 'copy'
      | 'rename'
      | 'delete'
      | string;
    /**
     * [descr:dxFileManagerContextMenuItem.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxFileManagerContextMenuItem.template]
     */
    template?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * [descr:dxFileManagerDetailsColumn]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * [descr:dxFileManagerOptions.allowedFileExtensions]
     */
    allowedFileExtensions?: Array<string>;
    /**
     * [descr:dxFileManagerOptions.contextMenu]
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * [descr:dxFileManagerOptions.currentPath]
     */
    currentPath?: string;
    /**
     * [descr:dxFileManagerOptions.currentPathKeys]
     */
    currentPathKeys?: Array<string>;
    /**
     * [descr:dxFileManagerOptions.customizeDetailColumns]
     */
    customizeDetailColumns?: (
      columns: Array<dxFileManagerDetailsColumn>
    ) => Array<dxFileManagerDetailsColumn>;
    /**
     * [descr:dxFileManagerOptions.customizeThumbnail]
     */
    customizeThumbnail?: (
      fileSystemItem: DevExpress.fileManagement.FileSystemItem
    ) => string;
    /**
     * [descr:dxFileManagerOptions.fileSystemProvider]
     */
    fileSystemProvider?: any;
    /**
     * [descr:dxFileManagerOptions.itemView]
     */
    itemView?: {
      /**
       * [descr:dxFileManagerOptions.itemView.details]
       */
      details?: {
        /**
         * [descr:dxFileManagerOptions.itemView.details.columns]
         */
        columns?: Array<dxFileManagerDetailsColumn | string>;
      };
      /**
       * [descr:dxFileManagerOptions.itemView.mode]
       */
      mode?: 'details' | 'thumbnails';
      /**
       * [descr:dxFileManagerOptions.itemView.showFolders]
       */
      showFolders?: boolean;
      /**
       * [descr:dxFileManagerOptions.itemView.showParentFolder]
       */
      showParentFolder?: boolean;
    };
    /**
     * [descr:dxFileManagerOptions.notifications]
     */
    notifications?: {
      /**
       * [descr:dxFileManagerOptions.notifications.showPanel]
       */
      showPanel?: boolean;
      /**
       * [descr:dxFileManagerOptions.notifications.showPopup]
       */
      showPopup?: boolean;
    };
    /**
     * [descr:dxFileManagerOptions.onContextMenuItemClick]
     */
    onContextMenuItemClick?: (
      e: DevExpress.ui.dxFileManager.ContextMenuItemClickEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onContextMenuShowing]
     */
    onContextMenuShowing?: (
      e: DevExpress.ui.dxFileManager.ContextMenuShowingEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onCurrentDirectoryChanged]
     */
    onCurrentDirectoryChanged?: (
      e: DevExpress.ui.dxFileManager.CurrentDirectoryChangedEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onSelectedFileOpened]
     */
    onSelectedFileOpened?: (
      e: DevExpress.ui.dxFileManager.SelectedFileOpenedEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxFileManager.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onToolbarItemClick]
     */
    onToolbarItemClick?: (
      e: DevExpress.ui.dxFileManager.ToolbarItemClickEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onFocusedItemChanged]
     */
    onFocusedItemChanged?: (
      e: DevExpress.ui.dxFileManager.FocusedItemChangedEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.onErrorOccurred]
     */
    onErrorOccurred?: (
      e: DevExpress.ui.dxFileManager.ErrorOccurredEvent
    ) => void;
    /**
     * [descr:dxFileManagerOptions.permissions]
     */
    permissions?: {
      /**
       * [descr:dxFileManagerOptions.permissions.copy]
       */
      copy?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.create]
       */
      create?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.download]
       */
      download?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.move]
       */
      move?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.delete]
       */
      delete?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.rename]
       */
      rename?: boolean;
      /**
       * [descr:dxFileManagerOptions.permissions.upload]
       */
      upload?: boolean;
    };
    /**
     * [descr:dxFileManagerOptions.rootFolderName]
     */
    rootFolderName?: string;
    /**
     * [descr:dxFileManagerOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxFileManagerOptions.selectedItemKeys]
     */
    selectedItemKeys?: Array<string>;
    /**
     * [descr:dxFileManagerOptions.focusedItemKey]
     */
    focusedItemKey?: string;
    /**
     * [descr:dxFileManagerOptions.toolbar]
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * [descr:dxFileManagerOptions.upload]
     */
    upload?: {
      /**
       * [descr:dxFileManagerOptions.upload.maxFileSize]
       */
      maxFileSize?: number;
      /**
       * [descr:dxFileManagerOptions.upload.chunkSize]
       */
      chunkSize?: number;
    };
  }
  /**
   * [descr:dxFileManagerToolbar]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFileManagerToolbar {
    /**
     * [descr:dxFileManagerToolbar.fileSelectionItems]
     */
    fileSelectionItems?: Array<
      | dxFileManagerToolbarItem
      | 'showNavPane'
      | 'create'
      | 'upload'
      | 'refresh'
      | 'switchView'
      | 'download'
      | 'move'
      | 'copy'
      | 'rename'
      | 'delete'
      | 'clearSelection'
      | 'separator'
    >;
    /**
     * [descr:dxFileManagerToolbar.items]
     */
    items?: Array<
      | dxFileManagerToolbarItem
      | 'showNavPane'
      | 'create'
      | 'upload'
      | 'refresh'
      | 'switchView'
      | 'download'
      | 'move'
      | 'copy'
      | 'rename'
      | 'delete'
      | 'clearSelection'
      | 'separator'
    >;
  }
  /**
   * [descr:dxFileManagerToolbarItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    name?:
      | 'showNavPane'
      | 'create'
      | 'upload'
      | 'refresh'
      | 'switchView'
      | 'download'
      | 'move'
      | 'copy'
      | 'rename'
      | 'delete'
      | 'clearSelection'
      | 'separator'
      | string;
    /**
     * [descr:dxFileManagerToolbarItem.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxFileManagerToolbarItem.html]
     */
    html?: string;
    /**
     * [descr:dxFileManagerToolbarItem.template]
     */
    template?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxFileManagerToolbarItem.menuItemTemplate]
     */
    menuItemTemplate?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * [descr:dxFileUploader]
   */
  export class dxFileUploader extends Editor<dxFileUploaderOptions> {
    /**
     * [descr:dxFileUploader.upload()]
     */
    upload(): void;
    /**
     * [descr:dxFileUploader.upload(fileIndex)]
     */
    upload(fileIndex: number): void;
    /**
     * [descr:dxFileUploader.upload(file)]
     */
    upload(file: File): void;
    /**
     * [descr:dxFileUploader.abortUpload()]
     */
    abortUpload(): void;
    /**
     * [descr:dxFileUploader.abortUpload(fileIndex)]
     */
    abortUpload(fileIndex: number): void;
    /**
     * [descr:dxFileUploader.abortUpload(file)]
     */
    abortUpload(file: File): void;
    /**
     * [descr:dxFileUploader.removeFile(fileIndex)]
     */
    removeFile(fileIndex: number): void;
    /**
     * [descr:dxFileUploader.removeFile(file)]
     */
    removeFile(file: File): void;
  }
  module dxFileUploader {
    export type BeforeSendEvent =
      DevExpress.events.EventInfo<dxFileUploader> & {
        readonly request: XMLHttpRequest;
        readonly file: File;
        readonly uploadInfo?: DevExpress.fileManagement.UploadInfo;
      };
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxFileUploader>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxFileUploader>;
    export type DropZoneEnterEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly dropZoneElement: DevExpress.core.DxElement;
      };
    export type DropZoneLeaveEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly dropZoneElement: DevExpress.core.DxElement;
      };
    export type FilesUploadedEvent =
      DevExpress.events.EventInfo<dxFileUploader>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxFileUploader>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxFileUploader> &
        DevExpress.events.ChangedOptionInfo;
    export type ProgressEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly file: File;
        readonly segmentSize: number;
        readonly bytesLoaded: number;
        readonly bytesTotal: number;
        readonly request: XMLHttpRequest;
      };
    export type Properties = dxFileUploaderOptions;
    export type UploadAbortedEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly file: File;
        readonly request: XMLHttpRequest;
        message: string;
      };
    export type UploadedEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly file: File;
        readonly request: XMLHttpRequest;
        message: string;
      };
    export type UploadErrorEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly file: File;
        readonly request: XMLHttpRequest;
        readonly error: any;
        message: string;
      };
    export type UploadStartedEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly file: File;
        readonly request: XMLHttpRequest;
      };
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxFileUploader> & {
        readonly value?: Array<File>;
        readonly previousValue?: Array<File>;
      };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * [descr:dxFileUploaderOptions.abortUpload]
     */
    abortUpload?: (
      file: File,
      uploadInfo?: DevExpress.fileManagement.UploadInfo
    ) => PromiseLike<any> | any;
    /**
     * [descr:dxFileUploaderOptions.accept]
     */
    accept?: string;
    /**
     * [descr:dxFileUploaderOptions.allowCanceling]
     */
    allowCanceling?: boolean;
    /**
     * [descr:dxFileUploaderOptions.allowedFileExtensions]
     */
    allowedFileExtensions?: Array<string>;
    /**
     * [descr:dxFileUploaderOptions.chunkSize]
     */
    chunkSize?: number;
    /**
     * [descr:dxFileUploaderOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxFileUploaderOptions.invalidFileExtensionMessage]
     */
    invalidFileExtensionMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.invalidMaxFileSizeMessage]
     */
    invalidMaxFileSizeMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.invalidMinFileSizeMessage]
     */
    invalidMinFileSizeMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.inputAttr]
     */
    inputAttr?: any;
    /**
     * [descr:dxFileUploaderOptions.labelText]
     */
    labelText?: string;
    /**
     * [descr:dxFileUploaderOptions.maxFileSize]
     */
    maxFileSize?: number;
    /**
     * [descr:dxFileUploaderOptions.minFileSize]
     */
    minFileSize?: number;
    /**
     * [descr:dxFileUploaderOptions.multiple]
     */
    multiple?: boolean;
    /**
     * [descr:dxFileUploaderOptions.name]
     */
    name?: string;
    /**
     * [descr:dxFileUploaderOptions.onBeforeSend]
     */
    onBeforeSend?: (e: DevExpress.ui.dxFileUploader.BeforeSendEvent) => void;
    /**
     * [descr:dxFileUploaderOptions.onDropZoneEnter]
     */
    onDropZoneEnter?: (
      e: DevExpress.ui.dxFileUploader.DropZoneEnterEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.onDropZoneLeave]
     */
    onDropZoneLeave?: (
      e: DevExpress.ui.dxFileUploader.DropZoneLeaveEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.onFilesUploaded]
     */
    onFilesUploaded?: (
      e: DevExpress.ui.dxFileUploader.FilesUploadedEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.onProgress]
     */
    onProgress?: (e: DevExpress.ui.dxFileUploader.ProgressEvent) => void;
    /**
     * [descr:dxFileUploaderOptions.onUploadAborted]
     */
    onUploadAborted?: (
      e: DevExpress.ui.dxFileUploader.UploadAbortedEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.onUploadError]
     */
    onUploadError?: (e: DevExpress.ui.dxFileUploader.UploadErrorEvent) => void;
    /**
     * [descr:dxFileUploaderOptions.onUploadStarted]
     */
    onUploadStarted?: (
      e: DevExpress.ui.dxFileUploader.UploadStartedEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.onUploaded]
     */
    onUploaded?: (e: DevExpress.ui.dxFileUploader.UploadedEvent) => void;
    /**
     * [descr:dxFileUploaderOptions.onValueChanged]
     */
    onValueChanged?: (
      e: DevExpress.ui.dxFileUploader.ValueChangedEvent
    ) => void;
    /**
     * [descr:dxFileUploaderOptions.progress]
     */
    progress?: number;
    /**
     * [descr:dxFileUploaderOptions.readyToUploadMessage]
     */
    readyToUploadMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.selectButtonText]
     */
    selectButtonText?: string;
    /**
     * [descr:dxFileUploaderOptions.showFileList]
     */
    showFileList?: boolean;
    /**
     * [descr:dxFileUploaderOptions.dialogTrigger]
     */
    dialogTrigger?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxFileUploaderOptions.dropZone]
     */
    dropZone?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxFileUploaderOptions.uploadButtonText]
     */
    uploadButtonText?: string;
    /**
     * [descr:dxFileUploaderOptions.uploadChunk]
     */
    uploadChunk?: (
      file: File,
      uploadInfo: DevExpress.fileManagement.UploadInfo
    ) => PromiseLike<any> | any;
    /**
     * [descr:dxFileUploaderOptions.uploadFailedMessage]
     */
    uploadFailedMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.uploadAbortedMessage]
     */
    uploadAbortedMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.uploadFile]
     */
    uploadFile?: (
      file: File,
      progressCallback: Function
    ) => PromiseLike<any> | any;
    /**
     * [descr:dxFileUploaderOptions.uploadHeaders]
     */
    uploadHeaders?: any;
    /**
     * [descr:dxFileUploaderOptions.uploadCustomData]
     */
    uploadCustomData?: any;
    /**
     * [descr:dxFileUploaderOptions.uploadMethod]
     */
    uploadMethod?: 'POST' | 'PUT';
    /**
     * [descr:dxFileUploaderOptions.uploadMode]
     */
    uploadMode?: 'instantly' | 'useButtons' | 'useForm';
    /**
     * [descr:dxFileUploaderOptions.uploadUrl]
     */
    uploadUrl?: string;
    /**
     * [descr:dxFileUploaderOptions.uploadedMessage]
     */
    uploadedMessage?: string;
    /**
     * [descr:dxFileUploaderOptions.value]
     */
    value?: Array<File>;
  }
  /**
   * [descr:dxFilterBuilder]
   */
  export class dxFilterBuilder extends Widget<dxFilterBuilderOptions> {
    /**
     * [descr:dxFilterBuilder.getFilterExpression()]
     */
    getFilterExpression(): string | Array<any> | Function;
  }
  module dxFilterBuilder {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxFilterBuilder>;
    export type CustomOperationEditorTemplate = {
      readonly value?: string | number | Date;
      readonly field: dxFilterBuilderField;
      readonly setValue: Function;
    };
    export type DisposingEvent = DevExpress.events.EventInfo<dxFilterBuilder>;
    export type EditorPreparedEvent =
      DevExpress.events.EventInfo<dxFilterBuilder> & {
        readonly value?: any;
        readonly setValue: any;
        readonly editorElement: DevExpress.core.DxElement;
        readonly editorName: string;
        readonly dataField?: string;
        readonly filterOperation?: string;
        readonly updateValueTimeout?: number;
        readonly width?: number;
        readonly readOnly: boolean;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
      };
    export type EditorPreparingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxFilterBuilder> & {
        readonly value?: any;
        readonly setValue: any;
        readonly editorElement?: DevExpress.core.DxElement;
        editorName: string;
        editorOptions?: any;
        readonly dataField?: string;
        readonly filterOperation?: string;
        updateValueTimeout?: number;
        readonly width?: number;
        readonly readOnly: boolean;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
      };
    export type FieldEditorTemplate = {
      readonly value?: string | number | Date;
      readonly filterOperation?: string;
      readonly field: dxFilterBuilderField;
      readonly setValue: Function;
    };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxFilterBuilder>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxFilterBuilder> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxFilterBuilderOptions;
    export type ValueChangedEvent =
      DevExpress.events.EventInfo<dxFilterBuilder> & {
        readonly value?: any;
        readonly previousValue?: any;
      };
  }
  /**
   * [descr:dxFilterBuilderCustomOperation]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFilterBuilderCustomOperation {
    /**
     * [descr:dxFilterBuilderCustomOperation.calculateFilterExpression]
     */
    calculateFilterExpression?: (
      filterValue: any,
      field: dxFilterBuilderField
    ) => string | Array<any> | Function;
    /**
     * [descr:dxFilterBuilderCustomOperation.caption]
     */
    caption?: string;
    /**
     * [descr:dxFilterBuilderCustomOperation.customizeText]
     */
    customizeText?: (fieldInfo: {
      value?: string | number | Date;
      valueText?: string;
      field?: dxFilterBuilderField;
    }) => string;
    /**
     * [descr:dxFilterBuilderCustomOperation.dataTypes]
     */
    dataTypes?: Array<
      'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'
    >;
    /**
     * [descr:dxFilterBuilderCustomOperation.editorTemplate]
     */
    editorTemplate?:
      | DevExpress.core.template
      | ((
          conditionInfo: DevExpress.ui.dxFilterBuilder.CustomOperationEditorTemplate,
          container: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFilterBuilderField {
    /**
     * [descr:dxFilterBuilderField.calculateFilterExpression]
     */
    calculateFilterExpression?: (
      filterValue: any,
      selectedFilterOperation: string
    ) => string | Array<any> | Function;
    /**
     * [descr:dxFilterBuilderField.caption]
     */
    caption?: string;
    /**
     * [descr:dxFilterBuilderField.customizeText]
     */
    customizeText?: (fieldInfo: {
      value?: string | number | Date;
      valueText?: string;
    }) => string;
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
    editorTemplate?:
      | DevExpress.core.template
      | ((
          conditionInfo: DevExpress.ui.dxFilterBuilder.FieldEditorTemplate,
          container: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxFilterBuilderField.falseText]
     */
    falseText?: string;
    /**
     * [descr:dxFilterBuilderField.filterOperations]
     */
    filterOperations?: Array<
      | '='
      | '<>'
      | '<'
      | '<='
      | '>'
      | '>='
      | 'contains'
      | 'endswith'
      | 'isblank'
      | 'isnotblank'
      | 'notcontains'
      | 'startswith'
      | 'between'
      | string
    >;
    /**
     * [descr:dxFilterBuilderField.format]
     */
    format?: format;
    /**
     * [descr:dxFilterBuilderField.lookup]
     */
    lookup?: {
      /**
       * [descr:dxFilterBuilderField.lookup.allowClearing]
       */
      allowClearing?: boolean;
      /**
       * [descr:dxFilterBuilderField.lookup.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxFilterBuilderField.lookup.displayExpr]
       */
      displayExpr?: string | ((data: any) => string);
      /**
       * [descr:dxFilterBuilderField.lookup.valueExpr]
       */
      valueExpr?: string | ((data: any) => string | number | boolean);
    };
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFilterBuilderOptions
    extends WidgetOptions<dxFilterBuilder> {
    /**
     * [descr:dxFilterBuilderOptions.allowHierarchicalFields]
     */
    allowHierarchicalFields?: boolean;
    /**
     * [descr:dxFilterBuilderOptions.customOperations]
     */
    customOperations?: Array<dxFilterBuilderCustomOperation>;
    /**
     * [descr:dxFilterBuilderOptions.fields]
     */
    fields?: Array<dxFilterBuilderField>;
    /**
     * [descr:dxFilterBuilderOptions.filterOperationDescriptions]
     */
    filterOperationDescriptions?: {
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.between]
       */
      between?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.contains]
       */
      contains?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.endsWith]
       */
      endsWith?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.equal]
       */
      equal?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.greaterThan]
       */
      greaterThan?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.greaterThanOrEqual]
       */
      greaterThanOrEqual?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.isBlank]
       */
      isBlank?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.isNotBlank]
       */
      isNotBlank?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.lessThan]
       */
      lessThan?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.lessThanOrEqual]
       */
      lessThanOrEqual?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.notContains]
       */
      notContains?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.notEqual]
       */
      notEqual?: string;
      /**
       * [descr:dxFilterBuilderOptions.filterOperationDescriptions.startsWith]
       */
      startsWith?: string;
    };
    /**
     * [descr:dxFilterBuilderOptions.groupOperationDescriptions]
     */
    groupOperationDescriptions?: {
      /**
       * [descr:dxFilterBuilderOptions.groupOperationDescriptions.and]
       */
      and?: string;
      /**
       * [descr:dxFilterBuilderOptions.groupOperationDescriptions.notAnd]
       */
      notAnd?: string;
      /**
       * [descr:dxFilterBuilderOptions.groupOperationDescriptions.notOr]
       */
      notOr?: string;
      /**
       * [descr:dxFilterBuilderOptions.groupOperationDescriptions.or]
       */
      or?: string;
    };
    /**
     * [descr:dxFilterBuilderOptions.groupOperations]
     */
    groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
    /**
     * [descr:dxFilterBuilderOptions.maxGroupLevel]
     */
    maxGroupLevel?: number;
    /**
     * [descr:dxFilterBuilderOptions.onEditorPrepared]
     */
    onEditorPrepared?: (
      e: DevExpress.ui.dxFilterBuilder.EditorPreparedEvent
    ) => void;
    /**
     * [descr:dxFilterBuilderOptions.onEditorPreparing]
     */
    onEditorPreparing?: (
      e: DevExpress.ui.dxFilterBuilder.EditorPreparingEvent
    ) => void;
    /**
     * [descr:dxFilterBuilderOptions.onValueChanged]
     */
    onValueChanged?: (
      e: DevExpress.ui.dxFilterBuilder.ValueChangedEvent
    ) => void;
    /**
     * [descr:dxFilterBuilderOptions.value]
     */
    value?: string | Array<any> | Function;
  }
  /**
   * [descr:dxForm]
   */
  export class dxForm extends Widget<dxFormOptions> {
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
    updateDimensions(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxForm.validate()]
     */
    validate(): dxValidationGroupResult;
  }
  module dxForm {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxForm>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxForm>;
    export type EditorEnterKeyEvent = DevExpress.events.EventInfo<dxForm> & {
      readonly dataField?: string;
    };
    export type FieldDataChangedEvent = DevExpress.events.EventInfo<dxForm> & {
      readonly dataField?: string;
      readonly value?: any;
    };
    export type GroupItemTemplateData = {
      readonly component: dxForm;
      readonly formData?: any;
    };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxForm>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxForm> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxFormOptions;
    export type SimpleItemTemplateData = {
      readonly component: dxForm;
      readonly dataField?: string;
      readonly editorOptions?: any;
      readonly editorType?: string;
      readonly name?: string;
    };
  }
  /**
   * [descr:dxFormButtonItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    items?: Array<
      | dxFormSimpleItem
      | dxFormGroupItem
      | dxFormTabbedItem
      | dxFormEmptyItem
      | dxFormButtonItem
    >;
    /**
     * [descr:dxFormGroupItem.name]
     */
    name?: string;
    /**
     * [descr:dxFormGroupItem.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          data: DevExpress.ui.dxForm.GroupItemTemplateData,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFormOptions extends WidgetOptions<dxForm> {
    /**
     * [descr:dxFormOptions.alignItemLabels]
     */
    alignItemLabels?: boolean;
    /**
     * [descr:dxFormOptions.alignItemLabelsInAllGroups]
     */
    alignItemLabelsInAllGroups?: boolean;
    /**
     * [descr:dxFormOptions.colCount]
     */
    colCount?: number | 'auto';
    /**
     * [descr:dxFormOptions.colCountByScreen]
     */
    colCountByScreen?: any;
    /**
     * [descr:dxFormOptions.customizeItem]
     */
    customizeItem?: (
      item:
        | dxFormSimpleItem
        | dxFormGroupItem
        | dxFormTabbedItem
        | dxFormEmptyItem
        | dxFormButtonItem
    ) => void;
    /**
     * [descr:dxFormOptions.formData]
     */
    formData?: any;
    /**
     * [descr:dxFormOptions.items]
     */
    items?: Array<
      | dxFormSimpleItem
      | dxFormGroupItem
      | dxFormTabbedItem
      | dxFormEmptyItem
      | dxFormButtonItem
    >;
    /**
     * [descr:dxFormOptions.labelLocation]
     */
    labelLocation?: 'left' | 'right' | 'top';
    /**
     * [descr:dxFormOptions.minColWidth]
     */
    minColWidth?: number;
    /**
     * [descr:dxFormOptions.onEditorEnterKey]
     */
    onEditorEnterKey?: (e: DevExpress.ui.dxForm.EditorEnterKeyEvent) => void;
    /**
     * [descr:dxFormOptions.onFieldDataChanged]
     */
    onFieldDataChanged?: (
      e: DevExpress.ui.dxForm.FieldDataChangedEvent
    ) => void;
    /**
     * [descr:dxFormOptions.optionalMark]
     */
    optionalMark?: string;
    /**
     * [descr:dxFormOptions.readOnly]
     */
    readOnly?: boolean;
    /**
     * [descr:dxFormOptions.requiredMark]
     */
    requiredMark?: string;
    /**
     * [descr:dxFormOptions.requiredMessage]
     */
    requiredMessage?: string;
    /**
     * [descr:dxFormOptions.screenByWidth]
     */
    screenByWidth?: Function;
    /**
     * [descr:dxFormOptions.scrollingEnabled]
     */
    scrollingEnabled?: boolean;
    /**
     * [descr:dxFormOptions.showColonAfterLabel]
     */
    showColonAfterLabel?: boolean;
    /**
     * [descr:dxFormOptions.showOptionalMark]
     */
    showOptionalMark?: boolean;
    /**
     * [descr:dxFormOptions.showRequiredMark]
     */
    showRequiredMark?: boolean;
    /**
     * [descr:dxFormOptions.showValidationSummary]
     */
    showValidationSummary?: boolean;
    /**
     * [descr:dxFormOptions.validationGroup]
     */
    validationGroup?: string;
  }
  /**
   * [descr:dxFormSimpleItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    editorType?:
      | 'dxAutocomplete'
      | 'dxCalendar'
      | 'dxCheckBox'
      | 'dxColorBox'
      | 'dxDateBox'
      | 'dxDropDownBox'
      | 'dxHtmlEditor'
      | 'dxLookup'
      | 'dxNumberBox'
      | 'dxRadioGroup'
      | 'dxRangeSlider'
      | 'dxSelectBox'
      | 'dxSlider'
      | 'dxSwitch'
      | 'dxTagBox'
      | 'dxTextArea'
      | 'dxTextBox';
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
    label?: {
      /**
       * [descr:dxFormSimpleItem.label.alignment]
       */
      alignment?: 'center' | 'left' | 'right';
      /**
       * [descr:dxFormSimpleItem.label.location]
       */
      location?: 'left' | 'right' | 'top';
      /**
       * [descr:dxFormSimpleItem.label.showColon]
       */
      showColon?: boolean;
      /**
       * [descr:dxFormSimpleItem.label.text]
       */
      text?: string;
      /**
       * [descr:dxFormSimpleItem.label.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxFormSimpleItem.name]
     */
    name?: string;
    /**
     * [descr:dxFormSimpleItem.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          data: DevExpress.ui.dxForm.SimpleItemTemplateData,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxFormSimpleItem.validationRules]
     */
    validationRules?: Array<
      | RequiredRule
      | NumericRule
      | RangeRule
      | StringLengthRule
      | CustomRule
      | CompareRule
      | PatternRule
      | EmailRule
      | AsyncRule
    >;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    tabs?: Array<{
      /**
       * [descr:dxFormTabbedItem.tabs.alignItemLabels]
       */
      alignItemLabels?: boolean;
      /**
       * [descr:dxFormTabbedItem.tabs.badge]
       */
      badge?: string;
      /**
       * [descr:dxFormTabbedItem.tabs.colCount]
       */
      colCount?: number;
      /**
       * [descr:dxFormTabbedItem.tabs.colCountByScreen]
       */
      colCountByScreen?: any;
      /**
       * [descr:dxFormTabbedItem.tabs.disabled]
       */
      disabled?: boolean;
      /**
       * [descr:dxFormTabbedItem.tabs.icon]
       */
      icon?: string;
      /**
       * [descr:dxFormTabbedItem.tabs.items]
       */
      items?: Array<
        | dxFormSimpleItem
        | dxFormGroupItem
        | dxFormTabbedItem
        | dxFormEmptyItem
        | dxFormButtonItem
      >;
      /**
       * [descr:dxFormTabbedItem.tabs.tabTemplate]
       */
      tabTemplate?:
        | DevExpress.core.template
        | ((
            tabData: any,
            tabIndex: number,
            tabElement: DevExpress.core.DxElement
          ) => any);
      /**
       * [descr:dxFormTabbedItem.tabs.template]
       */
      template?:
        | DevExpress.core.template
        | ((
            tabData: any,
            tabIndex: number,
            tabElement: DevExpress.core.DxElement
          ) => any);
      /**
       * [descr:dxFormTabbedItem.tabs.title]
       */
      title?: string;
    }>;
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
   * [descr:dxGallery]
   */
  export class dxGallery extends CollectionWidget<dxGalleryOptions> {
    /**
     * [descr:dxGallery.goToItem(itemIndex, animation)]
     */
    goToItem(
      itemIndex: number,
      animation: boolean
    ): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxGallery.nextItem(animation)]
     */
    nextItem(animation: boolean): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxGallery.prevItem(animation)]
     */
    prevItem(animation: boolean): DevExpress.core.utils.DxPromise<void>;
  }
  module dxGallery {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxGallery>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxGallery>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxGallery>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxGallery> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxGallery> & DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxGallery> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxGallery> & DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxGallery> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxGalleryOptions;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxGallery> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxGalleryItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
    /**
     * [descr:dxGalleryOptions.animationDuration]
     */
    animationDuration?: number;
    /**
     * [descr:dxGalleryOptions.animationEnabled]
     */
    animationEnabled?: boolean;
    /**
     * [descr:dxGalleryOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxGalleryItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxGalleryOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxGalleryOptions.indicatorEnabled]
     */
    indicatorEnabled?: boolean;
    /**
     * [descr:dxGalleryOptions.initialItemWidth]
     */
    initialItemWidth?: number;
    /**
     * [descr:dxGalleryOptions.items]
     */
    items?: Array<string | dxGalleryItem | any>;
    /**
     * [descr:dxGalleryOptions.loop]
     */
    loop?: boolean;
    /**
     * [descr:dxGalleryOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:dxGalleryOptions.selectedIndex]
     */
    selectedIndex?: number;
    /**
     * [descr:dxGalleryOptions.showIndicator]
     */
    showIndicator?: boolean;
    /**
     * [descr:dxGalleryOptions.showNavButtons]
     */
    showNavButtons?: boolean;
    /**
     * [descr:dxGalleryOptions.slideshowDelay]
     */
    slideshowDelay?: number;
    /**
     * [descr:dxGalleryOptions.stretchImages]
     */
    stretchImages?: boolean;
    /**
     * [descr:dxGalleryOptions.swipeEnabled]
     */
    swipeEnabled?: boolean;
    /**
     * [descr:dxGalleryOptions.wrapAround]
     */
    wrapAround?: boolean;
  }
  /**
   * [descr:dxGantt]
   */
  export class dxGantt extends Widget<dxGanttOptions> {
    /**
     * [descr:dxGantt.getTaskData(key)]
     */
    getTaskData(key: any): any;
    /**
     * [descr:dxGantt.getDependencyData(key)]
     */
    getDependencyData(key: any): any;
    /**
     * [descr:dxGantt.getResourceData(key)]
     */
    getResourceData(key: any): any;
    /**
     * [descr:dxGantt.getResourceAssignmentData(key)]
     */
    getResourceAssignmentData(key: any): any;
    /**
     * [descr:dxGantt.insertTask(data)]
     */
    insertTask(data: any): void;
    /**
     * [descr:dxGantt.deleteTask(key)]
     */
    deleteTask(key: any): void;
    /**
     * [descr:dxGantt.updateTask(key, data)]
     */
    updateTask(key: any, data: any): void;
    /**
     * [descr:dxGantt.insertDependency(data)]
     */
    insertDependency(data: any): void;
    /**
     * [descr:dxGantt.deleteDependency(key)]
     */
    deleteDependency(key: any): void;
    /**
     * [descr:dxGantt.insertResource(data, taskKeys)]
     */
    insertResource(data: any, taskKeys?: Array<any>): void;
    /**
     * [descr:dxGantt.deleteResource(key)]
     */
    deleteResource(key: any): void;
    /**
     * [descr:dxGantt.assignResourceToTask(resourceKey, taskKey)]
     */
    assignResourceToTask(resourceKey: any, taskKey: any): void;
    /**
     * [descr:dxGantt.unassignResourceFromTask(resourceKey, taskKey)]
     */
    unassignResourceFromTask(resourceKey: any, taskKey: any): void;
    /**
     * [descr:dxGantt.getTaskResources(key)]
     */
    getTaskResources(key: any): Array<any>;
    /**
     * [descr:dxGantt.getVisibleTaskKeys()]
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * [descr:dxGantt.getVisibleDependencyKeys()]
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * [descr:dxGantt.getVisibleResourceKeys()]
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * [descr:dxGantt.getVisibleResourceAssignmentKeys()]
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * [descr:dxGantt.updateDimensions()]
     */
    updateDimensions(): void;
    /**
     * [descr:dxGantt.scrollToDate(date)]
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * [descr:dxGantt.exportToPdf(options)]
     */
    exportToPdf(options: any): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:dxGantt.showResourceManagerDialog()]
     */
    showResourceManagerDialog(): void;
  }
  module dxGantt {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxGantt>;
    export type ContextMenuPreparingEvent = DevExpress.events.Cancelable & {
      readonly component?: dxGantt;
      readonly element?: DevExpress.core.DxElement;
      readonly event?: DevExpress.events.DxEvent;
      readonly targetKey?: any;
      readonly targetType?: string;
      readonly data?: any;
      readonly items?: Array<any>;
    };
    export type CustomCommandEvent = {
      readonly component?: dxGantt;
      readonly element?: DevExpress.core.DxElement;
      readonly name: string;
    };
    export type DependencyDeletedEvent =
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type DependencyDeletingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type DependencyInsertedEvent =
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type DependencyInsertingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
      };
    export type DisposingEvent = DevExpress.events.EventInfo<dxGantt>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxGantt>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxGantt> &
      DevExpress.events.ChangedOptionInfo;
    export type ProgressTooltipTemplateData = {
      readonly progress: number;
    };
    export type Properties = dxGanttOptions;
    export type ResourceAssignedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly values: any;
      readonly key: any;
    };
    export type ResourceAssigningEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
      };
    export type ResourceDeletedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly values: any;
      readonly key: any;
    };
    export type ResourceDeletingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type ResourceInsertedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly values: any;
      readonly key: any;
    };
    export type ResourceInsertingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
      };
    export type ResourceManagerDialogShowingEvent =
      DevExpress.events.Cancelable &
        DevExpress.events.EventInfo<dxGantt> & {
          readonly values: Array<any>;
          readonly key: any;
        };
    export type ResourceUnassignedEvent =
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type ResourceUnassigningEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly selectedRowKey?: any;
    };
    export type TaskClickEvent = DevExpress.events.NativeEventInfo<dxGantt> & {
      readonly key?: any;
      readonly data?: any;
    };
    export type TaskContentTemplateData = {
      readonly cellSize: any;
      readonly isMilestone: boolean;
      readonly taskData: any;
      readonly taskHTML: any;
      readonly taskPosition: any;
      readonly taskResources: Array<any>;
      readonly taskSize: any;
    };
    export type TaskDblClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxGantt> & {
        readonly key?: any;
        readonly data?: any;
      };
    export type TaskDeletedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly values: any;
      readonly key: any;
    };
    export type TaskDeletingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
      };
    export type TaskEditDialogShowingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
        readonly key: any;
        readonly readOnlyFields?: Array<string>;
        readonly hiddenFields?: Array<string>;
      };
    export type TaskInsertedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly value?: any;
      readonly key: any;
    };
    export type TaskInsertingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly values: any;
      };
    export type TaskMovingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly newValues: any;
        readonly values: any;
        readonly key: any;
      };
    export type TaskUpdatedEvent = DevExpress.events.EventInfo<dxGantt> & {
      readonly values: any;
      readonly key: any;
    };
    export type TaskUpdatingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxGantt> & {
        readonly newValues: any;
        readonly values: any;
        readonly key: any;
      };
    export type TimeTooltipTemplateData = {
      readonly start: Date;
      readonly end: Date;
    };
  }
  /**
   * [descr:dxGanttContextMenu]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGanttContextMenu {
    /**
     * [descr:dxGanttContextMenu.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:dxGanttContextMenu.items]
     */
    items?: Array<
      | dxGanttContextMenuItem
      | 'undo'
      | 'redo'
      | 'expandAll'
      | 'collapseAll'
      | 'addTask'
      | 'deleteTask'
      | 'zoomIn'
      | 'zoomOut'
      | 'deleteDependency'
      | 'taskDetails'
    >;
  }
  /**
   * [descr:dxGanttContextMenuItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * [descr:dxGanttContextMenuItem.name]
     */
    name?:
      | 'undo'
      | 'redo'
      | 'expandAll'
      | 'collapseAll'
      | 'addTask'
      | 'deleteTask'
      | 'zoomIn'
      | 'zoomOut'
      | 'deleteDependency'
      | 'taskDetails'
      | string;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * [descr:dxGanttOptions.allowSelection]
     */
    allowSelection?: boolean;
    /**
     * [descr:dxGanttOptions.columns]
     */
    columns?: Array<dxTreeListColumn | string>;
    /**
     * [descr:dxGanttOptions.dependencies]
     */
    dependencies?: {
      /**
       * [descr:dxGanttOptions.dependencies.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxGanttOptions.dependencies.keyExpr]
       */
      keyExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.dependencies.predecessorIdExpr]
       */
      predecessorIdExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.dependencies.successorIdExpr]
       */
      successorIdExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.dependencies.typeExpr]
       */
      typeExpr?: string | Function;
    };
    /**
     * [descr:dxGanttOptions.editing]
     */
    editing?: {
      /**
       * [descr:dxGanttOptions.editing.allowDependencyAdding]
       */
      allowDependencyAdding?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowDependencyDeleting]
       */
      allowDependencyDeleting?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowResourceAdding]
       */
      allowResourceAdding?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowResourceDeleting]
       */
      allowResourceDeleting?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowResourceUpdating]
       */
      allowResourceUpdating?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowTaskAdding]
       */
      allowTaskAdding?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowTaskDeleting]
       */
      allowTaskDeleting?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowTaskResourceUpdating]
       */
      allowTaskResourceUpdating?: boolean;
      /**
       * [descr:dxGanttOptions.editing.allowTaskUpdating]
       */
      allowTaskUpdating?: boolean;
      /**
       * [descr:dxGanttOptions.editing.enabled]
       */
      enabled?: boolean;
    };
    /**
     * [descr:dxGanttOptions.validation]
     */
    validation?: {
      /**
       * [descr:dxGanttOptions.validation.validateDependencies]
       */
      validateDependencies?: boolean;
      /**
       * [descr:dxGanttOptions.validation.autoUpdateParentTasks]
       */
      autoUpdateParentTasks?: boolean;
    };
    /**
     * [descr:dxGanttOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxGantt.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onCustomCommand]
     */
    onCustomCommand?: (e: DevExpress.ui.dxGantt.CustomCommandEvent) => void;
    /**
     * [descr:dxGanttOptions.onContextMenuPreparing]
     */
    onContextMenuPreparing?: (
      e: DevExpress.ui.dxGantt.ContextMenuPreparingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onTaskInserting]
     */
    onTaskInserting?: (e: DevExpress.ui.dxGantt.TaskInsertingEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskInserted]
     */
    onTaskInserted?: (e: DevExpress.ui.dxGantt.TaskInsertedEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskDeleting]
     */
    onTaskDeleting?: (e: DevExpress.ui.dxGantt.TaskDeletingEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskDeleted]
     */
    onTaskDeleted?: (e: DevExpress.ui.dxGantt.TaskDeletedEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskUpdating]
     */
    onTaskUpdating?: (e: DevExpress.ui.dxGantt.TaskUpdatingEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskUpdated]
     */
    onTaskUpdated?: (e: DevExpress.ui.dxGantt.TaskUpdatedEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskMoving]
     */
    onTaskMoving?: (e: DevExpress.ui.dxGantt.TaskMovingEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskEditDialogShowing]
     */
    onTaskEditDialogShowing?: (
      e: DevExpress.ui.dxGantt.TaskEditDialogShowingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceManagerDialogShowing]
     */
    onResourceManagerDialogShowing?: (
      e: DevExpress.ui.dxGantt.ResourceManagerDialogShowingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onDependencyInserting]
     */
    onDependencyInserting?: (
      e: DevExpress.ui.dxGantt.DependencyInsertingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onDependencyInserted]
     */
    onDependencyInserted?: (
      e: DevExpress.ui.dxGantt.DependencyInsertedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onDependencyDeleting]
     */
    onDependencyDeleting?: (
      e: DevExpress.ui.dxGantt.DependencyDeletingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onDependencyDeleted]
     */
    onDependencyDeleted?: (
      e: DevExpress.ui.dxGantt.DependencyDeletedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceInserting]
     */
    onResourceInserting?: (
      e: DevExpress.ui.dxGantt.ResourceInsertingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceInserted]
     */
    onResourceInserted?: (
      e: DevExpress.ui.dxGantt.ResourceInsertedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceDeleting]
     */
    onResourceDeleting?: (
      e: DevExpress.ui.dxGantt.ResourceDeletingEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceDeleted]
     */
    onResourceDeleted?: (e: DevExpress.ui.dxGantt.ResourceDeletedEvent) => void;
    /**
     * [descr:dxGanttOptions.onResourceAssigning]
     */
    onResourceAssigning?: (
      e: DevExpress.ui.dxGantt.ResourceAssigningEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceAssigned]
     */
    onResourceAssigned?: (
      e: DevExpress.ui.dxGantt.ResourceAssignedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceUnassigning]
     */
    onResourceUnassigning?: (
      e: DevExpress.ui.dxGantt.ResourceUnassigningEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onResourceUnassigned]
     */
    onResourceUnassigned?: (
      e: DevExpress.ui.dxGantt.ResourceUnassignedEvent
    ) => void;
    /**
     * [descr:dxGanttOptions.onTaskClick]
     */
    onTaskClick?: (e: DevExpress.ui.dxGantt.TaskClickEvent) => void;
    /**
     * [descr:dxGanttOptions.onTaskDblClick]
     */
    onTaskDblClick?: (e: DevExpress.ui.dxGantt.TaskDblClickEvent) => void;
    /**
     * [descr:dxGanttOptions.resourceAssignments]
     */
    resourceAssignments?: {
      /**
       * [descr:dxGanttOptions.resourceAssignments.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxGanttOptions.resourceAssignments.keyExpr]
       */
      keyExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.resourceAssignments.resourceIdExpr]
       */
      resourceIdExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.resourceAssignments.taskIdExpr]
       */
      taskIdExpr?: string | Function;
    };
    /**
     * [descr:dxGanttOptions.resources]
     */
    resources?: {
      /**
       * [descr:dxGanttOptions.resources.colorExpr]
       */
      colorExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.resources.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxGanttOptions.resources.keyExpr]
       */
      keyExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.resources.textExpr]
       */
      textExpr?: string | Function;
    };
    /**
     * [descr:dxGanttOptions.scaleType]
     */
    scaleType?:
      | 'auto'
      | 'minutes'
      | 'hours'
      | 'days'
      | 'weeks'
      | 'months'
      | 'quarters'
      | 'years';
    /**
     * [descr:dxGanttOptions.selectedRowKey]
     */
    selectedRowKey?: any;
    /**
     * [descr:dxGanttOptions.showResources]
     */
    showResources?: boolean;
    /**
     * [descr:dxGanttOptions.showRowLines]
     */
    showRowLines?: boolean;
    /**
     * [descr:dxGanttOptions.taskListWidth]
     */
    taskListWidth?: number;
    /**
     * [descr:dxGanttOptions.taskTitlePosition]
     */
    taskTitlePosition?: 'inside' | 'outside' | 'none';
    /**
     * [descr:dxGanttOptions.firstDayOfWeek]
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * [descr:dxGanttOptions.tasks]
     */
    tasks?: {
      /**
       * [descr:dxGanttOptions.tasks.colorExpr]
       */
      colorExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.dataSource]
       */
      dataSource?:
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxGanttOptions.tasks.endExpr]
       */
      endExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.keyExpr]
       */
      keyExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.parentIdExpr]
       */
      parentIdExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.progressExpr]
       */
      progressExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.startExpr]
       */
      startExpr?: string | Function;
      /**
       * [descr:dxGanttOptions.tasks.titleExpr]
       */
      titleExpr?: string | Function;
    };
    /**
     * [descr:dxGanttOptions.toolbar]
     */
    toolbar?: dxGanttToolbar;
    /**
     * [descr:dxGanttOptions.contextMenu]
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * [descr:dxGanttOptions.stripLines]
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * [descr:dxGanttOptions.taskTooltipContentTemplate]
     */
    taskTooltipContentTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement,
          task: any
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxGanttOptions.taskTimeTooltipContentTemplate]
     */
    taskTimeTooltipContentTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement,
          item: DevExpress.ui.dxGantt.TimeTooltipTemplateData
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxGanttOptions.taskProgressTooltipContentTemplate]
     */
    taskProgressTooltipContentTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement,
          item: DevExpress.ui.dxGantt.ProgressTooltipTemplateData
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxGanttOptions.taskContentTemplate]
     */
    taskContentTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement,
          item: DevExpress.ui.dxGantt.TaskContentTemplateData
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxGanttOptions.rootValue]
     */
    rootValue?: any;
  }
  /**
   * [descr:dxGanttStripLine]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGanttToolbar {
    /**
     * [descr:dxGanttToolbar.items]
     */
    items?: Array<
      | dxGanttToolbarItem
      | 'separator'
      | 'undo'
      | 'redo'
      | 'expandAll'
      | 'collapseAll'
      | 'addTask'
      | 'deleteTask'
      | 'zoomIn'
      | 'zoomOut'
      | 'taskDetails'
      | 'fullScreen'
      | 'resourceManager'
    >;
  }
  /**
   * [descr:dxGanttToolbarItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * [descr:dxGanttToolbarItem.name]
     */
    name?:
      | 'separator'
      | 'undo'
      | 'redo'
      | 'expandAll'
      | 'collapseAll'
      | 'addTask'
      | 'deleteTask'
      | 'zoomIn'
      | 'zoomOut'
      | 'taskDetails'
      | 'fullScreen'
      | 'resourceManager'
      | string;
    /**
     * [descr:dxGanttToolbarItem.location]
     */
    location?: 'after' | 'before' | 'center';
  }
  /**
   * [descr:dxHtmlEditor]
   */
  export class dxHtmlEditor extends Editor<dxHtmlEditorOptions> {
    /**
     * [descr:dxHtmlEditor.blur()]
     */
    blur(): void;
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
    format(
      formatName:
        | 'background'
        | 'bold'
        | 'color'
        | 'font'
        | 'italic'
        | 'link'
        | 'size'
        | 'strike'
        | 'script'
        | 'underline'
        | 'blockquote'
        | 'header'
        | 'indent'
        | 'list'
        | 'align'
        | 'code-block'
        | string,
      formatValue: any
    ): void;
    /**
     * [descr:dxHtmlEditor.formatLine(index, length, formatName, formatValue)]
     */
    formatLine(
      index: number,
      length: number,
      formatName:
        | 'background'
        | 'bold'
        | 'color'
        | 'font'
        | 'italic'
        | 'link'
        | 'size'
        | 'strike'
        | 'script'
        | 'underline'
        | 'blockquote'
        | 'header'
        | 'indent'
        | 'list'
        | 'align'
        | 'code-block'
        | string,
      formatValue: any
    ): void;
    /**
     * [descr:dxHtmlEditor.formatLine(index, length, formats)]
     */
    formatLine(index: number, length: number, formats: any): void;
    /**
     * [descr:dxHtmlEditor.formatText(index, length, formatName, formatValue)]
     */
    formatText(
      index: number,
      length: number,
      formatName:
        | 'background'
        | 'bold'
        | 'color'
        | 'font'
        | 'italic'
        | 'link'
        | 'size'
        | 'strike'
        | 'script'
        | 'underline'
        | 'blockquote'
        | 'header'
        | 'indent'
        | 'list'
        | 'align'
        | 'code-block'
        | string,
      formatValue: any
    ): void;
    /**
     * [descr:dxHtmlEditor.formatText(index, length, formats)]
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * [descr:dxHtmlEditor.get(componentPath)]
     */
    get(componentPath: string): any;
    /**
     * [descr:dxHtmlEditor.getBounds(index, length)]
     */
    getBounds(index: number, length: number): any;
    /**
     * [descr:dxHtmlEditor.getFormat()]
     */
    getFormat(): any;
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
    getSelection(focus?: boolean | undefined): any;
    /**
     * [descr:dxHtmlEditor.getText(index, length)]
     */
    getText(index: number, length: number): string;
    /**
     * [descr:dxHtmlEditor.insertEmbed(index, type, config)]
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * [descr:dxHtmlEditor.insertText(index, text, formatName, formatValue)]
     */
    insertText(
      index: number,
      text: string,
      formatName:
        | 'background'
        | 'bold'
        | 'color'
        | 'font'
        | 'italic'
        | 'link'
        | 'size'
        | 'strike'
        | 'script'
        | 'underline'
        | 'blockquote'
        | 'header'
        | 'indent'
        | 'list'
        | 'align'
        | 'code-block'
        | string,
      formatValue: any
    ): void;
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
  module dxHtmlEditor {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxHtmlEditor>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxHtmlEditor>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxHtmlEditor>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxHtmlEditor>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxHtmlEditor>;
    export interface MentionTemplateData {
      readonly marker: string;
      readonly id?: string | number;
      readonly value?: any;
    }
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxHtmlEditor> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxHtmlEditorOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxHtmlEditor> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * [descr:dxHtmlEditorMediaResizing]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxHtmlEditorMention {
    /**
     * [descr:dxHtmlEditorMention.dataSource]
     */
    dataSource?:
      | Array<string>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxHtmlEditorMention.displayExpr]
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * [descr:dxHtmlEditorMention.itemTemplate]
     */
    itemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
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
    template?:
      | DevExpress.core.template
      | ((
          mentionData: DevExpress.ui.dxHtmlEditor.MentionTemplateData,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxHtmlEditorMention.valueExpr]
     */
    valueExpr?: string | Function;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
    /**
     * [descr:dxHtmlEditorOptions.customizeModules]
     */
    customizeModules?: (config: any) => void;
    /**
     * [descr:dxHtmlEditorOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxHtmlEditorOptions.mediaResizing]
     */
    mediaResizing?: dxHtmlEditorMediaResizing;
    /**
     * [descr:dxHtmlEditorOptions.mentions]
     */
    mentions?: Array<dxHtmlEditorMention>;
    /**
     * [descr:dxHtmlEditorOptions.name]
     */
    name?: string;
    /**
     * [descr:dxHtmlEditorOptions.onFocusIn]
     */
    onFocusIn?: (e: DevExpress.ui.dxHtmlEditor.FocusInEvent) => void;
    /**
     * [descr:dxHtmlEditorOptions.onFocusOut]
     */
    onFocusOut?: (e: DevExpress.ui.dxHtmlEditor.FocusOutEvent) => void;
    /**
     * [descr:dxHtmlEditorOptions.placeholder]
     */
    placeholder?: string;
    /**
     * [descr:dxHtmlEditorOptions.toolbar]
     */
    toolbar?: dxHtmlEditorToolbar;
    /**
     * [descr:dxHtmlEditorOptions.valueType]
     */
    valueType?: 'html' | 'markdown';
    /**
     * [descr:dxHtmlEditorOptions.variables]
     */
    variables?: dxHtmlEditorVariables;
    /**
     * [descr:dxHtmlEditorOptions.stylingMode]
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
  }
  /**
   * [descr:dxHtmlEditorToolbar]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxHtmlEditorToolbar {
    /**
     * [descr:dxHtmlEditorToolbar.container]
     */
    container?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxHtmlEditorToolbar.items]
     */
    items?: Array<
      | dxHtmlEditorToolbarItem
      | 'background'
      | 'bold'
      | 'color'
      | 'font'
      | 'italic'
      | 'link'
      | 'image'
      | 'size'
      | 'strike'
      | 'subscript'
      | 'superscript'
      | 'underline'
      | 'blockquote'
      | 'header'
      | 'increaseIndent'
      | 'decreaseIndent'
      | 'orderedList'
      | 'bulletList'
      | 'alignLeft'
      | 'alignCenter'
      | 'alignRight'
      | 'alignJustify'
      | 'codeBlock'
      | 'variable'
      | 'separator'
      | 'undo'
      | 'redo'
      | 'clear'
      | 'insertTable'
      | 'insertRowAbove'
      | 'insertRowBelow'
      | 'insertColumnLeft'
      | 'insertColumnRight'
      | 'deleteColumn'
      | 'deleteRow'
      | 'deleteTable'
    >;
    /**
     * [descr:dxHtmlEditorToolbar.multiline]
     */
    multiline?: boolean;
  }
  /**
   * [descr:dxHtmlEditorToolbarItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * [descr:dxHtmlEditorToolbarItem.name]
     */
    name?:
      | 'background'
      | 'bold'
      | 'color'
      | 'font'
      | 'italic'
      | 'link'
      | 'image'
      | 'size'
      | 'strike'
      | 'subscript'
      | 'superscript'
      | 'underline'
      | 'blockquote'
      | 'header'
      | 'increaseIndent'
      | 'decreaseIndent'
      | 'orderedList'
      | 'bulletList'
      | 'alignLeft'
      | 'alignCenter'
      | 'alignRight'
      | 'alignJustify'
      | 'codeBlock'
      | 'variable'
      | 'separator'
      | 'undo'
      | 'redo'
      | 'clear'
      | 'insertTable'
      | 'insertRowAbove'
      | 'insertRowBelow'
      | 'insertColumnLeft'
      | 'insertColumnRight'
      | 'deleteColumn'
      | 'deleteRow'
      | 'deleteTable'
      | string;
    /**
     * [descr:dxHtmlEditorToolbarItem.formatName]
     * @deprecated [depNote:dxHtmlEditorToolbarItem.formatName]
     */
    formatName?:
      | 'background'
      | 'bold'
      | 'color'
      | 'font'
      | 'italic'
      | 'link'
      | 'image'
      | 'size'
      | 'strike'
      | 'subscript'
      | 'superscript'
      | 'underline'
      | 'blockquote'
      | 'header'
      | 'increaseIndent'
      | 'decreaseIndent'
      | 'orderedList'
      | 'bulletList'
      | 'alignLeft'
      | 'alignCenter'
      | 'alignRight'
      | 'alignJustify'
      | 'codeBlock'
      | 'variable'
      | 'separator'
      | 'undo'
      | 'redo'
      | 'clear'
      | 'insertTable'
      | 'insertRowAbove'
      | 'insertRowBelow'
      | 'insertColumnLeft'
      | 'insertColumnRight'
      | 'deleteColumn'
      | 'deleteRow'
      | 'deleteTable'
      | string;
    /**
     * [descr:dxHtmlEditorToolbarItem.acceptedValues]
     */
    acceptedValues?: Array<string | number | boolean>;
    /**
     * [descr:dxHtmlEditorToolbarItem.formatValues]
     * @deprecated [depNote:dxHtmlEditorToolbarItem.formatValues]
     */
    formatValues?: Array<string | number | boolean>;
    /**
     * [descr:dxHtmlEditorToolbarItem.location]
     */
    location?: 'after' | 'before' | 'center';
  }
  /**
   * [descr:dxHtmlEditorVariables]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxHtmlEditorVariables {
    /**
     * [descr:dxHtmlEditorVariables.dataSource]
     */
    dataSource?:
      | string
      | Array<string>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxHtmlEditorVariables.escapeChar]
     */
    escapeChar?: string | Array<string>;
  }
  /**
   * [descr:dxList]
   */
  export class dxList extends CollectionWidget<dxListOptions> {
    /**
     * [descr:dxList.clientHeight()]
     */
    clientHeight(): number;
    /**
     * [descr:dxList.collapseGroup(groupIndex)]
     */
    collapseGroup(groupIndex: number): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxList.deleteItem(itemElement)]
     */
    deleteItem(itemElement: Element): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxList.deleteItem(itemIndex)]
     */
    deleteItem(itemIndex: number | any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxList.expandGroup(groupIndex)]
     */
    expandGroup(groupIndex: number): DevExpress.core.utils.DxPromise<void>;
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
    reorderItem(
      itemElement: Element,
      toItemElement: Element
    ): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxList.reorderItem(itemIndex, toItemIndex)]
     */
    reorderItem(
      itemIndex: number | any,
      toItemIndex: number | any
    ): DevExpress.core.utils.DxPromise<void>;
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
    updateDimensions(): DevExpress.core.utils.DxPromise<void>;
  }
  module dxList {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxList>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxList>;
    export type GroupRenderedEvent = DevExpress.events.EventInfo<dxList> & {
      readonly groupData?: any;
      readonly groupElement?: DevExpress.core.DxElement;
      readonly groupIndex?: number;
    };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxList>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxList> &
      ListItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxList> & ListItemInfo;
    export type ItemDeletedEvent = DevExpress.events.EventInfo<dxList> &
      ListItemInfo;
    export type ItemDeletingEvent = DevExpress.events.EventInfo<dxList> &
      ListItemInfo & {
        cancel?: boolean | PromiseLike<void>;
      };
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxList> &
      ListItemInfo;
    export type ItemRenderedEvent = DevExpress.events.NativeEventInfo<dxList> &
      DevExpress.events.ItemInfo;
    export type ItemReorderedEvent = DevExpress.events.EventInfo<dxList> &
      ListItemInfo & {
        readonly fromIndex: number;
        readonly toIndex: number;
      };
    export type ItemSwipeEvent = DevExpress.events.NativeEventInfo<dxList> &
      ListItemInfo & {
        readonly direction: string;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface ListItemInfo {
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly itemIndex: number | { group: number; item: number };
    }
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxList> &
      DevExpress.events.ChangedOptionInfo;
    export type PageLoadingEvent = DevExpress.events.EventInfo<dxList>;
    export type Properties = dxListOptions;
    export type PullRefreshEvent = DevExpress.events.EventInfo<dxList>;
    export type ScrollEvent = DevExpress.events.NativeEventInfo<dxList> &
      ScrollInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ScrollInfo {
      readonly scrollOffset?: any;
      readonly reachedLeft: boolean;
      readonly reachedRight: boolean;
      readonly reachedTop: boolean;
      readonly reachedBottom: boolean;
    }
    export type SelectAllValueChangedEvent =
      DevExpress.events.EventInfo<dxList> & {
        readonly value: boolean;
      };
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxList> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxListItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxListOptions
    extends CollectionWidgetOptions<dxList>,
      SearchBoxMixinOptions {
    /**
     * [descr:dxListOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxListOptions.allowItemDeleting]
     */
    allowItemDeleting?: boolean;
    /**
     * [descr:dxListOptions.bounceEnabled]
     */
    bounceEnabled?: boolean;
    /**
     * [descr:dxListOptions.collapsibleGroups]
     */
    collapsibleGroups?: boolean;
    /**
     * [descr:dxListOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxListItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxListOptions.displayExpr]
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * [descr:dxListOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxListOptions.groupTemplate]
     */
    groupTemplate?:
      | DevExpress.core.template
      | ((
          groupData: any,
          groupIndex: number,
          groupElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxListOptions.grouped]
     */
    grouped?: boolean;
    /**
     * [descr:dxListOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxListOptions.indicateLoading]
     */
    indicateLoading?: boolean;
    /**
     * [descr:dxListOptions.itemDeleteMode]
     */
    itemDeleteMode?:
      | 'context'
      | 'slideButton'
      | 'slideItem'
      | 'static'
      | 'swipe'
      | 'toggle';
    /**
     * [descr:dxListOptions.itemDragging]
     */
    itemDragging?: dxSortableOptions;
    /**
     * [descr:dxListOptions.items]
     */
    items?: Array<string | dxListItem | any>;
    /**
     * [descr:dxListOptions.menuItems]
     */
    menuItems?: Array<{
      /**
       * [descr:dxListOptions.menuItems.action]
       */
      action?: (itemElement: DevExpress.core.DxElement, itemData: any) => any;
      /**
       * [descr:dxListOptions.menuItems.text]
       */
      text?: string;
    }>;
    /**
     * [descr:dxListOptions.menuMode]
     */
    menuMode?: 'context' | 'slide';
    /**
     * [descr:dxListOptions.nextButtonText]
     */
    nextButtonText?: string;
    /**
     * [descr:dxListOptions.onGroupRendered]
     */
    onGroupRendered?: (e: DevExpress.ui.dxList.GroupRenderedEvent) => void;
    /**
     * [descr:dxListOptions.onItemClick]
     */
    onItemClick?: ((e: DevExpress.ui.dxList.ItemClickEvent) => void) | string;
    /**
     * [descr:dxListOptions.onItemContextMenu]
     */
    onItemContextMenu?: (e: DevExpress.ui.dxList.ItemContextMenuEvent) => void;
    /**
     * [descr:dxListOptions.onItemDeleted]
     */
    onItemDeleted?: (e: DevExpress.ui.dxList.ItemDeletedEvent) => void;
    /**
     * [descr:dxListOptions.onItemDeleting]
     */
    onItemDeleting?: (e: DevExpress.ui.dxList.ItemDeletingEvent) => void;
    /**
     * [descr:dxListOptions.onItemHold]
     */
    onItemHold?: (e: DevExpress.ui.dxList.ItemHoldEvent) => void;
    /**
     * [descr:dxListOptions.onItemReordered]
     */
    onItemReordered?: (e: DevExpress.ui.dxList.ItemReorderedEvent) => void;
    /**
     * [descr:dxListOptions.onItemSwipe]
     */
    onItemSwipe?: (e: DevExpress.ui.dxList.ItemSwipeEvent) => void;
    /**
     * [descr:dxListOptions.onPageLoading]
     */
    onPageLoading?: (e: DevExpress.ui.dxList.PageLoadingEvent) => void;
    /**
     * [descr:dxListOptions.onPullRefresh]
     */
    onPullRefresh?: (e: DevExpress.ui.dxList.PullRefreshEvent) => void;
    /**
     * [descr:dxListOptions.onScroll]
     */
    onScroll?: (e: DevExpress.ui.dxList.ScrollEvent) => void;
    /**
     * [descr:dxListOptions.onSelectAllValueChanged]
     */
    onSelectAllValueChanged?: (
      e: DevExpress.ui.dxList.SelectAllValueChangedEvent
    ) => void;
    /**
     * [descr:dxListOptions.pageLoadMode]
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * [descr:dxListOptions.pageLoadingText]
     */
    pageLoadingText?: string;
    /**
     * [descr:dxListOptions.pullRefreshEnabled]
     */
    pullRefreshEnabled?: boolean;
    /**
     * [descr:dxListOptions.pulledDownText]
     */
    pulledDownText?: string;
    /**
     * [descr:dxListOptions.pullingDownText]
     */
    pullingDownText?: string;
    /**
     * [descr:dxListOptions.refreshingText]
     */
    refreshingText?: string;
    /**
     * [descr:dxListOptions.repaintChangesOnly]
     */
    repaintChangesOnly?: boolean;
    /**
     * [descr:dxListOptions.scrollByContent]
     */
    scrollByContent?: boolean;
    /**
     * [descr:dxListOptions.scrollByThumb]
     */
    scrollByThumb?: boolean;
    /**
     * [descr:dxListOptions.scrollingEnabled]
     */
    scrollingEnabled?: boolean;
    /**
     * [descr:dxListOptions.selectAllMode]
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * [descr:dxListOptions.selectionMode]
     */
    selectionMode?: 'all' | 'multiple' | 'none' | 'single';
    /**
     * [descr:dxListOptions.showScrollbar]
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * [descr:dxListOptions.showSelectionControls]
     */
    showSelectionControls?: boolean;
    /**
     * [descr:dxListOptions.useNativeScrolling]
     */
    useNativeScrolling?: boolean;
  }
  /**
   * [descr:dxLoadIndicator]
   */
  export class dxLoadIndicator extends Widget<dxLoadIndicatorOptions> {}
  module dxLoadIndicator {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxLoadIndicator>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxLoadIndicator>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxLoadIndicator>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxLoadIndicator> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxLoadIndicatorOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLoadIndicatorOptions
    extends WidgetOptions<dxLoadIndicator> {
    /**
     * [descr:dxLoadIndicatorOptions.indicatorSrc]
     */
    indicatorSrc?: string;
  }
  /**
   * [descr:dxLoadPanel]
   */
  export class dxLoadPanel extends dxOverlay<dxLoadPanelOptions> {}
  module dxLoadPanel {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxLoadPanel>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxLoadPanel>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxLoadPanel>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxLoadPanel>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxLoadPanel>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxLoadPanel> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxLoadPanelOptions;
    export type ShowingEvent = DevExpress.events.EventInfo<dxLoadPanel>;
    export type ShownEvent = DevExpress.events.EventInfo<dxLoadPanel>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLoadPanelAnimation extends dxOverlayAnimation {
    /**
     * [descr:dxLoadPanelOptions.animation.hide]
     */
    hide?: animationConfig;
    /**
     * [descr:dxLoadPanelOptions.animation.show]
     */
    show?: animationConfig;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
    /**
     * [descr:dxLoadPanelOptions.animation]
     */
    animation?: dxLoadPanelAnimation;
    /**
     * [descr:dxLoadPanelOptions.container]
     */
    container?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxLoadPanelOptions.delay]
     */
    delay?: number;
    /**
     * [descr:dxLoadPanelOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxLoadPanelOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxLoadPanelOptions.indicatorSrc]
     */
    indicatorSrc?: string;
    /**
     * [descr:dxLoadPanelOptions.maxHeight]
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * [descr:dxLoadPanelOptions.maxWidth]
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * [descr:dxLoadPanelOptions.message]
     */
    message?: string;
    /**
     * [descr:dxLoadPanelOptions.position]
     */
    position?:
      | 'bottom'
      | 'center'
      | 'left'
      | 'left bottom'
      | 'left top'
      | 'right'
      | 'right bottom'
      | 'right top'
      | 'top'
      | positionConfig
      | Function;
    /**
     * [descr:dxLoadPanelOptions.shadingColor]
     */
    shadingColor?: string;
    /**
     * [descr:dxLoadPanelOptions.showIndicator]
     */
    showIndicator?: boolean;
    /**
     * [descr:dxLoadPanelOptions.showPane]
     */
    showPane?: boolean;
    /**
     * [descr:dxLoadPanelOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxLookup]
   */
  export class dxLookup extends dxDropDownList<dxLookupOptions> {}
  module dxLookup {
    export type ClosedEvent = DevExpress.events.EventInfo<dxLookup>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxLookup>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxLookup>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxLookup>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxLookup> &
      DevExpress.events.ItemInfo;
    export type OpenedEvent = DevExpress.events.EventInfo<dxLookup>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxLookup> &
      DevExpress.events.ChangedOptionInfo;
    export type PageLoadingEvent = DevExpress.events.EventInfo<dxLookup>;
    export type Properties = dxLookupOptions;
    export type PullRefreshEvent = DevExpress.events.EventInfo<dxLookup>;
    export type ScrollEvent = DevExpress.events.NativeEventInfo<dxLookup> &
      DevExpress.ui.dxList.ScrollInfo;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxLookup> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type TitleRenderedEvent = DevExpress.events.EventInfo<dxLookup> &
      DevExpress.ui.dxPopup.TitleRenderedInfo;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxLookup> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * [descr:dxLookupOptions.animation]
     * @deprecated [depNote:dxLookupOptions.animation]
     */
    animation?: {
      /**
       * [descr:dxLookupOptions.animation.hide]
       */
      hide?: animationConfig;
      /**
       * [descr:dxLookupOptions.animation.show]
       */
      show?: animationConfig;
    };
    /**
     * [descr:dxLookupOptions.applyButtonText]
     */
    applyButtonText?: string;
    /**
     * [descr:dxLookupOptions.applyValueMode]
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * [descr:dxLookupOptions.cancelButtonText]
     */
    cancelButtonText?: string;
    /**
     * [descr:dxLookupOptions.cleanSearchOnOpening]
     */
    cleanSearchOnOpening?: boolean;
    /**
     * [descr:dxLookupOptions.clearButtonText]
     */
    clearButtonText?: string;
    /**
     * [descr:dxLookupOptions.closeOnOutsideClick]
     * @deprecated [depNote:dxLookupOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxLookupOptions.fieldTemplate]
     */
    fieldTemplate?:
      | DevExpress.core.template
      | ((
          selectedItem: any,
          fieldElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxLookupOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxLookupOptions.fullScreen]
     * @deprecated [depNote:dxLookupOptions.fullScreen]
     */
    fullScreen?: boolean;
    /**
     * [descr:dxLookupOptions.groupTemplate]
     */
    groupTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxLookupOptions.grouped]
     */
    grouped?: boolean;
    /**
     * [descr:dxLookupOptions.nextButtonText]
     */
    nextButtonText?: string;
    /**
     * [descr:dxLookupOptions.onPageLoading]
     */
    onPageLoading?: (e: DevExpress.ui.dxLookup.PageLoadingEvent) => void;
    /**
     * [descr:dxLookupOptions.onPullRefresh]
     */
    onPullRefresh?: (e: DevExpress.ui.dxLookup.PullRefreshEvent) => void;
    /**
     * [descr:dxLookupOptions.onScroll]
     */
    onScroll?: (e: DevExpress.ui.dxLookup.ScrollEvent) => void;
    /**
     * [descr:dxLookupOptions.onTitleRendered]
     * @deprecated [depNote:dxLookupOptions.onTitleRendered]
     */
    onTitleRendered?: (e: DevExpress.ui.dxLookup.TitleRenderedEvent) => void;
    /**
     * [descr:dxLookupOptions.onValueChanged]
     */
    onValueChanged?: (e: DevExpress.ui.dxLookup.ValueChangedEvent) => void;
    /**
     * [descr:dxLookupOptions.pageLoadMode]
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * [descr:dxLookupOptions.pageLoadingText]
     */
    pageLoadingText?: string;
    /**
     * [descr:dxLookupOptions.placeholder]
     */
    placeholder?: string;
    /**
     * [descr:dxLookupOptions.popupHeight]
     * @deprecated [depNote:dxLookupOptions.popupHeight]
     */
    popupHeight?: number | string | (() => number | string);
    /**
     * [descr:dxLookupOptions.popupWidth]
     * @deprecated [depNote:dxLookupOptions.popupWidth]
     */
    popupWidth?: number | string | (() => number | string);
    /**
     * [descr:dxLookupOptions.position]
     * @deprecated [depNote:dxLookupOptions.position]
     */
    position?: positionConfig;
    /**
     * [descr:dxLookupOptions.pullRefreshEnabled]
     */
    pullRefreshEnabled?: boolean;
    /**
     * [descr:dxLookupOptions.pulledDownText]
     */
    pulledDownText?: string;
    /**
     * [descr:dxLookupOptions.pullingDownText]
     */
    pullingDownText?: string;
    /**
     * [descr:dxLookupOptions.refreshingText]
     */
    refreshingText?: string;
    /**
     * [descr:dxLookupOptions.searchEnabled]
     */
    searchEnabled?: boolean;
    /**
     * [descr:dxLookupOptions.searchPlaceholder]
     */
    searchPlaceholder?: string;
    /**
     * [descr:dxLookupOptions.shading]
     * @deprecated [depNote:dxLookupOptions.shading]
     */
    shading?: boolean;
    /**
     * [descr:dxLookupOptions.showCancelButton]
     */
    showCancelButton?: boolean;
    /**
     * [descr:dxLookupOptions.showClearButton]
     */
    showClearButton?: boolean;
    /**
     * [descr:dxLookupOptions.showPopupTitle]
     * @deprecated [depNote:dxLookupOptions.showPopupTitle]
     */
    showPopupTitle?: boolean;
    /**
     * [descr:dxLookupOptions.title]
     * @deprecated [depNote:dxLookupOptions.title]
     */
    title?: string;
    /**
     * [descr:dxLookupOptions.titleTemplate]
     * @deprecated [depNote:dxLookupOptions.titleTemplate]
     */
    titleTemplate?:
      | DevExpress.core.template
      | ((
          titleElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxLookupOptions.useNativeScrolling]
     */
    useNativeScrolling?: boolean;
    /**
     * [descr:dxLookupOptions.usePopover]
     */
    usePopover?: boolean;
    /**
     * [descr:dxLookupOptions.dropDownCentered]
     */
    dropDownCentered?: boolean;
    /**
     * [descr:dxLookupOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopover.Properties;
  }
  /**
   * [descr:dxMap]
   */
  export class dxMap extends Widget<dxMapOptions> {
    /**
     * [descr:dxMap.addMarker(markerOptions)]
     */
    addMarker(
      markerOptions: any | Array<any>
    ): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:dxMap.addRoute(routeOptions)]
     */
    addRoute(options: any | Array<any>): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:dxMap.removeMarker(marker)]
     */
    removeMarker(
      marker: any | number | Array<any>
    ): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxMap.removeRoute(route)]
     */
    removeRoute(
      route: any | number | Array<any>
    ): DevExpress.core.utils.DxPromise<void>;
  }
  module dxMap {
    export type ClickEvent = DevExpress.events.NativeEventInfo<dxMap>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxMap>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxMap>;
    export type MarkerAddedEvent = DevExpress.events.EventInfo<dxMap> & {
      readonly options: any;
      originalMarker: any;
    };
    export type MarkerRemovedEvent = DevExpress.events.EventInfo<dxMap> & {
      readonly options?: any;
    };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxMap> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxMapOptions;
    export type ReadyEvent = DevExpress.events.EventInfo<dxMap> & {
      originalMap: any;
    };
    export type RouteAddedEvent = DevExpress.events.EventInfo<dxMap> & {
      readonly options: any;
      originalRoute: any;
    };
    export type RouteRemovedEvent = DevExpress.events.EventInfo<dxMap> & {
      readonly options?: any;
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMapOptions extends WidgetOptions<dxMap> {
    /**
     * [descr:dxMapOptions.apiKey]
     */
    apiKey?:
      | string
      | {
          /**
           * [descr:dxMapOptions.apiKey.bing]
           */
          bing?: string;
          /**
           * [descr:dxMapOptions.apiKey.google]
           */
          google?: string;
          /**
           * [descr:dxMapOptions.apiKey.googleStatic]
           */
          googleStatic?: string;
        };
    /**
     * [descr:dxMapOptions.autoAdjust]
     */
    autoAdjust?: boolean;
    /**
     * [descr:dxMapOptions.center]
     */
    center?: any | string | Array<number>;
    /**
     * [descr:dxMapOptions.controls]
     */
    controls?: boolean;
    /**
     * [descr:dxMapOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxMapOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxMapOptions.key]
     * @deprecated [depNote:dxMapOptions.key]
     */
    key?:
      | string
      | {
          /**
           * [descr:dxMapOptions.key.bing]
           */
          bing?: string;
          /**
           * [descr:dxMapOptions.key.google]
           */
          google?: string;
          /**
           * [descr:dxMapOptions.key.googleStatic]
           */
          googleStatic?: string;
        };
    /**
     * [descr:dxMapOptions.markerIconSrc]
     */
    markerIconSrc?: string;
    /**
     * [descr:dxMapOptions.markers]
     */
    markers?: Array<{
      /**
       * [descr:dxMapOptions.markers.iconSrc]
       */
      iconSrc?: string;
      /**
       * [descr:dxMapOptions.markers.location]
       */
      location?: any | string | Array<number>;
      /**
       * [descr:dxMapOptions.markers.onClick]
       */
      onClick?: Function;
      /**
       * [descr:dxMapOptions.markers.tooltip]
       */
      tooltip?:
        | string
        | {
            /**
             * [descr:dxMapOptions.markers.tooltip.isShown]
             */
            isShown?: boolean;
            /**
             * [descr:dxMapOptions.markers.tooltip.text]
             */
            text?: string;
          };
    }>;
    /**
     * [descr:dxMapOptions.onClick]
     */
    onClick?: ((e: DevExpress.ui.dxMap.ClickEvent) => void) | string;
    /**
     * [descr:dxMapOptions.onMarkerAdded]
     */
    onMarkerAdded?: (e: DevExpress.ui.dxMap.MarkerAddedEvent) => void;
    /**
     * [descr:dxMapOptions.onMarkerRemoved]
     */
    onMarkerRemoved?: (e: DevExpress.ui.dxMap.MarkerRemovedEvent) => void;
    /**
     * [descr:dxMapOptions.onReady]
     */
    onReady?: (e: DevExpress.ui.dxMap.ReadyEvent) => void;
    /**
     * [descr:dxMapOptions.onRouteAdded]
     */
    onRouteAdded?: (e: DevExpress.ui.dxMap.RouteAddedEvent) => void;
    /**
     * [descr:dxMapOptions.onRouteRemoved]
     */
    onRouteRemoved?: (e: DevExpress.ui.dxMap.RouteRemovedEvent) => void;
    /**
     * [descr:dxMapOptions.provider]
     */
    provider?: 'bing' | 'google' | 'googleStatic';
    /**
     * [descr:dxMapOptions.routes]
     */
    routes?: Array<{
      /**
       * [descr:dxMapOptions.routes.color]
       */
      color?: string;
      /**
       * [descr:dxMapOptions.routes.locations]
       */
      locations?: Array<any>;
      /**
       * [descr:dxMapOptions.routes.mode]
       */
      mode?: 'driving' | 'walking';
      /**
       * [descr:dxMapOptions.routes.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxMapOptions.routes.weight]
       */
      weight?: number;
    }>;
    /**
     * [descr:dxMapOptions.type]
     */
    type?: 'hybrid' | 'roadmap' | 'satellite';
    /**
     * [descr:dxMapOptions.width]
     */
    width?: number | string | (() => number | string);
    /**
     * [descr:dxMapOptions.zoom]
     */
    zoom?: number;
  }
  /**
   * [descr:dxMenu]
   */
  export class dxMenu extends dxMenuBase<dxMenuOptions> {}
  module dxMenu {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxMenu>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxMenu>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxMenu>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxMenu> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxMenu> & DevExpress.events.ItemInfo;
    export type ItemRenderedEvent = DevExpress.events.NativeEventInfo<dxMenu> &
      DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxMenu> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxMenuOptions;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxMenu> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type SubmenuHiddenEvent = DevExpress.events.EventInfo<dxMenu> & {
      readonly rootItem?: DevExpress.core.DxElement;
    };
    export type SubmenuHidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxMenu> & {
        readonly rootItem?: DevExpress.core.DxElement;
      };
    export type SubmenuShowingEvent = DevExpress.events.EventInfo<dxMenu> & {
      readonly rootItem?: DevExpress.core.DxElement;
    };
    export type SubmenuShownEvent = DevExpress.events.EventInfo<dxMenu> & {
      readonly rootItem?: DevExpress.core.DxElement;
    };
  }
  /**
   * [descr:dxMenuBase]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxMenuBase<
    TProperties
  > extends HierarchicalCollectionWidget<TProperties> {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMenuBaseOptions<TComponent>
    extends HierarchicalCollectionWidgetOptions<TComponent> {
    /**
     * [descr:dxMenuBaseOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxMenuBaseOptions.animation]
     */
    animation?: {
      /**
       * [descr:dxMenuBaseOptions.animation.hide]
       */
      hide?: animationConfig;
      /**
       * [descr:dxMenuBaseOptions.animation.show]
       */
      show?: animationConfig;
    };
    /**
     * [descr:dxMenuBaseOptions.cssClass]
     */
    cssClass?: string;
    /**
     * [descr:dxMenuBaseOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxMenuBaseItem>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxMenuBaseOptions.items]
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * [descr:dxMenuBaseOptions.selectByClick]
     */
    selectByClick?: boolean;
    /**
     * [descr:dxMenuBaseOptions.selectionMode]
     */
    selectionMode?: 'none' | 'single';
    /**
     * [descr:dxMenuBaseOptions.showSubmenuMode]
     */
    showSubmenuMode?:
      | {
          /**
           * [descr:dxMenuBaseOptions.showSubmenuMode.delay]
           */
          delay?:
            | {
                /**
                 * [descr:dxMenuBaseOptions.showSubmenuMode.delay.hide]
                 */
                hide?: number;
                /**
                 * [descr:dxMenuBaseOptions.showSubmenuMode.delay.show]
                 */
                show?: number;
              }
            | number;
          /**
           * [descr:dxMenuBaseOptions.showSubmenuMode.name]
           */
          name?: 'onClick' | 'onHover';
        }
      | 'onClick'
      | 'onHover';
  }
  /**
   * [descr:dxMenuItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * [descr:dxMenuItem.items]
     */
    items?: Array<dxMenuItem>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
    /**
     * [descr:dxMenuOptions.adaptivityEnabled]
     */
    adaptivityEnabled?: boolean;
    /**
     * [descr:dxMenuOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxMenuItem>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxMenuOptions.hideSubmenuOnMouseLeave]
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * [descr:dxMenuOptions.items]
     */
    items?: Array<dxMenuItem>;
    /**
     * [descr:dxMenuOptions.onSubmenuHidden]
     */
    onSubmenuHidden?: (e: DevExpress.ui.dxMenu.SubmenuHiddenEvent) => void;
    /**
     * [descr:dxMenuOptions.onSubmenuHiding]
     */
    onSubmenuHiding?: (e: DevExpress.ui.dxMenu.SubmenuHidingEvent) => void;
    /**
     * [descr:dxMenuOptions.onSubmenuShowing]
     */
    onSubmenuShowing?: (e: DevExpress.ui.dxMenu.SubmenuShowingEvent) => void;
    /**
     * [descr:dxMenuOptions.onSubmenuShown]
     */
    onSubmenuShown?: (e: DevExpress.ui.dxMenu.SubmenuShownEvent) => void;
    /**
     * [descr:dxMenuOptions.orientation]
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * [descr:dxMenuOptions.showFirstSubmenuMode]
     */
    showFirstSubmenuMode?:
      | {
          /**
           * [descr:dxMenuOptions.showFirstSubmenuMode.delay]
           */
          delay?:
            | {
                /**
                 * [descr:dxMenuOptions.showFirstSubmenuMode.delay.hide]
                 */
                hide?: number;
                /**
                 * [descr:dxMenuOptions.showFirstSubmenuMode.delay.show]
                 */
                show?: number;
              }
            | number;
          /**
           * [descr:dxMenuOptions.showFirstSubmenuMode.name]
           */
          name?: 'onClick' | 'onHover';
        }
      | 'onClick'
      | 'onHover';
    /**
     * [descr:dxMenuOptions.submenuDirection]
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
  }
  /**
   * [descr:dxMultiView]
   */
  export class dxMultiView<
    TProperties = DevExpress.ui.dxMultiView.Properties
  > extends CollectionWidget<TProperties> {}
  module dxMultiView {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxMultiView>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxMultiView>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxMultiView>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxMultiView> &
        DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxMultiView> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxMultiView> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxMultiView> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxMultiView> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxMultiViewOptions<dxMultiView<Properties>>;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxMultiView> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxMultiViewItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMultiViewItem extends CollectionWidgetItem {}
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxMultiViewOptions<TComponent>
    extends CollectionWidgetOptions<TComponent> {
    /**
     * [descr:dxMultiViewOptions.animationEnabled]
     */
    animationEnabled?: boolean;
    /**
     * [descr:dxMultiViewOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxMultiViewItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxMultiViewOptions.deferRendering]
     */
    deferRendering?: boolean;
    /**
     * [descr:dxMultiViewOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxMultiViewOptions.items]
     */
    items?: Array<string | dxMultiViewItem | any>;
    /**
     * [descr:dxMultiViewOptions.loop]
     */
    loop?: boolean;
    /**
     * [descr:dxMultiViewOptions.selectedIndex]
     */
    selectedIndex?: number;
    /**
     * [descr:dxMultiViewOptions.swipeEnabled]
     */
    swipeEnabled?: boolean;
  }
  /**
   * [descr:dxNavBar]
   */
  export class dxNavBar extends dxTabs<dxNavBarOptions> {}
  module dxNavBar {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxNavBar>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxNavBar>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxNavBar>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxNavBar> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxNavBar> & DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxNavBar> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxNavBar> & DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxNavBar> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxNavBarOptions;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxNavBar> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxNavBarItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxNavBarItem extends dxTabsItem {
    /**
     * [descr:dxNavBarItem.badge]
     */
    badge?: string;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
    /**
     * [descr:dxNavBarOptions.scrollByContent]
     */
    scrollByContent?: boolean;
  }
  /**
   * [descr:dxNumberBox]
   */
  export class dxNumberBox extends dxTextEditor<dxNumberBoxOptions> {}
  module dxNumberBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxNumberBox>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxNumberBox>;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxNumberBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxNumberBox> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxNumberBox>;
    export type Properties = dxNumberBoxOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxNumberBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
    /**
     * [descr:dxNumberBoxOptions.buttons]
     */
    buttons?: Array<'clear' | 'spins' | dxTextEditorButton>;
    /**
     * [descr:dxNumberBoxOptions.format]
     */
    format?: format;
    /**
     * [descr:dxNumberBoxOptions.invalidValueMessage]
     */
    invalidValueMessage?: string;
    /**
     * [descr:dxNumberBoxOptions.max]
     */
    max?: number;
    /**
     * [descr:dxNumberBoxOptions.min]
     */
    min?: number;
    /**
     * [descr:dxNumberBoxOptions.mode]
     */
    mode?: 'number' | 'text' | 'tel';
    /**
     * [descr:dxNumberBoxOptions.showSpinButtons]
     */
    showSpinButtons?: boolean;
    /**
     * [descr:dxNumberBoxOptions.step]
     */
    step?: number;
    /**
     * [descr:dxNumberBoxOptions.useLargeSpinButtons]
     */
    useLargeSpinButtons?: boolean;
    /**
     * [descr:dxNumberBoxOptions.value]
     */
    value?: number;
  }
  /**
   * [descr:dxOverlay]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxOverlay<TProperties> extends Widget<TProperties> {
    /**
     * [descr:dxOverlay.content()]
     */
    content(): DevExpress.core.DxElement;
    /**
     * [descr:dxOverlay.hide()]
     */
    hide(): DevExpress.core.utils.DxPromise<boolean>;
    /**
     * [descr:dxOverlay.repaint()]
     */
    repaint(): void;
    /**
     * [descr:dxOverlay.show()]
     */
    show(): DevExpress.core.utils.DxPromise<boolean>;
    /**
     * [descr:dxOverlay.toggle(showing)]
     */
    toggle(showing: boolean): DevExpress.core.utils.DxPromise<boolean>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxOverlayAnimation {
    /**
     * [descr:dxOverlayOptions.animation.hide]
     */
    hide?: animationConfig;
    /**
     * [descr:dxOverlayOptions.animation.show]
     */
    show?: animationConfig;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxOverlayOptions<TComponent>
    extends WidgetOptions<TComponent> {
    /**
     * [descr:dxOverlayOptions.animation]
     */
    animation?: dxOverlayAnimation;
    /**
     * [descr:dxOverlayOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxOverlayOptions.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxOverlayOptions.deferRendering]
     */
    deferRendering?: boolean;
    /**
     * [descr:dxOverlayOptions.dragEnabled]
     */
    dragEnabled?: boolean;
    /**
     * [descr:dxOverlayOptions.elementAttr]
     * @deprecated [depNote:dxOverlayOptions.elementAttr]
     */
    elementAttr?: any;
    /**
     * [descr:dxOverlayOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.maxHeight]
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.maxWidth]
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.minHeight]
     */
    minHeight?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.minWidth]
     */
    minWidth?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.onHidden]
     */
    onHidden?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:dxOverlayOptions.onHiding]
     */
    onHiding?: (
      e: DevExpress.events.Cancelable & DevExpress.events.EventInfo<TComponent>
    ) => void;
    /**
     * [descr:dxOverlayOptions.onShowing]
     */
    onShowing?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:dxOverlayOptions.onShown]
     */
    onShown?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:dxOverlayOptions.position]
     */
    position?: any;
    /**
     * [descr:dxOverlayOptions.shading]
     */
    shading?: boolean;
    /**
     * [descr:dxOverlayOptions.shadingColor]
     */
    shadingColor?: string;
    /**
     * [descr:dxOverlayOptions.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxOverlayOptions.width]
     */
    width?: number | string | (() => number | string);
    /**
     * [descr:dxOverlayOptions.wrapperAttr]
     */
    wrapperAttr?: any;
  }
  /**
   * [descr:dxPivotGrid]
   */
  export class dxPivotGrid extends Widget<dxPivotGridOptions> {
    /**
     * [descr:dxPivotGrid.bindChart(chart, integrationOptions)]
     */
    bindChart(
      chart: string | DevExpress.core.DxElement | any,
      integrationOptions: {
        inverted?: boolean;
        dataFieldsDisplayMode?: string;
        putDataFieldsInto?: string;
        alternateDataFields?: boolean;
        processCell?: Function;
        customizeChart?: Function;
        customizeSeries?: Function;
      }
    ): Function & null;
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
  module dxPivotGrid {
    export type CellClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxPivotGrid> & {
        readonly area?: string;
        readonly cellElement?: DevExpress.core.DxElement;
        readonly cell?: dxPivotGridPivotGridCell;
        readonly rowIndex?: number;
        readonly columnIndex?: number;
        readonly columnFields?: Array<DevExpress.data.PivotGridDataSourceField>;
        readonly rowFields?: Array<DevExpress.data.PivotGridDataSourceField>;
        readonly dataFields?: Array<DevExpress.data.PivotGridDataSourceField>;
      };
    export type CellPreparedEvent = DevExpress.events.EventInfo<dxPivotGrid> & {
      readonly area?: string;
      readonly cellElement?: DevExpress.core.DxElement;
      readonly cell?: dxPivotGridPivotGridCell;
      readonly rowIndex?: number;
      readonly columnIndex?: number;
    };
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxPivotGrid>;
    export type ContextMenuPreparingEvent =
      DevExpress.events.EventInfo<dxPivotGrid> & {
        readonly area?: string;
        readonly cell?: dxPivotGridPivotGridCell;
        readonly cellElement?: DevExpress.core.DxElement;
        readonly columnIndex?: number;
        readonly rowIndex?: number;
        readonly dataFields?: Array<DevExpress.data.PivotGridDataSourceField>;
        readonly rowFields?: Array<DevExpress.data.PivotGridDataSourceField>;
        readonly columnFields?: Array<DevExpress.data.PivotGridDataSourceField>;
        readonly field?: DevExpress.data.PivotGridDataSourceField;
        items?: Array<any>;
      };
    export type DisposingEvent = DevExpress.events.EventInfo<dxPivotGrid>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxPivotGrid>;
    export type ExportingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxPivotGrid> & {
        fileName?: string;
      };
    export type FileSavingEvent = DevExpress.events.Cancelable & {
      readonly component: dxPivotGrid;
      readonly element: DevExpress.core.DxElement;
      readonly data?: Blob;
      readonly format?: string;
      fileName?: string;
    };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPivotGrid>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxPivotGrid> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxPivotGridOptions;
  }
  /**
   * [descr:dxPivotGridFieldChooser]
   */
  export class dxPivotGridFieldChooser extends Widget<dxPivotGridFieldChooserOptions> {
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
  module dxPivotGridFieldChooser {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxPivotGridFieldChooser>;
    export type ContextMenuPreparingEvent =
      DevExpress.events.EventInfo<dxPivotGridFieldChooser> & {
        readonly area?: string;
        readonly field?: DevExpress.data.PivotGridDataSourceField;
        readonly event?: DevExpress.events.DxEvent;
        items?: Array<any>;
      };
    export type DisposingEvent =
      DevExpress.events.EventInfo<dxPivotGridFieldChooser>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPivotGridFieldChooser>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxPivotGridFieldChooser> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxPivotGridFieldChooserOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPivotGridFieldChooserOptions
    extends WidgetOptions<dxPivotGridFieldChooser> {
    /**
     * [descr:dxPivotGridFieldChooserOptions.allowSearch]
     */
    allowSearch?: boolean;
    /**
     * [descr:dxPivotGridFieldChooserOptions.applyChangesMode]
     */
    applyChangesMode?: 'instantly' | 'onDemand';
    /**
     * [descr:dxPivotGridFieldChooserOptions.dataSource]
     */
    dataSource?: DevExpress.data.PivotGridDataSource;
    /**
     * [descr:dxPivotGridFieldChooserOptions.headerFilter]
     */
    headerFilter?: {
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.height]
       */
      height?: number;
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.searchTimeout]
       */
      searchTimeout?: number;
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.showRelevantValues]
       */
      showRelevantValues?: boolean;
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.texts]
       */
      texts?: {
        /**
         * [descr:dxPivotGridFieldChooserOptions.headerFilter.texts.cancel]
         */
        cancel?: string;
        /**
         * [descr:dxPivotGridFieldChooserOptions.headerFilter.texts.emptyValue]
         */
        emptyValue?: string;
        /**
         * [descr:dxPivotGridFieldChooserOptions.headerFilter.texts.ok]
         */
        ok?: string;
      };
      /**
       * [descr:dxPivotGridFieldChooserOptions.headerFilter.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPivotGridFieldChooserOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxPivotGridFieldChooserOptions.layout]
     */
    layout?: 0 | 1 | 2;
    /**
     * [descr:dxPivotGridFieldChooserOptions.onContextMenuPreparing]
     */
    onContextMenuPreparing?: (
      e: DevExpress.ui.dxPivotGridFieldChooser.ContextMenuPreparingEvent
    ) => void;
    /**
     * [descr:dxPivotGridFieldChooserOptions.searchTimeout]
     */
    searchTimeout?: number;
    /**
     * [descr:dxPivotGridFieldChooserOptions.state]
     */
    state?: any;
    /**
     * [descr:dxPivotGridFieldChooserOptions.texts]
     */
    texts?: {
      /**
       * [descr:dxPivotGridFieldChooserOptions.texts.allFields]
       */
      allFields?: string;
      /**
       * [descr:dxPivotGridFieldChooserOptions.texts.columnFields]
       */
      columnFields?: string;
      /**
       * [descr:dxPivotGridFieldChooserOptions.texts.dataFields]
       */
      dataFields?: string;
      /**
       * [descr:dxPivotGridFieldChooserOptions.texts.filterFields]
       */
      filterFields?: string;
      /**
       * [descr:dxPivotGridFieldChooserOptions.texts.rowFields]
       */
      rowFields?: string;
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
    /**
     * [descr:dxPivotGridOptions.allowExpandAll]
     */
    allowExpandAll?: boolean;
    /**
     * [descr:dxPivotGridOptions.allowFiltering]
     */
    allowFiltering?: boolean;
    /**
     * [descr:dxPivotGridOptions.allowSorting]
     */
    allowSorting?: boolean;
    /**
     * [descr:dxPivotGridOptions.allowSortingBySummary]
     */
    allowSortingBySummary?: boolean;
    /**
     * [descr:dxPivotGridOptions.dataFieldArea]
     */
    dataFieldArea?: 'column' | 'row';
    /**
     * [descr:dxPivotGridOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.PivotGridDataSource
      | DevExpress.data.PivotGridDataSourceOptions;
    /**
     * [descr:dxPivotGridOptions.encodeHtml]
     */
    encodeHtml?: boolean;
    /**
     * [descr:dxPivotGridOptions.export]
     */
    export?: {
      /**
       * [descr:dxPivotGridOptions.export.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxPivotGridOptions.export.fileName]
       * @deprecated [depNote:dxPivotGridOptions.export.fileName]
       */
      fileName?: string;
      /**
       * [descr:dxPivotGridOptions.export.ignoreExcelErrors]
       * @deprecated [depNote:dxPivotGridOptions.export.ignoreExcelErrors]
       */
      ignoreExcelErrors?: boolean;
      /**
       * [descr:dxPivotGridOptions.export.proxyUrl]
       * @deprecated [depNote:dxPivotGridOptions.export.proxyUrl]
       */
      proxyUrl?: string;
    };
    /**
     * [descr:dxPivotGridOptions.fieldChooser]
     */
    fieldChooser?: {
      /**
       * [descr:dxPivotGridOptions.fieldChooser.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.applyChangesMode]
       */
      applyChangesMode?: 'instantly' | 'onDemand';
      /**
       * [descr:dxPivotGridOptions.fieldChooser.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.height]
       */
      height?: number;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.layout]
       */
      layout?: 0 | 1 | 2;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.searchTimeout]
       */
      searchTimeout?: number;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.texts]
       */
      texts?: {
        /**
         * [descr:dxPivotGridOptions.fieldChooser.texts.allFields]
         */
        allFields?: string;
        /**
         * [descr:dxPivotGridOptions.fieldChooser.texts.columnFields]
         */
        columnFields?: string;
        /**
         * [descr:dxPivotGridOptions.fieldChooser.texts.dataFields]
         */
        dataFields?: string;
        /**
         * [descr:dxPivotGridOptions.fieldChooser.texts.filterFields]
         */
        filterFields?: string;
        /**
         * [descr:dxPivotGridOptions.fieldChooser.texts.rowFields]
         */
        rowFields?: string;
      };
      /**
       * [descr:dxPivotGridOptions.fieldChooser.title]
       */
      title?: string;
      /**
       * [descr:dxPivotGridOptions.fieldChooser.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPivotGridOptions.fieldPanel]
     */
    fieldPanel?: {
      /**
       * [descr:dxPivotGridOptions.fieldPanel.allowFieldDragging]
       */
      allowFieldDragging?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldPanel.showColumnFields]
       */
      showColumnFields?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldPanel.showDataFields]
       */
      showDataFields?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldPanel.showFilterFields]
       */
      showFilterFields?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldPanel.showRowFields]
       */
      showRowFields?: boolean;
      /**
       * [descr:dxPivotGridOptions.fieldPanel.texts]
       */
      texts?: {
        /**
         * [descr:dxPivotGridOptions.fieldPanel.texts.columnFieldArea]
         */
        columnFieldArea?: string;
        /**
         * [descr:dxPivotGridOptions.fieldPanel.texts.dataFieldArea]
         */
        dataFieldArea?: string;
        /**
         * [descr:dxPivotGridOptions.fieldPanel.texts.filterFieldArea]
         */
        filterFieldArea?: string;
        /**
         * [descr:dxPivotGridOptions.fieldPanel.texts.rowFieldArea]
         */
        rowFieldArea?: string;
      };
      /**
       * [descr:dxPivotGridOptions.fieldPanel.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxPivotGridOptions.headerFilter]
     */
    headerFilter?: {
      /**
       * [descr:dxPivotGridOptions.headerFilter.allowSearch]
       */
      allowSearch?: boolean;
      /**
       * [descr:dxPivotGridOptions.headerFilter.height]
       */
      height?: number;
      /**
       * [descr:dxPivotGridOptions.headerFilter.searchTimeout]
       */
      searchTimeout?: number;
      /**
       * [descr:dxPivotGridOptions.headerFilter.showRelevantValues]
       */
      showRelevantValues?: boolean;
      /**
       * [descr:dxPivotGridOptions.headerFilter.texts]
       */
      texts?: {
        /**
         * [descr:dxPivotGridOptions.headerFilter.texts.cancel]
         */
        cancel?: string;
        /**
         * [descr:dxPivotGridOptions.headerFilter.texts.emptyValue]
         */
        emptyValue?: string;
        /**
         * [descr:dxPivotGridOptions.headerFilter.texts.ok]
         */
        ok?: string;
      };
      /**
       * [descr:dxPivotGridOptions.headerFilter.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPivotGridOptions.hideEmptySummaryCells]
     */
    hideEmptySummaryCells?: boolean;
    /**
     * [descr:dxPivotGridOptions.loadPanel]
     */
    loadPanel?: {
      /**
       * [descr:dxPivotGridOptions.loadPanel.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxPivotGridOptions.loadPanel.height]
       */
      height?: number;
      /**
       * [descr:dxPivotGridOptions.loadPanel.indicatorSrc]
       */
      indicatorSrc?: string;
      /**
       * [descr:dxPivotGridOptions.loadPanel.shading]
       */
      shading?: boolean;
      /**
       * [descr:dxPivotGridOptions.loadPanel.shadingColor]
       */
      shadingColor?: string;
      /**
       * [descr:dxPivotGridOptions.loadPanel.showIndicator]
       */
      showIndicator?: boolean;
      /**
       * [descr:dxPivotGridOptions.loadPanel.showPane]
       */
      showPane?: boolean;
      /**
       * [descr:dxPivotGridOptions.loadPanel.text]
       */
      text?: string;
      /**
       * [descr:dxPivotGridOptions.loadPanel.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPivotGridOptions.onCellClick]
     */
    onCellClick?: (e: DevExpress.ui.dxPivotGrid.CellClickEvent) => void;
    /**
     * [descr:dxPivotGridOptions.onCellPrepared]
     */
    onCellPrepared?: (e: DevExpress.ui.dxPivotGrid.CellPreparedEvent) => void;
    /**
     * [descr:dxPivotGridOptions.onContextMenuPreparing]
     */
    onContextMenuPreparing?: (
      e: DevExpress.ui.dxPivotGrid.ContextMenuPreparingEvent
    ) => void;
    /**
     * [descr:dxPivotGridOptions.onExported]
     * @deprecated [depNote:dxPivotGridOptions.onExported]
     */
    onExported?: (e: DevExpress.ui.dxPivotGrid.ExportedEvent) => void;
    /**
     * [descr:dxPivotGridOptions.onExporting]
     */
    onExporting?: (e: DevExpress.ui.dxPivotGrid.ExportingEvent) => void;
    /**
     * [descr:dxPivotGridOptions.onFileSaving]
     * @deprecated [depNote:dxPivotGridOptions.onFileSaving]
     */
    onFileSaving?: (e: DevExpress.ui.dxPivotGrid.FileSavingEvent) => void;
    /**
     * [descr:dxPivotGridOptions.rowHeaderLayout]
     */
    rowHeaderLayout?: 'standard' | 'tree';
    /**
     * [descr:dxPivotGridOptions.scrolling]
     */
    scrolling?: {
      /**
       * [descr:dxPivotGridOptions.scrolling.mode]
       */
      mode?: 'standard' | 'virtual';
      /**
       * [descr:dxPivotGridOptions.scrolling.useNative]
       */
      useNative?: boolean | 'auto';
    };
    /**
     * [descr:dxPivotGridOptions.showBorders]
     */
    showBorders?: boolean;
    /**
     * [descr:dxPivotGridOptions.showColumnGrandTotals]
     */
    showColumnGrandTotals?: boolean;
    /**
     * [descr:dxPivotGridOptions.showColumnTotals]
     */
    showColumnTotals?: boolean;
    /**
     * [descr:dxPivotGridOptions.showRowGrandTotals]
     */
    showRowGrandTotals?: boolean;
    /**
     * [descr:dxPivotGridOptions.showRowTotals]
     */
    showRowTotals?: boolean;
    /**
     * [descr:dxPivotGridOptions.showTotalsPrior]
     */
    showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
    /**
     * [descr:dxPivotGridOptions.stateStoring]
     */
    stateStoring?: {
      /**
       * [descr:dxPivotGridOptions.stateStoring.customLoad]
       */
      customLoad?: () => PromiseLike<any>;
      /**
       * [descr:dxPivotGridOptions.stateStoring.customSave]
       */
      customSave?: (state: any) => any;
      /**
       * [descr:dxPivotGridOptions.stateStoring.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxPivotGridOptions.stateStoring.savingTimeout]
       */
      savingTimeout?: number;
      /**
       * [descr:dxPivotGridOptions.stateStoring.storageKey]
       */
      storageKey?: string;
      /**
       * [descr:dxPivotGridOptions.stateStoring.type]
       */
      type?: 'custom' | 'localStorage' | 'sessionStorage';
    };
    /**
     * [descr:dxPivotGridOptions.texts]
     */
    texts?: {
      /**
       * [descr:dxPivotGridOptions.texts.collapseAll]
       */
      collapseAll?: string;
      /**
       * [descr:dxPivotGridOptions.texts.dataNotAvailable]
       */
      dataNotAvailable?: string;
      /**
       * [descr:dxPivotGridOptions.texts.expandAll]
       */
      expandAll?: string;
      /**
       * [descr:dxPivotGridOptions.texts.exportToExcel]
       */
      exportToExcel?: string;
      /**
       * [descr:dxPivotGridOptions.texts.grandTotal]
       */
      grandTotal?: string;
      /**
       * [descr:dxPivotGridOptions.texts.noData]
       */
      noData?: string;
      /**
       * [descr:dxPivotGridOptions.texts.removeAllSorting]
       */
      removeAllSorting?: string;
      /**
       * [descr:dxPivotGridOptions.texts.showFieldChooser]
       */
      showFieldChooser?: string;
      /**
       * [descr:dxPivotGridOptions.texts.sortColumnBySummary]
       */
      sortColumnBySummary?: string;
      /**
       * [descr:dxPivotGridOptions.texts.sortRowBySummary]
       */
      sortRowBySummary?: string;
      /**
       * [descr:dxPivotGridOptions.texts.total]
       */
      total?: string;
    };
    /**
     * [descr:dxPivotGridOptions.wordWrapEnabled]
     */
    wordWrapEnabled?: boolean;
  }
  /**
   * [descr:dxPivotGridPivotGridCell]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPivotGridSummaryCell {
    /**
     * [descr:dxPivotGridSummaryCell.child(direction, fieldValue)]
     */
    child(
      direction: string,
      fieldValue: number | string
    ): dxPivotGridSummaryCell;
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
    isPostProcessed(
      field: DevExpress.data.PivotGridDataSourceField | string
    ): boolean;
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
    slice(
      field: DevExpress.data.PivotGridDataSourceField,
      value: number | string
    ): dxPivotGridSummaryCell;
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
    value(
      field: DevExpress.data.PivotGridDataSourceField | string,
      postProcessed: boolean
    ): any;
    /**
     * [descr:dxPivotGridSummaryCell.value(postProcessed)]
     */
    value(postProcessed: boolean): any;
  }
  /**
   * [descr:dxPopover]
   */
  export class dxPopover<
    TProperties = DevExpress.ui.dxPopover.Properties
  > extends dxPopup<TProperties> {
    show(): DevExpress.core.utils.DxPromise<boolean>;
    /**
     * [descr:dxPopover.show(target)]
     */
    show(
      target: string | DevExpress.core.UserDefinedElement
    ): DevExpress.core.utils.DxPromise<boolean>;
  }
  module dxPopover {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxPopover>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxPopover>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxPopover>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxPopover>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPopover>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxPopover> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxPopoverOptions<dxPopover<Properties>>;
    export type ShowingEvent = DevExpress.events.EventInfo<dxPopover>;
    export type ShownEvent = DevExpress.events.EventInfo<dxPopover>;
    export type TitleRenderedEvent = DevExpress.events.EventInfo<dxPopup> &
      DevExpress.ui.dxPopup.TitleRenderedInfo;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPopoverAnimation extends dxPopupAnimation {
    /**
     * [descr:dxPopoverOptions.animation.hide]
     */
    hide?: animationConfig;
    /**
     * [descr:dxPopoverOptions.animation.show]
     */
    show?: animationConfig;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPopoverOptions<TComponent>
    extends dxPopupOptions<TComponent> {
    /**
     * [descr:dxPopoverOptions.animation]
     */
    animation?: dxPopoverAnimation;
    /**
     * [descr:dxPopoverOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxPopoverOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxPopoverOptions.hideEvent]
     */
    hideEvent?:
      | {
          /**
           * [descr:dxPopoverOptions.hideEvent.delay]
           */
          delay?: number;
          /**
           * [descr:dxPopoverOptions.hideEvent.name]
           */
          name?: string;
        }
      | string;
    /**
     * [descr:dxPopoverOptions.position]
     */
    position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
    /**
     * [descr:dxPopoverOptions.shading]
     */
    shading?: boolean;
    /**
     * [descr:dxPopoverOptions.showEvent]
     */
    showEvent?:
      | {
          /**
           * [descr:dxPopoverOptions.showEvent.delay]
           */
          delay?: number;
          /**
           * [descr:dxPopoverOptions.showEvent.name]
           */
          name?: string;
        }
      | string;
    /**
     * [descr:dxPopoverOptions.showTitle]
     */
    showTitle?: boolean;
    /**
     * [descr:dxPopoverOptions.target]
     */
    target?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxPopoverOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxPopup]
   */
  export class dxPopup<
    TProperties = DevExpress.ui.dxPopup.Properties
  > extends dxOverlay<TProperties> {}
  module dxPopup {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxPopup>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxPopup>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxPopup>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxPopup>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPopup>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxPopup> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxPopupOptions<dxPopup<Properties>>;
    export type ResizeEndEvent = DevExpress.events.NativeEventInfo<dxPopup> &
      DevExpress.ui.dxResizable.ResizeInfo;
    export type ResizeEvent = DevExpress.events.NativeEventInfo<dxPopup> &
      DevExpress.ui.dxResizable.ResizeInfo;
    export type ResizeStartEvent = DevExpress.events.NativeEventInfo<dxPopup> &
      DevExpress.ui.dxResizable.ResizeInfo;
    export type ShowingEvent = DevExpress.events.EventInfo<dxPopup>;
    export type ShownEvent = DevExpress.events.EventInfo<dxPopup>;
    export type TitleRenderedEvent = DevExpress.events.EventInfo<dxPopup> &
      TitleRenderedInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface TitleRenderedInfo {
      readonly titleElement: DevExpress.core.DxElement;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPopupAnimation extends dxOverlayAnimation {
    /**
     * [descr:dxPopupOptions.animation.hide]
     */
    hide?: animationConfig;
    /**
     * [descr:dxPopupOptions.animation.show]
     */
    show?: animationConfig;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPopupOptions<TComponent>
    extends dxOverlayOptions<TComponent> {
    /**
     * [descr:dxPopupOptions.animation]
     */
    animation?: dxPopupAnimation;
    /**
     * [descr:dxPopupOptions.container]
     */
    container?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:dxPopupOptions.dragEnabled]
     */
    dragEnabled?: boolean;
    /**
     * [descr:dxPopupOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxPopupOptions.fullScreen]
     */
    fullScreen?: boolean;
    /**
     * [descr:dxPopupOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxPopupOptions.onResize]
     */
    onResize?: (e: DevExpress.ui.dxPopup.ResizeEvent) => void;
    /**
     * [descr:dxPopupOptions.onResizeEnd]
     */
    onResizeEnd?: (e: DevExpress.ui.dxPopup.ResizeEndEvent) => void;
    /**
     * [descr:dxPopupOptions.onResizeStart]
     */
    onResizeStart?: (e: DevExpress.ui.dxPopup.ResizeStartEvent) => void;
    /**
     * [descr:dxPopupOptions.onTitleRendered]
     */
    onTitleRendered?: (e: DevExpress.ui.dxPopup.TitleRenderedEvent) => void;
    /**
     * [descr:dxPopupOptions.position]
     */
    position?:
      | 'bottom'
      | 'center'
      | 'left'
      | 'left bottom'
      | 'left top'
      | 'right'
      | 'right bottom'
      | 'right top'
      | 'top'
      | positionConfig
      | Function;
    /**
     * [descr:dxPopupOptions.resizeEnabled]
     */
    resizeEnabled?: boolean;
    /**
     * [descr:dxPopupOptions.showCloseButton]
     */
    showCloseButton?: boolean;
    /**
     * [descr:dxPopupOptions.showTitle]
     */
    showTitle?: boolean;
    /**
     * [descr:dxPopupOptions.title]
     */
    title?: string;
    /**
     * [descr:dxPopupOptions.titleTemplate]
     */
    titleTemplate?:
      | DevExpress.core.template
      | ((
          titleElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxPopupOptions.toolbarItems]
     */
    toolbarItems?: Array<dxPopupToolbarItem>;
    /**
     * [descr:dxPopupOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPopupToolbarItem {
    /**
     * [descr:dxPopupOptions.toolbarItems.disabled]
     */
    disabled?: boolean;
    /**
     * [descr:dxPopupOptions.toolbarItems.html]
     */
    html?: string;
    /**
     * [descr:dxPopupOptions.toolbarItems.location]
     */
    location?: 'after' | 'before' | 'center';
    /**
     * [descr:dxPopupOptions.toolbarItems.options]
     */
    options?: any;
    /**
     * [descr:dxPopupOptions.toolbarItems.template]
     */
    template?: DevExpress.core.template;
    /**
     * [descr:dxPopupOptions.toolbarItems.text]
     */
    text?: string;
    /**
     * [descr:dxPopupOptions.toolbarItems.toolbar]
     */
    toolbar?: 'bottom' | 'top';
    /**
     * [descr:dxPopupOptions.toolbarItems.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxPopupOptions.toolbarItems.widget]
     */
    widget?:
      | 'dxAutocomplete'
      | 'dxButton'
      | 'dxCheckBox'
      | 'dxDateBox'
      | 'dxMenu'
      | 'dxSelectBox'
      | 'dxTabs'
      | 'dxTextBox'
      | 'dxButtonGroup'
      | 'dxDropDownButton';
  }
  /**
   * [descr:dxProgressBar]
   */
  export class dxProgressBar extends dxTrackBar<dxProgressBarOptions> {}
  module dxProgressBar {
    export type CompleteEvent =
      DevExpress.events.NativeEventInfo<dxProgressBar>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxProgressBar>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxProgressBar>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxProgressBar>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxProgressBar> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxProgressBarOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxProgressBar> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxProgressBarOptions
    extends dxTrackBarOptions<dxProgressBar> {
    /**
     * [descr:dxProgressBarOptions.onComplete]
     */
    onComplete?: (e: DevExpress.ui.dxProgressBar.CompleteEvent) => void;
    /**
     * [descr:dxProgressBarOptions.showStatus]
     */
    showStatus?: boolean;
    /**
     * [descr:dxProgressBarOptions.statusFormat]
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * [descr:dxProgressBarOptions.value]
     */
    value?: number;
  }
  /**
   * [descr:dxRadioGroup]
   */
  export class dxRadioGroup extends Editor<dxRadioGroupOptions> {
    getDataSource(): DevExpress.data.DataSource;
  }
  module dxRadioGroup {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxRadioGroup>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxRadioGroup>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxRadioGroup>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxRadioGroup> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxRadioGroupOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxRadioGroup> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxRadioGroupOptions
    extends EditorOptions<dxRadioGroup>,
      DataExpressionMixinOptions<dxRadioGroup> {
    /**
     * [descr:dxRadioGroupOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxRadioGroupOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxRadioGroupOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxRadioGroupOptions.layout]
     */
    layout?: 'horizontal' | 'vertical';
    /**
     * [descr:dxRadioGroupOptions.name]
     */
    name?: string;
    /**
     * [descr:dxRadioGroupOptions.value]
     */
    value?: any;
  }
  /**
   * [descr:dxRangeSlider]
   */
  export class dxRangeSlider extends dxTrackBar<dxRangeSliderOptions> {}
  module dxRangeSlider {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxRangeSlider>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxRangeSlider>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxRangeSlider>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxRangeSlider> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxRangeSliderOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxRangeSlider> &
        DevExpress.ui.Editor.ValueChangedInfo & {
          readonly start?: number;
          readonly end?: number;
          readonly value?: Array<number>;
        };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxRangeSliderOptions
    extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * [descr:dxRangeSliderOptions.end]
     */
    end?: number;
    /**
     * [descr:dxRangeSliderOptions.endName]
     */
    endName?: string;
    /**
     * [descr:dxRangeSliderOptions.onValueChanged]
     */
    onValueChanged?: (e: DevExpress.ui.dxRangeSlider.ValueChangedEvent) => void;
    /**
     * [descr:dxRangeSliderOptions.start]
     */
    start?: number;
    /**
     * [descr:dxRangeSliderOptions.startName]
     */
    startName?: string;
    /**
     * [descr:dxRangeSliderOptions.value]
     */
    value?: Array<number>;
  }
  /**
   * [descr:dxRecurrenceEditor]
   */
  export class dxRecurrenceEditor extends Editor<dxRecurrenceEditorOptions> {}
  module dxRecurrenceEditor {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type Properties = dxRecurrenceEditorOptions;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxRecurrenceEditorOptions
    extends EditorOptions<dxRecurrenceEditor> {
    /**
     * [descr:dxRecurrenceEditorOptions.value]
     */
    value?: string;
  }
  /**
   * [descr:dxResizable]
   */
  export class dxResizable extends DOMComponent<dxResizableOptions> {}
  module dxResizable {
    export type DisposingEvent = DevExpress.events.EventInfo<dxResizable>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxResizable>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxResizable> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxResizableOptions;
    export type ResizeEndEvent =
      DevExpress.events.NativeEventInfo<dxResizable> & ResizeInfo;
    export type ResizeEvent = DevExpress.events.NativeEventInfo<dxResizable> &
      ResizeInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ResizeInfo {
      readonly width: number;
      readonly height: number;
      handles: {
        readonly left: boolean;
        readonly top: boolean;
        readonly right: boolean;
        readonly bottom: boolean;
      };
    }
    export type ResizeStartEvent =
      DevExpress.events.NativeEventInfo<dxResizable> & ResizeInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * [descr:dxResizableOptions.handles]
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * [descr:dxResizableOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxResizableOptions.maxHeight]
     */
    maxHeight?: number;
    /**
     * [descr:dxResizableOptions.maxWidth]
     */
    maxWidth?: number;
    /**
     * [descr:dxResizableOptions.minHeight]
     */
    minHeight?: number;
    /**
     * [descr:dxResizableOptions.minWidth]
     */
    minWidth?: number;
    /**
     * [descr:dxResizableOptions.onResize]
     */
    onResize?: (e: DevExpress.ui.dxResizable.ResizeEvent) => void;
    /**
     * [descr:dxResizableOptions.onResizeEnd]
     */
    onResizeEnd?: (e: DevExpress.ui.dxResizable.ResizeEndEvent) => void;
    /**
     * [descr:dxResizableOptions.onResizeStart]
     */
    onResizeStart?: (e: DevExpress.ui.dxResizable.ResizeStartEvent) => void;
    /**
     * [descr:dxResizableOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxResponsiveBox]
   */
  export class dxResponsiveBox extends CollectionWidget<dxResponsiveBoxOptions> {}
  module dxResponsiveBox {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxResponsiveBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxResponsiveBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxResponsiveBox>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxResponsiveBox> &
        DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxResponsiveBox> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent =
      DevExpress.events.NativeEventInfo<dxResponsiveBox> &
        DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxResponsiveBox> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxResponsiveBox> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxResponsiveBoxOptions;
  }
  /**
   * [descr:dxResponsiveBoxItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * [descr:dxResponsiveBoxItem.location]
     */
    location?:
      | {
          /**
           * [descr:dxResponsiveBoxItem.location.col]
           */
          col?: number;
          /**
           * [descr:dxResponsiveBoxItem.location.colspan]
           */
          colspan?: number;
          /**
           * [descr:dxResponsiveBoxItem.location.row]
           */
          row?: number;
          /**
           * [descr:dxResponsiveBoxItem.location.rowspan]
           */
          rowspan?: number;
          /**
           * [descr:dxResponsiveBoxItem.location.screen]
           */
          screen?: string;
        }
      | Array<{
          col?: number;
          colspan?: number;
          row?: number;
          rowspan?: number;
          screen?: string;
        }>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxResponsiveBoxOptions
    extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * [descr:dxResponsiveBoxOptions.cols]
     */
    cols?: Array<{
      /**
       * [descr:dxResponsiveBoxOptions.cols.baseSize]
       */
      baseSize?: number | 'auto';
      /**
       * [descr:dxResponsiveBoxOptions.cols.ratio]
       */
      ratio?: number;
      /**
       * [descr:dxResponsiveBoxOptions.cols.screen]
       */
      screen?: string;
      /**
       * [descr:dxResponsiveBoxOptions.cols.shrink]
       */
      shrink?: number;
    }>;
    /**
     * [descr:dxResponsiveBoxOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxResponsiveBoxItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxResponsiveBoxOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxResponsiveBoxOptions.items]
     */
    items?: Array<string | dxResponsiveBoxItem | any>;
    /**
     * [descr:dxResponsiveBoxOptions.rows]
     */
    rows?: Array<{
      /**
       * [descr:dxResponsiveBoxOptions.rows.baseSize]
       */
      baseSize?: number | 'auto';
      /**
       * [descr:dxResponsiveBoxOptions.rows.ratio]
       */
      ratio?: number;
      /**
       * [descr:dxResponsiveBoxOptions.rows.screen]
       */
      screen?: string;
      /**
       * [descr:dxResponsiveBoxOptions.rows.shrink]
       */
      shrink?: number;
    }>;
    /**
     * [descr:dxResponsiveBoxOptions.screenByWidth]
     */
    screenByWidth?: Function;
    /**
     * [descr:dxResponsiveBoxOptions.singleColumnScreen]
     */
    singleColumnScreen?: string;
    /**
     * [descr:dxResponsiveBoxOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxScheduler]
   */
  export class dxScheduler extends Widget<dxSchedulerOptions> {
    /**
     * [descr:dxScheduler.addAppointment(appointment)]
     */
    addAppointment(appointment: any): void;
    /**
     * [descr:dxScheduler.deleteAppointment(appointment)]
     */
    deleteAppointment(appointment: any): void;
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
     * [descr:dxScheduler.scrollTo(date, group, allDay)]
     */
    scrollTo(date: Date, group?: object, allDay?: boolean): void;
    /**
     * [descr:dxScheduler.scrollToTime(hours, minutes, date)]
     * @deprecated [depNote:dxScheduler.scrollToTime(hours, minutes, date)]
     */
    scrollToTime(hours: number, minutes: number, date?: Date): void;
    /**
     * [descr:dxScheduler.showAppointmentPopup(appointmentData, createNewAppointment, currentAppointmentData)]
     */
    showAppointmentPopup(
      appointmentData?: any,
      createNewAppointment?: boolean,
      currentAppointmentData?: any
    ): void;
    /**
     * [descr:dxScheduler.showAppointmentTooltip(appointmentData, target, currentAppointmentData)]
     */
    showAppointmentTooltip(
      appointmentData: any,
      target: string | DevExpress.core.UserDefinedElement,
      currentAppointmentData?: any
    ): void;
    /**
     * [descr:dxScheduler.updateAppointment(target, appointment)]
     */
    updateAppointment(target: any, appointment: any): void;
  }
  module dxScheduler {
    export type AppointmentAddedEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData: any;
        readonly error?: Error;
      };
    export type AppointmentAddingEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData: any;
        cancel: boolean | PromiseLike<boolean>;
      };
    export type AppointmentClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxScheduler> &
      TargetedAppointmentInfo & {
        readonly appointmentElement: DevExpress.core.DxElement;
      };
    export type AppointmentCollectorTemplateData = {
      readonly appointmentCount: number;
      readonly isCompact: boolean;
    };
    export type AppointmentContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxScheduler> &
        TargetedAppointmentInfo & {
          readonly appointmentElement: DevExpress.core.DxElement;
        };
    export type AppointmentDblClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxScheduler> &
      TargetedAppointmentInfo & {
        readonly appointmentElement: DevExpress.core.DxElement;
      };
    export type AppointmentDeletedEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData: any;
        readonly error?: Error;
      };
    export type AppointmentDeletingEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData: any;
        cancel: boolean | PromiseLike<boolean>;
      };
    export type AppointmentDraggingAddEvent = AppointmentDraggingEvent & {
      readonly fromComponent?: dxSortable | dxDraggable;
      readonly toComponent?: dxSortable | dxDraggable;
      readonly toData?: any;
    };
    export type AppointmentDraggingEndEvent = DevExpress.events.Cancelable &
      AppointmentDraggingEvent & {
        readonly fromComponent?: dxSortable | dxDraggable;
        readonly toComponent?: dxSortable | dxDraggable;
        readonly toData?: any;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface AppointmentDraggingEvent {
      readonly component: dxScheduler;
      readonly event?: DevExpress.events.DxEvent;
      readonly itemData?: any;
      readonly itemElement?: DevExpress.core.DxElement;
      readonly fromData?: any;
    }
    export type AppointmentDraggingMoveEvent = DevExpress.events.Cancelable &
      AppointmentDraggingEvent & {
        readonly fromComponent?: dxSortable | dxDraggable;
        readonly toComponent?: dxSortable | dxDraggable;
        readonly toData?: any;
      };
    export type AppointmentDraggingRemoveEvent = AppointmentDraggingEvent & {
      readonly fromComponent?: dxSortable | dxDraggable;
      readonly toComponent?: dxSortable | dxDraggable;
    };
    export type AppointmentDraggingStartEvent = DevExpress.events.Cancelable &
      AppointmentDraggingEvent;
    export type AppointmentFormOpeningEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData?: any;
        readonly form: dxForm;
        readonly popup: dxPopup;
      };
    export type AppointmentRenderedEvent =
      DevExpress.events.EventInfo<dxScheduler> &
        TargetedAppointmentInfo & {
          readonly appointmentElement: DevExpress.core.DxElement;
        };
    export type AppointmentTemplateData = TargetedAppointmentInfo;
    export type AppointmentTooltipTemplateData = TargetedAppointmentInfo;
    export type AppointmentUpdatedEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly appointmentData: any;
        readonly error?: Error;
      };
    export type AppointmentUpdatingEvent =
      DevExpress.events.EventInfo<dxScheduler> & {
        readonly oldData: any;
        readonly newData: any;
        cancel?: boolean | PromiseLike<boolean>;
      };
    export type CellClickEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxScheduler> & {
        readonly cellData: any;
        readonly cellElement: DevExpress.core.DxElement;
      };
    export type CellContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxScheduler> & {
        readonly cellData: any;
        readonly cellElement: DevExpress.core.DxElement;
      };
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxScheduler>;
    export type DateNavigatorTextInfo = {
      readonly startDate: Date;
      readonly endDate: Date;
      readonly text: string;
    };
    export type DisposingEvent = DevExpress.events.EventInfo<dxScheduler>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxScheduler>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxScheduler> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSchedulerOptions;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface TargetedAppointmentInfo {
      readonly appointmentData: any;
      readonly targetedAppointmentData?: any;
    }
  }
  /**
   * [descr:dxSchedulerAppointment]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    endDate?: Date | string;
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
    startDate?: Date | string;
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
    /**
     * [descr:dxSchedulerOptions.adaptivityEnabled]
     */
    adaptivityEnabled?: boolean;
    /**
     * [descr:dxSchedulerOptions.allDayExpr]
     */
    allDayExpr?: string;
    /**
     * [descr:dxSchedulerOptions.appointmentCollectorTemplate]
     */
    appointmentCollectorTemplate?:
      | DevExpress.core.template
      | ((
          data: DevExpress.ui.dxScheduler.AppointmentCollectorTemplateData,
          collectorElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.appointmentDragging]
     */
    appointmentDragging?: {
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.autoScroll]
       */
      autoScroll?: boolean;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.data]
       */
      data?: any;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.group]
       */
      group?: string;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.onAdd]
       */
      onAdd?: (
        e: DevExpress.ui.dxScheduler.AppointmentDraggingAddEvent
      ) => void;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.onDragEnd]
       */
      onDragEnd?: (
        e: DevExpress.ui.dxScheduler.AppointmentDraggingEndEvent
      ) => void;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.onDragMove]
       */
      onDragMove?: (
        e: DevExpress.ui.dxScheduler.AppointmentDraggingMoveEvent
      ) => void;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.onDragStart]
       */
      onDragStart?: (
        e: DevExpress.ui.dxScheduler.AppointmentDraggingStartEvent
      ) => void;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.onRemove]
       */
      onRemove?: (
        e: DevExpress.ui.dxScheduler.AppointmentDraggingRemoveEvent
      ) => void;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.scrollSensitivity]
       */
      scrollSensitivity?: number;
      /**
       * [descr:dxSchedulerOptions.appointmentDragging.scrollSpeed]
       */
      scrollSpeed?: number;
    };
    /**
     * [descr:dxSchedulerOptions.appointmentTemplate]
     */
    appointmentTemplate?:
      | DevExpress.core.template
      | ((
          model: DevExpress.ui.dxScheduler.AppointmentTemplateData,
          itemIndex: number,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.appointmentTooltipTemplate]
     */
    appointmentTooltipTemplate?:
      | DevExpress.core.template
      | ((
          model: DevExpress.ui.dxScheduler.AppointmentTemplateData,
          itemIndex: number,
          contentElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.cellDuration]
     */
    cellDuration?: number;
    /**
     * [descr:dxSchedulerOptions.crossScrollingEnabled]
     */
    crossScrollingEnabled?: boolean;
    /**
     * [descr:dxSchedulerOptions.currentDate]
     */
    currentDate?: Date | number | string;
    /**
     * [descr:dxSchedulerOptions.currentView]
     */
    currentView?:
      | 'agenda'
      | 'day'
      | 'month'
      | 'timelineDay'
      | 'timelineMonth'
      | 'timelineWeek'
      | 'timelineWorkWeek'
      | 'week'
      | 'workWeek';
    /**
     * [descr:dxSchedulerOptions.customizeDateNavigatorText]
     */
    customizeDateNavigatorText?: (
      info: DevExpress.ui.dxScheduler.DateNavigatorTextInfo
    ) => string;
    /**
     * [descr:dxSchedulerOptions.dataCellTemplate]
     */
    dataCellTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxSchedulerAppointment>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxSchedulerOptions.dateCellTemplate]
     */
    dateCellTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.dateSerializationFormat]
     */
    dateSerializationFormat?: string;
    /**
     * [descr:dxSchedulerOptions.descriptionExpr]
     */
    descriptionExpr?: string;
    /**
     * [descr:dxSchedulerOptions.editing]
     */
    editing?:
      | boolean
      | {
          /**
           * [descr:dxSchedulerOptions.editing.allowAdding]
           */
          allowAdding?: boolean;
          /**
           * [descr:dxSchedulerOptions.editing.allowDeleting]
           */
          allowDeleting?: boolean;
          /**
           * [descr:dxSchedulerOptions.editing.allowDragging]
           */
          allowDragging?: boolean;
          /**
           * [descr:dxSchedulerOptions.editing.allowResizing]
           */
          allowResizing?: boolean;
          /**
           * [descr:dxSchedulerOptions.editing.allowTimeZoneEditing]
           */
          allowTimeZoneEditing?: boolean;
          /**
           * [descr:dxSchedulerOptions.editing.allowUpdating]
           */
          allowUpdating?: boolean;
        };
    /**
     * [descr:dxSchedulerOptions.endDateExpr]
     */
    endDateExpr?: string;
    /**
     * [descr:dxSchedulerOptions.endDateTimeZoneExpr]
     */
    endDateTimeZoneExpr?: string;
    /**
     * [descr:dxSchedulerOptions.endDayHour]
     */
    endDayHour?: number;
    /**
     * [descr:dxSchedulerOptions.firstDayOfWeek]
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * [descr:dxSchedulerOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxSchedulerOptions.groupByDate]
     */
    groupByDate?: boolean;
    /**
     * [descr:dxSchedulerOptions.groups]
     */
    groups?: Array<string>;
    /**
     * [descr:dxSchedulerOptions.indicatorUpdateInterval]
     */
    indicatorUpdateInterval?: number;
    /**
     * [descr:dxSchedulerOptions.max]
     */
    max?: Date | number | string;
    /**
     * [descr:dxSchedulerOptions.maxAppointmentsPerCell]
     */
    maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
    /**
     * [descr:dxSchedulerOptions.min]
     */
    min?: Date | number | string;
    /**
     * [descr:dxSchedulerOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:dxSchedulerOptions.onAppointmentAdded]
     */
    onAppointmentAdded?: (
      e: DevExpress.ui.dxScheduler.AppointmentAddedEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentAdding]
     */
    onAppointmentAdding?: (
      e: DevExpress.ui.dxScheduler.AppointmentAddingEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentClick]
     */
    onAppointmentClick?:
      | ((e: DevExpress.ui.dxScheduler.AppointmentClickEvent) => void)
      | string;
    /**
     * [descr:dxSchedulerOptions.onAppointmentContextMenu]
     */
    onAppointmentContextMenu?:
      | ((e: DevExpress.ui.dxScheduler.AppointmentContextMenuEvent) => void)
      | string;
    /**
     * [descr:dxSchedulerOptions.onAppointmentDblClick]
     */
    onAppointmentDblClick?:
      | ((e: DevExpress.ui.dxScheduler.AppointmentDblClickEvent) => void)
      | string;
    /**
     * [descr:dxSchedulerOptions.onAppointmentDeleted]
     */
    onAppointmentDeleted?: (
      e: DevExpress.ui.dxScheduler.AppointmentDeletedEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentDeleting]
     */
    onAppointmentDeleting?: (
      e: DevExpress.ui.dxScheduler.AppointmentDeletingEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentFormOpening]
     */
    onAppointmentFormOpening?: (
      e: DevExpress.ui.dxScheduler.AppointmentFormOpeningEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentRendered]
     */
    onAppointmentRendered?: (
      e: DevExpress.ui.dxScheduler.AppointmentRenderedEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentUpdated]
     */
    onAppointmentUpdated?: (
      e: DevExpress.ui.dxScheduler.AppointmentUpdatedEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onAppointmentUpdating]
     */
    onAppointmentUpdating?: (
      e: DevExpress.ui.dxScheduler.AppointmentUpdatingEvent
    ) => void;
    /**
     * [descr:dxSchedulerOptions.onCellClick]
     */
    onCellClick?:
      | ((e: DevExpress.ui.dxScheduler.CellClickEvent) => void)
      | string;
    /**
     * [descr:dxSchedulerOptions.onCellContextMenu]
     */
    onCellContextMenu?:
      | ((e: DevExpress.ui.dxScheduler.CellContextMenuEvent) => void)
      | string;
    /**
     * [descr:dxSchedulerOptions.recurrenceEditMode]
     */
    recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
    /**
     * [descr:dxSchedulerOptions.recurrenceExceptionExpr]
     */
    recurrenceExceptionExpr?: string;
    /**
     * [descr:dxSchedulerOptions.recurrenceRuleExpr]
     */
    recurrenceRuleExpr?: string;
    /**
     * [descr:dxSchedulerOptions.remoteFiltering]
     */
    remoteFiltering?: boolean;
    /**
     * [descr:dxSchedulerOptions.resourceCellTemplate]
     */
    resourceCellTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.resources]
     */
    resources?: Array<{
      /**
       * [descr:dxSchedulerOptions.resources.allowMultiple]
       */
      allowMultiple?: boolean;
      /**
       * [descr:dxSchedulerOptions.resources.colorExpr]
       */
      colorExpr?: string;
      /**
       * [descr:dxSchedulerOptions.resources.dataSource]
       */
      dataSource?:
        | string
        | Array<any>
        | DevExpress.data.Store
        | DevExpress.data.DataSource
        | DevExpress.data.DataSourceOptions;
      /**
       * [descr:dxSchedulerOptions.resources.displayExpr]
       */
      displayExpr?: string | ((resource: any) => string);
      /**
       * [descr:dxSchedulerOptions.resources.fieldExpr]
       */
      fieldExpr?: string;
      /**
       * [descr:dxSchedulerOptions.resources.label]
       */
      label?: string;
      /**
       * [descr:dxSchedulerOptions.resources.useColorAsDefault]
       */
      useColorAsDefault?: boolean;
      /**
       * [descr:dxSchedulerOptions.resources.valueExpr]
       */
      valueExpr?: string | Function;
    }>;
    /**
     * [descr:dxSchedulerOptions.scrolling]
     */
    scrolling?: dxSchedulerScrolling;
    /**
     * [descr:dxSchedulerOptions.selectedCellData]
     */
    selectedCellData?: Array<any>;
    /**
     * [descr:dxSchedulerOptions.shadeUntilCurrentTime]
     */
    shadeUntilCurrentTime?: boolean;
    /**
     * [descr:dxSchedulerOptions.showAllDayPanel]
     */
    showAllDayPanel?: boolean;
    /**
     * [descr:dxSchedulerOptions.showCurrentTimeIndicator]
     */
    showCurrentTimeIndicator?: boolean;
    /**
     * [descr:dxSchedulerOptions.startDateExpr]
     */
    startDateExpr?: string;
    /**
     * [descr:dxSchedulerOptions.startDateTimeZoneExpr]
     */
    startDateTimeZoneExpr?: string;
    /**
     * [descr:dxSchedulerOptions.startDayHour]
     */
    startDayHour?: number;
    /**
     * [descr:dxSchedulerOptions.textExpr]
     */
    textExpr?: string;
    /**
     * [descr:dxSchedulerOptions.timeCellTemplate]
     */
    timeCellTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSchedulerOptions.timeZone]
     */
    timeZone?: string;
    /**
     * [descr:dxSchedulerOptions.useDropDownViewSwitcher]
     */
    useDropDownViewSwitcher?: boolean;
    /**
     * [descr:dxSchedulerOptions.views]
     */
    views?: Array<
      | 'day'
      | 'week'
      | 'workWeek'
      | 'month'
      | 'timelineDay'
      | 'timelineWeek'
      | 'timelineWorkWeek'
      | 'timelineMonth'
      | 'agenda'
      | {
          /**
           * [descr:dxSchedulerOptions.views.agendaDuration]
           */
          agendaDuration?: number;
          /**
           * [descr:dxSchedulerOptions.views.appointmentCollectorTemplate]
           */
          appointmentCollectorTemplate?:
            | DevExpress.core.template
            | ((
                data: DevExpress.ui.dxScheduler.AppointmentCollectorTemplateData,
                collectorElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.appointmentTemplate]
           */
          appointmentTemplate?:
            | DevExpress.core.template
            | ((
                model: DevExpress.ui.dxScheduler.AppointmentTemplateData,
                itemIndex: number,
                contentElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.appointmentTooltipTemplate]
           */
          appointmentTooltipTemplate?:
            | DevExpress.core.template
            | ((
                model: DevExpress.ui.dxScheduler.AppointmentTooltipTemplateData,
                itemIndex: number,
                contentElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.cellDuration]
           */
          cellDuration?: number;
          /**
           * [descr:dxSchedulerOptions.views.dataCellTemplate]
           */
          dataCellTemplate?:
            | DevExpress.core.template
            | ((
                itemData: any,
                itemIndex: number,
                itemElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.dateCellTemplate]
           */
          dateCellTemplate?:
            | DevExpress.core.template
            | ((
                itemData: any,
                itemIndex: number,
                itemElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.endDayHour]
           */
          endDayHour?: number;
          /**
           * [descr:dxSchedulerOptions.views.firstDayOfWeek]
           */
          firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
          /**
           * [descr:dxSchedulerOptions.views.groupByDate]
           */
          groupByDate?: boolean;
          /**
           * [descr:dxSchedulerOptions.views.groupOrientation]
           */
          groupOrientation?: 'horizontal' | 'vertical';
          /**
           * [descr:dxSchedulerOptions.views.groups]
           */
          groups?: Array<string>;
          /**
           * [descr:dxSchedulerOptions.views.intervalCount]
           */
          intervalCount?: number;
          /**
           * [descr:dxSchedulerOptions.views.maxAppointmentsPerCell]
           */
          maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
          /**
           * [descr:dxSchedulerOptions.views.name]
           */
          name?: string;
          /**
           * [descr:dxSchedulerOptions.views.resourceCellTemplate]
           */
          resourceCellTemplate?:
            | DevExpress.core.template
            | ((
                itemData: any,
                itemIndex: number,
                itemElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.startDate]
           */
          startDate?: Date | number | string;
          /**
           * [descr:dxSchedulerOptions.views.startDayHour]
           */
          startDayHour?: number;
          /**
           * [descr:dxSchedulerOptions.views.timeCellTemplate]
           */
          timeCellTemplate?:
            | DevExpress.core.template
            | ((
                itemData: any,
                itemIndex: number,
                itemElement: DevExpress.core.DxElement
              ) => string | DevExpress.core.UserDefinedElement);
          /**
           * [descr:dxSchedulerOptions.views.type]
           */
          type?:
            | 'agenda'
            | 'day'
            | 'month'
            | 'timelineDay'
            | 'timelineMonth'
            | 'timelineWeek'
            | 'timelineWorkWeek'
            | 'week'
            | 'workWeek';
          /**
           * [descr:dxSchedulerOptions.views.scrolling]
           */
          scrolling?: dxSchedulerScrolling;
        }
    >;
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
   * [descr:dxScrollable]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxScrollable<
    TProperties = DevExpress.ui.dxScrollable.Properties
  > extends DOMComponent<TProperties> {
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
    content(): DevExpress.core.DxElement;
    /**
     * [descr:dxScrollable.scrollBy(distance)]
     */
    scrollBy(distance: number | any): void;
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
    scrollTo(targetLocation: number | any): void;
    /**
     * [descr:dxScrollable.scrollToElement(element)]
     */
    scrollToElement(element: DevExpress.core.UserDefinedElement): void;
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
    update(): DevExpress.core.utils.DxPromise<void>;
  }
  module dxScrollable {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    type Properties = dxScrollableOptions<dxScrollable<Properties>>;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ScrollEventInfo<T>
      extends DevExpress.events.NativeEventInfo<T> {
      readonly scrollOffset?: any;
      readonly reachedLeft?: boolean;
      readonly reachedRight?: boolean;
      readonly reachedTop?: boolean;
      readonly reachedBottom?: boolean;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxScrollableOptions<TComponent>
    extends DOMComponentOptions<TComponent> {
    /**
     * [descr:dxScrollableOptions.bounceEnabled]
     */
    bounceEnabled?: boolean;
    /**
     * [descr:dxScrollableOptions.direction]
     */
    direction?: 'both' | 'horizontal' | 'vertical';
    /**
     * [descr:dxScrollableOptions.disabled]
     */
    disabled?: boolean;
    /**
     * [descr:dxScrollableOptions.onScroll]
     */
    onScroll?: (
      e: DevExpress.ui.dxScrollable.ScrollEventInfo<TComponent>
    ) => void;
    /**
     * [descr:dxScrollableOptions.onUpdated]
     */
    onUpdated?: (
      e: DevExpress.ui.dxScrollable.ScrollEventInfo<TComponent>
    ) => void;
    /**
     * [descr:dxScrollableOptions.scrollByContent]
     */
    scrollByContent?: boolean;
    /**
     * [descr:dxScrollableOptions.scrollByThumb]
     */
    scrollByThumb?: boolean;
    /**
     * [descr:dxScrollableOptions.showScrollbar]
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * [descr:dxScrollableOptions.useNative]
     */
    useNative?: boolean;
  }
  /**
   * [descr:dxScrollView]
   */
  export class dxScrollView extends dxScrollable<dxScrollViewOptions> {
    /**
     * [descr:dxScrollView.refresh()]
     */
    refresh(): void;
    /**
     * [descr:dxScrollView.release(preventScrollBottom)]
     */
    release(
      preventScrollBottom: boolean
    ): DevExpress.core.utils.DxPromise<void>;
  }
  module dxScrollView {
    export type DisposingEvent = DevExpress.events.EventInfo<dxScrollView>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxScrollView>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxScrollView> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxScrollViewOptions;
    export type PullDownEvent = DevExpress.events.EventInfo<dxScrollView>;
    export type ReachBottomEvent = DevExpress.events.EventInfo<dxScrollView>;
    export type ScrollEvent =
      DevExpress.ui.dxScrollable.ScrollEventInfo<dxScrollView>;
    export type UpdatedEvent =
      DevExpress.ui.dxScrollable.ScrollEventInfo<dxScrollView>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxScrollViewOptions
    extends dxScrollableOptions<dxScrollView> {
    /**
     * [descr:dxScrollViewOptions.onPullDown]
     */
    onPullDown?: (e: DevExpress.ui.dxScrollView.PullDownEvent) => void;
    /**
     * [descr:dxScrollViewOptions.onReachBottom]
     */
    onReachBottom?: (e: DevExpress.ui.dxScrollView.ReachBottomEvent) => void;
    /**
     * [descr:dxScrollViewOptions.pulledDownText]
     */
    pulledDownText?: string;
    /**
     * [descr:dxScrollViewOptions.pullingDownText]
     */
    pullingDownText?: string;
    /**
     * [descr:dxScrollViewOptions.reachBottomText]
     */
    reachBottomText?: string;
    /**
     * [descr:dxScrollViewOptions.refreshingText]
     */
    refreshingText?: string;
  }
  /**
   * [descr:dxSelectBox]
   */
  export class dxSelectBox<
    TProperties = DevExpress.ui.dxSelectBox.Properties
  > extends dxDropDownList<TProperties> {}
  module dxSelectBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxSelectBox>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxSelectBox>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type CustomItemCreatingEvent =
      DevExpress.events.EventInfo<dxSelectBox> & CustomItemCreatingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface CustomItemCreatingInfo {
      readonly text?: string;
      customItem?: string | any | PromiseLike<any>;
    }
    export type CutEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxSelectBox>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSelectBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxSelectBox> &
        DevExpress.events.ItemInfo;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type OpenedEvent = DevExpress.events.EventInfo<dxSelectBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSelectBox> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxSelectBox>;
    export type Properties = dxSelectBoxOptions<dxSelectBox<Properties>>;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxSelectBox> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxSelectBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSelectBoxOptions<TComponent>
    extends dxDropDownListOptions<TComponent> {
    /**
     * [descr:dxSelectBoxOptions.acceptCustomValue]
     */
    acceptCustomValue?: boolean;
    /**
     * [descr:dxSelectBoxOptions.fieldTemplate]
     */
    fieldTemplate?:
      | DevExpress.core.template
      | ((
          selectedItem: any,
          fieldElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSelectBoxOptions.onCustomItemCreating]
     */
    onCustomItemCreating?: (
      e: DevExpress.ui.dxSelectBox.CustomItemCreatingEvent
    ) => void;
    /**
     * [descr:dxSelectBoxOptions.openOnFieldClick]
     */
    openOnFieldClick?: boolean;
    /**
     * [descr:dxSelectBoxOptions.placeholder]
     */
    placeholder?: string;
    /**
     * [descr:dxSelectBoxOptions.showDropDownButton]
     */
    showDropDownButton?: boolean;
    /**
     * [descr:dxSelectBoxOptions.showSelectionControls]
     */
    showSelectionControls?: boolean;
    /**
     * [descr:dxSelectBoxOptions.valueChangeEvent]
     */
    valueChangeEvent?: string;

    /**
     * [descr:dxSelectBoxOptions.dropDownOptions]
     */
    dropDownOptions?: DevExpress.ui.dxPopup.Properties;
  }
  /**
   * [descr:dxSlideOut]
   */
  export class dxSlideOut extends CollectionWidget<dxSlideOutOptions> {
    /**
     * [descr:dxSlideOut.hideMenu()]
     */
    hideMenu(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxSlideOut.showMenu()]
     */
    showMenu(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxSlideOut.toggleMenuVisibility(showing)]
     */
    toggleMenuVisibility(
      showing: boolean
    ): DevExpress.core.utils.DxPromise<void>;
  }
  module dxSlideOut {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxSlideOut>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxSlideOut>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSlideOut>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxSlideOut> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxSlideOut> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxSlideOut> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxSlideOut> &
        DevExpress.events.ItemInfo;
    export type MenuGroupRenderedEvent =
      DevExpress.events.EventInfo<dxSlideOut>;
    export type MenuItemRenderedEvent = DevExpress.events.EventInfo<dxSlideOut>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSlideOut> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSlideOutOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxSlideOut> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxSlideOutItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * [descr:dxSlideOutItem.menuTemplate]
     */
    menuTemplate?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSlideOutOptions
    extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * [descr:dxSlideOutOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxSlideOutOptions.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          container: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSlideOutOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxSlideOutItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxSlideOutOptions.items]
     */
    items?: Array<string | dxSlideOutItem | any>;
    /**
     * [descr:dxSlideOutOptions.menuGroupTemplate]
     */
    menuGroupTemplate?:
      | DevExpress.core.template
      | ((
          groupData: any,
          groupIndex: number,
          groupElement: any
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSlideOutOptions.menuGrouped]
     */
    menuGrouped?: boolean;
    /**
     * [descr:dxSlideOutOptions.menuItemTemplate]
     */
    menuItemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSlideOutOptions.menuPosition]
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * [descr:dxSlideOutOptions.menuVisible]
     */
    menuVisible?: boolean;
    /**
     * [descr:dxSlideOutOptions.onMenuGroupRendered]
     */
    onMenuGroupRendered?: (
      e: DevExpress.ui.dxSlideOut.MenuGroupRenderedEvent
    ) => void;
    /**
     * [descr:dxSlideOutOptions.onMenuItemRendered]
     */
    onMenuItemRendered?: (
      e: DevExpress.ui.dxSlideOut.MenuItemRenderedEvent
    ) => void;
    /**
     * [descr:dxSlideOutOptions.selectedIndex]
     */
    selectedIndex?: number;
    /**
     * [descr:dxSlideOutOptions.swipeEnabled]
     */
    swipeEnabled?: boolean;
  }
  /**
   * [descr:dxSlideOutView]
   */
  export class dxSlideOutView extends Widget<dxSlideOutViewOptions> {
    /**
     * [descr:dxSlideOutView.content()]
     */
    content(): DevExpress.core.DxElement;
    /**
     * [descr:dxSlideOutView.hideMenu()]
     */
    hideMenu(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxSlideOutView.menuContent()]
     */
    menuContent(): DevExpress.core.DxElement;
    /**
     * [descr:dxSlideOutView.showMenu()]
     */
    showMenu(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxSlideOutView.toggleMenuVisibility()]
     */
    toggleMenuVisibility(): DevExpress.core.utils.DxPromise<void>;
  }
  module dxSlideOutView {
    export type DisposingEvent = DevExpress.events.EventInfo<dxSlideOutView>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSlideOutView>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxSlideOutView> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSlideOutViewOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
    /**
     * [descr:dxSlideOutViewOptions.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((contentElement: DevExpress.core.DxElement) => any);
    /**
     * [descr:dxSlideOutViewOptions.menuPosition]
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * [descr:dxSlideOutViewOptions.menuTemplate]
     */
    menuTemplate?:
      | DevExpress.core.template
      | ((menuElement: DevExpress.core.DxElement) => any);
    /**
     * [descr:dxSlideOutViewOptions.menuVisible]
     */
    menuVisible?: boolean;
    /**
     * [descr:dxSlideOutViewOptions.swipeEnabled]
     */
    swipeEnabled?: boolean;
  }
  /**
   * [descr:dxSlider]
   */
  export class dxSlider extends dxTrackBar<dxSliderOptions> {}
  module dxSlider {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxSlider>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxSlider>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSlider>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSlider> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSliderOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxSlider> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * [descr:dxSliderBase]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSliderBaseOptions<TComponent>
    extends dxTrackBarOptions<TComponent> {
    /**
     * [descr:dxSliderBaseOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxSliderBaseOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxSliderBaseOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxSliderBaseOptions.keyStep]
     */
    keyStep?: number;
    /**
     * [descr:dxSliderBaseOptions.label]
     */
    label?: {
      /**
       * [descr:dxSliderBaseOptions.label.format]
       */
      format?: format;
      /**
       * [descr:dxSliderBaseOptions.label.position]
       */
      position?: 'bottom' | 'top';
      /**
       * [descr:dxSliderBaseOptions.label.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxSliderBaseOptions.name]
     */
    name?: string;
    /**
     * [descr:dxSliderBaseOptions.showRange]
     */
    showRange?: boolean;
    /**
     * [descr:dxSliderBaseOptions.step]
     */
    step?: number;
    /**
     * [descr:dxSliderBaseOptions.tooltip]
     */
    tooltip?: {
      /**
       * [descr:dxSliderBaseOptions.tooltip.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxSliderBaseOptions.tooltip.format]
       */
      format?: format;
      /**
       * [descr:dxSliderBaseOptions.tooltip.position]
       */
      position?: 'bottom' | 'top';
      /**
       * [descr:dxSliderBaseOptions.tooltip.showMode]
       */
      showMode?: 'always' | 'onHover';
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * [descr:dxSliderOptions.value]
     */
    value?: number;
  }
  /**
   * [descr:dxSortable]
   */
  export class dxSortable
    extends DOMComponent<dxSortableOptions>
    implements DraggableBase
  {
    /**
     * [descr:dxSortable.update()]
     */
    update(): void;
  }
  module dxSortable {
    export interface AddEvent {
      readonly component: dxSortable;
      readonly element: DevExpress.core.DxElement;
      readonly model?: any;
      readonly event: DevExpress.events.DxEvent;
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
      readonly toIndex: number;
      readonly fromComponent: dxSortable | dxDraggable;
      readonly toComponent: dxSortable | dxDraggable;
      readonly fromData?: any;
      readonly toData?: any;
      readonly dropInsideItem: boolean;
    }
    export type DisposingEvent = DevExpress.events.EventInfo<dxSortable>;
    export type DragChangeEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxSortable> & {
        readonly itemData?: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly fromIndex?: number;
        readonly toIndex?: number;
        readonly fromComponent?: dxSortable | dxDraggable;
        readonly toComponent?: dxSortable | dxDraggable;
        readonly fromData?: any;
        readonly toData?: any;
        readonly dropInsideItem?: boolean;
      };
    export type DragEndEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxSortable> & {
        readonly itemData?: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly fromIndex: number;
        readonly toIndex: number;
        readonly fromComponent: dxSortable | dxDraggable;
        readonly toComponent: dxSortable | dxDraggable;
        readonly fromData?: any;
        readonly toData?: any;
        readonly dropInsideItem: boolean;
      };
    export type DragMoveEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxSortable> & {
        readonly itemData?: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly fromIndex: number;
        readonly toIndex: number;
        readonly fromComponent: dxSortable | dxDraggable;
        readonly toComponent: dxSortable | dxDraggable;
        readonly fromData?: any;
        readonly toData?: any;
        readonly dropInsideItem: boolean;
      };
    export type DragStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxSortable> & {
        itemData?: any;
        readonly itemElement: DevExpress.core.DxElement;
        readonly fromIndex: number;
        readonly fromData?: any;
      };
    export interface DragTemplateData {
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
    }
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSortable>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSortable> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSortableOptions;
    export type RemoveEvent = DevExpress.events.NativeEventInfo<dxSortable> & {
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
      readonly toIndex: number;
      readonly fromComponent: dxSortable | dxDraggable;
      readonly toComponent: dxSortable | dxDraggable;
      readonly fromData?: any;
      readonly toData?: any;
    };
    export type ReorderEvent = DevExpress.events.NativeEventInfo<dxSortable> & {
      readonly itemData?: any;
      readonly itemElement: DevExpress.core.DxElement;
      readonly fromIndex: number;
      readonly toIndex: number;
      readonly fromComponent: dxSortable | dxDraggable;
      readonly toComponent: dxSortable | dxDraggable;
      readonly fromData?: any;
      readonly toData?: any;
      readonly dropInsideItem: boolean;
      promise?: PromiseLike<void>;
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
    /**
     * [descr:dxSortableOptions.allowDropInsideItem]
     */
    allowDropInsideItem?: boolean;
    /**
     * [descr:dxSortableOptions.allowReordering]
     */
    allowReordering?: boolean;
    /**
     * [descr:dxSortableOptions.dragTemplate]
     */
    dragTemplate?:
      | DevExpress.core.template
      | ((
          dragInfo: DevExpress.ui.dxSortable.DragTemplateData,
          containerElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSortableOptions.dropFeedbackMode]
     */
    dropFeedbackMode?: 'push' | 'indicate';
    /**
     * [descr:dxSortableOptions.filter]
     */
    filter?: string;
    /**
     * [descr:dxSortableOptions.itemOrientation]
     */
    itemOrientation?: 'horizontal' | 'vertical';
    /**
     * [descr:dxSortableOptions.moveItemOnDrop]
     */
    moveItemOnDrop?: boolean;
    /**
     * [descr:dxSortableOptions.onAdd]
     */
    onAdd?: (e: DevExpress.ui.dxSortable.AddEvent) => void;
    /**
     * [descr:dxSortableOptions.onDragChange]
     */
    onDragChange?: (e: DevExpress.ui.dxSortable.DragChangeEvent) => void;
    /**
     * [descr:dxSortableOptions.onDragEnd]
     */
    onDragEnd?: (e: DevExpress.ui.dxSortable.DragEndEvent) => void;
    /**
     * [descr:dxSortableOptions.onDragMove]
     */
    onDragMove?: (e: DevExpress.ui.dxSortable.DragMoveEvent) => void;
    /**
     * [descr:dxSortableOptions.onDragStart]
     */
    onDragStart?: (e: DevExpress.ui.dxSortable.DragStartEvent) => void;
    /**
     * [descr:dxSortableOptions.onRemove]
     */
    onRemove?: (e: DevExpress.ui.dxSortable.RemoveEvent) => void;
    /**
     * [descr:dxSortableOptions.onReorder]
     */
    onReorder?: (e: DevExpress.ui.dxSortable.ReorderEvent) => void;
  }
  /**
   * [descr:dxSpeedDialAction]
   */
  export class dxSpeedDialAction extends Widget<dxSpeedDialActionOptions> {}
  module dxSpeedDialAction {
    export type ClickEvent =
      DevExpress.events.NativeEventInfo<dxSpeedDialAction> & {
        actionElement?: DevExpress.core.DxElement;
      };
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxSpeedDialAction> & {
        actionElement?: DevExpress.core.DxElement;
      };
    export type DisposingEvent = DevExpress.events.EventInfo<dxSpeedDialAction>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSpeedDialAction>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxSpeedDialAction> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSpeedDialActionOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSpeedDialActionOptions
    extends WidgetOptions<dxSpeedDialAction> {
    /**
     * [descr:dxSpeedDialActionOptions.icon]
     */
    icon?: string;
    /**
     * [descr:dxSpeedDialActionOptions.index]
     */
    index?: number;
    /**
     * [descr:dxSpeedDialActionOptions.label]
     */
    label?: string;
    /**
     * [descr:dxSpeedDialActionOptions.onClick]
     */
    onClick?: (e: DevExpress.ui.dxSpeedDialAction.ClickEvent) => void;
    /**
     * [descr:dxSpeedDialActionOptions.onContentReady]
     */
    onContentReady?: (
      e: DevExpress.ui.dxSpeedDialAction.ContentReadyEvent
    ) => void;
    /**
     * [descr:dxSpeedDialActionOptions.visible]
     */
    visible?: boolean;
  }
  /**
   * [descr:dxSwitch]
   */
  export class dxSwitch extends Editor<dxSwitchOptions> {}
  module dxSwitch {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxSwitch>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxSwitch>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSwitch>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSwitch> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSwitchOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxSwitch> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
    /**
     * [descr:dxSwitchOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxSwitchOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxSwitchOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxSwitchOptions.name]
     */
    name?: string;
    /**
     * [descr:dxSwitchOptions.switchedOffText]
     */
    switchedOffText?: string;
    /**
     * [descr:dxSwitchOptions.switchedOnText]
     */
    switchedOnText?: string;
    /**
     * [descr:dxSwitchOptions.value]
     */
    value?: boolean;
  }
  /**
   * [descr:dxTabPanel]
   */
  export class dxTabPanel extends dxMultiView<dxTabPanelOptions> {}
  module dxTabPanel {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTabPanel>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTabPanel>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTabPanel>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxTabPanel> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxTabPanel> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxTabPanel> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxTabPanel> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTabPanel> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTabPanelOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxTabPanel> &
        DevExpress.ui.CollectionWidget.SelectionChangedInfo;
    export type TitleClickEvent =
      DevExpress.events.NativeEventInfo<dxTabPanel> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
      };
    export type TitleHoldEvent =
      DevExpress.events.NativeEventInfo<dxTabPanel> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
      };
    export type TitleRenderedEvent = DevExpress.events.EventInfo<dxTabPanel> & {
      readonly itemData?: any;
      readonly itemElement?: DevExpress.core.DxElement;
    };
  }
  /**
   * [descr:dxTabPanelItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    tabTemplate?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxTabPanelItem.title]
     */
    title?: string;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
    /**
     * [descr:dxTabPanelOptions.animationEnabled]
     */
    animationEnabled?: boolean;
    /**
     * [descr:dxTabPanelOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxTabPanelItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxTabPanelOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxTabPanelOptions.itemTitleTemplate]
     */
    itemTitleTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxTabPanelOptions.items]
     */
    items?: Array<string | dxTabPanelItem | any>;
    /**
     * [descr:dxTabPanelOptions.onTitleClick]
     */
    onTitleClick?:
      | ((e: DevExpress.ui.dxTabPanel.TitleClickEvent) => void)
      | string;
    /**
     * [descr:dxTabPanelOptions.onTitleHold]
     */
    onTitleHold?: (e: DevExpress.ui.dxTabPanel.TitleHoldEvent) => void;
    /**
     * [descr:dxTabPanelOptions.onTitleRendered]
     */
    onTitleRendered?: (e: DevExpress.ui.dxTabPanel.TitleRenderedEvent) => void;
    /**
     * [descr:dxTabPanelOptions.repaintChangesOnly]
     */
    repaintChangesOnly?: boolean;
    /**
     * [descr:dxTabPanelOptions.scrollByContent]
     */
    scrollByContent?: boolean;
    /**
     * [descr:dxTabPanelOptions.scrollingEnabled]
     */
    scrollingEnabled?: boolean;
    /**
     * [descr:dxTabPanelOptions.showNavButtons]
     */
    showNavButtons?: boolean;
    /**
     * [descr:dxTabPanelOptions.swipeEnabled]
     */
    swipeEnabled?: boolean;
  }
  /**
   * [descr:dxTabs]
   */
  export class dxTabs<
    TProperties = DevExpress.ui.dxTabs.Properties
  > extends CollectionWidget<TProperties> {}
  module dxTabs {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTabs>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTabs>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTabs>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxTabs> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxTabs> & DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxTabs> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent = DevExpress.events.NativeEventInfo<dxTabs> &
      DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTabs> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTabsOptions<dxTabs<Properties>>;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxTabs> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo;
  }
  /**
   * [descr:dxTabsItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTabsOptions<TComponent>
    extends CollectionWidgetOptions<TComponent> {
    /**
     * [descr:dxTabsOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxTabsItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxTabsOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxTabsOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxTabsOptions.items]
     */
    items?: Array<string | dxTabsItem | any>;
    /**
     * [descr:dxTabsOptions.repaintChangesOnly]
     */
    repaintChangesOnly?: boolean;
    /**
     * [descr:dxTabsOptions.scrollByContent]
     */
    scrollByContent?: boolean;
    /**
     * [descr:dxTabsOptions.scrollingEnabled]
     */
    scrollingEnabled?: boolean;
    /**
     * [descr:dxTabsOptions.selectedItems]
     */
    selectedItems?: Array<string | number | any>;
    /**
     * [descr:dxTabsOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxTabsOptions.showNavButtons]
     */
    showNavButtons?: boolean;
  }
  /**
   * [descr:dxTagBox]
   */
  export class dxTagBox extends dxSelectBox<dxTagBoxOptions> {}
  module dxTagBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type ClosedEvent = DevExpress.events.EventInfo<dxTagBox>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTagBox>;
    export type CustomItemCreatingEvent =
      DevExpress.events.EventInfo<dxTagBox> &
        DevExpress.ui.dxSelectBox.CustomItemCreatingInfo;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTagBox>;
    export type DropDownButtonTemplateData =
      DevExpress.ui.dxDropDownEditor.DropDownButtonTemplateDataModel;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTagBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxTagBox> &
      DevExpress.events.ItemInfo;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxTagBox>;
    export type MultiTagPreparingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTagBox> & {
        readonly multiTagElement: DevExpress.core.DxElement;
        readonly selectedItems?: Array<string | number | any>;
        text?: string;
      };
    export type OpenedEvent = DevExpress.events.EventInfo<dxTagBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTagBox> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTagBoxOptions;
    export type SelectAllValueChangedEvent =
      DevExpress.events.EventInfo<dxTagBox> & {
        readonly value: boolean;
      };
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxTagBox> &
      DevExpress.ui.CollectionWidget.SelectionChangedInfo<
        string | number | any
      >;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxTagBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
    /**
     * [descr:dxTagBoxOptions.applyValueMode]
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * [descr:dxTagBoxOptions.hideSelectedItems]
     */
    hideSelectedItems?: boolean;
    /**
     * [descr:dxTagBoxOptions.maxDisplayedTags]
     */
    maxDisplayedTags?: number;
    /**
     * [descr:dxTagBoxOptions.multiline]
     */
    multiline?: boolean;
    /**
     * [descr:dxTagBoxOptions.onMultiTagPreparing]
     */
    onMultiTagPreparing?: (
      e: DevExpress.ui.dxTagBox.MultiTagPreparingEvent
    ) => void;
    /**
     * [descr:dxTagBoxOptions.onSelectAllValueChanged]
     */
    onSelectAllValueChanged?: (
      e: DevExpress.ui.dxTagBox.SelectAllValueChangedEvent
    ) => void;
    /**
     * [descr:dxTagBoxOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxTagBox.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxTagBoxOptions.selectAllMode]
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * [descr:dxTagBoxOptions.selectedItems]
     */
    selectedItems?: Array<string | number | any>;
    /**
     * [descr:dxTagBoxOptions.showDropDownButton]
     */
    showDropDownButton?: boolean;
    /**
     * [descr:dxTagBoxOptions.maxFilterQueryLength]
     */
    maxFilterQueryLength?: number;
    /**
     * [descr:dxTagBoxOptions.showMultiTagOnly]
     */
    showMultiTagOnly?: boolean;
    /**
     * [descr:dxTagBoxOptions.tagTemplate]
     */
    tagTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxTagBoxOptions.value]
     */
    value?: Array<string | number | any>;
  }
  /**
   * [descr:dxTextArea]
   */
  export class dxTextArea extends dxTextBox<dxTextAreaOptions> {}
  module dxTextArea {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTextArea>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTextArea>;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTextArea>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTextArea> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxTextArea>;
    export type Properties = dxTextAreaOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxTextArea> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * [descr:dxTextAreaOptions.autoResizeEnabled]
     */
    autoResizeEnabled?: boolean;
    /**
     * [descr:dxTextAreaOptions.maxHeight]
     */
    maxHeight?: number | string;
    /**
     * [descr:dxTextAreaOptions.minHeight]
     */
    minHeight?: number | string;
    /**
     * [descr:dxTextAreaOptions.spellcheck]
     */
    spellcheck?: boolean;
  }
  /**
   * [descr:dxTextBox]
   */
  export class dxTextBox<
    TProperties = DevExpress.ui.dxTextBox.Properties
  > extends dxTextEditor<TProperties> {}
  module dxTextBox {
    export type ChangeEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTextBox>;
    export type CopyEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type CutEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTextBox>;
    export type EnterKeyEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type FocusInEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type FocusOutEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTextBox>;
    export type InputEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type KeyPressEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type KeyUpEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTextBox> &
      DevExpress.events.ChangedOptionInfo;
    export type PasteEvent = DevExpress.events.NativeEventInfo<dxTextBox>;
    export type Properties = dxTextBoxOptions<dxTextBox<Properties>>;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxTextBox> &
        DevExpress.ui.Editor.ValueChangedInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTextBoxOptions<TComponent>
    extends dxTextEditorOptions<TComponent> {
    /**
     * [descr:dxTextBoxOptions.maxLength]
     */
    maxLength?: string | number;
    /**
     * [descr:dxTextBoxOptions.mode]
     */
    mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
    /**
     * [descr:dxTextBoxOptions.value]
     */
    value?: string;
  }
  /**
   * [descr:dxTextEditor]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxTextEditor<
    TProperties = DevExpress.ui.dxTextEditor.Properties
  > extends Editor<TProperties> {
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
  module dxTextEditor {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    type Properties = dxTextEditorOptions<dxTextEditor<Properties>>;
  }
  /**
   * [descr:dxTextEditorButton]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTextEditorOptions<TComponent>
    extends EditorOptions<TComponent> {
    /**
     * [descr:dxTextEditorOptions.buttons]
     */
    buttons?: Array<string | 'clear' | dxTextEditorButton>;
    /**
     * [descr:dxTextEditorOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxTextEditorOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxTextEditorOptions.inputAttr]
     */
    inputAttr?: any;
    /**
     * [descr:dxTextEditorOptions.mask]
     */
    mask?: string;
    /**
     * [descr:dxTextEditorOptions.maskChar]
     */
    maskChar?: string;
    /**
     * [descr:dxTextEditorOptions.maskInvalidMessage]
     */
    maskInvalidMessage?: string;
    /**
     * [descr:dxTextEditorOptions.maskRules]
     */
    maskRules?: any;
    /**
     * [descr:dxTextEditorOptions.name]
     */
    name?: string;
    /**
     * [descr:dxTextEditorOptions.onChange]
     */
    onChange?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onCopy]
     */
    onCopy?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onCut]
     */
    onCut?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onEnterKey]
     */
    onEnterKey?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onFocusIn]
     */
    onFocusIn?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onFocusOut]
     */
    onFocusOut?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onInput]
     */
    onInput?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onKeyDown]
     */
    onKeyDown?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onKeyPress]
     * @deprecated [depNote:dxTextEditorOptions.onKeyPress]
     */
    onKeyPress?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onKeyUp]
     */
    onKeyUp?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.onPaste]
     */
    onPaste?: (e: DevExpress.events.NativeEventInfo<TComponent>) => void;
    /**
     * [descr:dxTextEditorOptions.placeholder]
     */
    placeholder?: string;
    /**
     * [descr:dxTextEditorOptions.showClearButton]
     */
    showClearButton?: boolean;
    /**
     * [descr:dxTextEditorOptions.showMaskMode]
     */
    showMaskMode?: 'always' | 'onFocus';
    /**
     * [descr:dxTextEditorOptions.spellcheck]
     */
    spellcheck?: boolean;
    /**
     * [descr:dxTextEditorOptions.stylingMode]
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * [descr:dxTextEditorOptions.text]
     */
    text?: string;
    /**
     * [descr:dxTextEditorOptions.useMaskedValue]
     */
    useMaskedValue?: boolean;
    /**
     * [descr:dxTextEditorOptions.value]
     */
    value?: any;
    /**
     * [descr:dxTextEditorOptions.valueChangeEvent]
     */
    valueChangeEvent?: string;
  }
  /**
   * [descr:dxTileView]
   */
  export class dxTileView extends CollectionWidget<dxTileViewOptions> {
    /**
     * [descr:dxTileView.scrollPosition()]
     */
    scrollPosition(): number;
  }
  module dxTileView {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTileView>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTileView>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTileView>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxTileView> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxTileView> &
        DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxTileView> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxTileView> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTileView> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTileViewOptions;
  }
  /**
   * [descr:dxTileViewItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTileViewOptions
    extends CollectionWidgetOptions<dxTileView> {
    /**
     * [descr:dxTileViewOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:dxTileViewOptions.baseItemHeight]
     */
    baseItemHeight?: number;
    /**
     * [descr:dxTileViewOptions.baseItemWidth]
     */
    baseItemWidth?: number;
    /**
     * [descr:dxTileViewOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxTileViewItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxTileViewOptions.direction]
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * [descr:dxTileViewOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:dxTileViewOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxTileViewOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:dxTileViewOptions.itemMargin]
     */
    itemMargin?: number;
    /**
     * [descr:dxTileViewOptions.items]
     */
    items?: Array<string | dxTileViewItem | any>;
    /**
     * [descr:dxTileViewOptions.showScrollbar]
     */
    showScrollbar?: boolean;
  }
  /**
   * [descr:dxToast]
   */
  export class dxToast extends dxOverlay<dxToastOptions> {}
  module dxToast {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxToast>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxToast>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxToast>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxToast>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxToast>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxToast> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxToastOptions;
    export type ShowingEvent = DevExpress.events.EventInfo<dxToast>;
    export type ShownEvent = DevExpress.events.EventInfo<dxToast>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * [descr:dxToastOptions.animation.hide]
     */
    hide?: animationConfig;
    /**
     * [descr:dxToastOptions.animation.show]
     */
    show?: animationConfig;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * [descr:dxToastOptions.animation]
     */
    animation?: dxToastAnimation;
    /**
     * [descr:dxToastOptions.closeOnClick]
     */
    closeOnClick?: boolean;
    /**
     * [descr:dxToastOptions.closeOnOutsideClick]
     */
    closeOnOutsideClick?:
      | boolean
      | ((event: DevExpress.events.DxEvent) => boolean);
    /**
     * [descr:dxToastOptions.closeOnSwipe]
     */
    closeOnSwipe?: boolean;
    /**
     * [descr:dxToastOptions.displayTime]
     */
    displayTime?: number;
    /**
     * [descr:dxToastOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:dxToastOptions.maxWidth]
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * [descr:dxToastOptions.message]
     */
    message?: string;
    /**
     * [descr:dxToastOptions.minWidth]
     */
    minWidth?: number | string | (() => number | string);
    /**
     * [descr:dxToastOptions.position]
     */
    position?: positionConfig | string;
    /**
     * [descr:dxToastOptions.shading]
     */
    shading?: boolean;
    /**
     * [descr:dxToastOptions.type]
     */
    type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
    /**
     * [descr:dxToastOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * [descr:dxToolbar]
   */
  export class dxToolbar extends CollectionWidget<dxToolbarOptions> {}
  module dxToolbar {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxToolbar>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxToolbar>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxToolbar>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxToolbar> &
      DevExpress.events.ItemInfo;
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxToolbar> & DevExpress.events.ItemInfo;
    export type ItemHoldEvent = DevExpress.events.NativeEventInfo<dxToolbar> &
      DevExpress.events.ItemInfo;
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxToolbar> & DevExpress.events.ItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxToolbar> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxToolbarOptions;
  }
  /**
   * [descr:dxToolbarItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    menuItemTemplate?:
      | DevExpress.core.template
      | (() => string | DevExpress.core.UserDefinedElement);
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
    widget?:
      | 'dxAutocomplete'
      | 'dxButton'
      | 'dxCheckBox'
      | 'dxDateBox'
      | 'dxMenu'
      | 'dxSelectBox'
      | 'dxTabs'
      | 'dxTextBox'
      | 'dxButtonGroup'
      | 'dxDropDownButton';
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
    /**
     * [descr:dxToolbarOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<string | dxToolbarItem | any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxToolbarOptions.items]
     */
    items?: Array<string | dxToolbarItem | any>;
    /**
     * [descr:dxToolbarOptions.menuItemTemplate]
     */
    menuItemTemplate?:
      | DevExpress.core.template
      | ((
          itemData: any,
          itemIndex: number,
          itemElement: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxToolbarOptions.height]
     * @deprecated [depNote:dxToolbarOptions.height]
     */
    height?: number | string | (() => number | string);
  }
  /**
   * [descr:dxTooltip]
   */
  export class dxTooltip extends dxPopover<dxTooltipOptions> {}
  module dxTooltip {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTooltip>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTooltip>;
    export type HiddenEvent = DevExpress.events.EventInfo<dxTooltip>;
    export type HidingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTooltip>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTooltip>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTooltip> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTooltipOptions;
    export type ShowingEvent = DevExpress.events.EventInfo<dxTooltip>;
    export type ShownEvent = DevExpress.events.EventInfo<dxTooltip>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {}
  /**
   * [descr:dxTrackBar]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxTrackBar<TProperties> extends Editor<TProperties> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTrackBarOptions<TComponent>
    extends EditorOptions<TComponent> {
    /**
     * [descr:dxTrackBarOptions.max]
     */
    max?: number;
    /**
     * [descr:dxTrackBarOptions.min]
     */
    min?: number;
  }
  /**
   * [descr:dxTreeList]
   */
  export class dxTreeList
    extends Widget<dxTreeListOptions>
    implements GridBase
  {
    /**
     * [descr:dxTreeList.addColumn(columnOptions)]
     */
    addColumn(columnOptions: any | string): void;
    /**
     * [descr:dxTreeList.addRow()]
     */
    addRow(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.addRow(parentId)]
     */
    addRow(parentId: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.collapseRow(key)]
     */
    collapseRow(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.expandRow(key)]
     */
    expandRow(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.forEachNode(callback)]
     */
    forEachNode(callback: Function): void;
    /**
     * [descr:dxTreeList.forEachNode(nodes, callback)]
     */
    forEachNode(
      nodes: Array<DevExpress.ui.dxTreeList.Node>,
      callback: Function
    ): void;
    /**
     * [descr:dxTreeList.getNodeByKey(key)]
     */
    getNodeByKey(key: any | string | number): DevExpress.ui.dxTreeList.Node;
    /**
     * [descr:dxTreeList.getRootNode()]
     */
    getRootNode(): DevExpress.ui.dxTreeList.Node;
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
    getVisibleColumns(): Array<DevExpress.ui.dxTreeList.Column>;
    /**
     * [descr:dxTreeList.getVisibleColumns(headerLevel)]
     */
    getVisibleColumns(
      headerLevel: number
    ): Array<DevExpress.ui.dxTreeList.Column>;
    /**
     * [descr:dxTreeList.getVisibleRows()]
     */
    getVisibleRows(): Array<DevExpress.ui.dxTreeList.RowObject>;
    /**
     * [descr:dxTreeList.isRowExpanded(key)]
     */
    isRowExpanded(key: any): boolean;
    /**
     * [descr:dxTreeList.loadDescendants()]
     */
    loadDescendants(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.loadDescendants(keys)]
     */
    loadDescendants(keys: Array<any>): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeList.loadDescendants(keys, childrenOnly)]
     */
    loadDescendants(
      keys: Array<any>,
      childrenOnly: boolean
    ): DevExpress.core.utils.DxPromise<void>;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): DevExpress.core.utils.DxPromise<any>;
    cancelEditData(): void;
    cellValue(rowIndex: number, dataField: string): any;
    cellValue(rowIndex: number, dataField: string, value: any): void;
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    clearFilter(): void;
    clearFilter(filterName: string): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEditCell(): void;
    collapseAdaptiveDetailRow(): void;
    columnCount(): number;
    columnOption(id: number | string): any;
    columnOption(id: number | string, optionName: string): any;
    columnOption(
      id: number | string,
      optionName: string,
      optionValue: any
    ): void;
    columnOption(id: number | string, options: any): void;
    deleteColumn(id: number | string): void;
    deleteRow(rowIndex: number): void;
    deselectAll(): DevExpress.core.utils.DxPromise<void>;
    deselectRows(keys: Array<any>): DevExpress.core.utils.DxPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: DevExpress.core.UserDefinedElement): void;
    getCellElement(
      rowIndex: number,
      dataField: string
    ): DevExpress.core.DxElement | undefined;
    getCellElement(
      rowIndex: number,
      visibleColumnIndex: number
    ): DevExpress.core.DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DevExpress.data.DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(
      rowIndex: number
    ): DevExpress.core.UserDefinedElementsArray | undefined;
    getRowIndexByKey(key: any | string | number): number;
    getScrollable(): dxScrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: any): boolean;
    isRowFocused(key: any): boolean;
    isRowSelected(key: any): boolean;
    keyOf(obj: any): any;
    navigateToRow(key: any): void;
    pageCount(): number;
    pageIndex(): number;
    pageIndex(newIndex: number): DevExpress.core.utils.DxPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): DevExpress.core.utils.DxPromise<void>;
    refresh(changesOnly: boolean): DevExpress.core.utils.DxPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): DevExpress.core.utils.DxPromise<void>;
    searchByText(text: string): void;
    selectAll(): DevExpress.core.utils.DxPromise<void>;
    selectRows(
      keys: Array<any>,
      preserve: boolean
    ): DevExpress.core.utils.DxPromise<any>;
    selectRowsByIndexes(
      indexes: Array<number>
    ): DevExpress.core.utils.DxPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
  }
  module dxTreeList {
    export type AdaptiveDetailRowPreparingEvent =
      DevExpress.events.EventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.AdaptiveDetailRowPreparingInfo;
    export type CellClickEvent = DevExpress.events.NativeEventInfo<dxTreeList> &
      CellInfo;
    export type CellDblClickEvent =
      DevExpress.events.NativeEventInfo<dxTreeList> & CellInfo;
    export type CellHoverChangedEvent =
      DevExpress.events.EventInfo<dxTreeList> &
        CellInfo & {
          readonly eventType: string;
        };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface CellInfo {
      readonly data: any;
      readonly key: any;
      readonly value?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly column: Column;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly cellElement: DevExpress.core.DxElement;
      readonly row: RowObject;
    }
    export type CellPreparedEvent = DevExpress.events.EventInfo<dxTreeList> &
      CellInfo & {
        readonly isSelected?: boolean;
        readonly isExpanded?: boolean;
        readonly isNewRow?: boolean;
        readonly watch?: Function;
        readonly oldValue?: any;
      };
    /**
     * [descr:dxTreeListColumn]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Column extends DevExpress.ui.dxDataGrid.ColumnBase {
      /**
       * [descr:dxTreeListColumn.buttons]
       */
      buttons?: Array<
        | 'add'
        | 'cancel'
        | 'delete'
        | 'edit'
        | 'save'
        | 'undelete'
        | ColumnButton
      >;
      /**
       * [descr:dxTreeListColumn.cellTemplate]
       */
      cellTemplate?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnCellTemplateData
          ) => any);
      /**
       * [descr:dxTreeListColumn.columns]
       */
      columns?: Array<Column | string>;
      /**
       * [descr:dxTreeListColumn.editCellTemplate]
       */
      editCellTemplate?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnEditCellTemplateData
          ) => any);
      /**
       * [descr:dxTreeListColumn.headerCellTemplate]
       */
      headerCellTemplate?:
        | DevExpress.core.template
        | ((
            columnHeader: DevExpress.core.DxElement,
            headerInfo: ColumnHeaderCellTemplateData
          ) => any);
      /**
       * [descr:dxTreeListColumn.type]
       */
      type?: 'adaptive' | 'buttons';
    }
    /**
     * [descr:dxTreeListColumnButton]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ColumnButton
      extends DevExpress.ui.dxDataGrid.ColumnButtonBase {
      /**
       * [descr:dxTreeListColumnButton.name]
       */
      name?:
        | 'add'
        | 'cancel'
        | 'delete'
        | 'edit'
        | 'save'
        | 'undelete'
        | string;
      /**
       * [descr:dxTreeListColumnButton.onClick]
       */
      onClick?: (e: ColumnButtonClickEvent) => void;
      /**
       * [descr:dxTreeListColumnButton.template]
       */
      template?:
        | DevExpress.core.template
        | ((
            cellElement: DevExpress.core.DxElement,
            cellInfo: ColumnButtonTemplateData
          ) => string | DevExpress.core.UserDefinedElement);
      /**
       * [descr:dxTreeListColumnButton.visible]
       */
      visible?:
        | boolean
        | ((options: {
            readonly component: dxTreeList;
            readonly row?: RowObject;
            readonly column: Column;
          }) => boolean);
      /**
       * [descr:dxTreeListColumnButton.visible]
       */
      disabled?:
        | boolean
        | ((options: {
            readonly component: dxTreeList;
            readonly row?: RowObject;
            readonly column: Column;
          }) => boolean);
    }
    export type ColumnButtonClickEvent =
      DevExpress.events.NativeEventInfo<dxTreeList> & {
        row?: RowObject;
        column?: Column;
      };
    export type ColumnButtonTemplateData = {
      readonly component: dxTreeList;
      readonly data: any;
      readonly key: any;
      readonly columnIndex: number;
      readonly column: Column;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly row: RowObject;
    };
    export type ColumnCellTemplateData = {
      readonly data: any;
      readonly component: dxTreeList;
      readonly value?: any;
      readonly oldValue?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly rowIndex: number;
      readonly column: Column;
      readonly row: RowObject;
      readonly rowType: string;
      readonly watch?: Function;
    };
    export type ColumnEditCellTemplateData = {
      readonly setValue?: any;
      readonly data: any;
      readonly component: dxTreeList;
      readonly value?: any;
      readonly displayValue?: any;
      readonly text: string;
      readonly columnIndex: number;
      readonly rowIndex: number;
      readonly column: Column;
      readonly row: RowObject;
      readonly rowType: string;
      readonly watch?: Function;
    };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type ColumnHeaderCellTemplateData = {
      readonly component: dxTreeList;
      readonly columnIndex: number;
      readonly column: Column;
    };
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTreeList>;
    export type ContextMenuPreparingEvent =
      DevExpress.events.EventInfo<dxTreeList> & {
        items?: Array<any>;
        readonly target: string;
        readonly targetElement: DevExpress.core.DxElement;
        readonly columnIndex: number;
        readonly column?: Column;
        readonly rowIndex: number;
        readonly row?: RowObject;
      };
    export type DataErrorOccurredEvent =
      DevExpress.events.EventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.DataErrorOccurredInfo;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTreeList>;
    export type EditCanceledEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DataChangeInfo;
    export type EditCancelingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DataChangeInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Editing extends DevExpress.ui.dxDataGrid.EditingBase {
      /**
       * [descr:dxTreeListOptions.editing.allowAdding]
       */
      allowAdding?:
        | boolean
        | ((options: {
            readonly component: dxTreeList;
            readonly row?: RowObject;
          }) => boolean);
      /**
       * [descr:dxTreeListOptions.editing.allowDeleting]
       */
      allowDeleting?:
        | boolean
        | ((options: {
            readonly component: dxTreeList;
            readonly row?: RowObject;
          }) => boolean);
      /**
       * [descr:dxTreeListOptions.editing.allowUpdating]
       */
      allowUpdating?:
        | boolean
        | ((options: {
            readonly component: dxTreeList;
            readonly row?: RowObject;
          }) => boolean);
      /**
       * [descr:dxTreeListOptions.editing.texts]
       */
      texts?: EditingTexts;
    }
    export type EditingStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly data: any;
        readonly key: any;
        readonly column: any;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface EditingTexts
      extends DevExpress.ui.dxDataGrid.EditingTextsBase {
      /**
       * [descr:dxTreeListOptions.editing.texts.addRowToNode]
       */
      addRowToNode?: string;
    }
    export type EditorPreparedEvent =
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly parentType: string;
        readonly value?: any;
        readonly setValue?: any;
        readonly updateValueTimeout?: number;
        readonly width?: number;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
        readonly editorElement: DevExpress.core.DxElement;
        readonly readOnly: boolean;
        readonly dataField?: string;
        readonly row?: RowObject;
      };
    export type EditorPreparingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly parentType: string;
        readonly value?: any;
        readonly setValue?: any;
        updateValueTimeout?: number;
        readonly width?: number;
        readonly disabled: boolean;
        readonly rtlEnabled: boolean;
        readonly editorElement: DevExpress.core.DxElement;
        readonly readOnly: boolean;
        editorName: string;
        editorOptions: any;
        readonly dataField?: string;
        readonly row?: RowObject;
      };
    export type FocusedCellChangedEvent =
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly cellElement: DevExpress.core.DxElement;
        readonly columnIndex: number;
        readonly rowIndex: number;
        readonly row: RowObject;
        readonly column: Column;
      };
    export type FocusedCellChangingEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxTreeList> & {
        readonly cellElement: DevExpress.core.DxElement;
        readonly prevColumnIndex: number;
        readonly prevRowIndex: number;
        newColumnIndex: number;
        newRowIndex: number;
        readonly rows: Array<RowObject>;
        readonly columns: Array<Column>;
        isHighlighted: boolean;
      };
    export type FocusedRowChangedEvent =
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly rowElement: DevExpress.core.DxElement;
        readonly rowIndex: number;
        readonly row: RowObject;
      };
    export type FocusedRowChangingEvent =
      DevExpress.events.NativeEventInfo<dxTreeList> & {
        readonly rowElement: DevExpress.core.DxElement;
        readonly prevRowIndex: number;
        newRowIndex: number;
        readonly rows: Array<RowObject>;
      };
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTreeList>;
    export type InitNewRowEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.NewRowInfo;
    export type KeyDownEvent = DevExpress.events.NativeEventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.KeyDownInfo;
    /**
     * [descr:dxTreeListNode]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Node {
      /**
       * [descr:dxTreeListNode.children]
       */
      children?: Array<Node>;
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
      key: any;
      /**
       * [descr:dxTreeListNode.level]
       */
      level: number;
      /**
       * [descr:dxTreeListNode.parent]
       */
      parent?: Node;
      /**
       * [descr:dxTreeListNode.visible]
       */
      visible?: boolean;
    }
    export type NodesInitializedEvent =
      DevExpress.events.EventInfo<dxTreeList> & {
        readonly root: Node;
      };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.events.ChangedOptionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Paging extends DevExpress.ui.dxDataGrid.PagingBase {
      /**
       * [descr:dxTreeListOptions.paging.enabled]
       */
      enabled?: boolean;
    }
    export type Properties = dxTreeListOptions;
    export type RowClickEvent =
      DevExpress.events.NativeEventInfo<dxTreeList> & {
        readonly data: any;
        readonly key: any;
        readonly values: Array<any>;
        readonly columns: Array<any>;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly isSelected?: boolean;
        readonly isExpanded?: boolean;
        readonly isNewRow?: boolean;
        readonly rowElement: DevExpress.core.DxElement;
        readonly handled: boolean;
        readonly node: Node;
        readonly level: number;
      };
    export type RowCollapsedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowKeyInfo;
    export type RowCollapsingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowKeyInfo;
    export type RowDblClickEvent =
      DevExpress.events.NativeEventInfo<dxTreeList> & {
        readonly data: any;
        readonly key: any;
        readonly values: Array<any>;
        readonly columns: Array<Column>;
        readonly rowIndex: number;
        readonly rowType: string;
        readonly isSelected?: boolean;
        readonly isExpanded?: boolean;
        readonly isNewRow?: boolean;
        readonly rowElement: DevExpress.core.DxElement;
      };
    export type RowDraggingAddEvent =
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.DragDropInfo;
    export type RowDraggingChangeEvent = DevExpress.events.Cancelable &
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DragDropInfo;
    export type RowDraggingEndEvent = DevExpress.events.Cancelable &
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DragDropInfo;
    export type RowDraggingMoveEvent = DevExpress.events.Cancelable &
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DragDropInfo;
    export type RowDraggingRemoveEvent =
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList>;
    export type RowDraggingReorderEvent =
      DevExpress.ui.dxDataGrid.RowDraggingEventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.DragReorderInfo;
    export type RowDraggingStartEvent = DevExpress.events.Cancelable &
      DevExpress.ui.dxDataGrid.DragStartEventInfo<dxTreeList>;
    export type RowDraggingTemplateData =
      DevExpress.ui.dxDataGrid.RowDraggingTemplateDataModel;
    export type RowExpandedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowKeyInfo;
    export type RowExpandingEvent = DevExpress.events.Cancelable &
      DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowKeyInfo;
    export type RowInsertedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowInsertedInfo;
    export type RowInsertingEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowInsertingInfo;
    /**
     * [descr:dxTreeListRowObject]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface RowObject {
      /**
       * [descr:dxTreeListRowObject.isEditing]
       */
      readonly isEditing?: boolean;
      /**
       * [descr:dxTreeListRowObject.isExpanded]
       */
      readonly isExpanded?: boolean;
      /**
       * [descr:dxTreeListRowObject.isNewRow]
       */
      readonly isNewRow?: boolean;
      /**
       * [descr:dxTreeListRowObject.isSelected]
       */
      readonly isSelected?: boolean;
      /**
       * [descr:dxTreeListRowObject.key]
       */
      readonly key: any;
      /**
       * [descr:dxTreeListRowObject.level]
       */
      readonly level: number;
      /**
       * [descr:dxTreeListRowObject.node]
       */
      readonly node: Node;
      /**
       * [descr:dxTreeListRowObject.rowIndex]
       */
      readonly rowIndex: number;
      /**
       * [descr:dxTreeListRowObject.rowType]
       */
      readonly rowType: string;
      /**
       * [descr:dxTreeListRowObject.values]
       */
      readonly values: Array<any>;
    }
    export type RowPreparedEvent = DevExpress.events.EventInfo<dxTreeList> & {
      readonly data: any;
      readonly key: any;
      readonly values: Array<any>;
      readonly columns: Array<Column>;
      readonly rowIndex: number;
      readonly rowType: string;
      readonly isSelected?: boolean;
      readonly isExpanded?: boolean;
      readonly isNewRow?: boolean;
      readonly rowElement: DevExpress.core.DxElement;
      readonly node: Node;
      readonly level: number;
    };
    export type RowRemovedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowRemovedInfo;
    export type RowRemovingEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowRemovingInfo;
    export type RowUpdatedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowUpdatedInfo;
    export type RowUpdatingEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowUpdatingInfo;
    export type RowValidatingEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.RowValidatingInfo;
    export type SavedEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.DataChangeInfo;
    export type SavingEvent = DevExpress.events.EventInfo<dxTreeList> &
      DevExpress.ui.dxDataGrid.SavingInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Scrolling extends DevExpress.ui.dxDataGrid.ScrollingBase {
      /**
       * [descr:dxTreeListOptions.scrolling.mode]
       */
      mode?: 'standard' | 'virtual';
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface Selection extends DevExpress.ui.dxDataGrid.SelectionBase {
      /**
       * [descr:dxTreeListOptions.selection.recursive]
       */
      recursive?: boolean;
    }
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.SelectionChangedInfo;
    export type ToolbarPreparingEvent =
      DevExpress.events.EventInfo<dxTreeList> &
        DevExpress.ui.dxDataGrid.ToolbarPreparingInfo;
  }
  /**
   * @deprecated 
   */
  export type dxTreeListColumn = DevExpress.ui.dxTreeList.Column;
  /**
   * @deprecated 
   */
  export type dxTreeListColumnButton = DevExpress.ui.dxTreeList.ColumnButton;
  /**
   * @deprecated 
   */
  export type dxTreeListEditing = DevExpress.ui.dxTreeList.Editing;
  /**
   * @deprecated 
   */
  export type dxTreeListEditingTexts = DevExpress.ui.dxTreeList.EditingTexts;
  /**
   * @deprecated 
   */
  export type dxTreeListNode = DevExpress.ui.dxTreeList.Node;
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
    /**
     * [descr:dxTreeListOptions.autoExpandAll]
     */
    autoExpandAll?: boolean;
    /**
     * [descr:dxTreeListOptions.columns]
     */
    columns?: Array<DevExpress.ui.dxTreeList.Column | string>;
    /**
     * [descr:dxTreeListOptions.customizeColumns]
     */
    customizeColumns?: (
      columns: Array<DevExpress.ui.dxTreeList.Column>
    ) => void;
    /**
     * [descr:dxTreeListOptions.dataStructure]
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * [descr:dxTreeListOptions.editing]
     */
    editing?: DevExpress.ui.dxTreeList.Editing;
    /**
     * [descr:dxTreeListOptions.expandNodesOnFiltering]
     */
    expandNodesOnFiltering?: boolean;
    /**
     * [descr:dxTreeListOptions.expandedRowKeys]
     */
    expandedRowKeys?: Array<any>;
    /**
     * [descr:dxTreeListOptions.filterMode]
     */
    filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
    /**
     * [descr:dxTreeListOptions.hasItemsExpr]
     */
    hasItemsExpr?: string | Function;
    /**
     * [descr:dxTreeListOptions.itemsExpr]
     */
    itemsExpr?: string | Function;
    /**
     * [descr:dxTreeListOptions.keyExpr]
     */
    keyExpr?: string | Function;
    /**
     * [descr:dxTreeListOptions.onCellClick]
     */
    onCellClick?: (e: DevExpress.ui.dxTreeList.CellClickEvent) => void;
    /**
     * [descr:dxTreeListOptions.onCellDblClick]
     */
    onCellDblClick?: (e: DevExpress.ui.dxTreeList.CellDblClickEvent) => void;
    /**
     * [descr:dxTreeListOptions.onCellHoverChanged]
     */
    onCellHoverChanged?: (
      e: DevExpress.ui.dxTreeList.CellHoverChangedEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onCellPrepared]
     */
    onCellPrepared?: (e: DevExpress.ui.dxTreeList.CellPreparedEvent) => void;
    /**
     * [descr:dxTreeListOptions.onContextMenuPreparing]
     */
    onContextMenuPreparing?: (
      e: DevExpress.ui.dxTreeList.ContextMenuPreparingEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onEditingStart]
     */
    onEditingStart?: (e: DevExpress.ui.dxTreeList.EditingStartEvent) => void;
    /**
     * [descr:dxTreeListOptions.onEditorPrepared]
     */
    onEditorPrepared?: (
      options: DevExpress.ui.dxTreeList.EditorPreparedEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onEditorPreparing]
     */
    onEditorPreparing?: (
      e: DevExpress.ui.dxTreeList.EditorPreparingEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onFocusedCellChanged]
     */
    onFocusedCellChanged?: (
      e: DevExpress.ui.dxTreeList.FocusedCellChangedEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onFocusedCellChanging]
     */
    onFocusedCellChanging?: (
      e: DevExpress.ui.dxTreeList.FocusedCellChangingEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onFocusedRowChanged]
     */
    onFocusedRowChanged?: (
      e: DevExpress.ui.dxTreeList.FocusedRowChangedEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onFocusedRowChanging]
     */
    onFocusedRowChanging?: (
      e: DevExpress.ui.dxTreeList.FocusedRowChangingEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onNodesInitialized]
     */
    onNodesInitialized?: (
      e: DevExpress.ui.dxTreeList.NodesInitializedEvent
    ) => void;
    /**
     * [descr:dxTreeListOptions.onRowClick]
     */
    onRowClick?: (e: DevExpress.ui.dxTreeList.RowClickEvent) => void;
    /**
     * [descr:dxTreeListOptions.onRowDblClick]
     */
    onRowDblClick?: (e: DevExpress.ui.dxTreeList.RowDblClickEvent) => void;
    /**
     * [descr:dxTreeListOptions.onRowPrepared]
     */
    onRowPrepared?: (e: DevExpress.ui.dxTreeList.RowPreparedEvent) => void;
    /**
     * [descr:dxTreeListOptions.paging]
     */
    paging?: DevExpress.ui.dxTreeList.Paging;
    /**
     * [descr:dxTreeListOptions.parentIdExpr]
     */
    parentIdExpr?: string | Function;
    /**
     * [descr:dxTreeListOptions.remoteOperations]
     */
    remoteOperations?:
      | {
          /**
           * [descr:dxTreeListOptions.remoteOperations.filtering]
           */
          filtering?: boolean;
          /**
           * [descr:dxTreeListOptions.remoteOperations.grouping]
           */
          grouping?: boolean;
          /**
           * [descr:dxTreeListOptions.remoteOperations.sorting]
           */
          sorting?: boolean;
        }
      | 'auto';
    /**
     * [descr:dxTreeListOptions.rootValue]
     */
    rootValue?: any;
    /**
     * [descr:dxTreeListOptions.scrolling]
     */
    scrolling?: DevExpress.ui.dxTreeList.Scrolling;
    /**
     * [descr:dxTreeListOptions.selection]
     */
    selection?: DevExpress.ui.dxTreeList.Selection;
  }
  /**
   * @deprecated 
   */
  export type dxTreeListPaging = DevExpress.ui.dxTreeList.Paging;
  /**
   * @deprecated 
   */
  export type dxTreeListRowObject = DevExpress.ui.dxTreeList.RowObject;
  /**
   * @deprecated 
   */
  export type dxTreeListScrolling = DevExpress.ui.dxTreeList.Scrolling;
  /**
   * @deprecated 
   */
  export type dxTreeListSelection = DevExpress.ui.dxTreeList.Selection;
  /**
   * [descr:dxTreeView]
   */
  export class dxTreeView extends HierarchicalCollectionWidget<dxTreeViewOptions> {
    /**
     * [descr:dxTreeView.collapseAll()]
     */
    collapseAll(): void;
    /**
     * [descr:dxTreeView.collapseItem(itemData)]
     */
    collapseItem(itemData: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.collapseItem(itemElement)]
     */
    collapseItem(itemElement: Element): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.collapseItem(key)]
     */
    collapseItem(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.expandAll()]
     */
    expandAll(): void;
    /**
     * [descr:dxTreeView.expandItem(itemData)]
     */
    expandItem(itemData: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.expandItem(itemElement)]
     */
    expandItem(itemElement: Element): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.expandItem(key)]
     */
    expandItem(key: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.getNodes()]
     */
    getNodes(): Array<dxTreeViewNode>;
    /**
     * [descr:dxTreeView.getSelectedNodes()]
     */
    getSelectedNodes(): Array<dxTreeViewNode>;
    /**
     * [descr:dxTreeView.getSelectedNodeKeys()]
     */
    getSelectedNodeKeys(): Array<any>;
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
    updateDimensions(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.scrollToItem(itemData)]
     */
    scrollToItem(itemData: any): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.scrollToItem(itemElement)]
     */
    scrollToItem(itemElement: Element): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:dxTreeView.scrollToItem(key)]
     */
    scrollToItem(key: any): DevExpress.core.utils.DxPromise<void>;
  }
  module dxTreeView {
    export type ContentReadyEvent = DevExpress.events.EventInfo<dxTreeView>;
    export type DisposingEvent = DevExpress.events.EventInfo<dxTreeView>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTreeView>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number | any;
        readonly node?: dxTreeViewNode;
      };
    export type ItemCollapsedEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number;
        readonly node?: dxTreeViewNode;
      };
    export type ItemContextMenuEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number | any;
        readonly node?: dxTreeViewNode;
      };
    export type ItemExpandedEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number;
        readonly node?: dxTreeViewNode;
      };
    export type ItemHoldEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number;
        readonly node?: dxTreeViewNode;
      };
    export type ItemRenderedEvent =
      DevExpress.events.NativeEventInfo<dxTreeView> & {
        readonly itemData?: any;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemIndex?: number;
        readonly node?: dxTreeViewNode;
      };
    export type ItemSelectionChangedEvent =
      DevExpress.events.EventInfo<dxTreeView> & {
        readonly node?: dxTreeViewNode;
        readonly itemElement?: DevExpress.core.DxElement;
        readonly itemData?: any;
        readonly itemIndex?: number;
      };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTreeView> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTreeViewOptions;
    export type SelectAllValueChangedEvent =
      DevExpress.events.EventInfo<dxTreeView> & {
        readonly value?: boolean | undefined;
      };
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxTreeView>;
  }
  /**
   * [descr:dxTreeViewItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTreeViewOptions
    extends HierarchicalCollectionWidgetOptions<dxTreeView>,
      SearchBoxMixinOptions {
    /**
     * [descr:dxTreeViewOptions.animationEnabled]
     */
    animationEnabled?: boolean;
    /**
     * [descr:dxTreeViewOptions.createChildren]
     */
    createChildren?: (
      parentNode: dxTreeViewNode
    ) => PromiseLike<any> | Array<any>;
    /**
     * [descr:dxTreeViewOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<dxTreeViewItem>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:dxTreeViewOptions.dataStructure]
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * [descr:dxTreeViewOptions.expandAllEnabled]
     */
    expandAllEnabled?: boolean;
    /**
     * [descr:dxTreeViewOptions.expandEvent]
     */
    expandEvent?: 'dblclick' | 'click';
    /**
     * [descr:dxTreeViewOptions.expandNodesRecursive]
     */
    expandNodesRecursive?: boolean;
    /**
     * [descr:dxTreeViewOptions.expandedExpr]
     */
    expandedExpr?: string | Function;
    /**
     * [descr:dxTreeViewOptions.hasItemsExpr]
     */
    hasItemsExpr?: string | Function;
    /**
     * [descr:dxTreeViewOptions.items]
     */
    items?: Array<dxTreeViewItem>;
    /**
     * [descr:dxTreeViewOptions.onItemClick]
     */
    onItemClick?: (e: DevExpress.ui.dxTreeView.ItemClickEvent) => void;
    /**
     * [descr:dxTreeViewOptions.onItemCollapsed]
     */
    onItemCollapsed?: (e: DevExpress.ui.dxTreeView.ItemCollapsedEvent) => void;
    /**
     * [descr:dxTreeViewOptions.onItemContextMenu]
     */
    onItemContextMenu?: (
      e: DevExpress.ui.dxTreeView.ItemContextMenuEvent
    ) => void;
    /**
     * [descr:dxTreeViewOptions.onItemExpanded]
     */
    onItemExpanded?: (e: DevExpress.ui.dxTreeView.ItemExpandedEvent) => void;
    /**
     * [descr:dxTreeViewOptions.onItemHold]
     */
    onItemHold?: (e: DevExpress.ui.dxTreeView.ItemHoldEvent) => void;
    /**
     * [descr:dxTreeViewOptions.onItemRendered]
     */
    onItemRendered?: (e: DevExpress.ui.dxTreeView.ItemRenderedEvent) => void;
    /**
     * [descr:dxTreeViewOptions.onItemSelectionChanged]
     */
    onItemSelectionChanged?: (
      e: DevExpress.ui.dxTreeView.ItemSelectionChangedEvent
    ) => void;
    /**
     * [descr:dxTreeViewOptions.onSelectAllValueChanged]
     */
    onSelectAllValueChanged?: (
      e: DevExpress.ui.dxTreeView.SelectAllValueChangedEvent
    ) => void;
    /**
     * [descr:dxTreeViewOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.ui.dxTreeView.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxTreeViewOptions.parentIdExpr]
     */
    parentIdExpr?: string | Function;
    /**
     * [descr:dxTreeViewOptions.rootValue]
     */
    rootValue?: any;
    /**
     * [descr:dxTreeViewOptions.scrollDirection]
     */
    scrollDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * [descr:dxTreeViewOptions.selectAllText]
     */
    selectAllText?: string;
    /**
     * [descr:dxTreeViewOptions.selectByClick]
     */
    selectByClick?: boolean;
    /**
     * [descr:dxTreeViewOptions.selectNodesRecursive]
     */
    selectNodesRecursive?: boolean;
    /**
     * [descr:dxTreeViewOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxTreeViewOptions.showCheckBoxesMode]
     */
    showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
    /**
     * [descr:dxTreeViewOptions.virtualModeEnabled]
     */
    virtualModeEnabled?: boolean;
  }
  /**
   * [descr:dxValidationGroup]
   */
  export class dxValidationGroup extends DOMComponent<dxValidationGroupOptions> {
    /**
     * [descr:dxValidationGroup.reset()]
     */
    reset(): void;
    /**
     * [descr:dxValidationGroup.validate()]
     */
    validate(): dxValidationGroupResult;
  }
  module dxValidationGroup {
    export type DisposingEvent = DevExpress.events.EventInfo<dxValidationGroup>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxValidationGroup>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxValidationGroup> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxValidationGroupOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidationGroupOptions
    extends DOMComponentOptions<dxValidationGroup> {}
  /**
   * [descr:dxValidationGroupResult]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidationGroupResult {
    /**
     * [descr:dxValidationGroupResult.brokenRules]
     */
    brokenRules?: Array<
      | RequiredRule
      | NumericRule
      | RangeRule
      | StringLengthRule
      | CustomRule
      | CompareRule
      | PatternRule
      | EmailRule
      | AsyncRule
    >;
    /**
     * [descr:dxValidationGroupResult.complete]
     */
    complete?: DevExpress.core.utils.DxPromise<dxValidationGroupResult>;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class dxValidationMessage extends dxOverlay<dxValidationMessageOptions> {}
  module dxValidationMessage {
    export type Properties = dxValidationMessageOptions;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidationMessageOptions
    extends dxOverlayOptions<dxValidationMessage> {
    mode?: string;

    validationErrors?: Array<object> | null;

    positionRequest?: string;

    boundary?: String | DevExpress.core.UserDefinedElement;

    offset?: object;
  }
  /**
   * [descr:dxValidationSummary]
   */
  export class dxValidationSummary extends CollectionWidget<dxValidationSummaryOptions> {}
  module dxValidationSummary {
    export type ContentReadyEvent =
      DevExpress.events.EventInfo<dxValidationSummary>;
    export type DisposingEvent =
      DevExpress.events.EventInfo<dxValidationSummary>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxValidationSummary>;
    export type ItemClickEvent =
      DevExpress.events.NativeEventInfo<dxValidationSummary> &
        DevExpress.events.ItemInfo;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxValidationSummary> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxValidationSummaryOptions;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidationSummaryOptions
    extends CollectionWidgetOptions<dxValidationSummary> {
    /**
     * [descr:dxValidationSummaryOptions.validationGroup]
     */
    validationGroup?: string;
  }
  /**
   * [descr:dxValidator]
   */
  export class dxValidator extends DOMComponent<dxValidatorOptions> {
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
  module dxValidator {
    export type DisposingEvent = DevExpress.events.EventInfo<dxValidator>;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxValidator>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxValidator> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxValidatorOptions;
    export type ValidatedEvent = {
      name?: string;
      isValid?: boolean;
      value?: any;
      validationRules?: Array<ValidationRule>;
      brokenRule?: ValidationRule;
      brokenRules?: ValidationRule;
      status?: 'valid' | 'invalid' | 'pending';
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
    /**
     * [descr:dxValidatorOptions.adapter]
     */
    adapter?: {
      /**
       * [descr:dxValidatorOptions.adapter.applyValidationResults]
       */
      applyValidationResults?: Function;
      /**
       * [descr:dxValidatorOptions.adapter.bypass]
       */
      bypass?: Function;
      /**
       * [descr:dxValidatorOptions.adapter.focus]
       */
      focus?: Function;
      /**
       * [descr:dxValidatorOptions.adapter.getValue]
       */
      getValue?: Function;
      /**
       * [descr:dxValidatorOptions.adapter.reset]
       */
      reset?: Function;
      /**
       * [descr:dxValidatorOptions.adapter.validationRequestsCallbacks]
       */
      validationRequestsCallbacks?: Array<Function>;
    };
    /**
     * [descr:dxValidatorOptions.name]
     */
    name?: string;
    /**
     * [descr:dxValidatorOptions.onValidated]
     */
    onValidated?: (
      validatedInfo: DevExpress.ui.dxValidator.ValidatedEvent
    ) => void;
    /**
     * [descr:dxValidatorOptions.validationGroup]
     */
    validationGroup?: string;
    /**
     * [descr:dxValidatorOptions.validationRules]
     */
    validationRules?: Array<ValidationRule>;
  }
  /**
   * [descr:dxValidatorResult]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxValidatorResult {
    /**
     * [descr:dxValidatorResult.brokenRule]
     */
    brokenRule?: ValidationRule;
    /**
     * [descr:dxValidatorResult.brokenRules]
     */
    brokenRules?: Array<ValidationRule>;
    /**
     * [descr:dxValidatorResult.complete]
     */
    complete?: DevExpress.core.utils.DxPromise<dxValidatorResult>;
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
    validationRules?: Array<ValidationRule>;
    /**
     * [descr:dxValidatorResult.value]
     */
    value?: any;
  }
  /**
   * [descr:Editor]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class Editor<
    TProperties = DevExpress.ui.Editor.Properties
  > extends Widget<TProperties> {
    /**
     * [descr:Editor.reset()]
     */
    reset(): void;
  }
  module Editor {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    type Properties = EditorOptions<Editor<Properties>>;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ValueChangedInfo {
      readonly previousValue?: any;
      readonly value?: any;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface EditorOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * [descr:EditorOptions.isValid]
     */
    isValid?: boolean;
    /**
     * [descr:EditorOptions.onValueChanged]
     */
    onValueChanged?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.ui.Editor.ValueChangedInfo
    ) => void;
    /**
     * [descr:EditorOptions.readOnly]
     */
    readOnly?: boolean;
    /**
     * [descr:EditorOptions.validationError]
     */
    validationError?: any;
    /**
     * [descr:EditorOptions.validationErrors]
     */
    validationErrors?: Array<any>;
    /**
     * [descr:EditorOptions.validationMessageMode]
     */
    validationMessageMode?: 'always' | 'auto';
    /**
     * [descr:EditorOptions.validationStatus]
     */
    validationStatus?: 'valid' | 'invalid' | 'pending';
    /**
     * [descr:EditorOptions.value]
     */
    value?: any;
    /**
     * [descr:EditorOptions.stylingMode]
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
  }
  /**
   * [descr:EmailRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'email';
  }
  /**
   * [descr:format]
   */
  export type format =
    | 'billions'
    | 'currency'
    | 'day'
    | 'decimal'
    | 'exponential'
    | 'fixedPoint'
    | 'largeNumber'
    | 'longDate'
    | 'longTime'
    | 'millions'
    | 'millisecond'
    | 'month'
    | 'monthAndDay'
    | 'monthAndYear'
    | 'percent'
    | 'quarter'
    | 'quarterAndYear'
    | 'shortDate'
    | 'shortTime'
    | 'thousands'
    | 'trillions'
    | 'year'
    | 'dayOfWeek'
    | 'hour'
    | 'longDateLongTime'
    | 'minute'
    | 'second'
    | 'shortDateShortTime'
    | string
    | ((value: number | Date) => string)
    | {
        /**
         * [descr:format.currency]
         */
        currency?: string;
        /**
         * [descr:format.formatter]
         */
        formatter?: (value: number | Date) => string;
        /**
         * [descr:format.parser]
         */
        parser?: (value: string) => number | Date;
        /**
         * [descr:format.precision]
         */
        precision?: number;
        /**
         * [descr:format.type]
         */
        type?:
          | 'billions'
          | 'currency'
          | 'day'
          | 'decimal'
          | 'exponential'
          | 'fixedPoint'
          | 'largeNumber'
          | 'longDate'
          | 'longTime'
          | 'millions'
          | 'millisecond'
          | 'month'
          | 'monthAndDay'
          | 'monthAndYear'
          | 'percent'
          | 'quarter'
          | 'quarterAndYear'
          | 'shortDate'
          | 'shortTime'
          | 'thousands'
          | 'trillions'
          | 'year'
          | 'dayOfWeek'
          | 'hour'
          | 'longDateLongTime'
          | 'minute'
          | 'second'
          | 'shortDateShortTime';
      };
  /**
   * [descr:GridBase]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface GridBase {
    /**
     * [descr:GridBase.beginCustomLoading(messageText)]
     */
    beginCustomLoading(messageText: string): void;
    /**
     * [descr:GridBase.byKey(key)]
     */
    byKey(key: any | string | number): DevExpress.core.utils.DxPromise<any>;
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
    columnOption(
      id: number | string,
      optionName: string,
      optionValue: any
    ): void;
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
    deselectAll(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:GridBase.deselectRows(keys)]
     */
    deselectRows(keys: Array<any>): DevExpress.core.utils.DxPromise<any>;
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
    focus(): void;
    /**
     * [descr:GridBase.focus(element)]
     */
    focus(element: DevExpress.core.UserDefinedElement): void;
    /**
     * [descr:GridBase.getCellElement(rowIndex, dataField)]
     */
    getCellElement(
      rowIndex: number,
      dataField: string
    ): DevExpress.core.DxElement | undefined;
    /**
     * [descr:GridBase.getCellElement(rowIndex, visibleColumnIndex)]
     */
    getCellElement(
      rowIndex: number,
      visibleColumnIndex: number
    ): DevExpress.core.DxElement | undefined;
    /**
     * [descr:GridBase.getCombinedFilter()]
     */
    getCombinedFilter(): any;
    /**
     * [descr:GridBase.getCombinedFilter(returnDataField)]
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:GridBase.getKeyByRowIndex(rowIndex)]
     */
    getKeyByRowIndex(rowIndex: number): any;
    /**
     * [descr:GridBase.getRowElement(rowIndex)]
     */
    getRowElement(
      rowIndex: number
    ): DevExpress.core.UserDefinedElementsArray | undefined;
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
    pageIndex(newIndex: number): DevExpress.core.utils.DxPromise<void>;
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
    refresh(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:GridBase.refresh(changesOnly)]
     */
    refresh(changesOnly: boolean): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:GridBase.repaintRows(rowIndexes)]
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * [descr:GridBase.saveEditData()]
     */
    saveEditData(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:GridBase.searchByText(text)]
     */
    searchByText(text: string): void;
    /**
     * [descr:GridBase.selectAll()]
     */
    selectAll(): DevExpress.core.utils.DxPromise<void>;
    /**
     * [descr:GridBase.selectRows(keys, preserve)]
     */
    selectRows(
      keys: Array<any>,
      preserve: boolean
    ): DevExpress.core.utils.DxPromise<any>;
    /**
     * [descr:GridBase.selectRowsByIndexes(indexes)]
     */
    selectRowsByIndexes(
      indexes: Array<number>
    ): DevExpress.core.utils.DxPromise<any>;
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
   * @deprecated 
   */
  export type GridBaseColumn = DevExpress.ui.dxDataGrid.ColumnBase;
  /**
   * @deprecated 
   */
  export type GridBaseColumnButton = DevExpress.ui.dxDataGrid.ColumnButtonBase;
  /**
   * @deprecated 
   */
  export type GridBaseEditing = DevExpress.ui.dxDataGrid.EditingBase;
  /**
   * @deprecated 
   */
  export type GridBaseEditingTexts = DevExpress.ui.dxDataGrid.EditingTextsBase;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface GridBaseOptions<TComponent extends GridBase>
    extends WidgetOptions<TComponent> {
    /**
     * [descr:GridBaseOptions.allowColumnReordering]
     */
    allowColumnReordering?: boolean;
    /**
     * [descr:GridBaseOptions.allowColumnResizing]
     */
    allowColumnResizing?: boolean;
    /**
     * [descr:GridBaseOptions.autoNavigateToFocusedRow]
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * [descr:GridBaseOptions.cacheEnabled]
     */
    cacheEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.cellHintEnabled]
     */
    cellHintEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.columnAutoWidth]
     */
    columnAutoWidth?: boolean;
    /**
     * [descr:GridBaseOptions.columnChooser]
     */
    columnChooser?: DevExpress.ui.dxDataGrid.ColumnChooser;
    /**
     * [descr:GridBaseOptions.columnFixing]
     */
    columnFixing?: DevExpress.ui.dxDataGrid.ColumnFixing;
    /**
     * [descr:GridBaseOptions.columnHidingEnabled]
     */
    columnHidingEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.columnMinWidth]
     */
    columnMinWidth?: number;
    /**
     * [descr:GridBaseOptions.columnResizingMode]
     */
    columnResizingMode?: 'nextColumn' | 'widget';
    /**
     * [descr:GridBaseOptions.columnWidth]
     */
    columnWidth?: number;
    /**
     * [descr:GridBaseOptions.columns]
     */
    columns?: Array<DevExpress.ui.dxDataGrid.ColumnBase | string>;
    /**
     * [descr:GridBaseOptions.dataSource]
     */
    dataSource?:
      | string
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions;
    /**
     * [descr:GridBaseOptions.dateSerializationFormat]
     */
    dateSerializationFormat?: string;
    /**
     * [descr:GridBaseOptions.editing]
     */
    editing?: DevExpress.ui.dxDataGrid.EditingBase;
    /**
     * [descr:GridBaseOptions.errorRowEnabled]
     */
    errorRowEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.filterBuilder]
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * [descr:GridBaseOptions.filterBuilderPopup]
     */
    filterBuilderPopup?: DevExpress.ui.dxPopup.Properties;
    /**
     * [descr:GridBaseOptions.filterPanel]
     */
    filterPanel?: DevExpress.ui.dxDataGrid.FilterPanel<TComponent>;
    /**
     * [descr:GridBaseOptions.filterRow]
     */
    filterRow?: DevExpress.ui.dxDataGrid.FilterRow;
    /**
     * [descr:GridBaseOptions.filterSyncEnabled]
     */
    filterSyncEnabled?: boolean | 'auto';
    /**
     * [descr:GridBaseOptions.filterValue]
     */
    filterValue?: string | Array<any> | Function;
    /**
     * [descr:GridBaseOptions.focusedColumnIndex]
     */
    focusedColumnIndex?: number;
    /**
     * [descr:GridBaseOptions.focusedRowEnabled]
     */
    focusedRowEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.focusedRowIndex]
     */
    focusedRowIndex?: number;
    /**
     * [descr:GridBaseOptions.focusedRowKey]
     */
    focusedRowKey?: any;
    /**
     * [descr:GridBaseOptions.headerFilter]
     */
    headerFilter?: DevExpress.ui.dxDataGrid.HeaderFilter;
    /**
     * [descr:GridBaseOptions.highlightChanges]
     */
    highlightChanges?: boolean;
    /**
     * [descr:GridBaseOptions.keyboardNavigation]
     */
    keyboardNavigation?: DevExpress.ui.dxDataGrid.KeyboardNavigation;
    /**
     * [descr:GridBaseOptions.loadPanel]
     */
    loadPanel?: DevExpress.ui.dxDataGrid.LoadPanel;
    /**
     * [descr:GridBaseOptions.noDataText]
     */
    noDataText?: string;
    /**
     * [descr:GridBaseOptions.onAdaptiveDetailRowPreparing]
     */
    onAdaptiveDetailRowPreparing?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.AdaptiveDetailRowPreparingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onDataErrorOccurred]
     */
    onDataErrorOccurred?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.DataErrorOccurredInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onEditCanceled]
     */
    onEditCanceled?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.DataChangeInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onEditCanceling]
     */
    onEditCanceling?: (
      e: DevExpress.events.Cancelable &
        DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.DataChangeInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onInitNewRow]
     */
    onInitNewRow?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.NewRowInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onKeyDown]
     */
    onKeyDown?: (
      e: DevExpress.events.NativeEventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.KeyDownInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowCollapsed]
     */
    onRowCollapsed?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowKeyInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowCollapsing]
     */
    onRowCollapsing?: (
      e: DevExpress.events.Cancelable &
        DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowKeyInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowExpanded]
     */
    onRowExpanded?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowKeyInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowExpanding]
     */
    onRowExpanding?: (
      e: DevExpress.events.Cancelable &
        DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowKeyInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowInserted]
     */
    onRowInserted?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowInsertedInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowInserting]
     */
    onRowInserting?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowInsertingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowRemoved]
     */
    onRowRemoved?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowRemovedInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowRemoving]
     */
    onRowRemoving?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowRemovingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowUpdated]
     */
    onRowUpdated?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowUpdatedInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowUpdating]
     */
    onRowUpdating?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowUpdatingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onRowValidating]
     */
    onRowValidating?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.RowValidatingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onSaved]
     */
    onSaved?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.DataChangeInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onSaving]
     */
    onSaving?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.SavingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.SelectionChangedInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.onToolbarPreparing]
     */
    onToolbarPreparing?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.ui.dxDataGrid.ToolbarPreparingInfo
    ) => void;
    /**
     * [descr:GridBaseOptions.pager]
     */
    pager?: DevExpress.ui.dxDataGrid.Pager;
    /**
     * [descr:GridBaseOptions.paging]
     */
    paging?: DevExpress.ui.dxDataGrid.PagingBase;
    /**
     * [descr:GridBaseOptions.renderAsync]
     */
    renderAsync?: boolean;
    /**
     * [descr:GridBaseOptions.repaintChangesOnly]
     */
    repaintChangesOnly?: boolean;
    /**
     * [descr:GridBaseOptions.rowAlternationEnabled]
     */
    rowAlternationEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.rowDragging]
     */
    rowDragging?: DevExpress.ui.dxDataGrid.RowDragging<TComponent>;
    /**
     * [descr:GridBaseOptions.scrolling]
     */
    scrolling?: DevExpress.ui.dxDataGrid.ScrollingBase;
    /**
     * [descr:GridBaseOptions.searchPanel]
     */
    searchPanel?: DevExpress.ui.dxDataGrid.SearchPanel;
    /**
     * [descr:GridBaseOptions.selectedRowKeys]
     */
    selectedRowKeys?: Array<any>;
    /**
     * [descr:GridBaseOptions.selection]
     */
    selection?: DevExpress.ui.dxDataGrid.SelectionBase;
    /**
     * [descr:GridBaseOptions.showBorders]
     */
    showBorders?: boolean;
    /**
     * [descr:GridBaseOptions.showColumnHeaders]
     */
    showColumnHeaders?: boolean;
    /**
     * [descr:GridBaseOptions.showColumnLines]
     */
    showColumnLines?: boolean;
    /**
     * [descr:GridBaseOptions.showRowLines]
     */
    showRowLines?: boolean;
    /**
     * [descr:GridBaseOptions.sorting]
     */
    sorting?: DevExpress.ui.dxDataGrid.Sorting;
    /**
     * [descr:GridBaseOptions.stateStoring]
     */
    stateStoring?: DevExpress.ui.dxDataGrid.StateStoring;
    /**
     * [descr:GridBaseOptions.twoWayBindingEnabled]
     */
    twoWayBindingEnabled?: boolean;
    /**
     * [descr:GridBaseOptions.wordWrapEnabled]
     */
    wordWrapEnabled?: boolean;
  }
  /**
   * @deprecated 
   */
  export type GridBasePaging = DevExpress.ui.dxDataGrid.PagingBase;
  /**
   * @deprecated 
   */
  export type GridBaseScrolling = DevExpress.ui.dxDataGrid.ScrollingBase;
  /**
   * @deprecated 
   */
  export type GridBaseSelection = DevExpress.ui.dxDataGrid.SelectionBase;
  /**
   * [descr:HierarchicalCollectionWidget]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class HierarchicalCollectionWidget<
    TProperties
  > extends CollectionWidget<TProperties> {}
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface HierarchicalCollectionWidgetOptions<TComponent>
    extends CollectionWidgetOptions<TComponent> {
    /**
     * [descr:HierarchicalCollectionWidgetOptions.disabledExpr]
     */
    disabledExpr?: string | Function;
    /**
     * [descr:HierarchicalCollectionWidgetOptions.displayExpr]
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * [descr:HierarchicalCollectionWidgetOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:HierarchicalCollectionWidgetOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:HierarchicalCollectionWidgetOptions.itemsExpr]
     */
    itemsExpr?: string | Function;
    /**
     * [descr:HierarchicalCollectionWidgetOptions.keyExpr]
     */
    keyExpr?: string | Function;
    /**
     * [descr:HierarchicalCollectionWidgetOptions.selectedExpr]
     */
    selectedExpr?: string | Function;
  }
  export interface MapLocation {
    /**
     * [descr:MapLocation.lat]
     */
    lat: number;
    /**
     * [descr:MapLocation.lng]
     */
    lng: number;
  }
  /**
   * [descr:ui.notify(message,type,displayTime)]
   */
  export function notify(
    message: string,
    type?: string,
    displayTime?: number
  ): void;
  /**
   * [descr:ui.notify(options,type,displayTime)]
   */
  export function notify(
    options: any,
    type?: string,
    displayTime?: number
  ): void;
  /**
   * [descr:NumericRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'numeric';
  }
  /**
   * [descr:PatternRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'pattern';
  }
  /**
   * [descr:RangeRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'range';
  }
  /**
   * [descr:ui.repaintFloatingActionButton()]
   */
  export function repaintFloatingActionButton(): void;
  /**
   * [descr:RequiredRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'required';
  }
  /**
   * [descr:SearchBoxMixin]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class SearchBoxMixin {
    constructor(options?: SearchBoxMixinOptions);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface SearchBoxMixinOptions {
    /**
     * [descr:SearchBoxMixinOptions.searchEditorOptions]
     */
    searchEditorOptions?: DevExpress.ui.dxTextBox.Properties;
    /**
     * [descr:SearchBoxMixinOptions.searchEnabled]
     */
    searchEnabled?: boolean;
    /**
     * [descr:SearchBoxMixinOptions.searchExpr]
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * [descr:SearchBoxMixinOptions.searchMode]
     */
    searchMode?: 'contains' | 'startswith' | 'equals';
    /**
     * [descr:SearchBoxMixinOptions.searchTimeout]
     */
    searchTimeout?: number;
    /**
     * [descr:SearchBoxMixinOptions.searchValue]
     */
    searchValue?: string;
  }
  /**
   * [descr:StringLengthRule]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type: 'stringLength';
  }
  /**
   * [descr:ui.template]
   * @deprecated [depNote:ui.template]
   */
  export type Template = DevExpress.core.template;
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
     * [descr:ui.themes.ready(callback)]
     */
    static ready(callback: Function): void;
    /**
     * [descr:ui.themes.initialized(callback)]
     */
    static initialized(callback: Function): void;
    static isMaterial(theme: string): boolean;
  }
  export interface ValidationCallbackData {
    value?: string | number;
    rule: any;
    validator: any;
    data?: any;
    column?: any;
    formItem?: any;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type ValidationRule =
    | AsyncRule
    | CompareRule
    | CustomRule
    | EmailRule
    | NumericRule
    | PatternRule
    | RangeRule
    | RequiredRule
    | StringLengthRule;
  /**
   * [descr:Widget]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class Widget<TProperties> extends DOMComponent<TProperties> {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface WidgetOptions<TComponent>
    extends DOMComponentOptions<TComponent> {
    /**
     * [descr:WidgetOptions.accessKey]
     */
    accessKey?: string;
    /**
     * [descr:WidgetOptions.activeStateEnabled]
     */
    activeStateEnabled?: boolean;
    /**
     * [descr:WidgetOptions.disabled]
     */
    disabled?: boolean;
    /**
     * [descr:WidgetOptions.focusStateEnabled]
     */
    focusStateEnabled?: boolean;
    /**
     * [descr:WidgetOptions.hint]
     */
    hint?: string;
    /**
     * [descr:WidgetOptions.hoverStateEnabled]
     */
    hoverStateEnabled?: boolean;
    /**
     * [descr:WidgetOptions.onContentReady]
     */
    onContentReady?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:WidgetOptions.tabIndex]
     */
    tabIndex?: number;
    /**
     * [descr:WidgetOptions.visible]
     */
    visible?: boolean;
  }
}
declare module DevExpress.ui.dialog {
  /**
   * [descr:ui.dialog.alert(messageHtml,title)]
   */
  export function alert(
    messageHtml: string,
    title: string
  ): DevExpress.core.utils.DxPromise<void>;
  /**
   * [descr:ui.dialog.confirm(messageHtml,title)]
   */
  export function confirm(
    messageHtml: string,
    title: string
  ): DevExpress.core.utils.DxPromise<boolean>;
  /**
   * [descr:ui.dialog.custom(options)]
   */
  export function custom(options: CustomDialogOptions): any;
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
  export function initMobileViewport(options: {
    allowZoom?: boolean;
    allowPan?: boolean;
    allowSelection?: boolean;
  }): void;
  /**
   * [descr:utils.requestAnimationFrame(callback)]
   */
  export function requestAnimationFrame(callback: Function): number;
}
declare module DevExpress.viz {
  /**
   * [descr:BarGaugeBarInfo]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BarGaugeLegendItem extends BaseLegendItem {
    /**
     * [descr:BarGaugeLegendItem.item]
     */
    item?: BarGaugeBarInfo;
  }
  /**
   * [descr:BaseChart]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class BaseChart<TProperties> extends BaseWidget<TProperties> {
    /**
     * [descr:BaseChart.clearSelection()]
     */
    clearSelection(): void;
    /**
     * [descr:BaseChart.getAllSeries()]
     */
    getAllSeries(): Array<baseSeriesObject>;
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
    render(): void;
    /**
     * [descr:BaseChart.render(renderOptions)]
     */
    render(renderOptions: any): void;
  }
  module BaseChart {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface PointInteractionInfo {
      readonly target: basePointObject;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface TooltipInfo {
      target?: basePointObject | dxChartAnnotationConfig | any;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartAdaptiveLayout {
    /**
     * [descr:BaseChartOptions.adaptiveLayout.height]
     */
    height?: number;
    /**
     * [descr:BaseChartOptions.adaptiveLayout.keepLabels]
     */
    keepLabels?: boolean;
    /**
     * [descr:BaseChartOptions.adaptiveLayout.width]
     */
    width?: number;
  }
  /**
   * [descr:BaseChartAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartAnnotationConfig
    extends BaseWidgetAnnotationConfig {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartLegend extends BaseLegend {
    /**
     * [descr:BaseChartOptions.legend.customizeItems]
     */
    customizeItems?: (
      items: Array<BaseChartLegendItem>
    ) => Array<BaseChartLegendItem>;
    /**
     * [descr:BaseChartOptions.legend.markerTemplate]
     */
    markerTemplate?:
      | DevExpress.core.template
      | ((
          legendItem: BaseChartLegendItem,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
  }
  /**
   * [descr:BaseChartLegendItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartLegendItem extends BaseLegendItem {
    /**
     * [descr:BaseChartLegendItem.series]
     */
    series?: baseSeriesObject;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartOptions<TComponent>
    extends BaseWidgetOptions<TComponent> {
    /**
     * [descr:BaseChartOptions.adaptiveLayout]
     */
    adaptiveLayout?: BaseChartAdaptiveLayout;
    /**
     * [descr:BaseChartOptions.animation]
     */
    animation?:
      | {
          /**
           * [descr:BaseChartOptions.animation.duration]
           */
          duration?: number;
          /**
           * [descr:BaseChartOptions.animation.easing]
           */
          easing?: 'easeOutCubic' | 'linear';
          /**
           * [descr:BaseChartOptions.animation.enabled]
           */
          enabled?: boolean;
          /**
           * [descr:BaseChartOptions.animation.maxPointCountSupported]
           */
          maxPointCountSupported?: number;
        }
      | boolean;
    /**
     * [descr:BaseChartOptions.customizeLabel]
     */
    customizeLabel?: (pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel;
    /**
     * [descr:BaseChartOptions.customizePoint]
     */
    customizePoint?: (pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint;
    /**
     * [descr:BaseChartOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:BaseChartOptions.legend]
     */
    legend?: BaseChartLegend;
    /**
     * [descr:BaseChartOptions.onDone]
     */
    onDone?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:BaseChartOptions.onPointClick]
     */
    onPointClick?:
      | ((
          e: DevExpress.events.NativeEventInfo<TComponent> &
            DevExpress.viz.BaseChart.PointInteractionInfo
        ) => void)
      | string;
    /**
     * [descr:BaseChartOptions.onPointHoverChanged]
     */
    onPointHoverChanged?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseChart.PointInteractionInfo
    ) => void;
    /**
     * [descr:BaseChartOptions.onPointSelectionChanged]
     */
    onPointSelectionChanged?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseChart.PointInteractionInfo
    ) => void;
    /**
     * [descr:BaseChartOptions.onTooltipHidden]
     */
    onTooltipHidden?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseChart.TooltipInfo
    ) => void;
    /**
     * [descr:BaseChartOptions.onTooltipShown]
     */
    onTooltipShown?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseChart.TooltipInfo
    ) => void;
    /**
     * [descr:BaseChartOptions.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:BaseChartOptions.paletteExtensionMode]
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * [descr:BaseChartOptions.pointSelectionMode]
     */
    pointSelectionMode?: 'multiple' | 'single';
    /**
     * [descr:BaseChartOptions.series]
     */
    series?: any | Array<any>;
    /**
     * [descr:BaseChartOptions.tooltip]
     */
    tooltip?: BaseChartTooltip;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseChartTooltip extends BaseWidgetTooltip {
    /**
     * [descr:BaseChartOptions.tooltip.argumentFormat]
     */
    argumentFormat?: DevExpress.ui.format;
    /**
     * [descr:BaseChartOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          pointInfo: any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:BaseChartOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (pointInfo: any) => any;
    /**
     * [descr:BaseChartOptions.tooltip.shared]
     */
    shared?: boolean;
    /**
     * [descr:BaseChartOptions.tooltip.interactive]
     */
    interactive?: boolean;
  }
  /**
   * [descr:BaseGauge]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class BaseGauge<TProperties> extends BaseWidget<TProperties> {
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
  module BaseGauge {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type GaugeIndicatorType =
      | 'circle'
      | 'rangeBar'
      | 'rectangle'
      | 'rectangleNeedle'
      | 'rhombus'
      | 'textCloud'
      | 'triangleMarker'
      | 'triangleNeedle'
      | 'twoColorNeedle';
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface TooltipInfo {
      target: any;
    }
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeAnimation {
    /**
     * [descr:BaseGaugeOptions.animation.duration]
     */
    duration?: number;
    /**
     * [descr:BaseGaugeOptions.animation.easing]
     */
    easing?: 'easeOutCubic' | 'linear';
    /**
     * [descr:BaseGaugeOptions.animation.enabled]
     */
    enabled?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeLoadingIndicator
    extends BaseWidgetLoadingIndicator {
    /**
     * [descr:BaseGaugeOptions.loadingIndicator.enabled]
     */
    enabled?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeOptions<TComponent>
    extends BaseWidgetOptions<TComponent> {
    /**
     * [descr:BaseGaugeOptions.animation]
     */
    animation?: BaseGaugeAnimation;
    /**
     * [descr:BaseGaugeOptions.containerBackgroundColor]
     */
    containerBackgroundColor?: string;
    /**
     * [descr:BaseGaugeOptions.loadingIndicator]
     */
    loadingIndicator?: BaseGaugeLoadingIndicator;
    /**
     * [descr:BaseGaugeOptions.onTooltipHidden]
     */
    onTooltipHidden?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseGauge.TooltipInfo
    ) => void;
    /**
     * [descr:BaseGaugeOptions.onTooltipShown]
     */
    onTooltipShown?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseGauge.TooltipInfo
    ) => void;
    /**
     * [descr:BaseGaugeOptions.rangeContainer]
     */
    rangeContainer?: BaseGaugeRangeContainer;
    /**
     * [descr:BaseGaugeOptions.scale]
     */
    scale?: BaseGaugeScale;
    /**
     * [descr:BaseGaugeOptions.subvalues]
     */
    subvalues?: Array<number>;
    /**
     * [descr:BaseGaugeOptions.tooltip]
     */
    tooltip?: BaseGaugeTooltip;
    /**
     * [descr:BaseGaugeOptions.value]
     */
    value?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeRangeContainer {
    /**
     * [descr:BaseGaugeOptions.rangeContainer.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:BaseGaugeOptions.rangeContainer.offset]
     */
    offset?: number;
    /**
     * [descr:BaseGaugeOptions.rangeContainer.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:BaseGaugeOptions.rangeContainer.paletteExtensionMode]
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * [descr:BaseGaugeOptions.rangeContainer.ranges]
     */
    ranges?: Array<{
      /**
       * [descr:BaseGaugeOptions.rangeContainer.ranges.color]
       */
      color?: string;
      /**
       * [descr:BaseGaugeOptions.rangeContainer.ranges.endValue]
       */
      endValue?: number;
      /**
       * [descr:BaseGaugeOptions.rangeContainer.ranges.startValue]
       */
      startValue?: number;
    }>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeScale {
    /**
     * [descr:BaseGaugeOptions.scale.allowDecimals]
     */
    allowDecimals?: boolean;
    /**
     * [descr:BaseGaugeOptions.scale.customMinorTicks]
     */
    customMinorTicks?: Array<number>;
    /**
     * [descr:BaseGaugeOptions.scale.customTicks]
     */
    customTicks?: Array<number>;
    /**
     * [descr:BaseGaugeOptions.scale.endValue]
     */
    endValue?: number;
    /**
     * [descr:BaseGaugeOptions.scale.label]
     */
    label?: BaseGaugeScaleLabel;
    /**
     * [descr:BaseGaugeOptions.scale.minorTick]
     */
    minorTick?: {
      /**
       * [descr:BaseGaugeOptions.scale.minorTick.color]
       */
      color?: string;
      /**
       * [descr:BaseGaugeOptions.scale.minorTick.length]
       */
      length?: number;
      /**
       * [descr:BaseGaugeOptions.scale.minorTick.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseGaugeOptions.scale.minorTick.visible]
       */
      visible?: boolean;
      /**
       * [descr:BaseGaugeOptions.scale.minorTick.width]
       */
      width?: number;
    };
    /**
     * [descr:BaseGaugeOptions.scale.minorTickInterval]
     */
    minorTickInterval?: number;
    /**
     * [descr:BaseGaugeOptions.scale.scaleDivisionFactor]
     */
    scaleDivisionFactor?: number;
    /**
     * [descr:BaseGaugeOptions.scale.startValue]
     */
    startValue?: number;
    /**
     * [descr:BaseGaugeOptions.scale.tick]
     */
    tick?: {
      /**
       * [descr:BaseGaugeOptions.scale.tick.color]
       */
      color?: string;
      /**
       * [descr:BaseGaugeOptions.scale.tick.length]
       */
      length?: number;
      /**
       * [descr:BaseGaugeOptions.scale.tick.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseGaugeOptions.scale.tick.visible]
       */
      visible?: boolean;
      /**
       * [descr:BaseGaugeOptions.scale.tick.width]
       */
      width?: number;
    };
    /**
     * [descr:BaseGaugeOptions.scale.tickInterval]
     */
    tickInterval?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeScaleLabel {
    /**
     * [descr:BaseGaugeOptions.scale.label.customizeText]
     */
    customizeText?: (scaleValue: {
      value?: number;
      valueText?: string;
    }) => string;
    /**
     * [descr:BaseGaugeOptions.scale.label.font]
     */
    font?: Font;
    /**
     * [descr:BaseGaugeOptions.scale.label.format]
     */
    format?: DevExpress.ui.format;
    /**
     * [descr:BaseGaugeOptions.scale.label.overlappingBehavior]
     */
    overlappingBehavior?: 'hide' | 'none';
    /**
     * [descr:BaseGaugeOptions.scale.label.useRangeColors]
     */
    useRangeColors?: boolean;
    /**
     * [descr:BaseGaugeOptions.scale.label.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseGaugeTooltip extends BaseWidgetTooltip {
    /**
     * [descr:BaseGaugeOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          scaleValue: { value?: number; valueText?: string },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:BaseGaugeOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (scaleValue: {
      value?: number;
      valueText?: string;
    }) => any;
    /**
     * [descr:BaseGaugeOptions.tooltip.interactive]
     */
    interactive?: boolean;
  }
  /**
   * [descr:baseLabelObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface baseLabelObject {
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
   * [descr:BaseLegend]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseLegend {
    /**
     * [descr:BaseLegend.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:BaseLegend.border]
     */
    border?: {
      /**
       * [descr:BaseLegend.border.color]
       */
      color?: string;
      /**
       * [descr:BaseLegend.border.cornerRadius]
       */
      cornerRadius?: number;
      /**
       * [descr:BaseLegend.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:BaseLegend.border.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseLegend.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:BaseLegend.border.width]
       */
      width?: number;
    };
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
    margin?:
      | number
      | {
          /**
           * [descr:BaseLegend.margin.bottom]
           */
          bottom?: number;
          /**
           * [descr:BaseLegend.margin.left]
           */
          left?: number;
          /**
           * [descr:BaseLegend.margin.right]
           */
          right?: number;
          /**
           * [descr:BaseLegend.margin.top]
           */
          top?: number;
        };
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
    title?:
      | {
          /**
           * [descr:BaseLegend.title.font]
           */
          font?: Font;
          /**
           * [descr:BaseLegend.title.horizontalAlignment]
           */
          horizontalAlignment?: 'center' | 'left' | 'right';
          /**
           * [descr:BaseLegend.title.margin]
           */
          margin?: {
            /**
             * [descr:BaseLegend.title.margin.bottom]
             */
            bottom?: number;
            /**
             * [descr:BaseLegend.title.margin.left]
             */
            left?: number;
            /**
             * [descr:BaseLegend.title.margin.right]
             */
            right?: number;
            /**
             * [descr:BaseLegend.title.margin.top]
             */
            top?: number;
          };
          /**
           * [descr:BaseLegend.title.placeholderSize]
           */
          placeholderSize?: number;
          /**
           * [descr:BaseLegend.title.subtitle]
           */
          subtitle?:
            | {
                /**
                 * [descr:BaseLegend.title.subtitle.font]
                 */
                font?: Font;
                /**
                 * [descr:BaseLegend.title.subtitle.offset]
                 */
                offset?: number;
                /**
                 * [descr:BaseLegend.title.subtitle.text]
                 */
                text?: string;
              }
            | string;
          /**
           * [descr:BaseLegend.title.text]
           */
          text?: string;
          /**
           * [descr:BaseLegend.title.verticalAlignment]
           */
          verticalAlignment?: 'bottom' | 'top';
        }
      | string;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseLegendItem {
    /**
     * [descr:BaseLegendItem.marker]
     */
    marker?: {
      /**
       * [descr:BaseLegendItem.marker.fill]
       */
      fill?: string;
      /**
       * [descr:BaseLegendItem.marker.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseLegendItem.marker.size]
       */
      size?: number;
      /**
       * [descr:BaseLegendItem.marker.state]
       */
      state?: 'normal' | 'hovered' | 'selected';
    };
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
   * [descr:basePointObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface basePointObject {
    /**
     * [descr:basePointObject.clearHover()]
     */
    clearHover(): void;
    /**
     * [descr:basePointObject.clearSelection()]
     */
    clearSelection(): void;
    /**
     * [descr:basePointObject.data]
     */
    data?: any;
    /**
     * [descr:basePointObject.fullState]
     */
    fullState?: number;
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
     * [descr:basePointObject.originalArgument]
     */
    originalArgument?: string | number | Date;
    /**
     * [descr:basePointObject.originalValue]
     */
    originalValue?: string | number | Date;
    /**
     * [descr:basePointObject.select()]
     */
    select(): void;
    /**
     * [descr:basePointObject.series]
     */
    series?: any;
    /**
     * [descr:basePointObject.showTooltip()]
     */
    showTooltip(): void;
    /**
     * [descr:basePointObject.tag]
     */
    tag?: any;
  }
  /**
   * [descr:baseSeriesObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface baseSeriesObject {
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
     * [descr:baseSeriesObject.fullState]
     */
    fullState?: number;
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
     * [descr:baseSeriesObject.name]
     */
    name?: any;
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
    /**
     * [descr:baseSeriesObject.tag]
     */
    tag?: any;
    /**
     * [descr:baseSeriesObject.type]
     */
    type?: string;
  }
  /**
   * [descr:BaseSparkline]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class BaseSparkline<TProperties> extends BaseWidget<TProperties> {
    /**
     * [descr:BaseSparkline.hideLoadingIndicator()]
     */
    hideLoadingIndicator(): void;
    /**
     * [descr:BaseSparkline.showLoadingIndicator()]
     */
    showLoadingIndicator(): void;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseSparklineOptions<TComponent>
    extends BaseWidgetOptions<TComponent> {
    /**
     * [descr:BaseSparklineOptions.export]
     */
    export?: BaseWidgetExport;
    /**
     * [descr:BaseSparklineOptions.loadingIndicator]
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * [descr:BaseSparklineOptions.onTooltipHidden]
     */
    onTooltipHidden?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:BaseSparklineOptions.onTooltipShown]
     */
    onTooltipShown?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:BaseSparklineOptions.redrawOnResize]
     */
    redrawOnResize?: boolean;
    /**
     * [descr:BaseSparklineOptions.title]
     */
    title?: BaseWidgetTitle | string;
    /**
     * [descr:BaseSparklineOptions.tooltip]
     */
    tooltip?: BaseSparklineTooltip;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * [descr:BaseSparklineOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          pointsInfo: any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:BaseSparklineOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (pointsInfo: any) => any;
    /**
     * [descr:BaseSparklineOptions.tooltip.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:BaseSparklineOptions.tooltip.interactive]
     */
    interactive?: boolean;
  }
  /**
   * [descr:BaseWidget]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export class BaseWidget<TProperties> extends DOMComponent<TProperties> {
    /**
     * [descr:BaseWidget.defaultOptions(rule)]
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    static defaultOptions(rule: {
      device?: Device | Array<Device> | Function;
      options?: any;
    }): void;
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
  module BaseWidget {
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface ExportInfo {
      readonly fileName: string;
      readonly format: string;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface FileSavingEventInfo<T> {
      readonly component: T;
      readonly element: DevExpress.core.DxElement;
      readonly fileName: string;
      readonly format: string;
      readonly data: Blob;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface IncidentInfo {
      readonly target: any;
    }
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type VizTextOverflowType = 'ellipsis' | 'hide' | 'none';
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type WordWrapType = 'normal' | 'breakWord' | 'none';
  }
  /**
   * [descr:BaseWidgetAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    border?: {
      /**
       * [descr:BaseWidgetAnnotationConfig.border.color]
       */
      color?: string;
      /**
       * [descr:BaseWidgetAnnotationConfig.border.cornerRadius]
       */
      cornerRadius?: number;
      /**
       * [descr:BaseWidgetAnnotationConfig.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:BaseWidgetAnnotationConfig.border.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseWidgetAnnotationConfig.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:BaseWidgetAnnotationConfig.border.width]
       */
      width?: number;
    };
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
    image?:
      | string
      | {
          /**
           * [descr:BaseWidgetAnnotationConfig.image.height]
           */
          height?: number;
          /**
           * [descr:BaseWidgetAnnotationConfig.image.url]
           */
          url?: string;
          /**
           * [descr:BaseWidgetAnnotationConfig.image.width]
           */
          width?: number;
        };
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
    shadow?: {
      /**
       * [descr:BaseWidgetAnnotationConfig.shadow.blur]
       */
      blur?: number;
      /**
       * [descr:BaseWidgetAnnotationConfig.shadow.color]
       */
      color?: string;
      /**
       * [descr:BaseWidgetAnnotationConfig.shadow.offsetX]
       */
      offsetX?: number;
      /**
       * [descr:BaseWidgetAnnotationConfig.shadow.offsetY]
       */
      offsetY?: number;
      /**
       * [descr:BaseWidgetAnnotationConfig.shadow.opacity]
       */
      opacity?: number;
    };
    /**
     * [descr:BaseWidgetAnnotationConfig.text]
     */
    text?: string;
    /**
     * [descr:BaseWidgetAnnotationConfig.textOverflow]
     */
    textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
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
    wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetExport {
    /**
     * [descr:BaseWidgetOptions.export.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:BaseWidgetOptions.export.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.export.fileName]
     */
    fileName?: string;
    /**
     * [descr:BaseWidgetOptions.export.formats]
     */
    formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
    /**
     * [descr:BaseWidgetOptions.export.margin]
     */
    margin?: number;
    /**
     * [descr:BaseWidgetOptions.export.printingEnabled]
     */
    printingEnabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.export.proxyUrl]
     * @deprecated [depNote:BaseWidgetOptions.export.proxyUrl]
     */
    proxyUrl?: string;
    /**
     * [descr:BaseWidgetOptions.export.svgToCanvas]
     */
    svgToCanvas?: (
      svg: SVGElement,
      canvas: HTMLCanvasElement
    ) => PromiseLike<void>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetLoadingIndicator {
    /**
     * [descr:BaseWidgetOptions.loadingIndicator.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:BaseWidgetOptions.loadingIndicator.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.loadingIndicator.font]
     */
    font?: Font;
    /**
     * [descr:BaseWidgetOptions.loadingIndicator.show]
     */
    show?: boolean;
    /**
     * [descr:BaseWidgetOptions.loadingIndicator.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetMargin {
    /**
     * [descr:BaseWidgetOptions.margin.bottom]
     */
    bottom?: number;
    /**
     * [descr:BaseWidgetOptions.margin.left]
     */
    left?: number;
    /**
     * [descr:BaseWidgetOptions.margin.right]
     */
    right?: number;
    /**
     * [descr:BaseWidgetOptions.margin.top]
     */
    top?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetOptions<TComponent>
    extends DOMComponentOptions<TComponent> {
    /**
     * [descr:BaseWidgetOptions.disabled]
     */
    disabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.export]
     */
    export?: BaseWidgetExport;
    /**
     * [descr:BaseWidgetOptions.height]
     */
    height?: number | string | (() => number | string);
    /**
     * [descr:BaseWidgetOptions.loadingIndicator]
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * [descr:BaseWidgetOptions.margin]
     */
    margin?: BaseWidgetMargin;
    /**
     * [descr:BaseWidgetOptions.onDrawn]
     */
    onDrawn?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:BaseWidgetOptions.onExported]
     */
    onExported?: (e: DevExpress.events.EventInfo<TComponent>) => void;
    /**
     * [descr:BaseWidgetOptions.onExporting]
     */
    onExporting?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseWidget.ExportInfo
    ) => void;
    /**
     * [descr:BaseWidgetOptions.onFileSaving]
     */
    onFileSaving?: (
      e: DevExpress.viz.BaseWidget.FileSavingEventInfo<TComponent>
    ) => void;
    /**
     * [descr:BaseWidgetOptions.onIncidentOccurred]
     */
    onIncidentOccurred?: (
      e: DevExpress.events.EventInfo<TComponent> &
        DevExpress.viz.BaseWidget.IncidentInfo
    ) => void;
    /**
     * [descr:BaseWidgetOptions.pathModified]
     */
    pathModified?: boolean;
    /**
     * [descr:BaseWidgetOptions.redrawOnResize]
     */
    redrawOnResize?: boolean;
    /**
     * [descr:BaseWidgetOptions.rtlEnabled]
     */
    rtlEnabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.size]
     */
    size?: BaseWidgetSize;
    /**
     * [descr:BaseWidgetOptions.theme]
     */
    theme?:
      | 'generic.dark'
      | 'generic.light'
      | 'generic.contrast'
      | 'generic.carmine'
      | 'generic.darkmoon'
      | 'generic.darkviolet'
      | 'generic.greenmist'
      | 'generic.softblue'
      | 'material.blue.light'
      | 'material.lime.light'
      | 'material.orange.light'
      | 'material.purple.light'
      | 'material.teal.light';
    /**
     * [descr:BaseWidgetOptions.title]
     */
    title?: BaseWidgetTitle | string;
    /**
     * [descr:BaseWidgetOptions.tooltip]
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * [descr:BaseWidgetOptions.width]
     */
    width?: number | string | (() => number | string);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetSize {
    /**
     * [descr:BaseWidgetOptions.size.height]
     */
    height?: number;
    /**
     * [descr:BaseWidgetOptions.size.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetTitle {
    /**
     * [descr:BaseWidgetOptions.title.font]
     */
    font?: Font;
    /**
     * [descr:BaseWidgetOptions.title.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:BaseWidgetOptions.title.margin]
     */
    margin?:
      | number
      | {
          /**
           * [descr:BaseWidgetOptions.title.margin.bottom]
           */
          bottom?: number;
          /**
           * [descr:BaseWidgetOptions.title.margin.left]
           */
          left?: number;
          /**
           * [descr:BaseWidgetOptions.title.margin.right]
           */
          right?: number;
          /**
           * [descr:BaseWidgetOptions.title.margin.top]
           */
          top?: number;
        };
    /**
     * [descr:BaseWidgetOptions.title.placeholderSize]
     */
    placeholderSize?: number;
    /**
     * [descr:BaseWidgetOptions.title.subtitle]
     */
    subtitle?:
      | {
          /**
           * [descr:BaseWidgetOptions.title.subtitle.font]
           */
          font?: Font;
          /**
           * [descr:BaseWidgetOptions.title.subtitle.offset]
           */
          offset?: number;
          /**
           * [descr:BaseWidgetOptions.title.subtitle.text]
           */
          text?: string;
          /**
           * [descr:BaseWidgetOptions.title.subtitle.textOverflow]
           */
          textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
          /**
           * [descr:BaseWidgetOptions.title.subtitle.wordWrap]
           */
          wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
        }
      | string;
    /**
     * [descr:BaseWidgetOptions.title.text]
     */
    text?: string;
    /**
     * [descr:BaseWidgetOptions.title.textOverflow]
     */
    textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
    /**
     * [descr:BaseWidgetOptions.title.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'top';
    /**
     * [descr:BaseWidgetOptions.title.wordWrap]
     */
    wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface BaseWidgetTooltip {
    /**
     * [descr:BaseWidgetOptions.tooltip.arrowLength]
     */
    arrowLength?: number;
    /**
     * [descr:BaseWidgetOptions.tooltip.border]
     */
    border?: {
      /**
       * [descr:BaseWidgetOptions.tooltip.border.color]
       */
      color?: string;
      /**
       * [descr:BaseWidgetOptions.tooltip.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:BaseWidgetOptions.tooltip.border.opacity]
       */
      opacity?: number;
      /**
       * [descr:BaseWidgetOptions.tooltip.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:BaseWidgetOptions.tooltip.border.width]
       */
      width?: number;
    };
    /**
     * [descr:BaseWidgetOptions.tooltip.color]
     */
    color?: string;
    /**
     * [descr:BaseWidgetOptions.tooltip.container]
     */
    container?: string | DevExpress.core.UserDefinedElement;
    /**
     * [descr:BaseWidgetOptions.tooltip.cornerRadius]
     */
    cornerRadius?: number;
    /**
     * [descr:BaseWidgetOptions.tooltip.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:BaseWidgetOptions.tooltip.font]
     */
    font?: Font;
    /**
     * [descr:BaseWidgetOptions.tooltip.format]
     */
    format?: DevExpress.ui.format;
    /**
     * [descr:BaseWidgetOptions.tooltip.opacity]
     */
    opacity?: number;
    /**
     * [descr:BaseWidgetOptions.tooltip.paddingLeftRight]
     */
    paddingLeftRight?: number;
    /**
     * [descr:BaseWidgetOptions.tooltip.paddingTopBottom]
     */
    paddingTopBottom?: number;
    /**
     * [descr:BaseWidgetOptions.tooltip.shadow]
     */
    shadow?: {
      /**
       * [descr:BaseWidgetOptions.tooltip.shadow.blur]
       */
      blur?: number;
      /**
       * [descr:BaseWidgetOptions.tooltip.shadow.color]
       */
      color?: string;
      /**
       * [descr:BaseWidgetOptions.tooltip.shadow.offsetX]
       */
      offsetX?: number;
      /**
       * [descr:BaseWidgetOptions.tooltip.shadow.offsetY]
       */
      offsetY?: number;
      /**
       * [descr:BaseWidgetOptions.tooltip.shadow.opacity]
       */
      opacity?: number;
    };
    /**
     * [descr:BaseWidgetOptions.tooltip.zIndex]
     */
    zIndex?: number;
  }
  /**
   * [descr:chartAxisObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface chartAxisObject {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface chartPointObject extends basePointObject {
    /**
     * [descr:chartPointObject.aggregationInfo]
     */
    aggregationInfo?: chartPointAggregationInfoObject;
    /**
     * [descr:chartPointObject.getBoundingRect()]
     */
    getBoundingRect(): any;
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
  }
  /**
   * [descr:ChartSeries]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    type?: ChartSeriesType;
  }
  /**
   * [descr:chartSeriesObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface chartSeriesObject extends baseSeriesObject {
    /**
     * [descr:chartSeriesObject.axis]
     */
    axis?: string;
    /**
     * [descr:chartSeriesObject.barOverlapGroup]
     */
    barOverlapGroup?: string;
    /**
     * [descr:chartSeriesObject.getArgumentAxis()]
     */
    getArgumentAxis(): chartAxisObject;
    /**
     * [descr:chartSeriesObject.getValueAxis()]
     */
    getValueAxis(): chartAxisObject;
    /**
     * [descr:chartSeriesObject.pane]
     */
    pane?: string;
    /**
     * [descr:chartSeriesObject.stack]
     */
    stack?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type ChartSeriesType =
    | 'area'
    | 'bar'
    | 'bubble'
    | 'candlestick'
    | 'fullstackedarea'
    | 'fullstackedbar'
    | 'fullstackedline'
    | 'fullstackedspline'
    | 'fullstackedsplinearea'
    | 'line'
    | 'rangearea'
    | 'rangebar'
    | 'scatter'
    | 'spline'
    | 'splinearea'
    | 'stackedarea'
    | 'stackedbar'
    | 'stackedline'
    | 'stackedspline'
    | 'stackedsplinearea'
    | 'steparea'
    | 'stepline'
    | 'stock';
  /**
   * [descr:CommonIndicator]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    palette?: Array<string> | PaletteType;
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
    text?: {
      /**
       * [descr:CommonIndicator.text.customizeText]
       */
      customizeText?: (indicatedValue: {
        value?: number;
        valueText?: string;
      }) => string;
      /**
       * [descr:CommonIndicator.text.font]
       */
      font?: Font;
      /**
       * [descr:CommonIndicator.text.format]
       */
      format?: DevExpress.ui.format;
      /**
       * [descr:CommonIndicator.text.indent]
       */
      indent?: number;
    };
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
   * [descr:viz.currentPalette()]
   */
  export function currentPalette(): string;
  /**
   * [descr:viz.currentPalette(paletteName)]
   */
  export function currentPalette(paletteName: string): void;
  /**
   * [descr:viz.currentTheme()]
   */
  export function currentTheme(): string;
  /**
   * [descr:viz.currentTheme(platform, colorScheme)]
   */
  export function currentTheme(platform: string, colorScheme: string): void;
  /**
   * [descr:viz.currentTheme(theme)]
   */
  export function currentTheme(theme: string): void;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type DashStyleType = 'dash' | 'dot' | 'longDash' | 'solid';
  /**
   * [descr:dxBarGauge]
   */
  export class dxBarGauge extends BaseWidget<dxBarGaugeOptions> {
    /**
     * [descr:dxBarGauge.values()]
     */
    values(): Array<number>;
    /**
     * [descr:dxBarGauge.values(newValues)]
     */
    values(values: Array<number>): void;
  }
  module dxBarGauge {
    export type DisposingEvent = DevExpress.events.EventInfo<dxBarGauge>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxBarGauge>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxBarGauge>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxBarGauge> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxBarGauge>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxBarGauge> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxBarGauge>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxBarGauge> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxBarGaugeOptions;
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxBarGauge> &
      TooltipInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface TooltipInfo {
      target?: any;
    }
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxBarGauge> &
      TooltipInfo;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBarGaugeLegend extends BaseLegend {
    /**
     * [descr:dxBarGaugeOptions.legend.customizeHint]
     */
    customizeHint?: (arg: { item?: BarGaugeBarInfo; text?: string }) => string;
    /**
     * [descr:dxBarGaugeOptions.legend.customizeItems]
     */
    customizeItems?: (
      items: Array<BarGaugeLegendItem>
    ) => Array<BarGaugeLegendItem>;
    /**
     * [descr:dxBarGaugeOptions.legend.customizeText]
     */
    customizeText?: (arg: { item?: BarGaugeBarInfo; text?: string }) => string;
    /**
     * [descr:dxBarGaugeOptions.legend.itemTextFormat]
     */
    itemTextFormat?: DevExpress.ui.format;
    /**
     * [descr:dxBarGaugeOptions.legend.markerTemplate]
     */
    markerTemplate?:
      | DevExpress.core.template
      | ((
          legendItem: BarGaugeLegendItem,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxBarGaugeOptions.legend.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBarGaugeLoadingIndicator
    extends BaseWidgetLoadingIndicator {
    /**
     * [descr:dxBarGaugeOptions.loadingIndicator.enabled]
     */
    enabled?: boolean;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
    /**
     * [descr:dxBarGaugeOptions.animation]
     */
    animation?: any;
    /**
     * [descr:dxBarGaugeOptions.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:dxBarGaugeOptions.barSpacing]
     */
    barSpacing?: number;
    /**
     * [descr:dxBarGaugeOptions.baseValue]
     */
    baseValue?: number;
    /**
     * [descr:dxBarGaugeOptions.endValue]
     */
    endValue?: number;
    /**
     * [descr:dxBarGaugeOptions.geometry]
     */
    geometry?: {
      /**
       * [descr:dxBarGaugeOptions.geometry.endAngle]
       */
      endAngle?: number;
      /**
       * [descr:dxBarGaugeOptions.geometry.startAngle]
       */
      startAngle?: number;
    };
    /**
     * [descr:dxBarGaugeOptions.label]
     */
    label?: {
      /**
       * [descr:dxBarGaugeOptions.label.connectorColor]
       */
      connectorColor?: string;
      /**
       * [descr:dxBarGaugeOptions.label.connectorWidth]
       */
      connectorWidth?: number;
      /**
       * [descr:dxBarGaugeOptions.label.customizeText]
       */
      customizeText?: (barValue: {
        value?: number;
        valueText?: string;
      }) => string;
      /**
       * [descr:dxBarGaugeOptions.label.font]
       */
      font?: Font;
      /**
       * [descr:dxBarGaugeOptions.label.format]
       */
      format?: DevExpress.ui.format;
      /**
       * [descr:dxBarGaugeOptions.label.indent]
       */
      indent?: number;
      /**
       * [descr:dxBarGaugeOptions.label.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxBarGaugeOptions.legend]
     */
    legend?: dxBarGaugeLegend;
    /**
     * [descr:dxBarGaugeOptions.loadingIndicator]
     */
    loadingIndicator?: dxBarGaugeLoadingIndicator;
    /**
     * [descr:dxBarGaugeOptions.onTooltipHidden]
     */
    onTooltipHidden?: (e: DevExpress.viz.dxBarGauge.TooltipHiddenEvent) => void;
    /**
     * [descr:dxBarGaugeOptions.onTooltipShown]
     */
    onTooltipShown?: (e: DevExpress.viz.dxBarGauge.TooltipShownEvent) => void;
    /**
     * [descr:dxBarGaugeOptions.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:dxBarGaugeOptions.paletteExtensionMode]
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * [descr:dxBarGaugeOptions.relativeInnerRadius]
     */
    relativeInnerRadius?: number;
    /**
     * [descr:dxBarGaugeOptions.resolveLabelOverlapping]
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * [descr:dxBarGaugeOptions.startValue]
     */
    startValue?: number;
    /**
     * [descr:dxBarGaugeOptions.tooltip]
     */
    tooltip?: dxBarGaugeTooltip;
    /**
     * [descr:dxBarGaugeOptions.values]
     */
    values?: Array<number>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
    /**
     * [descr:dxBarGaugeOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          scaleValue: { value?: number; valueText?: string; index?: number },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxBarGaugeOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (scaleValue: {
      value?: number;
      valueText?: string;
      index?: number;
    }) => any;
    /**
     * [descr:dxBarGaugeOptions.tooltip.interactive]
     */
    interactive?: boolean;
  }
  /**
   * [descr:dxBullet]
   */
  export class dxBullet extends BaseSparkline<dxBulletOptions> {}
  module dxBullet {
    export type DisposingEvent = DevExpress.events.EventInfo<dxBullet>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxBullet>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxBullet>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxBullet> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxBullet>;
    export type IncidentOccurredEvent = DevExpress.events.EventInfo<dxBullet> &
      DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxBullet>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxBullet> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxBulletOptions;
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxBullet>;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxBullet>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
    /**
     * [descr:dxBulletOptions.color]
     */
    color?: string;
    /**
     * [descr:dxBulletOptions.endScaleValue]
     */
    endScaleValue?: number;
    /**
     * [descr:dxBulletOptions.showTarget]
     */
    showTarget?: boolean;
    /**
     * [descr:dxBulletOptions.showZeroLevel]
     */
    showZeroLevel?: boolean;
    /**
     * [descr:dxBulletOptions.startScaleValue]
     */
    startScaleValue?: number;
    /**
     * [descr:dxBulletOptions.target]
     */
    target?: number;
    /**
     * [descr:dxBulletOptions.targetColor]
     */
    targetColor?: string;
    /**
     * [descr:dxBulletOptions.targetWidth]
     */
    targetWidth?: number;
    /**
     * [descr:dxBulletOptions.value]
     */
    value?: number;
  }
  /**
   * [descr:dxChart]
   */
  export class dxChart extends BaseChart<dxChartOptions> {
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
    zoomArgument(
      startValue: number | Date | string,
      endValue: number | Date | string
    ): void;
  }
  module dxChart {
    export type ArgumentAxisClickEvent =
      DevExpress.events.NativeEventInfo<dxChart> & {
        readonly argument: Date | number | string;
      };
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type ChartSingleValueSeriesAggregationMethodType =
      | 'avg'
      | 'count'
      | 'max'
      | 'min'
      | 'sum'
      | 'custom';
    export type DisposingEvent = DevExpress.events.EventInfo<dxChart>;
    export type DoneEvent = DevExpress.events.EventInfo<dxChart>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxChart>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxChart>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxChart>;
    export type IncidentOccurredEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxChart>;
    export type LegendClickEvent =
      DevExpress.events.NativeEventInfo<dxChart> & {
        readonly target: chartSeriesObject;
      };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.events.ChangedOptionInfo;
    export type PointClickEvent = DevExpress.events.NativeEventInfo<dxChart> &
      DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointHoverChangedEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointSelectionChangedEvent =
      DevExpress.events.EventInfo<dxChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type Properties = dxChartOptions;
    export type SeriesClickEvent =
      DevExpress.events.NativeEventInfo<dxChart> & {
        readonly target: chartSeriesObject;
      };
    export type SeriesHoverChangedEvent = DevExpress.events.EventInfo<dxChart> &
      SeriesInteractionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface SeriesInteractionInfo {
      target: chartSeriesObject;
    }
    export type SeriesSelectionChangedEvent =
      DevExpress.events.EventInfo<dxChart> & SeriesInteractionInfo;
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
    export type ZoomEndEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxChart> & {
        readonly rangeStart: Date | number;
        readonly rangeEnd: Date | number;
        readonly axis: chartAxisObject;
        readonly range: VizRange;
        readonly previousRange: VizRange;
        readonly actionType: 'zoom' | 'pan';
        readonly zoomFactor: number;
        readonly shift: number;
      };
    export type ZoomStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxChart> & {
        readonly axis: chartAxisObject;
        readonly range: VizRange;
        readonly actionType?: 'zoom' | 'pan';
      };
  }
  /**
   * [descr:dxChartAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartAnnotationConfig
    extends dxChartCommonAnnotationConfig {
    /**
     * [descr:dxChartAnnotationConfig.name]
     */
    name?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
    /**
     * [descr:dxChartOptions.argumentAxis.aggregateByCategory]
     */
    aggregateByCategory?: boolean;
    /**
     * [descr:dxChartOptions.argumentAxis.aggregationGroupWidth]
     */
    aggregationGroupWidth?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.aggregationInterval]
     */
    aggregationInterval?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.argumentAxis.argumentType]
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * [descr:dxChartOptions.argumentAxis.axisDivisionFactor]
     */
    axisDivisionFactor?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.breaks]
     */
    breaks?: Array<ScaleBreak>;
    /**
     * [descr:dxChartOptions.argumentAxis.categories]
     */
    categories?: Array<number | string | Date>;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLineStyle]
     */
    constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines]
     */
    constantLines?: Array<dxChartArgumentAxisConstantLines>;
    /**
     * [descr:dxChartOptions.argumentAxis.endOnTick]
     */
    endOnTick?: boolean;
    /**
     * [descr:dxChartOptions.argumentAxis.holidays]
     */
    holidays?: Array<Date | string> | Array<number>;
    /**
     * [descr:dxChartOptions.argumentAxis.hoverMode]
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * [descr:dxChartOptions.argumentAxis.label]
     */
    label?: dxChartArgumentAxisLabel;
    /**
     * [descr:dxChartOptions.argumentAxis.linearThreshold]
     */
    linearThreshold?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.logarithmBase]
     */
    logarithmBase?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.minVisualRangeLength]
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.argumentAxis.minorTickCount]
     */
    minorTickCount?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.minorTickInterval]
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.argumentAxis.position]
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * [descr:dxChartOptions.argumentAxis.customPosition]
     */
    customPosition?: number | Date | string;
    /**
     * [descr:dxChartOptions.argumentAxis.customPositionAxis]
     */
    customPositionAxis?: string;
    /**
     * [descr:dxChartOptions.argumentAxis.offset]
     */
    offset?: number;
    /**
     * [descr:dxChartOptions.argumentAxis.singleWorkdays]
     */
    singleWorkdays?: Array<Date | string> | Array<number>;
    /**
     * [descr:dxChartOptions.argumentAxis.strips]
     */
    strips?: Array<dxChartArgumentAxisStrips>;
    /**
     * [descr:dxChartOptions.argumentAxis.tickInterval]
     */
    tickInterval?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.argumentAxis.title]
     */
    title?: dxChartArgumentAxisTitle;
    /**
     * [descr:dxChartOptions.argumentAxis.type]
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * [descr:dxChartOptions.argumentAxis.visualRange]
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * [descr:dxChartOptions.argumentAxis.visualRangeUpdateMode]
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * [descr:dxChartOptions.argumentAxis.wholeRange]
     */
    wholeRange?: VizRange | Array<number | string | Date>;
    /**
     * [descr:dxChartOptions.argumentAxis.workWeek]
     */
    workWeek?: Array<number>;
    /**
     * [descr:dxChartOptions.argumentAxis.workdaysOnly]
     */
    workdaysOnly?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisConstantLines
    extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.displayBehindSeries]
     */
    displayBehindSeries?: boolean;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.extendAxis]
     */
    extendAxis?: boolean;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.label]
     */
    label?: dxChartArgumentAxisConstantLinesLabel;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.value]
     */
    value?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisConstantLinesLabel
    extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.label.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.label.text]
     */
    text?: string;
    /**
     * [descr:dxChartOptions.argumentAxis.constantLines.label.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisConstantLineStyle
    extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxChartOptions.argumentAxis.constantLineStyle.label]
     */
    label?: dxChartArgumentAxisConstantLineStyleLabel;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisConstantLineStyleLabel
    extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxChartOptions.argumentAxis.constantLineStyle.label.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.argumentAxis.constantLineStyle.label.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisLabel
    extends dxChartCommonAxisSettingsLabel {
    /**
     * [descr:dxChartOptions.argumentAxis.label.customizeHint]
     */
    customizeHint?: (argument: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.argumentAxis.label.customizeText]
     */
    customizeText?: (argument: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.argumentAxis.label.format]
     */
    format?: DevExpress.ui.format;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisStrips
    extends dxChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxChartOptions.argumentAxis.strips.color]
     */
    color?: string;
    /**
     * [descr:dxChartOptions.argumentAxis.strips.endValue]
     */
    endValue?: number | Date | string;
    /**
     * [descr:dxChartOptions.argumentAxis.strips.label]
     */
    label?: dxChartArgumentAxisStripsLabel;
    /**
     * [descr:dxChartOptions.argumentAxis.strips.startValue]
     */
    startValue?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisStripsLabel
    extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxChartOptions.argumentAxis.strips.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartArgumentAxisTitle
    extends dxChartCommonAxisSettingsTitle {
    /**
     * [descr:dxChartOptions.argumentAxis.title.text]
     */
    text?: string;
  }
  /**
   * [descr:dxChartCommonAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAnnotationConfig
    extends BaseChartAnnotationConfig {
    /**
     * [descr:dxChartCommonAnnotationConfig.axis]
     */
    axis?: string;
    /**
     * [descr:dxChartCommonAnnotationConfig.customizeTooltip]
     */
    customizeTooltip?: (annotation: dxChartAnnotationConfig | any) => any;
    /**
     * [descr:dxChartCommonAnnotationConfig.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          annotation: dxChartAnnotationConfig | any,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxChartCommonAnnotationConfig.tooltipTemplate]
     */
    tooltipTemplate?:
      | DevExpress.core.template
      | ((
          annotation: dxChartAnnotationConfig | any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettings {
    /**
     * [descr:dxChartOptions.commonAxisSettings.allowDecimals]
     */
    allowDecimals?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.breakStyle]
     */
    breakStyle?: {
      /**
       * [descr:dxChartOptions.commonAxisSettings.breakStyle.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonAxisSettings.breakStyle.line]
       */
      line?: 'straight' | 'waved';
      /**
       * [descr:dxChartOptions.commonAxisSettings.breakStyle.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.commonAxisSettings.color]
     */
    color?: string;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle]
     */
    constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
    /**
     * [descr:dxChartOptions.commonAxisSettings.discreteAxisDivisionMode]
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * [descr:dxChartOptions.commonAxisSettings.endOnTick]
     */
    endOnTick?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.grid]
     */
    grid?: {
      /**
       * [descr:dxChartOptions.commonAxisSettings.grid.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonAxisSettings.grid.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.grid.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.commonAxisSettings.grid.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.commonAxisSettings.inverted]
     */
    inverted?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label]
     */
    label?: dxChartCommonAxisSettingsLabel;
    /**
     * [descr:dxChartOptions.commonAxisSettings.maxValueMargin]
     */
    maxValueMargin?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.minValueMargin]
     */
    minValueMargin?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.minorGrid]
     */
    minorGrid?: {
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorGrid.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorGrid.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorGrid.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorGrid.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.commonAxisSettings.minorTick]
     */
    minorTick?: {
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.length]
       */
      length?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.shift]
       */
      shift?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.commonAxisSettings.minorTick.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.commonAxisSettings.opacity]
     */
    opacity?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.placeholderSize]
     */
    placeholderSize?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle]
     */
    stripStyle?: dxChartCommonAxisSettingsStripStyle;
    /**
     * [descr:dxChartOptions.commonAxisSettings.tick]
     */
    tick?: {
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.length]
       */
      length?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.shift]
       */
      shift?: number;
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.commonAxisSettings.tick.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.commonAxisSettings.title]
     */
    title?: dxChartCommonAxisSettingsTitle;
    /**
     * [descr:dxChartOptions.commonAxisSettings.valueMarginsEnabled]
     */
    valueMarginsEnabled?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.color]
     */
    color?: string;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.dashStyle]
     */
    dashStyle?: DashStyleType;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.label]
     */
    label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.paddingLeftRight]
     */
    paddingLeftRight?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.paddingTopBottom]
     */
    paddingTopBottom?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.label.font]
     */
    font?: Font;
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.label.position]
     */
    position?: 'inside' | 'outside';
    /**
     * [descr:dxChartOptions.commonAxisSettings.constantLineStyle.label.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsLabel {
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          data: object,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.alignment]
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.displayMode]
     */
    displayMode?: 'rotate' | 'stagger' | 'standard';
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.font]
     */
    font?: Font;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.indentFromAxis]
     */
    indentFromAxis?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.overlappingBehavior]
     */
    overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.position]
     */
    position?: 'inside' | 'outside' | 'bottom' | 'left' | 'right' | 'top';
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.rotationAngle]
     */
    rotationAngle?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.staggeringSpacing]
     */
    staggeringSpacing?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.textOverflow]
     */
    textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxChartOptions.commonAxisSettings.label.wordWrap]
     */
    wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.label]
     */
    label?: dxChartCommonAxisSettingsStripStyleLabel;
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.paddingLeftRight]
     */
    paddingLeftRight?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.paddingTopBottom]
     */
    paddingTopBottom?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.label.font]
     */
    font?: Font;
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.label.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.commonAxisSettings.stripStyle.label.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonAxisSettingsTitle {
    /**
     * [descr:dxChartOptions.commonAxisSettings.title.alignment]
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.commonAxisSettings.title.font]
     */
    font?: Font;
    /**
     * [descr:dxChartOptions.commonAxisSettings.title.margin]
     */
    margin?: number;
    /**
     * [descr:dxChartOptions.commonAxisSettings.title.textOverflow]
     */
    textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
    /**
     * [descr:dxChartOptions.commonAxisSettings.title.wordWrap]
     */
    wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonPaneSettings {
    /**
     * [descr:dxChartOptions.commonPaneSettings.backgroundColor]
     */
    backgroundColor?: string;
    /**
     * [descr:dxChartOptions.commonPaneSettings.border]
     */
    border?: {
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.bottom]
       */
      bottom?: boolean;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.left]
       */
      left?: boolean;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.right]
       */
      right?: boolean;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.top]
       */
      top?: boolean;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.commonPaneSettings.border.width]
       */
      width?: number;
    };
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartCommonSeriesSettings
    extends dxChartSeriesTypesCommonSeries {
    /**
     * [descr:dxChartOptions.commonSeriesSettings.area]
     */
    area?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.bar]
     */
    bar?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.bubble]
     */
    bubble?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.candlestick]
     */
    candlestick?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.fullstackedarea]
     */
    fullstackedarea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.fullstackedbar]
     */
    fullstackedbar?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.fullstackedline]
     */
    fullstackedline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.fullstackedspline]
     */
    fullstackedspline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.fullstackedsplinearea]
     */
    fullstackedsplinearea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.line]
     */
    line?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.rangearea]
     */
    rangearea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.rangebar]
     */
    rangebar?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.scatter]
     */
    scatter?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.spline]
     */
    spline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.splinearea]
     */
    splinearea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stackedarea]
     */
    stackedarea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stackedbar]
     */
    stackedbar?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stackedline]
     */
    stackedline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stackedspline]
     */
    stackedspline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stackedsplinearea]
     */
    stackedsplinearea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.steparea]
     */
    steparea?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stepline]
     */
    stepline?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.stock]
     */
    stock?: any;
    /**
     * [descr:dxChartOptions.commonSeriesSettings.type]
     */
    type?: ChartSeriesType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartLegend extends BaseChartLegend {
    /**
     * [descr:dxChartOptions.legend.customizeHint]
     */
    customizeHint?: (seriesInfo: {
      seriesName?: any;
      seriesIndex?: number;
      seriesColor?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.legend.customizeText]
     */
    customizeText?: (seriesInfo: {
      seriesName?: any;
      seriesIndex?: number;
      seriesColor?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.legend.hoverMode]
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    /**
     * [descr:dxChartOptions.legend.position]
     */
    position?: 'inside' | 'outside';
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartOptions extends BaseChartOptions<dxChart> {
    /**
     * [descr:dxChartOptions.adjustOnZoom]
     */
    adjustOnZoom?: boolean;
    /**
     * [descr:dxChartOptions.annotations]
     */
    annotations?: Array<dxChartAnnotationConfig | any>;
    /**
     * [descr:dxChartOptions.argumentAxis]
     */
    argumentAxis?: dxChartArgumentAxis;
    /**
     * [descr:dxChartOptions.autoHidePointMarkers]
     */
    autoHidePointMarkers?: boolean;
    /**
     * [descr:dxChartOptions.barGroupPadding]
     */
    barGroupPadding?: number;
    /**
     * [descr:dxChartOptions.barGroupWidth]
     */
    barGroupWidth?: number;
    /**
     * [descr:dxChartOptions.commonAnnotationSettings]
     */
    commonAnnotationSettings?: dxChartCommonAnnotationConfig;
    /**
     * [descr:dxChartOptions.commonAxisSettings]
     */
    commonAxisSettings?: dxChartCommonAxisSettings;
    /**
     * [descr:dxChartOptions.commonPaneSettings]
     */
    commonPaneSettings?: dxChartCommonPaneSettings;
    /**
     * [descr:dxChartOptions.commonSeriesSettings]
     */
    commonSeriesSettings?: dxChartCommonSeriesSettings;
    /**
     * [descr:dxChartOptions.containerBackgroundColor]
     */
    containerBackgroundColor?: string;
    /**
     * [descr:dxChartOptions.crosshair]
     */
    crosshair?: {
      /**
       * [descr:dxChartOptions.crosshair.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.crosshair.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxChartOptions.crosshair.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxChartOptions.crosshair.horizontalLine]
       */
      horizontalLine?:
        | {
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.color]
             */
            color?: string;
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.dashStyle]
             */
            dashStyle?: DashStyleType;
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.label]
             */
            label?: {
              /**
               * [descr:dxChartOptions.crosshair.horizontalLine.label.backgroundColor]
               */
              backgroundColor?: string;
              /**
               * [descr:dxChartOptions.crosshair.horizontalLine.label.customizeText]
               */
              customizeText?: (info: {
                value?: Date | number | string;
                valueText?: string;
                point?: chartPointObject;
              }) => string;
              /**
               * [descr:dxChartOptions.crosshair.horizontalLine.label.font]
               */
              font?: Font;
              /**
               * [descr:dxChartOptions.crosshair.horizontalLine.label.format]
               */
              format?: DevExpress.ui.format;
              /**
               * [descr:dxChartOptions.crosshair.horizontalLine.label.visible]
               */
              visible?: boolean;
            };
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.opacity]
             */
            opacity?: number;
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.visible]
             */
            visible?: boolean;
            /**
             * [descr:dxChartOptions.crosshair.horizontalLine.width]
             */
            width?: number;
          }
        | boolean;
      /**
       * [descr:dxChartOptions.crosshair.label]
       */
      label?: {
        /**
         * [descr:dxChartOptions.crosshair.label.backgroundColor]
         */
        backgroundColor?: string;
        /**
         * [descr:dxChartOptions.crosshair.label.customizeText]
         */
        customizeText?: (info: {
          value?: Date | number | string;
          valueText?: string;
          point?: chartPointObject;
        }) => string;
        /**
         * [descr:dxChartOptions.crosshair.label.font]
         */
        font?: Font;
        /**
         * [descr:dxChartOptions.crosshair.label.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:dxChartOptions.crosshair.label.visible]
         */
        visible?: boolean;
      };
      /**
       * [descr:dxChartOptions.crosshair.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.crosshair.verticalLine]
       */
      verticalLine?:
        | {
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.color]
             */
            color?: string;
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.dashStyle]
             */
            dashStyle?: DashStyleType;
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.label]
             */
            label?: {
              /**
               * [descr:dxChartOptions.crosshair.verticalLine.label.backgroundColor]
               */
              backgroundColor?: string;
              /**
               * [descr:dxChartOptions.crosshair.verticalLine.label.customizeText]
               */
              customizeText?: (info: {
                value?: Date | number | string;
                valueText?: string;
                point?: chartPointObject;
              }) => string;
              /**
               * [descr:dxChartOptions.crosshair.verticalLine.label.font]
               */
              font?: Font;
              /**
               * [descr:dxChartOptions.crosshair.verticalLine.label.format]
               */
              format?: DevExpress.ui.format;
              /**
               * [descr:dxChartOptions.crosshair.verticalLine.label.visible]
               */
              visible?: boolean;
            };
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.opacity]
             */
            opacity?: number;
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.visible]
             */
            visible?: boolean;
            /**
             * [descr:dxChartOptions.crosshair.verticalLine.width]
             */
            width?: number;
          }
        | boolean;
      /**
       * [descr:dxChartOptions.crosshair.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.customizeAnnotation]
     */
    customizeAnnotation?: (
      annotation: dxChartAnnotationConfig | any
    ) => dxChartAnnotationConfig;
    /**
     * [descr:dxChartOptions.dataPrepareSettings]
     */
    dataPrepareSettings?: {
      /**
       * [descr:dxChartOptions.dataPrepareSettings.checkTypeForAllData]
       */
      checkTypeForAllData?: boolean;
      /**
       * [descr:dxChartOptions.dataPrepareSettings.convertToAxisDataType]
       */
      convertToAxisDataType?: boolean;
      /**
       * [descr:dxChartOptions.dataPrepareSettings.sortingMethod]
       */
      sortingMethod?: boolean | ((a: any, b: any) => number);
    };
    /**
     * [descr:dxChartOptions.defaultPane]
     */
    defaultPane?: string;
    /**
     * [descr:dxChartOptions.legend]
     */
    legend?: dxChartLegend;
    /**
     * [descr:dxChartOptions.maxBubbleSize]
     */
    maxBubbleSize?: number;
    /**
     * [descr:dxChartOptions.minBubbleSize]
     */
    minBubbleSize?: number;
    /**
     * [descr:dxChartOptions.negativesAsZeroes]
     */
    negativesAsZeroes?: boolean;
    /**
     * [descr:dxChartOptions.onArgumentAxisClick]
     */
    onArgumentAxisClick?:
      | ((e: DevExpress.viz.dxChart.ArgumentAxisClickEvent) => void)
      | string;
    /**
     * [descr:dxChartOptions.onLegendClick]
     */
    onLegendClick?:
      | ((e: DevExpress.viz.dxChart.LegendClickEvent) => void)
      | string;
    /**
     * [descr:dxChartOptions.onSeriesClick]
     */
    onSeriesClick?:
      | ((e: DevExpress.viz.dxChart.SeriesClickEvent) => void)
      | string;
    /**
     * [descr:dxChartOptions.onSeriesHoverChanged]
     */
    onSeriesHoverChanged?: (
      e: DevExpress.viz.dxChart.SeriesHoverChangedEvent
    ) => void;
    /**
     * [descr:dxChartOptions.onSeriesSelectionChanged]
     */
    onSeriesSelectionChanged?: (
      e: DevExpress.viz.dxChart.SeriesSelectionChangedEvent
    ) => void;
    /**
     * [descr:dxChartOptions.onZoomEnd]
     */
    onZoomEnd?: (e: DevExpress.viz.dxChart.ZoomEndEvent) => void;
    /**
     * [descr:dxChartOptions.onZoomStart]
     */
    onZoomStart?: (e: DevExpress.viz.dxChart.ZoomStartEvent) => void;
    /**
     * [descr:dxChartOptions.panes]
     */
    panes?: dxChartPanes | Array<dxChartPanes>;
    /**
     * [descr:dxChartOptions.resizePanesOnZoom]
     */
    resizePanesOnZoom?: boolean;
    /**
     * [descr:dxChartOptions.resolveLabelOverlapping]
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
    /**
     * [descr:dxChartOptions.rotated]
     */
    rotated?: boolean;
    /**
     * [descr:dxChartOptions.scrollBar]
     */
    scrollBar?: {
      /**
       * [descr:dxChartOptions.scrollBar.color]
       */
      color?: string;
      /**
       * [descr:dxChartOptions.scrollBar.offset]
       */
      offset?: number;
      /**
       * [descr:dxChartOptions.scrollBar.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartOptions.scrollBar.position]
       */
      position?: 'bottom' | 'left' | 'right' | 'top';
      /**
       * [descr:dxChartOptions.scrollBar.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartOptions.scrollBar.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartOptions.series]
     */
    series?: ChartSeries | Array<ChartSeries>;
    /**
     * [descr:dxChartOptions.seriesSelectionMode]
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxChartOptions.seriesTemplate]
     */
    seriesTemplate?: {
      /**
       * [descr:dxChartOptions.seriesTemplate.customizeSeries]
       */
      customizeSeries?: (seriesName: any) => ChartSeries;
      /**
       * [descr:dxChartOptions.seriesTemplate.nameField]
       */
      nameField?: string;
    };
    /**
     * [descr:dxChartOptions.stickyHovering]
     */
    stickyHovering?: boolean;
    /**
     * [descr:dxChartOptions.synchronizeMultiAxes]
     */
    synchronizeMultiAxes?: boolean;
    /**
     * [descr:dxChartOptions.tooltip]
     */
    tooltip?: dxChartTooltip;
    /**
     * [descr:dxChartOptions.valueAxis]
     */
    valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
    /**
     * [descr:dxChartOptions.zoomAndPan]
     */
    zoomAndPan?: {
      /**
       * [descr:dxChartOptions.zoomAndPan.allowMouseWheel]
       */
      allowMouseWheel?: boolean;
      /**
       * [descr:dxChartOptions.zoomAndPan.allowTouchGestures]
       */
      allowTouchGestures?: boolean;
      /**
       * [descr:dxChartOptions.zoomAndPan.argumentAxis]
       */
      argumentAxis?: 'both' | 'none' | 'pan' | 'zoom';
      /**
       * [descr:dxChartOptions.zoomAndPan.dragBoxStyle]
       */
      dragBoxStyle?: {
        /**
         * [descr:dxChartOptions.zoomAndPan.dragBoxStyle.color]
         */
        color?: string;
        /**
         * [descr:dxChartOptions.zoomAndPan.dragBoxStyle.opacity]
         */
        opacity?: number;
      };
      /**
       * [descr:dxChartOptions.zoomAndPan.dragToZoom]
       */
      dragToZoom?: boolean;
      /**
       * [descr:dxChartOptions.zoomAndPan.panKey]
       */
      panKey?: 'alt' | 'ctrl' | 'meta' | 'shift';
      /**
       * [descr:dxChartOptions.zoomAndPan.valueAxis]
       */
      valueAxis?: 'both' | 'none' | 'pan' | 'zoom';
    };
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartPanes extends dxChartCommonPaneSettings {
    /**
     * [descr:dxChartOptions.panes.height]
     */
    height?: number | string;
    /**
     * [descr:dxChartOptions.panes.name]
     */
    name?: string;
  }
  /**
   * [descr:dxChartSeriesTypes]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypes {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.AreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBarSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBarSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.BarSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBarSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.BarSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBubbleSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBubbleSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.BubbleSeries.aggregation.method]
     */
    method?: 'avg' | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesBubbleSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.BubbleSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle]
     */
    selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.aggregation.method]
     */
    method?: 'ohlc' | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesHoverStyle
    extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching]
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching
    extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.hoverStyle.hatching.direction]
     */
    direction?: HatchingDirectionType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesSelectionStyle
    extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching]
     */
    hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching
    extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * [descr:dxChartSeriesTypes.CandleStickSeries.selectionStyle.hatching.direction]
     */
    direction?: HatchingDirectionType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeries {
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
    dashStyle?: DashStyleType;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.highValueField]
     */
    highValueField?: string;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverMode]
     */
    hoverMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'excludePoints'
      | 'includePoints'
      | 'nearestPoint'
      | 'none'
      | 'onlyPoint';
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
    reduction?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.reduction.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.reduction.level]
       */
      level?: 'close' | 'high' | 'low' | 'open';
    };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionMode]
     */
    selectionMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'excludePoints'
      | 'includePoints'
      | 'none'
      | 'onlyPoint';
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
    valueErrorBar?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.displayMode]
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none';
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.edgeLength]
       */
      edgeLength?: number;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.highValueField]
       */
      highValueField?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.lineWidth]
       */
      lineWidth?: number;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.lowValueField]
       */
      lowValueField?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.type]
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.valueErrorBar.value]
       */
      value?: number;
    };
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.aggregation.calculate]
     */
    calculate?: (
      aggregationInfo: chartPointAggregationInfoObject,
      series: chartSeriesObject
    ) => any | Array<any>;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.aggregation.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.aggregation.method]
     */
    method?:
      | 'avg'
      | 'count'
      | 'max'
      | 'min'
      | 'ohlc'
      | 'range'
      | 'sum'
      | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesBorder {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.border.color]
     */
    color?: string;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.border.dashStyle]
     */
    dashStyle?: DashStyleType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesHoverStyle {
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
    dashStyle?: DashStyleType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.color]
     */
    color?: string;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.border.dashStyle]
     */
    dashStyle?: DashStyleType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.hoverStyle.hatching.direction]
     */
    direction?: HatchingDirectionType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesLabel {
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
    border?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.border.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.border.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.label.connector]
     */
    connector?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.connector.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.connector.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.label.connector.width]
       */
      width?: number;
    };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.border]
     */
    border?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.border.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.border.width]
       */
      width?: number;
    };
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
    hoverStyle?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.border]
       */
      border?: {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.hoverStyle.size]
       */
      size?: number;
    };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.image]
     */
    image?:
      | string
      | {
          /**
           * [descr:dxChartSeriesTypes.CommonSeries.point.image.height]
           */
          height?:
            | number
            | {
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.height.rangeMaxPoint]
                 */
                rangeMaxPoint?: number;
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.height.rangeMinPoint]
                 */
                rangeMinPoint?: number;
              };
          /**
           * [descr:dxChartSeriesTypes.CommonSeries.point.image.url]
           */
          url?:
            | string
            | {
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.url.rangeMaxPoint]
                 */
                rangeMaxPoint?: string;
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.url.rangeMinPoint]
                 */
                rangeMinPoint?: string;
              };
          /**
           * [descr:dxChartSeriesTypes.CommonSeries.point.image.width]
           */
          width?:
            | number
            | {
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.width.rangeMaxPoint]
                 */
                rangeMaxPoint?: number;
                /**
                 * [descr:dxChartSeriesTypes.CommonSeries.point.image.width.rangeMinPoint]
                 */
                rangeMinPoint?: number;
              };
        };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.selectionMode]
     */
    selectionMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'none'
      | 'onlyPoint';
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle]
     */
    selectionStyle?: {
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.border]
       */
      border?: {
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.color]
       */
      color?: string;
      /**
       * [descr:dxChartSeriesTypes.CommonSeries.point.selectionStyle.size]
       */
      size?: number;
    };
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.size]
     */
    size?: number;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.symbol]
     */
    symbol?:
      | 'circle'
      | 'cross'
      | 'polygon'
      | 'square'
      | 'triangleDown'
      | 'triangleUp';
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesSelectionStyle {
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
    dashStyle?: DashStyleType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.color]
     */
    color?: string;
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.border.dashStyle]
     */
    dashStyle?: DashStyleType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
    /**
     * [descr:dxChartSeriesTypes.CommonSeries.selectionStyle.hatching.direction]
     */
    direction?: HatchingDirectionType;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.FullStackedAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedBarSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedBarSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedBarSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
    /**
     * [descr:dxChartSeriesTypes.FullStackedBarSeries.label.position]
     */
    position?: 'inside' | 'outside';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedLineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedLineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.FullStackedLineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedLineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.FullStackedLineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesFullStackedSplineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.FullStackedSplineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesLineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesLineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.LineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesLineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.LineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.aggregation.method]
     */
    method?: 'range' | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.RangeAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeBarSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeBarSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.RangeBarSeries.aggregation.method]
     */
    method?: 'range' | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesRangeBarSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.RangeBarSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesScatterSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesScatterSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.ScatterSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesScatterSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.ScatterSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.SplineAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.SplineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesSplineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.SplineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.StackedAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedBarSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedBarSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedBarSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
    /**
     * [descr:dxChartSeriesTypes.StackedBarSeries.label.position]
     */
    position?: 'inside' | 'outside';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedLineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedLineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StackedLineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedLineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StackedLineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.StackedSplineAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StackedSplineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStackedSplineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StackedSplineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesBorder
    extends dxChartSeriesTypesCommonSeriesBorder {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.border.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesHoverStyle
    extends dxChartSeriesTypesCommonSeriesHoverStyle {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle.border]
     */
    border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder
    extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.hoverStyle.border.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesPoint
    extends dxChartSeriesTypesCommonSeriesPoint {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesSelectionStyle
    extends dxChartSeriesTypesCommonSeriesSelectionStyle {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle.border]
     */
    border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder
    extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
    /**
     * [descr:dxChartSeriesTypes.StepAreaSeries.selectionStyle.border.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepLineSeries
    extends dxChartSeriesTypesCommonSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepLineSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StepLineSeries.aggregation.method]
     */
    method?: DevExpress.viz.dxChart.ChartSingleValueSeriesAggregationMethodType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStepLineSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StepLineSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStockSeries
    extends dxChartSeriesTypesCommonSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStockSeriesAggregation
    extends dxChartSeriesTypesCommonSeriesAggregation {
    /**
     * [descr:dxChartSeriesTypes.StockSeries.aggregation.method]
     */
    method?: 'ohlc' | 'custom';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartSeriesTypesStockSeriesLabel
    extends dxChartSeriesTypesCommonSeriesLabel {
    /**
     * [descr:dxChartSeriesTypes.StockSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartTooltip extends BaseChartTooltip {
    /**
     * [descr:dxChartOptions.tooltip.location]
     */
    location?: 'center' | 'edge';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxis extends dxChartCommonAxisSettings {
    /**
     * [descr:dxChartOptions.valueAxis.autoBreaksEnabled]
     */
    autoBreaksEnabled?: boolean;
    /**
     * [descr:dxChartOptions.valueAxis.axisDivisionFactor]
     */
    axisDivisionFactor?: number;
    /**
     * [descr:dxChartOptions.valueAxis.breaks]
     */
    breaks?: Array<ScaleBreak>;
    /**
     * [descr:dxChartOptions.valueAxis.categories]
     */
    categories?: Array<number | string | Date>;
    /**
     * [descr:dxChartOptions.valueAxis.constantLineStyle]
     */
    constantLineStyle?: dxChartValueAxisConstantLineStyle;
    /**
     * [descr:dxChartOptions.valueAxis.constantLines]
     */
    constantLines?: Array<dxChartValueAxisConstantLines>;
    /**
     * [descr:dxChartOptions.valueAxis.endOnTick]
     */
    endOnTick?: boolean;
    /**
     * [descr:dxChartOptions.valueAxis.label]
     */
    label?: dxChartValueAxisLabel;
    /**
     * [descr:dxChartOptions.valueAxis.linearThreshold]
     */
    linearThreshold?: number;
    /**
     * [descr:dxChartOptions.valueAxis.logarithmBase]
     */
    logarithmBase?: number;
    /**
     * [descr:dxChartOptions.valueAxis.maxAutoBreakCount]
     */
    maxAutoBreakCount?: number;
    /**
     * [descr:dxChartOptions.valueAxis.minVisualRangeLength]
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.valueAxis.minorTickCount]
     */
    minorTickCount?: number;
    /**
     * [descr:dxChartOptions.valueAxis.minorTickInterval]
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.valueAxis.multipleAxesSpacing]
     */
    multipleAxesSpacing?: number;
    /**
     * [descr:dxChartOptions.valueAxis.name]
     */
    name?: string;
    /**
     * [descr:dxChartOptions.valueAxis.pane]
     */
    pane?: string;
    /**
     * [descr:dxChartOptions.valueAxis.position]
     */
    position?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * [descr:dxChartOptions.valueAxis.customPosition]
     */
    customPosition?: number | Date | string;
    /**
     * [descr:dxChartOptions.valueAxis.offset]
     */
    offset?: number;
    /**
     * [descr:dxChartOptions.valueAxis.showZero]
     */
    showZero?: boolean;
    /**
     * [descr:dxChartOptions.valueAxis.strips]
     */
    strips?: Array<dxChartValueAxisStrips>;
    /**
     * [descr:dxChartOptions.valueAxis.synchronizedValue]
     */
    synchronizedValue?: number;
    /**
     * [descr:dxChartOptions.valueAxis.tickInterval]
     */
    tickInterval?: VizTimeInterval;
    /**
     * [descr:dxChartOptions.valueAxis.title]
     */
    title?: dxChartValueAxisTitle;
    /**
     * [descr:dxChartOptions.valueAxis.type]
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * [descr:dxChartOptions.valueAxis.valueType]
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * [descr:dxChartOptions.valueAxis.visualRange]
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * [descr:dxChartOptions.valueAxis.visualRangeUpdateMode]
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * [descr:dxChartOptions.valueAxis.wholeRange]
     */
    wholeRange?: VizRange | Array<number | string | Date>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisConstantLines
    extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.displayBehindSeries]
     */
    displayBehindSeries?: boolean;
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.extendAxis]
     */
    extendAxis?: boolean;
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.label]
     */
    label?: dxChartValueAxisConstantLinesLabel;
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.value]
     */
    value?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisConstantLinesLabel
    extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.label.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.label.text]
     */
    text?: string;
    /**
     * [descr:dxChartOptions.valueAxis.constantLines.label.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisConstantLineStyle
    extends dxChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxChartOptions.valueAxis.constantLineStyle.label]
     */
    label?: dxChartValueAxisConstantLineStyleLabel;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisConstantLineStyleLabel
    extends dxChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxChartOptions.valueAxis.constantLineStyle.label.horizontalAlignment]
     */
    horizontalAlignment?: 'center' | 'left' | 'right';
    /**
     * [descr:dxChartOptions.valueAxis.constantLineStyle.label.verticalAlignment]
     */
    verticalAlignment?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisLabel
    extends dxChartCommonAxisSettingsLabel {
    /**
     * [descr:dxChartOptions.valueAxis.label.customizeHint]
     */
    customizeHint?: (axisValue: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.valueAxis.label.customizeText]
     */
    customizeText?: (axisValue: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxChartOptions.valueAxis.label.format]
     */
    format?: DevExpress.ui.format;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisStrips
    extends dxChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxChartOptions.valueAxis.strips.color]
     */
    color?: string;
    /**
     * [descr:dxChartOptions.valueAxis.strips.endValue]
     */
    endValue?: number | Date | string;
    /**
     * [descr:dxChartOptions.valueAxis.strips.label]
     */
    label?: dxChartValueAxisStripsLabel;
    /**
     * [descr:dxChartOptions.valueAxis.strips.startValue]
     */
    startValue?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisStripsLabel
    extends dxChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxChartOptions.valueAxis.strips.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxChartValueAxisTitle
    extends dxChartCommonAxisSettingsTitle {
    /**
     * [descr:dxChartOptions.valueAxis.title.text]
     */
    text?: string;
  }
  /**
   * [descr:dxCircularGauge]
   */
  export class dxCircularGauge extends BaseGauge<dxCircularGaugeOptions> {}
  module dxCircularGauge {
    export type DisposingEvent = DevExpress.events.EventInfo<dxCircularGauge>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxCircularGauge>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxCircularGauge>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxCircularGauge> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxCircularGauge>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxCircularGauge> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxCircularGauge>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxCircularGauge> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxCircularGaugeOptions;
    export type TooltipHiddenEvent =
      DevExpress.events.EventInfo<dxCircularGauge> &
        DevExpress.viz.BaseGauge.TooltipInfo;
    export type TooltipShownEvent =
      DevExpress.events.EventInfo<dxCircularGauge> &
        DevExpress.viz.BaseGauge.TooltipInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCircularGaugeOptions
    extends BaseGaugeOptions<dxCircularGauge> {
    /**
     * [descr:dxCircularGaugeOptions.geometry]
     */
    geometry?: {
      /**
       * [descr:dxCircularGaugeOptions.geometry.endAngle]
       */
      endAngle?: number;
      /**
       * [descr:dxCircularGaugeOptions.geometry.startAngle]
       */
      startAngle?: number;
    };
    /**
     * [descr:dxCircularGaugeOptions.rangeContainer]
     */
    rangeContainer?: dxCircularGaugeRangeContainer;
    /**
     * [descr:dxCircularGaugeOptions.scale]
     */
    scale?: dxCircularGaugeScale;
    /**
     * [descr:dxCircularGaugeOptions.subvalueIndicator]
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * [descr:dxCircularGaugeOptions.valueIndicator]
     */
    valueIndicator?: GaugeIndicator;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCircularGaugeRangeContainer
    extends BaseGaugeRangeContainer {
    /**
     * [descr:dxCircularGaugeOptions.rangeContainer.orientation]
     */
    orientation?: 'center' | 'inside' | 'outside';
    /**
     * [descr:dxCircularGaugeOptions.rangeContainer.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCircularGaugeScale extends BaseGaugeScale {
    /**
     * [descr:dxCircularGaugeOptions.scale.label]
     */
    label?: dxCircularGaugeScaleLabel;
    /**
     * [descr:dxCircularGaugeOptions.scale.orientation]
     */
    orientation?: 'center' | 'inside' | 'outside';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * [descr:dxCircularGaugeOptions.scale.label.hideFirstOrLast]
     */
    hideFirstOrLast?: 'first' | 'last';
    /**
     * [descr:dxCircularGaugeOptions.scale.label.indentFromTick]
     */
    indentFromTick?: number;
  }
  /**
   * [descr:dxFunnel]
   */
  export class dxFunnel extends BaseWidget<dxFunnelOptions> {
    /**
     * [descr:dxFunnel.clearSelection()]
     */
    clearSelection(): void;
    /**
     * [descr:dxFunnel.getAllItems()]
     */
    getAllItems(): Array<dxFunnelItem>;
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxFunnel.hideTooltip()]
     */
    hideTooltip(): void;
  }
  module dxFunnel {
    export type DisposingEvent = DevExpress.events.EventInfo<dxFunnel>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxFunnel>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxFunnel>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxFunnel> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxFunnel>;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface FunnelItemInfo {
      readonly item: dxFunnelItem;
    }
    export type HoverChangedEvent = DevExpress.events.EventInfo<dxFunnel> &
      FunnelItemInfo;
    export type IncidentOccurredEvent = DevExpress.events.EventInfo<dxFunnel> &
      DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxFunnel>;
    export type ItemClickEvent = DevExpress.events.NativeEventInfo<dxFunnel> &
      FunnelItemInfo;
    export type LegendClickEvent = DevExpress.events.NativeEventInfo<dxFunnel> &
      FunnelItemInfo;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxFunnel> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxFunnelOptions;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxFunnel> &
      FunnelItemInfo;
  }
  /**
   * [descr:dxFunnelItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFunnelItem {
    /**
     * [descr:dxFunnelItem.argument]
     */
    argument?: string | Date | number;
    /**
     * [descr:dxFunnelItem.data]
     */
    data?: any;
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
     * [descr:dxFunnelItem.percent]
     */
    percent?: number;
    /**
     * [descr:dxFunnelItem.select(state)]
     */
    select(state: boolean): void;
    /**
     * [descr:dxFunnelItem.showTooltip()]
     */
    showTooltip(): void;
    /**
     * [descr:dxFunnelItem.value]
     */
    value?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFunnelLegend extends BaseLegend {
    /**
     * [descr:dxFunnelOptions.legend.customizeHint]
     */
    customizeHint?: (itemInfo: {
      item?: dxFunnelItem;
      text?: string;
    }) => string;
    /**
     * [descr:dxFunnelOptions.legend.customizeItems]
     */
    customizeItems?: (
      items: Array<FunnelLegendItem>
    ) => Array<FunnelLegendItem>;
    /**
     * [descr:dxFunnelOptions.legend.customizeText]
     */
    customizeText?: (itemInfo: {
      item?: dxFunnelItem;
      text?: string;
    }) => string;
    /**
     * [descr:dxFunnelOptions.legend.markerTemplate]
     */
    markerTemplate?:
      | DevExpress.core.template
      | ((
          legendItem: FunnelLegendItem,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxFunnelOptions.legend.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
    /**
     * [descr:dxFunnelOptions.adaptiveLayout]
     */
    adaptiveLayout?: {
      /**
       * [descr:dxFunnelOptions.adaptiveLayout.height]
       */
      height?: number;
      /**
       * [descr:dxFunnelOptions.adaptiveLayout.keepLabels]
       */
      keepLabels?: boolean;
      /**
       * [descr:dxFunnelOptions.adaptiveLayout.width]
       */
      width?: number;
    };
    /**
     * [descr:dxFunnelOptions.algorithm]
     */
    algorithm?: 'dynamicHeight' | 'dynamicSlope';
    /**
     * [descr:dxFunnelOptions.argumentField]
     */
    argumentField?: string;
    /**
     * [descr:dxFunnelOptions.colorField]
     */
    colorField?: string;
    /**
     * [descr:dxFunnelOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:dxFunnelOptions.hoverEnabled]
     */
    hoverEnabled?: boolean;
    /**
     * [descr:dxFunnelOptions.inverted]
     */
    inverted?: boolean;
    /**
     * [descr:dxFunnelOptions.item]
     */
    item?: {
      /**
       * [descr:dxFunnelOptions.item.border]
       */
      border?: {
        /**
         * [descr:dxFunnelOptions.item.border.color]
         */
        color?: string;
        /**
         * [descr:dxFunnelOptions.item.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFunnelOptions.item.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxFunnelOptions.item.hoverStyle]
       */
      hoverStyle?: {
        /**
         * [descr:dxFunnelOptions.item.hoverStyle.border]
         */
        border?: {
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.border.visible]
           */
          visible?: boolean;
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxFunnelOptions.item.hoverStyle.hatching]
         */
        hatching?: {
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.hatching.direction]
           */
          direction?: HatchingDirectionType;
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.hatching.opacity]
           */
          opacity?: number;
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.hatching.step]
           */
          step?: number;
          /**
           * [descr:dxFunnelOptions.item.hoverStyle.hatching.width]
           */
          width?: number;
        };
      };
      /**
       * [descr:dxFunnelOptions.item.selectionStyle]
       */
      selectionStyle?: {
        /**
         * [descr:dxFunnelOptions.item.selectionStyle.border]
         */
        border?: {
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.border.visible]
           */
          visible?: boolean;
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxFunnelOptions.item.selectionStyle.hatching]
         */
        hatching?: {
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.hatching.direction]
           */
          direction?: HatchingDirectionType;
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.hatching.opacity]
           */
          opacity?: number;
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.hatching.step]
           */
          step?: number;
          /**
           * [descr:dxFunnelOptions.item.selectionStyle.hatching.width]
           */
          width?: number;
        };
      };
    };
    /**
     * [descr:dxFunnelOptions.label]
     */
    label?: {
      /**
       * [descr:dxFunnelOptions.label.backgroundColor]
       */
      backgroundColor?: string;
      /**
       * [descr:dxFunnelOptions.label.border]
       */
      border?: {
        /**
         * [descr:dxFunnelOptions.label.border.color]
         */
        color?: string;
        /**
         * [descr:dxFunnelOptions.label.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxFunnelOptions.label.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFunnelOptions.label.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxFunnelOptions.label.connector]
       */
      connector?: {
        /**
         * [descr:dxFunnelOptions.label.connector.color]
         */
        color?: string;
        /**
         * [descr:dxFunnelOptions.label.connector.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxFunnelOptions.label.connector.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxFunnelOptions.label.connector.width]
         */
        width?: number;
      };
      /**
       * [descr:dxFunnelOptions.label.customizeText]
       */
      customizeText?: (itemInfo: {
        item?: dxFunnelItem;
        value?: number;
        valueText?: string;
        percent?: number;
        percentText?: string;
      }) => string;
      /**
       * [descr:dxFunnelOptions.label.font]
       */
      font?: Font;
      /**
       * [descr:dxFunnelOptions.label.format]
       */
      format?: DevExpress.ui.format;
      /**
       * [descr:dxFunnelOptions.label.horizontalAlignment]
       */
      horizontalAlignment?: 'left' | 'right';
      /**
       * [descr:dxFunnelOptions.label.horizontalOffset]
       */
      horizontalOffset?: number;
      /**
       * [descr:dxFunnelOptions.label.position]
       */
      position?: 'columns' | 'inside' | 'outside';
      /**
       * [descr:dxFunnelOptions.label.showForZeroValues]
       */
      showForZeroValues?: boolean;
      /**
       * [descr:dxFunnelOptions.label.textOverflow]
       */
      textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
      /**
       * [descr:dxFunnelOptions.label.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxFunnelOptions.label.wordWrap]
       */
      wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
    };
    /**
     * [descr:dxFunnelOptions.legend]
     */
    legend?: dxFunnelLegend;
    /**
     * [descr:dxFunnelOptions.neckHeight]
     */
    neckHeight?: number;
    /**
     * [descr:dxFunnelOptions.neckWidth]
     */
    neckWidth?: number;
    /**
     * [descr:dxFunnelOptions.onHoverChanged]
     */
    onHoverChanged?: (e: DevExpress.viz.dxFunnel.HoverChangedEvent) => void;
    /**
     * [descr:dxFunnelOptions.onItemClick]
     */
    onItemClick?:
      | ((e: DevExpress.viz.dxFunnel.ItemClickEvent) => void)
      | string;
    /**
     * [descr:dxFunnelOptions.onLegendClick]
     */
    onLegendClick?:
      | ((e: DevExpress.viz.dxFunnel.LegendClickEvent) => void)
      | string;
    /**
     * [descr:dxFunnelOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.viz.dxFunnel.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxFunnelOptions.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:dxFunnelOptions.paletteExtensionMode]
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * [descr:dxFunnelOptions.resolveLabelOverlapping]
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * [descr:dxFunnelOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * [descr:dxFunnelOptions.sortData]
     */
    sortData?: boolean;
    /**
     * [descr:dxFunnelOptions.tooltip]
     */
    tooltip?: dxFunnelTooltip;
    /**
     * [descr:dxFunnelOptions.valueField]
     */
    valueField?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxFunnelTooltip extends BaseWidgetTooltip {
    /**
     * [descr:dxFunnelOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          info: {
            item?: dxFunnelItem;
            value?: number;
            valueText?: string;
            percent?: number;
            percentText?: string;
          },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxFunnelOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (info: {
      item?: dxFunnelItem;
      value?: number;
      valueText?: string;
      percent?: number;
      percentText?: string;
    }) => any;
  }
  /**
   * [descr:dxLinearGauge]
   */
  export class dxLinearGauge extends BaseGauge<dxLinearGaugeOptions> {}
  module dxLinearGauge {
    export type DisposingEvent = DevExpress.events.EventInfo<dxLinearGauge>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxLinearGauge>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxLinearGauge>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxLinearGauge> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxLinearGauge>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxLinearGauge> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxLinearGauge>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxLinearGauge> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxLinearGaugeOptions;
    export type TooltipHiddenEvent =
      DevExpress.events.EventInfo<dxLinearGauge> &
        DevExpress.viz.BaseGauge.TooltipInfo;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxLinearGauge> &
      DevExpress.viz.BaseGauge.TooltipInfo;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLinearGaugeOptions
    extends BaseGaugeOptions<dxLinearGauge> {
    /**
     * [descr:dxLinearGaugeOptions.geometry]
     */
    geometry?: {
      /**
       * [descr:dxLinearGaugeOptions.geometry.orientation]
       */
      orientation?: 'horizontal' | 'vertical';
    };
    /**
     * [descr:dxLinearGaugeOptions.rangeContainer]
     */
    rangeContainer?: dxLinearGaugeRangeContainer;
    /**
     * [descr:dxLinearGaugeOptions.scale]
     */
    scale?: dxLinearGaugeScale;
    /**
     * [descr:dxLinearGaugeOptions.subvalueIndicator]
     */
    subvalueIndicator?: GaugeIndicator;
    /**
     * [descr:dxLinearGaugeOptions.valueIndicator]
     */
    valueIndicator?: GaugeIndicator;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
    /**
     * [descr:dxLinearGaugeOptions.rangeContainer.horizontalOrientation]
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * [descr:dxLinearGaugeOptions.rangeContainer.verticalOrientation]
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
    /**
     * [descr:dxLinearGaugeOptions.rangeContainer.width]
     */
    width?:
      | {
          /**
           * [descr:dxLinearGaugeOptions.rangeContainer.width.start]
           */
          start?: number;
          /**
           * [descr:dxLinearGaugeOptions.rangeContainer.width.end]
           */
          end?: number;
        }
      | number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLinearGaugeScale extends BaseGaugeScale {
    /**
     * [descr:dxLinearGaugeOptions.scale.horizontalOrientation]
     */
    horizontalOrientation?: 'center' | 'left' | 'right';
    /**
     * [descr:dxLinearGaugeOptions.scale.label]
     */
    label?: dxLinearGaugeScaleLabel;
    /**
     * [descr:dxLinearGaugeOptions.scale.scaleDivisionFactor]
     */
    scaleDivisionFactor?: number;
    /**
     * [descr:dxLinearGaugeOptions.scale.verticalOrientation]
     */
    verticalOrientation?: 'bottom' | 'center' | 'top';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
    /**
     * [descr:dxLinearGaugeOptions.scale.label.indentFromTick]
     */
    indentFromTick?: number;
  }
  /**
   * [descr:dxPieChart]
   */
  export class dxPieChart extends BaseChart<dxPieChartOptions> {
    /**
     * [descr:dxPieChart.getInnerRadius()]
     */
    getInnerRadius(): number;
  }
  module dxPieChart {
    export type DisposingEvent = DevExpress.events.EventInfo<dxPieChart>;
    export type DoneEvent = DevExpress.events.EventInfo<dxPieChart>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxPieChart>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxPieChart>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxPieChart> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxPieChart>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxPieChart> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPieChart>;
    export type LegendClickEvent =
      DevExpress.events.NativeEventInfo<dxPieChart> & {
        readonly target: string | number;
        readonly points: Array<piePointObject>;
      };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxPieChart> &
      DevExpress.events.ChangedOptionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type PieSeriesType = 'donut' | 'doughnut' | 'pie';
    export type PointClickEvent =
      DevExpress.events.NativeEventInfo<dxPieChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointHoverChangedEvent =
      DevExpress.events.EventInfo<dxPieChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointSelectionChangedEvent =
      DevExpress.events.EventInfo<dxPieChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type Properties = dxPieChartOptions;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type SegmentsDirectionType = 'anticlockwise' | 'clockwise';
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxPieChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxPieChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * [descr:dxPieChartOptions.adaptiveLayout.keepLabels]
     */
    keepLabels?: boolean;
  }
  /**
   * [descr:dxPieChartAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPieChartAnnotationConfig
    extends dxPieChartCommonAnnotationConfig {
    /**
     * [descr:dxPieChartAnnotationConfig.name]
     */
    name?: string;
  }
  /**
   * [descr:dxPieChartCommonAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPieChartCommonAnnotationConfig
    extends BaseWidgetAnnotationConfig {
    /**
     * [descr:dxPieChartCommonAnnotationConfig.location]
     */
    location?: 'center' | 'edge';
    /**
     * [descr:dxPieChartCommonAnnotationConfig.argument]
     */
    argument?: number | Date | string;
    /**
     * [descr:dxPieChartCommonAnnotationConfig.series]
     */
    series?: string;
    /**
     * [descr:dxPieChartCommonAnnotationConfig.customizeTooltip]
     */
    customizeTooltip?: (annotation: dxPieChartAnnotationConfig | any) => any;
    /**
     * [descr:dxPieChartCommonAnnotationConfig.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          annotation: dxPieChartAnnotationConfig | any,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxPieChartCommonAnnotationConfig.tooltipTemplate]
     */
    tooltipTemplate?:
      | DevExpress.core.template
      | ((
          annotation: dxPieChartAnnotationConfig | any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPieChartLegend extends BaseChartLegend {
    /**
     * [descr:dxPieChartOptions.legend.customizeHint]
     */
    customizeHint?: (pointInfo: {
      pointName?: any;
      pointIndex?: number;
      pointColor?: string;
    }) => string;
    /**
     * [descr:dxPieChartOptions.legend.customizeItems]
     */
    customizeItems?: (
      items: Array<PieChartLegendItem>
    ) => Array<PieChartLegendItem>;
    /**
     * [descr:dxPieChartOptions.legend.customizeText]
     */
    customizeText?: (pointInfo: {
      pointName?: any;
      pointIndex?: number;
      pointColor?: string;
    }) => string;
    /**
     * [descr:dxPieChartOptions.legend.hoverMode]
     */
    hoverMode?: 'none' | 'allArgumentPoints';
    /**
     * [descr:dxPieChartOptions.legend.markerTemplate]
     */
    markerTemplate?:
      | DevExpress.core.template
      | ((
          legendItem: PieChartLegendItem,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
    /**
     * [descr:dxPieChartOptions.adaptiveLayout]
     */
    adaptiveLayout?: dxPieChartAdaptiveLayout;
    /**
     * [descr:dxPieChartOptions.centerTemplate]
     */
    centerTemplate?:
      | DevExpress.core.template
      | ((
          component: dxPieChart,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxPieChartOptions.commonSeriesSettings]
     */
    commonSeriesSettings?: any;
    /**
     * [descr:dxPieChartOptions.diameter]
     */
    diameter?: number;
    /**
     * [descr:dxPieChartOptions.innerRadius]
     */
    innerRadius?: number;
    /**
     * [descr:dxPieChartOptions.legend]
     */
    legend?: dxPieChartLegend;
    /**
     * [descr:dxPieChartOptions.minDiameter]
     */
    minDiameter?: number;
    /**
     * [descr:dxPieChartOptions.onLegendClick]
     */
    onLegendClick?:
      | ((e: DevExpress.viz.dxPieChart.LegendClickEvent) => void)
      | string;
    /**
     * [descr:dxPieChartOptions.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:dxPieChartOptions.resolveLabelOverlapping]
     */
    resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
    /**
     * [descr:dxPieChartOptions.segmentsDirection]
     */
    segmentsDirection?: DevExpress.viz.dxPieChart.SegmentsDirectionType;
    /**
     * [descr:dxPieChartOptions.series]
     */
    series?: PieChartSeries | Array<PieChartSeries>;
    /**
     * [descr:dxPieChartOptions.seriesTemplate]
     */
    seriesTemplate?: {
      /**
       * [descr:dxPieChartOptions.seriesTemplate.customizeSeries]
       */
      customizeSeries?: (seriesName: any) => PieChartSeries;
      /**
       * [descr:dxPieChartOptions.seriesTemplate.nameField]
       */
      nameField?: string;
    };
    /**
     * [descr:dxPieChartOptions.sizeGroup]
     */
    sizeGroup?: string;
    /**
     * [descr:dxPieChartOptions.startAngle]
     */
    startAngle?: number;
    /**
     * [descr:dxPieChartOptions.type]
     */
    type?: DevExpress.viz.dxPieChart.PieSeriesType;
    /**
     * [descr:dxPieChartOptions.annotations]
     */
    annotations?: Array<dxPieChartAnnotationConfig | any>;
    /**
     * [descr:dxPieChartOptions.commonAnnotationSettings]
     */
    commonAnnotationSettings?: dxPieChartCommonAnnotationConfig;
    /**
     * [descr:dxPieChartOptions.customizeAnnotation]
     */
    customizeAnnotation?: (
      annotation: dxPieChartAnnotationConfig | any
    ) => dxPieChartAnnotationConfig;
  }
  /**
   * [descr:dxPieChartSeriesTypes]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    border?: {
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.border.color]
       */
      color?: string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.border.width]
       */
      width?: number;
    };
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
    hoverStyle?: {
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border]
       */
      border?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching]
       */
      hatching?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.direction]
         */
        direction?: HatchingDirectionType;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.hoverStyle.hatching.width]
         */
        width?: number;
      };
    };
    /**
     * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label]
     */
    label?: {
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.argumentFormat]
       */
      argumentFormat?: DevExpress.ui.format;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.backgroundColor]
       */
      backgroundColor?: string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.border]
       */
      border?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.border.color]
         */
        color?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.connector]
       */
      connector?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.color]
         */
        color?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.connector.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.customizeText]
       */
      customizeText?: (pointInfo: any) => string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.font]
       */
      font?: Font;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.format]
       */
      format?: DevExpress.ui.format;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.position]
       */
      position?: 'columns' | 'inside' | 'outside';
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.radialOffset]
       */
      radialOffset?: number;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.rotationAngle]
       */
      rotationAngle?: number;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.textOverflow]
       */
      textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.label.wordWrap]
       */
      wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
    };
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
    selectionStyle?: {
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border]
       */
      border?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching]
       */
      hatching?: {
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.direction]
         */
        direction?: HatchingDirectionType;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.selectionStyle.hatching.width]
         */
        width?: number;
      };
    };
    /**
     * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping]
     */
    smallValuesGrouping?: {
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.groupName]
       */
      groupName?: string;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.mode]
       */
      mode?: 'none' | 'smallValueThreshold' | 'topN';
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.threshold]
       */
      threshold?: number;
      /**
       * [descr:dxPieChartSeriesTypes.CommonPieChartSeries.smallValuesGrouping.topCount]
       */
      topCount?: number;
    };
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
   * [descr:dxPolarChart]
   */
  export class dxPolarChart extends BaseChart<dxPolarChartOptions> {
    /**
     * [descr:dxPolarChart.getValueAxis()]
     */
    getValueAxis(): chartAxisObject;
    /**
     * [descr:dxPolarChart.resetVisualRange()]
     */
    resetVisualRange(): void;
  }
  module dxPolarChart {
    export type ArgumentAxisClickEvent =
      DevExpress.events.NativeEventInfo<dxPolarChart> & {
        readonly argument: Date | number | string;
      };
    export type DisposingEvent = DevExpress.events.EventInfo<dxPolarChart>;
    export type DoneEvent = DevExpress.events.EventInfo<dxPolarChart>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxPolarChart>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxPolarChart>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxPolarChart> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxPolarChart>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxPolarChart> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxPolarChart>;
    export type LegendClickEvent =
      DevExpress.events.NativeEventInfo<dxPolarChart> & {
        readonly target: polarChartSeriesObject;
      };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxPolarChart> &
      DevExpress.events.ChangedOptionInfo;
    export type PointClickEvent =
      DevExpress.events.NativeEventInfo<dxPolarChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointHoverChangedEvent =
      DevExpress.events.EventInfo<dxPolarChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    export type PointSelectionChangedEvent =
      DevExpress.events.EventInfo<dxPolarChart> &
        DevExpress.viz.BaseChart.PointInteractionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export type PolarChartSeriesType =
      | 'area'
      | 'bar'
      | 'line'
      | 'scatter'
      | 'stackedbar';
    export type Properties = dxPolarChartOptions;
    export type SeriesClickEvent =
      DevExpress.events.NativeEventInfo<dxPolarChart> & {
        readonly target: polarChartSeriesObject;
      };
    export type SeriesHoverChangedEvent =
      DevExpress.events.EventInfo<dxPolarChart> & SeriesInteractionInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    interface SeriesInteractionInfo {
      target: polarChartSeriesObject;
    }
    export type SeriesSelectionChangedEvent =
      DevExpress.events.EventInfo<dxPolarChart> & SeriesInteractionInfo;
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxPolarChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxPolarChart> &
      DevExpress.viz.BaseChart.TooltipInfo;
    export type ZoomEndEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxPolarChart> & {
        readonly axis: chartAxisObject;
        readonly range: VizRange;
        readonly previousRange: VizRange;
        readonly actionType: 'zoom' | 'pan';
        readonly zoomFactor: number;
        readonly shift: number;
      };
    export type ZoomStartEvent = DevExpress.events.Cancelable &
      DevExpress.events.NativeEventInfo<dxPolarChart> & {
        readonly axis: chartAxisObject;
        readonly range: VizRange;
        readonly actionType: 'zoom' | 'pan';
      };
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
    /**
     * [descr:dxPolarChartOptions.adaptiveLayout.height]
     */
    height?: number;
    /**
     * [descr:dxPolarChartOptions.adaptiveLayout.width]
     */
    width?: number;
  }
  /**
   * [descr:dxPolarChartAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartAnnotationConfig
    extends dxPolarChartCommonAnnotationConfig {
    /**
     * [descr:dxPolarChartAnnotationConfig.name]
     */
    name?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxis
    extends dxPolarChartCommonAxisSettings {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.argumentType]
     */
    argumentType?: 'datetime' | 'numeric' | 'string';
    /**
     * [descr:dxPolarChartOptions.argumentAxis.axisDivisionFactor]
     */
    axisDivisionFactor?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.categories]
     */
    categories?: Array<number | string | Date>;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines]
     */
    constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.firstPointOnStartAngle]
     */
    firstPointOnStartAngle?: boolean;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.hoverMode]
     */
    hoverMode?: 'allArgumentPoints' | 'none';
    /**
     * [descr:dxPolarChartOptions.argumentAxis.label]
     */
    label?: dxPolarChartArgumentAxisLabel;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.linearThreshold]
     */
    linearThreshold?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.logarithmBase]
     */
    logarithmBase?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.minorTick]
     */
    minorTick?: dxPolarChartArgumentAxisMinorTick;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.minorTickCount]
     */
    minorTickCount?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.minorTickInterval]
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.originValue]
     */
    originValue?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.period]
     */
    period?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.startAngle]
     */
    startAngle?: number;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips]
     */
    strips?: Array<dxPolarChartArgumentAxisStrips>;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.tick]
     */
    tick?: dxPolarChartArgumentAxisTick;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.tickInterval]
     */
    tickInterval?: VizTimeInterval;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.type]
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisConstantLines
    extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines.displayBehindSeries]
     */
    displayBehindSeries?: boolean;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines.extendAxis]
     */
    extendAxis?: boolean;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines.label]
     */
    label?: dxPolarChartArgumentAxisConstantLinesLabel;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines.value]
     */
    value?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisConstantLinesLabel
    extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.constantLines.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisLabel
    extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.label.customizeHint]
     */
    customizeHint?: (argument: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.label.customizeText]
     */
    customizeText?: (argument: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.label.format]
     */
    format?: DevExpress.ui.format;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisMinorTick
    extends dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.minorTick.shift]
     */
    shift?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisStrips
    extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips.endValue]
     */
    endValue?: number | Date | string;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips.label]
     */
    label?: dxPolarChartArgumentAxisStripsLabel;
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips.startValue]
     */
    startValue?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisStripsLabel
    extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.strips.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartArgumentAxisTick
    extends dxPolarChartCommonAxisSettingsTick {
    /**
     * [descr:dxPolarChartOptions.argumentAxis.tick.shift]
     */
    shift?: number;
  }
  /**
   * [descr:dxPolarChartCommonAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAnnotationConfig
    extends BaseChartAnnotationConfig {
    /**
     * [descr:dxPolarChartCommonAnnotationConfig.angle]
     */
    angle?: number;
    /**
     * [descr:dxPolarChartCommonAnnotationConfig.radius]
     */
    radius?: number;
    /**
     * [descr:dxPolarChartCommonAnnotationConfig.customizeTooltip]
     */
    customizeTooltip?: (annotation: dxPolarChartAnnotationConfig | any) => any;
    /**
     * [descr:dxPolarChartCommonAnnotationConfig.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          annotation: dxPolarChartAnnotationConfig | any,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxPolarChartCommonAnnotationConfig.tooltipTemplate]
     */
    tooltipTemplate?:
      | DevExpress.core.template
      | ((
          annotation: dxPolarChartAnnotationConfig | any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettings {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.allowDecimals]
     */
    allowDecimals?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle]
     */
    constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.discreteAxisDivisionMode]
     */
    discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.endOnTick]
     */
    endOnTick?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.grid]
     */
    grid?: {
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.grid.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.grid.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.grid.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.grid.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.inverted]
     */
    inverted?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.label]
     */
    label?: dxPolarChartCommonAxisSettingsLabel;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorGrid]
     */
    minorGrid?: {
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.minorGrid.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.minorGrid.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.minorGrid.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartOptions.commonAxisSettings.minorGrid.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick]
     */
    minorTick?: dxPolarChartCommonAxisSettingsMinorTick;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.opacity]
     */
    opacity?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.stripStyle]
     */
    stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick]
     */
    tick?: dxPolarChartCommonAxisSettingsTick;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.dashStyle]
     */
    dashStyle?: DashStyleType;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.label]
     */
    label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.font]
     */
    font?: Font;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.constantLineStyle.label.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsLabel {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.label.font]
     */
    font?: Font;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.label.indentFromAxis]
     */
    indentFromAxis?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.label.overlappingBehavior]
     */
    overlappingBehavior?: 'none' | 'hide';
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.label.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsMinorTick {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick.length]
     */
    length?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick.opacity]
     */
    opacity?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.minorTick.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.stripStyle.label]
     */
    label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.stripStyle.label.font]
     */
    font?: Font;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonAxisSettingsTick {
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick.length]
     */
    length?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick.opacity]
     */
    opacity?: number;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick.visible]
     */
    visible?: boolean;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings.tick.width]
     */
    width?: number;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartCommonSeriesSettings
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.area]
     */
    area?: any;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.bar]
     */
    bar?: any;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.line]
     */
    line?: any;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.scatter]
     */
    scatter?: any;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.stackedbar]
     */
    stackedbar?: any;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings.type]
     */
    type?: DevExpress.viz.dxPolarChart.PolarChartSeriesType;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartLegend extends BaseChartLegend {
    /**
     * [descr:dxPolarChartOptions.legend.customizeHint]
     */
    customizeHint?: (seriesInfo: {
      seriesName?: any;
      seriesIndex?: number;
      seriesColor?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.legend.customizeText]
     */
    customizeText?: (seriesInfo: {
      seriesName?: any;
      seriesIndex?: number;
      seriesColor?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.legend.hoverMode]
     */
    hoverMode?: 'excludePoints' | 'includePoints' | 'none';
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
    /**
     * [descr:dxPolarChartOptions.adaptiveLayout]
     */
    adaptiveLayout?: dxPolarChartAdaptiveLayout;
    /**
     * [descr:dxPolarChartOptions.annotations]
     */
    annotations?: Array<dxPolarChartAnnotationConfig | any>;
    /**
     * [descr:dxPolarChartOptions.argumentAxis]
     */
    argumentAxis?: dxPolarChartArgumentAxis;
    /**
     * [descr:dxPolarChartOptions.barGroupPadding]
     */
    barGroupPadding?: number;
    /**
     * [descr:dxPolarChartOptions.barGroupWidth]
     */
    barGroupWidth?: number;
    /**
     * [descr:dxPolarChartOptions.commonAnnotationSettings]
     */
    commonAnnotationSettings?: dxPolarChartCommonAnnotationConfig;
    /**
     * [descr:dxPolarChartOptions.commonAxisSettings]
     */
    commonAxisSettings?: dxPolarChartCommonAxisSettings;
    /**
     * [descr:dxPolarChartOptions.commonSeriesSettings]
     */
    commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
    /**
     * [descr:dxPolarChartOptions.containerBackgroundColor]
     */
    containerBackgroundColor?: string;
    /**
     * [descr:dxPolarChartOptions.customizeAnnotation]
     */
    customizeAnnotation?: (
      annotation: dxPolarChartAnnotationConfig | any
    ) => dxPolarChartAnnotationConfig;
    /**
     * [descr:dxPolarChartOptions.dataPrepareSettings]
     */
    dataPrepareSettings?: {
      /**
       * [descr:dxPolarChartOptions.dataPrepareSettings.checkTypeForAllData]
       */
      checkTypeForAllData?: boolean;
      /**
       * [descr:dxPolarChartOptions.dataPrepareSettings.convertToAxisDataType]
       */
      convertToAxisDataType?: boolean;
      /**
       * [descr:dxPolarChartOptions.dataPrepareSettings.sortingMethod]
       */
      sortingMethod?:
        | boolean
        | ((
            a: { arg?: Date | number | string; val?: Date | number | string },
            b: { arg?: Date | number | string; val?: Date | number | string }
          ) => number);
    };
    /**
     * [descr:dxPolarChartOptions.legend]
     */
    legend?: dxPolarChartLegend;
    /**
     * [descr:dxPolarChartOptions.negativesAsZeroes]
     */
    negativesAsZeroes?: boolean;
    /**
     * [descr:dxPolarChartOptions.onArgumentAxisClick]
     */
    onArgumentAxisClick?:
      | ((e: {
          component?: dxPolarChart;
          element?: DevExpress.core.DxElement;
          model?: any;
          event?: DevExpress.events.DxEvent;
          argument?: Date | number | string;
        }) => void)
      | string;
    /**
     * [descr:dxPolarChartOptions.onLegendClick]
     */
    onLegendClick?:
      | ((e: DevExpress.viz.dxPolarChart.LegendClickEvent) => void)
      | string;
    /**
     * [descr:dxPolarChartOptions.onSeriesClick]
     */
    onSeriesClick?:
      | ((e: DevExpress.viz.dxPolarChart.SeriesClickEvent) => void)
      | string;
    /**
     * [descr:dxPolarChartOptions.onSeriesHoverChanged]
     */
    onSeriesHoverChanged?: (
      e: DevExpress.viz.dxPolarChart.SeriesHoverChangedEvent
    ) => void;
    /**
     * [descr:dxPolarChartOptions.onSeriesSelectionChanged]
     */
    onSeriesSelectionChanged?: (
      e: DevExpress.viz.dxPolarChart.SeriesSelectionChangedEvent
    ) => void;
    /**
     * [descr:dxPolarChartOptions.onZoomEnd]
     */
    onZoomEnd?: (e: DevExpress.viz.dxPolarChart.ZoomEndEvent) => void;
    /**
     * [descr:dxPolarChartOptions.onZoomStart]
     */
    onZoomStart?: (e: DevExpress.viz.dxPolarChart.ZoomStartEvent) => void;
    /**
     * [descr:dxPolarChartOptions.resolveLabelOverlapping]
     */
    resolveLabelOverlapping?: 'hide' | 'none';
    /**
     * [descr:dxPolarChartOptions.series]
     */
    series?: PolarChartSeries | Array<PolarChartSeries>;
    /**
     * [descr:dxPolarChartOptions.seriesSelectionMode]
     */
    seriesSelectionMode?: 'multiple' | 'single';
    /**
     * [descr:dxPolarChartOptions.seriesTemplate]
     */
    seriesTemplate?: {
      /**
       * [descr:dxPolarChartOptions.seriesTemplate.customizeSeries]
       */
      customizeSeries?: (seriesName: any) => PolarChartSeries;
      /**
       * [descr:dxPolarChartOptions.seriesTemplate.nameField]
       */
      nameField?: string;
    };
    /**
     * [descr:dxPolarChartOptions.tooltip]
     */
    tooltip?: dxPolarChartTooltip;
    /**
     * [descr:dxPolarChartOptions.useSpiderWeb]
     */
    useSpiderWeb?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis]
     */
    valueAxis?: dxPolarChartValueAxis;
  }
  /**
   * [descr:dxPolarChartSeriesTypes]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesAreapolarseries
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesAreapolarseriesPoint
    extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * [descr:dxPolarChartSeriesTypes.areapolarseries.point.visible]
     */
    visible?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesBarpolarseries
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
    /**
     * [descr:dxPolarChartSeriesTypes.barpolarseries.hoverMode]
     */
    hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    /**
     * [descr:dxPolarChartSeriesTypes.barpolarseries.selectionMode]
     */
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    border?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.border.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.border.width]
       */
      width?: number;
    };
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
    dashStyle?: DashStyleType;
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverMode]
     */
    hoverMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'excludePoints'
      | 'includePoints'
      | 'nearestPoint'
      | 'none'
      | 'onlyPoint';
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle]
     */
    hoverStyle?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border]
       */
      border?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching]
       */
      hatching?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.direction]
         */
        direction?: HatchingDirectionType;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.hatching.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.hoverStyle.width]
       */
      width?: number;
    };
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
    selectionMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'excludePoints'
      | 'includePoints'
      | 'none'
      | 'onlyPoint';
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle]
     */
    selectionStyle?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border]
       */
      border?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.dashStyle]
         */
        dashStyle?: DashStyleType;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching]
       */
      hatching?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.direction]
         */
        direction?: HatchingDirectionType;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.step]
         */
        step?: number;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.hatching.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.selectionStyle.width]
       */
      width?: number;
    };
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
    valueErrorBar?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.displayMode]
       */
      displayMode?: 'auto' | 'high' | 'low' | 'none';
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.edgeLength]
       */
      edgeLength?: number;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.highValueField]
       */
      highValueField?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lineWidth]
       */
      lineWidth?: number;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.lowValueField]
       */
      lowValueField?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.type]
       */
      type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance';
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.valueErrorBar.value]
       */
      value?: number;
    };
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
    border?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.dashStyle]
       */
      dashStyle?: DashStyleType;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.border.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector]
     */
    connector?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.connector.width]
       */
      width?: number;
    };
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.label.customizeText]
     */
    customizeText?: (pointInfo: any) => string;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border]
     */
    border?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.visible]
       */
      visible?: boolean;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.border.width]
       */
      width?: number;
    };
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
    hoverStyle?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border]
       */
      border?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.hoverStyle.size]
       */
      size?: number;
    };
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image]
     */
    image?:
      | string
      | {
          /**
           * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.height]
           */
          height?: number;
          /**
           * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.url]
           */
          url?: string;
          /**
           * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.image.width]
           */
          width?: number;
        };
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionMode]
     */
    selectionMode?:
      | 'allArgumentPoints'
      | 'allSeriesPoints'
      | 'none'
      | 'onlyPoint';
    /**
     * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle]
     */
    selectionStyle?: {
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border]
       */
      border?: {
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.color]
         */
        color?: string;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.color]
       */
      color?: string;
      /**
       * [descr:dxPolarChartSeriesTypes.CommonPolarChartSeries.point.selectionStyle.size]
       */
      size?: number;
    };
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesLinepolarseries
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesStackedbarpolarseries
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
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
    selectionMode?:
      | 'onlyPoint'
      | 'allSeriesPoints'
      | 'allArgumentPoints'
      | 'none';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel
    extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
    /**
     * [descr:dxPolarChartSeriesTypes.stackedbarpolarseries.label.position]
     */
    position?: 'inside' | 'outside';
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartTooltip extends BaseChartTooltip {
    /**
     * [descr:dxPolarChartOptions.tooltip.shared]
     */
    shared?: boolean;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxis
    extends dxPolarChartCommonAxisSettings {
    /**
     * [descr:dxPolarChartOptions.valueAxis.axisDivisionFactor]
     */
    axisDivisionFactor?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.categories]
     */
    categories?: Array<number | string | Date>;
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines]
     */
    constantLines?: Array<dxPolarChartValueAxisConstantLines>;
    /**
     * [descr:dxPolarChartOptions.valueAxis.endOnTick]
     */
    endOnTick?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis.label]
     */
    label?: dxPolarChartValueAxisLabel;
    /**
     * [descr:dxPolarChartOptions.valueAxis.linearThreshold]
     */
    linearThreshold?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.logarithmBase]
     */
    logarithmBase?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.maxValueMargin]
     */
    maxValueMargin?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.minValueMargin]
     */
    minValueMargin?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.minVisualRangeLength]
     */
    minVisualRangeLength?: VizTimeInterval;
    /**
     * [descr:dxPolarChartOptions.valueAxis.minorTickCount]
     */
    minorTickCount?: number;
    /**
     * [descr:dxPolarChartOptions.valueAxis.minorTickInterval]
     */
    minorTickInterval?: VizTimeInterval;
    /**
     * [descr:dxPolarChartOptions.valueAxis.showZero]
     */
    showZero?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips]
     */
    strips?: Array<dxPolarChartValueAxisStrips>;
    /**
     * [descr:dxPolarChartOptions.valueAxis.tick]
     */
    tick?: dxPolarChartValueAxisTick;
    /**
     * [descr:dxPolarChartOptions.valueAxis.tickInterval]
     */
    tickInterval?: VizTimeInterval;
    /**
     * [descr:dxPolarChartOptions.valueAxis.type]
     */
    type?: 'continuous' | 'discrete' | 'logarithmic';
    /**
     * [descr:dxPolarChartOptions.valueAxis.valueMarginsEnabled]
     */
    valueMarginsEnabled?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis.valueType]
     */
    valueType?: 'datetime' | 'numeric' | 'string';
    /**
     * [descr:dxPolarChartOptions.valueAxis.visualRange]
     */
    visualRange?: VizRange | Array<number | string | Date>;
    /**
     * [descr:dxPolarChartOptions.valueAxis.visualRangeUpdateMode]
     */
    visualRangeUpdateMode?: 'auto' | 'keep' | 'reset';
    /**
     * [descr:dxPolarChartOptions.valueAxis.wholeRange]
     */
    wholeRange?: VizRange | Array<number | string | Date>;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisConstantLines
    extends dxPolarChartCommonAxisSettingsConstantLineStyle {
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines.displayBehindSeries]
     */
    displayBehindSeries?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines.extendAxis]
     */
    extendAxis?: boolean;
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines.label]
     */
    label?: dxPolarChartValueAxisConstantLinesLabel;
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines.value]
     */
    value?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisConstantLinesLabel
    extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
    /**
     * [descr:dxPolarChartOptions.valueAxis.constantLines.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisLabel
    extends dxPolarChartCommonAxisSettingsLabel {
    /**
     * [descr:dxPolarChartOptions.valueAxis.label.customizeHint]
     */
    customizeHint?: (axisValue: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.valueAxis.label.customizeText]
     */
    customizeText?: (axisValue: {
      value?: Date | number | string;
      valueText?: string;
    }) => string;
    /**
     * [descr:dxPolarChartOptions.valueAxis.label.format]
     */
    format?: DevExpress.ui.format;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisStrips
    extends dxPolarChartCommonAxisSettingsStripStyle {
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips.color]
     */
    color?: string;
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips.endValue]
     */
    endValue?: number | Date | string;
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips.label]
     */
    label?: dxPolarChartValueAxisStripsLabel;
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips.startValue]
     */
    startValue?: number | Date | string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisStripsLabel
    extends dxPolarChartCommonAxisSettingsStripStyleLabel {
    /**
     * [descr:dxPolarChartOptions.valueAxis.strips.label.text]
     */
    text?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxPolarChartValueAxisTick
    extends dxPolarChartCommonAxisSettingsTick {
    /**
     * [descr:dxPolarChartOptions.valueAxis.tick.visible]
     */
    visible?: boolean;
  }
  /**
   * [descr:dxRangeSelector]
   */
  export class dxRangeSelector extends BaseWidget<dxRangeSelectorOptions> {
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxRangeSelector.getValue()]
     */
    getValue(): Array<number | string | Date>;
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
  module dxRangeSelector {
    export type DisposingEvent = DevExpress.events.EventInfo<dxRangeSelector>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxRangeSelector>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxRangeSelector>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxRangeSelector> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxRangeSelector>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxRangeSelector> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxRangeSelector>;
    export type OptionChangedEvent =
      DevExpress.events.EventInfo<dxRangeSelector> &
        DevExpress.events.ChangedOptionInfo;
    export type Properties = dxRangeSelectorOptions;
    export type ValueChangedEvent =
      DevExpress.events.NativeEventInfo<dxRangeSelector> & {
        readonly value: Array<number | string | Date>;
        readonly previousValue: Array<number | string | Date>;
      };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxRangeSelectorOptions
    extends BaseWidgetOptions<dxRangeSelector> {
    /**
     * [descr:dxRangeSelectorOptions.background]
     */
    background?: {
      /**
       * [descr:dxRangeSelectorOptions.background.color]
       */
      color?: string;
      /**
       * [descr:dxRangeSelectorOptions.background.image]
       */
      image?: {
        /**
         * [descr:dxRangeSelectorOptions.background.image.location]
         */
        location?:
          | 'center'
          | 'centerBottom'
          | 'centerTop'
          | 'full'
          | 'leftBottom'
          | 'leftCenter'
          | 'leftTop'
          | 'rightBottom'
          | 'rightCenter'
          | 'rightTop';
        /**
         * [descr:dxRangeSelectorOptions.background.image.url]
         */
        url?: string;
      };
      /**
       * [descr:dxRangeSelectorOptions.background.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxRangeSelectorOptions.behavior]
     */
    behavior?: {
      /**
       * [descr:dxRangeSelectorOptions.behavior.allowSlidersSwap]
       */
      allowSlidersSwap?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.behavior.animationEnabled]
       */
      animationEnabled?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.behavior.callValueChanged]
       */
      callValueChanged?: 'onMoving' | 'onMovingComplete';
      /**
       * [descr:dxRangeSelectorOptions.behavior.manualRangeSelectionEnabled]
       */
      manualRangeSelectionEnabled?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.behavior.moveSelectedRangeByClick]
       */
      moveSelectedRangeByClick?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.behavior.snapToTicks]
       */
      snapToTicks?: boolean;
    };
    /**
     * [descr:dxRangeSelectorOptions.chart]
     */
    chart?: {
      /**
       * [descr:dxRangeSelectorOptions.chart.barGroupPadding]
       */
      barGroupPadding?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.barGroupWidth]
       */
      barGroupWidth?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.bottomIndent]
       */
      bottomIndent?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.commonSeriesSettings]
       */
      commonSeriesSettings?: dxChartCommonSeriesSettings;
      /**
       * [descr:dxRangeSelectorOptions.chart.dataPrepareSettings]
       */
      dataPrepareSettings?: {
        /**
         * [descr:dxRangeSelectorOptions.chart.dataPrepareSettings.checkTypeForAllData]
         */
        checkTypeForAllData?: boolean;
        /**
         * [descr:dxRangeSelectorOptions.chart.dataPrepareSettings.convertToAxisDataType]
         */
        convertToAxisDataType?: boolean;
        /**
         * [descr:dxRangeSelectorOptions.chart.dataPrepareSettings.sortingMethod]
         */
        sortingMethod?:
          | boolean
          | ((
              a: { arg?: Date | number | string; val?: Date | number | string },
              b: { arg?: Date | number | string; val?: Date | number | string }
            ) => number);
      };
      /**
       * [descr:dxRangeSelectorOptions.chart.maxBubbleSize]
       */
      maxBubbleSize?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.minBubbleSize]
       */
      minBubbleSize?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.negativesAsZeroes]
       */
      negativesAsZeroes?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.chart.palette]
       */
      palette?: Array<string> | PaletteType;
      /**
       * [descr:dxRangeSelectorOptions.chart.paletteExtensionMode]
       */
      paletteExtensionMode?: PaletteExtensionModeType;
      /**
       * [descr:dxRangeSelectorOptions.chart.series]
       */
      series?: ChartSeries | Array<ChartSeries>;
      /**
       * [descr:dxRangeSelectorOptions.chart.seriesTemplate]
       */
      seriesTemplate?: {
        /**
         * [descr:dxRangeSelectorOptions.chart.seriesTemplate.customizeSeries]
         */
        customizeSeries?: (seriesName: any) => ChartSeries;
        /**
         * [descr:dxRangeSelectorOptions.chart.seriesTemplate.nameField]
         */
        nameField?: string;
      };
      /**
       * [descr:dxRangeSelectorOptions.chart.topIndent]
       */
      topIndent?: number;
      /**
       * [descr:dxRangeSelectorOptions.chart.valueAxis]
       */
      valueAxis?: {
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.inverted]
         */
        inverted?: boolean;
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.logarithmBase]
         */
        logarithmBase?: number;
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.max]
         */
        max?: number;
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.min]
         */
        min?: number;
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.type]
         */
        type?: 'continuous' | 'logarithmic';
        /**
         * [descr:dxRangeSelectorOptions.chart.valueAxis.valueType]
         */
        valueType?: 'datetime' | 'numeric' | 'string';
      };
    };
    /**
     * [descr:dxRangeSelectorOptions.containerBackgroundColor]
     */
    containerBackgroundColor?: string;
    /**
     * [descr:dxRangeSelectorOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:dxRangeSelectorOptions.dataSourceField]
     */
    dataSourceField?: string;
    /**
     * [descr:dxRangeSelectorOptions.indent]
     */
    indent?: {
      /**
       * [descr:dxRangeSelectorOptions.indent.left]
       */
      left?: number;
      /**
       * [descr:dxRangeSelectorOptions.indent.right]
       */
      right?: number;
    };
    /**
     * [descr:dxRangeSelectorOptions.onValueChanged]
     */
    onValueChanged?: (
      e: DevExpress.viz.dxRangeSelector.ValueChangedEvent
    ) => void;
    /**
     * [descr:dxRangeSelectorOptions.scale]
     */
    scale?: {
      /**
       * [descr:dxRangeSelectorOptions.scale.aggregateByCategory]
       */
      aggregateByCategory?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.scale.aggregationGroupWidth]
       */
      aggregationGroupWidth?: number;
      /**
       * [descr:dxRangeSelectorOptions.scale.aggregationInterval]
       */
      aggregationInterval?: VizTimeInterval;
      /**
       * [descr:dxRangeSelectorOptions.scale.allowDecimals]
       */
      allowDecimals?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.scale.breakStyle]
       */
      breakStyle?: {
        /**
         * [descr:dxRangeSelectorOptions.scale.breakStyle.color]
         */
        color?: string;
        /**
         * [descr:dxRangeSelectorOptions.scale.breakStyle.line]
         */
        line?: 'straight' | 'waved';
        /**
         * [descr:dxRangeSelectorOptions.scale.breakStyle.width]
         */
        width?: number;
      };
      /**
       * [descr:dxRangeSelectorOptions.scale.breaks]
       */
      breaks?: Array<ScaleBreak>;
      /**
       * [descr:dxRangeSelectorOptions.scale.categories]
       */
      categories?: Array<number | string | Date>;
      /**
       * [descr:dxRangeSelectorOptions.scale.endOnTick]
       */
      endOnTick?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.scale.endValue]
       */
      endValue?: number | Date | string;
      /**
       * [descr:dxRangeSelectorOptions.scale.holidays]
       */
      holidays?: Array<Date | string> | Array<number>;
      /**
       * [descr:dxRangeSelectorOptions.scale.label]
       */
      label?: {
        /**
         * [descr:dxRangeSelectorOptions.scale.label.customizeText]
         */
        customizeText?: (scaleValue: {
          value?: Date | number | string;
          valueText?: string;
        }) => string;
        /**
         * [descr:dxRangeSelectorOptions.scale.label.font]
         */
        font?: Font;
        /**
         * [descr:dxRangeSelectorOptions.scale.label.format]
         */
        format?: DevExpress.ui.format;
        /**
         * [descr:dxRangeSelectorOptions.scale.label.overlappingBehavior]
         */
        overlappingBehavior?: 'hide' | 'none';
        /**
         * [descr:dxRangeSelectorOptions.scale.label.topIndent]
         */
        topIndent?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.label.visible]
         */
        visible?: boolean;
      };
      /**
       * [descr:dxRangeSelectorOptions.scale.linearThreshold]
       */
      linearThreshold?: number;
      /**
       * [descr:dxRangeSelectorOptions.scale.logarithmBase]
       */
      logarithmBase?: number;
      /**
       * [descr:dxRangeSelectorOptions.scale.marker]
       */
      marker?: {
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.label]
         */
        label?: {
          /**
           * [descr:dxRangeSelectorOptions.scale.marker.label.customizeText]
           */
          customizeText?: (markerValue: {
            value?: Date | number;
            valueText?: string;
          }) => string;
          /**
           * [descr:dxRangeSelectorOptions.scale.marker.label.format]
           */
          format?: DevExpress.ui.format;
        };
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.separatorHeight]
         */
        separatorHeight?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.textLeftIndent]
         */
        textLeftIndent?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.textTopIndent]
         */
        textTopIndent?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.topIndent]
         */
        topIndent?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.marker.visible]
         */
        visible?: boolean;
      };
      /**
       * [descr:dxRangeSelectorOptions.scale.maxRange]
       */
      maxRange?: VizTimeInterval;
      /**
       * [descr:dxRangeSelectorOptions.scale.minRange]
       */
      minRange?: VizTimeInterval;
      /**
       * [descr:dxRangeSelectorOptions.scale.minorTick]
       */
      minorTick?: {
        /**
         * [descr:dxRangeSelectorOptions.scale.minorTick.color]
         */
        color?: string;
        /**
         * [descr:dxRangeSelectorOptions.scale.minorTick.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.minorTick.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxRangeSelectorOptions.scale.minorTick.width]
         */
        width?: number;
      };
      /**
       * [descr:dxRangeSelectorOptions.scale.minorTickCount]
       */
      minorTickCount?: number;
      /**
       * [descr:dxRangeSelectorOptions.scale.minorTickInterval]
       */
      minorTickInterval?: VizTimeInterval;
      /**
       * [descr:dxRangeSelectorOptions.scale.placeholderHeight]
       */
      placeholderHeight?: number;
      /**
       * [descr:dxRangeSelectorOptions.scale.showCustomBoundaryTicks]
       */
      showCustomBoundaryTicks?: boolean;
      /**
       * [descr:dxRangeSelectorOptions.scale.singleWorkdays]
       */
      singleWorkdays?: Array<Date | string> | Array<number>;
      /**
       * [descr:dxRangeSelectorOptions.scale.startValue]
       */
      startValue?: number | Date | string;
      /**
       * [descr:dxRangeSelectorOptions.scale.tick]
       */
      tick?: {
        /**
         * [descr:dxRangeSelectorOptions.scale.tick.color]
         */
        color?: string;
        /**
         * [descr:dxRangeSelectorOptions.scale.tick.opacity]
         */
        opacity?: number;
        /**
         * [descr:dxRangeSelectorOptions.scale.tick.width]
         */
        width?: number;
      };
      /**
       * [descr:dxRangeSelectorOptions.scale.tickInterval]
       */
      tickInterval?: VizTimeInterval;
      /**
       * [descr:dxRangeSelectorOptions.scale.type]
       */
      type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete';
      /**
       * [descr:dxRangeSelectorOptions.scale.valueType]
       */
      valueType?: 'datetime' | 'numeric' | 'string';
      /**
       * [descr:dxRangeSelectorOptions.scale.workWeek]
       */
      workWeek?: Array<number>;
      /**
       * [descr:dxRangeSelectorOptions.scale.workdaysOnly]
       */
      workdaysOnly?: boolean;
    };
    /**
     * [descr:dxRangeSelectorOptions.selectedRangeColor]
     */
    selectedRangeColor?: string;
    /**
     * [descr:dxRangeSelectorOptions.selectedRangeUpdateMode]
     */
    selectedRangeUpdateMode?: 'auto' | 'keep' | 'reset' | 'shift';
    /**
     * [descr:dxRangeSelectorOptions.shutter]
     */
    shutter?: {
      /**
       * [descr:dxRangeSelectorOptions.shutter.color]
       */
      color?: string;
      /**
       * [descr:dxRangeSelectorOptions.shutter.opacity]
       */
      opacity?: number;
    };
    /**
     * [descr:dxRangeSelectorOptions.sliderHandle]
     */
    sliderHandle?: {
      /**
       * [descr:dxRangeSelectorOptions.sliderHandle.color]
       */
      color?: string;
      /**
       * [descr:dxRangeSelectorOptions.sliderHandle.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxRangeSelectorOptions.sliderHandle.width]
       */
      width?: number;
    };
    /**
     * [descr:dxRangeSelectorOptions.sliderMarker]
     */
    sliderMarker?: {
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.color]
       */
      color?: string;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.customizeText]
       */
      customizeText?: (scaleValue: {
        value?: Date | number | string;
        valueText?: string;
      }) => string;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.font]
       */
      font?: Font;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.format]
       */
      format?: DevExpress.ui.format;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.invalidRangeColor]
       */
      invalidRangeColor?: string;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.paddingLeftRight]
       */
      paddingLeftRight?: number;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.paddingTopBottom]
       */
      paddingTopBottom?: number;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.placeholderHeight]
       */
      placeholderHeight?: number;
      /**
       * [descr:dxRangeSelectorOptions.sliderMarker.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxRangeSelectorOptions.tooltip]
     */
    tooltip?: BaseWidgetTooltip;
    /**
     * [descr:dxRangeSelectorOptions.value]
     */
    value?: Array<number | string | Date> | VizRange;
  }
  /**
   * [descr:dxSankey]
   */
  export class dxSankey extends BaseWidget<dxSankeyOptions> {
    /**
     * [descr:dxSankey.getAllLinks()]
     */
    getAllLinks(): Array<dxSankeyLink>;
    /**
     * [descr:dxSankey.getAllNodes()]
     */
    getAllNodes(): Array<dxSankeyNode>;
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:dxSankey.hideTooltip()]
     */
    hideTooltip(): void;
  }
  module dxSankey {
    export type DisposingEvent = DevExpress.events.EventInfo<dxSankey>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxSankey>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxSankey>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxSankey> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxSankey>;
    export type IncidentOccurredEvent = DevExpress.events.EventInfo<dxSankey> &
      DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSankey>;
    export type LinkClickEvent = DevExpress.events.NativeEventInfo<dxSankey> & {
      readonly target: dxSankeyLink;
    };
    export type LinkHoverEvent = DevExpress.events.EventInfo<dxSankey> & {
      readonly target: dxSankeyLink;
    };
    export type NodeClickEvent = DevExpress.events.NativeEventInfo<dxSankey> & {
      readonly target: dxSankeyNode;
    };
    export type NodeHoverEvent = DevExpress.events.EventInfo<dxSankey> & {
      readonly target: dxSankeyNode;
    };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSankey> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSankeyOptions;
  }
  /**
   * [descr:dxSankeyConnectionInfoObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSankeyLink {
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSankeyNode {
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
     * [descr:dxSankeyNode.showTooltip()]
     */
    showTooltip(): void;
    /**
     * [descr:dxSankeyNode.title]
     * @deprecated [depNote:dxSankeyNode.title]
     */
    title?: string;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSankeyOptions extends BaseWidgetOptions<dxSankey> {
    /**
     * [descr:dxSankeyOptions.adaptiveLayout]
     */
    adaptiveLayout?: {
      /**
       * [descr:dxSankeyOptions.adaptiveLayout.height]
       */
      height?: number;
      /**
       * [descr:dxSankeyOptions.adaptiveLayout.keepLabels]
       */
      keepLabels?: boolean;
      /**
       * [descr:dxSankeyOptions.adaptiveLayout.width]
       */
      width?: number;
    };
    /**
     * [descr:dxSankeyOptions.alignment]
     */
    alignment?:
      | 'bottom'
      | 'center'
      | 'top'
      | Array<'bottom' | 'center' | 'top'>;
    /**
     * [descr:dxSankeyOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:dxSankeyOptions.hoverEnabled]
     */
    hoverEnabled?: boolean;
    /**
     * [descr:dxSankeyOptions.label]
     */
    label?: {
      /**
       * [descr:dxSankeyOptions.label.border]
       */
      border?: {
        /**
         * [descr:dxSankeyOptions.label.border.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.label.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxSankeyOptions.label.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxSankeyOptions.label.customizeText]
       */
      customizeText?: (itemInfo: dxSankeyNode) => string;
      /**
       * [descr:dxSankeyOptions.label.font]
       */
      font?: Font;
      /**
       * [descr:dxSankeyOptions.label.horizontalOffset]
       */
      horizontalOffset?: number;
      /**
       * [descr:dxSankeyOptions.label.overlappingBehavior]
       */
      overlappingBehavior?: 'ellipsis' | 'hide' | 'none';
      /**
       * [descr:dxSankeyOptions.label.shadow]
       */
      shadow?: {
        /**
         * [descr:dxSankeyOptions.label.shadow.blur]
         */
        blur?: number;
        /**
         * [descr:dxSankeyOptions.label.shadow.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.label.shadow.offsetX]
         */
        offsetX?: number;
        /**
         * [descr:dxSankeyOptions.label.shadow.offsetY]
         */
        offsetY?: number;
        /**
         * [descr:dxSankeyOptions.label.shadow.opacity]
         */
        opacity?: number;
      };
      /**
       * [descr:dxSankeyOptions.label.useNodeColors]
       */
      useNodeColors?: boolean;
      /**
       * [descr:dxSankeyOptions.label.verticalOffset]
       */
      verticalOffset?: number;
      /**
       * [descr:dxSankeyOptions.label.visible]
       */
      visible?: boolean;
    };
    /**
     * [descr:dxSankeyOptions.link]
     */
    link?: {
      /**
       * [descr:dxSankeyOptions.link.border]
       */
      border?: {
        /**
         * [descr:dxSankeyOptions.link.border.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.link.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxSankeyOptions.link.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxSankeyOptions.link.color]
       */
      color?: string;
      /**
       * [descr:dxSankeyOptions.link.colorMode]
       */
      colorMode?: 'none' | 'source' | 'target' | 'gradient';
      /**
       * [descr:dxSankeyOptions.link.hoverStyle]
       */
      hoverStyle?: {
        /**
         * [descr:dxSankeyOptions.link.hoverStyle.border]
         */
        border?: {
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.border.visible]
           */
          visible?: boolean;
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxSankeyOptions.link.hoverStyle.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.link.hoverStyle.hatching]
         */
        hatching?: {
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.hatching.direction]
           */
          direction?: HatchingDirectionType;
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.hatching.opacity]
           */
          opacity?: number;
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.hatching.step]
           */
          step?: number;
          /**
           * [descr:dxSankeyOptions.link.hoverStyle.hatching.width]
           */
          width?: number;
        };
        /**
         * [descr:dxSankeyOptions.link.hoverStyle.opacity]
         */
        opacity?: number;
      };
      /**
       * [descr:dxSankeyOptions.link.opacity]
       */
      opacity?: number;
    };
    /**
     * [descr:dxSankeyOptions.node]
     */
    node?: {
      /**
       * [descr:dxSankeyOptions.node.border]
       */
      border?: {
        /**
         * [descr:dxSankeyOptions.node.border.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.node.border.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxSankeyOptions.node.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxSankeyOptions.node.color]
       */
      color?: string;
      /**
       * [descr:dxSankeyOptions.node.hoverStyle]
       */
      hoverStyle?: {
        /**
         * [descr:dxSankeyOptions.node.hoverStyle.border]
         */
        border?: {
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.border.visible]
           */
          visible?: boolean;
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxSankeyOptions.node.hoverStyle.color]
         */
        color?: string;
        /**
         * [descr:dxSankeyOptions.node.hoverStyle.hatching]
         */
        hatching?: {
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.hatching.direction]
           */
          direction?: HatchingDirectionType;
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.hatching.opacity]
           */
          opacity?: number;
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.hatching.step]
           */
          step?: number;
          /**
           * [descr:dxSankeyOptions.node.hoverStyle.hatching.width]
           */
          width?: number;
        };
        /**
         * [descr:dxSankeyOptions.node.hoverStyle.opacity]
         */
        opacity?: number;
      };
      /**
       * [descr:dxSankeyOptions.node.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxSankeyOptions.node.padding]
       */
      padding?: number;
      /**
       * [descr:dxSankeyOptions.node.width]
       */
      width?: number;
    };
    /**
     * [descr:dxSankeyOptions.onLinkClick]
     */
    onLinkClick?:
      | ((e: DevExpress.viz.dxSankey.LinkClickEvent) => void)
      | string;
    /**
     * [descr:dxSankeyOptions.onLinkHoverChanged]
     */
    onLinkHoverChanged?: (e: DevExpress.viz.dxSankey.LinkHoverEvent) => void;
    /**
     * [descr:dxSankeyOptions.onNodeClick]
     */
    onNodeClick?:
      | ((e: DevExpress.viz.dxSankey.NodeClickEvent) => void)
      | string;
    /**
     * [descr:dxSankeyOptions.onNodeHoverChanged]
     */
    onNodeHoverChanged?: (e: DevExpress.viz.dxSankey.NodeHoverEvent) => void;
    /**
     * [descr:dxSankeyOptions.palette]
     */
    palette?: Array<string> | PaletteType;
    /**
     * [descr:dxSankeyOptions.paletteExtensionMode]
     */
    paletteExtensionMode?: PaletteExtensionModeType;
    /**
     * [descr:dxSankeyOptions.sortData]
     */
    sortData?: any;
    /**
     * [descr:dxSankeyOptions.sourceField]
     */
    sourceField?: string;
    /**
     * [descr:dxSankeyOptions.targetField]
     */
    targetField?: string;
    /**
     * [descr:dxSankeyOptions.tooltip]
     */
    tooltip?: dxSankeyTooltip;
    /**
     * [descr:dxSankeyOptions.weightField]
     */
    weightField?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSankeyTooltip extends BaseWidgetTooltip {
    /**
     * [descr:dxSankeyOptions.tooltip.customizeLinkTooltip]
     */
    customizeLinkTooltip?: (info: {
      source?: string;
      target?: string;
      weight?: number;
    }) => any;
    /**
     * [descr:dxSankeyOptions.tooltip.customizeNodeTooltip]
     */
    customizeNodeTooltip?: (info: {
      title?: string;
      label?: string;
      weightIn?: number;
      weightOut?: number;
    }) => any;
    /**
     * [descr:dxSankeyOptions.tooltip.enabled]
     */
    enabled?: boolean;
    /**
     * [descr:dxSankeyOptions.tooltip.linkTooltipTemplate]
     */
    linkTooltipTemplate?:
      | DevExpress.core.template
      | ((
          info: { source?: string; target?: string; weight?: number },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxSankeyOptions.tooltip.nodeTooltipTemplate]
     */
    nodeTooltipTemplate?:
      | DevExpress.core.template
      | ((
          info: { label?: string; weightIn?: number; weightOut?: number },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * [descr:dxSparkline]
   */
  export class dxSparkline extends BaseSparkline<dxSparklineOptions> {
    getDataSource(): DevExpress.data.DataSource;
  }
  module dxSparkline {
    export type DisposingEvent = DevExpress.events.EventInfo<dxSparkline>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxSparkline>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxSparkline>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxSparkline> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxSparkline>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxSparkline> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxSparkline>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxSparkline> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxSparklineOptions;
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxSparkline>;
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxSparkline>;
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxSparklineOptions
    extends BaseSparklineOptions<dxSparkline> {
    /**
     * [descr:dxSparklineOptions.argumentField]
     */
    argumentField?: string;
    /**
     * [descr:dxSparklineOptions.barNegativeColor]
     */
    barNegativeColor?: string;
    /**
     * [descr:dxSparklineOptions.barPositiveColor]
     */
    barPositiveColor?: string;
    /**
     * [descr:dxSparklineOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:dxSparklineOptions.firstLastColor]
     */
    firstLastColor?: string;
    /**
     * [descr:dxSparklineOptions.ignoreEmptyPoints]
     */
    ignoreEmptyPoints?: boolean;
    /**
     * [descr:dxSparklineOptions.lineColor]
     */
    lineColor?: string;
    /**
     * [descr:dxSparklineOptions.lineWidth]
     */
    lineWidth?: number;
    /**
     * [descr:dxSparklineOptions.lossColor]
     */
    lossColor?: string;
    /**
     * [descr:dxSparklineOptions.maxColor]
     */
    maxColor?: string;
    /**
     * [descr:dxSparklineOptions.maxValue]
     */
    maxValue?: number;
    /**
     * [descr:dxSparklineOptions.minColor]
     */
    minColor?: string;
    /**
     * [descr:dxSparklineOptions.minValue]
     */
    minValue?: number;
    /**
     * [descr:dxSparklineOptions.pointColor]
     */
    pointColor?: string;
    /**
     * [descr:dxSparklineOptions.pointSize]
     */
    pointSize?: number;
    /**
     * [descr:dxSparklineOptions.pointSymbol]
     */
    pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
    /**
     * [descr:dxSparklineOptions.showFirstLast]
     */
    showFirstLast?: boolean;
    /**
     * [descr:dxSparklineOptions.showMinMax]
     */
    showMinMax?: boolean;
    /**
     * [descr:dxSparklineOptions.type]
     */
    type?:
      | 'area'
      | 'bar'
      | 'line'
      | 'spline'
      | 'splinearea'
      | 'steparea'
      | 'stepline'
      | 'winloss';
    /**
     * [descr:dxSparklineOptions.valueField]
     */
    valueField?: string;
    /**
     * [descr:dxSparklineOptions.winColor]
     */
    winColor?: string;
    /**
     * [descr:dxSparklineOptions.winlossThreshold]
     */
    winlossThreshold?: number;
  }
  /**
   * [descr:dxTreeMap]
   */
  export class dxTreeMap extends BaseWidget<dxTreeMapOptions> {
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
  module dxTreeMap {
    export type ClickEvent = DevExpress.events.NativeEventInfo<dxTreeMap> & {
      readonly node: dxTreeMapNode;
    };
    export type DisposingEvent = DevExpress.events.EventInfo<dxTreeMap>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxTreeMap>;
    export type DrillEvent = DevExpress.events.EventInfo<dxTreeMap> & {
      readonly node: dxTreeMapNode;
    };
    export type ExportedEvent = DevExpress.events.EventInfo<dxTreeMap>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxTreeMap> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxTreeMap>;
    export type HoverChangedEvent = DevExpress.events.EventInfo<dxTreeMap> &
      InteractionInfo;
    export type IncidentOccurredEvent = DevExpress.events.EventInfo<dxTreeMap> &
      DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxTreeMap>;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface InteractionInfo {
      readonly node: dxTreeMapNode;
    }
    export type NodesInitializedEvent =
      DevExpress.events.EventInfo<dxTreeMap> & {
        readonly root: dxTreeMapNode;
      };
    export type NodesRenderingEvent = DevExpress.events.EventInfo<dxTreeMap> & {
      readonly node: dxTreeMapNode;
    };
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxTreeMap> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxTreeMapOptions;
    export type SelectionChangedEvent = DevExpress.events.EventInfo<dxTreeMap> &
      InteractionInfo;
  }
  /**
   * [descr:dxTreeMapNode]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTreeMapNode {
    /**
     * [descr:dxTreeMapNode.customize(options)]
     */
    customize(options: any): void;
    /**
     * [descr:dxTreeMapNode.data]
     */
    data?: any;
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
     * [descr:dxTreeMapNode.index]
     */
    index?: number;
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
     * [descr:dxTreeMapNode.level]
     */
    level?: number;
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
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
    /**
     * [descr:dxTreeMapOptions.childrenField]
     */
    childrenField?: string;
    /**
     * [descr:dxTreeMapOptions.colorField]
     */
    colorField?: string;
    /**
     * [descr:dxTreeMapOptions.colorizer]
     */
    colorizer?: {
      /**
       * [descr:dxTreeMapOptions.colorizer.colorCodeField]
       */
      colorCodeField?: string;
      /**
       * [descr:dxTreeMapOptions.colorizer.colorizeGroups]
       */
      colorizeGroups?: boolean;
      /**
       * [descr:dxTreeMapOptions.colorizer.palette]
       */
      palette?: Array<string> | PaletteType;
      /**
       * [descr:dxTreeMapOptions.colorizer.paletteExtensionMode]
       */
      paletteExtensionMode?: PaletteExtensionModeType;
      /**
       * [descr:dxTreeMapOptions.colorizer.range]
       */
      range?: Array<number>;
      /**
       * [descr:dxTreeMapOptions.colorizer.type]
       */
      type?: 'discrete' | 'gradient' | 'none' | 'range';
    };
    /**
     * [descr:dxTreeMapOptions.dataSource]
     */
    dataSource?:
      | Array<any>
      | DevExpress.data.Store
      | DevExpress.data.DataSource
      | DevExpress.data.DataSourceOptions
      | string;
    /**
     * [descr:dxTreeMapOptions.group]
     */
    group?: {
      /**
       * [descr:dxTreeMapOptions.group.border]
       */
      border?: {
        /**
         * [descr:dxTreeMapOptions.group.border.color]
         */
        color?: string;
        /**
         * [descr:dxTreeMapOptions.group.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxTreeMapOptions.group.color]
       */
      color?: string;
      /**
       * [descr:dxTreeMapOptions.group.padding]
       */
      padding?: number;
      /**
       * [descr:dxTreeMapOptions.group.headerHeight]
       */
      headerHeight?: number;
      /**
       * [descr:dxTreeMapOptions.group.hoverEnabled]
       */
      hoverEnabled?: boolean;
      /**
       * [descr:dxTreeMapOptions.group.hoverStyle]
       */
      hoverStyle?: {
        /**
         * [descr:dxTreeMapOptions.group.hoverStyle.border]
         */
        border?: {
          /**
           * [descr:dxTreeMapOptions.group.hoverStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxTreeMapOptions.group.hoverStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxTreeMapOptions.group.hoverStyle.color]
         */
        color?: string;
      };
      /**
       * [descr:dxTreeMapOptions.group.label]
       */
      label?: {
        /**
         * [descr:dxTreeMapOptions.group.label.font]
         */
        font?: Font;
        /**
         * [descr:dxTreeMapOptions.group.label.textOverflow]
         */
        textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
        /**
         * [descr:dxTreeMapOptions.group.label.visible]
         */
        visible?: boolean;
      };
      /**
       * [descr:dxTreeMapOptions.group.selectionStyle]
       */
      selectionStyle?: {
        /**
         * [descr:dxTreeMapOptions.group.selectionStyle.border]
         */
        border?: {
          /**
           * [descr:dxTreeMapOptions.group.selectionStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxTreeMapOptions.group.selectionStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxTreeMapOptions.group.selectionStyle.color]
         */
        color?: string;
      };
    };
    /**
     * [descr:dxTreeMapOptions.hoverEnabled]
     */
    hoverEnabled?: boolean;
    /**
     * [descr:dxTreeMapOptions.idField]
     */
    idField?: string;
    /**
     * [descr:dxTreeMapOptions.interactWithGroup]
     */
    interactWithGroup?: boolean;
    /**
     * [descr:dxTreeMapOptions.labelField]
     */
    labelField?: string;
    /**
     * [descr:dxTreeMapOptions.layoutAlgorithm]
     */
    layoutAlgorithm?:
      | 'sliceanddice'
      | 'squarified'
      | 'strip'
      | ((e: {
          rect?: Array<number>;
          sum?: number;
          items?: Array<any>;
        }) => any);
    /**
     * [descr:dxTreeMapOptions.layoutDirection]
     */
    layoutDirection?:
      | 'leftBottomRightTop'
      | 'leftTopRightBottom'
      | 'rightBottomLeftTop'
      | 'rightTopLeftBottom';
    /**
     * [descr:dxTreeMapOptions.margin]
     */
    margin?: BaseWidgetMargin;
    /**
     * [descr:dxTreeMapOptions.maxDepth]
     */
    maxDepth?: number;
    /**
     * [descr:dxTreeMapOptions.onClick]
     */
    onClick?: ((e: DevExpress.viz.dxTreeMap.ClickEvent) => void) | string;
    /**
     * [descr:dxTreeMapOptions.onDrill]
     */
    onDrill?: (e: DevExpress.viz.dxTreeMap.DrillEvent) => void;
    /**
     * [descr:dxTreeMapOptions.onHoverChanged]
     */
    onHoverChanged?: (e: DevExpress.viz.dxTreeMap.HoverChangedEvent) => void;
    /**
     * [descr:dxTreeMapOptions.onNodesInitialized]
     */
    onNodesInitialized?: (
      e: DevExpress.viz.dxTreeMap.NodesInitializedEvent
    ) => void;
    /**
     * [descr:dxTreeMapOptions.onNodesRendering]
     */
    onNodesRendering?: (
      e: DevExpress.viz.dxTreeMap.NodesRenderingEvent
    ) => void;
    /**
     * [descr:dxTreeMapOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.viz.dxTreeMap.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxTreeMapOptions.parentField]
     */
    parentField?: string;
    /**
     * [descr:dxTreeMapOptions.selectionMode]
     */
    selectionMode?: 'multiple' | 'none' | 'single';
    /**
     * [descr:dxTreeMapOptions.tile]
     */
    tile?: {
      /**
       * [descr:dxTreeMapOptions.tile.border]
       */
      border?: {
        /**
         * [descr:dxTreeMapOptions.tile.border.color]
         */
        color?: string;
        /**
         * [descr:dxTreeMapOptions.tile.border.width]
         */
        width?: number;
      };
      /**
       * [descr:dxTreeMapOptions.tile.color]
       */
      color?: string;
      /**
       * [descr:dxTreeMapOptions.tile.hoverStyle]
       */
      hoverStyle?: {
        /**
         * [descr:dxTreeMapOptions.tile.hoverStyle.border]
         */
        border?: {
          /**
           * [descr:dxTreeMapOptions.tile.hoverStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxTreeMapOptions.tile.hoverStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxTreeMapOptions.tile.hoverStyle.color]
         */
        color?: string;
      };
      /**
       * [descr:dxTreeMapOptions.tile.label]
       */
      label?: {
        /**
         * [descr:dxTreeMapOptions.tile.label.font]
         */
        font?: Font;
        /**
         * [descr:dxTreeMapOptions.tile.label.textOverflow]
         */
        textOverflow?: DevExpress.viz.BaseWidget.VizTextOverflowType;
        /**
         * [descr:dxTreeMapOptions.tile.label.visible]
         */
        visible?: boolean;
        /**
         * [descr:dxTreeMapOptions.tile.label.wordWrap]
         */
        wordWrap?: DevExpress.viz.BaseWidget.WordWrapType;
      };
      /**
       * [descr:dxTreeMapOptions.tile.selectionStyle]
       */
      selectionStyle?: {
        /**
         * [descr:dxTreeMapOptions.tile.selectionStyle.border]
         */
        border?: {
          /**
           * [descr:dxTreeMapOptions.tile.selectionStyle.border.color]
           */
          color?: string;
          /**
           * [descr:dxTreeMapOptions.tile.selectionStyle.border.width]
           */
          width?: number;
        };
        /**
         * [descr:dxTreeMapOptions.tile.selectionStyle.color]
         */
        color?: string;
      };
    };
    /**
     * [descr:dxTreeMapOptions.tooltip]
     */
    tooltip?: dxTreeMapTooltip;
    /**
     * [descr:dxTreeMapOptions.valueField]
     */
    valueField?: string;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxTreeMapTooltip extends BaseWidgetTooltip {
    /**
     * [descr:dxTreeMapOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          info: { value?: number; valueText?: string; node?: dxTreeMapNode },
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxTreeMapOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (info: {
      value?: number;
      valueText?: string;
      node?: dxTreeMapNode;
    }) => any;
  }
  /**
   * [descr:dxVectorMap]
   */
  export class dxVectorMap extends BaseWidget<dxVectorMapOptions> {
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
  module dxVectorMap {
    export type CenterChangedEvent =
      DevExpress.events.EventInfo<dxVectorMap> & {
        readonly center: Array<number>;
      };
    export type ClickEvent = DevExpress.events.NativeEventInfo<dxVectorMap> & {
      readonly target: MapLayerElement;
    };
    export type DisposingEvent = DevExpress.events.EventInfo<dxVectorMap>;
    export type DrawnEvent = DevExpress.events.EventInfo<dxVectorMap>;
    export type ExportedEvent = DevExpress.events.EventInfo<dxVectorMap>;
    export type ExportingEvent = DevExpress.events.EventInfo<dxVectorMap> &
      DevExpress.viz.BaseWidget.ExportInfo;
    export type FileSavingEvent = DevExpress.events.Cancelable &
      DevExpress.viz.BaseWidget.FileSavingEventInfo<dxVectorMap>;
    export type IncidentOccurredEvent =
      DevExpress.events.EventInfo<dxVectorMap> &
        DevExpress.viz.BaseWidget.IncidentInfo;
    export type InitializedEvent =
      DevExpress.events.InitializedEventInfo<dxVectorMap>;
    export type OptionChangedEvent = DevExpress.events.EventInfo<dxVectorMap> &
      DevExpress.events.ChangedOptionInfo;
    export type Properties = dxVectorMapOptions;
    export type SelectionChangedEvent =
      DevExpress.events.EventInfo<dxVectorMap> & {
        readonly target: MapLayerElement;
      };
    export type TooltipHiddenEvent = DevExpress.events.EventInfo<dxVectorMap> &
      TooltipInfo;
    /**
     * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
     */
    export interface TooltipInfo {
      target?: MapLayerElement | dxVectorMapAnnotationConfig;
    }
    export type TooltipShownEvent = DevExpress.events.EventInfo<dxVectorMap> &
      TooltipInfo;
    export type ZoomFactorChangedEvent =
      DevExpress.events.EventInfo<dxVectorMap> & {
        readonly zoomFactor: number;
      };
  }
  /**
   * [descr:dxVectorMapAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxVectorMapAnnotationConfig
    extends dxVectorMapCommonAnnotationConfig {
    /**
     * [descr:dxVectorMapAnnotationConfig.name]
     */
    name?: string;
  }
  /**
   * [descr:dxVectorMapCommonAnnotationConfig]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxVectorMapCommonAnnotationConfig
    extends BaseWidgetAnnotationConfig {
    /**
     * [descr:dxVectorMapCommonAnnotationConfig.coordinates]
     */
    coordinates?: Array<number>;
    /**
     * [descr:dxVectorMapCommonAnnotationConfig.customizeTooltip]
     */
    customizeTooltip?: (annotation: dxVectorMapAnnotationConfig | any) => any;
    /**
     * [descr:dxVectorMapCommonAnnotationConfig.template]
     */
    template?:
      | DevExpress.core.template
      | ((
          annotation: dxVectorMapAnnotationConfig | any,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxVectorMapCommonAnnotationConfig.tooltipTemplate]
     */
    tooltipTemplate?:
      | DevExpress.core.template
      | ((
          annotation: dxVectorMapAnnotationConfig | any,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxVectorMapLegends extends BaseLegend {
    /**
     * [descr:dxVectorMapOptions.legends.customizeHint]
     */
    customizeHint?: (itemInfo: {
      start?: number;
      end?: number;
      index?: number;
      color?: string;
      size?: number;
    }) => string;
    /**
     * [descr:dxVectorMapOptions.legends.customizeItems]
     */
    customizeItems?: (
      items: Array<VectorMapLegendItem>
    ) => Array<VectorMapLegendItem>;
    /**
     * [descr:dxVectorMapOptions.legends.customizeText]
     */
    customizeText?: (itemInfo: {
      start?: number;
      end?: number;
      index?: number;
      color?: string;
      size?: number;
    }) => string;
    /**
     * [descr:dxVectorMapOptions.legends.font]
     */
    font?: Font;
    /**
     * [descr:dxVectorMapOptions.legends.markerColor]
     */
    markerColor?: string;
    /**
     * [descr:dxVectorMapOptions.legends.markerShape]
     */
    markerShape?: 'circle' | 'square';
    /**
     * [descr:dxVectorMapOptions.legends.markerSize]
     */
    markerSize?: number;
    /**
     * [descr:dxVectorMapOptions.legends.markerTemplate]
     */
    markerTemplate?:
      | DevExpress.core.template
      | ((
          legendItem: VectorMapLegendItem,
          element: SVGGElement
        ) => string | DevExpress.core.UserDefinedElement<SVGElement>);
    /**
     * [descr:dxVectorMapOptions.legends.source]
     */
    source?: {
      /**
       * [descr:dxVectorMapOptions.legends.source.grouping]
       */
      grouping?: string;
      /**
       * [descr:dxVectorMapOptions.legends.source.layer]
       */
      layer?: string;
    };
  }
  /**
   * @deprecated use Properties instead
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
    /**
     * [descr:dxVectorMapOptions.background]
     */
    background?: {
      /**
       * [descr:dxVectorMapOptions.background.borderColor]
       */
      borderColor?: string;
      /**
       * [descr:dxVectorMapOptions.background.color]
       */
      color?: string;
    };
    /**
     * [descr:dxVectorMapOptions.bounds]
     */
    bounds?: Array<number>;
    /**
     * [descr:dxVectorMapOptions.center]
     */
    center?: Array<number>;
    /**
     * [descr:dxVectorMapOptions.controlBar]
     */
    controlBar?: {
      /**
       * [descr:dxVectorMapOptions.controlBar.borderColor]
       */
      borderColor?: string;
      /**
       * [descr:dxVectorMapOptions.controlBar.color]
       */
      color?: string;
      /**
       * [descr:dxVectorMapOptions.controlBar.enabled]
       */
      enabled?: boolean;
      /**
       * [descr:dxVectorMapOptions.controlBar.horizontalAlignment]
       */
      horizontalAlignment?: 'center' | 'left' | 'right';
      /**
       * [descr:dxVectorMapOptions.controlBar.margin]
       */
      margin?: number;
      /**
       * [descr:dxVectorMapOptions.controlBar.opacity]
       */
      opacity?: number;
      /**
       * [descr:dxVectorMapOptions.controlBar.verticalAlignment]
       */
      verticalAlignment?: 'bottom' | 'top';
    };
    /**
     * [descr:dxVectorMapOptions.layers]
     */
    layers?:
      | Array<{
          /**
           * [descr:dxVectorMapOptions.layers.borderColor]
           */
          borderColor?: string;
          /**
           * [descr:dxVectorMapOptions.layers.borderWidth]
           */
          borderWidth?: number;
          /**
           * [descr:dxVectorMapOptions.layers.color]
           */
          color?: string;
          /**
           * [descr:dxVectorMapOptions.layers.colorGroupingField]
           */
          colorGroupingField?: string;
          /**
           * [descr:dxVectorMapOptions.layers.colorGroups]
           */
          colorGroups?: Array<number>;
          /**
           * [descr:dxVectorMapOptions.layers.customize]
           */
          customize?: (elements: Array<MapLayerElement>) => void;
          /**
           * [descr:dxVectorMapOptions.layers.dataField]
           */
          dataField?: string;
          /**
           * [descr:dxVectorMapOptions.layers.dataSource]
           */
          dataSource?:
            | any
            | DevExpress.data.Store
            | DevExpress.data.DataSource
            | DevExpress.data.DataSourceOptions
            | string;
          /**
           * [descr:dxVectorMapOptions.layers.elementType]
           */
          elementType?: 'bubble' | 'dot' | 'image' | 'pie';
          /**
           * [descr:dxVectorMapOptions.layers.hoverEnabled]
           */
          hoverEnabled?: boolean;
          /**
           * [descr:dxVectorMapOptions.layers.hoveredBorderColor]
           */
          hoveredBorderColor?: string;
          /**
           * [descr:dxVectorMapOptions.layers.hoveredBorderWidth]
           */
          hoveredBorderWidth?: number;
          /**
           * [descr:dxVectorMapOptions.layers.hoveredColor]
           */
          hoveredColor?: string;
          /**
           * [descr:dxVectorMapOptions.layers.label]
           */
          label?: {
            /**
             * [descr:dxVectorMapOptions.layers.label.dataField]
             */
            dataField?: string;
            /**
             * [descr:dxVectorMapOptions.layers.label.enabled]
             */
            enabled?: boolean;
            /**
             * [descr:dxVectorMapOptions.layers.label.font]
             */
            font?: Font;
          };
          /**
           * [descr:dxVectorMapOptions.layers.maxSize]
           */
          maxSize?: number;
          /**
           * [descr:dxVectorMapOptions.layers.minSize]
           */
          minSize?: number;
          /**
           * [descr:dxVectorMapOptions.layers.name]
           */
          name?: string;
          /**
           * [descr:dxVectorMapOptions.layers.opacity]
           */
          opacity?: number;
          /**
           * [descr:dxVectorMapOptions.layers.palette]
           */
          palette?: Array<string> | PaletteType;
          /**
           * [descr:dxVectorMapOptions.layers.paletteSize]
           */
          paletteSize?: number;
          /**
           * [descr:dxVectorMapOptions.layers.paletteIndex]
           */
          paletteIndex?: number;
          /**
           * [descr:dxVectorMapOptions.layers.selectedBorderColor]
           */
          selectedBorderColor?: string;
          /**
           * [descr:dxVectorMapOptions.layers.selectedBorderWidth]
           */
          selectedBorderWidth?: number;
          /**
           * [descr:dxVectorMapOptions.layers.selectedColor]
           */
          selectedColor?: string;
          /**
           * [descr:dxVectorMapOptions.layers.selectionMode]
           */
          selectionMode?: 'multiple' | 'none' | 'single';
          /**
           * [descr:dxVectorMapOptions.layers.size]
           */
          size?: number;
          /**
           * [descr:dxVectorMapOptions.layers.sizeGroupingField]
           */
          sizeGroupingField?: string;
          /**
           * [descr:dxVectorMapOptions.layers.sizeGroups]
           */
          sizeGroups?: Array<number>;
          /**
           * [descr:dxVectorMapOptions.layers.type]
           */
          type?: 'area' | 'line' | 'marker';
        }>
      | {
          borderColor?: string;
          borderWidth?: number;
          color?: string;
          colorGroupingField?: string;
          colorGroups?: Array<number>;
          customize?: (elements: Array<MapLayerElement>) => any;
          dataField?: string;
          dataSource?:
            | any
            | DevExpress.data.Store
            | DevExpress.data.DataSource
            | DevExpress.data.DataSourceOptions
            | string;
          elementType?: 'bubble' | 'dot' | 'image' | 'pie';
          hoverEnabled?: boolean;
          hoveredBorderColor?: string;
          hoveredBorderWidth?: number;
          hoveredColor?: string;
          label?: { dataField?: string; enabled?: boolean; font?: Font };
          maxSize?: number;
          minSize?: number;
          name?: string;
          opacity?: number;
          palette?: Array<string> | PaletteType;
          paletteSize?: number;
          selectedBorderColor?: string;
          selectedBorderWidth?: number;
          selectedColor?: string;
          selectionMode?: 'multiple' | 'none' | 'single';
          size?: number;
          sizeGroupingField?: string;
          sizeGroups?: Array<number>;
          type?: 'area' | 'line' | 'marker';
        };
    /**
     * [descr:dxVectorMapOptions.legends]
     */
    legends?: Array<dxVectorMapLegends>;
    /**
     * [descr:dxVectorMapOptions.margin]
     */
    margin?: BaseWidgetMargin;
    /**
     * [descr:dxVectorMapOptions.maxZoomFactor]
     */
    maxZoomFactor?: number;
    /**
     * [descr:dxVectorMapOptions.onCenterChanged]
     */
    onCenterChanged?: (
      e: DevExpress.viz.dxVectorMap.CenterChangedEvent
    ) => void;
    /**
     * [descr:dxVectorMapOptions.onClick]
     */
    onClick?: ((e: DevExpress.viz.dxVectorMap.ClickEvent) => void) | string;
    /**
     * [descr:dxVectorMapOptions.onSelectionChanged]
     */
    onSelectionChanged?: (
      e: DevExpress.viz.dxVectorMap.SelectionChangedEvent
    ) => void;
    /**
     * [descr:dxVectorMapOptions.onTooltipHidden]
     */
    onTooltipHidden?: (
      e: DevExpress.viz.dxVectorMap.TooltipHiddenEvent
    ) => void;
    /**
     * [descr:dxVectorMapOptions.onTooltipShown]
     */
    onTooltipShown?: (e: DevExpress.viz.dxVectorMap.TooltipShownEvent) => void;
    /**
     * [descr:dxVectorMapOptions.onZoomFactorChanged]
     */
    onZoomFactorChanged?: (
      e: DevExpress.viz.dxVectorMap.ZoomFactorChangedEvent
    ) => void;
    /**
     * [descr:dxVectorMapOptions.panningEnabled]
     */
    panningEnabled?: boolean;
    /**
     * [descr:dxVectorMapOptions.projection]
     */
    projection?:
      | 'equirectangular'
      | 'lambert'
      | 'mercator'
      | 'miller'
      | VectorMapProjectionConfig
      | string
      | any;
    /**
     * [descr:dxVectorMapOptions.tooltip]
     */
    tooltip?: dxVectorMapTooltip;
    /**
     * [descr:dxVectorMapOptions.touchEnabled]
     */
    touchEnabled?: boolean;
    /**
     * [descr:dxVectorMapOptions.wheelEnabled]
     */
    wheelEnabled?: boolean;
    /**
     * [descr:dxVectorMapOptions.zoomFactor]
     */
    zoomFactor?: number;
    /**
     * [descr:dxVectorMapOptions.zoomingEnabled]
     */
    zoomingEnabled?: boolean;
    /**
     * [descr:dxVectorMapOptions.commonAnnotationSettings]
     */
    commonAnnotationSettings?: dxVectorMapCommonAnnotationConfig;
    /**
     * [descr:dxVectorMapOptions.annotations]
     */
    annotations?: Array<dxVectorMapAnnotationConfig | any>;
    /**
     * [descr:dxVectorMapOptions.customizeAnnotation]
     */
    customizeAnnotation?: (
      annotation: dxVectorMapAnnotationConfig | any
    ) => dxVectorMapAnnotationConfig;
  }
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface dxVectorMapTooltip extends BaseWidgetTooltip {
    /**
     * [descr:dxVectorMapOptions.tooltip.contentTemplate]
     */
    contentTemplate?:
      | DevExpress.core.template
      | ((
          info: MapLayerElement,
          element: DevExpress.core.DxElement
        ) => string | DevExpress.core.UserDefinedElement);
    /**
     * [descr:dxVectorMapOptions.tooltip.customizeTooltip]
     */
    customizeTooltip?: (info: MapLayerElement) => any;
    /**
     * [descr:dxVectorMapOptions.tooltip.format]
     */
    format?: DevExpress.ui.format;
  }
  /**
   * [descr:viz.exportFromMarkup(markup, options)]
   */
  export function exportFromMarkup(
    markup: string,
    options: {
      fileName?: string;
      format?: string;
      backgroundColor?: string;
      proxyUrl?: string;
      width?: number;
      height?: number;
      onExporting?: Function;
      onExported?: Function;
      onFileSaving?: Function;
      margin?: number;
      svgToCanvas?: Function;
    }
  ): void;
  /**
   * [descr:viz.exportWidgets(widgetInstances)]
   */
  export function exportWidgets(
    widgetInstances: Array<Array<DOMComponent>>
  ): void;
  /**
   * [descr:viz.exportWidgets(widgetInstances, options)]
   */
  export function exportWidgets(
    widgetInstances: Array<Array<DOMComponent>>,
    options: {
      fileName?: string;
      format?: 'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG';
      backgroundColor?: string;
      margin?: number;
      gridLayout?: boolean;
      verticalAlignment?: 'bottom' | 'center' | 'top';
      horizontalAlignment?: 'center' | 'left' | 'right';
      proxyUrl?: string;
      onExporting?: Function;
      onExported?: Function;
      onFileSaving?: Function;
      svgToCanvas?: Function;
    }
  ): void;
  /**
   * [descr:Font]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface FunnelLegendItem extends BaseLegendItem {
    /**
     * [descr:FunnelLegendItem.item]
     */
    item?: dxFunnelItem;
  }
  /**
   * [descr:GaugeIndicator]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface GaugeIndicator extends CommonIndicator {
    /**
     * [descr:GaugeIndicator.type]
     */
    type?: DevExpress.viz.BaseGauge.GaugeIndicatorType;
  }
  /**
   * [descr:viz.generateColors(palette, count, options)]
   */
  export function generateColors(
    palette: PaletteType | Array<string>,
    count: number,
    options: {
      paletteExtensionMode?: PaletteExtensionModeType;
      baseColorSet?: 'simpleSet' | 'indicatingSet' | 'gradientSet';
    }
  ): Array<string>;
  /**
   * [descr:viz.getMarkup(widgetInstances)]
   */
  export function getMarkup(widgetInstances: Array<DOMComponent>): string;
  /**
   * [descr:viz.getPalette(paletteName)]
   */
  export function getPalette(paletteName: string): any;
  /**
   * [descr:viz.getTheme(theme)]
   */
  export function getTheme(theme: string): any;
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type HatchingDirectionType = 'left' | 'none' | 'right';
  /**
   * [descr:MapLayer]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface MapLayer {
    /**
     * [descr:MapLayer.clearSelection()]
     */
    clearSelection(): void;
    /**
     * [descr:MapLayer.elementType]
     */
    elementType?: string;
    /**
     * [descr:MapLayer.getDataSource()]
     */
    getDataSource(): DevExpress.data.DataSource;
    /**
     * [descr:MapLayer.getElements()]
     */
    getElements(): Array<MapLayerElement>;
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
  }
  /**
   * [descr:MapLayerElement]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface MapLayerElement {
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
     * [descr:MapLayerElement.layer]
     */
    layer?: any;
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type PaletteExtensionModeType = 'alternate' | 'blend' | 'extrapolate';
  /**
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type PaletteType =
    | 'Bright'
    | 'Harmony Light'
    | 'Ocean'
    | 'Pastel'
    | 'Soft'
    | 'Soft Pastel'
    | 'Vintage'
    | 'Violet'
    | 'Carmine'
    | 'Dark Moon'
    | 'Dark Violet'
    | 'Green Mist'
    | 'Soft Blue'
    | 'Material'
    | 'Office';
  /**
   * [descr:PieChartLegendItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PieChartSeries
    extends dxPieChartSeriesTypesCommonPieChartSeries {
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
   * [descr:pieChartSeriesObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface pieChartSeriesObject extends baseSeriesObject {
    /**
     * [descr:pieChartSeriesObject.hover()]
     */
    hover(): void;
    /**
     * [descr:pieChartSeriesObject.clearHover()]
     */
    clearHover(): void;
    /**
     * [descr:pieChartSeriesObject.isHovered()]
     */
    isHovered(): boolean;
  }
  /**
   * [descr:piePointObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface piePointObject extends basePointObject {
    /**
     * [descr:piePointObject.hide()]
     */
    hide(): void;
    /**
     * [descr:piePointObject.isVisible()]
     */
    isVisible(): boolean;
    /**
     * [descr:piePointObject.percent]
     */
    percent?: string | number | Date;
    /**
     * [descr:piePointObject.show()]
     */
    show(): void;
  }
  /**
   * [descr:PolarChartSeries]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface PolarChartSeries
    extends dxPolarChartSeriesTypesCommonPolarChartSeries {
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
    type?: DevExpress.viz.dxPolarChart.PolarChartSeriesType;
  }
  /**
   * [descr:polarChartSeriesObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface polarChartSeriesObject extends baseSeriesObject {}
  /**
   * [descr:polarPointObject]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface polarPointObject extends basePointObject {}
  /**
   * [descr:viz.refreshPaths()]
   */
  export function refreshPaths(): void;
  /**
   * [descr:viz.refreshTheme()]
   */
  export function refreshTheme(): void;
  /**
   * [descr:viz.registerPalette(paletteName, palette)]
   */
  export function registerPalette(paletteName: string, palette: any): void;
  /**
   * [descr:viz.registerTheme(customTheme, baseTheme)]
   */
  export function registerTheme(customTheme: any, baseTheme: string): void;
  /**
   * [descr:ScaleBreak]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type TimeIntervalType =
    | 'day'
    | 'hour'
    | 'millisecond'
    | 'minute'
    | 'month'
    | 'quarter'
    | 'second'
    | 'week'
    | 'year';
  /**
   * [descr:VectorMapLegendItem]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
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
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface VectorMapProjectionConfig {
    /**
     * [descr:VectorMapProjectionConfig.aspectRatio]
     */
    aspectRatio?: number;
    /**
     * [descr:VectorMapProjectionConfig.from]
     */
    from?: (coordinates: Array<number>) => Array<number>;
    /**
     * [descr:VectorMapProjectionConfig.to]
     */
    to?: (coordinates: Array<number>) => Array<number>;
  }
  /**
   * [descr:VizRange]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export interface VizRange {
    /**
     * [descr:VizRange.endValue]
     */
    endValue?: number | Date | string;
    /**
     * [descr:VizRange.length]
     */
    length?: VizTimeInterval;
    /**
     * [descr:VizRange.startValue]
     */
    startValue?: number | Date | string;
  }
  /**
   * [descr:VizTimeInterval]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export type VizTimeInterval =
    | number
    | {
        /**
         * [descr:VizTimeInterval.days]
         */
        days?: number;
        /**
         * [descr:VizTimeInterval.hours]
         */
        hours?: number;
        /**
         * [descr:VizTimeInterval.milliseconds]
         */
        milliseconds?: number;
        /**
         * [descr:VizTimeInterval.minutes]
         */
        minutes?: number;
        /**
         * [descr:VizTimeInterval.months]
         */
        months?: number;
        /**
         * [descr:VizTimeInterval.quarters]
         */
        quarters?: number;
        /**
         * [descr:VizTimeInterval.seconds]
         */
        seconds?: number;
        /**
         * [descr:VizTimeInterval.weeks]
         */
        weeks?: number;
        /**
         * [descr:VizTimeInterval.years]
         */
        years?: number;
      }
    | TimeIntervalType;
}
declare module DevExpress.viz.map {
  /**
   * [descr:viz.map.projection(data)]
   * @deprecated Warning! This type is used for internal purposes. Do not import it directly.
   */
  export const projection: {
    /**
     * [descr:viz.map.projection.add(name, projection)]
     */
    add(name: string, projection: VectorMapProjectionConfig | any): void;

    /**
     * [descr:viz.map.projection.get(name)]
     */
    get(
      name: 'equirectangular' | 'lambert' | 'mercator' | 'miller' | string
    ): any;

    (data: VectorMapProjectionConfig): any;
  };
}
