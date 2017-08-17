"use strict";

var states = ["normal", "hover", "selection", "selection"],
    format = require("../../format_helper").format;

function parseStyles(color, style) {
    return {
        fill: color,
        hatching: style.hatching,
        stroke: style.border.color,
        "stroke-width": style.border.visible ? style.border.width : 0
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
        normal: parseStyles(options.color, options.itemOptions),
        hover: parseStyles(options.color, options.itemOptions.hoverStyle),
        selection: parseStyles(options.color, options.itemOptions.selectionStyle)
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
        if(!this.widget._getOption("hoverEnabled", true)) {
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
        if(mode === "none") {
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
