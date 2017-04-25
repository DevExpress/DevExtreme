"use strict";

var $ = require("jquery"),
    Class = require("../../core/class"),
    translator = require("../../animation/translator"),
    commonUtils = require("../../core/utils/common"),
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
        return $("<div />").html(
            [$("<span />").text(appointmentCount), $("<span />").text("...")]
        ).addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
    },

    _applyInnerShadow: function($element) {
        $element.css("box-shadow", "inset " + $element.outerWidth() + "px 0 0 0 rgba(0, 0, 0, 0.3)");
    },

    _createDropDownMenu: function(config) {
        var $element = config.$element,
            items = config.items,
            onAppointmentClick = config.onAppointmentClick,
            itemTemplate;

        if(!DropDownMenu.getInstance($element)) {

            itemTemplate = $.proxy(function(appointmentData, index, appointmentElement) {
                this._createDropDownAppointmentTemplate(appointmentData, appointmentElement, items.colors[index]);
            }, this);

            var instance = this.instance;
            this.instance._createComponent($element, DropDownMenu, {
                buttonIcon: null,
                usePopover: true,
                popupHeight: 200,
                items: items.data,
                buttonTemplate: this._createButtonTemplate(items.data.length),
                buttonWidth: config.buttonWidth,
                onItemClick: function(args) {
                    args.component.open();

                    if($.isFunction(onAppointmentClick)) {
                        onAppointmentClick.call(instance._appointments, args);
                    }
                },
                activeStateEnabled: false,
                focusStateEnabled: false,
                itemTemplate: itemTemplate
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

        $infoBlock = $("<div />").addClass(DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS);
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

        if(commonUtils.isObject(editing)) {
            allowDeleting = editing.allowDeleting;
            allowUpdating = editing.allowUpdating;
        }

        var $container = $("<div />").addClass(DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS),
            $removeButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS),
            $editButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_EDIT_BUTTON_CLASS);

        if(allowDeleting) {
            $container.append($removeButton);
            this.instance._createComponent($removeButton, Button, {
                icon: "trash",
                height: 25,
                width: 25,
                onClick: $.proxy(function(e) {
                    e.jQueryEvent.stopPropagation();
                    this.instance.deleteAppointment(appointmentData);
                }, this)
            });
        }
        if(allowUpdating) {
            $container.append($editButton);
            this.instance._createComponent($editButton, Button, {
                icon: "edit",
                height: 25,
                width: 25,
                onClick: $.proxy(function(e) {
                    e.jQueryEvent.stopPropagation();
                    this.instance.fire("showEditAppointmentPopup", { data: appointmentData });
                }, this)
            });
        }

        return $container;
    }
});

module.exports = dropDownAppointments;
