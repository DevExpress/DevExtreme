import { allKeysAreEqual, getOptionInfo, getOptionValue, isEqual, toComparable } from "../helpers";

describe("toComparable", () => {

    it("Primitive", () => {
        expect(toComparable(1)).toBe(1);
    });

    it("Object", () => {
        const testObject = { text: 1 };
        expect(toComparable(testObject)).toBe(testObject);
    });

    it("Date", () => {
        const testDate = new Date(2018, 9, 9);
        expect(toComparable(testDate)).toBe(testDate.getTime());
    });
});

describe("isEqual", () => {

    it("Primitive", () => {
        expect(isEqual(1, 1)).toBe(true);
    });

    it("Empty Array", () => {
        const testArray1 = [];
        const testArray2 = [];
        expect(isEqual(testArray1, testArray2)).toBe(true);
    });

    it("Empty Array and null", () => {
        const testArray1 = [];
        const testArray2 = null;
        expect(isEqual(testArray1, testArray2)).toBe(false);
        expect(isEqual(testArray2, testArray1)).toBe(false);
    });

    it("Date", () => {
        const testDate1 = new Date(2018, 9, 9);
        const testDate2 = new Date(2018, 9, 9);
        expect(isEqual(testDate1, testDate2)).toBe(true);
    });
});

describe("allKeysAreEqual", () => {
    [
        [{}, {}],
        [{a: 1}, {a: 2}],
        [{a: 1, b: 2}, {a: 1, b: 2}],
        [{}, Object.create({}, {a: { value: 1}})],
        [Object.create({}, {a: { value: 1}}), {}],
        [Object.create({}, {a: { value: 1}}), Object.create({}, {b: { value: 1}})]
    ].map((input) => {
        it("returns true", () => {
            expect(allKeysAreEqual(input[0], input[1])).toBe(true);
        });
    });

    [
        [{}, {a: 1}],
        [{a: 1}, {}],
        [{a: 1, b: 2}, {a: 1, c: 3}],
        [{a: 1}, Object.create({}, {a: { value: 1}})],
        [Object.create({}, {a: { value: 1}}), {a: 1}]
    ].map((input) => {
        it("returns false", () => {
            expect(allKeysAreEqual(input[0], input[1])).toBe(false);
        });
    });
});

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

describe("getOptionInfo", () => {
    it("returns for simple option", () => {
        const optionInfo = getOptionInfo("test");

        expect(optionInfo.isCollection).toBe(false);
        expect(optionInfo.name).toEqual("test");
        expect(optionInfo.fullName).toEqual("test");
    });

    it("returns for collection option", () => {
        const optionInfo = getOptionInfo("test[4]");

        expect(optionInfo.isCollection).toBe(true);
        expect(optionInfo.name).toEqual("test");
        expect(optionInfo.fullName).toEqual("test[4]");

        if (optionInfo.isCollection) {
            expect(optionInfo.index).toEqual(4);
        }
    });
});
