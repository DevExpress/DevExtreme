import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import Config from "../../core/config";
import registerComponentCallbacks from "../../core/component_registrator_callbacks";
import Class from "../../core/class";
import Callbacks from "../../core/utils/callbacks";
import typeUtils from "../../core/utils/type";
import iterator from "../../core/utils/iterator";
const each = iterator.each;
import arrayUtils from "../../core/utils/array";
const inArray = arrayUtils.inArray;
import Locker from "../../core/utils/locker";
import Editor from "../../ui/editor/editor";
import { NgTemplate } from "./template";
import ngModule from "./module";
import CollectionWidget from "../../ui/collection/ui.collection_widget.edit";
import dataUtils from "../../core/utils/data";
import { equals } from "../../core/utils/comparator";
const compileSetter = dataUtils.compileSetter;
const compileGetter = dataUtils.compileGetter;
import extendUtils from "../../core/utils/extend";
const extendFromObject = extendUtils.extendFromObject;
import inflector from "../../core/utils/inflector";
import errors from "../../core/errors";
const ITEM_ALIAS_ATTRIBUTE_NAME = "dxItemAlias";
const SKIP_APPLY_ACTION_CATEGORIES = ["rendering"];
const NG_MODEL_OPTION = "value";

const safeApply = (func, scope) => {
    if(scope.$root.$$phase) {
        return func(scope);
    } else {
        return scope.$apply(() => func(scope));
    }
};

const getClassMethod = (initClass, methodName) => {
    const hasParentProperty = Object.prototype.hasOwnProperty.bind(initClass)("parent");
    const isES6Class = !hasParentProperty && initClass.parent;

    if(isES6Class) {
        const baseClass = Object.getPrototypeOf(initClass);

        return baseClass.prototype[methodName]
            ? () => baseClass.prototype[methodName]()
            : getClassMethod(baseClass, methodName);
    } else {
        const method = initClass.parent.prototype[methodName];
        if(method) {
            return () => method();
        }

        if(!method || !initClass.parent.subclassOf) {
            return () => undefined;
        }

        return getClassMethod(initClass.parent, methodName);
    }
};

/**
 * @name DOMComponentOptions.bindingOptions
 * @type object
 * @default {}
 */

