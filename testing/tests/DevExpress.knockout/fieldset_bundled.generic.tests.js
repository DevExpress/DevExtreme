require('generic_light.css!');

require('../../helpers/skipScpTest.js');

const testFieldsetsOnPlatform = require('./fieldsetParts/shared.js');
testFieldsetsOnPlatform('generic.light', { testSwitchBaseline: false });
