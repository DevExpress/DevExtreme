/// <reference path="core.d.ts" />
declare module DevExpress.data {
    export interface XmlaStoreOptions {
        /** @docid XmlaStoreOptions_url */
        url?: string;
        /** @docid XmlaStoreOptions_catalog */
        catalog?: string;
        /** @docid XmlaStoreOptions_cube */
        cube?: string;
        /** @docid XmlaStoreOptions_beforeSend */
        beforeSend?: (request: Object) => void;
    }

    /** @docid XmlaStore */
    export class XmlaStore {
        constructor(options: XmlaStoreOptions);
    }

    export interface PivotGridField {
        /** @docid PivotGridDataSourceOptions_fields_index */
        index?: number;

        /** @docid PivotGridDataSourceOptions_fields_visible */
        visible?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_dataField */
        dataField?: string;

        /** @docid PivotGridDataSourceOptions_fields_caption */
        caption?: string;

        /** @docid PivotGridDataSourceOptions_fields_dataType */
        dataType?: string;

        /** @docid PivotGridDataSourceOptions_fields_groupInterval */
        groupInterval?: any;

        /** @docid PivotGridDataSourceOptions_fields_summaryType */
        summaryType?: string;

        /** @docid PivotGridDataSourceOptions_fields_calculateCustomSummary*/
        calculateCustomSummary?: (options: {
            summaryProcess?: string;
            value?: any;
            totalValue?: any;
        }) => void;

        /** @docid PivotGridDataSourceOptions_fields_selector */
        selector?: (data: Object) => any;

        /** @docid PivotGridDataSourceOptions_fields_area */
        area?: string;

        /** @docid PivotGridDataSourceOptions_fields_areaIndex */
        areaIndex?: number;

        /** @docid PivotGridDataSourceOptions_fields_displayFolder */
        displayFolder?: string;

        /** @docid PivotGridDataSourceOptions_fields_groupName */
        groupName?: string;

        /** @docid PivotGridDataSourceOptions_fields_groupIndex */
        groupIndex?: number;

        /** @docid PivotGridDataSourceOptions_fields_sortOrder */
        sortOrder?: string;

        /** @docid PivotGridDataSourceOptions_fields_sortBy */
        sortBy?: string;

        /** @docid PivotGridDataSourceOptions_fields_sortBySummaryField */
        sortBySummaryField?: string;

        /** @docid PivotGridDataSourceOptions_fields_sortBySummaryPath */
        sortBySummaryPath?: Array<any>;

        /** @docid PivotGridDataSourceOptions_fields_filterValues */
        filterValues?: Array<any>;

        /** @docid PivotGridDataSourceOptions_fields_filterType */
        filterType?: string;

        /** @docid PivotGridDataSourceOptions_fields_expanded */
        expanded?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_isMeasure */
        isMeasure?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_wordWrapEnabled */
        wordWrapEnabled?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_format */
        format?: any;

        /** @docid PivotGridDataSourceOptions_fields_customizeText */
        customizeText?: (cellInfo: { value: any; valueText: string }) => string;

        /** @docid PivotGridDataSourceOptions_fields_precision */
        precision?: number;

        /** @docid PivotGridDataSourceOptions_fields_sortingMethod */
        sortingMethod?: (a: Object, b: Object) => number;

        /** @docid PivotGridDataSourceOptions_fields_allowSorting */
        allowSorting?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_allowSortingBySummary */
        allowSortingBySummary?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_allowFiltering */
        allowFiltering?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_allowExpandAll */
        allowExpandAll?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_width */
        width?: number;

        /** @docid PivotGridDataSourceOptions_fields_summaryDisplayMode */
        summaryDisplayMode?: string;

        /** @docid PivotGridDataSourceOptions_fields_runningTotal */
        runningTotal?: string;

        /** @docid PivotGridDataSourceOptions_fields_allowCrossGroupCalculation */
        allowCrossGroupCalculation?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_calculateSummaryValue */
        calculateSummaryValue?: (e: Object) => number;

        /** @docid PivotGridDataSourceOptions_fields_showTotals */
        showTotals?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_showGrandTotals */
        showGrandTotals?: boolean;

        /** @docid PivotGridDataSourceOptions_fields_showValues */
        showValues?: boolean;
    }

    export class SummaryCell {
        /** @docid dxPivotGridSummaryCell_parent */
        parent(direction: string): SummaryCell;

        /** @docid dxPivotGridSummaryCell_children */
        children(direction: string): Array<SummaryCell>;

        /** @docid dxPivotGridSummaryCell_grandTotal#grandTotal(direction) */
        grandTotal(direction: string): SummaryCell;
        /** @docid dxPivotGridSummaryCell_grandTotal#grandTotal() */
        grandTotal(): SummaryCell;

        /** @docid dxPivotGridSummaryCell_next#next(direction) */
        next(direction: string): SummaryCell;
        /** @docid dxPivotGridSummaryCell_next#next(direction, allowCrossGroup) */
        next(direction: string, allowCrossGroup: boolean): SummaryCell;

        /** @docid dxPivotGridSummaryCell_prev#prev(direction) */
        prev(direction: string): SummaryCell;
        /** @docid dxPivotGridSummaryCell_prev#prev(direction, allowCrossGroup) */
        prev(direction: string, allowCrossGroup: boolean): SummaryCell;

        /** @docid dxPivotGridSummaryCell_child */
        child(direction: string, fieldValue: any): SummaryCell;

        /** @docid dxPivotGridSummaryCell_slice */
        slice(field: PivotGridField, value: any): SummaryCell;

        /** @docid dxPivotGridSummaryCell_field */
        field(area: string): PivotGridField;

        /** @docid dxPivotGridSummaryCell_value#value() */
        value(): any;
        /** @docid dxPivotGridSummaryCell_value#value(isCalculatedValue) */
        value(isCalculatedValue: boolean): any;
        /** @docid dxPivotGridSummaryCell_value#value(field) */
        value(field: PivotGridField): any;
        /** @docid dxPivotGridSummaryCell_value#value(field, isCalculatedValue) */
        value(field: PivotGridField, isCalculatedValue: boolean): any;
    }

    export interface PivotGridDataSourceOptions {
        /** @docid_ignore PivotGridDataSourceOptions_store_type */

        /** @docid PivotGridDataSourceOptions_store */
        store?: any;

        /** @docid PivotGridDataSourceOptions_retrieveFields */
        retrieveFields?: boolean;

        /** @docid PivotGridDataSourceOptions_filter */
        filter?: Object;

        /** @docid PivotGridDataSourceOptions_fields */
        fields?: Array<PivotGridField>;

        /** @docid PivotGridDataSourceOptions_remoteOperations */
        remoteOperations?: boolean;

        /** @docid PivotGridDataSourceOptions_onChanged */
        onChanged?: () => void;

        /** @docid PivotGridDataSourceOptions_onLoadingChanged */
        onLoadingChanged?: (isLoading: boolean) => void;

        /** @docid PivotGridDataSourceOptions_onLoadError */
        onLoadError?: (e?: Object) => void;

        /** @docid PivotGridDataSourceOptions_onFieldsPrepared */
        onFieldsPrepared?: (e?: Array<PivotGridField>) => void;
    }

    /** @docid PivotGridDataSource */
    export class PivotGridDataSource implements EventsMixin<PivotGridDataSource> {
        constructor(options?: PivotGridDataSourceOptions);
        /** @docid PivotGridDataSourceMethods_reload */
        reload(): JQueryPromise<any>;

        /** @docid PivotGridDataSourceMethods_load */
        load(): JQueryPromise<any>;

        /** @docid PivotGridDataSourceMethods_isLoading */
        isLoading(): boolean;

        /** @docid PivotGridDataSourceMethods_getData */
        getData(): Object;

        /** @docid PivotGridDataSourceMethods_getAreaFields */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridField>;

        /** @docid PivotGridDataSourceMethods_fields#fields() */
        fields(): Array<PivotGridField>;
        /** @docid PivotGridDataSourceMethods_fields#fields(fields) */
        fields(fields: Array<PivotGridField>): void;

        /** @docid PivotGridDataSourceMethods_field#field(id) */
        field(id: any): PivotGridField;
        /** @docid PivotGridDataSourceMethods_field#field(id, options) */
        field(id: any, field: PivotGridField): void;

        /** @docid PivotGridDataSourceMethods_collapseHeaderItem */
        collapseHeaderItem(area: string, path: Array<any>): void;

        /** @docid PivotGridDataSourceMethods_expandHeaderItem */
        expandHeaderItem(area: string, path: Array<any>): void;

        /** @docid PivotGridDataSourceMethods_expandAll */
        expandAll(id: any): void;

        /** @docid PivotGridDataSourceMethods_collapseAll */
        collapseAll(id: any): void;

        /** @docid PivotGridDataSourceMethods_dispose */
        dispose(): void;

        /** @docid PivotGridDataSourceMethods_filter#filter() */
        filter(): Object;

        /** @docid PivotGridDataSourceMethods_filter#filter(filterExpr) */
        filter(filterExpr: Object): void;

        /** @docid PivotGridDataSourceMethods_createDrillDownDataSource */
        createDrillDownDataSource(options: {
            columnPath?: Array<any>;
            rowPath?: Array<any>;
            dataIndex?: number;
            maxRowCount?: number;
            customColumns?: Array<string>;
        }): DevExpress.data.DataSource;

        /** @docid PivotGridDataSourceMethods_state#state() */
        state(): Object;

        /** @docid PivotGridDataSourceMethods_state#state(state) */
        state(state: Object): void;

        on(eventName: string, eventHandler: Function): PivotGridDataSource;
        on(events: { [eventName: string]: Function; }): PivotGridDataSource;
        off(eventName: string): PivotGridDataSource;
        off(eventName: string, eventHandler: Function): PivotGridDataSource;
    }
}

declare module DevExpress.ui {
    export interface dxSchedulerViewOptions {
        /** @docid dxSchedulerOptions_views_type */
        type?: string;

        /** @docid dxSchedulerOptions_views_name */
        name?: string;

        /** @docid dxSchedulerOptions_views_maxAppointmentsPerCell */
        maxAppointmentsPerCell?: any;

        /** @docid dxSchedulerOptions_views_intervalCount */
        intervalCount?: number;

        /** @docid dxSchedulerOptions_views_startDate */
        startDate?: any;

        /** @docid dxSchedulerOptions_views_firstDayOfWeek */
        firstDayOfWeek?: number;

        /** @docid dxSchedulerOptions_views_groups */
        groups?: Array<string>;

        /** @docid dxSchedulerOptions_views_startDayHour */
        startDayHour?: number;

        /** @docid dxSchedulerOptions_views_endDayHour */
        endDayHour?: number;

        /** @docid dxSchedulerOptions_views_cellDuration */
        cellDuration?: number;

        /** @docid dxSchedulerOptions_views_agendaDuration */
        agendaDuration?: number;

        /** @docid dxSchedulerOptions_views_appointmentTemplate */
        appointmentTemplate?: any;

        /** @docid dxSchedulerOptions_views_appointmentTooltipTemplate */
        appointmentTooltipTemplate?: any;

        /** @docid dxSchedulerOptions_views_dataCellTemplate */
        dataCellTemplate?: any;

        /** @docid dxSchedulerOptions_views_timeCellTemplate */
        timeCellTemplate?: any;

        /** @docid dxSchedulerOptions_views_dateCellTemplate */
        dateCellTemplate?: any;

        /** @docid dxSchedulerOptions_views_resourceCellTemplate */
        resourceCellTemplate?: any;
    }

    export interface dxSchedulerOptions extends WidgetOptions {
        /** @docid_ignore dxSchedulerAppointmentTemplate_text */
        /** @docid_ignore dxSchedulerAppointmentTemplate_startDate */
        /** @docid_ignore dxSchedulerAppointmentTemplate_endDate */
        /** @docid_ignore dxSchedulerAppointmentTemplate_description */
        /** @docid_ignore dxSchedulerAppointmentTemplate_recurrenceRule */
        /** @docid_ignore dxSchedulerAppointmentTemplate_recurrenceException */
        /** @docid_ignore dxSchedulerAppointmentTemplate_allDay */
        /** @docid_ignore dxSchedulerAppointmentTemplate_html */
        /** @docid_ignore dxSchedulerAppointmentTemplate_disabled */
        /** @docid_ignore dxSchedulerAppointmentTemplate_visible */
        /** @docid_ignore dxSchedulerAppointmentTemplate_template */
        /** @docid_ignore dxSchedulerAppointmentTemplate_startDateTimeZone */
        /** @docid_ignore dxSchedulerAppointmentTemplate_endDateTimeZone */

        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_text */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_startDate */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_endDate */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_description */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_recurrenceRule */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_recurrenceException */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_allDay */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_startDateTimeZone */
        /** @docid_ignore dxSchedulerAppointmentTooltipTemplate_endDateTimeZone */

