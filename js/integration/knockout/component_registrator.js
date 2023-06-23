import $ from '../../core/renderer';
// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import Callbacks from '../../core/utils/callbacks';
import { isPlainObject } from '../../core/utils/type';
import registerComponentCallbacks from '../../core/component_registrator_callbacks';
import Widget from '../../ui/widget/ui.widget';
import VizWidget from '../../__internal/viz/core/m_base_widget';
import ComponentWrapper from '../../renovation/component_wrapper/common/component';
import Draggable from '../../ui/draggable';
import ScrollView from '../../ui/scroll_view';
import { KoTemplate } from './template';
import Editor from '../../ui/editor/editor';
import Locker from '../../core/utils/locker';
import { getClosestNodeWithContext } from './utils';
import config from '../../core/config';

if(ko) {
    const LOCKS_DATA_KEY = 'dxKoLocks';
    const CREATED_WITH_KO_DATA_KEY = 'dxKoCreation';

    const editorsBindingHandlers = [];
    const registerComponentKoBinding = function(componentName, componentClass) {

        if(Editor.isEditor(componentClass.prototype)) {
            editorsBindingHandlers.push(componentName);
        }

        ko.bindingHandlers[componentName] = {
            init: function(domNode, valueAccessor) {
                const $element = $(domNode);
                const optionChangedCallbacks = Callbacks();
                let optionsByReference = {};
                let component;
                const knockoutConfig = config().knockout;
                const isBindingPropertyPredicateName = knockoutConfig && knockoutConfig.isBindingPropertyPredicateName;
                let isBindingPropertyPredicate;
                let ctorOptions = {
                    onInitializing: function(options) {
                        optionsByReference = this._getOptionsByReference();

                        ko.computed(() => {
                            const model = ko.unwrap(valueAccessor());

                            if(component) {
                                component.beginUpdate();
                            }

                            isBindingPropertyPredicate = isBindingPropertyPredicateName && model && model[isBindingPropertyPredicateName];

                            unwrapModel(model);

                            if(component) {
                                component.endUpdate();
                            } else {
                                model?.onInitializing?.call(this, options);
                            }

                        }, null, { disposeWhenNodeIsRemoved: domNode });

                        component = this;
                    },
                    modelByElement: function($element) {
                        if($element.length) {
                            const node = getClosestNodeWithContext($element.get(0));
                            return ko.dataFor(node);
                        }
                    },
                    nestedComponentOptions: function(component) {
                        return {
                            modelByElement: component.option('modelByElement'),
                            nestedComponentOptions: component.option('nestedComponentOptions')
                        };
                    },
                    _optionChangedCallbacks: optionChangedCallbacks,
                    integrationOptions: {
                        watchMethod: function(fn, callback, options) {
                            options = options || {};

                            let skipCallback = options.skipImmediate;
                            const watcher = ko.computed(function() {
                                const newValue = ko.unwrap(fn());
                                if(!skipCallback) {
                                    callback(newValue);
                                }
                                skipCallback = false;
                            });
                            return function() {
                                watcher.dispose();
                            };
                        },
                        templates: {
                            'dx-polymorph-widget': {
                                render: function(options) {
                                    const widgetName = ko.utils.unwrapObservable(options.model.widget);
                                    if(!widgetName) {
                                        return;
                                    }

                                    const markup = $('<div>').attr('data-bind', widgetName + ': options').get(0);
                                    $(options.container).append(markup);
                                    ko.applyBindings(options.model, markup);
                                }
                            }
                        },
                        createTemplate: function(element) {
                            return new KoTemplate(element);
                        }
                    }
                };
                const optionNameToModelMap = {};

                const applyModelValueToOption = function(optionName, modelValue, unwrap) {
                    const locks = $element.data(LOCKS_DATA_KEY);
                    const optionValue = unwrap ? ko.unwrap(modelValue) : modelValue;

                    if(ko.isWriteableObservable(modelValue)) {
                        optionNameToModelMap[optionName] = modelValue;
                    }

                    if(component) {
                        if(locks.locked(optionName)) {
                            return;
                        }

                        locks.obtain(optionName);

                        try {
                            if(ko.ignoreDependencies) {
                                ko.ignoreDependencies(component.option, component, [optionName, optionValue]);
                            } else {
                                component.option(optionName, optionValue);
                            }
                        } finally {
                            locks.release(optionName);
                        }
                    } else {
                        ctorOptions[optionName] = optionValue;
                    }
                };

                const handleOptionChanged = function(args) {
                    const optionName = args.fullName;
                    const optionValue = args.value;

                    if(!(optionName in optionNameToModelMap)) {
                        return;
                    }

                    const $element = this._$element;
                    const locks = $element.data(LOCKS_DATA_KEY);

                    if(locks.locked(optionName)) {
                        return;
                    }

                    locks.obtain(optionName);
                    try {
                        optionNameToModelMap[optionName](optionValue);
                    } finally {
                        locks.release(optionName);
                    }
                };

                const createComponent = function() {
                    optionChangedCallbacks.add(handleOptionChanged);
                    $element
                        .data(CREATED_WITH_KO_DATA_KEY, true)
                        .data(LOCKS_DATA_KEY, new Locker());

                    new componentClass($element, ctorOptions);

                    ctorOptions = null;
                };

                const unwrapModelValue = function(currentModel, propertyName, propertyPath) {
                    if(propertyPath === isBindingPropertyPredicateName) {
                        return;
                    }

                    if(
                        !isBindingPropertyPredicate ||
                        isBindingPropertyPredicate(propertyPath, propertyName, currentModel)
                    ) {
                        let unwrappedPropertyValue;

                        ko.computed(function() {
                            const propertyValue = currentModel[propertyName];
                            applyModelValueToOption(propertyPath, propertyValue, true);
                            unwrappedPropertyValue = ko.unwrap(propertyValue);
                        }, null, { disposeWhenNodeIsRemoved: domNode });

                        if(isPlainObject(unwrappedPropertyValue)) {
                            if(!optionsByReference[propertyPath]) {
                                unwrapModel(unwrappedPropertyValue, propertyPath);
                            }
                        }
                    } else {
                        applyModelValueToOption(propertyPath, currentModel[propertyName], false);
                    }
                };

                function unwrapModel(model, propertyPath) {
                    for(const propertyName in model) {
                        if(Object.prototype.hasOwnProperty.call(model, propertyName)) {
                            unwrapModelValue(model, propertyName, propertyPath ? [propertyPath, propertyName].join('.') : propertyName);
                        }
                    }
                }

                createComponent();

                return {
                    controlsDescendantBindings: componentClass.subclassOf(Widget) || componentClass.subclassOf(VizWidget) ||
                    (componentClass.subclassOf(ComponentWrapper) && !(component instanceof ScrollView)) || component instanceof Draggable
                };
            }
        };

        if(componentName === 'dxValidator') {
            ko.bindingHandlers['dxValidator'].after = editorsBindingHandlers;
        }
    };

    registerComponentCallbacks.add(function(name, componentClass) {

        registerComponentKoBinding(name, componentClass);

    });
}
