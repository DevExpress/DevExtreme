/* eslint-disable @typescript-eslint/ban-types */
import { getPathParts } from '../../core/utils/data';
import Component, { ComponentWrapperProps } from './common/component';
import type { DataGridForComponentWrapper, GridInstance } from '../ui/grids/data_grid/common/types';
import gridCore from '../../ui/data_grid/ui.data_grid.core';
import { updatePropsImmutable } from './utils/update_props_immutable';
import type { TemplateComponent, Option } from './common/types';
import type { ExcelCellInfo, Export, OptionChangedEvent } from '../../ui/data_grid';

import { themeReadyCallback } from '../../ui/themes_callback';
import componentRegistratorCallbacks from '../../core/component_registrator_callbacks';

let dataGridClass: { defaultOptions: (options: unknown) => void } | null = null;

/* istanbul ignore next: temporary workaround */
// TODO remove when defaultOptionRules initialization problem will be fixed
componentRegistratorCallbacks.add((name, componentClass) => {
  if (name === 'dxDataGrid') {
    dataGridClass = componentClass;
  }
});

export default class DataGridWrapper extends Component {
  static registerModule = gridCore.registerModule.bind(gridCore);

  _onInitialized!: Function;

  _skipInvalidate = false;

  // TODO remove when defaultOptionRules initialization problem will be fixed
  constructor(element: Element, options: ComponentWrapperProps) {
    /* istanbul ignore next: temporary workaround */
    super(element, (dataGridClass?.defaultOptions({}), options));
  }

  state(state?: Record<string, unknown>): Record<string, unknown> | undefined {
    const internalInstance = this._getInternalInstance();

    if (internalInstance) {
      if (state === undefined) {
        return internalInstance.state();
      }
      internalInstance.state(state);
    }
    return undefined;
  }

  getController(name: string): unknown {
    return this._getInternalInstance()?.getController(name);
  }

  getView(name: string): unknown {
    return this._getInternalInstance()?.getView(name);
  }

  beginUpdate(): void {
    super.beginUpdate();
    this._getInternalInstance()?.beginUpdate();
  }

  endUpdate(): void {
    super.endUpdate();
    this._getInternalInstance()?.endUpdate();
  }

  isReady(): boolean {
    return this._getInternalInstance()?.isReady();
  }

  _getInternalInstance(): GridInstance {
    return (this.viewRef as DataGridForComponentWrapper)?.getComponentInstance();
  }

  _fireContentReady(): void {}

  _wrapKeyDownHandler(handler: Function): Function {
    return handler;
  }

  _optionChanging(fullName: string, prevValue: unknown, value: unknown): void {
    super._optionChanging(fullName, prevValue, value);
    if (this.viewRef && prevValue !== value) {
      const name = getPathParts(fullName)[0];
      const prevProps = { ...(this.viewRef as DataGridForComponentWrapper).prevProps };

      if (name === 'editing' && name !== fullName) {
        // T751778
        // TODO remove when silent assign will be removed from editing
        updatePropsImmutable(prevProps, this.option(), name, name);
      }
      updatePropsImmutable(prevProps, this.option(), name, fullName);

      (this.viewRef as DataGridForComponentWrapper).prevProps = prevProps;
    }
  }

  _optionChanged(e: Option): void {
    const internalInstance = this._getInternalInstance();
    if (internalInstance && e.fullName === 'dataSource' && e.value === internalInstance.option('dataSource')) {
      internalInstance.option('dataSource', e.value as string);
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

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    // eslint-disable-next-line no-param-reassign
    options.onInitialized = this._onInitialized;

    const exportOptions = options.export as Export;
    const originalCustomizeExcelCell = exportOptions?.customizeExcelCell;

    if (originalCustomizeExcelCell) {
      exportOptions.customizeExcelCell = (e: ExcelCellInfo): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e as any).component = this;
        return originalCustomizeExcelCell(e);
      };
    }

    const { onInitialized } = options;

    if (onInitialized) {
      // eslint-disable-next-line no-param-reassign
      options.onInitialized = (e: { component: Component }): void => {
        e.component = this;
        (onInitialized as Function)(e);
      };
    }

    return super._patchOptionValues(options);
  }

  _renderWrapper(props: Record<string, unknown>): void {
    const isFirstRender = !this._isNodeReplaced;
    super._renderWrapper(props);
    if (isFirstRender) {
      this._getInternalInstance().on('optionChanged', this._internalOptionChangedHandler.bind(this));
    }
  }

  _internalOptionChangedHandler(e: OptionChangedEvent): void {
    const isSecondLevelOption = e.name !== e.fullName;

    if (isSecondLevelOption && e.value !== e.previousValue) {
      if (e.fullName.startsWith('columns[')) {
        if (this.option(e.fullName) !== e.value) {
          this._skipInvalidate = true;
          this._notifyOptionChanged(e.fullName, e.value, e.previousValue);
          this._skipInvalidate = false;
        }
      } else {
        this._skipInvalidate = true;
        this._options.silent(e.fullName, e.previousValue);
        this.option(e.fullName, e.value);
        this._skipInvalidate = false;
      }
    }
  }

  _invalidate(): void {
    if (this._skipInvalidate) return;

    super._invalidate();
  }

  _setOptionsByReference(): void {
    super._setOptionsByReference();

    // eslint-disable-next-line @typescript-eslint/dot-notation
    this._optionsByReference['focusedRowKey'] = true;
    this._optionsByReference['editing.editRowKey'] = true;
    this._optionsByReference['editing.changes'] = true;
  }

  _setDeprecatedOptions(): void {
    super._setDeprecatedOptions();

    // eslint-disable-next-line @typescript-eslint/dot-notation
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

themeReadyCallback.add();
