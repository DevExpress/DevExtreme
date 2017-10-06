"use strict";

var $ = require("../../core/renderer"),
    registerComponent = require("../../core/component_registrator"),
    SchedulerTimeline = require("./ui.scheduler.timeline");

var TIMELINE_CLASS = "dx-scheduler-timeline-week",
    HEADER_PANEL_CELL_CLASS = "dx-scheduler-header-panel-cell",
    HEADER_ROW_CLASS = "dx-scheduler-header-row";

var SchedulerTimelineWeek = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _getCellCount: function() {
        return this.callBase() * this._getWeekDuration();
    },

    _renderDateHeader: function() {
        var $headerRow = this.callBase(),
            firstViewDate = new Date(this._firstViewDate),
            $cells = [],
            colspan = this._getCellCountInDay(),
            cellTemplate = this.option("dateCellTemplate"),
            headerCellWidth = colspan * this._getHeaderPanelCellWidth($headerRow);

        for(var i = 0; i < this._getWeekDuration(); i++) {
            var $th = $("<th>"),
                text = this._formatWeekdayAndDay(firstViewDate);

            if(cellTemplate) {
                var templateOptions = {
                    model: {
                        text: text,
                        date: firstViewDate
                    },
                    container: $th,
                    index: i
                };

                cellTemplate.render(templateOptions);
            } else {
                $th.text(text);
            }

            $th.addClass(HEADER_PANEL_CELL_CLASS).attr("colspan", colspan).width(headerCellWidth);
            $cells.push($th);

            firstViewDate.setDate(firstViewDate.getDate() + 1);
        }

        var $row = $("<tr>").addClass(HEADER_ROW_CLASS).append($cells);
        $headerRow.before($row);
    },

    _getHeaderPanelCellWidth: function($headerRow) {
        return $headerRow.children().first().outerWidth();
    },

    _getWeekDuration: function() {
        return 7;
    }
});

registerComponent("dxSchedulerTimelineWeek", SchedulerTimelineWeek);

module.exports = SchedulerTimelineWeek;
