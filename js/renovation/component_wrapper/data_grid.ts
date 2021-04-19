/* eslint-disable */
import Component from './component';
import type { DataGrid } from '../ui/grids/data_grid/data_grid';
import { updatePropsImmutable } from './utils';
import { DataGridProps } from '../ui/grids/data_grid/common/data_grid_props';


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

    _wrapKeyDownHandler(handler) {
        return handler;
    }
    
    _optionChanging(fullName: string, value: unknown, prevValue: unknown): void {
        super._optionChanging(fullName, value, prevValue);
        if(this.viewRef) {
            const name = fullName.split(/[.[]/)[0];
            const prevProps = { ...(this.viewRef as DataGrid).prevProps };
            updatePropsImmutable(prevProps, this.option(), name, fullName);
            (this.viewRef as DataGrid).prevProps = prevProps;
        }
    }

    _optionChanged(e): void {
        const gridInstance = (this.viewRef as DataGrid)?.getComponentInstance?.();
        if (e.fullName === 'dataSource' && e.value === gridInstance?.option('dataSource')) {
            gridInstance?.option('dataSource', e.value);
        }
        super._optionChanged(e);
    }

    _createTemplateComponent(props: any, templateOption: any): any {
        return templateOption;
    }
}
