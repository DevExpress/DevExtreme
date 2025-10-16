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
import { CardCover, CardHeader, ColumnProperties, dxCardViewEditing, HeaderPanel, CardClickEvent, CardDblClickEvent, CardHoverChangedEvent, CardInsertedEvent, CardInsertingEvent, CardPreparedEvent, CardRemovedEvent, CardRemovingEvent, CardSavedEvent, CardSavingEvent, CardUpdatedEvent, CardUpdatingEvent, ContextMenuPreparingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, FieldCaptionClickEvent, FieldCaptionDblClickEvent, FieldCaptionPreparedEvent, FieldValueClickEvent, FieldValueDblClickEvent, FieldValuePreparedEvent, FocusedCardChanged, InitNewCardEvent, SelectionChangedEvent, Paging, RemoteOperations, SelectionConfiguration, dxCardViewToolbar } from 'devextreme/ui/card_view';
import { Mode, ScrollbarMode } from 'devextreme/common';
import { ColumnChooser, FilterPanel, HeaderFilter, Pager, SearchPanel, Sorting } from 'devextreme/common/grids';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxFilterBuilderOptions } from 'devextreme/ui/filter_builder';
import { dxLoadPanelOptions } from 'devextreme/ui/load_panel';
import { EventInfo } from 'devextreme/common/core/events';

import DxCardView from 'devextreme/ui/card_view';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper,
    CollectionNestedOption,
} from 'devextreme-angular/core';


import { DxoCardViewAnimationModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewAsyncRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewAtModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewBoundaryOffsetModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewButtonItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewButtonOptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardCoverModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardHeaderModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCardHeaderItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardViewHeaderFilterModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardViewHeaderFilterSearchModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardViewHeaderFilterTextsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCardViewSelectionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewChangeModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColCountByScreenModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewCollisionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewColumnModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColumnChooserModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColumnChooserSearchModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColumnChooserSelectionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColumnHeaderFilterModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewColumnHeaderFilterSearchModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCompareRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCustomOperationModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewCustomRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewDraggingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewEditingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewEditingTextsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewEmailRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewEmptyItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewFieldModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterBuilderModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterOperationDescriptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterPanelModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFilterPanelTextsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFormModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFormatModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFormItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewFromModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewGroupItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewGroupOperationDescriptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewHeaderFilterModule } from 'devextreme-angular/ui/card-view/nested';
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
import { DxoCardViewScrollingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewSearchModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewSearchPanelModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewSelectionModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewShowModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewSimpleItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewSortingModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewStringLengthRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewTabModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewTabbedItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewTabPanelOptionsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewTabPanelOptionsItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewTextsModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewToModule } from 'devextreme-angular/ui/card-view/nested';
import { DxoCardViewToolbarModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewToolbarItemModule } from 'devextreme-angular/ui/card-view/nested';
import { DxiCardViewValidationRuleModule } from 'devextreme-angular/ui/card-view/nested';
import { 
           PROPERTY_TOKEN_validationRules,
           PROPERTY_TOKEN_items,
           PROPERTY_TOKEN_changes,
           PROPERTY_TOKEN_columns,
           PROPERTY_TOKEN_customOperations,
           PROPERTY_TOKEN_fields,
           PROPERTY_TOKEN_tabs,
     } from 'devextreme-angular/core/tokens';



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

    @ContentChildren(PROPERTY_TOKEN_validationRules)
    set _validationRulesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('validationRules', value);
    }

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }

    @ContentChildren(PROPERTY_TOKEN_changes)
    set _changesContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('changes', value);
    }

    @ContentChildren(PROPERTY_TOKEN_columns)
    set _columnsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('columns', value);
    }

    @ContentChildren(PROPERTY_TOKEN_customOperations)
    set _customOperationsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('customOperations', value);
    }

    @ContentChildren(PROPERTY_TOKEN_fields)
    set _fieldsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('fields', value);
    }

    @ContentChildren(PROPERTY_TOKEN_tabs)
    set _tabsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('tabs', value);
    }

    instance: DxCardView<TCardData, TKey> = null;

    
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    
    @Input()
    get allowColumnReordering(): boolean {
        return this._getOption('allowColumnReordering');
    }
    set allowColumnReordering(value: boolean) {
        this._setOption('allowColumnReordering', value);
    }


    
    @Input()
    get cardContentTemplate(): any {
        return this._getOption('cardContentTemplate');
    }
    set cardContentTemplate(value: any) {
        this._setOption('cardContentTemplate', value);
    }


    
    @Input()
    get cardCover(): CardCover {
        return this._getOption('cardCover');
    }
    set cardCover(value: CardCover) {
        this._setOption('cardCover', value);
    }


    
    @Input()
    get cardFooterTemplate(): any {
        return this._getOption('cardFooterTemplate');
    }
    set cardFooterTemplate(value: any) {
        this._setOption('cardFooterTemplate', value);
    }


    
    @Input()
    get cardHeader(): CardHeader {
        return this._getOption('cardHeader');
    }
    set cardHeader(value: CardHeader) {
        this._setOption('cardHeader', value);
    }


    
    @Input()
    get cardMaxWidth(): number {
        return this._getOption('cardMaxWidth');
    }
    set cardMaxWidth(value: number) {
        this._setOption('cardMaxWidth', value);
    }


    
    @Input()
    get cardMinWidth(): number {
        return this._getOption('cardMinWidth');
    }
    set cardMinWidth(value: number) {
        this._setOption('cardMinWidth', value);
    }


    
    @Input()
    get cardsPerRow(): Mode | number {
        return this._getOption('cardsPerRow');
    }
    set cardsPerRow(value: Mode | number) {
        this._setOption('cardsPerRow', value);
    }


    
    @Input()
    get cardTemplate(): any {
        return this._getOption('cardTemplate');
    }
    set cardTemplate(value: any) {
        this._setOption('cardTemplate', value);
    }


    
    @Input()
    get columnChooser(): ColumnChooser {
        return this._getOption('columnChooser');
    }
    set columnChooser(value: ColumnChooser) {
        this._setOption('columnChooser', value);
    }


    
    @Input()
    get columns(): Array<ColumnProperties | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<ColumnProperties | string>) {
        this._setOption('columns', value);
    }


    
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | Store | string) {
        this._setOption('dataSource', value);
    }


    
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    
    @Input()
    get editing(): dxCardViewEditing {
        return this._getOption('editing');
    }
    set editing(value: dxCardViewEditing) {
        this._setOption('editing', value);
    }


    
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    
    @Input()
    get errorRowEnabled(): boolean {
        return this._getOption('errorRowEnabled');
    }
    set errorRowEnabled(value: boolean) {
        this._setOption('errorRowEnabled', value);
    }


    
    @Input()
    get fieldHintEnabled(): boolean {
        return this._getOption('fieldHintEnabled');
    }
    set fieldHintEnabled(value: boolean) {
        this._setOption('fieldHintEnabled', value);
    }


    
    @Input()
    get filterBuilder(): dxFilterBuilderOptions {
        return this._getOption('filterBuilder');
    }
    set filterBuilder(value: dxFilterBuilderOptions) {
        this._setOption('filterBuilder', value);
    }


    
    @Input()
    get filterBuilderPopup(): Record<string, any> {
        return this._getOption('filterBuilderPopup');
    }
    set filterBuilderPopup(value: Record<string, any>) {
        this._setOption('filterBuilderPopup', value);
    }


    
    @Input()
    get filterPanel(): FilterPanel {
        return this._getOption('filterPanel');
    }
    set filterPanel(value: FilterPanel) {
        this._setOption('filterPanel', value);
    }


    
    @Input()
    get filterValue(): Array<any> | Function | string {
        return this._getOption('filterValue');
    }
    set filterValue(value: Array<any> | Function | string) {
        this._setOption('filterValue', value);
    }


    
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    
    @Input()
    get headerFilter(): HeaderFilter {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: HeaderFilter) {
        this._setOption('headerFilter', value);
    }


    
    @Input()
    get headerPanel(): HeaderPanel {
        return this._getOption('headerPanel');
    }
    set headerPanel(value: HeaderPanel) {
        this._setOption('headerPanel', value);
    }


    
    @Input()
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
        this._setOption('height', value);
    }


    
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    
    @Input()
    get keyExpr(): Array<string> | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Array<string> | string) {
        this._setOption('keyExpr', value);
    }


    
    @Input()
    get loadPanel(): dxLoadPanelOptions {
        return this._getOption('loadPanel');
    }
    set loadPanel(value: dxLoadPanelOptions) {
        this._setOption('loadPanel', value);
    }


    
    @Input()
    get noDataTemplate(): any {
        return this._getOption('noDataTemplate');
    }
    set noDataTemplate(value: any) {
        this._setOption('noDataTemplate', value);
    }


    
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    
    @Input()
    get pager(): Pager {
        return this._getOption('pager');
    }
    set pager(value: Pager) {
        this._setOption('pager', value);
    }


    
    @Input()
    get paging(): Paging {
        return this._getOption('paging');
    }
    set paging(value: Paging) {
        this._setOption('paging', value);
    }


    
    @Input()
    get remoteOperations(): boolean | Mode | RemoteOperations {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean | Mode | RemoteOperations) {
        this._setOption('remoteOperations', value);
    }


    
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    
    @Input()
    get scrolling(): { scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: boolean | Mode } {
        return this._getOption('scrolling');
    }
    set scrolling(value: { scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: boolean | Mode }) {
        this._setOption('scrolling', value);
    }


    
    @Input()
    get searchPanel(): SearchPanel {
        return this._getOption('searchPanel');
    }
    set searchPanel(value: SearchPanel) {
        this._setOption('searchPanel', value);
    }


    
    @Input()
    get selectedCardKeys(): Array<any> {
        return this._getOption('selectedCardKeys');
    }
    set selectedCardKeys(value: Array<any>) {
        this._setOption('selectedCardKeys', value);
    }


    
    @Input()
    get selection(): SelectionConfiguration {
        return this._getOption('selection');
    }
    set selection(value: SelectionConfiguration) {
        this._setOption('selection', value);
    }


    
    @Input()
    get sorting(): Sorting {
        return this._getOption('sorting');
    }
    set sorting(value: Sorting) {
        this._setOption('sorting', value);
    }


    
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    
    @Input()
    get toolbar(): dxCardViewToolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxCardViewToolbar) {
        this._setOption('toolbar', value);
    }


    
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    
    @Input()
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }


    
    @Input()
    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardClick: EventEmitter<CardClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardDblClick: EventEmitter<CardDblClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardHoverChanged: EventEmitter<CardHoverChangedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardInserted: EventEmitter<CardInsertedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardInserting: EventEmitter<CardInsertingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardPrepared: EventEmitter<CardPreparedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardRemoved: EventEmitter<CardRemovedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardRemoving: EventEmitter<CardRemovingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardSaved: EventEmitter<CardSavedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardSaving: EventEmitter<CardSavingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardUpdated: EventEmitter<CardUpdatedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onCardUpdating: EventEmitter<CardUpdatingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onContentReady: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onDataErrorOccurred: EventEmitter<Object>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onDisposing: EventEmitter<EventInfo<any>>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onEditCanceled: EventEmitter<EditCanceledEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onEditCanceling: EventEmitter<EditCancelingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onEditingStart: EventEmitter<EditingStartEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldCaptionClick: EventEmitter<FieldCaptionClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldCaptionDblClick: EventEmitter<FieldCaptionDblClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldCaptionPrepared: EventEmitter<FieldCaptionPreparedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldValueClick: EventEmitter<FieldValueClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldValueDblClick: EventEmitter<FieldValueDblClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFieldValuePrepared: EventEmitter<FieldValuePreparedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onFocusedCardChanged: EventEmitter<FocusedCardChanged>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onInitialized: EventEmitter<Object>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onInitNewCard: EventEmitter<InitNewCardEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onOptionChanged: EventEmitter<Object>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

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
    @Output() columnChooserChange: EventEmitter<ColumnChooser>;

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
    @Output() filterPanelChange: EventEmitter<FilterPanel>;

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
    @Output() headerFilterChange: EventEmitter<HeaderFilter>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerPanelChange: EventEmitter<HeaderPanel>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | string | undefined>;

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
    @Output() scrollingChange: EventEmitter<{ scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: boolean | Mode }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchPanelChange: EventEmitter<SearchPanel>;

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
    @Output() sortingChange: EventEmitter<Sorting>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<dxCardViewToolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wordWrapEnabledChange: EventEmitter<boolean>;




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
            { emit: 'sortingChange' },
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
    DxoCardViewAnimationModule,
    DxiCardViewAsyncRuleModule,
    DxoCardViewAtModule,
    DxoCardViewBoundaryOffsetModule,
    DxiCardViewButtonItemModule,
    DxoCardViewButtonOptionsModule,
    DxoCardViewCardCoverModule,
    DxoCardViewCardHeaderModule,
    DxiCardViewCardHeaderItemModule,
    DxoCardViewCardViewHeaderFilterModule,
    DxoCardViewCardViewHeaderFilterSearchModule,
    DxoCardViewCardViewHeaderFilterTextsModule,
    DxoCardViewCardViewSelectionModule,
    DxiCardViewChangeModule,
    DxoCardViewColCountByScreenModule,
    DxoCardViewCollisionModule,
    DxiCardViewColumnModule,
    DxoCardViewColumnChooserModule,
    DxoCardViewColumnChooserSearchModule,
    DxoCardViewColumnChooserSelectionModule,
    DxoCardViewColumnHeaderFilterModule,
    DxoCardViewColumnHeaderFilterSearchModule,
    DxiCardViewCompareRuleModule,
    DxiCardViewCustomOperationModule,
    DxiCardViewCustomRuleModule,
    DxoCardViewDraggingModule,
    DxoCardViewEditingModule,
    DxoCardViewEditingTextsModule,
    DxiCardViewEmailRuleModule,
    DxiCardViewEmptyItemModule,
    DxiCardViewFieldModule,
    DxoCardViewFilterBuilderModule,
    DxoCardViewFilterOperationDescriptionsModule,
    DxoCardViewFilterPanelModule,
    DxoCardViewFilterPanelTextsModule,
    DxoCardViewFormModule,
    DxoCardViewFormatModule,
    DxoCardViewFormItemModule,
    DxoCardViewFromModule,
    DxiCardViewGroupItemModule,
    DxoCardViewGroupOperationDescriptionsModule,
    DxoCardViewHeaderFilterModule,
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
    DxoCardViewScrollingModule,
    DxoCardViewSearchModule,
    DxoCardViewSearchPanelModule,
    DxoCardViewSelectionModule,
    DxoCardViewShowModule,
    DxiCardViewSimpleItemModule,
    DxoCardViewSortingModule,
    DxiCardViewStringLengthRuleModule,
    DxiCardViewTabModule,
    DxiCardViewTabbedItemModule,
    DxoCardViewTabPanelOptionsModule,
    DxiCardViewTabPanelOptionsItemModule,
    DxoCardViewTextsModule,
    DxoCardViewToModule,
    DxoCardViewToolbarModule,
    DxiCardViewToolbarItemModule,
    DxiCardViewValidationRuleModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxCardViewComponent,
    DxoCardViewAnimationModule,
    DxiCardViewAsyncRuleModule,
    DxoCardViewAtModule,
    DxoCardViewBoundaryOffsetModule,
    DxiCardViewButtonItemModule,
    DxoCardViewButtonOptionsModule,
    DxoCardViewCardCoverModule,
    DxoCardViewCardHeaderModule,
    DxiCardViewCardHeaderItemModule,
    DxoCardViewCardViewHeaderFilterModule,
    DxoCardViewCardViewHeaderFilterSearchModule,
    DxoCardViewCardViewHeaderFilterTextsModule,
    DxoCardViewCardViewSelectionModule,
    DxiCardViewChangeModule,
    DxoCardViewColCountByScreenModule,
    DxoCardViewCollisionModule,
    DxiCardViewColumnModule,
    DxoCardViewColumnChooserModule,
    DxoCardViewColumnChooserSearchModule,
    DxoCardViewColumnChooserSelectionModule,
    DxoCardViewColumnHeaderFilterModule,
    DxoCardViewColumnHeaderFilterSearchModule,
    DxiCardViewCompareRuleModule,
    DxiCardViewCustomOperationModule,
    DxiCardViewCustomRuleModule,
    DxoCardViewDraggingModule,
    DxoCardViewEditingModule,
    DxoCardViewEditingTextsModule,
    DxiCardViewEmailRuleModule,
    DxiCardViewEmptyItemModule,
    DxiCardViewFieldModule,
    DxoCardViewFilterBuilderModule,
    DxoCardViewFilterOperationDescriptionsModule,
    DxoCardViewFilterPanelModule,
    DxoCardViewFilterPanelTextsModule,
    DxoCardViewFormModule,
    DxoCardViewFormatModule,
    DxoCardViewFormItemModule,
    DxoCardViewFromModule,
    DxiCardViewGroupItemModule,
    DxoCardViewGroupOperationDescriptionsModule,
    DxoCardViewHeaderFilterModule,
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
    DxoCardViewScrollingModule,
    DxoCardViewSearchModule,
    DxoCardViewSearchPanelModule,
    DxoCardViewSelectionModule,
    DxoCardViewShowModule,
    DxiCardViewSimpleItemModule,
    DxoCardViewSortingModule,
    DxiCardViewStringLengthRuleModule,
    DxiCardViewTabModule,
    DxiCardViewTabbedItemModule,
    DxoCardViewTabPanelOptionsModule,
    DxiCardViewTabPanelOptionsItemModule,
    DxoCardViewTextsModule,
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


