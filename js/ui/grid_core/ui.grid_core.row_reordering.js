import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import Sortable from "../sortable";


var RowReorderingExtender = {
    _renderTable: function() {
        let rowDragging = this.option("rowDragging"),
            $tableElement = this.callBase.apply(this, arguments);

        if(rowDragging && rowDragging.enabled) {
            this._sortable = this._createComponent($tableElement, Sortable, extend({
                filter: "> tbody > .dx-data-row",
                template: this._getDraggableRowTemplate.bind(this)
            }, rowDragging));
        }

        return $tableElement;
    },

    _getDraggableGridOptions: function(options) {
        let gridOptions = this.option();

        return {
            dataSource: [options.data],
            showBorders: true,
            showColumnHeaders: false,
            scrolling: {
                useNative: false,
                showScrollbar: false
            },
            pager: {
                visible: false
            },
            loadingTimeout: undefined,
            columns: gridOptions.columns,
            customizeColumns: function(columns) {
                gridOptions.customizeColumns && gridOptions.customizeColumns.apply(this, arguments);

                columns.forEach((column) => {
                    column.groupIndex = undefined;
                });
            },
            showColumnLines: gridOptions.showColumnLines,
            rowTemplate: gridOptions.rowTemplate,
            onCellPrepared: gridOptions.onCellPrepared,
            onRowPrepared: gridOptions.onRowPrepared
        };
    },

    _getDraggableRowTemplate: function(options, index) {
        let $rootElement = this.component.$element(),
            $dataGridContainer = $("<div>").width($rootElement.width()),
            items = this._dataController.items(),
            row = items && items[index],
            gridOptions = this._getDraggableGridOptions(row);

        this._createComponent($dataGridContainer, "dxDataGrid", gridOptions);

        return $dataGridContainer;
    },
};


module.exports = {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions.rowDragging
             * @type object
             */
            rowDragging: {
                /**
                * @name GridBaseOptions.rowDragging.enabled
                * @type boolean
                * @default false
                */
                enabled: false,
                /**
                * @name GridBaseOptions.rowDragging.allowReordering
                * @type boolean
                * @default false
                */
                allowReordering: false
            }
        };
    },
    extenders: {
        views: {
            rowsView: RowReorderingExtender
        }
    }
};
