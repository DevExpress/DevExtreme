"use strict";

var $ = require("../../core/renderer"),
    Class = require("../../core/class"),
    commonUtils = require("../../core/utils/common"),
    VerticalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.vertical"),
    HorizontalAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal"),
    HorizontalMonthLineAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month_line"),
    HorizontalMonthAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.horizontal_month"),
    AgendaAppointmentsStrategy = require("./ui.scheduler.appointments.strategy.agenda");

var RENDERING_STRATEGIES = {
    "horizontal": HorizontalAppointmentsStrategy,
    "horizontalMonth": HorizontalMonthAppointmentsStrategy,
    "horizontalMonthLine": HorizontalMonthLineAppointmentsStrategy,
    "vertical": VerticalAppointmentsStrategy,
    "agenda": AgendaAppointmentsStrategy
};

var AppointmentLayoutManager = Class.inherit({
    ctor: function(instance, renderingStrategy) {
        this.instance = instance;

        renderingStrategy && this.initRenderingStrategy(renderingStrategy);
    },

    getCellDimensions: function(options) {
        if(this.instance._workSpace) {
            options.callback(this.instance._workSpace.getCellWidth(), this.instance._workSpace.getCellHeight(), this.instance._workSpace.getAllDayHeight());
        }
    },

    initRenderingStrategy: function(renderingStrategy) {
        var Strategy = RENDERING_STRATEGIES[renderingStrategy];
        this._renderingStrategyInstance = new Strategy(this.instance);
        this.renderingStrategy = renderingStrategy;
    },

    createAppointmentsMap: function(items) {
        var result = [];

        this.getCellDimensions({
            callback: (function(width, height, allDayHeight) {
                this.instance._cellWidth = width;
                this.instance._cellHeight = height;
                this.instance._allDayCellHeight = allDayHeight;
            }).bind(this)
        });

        this._positionMap = this._renderingStrategyInstance.createTaskPositionMap(items);

        $.each(items, (function(index, itemData) {
            var appointmentSettings = this._positionMap[index];

            $.each(appointmentSettings, (function(_, settings) {
                settings.direction = this.renderingStrategy === "vertical" && !settings.allDay ? "vertical" : "horizontal";
            }).bind(this));

            result.push({
                itemData: itemData,
                settings: appointmentSettings
            });

        }).bind(this));

        return result;
    },

    _markDeletedAppointments: function(renderedItems, appointments) {
        var itemFound,
            result = [];

        $.each(renderedItems, (function(i, currentItem) {
            itemFound = false;

            $.each(appointments, (function(i, item) {
                if(currentItem.itemData === item.itemData) {
                    itemFound = true;
                }
            }).bind(this));

            if(!itemFound) {
                currentItem.needRemove = true;
                currentItem.needRepaint = false;
                result.push(currentItem);
            }
        }).bind(this));

        return result;
    },

    markRepaintedAppointments: function(appointments, renderedItems) {
        var isAgenda = this.renderingStrategy === "agenda",
            updatedAppointment = this.instance.getUpdatedAppointment(),
            result = this._markDeletedAppointments(renderedItems, appointments),
            itemFound,
            coordinatesChanged,
            repaintAll = false;

        $.each(appointments, (function(_, currentItem) {
            itemFound = false;
            coordinatesChanged = false,
            currentItem.needRepaint = false;

            $.each(renderedItems, (function(_, item) {
                if(currentItem.itemData === item.itemData) {
                    item.needRepaint = false;
                    itemFound = true;

                    if(updatedAppointment && commonUtils.equalByValue(item.itemData, updatedAppointment)) {
                        item.needRepaint = true;
                        if(isAgenda) {
                            repaintAll = true;
                        }
                    }
                    coordinatesChanged = this._compareSettings(currentItem, item, isAgenda);

                    if(coordinatesChanged || repaintAll) {
                        item.settings = currentItem.settings;
                        item.needRepaint = true;
                        item.needRemove = false;
                        if(isAgenda) {
                            result.push(item);
                            repaintAll = true;
                        }
                    }
                }

            }).bind(this));

            if(!itemFound) {
                currentItem.needRepaint = true;
                currentItem.needRemove = false;
                renderedItems.push(currentItem);
                isAgenda && result.push(currentItem);
            }

        }).bind(this));

        return isAgenda && result.length ? result : renderedItems;
    },

    _compareSettings: function(currentItem, item, isAgenda) {
        var currentItemSettingsLength = currentItem.settings.length,
            itemSettingsLength = item.settings.length,
            result = false;

        if(currentItemSettingsLength === itemSettingsLength) {
            for(var k = 0; k < currentItemSettingsLength; k++) {
                var currentItemSettings = currentItem.settings[k],
                    itemSettings = item.settings[k];

                if(!isAgenda && itemSettings) {
                    itemSettings.sortedIndex = currentItemSettings.sortedIndex;
                }

                if(!commonUtils.equalByValue(currentItemSettings, itemSettings)) {

                    result = true;
                    break;
                }
            }
        } else {
            result = true;
        }

        return result;
    },

    getRenderingStrategyInstance: function() {
        return this._renderingStrategyInstance;
    }
});

module.exports = AppointmentLayoutManager;
