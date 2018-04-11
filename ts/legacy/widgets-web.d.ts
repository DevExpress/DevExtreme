/// <reference path="core.d.ts" />
declare module DevExpress.data {
    export interface XmlaStoreOptions {
        /** The HTTP address to an XMLA OLAP server. */
        url?: string;
        /** The name of the database associated with the Store. */
        catalog?: string;
        /** The cube name. */
        cube?: string;
        /** A function used to customize a web request before it is sent. */
        beforeSend?: (request: Object) => void;
    }

    /** A Store that provides access to an OLAP cube using the XMLA standard. */
    export class XmlaStore {
        constructor(options: XmlaStoreOptions);
    }

    export interface PivotGridField {
        
        index?: number;

        /** A boolean value specifying whether or not the field is visible in the pivot grid and the Field Chooser. */
        visible?: boolean;

        /** Name of the data source field containing data for the pivot grid field. */
        dataField?: string;

        /** A caption that will be displayed in the pivot grid's field chooser and field panel to identify the field. */
        caption?: string;

        /** Specifies a type of field values. */
        dataType?: string;

        /** Specifies how the values of the current field are combined into groups. Cannot be used for the XmlaStore store type. */
        groupInterval?: any;

        /** Specifies how to aggregate field data. Cannot be used for the XmlaStore store type. */
        summaryType?: string;

        /** Allows you to use a custom aggregate function to calculate the summary values. Cannot be used for the XmlaStore store type. */
        calculateCustomSummary?: (options: {
            summaryProcess?: string;
            value?: any;
            totalValue?: any;
        }) => void;

        /** Specifies the function that determines how to split data from the data source into ranges for header items. Cannot be used for the XmlaStore store type and along with remote operations. */
        selector?: (data: Object) => any;

        /** Type of the area where the field is located. */
        area?: string;

        /** Index among the other fields displayed within the same area. */
        areaIndex?: number;

        /** The name of the folder in which the field is located. */
        displayFolder?: string;

        /** The name of the group to which the field belongs. */
        groupName?: string;

        /** The index of the field within a group. */
        groupIndex?: number;

        /** Specifies the sort order of field values. */
        sortOrder?: string;

        /** Specifies how field data should be sorted. Can be used for the XmlaStore store type only. */
        sortBy?: string;

        /** Sorts the header items of this field by the summary values of another field. */
        sortBySummaryField?: string;

        /** The array of field names that specify a path to column/row whose summary field is used for sorting of this field's header items. */
        sortBySummaryPath?: Array<any>;

        /** Specifies by which values the field is filtered. */
        filterValues?: Array<any>;

        /** Specifies whether a user can change the current filter by including (selecting) or excluding (clearing the selection) values. Applies only if allowFiltering is true. */
        filterType?: string;

        /** Indicates whether all header items of the field's header level are expanded. */
        expanded?: boolean;

        /** Specifies whether the field should be treated as a Data Field. */
        isMeasure?: boolean;

        /** Specifies whether or not long text in header items should be wrapped. */
        wordWrapEnabled?: boolean;

        /** Specifies a display format for field values. */
        format?: any;

        /** Specifies a callback function that returns the text to be displayed in the cells of a field. */
        customizeText?: (cellInfo: { value: any; valueText: string }) => string;

        /**
         * Specifies a precision for formatted field values.
         * @deprecated Use the format.precision option instead.
         */
        precision?: number;

        /** Specifies how to sort header items. */
        sortingMethod?: (a: Object, b: Object) => number;

        /** Allows an end-user to change sorting options. */
        allowSorting?: boolean;

        /** Allows an end-user to sort columns by summary values. */
        allowSortingBySummary?: boolean;

        /** Allows a user to filter fields by selecting or deselecting values in the popup menu. */
        allowFiltering?: boolean;

        /** Allows an end-user to expand/collapse all header items within a header level. */
        allowExpandAll?: boolean;

        /** Specifies the absolute width of the field in the pivot grid. */
        width?: number;

        /** Specifies the summary post-processing algorithm. */
        summaryDisplayMode?: string;

        /** Specifies whether to summarize each next summary value with the previous one by rows or columns. */
        runningTotal?: string;

        /** Specifies whether to allow the predefined summary post-processing functions ('absoluteVariation' and 'percentVariation') and runningTotal to take values of different groups into account. */
        allowCrossGroupCalculation?: boolean;

        /** Specifies a callback function that allows you to modify summary values after they are calculated. */
        calculateSummaryValue?: (e: Object) => number;

        /** Specifies whether or not to display Total values for the field. */
        showTotals?: boolean;

        /** Specifies whether or not to display Grand Total values for the field. */
        showGrandTotals?: boolean;

        /** Specifies whether or not to display summary values. Applies only to the fields whose area is "data". Inherits the value of showTotals by default. */
        showValues?: boolean;

        /** Configures the header filter feature. */
        headerFilter?: {
            /** Specifies the height of the popup menu containing filtering values. */
            height?: number;

            /** Specifies the width of the popup menu containing filtering values. */
            width?: number;

            /** Specifies whether searching is enabled in the header filter. */
            allowSearch?: boolean;
        };
    }

    export class SummaryCell {
        /** Gets the parent cell in a specified direction. */
        parent(direction: string): SummaryCell;

        /** Gets all child cells in a specified direction. */
        children(direction: string): Array<SummaryCell>;

        /** Gets a partial Grand Total cell of a row or column. */
        grandTotal(direction: string): SummaryCell;
        /** Gets the Grand Total of the entire pivot grid. */
        grandTotal(): SummaryCell;

        /** Gets the cell next to the current one in a specified direction. */
        next(direction: string): SummaryCell;
        /** Gets the cell next to current in a specified direction. */
        next(direction: string, allowCrossGroup: boolean): SummaryCell;

        /** Gets the cell prior to the current one in a specified direction. */
        prev(direction: string): SummaryCell;
        /** Gets the cell previous to current in a specified direction. */
        prev(direction: string, allowCrossGroup: boolean): SummaryCell;

        /** Gets the child cell in a specified direction. */
        child(direction: string, fieldValue: any): SummaryCell;

        /** Gets the cell located by the path of the source cell with one field value changed. */
        slice(field: PivotGridField, value: any): SummaryCell;

        /** Gets the row or column field to which the current cell belongs. */
        field(area: string): PivotGridField;

        /** Gets the value of the current cell. */
        value(): any;
        /** Gets the value of the current cell. */
        value(isCalculatedValue: boolean): any;
        /** Gets the value of any field linked with the current cell. */
        value(field: PivotGridField): any;
        /** Gets the value of any field linked with the current cell. */
        value(field: PivotGridField, isCalculatedValue: boolean): any;
    }

    export interface PivotGridDataSourceOptions {
        

        /** Specifies the underlying Store instance used to access data. */
        store?: any;

        /** Indicates whether or not the automatic field generation from data in the Store is enabled. */
        retrieveFields?: boolean;

        /** Specifies data filtering conditions. Cannot be used for the XmlaStore store type. */
        filter?: Object;

        /** An array of pivot grid fields. */
        fields?: Array<PivotGridField>;

        /** Specifies whether or not all the operations (filtering, grouping and summary calculation) are performed remotely. */
        remoteOperations?: boolean;

        /** A handler for the changed event. */
        onChanged?: () => void;

        /** A handler for the loadingChanged event. */
        onLoadingChanged?: (isLoading: boolean) => void;

        /** A handler for the loadError event. */
        onLoadError?: (e?: Object) => void;

        /** A handler for the fieldsPrepared event. */
        onFieldsPrepared?: (e?: Array<PivotGridField>) => void;
    }

    /** An object that provides access to data for the PivotGrid widget. */
    export class PivotGridDataSource implements EventsMixin<PivotGridDataSource> {
        constructor(options?: PivotGridDataSourceOptions);
        /** Starts reloading data from any store and updating the data source. */
        reload(): JQueryPromise<any>;

        /** Starts updating the data source. Reloads data from the XMLA store only. */
        load(): JQueryPromise<any>;

        /** Indicates whether or not the PivotGridDataSource is currently being loaded. */
        isLoading(): boolean;

        /** Gets data displayed in a PivotGrid. */
        getData(): Object;

        /** Gets all fields within a specified area. */
        getAreaFields(area: string, collectGroups: boolean): Array<PivotGridField>;

        /** Gets all fields from the data source. */
        fields(): Array<PivotGridField>;
        /** Sets the fields option. */
        fields(fields: Array<PivotGridField>): void;

        /** Gets current options of a specified field. */
        field(id: any): PivotGridField;
        /** Sets one or more options of a specified field. */
        field(id: any, field: PivotGridField): void;

        /** Collapses a specified header item. */
        collapseHeaderItem(area: string, path: Array<any>): void;

        /** Expands a specified header item. */
        expandHeaderItem(area: string, path: Array<any>): void;

        /** Expands all header items of a field. */
        expandAll(id: any): void;

        /** Collapses all header items of a field. */
        collapseAll(id: any): void;

        /** Disposes of all resources associated with this PivotGridDataSource. */
        dispose(): void;

        /** Gets the current filter expression. Cannot be used for the XmlaStore store type. */
        filter(): Object;

        /** Applies a new filter expression. Cannot be used for the XmlaStore store type. */
        filter(filterExpr: Object): void;

        /** Provides access to a list of records (facts) that were used to calculate a specific summary. */
        createDrillDownDataSource(options: {
            columnPath?: Array<any>;
            rowPath?: Array<any>;
            dataIndex?: number;
            maxRowCount?: number;
            customColumns?: Array<string>;
        }): DevExpress.data.DataSource;

        /** Gets the current PivotGridDataSource state (fields configuration, sorting, filters, expanded headers, etc.) */
        state(): Object;

        /** Sets the PivotGridDataSource state. */
        state(state: Object): void;

        on(eventName: string, eventHandler: Function): PivotGridDataSource;
        on(events: { [eventName: string]: Function; }): PivotGridDataSource;
        off(eventName: string): PivotGridDataSource;
        off(eventName: string, eventHandler: Function): PivotGridDataSource;
    }
}

declare module DevExpress.ui {
    export interface dxSchedulerViewOptions {
        /** The name of the view. */
        type?: string;

        /** A custom name for the view. This name goes to the view switcher. */
        name?: string;

        /** Specifies the limit of full-sized appointments displayed per cell. In the "day", "week" and "workweek" views, this option applies only to all-day appointments. */
        maxAppointmentsPerCell?: any;

        /** Multiplies the default view interval. Applies to all view types except "agenda". */
        intervalCount?: number;

        /** Specifies the date from which to start counting the view interval. Applies to all view types except "agenda". */
        startDate?: any;

        /** The first day of a week. */
        firstDayOfWeek?: number;

        /** The resource kinds by which appointments are grouped. */
        groups?: Array<string>;

        /** The start hour of the view time scale. */
        startDayHour?: number;

        /** The end hour of the view time scale. */
        endDayHour?: number;

        /** The cell duration in minutes. */
        cellDuration?: number;

        /** Specifies the number of dates that can be shown at a time in the agenda view. */
        agendaDuration?: number;

        /** Specifies a custom template for an appointment. */
        appointmentTemplate?: any;

        /** The template to be used for rendering appointments in the appointment collector's drop-down list. */
        dropDownAppointmentTemplate?: any;

        /** The template to be used for rendering an appointment tooltip. */
        appointmentTooltipTemplate?: any;

        /** The template to be used for rendering table cells. */
        dataCellTemplate?: any;

