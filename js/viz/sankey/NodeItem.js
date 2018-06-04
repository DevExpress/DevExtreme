"use strict";

var states = ["normal", "hover"];

function compileAttrs(color, itemOptions, itemBaseOptions) {
    return {
        fill: itemOptions.color || color,
        'stroke-width': itemOptions.border.visible ? itemOptions.border.width : 0,
        stroke: itemOptions.border.color || itemBaseOptions.border.color,
        'stroke-opacity': itemOptions.border.visible ? itemOptions.border.opacity || itemBaseOptions.border.opacity : 0,
        opacity: itemOptions.opacity || itemBaseOptions.opacity,
        hatching: itemOptions.hatching
    };
}

function compileLabelAttrs(labelOptions, filter, node) {
    var _patchFontOptions = require("../core/utils").patchFontOptions;

    if(labelOptions.colorMode === 'node') {
        labelOptions.font.color = node.color;
    }

    return {
        attr: labelOptions["stroke-width"] ? {
            stroke: labelOptions.stroke,
            "stroke-width": labelOptions["stroke-width"],
            "stroke-opacity": labelOptions["stroke-opacity"],
            filter: filter
        } : {},
        css: _patchFontOptions(labelOptions.font)
    };
}

function NodeItem(widget, params) {
    var that = this,
        widgetOffset = widget._renderer.getRootOffset();

    that.code = 0;
    that.widget = widget;

    that.color = params.color;
    that.options = params.options;
    that.rect = params.rect;
    that.title = params.rect._name;
    that.coords = {
        x: params.rect.x + params.rect.width / 2 + widgetOffset.left,
        y: params.rect.y + params.rect.height / 2 + widgetOffset.top
    };
    that.id = params.id;
    that.linksIn = params.linksIn;
    that.linksOut = params.linksOut;

    this.states = {
        normal: compileAttrs(this.color, that.options, that.options),
        hover: compileAttrs(this.color, that.options.hoverStyle, that.options)
    };
}

NodeItem.prototype = {
    compileAttrs: function() {
        return compileAttrs(this.color, this.options);
    },

    getState: function() {
        return states[this.code];
    },

    isHovered: function() {
        return !!(this.code & 1);
    },

    setState: function(code, state) {
        if(state) {
            this.code |= code;
        } else {
            this.code &= ~code;
        }

        if(state) {
            this.linksIn.concat(this.linksOut).forEach(adjacentLink => {
                this.widget._links[adjacentLink.idx].setAdjacentNodeHover(true);
            });
        } else {
            this.widget._links.forEach(function(link) {
                link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
            });
            if(this.widget._tooltip) {
                this.widget._tooltip.hide();
            }
        }

        this.widget._applyNodesAppearance();
        this.widget._applyLinksAppearance();
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

    setHover: function() {
        this.hover(true);
    },

    showTooltip: function(coords) {
        this.widget._getOption("hoverEnabled", true) && this.widget._tooltip.show({
            type: 'node',
            from: null,
            to: null,
            weight: null,
            title: this.title,
            weightIn: this.linksIn.reduce(function(previousValue, currentValue, index, array) { return previousValue + currentValue.weight; }, 0),
            weightOut: this.linksOut.reduce(function(previousValue, currentValue, index, array) { return previousValue + currentValue.weight; }, 0)
        }, typeof coords !== 'undefined' ? { x: coords[0], y: coords[1] } : this.coords);
    },

    getLabelAttributes: function(labelSettings, filter, diagramRect) {
        var attributes = compileLabelAttrs(labelSettings, filter, this);

        if(this.rect.x + this.rect.width + labelSettings.horizontalOffset > diagramRect[2] - diagramRect[1]) {
            attributes.attr.x = this.rect.x - labelSettings.horizontalOffset;
            attributes.attr['text-anchor'] = 'end';
        } else {
            attributes.attr.x = this.rect.x + this.rect.width + labelSettings.horizontalOffset;
            attributes.attr['text-anchor'] = 'start';
        }
        attributes.attr.y = this.rect.y + this.rect.height / 2;
        return attributes;
    }

};

module.exports = NodeItem;
