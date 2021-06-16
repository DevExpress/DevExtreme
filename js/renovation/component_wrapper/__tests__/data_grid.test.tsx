/* eslint-disable @typescript-eslint/ban-types */
import DataGridComponent from '../data_grid';

const mockInternalComponent = {
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  isReady: jest.fn(),
  getView: jest.fn(),
  getController: jest.fn(),
  state: jest.fn(),
  on: jest.fn(),
  option: jest.fn(),
};

const mockComponent = {
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  _fireContentReady: jest.fn(),
  _wrapKeyDownHandler: jest.fn(),
  _renderWrapper: jest.fn(),
  _invalidate: jest.fn(),
  _setOptionsByReference: jest.fn(),
  _setDeprecatedOptions: jest.fn(),
  _getAdditionalProps: jest.fn(() => []),
  _patchOptionValues: jest.fn((options) => options),
  _notifyOptionChanged: jest.fn(),
  _optionChanging: jest.fn(),
  _optionChanged: jest.fn(),
  silent: jest.fn(),
  getOption: jest.fn(),
  setOption: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeInitialization: (_instance) => { },
};
jest.mock('../common/component', () => class {
  __options: Record<string, unknown>;

  _options = {
    silent: mockComponent.silent,
  };

  _isNodeReplaced = false;

  _deprecatedOptions: Record<string, unknown> = {
  };

  _optionsByReference: Record<string, unknown> = {
  };

  viewRef = {
    getComponentInstance: () => mockInternalComponent,
  };

  constructor(_element: HTMLElement, options?: Record<string, unknown>) {
    this.__options = options ?? {};
    this._initializeComponent();
    this._initMarkup();
  }

  option(name: string, value: any) {
    if (arguments.length === 0) {
      return this.__options;
    }

    if (arguments.length === 1) {
      return mockComponent.getOption(name);
    }

    if (arguments.length === 2) {
      mockComponent.setOption(name, value);
      this._invalidate();
    }

    return undefined;
  }

  repaint() {
    this._initMarkup();
  }

  _optionChanging() {
    mockComponent._optionChanging();
  }

  _optionChanged() {
    mockComponent._optionChanged();
  }

  _initializeComponent() {
    mockComponent.beforeInitialization(this as any);
    this._setDeprecatedOptions();
    this._setOptionsByReference();
  }

  _initMarkup() {
    const props = { ...this.__options };
    const patchedProps = this._patchOptionValues(props);

    this._renderWrapper(patchedProps);
    this._fireContentReady();
  }

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    const result = {};
    const dataGridProps = ['dataSource'];
    dataGridProps.concat(this._getAdditionalProps()).forEach((name) => {
      if (name in options) {
        result[name] = options[name];
      }
    });

    return result;
  }

  _renderWrapper(options: Record<string, unknown>): void {
    mockComponent._renderWrapper(options);
    this._isNodeReplaced = true;
  }

  beginUpdate() {
    return mockComponent.beginUpdate();
  }

  endUpdate() {
    return mockComponent.endUpdate();
  }

  _fireContentReady(): void {
    return mockComponent._fireContentReady();
  }

  _wrapKeyDownHandler(handler: Function): Function {
    return mockComponent._wrapKeyDownHandler(handler);
  }

  _invalidate(): void {
    mockComponent._invalidate();
  }

  _setOptionsByReference(): void {
    this._optionsByReference.baseOptionByReference = true;
  }

  _setDeprecatedOptions(): void {
    this._deprecatedOptions.baseDeprecatedOption = true;
  }

  _getAdditionalProps(): string[] {
    return ['baseAdditionalProp'];
  }

  _notifyOptionChanged(name: string, value: any, prevValue: any): void {
    mockComponent._notifyOptionChanged(name, value, prevValue);
    this._invalidate();
  }
});

