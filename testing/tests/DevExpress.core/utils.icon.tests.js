var $ = require("jquery"),
    iconUtils = require("core/utils/icon");

QUnit.module('icon utils', {
    beforeEach: function() {
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
        }];
    }
});

QUnit.test('getImageSourceType', function(assert) {
    assert.expect(11);

    $.each(this.sourceArray, function(index, value) {
        assert.equal(iconUtils.getImageSourceType(value.source), value.result);
    });
});

QUnit.test('getImageContainer', function(assert) {
    $.each(this.sourceArray, function(index, value) {
        var $iconElement = iconUtils.getImageContainer(value.source);
        switch(value.result) {
            case "dxIcon":
                assert.ok($iconElement.hasClass("dx-icon"), "correct for " + value.result);
                assert.ok($iconElement.hasClass("dx-icon-" + value.source), "correct for " + value.result);
                assert.equal($iconElement.get(0).tagName, "I", "correct for " + value.result);
                break;
            case "fontIcon":
                assert.ok($iconElement.hasClass("dx-icon"), "correct for " + value.result);
                assert.ok($iconElement.hasClass(value.source), "correct for " + value.result);
                assert.equal($iconElement.get(0).tagName, "I", "correct for " + value.result);
                break;
            case "image":
                assert.ok($iconElement.hasClass("dx-icon"), "correct for " + value.result);
                assert.equal($iconElement.attr("src"), value.source, "correct for " + value.result);
                assert.equal($iconElement.get(0).tagName, "IMG", "correct for " + value.result);
                break;
            default:
                break;
        }
    });
});
