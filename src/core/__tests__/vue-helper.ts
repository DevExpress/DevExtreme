import { setCompatOptions } from "../vue-helper";

describe("setCompatOptions", () => {

    it("set mode", () => {
        const component = {
            compatConfig: {}
        };
        setCompatOptions(component);
        expect(component.compatConfig).toStrictEqual({ MODE: 3 });
    });
});
