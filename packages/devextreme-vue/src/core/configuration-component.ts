import { ComponentPublicInstance, defineComponent } from "vue";
import { getNodeOptions, getNodeTypeOfComponent } from "./vue-helper";

import Configuration, { bindOptionWatchers, ExpectedChild, setEmitOptionChangedFunc } from "./configuration";

interface IConfigurationOwner {
    $_expectedChildren: Record<string, ExpectedChild>;
}

interface IConfigurationComponent extends IConfigurationOwner, ComponentPublicInstance {
    $_optionName: string;
    $_isCollectionItem: boolean;
    $_predefinedProps: Record<string, any>;
}

interface IConfigurable extends IConfigurationOwner {
    $_config: Configuration;
    $_innerChanges: any;
}

interface IComponentInfo {
    optionPath: string;
    isCollection: boolean;
    removed?: boolean;
}

function getConfig(vueInstance: Pick<ComponentPublicInstance, "$">): Configuration | undefined {
    const componentOptions = (getNodeOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_config || (vueInstance as any as IConfigurable).$_config;
}

function getInnerChanges(vueInstance: Pick<ComponentPublicInstance, "$">): any {
    const componentOptions = (getNodeOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_innerChanges || (vueInstance as any as IConfigurable).$_innerChanges;
}

function initOptionChangedFunc(
    config,
    props: any,
    vueInstance: Pick<ComponentPublicInstance, "$" | "$props" | "$emit" | "$options">,
    innerChanges: any) {
    if (!config) {
        return;
    }

    config.init(Object.keys(props));
    if (vueInstance) {
        setEmitOptionChangedFunc(config, vueInstance, innerChanges);
    }
}

function getComponentInfo({name, isCollectionItem, ownerConfig }: Configuration, removed?: boolean): IComponentInfo {
    const parentPath =  ownerConfig && ownerConfig.fullPath;
    const optionPath = name && parentPath ? `${parentPath}.${name}` : name || "";

    return {
        optionPath,
        isCollection: isCollectionItem,
        removed
    };
}

function initDxConfiguration() {
    return defineComponent({
        beforeMount() {
            const thisComponent = this as any as IConfigurationComponent;
            const config = getConfig(thisComponent) as Configuration;
            const innerChanges = getInnerChanges(thisComponent);
            initOptionChangedFunc(config, getNodeTypeOfComponent(thisComponent).props, thisComponent, innerChanges);
            bindOptionWatchers(config, this, innerChanges);
        },

        mounted() {
            if ((this.$parent as any).$_instance) {
                (this.$parent as any).$_config.componentsCountChanged
                    .push(getComponentInfo(getConfig(this as any as IConfigurationComponent) as Configuration));
            }
        },

        beforeUnmount() {
            const config = getConfig(this as any as IConfigurationComponent) as Configuration;
            if (config) {
                (this.$parent as any).$_config.componentsCountChanged
                    .push(getComponentInfo(config, true));
            }
        },

        render(): null {
            return null;
        }
    });
}

export {
    initDxConfiguration,
    IComponentInfo,
    IConfigurable,
    IConfigurationComponent,
    initOptionChangedFunc,
    getConfig,
    getInnerChanges
};