        /** @docid_ignore dxSchedulerOptions_focusStateEnabled */
        /** @docid_ignore dxSchedulerOptions_appointmentPopupTemplate */

        /** @docid_ignore dxSchedulerOptions_activeStateEnabled */
        /** @docid_ignore dxSchedulerOptions_hoverStateEnabled */

        /** @docid dxSchedulerOptions_dateSerializationFormat */
        dateSerializationFormat?: string;
        /** @docid dxSchedulerOptions_currentDate */
        currentDate?: any;
        /** @docid dxSchedulerOptions_min */
        min?: any;
        /** @docid dxSchedulerOptions_max */
        max?: any;
        /** @docid dxSchedulerOptions_currentView */
        currentView?: string;
        /** @docid dxSchedulerOptions_dataSource */
        dataSource?: any;
        /** @docid dxSchedulerOptions_firstDayOfWeek */
        firstDayOfWeek?: number;
        /** @docid dxSchedulerOptions_appointmentTemplate */
        appointmentTemplate?: any;
        /** @docid dxSchedulerOptions_appointmentTooltipTemplate */
        appointmentTooltipTemplate?: any;
        /** @docid dxSchedulerOptions_dataCellTemplate */
        dataCellTemplate?: any;
        /** @docid dxSchedulerOptions_timeCellTemplate */
        timeCellTemplate?: any;
        /** @docid dxSchedulerOptions_dateCellTemplate */
        dateCellTemplate?: any;
        /** @docid dxSchedulerOptions_resourceCellTemplate */
        resourceCellTemplate?: any;
        /** @docid dxSchedulerOptions_views */
        views?: Array<any>;
        /** @docid dxSchedulerOptions_groups */
        groups?: Array<string>;
        /** @docid dxSchedulerOptions_startDayHour */
        startDayHour?: number;
        /** @docid dxSchedulerOptions_endDayHour */
        endDayHour?: number;
        /** @docid dxSchedulerOptions_showAllDayPanel */
        showAllDayPanel?: boolean;
        /** @docid dxSchedulerOptions_cellDuration */
        cellDuration?: number;
        /** @docid dxSchedulerOptions_recurrenceEditMode */
        recurrenceEditMode?: string;
        /** @docid dxSchedulerOptions_editing */
        editing?: {
            /** @docid dxSchedulerOptions_editing_allowAdding */
            allowAdding?: boolean;
            /** @docid dxSchedulerOptions_editing_allowUpdating */
            allowUpdating?: boolean;
            /** @docid dxSchedulerOptions_editing_allowDeleting */
            allowDeleting?: boolean;
            /** @docid dxSchedulerOptions_editing_allowResizing */
            allowResizing?: boolean;
            /** @docid dxSchedulerOptions_editing_allowDragging */
            allowDragging?: boolean;
        }
        /** @docid dxSchedulerOptions_resources */
        resources?: Array<{
            /** @docid dxSchedulerOptions_resources_allowMultiple */
            allowMultiple?: boolean;
            /** @docid dxSchedulerOptions_resources_mainColor */
            mainColor?: boolean;
            /** @docid dxSchedulerOptions_resources_useColorAsDefault */
            useColorAsDefault?: boolean;
            /** @docid dxSchedulerOptions_resources_dataSource */
            dataSource?: any;
            /** @docid dxSchedulerOptions_resources_displayExpr */
            displayExpr?: any;
            /** @docid dxSchedulerOptions_resources_valueExpr */
            valueExpr?: any;
            /** @docid dxSchedulerOptions_resources_field */
            field?: string;
            /** @docid dxSchedulerOptions_resources_fieldExpr */
            fieldExpr?: string;
            /** @docid dxSchedulerOptions_resources_colorExpr */
            colorExpr?: string;
            /** @docid dxSchedulerOptions_resources_label */
            label?: string;
        }>;
        /** @docid dxSchedulerOptions_onAppointmentAdding */
        onAppointmentAdding?: Function;
        /** @docid dxSchedulerOptions_onAppointmentAdded */
        onAppointmentAdded?: Function;
        /** @docid dxSchedulerOptions_onAppointmentUpdating */
        onAppointmentUpdating?: Function;
        /** @docid dxSchedulerOptions_onAppointmentUpdated */
        onAppointmentUpdated?: Function;
        /** @docid dxSchedulerOptions_onAppointmentDeleting */
        onAppointmentDeleting?: Function;
        /** @docid dxSchedulerOptions_onAppointmentDeleted */
        onAppointmentDeleted?: Function;
        /** @docid dxSchedulerOptions_onAppointmentRendered */
        onAppointmentRendered?: Function;
        /** @docid dxSchedulerOptions_onAppointmentClick */
        onAppointmentClick?: any;
        /** @docid dxSchedulerOptions_onAppointmentDblClick */
        onAppointmentDblClick?: any;
        /** @docid dxSchedulerOptions_onCellClick */
        onCellClick?: any;
        /** @docid dxSchedulerOptions_onAppointmentFormCreated */
        onAppointmentFormCreated?: Function;
        /** @docid dxSchedulerOptions_onContentReady */
        onContentReady?: Function;
        /** @docid dxSchedulerOptions_horizontalScrollingEnabled */
        horizontalScrollingEnabled?: boolean;
        /** @docid dxSchedulerOptions_crossScrollingEnabled */
        crossScrollingEnabled?: boolean;
        /** @docid dxSchedulerOptions_useDropDownViewSwitcher */
        useDropDownViewSwitcher?: boolean;
        /** @docid dxSchedulerOptions_startDateExpr */
        startDateExpr?: string;
        /** @docid dxSchedulerOptions_endDateExpr */
        endDateExpr?: string;
        /** @docid dxSchedulerOptions_textExpr */
        textExpr?: string;
        /** @docid dxSchedulerOptions_descriptionExpr */
        descriptionExpr?: string;
        /** @docid dxSchedulerOptions_allDayExpr */
        allDayExpr?: string;
        /** @docid dxSchedulerOptions_recurrenceRuleExpr */
        recurrenceRuleExpr?: string;
        /** @docid dxSchedulerOptions_recurrenceExceptionExpr */
        recurrenceExceptionExpr?: string;
        /** @docid dxSchedulerOptions_startDateTimeZoneExpr */
        startDateTimeZoneExpr?: string;
        /** @docid dxSchedulerOptions_endDateTimeZoneExpr */
        endDateTimeZoneExpr?: string;
        /** @docid dxSchedulerOptions_remoteFiltering */
        remoteFiltering?: boolean;
        /** @docid dxSchedulerOptions_timeZone */
        timeZone?: string;
        /** @docid dxSchedulerOptions_noDataText */
        noDataText?: string;
    }

    /** @docid dxScheduler */
    export class dxScheduler extends Widget
    implements DataHelperMixin
    {
        /** @docid_ignore dxSchedulerMethods_registerKeyHandler */

        constructor(element: JQuery, options?: dxSchedulerOptions);
        constructor(element: Element, options?: dxSchedulerOptions);

        /** @docid dxSchedulerMethods_addAppointment */
        addAppointment(appointment: Object): void;

        /** @docid dxSchedulerMethods_updateAppointment */
        updateAppointment(target: Object, appointment: Object): void;

        /** @docid dxSchedulerMethods_deleteAppointment */
        deleteAppointment(appointment: Object): void;

        /** @docid dxSchedulerMethods_scrollToTime */
        scrollToTime(hours: number, minutes: number, date: Date): void;

        /** @docid dxSchedulerMethods_showAppointmentPopup */
        showAppointmentPopup(appointmentData: Object, createNewAppointment?: boolean, currentAppointmentData?: Object): void;

        /** @docid dxSchedulerMethods_hideAppointmentPopup */
        hideAppointmentPopup(saveChanges?: boolean): void;

        /** @docid dxSchedulerMethods_showAppointmentTooltip */
        showAppointmentTooltip(appointmentData: Object, target?: JQuery, currentAppointmentData?: Object): void;
        showAppointmentTooltip(appointmentData: Object, target?: Element, currentAppointmentData?: Object): void;
        showAppointmentTooltip(appointmentData: Object, target?: string, currentAppointmentData?: Object): void;

        /** @docid dxSchedulerMethods_hideAppointmentTooltip */
        hideAppointmentTooltip(): void;

        /** @docid dxSchedulerMethods_getStartViewDate */
        getStartViewDate(): Date;

        /** @docid dxSchedulerMethods_getEndViewDate */
        getEndViewDate(): Date;

        getDataSource(): DevExpress.data.DataSource;
    }

    export interface dxColorBoxOptions extends dxDropDownEditorOptions {
        /** @docid_ignore dxColorBoxOptions_fieldEditEnabled */
        /** @docid_ignore dxColorBoxOptions_maxLength */
        /** @docid_ignore dxColorBoxOptions_showClearButton */
        /** @docid_ignore dxColorBoxOptions_valueChangeEvent */
        /** @docid_ignore dxColorBoxOptions_value */
        /** @docid_ignore dxColorBoxOptions_spellcheck */

        /** @docid dxColorBoxOptions_applyButtonText */
        applyButtonText?: string;

        /** @docid dxColorBoxOptions_applyValueMode */
        applyValueMode?: string;

        /** @docid dxColorBoxOptions_cancelButtonText */
        cancelButtonText?: string;

        /** @docid dxColorBoxOptions_editAlphaChannel */
        editAlphaChannel?: boolean;

        /** @docid dxColorBoxOptions_keyStep */
        keyStep?: number;

        /** @docid dxColorBoxOptions_fieldTemplate */
        fieldTemplate?: any;
    }

