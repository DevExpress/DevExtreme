import Configuration, {
    bindOptionWatchers,
    ExpectedChild,
    setEmitOptionChangedFunc,
    UpdateFunc
} from "../configuration";

import { ComponentPublicInstance, reactive } from "vue";

function createRootConfig(updateFunc: UpdateFunc): Configuration {
    return new Configuration(updateFunc, null, {});
}

function createConfigWithExpectedChildren(children: Record<string, ExpectedChild>): Configuration {
    return new Configuration(
        jest.fn(),
        null,
        {},
        children
    );
}

describe("fullPath building", () => {

    const testCases: Array<{
        msg: string;
        name: string | null;
        ownerPath?: string;
        expected: string | null;
        collectionIndex?: number;
    }> = [
            {
                msg: "works for null",
                name: null,
                expected: null
            },
            {
                msg: "works without owner",
                name: "abc",
                expected: "abc"
            },
            {
                msg: "works with owner",
                name: "abc",
                ownerPath: "def",
                expected: "def.abc"
            },
            {
                msg: "works for collection item",
                name: "abc",
                collectionIndex: 123,
                expected: "abc[123]"
            },
            {
                msg: "works for collection item with owner",
                name: "abc",
                ownerPath: "def",
                collectionIndex: 123,
                expected: "def.abc[123]"
            }
        ];

    for (const { msg, name, collectionIndex, ownerPath, expected } of testCases) {
        it(msg, () => {
            const isCollection = collectionIndex !== undefined;
            const ownerConfig = ownerPath ? { fullPath: ownerPath } : undefined;
            expect(new Configuration(
                jest.fn(),
                name,
                {},
                undefined,
                isCollection,
                collectionIndex,
                ownerConfig
            ).fullPath).toBe(expected);
        });
    }
});

it("calls update from nested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    const nested = root.createNested("option", {});
    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.prop", 123);
});

it("calls update from subnested", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {});
    const subNested = nested.createNested("subOption", {});

    subNested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option.subOption.prop", 123);
});

it("calls update from nested collectionItem (first)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {}, true);
    root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[0].prop", 123);
});

it("calls update from nested collectionItem (middle)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);

    root.createNested("option", {}, true);
    const nested = root.createNested("option", {}, true);
    root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[1].prop", 123);
});

it("calls update from nested collectionItem (last)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    root.createNested("option", {}, true);
    root.createNested("option", {}, true);
    const nested = root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[2].prop", 123);
});

it("calls update from nested collectionItem (the only)", () => {
    const callback = jest.fn();
    const root = createRootConfig(callback);
    const nested = root.createNested("option", {}, true);

    nested.updateValue("prop", 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option[0].prop", 123);
});

it("binds option watchers", () => {
    const updateValueFunc = jest.fn();
    const $watchFunc = jest.fn();
    const innerChanges = {};

    bindOptionWatchers(
        {
            updateValue: updateValueFunc,
            getOptionsToWatch: () => ["prop1"],
            innerChanges: {}
        } as any,
        {
            $watch: $watchFunc
        },
        innerChanges
    );

    expect($watchFunc.mock.calls[0][0]).toBe("prop1");

    const value = {};
    $watchFunc.mock.calls[0][1](value);

    expect(updateValueFunc).toHaveBeenCalledTimes(1);
    expect(updateValueFunc.mock.calls[0][0]).toBe("prop1");
    expect(updateValueFunc.mock.calls[0][1]).toBe(value);
});

it("should update only when raw value not equal", () => {
    const updateValueFunc = jest.fn();
    const $watchFunc = jest.fn();
    const innerChanges = { prop1: "test" };

    bindOptionWatchers(
        {
            updateValue: updateValueFunc,
            getOptionsToWatch: () => ["prop1"],
            innerChanges: {}
        } as any,
        {
            $watch: $watchFunc
        },
        innerChanges
    );

    $watchFunc.mock.calls[0][1](reactive(innerChanges).prop1);

    expect(updateValueFunc).toHaveBeenCalledTimes(0);

    $watchFunc.mock.calls[0][1](reactive({ prop1: "test1"}).prop1);
    expect(updateValueFunc).toHaveBeenCalledTimes(1);
    expect(updateValueFunc.mock.calls[0][0]).toBe("prop1");
    expect(updateValueFunc.mock.calls[0][1]).toBe("test1");
});

describe("initial configuration", () => {

    it("pulls value from nested", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested
            .createNested("subOption", { prop: 123 })
            .init(["prop"]);

        expect(root.getNestedOptionValues()).toMatchObject({
            option: {
                subOption: {
                    prop: 123
                }
            }
        });
    });

    it("pulls array of values from a coollectionItem nested (single value)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("options", { propA: 123 }, true);

        expect(root.getNestedOptionValues()).toMatchObject({
            options: [
                { propA: 123 }
            ]
        });
    });

    it("pulls array of values from a coollectionItem nested (several values)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("options", { propA: 123 }, true);
        root.createNested("options", { propA: 456, propB: 789 }, true);

        expect(root.getNestedOptionValues()).toMatchObject({
            options: [
                { propA: 123 },
                { propA: 456, propB: 789 },
            ]
        });
    });

    it("pulls values from the last nested (not a coollectionItem)", () => {
        const root = createRootConfig(jest.fn());

        root.createNested("option", { propA: 123 });
        root.createNested("option", { propA: 456, propB: 789 });

        expect(root.getNestedOptionValues()).toMatchObject({
            option: { propA: 456, propB: 789 }
        });
    });

    it("pulls values from self and nested", () => {
        const root = new Configuration(jest.fn(), null, { propA: 123 });

        const nested = root.createNested("option", { propB: 456 });
        nested.createNested("subOption", { propC: 789 });

        expect(root.getNestedOptionValues()).toMatchObject({
            option: {
                propB: 456,
                subOption: {
                    propC: 789
                }
            }
        });
        expect(root.initialValues).toMatchObject({
            propA: 123
        });
    });

    it("pulls empty value for correct option structure T728446", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {}, true);
        nested.createNested("subOption", {});

        expect(root.getNestedOptionValues()).toMatchObject({ option: [{ subOption: {} }]});
    });

    it("pulls values and ignores empty nested", () => {
        const root = createRootConfig(jest.fn());

        const nested = root.createNested("option", {});
        nested.init(["empty"]);
        nested
            .createNested("subOption", { prop: 123 })
            .init(["prop"]);

        root.createNested("anotherOption", {});
        nested.createNested("anotherSubOption", {});

        expect(root.getNestedOptionValues()).toMatchObject({
            option: {
                subOption: {
                    prop: 123
                }
            }
        });
    });

});

