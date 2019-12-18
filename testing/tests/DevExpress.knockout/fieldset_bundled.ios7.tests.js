require('common.css!');
require('ios7_default.css!');

var testFieldsetsOnPlatform = require('./fieldsetParts/shared.js');
testFieldsetsOnPlatform('ios7.default', {
    testSwitchBaseline: false,
    testVerticalOffset: false,
    numberBoxAlign: 'left'
});
