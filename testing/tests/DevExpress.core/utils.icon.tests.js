import { getImageSourceType, getImageContainer } from "core/utils/icon";

const { module: testModule, test } = QUnit;

const ICON_CLASS = "dx-icon";
const SVG_ICON_CLASS = "dx-svg-icon";

testModule("icon utils", {
    beforeEach: () => {
        this.sourceArray = [{ // 1
            source: "data:image/png;base64,qwertyuiopasdfghjklzxcvbmnQWERTYUIOPLKJHGFDSAZXCVBNM/+0987654321",
            result: "image"
        },
        { // 2
            source: "../folder/123.jgp",
            result: "image"
        },
        { // 3
            source: "localhost/JFLSKDksjdhfolHWThr30oi",
            result: "image"
        },
        { // 4
            source: "glyphicon glyphicon-icon",
            result: "fontIcon"
        },
        { // 5
            source: "glyphicon-icon glyphicon",
            result: "fontIcon"
        },
        { // 6
            source: "fa fa-icon",
            result: "fontIcon"
        },
        { // 7
            source: "fa-lg fa-icon fa",
            result: "fontIcon"
        },
        { // 8
            source: "ion ion-icon",
            result: "fontIcon"
        },
        { // 9
            source: "ionicons ion-icon",
            result: "fontIcon"
        },
        { // 10
            source: "icon_-190",
            result: "dxIcon"
        },
        { // 11
            source: "my my-icon",
            result: "fontIcon"
        },
        { // 12
            source: "<svg></svg>",
            result: "svg"
        },
        { // 13
            source: `<svg>
                <path />
            </svg>`,
            result: "svg"
        },
        { // 14
            source: `<svg>
                <path />
            </svg>
            <html>`,
            result: false
        },
        { // 15
            source: `test
            <svg>
            <path />
            </svg>`,
            result: false
        },
        { // 16
            source: `  <svg>
            <path />
            </svg>`,
            result: "svg"
        },
        { // 17
            source: "http://test.test/image.jpg",
            result: "image"
        },
        { // 18
            source: "image.png",
            result: "image"
        }];
    }
}, () => {
    test("getImageSourceType", (assert) => {
        assert.expect(18);

        this.sourceArray.forEach(({ source, result }) => {
            assert.strictEqual(getImageSourceType(source), result);
        });
    });

    test("getImageContainer", (assert) => {
        this.sourceArray.forEach(({ source, result }) => {
            var $iconElement = getImageContainer(source);
            switch(result) {
                case "dxIcon":
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(`${ICON_CLASS}-${source}`), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, "I", `correct for ${result}`);
                    break;
                case "fontIcon":
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(source), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, "I", `correct for ${result}`);
                    break;
                case "image":
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.notOk($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.strictEqual($iconElement.attr("src"), source, `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, "IMG", `correct for ${result}`);
                    break;
                case "svg":
                    assert.ok($iconElement.hasClass(ICON_CLASS), `correct for ${result}`);
                    assert.ok($iconElement.hasClass(SVG_ICON_CLASS), `correct for ${result}`);
                    assert.strictEqual($iconElement.get(0).tagName, "I", `correct for ${result}`);
                    assert.strictEqual($iconElement.children().get(0).tagName.toUpperCase(), "SVG", `correct for ${result}`);
                    break;
                case false:
                    assert.strictEqual($iconElement, null, "element isn't created");
                    break;
                default:
                    break;
            }
        });
    });
});
