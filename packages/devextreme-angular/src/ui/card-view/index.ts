/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';

export { ExplicitTypes } from 'devextreme/ui/card_view';

import DataSource from 'devextreme/data/data_source';
import { CardCover, CardHeader, ColumnProperties, dxCardViewEditing, HeaderPanel, CardClickEvent, CardDblClickEvent, CardHoverChangedEvent, CardInsertedEvent, CardInsertingEvent, CardPreparedEvent, CardRemovedEvent, CardRemovingEvent, CardSavedEvent, CardSavingEvent, CardUpdatedEvent, CardUpdatingEvent, ContextMenuPreparingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, FieldCaptionClickEvent, FieldCaptionDblClickEvent, FieldCaptionPreparedEvent, FieldValueClickEvent, FieldValueDblClickEvent, FieldValuePreparedEvent, FocusedCardChanged, InitNewCardEvent, SelectionChangedEvent, SelectionChangingEvent, Paging, RemoteOperations, SelectionConfiguration, Toolbar } from 'devextreme/ui/card_view';
import { Mode } from 'devextreme/common';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxFilterBuilderOptions } from 'devextreme/ui/filter_builder';
import { dxLoadPanelOptions } from 'devextreme/ui/load_panel';
import { EventInfo } from 'devextreme/common/core/events';
import { Pager } from 'devextreme/common/grids';

