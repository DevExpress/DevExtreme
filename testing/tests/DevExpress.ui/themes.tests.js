/* global ROOT_URL */

var $ = require("jquery"),
    themes = require("ui/themes"),
    viewPortUtils = require("core/utils/view_port"),
    viewPortChanged = viewPortUtils.changeCallback,
    devices = require("core/devices");

require("style-compiler-test-server/known-css-files");

(function() {
    if(document.documentMode < 9) {
        return; // because :not() selectors are not supported
    }

    if(/(iPhone|iPad|iPod|android|Windows Phone 8)/i.test(navigator.userAgent)) {
        return;
    }

    function rulesFromSheet(sheet) {
        try {
            return sheet.rules || sheet.cssRules || [];
        } catch(x) {
            return [];
        }
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
        var parts = selectorText.split(/(?=[#.\s])/g),
            i,
            part;

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
                if(!/^[#.](dx|ql)-/.test(part)) {
                    return false;
                }
            }
        }

        return true;
    }

    function findBadCssSelectors(doc) {
        var badSelectors = [];

        $.each(doc.styleSheets, function() {
            var rules = rulesFromSheet(this);

            $.each(rules, function() {
                if(!this.selectorText) {
                    return;
                }

                var selectors = this.selectorText.split(/\s*,\s*/g);
                $.each(selectors, function() {
                    var selectorText = String(this),
                        simplifiedSelectorText = simplifySelector(selectorText);

                    if(!isGoodSelector(simplifiedSelectorText)) {
                        badSelectors.push(selectorText);
                    }
                });
            });
        });

        return badSelectors;
    }


    QUnit.module("Selector check");

    $.each(window.knownCssFiles, function(i, cssFileName) {
        if(cssFileName === "dx.spa.css") {
            // SPA styles can contain anything
            return;
        }

        var cssUrl = ROOT_URL + "artifacts/css/" + cssFileName;


        QUnit.test(cssFileName, function(assert) {
            var done = assert.async(),
                frame = $("<iframe/>").appendTo("body"),
                frameWindow = frame[0].contentWindow,
                frameDoc = frameWindow.document,
                defaultSheetCount = frameDoc.styleSheets.length;

            frameDoc.write("<link rel=stylesheet href='" + cssUrl + "'>");

            function isCssLoaded() {
                var ourSheet;

                if(frameDoc.styleSheets.length <= defaultSheetCount) {
                    return false;
                }

                ourSheet = $.grep(frameDoc.styleSheets, function(i) { return i.href.indexOf(cssUrl) > -1; })[0];
                return rulesFromSheet(ourSheet).length > 0;
            }

            window.waitFor(isCssLoaded).done(function() {
                assert.deepEqual(findBadCssSelectors(frameDoc), []);
                frame.remove();
                done();
            });

        });
    });

})();


(function() {
    QUnit.module('dx-theme changing');

    QUnit.test("Themes functions return right value after themes switching", function(assert) {
        var genericThemeName = "generic.light",
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
                functionName: "isAndroid5",
                themeName: "android5.light"
            }, {
                functionName: "isIos7",
                themeName: "ios7.default"
            }, {
                functionName: "isWin8",
                themeName: "win8.white"
            }, {
                functionName: "isWin10",
                themeName: "win10.white"
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
            var anotherThemeName = themeData.anotherThemeName || genericThemeName;
            assert.ok(themes[themeData.functionName](themeData.themeName), themeData.functionName + " with " + themeData.themeName + " argument");
            assert.notOk(themes[themeData.functionName](anotherThemeName), themeData.functionName + " with " + anotherThemeName + " argument");
        });
        linksContainer.remove();
    });

    QUnit.test("Themes functions return right value if theme file loaded after ready event (T666366)", function(assert) {
        var linksContainer = $("<div>").addClass("links-container").appendTo("body");
        linksContainer.append("<link rel='dx-theme' href='style2.css' data-theme='material.blue.light' />");

        themes.init({ context: window.document, theme: "material.blue.light" });
        themes.resetTheme();

        linksContainer.append("<style>.dx-theme-marker { font-family: 'dx.generic.light' }</style>");

        assert.equal(themes.isGeneric(), true, "isGeneric returns 'true' if css has been added after themes initialization");

        linksContainer.remove();
    });
})();


