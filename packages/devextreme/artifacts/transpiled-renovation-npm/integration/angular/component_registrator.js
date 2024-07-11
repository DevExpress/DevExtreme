"use strict";

var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _angular = _interopRequireDefault(require("angular"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _config = _interopRequireDefault(require("../../core/config"));
var _component_registrator_callbacks = _interopRequireDefault(require("../../core/component_registrator_callbacks"));
var _class = _interopRequireDefault(require("../../core/class"));
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _type = require("../../core/utils/type");
var _iterator = require("../../core/utils/iterator");
var _locker = _interopRequireDefault(require("../../core/utils/locker"));
var _editor = _interopRequireDefault(require("../../ui/editor/editor"));
var _template = require("./template");
var _module = _interopRequireDefault(require("./module"));
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _data = require("../../core/utils/data");
var _extend = require("../../core/utils/extend");
var _comparator = require("../../core/utils/comparator");
var _inflector = require("../../core/utils/inflector");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
// eslint-disable-next-line no-restricted-imports

const ITEM_ALIAS_ATTRIBUTE_NAME = 'dxItemAlias';
const SKIP_APPLY_ACTION_CATEGORY = 'rendering';
const NG_MODEL_OPTION = 'value';
if (_angular.default) {
  const safeApply = (func, scope) => {
    if (scope.$root.$$phase) {
      return func(scope);
    } else {
      return scope.$apply(() => func(scope));
    }
  };
  const getClassMethod = (initClass, methodName) => {
    const hasParentProperty = Object.prototype.hasOwnProperty.bind(initClass)('parent');
    const isES6Class = !hasParentProperty && initClass.parent;
    if (isES6Class) {
      const baseClass = Object.getPrototypeOf(initClass);
      return baseClass.prototype[methodName] ? () => baseClass.prototype[methodName]() : getClassMethod(baseClass, methodName);
    } else {
      const method = initClass.parent.prototype[methodName];
      if (method) {
        return () => method();
      }
      if (!method || !initClass.parent.subclassOf) {
        return () => undefined;
      }
      return getClassMethod(initClass.parent, methodName);
    }
  };
  let ComponentBuilder = _class.default.inherit({
    ctor(options) {
      this._componentDisposing = (0, _callbacks.default)();
      this._optionChangedCallbacks = (0, _callbacks.default)();
      this._ngLocker = new _locker.default();
      this._scope = options.scope;
      this._$element = options.$element;
      this._$templates = options.$templates;
      this._componentClass = options.componentClass;
      this._parse = options.parse;
      this._compile = options.compile;
      this._itemAlias = options.itemAlias;
      this._transcludeFn = options.transcludeFn;
      this._digestCallbacks = options.dxDigestCallbacks;
      this._normalizeOptions(options.ngOptions);
      this._initComponentBindings();
      this._initComponent(this._scope);
      if (!options.ngOptions) {
        this._addOptionsStringWatcher(options.ngOptionsString);
      }
    },
    _addOptionsStringWatcher(optionsString) {
      const clearOptionsStringWatcher = this._scope.$watch(optionsString, newOptions => {
        if (!newOptions) {
          return;
        }
        clearOptionsStringWatcher();
        this._normalizeOptions(newOptions);
        this._initComponentBindings();
        this._component.option(this._evalOptions(this._scope));
      });
      this._componentDisposing.add(clearOptionsStringWatcher);
    },
    _normalizeOptions(options) {
      this._ngOptions = (0, _extend.extendFromObject)({}, options);
      if (!options) {
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(options, 'bindingOptions') && options.bindingOptions) {
        this._ngOptions.bindingOptions = options.bindingOptions;
      }
      if (options.bindingOptions) {
        (0, _iterator.each)(options.bindingOptions, (key, value) => {
          if ((0, _type.type)(value) === 'string') {
            this._ngOptions.bindingOptions[key] = {
              dataPath: value
            };
          }
        });
      }
    },
    _initComponent(scope) {
      this._component = new this._componentClass(this._$element, this._evalOptions(scope));
      this._component._isHidden = true;
      this._handleDigestPhase();
    },
    _handleDigestPhase() {
      const beginUpdate = () => {
        this._component.beginUpdate();
      };
      const endUpdate = () => {
        this._component.endUpdate();
      };
      this._digestCallbacks.begin.add(beginUpdate);
      this._digestCallbacks.end.add(endUpdate);
      this._componentDisposing.add(() => {
        this._digestCallbacks.begin.remove(beginUpdate);
        this._digestCallbacks.end.remove(endUpdate);
      });
    },
    _initComponentBindings() {
      const optionDependencies = {};
      if (!this._ngOptions.bindingOptions) {
        return;
      }
      (0, _iterator.each)(this._ngOptions.bindingOptions, (optionPath, value) => {
        const separatorIndex = optionPath.search(/\[|\./);
        const optionForSubscribe = separatorIndex > -1 ? optionPath.substring(0, separatorIndex) : optionPath;
        let prevWatchMethod;
        let clearWatcher;
        const valuePath = value.dataPath;
        let deepWatch = true;
        let forcePlainWatchMethod = false;
        if (value.deep !== undefined) {
          forcePlainWatchMethod = deepWatch = !!value.deep;
        }
        if (!optionDependencies[optionForSubscribe]) {
          optionDependencies[optionForSubscribe] = {};
        }
        optionDependencies[optionForSubscribe][optionPath] = valuePath;
        const updateWatcher = () => {
          const watchCallback = (newValue, oldValue) => {
            if (this._ngLocker.locked(optionPath)) {
              return;
            }
            this._ngLocker.obtain(optionPath);
            this._component.option(optionPath, newValue);
            updateWatcher();
            if ((0, _comparator.equals)(oldValue, newValue) && this._ngLocker.locked(optionPath)) {
              this._ngLocker.release(optionPath);
            }
          };
          const watchMethod = Array.isArray(this._scope.$eval(valuePath)) && !forcePlainWatchMethod ? '$watchCollection' : '$watch';
          if (prevWatchMethod !== watchMethod) {
            if (clearWatcher) {
              clearWatcher();
            }
            clearWatcher = this._scope[watchMethod](valuePath, watchCallback, deepWatch);
            prevWatchMethod = watchMethod;
          }
        };
        updateWatcher();
        this._componentDisposing.add(clearWatcher);
      });
      this._optionChangedCallbacks.add(args => {
        const optionName = args.name;
        const fullName = args.fullName;
        const component = args.component;
        if (this._ngLocker.locked(fullName)) {
          this._ngLocker.release(fullName);
          return;
        }
        if (!optionDependencies || !optionDependencies[optionName]) {
          return;
        }
        const isActivePhase = this._scope.$root.$$phase;
        const obtainOption = () => {
          this._ngLocker.obtain(fullName);
        };
        if (isActivePhase) {
          this._digestCallbacks.begin.add(obtainOption);
        } else {
          obtainOption();
        }
        safeApply(() => {
          (0, _iterator.each)(optionDependencies[optionName], (optionPath, valuePath) => {
            if (!this._optionsAreLinked(fullName, optionPath)) {
              return;
            }
            const value = component.option(optionPath);
            this._parse(valuePath).assign(this._scope, value);
            const scopeValue = this._parse(valuePath)(this._scope);
            if (scopeValue !== value) {
              args.component.option(optionPath, scopeValue);
            }
          });
        }, this._scope);
        const releaseOption = () => {
          if (this._ngLocker.locked(fullName)) {
            this._ngLocker.release(fullName);
          }
          this._digestCallbacks.begin.remove(obtainOption);
          this._digestCallbacks.end.remove(releaseOption);
        };
        if (isActivePhase) {
          this._digestCallbacks.end.addPrioritized(releaseOption);
        } else {
          releaseOption();
        }
      });
    },
    _optionsAreNested(optionPath1, optionPath2) {
      const parentSeparator = optionPath1[optionPath2.length];
      return optionPath1.indexOf(optionPath2) === 0 && (parentSeparator === '.' || parentSeparator === '[');
    },
    _optionsAreLinked(optionPath1, optionPath2) {
      if (optionPath1 === optionPath2) return true;
      return optionPath1.length > optionPath2.length ? this._optionsAreNested(optionPath1, optionPath2) : this._optionsAreNested(optionPath2, optionPath1);
    },
    _compilerByTemplate(template) {
      const scopeItemsPath = this._getScopeItemsPath();
      return options => {
        const $resultMarkup = (0, _renderer.default)(template).clone();
        const dataIsScope = options.model && options.model.constructor === this._scope.$root.constructor;
        const templateScope = dataIsScope ? options.model : options.noModel ? this._scope : this._createScopeWithData(options);
        if (scopeItemsPath) {
          this._synchronizeScopes(templateScope, scopeItemsPath, options.index);
        }
        $resultMarkup.appendTo(options.container);
        if (!options.noModel) {
          _events_engine.default.on($resultMarkup, '$destroy', () => {
            const destroyAlreadyCalled = !templateScope.$parent;
            if (destroyAlreadyCalled) {
              return;
            }
            templateScope.$destroy();
          });
        }
        const ngTemplate = this._compile($resultMarkup, this._transcludeFn);
        this._applyAsync(scope => {
          ngTemplate(scope, null, {
            parentBoundTranscludeFn: this._transcludeFn
          });
        }, templateScope);
        return $resultMarkup;
      };
    },
    _applyAsync(func, scope) {
      func(scope);
      if (!scope.$root.$$phase) {
        if (!this._renderingTimer) {
          const clearRenderingTimer = () => {
            clearTimeout(this._renderingTimer);
          };
          this._renderingTimer = setTimeout(() => {
            scope.$apply();
            this._renderingTimer = null;
            this._componentDisposing.remove(clearRenderingTimer);
          });
          this._componentDisposing.add(clearRenderingTimer);
        }
      }
    },
    _getScopeItemsPath() {
      if (this._componentClass.subclassOf(_uiCollection_widget.default) && this._ngOptions.bindingOptions && this._ngOptions.bindingOptions.items) {
        return this._ngOptions.bindingOptions.items.dataPath;
      }
    },
    _createScopeWithData(options) {
      const newScope = this._scope.$new();
      if (this._itemAlias) {
        newScope[this._itemAlias] = options.model;
      }
      if ((0, _type.isDefined)(options.index)) {
        newScope.$index = options.index;
      }
      return newScope;
    },
    _synchronizeScopes(itemScope, parentPrefix, itemIndex) {
      if (this._itemAlias && typeof itemScope[this._itemAlias] !== 'object') {
        this._synchronizeScopeField({
          parentScope: this._scope,
          childScope: itemScope,
          fieldPath: this._itemAlias,
          parentPrefix,
          itemIndex
        });
      }
    },
    _synchronizeScopeField(args) {
      const parentScope = args.parentScope;
      const childScope = args.childScope;
      const fieldPath = args.fieldPath;
      const parentPrefix = args.parentPrefix;
      const itemIndex = args.itemIndex;
      const innerPathSuffix = fieldPath === this._itemAlias ? '' : '.' + fieldPath;
      const collectionField = itemIndex !== undefined;
      const optionOuterBag = [parentPrefix];
      if (collectionField) {
        if (!(0, _type.isNumeric)(itemIndex)) return;
        optionOuterBag.push('[', itemIndex, ']');
      }
      optionOuterBag.push(innerPathSuffix);
      const optionOuterPath = optionOuterBag.join('');
      const clearParentWatcher = parentScope.$watch(optionOuterPath, (newValue, oldValue) => {
        if (newValue !== oldValue) {
          (0, _data.compileSetter)(fieldPath)(childScope, newValue);
        }
      });
      const clearItemWatcher = childScope.$watch(fieldPath, (newValue, oldValue) => {
        if (newValue !== oldValue) {
          if (collectionField && !(0, _data.compileGetter)(parentPrefix)(parentScope)[itemIndex]) {
            clearItemWatcher();
            return;
          }
          (0, _data.compileSetter)(optionOuterPath)(parentScope, newValue);
        }
      });
      this._componentDisposing.add([clearParentWatcher, clearItemWatcher]); // TODO: test
    },
    _evalOptions(scope) {
      const result = (0, _extend.extendFromObject)({}, this._ngOptions);
      delete result.bindingOptions;
      if (this._ngOptions.bindingOptions) {
        (0, _iterator.each)(this._ngOptions.bindingOptions, (key, value) => {
          result[key] = scope.$eval(value.dataPath);
        });
      }
      result._optionChangedCallbacks = this._optionChangedCallbacks;
      result._disposingCallbacks = this._componentDisposing;
      result.onActionCreated = (component, action, config) => {
        if (config && config.category === SKIP_APPLY_ACTION_CATEGORY) {
          return action;
        }
        const wrappedAction = function () {
          const args = arguments;
          if (!scope || !scope.$root || scope.$root.$$phase) {
            return action.apply(this, args);
          }
          return safeApply(() => action.apply(this, args), scope);
        };
        return wrappedAction;
      };
      result.beforeActionExecute = result.onActionCreated;
      result.nestedComponentOptions = component => ({
        templatesRenderAsynchronously: component.option('templatesRenderAsynchronously'),
        forceApplyBindings: component.option('forceApplyBindings'),
        modelByElement: component.option('modelByElement'),
        onActionCreated: component.option('onActionCreated'),
        beforeActionExecute: component.option('beforeActionExecute'),
        nestedComponentOptions: component.option('nestedComponentOptions')
      });
      result.templatesRenderAsynchronously = true;
      if ((0, _config.default)().wrapActionsBeforeExecute) {
        result.forceApplyBindings = () => {
          safeApply(() => {}, scope);
        };
      }
      result.integrationOptions = {
        createTemplate: element => new _template.NgTemplate(element, this._compilerByTemplate.bind(this)),
        watchMethod: (fn, callback, options) => {
          options = options || {};
          let immediateValue;
          let skipCallback = options.skipImmediate;
          const disposeWatcher = scope.$watch(() => {
            let value = fn();
            if (value instanceof Date) {
              value = value.valueOf();
            }
            return value;
          }, newValue => {
            const isSameValue = immediateValue === newValue;
            if (!skipCallback && (!isSameValue || isSameValue && options.deep)) {
              callback(newValue);
            }
            skipCallback = false;
          }, options.deep);
          if (!skipCallback) {
            immediateValue = fn();
            callback(immediateValue);
          }
          if ((0, _config.default)().wrapActionsBeforeExecute) {
            this._applyAsync(() => {}, scope);
          }
          return disposeWatcher;
        },
        templates: {
          'dx-polymorph-widget': {
            render: options => {
              const widgetName = options.model.widget;
              if (!widgetName) {
                return;
              }
              const markup = (0, _renderer.default)('<div>').attr((0, _inflector.dasherize)(widgetName), 'options').get(0);
              const newScope = this._scope.$new();
              newScope.options = options.model.options;
              options.container.append(markup);
              this._compile(markup)(newScope);
            }
          }
        }
      };
      result.modelByElement = () => scope;
      return result;
    }
  });
  ComponentBuilder = ComponentBuilder.inherit({
    ctor(options) {
      this._componentName = options.componentName;
      this._ngModel = options.ngModel;
      this._ngModelController = options.ngModelController;
      this.callBase(...arguments);
    },
    _isNgModelRequired() {
      return _editor.default.isEditor(this._componentClass.prototype) && this._ngModel;
    },
    _initComponentBindings() {
      this.callBase(...arguments);
      this._initNgModelBinding();
    },
    _initNgModelBinding() {
      if (!this._isNgModelRequired()) {
        return;
      }
      const clearNgModelWatcher = this._scope.$watch(this._ngModel, (newValue, oldValue) => {
        if (this._ngLocker.locked(NG_MODEL_OPTION)) {
          return;
        }
        if (newValue === oldValue) {
          return;
        }
        this._component.option(NG_MODEL_OPTION, newValue);
      });
      this._optionChangedCallbacks.add(args => {
        this._ngLocker.obtain(NG_MODEL_OPTION);
        try {
          if (args.name !== NG_MODEL_OPTION) {
            return;
          }
          this._ngModelController.$setViewValue(args.value);
        } finally {
          if (this._ngLocker.locked(NG_MODEL_OPTION)) {
            this._ngLocker.release(NG_MODEL_OPTION);
          }
        }
      });
      this._componentDisposing.add(clearNgModelWatcher);
    },
    _evalOptions() {
      if (!this._isNgModelRequired()) {
        return this.callBase(...arguments);
      }
      const result = this.callBase(...arguments);
      result[NG_MODEL_OPTION] = this._parse(this._ngModel)(this._scope);
      return result;
    }
  });
  const registeredComponents = {};
  const registerComponentDirective = name => {
    const priority = name !== 'dxValidator' ? 1 : 10;
    _module.default.directive(name, ['$compile', '$parse', 'dxDigestCallbacks', ($compile, $parse, dxDigestCallbacks) => ({
      restrict: 'A',
      require: '^?ngModel',
      priority,
      compile($element) {
        const componentClass = registeredComponents[name];
        const useTemplates = componentClass.prototype._useTemplates ? componentClass.prototype._useTemplates() : getClassMethod(componentClass, '_useTemplates')();
        const $content = useTemplates ? $element.contents().detach() : null;
        return (scope, $element, attrs, ngModelController, transcludeFn) => {
          $element.append($content);
          safeApply(() => {
            new ComponentBuilder({
              componentClass,
              componentName: name,
              compile: $compile,
              parse: $parse,
              $element,
              scope,
              ngOptionsString: attrs[name],
              ngOptions: attrs[name] ? scope.$eval(attrs[name]) : {},
              ngModel: attrs.ngModel,
              ngModelController,
              transcludeFn,
              itemAlias: attrs[ITEM_ALIAS_ATTRIBUTE_NAME],
              dxDigestCallbacks
            });
          }, scope);
        };
      }
    })]);
  };
  _component_registrator_callbacks.default.add((name, componentClass) => {
    if (!registeredComponents[name]) {
      registerComponentDirective(name);
    }
    registeredComponents[name] = componentClass;
  });
}