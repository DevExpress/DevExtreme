var $ = require('jquery');

exports.MockDataProvider = function(data, columns) {
    data = data || [
        [true, 'test1', 12, new Date('03/11/2014 12:00:00')],
        [true, 'test2', 122, new Date('04/11/2014 12:00:00')],
        [false, 'test3', 1, new Date('05/11/2014 12:00:00')],
        [false, 'ColumnClone', 4, new Date('06/11/2014 12:00:00')],
        [true, 'test5', 5, new Date('07/11/2014 12:00:00')],
        [true, 'ColumnClone', 5, new Date('07/11/2014 12:00:00')]
    ];

    columns = columns || [
        { dataType: 'boolean', width: 100, alignment: 'center', dataField: 'Column1', caption: 'Column1' },
        { dataType: 'string', width: 200, alignment: 'left', dataField: 'Column2', caption: 'ColumnClone' },
        { dataType: 'number', width: 150, alignment: 'right', dataField: 'Column3', caption: 'ColumnClone' },
        { dataType: 'date', width: 160, alignment: 'center', dataField: 'Column4', caption: 'Column4', format: 'shortDate' }
    ];

    return {
        getColumns: function(getAllColumns) {
            return getAllColumns ? [columns, columns] : columns;
        },

        getRowsCount: function() {
            return data.length;
        },

        getHeaderRowCount: function() {
            if(this.isHeadersVisible) {
                return 1;
            }
            return 0;
        },

        getGroupLevel: function(index) {
            return (index > 1) ? 1 : 0;
        },

        isGroupRow: function(index) {
            return (index === 2) ? true : false;
        },

        getCellData: function(rowIndex, cellIndex) {
            return { value: data[rowIndex][cellIndex] };
        },

        getCellType: function(rowIndex, cellIndex) {
            return this.getColumns()[cellIndex].dataType;
        },

        isHeadersVisible: function() {
            return true;
        },

        getStyles: sinon.stub().returns([{}]),

        getStyleId: sinon.stub().returns(0),

        getFrozenArea: function() {
            var that = this;

            return { x: 0, y: that.getHeaderRowCount() };
        },

        getCellMerging: sinon.stub().returns({})
    };
};

exports.checkUniqueValue = function checkUniqueValue(arrayTarget) {
    var tmpArray = [],
        i;

    for(i = 0; i < arrayTarget.length; i++) {
        if($.inArray(arrayTarget[i], tmpArray) === -1) {
            tmpArray.push(arrayTarget[i]);
        } else {
            return false;
        }
    }

    return true;
};
