import $ from 'jquery';
import 'generic_light.css!';
import 'ui/diagram';

import './diagramParts/mainToolbar.tests.js';
import './diagramParts/historyToolbar.tests.js';
import './diagramParts/viewToolbar.tests.js';
import './diagramParts/contextMenu.tests.js';
import './diagramParts/contextToolbox.tests.js';
import './diagramParts/propertiesPanel.tests.js';
import './diagramParts/toolbox.tests.js';
import './diagramParts/options.tests.js';
import './diagramParts/dataBinding.tests.js';
import './diagramParts/commandManager.tests.js';
import './diagramParts/clientSideEvents.tests.js';

QUnit.testStart(() => {
    const markup = '<style>.dxdi-control { width: 100%; height: 100%; overflow: auto; box-sizing: border-box; position: relative; }</style><div id="diagram"></div>';
    $('#qunit-fixture').html(markup);
});

