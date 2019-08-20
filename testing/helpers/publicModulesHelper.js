(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.testGlobalExports = module.exports = factory(require("jquery"));
        });
    } else {
        root.testGlobalExports = factory(root.jQuery);
    }
}(window, function($) {
    return function(namespaces, fields) {
        $.each(namespaces, function(namespaceName, namespace) {
            $.each(fields, function(fieldName, fieldValue) {
                QUnit.test("'" + namespaceName + "' has field '" + fieldName + "'", function(assert) {
                    assert.notEqual(fieldValue, undefined, "value present");
                    assert.equal(namespace[fieldName], fieldValue, "field present");
                });
            });
        });
    };
}));