    /** @docid dxColorBox */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: JQuery, options?: dxColorBoxOptions);
        constructor(element: Element, options?: dxColorBoxOptions);
    }

    export interface HierarchicalCollectionWidgetOptions extends CollectionWidgetOptions {
        /** @docid HierarchicalCollectionWidgetOptions_displayExpr */
        displayExpr?: any;

        /** @docid HierarchicalCollectionWidgetOptions_keyExpr */
        keyExpr?: any;

        /** @docid HierarchicalCollectionWidgetOptions_selectedExpr */
        selectedExpr?: any;

        /** @docid HierarchicalCollectionWidgetOptions_itemsExpr */
        itemsExpr?: any;

        /** @docid HierarchicalCollectionWidgetOptions_disabledExpr */
        disabledExpr?: any;

        /** @docid HierarchicalCollectionWidgetOptions_hoverStateEnabled */
        hoverStateEnabled?: boolean;

        /** @docid HierarchicalCollectionWidgetOptions_focusStateEnabled */
        focusStateEnabled?: boolean;
    }

    /** @docid HierarchicalCollectionWidget */
    export class HierarchicalCollectionWidget extends CollectionWidget {
    }

    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions {
        /** @docid_ignore dxTreeViewItemTemplate_icon */
        /** @docid_ignore dxTreeViewItemTemplate_iconSrc */
        /** @docid_ignore dxTreeViewItemTemplate_selected */
        /** @docid_ignore dxTreeViewItemTemplate_expanded */
        /** @docid_ignore dxTreeViewItemTemplate_items */
        /** @docid_ignore dxTreeViewItemTemplate_parentId */
        /** @docid_ignore dxTreeViewItemTemplate_hasItems */
        /** @docid_ignore dxTreeViewOptions_selectedItems */
        /** @docid_ignore dxTreeViewOptions_selectedItemKeys */
        /** @docid_ignore dxTreeViewOptions_selectedItem */
        /** @docid_ignore dxTreeViewOptions_selectedIndex */

        /** @docid dxTreeViewOptions_animationEnabled */
        animationEnabled?: boolean;

        /** @docid dxTreeViewOptions_dataStructure */
        dataStructure?: string;

        /** @docid dxTreeViewOptions_expandAllEnabled */
        expandAllEnabled?: boolean;

        /** @docid dxTreeViewOptions_showCheckBoxes */
        showCheckBoxes?: boolean;

        /** @docid dxTreeViewOptions_showCheckBoxesMode */
        showCheckBoxesMode?: string;

        /** @docid dxTreeViewOptions_expandedExpr */
        expandedExpr?: any;

        /** @docid dxTreeViewOptions_selectNodesRecursive */
        selectNodesRecursive?: boolean;

        /** @docid dxTreeViewOptions_expandNodesRecursive */
        expandNodesRecursive?: boolean;

        /** @docid dxTreeViewOptions_selectAllEnabled */
        selectAllEnabled?: boolean;

        /** @docid dxTreeViewOptions_selectByClick */
        selectByClick?: boolean;

        /** @docid dxTreeViewOptions_selectionMode */
        selectionMode?: string;

        /** @docid dxTreeViewOptions_selectAllText */
        selectAllText?: string;

        /** @docid dxTreeViewOptions_hasItemsExpr */
        hasItemsExpr?: any;

        /** @docid dxTreeViewOptions_parentIdExpr */
        parentIdExpr?: any;

        /** @docid dxTreeViewOptions_virtualModeEnabled */
        virtualModeEnabled?: boolean;

        /** @docid dxTreeViewOptions_rootValue */
        rootValue?: Object;

        /** @docid dxTreeViewOptions_searchValue */
        searchValue?: string;

        /** @docid dxTreeViewOptions_scrollDirection */
        scrollDirection?: string;

        /** @docid_ignore dxTreeViewOptions_onItemSelected */

        /** @docid dxTreeViewOptions_onItemSelectionChanged */
        onItemSelectionChanged?: Function;

        /** @docid dxTreeViewOptions_onItemExpanded */
        onItemExpanded?: Function;

        /** @docid dxTreeViewOptions_onItemCollapsed */
        onItemCollapsed?: Function;

        /** @docid dxTreeViewOptions_onItemClick */
        onItemClick?: Function;

        /** @docid dxTreeViewOptions_onItemContextMenu */
        onItemContextMenu?: Function;

        /** @docid dxTreeViewOptions_onItemRendered */
        onItemRendered?: Function;

        /** @docid dxTreeViewOptions_onItemHold */
        onItemHold?: Function;

        /** @docid dxTreeViewOptions_createChildren */
        createChildren?: Function;
    }

    export interface dxTreeViewNode {
        /** @docid_ignore dxTreeViewNode_children */
        /** @docid_ignore dxTreeViewNode_disabled */
        /** @docid_ignore dxTreeViewNode_expanded */
        /** @docid_ignore dxTreeViewNode_itemData */
        /** @docid_ignore dxTreeViewNode_key */
        /** @docid_ignore dxTreeViewNode_parent */
        /** @docid_ignore dxTreeViewNode_selected */
        /** @docid_ignore dxTreeViewNode_text */

        children: Array<dxTreeViewNode>;

        disabled: boolean;

        expanded: boolean;

        itemData: Object;

        key: any;

        parent: dxTreeViewNode;

        selected: boolean;

        text: string;
    }

    /** @docid dxTreeView */
    export class dxTreeView extends HierarchicalCollectionWidget {

        /** @docid_ignore dxTreeViewOptions_onSelectionChanged */

        constructor(element: JQuery, options?: dxTreeViewOptions);
        constructor(element: Element, options?: dxTreeViewOptions);

        /** @docid dxTreeViewMethods_updateDimensions */
        updateDimensions(): JQueryPromise<void>;

        /** @docid dxTreeViewMethods_selectItem */
        selectItem(itemElement: any): void;

        /** @docid dxTreeViewMethods_unselectItem */
        unselectItem(itemElement: any): void;

        /** @docid dxTreeViewMethods_expandItem */
        expandItem(itemElement: any): void;

        /** @docid dxTreeViewMethods_collapseItem */
        collapseItem(itemElement: any): void;

        /** @docid dxTreeViewMethods_getNodes */
        getNodes(): Array<Object>;

        /** @docid dxTreeViewMethods_selectAll */
        selectAll(): void;

        /** @docid dxTreeViewMethods_unselectAll */
        unselectAll(): void;
    }

    export interface dxMenuBaseOptions extends HierarchicalCollectionWidgetOptions {
        /** @docid_ignore dxMenuBaseOptions_itemHoldTimeout */
        /** @docid_ignore dxMenuBaseOptions_onItemHold */
        /** @docid_ignore dxMenuBaseOptions_noDataText */
        /** @docid_ignore dxMenuBaseOptions_selectedIndex */
        /** @docid_ignore dxMenuBaseOptions_selectedItemKeys */
        /** @docid_ignore dxMenuBaseOptions_keyExpr */
        /** @docid_ignore dxMenuBaseOptions_parentIdExpr */
        /** @docid_ignore dxMenuBaseOptions_expandedExpr */
        /** @docid_ignore dxMenuBaseItemTemplate_beginGroup */

        /** @docid dxMenuBaseOptions_animation */
        animation?: {
            /** @docid dxMenuBaseOptions_animation_show */
            show?: fx.AnimationOptions;

            /** @docid dxMenuBaseOptions_animation_hide */
            hide?: fx.AnimationOptions;
        };

        /** @docid dxMenuBaseOptions_activeStateEnabled */
        activeStateEnabled?: boolean;

        /** @docid dxMenuBaseOptions_cssClass */
        cssClass?: string;

        /** @docid dxMenuBaseOptions_items */
        items?: Array<any>;

        /** @docid dxMenuBaseOptions_selectionByClick */
        selectionByClick?: boolean;

        /** @docid dxMenuBaseOptions_selectByClick */
        selectByClick?: boolean;

        /** @docid dxMenuBaseOptions_selectionMode */
        selectionMode?: string;

        /** @docid dxMenuBaseOptions_showSubmenuMode */
        showSubmenuMode?: {
            /** @docid dxMenuBaseOptions_showSubmenuMode_name */
            name?: string;

            /** @docid dxMenuBaseOptions_showSubmenuMode_delay */
            delay?: {
                /** @docid dxMenuBaseOptions_showSubmenuMode_delay_show */
                show?: number;

                /** @docid dxMenuBaseOptions_showSubmenuMode_delay_hide */
                hide?: number;
            };
        };
    }

    /** @docid dxMenuBase */
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: JQuery, options?: dxMenuBaseOptions);
        constructor(element: Element, options?: dxMenuBaseOptions);

        /** @docid dxMenuBaseMethods_selectItem */
        selectItem(itemElement: any): void;

        /** @docid dxMenuBaseMethods_unselectItem */
        unselectItem(itemElement: any): void;
    }

    export interface dxMenuOptions extends dxMenuBaseOptions {
        /** @docid_ignore dxMenuOptions_onItemReordered */
        /** @docid_ignore dxMenuOptions_onSelectionChange */
        /** @docid_ignore dxMenuOptions_selectedItems */

        /** @docid dxMenuOptions_hideSubmenuOnMouseLeave */
        hideSubmenuOnMouseLeave?: boolean;

        /** @docid dxMenuOptions_orientation */
        orientation?: string;

        /** @docid dxMenuOptions_showFirstSubmenuMode */
        showFirstSubmenuMode?: {
            /** @docid dxMenuOptions_showFirstSubmenuMode_name */
            name?: string;

            /** @docid dxMenuOptions_showFirstSubmenuMode_delay */
            delay?: {
                /** @docid dxMenuOptions_showFirstSubmenuMode_delay_show */
                show?: number;

                /** @docid dxMenuOptions_showFirstSubmenuMode_delay_hide */
                hide?: number;
            };
        };

        /** @docid dxMenuOptions_submenuDirection */
        submenuDirection?: string;

        /** @docid dxMenuOptions_onSubmenuHidden */
        onSubmenuHidden?: Function;

        /** @docid dxMenuOptions_adaptivityEnabled */
        adaptivityEnabled?: boolean;

        /** @docid dxMenuOptions_onSubmenuHiding */
        onSubmenuHiding?: Function;

        /** @docid dxMenuOptions_onSubmenuShowing */
        onSubmenuShowing?: Function;

        /** @docid dxMenuOptions_onSubmenuShown */
        onSubmenuShown?: Function;
    }

    /** @docid dxMenu */
    export class dxMenu extends dxMenuBase {
        constructor(element: JQuery, options?: dxMenuOptions);
        constructor(element: Element, options?: dxMenuOptions);

        /** @docid_ignore dxMenuBaseItemTemplate_disabled */
        /** @docid_ignore dxMenuBaseItemTemplate_html */
        /** @docid_ignore dxMenuBaseItemTemplate_icon */
        /** @docid_ignore dxMenuBaseItemTemplate_iconSrc */
        /** @docid_ignore dxMenuBaseItemTemplate_items */
        /** @docid_ignore dxMenuBaseItemTemplate_selectable */
        /** @docid_ignore dxMenuBaseItemTemplate_selected */
        /** @docid_ignore dxMenuBaseItemTemplate_text */
        /** @docid_ignore dxMenuBaseItemTemplate_visible */
        /** @docid_ignore dxMenuBaseItemTemplate_closeMenuOnClick */
    }

    export interface dxContextMenuOptions extends dxMenuBaseOptions {
        /** @docid_ignore dxContextMenuOptions_itemHoldAction */
        /** @docid_ignore dxContextMenuOptions_onItemReordered */

        /** @docid dxContextMenuOptions_showEvent */
        showEvent?: {
            /** @docid dxContextMenuOptions_showEvent_name */
            name?: String;

            /** @docid dxContextMenuOptions_showEvent_delay */
            delay?: Number;
        };

        /** @docid dxContextMenuOptions_closeOnOutsideClick */
        closeOnOutsideClick?: any;

        /** @docid dxContextMenuOptions_onHidden */
        onHidden?: Function;

        /** @docid dxContextMenuOptions_onHiding */
        onHiding?: Function;

        /** @docid dxContextMenuOptions_onPositioning */
        onPositioning?: Function;

        /** @docid dxContextMenuOptions_onShowing */
        onShowing?: Function;

        /** @docid dxContextMenuOptions_onShown */
        onShown?: Function;

        /** @docid dxContextMenuOptions_position */
        position?: PositionOptions;

        /** @docid dxContextMenuOptions_submenuDirection */
        submenuDirection?: string;

        /** @docid dxContextMenuOptions_target */
        target?: any;

        /** @docid dxContextMenuOptions_visible */
        visible?: boolean;
    }

    /** @docid dxContextMenu */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: JQuery, options?: dxContextMenuOptions);
        constructor(element: Element, options?: dxContextMenuOptions);

        /** @docid dxContextMenuMethods_toggle */
        toggle(showing: boolean): JQueryPromise<void>;

        /** @docid dxContextMenuMethods_show */
        show(): JQueryPromise<void>;

        /** @docid dxContextMenuMethods_hide */
        hide(): JQueryPromise<void>;

    }

    export interface dxDataGridRemoteOperations {
        /** @docid dxDataGridOptions_remoteOperations_filtering */
        filtering?: boolean;

        /** @docid dxDataGridOptions_remoteOperations_paging */
        paging?: boolean;

        /** @docid dxDataGridOptions_remoteOperations_sorting */
        sorting?: boolean;

        /** @docid dxDataGridOptions_remoteOperations_grouping */
        grouping?: boolean;

        /** @docid dxDataGridOptions_remoteOperations_groupPaging */
        groupPaging?: boolean;

        /** @docid dxDataGridOptions_remoteOperations_summary */
        summary?: boolean;
    }

    export interface dxTreeListRemoteOperations {
        /** @docid dxTreeListOptions_remoteOperations_filtering */
        filtering?: boolean;

        /** @docid dxTreeListOptions_remoteOperations_sorting */
        sorting?: boolean;

        /** @docid dxTreeListOptions_remoteOperations_grouping */
        grouping?: boolean;
    }

    export interface dxDataGridRow {
        /** @docid_ignore dxDataGridRowObject_data */
        /** @docid_ignore dxDataGridRowObject_key */
        /** @docid_ignore dxDataGridRowObject_rowIndex */
        /** @docid_ignore dxDataGridRowObject_rowType */
        /** @docid_ignore dxDataGridRowObject_groupIndex */
        /** @docid_ignore dxDataGridRowObject_isExpanded */
        /** @docid_ignore dxDataGridRowObject_isSelected */
        /** @docid_ignore dxDataGridRowObject_isEditing */
        /** @docid_ignore dxDataGridRowObject_values */

        data: Object;

        key: any;

        rowIndex: number;

        rowType: string;

        groupIndex: number;

        isExpanded: boolean;

        isSelected: boolean;

        isEditing: boolean;

        values: Array<any>;
    }

    export interface dxTreeListRow {
        /** @docid_ignore dxTreeListRowObject_node */
        node: dxTreeListNode;

        /** @docid_ignore dxTreeListRowObject_level */
        level: number;

        /** @docid_ignore dxTreeListRowObject_key */
        key: any;

        /** @docid_ignore dxTreeListRowObject_rowIndex */
        rowIndex: number;

        /** @docid_ignore dxTreeListRowObject_rowType */
        rowType: string;

        /** @docid_ignore dxTreeListRowObject_isExpanded */
        isExpanded: boolean;

        /** @docid_ignore dxTreeListRowObject_isSelected */
        isSelected: boolean;

        /** @docid_ignore dxTreeListRowObject_isEditing */
        isEditing: boolean;

        /** @docid_ignore dxTreeListRowObject_values */
        values: Array<any>;
    }

    export interface dxTreeListNode {
        /** @docid_ignore dxTreeListNode_data */
        data: Object;

        /** @docid_ignore dxTreeListNode_key */
        key: any;

        /** @docid_ignore dxTreeListNode_parent */
        parent?: dxTreeListNode;

        /** @docid_ignore dxTreeListNode_hasChildren */
        hasChildren: boolean;

        /** @docid_ignore dxTreeListNode_children */
        children: Array<dxTreeListNode>;

        /** @docid_ignore dxTreeListNode_visible */
        visible: boolean;

        /** @docid_ignore dxTreeListNode_level */
        level: number;
    }

    export interface GridBaseColumn {
        /** @docid GridBaseOptions_columns_alignment */
        alignment?: string;

        /** @docid GridBaseOptions_columns_allowEditing */
        allowEditing?: boolean;

        /** @docid GridBaseOptions_columns_allowFixing */
        allowFixing?: boolean;

        /** @docid GridBaseOptions_columns_allowHiding */
        allowHiding?: boolean;

        /** @docid GridBaseOptions_columns_allowReordering */
        allowReordering?: boolean;

        /** @docid GridBaseOptions_columns_allowResizing */
        allowResizing?: boolean;

        /** @docid GridBaseOptions_columns_allowSorting */
        allowSorting?: boolean;

        /** @docid GridBaseOptions_columns_allowSearch */
        allowSearch?: boolean;

        /** @docid GridBaseOptions_columns_calculateCellValue */
        calculateCellValue?: (rowData: Object) => any;

        /** @docid GridBaseOptions_columns_setCellValue */
        setCellValue?: (newData: Object, value: any, currentRowData: Object) => void;

        /** @docid GridBaseOptions_columns_caption */
        caption?: string;

        /** @docid GridBaseOptions_columns_cellTemplate */
        cellTemplate?: any;

        /** @docid GridBaseOptions_columns_cssClass */
        cssClass?: string;

        /** @docid GridBaseOptions_columns_calculateDisplayValue */
        calculateDisplayValue?: any;

        /** @docid GridBaseOptions_columns_calculateSortValue */
        calculateSortValue?: any;

        /** @docid GridBaseOptions_columns_sortingMethod */
        sortingMethod?: (value1: any, value2: any) => number;

        /** @docid GridBaseOptions_columns_customizeText */
        customizeText?: (cellInfo: { value: any; valueText: string; target: string; groupInterval: any }) => string;

        /** @docid GridBaseOptions_columns_dataField */
        dataField?: string;

        /** @docid GridBaseOptions_columns_dataType */
        dataType?: string;

        /** @docid GridBaseOptions_columns_editCellTemplate */
        editCellTemplate?: any;

        /** @docid GridBaseOptions_columns_editorOptions */
        editorOptions?: Object;

        /** @docid GridBaseOptions_columns_encodeHtml */
        encodeHtml?: boolean;

        /** @docid GridBaseOptions_columns_falseText */
        falseText?: string;

        /** @docid GridBaseOptions_columns_fixed */
        fixed?: boolean;

        /** @docid GridBaseOptions_columns_hidingPriority */
        hidingPriority?: number;

        /** @docid GridBaseOptions_columns_fixedPosition */
        fixedPosition?: string;

        /** @docid GridBaseOptions_columns_format */
        format?: any;

        /** @docid GridBaseOptions_columns_headerCellTemplate */
        headerCellTemplate?: any;

        /** @docid GridBaseOptions_columns_lookup */
        lookup?: {
            /** @docid GridBaseOptions_columns_lookup_allowClearing */
            allowClearing?: boolean;

            /** @docid GridBaseOptions_columns_lookup_dataSource */
            dataSource?: any;

            /** @docid GridBaseOptions_columns_lookup_displayExpr */
            displayExpr?: any;

            /** @docid GridBaseOptions_columns_lookup_valueExpr */
            valueExpr?: string;
        };

        /** @docid GridBaseOptions_columns_showEditorAlways */
        showEditorAlways?: boolean;

        /** @docid GridBaseOptions_columns_sortIndex */
        sortIndex?: number;

        /** @docid GridBaseOptions_columns_sortOrder */
        sortOrder?: string;

        /** @docid GridBaseOptions_columns_trueText */
        trueText?: string;

        /** @docid GridBaseOptions_columns_visible */
        visible?: boolean;

        /** @docid GridBaseOptions_columns_visibleIndex */
        visibleIndex?: number;

        /** @docid GridBaseOptions_columns_width */
        width?: any;

        /** @docid GridBaseOptions_columns_minWidth */
        minWidth?: number;

        /** @docid GridBaseOptions_columns_validationRules */
        validationRules?: Array<Object>;

        /** @docid GridBaseOptions_columns_showInColumnChooser */
        showInColumnChooser?: boolean;

        /** @docid GridBaseOptions_columns_name */
        name?: string;

        /** @docid GridBaseOptions_columns_formItem */
        formItem?: DevExpress.ui.dxFormItem;

        /** @docid GridBaseOptions_columns_ownerBand */
        ownerBand?: number;

        /** @docid GridBaseOptions_columns_isBand */
        isBand?: boolean;

        /** @docid GridBaseOptions_columns_allowFiltering */
        allowFiltering?: boolean;

        /** @docid GridBaseOptions_columns_allowHeaderFiltering */
        allowHeaderFiltering?: boolean;

        /** @docid GridBaseOptions_columns_filterOperations */
        filterOperations?: Array<any>;

        /** @docid GridBaseOptions_columns_filterValue */
        filterValue?: any;

        /** @docid GridBaseOptions_columns_selectedFilterOperation */
        selectedFilterOperation?: string;

        /** @docid GridBaseOptions_columns_filterValues */
        filterValues?: Array<any>;

        /** @docid GridBaseOptions_columns_filterType */
        filterType?: string;

        /** @docid GridBaseOptions_columns_calculateFilterExpression */
        calculateFilterExpression?: (filterValue: any, selectedFilterOperation: string, target: string) => any;

        /** @docid GridBaseOptions_columns_headerFilter */
        headerFilter?: {
            /** @docid GridBaseOptions_columns_headerFilter_dataSource */
            dataSource?: any;

            /** @docid GridBaseOptions_columns_headerFilter_groupInterval */
            groupInterval?: any;
        };
    }

    export interface dxDataGridColumn extends GridBaseColumn {
        /** @docid_ignore dxDataGridOptions_columns_resized*/
        /** @docid_ignore dxDataGridOptions_columns_grouped*/

        /** @docid dxDataGridOptions_columns_allowGrouping */
        allowGrouping?: boolean;

        /** @docid dxDataGridOptions_columns_autoExpandGroup */
        autoExpandGroup?: boolean;

        /** @docid dxDataGridOptions_columns_allowExporting */
        allowExporting?: boolean;

        /** @docid dxDataGridOptions_columns_groupCellTemplate */
        groupCellTemplate?: any;

        /** @docid dxDataGridOptions_columns_groupIndex */
        groupIndex?: number;

        /** @docid dxDataGridOptions_columns_precision */
        precision?: number;

        /** @docid dxDataGridOptions_columns_calculateGroupValue */
        calculateGroupValue?: any;

        /** @docid dxDataGridOptions_columns_showWhenGrouped */
        showWhenGrouped?: boolean;

        /** @docid dxDataGridOptions_columns_columns */
        columns?: Array<dxDataGridColumn>;
    }

    export interface dxTreeListColumn extends GridBaseColumn {
        /** @docid dxTreeListOptions_columns_columns */
        columns?: Array<dxTreeListColumn>;
    }

    export interface GridBaseScrolling {
        /** @docid_ignore GridBaseOptions_scrolling */

        /** @docid GridBaseOptions_scrolling_preloadEnabled */
        preloadEnabled?: boolean;

        /** @docid GridBaseOptions_scrolling_useNative */
        useNative?: any;

        /** @docid GridBaseOptions_scrolling_showScrollbar */
        showScrollbar?: string;

        /** @docid GridBaseOptions_scrolling_scrollByContent */
        scrollByContent?: boolean;

        /** @docid GridBaseOptions_scrolling_scrollByThumb */
        scrollByThumb?: boolean;
    }

    export interface dxDataGridScrolling extends GridBaseScrolling {
        /** @docid dxDataGridOptions_scrolling_mode */
        mode?: string;
    }

    export interface dxTreeListScrolling extends GridBaseScrolling {
        /** @docid dxTreeListOptions_scrolling_mode */
        mode?: string;
    }

    export interface GridBaseEditing {
        /** @docid_ignore GridBaseOptions_editing */

        /** @docid GridBaseOptions_editing_mode */
        mode?: string;

        /** @docid GridBaseOptions_editing_allowUpdating */
        allowUpdating?: boolean;

        /** @docid GridBaseOptions_editing_allowAdding */
        allowAdding?: boolean;

        /** @docid GridBaseOptions_editing_allowDeleting */
        allowDeleting?: boolean;

        /** @docid GridBaseOptions_editing_form */
        form?: DevExpress.ui.dxFormOptions;

        /** @docid GridBaseOptions_editing_popup */
        popup?: DevExpress.ui.dxPopupOptions;
    }

    export interface dxDataGridEditing extends GridBaseEditing {
        /** @docid dxDataGridOptions_editing_editMode */
        editMode?: string;

        /** @docid dxDataGridOptions_editing_editEnabled */
        editEnabled?: boolean;

        /** @docid dxDataGridOptions_editing_insertEnabled */
        insertEnabled?: boolean;

        /** @docid dxDataGridOptions_editing_removeEnabled */
        removeEnabled?: boolean;

        /** @docid dxDataGridOptions_editing_texts */
        texts?: dxDataGridEditingTexts;
    }

    export interface dxTreeListEditing extends GridBaseEditing {
        /** @docid dxTreeListOptions_editing_texts */
        texts?: dxTreeListEditingTexts;
    }

    export interface GridBaseEditingTexts {
        /** @docid_ignore GridBaseOptions_editing_texts */

        /** @docid GridBaseOptions_editing_texts_saveAllChanges */
        saveAllChanges?: string;

        /** @docid GridBaseOptions_editing_texts_cancelRowChanges */
        cancelRowChanges?: string;

        /** @docid GridBaseOptions_editing_texts_cancelAllChanges */
        cancelAllChanges?: string;

        /** @docid GridBaseOptions_editing_texts_confirmDeleteMessage */
        confirmDeleteMessage?: string;

        /** @docid GridBaseOptions_editing_texts_confirmDeleteTitle */
        confirmDeleteTitle?: string;

        /** @docid GridBaseOptions_editing_texts_validationCancelChanges */
        validationCancelChanges?: string;

        /** @docid GridBaseOptions_editing_texts_deleteRow */
        deleteRow?: string;

        /** @docid GridBaseOptions_editing_texts_addRow */
        addRow?: string;

        /** @docid GridBaseOptions_editing_texts_editRow */
        editRow?: string;

        /** @docid GridBaseOptions_editing_texts_saveRowChanges */
        saveRowChanges?: string;

        /** @docid GridBaseOptions_editing_texts_undeleteRow */
        undeleteRow?: string;
    }

    export interface dxDataGridEditingTexts extends GridBaseEditingTexts {
    }

    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /** @docid dxTreeListOptions_editing_texts_addRowToNode */
        addRowToNode?: string;
    }

    export interface GridBaseSelection {
        /** @docid_ignore GridBaseOptions_selection */

        /** @docid GridBaseOptions_selection_allowSelectAll */
        allowSelectAll?: boolean;

        /** @docid GridBaseOptions_selection_mode */
        mode?: string;
    }

    export interface dxDataGridSelection extends GridBaseSelection {
        /** @docid dxDataGridOptions_selection_showCheckBoxesMode*/
        showCheckBoxesMode?: string;

        /** @docid dxDataGridOptions_selection_maxFilterLengthInRequest */
         maxFilterLengthInRequest?: number;

        /** @docid dxDataGridOptions_selection_selectAllMode */
        selectAllMode?: string;

         /** @docid dxDataGridOptions_selection_deferred */
        deferred?: boolean;
    }

    export interface dxTreeListSelection extends GridBaseSelection {
        /** @docid dxTreeListOptions_selection_recursive */
        recursive?: boolean;
    }

    export interface dxDataGridOptions extends GridBaseOptions {
        /** @docid_ignore dxDataGridOptions_regenerateColumnsByVisibleItems */

        /** @docid dxDataGridOptions_keyExpr */
        keyExpr?: any;

        /** @docid dxDataGridOptions_onContextMenuPreparing */
        onContextMenuPreparing?: (e: Object) => void;

        /** @docid dxDataGridOptions_onCellClick */
        onCellClick?: any;

        /** @docid dxDataGridOptions_onCellHoverChanged */
        onCellHoverChanged?: (e: Object) => void;

        /** @docid dxDataGridOptions_onCellPrepared */
        onCellPrepared?: (e: Object) => void;

        /** @docid dxDataGridOptions_columns */
        columns?: Array<dxDataGridColumn>;

        /** @docid dxDataGridOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxDataGridOptions_customizeColumns */
        customizeColumns?: (columns: Array<dxDataGridColumn>) => void;

        /** @docid dxDataGridOptions_customizeExportData */
        customizeExportData?: (columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRow>) => void;

        /** @docid dxDataGridOptions_onEditingStart */
        onEditingStart?: (e: {
            data: Object;
            key: any;
            cancel: boolean;
            column: dxDataGridColumn
        }) => void;

        /** @docid dxDataGridOptions_onEditorPrepared */
        onEditorPrepared?: (e: Object) => void;

        /** @docid dxDataGridOptions_onEditorPreparing */
        onEditorPreparing?: (e: Object) => void;

        /** @docid dxDataGridOptions_editing */
        editing?: dxDataGridEditing;

        /** @docid dxDataGridOptions_grouping */
        grouping?: {
            /** @docid dxDataGridOptions_grouping_allowCollapsing */
            allowCollapsing?: boolean;

            /** @docid dxDataGridOptions_grouping_autoExpandAll */
            autoExpandAll?: boolean;

            /** @docid dxDataGridOptions_grouping_contextMenuEnabled */
            contextMenuEnabled?: boolean;

            /** @docid dxDataGridOptions_grouping_expandMode */
            expandMode?: string;

            /** @docid dxDataGridOptions_grouping_groupContinuedMessage */
                groupContinuedMessage?: string;

            /** @docid dxDataGridOptions_grouping_groupContinuesMessage */
            groupContinuesMessage?: string;

            /** @docid dxDataGridOptions_grouping_texts */
            texts?: {
                /** @docid dxDataGridOptions_grouping_texts_groupContinuedMessage */
                groupContinuedMessage?: string;

                /** @docid dxDataGridOptions_grouping_texts_groupContinuesMessage */
                groupContinuesMessage?: string;

                /** @docid dxDataGridOptions_grouping_texts_groupByThisColumn */
                groupByThisColumn?: string;

                /** @docid dxDataGridOptions_grouping_texts_ungroup */
                ungroup?: string;

                /** @docid dxDataGridOptions_grouping_texts_ungroupAll */
                ungroupAll?: string;
            }
        };

        /** @docid dxDataGridOptions_groupPanel */
        groupPanel?: {
            /** @docid dxDataGridOptions_groupPanel_allowColumnDragging */
            allowColumnDragging?: boolean;

            /** @docid dxDataGridOptions_groupPanel_emptyPanelText */
            emptyPanelText?: string;

            /** @docid dxDataGridOptions_groupPanel_visible */
            visible?: any;
        };

        /** @docid dxDataGridOptions_pager */
        pager?: {
            /** @docid dxDataGridOptions_pager_allowedPageSizes */
            allowedPageSizes?: any;

            /** @docid dxDataGridOptions_pager_showPageSizeSelector */
            showPageSizeSelector?: boolean;

            /** @docid dxDataGridOptions_pager_visible */
            visible?: any;

            /** @docid dxDataGridOptions_pager_infoText */
            infoText?: string;

            /** @docid dxDataGridOptions_pager_showInfo */
            showInfo?: boolean;

            /** @docid dxDataGridOptions_pager_showNavigationButtons */
            showNavigationButtons?: boolean;
        };

        /** @docid dxDataGridOptions_paging */
        paging?: {
            /** @docid dxDataGridOptions_paging_enabled */
            enabled?: boolean;

            /** @docid dxDataGridOptions_paging_pageIndex */
            pageIndex?: number;

            /** @docid dxDataGridOptions_paging_pageSize */
            pageSize?: number;
        };

        /** @docid dxDataGridOptions_onRowClick */
        onRowClick?: any;

        /** @docid dxDataGridOptions_onRowPrepared */
        onRowPrepared?: (e: Object) => void;

        /** @docid dxDataGridOptions_rowTemplate */
        rowTemplate?: any;

        /** @docid dxDataGridOptions_selection */
        selection?: dxDataGridSelection;

        /** @docid dxDataGridOptions_selectionFilter */
        selectionFilter?: Object;

        /** @docid dxDataGridOptions_scrolling */
        scrolling?: dxDataGridScrolling;

        /** @docid dxDataGridOptions_remoteOperations */
        remoteOperations?: any;

        /** @docid dxDataGridOptions_sortByGroupSummaryInfo */
        sortByGroupSummaryInfo?: Array<{
            /** @docid dxDataGridOptions_sortByGroupSummaryInfo_summaryItem */
            summaryItem?: any;

            /** @docid dxDataGridOptions_sortByGroupSummaryInfo_groupColumn */
            groupColumn?: string;

            /** @docid dxDataGridOptions_sortByGroupSummaryInfo_sortOrder */
            sortOrder?: string;
        }>;

        /** @docid dxDataGridOptions_masterDetail */
        masterDetail?: {
            /** @docid dxDataGridOptions_masterDetail_enabled */
            enabled?: boolean;

            /** @docid dxDataGridOptions_masterDetail_autoExpandAll */
            autoExpandAll?: boolean;

            /** @docid dxDataGridOptions_masterDetail_template */
            template?: any;
        };

        /** @docid dxDataGridOptions_export */
        export?: {
            /** @docid dxDataGridOptions_export_enabled */
            enabled?: boolean;
            /** @docid dxDataGridOptions_export_fileName */
            fileName?: string;
            /** @docid dxDataGridOptions_export_excelFilterEnabled */
            excelFilterEnabled?: boolean;
            /** @docid dxDataGridOptions_export_excelWrapTextEnabled */
            excelWrapTextEnabled?: boolean;
            /** @docid dxDataGridOptions_export_proxyUrl */
            proxyUrl?: string;
            /** @docid dxDataGridOptions_export_allowExportSelectedData */
            allowExportSelectedData?: boolean;
            /** @docid dxDataGridOptions_export_texts */
            texts?: {
                /** @docid dxDataGridOptions_export_texts_exportTo */
                exportTo?: string;
                /** @docid dxDataGridOptions_export_texts_exportToExcel */
                exportToExcel?: string;
                /** @docid dxDataGridOptions_export_texts_excelFormat */
                excelFormat?: string;
                /** @docid dxDataGridOptions_export_texts_selectedRows */
                selectedRows?: string;
                /** @docid dxDataGridOptions_export_texts_exportAll */
                exportAll?: string;
                /** @docid dxDataGridOptions_export_texts_exportSelectedRows */
                exportSelectedRows?: string;
            }
        };

        /** @docid dxDataGridOptions_onExporting */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
        }) => void;

        /** @docid dxDataGridOptions_onFileSaving */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** @docid dxDataGridOptions_onExported */
        onExported?: (e: Object) => void;

        /** @docid dxDataGridOptions_stateStoring */
        stateStoring?: {
            /** @docid dxDataGridOptions_stateStoring_customLoad */
            customLoad?: () => JQueryPromise<Object>;

            /** @docid dxDataGridOptions_stateStoring_customSave */
            customSave?: (state: Object) => void;

            /** @docid dxDataGridOptions_stateStoring_enabled */
            enabled?: boolean;

            /** @docid dxDataGridOptions_stateStoring_savingTimeout */
            savingTimeout?: number;

            /** @docid dxDataGridOptions_stateStoring_storageKey */
            storageKey?: string;

            /** @docid dxDataGridOptions_stateStoring_type */
            type?: string;
        };

        /** @docid dxDataGridOptions_summary */
        summary?: {
            /** @docid dxDataGridOptions_summary_texts */
            texts?: {
                /** @docid dxDataGridOptions_summary_texts_sum */
                sum?: string;

                /** @docid dxDataGridOptions_summary_texts_sumOtherColumn */
                sumOtherColumn?: string;

                /** @docid dxDataGridOptions_summary_texts_min */
                min?: string;

                /** @docid dxDataGridOptions_summary_texts_minOtherColumn */
                minOtherColumn?: string;

                /** @docid dxDataGridOptions_summary_texts_max */
                max?: string;

                /** @docid dxDataGridOptions_summary_texts_maxOtherColumn */
                maxOtherColumn?: string;

                /** @docid dxDataGridOptions_summary_texts_avg */
                avg?: string;

                /** @docid dxDataGridOptions_summary_texts_avgOtherColumn */
                avgOtherColumn?: string;

                /** @docid dxDataGridOptions_summary_texts_count */
                count?: string;
            };

            /** @docid dxDataGridOptions_summary_groupItems */
            groupItems?: Array<{
                /** @docid dxDataGridOptions_summary_groupItems_name */
                name?: string;

                /** @docid dxDataGridOptions_summary_groupItems_column */
                column?: string;

                /** @docid dxDataGridOptions_summary_groupItems_customizeText */
                customizeText?: (itemInfo: {
                    value: any;
                    valueText: string;
                }) => string;

                /** @docid dxDataGridOptions_summary_groupItems_displayFormat */
                displayFormat?: string;

                /** @docid dxDataGridOptions_summary_groupItems_precision */
                precision?: number;

                /** @docid dxDataGridOptions_summary_groupItems_showInGroupFooter */
                showInGroupFooter?: boolean;

                /** @docid dxDataGridOptions_summary_groupItems_alignByColumn */
                alignByColumn?: boolean;

                /** @docid dxDataGridOptions_summary_groupItems_showInColumn */
                showInColumn?: string;

                /** @docid dxDataGridOptions_summary_groupItems_summaryType */
                summaryType?: string;

                /** @docid dxDataGridOptions_summary_groupItems_valueFormat */
                valueFormat?: any;

                /** @docid dxDataGridOptions_summary_groupItems_skipEmptyValues */
                skipEmptyValues?: boolean;
            }>;

            /** @docid dxDataGridOptions_summary_totalItems */
            totalItems?: Array<{
                /** @docid dxDataGridOptions_summary_totalItems_name */
                name?: string;

                /** @docid dxDataGridOptions_summary_totalItems_alignment */
                alignment?: string;

                /** @docid dxDataGridOptions_summary_totalItems_column */
                column?: string;

                /** @docid dxDataGridOptions_summary_totalItems_cssClass */
                cssClass?: string;

                /** @docid dxDataGridOptions_summary_totalItems_customizeText */
                customizeText?: (itemInfo: {
                    value: any;
                    valueText: string;
                }) => string;

                /** @docid dxDataGridOptions_summary_totalItems_displayFormat */
                displayFormat?: string;

                /** @docid dxDataGridOptions_summary_totalItems_precision */
                precision?: number;

                /** @docid dxDataGridOptions_summary_totalItems_showInColumn */
                showInColumn?: string;

                /** @docid dxDataGridOptions_summary_totalItems_summaryType */
                summaryType?: string;

                /** @docid dxDataGridOptions_summary_totalItems_valueFormat */
                valueFormat?: any;

                /** @docid dxDataGridOptions_summary_totalItems_skipEmptyValues */
                skipEmptyValues?: boolean;
            }>;

            /** @docid dxDataGridOptions_summary_skipEmptyValues */
            skipEmptyValues?: boolean;

            /** @docid dxDataGridOptions_summary_calculateCustomSummary */
            calculateCustomSummary?: (options: {
                component: dxDataGrid;
                name?: string;
                value: any;
                totalValue: any;
                summaryProcess: string
            }) => void;
        };
    }

    export interface dxTreeListOptions extends GridBaseOptions {
        /** @docid dxTreeListOptions_keyExpr */
        keyExpr?: any;

        /** @docid dxTreeListOptions_parentIdExpr */
        parentIdExpr?: any;

        /** @docid dxTreeListOptions_itemsExpr */
        itemsExpr?: any;

        /** @docid dxTreeListOptions_hasItemsExpr */
        hasItemsExpr?: any;

        /** @docid dxTreeListOptions_rootValue */
        rootValue?: Object;

        /** @docid dxTreeListOptions_dataStructure */
        dataStructure?: string;

        /** @docid dxTreeListOptions_expandedRowKeys */
        expandedRowKeys?: Array<any>;

        /** @docid dxTreeListOptions_expandNodesOnFiltering */
        expandNodesOnFiltering?: boolean;

        /** @docid dxTreeListOptions_autoExpandAll */
        autoExpandAll?: boolean;

        /** @docid dxTreeListOptions_columns */
        columns?: Array<dxTreeListColumn>;

        /** @docid dxTreeListOptions_onContextMenuPreparing */
        onContextMenuPreparing?: (e: Object) => void;

        /** @docid dxTreeListOptions_onCellClick */
        onCellClick?: any;

        /** @docid dxTreeListOptions_onCellHoverChanged */
        onCellHoverChanged?: (e: Object) => void;

        /** @docid dxTreeListOptions_onCellPrepared */
        onCellPrepared?: (e: Object) => void;

        /** @docid dxTreeListOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxTreeListOptions_customizeColumns */
        customizeColumns?: (columns: Array<dxTreeListColumn>) => void;

        /** @docid dxTreeListOptions_onRowClick */
        onRowClick?: any;

        /** @docid dxTreeListOptions_onRowPrepared */
        onRowPrepared?: (e: Object) => void;

        /** @docid dxTreeListOptions_onEditingStart */
        onEditingStart?: (e: {
            data: Object;
            key: any;
            cancel: boolean;
            column: dxTreeListColumn
        }) => void;

        /** @docid dxTreeListOptions_onEditorPrepared */
        onEditorPrepared?: (e: Object) => void;

        /** @docid dxTreeListOptions_onEditorPreparing */
        onEditorPreparing?: (e: Object) => void;

        /** @docid dxTreeListOptions_editing */
        editing?: dxTreeListEditing;

         /** @docid dxTreeListOptions_selection */
        selection?: dxTreeListSelection;

        /** @docid dxTreeListOptions_scrolling */
        scrolling?: dxTreeListScrolling;

        /** @docid dxTreeListOptions_onNodesInitialized */
        onNodesInitialized?: (e: Object) => void;

        /** @docid dxTreeListOptions_remoteOperations */
        remoteOperations?: any;
    }

    export interface GridBaseOptions extends WidgetOptions {
        /** @docid_ignore GridBaseOptions_columns */

        /** @docid GridBaseOptions_showBorders */
        showBorders?: boolean;

        /** @docid GridBaseOptions_cellHintEnabled */
        cellHintEnabled?: boolean;

        /** @docid GridBaseOptions_allowColumnReordering */
        allowColumnReordering?: boolean;

        /** @docid GridBaseOptions_allowColumnResizing */
        allowColumnResizing?: boolean;

        /** @docid GridBaseOptions_columnResizingMode */
        columnResizingMode?: string;

        /** @docid GridBaseOptions_columnMinWidth */
        columnMinWidth?: number;

        /** @docid GridBaseOptions_columnAutoWidth */
        columnAutoWidth?: boolean;

        /** @docid GridBaseOptions_dataSource */
        dataSource?: any;

        /** @docid GridBaseOptions_cacheEnabled */
        cacheEnabled?: boolean;

        /** @docid GridBaseOptions_loadPanel */
        loadPanel?: {
            /** @docid GridBaseOptions_loadPanel_enabled */
            enabled?: any;

            /** @docid GridBaseOptions_loadPanel_height */
            height?: number;

            /** @docid GridBaseOptions_loadPanel_indicatorSrc */
            indicatorSrc?: string;

            /** @docid GridBaseOptions_loadPanel_showIndicator */
            showIndicator?: boolean;

            /** @docid GridBaseOptions_loadPanel_showPane */
            showPane?: boolean;

            /** @docid GridBaseOptions_loadPanel_text */
            text?: string;

            /** @docid GridBaseOptions_loadPanel_width */
            width?: number;
        };

        /** @docid GridBaseOptions_noDataText */
        noDataText?: string;

        /** @docid GridBaseOptions_rowAlternationEnabled */
        rowAlternationEnabled?: boolean;

        /** @docid GridBaseOptions_twoWayBindingEnabled */
        twoWayBindingEnabled?: boolean;

        /** @docid GridBaseOptions_onDataErrorOccurred */
        onDataErrorOccurred?: (e: { error: Error }) => void;

        /** @docid GridBaseOptions_showColumnHeaders */
        showColumnHeaders?: boolean;

        /** @docid GridBaseOptions_showColumnLines */
        showColumnLines?: boolean;

        /** @docid GridBaseOptions_showRowLines */
        showRowLines?: boolean;

        /** @docid GridBaseOptions_sorting */
        sorting?: {
            /** @docid GridBaseOptions_sorting_ascendingText */
            ascendingText?: string;

            /** @docid GridBaseOptions_sorting_clearText */
            clearText?: string;

            /** @docid GridBaseOptions_sorting_descendingText */
            descendingText?: string;

            /** @docid GridBaseOptions_sorting_sortingMode */
            mode?: string;
        };

        /** @docid GridBaseOptions_wordWrapEnabled */
        wordWrapEnabled?: boolean;

        /** @docid GridBaseOptions_dateSerializationFormat */
        dateSerializationFormat?: string;

        /** @docid GridBaseOptions_onInitNewRow */
        onInitNewRow?: (e: { data: Object }) => void;

        /** @docid GridBaseOptions_onRowInserted */
        onRowInserted?: (e: { data: Object; key: any }) => void;

        /** @docid GridBaseOptions_onRowInserting */
        onRowInserting?: (e: { data: Object; cancel: any }) => void;

        /** @docid GridBaseOptions_onRowRemoved */
        onRowRemoved?: (e: { data: Object; key: any }) => void;

        /** @docid GridBaseOptions_onRowRemoving */
        onRowRemoving?: (e: { data: Object; key: any; cancel: any }) => void;

        /** @docid GridBaseOptions_onRowUpdated */
        onRowUpdated?: (e: { data: Object; key: any }) => void;

        /** @docid GridBaseOptions_onRowUpdating */
        onRowUpdating?: (e: { oldData: Object; newData: Object; key: any; cancel: any }) => void;

        /** @docid GridBaseOptions_onRowValidating */
        onRowValidating?: (e: Object) => void;

        /** @docid GridBaseOptions_onToolbarPreparing */
        onToolbarPreparing?: (e: Object) => void;

        /** @docid GridBaseOptions_columnChooser */
        columnChooser?: {
            /** @docid GridBaseOptions_columnChooser_emptyPanelText */
            emptyPanelText?: string;

            /** @docid GridBaseOptions_columnChooser_enabled */
            enabled?: boolean;

            /** @docid GridBaseOptions_columnChooser_mode */
            mode?: string;

            /** @docid GridBaseOptions_columnChooser_height */
            height?: number;

            /** @docid GridBaseOptions_columnChooser_title */
            title?: string;

            /** @docid GridBaseOptions_columnChooser_width */
            width?: number;
        };

        /** @docid GridBaseOptions_columnFixing */
        columnFixing?: {
            /** @docid GridBaseOptions_columnFixing_enabled */
            enabled?: boolean;

            /** @docid GridBaseOptions_columnFixing_texts */
            texts?: {
                /** @docid GridBaseOptions_columnFixing_texts_fix */
                fix?: string;

                /** @docid GridBaseOptions_columnFixing_texts_unfix */
                unfix?: string;

                /** @docid GridBaseOptions_columnFixing_texts_leftPosition */
                leftPosition?: string;

                /** @docid GridBaseOptions_columnFixing_texts_rightPosition */
                rightPosition?: string;
            };
        };

        /** @docid GridBaseOptions_filterRow */
        filterRow?: {

            /** @docid GridBaseOptions_filterRow_applyFilter */
            applyFilter?: string;

            /** @docid GridBaseOptions_filterRow_applyFilterText */
            applyFilterText?: string;

            /** @docid GridBaseOptions_filterRow_operationDescriptions */
            operationDescriptions?: {
                /** @docid GridBaseOptions_filterRow_operationDescriptions_equal */
                equal?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_notEqual */
                notEqual?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_lessThan */
                lessThan?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_lessThanOrEqual */
                lessThanOrEqual?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_greaterThan */
                greaterThan?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_greaterThanOrEqual */
                greaterThanOrEqual?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_startsWith */
                startsWith?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_contains */
                contains?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_notContains */
                notContains?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_endsWith */
                endsWith?: string;
                /** @docid GridBaseOptions_filterRow_operationDescriptions_between */
                between?: string;
            };

            /** @docid GridBaseOptions_filterRow_resetOperationText */
            resetOperationText?: string;

            /** @docid GridBaseOptions_filterRow_showAllText */
            showAllText?: string;

            /** @docid GridBaseOptions_filterRow_betweenStartText */
            betweenStartText?: string;

            /** @docid GridBaseOptions_filterRow_betweenEndText */
            betweenEndText?: string;

            /** @docid GridBaseOptions_filterRow_showOperationChooser */
            showOperationChooser?: boolean;

            /** @docid GridBaseOptions_filterRow_visible */
            visible?: boolean;
        };

        /** @docid GridBaseOptions_headerFilter */
        headerFilter?: {
            /** @docid GridBaseOptions_headerFilter_visible */
            visible?: boolean;

            /** @docid GridBaseOptions_headerFilter_height */
            height?: number;

            /** @docid GridBaseOptions_headerFilter_width */
            width?: number;

            /** @docid GridBaseOptions_headerFilter_texts */
            texts?: {
                /** @docid GridBaseOptions_headerFilter_texts_emptyValue */
                emptyValue?: string;

                /** @docid GridBaseOptions_headerFilter_texts_ok */
                ok?: string;

                /** @docid GridBaseOptions_headerFilter_texts_cancel */
                cancel?: string;
            }
        };

        /** @docid GridBaseOptions_columnHidingEnabled */
        columnHidingEnabled?: boolean;

        /** @docid GridBaseOptions_onAdaptiveDetailRowPreparing */
        onAdaptiveDetailRowPreparing?: (e: Object) => void;

        /** @docid GridBaseOptions_errorRowEnabled */
        errorRowEnabled?: boolean;

        /** @docid GridBaseOptions_selectedRowKeys */
        selectedRowKeys?: Array<any>;

        /** @docid GridBaseOptions_onSelectionChanged */
        onSelectionChanged?: (e: {
            currentSelectedRowKeys: Array<any>;
            currentDeselectedRowKeys: Array<any>;
            selectedRowKeys: Array<any>;
            selectedRowsData: Array<any>;
        }) => void;

        /** @docid GridBaseOptions_onKeyDown */
        onKeyDown?: (e: Object) => void;

        /** @docid GridBaseOptions_searchPanel */
        searchPanel?: {
            /** @docid GridBaseOptions_searchPanel_highlightSearchText */
            highlightSearchText?: boolean;

            /** @docid GridBaseOptions_searchPanel_highlightCaseSensitive */
            highlightCaseSensitive?: boolean;

            /** @docid GridBaseOptions_searchPanel_placeholder */
            placeholder?: string;

            /** @docid GridBaseOptions_searchPanel_visible */
            visible?: boolean;

            /** @docid GridBaseOptions_searchPanel_searchVisibleColumnsOnly */
            searchVisibleColumnsOnly?: boolean;

            /** @docid GridBaseOptions_searchPanel_width */
            width?: number;

            /** @docid GridBaseOptions_searchPanel_text */
            text?: string;
        };

        /** @docid GridBaseOptions_onRowExpanding */
        onRowExpanding?: (e: Object) => void;

        /** @docid GridBaseOptions_onRowExpanded */
        onRowExpanded?: (e: Object) => void;

        /** @docid GridBaseOptions_onRowCollapsing */
        onRowCollapsing?: (e: Object) => void;

        /** @docid GridBaseOptions_onRowCollapsed */
        onRowCollapsed?: (e: Object) => void;
    }

    /** @docid GridBase */
    class GridBase extends Widget implements DataHelperMixin {
        constructor(element: JQuery, options?: GridBaseOptions);
        constructor(element: Element, options?: GridBaseOptions);

        /** @docid_ignore GridBaseMethods_stopSelectionWithCheckboxes */

        /** @docid GridBaseMethods_clearSorting */
        clearSorting(): void;

        /** @docid GridBaseMethods_getCellElement#getCellElement(rowIndex,dataField) */
        getCellElement(rowIndex: number, dataField: string): any;

        /** @docid GridBaseMethods_getCellElement#getCellElement(rowIndex,visibleColumnIndex) */
        getCellElement(rowIndex: number, visibleColumnIndex: number): any;

        /** @docid GridBaseMethods_getRowElement */
        getRowElement(rowIndex: number): any;

        /** @docid GridBaseMethods_getRowIndexByKey */
        getRowIndexByKey(key: any): number;

        /** @docid GridBaseMethods_getKeyByRowIndex */
        getKeyByRowIndex(rowIndex: number): any;

        /** @docid GridBaseMethods_deleteColumn */
        deleteColumn(id: any): void;

        /** @docid GridBaseMethods_beginCustomLoading */
        beginCustomLoading(messageText: string): void;

        /** @docid GridBaseMethods_endCustomLoading */
        endCustomLoading(): void;

        /** @docid GridBaseMethods_columnCount */
        columnCount(): number;

        /** @docid GridBaseMethods_columnOption#columnOption(id,optionName) */
        columnOption(id: any, optionName: string): any;

        /** @docid GridBaseMethods_columnOption#columnOption(id,optionName,optionValue) */
        columnOption(id: any, optionName: string, optionValue: any): void;

        /** @docid GridBaseMethods_columnOption#columnOption(id) */
        columnOption(id: any): Object;

        /** @docid GridBaseMethods_columnOption#columnOption(id,options) */
        columnOption(id: any, options: Object): void;

        /** @docid GridBaseMethods_keyOf */
        keyOf(obj: Object): any;

        /** @docid GridBaseMethods_byKey */
        byKey(key: any): JQueryPromise<any>;

        /** @docid GridBaseMethods_refresh */
        refresh(): JQueryPromise<any>;

        /** @docid GridBaseMethods_updateDimensions */
        updateDimensions(): void;

        getDataSource(): DevExpress.data.DataSource;

        /** @docid GridBaseMethods_getScrollable */
        getScrollable(): dxScrollable;

        /** @docid GridBaseMethods_repaintRows */
        repaintRows(rowIndexes: Array<number>): void;

        /** @docid GridBaseMethods_editCell#editCell(rowIndex,visibleColumnIndex) */
        editCell(rowIndex: number, visibleColumnIndex: number): void;

        /** @docid GridBaseMethods_editCell#editCell(rowIndex,dataField) */
        editCell(rowIndex: number, dataField: string): void;

        /** @docid GridBaseMethods_editRow */
        editRow(rowIndex: number): void;

        /** @docid GridBaseMethods_cellValue#cellValue(rowIndex,dataField) */
        cellValue(rowIndex: number, dataField: string): any;

        /** @docid GridBaseMethods_cellValue#cellValue(rowIndex,visibleColumnIndex) */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;

        /** @docid GridBaseMethods_cellValue#cellValue(rowIndex,dataField,value) */
        cellValue(rowIndex: number, dataField: string, value: any): void;

        /** @docid GridBaseMethods_cellValue#cellValue(rowIndex,visibleColumnIndex,value) */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;

        /** @docid GridBaseMethods_deleteRow */
        deleteRow(rowIndex: number): void;

        /** @docid GridBaseMethods_saveEditData */
        saveEditData(): JQueryPromise<any>;

        /** @docid GridBaseMethods_undeleteRow */
        undeleteRow(rowIndex: number): void;

        /** @docid GridBaseMethods_cancelEditData */
        cancelEditData(): void;

        /** @docid GridBaseMethods_hasEditData */
        hasEditData(): boolean;

        /** @docid GridBaseMethods_closeEditCell */
        closeEditCell(): void;

        /** @docid GridBaseMethods_isAdaptiveDetailRowExpanded */
        isAdaptiveDetailRowExpanded(key: any): void;

        /** @docid GridBaseMethods_expandAdaptiveDetailRow */
        expandAdaptiveDetailRow(key: any): void;

        /** @docid GridBaseMethods_collapseAdaptiveDetailRow */
        collapseAdaptiveDetailRow(): void;

        /** @docid GridBaseMethods_selectAll */
        selectAll(): JQueryPromise<any>;

        /** @docid GridBaseMethods_deselectAll */
        deselectAll(): JQueryPromise<any>;

        /** @docid GridBaseMethods_selectRows */
        selectRows(keys: Array<any>, preserve: boolean): JQueryPromise<any>;

        /** @docid GridBaseMethods_deselectRows */
        deselectRows(keys: Array<any>): JQueryPromise<any>;

        /** @docid GridBaseMethods_selectRowsByIndexes */
        selectRowsByIndexes(indexes: Array<any>): JQueryPromise<any>;

        /** @docid GridBaseMethods_clearSelection */
        clearSelection(): void;

        /** @docid GridBaseMethods_startSelectionWithCheckboxes */
        startSelectionWithCheckboxes(): boolean;

        /** @docid_ignore dxDataGridMethods_isRowSelected(data) */
        /** @docid GridBaseMethods_isRowSelected(key) */
        isRowSelected(arg: any): boolean;

        /** @docid GridBaseMethods_searchByText */
        searchByText(text: string): void;

        /** @docid GridBaseMethods_focus */
        focus(element?: JQuery): void;

        /** @docid GridBaseMethods_clearFilter#clearFilter() */
        clearFilter(): void;

        /** @docid GridBaseMethods_clearFilter#clearFilter(filterName) */
        clearFilter(filterName: string): void;

        /** @docid GridBaseMethods_filter#filter(filterExpr) */
        filter(filterExpr?: any): void;

        /** @docid GridBaseMethods_filter#filter() */
        filter(): any;

        /** @docid GridBaseMethods_getCombinedFilter#getCombinedFilter() */
        getCombinedFilter(): any;

        /** @docid GridBaseMethods_getCombinedFilter#getCombinedFilter(returnDataField) */
        getCombinedFilter(returnDataField?: boolean): any;

        /** @docid GridBaseMethods_hideColumnChooser */
        hideColumnChooser(): void;

        /** @docid GridBaseMethods_showColumnChooser */
        showColumnChooser(): void;
    }

    /** @docid dxTreeList */
    export class dxTreeList extends GridBase {
        constructor(element: JQuery, options?: dxTreeListOptions);
        constructor(element: Element, options?: dxTreeListOptions);

        /** @docid dxTreeListMethods_addColumn */
        addColumn(columnOptions: dxTreeListColumn): void;

        /** @docid dxTreeListMethods_getVisibleColumns#getVisibleColumns() */
        getVisibleColumns(): Array<dxTreeListColumn>;

        /** @docid dxTreeListMethods_getVisibleColumns#getVisibleColumns(headerLevel) */
        getVisibleColumns(headerLevel?: number): Array<dxTreeListColumn>;

        /** @docid dxTreeListMethods_getVisibleRows */
        getVisibleRows(): Array<dxTreeListRow>;

        /** @docid dxTreeListMethods_getRootNode */
        getRootNode(): dxTreeListNode;

        /** @docid dxTreeListMethods_isRowExpanded */
        isRowExpanded(key: any): boolean;

        /** @docid dxTreeListMethods_expandRow */
        expandRow(key: any): void;

        /** @docid dxTreeListMethods_collapseRow */
        collapseRow(key: any): void;

        /** @docid dxTreeListMethods_getSelectedRowKeys#getSelectedRowKeys() */
        getSelectedRowKeys(): Array<any>;

        /** @docid dxTreeListMethods_getSelectedRowKeys#getSelectedRowKeys(leavesOnly) */
        getSelectedRowKeys(leavesOnly: boolean): Array<any>;

        /** @docid dxTreeListMethods_getSelectedRowsData */
        getSelectedRowsData(): Array<any>;

        /** @docid dxTreeListMethods_getNodeByKey */
        getNodeByKey(key: any): dxTreeListNode;

        /** @docid dxTreeListMethods_addRow#addRow() */
        addRow(): void;

        /** @docid dxTreeListMethods_addRow#addRow(parentId) */
        addRow(parentId: any): void;

        /** @docid dxTreeListMethods_loadDescendants#loadDescendants() */
        loadDescendants(): JQueryPromise<void>;

        /** @docid dxTreeListMethods_loadDescendants#loadDescendants(keys) */
        loadDescendants(keys: any): JQueryPromise<void>;

        /** @docid dxTreeListMethods_loadDescendants#loadDescendants(keys, childrenOnly) */
        loadDescendants(keys: any, childrenOnly: boolean): JQueryPromise<void>;
    }

    /** @docid dxdataGrid */
    export class dxDataGrid extends GridBase {
        constructor(element: JQuery, options?: dxDataGridOptions);
        constructor(element: Element, options?: dxDataGridOptions);


        /** @docid dxDataGridMethods_clearGrouping */
        clearGrouping(): void;

        /** @docid dxDataGridMethods_state#state() */
        state(): Object;

        /** @docid dxDataGridMethods_state#state(state) */
        state(state: Object): void;

        /** @docid dxDataGridMethods_addColumn */
        addColumn(columnOptions: dxDataGridColumn): void;

        /** @docid dxDataGridMethods_collapseAll */
        collapseAll(groupIndex?: number): void;

        /** @docid dxDataGridMethods_getVisibleColumns#getVisibleColumns() */
        getVisibleColumns(): Array<dxDataGridColumn>;

        /** @docid dxDataGridMethods_getVisibleColumns#getVisibleColumns(headerLevel) */
        getVisibleColumns(headerLevel?: number): Array<dxDataGridColumn>;

        /** @docid dxDataGridMethods_getVisibleRows */
        getVisibleRows(): Array<dxDataGridRow>;

        /** @docid dxDataGridMethods_expandAll */
        expandAll(groupIndex: number): void;

        /** @docid dxDataGridMethods_isRowExpanded */
        isRowExpanded(key: any): boolean;

        /** @docid dxDataGridMethods_expandRow */
        expandRow(key: any): void;

        /** @docid dxDataGridMethods_collapseRow */
        collapseRow(key: any): void;

        /** @docid dxDataGridMethods_insertRow */
        insertRow(): void;

        /** @docid dxDataGridMethods_pageIndex#pageIndex(newIndex) */
        pageIndex(newIndex: number): void;

        /** @docid dxDataGridMethods_pageIndex#pageIndex() */
        pageIndex(): number;

        /** @docid dxDataGridMethods_pageSize#pageSize(value) */
        pageSize(value: number): void;

        /** @docid dxDataGridMethods_pageSize#pageSize() */
        pageSize(): number;

        /** @docid dxDataGridMethods_removeRow */
        removeRow(rowIndex: number): void;

        /** @docid dxDataGridMethods_pageCount */
        pageCount(): number;

        /** @docid dxDataGridMethods_totalCount */
        totalCount(): number;

        /** @docid dxDataGridMethods_getTotalSummaryValue */
        getTotalSummaryValue(summaryItemName: string): any;

        /** @docid dxDataGridMethods_exportToExcel */
        exportToExcel(selectionOnly: boolean): void;

        /** @docid dxDataGridMethods_getSelectedRowsData */
        getSelectedRowsData(): any;

        /** @docid dxDataGridMethods_getSelectedRowKeys */
        getSelectedRowKeys(): any;

        /** @docid dxDataGridMethods_addRow */
        addRow(): void;
    }

    export interface dxPivotGridOptions extends WidgetOptions {
        /** @docid_ignore dxPivotGridOptions_activeStateEnabled */
        /** @docid_ignore dxPivotGridOptions_hoverStateEnabled */
        /** @docid_ignore dxPivotGridOptions_focusStateEnabled */
        /** @docid_ignore dxPivotGridOptions_accessKey */

        /** @docid_ignore dxPivotGridPivotGridCell_text */
        /** @docid_ignore dxPivotGridPivotGridCell_value */
        /** @docid_ignore dxPivotGridPivotGridCell_rowPath */
        /** @docid_ignore dxPivotGridPivotGridCell_columnPath */
        /** @docid_ignore dxPivotGridPivotGridCell_dataIndex */
        /** @docid_ignore dxPivotGridPivotGridCell_path */
        /** @docid_ignore dxPivotGridPivotGridCell_columnType */
        /** @docid_ignore dxPivotGridPivotGridCell_rowType */
        /** @docid_ignore dxPivotGridPivotGridCell_type */
        /** @docid_ignore dxPivotGridPivotGridCell_expanded */

        /** @docid dxPivotGridOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxPivotGridOptions_dataSource */
        dataSource?: any;

        /** @docid dxPivotGridOptions_useNativeScrolling */
        useNativeScrolling?: any;

        /** @docid dxPivotGridOptions_scrolling */
        scrolling?: {
            /** @docid dxPivotGridOptions_scrolling_mode */
            mode?: string;

            /** @docid dxPivotGridOptions_scrolling_useNative */
            useNative?: any;
        };

        /** @docid dxPivotGridOptions_allowSorting */
        allowSorting?: boolean;

        /** @docid dxPivotGridOptions_allowSortingBySummary */
        allowSortingBySummary?: boolean;

        /** @docid dxPivotGridOptions_allowFiltering */
        allowFiltering?: boolean;

        /** @docid dxPivotGridOptions_dataFieldArea */
        dataFieldArea?: string;

         /** @docid dxPivotGridOptions_fieldPanel */
        fieldPanel?: {
            /** @docid dxPivotGridOptions_fieldPanel_allowFieldDragging */
            allowFieldDragging?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_showFilterFields */
            showFilterFields?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_showDataFields */
            showDataFields?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_showColumnFields */
            showColumnFields?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_showRowFields */
            showRowFields?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_visible */
            visible?: boolean;

            /** @docid dxPivotGridOptions_fieldPanel_texts */
            texts?: {
                /** @docid dxPivotGridOptions_fieldPanel_texts_columnFieldArea */
                columnFieldArea?: string;
                /** @docid dxPivotGridOptions_fieldPanel_texts_rowFieldArea */
                rowFieldArea?: string;
                /** @docid dxPivotGridOptions_fieldPanel_texts_filterFieldArea */
                filterFieldArea?: string;
                /** @docid dxPivotGridOptions_fieldPanel_texts_dataFieldArea */
                dataFieldArea?: string;
            }
        }

        /** @docid dxPivotGridOptions_allowExpandAll */
        allowExpandAll?: boolean;

        /** @docid dxPivotGridOptions_wordWrapEnabled */
        wordWrapEnabled?: boolean;

        /** @docid dxPivotGridOptions_showRowTotals */
        showRowTotals?: boolean;

        /** @docid dxPivotGridOptions_showRowGrandTotals */
        showRowGrandTotals?: boolean;

        /** @docid dxPivotGridOptions_showColumnTotals */
        showColumnTotals?: boolean;

        /** @docid dxPivotGridOptions_showColumnGrandTotals */
        showColumnGrandTotals?: boolean;

        /** @docid dxPivotGridOptions_hideEmptySummaryCells */
        hideEmptySummaryCells?: boolean;

        /** @docid dxPivotGridOptions_showTotalsPrior*/
        showTotalsPrior?: string;

        /** @docid dxPivotGridOptions_rowHeaderLayout*/
        rowHeaderLayout?: string;

        /** @docid dxPivotGridOptions_showBorders */
        showBorders?: boolean;

        /** @docid dxPivotGridOptions_fieldChooser */
        fieldChooser?: {
            /** @docid dxPivotGridOptions_fieldChooser_enabled */
            enabled?: boolean;

            /** @docid dxPivotGridOptions_fieldChooser_layout */
            layout?: number;

            /** @docid dxPivotGridOptions_fieldChooser_title */
            title?: string;

            /** @docid dxPivotGridOptions_fieldChooser_width */
            width?: number;

            /** @docid dxPivotGridOptions_fieldChooser_height */
            height?: number;

            /** @docid dxPivotGridOptions_fieldChooser_texts */
            texts?: {
                /** @docid dxPivotGridOptions_fieldChooser_texts_rowFields */
                rowFields?: string;
                /** @docid dxPivotGridOptions_fieldChooser_texts_columnFields */
                columnFields?: string;
                /** @docid dxPivotGridOptions_fieldChooser_texts_dataFields */
                dataFields?: string;
                /** @docid dxPivotGridOptions_fieldChooser_texts_filterFields */
                filterFields?: string;
                /** @docid dxPivotGridOptions_fieldChooser_texts_allFields */
                allFields?: string;
            };
        }
        /** @docid dxPivotGridOptions_texts */
        texts?: {
            /** @docid dxPivotGridOptions_texts_grandTotal */
            grandTotal?: string;
            /** @docid dxPivotGridOptions_texts_total */
            total?: string;
            /** @docid dxPivotGridOptions_texts_noData */
            noData?: string;
            /** @docid dxPivotGridOptions_texts_showFieldChooser */
            showFieldChooser?: string;
            /** @docid dxPivotGridOptions_texts_expandAll */
            expandAll?: string;
            /** @docid dxPivotGridOptions_texts_collapseAll */
            collapseAll?: string;
            /** @docid dxPivotGridOptions_texts_sortColumnBySummary */
            sortColumnBySummary?: string;
            /** @docid dxPivotGridOptions_texts_sortRowBySummary */
            sortRowBySummary?: string;
            /** @docid dxPivotGridOptions_texts_removeAllSorting */
            removeAllSorting?: string;
            /** @docid dxPivotGridOptions_texts_exportToExcel */
            exportToExcel?: string;
            /** @docid dxPivotGridOptions_texts_dataNotAvailable */
            dataNotAvailable?: string;
        };

        /** @docid dxPivotGridOptions_loadPanel */
        loadPanel?: {
            /** @docid dxPivotGridOptions_loadPanel_enabled */
            enabled?: boolean;

            /** @docid dxPivotGridOptions_loadPanel_height */
            height?: number;

            /** @docid dxPivotGridOptions_loadPanel_indicatorSrc */
            indicatorSrc?: string;

            /** @docid dxPivotGridOptions_loadPanel_showIndicator */
            showIndicator?: boolean;

            /** @docid dxPivotGridOptions_loadPanel_showPane */
            showPane?: boolean;

            /** @docid dxPivotGridOptions_loadPanel_text */
            text?: string;

            /** @docid dxPivotGridOptions_loadPanel_width */
            width?: number;
        };

        /** @docid dxPivotGridOptions_onCellClick */
        onCellClick?: (e: any) => void;

        /** @docid dxPivotGridOptions_onCellPrepared */
        onCellPrepared?: (e: any) => void;

        /** @docid dxPivotGridOptions_onContextMenuPreparing */
        onContextMenuPreparing?: (e: Object) => void;

        /** @docid dxPivotGridOptions_export */
        export?: {
            /** @docid dxPivotGridOptions_export_enabled */
            enabled?: boolean;
            /** @docid dxPivotGridOptions_export_fileName */
            fileName?: string;
            /** @docid dxPivotGridOptions_export_proxyUrl */
            proxyUrl?: string;
        };

        /** @docid dxPivotGridOptions_onExporting */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
        }) => void;

        /** @docid dxPivotGridOptions_onFileSaving */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** @docid dxPivotGridOptions_onExported */
        onExported?: (e: Object) => void;

        /** @docid dxPivotGridOptions_stateStoring */
        stateStoring?: {
            /** @docid dxPivotGridOptions_stateStoring_customLoad */
            customLoad?: () => JQueryPromise<Object>;

            /** @docid dxPivotGridOptions_stateStoring_customSave */
            customSave?: (gridState: Object) => void;

            /** @docid dxPivotGridOptions_stateStoring_enabled */
            enabled?: boolean;

            /** @docid dxPivotGridOptions_stateStoring_savingTimeout */
            savingTimeout?: number;

            /** @docid dxPivotGridOptions_stateStoring_storageKey */
            storageKey?: string;

            /** @docid dxPivotGridOptions_stateStoring_type */
            type?: string;
        };
    }


    /** @docid dxPivotGrid */
    export class dxPivotGrid extends Widget {
        constructor(element: JQuery, options?: dxPivotGridOptions);
        constructor(element: Element, options?: dxPivotGridOptions);

        /** @docid dxPivotGridMethods_getDataSource */
        getDataSource(): DevExpress.data.PivotGridDataSource;

        /** @docid dxPivotGridMethods_getFieldChooserPopup */
        getFieldChooserPopup(): DevExpress.ui.dxPopup;

        /** @docid dxPivotGridMethods_updateDimensions */
        updateDimensions(): void;

        /** @docid dxPivotGridMethods_exportToExcel */
        exportToExcel(): void;

        /** @docid dxPivotGridMethods_bindChart */
        bindChart(chart: any, integrationOptions?: {
            inverted?: boolean;
            dataFieldsDisplayMode?: string;
            putDataFieldsInto?: string;
            alternateDataFields?: boolean;
            processCell?: Function;
            customizeChart?: Function;
            customizeSeries?: Function;
        }): any;
    }

    export interface dxPivotGridFieldChooserOptions extends WidgetOptions {

        /** @docid dxPivotGridFieldChooserOptions_height*/
        height?: any;

        /** @docid dxPivotGridFieldChooserOptions_layout */
        layout?: number;

        /** @docid dxPivotGridFieldChooserOptions_dataSource */
        dataSource?: DevExpress.data.PivotGridDataSource;

        /** @docid dxPivotGridFieldChooserOptions_onContentReady */
        onContentReady?: Function;

        /** @docid dxPivotGridFieldChooserOptions_onContextMenuPreparing */
        onContextMenuPreparing?: (e: Object) => void;

        /** @docid dxPivotGridFieldChooserOptions_texts */
        texts?: {
            /** @docid dxPivotGridFieldChooserOptions_texts_rowFields */
            rowFields?: string;
            /** @docid dxPivotGridFieldChooserOptions_texts_columnFields */
            columnFields?: string;
            /** @docid dxPivotGridFieldChooserOptions_texts_dataFields */
            dataFields?: string;
            /** @docid dxPivotGridFieldChooserOptions_texts_filterFields */
            filterFields?: string;
            /** @docid dxPivotGridFieldChooserOptions_texts_allFields */
            allFields?: string;
        };
    }

    /** @docid dxPivotGridFieldChooser */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions);
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions);

        /** @docid dxPivotGridFieldChooserMethods_updateDimensions */
        updateDimensions(): void;

        /** @docid dxPivotGridFieldChooserMethods_getDataSource */
        getDataSource(): DevExpress.data.PivotGridDataSource;
    }

}
