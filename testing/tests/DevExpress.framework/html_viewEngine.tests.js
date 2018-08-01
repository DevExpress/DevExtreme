var $ = require("jquery"),
    ViewEngine = require("framework/html/view_engine").ViewEngine,
    MemoryKeyValueStorage = require("framework/state_manager").MemoryKeyValueStorage,
    domUtils = require("core/utils/dom"),
    Component = require("core/component"),
    ajaxMock = require("../../helpers/ajaxMock.js");

QUnit.testStart(function() {
    var markup = require("./frameworkParts/html_viewEngine.markup.html!text");

    $("#qunit-fixture").append(markup);
});

var ViewEngineTester = ViewEngine.inherit({
    ctor: function(options) {
        options = options || {};
        options.device = options.device || {};
        this.callBase(options);
        if(!options.disableInit) {
            this.init();
        }
    },
    _createComponents: function($elements) {
        domUtils.createComponents($elements);
    },
    _testRenderView: function(viewInfo, $renderTarget) {
        viewInfo.$viewTemplate = viewInfo.$viewTemplate || this.getViewTemplate(viewInfo.viewName, viewInfo.model);
        var viewComponent = this.getViewTemplateInfo(viewInfo.viewName);
        var $layout = this.getLayoutTemplate(viewComponent.option("layout"));
        $layout = this.applyLayout(viewInfo.$viewTemplate, $layout);
        ($renderTarget || $("body")).append($layout);
        return $layout;
    }
});


QUnit.module("ViewEngine load external templates", {
    beforeEach: function() {
        ajaxMock.setup({
            url: "../../helpers/TestViewTemplates.html",
            responseText: "<div data-options=\"dxView: { name: 'index-link' }\">index</div>" +
                            "<div data-options=\"dxView: { name: 'about-link' }\">about</div>" +
                            "<script type=\"text/html\" id=\"ext-tmpl\"><div class=\"ext-tmpl\"></div><" + "/script>"
        });
    },
    afterEach: function() {
        $("head").children("[rel='dx-template']").remove();
        ajaxMock.clear();
    }
});

QUnit.test("Find templates by links", function(assert) {
    var done = assert.async();

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="../../helpers/TestViewTemplates.html"/>');
    var engine = new ViewEngineTester({
        $root: $("<div></div>"),
        disableInit: true
    });

    engine._loadExternalTemplates().done(function() {
        engine._processTemplates();
        var $template1 = engine.getViewTemplate("index-link");
        assert.equal($template1.text(), "index");
        var $template2 = engine.getViewTemplate("about-link");
        assert.equal($template2.text(), "about");
        done();
    });
});

QUnit.test("Find templates by links (nonexistent template)", function(assert) {
    var done = assert.async(),
        url = "../../helpers/nonexistent.html";

    ajaxMock.setup({
        url: url,
        status: 404
    });

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="' + url + '"/>');
    var engine = new ViewEngineTester({
        $root: $("<div></div>"),
        disableInit: true
    });

    engine.init()
        .fail(function(error) {
            assert.ok(error instanceof Error);
            assert.ok(error.toString().indexOf(url) > -1);
        })
        .always(function() {
            done();
        });
});

QUnit.test("Find templates by links (right options for jquery.ajax)", function(assert) {
    var done = assert.async(),
        url = "../../helpers/someview.html";

    ajaxMock.setup({
        url: url,
        status: 200,
        callback: function(request) {
            assert.equal(request.dataType, "html");
            assert.equal(request.contentType, undefined);
            done();
        }
    });

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="' + url + '"/>');
    var engine = new ViewEngineTester({
        $root: $("<div></div>"),
        disableInit: true
    });

    engine.init();
});

QUnit.test("Load a dynamic view from url", function(assert) {
    var done = assert.async();

    var engine = new ViewEngineTester({
        $root: $("<div></div>"),
        disableInit: true
    });

    engine.loadTemplates("../../helpers/TestViewTemplates.html").done(function() {
        var $template = engine.getViewTemplate("index-link");
        assert.equal($template.text(), "index");
        var $template2 = engine.getViewTemplate("about-link");
        assert.equal($template2.text(), "about");
        done();
    });

});