(function() {
    var createModuleObject = function() {
        var $frame;

        function setup() {
            $frame = $("<iframe></iframe>").appendTo("body");
        }

        function teardown() {
            $frame.remove();
        }

        function frameDoc() {
            return $frame[0].contentWindow.document;
        }

        function writeToFrame(markup) {
            frameDoc().write(markup);
        }

        function getFrameStyleLinks() {
            return $("link[rel=stylesheet]", frameDoc());
        }

        function removeFrameStyleLinks() {
            getFrameStyleLinks().remove();
        }

        return {
            beforeEach: setup,
            afterEach: teardown,

            frameDoc: frameDoc,
            writeToFrame: writeToFrame,
            getFrameStyleLinks: getFrameStyleLinks,
            removeFrameStyleLinks: removeFrameStyleLinks,
            initViewPort: false
        };
    };

    QUnit.module('dx-theme links', createModuleObject());

    QUnit.test("should not add additional link if no dx-theme found", function(assert) {
        // arrange
        // act
        themes.init({ _autoInit: true, context: this.frameDoc() });
        // assert
        var realStylesheets = this.getFrameStyleLinks();
        assert.equal(realStylesheets.length, 0, "No stylesheets should be added");
    });

    QUnit.test("should throw if non-existing platform requested", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        // act
        assert.throws(function() {
            themes.init({ theme: "missingPlatform", context: this.frameDoc() });
        });
    });

    QUnit.test("theme by platform only", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='myCss' data-theme='myPlatform.theme1' />");
        // act
        themes.init({ theme: "myPlatform", context: this.frameDoc() });
        // assert
        var realStylesheets = this.getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "myCss");
    });

    QUnit.test("theme by platform and color scheme", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        // act
        themes.init({ theme: "myPlatform.theme2", context: this.frameDoc() });
        // assert
        var realStylesheets = this.getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style2.css");
    });

    QUnit.test("change theme by string", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        themes.init({ theme: "myPlatform.theme2", context: this.frameDoc() });
        // act
        themes.current("myPlatform.theme1");
        // assert
        var realStylesheets = this.getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style1.css");
    });

    QUnit.test("change theme by configuration object", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        themes.init({ theme: "myPlatform.theme1", context: this.frameDoc() });
        // act
        themes.current({ theme: "myPlatform.theme2" });
        // assert
        var realStylesheets = this.getFrameStyleLinks();
        assert.equal(realStylesheets.length, 1, "Single dx-theme should be converted to regular stylesheet");
        assert.equal(realStylesheets.attr("href"), "style2.css");
    });

    QUnit.test("method themes.ready calls a callback function after themes loading", function(assert) {
        var done = assert.async();

        var url = ROOT_URL + "testing/helpers/themeMarker.css";
        this.writeToFrame("<link rel=dx-theme data-theme='myPlatform.theme1' href='style1.css' />");
        this.writeToFrame("<link rel=dx-theme data-theme='sampleTheme.sampleColorScheme' href='" + url + "' />");

        themes.init({ theme: "myPlatform.theme1", context: this.frameDoc() });

        themes.ready(function() {
            assert.equal(themes.current(), "sampleTheme.sampleColorScheme");

            done();
        });

        themes.current("sampleTheme.sampleColorScheme");
    });

    QUnit.test("default theme is first if not specified", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' />");
        // act
        themes.init({ theme: "myPlatform", context: this.frameDoc() });
        // assert
        assert.equal(this.getFrameStyleLinks().attr("href"), "style1.css");
    });

    QUnit.test("default theme defined by active attribute if not specified", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' data-active='nonsense' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='myPlatform.theme2' data-active='true' />");
        // act
        themes.init({ theme: "myPlatform", context: this.frameDoc() });
        // assert
        assert.equal(this.getFrameStyleLinks().attr("href"), "style2.css");
    });

    QUnit.test("dx-theme should change compact theme to normal if compact has data-active='true' (T449216)", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style1.compact.css' data-theme='myPlatform.theme1.compact' data-active='true' />");
        // act
        themes.init({ theme: "myPlatform.theme1", context: this.frameDoc() });
        // assert
        assert.equal(themes.current(), "myPlatform.theme1");
    });

    QUnit.test("dx-theme should select active theme if theme name is incomplete (T449216)", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='myPlatform.theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style1.compact.css' data-theme='myPlatform.theme1.compact' data-active='true' />");
        themes.init({ theme: "myPlatform.theme1", context: this.frameDoc() });
        // act
        themes.current({ theme: "myPlatform" });
        // assert
        assert.equal(themes.current(), "myPlatform.theme1.compact");
    });

    QUnit.test("read current theme name", function(assert) {
        // arrange
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='theme1' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='theme2.dark' />");
        // act
        themes.init({ theme: "theme1", context: this.frameDoc() });
        assert.equal(themes.current(), "theme1");
        themes.current("theme2");
        assert.equal(themes.current(), "theme2.dark");
    });

    QUnit.test("loadCallback option for init", function(assert) {
        var done = assert.async();
        var url = ROOT_URL + "testing/helpers/themeMarker.css";
        this.writeToFrame("<link rel=dx-theme data-theme=sampleTheme.sampleColorScheme href='" + url + "' />");

        themes.init({
            context: this.frameDoc(),
            theme: "sampleTheme.sampleColorScheme",
            loadCallback: function() {
                assert.expect(0);
                done();
            }
        });
    });

    QUnit.test("current theme name when theme included as simple stylesheet", function(assert) {
        var done = assert.async();

        var url = ROOT_URL + "testing/helpers/themeMarker.css";
        themes.init({ context: this.frameDoc(), _autoInit: true });
        this.writeToFrame("<link rel=stylesheet href='" + url + "' />");

        assert.expect(0);
        themes.ready(done);
        themes.waitForThemeLoad("sampleTheme.sampleColorScheme");
    });

    QUnit.test("current theme name read once", function(assert) {
        var done = assert.async();
        var url = ROOT_URL + "testing/helpers/themeMarker.css";
        var that = this;
        that.writeToFrame("<link id='testTheme' rel='dx-theme' data-theme='sampleTheme.sampleColorScheme' href='" + url + "' />");

        themes.init({
            context: this.frameDoc(),
            theme: "sampleTheme.sampleColorScheme",
            loadCallback: function() {
                themes.resetTheme();
                $("link", that.frameDoc()).remove();

                setTimeout(function() {
                    /// TODO: debugging block
                    var s = that.frameDoc().styleSheets;
                    assert.equal(s.length, 0, "style rules should be cleared");
                    /// TODO: end

                    that.writeToFrame("<style>.dx-theme-marker{ font-family: 'dx.sampleTheme.sampleColorScheme1';}</style>");

                    var assertPredicate = function() {
                        return themes.current() === "sampleTheme.sampleColorScheme1";
                    };

                    setTimeout(function() {
                        assert.ok(assertPredicate(), "theme name was read from css");

                        /// TODO: debugging block
                        if(!assertPredicate()) {

                            var s = that.frameDoc().styleSheets;
                            assert.equal(s.length, 1, "style rule count should equal to 1");

                            $.each(s, function() {
                                assert.ok(false, this.ownerNode.outerHTML);
                            });

                            var done2 = assert.async();
                            setTimeout(function() {
                                assert.ok(assertPredicate(), "theme name was read from css");
                                done2();

                                var done3 = assert.async();
                                setTimeout(function() {
                                    assert.equal(themes.current(), "sampleTheme.sampleColorScheme1");
                                    done3();
                                }, 15000);
                            }, 15000);
                        }
                        /// TODO: end


                        that.writeToFrame("<style>.dx-theme-marker{ font-family: 'dx.sampleTheme.sampleColorScheme2';}</style>");
                        setTimeout(function() {
                            assert.ok(assertPredicate(), "theme name was updated only once");
                            done();
                        });
                    });
                });
            }
        });
    });

    QUnit.test("current theme name is null if without any links", function(assert) {
        themes.init({ context: this.frameDoc(), _autoInit: true });
        assert.strictEqual(themes.current(), null);
    });

    QUnit.test("move classes from previous viewport to new viewport", function(assert) {
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='mytheme' />");
        themes.init({ context: this.frameDoc(), theme: "mytheme" });

        var $element = $("<div>");
        themes.attachCssClasses($element);

        var $newElement = $("<div>");

        viewPortChanged.fire($newElement, $element);

        assert.equal($element.hasClass("dx-theme-mytheme"), false, "theme class removed");
        assert.ok($newElement.hasClass("dx-theme-mytheme"), "theme class added");
    });

    QUnit.test("attachCssClasses removes classes for old theme", function(assert) {
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='oldtheme' />");
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='newtheme' />");
        themes.init({ context: this.frameDoc(), theme: "oldtheme" });

        var $element = $(".dx-theme-oldtheme");

        themes.current("newtheme");

        assert.equal($element.hasClass("dx-theme-oldtheme"), false, "old theme class deleted");
        assert.equal($element.hasClass("dx-theme-oldtheme-typography"), false, "old typography class deleted");
    });


    QUnit.test("dx-color-scheme class for different themes", function(assert) {
        this.writeToFrame("<link rel='dx-theme' href='style1.css' data-theme='generic.light' />");
        this.writeToFrame("<link rel='dx-theme' href='style2.css' data-theme='generic.light.compact' />");
        this.writeToFrame("<link rel='dx-theme' href='style3.css' data-theme='material.blue.light' />");
        this.writeToFrame("<body class='dx-viewport'></body>");

        themes.init({ context: this.frameDoc(), theme: "generic.light" });

        viewPortUtils.value($(".dx-viewport", this.frameDoc()));
        assert.ok($(".dx-theme-generic", this.frameDoc()).hasClass("dx-color-scheme-light"), "right dx-color-scheme class for generic");

        themes.current("generic.light.compact");
        assert.ok($(".dx-theme-generic", this.frameDoc()).hasClass("dx-color-scheme-light"), "right dx-color-scheme class for generic.compact");

        themes.current("material.blue.light");
        assert.ok($(".dx-theme-material", this.frameDoc()).hasClass("dx-color-scheme-blue-light"), "right dx-color-scheme class for material");
    });
})();


