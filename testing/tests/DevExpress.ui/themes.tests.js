/* global ROOT_URL */

import $ from "jquery";
import themes from "ui/themes";
import viewPortUtils from "core/utils/view_port";

const viewPortChanged = viewPortUtils.changeCallback;
import knownCssFiles from "/themes-test/get-css-files-list/!json";

const { test, testInActiveWindow } = QUnit;

function rulesFromSheet(sheet) {
    try {
        return sheet.rules || sheet.cssRules || [];
    } catch(x) {
        return [];
    }
}

function loadCss(frame, cssFileName) {
    const frameWindow = frame[0].contentWindow;
    const frameDoc = frameWindow.document;
    const defaultSheetCount = frameDoc.styleSheets.length;
    const cssUrl = ROOT_URL + "artifacts/css/" + cssFileName;

    frameDoc.write("<link rel=stylesheet href='" + cssUrl + "'>");

    return () => {
        let ourSheet;

        if(frameDoc.styleSheets.length <= defaultSheetCount) {
            return false;
        }

        ourSheet = $.grep(frameDoc.styleSheets, function(i) { return i.href.indexOf(cssUrl) > -1; })[0];
        return rulesFromSheet(ourSheet).length > 0;
    };
}

QUnit.module("Selector check", () => {
    if(document.documentMode < 9) {
        return; // because :not() selectors are not supported
    }

    if(/(iPhone|iPad|iPod|android|Windows Phone 8)/i.test(navigator.userAgent)) {
        return;
    }

    function simplifySelector(selectorText) {
        // strip attribute selectors
        selectorText = selectorText.replace(/\[.*?\]/gi, "");

        // strip :not(), :nth-child(n), ::after, etc
        selectorText = selectorText.replace(/::?[\w-]+(\(.*?\))?/gi, "");

        // strip tag names when qualified by class/id
        selectorText = selectorText.replace(/(^|[^\w.#-])[a-z]+([.#][\w-]+)/gi, "$1$2");

        // strip precedence/descendance qualifiers
        selectorText = selectorText.replace(/[+~>]/g, "");

        // normalize whitespace
        selectorText = $.trim(selectorText).replace(/\s+/g, " ");

        return selectorText;
    }

    function isGoodSelector(selectorText) {
        const parts = selectorText.split(/(?=[#.\s])/g);
        let i;
        let part;

        function isTag(text) {
            return text === "*" || /^\w+$/.test(text);
        }

        for(i = 0; i < parts.length; i++) {
            part = $.trim(parts[i]);

            if(part === "") {
                continue;
            }

            if(isTag(part)) {
                if(i === 0) {
                    return false;
                }
            } else {
                if(!/^[#.](dx|ql|dxdi)-/.test(part)) {
                    return false;
                }
            }
        }

        return true;
    }

    function findBadCssSelectors(doc) {
        const badSelectors = [];

        $.each(doc.styleSheets, function() {
            const rules = rulesFromSheet(this);

            $.each(rules, function() {
                if(!this.selectorText) {
                    return;
                }

                const selectors = this.selectorText.split(/\s*,\s*/g);
                $.each(selectors, function() {
                    const selectorText = String(this),
                        simplifiedSelectorText = simplifySelector(selectorText);

                    if(!isGoodSelector(simplifiedSelectorText)) {
                        badSelectors.push(selectorText);
                    }
                });
            });
        });

        return badSelectors;
    }

    $.each(knownCssFiles, function(i, cssFileName) {
        test(cssFileName, function(assert) {
            const done = assert.async();
            const frame = $("<iframe/>").appendTo("body");

            window.waitFor(loadCss(frame, cssFileName)).done(function() {
                assert.deepEqual(findBadCssSelectors(frame[0].contentWindow.document), [], "Css rule has incorrect selectors");
                frame.remove();
                done();
            });

        });
    });

});

QUnit.module("All images are defined with data-uri and will be inlined", () => {
    $.each(knownCssFiles, function(i, cssFileName) {

        function hasUrlImageProperty(doc) {
            const rulesWithUrl = [];
            $.each(doc.styleSheets, function() {
                const rules = rulesFromSheet(this);

                $.each(rules, function() {
                    if(!this.cssText) {
                        return;
                    }
                    if(/url\((?!"data:image)/.test(this.cssText) &&
                       /url\((?!"?icons)/.test(this.cssText) &&
                       /url\((?!"?fonts)/.test(this.cssText) &&
                       /url\((?!"?https:\/\/fonts.googleapis.com)/.test(this.cssText)) {
                        rulesWithUrl.push(this.cssText);
                    }
                });
            });
            return rulesWithUrl;
        }

        test(cssFileName, function(assert) {
            const done = assert.async();
            const frame = $("<iframe/>").appendTo("body");

            window.waitFor(loadCss(frame, cssFileName)).done(function() {
                assert.deepEqual(hasUrlImageProperty(frame[0].contentWindow.document), [], "Css rule has non-encoded url, change url() to data-uri() in the less file");
                frame.remove();
                done();
            });

        });
    });
});

QUnit.module("dx-theme changing", () => {
    test("Themes functions return right value after themes switching", function(assert) {
        const genericThemeName = "generic.light",
            materialThemeName = "material.blue.light",
            linksContainer = $("<div>").addClass("links-container").appendTo("body"),
            testThemes = [{
                functionName: "isGeneric",
                themeName: genericThemeName,
                anotherThemeName: materialThemeName
            }, {
                functionName: "isMaterial",
                themeName: materialThemeName
            }, {
                functionName: "isIos7",
                themeName: "ios7.default"
            }];

        linksContainer.append("<link rel='dx-theme' href='style2.css' data-theme='" + materialThemeName + "' />");
        linksContainer.append("<link rel='dx-theme' href='style1.css' data-theme='" + genericThemeName + "' />");

        themes.init({ context: window.document, theme: materialThemeName });
        assert.ok(themes.isMaterial(), "isMaterial is true after material theme init");
        assert.notOk(themes.isGeneric(), "isGeneric is false after material theme init");

        themes.current(genericThemeName);
        assert.ok(themes.isGeneric(), "isGeneric after activate generic theme");
        assert.notOk(themes.isMaterial(), "isMaterial is false after generic theme init");
        assert.notOk(themes.isIos7(), "isIos7 is false after generic theme init");
        themes.resetTheme();
        assert.notOk(themes.isGeneric(), "isGeneric is false after reset");

        $.each(testThemes, function(_, themeData) {
            const anotherThemeName = themeData.anotherThemeName || genericThemeName;
            assert.ok(themes[themeData.functionName](themeData.themeName), themeData.functionName + " with " + themeData.themeName + " argument");
            assert.notOk(themes[themeData.functionName](anotherThemeName), themeData.functionName + " with " + anotherThemeName + " argument");
        });
        linksContainer.remove();
    });

    test("Themes functions return right value if theme file loaded after ready event (T666366)", function(assert) {
        const linksContainer = $("<div>").addClass("links-container").appendTo("body");
        linksContainer.append("<link rel='dx-theme' href='style2.css' data-theme='material.blue.light' />");

        themes.init({ context: window.document, theme: "material.blue.light" });
        themes.resetTheme();

        linksContainer.append("<style>.dx-theme-marker { font-family: 'dx.generic.light' }</style>");

        assert.equal(themes.isGeneric(), true, "isGeneric returns 'true' if css has been added after themes initialization");

        linksContainer.remove();
    });
});

QUnit.module("dx-theme links", (hooks) => {
    let $frame;
    hooks.beforeEach(() => {
        $frame = $("<iframe></iframe>").appendTo("body");
    });

    hooks.afterEach(() => {
        $frame.remove();
    });

    function frameDoc() {
        return $frame[0].contentWindow.document;
    }

    function writeToFrame(markup) {
        frameDoc().write(markup);
    }

    function getFrameStyleLinks() {
        return $("link[rel=stylesheet]", frameDoc());
    }

    test("should not add additional link if no dx-theme found", function(assert) {
        // arrange
        // act
        themes.init({ _autoInit: true, context: frameDoc() });
        // assert
        const realStylesheets = getFrameStyleLinks();
        assert.equal(realStylesheets.length, 0, "No stylesheets should be added");
    });

    test("should throw if non-existing platform requested", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        // act
        assert.throws(function() {
            themes.init({ theme: "missingPlatform", context: frameDoc() });
        });
    });

    test("theme by platform only", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='myCss' data-theme='myPlatform.theme1' />");
        // act
        themes.init({ theme: "myPlatform", context: frameDoc() });
        // assert
        const realStylesheets = getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "myCss");
    });

    test("theme by platform and color scheme", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        // act
        themes.init({ theme: "myPlatform.theme2", context: frameDoc() });
        // assert
        const realStylesheets = getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style2.css");
    });

    test("change theme by string", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        themes.init({ theme: "myPlatform.theme2", context: frameDoc() });
        // act
        themes.current("myPlatform.theme1");
        // assert
        const realStylesheets = getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style1.css");
    });

    test("change theme by configuration object", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        themes.init({ theme: "myPlatform.theme1", context: frameDoc() });
        // act
        themes.current({ theme: "myPlatform.theme2" });
        // assert
        const realStylesheets = getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style2.css");
    });

    test("method themes.ready calls a callback function after themes loading", function(assert) {
        const done = assert.async();

        const url = ROOT_URL + "testing/helpers/themeMarker.css";
        writeToFrame("<link rel=dx-theme data-theme='myPlatform.theme1' href='style1.css' />");
        writeToFrame("<link rel=dx-theme data-theme='sampleTheme.sampleColorScheme' href='" + url + "' />");

        themes.init({ theme: "myPlatform.theme1", context: frameDoc() });

        themes.ready(function() {
            assert.equal(themes.current(), "sampleTheme.sampleColorScheme");

            done();
        });

        themes.current("sampleTheme.sampleColorScheme");
    });

    test("default theme is first if not specified", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        // act
        themes.init({ theme: "myPlatform", context: frameDoc() });
        // assert
        assert.equal(getFrameStyleLinks().attr("href"), "style1.css");
    });

    test("default theme defined by active attribute if not specified", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' data-active='nonsense' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' data-active='true' />");
        // act
        themes.init({ theme: "myPlatform", context: frameDoc() });
        // assert
        assert.equal(getFrameStyleLinks().attr("href"), "style2.css");
    });

    test("dx-theme should change compact theme to normal if compact has data-active='true' (T449216)", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style1.compact.css' data-theme='myPlatform.theme1.compact' data-active='true' />");
        // act
        themes.init({ theme: "myPlatform.theme1", context: frameDoc() });
        // assert
        assert.equal(themes.current(), "myPlatform.theme1");
    });

    test("dx-theme should select active theme if theme name is incomplete (T449216)", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        writeToFrame("<link rel='dx-theme' href='style1.compact.css' data-theme='myPlatform.theme1.compact' data-active='true' />");
        themes.init({ theme: "myPlatform.theme1", context: frameDoc() });
        // act
        themes.current({ theme: "myPlatform" });
        // assert
        assert.equal(themes.current(), "myPlatform.theme1.compact");
    });

    test("read current theme name", function(assert) {
        // arrange
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='theme1' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='theme2.dark' />");
        // act
        themes.init({ theme: "theme1", context: frameDoc() });
        assert.equal(themes.current(), "theme1");
        themes.current("theme2");
        assert.equal(themes.current(), "theme2.dark");
    });

    test("loadCallback option for init", function(assert) {
        const done = assert.async();
        const url = ROOT_URL + "testing/helpers/themeMarker.css";
        writeToFrame("<link rel=dx-theme data-theme=sampleTheme.sampleColorScheme href='" + url + "' />");

        themes.init({
            context: frameDoc(),
            theme: "sampleTheme.sampleColorScheme",
            loadCallback: function() {
                assert.expect(0);
                done();
            }
        });
    });

    test("current theme name when theme included as simple stylesheet", function(assert) {
        const done = assert.async();

        const url = ROOT_URL + "testing/helpers/themeMarker.css";
        themes.init({ context: frameDoc(), _autoInit: true });
        writeToFrame("<link rel=stylesheet href='" + url + "' />");

        assert.expect(0);
        themes.ready(done);
        themes.waitForThemeLoad("sampleTheme.sampleColorScheme");
    });

    test("current theme name read once", function(assert) {
        const done = assert.async();
        const url = ROOT_URL + "testing/helpers/themeMarker.css";
        writeToFrame("<link id='testTheme' rel='dx-theme' data-theme='sampleTheme.sampleColorScheme' href='" + url + "' />");

        themes.init({
            context: frameDoc(),
            theme: "sampleTheme.sampleColorScheme",
            loadCallback: function() {
                themes.resetTheme();
                $("link", frameDoc()).remove();

                setTimeout(function() {
                    /// TODO: debugging block
                    const s = frameDoc().styleSheets;
                    assert.equal(s.length, 0, "style rules should be cleared");
                    /// TODO: end

                    writeToFrame("<style>.dx-theme-marker{ font-family: 'dx.sampleTheme.sampleColorScheme1';}</style>");

                    const assertPredicate = function() {
                        return themes.current() === "sampleTheme.sampleColorScheme1";
                    };

                    setTimeout(function() {
                        assert.ok(assertPredicate(), "theme name was read from css");

                        /// TODO: debugging block
                        if(!assertPredicate()) {

                            const s = frameDoc().styleSheets;
                            assert.equal(s.length, 1, "style rule count should equal to 1");

                            $.each(s, function() {
                                assert.ok(false, this.ownerNode.outerHTML);
                            });

                            const done2 = assert.async();
                            setTimeout(function() {
                                assert.ok(assertPredicate(), "theme name was read from css");
                                done2();

                                const done3 = assert.async();
                                setTimeout(function() {
                                    assert.equal(themes.current(), "sampleTheme.sampleColorScheme1");
                                    done3();
                                }, 15000);
                            }, 15000);
                        }
                        /// TODO: end


                        writeToFrame("<style>.dx-theme-marker{ font-family: 'dx.sampleTheme.sampleColorScheme2';}</style>");
                        setTimeout(function() {
                            assert.ok(assertPredicate(), "theme name was updated only once");
                            done();
                        });
                    });
                });
            }
        });
    });

    test("current theme name is null if without any links", function(assert) {
        themes.init({ context: frameDoc(), _autoInit: true });
        assert.strictEqual(themes.current(), null);
    });

    test("move classes from previous viewport to new viewport", function(assert) {
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='mytheme' />");
        themes.init({ context: frameDoc(), theme: "mytheme" });

        const $element = $("<div>");
        themes.attachCssClasses($element);

        const $newElement = $("<div>");

        viewPortChanged.fire($newElement, $element);

        assert.equal($element.hasClass("dx-theme-mytheme"), false, "theme class removed");
        assert.ok($newElement.hasClass("dx-theme-mytheme"), "theme class added");
    });

    test("attachCssClasses removes classes for old theme", function(assert) {
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='oldtheme' />");
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='newtheme' />");
        themes.init({ context: frameDoc(), theme: "oldtheme" });

        const $element = $(".dx-theme-oldtheme");

        themes.current("newtheme");

        assert.equal($element.hasClass("dx-theme-oldtheme"), false, "old theme class deleted");
        assert.equal($element.hasClass("dx-theme-oldtheme-typography"), false, "old typography class deleted");
    });


    test("dx-color-scheme class for different themes", function(assert) {
        writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='generic.light' />");
        writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='generic.light.compact' />");
        writeToFrame("<link rel='dx-theme' href='style3.css' data-theme='material.blue.light' />");
        writeToFrame("<body class='dx-viewport'></body>");

        themes.init({ context: frameDoc(), theme: "generic.light" });

        viewPortUtils.value($(".dx-viewport", frameDoc()));
        assert.ok($(".dx-theme-generic", frameDoc()).hasClass("dx-color-scheme-light"), "right dx-color-scheme class for generic");

        themes.current("generic.light.compact");
        assert.ok($(".dx-theme-generic", frameDoc()).hasClass("dx-color-scheme-light"), "right dx-color-scheme class for generic.compact");

        themes.current("material.blue.light");
        assert.ok($(".dx-theme-material", frameDoc()).hasClass("dx-color-scheme-blue-light"), "right dx-color-scheme class for material");
    });
});

QUnit.module("misc", () => {
    const DX_HAIRLINES_CLASS = "dx-hairlines";

    test("attachCssClasses", function(assert) {
        const attachCssClasses = themes.attachCssClasses;
        let element;
        let expectedClasses = ["dx-theme-abc", "dx-theme-abc-typography"];

        const pixelRatio = window.devicePixelRatio;
        if(!!pixelRatio && pixelRatio >= 2) {
            expectedClasses.unshift(DX_HAIRLINES_CLASS);
        }

        element = document.createElement("DIV");
        attachCssClasses(element, "abc");
        assert.deepEqual(element.className.split(/ /g).sort(), expectedClasses);

        element = document.createElement("DIV");
        expectedClasses.unshift("dx-color-scheme-xyz");
        attachCssClasses(element, "abc.xyz");
        assert.deepEqual(element.className.split(/ /g).sort(), expectedClasses);
    });

    test("detachCssClasses", function(assert) {
        const element = document.createElement("DIV");
        themes.attachCssClasses(element, "abc");

        themes.detachCssClasses(element);

        assert.equal(element.className, "", "attached classes was removed");
    });

});

QUnit.module("web font checker", () => {
    test("isWebFontLoaded: font loaded", function(assert) {
        assert.notOk(themes.isWebFontLoaded("test text", 400));

        if(!document.fonts) {
            assert.expect(1);
            return;
        }

        const done = assert.async();
        const font = new FontFace("RobotoFallback", "url(../../artifacts/css/fonts/Roboto-400.woff2)", { weight: 400, unicodeRange: "U+26" });

        document.fonts.add(font);
        font.load();
        font.loaded.then(() => {
            assert.notOk(themes.isWebFontLoaded("test text", 400), "characters in wrong unicode range (not loaded)");
            assert.ok(themes.isWebFontLoaded("&", 400), "amp char (U+26) loaded");
            document.fonts.clear();
            done();
        });

    });

    test("isWebFontLoaded does not create additional nodes", function(assert) {
        const elementsCount = document.getElementsByTagName("*").length;
        themes.isWebFontLoaded("test text", 400);
        const afterElementsCount = document.getElementsByTagName("*").length;
        const diff = afterElementsCount - elementsCount;
        assert.equal(diff, 0, "Element's count are the same after method call");
    });

    testInActiveWindow("waitWebFont: function resolve by timeout if the font is not loaded", function(assert) {
        const done = assert.async();
        themes.waitWebFont("test text", 400).then((success) => {
            assert.ok(true, "The font was not loaded, but waiting successfully resolved");
            done();
        });
    });

    test("waitWebFont: function resolved when the font is loaded", function(assert) {
        if(!document.fonts) {
            assert.expect(0);
            return;
        }

        const done = assert.async();
        const font = new FontFace("RobotoFallback", "url(../../artifacts/css/fonts/Roboto-400.woff2)", { weight: 400 });
        document.fonts.add(font);

        document.fonts.ready.then(() => {
            themes.waitWebFont("test text", 400).then((success) => {
                assert.ok(true, "The font was loaded, waiting successfully resolved");
                document.fonts.clear();
                done();
            }, (fail) => {
                assert.ok(false, "The font was loaded, but waiting was rejected");
                document.fonts.clear();
                done();
            });
        });
    });
});

