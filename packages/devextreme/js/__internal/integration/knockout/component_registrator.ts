import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Widget from '@js/ui/widget/ui.widget';
import {
  componentRegistratorCallbacks as registerComponentCallbacks,
} from '@ts/core/m_component_registrator_callbacks';
import config from '@ts/core/m_config';
import { ComponentWrapper } from '@ts/core/r1/component_wrapper';
import Callbacks from '@ts/core/utils/m_callbacks';
import { Locker } from '@ts/core/utils/m_locker';
import { isPlainObject } from '@ts/core/utils/m_type';
import Draggable from '@ts/m_draggable';
import Editor from '@ts/ui/editor/editor';
import ScrollView from '@ts/ui/scroll_view/scroll_view';
import VizWidget from '@ts/viz/core/m_base_widget';
// eslint-disable-next-line import/no-extraneous-dependencies
import ko from 'knockout';

import { KoTemplate } from './template';
import { getClosestNodeWithContext } from './utils';

if (ko) {
  const LOCKS_DATA_KEY = 'dxKoLocks';
  const CREATED_WITH_KO_DATA_KEY = 'dxKoCreation';

  const editorsBindingHandlers: string[] = [];
  const registerComponentKoBinding = function (componentName: string, componentClass): void {
    if (Editor.isEditor(componentClass.prototype)) {
      editorsBindingHandlers.push(componentName);
    }

    ko.bindingHandlers[componentName] = {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      init(domNode, valueAccessor) {
        const $element = $(domNode);
        const optionChangedCallbacks = Callbacks();
        let optionsByReference = {};
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let component;
        // @ts-expect-error
        const knockoutConfig = config().knockout;
        const isBindingPropertyPredicateName = knockoutConfig?.isBindingPropertyPredicateName;
        // eslint-disable-next-line @typescript-eslint/init-declarations
        let isBindingPropertyPredicate: unknown | undefined;
        let ctorOptions = {
          onInitializing(options): void {
            optionsByReference = this._getOptionsByReference();

            ko.computed(() => {
              const model = ko.unwrap(valueAccessor());

              if (component) {
                component.beginUpdate();
              }

              isBindingPropertyPredicate = isBindingPropertyPredicateName
                && model?.[isBindingPropertyPredicateName];

              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              unwrapModel(model);

              if (component) {
                component.endUpdate();
              } else {
                model?.onInitializing?.call(this, options);
              }
            }, null, { disposeWhenNodeIsRemoved: domNode });

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            component = this;
          },
          // eslint-disable-next-line @stylistic/max-len
          // eslint-disable-next-line @typescript-eslint/no-shadow,@typescript-eslint/explicit-function-return-type,consistent-return
          modelByElement($element: dxElementWrapper) {
            if ($element.length) {
              const node = getClosestNodeWithContext($element.get(0));
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return ko.dataFor(node);
            }
          },
          // eslint-disable-next-line @stylistic/max-len
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-shadow
          nestedComponentOptions(component) {
            return {
              modelByElement: component.option('modelByElement'),
              nestedComponentOptions: component.option('nestedComponentOptions'),
            };
          },
          _optionChangedCallbacks: optionChangedCallbacks,
          integrationOptions: {
            watchMethod(fn, callback, options) {
              // eslint-disable-next-line no-param-reassign
              options = options || {};

              let skipCallback = options.skipImmediate;
              const watcher = ko.computed(() => {
                const newValue = ko.unwrap(fn());
                if (!skipCallback) {
                  callback(newValue);
                }
                skipCallback = false;
              });
              return function (): void {
                watcher.dispose();
              };
            },
            templates: {
              'dx-polymorph-widget': {
                render(options): void {
                  const widgetName = ko.utils.unwrapObservable(options.model.widget);
                  if (!widgetName) {
                    return;
                  }

                  const markup = $('<div>').attr('data-bind', `${widgetName}: options`).get(0);
                  $(options.container).append(markup);
                  ko.applyBindings(options.model, markup);
                },
              },
            },
            createTemplate(element): typeof KoTemplate {
              // @ts-expect-error
              return new KoTemplate(element);
            },
          },
        };
        const optionNameToModelMap = {};

        // eslint-disable-next-line func-names
        const applyModelValueToOption = function (optionName: string, modelValue, unwrap): void {
          const locks = $element.data(LOCKS_DATA_KEY);
          const optionValue = unwrap ? ko.unwrap(modelValue) : modelValue;

          if (ko.isWriteableObservable(modelValue)) {
            optionNameToModelMap[optionName] = modelValue;
          }

          if (component) {
            // @ts-expect-error
            if (locks.locked(optionName)) {
              return;
            }

            // @ts-expect-error
            locks.obtain(optionName);

            try {
              if (ko.ignoreDependencies) {
                ko.ignoreDependencies(component.option, component, [optionName, optionValue]);
              } else {
                component.option(optionName, optionValue);
              }
            } finally {
              // @ts-expect-error
              locks.release(optionName);
            }
          } else {
            ctorOptions[optionName] = optionValue;
          }
        };

        const handleOptionChanged = function (args): void {
          const optionName = args.fullName;
          const optionValue = args.value;

          if (!(optionName in optionNameToModelMap)) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-shadow
          const $element = this._$element as unknown as dxElementWrapper;
          const locks = $element.data(LOCKS_DATA_KEY);

          // @ts-expect-error
          if (locks.locked(optionName)) {
            return;
          }

          // @ts-expect-error
          locks.obtain(optionName);
          try {
            optionNameToModelMap[optionName](optionValue);
          } finally {
            // @ts-expect-error
            locks.release(optionName);
          }
        };

        // eslint-disable-next-line func-names
        const createComponent = function (): void {
          optionChangedCallbacks.add(handleOptionChanged);
          $element
            .data(CREATED_WITH_KO_DATA_KEY, true)
            // @ts-expect-error
            .data(LOCKS_DATA_KEY, new Locker());

          // eslint-disable-next-line no-new,new-cap
          new componentClass($element, ctorOptions);

          // @ts-expect-error
          ctorOptions = null;
        };

        // eslint-disable-next-line func-names
        const unwrapModelValue = function (currentModel, propertyName, propertyPath): void {
          if (propertyPath === isBindingPropertyPredicateName) {
            return;
          }

          if (
            !isBindingPropertyPredicate
            // @ts-expect-error
            || isBindingPropertyPredicate(propertyPath, propertyName, currentModel)
          ) {
            // eslint-disable-next-line @typescript-eslint/init-declarations
            let unwrappedPropertyValue;

            ko.computed(() => {
              const propertyValue = currentModel[propertyName];
              applyModelValueToOption(propertyPath, propertyValue, true);
              unwrappedPropertyValue = ko.unwrap(propertyValue);
            }, null, { disposeWhenNodeIsRemoved: domNode });

            if (isPlainObject(unwrappedPropertyValue)) {
              if (!optionsByReference[propertyPath]) {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                unwrapModel(unwrappedPropertyValue, propertyPath);
              }
            }
          } else {
            applyModelValueToOption(propertyPath, currentModel[propertyName], false);
          }
        };

        function unwrapModel(model, propertyPath?: string): void {
          // eslint-disable-next-line no-restricted-syntax
          for (const propertyName in model) {
            if (Object.prototype.hasOwnProperty.call(model, propertyName)) {
              unwrapModelValue(model, propertyName, propertyPath ? [propertyPath, propertyName].join('.') : propertyName);
            }
          }
        }

        createComponent();

        return {
          controlsDescendantBindings: componentClass.subclassOf(Widget)
            || componentClass.subclassOf(VizWidget)
            || (componentClass.subclassOf(ComponentWrapper) && !(component instanceof ScrollView))
            || component instanceof Draggable,
        };
      },
    };

    if (componentName === 'dxValidator') {
      ko.bindingHandlers.dxValidator.after = editorsBindingHandlers;
    }
  };

  registerComponentCallbacks.add((name: string, componentClass): void => {
    registerComponentKoBinding(name, componentClass);
  });
}
