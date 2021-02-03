import * as VueType from "vue";
import { discover } from "./templates-discovering";

const Vue = VueType.default || VueType;

describe("templates-discovering (vue 2)", () => {

    it("discovers named scoped slot", () => {
        const template = "<div slot='slot_name' slot-scope='slot_scope'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    it("discovers default scoped slot", () => {
        const template = "<div slot-scope='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["default"]);
    });

    it("discovers named not-scoped slot", () => {
        const template = "<div slot='slot_name'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    // to avoid creating templates from config-components
    it("doesn't discover not-scoped default slot", () => {
        const template = "<div/>";
        expect(getDiscoveredTemplates(template)).toEqual([]);
    });
});

describe("templates-discovering (vue 3)", () => {

    it("discovers named scoped slot", () => {
        const template = "<template #slot_name='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    it("discovers named not-scoped slot", () => {
        const template = "<template #slot_name/>";
        expect(getDiscoveredTemplates(template)).toEqual(["slot_name"]);
    });

    it("discovers explicit default slot", () => {
        const template = "<template #default/>";
        expect(getDiscoveredTemplates(template)).toEqual(["default"]);
    });

    it("discovers explicit default scoped slot", () => {
        const template = "<template #default='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["default"]);
    });

    it("discovers explicit default scoped slot", () => {
        const template = "<template v-slot='_'/>";
        expect(getDiscoveredTemplates(template)).toEqual(["default"]);
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
    new Vue({
        template: `<container>${template}</container>`,
        components: {
            container: {
                render(h) {
                    actual = discover(this);
                    return h();
                }
            },
            customComponent: {
                render(h) {
                    return h();
                }
            }
        }
    }).$mount();

    return Object.keys(actual);
}
