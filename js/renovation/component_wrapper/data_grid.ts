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
}