let ComponentBuilder = Class.inherit({

    ctor(options) {
        this._componentDisposing = Callbacks();
        this._optionChangedCallbacks = Callbacks();
        this._ngLocker = new Locker();

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

        if(!options.ngOptions) {
            this._addOptionsStringWatcher(options.ngOptionsString);
        }
    },

    _addOptionsStringWatcher(optionsString) {
        const clearOptionsStringWatcher = this._scope.$watch(optionsString, newOptions => {
            if(!newOptions) {
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
        this._ngOptions = extendFromObject({}, options);

        if(!options) {
            return;
        }

        if(!Object.prototype.hasOwnProperty.call(options, 'bindingOptions') && options.bindingOptions) {
            this._ngOptions.bindingOptions = options.bindingOptions;
        }

        if(options.bindingOptions) {
            each(options.bindingOptions, (key, value) => {
                if(typeUtils.type(value) === 'string') {
                    this._ngOptions.bindingOptions[key] = { dataPath: value };
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

        if(!this._ngOptions.bindingOptions) {
            return;
        }

        each(this._ngOptions.bindingOptions, (optionPath, value) => {
            const separatorIndex = optionPath.search(/\[|\./);
            const optionForSubscribe = separatorIndex > -1 ? optionPath.substring(0, separatorIndex) : optionPath;
            let prevWatchMethod;
            let clearWatcher;
            const valuePath = value.dataPath;
            let deepWatch = true;
            let forcePlainWatchMethod = false;

            if(value.deep !== undefined) {
                forcePlainWatchMethod = deepWatch = !!value.deep;
            }

            if(!optionDependencies[optionForSubscribe]) {
                optionDependencies[optionForSubscribe] = {};
            }

            optionDependencies[optionForSubscribe][optionPath] = valuePath;

            const watchCallback = (newValue, oldValue) => {
                if(this._ngLocker.locked(optionPath)) {
                    return;
                }

                this._ngLocker.obtain(optionPath);
                this._component.option(optionPath, newValue);
                updateWatcher();

                if(equals(oldValue, newValue) && this._ngLocker.locked(optionPath)) {
                    this._ngLocker.release(optionPath);
                }
            };

            var updateWatcher = () => {
                const watchMethod = Array.isArray(this._scope.$eval(valuePath)) && !forcePlainWatchMethod ? "$watchCollection" : "$watch";

                if(prevWatchMethod !== watchMethod) {
                    if(clearWatcher) {
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

            if(this._ngLocker.locked(fullName)) {
                this._ngLocker.release(fullName);
                return;
            }

            if(!optionDependencies || !optionDependencies[optionName]) {
                return;
            }

            const isActivePhase = this._scope.$root.$$phase;
            const obtainOption = () => {
                this._ngLocker.obtain(fullName);
            };

            if(isActivePhase) {
                this._digestCallbacks.begin.add(obtainOption);
            } else {
                obtainOption();
            }

            safeApply(() => {
                each(optionDependencies[optionName], (optionPath, valuePath) => {
                    if(!this._optionsAreLinked(fullName, optionPath)) {
                        return;
                    }

                    const value = component.option(optionPath);
                    this._parse(valuePath).assign(this._scope, value);

                    const scopeValue = this._parse(valuePath)(this._scope);
                    if(scopeValue !== value) {
                        args.component.option(optionPath, scopeValue);
                    }
                });
            }, this._scope);

            const releaseOption = () => {
                if(this._ngLocker.locked(fullName)) {
                    this._ngLocker.release(fullName);
                }
                this._digestCallbacks.begin.remove(obtainOption);
                this._digestCallbacks.end.remove(releaseOption);
            };

            if(isActivePhase) {
                this._digestCallbacks.end.addPrioritized(releaseOption);
            } else {
                releaseOption();
            }
        });
    },

    _optionsAreNested(optionPath1, optionPath2) {
        const parentSeparator = optionPath1[optionPath2.length];
        return optionPath1.indexOf(optionPath2) === 0 && (parentSeparator === "." || parentSeparator === "[");
    },

    _optionsAreLinked(optionPath1, optionPath2) {
        if(optionPath1 === optionPath2) return true;

        return optionPath1.length > optionPath2.length
            ? this._optionsAreNested(optionPath1, optionPath2)
            : this._optionsAreNested(optionPath2, optionPath1);
    },

    _compilerByTemplate(template) {
        const scopeItemsPath = this._getScopeItemsPath();

        return options => {
            const $resultMarkup = $(template).clone();
            const dataIsScope = options.model && options.model.constructor === this._scope.$root.constructor;
            const templateScope = dataIsScope ? options.model : (options.noModel ? this._scope : this._createScopeWithData(options));

            if(scopeItemsPath) {
                this._synchronizeScopes(templateScope, scopeItemsPath, options.index);
            }

            $resultMarkup.appendTo(options.container);

            if(!options.noModel) {
                eventsEngine.on($resultMarkup, "$destroy", () => {
                    const destroyAlreadyCalled = !templateScope.$parent;

                    if(destroyAlreadyCalled) {
                        return;
                    }

                    templateScope.$destroy();
                });
            }

            const ngTemplate = this._compile($resultMarkup, this._transcludeFn);
            this._applyAsync(scope => {
                ngTemplate(scope, null, { parentBoundTranscludeFn: this._transcludeFn });
            }, templateScope);

            return $resultMarkup;
        };
    },

    _applyAsync(func, scope) {
        func(scope);
        if(!scope.$root.$$phase) {
            if(!this._renderingTimer) {
                this._renderingTimer = setTimeout(() => {
                    scope.$apply();
                    this._renderingTimer = null;
                });
            }
            this._componentDisposing.add(() => {
                clearTimeout(this._renderingTimer);
            });
        }
    },

    _getScopeItemsPath() {
        if(this._componentClass.subclassOf(CollectionWidget) && this._ngOptions.bindingOptions && this._ngOptions.bindingOptions.items) {
            return this._ngOptions.bindingOptions.items.dataPath;
        }
    },

    _createScopeWithData(options) {
        const newScope = this._scope.$new();

        if(this._itemAlias) {
            newScope[this._itemAlias] = options.model;
        }

        if(typeUtils.isDefined(options.index)) {
            newScope.$index = options.index;
        }

        return newScope;
    },

    _synchronizeScopes(itemScope, parentPrefix, itemIndex) {
        if(this._itemAlias && typeof (itemScope[this._itemAlias]) !== "object") {
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
        const innerPathSuffix = fieldPath === this._itemAlias ? "" : "." + fieldPath;
        const collectionField = itemIndex !== undefined;
        const optionOuterBag = [parentPrefix];
        let optionOuterPath;

        if(collectionField) {
            if(!typeUtils.isNumeric(itemIndex)) return;

            optionOuterBag.push("[", itemIndex, "]");
        }

        optionOuterBag.push(innerPathSuffix);
        optionOuterPath = optionOuterBag.join("");

        const clearParentWatcher = parentScope.$watch(optionOuterPath, (newValue, oldValue) => {
            if(newValue !== oldValue) {
                compileSetter(fieldPath)(childScope, newValue);
            }
        });

        const clearItemWatcher = childScope.$watch(fieldPath, (newValue, oldValue) => {
            if(newValue !== oldValue) {
                if(collectionField && !compileGetter(parentPrefix)(parentScope)[itemIndex]) {
                    clearItemWatcher();
                    return;
                }
                compileSetter(optionOuterPath)(parentScope, newValue);
            }
        });

        this._componentDisposing.add([clearParentWatcher, clearItemWatcher]); // TODO: test
    },

    _evalOptions(scope) {
        const result = extendFromObject({}, this._ngOptions);

        delete result.bindingOptions;

        if(this._ngOptions.bindingOptions) {
            each(this._ngOptions.bindingOptions, (key, value) => {
                result[key] = scope.$eval(value.dataPath);
            });
        }

        result._optionChangedCallbacks = this._optionChangedCallbacks;
        result._disposingCallbacks = this._componentDisposing;
        result.onActionCreated = (component, action, config) => {
            if(config && inArray(config.category, SKIP_APPLY_ACTION_CATEGORIES) > -1) {
                return action;
            }

            const wrappedAction = function() {
                const args = arguments;

                if(!scope || !scope.$root || scope.$root.$$phase) {
                    return action.apply(this, args);
                }

                return safeApply(() => action.apply(this, args), scope);
            };

            return wrappedAction;
        };
        result.beforeActionExecute = result.onActionCreated;
        result.nestedComponentOptions = component => ({
            templatesRenderAsynchronously: component.option("templatesRenderAsynchronously"),
            forceApplyBindings: component.option("forceApplyBindings"),
            modelByElement: component.option("modelByElement"),
            onActionCreated: component.option("onActionCreated"),
            beforeActionExecute: component.option("beforeActionExecute"),
            nestedComponentOptions: component.option("nestedComponentOptions")
        });

        result.templatesRenderAsynchronously = true;

        if(Config().wrapActionsBeforeExecute) {
            result.forceApplyBindings = () => {
                safeApply(() => {}, scope);
            };
        }

        result.integrationOptions = {
            createTemplate: element => new NgTemplate(element, this._compilerByTemplate.bind(this)),
            watchMethod: (fn, callback, options) => {
                options = options || {};

                let immediateValue;
                let skipCallback = options.skipImmediate;
                const disposeWatcher = scope.$watch(() => {
                    let value = fn();
                    if(value instanceof Date) {
                        value = value.valueOf();
                    }
                    return value;
                }, newValue => {
                    const isSameValue = immediateValue === newValue;
                    if(!skipCallback && (!isSameValue || isSameValue && options.deep)) {
                        callback(newValue);
                    }
                    skipCallback = false;
                }, options.deep);

                if(!skipCallback) {
                    immediateValue = fn();
                    callback(immediateValue);
                }

                if(Config().wrapActionsBeforeExecute) {
                    this._applyAsync(() => {}, scope);
                }

                return disposeWatcher;
            },
            templates: {
                "dx-polymorph-widget": {
                    render: options => {
                        let widgetName = options.model.widget;
                        if(!widgetName) {
                            return;
                        }

                        if(widgetName === "button" || widgetName === "tabs" || widgetName === "dropDownMenu") {
                            const deprecatedName = widgetName;
                            widgetName = inflector.camelize("dx-" + widgetName);
                            errors.log("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead");
                        }

                        const markup = $("<div>").attr(inflector.dasherize(widgetName), "options").get(0);

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
        return (this._componentClass.subclassOf(Editor) || this._componentClass.prototype instanceof Editor) && this._ngModel;
    },

    _initComponentBindings(...args) {
        this.callBase(...args);

        this._initNgModelBinding();
    },

    _initNgModelBinding() {
        if(!this._isNgModelRequired()) {
            return;
        }

        const clearNgModelWatcher = this._scope.$watch(this._ngModel, (newValue, oldValue) => {
            if(this._ngLocker.locked(NG_MODEL_OPTION)) {
                return;
            }

            if(newValue === oldValue) {
                return;
            }

            this._component.option(NG_MODEL_OPTION, newValue);
        });

        this._optionChangedCallbacks.add(args => {
            this._ngLocker.obtain(NG_MODEL_OPTION);
            try {
                if(args.name !== NG_MODEL_OPTION) {
                    return;
                }

                this._ngModelController.$setViewValue(args.value);
            } finally {
                if(this._ngLocker.locked(NG_MODEL_OPTION)) {
                    this._ngLocker.release(NG_MODEL_OPTION);
                }
            }
        });

        this._componentDisposing.add(clearNgModelWatcher);
    },

    _evalOptions(...args) {
        if(!this._isNgModelRequired()) {
            return this.callBase(...args);
        }

        const result = this.callBase(...args);
        result[NG_MODEL_OPTION] = this._parse(this._ngModel)(this._scope);
        return result;
    }
});

const registeredComponents = {};

const registerComponentDirective = name => {
    const priority = name !== "dxValidator" ? 1 : 10;
    ngModule.directive(name, ["$compile", "$parse", "dxDigestCallbacks", ($compile, $parse, dxDigestCallbacks) => ({
        restrict: "A",
        require: "^?ngModel",
        priority,

        compile($element) {
            const componentClass = registeredComponents[name];
            const useTemplates = componentClass.prototype._useTemplates
                ? componentClass.prototype._useTemplates()
                : getClassMethod(componentClass, '_useTemplates')();
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

registerComponentCallbacks.add((name, componentClass) => {

    if(!registeredComponents[name]) {
        registerComponentDirective(name);
    }
    registeredComponents[name] = componentClass;

});
