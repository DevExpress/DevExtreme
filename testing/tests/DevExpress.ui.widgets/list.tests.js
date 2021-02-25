import $ from 'jquery';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup =
        '<style>\
            .dx-scrollable-native-win8.dx-scrollable-native.dx-scrollview .dx-scrollable-container .dx-scrollview-content {\
                height: auto !important;\
            }\
            \
            .dx-list-item {\
                height: 40px;\
            }\
            \
            .dx-icon-remove {\
                width: 20px;\
            }\
            \
            .dx-inkripple {\
                position: absolute;\
                overflow: hidden;\
            }\
        </style>\
        \
        <div id="list"></div>\
        \
        <div id="templated-list">\
            <div data-options="dxTemplate: { name: \'item\' }">Item Template</div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

import './listParts/commonTests.js';
import './listParts/editingTests.js';
import './listParts/editingUITests.js';
import './listParts/dataSourceFromUrlTests.js';
import './listParts/liveUpdateTests.js';
