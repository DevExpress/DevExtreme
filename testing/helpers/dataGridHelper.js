import DataGrid from 'ui/data_grid';

import $ from 'jquery';

import 'generic_light.css!';

DataGrid.defaultOptions({
    options: {
        loadingTimeout: 0
    }
});

export const baseModuleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
};

export const createDataGrid = (options, $container) => {
    const dataGridElement = ($container || $('#dataGrid')).dxDataGrid(options);

    QUnit.assert.ok(dataGridElement);
    const dataGrid = dataGridElement.dxDataGrid('instance');
    return dataGrid;
};

export const isChildInsideParentViewport = (parentElement, childElement) => {
    const $parent = $(parentElement);
    const $child = $(childElement);
    const parentInfo = $parent.offset();
    const childInfo = $child.offset();
    let result = false;

    parentInfo.bottom = parentInfo.top + $parent.outerHeight();
    childInfo.bottom = childInfo.top + $child.outerHeight();

    result = (childInfo.top > parentInfo.top && childInfo.top < parentInfo.bottom)
            || (childInfo.bottom > parentInfo.top && childInfo.bottom < parentInfo.bottom)
            || (childInfo.top < parentInfo.top && childInfo.bottom > parentInfo.bottom);

    return result;
};
