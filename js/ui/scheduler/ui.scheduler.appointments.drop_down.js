var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    translator = require("../../animation/translator"),
    typeUtils = require("../../core/utils/type"),
    dragEvents = require("../../events/drag"),
    eventUtils = require("../../events/utils"),
    eventsEngine = require("../../events/core/events_engine"),
    Button = require("../button"),
    DropDownMenu = require("../drop_down_menu"),
    FunctionTemplate = require("../widget/function_template"),
    messageLocalization = require("../../localization/message"),
    extendFromObject = require("../../core/utils/extend").extendFromObject,
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when;

var DROPDOWN_APPOINTMENTS_CLASS = "dx-scheduler-dropdown-appointments",
    COMPACT_DROPDOWN_APPOINTMENTS_CLASS = DROPDOWN_APPOINTMENTS_CLASS + "-compact",
    DROPDOWN_APPOINTMENTS_CONTENT_CLASS = "dx-scheduler-dropdown-appointments-content",
    DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment",
    DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title",
    DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date",
    DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button",
    DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-info-block",
    DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-buttons-block",
    ALL_DAY_PANEL_APPOINTMENT_CLASS = 'dx-scheduler-all-day-appointment';

var DRAG_START_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, "dropDownAppointments"),
    DRAG_UPDATE_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, "dropDownAppointments"),
    DRAG_END_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, "dropDownAppointments");

var SIDE_BORDER_COLOR_STYLES = {
    "left": "borderLeftColor",
    "top": "borderTopColor",
    "right": "borderRightColor",
    "bottom": "borderBottomColor"
};

