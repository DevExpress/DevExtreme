import $ from "../../core/renderer";
import Class from "../../core/class";
import translator from "../../animation/translator";
import typeUtils from "../../core/utils/type";
import dragEvents from "../../events/drag";
import eventUtils from "../../events/utils";
import eventsEngine from "../../events/core/events_engine";
import Button from "../button";
import DropDownMenu from "../drop_down_menu";
import FunctionTemplate from "../widget/function_template";
import messageLocalization from "../../localization/message";
import { extendFromObject } from "../../core/utils/extend";
import deferredUtils from "../../core/utils/deferred";
const when = deferredUtils.when;

const OFFSET = 5,
    REMOVE_BUTTON_SIZE = 25;

const DROPDOWN_APPOINTMENTS_CLASS = "dx-scheduler-dropdown-appointments",
    COMPACT_DROPDOWN_APPOINTMENTS_CLASS = DROPDOWN_APPOINTMENTS_CLASS + "-compact",
    DROPDOWN_APPOINTMENTS_CONTENT_CLASS = "dx-scheduler-dropdown-appointments-content",
    DROPDOWN_APPOINTMENT_CLASS = "dx-scheduler-dropdown-appointment",
    DROPDOWN_APPOINTMENT_TITLE_CLASS = "dx-scheduler-dropdown-appointment-title",
    DROPDOWN_APPOINTMENT_DATE_CLASS = "dx-scheduler-dropdown-appointment-date",
    DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS = "dx-scheduler-dropdown-appointment-remove-button",
    DROPDOWN_APPOINTMENT_INFO_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-info-block",
    DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS = "dx-scheduler-dropdown-appointment-buttons-block";

const DRAG_START_EVENT_NAME = eventUtils.addNamespace(dragEvents.start, "dropDownAppointments"),
    DRAG_UPDATE_EVENT_NAME = eventUtils.addNamespace(dragEvents.move, "dropDownAppointments"),
    DRAG_END_EVENT_NAME = eventUtils.addNamespace(dragEvents.end, "dropDownAppointments");

const SIDE_BORDER_COLOR_STYLES = {
    "left": "borderLeftColor",
    "top": "borderTopColor",
    "right": "borderRightColor",
    "bottom": "borderBottomColor"
};

