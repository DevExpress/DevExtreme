"use strict";

var $ = require("../../core/renderer"),
    LayoutElementModule = require("../core/layout_element"),
    extend = require("../../core/utils/extend").extend,

    _extend = extend,
    _each = $.each;

function HeaderBlock() { }

_extend(HeaderBlock.prototype, LayoutElementModule.LayoutElement.prototype, {

    update: function(elements, canvas) {
        this._elements = $.map(elements, function(element) {
            return element.getLayoutOptions() ? element : null;
        });
        this._canvas = canvas;
    },

    dispose: function() {
        this._elements = null;
    },

    measure: function() {
        var that = this,
            layoutOptions = that.getLayoutOptions(),
            result;

        if(layoutOptions) {
            result = {
                size: [layoutOptions.width, layoutOptions.height],
                alignment: [layoutOptions.horizontalAlignment, layoutOptions.verticalAlignment],
                side: 1
            };
            _each(that._elements, function(_, elem) {
                elem.draw(layoutOptions.width, layoutOptions.height, that._canvas);
            });
        }

        return result || null;
    },

    getLayoutOptions: function() {
        var that = this,
            elements = that._elements,
            length = elements.length,
            firstElement,
            layout,
            elementLayout,
            i = 1;

        if(!length) {
            return null;
        }

        firstElement = elements[0];
        layout = _extend(true, {}, firstElement.getLayoutOptions());
        layout.position = layout.position || {};

        for(i; i < length; i++) {
            elementLayout = elements[i].getLayoutOptions();
            if(elementLayout.height > layout.height) {
                layout.height = elementLayout.height;
            }
            layout.width += elementLayout.width;
            if(elementLayout.position) {
                layout.position = elementLayout.position;
                layout.verticalAlignment = elementLayout.position.vertical;
                layout.horizontalAlignment = elementLayout.position.horizontal;
            }
        }
        return layout;
    },

    probeDraw: function(width, height) {
        this._elements.forEach(function(e) {
            e.probeDraw(width, height);
            width -= e.getLayoutOptions().width;
        });
    },

    draw: function(width, height) {
        var canvas = this._canvas;

        this._elements.forEach(function(e) {
            e.draw(width, height, canvas);
            width -= e.getLayoutOptions().width;
        });
    },

    shift: function(x, y) {
        _each(this._elements, function(_, elem) {
            elem.shift(x, y);
        });
    }
});

exports.HeaderBlock = HeaderBlock;