QUnit.test("External widgets templates work", function(assert) {
    var done = assert.async();

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="../../helpers/TestViewTemplates.html"/>');
    var engine = new ViewEngineTester({
        $root: $("<div></div>"),
        disableInit: true
    });

    engine.init().done(function() {
        assert.equal(engine.$root.find("#ext-tmpl").length, 1);
        done();
    });
});

QUnit.test("External widgets templates work with cache (T298344)", function(assert) {
    var done = assert.async(),
        storage = new MemoryKeyValueStorage(),
        engine;

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="../../helpers/TestViewTemplates.html"/>');

    // init cache
    engine = new ViewEngineTester({
        $root: $("#child-component-creation").clone(),
        templateCacheStorage: storage,
        templatesVersion: "1",
        disableInit: true
    });

    engine.init().done(function() {

        assert.equal(engine.$root.find("#ext-tmpl").length, 1);

        // get from cache
        engine = new ViewEngineTester({
            $root: $("#child-component-creation").clone(),
            templateCacheStorage: storage,
            templatesVersion: "1",
            disableInit: true
        });

        engine.init().done(function() {
            assert.equal(engine.$root.find("#ext-tmpl").length, 1);
            done();
        });
    });

});

QUnit.test("Garbage dynamic markup is not put in cache (T303333)", function(assert) {
    var done = assert.async(),
        storage = new MemoryKeyValueStorage(),
        $root,
        engine;

    $("head").append('<li' + 'nk rel="dx-template" type="text/html" href="../../helpers/TestViewTemplates.html"/>');

    // init cache
    $root = $("#child-component-creation").clone();
    $root.append("<div class='garbage-markup'></div>");
    engine = new ViewEngineTester({
        $root: $root,
        templateCacheStorage: storage,
        templatesVersion: "1",
        disableInit: true
    });

    engine.init().done(function() {

        assert.equal($root.find(".garbage-markup").length, 1);

        // get from cache
        $root = $("#child-component-creation").clone();
        engine = new ViewEngineTester({
            $root: $root,
            templateCacheStorage: storage,
            templatesVersion: "1",
            disableInit: true
        });

        engine.init().done(function() {
            assert.equal($root.find(".garbage-markup").length, 0);
            done();
        });
    });

});


QUnit.module("ViewEngine");

QUnit.test("Detach templates and remove unnecessary markup (performance)", function(assert) {
    var $root = $("#find-test");

    assert.ok($root.find(".layout-index-ios").length);
    assert.ok($root.find(".view-index-ios").length);
    assert.ok($root.find(".view-index-android").length);
    assert.ok($root.find(".view-about-ios").length);
    assert.ok($root.find(".view-about").length);
    assert.ok($root.find(".widget-template").length);

    var engine = new ViewEngineTester({
        $root: $root,
        device: {
            platform: "android"
        }
    });

    assert.ok(!$root.find(".layout-index-ios").length, "element was removed from the DOM");
    assert.ok(!$root.find(".view-index-ios").length, "element was removed from the DOM");
    assert.ok(!$root.find(".view-about-ios").length, "element was removed from the DOM");

    assert.ok(!$root.find(".view-index-android").length, "element was detached from the DOM");
    assert.ok(!$root.find(".view-about").length, "element was detached the DOM");
    assert.ok($root.find(".widget-template").length, "element is still in the DOM");

    var $template = engine.getViewTemplate("index");
    assert.ok($template.length);
    assert.ok(!$template.parent().length, "element was detached from the DOM");

});

QUnit.test("Find template", function(assert) {
    var $backup = $("#find-test").children();

    var engine = new ViewEngineTester({
        $root: $("#find-test"),
        device: {
            platform: "ios"
        }
    });

    var $template = engine.getViewTemplate("index");
    assert.ok($template.is(".view-index-ios"));

    $template = engine.getLayoutTemplate("index");
    assert.ok($template.is(".layout-index-ios"));

    $("#find-test").append($backup);
    engine = new ViewEngineTester({
        $root: $("#find-test"),
        device: {
            platform: "android"
        }
    });

    $template = engine.getViewTemplate("index");
    assert.ok($template.is(".view-index-android"));
    $template = engine.getViewTemplate("about");
    assert.ok($template.is(".view-about"));
});