        /** The template to be used for rendering time scale items. */
        timeCellTemplate?: any;

        /** The template to be used for rendering date scale items. */
        dateCellTemplate?: any;

        /** The template to be used for rendering resource headers. */
        resourceCellTemplate?: any;
    }

    export interface dxSchedulerOptions extends WidgetOptions {

        /** Specifies the date-time values' serialization format. Use it only if you do not specify the dataSource at design time. */
        dateSerializationFormat?: string;
        /** Specifies a date displayed on the current scheduler view by default. */
        currentDate?: any;
        /** The earliest date the widget allows you to select. */
        min?: any;
        /** The latest date the widget allows you to select. */
        max?: any;
        /** Specifies the currently displayed view. Accepts the view's name or type. */
        currentView?: string;
        /** Specifies the origin of data for the widget. */
        dataSource?: any;
        /** Specifies the first day of a week. */
        firstDayOfWeek?: number;
        /** The template to be used for rendering appointments. */
        appointmentTemplate?: any;
        /** The template to be used for rendering appointments in the appointment collector's drop-down list. */
        dropDownAppointmentTemplate?: any;
        /** The template to be used for rendering an appointment tooltip. */
        appointmentTooltipTemplate?: any;
        /** The template to be used for rendering table cells. */
        dataCellTemplate?: any;
        /** The template to be used for rendering time scale items. */
        timeCellTemplate?: any;
        /** The template used for rendering day scale items. */
        dateCellTemplate?: any;
        /** The template to be used for rendering resource headers. */
        resourceCellTemplate?: any;
        /** Configures individual views. */
        views?: Array<any>;
        /** Specifies the resource kinds by which the scheduler's appointments are grouped in a timetable. */
        groups?: Array<string>;
        /** Specifies a start hour in the scheduler view's time interval. */
        startDayHour?: number;
        /** Specifies an end hour in the scheduler view's time interval. */
        endDayHour?: number;
        /** Specifies the "All-day" panel's visibility. Setting this option to false hides the panel along with the all-day appointments. */
        showAllDayPanel?: boolean;
        /** Specifies cell duration in minutes. */
        cellDuration?: number;
        /** Specifies the limit of full-sized appointments displayed per cell. In the "day", "week" and "workweek" views, this option applies only to all-day appointments. */
        maxAppointmentsPerCell?: any;
        /** Specifies the edit mode for recurring appointments. */
        recurrenceEditMode?: string;
        /** Specifies which editing operations an end-user can perform on appointments. */
        editing?: {
            /** Specifies whether or not an end-user can add appointments. */
            allowAdding?: boolean;
            /** Specifies whether or not an end-user can change appointment options. */
            allowUpdating?: boolean;
            /** Specifies whether or not an end-user can delete appointments. */
            allowDeleting?: boolean;
            /** Specifies whether or not an end-user can change an appointment duration. */
            allowResizing?: boolean;
            /** Specifies whether or not an end-user can drag appointments. */
            allowDragging?: boolean;
        }
        /** Specifies an array of resources available in the scheduler. */
        resources?: Array<{
            /** Indicates whether or not several resources of this kind can be assigned to an appointment. */
            allowMultiple?: boolean;
            /**
          * Indicates whether or not resources of this kind have priority in the color identification of the appointments that have resources of different kinds assigned.
          * @deprecated Use the useColorAsDefault option instead.
          */
            mainColor?: boolean;
            /** Specifies whether appointments are colored like this resource kind. */
            useColorAsDefault?: boolean;
            /** A data source used to fetch resources to be available in the scheduler. */
            dataSource?: any;
            /** Specifies the resource object field whose value is displayed by the Resource editor in the Appointment popup window. */
            displayExpr?: any;
            /** Specifies the resource object field that is used as a value of the Resource editor in the Appointment popup window. */
            valueExpr?: any;
            /**
         * The name of the appointment object field that specifies a resource of this kind.
         * @deprecated Use the fieldExpr option instead.
         */
            field?: string;
            /** The name of the appointment object field that specifies a resource of this kind. */
            fieldExpr?: string;
            /** Specifies the resource object field that is used as a resource color. */
            colorExpr?: string;
            /** Specifies the label of the Appointment popup window field that allows end users to assign a resource of this kind. */
            label?: string;
        }>;
        /** A handler for the AppointmentAdding event. */
        onAppointmentAdding?: Function;
        /** A handler for the appointmentAdded event. */
        onAppointmentAdded?: Function;
        /** A handler for the AppointmentUpdating event. */
        onAppointmentUpdating?: Function;
        /** A handler for the appointmentUpdated event. */
        onAppointmentUpdated?: Function;
        /** A handler for the AppointmentDeleting event. */
        onAppointmentDeleting?: Function;
        /** A handler for the appointmentDeleted event. */
        onAppointmentDeleted?: Function;
        /** A handler for the appointmentRendered event. */
        onAppointmentRendered?: Function;
        /** A handler for the appointmentClick event. */
        onAppointmentClick?: any;
        /** A handler for the appointmentDblClick event. */
        onAppointmentDblClick?: any;
        /** A handler for the cellClick event. */
        onCellClick?: any;
        /** A handler for the appointmentFormCreated event. */
        onAppointmentFormCreated?: Function;
        /** A handler for the contentReady event. */
        onContentReady?: Function;
        
        horizontalScrollingEnabled?: boolean;
        /** Specifies whether or not an end-user can scroll the view in both directions at the same time. */
        crossScrollingEnabled?: boolean;
        /** Specifies whether a user can switch views using tabs or a drop-down menu. */
        useDropDownViewSwitcher?: boolean;
        /** Specifies the name of the data source item field that defines the start of an appointment. */
        startDateExpr?: string;
        /** Specifies the name of the data source item field that defines the ending of an appointment. */
        endDateExpr?: string;
        /** Specifies the name of the data source item field that holds the subject of an appointment. */
        textExpr?: string;
        /** Specifies the name of the data source item field whose value holds the description of the corresponding appointment. */
        descriptionExpr?: string;
        /** Specifies the name of the data source item field whose value defines whether or not the corresponding appointment is an all-day appointment. */
        allDayExpr?: string;
        /** Specifies the name of the data source item field that defines a recurrence rule for generating recurring appointments. */
        recurrenceRuleExpr?: string;
        /** Specifies the name of the data source item field that defines exceptions for the current recurring appointment. */
        recurrenceExceptionExpr?: string;
        /** Specifies the name of the data source item field that defines the timezone of the appointment start date. */
        startDateTimeZoneExpr?: string;
        /** Specifies the name of the data source item field that defines the timezone of the appointment end date. */
        endDateTimeZoneExpr?: string;
        /** Specifies whether filtering is performed on the server or client side. */
        remoteFiltering?: boolean;
        /** Specifies the timezone of the widget. */
        timeZone?: string;
        /** The text or HTML markup displayed by the widget if the item collection is empty. Available for the Agenda view only. */
        noDataText?: string;
        /** Specifies the current date-time indicator's visibility. */
        showCurrentTimeIndicator?: boolean;
        /** Specifies whether to apply shading to cover the timetable up to the current time. */
        shadeUntilCurrentTime?: boolean;
        
        indicatorUpdateInterval?: number;
    }

    /** The Scheduler is a widget that represents scheduled data and allows a user to manage and edit it. */
    export class dxScheduler extends Widget
    implements DataHelperMixin
    {
        

        constructor(element: JQuery, options?: dxSchedulerOptions);
        constructor(element: Element, options?: dxSchedulerOptions);

        /** Add the appointment defined by the object passed as a parameter to the data associated with the widget. */
        addAppointment(appointment: Object): void;

        /** Updates the appointment specified by the first method parameter by the appointment object specified by the second method parameter in the data associated with the widget. */
        updateAppointment(target: Object, appointment: Object): void;

        /** Deletes the appointment defined by the parameter from the data associated with the widget. */
        deleteAppointment(appointment: Object): void;

        /** Scrolls the scheduler work space to the specified time of the specified day. */
        scrollToTime(hours: number, minutes: number, date: Date): void;

        /** Displays the Appointment Details popup. */
        showAppointmentPopup(appointmentData: Object, createNewAppointment?: boolean, currentAppointmentData?: Object): void;

        /** Hides an appointment details popup. */
        hideAppointmentPopup(saveChanges?: boolean): void;

        /** Displays the appointment tooltip for the specified target element. */
        showAppointmentTooltip(appointmentData: Object, target?: JQuery, currentAppointmentData?: Object): void;
        showAppointmentTooltip(appointmentData: Object, target?: Element, currentAppointmentData?: Object): void;
        showAppointmentTooltip(appointmentData: Object, target?: string, currentAppointmentData?: Object): void;

        /** Hides an appointment tooltip. */
        hideAppointmentTooltip(): void;

        /** Returns the start date of the current view. */
        getStartViewDate(): Date;

        /** Returns the end date of the current view. */
        getEndViewDate(): Date;

        getDataSource(): DevExpress.data.DataSource;
    }

    export interface dxColorBoxOptions extends dxDropDownEditorOptions {

        /** Specifies the text displayed on the button that applies changes and closes the drop-down editor. */
        applyButtonText?: string;

        
        applyValueMode?: string;

        /** Specifies the text displayed on the button that cancels changes and closes the drop-down editor. */
        cancelButtonText?: string;

        /** Specifies whether or not the widget value includes the alpha channel component. */
        editAlphaChannel?: boolean;

        /** Specifies the size of a step by which a handle is moved using a keyboard shortcut. */
        keyStep?: number;

        /** The template to be used for rendering the widget input field. */
        fieldTemplate?: any;
    }

    /** The ColorBox is a widget that allows an end user to enter a color or pick it out from the drop-down editor. */
    export class dxColorBox extends dxDropDownEditor {
        constructor(element: JQuery, options?: dxColorBoxOptions);
        constructor(element: Element, options?: dxColorBoxOptions);
    }

    export interface HierarchicalCollectionWidgetOptions extends CollectionWidgetOptions {
        /** Specifies the name of the data source item field whose value is displayed by the widget. */
        displayExpr?: any;

        /** Specifies which data field provides keys for TreeView items. */
        keyExpr?: any;

        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget items is selected. */
        selectedExpr?: any;

