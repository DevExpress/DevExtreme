import DataGrid from 'ui/data_grid';

import $ from 'jquery';

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

export const findShadowHostOrDocument = (element) => {
    const shadowHost = element.getRootNode && element.getRootNode().host;

    return shadowHost || document;
};