let dropDownAppointments = Class.inherit({
    render: function(options, instance) {
        this.instance = instance;
        let coordinates = options.coordinates,
            items = options.items,
            buttonWidth = options.buttonWidth,
            offset = 0;

        const $menu = $("<div>").addClass(DROPDOWN_APPOINTMENTS_CLASS)
            .appendTo(options.$container);

        if(options.isCompact) {
            $menu.addClass(COMPACT_DROPDOWN_APPOINTMENTS_CLASS);
            offset = this.instance.fire("getCellWidth") - buttonWidth - OFFSET;
        }

        this._createAppointmentClickAction();

        this._createDropDownMenu({
            $element: $menu,
            items: items,
            itemTemplate: options.itemTemplate,
            buttonWidth: buttonWidth
        }, options.isCompact);

        when.apply(null, options.items.colors).done(function() {
            this._paintMenuButton($menu, options.buttonColor, arguments);
        }.bind(this));

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
        let paintButton = true,
            currentItemColor;

        color && color.done(function(color) {
            if(itemsColors.length) {
                currentItemColor = itemsColors[0];

                for(let i = 1; i < itemsColors.length; i++) {
                    if(currentItemColor !== itemsColors[i]) {
                        paintButton = false;
                        break;
                    }
                    currentItemColor = color;
                }
            }
            color && paintButton && $menu.css("backgroundColor", color);
        }.bind(this));
    },

    _applyInnerShadow: function($element) {
        $element.css("boxShadow", "inset " + $element.get(0).getBoundingClientRect().width + "px 0 0 0 rgba(0, 0, 0, 0.3)");
    },

    _createAppointmentClickAction: function() {
        this._appointmentClickAction = this.instance._createActionByOption("onAppointmentClick", {
            afterExecute: function(e) {
                var config = e.args[0];
                config.event.stopPropagation();

                this.instance.fire("showEditAppointmentPopup", { data: config.appointmentData });
            }.bind(this)
        });
    },
    _createDropDownMenu: function(config, isCompact) {
        const $menu = config.$element,
            items = config.items;

        if(!DropDownMenu.getInstance($menu)) {
            this._initDynamicTemplate(items);
            this._initDynamicButtonTemplate(items.data.length, isCompact);

            const template = this.instance._getAppointmentTemplate("dropDownAppointmentTemplate"),
                buttonTemplate = this.instance._getAppointmentTemplate("appointmentCollectorTemplate");

            this.instance._createComponent($menu, DropDownMenu, {
                buttonIcon: null,
                usePopover: true,
                popupHeight: "auto",
                popupMaxHeight: 200,
                items: items.data,
                buttonTemplate: this._createListButtonTemplate(buttonTemplate, items, isCompact),
                itemTemplate: this._createListItemTemplate(template),
                buttonWidth: config.buttonWidth,
                closeOnClick: false,
                activeStateEnabled: false,
                focusStateEnabled: this.instance.option("focusStateEnabled"),
                onItemClick: this._onListItemClick.bind(this),
                onItemRendered: function(args) {
                    this._onListItemRenderedCore(args, $menu);
                }.bind(this)
            });
        }
    },

    _createListButtonTemplate: function(template, items, isCompact) {
        return new FunctionTemplate(function(options) {
            var model = {
                appointmentCount: items.data.length,
                isCompact: isCompact
            };

            return template.render({
                model: model,
                container: options.container
            });
        });
    },

    _createListItemTemplate: function(template) {
        return new FunctionTemplate((options) => {
            return template.render({
                model: options.model,
                index: options.index,
                container: options.container
            });
        });
    },

    _onListItemClick: function(args) {
        const mappedData = this.instance.fire("mapAppointmentFields", args),
            result = extendFromObject(mappedData, args, false);
        this._appointmentClickAction(this._clearExcessFields(result));
    },

    _onListItemRenderedCore: function(args, $menu) {
        if(!this.instance._allowDragging()) {
            return;
        }

        const $item = args.itemElement,
            itemData = args.itemData,
            settings = itemData.settings;

        eventsEngine.on($item, DRAG_START_EVENT_NAME, () => {
            this._onAppointmentDragStart($item, itemData, settings, $menu);
        });

        eventsEngine.on($item, DRAG_UPDATE_EVENT_NAME, (e) => {
            DropDownMenu.getInstance($menu).close();
            this._onAppointmentDragUpdate(e, itemData.allDay);
        });

        eventsEngine.on($item, DRAG_END_EVENT_NAME, () => {
            this._onAppointmentDragEnd(itemData);
        });
    },

    _onAppointmentDragStart: function($item, itemData, settings, $menu, e) {
        const appointmentInstance = this.instance.getAppointmentsInstance(),
            appointmentIndex = appointmentInstance.option("items").length;

        settings[0].isCompact = false;
        settings[0].virtual = false;


        const appointmentData = {
            itemData: itemData,
            settings: settings
        };

        appointmentInstance._currentAppointmentSettings = settings;
        appointmentInstance._renderItem(appointmentIndex, appointmentData);

        const $items = appointmentInstance._findItemElementByItem(itemData);

        if($items.length > 0) {
            this._prepareDragItem($menu, $items, appointmentData.settings);
        }
    },

    _onAppointmentDragUpdate: function(e, allDay) {
        let coordinates = {
            left: this._startPosition.left + e.offset.x,
            top: this._startPosition.top + e.offset.y
        };

        this.instance.getAppointmentsInstance().notifyObserver("correctAppointmentCoordinates", {
            coordinates: coordinates,
            allDay: allDay,
            isFixedContainer: false,
            callback: (result) => {
                if(result) {
                    coordinates = result;
                }
            }
        });

        translator.move(this._$draggedItem, coordinates);
    },

    _onAppointmentDragEnd: function(itemData) {
        const appointments = this.instance.getAppointmentsInstance(),
            newCellIndex = this.instance._workSpace.getDroppableCellIndex(),
            oldCellIndex = this.instance._workSpace.getCellIndexByCoordinates(this._startPosition);

        eventsEngine.trigger(this._$draggedItem, "dxdragend");
        newCellIndex === oldCellIndex && appointments._clearItem({ itemData: itemData });

        delete this._$draggedItem;
    },

    _clearExcessFields: function(data) {
        delete data.itemData;
        delete data.itemIndex;
        delete data.itemElement;

        return data;
    },

    _prepareDragItem: function($menu, $items, settings) {
        this._$draggedItem = $items.length > 1 ? this._getRecurrencePart($items, settings[0].startDate) : $items[0];

        const menuPosition = translator.locate($menu);
        this._startPosition = {
            top: menuPosition.top,
            left: menuPosition.left
        };

        translator.move(this._$draggedItem, this._startPosition);
        eventsEngine.trigger(this._$draggedItem, "dxdragstart");
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
        this.instance._defaultTemplates["dropDownAppointment"] = new FunctionTemplate((options) => {
            return this._createDropDownAppointmentTemplate(options.model, $(options.container), items.colors[options.index]);
        });
    },

    _initDynamicButtonTemplate: function(count, isCompact) {
        this.instance._defaultTemplates["appointmentCollector"] = new FunctionTemplate((options) => {
            return this._createButtonTemplate(count, $(options.container), isCompact);
        });
    },

    _createButtonTemplate: function(appointmentCount, element, isCompact) {
        const text = isCompact ? appointmentCount : messageLocalization.getFormatter("dxScheduler-moreAppointments")(appointmentCount);

        return element
            .append([$("<span>").text(text)])
            .addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
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

        color && color.done((color) => {
            appointmentElement.css(SIDE_BORDER_COLOR_STYLES[borderSide], color);
        });

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
        let editing = this.instance.option("editing"),
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

        const $container = $("<div>").addClass(DROPDOWN_APPOINTMENT_BUTTONS_BLOCK_CLASS),
            $removeButton = $("<div>").addClass(DROPDOWN_APPOINTMENT_REMOVE_BUTTON_CLASS);

        if(allowDeleting) {
            $container.append($removeButton);
            this.instance._createComponent($removeButton, Button, {
                icon: "trash",
                height: REMOVE_BUTTON_SIZE,
                width: REMOVE_BUTTON_SIZE,
                onClick: (e) => {
                    e.event.stopPropagation();
                    this.instance.deleteAppointment(appointmentData);
                }
            });
        }

        return $container;
    }
});

module.exports = dropDownAppointments;
