"use strict";

var states = ["normal", "adjacentNodeHover", "hover"];

function compileAttrs(color, itemOptions, itemBaseOptions) {
    return {
        fill: itemOptions.colorMode === 'node' ? color : itemOptions.color || color,
        'stroke-width': itemOptions.border.visible ? itemOptions.border.width : 0,
        stroke: itemOptions.border.visible ? itemOptions.border.color : '#000000',
        opacity: itemOptions.opacity || itemBaseOptions.opacity,
        hatching: itemOptions.hatching
    };
}

function LinkItem(widget, params) {
    var that = this;

    that.code = 0;
    that.widget = widget;

    that.color = params.color;
    that.connection = params.connection;
    that.d = params.d;
    that.options = params.options;

    that.states = {
        normal: compileAttrs(that.color, that.options, that.options),
        adjacentNodeHover: compileAttrs(that.color, that.options.hoverStyle, that.options),
        hover: compileAttrs(that.color, that.options.hoverStyle, that.options)
    };

}

LinkItem.prototype = {
    compileAttrs: function() {
        return compileAttrs(this.color, this.options);
    },
    getState: function() {
        return states[this.code];
    },

    isHovered: function() {
        return !!(this.code & 1);
    },

    isAdjacentNodeHovered: function() {
        return !!(this.code & 1);
    },

    setState: function(code, state) {
        if(state) {
            this.code |= code;
        } else {
            this.code &= ~code;
        }

        if(!state) {
            this.widget._tooltip.hide();
        }

        this.widget._applyLinksAppearance();
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

    adjacentNodeHover: function(state) {
        if(!this.widget._getOption("hoverEnabled", true) || state === this.isAdjacentNodeHovered()) {
            return;
        }

        this.widget._suspend();
        this.setState(1, state);
        this.widget._resume();
    },

    setAdjacentNodeHover: function() {
        this.adjacentNodeHover(true);
    },

    showTooltip: function(coords) {
        this.widget._getOption("hoverEnabled", true) && this.widget._tooltip.show({
            type: 'link',
            from: this.connection.from,
            to: this.connection.to,
            weight: this.connection.weight,
            title: null,
            weightIn: null,
            weightOut: null
        }, {
            x: coords[0],
            y: coords[1]
        });
    }
};

module.exports = LinkItem;
