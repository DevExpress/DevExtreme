/* eslint-disable */
import Component from './component';
import type { DataGrid } from '../ui/grids/data_grid/data_grid';
import gridCore from '../../ui/data_grid/ui.data_grid.core';

export default class DataGridWrapper extends Component {
    static registerModule = gridCore.registerModule.bind(gridCore);
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
        if(e.name !== e.fullName) {
            gridInstance?._optionChanged(e);
        }

        super._optionChanged(e);
    }

    _createTemplateComponent(props: any, templateOption: any): any {
        return templateOption;
    }

    _initializeComponent(): void {
        const options = this.option();
        this._onInitialized = options.onInitialized;
        options.onInitialized = null;
        super._initializeComponent();
    }

    _patchOptionValues(options) {
        options.onInitialized = this._onInitialized;
        return super._patchOptionValues(options);
    }

    _setOptionsByReference() {
        super._setOptionsByReference();

        this._optionsByReference['focusedRowKey'] = true;
        this._optionsByReference['editing.editRowKey'] = true;
        this._optionsByReference['editing.changes'] = true;
    }

    _setDeprecatedOptions() {
        super._setDeprecatedOptions();

        this._deprecatedOptions['useKeyboard'] = { since: '19.2', alias: 'keyboardNavigation.enabled' };
    }
}