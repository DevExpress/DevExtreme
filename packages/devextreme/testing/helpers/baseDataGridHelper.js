import DataGrid from 'ui/data_grid';
import gridCoreUtils from '__internal/grids/grid_core/m_utils';

import $ from 'jquery';

DataGrid.defaultOptions({
    options: {
        loadingTimeout: 0
    }
});

export const baseModuleConfig = {
    beforeEach: function() {
        this.oldIsElementInCurrentGrid = gridCoreUtils.isElementInCurrentGrid;
        gridCoreUtils.isElementInCurrentGrid = () => true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        gridCoreUtils.isElementInCurrentGrid = this.oldIsElementInCurrentGrid;
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
