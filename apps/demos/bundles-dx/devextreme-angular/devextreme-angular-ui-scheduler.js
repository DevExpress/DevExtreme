System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/scheduler', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxScheduler, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiResourceComponent, DxiViewComponent, DxoAppointmentDraggingModule, DxoEditingModule, DxiResourceModule, DxoScrollingModule, DxiViewModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxScheduler = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiResourceComponent = module.DxiResourceComponent;
            DxiViewComponent = module.DxiViewComponent;
            DxoAppointmentDraggingModule = module.DxoAppointmentDraggingModule;
            DxoEditingModule = module.DxoEditingModule;
            DxiResourceModule = module.DxiResourceModule;
            DxoScrollingModule = module.DxoScrollingModule;
            DxiViewModule = module.DxiViewModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The Scheduler is a UI component that represents scheduled data and allows a user to manage and edit it.

             */
            class DxSchedulerComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component adapts to small screens.
                
                 */
                get adaptivityEnabled() {
                    return this._getOption('adaptivityEnabled');
                }
                set adaptivityEnabled(value) {
                    this._setOption('adaptivityEnabled', value);
                }
                /**
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding appointment is an all-day appointment.
                
                 */
                get allDayExpr() {
                    return this._getOption('allDayExpr');
                }
                set allDayExpr(value) {
                    this._setOption('allDayExpr', value);
                }
                /**
                 * Specifies the display mode for the All day panel.
                
                 */
                get allDayPanelMode() {
                    return this._getOption('allDayPanelMode');
                }
                set allDayPanelMode(value) {
                    this._setOption('allDayPanelMode', value);
                }
                /**
                 * Specifies a custom template for cell overflow indicators.
                
                 */
                get appointmentCollectorTemplate() {
                    return this._getOption('appointmentCollectorTemplate');
                }
                set appointmentCollectorTemplate(value) {
                    this._setOption('appointmentCollectorTemplate', value);
                }
                /**
                 * Configures appointment reordering using drag and drop gestures.
                
                 */
                get appointmentDragging() {
                    return this._getOption('appointmentDragging');
                }
                set appointmentDragging(value) {
                    this._setOption('appointmentDragging', value);
                }
                /**
                 * Specifies a custom template for appointments.
                
                 */
                get appointmentTemplate() {
                    return this._getOption('appointmentTemplate');
                }
                set appointmentTemplate(value) {
                    this._setOption('appointmentTemplate', value);
                }
                /**
                 * Specifies a custom template for tooltips displayed when users click an appointment or cell overflow indicator.
                
                 */
                get appointmentTooltipTemplate() {
                    return this._getOption('appointmentTooltipTemplate');
                }
                set appointmentTooltipTemplate(value) {
                    this._setOption('appointmentTooltipTemplate', value);
                }
                /**
                 * Specifies cell duration in minutes. This property&apos;s value should divide the interval between startDayHour and endDayHour into even parts.
                
                 */
                get cellDuration() {
                    return this._getOption('cellDuration');
                }
                set cellDuration(value) {
                    this._setOption('cellDuration', value);
                }
                /**
                 * Specifies whether or not an end user can scroll the view in both directions at the same time.
                
                 */
                get crossScrollingEnabled() {
                    return this._getOption('crossScrollingEnabled');
                }
                set crossScrollingEnabled(value) {
                    this._setOption('crossScrollingEnabled', value);
                }
                /**
                 * Specifies the current date.
                
                 */
                get currentDate() {
                    return this._getOption('currentDate');
                }
                set currentDate(value) {
                    this._setOption('currentDate', value);
                }
                /**
                 * Specifies the displayed view. Accepts name or type of a view available in the views array.
                
                 */
                get currentView() {
                    return this._getOption('currentView');
                }
                set currentView(value) {
                    this._setOption('currentView', value);
                }
                /**
                 * Customizes the date navigator&apos;s text.
                
                 */
                get customizeDateNavigatorText() {
                    return this._getOption('customizeDateNavigatorText');
                }
                set customizeDateNavigatorText(value) {
                    this._setOption('customizeDateNavigatorText', value);
                }
                /**
                 * Specifies a custom template for table cells.
                
                 */
                get dataCellTemplate() {
                    return this._getOption('dataCellTemplate');
                }
                set dataCellTemplate(value) {
                    this._setOption('dataCellTemplate', value);
                }
                /**
                 * Binds the UI component to data.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
                }
                /**
                 * Specifies a custom template for day scale items.
                
                 */
                get dateCellTemplate() {
                    return this._getOption('dateCellTemplate');
                }
                set dateCellTemplate(value) {
                    this._setOption('dateCellTemplate', value);
                }
                /**
                 * Specifies the format in which date-time values should be sent to the server.
                
                 */
                get dateSerializationFormat() {
                    return this._getOption('dateSerializationFormat');
                }
                set dateSerializationFormat(value) {
                    this._setOption('dateSerializationFormat', value);
                }
                /**
                 * Specifies the name of the data source item field whose value holds the description of the corresponding appointment.
                
                 */
                get descriptionExpr() {
                    return this._getOption('descriptionExpr');
                }
                set descriptionExpr(value) {
                    this._setOption('descriptionExpr', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies a custom template for tooltips displayed when users click a cell overflow indicator.
                
                 * @deprecated Use the appointmentTooltipTemplate option instead.
                
                 */
                get dropDownAppointmentTemplate() {
                    return this._getOption('dropDownAppointmentTemplate');
                }
                set dropDownAppointmentTemplate(value) {
                    this._setOption('dropDownAppointmentTemplate', value);
                }
                /**
                 * Specifies which editing operations a user can perform on appointments.
                
                 */
                get editing() {
                    return this._getOption('editing');
                }
                set editing(value) {
                    this._setOption('editing', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies the name of the data source item field that defines the ending of an appointment.
                
                 */
                get endDateExpr() {
                    return this._getOption('endDateExpr');
                }
                set endDateExpr(value) {
                    this._setOption('endDateExpr', value);
                }
                /**
                 * Specifies the name of the data source item field that defines the timezone of the appointment end date.
                
                 */
                get endDateTimeZoneExpr() {
                    return this._getOption('endDateTimeZoneExpr');
                }
                set endDateTimeZoneExpr(value) {
                    this._setOption('endDateTimeZoneExpr', value);
                }
                /**
                 * Specifies the last hour on the time scale. Accepts integer values from 0 to 24.
                
                 */
                get endDayHour() {
                    return this._getOption('endDayHour');
                }
                set endDayHour(value) {
                    this._setOption('endDayHour', value);
                }
                /**
                 * Specifies the first day of a week. Does not apply to the agenda view.
                
                 */
                get firstDayOfWeek() {
                    return this._getOption('firstDayOfWeek');
                }
                set firstDayOfWeek(value) {
                    this._setOption('firstDayOfWeek', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * If true, appointments are grouped by date first and then by resource; opposite if false. Applies only if appointments are grouped and groupOrientation is &apos;horizontal&apos;.
                
                 */
                get groupByDate() {
                    return this._getOption('groupByDate');
                }
                set groupByDate(value) {
                    this._setOption('groupByDate', value);
                }
                /**
                 * Specifies the resource kinds by which the scheduler&apos;s appointments are grouped in a timetable.
                
                 */
                get groups() {
                    return this._getOption('groups');
                }
                set groups(value) {
                    this._setOption('groups', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies the time interval between when the date-time indicator changes its position, in milliseconds.
                
                 */
                get indicatorUpdateInterval() {
                    return this._getOption('indicatorUpdateInterval');
                }
                set indicatorUpdateInterval(value) {
                    this._setOption('indicatorUpdateInterval', value);
                }
                /**
                 * The latest date the UI component allows you to select.
                
                 */
                get max() {
                    return this._getOption('max');
                }
                set max(value) {
                    this._setOption('max', value);
                }
                /**
                 * Specifies the limit of full-sized appointments displayed per cell. Applies to all views except &apos;agenda&apos;.
                
                 */
                get maxAppointmentsPerCell() {
                    return this._getOption('maxAppointmentsPerCell');
                }
                set maxAppointmentsPerCell(value) {
                    this._setOption('maxAppointmentsPerCell', value);
                }
                /**
                 * The earliest date the UI component allows you to select.
                
                 */
                get min() {
                    return this._getOption('min');
                }
                set min(value) {
                    this._setOption('min', value);
                }
                /**
                 * Specifies the text or HTML markup displayed by the UI component if the item collection is empty. Available for the Agenda view only.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Specifies the minute offset within Scheduler indicating the starting point of a day.
                
                 */
                get offset() {
                    return this._getOption('offset');
                }
                set offset(value) {
                    this._setOption('offset', value);
                }
                /**
                 * Specifies the edit mode for recurring appointments.
                
                 */
                get recurrenceEditMode() {
                    return this._getOption('recurrenceEditMode');
                }
                set recurrenceEditMode(value) {
                    this._setOption('recurrenceEditMode', value);
                }
                /**
                 * Specifies the name of the data source item field that defines exceptions for the current recurring appointment.
                
                 */
                get recurrenceExceptionExpr() {
                    return this._getOption('recurrenceExceptionExpr');
                }
                set recurrenceExceptionExpr(value) {
                    this._setOption('recurrenceExceptionExpr', value);
                }
                /**
                 * Specifies the name of the data source item field that defines a recurrence rule for generating recurring appointments.
                
                 */
                get recurrenceRuleExpr() {
                    return this._getOption('recurrenceRuleExpr');
                }
                set recurrenceRuleExpr(value) {
                    this._setOption('recurrenceRuleExpr', value);
                }
                /**
                 * Specifies whether filtering is performed on the server or client side.
                
                 */
                get remoteFiltering() {
                    return this._getOption('remoteFiltering');
                }
                set remoteFiltering(value) {
                    this._setOption('remoteFiltering', value);
                }
                /**
                 * Specifies a custom template for resource headers.
                
                 */
                get resourceCellTemplate() {
                    return this._getOption('resourceCellTemplate');
                }
                set resourceCellTemplate(value) {
                    this._setOption('resourceCellTemplate', value);
                }
                /**
                 * Specifies an array of resources available in the scheduler.
                
                 */
                get resources() {
                    return this._getOption('resources');
                }
                set resources(value) {
                    this._setOption('resources', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Configures scrolling.
                
                 */
                get scrolling() {
                    return this._getOption('scrolling');
                }
                set scrolling(value) {
                    this._setOption('scrolling', value);
                }
                /**
                 * The data of the currently selected cells.
                
                 */
                get selectedCellData() {
                    return this._getOption('selectedCellData');
                }
                set selectedCellData(value) {
                    this._setOption('selectedCellData', value);
                }
                /**
                 * Specifies whether to apply shading to cover the timetable up to the current time.
                
                 */
                get shadeUntilCurrentTime() {
                    return this._getOption('shadeUntilCurrentTime');
                }
                set shadeUntilCurrentTime(value) {
                    this._setOption('shadeUntilCurrentTime', value);
                }
                /**
                 * Specifies the &apos;All-day&apos; panel&apos;s visibility. Setting this property to false hides the panel along with the all-day appointments.
                
                 */
                get showAllDayPanel() {
                    return this._getOption('showAllDayPanel');
                }
                set showAllDayPanel(value) {
                    this._setOption('showAllDayPanel', value);
                }
                /**
                 * Specifies the current date-time indicator&apos;s visibility.
                
                 */
                get showCurrentTimeIndicator() {
                    return this._getOption('showCurrentTimeIndicator');
                }
                set showCurrentTimeIndicator(value) {
                    this._setOption('showCurrentTimeIndicator', value);
                }
                /**
                 * Specifies the name of the data source item field that defines the start of an appointment.
                
                 */
                get startDateExpr() {
                    return this._getOption('startDateExpr');
                }
                set startDateExpr(value) {
                    this._setOption('startDateExpr', value);
                }
                /**
                 * Specifies the name of the data source item field that defines the timezone of the appointment start date.
                
                 */
                get startDateTimeZoneExpr() {
                    return this._getOption('startDateTimeZoneExpr');
                }
                set startDateTimeZoneExpr(value) {
                    this._setOption('startDateTimeZoneExpr', value);
                }
                /**
                 * Specifies the first hour on the time scale. Accepts integer values from 0 to 24.
                
                 */
                get startDayHour() {
                    return this._getOption('startDayHour');
                }
                set startDayHour(value) {
                    this._setOption('startDayHour', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Specifies the name of the data source item field that holds the subject of an appointment.
                
                 */
                get textExpr() {
                    return this._getOption('textExpr');
                }
                set textExpr(value) {
                    this._setOption('textExpr', value);
                }
                /**
                 * Specifies a custom template for time scale items.
                
                 */
                get timeCellTemplate() {
                    return this._getOption('timeCellTemplate');
                }
                set timeCellTemplate(value) {
                    this._setOption('timeCellTemplate', value);
                }
                /**
                 * Specifies the time zone for the Scheduler&apos;s grid. Accepts values from the IANA time zone database.
                
                 */
                get timeZone() {
                    return this._getOption('timeZone');
                }
                set timeZone(value) {
                    this._setOption('timeZone', value);
                }
                /**
                 * Specifies whether a user can switch views using tabs or a drop-down menu.
                
                 */
                get useDropDownViewSwitcher() {
                    return this._getOption('useDropDownViewSwitcher');
                }
                set useDropDownViewSwitcher(value) {
                    this._setOption('useDropDownViewSwitcher', value);
                }
                /**
                 * Specifies and configures the views to be available in the view switcher.
                
                 */
                get views() {
                    return this._getOption('views');
                }
                set views(value) {
                    this._setOption('views', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that is executed after an appointment is added to the data source.
                
                
                 */
                onAppointmentAdded;
                /**
                
                 * A function that is executed before an appointment is added to the data source.
                
                
                 */
                onAppointmentAdding;
                /**
                
                 * A function that is executed when an appointment is clicked or tapped.
                
                
                 */
                onAppointmentClick;
                /**
                
                 * A function that is executed when a user attempts to open the browser&apos;s context menu for an appointment. Allows you to replace this context menu with a custom context menu.
                
                
                 */
                onAppointmentContextMenu;
                /**
                
                 * A function that is executed when an appointment is double-clicked or double-tapped.
                
                
                 */
                onAppointmentDblClick;
                /**
                
                 * A function that is executed after an appointment is deleted from the data source.
                
                
                 */
                onAppointmentDeleted;
                /**
                
                 * A function that is executed before an appointment is deleted from the data source.
                
                
                 */
                onAppointmentDeleting;
                /**
                
                 * A function that is executed before an appointment details form appears. Use this function to customize the form.
                
                
                 */
                onAppointmentFormOpening;
                /**
                
                 * A function that is executed when an appointment is rendered.
                
                
                 */
                onAppointmentRendered;
                /**
                
                 * Occurs before showing an appointment&apos;s tooltip.
                
                
                 */
                onAppointmentTooltipShowing;
                /**
                
                 * A function that is executed after an appointment is updated in the data source.
                
                
                 */
                onAppointmentUpdated;
                /**
                
                 * A function that is executed before an appointment is updated in the data source.
                
                
                 */
                onAppointmentUpdating;
                /**
                
                 * A function that is executed when a view cell is clicked.
                
                
                 */
                onCellClick;
                /**
                
                 * A function that is executed when a user attempts to open the browser&apos;s context menu for a cell. Allows you to replace this context menu with a custom context menu.
                
                
                 */
                onCellContextMenu;
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                adaptivityEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allDayExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allDayPanelModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                appointmentCollectorTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                appointmentDraggingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                appointmentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                appointmentTooltipTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cellDurationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                crossScrollingEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                currentDateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                currentViewChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeDateNavigatorTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataCellTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dateCellTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dateSerializationFormatChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                descriptionExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownAppointmentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                editingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateTimeZoneExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDayHourChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                firstDayOfWeekChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupByDateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                indicatorUpdateIntervalChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxAppointmentsPerCellChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                offsetChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                recurrenceEditModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                recurrenceExceptionExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                recurrenceRuleExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                remoteFilteringChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resourceCellTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                resourcesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedCellDataChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                shadeUntilCurrentTimeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showAllDayPanelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showCurrentTimeIndicatorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateTimeZoneExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDayHourChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                textExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                timeCellTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                timeZoneChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useDropDownViewSwitcherChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                viewsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                get resourcesChildren() {
                    return this._getOption('resources');
                }
                set resourcesChildren(value) {
                    this.setChildren('resources', value);
                }
                get viewsChildren() {
                    return this._getOption('views');
                }
                set viewsChildren(value) {
                    this.setChildren('views', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'appointmentAdded', emit: 'onAppointmentAdded' },
                        { subscribe: 'appointmentAdding', emit: 'onAppointmentAdding' },
                        { subscribe: 'appointmentClick', emit: 'onAppointmentClick' },
                        { subscribe: 'appointmentContextMenu', emit: 'onAppointmentContextMenu' },
                        { subscribe: 'appointmentDblClick', emit: 'onAppointmentDblClick' },
                        { subscribe: 'appointmentDeleted', emit: 'onAppointmentDeleted' },
                        { subscribe: 'appointmentDeleting', emit: 'onAppointmentDeleting' },
                        { subscribe: 'appointmentFormOpening', emit: 'onAppointmentFormOpening' },
                        { subscribe: 'appointmentRendered', emit: 'onAppointmentRendered' },
                        { subscribe: 'appointmentTooltipShowing', emit: 'onAppointmentTooltipShowing' },
                        { subscribe: 'appointmentUpdated', emit: 'onAppointmentUpdated' },
                        { subscribe: 'appointmentUpdating', emit: 'onAppointmentUpdating' },
                        { subscribe: 'cellClick', emit: 'onCellClick' },
                        { subscribe: 'cellContextMenu', emit: 'onCellContextMenu' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'adaptivityEnabledChange' },
                        { emit: 'allDayExprChange' },
                        { emit: 'allDayPanelModeChange' },
                        { emit: 'appointmentCollectorTemplateChange' },
                        { emit: 'appointmentDraggingChange' },
                        { emit: 'appointmentTemplateChange' },
                        { emit: 'appointmentTooltipTemplateChange' },
                        { emit: 'cellDurationChange' },
                        { emit: 'crossScrollingEnabledChange' },
                        { emit: 'currentDateChange' },
                        { emit: 'currentViewChange' },
                        { emit: 'customizeDateNavigatorTextChange' },
                        { emit: 'dataCellTemplateChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'dateCellTemplateChange' },
                        { emit: 'dateSerializationFormatChange' },
                        { emit: 'descriptionExprChange' },
                        { emit: 'disabledChange' },
                        { emit: 'dropDownAppointmentTemplateChange' },
                        { emit: 'editingChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'endDateExprChange' },
                        { emit: 'endDateTimeZoneExprChange' },
                        { emit: 'endDayHourChange' },
                        { emit: 'firstDayOfWeekChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'groupByDateChange' },
                        { emit: 'groupsChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'indicatorUpdateIntervalChange' },
                        { emit: 'maxChange' },
                        { emit: 'maxAppointmentsPerCellChange' },
                        { emit: 'minChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'offsetChange' },
                        { emit: 'recurrenceEditModeChange' },
                        { emit: 'recurrenceExceptionExprChange' },
                        { emit: 'recurrenceRuleExprChange' },
                        { emit: 'remoteFilteringChange' },
                        { emit: 'resourceCellTemplateChange' },
                        { emit: 'resourcesChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollingChange' },
                        { emit: 'selectedCellDataChange' },
                        { emit: 'shadeUntilCurrentTimeChange' },
                        { emit: 'showAllDayPanelChange' },
                        { emit: 'showCurrentTimeIndicatorChange' },
                        { emit: 'startDateExprChange' },
                        { emit: 'startDateTimeZoneExprChange' },
                        { emit: 'startDayHourChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'textExprChange' },
                        { emit: 'timeCellTemplateChange' },
                        { emit: 'timeZoneChange' },
                        { emit: 'useDropDownViewSwitcherChange' },
                        { emit: 'viewsChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxScheduler(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('groups', changes);
                    this.setupChanges('resources', changes);
                    this.setupChanges('selectedCellData', changes);
                    this.setupChanges('views', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('groups');
                    this._idh.doCheck('resources');
                    this._idh.doCheck('selectedCellData');
                    this._idh.doCheck('views');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxSchedulerComponent, selector: "dx-scheduler", inputs: { accessKey: "accessKey", adaptivityEnabled: "adaptivityEnabled", allDayExpr: "allDayExpr", allDayPanelMode: "allDayPanelMode", appointmentCollectorTemplate: "appointmentCollectorTemplate", appointmentDragging: "appointmentDragging", appointmentTemplate: "appointmentTemplate", appointmentTooltipTemplate: "appointmentTooltipTemplate", cellDuration: "cellDuration", crossScrollingEnabled: "crossScrollingEnabled", currentDate: "currentDate", currentView: "currentView", customizeDateNavigatorText: "customizeDateNavigatorText", dataCellTemplate: "dataCellTemplate", dataSource: "dataSource", dateCellTemplate: "dateCellTemplate", dateSerializationFormat: "dateSerializationFormat", descriptionExpr: "descriptionExpr", disabled: "disabled", dropDownAppointmentTemplate: "dropDownAppointmentTemplate", editing: "editing", elementAttr: "elementAttr", endDateExpr: "endDateExpr", endDateTimeZoneExpr: "endDateTimeZoneExpr", endDayHour: "endDayHour", firstDayOfWeek: "firstDayOfWeek", focusStateEnabled: "focusStateEnabled", groupByDate: "groupByDate", groups: "groups", height: "height", hint: "hint", indicatorUpdateInterval: "indicatorUpdateInterval", max: "max", maxAppointmentsPerCell: "maxAppointmentsPerCell", min: "min", noDataText: "noDataText", offset: "offset", recurrenceEditMode: "recurrenceEditMode", recurrenceExceptionExpr: "recurrenceExceptionExpr", recurrenceRuleExpr: "recurrenceRuleExpr", remoteFiltering: "remoteFiltering", resourceCellTemplate: "resourceCellTemplate", resources: "resources", rtlEnabled: "rtlEnabled", scrolling: "scrolling", selectedCellData: "selectedCellData", shadeUntilCurrentTime: "shadeUntilCurrentTime", showAllDayPanel: "showAllDayPanel", showCurrentTimeIndicator: "showCurrentTimeIndicator", startDateExpr: "startDateExpr", startDateTimeZoneExpr: "startDateTimeZoneExpr", startDayHour: "startDayHour", tabIndex: "tabIndex", textExpr: "textExpr", timeCellTemplate: "timeCellTemplate", timeZone: "timeZone", useDropDownViewSwitcher: "useDropDownViewSwitcher", views: "views", visible: "visible", width: "width" }, outputs: { onAppointmentAdded: "onAppointmentAdded", onAppointmentAdding: "onAppointmentAdding", onAppointmentClick: "onAppointmentClick", onAppointmentContextMenu: "onAppointmentContextMenu", onAppointmentDblClick: "onAppointmentDblClick", onAppointmentDeleted: "onAppointmentDeleted", onAppointmentDeleting: "onAppointmentDeleting", onAppointmentFormOpening: "onAppointmentFormOpening", onAppointmentRendered: "onAppointmentRendered", onAppointmentTooltipShowing: "onAppointmentTooltipShowing", onAppointmentUpdated: "onAppointmentUpdated", onAppointmentUpdating: "onAppointmentUpdating", onCellClick: "onCellClick", onCellContextMenu: "onCellContextMenu", onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", accessKeyChange: "accessKeyChange", adaptivityEnabledChange: "adaptivityEnabledChange", allDayExprChange: "allDayExprChange", allDayPanelModeChange: "allDayPanelModeChange", appointmentCollectorTemplateChange: "appointmentCollectorTemplateChange", appointmentDraggingChange: "appointmentDraggingChange", appointmentTemplateChange: "appointmentTemplateChange", appointmentTooltipTemplateChange: "appointmentTooltipTemplateChange", cellDurationChange: "cellDurationChange", crossScrollingEnabledChange: "crossScrollingEnabledChange", currentDateChange: "currentDateChange", currentViewChange: "currentViewChange", customizeDateNavigatorTextChange: "customizeDateNavigatorTextChange", dataCellTemplateChange: "dataCellTemplateChange", dataSourceChange: "dataSourceChange", dateCellTemplateChange: "dateCellTemplateChange", dateSerializationFormatChange: "dateSerializationFormatChange", descriptionExprChange: "descriptionExprChange", disabledChange: "disabledChange", dropDownAppointmentTemplateChange: "dropDownAppointmentTemplateChange", editingChange: "editingChange", elementAttrChange: "elementAttrChange", endDateExprChange: "endDateExprChange", endDateTimeZoneExprChange: "endDateTimeZoneExprChange", endDayHourChange: "endDayHourChange", firstDayOfWeekChange: "firstDayOfWeekChange", focusStateEnabledChange: "focusStateEnabledChange", groupByDateChange: "groupByDateChange", groupsChange: "groupsChange", heightChange: "heightChange", hintChange: "hintChange", indicatorUpdateIntervalChange: "indicatorUpdateIntervalChange", maxChange: "maxChange", maxAppointmentsPerCellChange: "maxAppointmentsPerCellChange", minChange: "minChange", noDataTextChange: "noDataTextChange", offsetChange: "offsetChange", recurrenceEditModeChange: "recurrenceEditModeChange", recurrenceExceptionExprChange: "recurrenceExceptionExprChange", recurrenceRuleExprChange: "recurrenceRuleExprChange", remoteFilteringChange: "remoteFilteringChange", resourceCellTemplateChange: "resourceCellTemplateChange", resourcesChange: "resourcesChange", rtlEnabledChange: "rtlEnabledChange", scrollingChange: "scrollingChange", selectedCellDataChange: "selectedCellDataChange", shadeUntilCurrentTimeChange: "shadeUntilCurrentTimeChange", showAllDayPanelChange: "showAllDayPanelChange", showCurrentTimeIndicatorChange: "showCurrentTimeIndicatorChange", startDateExprChange: "startDateExprChange", startDateTimeZoneExprChange: "startDateTimeZoneExprChange", startDayHourChange: "startDayHourChange", tabIndexChange: "tabIndexChange", textExprChange: "textExprChange", timeCellTemplateChange: "timeCellTemplateChange", timeZoneChange: "timeZoneChange", useDropDownViewSwitcherChange: "useDropDownViewSwitcherChange", viewsChange: "viewsChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "resourcesChildren", predicate: DxiResourceComponent }, { propertyName: "viewsChildren", predicate: DxiViewComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxSchedulerComponent", DxSchedulerComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-scheduler',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], adaptivityEnabled: [{
                            type: Input
                        }], allDayExpr: [{
                            type: Input
                        }], allDayPanelMode: [{
                            type: Input
                        }], appointmentCollectorTemplate: [{
                            type: Input
                        }], appointmentDragging: [{
                            type: Input
                        }], appointmentTemplate: [{
                            type: Input
                        }], appointmentTooltipTemplate: [{
                            type: Input
                        }], cellDuration: [{
                            type: Input
                        }], crossScrollingEnabled: [{
                            type: Input
                        }], currentDate: [{
                            type: Input
                        }], currentView: [{
                            type: Input
                        }], customizeDateNavigatorText: [{
                            type: Input
                        }], dataCellTemplate: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], dateCellTemplate: [{
                            type: Input
                        }], dateSerializationFormat: [{
                            type: Input
                        }], descriptionExpr: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], dropDownAppointmentTemplate: [{
                            type: Input
                        }], editing: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], endDateExpr: [{
                            type: Input
                        }], endDateTimeZoneExpr: [{
                            type: Input
                        }], endDayHour: [{
                            type: Input
                        }], firstDayOfWeek: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], groupByDate: [{
                            type: Input
                        }], groups: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], indicatorUpdateInterval: [{
                            type: Input
                        }], max: [{
                            type: Input
                        }], maxAppointmentsPerCell: [{
                            type: Input
                        }], min: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], offset: [{
                            type: Input
                        }], recurrenceEditMode: [{
                            type: Input
                        }], recurrenceExceptionExpr: [{
                            type: Input
                        }], recurrenceRuleExpr: [{
                            type: Input
                        }], remoteFiltering: [{
                            type: Input
                        }], resourceCellTemplate: [{
                            type: Input
                        }], resources: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrolling: [{
                            type: Input
                        }], selectedCellData: [{
                            type: Input
                        }], shadeUntilCurrentTime: [{
                            type: Input
                        }], showAllDayPanel: [{
                            type: Input
                        }], showCurrentTimeIndicator: [{
                            type: Input
                        }], startDateExpr: [{
                            type: Input
                        }], startDateTimeZoneExpr: [{
                            type: Input
                        }], startDayHour: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], textExpr: [{
                            type: Input
                        }], timeCellTemplate: [{
                            type: Input
                        }], timeZone: [{
                            type: Input
                        }], useDropDownViewSwitcher: [{
                            type: Input
                        }], views: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onAppointmentAdded: [{
                            type: Output
                        }], onAppointmentAdding: [{
                            type: Output
                        }], onAppointmentClick: [{
                            type: Output
                        }], onAppointmentContextMenu: [{
                            type: Output
                        }], onAppointmentDblClick: [{
                            type: Output
                        }], onAppointmentDeleted: [{
                            type: Output
                        }], onAppointmentDeleting: [{
                            type: Output
                        }], onAppointmentFormOpening: [{
                            type: Output
                        }], onAppointmentRendered: [{
                            type: Output
                        }], onAppointmentTooltipShowing: [{
                            type: Output
                        }], onAppointmentUpdated: [{
                            type: Output
                        }], onAppointmentUpdating: [{
                            type: Output
                        }], onCellClick: [{
                            type: Output
                        }], onCellContextMenu: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], adaptivityEnabledChange: [{
                            type: Output
                        }], allDayExprChange: [{
                            type: Output
                        }], allDayPanelModeChange: [{
                            type: Output
                        }], appointmentCollectorTemplateChange: [{
                            type: Output
                        }], appointmentDraggingChange: [{
                            type: Output
                        }], appointmentTemplateChange: [{
                            type: Output
                        }], appointmentTooltipTemplateChange: [{
                            type: Output
                        }], cellDurationChange: [{
                            type: Output
                        }], crossScrollingEnabledChange: [{
                            type: Output
                        }], currentDateChange: [{
                            type: Output
                        }], currentViewChange: [{
                            type: Output
                        }], customizeDateNavigatorTextChange: [{
                            type: Output
                        }], dataCellTemplateChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], dateCellTemplateChange: [{
                            type: Output
                        }], dateSerializationFormatChange: [{
                            type: Output
                        }], descriptionExprChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], dropDownAppointmentTemplateChange: [{
                            type: Output
                        }], editingChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], endDateExprChange: [{
                            type: Output
                        }], endDateTimeZoneExprChange: [{
                            type: Output
                        }], endDayHourChange: [{
                            type: Output
                        }], firstDayOfWeekChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], groupByDateChange: [{
                            type: Output
                        }], groupsChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], indicatorUpdateIntervalChange: [{
                            type: Output
                        }], maxChange: [{
                            type: Output
                        }], maxAppointmentsPerCellChange: [{
                            type: Output
                        }], minChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], offsetChange: [{
                            type: Output
                        }], recurrenceEditModeChange: [{
                            type: Output
                        }], recurrenceExceptionExprChange: [{
                            type: Output
                        }], recurrenceRuleExprChange: [{
                            type: Output
                        }], remoteFilteringChange: [{
                            type: Output
                        }], resourceCellTemplateChange: [{
                            type: Output
                        }], resourcesChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollingChange: [{
                            type: Output
                        }], selectedCellDataChange: [{
                            type: Output
                        }], shadeUntilCurrentTimeChange: [{
                            type: Output
                        }], showAllDayPanelChange: [{
                            type: Output
                        }], showCurrentTimeIndicatorChange: [{
                            type: Output
                        }], startDateExprChange: [{
                            type: Output
                        }], startDateTimeZoneExprChange: [{
                            type: Output
                        }], startDayHourChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], textExprChange: [{
                            type: Output
                        }], timeCellTemplateChange: [{
                            type: Output
                        }], timeZoneChange: [{
                            type: Output
                        }], useDropDownViewSwitcherChange: [{
                            type: Output
                        }], viewsChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], resourcesChildren: [{
                            type: ContentChildren,
                            args: [DxiResourceComponent]
                        }], viewsChildren: [{
                            type: ContentChildren,
                            args: [DxiViewComponent]
                        }] } });
            class DxSchedulerModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerModule, declarations: [DxSchedulerComponent], imports: [DxoAppointmentDraggingModule,
                        DxoEditingModule,
                        DxiResourceModule,
                        DxoScrollingModule,
                        DxiViewModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxSchedulerComponent, DxoAppointmentDraggingModule,
                        DxoEditingModule,
                        DxiResourceModule,
                        DxoScrollingModule,
                        DxiViewModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerModule, imports: [DxoAppointmentDraggingModule,
                        DxoEditingModule,
                        DxiResourceModule,
                        DxoScrollingModule,
                        DxiViewModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAppointmentDraggingModule,
                        DxoEditingModule,
                        DxiResourceModule,
                        DxoScrollingModule,
                        DxiViewModule,
                        DxTemplateModule] });
            } exports("DxSchedulerModule", DxSchedulerModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSchedulerModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAppointmentDraggingModule,
                                    DxoEditingModule,
                                    DxiResourceModule,
                                    DxoScrollingModule,
                                    DxiViewModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxSchedulerComponent
                                ],
                                exports: [
                                    DxSchedulerComponent,
                                    DxoAppointmentDraggingModule,
                                    DxoEditingModule,
                                    DxiResourceModule,
                                    DxoScrollingModule,
                                    DxiViewModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
