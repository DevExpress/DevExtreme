import { ComponentPublicInstance, defineComponent, h, VNode } from "vue";

import CreateCallback from "devextreme/core/utils/callbacks";
import { triggerHandler } from "devextreme/events";

import { defaultSlots, getChildren, getComponentInstance, getComponentProps, getVModelValue, VMODEL_NAME } from "./vue-helper";

import { pullAllChildren } from "./children-processing";
import Configuration, { bindOptionWatchers, setEmitOptionChangedFunc } from "./configuration";
import { IConfigurable, initOptionChangedFunc } from "./configuration-component";
import { DX_REMOVE_EVENT } from "./constants";
import { IExtension, IExtensionComponentNode } from "./extension-component";
import { camelize, forEachChildNode, getOptionValue, toComparable } from "./helpers";
import {
    IEventBusHolder
} from "./templates-discovering";
import { TemplatesManager } from "./templates-manager";

interface IWidgetComponent extends IConfigurable {
    $_instance: any;
    $_WidgetClass: any;
    $_pendingOptions: Record<string, any>;
    $_templatesManager: TemplatesManager;
}

export interface IBaseComponent extends ComponentPublicInstance, IWidgetComponent, IEventBusHolder {
    $_isExtension: boolean;
    $_applyConfigurationChanges: () => void;
    $_createWidget: (element: any) => void;
    $_getIntegrationOptions: () => void;
    $_getExtraIntegrationOptions: () => void;
    $_getWatchMethod: () => void;
    $_createEmitters: () => void;
    $_processChildren: () => void;
    $_getTemplates: () => object;
}

function initBaseComponent() {
    return defineComponent({
        inheritAttrs: false,

        data() {
            return {
                eventBus: CreateCallback()
            };
        },

        provide() {
            return {
                eventBus: this.eventBus
            };
        },

        render(): VNode {
            const thisComponent = this as any as IBaseComponent;
            const children: VNode[] = [];
            if (thisComponent.$_config.cleanNested) {
                thisComponent.$_config.cleanNested();
            }
            pullAllChildren(defaultSlots(this), children, thisComponent.$_config);

            this.$_processChildren(children);
            return h("div",
            {
                attrs: { id: this.$attrs.id }
            },
            children);
        },

        beforeUpdate() {
            const thisComponent = this as any as IBaseComponent;
            thisComponent.$_config.setPrevNestedOptions(thisComponent.$_config.getNestedOptionValues());
        },

        updated() {
            const thisComponent = this as any as IBaseComponent;
            const nodes = cleanWidgetNode(this.$el);
            getChildren(thisComponent).forEach((child) => {
                initOptionChangedFunc(
                    child.$_config,
                    (child.type as any).props || {},
                    getComponentInstance(child), child.$_innerChanges);
            });
            thisComponent.$_templatesManager.discover();

            thisComponent.$_instance.beginUpdate();
            if (thisComponent.$_templatesManager.isDirty) {
                thisComponent.$_instance.option(
                    "integrationOptions.templates",
                    thisComponent.$_templatesManager.templates
                );

                for (const name of Object.keys(thisComponent.$_templatesManager.templates)) {
                    thisComponent.$_instance.option(name, name);
                }

                thisComponent.$_templatesManager.resetDirtyFlag();
            }

            for (const name of Object.keys(thisComponent.$_pendingOptions)) {
                thisComponent.$_instance.option(name, thisComponent.$_pendingOptions[name]);
            }
            thisComponent.$_pendingOptions = {};

            this.$_applyConfigurationChanges();

            thisComponent.$_instance.endUpdate();

            restoreNodes(this.$el, nodes);
            this.eventBus.fire();
        },

        beforeUnmount(): void {
            const thisComponent = this as any as IBaseComponent;
            const instance = thisComponent.$_instance;
            if (instance) {
                triggerHandler(this.$el, DX_REMOVE_EVENT);
                instance.dispose();
            }
        },

        created(): void {
            const thisComponent = this as any as IBaseComponent;
            const props = getComponentProps(this);
            thisComponent.$_config = new Configuration(
                (n: string, v: any) => {
                    if (Array.isArray(v)) {
                        thisComponent.$_instance.option(n, v);
                    } else {
                        thisComponent.$_pendingOptions[n === VMODEL_NAME ? "value" : n] = v;
                    }
                },
                null,
                props && { ...props },
                thisComponent.$_expectedChildren
            );
            thisComponent.$_innerChanges = {};

            thisComponent.$_config.init(this.$props && Object.keys(this.$props));
        },

        methods: {
            $_applyConfigurationChanges(): void {
                const thisComponent = this as any as IBaseComponent;
                thisComponent.$_config.componentsCountChanged.forEach(({ optionPath, isCollection, removed }) => {
                    const options = thisComponent.$_config.getNestedOptionValues();

                    if (!isCollection && removed) {
                        thisComponent.$_instance.resetOption(optionPath);
                    } else {
                        thisComponent.$_instance.option(optionPath, getOptionValue(options, optionPath));
                    }
                });

                thisComponent.$_config.cleanComponentsCountChanged();
            },
            $_createWidget(element: any): void {
                const thisComponent = this as any as IBaseComponent;

                thisComponent.$_pendingOptions = {};
                thisComponent.$_templatesManager = new TemplatesManager(this as ComponentPublicInstance);

                const config = thisComponent.$_config;

                if (config.initialValues.hasOwnProperty(VMODEL_NAME)) {
                    config.initialValues.value = getVModelValue(config.initialValues);
                }

                const options: object = {
                    templatesRenderAsynchronously: true,
                    ...getComponentProps(thisComponent),
                    ...config.initialValues,
                    ...config.getNestedOptionValues(),
                    ...this.$_getIntegrationOptions()
                };

                const instance = new thisComponent.$_WidgetClass(element, options);
                thisComponent.$_instance = instance;

                instance.on("optionChanged", (args) => config.onOptionChanged(args));
                setEmitOptionChangedFunc(config, thisComponent, thisComponent.$_innerChanges);
                bindOptionWatchers(config, thisComponent, thisComponent.$_innerChanges);
                this.$_createEmitters(instance);
            },

            $_getIntegrationOptions(): object {
                const thisComponent = this as any as IBaseComponent;
                const result: Record<string, any> = {
                    integrationOptions:  {
                        watchMethod: this.$_getWatchMethod(),
                    },
                    ...this.$_getExtraIntegrationOptions(),
                };

                if (thisComponent.$_templatesManager.isDirty) {
                    const templates = thisComponent.$_templatesManager.templates;

                    result.integrationOptions.templates = templates;
                    for (const name of Object.keys(templates)) {
                        result[name] = name;
                    }

                    thisComponent.$_templatesManager.resetDirtyFlag();
                }

                return result;
            },

            $_getWatchMethod(): (
                valueGetter: () => any,
                valueChangeCallback: (value: any) => void,
                options: { deep: boolean, skipImmediate: boolean }
            ) => any {
                return (valueGetter, valueChangeCallback, options) => {
                    options = options || {};
                    if (!options.skipImmediate) {
                        valueChangeCallback(valueGetter());
                    }

                    return this.$watch(() => {
                        return valueGetter();
                    }, (newValue, oldValue) => {
                        if (toComparable(oldValue) !== toComparable(newValue) || options.deep) {
                            valueChangeCallback(newValue);
                        }
                    }, {
                        deep: options.deep
                    });
                };
            },

            $_getExtraIntegrationOptions(): object {
                return {};
            },

            $_processChildren(_children: VNode[]): void {
                return;
            },

            $_createEmitters(instance: any): void {
                if (this.$attrs) {
                    Object.keys(this.$attrs).forEach((listenerName: string) => {
                        const eventName = camelize(listenerName);
                        instance.on(eventName, (e: any) => {
                            this.$emit(listenerName, e);
                        });
                    });
                }
            }
        }
    });
}

