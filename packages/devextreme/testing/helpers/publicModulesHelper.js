import $ from 'jquery';

const __moduleExports = (function($) {
    return function(namespaces, fields) {
        $.each(namespaces, function(namespaceName, namespace) {
            $.each(fields, function(fieldName, fieldValue) {
                QUnit.test('\'' + namespaceName + '\' has field \'' + fieldName + '\'', function(assert) {
                    assert.notEqual(fieldValue, undefined, 'value present');
                    assert.equal(namespace[fieldName], fieldValue, 'field present');
                });
            });
        });
    };
})($);

window.testGlobalExports = __moduleExports;

export default __moduleExports;
