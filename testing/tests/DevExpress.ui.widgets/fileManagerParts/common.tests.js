const { test } = QUnit;
import { getPathParts, getEscapedFileName } from "ui/file_manager/ui.file_manager.utils";

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.restore();
    }

};

QUnit.module("Commands", moduleConfig, () => {
    test("getPathParts() function must correctly separate path string", function(assert) {
        const testData = {
            "Files/Documents": ["Files", "Documents"],
            "Files/Documents/ ": ["Files", "Documents", " "],
            "Files/ /Documents": ["Files", " ", "Documents"],
            "Files/// /Documents": ["Files/", " ", "Documents"],
            "Files///Documents": ["Files/", "Documents"],
            "": [],
            "/": [],
            "//": ["/"],
            "///": ["/"],
            "////": ["//"],
            "/////": ["//"],
            "/// /Documents": ["/", " ", "Documents"],
            "Test/": ["Test"],
            "Test//": ["Test/"],
            "/Test": ["Test"],
            "//Test": ["/Test"]
        };
        for(const key in testData) {
            assert.deepEqual(getPathParts(key), testData[key]);
        }
    });

    test("getEscapedFileName() function must correctly escape slashes in name string", function(assert) {
        const testData = {
            "": "",
            "/": "//",
            "//": "////",
            "///": "//////",
            "Docu/ments": "Docu//ments",
            "Documents": "Documents",
            "Test/": "Test//",
            "Test//": "Test////",
            "/Test": "//Test",
            "//Test": "////Test"
        };
        for(const key in testData) {
            assert.strictEqual(getEscapedFileName(key), testData[key]);
        }
    });

});
