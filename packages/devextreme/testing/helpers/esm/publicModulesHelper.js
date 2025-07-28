// ESM version of publicModulesHelper.js
// Auto-generated from UMD module

import $ from 'jquery';


// Execute factory function

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


// Backward compatibility
if(typeof window !== 'undefined') {
    window.DevExpress = window.DevExpress || {};
    window.DevExpress.testing = window.DevExpress.testing || {};
    window.DevExpress.testing.publicModulesHelper = {};
}

// ES6 exports
const publicModulesHelper = {};
export default publicModulesHelper;
export { publicModulesHelper };
