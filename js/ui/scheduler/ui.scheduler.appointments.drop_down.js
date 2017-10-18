"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    translator = require("../../animation/translator"),
    typeUtils = require("../../core/utils/type"),
    dragEvents = require("../../events/drag"),
    eventUtils = require("../../events/utils"),
    eventsEngine = require("../../events/core/events_engine"),
    Button = require("../button"),
    DropDownMenu = require("../drop_down_menu"),
    messageLocalization = require("../../localization/message");

var DROPDOWN_APPOINTMENTS_CLASS = "dx-scheduler-dropdown-appointments",
    DROPDOWN_APPOINTMENTS_CONTENT_CLASS = "dx-scheduler-dropdown-appointments-content",
    DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment",
    DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title",
    DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date",
    DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button",
    DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-info-block",
    DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-buttons-block";

var DRAG_START_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, "dropDownAppointments"),
    DRAG_UPDATE_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, "dropDownAppointments"),
    DRAG_END_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, "dropDownAppointments");

var dropDownAppointments = Class.inherit({
    render: function(options, instance) {
        var coordinates = options.coordinates,
            items = options.items;

        this.instance = instance;

        var $menu = $("<div>").addClass(DROPDOWN_APPOINTMENTS_CLASS)
            .appendTo(options.$container);

        this._createDropDownMenu({
            $element: $menu,
            items: items,
            itemTemplate: options.itemTemplate,
            buttonWidth: options.buttonWidth,
            onAppointmentClick: options.onAppointmentClick
        });

        this._paintMenuButton($menu, options.buttonColor, items);

        this._applyInnerShadow($menu, options.buttonWidth);

        translator.move($menu, {
            top: coordinates.top,
            left: coordinates.left
        });

        return $menu;
    },

    repaintExisting: function($container) {
        var appointmentsSelector = ["", DROPDOWN_APPOINTMENTS_CLASS, "dx-dropdownmenu"].join(".");
        $container.find(appointmentsSelector).each(function() {
            DropDownMenu.getInstance(this).repaint();
        });
    },

    _paintMenuButton: function($menu, color, menuItems) {
        var paintButton = true,
            itemsColors = menuItems.colors,
            itemColorCount = itemsColors.length,
            currentItemColor;

        if(itemColorCount) {
            currentItemColor = itemsColors[0];

            for(var i = 1; i < itemColorCount; i++) {
                if(currentItemColor !== itemsColors[i]) {
                    paintButton = false;
                    break;
                }
                currentItemColor = itemsColors[i];
            }
        }

        if(color && paintButton) {
            $menu.css("background-color", color);
        }
    },

    _createButtonTemplate: function(appointmentCount) {
        return $("<div>").append(
            [$("<span>").text(messageLocalization.getFormatter("dxScheduler-moreAppointments")(appointmentCount))]
        ).addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
    },

    _applyInnerShadow: function($element) {
        $element.css("box-shadow", "inset " + $element.outerWidth() + "px 0 0 0 rgba(0, 0, 0, 0.3)");
    },

    _createDropDownMenu: function(config) {
        var $menu = config.$element,
            items = config.items,
            onAppointmentClick = config.onAppointmentClick,
            itemTemplate,
            that = this;

        if(!DropDownMenu.getInstance($menu)) {

            itemTemplate = (function(appointmentData, index, appointmentElement) {
                this._createDropDownAppointmentTemplate(appointmentData, $(appointmentElement), items.colors[index]);
            }).bind(this);

            this.instance._createComponent($menu, DropDownMenu, {
                buttonIcon: null,
                usePopover: true,
                popupHeight: "auto",
                popupMaxHeight: 200,
                items: items.data,
                buttonTemplate: this._createButtonTemplate(items.data.length),
                buttonWidth: config.buttonWidth,
                onItemClick: function(args) {
                    args.component.open();

                    if(typeUtils.isFunction(onAppointmentClick)) {
                        onAppointmentClick.call(that.instance._appointments, args);
                    }

                    args.event.stopPropagation();
                    that.instance.fire("showEditAppointmentPopup", { data: args.itemData });
                },
                activeStateEnabled: false,
                focusStateEnabled: false,
                itemTemplate: itemTemplate,
                onItemRendered: function(args) {
                    var $item = args.itemElement,
                        itemData = args.itemData;

                    eventsEngine.on($item, DRAG_START_EVENT_NAME, that._dragStartHandler.bind(that, $item, itemData, itemData.settings, $menu));

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

        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, itemData.settings[0].startDate) : $items[0];

        var menuPosition = translator.locate($menu),
            itemPosition = translator.locate(this._$draggedItem);

        this._startPosition = {
            top: itemPosition.top,
            left: menuPosition.left
        };

        translator.move(this._$draggedItem, this._startPosition);
        eventsEngine.trigger(this._$draggedItem, "dxdragstart");
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

        if(color) {
            appointmentElement.css("border-" + borderSide + "-color", color);
        }

        var startDate = this.instance.fire("getField", "startDate", appointmentData),
            endDate = this.instance.fire("getField", "endDate", appointmentData);

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
    },

    _createButtons: function(appointmentData) {
        var editing = this.instance.option("editing"),
            allowDeleting = false,
            allowUpdating = false;

        if(!editing) {
            return "";
        }

        if(editing === true) {
            allowDeleting = true;
            allowUpdating = true;
        }

        if(typeUtils.isObject(editing)) {
            allowDeleting = editing.allowDeleting;
            allowUpdating = editing.allowUpdating;
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