QUnit.test("Lazy child components creation (T252500)", function(assert) {
    var engine = new ViewEngineTester({
        $root: $("#child-component-creation")
    });

    var component = engine._findComponent("index", "dxView");
    assert.ok(component);
    assert.ok(!component.element().find(".dx-content").length, "T252500");

    engine._findTemplate("index", "dxView");
    assert.ok(component);
    assert.ok(component.element().find(".dx-content").length);
});

QUnit.test("Missed template and disabled cache fired only DXError (T464679)", function(assert) {
    var ViewEngineCacheTester = ViewEngineTester.inherit({
        _isReleaseVersion: function() {
            return false;
        },
        _templateCacheEnabled: false
    });

    var engine = new ViewEngineCacheTester({
        $root: $("<div></div>")
    });

    assert.throws(function() {
        engine._findTemplate("", "");
    });
});

QUnit.test("Templates cache works", function(assert) {
    var executeCount,
        executeCounter = function() {
            executeCount++;
            return this.callBase.apply(this, arguments);
        },
        ViewEngineCountTester = ViewEngineTester.inherit({
            _loadExternalTemplates: executeCounter,
            _loadTemplatesFromMarkupCore: executeCounter,
            _processTemplates: executeCounter,
            _putTemplatesToCache: executeCounter,
            _isReleaseVersion: function() {
                return true;
            }
        }),
        storage = new MemoryKeyValueStorage();

    executeCount = 0;
    new ViewEngineCountTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "1"
    });
    assert.equal(executeCount, 4, "cache is not used first time");

    executeCount = 0;
    new ViewEngineCountTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "1"
    });
    assert.equal(executeCount, 0, "cache is used if load with same version");

    executeCount = 0;
    var engine = new ViewEngineCountTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "2"
    });
    assert.equal(executeCount, 4, "cache is not used if version has changed");
    var cache = JSON.parse(storage.storage[engine._templateCacheKey]);
    assert.ok(!cache["v_1"], "old cache is cleared with new version");
    assert.ok(cache["v_2"], "new cache is ok");
});

QUnit.test("Templates cache does not works on localhost domain", function(assert) {
    var storage = new MemoryKeyValueStorage();
    var engine = new ViewEngineTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "1"
    });

    assert.equal(!!engine._templateCacheEnabled, !/http:\/\/localhost/.test(location.href), "cache creation dependence from window href");
});

QUnit.test("Templates are alive if obtained from cache", function(assert) {
    var storage = new MemoryKeyValueStorage(),
        engine,
        ViewEngineCacheTester = ViewEngineTester.inherit({
            _isReleaseVersion: function() {
                return true;
            }
        });

    // init cache
    new ViewEngineCacheTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "1"
    });

    // get from cache
    engine = new ViewEngineCacheTester({
        $root: $("#child-component-creation"),
        templateCacheStorage: storage,
        templatesVersion: "1"
    });

    var component = engine._findComponent("index", "dxView");
    assert.ok(component);
    assert.ok(component.option("fromCache"));
    assert.ok(!component.element().find(".dx-content").length);

    engine._findTemplate("index", "dxView");
    assert.ok(component);
    assert.ok(component.element().find(".dx-content").length);
});

