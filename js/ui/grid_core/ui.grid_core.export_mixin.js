"use strict";

import { extend } from "../../core/utils/extend";

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
        return !value ? 1 : value;
    },

    _cloneItem: function(item) {
        return extend({}, item, this._getEmptyCell());
    },

    _prepareItems: function(items) {
        var that = this,
            resultItems = [];

        const cols = (items[0] || []).reduce((sum, item) => sum + that._defaultSetter(item.colspan), 0);

        const getItem = (function(items) {
            let rowIndex = 0;
            let cellIndex = 0;

            return function() {
                const row = items[rowIndex] || [];
                const item = row[cellIndex++];
                if(cellIndex >= row.length) {
                    rowIndex++;
                    cellIndex = 0;
                }
                if(item) {
                    item.colspan = that._defaultSetter(item.colspan);
                    item.rowspan = that._defaultSetter(item.rowspan);
                }

                return item;
            };
        })(items);

        function addItem(rowIndex, cellIndex, item) {
            const row = resultItems[rowIndex] = resultItems[rowIndex] || [];
            row[cellIndex] = item;
            if(item.colspan > 1 || item.rowspan > 1) {
                const clone = that._cloneItem(item);
                for(let c = 1; c < item.colspan; c++) {
                    addItem(rowIndex, cellIndex + c, clone);
                }
                for(let r = 1; r < item.rowspan; r++) {
                    for(let c = 0; c < item.colspan; c++) {
                        addItem(rowIndex + r, cellIndex + c, clone);
                    }
                }
            }
        }

        let item = getItem();
        let rowIndex = 0;

        while(item) {
            for(let cellIndex = 0; cellIndex < cols; cellIndex++) {
                if(!item) {
                    break;
                }
                if(resultItems[rowIndex] && resultItems[rowIndex][cellIndex]) {
                    continue;
                }
                addItem(rowIndex, cellIndex, item);

                cellIndex += item.colspan - 1;

                item = getItem();
            }
            rowIndex++;
        }

        return resultItems;
    }
};
