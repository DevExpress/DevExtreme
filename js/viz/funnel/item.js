"use strict";

var states = ["normal", "hover", "selection", "selection"],
    format = require("../../format_helper").format,
    isDefined = require("../../core/utils/type").isDefined;

function parseStyles(color, style, baseStyle) {
    var border = style.border,
        baseBorder = baseStyle.border,
        borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible,
        borderWidth = isDefined(border.width) ? border.width : baseBorder.width;

    return {
        fill: color,
        hatching: style.hatching,
        stroke: border.color || baseBorder.color,
        "stroke-width": borderVisible ? borderWidth : 0
    };
}

function Item(widget, options) {
    this.code = 0;
    this.widget = widget;

    this.figure = options.figure;
    this.data = options.data;
    this.percent = options.percent;
    this.percentText = format(this.percent, "percent");

    this.id = options.id;
    this.color = options.color;

    this.states = {
        normal: parseStyles(options.color, options.itemOptions, options.itemOptions),
        hover: parseStyles(options.color, options.itemOptions.hoverStyle, options.itemOptions),
        selection: parseStyles(options.color, options.itemOptions.selectionStyle, options.itemOptions)
    };
}

Item.prototype = {
    getState: function() {
        return states[this.code];
    },

    setHover: function() {
        this.hover(true);
    },

    hover: function(state) {
        if(!this.widget._getOption("hoverEnabled", true) || state === this.isHovered()) {
            return;
        }

        this.widget._suspend();
        state && this.widget.clearHover();
        this.setState(1, state);
        this.widget._eventTrigger("hoverChanged", { item: this });
        this.widget._resume();
    },

    setState: function(code, state) {
        if(state) {
            this.code |= code;
        } else {
            this.code &= ~code;
        }
        this.widget._change(["TILES"]);
    },

    select: function(state) {
        var mode = this.widget._getOption("selectionMode", true);
        if(mode === "none" || state === this.isSelected()) {
            return;
        }
        this.widget._suspend();
        if(state && mode !== "multiple") {
            this.widget.clearSelection();
        }
        this.setState(2, state);
        this.widget._eventTrigger("selectionChanged", { item: this });
        this.widget._resume();
    },

    showTooltip: function(coords) {
        this.widget._showTooltip(this.id, coords);
    },

    getColor: function() {
        return this.color;
    },

    isHovered: function() {
        return !!(this.code & 1);
    },

    isSelected: function() {
        return !!(this.code & 2);
    }
};

module.exports = Item;
