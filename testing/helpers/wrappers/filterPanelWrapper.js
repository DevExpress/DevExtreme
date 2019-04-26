import { WrapperBase } from './wrapperBase.js';

export class FilterPanelWrapper extends WrapperBase {
    getIconFilter() {
        return this.getContainer().find(".dx-datagrid-filter-panel .dx-icon-filter");
    }

    getPanelText() {
        return this.getContainer().find(".dx-datagrid-filter-panel .dx-datagrid-filter-panel-text");
    }

    getClearFilterButton() {
        return this.getContainer().find(".dx-datagrid-filter-panel .dx-datagrid-filter-panel-clear-filter");
    }
}