        /** Specifies the name of the data source item field that contains an array of nested items. */
        itemsExpr?: any;

        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget item is disabled. */
        disabledExpr?: any;

        
        hoverStateEnabled?: boolean;

        
        focusStateEnabled?: boolean;
    }

    
    export class HierarchicalCollectionWidget extends CollectionWidget {
    }

    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions, SearchBoxMixinOptions {

        /** Specifies whether or not to animate item collapsing and expanding. */
        animationEnabled?: boolean;

        /** Specifies whether a nested or plain array is used as a data source. */
        dataStructure?: string;

        /** Specifies whether or not a user can expand all tree view items by the "*" hot key. */
        expandAllEnabled?: boolean;

        /**
        * Specifies whether or not a check box is displayed at each tree view item.
        * @deprecated Use the showCheckBoxesMode options instead.
        */
        showCheckBoxes?: boolean;

        /** Specifies the current check boxes display mode. */
        showCheckBoxesMode?: string;

        /** Specifies the name of the data source item field whose value defines whether or not the corresponding widget item is displayed expanded. */
        expandedExpr?: any;

        /** Specifies whether or not to select nodes recursively. */
        selectNodesRecursive?: boolean;

        /** Specifies whether or not all parent nodes of an initially expanded node are displayed expanded. */
        expandNodesRecursive?: boolean;

        /**
       * Specifies whether the "Select All" check box is displayed over the tree view.
       * @deprecated Use the showCheckBoxesMode options instead.
       */
        selectAllEnabled?: boolean;

        /** Specifies whether or not an item becomes selected if a user clicks it. */
        selectByClick?: boolean;

        /** Specifies item selection mode. */
        selectionMode?: string;

        /** Specifies the text displayed at the "Select All" check box. */
        selectAllText?: string;

        /** Specifies the name of the data source item field whose value defines whether or not the corresponding node includes child nodes. */
        hasItemsExpr?: any;

        /** Specifies the name of the data source item field for holding the parent key of the corresponding node. */
        parentIdExpr?: any;

        /** Specifies if the virtual mode is enabled. */
        virtualModeEnabled?: boolean;

        /** Specifies the parent ID value of the root item. */
        rootValue?: Object;

        /** A string value specifying available scrolling directions. */
        scrollDirection?: string;

        

        /** A handler for the itemSelectionChanged event. */
        onItemSelectionChanged?: Function;

        /** A handler for the itemExpanded event. */
        onItemExpanded?: Function;

        /** A handler for the itemCollapsed event. */
        onItemCollapsed?: Function;

        
        onItemClick?: Function;

        
        onItemContextMenu?: Function;

        
        onItemRendered?: Function;

        
        onItemHold?: Function;

        /** Allows you to load nodes manually. */
        createChildren?: Function;
    }

    export interface dxTreeViewNode {

        children: Array<dxTreeViewNode>;

        disabled: boolean;

        expanded: boolean;

        itemData: Object;

        key: any;

        parent: dxTreeViewNode;

        selected: boolean;

        text: string;
    }

    /** The TreeView widget is a tree-like representation of textual data. */
    export class dxTreeView extends HierarchicalCollectionWidget {

        constructor(element: JQuery, options?: dxTreeViewOptions);
        constructor(element: Element, options?: dxTreeViewOptions);

        /** Updates the tree view scrollbars according to the current size of the widget content. */
        updateDimensions(): JQueryPromise<void>;

        /** Selects an item found using an HTML element. */
        selectItem(itemElement: Node): void;

        /** Selects an item found using a data object. */
        selectItem(itemData: Object): void;

        /** Selects an item found using a key. */
        selectItem(key: any): void;

        /** Clears the selection of an item found using an HTML element. */
        unselectItem(itemElement: Node): void;

        /** Clears the selection of an item found using a data object. */
        unselectItem(itemData: Object): void;

        /** Clears the selection of an item found using a key. */
        unselectItem(key: any): void;

        /** Expands an item found using an HTML element. */
        expandItem(itemElement: Node): void;

        /** Expands an item found using a data object. */
        expandItem(itemData: Object): void;

        /** Expands an item found using a key. */
        expandItem(key: any): void;

        /** Collapses an item found using an HTML element. */
        collapseItem(itemElement: Node): void;

        /** Collapses an item found using a key. */
        collapseItem(itemData: Object): void;

        /** Collapses an item found using a key. */
        collapseItem(key: any): void;

        /** Returns all nodes of the tree view. */
        getNodes(): Array<Object>;

        /** Selects all widget items. */
        selectAll(): void;

        /** Unselects all widget items. */
        unselectAll(): void;
    }

    export interface dxMenuBaseOptions extends HierarchicalCollectionWidgetOptions {
        
        /** Configures widget visibility animations. This object contains two fields: show and hide. */
        animation?: {
            /** An object that defines the animation options used when the widget is being shown. */
            show?: fx.AnimationOptions;

            /** An object that defines the animation options used when the widget is being hidden. */
            hide?: fx.AnimationOptions;
        };

        /** A Boolean value specifying whether or not the widget changes its state when interacting with a user. */
        activeStateEnabled?: boolean;

        /** Specifies the name of the CSS class to be applied to the root menu level and all submenus. */
        cssClass?: string;

        /** Holds an array of menu items. */
        items?: Array<any>;

        /**
      * Specifies whether or not an item becomes selected if an end-user clicks it.
      * @deprecated Use the selectByClick option instead.
      */
        selectionByClick?: boolean;

        /** Specifies whether or not an item becomes selected if a user clicks it. */
        selectByClick?: boolean;

        /** Specifies the selection mode supported by the menu. */
        selectionMode?: string;

        /** Specifies options of submenu showing and hiding. */
        showSubmenuMode?: {
            /** Specifies the mode name. */
            name?: string;

            /** Specifies the delay of submenu show and hiding. */
            delay?: {
                /** The time span after which the submenu is shown. */
                show?: number;

                /** The time span after which the submenu is hidden. */
                hide?: number;
            };
        };
    }
    
    export class dxMenuBase extends HierarchicalCollectionWidget {
        constructor(element: JQuery, options?: dxMenuBaseOptions);
        constructor(element: Element, options?: dxMenuBaseOptions);

        /** Selects the specified item. */
        selectItem(itemElement: any): void;

        /** Cancels the selection of the specified item. */
        unselectItem(itemElement: any): void;
    }

    export interface dxMenuOptions extends dxMenuBaseOptions {
        
        /** Specifies whether or not the submenu is hidden when the mouse pointer leaves it. */
        hideSubmenuOnMouseLeave?: boolean;

        /** Specifies whether the menu has horizontal or vertical orientation. */
        orientation?: string;

        /** Specifies options for showing and hiding the first level submenu. */
        showFirstSubmenuMode?: {
            /** Specifies the mode name. */
            name?: string;

            /** Specifies the delay in submenu showing and hiding. */
            delay?: {
                /** The time span after which the submenu is shown. */
                show?: number;

                /** The time span after which the submenu is hidden. */
                hide?: number;
            };
        };

        /** Specifies the direction at which the submenus are displayed. */
        submenuDirection?: string;

        /** A handler for the submenuHidden event. */
        onSubmenuHidden?: Function;

        /** Specifies whether adaptive widget rendering is enabled on small screens. Applies only if the orientation is "horizontal". */
        adaptivityEnabled?: boolean;

        /** A handler for the submenuHiding event. */
        onSubmenuHiding?: Function;

        /** A handler for the submenuShowing event. */
        onSubmenuShowing?: Function;

        /** A handler for the submenuShown event. */
        onSubmenuShown?: Function;
    }

    /** The Menu widget is a panel with clickable items. A click on an item opens a drop-down menu, which can contain several submenus. */
    export class dxMenu extends dxMenuBase {
        constructor(element: JQuery, options?: dxMenuOptions);
        constructor(element: Element, options?: dxMenuOptions); 
    }

    export interface dxContextMenuOptions extends dxMenuBaseOptions {

        /** Specifies options for displaying the widget. */
        showEvent?: {
            /** Specifies the event names on which the widget is shown. */
            name?: String;

            /** The time span after which the widget is shown. */
            delay?: Number;
        };

        /** A Boolean value specifying whether or not the widget is closed if a user clicks outside of the context menu. */
        closeOnOutsideClick?: any;

        /** A handler for the hidden event. */
        onHidden?: Function;

        /** A handler for the hiding event. */
        onHiding?: Function;

        /** A handler for the positioning event. */
        onPositioning?: Function;

        /** A handler for the showing event. */
        onShowing?: Function;

        /** A handler for the shown event. */
        onShown?: Function;

        /** An object defining widget positioning options. */
        position?: PositionOptions;

        /** Specifies the direction at which submenus are displayed. */
        submenuDirection?: string;

        /** The target element associated with the context menu. */
        target?: any;

        /** A Boolean value specifying whether or not the widget is visible. */
        visible?: boolean;
    }

    /** The ContextMenu widget displays a single- or multi-level context menu. An end user invokes this menu by a right click or a long press. */
    export class dxContextMenu extends dxMenuBase {
        constructor(element: JQuery, options?: dxContextMenuOptions);
        constructor(element: Element, options?: dxContextMenuOptions);

        /** Toggles the visibility of the widget. */
        toggle(showing: boolean): JQueryPromise<void>;

        /** Shows the widget. */
        show(): JQueryPromise<void>;

        /** Hides the widget. */
        hide(): JQueryPromise<void>;

    }

    export interface dxDataGridRemoteOperations {
        /** Specifies whether or not filtering must be performed on the server side. */
        filtering?: boolean;

        /** Specifies whether or not paging must be performed on the server side. */
        paging?: boolean;

        /** Specifies whether or not sorting must be performed on the server side. */
        sorting?: boolean;

        /** Specifies whether or not grouping must be performed on the server side. */
        grouping?: boolean;

        /** Specifies whether or not paging by groups must be performed on the server side. */
        groupPaging?: boolean;

        /** Specifies whether or not summaries calculation must be performed on the server. */
        summary?: boolean;
    }

    export interface dxTreeListRemoteOperations {
        /** Specifies whether filtering should be performed on the server. */
        filtering?: boolean;

        /** Specifies whether sorting should be performed on the server. */
        sorting?: boolean;

        /** Specifies whether grouping should be performed on the server. */
        grouping?: boolean;
    }

    export interface dxDataGridRow {

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
        
        node: dxTreeListNode;

        
        level: number;

        
        key: any;

        
        rowIndex: number;

        
        rowType: string;

        
        isExpanded: boolean;

        
        isSelected: boolean;

        
        isEditing: boolean;

        
        values: Array<any>;
    }

    export interface dxTreeListNode {
        
        data: Object;

        
        key: any;

        
        parent?: dxTreeListNode;

        
        hasChildren: boolean;

        
        children: Array<dxTreeListNode>;

        
        visible: boolean;

        
        level: number;
    }

    export interface GridBaseColumn {
        /** Aligns the content of the column. */
        alignment?: string;

        /** Specifies whether a user can edit values in the column at runtime. By default, inherits the value of the editing.allowUpdating option. */
        allowEditing?: boolean;

        /** Specifies whether a user can fix the column at runtime. Applies only if columnFixing.enabled is true. */
        allowFixing?: boolean;

        /** Specifies whether a user can hide the column using the column chooser at runtime. Applies only if columnChooser.enabled is true. */
        allowHiding?: boolean;

        /** Specifies whether this column can be used in column reordering at runtime. Applies only if allowColumnReordering is true. */
        allowReordering?: boolean;

        /** Specifies whether a user can resize the column at runtime. Applies only if allowColumnResizing is true. */
        allowResizing?: boolean;

        /** Specifies whether a user can sort rows by this column at runtime. Applies only if sorting.mode differs from "none". */
        allowSorting?: boolean;

        /** Specifies whether this column can be searched. Applies only if searchPanel.visible is true. Inherits the value of the allowFiltering option by default. */
        allowSearch?: boolean;

        /** Calculates custom values for column cells. */
        calculateCellValue?: (rowData: Object) => any;

        /** Specifies a function to be invoked after the user has edited a cell value, but before it will be saved in the data source. */
        setCellValue?: (newData: Object, value: any, currentRowData: Object) => void;

        /** Specifies a caption for the column. */
        caption?: string;

        /** Specifies a custom template for column cells. */
        cellTemplate?: any;

        /** Specifies a CSS class to be applied to the column. */
        cssClass?: string;

        /** Calculates custom display values for column cells. Used when display values should differ from values for editing. */
        calculateDisplayValue?: any;

        /** Calculates custom values to be used in sorting. */
        calculateSortValue?: any;

