const states = ['normal', 'hover'];
const isDefined = require('../../core/utils/type').isDefined;

function compileAttrs(color, itemOptions, itemBaseOptions) {

    const border = itemOptions.border;
    const baseBorder = itemBaseOptions.border;
    const borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible;
    const borderWidth = isDefined(border.width) ? border.width : baseBorder.width;
    const borderOpacity = isDefined(border.opacity) ? border.opacity : (isDefined(baseBorder.opacity) ? baseBorder.opacity : 1);
    const opacity = isDefined(itemOptions.opacity) ? itemOptions.opacity : (isDefined(itemBaseOptions.opacity) ? itemBaseOptions.opacity : 1);

    return {
        fill: itemOptions.color || color,
        'stroke-width': borderVisible ? borderWidth : 0,
        stroke: itemOptions.border.color || itemBaseOptions.border.color,
        'stroke-opacity': borderOpacity,
        opacity: opacity,
        hatching: itemOptions.hatching
    };
}

function compileLabelAttrs(labelOptions, filter, node) {
    const _patchFontOptions = require('../core/utils').patchFontOptions;

    if(labelOptions.useNodeColors) {
        labelOptions.font.color = node.color;
    }

    const borderVisible = isDefined(labelOptions.border.visible) ? labelOptions.border.visible : false;
    const borderWidth = isDefined(labelOptions.border.width) ? labelOptions.border.width : 0;
    const borderColor = isDefined(labelOptions.border.color) ? labelOptions.border.color : labelOptions.font.color;
    const borderOpacity = isDefined(labelOptions.border.opacity) ? labelOptions.border.opacity : 1;
    const attr = {
        filter: filter
    };

    if(borderVisible && borderWidth) {
        attr.stroke = borderColor;
        attr['stroke-width'] = borderVisible ? borderWidth : 0;
        attr['stroke-opacity'] = borderOpacity;
    }

    return {
        attr: attr,
        css: _patchFontOptions(labelOptions.font)
    };
}

function Node(widget, params) {
    const that = this;
    const widgetOffset = widget._renderer.getRootOffset();

    that.code = 0;
    that.widget = widget;

    that.color = params.color;
    that.options = params.options;
    that.rect = params.rect;
    that.label = that.title = params.rect._name;
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

Node.prototype = {
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
                this.widget._links[adjacentLink.index].setAdjacentNodeHover(true);
            });
        } else {
            this.widget._links.forEach(function(link) {
                link.isAdjacentNodeHovered() && link.adjacentNodeHover(false);
            });
            this.hideTooltip();
        }

        this.widget._applyNodesAppearance();
        this.widget._applyLinksAppearance();
    },

    hover: function(state) {
        if(!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
            return;
        }

        this.widget._suspend();
        state && this.widget.clearHover();
        this.setState(1, state);
        this.widget._eventTrigger('nodeHoverChanged', { target: this });
        this.widget._resume();
    },

    setHover: function() {
        this.hover(true);
    },

    showTooltip: function(coords) {
        this.widget._getOption('hoverEnabled', true) && this.widget._tooltip && this.widget._tooltip.show({
            type: 'node',
            info: {
                label: this.label,
                title: this.label,
                weightIn: this.linksIn.reduce(function(previousValue, currentValue) { return previousValue + currentValue.weight; }, 0),
                weightOut: this.linksOut.reduce(function(previousValue, currentValue) { return previousValue + currentValue.weight; }, 0)
            }
        }, typeof coords !== 'undefined' ? { x: coords[0], y: coords[1] } : this.coords);
    },

    hideTooltip: function() {
        this.widget._tooltip && this.widget._tooltip.hide();
    },

    getLabelAttributes: function(labelSettings, filter) {
        return compileLabelAttrs(labelSettings, filter, this);
    }

};

module.exports = Node;
