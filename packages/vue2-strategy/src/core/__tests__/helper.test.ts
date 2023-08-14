import { getOptionValue } from "../helpers";

describe("getOptionValue", () => {
    it("returns for simple option", () => {
        const optionValue = getOptionValue({ test: "text" }, "test");

        expect(optionValue).toEqual("text");
    });

    it("returns for complex option", () => {
        const optionValue = getOptionValue({ test: { value: "text" } }, "test");
        const optionValue1 = getOptionValue({ test: { value: "text" } }, "test.value");
        const optionValue2 = getOptionValue({ test: { value: "text" } }, "test1.value");

        expect(optionValue).toEqual({ value: "text" });
        expect(optionValue1).toEqual("text");
        expect(optionValue2).toEqual(undefined);
    });

    it("returns for collection option", () => {
        const value = [
            { text: "value1"},
            { text: "value2"},
            { text: "value3",
              test: [{
               option: {
                   text: "value1"
               }
            }, {
               text: "value2"
            }] }
        ];

        const optionValue1 = getOptionValue({ test: value }, "test[1]");
        const optionValue2 = getOptionValue({ test: value }, "test");
        const optionValue3 = getOptionValue({ test: value }, "test[2].test[1]");
        const optionValue4 = getOptionValue({ test: value }, "test[2].test");
        const optionValue5 = getOptionValue({ test: value }, "test[2].test[0].option");
        const optionValue6 = getOptionValue({ test: value }, "test[2].test[0].option.text");

        expect(optionValue1).toEqual({ text: "value2" });
        expect(optionValue2).toEqual(value);
        expect(optionValue3).toEqual({ text: "value2" });
        expect(optionValue4).toEqual([{
            option: { text: "value1" }
         }, {
            text: "value2"
         }]);
        expect(optionValue5).toEqual({ text: "value1" });
        expect(optionValue6).toEqual("value1");
    });

    it("returns for empty", () => {
        const optionValue = getOptionValue({}, "test");
        const optionValue2 = getOptionValue({ test: [{ text: "value1" }] }, "test[1]");

        expect(optionValue).toEqual(undefined);
        expect(optionValue2).toEqual(undefined);
    });
});
