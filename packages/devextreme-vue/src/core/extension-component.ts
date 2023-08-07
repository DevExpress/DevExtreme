import { defineComponent } from "vue";
import { IBaseComponent, initBaseComponent } from "./component";
import { getNodeOptions } from "./vue-helper";

interface IExtension {
    $_isExtension: boolean;
    $_attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

function initDxExtensionComponent() {
    return defineComponent({
        extends: initBaseComponent(),
        mounted() {
            this.$el.setAttribute("isExtension", "true");
            const nodeOptions = getNodeOptions(this);
            (nodeOptions as any as IExtension).$_isExtension = true;
            (nodeOptions as any as IExtension).$_attachTo = this.attachTo.bind(this);
            if (nodeOptions && (nodeOptions as any as IExtensionComponentNode).$_hasOwner) { return; }

            this.attachTo(this.$el);
        },

        methods: {
            attachTo(element: any) {
                (this as any as IBaseComponent).$_createWidget(element);
            }
        }
    });
}

export {
    initDxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