var dropDownAppointments = Class.inherit({
    render: function(options, instance) {
        var coordinates = options.coordinates,
            items = options.items,
            buttonWidth = options.buttonWidth,
            offset = 0;

        this.instance = instance;

        var $menu = $("<div>").addClass(DROPDOWN_APPOINTMENTS_CLASS)
            .appendTo(options.$container);

        if(options.isCompact) {
            $menu.addClass(COMPACT_DROPDOWN_APPOINTMENTS_CLASS);
            offset = this.instance.fire("getCellWidth") - buttonWidth - 5;
        }

        this._createAppointmentClickAction();

        this._createDropDownMenu({
            $element: $menu,
            items: items,
            itemTemplate: options.itemTemplate,
            buttonWidth: buttonWidth
        }, options.isCompact);

        var deferredButtonColor = options.buttonColor,
            deferredItemsColors = options.items.colors;

        when.apply(null, deferredItemsColors).done((function() {
            this._paintMenuButton($menu, deferredButtonColor, arguments);
        }).bind(this));

        this._applyInnerShadow($menu, options.buttonWidth);

        translator.move($menu, {
            top: coordinates.top,
            left: coordinates.left + offset
        });

        return $menu;
    },

    repaintExisting: function($container) {
        var appointmentsSelector = ["", DROPDOWN_APPOINTMENTS_CLASS, "dx-dropdownmenu"].join(".");
        $container.find(appointmentsSelector).each(function() {
            DropDownMenu.getInstance(this).repaint();
        });
    },

    _paintMenuButton: function($menu, color, itemsColors) {
        var paintButton = true,
            itemColorCount = itemsColors.length,
            currentItemColor;

        color && color.done((function(color) {
            if(itemColorCount) {
                currentItemColor = itemsColors[0];

                for(var i = 1; i < itemColorCount; i++) {
                    if(currentItemColor !== itemsColors[i]) {
                        paintButton = false;
                        break;
                    }
                    currentItemColor = color;
                }
            }

            if(color && paintButton) {
                $menu.css("backgroundColor", color);
            }
        }).bind(this));
    },

    _createButtonTemplate: function(appointmentCount, isCompact) {
        var text = isCompact ? appointmentCount : messageLocalization.getFormatter("dxScheduler-moreAppointments")(appointmentCount);

        return $("<div>").append(
            [$("<span>").text(text)]
        ).addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
    },

    _applyInnerShadow: function($element) {
        $element.css("boxShadow", "inset " + $element.get(0).getBoundingClientRect().width + "px 0 0 0 rgba(0, 0, 0, 0.3)");
    },

    _createAppointmentClickAction: function() {
        this._appointmentClickAction = this.instance._createActionByOption("onAppointmentClick", {
            afterExecute: (function(e) {
                var config = e.args[0];
                config.event.stopPropagation();

                this.instance.fire("showEditAppointmentPopup", { data: config.appointmentData });
            }
            ).bind(this)
        });
    },
    _createDropDownMenu: function(config, isCompact) {
        var $menu = config.$element,
            items = config.items,
            that = this;

        if(!DropDownMenu.getInstance($menu)) {
            this._initDynamicTemplate(items);

            var template = this.instance._getAppointmentTemplate("dropDownAppointmentTemplate");

            this.instance._createComponent($menu, DropDownMenu, {
                buttonIcon: null,
                usePopover: true,
                popupHeight: "auto",
                popupMaxHeight: 200,
                items: items.data,
                buttonTemplate: this._createButtonTemplate(items.data.length, isCompact),
                buttonWidth: config.buttonWidth,
                closeOnClick: false,
                onItemClick: (function(args) {
                    var mappedData = this.instance.fire("mapAppointmentFields", args),
                        result = extendFromObject(mappedData, args, false);

                    that._appointmentClickAction(this._clearExcessFields(result));
                }).bind(this),
                activeStateEnabled: false,
                focusStateEnabled: this.instance.option("focusStateEnabled"),
                itemTemplate: new FunctionTemplate(function(options) {
                    var itemData = options.model,
                        startDate = itemData.settings ? itemData.settings[0].startDate : itemData.startDate;

                    itemData = that.instance.fire("appendSingleAppointmentData", {
                        appointmentData: itemData,
                        index: options.index,
                        startDate: startDate
                    });

                    return template.render({
                        model: itemData,
                        index: options.index,
                        container: options.container
                    });
                }),
                onItemRendered: function(args) {
                    if(!that.instance._allowDragging()) {
                        return;
                    }

                    var $item = args.itemElement,
                        itemData = args.itemData,
                        settings = itemData.settings;


                    eventsEngine.on($item, DRAG_START_EVENT_NAME, that._dragStartHandler.bind(that, $item, itemData, settings, $menu));

                    eventsEngine.on($item, DRAG_UPDATE_EVENT_NAME, (function(e) {
                        DropDownMenu.getInstance($menu).close();
                        that._dragHandler(e, itemData.allDay);
                    }).bind(this));

                    eventsEngine.on($item, DRAG_END_EVENT_NAME, (function(e) {
                        eventsEngine.trigger(that._$draggedItem, "dxdragend");
                        delete that._$draggedItem;
                    }).bind(this));
                }
            });
        }
    },

    _clearExcessFields: function(data) {
        delete data.itemData;
        delete data.itemIndex;
        delete data.itemElement;

        return data;
    },

    _dragStartHandler: function($item, itemData, settings, $menu, e) {
        var appointmentInstance = this.instance.getAppointmentsInstance(),
            appointmentIndex = appointmentInstance.option("items").length;

        settings[0].isCompact = false;
        settings[0].virtual = false;


        var appointmentData = {
            itemData: itemData,
            settings: settings
        };

        appointmentInstance._currentAppointmentSettings = settings;
        appointmentInstance._renderItem(appointmentIndex, appointmentData);

        var $items = appointmentInstance._findItemElementByItem(itemData);

        if(!$items.length) {
            return;
        }

        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, appointmentData.settings[0].startDate) : $items[0];
        var scheduler = this.instance;
        const dragContainerOffset = this._getDragContainerOffset();
        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];
        const scrollTop = this._$draggedItem.hasClass(ALL_DAY_PANEL_APPOINTMENT_CLASS)
            ? scheduler._workSpace.getAllDayHeight()
            : scheduler._workSpace.getScrollableScrollTop();
        this._startPosition = {
            top: e.pageY - dragContainerOffset.top - (this._$draggedItem.height() / 2) + scrollTop,
            left: e.pageX - dragContainerOffset.left - (this._$draggedItem.width() / 2)
        };

        translator.move(this._$draggedItem, this._startPosition);
        eventsEngine.trigger(this._$draggedItem, "dxdragstart");
    },

    _getDragContainerOffset: function() {
        return this.instance._$element.find('.dx-scheduler-date-table-scrollable .dx-scrollable-wrapper').offset();
    },

    _dragHandler: function(e, allDay) {
        var coordinates = {
            left: this._startPosition.left + e.offset.x,
            top: this._startPosition.top + e.offset.y
        };

        this.instance.getAppointmentsInstance().notifyObserver("correctAppointmentCoordinates", {
            coordinates: coordinates,
            allDay: allDay,
            isFixedContainer: false,
            callback: function(result) {
                if(result) {
                    coordinates = result;
                }
            }
        });

        translator.move(this._$draggedItem, coordinates);
    },

    _getRecurrencePart: function(appointments, startDate) {
        var result;
        for(var i = 0; i < appointments.length; i++) {
            var $appointment = appointments[i],
                appointmentStartDate = $appointment.data("dxAppointmentStartDate");
            if(appointmentStartDate.getTime() === startDate.getTime()) {
                result = $appointment;
            }
        }
        return result;
    },

    _initDynamicTemplate: function(items) {
        var that = this;

        this.instance._defaultTemplates["dropDownAppointment"] = new FunctionTemplate(function(options) {
            return that._createDropDownAppointmentTemplate(options.model, $(options.container), items.colors[options.index]);
        });
    },

    _createDropDownAppointmentTemplate: function(appointmentData, appointmentElement, color) {
        var dateString = "",
            appointmentMarkup = [],
            borderSide = "left",
            $title,
            $date,
            $infoBlock,
            text = this.instance.fire("getField", "text", appointmentData);

        appointmentElement.addClass(DROPDOWN_APPOINTMENT_CLASS);

        if(this.instance.option("rtlEnabled")) {
            borderSide = "right";
        }

        color && color.done((function(color) {
            appointmentElement.css(SIDE_BORDER_COLOR_STYLES[borderSide], color);
        }).bind(this));

        var startDate = this.instance.fire("getField", "startDate", appointmentData),
            endDate = this.instance.fire("getField", "endDate", appointmentData),
            startDateTimeZone = this.instance.fire("getField", "startDateTimeZone", appointmentData),
            endDateTimeZone = this.instance.fire("getField", "endDateTimeZone", appointmentData);

        startDate = this.instance.fire("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.instance.fire("convertDateByTimezone", endDate, endDateTimeZone);

        this.instance.fire("formatDates", {
            startDate: startDate,
            endDate: endDate,
            formatType: "DATETIME",
            callback: function(result) {
                dateString = result;
            }
        });

        $infoBlock = $("<div>").addClass(DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS);
        $title = $("<div>").addClass(DROPDOWN_APPOINTMENT_TITLE_CLASS).text(text);
        $date = $("<div>").addClass(DROPDOWN_APPOINTMENT_DATE_CLASS).text(dateString);

        $infoBlock.append([$title, $date]);
        appointmentMarkup.push($infoBlock);

        appointmentMarkup.push(this._createButtons(appointmentData));

        appointmentElement.append(appointmentMarkup);

        return appointmentElement;
    },

    _createButtons: function(appointmentData) {
        var editing = this.instance.option("editing"),
            allowDeleting = false;

        if(!editing) {
            return "";
        }

        if(editing === true) {
            allowDeleting = true;
        }

        if(typeUtils.isObject(editing)) {
            allowDeleting = editing.allowDeleting;
        }

        var $container = $("<div>").addClass(DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS),
            $removeButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS);

        if(allowDeleting) {
            $container.append($removeButton);
            this.instance._createComponent($removeButton, Button, {
                icon: "trash",
                height: 25,
                width: 25,
                onClick: (function(e) {
                    e.event.stopPropagation();
                    this.instance.deleteAppointment(appointmentData);
                }).bind(this)
            });
        }

        return $container;
    }
});

module.exports = dropDownAppointments;