        /** Specifies a custom comparison function for sorting. Applies only when sorting is performed on the client. */
        sortingMethod?: (value1: any, value2: any) => number;

        /** Customizes the text displayed in column cells. */
        customizeText?: (cellInfo: { value: any; valueText: string; target: string; groupInterval: any }) => string;

        /** Binds the column to a field of the dataSource. */
        dataField?: string;

        /** Casts column values to a specific data type. */
        dataType?: string;

        /** Specifies a custom template for column cells in the editing state. */
        editCellTemplate?: any;

        /** Specifies options for the underlain editor. */
        editorOptions?: Object;

        /** Specifies whether HTML tags are displayed as plain text or applied to the values of the column. */
        encodeHtml?: boolean;

        /** In a boolean column, replaces all false items with a specified text. Applies only if showEditorAlways option is false. */
        falseText?: string;

        /** Fixes the column. */
        fixed?: boolean;

        /** Specifies the order in which columns are hidden when the widget adapts to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is "widget". */
        hidingPriority?: number;

        /** Specifies the widget's edge to which the column is fixed. Applies only if columns].[fixed is true. */
        fixedPosition?: string;

        /** Specifies a format for the values displayed in the column. */
        format?: any;

        /** Specifies a custom template for the column header. */
        headerCellTemplate?: any;

        /** Specifies options of a lookup column. */
        lookup?: {
            /** Specifies whether a user can nullify values of the lookup column. */
            allowClearing?: boolean;

            /** Specifies the data source for the lookup column. */
            dataSource?: any;

            /** Specifies the data source field whose values must be displayed. */
            displayExpr?: any;

            /** Specifies the data source field whose values must be replaced. */
            valueExpr?: string;
        };

        /** Specifies whether the column displays its values using editors. */
        showEditorAlways?: boolean;

        /** Specifies the index according to which columns participate in sorting. */
        sortIndex?: number;

        /** Specifies the sort order of column values. */
        sortOrder?: string;

        /** In a boolean column, replaces all true items with a specified text. Applies only if showEditorAlways option is false. */
        trueText?: string;

        /** Specifies whether the column is visible or not. */
        visible?: boolean;

        /** Specifies the position of the column regarding other columns in the resulting widget. */
        visibleIndex?: number;

        /** Specifies the column's width in pixels or percentages. Ignored if less than minWidth. */
        width?: any;

        /** Specifies the minimum width of the column. */
        minWidth?: number;

        /** Specifies validation rules to be checked on updating cell values. */
        validationRules?: Array<Object>;

        /** Specifies whether the column chooser can contain the column header. */
        showInColumnChooser?: boolean;

        /** Specifies the identifier of the column. */
        name?: string;

        /** Configures the form item produced by this column in the editing state. Used only if editing.mode is "form" or "popup". */
        formItem?: DevExpress.ui.dxFormItem;

        /** Specifies the band column that owns the current column. Accepts the index of the band column in the columns array. */
        ownerBand?: number;

        /** Specifies whether the column bands other columns or not. */
        isBand?: boolean;

        /** Specifies whether data can be filtered by this column. Applies only if filterRow.visible is true. */
        allowFiltering?: boolean;

        /** Specifies whether the header filter can be used to filter data by this column. Applies only if headerFilter.visible is true. By default, inherits the value of the allowFiltering option. */
        allowHeaderFiltering?: boolean;

        /** Specifies a set of available filter operations. Applies only if filterRow.visible and allowFiltering are true. */
        filterOperations?: Array<any>;

        /** Specifies a filter value for the column. */
        filterValue?: any;

        /** Specifies the selected filter operation for the column. */
        selectedFilterOperation?: string;

        /** Specifies filter values for the column's header filter. */
        filterValues?: Array<any>;

        /** Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values. Applies only if headerFilter.visible and allowHeaderFiltering are true. */
        filterType?: string;

        /** Specifies the column's custom filtering rules. */
        calculateFilterExpression?: (filterValue: any, selectedFilterOperation: string, target: string) => any;

        /** Specifies data settings for the header filter. */
        headerFilter?: {
            /** Specifies a data source for the header filter. */
            dataSource?: any;

            /** Specifies how the header filter combines values into groups. */
            groupInterval?: any;

            /** Specifies whether searching is enabled in the header filter. */
            allowSearch?: boolean;

            /** Specifies the height of the popup menu containing filtering values. */
            height?: number;

            /** Specifies the width of the popup menu containing filtering values. */
            width?: number;
        };
    }

    export interface dxDataGridColumn extends GridBaseColumn {
    
        /** Specifies whether the user can group data by values of this column. Applies only when grouping is enabled. */
        allowGrouping?: boolean;

        /** Specifies whether groups appear expanded or not when records are grouped by a specific column. Setting this option makes sense only when grouping is allowed for this column. */
        autoExpandGroup?: boolean;

        /** Specifies whether data from this column should be exported. */
        allowExporting?: boolean;

        /** Specifies a custom template for the group cell of a grid column. */
        groupCellTemplate?: any;

        /** Specifies the index of a column when grid records are grouped by the values of this column. */
        groupIndex?: number;

        /**
         * Specifies a precision for formatted values displayed in a column.
         * @deprecated Use the format.precision option instead.
         */
        precision?: number;

        /** Specifies a field name or a function that returns a field name or a value to be used for grouping column cells. */
        calculateGroupValue?: any;

        /** Specifies whether or not to display the column when grid records are grouped by it. */
        showWhenGrouped?: boolean;

        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;
    }

    export interface dxTreeListColumn extends GridBaseColumn {
        /** Configures columns. */
        columns?: Array<dxTreeListColumn>;
    }

    export interface GridBaseScrolling {
        

        /** Specifies whether the widget should load pages adjacent to the current page. Applies only if scrolling.mode is "virtual". */
        preloadEnabled?: boolean;

        /** Specifies whether the widget should use native or simulated scrolling. */
        useNative?: any;

        /** Specifies when to show the scrollbar. Applies only if useNative is false. */
        showScrollbar?: string;

        /** Specifies whether a user can scroll the content with a swipe gesture. Applies only if useNative is false. */
        scrollByContent?: boolean;

        /** Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false. */
        scrollByThumb?: boolean;
    }

    export interface dxDataGridScrolling extends GridBaseScrolling {
        /** Specifies the scrolling mode. */
        mode?: string;
    }

    export interface dxTreeListScrolling extends GridBaseScrolling {
        /** Specifies the scrolling mode. */
        mode?: string;
    }

    export interface GridBaseEditing {
        

        /** Specifies how a user edits data. */
        mode?: string;

        /** Specifies whether a user can update rows. */
        allowUpdating?: boolean;

        /** Specifies whether a user can add new rows. */
        allowAdding?: boolean;

        /** Specifies whether a user can delete rows. */
        allowDeleting?: boolean;

        /** Configures the form. Used only if editing.mode is "form" or "popup". */
        form?: DevExpress.ui.dxFormOptions;

        /** Configures the popup. Used only if editing.mode is "popup". */
        popup?: DevExpress.ui.dxPopupOptions;
    }

    export interface dxDataGridEditing extends GridBaseEditing {
        
        editMode?: string;

        
        editEnabled?: boolean;

        
        insertEnabled?: boolean;

        
        removeEnabled?: boolean;

        /** Contains options that specify texts for editing-related UI elements. */
        texts?: dxDataGridEditingTexts;
    }

    export interface dxTreeListEditing extends GridBaseEditing {
        /** Contains options that specify texts for editing-related UI elements. */
        texts?: dxTreeListEditingTexts;
    }

    export interface GridBaseEditingTexts {
        

        /** Specifies text for a hint that appears when a user pauses on the global "Save" button. Applies only if editing.mode is "batch". */
        saveAllChanges?: string;

        /** Specifies text for a button that cancels changes in a row. Applies only if editing.allowUpdating is true and editing.mode is "row". */
        cancelRowChanges?: string;

        /** Specifies text for a hint that appears when a user pauses on the "Discard" button. Applies only if editing.mode is "batch". */
        cancelAllChanges?: string;

        /** Specifies a message that prompts a user to confirm deletion. */
        confirmDeleteMessage?: string;

        /** Specifies a title for the window that asks a user to confirm deletion. */
        confirmDeleteTitle?: string;

        /** Specifies text for a hint appearing when a user pauses on the button that cancels changes in a cell. Applies only if editing.mode is "cell" and data validation is enabled. */
        validationCancelChanges?: string;

        /** Specifies text for buttons that delete rows. Applies only if allowDeleting is true. */
        deleteRow?: string;

        /** Specifies text for a hint that appears when a user pauses on the global "Add" button. Applies only if editing.allowAdding is true. */
        addRow?: string;

        /** Specifies text for buttons that switch rows into the editing state. Applies only if allowUpdating is true. */
        editRow?: string;

        /** Specifies text for a button that saves changes made in a row. Applies only if  allowUpdating is true. */
        saveRowChanges?: string;

        /** Specifies text for buttons that recover deleted rows. Applies only if allowDeleting is true and editing.mode is "batch". */
        undeleteRow?: string;
    }

    export interface dxDataGridEditingTexts extends GridBaseEditingTexts {
    }

    export interface dxTreeListEditingTexts extends GridBaseEditingTexts {
        /** Specifies text for the button that adds a new nested row. Applies if the editing.mode is "batch" or "cell". */
        addRowToNode?: string;
    }

    export interface GridBaseSelection {
        

        /** Specifies whether a user can select all rows at once. */
        allowSelectAll?: boolean;

        /** Specifies the selection mode. */
        mode?: string;
    }

    export interface dxDataGridSelection extends GridBaseSelection {
        /** Specifies when to display check boxes in rows. Applies only if selection.mode is "multiple". */
        showCheckBoxesMode?: string;

        
         maxFilterLengthInRequest?: number;

        /** Specifies the mode in which all the records are selected. Applies only if selection.allowSelectAll is true. */
        selectAllMode?: string;

         /** Makes selection deferred. */
        deferred?: boolean;
    }

    export interface dxTreeListSelection extends GridBaseSelection {
        /** Specifies whether selection is recursive. */
        recursive?: boolean;
    }

    export interface dxDataGridOptions extends GridBaseOptions {
        

        /** Specifies which data field provides keys for data items. Applies only if data is a simple array. */
        keyExpr?: any;

        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: (e: any) => void;

        /** A handler for the cellClick event. */
        onCellClick?: any;

        /** A handler for the cellHoverChanged event. */
        onCellHoverChanged?: (e: any) => void;

        /** A handler for the cellPrepared event. */
        onCellPrepared?: (e: any) => void;

        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;

        
        onContentReady?: Function;

        /** Specifies a function that customizes grid columns after they are created. */
        customizeColumns?: (columns: Array<dxDataGridColumn>) => void;

        /** Customizes grid columns and data before exporting. */
        customizeExportData?: (columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRow>) => void;

        /** A handler for the editingStart event. */
        onEditingStart?: (e: {
            data: any;
            key: any;
            cancel: boolean;
            column: dxDataGridColumn
        }) => void;

        /** A handler for the editorPrepared event. */
        onEditorPrepared?: (e: any) => void;

        /** A handler for the editorPreparing event. */
        onEditorPreparing?: (e: any) => void;

        /** Configures editing. */
        editing?: dxDataGridEditing;