QUnit.test("Templates cache works for WinJS (T321856)", function(assert) {
    var executeCount,
        storage = new MemoryKeyValueStorage(),
        originalCreateMarkupFromString = domUtils.createMarkupFromString;

    var ViewEngineCacheTester = ViewEngineTester.inherit({
        _isReleaseVersion: function() {
            return true;
        }
    });

    domUtils.createMarkupFromString = function() {
        executeCount++;

        return originalCreateMarkupFromString.apply(this, arguments);
    };

    try {
        executeCount = 0;
        new ViewEngineCacheTester({
            $root: $("#child-component-creation"),
            templateCacheStorage: storage,
            templatesVersion: "1"
        });
        assert.equal(executeCount, 0, "cache is not used first time");

        executeCount = 0;
        new ViewEngineCacheTester({
            $root: $("#child-component-creation"),
            templateCacheStorage: storage,
            templatesVersion: "1"
        });
        assert.equal(executeCount, 2, "cache is used if load with same version");
    } finally {
        domUtils.createMarkupFromString = originalCreateMarkupFromString;
    }
});

QUnit.test("Find template considering orientation", function(assert) {
    var templateContext = new Component({
            orientation: "landscape"
        }),
        engine = new ViewEngineTester({
            $root: $("#find-test"),
            device: {
                platform: "ios"
            },
            templateContext: templateContext
        });

    var $template = engine.getViewTemplate("withOrientation");
    assert.ok($template.is(".view-with-orientation-ios.landscape"));

    templateContext.option("orientation", "portrait");

    $template = engine.getViewTemplate("withOrientation");
    assert.ok($template.is(".view-with-orientation-ios.portrait"));
});

QUnit.test("Duplicated view", function(assert) {
    assert.throws(function() {
        var engine = new ViewEngineTester({
            $root: $("#duplicated-view-test"),
            device: {
                platform: "ios"
            }
        });

        engine.getViewTemplate("index");
    });
});

QUnit.test("Apply layout - no layout", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#apply-layout") });
    var $viewTemplate = $("#view-without-layout > div").clone();
    engine._createComponents($viewTemplate);
    var $target = $("<div/>").appendTo($("body"));
    var viewInfo = {
        $viewTemplate: $viewTemplate,
        viewName: "index",
        model: {}
    };
    var $markup = engine._testRenderView(viewInfo, $target);
    assert.equal($markup.children().length, 1);
    assert.equal($markup.find(".markup").length, 1);
});

QUnit.test("Apply layout", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#apply-layout") });
    var $view = engine.getViewTemplate("index");
    var $layout = engine.getLayoutTemplate("default");
    var $render = engine.applyLayout($view, $layout);
    assert.equal($render.find(".header").length, 1);
    assert.equal($render.find(".footer").length, 1);
    assert.equal($render.find(".content-holder .content").length, 1);
    assert.equal($render.find(".rest-markup").length, 0);
});

QUnit.test("Apply layout with no view placeholders (B232074)", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#apply-layout-no-view-placeholders") });
    var $view = engine.getViewTemplate("index");
    var $layout = engine.getLayoutTemplate("default");
    var $render = engine.applyLayout($view, $layout);
    assert.equal($render.find(".content-holder .view-content").text(), "content");
});

QUnit.test("View placeholder content should override the existing layout's one (B231565)", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#override-layout-placeholder-content") });
    var $view = engine.getViewTemplate("index");
    var $layout = engine.getLayoutTemplate("default");
    var $render = engine.applyLayout($view, $layout);
    assert.equal($render.find(".header").text(), "view specific header");
});


QUnit.test("Apply layout - placeholder in view (B230507)", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#apply-layout-placeholder-in-view") });
    var $view = engine.getViewTemplate("index");
    var $layout = engine.getLayoutTemplate("default");
    var $render = engine.applyLayout($view, $layout);
    assert.equal($render.find(".header").length, 1);
    assert.equal($render.find(".footer").length, 1);
    assert.equal($render.find(".content-holder .content").length, 1);
    assert.equal($render.find(".content-holder .content-footer").length, 1);
});

QUnit.test("Apply layout - unused content is removed", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#apply-layout-placeholder-in-view-unused") });
    var $view = engine.getViewTemplate("index");
    var $layout = engine.getLayoutTemplate("default");
    var $render = engine.applyLayout($view, $layout);
    assert.equal($render.find(".view-content").length, 0);
});