describe("collection items creation", () => {

    describe("not-expected item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {}, true);

            expect(nested.isCollectionItem).toBeTruthy();
        });

        it("is false if isCollection arg is false", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {}, false);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is false if isCollection arg is undefined", () => {
            const owner = new Configuration(jest.fn(), null, {});

            const nested = owner.createNested("name", {});

            expect(nested.isCollectionItem).toBeFalsy();
        });
    });

    describe("expectation of collection item", () => {

        it("applied if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true, optionName: "def" } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });

        it("applied if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true, optionName: "def" } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });

        it("applied if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: true,  optionName: "def" } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeTruthy();
            expect(nested.name).toBe("def");
        });
    });

    describe("expected as collection item .isCollectionItem prop", () => {

        it("is true if isCollection arg is true", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {}, true);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is false", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {}, false);

            expect(nested.isCollectionItem).toBeFalsy();
        });

        it("is true if isCollection arg is undefined", () => {
            const owner = createConfigWithExpectedChildren({ abc: { isCollectionItem: false, optionName: "def" } });

            const nested = owner.createNested("abc", {});

            expect(nested.isCollectionItem).toBeFalsy();
            expect(nested.name).toBe("def");
        });
    });

});

describe("options watch-list", () => {

    it("includes option with initial values", () => {
        const config = new Configuration(jest.fn(), null, { option1: 123, option2: 456 });
        config.init(["option1"]);

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("includes option without initial values", () => {
        const config = new Configuration(jest.fn(), null, {});
        config.init(["option1"]);

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

    it("excludes option if finds nested config with the same name", () => {
        const config = new Configuration(jest.fn(), null, {});
        config.init(["option1", "theNestedOption"]);
        config.createNested("theNestedOption", {});

        expect(config.getOptionsToWatch()).toEqual(["option1"]);
    });

});

describe("onOptionChanged", () => {

    [
        {
            fullName: "option",
            value: "new value",
            previousValue: "old value",
            component: null
        },
        {
            fullName: "option.nestedOption.subNestedOption",
            value: "any value",
            previousValue: "old value",
            component: { option: (name: string) => name === "option" && "new value" }
        },
        {
            fullName: "option[0]",
            value: "any value",
            previousValue: "old value",
            component: { option: (name: string) => name === "option" && "new value" }
        },
        {
            fullName: "option[0].nestedOption",
            value: "any value",
            previousValue: "old value",
            component: { option: (name: string) => name === "option" && "new value" }
        },
    ].map((optionChangedArgs) => {
        it("emits from root configuration", () => {
            const innerChanges = {};
            const emitStub = jest.fn();

            const config = new Configuration(jest.fn(), null, {});
            const component = {
                $emit: emitStub,
                $props: { option: undefined },
                $options: {
                    props: {
                        option: undefined
                    }
                }
            };
            setEmitOptionChangedFunc(config, component as any as ComponentPublicInstance, innerChanges);

            config.onOptionChanged(optionChangedArgs);

            expect(emitStub).toHaveBeenCalledTimes(1);
            expect(emitStub).toHaveBeenCalledWith("update:option", "new value");
            expect(innerChanges).toEqual({ option: "new value" });
        });
    });

    [
        {
            fullName: "option.nestedOption",
            value: "new value",
            previousValue: "old value",
            component: null
        },
        {
            fullName: "option.nestedOption.subNestedOption",
            value: "any value",
            previousValue: "old value",
            component: { option: (name: string) => name === "option.nestedOption" && "new value" }
        },
    ].map((optionChangedArgs) => {
        it("emits from nested configuration", () => {
            const innerChanges = {};
            const emitStub = jest.fn();

            const config = new Configuration(jest.fn(), null, {});
            const nestedConfig = config.createNested("option", {});
            const component = {
                $emit: emitStub,
                $props: { nestedOption: undefined },
                $options: {
                    props: {
                        nestedOption: undefined
                    }
                }
            };
            setEmitOptionChangedFunc(
                nestedConfig,
                component as any as ComponentPublicInstance,
                innerChanges);

            config.onOptionChanged(optionChangedArgs);

            expect(emitStub).toHaveBeenCalledTimes(1);
            expect(emitStub).toHaveBeenCalledWith("update:nestedOption", "new value");
            expect(innerChanges).toEqual({ nestedOption: "new value" });
        });
    });

    [
        {
            fullName: "option[0].nestedOption",
            value: "new value",
            previousValue: "old value",
            component: null
        },
        {
            fullName: "option[0].nestedOption.subNestedOption",
            value: "any value",
            previousValue: "old value",
            component: { option: (name: string) => name === "option[0].nestedOption" && "new value" }
        },
    ].map((optionChangedArgs) => {
        it("emits from nested collection configuration", () => {
            const innerChanges = {};
            const emitStub = jest.fn();

            const config = new Configuration(jest.fn(), null, {});
            const nestedConfig = config.createNested("option", {}, true);
            const component = {
                $emit: emitStub,
                $props: { nestedOption: undefined },
                $options: {
                    props: {
                        nestedOption: undefined
                    }
                }
            };
            setEmitOptionChangedFunc(
                nestedConfig,
                component as any as ComponentPublicInstance,
                innerChanges);

            config.onOptionChanged(optionChangedArgs);

            expect(emitStub).toHaveBeenCalledTimes(1);
            expect(emitStub).toHaveBeenCalledWith("update:nestedOption", "new value");
            expect(innerChanges).toEqual({ nestedOption: "new value" });
        });
    });

    [
        {
            fullName: "option",
            value: "value",
            previousValue: "value",
            component: null
        },
        {
            fullName: "option",
            value: [],
            previousValue: [],
            component: null
        },
    ].map((optionChangedArgs) => {
        it("does not emit", () => {
            const innerChanges = {};
            const emitStub = jest.fn();

            const config = new Configuration(jest.fn(), null, {});
            const component = {
                $: {},
                $emit: emitStub,
                $props: {},
                $options: {
                }
            };
            setEmitOptionChangedFunc(config, component as any as ComponentPublicInstance, innerChanges);

            config.onOptionChanged(optionChangedArgs);

            expect(emitStub).toHaveBeenCalledTimes(0);
        });
    });

    // https://github.com/DevExpress/devextreme-vue/issues/330
    it("emits once", () => {
        const emitStubRoot = jest.fn();
        const emitStubNested = jest.fn();
        const component = {
            $: {},
            $emit: emitStubRoot,
            $props: { option: undefined },
            $options: {
                props: {
                    option: undefined
                }
            }
        };

        const config = new Configuration(jest.fn(), null, {});
        setEmitOptionChangedFunc(config, component as any as ComponentPublicInstance, {});
        const nestedConfig1 = config.createNested("option", {}, true);
        setEmitOptionChangedFunc(nestedConfig1, component as any as ComponentPublicInstance, {});
        const subNestedConfig = nestedConfig1.createNested("option", {}, false);
        setEmitOptionChangedFunc(subNestedConfig, component as any as ComponentPublicInstance, {});
        const nestedConfig2 = config.createNested("option", {}, true);
        setEmitOptionChangedFunc(nestedConfig2, component as any as ComponentPublicInstance, {});

        config.onOptionChanged({ fullName: "option", value: "new value", previousValue: "old value", component: null });

        expect(emitStubRoot).toHaveBeenCalledTimes(1);
        expect(emitStubNested).toHaveBeenCalledTimes(0);
    });

    it("shouldn't emit if component does't have the prop", () => {
        const emitStubRoot = jest.fn();

        const config = new Configuration(jest.fn(), null, {});
        const component = {
            $emit: emitStubRoot,
            $props: { option: undefined },
            $options: {
                props: {
                    option: undefined
                }
            }
        };
        setEmitOptionChangedFunc(config, (component as any), {});

        config.onOptionChanged({
            fullName: "wrongName",
            value: "new value",
            previousValue: "old value",
            component: null });

        expect(emitStubRoot).toHaveBeenCalledTimes(0);
    });
});
