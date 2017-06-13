"use strict";

var $ = require("jquery"),
    ajaxUtils = require("core/utils/ajax");

QUnit.module('ajax checking');

QUnit.test('сonversion of parameters to a url', function(assert) {
    var params = {
        $expand: "TestExpand",
        $top: 20,
        $skip: 0
    };

    $.ajax = function(options) {
        return options;
    };

    assert.strictEqual(ajaxUtils.sendRequest({ url: "odata.org", data: params }).url, "odata.org?%24expand=TestExpand&%24top=20&%24skip=0", "Url with parameters");
    assert.strictEqual(ajaxUtils.sendRequest({ url: "odata.org", data: {} }).url, "odata.org", "Empty data");

});
