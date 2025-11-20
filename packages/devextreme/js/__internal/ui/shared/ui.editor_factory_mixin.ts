import '@js/ui/text_box';
import '@js/ui/number_box';
import '@js/ui/check_box';
import '@js/ui/select_box';
import '@js/ui/date_box';

import eventsEngine from '@js/common/core/events/core/events_engine';
import { normalizeKeyName } from '@js/common/core/events/utils/index';
import { normalizeDataSourceOptions } from '@js/common/data/data_source/utils';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { compileGetter } from '@js/core/utils/data';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction, isObject } from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';

const { isWrapped } = variableWrapper;

const CHECKBOX_SIZE_CLASS = 'checkbox-size';
const EDITOR_INLINE_BLOCK = 'dx-editor-inline-block';

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-return
const getResultConfig = (config, options) => extend(config, {
  readOnly: options.readOnly,
  placeholder: options.placeholder,
  inputAttr: {
    id: options.id,
    'aria-labelledby': options['aria-labelledby'],
  },
  tabIndex: options.tabIndex,
}, options.editorOptions);

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const checkEnterBug = (): boolean | undefined => browser.mozilla || devices.real().ios; // Workaround for T344096, T249363, T314719, caused by https://connect.microsoft.com/IE/feedback/details/1552272/

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTextEditorConfig = (options) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  const isEnterBug = checkEnterBug();
  const sharedData = options.sharedData || data;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return getResultConfig({
    placeholder: options.placeholder,
    width: options.width,
    value: options.value,
    onValueChanged(e) {
      const needDelayedUpdate = options.parentType === 'filterRow' || options.parentType === 'searchPanel';
      const isInputOrKeyUpEvent = e.event && (e.event.type === 'input' || e.event.type === 'keyup');
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const updateValue = function (e, notFireEvent?): void {
        options?.setValue(e.value, notFireEvent);
      };

      clearTimeout(data.valueChangeTimeout);

      if (isInputOrKeyUpEvent && needDelayedUpdate) {
        // eslint-disable-next-line no-multi-assign,no-restricted-globals
        sharedData.valueChangeTimeout = data.valueChangeTimeout = setTimeout((): void => {
          updateValue(e, data.valueChangeTimeout !== sharedData.valueChangeTimeout);
        }, isDefined(options.updateValueTimeout) ? options.updateValueTimeout : 0);
      } else {
        updateValue(e);
      }
    },
    onKeyDown(e): void {
      if (isEnterBug && normalizeKeyName(e.event) === 'enter') {
        // @ts-expect-error ts-error
        eventsEngine.trigger($(e.component._input()), 'change');
      }
    },
    valueChangeEvent: `change${options.parentType === 'filterRow' ? ' keyup input' : ''}`,
  }, options);
};

function watchLookupDataSource(options): void {
  if (options.row?.watch && options.parentType === 'dataRow') {
    const editorOptions = options.editorOptions || {};

    options.editorOptions = editorOptions;

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let selectBox;
    const { onInitialized } = editorOptions;
    editorOptions.onInitialized = function (e): void {
      // eslint-disable-next-line prefer-rest-params
      onInitialized?.apply(this, arguments);
      selectBox = e.component;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      selectBox.on('disposing', stopWatch);
    };

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let dataSource;
    const stopWatch = options.row.watch(() => {
      dataSource = options.lookup.dataSource(options.row);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return dataSource?.filter;
    }, () => {
      selectBox.option('dataSource', dataSource);
    }, (row) => {
      options.row = row;
    });
  }
}

const prepareDateBox = (options): void => {
  options.editorName = 'dxDateBox';

  options.editorOptions = getResultConfig({
    value: options.value,
    onValueChanged(args): void {
      options.setValue(args.value);
    },
    onKeyDown({ component, event }): void {
      const useMaskBehavior = component.option('useMaskBehavior');

      if ((checkEnterBug() || useMaskBehavior) && normalizeKeyName(event) === 'enter') {
        component.blur();
        component.focus();
      }
    },
    displayFormat: options.format,
    type: options.dataType,
    dateSerializationFormat: null,
    width: options.parentType === 'filterBuilder' ? undefined : 'auto',
  }, options);
};

const prepareTextBox = (options): void => {
  const config = getTextEditorConfig(options);
  const isSearching = options.parentType === 'searchPanel';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const toString = (value): string => (isDefined(value) ? value.toString() : '');

  if (options.editorType && options.editorType !== 'dxTextBox') {
    config.value = options.value;
  } else {
    config.value = toString(options.value);
  }
  config.valueChangeEvent += isSearching ? ' keyup input search' : '';
  config.mode = config.mode || (isSearching ? 'search' : 'text');

  options.editorName = 'dxTextBox';
  options.editorOptions = config;
};

const prepareNumberBox = (options): void => {
  const config = getTextEditorConfig(options);

  config.value = isDefined(options.value) ? options.value : null;

  options.editorName = 'dxNumberBox';

  options.editorOptions = config;
};

