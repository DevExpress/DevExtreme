"use strict";

var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend;

module.exports = {
    _getEmptyCell: function() {
        return {
            text: '',
            value: undefined,
            colspan: 1,
            rowspan: 1
        };
    },

    _defaultSetter: function(value) {
        value = parseInt(value, 10);
        return !value ? 1 : value;
    },

    _makeRowOffset: function(resultItems) {
        var offset = 0,
            rowIndex = resultItems.length - 1,
            row = resultItems[rowIndex],
            cellIndex = row.length;

        $.each(resultItems, function(rowIndex) {
            if(this[cellIndex] && this[cellIndex].rowspan + rowIndex > resultItems.length - 1) {
                offset = Math.max.apply(this, [this[cellIndex].colspan, offset]);
            }
        });

        for(var i = 0; i < offset; i++) {
            row.push(this._cloneItem(resultItems[resultItems.length - 2][cellIndex && cellIndex - 1 || 0]));
        }

        if(offset > 0) {
            this._makeRowOffset(resultItems);
        }
    },

    _cloneItem: function(item) {
        return extend({}, item, this._getEmptyCell());
    },

    _prepareItems: function(cols, items) {
        var that = this,
            i,
            row,
            cellIndex,
            rowIndex,
            resultItems = [];

        for(rowIndex = 0; rowIndex < items.length; rowIndex++) {
            row = [];
            resultItems.push(row);
            do {
                that._makeRowOffset(resultItems);
                cellIndex = row.length;

                row.push(items[rowIndex].shift());
                if(row[row.length - 1]) {
                    row[row.length - 1].colspan = that._defaultSetter(row[row.length - 1].colspan);
                    row[row.length - 1].rowspan = that._defaultSetter(row[row.length - 1].rowspan);
                } else {
                    row[row.length - 1] = $({}, that._getEmptyCell());
                }
                for(i = 1; i < row[cellIndex].colspan; i++) {
                    row.push(that._cloneItem(row[row.length - 1]));
                }
            } while(items[rowIndex].length);
            while(row.length < cols) {
                row.push(that._cloneItem(row[row.length - 1]));
            }
        }

        return resultItems;
    }
};