import DxCardView from 'devextreme/ui/card_view';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoCardCoverModule } from 'devextreme-angular/ui/nested';
import { DxoCardHeaderModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoFormItemModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxiChangeModule } from 'devextreme-angular/ui/nested';
import { DxoFilterBuilderModule } from 'devextreme-angular/ui/nested';
import { DxiCustomOperationModule } from 'devextreme-angular/ui/nested';
import { DxiFieldModule } from 'devextreme-angular/ui/nested';
import { DxoLookupModule } from 'devextreme-angular/ui/nested';
import { DxoFilterOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoGroupOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoHeaderPanelModule } from 'devextreme-angular/ui/nested';
import { DxoLoadPanelModule } from 'devextreme-angular/ui/nested';
import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxoHideModule } from 'devextreme-angular/ui/nested';
import { DxoFromModule } from 'devextreme-angular/ui/nested';
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { DxoAtModule } from 'devextreme-angular/ui/nested';
import { DxoBoundaryOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoCollisionModule } from 'devextreme-angular/ui/nested';
import { DxoMyModule } from 'devextreme-angular/ui/nested';
import { DxoOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoToModule } from 'devextreme-angular/ui/nested';
import { DxoShowModule } from 'devextreme-angular/ui/nested';
import { DxoPagerModule } from 'devextreme-angular/ui/nested';
import { DxoPagingModule } from 'devextreme-angular/ui/nested';
import { DxoRemoteOperationsModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';

import { DxoCardViewAnimationModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewAsyncRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewAtModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewBoundaryOffsetModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardCoverModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardHeaderModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCardHeaderItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewChangeModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCollisionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewColumnModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCompareRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCustomOperationModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCustomRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewEditingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewEmailRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewFieldModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterBuilderModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterOperationDescriptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFormatModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFormItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFromModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewGroupOperationDescriptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewHeaderPanelModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewHideModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewLabelModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewLoadPanelModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewLookupModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewMyModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewNumericRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewOffsetModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewPagerModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewPagingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewPatternRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewPositionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewRangeRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewRemoteOperationsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewRequiredRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewSelectionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewShowModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewStringLengthRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewToModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewToolbarModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewToolbarItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewValidationRuleModule } from 'devextreme-angular/ui/card-view/nested';

import { DxiColumnComponent } from 'devextreme-angular/ui/nested';

import { DxiCardViewColumnComponent } from 'devextreme-angular/ui/card-view/nested';


/**
 * [descr:dxCardView]

 */
@Component({
    selector: 'dx-card-view',
    standalone: true,
    template: '',
    host: { ngSkipHydration: 'true' },
    imports: [ DxIntegrationModule ],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxCardViewComponent<TCardData = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxCardView<TCardData, TKey> = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.allowColumnReordering]
    
     */
    @Input()
    get allowColumnReordering(): boolean {
        return this._getOption('allowColumnReordering');
    }
    set allowColumnReordering(value: boolean) {
        this._setOption('allowColumnReordering', value);
    }


    /**
     * [descr:dxCardViewOptions.cardContentTemplate]
    
     */
    @Input()
    get cardContentTemplate(): any {
        return this._getOption('cardContentTemplate');
    }
    set cardContentTemplate(value: any) {
        this._setOption('cardContentTemplate', value);
    }


    /**
     * [descr:dxCardViewOptions.cardCover]
    
     */
    @Input()
    get cardCover(): CardCover {
        return this._getOption('cardCover');
    }
    set cardCover(value: CardCover) {
        this._setOption('cardCover', value);
    }


    /**
     * [descr:dxCardViewOptions.cardFooterTemplate]
    
     */
    @Input()
    get cardFooterTemplate(): any {
        return this._getOption('cardFooterTemplate');
    }
    set cardFooterTemplate(value: any) {
        this._setOption('cardFooterTemplate', value);
    }


    /**
     * [descr:dxCardViewOptions.cardHeader]
    
     */
    @Input()
    get cardHeader(): CardHeader {
        return this._getOption('cardHeader');
    }
    set cardHeader(value: CardHeader) {
        this._setOption('cardHeader', value);
    }


    /**
     * [descr:dxCardViewOptions.cardMaxWidth]
    
     */
    @Input()
    get cardMaxWidth(): number {
        return this._getOption('cardMaxWidth');
    }
    set cardMaxWidth(value: number) {
        this._setOption('cardMaxWidth', value);
    }


    /**
     * [descr:dxCardViewOptions.cardMinWidth]
    
     */
    @Input()
    get cardMinWidth(): number {
        return this._getOption('cardMinWidth');
    }
    set cardMinWidth(value: number) {
        this._setOption('cardMinWidth', value);
    }


    /**
     * [descr:dxCardViewOptions.cardsPerRow]
    
     */
    @Input()
    get cardsPerRow(): Mode | number {
        return this._getOption('cardsPerRow');
    }
    set cardsPerRow(value: Mode | number) {
        this._setOption('cardsPerRow', value);
    }


    /**
     * [descr:dxCardViewOptions.cardTemplate]
    
     */
    @Input()
    get cardTemplate(): any {
        return this._getOption('cardTemplate');
    }
    set cardTemplate(value: any) {
        this._setOption('cardTemplate', value);
    }


    /**
     * [descr:dxCardViewOptions.columnChooser]
    
     */
    @Input()
    get columnChooser(): Record<string, any> {
        return this._getOption('columnChooser');
    }
    set columnChooser(value: Record<string, any>) {
        this._setOption('columnChooser', value);
    }


    /**
     * [descr:dxCardViewOptions.columns]
    
     */
    @Input()
    get columns(): Array<ColumnProperties | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<ColumnProperties | string>) {
        this._setOption('columns', value);
    }


    /**
     * [descr:dxCardViewOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:dxCardViewOptions.editing]
    
     */
    @Input()
    get editing(): dxCardViewEditing {
        return this._getOption('editing');
    }
    set editing(value: dxCardViewEditing) {
        this._setOption('editing', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxCardViewOptions.errorRowEnabled]
    
     */
    @Input()
    get errorRowEnabled(): boolean {
        return this._getOption('errorRowEnabled');
    }
    set errorRowEnabled(value: boolean) {
        this._setOption('errorRowEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.fieldHintEnabled]
    
     */
    @Input()
    get fieldHintEnabled(): boolean {
        return this._getOption('fieldHintEnabled');
    }
    set fieldHintEnabled(value: boolean) {
        this._setOption('fieldHintEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.filterBuilder]
    
     */
    @Input()
    get filterBuilder(): dxFilterBuilderOptions {
        return this._getOption('filterBuilder');
    }
    set filterBuilder(value: dxFilterBuilderOptions) {
        this._setOption('filterBuilder', value);
    }


    /**
     * [descr:dxCardViewOptions.filterBuilderPopup]
    
     */
    @Input()
    get filterBuilderPopup(): Record<string, any> {
        return this._getOption('filterBuilderPopup');
    }
    set filterBuilderPopup(value: Record<string, any>) {
        this._setOption('filterBuilderPopup', value);
    }


    /**
     * [descr:dxCardViewOptions.filterPanel]
    
     */
    @Input()
    get filterPanel(): Record<string, any> {
        return this._getOption('filterPanel');
    }
    set filterPanel(value: Record<string, any>) {
        this._setOption('filterPanel', value);
    }


    /**
     * [descr:dxCardViewOptions.filterValue]
    
     */
    @Input()
    get filterValue(): Array<any> | Function | string {
        return this._getOption('filterValue');
    }
    set filterValue(value: Array<any> | Function | string) {
        this._setOption('filterValue', value);
    }


    /**
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): Record<string, any> {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: Record<string, any>) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:dxCardViewOptions.headerPanel]
    
     */
    @Input()
    get headerPanel(): HeaderPanel {
        return this._getOption('headerPanel');
    }
    set headerPanel(value: HeaderPanel) {
        this._setOption('headerPanel', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:dxCardViewOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Array<string> | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Array<string> | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:dxCardViewOptions.loadPanel]
    
     */
    @Input()
    get loadPanel(): dxLoadPanelOptions {
        return this._getOption('loadPanel');
    }
    set loadPanel(value: dxLoadPanelOptions) {
        this._setOption('loadPanel', value);
    }


    /**
     * [descr:dxCardViewOptions.noDataTemplate]
    
     */
    @Input()
    get noDataTemplate(): any {
        return this._getOption('noDataTemplate');
    }
    set noDataTemplate(value: any) {
        this._setOption('noDataTemplate', value);
    }


    /**
     * [descr:dxCardViewOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    /**
     * [descr:dxCardViewOptions.pager]
    
     */
    @Input()
    get pager(): Pager {
        return this._getOption('pager');
    }
    set pager(value: Pager) {
        this._setOption('pager', value);
    }


    /**
     * [descr:dxCardViewOptions.paging]
    
     */
    @Input()
    get paging(): Paging {
        return this._getOption('paging');
    }
    set paging(value: Paging) {
        this._setOption('paging', value);
    }


    /**
     * [descr:dxCardViewOptions.remoteOperations]
    
     */
    @Input()
    get remoteOperations(): boolean | Mode | RemoteOperations {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean | Mode | RemoteOperations) {
        this._setOption('remoteOperations', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxCardViewOptions.scrolling]
    
     */
    @Input()
    get scrolling(): Record<string, any> {
        return this._getOption('scrolling');
    }
    set scrolling(value: Record<string, any>) {
        this._setOption('scrolling', value);
    }


    /**
     * [descr:dxCardViewOptions.searchPanel]
    
     */
    @Input()
    get searchPanel(): Record<string, any> {
        return this._getOption('searchPanel');
    }
    set searchPanel(value: Record<string, any>) {
        this._setOption('searchPanel', value);
    }


    /**
     * [descr:dxCardViewOptions.selectedCardKeys]
    
     */
    @Input()
    get selectedCardKeys(): Array<any> {
        return this._getOption('selectedCardKeys');
    }
    set selectedCardKeys(value: Array<any>) {
        this._setOption('selectedCardKeys', value);
    }


    /**
     * [descr:dxCardViewOptions.selection]
    
     */
    @Input()
    get selection(): SelectionConfiguration {
        return this._getOption('selection');
    }
    set selection(value: SelectionConfiguration) {
        this._setOption('selection', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxCardViewOptions.toolbar]
    
     */
    @Input()
    get toolbar(): Toolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: Toolbar) {
        this._setOption('toolbar', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxCardViewOptions.wordWrapEnabled]
    
     */
    @Input()
    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }

    /**
    
     * [descr:dxCardViewOptions.onCardClick]
    
    
     */
    @Output() onCardClick: EventEmitter<CardClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardDblClick]
    
    
     */
    @Output() onCardDblClick: EventEmitter<CardDblClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardHoverChanged]
    
    
     */
    @Output() onCardHoverChanged: EventEmitter<CardHoverChangedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardInserted]
    
    
     */
    @Output() onCardInserted: EventEmitter<CardInsertedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardInserting]
    
    
     */
    @Output() onCardInserting: EventEmitter<CardInsertingEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardPrepared]
    
    
     */
    @Output() onCardPrepared: EventEmitter<CardPreparedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardRemoved]
    
    
     */
    @Output() onCardRemoved: EventEmitter<CardRemovedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardRemoving]
    
    
     */
    @Output() onCardRemoving: EventEmitter<CardRemovingEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardSaved]
    
    
     */
    @Output() onCardSaved: EventEmitter<CardSavedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardSaving]
    
    
     */
    @Output() onCardSaving: EventEmitter<CardSavingEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardUpdated]
    
    
     */
    @Output() onCardUpdated: EventEmitter<CardUpdatedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onCardUpdating]
    
    
     */
    @Output() onCardUpdating: EventEmitter<CardUpdatingEvent>;

    /**
    
     * [descr:WidgetOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:dxCardViewOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxCardViewOptions.onDataErrorOccurred]
    
    
     */
    @Output() onDataErrorOccurred: EventEmitter<Object>;

    /**
    
     * [descr:DOMComponentOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:dxCardViewOptions.onEditCanceled]
    
    
     */
    @Output() onEditCanceled: EventEmitter<EditCanceledEvent>;

    /**
    
     * [descr:dxCardViewOptions.onEditCanceling]
    
    
     */
    @Output() onEditCanceling: EventEmitter<EditCancelingEvent>;

    /**
    
     * [descr:dxCardViewOptions.onEditingStart]
    
    
     */
    @Output() onEditingStart: EventEmitter<EditingStartEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldCaptionClick]
    
    
     */
    @Output() onFieldCaptionClick: EventEmitter<FieldCaptionClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldCaptionDblClick]
    
    
     */
    @Output() onFieldCaptionDblClick: EventEmitter<FieldCaptionDblClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldCaptionPrepared]
    
    
     */
    @Output() onFieldCaptionPrepared: EventEmitter<FieldCaptionPreparedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldValueClick]
    
    
     */
    @Output() onFieldValueClick: EventEmitter<FieldValueClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldValueDblClick]
    
    
     */
    @Output() onFieldValueDblClick: EventEmitter<FieldValueDblClickEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFieldValuePrepared]
    
    
     */
    @Output() onFieldValuePrepared: EventEmitter<FieldValuePreparedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onFocusedCardChanged]
    
    
     */
    @Output() onFocusedCardChanged: EventEmitter<FocusedCardChanged>;

    /**
    
     * [descr:ComponentOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<Object>;

    /**
    
     * [descr:dxCardViewOptions.onInitNewCard]
    
    
     */
    @Output() onInitNewCard: EventEmitter<InitNewCardEvent>;

    /**
    
     * [descr:DOMComponentOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<Object>;

    /**
    
     * [descr:dxCardViewOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxCardViewOptions.onSelectionChanging]
    
    
     */
    @Output() onSelectionChanging: EventEmitter<SelectionChangingEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowColumnReorderingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardContentTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardCoverChange: EventEmitter<CardCover>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardFooterTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardHeaderChange: EventEmitter<CardHeader>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardMaxWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardMinWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardsPerRowChange: EventEmitter<Mode | number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cardTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnChooserChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnsChange: EventEmitter<Array<ColumnProperties | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editingChange: EventEmitter<dxCardViewEditing>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() errorRowEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fieldHintEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderChange: EventEmitter<dxFilterBuilderOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderPopupChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValueChange: EventEmitter<Array<any> | Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerPanelChange: EventEmitter<HeaderPanel>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyExprChange: EventEmitter<Array<string> | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadPanelChange: EventEmitter<dxLoadPanelOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagerChange: EventEmitter<Pager>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagingChange: EventEmitter<Paging>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() remoteOperationsChange: EventEmitter<boolean | Mode | RemoteOperations>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedCardKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionChange: EventEmitter<SelectionConfiguration>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<Toolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wordWrapEnabledChange: EventEmitter<boolean>;




    @ContentChildren(DxiCardViewColumnComponent)
    get columnsChildren(): QueryList<DxiCardViewColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this._setChildren('columns', value, 'DxiCardViewColumnComponent');
    }


    @ContentChildren(DxiColumnComponent)
    get columnsLegacyChildren(): QueryList<DxiColumnComponent> {
        return this._getOption('columns');
    }
    set columnsLegacyChildren(value) {
        this._setChildren('columns', value, 'DxiColumnComponent');
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'cardClick', emit: 'onCardClick' },
            { subscribe: 'cardDblClick', emit: 'onCardDblClick' },
            { subscribe: 'cardHoverChanged', emit: 'onCardHoverChanged' },
            { subscribe: 'cardInserted', emit: 'onCardInserted' },
            { subscribe: 'cardInserting', emit: 'onCardInserting' },
            { subscribe: 'cardPrepared', emit: 'onCardPrepared' },
            { subscribe: 'cardRemoved', emit: 'onCardRemoved' },
            { subscribe: 'cardRemoving', emit: 'onCardRemoving' },
            { subscribe: 'cardSaved', emit: 'onCardSaved' },
            { subscribe: 'cardSaving', emit: 'onCardSaving' },
            { subscribe: 'cardUpdated', emit: 'onCardUpdated' },
            { subscribe: 'cardUpdating', emit: 'onCardUpdating' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
            { subscribe: 'dataErrorOccurred', emit: 'onDataErrorOccurred' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'editCanceled', emit: 'onEditCanceled' },
            { subscribe: 'editCanceling', emit: 'onEditCanceling' },
            { subscribe: 'editingStart', emit: 'onEditingStart' },
            { subscribe: 'fieldCaptionClick', emit: 'onFieldCaptionClick' },
            { subscribe: 'fieldCaptionDblClick', emit: 'onFieldCaptionDblClick' },
            { subscribe: 'fieldCaptionPrepared', emit: 'onFieldCaptionPrepared' },
            { subscribe: 'fieldValueClick', emit: 'onFieldValueClick' },
            { subscribe: 'fieldValueDblClick', emit: 'onFieldValueDblClick' },
            { subscribe: 'fieldValuePrepared', emit: 'onFieldValuePrepared' },
            { subscribe: 'focusedCardChanged', emit: 'onFocusedCardChanged' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'initNewCard', emit: 'onInitNewCard' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'selectionChanging', emit: 'onSelectionChanging' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowColumnReorderingChange' },
            { emit: 'cardContentTemplateChange' },
            { emit: 'cardCoverChange' },
            { emit: 'cardFooterTemplateChange' },
            { emit: 'cardHeaderChange' },
            { emit: 'cardMaxWidthChange' },
            { emit: 'cardMinWidthChange' },
            { emit: 'cardsPerRowChange' },
            { emit: 'cardTemplateChange' },
            { emit: 'columnChooserChange' },
            { emit: 'columnsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'errorRowEnabledChange' },
            { emit: 'fieldHintEnabledChange' },
            { emit: 'filterBuilderChange' },
            { emit: 'filterBuilderPopupChange' },
            { emit: 'filterPanelChange' },
            { emit: 'filterValueChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'headerFilterChange' },
            { emit: 'headerPanelChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'keyExprChange' },
            { emit: 'loadPanelChange' },
            { emit: 'noDataTemplateChange' },
            { emit: 'noDataTextChange' },
            { emit: 'pagerChange' },
            { emit: 'pagingChange' },
            { emit: 'remoteOperationsChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollingChange' },
            { emit: 'searchPanelChange' },
            { emit: 'selectedCardKeysChange' },
            { emit: 'selectionChange' },
            { emit: 'tabIndexChange' },
            { emit: 'toolbarChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wordWrapEnabledChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxCardView(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('columns', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('filterValue', changes);
        this.setupChanges('keyExpr', changes);
        this.setupChanges('selectedCardKeys', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('columns');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('filterValue');
        this._idh.doCheck('keyExpr');
        this._idh.doCheck('selectedCardKeys');
        this._watcherHelper.checkWatchers();
        super.ngDoCheck();
        super.clearChangedOptions();
    }

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxCardViewComponent,
    DxoCardCoverModule,
    DxoCardHeaderModule,
    DxiItemModule,
    DxiColumnModule,
    DxoFormatModule,
    DxoFormItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoEditingModule,
    DxiChangeModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoLookupModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoHeaderPanelModule,
    DxoLoadPanelModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoShowModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoSelectionModule,
    DxoToolbarModule,
    DxoCardViewAnimationModule,
    DxiCardViewAsyncRuleModule,
    DxoCardViewAtModule,
    DxoCardViewBoundaryOffsetModule,
    DxoCardViewCardCoverModule,
    DxoCardViewCardHeaderModule,
    DxiCardViewCardHeaderItemModule,
    DxiCardViewChangeModule,
    DxoCardViewCollisionModule,
    DxiCardViewColumnModule,
    DxiCardViewCompareRuleModule,
    DxiCardViewCustomOperationModule,
    DxiCardViewCustomRuleModule,
    DxoCardViewEditingModule,
    DxiCardViewEmailRuleModule,
    DxiCardViewFieldModule,
    DxoCardViewFilterBuilderModule,
    DxoCardViewFilterOperationDescriptionsModule,
    DxoCardViewFormatModule,
    DxoCardViewFormItemModule,
    DxoCardViewFromModule,
    DxoCardViewGroupOperationDescriptionsModule,
    DxoCardViewHeaderPanelModule,
    DxoCardViewHideModule,
    DxiCardViewItemModule,
    DxoCardViewLabelModule,
    DxoCardViewLoadPanelModule,
    DxoCardViewLookupModule,
    DxoCardViewMyModule,
    DxiCardViewNumericRuleModule,
    DxoCardViewOffsetModule,
    DxoCardViewPagerModule,
    DxoCardViewPagingModule,
    DxiCardViewPatternRuleModule,
    DxoCardViewPositionModule,
    DxiCardViewRangeRuleModule,
    DxoCardViewRemoteOperationsModule,
    DxiCardViewRequiredRuleModule,
    DxoCardViewSelectionModule,
    DxoCardViewShowModule,
    DxiCardViewStringLengthRuleModule,
    DxoCardViewToModule,
    DxoCardViewToolbarModule,
    DxiCardViewToolbarItemModule,
    DxiCardViewValidationRuleModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxCardViewComponent,
    DxoCardCoverModule,
    DxoCardHeaderModule,
    DxiItemModule,
    DxiColumnModule,
    DxoFormatModule,
    DxoFormItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoEditingModule,
    DxiChangeModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoLookupModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoHeaderPanelModule,
    DxoLoadPanelModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoToModule,
    DxoShowModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoSelectionModule,
    DxoToolbarModule,
    DxoCardViewAnimationModule,
    DxiCardViewAsyncRuleModule,
    DxoCardViewAtModule,
    DxoCardViewBoundaryOffsetModule,
    DxoCardViewCardCoverModule,
    DxoCardViewCardHeaderModule,
    DxiCardViewCardHeaderItemModule,
    DxiCardViewChangeModule,
    DxoCardViewCollisionModule,
    DxiCardViewColumnModule,
    DxiCardViewCompareRuleModule,
    DxiCardViewCustomOperationModule,
    DxiCardViewCustomRuleModule,
    DxoCardViewEditingModule,
    DxiCardViewEmailRuleModule,
    DxiCardViewFieldModule,
    DxoCardViewFilterBuilderModule,
    DxoCardViewFilterOperationDescriptionsModule,
    DxoCardViewFormatModule,
    DxoCardViewFormItemModule,
    DxoCardViewFromModule,
    DxoCardViewGroupOperationDescriptionsModule,
    DxoCardViewHeaderPanelModule,
    DxoCardViewHideModule,
    DxiCardViewItemModule,
    DxoCardViewLabelModule,
    DxoCardViewLoadPanelModule,
    DxoCardViewLookupModule,
    DxoCardViewMyModule,
    DxiCardViewNumericRuleModule,
    DxoCardViewOffsetModule,
    DxoCardViewPagerModule,
    DxoCardViewPagingModule,
    DxiCardViewPatternRuleModule,
    DxoCardViewPositionModule,
    DxiCardViewRangeRuleModule,
    DxoCardViewRemoteOperationsModule,
    DxiCardViewRequiredRuleModule,
    DxoCardViewSelectionModule,
    DxoCardViewShowModule,
    DxiCardViewStringLengthRuleModule,
    DxoCardViewToModule,
    DxoCardViewToolbarModule,
    DxiCardViewToolbarItemModule,
    DxiCardViewValidationRuleModule,
    DxTemplateModule
  ]
})
export class DxCardViewModule { }

export * from 'devextreme-angular/ui/card-view/nested';

import type * as DxCardViewTypes from "devextreme/ui/card_view_types";
export { DxCardViewTypes };


