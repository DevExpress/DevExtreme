"use strict";

var $ = require("../../core/renderer"),
    themes = require("../themes");

var TimelineHeaderFormatter = {
    fillDateHeaderCell: function($headerCell, text) {
        var HEADER_PANEL_CELL_WEEKDAY_CLASS = "dx-scheduler-header-panel-cell-firstline",
            HEADER_PANEL_CELL_DAY_CLASS = "dx-scheduler-header-panel-cell-secondline";

        if(!themes.isMaterial()) {
            $headerCell.text(text);
        } else {
            text.split(" ").forEach(function(text, index) {
                var span = $("<span>")
                    .text(text)
                    .addClass(index ? HEADER_PANEL_CELL_DAY_CLASS : HEADER_PANEL_CELL_WEEKDAY_CLASS);

                $headerCell.append(span);
                if(!index) $headerCell.append(" ");
            });
        }
    }
};

module.exports = TimelineHeaderFormatter;