QUnit.test("Render partial views", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#render-partial") });
    var $view = engine.getViewTemplate("index");
    assert.equal($view.find(".content").length, 1);
    assert.equal($view.find(".partial").length, 2);
    assert.equal($view.find(".partial .nested").length, 2);
});

QUnit.test("Render partial views (T147582)", function(assert) {
    var engine = new ViewEngineTester({ $root: $("#render-partial-T147582") });
    var $view = engine.getViewTemplate("home");
    assert.equal($view.find(".view2").length, 1);
});

QUnit.test("Render view complex", function(assert) {
    var engine = new ViewEngineTester({
        $root: $("#render-view-complex"),
        device: {
            platform: "ios"
        }
    });

    var model = { data: "data" };
    var viewInfo = { viewName: "index", model: model };

    // engine.afterViewSetup(viewInfo);


    var $markup = engine._testRenderView(viewInfo);

    assert.equal($markup.find(".header.ios").text(), "ios header");
    assert.equal($markup.find(".content").text(), "view content");
    assert.equal($markup.find(".footer").text(), "footer");

    assert.deepEqual(model, {
        data: "data"
    });
});

QUnit.test("Load dynamic view from markup", function(assert) {
    var engine = new ViewEngineTester({
        $root: $("#find-test"),
        device: {
            platform: "ios"
        }
    });

    var $templateMarkup = $("<div data-options=\"dxView: { name: 'home-link' }\">home</div>");
    engine.loadTemplates($templateMarkup);
    var $template = engine.getViewTemplate("home-link");

    assert.equal($template.text(), "home");
});

QUnit.test("Templates are filtered by device after loading a dynamic view", function(assert) {
    var engine = new ViewEngineTester({
            $root: $("#find-test"),
            device: {
                platform: "ios"
            }
        }),
        $templateMarkup = $("<div data-options=\"dxView: { name: 'index', platform: 'ios' }\">index</div>");

    engine.loadTemplates($templateMarkup);

    assert.throws(function() {
        engine.getViewTemplate("index");
    });
});

QUnit.test("Partial views are applied to a dynamically loaded view", function(assert) {
    var engine = new ViewEngineTester({
        $root: $("#simple-markup"),
        device: {
            platform: "ios"
        }
    });

    engine.loadTemplates($("#render-partial"));
    var $view = engine.getViewTemplate("index");

    assert.equal($view.find(".content").length, 1);
    assert.equal($view.find(".partial").length, 2);
    assert.equal($view.find(".partial .nested").length, 2);
});

QUnit.test("getViewTemplateInfo", function(assert) {
    var $backup = $("#find-test").children();

    var engine = new ViewEngineTester({
        $root: $("#find-test"),
        device: {
            platform: "ios"
        }
    });

    var component = engine.getViewTemplateInfo("index");

    assert.ok(component.element().is(".view-index-ios"));
    assert.equal(component.NAME, "dxView");

    $("#find-test").append($backup);
    engine = new ViewEngineTester({
        $root: $("#find-test"),
        device: {
            platform: "android"
        }
    });

    component = engine.getViewTemplateInfo("index");

    assert.ok(component.element().is(".view-index-android"));
});

QUnit.test("dxView getId", function(assert) {
    var templateContext = new Component({
            orientation: "landscape"
        }),
        engine = new ViewEngineTester({
            $root: $("#find-test"),
            device: {
                platform: "ios"
            },
            templateContext: templateContext
        });

    var component = engine.getViewTemplateInfo("withOrientation"),
        landscapeViewId = component.getId(),
        portraitViewId;

    assert.ok(landscapeViewId);

    templateContext.option("orientation", "portrait");
    component = engine.getViewTemplateInfo("withOrientation");
    portraitViewId = component.getId();
    assert.ok(portraitViewId);
    assert.ok(landscapeViewId !== portraitViewId);

    templateContext.option("orientation", "landscape");
    component = engine.getViewTemplateInfo("withOrientation");
    assert.equal(component.getId(), landscapeViewId);

    templateContext.option("orientation", "portrait");
    component = engine.getViewTemplateInfo("withOrientation");
    assert.equal(component.getId(), portraitViewId);
});
