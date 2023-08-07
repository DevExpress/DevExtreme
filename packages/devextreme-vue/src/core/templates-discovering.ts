import { IConfigurable } from "./configuration-component";
import {
    configurationDefaultTemplate,
    configurationTemplate,
    declaredTemplates,
    getChildren,
    getConfigurationOptions,
    mount
} from "./vue-helper";

import { ComponentPublicInstance, h, Slot, VNode } from "vue";

import { IBaseComponent } from "./component";

const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: {
        fire(): void;
        add(handler: () => void): void;
        remove(handler: () => void): void;
    };
}

function asConfigurable(component: VNode): IConfigurable | undefined {
    const componentOptions = (component as any as IConfigurable);
    if (!componentOptions) {
        return;
    }
    if (!componentOptions.$_config || !componentOptions.$_config.name) {
        return undefined;
    }

    return componentOptions;
}

function hasTemplate(component: VNode) {
    return TEMPLATE_PROP in (component.type as any).props && configurationTemplate(component);
}

function discover(component: ComponentPublicInstance): Record<string, Slot> {
    const templates: Record<string, Slot> = {};
    const namedTeplates = declaredTemplates(component);
    for (const slotName in namedTeplates) {
        if (slotName === "default" && component.$slots.default) {
            continue;
        }

        const slot = namedTeplates[slotName];
        if (!slot) {
            continue;
        }

        templates[slotName] = slot;
    }
    const componentChildren = getChildren(component as IBaseComponent);
    for (const childComponent of componentChildren) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        const defaultSlot = configurationDefaultTemplate(childComponent);
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function clearConfiguration(content: VNode[]) {
    const newContent: VNode[] = [];
    content.forEach((item) => {
        const configurable = getConfigurationOptions(item);
        if (!configurable || !configurable.$_optionName) {
            newContent.push(item);
        }
    });
    return newContent;
}

function mountTemplate(
    getSlot: () => Slot,
    parent: ComponentPublicInstance,
    data: any,
    name: string,
    placeholder: Element
): ComponentPublicInstance {
    return mount({
        name,
        inject: ["eventBus"],
        created(this: any & IEventBusHolder) {
            this.eventBus.add(this.$_updatedHandler);
        },
        mounted() {
            data.onRendered();
        },
        unmounted() {
            this.eventBus.remove(this.$_updatedHandler);
        },
        methods: {
            $_updatedHandler() {
                (this as any as ComponentPublicInstance).$forceUpdate();
            }
        },
        render: (): VNode | VNode[] => {
            const content = clearConfiguration(getSlot()(data) as VNode[]);
            if (!content) {
                return h("div");
            }

            return content.length > 1 ? content : content[0];
        }
    }, parent, placeholder);
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
