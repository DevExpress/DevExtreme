import * as VueType from "vue";
import { DxComponent, IWidgetComponent } from "./component";
import config, { getOption } from "./config";

const Vue = VueType.default || VueType;

const Widget = {
    option: jest.fn(),
    dispose: jest.fn(),
    on: jest.fn(),
    fire: jest.fn(),
    beginUpdate: jest.fn(),
    endUpdate: jest.fn(),
};

const WidgetClass = jest.fn(() => Widget);

const TestComponent = Vue.extend({
    extends: DxComponent(),
    beforeCreate() {
        (this as any as IWidgetComponent).$_WidgetClass = WidgetClass;
    }
});

describe("useLegacyTemplateEngine", () => {
    const originalValue = getOption("useLegacyTemplateEngine");

    beforeEach(() => {
        config({ useLegacyTemplateEngine: true });
    });

    afterEach(() => {
        config({ useLegacyTemplateEngine: originalValue });
    });

    it("has model as scope", () => {
        new Vue({
            template: `<test-component>
                            <div slot='item' slot-scope='data'>Template {{data.text}}</div>
                        </test-component>`,
            components: {
                TestComponent
            }
        }).$mount();

        // @ts-ignore
        const render = WidgetClass.mock.calls[0][1].integrationOptions.templates.item.render;
        const renderedTemplate = render({
            container: document.createElement("div"),
            model: { text: "with data" }
        });

        expect(renderedTemplate.innerHTML).toBe("Template with data");
    });
});
