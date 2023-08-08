import { VueConstructor } from "vue";
import { BaseComponent } from "./component";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent = (): VueConstructor => BaseComponent().extend({
    created(): void {
        this.$_isExtension = true;
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        if (this.$vnode && (this.$vnode.componentOptions as any as IExtensionComponentNode).$_hasOwner) { return; }

        this.attachTo(this.$el);
    },

    methods: {
        attachTo(element: any) {
            this.$_createWidget(element);
        }
    }
});

export {
    DxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
