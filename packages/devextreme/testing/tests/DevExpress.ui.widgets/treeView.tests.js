import 'ui/tree_view';

QUnit.testStart(function() {
    const markup = '<div id="treeView"></div>';

    $('#qunit-fixture').html(markup);
});

import './treeViewParts/animation.js';
import './treeViewParts/events.js';
import './treeViewParts/expresions.js';
import './treeViewParts/focusing.js';
import './treeViewParts/initialization.js';
import './treeViewParts/keyboardNavigation.js';
import './treeViewParts/lazyRendering.js';
import './treeViewParts/optionChanged.js';
import './treeViewParts/regression.js';
import './treeViewParts/rendering.js';
import './treeViewParts/selectAllMode.js';
import './treeViewParts/selectAllWithSelectNodesRecursiveFalse.js';
import './treeViewParts/selectNodesRecursiveTrue.js';
import './treeViewParts/treeview.size.tests.js';
import './treeViewParts/usageWithoutKeys.js';