function cleanWidgetNode(node: Node) {
    const removedNodes: Element[] = [];
    forEachChildNode(node, (childNode: Element) => {
        const parent = childNode.parentNode;
        const isExtension = childNode.hasAttribute && childNode.hasAttribute("isExtension");
        if ((childNode.nodeName === "#comment" || isExtension) && parent) {
            removedNodes.push(childNode);
            parent.removeChild(childNode);
        }
    });

    return removedNodes;
}

function restoreNodes(el: Element, nodes: Element[]) {
    nodes.forEach((node) => {
        el.appendChild(node);
    });
}

function initDxComponent() {
    return defineComponent({
        extends: initBaseComponent(),
        methods: {
            $_getExtraIntegrationOptions(): object {
                return {
                    onInitializing() {
                        (this as any).beginUpdate();
                    }
                };
            },

            $_processChildren(children: VNode[]): void {
                children.forEach((childNode: VNode) => {
                    if (!childNode || typeof childNode !== "object") { return; }

                    (childNode as any as IExtensionComponentNode).$_hasOwner = true;
                });
            },
        },

        mounted(): void {
            const nodes = cleanWidgetNode(this.$el);
            const thisComponent = this as any as IBaseComponent;

            this.$_createWidget(this.$el);
            thisComponent.$_instance.endUpdate();

            restoreNodes(this.$el, nodes);
            if (this.$slots && this.$slots.default) {
                getChildren(thisComponent).forEach((child: VNode) => {
                    const childExtenton = child as any as IExtension;
                    if (childExtenton && (childExtenton as any as IExtension).$_isExtension) {
                        (childExtenton as any).$_attachTo(this.$el);
                    }
                });
            }
        }
    });
}

export { initDxComponent, initBaseComponent, IWidgetComponent };
