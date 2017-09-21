"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    translator = require("../../animation/translator"),
    typeUtils = require("../../core/utils/type"),
    dragEvents = require("../../events/drag"),
    eventUtils = require("../../events/utils"),
    eventsEngine = require("../../events/core/events_engine"),
    Button = require("../button"),
    DropDownMenu = require("../drop_down_menu");

var DROPDOWN_APPOINTMENTS_CLASS = "dx-scheduler-dropdown-appointments",
    DROPDOWN_APPOINTMENTS_CONTENT_CLASS = "dx-scheduler-dropdown-appointments-content",
    DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment",
    DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title",
    DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date",
    DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button",
    DROPDOWN_APPOINTMENT_EDIT_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-edit-button",
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
            [$("<span>").text(appointmentCount), $("<span>").text("...")]
        ).addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
    },

    _applyInnerShadow: function($element) {
        $element.css("box-shadow", "inset " + $element.outerWidth() + "px 0 0 0 rgba(0, 0, 0, 0.3)");
    },

    _createDropDownMenu: function(config) {
        var $element = config.$element,
            items = config.items,
            onAppointmentClick = config.onAppointmentClick,
            itemTemplate,
            that = this;

        if(!DropDownMenu.getInstance($element)) {

            itemTemplate = (function(appointmentData, index, appointmentElement) {
                this._createDropDownAppointmentTemplate(appointmentData, appointmentElement, items.colors[index]);
            }).bind(this);

            var instance = this.instance,
                $menu = $element;

            this.instance._createComponent($element, DropDownMenu, {
                buttonIcon: null,
                usePopover: true,
                popupHeight: 200,
                items: items.data,
                buttonTemplate: this._createButtonTemplate(items.data.length),
                buttonWidth: config.buttonWidth,
                onItemClick: function(args) {
                    args.component.open();

                    if(typeUtils.isFunction(onAppointmentClick)) {
                        onAppointmentClick.call(instance._appointments, args);
                    }
                },
                activeStateEnabled: false,
                focusStateEnabled: false,
                itemTemplate: itemTemplate,
                onItemRendered: function(args) {
                    var $item = args.itemElement,
                        itemData = args.itemData,
                        settings = args.itemData.settings;

                    eventsEngine.on($item, DRAG_START_EVENT_NAME, (function(e) {
                        settings[0].isCompact = false;
                        settings[0].virtual = false;
                        var appointmentData = {
                            itemData: itemData,
                            settings: settings
                        };
                        that.instance.getAppointmentsInstance()._currentAppointmentSettings = settings;
                        that.instance.getAppointmentsInstance()._renderItem(4, appointmentData);

                        var $items = that.instance.getAppointmentsInstance()._findItemElementByItem(itemData);

                        if($items.length) {
                            that._$draggedItem = $items[0];
                            that._draggedItemData = itemData;
                            that._startPosition = translator.locate(that._$draggedItem);
                            eventsEngine.trigger(that._$draggedItem, "dxdragstart");
                        }

                    }).bind(this));

                    eventsEngine.on($item, DRAG_UPDATE_EVENT_NAME, (function(e) {
                        var coordinates = {
                            left: that._startPosition.left + e.offset.x,
                            top: that._startPosition.top + e.offset.y
                        };

                        that.instance.getAppointmentsInstance().notifyObserver("correctAppointmentCoordinates", {
                            coordinates: coordinates,
                            allDay: that._draggedItemData.allDay,
                            isFixedContainer: false,
                            callback: function(result) {
                                if(result) {
                                    coordinates = result;
                                }
                            }
                        });

                        translator.move(that._$draggedItem, coordinates);

                        DropDownMenu.getInstance($menu).close();
                    }).bind(this));

                    eventsEngine.on($item, DRAG_END_EVENT_NAME, (function(e) {
                        eventsEngine.trigger(that._$draggedItem, "dxdragend");
                    }).bind(this));
                }
            });
        }
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
            $removeButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS),
            $editButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_EDIT_BUTTON_CLASS);

        if(allowDeleting) {
            $container.append($removeButton);
            this.instance._createComponent($removeButton, Button, {
                icon: "trash",
                height: 25,
                width: 25,
                onClick: (function(e) {
                    e.jQueryEvent.stopPropagation();
                    this.instance.deleteAppointment(appointmentData);
                }).bind(this)
            });
        }
        if(allowUpdating) {
            $container.append($editButton);
            this.instance._createComponent($editButton, Button, {
                icon: "edit",
                height: 25,
                width: 25,
                onClick: (function(e) {
                    e.jQueryEvent.stopPropagation();
                    this.instance.fire("showEditAppointmentPopup", { data: appointmentData });
                }).bind(this)
            });
        }

        return $container;
    }
});

module.exports = dropDownAppointments;