        /** Specifies grouping settings and the behavior of grouped grid records. */
        grouping?: {
            /** Specifies whether the user can collapse grouped records in a grid or not. */
            allowCollapsing?: boolean;

            /** Specifies whether groups appear expanded or not. */
            autoExpandAll?: boolean;

            /** Enables the user to group data using the context menu. */
            contextMenuEnabled?: boolean;

            /** Specifies the event on which a group will be expanded/collapsed. */
            expandMode?: string;

            
                groupContinuedMessage?: string;

            
            groupContinuesMessage?: string;

            /** Defines the texts of grouping-related visual elements. */
            texts?: {
                /** Specifies the message displayed in a group row when the corresponding group is continued from the previous page. */
                groupContinuedMessage?: string;

                /** Specifies the message displayed in a group row when the corresponding group continues on the next page. */
                groupContinuesMessage?: string;

                /** Specifies the text of the context menu item that groups data by a specific column. */
                groupByThisColumn?: string;

                /** Specifies the text of the context menu item that clears grouping settings of a specific column. */
                ungroup?: string;

                /** Specifies the text of the context menu item that clears grouping settings of all columns. */
                ungroupAll?: string;
            }
        };

        /** Configures the group panel. */
        groupPanel?: {
            /** Specifies whether columns can be dragged onto or from the group panel. */
            allowColumnDragging?: boolean;

            /** Specifies text displayed by the group panel when it does not contain any columns. */
            emptyPanelText?: string;

            /** Specifies whether the group panel is visible or not. */
            visible?: any;
        };

        /** Specifies the options of a grid pager. */
        pager?: {
            /** Specifies the page sizes that can be selected at runtime. */
            allowedPageSizes?: any;

            /** Specifies whether to show the page size selector or not. */
            showPageSizeSelector?: boolean;

            /** Specifies whether to show the pager or not. */
            visible?: any;

            /** Specifies the text accompanying the page navigator. */
            infoText?: string;

            /** Specifies whether or not to display the text accompanying the page navigator. This text is specified by the infoText option. */
            showInfo?: boolean;

            /** Specifies whether or not to display buttons that switch the grid to the previous or next page. */
            showNavigationButtons?: boolean;
        };

        /** Specifies paging options. */
        paging?: {
            /** Specifies whether DataGrid loads data page by page or all at once. */
            enabled?: boolean;

            /** Specifies the grid page that should be displayed by default. */
            pageIndex?: number;

            /** Specifies the size of grid pages. */
            pageSize?: number;
        };

        /** A handler for the rowClick event. */
        onRowClick?: any;

        /** A handler for the rowPrepared event. */
        onRowPrepared?: (e: any) => void;

        /** Specifies a custom template for grid rows. */
        rowTemplate?: any;

        /** Configures runtime selection. */
        selection?: dxDataGridSelection;

        /** Specifies filters for the rows that must be selected initially. Applies only if selection.deferred is true. */
        selectionFilter?: Object;

        /** Configures scrolling. */
        scrolling?: dxDataGridScrolling;

        /** Specifies the operations that must be performed on the server side. */
        remoteOperations?: any;

        /** Allows you to sort groups according to the values of group summary items. */
        sortByGroupSummaryInfo?: Array<{
            /** Specifies the group summary item whose values must be used to sort groups. */
            summaryItem?: any;

            /** Specifies the identifier of the column that must be used in grouping so that sorting by group summary item values be applied. */
            groupColumn?: string;

            /** Specifies the sort order of group summary item values. */
            sortOrder?: string;
        }>;

        /** Allows you to build a master-detail interface in the grid. */
        masterDetail?: {
            /** Enables an end-user to expand/collapse detail sections. */
            enabled?: boolean;

            /** Specifies whether detail sections appear expanded or collapsed. */
            autoExpandAll?: boolean;

            /** Specifies the template for detail sections. */
            template?: any;
        };

        /** Configures client-side export. */
        export?: {
            /** Enables the client-side exporting feature. */
            enabled?: boolean;
            /** Specifies a default name for the file to which grid data is exported. */
            fileName?: string;
            /** Specifies whether to enable Excel filtering for the exported data in the resulting XLSX file. */
            excelFilterEnabled?: boolean;
            /** Specifies whether to enable word wrapping for the exported data in the resulting XLSX file. */
            excelWrapTextEnabled?: boolean;
            /** Specifies the URL of the server-side proxy that streams the resulting file to the end user to enable export in IE9 and Safari browsers. */
            proxyUrl?: string;
            /** Allows an end user to export selected rows only. */
            allowExportSelectedData?: boolean;
            /** Contains options that specify texts for the export-related commands and hints. */
            texts?: {
                /** Specifies the hint of the Export button when the allowExportSelectedData option is true. */
                exportTo?: string;
                
                exportToExcel?: string;
                
                excelFormat?: string;
                
                selectedRows?: string;
                /** Specifies the text of the command that exports all data. */
                exportAll?: string;
                /** Specifies the text of the drop-down menu command that exports selected rows. */
                exportSelectedRows?: string;
            }
        };

