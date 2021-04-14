/* eslint-disable */
import Component from './component';
import type { DataGrid } from '../ui/grids/data_grid/data_grid';

export default class DataGridWrapper extends Component {
    beginUpdate() {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        super.beginUpdate();
        gridInstance?.beginUpdate();
    }

    endUpdate() {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        super.endUpdate();
        gridInstance?.endUpdate();
    }

    isReady() {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        return gridInstance?.isReady();
    }

    getView(name) {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        return gridInstance?.getView(name);
    }

    getController(name) {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        return gridInstance?.getController(name);
    }

    state(state) {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        return gridInstance?.state(state);
    }

    // TODO remove this after fixing the synchronization of the grid options
    _optionChanged(e): void {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance();

        gridInstance?.option(e.fullName, e.value);

        super._optionChanged(e);
    }
}
