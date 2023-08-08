import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

import Configuration, { bindOptionWatchers, ExpectedChild, setEmitOptionChangedFunc } from "./configuration";

interface IConfigurationOwner {
    $_expectedChildren: Record<string, ExpectedChild>;
}

interface IConfigurationComponent extends IConfigurationOwner {
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

function getConfig(vueInstance: Pick<IVue, "$vnode">): Configuration | undefined {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);

    return componentOptions && componentOptions.$_config;
}

function getInnerChanges(vueInstance: Pick<IVue, "$vnode">): any {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);

    return componentOptions && componentOptions.$_innerChanges;
}

function initOptionChangedFunc(config, vueInstance: Pick<IVue, "$vnode" | "$props" | "$emit">, innerChanges: any) {
    if (!config) {
        return;
    }

    config.init(Object.keys(vueInstance.$props));
    setEmitOptionChangedFunc(config, vueInstance, innerChanges);
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

const DxConfiguration = (): VueConstructor => Vue.extend({
    beforeMount() {
        const config = getConfig(this) as Configuration;
        const innerChanges = getInnerChanges(this);
        initOptionChangedFunc(config, this, innerChanges);
        bindOptionWatchers(config, this, innerChanges);
    },

    mounted() {
        if ((this.$parent as any).$_instance) {
            (this.$parent as any).$_config.componentsCountChanged
                .push(getComponentInfo(getConfig(this) as Configuration));
        }
    },

    beforeDestroy() {
        (this.$parent as any).$_config.componentsCountChanged
            .push(getComponentInfo(getConfig(this) as Configuration, true));
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export {
    DxConfiguration,
    IComponentInfo,
    IConfigurable,
    IConfigurationComponent,
    initOptionChangedFunc,
    getConfig,
    getInnerChanges
};
