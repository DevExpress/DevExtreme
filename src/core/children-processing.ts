import { PatchFlags } from "@vue/shared";
import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";
import { configurationChildren, getComponentInfo, getNormalizedProps } from "./vue-helper";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

export function isFragment(node: any): boolean {
    const patchFlag = node.patchFlag;
    return patchFlag === PatchFlags.KEYED_FRAGMENT
    || patchFlag === PatchFlags.UNKEYED_FRAGMENT
    || patchFlag === PatchFlags.STABLE_FRAGMENT;
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        if (isFragment(node) && Array.isArray(node.children)) {
            pullConfigComponents(node.children as any as VNode[], nodes, ownerConfig);
        }
        if (!isFragment(node)) {
            nodes.push(node);
        }
        if (!node) { return; }

        const componentInfo = getComponentInfo(node) as any as IConfigurationComponent;
        if (!componentInfo || !componentInfo.$_optionName) { return; }

        const componentChildren = configurationChildren(node);
        const initialValues = {
            ...componentInfo.$_predefinedProps,
            ...getNormalizedProps(node.props || {})
        };

        const config = ownerConfig.createNested(
            componentInfo.$_optionName,
            initialValues,
            componentInfo.$_isCollectionItem,
            componentInfo.$_expectedChildren
        );

        (node as any as IConfigurable).$_config = config;
        (node as any as IConfigurable).$_innerChanges = {};

        if (componentChildren) {
            pullConfigComponents(componentChildren as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