(function() {

    var DX_HAIRLINES_CLASS = "dx-hairlines";

    QUnit.module("misc");

    QUnit.test("attachCssClasses", function(assert) {
        var attachCssClasses = themes.attachCssClasses,
            element,
            expectedClasses = ["dx-theme-abc", "dx-theme-abc-typography"];

        var pixelRatio = window.devicePixelRatio;
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

    QUnit.test("detachCssClasses", function(assert) {
        var element = document.createElement("DIV");
        themes.attachCssClasses(element, "abc");

        themes.detachCssClasses(element);

        assert.equal(element.className, "", "attached classes was removed");
    });

    QUnit.test("themeNameFromDevice for iOS", function(assert) {
        var themeNameFromDevice = themes.themeNameFromDevice;

        assert.equal("ios7", themeNameFromDevice({ platform: "ios", version: [1] }));
        assert.equal("ios7", themeNameFromDevice({ platform: "ios", version: [99] }));
        assert.equal("ios7", themeNameFromDevice({ platform: "ios" }));
    });

    QUnit.test("themeNameFromDevice for Android", function(assert) {
        var themeNameFromDevice = themes.themeNameFromDevice;

        assert.equal("android5", themeNameFromDevice({ platform: "android", version: [1] }));
        assert.equal("android5", themeNameFromDevice({ platform: "android", version: [4, 4] }));
        assert.equal("android5", themeNameFromDevice({ platform: "android", version: [99] }));
        assert.equal("android5", themeNameFromDevice({ platform: "android" }));
    });

    QUnit.test("themeNameFromDevice for Windows Phone", function(assert) {
        var themeNameFromDevice = themes.themeNameFromDevice;
        var origIsSimulator = devices.isSimulator;
        var origIsForced = devices.isForced;

        try {
            assert.equal("win10", themeNameFromDevice({ platform: "win", version: [1] }));
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8] }));
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8, 1] }));
            assert.equal("win10", themeNameFromDevice({ platform: "win", version: [99] }));
            assert.equal("win10", themeNameFromDevice({ platform: "win" }));

            devices.isForced = function() { return true; };
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8] }));
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8, 1] }));
            assert.equal("win10", themeNameFromDevice({ platform: "win", version: [99] }));

            devices.isSimulator = function() { return true; };
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8] }));
            assert.equal("win8", themeNameFromDevice({ platform: "win", version: [8, 1] }));
            assert.equal("win10", themeNameFromDevice({ platform: "win", version: [99] }));
        } finally {
            devices.isForced = origIsForced;
            devices.isSimulator = origIsSimulator;
        }
    });

})();
