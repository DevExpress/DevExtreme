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
    dxDropDownBox(): JQuery;
    dxDropDownBox(options: "instance"): DevExpress.ui.dxDropDownBox;
    dxDropDownBox(options: string): any;
    dxDropDownBox(options: string, ...params: any[]): any;
    dxDropDownBox(options: DevExpress.ui.dxDropDownBoxOptions): JQuery;
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
    dxPanorama(): JQuery;
    dxPanorama(options: "instance"): DevExpress.ui.dxPanorama;
    dxPanorama(options: string): any;
    dxPanorama(options: string, ...params: any[]): any;
    dxPanorama(options: DevExpress.ui.dxPanoramaOptions): JQuery;
}
interface JQuery {
    dxPivot(): JQuery;
    dxPivot(options: "instance"): DevExpress.ui.dxPivot;
    dxPivot(options: string): any;
    dxPivot(options: string, ...params: any[]): any;
    dxPivot(options: DevExpress.ui.dxPivotOptions): JQuery;
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
    dxBarGauge(options: DevExpress.viz.gauges.dxBarGaugeOptions): JQuery;
}
interface JQuery {
    dxBullet(): JQuery;
    dxBullet(options: "instance"): DevExpress.viz.dxBullet;
    dxBullet(options: string): any;
    dxBullet(options: string, ...params: any[]): any;
    dxBullet(options: DevExpress.viz.sparklines.dxBulletOptions): JQuery;
}
interface JQuery {
    dxChart(): JQuery;
    dxChart(options: "instance"): DevExpress.viz.dxChart;
    dxChart(options: string): any;
    dxChart(options: string, ...params: any[]): any;
    dxChart(options: DevExpress.viz.charts.dxChartOptions): JQuery;
}
interface JQuery {
    dxCircularGauge(): JQuery;
    dxCircularGauge(options: "instance"): DevExpress.viz.dxCircularGauge;
    dxCircularGauge(options: string): any;
    dxCircularGauge(options: string, ...params: any[]): any;
    dxCircularGauge(options: DevExpress.viz.gauges.dxCircularGaugeOptions): JQuery;
}
interface JQuery {
    dxFunnel(): JQuery;
    dxFunnel(options: "instance"): DevExpress.viz.dxFunnel;
    dxFunnel(options: string): any;
    dxFunnel(options: string, ...params: any[]): any;
    dxFunnel(options: DevExpress.viz.funnel.dxFunnelOptions): JQuery;
}
interface JQuery {
    dxLinearGauge(): JQuery;
    dxLinearGauge(options: "instance"): DevExpress.viz.dxLinearGauge;
    dxLinearGauge(options: string): any;
    dxLinearGauge(options: string, ...params: any[]): any;
    dxLinearGauge(options: DevExpress.viz.gauges.dxLinearGaugeOptions): JQuery;
}
interface JQuery {
    dxPieChart(): JQuery;
    dxPieChart(options: "instance"): DevExpress.viz.dxPieChart;
    dxPieChart(options: string): any;
    dxPieChart(options: string, ...params: any[]): any;
    dxPieChart(options: DevExpress.viz.charts.dxPieChartOptions): JQuery;
}
interface JQuery {
    dxPolarChart(): JQuery;
    dxPolarChart(options: "instance"): DevExpress.viz.dxPolarChart;
    dxPolarChart(options: string): any;
    dxPolarChart(options: string, ...params: any[]): any;
    dxPolarChart(options: DevExpress.viz.charts.dxPolarChartOptions): JQuery;
}
interface JQuery {
    dxRangeSelector(): JQuery;
    dxRangeSelector(options: "instance"): DevExpress.viz.dxRangeSelector;
    dxRangeSelector(options: string): any;
    dxRangeSelector(options: string, ...params: any[]): any;
    dxRangeSelector(options: DevExpress.viz.rangeSelector.dxRangeSelectorOptions): JQuery;
}
interface JQuery {
    dxSparkline(): JQuery;
    dxSparkline(options: "instance"): DevExpress.viz.dxSparkline;
    dxSparkline(options: string): any;
    dxSparkline(options: string, ...params: any[]): any;
    dxSparkline(options: DevExpress.viz.sparklines.dxSparklineOptions): JQuery;
}
interface JQuery {
    dxTreeMap(): JQuery;
    dxTreeMap(options: "instance"): DevExpress.viz.dxTreeMap;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;
    dxTreeMap(options: DevExpress.viz.treeMap.dxTreeMapOptions): JQuery;
}
interface JQuery {
    dxVectorMap(): JQuery;
    dxVectorMap(options: "instance"): DevExpress.viz.dxVectorMap;
    dxVectorMap(options: string): any;
    dxVectorMap(options: string, ...params: any[]): any;
    dxVectorMap(options: DevExpress.viz.map.dxVectorMapOptions): JQuery;
}
declare module DevExpress {
    export class DataHelperMixin {
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    export function eventsHandler(event: dxEvent, extraParameters: any): boolean;
    /** Describes dxEvent, a counterpart of the jQuery.Event to be used without jQuery. */
    export class dxEvent {
        /** The DOM element that initiated the event. */
        target: Element;
        /** The DOM element within the current event propagation stage. */
        currentTarget: Element;
        /** The DOM element to which the currently-called event handler was attached. */
        delegateTarget: Element;
        /** Data passed to the event handler. */
        data: any;
        /** Checks if the preventDefault() method was called on this event object. */
        isDefaultPrevented(): boolean;
        /** Checks if the stopImmediatePropagation() method was called on this event object. */
        isImmediatePropagationStopped(): boolean;
        /** Checks if the stopPropagation() method was called on this event object. */
        isPropagationStopped(): boolean;
        /** Prevents the event's default action from triggering. */
        preventDefault(): void;
        /** Stops the event's propagation up the DOM tree, preventing the rest of the handlers from being executed. */
        stopImmediatePropagation(): void;
        /** Stops the event's propagation up the DOM tree, keeping parent handlers unnotified of the event. */
        stopPropagation(): void;
    }
    export type event = dxEvent | JQueryEventObject; 
    /** An object that serves as a namespace for the methods that are used to localize an application. */
    export class localization {
        /** Converts a Date object to a string using the specified format. */
        static formatDate(value: Date, format: DevExpress.ui.format): string;
        /** Substitutes the provided value(s) for placeholders in a message that the key specifies. */
        static formatMessage(key: string, value: string | Array<string>): string;
        /** Converts a numeric value to a string using the specified format. */
        static formatNumber(value: number, format: DevExpress.ui.format): string;
        /** Loads localized messages. */
        static loadMessages(messages: any): void;
        /** Gets the current locale identifier. */
        static locale(): string;
        /** Sets the current locale identifier. */
        static locale(locale: string): void;
        /** Parses a string into a Date object. */
        static parseDate(text: string, format: DevExpress.ui.format): Date;
        /** Parses a string into a numeric value. */
        static parseNumber(text: string, format: DevExpress.ui.format): number;
    }
    /** Defines animation options. */
    export interface animationConfig {
        /** A function called after animation is completed. */
        complete?: (($element: DevExpress.core.dxElement, config: any) => any);
        /** A number specifying wait time before animation execution. */
        delay?: number;
        /** Specifies the animation direction for the "slideIn" and "slideOut" animation types. */
        direction?: 'bottom' | 'left' | 'right' | 'top';
        /** A number specifying the time in milliseconds spent on animation. */
        duration?: number;
        /** A string specifying the easing function for animation. */
        easing?: string;
        /** Specifies the initial animation state. */
        from?: number | string | any;
        /** A number specifying the time period to wait before the animation of the next stagger item starts. */
        staggerDelay?: number;
        /** A function called before animation is started. */
        start?: (($element: DevExpress.core.dxElement, config: any) => any);
        /** Specifies a final animation state. */
        to?: number | string | any;
        /** A string value specifying the animation type. */
        type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
    }
    /** The position object specifies the widget positioning options. */
    export interface positionConfig {
        /** The target element position that the widget is positioned against. */
        at?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /** The element within which the widget is positioned. */
        boundary?: string | Element | JQuery | Window;
        /** Specifies the horizontal and vertical offset from the window's boundaries. */
        boundaryOffset?: string | { x?: number, y?: number };
        /** Specifies how to move the widget if it overflows the screen. */
        collision?: 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit' | { x?: 'fit' | 'flip' | 'flipfit' | 'none', y?: 'fit' | 'flip' | 'flipfit' | 'none' };
        /** The position of the widget to align against the target element. */
        my?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | { x?: 'center' | 'left' | 'right', y?: 'bottom' | 'center' | 'top' };
        /** The target element that the widget is positioned against. */
        of?: string | Element | JQuery | Window;
        /** Specifies horizontal and vertical offset in pixels. */
        offset?: string | { x?: number, y?: number };
    }
    /** A repository of animations. */
    export class animationPresets {
        /** Applies the changes made in the animation repository. */
        applyChanges(): void;
        /** Removes all animations from the repository. */
        clear(): void;
        /** Deletes an animation with a specific name. */
        clear(name: string): void;
        /** Gets the configuration of an animation with a specific name. */
        getPreset(name: string): any;
        /** Registers predefined animations in the animation repository. */
        registerDefaultPresets(): void;
        /** Adds an animation with a specific name to the animation repository. */
        registerPreset(name: string, config: { animation?: animationConfig, device?: Device }): void;
        /** Deletes all custom animations. */
        resetToDefaults(): void;
    }
    /** The manager that performs several specified animations at a time. */
    export class TransitionExecutor {
        /** Registers the set of elements that should be animated as "entering" using the specified animation configuration. */
        enter(elements: JQuery, animation: animationConfig | string): void;
        /** Registers a set of elements that should be animated as "leaving" using the specified animation configuration. */
        leave(elements: JQuery, animation: animationConfig | string): void;
        /** Deletes all the animations registered in the Transition Executor by using the enter(elements, animation) and leave(elements, animation) methods. */
        reset(): void;
        /** Starts all the animations registered using the enter(elements, animation) and leave(elements, animation) methods beforehand. */
        start(): Promise<void> & JQueryPromise<void>;
        /** Stops all started animations. */
        stop(): void;
    }
    export interface ComponentOptions<T = Component> {
        /** A handler for the disposing event. Executed when the widget is removed from the DOM using the remove(), empty(), or html() jQuery methods only. */
        onDisposing?: ((e: { component?: T }) => any);
        /** A handler for the initialized event. Executed only once, after the widget is initialized. */
        onInitialized?: ((e: { component?: T, element?: DevExpress.core.dxElement }) => any);
        /** A handler for the optionChanged event. Executed after an option of the widget is changed. */
        onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => any);
    }
    /** A base class for all components and widgets. */
    export class Component {
        constructor(options?: ComponentOptions);
        /** Prevents the widget from refreshing until the endUpdate() method is called. */
        beginUpdate(): void;
        /** Refreshes the widget after a call of the beginUpdate() method. */
        endUpdate(): void;
        /** Gets the widget's instance. Use it to access other methods of the widget. */
        instance(): this;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Gets all widget options. */
        option(): any;
        /** Gets the value of a single option. */
        option(optionName: string): any;
        /** Updates the value of a single option. */
        option(optionName: string, optionValue: any): void;
        /** Updates the values of several options. */
        option(options: any): void;
    }
    /** Registers a new component in the DevExpress.ui namespace. */
    export function registerComponent(name: string, componentClass: any): void;
    /** Registers a new component in the specified namespace. */
    export function registerComponent(name: string, namespace: any, componentClass: any): void;
    /** Specifies settings that affect all DevExtreme widgets. */
    export interface globalConfig {
        /** A decimal separator. Applies only if you do not use the Globalize or Intl library. */
        decimalSeparator?: string;
        /** The default currency. Accepts a 3-letter code specified by ISO 4217. */
        defaultCurrency?: string;
        /** Specifies whether dates are parsed and serialized according to the ISO 8601 standard in all browsers. */
        forceIsoDateParsing?: boolean;
        /** Specifies whether the widgets support a right-to-left representation. Available for individual widgets as well. */
        rtlEnabled?: boolean;
        /** The decimal separator that is used when submitting a value to the server. */
        serverDecimalSeparator?: string;
        /** A group separator. Applies only if you do not use the Globalize or Intl library. */
        thousandsSeparator?: string;
    }
    /** Gets the current global configuration. */
    export function config(): globalConfig;
    /** Configures your application before its launch. */
    export function config(config: globalConfig): void;
    /** The device object defines the device on which the application is running. */
    export interface Device {
        /** Indicates whether or not the device platform is Android. */
        android?: boolean;
        /** Specifies the type of the device on which the application is running. */
        deviceType?: 'phone' | 'tablet' | 'desktop';
        /** Indicates whether or not the device platform is generic, which means that the application will look and behave according to a generic "light" or "dark" theme. */
        generic?: boolean;
        /** Specifies a performance grade of the current device. */
        grade?: 'A' | 'B' | 'C';
        /** Indicates whether or not the device platform is iOS. */
        ios?: boolean;
        /** Indicates whether or not the device type is 'phone'. */
        phone?: boolean;
        /** Specifies the platform of the device on which the application is running. */
        platform?: 'android' | 'ios' | 'win' | 'generic';
        /** Indicates whether or not the device type is 'tablet'. */
        tablet?: boolean;
        /** Specifies an array with the major and minor versions of the device platform. */
        version?: Array<number>;
        /** Indicates whether or not the device platform is Windows. */
        win?: boolean;
    }
    /** An object that serves as a namespace for the methods and events specifying information on the current device. */
    export class DevicesObject {
        constructor(options: { window?: Window });
        /** Gets information on the current device. */
        current(): Device;
        /** Overrides actual device information to force the application to operate as if it was running on a specified device. */
        current(deviceName: string | Device): void;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Returns the current device orientation. */
        orientation(): string;
        /** Returns real information about the current device regardless of the value passed to the devices.current(deviceName) method. */
        real(): Device;
    }
    export var devices: DevicesObject;
    export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
        bindingOptions?: any;
        /** Specifies the attributes to be attached to the widget's root element. */
        elementAttr?: any;
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** A handler for the disposing event. Executed when the widget is removed from the DOM using the remove(), empty(), or html() jQuery methods only. */
        onDisposing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the optionChanged event. Executed after an option of the widget is changed. */
        onOptionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, name?: string, fullName?: string, value?: any }) => any);
        /** Switches the widget to a right-to-left representation. */
        rtlEnabled?: boolean;
        /** Specifies the widget's width. */
        width?: number | string | (() => number | string);
    }
    /** A base class for all components. */
    export class DOMComponent extends Component {
        constructor(element: Element | JQuery, options?: DOMComponentOptions);
        /** Specifies the device-dependent default configuration options for this component. */
        static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
        /** Removes the widget from the DOM. */
        dispose(): void;
        /** Gets the root widget element. */
        element(): DevExpress.core.dxElement;
        /** Gets the instance of a widget found using its DOM node. */
        static getInstance(element: Element | JQuery): DOMComponent;
    }
    /** The EndpointSelector is an object for managing OData endpoints in your application. */
    export class EndpointSelector {
        constructor(options: any);
        /** Gets an endpoint with a specific key. */
        urlFor(key: string): string;
    }
    /** An object that serves as a namespace for the methods required to perform validation. */
    export class validationEngine {
        /** Gets the default validation group. */
        static getGroupConfig(): any;
        /** Gets a validation group with a specific key. */
        static getGroupConfig(group: string | any): any;
        /** Registers all the Validator objects extending fields of the specified ViewModel. */
        static registerModelForValidation(model: any): void;
        /** Resets the values and validation result of the editors that belong to the default validation group. */
        static resetGroup(): void;
        /** Resets the values and validation result of the editors that belong to the specified validation group. */
        static resetGroup(group: string | any): void;
        /** Unregisters all the Validator objects extending fields of the specified ViewModel. */
        static unregisterModelForValidation(model: any): void;
        /** Validates editors from the default validation group. */
        static validateGroup(): DevExpress.ui.dxValidationGroupResult;
        /** Validates editors from a specific validation group. */
        static validateGroup(group: string | any): DevExpress.ui.dxValidationGroupResult;
        /** Validates a view model. */
        static validateModel(model: any): any;
    }
    /** Hides the last displayed overlay widget. */
    export function hideTopOverlay(): boolean;
    /** Processes the hardware back button click. */
    export function processHardwareBackButton(): void;
    /** An object that serves as a namespace for DevExtreme UI widgets as well as for methods implementing UI logic in DevExtreme sites/applications. */
    export class ui {
        /** Creates a toast message. */
        static notify(message: string, type?: string, displayTime?: number): void;
        /** Creates a toast message. */
        static notify(options: any, type?: string, displayTime?: number): void;
        /** Sets a template engine. */
        static setTemplateEngine(templateEngineName: string): void;
        /** Sets a custom template engine defined via custom compile and render functions. */
        static setTemplateEngine(templateEngineOptions: { compile?: Function, render?: Function }): void;
    }
    /** An object that serves as a namespace for DevExtreme Data Visualization Widgets. */
    export class viz {
        /** Changes the current palette for all data visualization widgets on the page. */
        static currentPalette(paletteName: string): void;
        /** Gets the current theme's name. */
        static currentTheme(): string;
        /** Changes the current theme for all data visualization widgets on the page. The color scheme is defined separately. */
        static currentTheme(platform: string, colorScheme: string): void;
        /** Changes the current theme for all data visualization widgets on the page. */
        static currentTheme(theme: string): void;
        /** Allows you to export widgets using their SVG markup. */
        static exportFromMarkup(markup: string, options: { fileName?: string, format?: string, backgroundColor?: string, proxyUrl?: string, width?: number, height?: number, onExporting?: Function, onExported?: Function, onFileSaving?: Function, margin?: number }): void;
        /** Gets the SVG markup of specific widgets for their subsequent export. */
        static getMarkup(widgetInstances: Array<DOMComponent>): string;
        /** Gets the color sets of a predefined or registered palette. */
        static getPalette(paletteName: string): any;
        /** Gets a predefined or registered theme's settings. */
        static getTheme(theme: string): any;
        /** The method to be called every time the active entry in the browser history is modified without reloading the current page. */
        static refreshPaths(): void;
        /** Refreshes the current theme and palette in all data visualization widgets on the page. */
        static refreshTheme(): void;
        /** Registers a new palette. */
        static registerPalette(paletteName: string, palette: any): void;
        /** Registers a new theme based on the existing one. */
        static registerTheme(customTheme: any, baseTheme: string): void;
    }
}
declare module DevExpress.data {
    /** The Guid is an object used to generate and contain a GUID. */
    export class Guid {
        constructor();
        constructor(value: string);
        /** Gets the GUID. Works identically to the valueOf() method. */
        toString(): string;
        /** Gets the GUID. Works identically to the toString() method. */
        valueOf(): string;
    }
    export interface StoreOptions<T = Store> {
        /** Specifies the function that is executed when the store throws an error. */
        errorHandler?: Function;
        /** Specifies the key property (or properties) used to access data items. */
        key?: string | Array<string>;
        /** A function that is executed after a data item is added to the store. */
        onInserted?: ((values: any, key: any | string | number) => any);
        /** A function that is executed before a data item is added to the store. */
        onInserting?: ((values: any) => any);
        /** A function that is executed after data is loaded to the store. */
        onLoaded?: ((result: Array<any>) => any);
        /** A function that is executed before data is loaded to the store. */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /** A function that is executed after a data item is added, updated, or removed from the store. */
        onModified?: Function;
        /** A function that is executed before a data item is added, updated, or removed from the store. */
        onModifying?: Function;
        /** A function that is executed after a data item is removed from the store. */
        onRemoved?: ((key: any | string | number) => any);
        /** A function that is executed before a data item is removed from the store. */
        onRemoving?: ((key: any | string | number) => any);
        /** A function that is executed after a data item is updated in the store. */
        onUpdated?: ((key: any | string | number, values: any) => any);
        /** A function that is executed before a data item is updated in the store. */
        onUpdating?: ((key: any | string | number, values: any) => any);
    }
    /** The base class for all Stores. */
    export class Store {
        constructor(options?: StoreOptions)
        /** Gets a data item with a specific key. */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** Adds a data item to the store. */
        insert(values: any): Promise<any> & JQueryPromise<any>;
        /** Gets the key property (or properties) as specified in the key option. */
        key(): any;
        /** Gets a data item's key value. */
        keyOf(obj: any): any;
        /** Starts loading data. */
        load(): Promise<any> & JQueryPromise<any>;
        /** Starts loading data. */
        load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Removes a data item with a specific key from the store. */
        remove(key: any | string | number): Promise<void> & JQueryPromise<void>;
        /** Gets the total count of items the load() function returns. */
        totalCount(obj: { filter?: any, group?: any }): Promise<number> & JQueryPromise<number>;
        /** Updates a data item with a specific key. */
        update(key: any | string | number, values: any): Promise<any> & JQueryPromise<any>;
    }
    export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
        /** Specifies the store's associated array. */
        data?: Array<any>;
    }
    /** The ArrayStore is a store that provides an interface for loading and editing an in-memory array and handling related events. */
    export class ArrayStore extends Store {
        constructor(options?: ArrayStoreOptions)
        /** Clears all the ArrayStore's associated data. */
        clear(): void;
        /** Creates a Query for the underlying array. */
        createQuery(): any;
    }
    /** This section describes the loadOptions object's fields. */
    export interface LoadOptions {
        /** An object for storing additional settings that should be sent to the server. Relevant to the ODataStore only. */
        customQueryParams?: any;
        /** An array of strings that represent the names of navigation properties to be loaded simultaneously with the ODataStore. */
        expand?: any;
        /** A filter expression. */
        filter?: any;
        /** A group expression. */
        group?: any;
        /** A group summary expression. Used with the group setting. */
        groupSummary?: any;
        /** Indicates whether a top-level group count is required. Used in conjunction with the filter, take, skip, requireTotalCount, and group settings. */
        requireGroupCount?: boolean;
        /** Indicates whether the total count of data objects is needed. */
        requireTotalCount?: boolean;
        /** A data field or expression whose value is compared to the search value. */
        searchExpr?: string | Function | Array<string | Function>;
        /** A comparison operation. Can have one of the following values: "=", "<>", ">", ">=", "<", "<=", "startswith", "endswith", "contains", "notcontains", "isblank" and "isnotblank". */
        searchOperation?: string;
        /** The current search value. */
        searchValue?: any;
        /** A select expression. */
        select?: any;
        /** The number of data objects to be skipped from the result set's start. In conjunction with take, used to implement paging. */
        skip?: number;
        /** A sort expression. */
        sort?: any;
        /** The number of data objects to be loaded. In conjunction with skip, used to implement paging. */
        take?: number;
        /** A total summary expression. */
        totalSummary?: any;
        /** An object for storing additional settings that should be sent to the server. */
        userData?: any;
    }
    export interface CustomStoreOptions extends StoreOptions<CustomStore> {
        /** Specifies a custom implementation of the byKey(key) method. */
        byKey?: ((key: any | string | number) => Promise<any> | JQueryPromise<any>);
        /** Specifies whether raw data should be saved in the cache. Applies only if loadMode is "raw". */
        cacheRawData?: boolean;
        /** Specifies a custom implementation of the insert(values) method. */
        insert?: ((values: any) => Promise<any> | JQueryPromise<any>);
        /** Specifies a custom implementation of the load(options) method. */
        load?: ((options: LoadOptions) => Promise<any> | JQueryPromise<any>);
        /** Specifies how data returned by the load function is treated. */
        loadMode?: 'processed' | 'raw';
        /** Specifies a custom implementation of the remove(key) method. */
        remove?: ((key: any | string | number) => Promise<void> | JQueryPromise<void>);
        /** Specifies a custom implementation of the totalCount(options) method. */
        totalCount?: ((loadOptions: { filter?: any, group?: any }) => Promise<number> | JQueryPromise<number>);
        /** Specifies a custom implementation of the update(key, values) method. */
        update?: ((key: any | string | number, values: any) => Promise<any> | JQueryPromise<any>);
        /** Specifies whether the store combines the search and filter expressions. Defaults to true if the loadMode is "raw" and false if it is "processed". */
        useDefaultSearch?: boolean;
    }
    /** The CustomStore enables you to implement custom data access logic for consuming data from any source. */
    export class CustomStore extends Store {
        constructor(options?: CustomStoreOptions)
        /** Deletes data from the cache. Takes effect only if the cacheRawData option is true. */
        clearRawDataCache(): void;
    }
    export interface DataSourceOptions {
        /** Custom parameters that should be passed to an OData service with the load query. Available only for the ODataStore. */
        customQueryParams?: any;
        /** Specifies the navigation properties to be loaded with the OData entity. Available only for the ODataStore. */
        expand?: Array<string> | string;
        /** Specifies data filtering conditions. */
        filter?: string | Array<any> | Function;
        /** Specifies data grouping options. */
        group?: string | Array<any> | Function;
        /** Specifies an item mapping function. */
        map?: ((dataItem: any) => any);
        /** A function that is executed after data is successfully loaded. */
        onChanged?: Function;
        /** A function that is executed when data loading fails. */
        onLoadError?: ((error: { message?: string }) => any);
        /** A function that is executed when the data loading status changes. */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /** Specifies the maximum number of data items per page. Applies only if paginate is true. */
        pageSize?: number;
        /** Specifies whether the DataSource loads data items by pages or all at once. Defaults to false if group is set; otherwise, true. */
        paginate?: boolean;
        /** Specifies a post processing function. */
        postProcess?: ((data: Array<any>) => Array<any>);
        /** Specifies whether the DataSource requests the total count of data items in the storage. */
        requireTotalCount?: boolean;
        /** Specifies the fields to search. */
        searchExpr?: string | Function | Array<string | Function>;
        /** Specifies the comparison operation used in searching. The following values are accepted: "=", "<>", ">", ">=", "<", "<=", "startswith", "endswith", "contains", "notcontains". */
        searchOperation?: string;
        /** Specifies the value to which the search expression is compared. */
        searchValue?: any;
        /** Specifies the fields to select from data objects. */
        select?: string | Array<any> | Function;
        /** Specifies data sorting options. */
        sort?: string | Array<any> | Function;
        /** Configures the store underlying the DataSource. */
        store?: Store | StoreOptions | Array<any> | any;
    }
    /** The DataSource is an object that provides an API for processing data from an underlying store. */
    export class DataSource {
        constructor(url: string);
        constructor(data: Array<any>);
        constructor(store: Store);
        constructor(options: CustomStoreOptions | DataSourceOptions);
        /** Cancels the load operation with a specific identifier. */
        cancel(): boolean;
        /** Disposes of all the resources allocated to the DataSource instance. */
        dispose(): void;
        /** Gets the filter option's value. */
        filter(): any;
        /** Sets the filter option's value. */
        filter(filterExpr: any): void;
        /** Gets the group option's value. */
        group(): any;
        /** Sets the group option's value. */
        group(groupExpr: any): void;
        /** Checks whether the count of items on the current page is less than the pageSize. Takes effect only with enabled paging. */
        isLastPage(): boolean;
        /** Checks whether data is loaded in the DataSource. */
        isLoaded(): boolean;
        /** Checks whether data is being loaded in the DataSource. */
        isLoading(): boolean;
        /** Gets data items the DataSource performs operations on. */
        items(): Array<any>;
        /** Gets the value of the underlying store's key option. */
        key(): any & string & number;
        /** Starts loading data. */
        load(): Promise<any> & JQueryPromise<any>;
        /** Gets an object with current data processing settings. */
        loadOptions(): any;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Gets the current page index. */
        pageIndex(): number;
        /** Sets the index of the page that should be loaded on the next load() method call. */
        pageIndex(newIndex: number): void;
        /** Gets the page size. */
        pageSize(): number;
        /** Sets the page size. */
        pageSize(value: number): void;
        /** Gets the paginate option's value. */
        paginate(): boolean;
        /** Sets the paginate option's value. */
        paginate(value: boolean): void;
        /** Clears currently loaded DataSource items and calls the load() method. */
        reload(): Promise<any> & JQueryPromise<any>;
        /** Gets the requireTotalCount option's value. */
        requireTotalCount(): boolean;
        /** Sets the requireTotalCount option's value. */
        requireTotalCount(value: boolean): void;
        /** Gets the searchExpr option's value. */
        searchExpr(): string & Function & Array<string | Function>;
        /** Sets the searchExpr option's value. */
        searchExpr(expr: string | Function | Array<string | Function>): void;
        /** Gets the searchOperation option's value. */
        searchOperation(): string;
        /** Sets the searchOperation option's value. */
        searchOperation(op: string): void;
        /** Gets the searchValue option's value. */
        searchValue(): any;
        /** Sets the searchValue option's value. */
        searchValue(value: any): void;
        /** Gets the select option's value. */
        select(): any;
        /** Sets the select option's value. */
        select(expr: any): void;
        /** Gets the sort option's value. */
        sort(): any;
        /** Sets the sort option's value. */
        sort(sortExpr: any): void;
        /** Gets the instance of the store underlying the DataSource. */
        store(): any;
        /** Gets the number of data items in the store after the last load() operation without paging. Takes effect only if requireTotalCount is true */
        totalCount(): number;
    }
    export interface LocalStoreOptions extends ArrayStoreOptions<LocalStore> {
        /** Specifies a delay in milliseconds between when data changes and the moment these changes are saved in the local storage. Applies only if immediate is false. */
        flushInterval?: number;
        /** Specifies whether the LocalStore saves changes in the local storage immediately. */
        immediate?: boolean;
        /** Specifies the name under which data should be saved in the local storage. The `dx-data-localStore-` prefix will be added to the name. */
        name?: string;
    }
    /** The LocalStore is a store that provides an interface for loading and editing data from HTML Web Storage (also known as window.localStorage) and handling related events. */
    export class LocalStore extends ArrayStore {
        constructor(options?: LocalStoreOptions)
        /** Removes data from the local storage. */
        clear(): void;
    }
    /** The Query is an object that provides a chainable interface for making data queries. */
    export class Query {
        /** Calculates a custom summary for all data items. */
        aggregate(seed: any, step: Function, finalize: Function): Promise<any> & JQueryPromise<any>;
        /** Calculates a custom summary for all data items. */
        aggregate(step: Function): Promise<any> & JQueryPromise<any>;
        /** Calculates the average of all values. Applies only to numeric arrays. */
        avg(): Promise<number> & JQueryPromise<number>;
        /** Calculates the average of all values found using a getter. */
        avg(getter: any): Promise<number> & JQueryPromise<number>;
        /** Calculates the number of data items. */
        count(): Promise<number> & JQueryPromise<number>;
        /** Executes the Query. This is an asynchronous alternative to the toArray() method. */
        enumerate(): Promise<any> & JQueryPromise<any>;
        /** Filters data items using a filter expression. */
        filter(criteria: Array<any>): Query;
        /** Filters data items using a custom function. */
        filter(predicate: Function): Query;
        /** Groups data items by the specified getter. */
        groupBy(getter: any): Query;
        /** Calculates the maximum value. Applies only to numeric arrays. */
        max(): Promise<number | Date> & JQueryPromise<number | Date>;
        /** Calculates the maximum of all values found using a getter. */
        max(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /** Calculates the minimum value. Applies only to numeric arrays. */
        min(): Promise<number | Date> & JQueryPromise<number | Date>;
        /** Calculates the minumum of all values found using a getter. */
        min(getter: any): Promise<number | Date> & JQueryPromise<number | Date>;
        /** Selects individual fields from data objects. */
        select(getter: any): Query;
        /** Gets a specified number of data items starting from a given index. */
        slice(skip: number, take?: number): Query;
        /** Sorts data items by the specified getter in ascending order. */
        sortBy(getter: any): Query;
        /** Sorts data items by the specified getter in the specified sorting order. */
        sortBy(getter: any, desc: boolean): Query;
        /** Calculates the sum of all values. */
        sum(): Promise<number> & JQueryPromise<number>;
        /** Calculates the sum of all values found using a getter. */
        sum(getter: any): Promise<number> & JQueryPromise<number>;
        /** Sorts data items by one more getter in ascending order. */
        thenBy(getter: any): Query;
        /** Sorts data items by one more getter in the specified sorting order. */
        thenBy(getter: any, desc: boolean): Query;
        /** Gets data items associated with the Query. This is a synchronous alternative to the enumerate() method. */
        toArray(): Array<any>;
    }
    export interface ODataContextOptions {
        /** Specifies a function that customizes the request before it is sent to the server. */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /** Specifies whether stores in the ODataContext serialize/parse date-time values. */
        deserializeDates?: boolean;
        /** Specifies entity collections to be accessed. */
        entities?: any;
        /** Specifies a function that is executed when the ODataContext throws an error. */
        errorHandler?: Function;
        /** Specifies whether data should be sent using JSONP. */
        jsonp?: boolean;
        /** Specifies a URL to an OData service. */
        url?: string;
        /** Specifies the OData version. */
        version?: number;
        /** Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request. */
        withCredentials?: boolean;
    }
    /** The ODataContent is an object that provides access to an entire OData service. */
    export class ODataContext {
        constructor(options?: ODataContextOptions)
        /** Invokes an OData operation that returns a value. */
        get(operationName: string, params: any): Promise<any> & JQueryPromise<any>;
        /** Invokes an OData operation that returns nothing. */
        invoke(operationName: string, params: any, httpMethod: any): Promise<void> & JQueryPromise<void>;
        /** Gets a link to an entity with a specific key. */
        objectLink(entityAlias: string, key: any | string | number): any;
    }
    export interface ODataStoreOptions extends StoreOptions<ODataStore> {
        /** Specifies a function that customizes the request before it is sent to the server. */
        beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => any);
        /** Specifies whether the store serializes/parses date-time values. */
        deserializeDates?: boolean;
        /** Specifies the data field types. Accepts the following types: "String", "Int32", "Int64", "Boolean", "Single", "Decimal" and "Guid". */
        fieldTypes?: any;
        /** Specifies whether data should be sent using JSONP. */
        jsonp?: boolean;
        /** Specifies the type of the key property or properties. */
        keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
        /** A function that is executed before data is loaded to the store. */
        onLoading?: ((loadOptions: LoadOptions) => any);
        /** Specifies a URL to an OData entity collection. */
        url?: string;
        /** Specifies the OData version. */
        version?: number;
        /** Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request. */
        withCredentials?: boolean;
    }
    /** The ODataStore is a store that provides an interface for loading and editing data from an individual OData entity collection and handling related events. */
    export class ODataStore extends Store {
        constructor(options?: ODataStoreOptions)
        /** Gets a data item with a specific key. */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** Gets an entity with a specific key. */
        byKey(key: any | string | number, extraOptions: { expand?: string | Array<string> }): Promise<any> & JQueryPromise<any>;
        /** Creates a Query for the OData endpoint. */
        createQuery(loadOptions: any): any;
        /** Starts loading data. */
        load(): Promise<any> & JQueryPromise<any>;
        /** Starts loading data. */
        load(options: LoadOptions): Promise<any> & JQueryPromise<any>;
    }
    /** The EdmLiteral is an object for working with primitive data types from the OData's Abstract Type System that are not supported in JavaScript. */
    export class EdmLiteral {
        constructor(value: string);
        /** Gets the EdmLiteral's value converted to a string. */
        valueOf(): string;
    }
    export interface PivotGridDataSourceOptions {
        /** Configures pivot grid fields. */
        fields?: Array<PivotGridDataSourceField>;
        /** Specifies data filtering conditions. Cannot be used with an XmlaStore. */
        filter?: string | Array<any> | Function;
        /** A function that is executed after data is successfully loaded. */
        onChanged?: Function;
        /** A function that is executed when all fields are loaded from the store and they are ready to be displayed in the PivotGrid. */
        onFieldsPrepared?: ((fields: Array<PivotGridDataSourceField>) => any);
        /** A function that is executed when data loading fails. */
        onLoadError?: ((error: any) => any);
        /** A function that is executed when the data loading status changes. */
        onLoadingChanged?: ((isLoading: boolean) => any);
        /** Specifies whether the data processing operations (filtering, grouping, summary calculation) should be performed on the server. */
        remoteOperations?: boolean;
        /** Specifies whether to auto-generate pivot grid fields from the store's data. */
        retrieveFields?: boolean;
        /** Configures the DataSource's underlying store. */
        store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{ type?: 'array' | 'local' | 'odata' | 'xmla' }> | { type?: 'array' | 'local' | 'odata' | 'xmla' };
    }
    /** The PivotGridDataSource is an object that provides an API for processing data from an underlying store. This object is used in the PivotGrid widget. */
    export class PivotGridDataSource {
        constructor(options?: PivotGridDataSourceOptions)
        /** Collapses all header items of a field with the specified identifier. */
        collapseAll(id: number | string): void;
        /** Collapses a specific header item. */
        collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
        /** Provides access to the facts that were used to calculate a specific summary value. */
        createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>, rowPath?: Array<string | number | Date>, dataIndex?: number, maxRowCount?: number, customColumns?: Array<string> }): DataSource;
        /** Disposes of all the resources allocated to the PivotGridDataSource instance. */
        dispose(): void;
        /** Expands all the header items of a field with the specified identifier. */
        expandAll(id: number | string): void;
        /** Expands a specific header item. */
        expandHeaderItem(area: string, path: Array<any>): void;
        /** Gets all the options of a field with the specified identifier. */
        field(id: number | string): any;
        /** Updates field options' values. */
        field(id: number | string, options: any): void;
        /** Gets all the fields including those generated automatically. */
        fields(): Array<PivotGridDataSourceField>;
        /** Specifies a new fields collection. */
        fields(fields: Array<PivotGridDataSourceField>): void;
        /** Gets the filter option's value. Does not affect an XmlaStore. */
        filter(): any;
        /** Sets the filter option's value. Does not affect an XmlaStore. */
        filter(filterExpr: any): void;
        /** Gets all the fields within an area. */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridDataSourceField>;
        /** Gets the loaded data. Another data portion is loaded every time a header item is expanded. */
        getData(): any;
        /** Checks whether the PivotGridDataSource is loading data. */
        isLoading(): boolean;
        /** Starts loading data. */
        load(): Promise<any> & JQueryPromise<any>;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Clears the loaded PivotGridDataSource data and calls the load() method. */
        reload(): Promise<any> & JQueryPromise<any>;
        /** Gets the current PivotGridDataSource state. */
        state(): any;
        /** Sets the PivotGridDataSource state. */
        state(state: any): void;
    }
    export interface XmlaStoreOptions {
        /** Specifies a function that customizes the request before it is sent to the server. */
        beforeSend?: ((options: { url?: string, method?: string, headers?: any, xhrFields?: any, data?: string, dataType?: string }) => any);
        /** Specifies the database (or initial catalog) that contains the OLAP cube to use. */
        catalog?: string;
        /** Specifies the name of the OLAP cube to use from the catalog. */
        cube?: string;
        /** Specifies the OLAP server's URL. */
        url?: string;
    }
    /** The XmlaStore is a store that provides an interface for accessing an OLAP cube according to the XMLA standard. */
    export class XmlaStore {
        constructor(options?: XmlaStoreOptions)
    }
    /** Specifies the function that is executed when a data layer object throws an error. */
    export function errorHandler(e: Error): void;
    /** Creates a Query instance. */
    export function query(array: Array<any>): Query;
    /** Creates a Query instance that accesses a remote data service using its URL. */
    export function query(url: string, queryOptions: any): Query;
    /** Encodes a string or array of bytes in Base64. */
    export function base64_encode(input: string | Array<number>): string;
    /** Configures pivot grid fields. */
    export interface PivotGridDataSourceField {
        /** Specifies whether to take neighboring groups' summary values into account when calculating a running total and absolute or percent variation. */
        allowCrossGroupCalculation?: boolean;
        /** Specifies whether a user can expand/collapse all items within the same column or row header level using the context menu. */
        allowExpandAll?: boolean;
        /** Specifies whether a user can filter the field's values. */
        allowFiltering?: boolean;
        /** Specifies whether a user can change the field's sorting. */
        allowSorting?: boolean;
        /** Specifies whether a user can sort the pivot grid by summary values instead of field values. */
        allowSortingBySummary?: boolean;
        /** Specifies the field's area. */
        area?: undefined | 'column' | 'data' | 'filter' | 'row';
        /** Specifies the field's order among the other fields in the same area. Corresponds to the field's order in the fields array by default. */
        areaIndex?: number;
        /** Specifies a custom aggregate function. Applies only if the summaryType is "custom". Cannot be used with an XmlaStore. */
        calculateCustomSummary?: ((options: { summaryProcess?: string, value?: any, totalValue?: any }) => any);
        /** Specifies a custom post-processing function for summary values. */
        calculateSummaryValue?: ((e: DevExpress.ui.dxPivotGridSummaryCell) => number);
        /** Specifies the field's caption to be displayed in the field chooser and on the field panel. */
        caption?: string;
        /** Customizes the text displayed in summary cells. */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string }) => string);
        /** Specifies which data source field provides data for the pivot grid field. */
        dataField?: string;
        /** Casts field values to a specific data type. */
        dataType?: 'date' | 'number' | 'string';
        /** Specifies the name of the folder in which the field is located when displayed in the field chooser. */
        displayFolder?: string;
        /** Specifies whether to expand all items within the field's header level. */
        expanded?: boolean;
        /** Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values. */
        filterType?: 'exclude' | 'include';
        /** Specifies the values by which the field is filtered. */
        filterValues?: Array<any>;
        /** Formats field values before they are displayed. */
        format?: DevExpress.ui.format;
        /** Specifies the field's index within its group. */
        groupIndex?: number;
        /** Specifies how the field's values are combined into groups for the headers. Cannot be used with an XmlaStore. */
        groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
        /** Specifies the name of the field's group. */
        groupName?: string;
        /** Configures the field's header filter. */
        headerFilter?: { width?: number, height?: number, allowSearch?: boolean };
        /** Specifies whether the field should be treated as a measure (a field providing data for calculation). */
        isMeasure?: boolean;
        /** Specifies the field's identifier. */
        name?: string;
        /** Specifies whether to calculate the running total by rows or by columns. */
        runningTotal?: 'column' | 'row';
        /** Specifies a function that combines the field's values into groups for the headers. Cannot be used with an XmlaStore or remote operations. */
        selector?: Function;
        /** Specifies whether to display the field's grand totals. Applies only if the field is in the data area. */
        showGrandTotals?: boolean;
        /** Specifies whether to display the field's totals. Applies only if the field is in the data area. */
        showTotals?: boolean;
        /** Specifies whether to display the field's summary values. Applies only if the field is in the data area. Inherits the showTotals' value by default. */
        showValues?: boolean;
        /** Specifies how the field's values in the headers should be sorted. */
        sortBy?: 'displayText' | 'value' | 'none';
        /** Sorts the field's values in the headers by the specified measure's summary values. Accepts the measure's name, caption, dataField, or index in the fields array. */
        sortBySummaryField?: string;
        /** Specifies a path to the column or row whose summary values should be used to sort the field's values in the headers. */
        sortBySummaryPath?: Array<number | string>;
        /** Specifies a custom comparison function that sorts the field's values in the headers. */
        sortingMethod?: ((a: { value?: string | number, children?: Array<any> }, b: { value?: string | number, children?: Array<any> }) => number);
        /** Specifies the field values' sorting order. */
        sortOrder?: 'asc' | 'desc';
        /** Specifies a predefined post-processing function. Does not apply when the calculateSummaryValue option is set. */
        summaryDisplayMode?: 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';
        /** Specifies how to aggregate the field's data. Cannot be used with an XmlaStore. */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';
        /** Specifies whether the field is visible in the pivot grid and field chooser. */
        visible?: boolean;
        /** Specifies the field's width in pixels when the field is displayed in the pivot grid. */
        width?: number;
        /** Specifies whether text that does not fit into a header item should be wrapped. */
        wordWrapEnabled?: boolean;
    }
}
declare module DevExpress.core {
    /** A mixin that provides a capability to fire and subscribe to events. */
    export class EventsMixin {
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
    }
    export type dxElement = Element & JQuery; 
}
declare module DevExpress.framework {
    /** @deprecated #include spa-deprecated-note */
    export type dxAction = ((e: { element?: JQuery, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string | any; 
    export interface dxCommandOptions extends DOMComponentOptions<dxCommand> {
        /** Indicates whether or not the widget that displays this command is disabled. */
        disabled?: boolean;
        /** Specifies the name of the icon shown inside the widget associated with this command. */
        icon?: string;
        /** @deprecated Use the icon option instead. */
        iconSrc?: any;
        /** The identifier of the command. */
        id?: string;
        /** Specifies an action performed when the execute() method of the command is called. */
        onExecute?: ((e: { component?: dxCommand, element?: DevExpress.core.dxElement, model?: any }) => any) | string | any;
        /** Specifies whether the current command is rendered when a view is being rendered or after a view is shown. */
        renderStage?: 'onViewShown' | 'onViewRendering';
        /** Specifies the title of the widget associated with this command. */
        title?: string;
        /** Specifies the type of the button, if the command is rendered as a Button widget. */
        type?: string;
        /** A Boolean value specifying whether or not the widget associated with this command is visible. */
        visible?: boolean;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxCommand extends DOMComponent {
        constructor(element: Element | JQuery, options?: dxCommandOptions);
        constructor(options: dxCommandOptions);
        /** Executes the action associated with this command. */
        execute(): void;
    }
    /** @deprecated #include spa-deprecated-note */
    export class Router {
        /** Formats an object to a URI. */
        format(obj: any): string;
        /** Decodes the specified URI to an object using the registered routing rules. */
        parse(uri: string): any;
        /** Adds a routing rule to the list of registered rules. */
        register(pattern: string, defaults?: any, constraints?: any): void;
    }
    export interface StateManagerOptions {
        /** A storage to which the state manager saves the application state. */
        storage?: any;
    }
    /** @deprecated #include spa-deprecated-note */
    export class StateManager {
        constructor(options?: StateManagerOptions)
        /** Adds an object that implements an interface of a state source to the state manager's collection of state sources. */
        addStateSource(stateSource: any): void;
        /** Removes the application state that has been saved by the saveState() method to the state storage. */
        clearState(): void;
        /** Removes a specified state source from the state manager's collection of state sources. */
        removeStateSource(stateSource: any): void;
        /** Restores the application state that has been saved by the saveState() method to the state storage. */
        restoreState(): void;
        /** Saves the current application state. */
        saveState(): void;
    }
    /** @deprecated #include spa-deprecated-note */
    export class ViewCache {
        /** Removes all the viewInfo objects from the cache. */
        clear(): void;
        /** Obtains a viewInfo object from the cache by the specified key. */
        getView(key: string): any;
        /** Checks whether or not a viewInfo object is contained in the view cache under the specified key. */
        hasView(key: string): boolean;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Removes a viewInfo object from the cache by the specified key. */
        removeView(key: string): any;
        /** Adds the specified viewInfo object to the cache under the specified key. */
        setView(key: string, viewInfo: any): void;
    }
    export interface dxCommandContainerOptions {
        /** The identifier of the command container. */
        id?: string;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxCommandContainer {
        constructor(options?: dxCommandContainerOptions)
    }
    export interface dxViewOptions {
        /** Indicates whether to cache the view. */
        disableCache?: boolean;
        /** Indicates whether the view should be displayed in a modal mode. */
        modal?: boolean;
        /** Specifies the name of the view defined by this markup component. */
        name?: string;
        /** Specifies the target device orientation for this view HTML template. */
        orientation?: 'portrait' | 'landscape';
        /** Specifies whether to display the view in the 'master' or 'detail' pane of the Split layout. */
        pane?: 'master' | 'detail';
        /** Specifies the title of the current view. */
        title?: string;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxView {
        constructor(options?: dxViewOptions)
    }
    export interface dxLayoutOptions {
        /** Specifies the name of the layout. */
        name?: string;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxLayout {
        constructor(options?: dxLayoutOptions)
    }
    export interface dxViewPlaceholderOptions {
        /** Specifies the name of the view to be rendered to this placeholder element. */
        viewName?: string;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxViewPlaceholder {
        constructor(options?: dxViewPlaceholderOptions)
    }
    export interface dxTransitionOptions {
        /** Specifies the animation preset used when the content enclosed in the current dxTransition element is being changed. */
        animation?: string;
        /** Specifies the name of the dxTransition component instance. */
        name?: string;
        /** @deprecated Use the animation option instead. */
        type?: 'slide' | 'fade' | 'overflow';
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxTransition {
        constructor(options?: dxTransitionOptions)
    }
    export interface dxContentPlaceholderOptions {
        /** Specifies the animation preset used when the placeholder's content is being changed. */
        animation?: string;
        /** Specifies a CSS position value for placeholder content. */
        contentCssPosition?: 'absolute' | 'static';
        /** Specifies the content placeholder name. */
        name?: string;
        /** @deprecated Use the animation option instead. */
        transition?: 'none' | 'slide' | 'fade' | 'overflow';
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxContentPlaceholder {
        constructor(options?: dxContentPlaceholderOptions)
    }
    export interface dxContentOptions {
        /** Specifies the name of the placeholder to which the current content should be rendered. */
        targetPlaceholder?: string;
    }
    /** @deprecated #include spa-deprecated-note */
    export class dxContent {
        constructor(options?: dxContentOptions)
    }
}
declare module DevExpress.framework.html {
    export interface HtmlApplicationOptions {
        /** Specifies the animation presets that are used to animate different UI elements in the current application. */
        animationSet?: any;
        /** Specifies where the commands that are defined in the application's views must be displayed. */
        commandMapping?: any;
        /** Specifies whether or not view caching is disabled. */
        disableViewCache?: boolean;
        /** An array of layout controllers that should be used to show application views in the current navigation context. */
        layoutSet?: string | Array<any>;
        /** Specifies whether the current application must behave as a mobile or web application. */
        mode?: 'mobileApp' | 'webSite';
        /** Specifies the object that represents a root namespace of the application. */
        namespace?: any;
        /** Specifies application behavior when the user navigates to a root view. */
        navigateToRootViewMode?: 'keepHistory' | 'resetHistory';
        /** An array of dxCommand configuration objects used to define commands available from the application's global navigation. */
        navigation?: Array<dxCommand | dxCommandOptions>;
        /** A custom router to be used in the application. */
        router?: any;
        /** A state manager to be used in the application. */
        stateManager?: any;
        /** Specifies the storage to be used by the application's state manager to store the application state. */
        stateStorage?: any;
        /** Specifies the current version of application templates. */
        templatesVersion?: string;
        /** Indicates whether on not to use the title of the previously displayed view as text on the Back button. */
        useViewTitleAsBackText?: boolean;
        /** A custom view cache to be used in the application. */
        viewCache?: any;
        /** Specifies a limit for the views that can be cached. */
        viewCacheSize?: number;
        /** Specifies options for the viewport meta tag of a mobile browser. */
        viewPort?: any;
    }
    /** @deprecated #include spa-deprecated-note */
    export class HtmlApplication {
        constructor(options?: HtmlApplicationOptions)
        /** Provides access to the ViewCache object. */
        viewCache: any;
        /** Provides access to the Router object. */
        router: any;
        /** An array of dxCommand components that are created based on the application's navigation option value. */
        navigation: Array<dxCommand>;
        /** Provides access to the StateManager object. */
        stateManager: any;
        /** Navigates to the URI preceding the current one in the navigation history. */
        back(): void;
        /** Returns a Boolean value indicating whether or not backwards navigation is currently possible. */
        canBack(): boolean;
        /** Calls the clearState() method of the application's StateManager object. */
        clearState(): void;
        /** Creates global navigation commands. */
        createNavigation(navigationConfig: Array<any>): void;
        /** Returns an HTML template of the specified view. */
        getViewTemplate(viewName: string): JQuery;
        /** Returns a configuration object used to create a dxView component for a specified view. */
        getViewTemplateInfo(viewName: string): any;
        /** Adds a specified HTML template to a collection of view or layout templates. */
        loadTemplates(source: string | JQuery): Promise<void> & JQueryPromise<void>;
        /** Navigates to the specified URI. */
        navigate(uri?: string | any): void;
        /** Navigates to the specified URI. */
        navigate(uri: string | any, options: { root?: boolean, target?: string, direction?: string, modal?: boolean }): void;
        /** Detaches all event handlers from a single event. */
        off(eventName: string): this;
        /** Detaches a particular event handler from a single event. */
        off(eventName: string, eventHandler: Function): this;
        /** Subscribes to an event. */
        on(eventName: string, eventHandler: Function): this;
        /** Subscribes to events. */
        on(events: any): this;
        /** Renders navigation commands to the navigation command containers that are located in the layouts used in the application. */
        renderNavigation(): void;
        /** Calls the restoreState() method of the application's StateManager object. */
        restoreState(): void;
        /** Calls the saveState method of the application's StateManager object. */
        saveState(): void;
        /** Provides access to the object that defines the current context to be considered when choosing an appropriate template for a view. */
        templateContext(): any;
    }
    export var layoutSets: Array<string>;
    export var animationSets: any;
}
declare module DevExpress.ui {
    export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
        /** A number specifying the time in milliseconds spent on the animation of the expanding or collapsing of a panel. */
        animationDuration?: number;
        /** Specifies whether all items can be collapsed or whether at least one item must always be expanded. */
        collapsible?: boolean;
        /** Specifies whether to render the panel's content when it is displayed. If false, the content is rendered immediately. */
        deferRendering?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies a custom template for items. */
        itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies a custom template for item titles. */
        itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether the widget can expand several items or only a single item at once. */
        multiple?: boolean;
        /** A handler for the itemTitleClick event. */
        onItemTitleClick?: ((e: { component?: dxAccordion, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any) | string;
        /** The index number of the currently selected item. */
        selectedIndex?: number;
    }
    /** The Accordion widget contains several panels displayed one under another. These panels can be collapsed or expanded by an end user, which makes this widget very useful for presenting information in a limited amount of space. */
    export class dxAccordion extends CollectionWidget {
        constructor(element: Element, options?: dxAccordionOptions)
        constructor(element: JQuery, options?: dxAccordionOptions)
        /** Collapses an item with a specific index. */
        collapseItem(index: number): Promise<void> & JQueryPromise<void>;
        /** Expands an item with a specific index. */
        expandItem(index: number): Promise<void> & JQueryPromise<void>;
        /** Updates the dimensions of the widget contents. */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /** This section lists the data source fields that are used in a default template for Accordion items. */
    export interface dxAccordionItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the name of the icon displayed by the widget item title. */
        icon?: string;
        /** Specifies text displayed for the widget item title. */
        title?: string;
    }
    export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
        /** The text displayed in the button that closes the action sheet. */
        cancelText?: string;
        /** A handler for the cancelClick event. */
        onCancelClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any) | string;
        /** Specifies whether or not to display the Cancel button in action sheet. */
        showCancelButton?: boolean;
        /** A Boolean value specifying whether or not the title of the action sheet is visible. */
        showTitle?: boolean;
        /** Specifies the element the action sheet popover points at. Applies only if usePopover is true. */
        target?: string | Element | JQuery;
        /** The title of the action sheet. */
        title?: string;
        /** Specifies whether or not to show the action sheet within a Popover widget. */
        usePopover?: boolean;
        /** A Boolean value specifying whether or not the ActionSheet widget is visible. */
        visible?: boolean;
    }
    /** The ActionSheet widget is a sheet containing a set of buttons located one under the other. These buttons usually represent several choices relating to a single task. */
    export class dxActionSheet extends CollectionWidget {
        constructor(element: Element, options?: dxActionSheetOptions)
        constructor(element: JQuery, options?: dxActionSheetOptions)
        /** Hides the widget. */
        hide(): Promise<void> & JQueryPromise<void>;
        /** Shows the widget. */
        show(): Promise<void> & JQueryPromise<void>;
        /** Shows or hides the widget depending on the argument. */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** This section lists the data source fields that are used in a default template for action sheet items. */
    export interface dxActionSheetItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the icon to be displayed on an action sheet button. */
        icon?: string;
        /** A handler for the click event raised for the button representing the given action sheet button. */
        onClick?: ((e: { component?: dxActionSheet, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** Specifies the type of the button that represents an action sheet item. */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
    }
    export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
        /** Specifies the maximum count of items displayed by the widget. */
        maxItemCount?: number;
        /** The minimum number of characters that must be entered into the text box to begin a search. */
        minSearchLength?: number;
        /** Specifies the current value displayed by the widget. */
        value?: string;
    }
    /** The Autocomplete widget is a textbox that provides suggestions while a user types into it. */
    export class dxAutocomplete extends dxDropDownList {
        constructor(element: Element, options?: dxAutocompleteOptions)
        constructor(element: JQuery, options?: dxAutocompleteOptions)
    }
    export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
        /** Specifies how widget items are aligned along the main direction. */
        align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
        /** Specifies how widget items are aligned cross-wise. */
        crossAlign?: 'center' | 'end' | 'start' | 'stretch';
        /** Specifies the direction of item positioning in the widget. */
        direction?: 'col' | 'row';
    }
    /** The Box widget allows you to arrange various elements within it. Separate and adaptive, the Box widget acts as a building block for the layout. */
    export class dxBox extends CollectionWidget {
        constructor(element: Element, options?: dxBoxOptions)
        constructor(element: JQuery, options?: dxBoxOptions)
    }
    /** This section lists the data source fields that are used in a default template for list items. */
    export interface dxBoxItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the base size of an item element along the main direction. */
        baseSize?: number | 'auto';
        /** Holds a Box configuration object for the item. */
        box?: dxBoxOptions;
        /** Specifies the ratio value used to count the item element size along the main direction. */
        ratio?: number;
        /** A factor that defines how much an item shrinks relative to the rest of the items in the container. */
        shrink?: number;
    }
    export interface dxButtonOptions extends WidgetOptions<dxButton> {
        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies the icon to be displayed on the button. */
        icon?: string;
        /** A handler for the click event. */
        onClick?: ((e: { component?: dxButton, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, validationGroup?: any }) => any) | string;
        /** Specifies a custom template for the Button widget. */
        template?: template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** The text displayed on the button. */
        text?: string;
        /** Specifies the button type. */
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
        /** Specifies whether or not the button must submit an HTML form. */
        useSubmitBehavior?: boolean;
        /** Specifies the name of the validation group to be accessed in the click event handler. */
        validationGroup?: string;
    }
    /** The Button widget is a simple button that performs specified commands when a user clicks it. */
    export class dxButton extends Widget {
        constructor(element: Element, options?: dxButtonOptions)
        constructor(element: JQuery, options?: dxButtonOptions)
    }
    /** This section lists the fields of a context object available in a button template. */
    export interface dxButtonDefaultTemplate {
        /** Holds an icon that is specified using the icon option. */
        icon?: string;
        /** Holds the text that is specified using the text option. */
        text?: string;
    }
    export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies a custom template for calendar cells. */
        cellTemplate?: template | ((itemData: { date?: Date, view?: string, text?: string }, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the date-time value serialization format. Use it only if you do not specify the value at design time. */
        dateSerializationFormat?: string;
        /** Specifies dates to be disabled. */
        disabledDates?: Array<Date> | ((data: { component?: any, date?: Date, view?: string }) => boolean);
        /** Specifies the first day of a week. */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** The latest date the widget allows to select. */
        max?: Date | number | string;
        /** Specifies the maximum zoom level of the calendar. */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** The earliest date the widget allows to select. */
        min?: Date | number | string;
        /** Specifies the minimum zoom level of the calendar. */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** Specifies whether or not the widget displays a button that selects the current date. */
        showTodayButton?: boolean;
        /** An object or a value specifying the date and time currently selected in the calendar. */
        value?: Date | number | string;
        /** Specifies the current calendar zoom level. */
        zoomLevel?: 'century' | 'decade' | 'month' | 'year';
    }
    /** The Calendar is a widget that displays a calendar and allows an end user to select the required date within a specified date range. */
    export class dxCalendar extends Editor {
        constructor(element: Element, options?: dxCalendarOptions)
        constructor(element: JQuery, options?: dxCalendarOptions)
    }
    export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** Specifies the text displayed by the check box. */
        text?: string;
        /** Specifies the widget state. */
        value?: boolean;
    }
    /** The CheckBox is a small box, which when selected by the end user, shows that a particular feature has been enabled or a specific option has been chosen. */
    export class dxCheckBox extends Editor {
        constructor(element: Element, options?: dxCheckBoxOptions)
        constructor(element: JQuery, options?: dxCheckBoxOptions)
    }
    export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
        /** Specifies the text displayed on the button that applies changes and closes the drop-down editor. */
        applyButtonText?: string;
        /** Specifies the way an end-user applies the selected value. */
        applyValueMode?: 'instantly' | 'useButtons';
        /** Specifies the text displayed on the button that cancels changes and closes the drop-down editor. */
        cancelButtonText?: string;
        /** Specifies whether or not the widget value includes the alpha channel component. */
        editAlphaChannel?: boolean;
        /** Specifies a custom template for the input field. Must contain the TextBox widget. */
        fieldTemplate?: template | ((value: string, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the size of a step by which a handle is moved using a keyboard shortcut. */
        keyStep?: number;
        /** Specifies the currently selected value. */
        value?: string;
    }
    /** The ColorBox is a widget that allows an end user to enter a color or pick it out from the drop-down editor. */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxColorBoxOptions)
        constructor(element: JQuery, options?: dxColorBoxOptions)
    }
    export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
        /** Specifies whether to close the ContextMenu if a user clicks outside it. */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** Holds an array of menu items. */
        items?: Array<dxContextMenuItemTemplate>;
        /** A handler for the hidden event. */
        onHidden?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the hiding event. */
        onHiding?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** A handler for the positioning event. */
        onPositioning?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, position?: positionConfig }) => any);
        /** A handler for the showing event. */
        onShowing?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** A handler for the shown event. */
        onShown?: ((e: { component?: dxContextMenu, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** An object defining widget positioning options. */
        position?: positionConfig;
        /** Specifies options for displaying the widget. */
        showEvent?: { name?: string, delay?: number } | string;
        /** Specifies the direction at which submenus are displayed. */
        submenuDirection?: 'auto' | 'left' | 'right';
        /** The target element associated with the context menu. */
        target?: string | Element | JQuery;
        /** A Boolean value specifying whether or not the widget is visible. */
        visible?: boolean;
    }
    /** The ContextMenu widget displays a single- or multi-level context menu. An end user invokes this menu by a right click or a long press. */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: Element, options?: dxContextMenuOptions)
        constructor(element: JQuery, options?: dxContextMenuOptions)
        /** Hides the widget. */
        hide(): Promise<void> & JQueryPromise<void>;
        /** Shows the widget. */
        show(): Promise<void> & JQueryPromise<void>;
        /** Shows or hides the widget depending on the argument. */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
        /** Specifies whether a user can reorder columns. */
        allowColumnReordering?: boolean;
        /** Specifies whether a user can resize columns. */
        allowColumnResizing?: boolean;
        /** Specifies whether data should be cached. */
        cacheEnabled?: boolean;
        /** Enables a hint that appears when a user hovers the mouse pointer over a cell with truncated content. */
        cellHintEnabled?: boolean;
        /** Specifies whether columns should adjust their widths to the content. */
        columnAutoWidth?: boolean;
        /** Configures the column chooser. */
        columnChooser?: { enabled?: boolean, allowSearch?: boolean, searchTimeout?: number, mode?: 'dragAndDrop' | 'select', width?: number, height?: number, title?: string, emptyPanelText?: string };
        /** Configures column fixing. */
        columnFixing?: { enabled?: boolean, texts?: { fix?: string, unfix?: string, leftPosition?: string, rightPosition?: string } };
        /** Specifies whether the widget should hide columns to adapt to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is "widget". */
        columnHidingEnabled?: boolean;
        /** Specifies the minimum width of columns. */
        columnMinWidth?: number;
        /** Specifies how the widget resizes columns. Applies only if allowColumnResizing is true. */
        columnResizingMode?: 'nextColumn' | 'widget';
        /** Overridden. */
        columns?: Array<GridBaseColumn>;
        /** Specifies the width for all data columns. Has a lower priority than the column.width option. */
        columnWidth?: number;
        /** Specifies the origin of data for the widget. */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** Specifies date-time values' serialization format. Use it only if you do not specify the dataSource at design time. */
        dateSerializationFormat?: string;
        /** Overriden. */
        editing?: GridBaseEditing;
        /** Indicates whether to show the error row. */
        errorRowEnabled?: boolean;
        /** Configures the integrated filter builder. */
        filterBuilder?: dxFilterBuilderOptions;
        /** Configures the popup in which the integrated filter builder is shown. */
        filterBuilderPopup?: dxPopupOptions;
        /** Configures the filter panel. */
        filterPanel?: { visible?: boolean, filterEnabled?: boolean, customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string), texts?: { createFilter?: string, clearFilter?: string, filterEnabledHint?: string } };
        /** Configures the filter row. */
        filterRow?: { visible?: boolean, showOperationChooser?: boolean, showAllText?: string, resetOperationText?: string, applyFilter?: 'auto' | 'onClick', applyFilterText?: string, operationDescriptions?: { equal?: string, notEqual?: string, lessThan?: string, lessThanOrEqual?: string, greaterThan?: string, greaterThanOrEqual?: string, startsWith?: string, contains?: string, notContains?: string, endsWith?: string, between?: string }, betweenStartText?: string, betweenEndText?: string };
        /** Specifies whether to synchronize the filter row, header filter, and filter builder. The synchronized filter expression is stored in the filterValue option. */
        filterSyncEnabled?: boolean | 'auto';
        /** Specifies a filter expression. */
        filterValue?: string | Array<any> | Function;
        /** Configures the header filter feature. */
        headerFilter?: { height?: number, visible?: boolean, width?: number, allowSearch?: boolean, searchTimeout?: number, texts?: { emptyValue?: string, ok?: string, cancel?: string } };
        /** Configures the load panel. */
        loadPanel?: { enabled?: boolean | 'auto', text?: string, width?: number, height?: number, showIndicator?: boolean, indicatorSrc?: string, showPane?: boolean };
        /** Specifies text shown when the widget does not display any data. */
        noDataText?: string;
        /** A function that is executed before an adaptive detail row is rendered. */
        onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, formOptions?: any }) => any);
        /** A function that is executed when an error occurs in the data source. */
        onDataErrorOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, error?: Error }) => any);
        /** A function that is executed before a new row is added to the widget. */
        onInitNewRow?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any }) => any);
        /** A function that is executed when the widget is in focus and a key has been pressed down. */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, handled?: boolean }) => any);
        /** A function that is executed after a row is collapsed. */
        onRowCollapsed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /** A function that is executed before a row is collapsed. */
        onRowCollapsing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /** A function that is executed after a row is expanded. */
        onRowExpanded?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any }) => any);
        /** A function that is executed before a row is expanded. */
        onRowExpanding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, key?: any, cancel?: boolean }) => any);
        /** A function that is executed after a new row has been inserted into the data source. */
        onRowInserted?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** A function that is executed before a new row is inserted into the data source. */
        onRowInserting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** A function that is executed after a row has been removed from the data source. */
        onRowRemoved?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** A function that is executed before a row is removed from the data source. */
        onRowRemoving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** A function that is executed after a row has been updated in the data source. */
        onRowUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
        /** A function that is executed before a row is updated in the data source. */
        onRowUpdating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** A function that is executed after cells in a row are validated against validation rules. */
        onRowValidating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string }) => any);
        /** A function that is executed after selecting a row or clearing its selection. */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
        /** A function that is executed before the toolbar is created. */
        onToolbarPreparing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
        /** Configures the pager. */
        pager?: { visible?: boolean | 'auto', showPageSizeSelector?: boolean, allowedPageSizes?: Array<number> | 'auto', showNavigationButtons?: boolean, showInfo?: boolean, infoText?: string };
        /** Configures paging. */
        paging?: GridBasePaging;
        /** Specifies whether rows should be shaded differently. */
        rowAlternationEnabled?: boolean;
        /** Overridden. A configuration object specifying scrolling options. */
        scrolling?: GridBaseScrolling;
        /** Configures the search panel. */
        searchPanel?: { visible?: boolean, width?: number, placeholder?: string, highlightSearchText?: boolean, highlightCaseSensitive?: boolean, text?: string, searchVisibleColumnsOnly?: boolean };
        /** Allows you to select rows or determine which rows are selected. */
        selectedRowKeys?: Array<any>;
        /** Overridden. */
        selection?: GridBaseSelection;
        /** Specifies whether the outer borders of the widget are visible. */
        showBorders?: boolean;
        /** Specifies whether column headers are visible. */
        showColumnHeaders?: boolean;
        /** Specifies whether vertical lines that separate one column from another are visible. */
        showColumnLines?: boolean;
        /** Specifies whether horizontal lines that separate one row from another are visible. */
        showRowLines?: boolean;
        /** Configures runtime sorting. */
        sorting?: { mode?: 'multiple' | 'none' | 'single', ascendingText?: string, descendingText?: string, clearText?: string };
        /** Configures state storing. */
        stateStoring?: { enabled?: boolean, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage', customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((gridState: any) => any), savingTimeout?: number };
        /** Specifies whether to enable two-way data binding. */
        twoWayBindingEnabled?: boolean;
        /** Specifies whether text that does not fit into a column should be wrapped. */
        wordWrapEnabled?: boolean;
    }
    /** Overriden. */
    export interface GridBaseEditing {
        /** Specifies whether a user can add new rows. */
        allowAdding?: boolean;
        /** Specifies whether a user can delete rows. */
        allowDeleting?: boolean;
        /** Specifies whether a user can update rows. */
        allowUpdating?: boolean;
        /** Configures the form. Used only if editing.mode is "form" or "popup". */
        form?: dxFormOptions;
        /** Specifies how a user edits data. */
        mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
        /** Configures the popup. Used only if editing.mode is "popup". */
        popup?: dxPopupOptions;
        /** Overriden. */
        texts?: GridBaseEditingTexts;
        /** Specifies whether the editing column uses icons instead of links. */
        useIcons?: boolean;
    }
    /** Overriden. */
    export interface GridBaseEditingTexts {
        /** Specifies text for a hint that appears when a user pauses on the global "Add" button. Applies only if editing.allowAdding is true. */
        addRow?: string;
        /** Specifies text for a hint that appears when a user pauses on the "Discard" button. Applies only if editing.mode is "batch". */
        cancelAllChanges?: string;
        /** Specifies text for a button that cancels changes in a row. Applies only if editing.allowUpdating is true and editing.mode is "row". */
        cancelRowChanges?: string;
        /** Specifies a message that prompts a user to confirm deletion. */
        confirmDeleteMessage?: string;
        /** Specifies a title for the window that asks a user to confirm deletion. */
        confirmDeleteTitle?: string;
        /** Specifies text for buttons that delete rows. Applies only if allowDeleting is true. */
        deleteRow?: string;
        /** Specifies text for buttons that switch rows into the editing state. Applies only if allowUpdating is true. */
        editRow?: string;
        /** Specifies text for a hint that appears when a user pauses on the global "Save" button. Applies only if editing.mode is "batch". */
        saveAllChanges?: string;
        /** Specifies text for a button that saves changes made in a row. Applies only if allowUpdating is true. */
        saveRowChanges?: string;
        /** Specifies text for buttons that recover deleted rows. Applies only if allowDeleting is true and editing.mode is "batch". */
        undeleteRow?: string;
        /** Specifies text for a hint appearing when a user pauses on the button that cancels changes in a cell. Applies only if editing.mode is "cell" and data validation is enabled. */
        validationCancelChanges?: string;
    }
    /** Configures paging. */
    export interface GridBasePaging {
        /** Enables paging. */
        enabled?: boolean;
        /** Specifies the page to be displayed using a zero-based index. */
        pageIndex?: number;
        /** Specifies the page size. */
        pageSize?: number;
    }
    /** Overridden. A configuration object specifying scrolling options. */
    export interface GridBaseScrolling {
        /** Specifies the rendering mode for columns. Applies when columns are left outside the viewport. */
        columnRenderingMode?: 'standard' | 'virtual';
        /** Specifies whether the widget should load pages adjacent to the current page. Applies only if scrolling.mode is "virtual". */
        preloadEnabled?: boolean;
        /** Specifies the rendering mode for loaded rows. */
        rowRenderingMode?: 'standard' | 'virtual';
        /** Specifies whether a user can scroll the content with a swipe gesture. Applies only if useNative is false. */
        scrollByContent?: boolean;
        /** Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false. */
        scrollByThumb?: boolean;
        /** Specifies when to show scrollbars. Applies only if useNative is false. */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /** Specifies whether the widget should use native or simulated scrolling. */
        useNative?: boolean | 'auto';
    }
    /** Overridden. */
    export interface GridBaseSelection {
        /** Specifies whether a user can select all rows at once. */
        allowSelectAll?: boolean;
        /** Specifies the selection mode. */
        mode?: 'multiple' | 'none' | 'single';
    }
    export class GridBase extends Widget {
        constructor(element: Element, options?: GridBaseOptions)
        constructor(element: JQuery, options?: GridBaseOptions)
        /** Shows the load panel. */
        beginCustomLoading(messageText: string): void;
        /** Gets a data object with a specific key. */
        byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
        /** Discards changes that a user made to data. */
        cancelEditData(): void;
        /** Gets the value of a cell with a specific row index and a data field. */
        cellValue(rowIndex: number, dataField: string): any;
        /** Sets a new value to a cell with a specific row index and a data field. */
        cellValue(rowIndex: number, dataField: string, value: any): void;
        /** Gets the value of a cell with specific row and column indexes. */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;
        /** Sets a new value to a cell with specific row and column indexes. */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
        /** Clears all filters applied to widget rows. */
        clearFilter(): void;
        /** Clears all row filters of a specific type. */
        clearFilter(filterName: string): void;
        /** Clears selection of all rows on all pages. */
        clearSelection(): void;
        /** Clears sorting settings of all columns at once. */
        clearSorting(): void;
        /** Switches the cell being edited back to the normal state. Takes effect only if editing.mode is batch and showEditorAlways is false. */
        closeEditCell(): void;
        /** Collapses the currently expanded adaptive detail row (if there is one). */
        collapseAdaptiveDetailRow(): void;
        /** Gets the data column count. Includes visible and hidden columns, excludes command columns. */
        columnCount(): number;
        /** Gets all options of a column with a specific identifier. */
        columnOption(id: number | string): any;
        /** Gets the value of a single column option. */
        columnOption(id: number | string, optionName: string): any;
        /** Updates the value of a single column option. */
        columnOption(id: number | string, optionName: string, optionValue: any): void;
        /** Updates the values of several column options. */
        columnOption(id: number | string, options: any): void;
        /** Removes a column. */
        deleteColumn(id: number | string): void;
        /** Removes a row with a specific index. */
        deleteRow(rowIndex: number): void;
        /** Clears the selection of all rows on all pages or the currently rendered page only. */
        deselectAll(): Promise<void> & JQueryPromise<void>;
        /** Cancels the selection of rows with specific keys. */
        deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
        /** Switches a cell with a specific row index and a data field to the editing state. Takes effect only if the editing mode is 'batch' or 'cell'. */
        editCell(rowIndex: number, dataField: string): void;
        /** Switches a cell with specific row and column indexes to the editing state. Takes effect only if the editing mode is 'batch' or 'cell'. */
        editCell(rowIndex: number, visibleColumnIndex: number): void;
        /** Switches a row with a specific index to the editing state. Takes effect only if the editing mode is 'row', 'popup' or 'form'. */
        editRow(rowIndex: number): void;
        /** Hides the load panel. */
        endCustomLoading(): void;
        /** Expands an adaptive detail row. */
        expandAdaptiveDetailRow(key: any): void;
        /** Gets a filter expression applied to the widget's data source using the filter(filterExpr) method and the DataSource's filter option. */
        filter(): any;
        /** Applies a filter to the widget's data source. */
        filter(filterExpr: any): void;
        /** Sets focus on the widget. */
        focus(): void;
        /** Sets focus on a specific cell. */
        focus(element: Element | JQuery): void;
        /** Gets a cell with a specific row index and a data field. */
        getCellElement(rowIndex: number, dataField: string): DevExpress.core.dxElement & undefined;
        /** Gets a cell with specific row and column indexes. */
        getCellElement(rowIndex: number, visibleColumnIndex: number): DevExpress.core.dxElement & undefined;
        /** Gets the total filter that combines all the filters applied. */
        getCombinedFilter(): any;
        /** Gets the total filter that combines all the filters applied. */
        getCombinedFilter(returnDataField: boolean): any;
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets the key of a row with a specific index. */
        getKeyByRowIndex(rowIndex: number): any;
        /** Gets the container of a row with a specific index. */
        getRowElement(rowIndex: number): Array<Element> & JQuery & undefined;
        /** Gets the index of a row with a specific key. */
        getRowIndexByKey(key: any | string | number): number;
        /** Gets the instance of the widget's scrollable part. */
        getScrollable(): dxScrollable;
        /** Checks whether the widget has unsaved changes. */
        hasEditData(): boolean;
        /** Hides the column chooser. */
        hideColumnChooser(): void;
        /** Checks whether an adaptive detail row is expanded or collapsed. */
        isAdaptiveDetailRowExpanded(key: any): void;
        /** Checks whether a row with a specific key is selected. */
        isRowSelected(key: any): boolean;
        /** Gets a data object's key. */
        keyOf(obj: any): any;
        /** Gets the total page count. */
        pageCount(): number;
        /** Gets the current page index. */
        pageIndex(): number;
        /** Switches the widget to a specific page using a zero-based index. */
        pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
        /** Gets the current page size. */
        pageSize(): number;
        /** Sets the page size. */
        pageSize(value: number): void;
        /** Reloads data in the widget. */
        refresh(): Promise<void> & JQueryPromise<void>;
        /** Repaints specific rows. */
        repaintRows(rowIndexes: Array<number>): void;
        /** Saves changes that a user made to data. */
        saveEditData(): Promise<void> & JQueryPromise<void>;
        /** Seeks a search string in the columns whose allowSearch option is true. */
        searchByText(text: string): void;
        /** Selects all rows. */
        selectAll(): Promise<void> & JQueryPromise<void>;
        /** Selects rows with specific keys. */
        selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
        /** Selects rows with specific indexes. */
        selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
        /** Shows the column chooser. */
        showColumnChooser(): void;
        /** Gets the current widget state. */
        state(): any;
        /** Sets the widget state. */
        state(state: any): void;
        /** Recovers a row deleted in batch editing mode. */
        undeleteRow(rowIndex: number): void;
        /** Updates the widget's content after resizing. */
        updateDimensions(): void;
    }
    export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;
        /** Specifies a function that customizes grid columns after they are created. */
        customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
        /** Customizes data before exporting. */
        customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
        /** Configures editing. */
        editing?: dxDataGridEditing;
        /** Configures client-side exporting. */
        export?: { enabled?: boolean, fileName?: string, excelFilterEnabled?: boolean, excelWrapTextEnabled?: boolean, proxyUrl?: string, allowExportSelectedData?: boolean, ignoreExcelErrors?: boolean, texts?: { exportTo?: string, exportAll?: string, exportSelectedRows?: string } };
        /** Configures grouping. */
        grouping?: { autoExpandAll?: boolean, allowCollapsing?: boolean, contextMenuEnabled?: boolean, expandMode?: 'buttonClick' | 'rowClick', texts?: { groupContinuesMessage?: string, groupContinuedMessage?: string, groupByThisColumn?: string, ungroup?: string, ungroupAll?: string } };
        /** Configures the group panel. */
        groupPanel?: { visible?: boolean | 'auto', emptyPanelText?: string, allowColumnDragging?: boolean };
        /** Specifies which data field provides keys for data items. Applies only if data is a simple array. */
        keyExpr?: string | Array<string>;
        /** Allows you to build a master-detail interface in the grid. */
        masterDetail?: { enabled?: boolean, autoExpandAll?: boolean, template?: template | ((detailElement: DevExpress.core.dxElement, detailInfo: { key?: any, data?: any }) => any) };
        /** A function that is executed when a user clicks a cell. */
        onCellClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any) | string;
        /** A function that is executed after the pointer enters or leaves a cell. */
        onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxDataGridRowObject }) => any);
        /** A function that is executed after the widget creates a cell. */
        onCellPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => any);
        /** A function that is executed before a context menu is rendered. */
        onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
        /** A function that is executed before a cell or row switches to the editing state. */
        onEditingStart?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /** A function that is executed after an editor is created. */
        onEditorPrepared?: ((options: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
        /** A function that is executed before an editor is created. */
        onEditorPreparing?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
        /** A function that is executed after data is exported. */
        onExported?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A function that is executed before data is exported. */
        onExporting?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /** A function that is executed before a file with exported data is saved to the user's local storage. */
        onFileSaving?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** A function that is executed when a user clicks a row. */
        onRowClick?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, groupIndex?: number, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => any) | string;
        /** A function that is executed after the widget creates a row. */
        onRowPrepared?: ((e: { component?: dxDataGrid, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /** Notifies the DataGrid of the server's data processing operations. */
        remoteOperations?: boolean | { sorting?: boolean, filtering?: boolean, paging?: boolean, grouping?: boolean, groupPaging?: boolean, summary?: boolean } | 'auto';
        /** Specifies a custom template for rows. */
        rowTemplate?: template | ((rowElement: DevExpress.core.dxElement, rowInfo: any) => any);
        /** Configures scrolling. */
        scrolling?: dxDataGridScrolling;
        /** Configures runtime selection. */
        selection?: dxDataGridSelection;
        /** Specifies filters for the rows that must be selected initially. Applies only if selection.deferred is true. */
        selectionFilter?: string | Array<any> | Function;
        /** Allows you to sort groups according to the values of group summary items. */
        sortByGroupSummaryInfo?: Array<{ summaryItem?: string | number, groupColumn?: string, sortOrder?: 'asc' | 'desc' }>;
        /** Specifies the options of the grid summary. */
        summary?: { groupItems?: Array<{ name?: string, column?: string, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum', valueFormat?: format, displayFormat?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), showInGroupFooter?: boolean, alignByColumn?: boolean, showInColumn?: string, skipEmptyValues?: boolean }>, totalItems?: Array<{ name?: string, column?: string, showInColumn?: string, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum', valueFormat?: format, displayFormat?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), alignment?: 'center' | 'left' | 'right', cssClass?: string, skipEmptyValues?: boolean }>, calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any }) => any), skipEmptyValues?: boolean, texts?: { sum?: string, sumOtherColumn?: string, min?: string, minOtherColumn?: string, max?: string, maxOtherColumn?: string, avg?: string, avgOtherColumn?: string, count?: string } };
    }
    /** Configures editing. */
    export interface dxDataGridEditing extends GridBaseEditing {
        /** Contains options that specify texts for editing-related UI elements. */
        texts?: any;
    }
    /** Configures scrolling. */
    export interface dxDataGridScrolling extends GridBaseScrolling {
        /** Specifies the scrolling mode. */
        mode?: 'infinite' | 'standard' | 'virtual';
    }
    /** Configures runtime selection. */
    export interface dxDataGridSelection extends GridBaseSelection {
        /** Makes selection deferred. */
        deferred?: boolean;
        /** Specifies the mode in which all the records are selected. Applies only if selection.allowSelectAll is true. */
        selectAllMode?: 'allPages' | 'page';
        /** Specifies when to display check boxes in rows. Applies only if selection.mode is "multiple". */
        showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
    }
    /** The DataGrid is a widget that represents data from a local or remote source in the form of a grid. This widget offers such basic features as sorting, grouping, filtering, as well as more advanced capabilities, like state storing, export to Excel, master-detail interface, and many others. */
    export class dxDataGrid extends GridBase {
        constructor(element: Element, options?: dxDataGridOptions)
        constructor(element: JQuery, options?: dxDataGridOptions)
        /** Adds a new column. */
        addColumn(columnOptions: any | string): void;
        /** Adds an empty data row. */
        addRow(): void;
        /** Ungroups grid records. */
        clearGrouping(): void;
        /** Collapses master rows or groups of a specific level. */
        collapseAll(groupIndex?: number): void;
        /** Collapses a group or a master row with a specific key. */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /** Expands master rows or groups of a specific level. */
        expandAll(groupIndex?: number): void;
        /** Expands a group or a master row with a specific key. */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /** Exports grid data to Excel. */
        exportToExcel(selectionOnly: boolean): void;
        /** Gets the currently selected rows' keys. */
        getSelectedRowKeys(): Array<any> & Promise<any> & JQueryPromise<any>;
        /** Gets data objects of currently selected rows. */
        getSelectedRowsData(): Array<any> & Promise<any> & JQueryPromise<any>;
        /** Gets the value of a total summary item. */
        getTotalSummaryValue(summaryItemName: string): any;
        /** Gets all visible columns. */
        getVisibleColumns(): Array<dxDataGridColumn>;
        /** Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns. */
        getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
        /** Gets currently rendered rows. */
        getVisibleRows(): Array<dxDataGridRowObject>;
        /** @deprecated Use addRow instead. */
        insertRow(): void;
        /** Checks whether a specific group or master row is expanded or collapsed. */
        isRowExpanded(key: any): boolean;
        /** Checks whether a row found using its data object is selected. Takes effect only if selection.deferred is true. */
        isRowSelected(data: any): boolean;
        /** Checks whether a row with a specific key is selected. */
        isRowSelected(key: any): boolean;
        /** @deprecated Use deleteRow instead. */
        removeRow(rowIndex: number): void;
        /** Gets the total row count. */
        totalCount(): number;
    }
    export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
        /** Specifies whether or not adaptive widget rendering is enabled on a small screen. */
        adaptivityEnabled?: boolean;
        /** The text displayed on the Apply button. */
        applyButtonText?: string;
        /** Configures the calendar's value picker. Applies only if the pickerType is "calendar". */
        calendarOptions?: dxCalendarOptions;
        /** The text displayed on the Cancel button. */
        cancelButtonText?: string;
        /** Specifies the message displayed if the specified date is later than the max value or earlier than the min value. */
        dateOutOfRangeMessage?: string;
        /** Specifies the date-time value serialization format. Use it only if you do not specify the value at design time. */
        dateSerializationFormat?: string;
        /** Specifies dates to be disabled. Applies only if pickerType is "calendar". */
        disabledDates?: Array<Date> | ((data: { component?: dxDateBox, date?: Date, view?: string }) => boolean);
        /** Specifies the date display format. Ignored if the pickerType option is 'native' */
        displayFormat?: format;
        /** Specifies the interval between neighboring values in the popup list in minutes. */
        interval?: number;
        /** Specifies the message displayed if the typed value is not a valid date or time. */
        invalidDateMessage?: string;
        /** The last date that can be selected within the widget. */
        max?: Date | number | string;
        /** @deprecated Use the calendarOptions option instead. */
        maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** The minimum date that can be selected within the widget. */
        min?: Date | number | string;
        /** @deprecated Use the calendarOptions option instead. */
        minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
        /** Specifies the type of the date/time picker. */
        pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
        /** Specifies a placeholder for the input field. */
        placeholder?: string;
        /** Specifies whether to show the analog clock in the value picker. Applies only if type is "datetime" and pickerType is "calendar". */
        showAnalogClock?: boolean;
        /** A format used to display date/time information. */
        type?: 'date' | 'datetime' | 'time';
        /** An object or a value specifying the date and time currently selected using the date box. */
        value?: Date | number | string;
    }
    /** The DateBox is a widget that displays date and time in a specified format, and enables a user to pick or type in the required date/time value. */
    export class dxDateBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDateBoxOptions)
        constructor(element: JQuery, options?: dxDateBoxOptions)
        /** Closes the drop-down editor. */
        close(): void;
        /** Opens the drop-down editor. */
        open(): void;
    }
    export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
        /** Specifies the animation to be used to show the rendered content. */
        animation?: animationConfig;
        /** Specifies a callback function that is called when the widget's content has finished rendering but is not yet shown. */
        onRendered?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies a callback function that is called when widget content is shown and animation has completed. */
        onShown?: ((e: { component?: dxDeferRendering, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies when the widget content is rendered. */
        renderWhen?: Promise<void> | JQueryPromise<void> | boolean;
        /** Indicates if a load indicator should be shown until the widget's content is rendered. */
        showLoadIndicator?: boolean;
        /** Specifies a jQuery selector of items that should be rendered using a staggered animation. */
        staggerItemSelector?: string;
    }
    /** The DeferRendering is a widget that waits for its content to be ready before rendering it. While the content is getting ready, the DeferRendering displays a loading indicator. */
    export class dxDeferRendering extends Widget {
        constructor(element: Element, options?: dxDeferRenderingOptions)
        constructor(element: JQuery, options?: dxDeferRenderingOptions)
    }
    export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
        /** Specifies whether the widget allows a user to enter a custom value. */
        acceptCustomValue?: boolean;
        /** Specifies a custom template for the drop-down content. */
        contentTemplate?: template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Configures the drop-down field which holds the content. */
        dropDownOptions?: dxPopupOptions;
        /** Specifies a custom template for the text field. Must contain the TextBox widget. */
        fieldTemplate?: template | ((value: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies after which DOM events the widget updates the value. */
        valueChangeEvent?: string;
    }
    /** The DropDownBox widget consists of a text field, which displays the current value, and a drop-down field, which can contain any UI element. */
    export class dxDropDownBox extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownBoxOptions)
        constructor(element: JQuery, options?: dxDropDownBoxOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    export interface dxDropDownMenuOptions extends WidgetOptions<dxDropDownMenu> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** The name of the icon to be displayed by the DropDownMenu button. */
        buttonIcon?: string;
        /** The text displayed in the DropDownMenu button. */
        buttonText?: string;
        /** A data source used to fetch data to be displayed by the widget. */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** An array of items displayed by the widget. */
        items?: Array<any>;
        /** Specifies a custom template for items. */
        itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** A handler for the buttonClick event. */
        onButtonClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** A handler for the itemClick event. */
        onItemClick?: ((e: { component?: dxDropDownMenu, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any) | string;
        /** Specifies whether or not the drop-down menu is displayed. */
        opened?: boolean;
        /** Specifies the popup element's height in pixels. */
        popupHeight?: number | string | Function;
        /** Specifies the popup element's width in pixels. */
        popupWidth?: number | string | Function;
        /** Specifies whether or not to show the drop down menu within a Popover widget. */
        usePopover?: boolean;
    }
    /** A drop-down menu widget. */
    export class dxDropDownMenu extends Widget {
        constructor(element: Element, options?: dxDropDownMenuOptions)
        constructor(element: JQuery, options?: dxDropDownMenuOptions)
        /** Closes the drop-down menu. */
        close(): void;
        /** Opens the drop-down menu. */
        open(): void;
    }
    export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
        /** Specifies a file type or several types accepted by the widget. */
        accept?: string;
        /** Specifies if an end user can remove a file from the selection and interrupt uploading. */
        allowCanceling?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies the text displayed on the area to which an end-user can drop a file. */
        labelText?: string;
        /** Specifies whether the widget enables an end-user to select a single file or multiple files. */
        multiple?: boolean;
        /** Specifies the value passed to the name attribute of the underlying input element. */
        name?: string;
        /** A handler for the uploaded event. */
        onProgress?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** A handler for the uploadAborted event. */
        onUploadAborted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: any, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** A handler for the uploaded event. */
        onUploaded?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** A handler for the uploadError event. */
        onUploadError?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** A handler for the uploadStarted event. */
        onUploadStarted?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: dxFileUploader, element?: DevExpress.core.dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** Gets the current progress in percentages. */
        progress?: number;
        /** The message displayed by the widget when it is ready to upload the specified files. */
        readyToUploadMessage?: string;
        /** The text displayed on the button that opens the file browser. */
        selectButtonText?: string;
        /** Specifies whether or not the widget displays the list of selected files. */
        showFileList?: boolean;
        /** The text displayed on the button that starts uploading. */
        uploadButtonText?: string;
        /** The message displayed by the widget when uploading is finished. */
        uploadedMessage?: string;
        /** The message displayed by the widget on uploading failure. */
        uploadFailedMessage?: string;
        /** Specifies headers for the upload request. */
        uploadHeaders?: any;
        /** Specifies the method for the upload request. */
        uploadMethod?: 'POST' | 'PUT';
        /** Specifies how the widget uploads files. */
        uploadMode?: 'instantly' | 'useButtons' | 'useForm';
        /** Specifies a target Url for the upload request. */
        uploadUrl?: string;
        /** Specifies a File instance representing the selected file. Read-only when uploadMode is "useForm". */
        value?: Array<File>;
    }
    /** The FileUploader widget enables an end user to upload files to the server. An end user can select files in the file explorer or drag and drop files to the FileUploader area on the page. */
    export class dxFileUploader extends Editor {
        constructor(element: Element, options?: dxFileUploaderOptions)
        constructor(element: JQuery, options?: dxFileUploaderOptions)
    }
    export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
        /** Specifies whether the widget can display hierarchical data fields. */
        allowHierarchicalFields?: boolean;
        /** Configures custom filter operations. */
        customOperations?: Array<dxFilterBuilderCustomOperation>;
        /** Configures fields. */
        fields?: Array<dxFilterBuilderField>;
        /** Specifies filter operation descriptions. */
        filterOperationDescriptions?: { between?: string, equal?: string, notEqual?: string, lessThan?: string, lessThanOrEqual?: string, greaterThan?: string, greaterThanOrEqual?: string, startsWith?: string, contains?: string, notContains?: string, endsWith?: string, isBlank?: string, isNotBlank?: string };
        /** Specifies group operation descriptions. */
        groupOperationDescriptions?: { and?: string, or?: string, notAnd?: string, notOr?: string };
        /** Specifies a set of available group operations. */
        groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
        /** Specifies groups' maximum nesting level. */
        maxGroupLevel?: number;
        /** A handler for the editorPrepared event. Executed after an editor is created. */
        onEditorPrepared?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, editorElement?: DevExpress.core.dxElement, editorName?: string, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /** A handler for the editorPreparing event. Executed before an editor is created. */
        onEditorPreparing?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, setValue?: any, cancel?: boolean, editorElement?: DevExpress.core.dxElement, editorName?: string, editorOptions?: any, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
        /** A handler for the valueChanged event. Executed after the widget's value is changed. */
        onValueChanged?: ((e: { component?: dxFilterBuilder, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any }) => any);
        /** Allows you to specify a filter. */
        value?: string | Array<any> | Function;
    }
    /** The FilterBuilder widget allows a user to build complex filter expressions with an unlimited number of filter conditions, combined by logical operations using the UI. */
    export class dxFilterBuilder extends Widget {
        constructor(element: Element, options?: dxFilterBuilderOptions)
        constructor(element: JQuery, options?: dxFilterBuilderOptions)
        /** Gets a filter expression that contains only operations supported by the DataSource. */
        getFilterExpression(): string | Array<any> | Function;
    }
    export interface dxFormOptions extends WidgetOptions<dxForm> {
        /** Specifies whether or not all root item labels are aligned. */
        alignItemLabels?: boolean;
        /** Specifies whether or not item labels in all groups are aligned. */
        alignItemLabelsInAllGroups?: boolean;
        /** The count of columns in the form layout. */
        colCount?: number | 'auto';
        /** Specifies dependency between the screen factor and the count of columns in the form layout. */
        colCountByScreen?: any;
        /** Specifies a function that customizes a form item after it has been created. */
        customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => any);
        /** Provides the Form's data. Gets updated every time form fields change. */
        formData?: any;
        /** Holds an array of form items. */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /** Specifies the location of a label against the editor. */
        labelLocation?: 'left' | 'right' | 'top';
        /** The minimum column width used for calculating column count in the form layout. */
        minColWidth?: number;
        /** A handler for the editorEnterKey event. */
        onEditorEnterKey?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string }) => any);
        /** A handler for the fieldDataChanged event. */
        onFieldDataChanged?: ((e: { component?: dxForm, element?: DevExpress.core.dxElement, model?: any, dataField?: string, value?: any }) => any);
        /** The text displayed for optional fields. */
        optionalMark?: string;
        /** Specifies whether all editors on the form are read-only. Applies only to non-templated items. */
        readOnly?: boolean;
        /** The text displayed for required fields. */
        requiredMark?: string;
        /** Specifies the message that is shown for end-users if a required field value is not specified. */
        requiredMessage?: string;
        /** Specifies the function returning the screen factor depending on the screen width. */
        screenByWidth?: Function;
        /** A Boolean value specifying whether to enable or disable form scrolling. */
        scrollingEnabled?: boolean;
        /** Specifies whether or not a colon is displayed at the end of form labels. */
        showColonAfterLabel?: boolean;
        /** Specifies whether or not the optional mark is displayed for optional fields. */
        showOptionalMark?: boolean;
        /** Specifies whether or not the required mark is displayed for required fields. */
        showRequiredMark?: boolean;
        /** Specifies whether or not the total validation summary is displayed on the form. */
        showValidationSummary?: boolean;
        /** Gives a name to the internal validation group. */
        validationGroup?: string;
    }
    /** The Form widget represents fields of a data object as a collection of label-editor pairs. These pairs can be arranged in several groups, tabs and columns. */
    export class dxForm extends Widget {
        constructor(element: Element, options?: dxFormOptions)
        constructor(element: JQuery, options?: dxFormOptions)
        /** Gets an editor instance. Takes effect only if the form item is visible. */
        getEditor(dataField: string): any;
        /** Gets a form item's configuration. */
        itemOption(id: string): any;
        /** Updates the value of a single item option. */
        itemOption(id: string, option: string, value: any): void;
        /** Updates the values of several item options. */
        itemOption(id: string, options: any): void;
        /** Resets the editor's value to undefined. */
        resetValues(): void;
        /** Updates formData fields and the corresponding editors. */
        updateData(data: any): void;
        /** Updates a formData field and the corresponding editor. */
        updateData(dataField: string, value: any): void;
        /** Updates the dimensions of the widget contents. */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
        /** Validates the values of all editors on the form against the list of the validation rules specified for each form item. */
        validate(): dxValidationGroupResult;
    }
    export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
        /** The time, in milliseconds, spent on slide animation. */
        animationDuration?: number;
        /** Specifies whether or not to animate the displayed item change. */
        animationEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** A Boolean value specifying whether or not to allow users to switch between items by clicking an indicator. */
        indicatorEnabled?: boolean;
        /** Specifies the width of an area used to display a single image. */
        initialItemWidth?: number;
        /** A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped. */
        loop?: boolean;
        /** The index of the currently active gallery item. */
        selectedIndex?: number;
        /** A Boolean value specifying whether or not to display an indicator that points to the selected gallery item. */
        showIndicator?: boolean;
        /** A Boolean value that specifies the availability of the "Forward" and "Back" navigation buttons. */
        showNavButtons?: boolean;
        /** The time interval in milliseconds, after which the gallery switches to the next item. */
        slideshowDelay?: number;
        /** Specifies if the widget stretches images to fit the total gallery width. */
        stretchImages?: boolean;
        /** A Boolean value specifying whether or not to allow users to switch between items by swiping. */
        swipeEnabled?: boolean;
        /** Specifies whether or not to display parts of previous and next images along the sides of the current image. */
        wrapAround?: boolean;
    }
    /** The Gallery is a widget that displays a collection of images in a carousel. The widget is supplied with various navigation controls that allow a user to switch between images. */
    export class dxGallery extends CollectionWidget {
        constructor(element: Element, options?: dxGalleryOptions)
        constructor(element: JQuery, options?: dxGalleryOptions)
        /** Shows a specific image. */
        goToItem(itemIndex: number, animation: boolean): Promise<void> & JQueryPromise<void>;
        /** Shows the next image. */
        nextItem(animation: boolean): Promise<void> & JQueryPromise<void>;
        /** Shows the previous image. */
        prevItem(animation: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** This section lists the data source fields that are used in a default template for gallery items. */
    export interface dxGalleryItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the text passed to the alt attribute of the image markup element. */
        imageAlt?: string;
        /** Specifies the URL of the image displayed by the item. */
        imageSrc?: string;
    }
    export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether or not an end user can delete list items. */
        allowItemDeleting?: boolean;
        /** Specifies whether a user can reorder list items. Grouped items cannot be moved from one group to another. */
        allowItemReordering?: boolean;
        /** A Boolean value specifying whether to enable or disable the bounce-back effect. */
        bounceEnabled?: boolean;
        /** Specifies whether or not an end-user can collapse groups. */
        collapsibleGroups?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether data items should be grouped. */
        grouped?: boolean;
        /** Specifies a custom template for group captions. */
        groupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies whether or not to show the loading panel when the DataSource bound to the widget is loading data. */
        indicateLoading?: boolean;
        /** Specifies the way a user can delete items from the list. */
        itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
        /** Specifies the array of items for a context menu called for a list item. */
        menuItems?: Array<{ text?: string, action?: ((itemElement: DevExpress.core.dxElement, itemData: any) => any) }>;
        /** Specifies whether an item context menu is shown when a user holds or swipes an item. */
        menuMode?: 'context' | 'slide';
        /** The text displayed on the button used to load the next page from the data source. */
        nextButtonText?: string;
        /** A handler for the groupRendered event. */
        onGroupRendered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, groupData?: any, groupElement?: DevExpress.core.dxElement, groupIndex?: number }) => any);
        /** A handler for the itemClick event. */
        onItemClick?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any }) => any) | string;
        /** A handler for the itemContextMenu event. */
        onItemContextMenu?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemIndex?: number | any }) => any);
        /** A handler for the itemDeleted event. */
        onItemDeleted?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any }) => any);
        /** A handler for the itemDeleting event. Executed before an item is deleted from the data source. */
        onItemDeleting?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
        /** A handler for the itemHold event. */
        onItemHold?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemIndex?: number | any }) => any);
        /** A handler for the itemReordered event. */
        onItemReordered?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, fromIndex?: number, toIndex?: number }) => any);
        /** A handler for the itemSwipe event. */
        onItemSwipe?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number | any, direction?: string }) => any);
        /** A handler for the pageLoading event. */
        onPageLoading?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the pullRefresh event. */
        onPullRefresh?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the scroll event. */
        onScroll?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** A handler for the selectAllValueChanged event. */
        onSelectAllValueChanged?: ((e: { component?: dxList, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** Specifies the text shown in the pullDown panel, which is displayed when the list is scrolled to the bottom. */
        pageLoadingText?: string;
        /** Specifies whether the next page is loaded when a user scrolls the widget to the bottom or when the "next" button is clicked. */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /** Specifies the text displayed in the pullDown panel when the list is pulled below the refresh threshold. */
        pulledDownText?: string;
        /** Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold. */
        pullingDownText?: string;
        /** A Boolean value specifying whether or not the widget supports the "pull down to refresh" gesture. */
        pullRefreshEnabled?: boolean;
        /** Specifies the text displayed in the pullDown panel while the list is being refreshed. */
        refreshingText?: string;
        /** A Boolean value specifying if the list is scrolled by content. */
        scrollByContent?: boolean;
        /** A Boolean value specifying if the list is scrolled using the scrollbar. */
        scrollByThumb?: boolean;
        /** A Boolean value specifying whether to enable or disable list scrolling. */
        scrollingEnabled?: boolean;
        /** Specifies the mode in which all items are selected. */
        selectAllMode?: 'allPages' | 'page';
        /** Specifies item selection mode. */
        selectionMode?: 'all' | 'multiple' | 'none' | 'single';
        /** Specifies when the widget shows the scrollbar. */
        showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
        /** Specifies whether or not to display controls used to select list items. */
        showSelectionControls?: boolean;
        /** Specifies whether or not the widget uses native scrolling. */
        useNativeScrolling?: boolean;
    }
    /** The List is a widget that represents a collection of items in a scrollable list. */
    export class dxList extends CollectionWidget {
        constructor(element: Element, options?: dxListOptions)
        constructor(element: JQuery, options?: dxListOptions)
        /** Gets the widget's height in pixels. */
        clientHeight(): number;
        /** Collapses a group with a specific index. */
        collapseGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /** Removes an item found using its DOM node. */
        deleteItem(itemElement: Element): Promise<void> & JQueryPromise<void>;
        /** Removes an item with a specific index. */
        deleteItem(itemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /** Expands a group with a specific index. */
        expandGroup(groupIndex: number): Promise<void> & JQueryPromise<void>;
        /** Checks whether an item found using its DOM node is selected. */
        isItemSelected(itemElement: Element): boolean;
        /** Checks whether an item with a specific index is selected. */
        isItemSelected(itemIndex: number | any): boolean;
        /** Reloads list data. */
        reload(): void;
        /** Reorders items found using their DOM nodes. */
        reorderItem(itemElement: Element, toItemElement: Element): Promise<void> & JQueryPromise<void>;
        /** Reorders items with specific indexes. */
        reorderItem(itemIndex: number | any, toItemIndex: number | any): Promise<void> & JQueryPromise<void>;
        /** Scrolls the content by a specified distance. */
        scrollBy(distance: number): void;
        /** Gets the content's height in pixels. */
        scrollHeight(): number;
        /** Scrolls the content to a specific position. */
        scrollTo(location: number): void;
        /** Scrolls the content to an item found using its DOM node. */
        scrollToItem(itemElement: Element): void;
        /** Scrolls the content to an item with a specific index. */
        scrollToItem(itemIndex: number | any): void;
        /** Gets the top scroll offset. */
        scrollTop(): number;
        /** Selects all items. */
        selectAll(): void;
        /** Selects an item found using its DOM node. */
        selectItem(itemElement: Element): void;
        /** Selects an item with a specific index. */
        selectItem(itemIndex: number | any): void;
        /** Cancels the selection of all items. */
        unselectAll(): void;
        /** Cancels the selection of an item found using its DOM node. */
        unselectItem(itemElement: Element): void;
        /** Cancels the selection of an item with a specific index. */
        unselectItem(itemIndex: number | any): void;
        /** Updates the widget scrollbar according to widget content size. */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    export interface dxLoadIndicatorOptions extends WidgetOptions<dxLoadIndicator> {
        /** Specifies the path to an image used as the indicator. */
        indicatorSrc?: string;
    }
    /** The LoadIndicator is a UI element notifying the viewer that a process is in progress. */
    export class dxLoadIndicator extends Widget {
        constructor(element: Element, options?: dxLoadIndicatorOptions)
        constructor(element: JQuery, options?: dxLoadIndicatorOptions)
    }
    export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: dxLoadPanelAnimation;
        /** Specifies the widget's container. */
        container?: string | Element | JQuery;
        /** The delay in milliseconds after which the load panel is displayed. */
        delay?: number;
        /** Specifies whether or not the widget can be focused. */
        focusStateEnabled?: boolean;
        /** Specifies the widget's height in pixels. */
        height?: number | string | (() => number | string);
        /** A URL pointing to an image to be used as a load indicator. */
        indicatorSrc?: string;
        /** Specifies the maximum height the widget can reach while resizing. */
        maxHeight?: number | string | (() => number | string);
        /** Specifies the maximum width the widget can reach while resizing. */
        maxWidth?: number | string | (() => number | string);
        /** The text displayed in the load panel. */
        message?: string;
        /** Positions the widget. */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /** Specifies the shading color. */
        shadingColor?: string;
        /** A Boolean value specifying whether or not to show a load indicator. */
        showIndicator?: boolean;
        /** A Boolean value specifying whether or not to show the pane behind the load indicator. */
        showPane?: boolean;
        /** Specifies the widget's width in pixels. */
        width?: number | string | (() => number | string);
    }
    /** Configures widget visibility animations. This object contains two fields: show and hide. */
    export interface dxLoadPanelAnimation extends dxOverlayAnimation {
        /** An object that defines the animation options used when the widget is being hidden. */
        hide?: animationConfig;
        /** An object that defines the animation options used when the widget is being shown. */
        show?: animationConfig;
    }
    /** The LoadPanel is an overlay widget notifying the viewer that loading is in progress. */
    export class dxLoadPanel extends dxOverlay {
        constructor(element: Element, options?: dxLoadPanelOptions)
        constructor(element: JQuery, options?: dxLoadPanelOptions)
    }
    export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: { show?: animationConfig, hide?: animationConfig };
        /** The text displayed on the Apply button. */
        applyButtonText?: string;
        /** Specifies the way an end-user applies the selected value. */
        applyValueMode?: 'instantly' | 'useButtons';
        /** The text displayed on the Cancel button. */
        cancelButtonText?: string;
        /** Specifies whether or not the widget cleans the search box when the popup window is displayed. */
        cleanSearchOnOpening?: boolean;
        /** The text displayed on the Clear button. */
        clearButtonText?: string;
        /** Specifies whether to close the drop-down menu if a user clicks outside it. */
        closeOnOutsideClick?: boolean | (() => boolean);
        /** Specifies a custom template for the input field. */
        fieldTemplate?: template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** A Boolean value specifying whether or not to display the lookup in full-screen mode. */
        fullScreen?: boolean;
        /** A Boolean value specifying whether or not to group widget items. */
        grouped?: boolean;
        /** Specifies a custom template for group captions. */
        groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** The text displayed on the button used to load the next page from the data source. */
        nextButtonText?: string;
        /** A handler for the pageLoading event. */
        onPageLoading?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the pullRefresh event. */
        onPullRefresh?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the scroll event. */
        onScroll?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** A handler for the titleRendered event. */
        onTitleRendered?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: dxLookup, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** Specifies the text shown in the pullDown panel, which is displayed when the widget is scrolled to the bottom. */
        pageLoadingText?: string;
        /** Specifies whether the next page is loaded when a user scrolls the widget to the bottom or when the "next" button is clicked. */
        pageLoadMode?: 'nextButton' | 'scrollBottom';
        /** The text displayed by the widget when nothing is selected. */
        placeholder?: string;
        /** Specifies the popup element's height. Applies only if fullScreen is false. */
        popupHeight?: number | string | (() => number | string);
        /** Specifies the popup element's width. Applies only if fullScreen is false. */
        popupWidth?: number | string | (() => number | string);
        /** An object defining widget positioning options. */
        position?: positionConfig;
        /** Specifies the text displayed in the pullDown panel when the widget is pulled below the refresh threshold. */
        pulledDownText?: string;
        /** Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold. */
        pullingDownText?: string;
        /** A Boolean value specifying whether or not the widget supports the "pull down to refresh" gesture. */
        pullRefreshEnabled?: boolean;
        /** Specifies the text displayed in the pullDown panel while the widget is being refreshed. */
        refreshingText?: string;
        /** Specifies whether the search box is visible. */
        searchEnabled?: boolean;
        /** The text that is provided as a hint in the lookup's search bar. */
        searchPlaceholder?: string;
        /** A Boolean value specifying whether or not the main screen is inactive while the lookup is active. */
        shading?: boolean;
        /** Specifies whether to display the Cancel button in the lookup window. */
        showCancelButton?: boolean;
        /** Specifies whether or not to display the Clear button in the lookup window. */
        showClearButton?: boolean;
        /** A Boolean value specifying whether or not to display the title in the popup window. */
        showPopupTitle?: boolean;
        /** The title of the lookup window. */
        title?: string;
        /** Specifies a custom template for the title. */
        titleTemplate?: template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether or not the widget uses native scrolling. */
        useNativeScrolling?: boolean;
        /** Specifies whether or not to show lookup contents in a Popover widget. */
        usePopover?: boolean;
    }
    /** The Lookup is a widget that allows an end user to search for an item in a collection shown in a drop-down menu. */
    export class dxLookup extends dxDropDownList {
        constructor(element: Element, options?: dxLookupOptions)
        constructor(element: JQuery, options?: dxLookupOptions)
    }
    export interface dxMapOptions extends WidgetOptions<dxMap> {
        /** Specifies whether the widget automatically adjusts center and zoom option values when adding a new marker or route, or if a new widget contains markers or routes by default. */
        autoAdjust?: boolean;
        /** An object, a string, or an array specifying which part of the map is displayed at the widget's center using coordinates. The widget can change this value if autoAdjust is enabled. */
        center?: any | string | Array<number>;
        /** Specifies whether or not map widget controls are available. */
        controls?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** A key used to authenticate the application within the required map provider. */
        key?: string | { bing?: string, google?: string, googleStatic?: string };
        /** A URL pointing to the custom icon to be used for map markers. */
        markerIconSrc?: string;
        /** An array of markers displayed on a map. */
        markers?: Array<{ location?: any | string | Array<number>, tooltip?: string | { text?: string, isShown?: boolean }, onClick?: Function, iconSrc?: string }>;
        /** A handler for the click event. */
        onClick?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, location?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** A handler for the markerAdded event. */
        onMarkerAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalMarker?: any }) => any);
        /** A handler for the markerRemoved event. */
        onMarkerRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /** A handler for the ready event. */
        onReady?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, originalMap?: any }) => any);
        /** A handler for the routeAdded event. */
        onRouteAdded?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any, originalRoute?: any }) => any);
        /** A handler for the routeRemoved event. */
        onRouteRemoved?: ((e: { component?: dxMap, element?: DevExpress.core.dxElement, model?: any, options?: any }) => any);
        /** The name of the current map data provider. */
        provider?: 'bing' | 'google' | 'googleStatic';
        /** An array of routes shown on the map. */
        routes?: Array<{ locations?: Array<any>, mode?: 'driving' | 'walking', color?: string, weight?: number, opacity?: number }>;
        /** The type of a map to display. */
        type?: 'hybrid' | 'roadmap' | 'satellite';
        /** Specifies the widget's width. */
        width?: number | string | (() => number | string);
        /** The map's zoom level. The widget can change this value if autoAdjust is enabled. */
        zoom?: number;
    }
    /** The Map is an interactive widget that displays a geographic map with markers and routes. */
    export class dxMap extends Widget {
        constructor(element: Element, options?: dxMapOptions)
        constructor(element: JQuery, options?: dxMapOptions)
        /** Adds a marker to the map. */
        addMarker(markerOptions: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /** Adds a route to the map. */
        addRoute(options: any | Array<any>): Promise<any> & JQueryPromise<any>;
        /** Removes a marker from the map. */
        removeMarker(marker: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
        /** Removes a route from the map. */
        removeRoute(route: any | number | Array<any>): Promise<void> & JQueryPromise<void>;
    }
    export interface MapLocation {
        /** The latitude location of the widget. */
        lat?: number;
        /** The longitude location of the widget. */
        lng?: number;
    }
    export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
        /** Specifies whether adaptive widget rendering is enabled on small screens. Applies only if the orientation is "horizontal". */
        adaptivityEnabled?: boolean;
        /** Specifies whether or not the submenu is hidden when the mouse pointer leaves it. */
        hideSubmenuOnMouseLeave?: boolean;
        /** Holds an array of menu items. */
        items?: Array<dxMenuItemTemplate>;
        /** A handler for the submenuHidden event. */
        onSubmenuHidden?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** A handler for the submenuHiding event. */
        onSubmenuHiding?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement, cancel?: boolean }) => any);
        /** A handler for the submenuShowing event. */
        onSubmenuShowing?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** A handler for the submenuShown event. */
        onSubmenuShown?: ((e: { component?: dxMenu, element?: DevExpress.core.dxElement, model?: any, rootItem?: DevExpress.core.dxElement }) => any);
        /** Specifies whether the menu has horizontal or vertical orientation. */
        orientation?: 'horizontal' | 'vertical';
        /** Specifies options for showing and hiding the first level submenu. */
        showFirstSubmenuMode?: { name?: 'onClick' | 'onHover', delay?: { show?: number, hide?: number } | number } | 'onClick' | 'onHover';
        /** Specifies the direction at which the submenus are displayed. */
        submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
    }
    /** The Menu widget is a panel with clickable items. A click on an item opens a drop-down menu, which can contain several submenus. */
    export class dxMenu extends dxMenuBase {
        constructor(element: Element, options?: dxMenuOptions)
        constructor(element: JQuery, options?: dxMenuOptions)
    }
    export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
        /** Specifies whether or not to animate the displayed item change. */
        animationEnabled?: boolean;
        /** Specifies whether to render the view's content when it is displayed. If false, the content is rendered immediately. */
        deferRendering?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped. */
        loop?: boolean;
        /** The index of the currently displayed item. */
        selectedIndex?: number;
        /** A Boolean value specifying whether or not to allow users to change the selected index by swiping. */
        swipeEnabled?: boolean;
    }
    /** The MultiView is a widget that contains several views. An end user navigates through the views by swiping them in the horizontal direction. */
    export class dxMultiView extends CollectionWidget {
        constructor(element: Element, options?: dxMultiViewOptions)
        constructor(element: JQuery, options?: dxMultiViewOptions)
    }
    /** This section lists the data source fields that are used in a default template for multi-view items. */
    export interface dxMultiViewItemTemplate extends CollectionWidgetItemTemplate {
    }
    export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
        /** Specifies whether or not an end-user can scroll tabs by swiping. */
        scrollByContent?: boolean;
    }
    /** The NavBar is a widget that navigates the application views. */
    export class dxNavBar extends dxTabs {
        constructor(element: Element, options?: dxNavBarOptions)
        constructor(element: JQuery, options?: dxNavBarOptions)
    }
    /** This section lists the data source fields that are used in a default template for navbar items. */
    export interface dxNavBarItemTemplate extends dxTabsItemTemplate {
        /** Specifies a badge text for the navbar item. */
        badge?: string;
    }
    export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
        /** Specifies the value's display format and controls the user input according to it. */
        format?: format;
        /** Specifies the text of the message displayed if the specified value is not a number. */
        invalidValueMessage?: string;
        /** The maximum value accepted by the number box. */
        max?: number;
        /** The minimum value accepted by the number box. */
        min?: number;
        /** Specifies the value to be passed to the type attribute of the underlying `` element. */
        mode?: 'number' | 'text' | 'tel';
        /** Specifies whether to show the buttons that change the value by a step. */
        showSpinButtons?: boolean;
        /** Specifies how much the widget's value changes when using the spin buttons, Up/Down arrow keys, or mouse wheel. */
        step?: number;
        /** Specifies whether to use touch friendly spin buttons. Applies only if showSpinButtons is true. */
        useLargeSpinButtons?: boolean;
        /** The current number box value. */
        value?: number;
    }
    /** The NumberBox is a widget that displays a numeric value and allows a user to modify it by typing in a value, and incrementing or decrementing it using the keyboard or mouse. */
    export class dxNumberBox extends dxTextEditor {
        constructor(element: Element, options?: dxNumberBoxOptions)
        constructor(element: JQuery, options?: dxNumberBoxOptions)
    }
    export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: dxOverlayAnimation;
        /** A Boolean value specifying whether or not the widget is closed if a user presses the Back hardware button. */
        closeOnBackButton?: boolean;
        /** Specifies whether to close the widget if a user clicks outside it. */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** Specifies a custom template for the widget content. */
        contentTemplate?: template | ((contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether to render the widget's content when it is displayed. If false, the content is rendered immediately. */
        deferRendering?: boolean;
        /** Specifies whether or not an end-user can drag the widget. */
        dragEnabled?: boolean;
        /** Specifies the widget's height in pixels. */
        height?: number | string | (() => number | string);
        /** Specifies the maximum height the widget can reach while resizing. */
        maxHeight?: number | string | (() => number | string);
        /** Specifies the maximum width the widget can reach while resizing. */
        maxWidth?: number | string | (() => number | string);
        /** Specifies the minimum height the widget can reach while resizing. */
        minHeight?: number | string | (() => number | string);
        /** Specifies the minimum width the widget can reach while resizing. */
        minWidth?: number | string | (() => number | string);
        /** A handler for the hidden event. */
        onHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the hiding event. */
        onHiding?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, cancel?: boolean }) => any);
        /** A handler for the showing event. */
        onShowing?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the shown event. */
        onShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Positions the widget. */
        position?: any;
        /** A Boolean value specifying whether or not the main screen is inactive while the widget is active. */
        shading?: boolean;
        /** Specifies the shading color. */
        shadingColor?: string;
        /** A Boolean value specifying whether or not the widget is visible. */
        visible?: boolean;
        /** Specifies the widget's width in pixels. */
        width?: number | string | (() => number | string);
    }
    /** Configures widget visibility animations. This object contains two fields: show and hide. */
    export interface dxOverlayAnimation {
        /** An object that defines the animation options used when the widget is being hidden. */
        hide?: animationConfig;
        /** An object that defines the animation options used when the widget is being shown. */
        show?: animationConfig;
    }
    /** The Overlay widget represents a window overlaying the current view. It displays data located within the HTML element representing the widget. */
    export class dxOverlay extends Widget {
        constructor(element: Element, options?: dxOverlayOptions)
        constructor(element: JQuery, options?: dxOverlayOptions)
        /** Gets the widget's content. */
        content(): DevExpress.core.dxElement;
        /** Hides the widget. */
        hide(): Promise<void> & JQueryPromise<void>;
        /** Recalculates the widget's size and position without rerendering. */
        repaint(): void;
        /** Shows the widget. */
        show(): Promise<void> & JQueryPromise<void>;
        /** Shows or hides the widget depending on the argument. */
        toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    export interface dxPanoramaOptions extends CollectionWidgetOptions<dxPanorama> {
        /** An object exposing options for setting a background image for the panorama. */
        backgroundImage?: { url?: string, width?: number, height?: number };
        /** Specifies whether or not the widget can be focused. */
        focusStateEnabled?: boolean;
        /** The index of the currently active panorama item. */
        selectedIndex?: number;
        /** Specifies the widget content title. */
        title?: string;
    }
    /** @deprecated note] The Panorama widget is deprecated since v18.1. We recommend using the [TabPanel or MultiView widget instead. */
    export class dxPanorama extends CollectionWidget {
        constructor(element: Element, options?: dxPanoramaOptions)
        constructor(element: JQuery, options?: dxPanoramaOptions)
    }
    /** This section lists the data source fields that are used in a default template for panorama items. */
    export interface dxPanoramaItemTemplate extends CollectionWidgetItemTemplate {
        /** The title of the panorama item. */
        title?: string;
    }
    export interface dxPivotOptions extends CollectionWidgetOptions<dxPivot> {
        /** Specifies a custom template for the widget content. Rendered only once - when the widget is created. */
        contentTemplate?: template | ((container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies a custom template for item titles. */
        itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** The index of the currently active pivot item. */
        selectedIndex?: number;
        /** A Boolean value specifying whether or not to allow users to switch between items by swiping. */
        swipeEnabled?: boolean;
    }
    /** @deprecated note] The Pivot widget is deprecated since v18.1. We recommend using the [TabPanel widget instead. */
    export class dxPivot extends CollectionWidget {
        constructor(element: Element, options?: dxPivotOptions)
        constructor(element: JQuery, options?: dxPivotOptions)
    }
    /** This section lists the data source fields that are used in a default template for pivot items. */
    export interface dxPivotItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies a name for a pivot item. */
        title?: string;
        /** A template used for rendering the item title. */
        titleTemplate?: template | (() => string | Element | JQuery);
    }
    export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
        /** Allows an end-user to expand/collapse all header items within a header level. */
        allowExpandAll?: boolean;
        /** Allows a user to filter fields by selecting or deselecting values in the popup menu. */
        allowFiltering?: boolean;
        /** Allows an end-user to change sorting options. */
        allowSorting?: boolean;
        /** Allows an end-user to sort columns by summary values. */
        allowSortingBySummary?: boolean;
        /** Specifies the area to which data field headers must belong. */
        dataFieldArea?: 'column' | 'row';
        /** Specifies a data source for the pivot grid. */
        dataSource?: Array<any> | DevExpress.data.PivotGridDataSource | DevExpress.data.PivotGridDataSourceOptions;
        /** Configures client-side exporting. */
        export?: { enabled?: boolean, fileName?: string, proxyUrl?: string, ignoreExcelErrors?: boolean };
        /** The Field Chooser configuration options. */
        fieldChooser?: { enabled?: boolean, allowSearch?: boolean, searchTimeout?: number, layout?: 0 | 1 | 2, title?: string, width?: number, height?: number, applyChangesMode?: 'instantly' | 'onDemand', texts?: { columnFields?: string, rowFields?: string, dataFields?: string, filterFields?: string, allFields?: string } };
        /** Configures the field panel. */
        fieldPanel?: { showColumnFields?: boolean, showFilterFields?: boolean, showDataFields?: boolean, showRowFields?: boolean, allowFieldDragging?: boolean, visible?: boolean, texts?: { columnFieldArea?: string, rowFieldArea?: string, filterFieldArea?: string, dataFieldArea?: string } };
        /** Configures the header filter feature. */
        headerFilter?: { width?: number, height?: number, allowSearch?: boolean, searchTimeout?: number, texts?: { emptyValue?: string, ok?: string, cancel?: string } };
        /** Specifies whether or not to hide rows and columns with no data. */
        hideEmptySummaryCells?: boolean;
        /** Specifies options configuring the load panel. */
        loadPanel?: { enabled?: boolean, text?: string, width?: number, height?: number, showIndicator?: boolean, indicatorSrc?: string, showPane?: boolean };
        /** A handler for the cellClick event. */
        onCellClick?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any);
        /** A handler for the cellPrepared event. */
        onCellPrepared?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, area?: string, cellElement?: DevExpress.core.dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number }) => any);
        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, cell?: dxPivotGridPivotGridCell, cellElement?: DevExpress.core.dxElement, columnIndex?: number, rowIndex?: number, dataFields?: Array<DevExpress.data.PivotGridDataSourceField>, rowFields?: Array<DevExpress.data.PivotGridDataSourceField>, columnFields?: Array<DevExpress.data.PivotGridDataSourceField>, field?: DevExpress.data.PivotGridDataSourceField }) => any);
        /** A handler for the exported event. */
        onExported?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the exporting event. */
        onExporting?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
        /** A handler for the fileSaving event. */
        onFileSaving?: ((e: { component?: dxPivotGrid, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** Specifies the layout of items in the row header. */
        rowHeaderLayout?: 'standard' | 'tree';
        /** A configuration object specifying scrolling options. */
        scrolling?: { mode?: 'standard' | 'virtual', useNative?: boolean | 'auto' };
        /** Specifies whether the outer borders of the grid are visible or not. */
        showBorders?: boolean;
        /** Specifies whether to display the Grand Total column. */
        showColumnGrandTotals?: boolean;
        /** Specifies whether to display the Total columns. */
        showColumnTotals?: boolean;
        /** Specifies whether to display the Grand Total row. */
        showRowGrandTotals?: boolean;
        /** Specifies whether to display the Total rows. Applies only if rowHeaderLayout is "standard". */
        showRowTotals?: boolean;
        /** Specifies where to show the total rows or columns. Applies only if rowHeaderLayout is "standard". */
        showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
        /** A configuration object specifying options related to state storing. */
        stateStoring?: { enabled?: boolean, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage', customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((state: any) => any), savingTimeout?: number };
        /** Strings that can be changed or localized in the PivotGrid widget. */
        texts?: { grandTotal?: string, total?: string, noData?: string, showFieldChooser?: string, expandAll?: string, collapseAll?: string, sortColumnBySummary?: string, sortRowBySummary?: string, removeAllSorting?: string, exportToExcel?: string, dataNotAvailable?: string };
        /** Specifies whether long text in header items should be wrapped. */
        wordWrapEnabled?: boolean;
    }
    /** The PivotGrid is a widget that allows you to display and analyze multi-dimensional data from a local storage or an OLAP cube. */
    export class dxPivotGrid extends Widget {
        constructor(element: Element, options?: dxPivotGridOptions)
        constructor(element: JQuery, options?: dxPivotGridOptions)
        /** Binds a Chart to the PivotGrid. */
        bindChart(chart: string | JQuery | any, integrationOptions: { inverted?: boolean, dataFieldsDisplayMode?: string, putDataFieldsInto?: string, alternateDataFields?: boolean, processCell?: Function, customizeChart?: Function, customizeSeries?: Function }): Function & null;
        /** Exports pivot grid data to the Excel file. */
        exportToExcel(): void;
        /** Gets the PivotGridDataSource instance. */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /** Gets the Popup instance of the field chooser window. */
        getFieldChooserPopup(): dxPopup;
        /** Updates the widget to the size of its content. */
        updateDimensions(): void;
    }
    export interface dxPivotGridFieldChooserOptions extends WidgetOptions<dxPivotGridFieldChooser> {
        /** Specifies whether the field chooser allows searching in the "All Fields" section. */
        allowSearch?: boolean;
        /** Specifies when to apply changes made in the widget to the PivotGrid. */
        applyChangesMode?: 'instantly' | 'onDemand';
        /** The data source of a PivotGrid widget. */
        dataSource?: DevExpress.data.PivotGridDataSource;
        /** Configures the header filter feature. */
        headerFilter?: { width?: number, height?: number, allowSearch?: boolean, searchTimeout?: number, texts?: { emptyValue?: string, ok?: string, cancel?: string } };
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** Specifies the field chooser layout. */
        layout?: 0 | 1 | 2;
        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: ((e: { component?: dxPivotGridFieldChooser, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, area?: string, field?: DevExpress.data.PivotGridDataSourceField, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** Specifies a delay in milliseconds between when a user finishes typing in the field chooser's search panel, and when the search is executed. */
        searchTimeout?: number;
        /** The widget's state. */
        state?: any;
        /** Strings that can be changed or localized in the PivotGridFieldChooser widget. */
        texts?: { columnFields?: string, rowFields?: string, dataFields?: string, filterFields?: string, allFields?: string };
    }
    /** A complementary widget for the PivotGrid that allows you to manage data displayed in the PivotGrid. The field chooser is already integrated in the PivotGrid and can be invoked using the context menu. If you need to continuously display the field chooser near the PivotGrid widget, use the PivotGridFieldChooser widget. */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions)
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions)
        /** Applies changes made in the widget to the PivotGrid. Takes effect only if applyChangesMode is "onDemand". */
        applyChanges(): void;
        /** Cancels changes made in the widget without applying them to the PivotGrid. Takes effect only if applyChangesMode is "onDemand". */
        cancelChanges(): void;
        /** Gets the PivotGridDataSource instance. */
        getDataSource(): DevExpress.data.PivotGridDataSource;
        /** Updates the widget to the size of its content. */
        updateDimensions(): void;
    }
    export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: dxPopoverAnimation;
        /** A Boolean value specifying whether or not the widget is closed if a user clicks outside of the popover window and outside the target element. */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** Specifies options of popover hiding. */
        hideEvent?: { name?: string, delay?: number } | string;
        /** An object defining widget positioning options. */
        position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
        /** A Boolean value specifying whether or not the main screen is inactive while the widget is active. */
        shading?: boolean;
        /** Specifies options for displaying the widget. */
        showEvent?: { name?: string, delay?: number } | string;
        /** A Boolean value specifying whether or not to display the title in the overlay window. */
        showTitle?: boolean;
        /** The target element associated with a popover. */
        target?: string | Element | JQuery;
        /** Specifies the widget's width. */
        width?: number | string | (() => number | string);
    }
    /** Configures widget visibility animations. This object contains two fields: show and hide. */
    export interface dxPopoverAnimation extends dxPopupAnimation {
        /** An object that defines the animation options used when the widget is being hidden. */
        hide?: animationConfig;
        /** An object that defines the animation options used when the widget is being shown. */
        show?: animationConfig;
    }
    /** The Popover is a widget that shows notifications within a box with an arrow pointing to a specified UI element. */
    export class dxPopover extends dxPopup {
        constructor(element: Element, options?: dxPopoverOptions)
        constructor(element: JQuery, options?: dxPopoverOptions)
        /** Shows the widget. */
        show(): Promise<void> & JQueryPromise<void>;
        /** Shows the widget for a target element. */
        show(target: string | Element | JQuery): Promise<void> & JQueryPromise<void>;
    }
    export interface dxPopupOptions<T = dxPopup> extends dxOverlayOptions<T> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: dxPopupAnimation;
        /** Specifies the container in which to place the widget. */
        container?: string | Element | JQuery;
        /** Specifies whether or not to allow a user to drag the popup window. */
        dragEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** A Boolean value specifying whether or not to display the widget in full-screen mode. */
        fullScreen?: boolean;
        /** Specifies the widget's height in pixels. */
        height?: number | string | (() => number | string);
        /** A handler for the resize event. */
        onResize?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the resizeEnd event. */
        onResizeEnd?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the resizeStart event. */
        onResizeStart?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the titleRendered event. */
        onTitleRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, titleElement?: DevExpress.core.dxElement }) => any);
        /** Positions the widget. */
        position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
        /** Specifies whether or not an end user can resize the widget. */
        resizeEnabled?: boolean;
        /** Specifies whether or not the widget displays the Close button. */
        showCloseButton?: boolean;
        /** A Boolean value specifying whether or not to display the title in the popup window. */
        showTitle?: boolean;
        /** The title in the overlay window. */
        title?: string;
        /** Specifies a custom template for the widget title. Does not apply if the title is defined. */
        titleTemplate?: template | ((titleElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies items displayed on the top or bottom toolbar of the popup window. */
        toolbarItems?: Array<dxPopupToolbarItem>;
        /** Specifies the widget's width in pixels. */
        width?: number | string | (() => number | string);
    }
    /** Configures widget visibility animations. This object contains two fields: show and hide. */
    export interface dxPopupAnimation extends dxOverlayAnimation {
        /** An object that defines the animation options used when the widget is being hidden. */
        hide?: animationConfig;
        /** An object that defines the animation options used when the widget is being shown. */
        show?: animationConfig;
    }
    /** Specifies items displayed on the top or bottom toolbar of the popup window. */
    export interface dxPopupToolbarItem {
        /** Specifies whether or not a toolbar item must be displayed disabled. */
        disabled?: boolean;
        /** Specifies html code inserted into the toolbar item element. */
        html?: string;
        /** Specifies a location for the item on the toolbar. */
        location?: 'after' | 'before' | 'center';
        /** Specifies a configuration object for the widget that presents a toolbar item. */
        options?: any;
        /** Specifies an item template that should be used to render this item only. */
        template?: template;
        /** Specifies text displayed for the toolbar item. */
        text?: string;
        /** Specifies whether the item is displayed on a top or bottom toolbar. */
        toolbar?: 'bottom' | 'top';
        /** Specifies whether or not a widget item must be displayed. */
        visible?: boolean;
        /** A widget that presents a toolbar item. */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox';
    }
    /** The Popup widget is a pop-up window overlaying the current view. */
    export class dxPopup extends dxOverlay {
        constructor(element: Element, options?: dxPopupOptions)
        constructor(element: JQuery, options?: dxPopupOptions)
    }
    export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
        /** A handler for the complete event. */
        onComplete?: ((e: { component?: dxProgressBar, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** Specifies whether or not the widget displays a progress status. */
        showStatus?: boolean;
        /** Specifies a format for the progress status. */
        statusFormat?: string | ((ratio: number, value: number) => string);
        /** The current widget value. */
        value?: number;
    }
    /** The ProgressBar is a widget that shows current progress. */
    export class dxProgressBar extends dxTrackBar {
        constructor(element: Element, options?: dxProgressBarOptions)
        constructor(element: JQuery, options?: dxProgressBarOptions)
    }
    export interface dxRadioGroupOptions extends EditorOptions<dxRadioGroup>, DataExpressionMixinOptions<dxRadioGroup> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies the radio group layout. */
        layout?: 'horizontal' | 'vertical';
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** Specifies the currently selected value. */
        value?: any;
    }
    /** The RadioGroup is a widget that contains a set of radio buttons and allows an end user to make a single selection from the set. */
    export class dxRadioGroup extends Editor {
        constructor(element: Element, options?: dxRadioGroupOptions)
        constructor(element: JQuery, options?: dxRadioGroupOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
        /** The right edge of the interval currently selected using the range slider. */
        end?: number;
        /** The value to be assigned to the name attribute of the underlying `` element. */
        endName?: string;
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: dxRangeSlider, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** The left edge of the interval currently selected using the range slider. */
        start?: number;
        /** The value to be assigned to the name attribute of the underlying `` element. */
        startName?: string;
        /** Specifies the currently selected value. */
        value?: Array<number>;
    }
    /** The RangeSlider is a widget that allows an end user to choose a range of numeric values. */
    export class dxRangeSlider extends dxSliderBase {
        constructor(element: Element, options?: dxRangeSliderOptions)
        constructor(element: JQuery, options?: dxRangeSliderOptions)
        /** Resets the value option to the default value. */
        reset(): void;
    }
    export interface dxRecurrenceEditorOptions extends EditorOptions<dxRecurrenceEditor> {
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        startDate?: Date;
        /** Specifies the currently selected value. */
        value?: string;
    }
    /** A base class for editors. */
    export class dxRecurrenceEditor extends Editor {
        constructor(element: Element, options?: dxRecurrenceEditorOptions)
        constructor(element: JQuery, options?: dxRecurrenceEditorOptions)
    }
    export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
        /** Specifies which borders of the widget element are used as a handle. */
        handles?: 'top' | 'bottom' | 'right' | 'left' | 'all';
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** Specifies the upper height boundary for resizing. */
        maxHeight?: number;
        /** Specifies the upper width boundary for resizing. */
        maxWidth?: number;
        /** Specifies the lower height boundary for resizing. */
        minHeight?: number;
        /** Specifies the lower width boundary for resizing. */
        minWidth?: number;
        /** A handler for the resize event. */
        onResize?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** A handler for the resizeEnd event. */
        onResizeEnd?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** A handler for the resizeStart event. */
        onResizeStart?: ((e: { component?: dxResizable, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
        /** Specifies the widget's width. */
        width?: number | string | (() => number | string);
    }
    /** The Resizable widget enables its content to be resizable in the UI. */
    export class dxResizable extends DOMComponent {
        constructor(element: Element, options?: dxResizableOptions)
        constructor(element: JQuery, options?: dxResizableOptions)
    }
    export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
        /** Specifies the collection of columns for the grid used to position layout elements. */
        cols?: Array<{ baseSize?: number | 'auto', shrink?: number, ratio?: number, screen?: string }>;
        /** Specifies the widget's height. */
        height?: number | string | (() => number | string);
        /** Specifies the collection of rows for the grid used to position layout elements. */
        rows?: Array<{ baseSize?: number | 'auto', shrink?: number, ratio?: number, screen?: string }>;
        /** Specifies the function returning the size qualifier depending on the screen's width. */
        screenByWidth?: Function;
        /** Specifies on which screens all layout elements should be arranged in a single column. Accepts a single or several size qualifiers separated by a space. */
        singleColumnScreen?: string;
        /** Specifies the widget's width. */
        width?: number | string | (() => number | string);
    }
    /** The ResponsiveBox widget allows you to create an application or a website with a layout adapted to different screen sizes. */
    export class dxResponsiveBox extends CollectionWidget {
        constructor(element: Element, options?: dxResponsiveBoxOptions)
        constructor(element: JQuery, options?: dxResponsiveBoxOptions)
    }
    /** This section lists the fields that are used in a default template for widget items. */
    export interface dxResponsiveBoxItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the item location and size against the widget grid. */
        location?: { row?: number, col?: number, rowspan?: number, colspan?: number, screen?: string } | Array<{ row?: number, col?: number, rowspan?: number, colspan?: number, screen?: string }>;
    }
    export interface dxSchedulerOptions extends WidgetOptions<dxScheduler> {
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding appointment is an all-day appointment. */
        allDayExpr?: string;
        /** Specifies a custom template for appointments. */
        appointmentTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies a custom template for appointment tooltips. */
        appointmentTooltipTemplate?: template | ((appointmentData: any, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies cell duration in minutes. */
        cellDuration?: number;
        /** Specifies whether or not an end-user can scroll the view in both directions at the same time. */
        crossScrollingEnabled?: boolean;
        /** Specifies a date displayed on the current scheduler view by default. */
        currentDate?: Date | number | string;
        /** Specifies the currently displayed view. Accepts the view's name or type. */
        currentView?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek';
        /** Specifies a custom template for table cells. */
        dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the origin of data for the widget. */
        dataSource?: string | Array<dxSchedulerAppointmentTemplate> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** Specifies a custom template for day scale items. */
        dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the date-time values' serialization format. Use it only if you do not specify the dataSource at design time. */
        dateSerializationFormat?: string;
        /** Specifies the name of the data source item field whose value holds the description of the corresponding appointment. */
        descriptionExpr?: string;
        /** Specifies a custom template for appointments in the appointment collector's drop-down list. */
        dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies which editing operations an end-user can perform on appointments. */
        editing?: boolean | { allowAdding?: boolean, allowUpdating?: boolean, allowDeleting?: boolean, allowResizing?: boolean, allowDragging?: boolean };
        /** Specifies the name of the data source item field that defines the ending of an appointment. */
        endDateExpr?: string;
        /** Specifies the name of the data source item field that defines the timezone of the appointment end date. */
        endDateTimeZoneExpr?: string;
        /** Specifies an end hour in the scheduler view's time interval. */
        endDayHour?: number;
        /** Specifies the first day of a week. Does not apply to the agenda view. */
        firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies the resource kinds by which the scheduler's appointments are grouped in a timetable. */
        groups?: Array<string>;
        /** Specifies the time interval between when the date-time indicator changes its position, in milliseconds. */
        indicatorUpdateInterval?: number;
        /** The latest date the widget allows you to select. */
        max?: Date | number | string;
        /** Specifies the limit of full-sized appointments displayed per cell. In the "day", "week" and "workweek" views, this option applies only to all-day appointments. */
        maxAppointmentsPerCell?: number | 'auto' | 'unlimited';
        /** The earliest date the widget allows you to select. */
        min?: Date | number | string;
        /** The text or HTML markup displayed by the widget if the item collection is empty. Available for the Agenda view only. */
        noDataText?: string;
        /** A handler for the appointmentAdded event. */
        onAppointmentAdded?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** A handler for the AppointmentAdding event. */
        onAppointmentAdding?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** A handler for the appointmentClick event. */
        onAppointmentClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** A function that is executed when a user attempts to open the browser's context menu for an appointment. Allows you to replace this context menu with a custom one. */
        onAppointmentContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** A handler for the appointmentDblClick event. */
        onAppointmentDblClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** A handler for the appointmentDeleted event. */
        onAppointmentDeleted?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** A handler for the AppointmentDeleting event. */
        onAppointmentDeleting?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** A handler for the appointmentFormCreated event. */
        onAppointmentFormCreated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, form?: dxForm }) => any);
        /** A handler for the appointmentRendered event. */
        onAppointmentRendered?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, targetedAppointmentData?: any, appointmentElement?: DevExpress.core.dxElement }) => any);
        /** A handler for the appointmentUpdated event. */
        onAppointmentUpdated?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, appointmentData?: any, error?: Error }) => any);
        /** A handler for the AppointmentUpdating event. */
        onAppointmentUpdating?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, oldData?: any, newData?: any, cancel?: boolean | Promise<boolean> | JQueryPromise<boolean> }) => any);
        /** A handler for the cellClick event. */
        onCellClick?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any) | string;
        /** A function that is executed when a user attempts to open the browser's context menu for a cell. Allows you to replace this context menu with a custom one. */
        onCellContextMenu?: ((e: { component?: dxScheduler, element?: DevExpress.core.dxElement, model?: any, cellData?: any, cellElement?: DevExpress.core.dxElement, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** Specifies the edit mode for recurring appointments. */
        recurrenceEditMode?: 'dialog' | 'occurrence' | 'series';
        /** Specifies the name of the data source item field that defines exceptions for the current recurring appointment. */
        recurrenceExceptionExpr?: string;
        /** Specifies the name of the data source item field that defines a recurrence rule for generating recurring appointments. */
        recurrenceRuleExpr?: string;
        /** Specifies whether filtering is performed on the server or client side. */
        remoteFiltering?: boolean;
        /** Specifies a custom template for resource headers. */
        resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies an array of resources available in the scheduler. */
        resources?: Array<{ fieldExpr?: string, colorExpr?: string, label?: string, allowMultiple?: boolean, useColorAsDefault?: boolean, valueExpr?: string | Function, displayExpr?: string | Function, dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions }>;
        /** Currently selected cells' data. */
        selectedCellData?: Array<any>;
        /** Specifies whether to apply shading to cover the timetable up to the current time. */
        shadeUntilCurrentTime?: boolean;
        /** Specifies the "All-day" panel's visibility. Setting this option to false hides the panel along with the all-day appointments. */
        showAllDayPanel?: boolean;
        /** Specifies the current date-time indicator's visibility. */
        showCurrentTimeIndicator?: boolean;
        /** Specifies the name of the data source item field that defines the start of an appointment. */
        startDateExpr?: string;
        /** Specifies the name of the data source item field that defines the timezone of the appointment start date. */
        startDateTimeZoneExpr?: string;
        /** Specifies a start hour in the scheduler view's time interval. */
        startDayHour?: number;
        /** Specifies the name of the data source item field that holds the subject of an appointment. */
        textExpr?: string;
        /** Specifies a custom template for time scale items. */
        timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the timezone of the widget. */
        timeZone?: string;
        /** Specifies whether a user can switch views using tabs or a drop-down menu. */
        useDropDownViewSwitcher?: boolean;
        /** Configures individual views. */
        views?: Array<'day' | 'week' | 'workWeek' | 'month' | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' | { type?: 'agenda' | 'day' | 'month' | 'timelineDay' | 'timelineMonth' | 'timelineWeek' | 'timelineWorkWeek' | 'week' | 'workWeek', name?: string, maxAppointmentsPerCell?: number | 'auto' | 'unlimited', intervalCount?: number, startDate?: Date | number | string, startDayHour?: number, endDayHour?: number, groups?: Array<string>, firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6, cellDuration?: number, appointmentTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dropDownAppointmentTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), appointmentTooltipTemplate?: template | ((appointmentData: any, contentElement: DevExpress.core.dxElement) => string | Element | JQuery), dateCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), timeCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), dataCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), resourceCellTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery), agendaDuration?: number, groupOrientation?: 'horizontal' | 'vertical', forceMaxAppointmentPerCell?: boolean }>;
    }
    /** The Scheduler is a widget that represents scheduled data and allows a user to manage and edit it. */
    export class dxScheduler extends Widget {
        constructor(element: Element, options?: dxSchedulerOptions)
        constructor(element: JQuery, options?: dxSchedulerOptions)
        /** Adds an appointment. */
        addAppointment(appointment: any): void;
        /** Deletes an appointment. */
        deleteAppointment(appointment: any): void;
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets the current view's end date. */
        getEndViewDate(): Date;
        /** Gets the current view's start date. */
        getStartViewDate(): Date;
        /** Hides an appointment details form. */
        hideAppointmentPopup(saveChanges?: boolean): void;
        /** Hides an appointment tooltip. */
        hideAppointmentTooltip(): void;
        /** Registers a handler to be executed when a user presses a specific key. */
        registerKeyHandler(): void;
        /** Scrolls the current view to a specific day and time. */
        scrollToTime(hours: number, minutes: number, date?: Date): void;
        /** Shows the appointment details form. */
        showAppointmentPopup(appointmentData: any, createNewAppointment?: boolean, currentAppointmentData?: any): void;
        /** Shows a tooltip for a target element. */
        showAppointmentTooltip(appointmentData: any, target: string | Element | JQuery, currentAppointmentData?: any): void;
        /** Updates an appointment. */
        updateAppointment(target: any, appointment: any): void;
    }
    export interface dxScrollViewOptions extends dxScrollableOptions<dxScrollView> {
        /** A handler for the pullDown event. */
        onPullDown?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the reachBottom event. */
        onReachBottom?: ((e: { component?: dxScrollView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies the text shown in the pullDown panel when pulling the content down lowers the refresh threshold. */
        pulledDownText?: string;
        /** Specifies the text shown in the pullDown panel while pulling the content down to the refresh threshold. */
        pullingDownText?: string;
        /** Specifies the text shown in the pullDown panel displayed when content is scrolled to the bottom. */
        reachBottomText?: string;
        /** Specifies the text shown in the pullDown panel displayed when the content is being refreshed. */
        refreshingText?: string;
    }
    /** The ScrollView is a widget that enables a user to scroll its content. */
    export class dxScrollView extends dxScrollable {
        constructor(element: Element, options?: dxScrollViewOptions)
        constructor(element: JQuery, options?: dxScrollViewOptions)
        /** Locks the widget until the release(preventScrollBottom) method is called and executes the function passed to the onPullDown option and the handler assigned to the pullDown event. */
        refresh(): void;
        /** Notifies the ScrollView that data loading is finished. */
        release(preventScrollBottom: boolean): Promise<void> & JQueryPromise<void>;
    }
    export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
        /** Specifies whether the widget allows a user to enter a custom value. Requires the onCustomItemCreating handler implementation. */
        acceptCustomValue?: boolean;
        /** Specifies a custom template for the text field. Must contain the TextBox widget. */
        fieldTemplate?: template | ((selectedItem: any, fieldElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** A handler for the customItemCreating event. Executed when a user adds a custom item. Requires acceptCustomValue to be set to true. */
        onCustomItemCreating?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, text?: string, customItem?: string | any | Promise<any> | JQueryPromise<any> }) => any);
        /** The text that is provided as a hint in the select box editor. */
        placeholder?: string;
        /** Specifies whether or not to display selection controls. */
        showSelectionControls?: boolean;
        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;
    }
    /** The SelectBox widget is an editor that allows an end user to select an item from a drop-down list. */
    export class dxSelectBox extends dxDropDownList {
        constructor(element: Element, options?: dxSelectBoxOptions)
        constructor(element: JQuery, options?: dxSelectBoxOptions)
    }
    export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
        /** The current slider value. */
        value?: number;
    }
    /** The Slider is a widget that allows an end user to set a numeric value on a continuous range of possible values. */
    export class dxSlider extends dxSliderBase {
        constructor(element: Element, options?: dxSliderOptions)
        constructor(element: JQuery, options?: dxSliderOptions)
    }
    export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies a custom template for the widget content. Rendered only once - when the widget is created. */
        contentTemplate?: template | ((container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** A Boolean value specifying whether or not to display a grouped menu. */
        menuGrouped?: boolean;
        /** Specifies a custom template for group captions. */
        menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
        /** Specifies a custom template for menu items. */
        menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the current menu position. */
        menuPosition?: 'inverted' | 'normal';
        /** Specifies whether or not the slide-out menu is displayed. */
        menuVisible?: boolean;
        /** A handler for the menuGroupRendered event. */
        onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the menuItemRendered event. */
        onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** The index number of the currently selected item. */
        selectedIndex?: number;
        /** Indicates whether the menu can be shown/hidden by swiping the widget's main panel. */
        swipeEnabled?: boolean;
    }
    /** The SlideOut widget is a classic slide-out menu paired with a view. An end user opens the menu by swiping away the view. */
    export class dxSlideOut extends CollectionWidget {
        constructor(element: Element, options?: dxSlideOutOptions)
        constructor(element: JQuery, options?: dxSlideOutOptions)
        /** Hides the widget's slide-out menu. */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /** Displays the widget's slide-out menu. */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /** Shows or hides the slide-out menu depending on the argument. */
        toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
    }
    /** This section lists the data source fields that are used in a default template for SlideOut items. */
    export interface dxSlideOutItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies a template that should be used to render a menu item. */
        menuTemplate?: template | (() => string | Element | JQuery);
    }
    export interface dxSlideOutViewOptions extends WidgetOptions<dxSlideOutView> {
        /** Specifies a custom template for the widget content. */
        contentTemplate?: template | ((contentElement: DevExpress.core.dxElement) => any);
        /** Specifies the current menu position. */
        menuPosition?: 'inverted' | 'normal';
        /** Specifies a custom template for the menu content. */
        menuTemplate?: template | ((menuElement: DevExpress.core.dxElement) => any);
        /** Specifies whether or not the menu panel is visible. */
        menuVisible?: boolean;
        /** Specifies whether or not the menu is shown when a user swipes the widget content. */
        swipeEnabled?: boolean;
    }
    /** The SlideOutView widget is a classic slide-out menu paired with a view. This widget is very similar to the SlideOut with only one difference - the SlideOut always contains the List in the slide-out menu, while the SlideOutView can hold any collection there. */
    export class dxSlideOutView extends Widget {
        constructor(element: Element, options?: dxSlideOutViewOptions)
        constructor(element: JQuery, options?: dxSlideOutViewOptions)
        /** Gets the widget's content. */
        content(): DevExpress.core.dxElement;
        /** Hides the widget's slide-out menu. */
        hideMenu(): Promise<void> & JQueryPromise<void>;
        /** Gets the slide-out menu's content. */
        menuContent(): DevExpress.core.dxElement;
        /** Shows the slide-out menu. */
        showMenu(): Promise<void> & JQueryPromise<void>;
        /** Shows or hides the slide-out menu depending on the argument. */
        toggleMenuVisibility(): Promise<void> & JQueryPromise<void>;
    }
    export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** Text displayed when the widget is in a disabled state. */
        offText?: string;
        /** Text displayed when the widget is in an enabled state. */
        onText?: string;
        /** A Boolean value specifying whether the current switch state is "On" or "Off". */
        value?: boolean;
    }
    /** The Switch is a widget that can be in two states: "On" and "Off". */
    export class dxSwitch extends Editor {
        constructor(element: Element, options?: dxSwitchOptions)
        constructor(element: JQuery, options?: dxSwitchOptions)
    }
    export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies whether or not an end-user can scroll tabs by swiping. */
        scrollByContent?: boolean;
        /** Specifies whether or not an end-user can scroll tabs. */
        scrollingEnabled?: boolean;
        /** An array of currently selected item objects. */
        selectedItems?: Array<string | number | any>;
        /** Specifies whether the widget enables an end-user to select only a single item or multiple items. */
        selectionMode?: 'multiple' | 'single';
        /** A Boolean value that specifies the availability of navigation buttons. */
        showNavButtons?: boolean;
    }
    /** The Tabs is a tab strip used to switch between pages or views. This widget is included in the TabPanel widget, but you can use the Tabs separately as well. */
    export class dxTabs extends CollectionWidget {
        constructor(element: Element, options?: dxTabsOptions)
        constructor(element: JQuery, options?: dxTabsOptions)
    }
    /** This section lists the data source fields that are used in a default template for tabs. */
    export interface dxTabsItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies a badge text for the tab. */
        badge?: string;
        /** Specifies the name of the icon displayed by the widget item. */
        icon?: string;
    }
    export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
        /** Specifies whether or not to animate the displayed item change. */
        animationEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies a custom template for item titles. */
        itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** A handler for the titleClick event. */
        onTitleClick?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any) | string;
        /** A handler for the titleHold event. */
        onTitleHold?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any);
        /** A handler for the titleRendered event. */
        onTitleRendered?: ((e: { component?: dxTabPanel, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement }) => any);
        /** A Boolean value specifying if tabs in the title are scrolled by content. */
        scrollByContent?: boolean;
        /** A Boolean indicating whether or not to add scrolling support for tabs in the title. */
        scrollingEnabled?: boolean;
        /** A Boolean value that specifies the availability of navigation buttons. */
        showNavButtons?: boolean;
        /** A Boolean value specifying whether or not to allow users to change the selected index by swiping. */
        swipeEnabled?: boolean;
    }
    /** The TabPanel is a widget consisting of the Tabs and MultiView widgets. It automatically synchronizes the selected tab with the currently displayed view and vice versa. */
    export class dxTabPanel extends dxMultiView {
        constructor(element: Element, options?: dxTabPanelOptions)
        constructor(element: JQuery, options?: dxTabPanelOptions)
    }
    /** This section lists the data source fields that are used in a default template for tab panel items. */
    export interface dxTabPanelItemTemplate extends dxMultiViewItemTemplate {
        /** Specifies a badge text for the tab. */
        badge?: string;
        /** Specifies the name of the icon displayed by the widget item title. */
        icon?: string;
        /** Specifies a template that should be used to render the tab for this item only. */
        tabTemplate?: template | (() => string | Element | JQuery);
        /** Specifies the item title text displayed on a corresponding tab. */
        title?: string;
    }
    export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
        /** Specifies how the widget applies values. */
        applyValueMode?: 'instantly' | 'useButtons';
        /** A Boolean value specifying whether or not to hide selected items. */
        hideSelectedItems?: boolean;
        /** Specifies the limit on displayed tags. On exceeding it, the widget replaces all tags with a single multi-tag that displays the number of selected items. */
        maxDisplayedTags?: number;
        /** A Boolean value specifying whether or not the widget is multiline. */
        multiline?: boolean;
        /** A handler for the multiTagPreparing event. Executed before the multi-tag is rendered. */
        onMultiTagPreparing?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, multiTagElement?: DevExpress.core.dxElement, selectedItems?: Array<string | number | any>, text?: string, cancel?: boolean }) => any);
        /** A handler for the selectAllValueChanged event. */
        onSelectAllValueChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** A handler for the selectionChanged event. */
        onSelectionChanged?: ((e: { component?: dxTagBox, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<string | number | any>, removedItems?: Array<string | number | any> }) => any);
        /** Specifies the mode in which all items are selected. */
        selectAllMode?: 'allPages' | 'page';
        /** Gets the currently selected items. */
        selectedItems?: Array<string | number | any>;
        /** Specifies whether the multi-tag is shown without ordinary tags. */
        showMultiTagOnly?: boolean;
        /** Specifies a custom template for tags. */
        tagTemplate?: template | ((itemData: any, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the selected items. */
        value?: Array<string | number | any>;
    }
    /** The TagBox widget is an editor that allows an end user to select multiple items from a drop-down list. */
    export class dxTagBox extends dxSelectBox {
        constructor(element: Element, options?: dxTagBoxOptions)
        constructor(element: JQuery, options?: dxTagBoxOptions)
    }
    export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
        /** A Boolean value specifying whether or not the auto resizing mode is enabled. */
        autoResizeEnabled?: boolean;
        /** Specifies the maximum height of the widget. */
        maxHeight?: number | string;
        /** Specifies the minimum height of the widget. */
        minHeight?: number | string;
        /** Specifies whether or not the widget checks the inner text for spelling mistakes. */
        spellcheck?: boolean;
    }
    /** The TextArea is a widget that enables a user to enter and edit a multi-line text. */
    export class dxTextArea extends dxTextBox {
        constructor(element: Element, options?: dxTextAreaOptions)
        constructor(element: JQuery, options?: dxTextAreaOptions)
    }
    export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
        /** Specifies the maximum number of characters you can enter into the textbox. */
        maxLength?: string | number;
        /** The "mode" attribute value of the actual HTML input element representing the text box. */
        mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
        /** Specifies a value the widget displays. */
        value?: string;
    }
    /** The TextBox is a widget that enables a user to enter and edit a single line of text. */
    export class dxTextBox extends dxTextEditor {
        constructor(element: Element, options?: dxTextBoxOptions)
        constructor(element: JQuery, options?: dxTextBoxOptions)
    }
    export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies the height of the base tile view item. */
        baseItemHeight?: number;
        /** Specifies the width of the base tile view item. */
        baseItemWidth?: number;
        /** Specifies whether tiles are placed horizontally or vertically. */
        direction?: 'horizontal' | 'vertical';
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies the widget's height. */
        height?: number | string;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies the distance in pixels between adjacent tiles. */
        itemMargin?: number;
        /** A Boolean value specifying whether or not to display a scrollbar. */
        showScrollbar?: boolean;
    }
    /** The TileView widget contains a collection of tiles. Tiles can store much more information than ordinary buttons, that is why they are very popular in apps designed for touch devices. */
    export class dxTileView extends CollectionWidget {
        constructor(element: Element, options?: dxTileViewOptions)
        constructor(element: JQuery, options?: dxTileViewOptions)
        /** Gets the current scroll position. */
        scrollPosition(): number;
    }
    /** This section lists the data source fields that are used in a default template for tile view items. */
    export interface dxTileViewItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies a multiplier for the baseItemHeight option value (for the purpose of obtaining the actual item height). */
        heightRatio?: number;
        /** Specifies a multiplier for the baseItemWidth option value (for the purpose of obtaining the actual item width). */
        widthRatio?: number;
    }
    export interface dxToastOptions extends dxOverlayOptions<dxToast> {
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: dxToastAnimation;
        /** A Boolean value specifying whether or not the widget is closed if a user presses the Back hardware button. */
        closeOnBackButton?: boolean;
        /** A Boolean value specifying whether or not the toast is closed if a user clicks it. */
        closeOnClick?: boolean;
        /** Specifies whether to close the widget if a user clicks outside it. */
        closeOnOutsideClick?: boolean | ((event: event) => boolean);
        /** A Boolean value specifying whether or not the toast is closed if a user swipes it out of the screen boundaries. */
        closeOnSwipe?: boolean;
        /** The time span in milliseconds during which the Toast widget is visible. */
        displayTime?: number;
        /** Specifies the widget's height in pixels. */
        height?: number | string | (() => number | string);
        /** Specifies the maximum width the widget can reach while resizing. */
        maxWidth?: number | string | (() => number | string);
        /** The Toast message text. */
        message?: string;
        /** Specifies the minimum width the widget can reach while resizing. */
        minWidth?: number | string | (() => number | string);
        /** Positions the widget. */
        position?: positionConfig | string;
        /** A Boolean value specifying whether or not the main screen is inactive while the widget is active. */
        shading?: boolean;
        /** Specifies the Toast widget type. */
        type?: 'custom' | 'error' | 'info' | 'success' | 'warning';
        /** Specifies the widget's width in pixels. */
        width?: number | string | (() => number | string);
    }
    /** Configures widget visibility animations. This object contains two fields: show and hide. */
    export interface dxToastAnimation extends dxOverlayAnimation {
        /** An object that defines the animation options used when the widget is being hidden. */
        hide?: animationConfig;
        /** An object that defines the animation options used when the widget is being shown. */
        show?: animationConfig;
    }
    /** The Toast is a widget that provides pop-up notifications. */
    export class dxToast extends dxOverlay {
        constructor(element: Element, options?: dxToastOptions)
        constructor(element: JQuery, options?: dxToastOptions)
    }
    export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
        /** Specifies a custom template for menu items. */
        menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Informs the widget about its location in a view HTML markup. */
        renderAs?: 'bottomToolbar' | 'topToolbar';
    }
    /** The Toolbar is a widget containing items that usually manage screen content. Those items can be plain text or widgets. */
    export class dxToolbar extends CollectionWidget {
        constructor(element: Element, options?: dxToolbarOptions)
        constructor(element: JQuery, options?: dxToolbarOptions)
    }
    /** This section lists the data source fields that are used in a default template for toolbar items. */
    export interface dxToolbarItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies when to display an item in the toolbar's overflow menu. */
        locateInMenu?: 'always' | 'auto' | 'never';
        /** Specifies a location for the item on the toolbar. */
        location?: 'after' | 'before' | 'center';
        /** Specifies a template that should be used to render a menu item. */
        menuItemTemplate?: template | (() => string | Element | JQuery);
        /** Specifies a configuration object for the widget that presents a toolbar item. */
        options?: any;
        /** Specifies when to display the text for the widget item. */
        showText?: 'always' | 'inMenu';
        /** A widget that presents a toolbar item. */
        widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox';
    }
    export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
    }
    /** The Tooltip widget displays a tooltip for a specified element on the page. */
    export class dxTooltip extends dxPopover {
        constructor(element: Element, options?: dxTooltipOptions)
        constructor(element: JQuery, options?: dxTooltipOptions)
    }
    export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
        /** The maximum value the widget can accept. */
        max?: number;
        /** The minimum value the widget can accept. */
        min?: number;
    }
    /** A base class for track bar widgets. */
    export class dxTrackBar extends Editor {
        constructor(element: Element, options?: dxTrackBarOptions)
        constructor(element: JQuery, options?: dxTrackBarOptions)
    }
    export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
        /** Specifies whether all rows are expanded initially. */
        autoExpandAll?: boolean;
        /** Configures columns. */
        columns?: Array<dxTreeListColumn>;
        /** Customizes columns after they are created. */
        customizeColumns?: ((columns: Array<dxTreeListColumn>) => any);
        /** Notifies the widget of your data structure. */
        dataStructure?: 'plain' | 'tree';
        /** Configures editing. */
        editing?: dxTreeListEditing;
        /** Specifies keys of the initially expanded rows. */
        expandedRowKeys?: Array<any>;
        /** Specifies whether nodes appear expanded or collapsed after filtering is applied. */
        expandNodesOnFiltering?: boolean;
        /** Specifies which data field defines whether the node has children. */
        hasItemsExpr?: string | Function;
        /** Specifies which data field contains nested items. Set this option when your data has a hierarchical structure. */
        itemsExpr?: string | Function;
        /** Specifies which data field provides keys for nodes. */
        keyExpr?: string | Function;
        /** A function that is executed after a user clicks a cell. */
        onCellClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any) | string;
        /** A function that is executed after the pointer enters or leaves a cell. */
        onCellHoverChanged?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: string, columnIndex?: number, rowIndex?: number, column?: dxTreeListColumn, rowType?: string, cellElement?: DevExpress.core.dxElement, row?: dxTreeListRowObject }) => any);
        /** A function that is executed after the widget creates a cell. */
        onCellPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: string, text?: string, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, rowType?: string, row?: dxTreeListRowObject, isSelected?: boolean, isExpanded?: boolean, cellElement?: DevExpress.core.dxElement }) => any);
        /** A function that is executed before a context menu is rendered. */
        onContextMenuPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: DevExpress.core.dxElement, columnIndex?: number, column?: dxTreeListColumn, rowIndex?: number, row?: dxTreeListRowObject }) => any);
        /** A function that is executed before a cell or row switches to the editing state. */
        onEditingStart?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
        /** A function that is executed after an editor is created. */
        onEditorPrepared?: ((options: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, dataField?: string, row?: dxTreeListRowObject }) => any);
        /** A function that is executed before an editor is created. */
        onEditorPreparing?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: DevExpress.core.dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxTreeListRowObject }) => any);
        /** A function that is executed after the loaded nodes are initialized. */
        onNodesInitialized?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeListNode }) => any);
        /** A function that is executed when a user clicks a row. */
        onRowClick?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, rowElement?: DevExpress.core.dxElement, handled?: boolean }) => any) | string;
        /** A function that is executed after the widget creates a row. */
        onRowPrepared?: ((e: { component?: dxTreeList, element?: DevExpress.core.dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxTreeListColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, rowElement?: DevExpress.core.dxElement }) => any);
        /** Configures paging. */
        paging?: dxTreeListPaging;
        /** Specifies which data field provides parent keys. */
        parentIdExpr?: string | Function;
        /** Notifies the TreeList of the server's data processing operations. Applies only if data has a plain structure. */
        remoteOperations?: { sorting?: boolean, filtering?: boolean, grouping?: boolean } | 'auto';
        /** Specifies the root node's identifier. Applies if dataStructure is 'plain'. */
        rootValue?: any;
        /** Configures scrolling. */
        scrolling?: dxTreeListScrolling;
        /** Configures runtime selection. */
        selection?: dxTreeListSelection;
    }
    /** Configures editing. */
    export interface dxTreeListEditing extends GridBaseEditing {
        /** Contains options that specify texts for editing-related UI elements. */
        texts?: dxTreeListEditingTexts;
    }
    /** Contains options that specify texts for editing-related UI elements. */
    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /** Specifies text for the button that adds a new nested row. Applies if the editing.mode is "batch" or "cell". */
        addRowToNode?: string;
    }
    /** Configures paging. */
    export interface dxTreeListPaging extends GridBasePaging {
        /** Enables paging. */
        enabled?: boolean;
    }
    /** Configures scrolling. */
    export interface dxTreeListScrolling extends GridBaseScrolling {
        /** Specifies the scrolling mode. */
        mode?: 'standard' | 'virtual';
    }
    /** Configures runtime selection. */
    export interface dxTreeListSelection extends GridBaseSelection {
        /** Specifies whether selection is recursive. */
        recursive?: boolean;
    }
    /** The TreeList is a widget that represents data from a local or remote source in the form of a multi-column tree view. This widget offers such features as sorting, filtering, editing, selection, etc. */
    export class dxTreeList extends GridBase {
        constructor(element: Element, options?: dxTreeListOptions)
        constructor(element: JQuery, options?: dxTreeListOptions)
        /** Adds a new column. */
        addColumn(columnOptions: any | string): void;
        /** Adds an empty data row to the highest hierarchical level. */
        addRow(): void;
        /** Adds an empty data row to a specified parent row. */
        addRow(parentId: any): void;
        /** Collapses a row with a specific key. */
        collapseRow(key: any): Promise<void> & JQueryPromise<void>;
        /** Expands a row with a specific key. */
        expandRow(key: any): Promise<void> & JQueryPromise<void>;
        /** Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the top level nodes. */
        forEachNode(callback: Function): void;
        /** Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the specified nodes. */
        forEachNode(nodes: Array<dxTreeListNode>, callback: Function): void;
        /** Gets a node with a specific key. */
        getNodeByKey(key: any | string | number): dxTreeListNode;
        /** Gets the root node. */
        getRootNode(): dxTreeListNode;
        /** Gets the keys of the rows selected explicitly via the API or via a click or tap. */
        getSelectedRowKeys(): Array<any>;
        /** @deprecated Use the getSelectedRowKeys(mode) method instead. */
        getSelectedRowKeys(leavesOnly: boolean): Array<any>;
        /** Gets the selected rows' keys. */
        getSelectedRowKeys(mode: string): Array<any>;
        /** Gets the data objects of the rows selected explicitly via the API or via a click or tap. */
        getSelectedRowsData(): Array<any>;
        /** Gets the selected rows' data objects. */
        getSelectedRowsData(mode: string): Array<any>;
        /** Gets all visible columns. */
        getVisibleColumns(): Array<dxTreeListColumn>;
        /** Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns. */
        getVisibleColumns(headerLevel: number): Array<dxTreeListColumn>;
        /** Gets currently rendered rows. */
        getVisibleRows(): Array<dxTreeListRowObject>;
        /** Checks whether a row is expanded or collapsed. */
        isRowExpanded(key: any): boolean;
        /** Loads all root node descendants (all data items). Takes effect only if data has the plain structure and remoteOperations | filtering is true. */
        loadDescendants(): Promise<void> & JQueryPromise<void>;
        /** Loads a specific node's descendants. Takes effect only if data has the plain structure and remoteOperations | filtering is true. */
        loadDescendants(keys: Array<any>): Promise<void> & JQueryPromise<void>;
        /** Loads all or only direct descendants of specific nodes. Takes effect only if data has the plain structure and remoteOperations | filtering is true. */
        loadDescendants(keys: Array<any>, childrenOnly: boolean): Promise<void> & JQueryPromise<void>;
    }
    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
        /** Specifies whether or not to animate item collapsing and expanding. */
        animationEnabled?: boolean;
        /** Allows you to load nodes manually. */
        createChildren?: ((parentNode: dxTreeViewNode) => Promise<any> | JQueryPromise<any> | Array<any>);
        /** Specifies whether a nested or plain array is used as a data source. */
        dataStructure?: 'plain' | 'tree';
        /** Specifies whether or not a user can expand all tree view items by the "*" hot key. */
        expandAllEnabled?: boolean;
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget item is displayed expanded. */
        expandedExpr?: string | Function;
        /** Specifies whether or not all parent nodes of an initially expanded node are displayed expanded. */
        expandNodesRecursive?: boolean;
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding node includes child nodes. */
        hasItemsExpr?: string | Function;
        /** An array of items displayed by the widget. */
        items?: Array<dxTreeViewItemTemplate>;
        /** A handler for the itemClick event. */
        onItemClick?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode }) => any);
        /** A handler for the itemCollapsed event. */
        onItemCollapsed?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** A handler for the itemContextMenu event. */
        onItemContextMenu?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode }) => any);
        /** A handler for the itemExpanded event. */
        onItemExpanded?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeViewNode }) => any);
        /** A handler for the itemHold event. */
        onItemHold?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode }) => any);
        /** A handler for the itemRendered event. */
        onItemRendered?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode }) => any);
        /** A handler for the itemSelectionChanged event. */
        onItemSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeViewNode, itemElement?: DevExpress.core.dxElement }) => any);
        /** A function that is executed after the "Select All" check box's state changes. Applies only if showCheckBoxesMode is "selectAll" and selectionMode is "multiple". */
        onSelectAllValueChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any, value?: boolean }) => any);
        /** A handler for the selectionChanged event. Executed after selecting an item or clearing its selection. */
        onSelectionChanged?: ((e: { component?: dxTreeView, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies the name of the data source item field for holding the parent key of the corresponding node. */
        parentIdExpr?: string | Function;
        /** Specifies the parent ID value of the root item. */
        rootValue?: any;
        /** A string value specifying available scrolling directions. */
        scrollDirection?: 'both' | 'horizontal' | 'vertical';
        /** Specifies the text displayed at the "Select All" check box. */
        selectAllText?: string;
        /** Specifies whether or not an item becomes selected if a user clicks it. */
        selectByClick?: boolean;
        /** Specifies item selection mode. */
        selectionMode?: 'multiple' | 'single';
        /** Specifies whether or not to select nodes recursively. */
        selectNodesRecursive?: boolean;
        /** Specifies the current check boxes display mode. */
        showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
        /** Specifies if the virtual mode is enabled. */
        virtualModeEnabled?: boolean;
    }
    /** The TreeView widget is a tree-like representation of textual data. */
    export class dxTreeView extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxTreeViewOptions)
        constructor(element: JQuery, options?: dxTreeViewOptions)
        /** Collapses an item with a specific key. */
        collapseItem(itemData: any): void;
        /** Collapses an item found using its DOM node. */
        collapseItem(itemElement: Element): void;
        /** Collapses an item with a specific key. */
        collapseItem(key: any): void;
        /** Expands an item found using its data object. */
        expandItem(itemData: any): void;
        /** Expands an item found using its DOM node. */
        expandItem(itemElement: Element): void;
        /** Expands an item with a specific key. */
        expandItem(key: any): void;
        /** Gets all nodes. */
        getNodes(): Array<dxTreeViewNode>;
        /** Selects all items. */
        selectAll(): void;
        /** Selects an item found using its data object. */
        selectItem(itemData: any): void;
        /** Selects an item found using its DOM node. */
        selectItem(itemElement: Element): void;
        /** Selects an item with a specific key. */
        selectItem(key: any): void;
        /** Cancels the selection of all items. */
        unselectAll(): void;
        /** Cancels the selection of an item found using its data object. */
        unselectItem(itemData: any): void;
        /** Cancels the selection of an item found using its DOM node. */
        unselectItem(itemElement: Element): void;
        /** Cancels the selection of an item with a specific key. */
        unselectItem(key: any): void;
        /** Updates the tree view scrollbars according to the current size of the widget content. */
        updateDimensions(): Promise<void> & JQueryPromise<void>;
    }
    /** A validation rule that demands that a validated field has a value. */
    export interface RequiredRule {
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Indicates whether to remove the Space characters from the validated value. */
        trim?: boolean;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule that demands that the validated field has a numeric value. */
    export interface NumericRule {
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule that demands the target value be within the specified value range (including the range's end points). */
    export interface RangeRule {
        /** Specifies the maximum value allowed for the validated value. */
        max?: Date | number;
        /** Specifies the message that is shown to end-users if the current rule is broken. */
        message?: string;
        /** Specifies the minimum value allowed for the validated value. */
        min?: Date | number;
        /** Indicates whether the rule should be always checked for the target value or only when the target value changes. */
        reevaluate?: boolean;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule that demands the target value length be within the specified value range (including the range's end points). */
    export interface StringLengthRule {
        /** Specifies the maximum length allowed for the validated value. */
        max?: number;
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Specifies the minimum length allowed for the validated value. */
        min?: number;
        /** Indicates whether or not to remove the Space characters from the validated value. */
        trim?: boolean;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule with custom validation logic. */
    export interface CustomRule {
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Indicates whether the rule should be always checked for the target value or only when the target value changes. */
        reevaluate?: boolean;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
        /** A function that validates the target value. */
        validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any }) => boolean);
    }
    /** A validation rule that demands that a validated editor has a value that is equal to a specified expression. */
    export interface CompareRule {
        /** Specifies the function whose return value is used for comparison with the validated value. */
        comparisonTarget?: (() => any);
        /** Specifies the operator to be used for comparing the validated value with the target. */
        comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Indicates whether or not the rule should be always checked for the target value or only when the target value changes. */
        reevaluate?: boolean;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule that demands that the validated field match a specified pattern. */
    export interface PatternRule {
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Specifies the regular expression that the validated value must match. */
        pattern?: RegExp | string;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A validation rule that demands that the validated field match the Email pattern. */
    export interface EmailRule {
        /** Specifies the message that is shown for end-users if the current rule is broken. */
        message?: string;
        /** Specifies the type of the current rule. */
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email';
    }
    /** A group validation result. */
    export interface dxValidationGroupResult {
        /** Rules that failed to pass the check. */
        brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>;
        /** Indicates whether all the rules checked for the group are satisfied. */
        isValid?: boolean;
        /** Validator widgets included in the validated group. */
        validators?: Array<any>;
    }
    /** A validation result. */
    export interface dxValidatorResult {
        /** A rule that failed to pass the check. */
        brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule;
        /** Indicates whether all the checked rules are satisfied. */
        isValid?: boolean;
        /** Validation rules specified for the Validator. */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>;
        /** The value being validated. */
        value?: any;
    }
    export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
    }
    /** The ValidationGroup is a widget that allows you to validate several editors simultaneously. */
    export class dxValidationGroup extends DOMComponent {
        constructor(element: Element, options?: dxValidationGroupOptions)
        constructor(element: JQuery, options?: dxValidationGroupOptions)
        /** Resets the value and validation result of the editors that are included to the current validation group. */
        reset(): void;
        /** Validates rules of the validators that belong to the current validation group. */
        validate(): dxValidationGroupResult;
    }
    export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
        /** Specifies the validation group for which summary should be generated. */
        validationGroup?: string;
    }
    /** A widget for displaying the result of checking validation rules for editors. */
    export class dxValidationSummary extends CollectionWidget {
        constructor(element: Element, options?: dxValidationSummaryOptions)
        constructor(element: JQuery, options?: dxValidationSummaryOptions)
    }
    export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
        /** An object that specifies what and when to validate, and how to apply the validation result. */
        adapter?: { getValue?: Function, validationRequestsCallbacks?: Array<Function> | JQueryCallback, applyValidationResults?: Function, reset?: Function, focus?: Function, bypass?: Function };
        /** Specifies the editor name to be used in the validation default messages. */
        name?: string;
        /** A handler for the validated event. */
        onValidated?: ((validatedInfo: { name?: string, isValid?: boolean, value?: any, validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>, brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule }) => any);
        /** Specifies the validation group the editor will be related to. */
        validationGroup?: string;
        /** An array of validation rules to be checked for the editor with which the dxValidator object is associated. */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>;
    }
    /** A widget that is used to validate the associated DevExtreme editors against the defined validation rules. */
    export class dxValidator extends DOMComponent {
        constructor(element: Element, options?: dxValidatorOptions)
        constructor(element: JQuery, options?: dxValidatorOptions)
        /** Sets focus to the editor associated with the current Validator object. */
        focus(): void;
        /** Resets the value and validation result of the editor associated with the current Validator object. */
        reset(): void;
        /** Validates the value of the editor that is controlled by the current Validator object against the list of the specified validation rules. */
        validate(): dxValidatorResult;
    }
    /** This section lists the fields that are used in a default template for calendar cells. */
    export interface dxCalendarCellTemplate {
        /** The Date object associated with the cell. */
        date?: Date;
        /** The text displayed by the cell. */
        text?: string;
        /** The current view's name. */
        view?: 'month' | 'year' | 'decade' | 'century';
    }
    export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
        /** A data source used to fetch data to be displayed by the widget. */
        dataSource?: string | Array<string | CollectionWidgetItemTemplate> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** The time period in milliseconds before the onItemHold event is raised. */
        itemHoldTimeout?: number;
        /** An array of items displayed by the widget. */
        items?: Array<string | any>;
        /** Specifies a custom template for items. */
        itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies which data field provides keys for widget items. */
        keyExpr?: string | Function;
        /** The text or HTML markup displayed by the widget if the item collection is empty. */
        noDataText?: string;
        /** A handler for the itemClick event. */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
        /** A handler for the itemContextMenu event. */
        onItemContextMenu?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the itemHold event. */
        onItemHold?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any);
        /** A handler for the itemRendered event. */
        onItemRendered?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: DevExpress.core.dxElement, itemIndex?: number }) => any);
        /** A handler for the selectionChanged event. Raised after an item is selected or unselected. */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
        /** The index of the currently selected widget item. */
        selectedIndex?: number;
        /** The selected item object. */
        selectedItem?: any;
        /** Specifies an array of currently selected item keys. */
        selectedItemKeys?: Array<any>;
        /** An array of currently selected item objects. */
        selectedItems?: Array<any>;
    }
    /** The base class for widgets containing an item collection. */
    export class CollectionWidget extends Widget {
        constructor(element: Element, options?: CollectionWidgetOptions)
        constructor(element: JQuery, options?: CollectionWidgetOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface CollectionWidgetItemTemplate {
        /** Specifies whether or not a widget item must be displayed disabled. */
        disabled?: boolean;
        /** Specifies html code inserted into the widget item element. */
        html?: string;
        /** Specifies an item template that should be used to render this item only. */
        template?: template | (() => string | Element | JQuery);
        /** Specifies text displayed for the widget item. */
        text?: string;
        /** Specifies whether or not a widget item must be displayed. */
        visible?: boolean;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface dxContextMenuItemTemplate extends dxMenuBaseItemTemplate {
        /** Holds an array of menu items. */
        items?: Array<dxContextMenuItemTemplate>;
    }
    export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: { show?: animationConfig, hide?: animationConfig };
        /** Specifies the name of the CSS class to be applied to the root menu level and all submenus. */
        cssClass?: string;
        /** Holds an array of menu items. */
        items?: Array<dxMenuBaseItemTemplate>;
        /** Specifies whether or not an item becomes selected if a user clicks it. */
        selectByClick?: boolean;
        /** Specifies the selection mode supported by the menu. */
        selectionMode?: 'none' | 'single';
        /** Specifies options of submenu showing and hiding. */
        showSubmenuMode?: { name?: 'onClick' | 'onHover', delay?: { show?: number, hide?: number } | number } | 'onClick' | 'onHover';
    }
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: Element, options?: dxMenuBaseOptions)
        constructor(element: JQuery, options?: dxMenuBaseOptions)
        /** Selects an item found using its DOM node. */
        selectItem(itemElement: Element): void;
        /** Cancels the selection of an item found using its DOM node. */
        unselectItem(itemElement: Element): void;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface dxMenuBaseItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies whether a group separator is displayed over the item. */
        beginGroup?: boolean;
        /** Specifies if a menu is closed when a user clicks the item. */
        closeMenuOnClick?: boolean;
        /** Specifies whether or not the menu item is disabled. */
        disabled?: boolean;
        /** The name of an icon to be displayed on the menu item. */
        icon?: string;
        /** Holds an array of menu items. */
        items?: Array<dxMenuBaseItemTemplate>;
        /** Specifies whether or not a user can select a menu item. */
        selectable?: boolean;
        /** Specifies whether or not the item is selected. */
        selected?: boolean;
        /** Specifies the text inserted into the item element. */
        text?: string;
        /** Specifies whether or not the menu item is visible. */
        visible?: boolean;
    }
    export interface dxDataGridColumn extends GridBaseColumn {
        /** Specifies whether data from this column should be exported. */
        allowExporting?: boolean;
        /** Specifies whether the user can group data by values of this column. Applies only when grouping is enabled. */
        allowGrouping?: boolean;
        /** Specifies whether groups appear expanded or not when records are grouped by a specific column. Setting this option makes sense only when grouping is allowed for this column. */
        autoExpandGroup?: boolean;
        /** Specifies a field name or a function that returns a field name or a value to be used for grouping column cells. */
        calculateGroupValue?: string | ((rowData: any) => any);
        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;
        /** Specifies a custom template for group cells. */
        groupCellTemplate?: template | ((cellElement: DevExpress.core.dxElement, cellInfo: any) => any);
        /** Specifies the index of a column when grid records are grouped by the values of this column. */
        groupIndex?: number;
        /** Specifies whether or not to display the column when grid records are grouped by it. */
        showWhenGrouped?: boolean;
    }
    export interface dxDropDownEditorOptions<T = dxDropDownEditor> extends dxTextBoxOptions<T> {
        /** Specifies whether or not the widget allows an end-user to enter a custom value. */
        acceptCustomValue?: boolean;
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies the way an end-user applies the selected value. */
        applyValueMode?: 'instantly' | 'useButtons';
        /** Specifies whether to render the drop-down field's content when it is displayed. If false, the content is rendered immediately. */
        deferRendering?: boolean;
        /** Specifies a custom template for the drop-down button. */
        dropDownButtonTemplate?: template | ((buttonData: { text?: string, icon?: string }, contentElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** A handler for the closed event. */
        onClosed?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the opened event. */
        onOpened?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies whether or not the drop-down editor is displayed. */
        opened?: boolean;
        /** Specifies the currently selected value. */
        value?: any;
    }
    /** A drop-down editor widget. */
    export class dxDropDownEditor extends dxTextBox {
        constructor(element: Element, options?: dxDropDownEditorOptions)
        constructor(element: JQuery, options?: dxDropDownEditorOptions)
        /** Closes the drop-down editor. */
        close(): void;
        /** Gets the popup window's content. */
        content(): DevExpress.core.dxElement;
        /** Gets the widget's `` element. */
        field(): DevExpress.core.dxElement;
        /** Opens the drop-down editor. */
        open(): void;
        /** Resets the value option to the default value. */
        reset(): void;
    }
    export interface dxDropDownListOptions<T = dxDropDownList> extends DataExpressionMixinOptions<T>, dxDropDownEditorOptions<T> {
        /** Returns the value currently displayed by the widget. */
        displayValue?: string;
        /** Specifies whether data items should be grouped. */
        grouped?: boolean;
        /** Specifies a custom template for group captions. */
        groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** The minimum number of characters that must be entered into the text box to begin a search. Applies only if searchEnabled is true. */
        minSearchLength?: number;
        /** The text or HTML markup displayed by the widget if the item collection is empty. */
        noDataText?: string;
        /** A handler for the itemClick event. */
        onItemClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, itemData?: any, itemElement?: any, itemIndex?: number | any }) => any);
        /** A handler for the selectionChanged event. */
        onSelectionChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, selectedItem?: any }) => any);
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** Specifies whether to allow searching. */
        searchEnabled?: boolean;
        /** Specifies the name of a data source item field or an expression whose value is compared to the search criterion. */
        searchExpr?: string | Function | Array<string | Function>;
        /** Specifies a comparison operation used to search widget items. */
        searchMode?: 'contains' | 'startswith';
        /** Specifies the time delay, in milliseconds, after the last character has been typed in, before a search is executed. */
        searchTimeout?: number;
        /** Gets the currently selected item. */
        selectedItem?: any;
        /** Specifies whether or not the widget displays unfiltered values until a user types a number of characters exceeding the minSearchLength option value. */
        showDataBeforeSearch?: boolean;
        /** Specifies the currently selected value. May be an object if dataSource contains objects and valueExpr is not set. */
        value?: any;
        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;
    }
    /** A base class for drop-down list widgets. */
    export class dxDropDownList extends dxDropDownEditor {
        constructor(element: Element, options?: dxDropDownListOptions)
        constructor(element: JQuery, options?: dxDropDownListOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
        /** Specifies whether the editor's value is valid. */
        isValid?: boolean;
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, value?: any, previousValue?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A Boolean value specifying whether or not the widget is read-only. */
        readOnly?: boolean;
        /** Specifies information on the validation error when using a custom validation engine. Should be changed at runtime along with the isValid option. */
        validationError?: any;
        /** Specifies how the message about the validation rules that are not satisfied by this editor's value is displayed. */
        validationMessageMode?: 'always' | 'auto';
        /** Specifies the currently selected value. */
        value?: any;
    }
    /** A base class for editors. */
    export class Editor extends Widget {
        constructor(element: Element, options?: EditorOptions)
        constructor(element: JQuery, options?: EditorOptions)
        /** Resets the value option to the default value. */
        reset(): void;
    }
    export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
        /** A data source used to fetch data the widget should display. */
        dataSource?: string | Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions;
        /** Specifies the name of the data source item field whose value is displayed by the widget. */
        displayExpr?: string | Function;
        /** An array of items displayed by the widget. */
        items?: Array<any>;
        /** Specifies a custom template for items. */
        itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the currently selected value. May be an object if dataSource contains objects and valueExpr is not set. */
        value?: any;
        /** Specifies which data field provides the widget's value. When this option is not set, the value is the entire data object. */
        valueExpr?: string | Function;
    }
    export class DataExpressionMixin {
        constructor(options?: DataExpressionMixinOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface DataExpressionMixinItemTemplate {
        /** Specifies whether or not a widget item must be displayed disabled. */
        disabled?: boolean;
        /** Specifies html code inserted into the widget item element. */
        html?: string;
        /** Specifies an item template that should be used to render this item only. */
        template?: template;
        /** Specifies text displayed for the widget item. */
        text?: string;
        /** Specifies whether or not a widget item must be displayed. */
        visible?: boolean;
    }
    /** The FilterBuilder's field structure. */
    export interface dxFilterBuilderField {
        /** Specifies the field's custom filtering rules. */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
        /** Specifies the data field's caption. */
        caption?: string;
        /** Customizes the input value's display text. */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string }) => string);
        /** Specifies the name of a field to be filtered. */
        dataField?: string;
        /** Casts field values to a specific data type. */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /** Configures the widget used to edit the field value. */
        editorOptions?: any;
        /** Specifies the editor's custom template. */
        editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies the false value text. Applies only if dataType is "boolean". */
        falseText?: string;
        /** Specifies a set of available filter operations. */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
        /** Formats a value before it is displayed. */
        format?: format;
        /** Configures the lookup field. */
        lookup?: { dataSource?: Array<any> | DevExpress.data.DataSourceOptions, valueExpr?: string | Function, displayExpr?: string | ((data: any) => any), allowClearing?: boolean };
        /** Specifies the true value text. Applies only if dataType is "boolean". */
        trueText?: string;
    }
    export interface dxFilterBuilderCustomOperation {
        /** Specifies a function that returns a filter expression for this custom operation. */
        calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
        /** Specifies the operation's caption. */
        caption?: string;
        /** Customizes the field value's text representation. */
        customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string, field?: dxFilterBuilderField }) => string);
        /** Specifies for which data types the operation is available by default. */
        dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
        /** Specifies a custom template for the widget used to edit the field value. */
        editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether the operation can have a value. If it can, the editor is displayed. */
        hasValue?: boolean;
        /** Specifies an icon that represents the operation. Accepts the name of an icon from the built-in icon library, a path to an image, or the CSS class of an icon stored in an external icon library. */
        icon?: string;
        /** Specifies the operation's identifier. */
        name?: string;
    }
    /** Specifies dependency between the screen factor and the count of columns. */
    export interface ColCountResponsible {
        /** The count of columns for a large screen size. */
        lg?: number;
        /** The count of columns for a middle-sized screen. */
        md?: number;
        /** The count of columns for a small-sized screen. */
        sm?: number;
        /** The count of columns for an extra small-sized screen. */
        xs?: number;
    }
    /** This article describes configuration options of a simple form item. */
    export interface dxFormSimpleItem {
        /** Specifies the number of columns spanned by the item. */
        colSpan?: number;
        /** Specifies a CSS class to be applied to the form item. */
        cssClass?: string;
        /** Specifies the path to the formData object field bound to the current form item. */
        dataField?: string;
        /** Specifies configuration options for the editor widget of the current form item. */
        editorOptions?: any;
        /** Specifies which editor widget is used to display and edit the form item value. */
        editorType?: 'dxAutocomplete' | 'dxCalendar' | 'dxCheckBox' | 'dxColorBox' | 'dxDateBox' | 'dxDropDownBox' | 'dxLookup' | 'dxNumberBox' | 'dxRadioGroup' | 'dxRangeSlider' | 'dxSelectBox' | 'dxSlider' | 'dxSwitch' | 'dxTagBox' | 'dxTextArea' | 'dxTextBox';
        /** Specifies the help text displayed for the current form item. */
        helpText?: string;
        /** Specifies whether the current form item is required. */
        isRequired?: boolean;
        /** Specifies the item's type. Set it to "simple" to create a simple item. */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** Specifies options for the form item label. */
        label?: { text?: string, visible?: boolean, showColon?: boolean, location?: 'left' | 'right' | 'top', alignment?: 'center' | 'left' | 'right' };
        /** Specifies a name that identifies the form item. */
        name?: string;
        /** A template to be used for rendering the form item. */
        template?: template | ((data: { component?: dxForm, dataField?: string, editorOptions?: any, editorType?: string }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** An array of validation rules to be checked for the form item editor. */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>;
        /** Specifies whether or not the current form item is visible. */
        visible?: boolean;
        /** Specifies the sequence number of the item in a form, group or tab. */
        visibleIndex?: number;
    }
    /** This article describes configuration options of a group form item. */
    export interface dxFormGroupItem {
        /** Specifies whether or not all group item labels are aligned. */
        alignItemLabels?: boolean;
        /** Specifies the group caption. */
        caption?: string;
        /** The count of columns in the group layout. */
        colCount?: number;
        /** Specifies dependency between the screen factor and the count of columns in the group layout. */
        colCountByScreen?: any;
        /** Specifies the number of columns spanned by the item. */
        colSpan?: number;
        /** Specifies a CSS class to be applied to the form item. */
        cssClass?: string;
        /** Holds an array of form items displayed within the group. */
        items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>;
        /** Specifies the item's type. Set it to "group" to create a group item. */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** Specifies a name that identifies the form item. */
        name?: string;
        /** A template to be used for rendering a group item. */
        template?: template | ((data: { component?: dxForm, formData?: any }, itemElement: DevExpress.core.dxElement) => string | Element | JQuery);
        /** Specifies whether or not the current form item is visible. */
        visible?: boolean;
        /** Specifies the sequence number of the item in a form, group or tab. */
        visibleIndex?: number;
    }
    /** This article describes configuration options of a tabbed form item. */
    export interface dxFormTabbedItem {
        /** Specifies the number of columns spanned by the item. */
        colSpan?: number;
        /** Specifies a CSS class to be applied to the form item. */
        cssClass?: string;
        /** Specifies the item's type. Set it to "tabbed" to create a tabbed item. */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** Specifies a name that identifies the form item. */
        name?: string;
        /** Holds a configuration object for the TabPanel widget used to display the current form item. */
        tabPanelOptions?: dxTabPanelOptions;
        /** An array of tab configuration objects. */
        tabs?: Array<{ alignItemLabels?: boolean, title?: string, colCount?: number, colCountByScreen?: any, items?: Array<dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem>, badge?: string, disabled?: boolean, icon?: string, tabTemplate?: template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any), template?: template | ((tabData: any, tabIndex: number, tabElement: DevExpress.core.dxElement) => any) }>;
        /** Specifies whether or not the current form item is visible. */
        visible?: boolean;
        /** Specifies the sequence number of the item in a form, group or tab. */
        visibleIndex?: number;
    }
    /** This article describes configuration options of an empty form item. */
    export interface dxFormEmptyItem {
        /** Specifies the number of columns spanned by the item. */
        colSpan?: number;
        /** Specifies a CSS class to be applied to the form item. */
        cssClass?: string;
        /** Specifies the item's type. Set it to "empty" to create an empty item. */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** Specifies a name that identifies the form item. */
        name?: string;
        /** Specifies whether or not the current form item is visible. */
        visible?: boolean;
        /** Specifies the sequence number of the item in a form, group or tab. */
        visibleIndex?: number;
    }
    /** Configures a button form item. */
    export interface dxFormButtonItem {
        /** @deprecated Use horizontalAlignment instead. */
        alignment?: 'center' | 'left' | 'right';
        /** Configures the button. */
        buttonOptions?: dxButtonOptions;
        /** Specifies how many columns the item spans. */
        colSpan?: number;
        /** Specifies a CSS class to be applied to the item. */
        cssClass?: string;
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Specifies the item's type. Set it to "button" to create a button item. */
        itemType?: 'empty' | 'group' | 'simple' | 'tabbed' | 'button';
        /** Specifies the item's identifier. */
        name?: string;
        verticalAlignment?: 'bottom' | 'center' | 'top';
        /** Specifies whether the item is visible. */
        visible?: boolean;
        /** Specifies the item's position regarding other items in a group, tab, or the whole widget. */
        visibleIndex?: number;
    }
    export interface GridBaseColumn {
        /** Aligns the content of the column. */
        alignment?: undefined | 'center' | 'left' | 'right';
        /** Specifies whether a user can edit values in the column at runtime. By default, inherits the value of the editing.allowUpdating option. */
        allowEditing?: boolean;
        /** Specifies whether data can be filtered by this column. Applies only if filterRow.visible is true. */
        allowFiltering?: boolean;
        /** Specifies whether a user can fix the column at runtime. Applies only if columnFixing.enabled is true. */
        allowFixing?: boolean;
        /** Specifies whether the header filter can be used to filter data by this column. Applies only if headerFilter.visible is true. By default, inherits the value of the allowFiltering option. */
        allowHeaderFiltering?: boolean;
        /** Specifies whether a user can hide the column using the column chooser at runtime. Applies only if columnChooser.enabled is true. */
        allowHiding?: boolean;
        /** Specifies whether this column can be used in column reordering at runtime. Applies only if allowColumnReordering is true. */
        allowReordering?: boolean;
        /** Specifies whether a user can resize the column at runtime. Applies only if allowColumnResizing is true. */
        allowResizing?: boolean;
        /** Specifies whether this column can be searched. Applies only if searchPanel.visible is true. Inherits the value of the allowFiltering option by default. */
        allowSearch?: boolean;
        /** Specifies whether a user can sort rows by this column at runtime. Applies only if sorting.mode differs from "none". */
        allowSorting?: boolean;
        /** Calculates custom values for column cells. */
        calculateCellValue?: ((rowData: any) => any);
        /** Calculates custom display values for column cells. Used when display values should differ from values for editing. */
        calculateDisplayValue?: string | ((rowData: any) => any);
        /** Specifies the column's custom filtering rules. */
        calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
        /** Calculates custom values to be used in sorting. */
        calculateSortValue?: string | ((rowData: any) => any);
        /** Specifies a caption for the column. */
        caption?: string;
        /** Specifies a custom template for column cells. */
        cellTemplate?: template | ((cellElement: DevExpress.core.dxElement, cellInfo: any) => any);
        /** Specifies a CSS class to be applied to the column. */
        cssClass?: string;
        /** Customizes the text displayed in column cells. */
        customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string, target?: string, groupInterval?: string | number }) => string);
        /** Binds the column to a field of the dataSource. */
        dataField?: string;
        /** Casts column values to a specific data type. */
        dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
        /** Specifies a custom template for column cells in the editing state. */
        editCellTemplate?: template | ((cellElement: DevExpress.core.dxElement, cellInfo: any) => any);
        /** Specifies options for the underlain editor. */
        editorOptions?: any;
        /** Specifies whether HTML tags are displayed as plain text or applied to the values of the column. */
        encodeHtml?: boolean;
        /** In a boolean column, replaces all false items with a specified text. Applies only if showEditorAlways option is false. */
        falseText?: string;
        /** Specifies a set of available filter operations. Applies only if filterRow.visible and allowFiltering are true. */
        filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'notcontains' | 'contains' | 'startswith' | 'endswith' | 'between'>;
        /** Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values. Applies only if headerFilter.visible and allowHeaderFiltering are true. */
        filterType?: 'exclude' | 'include';
        /** Specifies a filter value for the column. */
        filterValue?: any;
        /** Specifies filter values for the column's header filter. */
        filterValues?: Array<any>;
        /** Fixes the column. */
        fixed?: boolean;
        /** Specifies the widget's edge to which the column is fixed. Applies only if columns].[fixed is true. */
        fixedPosition?: 'left' | 'right';
        /** Formats a value before it is displayed in a column cell. */
        format?: format;
        /** Configures the form item produced by this column in the editing state. Used only if editing.mode is "form" or "popup". */
        formItem?: dxFormSimpleItem;
        /** Specifies a custom template for column headers. */
        headerCellTemplate?: template | ((columnHeader: DevExpress.core.dxElement, headerInfo: any) => any);
        /** Specifies data settings for the header filter. */
        headerFilter?: { dataSource?: Array<any> | ((options: { component?: any, dataSource?: DevExpress.data.DataSourceOptions }) => any) | DevExpress.data.DataSourceOptions, groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number, allowSearch?: boolean, searchMode?: 'contains' | 'startswith' | 'equals', width?: number, height?: number };
        /** Specifies the order in which columns are hidden when the widget adapts to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is "widget". */
        hidingPriority?: number;
        /** Specifies whether the column bands other columns or not. */
        isBand?: boolean;
        /** Specifies options of a lookup column. */
        lookup?: { dataSource?: Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store | ((options: { data?: any, key?: any }) => Array<any> | DevExpress.data.DataSourceOptions | DevExpress.data.Store), valueExpr?: string, displayExpr?: string | ((data: any) => any), allowClearing?: boolean };
        /** Specifies the minimum width of the column. */
        minWidth?: number;
        /** Specifies the identifier of the column. */
        name?: string;
        /** Specifies the band column that owns the current column. Accepts the index of the band column in the columns array. */
        ownerBand?: number;
        /** Specifies the selected filter operation for the column. */
        selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
        /** Specifies a function to be invoked after the user has edited a cell value, but before it will be saved in the data source. */
        setCellValue?: ((newData: any, value: any, currentRowData: any) => any);
        /** Specifies whether the column displays its values using editors. */
        showEditorAlways?: boolean;
        /** Specifies whether the column chooser can contain the column header. */
        showInColumnChooser?: boolean;
        /** Specifies the index according to which columns participate in sorting. */
        sortIndex?: number;
        /** Specifies a custom comparison function for sorting. Applies only when sorting is performed on the client. */
        sortingMethod?: ((value1: any, value2: any) => number);
        /** Specifies the sort order of column values. */
        sortOrder?: undefined | 'asc' | 'desc';
        /** In a boolean column, replaces all true items with a specified text. Applies only if showEditorAlways option is false. */
        trueText?: string;
        /** Specifies validation rules to be checked on updating cell values. */
        validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule>;
        /** Specifies whether the column is visible, that is, occupies space in the table. */
        visible?: boolean;
        /** Specifies the position of the column regarding other columns in the resulting widget. */
        visibleIndex?: number;
        /** Specifies the column's width in pixels or as a percentage. Ignored if it is less than minWidth. */
        width?: number | string;
    }
    export interface dxTreeListColumn extends GridBaseColumn {
        /** Configures columns. */
        columns?: Array<dxTreeListColumn>;
    }
    /** This section describes the properties of a grid row. An object containing these properties comes to certain event-handling functions. */
    export interface dxDataGridRowObject {
        /** The data object represented by the row. */
        data?: any;
        /** The group index of the row. Available when the rowType is "group". */
        groupIndex?: number;
        /** Indicates whether the row is in the editing state. */
        isEditing?: boolean;
        /** Indicates whether the row is expanded or collapsed. Available if rowType is "data", "detail" or "group". */
        isExpanded?: boolean;
        /** Indicates whether the row is selected. Available if rowType is "data". */
        isSelected?: boolean;
        /** The key of the data object represented by the row. */
        key?: any;
        /** The visible index of the row. */
        rowIndex?: number;
        /** The type of the row. */
        rowType?: string;
        /** Values of the row as they exist in the data source. */
        values?: Array<any>;
    }
    /** The TreeList row object's structure. */
    export interface dxTreeListRowObject {
        /** Indicates whether the row is in the editing state. */
        isEditing?: boolean;
        /** Indicates whether the row is expanded or collapsed. Available if rowType is "data" or "detail". */
        isExpanded?: boolean;
        /** Indicates whether the row is selected. Available if rowType is "data" or "detail". */
        isSelected?: boolean;
        /** The row data object's key. Available if rowType is "data", "detail" or "detailAdaptive". */
        key?: any;
        /** The row's hierarchical level. Available if rowType is "data" or "detail". */
        level?: number;
        /** The row's node. Available if rowType is "data" or "detail". */
        node?: dxTreeListNode;
        /** The row's visible index. This index is zero-based and available if rowType is "data", "detail" or "detailAdaptive". */
        rowIndex?: number;
        /** The row's type. */
        rowType?: string;
        /** Values displayed in the row's cells. */
        values?: Array<any>;
    }
    export interface HierarchicalCollectionWidgetOptions<T = HierarchicalCollectionWidget> extends CollectionWidgetOptions<T> {
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget item is disabled. */
        disabledExpr?: string | Function;
        /** Specifies the name of the data source item field whose value is displayed by the widget. */
        displayExpr?: string | Function;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies which data field contains nested items. */
        itemsExpr?: string | Function;
        /** Specifies which data field provides keys for TreeView items. */
        keyExpr?: string | Function;
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget items is selected. */
        selectedExpr?: string | Function;
    }
    export class HierarchicalCollectionWidget extends CollectionWidget {
        constructor(element: Element, options?: HierarchicalCollectionWidgetOptions)
        constructor(element: JQuery, options?: HierarchicalCollectionWidgetOptions)
    }
    /** This section lists the data source fields that are used in a default template for list items. */
    export interface dxListItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies the text of a badge displayed for the list item. */
        badge?: string;
        /** Specifies the name of the list items group in a grouped list. */
        key?: string;
        /** Specifies whether or not to display a chevron for the list item. */
        showChevron?: boolean;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface dxMenuItemTemplate extends dxMenuBaseItemTemplate {
        /** Holds an array of menu items. */
        items?: Array<dxMenuItemTemplate>;
    }
    /** An object containing information about the pivot grid cell. */
    export interface dxPivotGridPivotGridCell {
        /** The cell's column path. Available for data area cells only. */
        columnPath?: Array<string | number | Date>;
        /** The type of the column to which the cell belongs. Available for data area cells only. */
        columnType?: 'D' | 'T' | 'GT';
        /** The data field's index. Available for data area cells only. */
        dataIndex?: number;
        /** Indicates whether the cell is expanded. Available for row or column area cells only. */
        expanded?: boolean;
        /** The path to the row/column cell. Available for row or column area cells only. */
        path?: Array<string | number | Date>;
        /** The cell's row path. Available for data area cells only. */
        rowPath?: Array<string | number | Date>;
        /** The type of the row to which the cell belongs. Available for data area cells only. */
        rowType?: 'D' | 'T' | 'GT';
        /** The text displayed in the cell. */
        text?: string;
        /** The cell's type. Available for row or column area cells only. */
        type?: 'D' | 'T' | 'GT';
        /** The cell's value. */
        value?: any;
    }
    /** An object exposing methods that manipulate a summary cell and provide access to its neighboring cells. */
    export class dxPivotGridSummaryCell {
        /** Gets the child cell in a specified direction. */
        child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
        /** Gets all child cells in a specified direction. */
        children(direction: string): Array<dxPivotGridSummaryCell>;
        /** Gets the row or column field to which the current cell belongs. */
        field(area: string): DevExpress.data.PivotGridDataSourceField;
        /** Gets the Grand Total of the entire pivot grid. */
        grandTotal(): dxPivotGridSummaryCell;
        /** Gets a partial Grand Total cell of a row or column. */
        grandTotal(direction: string): dxPivotGridSummaryCell;
        /** Gets the cell next to the current one in a specified direction. */
        next(direction: string): dxPivotGridSummaryCell;
        /** Gets the cell next to current in a specified direction. */
        next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /** Gets the parent cell in a specified direction. */
        parent(direction: string): dxPivotGridSummaryCell;
        /** Gets the cell prior to the current one in a specified direction. */
        prev(direction: string): dxPivotGridSummaryCell;
        /** Gets the cell previous to current in a specified direction. */
        prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
        /** Gets the cell located by the path of the source cell with one field value changed. */
        slice(field: DevExpress.data.PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
        /** Gets the value of the current cell. */
        value(): any;
        /** Gets the value of any field linked with the current cell. */
        value(field: DevExpress.data.PivotGridDataSourceField): any;
        /** Gets the value of any field linked with the current cell. */
        value(field: DevExpress.data.PivotGridDataSourceField, isCalculatedValue: boolean): any;
        /** Gets the value of the current cell. */
        value(isCalculatedValue: boolean): any;
    }
    /** This section lists the fields that are used in a default template for scheduler appointments. */
    export interface dxSchedulerAppointmentTemplate extends CollectionWidgetItemTemplate {
        /** Specifies whether the appointment lasts all day. */
        allDay?: boolean;
        /** Specifies a detail description of the appointment. */
        description?: string;
        /** Specifies whether or not an appointment must be displayed disabled. */
        disabled?: boolean;
        /** Specifies the ending of the appointment. */
        endDate?: Date;
        /** Specifies the timezone of the appointment end date. Applies only if timeZone is not specified. */
        endDateTimeZone?: string;
        /** Specifies HTML code inserted into the appointment element. */
        html?: string;
        /** Specifies exceptions for the current recurring appointment. */
        recurrenceException?: string;
        /** Specifies a recurrence rule for generating recurring appointments in the scheduler. */
        recurrenceRule?: string;
        /** Specifies the start of the appointment. */
        startDate?: Date;
        /** Specifies the timezone of the appointment start date. Applies only if timeZone is not specified. */
        startDateTimeZone?: string;
        /** Specifies an appointment template that should be used to render this appointment only. */
        template?: template;
        /** Specifies the subject of the appointment. */
        text?: string;
        /** Specifies whether or not an appointment must be displayed. */
        visible?: boolean;
    }
    /** This section lists the fields that are used in a default template for scheduler appointment tooltips. */
    export interface dxSchedulerAppointmentTooltipTemplate {
        /** Specifies whether or not the current appointment is an all-day appointment. */
        allDay?: boolean;
        /** Specifies the appointment description. */
        description?: string;
        /** Specifies the ending of the appointment. */
        endDate?: Date;
        /** Specifies the timezone of the appointment end date. */
        endDateTimeZone?: string;
        /** Specifies exceptions for a the current recurring appointment. */
        recurrenceException?: string;
        /** Specifies a recurrence rule for generating recurring appointments in the scheduler. */
        recurrenceRule?: string;
        /** Specifies the start of the appointment. */
        startDate?: Date;
        /** Specifies the timezone of the appointment start date. */
        startDateTimeZone?: string;
        /** Specifies the subject of the appointment. */
        text?: string;
    }
    export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
        /** A Boolean value specifying whether to enable or disable the bounce-back effect. */
        bounceEnabled?: boolean;
        /** A string value specifying the available scrolling directions. */
        direction?: 'both' | 'horizontal' | 'vertical';
        /** A Boolean value specifying whether or not the widget can respond to user interaction. */
        disabled?: boolean;
        /** A handler for the scroll event. */
        onScroll?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** A handler for the update event. */
        onUpdated?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
        /** A Boolean value specifying whether or not an end-user can scroll the widget content swiping it up or down. Applies only if useNative is false */
        scrollByContent?: boolean;
        /** A Boolean value specifying whether or not an end-user can scroll the widget content using the scrollbar. */
        scrollByThumb?: boolean;
        /** Specifies when the widget shows the scrollbar. */
        showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
        /** Indicates whether to use native or simulated scrolling. */
        useNative?: boolean;
    }
    /** A widget used to display scrollable content. */
    export class dxScrollable extends DOMComponent {
        constructor(element: Element, options?: dxScrollableOptions)
        constructor(element: JQuery, options?: dxScrollableOptions)
        /** Gets the widget's height. */
        clientHeight(): number;
        /** Gets the widget's width. */
        clientWidth(): number;
        /** Gets the widget's content. */
        content(): DevExpress.core.dxElement;
        /** Scrolls the content by a specific distance. */
        scrollBy(distance: number): void;
        /** Scrolls the content by a specific distance in horizontal and vertical directions. */
        scrollBy(distanceObject: any): void;
        /** Gets the scrollable content's height in pixels. */
        scrollHeight(): number;
        /** Gets the left scroll offset. */
        scrollLeft(): number;
        /** Gets the scroll offset. */
        scrollOffset(): any;
        /** Scrolls the content to a specific position. */
        scrollTo(targetLocation: number): void;
        /** Scrolls the content to a specific position. */
        scrollTo(targetLocation: any): void;
        /** Scrolls the content to an element. */
        scrollToElement(element: Element | JQuery): void;
        /** Gets the top scroll offset. */
        scrollTop(): number;
        /** Gets the scrollable content's width in pixels. */
        scrollWidth(): number;
        /** Updates the scrollable contents' dimensions. */
        update(): Promise<void> & JQueryPromise<void>;
    }
    export interface dxSliderBaseOptions<T = dxSliderBase> extends dxTrackBarOptions<T> {
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies the step by which a handle moves when a user presses Page Up or Page Down. */
        keyStep?: number;
        /** Configures the labels displayed at the min and max values. */
        label?: { visible?: boolean, position?: 'bottom' | 'top', format?: format };
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** Specifies whether to highlight the selected range. */
        showRange?: boolean;
        /** Specifies the step by which the widget's value changes when a user drags a handler. */
        step?: number;
        /** Configures a tooltip. */
        tooltip?: { enabled?: boolean, format?: format, position?: 'bottom' | 'top', showMode?: 'always' | 'onHover' };
    }
    export class dxSliderBase extends dxTrackBar {
        constructor(element: Element, options?: dxSliderBaseOptions)
        constructor(element: JQuery, options?: dxSliderBaseOptions)
    }
    export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** Specifies the attributes to be passed on to the underlying HTML element. */
        inputAttr?: any;
        /** The editor mask that specifies the format of the entered string. */
        mask?: string;
        /** Specifies a mask placeholder character. */
        maskChar?: string;
        /** A message displayed when the entered text does not match the specified pattern. */
        maskInvalidMessage?: string;
        /** Specifies custom mask rules. */
        maskRules?: any;
        /** The value to be assigned to the `name` attribute of the underlying HTML element. */
        name?: string;
        /** A handler for the change event. */
        onChange?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the copy event. */
        onCopy?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the cut event. */
        onCut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the enterKey event. */
        onEnterKey?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the focusIn event. */
        onFocusIn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the focusOut event. */
        onFocusOut?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the input event. */
        onInput?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the keyDown event. */
        onKeyDown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the keyPress event. */
        onKeyPress?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the keyUp event. */
        onKeyUp?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** A handler for the paste event. */
        onPaste?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any);
        /** The text displayed by the widget when the widget value is empty. */
        placeholder?: string;
        /** Specifies whether to display the Clear button in the widget. */
        showClearButton?: boolean;
        /** Specifies when the widget shows the mask. Applies only if useMaskedValue is true. */
        showMaskMode?: 'always' | 'onFocus';
        /** Specifies whether or not the widget checks the inner text for spelling mistakes. */
        spellcheck?: boolean;
        /** The read-only option that holds the text displayed by the widget input element. */
        text?: string;
        /** Specifies whether the value should contain mask characters or not. */
        useMaskedValue?: boolean;
        /** Specifies the current value displayed by the widget. */
        value?: any;
        /** Specifies DOM event names that update a widget's value. */
        valueChangeEvent?: string;
    }
    /** A base class for text editing widgets. */
    export class dxTextEditor extends Editor {
        constructor(element: Element, options?: dxTextEditorOptions)
        constructor(element: JQuery, options?: dxTextEditorOptions)
        /** Removes focus from the input element. */
        blur(): void;
        /** Sets focus to the input element representing the widget. */
        focus(): void;
    }
    /** A TreeList node's structure. */
    export interface dxTreeListNode {
        /** Contains all child nodes. */
        children?: Array<dxTreeListNode>;
        /** The node's data object. */
        data?: any;
        /** Indicates whether the node has child nodes. */
        hasChildren?: boolean;
        /** The node's key. */
        key?: any;
        /** The node's hierarchical level. */
        level?: number;
        /** The parent node. */
        parent?: dxTreeListNode;
        /** Indicates whether the node is visualized as a row. */
        visible?: boolean;
    }
    /** This section lists the data source fields that are used in a default item template. */
    export interface dxTreeViewItemTemplate extends CollectionWidgetItemTemplate {
        /** Specifies whether or not the tree view item is displayed expanded. */
        expanded?: boolean;
        /** Specifies whether or not the tree view item has children. */
        hasItems?: boolean;
        /** The name of an icon to be displayed on the tree view item. */
        icon?: string;
        /** Holds an array of tree view items. */
        items?: Array<dxTreeViewItemTemplate>;
        /** Holds the key of the parent item. */
        parentId?: number | string;
        /** Specifies whether or not the tree view item is displayed selected. */
        selected?: boolean;
    }
    /** A TreeView node. */
    export interface dxTreeViewNode {
        /** Contains all the child nodes of the current node. */
        children?: Array<dxTreeViewNode>;
        /** Equals to true if the node is disabled; otherwise false. */
        disabled?: boolean;
        /** Equals to true if the node is expanded; false if collapsed. */
        expanded?: boolean;
        /** Contains the data source object corresponding to the node. */
        itemData?: any;
        /** Contains the key value of the node. */
        key?: any;
        /** Refers to the parent node of the current node. */
        parent?: dxTreeViewNode;
        /** Equals to true if the node is selected; false if not. */
        selected?: boolean;
        /** Contains the text displayed by the node. */
        text?: string;
    }
    export interface SearchBoxMixinOptions<T = SearchBoxMixin> {
        /** Configures the search panel. */
        searchEditorOptions?: dxTextBoxOptions;
        /** Specifies whether the search panel is visible. */
        searchEnabled?: boolean;
        /** Specifies a data object's field name or an expression whose value is compared to the search string. */
        searchExpr?: string | Function | Array<string | Function>;
        /** Specifies a comparison operation used to search widget items. */
        searchMode?: 'contains' | 'startswith' | 'equals';
        /** Specifies a delay in milliseconds between when a user finishes typing, and the search is executed. */
        searchTimeout?: number;
        /** Specifies the current search string. */
        searchValue?: string;
    }
    export class SearchBoxMixin {
        constructor(options?: SearchBoxMixinOptions)
    }
    export interface dxTemplateOptions {
        /** Specifies the name of the template. */
        name?: string;
    }
    /** A custom template's markup. */
    export class dxTemplate {
        constructor(options?: dxTemplateOptions)
    }
    /** Specifies markup for a widget item. */
    export var dxItem: any;
    export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
        /** Specifies the shortcut key that sets focus on the widget. */
        accessKey?: string;
        /** Specifies whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;
        /** Specifies whether the widget responds to user interaction. */
        disabled?: boolean;
        /** Specifies whether the widget can be focused using keyboard navigation. */
        focusStateEnabled?: boolean;
        /** Specifies text for a hint that appears when a user pauses on the widget. */
        hint?: string;
        /** Specifies whether the widget changes its state when a user pauses on it. */
        hoverStateEnabled?: boolean;
        /** A handler for the contentReady event. Executed when the widget's content is ready. This handler may be executed multiple times during the widget's lifetime depending on the number of times its content changes. */
        onContentReady?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Specifies the number of the element when the Tab key is used for navigating. */
        tabIndex?: number;
        /** Specifies whether the widget is visible. */
        visible?: boolean;
    }
    /** The base class for widgets. */
    export class Widget extends DOMComponent {
        constructor(element: Element, options?: WidgetOptions)
        constructor(element: JQuery, options?: WidgetOptions)
        /** Sets focus on the widget. */
        focus(): void;
        /** Registers a handler to be executed when a user presses a specific key. */
        registerKeyHandler(key: string, handler: Function): void;
        /** Repaints the widget. Call it if you made modifications that changed the widget's state to invalid. */
        repaint(): void;
    }
    /** A template notation used to specify templates for widget elements. */
    export type template = string | Function | Element | JQuery; 
    /** Formats values. */
    export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | { type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime', precision?: number, currency?: string, formatter?: ((value: number | Date) => string), parser?: ((value: string) => number | Date) }; 
    /** An object that serves as a namespace for methods displaying a message in an application/site. */
    export class dialog {
        /** Creates an alert dialog message containing a single "OK" button. */
        static alert(message: string, title: string): Promise<void> & JQueryPromise<void>;
        /** Creates a confirm dialog that contains "Yes" and "No" buttons. */
        static confirm(message: string, title: string): Promise<boolean> & JQueryPromise<boolean>;
        /** Creates a custom dialog. */
        static custom(options: { title?: string, message?: string, buttons?: Array<any>, showTitle?: boolean }): any;
    }
    /** An object that serves as a namespace for the methods that work with DevExtreme CSS Themes. */
    export class themes {
        /** Gets the current theme's name. */
        static current(): string;
        /** Sets a theme with a specific name. */
        static current(themeName: string): void;
        /** Specifies a function to be executed after the theme is loaded. */
        static ready(callback: Function): void;
    }
}
declare module DevExpress.viz {
    export interface BaseWidgetOptions<T = BaseWidget> extends DOMComponentOptions<T> {
        /** Configures the exporting and printing features. */
        export?: BaseWidgetExport;
        /** Configures the loading indicator. */
        loadingIndicator?: BaseWidgetLoadingIndicator;
        /** Generates space around the widget. */
        margin?: BaseWidgetMargin;
        /** A function that is executed when the widget's rendering has finished. */
        onDrawn?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the exported event. Executed after data from the widget is exported. */
        onExported?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the exporting event. Executed before data from the widget is exported. */
        onExporting?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, cancel?: boolean, format?: string }) => any);
        /** A handler for the fileSaving event. Executed before a file with exported data is saved on the user's local storage. */
        onFileSaving?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
        /** A handler for the incidentOccurred event. Executed when an error or warning appears in the widget. */
        onIncidentOccurred?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** Notifies the widget that it is embedded into an HTML page that uses a tag modifying the path. */
        pathModified?: boolean;
        /** Specifies whether to redraw the widget when the size of the parent browser window changes or a mobile device rotates. */
        redrawOnResize?: boolean;
        /** Switches the widget to a right-to-left representation. */
        rtlEnabled?: boolean;
        /** Specifies the widget's size in pixels. */
        size?: BaseWidgetSize;
        /** Sets the name of the theme the widget uses. */
        theme?: 'android5.light' | 'generic.dark' | 'generic.light' | 'generic.contrast' | 'ios7.default' | 'win10.black' | 'win10.white' | 'win8.black' | 'win8.white' | 'generic.carmine' | 'generic.darkmoon' | 'generic.darkviolet' | 'generic.greenmist' | 'generic.softblue' | 'material.blue.light' | 'material.lime.light' | 'material.orange.light' | 'material.purple.light' | 'material.teal.light';
        /** Configures the widget's title. */
        title?: BaseWidgetTitle | string;
        /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
        tooltip?: BaseWidgetTooltip;
    }
    /** Configures the exporting and printing features. */
    interface BaseWidgetExport {
        /** Specifies the color that will fill transparent regions in the resulting file or document. */
        backgroundColor?: string;
        /** Enables the client-side exporting in the widget. */
        enabled?: boolean;
        /** Specifies a default name for the file to which the widget will be exported. */
        fileName?: string;
        /** Specifies a set of formats available for exporting into. */
        formats?: Array<'GIF' | 'JPEG' | 'PDF' | 'PNG' | 'SVG'>;
        /** Adds an empty space around the exported widget; measured in pixels. */
        margin?: number;
        /** Enables the printing feature in the widget. Applies only if the export.enabled option is true. */
        printingEnabled?: boolean;
        /** Specifies the URL of the server-side proxy that streams the resulting file to the end user to enable exporting in the Safari browser. */
        proxyUrl?: string;
    }
    /** Configures the loading indicator. */
    interface BaseWidgetLoadingIndicator {
        /** Colors the background of the loading indicator. */
        backgroundColor?: string;
        /** Specifies font options for the loading indicator. */
        font?: Font;
        /** Specifies whether to show the loading indicator or not. */
        show?: boolean;
        /** Specifies the text to be displayed by the loading indicator. */
        text?: string;
    }
    /** Generates space around the widget. */
    interface BaseWidgetMargin {
        /** Specifies the bottom margin of the widget in pixels. */
        bottom?: number;
        /** Specifies the left margin of the widget in pixels. */
        left?: number;
        /** Specifies the right margin of the widget in pixels. */
        right?: number;
        /** Specifies the top margin of the widget in pixels. */
        top?: number;
    }
    /** Specifies the widget's size in pixels. */
    interface BaseWidgetSize {
        /** Specifies the height of the widget in pixels. */
        height?: number;
        /** Specifies the width of the widget in pixels. */
        width?: number;
    }
    /** Configures the widget's title. */
    interface BaseWidgetTitle {
        /** Specifies font options for the title. */
        font?: Font;
        /** Specifies the title's alignment in a horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Generates space around the title. */
        margin?: number | { top?: number, bottom?: number, left?: number, right?: number };
        /** Specifies the minimum height that the title occupies. */
        placeholderSize?: number;
        /** Configures the widget's subtitle. */
        subtitle?: { text?: string, font?: Font } | string;
        /** Specifies the title's text. */
        text?: string;
        /** Specifies the title's alignment in a vertical direction. */
        verticalAlignment?: 'bottom' | 'top';
    }
    /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
    interface BaseWidgetTooltip {
        /** Specifies the length of a tooltip's arrow in pixels. */
        arrowLength?: number;
        /** Configures a tooltip's border. */
        border?: { width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, visible?: boolean };
        /** Colors all tooltips. */
        color?: string;
        /** Specifies the container in which to draw tooltips. The default container is the HTML DOM `` element. */
        container?: string | Element | JQuery;
        /** Enables tooltips. */
        enabled?: boolean;
        /** Specifies tooltips' font options. */
        font?: Font;
        /** Formats a value before it is displayed it in a tooltip. */
        format?: DevExpress.ui.format;
        /** Specifies tooltips' transparency. */
        opacity?: number;
        /** Generates an empty space, measured in pixels, between a tooltip's left/right border and its text. */
        paddingLeftRight?: number;
        /** Generates an empty space, measured in pixels, between a tooltip's top/bottom border and its text. */
        paddingTopBottom?: number;
        /** Configures a tooltip's shadow. */
        shadow?: { opacity?: number, color?: string, offsetX?: number, offsetY?: number, blur?: number };
        /** Specifies a tooltip's z-index. */
        zIndex?: number;
    }
    /** This section describes options and methods that are common to all widgets. */
    export class BaseWidget extends DOMComponent {
        constructor(element: Element, options?: BaseWidgetOptions)
        constructor(element: JQuery, options?: BaseWidgetOptions)
        /** Exports the widget. */
        exportTo(fileName: string, format: string): void;
        /** Gets the current widget size. */
        getSize(): BaseWidgetSize;
        /** Hides the loading indicator. */
        hideLoadingIndicator(): void;
        /** Opens the browser's print window. */
        print(): void;
        /** Redraws the widget. */
        render(): void;
        /** Shows the loading indicator. */
        showLoadingIndicator(): void;
        /** Gets the widget's SVG markup. */
        svg(): string;
    }
    /** A class describing a scale break range. Inherited by scale breaks in the Chart and RangeSelector. */
    export interface ScaleBreak {
        /** Along with the startValue option, limits the scale break. */
        endValue?: number | Date | string;
        /** Along with the endValue option, limits the scale break. */
        startValue?: number | Date | string;
    }
    /** A class describing various time intervals. Inherited by tick intervals in Chart and RangeSelector. */
    export interface VizTimeInterval {
        /** Specifies the time interval measured in days. Available only for an axis/scale displaying date-time values. */
        days?: number;
        /** Specifies the time interval measured in hours. Available only for an axis/scale displaying date-time values. */
        hours?: number;
        /** Specifies the time interval measured in milliseconds. Available only for an axis/scale displaying date-time values. */
        milliseconds?: number;
        /** Specifies the time interval measured in minutes. Available only for an axis/scale displaying date-time values. */
        minutes?: number;
        /** Specifies the time interval measured in months. Available only for an axis/scale displaying date-time values. */
        months?: number;
        /** Specifies the time interval measured in quarters. Available only for an axis/scale displaying date-time values. */
        quarters?: number;
        /** Specifies the time interval measured in seconds. Available only for an axis/scale displaying date-time values. */
        seconds?: number;
        /** Specifies the time interval measured in weeks. Available only for an axis/scale displaying date-time values. */
        weeks?: number;
        /** Specifies the time interval measured in years. Available only for an axis/scale displaying date-time values. */
        years?: number;
    }
    /** The Chart is a widget that visualizes data from a local or remote storage using a great variety of series types along with different interactive elements, such as tooltips, crosshair pointer, legend, etc. */
    export class dxChart extends BaseChart {
        constructor(element: Element, options?: DevExpress.viz.charts.dxChartOptions)
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxChartOptions)
        getArgumentAxis(): void;
        getValueAxis(): void;
        getValueAxis(name: string): void;
        /** Sets the argument axis' start and end values. */
        zoomArgument(startValue: number | Date | string, endValue: number | Date | string): void;
    }
    /** The PieChart is a widget that visualizes data as a circle divided into sectors that each represents a portion of the whole. */
    export class dxPieChart extends BaseChart {
        constructor(element: Element, options?: DevExpress.viz.charts.dxPieChartOptions)
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPieChartOptions)
    }
    /** The PolarChart is a widget that visualizes data in a polar coordinate system. */
    export class dxPolarChart extends BaseChart {
        constructor(element: Element, options?: DevExpress.viz.charts.dxPolarChartOptions)
        constructor(element: JQuery, options?: DevExpress.viz.charts.dxPolarChartOptions)
    }
    /** A base class for all chart widgets included in the ChartJS library. */
    export class BaseChart extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.charts.BaseChartOptions)
        constructor(element: JQuery, options?: DevExpress.viz.charts.BaseChartOptions)
        /** Deselects the chart's selected series. The series is displayed in an initial style. */
        clearSelection(): void;
        /** Gets all the series. */
        getAllSeries(): Array<baseSeriesObject>;
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets a series with a specific name. */
        getSeriesByName(seriesName: any): chartSeriesObject;
        /** Gets a series with a specific index. */
        getSeriesByPos(seriesIndex: number): chartSeriesObject;
        /** Hides all widget tooltips. */
        hideTooltip(): void;
        /** Redraws the widget. */
        render(): void;
        /** Redraws the widget. */
        render(renderOptions: any): void;
    }
    /** This section lists objects that define options used to configure series of specific types. */
    interface dxChartSeriesTypes {
        /** Describes settings supported by a series of the area type. */
        AreaSeries?: dxChartSeriesTypesAreaSeries;
        /** Describes settings supported by a series of the bar type. */
        BarSeries?: dxChartSeriesTypesBarSeries;
        /** Describes settings supported by a series of the bubble type. */
        BubbleSeries?: dxChartSeriesTypesBubbleSeries;
        /** Describes settings supported by a series of the candlestick type. */
        CandleStickSeries?: dxChartSeriesTypesCandleStickSeries;
        /** An object that defines configuration options for chart series. */
        CommonSeries?: dxChartSeriesTypesCommonSeries;
        /** Describes settings supported by a series of the full-stacked area type. */
        FullStackedAreaSeries?: dxChartSeriesTypesFullStackedAreaSeries;
        /** Describes settings supported by a series of the full-stacked bar type. */
        FullStackedBarSeries?: dxChartSeriesTypesFullStackedBarSeries;
        /** Describes settings supported by a series of the full-stacked line type. */
        FullStackedLineSeries?: dxChartSeriesTypesFullStackedLineSeries;
        /** Describes settings supported by a series of the full-stacked spline area type. */
        FullStackedSplineAreaSeries?: dxChartSeriesTypesFullStackedSplineAreaSeries;
        /** Describes settings supported by a series of the full-stacked spline area type. An object defining a series of the fullStackedSpline type. */
        FullStackedSplineSeries?: dxChartSeriesTypesFullStackedSplineSeries;
        /** Describes settings supported by a series of the line type. */
        LineSeries?: dxChartSeriesTypesLineSeries;
        /** Describes settings supported by a series of the range area type. */
        RangeAreaSeries?: dxChartSeriesTypesRangeAreaSeries;
        /** Describes settings supported by a series of the range bar type. */
        RangeBarSeries?: dxChartSeriesTypesRangeBarSeries;
        /** Describes settings supported by a series of the scatter type. */
        ScatterSeries?: dxChartSeriesTypesScatterSeries;
        /** Describes settings supported by a series of the spline area type. */
        SplineAreaSeries?: dxChartSeriesTypesSplineAreaSeries;
        /** Describes settings supported by a series of the spline type. */
        SplineSeries?: dxChartSeriesTypesSplineSeries;
        /** Describes settings supported by a series of the stacked area type. */
        StackedAreaSeries?: dxChartSeriesTypesStackedAreaSeries;
        /** Describes settings supported by a series of the stacked bar type. */
        StackedBarSeries?: dxChartSeriesTypesStackedBarSeries;
        /** Describes settings supported by a series of the stacked line type. */
        StackedLineSeries?: dxChartSeriesTypesStackedLineSeries;
        /** Describes settings supported by a series of the stacked spline area type. */
        StackedSplineAreaSeries?: dxChartSeriesTypesStackedSplineAreaSeries;
        /** Describes settings supported by a series of the stacked spline type. */
        StackedSplineSeries?: dxChartSeriesTypesStackedSplineSeries;
        /** Describes settings supported by a series of the step rea type. */
        StepAreaSeries?: dxChartSeriesTypesStepAreaSeries;
        /** Describes settings supported by a series of the step line type. */
        StepLineSeries?: dxChartSeriesTypesStepLineSeries;
        /** Describes settings supported by a series of the stock type. */
        StockSeries?: dxChartSeriesTypesStockSeries;
    }
    /** Describes settings supported by a series of the area type. */
    interface dxChartSeriesTypesAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the bar type. */
    interface dxChartSeriesTypesBarSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesBarSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesBarSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a bar. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the bubble type. */
    interface dxChartSeriesTypesBubbleSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesBubbleSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesBubbleSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a bubble. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesBubbleSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesBubbleSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the candlestick type. */
    interface dxChartSeriesTypesCandleStickSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesCandleStickSeriesAggregation;
        /** Specifies which data source field provides arguments for series points. */
        argumentField?: string;
        /** Specifies series elements to be highlighted when a user pauses on a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures the appearance adopted by the series when a user points to it. */
        hoverStyle?: dxChartSeriesTypesCandleStickSeriesHoverStyle;
        /** Configures point labels. */
        label?: dxChartSeriesTypesCandleStickSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a point. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures the appearance adopted by the series when a user selects it. */
        selectionStyle?: dxChartSeriesTypesCandleStickSeriesSelectionStyle;
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesCandleStickSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'ohlc' | 'custom';
    }
    /** Configures the appearance adopted by the series when a user points to it. */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /** Configures hatching that applies when a user points to the series. */
        hatching?: dxChartSeriesTypesCandleStickSeriesHoverStyleHatching;
    }
    /** Configures hatching that applies when a user points to the series. */
    interface dxChartSeriesTypesCandleStickSeriesHoverStyleHatching extends dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /** Specifies the direction of hatching lines. */
        direction?: 'left' | 'none' | 'right';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesCandleStickSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures the appearance adopted by the series when a user selects it. */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** Configures hatching that applies when a user selects the series. */
        hatching?: dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching;
    }
    /** Configures hatching that applies when a user selects the series. */
    interface dxChartSeriesTypesCandleStickSeriesSelectionStyleHatching extends dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /** Specifies the direction of hatching lines. */
        direction?: 'left' | 'none' | 'right';
    }
    /** An object that defines configuration options for chart series. */
    interface dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesCommonSeriesAggregation;
        /** Specifies which data source field provides arguments for series points. */
        argumentField?: string;
        /** Binds the series to a value axis. */
        axis?: string;
        /** Controls the padding and consequently the width of all bars in a series using relative units. Ignored if the barWidth option is set. */
        barPadding?: number;
        /** Specifies a fixed width for all bars in a series, measured in pixels. Takes precedence over the barPadding option. */
        barWidth?: number;
        /** Configures the series border (in area-like series) or the series point border (in bar-like and bubble series). */
        border?: dxChartSeriesTypesCommonSeriesBorder;
        /** Specifies which data source field provides close values for points of a financial series. */
        closeValueField?: string;
        /** Specifies the color of the series. */
        color?: string;
        /** Makes bars look rounded. Applies only to bar-like series. */
        cornerRadius?: number;
        /** Specifies the dash style of the series line. Applies only to line-like series. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Specifies which data source field provides high values for points of a financial series. */
        highValueField?: string;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /** Configures the appearance adopted by the series when a user points to it. */
        hoverStyle?: dxChartSeriesTypesCommonSeriesHoverStyle;
        /** Specifies whether the series should ignore null data points. */
        ignoreEmptyPoints?: boolean;
        /** Specifies a filling color for the body of a series point that visualizes a non-reduced value. Applies only to candlestick series. */
        innerColor?: string;
        /** Configures point labels. */
        label?: dxChartSeriesTypesCommonSeriesLabel;
        /** Specifies which data source field provides low values for points of a financial series. */
        lowValueField?: string;
        /** Specifies a limit for the number of point labels. */
        maxLabelCount?: number;
        /** Specifies the minimal possible height (or length if the chart is rotated) of a bar in pixels. Applies only to bar-like series. */
        minBarSize?: number;
        /** Specifies how transparent the series should be. */
        opacity?: number;
        /** Specifies which data source field provides open values for points of a financial series. */
        openValueField?: string;
        /** Specifies which pane the series should belong to. Accepts the name of the pane. */
        pane?: string;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesCommonSeriesPoint;
        /** Coupled with the rangeValue2Field option, specifies which data source field provides values for a range-like series. */
        rangeValue1Field?: string;
        /** Coupled with the rangeValue1Field option, specifies which data source field provides values for a range-like series. */
        rangeValue2Field?: string;
        /** Specifies reduction options for financial series. */
        reduction?: { color?: string, level?: 'close' | 'high' | 'low' | 'open' };
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /** Configures the appearance adopted by the series when a user selects it. */
        selectionStyle?: dxChartSeriesTypesCommonSeriesSelectionStyle;
        /** Specifies whether to show the series in the legend or not. */
        showInLegend?: boolean;
        /** Specifies which data source field provides size values for bubbles. Required by and applies only to bubble series. */
        sizeField?: string;
        /** Specifies which stack the series should belongs to. Applies only to stacked bar and full-stacked bar series. */
        stack?: string;
        /** Specifies which data source field provides auxiliary data for series points. */
        tagField?: string;
        /** Configures error bars. */
        valueErrorBar?: { displayMode?: 'auto' | 'high' | 'low' | 'none', lowValueField?: string, highValueField?: string, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number, color?: string, lineWidth?: number, edgeLength?: number, opacity?: number };
        /** Specifies which data source field provides values for series points. */
        valueField?: string;
        /** Specifies whether the series is visible or not. */
        visible?: boolean;
        /** Specifies the width of the series line in pixels. Applies only to line-like series. */
        width?: number;
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies a custom aggregate function. Applies only if the aggregation method is "custom". */
        calculate?: ((aggregationInfo: chartPointAggregationInfoObject, series: chartSeriesObject) => any | Array<any>);
        /** Enables data aggregation for the series. */
        enabled?: boolean;
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'ohlc' | 'range' | 'sum' | 'custom';
    }
    /** Configures the series border (in area-like series) or the series point border (in bar-like and bubble series). */
    interface dxChartSeriesTypesCommonSeriesBorder {
        /** Colors the series border (in area-like series) or the series point border (in bar-like and bubble series). */
        color?: string;
        /** Sets a dash style for the series border (in area-like series) or for the series point border (in bar-like and bubble series). */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series). */
        visible?: boolean;
        /** Sets a pixel-measured width for the series border (in area-like series) or for the series point border (in bar-like and bubble series). */
        width?: number;
    }
    /** Configures the appearance adopted by the series when a user points to it. */
    interface dxChartSeriesTypesCommonSeriesHoverStyle {
        /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
        border?: dxChartSeriesTypesCommonSeriesHoverStyleBorder;
        /** Specifies the color of the series in the hovered state. */
        color?: string;
        /** Specifies the dash style of the series line when the series is in the hovered state. Applies only to line-like series. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Configures hatching that applies when a user points to the series. */
        hatching?: dxChartSeriesTypesCommonSeriesHoverStyleHatching;
        /** Specifies the pixel-measured width of the series line when the series is in the hovered state. */
        width?: number;
    }
    /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
    interface dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /** Colors the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
        color?: string;
        /** Sets a dash style for the series border (in area-like series) or for the series point border (in bar-like and bubble series) when a user points to the series. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
        visible?: boolean;
        /** Sets a pixel-measured width for the series border (in area-like series) or for the series point border (in bar-like and bubble series) when a user points to the series. */
        width?: number;
    }
    /** Configures hatching that applies when a user points to the series. */
    interface dxChartSeriesTypesCommonSeriesHoverStyleHatching {
        /** Specifies the direction of hatching lines. */
        direction?: 'left' | 'none' | 'right';
        /** Specifies how transparent hatching lines should be. */
        opacity?: number;
        /** Specifies the distance between two side-by-side hatching lines in pixels. */
        step?: number;
        /** Specifies the width of hatching lines in pixels. */
        width?: number;
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesCommonSeriesLabel {
        /** Aligns point labels in relation to their points. */
        alignment?: 'center' | 'left' | 'right';
        /** Formats the point argument before it is displayed in the point label. To format the point value, use the format option. */
        argumentFormat?: DevExpress.ui.format;
        /** Colors the point labels' background. The default color is inherited from the points. */
        backgroundColor?: string;
        /** Configures the borders of point labels. */
        border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' };
        /** Configures the label connectors. */
        connector?: { visible?: boolean, width?: number, color?: string };
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
        /** Specifies font options for point labels. */
        font?: Font;
        /** Formats the point value before it will be displayed in the point label. */
        format?: DevExpress.ui.format;
        /** Along with verticalOffset, shifts point labels from their initial positions. */
        horizontalOffset?: number;
        /** Specifies whether to display point labels inside or outside of series points. Applies only to bubble, range-like and bar-like series. */
        position?: 'inside' | 'outside';
        /** Rotates point labels. */
        rotationAngle?: number;
        /** Specifies whether or not to show labels for points with zero value. Applies only to bar-like series. */
        showForZeroValues?: boolean;
        /** Along with horizontalOffset, shifts point labels from their initial positions. */
        verticalOffset?: number;
        /** Makes the point labels visible. */
        visible?: boolean;
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesCommonSeriesPoint {
        /** Configures the appearance of the series point border in scatter, line- and area-like series. */
        border?: { visible?: boolean, width?: number, color?: string };
        /** Colors the series points. */
        color?: string;
        /** Specifies series elements to be highlighted when a user pauses on a series point. */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** Configures the appearance adopted by a series point when a user pauses on it. */
        hoverStyle?: { color?: string, border?: { visible?: boolean, width?: number, color?: string }, size?: number };
        /** Substitutes the standard point symbols with an image. */
        image?: string | { url?: string | { rangeMinPoint?: string, rangeMaxPoint?: string }, width?: number | { rangeMinPoint?: number, rangeMaxPoint?: number }, height?: number | { rangeMinPoint?: number, rangeMaxPoint?: number } };
        /** Specifies series elements to be highlighted when a user selects a series point. */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** Configures the appearance of a selected series point. */
        selectionStyle?: { color?: string, border?: { visible?: boolean, width?: number, color?: string }, size?: number };
        /** Specifies the diameter of series points in pixels. */
        size?: number;
        /** Specifies which symbol should represent series points in scatter, line- and area-like series. */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangleDown' | 'triangleUp';
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Configures the appearance adopted by the series when a user selects it. */
    interface dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
        border?: dxChartSeriesTypesCommonSeriesSelectionStyleBorder;
        /** Specifies the color of the series in the selected state. */
        color?: string;
        /** Specifies the dash style of the series line when the series is in the selected state. Applies only to line-like series. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Configures hatching that applies when a user selects the series. */
        hatching?: dxChartSeriesTypesCommonSeriesSelectionStyleHatching;
        /** Specifies the pixel-measured width of the series line when the series is in the selected state. */
        width?: number;
    }
    /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /** Colors the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
        color?: string;
        /** Sets a dash style for the series border (in area-like series) or for the series point border (in bar-like and bubble series) when a user selects the series. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
        visible?: boolean;
        /** Sets a pixel-measured width for the series border (in area-like series) or for the series point border (in bar-like and bubble series) when a user selects the series. */
        width?: number;
    }
    /** Configures hatching that applies when a user selects the series. */
    interface dxChartSeriesTypesCommonSeriesSelectionStyleHatching {
        /** Specifies the direction of hatching lines. */
        direction?: 'left' | 'none' | 'right';
        /** Specifies how transparent hatching lines should be. */
        opacity?: number;
        /** Specifies the distance between two side-by-side hatching lines in pixels. */
        step?: number;
        /** Specifies the width of hatching lines in pixels. */
        width?: number;
    }
    /** Describes settings supported by a series of the full-stacked area type. */
    interface dxChartSeriesTypesFullStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesFullStackedAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** An object defining the label configuration options. */
        label?: dxChartSeriesTypesFullStackedAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesFullStackedAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesFullStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** An object defining the label configuration options. */
    interface dxChartSeriesTypesFullStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesFullStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the full-stacked bar type. */
    interface dxChartSeriesTypesFullStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesFullStackedBarSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesFullStackedBarSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a bar. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesFullStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesFullStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
        /** Specifies whether to display point labels inside or outside of series points. Applies only to bubble, range-like and bar-like series. */
        position?: 'inside' | 'outside';
    }
    /** Describes settings supported by a series of the full-stacked line type. */
    interface dxChartSeriesTypesFullStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesFullStackedLineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesFullStackedLineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesFullStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesFullStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the full-stacked spline area type. */
    interface dxChartSeriesTypesFullStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesFullStackedSplineAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesFullStackedSplineAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesFullStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the full-stacked spline area type. An object defining a series of the fullStackedSpline type. */
    interface dxChartSeriesTypesFullStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesFullStackedSplineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesFullStackedSplineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesFullStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesFullStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the line type. */
    interface dxChartSeriesTypesLineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesLineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesLineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the range area type. */
    interface dxChartSeriesTypesRangeAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesRangeAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesRangeAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesRangeAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesRangeAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'range' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesRangeAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesRangeAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the range bar type. */
    interface dxChartSeriesTypesRangeBarSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesRangeBarSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesRangeBarSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a range bar. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesRangeBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'range' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesRangeBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the scatter type. */
    interface dxChartSeriesTypesScatterSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesScatterSeriesAggregation;
        /** Configures point labels. */
        label?: dxChartSeriesTypesScatterSeriesLabel;
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesScatterSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesScatterSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the spline area type. */
    interface dxChartSeriesTypesSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesSplineAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesSplineAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesSplineAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the spline type. */
    interface dxChartSeriesTypesSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesSplineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesSplineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the stacked area type. */
    interface dxChartSeriesTypesStackedAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStackedAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStackedAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesStackedAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStackedAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStackedAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesStackedAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the stacked bar type. */
    interface dxChartSeriesTypesStackedBarSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStackedBarSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStackedBarSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a bar. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStackedBarSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStackedBarSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
        /** Specifies whether to display point labels inside or outside of series points. Applies only to bubble, range-like and bar-like series. */
        position?: 'inside' | 'outside';
    }
    /** Describes settings supported by a series of the stacked line type. */
    interface dxChartSeriesTypesStackedLineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStackedLineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStackedLineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStackedLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStackedLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the stacked spline area type. */
    interface dxChartSeriesTypesStackedSplineAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStackedSplineAreaSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStackedSplineAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesStackedSplineAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStackedSplineAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStackedSplineAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesStackedSplineAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the stacked spline type. */
    interface dxChartSeriesTypesStackedSplineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStackedSplineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStackedSplineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStackedSplineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStackedSplineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the step rea type. */
    interface dxChartSeriesTypesStepAreaSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStepAreaSeriesAggregation;
        /** Configures the series border (in area-like series) or the series point border (in bar-like and bubble series). */
        border?: dxChartSeriesTypesStepAreaSeriesBorder;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures the appearance adopted by the series when a user points to it. */
        hoverStyle?: dxChartSeriesTypesStepAreaSeriesHoverStyle;
        /** Configures point labels. */
        label?: dxChartSeriesTypesStepAreaSeriesLabel;
        /** Configures series points in scatter, line- and area-like series. */
        point?: dxChartSeriesTypesStepAreaSeriesPoint;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
        /** Configures the appearance adopted by the series when a user selects it. */
        selectionStyle?: dxChartSeriesTypesStepAreaSeriesSelectionStyle;
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStepAreaSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures the series border (in area-like series) or the series point border (in bar-like and bubble series). */
    interface dxChartSeriesTypesStepAreaSeriesBorder extends dxChartSeriesTypesCommonSeriesBorder {
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series). */
        visible?: boolean;
    }
    /** Configures the appearance adopted by the series when a user points to it. */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyle extends dxChartSeriesTypesCommonSeriesHoverStyle {
        /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
        border?: dxChartSeriesTypesStepAreaSeriesHoverStyleBorder;
    }
    /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
    interface dxChartSeriesTypesStepAreaSeriesHoverStyleBorder extends dxChartSeriesTypesCommonSeriesHoverStyleBorder {
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user points to the series. */
        visible?: boolean;
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStepAreaSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Configures series points in scatter, line- and area-like series. */
    interface dxChartSeriesTypesStepAreaSeriesPoint extends dxChartSeriesTypesCommonSeriesPoint {
        /** Makes the series points visible. */
        visible?: boolean;
    }
    /** Configures the appearance adopted by the series when a user selects it. */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyle extends dxChartSeriesTypesCommonSeriesSelectionStyle {
        /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
        border?: dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder;
    }
    /** Configures the appearance adopted by the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
    interface dxChartSeriesTypesStepAreaSeriesSelectionStyleBorder extends dxChartSeriesTypesCommonSeriesSelectionStyleBorder {
        /** Shows the series border (in area-like series) or the series point border (in bar-like and bubble series) when a user selects the series. */
        visible?: boolean;
    }
    /** Describes settings supported by a series of the step line type. */
    interface dxChartSeriesTypesStepLineSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStepLineSeriesAggregation;
        /** Specifies series elements to be highlighted when a user points to a series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStepLineSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStepLineSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'avg' | 'count' | 'max' | 'min' | 'sum' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStepLineSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** Describes settings supported by a series of the stock type. */
    interface dxChartSeriesTypesStockSeries extends dxChartSeriesTypesCommonSeries {
        /** Configures data aggregation for the series. */
        aggregation?: dxChartSeriesTypesStockSeriesAggregation;
        /** Specifies which data source field provides arguments for series points. */
        argumentField?: string;
        /** Specifies series elements to be highlighted when a user pauses on a series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Configures point labels. */
        label?: dxChartSeriesTypesStockSeriesLabel;
        /** Specifies series elements to be highlighted when a user selects a point. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** Configures data aggregation for the series. */
    interface dxChartSeriesTypesStockSeriesAggregation extends dxChartSeriesTypesCommonSeriesAggregation {
        /** Specifies how to aggregate series points. */
        method?: 'ohlc' | 'custom';
    }
    /** Configures point labels. */
    interface dxChartSeriesTypesStockSeriesLabel extends dxChartSeriesTypesCommonSeriesLabel {
        /** Customizes the text displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
    }
    /** The Funnel is a widget that visualizes a value at different stages. It helps assess value changes throughout these stages and identify potential issues. The Funnel widget conveys information using different interactive elements (tooltips, labels, legend) and enables you to create not only a funnel, but also a pyramid chart. */
    export class dxFunnel extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.funnel.dxFunnelOptions)
        constructor(element: JQuery, options?: DevExpress.viz.funnel.dxFunnelOptions)
        /** Cancels the selection of all funnel items. */
        clearSelection(): void;
        /** Provides access to all funnel items. */
        getAllItems(): Array<dxFunnelItem>;
        /** Provides access to the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Hides all widget tooltips. */
        hideTooltip(): void;
    }
    /** A base object for gauge value and subvalue indicators. Includes the options of indicators of all types. */
    export interface CommonIndicator {
        /** Specifies the length of an arrow for the indicator of the textCloud type in pixels. */
        arrowLength?: number;
        /** Specifies the background color for the indicator of the rangeBar type. */
        backgroundColor?: string;
        /** Specifies the base value for the indicator of the rangeBar type. */
        baseValue?: number;
        /** Specifies a radius small enough for the indicator to begin adapting. */
        beginAdaptingAtRadius?: number;
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the orientation of the rangeBar indicator. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: 'left' | 'right';
        /** Specifies the distance between the needle and the center of a gauge for the indicator of a needle-like type. */
        indentFromCenter?: number;
        /** Specifies the indicator length. */
        length?: number;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Sets the palette to be used to colorize indicators differently. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies the second color for the indicator of the twoColorNeedle type. */
        secondColor?: string;
        /** Specifies the length of a twoNeedleColor type indicator tip as a percentage. */
        secondFraction?: number;
        /** Specifies the range bar size for an indicator of the rangeBar type. */
        size?: number;
        /** Specifies the inner diameter in pixels, so that the spindle has the shape of a ring. */
        spindleGapSize?: number;
        /** Specifies the spindle's diameter in pixels for the indicator of a needle-like type. */
        spindleSize?: number;
        /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
        text?: CommonIndicatorText;
        /** Specifies the orientation of the rangeBar indicator. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: 'bottom' | 'top';
        /** Specifies the width of an indicator in pixels. */
        width?: number;
    }
    /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
    export interface CommonIndicatorText {
        /** Specifies a callback function that returns the text to be displayed in an indicator. */
        customizeText?: ((indicatedValue: { value?: number, valueText?: string }) => string);
        /** Specifies font options for the text displayed by the indicator. */
        font?: Font;
        /** Formats a value before it is displayed in an indicator. Accepts only numeric formats. */
        format?: DevExpress.ui.format;
        /** Specifies the range bar's label indent in pixels. */
        indent?: number;
    }
    /** An object that defines a gauge indicator of the rectangleNeedle type. */
    interface circularRectangleNeedle extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
    }
    /** An object that defines a gauge indicator of the triangleNeedle type. */
    interface circularTriangleNeedle extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
    }
    /** An object that defines a gauge indicator of the twoColorNeedle type. */
    interface circularTwoColorNeedle extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
    }
    /** An object that defines a gauge indicator of the rangeBar type. */
    interface circularRangeBar extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
    }
    /** An object that defines a gauge indicator of the triangleMarker type. */
    interface circularTriangleMarker extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the indicator length. */
        length?: number;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the width of an indicator in pixels. */
        width?: number;
    }
    /** An object that defines a gauge indicator of the textCloud type. */
    interface circularTextCloud extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
        text?: circularTextCloudText;
    }
    /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
    interface circularTextCloudText extends CommonIndicatorText {
        /** Specifies font options for the text displayed by the indicator. */
        font?: Font;
    }
    /** An object defining a gauge indicator of the rectangle type. */
    export interface linearRectangle extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the width of an indicator in pixels. */
        width?: number;
    }
    /** An object that defines a gauge indicator of the circle type. */
    export interface linearCircle extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
    }
    /** An object defining a gauge indicator of the rhombus type. */
    export interface linearRhombus extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the width of an indicator in pixels. */
        width?: number;
    }
    /** An object that defines a gauge indicator of the rangeBar type. */
    export interface linearRangeBar extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
    }
    /** An object that defines a gauge indicator of the triangleMarker type. */
    export interface linearTriangleMarker extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the indicator length. */
        length?: number;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the width of an indicator in pixels. */
        width?: number;
    }
    /** An object that defines a gauge indicator of the textCloud type. */
    export interface linearTextCloud extends CommonIndicator {
        /** Specifies a color of the indicator. */
        color?: string;
        /** Specifies the distance between the indicator and the invisible scale line. */
        offset?: number;
        /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
        text?: linearTextCloudText;
    }
    /** Specifies the appearance of the text displayed in an indicator of the rangeBar type. */
    export interface linearTextCloudText extends CommonIndicatorText {
        /** Specifies font options for the text displayed by the indicator. */
        font?: Font;
    }
    /** A gauge widget. */
    export class BaseGauge extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.gauges.BaseGaugeOptions)
        constructor(element: JQuery, options?: DevExpress.viz.gauges.BaseGaugeOptions)
        /** Gets subvalues. */
        subvalues(): Array<number>;
        /** Updates subvalues. */
        subvalues(subvalues: Array<number>): void;
        /** Gets the main value. */
        value(): number;
        /** Updates the main value. */
        value(value: number): void;
    }
    /** The CircularGauge is a widget that indicates values on a circular numeric scale. */
    export class dxCircularGauge extends BaseGauge {
        constructor(element: Element, options?: DevExpress.viz.gauges.dxCircularGaugeOptions)
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxCircularGaugeOptions)
    }
    /** The LinearGauge is a widget that indicates values on a linear numeric scale. */
    export class dxLinearGauge extends BaseGauge {
        constructor(element: Element, options?: DevExpress.viz.gauges.dxLinearGaugeOptions)
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxLinearGaugeOptions)
    }
    /** The BarGauge widget contains several circular bars that each indicates a single value. */
    export class dxBarGauge extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.gauges.dxBarGaugeOptions)
        constructor(element: JQuery, options?: DevExpress.viz.gauges.dxBarGaugeOptions)
        /** Gets all the values. */
        values(): Array<number>;
        /** Updates all the values. */
        values(values: Array<number>): void;
    }
    /** This section describes the Series object, which represents a series. */
    export class baseSeriesObject {
        /** Provides information about the state of the series object. */
        fullState: number;
        /** Returns the type of the series. */
        type: string;
        /** Returns the name of the series. */
        name: any;
        /** Returns the tag of the series. */
        tag: any;
        /** Switches the series from the hover state back to normal. */
        clearHover(): void;
        /** Unselects all the selected points of the series. The points are displayed in an initial style. */
        clearSelection(): void;
        /** Deselects the specified point. The point is displayed in an initial style. */
        deselectPoint(point: basePointObject): void;
        /** Gets all points in the series. */
        getAllPoints(): Array<basePointObject>;
        /** Gets the color of a particular series. */
        getColor(): string;
        /** Gets a series point with the specified index. */
        getPointByPos(positionIndex: number): basePointObject;
        /** Gets a series point with the specified argument value. */
        getPointsByArg(pointArg: number | string | Date): Array<basePointObject>;
        /** Gets visible series points. */
        getVisiblePoints(): Array<basePointObject>;
        /** Hides a series at runtime. */
        hide(): void;
        /** Switches the series into the hover state, the same as when a user places the mouse pointer on it. */
        hover(): void;
        /** Provides information about the hover state of a series. */
        isHovered(): boolean;
        /** Provides information about the selection state of a series. */
        isSelected(): boolean;
        /** Provides information about the visibility state of a series. */
        isVisible(): boolean;
        /** Selects the series. */
        select(): void;
        /** Selects the specified point. The point is displayed in a 'selected' style. */
        selectPoint(point: basePointObject): void;
        /** Makes a particular series visible. */
        show(): void;
    }
    /** This section describes the Point object, which represents a series point. */
    export class basePointObject {
        /** Contains the data object that the series point represents. */
        data: any;
        /** Provides information about the state of the point object. */
        fullState: number;
        /** Returns the point's argument value that was set in the data source. */
        originalArgument: string | number | Date;
        /** Returns the point's value that was set in the data source. */
        originalValue: string | number | Date;
        /** Returns the series object to which the point belongs. */
        series: any;
        /** Returns the tag of the point. */
        tag: any;
        /** Switches the point from the hover state back to normal. */
        clearHover(): void;
        /** Deselects the point. */
        clearSelection(): void;
        /** Gets the color of a particular point. */
        getColor(): string;
        /** Allows you to obtain the label(s) of the series point. */
        getLabel(): baseLabelObject & Array<baseLabelObject>;
        /** Hides the tooltip of the point. */
        hideTooltip(): void;
        /** Switches the point into the hover state, the same as when a user places the mouse pointer on it. */
        hover(): void;
        /** Provides information about the hover state of a point. */
        isHovered(): boolean;
        /** Provides information about the selection state of a point. */
        isSelected(): boolean;
        /** Selects the point. The point is displayed in a 'selected' style until another point is selected or the current point is deselected programmatically. */
        select(): void;
        /** Shows the tooltip of the point. */
        showTooltip(): void;
    }
    /** This section describes the Label object, which represents a point label. */
    export class baseLabelObject {
        /** Gets the parameters of the label's minimum bounding rectangle (MBR). */
        getBoundingRect(): any;
        /** Hides the point label. */
        hide(): void;
        /** Hides the point label and keeps it invisible until the show() method is called. */
        hide(holdInvisible: boolean): void;
        /** Checks whether the point label is visible. */
        isVisible(): boolean;
        /** Shows the point label. */
        show(): void;
        /** Shows the point label and keeps it visible until the hide() method is called. */
        show(holdVisible: boolean): void;
    }
    /** This section describes the Series object, which represents a series. */
    export class chartSeriesObject extends baseSeriesObject {
        /** Returns the name of the value axis of the series. */
        axis: string;
        /** Returns the name of the series pane. */
        pane: string;
        getArgumentAxis(): void;
        getValueAxis(): void;
    }
    export interface chartPointAggregationInfoObject {
        /** Contains the length of the aggregation interval in axis units. If the interval is set in pixels, it will be converted to axis units. */
        aggregationInterval?: any;
        /** Contains data objects that were aggregated into this point. */
        data?: Array<any>;
        /** Contains the end value of the interval to which the point belongs. */
        intervalEnd?: any;
        /** Contains the start value of the interval to which the point belongs. */
        intervalStart?: any;
    }
    /** This section describes the Point object, which represents a series point. */
    export class chartPointObject extends basePointObject {
        /** Provides information about the aggregation interval and the data objects that fall within it. */
        aggregationInfo: chartPointAggregationInfoObject;
        /** Contains the first value of the point. This field is useful for points belonging to a series of the range area or range bar type only. */
        originalMinValue: string | number | Date;
        /** Contains the open value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalOpenValue: number | string;
        /** Contains the close value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalCloseValue: number | string;
        /** Contains the low value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalLowValue: number | string;
        /** Contains the high value of the point. This field is useful for points belonging to a series of the candle stick or stock type only. */
        originalHighValue: number | string;
        /** Contains the size of the bubble as it was set in the data source. This field is useful for points belonging to a series of the bubble type only. */
        size: number | string;
        /** Gets the parameters of the point's minimum bounding rectangle (MBR). */
        getBoundingRect(): any;
    }
    export class chartAxisObject {
        visualRange(): void;
        visualRange(visualRange: Array<number | string | Date>): void;
    }
    /** This section describes the Item object, which represents a funnel item. */
    export class dxFunnelItem {
        /** The item's argument. */
        argument: string | Date | number;
        /** The item's original data object. */
        data: any;
        /** The item's calculated percentage value. */
        percent: number;
        /** The item's value. */
        value: number;
        /** Gets the funnel item's color specified in the data source or palette. */
        getColor(): string;
        /** Changes the funnel item's hover state. */
        hover(state: boolean): void;
        /** Indicates whether the funnel item is in the hover state. */
        isHovered(): boolean;
        /** Indicates whether the funnel item is selected. */
        isSelected(): boolean;
        /** Selects or cancels the funnel item's selection. */
        select(state: boolean): void;
        /** Shows the funnel item's tooltip. */
        showTooltip(): void;
    }
    /** This section describes the Point object, which represents a series point. */
    export class piePointObject extends basePointObject {
        /** Gets the percentage value of the specific point. */
        percent: string | number | Date;
        /** Hides a specific point. */
        hide(): void;
        /** Hides the tooltip of the point. */
        hideTooltip(): void;
        /** Provides information about the visibility state of a point. */
        isVisible(): boolean;
        /** Makes a specific point visible. */
        show(): void;
        /** Shows the tooltip of the point. */
        showTooltip(): void;
    }
    /** This section describes the Series object, which represents a series. */
    export class pieChartSeriesObject extends baseSeriesObject {
    }
    /** This section describes the Series object, which represents a series. */
    export class polarChartSeriesObject extends baseSeriesObject {
    }
    /** This section describes the Point object, which represents a series point. */
    export class polarPointObject extends basePointObject {
    }
    /** This section describes the Node object, which represents a treemap node. */
    export class dxTreeMapNode {
        /** The level that the current node occupies in the hierarchy of nodes. */
        level: number;
        /** The index of the current node in the array of all nodes on the same level. */
        index: number;
        /** The object from the data source visualized by the node. */
        data: any;
        /** Customizes the node. */
        customize(options: any): void;
        /** Drills down into the node. */
        drillDown(): void;
        /** Returns all nodes nested in the current node. */
        getAllChildren(): Array<dxTreeMapNode>;
        /** Returns all descendant nodes. */
        getAllNodes(): Array<dxTreeMapNode>;
        /** Gets a specific node from a collection of direct descendants. */
        getChild(index: number): dxTreeMapNode;
        /** Indicates how many direct descendants the current node has. */
        getChildrenCount(): number;
        /** Returns the parent node of the current node. */
        getParent(): dxTreeMapNode;
        /** Indicates whether the current node is active. */
        isActive(): boolean;
        /** Indicates whether the node is in the hover state or not. */
        isHovered(): boolean;
        /** Indicates whether the node is visualized by a tile or a group of tiles. */
        isLeaf(): boolean;
        /** Indicates whether the node is selected or not. */
        isSelected(): boolean;
        /** Returns the label of the node. */
        label(): string;
        /** Sets the label to the node. */
        label(label: string): void;
        /** Reverts the appearance of the node to the initial state. */
        resetCustomization(): void;
        /** Sets the selection state of a node. */
        select(state: boolean): void;
        /** Shows the tooltip. */
        showTooltip(): void;
        /** Gets the raw value of the node. */
        value(): number;
    }
    /** This section describes the Layer object, which represents a vector map layer. */
    export class MapLayer {
        /** The name of the layer. */
        name: string;
        /** The layer index in the layers array. */
        index: number;
        /** The layer type. Can be "area", "line" or "marker". */
        type: string;
        /** The type of the layer elements. */
        elementType: string;
        /** Deselects all layer elements. */
        clearSelection(): void;
        /** Returns the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets all layer elements. */
        getElements(): Array<MapLayerElement>;
    }
    /** This section describes the Layer Element object, which represents a vector map layer element. */
    export class MapLayerElement {
        /** The parent layer of the layer element. */
        layer: any;
        /** Applies the layer element settings and updates element appearance. */
        applySettings(settings: any): void;
        /** Gets the value of an attribute. */
        attribute(name: string): any;
        /** Sets the value of an attribute. */
        attribute(name: string, value: any): void;
        /** Gets the layer element coordinates. */
        coordinates(): any;
        /** Gets the selection state of the layer element. */
        selected(): boolean;
        /** Sets the selection state of the layer element. */
        selected(state: boolean): void;
    }
    /** This section lists the objects that define options to be used to configure series of particular types. */
    export interface dxPieChartSeriesTypes {
        /** An object that defines configuration options for chart series. */
        CommonPieChartSeries?: dxPieChartSeriesTypesCommonPieChartSeries;
        /** An object defining a series of the doughnut type. */
        DoughnutSeries?: any;
        /** An object defining a series of the pie type. */
        PieSeries?: any;
    }
    /** An object that defines configuration options for chart series. */
    export interface dxPieChartSeriesTypesCommonPieChartSeries {
        /** Specifies the data source field that provides arguments for series points. */
        argumentField?: string;
        /** Specifies the required type for series arguments. */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** An object defining the series border configuration options. */
        border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' };
        /** Specifies a series color. */
        color?: string;
        /** Specifies the chart elements to highlight when a series is hovered over. */
        hoverMode?: 'none' | 'onlyPoint';
        /** An object defining configuration options for a hovered series. */
        hoverStyle?: { color?: string, hatching?: { direction?: 'left' | 'none' | 'right', width?: number, step?: number, opacity?: number }, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' } };
        /** An object defining the label configuration options. */
        label?: { customizeText?: ((pointInfo: any) => string), visible?: boolean, rotationAngle?: number, radialOffset?: number, format?: DevExpress.ui.format, argumentFormat?: DevExpress.ui.format, position?: 'columns' | 'inside' | 'outside', backgroundColor?: string, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' }, connector?: { visible?: boolean, width?: number, color?: string }, font?: Font };
        /** Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed. */
        maxLabelCount?: number;
        /** Specifies a minimal size of a displayed pie segment. */
        minSegmentSize?: number;
        /** Specifies the chart elements to highlight when the series is selected. */
        selectionMode?: 'none' | 'onlyPoint';
        /** An object defining configuration options for the series when it is selected. */
        selectionStyle?: { color?: string, hatching?: { direction?: 'left' | 'none' | 'right', width?: number, step?: number, opacity?: number }, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' } };
        /** Specifies chart segment grouping options. */
        smallValuesGrouping?: { mode?: 'none' | 'smallValueThreshold' | 'topN', topCount?: number, threshold?: number, groupName?: string };
        /** Specifies the name of the data source field that provides data about a point. */
        tagField?: string;
        /** Specifies the data source field that provides values for series points. */
        valueField?: string;
    }
    /** This section lists objects that define options used to configure series of specific types. */
    export interface dxPolarChartSeriesTypes {
        /** An object defining a series of the area type. */
        areapolarseries?: dxPolarChartSeriesTypesAreapolarseries;
        /** An object defining a series of the bar type. */
        barpolarseries?: dxPolarChartSeriesTypesBarpolarseries;
        /** An object that defines configuration options for polar chart series. */
        CommonPolarChartSeries?: dxPolarChartSeriesTypesCommonPolarChartSeries;
        /** An object defining a series of the line type. */
        linepolarseries?: dxPolarChartSeriesTypesLinepolarseries;
        /** An object defining a series of the scatter type. */
        scatterpolarseries?: any;
        /** An object defining a series of the stackedBar type. */
        stackedbarpolarseries?: dxPolarChartSeriesTypesStackedbarpolarseries;
    }
    /** An object defining a series of the area type. */
    export interface dxPolarChartSeriesTypesAreapolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies series elements to be highlighted when a user points to the series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** An object defining configuration options for points in line and area series. */
        point?: dxPolarChartSeriesTypesAreapolarseriesPoint;
        /** Specifies series elements to be highlighted when a user selects the series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** An object defining configuration options for points in line and area series. */
    export interface dxPolarChartSeriesTypesAreapolarseriesPoint extends dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /** Specifies the points visibility for a line and area series. */
        visible?: boolean;
    }
    /** An object defining a series of the bar type. */
    export interface dxPolarChartSeriesTypesBarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies series elements to be highlighted when a user points to the series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** Specifies series elements to be highlighted when a user selects the series. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** An object that defines configuration options for polar chart series. */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies the data source field that provides arguments for series points. */
        argumentField?: string;
        /** Controls the padding and consequently the angular width of all bars in a series using relative units. Ignored if the barWidth option is set. */
        barPadding?: number;
        /** Specifies a fixed angular width for all bars in a series, measured in degrees. Takes precedence over the barPadding option. */
        barWidth?: number;
        /** An object defining the series border configuration options. */
        border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' };
        /** Specifies whether or not to close the chart by joining the end point with the first point. */
        closed?: boolean;
        /** Specifies a series color. */
        color?: string;
        /** Specifies the dash style of the series' line. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Specifies the series elements to highlight when a series is hovered over. */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'nearestPoint' | 'none' | 'onlyPoint';
        /** An object defining configuration options for a hovered series. */
        hoverStyle?: { color?: string, width?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', width?: number, step?: number, opacity?: number }, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' } };
        /** Specifies whether a chart ignores null data points or not. */
        ignoreEmptyPoints?: boolean;
        /** An object defining the label configuration options. */
        label?: dxPolarChartSeriesTypesCommonPolarChartSeriesLabel;
        /** Specifies how many points are acceptable to be in a series to display all labels for these points. Otherwise, the labels will not be displayed. */
        maxLabelCount?: number;
        /** Specifies the minimal length of a displayed bar in pixels. */
        minBarSize?: number;
        /** Specifies opacity for a series. */
        opacity?: number;
        /** An object defining configuration options for points in line and area series. */
        point?: dxPolarChartSeriesTypesCommonPolarChartSeriesPoint;
        /** Specifies the series elements to highlight when the series is selected. */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'excludePoints' | 'includePoints' | 'none' | 'onlyPoint';
        /** An object defining configuration options for a selected series. */
        selectionStyle?: { color?: string, width?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', hatching?: { direction?: 'left' | 'none' | 'right', width?: number, step?: number, opacity?: number }, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' } };
        /** Specifies whether or not to show the series in the chart's legend. */
        showInLegend?: boolean;
        /** Specifies the name of the stack where the values of the 'stackedBar' series must be located. */
        stack?: string;
        /** Specifies the name of the data source field that provides data about a point. */
        tagField?: string;
        /** Configures error bars. */
        valueErrorBar?: { displayMode?: 'auto' | 'high' | 'low' | 'none', lowValueField?: string, highValueField?: string, type?: 'fixed' | 'percent' | 'stdDeviation' | 'stdError' | 'variance', value?: number, color?: string, lineWidth?: number, edgeLength?: number, opacity?: number };
        /** Specifies the data source field that provides values for series points. */
        valueField?: string;
        /** Specifies the visibility of a series. */
        visible?: boolean;
        /** Specifies a line width. */
        width?: number;
    }
    /** An object defining the label configuration options. */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /** Formats the point argument before it is displayed in the point label. To format the point value, use the format option. */
        argumentFormat?: DevExpress.ui.format;
        /** Colors the point labels' background. The default color is inherited from the points. */
        backgroundColor?: string;
        /** Specifies border options for point labels. */
        border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' };
        /** Specifies connector options for series point labels. */
        connector?: { visible?: boolean, width?: number, color?: string };
        /** Specifies a callback function that returns the text to be displayed by point labels. */
        customizeText?: ((pointInfo: any) => string);
        /** Specifies font options for the text displayed in point labels. */
        font?: Font;
        /** Formats a value before it is displayed in a point label. */
        format?: DevExpress.ui.format;
        /** Specifies a label position in bar-like series. */
        position?: 'inside' | 'outside';
        /** Specifies the angle used to rotate point labels from their initial position. */
        rotationAngle?: number;
        /** Specifies whether or not to show a label when the point has a zero value. */
        showForZeroValues?: boolean;
        /** Specifies the visibility of point labels. */
        visible?: boolean;
    }
    /** An object defining configuration options for points in line and area series. */
    export interface dxPolarChartSeriesTypesCommonPolarChartSeriesPoint {
        /** Specifies border options for points in the line and area series. */
        border?: { visible?: boolean, width?: number, color?: string };
        /** Specifies the points color. */
        color?: string;
        /** Specifies what series points to highlight when a point is hovered over. */
        hoverMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** An object defining configuration options for a hovered point. */
        hoverStyle?: { color?: string, border?: { visible?: boolean, width?: number, color?: string }, size?: number };
        /** An object specifying the parameters of an image that is used as a point marker. */
        image?: string | { url?: string, width?: number, height?: number };
        /** Specifies what series points to highlight when a point is selected. */
        selectionMode?: 'allArgumentPoints' | 'allSeriesPoints' | 'none' | 'onlyPoint';
        /** An object defining configuration options for a selected point. */
        selectionStyle?: { color?: string, border?: { visible?: boolean, width?: number, color?: string }, size?: number };
        /** Specifies the point diameter in pixels for those series that represent data points as symbols (not as bars for instance). */
        size?: number;
        /** Specifies a symbol for presenting points of the line and area series. */
        symbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /** Specifies the points visibility for a line and area series. */
        visible?: boolean;
    }
    /** An object defining a series of the line type. */
    export interface dxPolarChartSeriesTypesLinepolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies series elements to be highlighted when a user points to the series. */
        hoverMode?: 'nearestPoint' | 'includePoints' | 'excludePoints' | 'none';
        /** Specifies series elements to be highlighted when a user selects the series. */
        selectionMode?: 'includePoints' | 'excludePoints' | 'none';
    }
    /** An object defining a series of the stackedBar type. */
    export interface dxPolarChartSeriesTypesStackedbarpolarseries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies series elements to be highlighted when a user points to the series. */
        hoverMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
        /** An object defining the label configuration options. */
        label?: dxPolarChartSeriesTypesStackedbarpolarseriesLabel;
        /** Specifies series elements to be highlighted when a user selects the series. */
        selectionMode?: 'onlyPoint' | 'allSeriesPoints' | 'allArgumentPoints' | 'none';
    }
    /** An object defining the label configuration options. */
    export interface dxPolarChartSeriesTypesStackedbarpolarseriesLabel extends dxPolarChartSeriesTypesCommonPolarChartSeriesLabel {
        /** Specifies a label position in bar-like series. */
        position?: 'inside' | 'outside';
    }
    /** The RangeSelector is a widget that allows a user to select a range of values on a scale. */
    export class dxRangeSelector extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions)
        constructor(element: JQuery, options?: DevExpress.viz.rangeSelector.dxRangeSelectorOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets the currently selected range. */
        getValue(): Array<number | string | Date>;
        /** Redraws the widget. */
        render(): void;
        /** Redraws the widget. */
        render(skipChartAnimation: boolean): void;
        /** Sets the selected range. */
        setValue(value: Array<number | string | Date>): void;
    }
    /** Overridden by descriptions for particular widgets. */
    export class BaseSparkline extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.sparklines.BaseSparklineOptions)
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.BaseSparklineOptions)
    }
    /** The Sparkline widget is a compact chart that contains only one series. Owing to their size, sparklines occupy very little space and can be easily collected in a table or embedded straight in text. */
    export class dxSparkline extends BaseSparkline {
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxSparklineOptions)
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxSparklineOptions)
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
    }
    /** The Bullet widget is useful when you need to compare a single measure to a target value. The widget comprises a horizontal bar indicating the measure and a vertical line indicating the target value. */
    export class dxBullet extends BaseSparkline {
        constructor(element: Element, options?: DevExpress.viz.sparklines.dxBulletOptions)
        constructor(element: JQuery, options?: DevExpress.viz.sparklines.dxBulletOptions)
    }
    /** The TreeMap is a widget that displays hierarchical data by using nested rectangles. */
    export class dxTreeMap extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.treeMap.dxTreeMapOptions)
        constructor(element: JQuery, options?: DevExpress.viz.treeMap.dxTreeMapOptions)
        /** Deselects all nodes in the widget. */
        clearSelection(): void;
        /** Drills one level up. */
        drillUp(): void;
        /** Gets the current node. */
        getCurrentNode(): dxTreeMapNode;
        /** Gets the DataSource instance. */
        getDataSource(): DevExpress.data.DataSource;
        /** Gets the root node. */
        getRootNode(): dxTreeMapNode;
        /** Hides the tooltip. */
        hideTooltip(): void;
        /** Resets the drill down level. */
        resetDrillDown(): void;
    }
    /** The VectorMap is a widget that visualizes geographical locations. This widget represents a geographical map that contains areas and markers. Areas embody continents and countries. Markers flag specific points on the map, for example, towns, cities or capitals. */
    export class dxVectorMap extends BaseWidget {
        constructor(element: Element, options?: DevExpress.viz.map.dxVectorMapOptions)
        constructor(element: JQuery, options?: DevExpress.viz.map.dxVectorMapOptions)
        /** Gets the current map center coordinates. */
        center(): Array<number>;
        /** Sets the map center coordinates. */
        center(centerCoordinates: Array<number>): void;
        /** Deselects all the selected area and markers on a map at once. The areas and markers are displayed in their initial style after. */
        clearSelection(): void;
        /** Converts client area coordinates into map coordinates. */
        convertCoordinates(x: number, y: number): Array<number>;
        /** Gets a layer with a specific index. */
        getLayerByIndex(index: number): MapLayer;
        /** Gets a layer with a specific name. */
        getLayerByName(name: string): MapLayer;
        /** Gets all layers. */
        getLayers(): Array<MapLayer>;
        /** Gets the current map viewport coordinates. */
        viewport(): Array<number>;
        /** Sets the map viewport coordinates. */
        viewport(viewportCoordinates: Array<number>): void;
        /** Gets the current zoom factor value. */
        zoomFactor(): number;
        /** Sets the zoom factor value. */
        zoomFactor(zoomFactor: number): void;
    }
    /** Font options. */
    export interface Font {
        /** Specifies a font color. */
        color?: string;
        /** Specifies a font family. */
        family?: string;
        /** Specifies a font opacity. */
        opacity?: number;
        /** Specifies a font size. */
        size?: number | string;
        /** Specifies a font weight. */
        weight?: number;
    }
}
declare module DevExpress.events {
    /** Attaches an event handler to the specified elements. */
    export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** Attaches an event handler to be executed only once to the specified elements. */
    export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;
    export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;
    export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** Detaches an event handler from the specified elements. */
    export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;
    export function off(element: Element | Array<Element>, eventName: string, selector: string): void;
    export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;
    /** Executes all handlers of a given event type attached to the specified elements. */
    export function trigger(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
    export function trigger(element: Element | Array<Element>, event: string | event): void;
    export function triggerHandler(element: Element | Array<Element>, event: string | event, extraParameters: any): void;
    export function triggerHandler(element: Element | Array<Element>, event: string | event): void;
}
declare module DevExpress.data.utils {
    /** Compiles a getter function from a getter expression. */
    export function compileGetter(expr: string | Array<string>): Function;
    /** Compiles a setter function from a setter expression. */
    export function compileSetter(expr: string | Array<string>): Function;
}
declare module DevExpress.data.utils.odata {
    /** Contains built-in OData type converters (for String, Int32, Int64, Boolean, Single, Decimal, and Guid) and allows you to register a custom type converter. */
    export var keyConverters: any;
}
declare module DevExpress.utils {
    /** Makes the browser call a function to update animation before the next repaint. */
    export function requestAnimationFrame(callback: Function): number;
    /** Cancels an animation frame request scheduled with the requestAnimationFrame method. */
    export function cancelAnimationFrame(requestID: number): void;
    /** Sets parameters for the viewport meta tag. Takes effect for mobile applications only. */
    export function initMobileViewport(options: { allowZoom?: boolean, allowPan?: boolean, allowSelection?: boolean }): void;
}
declare module DevExpress.fx {
    /** Animates an element. */
    export function animate(element: Element, config: animationConfig): Promise<void> & JQueryPromise<void>;
    /** Checks whether an element is being animated. */
    export function isAnimating(element: Element): boolean;
    /** Stops an element's animation. */
    export function stop(element: Element, jumpToEnd: boolean): void;
}
declare module DevExpress.ui.dxOverlay {
    /** Specifies the base z-index for all overlay widgets. */
    export function baseZIndex(zIndex: number): void;
}
declare module DevExpress.viz.charts {
    export interface dxChartOptions extends BaseChartOptions<dxChart> {
        /** Specifies whether or not to adjust the value axis when zooming the widget. */
        adjustOnZoom?: boolean;
        /** Configures the argument axis. */
        argumentAxis?: dxChartArgumentAxis;
        /** Controls the padding and consequently the width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth option is set. */
        barGroupPadding?: number;
        /** Specifies a fixed width for groups of bars with the same argument, measured in pixels. Takes precedence over the barGroupPadding option. */
        barGroupWidth?: number;
        /** @deprecated Use CommonSeries.barPadding instead. */
        barWidth?: number;
        /** Defines common settings for both the argument and value axis in a chart. */
        commonAxisSettings?: dxChartCommonAxisSettings;
        /** Defines common settings for all panes in a chart. */
        commonPaneSettings?: dxChartCommonPaneSettings;
        /** Specifies settings common for all series in the chart. */
        commonSeriesSettings?: dxChartCommonSeriesSettings;
        /** Colors the background of the chart container. */
        containerBackgroundColor?: string;
        /** Configures the crosshair feature. */
        crosshair?: { enabled?: boolean, color?: string, width?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, label?: { backgroundColor?: string, visible?: boolean, format?: DevExpress.ui.format, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font }, verticalLine?: { visible?: boolean, color?: string, width?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, label?: { backgroundColor?: string, visible?: boolean, format?: DevExpress.ui.format, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font } } | boolean, horizontalLine?: { visible?: boolean, color?: string, width?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', opacity?: number, label?: { backgroundColor?: string, visible?: boolean, format?: DevExpress.ui.format, customizeText?: ((info: { value?: Date | number | string, valueText?: string, point?: chartPointObject }) => string), font?: Font } } | boolean };
        /** Processes data before visualizing it. */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: any, b: any) => number) };
        /** Specifies which pane should be used by default. */
        defaultPane?: string;
        /** @deprecated Use CommonSeries.ignoreEmptyPoints instead. */
        equalBarWidth?: boolean;
        /** Specifies the options of a chart's legend. */
        legend?: dxChartLegend;
        /** Specifies a coefficient determining the diameter of the largest bubble. */
        maxBubbleSize?: number;
        /** Specifies the diameter of the smallest bubble measured in pixels. */
        minBubbleSize?: number;
        /** Forces the widget to treat negative values as zeroes. Applies to stacked-like series only. */
        negativesAsZeroes?: boolean;
        /** A handler for the argumentAxisClick event. */
        onArgumentAxisClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
        /** A handler for the legendClick event. */
        onLegendClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
        /** A handler for the seriesClick event. */
        onSeriesClick?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: chartSeriesObject }) => any) | string;
        /** A handler for the seriesHoverChanged event. */
        onSeriesHoverChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /** A handler for the seriesSelectionChanged event. */
        onSeriesSelectionChanged?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, target?: chartSeriesObject }) => any);
        /** A handler for the zoomEnd event. */
        onZoomEnd?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any, rangeStart?: Date | number, rangeEnd?: Date | number }) => any);
        /** A handler for the zoomStart event. */
        onZoomStart?: ((e: { component?: dxChart, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Declares a collection of panes. */
        panes?: dxChartPanes | Array<dxChartPanes>;
        /** Specifies how the chart must behave when series point labels overlap. */
        resolveLabelOverlapping?: 'hide' | 'none' | 'stack';
        /** Swaps the axes around making the value axis horizontal and the argument axis vertical. */
        rotated?: boolean;
        /** Specifies the settings of the scroll bar. */
        scrollBar?: { visible?: boolean, offset?: number, color?: string, width?: number, opacity?: number, position?: 'bottom' | 'left' | 'right' | 'top' };
        /** Enables scrolling in your chart. */
        scrollingMode?: 'all' | 'mouse' | 'none' | 'touch';
        /** Specifies options for Chart widget series. */
        series?: dxChartSeries | Array<dxChartSeries>;
        /** Specifies whether a single series or multiple series can be selected in the chart. */
        seriesSelectionMode?: 'multiple' | 'single';
        /** Defines options for the series template. */
        seriesTemplate?: { nameField?: string, customizeSeries?: ((seriesName: any) => dxChartSeries) };
        /** Indicates whether or not to synchronize value axes when they are displayed on a single pane. */
        synchronizeMultiAxes?: boolean;
        /** Configures tooltips. */
        tooltip?: dxChartTooltip;
        /** @deprecated Use CommonSeries.aggregation.enabled instead. */
        useAggregation?: boolean;
        /** Configures the value axis. */
        valueAxis?: dxChartValueAxis | Array<dxChartValueAxis>;
        /** Enables zooming in your chart. */
        zoomingMode?: 'all' | 'mouse' | 'none' | 'touch';
    }
    /** Configures the argument axis. */
    export interface dxChartArgumentAxis extends dxChartCommonAxisSettings {
        /** Specifies the length of aggregation intervals in pixels. May be ignored in favor of the aggregationInterval option. */
        aggregationGroupWidth?: number;
        /** Specifies the length of aggregation intervals in axis units. Applies only to axes of continuous and logarithmic types. */
        aggregationInterval?: any;
        /** Casts arguments to a specified data type. */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** Specifies the minimum distance between two neighboring major ticks in pixels. Applies only to the axes of the "continuous" and "logarithmic" types. */
        axisDivisionFactor?: number;
        /** Declares a scale break collection. Applies only if the axis' type is "continuous" or "logarithmic". */
        breaks?: Array<ScaleBreak>;
        /** Specifies the order of categories on an axis of the "discrete" type. */
        categories?: Array<number | string | Date>;
        /** Declares a collection of constant lines belonging to the argument axis. */
        constantLines?: Array<dxChartArgumentAxisConstantLines>;
        /** Specifies the appearance of those constant lines that belong to the argument axis. */
        constantLineStyle?: dxChartArgumentAxisConstantLineStyle;
        /** Specifies whether to force the axis to start and end on ticks. */
        endOnTick?: boolean;
        /** Dates to be excluded from the axis when workdaysOnly is true. */
        holidays?: Array<Date | string> | Array<number>;
        /** Specifies chart elements to be highlighted when a user points to an axis label. */
        hoverMode?: 'allArgumentPoints' | 'none';
        /** Configures the labels of the argument axis. */
        label?: dxChartArgumentAxisLabel;
        /** Specifies the value to be raised to a power when generating ticks for an axis of the "logarithmic" type. */
        logarithmBase?: number;
        /** Coupled with the min option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        max?: number | Date | string;
        /** Coupled with the max option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        min?: number | Date | string;
        /** Specifies how many minor ticks to place between two neighboring major ticks. */
        minorTickCount?: number;
        /** Specifies the interval between minor ticks. Applies only to the axes of the "continuous" type. */
        minorTickInterval?: any;
        /** Relocates the argument axis. */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /** Dates to be included on the axis when workdaysOnly is true. */
        singleWorkdays?: Array<Date | string> | Array<number>;
        /** Declares a collection of strips belonging to the argument axis. */
        strips?: Array<dxChartArgumentAxisStrips>;
        /** Specifies the interval between major ticks. */
        tickInterval?: any;
        /** Configures the axis title. */
        title?: dxChartArgumentAxisTitle;
        /** Specifies the type of the argument axis. */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** Leaves only workdays on the axis: the work week days plus single workdays minus holidays. Applies only if the axis' argumentType is "datetime". */
        workdaysOnly?: boolean;
        /** Specifies which days are workdays. The array can contain values from 0 (Sunday) to 6 (Saturday). Applies only if workdaysOnly is true. */
        workWeek?: Array<number>;
    }
    /** Declares a collection of constant lines belonging to the argument axis. */
    export interface dxChartArgumentAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /** Configures the constant line label. */
        label?: dxChartArgumentAxisConstantLinesLabel;
        /** Specifies the value indicated by a constant line. Setting this option is necessary. */
        value?: number | Date | string;
    }
    /** Configures the constant line label. */
    export interface dxChartArgumentAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** Aligns constant line labels in the horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Specifies the text of a constant line label. By default, equals to the value of the constant line. */
        text?: string;
        /** Aligns constant line labels in the vertical direction. */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** Specifies the appearance of those constant lines that belong to the argument axis. */
    export interface dxChartArgumentAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /** Specifies the appearance of the labels of those constant lines that belong to the argument axis. */
        label?: dxChartArgumentAxisConstantLineStyleLabel;
    }
    /** Specifies the appearance of the labels of those constant lines that belong to the argument axis. */
    export interface dxChartArgumentAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** Aligns constant line labels in the horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Aligns constant line labels in the vertical direction. */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** Configures the labels of the argument axis. */
    export interface dxChartArgumentAxisLabel extends dxChartCommonAxisSettingsLabel {
        /** Specifies the hint that appears when a user points to an axis label. */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** Customizes the text displayed by axis labels. */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** Formats a value before it is displayed in an axis label. */
        format?: DevExpress.ui.format;
    }
    /** Declares a collection of strips belonging to the argument axis. */
    export interface dxChartArgumentAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /** Specifies the color of the strip. */
        color?: string;
        /** Along with the startValue option, limits the strip. */
        endValue?: number | Date | string;
        /** Configures the strip label. */
        label?: dxChartArgumentAxisStripsLabel;
        /** Along with the endValue option, limits the strip. */
        startValue?: number | Date | string;
    }
    /** Configures the strip label. */
    export interface dxChartArgumentAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /** Specifies the text of the strip label. */
        text?: string;
    }
    /** Configures the axis title. */
    export interface dxChartArgumentAxisTitle extends dxChartCommonAxisSettingsTitle {
        /** Specifies the text of the axis title. */
        text?: string;
    }
    /** Defines common settings for both the argument and value axis in a chart. */
    export interface dxChartCommonAxisSettings {
        /** Specifies whether to allow decimal values on the axis. When false, the axis contains integer values only. */
        allowDecimals?: boolean;
        /** Configures the scale breaks' appearance. */
        breakStyle?: { width?: number, color?: string, line?: 'straight' | 'waved' };
        /** Specifies the color of the axis line. */
        color?: string;
        /** Configures the appearance of all constant lines in the widget. */
        constantLineStyle?: dxChartCommonAxisSettingsConstantLineStyle;
        /** Specifies whether ticks and grid lines should cross axis labels or lie between them. Applies only to the axes of the "discrete" type. */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /** Specifies whether to force the axis to start and end on ticks. */
        endOnTick?: boolean;
        /** Configures the grid. */
        grid?: { visible?: boolean, color?: string, width?: number, opacity?: number };
        /** Inverts the axis. */
        inverted?: boolean;
        /** Configures axis labels. */
        label?: dxChartCommonAxisSettingsLabel;
        /** Controls the empty space between the maximum series points and the axis. Applies only to the axes of the "continuous" and "logarithmic" type. */
        maxValueMargin?: number;
        /** Configures the minor grid. */
        minorGrid?: { visible?: boolean, color?: string, width?: number, opacity?: number };
        /** Configures the appearance of minor axis ticks. */
        minorTick?: { visible?: boolean, color?: string, opacity?: number, width?: number, length?: number };
        /** Controls the empty space between the minimum series points and the axis. Applies only to the axes of the "continuous" and "logarithmic" type. */
        minValueMargin?: number;
        /** Specifies how transparent the axis line should be. */
        opacity?: number;
        /** Reserves a pixel-measured space for the axis. */
        placeholderSize?: number;
        /** Configures the appearance of strips. */
        stripStyle?: dxChartCommonAxisSettingsStripStyle;
        /** Configures the appearance of major axis ticks. */
        tick?: { visible?: boolean, color?: string, opacity?: number, width?: number, length?: number };
        /** Configures axis titles. */
        title?: dxChartCommonAxisSettingsTitle;
        /** Adds an empty space between the axis and the minimum and maximum series points. */
        valueMarginsEnabled?: boolean;
        /** Makes the axis line visible. */
        visible?: boolean;
        wholeRange?: Array<number | string | Date>;
        /** Specifies the width of the axis line in pixels. */
        width?: number;
    }
    /** Configures the appearance of all constant lines in the widget. */
    export interface dxChartCommonAxisSettingsConstantLineStyle {
        /** Specifies the color of constant lines. */
        color?: string;
        /** Specifies the dash style of constant lines. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** Configures constant line labels. */
        label?: dxChartCommonAxisSettingsConstantLineStyleLabel;
        /** Generates a pixel-measured empty space between the left/right side of a constant line and the constant line label. */
        paddingLeftRight?: number;
        /** Generates a pixel-measured empty space between the top/bottom side of a constant line and the constant line label. */
        paddingTopBottom?: number;
        /** Specifies the width of constant lines in pixels. */
        width?: number;
    }
    /** Configures constant line labels. */
    export interface dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** Specifies font options for constant line labels. */
        font?: Font;
        /** Specifies the position of constant line labels on the chart plot. */
        position?: 'inside' | 'outside';
        /** Makes constant line labels visible. */
        visible?: boolean;
    }
    /** Configures axis labels. */
    export interface dxChartCommonAxisSettingsLabel {
        /** Aligns axis labels in relation to ticks. */
        alignment?: 'center' | 'left' | 'right';
        /** Allows you to rotate or stagger axis labels. Applies to the horizontal axis only. */
        displayMode?: 'rotate' | 'stagger' | 'standard';
        /** Specifies font options for axis labels. */
        font?: Font;
        /** Adds a pixel-measured empty space between an axis and its labels. */
        indentFromAxis?: number;
        /** Decides how to arrange axis labels when there is not enough space to keep all of them. */
        overlappingBehavior?: 'rotate' | 'stagger' | 'none' | 'hide';
        /** Specifies the rotation angle of axis labels. Applies only if displayMode or overlappingBehavior is "rotate". */
        rotationAngle?: number;
        /** Adds a pixel-measured empty space between two staggered rows of axis labels. Applies only if displayMode or overlappingBehavior is "stagger". */
        staggeringSpacing?: number;
        /** Shows/hides axis labels. */
        visible?: boolean;
    }
    /** Configures the appearance of strips. */
    export interface dxChartCommonAxisSettingsStripStyle {
        /** Configures the appearance of strip labels. */
        label?: dxChartCommonAxisSettingsStripStyleLabel;
        /** Generates a pixel-measured empty space between the left/right border of a strip and the strip label. */
        paddingLeftRight?: number;
        /** Generates a pixel-measured empty space between the top/bottom border of a strip and the strip label. */
        paddingTopBottom?: number;
    }
    /** Configures the appearance of strip labels. */
    export interface dxChartCommonAxisSettingsStripStyleLabel {
        /** Specifies font options for strip labels. */
        font?: Font;
        /** Aligns strip labels in the horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Aligns strip labels in the vertical direction. */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** Configures axis titles. */
    export interface dxChartCommonAxisSettingsTitle {
        /** Specifies font options for the axis title. */
        font?: Font;
        /** Adds a pixel-measured empty space between the axis title and axis labels. */
        margin?: number;
    }
    /** Defines common settings for all panes in a chart. */
    export interface dxChartCommonPaneSettings {
        /** Specifies the color of the pane's background. */
        backgroundColor?: string;
        /** Configures the pane border. */
        border?: { visible?: boolean, top?: boolean, bottom?: boolean, left?: boolean, right?: boolean, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid', width?: number, opacity?: number };
    }
    /** Specifies settings common for all series in the chart. */
    export interface dxChartCommonSeriesSettings extends dxChartSeriesTypesCommonSeries {
        /** Defines common settings for all area series. */
        area?: any;
        /** Defines common settings for all bar series. */
        bar?: any;
        /** Defines common settings for all bubble series. */
        bubble?: any;
        /** Defines common settings for all candlestick series. */
        candlestick?: any;
        /** Defines common settings for all full-stacked area series. */
        fullstackedarea?: any;
        /** Defines common settings for all full-stacked bar series. */
        fullstackedbar?: any;
        /** Defines common settings for all full-stacked line series. */
        fullstackedline?: any;
        /** Defines common settings for all full-stacked spline series. */
        fullstackedspline?: any;
        /** Defines common settings for all full-stacked spline area series. */
        fullstackedsplinearea?: any;
        /** Defines common settings for all line series. */
        line?: any;
        /** Defines common settings for all range area series. */
        rangearea?: any;
        /** Defines common settings for all range bar series. */
        rangebar?: any;
        /** Defines common settings for all scatter series. */
        scatter?: any;
        /** Defines common settings for all spline series. */
        spline?: any;
        /** Defines common settings for all spline area series. */
        splinearea?: any;
        /** Defines common settings for all stacked area series. */
        stackedarea?: any;
        /** Defines common settings for all stacked bar series. */
        stackedbar?: any;
        /** Defines common settings for all stacked line series. */
        stackedline?: any;
        /** Defines common settings for all stacked spline series. */
        stackedspline?: any;
        /** Defines common settings for all stacked spline area series. */
        stackedsplinearea?: any;
        /** Defines common settings for all step area series. */
        steparea?: any;
        /** Defines common settings for all step line series. */
        stepline?: any;
        /** Defines common settings for all stock series. */
        stock?: any;
        /** Specifies the type of the series. */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /** Specifies the options of a chart's legend. */
    export interface dxChartLegend extends BaseChartLegend {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** Specifies a callback function that returns the text to be displayed by a legend item. */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** Specifies what series elements to highlight when a corresponding item in the legend is hovered over. */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
        /** Specifies whether the legend is located outside or inside the chart's plot. */
        position?: 'inside' | 'outside';
    }
    /** Declares a collection of panes. */
    export interface dxChartPanes extends dxChartCommonPaneSettings {
        /** Specifies the name of the pane. */
        name?: string;
    }
    /** Specifies options for Chart widget series. */
    export interface dxChartSeries extends dxChartSeriesTypesCommonSeries {
        /** Specifies the name that identifies the series. */
        name?: string;
        /** Specifies data about a series. */
        tag?: any;
        /** Sets the series type. */
        type?: 'area' | 'bar' | 'bubble' | 'candlestick' | 'fullstackedarea' | 'fullstackedbar' | 'fullstackedline' | 'fullstackedspline' | 'fullstackedsplinearea' | 'line' | 'rangearea' | 'rangebar' | 'scatter' | 'spline' | 'splinearea' | 'stackedarea' | 'stackedbar' | 'stackedline' | 'stackedspline' | 'stackedsplinearea' | 'steparea' | 'stepline' | 'stock';
    }
    /** Configures tooltips. */
    export interface dxChartTooltip extends BaseChartTooltip {
        /** Specifies whether the tooltip must be located in the center of a series point or on its edge. Applies to bar-like and bubble series only. */
        location?: 'center' | 'edge';
        /** Specifies the kind of information to display in a tooltip. */
        shared?: boolean;
    }
    /** Configures the value axis. */
    export interface dxChartValueAxis extends dxChartCommonAxisSettings {
        /** Enables auto-calculated scale breaks. Applies only if the axis' type is "continuous" or "logarithmic" and valueType is "numeric". */
        autoBreaksEnabled?: boolean;
        /** Specifies the minimum distance between two neighboring major ticks in pixels. Applies only to the axes of the "continuous" and "logarithmic" types. */
        axisDivisionFactor?: number;
        /** Declares a custom scale break collection. Applies only if the axis' type is "continuous" or "logarithmic". */
        breaks?: Array<ScaleBreak>;
        /** Specifies the order of categories on an axis of the "discrete" type. */
        categories?: Array<number | string | Date>;
        /** Declares a collection of constant lines belonging to the value axis. */
        constantLines?: Array<dxChartValueAxisConstantLines>;
        /** Specifies the appearance of those constant lines that belong to the value axis. */
        constantLineStyle?: dxChartValueAxisConstantLineStyle;
        /** Specifies whether to force the axis to start and end on ticks. */
        endOnTick?: boolean;
        /** Configures the labels of the value axis. */
        label?: dxChartValueAxisLabel;
        /** Specifies the value to be raised to a power when generating ticks for an axis of the "logarithmic" type. */
        logarithmBase?: number;
        /** Coupled with the min option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        max?: number | Date | string;
        /** Sets a limit on auto-calculated scale breaks. Custom scale breaks are not counted. */
        maxAutoBreakCount?: number;
        /** Coupled with the max option, focuses the widget on a specific chart segment. Applies only to the axes of the "continuous" and "logarithmic" type. */
        min?: number | Date | string;
        /** Specifies how many minor ticks to place between two neighboring major ticks. */
        minorTickCount?: number;
        /** Specifies the interval between minor ticks. Applies only to continuous axes. */
        minorTickInterval?: any;
        /** Adds a pixel-measured empty space between two side-by-side value axes. Applies if several value axes are located on one side of the chart. */
        multipleAxesSpacing?: number;
        /** Specifies the name of the value axis. */
        name?: string;
        /** Binds the value axis to a pane. */
        pane?: string;
        /** Relocates the value axis. */
        position?: 'bottom' | 'left' | 'right' | 'top';
        /** Specifies whether or not to show zero on the value axis. */
        showZero?: boolean;
        /** Declares a collection of strips belonging to the value axis. */
        strips?: Array<dxChartValueAxisStrips>;
        /** Synchronizes two or more value axes with each other at a specific value. */
        synchronizedValue?: number;
        /** Specifies the interval between major ticks. Does not apply to discrete axes. */
        tickInterval?: any;
        /** Configures the axis title. */
        title?: dxChartValueAxisTitle;
        /** Specifies the type of the value axis. */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** Casts values to a specified data type. */
        valueType?: 'datetime' | 'numeric' | 'string';
    }
    /** Declares a collection of constant lines belonging to the value axis. */
    export interface dxChartValueAxisConstantLines extends dxChartCommonAxisSettingsConstantLineStyle {
        /** Configures the constant line label. */
        label?: dxChartValueAxisConstantLinesLabel;
        /** Specifies the value indicated by a constant line. Setting this option is necessary. */
        value?: number | Date | string;
    }
    /** Configures the constant line label. */
    export interface dxChartValueAxisConstantLinesLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** Aligns constant line labels in the horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Specifies the text of a constant line label. By default, equals to the value of the constant line. */
        text?: string;
        /** Aligns constant line labels in the vertical direction. */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** Specifies the appearance of those constant lines that belong to the value axis. */
    export interface dxChartValueAxisConstantLineStyle extends dxChartCommonAxisSettingsConstantLineStyle {
        /** Specifies the appearance of the labels of those constant lines that belong to the value axis. */
        label?: dxChartValueAxisConstantLineStyleLabel;
    }
    /** Specifies the appearance of the labels of those constant lines that belong to the value axis. */
    export interface dxChartValueAxisConstantLineStyleLabel extends dxChartCommonAxisSettingsConstantLineStyleLabel {
        /** Aligns constant line labels in the horizontal direction. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Aligns constant line labels in the vertical direction. */
        verticalAlignment?: 'bottom' | 'center' | 'top';
    }
    /** Configures the labels of the value axis. */
    export interface dxChartValueAxisLabel extends dxChartCommonAxisSettingsLabel {
        /** Specifies the hint that appears when a user points to an axis label. */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** Customizes the text displayed by axis labels. */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** Formats a value before it is displayed in an axis label. */
        format?: DevExpress.ui.format;
    }
    /** Declares a collection of strips belonging to the value axis. */
    export interface dxChartValueAxisStrips extends dxChartCommonAxisSettingsStripStyle {
        /** Specifies the color of the strip. */
        color?: string;
        /** Along with the startValue option, limits the strip. */
        endValue?: number | Date | string;
        /** Configures the strip label. */
        label?: dxChartValueAxisStripsLabel;
        /** Along with the endValue option, limits the strip. */
        startValue?: number | Date | string;
    }
    /** Configures the strip label. */
    export interface dxChartValueAxisStripsLabel extends dxChartCommonAxisSettingsStripStyleLabel {
        /** Specifies the text of the strip label. */
        text?: string;
    }
    /** Configures the axis title. */
    export interface dxChartValueAxisTitle extends dxChartCommonAxisSettingsTitle {
        /** Specifies the text of the axis title. */
        text?: string;
    }
    export interface dxPieChartOptions extends BaseChartOptions<dxPieChart> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: dxPieChartAdaptiveLayout;
        /** An object defining the configuration options that are common for all series of the PieChart widget. */
        commonSeriesSettings?: any;
        /** Specifies the diameter of the pie. */
        diameter?: number;
        /** Specifies the fraction of the inner radius relative to the total radius in the series of the 'doughnut' type. The value should be between 0 and 1. */
        innerRadius?: number;
        /** Specifies PieChart legend options. */
        legend?: dxPieChartLegend;
        /** Specifies the minimum diameter of the pie. */
        minDiameter?: number;
        /** A handler for the legendClick event. */
        onLegendClick?: ((e: { component?: dxPieChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: string | number, points?: Array<piePointObject> }) => any) | string;
        /** Sets the palette to be used to colorize series and their elements. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies how a chart must behave when point labels overlap. */
        resolveLabelOverlapping?: 'hide' | 'none' | 'shift';
        /** Specifies the direction that the pie chart segments will occupy. */
        segmentsDirection?: 'anticlockwise' | 'clockwise';
        /** Specifies options for the series of the PieChart widget. */
        series?: dxPieChartSeries | Array<dxPieChartSeries>;
        /** Defines options for the series template. */
        seriesTemplate?: { nameField?: string, customizeSeries?: ((seriesName: any) => dxPieChartSeries) };
        /** Allows you to display several adjoining pies in the same size. */
        sizeGroup?: string;
        /** Specifies the angle in arc degrees from which the first segment of a pie chart should start. */
        startAngle?: number;
        /** Specifies the type of the pie chart series. */
        type?: 'donut' | 'doughnut' | 'pie';
    }
    /** Specifies adaptive layout options. */
    export interface dxPieChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /** Specifies whether or not point labels should be kept when the layout is adapting. */
        keepLabels?: boolean;
    }
    /** Specifies PieChart legend options. */
    export interface dxPieChartLegend extends BaseChartLegend {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /** Specifies a callback function that returns the text to be displayed by a legend item. */
        customizeText?: ((pointInfo: { pointName?: any, pointIndex?: number, pointColor?: string }) => string);
        /** Specifies what chart elements to highlight when a corresponding item in the legend is hovered over. */
        hoverMode?: 'none' | 'allArgumentPoints';
    }
    /** Specifies options for the series of the PieChart widget. */
    export interface dxPieChartSeries extends dxPieChartSeriesTypesCommonPieChartSeries {
        /** Specifies the name that identifies the series. */
        name?: string;
        /** Specifies data about a series. */
        tag?: any;
    }
    export interface dxPolarChartOptions extends BaseChartOptions<dxPolarChart> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: dxPolarChartAdaptiveLayout;
        /** Specifies argument axis options for the PolarChart widget. */
        argumentAxis?: dxPolarChartArgumentAxis;
        /** Controls the padding and consequently the angular width of a group of bars with the same argument using relative units. Ignored if the barGroupWidth option is set. */
        barGroupPadding?: number;
        /** Specifies a fixed angular width for groups of bars with the same argument, measured in degrees. Takes precedence over the barGroupPadding option. */
        barGroupWidth?: number;
        /** @deprecated Use CommonPolarChartSeries.barPadding instead. */
        barWidth?: number;
        /** An object defining the configuration options that are common for all axes of the PolarChart widget. */
        commonAxisSettings?: dxPolarChartCommonAxisSettings;
        /** An object defining the configuration options that are common for all series of the PolarChart widget. */
        commonSeriesSettings?: dxPolarChartCommonSeriesSettings;
        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;
        /** An object providing options for managing data from a data source. */
        dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) };
        /** @deprecated Use CommonPolarChartSeries.ignoreEmptyPoints instead. */
        equalBarWidth?: boolean;
        /** Specifies the options of a chart's legend. */
        legend?: dxPolarChartLegend;
        /** Forces the widget to treat negative values as zeroes. Applies to stacked-like series only. */
        negativesAsZeroes?: boolean;
        /** A handler for the argumentAxisClick event. */
        onArgumentAxisClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, argument?: Date | number | string }) => any) | string;
        /** A handler for the legendClick event. */
        onLegendClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
        /** A handler for the seriesClick event. */
        onSeriesClick?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: polarChartSeriesObject }) => any) | string;
        /** A handler for the seriesHoverChanged event. */
        onSeriesHoverChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /** A handler for the seriesSelectionChanged event. */
        onSeriesSelectionChanged?: ((e: { component?: dxPolarChart, element?: DevExpress.core.dxElement, model?: any, target?: polarChartSeriesObject }) => any);
        /** Specifies how the chart must behave when series point labels overlap. */
        resolveLabelOverlapping?: 'hide' | 'none';
        /** Specifies options for PolarChart widget series. */
        series?: dxPolarChartSeries | Array<dxPolarChartSeries>;
        /** Specifies whether a single series or multiple series can be selected in the chart. */
        seriesSelectionMode?: 'multiple' | 'single';
        /** Defines options for the series template. */
        seriesTemplate?: { nameField?: string, customizeSeries?: ((seriesName: any) => dxPolarChartSeries) };
        /** Configures tooltips. */
        tooltip?: dxPolarChartTooltip;
        /** Indicates whether or not to display a "spider web". */
        useSpiderWeb?: boolean;
        /** Specifies value axis options for the PolarChart widget. */
        valueAxis?: dxPolarChartValueAxis;
    }
    /** Specifies adaptive layout options. */
    export interface dxPolarChartAdaptiveLayout extends BaseChartAdaptiveLayout {
        /** Specifies the widget's height small enough for the layout to begin adapting. */
        height?: number;
        /** Specifies the widget's width small enough for the layout to begin adapting. */
        width?: number;
    }
    /** Specifies argument axis options for the PolarChart widget. */
    export interface dxPolarChartArgumentAxis extends dxPolarChartCommonAxisSettings {
        /** Specifies the desired type of axis values. */
        argumentType?: 'datetime' | 'numeric' | 'string';
        /** Specifies the minimum distance between two neighboring major ticks in pixels. Applies only to the axes of the "continuous" and "logarithmic" types. */
        axisDivisionFactor?: number;
        /** Specifies the order in which arguments (categories) are arranged on the discrete argument axis. */
        categories?: Array<number | string | Date>;
        /** Defines an array of the argument axis constant lines. */
        constantLines?: Array<dxPolarChartArgumentAxisConstantLines>;
        /** Specifies whether or not to display the first point at the angle specified by the startAngle option. */
        firstPointOnStartAngle?: boolean;
        /** Specifies the elements that will be highlighted when the argument axis is hovered over. */
        hoverMode?: 'allArgumentPoints' | 'none';
        /** Specifies options for argument axis labels. */
        label?: dxPolarChartArgumentAxisLabel;
        /** Specifies the value to be raised to a power when generating ticks for a logarithmic axis. */
        logarithmBase?: number;
        /** Specifies the number of minor ticks between two neighboring major ticks. */
        minorTickCount?: number;
        /** Specifies the interval between minor ticks. */
        minorTickInterval?: any;
        /** Specifies the value to be used as the origin for the argument axis. */
        originValue?: number;
        /** Specifies the period of the argument values in the data source. */
        period?: number;
        /** Specifies the angle in arc degrees to which the argument axis should be rotated. The positive values rotate the axis clockwise. */
        startAngle?: number;
        /** Specifies options for argument axis strips. */
        strips?: Array<dxPolarChartArgumentAxisStrips>;
        /** Specifies an interval between axis ticks/grid lines. */
        tickInterval?: any;
        /** Specifies the required type of the argument axis. */
        type?: 'continuous' | 'discrete' | 'logarithmic';
    }
    /** Defines an array of the argument axis constant lines. */
    export interface dxPolarChartArgumentAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** An object defining constant line label options. */
        label?: dxPolarChartArgumentAxisConstantLinesLabel;
        /** Specifies a value to be displayed by a constant line. */
        value?: number | Date | string;
    }
    /** An object defining constant line label options. */
    export interface dxPolarChartArgumentAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** Specifies the text to be displayed in a constant line label. */
        text?: string;
    }
    /** Specifies options for argument axis labels. */
    export interface dxPolarChartArgumentAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a label on the argument axis. */
        customizeHint?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** Specifies a callback function that returns the text to be displayed by argument axis labels. */
        customizeText?: ((argument: { value?: Date | number | string, valueText?: string }) => string);
        /** Formats a value before it is displayed in an axis label. */
        format?: DevExpress.ui.format;
    }
    /** Specifies options for argument axis strips. */
    export interface dxPolarChartArgumentAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /** Specifies a color for a strip. */
        color?: string;
        /** Specifies an end value for a strip. */
        endValue?: number | Date | string;
        /** An object that defines the label configuration options of a strip. */
        label?: dxPolarChartArgumentAxisStripsLabel;
        /** Specifies a start value for a strip. */
        startValue?: number | Date | string;
    }
    /** An object that defines the label configuration options of a strip. */
    export interface dxPolarChartArgumentAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** Specifies the text displayed in a strip. */
        text?: string;
    }
    /** An object defining the configuration options that are common for all axes of the PolarChart widget. */
    export interface dxPolarChartCommonAxisSettings {
        /** Specifies whether to allow decimal values on the axis. When false, the axis contains integer values only. */
        allowDecimals?: boolean;
        /** Specifies the color of the line that represents an axis. */
        color?: string;
        /** Specifies the appearance of all the widget's constant lines. */
        constantLineStyle?: dxPolarChartCommonAxisSettingsConstantLineStyle;
        /** Specifies whether ticks/grid lines of a discrete axis are located between labels or cross the labels. */
        discreteAxisDivisionMode?: 'betweenLabels' | 'crossLabels';
        /** Specifies whether to force the axis to start and end on ticks. */
        endOnTick?: boolean;
        /** An object defining the configuration options for the grid lines of an axis in the PolarChart widget. */
        grid?: { visible?: boolean, color?: string, width?: number, opacity?: number };
        /** Indicates whether or not an axis is inverted. */
        inverted?: boolean;
        /** An object defining the label configuration options that are common for all axes in the PolarChart widget. */
        label?: dxPolarChartCommonAxisSettingsLabel;
        /** Specifies the options of the minor grid. */
        minorGrid?: { visible?: boolean, color?: string, width?: number, opacity?: number };
        /** Specifies the options of the minor ticks. */
        minorTick?: { visible?: boolean, color?: string, opacity?: number, width?: number, length?: number };
        /** Specifies the opacity of the line that represents an axis. */
        opacity?: number;
        /** An object defining configuration options for strip style. */
        stripStyle?: dxPolarChartCommonAxisSettingsStripStyle;
        /** An object defining the configuration options for axis ticks. */
        tick?: dxPolarChartCommonAxisSettingsTick;
        /** Indicates whether or not the line that represents an axis in a chart is visible. */
        visible?: boolean;
        /** Specifies the width of the line that represents an axis in the chart. */
        width?: number;
    }
    /** Specifies the appearance of all the widget's constant lines. */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** Specifies a color for a constant line. */
        color?: string;
        /** Specifies a dash style for a constant line. */
        dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid';
        /** An object defining constant line label options. */
        label?: dxPolarChartCommonAxisSettingsConstantLineStyleLabel;
        /** Specifies a constant line width in pixels. */
        width?: number;
    }
    /** An object defining constant line label options. */
    export interface dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** Specifies font options for a constant line label. */
        font?: Font;
        /** Indicates whether or not to display labels for the axis constant lines. */
        visible?: boolean;
    }
    /** An object defining the label configuration options that are common for all axes in the PolarChart widget. */
    export interface dxPolarChartCommonAxisSettingsLabel {
        /** Specifies font options for axis labels. */
        font?: Font;
        /** Specifies the spacing between an axis and its labels in pixels. */
        indentFromAxis?: number;
        /** Decides how to arrange axis labels when there is not enough space to keep all of them. */
        overlappingBehavior?: 'none' | 'hide';
        /** Indicates whether or not axis labels are visible. */
        visible?: boolean;
    }
    /** An object defining configuration options for strip style. */
    export interface dxPolarChartCommonAxisSettingsStripStyle {
        /** An object defining the configuration options for a strip label style. */
        label?: dxPolarChartCommonAxisSettingsStripStyleLabel;
    }
    /** An object defining the configuration options for a strip label style. */
    export interface dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** Specifies font options for a strip label. */
        font?: Font;
    }
    /** An object defining the configuration options for axis ticks. */
    export interface dxPolarChartCommonAxisSettingsTick {
        /** Specifies ticks color. */
        color?: string;
        /** Specifies tick length. */
        length?: number;
        /** Specifies tick opacity. */
        opacity?: number;
        /** Indicates whether or not ticks are visible on an axis. */
        visible?: boolean;
        /** Specifies tick width. */
        width?: number;
    }
    /** An object defining the configuration options that are common for all series of the PolarChart widget. */
    export interface dxPolarChartCommonSeriesSettings extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** An object that specifies configuration options for all series of the area type in the chart. */
        area?: any;
        /** An object that specifies configuration options for all series of the 'bar' type in the chart. */
        bar?: any;
        /** An object that specifies configuration options for all series of the 'line' type in the chart. */
        line?: any;
        /** An object that specifies configuration options for all series of the 'scatter' type in the chart. */
        scatter?: any;
        /** An object that specifies configuration options for all series of the 'stackedBar' type in the chart. */
        stackedbar?: any;
        /** Sets a series type. */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /** Specifies the options of a chart's legend. */
    export interface dxPolarChartLegend extends BaseChartLegend {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a legend item. */
        customizeHint?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** Specifies a callback function that returns the text to be displayed by legend items. */
        customizeText?: ((seriesInfo: { seriesName?: any, seriesIndex?: number, seriesColor?: string }) => string);
        /** Specifies what series elements to highlight when a corresponding item in the legend is hovered over. */
        hoverMode?: 'excludePoints' | 'includePoints' | 'none';
    }
    /** Specifies options for PolarChart widget series. */
    export interface dxPolarChartSeries extends dxPolarChartSeriesTypesCommonPolarChartSeries {
        /** Specifies the name that identifies the series. */
        name?: string;
        /** Specifies data about a series. */
        tag?: any;
        /** Sets the series type. */
        type?: 'area' | 'bar' | 'line' | 'scatter' | 'stackedbar';
    }
    /** Configures tooltips. */
    export interface dxPolarChartTooltip extends BaseChartTooltip {
        /** Specifies the kind of information to display in a tooltip. */
        shared?: boolean;
    }
    /** Specifies value axis options for the PolarChart widget. */
    export interface dxPolarChartValueAxis extends dxPolarChartCommonAxisSettings {
        /** Specifies a coefficient for dividing the value axis. */
        axisDivisionFactor?: number;
        /** Specifies the order in which discrete values are arranged on the value axis. */
        categories?: Array<number | string | Date>;
        /** Defines an array of the value axis constant lines. */
        constantLines?: Array<dxPolarChartValueAxisConstantLines>;
        /** Specifies whether to force the axis to start and end on ticks. */
        endOnTick?: boolean;
        /** Specifies options for value axis labels. */
        label?: dxPolarChartValueAxisLabel;
        /** Specifies the value to be raised to a power when generating ticks for a logarithmic axis. */
        logarithmBase?: number;
        /** Specifies a coefficient that determines the spacing between the maximum series point and the axis. */
        maxValueMargin?: number;
        /** Specifies the number of minor ticks between two neighboring major ticks. */
        minorTickCount?: number;
        /** Specifies the interval between minor ticks. */
        minorTickInterval?: any;
        /** Specifies a coefficient that determines the spacing between the minimum series point and the axis. */
        minValueMargin?: number;
        /** Specifies whether or not to indicate a zero value on the value axis. */
        showZero?: boolean;
        /** Specifies options for value axis strips. */
        strips?: Array<dxPolarChartValueAxisStrips>;
        /** An object defining the configuration options for axis ticks. */
        tick?: dxPolarChartValueAxisTick;
        /** Specifies an interval between axis ticks/grid lines. */
        tickInterval?: any;
        /** Specifies the required type of the value axis. */
        type?: 'continuous' | 'discrete' | 'logarithmic';
        /** Indicates whether to display series with indents from axis boundaries. */
        valueMarginsEnabled?: boolean;
        /** Specifies the desired type of axis values. */
        valueType?: 'datetime' | 'numeric' | 'string';
    }
    /** Defines an array of the value axis constant lines. */
    export interface dxPolarChartValueAxisConstantLines extends dxPolarChartCommonAxisSettingsConstantLineStyle {
        /** An object defining constant line label options. */
        label?: dxPolarChartValueAxisConstantLinesLabel;
        /** Specifies a value to be displayed by a constant line. */
        value?: number | Date | string;
    }
    /** An object defining constant line label options. */
    export interface dxPolarChartValueAxisConstantLinesLabel extends dxPolarChartCommonAxisSettingsConstantLineStyleLabel {
        /** Specifies the text to be displayed in a constant line label. */
        text?: string;
    }
    /** Specifies options for value axis labels. */
    export interface dxPolarChartValueAxisLabel extends dxPolarChartCommonAxisSettingsLabel {
        /** Specifies the text for a hint that appears when a user hovers the mouse pointer over a label on the value axis. */
        customizeHint?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** Specifies a callback function that returns the text to be displayed in value axis labels. */
        customizeText?: ((axisValue: { value?: Date | number | string, valueText?: string }) => string);
        /** Formats a value before it is displayed in an axis label. */
        format?: DevExpress.ui.format;
    }
    /** Specifies options for value axis strips. */
    export interface dxPolarChartValueAxisStrips extends dxPolarChartCommonAxisSettingsStripStyle {
        /** Specifies a color for a strip. */
        color?: string;
        /** Specifies an end value for a strip. */
        endValue?: number | Date | string;
        /** An object that defines the label configuration options of a strip. */
        label?: dxPolarChartValueAxisStripsLabel;
        /** Specifies a start value for a strip. */
        startValue?: number | Date | string;
    }
    /** An object that defines the label configuration options of a strip. */
    export interface dxPolarChartValueAxisStripsLabel extends dxPolarChartCommonAxisSettingsStripStyleLabel {
        /** Specifies the text displayed in a strip. */
        text?: string;
    }
    /** An object defining the configuration options for axis ticks. */
    export interface dxPolarChartValueAxisTick extends dxPolarChartCommonAxisSettingsTick {
        /** Indicates whether or not ticks are visible on an axis. */
        visible?: boolean;
    }
    export interface BaseChartOptions<T = BaseChart> extends BaseWidgetOptions<T> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: BaseChartAdaptiveLayout;
        /** Specifies animation options. */
        animation?: { enabled?: boolean, duration?: number, easing?: 'easeOutCubic' | 'linear', maxPointCountSupported?: number } | boolean;
        /** Customizes the appearance of an individual point label. */
        customizeLabel?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesLabel);
        /** Customizes the appearance of an individual series point. */
        customizePoint?: ((pointInfo: any) => dxChartSeriesTypesCommonSeriesPoint);
        /** Specifies the widget's data origin. */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** Specifies options of the legend. */
        legend?: BaseChartLegend;
        /** A function that is executed when all series are ready. */
        onDone?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the pointClick event. */
        onPointClick?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: basePointObject }) => any) | string;
        /** A handler for the pointHoverChanged event. */
        onPointHoverChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /** A handler for the pointSelectionChanged event. */
        onPointSelectionChanged?: ((e: { component?: any, element?: any, target?: basePointObject }) => any);
        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject }) => any);
        /** A handler for the tooltipShown event. */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: basePointObject }) => any);
        /** Sets the palette to be used for colorizing series and their elements. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies what to do with colors in the palette when their number is less than the number of series (in the Chart widget) or points in a series (in the PieChart widget). */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** Specifies whether a single point or multiple points can be selected in the chart. */
        pointSelectionMode?: 'multiple' | 'single';
        /** Specifies options for series. */
        series?: any | Array<any>;
        /** Configures tooltips. */
        tooltip?: BaseChartTooltip;
    }
    /** Specifies adaptive layout options. */
    interface BaseChartAdaptiveLayout {
        /** Specifies the widget's height small enough for the layout to begin adapting. */
        height?: number;
        /** Specifies whether or not point labels should be kept when the layout is adapting. */
        keepLabels?: boolean;
        /** Specifies the widget's width small enough for the layout to begin adapting. */
        width?: number;
    }
    /** Specifies options of the legend. */
    interface BaseChartLegend {
        /** Specifies a color for the legend's background. */
        backgroundColor?: string;
        /** Specifies legend border options. */
        border?: { visible?: boolean, width?: number, color?: string, cornerRadius?: number, opacity?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' };
        /** Specifies how many columns it takes to arrange legend items. */
        columnCount?: number;
        /** Specifies a blank space between legend columns in pixels. */
        columnItemSpacing?: number;
        /** Specifies font options for the text displayed in the legend. */
        font?: Font;
        /** Specifies a legend's position on the chart. */
        horizontalAlignment?: 'center' | 'left' | 'right';
        /** Specifies the alignment of legend items. */
        itemsAlignment?: 'center' | 'left' | 'right';
        /** Specifies the position of text relative to the item marker. */
        itemTextPosition?: 'bottom' | 'left' | 'right' | 'top';
        /** Specifies the distance between the legend and surrounding widget elements or container borders in pixels. */
        margin?: number | { top?: number, bottom?: number, left?: number, right?: number };
        /** Specifies the size of item markers in the legend in pixels. */
        markerSize?: number;
        /** Specifies whether to place legend items horizontally or vertically. */
        orientation?: 'horizontal' | 'vertical';
        /** Specifies a blank space between a legend's left/right boundaries and the inner item boundaries in pixels. */
        paddingLeftRight?: number;
        /** Specifies a blank space between a legend's top/bottom boundaries and the inner item boundaries in pixels. */
        paddingTopBottom?: number;
        /** Specifies how many rows it takes to arrange legend items. */
        rowCount?: number;
        /** Specifies a blank space between legend rows in pixels. */
        rowItemSpacing?: number;
        /** Specifies a legend's position on the chart. */
        verticalAlignment?: 'bottom' | 'top';
        /** Specifies the visibility state of the chart's legend. */
        visible?: boolean;
    }
    /** Configures tooltips. */
    interface BaseChartTooltip extends BaseWidgetTooltip {
        /** Formats the point argument before it is displayed in the tooltip. To format the point value, use the format option. */
        argumentFormat?: DevExpress.ui.format;
        /** Allows you to change tooltip appearance. */
        customizeTooltip?: ((pointInfo: any) => any);
    }
}
declare module DevExpress.viz.funnel {
    export interface dxFunnelOptions extends BaseWidgetOptions<dxFunnel> {
        /** Specifies adaptive layout options. */
        adaptiveLayout?: { width?: number, height?: number, keepLabels?: boolean };
        /** Specifies the algorithm for building the funnel. */
        algorithm?: 'dynamicHeight' | 'dynamicSlope';
        /** Specifies which data source field provides arguments for funnel items. The argument identifies a funnel item and represents it on the legend. */
        argumentField?: string;
        /** Specifies which data source field provides colors for funnel items. If this field is absent, the palette provides the colors. */
        colorField?: string;
        /** Specifies the widget's data origin. */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** Specifies whether funnel items change their style when a user pauses on them. */
        hoverEnabled?: boolean;
        /** Turns the funnel upside down. */
        inverted?: boolean;
        /** Configures funnel items' appearance. */
        item?: { border?: { visible?: boolean, width?: number, color?: string }, hoverStyle?: { border?: { visible?: boolean, width?: number, color?: string }, hatching?: { direction?: 'left' | 'none' | 'right', opacity?: number, step?: number, width?: number } }, selectionStyle?: { border?: { visible?: boolean, width?: number, color?: string }, hatching?: { opacity?: number, step?: number, width?: number, direction?: 'left' | 'none' | 'right' } } };
        /** Configures funnel item labels. */
        label?: { position?: 'columns' | 'inside' | 'outside', horizontalOffset?: number, horizontalAlignment?: 'left' | 'right', format?: DevExpress.ui.format, connector?: { visible?: boolean, width?: number, color?: string, opacity?: number }, backgroundColor?: string, border?: { visible?: boolean, width?: number, color?: string, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' }, visible?: boolean, showForZeroValues?: boolean, customizeText?: ((itemInfo: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => string), font?: Font };
        /** Configures the legend. */
        legend?: { verticalAlignment?: 'bottom' | 'top', horizontalAlignment?: 'center' | 'left' | 'right', orientation?: 'horizontal' | 'vertical', itemTextPosition?: 'bottom' | 'left' | 'right' | 'top', itemsAlignment?: 'center' | 'left' | 'right', visible?: boolean, margin?: number | { top?: number, bottom?: number, left?: number, right?: number }, markerSize?: number, backgroundColor?: string, border?: { visible?: boolean, width?: number, color?: string, cornerRadius?: number, opacity?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' }, paddingLeftRight?: number, paddingTopBottom?: number, columnCount?: number, rowCount?: number, columnItemSpacing?: number, rowItemSpacing?: number, customizeText?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string), customizeHint?: ((itemInfo: { item?: dxFunnelItem, text?: string }) => string), font?: Font };
        /** Specifies the ratio between the height of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is "dynamicHeight". */
        neckHeight?: number;
        /** Specifies the ratio between the width of the neck and that of the whole funnel. Accepts values from 0 to 1. Applies only if the algorithm is "dynamicHeight". */
        neckWidth?: number;
        /** A handler for the hoverChanged event. Executed after a funnel item's hover state is changed in the UI or programmatically. */
        onHoverChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /** A handler for the itemClick event. Executed when a user clicks a funnel item. */
        onItemClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, item?: dxFunnelItem }) => any) | string;
        /** A handler for the legendClick event. Executed when a user clicks a legend item. */
        onLegendClick?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, item?: dxFunnelItem }) => any) | string;
        /** A handler for the selectionChanged event. Executed after a funnel item's selection state is changed in the UI or programmatically. */
        onSelectionChanged?: ((e: { component?: dxFunnel, element?: DevExpress.core.dxElement, model?: any, item?: dxFunnelItem }) => any);
        /** Sets the palette to be used to colorize funnel items. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies what to do with colors in the palette when their number is less than the number of funnel items. */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** Specifies whether a single or multiple funnel items can be in the selected state at a time. Assigning "none" disables the selection feature. */
        selectionMode?: 'multiple' | 'none' | 'single';
        /** Specifies whether to sort funnel items. */
        sortData?: boolean;
        /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
        tooltip?: dxFunnelTooltip;
        /** Specifies which data source field provides values for funnel items. The value defines a funnel item's area. */
        valueField?: string;
    }
    /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
    export interface dxFunnelTooltip extends BaseWidgetTooltip {
        /** Customizes a specific tooltip's appearance. */
        customizeTooltip?: ((info: { item?: dxFunnelItem, value?: number, valueText?: string, percent?: number, percentText?: string }) => any);
    }
}
declare module DevExpress.viz.gauges {
    export interface BaseGaugeOptions<T = BaseGauge> extends BaseWidgetOptions<T> {
        /** Specifies animation options. */
        animation?: BaseGaugeAnimation;
        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;
        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** A handler for the tooltipShown event. */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** Specifies options of the gauge's range container. */
        rangeContainer?: BaseGaugeRangeContainer;
        /** Specifies options of the gauge's scale. */
        scale?: BaseGaugeScale;
        /** Specifies a set of subvalues to be designated by the subvalue indicators. */
        subvalues?: Array<number>;
        /** Configures tooltips. */
        tooltip?: BaseGaugeTooltip;
        /** Specifies the main value on a gauge. */
        value?: number;
    }
    /** Specifies animation options. */
    interface BaseGaugeAnimation {
        /** Determines how long animation runs. */
        duration?: number;
        /** Specifies the animation easing mode. */
        easing?: 'easeOutCubic' | 'linear';
        /** Indicates whether or not animation is enabled. */
        enabled?: boolean;
    }
    /** Specifies options of the gauge's range container. */
    interface BaseGaugeRangeContainer {
        /** Specifies a range container's background color. */
        backgroundColor?: string;
        /** Specifies the offset of the range container from an invisible scale line in pixels. */
        offset?: number;
        /** Specifies the palette to be used for colorizing ranges in the range container. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies what to do with colors in the palette when their number is less than the number of ranges in the range container. */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** An array of objects representing ranges contained in the range container. */
        ranges?: Array<{ startValue?: number, endValue?: number, color?: string }>;
    }
    /** Specifies options of the gauge's scale. */
    interface BaseGaugeScale {
        /** Specifies whether to allow decimal values on the scale. When false, the scale contains integer values only. */
        allowDecimals?: boolean;
        /** Specifies an array of custom minor ticks. */
        customMinorTicks?: Array<number>;
        /** Specifies an array of custom major ticks. */
        customTicks?: Array<number>;
        /** Specifies the end value for the scale of the gauge. */
        endValue?: number;
        /** Specifies common options for scale labels. */
        label?: BaseGaugeScaleLabel;
        /** Specifies options of the gauge's minor ticks. */
        minorTick?: { color?: string, opacity?: number, length?: number, width?: number, visible?: boolean };
        /** Specifies an interval between minor ticks. */
        minorTickInterval?: number;
        /** Specifies the start value for the scale of the gauge. */
        startValue?: number;
        /** Specifies options of the gauge's major ticks. */
        tick?: { color?: string, length?: number, width?: number, opacity?: number, visible?: boolean };
        /** Specifies an interval between major ticks. */
        tickInterval?: number;
    }
    /** Specifies common options for scale labels. */
    interface BaseGaugeScaleLabel {
        /** Specifies a callback function that returns the text to be displayed in scale labels. */
        customizeText?: ((scaleValue: { value?: number, valueText?: string }) => string);
        /** Specifies font options for the text displayed in the scale labels of the gauge. */
        font?: Font;
        /** Formats a value before it is displayed in a scale label. Accepts only numeric formats. */
        format?: DevExpress.ui.format;
        /** Decides how to arrange scale labels when there is not enough space to keep all of them. */
        overlappingBehavior?: 'hide' | 'none';
        /** Specifies whether or not scale labels should be colored similarly to their corresponding ranges in the range container. */
        useRangeColors?: boolean;
        /** Specifies whether or not scale labels are visible on the gauge. */
        visible?: boolean;
    }
    /** Configures tooltips. */
    interface BaseGaugeTooltip extends BaseWidgetTooltip {
        /** Allows you to change the appearance of specified tooltips. */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string }) => any);
    }
    export interface dxCircularGaugeOptions extends BaseGaugeOptions<dxCircularGauge> {
        /** Specifies the options required to set the geometry of the CircularGauge widget. */
        geometry?: { startAngle?: number, endAngle?: number };
        /** Specifies gauge range container options. */
        rangeContainer?: dxCircularGaugeRangeContainer;
        /** Specifies a gauge's scale options. */
        scale?: dxCircularGaugeScale;
        /** Specifies the appearance options of subvalue indicators. */
        subvalueIndicator?: dxCircularGaugeSubvalueIndicator;
        /** Specifies the appearance options of the value indicator. */
        valueIndicator?: dxCircularGaugeValueIndicator;
    }
    /** Specifies gauge range container options. */
    export interface dxCircularGaugeRangeContainer extends BaseGaugeRangeContainer {
        /** Specifies the orientation of the range container in the CircularGauge widget. */
        orientation?: 'center' | 'inside' | 'outside';
        /** Specifies the range container's width in pixels. */
        width?: number;
    }
    /** Specifies a gauge's scale options. */
    export interface dxCircularGaugeScale extends BaseGaugeScale {
        /** Specifies common options for scale labels. */
        label?: dxCircularGaugeScaleLabel;
        /** Specifies the orientation of scale ticks. */
        orientation?: 'center' | 'inside' | 'outside';
    }
    /** Specifies common options for scale labels. */
    export interface dxCircularGaugeScaleLabel extends BaseGaugeScaleLabel {
        /** Specifies which label to hide in case of overlapping. */
        hideFirstOrLast?: 'first' | 'last';
        /** Specifies the spacing between scale labels and ticks. */
        indentFromTick?: number;
    }
    /** Specifies the appearance options of subvalue indicators. */
    export interface dxCircularGaugeSubvalueIndicator extends CommonIndicator {
        /** Specifies the type of subvalue indicators. */
        type?: 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud';
    }
    /** Specifies the appearance options of the value indicator. */
    export interface dxCircularGaugeValueIndicator extends CommonIndicator {
        /** Specifies the value indicator type. */
        type?: 'rectangleNeedle' | 'triangleNeedle' | 'twoColorNeedle' | 'rangeBar' | 'triangleMarker' | 'textCloud';
    }
    export interface dxLinearGaugeOptions extends BaseGaugeOptions<dxLinearGauge> {
        /** Specifies the options required to set the geometry of the LinearGauge widget. */
        geometry?: { orientation?: 'horizontal' | 'vertical' };
        /** Specifies gauge range container options. */
        rangeContainer?: dxLinearGaugeRangeContainer;
        /** Specifies the gauge's scale options. */
        scale?: dxLinearGaugeScale;
        /** Specifies the appearance options of subvalue indicators. */
        subvalueIndicator?: dxLinearGaugeSubvalueIndicator;
        /** Specifies the appearance options of the value indicator. */
        valueIndicator?: dxLinearGaugeValueIndicator;
    }
    /** Specifies gauge range container options. */
    export interface dxLinearGaugeRangeContainer extends BaseGaugeRangeContainer {
        /** Specifies the orientation of the range container. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /** Specifies the orientation of the range container. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: 'bottom' | 'center' | 'top';
        /** Specifies the width of the range container's start and end boundaries in the LinearGauge widget. */
        width?: { start?: number, end?: number } | number;
    }
    /** Specifies the gauge's scale options. */
    export interface dxLinearGaugeScale extends BaseGaugeScale {
        /** Specifies the orientation of scale ticks. Applies only if the geometry.orientation option is "vertical". */
        horizontalOrientation?: 'center' | 'left' | 'right';
        /** Specifies common options for scale labels. */
        label?: dxLinearGaugeScaleLabel;
        /** Specifies the orientation of scale ticks. Applies only if the geometry.orientation option is "horizontal". */
        verticalOrientation?: 'bottom' | 'center' | 'top';
    }
    /** Specifies common options for scale labels. */
    export interface dxLinearGaugeScaleLabel extends BaseGaugeScaleLabel {
        /** Specifies the spacing between scale labels and ticks. */
        indentFromTick?: number;
    }
    /** Specifies the appearance options of subvalue indicators. */
    export interface dxLinearGaugeSubvalueIndicator extends CommonIndicator {
        /** Specifies the type of subvalue indicators. */
        type?: 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud';
    }
    /** Specifies the appearance options of the value indicator. */
    export interface dxLinearGaugeValueIndicator extends CommonIndicator {
        /** Specifies the type of the value indicator. */
        type?: 'rectangle' | 'circle' | 'rhombus' | 'rangeBar' | 'triangleMarker' | 'textCloud';
    }
    export interface dxBarGaugeOptions extends BaseWidgetOptions<dxBarGauge> {
        /** Specifies animation options. */
        animation?: any;
        /** Specifies a color for the remaining segment of the bar's track. */
        backgroundColor?: string;
        /** Specifies a distance between bars in pixels. */
        barSpacing?: number;
        /** Specifies a base value for bars. */
        baseValue?: number;
        /** Specifies an end value for the gauge's invisible scale. */
        endValue?: number;
        /** Defines the shape of the gauge's arc. */
        geometry?: { startAngle?: number, endAngle?: number };
        /** Specifies the options of the labels that accompany gauge bars. */
        label?: { visible?: boolean, indent?: number, connectorWidth?: number, connectorColor?: string, format?: DevExpress.ui.format, customizeText?: ((barValue: { value?: number, valueText?: string }) => string), font?: Font };
        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** A handler for the tooltipShown event. */
        onTooltipShown?: ((e: { component?: dxBarGauge, element?: DevExpress.core.dxElement, model?: any, target?: any }) => any);
        /** Sets the palette to be used for colorizing bars in the gauge. */
        palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office';
        /** Specifies what to do with colors in the palette when their number is less than the number of bars in the gauge. */
        paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate';
        /** Defines the radius of the bar that is closest to the center relatively to the radius of the topmost bar. */
        relativeInnerRadius?: number;
        /** Specifies a start value for the gauge's invisible scale. */
        startValue?: number;
        /** Configures tooltips. */
        tooltip?: dxBarGaugeTooltip;
        /** Specifies the array of values to be indicated on a bar gauge. */
        values?: Array<number>;
    }
    /** Configures tooltips. */
    export interface dxBarGaugeTooltip extends BaseWidgetTooltip {
        /** Allows you to change tooltip appearance. */
        customizeTooltip?: ((scaleValue: { value?: number, valueText?: string, index?: number }) => any);
    }
}
declare module DevExpress.viz.rangeSelector {
    export interface dxRangeSelectorOptions extends BaseWidgetOptions<dxRangeSelector> {
        /** Specifies the options for the range selector's background. */
        background?: { visible?: boolean, color?: string, image?: { url?: string, location?: 'center' | 'centerBottom' | 'centerTop' | 'full' | 'leftBottom' | 'leftCenter' | 'leftTop' | 'rightBottom' | 'rightCenter' | 'rightTop' } };
        /** Specifies the RangeSelector's behavior options. */
        behavior?: { animationEnabled?: boolean, snapToTicks?: boolean, moveSelectedRangeByClick?: boolean, manualRangeSelectionEnabled?: boolean, allowSlidersSwap?: boolean, callValueChanged?: 'onMoving' | 'onMovingComplete' };
        /** Specifies the options required to display a chart as the range selector's background. */
        chart?: { commonSeriesSettings?: DevExpress.viz.charts.dxChartCommonSeriesSettings, bottomIndent?: number, topIndent?: number, dataPrepareSettings?: { checkTypeForAllData?: boolean, convertToAxisDataType?: boolean, sortingMethod?: boolean | ((a: { arg?: Date | number | string, val?: Date | number | string }, b: { arg?: Date | number | string, val?: Date | number | string }) => number) }, useAggregation?: boolean, valueAxis?: { min?: number, max?: number, inverted?: boolean, valueType?: 'datetime' | 'numeric' | 'string', type?: 'continuous' | 'logarithmic', logarithmBase?: number }, series?: DevExpress.viz.charts.dxChartSeries | Array<DevExpress.viz.charts.dxChartSeries>, seriesTemplate?: { nameField?: string, customizeSeries?: ((seriesName: any) => DevExpress.viz.charts.dxChartSeries) }, equalBarWidth?: boolean, barWidth?: number, barGroupPadding?: number, barGroupWidth?: number, negativesAsZeroes?: boolean, palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate' };
        /** Specifies the color of the parent page element. */
        containerBackgroundColor?: string;
        /** Specifies a data source for the scale values and for the chart at the background. */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** Specifies the data source field that provides data for the scale. */
        dataSourceField?: string;
        /** Range selector's indent options. */
        indent?: { left?: number, right?: number };
        /** A handler for the valueChanged event. */
        onValueChanged?: ((e: { component?: dxRangeSelector, element?: DevExpress.core.dxElement, model?: any, value?: Array<number | string | Date>, previousValue?: Array<number | string | Date> }) => any);
        /** Specifies options of the range selector's scale. */
        scale?: { valueType?: 'datetime' | 'numeric' | 'string', type?: 'continuous' | 'discrete' | 'logarithmic' | 'semidiscrete', logarithmBase?: number, minorTickCount?: number, showCustomBoundaryTicks?: boolean, startValue?: number | Date | string, endValue?: number | Date | string, minorTickInterval?: number | any | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year', breaks?: Array<ScaleBreak>, workdaysOnly?: boolean, workWeek?: Array<number>, holidays?: Array<Date | string> | Array<number>, singleWorkdays?: Array<Date | string> | Array<number>, breakStyle?: { width?: number, color?: string, line?: 'straight' | 'waved' }, tickInterval?: number | any | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year', placeholderHeight?: number, minRange?: number | any | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year', maxRange?: number | any | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year', label?: { visible?: boolean, format?: DevExpress.ui.format, customizeText?: ((scaleValue: { value?: Date | number, valueText?: string }) => string), topIndent?: number, overlappingBehavior?: 'hide' | 'none', font?: Font }, tick?: { width?: number, color?: string, opacity?: number }, minorTick?: { width?: number, color?: string, opacity?: number, visible?: boolean }, marker?: { visible?: boolean, separatorHeight?: number, topIndent?: number, textLeftIndent?: number, textTopIndent?: number, label?: { format?: DevExpress.ui.format, customizeText?: ((markerValue: { value?: Date | number, valueText?: string }) => string) } }, categories?: Array<number | string | Date>, allowDecimals?: boolean, endOnTick?: boolean, aggregationGroupWidth?: number, aggregationInterval?: number | any | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' };
        /** Specifies the color of the selected range. */
        selectedRangeColor?: string;
        /** Specifies range selector shutter options. */
        shutter?: { color?: string, opacity?: number };
        /** Specifies the appearance of the range selector's slider handles. */
        sliderHandle?: { color?: string, width?: number, opacity?: number };
        /** Defines the options of the range selector slider markers. */
        sliderMarker?: { visible?: boolean, format?: DevExpress.ui.format, customizeText?: ((scaleValue: { value?: Date | number, valueText?: string }) => string), paddingTopBottom?: number, paddingLeftRight?: number, color?: string, invalidRangeColor?: string, placeholderHeight?: number, font?: Font };
        /** The selected range, initial or current. */
        value?: Array<number | string | Date>;
    }
}
declare module DevExpress.viz.sparklines {
    export interface BaseSparklineOptions<T = BaseSparkline> extends BaseWidgetOptions<T> {
        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** A handler for the tooltipShown event. */
        onTooltipShown?: ((e: { component?: T, element?: DevExpress.core.dxElement, model?: any }) => any);
        /** Configures the tooltip. */
        tooltip?: BaseSparklineTooltip;
    }
    /** Configures the tooltip. */
    interface BaseSparklineTooltip extends BaseWidgetTooltip {
        /** Allows you to change tooltip appearance. */
        customizeTooltip?: ((pointsInfo: any) => any);
        /** Enables tooltips. */
        enabled?: boolean;
    }
    export interface dxSparklineOptions extends BaseSparklineOptions<dxSparkline> {
        /** Specifies the data source field that provides arguments for a sparkline. */
        argumentField?: string;
        /** Sets a color for the bars indicating negative values. Available for a sparkline of the bar type only. */
        barNegativeColor?: string;
        /** Sets a color for the bars indicating positive values. Available for a sparkline of the bar type only. */
        barPositiveColor?: string;
        /** Specifies a data source for the sparkline. */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** Sets a color for the boundary of both the first and last points on a sparkline. */
        firstLastColor?: string;
        /** Specifies whether a sparkline ignores null data points or not. */
        ignoreEmptyPoints?: boolean;
        /** Sets a color for a line on a sparkline. Available for the sparklines of the line- and area-like types. */
        lineColor?: string;
        /** Specifies a width for a line on a sparkline. Available for the sparklines of the line- and area-like types. */
        lineWidth?: number;
        /** Sets a color for the bars indicating the values that are less than the winloss threshold. Available for a sparkline of the winloss type only. */
        lossColor?: string;
        /** Sets a color for the boundary of the maximum point on a sparkline. */
        maxColor?: string;
        /** Specifies the maximum value of the sparkline's value axis. */
        maxValue?: number;
        /** Sets a color for the boundary of the minimum point on a sparkline. */
        minColor?: string;
        /** Specifies the minimum value of the sparkline value axis. */
        minValue?: number;
        /** Sets a color for points on a sparkline. Available for the sparklines of the line- and area-like types. */
        pointColor?: string;
        /** Specifies the diameter of sparkline points in pixels. Available for the sparklines of line- and area-like types. */
        pointSize?: number;
        /** Specifies a symbol to use as a point marker on a sparkline. Available for the sparklines of the line- and area-like types. */
        pointSymbol?: 'circle' | 'cross' | 'polygon' | 'square' | 'triangle';
        /** Specifies whether or not to indicate both the first and last values on a sparkline. */
        showFirstLast?: boolean;
        /** Specifies whether or not to indicate both the minimum and maximum values on a sparkline. */
        showMinMax?: boolean;
        /** Determines the type of a sparkline. */
        type?: 'area' | 'bar' | 'line' | 'spline' | 'splinearea' | 'steparea' | 'stepline' | 'winloss';
        /** Specifies the data source field that provides values for a sparkline. */
        valueField?: string;
        /** Sets a color for the bars indicating the values greater than a winloss threshold. Available for a sparkline of the winloss type only. */
        winColor?: string;
        /** Specifies a value that serves as a threshold for the sparkline of the winloss type. */
        winlossThreshold?: number;
    }
    export interface dxBulletOptions extends BaseSparklineOptions<dxBullet> {
        /** Specifies a color for the bullet bar. */
        color?: string;
        /** Specifies an end value for the invisible scale. */
        endScaleValue?: number;
        /** Specifies whether or not to show the target line. */
        showTarget?: boolean;
        /** Specifies whether or not to show the line indicating zero on the invisible scale. */
        showZeroLevel?: boolean;
        /** Specifies a start value for the invisible scale. */
        startScaleValue?: number;
        /** Specifies the value indicated by the target line. */
        target?: number;
        /** Specifies a color for both the target and zero level lines. */
        targetColor?: string;
        /** Specifies the width of the target line. */
        targetWidth?: number;
        /** Specifies the primary value indicated by the bullet bar. */
        value?: number;
    }
}
declare module DevExpress.viz.map {
    /** Creates a new projection. */
    export function projection(data: { to?: Function, from?: Function, aspectRatio?: number }): any;
    export interface dxVectorMapOptions extends BaseWidgetOptions<dxVectorMap> {
        /** Specifies the options for the map background. */
        background?: { borderColor?: string, color?: string };
        /** Specifies the positioning of a map in geographical coordinates. */
        bounds?: Array<number>;
        /** Specifies the geographical coordinates of the center for a map. */
        center?: Array<number>;
        /** Specifies the options of the control bar. */
        controlBar?: { enabled?: boolean, borderColor?: string, color?: string, margin?: number, horizontalAlignment?: 'center' | 'left' | 'right', verticalAlignment?: 'bottom' | 'top', opacity?: number };
        /** Specifies options for VectorMap widget layers. */
        layers?: Array<{ name?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string, type?: 'area' | 'line' | 'marker', elementType?: 'bubble' | 'dot' | 'image' | 'pie', borderWidth?: number, borderColor?: string, color?: string, hoveredBorderWidth?: number, hoveredBorderColor?: string, hoveredColor?: string, selectedBorderWidth?: number, selectedBorderColor?: string, selectedColor?: string, opacity?: number, size?: number, minSize?: number, maxSize?: number, hoverEnabled?: boolean, selectionMode?: 'multiple' | 'none' | 'single', palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, colorGroups?: Array<number>, colorGroupingField?: string, sizeGroups?: Array<number>, sizeGroupingField?: string, dataField?: string, customize?: ((elements: Array<MapLayerElement>) => any), label?: { enabled?: boolean, dataField?: string, font?: Font } }> | { name?: string, dataSource?: any | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string, type?: 'area' | 'line' | 'marker', elementType?: 'bubble' | 'dot' | 'image' | 'pie', borderWidth?: number, borderColor?: string, color?: string, hoveredBorderWidth?: number, hoveredBorderColor?: string, hoveredColor?: string, selectedBorderWidth?: number, selectedBorderColor?: string, selectedColor?: string, opacity?: number, size?: number, minSize?: number, maxSize?: number, hoverEnabled?: boolean, selectionMode?: 'multiple' | 'none' | 'single', palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteSize?: number, colorGroups?: Array<number>, colorGroupingField?: string, sizeGroups?: Array<number>, sizeGroupingField?: string, dataField?: string, customize?: ((elements: Array<MapLayerElement>) => any), label?: { enabled?: boolean, dataField?: string, font?: Font } };
        /** Configures map legends. */
        legends?: Array<{ source?: { layer?: string, grouping?: string }, customizeText?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string), customizeHint?: ((itemInfo: { start?: number, end?: number, index?: number, color?: string, size?: number }) => string), verticalAlignment?: 'bottom' | 'top', horizontalAlignment?: 'center' | 'left' | 'right', orientation?: 'horizontal' | 'vertical', itemTextPosition?: 'bottom' | 'left' | 'right' | 'top', itemsAlignment?: 'center' | 'left' | 'right', visible?: boolean, margin?: number | { top?: number, bottom?: number, left?: number, right?: number }, markerSize?: number, markerColor?: string, markerShape?: 'circle' | 'square', backgroundColor?: string, border?: { visible?: boolean, width?: number, color?: string, cornerRadius?: number, opacity?: number, dashStyle?: 'dash' | 'dot' | 'longDash' | 'solid' }, paddingLeftRight?: number, paddingTopBottom?: number, columnCount?: number, rowCount?: number, columnItemSpacing?: number, rowItemSpacing?: number, font?: Font }>;
        /** Specifies a map's maximum zoom factor. */
        maxZoomFactor?: number;
        /** A handler for the centerChanged event. */
        onCenterChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, center?: Array<number> }) => any);
        /** A handler for the click event. */
        onClick?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, target?: MapLayerElement }) => any) | string;
        /** A handler for the selectionChanged event. */
        onSelectionChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** A handler for the tooltipHidden event. */
        onTooltipHidden?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** A handler for the tooltipShown event. */
        onTooltipShown?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, target?: MapLayerElement }) => any);
        /** A handler for the zoomFactorChanged event. */
        onZoomFactorChanged?: ((e: { component?: dxVectorMap, element?: DevExpress.core.dxElement, model?: any, zoomFactor?: number }) => any);
        /** Disables the panning capability. */
        panningEnabled?: boolean;
        /** Specifies the map projection. */
        projection?: any;
        /** Configures tooltips. */
        tooltip?: dxVectorMapTooltip;
        /** Specifies whether the map should respond to touch gestures. */
        touchEnabled?: boolean;
        /** Specifies whether or not the map should respond when a user rolls the mouse wheel. */
        wheelEnabled?: boolean;
        /** Specifies a number that is used to zoom a map initially. */
        zoomFactor?: number;
        /** Disables the zooming capability. */
        zoomingEnabled?: boolean;
    }
    /** Configures tooltips. */
    export interface dxVectorMapTooltip extends BaseWidgetTooltip {
        /** Specifies text and appearance of a set of tooltips. */
        customizeTooltip?: ((info: MapLayerElement) => any);
    }
}
declare module DevExpress.viz.map.projection {
    /** Gets the default or custom projection from the projection storage. */
    export function get(name: string): any;
    /** Adds a new projection to the internal projections storage. */
    export function add(name: string, projection: any): void;
}
declare module DevExpress.viz.treeMap {
    export interface dxTreeMapOptions extends BaseWidgetOptions<dxTreeMap> {
        /** Specifies the name of the data source field that provides nested items for a group. Applies to hierarchical data sources only. */
        childrenField?: string;
        /** Specifies the name of the data source field that provides colors for tiles. */
        colorField?: string;
        /** Manages the color settings. */
        colorizer?: { type?: 'discrete' | 'gradient' | 'none' | 'range', palette?: Array<string> | 'Bright' | 'Default' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office', paletteExtensionMode?: 'alternate' | 'blend' | 'extrapolate', colorizeGroups?: boolean, range?: Array<number>, colorCodeField?: string };
        /** Specifies the origin of data for the widget. */
        dataSource?: Array<any> | DevExpress.data.DataSource | DevExpress.data.DataSourceOptions | string;
        /** Configures groups. */
        group?: { headerHeight?: number, border?: { width?: number, color?: string }, color?: string, hoverStyle?: { border?: { width?: number, color?: string }, color?: string }, selectionStyle?: { border?: { width?: number, color?: string }, color?: string }, label?: { visible?: boolean, font?: Font }, hoverEnabled?: boolean };
        /** Specifies whether tiles and groups change their style when a user pauses on them. */
        hoverEnabled?: boolean;
        /** Specifies the name of the data source field that provides IDs for items. Applies to plain data sources only. */
        idField?: string;
        /** Specifies whether the user will interact with a single tile or its group. */
        interactWithGroup?: boolean;
        /** Specifies the name of the data source field that provides texts for tile and group labels. */
        labelField?: string;
        /** Specifies the layout algorithm. */
        layoutAlgorithm?: 'sliceanddice' | 'squarified' | 'strip' | ((e: { rect?: Array<number>, sum?: number, items?: Array<any> }) => any);
        /** Specifies the direction in which the items will be laid out. */
        layoutDirection?: 'leftBottomRightTop' | 'leftTopRightBottom' | 'rightBottomLeftTop' | 'rightTopLeftBottom';
        /** Specifies how many hierarchical levels must be visualized. */
        maxDepth?: number;
        /** A handler for the click event. */
        onClick?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, node?: dxTreeMapNode }) => any) | string;
        /** A handler for the drill event. */
        onDrill?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** A handler for the hoverChanged event. */
        onHoverChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** A handler for the nodesInitialized event. */
        onNodesInitialized?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, root?: dxTreeMapNode }) => any);
        /** A handler for the nodesRendering event. */
        onNodesRendering?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** A handler for the selectionChanged event. */
        onSelectionChanged?: ((e: { component?: dxTreeMap, element?: DevExpress.core.dxElement, model?: any, node?: dxTreeMapNode }) => any);
        /** Specifies the name of the data source field that provides parent IDs for items. Applies to plain data sources only. */
        parentField?: string;
        /** Decides whether those labels that overflow their tile/group should be hidden or truncated with ellipsis. */
        resolveLabelOverflow?: 'ellipsis' | 'hide';
        /** Specifies whether a single or multiple nodes can be in the selected state simultaneously. */
        selectionMode?: 'multiple' | 'none' | 'single';
        /** Configures tiles. */
        tile?: { border?: { width?: number, color?: string }, color?: string, hoverStyle?: { border?: { width?: number, color?: string }, color?: string }, selectionStyle?: { border?: { width?: number, color?: string }, color?: string }, label?: { visible?: boolean, font?: Font } };
        /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
        tooltip?: dxTreeMapTooltip;
        /** Specifies the name of the data source field that provides values for tiles. */
        valueField?: string;
    }
    /** Configures tooltips - small pop-up rectangles that display information about a data-visualizing widget element being pressed or hovered over with the mouse pointer. */
    export interface dxTreeMapTooltip extends BaseWidgetTooltip {
        /** Allows you to change tooltip appearance. */
        customizeTooltip?: ((info: { value?: number, valueText?: string, node?: dxTreeMapNode }) => any);
    }
}
