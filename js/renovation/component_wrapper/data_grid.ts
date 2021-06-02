/* eslint-disable */
import Component from './common/component';
import type { DataGridForComponentWrapper } from '../ui/grids/data_grid/common/types';
import gridCore from '../../ui/data_grid/ui.data_grid.core';
import { updatePropsImmutable } from "./utils/update_props_immutable";
import type { TemplateComponent } from './common/types';

export default class DataGridWrapper extends Component {
    _onInitialized!: Function;

    _fireContentReady() {}

    static registerModule = gridCore.registerModule.bind(gridCore);

    beginUpdate() {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        super.beginUpdate();
        gridInstance?.beginUpdate();
    }

    endUpdate() {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        super.endUpdate();
        gridInstance?.endUpdate();
    }

    isReady() {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        return gridInstance?.isReady();
    }

    getView(name) {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        return gridInstance?.getView(name);
    }

    getController(name) {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        return gridInstance?.getController(name);
    }

    state(state) {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();

        return gridInstance?.state(state);
    }

    _wrapKeyDownHandler(handler) {
        return handler;
    }

    _optionChanging(fullName: string, prevValue: unknown, value: unknown): void {
        super._optionChanging(fullName, prevValue, value);
        if(this.viewRef) {
            const name = fullName.split(/[.[]/)[0];
            const prevProps = { ...(this.viewRef as DataGridForComponentWrapper).prevProps };

            updatePropsImmutable(prevProps, this.option(), name, fullName);
            (this.viewRef as DataGridForComponentWrapper).prevProps = prevProps;
        }
    }

    _optionChanged(e): void {
        const gridInstance = (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance?.();
        if (e.fullName === 'dataSource' && e.value === gridInstance?.option('dataSource')) {
            gridInstance?.option('dataSource', e.value);
        }
        super._optionChanged(e);
    }

    _createTemplateComponent(templateOption: unknown): TemplateComponent | undefined {
        return templateOption as (TemplateComponent | undefined);
    }

    _initializeComponent(): void {
        const options = this.option();
        this._onInitialized = options.onInitialized as Function;
        options.onInitialized = null;
        super._initializeComponent();
    }

    _patchOptionValues(options) {
        options.onInitialized = this._onInitialized;
        options.complexOptionChanged = (e) => {
            if(e.fullName.startsWith('columns[')) {
                if(this.option(e.fullName) !== e.value) {
                    this._notifyOptionChanged(e.fullName, e.value, e.previousValue);
                }
            } else {
                this.option(e.fullName, e.value);
            }
        }
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

    _getAdditionalProps(): string[] {
        return super._getAdditionalProps().concat([
            'onInitialized', 
            'integrationOptions', 
            'adaptColumnWidthByRatio', 
            'useLegacyKeyboardNavigation'
        ]);
    }
}