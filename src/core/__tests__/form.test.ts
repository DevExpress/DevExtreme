import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";

import { DxForm, DxItem } from "../../form";

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("form", () => {

    it("should render config components by condition", async (done) => {
        const vm = defineComponent({
            template:
                `<DxForm
                id="form"
                :form-data="data"
              >
                <DxItem
                  v-if="show"
                  data-field="FirstName"
                />
                <DxItem
                  data-field="Position"
                />
              </DxForm>`,
            components: {
                DxItem, DxForm
            },
            props: {
                show: {
                    type: Boolean,
                    default: true
                },
                data: {
                    type: Object,
                    default: {
                        FirstName: "name1",
                        Position: "name2"
                    }
                }
            }
        });

        const wrapper = mount(vm);

        wrapper.setProps({ show: false });

        nextTick(() => {
            wrapper.setProps({ show: true });
            nextTick(() => {
                expect(wrapper.getComponent("#form").vm.$el
                .getElementsByClassName("dx-field-item-label-text")).toHaveLength(2);
                done();
             });
        });
    });
});
