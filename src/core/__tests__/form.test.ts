import { mount } from "@vue/test-utils";

import { DxForm, DxItem } from "../../form";

jest.setTimeout(1000);
beforeEach(() => {
    jest.clearAllMocks();
});

describe("component rendering", () => {

    it("rendering with configuration options", () => {
        const vm = {
            template:
                `<dx-form :form-data="data">
                    <dx-item data-field="name"></dx-item>
                </dx-form>`,
            data() {
                return {
                    data: { name: "test" }
                };
            },
            components: {
                DxForm,
                DxItem
            }
        };
        expect(() => mount(vm)).not.toThrow("");
    });
});
