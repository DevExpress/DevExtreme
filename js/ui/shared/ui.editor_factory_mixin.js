const $ = require('../../core/renderer');
const noop = require('../../core/utils/common').noop;
const eventsEngine = require('../../events/core/events_engine');
const typeUtils = require('../../core/utils/type');
const isWrapped = require('../../core/utils/variable_wrapper').isWrapped;
const compileGetter = require('../../core/utils/data').compileGetter;
const browser = require('../../core/utils/browser');
const extend = require('../../core/utils/extend').extend;
const devices = require('../../core/devices');
const getPublicElement = require('../../core/utils/dom').getPublicElement;
const normalizeDataSourceOptions = require('../../data/data_source/data_source').normalizeDataSourceOptions;
const normalizeKeyName = require('../../events/utils').normalizeKeyName;

require('../text_box');
require('../number_box');
require('../check_box');
require('../select_box');
require('../date_box');

const CHECKBOX_SIZE_CLASS = 'checkbox-size';
const CELL_FOCUS_DISABLED_CLASS = 'dx-cell-focus-disabled';
const EDITOR_INLINE_BLOCK = 'dx-editor-inline-block';

const EditorFactoryMixin = (function() {
    const getResultConfig = function(config, options) {
        return extend(config, {
            readOnly: options.readOnly,
            placeholder: options.placeholder,
            inputAttr: {
                id: options.id
            },
            tabIndex: options.tabIndex
        }, options.editorOptions);
    };

    const checkEnterBug = function() {
        return browser.msie || browser.mozilla || devices.real().ios;// Workaround for T344096, T249363, T314719, caused by https://connect.microsoft.com/IE/feedback/details/1552272/
    };

    const getTextEditorConfig = function(options) {
        const data = {};
        const isEnterBug = checkEnterBug();
        const sharedData = options.sharedData || data;

        return getResultConfig({
            placeholder: options.placeholder,
            width: options.width,
            value: options.value,
            onValueChanged: function(e) {

                const needDelayedUpdate = options.parentType === 'filterRow' || options.parentType === 'searchPanel';
                const isInputOrKeyUpEvent = e.event && (e.event.type === 'input' || e.event.type === 'keyup');
                const updateValue = function(e, notFireEvent) {
                    options && options.setValue(e.value, notFireEvent);
                };

                clearTimeout(data.valueChangeTimeout);

                if(isInputOrKeyUpEvent && needDelayedUpdate) {
                    sharedData.valueChangeTimeout = data.valueChangeTimeout = setTimeout(function() {
                        updateValue(e, data.valueChangeTimeout !== sharedData.valueChangeTimeout);
                    }, typeUtils.isDefined(options.updateValueTimeout) ? options.updateValueTimeout : 0);
                } else {
                    updateValue(e);
                }
            },
            onKeyDown: function(e) {
                if(isEnterBug && normalizeKeyName(e.event) === 'enter') {
                    eventsEngine.trigger($(e.component._input()), 'change');
                }
            },
            valueChangeEvent: 'change' + (options.parentType === 'filterRow' ? ' keyup input' : '')
        }, options);
    };

    const prepareDateBox = function(options) {
        options.editorName = 'dxDateBox';

        options.editorOptions = getResultConfig({
            value: options.value,
            onValueChanged: function(args) {
                options.setValue(args.value);
            },
            onKeyDown: function(e) {
                if(checkEnterBug() && normalizeKeyName(e.event) === 'enter') {
                    e.component.blur();
                    e.component.focus();
                }
            },
            displayFormat: options.format,
            type: options.dataType,
            formatWidthCalculator: null,
            dateSerializationFormat: null,
            width: options.parentType === 'filterBuilder' ? undefined : 'auto'
        }, options);
    };

    const prepareTextBox = function(options) {
        const config = getTextEditorConfig(options);
        const isSearching = options.parentType === 'searchPanel';
        const toString = function(value) {
            return typeUtils.isDefined(value) ? value.toString() : '';
        };

        if(options.editorType && options.editorType !== 'dxTextBox') {
            config.value = options.value;
        } else {
            config.value = toString(options.value);
        }
        config.valueChangeEvent += (isSearching ? ' keyup input search' : '');
        config.mode = config.mode || (isSearching ? 'search' : 'text');

        options.editorName = 'dxTextBox';
        options.editorOptions = config;
    };

    const prepareNumberBox = function(options) {
        const config = getTextEditorConfig(options);

        config.value = typeUtils.isDefined(options.value) ? options.value : null;

        options.editorName = 'dxNumberBox';

        options.editorOptions = config;
    };

    const prepareBooleanEditor = function(options) {
        if(options.parentType === 'filterRow' || options.parentType === 'filterBuilder') {
            prepareSelectBox(extend(options, {
                lookup: {
                    displayExpr: function(data) {
                        if(data === true) {
                            return options.trueText || 'true';
                        } else if(data === false) {
                            return options.falseText || 'false';
                        }
                    },
                    dataSource: [true, false]
                }
            }));
        } else {
            prepareCheckBox(options);
        }
    };

    function prepareSelectBox(options) {
        const lookup = options.lookup;
        let displayGetter;
        let dataSource;
        let postProcess;
        const isFilterRow = options.parentType === 'filterRow';

        if(lookup) {
            displayGetter = compileGetter(lookup.displayExpr);
            dataSource = lookup.dataSource;

            if(typeUtils.isFunction(dataSource) && !isWrapped(dataSource)) {
                dataSource = dataSource(options.row || {});
            }

            if(typeUtils.isObject(dataSource) || Array.isArray(dataSource)) {
                dataSource = normalizeDataSourceOptions(dataSource);
                if(isFilterRow) {
                    postProcess = dataSource.postProcess;
                    dataSource.postProcess = function(items) {
                        if(this.pageIndex() === 0) {
                            items = items.slice(0);
                            items.unshift(null);
                        }
                        if(postProcess) {
                            return postProcess.call(this, items);
                        }
                        return items;
                    };
                }
            }

            const allowClearing = Boolean(lookup.allowClearing && !isFilterRow);

            options.editorName = 'dxSelectBox';
            options.editorOptions = getResultConfig({
                searchEnabled: true,
                value: options.value,
                valueExpr: options.lookup.valueExpr,
                searchExpr: options.lookup.searchExpr || options.lookup.displayExpr,
                allowClearing: allowClearing,
                showClearButton: allowClearing,
                displayExpr: function(data) {
                    if(data === null) {
                        return options.showAllText;
                    }
                    return displayGetter(data);
                },
                dataSource: dataSource,
                onValueChanged: function(e) {
                    const params = [e.value];

                    !isFilterRow && params.push(e.component.option('text'));
                    options.setValue.apply(this, params);
                }
            }, options);
        }
    }

    function prepareCheckBox(options) {
        options.editorName = 'dxCheckBox';
        options.editorOptions = getResultConfig({
            value: typeUtils.isDefined(options.value) ? options.value : undefined,
            hoverStateEnabled: !options.readOnly,
            focusStateEnabled: !options.readOnly,
            activeStateEnabled: false,
            onValueChanged: function(e) {
                options.setValue && options.setValue(e.value, e /* for selection */);
            },
        }, options);
    }

    const createEditorCore = function(that, options) {
        const $editorElement = $(options.editorElement);
        if(options.editorName && options.editorOptions && $editorElement[options.editorName]) {
            if(options.editorName === 'dxCheckBox') {
                if(!options.isOnForm) {
                    $editorElement.addClass(that.addWidgetPrefix(CHECKBOX_SIZE_CLASS));
                    $editorElement.parent().addClass(EDITOR_INLINE_BLOCK);
                }
                if(options.command || options.editorOptions.readOnly) {
                    $editorElement.parent().addClass(CELL_FOCUS_DISABLED_CLASS);
                }
            }

            that._createComponent($editorElement, options.editorName, options.editorOptions);

            if(options.editorName === 'dxTextBox') {
                $editorElement.dxTextBox('instance').registerKeyHandler('enter', noop);
            }

            if(options.editorName === 'dxDateBox') {
                $editorElement.dxDateBox('instance').registerKeyHandler('enter', noop);
            }

            if(options.editorName === 'dxTextArea') {
                $editorElement.dxTextArea('instance').registerKeyHandler('enter', function(event) {
                    if(normalizeKeyName(event) === 'enter' && !event.ctrlKey && !event.shiftKey) {
                        event.stopPropagation();
                    }
                });
            }
        }
    };
    return {
        createEditor: function($container, options) {
            options.cancel = false;
            options.editorElement = getPublicElement($container);

            if(!typeUtils.isDefined(options.tabIndex)) {
                options.tabIndex = this.option('tabIndex');
            }

            if(options.lookup) {
                prepareSelectBox(options);
            } else {
                switch(options.dataType) {
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

            const editorName = options.editorName;
            this.executeAction('onEditorPreparing', options);

            if(options.cancel) {
                return;
            } else if(options.parentType === 'dataRow' && options.editorType && editorName === options.editorName) {
                options.editorName = options.editorType;
            }

            createEditorCore(this, options);

            this.executeAction('onEditorPrepared', options);
        }
    };
})();

module.exports = EditorFactoryMixin;
