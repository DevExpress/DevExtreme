import $ from 'jquery';
import 'common.css!';
import 'ui/diagram';

import './diagramParts/dom.tests.js';
import './diagramParts/mainToolbar.tests.js';
import './diagramParts/historyToolbar.tests.js';
import './diagramParts/viewToolbar.tests.js';
import './diagramParts/contextMenu.tests.js';
import './diagramParts/propertiesPanel.tests.js';
import './diagramParts/toolbox.tests.js';
import './diagramParts/options.tests.js';
import './diagramParts/commandManager.tests.js';
import './diagramParts/clientSideEvents.tests.js';

export const SIMPLE_DIAGRAM = '{ "shapes": [{ "key":"107", "type":"Ellipsis", "text":"A new ticket", "x":1440, "y":1080, "width":1440, "height":720, "zIndex":0 }] }';

QUnit.testStart(() => {
    const markup = '<style>.dxdi-control { width: 100%; height: 100%; overflow: auto; box-sizing: border-box; position: relative; }</style><div id="diagram"></div>';
    $('#qunit-fixture').html(markup);
});