describe('DataGrid Wrapper', () => {
  beforeEach(() => jest.resetAllMocks());

  const createDataGrid = (
    options?: any,
  ) => new DataGridComponent({} as HTMLElement, options);

  it('options by reference', () => {
    const component = createDataGrid();

    expect(component._optionsByReference).toEqual({
      baseOptionByReference: true,
      focusedRowKey: true,
      'editing.editRowKey': true,
      'editing.changes': true,
    });
  });

  it('deprecated options', () => {
    const component = createDataGrid();

    expect(component._deprecatedOptions).toEqual({
      baseDeprecatedOption: true,
      useKeyboard: { since: '19.2', alias: 'keyboardNavigation.enabled' },
    });
  });

  it('base component additional props should be passed to ViewComponent', () => {
    createDataGrid({
      baseAdditionalProp: true,
    });

    expect(mockComponent._renderWrapper).toBeCalledWith({
      onInitialized: undefined,
      baseAdditionalProp: true,
    });
  });

  it('additional props should be passed to ViewComponent', () => {
    const viewComponentProps = {
      onInitialized: true,
      onColumnsChanging: true,
      integrationOptions: true,
      adaptColumnWidthByRatio: true,
      useLegacyKeyboardNavigation: true,
      templatesRenderAsynchronously: true,
      forceApplyBindings: true,
      nestedComponentOptions: true,
    };

    createDataGrid({
      ...viewComponentProps,
      customProp: true,
    });

    expect(mockComponent._renderWrapper).toBeCalledWith(viewComponentProps);
  });

  it('onInitialized option should not be defined in _initializeComponent', () => {
    const onInitialized = () => { };
    let onInitializedInInitializeComponent: unknown = {};

    mockComponent.beforeInitialization = (component) => {
      onInitializedInInitializeComponent = component.option().onInitialized;
    };

    createDataGrid({ onInitialized });

    expect(onInitializedInInitializeComponent).toBe(null);
    expect(mockComponent._renderWrapper).toBeCalledWith({
      onInitialized,
    });
  });

  it('subscribe to internal optionChanged event', () => {
    createDataGrid();

    expect(mockInternalComponent.on).toBeCalledTimes(1);
    expect(mockInternalComponent.on).toBeCalledWith('optionChanged', expect.any(Function));
  });

  it('not subscribe to internal optionChanged event on repaint', () => {
    const component = createDataGrid();

    expect(mockInternalComponent.on).toBeCalledTimes(1);

    component.repaint();

    expect(mockInternalComponent.on).toBeCalledTimes(1);
  });

  it('_createTemplateComponent should pass template without processing', () => {
    const component = createDataGrid();

    const templateComponent = component._createTemplateComponent('myTemplate');

    expect(templateComponent).toBe('myTemplate');
  });

  it('_wrapKeyDownHandler should pass handler without processing', () => {
    const component = createDataGrid();

    const handler = () => { };

    const wrappedHandler = component._wrapKeyDownHandler(handler);

    expect(wrappedHandler).toBe(handler);
  });

  describe('_optionChanging', () => {
    it('no viewRef', () => {
      const component: any = createDataGrid();
      component.viewRef = null;
      component._optionChanging('pager.pageSize', 5, 10);
      expect(mockComponent._optionChanging).toBeCalledTimes(1);
    });

    it('complex option changed', () => {
      const component: any = createDataGrid();
      const prevProps = { pager: { pageSize: 5 } };
      component.__options = prevProps;
      component.viewRef.prevProps = prevProps;
      component._optionChanging('pager.pageSize', 5, 10);
      // emulate base component mutable option change
      component.__options.pager.pageSize = 10;
      // value in prev props shouldn't change for future getUpdatedOptions
      expect(prevProps.pager).not.toBe(component.viewRef.prevProps.pager);
      expect(component.viewRef.prevProps.pager.pageSize).toBe(5);
    });
  });

  describe('_optionChanged', () => {
    it('no viewRef', () => {
      const component: any = createDataGrid();
      component.viewRef = null;
      component._optionChanged();
      expect(mockComponent._optionChanged).toBeCalledTimes(1);
    });

    it('If dataSource not changed update it directly for refresh data', () => {
      const dataSource = {};
      const component: any = createDataGrid();
      component.__options = { dataSource };
      mockInternalComponent.option.mockReturnValueOnce(dataSource);
      component._optionChanged({ fullName: 'dataSource', value: dataSource });
      expect(mockInternalComponent.option).toBeCalledTimes(2);
      expect(mockInternalComponent.option).toBeCalledWith('dataSource', dataSource);
    });
  });

  describe('_internalOptionChangedHandler and _invalidate', () => {
    it('option change should call _invalidate', () => {
      const component = createDataGrid();

      expect(mockComponent._invalidate).toBeCalledTimes(0);

      component.option('someOption', true);

      expect(mockComponent._invalidate).toBeCalledTimes(1);
    });

    it('_notifyOptionChanged should be called if column option is changed in internal widget', () => {
      const component = createDataGrid();

      component._internalOptionChangedHandler({
        name: 'columns',
        fullName: 'columns[0].visible',
        previousValue: false,
        value: true,
        component: component._getInternalInstance(),
        element: {} as HTMLElement,
      });

      expect(mockComponent._notifyOptionChanged).toBeCalledTimes(1);
      expect(mockComponent._invalidate).toBeCalledTimes(0);
    });

    it('_notifyOptionChanged should not be called if column option is changed to the same value in internal widget', () => {
      const component = createDataGrid();

      component._internalOptionChangedHandler({
        name: 'columns',
        fullName: 'columns[0].visible',
        previousValue: true,
        value: true,
        component: component._getInternalInstance(),
        element: {} as HTMLElement,
      });

      expect(mockComponent._notifyOptionChanged).toBeCalledTimes(0);
    });

    it('_notifyOptionChanged should not be called if option is not changed in internal widget', () => {
      const component = createDataGrid();

      mockComponent.getOption.mockReturnValue(false);

      component._internalOptionChangedHandler({
        name: 'columns',
        fullName: 'columns[0].visible',
        previousValue: true,
        value: false,
        component: component._getInternalInstance(),
        element: {} as HTMLElement,
      });

      expect(mockComponent.getOption).toBeCalledTimes(1);
      expect(mockComponent.getOption).toBeCalledWith('columns[0].visible');
      expect(mockComponent._notifyOptionChanged).toBeCalledTimes(0);
    });

    it('_notifyOptionChanged and option should not be called if first level option is changed in internal widget', () => {
      const component = createDataGrid();

      component._internalOptionChangedHandler({
        name: 'selectedRowKeys',
        fullName: 'selectedRowKeys',
        previousValue: [],
        value: [1],
        component: component._getInternalInstance(),
        element: {} as HTMLElement,
      });

      expect(mockComponent._notifyOptionChanged).toBeCalledTimes(0);
      expect(mockComponent.setOption).toBeCalledTimes(0);
    });

    it('option should be called if second level option is changed in internal widget', () => {
      const component = createDataGrid();

      component._internalOptionChangedHandler({
        name: 'editing',
        fullName: 'editing.editRowKey',
        previousValue: null,
        value: 1,
        component: component._getInternalInstance(),
        element: {} as HTMLElement,
      });

      expect(mockComponent._notifyOptionChanged).toBeCalledTimes(0);
      expect(mockComponent.silent).toBeCalledTimes(1);
      expect(mockComponent.silent).toBeCalledWith('editing.editRowKey', null);
      expect(mockComponent.setOption).toBeCalledTimes(1);
      expect(mockComponent.setOption).toBeCalledWith('editing.editRowKey', 1);
    });
  });

  describe('public methods', () => {
    it('beginUpdate', () => {
      const component = createDataGrid();

      component.beginUpdate();

      expect(mockComponent.beginUpdate).toBeCalledTimes(1);
      expect(mockInternalComponent.beginUpdate).toBeCalledTimes(1);
    });

    it('endUpdate', () => {
      const component = createDataGrid();

      component.endUpdate();

      expect(mockComponent.endUpdate).toBeCalledTimes(1);
      expect(mockInternalComponent.endUpdate).toBeCalledTimes(1);
    });

    it('getController', () => {
      const component = createDataGrid();

      mockInternalComponent.getController.mockReturnValue('testController');

      const controller = component.getController('editing');

      expect(controller).toBe('testController');
      expect(mockInternalComponent.getController).toBeCalledWith('editing');
    });

    it('getView', () => {
      const component = createDataGrid();

      mockInternalComponent.getView.mockReturnValue('testView');

      const view = component.getView('rowsView');

      expect(view).toBe('testView');
      expect(mockInternalComponent.getView).toBeCalledWith('rowsView');
    });

    it('isReady', () => {
      const component = createDataGrid();

      mockInternalComponent.isReady.mockReturnValue(true);

      const isReady = component.isReady();

      expect(isReady).toBe(true);
      expect(mockInternalComponent.isReady).toBeCalled();
    });

    it('state without parameters', () => {
      const component = createDataGrid();

      const state = {};

      mockInternalComponent.state.mockReturnValue(state);

      const stateResult = component.state();

      expect(stateResult).toBe(state);
      expect(mockInternalComponent.state).toBeCalledWith();
    });

    it('state with parameter', () => {
      const component = createDataGrid();

      const state = {};

      const stateResult = component.state(state);

      expect(stateResult).toBe(undefined);
      expect(mockInternalComponent.state).toBeCalledWith(state);
    });

    test.each`
    methodName
    ${'beginUpdate'}
    ${'endUpdate'}
    ${'getController'}
    ${'getView'}
    ${'isReady'}
    ${'state'}
    `('$methodName call is viewRef is not defined', ({ methodName }) => {
      const component = createDataGrid();

      (component as any).viewRef = null;

      component[methodName]();

      expect.assertions(0);
    });
  });
});
