import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

import DxSelectBox from "../../select-box";
import DxTextBox from "../../text-box";

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("template rendering", () => {

    it("field template rendered", () => {
        const vm = defineComponent({
            template:
                `<dx-select-box :data-source="dataSource" field-template="field" id="component">
                    <template #field="">
                        <dx-text-box value="text" />
                    </template>
                </dx-select-box >`,
            data() {
                return {
                    dataSource: [{ ID: 1 }]
                };
            },
            components: {
                DxSelectBox,
                DxTextBox
            }
        });
        const wrapper = mount(vm);
        expect(wrapper.getComponent("#component").vm.$el.children).toHaveLength(1);
    });
});
