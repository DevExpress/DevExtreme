const assert = require("chai").assert;
const getBundleName = require("../modules/bundle-resolver");

describe("Bundle resolver", () => {
    it("getBundleName - the right filename is generate", () => {

        const fileNamesForThemes = [
            { theme: "generic", colorScheme: "light", fileName: "bundles/generic/dx.light.less" },
            { theme: "generic", colorScheme: "dark", fileName: "bundles/generic/dx.dark.less" },
            { theme: "generic", colorScheme: "greenmist", fileName: "bundles/generic/dx.greenmist.less" },
            { theme: "generic", colorScheme: "light-compact", fileName: "bundles/generic/dx.light.compact.less" },
            { theme: "material", colorScheme: "blue-light", fileName: "bundles/material/dx.material.blue.light.less" },
            { theme: "material", colorScheme: "blue-light-compact", fileName: "bundles/material/dx.material.blue.light.compact.less" },
            { theme: "ios7", colorScheme: "default", fileName: "bundles/ios7/dx.ios7.default.less" }
        ];

        fileNamesForThemes.forEach((themeData) => {
            assert.equal(getBundleName(themeData.theme, themeData.colorScheme), themeData.fileName);
        });
    });
});