function prepareLookupEditor(options): void {
  const { lookup } = options;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let displayGetter;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let dataSource;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let postProcess;
  const isFilterRow = options.parentType === 'filterRow';

  if (lookup) {
    displayGetter = compileGetter(lookup.displayExpr);
    dataSource = lookup.dataSource;

    if (isFunction(dataSource) && !isWrapped(dataSource)) {
      dataSource = dataSource(options.row || {});

      watchLookupDataSource(options);
    }

    if (isObject(dataSource) || Array.isArray(dataSource)) {
      // @ts-expect-error ts-
      dataSource = normalizeDataSourceOptions(dataSource);
      if (isFilterRow) {
        postProcess = dataSource.postProcess;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        dataSource.postProcess = function (items) {
          if (this.pageIndex() === 0) {
            // eslint-disable-next-line no-param-reassign
            items = items.slice(0);
            items.unshift(null);
          }
          if (postProcess) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return postProcess.call(this, items);
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return items;
        };
      }
    }

    const allowClearing = Boolean(lookup.allowClearing && !isFilterRow);

    options.editorName = options.editorType ?? 'dxSelectBox';
    options.editorOptions = getResultConfig({
      searchEnabled: true,
      value: options.value,
      valueExpr: options.lookup.valueExpr,
      searchExpr: options.lookup.searchExpr || options.lookup.displayExpr,
      allowClearing,
      showClearButton: allowClearing,
      displayExpr(data) {
        if (data === null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return options.showAllText;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return displayGetter(data);
      },
      dataSource,
      onValueChanged(e): void {
        const params = [e.value];

        if (!isFilterRow) {
          params.push(e.component.option('text'));
        }

        options.setValue.apply(this, params);
      },
    }, options);
  }
}

function prepareCheckBox(options): void {
  options.editorName = 'dxCheckBox';
  options.editorOptions = getResultConfig({
    elementAttr: {
      id: options.id,
    },
    value: isDefined(options.value) ? options.value : undefined,
    hoverStateEnabled: !options.readOnly,
    focusStateEnabled: !options.readOnly,
    activeStateEnabled: false,
    onValueChanged(e) {
      options.setValue?.(e.value, e /* for selection */);
    },
  }, options);
}

const prepareBooleanEditor = (options): void => {
  if (options.parentType === 'filterRow' || options.parentType === 'filterBuilder') {
    prepareLookupEditor(extend(options, {
      lookup: {
        // eslint-disable-next-line consistent-return
        displayExpr(data) {
          if (data === true) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return options.trueText || 'true';
          } if (data === false) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return options.falseText || 'false';
          }
        },
        dataSource: [true, false],
      },
    }));
  } else {
    prepareCheckBox(options);
  }
};

const createEditorCore = (that, options): void => {
  const $editorElement = $(options.editorElement);
  if (options.editorName && options.editorOptions && $editorElement[options.editorName]) {
    if (options.editorName === 'dxCheckBox' || options.editorName === 'dxSwitch') {
      if (!options.isOnForm) {
        $editorElement.addClass(that.addWidgetPrefix(CHECKBOX_SIZE_CLASS));
        $editorElement.parent().addClass(EDITOR_INLINE_BLOCK);
      }
    }

    that._createComponent($editorElement, options.editorName, options.editorOptions);

    if (options.editorName === 'dxDateBox') {
      // @ts-expect-error ts-error
      const dateBox = $editorElement.dxDateBox('instance');
      const defaultEnterKeyHandler = dateBox._supportedKeys().enter;

      dateBox.registerKeyHandler('enter', (e): boolean => {
        if (dateBox.option('opened')) {
          defaultEnterKeyHandler(e);
        }

        return true;
      });
    }

    if (options.editorName === 'dxTextArea') {
      // @ts-expect-error ts-error
      $editorElement.dxTextArea('instance').registerKeyHandler('enter', (event): void => {
        if (normalizeKeyName(event) === 'enter' && !event.ctrlKey && !event.shiftKey) {
          event.stopPropagation();
        }
      });
    }
  }
};

const prepareCustomEditor = (options): void => {
  options.editorName = options.editorType;
  options.editorOptions = getResultConfig({
    value: options.value,
    onValueChanged(args) {
      options.setValue(args.value);
    },
  }, options);
};

const prepareEditor = (options): void => {
  const prepareDefaultEditor = {
    dxDateBox: prepareDateBox,
    dxCheckBox: prepareCheckBox,
    dxNumberBox: prepareNumberBox,
    dxTextBox: prepareTextBox,
  };

  if (options.lookup) {
    prepareLookupEditor(options);
  } else if (options.editorType) {
    (prepareDefaultEditor[options.editorType] ?? prepareCustomEditor)(options);
  } else {
    switch (options.dataType) {
      case 'date':
      case 'datetime':
        prepareDateBox(options);
        break;
      case 'boolean':
        prepareBooleanEditor(options);
        break;
      case 'number':
        prepareNumberBox(options);
        break;
      default:
        prepareTextBox(options);
        break;
    }
  }
};

const EditorFactoryMixin = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  Base,
  // eslint-disable-next-line @typescript-eslint/no-shadow
): typeof EditorFactoryMixin => class EditorFactoryMixin extends Base {
  createEditor($container, options): void {
    options.cancel = false;
    options.editorElement = getPublicElement($container);

    if (!isDefined(options.tabIndex)) {
      options.tabIndex = this.option('tabIndex');
    }

    prepareEditor(options);

    this.executeAction('onEditorPreparing', options);

    if (options.cancel) {
      return;
    }

    if (options.parentType === 'dataRow' && !options.isOnForm && !isDefined(options.editorOptions.showValidationMark)) {
      options.editorOptions.showValidationMark = false;
    }

    createEditorCore(this, options);

    this.executeAction('onEditorPrepared', options);
  }
};

export default EditorFactoryMixin;
