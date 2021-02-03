import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

import DxButton from "../../button";
import DxToolbar, { DxItem } from "../../toolbar";

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("template rendering", () => {

    it("should render a default template only for a configuration component where it is declared", () => {
        const vm = defineComponent({
            template:
                `<dx-toolbar id="component">
                    <dx-item location="before">
                        <template #default>
                            <dx-button text="test" />
                        </template>
                    </dx-item>
                    <dx-item location="center"></dx-item>
                </dx-toolbar>`,
            components: {
                DxToolbar,
                DxItem,
                DxButton
            }
        });
        const wrapper = mount(vm);
        expect(wrapper.vm.$el.getElementsByClassName("dx-button")).toHaveLength(1);
    });
});
