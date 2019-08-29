import $ from "jquery";
import { noop } from "core/utils/common";
import angular from "angular";
import registerComponent from "core/component_registrator";
import Widget from "ui/widget/ui.widget";
import Editor from "ui/editor/editor";
import inflector from "core/utils/inflector";

import "ui/tag_box";
import "integration/angular";

const ignoreAngularBrowserDeferTimer = args => {
    return args.timerType === "timeouts" && (args.callback.toString().indexOf("delete pendingDeferIds[timeoutId];") > -1 || args.callback.toString().indexOf("delete F[c];e(a)}") > -1);
};

QUnit.module("ngmodel editor integration", {
    beforeEach() {
        this.app = angular.module("app", ["dx"]);
        this.$fixtureElement = $("<div/>").attr("ng-app", "testApp").appendTo("#qunit-fixture");
        this.$container = $("<div/>").appendTo(this.$fixtureElement);
        this.$controller = $("<div></div>")
            .attr("ng-controller", "my-controller")
            .appendTo(this.$container);

        registerComponent("dxEditor", Editor.inherit({}));

        const MultiEditor = Editor.inherit({
            _getDefaultOptions() {
                return $.extend(
                    this.callBase(),
                    {
                        values: []
                    }
                );
            }
        });

        class TestEditor extends Editor {}

        registerComponent("dxTestEditor", TestEditor);

        registerComponent("dxMultiEditor", MultiEditor);

        registerComponent("dxWidget", Widget);

        QUnit.timerIgnoringCheckers.register(ignoreAngularBrowserDeferTimer);
    },
    afterEach() {
        this.$fixtureElement.remove();

        QUnit.timerIgnoringCheckers.unregister(ignoreAngularBrowserDeferTimer);
    }
});

QUnit.test("ngmodel should pass current value to editor at initialization", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'bad' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    assert.equal($markup.dxEditor("option", "value"), "test", "value passed correctly");
});

QUnit.test("ng-model-controller should be pristine at initialization", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'custom' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    assert.equal($markup.controller("ngModel").$pristine, true, "model is pristine");
});

QUnit.test("ngmodel should pass value to editor if it's changed at runtime", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    const scope = $markup.scope();
    scope.$apply(() => {
        scope.value = "newTest";
    });

    assert.equal($markup.dxEditor("option", "value"), "newTest", "value passed correctly");
});

QUnit.test("ngmodel should pass value to editor if it's changed", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-test-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    const scope = $markup.scope();

    scope.$apply(() => {
        scope.value = "newTest";
    });

    assert.equal($markup.dxTestEditor("option", "value"), "newTest", "value passed correctly");
});

QUnit.test("ngmodel should pass complex value to editor if it's changed at runtime", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = [{ a: 'a' }, { a: 'a' }];
    }]);

    angular.bootstrap(this.$container, ["app"]);

    const scope = $markup.scope();
    scope.$apply(() => {
        scope.value[0].a = 'b';
    });

    assert.deepEqual($markup.dxEditor("option", "value"), [{ a: 'b' }, { a: 'a' }], "value passed correctly");
});

QUnit.test("watchers should be removed on disposing", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    const scope = $markup.scope();

    const watchersLen = scope.$$watchers.length;
    $markup.remove();
    assert.equal(scope.$$watchers.length, watchersLen - 1, "ngmodel watcher removed");
});

QUnit.test("editor should pass value to ngmodel if it's changed at runtime", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    $markup.dxEditor("option", "value", "newTest");

    const scope = $markup.scope();
    assert.equal(scope.value, "newTest", "value passed correctly");
});

QUnit.test("changing value from editor should set ngmodel dirty", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-editor", "{ value: 'custom' }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);

    $markup.dxEditor("option", "value", "newTest");
    assert.equal($markup.controller("ngModel").$dirty, true, "model is dirty");
});

$.each(["dxTagBox"/* , "dxFileUploader" */], (_, widgetName) => {
    QUnit.test("ngmodel should be bound with values option for " + widgetName, function(assert) {
        const $markup = $("<div></div>")
            .attr(inflector.dasherize(widgetName), "{bindingOptions: {values: 'value'}}")
            .appendTo(this.$controller);

        this.app.controller("my-controller", ["$scope", $scope => {
            $scope.value = [1];
        }]);

        angular.bootstrap(this.$container, ["app"]);
        assert.deepEqual($markup[widgetName]("option", "values"), [1], "value passed correctly");

        const scope = $markup.scope();
        scope.$apply(() => {
            scope.value = [1, 2];
        });
        assert.deepEqual($markup[widgetName]("option", "values"), [1, 2], "value passed correctly");

        $markup[widgetName]("option", "values", [1, 2, 3]);
        assert.deepEqual(scope.value, [1, 2, 3], "value passed correctly");
    });
});


QUnit.test("ngmodel should not bind value option to widget", function(assert) {
    const $markup = $("<div></div>")
        .attr("dx-widget", "{}")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = "test";
    }]);

    angular.bootstrap(this.$container, ["app"]);
    assert.equal($markup.dxWidget("option", "value"), undefined, "value passed correctly");

    const scope = $markup.scope();
    scope.$apply(() => {
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

    const $markup = $("<div></div>")
        .attr("dx-editor", "{ onOptionChanged: optionChangedHandler }")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    const spy = sinon.spy();

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value = { value: 1 };
        $scope.optionChangedHandler = spy;
    }]);

    angular.bootstrap(this.$container, ["app"]);

    spy.reset();

    const instance = $markup.dxEditor("instance");

    instance.option("value", { value: 2 });

    assert.equal(spy.callCount, 1, "optionChanged handler called once");
});

QUnit.test("editor without ng model should not fail", function(assert) {
    assert.expect(0);

    this.app.config($provide => {
        $provide.decorator("$exceptionHandler", ['$delegate', $delegate => {
            return (exception, cause) => {
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

QUnit.test("editor with ng model and bindingOptions should not fail (T540101)", function(assert) {
    assert.expect(0);

    const $markup = $("<div></div>")
        .attr("dx-editor", "editorOptions")
        .attr("ng-model", "value")
        .appendTo(this.$controller);

    this.app.controller("my-controller", ["$scope", $scope => {
        $scope.value;
        $scope.editorOptions = {
            bindingOptions: {
                value: "value"
            }
        };
    }]);

    angular.bootstrap(this.$container, ["app"]);

    $markup.dxEditor("instance").option("value", 123);
});
