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

        /** Casts field values to a specific data type. */
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
        /** Specifies the view used in the scheduler by default. */
        currentView?: string;
        /** Specifies the origin of data for the widget. */
        dataSource?: any;
        /** Specifies the first day of a week. */
        firstDayOfWeek?: number;
        /** The template to be used for rendering appointments. */
        appointmentTemplate?: any;
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

    export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions {
        
        
        
        
        
        
        
        
        
        
        

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

        /** Specifies the current value used to filter tree view items. */
        searchValue?: string;

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

            /** The delay in milliseconds after which the widget is displayed. */
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

    export interface dxRemoteOperations {
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

    export interface dxDataGridColumn {
        
        

        
        alignment?: string;

        
        allowEditing?: boolean;

        
        allowFiltering?: boolean;

        
        allowHeaderFiltering?: boolean;

        
        allowFixing?: boolean;

        
        allowSearch?: boolean;

        /** Specifies whether the user can group data by values of this column. Applies only when grouping is enabled. */
        allowGrouping?: boolean;

        
        allowHiding?: boolean;

        
        allowReordering?: boolean;

        
        allowResizing?: boolean;

        
        allowSorting?: boolean;

        /** Specifies whether data from this column should be exported. */
        allowExporting?: boolean;

        /** Specifies whether groups appear expanded or not when records are grouped by a specific column. Setting this option makes sense only when grouping is allowed for this column. */
        autoExpandGroup?: boolean;

        
        calculateCellValue?: (rowData: Object) => string;

        
        setCellValue?: (rowData: Object, value: any) => void;

        
        calculateFilterExpression?: (filterValue: any, selectedFilterOperation: string, target: string) => any;

        
        caption?: string;

        
        cellTemplate?: any;

        
        cssClass?: string;

        
        calculateDisplayValue?: any;

        /** Specifies a field name or a function that returns a field name or a value to be used for grouping column cells. */
        calculateGroupValue?: any;

        
        calculateSortValue?: any;

        
        customizeText?: (cellInfo: { value: any; valueText: string; target: string; groupInterval: any }) => string;

        
        dataField?: string;

        
        dataType?: string;

        
        editCellTemplate?: any;

        
        editorOptions?: Object;

        
        encodeHtml?: boolean;

        
        falseText?: string;

        
        filterOperations?: Array<any>;

        
        filterValue?: any;

        
        filterValues?: Array<any>;

        
        filterType?: string;

        
        fixed?: boolean;

        
        hidingPriority?: number;

        
        fixedPosition?: string;

        
        format?: any;

        /** Specifies a custom template for the group cell of a grid column. */
        groupCellTemplate?: any;

        /** Specifies the index of a column when grid records are grouped by the values of this column. */
        groupIndex?: number;

        
        headerCellTemplate?: any;

        
        lookup?: {
            
            allowClearing?: boolean;

            
            dataSource?: any;

            
            displayExpr?: any;

            
            valueExpr?: string;
        };

        
        headerFilter?: {
            
            dataSource?: any;

            
            groupInterval?: any;
        };

        /**
     * Specifies a precision for formatted values displayed in a column.
     * @deprecated Use the format.precision option instead.
     */
        precision?: number;

        
        selectedFilterOperation?: string;

        
        showEditorAlways?: boolean;

        /** Specifies whether or not to display the column when grid records are grouped by it. */
        showWhenGrouped?: boolean;

        
        sortIndex?: number;

        
        sortOrder?: string;

        
        trueText?: string;

        
        visible?: boolean;

        
        visibleIndex?: number;

        
        width?: any;

        
        validationRules?: Array<Object>;

        
        showInColumnChooser?: boolean;

        
        name?: string;

        
        formItem?: DevExpress.ui.dxFormItem;

        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;

        
        ownerBand?: number;

        
        isBand?: boolean;
    }

    export interface dxDataGridOptions extends WidgetOptions {
        

        
        showBorders?: boolean;
        
        errorRowEnabled?: boolean;

        
        onRowValidating?: (e: Object) => void;

        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: (e: Object) => void;

        
        onToolbarPreparing?: (e: Object) => void;

        
        onInitNewRow?: (e: { data: Object }) => void;

        
        onRowInserted?: (e: { data: Object; key: any }) => void;

        
        onRowInserting?: (e: { data: Object; cancel: any }) => void;

        
        onRowRemoved?: (e: { data: Object; key: any }) => void;

        
        onRowRemoving?: (e: { data: Object; key: any; cancel: any }) => void;

        
        onRowUpdated?: (e: { data: Object; key: any }) => void;

        
        onRowUpdating?: (e: { oldData: Object; newData: Object; key: any; cancel: any }) => void;

        
        cellHintEnabled?: boolean;

        
        columnHidingEnabled?: boolean;

        
        allowColumnReordering?: boolean;

        
        allowColumnResizing?: boolean;

        /** A handler for the cellClick event. */
        onCellClick?: any;

        /** A handler for the cellHoverChanged event. */
        onCellHoverChanged?: (e: Object) => void;

        /** A handler for the cellPrepared event. */
        onCellPrepared?: (e: Object) => void;

        
        onAdaptiveDetailRowPreparing?: (e: Object) => void;

        
        columnAutoWidth?: boolean;

        
        columnChooser?: {
            
            emptyPanelText?: string;

            
            enabled?: boolean;

            
            mode?: string;

            
            height?: number;

            
            title?: string;

            
            width?: number;
        };

        
        columnFixing?: {
            
            enabled?: boolean;

            
            texts?: {
                
                fix?: string;

                
                unfix?: string;

                
                leftPosition?: string;

                
                rightPosition?: string;
            };
        };

        
        headerFilter?: {
            
            visible?: boolean;

            
            height?: number;

            
            width?: number;

            
            texts?: {
                
                emptyValue?: string;

                
                ok?: string;

                
                cancel?: string;
            }
        };

        /** An array of grid columns. */
        columns?: Array<dxDataGridColumn>;

        
        onContentReady?: Function;

        /** Specifies a function that customizes grid columns after they are created. */
        customizeColumns?: (columns: Array<dxDataGridColumn>) => void;

        /** Customizes grid columns and data before exporting. */
        customizeExportData?: (columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRow>) => void;

        
        dataSource?: any;

        
        cacheEnabled?: boolean;

        /** A handler for the editingStart event. */
        onEditingStart?: (e: {
            data: Object;
            key: any;
            cancel: boolean;
            column: dxDataGridColumn
        }) => void;

        /** A handler for the editorPrepared event. */
        onEditorPrepared?: (e: Object) => void;

        /** A handler for the editorPreparing event. */
        onEditorPreparing?: (e: Object) => void;

        /** Configures editing. */
        editing?: {
            
            editMode?: string;

            
            editEnabled?: boolean;

            
            insertEnabled?: boolean;

            
            removeEnabled?: boolean;

            
            mode?: string;

            
            allowUpdating?: boolean;

            
            allowAdding?: boolean;

            
            allowDeleting?: boolean;

            
            form?: DevExpress.ui.dxFormOptions;

            /** Contains options that specify texts for editing-related UI elements. */
            texts?: {
                
                saveAllChanges?: string;

                
                cancelRowChanges?: string;

                
                cancelAllChanges?: string;

                
                confirmDeleteMessage?: string;

                
                confirmDeleteTitle?: string;

                
                validationCancelChanges?: string;

                
                deleteRow?: string;

                
                addRow?: string;

                
                editRow?: string;

                
                saveRowChanges?: string;

                
                undeleteRow?: string;
            };
        };

        
        filterRow?: {

            
            applyFilter?: string;

            
            applyFilterText?: string;

            
            operationDescriptions?: {
                
                equal?: string;
                
                notEqual?: string;
                
                lessThan?: string;
                
                lessThanOrEqual?: string;
                
                greaterThan?: string;
                
                greaterThanOrEqual?: string;
                
                startsWith?: string;
                
                contains?: string;
                
                notContains?: string;
                
                endsWith?: string;
                
                between?: string;
            };

            
            resetOperationText?: string;

            
            showAllText?: string;

            
            betweenStartText?: string;

            
            betweenEndText?: string;

            
            showOperationChooser?: boolean;

            
            visible?: boolean;
        };

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

        
        loadPanel?: {
            
            enabled?: any;

            
            height?: number;

            
            indicatorSrc?: string;

            
            showIndicator?: boolean;

            
            showPane?: boolean;

            
            text?: string;

            
            width?: number;
        };

        
        noDataText?: string;

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

        
        rowAlternationEnabled?: boolean;

        
        twoWayBindingEnabled?: boolean;

        /** A handler for the rowClick event. */
        onRowClick?: any;

        /** A handler for the rowPrepared event. */
        onRowPrepared?: (e: Object) => void;

        /** Specifies a custom template for grid rows. */
        rowTemplate?: any;

        /** Configures scrolling. */
        scrolling?: {
            /** Specifies the scrolling mode. */
            mode?: string;

            
            preloadEnabled?: boolean;

            
            useNative?: any;

            
            showScrollbar?: string;

            
            scrollByContent?: boolean;

            
            scrollByThumb?: boolean;
        };

        
        searchPanel?: {
            
            highlightSearchText?: boolean;

            
            highlightCaseSensitive?: boolean;

            
            placeholder?: string;

            
            visible?: boolean;

            
            searchVisibleColumnsOnly?: boolean;

            
            width?: number;

            
            text?: string;
        };

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

        
        selectedRowKeys?: Array<any>;

        /** Specifies filters for the rows that must be selected initially. Applies only if selection.deferred is true. */
        selectionFilter?: Object;

        /** Configures runtime selection. */
        selection?: {
            /** Specifies when to display check boxes in rows. Applies only if selection.mode is "multiple". */
            showCheckBoxesMode?: string;

            
            allowSelectAll?: boolean;

            
            mode?: string;

            
            maxFilterLengthInRequest?: number;

            /** Specifies the mode in which all the records are selected. Applies only if selection.allowSelectAll is true. */
            selectAllMode?: string;

            /** Makes selection deferred. */
            deferred?: boolean;
        };

        
        onDataErrorOccurred?: (e: { error: Error }) => void;

        
        onSelectionChanged?: (e: {
            currentSelectedRowKeys: Array<any>;
            currentDeselectedRowKeys: Array<any>;
            selectedRowKeys: Array<any>;
            selectedRowsData: Array<any>;
        }) => void;

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
        onExported?: (e: Object) => void;

        
        onKeyDown?: (e: Object) => void;

        
        onRowExpanding?: (e: Object) => void;

        
        onRowExpanded?: (e: Object) => void;

        
        onRowCollapsing?: (e: Object) => void;

        
        onRowCollapsed?: (e: Object) => void;


        
        showColumnHeaders?: boolean;

        
        showColumnLines?: boolean;

        
        showRowLines?: boolean;

        
        sorting?: {
            
            ascendingText?: string;

            
            clearText?: string;

            
            descendingText?: string;

            
            mode?: string;
        };

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

        
        wordWrapEnabled?: boolean;

        
        dateSerializationFormat?: string;
    }

    /** The DataGrid is a widget that represents data from a local or remote source in the form of a grid. This widget offers such basic features as sorting, grouping, filtering, as well as more advanced capabilities, like state storing, export to Excel, master-detail interface, and many others. */
    export class dxDataGrid extends Widget implements DataHelperMixin {
        constructor(element: JQuery, options?: dxDataGridOptions);
        constructor(element: Element, options?: dxDataGridOptions);

        

        /** Ungroups grid records. */
        clearGrouping(): void;

        
        clearSorting(): void;

        
        getCellElement(rowIndex: number, dataField: string): any;

        
        getCellElement(rowIndex: number, visibleColumnIndex: number): any;

        
        getRowElement(rowIndex: number): any;

        /** Returns the current state of the grid. */
        state(): Object;

        /** Sets the grid state. */
        state(state: Object): void;

        
        getRowIndexByKey(key: any): number;

        
        getKeyByRowIndex(rowIndex: number): any;

        /** Adds a new column to the widget. */
        addColumn(columnOptions: dxDataGridColumn): void;

        
        deleteColumn(id: any): void;

        
        beginCustomLoading(messageText: string): void;

        
        cancelEditData(): void;

        
        hasEditData(): boolean;

        
        clearFilter(): void;

        
        clearFilter(filterName: string): void;

        
        clearSelection(): void;

        
        closeEditCell(): void;

        /** Collapses groups or master rows in a grid. */
        collapseAll(groupIndex?: number): void;

        
        columnCount(): number;

        
        columnOption(id: any, optionName: string): any;

        
        columnOption(id: any, optionName: string, optionValue: any): void;

        
        columnOption(id: any): Object;

        
        columnOption(id: any, options: Object): void;

        /** Gets all visible columns. */
        getVisibleColumns(): Array<dxDataGridColumn>;

        /** Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns. */
        getVisibleColumns(headerLevel?: number): Array<dxDataGridColumn>;

        /** Gets currently rendered rows. */
        getVisibleRows(): Array<dxDataGridRow>;

        
        editCell(rowIndex: number, visibleColumnIndex: number): void;

        
        editCell(rowIndex: number, dataField: string): void;

        
        editRow(rowIndex: number): void;

        
        cellValue(rowIndex: number, dataField: string): any;

        
        cellValue(rowIndex: number, visibleColumnIndex: number): any;

        
        cellValue(rowIndex: number, dataField: string, value: any): void;

        
        cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;

        
        endCustomLoading(): void;

        /** Expands groups or master rows in a grid. */
        expandAll(groupIndex: number): void;

        /** Checks whether a specific group or master row is expanded or collapsed. */
        isRowExpanded(key: any): boolean;

        /** Allows you to expand a specific group or master row by its key. */
        expandRow(key: any): void;

        /** Allows you to collapse a specific group or master row by its key. */
        collapseRow(key: any): void;

        
        isAdaptiveDetailRowExpanded(key: any): void;

        
        expandAdaptiveDetailRow(key: any): void;

        
        collapseAdaptiveDetailRow(): void;

        
        filter(filterExpr?: any): void;

        
        filter(): any;

        
        getCombinedFilter(): any;

        
        getCombinedFilter(returnDataField?: boolean): any;

        /** Gets the keys of the currently selected rows. */
        getSelectedRowKeys(): any;

        /** Gets data objects of currently selected rows. */
        getSelectedRowsData(): any;

        
        hideColumnChooser(): void;

        /** Adds an empty data row. */
        addRow(): void;

        /**
  * Adds a new data row to a grid.
  * @deprecated Use the addRow() method instead.
  */
        insertRow(): void;

        
        keyOf(obj: Object): any;

        /** Switches a grid to a specified page. */
        pageIndex(newIndex: number): void;

        /** Gets the index of the current page. */
        pageIndex(): number;

        /** Sets the page size. */
        pageSize(value: number): void;

        /** Gets the current page size. */
        pageSize(): number;

        
        refresh(): JQueryPromise<any>;

        
        deleteRow(rowIndex: number): void;

        /**
 * Removes a specific row from a grid.
 * @deprecated Use the deleteRow(rowIndex) method instead.
 */
        removeRow(rowIndex: number): void;

        
        saveEditData(): JQueryPromise<any>;

        
        searchByText(text: string): void;

        
        selectAll(): JQueryPromise<any>;

        
        deselectAll(): JQueryPromise<any>;

        
        selectRows(keys: Array<any>, preserve: boolean): JQueryPromise<any>;

        
        deselectRows(keys: Array<any>): JQueryPromise<any>;

        
        selectRowsByIndexes(indexes: Array<any>): JQueryPromise<any>;

        
        /** Checks whether the row that represents a specific data object is selected. Takes effect only if selection.deferred is true. */
        isRowSelected(arg: any): boolean;

        
        showColumnChooser(): void;

        
        startSelectionWithCheckboxes(): boolean;

        /** Returns how many pages the grid contains. */
        pageCount(): number;

        /** Returns the number of records currently held by a grid. */
        totalCount(): number;

        
        undeleteRow(rowIndex: number): void;

        
        byKey(key: any): JQueryPromise<any>;

        /** Gets the value of a total summary item. */
        getTotalSummaryValue(summaryItemName: string): any;

        /** Exports grid data to Excel. */
        exportToExcel(selectionOnly: boolean): void;

        
        updateDimensions(): void;

        
        focus(element?: JQuery): void;

        getDataSource(): DevExpress.data.DataSource;

        
        getScrollable(): dxScrollable;

        
        repaintRows(rowIndexes: Array<number>): void;
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
        onContextMenuPreparing?: (e: Object) => void;

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
        onExported?: (e: Object) => void;

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

        /** Specifies the field chooser layout. */
        layout?: number;

        /** The data source of a PivotGrid widget. */
        dataSource?: DevExpress.data.PivotGridDataSource;

        
        onContentReady?: Function;

        /** A handler for the contextMenuPreparing event. */
        onContextMenuPreparing?: (e: Object) => void;

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

}
