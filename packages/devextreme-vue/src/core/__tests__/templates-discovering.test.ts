import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { discover } from "../templates-discovering";

describe("templates-discovering (vue 3)", () => {

    it("discovers named scoped slot", () => {
        const template = "<template #slot_name='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    it("discovers named not-scoped slot", () => {
        const template = "<template #slot_name/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    // Vue doesn't recognize this as slot
    it("doesn't discover not-scoped not-named slot", () => {
        const template = "<template/>";
        expect(getDiscoveredTemplates(template)).toEqual([]);
    });

    // to avoid creating templates from config-components
    it("doesn't discover implicit default slot", () => {
        const template = "<div>abc</div>";
        expect(getDiscoveredTemplates(template)).toEqual([]);
    });

    // to avoid creating templates from config-components
    it("doesn't discover custom component", () => {
        const template = "<customComponent #default='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual([]);
    });
});

function getDiscoveredTemplates(template: string): string[] {
    let actual;
    const vm = defineComponent({
        template: `<container>${template}</container>`,
        components: {
            container: {
                render() {
                    actual = discover(this);
                    return null;
                }
            },
            customComponent: {
                render() {
                    return null;
                }
            }
        }
    });

    mount(vm);
    return Object.keys(actual);
}
