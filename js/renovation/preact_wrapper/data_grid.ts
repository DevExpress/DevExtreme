/* eslint-disable */
import Component from './component';

export default class DataGrid extends Component {
    beginUpdate() {
        const gridInstance = (this as any).viewRef?.getComponentInstance();

        super.beginUpdate();
        gridInstance?.beginUpdate();
    }

    endUpdate() {
        const gridInstance = (this as any).viewRef?.getComponentInstance();

        super.endUpdate();
        gridInstance?.endUpdate();
    }
}
