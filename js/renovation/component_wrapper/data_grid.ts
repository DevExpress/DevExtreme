/* eslint-disable */
import Component from './common/component';
import type { DataGridForComponentWrapper, GridInstance } from '../ui/grids/data_grid/common/types';
import gridCore from '../../ui/data_grid/ui.data_grid.core';
import { updatePropsImmutable } from "./utils/update_props_immutable";
import type { TemplateComponent } from './common/types';
import type { OptionChangedEvent } from '../../ui/data_grid';

export default class DataGridWrapper extends Component {
    _onInitialized!: Function;
    _skipInvalidate = false;

    static registerModule = gridCore.registerModule.bind(gridCore);

    beginUpdate() {
        super.beginUpdate();
        this._getInternalInstance()?.beginUpdate();
    }

    endUpdate() {
        super.endUpdate();
        this._getInternalInstance()?.endUpdate();
    }

    isReady() {
        return this._getInternalInstance()?.isReady();
    }

    getView(name) {
        return this._getInternalInstance()?.getView(name);
    }

    getController(name) {
        return this._getInternalInstance()?.getController(name);
    }

    state(state) {
        return this._getInternalInstance()?.state(state);
    }

    _getInternalInstance(): GridInstance {
        return (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();
    }

    _fireContentReady() {}

    _wrapKeyDownHandler(handler) {
        return handler;
    }

    _optionChanging(fullName: string, prevValue: unknown, value: unknown): void {
        super._optionChanging(fullName, prevValue, value);
        if(this.viewRef && prevValue !== value) {
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

        return super._patchOptionValues(options);
    }

    _renderWrapper(props: Record<string, unknown>): void {
        const isFirstRender = !this._isNodeReplaced;
        super._renderWrapper(props);
        if(isFirstRender) {
            this._getInternalInstance().on('optionChanged', this._internalOptionChangedHandler.bind(this));
        }
    }

    _internalOptionChangedHandler(e: OptionChangedEvent): void {
        const internalOptionValue = e.component.option(e.fullName);
        const isValueCorrect = e.value === internalOptionValue || e.fullName.startsWith('columns[');
        const isSecondLevelOption = e.name !== e.fullName;
    
        if (isSecondLevelOption && e.value !== e.previousValue && isValueCorrect) {
            if(e.fullName.startsWith('columns[')) {
                if(this.option(e.fullName) !== e.value) {
                    this._skipInvalidate = true;
                    this._notifyOptionChanged(e.fullName, e.value, e.previousValue);
                    this._skipInvalidate = false;
                }
            } else {
                this._skipInvalidate = true;
                this.option(e.fullName, e.value);
                this._skipInvalidate = false;
            }
        }
    }

    _invalidate() {
        if(this._skipInvalidate) return;

        super._invalidate();
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
            'onColumnsChanging', // for dashboards
            'integrationOptions',
            'adaptColumnWidthByRatio', 
            'useLegacyKeyboardNavigation',
            'templatesRenderAsynchronously',
            'forceApplyBindings',
            'nestedComponentOptions',
        ]);
    }
}