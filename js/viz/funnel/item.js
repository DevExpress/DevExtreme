var states = ['normal', 'hover', 'selection', 'selection'],
    isDefined = require('../../core/utils/type').isDefined;

function parseStyles(color, style, baseStyle) {
    var border = style.border,
        baseBorder = baseStyle.border,
        borderVisible = isDefined(border.visible) ? border.visible : baseBorder.visible,
        borderWidth = isDefined(border.width) ? border.width : baseBorder.width;

    return {
        fill: color,
        hatching: style.hatching,
        stroke: border.color || baseBorder.color,
        'stroke-width': borderVisible ? borderWidth : 0
    };
}

function Item(widget, options) {
    var that = this,
        data = options.data;

    that.code = 0;
    that.widget = widget;

    that.figure = options.figure;
    that.argument = data.argument;
    that.value = data.value;
    that.data = data.dataItem;
    that.percent = options.percent;

    that.id = options.id;
    that.color = options.color;

    that.states = {
        normal: parseStyles(options.color, options.itemOptions, options.itemOptions),
        hover: parseStyles(options.color, options.itemOptions.hoverStyle, options.itemOptions),
        selection: parseStyles(options.color, options.itemOptions.selectionStyle, options.itemOptions)
    };
}

Item.prototype = {
    getState: function() {
        return states[this.code];
    },

    getNormalStyle: function() {
        return this.states.normal;
    },

    setHover: function() {
        this.hover(true);
    },

    hover: function(state) {
        if(!this.widget._getOption('hoverEnabled', true) || state === this.isHovered()) {
            return;
        }

        this.widget._suspend();
        state && this.widget.clearHover();
        this.setState(1, state);
        this.widget._eventTrigger('hoverChanged', { item: this });
        this.widget._resume();
    },

    setState: function(code, state) {
        if(state) {
            this.code |= code;
        } else {
            this.code &= ~code;
        }
        this.widget._applyTilesAppearance();
    },

    select: function(state) {
        var mode = this.widget._getOption('selectionMode', true);
        if(mode === 'none' || state === this.isSelected()) {
            return;
        }
        this.widget._suspend();
        if(state && mode !== 'multiple') {
            this.widget.clearSelection();
        }
        this.setState(2, state);
        this.widget._eventTrigger('selectionChanged', { item: this });
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