        /** A handler for the exporting event. */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
        }) => void;

        /** A handler for the fileSaving event. */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** A handler for the exported event. */
        onExported?: (e: any) => void;

        /** Specifies options of state storing. */
        stateStoring?: {
            /** Specifies a callback function that performs specific actions on state loading. */
            customLoad?: () => JQueryPromise<Object>;

            /** Specifies a callback function that performs specific actions on state saving. */
            customSave?: (state: Object) => void;

            /** Specifies whether or not a grid saves its state. */
            enabled?: boolean;

            /** Specifies the delay between the last change of a grid state and the operation of saving this state in milliseconds. */
            savingTimeout?: number;

            /** Specifies a unique key to be used for storing the grid state. */
            storageKey?: string;

            /** Specifies the type of storage to be used for state storing. */
            type?: string;
        };

        /** Specifies the options of the grid summary. */
        summary?: {
            /** Contains options that specify text patterns for summary items. */
            texts?: {
                /** Specifies a pattern for the 'sum' summary items when they are displayed in the parent column. */
                sum?: string;

                /** Specifies a pattern for the 'sum' summary items displayed in a group row or in any other column rather than the parent one. */
                sumOtherColumn?: string;

                /** Specifies a pattern for the 'min' summary items when they are displayed in the parent column. */
                min?: string;

                /** Specifies a pattern for the 'min' summary items displayed in a group row or in any other column rather than the parent one. */
                minOtherColumn?: string;

                /** Specifies a pattern for the 'max' summary items when they are displayed in the parent column. */
                max?: string;

                /** Specifies a pattern for the 'max' summary items displayed in a group row or in any other column rather than the parent one. */
                maxOtherColumn?: string;

                /** Specifies a pattern for the 'avg' summary items when they are displayed in the parent column. */
                avg?: string;

                /** Specifies a pattern for the 'avg' summary items displayed in a group row or in any other column rather than the parent one. */
                avgOtherColumn?: string;

                /** Specifies a pattern for the 'count' summary items. */
                count?: string;
            };

            /** Specifies items of the group summary. */
            groupItems?: Array<{
                /** Specifies the identifier of a summary item. */
                name?: string;

                /** Specifies the column that provides data for a group summary item. */
                column?: string;

                /** Customizes the text to be displayed in the summary item. */
                customizeText?: (itemInfo: {
                    value: any;
                    valueText: string;
                }) => string;

                /** Specifies a pattern for the summary item text. */
                displayFormat?: string;

                /**
                * Specifies a precision for the summary item value of a numeric format.
                * @deprecated Use the valueFormat.precision option instead.
                */
                precision?: number;

                /** Specifies whether or not a summary item must be displayed in the group footer. */
                showInGroupFooter?: boolean;

                /** Indicates whether to display group summary items in parentheses after the group row header or to align them by the corresponding columns within the group row. */
                alignByColumn?: boolean;

                /** Specifies the column that must hold the summary item when this item is displayed in the group footer or aligned by a column in the group row. */
                showInColumn?: string;

                /** Specifies how to aggregate data for a summary item. */
                summaryType?: string;

                /** Specifies a format for the summary item value. */
                valueFormat?: any;

                /** Specifies whether or not to skip empty strings, null and undefined values when calculating a summary. */
                skipEmptyValues?: boolean;
            }>;

            /** Specifies items of the total summary. */
            totalItems?: Array<{
                /** Specifies the identifier of a summary item. */
                name?: string;

                /** Specifies the alignment of a summary item. */
                alignment?: string;

                /** Specifies the column that provides data for a summary item. */
                column?: string;

                /** Specifies a CSS class to be applied to a summary item. */
                cssClass?: string;

                /** Customizes the text to be displayed in the summary item. */
                customizeText?: (itemInfo: {
                    value: any;
                    valueText: string;
                }) => string;

                /** Specifies a pattern for the summary item text. */
                displayFormat?: string;

                /**
                 * Specifies a precision for the summary item value of a numeric format.
                 * @deprecated Use the valueFormat.precision option instead.
                 */
                precision?: number;

                /** Specifies the column that must hold the summary item. */
                showInColumn?: string;

                /** Specifies how to aggregate data for a summary item. */
                summaryType?: string;

                /** Specifies a format for the summary item value. */
                valueFormat?: any;

                /** Specifies whether or not to skip empty strings, null and undefined values when calculating a summary. */
                skipEmptyValues?: boolean;
            }>;

            /** Specifies whether or not to skip empty strings, null and undefined values when calculating a summary. */
            skipEmptyValues?: boolean;

            /** Allows you to use a custom aggregate function to calculate the value of a summary item. */
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
        /** Specifies which data field provides keys for nodes. */
        keyExpr?: any;

        /** Specifies which data field provides parent keys. */
        parentIdExpr?: any;

        /** Specifies which data field contains nested items. Set this option when your data has a hierarchical structure. */
        itemsExpr?: any;

        /** Specifies which data field defines whether the node has children. */
        hasItemsExpr?: any;

        /** Specifies the root node's identifier. Applies if dataStructure is 'plain'. */
        rootValue?: Object;

        /** Notifies the widget of your data structure. */
        dataStructure?: string;

        /** Specifies keys of the initially expanded rows. */
        expandedRowKeys?: Array<any>;

        /** Specifies whether nodes appear expanded or collapsed after filtering is applied. */
        expandNodesOnFiltering?: boolean;

        /** Specifies whether all rows are expanded initially. */
        autoExpandAll?: boolean;

        /** Configures columns. */
        columns?: Array<dxTreeListColumn>;

        /** A handler for the contextMenuPreparing event. Executed before a context menu is rendered. */
        onContextMenuPreparing?: (e: any) => void;

        /** A handler for the cellClick event. Executed after a user clicks a cell. */
        onCellClick?: any;

        /** A handler for the cellHoverChanged event. Executed after the pointer enters or leaves a cell. */
        onCellHoverChanged?: (e: any) => void;

        /** A handler for the cellPrepared event. Executed after the widget creates a cell. */
        onCellPrepared?: (e: any) => void;

        /** A handler for the contentReady event. Executed when the widget's content is ready. */
        onContentReady?: Function;

        /** Customizes columns after they are created. */
        customizeColumns?: (columns: Array<dxTreeListColumn>) => void;

        /** A handler for the rowClick event. Executed when a user clicks a row. */
        onRowClick?: any;

        /** A handler for the rowPrepared event. Executed after the widget creates a row. */
        onRowPrepared?: (e: any) => void;

        /** A handler for editingStart. Executed before a cell or row switches to the editing state. */
        onEditingStart?: (e: {
            data: any;
            key: any;
            cancel: boolean;
            column: dxTreeListColumn
        }) => void;

        /** A handler for the editorPrepared event. Executed after an editor is created. */
        onEditorPrepared?: (e: any) => void;

        /** A handler for the editorPreparing event. Executed before an editor is created. */
        onEditorPreparing?: (e: any) => void;

        /** Configures editing. */
        editing?: dxTreeListEditing;

         /** Configures runtime selection. */
        selection?: dxTreeListSelection;

        /** Configures scrolling. */
        scrolling?: dxTreeListScrolling;

        /** A handler for the nodesInitialized event. Executed after all nodes in the widget are initialized. */
        onNodesInitialized?: (e: any) => void;

        /** Specifies what operations are performed on the server. */
        remoteOperations?: any;
    }

    export interface GridBaseOptions extends WidgetOptions {
        

        /** Specifies whether the outer borders of the widget are visible. */
        showBorders?: boolean;

        /** Enables a hint that appears when a user hovers the mouse pointer over a cell with truncated content. */
        cellHintEnabled?: boolean;

        /** Specifies whether a user can reorder columns. */
        allowColumnReordering?: boolean;

        /** Specifies whether a user can resize columns. */
        allowColumnResizing?: boolean;

        /** Specifies how the widget resizes columns. Applies only if allowColumnResizing is true. */
        columnResizingMode?: string;

        /** Specifies the minimum width of columns. */
        columnMinWidth?: number;

        /** Specifies whether columns should adjust their widths to the content. */
        columnAutoWidth?: boolean;

        /** Specifies the origin of data for the widget. */
        dataSource?: any;

        /** Specifies whether data should be cached. */
        cacheEnabled?: boolean;

        /** Configures the load panel. */
        loadPanel?: {
            /** Specifies whether to show the load panel or not. */
            enabled?: any;

            /** Specifies the height of the load panel in pixels. */
            height?: number;

            /** Specifies a URL pointing to an image to be used as a loading indicator. */
            indicatorSrc?: string;

            /** Specifies whether to show the loading indicator. */
            showIndicator?: boolean;

            /** Specifies whether to show the pane of the load panel. */
            showPane?: boolean;

            /** Specifies text displayed on the load panel. */
            text?: string;

            /** Specifies the width of the load panel in pixels. */
            width?: number;
        };

        /** Specifies text shown when the widget does not display any data. */
        noDataText?: string;

        /** Specifies whether rows should be shaded differently. */
        rowAlternationEnabled?: boolean;

        /** Specifies whether to enable two-way data binding. */
        twoWayBindingEnabled?: boolean;

        /** A handler for the dataErrorOccurred event. Executed when an error occurs in the data source. */
        onDataErrorOccurred?: (e: { error: Error }) => void;

        /** Specifies whether column headers are visible. */
        showColumnHeaders?: boolean;

        /** Specifies whether vertical lines that separate one column from another are visible. */
        showColumnLines?: boolean;

        /** Specifies whether horizontal lines that separate one row from another are visible. */
        showRowLines?: boolean;

        /** Configures runtime sorting. */
        sorting?: {
            /** Specifies text for the context menu item that sets an ascending sort order in a column. */
            ascendingText?: string;

            /** Specifies text for the context menu item that clears sorting settings for a column. */
            clearText?: string;

            /** Specifies text for the context menu item that sets a descending sort order in a column. */
            descendingText?: string;

            /** Specifies the sorting mode. */
            mode?: string;
        };

        /** Specifies whether text that does not fit into a column should be wrapped. */
        wordWrapEnabled?: boolean;

        /** Specifies date-time values' serialization format. Use it only if you do not specify the dataSource at design time. */
        dateSerializationFormat?: string;

        /** A handler for the initNewRow event. Executed before a new row is added to the widget. */
        onInitNewRow?: (e: { data: any }) => void;

        /** A handler for the rowInserted event. Executed after a new row has been inserted into the data source. */
        onRowInserted?: (e: { data: any; key: any }) => void;

        /** A handler for the rowInserting event. Executed before a new row is inserted into the data source. */
        onRowInserting?: (e: { data: any; cancel: any }) => void;

        /** A handler for the rowRemoved event. Executed after a row has been removed from the data source. */
        onRowRemoved?: (e: { data: any; key: any }) => void;

        /** A handler for the rowRemoving event. Executed before a row is removed from the data source. */
        onRowRemoving?: (e: { data: any; key: any; cancel: any }) => void;

        /** A handler for the rowUpdated event. Executed after a row has been updated in the data source. */
        onRowUpdated?: (e: { data: any; key: any }) => void;

        /** A handler for the rowUpdating event. Executed before a row is updated in the data source. */
        onRowUpdating?: (e: { oldData: any; newData: any; key: any; cancel: any }) => void;

        /** A handler for the rowValidating event. Executed after cells in a row are validated against validation rules. */
        onRowValidating?: (e: any) => void;

        /** A handler for the toolbarPreparing event. Executed before the toolbar is created. */
        onToolbarPreparing?: (e: any) => void;

        /** Configures the column chooser. */
        columnChooser?: {
            /** Specifies text displayed by the column chooser when it is empty. */
            emptyPanelText?: string;

            /** Specifies whether a user can open the column chooser. */
            enabled?: boolean;

            /** Specifies whether searching is enabled in the column chooser. */
            allowSearch?: boolean;

            /** Specifies how a user manages columns using the column chooser. */
            mode?: string;

            /** Specifies the height of the column chooser. */
            height?: number;

            /** Specifies the title of the column chooser. */
            title?: string;

            /** Specifies the width of the column chooser. */
            width?: number;
        };

        /** Configures column fixing. */
        columnFixing?: {
            /** Enables column fixing. */
            enabled?: boolean;

            /** Contains options that specify texts for column fixing commands in the context menu of a column header. */
            texts?: {
                /** Specifies text for the context menu item that fixes a column. */
                fix?: string;

                /** Specifies text for the context menu item that unfixes a column. */
                unfix?: string;

                /** Specifies text for the context menu subitem that fixes a column to the left edge of the widget. */
                leftPosition?: string;

                /** Specifies text for the context menu subitem that fixes a column to the right edge of the widget. */
                rightPosition?: string;
            };
        };

        /** Configures the filter row. */
        filterRow?: {

            /** Specifies when to apply a filter. */
            applyFilter?: string;

            /** Specifies text for a hint that appears when a user pauses on a button that applies the filter. */
            applyFilterText?: string;

            /** Specifies descriptions for filter operations on the filter list. */
            operationDescriptions?: {
                /** A description for the "=" operation. */
                equal?: string;
                /** A description for the "<>" operation. */
                notEqual?: string;
                /** A description for the "<" operation. */
                lessThan?: string;
                /** A description for the "<=" operation. */
                lessThanOrEqual?: string;
                /** A description for the ">" operation. */
                greaterThan?: string;
                /** A description for the ">=" operation. */
                greaterThanOrEqual?: string;
                /** A description for the "startswith" operation. */
                startsWith?: string;
                /** A description for the "contains" operation. */
                contains?: string;
                /** A description for the "notcontains" operation. */
                notContains?: string;
                /** A description for the "endswith" operation. */
                endsWith?: string;
                /** A description for the "between" operation. */
                between?: string;
            };

            /** Specifies text for the reset operation on the filter list. */
            resetOperationText?: string;

            /** Specifies text for the item that clears the applied filter. Used only when a cell of the filter row contains a select box. */
            showAllText?: string;

            /** Specifies a placeholder for the editor that specifies the start of a range when a user selects the "between" filter operation. */
            betweenStartText?: string;

            /** Specifies a placeholder for the editor that specifies the end of a range when a user selects the "between" filter operation. */
            betweenEndText?: string;

            /** Specifies whether icons that open the filter lists are visible. */
            showOperationChooser?: boolean;

            /** Specifies whether the filter row is visible. */
            visible?: boolean;
        };

        /** Configures the header filter feature. */
        headerFilter?: {
            /** Indicates whether header filter icons are visible. */
            visible?: boolean;

            /** Specifies the height of the popup menu that contains values for filtering. */
            height?: number;

            /** Specifies the width of the popup menu that contains values for filtering. */
            width?: number;

            /** Specifies whether searching is enabled in the header filter. */
            allowSearch?: boolean;

            /** Contains options that specify text for various elements of the popup menu. */
            texts?: {
                /** Specifies a name for the item that represents empty values in the popup menu. */
                emptyValue?: string;

                /** Specifies text for the button that applies the specified filter. */
                ok?: string;

                /** Specifies text for the button that closes the popup menu without applying a filter. */
                cancel?: string;
            }
        };

        /** Specifies whether the widget should hide columns to adapt to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is "widget". */
        columnHidingEnabled?: boolean;

        /** A handler for the adaptiveDetailRowPreparing event. Executed before an adaptive detail row is rendered. */
        onAdaptiveDetailRowPreparing?: (e: any) => void;

        /** Indicates whether to show the error row. */
        errorRowEnabled?: boolean;

        /** Specifies the keys of rows that must be selected initially. Applies only if selection.deferred is false. */
        selectedRowKeys?: Array<any>;

        /** A handler for the selectionChanged event. Executed after selecting a row or clearing its selection. */
        onSelectionChanged?: (e: {
            currentSelectedRowKeys: Array<any>;
            currentDeselectedRowKeys: Array<any>;
            selectedRowKeys: Array<any>;
            selectedRowsData: Array<any>;
        }) => void;

        /** A handler for the keyDown event. Executed when the widget is in focus and a key has been pressed down. */
        onKeyDown?: (e: any) => void;

        /** Configures the search panel. */
        searchPanel?: {
            /** Specifies whether found substrings should be highlighted. */
            highlightSearchText?: boolean;

            /** Notifies the widget whether search is case-sensitive to ensure proper highlightning of search results. Applies only if highlightSearchText is true. */
            highlightCaseSensitive?: boolean;

            /** Specifies a placeholder for the search panel. */
            placeholder?: string;

            /** Specifies whether the search panel is visible or not. */
            visible?: boolean;

            /** Specifies whether the widget should search against all columns or only visible ones. */
            searchVisibleColumnsOnly?: boolean;

            /** Specifies the width of the search panel in pixels. */
            width?: number;

            /** Sets a search string for the search panel. */
            text?: string;
        };

        /** A handler for the rowExpanding event. Executed before a row is expanded. */
        onRowExpanding?: (e: any) => void;

        /** A handler for the rowExpanded event. Executed after a row is expanded. */
        onRowExpanded?: (e: any) => void;

        /** A handler for the rowCollapsing event. Executed before a row is collapsed. */
        onRowCollapsing?: (e: any) => void;

        /** A handler for the rowCollapsed event. Executed after a row is collapsed. */
        onRowCollapsed?: (e: any) => void;
    }

    
    class GridBase extends Widget implements DataHelperMixin {
        constructor(element: JQuery, options?: GridBaseOptions);
        constructor(element: Element, options?: GridBaseOptions);


        /** Clears sorting settings of all columns at once. */
        clearSorting(): void;

        /** Gets a cell by the row index and data field. */
        getCellElement(rowIndex: number, dataField: string): any;

        /** Gets a cell by the row index and column index. */
        getCellElement(rowIndex: number, visibleColumnIndex: number): any;

        /** Gets the element of a row by its index. */
        getRowElement(rowIndex: number): any;

        /** Gets the index of a row by its key. */
        getRowIndexByKey(key: any): number;

        /** Gets the key of a row by its index. */
        getKeyByRowIndex(rowIndex: number): any;

        /** Removes a specific column from the widget. */
        deleteColumn(id: any): void;

        /** Displays the load panel. */
        beginCustomLoading(messageText: string): void;

        /** Hides the load panel. */
        endCustomLoading(): void;

        /** Returns the number of data columns in the widget including visible and hidden columns, but without command columns. */
        columnCount(): number;

        /** Gets the value of a specific option set for a specific column. */
        columnOption(id: any, optionName: string): any;

        /** Assigns a new value to a single option of a specific column. */
        columnOption(id: any, optionName: string, optionValue: any): void;

        /** Gets the options of a column using its identifier. */
        columnOption(id: any): Object;

        /** Assigns new values to several options of a specific column at once. */
        columnOption(id: any, options: Object): void;

        /** Gets a data object's key. */
        keyOf(obj: Object): any;

        /** Allows you to obtain a data object by its key. */
        byKey(key: any): JQueryPromise<any>;

        /** Reloads data in the widget. */
        refresh(): JQueryPromise<any>;

        /** Updates the widget's content after resizing. */
        updateDimensions(): void;

        getDataSource(): DevExpress.data.DataSource;

        /** Gets the instance of the scrollable part of the widget. */
        getScrollable(): dxScrollable;

        /** Repaints specific rows. */
        repaintRows(rowIndexes: Array<number>): void;

        /** Switches a specific cell into the editing state. The cell is found by the row index and column index. Takes effect only if the editing mode is 'batch' or 'cell'. */
        editCell(rowIndex: number, visibleColumnIndex: number): void;

        /** Switches a specific cell into the editing state. The cell is found by the row index and data field. Takes effect only if the editing mode is 'batch' or 'cell'. */
        editCell(rowIndex: number, dataField: string): void;

        /** Switches a specific row into the editing state. Takes effect only if the editing mode is 'row', 'popup' or 'form'. */
        editRow(rowIndex: number): void;

        /** Gets the value of a cell found by the row index and data field. */
        cellValue(rowIndex: number, dataField: string): any;

        /** Gets the value of a cell found by the row index and column index. */
        cellValue(rowIndex: number, visibleColumnIndex: number): any;

        /** Assigns a new value to a cell found by the row index and data field. */
        cellValue(rowIndex: number, dataField: string, value: any): void;

        /** Assigns a new value to a cell found by the row index and column index. */
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;

        /** Removes a specific row from the widget. */
        deleteRow(rowIndex: number): void;

        /** Saves changes that a user made to data. */
        saveEditData(): JQueryPromise<any>;

        /** Recovers a row deleted in batch editing mode. */
        undeleteRow(rowIndex: number): void;

        /** Discards changes that a user made to data. */
        cancelEditData(): void;

        /** Checks whether the widget has unsaved changes. */
        hasEditData(): boolean;

        /** Switches the cell being edited back to the normal state. Takes effect only if editing.mode is batch. */
        closeEditCell(): void;

        /** Checks whether a specific adaptive detail row is expanded or collapsed. */
        isAdaptiveDetailRowExpanded(key: any): void;

        /** Expands an adaptive detail row found by the key of its parent data row. */
        expandAdaptiveDetailRow(key: any): void;

        /** Collapses the currently expanded adaptive detail row (if there is one). */
        collapseAdaptiveDetailRow(): void;

        /** Selects all rows. */
        selectAll(): JQueryPromise<any>;

        /** Clears the selection of all rows on all pages or the currently rendered page only. */
        deselectAll(): JQueryPromise<any>;

        /** Selects rows by keys. */
        selectRows(keys: Array<any>, preserve: boolean): JQueryPromise<any>;

        /** Clears selection of specific rows. */
        deselectRows(keys: Array<any>): JQueryPromise<any>;

        /** Selects rows by indexes. */
        selectRowsByIndexes(indexes: Array<any>): JQueryPromise<any>;

        /** Clears selection of all rows on all pages. */
        clearSelection(): void;

        
        startSelectionWithCheckboxes(): boolean;

        
        /** Checks whether the row with a specific key is selected. Takes effect only if selection.deferred is false. */
        isRowSelected(arg: any): boolean;

        /** Seeks a search string in the columns whose allowSearch option is true. */
        searchByText(text: string): void;

        /** Sets focus on a specific cell. */
        focus(element?: Element): void;
        focus(element?: JQuery): void;

        /** Clears all filters applied to widget rows. */
        clearFilter(): void;

        /** Clears all row filters of a specific type. */
        clearFilter(filterName: string): void;

        /** Applies a filter to the widget's data source. */
        filter(filterExpr?: any): void;

        /** Returns a filter expression applied to the widget's data source using the filter(filterExpr) method. */
        filter(): any;

        /** Returns the total filter that combines all the filters applied. */
        getCombinedFilter(): any;

        /** Returns the total filter that combines all the filters applied. */
        getCombinedFilter(returnDataField?: boolean): any;

        /** Hides the column chooser. */
        hideColumnChooser(): void;

        /** Shows the column chooser. */
        showColumnChooser(): void;
    }

    /** The TreeList is a widget that represents data from a local or remote source in the form of a multi-column tree view. This widget offers such features as sorting, filtering, editing, selection, etc. */
    export class dxTreeList extends GridBase {
        constructor(element: JQuery, options?: dxTreeListOptions);
        constructor(element: Element, options?: dxTreeListOptions);

        /** Adds a new column to the widget. */
        addColumn(columnOptions: dxTreeListColumn): void;

        /** Gets all visible columns. */
        getVisibleColumns(): Array<dxTreeListColumn>;

        /** Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns. */
        getVisibleColumns(headerLevel?: number): Array<dxTreeListColumn>;

        /** Gets currently rendered rows. */
        getVisibleRows(): Array<dxTreeListRow>;

        /** Gets the root node. */
        getRootNode(): dxTreeListNode;

        /** Checks whether a row is expanded or collapsed. */
        isRowExpanded(key: any): boolean;

        /** Expands a specific row. */
        expandRow(key: any): JQueryPromise<void>;

        /** Collapses a specific row. */
        collapseRow(key: any): JQueryPromise<void>;

        /** Gets the currently selected rows' keys. */
        getSelectedRowKeys(): Array<any>;

        /** Gets the currently selected row keys. */
        getSelectedRowKeys(leavesOnly: boolean): Array<any>;

        /** Gets data objects of currently selected rows. */
        getSelectedRowsData(): Array<any>;

        /** Gets a node by its key. */
        getNodeByKey(key: any): dxTreeListNode;

        /** Adds an empty data row to the highest hierarchical level. */
        addRow(): void;

        /** Adds an empty data row to a specified parent row. */
        addRow(parentId: any): void;

        /** Loads all root node descendants (all data items). Takes effect only if data has the plain structure and  remoteOperations | filtering is true. */
        loadDescendants(): JQueryPromise<void>;

        /** Loads a specific node's descendants. Takes effect only if data has the plain structure and  remoteOperations | filtering is true. */
        loadDescendants(keys: any): JQueryPromise<void>;

        /** Loads all or only direct descendants of specific nodes. Takes effect only if data has the plain structure and  remoteOperations | filtering is true. */
        loadDescendants(keys: any, childrenOnly: boolean): JQueryPromise<void>;
    }

    /** The DataGrid is a widget that represents data from a local or remote source in the form of a grid. This widget offers such basic features as sorting, grouping, filtering, as well as more advanced capabilities, like state storing, export to Excel, master-detail interface, and many others. */
    export class dxDataGrid extends GridBase {
        constructor(element: JQuery, options?: dxDataGridOptions);
        constructor(element: Element, options?: dxDataGridOptions);


        /** Ungroups grid records. */
        clearGrouping(): void;

        /** Returns the current state of the grid. */
        state(): Object;

        /** Sets the grid state. */
        state(state: Object): void;

        /** Adds a new column to the widget. */
        addColumn(columnOptions: dxDataGridColumn): void;

        /** Collapses groups or master rows in a grid. */
        collapseAll(groupIndex?: number): void;

        /** Gets all visible columns. */
        getVisibleColumns(): Array<dxDataGridColumn>;

        /** Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns. */
        getVisibleColumns(headerLevel?: number): Array<dxDataGridColumn>;

        /** Gets currently rendered rows. */
        getVisibleRows(): Array<dxDataGridRow>;

        /** Expands groups or master rows in a grid. */
        expandAll(groupIndex: number): void;

        /** Checks whether a specific group or master row is expanded or collapsed. */
        isRowExpanded(key: any): boolean;

        /** Allows you to expand a specific group or master row by its key. */
        expandRow(key: any): JQueryPromise<void>;

        /** Allows you to collapse a specific group or master row by its key. */
        collapseRow(key: any): JQueryPromise<void>;

        /**
        * Adds a new data row to a grid.
        * @deprecated Use the addRow() method instead.
        */
        insertRow(): void;

        /** Switches a grid to a specified page. */
        pageIndex(newIndex: number): void;

        /** Gets the index of the current page. */
        pageIndex(): number;

        /** Sets the page size. */
        pageSize(value: number): void;

        /** Gets the current page size. */
        pageSize(): number;

        /**
         * Removes a specific row from a grid.
         * @deprecated Use the deleteRow(rowIndex) method instead.
         */
        removeRow(rowIndex: number): void;

        /** Returns how many pages the grid contains. */
        pageCount(): number;

        /** Returns the number of records currently held by a grid. */
        totalCount(): number;

        /** Gets the value of a total summary item. */
        getTotalSummaryValue(summaryItemName: string): any;

        /** Exports grid data to Excel. */
        exportToExcel(selectionOnly: boolean): void;

        /** Gets data objects of currently selected rows. */
        getSelectedRowsData(): any;

        /** Gets the currently selected rows' keys. */
        getSelectedRowKeys(): any;

        /** Adds an empty data row. */
        addRow(): void;
    }

    export interface dxPivotGridOptions extends WidgetOptions {
        
        onContentReady?: Function;

        /** Specifies a data source for the pivot grid. */
        dataSource?: any;

        
        useNativeScrolling?: any;

        /** A configuration object specifying scrolling options. */
        scrolling?: {
            /** Specifies the scrolling mode. */
            mode?: string;

            /** Specifies whether or not the widget uses native scrolling. */
            useNative?: any;
        };

        /** Allows an end-user to change sorting options. */
        allowSorting?: boolean;

        /** Allows an end-user to sort columns by summary values. */
        allowSortingBySummary?: boolean;

        /** Allows a user to filter fields by selecting or deselecting values in the popup menu. */
        allowFiltering?: boolean;

        /** Specifies the area to which data field headers must belong. */
        dataFieldArea?: string;

         /** Configures the field panel. */
        fieldPanel?: {
            /** Makes fields on the field panel draggable. */
            allowFieldDragging?: boolean;

            /** Shows/hides filter fields on the field panel. */
            showFilterFields?: boolean;

            /** Shows/hides data fields on the field panel. */
            showDataFields?: boolean;

            /** Shows/hides column fields on the field panel. */
            showColumnFields?: boolean;

            /** Shows/hides row fields on the field panel. */
            showRowFields?: boolean;

            /** Shows/hides the field panel. */
            visible?: boolean;

            /** Specifies the placeholders of the field areas. */
            texts?: {
                /** Specifies the placeholder of the column field area. */
                columnFieldArea?: string;
                /** Specifies the placeholder of the row field area. */
                rowFieldArea?: string;
                /** Specifies the placeholder of the filter field area. */
                filterFieldArea?: string;
                /** Specifies the placeholder of the data field area. */
                dataFieldArea?: string;
            }
        }

        /** Allows an end-user to expand/collapse all header items within a header level. */
        allowExpandAll?: boolean;

        /** Specifies whether long text in header items should be wrapped. */
        wordWrapEnabled?: boolean;

        /** Specifies whether to display the Total rows. Applies only if rowHeaderLayout is "standard". */
        showRowTotals?: boolean;

        /** Specifies whether to display the Grand Total row. */
        showRowGrandTotals?: boolean;

        /** Specifies whether to display the Total columns. */
        showColumnTotals?: boolean;

        /** Specifies whether to display the Grand Total column. */
        showColumnGrandTotals?: boolean;

        /** Specifies whether or not to hide rows and columns with no data. */
        hideEmptySummaryCells?: boolean;

        /** Specifies where to show the total rows or columns. Applies only if rowHeaderLayout is "standard". */
        showTotalsPrior?: string;

        /** Specifies the layout of items in the row header. */
        rowHeaderLayout?: string;

        /** Specifies whether the outer borders of the grid are visible or not. */
        showBorders?: boolean;

        /** The Field Chooser configuration options. */
        fieldChooser?: {
            /** Enables or disables the field chooser. */
            enabled?: boolean;

            /** Specifies whether searching is enabled in the field chooser. */
            allowSearch?: boolean;

            /** Specifies the field chooser layout. */
            layout?: number;

            /** Specifies the text to display as a title of the field chooser popup window. */
            title?: string;

            /** Specifies the field chooser width. */
            width?: number;

            /** Specifies the field chooser height. */
            height?: number;

            /** Strings that can be changed or localized in the pivot grid's integrated Field Chooser. */
            texts?: {
                /** The string to display instead of Row Fields. */
                rowFields?: string;
                /** The string to display instead of Column Fields. */
                columnFields?: string;
                /** The string to display instead of Data Fields. */
                dataFields?: string;
                /** The string to display instead of Filter Fields. */
                filterFields?: string;
                /** The string to display instead of All Fields. */
                allFields?: string;
            };
        }
        /** Strings that can be changed or localized in the PivotGrid widget. */
        texts?: {
            /** The string to display as a header of the Grand Total row and column. */
            grandTotal?: string;
            /** The string to display as a header of the Total row and column. */
            total?: string;
            /** Specifies the text displayed when a pivot grid does not contain any fields. */
            noData?: string;
            /** The string to display as a Show Field Chooser context menu item. */
            showFieldChooser?: string;
            /** The string to display as an Expand All context menu item. */
            expandAll?: string;
            /** The string to display as a Collapse All context menu item. */
            collapseAll?: string;
            /** The string to display as a Sort Column by Summary Value context menu item. */
            sortColumnBySummary?: string;
            /** The string to display as a Sort Row by Summary Value context menu item. */
            sortRowBySummary?: string;
            /** The string to display as a Remove All Sorting context menu item. */
            removeAllSorting?: string;
            /** The string to display as an Export to Excel file context menu item. */
            exportToExcel?: string;
            /** Specifies text displayed in a cell when its data is unavailable for some reason. */
            dataNotAvailable?: string;
        };

        /** Specifies options configuring the load panel. */
        loadPanel?: {
            /** Enables or disables the load panel. */
            enabled?: boolean;

            /** Specifies the height of the load panel. */
            height?: number;

            /** Specifies the URL pointing to an image that will be used as a load indicator. */
            indicatorSrc?: string;

            /** Specifies whether or not to show a load indicator. */
            showIndicator?: boolean;

            /** Specifies whether or not to show load panel background. */
            showPane?: boolean;

            /** Specifies the text to display inside a load panel. */
            text?: string;

            /** Specifies the width of the load panel. */
            width?: number;
        };

        /** A handler for the cellClick event. */
        onCellClick?: (e: any) => void;

        /** A handler for the cellPrepared event. */
        onCellPrepared?: (e: any) => void;

        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: (e: any) => void;

        /** Configures client-side export. */
        export?: {
            /** Enables client-side export. */
            enabled?: boolean;
            /** Specifies a default name for the file to which grid data is exported. */
            fileName?: string;
            /** Specifies the URL of the server-side proxy that streams the resulting file to the end user to enable export in IE9 and Safari browsers. */
            proxyUrl?: string;
        };

        /** A handler for the exporting event. */
        onExporting?: (e: {
            fileName: string;
            cancel: boolean;
        }) => void;

        /** A handler for the fileSaving event. */
        onFileSaving?: (e: {
            fileName: string;
            format: string;
            data: any;
            cancel: boolean;
        }) => void;

        /** A handler for the exported event. */
        onExported?: (e: any) => void;

        /** A configuration object specifying options related to state storing. */
        stateStoring?: {
            /** Specifies a callback function that performs specific actions on state loading. */
            customLoad?: () => JQueryPromise<Object>;

            /** Specifies a callback function that performs specific actions on state saving. */
            customSave?: (gridState: Object) => void;

            /** Specifies whether or not a grid saves its state. */
            enabled?: boolean;

            /** Specifies the delay between the last change of a grid state and the operation of saving this state in milliseconds. */
            savingTimeout?: number;

            /** Specifies a unique key to be used for storing the grid state. */
            storageKey?: string;

            /** Specifies the type of storage to be used for state storing. */
            type?: string;
        };

        /** Configures the header filter feature. */
        headerFilter?: {
            /** Specifies the height of the popup menu containing filtering values. */
            height?: number;

            /** Specifies the width of the popup menu containing filtering values. */
            width?: number;

            /** Specifies whether searching is enabled in the header filter. */
            allowSearch?: boolean;

            /** Configures the texts of the popup menu's elements. */
            texts?: {
                /** Specifies the name of the item that represents empty values in the popup menu. */
                emptyValue?: string;

                /** Specifies the text of the button that applies a filter. */
                ok?: string;

                /** Specifies the text of the button that closes the popup menu without applying a filter. */
                cancel?: string;
            }
        };
    }


    /** The PivotGrid is a widget that allows you to display and analyze multi-dimensional data from a local storage or an OLAP cube. */
    export class dxPivotGrid extends Widget {
        constructor(element: JQuery, options?: dxPivotGridOptions);
        constructor(element: Element, options?: dxPivotGridOptions);

        /** Gets the PivotGridDataSource instance. */
        getDataSource(): DevExpress.data.PivotGridDataSource;

        /** Gets the Popup instance of the field chooser window. */
        getFieldChooserPopup(): DevExpress.ui.dxPopup;

        /** Updates the widget to the size of its content. */
        updateDimensions(): void;

        /** Exports pivot grid data to the Excel file. */
        exportToExcel(): void;

        /** Binds a Chart to the PivotGrid. */
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

        /** Specifies the height of the widget. */
        height?: any;

        /** Specifies whether searching is enabled in the field chooser. */
        allowSearch?: boolean;

        /** Specifies the field chooser layout. */
        layout?: number;

        /** The data source of a PivotGrid widget. */
        dataSource?: DevExpress.data.PivotGridDataSource;


        onContentReady?: Function;

        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: (e: any) => void;

        /** Strings that can be changed or localized in the PivotGridFieldChooser widget. */
        texts?: {
            /** The string to display instead of Row Fields. */
            rowFields?: string;
            /** The string to display instead of Column Fields. */
            columnFields?: string;
            /** The string to display instead of Data Fields. */
            dataFields?: string;
            /** The string to display instead of Filter Fields. */
            filterFields?: string;
            /** The string to display instead of All Fields. */
            allFields?: string;
        };

        /** Configures the header filter feature. */
        headerFilter?: {
            /** Specifies the height of the popup menu containing filtering values. */
            height?: number;

            /** Specifies the width of the popup menu containing filtering values. */
            width?: number;

            /** Specifies whether searching is enabled in the header filter. */
            allowSearch?: boolean;

            /** Configures the texts of the popup menu's elements. */
            texts?: {
                /** Specifies the name of the item that represents empty values in the popup menu. */
                emptyValue?: string;

                /** Specifies the text of the button that applies a filter. */
                ok?: string;

                /** Specifies the text of the button that closes the popup menu without applying a filter. */
                cancel?: string;
            };
        };
    }

    /** A complementary widget for the PivotGrid that allows you to manage data displayed in the PivotGrid. */
    export class dxPivotGridFieldChooser extends Widget {
        constructor(element: JQuery, options?: dxPivotGridFieldChooserOptions);
        constructor(element: Element, options?: dxPivotGridFieldChooserOptions);

        /** Updates the widget to the size of its content. */
        updateDimensions(): void;

        /** Gets the PivotGridDataSource instance. */
        getDataSource(): DevExpress.data.PivotGridDataSource;


    }
    export interface dxFilterBuilderField {
        

        
        caption?: string;

        
        dataField?: string;

        
        dataType?: string;

        
        format?: any;

        
        trueText?: string;

        
        falseText?: string;

        
        lookup?: {
            
            allowClearing?: boolean;

            
            dataSource?: any;

            
            displayExpr?: any;

            
            valueExpr?: any;
        };

        
        filterOperations?: Array<string>;

        
        customizeText?: (fieldInfo: { value: any; valueText: string; }) => string;

        
        editorTemplate?: any;
    }

    export interface dxFilterBuilderOptions extends WidgetOptions {
        

        /** Specifies the current filter expression. */
        value?: Object;

        /** Specifies whether the widget can display hierarchical data fields. */
        allowHierarchicalFields?: boolean;

        /** Configures fields. */
        fields?: Array<dxFilterBuilderField>;

        /** Specifies group operation descriptions. */
        groupOperationDescriptions?: {
            /** The "and" operation's description. */
            and?: string;
            /** The "or" operation's description. */
            or?: string;
            /** The "notand" operation's description. */
            notAnd?: string;
            /** The "notor" operation's description. */
            notOr?: string;
        };

        /** Specifies filter operation descriptions. */
        filterOperationDescriptions?: {
            /** The "=" operation's description. */
            equal?: string;
            /** The "<>" operation's description. */
            notEqual?: string;
            /** The "<" operation's description. */
            lessThan?: string;
            /** The "<=" operation's description. */
            lessThanOrEqual?: string;
            /** The ">" operation's description. */
            greaterThan?: string;
            /** The ">=" operation's description. */
            greaterThanOrEqual?: string;
            /** The "startswith" operation's description. */
            startsWith?: string;
            /** The "contains" operation's description. */
            contains?: string;
            /** The "notcontains" operation's description. */
            notContains?: string;
            /** The "endswith" operation's description. */
            endsWith?: string;
            /** The "isblank" operation's description. */
            isBlank?: string;
            /** The "isnotblank" operation's description. */
            isNotBlank?: string;
        };

        /** A handler for the editorPrepared event. Executed after an editor is created. */
        onEditorPrepared?: (e: any) => void;

        /** A handler for the editorPreparing event. Executed before an editor is created. */
        onEditorPreparing?: (e: any) => void;

        /** A handler for the valueChanged event. Executed after the widget's value is changed. */
        onValueChanged?: (e: any) => void;
    }

    /** The FilterBuilder widget allows a user to build complex filter expressions with an unlimited number of filter conditions, combined by logical operations using the UI. */
    export class dxFilterBuilder extends Widget {
        constructor(element: JQuery, options?: dxFilterBuilderOptions);
        constructor(element: Element, options?: dxFilterBuilderOptions);
    }

}
