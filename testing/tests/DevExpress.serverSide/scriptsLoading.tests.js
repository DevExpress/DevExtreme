"use strict";
var body = document.getElementsByTagName("body")[0];
body.className = "dx-viewport";
window.includeThemesLinks();

var Button = require("ui/button"),
    themes = require("ui/themes");


QUnit.module("Scripts loading");

QUnit.test("themes", function(assert) {
    var originalTheme = themes.current();

    assert.equal(themes.current(), "generic.light");
    assert.equal(body.classList.toString(), [
        "dx-viewport",
        "dx-device-desktop",
        "dx-device-generic",
        "dx-theme-generic",
        "dx-theme-generic-typography",
        "dx-color-scheme-light"
    ].join(" "));

    themes.current("android5.light");

    assert.equal(themes.current(), "android5.light");
    assert.equal(body.classList.toString(), [
        "dx-viewport",
        "dx-device-desktop",
        "dx-device-generic",
        "dx-theme-android5",
        "dx-theme-android5-typography",
        "dx-color-scheme-light"
    ].join(" "));

    themes.current(originalTheme);
});

QUnit.test("Button", function(assert) {
    assert.ok(Button);
});
