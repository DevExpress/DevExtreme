"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    angular = require("angular"),
    registerComponent = require("core/component_registrator"),
    Widget = require("ui/widget/ui.widget"),
    Editor = require("ui/editor/editor"),
    inflector = require("core/utils/inflector");

require("ui/tag_box");
require("integration/angular");

var ignoreAngularBrowserDeferTimer = function(args) {
    return args.timerType === "timeouts" && (args.callback.toString().indexOf("delete pendingDeferIds[timeoutId];") > -1 || args.callback.toString().indexOf("delete F[c];e(a)}") > -1);
};

QUnit.module("ngmodel editor integration", {
    beforeEach: function() {
        this.app = angular.module("app", ["dx"]);
        this.$fixtureElement = $("<div/>").attr("ng-app", "testApp").appendTo("#qunit-fixture");
        this.$container = $("<div/>").appendTo(this.$fixtureElement);
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        registerComponent("dxEditor", Editor.inherit({}));

        var MultiEditor = Editor.inherit({
            _setDefaultOptions: function() {
                this.callBase();

                this.option({
                    values: []
                });
            }
        });
        registerComponent("dxMultiEditor", MultiEditor);

        registerComponent("dxWidget", Widget);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach: function() {
        this.$fixtureElement.remove();

        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("ngmodel should pass current value to editor at initialization", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'bad' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    assert.equal($markup.dxEditor("option", "value"), "test", "value passed correctly");
});

QUnit.test("ng-model-controller should be pristine at initialization", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'custom' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    assert.equal($markup.controller("ngModel").$pristine, true, "model is pristine");
});

QUnit.test("ngmodel should pass value to editor if it's changed at runtime", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    var scope = $markup.scope();
    scope.$apply(function() {
        scope.value = "newTest";
    });

    assert.equal($markup.dxEditor("option", "value"), "newTest", "value passed correctly");
});

QUnit.test("ngmodel should pass complex value to editor if it's changed at runtime", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = [{ a: 'a' }, { a: 'a' }];
    }]);

    angular.bootstrap(this.$container, ["app"]);

    var scope = $markup.scope();
    scope.$apply(function() {
        scope.value[0].a = 'b';
    });

    assert.deepEqual($markup.dxEditor("option", "value"), [{ a: 'b' }, { a: 'a' }], "value passed correctly");
});

QUnit.test("watchers should be removed on disposing", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    var scope = $markup.scope();

    var watchersLen = scope.$$watchers.length;
    $markup.remove();
    assert.equal(scope.$$watchers.length, watchersLen - 1, "ngmodel watcher removed");
});

QUnit.test("editor should pass value to ngmodel if it's changed at runtime", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    $markup.dxEditor("option", "value", "newTest");

    var scope = $markup.scope();
    assert.equal(scope.value, "newTest", "value passed correctly");
});

QUnit.test("changing value from editor should set ngmodel dirty", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'custom' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    $markup.dxEditor("option", "value", "newTest");
    assert.equal($markup.controller("ngModel").$dirty, true, "model is dirty");
});

$.each(["dxTagBox"/*, "dxFileUploader"*/], function(_, widgetName) {
    QUnit.test("ngmodel should be bound with values option for " + widgetName, function(assert) {
        var $markup = $("<div></div>")
            .attr(inflector.dasherize(widgetName), "{}")
            .attr("ng-model", "value")
            .appendTo(this.$controller);

        this.app.controller("my-controller", ["$scope", function($scope) {
            $scope.value = [1];
        }]);

        angular.bootstrap(this.$container, ["app"]);
        assert.deepEqual($markup[widgetName]("option", "values"), [1], "value passed correctly");

        var scope = $markup.scope();
        scope.$apply(function() {
            scope.value = [1, 2];
        });
        assert.deepEqual($markup[widgetName]("option", "values"), [1, 2], "value passed correctly");

        $markup[widgetName]("option", "values", [1, 2, 3]);
        assert.deepEqual(scope.value, [1, 2, 3], "value passed correctly");
    });
});

$.each(["dxTagBox"/*, "dxFileUploader"*/], function(_, widgetName) {
    QUnit.test("ngmodel should be bound with values option for " + widgetName, function(assert) {
        var $markup = $("<div></div>")
            .attr(inflector.dasherize(widgetName), "{bindingOptions: {values: 'value'}}")
            .appendTo(this.$controller);

        this.app.controller("my-controller", ["$scope", function($scope) {
            $scope.value = [1];
        }]);

        angular.bootstrap(this.$container, ["app"]);
        assert.deepEqual($markup[widgetName]("option", "values"), [1], "value passed correctly");

        var scope = $markup.scope();
        scope.$apply(function() {
            scope.value = [1, 2];
        });
        assert.deepEqual($markup[widgetName]("option", "values"), [1, 2], "value passed correctly");

        $markup[widgetName]("option", "values", [1, 2, 3]);
        assert.deepEqual(scope.value, [1, 2, 3], "value passed correctly");
    });
});


QUnit.test("ngmodel should not bind value option to widget", function(assert) {
    var $markup = $("<div></div>")
        .attr("dx-widget", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);
    assert.equal($markup.dxWidget("option", "value"), undefined, "value passed correctly");

    var scope = $markup.scope();
    scope.$apply(function() {
        scope.value = "newTest";
    });
    assert.equal($markup.dxWidget("option", "value"), undefined, "value passed correctly");

    $markup.dxWidget("option", "value", "test");
    assert.equal(scope.value, "newTest", "value passed correctly");
});

QUnit.test("optionChanged should fired once when value is a plain object and use ngmodel binding", function(assert) {
    if(angular.version.minor < 3) {
        assert.expect(0);
        return;
    }

    var $markup = $("<div></div>")
        .attr("dx-editor", "{ onOptionChanged: optionChangedHandler }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    var spy = sinon.spy();

    this.app.controller("my-controller", ["$scope", function($scope) {
        $scope.value = { value: 1 };
        $scope.optionChangedHandler = spy;
    }]);

    angular.bootstrap(this.$container, ["app"]);

    spy.reset();

    var instance = $markup.dxEditor("instance");

    instance.option("value", { value: 2 });

    assert.equal(spy.callCount, 1, "optionChanged handler called once");
});

QUnit.test("editor without ng model should not fail", function(assert) {
    assert.expect(0);

    this.app.config(function($provide) {
        $provide.decorator("$exceptionHandler", ['$delegate', function($delegate) {
            return function(exception, cause) {
                $delegate(exception, cause);
                assert.ok(false, "error caught");
            };
        }]);
    });

    $("<div></div>")
        .attr("dx-editor", "{}")
        .appendTo(this.$controller);

    this.app.controller("my-controller", noop);

    angular.bootstrap(this.$container, ["app"]);
});
