require('common.css!');
require('ios7_default.css!');

const testFieldsetsOnPlatform = require('./fieldsetParts/shared.js');
testFieldsetsOnPlatform('ios7.default', {
    testSwitchBaseline: false,
    testVerticalOffset: false,
    numberBoxAlign: 'left'
});
