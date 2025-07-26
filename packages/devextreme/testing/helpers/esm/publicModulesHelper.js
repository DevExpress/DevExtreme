// ESM version of publicModulesHelper.js

import $ from 'jquery';

function runTests(namespaces, fields) {
    $.each(namespaces, function(namespaceName, namespace) {
        $.each(fields, function(fieldName, fieldValue) {
            QUnit.test(`'${namespaceName}' has field '${fieldName}'`, function(assert) {
                assert.notEqual(fieldValue, undefined, 'value present');
                assert.equal(namespace[fieldName], fieldValue, 'field present');
            });
        });
    });
}

// Backward compatibility
if(typeof window !== 'undefined') {
    window.DevExpress = window.DevExpress || {};
    window.DevExpress.testing = window.DevExpress.testing || {};
    window.DevExpress.testing.publicModulesHelper = runTests;
}

// ES6 exports
export default runTests;
export { runTests as publicModulesHelper };
